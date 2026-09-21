/** Explicitly requested browser verification. Does not connect to a real homelab. */
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.LAB_URL || 'http://localhost:3000';
const out = process.env.LAB_SHOTS || 'docs/verification/phase-3/browser';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.SCROLLCRAFT_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const evidence = { base, checks: [], limitations: ['No physical iOS/Android, real pinch zoom or screen-reader certification.'], errors: [] };
const check = (name, value = true) => { assert.ok(value, name); evidence.checks.push(name); };
const safe = async context => context.addInitScript(() => {
  Element.prototype.requestPointerLock = () => Promise.reject(new Error('Disabled during verification'));
  Element.prototype.setPointerCapture = () => {}; Element.prototype.releasePointerCapture = () => {};
  Document.prototype.exitPointerLock = () => {};
});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
await safe(context);
const page = await context.newPage();
page.on('pageerror', e => evidence.errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') evidence.errors.push(m.text()); });
const stage = page.locator('[data-active-chapter]');
const chapter = id => page.locator(`#${id}`);
const button = (id, name) => chapter(id).getByRole('button', { name, exact: true });
const jump = async id => { await page.evaluate(id => { location.hash = id; }, id); await page.waitForTimeout(250); };
const outcome = async (id, expected) => { await page.waitForFunction(({ id, expected }) => document.querySelector(`#${id} [data-outcome]`)?.getAttribute('data-outcome') === expected, { id, expected }); };
try {
  await page.goto(`${base}/lab/thinkpad`);
  await page.waitForSelector('[data-renderer="webgl"]');
  check('Real WebGL loaded on 390×844');
  await page.screenshot({ path: `${out}/mobile-opening.png` });
  await jump('song'); await button('song', 'Request Paper Boats').click(); await outcome('song', 'response');
  await jump('software'); await chapter('software').getByLabel('It stays on the laptop', { exact: true }).check();
  await button('software', 'Stop music service').click(); await button('software', 'Request Paper Boats').click(); await outcome('software', 'service');
  check('Signature: stopped service, powered host, intact song, NEW request fails', (await chapter('software').innerText()).includes('song intact'));
  await page.screenshot({ path: `${out}/mobile-peak-failed.png` });
  await button('software', 'Restart music service').click(); await outcome('software', 'service');
  check('Changing current config does not rewrite saved request');
  await button('software', 'Make a new request').click(); await outcome('software', 'response');
  await button('software', 'Replay saved request').click(); await button('software', 'Reset example').click();
  await page.waitForTimeout(1800); await outcome('software', 'untested'); check('Reset during replay cancels stale playback/result');
  await jump('folder'); await button('folder', 'Replace service').click(); await button('folder', 'Request Paper Boats').click(); await outcome('folder', 'mount');
  await button('folder', 'Reconnect folder').click(); await button('folder', 'Make a new request').click(); await outcome('folder', 'response');
  check('Replacement preserves file and reconnect restores access');
  await jump('away'); await button('away', 'Bring phone home').click(); check('Location control labels match their action', (await chapter('away').innerText()).includes('Phone at home')); await button('away', 'Take phone away').click(); await button('away', 'Request Paper Boats').click(); await outcome('away', 'route');
  await button('away', 'Enable Tailscale example').click(); await button('away', 'Make a new request').click(); await outcome('away', 'response');
  check('Remote route absent then permitted private route succeeds');
  await jump('repair'); await button('repair', 'Request Paper Boats').click(); await outcome('repair', 'mount');
  await chapter('repair').getByText('Inspect this example', { exact: true }).click(); await button('repair', 'Reconnect folder').click(); await button('repair', 'Make a new request').click(); await outcome('repair', 'response');
  check('Inspectable bounded fault repaired');
  await jump('sandbox'); await chapter('sandbox').getByLabel('Music service', { exact: false }).uncheck(); await button('sandbox', 'Request Paper Boats').click(); await outcome('sandbox', 'service');
  await page.getByRole('button', { name: 'Lightweight view', exact: true }).click(); await outcome('sandbox', 'service');
  await button('sandbox', 'Make a new request').click(); await outcome('sandbox', 'service');
  check('Lightweight view preserves settings and evaluates identically');
  await button('sandbox', 'Review saved request').click(); check('Lightweight review opens meaningful saved settings',await chapter('sandbox').locator('[data-outcome] details').getAttribute('open')!==null);
  await page.getByRole('button', { name: 'Use 3D view', exact: true }).click(); await page.waitForSelector('[data-renderer="webgl"]');
  await chapter('sandbox').getByLabel('Music service', { exact: false }).check();
  await button('sandbox', 'Turn display off').click(); await button('sandbox', 'Make a new request').click(); await outcome('sandbox', 'response');
  check('Display off does not power down host');
  await chapter('sandbox').getByLabel('Phone away from home').check(); await chapter('sandbox').getByLabel('Tailscale connection available').check(); await chapter('sandbox').getByLabel('Private access permitted').uncheck();
  await button('sandbox', 'Make a new request').click(); await outcome('sandbox', 'permission');
  await chapter('sandbox').getByLabel('Working connectivity').uncheck(); await button('sandbox', 'Make a new request').click(); await outcome('sandbox', 'connection');
  check('Earliest connectivity failure precedes permission');
  await jump('song'); await jump('folder'); check('Chapter edits persist after fast/reverse jumps', (await chapter('folder').innerText()).includes('Service version 2'));
  await page.goBack(); await page.waitForTimeout(200); check('Browser Back restores chapter anchor', page.url().endsWith('#song'));
  await page.goto(`${base}/lab/thinkpad#away`); await page.waitForSelector('[data-renderer="webgl"]'); await page.waitForTimeout(200);
  check('Direct/reloaded chapter anchor selects its preset', (await stage.getAttribute('data-active-chapter')) === 'away');
  // Every chapter at entry/midpoint/exit, with real rendered-state readings.
  const positions = [];
  for (const id of ['opening','song','software','folder','away','repair','sandbox']) {
    for (const fraction of [0,.5,.95]) {
      await page.evaluate(({id,fraction}) => { const el=document.getElementById(id); const top=el.getBoundingClientRect().top+scrollY; const st=document.querySelector('[data-sc-stage]').offsetHeight; scrollTo(0,top+el.offsetHeight*fraction-st-24); }, {id,fraction});
      await page.waitForTimeout(100);
      positions.push({id,fraction,active:await stage.getAttribute('data-active-chapter'),paint:await stage.getAttribute('data-sc-verify-state')});
    }
  }
  await fs.writeFile(`${out}/chapter-positions.json`, JSON.stringify(positions,null,2)); check('All chapters sampled entry/midpoint/exit');
  for (const [width,height] of [[320,640],[360,640],[768,1024],[844,390],[1440,900]]) {
    await page.setViewportSize({width,height}); await page.goto(`${base}/lab/thinkpad#folder`); await page.waitForSelector('[data-renderer="webgl"]');
    check(`No horizontal overflow at ${width}×${height}`, await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:`${out}/viewport-${width}x${height}.png`});
  }
  await page.setViewportSize({width:390,height:844}); await page.goto(`${base}/lab/thinkpad#song`); await page.waitForSelector('[data-renderer="webgl"]');
  const cdp = await context.newCDPSession(page); const beforeScroll=await page.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:230}]});
  for(let y=210;y>=100;y-=22) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await page.waitForTimeout(250);
  check('Emulated native swipe over canvas scrolls document',await page.evaluate(()=>scrollY)>beforeScroll);
  // Double text size mimics text-only zoom; real OS/browser zoom remains a separate manual check.
  await page.addStyleTag({content:'main p, main button, main label, main summary, main a {font-size:200% !important}'});
  check('Text enlargement does not produce horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${out}/text-enlargement.png`});
  await page.reload(); await page.waitForSelector('[data-renderer="webgl"]');
  await page.evaluate(()=>scrollTo(0,0)); await page.keyboard.press('Tab');
  check('Keyboard focus visible',await page.evaluate(()=>{const e=document.activeElement;return e && getComputedStyle(e).outlineStyle!=='none'}));
  await jump('sandbox'); await page.waitForTimeout(400); const idle=await stage.getAttribute('data-frames'); await page.waitForTimeout(1000);
  check('On-demand renderer sleeps when idle', idle===await stage.getAttribute('data-frames'));
  for(let i=0;i<3;i++) { await chapter('sandbox').getByRole('link',{name:'Return home',exact:true}).click(); await page.waitForURL(`${base}/`); check(`Route teardown removes canvas and readiness ${i+1}`,await page.evaluate(()=>!document.querySelector('canvas')&&!document.documentElement.classList.contains('sc-ready'))); await page.goto(`${base}/lab/thinkpad#sandbox`); await page.waitForSelector('[data-renderer="webgl"]'); }
  // Context loss is an actual WebGL failure, not CSS hiding a working canvas.
  await page.locator('canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForSelector('[data-renderer="lightweight"]'); await button('sandbox','Request Paper Boats').click(); await outcome('sandbox','response');
  check('WebGL context loss keeps useful experiment');
  await page.screenshot({path:`${out}/context-loss-fallback.png`});
  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await safe(reduced);
  const rp=await reduced.newPage();await rp.goto(`${base}/lab/thinkpad#software`);await rp.waitForSelector('[data-renderer="webgl"]');
  await rp.locator('#software').getByRole('button',{name:'Stop music service',exact:true}).click();await rp.locator('#software').getByRole('button',{name:'Request Paper Boats',exact:true}).click();
  check('Reduced motion retains complete experiment',await rp.locator('#software [data-outcome]').getAttribute('data-outcome')==='service');
  await rp.screenshot({path:`${out}/reduced-peak.png`});await reduced.close();
  const unsupported=await browser.newContext({viewport:{width:390,height:844}});await safe(unsupported);
  await unsupported.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return kind==='webgl2'||kind==='webgl'?null:original.call(this,kind,...args)};});
  const up=await unsupported.newPage();await up.goto(`${base}/lab/thinkpad#sandbox`);await up.waitForSelector('[data-renderer="lightweight"]');await up.locator('#sandbox').getByRole('button',{name:'Request Paper Boats',exact:true}).click();
  check('Unsupported WebGL fallback computes results',await up.locator('#sandbox [data-outcome]').getAttribute('data-outcome')==='response');await unsupported.close();
  const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(`${base}/lab/thinkpad`);
  check('All questions and explanations server rendered',await np.locator('h2').count()===7 && await np.locator('#folder details').count()>0);await nojs.close();
  check('No unexpected browser errors',evidence.errors.length===0);
} catch(e) { evidence.failure=e.stack; console.error(e); process.exitCode=1; }
finally { await fs.writeFile(`${out}/results.json`,JSON.stringify(evidence,null,2)); console.log(JSON.stringify(evidence,null,2));await browser.close(); }
