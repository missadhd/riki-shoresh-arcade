import {chromium} from 'playwright';
const site=process.env.ARCADE_URL || 'http://127.0.0.1:8765/';
const viewports=[{width:390,height:844},{width:1366,height:768},{width:1440,height:900}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failures=[],count=0;
for(const viewport of viewports){
 const context=await browser.newContext({viewport});
 const page=await context.newPage();
 page.on('pageerror',e=>failures.push(viewport.width+' page error: '+e.message));
 try{
  await page.goto(site,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>typeof window.rikiSceneStart==='function',{timeout:45000});
  await page.evaluate(()=>window.rikiSceneStart());
  for(let story=0;story<6;story++){
   const options=page.locator('[data-riki-story-option]');
   for(let option=0;option<3;option++){
    if(await page.locator('#rikiStoryBegin').count())await page.locator('#rikiStoryBegin').click();
    await options.nth(option).click();
    await page.locator('.sel-feedback').waitFor({timeout:15000});
    const check=await page.evaluate(()=>{
     const scene=document.querySelector('.sd-theater'),caption=scene?.querySelector('.sd-caption');
     const feedback=document.querySelector('.sel-feedback');
     const speech=scene?.querySelector('.sd-dialogue foreignObject div');
     const checks=[scene,caption,feedback].every(Boolean);
     const rect=scene?.getBoundingClientRect();
     const overflow=speech? speech.scrollWidth>speech.clientWidth+2 || speech.scrollHeight>speech.clientHeight+2:false;
     return {checks,overflow,sceneWidth:rect?.width,viewport:innerWidth,caption:caption?.textContent,choice:document.querySelector('[aria-pressed="true"]')?.textContent};
    });
    if(!check.checks||check.overflow||check.sceneWidth>check.viewport+3){
     failures.push(JSON.stringify({viewport:viewport.width,story:story+1,option:option+1,check}));
    }
    count++;
    if(option<2){
     await page.locator('#rikiStoryReplay').click();
    }else{
     const next=page.locator('#rikiSceneNext');
     if(await next.count())await next.click();
     else{
      // Choose a constructive answer to unlock Next without awarding extras.
      await page.locator('#rikiStoryReplay').click();
      await page.locator('#rikiStoryBegin').click();
      await page.locator('[data-riki-story-option="help"], [data-riki-story-option="ask"]').first().click();
      await page.locator('#rikiSceneNext').click();
     }
    }
   }
  }
  if(!(await page.getByText('Stories complete!',{exact:false}).count()))failures.push(viewport.width+' did not reach end');
 }catch(e){
  failures.push(viewport.width+' test error: '+e.stack);
  await page.screenshot({path:'social-failure-'+viewport.width+'.png',fullPage:true}).catch(()=>{});
 }
 await context.close();
}
await browser.close();
console.log('Social Detective outcomes inspected:',count,'expected:',viewports.length*18);
if(count!==viewports.length*18)failures.push('Missing outcomes');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('Social Detective smoke regression PASS');
