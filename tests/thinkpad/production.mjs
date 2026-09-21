import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
const base=process.env.LAB_URL||'http://127.0.0.1:4176';
const out=process.env.LAB_SHOTS||'docs/verification/phase-4/production';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
await context.addInitScript(()=>{
  Element.prototype.requestPointerLock=()=>Promise.reject(new Error('Disabled in verification'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};
  const monitored=new Set(['scroll','resize','hashchange','popstate','visibilitychange','focusin']);
  const active=new Map();const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener=function(type,fn,options){if((this===window||this===document)&&monitored.has(type)){const k=(this===window?'window:':'document:')+type; if(!active.has(k))active.set(k,new Set());active.get(k).add(fn);} return add.call(this,type,fn,options)};
  EventTarget.prototype.removeEventListener=function(type,fn,options){if(this===window||this===document)active.get((this===window?'window:':'document:')+type)?.delete(fn);return remove.call(this,type,fn,options)};
  window.__listenerSnapshot=()=>Object.fromEntries([...active].filter(([,set])=>set.size).map(([key,set])=>[key,set.size]));
});
const page=await context.newPage();const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const report={base,checks:[],errors,sceneBundles:[],keyboardOcclusions:[],listeners:[]};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name)};
try{
  for(const name of await fs.readdir('out/_next/static/chunks')){if(!name.endsWith('.js'))continue;const content=await fs.readFile(`out/_next/static/chunks/${name}`);if(content.includes('data-frames'))report.sceneBundles.push({name,bytes:content.length,gzipBytes:gzipSync(content).length});}
  await page.goto(base);await page.waitForTimeout(1000);
  check('Fresh production homepage does not fetch the renderer',!requests.some(url=>report.sceneBundles.some(b=>url.endsWith(b.name))));
  check('Homepage has no canvas',await page.locator('canvas').count()===0);
  const baseline=await page.evaluate(()=>window.__listenerSnapshot());report.listeners.push({home:baseline});
  await page.screenshot({path:`${out}/homepage-mobile.png`});
  for(const path of ['/blog','/blog/on-building-for-the-few-not-the-many','/blog/shipping-fast-without-breaking-trust','/sitemap.xml','/robots.txt']){const response=await page.goto(base+path);check(`${path} returns 200`,response.status()===200);}
  await page.goto(base+'/lab/thinkpad');await page.waitForSelector('[data-renderer="webgl"]');
  await page.screenshot({path:`${out}/lab-mobile.png`});
  await page.setViewportSize({width:1440,height:900});await page.screenshot({path:`${out}/lab-desktop.png`});await page.setViewportSize({width:390,height:844});
  // Keyboard sweep includes returning up through the bounded sticky stage.
  await page.reload();await page.waitForSelector('[data-renderer="webgl"]');
  for(let i=0;i<78;i++){
    await page.keyboard.press(i<58?'Tab':'Shift+Tab');
    const hit=await page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const r=e.getBoundingClientRect();if(!r.width||!r.height)return {label:e.textContent,why:'zero rect'};const x=Math.min(innerWidth-1,Math.max(0,r.left+r.width/2)),y=Math.min(innerHeight-1,Math.max(0,r.top+r.height/2));const top=document.elementFromPoint(x,y);if(top&&!e.contains(top)&&!top.contains(e))return {label:(e.textContent||e.getAttribute('aria-label')||e.tagName).slice(0,70),top:top.tagName,rect:{top:r.top,bottom:r.bottom}};return null;});if(hit)report.keyboardOcclusions.push(hit);
  }
  check('Forward and reverse keyboard focus is not covered',report.keyboardOcclusions.length===0);
  for(let i=0;i<3;i++){
    await page.locator('#sandbox a[href="/"]').click();await page.waitForURL(base+'/');await page.waitForTimeout(300);
    const counts=await page.evaluate(()=>window.__listenerSnapshot());report.listeners.push({iteration:i+1,home:counts});
    check(`Global listener counts return to homepage baseline ${i+1}`,JSON.stringify(counts)===JSON.stringify(baseline));
    await page.goto(base+'/lab/thinkpad#sandbox');await page.waitForSelector('[data-renderer="webgl"]');
  }
  for (const [label,expected] of [['Laptop power','host'],['Folder connected','mount'],['Song present','file']]) {
    await page.locator('#sandbox').getByLabel(label,{exact:false}).uncheck();
    await page.locator('#sandbox').getByRole('button',{name:'Request Paper Boats',exact:true}).click();
    check(`Sandbox ${label} control produces ${expected} evidence`,await page.locator('#sandbox [data-outcome]').getAttribute('data-outcome')===expected);
    if(expected==='host') { await page.locator('#sandbox').getByText('What this request tested',{exact:true}).click(); check('Powered-off snapshot does not claim running software',(await page.locator('#sandbox [data-outcome]').innerText()).includes('unavailable (host off)')); }
    await page.screenshot({path:`${out}/sandbox-${expected}-failure.png`});
    await page.locator('#sandbox').getByRole('button',{name:'Reset example',exact:true}).click();
  }
  await page.locator('#sandbox').getByLabel('Music service',{exact:false}).uncheck();await page.locator('#sandbox').getByRole('button',{name:'Request Paper Boats',exact:true}).click();
  const saved=await page.locator('#sandbox [data-outcome]').innerText();
  await page.locator('canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await page.waitForSelector('[data-renderer="lightweight"]');
  check('Context loss preserves modified state and saved request',saved===await page.locator('#sandbox [data-outcome]').innerText()&&!await page.locator('#sandbox').getByLabel('Music service',{exact:false}).isChecked());
  check('No unexpected production console errors',errors.length===0);
  // Block only the observed, built scene bundle, after controls have already saved a result.
  const failContext=await browser.newContext({viewport:{width:390,height:844}});const failedPage=await failContext.newPage();let release;
  const blocked=new Promise(resolve=>{release=resolve});
  await failedPage.route(`**/${report.sceneBundles[0].name}`,async route=>{await blocked;await route.abort('failed');});
  await failedPage.goto(base+'/lab/thinkpad#software',{waitUntil:'domcontentloaded'});
  await failedPage.locator('#software').getByRole('button',{name:'Stop music service',exact:true}).click();await failedPage.locator('#software').getByRole('button',{name:'Request Paper Boats',exact:true}).click();
  release();await failedPage.waitForSelector('[data-renderer="lightweight"]');
  check('Failed scene chunk preserves service edit and saved failure',await failedPage.locator('#software [data-outcome]').getAttribute('data-outcome')==='service');
  await failedPage.screenshot({path:`${out}/scene-chunk-failure.png`});await failContext.close();
}catch(e){report.failure=e.stack;process.exitCode=1;console.error(e)}finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close()}
