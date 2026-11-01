// WebGL lifecycle regression: entering/leaving 3D studio games and the room editor
// many times must not grow live WebGL contexts, GPU resources or the JS heap.
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8765/';
const CYCLES = +(process.env.CYCLES || 30);
const IDS = ['cupcakes','cake','dressup','pets','boutique','aquarium','giftwrap','garden','claw','quest'];
const browser = await chromium.launch({ args: ['--enable-precise-memory-info'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const warnings = [], errors = [];
page.on('console', m => { if (/too many active webgl contexts|context lost/i.test(m.text())) warnings.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => {
  window.__ctx = []; window.__R = [];
  const g = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (t, ...a) { const c = g.call(this, t, ...a); if (c && /webgl/.test(t) && !c.__seen) { c.__seen = 1; __ctx.push(new WeakRef(c)); } return c; };
  // Capture three.js renderers as soon as the lazily loaded library is ready (capture phase runs before the app's onload).
  document.addEventListener('load', () => { if (window.THREE && !THREE.__wrapped) { THREE.__wrapped = 1; const W = THREE.WebGLRenderer; THREE.WebGLRenderer = function (...a) { const r = new W(...a); __R.push(new WeakRef(r)); return r; }; THREE.WebGLRenderer.prototype = W.prototype; } }, true);
});
await page.goto(BASE, { waitUntil: 'networkidle' });
const cdp = await page.context().newCDPSession(page);
const stat = async () => { await cdp.send('HeapProfiler.collectGarbage'); return page.evaluate(() => ({
  live: __ctx.map(r => r.deref()).filter(c => c && !c.isContextLost()).length,
  gpu: __R.map(r => r.deref()).filter(Boolean).reduce((n, r) => n + r.info.memory.geometries + r.info.memory.textures, 0),
  heapMB: Math.round(performance.memory.usedJSHeapSize / 1e6) })); };
let base = null; const fails = [];
for (let c = 0; c < CYCLES; c++) {
  const id = IDS[c % IDS.length];
  await page.evaluate(x => { menu(); window.RikiStudio.start(x); }, id); await page.waitForTimeout(450);
  await page.evaluate(() => { menu(); openWholeHouse3D(); }); await page.waitForTimeout(450);
  await page.evaluate(() => menu()); await page.waitForTimeout(100);
  if (c === IDS.length - 1) base = await stat(); // after every game has been opened once
}
const end = await stat();
console.log('after warm-up', JSON.stringify(base), 'after', CYCLES, 'cycles', JSON.stringify(end));
if (end.live > 8) fails.push(`too many live WebGL contexts: ${end.live}`);
if (end.gpu > base.gpu * 1.25 + 100) fails.push(`GPU resources grew: ${base.gpu} → ${end.gpu}`);
if (end.heapMB > base.heapMB + 40) fails.push(`JS heap grew: ${base.heapMB}MB → ${end.heapMB}MB`);
if (warnings.length) fails.push('WebGL warnings: ' + [...new Set(warnings)].join(' | '));
if (errors.length) fails.push('page errors: ' + [...new Set(errors)].join(' | '));
await browser.close();
if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log(`PASS WebGL lifecycle (${CYCLES} enter/exit cycles)`);
