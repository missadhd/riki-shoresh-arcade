/* Guardian-managed cloud profiles. Unlocked Arcade stays playable as a guest. */
(()=>{
'use strict';
const URL='https://hmkcfmogpgljfasvefvs.supabase.co';
const KEY='sb_publishable_o4hKwwXPGA77H66X0RjSjw_4FLEaqfA';
const AUTH='rikiGuardianSessionV1';
const REMEMBER='rikiRememberGuardianV1',PENDING='rikiRememberPendingV1',PLAYER='rikiCurrentPlayerV1';
const durable=()=>localStorage.getItem(REMEMBER)==='yes';
function storeSession(){if(!session)return;sessionStorage.setItem(AUTH,JSON.stringify(session));if(durable())localStorage.setItem(AUTH,JSON.stringify(session));}
function storePlayer(id){sessionStorage.setItem(PLAYER,id);if(durable())localStorage.setItem(PLAYER,id);}
const BACKUP='rikiGuestProgressBackupV1';
const DISPLAY='rikiCurrentPlayerNameV1';
const KEYS=['rickyCoins','rickyHouseInventoryV1','rickyHouseDecorV1','rickyHouseWallsV1','rickyDreamStorageV2','rickyDreamPetsV2','rickyDreamPositionsV2','rickyRoomInteriorsV3','rickyTinyOwnedV1','rickyTinyPlacedV1','rickyAdventureXPV1','rickySpatialMusicV1','riki3dOrbit','rikiReal3dAz','rikiRootProgressV1','rikiDreamRotationV1','rikiClawPlushV1','rikiPlayTokensV1'];
let session=null,player=null,lastSaved='',interval=null;
const $=id=>document.getElementById(id);
const read=()=>{const x={};KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)x[k]=v;});return x;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function savedSession(){try{return JSON.parse((durable()?localStorage.getItem(AUTH):null)||sessionStorage.getItem(AUTH)||'null')}catch{return null}}
async function api(path,method='GET',body,token=session?.access_token){
 const res=await fetch(URL+path,{method,headers:{apikey:KEY,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(method==='POST'?{Prefer:'return=representation'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const raw=await res.text();let data;try{data=raw?JSON.parse(raw):null}catch{data=raw}
 if(!res.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.error||('Request failed '+res.status));return data;
}
async function refresh(){if(!session)return false;if(session.expires_at && Date.now()/1000<session.expires_at-90)return true;
 try{const x=await api('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:session.refresh_token},null);session={...x,expires_at:Math.floor(Date.now()/1000)+x.expires_in};storeSession();return true}catch{logout();return false}}
function status(s){const n=$('rkAccountStatus');if(n)n.textContent=s;const b=$('rkAccountOpen');if(b)b.textContent=player?'👤 '+(sessionStorage.getItem(DISPLAY)||'Switch player'):'👤 Choose player'}
function greet(){const name=sessionStorage.getItem(DISPLAY);const el=document.querySelector('.hub-hi h1');if(el){const desired=name?'Hi '+name+'! 👋':'Hi there! 👋';if(el.textContent!==desired)el.textContent=desired;}document.querySelectorAll('.brand').forEach(el=>{if(el.textContent.includes("Riki's"))el.textContent='🌈 Homework & Social Skills Games';});}
function neutralHeadings(){
 document.querySelectorAll('h1,h2,h3').forEach(el=>{
  if(el.textContent.trim()==="Riki's Big Day")el.textContent='A Big Day Adventure';
  else if(el.textContent.trim()==="Riki's Dream Dollhouse")el.textContent='My Dream Dollhouse';
 });
}
const greetingObserver=new MutationObserver(()=>{greet();neutralHeadings()});
function modal(html){$('rkAccountPanel').innerHTML='<button type="button" id="rkDialogDismiss" aria-label="Close account panel">×</button>'+html;$('rkAccountDialog').hidden=false;$('rkDialogDismiss').onclick=close;}
function close(){$('rkAccountDialog').hidden=true}
function identity(){return session?.user?.email||'Guardian'}
function logout(){clearInterval(interval);interval=null;session=null;player=null;sessionStorage.removeItem(AUTH);localStorage.removeItem(AUTH);localStorage.removeItem(REMEMBER);sessionStorage.removeItem(PLAYER);localStorage.removeItem(PLAYER);sessionStorage.removeItem(DISPLAY);const backup=localStorage.getItem(BACKUP);if(backup){try{const original=JSON.parse(backup);KEYS.forEach(k=>{if(Object.hasOwn(original,k))localStorage.setItem(k,original[k]);else localStorage.removeItem(k)})}catch{}}status('Guest • this browser');location.reload();}
async function list(){
 if(!await refresh())return login();
 const guardians=await api('/rest/v1/arcade_guardians?select=user_id&limit=1');
 if(!guardians?.length)await api('/rest/v1/arcade_guardians','POST',{user_id:session.user.id});
 const players=await api('/rest/v1/arcade_players?select=id,nickname&order=created_at.asc');
 const choices=players.map(p=>'<button class="rk-profile-card" type="button" data-player="'+esc(p.id)+'"><span class="rk-profile-avatar" aria-hidden="true">'+esc(p.nickname.slice(0,1).toUpperCase())+'</span><span>'+esc(p.nickname)+'</span></button>').join('');
 modal('<h2>Who is playing?</h2><p>Signed in as '+esc(identity())+'</p><p>Select a player to continue with their own coins, learning progress, and dollhouse.</p><div class="rk-account-players">'+choices+'</div><form id="rkAddPlayer"><label>New player nickname <input name="nickname" maxlength="40" required autocomplete="off"></label><button type="submit">Create player</button></form><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="rkRememberNow" style="width:auto" '+(durable()?'checked':'')+'> Remember my adult sign-in on this trusted computer</label><button type="button" id="rkAccountLogout">Sign out</button><button type="button" id="rkAccountClose">Keep playing here</button><p class="rk-account-message" id="rkAccountMsg" role="status"></p>');
 document.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>switchTo(b.dataset.player,b.textContent));
 $('rkRememberNow').onchange=e=>{if(e.target.checked){localStorage.setItem(REMEMBER,'yes');storeSession();if(player)storePlayer(player)}else{localStorage.removeItem(REMEMBER);localStorage.removeItem(AUTH);localStorage.removeItem(PLAYER)};};
 $('rkAccountLogout').onclick=()=>{logout();close()};$('rkAccountClose').onclick=close;
 $('rkAddPlayer').onsubmit=async e=>{e.preventDefault();const name=e.target.nickname.value.trim();if(!name)return;try{const created=await api('/rest/v1/arcade_players','POST',{guardian_id:session.user.id,nickname:name});await switchTo(created[0].id,name)}catch(err){$('rkAccountMsg').textContent=err.message}};
}
async function switchTo(id,nickname){
 try{
  if(player && player!==id)await save();
  const rows=await api('/rest/v1/arcade_progress?select=version,snapshot&player_id=eq.'+encodeURIComponent(id));
  const stored=rows[0]?.snapshot;
  if(!localStorage.getItem(BACKUP)){try{localStorage.setItem(BACKUP,JSON.stringify(read()))}catch{}}
  player=id;storePlayer(id);if(nickname)sessionStorage.setItem(DISPLAY,nickname);greet();status('Cloud profile active');
  if(stored && Object.keys(stored).length){
   KEYS.forEach(k=>{if(Object.hasOwn(stored,k))localStorage.setItem(k,String(stored[k]));else localStorage.removeItem(k)});
   status('Cloud profile active');close();location.reload();return;
  }
  const hasGuestData=KEYS.some(k=>localStorage.getItem(k)!==null);
  modal('<h2>New player</h2><p>This profile has no saved progress yet.</p><button type="button" id="rkBlank">Start with new progress</button>'+(hasGuestData?'<button type="button" id="rkImport">Import progress from this browser</button>':'')+'<button type="button" id="rkCancel">Cancel</button><p id="rkAccountMsg" role="status"></p>');
  $('rkBlank').onclick=async()=>{try{KEYS.forEach(k=>localStorage.removeItem(k));await save();location.reload()}catch(e){$('rkAccountMsg').textContent=e.message}};
  if($('rkImport'))$('rkImport').onclick=async()=>{try{await save();location.reload()}catch(e){$('rkAccountMsg').textContent=e.message}};
  $('rkCancel').onclick=()=>{player=null;sessionStorage.removeItem(PLAYER);localStorage.removeItem(PLAYER);sessionStorage.removeItem(DISPLAY);list()};
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
async function openRiki(){
 if(!session||!await refresh()){login();status('Adult email sign-in is required before using a cloud player.');return;}
 try{
  const players=await api('/rest/v1/arcade_players?select=id,nickname&order=created_at.asc');
  const matching=players.filter(p=>p.nickname.trim().toLowerCase()==='riki');
  if(matching.length===1){await switchTo(matching[0].id,matching[0].nickname);return;}
  await list();
  const note=$('rkAccountMsg');if(note)note.textContent=matching.length>1?'Choose the correct Riki profile.':'Create a player named Riki under your adult account, then select her. Existing browser progress will not import without your choice.';
 }catch(e){status('Account unavailable: '+e.message)}
}
function login(){
 modal('<h2>Adult sign in</h2><p>Adults can use an email link to manage separate child profiles. No child email needed.</p><form id="rkSignIn"><label>Your email <input name="email" type="email" autocomplete="email" required></label><label style="display:flex;align-items:center;gap:8px"><input type="checkbox" name="remember" style="width:auto"> Remember me on this trusted computer</label><small>Leave this off on school or shared computers. Selecting it keeps your guardian sign-in on this browser until you sign out.</small><button type="submit">Send sign-in link</button></form><p id="rkAccountMsg" role="status"></p><button type="button" id="rkAccountClose">Keep playing as guest</button>');
 $('rkAccountClose').onclick=close;
 $('rkSignIn').onsubmit=async e=>{e.preventDefault();try{const email=e.target.email.value.trim();localStorage.setItem(PENDING,e.target.remember.checked?'yes':'no');const notice=$('rkAccountMsg');const send=e.target.querySelector('button[type="submit"]');send.disabled=true;notice.textContent='Requesting your email link…';try{await api('/auth/v1/otp?redirect_to='+encodeURIComponent(location.origin+location.pathname),'POST',{email,create_user:true},null);notice.textContent='Sign-in link requested successfully. Check your inbox and spam folder. Delivery may take a few minutes.'}finally{send.disabled=false}}catch(err){$('rkAccountMsg').textContent='Could not send sign-in link: '+err.message}};
}
async function initialize(){
 const token=new URLSearchParams(location.hash.slice(1));
 if(token.has('access_token')){
  const intent=localStorage.getItem(PENDING);if(intent==='yes')localStorage.setItem(REMEMBER,'yes');else if(intent==='no'){localStorage.removeItem(REMEMBER);localStorage.removeItem(AUTH);localStorage.removeItem(PLAYER)}localStorage.removeItem(PENDING);
  session={access_token:token.get('access_token'),refresh_token:token.get('refresh_token'),expires_at:Date.now()/1000+Number(token.get('expires_in')||3600),user:null};
  try{session.user=await api('/auth/v1/user','GET',undefined,session.access_token);storeSession();history.replaceState(null,'',location.pathname+location.search)}catch{logout()}
 }else session=savedSession();
 if(session && await refresh()){
  if(!session.user){try{session.user=await api('/auth/v1/user');storeSession()}catch{logout()}}
  const active=sessionStorage.getItem(PLAYER)||(durable()?localStorage.getItem(PLAYER):null);
  if(active){try{const owned=await api('/rest/v1/arcade_players?id=eq.'+encodeURIComponent(active)+'&select=id');if(owned.length){player=active;storePlayer(active);const names=await api('/rest/v1/arcade_players?id=eq.'+encodeURIComponent(active)+'&select=nickname');if(names[0]?.nickname)sessionStorage.setItem(DISPLAY,names[0].nickname);greet();const rows=await api('/rest/v1/arcade_progress?select=snapshot&player_id=eq.'+encodeURIComponent(active));if(rows[0]?.snapshot){const snapshot=rows[0].snapshot;const incoming=JSON.stringify(snapshot);const current=JSON.stringify(read());if(incoming!==current){KEYS.forEach(k=>{if(Object.hasOwn(snapshot,k))localStorage.setItem(k,String(snapshot[k]));else localStorage.removeItem(k)});location.reload();return;}lastSaved=current}}}catch{player=null}}
  status(player?'Cloud profile active':'Guardian signed in');if(player)interval=setInterval(()=>save().catch(err=>status('Cloud save error: '+err.message)),15000);
  else if(token.has('access_token'))list();
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 const bar=document.createElement('div');bar.id='rkAccountBar';bar.innerHTML='<button type="button" id="rkAccountOpen">👤 Choose player</button> <span id="rkAccountStatus" role="status">Guest • this browser</span>';
 const host=document.querySelector('main#app');host.parentElement.insertBefore(bar,host);
 const dialog=document.createElement('section');dialog.id='rkAccountDialog';dialog.hidden=true;dialog.innerHTML='<div id="rkAccountPanel"></div>';host.parentElement.insertBefore(dialog,host);
 $('rkAccountOpen').onclick=()=>session?list():login();

 greetingObserver.observe(host,{subtree:true,childList:true});greet();neutralHeadings();
 initialize().catch(err=>status('Account unavailable: '+err.message));
 window.addEventListener('pagehide',()=>{if(player)save().catch(()=>{})});
});
})();
