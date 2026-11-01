import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try {
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:800},serviceWorkers:'block'});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   if(sessionStorage.getItem('__math_ci_seeded'))return;
   sessionStorage.setItem('__math_ci_seeded','1');
   localStorage.setItem('rikiGuestDemo500GrantedV1','yes');
   localStorage.setItem('rickyCoins','100');
   localStorage.setItem('rickyHouseInventoryV1','["bed"]');
   localStorage.setItem('rikiRootProgressV1','{"testRoot":42}');
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RikiMath&&!!document.getElementById('hubMath'),{timeout:30000});
  const nav=await page.evaluate(()=>{
   const ids=['hubHomeBtn','gamesShortcut','rkMathShortcut','houseShortcut','hubSocialBtn','rkDollsShortcut','rkShopShortcut'];
   return ids.map(id=>{const x=document.getElementById(id);const r=x?.getBoundingClientRect();return {id,visible:!!r&&r.width>=40&&r.height>=40&&getComputedStyle(x).display!=='none',left:r?.left,right:r?.right};});
  });
  assert.ok(nav.every(x=>x.visible),JSON.stringify(nav));
  assert.ok(nav.every(x=>x.left>=-1&&x.right<=width+1),'Top tabs must fit viewport: '+JSON.stringify(nav));
  const preserved={bed:await page.evaluate(()=>localStorage.getItem('rickyHouseInventoryV1')),roots:await page.evaluate(()=>localStorage.getItem('rikiRootProgressV1'))};
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathRecipe').waitFor();
  assert.equal(await page.locator('.rk-math-choices button').count(),3);
  assert.equal(await page.locator('header .top').count(),0);
  // Recipe Studio: count and submit the actual multiplication shown on screen.
  await page.locator('#rkMathRecipe').click();
  let eq=await page.locator('.rk-math-equation').innerText();
  let m=eq.match(/(\d+)\s*×\s*(\d+)/);assert.ok(m,'Recipe displays a real multiplication fact');
  assert.equal(await page.locator('.rk-kitchen-scene').getAttribute('data-recipe-stage'),'prep');
  assert.equal(await page.locator('.rk-kitchen-tray.filled').count(),0);
  assert.equal(await page.locator('#rkMathInput').count(),0,'recipe must build trays before answering');
  for(let i=0;i<Number(m[1]);i++)await page.locator('#rkKitchenFill').click();
  assert.equal(await page.locator('.rk-kitchen-tray.filled').count(),Number(m[1]));
  await page.locator('#rkMathInput').fill(String(Number(m[1])*Number(m[2])));
  await page.locator('#rkMathForm button').click();
  await page.locator('#rkKitchenBake').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'100','no reward until order is served');
  await page.locator('#rkKitchenBake').click();
  await page.locator('#rkKitchenServe').click();
  await page.locator('#rkMathNext').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'106','served correct order gives 6 coins exactly once');
  assert.match(await page.locator('#rkMathStatus').innerText(),/Correct/);
  // Array Builder: explicit row construction before the number answer becomes available.
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathArray').click();
  eq=await page.locator('.rk-math-equation').innerText();m=eq.match(/(\d+)\s*×\s*(\d+)/);assert.ok(m);
  assert.equal(await page.locator('#rkMathInput').count(),0,'array requires building rows');
  for(let n=0;n<Number(m[1]);n++)await page.locator('#rkMathBuild').click();
  await page.locator('#rkMathInput').fill(String(Number(m[1])*Number(m[2])));
  await page.locator('#rkMathForm button').click();
  await page.locator('#rkMathNext').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'112','array rewards correct answer');
  // Match: four distinct equations and products, tap the actual correct pairs.
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathMatch').click();
  for(let i=0;i<4;i++){
   const fact=page.locator('.rk-math-matchcard[data-fact]:not([disabled])').first();
   const text=await fact.innerText(),parts=text.match(/(\d+)\s*×\s*(\d+)/);assert.ok(parts);
   const answer=Number(parts[1])*Number(parts[2]);
   await fact.click();
   await page.locator('.rk-math-matchcard[data-answer]:not([disabled])').filter({hasText:new RegExp('^'+answer+'$')}).click();
  }
  await page.locator('#rkMathReplay').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'136','4 matches give 24 coins');
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'null'));
  assert.ok(progress.correct>=6&&progress.completed.match>=1,'Practice progress saved');
  assert.deepEqual(await page.evaluate(()=>({bed:localStorage.getItem('rickyHouseInventoryV1'),roots:localStorage.getItem('rikiRootProgressV1')})),preserved);
  // The requested Dollhouse tab must work from within multiplication, not only home.
  await page.locator('#houseShortcut').click();
  await page.locator('#dreamRoom').waitFor({timeout:25000});
  assert.ok(await page.locator('.rk-math').count()===0,'Dollhouse is a separate section');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RikiMath,{timeout:20000});
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'136','coins persist reload');
  assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'null')))?.completed?.match>=1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  assert.equal(overflow,false,'No horizontal page overflow at '+width+'px');
  await page.locator('#rkMathShortcut').click();
  await page.locator('.rk-math').screenshot({path:'math-arcade-'+width+'.png'});
  assert.deepEqual(errors,[],'No browser JS errors: '+JSON.stringify(errors));
  console.log('PASS '+width+'px nav seven destinations, Recipe, Array, Fact Match, coins, progress, Dollhouse and reload');
  await context.close();
 }
}finally{await browser.close()}
