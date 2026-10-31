/* Run against a local or deployed preview: RIKI_PREVIEW_URL=... node tests/riki-joint-attachments.cjs
   Uses rendered SVG matrices + the actual skinning function, not CSS class assertions. */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const url=process.env.RIKI_PREVIEW_URL||'http://127.0.0.1:8768/preview-layered-riki.html';
const out=process.env.RIKI_SCREENSHOT_DIR||'/tmp/riki-joint-regression';
fs.mkdirSync(out,{recursive:true});
const actions=['idle','wave','walk','jump','nod','listen','think','reach','celebrate'];
const samples=[0,.1875,.3125,.5,.6875,.8125,1];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 let states=0,maxSkinError=0,maxScreenError=0;
 try{
  for(const width of [320,390,768]){
   const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:2});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.RikiJointRig);
   await page.evaluate(()=>{
    window.__verifyRig=()=>{
     const rig=RikiJointRig,info=rig.inspect(),svg=document.getElementById('jewelry');
     const matrix=svg.getScreenCTM();let skinError=0,screenError=0,localError=0;
     for(const [name,a]of Object.entries(info.attachments)){
      const node=svg.querySelector(`[data-attachment="${name}"]`);
      if(node.parentElement.dataset.bone!==a.bone)throw Error(name+' is not a child of its bone');
      const b=info.bones[a.bone].bind;
      const bindPoint=[b[0]*a.local[0]+b[2]*a.local[1]+b[4],b[1]*a.local[0]+b[3]*a.local[1]+b[5]];
      const skinned=rig.meshPoint(bindPoint);
      skinError=Math.max(skinError,Math.hypot(a.world[0]-skinned.position[0],a.world[1]-skinned.position[1]));
      const sum=skinned.weights.reduce((s,x)=>s+x,0);if(Math.abs(sum-1)>1e-7||skinned.weights.some(x=>x<0||x>1))throw Error('Invalid skin weights at '+name);
      const actual=new DOMPoint(0,0).matrixTransform(node.getScreenCTM());
      const expected=new DOMPoint(...a.world).matrixTransform(matrix);
      screenError=Math.max(screenError,Math.hypot(actual.x-expected.x,actual.y-expected.y));
      const relative=node.parentElement.getScreenCTM().inverse().multiply(node.getScreenCTM());
      localError=Math.max(localError,Math.abs(relative.e-a.local[0]),Math.abs(relative.f-a.local[1]),Math.abs(relative.a-1),Math.abs(relative.d-1),Math.abs(relative.b),Math.abs(relative.c));
     }
     return {skinError,screenError,localError,pose:info.pose,quality:rig.meshQuality()};
    };
   });
   for(let pass=1;pass<=2;pass++){
    for(const action of actions){
     for(const t of samples){
      const report=await page.evaluate(([action,t])=>{RikiJointRig.sample(action,t);return __verifyRig()},[action,t]);
      maxSkinError=Math.max(maxSkinError,report.skinError);maxScreenError=Math.max(maxScreenError,report.screenError);states++;
      assert(report.skinError<.00015,`${width}px pass ${pass} ${action}@${t}: jewelry drift from skin = ${report.skinError}`);
      assert(report.screenError<.06,`${width}px pass ${pass} ${action}@${t}: SVG screen mismatch = ${report.screenError}`);
      assert(report.localError<1e-7,'Jewelry local origin mutated');
      assert.equal(report.quality.flipped,0,`${width}px pass ${pass} ${action}@${t}: inverted mesh triangles`);
     }
     if(width===390){
      await page.evaluate(([a,t])=>RikiJointRig.sample(a,t),[action,action==='wave'?.3125:.5]);
      const png=await page.locator('.stage').screenshot();
      const file=path.join(out,`${action}-pass${pass}.png`);fs.writeFileSync(file,png);
      if(pass===2)assert.equal(hash(png),hash(fs.readFileSync(path.join(out,`${action}-pass1.png`))),action+' repeated frame pixels differ');
     }
    }
   }
   // Rotate individual joints separately: whole-canvas motion cannot pass this test.
   for(const bone of ['head','earLeft','earRight','forearmRight','wristRight','root']){
    const report=await page.evaluate(b=>{RikiJointRig.reset();RikiJointRig.setBone(b,.12,[.006,-.004]);return __verifyRig()},bone);
    assert(report.skinError<.00015,`${bone} isolated transform detaches jewelry`);
    assert(report.screenError<.06,`${bone} SVG transform mismatch`);
   }
   for(const scale of [.65,1,1.25]){
    const report=await page.evaluate(s=>{RikiJointRig.sample('reach',.5);document.querySelector('.stage').style.transform=`scale(${s})`;return __verifyRig()},scale);
    assert(report.skinError<.00015,'Scale changed local attachment');assert(report.screenError<.06,'Scale changed SVG attachment');
   }
   await page.evaluate(()=>{document.querySelector('.stage').style.transform='';RikiJointRig.reset()});
   // Controls must really remove the attachment geometry from display.
   for(const id of ['earrings','bracelet']){
    await page.click('#'+id);await page.evaluate(()=>RikiJointRig.sample('idle',0));
    const hidden=await page.evaluate(key=>[...document.querySelectorAll('[data-attachment]')].filter(n=>key==='earrings'?n.dataset.attachment.startsWith('earring'):n.dataset.attachment==='bracelet').every(n=>getComputedStyle(n).display==='none'),id);
    assert(hidden,id+' off does not hide geometry');await page.click('#'+id);
   }
   assert.deepEqual(errors,[],'Runtime errors');
   console.log(`${width}px: ${actions.length} actions × ${samples.length} phases × 2 passes; local and rendered attachment checks PASS`);
   await page.close();
  }
  console.log(JSON.stringify({states,maxSkinError,maxScreenError,screenshots:out}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
