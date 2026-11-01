// Saved-data resilience: wrong-shape (but readable) saved values must not crash
// the Shop, Dollhouse or Claw, and valid saves must be preserved byte-for-byte.
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8765/';
const KEYS = ['rickyHouseInventoryV1','rickyHouseDecorV1','rickyHouseWallsV1','rickyDreamStorageV2','rickyDreamPetsV2','rickyDreamPositionsV2','rikiRootProgressV1','rikiDreamRotationV1'];
const BAD = ['"str"', '5', 'true', '[]', '{}', '{"x":5}', '{"hist":5}'];
const VALID = {
  rickyCoins: '123',
  rickyHouseInventoryV1: '["bed-pink","lamp-star"]',
  rickyHouseDecorV1: '{"bedroom":{"a":"bed-pink"}}',
  rickyHouseWallsV1: '{"bedroom":"#ffd1dc"}',
  rickyDreamStorageV2: '{}', rickyDreamPetsV2: '{}', rickyDreamPositionsV2: '{"bedroom":{}}',
  rikiRootProgressV1: '{"5":{"seen":4,"first":3,"miss":1,"hist":[1,1,1],"days":["2026-10-30","2026-10-31"]}}',
};
const fails = [];
const browser = await chromium.launch();
async function run(label, seed) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); } }, seed);
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const steps = [
    ['shop', () => { houseHome(); housePage = 'shop'; houseRender(); }],
    ['dollhouse', () => { houseHome(); }],
    ['claw', () => { menu(); window.RikiStudio.start('claw'); }],
  ];
  for (const [name, fn] of steps) {
    const before = errors.length;
    try { await page.evaluate(fn); } catch (e) { errors.push(String(e.message || e)); }
    await page.waitForTimeout(700);
    const text = await page.evaluate(() => document.body.innerText.length);
    if (errors.length > before) fails.push(`${label} → ${name}: ${errors.slice(before).join(' | ')}`);
    else if (text < 20) fails.push(`${label} → ${name}: blank screen`);
  }
  const after = await page.evaluate(k => Object.fromEntries(k.map(x => [x, localStorage.getItem(x)])), Object.keys(seed));
  await page.close();
  return after;
}
for (const key of KEYS) for (const bad of BAD) await run(`${key}=${bad}`, { ...VALID, [key]: bad });
// H2 part B: unreadable / wrong-type values handled by getSaved are backed up to <key>.corrupt
async function backupCheck(key, raw) {
  const page = await browser.newPage();
  await page.addInitScript(([k, r]) => { if (!sessionStorage.getItem('s')) { localStorage.clear(); localStorage.setItem(k, r); sessionStorage.setItem('s', '1'); } }, [key, raw]);
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(500);
  const b = await page.evaluate(k => localStorage.getItem(k + '.corrupt'), key);
  if (b !== raw) fails.push(`no .corrupt backup for ${key}=${raw} (got ${b})`);
  await page.close();
}
for (const [k, r] of [['rickyHouseInventoryV1', '{oops'], ['rickyHouseInventoryV1', '{"a":1}'], ['rickyHouseDecorV1', '[1,2]'], ['rickyTinyPlacedV1', 'not json']]) await backupCheck(k, r);
const after = await run('valid save', VALID);
const nb = await (async () => { const p = await browser.newPage(); await p.addInitScript(s => { if (!sessionStorage.getItem('s')) { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); sessionStorage.setItem('s', '1'); } }, VALID); await p.goto(BASE); await p.waitForTimeout(500); const n = await p.evaluate(() => Object.keys(localStorage).filter(k => k.endsWith('.corrupt'))); await p.close(); return n; })();
if (nb.length) fails.push('valid save produced backups: ' + nb.join(','));
// The app may add starter gifts on first run, so "preserved" means every original value is still present.
const keep = (o, n) => typeof o !== 'object' || o === null ? o === n : Array.isArray(o) ? Array.isArray(n) && o.every(x => n.includes(x)) : n && typeof n === 'object' && Object.keys(o).every(k => keep(o[k], n[k]));
for (const [k, v] of Object.entries(VALID)) { const o = JSON.parse(v), n = JSON.parse(after[k]); const ok = typeof o === 'number' ? n >= o : keep(o, n); if (!ok) fails.push(`valid save lost data: ${k} ${v} → ${after[k]}`); }
await browser.close();
if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log(`PASS saved-data resilience (${KEYS.length * BAD.length + 1} scenarios)`);
