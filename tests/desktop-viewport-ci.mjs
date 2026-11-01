// Issue #145 regression: Social Detective acted scenes must not be cut off on laptop/desktop screens.
// After every choice (6 stories x 3 choices), the acted scene, Next/Watch again must sit fully between the
// sticky header and the bottom of the viewport. Phone width only checks no horizontal clipping.
import {chromium} from 'playwright';
const site=process.env.ARCADE_URL || 'http://127.0.0.1:8765/';
const viewports=[{width:1280,height:720,desk:true},{width:1366,height:768,desk:true},{width:1440,height:900,desk:true},{width:1920,height:1080,desk:true},{width:390,height:844,desk:false}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failures=[],count=0;
const settle=page=>page.waitForFunction(()=>new Promise(r=>{let y=scrollY,n=0;const t=setInterval(()=>{if(scrollY===y){if(++n>4){clearInterval(t);r(true)}}else{y=scrollY;n=0}},50)}),null,{timeout:10000});
for(const vp of viewports){
 const context=await browser.newContext({viewport:{width:vp.width,height:vp.height}});
 const page=await context.newPage();
 page.on('pageerror',e=>failures.push(vp.width+' page error: '+e.message));
 try{
  await page.goto(site,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>typeof window.rikiSceneStart==='function',{timeout:45000});
  await page.evaluate(()=>window.rikiSceneStart());
  for(let story=0;story<6;story++){
   for(let option=0;option<3;option++){
    if(await page.locator('#rikiStoryBegin').count())await page.locator('#rikiStoryBegin').click();
    // Click without Playwright's auto-scroll so we measure the game's own scroll behaviour.
    await page.locator('[data-riki-story-option]').nth(option).evaluate(b=>b.click());
    await page.locator('.sel-feedback').waitFor({timeout:15000});
    await settle(page);
    const c=await page.evaluate(()=>{
     const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right}};
     return {vw:innerWidth,vh:innerHeight,docW:document.documentElement.scrollWidth,head:box('.top'),scene:box('.sd-theater'),next:box('#rikiSceneNext'),replay:box('#rikiStoryReplay'),feedback:box('.sel-feedback')};
    });
    const bad=[];
    if(!c.scene||!c.feedback||!c.replay)bad.push('missing scene/feedback/replay');
    else{
     if(c.docW>c.vw+1)bad.push('horizontal overflow '+c.docW);
     if(c.scene.l<-1||c.scene.r>c.vw+1)bad.push('scene wider than viewport');
     if(vp.desk){
      const top=c.head.b-2;
      if(c.scene.t<top)bad.push('scene top hidden under header ('+Math.round(c.scene.t)+'<'+Math.round(top)+')');
      if(c.scene.b>c.vh+1)bad.push('scene bottom below fold');
      for(const k of ['replay','next'])if(c[k]&&(c[k].t<top||c[k].b>c.vh+1))bad.push(k+' not visible');
     }
    }
    if(bad.length)failures.push(JSON.stringify({viewport:vp.width,story:story+1,option:option+1,bad}));
    count++;
    if(option<2){await page.locator('#rikiStoryReplay').click();}
    else{
     const next=page.locator('#rikiSceneNext');
     if(await next.count())await next.click();
     else{
      await page.locator('#rikiStoryReplay').click();
      await page.locator('#rikiStoryBegin').click();
      await page.locator('[data-riki-story-option="help"], [data-riki-story-option="ask"]').first().click();
      await page.locator('#rikiSceneNext').click();
     }
    }
   }
  }
  if(!(await page.getByText('Stories complete!',{exact:false}).count()))failures.push(vp.width+' did not reach end');
 }catch(e){
  failures.push(vp.width+' test error: '+e.stack);
  await page.screenshot({path:'desktop-viewport-failure-'+vp.width+'.png',fullPage:true}).catch(()=>{});
 }
 await context.close();
}
await browser.close();
console.log('Desktop viewport outcomes inspected:',count,'expected:',viewports.length*18);
if(count!==viewports.length*18)failures.push('Missing outcomes');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('Desktop viewport (#145) regression PASS');
