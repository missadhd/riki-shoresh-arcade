import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try{
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:800},serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage();let errors=[];
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
   const number=await page.locator('.rk-math-equation').innerText();
   const match=number.match(/(\d+)\s*×\s*(\d+)/);
   assert.ok(match,'order shows a multiplication equation');
   const count=Number(match[1]),each=Number(match[2]),total=count*each;
   assert.equal(await page.locator('.rk-kitchen-tray').count(),count,'one empty tray per group');
   assert.equal(await page.locator('.rk-kitchen-scene').getAttribute('data-recipe-stage'),'prep');
   for(let step=0;step<count;step++){
    await page.locator('#rkKitchenFill').click();
    assert.equal(await page.locator('.rk-kitchen-tray.filled').count(),step+1,'each tap fills exactly one tray');
   }
   assert.equal(await page.locator('.rk-kitchen-scene').getAttribute('data-recipe-stage'),'solve');
   assert.equal(await page.locator('#rkKitchenFill').count(),0,'filling is complete');
   if(!wrongDone){
    await page.locator('#rkMathInput').fill(String(total+1));
    await page.locator('#rkMathForm button').click();
    assert.match(await page.locator('#rkMathStatus').innerText(),/Not yet/);
    assert.equal(await page.locator('#rkMathHelp').isVisible(),true,'wrong answer reveals concrete skip-counting hint');
    assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'150','wrong answer cannot earn coins');
    wrongDone=true;
   }
   await page.locator('#rkMathInput').fill(String(total));
   await page.locator('#rkMathForm button').click();
   assert.equal(await page.locator('.rk-kitchen-scene').getAttribute('data-recipe-stage'),'ready');
   assert.equal(await page.evaluate(()=>Number(localStorage.getItem('rickyCoins'))),150+order*6,'right answer alone not rewarded');
   await page.locator('#rkKitchenBake').click();
   assert.equal(await page.locator('.rk-kitchen-scene').getAttribute('data-recipe-stage'),'baking');
   assert.equal(await page.locator('#rkKitchenServe').count(),1);
   assert.equal(await page.locator('.rk-kitchen-plate').innerText(),'🍽️','nothing served yet');
   if(order===0)await page.locator('.rk-kitchen-scene').screenshot({path:'recipe-baking-'+width+'.png'});
   await page.locator('#rkKitchenServe').click();
   assert.equal(await page.locator('.rk-kitchen-scene').getAttribute('data-recipe-stage'),'served');
   assert.equal(await page.evaluate(()=>Number(localStorage.getItem('rickyCoins'))),150+(order+1)*6,'one coin award per completed order');
   assert.equal(await page.locator('#rkKitchenServe').count(),0,'serve button disappears after completion');
   if(order===0)await page.locator('.rk-kitchen-panel').screenshot({path:'recipe-served-'+width+'.png'});
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
  assert.deepEqual(safety,originalSave,'math game must preserve inventory after normal starter furniture is initialized');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'180','coins survive refresh');
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'{}'))).completed.recipe,1);
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathRecipe').click();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  assert.equal(overflow,false,'no page overflow at '+width+'px');
  await page.locator('.rk-kitchen-panel').screenshot({path:'recipe-prep-'+width+'.png'});
  assert.deepEqual(errors,[],'no client errors');
  console.log('PASS '+width+'px 5 actual orders, fill/bake/serve, wrong hint, no double coins, progress refresh, other savings intact');
  await context.close();
 }
}finally{await browser.close()}
