// Bakery Shift conveyor (#281): play every level at phone + desktop size; options live in the scene,
// nothing overlaps, targets are >=44px, the shift ends with the usual coin reward, and no errors.
import { chromium } from 'playwright';
const BASE = process.env.APP_URL || process.env.BASE_URL || 'http://127.0.0.1:8765/';
const fails = [];
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const overlap = (a, b) => a.x < b.x + b.width - 1 && b.x < a.x + a.width - 1 && a.y < b.y + b.height - 1 && b.y < a.y + a.height - 1;
for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 768 }]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|ERR_|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForFunction(() => window.RikiSocial && window.RikiSocial.run);
  const coins0 = await page.evaluate(() => +localStorage.getItem('rickyCoins') || 0);
  await page.evaluate(() => window.RikiSocial.run('bakery'));
  let levels = 0;
  for (let guard = 0; guard < 400; guard++) {
    if (await page.locator('.z-end').count()) break;
    const s = await page.evaluate(() => window.RikiG6 && window.RikiG6.bk && window.RikiG6.bk());
    const grumpy = page.locator('#bkCh:not([hidden]) [data-ok="1"]');
    if (await grumpy.count()) { await grumpy.click(); await page.waitForTimeout(300); continue; }
    if (!s) { await page.waitForTimeout(200); continue; }
    if (s.level + 1 > levels) {
      levels = s.level + 1;
      // geometry checks once per level
      const g = await page.evaluate(() => {
        const r = el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; };
        return { opts: [...document.querySelectorAll('.bk-opts button')].map(r), mach: [...document.querySelectorAll('.bk-mach')].map(r), box: [...document.querySelectorAll('.bk-boxed')].map(r), scene: r(document.querySelector('.bk-scene')), pal: document.querySelectorAll('.bk-pal').length, vw: innerWidth };
      });
      const all = [...g.opts, ...g.mach, ...g.box];
      if (g.pal) fails.push(`${viewport.width} L${levels}: old palette still below the game`);
      if (!g.opts.length) fails.push(`${viewport.width} L${levels}: no options in scene`);
      for (const b of [...g.opts, ...g.mach]) if (b.width < 44 || b.height < 44) fails.push(`${viewport.width} L${levels}: target ${Math.round(b.width)}x${Math.round(b.height)} < 44px`);
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (overlap(all[i], all[j])) fails.push(`${viewport.width} L${levels}: items ${i}/${j} overlap`);
      if (g.scene.x + g.scene.width > g.vw + 2) fails.push(`${viewport.width} L${levels}: scene wider than screen`);
    }
    // make the next missing pick for the selected treat
    const keys = ['b', 'c', 'p', 'x'].slice(0, s.m);
    const order = s.order, cur = s.cur;
    let i = cur.findIndex((x, n) => keys.some(k => x[k] !== order[n][k]));
    if (i < 0) {
      const serve = page.locator('#bkServe');
      if (await serve.isEnabled()) { await serve.click(); await page.waitForTimeout(400); }
      else await page.waitForTimeout(250);
      continue;
    }
    if (i !== s.sel) { await page.locator(`.bk-boxed[data-i="${i}"]`).click(); await page.waitForTimeout(150); continue; }
    const k = keys.find(k => cur[i][k] !== order[i][k]);
    const kIdx = keys.indexOf(k);
    if (s.st !== kIdx) { await page.locator(`.bk-mach[data-st="${kIdx}"]`).click(); await page.waitForTimeout(150); continue; }
    await page.locator(`.bk-opts button[data-k="${k}"][data-v="${order[i][k]}"]`).click();
    await page.waitForTimeout(250);
    // the treat must sit on the belt, not on top of another treat
    const tr = await page.evaluate(() => document.querySelectorAll('.bk-treat').length);
    if (tr !== 1) fails.push(`${viewport.width}: ${tr} treats on the belt`);
  }
  if (!(await page.locator('.z-end').count())) fails.push(`${viewport.width}: shift did not finish (reached level ${levels})`);
  if (levels < 8) fails.push(`${viewport.width}: only ${levels} levels played`);
  const coins1 = await page.evaluate(() => +localStorage.getItem('rickyCoins') || 0);
  if (coins1 < coins0 + 2) fails.push(`${viewport.width}: coins not awarded (${coins0} → ${coins1})`);
  if (viewport.width === 390) await page.screenshot({ path: process.env.SHOT || '/tmp/bakery-end.png' });
  if (errors.length) fails.push(`${viewport.width}: errors ${errors.join(' | ')}`);
  await page.close();
}
await browser.close();
if (fails.length) { console.error('FAIL\n' + [...new Set(fails)].join('\n')); process.exit(1); }
console.log('PASS bakery conveyor (8 levels × 2 viewports, no overlaps, coins awarded)');
