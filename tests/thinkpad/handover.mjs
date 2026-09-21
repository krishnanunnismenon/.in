import { chromium, webkit } from 'playwright-core';
import fs from 'node:fs/promises';
import os from 'node:os';
import assert from 'node:assert/strict';
const base=process.env.LAB_URL||'http://127.0.0.1:4176';
const root='docs/verification/phase-4';
const sceneNames=[];
for(const name of await fs.readdir('out/_next/static/chunks')) if(name.endsWith('.js') && (await fs.readFile(`out/_next/static/chunks/${name}`,'utf8')).includes('data-frames')) sceneNames.push(name);
const safety=async context=>context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(new Error('Disabled in verification'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};});
const webkitPath=process.env.WEBKIT_EXECUTABLE || webkit.executablePath();
for(const engine of (process.env.TEST_BROWSER ? [process.env.TEST_BROWSER] : ['chromium','webkit'])) {
 const out=`${root}/${engine}`;await fs.mkdir(out,{recursive:true});
 const report={engine,base,environment:{node:process.version,platform:os.platform(),release:os.release(),arch:os.arch()},checks:[],errors:[],homepageRequests:[],measurements:[]};
 let browser, page;
 const check=(name,condition)=>{assert.ok(condition,name);report.checks.push(name)};
 try{
  browser=await (engine==='chromium'?chromium:webkit).launch({headless:true,executablePath:engine==='chromium'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':webkitPath});report.browserVersion=browser.version();
  const context=await browser.newContext({viewport:{width:390,height:844}});await safety(context);
  page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  const onRequest=r=>report.homepageRequests.push(r.url());page.on('request',onRequest);
  await page.goto(base);await page.waitForTimeout(800);
  for(const link of await page.locator('a[href="/lab/thinkpad"]').all()){await link.scrollIntoViewIfNeeded();await link.hover();await page.waitForTimeout(600);await link.focus();}
  check('Initial, in-view, hover and focus do not fetch lab scene or route data',!report.homepageRequests.some(url=>sceneNames.some(name=>url.endsWith(name)) || new URL(url).pathname.startsWith('/lab/')));
  check('Homepage contact and public profiles match approved values',await page.locator('a[href="mailto:hello@krishnanunni.in"]').count()===1 && await page.locator('a[href="https://github.com/krishnanunnismenon"]').count()===1 && await page.locator('a[href="https://www.linkedin.com/in/krishnanunnii/"]').count()===1);
  page.off('request',onRequest);
  await page.locator('a[href="/lab/thinkpad"]').first().click();await page.waitForSelector('[data-renderer="webgl"]');
  check('Intentional homepage navigation produces actual WebGL',await page.locator('canvas').evaluate(c=>!!c.getContext('webgl2')));
  report.measurements.push(await page.evaluate(()=>({kind:'navigation and resources, local browser timing only',navigation:performance.getEntriesByType('navigation').map(n=>({duration:n.duration,domContentLoaded:n.domContentLoadedEventEnd})),resources:performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.js')).map(r=>({name:new URL(r.name).pathname,transferSize:r.transferSize,duration:r.duration}))})));
  const section=id=>page.locator(`#${id}`); const button=(id,name)=>section(id).getByRole('button',{name,exact:true});
  const jump=async id=>{await page.locator(`nav[aria-label="Lesson chapters"] a[href="#${id}"]`).click();await page.waitForTimeout(180)};
  const outcome=async(id,value)=>{await page.waitForFunction(({id,value})=>document.querySelector(`#${id} [data-outcome]`)?.getAttribute('data-outcome')===value,{id,value})};
  await page.getByRole('link',{name:'Follow a song',exact:false}).first().click();await button('song','Request Paper Boats').click();await outcome('song','response');
  await jump('software');await section('software').getByLabel('It stays on the laptop').check();await button('software','Stop music service').click();await button('software','Request Paper Boats').click();await outcome('software','service');
  await page.screenshot({path:`${out}/logical-failure.png`});
  await button('software','Restart music service').click();await section('software').getByText('What this request tested',{exact:true}).click();check('Old failure and saved stopped-service settings survive restart',(await section('software').innerText()).includes('service stopped') && await section('software [data-outcome]').getAttribute('data-outcome')==='service');
  await button('software','Make a new request').click();await outcome('software','response');
  await button('software','Replay saved request').click();await button('software','Reset example').click();await page.waitForTimeout(1700);check('Reset cancels replay and saved request',await section('software [data-outcome]').getAttribute('data-outcome')==='untested');
  await jump('folder');await button('folder','Replace service').click();await button('folder','Request Paper Boats').click();await outcome('folder','mount');await button('folder','Reconnect folder').click();await button('folder','Make a new request').click();await outcome('folder','response');
  await jump('away');await button('away','Request Paper Boats').click();await outcome('away','route');await button('away','Enable Tailscale example').click();await button('away','Make a new request').click();await outcome('away','response');await button('away','Bring phone home').click();
  await jump('repair');await button('repair','Request Paper Boats').click();await outcome('repair','mount');await section('repair').getByText('Inspect this example',{exact:true}).click();await button('repair','Reconnect folder').click();await button('repair','Make a new request').click();await outcome('repair','response');
  await jump('sandbox');await section('sandbox').getByLabel('Music service',{exact:false}).uncheck();await button('sandbox','Request Paper Boats').click();await outcome('sandbox','service');
  await jump('song');check('Skipping and resuming preserves independent chapter records',await section('song [data-outcome]').getAttribute('data-outcome')==='response' && await section('sandbox [data-outcome]').getAttribute('data-outcome')==='service');
  await jump('sandbox');await page.getByRole('button',{name:'Lightweight view',exact:true}).click();await button('sandbox','Make a new request').click();await outcome('sandbox','service');await button('sandbox','Review saved request').click();check('Lightweight review is usable',await section('sandbox [data-outcome] details').getAttribute('open')!==null);await page.screenshot({path:`${out}/lightweight.png`});await page.getByRole('button',{name:'Use 3D view',exact:true}).click();await page.waitForSelector('[data-renderer="webgl"]');
  check('Request-failure-repair-replace-remote-sandbox journey completed',true);
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);const left=await page.locator('[data-site-header]').evaluate(e=>e.getBoundingClientRect().left);await page.evaluate(()=>scrollTo(0,1000));await page.waitForTimeout(200);
   const header=await page.locator('[data-site-header]').evaluate(e=>({top:e.getBoundingClientRect().top,left:e.getBoundingClientRect().left}));
   check(`Header held without lateral movement at ${width}px`,Math.abs(header.top)<1&&Math.abs(header.left-left)<1);check(`No overflow at ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.setViewportSize({width:390,height:844});await page.addStyleTag({content:'[data-site-header], main p, main button, main label, main summary, main a { font-size:200% !important; }'});await jump('software');check('Doubled text keeps controls in document width',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`${out}/text-zoom.png`});
  await page.reload();await page.waitForSelector('[data-renderer="webgl"]');await jump('sandbox');await page.waitForTimeout(400);const frames=await page.locator('[data-renderer]').getAttribute('data-frames');await page.waitForTimeout(1000);check('Real renderer becomes idle',frames===await page.locator('[data-renderer]').getAttribute('data-frames'));
  await page.getByRole('link',{name:'Return home',exact:true}).click();await page.waitForURL(base+'/');await page.goBack();await page.waitForSelector('[data-renderer="webgl"]');check('Browser Back restores usable lab',await page.locator('h1').innerText()==='A laptop. A server.\nThe same machine.');
  for(const slug of ['on-building-for-the-few-not-the-many','shipping-fast-without-breaking-trust']){const response=await page.goto(base+'/blog/'+slug);check(`Direct essay ${slug}`,response.status()===200 && await page.locator('article').count()===1);}
  await page.goto(base+'/blog');check('Blog index preserves both article links',await page.locator('main a[href^="/blog/"]').count()===2);
  const unknown=await page.goto(base+'/missing-page');check('Unknown route has 404 and working home link',unknown.status()===404 && await page.getByRole('link',{name:'Return home',exact:true}).count()===1);await page.getByRole('link',{name:'Return home',exact:true}).click();await page.waitForURL(base+'/');
  await page.goto(base+'/lab/thinkpad');check('Completed lab canonical and social image exist',await page.locator('link[rel="canonical"]').getAttribute('href')==='https://krishnanunni.in/lab/thinkpad' && (await page.request.get(base+'/images/thinkpad-lab.png')).status()===200);
  // Stable states plus complete controls; no user-agent spoof claims about a real iPhone.
  const rm=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await safety(rm);const rp=await rm.newPage();await rp.goto(base+'/lab/thinkpad#software');await rp.waitForSelector('[data-renderer="webgl"]');await rp.locator('#software').getByRole('button',{name:'Stop music service',exact:true}).click();await rp.locator('#software').getByRole('button',{name:'Request Paper Boats',exact:true}).click();check('Reduced motion retains real WebGL and failure experiment',await rp.locator('#software [data-outcome]').getAttribute('data-outcome')==='service');await rp.screenshot({path:`${out}/reduced-motion.png`});await rm.close();
  check('No unexpected page errors',report.errors.length===0);await context.close();
 }catch(error){if(page){report.diagnostic=await page.evaluate(()=>({url:location.href,stage:document.querySelector('[data-renderer]')?.outerHTML.slice(0,1000),scroll:scrollY,body:document.body.innerText.slice(0,500)})).catch(()=>null);await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});}report.failure=error.stack;process.exitCode=1;console.error(engine,error)}finally{if(browser)await browser.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(engine,report.checks.length,'checks',report.failure||'passed')}
}
