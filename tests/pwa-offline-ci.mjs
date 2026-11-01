import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
const page=await context.newPage();
const url='http://127.0.0.1:8765/';
try{
 await page.goto(url,{waitUntil:'load',timeout:60000});
 await page.waitForFunction(()=>!!navigator.serviceWorker,{timeout:10000});
 const registration=await page.evaluate(async()=>navigator.serviceWorker.ready.then(r=>({active:!!r.active,scope:r.scope})));
 if(!registration.active)throw Error('Service worker did not activate');
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:15000});
 await page.waitForTimeout(3000);
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded',timeout:25000});
 await page.locator('#app').waitFor({state:'visible',timeout:15000});
 const body=await page.locator('body').innerText();
 if(!/Shoresh|Arcade|Games/i.test(body))throw Error('Offline shell had no arcade text');
 // 3D must also work offline: three.js r128 is vendored and precached by the worker.
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.evaluate(()=>window.RikiStudio.start('cupcakes'));
 await page.waitForFunction(()=>!!window.THREE&&window.THREE.REVISION==='128',{timeout:20000});
 await page.waitForTimeout(1500);
 const canvases=await page.locator('canvas').count();
 if(!canvases)throw Error('Offline 3D studio rendered no canvas');
 if(errs.length)throw Error('Offline 3D errors: '+errs.join(' | '));
 console.log('Offline reload PASS; offline 3D PASS (THREE r128, '+canvases+' canvas); worker scope:',registration.scope);
}catch(e){
 console.error('Offline reload FAIL:',e.stack);
 await page.screenshot({path:'pwa-offline-failure.png',fullPage:true}).catch(()=>{});
 process.exitCode=1;
}finally{await browser.close();}
