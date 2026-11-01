/* Guardian-managed cloud profiles. Unlocked Arcade stays playable as a guest. */
(()=>{
'use strict';
const URL='https://hmkcfmogpgljfasvefvs.supabase.co';
const KEY='sb_publishable_o4hKwwXPGA77H66X0RjSjw_4FLEaqfA';
const AUTH='rikiGuardianSessionV1';
const BACKUP='rikiGuestProgressBackupV1';
const KEYS=['rickyCoins','rickyHouseInventoryV1','rickyHouseDecorV1','rickyHouseWallsV1','rickyDreamStorageV2','rickyDreamPetsV2','rickyDreamPositionsV2','rickyRoomInteriorsV3','rickyTinyOwnedV1','rickyTinyPlacedV1','rickyAdventureXPV1','rickySpatialMusicV1','riki3dOrbit','rikiReal3dAz','rikiRootProgressV1','rikiDreamRotationV1','rikiClawPlushV1','rikiPlayTokensV1'];
let session=null,player=null,lastSaved='',interval=null;
const $=id=>document.getElementById(id);
const read=()=>{const x={};KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)x[k]=v;});return x;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function savedSession(){try{return JSON.parse(sessionStorage.getItem(AUTH)||'null')}catch{return null}}
async function api(path,method='GET',body,token=session?.access_token){
 const res=await fetch(URL+path,{method,headers:{apikey:KEY,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(method==='POST'?{Prefer:'return=representation'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const raw=await res.text();let data;try{data=raw?JSON.parse(raw):null}catch{data=raw}
 if(!res.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.error||('Request failed '+res.status));return data;
}
async function refresh(){if(!session)return false;if(session.expires_at && Date.now()/1000<session.expires_at-90)return true;
 try{const x=await api('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:session.refresh_token},null);session={...x,expires_at:Math.floor(Date.now()/1000)+x.expires_in};sessionStorage.setItem(AUTH,JSON.stringify(session));return true}catch{logout();return false}}
function status(s){const n=$('rkAccountStatus');if(n)n.textContent=s}
function modal(html){$('rkAccountPanel').innerHTML=html;$('rkAccountDialog').hidden=false}
function close(){$('rkAccountDialog').hidden=true}
function identity(){return session?.user?.email||'Guardian'}
function logout(){clearInterval(interval);interval=null;session=null;player=null;sessionStorage.removeItem(AUTH);sessionStorage.removeItem('rikiCurrentPlayerV1');const backup=localStorage.getItem(BACKUP);if(backup){try{const original=JSON.parse(backup);KEYS.forEach(k=>{if(Object.hasOwn(original,k))localStorage.setItem(k,original[k]);else localStorage.removeItem(k)})}catch{}}status('Guest • this browser');location.reload();}
async function list(){
 if(!await refresh())return login();
 const guardians=await api('/rest/v1/arcade_guardians?select=user_id&limit=1');
 if(!guardians?.length)await api('/rest/v1/arcade_guardians','POST',{user_id:session.user.id});
 const players=await api('/rest/v1/arcade_players?select=id,nickname&order=created_at.asc');
 const choices=players.map(p=>'<button type="button" data-player="'+esc(p.id)+'">'+esc(p.nickname)+'</button>').join('');
 modal('<h2>Family profiles</h2><p>Signed in as '+esc(identity())+'</p><p>Choose who is playing. Each child has separate cloud progress.</p><div class="rk-account-players">'+choices+'</div><form id="rkAddPlayer"><label>New player nickname <input name="nickname" maxlength="40" required autocomplete="off"></label><button type="submit">Create player</button></form><button type="button" id="rkAccountLogout">Sign out</button><button type="button" id="rkAccountClose">Keep playing here</button><p class="rk-account-message" id="rkAccountMsg" role="status"></p>');
 document.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>switchTo(b.dataset.player));
 $('rkAccountLogout').onclick=()=>{logout();close()};$('rkAccountClose').onclick=close;
 $('rkAddPlayer').onsubmit=async e=>{e.preventDefault();const name=e.target.nickname.value.trim();if(!name)return;try{const created=await api('/rest/v1/arcade_players','POST',{guardian_id:session.user.id,nickname:name});await switchTo(created[0].id)}catch(err){$('rkAccountMsg').textContent=err.message}};
}
async function switchTo(id){
 try{
  if(player && player!==id)await save();
  const rows=await api('/rest/v1/arcade_progress?select=version,snapshot&player_id=eq.'+encodeURIComponent(id));
  const stored=rows[0]?.snapshot;
  if(!localStorage.getItem(BACKUP)){try{localStorage.setItem(BACKUP,JSON.stringify(read()))}catch{}}
  player=id;sessionStorage.setItem('rikiCurrentPlayerV1',id);
  if(stored && Object.keys(stored).length){
   KEYS.forEach(k=>{if(Object.hasOwn(stored,k))localStorage.setItem(k,String(stored[k]));else localStorage.removeItem(k)});
   status('Cloud profile active');close();location.reload();return;
  }
  const hasGuestData=KEYS.some(k=>localStorage.getItem(k)!==null);
  modal('<h2>New player</h2><p>This profile has no saved progress yet.</p><button type="button" id="rkBlank">Start with new progress</button>'+(hasGuestData?'<button type="button" id="rkImport">Import progress from this browser</button>':'')+'<button type="button" id="rkCancel">Cancel</button><p id="rkAccountMsg" role="status"></p>');
  $('rkBlank').onclick=async()=>{try{KEYS.forEach(k=>localStorage.removeItem(k));await save();location.reload()}catch(e){$('rkAccountMsg').textContent=e.message}};
  if($('rkImport'))$('rkImport').onclick=async()=>{try{await save();location.reload()}catch(e){$('rkAccountMsg').textContent=e.message}};
  $('rkCancel').onclick=()=>{player=null;sessionStorage.removeItem('rikiCurrentPlayerV1');list()};
 }catch(err){status('Account error: '+err.message)}
}
async function save(){
 if(!player||!await refresh())return;
 const snapshot=read(),serialized=JSON.stringify(snapshot);if(serialized===lastSaved)return;
 if(serialized.length>900000)throw Error('Progress is too large to sync');
 const rows=await api('/rest/v1/arcade_progress?select=version&player_id=eq.'+encodeURIComponent(player));
 if(rows.length){await api('/rest/v1/arcade_progress?player_id=eq.'+encodeURIComponent(player),'PATCH',{snapshot,updated_at:new Date().toISOString()})}
 else {await api('/rest/v1/arcade_progress','POST',{player_id:player,snapshot})}
 lastSaved=serialized;status('Cloud progress saved');
}
function login(){
 modal('<h2>Guardian sign in</h2><p>Adults can use an email link to manage separate child profiles. No child email needed.</p><form id="rkSignIn"><label>Your email <input name="email" type="email" autocomplete="email" required></label><button type="submit">Send sign-in link</button></form><p id="rkAccountMsg" role="status"></p><button type="button" id="rkAccountClose">Keep playing as guest</button>');
 $('rkAccountClose').onclick=close;
 $('rkSignIn').onsubmit=async e=>{e.preventDefault();try{const email=e.target.email.value.trim();await api('/auth/v1/otp','POST',{email,create_user:true,options:{email_redirect_to:location.origin+location.pathname}} ,null);$('rkAccountMsg').textContent='Check your email for a sign-in link.'}catch(err){$('rkAccountMsg').textContent=err.message}};
}
async function initialize(){
 const token=new URLSearchParams(location.hash.slice(1));
 if(token.has('access_token')){
  session={access_token:token.get('access_token'),refresh_token:token.get('refresh_token'),expires_at:Date.now()/1000+Number(token.get('expires_in')||3600),user:null};
  try{session.user=await api('/auth/v1/user','GET',undefined,session.access_token);sessionStorage.setItem(AUTH,JSON.stringify(session));history.replaceState(null,'',location.pathname+location.search)}catch{logout()}
 }else session=savedSession();
 if(session && await refresh()){
  if(!session.user){try{session.user=await api('/auth/v1/user');sessionStorage.setItem(AUTH,JSON.stringify(session))}catch{logout()}}
  const active=sessionStorage.getItem('rikiCurrentPlayerV1');
  if(active){try{const owned=await api('/rest/v1/arcade_players?id=eq.'+encodeURIComponent(active)+'&select=id');if(owned.length){player=active;const rows=await api('/rest/v1/arcade_progress?select=snapshot&player_id=eq.'+encodeURIComponent(active));if(rows[0]?.snapshot){const snapshot=rows[0].snapshot;KEYS.forEach(k=>{if(Object.hasOwn(snapshot,k))localStorage.setItem(k,String(snapshot[k]));else localStorage.removeItem(k)});lastSaved=JSON.stringify(read())}}}catch{player=null}}
  status(player?'Cloud profile active':'Guardian signed in');if(player)interval=setInterval(()=>save().catch(err=>status('Cloud save error: '+err.message)),15000);
  else if(token.has('access_token'))list();
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 const bar=document.createElement('div');bar.id='rkAccountBar';bar.innerHTML='<button type="button" id="rkAccountOpen">👨‍👩‍👧 Family accounts</button> <span id="rkAccountStatus" role="status">Guest • this browser</span>';
 const host=document.querySelector('main#app');host.parentElement.insertBefore(bar,host);
 const dialog=document.createElement('section');dialog.id='rkAccountDialog';dialog.hidden=true;dialog.innerHTML='<div id="rkAccountPanel"></div>';host.parentElement.insertBefore(dialog,host);
 $('rkAccountOpen').onclick=()=>session?list():login();
 initialize().catch(err=>status('Account unavailable: '+err.message));
 window.addEventListener('pagehide',()=>{if(player)save().catch(()=>{})});
});
})();
