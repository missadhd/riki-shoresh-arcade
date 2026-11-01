import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const ITEM='heartkitchencabinet';
try{
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:800},serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('rikiGuestDemo500GrantedV1','yes');
   localStorage.setItem('rickyCoins','200');
   localStorage.setItem('rickyHouseInventoryV1',JSON.stringify(['utensilcrock','heartteapot','milkcarton','teddy']));
   localStorage.setItem('rickyHouseDecorV1',JSON.stringify({}));
   localStorage.setItem('rickyDreamStorageV2',JSON.stringify({}));
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.RikiCatalog&&window.RK3&&window.RikiFurnitureInteractions,{timeout:30000});
  await page.evaluate(()=>new Promise((ok,bad)=>window.RK3.loadThree(ok,()=>bad(Error('3D load failure')))));
  const product=await page.evaluate(id=>window.RikiCatalog.all().find(x=>x.id===id),ITEM);
  assert.ok(product,'shop listing missing');
  assert.equal(product.price,150,'new kitchen cabinet must be a premium purchase');
  assert.equal(product.room,'kitchen');
  assert.equal(product.placementRoom,'kitchen');
  assert.equal(product.category,'Storage');
  assert.equal(product.model,true,'needs a 3D item model');
  const shape=await page.evaluate(id=>{
   const K=window.RK3,it=window.eval('ITEMS').find(x=>x[0]===id);
   const mesh=K.makeItem(it),s=mesh.userData.storage;
   if(!s)throw Error('No real cabinet storage');
   if(s.parts.length!==4)throw Error('Expected two lower doors and two upper drawers, got '+s.parts.length);
   if(s.slots.length!==9)throw Error('Expected nine storage positions, got '+s.slots.length);
   const box=new THREE.Box3().setFromObject(mesh),size=box.getSize(new THREE.Vector3());
   if(size.x<1.5||size.y<1.3)throw Error('Cabinet is too small or lacks sink/faucet: '+JSON.stringify(size));
   for(let i=0;i<s.parts.length;i++){
    const part=s.parts[i],key=part.kind==='drawer'?'position':'rotation',axis=part.kind==='drawer'?'z':'y',before=part.group[key][axis];
    if(!K.toggleStoragePart(mesh,i))throw Error('Cannot toggle part '+i);
    for(let j=0;j<25;j++)K.animateStorage(mesh);
    if(Math.abs(part.group[key][axis]-before)<.15)throw Error('Part '+i+' does not open');
    if(!K.toggleStoragePart(mesh,i))throw Error('Cannot close part '+i);
    for(let j=0;j<25;j++)K.animateStorage(mesh);
    if(Math.abs(part.group[key][axis]-before)>.15)throw Error('Part '+i+' did not close');
   }
   return {parts:s.parts.map(p=>p.kind),slots:s.slots.length,width:size.x};
  },ITEM);
  assert.deepEqual(shape.parts,['door','door','drawer','drawer']);
  const allowed=await page.evaluate(id=>{
   const i=window.RikiFurnitureInteractions;
   return {crock:i.isEligible(id,'utensilcrock'),tea:i.isEligible(id,'heartteapot'),milk:i.isEligible(id,'milkcarton'),toy:i.isEligible(id,'teddy'),bed:i.isEligible(id,'bed'),fridge:i.isEligible(id,'fridge')};
  },ITEM);
  assert.deepEqual(allowed,{crock:true,tea:true,milk:true,toy:false,bed:false,fridge:false});
  // Exercise the real shop from the interface, not a fabricated inventory grant.
  await page.evaluate(()=>{window.eval("housePage='shop';shopRoom='kitchen';");window.houseRender();});
  await page.locator('[data-catalog-room="kitchen"]').click();
  await page.locator('[data-catalog-category="Storage"]').click();
  const card=page.locator('[data-catalog-id="'+ITEM+'"]');
  await card.waitFor({timeout:15000});
  assert.match(await card.innerText(),/150/);
  await card.locator('[data-catalog-buy]').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'50','purchase should deduct exactly 150 coins');
  assert.ok(await page.evaluate(id=>JSON.parse(localStorage.getItem('rickyHouseInventoryV1')||'[]').includes(id),ITEM),'purchase must be persisted');
  const purchaseCta=page.locator('#catalogPlacePurchase');
  await purchaseCta.click();
  await page.locator('[data-dream-inventory="'+ITEM+'"]').waitFor({timeout:15000});
  await page.locator('[data-dream-inventory="'+ITEM+'"]').click();
  await page.locator('#rk3BarPlace').waitFor({timeout:15000});
  await page.locator('#rk3BarPlace').click();
  assert.ok(await page.evaluate(id=>Object.values(JSON.parse(localStorage.getItem('rickyHouseDecorV1')||'{}').kitchen||{}).includes(id),ITEM),'must be placed in the kitchen');
  await page.locator('#dreamRoom canvas').waitFor({timeout:30000});
  await page.waitForTimeout(650);
  const opening=await page.evaluate(id=>window.RK3.openStorage(id),ITEM);
  assert.equal(opening,true,'placeable cabinet must open its in-room interface');
  await page.locator('.rk-storage-toolbar').waitFor({timeout:10000});
  const stored=await page.evaluate(id=>{
   const a=window.RikiFurnitureInteractions;
   return {utensils:a.storeItem(id,'kitchen','utensilcrock',0),
    tea:a.storeItem(id,'kitchen','heartteapot',3),
    toy:a.storeItem(id,'kitchen','teddy',4)};
  },ITEM);
  assert.deepEqual(stored,{utensils:true,tea:true,toy:false});
  await page.waitForTimeout(250);
  const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('rickyDreamStorageV2')||'{}'));
  assert.equal(save['kitchen:'+ITEM]?.[0],'utensilcrock');
  assert.equal(save['kitchen:'+ITEM]?.[3],'heartteapot');
  await page.evaluate(()=>window.RK3.closeStorage(true));
  await page.locator('#dreamRoom').screenshot({path:'heart-kitchen-'+width+'.png'});
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'50','stored items may not spend more coins');
  assert.deepEqual(errors,[],'page JavaScript errors');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.evaluate(()=>localStorage.getItem('rickyCoins')),'50');
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('rickyDreamStorageV2')||'{}'));
  assert.equal(after['kitchen:'+ITEM]?.[0],'utensilcrock','stored utensils must survive reload');
  assert.equal(after['kitchen:'+ITEM]?.[3],'heartteapot','stored teapot must survive reload');
  console.log('PASS '+width+'px: 150 coin Kitchen shop purchase, placement, 3D sink, 4 opening parts, kitchen storage, no toys, saved progress');
  await context.close();
 }
}finally{await browser.close()}
