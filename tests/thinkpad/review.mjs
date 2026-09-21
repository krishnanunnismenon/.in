import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
const base=process.env.LAB_URL||'http://127.0.0.1:4175';
const out=process.env.LAB_SHOTS||'docs/verification/phase-4/before';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();const requests=[];page.on('request',r=>requests.push(r.url()));
await page.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(new Error('Disabled in verification'));Element.prototype.setPointerCapture=()=>{};});
const report={base,requests,views:[]};
try {
 for(const width of [390,320,768,1440]){
  await page.setViewportSize({width,height:width===1440?900:844});
  await page.goto(base);await page.locator('a[href="/lab/thinkpad"]').first().scrollIntoViewIfNeeded();await page.locator('a[href="/lab/thinkpad"]').first().hover();await page.waitForTimeout(1200);
  await page.screenshot({path:`${out}/home-${width}.png`});
  await page.goto(base+'/lab/thinkpad');await page.waitForSelector('[data-renderer="webgl"]');await page.screenshot({path:`${out}/physical-${width}.png`});
  await page.locator('#software').getByRole('button',{name:'Stop music service',exact:true}).click();await page.locator('#software').getByRole('button',{name:'Request Paper Boats',exact:true}).click();await page.screenshot({path:`${out}/logical-failure-${width}.png`});
  report.views.push(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,header:document.querySelector('header').getBoundingClientRect().toJSON(),renderer:document.querySelector('[data-renderer]').getAttribute('data-renderer')})));
 }
} finally {await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close()}
