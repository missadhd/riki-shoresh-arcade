// Real browser QA for all six rooms and isolated multi-touch behavior.
// All test purchases and saved progress live only in disposable Playwright contexts.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const ROOMS=[
  ['bedroom','heartrug'],['living','pinkguitar'],['kitchen','heartkitchencabinet'],
  ['garden','gardenbench'],['bathroom','bathcandles'],['playroom','doll']
];
const KEYS=['rickyCoins','rickyHouseInventoryV1','rickyHouseDecorV1','rickyDreamPositionsV2',
 'rickyDreamStorageV2','rikiRootProgressV1','rikiDreamRotationV1'];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try {
  for(const width of [1280,390]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:800},isMobile:width===390,hasTouch:width===390,serviceWorkers:'block'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      if(sessionStorage.getItem('__sixRoomSeeded'))return;
      sessionStorage.setItem('__sixRoomSeeded','1');
      const items=['heartrug','pinkguitar','heartkitchencabinet','gardenbench','bathcandles',
        'doll','utensilcrock','heartteapot','milkcarton','toybox','wardrobe','clayfridge','fridgeretro'];
      localStorage.setItem('rikiGuestDemo500GrantedV1','yes');
      localStorage.setItem('rickyCoins','800');
      localStorage.setItem('rickyHouseInventoryV1',JSON.stringify(items));
      localStorage.setItem('rickyHouseDecorV1','{}');
      localStorage.setItem('rickyDreamPositionsV2','{}');
      localStorage.setItem('rickyDreamStorageV2','{}');
      localStorage.setItem('rikiRootProgressV1','{"proof":17}');
    });
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.RK3&&window.RK3.roomViewState&&typeof window.houseRender==='function',{timeout:30000});
    const initial=await page.evaluate(()=>({coins:localStorage.getItem('rickyCoins'),roots:localStorage.getItem('rikiRootProgressV1')}));
    for(const [room,item] of ROOMS){
      await page.evaluate(room=>{
        window.houseHome();
        window.eval('currentRoom='+JSON.stringify(room)+";housePage='decorate';selectedItem='';");
        window.houseRender();
      },room);
      await page.locator('#dreamRoom canvas').waitFor({timeout:35000});
      await page.waitForFunction(r=>window.RK3.roomViewState().room===r,room,{timeout:35000});
      assert.equal(await page.evaluate(()=>window.RK3.roomViewState().room),room,'wrong room loaded');
      // Real 3D furniture inventory -> preview -> Place here.
      const piece=page.locator('[data-dream-inventory="'+item+'"]');
      await piece.waitFor({timeout:12000});
      await piece.click();
      const place=page.locator('#rk3BarPlace');await place.waitFor({state:'visible',timeout:12000});
      await place.click();
      await page.waitForFunction(({room,item})=>{
        const decor=JSON.parse(localStorage.getItem('rickyHouseDecorV1')||'{}');
        return Object.values(decor[room]||{}).includes(item);
      },{room,item},{timeout:12000});
      const present=await page.evaluate(item=>window.RK3.roomViewState().items.some(x=>x.id===item),item);
      assert.ok(present,'3D scene must contain purchased '+item+' in '+room);
      await page.locator('#dreamRoom').screenshot({path:'room-'+width+'-'+room+'.png'});
      console.log('ROOM '+width+'px '+room+': preview, placed in 3D, and saved');

      if(room==='kitchen'){
        // The viewport controls must not overlap one another on a small phone.
        const controls=await page.evaluate(()=>{
          const box=document.getElementById('dreamRoom'),front=box.querySelector('#rk3Front');
          const hud=box.querySelector('.riki3d-hud'),hint=hud?.querySelector('span:nth-of-type(2)');
          const f=front.getBoundingClientRect();
          const buttons=[...hud.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!=='none');
          return {hintVisible:hint&&getComputedStyle(hint).display!=='none',
            overlaps:buttons.some(b=>{const a=b.getBoundingClientRect();return a.left<f.right&&a.right>f.left&&a.top<f.bottom&&a.bottom>f.top;}),
            undersized:buttons.some(b=>{const a=b.getBoundingClientRect();return a.width<40||a.height<40;})};
        });
        if(width===390){
          assert.equal(controls.hintVisible,false,'phone HUD hint should not obstruct controls');
          assert.equal(controls.overlaps,false,'phone HUD buttons must not overlap front view');
          assert.equal(controls.undersized,false,'phone camera controls must remain touch-sized');
        }
        // The real selected-item toolbar should rotate and resize a placed
        // object, saving those changes under the existing progress keys.
        await page.locator('[data-dream-inventory="heartkitchencabinet"]').click();
        await page.locator('#rk3BarRotate').click();
        const angle=await page.evaluate(()=>JSON.parse(localStorage.getItem('rikiDreamRotationV1')||'{}')['kitchen:heartkitchencabinet']);
        assert.equal(angle,45,'Turn must save a 45 degree furniture rotation');
        await page.locator('#rk3BarSmaller').click();
        const size=await page.evaluate(()=>JSON.parse(localStorage.getItem('rickyDreamPositionsV2')||'{}').kitchen?.heartkitchencabinet?.scale);
        assert.ok(size<1&&size>=.65,'Smaller button should save an actual nonzero scale');
        // Exercise two-finger movement without adding unintended furniture drags/placements.
        const before=await page.evaluate(()=>({
          view:window.RK3.roomViewState(),
          positions:localStorage.getItem('rickyDreamPositionsV2'),
          decor:localStorage.getItem('rickyHouseDecorV1')
        }));
        if(width===390){
          // Genuine Chromium touch events (not manually dispatched pointer
          // events) confirm the browser doesn't cancel pinch as page scroll.
          const canvas=page.locator('#dreamRoom canvas');
          await canvas.scrollIntoViewIfNeeded();
          const r=await canvas.boundingBox(),x=r.x+r.width*.5,y=r.y+r.height*.57;
          const cdp=await context.newCDPSession(page);
          try{
            await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[
              {x:x-27,y},{x:x+27,y}
            ]});
            await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[
              {x:x-66,y},{x:x+66,y}
            ]});
            await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          }finally{await cdp.detach();}
        }else{
          // Browser-pointer regression on desktop exercises the same gesture
          // guard without requiring a touch-capable physical monitor.
          await page.evaluate(()=>{
            const canvas=document.querySelector('#dreamRoom canvas');
            const r=canvas.getBoundingClientRect();
            const x=r.left+r.width*.5,y=r.top+r.height*.56;
            const ev=(kind,id,px,py)=>canvas.dispatchEvent(new PointerEvent(kind,{
              bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',
              isPrimary:id===321,clientX:px,clientY:py,button:0,buttons:kind==='pointerup'?0:1
            }));
            ev('pointerdown',321,x-27,y);
            ev('pointerdown',322,x+27,y);
            ev('pointermove',321,x-68,y);
            ev('pointermove',322,x+68,y);
            ev('pointerup',321,x-68,y);
            ev('pointermove',322,x+93,y+23);
            ev('pointerup',322,x+93,y+23);
          });
        }
        const after=await page.evaluate(()=>({
          view:window.RK3.roomViewState(),
          positions:localStorage.getItem('rickyDreamPositionsV2'),
          decor:localStorage.getItem('rickyHouseDecorV1')
        }));
        assert.ok(after.view.zoom<before.view.zoom-.12,'two-finger spreading must zoom the room');
        assert.ok(Math.abs(after.view.az-before.view.az)<.001,'pinch must not also rotate room');
        assert.ok(Math.abs(after.view.el-before.view.el)<.001,'pinch must not also tilt room');
        assert.ok(!after.view.dragging,'pinch must not leave an active furniture drag');
        assert.deepEqual(after.view.items,before.view.items,'pinch must not shift furniture geometry');
        assert.equal(after.positions,before.positions,'pinch cannot rewrite saved furniture positions');
        assert.equal(after.decor,before.decor,'pinch cannot create placements');
        // Opening a placed cabinet should present real storage, without changing other rooms.
        await page.locator('[data-dream-inventory="heartkitchencabinet"]').click();
        await page.locator('#rk3BarOpen').click();
        assert.equal(await page.locator('.rk-storage-toolbar').count(),1,'Open button must enter real 3D furniture storage');
        await page.locator('.rk-storage-toolbar button').waitFor({state:'visible',timeout:12000});
        const utensil=page.locator('[data-storage-object="utensilcrock"]');
        await utensil.waitFor({state:'visible',timeout:12000});
        await utensil.click();
        assert.match(await page.locator('.rk-storage-help').innerText(),/selected/i,'touching kitchen item selects it');
        const placed=await page.evaluate(()=>window.RikiFurnitureInteractions.storeItem('heartkitchencabinet','kitchen','utensilcrock',0));
        assert.equal(placed,true,'should store utensil crock');
        assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('rickyDreamStorageV2')||'{}')['kitchen:heartkitchencabinet']?.[0]),'utensilcrock');
        await page.locator('.rk-storage-toolbar button').click();
        await page.waitForFunction(()=>!document.querySelector('.rk-storage-toolbar'),{timeout:12000});
        console.log('TOUCH '+width+'px kitchen: pinch without drag; storage open, item selected, saved and closed');
      }
    }
    assert.deepEqual(await page.evaluate(()=>({coins:localStorage.getItem('rickyCoins'),roots:localStorage.getItem('rikiRootProgressV1')})),initial,
      'dollhouse testing cannot modify coins or Hebrew progress');
    const placedAll=await page.evaluate(()=>JSON.parse(localStorage.getItem('rickyHouseDecorV1')||'{}'));
    for(const [room,item] of ROOMS)assert.ok(Object.values(placedAll[room]||{}).includes(item),room+' furniture missing after changing rooms');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!window.RK3?.roomViewState,{timeout:20000});
    const persisted=await page.evaluate(()=>({
      decor:JSON.parse(localStorage.getItem('rickyHouseDecorV1')||'{}'),
      food:JSON.parse(localStorage.getItem('rickyDreamStorageV2')||'{}')
    }));
    for(const [room,item] of ROOMS)assert.ok(Object.values(persisted.decor[room]||{}).includes(item),room+' lost saved furniture on reload');
    assert.equal(persisted.food['kitchen:heartkitchencabinet']?.[0],'utensilcrock','saved cabinet storage must survive reload');
    assert.deepEqual(errors,[],'browser errors: '+JSON.stringify(errors));
    console.log('PASS '+width+'px all six rooms, drag safety, storage, no unintended changes and reload');
    await context.close();
  }
}finally{await browser.close()}
