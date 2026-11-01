import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try{
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:800},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   if(sessionStorage.getItem('rkRecipeSeed'))return;
   sessionStorage.setItem('rkRecipeSeed','yes');
   localStorage.setItem('rikiGuestDemo500GrantedV1','yes');
   localStorage.setItem('rickyCoins','150');
   localStorage.setItem('rickyHouseInventoryV1','["heartkitchencabinet"]');
   localStorage.setItem('rikiRootProgressV1','{"testRoot":9}');
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RikiMath,{timeout:25000});
  const originalSave=await page.evaluate(()=>({
   inventory:localStorage.getItem('rickyHouseInventoryV1'),
   roots:localStorage.getItem('rikiRootProgressV1')
  }));
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathRecipe').click();
  let wrongDone=false;
  for(let order=0;order<5;order++){
   const equation=await page.locator('.rk-math-equation').innerText();
   const match=equation.match(/(\d+)\s*×\s*(\d+)/);
   assert.ok(match,'order shows a multiplication equation');
   const a=Number(match[1]),b=Number(match[2]),total=a*b;
   assert.equal(await page.locator('#rkKitchenFill,#rkMathBuild,.rk-kitchen-tray').count(),0,'no tray-building or counting gate');
   assert.equal(await page.locator('.rk-math-serve-choice').count(),4,'4 choices immediately available');
   assert.equal(await page.locator('[data-math-answer="'+total+'"]').count(),1,'one correct choice');
   if(!wrongDone){
    const wrongValue=await page.locator('.rk-math-serve-choice').evaluateAll((buttons,total)=>Number(buttons.find(x=>Number(x.dataset.mathAnswer)!==total)?.dataset.mathAnswer),total);
    await page.locator('[data-math-answer="'+wrongValue+'"]').click();
    assert.match(await page.locator('#rkMathStatus').innerText(),/Try another/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'150','wrong choice earns no coins');
    wrongDone=true;
   }
   if(order===0)await page.locator('.rk-math-customer-panel').screenshot({path:'recipe-prep-'+width+'.png'});
   await page.locator('[data-math-answer="'+total+'"]').click();
   assert.equal(await page.locator('.rk-math-order-scene').getAttribute('data-solved'),'true','customer receives the correct order');
   assert.equal(await page.evaluate(()=>Number(localStorage.getItem('rickyCoins'))),150+(order+1)*6,'exactly one award per correctly served order');
   assert.equal(await page.locator('.rk-math-serve-choice').count(),0,'choices removed after correct order');
   if(order===0)await page.locator('.rk-math-customer-panel').screenshot({path:'recipe-served-'+width+'.png'});
   await page.locator('#rkMathNext').click();
  }
  await page.locator('#rkMathReplay').waitFor();
  assert.match(await page.locator('.rk-math-done').innerText(),/5 correct/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'180');
  const stats=await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'{}'));
  assert.equal(stats.completed.recipe,1,'whole recipe game completed once');
  assert.equal(stats.correct,5,'each correctly served order recorded once');
  assert.equal(stats.attempts,6,'one wrong attempt plus five correct');
  const safety=await page.evaluate(()=>({inventory:localStorage.getItem('rickyHouseInventoryV1'),roots:localStorage.getItem('rikiRootProgressV1')}));
  assert.deepEqual(safety,originalSave,'math must preserve dollhouse inventory and shoresh data');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'180','coins survive refresh');
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'{}'))).completed.recipe,1);
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathRecipe').click();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  assert.equal(overflow,false,'no page overflow at '+width+'px');
  assert.deepEqual(errors,[],'no client errors');
  console.log('PASS '+width+'px five mental-math bakery orders, no row gate, wrong answer no coins, progress persistence');
  await context.close();
 }
}finally{await browser.close()}
