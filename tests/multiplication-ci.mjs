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
  const roots=await page.evaluate(()=>{
   const primary=document.getElementById('gamesShortcut');
   const duplicates=['rikiShoreshTab','rikiShoreshimTab'].map(id=>document.getElementById(id));
   return {name:primary?.textContent,duplicateVisible:duplicates.map(x=>!!x&&getComputedStyle(x).display!=='none'),duplicateAccessible:duplicates.map(x=>x?.getAttribute('aria-hidden'))};
  });
  assert.match(roots.name,/Shoreshim/,'main top destination should say Shoreshim');
  assert.deepEqual(roots.duplicateVisible,[false,false],'old duplicate Hebrew tabs must be hidden');
  assert.deepEqual(roots.duplicateAccessible,['true','true'],'hidden duplicate controls must leave accessibility tree');
  await page.locator('#rkMathShortcut').click();
  await page.locator('#gamesShortcut').click();
  await page.locator('#app .games').waitFor({timeout:10000});
  assert.equal(await page.locator('#app .rk-math').count(),0,'Shoreshim tab should actually open Hebrew games');
  await page.locator('#rkMathShortcut').click();
  const preserved={bed:await page.evaluate(()=>localStorage.getItem('rickyHouseInventoryV1')),roots:await page.evaluate(()=>localStorage.getItem('rikiRootProgressV1'))};
  await page.locator('#rkMathShortcut').click();
  await page.locator('#rkMathRecipe').waitFor();
  assert.equal(await page.locator('.rk-math-choices button').count(),5);
  assert.equal(await page.locator('header .top').count(),0);
  // Mental-math first: an order can be served by choosing the product immediately.
  await page.locator('#rkMathRecipe').click();
  let eq=await page.locator('.rk-math-equation').innerText();
  let m=eq.match(/(\d+)\s*×\s*(\d+)/);assert.ok(m,'Recipe displays a multiplication fact');
  assert.equal(await page.locator('#rkMathBuild,#rkKitchenFill,.rk-kitchen-tray').count(),0,'No prerequisite rows or tray-by-tray counting');
  assert.equal(await page.locator('.rk-math-serve-choice').count(),4,'Four selectable totals to serve');
  const beforeWrong=await page.evaluate(()=>localStorage.getItem('rickyCoins'));
  const incorrect=await page.locator('.rk-math-serve-choice').evaluateAll((buttons,correct)=>buttons.find(b=>Number(b.dataset.mathAnswer)!==correct)?.dataset.mathAnswer,Number(m[1])*Number(m[2]));
  await page.locator('[data-math-answer="'+incorrect+'"]').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),beforeWrong,'A wrong guess earns zero coins');
  await page.locator('[data-math-answer="'+(Number(m[1])*Number(m[2]))+'"]').click();
  await page.locator('#rkMathNext').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'106','Correct product gives exactly 6 coins');
  assert.equal(await page.locator('.rk-math-order-scene').getAttribute('data-solved'),'true','Customer order is served');
  // Quick Math: a numeric answer is available immediately, not after building rows.
  await page.locator('#rkMathShortcut').click();
  await page.locator('[data-math-game="array"]').click();
  eq=await page.locator('.rk-math-equation').innerText();m=eq.match(/(\d+)\s*×\s*(\d+)/);assert.ok(m);
  assert.equal(await page.locator('#rkMathBuild').count(),0);
  await page.locator('#rkMathInput').fill(String(Number(m[1])*Number(m[2])));
  await page.locator('#rkMathForm button').click();
  await page.locator('#rkMathNext').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'112','Quick Math rewards correct product');
  // Aquarium and Fashion: fresh equations, choices, and correct rewards.
  // Aquarium: the Shoreshim 3D Aquarium Rescue, with multiplication questions (8 steps, 6 coins each).
  await page.locator('#rkMathShortcut').click();
  await page.locator('[data-math-game="aquarium"]').click();
  let aqCoins=112;
  const AQ=await page.evaluate(()=>window.RikiStudio.games.aquarium.steps.length);
  for(let step=0;step<AQ;step++){
   await page.locator('.st-card').first().waitFor({timeout:30000});
   eq=await page.locator('.st-bub .rk-math-equation').innerText();m=eq.match(/(\d+)\s*×\s*(\d+)/);assert.ok(m,'aquarium shows equation');
   const ans=Number(m[1])*Number(m[2]);
   const wrongCard=page.locator('.st-card:not([data-math-answer="'+ans+'"])').first();
   if(step===0){await wrongCard.click();await page.locator('#stHint:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'112','wrong answer gives no coins');}
   await page.locator('.st-card[data-math-answer="'+ans+'"]').click();aqCoins+=6;
   await page.waitForFunction(c=>localStorage.getItem('rickyCoins')===c,String(aqCoins),{timeout:15000}).catch(async e=>{throw new Error('coins '+await page.evaluate(()=>localStorage.getItem('rickyCoins'))+' want '+aqCoins+' step '+step+' at '+JSON.stringify(await page.evaluate(()=>window.RikiStudio.state()?.at)))});
   if(step<AQ-1)await page.waitForFunction(s=>document.querySelectorAll('.st-dots i.on').length===s,step+1);
  }
  await page.locator('#stMathHome').waitFor({timeout:30000});
  assert.equal(await page.evaluate(()=>window.RikiStudio.state().picks.length),AQ,'all aquarium pieces built');
  assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')).completed.aquarium))>=1,'aquarium completion saved');
  for(const [game,coins] of [['fashion',String(aqCoins+6)]]){
   await page.locator('#rkMathShortcut').click();
   await page.locator('[data-math-game="'+game+'"]').click();
   eq=await page.locator('.rk-math-equation').innerText();
   m=eq.match(/(\d+)\s*×\s*(\d+)/);assert.ok(m,game+' shows equation');
   await page.locator('[data-math-answer="'+Number(m[1])*Number(m[2])+'"]').click();
   await page.locator('#rkMathNext').waitFor();
   assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),coins,game+' gives 6 coins');
  }
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
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),String(aqCoins+6+24),'4 matches give 24 coins');
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'null'));
  assert.ok(progress.correct>=6&&progress.completed.match>=1,'Practice progress saved');
  assert.deepEqual(await page.evaluate(()=>({bed:localStorage.getItem('rickyHouseInventoryV1'),roots:localStorage.getItem('rikiRootProgressV1')})),preserved);
  // The requested Dollhouse tab must work from within multiplication, not only home.
  await page.locator('#houseShortcut').click();
  await page.locator('#dreamRoom').waitFor({timeout:25000});
  assert.ok(await page.locator('.rk-math').count()===0,'Dollhouse is a separate section');
  await page.locator('#gamesShortcut').click();
  await page.locator('#app .games').waitFor({timeout:10000});
  assert.equal(await page.locator('#app #dreamRoom').count(),0,'Shoreshim should also open from Dollhouse');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RikiMath,{timeout:20000});
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),String(aqCoins+6+24),'coins persist reload');
  assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiMathProgressV1')||'null')))?.completed?.match>=1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  assert.equal(overflow,false,'No horizontal page overflow at '+width+'px');
  await page.locator('#rkMathShortcut').click();
  await page.locator('.rk-math').screenshot({path:'math-arcade-'+width+'.png'});
  assert.deepEqual(errors,[],'No browser JS errors: '+JSON.stringify(errors));
  console.log('PASS '+width+'px nav seven destinations, mental Recipe, Quick Math, Aquarium, Fashion, Fact Match, coins, progress, Dollhouse and reload');
  await context.close();
 }
}finally{await browser.close()}
