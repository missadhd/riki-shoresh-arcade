import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try{
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RK3?.makeItem&&!!window.RikiFurnitureInteractions,{timeout:30000});
  await page.evaluate(()=>new Promise((ok,fail)=>window.RK3.loadThree(ok,()=>fail(Error('Three failed to load')))));
  const results=await page.evaluate(()=>{
   const K=window.RK3,api=window.RikiFurnitureInteractions,ids=[
    'fridge','fridgeretro','clayfridge','minifridge','heartfridge','dresser',
    'nightstand','wardrobe','cupboard','toybox','blushtoybox','bathcabinet','tvcabinet',
    'bookshelfplay','shelfmoon','rainbowcubbies'];
   const outcomes=[];
   for(const id of ids){
    if(!api.isStorage(id))throw Error(id+': no storage interaction recognized');
    const p=K.storageProfile(id);if(!p)throw Error(id+': no storage profile');
    const g=K.makeItem([id,'',id,1,'kitchen']);
    const storage=g.userData.storage;if(!storage)throw Error(id+': model has no storage state');
    if(storage.slots.length===0)throw Error(id+': no positions for small items');
    if(['fridge','fridgeretro','clayfridge','minifridge','heartfridge','dresser','nightstand','wardrobe','cupboard','toybox','blushtoybox','bathcabinet','tvcabinet'].includes(id)){
     if(!storage.parts.length)throw Error(id+': missing opening door or drawer or lid');
     const part=storage.parts[0],prop=part.kind==='drawer'?'position':'rotation',axis=part.kind==='drawer'?'z':part.kind==='lid'?'x':'y';
     const initial=part.group[prop][axis];
     if(!K.toggleStoragePart(g,0))throw Error(id+': part fails to toggle');
     for(let i=0;i<22;i++)K.animateStorage(g);
     if(Math.abs(part.group[prop][axis]-initial)<.12)throw Error(id+': part never moved when opened');
     K.setStorageOpen(g,false);
     for(let i=0;i<22;i++)K.animateStorage(g);
     if(Math.abs(part.group[prop][axis]-initial)>.12)throw Error(id+': part will not close');
    }
    outcomes.push({id,kind:p.kind,parts:storage.parts.length,slots:storage.slots.length});
   }
   for(const id of ['clayfridge','minifridge','heartfridge']){
    if(!api.isFridge(id))throw Error(id+': not recognized as fridge food storage');
    if(!api.isEligible(id,'milkcarton'))throw Error(id+': must accept milk');
    if(api.isEligible(id,'bed'))throw Error(id+': bed must not be storable as food');
   }
   return outcomes;
  });
  assert.equal(results.length,16);
  console.log('PASS '+width+'px 16 storage models open, close and expose slots, including new fridges');
  await page.close();
  const demo=await browser.newPage({viewport:{width,height:width===390?844:800}});
  demo.on('pageerror',e=>errors.push('demo: '+e.message));
  await demo.goto('http://127.0.0.1:4173/examples/pink-heart-cabinet.html',{waitUntil:'load'});
  await demo.waitForFunction(()=>!!window.RikiSampleCabinet,{timeout:15000});
  await demo.locator('#stage canvas').waitFor({timeout:15000});
  await demo.locator('#doors').click();
  await demo.waitForTimeout(350);
  assert.equal((await demo.evaluate(()=>window.RikiSampleCabinet.getState())).doorOpen,true);
  assert.equal(await demo.locator('#doors').getAttribute('aria-pressed'),'true');
  await demo.locator('#drawers').click();
  await demo.waitForFunction(()=>{const x=window.RikiSampleCabinet.getState();return x.doorValue>.5&&x.drawerValue>.5},{timeout:15000});
  const model=await demo.evaluate(()=>window.RikiSampleCabinet.getState());
  assert.ok(model.doorValue>.5&&model.drawerValue>.5,'sample doors and drawers animate open');
  await demo.locator('#reset').click();
  await demo.waitForTimeout(300);
  const reset=await demo.evaluate(()=>window.RikiSampleCabinet.getState());
  assert.equal(reset.doorOpen,false);assert.equal(reset.drawerOpen,false);
  await demo.locator('#stage').screenshot({path:'interactive-sample-'+width+'.png'});
  assert.deepEqual(errors,[],'javascript runtime errors');
  console.log('PASS '+width+'px sample cabinet: WebGL rendered, buttons open/close, reset');
  await demo.close();
 }
}finally{await browser.close()}
