// Studio games must not auto-rotate/drift, and picked pieces must settle at their anchored rest spot.
// Usage: node tests/studio-camera-ci.mjs [baseURL]   (default http://127.0.0.1:4173/)
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const BASE=process.argv[2]||'http://127.0.0.1:4173/';
const GAMES=['cupcakes','cake','dressup','pets','boutique','aquarium','giftwrap','garden','claw','quest'];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const fails=[];
try{
 for(const [w,h] of [[390,844],[1366,768]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},serviceWorkers:'block'});
  const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.RikiStudio,{timeout:30000});
  for(const id of GAMES){
   await page.evaluate(id=>window.RikiStudio.start(id),id);
   await page.waitForFunction(()=>document.querySelector('#app canvas'),{timeout:15000});
   const cv=page.locator('#app canvas').first();await cv.scrollIntoViewIfNeeded();
   await page.waitForTimeout(1500);
   if(w>=900){const sh=await page.evaluate(()=>document.querySelector('#app .st-stage').getBoundingClientRect().height);if(sh<h*.45)fails.push(`${id}@${w}x${h}: 3D stage only ${Math.round(sh)}px tall (< 45% of viewport)`);
    const off=await page.evaluate(()=>[...document.querySelectorAll('#app .st-card')].some(e=>{const r=e.getBoundingClientRect();return r.bottom>innerHeight+1||r.top<0;}));if(off)fails.push(`${id}@${w}x${h}: choice cards not all on screen`);
    const fitv=await page.evaluate(()=>{const g=document.querySelector('#app .gamehead').getBoundingClientRect(),st=document.querySelector('#app .st-stage').getBoundingClientRect();return g.top>=0&&st.bottom<=innerHeight+1;});if(!fitv)fails.push(`${id}@${w}x${h}: game header + stage do not fit the viewport`);}
   else if(id==='claw'){const off=await page.evaluate(()=>[...document.querySelectorAll('#app .st-card')].some(e=>{const r=e.getBoundingClientRect();return r.bottom>innerHeight+1||r.top<0||r.height<44||r.width<44;}));if(off)fails.push(`claw@${w}: prize choices off screen or under 44px`);}
   const snap=async()=>page.evaluate(()=>{const d=window.RikiStudio.debug&&window.RikiStudio.debug();return d;});
   const a=await cv.screenshot();const d0=await snap();
   await page.waitForTimeout(3000);
   const b=await cv.screenshot();const d1=await snap();
   if(id==='pets'||id==='aquarium'){await page.screenshot({path:`/tmp/studio-${id}-${w}.png`});}
   // pixel drift (black-box; works without the debug hook)
   const diff=await page.evaluate(async([a,b])=>{const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s;});const [ia,ib]=await Promise.all([load(a),load(b)]);const c=document.createElement('canvas');c.width=ia.width;c.height=ia.height;const x=c.getContext('2d');x.drawImage(ia,0,0);const A=x.getImageData(0,0,c.width,c.height).data;x.clearRect(0,0,c.width,c.height);x.drawImage(ib,0,0);const B=x.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<A.length;i+=4){if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>40)n++;}return n/(A.length/4);},[a.toString('base64'),b.toString('base64')]);
   const msg=`${id}@${w}: idle pixel change ${(diff*100).toFixed(2)}%`;console.log(msg);
   if(diff>0.02)fails.push(msg+' (scene moved while idle)');
   if(d0&&d1){const dc=Math.hypot(d0.cam[0]-d1.cam[0],d0.cam[1]-d1.cam[1],d0.cam[2]-d1.cam[2]);if(dc>1e-3)fails.push(`${id}@${w}: camera moved ${dc.toFixed(4)} while idle`);}
   // apply every step's first variant, check each piece rests at its anchor (local position 0 and scale 1, still parented to root)
   const steps=await page.evaluate(()=>window.RikiStudio.games[window.RikiStudio.state().id].steps.length);
   for(let i=0;i<steps;i++){
    await page.evaluate(i=>window.RikiStudio.applyTest(i,0),i).catch(e=>fails.push(`${id}: applyTest ${i} ${e.message}`));
   }
   await page.waitForTimeout(900);
   const d2=await snap();
   if(d2){for(const [slot,s] of Object.entries(d2.slots)){if(!s.parented)fails.push(`${id}@${w}: slot ${slot} not parented to scene root`);else if(s.anim)continue;else if(Math.abs(s.y)>1e-3||Math.abs(s.scale-1)>1e-3)fails.push(`${id}@${w}: slot ${slot} not at rest y=${s.y} scale=${s.scale}`);}
    if(d0){const dc=Math.hypot(d0.cam[0]-d2.cam[0],d0.cam[1]-d2.cam[1],d0.cam[2]-d2.cam[2]);if(dc>1e-3&&id!=='quest')fails.push(`${id}@${w}: camera moved ${dc.toFixed(4)} after picks`);}}
   else fails.push(`${id}: RikiStudio.debug hook missing`);
  }
  if(errs.length)fails.push(`page errors @${w}: ${errs.join(' | ')}`);
  await ctx.close();
 }
}finally{await browser.close();}
if(fails.length){console.error('FAIL\n'+fails.join('\n'));process.exit(1);}
console.log('studio camera stable: PASS');
