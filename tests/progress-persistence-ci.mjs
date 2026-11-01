import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const URL='http://127.0.0.1:8765/';
const TOKEN={access_token:'test-token',refresh_token:'test-refresh',expires_at:9999999999,user:{id:'guardian-test',email:'adult@example.test'}};
const PLAYER='riki-test-player';
const BASE='rikiCloudSyncedSnapshotV1:'+PLAYER;

async function newPage(width=390){
 const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
 return {context,page:await context.newPage()};
}
async function seed(page,values){
 await page.addInitScript(items=>{
  for(const [k,v] of Object.entries(items.local||{}))localStorage.setItem(k,v);
  for(const [k,v] of Object.entries(items.session||{}))sessionStorage.setItem(k,v);
 },values);
}
async function checkCoin(page,expected,label){
 const actual=await page.evaluate(()=>localStorage.getItem('rickyCoins'));
 assert.equal(actual,String(expected),label);
}
try{
 // Guest coins, XP, owned furniture, and positions survive a normal reload.
 {
  const {context,page}=await newPage();
  await seed(page,{local:{
   rikiGuestDemo500GrantedV1:'yes',rickyCoins:'127',rickyAdventureXPV1:'48',
   rickyHouseInventoryV1:'["bed"]',rickyDreamPositionsV2:'{"bedroom":{"bed":{"x":50,"y":60}}}'
  }});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#app .hub, #app .hero, #app .panel',{timeout:30000});
  await page.reload({waitUntil:'domcontentloaded'});
  await checkCoin(page,127,'guest coins persist');
  const data=await page.evaluate(()=>({
   xp:localStorage.getItem('rickyAdventureXPV1'),
   owned:localStorage.getItem('rickyHouseInventoryV1'),
   positions:localStorage.getItem('rickyDreamPositionsV2')
  }));
  assert.equal(data.xp,'48');
  assert.equal(data.owned,'["bed"]');
  assert.equal(data.positions,'{"bedroom":{"bed":{"x":50,"y":60}}}');
  const banner=page.locator('[aria-label="Testing version"]');
  const height=await banner.evaluate(el=>el.getBoundingClientRect().height);
  assert.ok(height<=65,'mobile test notice is too tall: '+height);
  const hebrew=await page.evaluate(()=>{
   const el=document.createElement('span');el.className='he';el.lang='he';el.textContent='שלח';
   document.getElementById('app').appendChild(el);
   const style=getComputedStyle(el);
   return {direction:style.direction,isolate:style.unicodeBidi};
  });
  assert.equal(hebrew.direction,'rtl');
  assert.equal(hebrew.isolate,'isolate');
  console.log('PASS guest refresh: coins, XP, furniture, positions, compact banner, Hebrew RTL');
  await context.close();
 }
 // Simulate a returning cloud player who earned 45 coins immediately before reload.
 // The remote snapshot is still 100, but the local browser has 145; the older remote
 // copy must NOT replace 145. After the periodic save, the remote should become 145.
 {
  const {context,page}=await newPage(1280);
  let remote={version:7,snapshot:{rickyCoins:'100'}};
  let updates=0;
  await context.route('https://hmkcfmogpgljfasvefvs.supabase.co/**',async route=>{
   const req=route.request(),url=new globalThis.URL(req.url());
   const data=(body)=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
   if(url.pathname.endsWith('/arcade_players'))return data(url.searchParams.has('select')&&url.searchParams.get('select')==='nickname'?[{nickname:'Riki'}]:[{id:PLAYER}]);
   if(url.pathname.endsWith('/arcade_progress')){
    if(req.method()==='PATCH'){
     const p=JSON.parse(req.postData()||'{}');
     if(p.version===remote.version+1){
      remote={version:p.version,snapshot:p.snapshot};updates++;
      return data([{version:remote.version}]);
     }
     return data([]);
    }
    const sel=url.searchParams.get('select')||'';
    return data(sel==='version'?[{version:remote.version}]:[remote]);
   }
   return data([]);
  });
  await seed(page,{local:{
   rikiGuestDemo500GrantedV1:'yes',rickyCoins:'145',
   [BASE]:JSON.stringify({serialized:JSON.stringify({rickyCoins:'100'}),version:7})
  },session:{
   rikiGuardianSessionV1:JSON.stringify(TOKEN),
   rikiCurrentPlayerV1:PLAYER
  }});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#rkAccountStatus',{timeout:30000});
  await page.waitForTimeout(1300);
  await checkCoin(page,145,'unsynced local coins must not be overwritten by older cloud data');
  await page.waitForFunction(()=>document.querySelector('#rkAccountStatus')?.textContent.includes('Cloud progress saved'),{timeout:22000});
  await checkCoin(page,145,'coins after cloud upload');
  assert.equal(remote.snapshot.rickyCoins,'145','cloud must receive new local coin balance');
  assert.ok(updates>=1,'cloud save should have been sent');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1700);
  await checkCoin(page,145,'cloud-backed coins after refresh');
  console.log('PASS cloud refresh: unsynced coins protected, uploaded, and retained across reload');
  await context.close();
 }
 // Returning account during an API outage should keep local progress and auth,
 // rather than auto-logout and restore an unrelated guest backup.
 {
  const {context,page}=await newPage();
  await context.route('https://hmkcfmogpgljfasvefvs.supabase.co/**',route=>route.abort());
  await seed(page,{local:{
   rikiGuestDemo500GrantedV1:'yes',rickyCoins:'204',
   rikiGuestProgressBackupV1:JSON.stringify({rickyCoins:'12'})
  },session:{
   rikiGuardianSessionV1:JSON.stringify({...TOKEN,expires_at:1}),
   rikiCurrentPlayerV1:PLAYER
  }});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1600);
  await checkCoin(page,204,'offline local coins should remain intact');
  const session=await page.evaluate(()=>sessionStorage.getItem('rikiGuardianSessionV1'));
  assert.ok(session,'temporarily unreachable account must not be silently signed out');
  console.log('PASS offline auth failure: no automatic logout or progress rollback');
  await context.close();
 }
} finally {
 await browser.close();
}
