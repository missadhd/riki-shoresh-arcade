
/* Riki Real 3D: one shared Three.js engine for the room editor and the whole-house view.
   Reads and writes the game's own saved data (owned, decor, dreamPosition, roomInteriors) through the game's functions. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=code=>{try{(0,eval)(code)}catch(e){}};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const THREE_URL='assets/vendor/three-r128.min.js',THREE_CDN='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';/* local copy is byte-identical to cdnjs r128; CDN is only a fallback */
let threeWaiters=null;
function loadThree(cb,fail){if(window.THREE)return cb();if(threeWaiters){threeWaiters.push([cb,fail]);return;}threeWaiters=[[cb,fail]];const add=(url,next)=>{const s=document.createElement('script');s.src=url;s.onload=()=>{const w=threeWaiters;threeWaiters=null;w.forEach(x=>x[0]());};s.onerror=()=>{s.remove();if(next)return add(next,null);const w=threeWaiters;threeWaiters=null;w.forEach(x=>x[1]&&x[1]());};document.head.appendChild(s);};add(THREE_URL,THREE_CDN);}

/* ================= styles ================= */
const css=`.rk3-room{position:relative;height:clamp(300px,94vw,460px);width:100%;max-width:840px;border-radius:26px;overflow:hidden;touch-action:none;background:linear-gradient(#f7ebe4,#efe0d6);border:3px solid #fff;box-shadow:0 18px 34px -16px #4a233866;margin:10px auto}
.rk3-room canvas{display:block;width:100%;height:100%;outline:none}
.rk3-room .riki3d-hud{position:absolute;left:10px;right:10px;top:10px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;pointer-events:none;z-index:2}
@media(max-width:600px){.rk3-room .riki3d-hud{top:6px;left:6px;right:6px;gap:4px;justify-content:center;align-content:start}.rk3-room .riki3d-hud span{font-size:11px;padding:3px 7px}.rk3-room .riki3d-hud span:nth-child(2){display:none}.rk3-room .riki3d-hud button{font-size:12px!important;padding:4px 8px!important;min-height:29px!important;margin-left:0!important}}\n.rk3-room .riki3d-hud span{background:#ffffffde;border-radius:999px;padding:5px 12px;font-weight:800;font-size:13px;color:#4a2338;box-shadow:0 2px 8px #0001}
.rk3-load{position:absolute;inset:0;display:grid;place-items:center;font-weight:800;color:#8a6577;text-align:center;padding:24px}
.wh3d{position:fixed;inset:0;z-index:9999;background:#fff1e8;display:flex;flex-direction:column;gap:12px;overflow-y:auto;padding:calc(12px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(16px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));font-family:"Nunito","Segoe UI",system-ui,sans-serif;color:#4a2338}
.wh3d[hidden]{display:none!important}
.wh3d-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.wh3d-top b{font-family:"Baloo 2","Trebuchet MS",system-ui,sans-serif;font-size:1.5rem;line-height:1.1}
.wh3d-top button{background:#fff;border:2px solid #f3d6dc;border-radius:999px;padding:8px 14px;font-weight:800;color:#4a2338}
.wh3d-stage{position:relative;flex:1;min-height:340px;max-height:64vh;border-radius:28px;overflow:hidden;background:linear-gradient(#a9d8f5,#e6f5ff 72%);border:3px solid #fff;box-shadow:0 10px 30px -12px #e2457a55;touch-action:none}
.wh3d-stage canvas{display:block;width:100%;height:100%}
.wh3d-hint{position:absolute;left:12px;top:10px;background:#ffffffd9;border-radius:999px;padding:4px 12px;font-weight:800;font-size:.8rem;color:#8a6577;pointer-events:none;z-index:2}
.wh3d-ctl{position:absolute;right:10px;bottom:10px;display:flex;gap:8px;z-index:2}
.wh3d-ctl button{width:44px;height:44px;border-radius:50%;background:#ffffffe6;border:0;font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:1.3rem;color:#4a2338;box-shadow:0 2px 6px #0002}
.wh3d-chips{display:flex;flex-wrap:wrap;gap:8px}
.wh3d-chips button{padding:9px 15px;border-radius:999px;background:#fff;border:2px solid #f3d6dc;font-weight:800;color:#4a2338}
.wh3d-chips button[aria-pressed="true"]{background:#e2457a;border-color:#e2457a;color:#fff}
.wh3d-go{padding:14px;border-radius:16px;border:0;background:#e2457a;color:#fff;font-weight:900;font-size:1.05rem;box-shadow:0 4px 0 #b92e5e}
.wh3d-go[disabled]{background:#eedde2;color:#8a6577;box-shadow:none}
.wh3d button:focus-visible{outline:3px solid #7cc4f2;outline-offset:2px}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ================= textures ================= */
let T={};
function canvasTex(key,w,h,draw,rep){
  if(T[key])return T[key];
  const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;if(rep)t.repeat.set(rep[0],rep[1]);T[key]=t;return t;
}
const rnd=(()=>{let s=7;return()=>{s=(s*16807)%2147483647;return s/2147483647;}})();
function shadeHex(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=cl(Math.round(r*f),0,255);g=cl(Math.round(g*f),0,255);b=cl(Math.round(b*f),0,255);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1);}
function woodFloor(){return canvasTex('floor',512,512,(x,w,h)=>{
  const tones=['#c89363','#bb8556','#d19f6f','#b47c4e','#c58d5c'];const rowH=64;
  for(let r=0;r<h/rowH;r++){let px=-(r%2)*120;while(px<w){const len=160+rnd()*220;const col=tones[Math.floor(rnd()*tones.length)];x.fillStyle=col;x.fillRect(px,r*rowH,len,rowH);
    for(let g=0;g<9;g++){x.strokeStyle=`rgba(90,50,25,${.05+rnd()*.08})`;x.lineWidth=1+rnd()*1.5;x.beginPath();const y0=r*rowH+4+rnd()*(rowH-8);x.moveTo(px,y0);x.bezierCurveTo(px+len*.3,y0+rnd()*6-3,px+len*.7,y0+rnd()*6-3,px+len,y0+rnd()*4-2);x.stroke();}
    if(rnd()<.35){x.fillStyle='rgba(90,50,25,.18)';x.beginPath();x.ellipse(px+len*rnd(),r*rowH+rowH/2,8,4,0,0,7);x.fill();}
    x.fillStyle='rgba(60,32,16,.55)';x.fillRect(px,r*rowH,2,rowH);px+=len;}
    x.fillStyle='rgba(60,32,16,.5)';x.fillRect(0,r*rowH,w,2);}
});}
function woodGrain(base){return canvasTex('grain'+base,256,256,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.strokeStyle=`rgba(70,38,18,${.04+rnd()*.08})`;x.lineWidth=1+rnd()*2;const y=rnd()*h;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(w*.3,y+rnd()*10-5,w*.6,y+rnd()*10-5,w,y+rnd()*8-4);x.stroke();}});}
function grassTex(){return canvasTex('grass',256,256,(x,w,h)=>{x.fillStyle='#7cc46f';x.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const g=Math.floor(120+rnd()*80);x.strokeStyle=`rgba(${40+rnd()*40|0},${g},${50+rnd()*30|0},.55)`;x.lineWidth=1;const px=rnd()*w,py=rnd()*h;x.beginPath();x.moveTo(px,py);x.lineTo(px+rnd()*3-1.5,py-3-rnd()*5);x.stroke();}},[6,6]);}
function sidingTex(){return canvasTex('siding',256,256,(x,w,h)=>{for(let r=0;r<8;r++){const g=x.createLinearGradient(0,r*32,0,r*32+32);g.addColorStop(0,'#ffc7d6');g.addColorStop(.85,'#f9b1c6');g.addColorStop(1,'#d98aa3');x.fillStyle=g;x.fillRect(0,r*32,w,32);}},[3,4]);}
function shingleTex(){return canvasTex('shingle',256,256,(x,w,h)=>{x.fillStyle='#b92e5e';x.fillRect(0,0,w,h);for(let r=0;r<10;r++)for(let c=-1;c<9;c++){const px=c*32+(r%2)*16,py=r*26;x.fillStyle=['#d63d70','#c9356a','#e2457a'][(r+c+9)%3];x.beginPath();x.moveTo(px,py);x.lineTo(px+30,py);x.lineTo(px+30,py+20);x.quadraticCurveTo(px+15,py+30,px,py+20);x.closePath();x.fill();x.strokeStyle='rgba(80,10,35,.35)';x.stroke();}},[4,3]);}
function skyTex(){return canvasTex('sky',64,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#7fc3ee');g.addColorStop(.7,'#d8f0ff');g.addColorStop(1,'#bfe3b9');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#ffffffcc';x.beginPath();x.arc(20,40,9,0,7);x.arc(32,36,11,0,7);x.arc(44,42,8,0,7);x.fill();});}
function rugTex(seed){return canvasTex('rug'+seed,256,256,(x,w,h)=>{const cols=[['#7fd1c0','#ffd96b','#f28db2','#fff4e6'],['#f7b2c4','#fff4e6','#e2457a','#c8a2ff']][seed%2];for(let i=0;i<10;i++){x.fillStyle=cols[i%cols.length];x.beginPath();x.arc(w/2,h/2,w/2-i*12,0,7);x.fill();}for(let i=0;i<4000;i++){x.fillStyle=`rgba(255,255,255,${rnd()*.08})`;x.fillRect(rnd()*w,rnd()*h,1,1);}});}
function stoneTex(){return canvasTex('stone',128,128,(x,w,h)=>{x.fillStyle='#d9cfc1';x.fillRect(0,0,w,h);for(let i=0;i<500;i++){x.fillStyle=`rgba(${120+rnd()*60|0},${110+rnd()*50|0},${100+rnd()*40|0},.25)`;x.fillRect(rnd()*w,rnd()*h,2,2);}});}

/* wallpaper */
function starPath(x,cx,cy,r){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();}
function heartPath(x,cx,cy,s){x.beginPath();x.moveTo(cx,cy+s*.35);x.bezierCurveTo(cx-s,cy-s*.3,cx-s*.4,cy-s,cx,cy-s*.45);x.bezierCurveTo(cx+s*.4,cy-s,cx+s,cy-s*.3,cx,cy+s*.35);x.closePath();}
function patternKey(t){const s=(t[0]+' '+t[2]).toLowerCase();return s.includes('rose')?'roses':/heart|sweet|love/.test(s)?'hearts':/star|twinkle|galaxy/.test(s)?'stars':s.includes('cloud')?'clouds':/daisy|flower|meadow|floral/.test(s)?'daisies':/stripe|candy|pleat/.test(s)?'stripes':/dot|polka|lemon|confetti/.test(s)?'dots':'plain';}
function wallTex(key,base){return canvasTex('wall'+key+base,256,256,(x)=>{
  // Soft clay wall: gentle gradient, soft edges
  const g=x.createRadialGradient(128,128,0,128,128,180);
  g.addColorStop(0,base);g.addColorStop(1,shadeHex(base,.92));
  x.fillStyle=g;x.fillRect(0,0,256,256);
  x.fillStyle=base;x.fillRect(0,0,256,256);
  for(let i=0;i<3000;i++){x.fillStyle=`rgba(255,255,255,${rnd()*.05})`;x.fillRect(rnd()*256,rnd()*256,1,1);}
  const grid=(step,fn)=>{for(let r=0;r<=256/step;r++)for(let q=0;q<=256/step;q++)fn(q*step+(r%2?step/2:0),r*step,r);};
  if(key==='plain'){x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=2;for(let i=0;i<256;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke();}}
  if(key==='roses')grid(64,(px,py)=>{x.fillStyle='#6fbf7f';x.beginPath();x.ellipse(px-14,py+8,9,5,-.6,0,7);x.fill();x.beginPath();x.ellipse(px+14,py+8,9,5,.6,0,7);x.fill();[['#e8628f',14],['#f590b2',10],['#e8628f',6],['#ffc1d4',3]].forEach(([col,r])=>{x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,7);x.fill();});});
  if(key==='hearts')grid(48,(px,py,r)=>{x.fillStyle=r%2?'#ffa3c2':'#ff6f9f';heartPath(x,px,py,14);x.fill();});
  if(key==='stars'){grid(56,(px,py)=>{x.fillStyle='#fff3a8';starPath(x,px,py,13);x.fill();});x.fillStyle='#fff';grid(28,(px,py)=>{x.beginPath();x.arc(px+12,py+10,1.8,0,7);x.fill();});}
  if(key==='clouds'){x.fillStyle='#fff';grid(80,(px,py)=>{[[0,0,16],[-16,6,11],[16,6,11],[-6,-8,10]].forEach(([dx,dy,r])=>{x.beginPath();x.arc(px+dx,py+dy,r,0,7);x.fill();});});}
  if(key==='daisies')grid(56,(px,py)=>{x.fillStyle='#fff';for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.ellipse(px+Math.cos(a)*9,py+Math.sin(a)*9,6,3.5,a,0,7);x.fill();}x.fillStyle='#ffc943';x.beginPath();x.arc(px,py,5,0,7);x.fill();});
  if(key==='stripes'){x.fillStyle='rgba(255,255,255,.5)';for(let k=0;k<4;k++)x.fillRect(k*64,0,32,256);}
  if(key==='dots'){x.fillStyle='rgba(255,255,255,.7)';grid(40,(px,py)=>{x.beginPath();x.arc(px,py,8,0,7);x.fill();});}
});}
const WALL_DEFAULT={bedroom:'#f3cad5',living:'#f6dcc8',kitchen:'#fcebdf',bathroom:'#d6ece3',playroom:'#fbe2c8',garden:'#e8f5e8'};
function roomWallBase(room){const painted=(G('wallColors')||{})[room];let b=painted||WALL_DEFAULT[room]||'#fbe3f4';if(!/^#[0-9a-f]{6}$/i.test(b))b='#fbe3f4';return b;}
function tileTex(a,b,grout,n,key){return canvasTex('tile'+key,256,256,(x,w,h)=>{x.fillStyle=grout;x.fillRect(0,0,w,h);const s=w/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){x.fillStyle=(i+j)%2?a:b;const r=6,px=i*s+2,py=j*s+2,pw=s-4,ph=s-4;x.beginPath();x.moveTo(px+r,py);x.arcTo(px+pw,py,px+pw,py+ph,r);x.arcTo(px+pw,py+ph,px,py+ph,r);x.arcTo(px,py+ph,px,py,r);x.arcTo(px,py,px+pw,py,r);x.fill();}});}
/* Each room's built-in walls: window style and a wall finish (backsplash, tile wainscot, painted half wall) */
function roomFeatures(g,id,W,D,H){
  const band=(h,y,matr,sides)=>{const b=add(g,new THREE.BoxGeometry(W,h,.03),matr,0,y,-D/2+.016);b.castShadow=false;if(sides)[-1,1].forEach(sd=>{const m=add(g,new THREE.BoxGeometry(.03,h,D),matr,sd*(W/2-.016),y,0);m.castShadow=false;});};
  const rail=(y,sides,c='#fffaf4')=>{RB(g,W,.06,.06,.02,mat(c,.6),0,y,-D/2+.04);if(sides)[-1,1].forEach(sd=>RB(g,.06,.06,D,.02,mat(c,.6),sd*(W/2-.04),y,0));};
  const round=(x,y,z,ry,r)=>{const w=new THREE.Group();w.position.set(x,y,z);w.rotation.y=ry;g.add(w);const gl=add(w,new THREE.CircleGeometry(r,40),new THREE.MeshBasicMaterial({map:skyTex()}),0,0,.005);gl.castShadow=false;const fr=add(w,new THREE.TorusGeometry(r,.07,14,48),mat('#ffffff',.45),0,0,.04);BX(w,.04,r*2,.03,mat('#ffffff',.45),0,0,.03);BX(w,r*2,.04,.03,mat('#ffffff',.45),0,0,.03);return w;};
  if(id==='kitchen'){const t=tileTex('#bfe3cf','#cfeadb','#f8fbf6',8,'kit').clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(W/1.2,.7/1.2);band(.7,1.25,mat('#ffffff',.6,0,{map:t}),false);rail(1.62,false);const w=windowOn(g,.6,H*.66,-D/2+.01,0,id);w.scale.set(1.35,.85,1);}
  else if(id==='bathroom'){const t=tileTex('#ffffff','#e3f4ec','#cfe6dc',6,'bath').clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(W/1.1,1.1/1.1);band(1.1,.55,mat('#ffffff',.55,0,{map:t}),true);const ts=tileTex('#ffffff','#e3f4ec','#cfe6dc',6,'bath').clone();ts.needsUpdate=true;rail(1.12,true);round(-.4,H*.66,-D/2+.01,0,.42);}
  else if(id==='playroom'){band(1.05,.525,mat(shadeHex(roomWallBase(id),.86),.9),true);rail(1.06,true,'#fff3fb');round(-W*.22,H*.62,-D/2+.01,0,.45);windowOn(g,W*.2,H*.58,-D/2+.01,0,id);}
  else if(id==='living'){const w=windowOn(g,-.2,H*.58,-D/2+.01,0,id);w.scale.set(1.6,1,1);windowOn(g,W/2-.01,H*.58,0,-Math.PI/2,id);}
  else {windowOn(g,-W*.18,H*.58,-D/2+.01,0,id);}
  // Built-in architectural details are part of each room, not free shop
  // furniture. They don't enter inventory, placement, or saved progress.
  const detail=new THREE.Group();detail.name='built-in-room-detail';g.add(detail);
  const back=-D/2+.12;
  if(id==='kitchen'){
    const cream=mat('#fff8ef',.85),sage=mat('#a9cbb9',.85);
    BX(detail,1.12,.54,.24,cream,-W*.26,1.95,back+.08);
    BX(detail,1.12,.045,.31,wood('#d9b58e'),-W*.26,1.65,back+.13);
    BX(detail,.035,.44,.03,sage,-W*.26,1.95,back+.235);
    BX(detail,.7,.055,.24,wood('#d9b58e'),W*.28,1.9,back+.09);
    [-.23,.23].forEach(dx=>CY(detail,.065,.065,.18,mat('#f4c8c9'),W*.28+dx,2.02,back+.09,12));
  }else if(id==='bathroom'){
    const aqua=mat('#b9dcd9'),ivory=mat('#fffaf5');
    BX(detail,1.05,.08,.19,ivory,W*.26,1.18,back+.07);
    [-.35,.35].forEach(dx=>CY(detail,.055,.055,.17,aqua,W*.26+dx,1.3,back+.08,12));
    BX(detail,.85,.045,.18,ivory,W*.26,1.8,back+.06);
    BX(detail,.1,.42,.09,mat('#e6c4cf'),-W*.36,1.3,back+.08);
    BX(detail,.35,.07,.09,mat('#f5d7e1'),-W*.36,1.5,back+.08);
  }else if(id==='living'){
    const trim=mat('#f8f0e4'),wooden=wood('#d4ad91');
    BX(detail,1.25,.09,.2,wooden,W*.24,1.72,back+.08);
    [-.42,0,.42].forEach(dx=>BX(detail,.18,.28,.08,mat(dx===0?'#e5b7ad':'#e8d9c5'),W*.24+dx,1.91,back+.08));
    BX(detail,1.05,.7,.05,trim,W*.24,.53,back+.04);
    BX(detail,.87,.53,.07,mat('#c8aaa1'),W*.24,.55,back+.085);
  }else if(id==='playroom'){
    const pink=mat('#f3b9d0'),mint=mat('#bce5d7'),ivory=mat('#fff8e9');
    BX(detail,1.55,.62,.065,ivory,0,1.45,back+.02);
    [-.48,0,.48].forEach((dx,i)=>BX(detail,.36,.36,.075,[pink,mint,mat('#f4dca9')][i],dx,1.46,back+.07));
    BX(detail,1.7,.075,.19,wood('#e6b99d'),0,.65,back+.1);
    BX(detail,.24,.29,.07,pink,-W*.3,2.02,back+.06);
    BX(detail,.24,.29,.07,mint,-W*.3+.31,2.02,back+.06);
  }else if(id==='bedroom'){
    const pink=mat('#f3d6e4'),cream=mat('#fff8f0');
    BX(detail,1.1,.12,.12,wood('#e8c5ad'),W*.23,1.68,back+.06);
    BX(detail,.42,.52,.045,cream,W*.23,2.06,back+.035);
    BX(detail,.28,.39,.05,pink,W*.23,2.06,back+.075);
  }
}
function wallFor(room){
  const owned=G('owned')||[],ri=(G('roomInteriors')||{})[room]||{},INTER=G('INTERIORS')||[];
  const w=INTER.find(t=>t[0]===ri.wall&&owned.includes(t[0]));
  if(w)return wallTex(patternKey(w),/^#[0-9a-f]{6}$/i.test(w[3])?w[3]:'#fbe3f4');
  let base=roomWallBase(room);
  return wallTex('plain',base);
}
function curtainFor(room){
  const owned=G('owned')||[],ri=(G('roomInteriors')||{})[room]||{},INTER=G('INTERIORS')||[];
  const c=INTER.find(t=>t[0]===ri.curtain&&owned.includes(t[0]));
  const cols=c?(String(c[4]).match(/#[0-9a-f]{6}/gi)||[c[3]]):['#e9a3c2','#f9d3e4'];
  return canvasTex('curtain'+cols.join(),128,128,(x,w,h)=>{const sw=w/cols.length/2;for(let i=0;i<w/sw;i++){x.fillStyle=cols[i%cols.length];x.fillRect(i*sw,0,sw,h);}});
}

/* ================= materials & shapes ================= */
const matCache={};
function mat(c,rough=.75,metal=0,extra){
  // Soft clay dollhouse: matte, slightly defined edges, warm.
  if(rough>=.2&&metal<.5&&!(extra&&(extra.transparent||extra.emissive))){rough=Math.max(.85,Math.min(.92,rough));}
  const k=c+rough+metal+(extra?JSON.stringify(Object.keys(extra)):'');if(!extra&&matCache[k])return matCache[k];
  const m=new THREE.MeshStandardMaterial(Object.assign({color:new THREE.Color(c).convertSRGBToLinear(),roughness:rough,metalness:metal,envMapIntensity:.35},extra||{}));if(!extra)matCache[k]=m;return m;}
const fabric=c=>mat(c,.82),gloss=c=>mat(c,.18),wood=(c='#e8c9a0')=>mat(c,.72),metalM=(c='#f2d9a0')=>mat(c,.45,.18);
const geoCache={};
function rbox(w,h,d,r){const k=[w,h,d,r].join();if(geoCache[k])return geoCache[k];r=Math.min(r,w/2-.001,h/2-.001,d/2-.001);
  const s=new THREE.Shape(),x=-w/2+r,y=-h/2+r,W=w-2*r,H=h-2*r;s.moveTo(x,y);s.lineTo(x+W,y);s.lineTo(x+W,y+H);s.lineTo(x,y+H);s.lineTo(x,y);
  const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.001,d-2*r),bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:4,curveSegments:4});g.center();g.computeVertexNormals();g.userData.rikiShared=true;g.userData.dims=[w,h,d,r];geoCache[k]=g;return g;}
function add(g,geo,m,x,y,z){const o=new THREE.Mesh(geo,m);o.position.set(x||0,y||0,z||0);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
const RB=(g,w,h,d,r,m,x,y,z)=>add(g,rbox(w,h,d,r),m,x,y,z);
const BX=(g,w,h,d,m,x,y,z)=>add(g,new THREE.BoxGeometry(w,h,d),m,x,y,z);
const CY=(g,rt,rb,h,m,x,y,z,seg=24)=>add(g,new THREE.CylinderGeometry(rt,rb,h,seg),m,x,y,z);
const SP=(g,r,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=add(g,new THREE.SphereGeometry(r,32,24),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
const CO=(g,r,h,m,x,y,z)=>add(g,new THREE.ConeGeometry(r,h,20),m,x,y,z);
const eye=()=>mat('#2a1622',.12);

/* ================= furniture models ================= */
function legs4(g,w,d,h,m,inset=.06,r=.03){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>CY(g,r,r*.75,h,m,a*(w/2-inset),h/2,b*(d/2-inset),12));}
const B={
 bed(g,c){c=c||'#f28db2';const wd=wood('#f0d4b0');
  RB(g,1.35,.35,1.85,.22,wd,0,.18,0);legs4(g,1.2,1.7,.18,wd,.12,.08);
  RB(g,1.2,.35,1.7,.24,fabric('#fff8f4'),0,.44,0);
  RB(g,1.25,.18,1.2,.1,fabric(c),0,.6,.28);
  SP(g,.3,fabric('#fffaf5'),-.32,.76,-.5,1.2,.65,.8);
  SP(g,.3,fabric('#fffaf5'),.32,.76,-.5,1.2,.65,.8);
  RB(g,1.35,1.15,.2,.14,wd,0,.72,-.84);
  RB(g,1.1,.7,.1,.08,fabric(shadeHex(c,1.1)),0,.84,-.76);},
 canopy(g,c){c=c||'#f7b2c4';B.bed(g,c);[[-.58,-.82],[.58,-.82],[-.58,.82],[.58,.82]].forEach(([x,z])=>{CY(g,.035,.035,1.75,mat('#fff4e6',.4),x,1.0,z,14);SP(g,.05,metalM(),x,1.9,z);});
  const sheer=new THREE.MeshStandardMaterial({color:new THREE.Color(c).convertSRGBToLinear(),transparent:true,opacity:.42,side:THREE.DoubleSide,roughness:.9});
  BX(g,1.2,.04,1.7,sheer,0,1.86,0);[-.6,.6].forEach(x=>{const p=add(g,new THREE.PlaneGeometry(1.7,.9),sheer,x,1.45,0);p.rotation.y=Math.PI/2;p.castShadow=false;});},
 sofa(g,c){c=c||'#8fc6e8';const f=fabric(c),f2=fabric(shadeHex(c,1.08));
  RB(g,1.75,.42,.86,.26,f,0,.24,0);
  RB(g,1.75,.7,.36,.22,f,0,.66,-.24);
  SP(g,.36,f,-.86,.54,0,0.8,1.2,0.95);
  SP(g,.36,f,.86,.54,0,0.8,1.2,0.95);
  [-.35,.35].forEach(x=>{
    RB(g,.62,.16,.55,.08,f2,x,.5,.06);
    SP(g,.18,f2,x,.72,-.1,1.2,.7,.6);
  });
  SP(g,.12,fabric('#ffd96b'),-.45,.68,0.05,1,.6,.5);
  legs4(g,1.5,.6,.14,wood('#8a5a35'),.05,.03);},
 chair(g,c){c=c||'#f28db2';const wd=wood('#e0b88a');
  RB(g,.58,.12,.55,.12,wd,0,.42,0);
  RB(g,.52,.14,.5,.08,fabric(c),0,.52,0);
  RB(g,.55,.65,.12,.12,wd,0,.88,-.22);
  SP(g,.24,fabric(c),0,.92,-.14,1.2,.85,.55);
  legs4(g,.52,.5,.4,wd,.06,.05);},
 table(g,c){const top=c?mat(c,.5):wood('#e0b88a');
  CY(g,.62,.62,.1,top,0,.66,0,48);
  CY(g,.56,.54,.06,wood('#c89870'),0,.58,0,48);
  CY(g,.08,.1,.55,wood('#c89870'),0,.3,0,20);
  CY(g,.36,.38,.08,wood('#c89870'),0,.05,0,36);},
 dining(g,c){const w=wood('#e0b88a');RB(g,1.55,.1,.9,.06,c?mat(c,.5):w,0,.68,0);legs4(g,1.5,.85,.64,w,.1,.05);RB(g,1.35,.1,.7,.05,w,0,.58,0);},
 tea(g){B.table(g);const p=gloss('#ffffff');SP(g,.12,p,0,.82,0,1,.85,1);CY(g,.02,.03,.14,p,.14,.82,0,10).rotation.z=-.9;CY(g,.05,.06,.03,p,0,.93,0);SP(g,.02,metalM(),0,.96,0);[[.3,.15],[-.28,.2],[.05,-.32]].forEach(([x,z])=>{CY(g,.05,.04,.06,p,x,.72,z,16);CY(g,.07,.07,.008,p,x,.69,z,20);});},
 lamp(g){const m=metalM();CY(g,.22,.26,.05,m,0,.03,0,36);CY(g,.02,.02,1.2,m,0,.64,0,12);
  const shade=new THREE.Mesh(new THREE.CylinderGeometry(.18,.32,.38,36,1,true),new THREE.MeshStandardMaterial({color:new THREE.Color('#fff8e8').convertSRGBToLinear(),emissive:new THREE.Color('#ffe8b0'),emissiveIntensity:.4,side:THREE.DoubleSide,roughness:.95}));shade.position.y=1.35;g.add(shade);
  SP(g,.07,mat('#fff8e1',.3,0,{emissive:new THREE.Color('#ffe2a0'),emissiveIntensity:.8}),0,1.28,0);const L=new THREE.PointLight(0xffe8c0,.4,3,2);L.position.y=1.28;g.add(L);},
 plant(g){const pot=mat('#d47850',.9);CY(g,.26,.2,.38,pot,0,.19,0,32);CY(g,.28,.28,.06,pot,0,.38,0,32);CY(g,.24,.24,.025,mat('#6a4530',1),0,.39,0,28);
  const L=[mat('#4f9e5b',.7),mat('#62b56b',.7),mat('#3f8a4e',.7)];for(let i=0;i<14;i++){const a=i*2.4,r=.05+(i%3)*.06,h=.55+(i%5)*.09;const leaf=SP(g,.11,L[i%3],Math.cos(a)*r,h,Math.sin(a)*r,.45,1.1,.12);leaf.rotation.set(Math.sin(a)*.6,a,Math.cos(a)*.6);CY(g,.008,.01,h-.38,L[2],Math.cos(a)*r*.5,(h+.38)/2,Math.sin(a)*r*.5,6);}},
 shelf(g,c){const w=wood(c?c:'#e0b88a');RB(g,1.2,1.6,.45,.06,w,0,.8,0);BX(g,1.08,1.48,.03,mat('#c89870',.85),0,.8,-.2);[.1,.58,1.04,1.52].forEach(y=>BX(g,1.1,.06,.4,w,0,y,0));
  const cols=['#e2457a','#7cc4f2','#ffc943','#5cc6a8','#c8a2ff','#f28db2','#8a6577'];[.1,.58,1.04].forEach((y,row)=>{let x=-.46;let i=row*3;while(x<.4){const bw=.06+rnd()*.05,bh=.28+rnd()*.12;const b=BX(g,bw,bh,.25,mat(cols[i++%cols.length],.7),x+bw/2,y+.02+bh/2,.02);if(rnd()<.15)b.rotation.z=.18;x+=bw+.008;}});},
 rug(g,id){const r=add(g,new THREE.CylinderGeometry(.9,.9,.02,48),mat('#ffffff',1,0,{map:rugTex((id||'').length)}),0,.012,0);r.castShadow=false;},
 teddy(g,c){c=c||'#b9814f';const f=fabric(c),light=fabric('#f1d9b8');SP(g,.25,f,0,.27,0,1,1.05,.9);SP(g,.12,light,0,.27,.16,1,1.1,.5);SP(g,.19,f,0,.64,.02);SP(g,.075,f,-.15,.8,0);SP(g,.075,f,.15,.8,0);SP(g,.04,light,-.15,.8,.03);SP(g,.04,light,.15,.8,.03);
  SP(g,.08,light,0,.6,.16,1,.8,.8);SP(g,.025,eye(),0,.63,.23);SP(g,.022,eye(),-.07,.69,.17);SP(g,.022,eye(),.07,.69,.17);
  [[-.22,.35],[.22,.35]].forEach(([x,y])=>SP(g,.08,f,x,y,.06,.8,1.3,.8));[[-.12,.06],[.12,.06]].forEach(([x])=>SP(g,.09,f,x,.07,.12,1,.7,1.3));BX(g,.2,.05,.03,fabric('#e2457a'),0,.47,.15);},
 unicorn(g){B.teddy(g,'#fbf6ff');const h=CO(g,.045,.26,metalM('#f2c94c'),0,.93,.1);h.rotation.x=.45;['#f7a0bd','#c8a2ff','#7fd1c0'].forEach((c,i)=>SP(g,.06,fabric(c),0,.84-i*.08,-.14+i*.02));},
 piano(g){const p=gloss('#e2457a');RB(g,1.3,.6,.52,.03,p,0,.62,0);RB(g,1.3,.12,.3,.02,p,0,.98,-.11);BX(g,1.16,.05,.22,gloss('#fffdf7'),0,.94,.17);for(let i=0;i<8;i++)BX(g,.05,.04,.12,gloss('#1e1418'),-.5+i*.14,.975,.13);
  [[-.58],[.58]].forEach(([x])=>RB(g,.08,.34,.42,.02,p,x,.17,0));RB(g,.7,.06,.32,.03,fabric('#fff1dc'),0,.46,.55);legs4(g,.66,.28,.42,wood('#8a5a35'),.04,.02);g.children.slice(-4).forEach(o=>o.position.z+=.55);},
 fridge(g,c='#f8f0e8'){
  const shell=mat(c,.9),inside=mat('#fff9ef',.92),trim=metalM('#d7dde2');
  RB(g,.82,1.8,.12,.08,shell,0,.9,-.3);
  [-.38,.38].forEach(x=>RB(g,.1,1.8,.7,.08,shell,x,.9,0));
  [.05,1.75].forEach(y=>RB(g,.74,.1,.7,.08,shell,0,y,0));
  [.48,.92,1.34].forEach(y=>RB(g,.64,.035,.54,.012,inside,0,y,0));
  const door=new THREE.Group();door.position.set(.39,0,.34);g.add(door);
  RB(door,.78,1.69,.09,.04,shell,-.39,.88,0);
  RB(door,.68,.012,.015,.005,trim,-.39,1.18,.055);
  RB(door,.04,.32,.05,.018,trim,-.69,1.42,.07);
  RB(door,.04,.48,.05,.018,trim,-.69,.82,.07);
  SP(door,.04,gloss('#ffc943'),-.24,1.5,.055);SP(door,.04,gloss('#e2457a'),-.19,.75,.055);
  g.userData.fridgeDoor=door;g.userData.setFridgeOpen=on=>{door.rotation.y=on?Math.PI*.57:0;};
 },
 stove(g){const w=mat('#f8f0e8',.85);RB(g,.95,.95,.72,.12,w,0,.48,0);BX(g,.9,.06,.66,gloss('#4a4038'),0,.92,0);[[-.2,-.13],[.2,-.13],[-.2,.15],[.2,.15]].forEach(([x,z])=>{const r=add(g,new THREE.TorusGeometry(.08,.012,8,24),metalM('#8f8f8f'),x,.885,z);r.rotation.x=Math.PI/2;});
  BX(g,.6,.36,.02,mat('#2a2328',.1,0,{transparent:true,opacity:.85}),0,.42,.32);RB(g,.5,.03,.04,.015,metalM('#d7dde2'),0,.66,.34);[-.3,-.15,0,.15,.3].forEach(x=>CY(g,.025,.025,.03,gloss('#4a2338'),x,.77,.33,12).rotation.x=Math.PI/2);},
 cake(g){B.table(g);const pl=gloss('#ffffff');CY(g,.3,.28,.02,pl,0,.7,0,32);CY(g,.24,.24,.18,mat('#f7a0bd',.6),0,.8,0,32);CY(g,.16,.16,.14,mat('#fff1dc',.6),0,.96,0,32);
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2;SP(g,.025,mat('#ffffff',.5),Math.cos(a)*.24,.88,Math.sin(a)*.24,1,1.5,1);}CY(g,.012,.012,.12,mat('#7cc4f2',.5),0,1.09,0,8);SP(g,.025,mat('#ffd25e',.5,0,{emissive:new THREE.Color('#ffb020'),emissiveIntensity:1.4}),0,1.17,0,1,1.6,1);},
 tree(g){const bark=mat('#7a5233',.95);CY(g,.12,.22,1.3,bark,0,.65,0,12);const leaves=[mat('#4f9e5b',.85),mat('#5fb06a',.85),mat('#3e8a4c',.85)];
  [[0,1.75,0,.7],[-.45,1.45,.15,.5],[.48,1.5,-.1,.52],[.1,2.15,.1,.5],[-.2,1.7,-.35,.45],[.25,1.6,.4,.45]].forEach((p,i)=>{const m=add(g,new THREE.IcosahedronGeometry(p[3],1),leaves[i%3],p[0],p[1],p[2]);m.rotation.set(i,i*2,0);});
  [[.35,1.75,.55],[-.45,1.55,.45],[.15,2.2,.45],[.55,1.35,.3]].forEach(p=>SP(g,.07,gloss('#e2457a'),p[0],p[1],p[2]));},
 flowers(g){const stem=mat('#4f9e5b',.8);[[-.25,0,'#ffc943'],[.2,.15,'#f28db2'],[0,-.2,'#c8a2ff'],[.3,-.2,'#ffffff'],[-.15,.25,'#ff9a4d']].forEach(([x,z,c],i)=>{const h=.45+i*.07;CY(g,.012,.015,h,stem,x,h/2,z,6);SP(g,.06,stem,x+.05,h*.45,z,.4,1,.15);
  const head=new THREE.Group();head.position.set(x,h,z);head.rotation.x=-.5;g.add(head);for(let k=0;k<7;k++){const a=k/7*Math.PI*2;SP(head,.055,fabric(c),Math.cos(a)*.07,0,Math.sin(a)*.07,1,.25,.55).rotation.y=-a;}SP(head,.04,mat('#a86b45',.9),0,.01,0,1,.5,1);});},
 swing(g){const w=wood('#9a6a3f');[-.75,.75].forEach(x=>{[-1,1].forEach(s=>{const p=CY(g,.04,.05,1.75,w,x,.82,s*.28,10);p.rotation.x=s*-.33;});});CY(g,.05,.05,1.65,w,0,1.62,0,12).rotation.z=Math.PI/2;
  [-.25,.25].forEach(x=>CY(g,.008,.008,1.05,mat('#e8d9bf',.9),x,1.08,0,6));RB(g,.62,.05,.24,.02,wood('#d9a36f'),0,.55,0);},
 pond(g){const p=CY(g,.85,.85,.03,mat('#4aa3d8',.05,.1,{transparent:true,opacity:.88}),0,.03,0,48);p.scale.z=.7;p.castShadow=false;const lp=mat('#5fb06a',.6);[[-.3,.05],[.25,-.15],[.05,.25]].forEach(([x,z])=>CY(g,.14,.14,.01,lp,x,.05,z,20));SP(g,.06,fabric('#ff9fc0'),.25,.08,-.15,1,.6,1);
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2;SP(g,.09+rnd()*.05,mat('#b8aea2',.95),Math.cos(a)*.88,.04,Math.sin(a)*.62,1.2,.6,1);}},
 rainbow(g){['#e2457a','#ff9a4d','#ffc943','#5cc6a8','#7cc4f2','#c8a2ff'].forEach((c,i)=>{const t=add(g,new THREE.TorusGeometry(1-i*.1,.05,12,48,Math.PI),mat(c,.5));});[-1,1].forEach(s=>{[0,.15,-.15].forEach((dz,i)=>SP(g,.2-i*.03,mat('#ffffff',.95),s*.75+dz,.06,dz));});},
 horse(g){const gold=metalM('#f2c94c');CY(g,.03,.03,2,gold,0,1,0,12);CY(g,.55,.55,.05,mat('#ffd2e0',.6),0,.025,0,40);
  const body=SP(g,.3,gloss('#ffffff'),0,.9,0,1.45,.72,.75);SP(g,.15,gloss('#ffffff'),.46,1.2,0,1.3,.9,.8);SP(g,.08,gloss('#ffffff'),.62,1.12,0,1.3,.8,.8);
  [[-.26,.1],[.26,.1],[-.26,-.1],[.26,-.1]].forEach(([x,z])=>{const l=CY(g,.04,.03,.42,gloss('#ffffff'),x,.56,z,10);l.rotation.z=x>0?-.35:.35;});
  RB(g,.34,.08,.42,.03,fabric('#e2457a'),0,1.1,0);for(let i=0;i<5;i++)SP(g,.05,fabric(['#c8a2ff','#f7a0bd','#7fd1c0'][i%3]),.36-i*.04,1.3-i*.05,0);},
 butterfly(g){const bob=new THREE.Group();g.add(bob);[[-.3,.9,.1],[.35,1.2,-.2],[0,1.5,.25]].forEach(([x,y,z],i)=>{const w=new THREE.Group();w.position.set(x,y,z);bob.add(w);const c=['#c8a2ff','#7cc4f2','#f28db2'][i];const m=mat(c,.4,0,{side:THREE.DoubleSide});
  const l=SP(w,.12,m,-.1,0,0,1,.7,.08);const r=SP(w,.12,m,.1,0,0,1,.7,.08);SP(w,.025,eye(),0,0,0,1,3,1);w.userData.flap=[l,r];});g.userData.bob=bob;},
 cat(g){const f=fabric('#f0a061'),w=fabric('#fff1e3');SP(g,.25,f,0,.25,0,1,.85,1.3);SP(g,.12,w,0,.24,.2,1,1,.6);SP(g,.19,f,0,.55,.24);SP(g,.08,w,0,.5,.38,1,.7,.6);
  [-1,1].forEach(s=>{const e=CO(g,.07,.15,f,s*.11,.74,.24);e.rotation.z=-s*.2;SP(g,.03,eye(),s*.07,.58,.4);});SP(g,.018,gloss('#f28db2'),0,.53,.43);const t=CY(g,.035,.03,.45,f,0,.38,-.36,10);t.rotation.x=-.7;g.userData.pet=1;},
 dog(g){const f=fabric('#e8c59a'),d=fabric('#a86b45');SP(g,.26,f,0,.27,0,1,.85,1.3);SP(g,.2,f,0,.58,.24);SP(g,.1,fabric('#f6e3c8'),0,.52,.38,1,.75,.9);
  [-1,1].forEach(s=>{const e=SP(g,.08,d,s*.18,.56,.22,.55,1.5,.8);e.rotation.z=s*.3;SP(g,.028,eye(),s*.07,.63,.4);});SP(g,.04,gloss('#2a1622'),0,.55,.47);const t=CY(g,.03,.02,.25,f,0,.45,-.36,8);t.rotation.x=-1;g.userData.pet=1;},
 bunny(g){const f=fabric('#fbf8f6');SP(g,.25,f,0,.25,0,1,.9,1.1);SP(g,.17,f,0,.55,.15);[-1,1].forEach(s=>{const e=SP(g,.06,f,s*.07,.82,.1,.8,3,.6);e.rotation.z=s*.12;SP(g,.035,fabric('#f7c0cf'),s*.07,.84,.14,.6,2.3,.3);SP(g,.025,eye(),s*.06,.6,.29);});SP(g,.025,gloss('#f28db2'),0,.55,.32);SP(g,.08,f,0,.25,-.28);g.userData.pet=1;},
 fish(g){CY(g,.26,.3,.5,wood('#b47c4c'),0,.25,0,24);const bowl=SP(g,.32,mat('#d8f1ff',.05,0,{transparent:true,opacity:.35}),0,.82,0);bowl.castShadow=false;CY(g,.27,.27,.25,mat('#5ab4e6',.1,0,{transparent:true,opacity:.45}),0,.75,0,24);
  const f=SP(g,.07,gloss('#ff8a3d'),0,.8,0,1.6,1,.6);g.userData.fish=f;}
};
const EXACT={lamp:['sofa'],swing:['horse'],light:['lamp'],dininglamp:['lamp'],tea:['tea'],unicorn:['unicorn'],books:['shelf'],flowers:['flowers'],pool:['pond'],tablewood:['dining'],desk:null,picture:null,clock:null,star:null,bow:null,crystal:null};
function tint(id){return /pink|blush|rose/.test(id)?'#f2a5c0':/mint/.test(id)?'#8ed6c4':/gold/.test(id)?'#f2c94c':/glass/.test(id)?'#d6f0fb':/heart/.test(id)?'#ff7aa8':/cloud|pearl/.test(id)?'#fdfbfb':/purple|lilac|lavender/.test(id)?'#c8a2ff':/blue|sky/.test(id)?'#8fc6e8':null;}
function pick(id,name){
  if(id in EXACT)return EXACT[id];
  const s=(id+' '+(name||'')).toLowerCase(),t=tint(id);
  if(/canopy|princess bed/.test(s))return ['canopy',t];
  if(/^bed|bed$|\bbed\b/.test(id)||/\bbed\b/.test(s))return ['bed',t];
  if(/sofa|couch|loveseat/.test(s))return ['sofa',t];
  if(/chair|stool|seat/.test(s))return ['chair',t];
  if(/dining|farmhouse/.test(s))return ['dining',t];
  if(/table/.test(s))return ['table',t];
  if(/lamp|light/.test(s))return ['lamp'];
  if(/plant|cactus|fern/.test(s))return ['plant'];
  if(/shelf|book|cupboard|cabinet|dresser/.test(s))return ['shelf',t];
  if(/rug|carpet|mat\b/.test(s))return ['rug',id];
  if(/unicorn/.test(s))return ['unicorn'];
  if(/teddy|bear|plush/.test(s))return ['teddy'];
  if(/piano/.test(s))return ['piano'];
  if(/fridge/.test(s))return ['fridge'];
  if(/stove|oven/.test(s))return ['stove'];
  if(/cake|cupcake/.test(s))return ['cake'];
  if(/tree/.test(s))return ['tree'];
  if(/flower|tulip|sunflower|bouquet|daisy/.test(s))return ['flowers'];
  if(/swing/.test(s))return ['swing'];
  if(/carousel|horse|ride/.test(s))return ['horse'];
  if(/pond|pool/.test(s))return ['pond'];
  if(/rainbow/.test(s))return ['rainbow'];
  if(/butterfl/.test(s))return ['butterfly'];
  if(/cat\b|kitty|kitten/.test(s))return ['cat'];
  if(/dog|pupp/.test(s))return ['dog'];
  if(/bunny|rabbit/.test(s))return ['bunny'];
  if(/fish/.test(s))return ['fish'];
  return null;
}
const ON_WALL=/picture|wall art|clock|mirror|poster|frame/;
function emojiCard(g,e,onWall){
  const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d');x.textAlign='center';x.textBaseline='middle';x.font='112px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';x.fillText(e||'⭐',80,88);
  const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;
  if(onWall){RB(g,.62,.62,.04,.015,wood('#d9a36f'),0,0,0);const p=add(g,new THREE.PlaneGeometry(.52,.52),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.6}),0,0,.025);p.castShadow=false;return;}
  CY(g,.22,.26,.1,mat('#fff4e6',.5),0,.05,0,28);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));sp.scale.set(.75,.75,.75);sp.position.y=.48;g.add(sp);
}
/* Clay pass (Claude, Nov 1): every item gets soft rounded edges and a fine clay surface, like the reference dioramas */
let clayBumpTex=null;
function clayBump(){if(clayBumpTex)return clayBumpTex;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#808080';x.fillRect(0,0,128,128);
  for(let i=0;i<260;i++){const r=2+Math.random()*7,px=Math.random()*128,py=Math.random()*128,v=Math.random()<.5?110:150;const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${v},${v},${v},.35)`);g.addColorStop(1,'rgba(128,128,128,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill();}
  clayBumpTex=new THREE.CanvasTexture(c);clayBumpTex.wrapS=clayBumpTex.wrapT=THREE.RepeatWrapping;clayBumpTex.repeat.set(1.5,1.5);return clayBumpTex;}
function clayify(g){const done=new Set();g.traverse(o=>{if(!o.isMesh||!o.geometry)return;const geo=o.geometry;
   if(geo.type==='BoxGeometry'&&geo.parameters){const {width:w,height:h,depth:d}=geo.parameters;const m=Math.min(w,h,d);if(m>.012){const r=Math.min(.08,m*.24);o.geometry=rbox(w,h,d,r);}}
   else if(geo.userData&&geo.userData.dims){const [w,h,d,r]=geo.userData.dims;const m=Math.min(w,h,d);const want=Math.min(.09,m*.22);if(m>.012&&r<want*.8)o.geometry=rbox(w,h,d,want);}
   const mt=o.material;if(mt&&mt.isMeshStandardMaterial&&!mt.transparent&&!mt.emissiveMap&&!done.has(mt)&&!mt.userData.clay){done.add(mt);mt.userData.clay=1;if(!mt.bumpMap){mt.bumpMap=clayBump();mt.bumpScale=.012;}if(mt.roughness<.6&&mt.metalness<.5)mt.roughness=.6;mt.needsUpdate=true;}});return g;}
function makeItem(it){const g=makeItemRaw(it);try{clayify(g);}catch(e){}return g;}
function makeItemRaw(it){
  const MD=window.RK3&&window.RK3.MODEL&&window.RK3.MODEL[it[0]];if(MD){const g=new THREE.Group();MD(g,it);g.userData.onWall=!!MD.wall;if(window.RK3.prepareStorage)window.RK3.prepareStorage(g,it);return g;}
  const g=new THREE.Group(),p=pick(it[0],it[2]),wall=ON_WALL.test((it[0]+' '+it[2]).toLowerCase())&&!p;
  if(p&&B[p[0]])B[p[0]](g,p[1]);else emojiCard(g,it[1],wall);
  g.userData.onWall=wall;if(window.RK3&&window.RK3.prepareStorage)window.RK3.prepareStorage(g,it);return g;
}

/* ================= room shell ================= */
function curtainPanel(tex,w,h){const geo=new THREE.PlaneGeometry(w,h,24,1);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){pos.setZ(i,Math.sin(pos.getX(i)/w*Math.PI*6)*.035);}geo.computeVertexNormals();
  const m=new THREE.MeshStandardMaterial({map:tex,roughness:.95,side:THREE.DoubleSide});const o=new THREE.Mesh(geo,m);o.castShadow=true;return o;}
function windowOn(g,x,y,z,ry,room){
  const w=new THREE.Group();w.position.set(x,y,z);w.rotation.y=ry;g.add(w);const trim=mat('#ffffff',.45);
  const glass=add(w,new THREE.PlaneGeometry(1.0,1.15),new THREE.MeshBasicMaterial({map:skyTex()}),0,0,.005);glass.castShadow=false;
  [[0,.6,1.16,.08],[0,-.6,1.2,.1]].forEach(([px,py,ww,hh])=>BX(w,ww,hh,.08,trim,px,py,.03));[-.55,.55].forEach(px=>BX(w,.08,1.2,.08,trim,px,0,.03));BX(w,.04,1.15,.04,trim,0,0,.03);BX(w,1.0,.04,.04,trim,0,.05,.03);
  BX(w,1.3,.05,.16,trim,0,-.66,.08);
  const tex=curtainFor(room);[-1,1].forEach(s=>{const c=curtainPanel(tex,.42,1.55);c.position.set(s*.72,.02,.12);w.add(c);});
  CY(w,.018,.018,1.8,metalM(),0,.82,.14,10).rotation.z=Math.PI/2;[-.92,.92].forEach(px=>SP(w,.035,metalM(),px,.82,.14));
  return w;
}

/* ---- buyable floors (Grok) ---- */
const FLOOR_KEY = 'rikiFloorChoicesV1';
const FLOORS = [
  { id: 'wood', name: 'Honey planks', price: 0, color: '#d6a46e' },
  { id: 'carpet', name: 'Soft pink carpet', price: 60, color: '#f2cbd6' },
  { id: 'checker', name: 'Cream & pink checker', price: 50, color: '#fbeee4' },
  { id: 'mint', name: 'Mint tile', price: 50, color: '#cfeee2' },
  { id: 'foam', name: 'Rainbow play mat', price: 45, color: '#fde6ef' },
  { id: 'herring', name: 'Herringbone wood', price: 70, color: '#cf9d6a' },
  { id: 'whitewash', name: 'Whitewashed planks', price: 55, color: '#f1e7dc' },
  { id: 'tile', name: 'Soft cream tile', price: 40, color: '#efe5d8' },
  { id: 'pink', name: 'Blush tile', price: 50, color: '#f6d5e1' },
  { id: 'terracotta', name: 'Terracotta tile', price: 60, color: '#e3a888' },
  { id: 'marble', name: 'Marble', price: 80, color: '#f4f1ec' },
  { id: 'grass', name: 'Garden grass', price: 0, color: '#7cc46f' }
];
const FLOOR_DEFAULT = { bathroom: 'mint', kitchen: 'checker', bedroom: 'carpet', living: 'wood', playroom: 'foam', garden: 'grass' };
function floorChoices(){ try { return JSON.parse(localStorage.getItem(FLOOR_KEY) || '{}') || {}; } catch(e){ return {}; } }
function floorSave(c){ try { localStorage.setItem(FLOOR_KEY, JSON.stringify(c)); } catch(e){} }
const FLOOR_OWNED_KEY = 'rikiFloorOwnedV1';
function floorOwned(){ try { return JSON.parse(localStorage.getItem(FLOOR_OWNED_KEY) || '{}') || {}; } catch(e){ return {}; } }
function floorOwnedSave(o){ try { localStorage.setItem(FLOOR_OWNED_KEY, JSON.stringify(o)); } catch(e){} }
function ownsFloor(room, id){
  const f = FLOORS.find(x => x.id === id);
  if (f && f.price === 0) return true;
  if (FLOOR_DEFAULT[room] === id) return true;
  const o = floorOwned()[room] || [];
  return o.includes(id);
}
function grantFloor(room, id){
  const o = floorOwned();
  o[room] = o[room] || [];
  if (!o[room].includes(id)) o[room].push(id);
  floorOwnedSave(o);
}
function floorFor(room){
  const c = floorChoices()[room];
  if (c) return FLOORS.find(f => f.id === c) || FLOORS[0];
  const id = FLOOR_DEFAULT[room] || 'wood';
  return FLOORS.find(f => f.id === id) || FLOORS[0];
}
function floorTex(id){
  const f = FLOORS.find(x => x.id === id) || FLOORS[0];
  return canvasTex('fl2'+id, 512, 512, (x,w,h) => {
    const R=(a,b)=>a+Math.random()*(b-a);
    const rr=(px,py,pw,ph,r,c)=>{x.fillStyle=c;x.beginPath();x.moveTo(px+r,py);x.arcTo(px+pw,py,px+pw,py+ph,r);x.arcTo(px+pw,py+ph,px,py+ph,r);x.arcTo(px,py+ph,px,py,r);x.arcTo(px,py,px+pw,py,r);x.fill();};
    const speck=(n,a)=>{for(let i=0;i<n;i++){x.fillStyle=`rgba(${Math.random()<.5?'255,255,255':'90,60,50'},${R(.02,a)})`;x.beginPath();x.arc(R(0,w),R(0,h),R(.6,2.2),0,7);x.fill();}};
    const planks=(tones,gap)=>{x.fillStyle=gap;x.fillRect(0,0,w,h);const rh=64;for(let r=0;r<h/rh;r++){let px=-(r%2)*130;while(px<w){const len=R(170,300);rr(px+2,r*rh+2,len-4,rh-4,6,tones[Math.floor(Math.random()*tones.length)]);for(let g=0;g<4;g++){x.strokeStyle=`rgba(120,70,40,${R(.04,.09)})`;x.lineWidth=R(1,2);x.beginPath();const y0=r*rh+R(10,rh-10);x.moveTo(px+6,y0);x.bezierCurveTo(px+len*.3,y0+R(-3,3),px+len*.7,y0+R(-3,3),px+len-6,y0);x.stroke();}px+=len;}}};
    const tiles=(n,cols,grout,r)=>{x.fillStyle=grout;x.fillRect(0,0,w,h);const s=w/n;for(let a=0;a<n;a++)for(let b=0;b<n;b++){rr(a*s+3,b*s+3,s-6,s-6,r,typeof cols==='function'?cols(a,b):cols);}};
    if(id==='wood')planks(['#d9a771','#cf9b65','#e0b07c','#c99460'],'#a87448');
    else if(id==='whitewash')planks(['#f4ebe1','#efe3d6','#f7efe6','#ebdccd'],'#d4c2b0');
    else if(id==='herring'){x.fillStyle='#a87448';x.fillRect(0,0,w,h);const L=128,T=32,tones=['#d4a06c','#c8935f','#dcae7c','#c0895a'];for(let yy=-L;yy<h+L;yy+=T*2)for(let xx=-L;xx<w+L;xx+=L){x.save();x.translate(xx+(yy/T%4?0:0),yy);[[0,0,Math.PI/4],[T*1.41,0,-Math.PI/4]].forEach(([dx,dy,a])=>{x.save();x.translate(dx,dy);x.rotate(a);rr(0,0,L-3,T-3,4,tones[Math.floor(Math.random()*4)]);x.restore();});x.restore();}}
    else if(id==='carpet'){x.fillStyle=f.color;x.fillRect(0,0,w,h);for(let i=0;i<5000;i++){x.fillStyle=`rgba(${Math.random()<.5?'255,255,255':'200,120,150'},${R(.04,.12)})`;x.fillRect(R(0,w),R(0,h),R(1,3),R(1,3));}}
    else if(id==='checker')tiles(4,(a,b)=>(a+b)%2?'#f6c9d6':'#fdf3ea','#e8d8cc',10);
    else if(id==='mint')tiles(6,()=>['#cfeee2','#c6e9db','#d7f2e8'][Math.floor(Math.random()*3)],'#f7fbf8',9);
    else if(id==='tile')tiles(4,()=>['#efe5d8','#ebe0d2','#f3eadf'][Math.floor(Math.random()*3)],'#fffaf3',10);
    else if(id==='pink')tiles(4,()=>['#f6d5e1','#f3cddb','#f8dde7'][Math.floor(Math.random()*3)],'#fff4f8',10);
    else if(id==='terracotta'){x.fillStyle='#f3e4d6';x.fillRect(0,0,w,h);const s=w/4;for(let a=0;a<4;a++)for(let b=0;b<4;b++){x.save();x.translate(a*s+s/2,b*s+s/2);x.rotate(Math.PI/4);rr(-s*.34,-s*.34,s*.68,s*.68,8,['#e3a888','#dc9d7c','#e8b295'][Math.floor(Math.random()*3)]);x.restore();}}
    else if(id==='marble'){x.fillStyle=f.color;x.fillRect(0,0,w,h);for(let i=0;i<14;i++){x.strokeStyle=`rgba(190,170,165,${R(.12,.3)})`;x.lineWidth=R(1,3);x.beginPath();let px=R(0,w),py=R(0,h);x.moveTo(px,py);for(let k=0;k<6;k++){px+=R(-60,90);py+=R(-30,60);x.lineTo(px,py);}x.stroke();}x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=3;[0,256].forEach(v=>{x.beginPath();x.moveTo(v,0);x.lineTo(v,h);x.stroke();x.beginPath();x.moveTo(0,v);x.lineTo(w,v);x.stroke();});}
    else if(id==='foam'){const cols=['#ffc8dc','#c9e8ff','#fff1b3','#d6f5d0','#e3d4ff'];tiles(4,(a,b)=>cols[(a+b*2)%5],'#ffffff',14);for(let a=0;a<4;a++)for(let b=0;b<4;b++){x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.arc(a*128+64,b*128+64,26,0,7);x.fill();}}
    else if(id==='grass'){x.fillStyle=f.color;x.fillRect(0,0,w,h);for(let i=0;i<1600;i++){x.strokeStyle='rgba(40,120,50,.4)';x.beginPath();const px=Math.random()*w,py=Math.random()*h;x.moveTo(px,py);x.lineTo(px+Math.random()*2-1,py-6);x.stroke();}}
    else{x.fillStyle=f.color;x.fillRect(0,0,w,h);}
    if(id!=='grass')speck(900,.06);
  });
}

/* ---- floors in shop / decorate (Grok) ---- */
(function injectFloors(){
  const orig = window.houseRender;
  if (!orig || orig._floors) return;
  window.houseRender = function(){
    const r = orig.apply(this, arguments);
    try {
      const page = (0,eval)("housePage");
      const old = document.getElementById('rkFloorShop');
      if (old) old.remove();
      const room = (0,eval)("currentRoom") || 'bedroom';
      const coins = (0,eval)("coins") || 0;
      const list = FLOORS.filter(f => room === 'garden' ? true : f.id !== 'grass');
      if (page === 'shop') {
        const panel = document.querySelector('.panel');
        if (!panel) return r;
        const box = document.createElement('section');
        box.id = 'rkFloorShop';
        box.className = 'panel';
        box.innerHTML = `<style>.rk-floor i{display:inline-block;width:14px;height:14px;border-radius:4px;margin-right:6px;vertical-align:-2px;box-shadow:inset 0 0 0 1px #0002}.rk-floor.cur{opacity:1;border-color:#58c98a}</style><h2 class="sectiontitle">🪵 Floors for this room</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${list.map(f => {
          const owned = ownsFloor(room, f.id), cur = floorFor(room).id === f.id;
          const label = cur ? '✓ In use' : owned ? 'Use' : (f.price ? f.price + '🪙' : 'Free');
          return `<button type="button" class="smallbtn rk-floor${cur?' cur':''}" data-shop-floor="${f.id}" ${cur ? 'disabled' : ''}><i style="background:${f.color}"></i>${f.name} · ${label}</button>`;
        }).join('')}</div>`;
        panel.parentNode.insertBefore(box, panel.nextSibling);
        box.querySelectorAll('[data-shop-floor]').forEach(b => {
          b.onclick = () => {
            const id = b.dataset.shopFloor;
            const f = FLOORS.find(x => x.id === id);
            if (!f) return;
            if (!ownsFloor(room, id)) {
              const cns = (0,eval)("coins") || 0;
              if (f.price > 0 && cns < f.price) { b.textContent = `${f.name} · need ${f.price}🪙`; return; }
              if (f.price > 0) {
                (0,eval)(`coins=${cns - f.price};`);
                try { localStorage.setItem('rickyCoins', String(cns - f.price)); } catch(e){}
              }
              grantFloor(room, id);
            }
            const ch = floorChoices(); ch[room] = id; floorSave(ch);
            window.houseRender();
          };
        });
      } // floors only in shop, not decorate
    } catch(e) {}
    return r;
  };
  window.houseRender._floors = true;
})();

function applyFloor(room){
  const f = floorFor(room);
  const coins = G('coins') || 0;
  if (f.price > 0 && coins < f.price && floorChoices()[room] !== f.id) return false;
  if (f.price > 0 && floorChoices()[room] !== f.id) {
    SET(`coins=${coins - f.price};`);
    try { localStorage.setItem('rickyCoins', String(coins - f.price)); } catch(e){}
  }
  const c = floorChoices(); c[room] = f.id; floorSave(c);
  return true;
}

function roomShell(g,id,W,D,H,opts={}){
  if(id==='garden'){
    const lawn=add(g,new THREE.BoxGeometry(W+2,.1,D+1.5),mat('#ffffff',.95,0,{map:grassTex()}),0,-.05,.3);lawn.castShadow=false;
    const fence=wood('#fbf4ea');for(let i=0;i<=Math.round(W*2.2);i++){const x=-W/2-.5+i*(W+1)/Math.round(W*2.2);RB(g,.1,.7,.06,.02,fence,x,.35,-D/2);CO(g,.06,.1,fence,x,.75,-D/2);}
    [.25,.55].forEach(y=>BX(g,W+1,.06,.04,fence,0,y,-D/2+.04));
    for(let i=0;i<5;i++){const s=add(g,new THREE.CylinderGeometry(.22,.24,.04,10),mat('#ffffff',.9,0,{map:stoneTex()}),(i-2)*.28,.01,D/2-.2-i*.55);s.castShadow=false;}
    [[-W/2,-D/2+.3],[W/2,-D/2+.3]].forEach(([x,z])=>{[0,.3,-.3].forEach((dx,i)=>add(g,new THREE.IcosahedronGeometry(.32-i*.05,1),mat(['#4f9e5b','#5fb06a','#3e8a4c'][i],.9),x+dx,.25,z));});
  } else {
    const flChoice = floorFor(id);
    const fl=floorTex(flChoice.id).clone();fl.needsUpdate=true;fl.repeat.set(W/2.2,D/2.2);
    const floor=add(g,new THREE.BoxGeometry(W,.16,D),mat('#ffffff',.75,0,{map:fl}),0,-.08,0);floor.castShadow=false;
    const wt=wallFor(id).clone();wt.needsUpdate=true;wt.repeat.set(W/2,H/2);const wtS=wallFor(id).clone();wtS.needsUpdate=true;wtS.repeat.set(D/2,H/2);
    const wm=mat('#ffffff',.92,0,{map:wt}),wms=mat('#ffffff',.92,0,{map:wtS});
    const back=add(g,new THREE.BoxGeometry(W,H,.18),wm,0,H/2,-D/2-.09);back.castShadow=false;
    if(!opts.noSides){const L=add(g,new THREE.BoxGeometry(.18,H,D),wms,-W/2-.09,H/2,0);const R=add(g,new THREE.BoxGeometry(.18,H,D),wms,W/2+.09,H/2,0);L.castShadow=R.castShadow=false;}
    const trim=mat('#fffaf4',.5);
    RB(g,W,.26,.08,.025,trim,0,.13,-D/2+.04);BX(g,W,.08,.08,trim,0,H-.04,-D/2+.04);
    if(!opts.noSides)[-1,1].forEach(s=>{RB(g,.08,.26,D,.025,trim,s*(W/2-.04),.13,0);BX(g,.08,.08,D,trim,s*(W/2-.04),H-.04,0);});
    if(opts.windows){opts.windows.forEach(x=>windowOn(g,x,H*.56,-D/2+.01,0,id));}else roomFeatures(g,id,W,D,H);
  }

  /* ---- ceilings (Grok) ---- */
  const ceil = new THREE.Group();
  ceil.name = 'ceiling';
  g.add(ceil);
  g.userData.ceiling = ceil;

  const styles = {
    bedroom:  { color: '#f8e8ef', fixture: '#f7dbe7' },
    living:   { color: '#f4efe8', fixture: '#e8d5c4' },
    kitchen:  { color: '#fff6e8', fixture: '#f0d9b5' },
    bathroom: { color: '#eef7f8', fixture: '#d8eef0' },
    playroom: { color: '#f9f0e8', fixture: '#eeb4c7' },
    garden:   { color: '#d8f0d0', fixture: '#c8e6c0' }
  };
  const st = styles[id] || styles.bedroom;

  if (id === 'garden') {
    // Open sky — no ceiling. Soft distant clouds only.
    const sky = add(ceil, new THREE.PlaneGeometry(W + 4, D + 4), new THREE.MeshBasicMaterial({ map: skyTex(), side: THREE.DoubleSide }), 0, H + 1.2, 0);
    sky.rotation.x = -Math.PI / 2;
    sky.castShadow = false;
    sky.raycast = () => {};
  } else {
    // Thin solid ceiling box so it is visible from the normal camera angle
    const ceilMat = mat(st.color, 0.85, 0, { side: THREE.DoubleSide });
    const slab = add(ceil, new THREE.BoxGeometry(W - 0.04, 0.08, D - 0.04), ceilMat, 0, H - 0.06, 0);
    slab.castShadow = false;
    slab.userData.dioramaRoofSlab = true;
    // A shallow rear canopy reads as a finished ceiling without covering the room.
    const canopy = add(ceil, new THREE.BoxGeometry(W - 0.12, 0.055, D * 0.28), mat(st.color, 0.82, 0, {side: THREE.DoubleSide}), 0, H - 0.115, -D * 0.355);
    canopy.castShadow = false; canopy.receiveShadow = true; canopy.raycast = () => {};
    // A second inset soffit and continuous inner trim create a finished
    // ceiling plane while keeping the front open for the cutaway camera.
    const soffit = add(ceil, new THREE.BoxGeometry(W - 0.28, 0.035, D * 0.18), mat('#fffaf4', 0.55, 0, {side: THREE.DoubleSide}), 0, H - 0.18, -D * 0.385);
    soffit.castShadow = false; soffit.raycast = () => {};
    const lip = mat('#fffaf4', 0.48);
    BX(ceil, W - 0.12, 0.075, 0.085, lip, 0, H - 0.20, -D * 0.215);
    BX(ceil, 0.075, 0.075, D * 0.28, lip, -W/2 + 0.09, H - 0.20, -D * 0.355);
    BX(ceil, 0.075, 0.075, D * 0.28, lip, W/2 - 0.09, H - 0.20, -D * 0.355);
    slab.receiveShadow = true;
    slab.raycast = () => {};

    // Crown molding that hangs down into view
    const mold = mat('#fffaf4', 0.45);
    BX(ceil, W, 0.12, 0.1, mold, 0, H - 0.14, -D/2 + 0.05);
    BX(ceil, W, 0.12, 0.1, mold, 0, H - 0.14,  D/2 - 0.05);
    if (!opts.noSides) {
      BX(ceil, 0.1, 0.12, D, mold, -W/2 + 0.05, H - 0.14, 0);
      BX(ceil, 0.1, 0.12, D, mold,  W/2 - 0.05, H - 0.14, 0);
    }

    // Hanging light fixture that drops into the camera view
    const fix = mat(st.fixture, 0.4);
    CY(ceil, 0.02, 0.02, 0.35, fix, 0, H - 0.28, 0, 8); // cord
    CY(ceil, 0.22, 0.16, 0.1, fix, 0, H - 0.5, 0, 20);   // shade
    const bulb = add(ceil, new THREE.SphereGeometry(0.07, 16, 12), mat('#fff8e1', 0.2, 0, { emissive: new THREE.Color('#ffe2a0'), emissiveIntensity: 0.8 }), 0, H - 0.52, 0);
    bulb.raycast = () => {};
    const L = new THREE.PointLight(0xfff0d0, 0.4, 7, 2);
    L.position.set(0, H - 0.6, 0);
    ceil.add(L);
  }
  ceil.visible = true;
}
function roomIdentity(g,id,W,D,H){
  const soft = c => mat(c, .9);
  const round = c => mat(c, .88);
  // Each room has its own permanent wall language. No earned furniture is added here.
  const z=-D/2+.105;
  if(id==='living'){
    const blush=mat('#e8c5b6',.9),ivory=mat('#fff5e9',.84),bead=mat('#ce9e8a',.9);
    // Warm, raised woodwork and elegant ivory rails.
    RB(g,W-.2,.75,.037,.015,blush,0,.53,z);
    RB(g,W-.15,.075,.075,.018,ivory,0,.94,z+.045);
    RB(g,W-.15,.085,.075,.02,ivory,0,.16,z+.045);
    const w=(W-.5)/5;
    for(let n=0;n<5;n++){
      const x=-(W-.5)/2+(n+.5)*w;
      RB(g,w-.12,.52,.035,.015,bead,x,.54,z+.065);
      RB(g,w-.18,.43,.038,.015,blush,x,.54,z+.09);
    }
    [-1,1].forEach(side=>{
      const x=side*(W/2-.105);
      RB(g,.04,.75,D-.22,.014,blush,x,.53,0);
      RB(g,.075,.075,D-.18,.018,ivory,x,.94,0);
      RB(g,.08,.08,D-.18,.018,ivory,x,.16,0);
      for(let n=0;n<3;n++){
        const zz=-D/2+.36+(n+.5)*(D-.72)/3;
        RB(g,.045,.47,(D-.72)/3-.16,.012,bead,x-side*.032,.54,zz);
        RB(g,.048,.38,(D-.72)/3-.21,.012,blush,x-side*.052,.54,zz);
      }
    });
  }else if(id==='kitchen'){
    const sage=mat('#bdded0',.9),cream=mat('#fffaf0',.85),grout=mat('#f2f8f2',.9);
    // Brick-patterned backsplash and low subway tile, not generic wall panels.
    RB(g,W-.2,.78,.036,.012,sage,0,.53,z);
    for(let y of [.29,.53,.77])RB(g,W-.15,.018,.046,.006,grout,0,y,z+.045);
    for(let row=0;row<3;row++)
      for(let x=-W/2+.35+(row%2)*.27;x<W/2-.18;x+=.54)
        RB(g,.018,.23,.046,.006,grout,x,.40+row*.24,z+.045);
    RB(g,W-.15,.075,.072,.017,cream,0,.94,z+.052);
    [-1,1].forEach(side=>{
      const x=side*(W/2-.105);
      RB(g,.04,.78,D-.22,.012,sage,x,.53,0);
      for(let y of [.29,.53,.77])RB(g,.051,.018,D-.18,.006,grout,x-side*.036,y,0);
      for(let zz=-D/2+.33;zz<D/2-.17;zz+=.54)
        RB(g,.051,.72,.018,.005,grout,x-side*.036,.53,zz);
      RB(g,.078,.075,D-.18,.018,cream,x,.94,0);
    });
  }else if(id==='bathroom'){
    const tile=mat('#b9e1e8',.9),white=mat('#fffdfa',.85),seam=mat('#eaf7f9',.87),aqua=mat('#82bfce',.84);
    // Square ceramic tiles and aqua rails distinguish this from the kitchen.
    RB(g,W-.2,1.08,.037,.012,tile,0,.62,z);
    for(let y of [.28,.55,.82,1.07])RB(g,W-.16,.018,.045,.005,seam,0,y,z+.045);
    for(let x=-W/2+.30;x<W/2-.16;x+=.36)RB(g,.018,1.04,.046,.005,seam,x,.62,z+.046);
    RB(g,W-.15,.075,.068,.02,white,0,1.18,z+.05);
    RB(g,W-.17,.035,.04,.012,aqua,0,1.25,z+.04);
    [-1,1].forEach(side=>{
      const x=side*(W/2-.105);
      RB(g,.04,1.08,D-.22,.013,tile,x,.62,0);
      for(let y of [.28,.55,.82,1.07])RB(g,.05,.018,D-.18,.005,seam,x-side*.036,y,0);
      for(let zz=-D/2+.3;zz<D/2-.16;zz+=.36)RB(g,.05,1.04,.018,.005,seam,x-side*.036,.62,zz);
      RB(g,.075,.075,D-.18,.02,white,x,1.18,0);
    });
  }else if(id==='playroom'){
    const lilac=mat('#d9c8ed',.9),ivory=mat('#fff9ef',.84);
    const colors=['#edb5ce','#b8ddd1','#f2da9e','#c6b6ee','#acd7e8'];
    // Broad pastel blocks and playful upper-wall bunting instead of adult panel molding.
    RB(g,W-.2,.95,.04,.012,lilac,0,.60,z);
    RB(g,W-.15,.072,.068,.018,ivory,0,1.1,z+.045);
    [-1,1].forEach(side=>{
      const x=side*(W/2-.105);
      RB(g,.04,.95,D-.22,.012,lilac,x,.60,0);
      RB(g,.075,.072,D-.18,.018,ivory,x,1.1,0);
      for(let n=0;n<3;n++)
        RB(g,.049,.55,.12,.018,mat(colors[(n+(side+1)*2)%5],.9),x-side*.042,.61,-D/2+.55+n*1.13);
    });
    RB(g,W-.2,.03,.04,.01,ivory,0,H-.23,z+.04);
    for(let n=0;n<7;n++){
      const c=mat(colors[n%5],.88),x=-W/2+.44+n*(W-.88)/6;
      const pennant=CO(g,.12,.26,c,x,H-.41,z+.065);pennant.rotation.z=Math.PI;
    }
  }
if(id==='bedroom'){
    // Bedroom architectural pilot: built-ins only. Earned furniture stays in fillItems().
    const ivory=mat('#fff8ef',.82), blush=mat('#dfadc3',.91), inset=mat('#f8e4ec',.94);
    const brass=mat('#c3a270',.55), sage=mat('#b8c6a9',.92);
    // Framed wainscot attached to the back wall; no floating bed or pillows.
    const z=-D/2+.105;
    const panelTop=.88; // below the existing window sill (about 1.02)
    RB(g,W-.18,.065,.065,.015,ivory,0,panelTop,z);
    RB(g,W-.18,.09,.075,.025,ivory,0,.20,z);
    const columns=5, usable=W-.65, spacing=usable/columns;
    for(let i=0;i<columns;i++){
      const x=-usable/2+spacing*(i+.5);
      RB(g,spacing-.11,.42,.035,.02,inset,x,.57,z+.006);
      RB(g,spacing-.09,.045,.052,.016,ivory,x,.78,z+.05);
      RB(g,spacing-.09,.045,.052,.016,ivory,x,.36,z+.05);
      RB(g,.043,.48,.053,.014,ivory,x-(spacing-.09)/2,.57,z+.05);
      RB(g,.043,.48,.053,.014,ivory,x+(spacing-.09)/2,.57,z+.05);
    }
    // Carry the blush wainscot and ivory rails around BOTH side walls.
    // Keep the molding within the wall surfaces instead of leaving bare strips.
    const lowerPink=mat('#f3cadb',.92);
    for(const side of [-1,1]){
      const x=side*(W/2-.105);
      RB(g,.035,.78,D-.22,.012,lowerPink,x,.54,0);
      RB(g,.072,.06,D-.18,.016,ivory,x,.89,0);
      RB(g,.072,.085,D-.18,.02,ivory,x,.17,0);
      const sections=4,step=(D-.55)/sections;
      for(let n=0;n<sections;n++){
        const zz=-D/2+.28+(n+.5)*step;
        RB(g,.045,.055,step-.14,.015,ivory,x-side*.035,.76,zz);
        RB(g,.045,.055,step-.14,.015,ivory,x-side*.035,.34,zz);
        for(const e of [-1,1]) RB(g,.048,.45,.045,.012,ivory,x-side*.035,.55,zz+e*(step-.14)/2);
      }
    }
    // A slim wallpaper border and restrained floral appliques anchored to the wall.
    RB(g,W-.22,.075,.04,.016,blush,0,H-.40,z);
    for(const sign of [-1,1]){
      const x=sign*(W/2-.49);
      // Two symmetrical wall sconces, physically supported by a backplate.
      RB(g,.23,.30,.09,.055,ivory,x,1.75,z+.06);
      CY(g,.018,.018,.19,brass,x,1.82,z+.15,10).rotation.x=Math.PI/2;
      SP(g,.11,mat('#fff1d3',.68),x,1.82,z+.26,.88,1.02,.52);
      SP(g,.043,sage,x,1.38,z+.12,.9,.55,.38);
    }
    // A tiny arched picture niche above the panel rail; decorative, not furniture.
    RB(g,.75,.68,.042,.09,ivory,1.13,1.83,z+.025);
    RB(g,.59,.51,.035,.08,mat('#f1d4df',.91),1.13,1.83,z+.067);
    SP(g,.18,mat('#f7eee3',.93),1.13,1.84,z+.10,.84,1.08,.12);
  }
}
function pctToLocal(p,W,D){const fx=(cl(+p.x||50,8,92)-8)/84,fz=(cl(+p.y||70,26,86)-26)/60;return [(fx-.5)*(W-1.3),-(D-1.3)/2+fz*(D-1.3)];}
function localToPct(X,Z,W,D){return {x:8+((X/(W-1.3))+.5)*84,y:26+((Z+(D-1.3)/2)/(D-1.3))*60};}
/* Rotation is shared with the 2D room: key 'rikiDreamRotationV1', { 'room:itemId': degrees } in 45-degree steps */
const RK_ROT_KEY='rikiDreamRotationV1';
function rkRot(){try{return JSON.parse(localStorage.getItem(RK_ROT_KEY)||'{}')||{};}catch(e){return {};}}
function rkRotSave(r){try{localStorage.setItem(RK_ROT_KEY,JSON.stringify(r));}catch(e){}}
function rkScale(room,id){let pos;try{pos=JSON.parse(localStorage.getItem('rickyDreamPositionsV2')||'{}')?.[room]?.[id];}catch(_){}if(!pos)pos=(G('dreamPosition')||{})[room]?.[id];const v=Number(pos&&pos.scale);return cl(Number.isFinite(v)&&v?v:1,.65,1.55);}
function rkScaleSet(room,id,value){let all;try{all=JSON.parse(localStorage.getItem('rickyDreamPositionsV2')||'{}')||{};}catch(_){all={};}const live=G('dreamPosition')||{};all[room]??={};all[room][id]??=Object.assign({},live[room]?.[id]||{x:50,y:65});all[room][id].scale=cl(value,.65,1.55);live[room]??={};live[room][id]=Object.assign({},all[room][id]);try{localStorage.setItem('rickyDreamPositionsV2',JSON.stringify(all));}catch(_){}}
function ownedCopies(id){return (G('owned')||[]).filter(x=>x===id).length;}
function placedCopies(id,skipRoom){const decor=G('decor')||{};let n=0;Object.entries(decor).forEach(([room,placements])=>{if(room===skipRoom)return;Object.values(placements||{}).forEach(x=>{if(x===id)n++;});});return n;}
function availableCopies(id,room){const here=Object.values((G('decor')||{})[room]||{}).includes(id)?1:0;return Math.max(0,ownedCopies(id)-placedCopies(id,room)-here);}
function reconcileCopies(){const decor=G('decor')||{},left={};(G('owned')||[]).forEach(id=>left[id]=(left[id]||0)+1);let changed=false;const order=['bedroom','living','kitchen','bathroom','playroom','garden',...Object.keys(decor)];
  [...new Set(order)].forEach(room=>{const p=decor[room]||{};Object.keys(p).sort((a,b)=>Number(a)-Number(b)).forEach(slot=>{const id=p[slot];if((left[id]||0)>0)left[id]--;else{delete p[slot];changed=true;}});decor[room]=p;});
  if(changed){try{localStorage.setItem('rickyHouseDecorV1',JSON.stringify(decor));const save=G('saveHouse');save&&save();localStorage.setItem('rickyHouseDecorV1',JSON.stringify(decor));}catch(_){}}return changed;}
window.RikiInventoryCopies={owned:ownedCopies,placed:placedCopies,available:availableCopies,reconcile:reconcileCopies};
function fillItems(group,room,W,D,S){
  while(group.children.length)group.remove(group.children[0]);
  const owned=G('owned')||[],ITEMS=G('ITEMS')||[],decor=G('decor')||{},pos=G('dreamPosition')||{},SL=G('SLOTS')||[];
  const placements=decor[room]||{},positions=pos[room]||{};const out=[];
  Object.entries(placements).forEach(([slot,id])=>{
    if(!owned.includes(id))return;const it=ITEMS.find(x=>x[0]===id);if(!it)return;
    const p=positions[id]||SL[Number(slot)]||{x:45,y:72};const [X,Z]=pctToLocal(p,W,D);
    const g=makeItem(it);g.scale.setScalar(S*rkScale(room,id));g.userData.id=id;
    if(g.userData.onWall){g.position.set(X,1.55,-D/2+.06);}else{g.position.set(X,0,Z);if(room!=='garden')g.rotation.y=X<-(W/3)?.45:X>W/3?-.45:0;const rd=rkRot()[room+':'+id];if(rd!==undefined&&rd!==null&&rd!=='')g.rotation.y=-Number(rd)*Math.PI/180;}
    g.userData.base=g.position.y;g.userData.phase=rnd()*6;group.add(g);out.push(g);
  });
  return out;
}
function lights(scene,size,shadowMap){
  scene.add(new THREE.HemisphereLight(0xfff5ee,0xf0d8c0,.9));scene.add(new THREE.AmbientLight(0xfff8f4,.38));
  const sun=new THREE.DirectionalLight(0xfff0e0,.72);sun.position.set(-size*.5,size*1.4,size*.9);sun.castShadow=true;sun.shadow.mapSize.set(shadowMap,shadowMap);
  const c=sun.shadow.camera;c.left=-size;c.right=size;c.top=size;c.bottom=-size;c.near=.5;c.far=size*5;sun.shadow.bias=-.0008;sun.shadow.normalBias=.03;sun.shadow.radius=6;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xf0e6ff,.32);fill.position.set(size*.8,size*.5,-size*.4);scene.add(fill);
}
function makeRenderer(){const R=new THREE.WebGLRenderer({antialias:true,alpha:true});rkQuality(R,2);R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.12;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;return R;}
function animateItems(list,t){list.forEach(g=>{
  if(g.userData.bob){g.userData.bob.position.y=Math.sin(t*1.6+g.userData.phase)*.15;g.userData.bob.children.forEach((w,i)=>{const s=.35+Math.abs(Math.sin(t*9+i));w.userData.flap[0].scale.x=s;w.userData.flap[1].scale.x=s;});}
  if(g.userData.pet)g.position.y=g.userData.base+Math.abs(Math.sin(t*2.2+g.userData.phase))*.04;
  if(g.userData.fish)g.userData.fish.position.x=Math.sin(t*1.5)*.12;
  if(g.userData.swingSeats){
    const boost=g.userData.swingBoost||.38;
    const amp=boost*Math.sin(t*1.35+(g.userData.swingPhase||0));
    g.userData.swingSeats.forEach((s,i)=>s.rotation.z=amp*(i===0?1:-1)*.85);
    if(g.userData.swingBoost>.4)g.userData.swingBoost=Math.max(.38,g.userData.swingBoost*.992);
  }
});}

/* ================= ROOM EDITOR ================= */
const ROOM_SIZE={bedroom:[5.3,4.0,2.9],living:[5.3,4.0,2.9],kitchen:[5.3,4.0,2.9],garden:[6.6,4.8,3],bathroom:[5.3,4.0,2.9],playroom:[5.3,4.0,2.9]};
const ED={R:null,scene:null,cam:null,items:[],group:null,room:null,W:6,D:4.5,az:0,el:.42,azT:0,elT:.42,zoom:1.55,sel:null,ring:null,ro:null,looping:false,ray:null,drag:null};
/* Play directly inside furniture; this controller shares the room's camera and canvas. */
function storageApi(){return window.RikiFurnitureInteractions;}
function storageDisposeGhost(){const f=ED.storage;if(!f)return;if(f.sourceSlot!==null&&f.sourceSlot!==undefined){const slot=f.item.userData.storage.slots[f.sourceSlot];if(slot&&slot.content)slot.content.visible=true;}if(!f.ghost)return;ED.scene.remove(f.ghost);if(window.RK3.releaseStorageModel)window.RK3.releaseStorageModel(f.ghost);f.ghost=null;}
function storageClose(immediate=false){const f=ED.storage;if(!f)return;storageDisposeGhost();
 window.RK3.setStorageOpen(f.item,false);f.ui.remove();f.tray.remove();f.box.classList.remove('rk-storage-focus');f.panel&&f.panel.classList.remove('rk-storage-active');
 f.hidden.forEach(([o,visible])=>o.visible=visible);ED.ring.visible=false;
 if(immediate){ED.storage=null;return;}f.closing=true;f.camera.copy(f.originalCamera);f.look.copy(f.originalLook);f.selected='';f.drag=null;
}
function storageCamera(){const f=ED.storage;if(!f)return false;
 ED.cam.aspect=(ED.R.domElement.clientWidth||1)/(ED.R.domElement.clientHeight||1);ED.cam.fov=42;ED.cam.updateProjectionMatrix();
 if(!f.closing){const state=f.item.userData.storage,p=state.profile;f.item.updateMatrixWorld(true);
  f.look.copy(f.item.localToWorld(new THREE.Vector3(0,p.h*.48,.08)));
  const v=ED.cam.fov*Math.PI/180,h=2*Math.atan(Math.tan(v/2)*ED.cam.aspect);
  const worldScale=f.item.getWorldScale(new THREE.Vector3()).x;
  const wide=p.w*(state.parts.some(x=>x.kind==='door')?1.9:1.25)*worldScale;
  const tall=p.h*worldScale*1.15;const dist=Math.max(wide/2/Math.tan(h/2),tall/2/Math.tan(v/2))+.65;
  const rotation=f.item.getWorldQuaternion(new THREE.Quaternion());f.camera.copy(new THREE.Vector3(0,p.kind==='chest'?2.2:p.kind==='vanity'?1.6:p.kind==='drawers'?1.1:.24,1).normalize().multiplyScalar(dist).applyQuaternion(rotation).add(f.look));
 }
 const alpha=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches?1:.16;
 ED.cam.position.lerp(f.camera,alpha);f.currentLook.lerp(f.look,alpha);ED.cam.lookAt(f.currentLook);
 if(f.closing&&ED.cam.position.distanceTo(f.camera)<.015){ED.storage=null;return false;}
 return true;
}
function storagePick(e){const f=ED.storage;if(!f||f.closing)return null;
 const rect=ED.R.domElement.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.left+rect.width||e.clientY<rect.top||e.clientY>rect.top+rect.height)return null;
 const p=ndc({x:e.clientX,y:e.clientY});ED.ray.setFromCamera(p,ED.cam);
 const hits=ED.ray.intersectObject(f.item,true);const state=f.item.userData.storage;
 for(const hit of hits){let o=hit.object;while(o&&o!==f.item){
  if(o.userData.storedSlot!==undefined)return {kind:'content',slot:o.userData.storedSlot,point:hit.point};
  if(o.userData.storageSlot!==undefined&&o.visible){const i=o.userData.storageSlot;if(state.slots[i].pad.visible)return {kind:state.slots[i].content?'content':'slot',slot:i,point:hit.point};}
  if(o.userData.storagePart!==undefined)return {kind:'part',part:o.userData.storagePart,point:hit.point};
  o=o.parent;
 }
 // An opaque wall or closed door blocks items behind it.
 if(hit.object.material&&!hit.object.material.transparent)return null;
 }
 return null;
}
function storageHighlight(){const f=ED.storage;if(!f||f.closing)return;const contents=storageApi().contents(f.id,f.room);
 if(f.list)f.list.querySelectorAll('[data-storage-object]').forEach(b=>{const on=b.dataset.storageObject===f.selected;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
 f.item.userData.storage.slots.forEach((slot,i)=>{slot.pad.material.color.set(contents[i]?0xc7d8c8:f.selected?0xe2a34d:0xdbcbac);slot.pad.material.opacity=f.selected&&!contents[i] ? .15 : .06;});
}
function storageRefresh(){const f=ED.storage;if(!f||f.closing)return;const K=window.RK3,api=storageApi();ED.items.forEach(g=>K.hydrateStorage(g,f.room));
 const contents=api.contents(f.id,f.room);const items=G('ITEMS')||[],owned=G('owned')||[];
 const available=items.filter(it=>owned.includes(it[0])&&api.isEligible(f.id,it[0])&&!contents.includes(it[0]));
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const art=G('furnitureArt'),scroll=f.list.scrollLeft;
 f.list.innerHTML=available.map(it=>`<button type="button" data-storage-object="${it[0]}" aria-pressed="${f.selected===it[0]}" class="${f.selected===it[0]?'active':''}">${typeof art==='function'?art(it):it[1]}<small>${esc(it[2])}</small></button>`).join('')||'<p>Visit the shop for small items to put inside.</p>';
 f.list.scrollLeft=scroll;
 f.list.querySelectorAll('[data-storage-object]').forEach(b=>{
  b.onclick=()=>{if(performance.now()<(f.suppressUntil||0))return;storageChoose(b.dataset.storageObject);};
  b.onpointerdown=e=>{if(e.button!==0&&e.pointerType==='mouse')return;f.drag={x:e.clientX,y:e.clientY,from:'tray',id:b.dataset.storageObject,pointer:e.pointerId,pointerType:e.pointerType,moved:false};};
 });
 storageHighlight();
}
function storageChoose(id,fromSlot=null){const f=ED.storage;if(!f||!storageApi().isEligible(f.id,id))return;storageDisposeGhost();f.selected=id;f.sourceSlot=fromSlot;
 const it=(G('ITEMS')||[]).find(x=>x[0]===id);if(!it)return;
 f.status.textContent=(it[2]||'Item')+' selected. Tap a shelf space, or drag it there.';
 storageHighlight();
}
function storageGhost(e){const f=ED.storage;if(!f||!f.selected)return;
 if(f.sourceSlot!==null){const slot=f.item.userData.storage.slots[f.sourceSlot];if(slot&&slot.content)slot.content.visible=false;}
 if(!f.ghost){const it=(G('ITEMS')||[]).find(x=>x[0]===f.selected);if(!it)return;const ghost=window.RK3.makeItem(it);const box=new THREE.Box3().setFromObject(ghost),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());const fit=.32/Math.max(size.x,size.y,size.z,.01);ghost.scale.setScalar(fit);ghost.userData.offset=new THREE.Vector3(-center.x*fit,-box.min.y*fit,-center.z*fit);ED.scene.add(ghost);f.ghost=ghost;}
 const hit=storagePick(e);const slot=hit&&(hit.kind==='slot'||hit.kind==='content')?f.item.userData.storage.slots[hit.slot]:null;
 if(slot&&slot.pad.visible){f.ghost.position.copy(slot.parent.localToWorld(slot.position.clone())).add(f.ghost.userData.offset);}
 else{ED.ray.setFromCamera(ndc({x:e.clientX,y:e.clientY}),ED.cam);const normal=ED.cam.getWorldDirection(new THREE.Vector3()),plane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,f.look);const point=new THREE.Vector3();if(ED.ray.ray.intersectPlane(plane,point))f.ghost.position.copy(point).add(f.ghost.userData.offset);}
}
function storagePlace(slot){const f=ED.storage,api=storageApi();if(!f||!f.selected)return false;
 if(!api.storeItem(f.id,f.room,f.selected,slot)){f.status.textContent='Choose a shelf space. Drag a stored item onto another to swap them.';return false;}
 storageDisposeGhost();f.selected='';f.sourceSlot=null;f.status.textContent='Placed inside! Tap it to take it out, or choose another item.';storageRefresh();return true;
}
function storageDown(e){const f=ED.storage;if(!f||f.closing)return;f.drag={x:e.clientX,y:e.clientY,from:'canvas',hit:storagePick(e),pointer:e.pointerId,moved:false};try{ED.R.domElement.setPointerCapture(e.pointerId);}catch(_){}
}
function storageMove(e){const f=ED.storage,d=f&&f.drag;if(!d||d.pointer!==e.pointerId)return;
 const dx=e.clientX-d.x,dy=e.clientY-d.y;
 if(!d.moved&&Math.hypot(dx,dy)>9){
  // Sideways finger movement scrolls the tray; upward movement places an item.
  if(d.from==='tray'&&d.pointerType==='touch'&&Math.abs(dx)>Math.abs(dy)){f.drag=null;f.suppressUntil=performance.now()+250;return;}
  d.moved=true;
  if(d.from==='tray'){storageChoose(d.id);try{f.list.setPointerCapture(e.pointerId);}catch(_){}}
  else if(d.hit&&d.hit.kind==='content'){const item=storageApi().contents(f.id,f.room)[d.hit.slot];if(item)storageChoose(item,d.hit.slot);}
 }
 if(d.moved&&f.selected){if(e.cancelable)e.preventDefault();storageGhost(e);}
}
function storageDrop(e){const f=ED.storage;if(!f||!f.selected)return false;
 const hit=storagePick(e),state=f.item.userData.storage;
 if(hit&&(hit.kind==='slot'||hit.kind==='content'))return storagePlace(hit.slot);
 if(hit&&hit.kind==='part'){
  const part=state.parts[hit.part];
  if(part&&part.kind==='drawer'){
   const candidates=state.slots.map((slot,i)=>({slot,i})).filter(x=>x.slot.part===hit.part);
   candidates.sort((a,b)=>a.slot.parent.localToWorld(a.slot.position.clone()).distanceToSquared(hit.point)-b.slot.parent.localToWorld(b.slot.position.clone()).distanceToSquared(hit.point));
   if(Math.abs(part.target-part.closed)<.01)window.RK3.toggleStoragePart(f.item,hit.part);
   const contents=storageApi().contents(f.id,f.room),choice=candidates.find(x=>!contents[x.i]||x.i===f.sourceSlot)||candidates[0];
   if(choice)return storagePlace(choice.i);
  }
 }
 // Give shelf spaces a generous screen-space drop area on small phones.
 const rect=ED.R.domElement.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.left+rect.width||e.clientY<rect.top||e.clientY>rect.top+rect.height)return false;
 let closest=null,best=44*44;
 state.slots.forEach((slot,i)=>{if(!slot.pad.visible)return;const p=slot.pad.getWorldPosition(new THREE.Vector3()).project(ED.cam);const x=rect.left+(p.x+1)*rect.width/2,y=rect.top+(1-p.y)*rect.height/2,d=(e.clientX-x)**2+(e.clientY-y)**2;if(d<best){best=d;closest=i;}});
 return closest!==null&&storagePlace(closest);
}
function storageUp(e){const f=ED.storage,d=f&&f.drag;if(!d||d.pointer!==e.pointerId)return;f.drag=null;const hit=storagePick(e);
 if(d.moved){if(d.from==='tray')f.suppressUntil=performance.now()+180;
  if(f.selected&&storageDrop(e)){}
  else if(f.selected&&f.sourceSlot!==null){const r=f.tray.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){storageApi().takeItem(f.id,f.room,f.sourceSlot);f.status.textContent='Back in your collection.';f.selected='';f.sourceSlot=null;storageRefresh();}}
  storageDisposeGhost();return;
 }
 if(d.from==='tray')return;
 if(!hit)return;
 if(hit.kind==='part'){window.RK3.toggleStoragePart(f.item,hit.part);return;}
 if(hit.kind==='content'){storageApi().takeItem(f.id,f.room,hit.slot);f.status.textContent='Back in your collection.';f.selected='';storageDisposeGhost();storageRefresh();return;}
 if(hit.kind==='slot'&&f.selected)storagePlace(hit.slot);
}
function storageOpen(id){const api=storageApi(),item=ED.items.find(x=>x.userData.id===id);if(!item||!item.userData.storage||!api||!(G('owned')||[]).includes(id))return false;
 if(ED.storage)storageClose(true);
 const box=ED.R&&ED.R.domElement.parentElement;if(!box)return false;
 const it=(G('ITEMS')||[]).find(x=>x[0]===id),panel=box.closest('.dream-panel');
 const ui=document.createElement('div');ui.className='rk-storage-toolbar';const back=document.createElement('button');back.type='button';back.textContent='← Close & back to room';back.onclick=()=>storageClose();ui.appendChild(back);const title=document.createElement('strong');title.textContent=it?it[2]:'My furniture';ui.appendChild(title);box.appendChild(ui);
 const tray=document.createElement('section');tray.className='rk-storage-tray';tray.setAttribute('aria-label','Small items for open furniture');tray.innerHTML='<p class="rk-storage-help" role="status" aria-live="polite"></p><div class="rk-storage-scroll"><button type="button" class="rk-storage-prev" aria-label="Previous items">‹</button><div class="rk-storage-objects"></div><button type="button" class="rk-storage-next" aria-label="More items">›</button></div>';box.insertAdjacentElement('afterend',tray);
 const focus=new THREE.Vector3(0,ED.H*.3,-.3);
 ED.storage={id,item,room:ED.room,box,panel,ui,tray,list:tray.querySelector('.rk-storage-objects'),status:tray.querySelector('p'),camera:ED.cam.position.clone(),look:focus.clone(),currentLook:focus.clone(),originalCamera:ED.cam.position.clone(),originalLook:focus.clone(),selected:'',sourceSlot:null,ghost:null,drag:null,hidden:ED.items.filter(x=>x!==item).map(x=>[x,x.visible])};
 ED.storage.hidden.forEach(([o])=>o.visible=false);box.classList.add('rk-storage-focus');if(panel)panel.classList.add('rk-storage-active');ED.ring.visible=false;
 const list=ED.storage.list;tray.querySelector('.rk-storage-prev').onclick=()=>list.scrollBy({left:-Math.max(180,list.clientWidth*.8),behavior:'smooth'});tray.querySelector('.rk-storage-next').onclick=()=>list.scrollBy({left:Math.max(180,list.clientWidth*.8),behavior:'smooth'});
 list.addEventListener('wheel',e=>{if(list.scrollWidth>list.clientWidth&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){list.scrollLeft+=e.deltaY;e.preventDefault();}},{passive:false});
 window.RK3.setStorageOpen(item,true);storageRefresh();
 ED.storage.status.textContent=item.userData.storage.profile.kind==='drawers'||item.userData.storage.profile.kind==='vanity'?'Swipe options sideways. Drag an item upward into a drawer; tap a drawer handle to open it.':'Swipe options sideways. Drag an item upward onto a shelf, or tap an item then its space.';
 box.scrollIntoView({block:'start',behavior:'smooth'});return true;
}
document.addEventListener('pointermove',e=>{if(ED.storage&&ED.storage.drag&&ED.storage.drag.from==='tray')storageMove(e);});
document.addEventListener('pointerup',e=>{if(ED.storage&&ED.storage.drag&&ED.storage.drag.from==='tray')storageUp(e);});
document.addEventListener('pointercancel',()=>{if(ED.storage){ED.storage.drag=null;storageDisposeGhost();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ED.storage){storageClose();e.preventDefault();}});

try{ED.az=ED.azT=cl(Number(localStorage.getItem('rikiReal3dAz')||0),-.55,.55);}catch(e){}
let lastPtr=null;['pointermove','pointerdown','pointerup'].forEach(t=>document.addEventListener(t,e=>{lastPtr={x:e.clientX,y:e.clientY};},true));
function msg(t){const m=document.getElementById('dreamMessage');if(m)m.textContent=t;}
function edBuild(room){
  storageClose(true);
  reconcileCopies();
  ED.preview=null;ED.moveMode=false;
  // Show the whole room on first entry, not a close-up trapped inside its walls.
  // Rebuilding the same room retains an explicit "Look inside" choice.
  if(ED.room!==room)DIO.on=true;
  ED.az = ED.azT = 0;
  ED.el = ED.elT = 0.42;
  ED.zoom = DIO.on ? DIO.zoom : 1.35;
  const s=new THREE.Scene();ED.scene=s;ED.room=room;const [W,D,H]=ROOM_SIZE[room]||ROOM_SIZE.bedroom;ED.W=W;ED.D=D;ED.H=H;
  if(room==='garden'){s.background=new THREE.Color('#bfe3f5');}
  lights(s,Math.max(W,D),1024);
  const shell=new THREE.Group();s.add(shell);roomShell(shell,room,W,D,H);roomIdentity(shell,room,W,D,H);
  if(room!=='garden'){const L=new THREE.PointLight(0xffe2b8,.35,9,2);L.position.set(0,H-.4,.6);s.add(L);}
  dioDress(shell,s,room,W,D,H);if(DIO.on){const bx=document.getElementById('dreamRoom');const asp=bx&&bx.clientHeight?bx.clientWidth/bx.clientHeight:1.2;DIO.el=asp<.95?.7:.5;DIO.az=asp<.95?-.42:-.62;ED.az=ED.azT=DIO.az;ED.el=ED.elT=DIO.el;ED.zoom=DIO.zoom;ED.dioKey=null;}
  ED.group=new THREE.Group();s.add(ED.group);ED.items=fillItems(ED.group,room,W,D,1.5);if(window.RK3.hydrateStorage)ED.items.forEach(g=>window.RK3.hydrateStorage(g,room));
  ED.ceiling = shell.userData.ceiling || null;
  const ceilBtn = document.getElementById('rk3CeilingToggle');
  if (ceilBtn && ED.ceiling) {
    ceilBtn.onclick = () => {
      ED.ceiling.visible = !ED.ceiling.visible;
      ceilBtn.textContent = ED.ceiling.visible ? '🏠 Hide ceiling' : '🏠 Show ceiling';
    };
  }
  const zIn = document.getElementById('rk3ZoomIn'), zOut = document.getElementById('rk3ZoomOut');
  if (zIn) zIn.onclick = () => { ED.zoom = cl(ED.zoom - 0.12, 0.72, 1.8); ED.dioKey=null; };
  if (zOut) zOut.onclick = () => { ED.zoom = cl(ED.zoom + 0.12, 0.72, 1.8); ED.dioKey=null; };
  const center = document.getElementById('rk3Center');
  if (center) center.onclick = () => { if(DIO.on){ED.azT=DIO.az;ED.elT=DIO.el;ED.zoom=DIO.zoom;return;} ED.azT = 0; ED.elT = 0.42; ED.zoom = 1.35; };

  const ring=new THREE.Mesh(new THREE.RingGeometry(.62,.72,48),new THREE.MeshBasicMaterial({color:0xe2457a,transparent:true,opacity:.85,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.02;ring.visible=false;s.add(ring);ED.ring=ring;
  ED.floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  const selId=ED.sel;ED.sel=null;if(selId)edSelect(selId,true);
}
/* ===== Diorama view (Claude, Nov 1): look into the room from outside, like a cutaway dollhouse box ===== */
const DIO={on:true,az:-.62,el:.5,zoom:1.09,glow:null};
function dioMix(a,b,t){const A=parseInt(a.slice(1),16),Bq=parseInt(b.slice(1),16);const f=(s)=>Math.round(((A>>s)&255)*(1-t)+((Bq>>s)&255)*t);return '#'+((1<<24)|(f(16)<<16)|(f(8)<<8)|f(0)).toString(16).slice(1);}
function dioWall(room){const owned=G('owned')||[],ri=(G('roomInteriors')||{})[room]||{},INTER=G('INTERIORS')||[];const w=INTER.find(t=>t[0]===ri.wall&&owned.includes(t[0]));if(w&&/^#[0-9a-f]{6}$/i.test(w[3]))return w[3];return roomWallBase(room);}
function dioGlow(){if(DIO.glow)return DIO.glow;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,240,200,1)');g.addColorStop(.22,'rgba(255,214,150,.6)');g.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=g;x.fillRect(0,0,64,64);DIO.glow=new THREE.CanvasTexture(c);return DIO.glow;}
function dioBg(wall){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,110,20,128,128,200);g.addColorStop(0,dioMix(wall,'#a98890',.28));g.addColorStop(1,dioMix(wall,'#6f515a',.55));x.fillStyle=g;x.fillRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
function dioString(g,pts,sag){const bulbM=new THREE.MeshBasicMaterial({color:0xffe09a}),wireM=mat('#5a4038',.8);const P=[];const n=Math.max(4,Math.round(pts[0].distanceTo(pts[1])/.42));
  for(let i=0;i<=n;i++){const t=i/n;const p=pts[0].clone().lerp(pts[1],t);p.y-=Math.sin(t*Math.PI*Math.max(1,Math.round(n/5)))**2*sag;P.push(p);}
  const wire=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),n*4,.008,4,false),wireM);g.add(wire);
  P.forEach((p,i)=>{if(i===0||i===n)return;const cap=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.03,8),mat('#b8915a',.5,.3));cap.position.set(p.x,p.y-.02,p.z);g.add(cap);const b=new THREE.Mesh(new THREE.SphereGeometry(.042,12,10),bulbM);b.position.set(p.x,p.y-.065,p.z);g.add(b);
   const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:dioGlow(),color:0xffc878,opacity:.55,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sp.scale.set(.24,.24,1);sp.position.copy(b.position);sp.userData.dioGlow=1;g.add(sp);});}
function dioDress(shell,scene,room,W,D,H){ED.dioMeshes=null;ED.dioExtra=null;if(!DIO.on){if(room!=='garden')scene.background=null;return;}
  if(room==='garden'){const soil=RB(shell,W+2.3,.42,D+1.8,.14,mat('#b98c66',.92),0,-.3,.3);soil.castShadow=false;const lip=RB(shell,W+2.36,.08,D+1.86,.04,mat('#8fca7a',.9),0,-.07,.3);lip.castShadow=false;ED.dioMeshes=[];return;}
  const wall=dioWall(room);scene.background=dioBg(wall);
  {const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const gr=x.createRadialGradient(64,64,4,64,64,64);gr.addColorStop(0,'rgba(255,214,150,.9)');gr.addColorStop(.6,'rgba(255,200,130,.35)');gr.addColorStop(1,'rgba(255,190,120,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);const tx=new THREE.CanvasTexture(c);const pool=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.3),new THREE.MeshBasicMaterial({map:tx,color:0xffc98a,transparent:true,opacity:.2,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.rotation.z=.35;pool.position.set(-.35,.012,-D/2+1.15);pool.renderOrder=2;scene.userData.dioPool=pool;}
  const extra=new THREE.Group();extra.name='dioExtra';shell.add(extra);ED.dioExtra=extra;if(scene.userData.dioPool)extra.add(scene.userData.dioPool);
  const slab=RB(extra,W+.62,.34,D+.5,.1,mat('#ffffff',.85,0,{map:woodGrain('#d7ab7f')}),0,-.33,-.06);slab.castShadow=false;
  const cap=mat('#fff6ee',.85);
  RB(extra,W+.5,.1,.32,.05,cap,0,H+.03,-D/2-.09);
  [-1,1].forEach(sd=>{RB(extra,.32,.1,D+.2,.05,cap,sd*(W/2+.09),H+.03,.02);RB(extra,.32,H+.08,.1,.05,cap,sd*(W/2+.09),H/2,D/2+.06);});
  scene.traverse(o=>{if(o.isHemisphereLight){o.intensity=.4;o.color.set(0xfff0e4);o.groundColor.set(0xd9b8a8);}if(o.isAmbientLight)o.intensity=.1;if(o.isDirectionalLight&&o.castShadow){o.intensity=.95;o.color.set(0xffe2c0);}});
  scene.traverse(o=>{if(o.isPointLight){o.color.set(0xffd49a);o.intensity=.55;o.distance=8;o.position.set(0,H-.35,-D/2+1.1);}});
  const box=new THREE.Box3(),v=new THREE.Vector3();shell.updateMatrixWorld(true);const list=[];
  shell.traverse(o=>{if(!(o.isMesh||o.isSprite))return;let p=o,inCeil=false;while(p){if(p===shell.userData.ceiling){inCeil=true;break;}p=p.parent;}if(inCeil)return;box.setFromObject(o);box.getCenter(v);o.userData.dc=[v.x,v.y,v.z];let q=o,inX=false;while(q){if(q===extra){inX=true;break;}q=q.parent;}if(inX&&Math.abs(v.x)>W/2-.8&&v.z>-D/2+.85-.02)o.userData.dside=Math.sign(v.x);list.push(o);});
  ED.dioMeshes=list;}
function dioCut(){if(!ED.dioMeshes)return;const cx=ED.cam.position.x,W=ED.W;const hideR=cx>W/2,hideL=cx<-W/2;
  ED.dioMeshes.forEach(o=>{const x=o.userData.dc[0];o.visible=!((hideR&&x>W/2-.26)||(hideL&&x<-W/2+.26)||(o.userData.dside&&((hideR&&o.userData.dside>0)||(hideL&&o.userData.dside<0))));});if(ED.ceiling){ED.ceiling.visible=true;ED.ceiling.traverse(o=>{if(o.userData.dioramaRoofSlab)o.visible=false;});}}
function dioCamera(){if(ED.R.toneMappingExposure!==.84)ED.R.toneMappingExposure=.84;const c=ED.R.domElement,w=c.clientWidth||1,h=c.clientHeight||1;ED.cam.aspect=w/h;ED.cam.fov=30;
  const key=[ED.az.toFixed(3),ED.el.toFixed(3),ED.zoom.toFixed(3),w,h,ED.W,ED.D,ED.H].join();if(ED.dioKey===key)return;ED.dioKey=key;
  const W=ED.W,D=ED.D,H=ED.H,gd=ED.room==='garden';const xs=gd?[-W/2-.65,W/2+.65]:[-W/2-.28,W/2+.28],zs=gd?[-D/2-.3,D/2+.5]:[-D/2-.28,D/2+.28],ys=[-.2,gd?1:H+.04];
  const P=[];xs.forEach(x=>zs.forEach(z=>ys.forEach(y=>P.push(new THREE.Vector3(x,y,z)))));
  const dir=new THREE.Vector3(Math.sin(ED.az)*Math.cos(ED.el),Math.sin(ED.el),Math.cos(ED.az)*Math.cos(ED.el));
  const topPad=Math.min(.19,52/h*2),botPad=Math.min(.09,18/h*2),side=.018;const yMax=1-topPad,yMin=-1+botPad;
  const tgt=new THREE.Vector3(0,gd?.2:H*.35,gd?.3:0),v=new THREE.Vector3();
  const box=dist=>{ED.cam.position.copy(tgt).addScaledVector(dir,dist);ED.cam.lookAt(tgt);ED.cam.near=.1;ED.cam.far=dist*4+20;ED.cam.updateProjectionMatrix();ED.cam.updateMatrixWorld();let a=9,b=-9,c2=9,d=-9;P.forEach(p=>{v.copy(p).project(ED.cam);a=Math.min(a,v.x);b=Math.max(b,v.x);c2=Math.min(c2,v.y);d=Math.max(d,v.y);});return [a,b,c2,d];};
  const fit=()=>{let lo=1,hi=80;for(let k=0;k<26;k++){const m=(lo+hi)/2,[a,b,c2,d]=box(m);if(b-a<=2-2*side&&d-c2<=yMax-yMin)hi=m;else lo=m;}return hi;};
  for(let pass=0;pass<3;pass++){const dist=fit(),[a,b,c2,d]=box(dist);const cx=(a+b)/2,cy=(c2+d)/2,wantY=(yMax+yMin)/2;const hh=dist*Math.tan(ED.cam.fov*Math.PI/360),hw=hh*ED.cam.aspect;const right=new THREE.Vector3().setFromMatrixColumn(ED.cam.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(ED.cam.matrixWorld,1);tgt.addScaledVector(right,cx*hw).addScaledVector(up,(cy-wantY)*hh);}
  const dist=fit()*cl(ED.zoom/DIO.zoom,.72,1.7);box(dist);}
function dioToggleBtn(box){let b=box.querySelector('.rk3-dio');if(!b){b=document.createElement('button');b.type='button';b.className='rk3-dio';box.appendChild(b);b.onclick=e=>{e.stopPropagation();DIO.on=!DIO.on;edBuild(ED.room);dioToggleBtn(box);};}
  b.textContent=DIO.on?'👀 Look inside':'🏠 Dollhouse view';const cb=document.getElementById('rk3CeilingToggle');if(cb)cb.style.display=DIO.on?'none':'';
  if(!document.getElementById('dioCss')){const st=document.createElement('style');st.id='dioCss';st.textContent='.rk3-dio{position:absolute;left:10px;bottom:10px;z-index:6;border:0;border-radius:999px;padding:8px 13px;background:#fff;color:#4a2338;font-weight:900;font-size:13px;box-shadow:0 3px 10px #0002;cursor:pointer}';document.head.appendChild(st);}}
function edCamera(){
  if(storageCamera())return;
  if(DIO.on){dioCamera();return;}
  if(ED.R.toneMappingExposure!==1.12)ED.R.toneMappingExposure=1.12;
  const c=ED.R.domElement,w=c.clientWidth||1,h=c.clientHeight||1;ED.cam.aspect=w/h;ED.cam.fov=42;
  const vf=ED.cam.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*ED.cam.aspect);
  const need=Math.max((ED.W/2+.15)/Math.tan(hf/2),(ED.H*.62)/Math.tan(vf/2));const dist=need*ED.zoom+ED.D*.35;
  // Look higher as you tilt up so the ceiling underside comes into view
  const lookY = ED.H * (0.25 + Math.max(0, ED.el - 0.3) * 0.7);
  const tgt=new THREE.Vector3(0, Math.min(lookY, ED.H - 0.15), -.2);
  let camY = tgt.y + Math.sin(ED.el) * dist;
  camY = cl(camY, 0.4, ED.H - 0.3);
  let camX = tgt.x + Math.sin(ED.az) * Math.cos(ED.el) * dist;
  let camZ = tgt.z + Math.cos(ED.az) * Math.cos(ED.el) * dist;
  // Stay strictly inside the room walls
  const margin = 0.45;
  camX = cl(camX, -ED.W/2 + margin, ED.W/2 - margin);
  camZ = cl(camZ, -ED.D/2 + margin, ED.D/2 - margin);
  ED.cam.position.set(camX, camY, camZ);
  ED.cam.lookAt(tgt);
  ED.cam.updateProjectionMatrix();
}
function edResize(){if(!ED.R)return;const c=ED.R.domElement.parentElement;if(!c)return;const w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;ED.R.setSize(w,h,false);}
function edLoop(){
  if(!ED.R||!ED.R.domElement.isConnected){ED.looping=false;return;}
  requestAnimationFrame(edLoop);
  ED.az+=(ED.azT-ED.az)*.08;ED.el+=(ED.elT-ED.el)*.08;edCamera();if(DIO.on&&!ED.storage)dioCut();
  const t=performance.now()/1000;animateItems(ED.items,t);if(window.RK3.animateStorage)ED.items.forEach(g=>window.RK3.animateStorage(g));
  if(ED.ring.visible){ED.ring.material.opacity=.55+Math.sin(t*4)*.3;const g=ED.preview?ED.preview.group:ED.items.find(x=>x.userData.id===ED.sel);if(g&&!g.userData.onWall)ED.ring.position.set(g.position.x,.02,g.position.z);}
  rkFrame(ED.R);ED.R.render(ED.scene,ED.cam);
}
function ndc(e){const r=ED.R.domElement.getBoundingClientRect();return new THREE.Vector2(((e.x-r.left)/r.width)*2-1,-((e.y-r.top)/r.height)*2+1);}
function hitItem(pt){ED.ray.setFromCamera(ndc(pt),ED.cam);const hits=ED.ray.intersectObjects(ED.items,true);for(const h of hits){let o=h.object;while(o&&!o.userData.id)o=o.parent;if(o)return o;}return null;}
function hitFloor(pt){ED.ray.setFromCamera(ndc(pt),ED.cam);const v=new THREE.Vector3();if(!ED.ray.ray.intersectPlane(ED.floorPlane,v))return null;const lim=[(ED.W-1.3)/2,(ED.D-1.3)/2];v.x=cl(v.x,-lim[0],lim[0]);v.z=cl(v.z,-lim[1],lim[1]);return v;}
function edSelect(id,quiet){
  ED.sel=id;const g=ED.items.find(x=>x.userData.id===id);ED.ring.visible=!!g&&!g.userData.onWall;
  SET(`selectedItem=${JSON.stringify(id||'')};`);
  const status=document.getElementById('rk3SelectedStatus');
  if(status){const it=(G('ITEMS')||[]).find(t=>t[0]===id);status.textContent=id?'✨ Selected: '+(it?it[2]:'furniture')+' — drag to move, or tap the floor to place':'✨ Tap furniture to select it, or choose an owned item below';}
  const clear=document.getElementById('rk3ClearSelection');if(clear)clear.hidden=!id;
  try{rkUpdateBar();}catch(_){}
  if(!quiet&&g){const it=(G('ITEMS')||[]).find(t=>t[0]===id);const isSt=G('isStorage');const store=typeof isSt==='function'&&isSt(id);
    msg('Selected '+(it?it[2]:'furniture')+'. Drag it to move it'+(store?', or tap Open selected storage.':', or tap Remove to put it away.'));}
}
function place(id,X,Z){const room=G('currentRoom')||ED.room||'bedroom',already=Object.values((G('decor')||{})[room]||{}).includes(id);if(!already&&availableCopies(id,room)<1){msg('That copy is already in another room. Buy another one in the shop to place it here.');try{const a=G('audio');a&&a('bad');}catch(_){}return false;}const p=localToPct(X,Z,ED.W,ED.D),scale=rkScale(room,id);ED.internal=true;try{ORIG_PLACE(id,p.x,p.y);rkScaleSet(room,id,scale);}finally{ED.internal=false;}return true;}
function edPointers(cv){
  // Track touches *before* moving a piece. The original independent pinch
  // listeners also allowed the last finger to start dragging furniture or
  // orbiting the camera, sometimes saving an accidental placement.
  const touches=new Map();let pinching=false,pinchDist=0;
  cv.style.touchAction='none';
  const beginTouch=e=>{
    if(e.pointerType!=='touch')return false;
    touches.set(e.pointerId,[e.clientX,e.clientY]);
    if(touches.size>=2){
      pinching=true;
      // If the first finger moved furniture a little before the second
      // arrived, abandon that uncommitted drag and restore the original view.
      if(ED.drag?.moved&&ED.drag.item&&ED.drag.startPosition){
        ED.drag.item.position.copy(ED.drag.startPosition);
      }
      ED.drag=null;
      if(ED.storage){ED.storage.drag=null;storageDisposeGhost();}
      const pts=[...touches.values()];
      pinchDist=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);
      try{cv.setPointerCapture(e.pointerId);}catch(_){}
      if(e.cancelable)e.preventDefault();
    }
    return pinching;
  };
  const moveTouch=e=>{
    if(e.pointerType!=='touch'||!touches.has(e.pointerId))return false;
    touches.set(e.pointerId,[e.clientX,e.clientY]);
    if(!pinching)return false;
    if(touches.size===2&&!ED.storage){
      const pts=[...touches.values()],d=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);
      if(pinchDist>0&&d>0)ED.zoom=cl(ED.zoom*(pinchDist/d),.4,1.8);
      pinchDist=d;
    }
    if(e.cancelable)e.preventDefault();
    return true;
  };
  const endTouch=e=>{
    if(e.pointerType!=='touch')return false;
    const swallow=pinching;touches.delete(e.pointerId);
    if(!touches.size){pinching=false;pinchDist=0;}
    return swallow;
  };
  cv.addEventListener('pointerdown',e=>{if(beginTouch(e))return;if(ED.storage){storageDown(e);return;}const pt={x:e.clientX,y:e.clientY};let it=hitItem(pt);if(ED.preview){it=null;ED.ray.setFromCamera(ndc(pt),ED.cam);if(ED.ray.intersectObject(ED.preview.group,true).length)it=ED.preview.group;}ED.drag={sx:e.clientX,sy:e.clientY,lx:e.clientX,ly:e.clientY,item:it,startPosition:it?it.position.clone():null,moved:false,id:e.pointerId};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener('pointermove',e=>{if(moveTouch(e))return;if(ED.storage){storageMove(e);return;}const d=ED.drag;if(!d||d.id!==e.pointerId)return;if(!d.moved&&Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>14){d.moved=true;if(d.item){edSelect(d.item.userData.id,true);}}
    if(!d.moved)return;
    if(d.item&&!d.item.userData.onWall){const v=hitFloor({x:e.clientX,y:e.clientY});if(v){d.item.position.x=v.x;d.item.position.z=v.z;}}
    else if(d.item&&d.item.userData.onWall){const v=hitFloor({x:e.clientX,y:e.clientY});if(v)d.item.position.x=v.x;}
    else{ED.azT=cl(ED.azT-(e.clientX-d.lx)*.0028,DIO.on?-1.1:-.5,DIO.on?1.1:.5);ED.elT=cl(ED.elT+(e.clientY-d.ly)*.0022,DIO.on?.25:.2,DIO.on?1.05:.85);}
    d.lx=e.clientX;d.ly=e.clientY;});
  let lastTap = 0, lastTapX = 0, lastTapY = 0;
  const up=e=>{if(endTouch(e))return;if(ED.storage){storageUp(e);return;}const d=ED.drag;if(!d||d.id!==e.pointerId)return;ED.drag=null;
    // Double-tap to zoom into the tapped area
    if (!d.moved && !d.item) {
      const now = performance.now();
      if (now - lastTap < 320 && Math.hypot(e.clientX - lastTapX, e.clientY - lastTapY) < 40) {
        ED.zoom = cl(ED.zoom - 0.28, 0.35, 1.8);
        lastTap = 0;
      } else {
        lastTap = now; lastTapX = e.clientX; lastTapY = e.clientY;
      }
    }
    if(ED.preview){if(!d.moved&&!d.item){const v=hitFloor({x:e.clientX,y:e.clientY});if(v&&!ED.preview.group.userData.onWall){ED.preview.group.position.x=v.x;ED.preview.group.position.z=v.z;}else if(v)ED.preview.group.position.x=v.x;}return;}
    if(d.item&&d.moved){const g=d.item;place(g.userData.id,g.position.x,g.userData.onWall?ED.D/2:g.position.z);return;}
    if(d.item&&!d.moved){edSelect(d.item.userData.id);if(d.item.userData.storage)storageOpen(d.item.userData.id);if(d.item.userData.swingSeats)d.item.userData.swingBoost=1.15;try{const a=G('audio');a&&a('tap');}catch(_){}return;}
    if(!d.moved&&ED.moveMode&&ED.sel){const v=hitFloor({x:e.clientX,y:e.clientY});ED.moveMode=false;if(v){place(ED.sel,v.x,v.z);return;}}
    if(!d.moved){const sel=G('selectedItem');const owned=G('owned')||[];
      if(sel&&owned.includes(sel)){const v=hitFloor({x:e.clientX,y:e.clientY});if(v){place(sel,v.x,v.z);return;}}
      ED.sel=null;ED.ring.visible=false;return;}
    try{localStorage.setItem('rikiReal3dAz',ED.azT);}catch(_){}};
  cv.addEventListener('pointerup',up);
  cv.addEventListener('pointercancel',e=>{
    endTouch(e);ED.drag=null;
    if(ED.storage){ED.storage.drag=null;storageDisposeGhost();}
  });
  cv.addEventListener('wheel',e=>{
    e.preventDefault();if(ED.storage)return;
    ED.zoom=cl(ED.zoom+e.deltaY*.001,.4,1.8);
  },{passive:false});
}
function edMount(){
  const box=document.getElementById('dreamRoom');if(!box||!box.classList.contains('rk3-room'))return;
  const room=G('currentRoom')||'bedroom';
  loadThree(()=>{
    try{
      if(!ED.R){ED.R=makeRenderer();ED.cam=new THREE.PerspectiveCamera(42,1,.1,100);ED.ray=new THREE.Raycaster();edPointers(ED.R.domElement);}
      // A newly mounted room starts in whole-room view even when the last session looked inside.
      if(ED.R.domElement.parentElement!==box)DIO.on=true;
      const ld=box.querySelector('.rk3-load');if(ld)ld.remove();
      box.prepend(ED.R.domElement);
      edBuild(room);dioToggleBtn(box);
      if(ED.ro)ED.ro.disconnect();ED.ro=new ResizeObserver(edResize);ED.ro.observe(box);edResize();
      if(!ED.looping){ED.looping=true;edLoop();}
    }catch(err){const ld=box.querySelector('.rk3-load')||box.appendChild(Object.assign(document.createElement('div'),{className:'rk3-load'}));ld.textContent='The 3D room could not start on this device.';console.error(err);}
  },()=>{const ld=box.querySelector('.rk3-load');if(ld)ld.textContent='The 3D room needs an internet connection to load.';});
}

/* ---- hook into the game's decorate screen ---- */
const ORIG_PLACE=window.placeDream;
if(typeof ORIG_PLACE==='function'){
  window.placeDream=function(id,x,y){
    if(!ED.internal&&ED.R&&ED.R.domElement.isConnected&&lastPtr){const r=ED.R.domElement.getBoundingClientRect();
      if(lastPtr.x>=r.left&&lastPtr.x<=r.right&&lastPtr.y>=r.top&&lastPtr.y<=r.bottom){const v=hitFloor(lastPtr);if(v){const p=localToPct(v.x,v.z,ED.W,ED.D);x=p.x;y=p.y;}}}
    const room=G('currentRoom')||'bedroom',already=Object.values((G('decor')||{})[room]||{}).includes(id);if(!already&&availableCopies(id,room)<1){msg('That copy is already in another room. Buy another one in the shop to place it here.');return false;}
    const scale=rkScale(room,id),out=ORIG_PLACE.call(this,id,x,y);rkScaleSet(room,id,scale);const placed=ED.items.find(item=>item.userData.id===id);if(placed){placed.scale.setScalar(1.35*scale);placed.userData.rikiScale=scale;}return out;
  };
}
const NICE={bedroom:'Princess bedroom',living:'Cozy living room',kitchen:'Sunny kitchen',garden:'Garden terrace',bathroom:'Cozy bathroom',playroom:'Playroom'};
const prevHtml=G('decorateHtml'),prevBind=G('bindDecor');
if(typeof prevHtml==='function'&&typeof prevBind==='function'){
  const newHtml=function(){let h=prevHtml.apply(this,arguments);const room=G('currentRoom')||'bedroom';
    h=h.replace(/<div class="dream-room dream3d" id="dreamRoom">\s*<canvas[^>]*><\/canvas>/,`<div class="rk3-room ${room}" id="dreamRoom"><div class="rk3-load">Building your room…</div>`);
    h=h.replace(/<div class="riki3d-hud">[\s\S]*?<\/div>/,`<div class="riki3d-hud"><span>🏡 ${NICE[room]||'Dream room'}</span><span>Drag to look around</span><button type="button" class="smallbtn" id="rk3ZoomOut" style="pointer-events:auto" aria-label="Zoom out">−</button><button type="button" class="smallbtn" id="rk3ZoomIn" style="pointer-events:auto" aria-label="Zoom in">+</button><button type="button" class="smallbtn" id="rk3Center" style="pointer-events:auto" aria-label="Center view">◎</button><button type="button" class="smallbtn" id="rk3CeilingToggle" style="pointer-events:auto;margin-left:auto">🏠 Hide ceiling</button></div>`);
    h=h.replace(/<p class="riki3d-legend">[\s\S]*?<\/p>/,'<p class="riki3d-legend">Tap something you bought below, then tap the floor to place it. Drag furniture to move it. Drag the empty room to look around.</p>');
    h=h.replace(/<p class="riki3d-legend">[\s\S]*?<\/p>/,`<p class="riki3d-legend">Tap an owned item below, then tap the floor to place it. Tap furniture to select it and drag to move. Drag empty space to look around.</p><div class="rk3-selection-tools" style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:10px 0"><strong id="rk3SelectedStatus" role="status" aria-live="polite">✨ Tap furniture to select it, or choose an owned item below</strong><button type="button" class="smallbtn" id="rk3ClearSelection" hidden>✕ Deselect</button></div>`);
    // Remove any floor-buy buttons that may have been left in the room view
    h = h.replace(/<div class="riki3d-hud"[^>]*>[\s\S]*?Floors:[\s\S]*?<\/div>/g, '');
    h = h.replace(/data-floor="[^"]*"/g, '');
    return h;};
  /* Easier decorating (Claude, Oct 29): tray of owned items right under the room, tap to add,
     a floating bar for the selected piece, and the extra sections folded away. */
  const rkOpen={};
  function rkFreeSpot(room){const pos=(G('dreamPosition')||{})[room]||{};const taken=Object.values(pos);const C=[[50,62],[30,70],[70,70],[40,48],[62,48],[24,82],[76,82],[50,82],[20,56],[80,56]];
    for(const [x,y] of C){if(!taken.some(p=>Math.hypot((p.x||0)-x,(p.y||0)-y)<14))return {x,y};}return {x:30+Math.random()*40,y:55+Math.random()*25};}
  window.rkUpdateBar=function(){const bar=document.getElementById('rk3Bar');if(!bar)return;const pv=ED.preview;const id=pv?pv.id:ED.sel;const has=pv||(!!id&&ED.items.some(x=>x.userData.id===id));bar.hidden=!has;bar.classList.toggle('preview',!!pv);
    const isSt=G('isStorage');const show=(k,on)=>{const e=document.getElementById(k);if(e)e.hidden=!on;};const g=pv?pv.group:ED.items.find(x=>x.userData.id===id);const wall=!!(g&&g.userData.onWall);
    show('rk3BarPlace',!!pv);show('rk3BarCancel',!!pv);show('rk3BarRotate',has&&!wall);show('rk3BarSmaller',has);show('rk3BarBigger',has);show('rk3BarMove',has&&!pv);show('rk3BarOpen',has&&!pv&&typeof isSt==='function'&&isSt(id));show('rk3BarAway',has&&!pv);show('rk3BarDone',has&&!pv);
    const it=(G('ITEMS')||[]).find(t=>t[0]===id);const n=document.getElementById('rk3BarName');if(n)n.textContent=pv?'Drag it or tap the floor, then Place':ED.moveMode?'Tap the floor where it should go':(it?it[2]:'');if(ED.ring)ED.ring.visible=!!has&&!wall;};
  function rkPreview(id,room){
    rkCancelPreview(true);const it=(G('ITEMS')||[]).find(t=>t[0]===id);if(!it||!ED.scene)return;if(availableCopies(id,room)<1){msg('Every copy is already being used. Buy another '+it[2]+' to place one here.');try{const a=G('audio');a&&a('bad');}catch(_){}return;}const g=makeItem(it);g.scale.setScalar(1.35*rkScale(room,id));g.userData.id=id;g.userData.ghost=1;
    g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.6;o.castShadow=false;}});
    const p=rkFreeSpot(room);const [X,Z]=pctToLocal(p,ED.W,ED.D);if(g.userData.onWall)g.position.set(X,1.55,-ED.D/2+.06);else g.position.set(X,0,Z);
    ED.scene.add(g);ED.preview={id,group:g,deg:0};ED.sel=null;rkUpdateBar();try{const a=G('audio');a&&a('tap');}catch(_){}
    const box=document.getElementById('dreamRoom');if(box){const r=box.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)box.scrollIntoView({block:'center',behavior:'smooth'});}}
  function rkCancelPreview(quiet){if(ED.preview){if(ED.scene)ED.scene.remove(ED.preview.group);ED.preview=null;}if(!quiet)rkUpdateBar();}
  function rkLayout(box){
    const panel=box.closest('.dream-panel');if(!panel)return;const room=G('currentRoom')||'bedroom';
    box.insertAdjacentHTML('beforeend',`<button type="button" class="rk3-front" id="rk3Front" aria-label="Front view">⟲</button>`);box.insertAdjacentHTML('afterend',`<div class="rk3-bar" id="rk3Bar" hidden><span id="rk3BarName"></span><button type="button" id="rk3BarSmaller" aria-label="Make selected item smaller">− Smaller</button><button type="button" id="rk3BarBigger" aria-label="Make selected item bigger">＋ Bigger</button><button type="button" id="rk3BarRotate">↻ Turn</button><button type="button" id="rk3BarMove">✥ Move</button><button type="button" id="rk3BarOpen" hidden>🗄️ Open</button><button type="button" id="rk3BarAway">🧺 Put away</button><button type="button" id="rk3BarDone">✓ Done</button><button type="button" id="rk3BarCancel" hidden>✕ Cancel</button><button type="button" id="rk3BarPlace" hidden>✓ Place here</button></div>`);
    const $=id=>document.getElementById(id);
    $('rk3Front').onclick=()=>{ED.azT=DIO.on?DIO.az:0;ED.elT=DIO.on?DIO.el:.42;ED.zoom=DIO.on?DIO.zoom:1.35;};
    $('rk3BarDone').onclick=()=>{ED.moveMode=false;edSelect(null,true);};
    $('rk3BarMove').onclick=()=>{ED.moveMode=true;rkUpdateBar();};
    $('rk3BarCancel').onclick=()=>rkCancelPreview();
    const resize=delta=>{const pv=ED.preview,id=pv?pv.id:ED.sel,g=pv?pv.group:ED.items.find(x=>x.userData.id===id);if(!id||!g)return;const next=cl(rkScale(room,id)+delta,.65,1.55);rkScaleSet(room,id,next);g.scale.setScalar(1.35*next);g.userData.rikiScale=next;msg((G('ITEMS')||[]).find(x=>x[0]===id)?.[2]+' size: '+Math.round(next*100)+'%');try{const a=G('audio');a&&a('tap');}catch(_){}};
    $('rk3BarSmaller').onclick=()=>resize(-.15);$('rk3BarBigger').onclick=()=>resize(.15);
    $('rk3BarPlace').onclick=()=>{const pv=ED.preview;if(!pv)return;const g=pv.group;const X=g.position.x,Z=g.userData.onWall?ED.D/2:g.position.z;const deg=pv.deg;rkCancelPreview(true);ED.sel=pv.id;
      if(deg){const r=rkRot();r[room+':'+pv.id]=deg;rkRotSave(r);}place(pv.id,X,Z);};
    $('rk3BarRotate').onclick=()=>{try{const a=G('audio');a&&a('tap');}catch(_){}
      if(ED.preview){ED.preview.deg=(ED.preview.deg+45)%360;ED.preview.group.rotation.y=-ED.preview.deg*Math.PI/180;return;}
      const id=ED.sel;const g=ED.items.find(x=>x.userData.id===id);if(!g)return;const r=rkRot();const k=room+':'+id;const cur=r[k]!==undefined?Number(r[k]):Math.round(-g.rotation.y*180/Math.PI/45)*45;const deg=(((cur+45)%360)+360)%360;r[k]=deg;rkRotSave(r);g.rotation.y=-deg*Math.PI/180;};
    $('rk3BarOpen').onclick=()=>{const sm=G('storageModal');if(ED.sel&&typeof sm==='function')sm(ED.sel);};
    $('rk3BarAway').onclick=()=>{const id=ED.sel;if(!id)return;const decor=G('decor')||{};const pl=decor[room]||{};Object.keys(pl).forEach(k=>{if(pl[k]===id)delete pl[k];});decor[room]=pl;try{const sv=G('saveHouse');sv&&sv();}catch(_){}ED.sel=null;SET("selectedItem='';");try{const a=G('audio');a&&a('tap');}catch(_){}const hr=G('houseRender');hr&&hr();};
    /* tray */
    const inv=panel.querySelector('.dream-inventory');
    if(inv){const head=inv.previousElementSibling&&inv.previousElementSibling.tagName==='H3'?inv.previousElementSibling:null;const wrap=document.createElement('div');wrap.className='rk3-tray';
      wrap.innerHTML='<div class="rk3-tray-title">Tap something to put it in your room</div>';(document.getElementById('rk3Bar')||box).after(wrap);wrap.appendChild(inv);if(head)head.remove();
      const placed=Object.values((G('decor')||{})[room]||{});inv.querySelectorAll('[data-dream-inventory]').forEach(b=>{const id=b.dataset.dreamInventory,total=ownedCopies(id),free=availableCopies(id,room),here=placed.includes(id);if(here)b.classList.add('rk3-in-room');if(!here&&!free)b.classList.add('rk3-unavailable');b.insertAdjacentHTML('beforeend',`<span class="rk3-copy-count">${free?free+' available':here?'In this room':total+' in use'}</span>`);});
      if(!inv.querySelector('[data-dream-inventory]'))wrap.querySelector('.rk3-tray-title').textContent='Buy furniture in the shop, then it shows up here';
      inv.addEventListener('click',e=>{const b=e.target.closest('[data-dream-inventory]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const id=b.dataset.dreamInventory;
        if(placed.includes(id)){rkCancelPreview(true);edSelect(id);return;}if(!availableCopies(id,room)){msg('That item is already in another room. Buy another copy to use it here.');try{const a=G('audio');a&&a('bad');}catch(_){}return;}rkPreview(id,room);},true);}
    /* fold the rest away */
    const kids=[...panel.children];const after=kids.slice(kids.indexOf(box.nextElementSibling)+1);
    const hide=['riki3d-actions','riki3d-legend','rk3-selection-tools','dream-toolbar'];after.forEach(el=>{if(hide.some(c=>el.classList.contains(c)))el.classList.add('rk3-hidden');});
    const groups=[];let cur=null;
    after.forEach(el=>{if(el.classList.contains('rk3-hidden')||el.id==='dreamMessage')return;const t=el.tagName==='H3'?el.textContent:'';
      if(/treasure/i.test(t)){cur={label:'🧸 Little treasures',els:[]};groups.push(cur);}else if(/decorate|wallpaper|curtain|design/i.test(t)&&!(cur&&cur.label.startsWith('🎨'))){cur={label:'🎨 Walls & curtains',els:[]};groups.push(cur);}
      if(cur)cur.els.push(el);});
    groups.forEach(gp=>{const d=document.createElement('details');d.className='rk3-more';if(rkOpen[gp.label])d.open=true;d.innerHTML=`<summary>${gp.label}</summary>`;gp.els[0].before(d);gp.els.forEach(el=>{if(el.tagName==='H3'&&el===gp.els[0])el.remove();else d.appendChild(el);});d.addEventListener('toggle',()=>{rkOpen[gp.label]=d.open;});});
    rkUpdateBar();
  }
  const newBind=function(){prevBind.apply(this,arguments);const box=document.getElementById('dreamRoom');if(!box||!box.classList.contains('rk3-room'))return;
    box.onclick=null;
    const $=id=>document.getElementById(id);
    if($('rk3ClearSelection'))$('rk3ClearSelection').onclick=()=>{edSelect(null,true);msg('Selection cleared. Choose an item below to decorate.');};
    if($('orbitLeft'))$('orbitLeft').onclick=()=>{ED.azT=cl(ED.azT-.3,DIO.on?-1.1:-.55,DIO.on?1.1:.55);};
    if($('orbitRight'))$('orbitRight').onclick=()=>{ED.azT=cl(ED.azT+.3,DIO.on?-1.1:-.55,DIO.on?1.1:.55);};
    if($('orbitReset'))$('orbitReset').onclick=()=>{if(DIO.on){ED.azT=DIO.az;ED.elT=DIO.el;ED.zoom=DIO.zoom;return;}ED.azT=0;ED.elT=.42;ED.zoom=1.35;};
    if($('openSelected'))$('openSelected').onclick=()=>{const id=ED.sel||G('selectedItem');const isSt=G('isStorage'),sm=G('storageModal');if(id&&typeof isSt==='function'&&isSt(id)&&typeof sm==='function')sm(id);else msg('Tap a shelf, vanity or dresser in the room first, then tap Open.');};
    edMount();try{rkLayout(box);}catch(err){console.warn('decor layout',err);}};
  window.__rk3Html=newHtml;window.__rk3Bind=newBind;
  SET('decorateHtml=window.__rk3Html;bindDecor=window.__rk3Bind;dreamHtml=window.__rk3Html;dreamBind=window.__rk3Bind;');
  try{if(G('game')==='house'&&G('housePage')==='decorate'&&document.getElementById('dreamRoom')){const hr=G('houseRender');hr&&hr();}}catch(_){}
}

/* ================= WHOLE HOUSE ================= */
const NAMES={all:'Whole house',bedroom:'Bedroom',living:'Living room',kitchen:'Kitchen',garden:'Garden'};
const ov=document.createElement('div');ov.className='wh3d';ov.hidden=true;ov.setAttribute('role','dialog');ov.setAttribute('aria-label',"Riki's whole house in 3D");
ov.innerHTML=`<div class="wh3d-top"><b>Riki's Whole House</b><button type="button" data-close>✕ Close</button></div>
<div class="wh3d-stage" id="wh3dStage"><span class="wh3d-hint">Drag to spin · tap a room to zoom</span><div class="wh3d-ctl"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="all" aria-label="Whole house">⟲</button></div></div>
<div class="wh3d-chips">${Object.entries(NAMES).map(([k,v])=>`<button type="button" data-room="${k}" aria-pressed="${k==='all'}">${v}</button>`).join('')}</div>
<button type="button" class="wh3d-go" id="wh3dGo" disabled>Pick a room to decorate</button>`;
document.body.appendChild(ov);
const stage=ov.querySelector('#wh3dStage');
const H={R:null,scene:null,cam:null,look:null,lookT:null,dist:16,rotY:.35,rotX:.12,distT:16,rotYT:.35,rotXT:.12,open:false,focus:'all',looping:false,items:[]};
const RD=3.6,RH=3;
const ROOMDEF={bedroom:{x:0,y:3.15,w:8.4},living:{x:-2.15,y:0,w:4.2},kitchen:{x:2.15,y:0,w:4.2}};
function houseBuild(){
  if(H.scene)disposeScene(H.scene);const s=new THREE.Scene();H.scene=s;lights(s,9,1536);H.items=[];
  const yard=add(s,new THREE.BoxGeometry(17,.3,13),mat('#ffffff',.95,0,{map:grassTex()}),0,-.2,3);yard.castShadow=false;
  add(s,new THREE.BoxGeometry(9.2,.25,RD+.5),mat('#e3d6c6',.9,0,{map:stoneTex()}),0,-.05,0);
  Object.entries(ROOMDEF).forEach(([id,d])=>{const g=new THREE.Group();g.position.set(d.x,d.y,0);s.add(g);roomShell(g,id,d.w,RD,RH,{noSides:true,windows:d.w>5?[-2.2,2.2]:[0]});
    const ig=new THREE.Group();g.add(ig);H.items.push(...fillItems(ig,id,d.w,RD,.8));});
  const sid=mat('#ffffff',.85,0,{map:sidingTex()}),trim=mat('#ffffff',.45);
  BX(s,8.7,RH*2+.4,.18,sid,0,RH+.15,-RD/2-.2);
  [-1,1].forEach(k=>{BX(s,.18,RH*2+.4,RD+.3,sid,k*4.33,RH+.15,-.02);BX(s,.14,RH*2+.4,.14,trim,k*4.33,RH+.15,RD/2+.1);});
  BX(s,.14,RH,RD,mat('#fff6f0',.8),0,RH/2,0);
  BX(s,8.8,.18,RD+.35,trim,0,RH-.06,0);BX(s,8.8,.14,RD+.35,trim,0,RH*2+.18,0);
  const sh=new THREE.Shape();sh.moveTo(-4.9,0);sh.lineTo(0,2.5);sh.lineTo(4.9,0);sh.lineTo(-4.9,0);
  const shg=mat('#ffffff',.8,0,{map:shingleTex()});const roof=add(s,new THREE.ExtrudeGeometry(sh,{depth:RD+.9,bevelEnabled:false}),shg,0,RH*2+.25,-RD/2-.45);
  const at=new THREE.Shape();at.moveTo(-4.3,0);at.lineTo(0,2.05);at.lineTo(4.3,0);at.lineTo(-4.3,0);
  add(s,new THREE.ShapeGeometry(at),mat('#ffffff',.85,0,{map:sidingTex()}),0,RH*2+.26,RD/2+.43).castShadow=false;
  const win=new THREE.Group();win.position.set(0,RH*2+.95,RD/2+.45);s.add(win);add(win,new THREE.CircleGeometry(.42,32),new THREE.MeshBasicMaterial({map:skyTex()}),0,0,0).castShadow=false;const tr=add(win,new THREE.TorusGeometry(.44,.05,10,32),trim,0,0,.02);
  BX(s,.5,1.1,.5,mat('#c98b6f',.9),2.5,RH*2+1.6,-.5);BX(s,.62,.1,.62,trim,2.5,RH*2+2.2,-.5);
  add(s,new THREE.BoxGeometry(1.4,.05,4.6),mat('#ffffff',.9,0,{map:stoneTex()}),0,-.04,RD/2+2.4).castShadow=false;
  const fence=wood('#fbf4ea');for(let i=-7;i<=7;i++){if(Math.abs(i)<1)continue;RB(s,.12,.7,.06,.02,fence,i*.6,.3,RD/2+4.8);CO(s,.07,.12,fence,i*.6,.71,RD/2+4.8);}
  [-1,1].forEach(k=>[.2,.48].forEach(y=>BX(s,3.9,.06,.04,fence,k*2.55,y,RD/2+4.83)));
  [[-4.6,1.9],[4.6,1.9],[-3.3,2.2],[3.3,2.2]].forEach(([x,z],i)=>add(s,new THREE.IcosahedronGeometry(.45-i%2*.1,1),mat(['#4f9e5b','#5fb06a'][i%2],.9),x,.3,z));
  const gi=new THREE.Group();gi.position.set(0,0,RD/2+2.5);s.add(gi);H.garden=gi;H.items.push(...fillItems(gi,'garden',11.5,3.6,1.1).map(g=>{if(Math.abs(g.position.x)<1)g.position.x+=g.position.x<0?-1.1:1.1;return g;}));
}
function hSetT(l,d,ry,rx){H.lookT.set(l[0],l[1],l[2]);H.distT=d;H.rotYT=ry;H.rotXT=rx;}
const FOCUS={all:[[0,3.2,0],16.5,.38,.14],bedroom:[[0,4.4,0],9.5,0,.16],living:[[-2.15,1.35,0],7.2,0,.08],kitchen:[[2.15,1.35,0],7.2,0,.08],garden:[[0,.8,4.4],10.5,0,.34]};
function hFocus(r){H.focus=r;const f=FOCUS[r];hSetT(f[0],f[1],f[2],f[3]);ov.querySelectorAll('[data-room]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.room===r));
  const go=ov.querySelector('#wh3dGo');go.disabled=r==='all';go.textContent=r==='all'?'Pick a room to decorate':`Decorate the ${NAMES[r].toLowerCase()}`;}
function hResize(){if(!H.R)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;H.R.setSize(w,h,false);H.cam.aspect=w/h;H.cam.fov=w<500?48:40;H.cam.updateProjectionMatrix();}
function hLoop(){if(!H.open){H.looping=false;return;}requestAnimationFrame(hLoop);const k=.1;
  H.dist+=(H.distT-H.dist)*k;H.rotY+=(H.rotYT-H.rotY)*k;H.rotX+=(H.rotXT-H.rotX)*k;H.look.lerp(H.lookT,k);const el=H.rotX+.1;
  H.cam.position.set(H.look.x+Math.sin(H.rotY)*Math.cos(el)*H.dist,H.look.y+Math.sin(el)*H.dist,H.look.z+Math.cos(H.rotY)*Math.cos(el)*H.dist);H.cam.lookAt(H.look);
  if(H.garden)H.garden.visible=(H.focus==='all'||H.focus==='garden');animateItems(H.items,performance.now()/1000);rkFrame(H.R);H.R.render(H.scene,H.cam);}
function hInit(){
  H.R=makeRenderer();stage.prepend(H.R.domElement);H.cam=new THREE.PerspectiveCamera(40,1,.1,120);H.look=new THREE.Vector3(0,3.2,0);H.lookT=H.look.clone();
  const pts=new Map();let last=null,pinch=0;
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;pts.set(e.pointerId,[e.clientX,e.clientY]);try{stage.setPointerCapture(e.pointerId)}catch(_){}last=[e.clientX,e.clientY];});
  stage.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2){const [a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch){H.dist=cl(H.dist*(pinch/d),4,24);H.distT=H.dist;}pinch=d;return;}
    H.rotY-=(e.clientX-last[0])*.009;H.rotYT=H.rotY;H.rotX=cl(H.rotX+(e.clientY-last[1])*.004,-.05,.6);H.rotXT=H.rotX;last=[e.clientX,e.clientY];});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=0;const r=[...pts.values()][0];if(r)last=r;};
  stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
  stage.addEventListener('wheel',e=>{e.preventDefault();H.distT=cl(H.distT+e.deltaY*.01,4,24);},{passive:false});
  window.addEventListener('resize',hResize);
}
function say(m){let el=stage.querySelector('.rk3-load');if(!el){el=document.createElement('div');el.className='rk3-load';stage.appendChild(el);}el.textContent=m;}
function openHouse(){ov.hidden=false;H.open=true;document.documentElement.style.overflow='hidden';try{const a=G('audio');a&&a('tap');}catch(_){}
  say('Building the house…');
  loadThree(()=>{try{if(!H.R)hInit();houseBuild();const l=stage.querySelector('.rk3-load');if(l)l.remove();hResize();hFocus('all');H.dist=H.distT+5;if(!H.looping){H.looping=true;hLoop();}}catch(err){console.error(err);say('The 3D house could not start on this device.');}},()=>say('The 3D house needs an internet connection to load.'));}
function closeHouse(){ov.hidden=true;H.open=false;document.documentElement.style.overflow='';}
ov.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.close!==undefined)return closeHouse();
  if(b.dataset.room)return hFocus(b.dataset.room);
  if(b.dataset.z==='in')H.distT=Math.max(4,H.distT-2);if(b.dataset.z==='out')H.distT=Math.min(24,H.distT+2);if(b.dataset.z==='all')hFocus('all');
  if(b.id==='wh3dGo'&&H.focus!=='all'){const r=H.focus;closeHouse();SET(`currentRoom=${JSON.stringify(r)};housePage='decorate';selectedItem='';`);try{const hr=G('houseRender');hr&&hr();}catch(_){}window.scrollTo(0,0);}});
document.addEventListener('keydown',e=>{if(H.open&&e.key==='Escape')closeHouse();});
function addButtons(){document.querySelectorAll('.house-nav').forEach(n=>{if(n.querySelector('.wh3d-open'))return;const b=document.createElement('button');b.type='button';b.className='secondary wh3d-open';b.textContent='🏡 Whole house 3D';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openHouse();});n.appendChild(b);});}
new MutationObserver(addButtons).observe(document.body,{childList:true,subtree:true});addButtons();
window.openWholeHouse3D=openHouse;
/* Snapshot of one of Riki's real rooms (her own furniture and layout) for Play with Dolls. Claude, Oct 30 */
let SNAP=null;const snapCache={};
function roomSnapshot(room,w=960,h=720){if(!window.THREE||!ROOM_SIZE[room])return null;
 const decor=(G('decor')||{})[room]||{},pos=(G('dreamPosition')||{})[room]||{},owned=G('owned')||[],walls=(G('walls')||{})[room]||'';const key=room+'|'+w+'x'+h+'|'+JSON.stringify([decor,pos,owned.length,walls,(G('dreamRotation')||{})[room]||0]);if(snapCache[key])return snapCache[key];
 if(!SNAP){const cv=document.createElement('canvas');const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});R.setPixelRatio(1);R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;SNAP={R};}
 const R=SNAP.R;R.setSize(w,h,false);const s=new THREE.Scene();const [W,D,H]=ROOM_SIZE[room];
 if(room==='garden')s.background=new THREE.Color(0xbfe6ff);else s.background=new THREE.Color(0xfff6fb);
 lights(s,Math.max(W,D),1024);const shell=new THREE.Group();s.add(shell);roomShell(shell,room,W,D,H);roomIdentity(shell,room,W,D,H);
 if(room!=='garden'){const L=new THREE.PointLight(0xffe2b8,.35,9,2);L.position.set(0,H-.4,.6);s.add(L);}
 const g=new THREE.Group();s.add(g);const items=fillItems(g,room,W,D,1.35);try{if(window.RK3.hydrateStorage)items.forEach(x=>window.RK3.hydrateStorage(x,room));}catch(e){}try{animateItems(items,0);}catch(e){}
 const cam=new THREE.PerspectiveCamera(40,w/h,.1,80);const vf=cam.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*cam.aspect);const dist=(Math.max((W/2-.2)/Math.tan(hf/2),(H*.5)/Math.tan(vf/2))+D*.22)*.92;const tgt=new THREE.Vector3(0,H*.3,-.35),el=.16;
 cam.position.set(0,tgt.y+Math.sin(el)*dist,tgt.z+Math.cos(el)*dist);cam.lookAt(tgt);cam.updateMatrixWorld();cam.updateProjectionMatrix();R.render(s,cam);
 const spots=items.map(it=>{const b=new THREE.Box3().setFromObject(it),c=b.getCenter(new THREE.Vector3());const f=new THREE.Vector3(c.x,b.min.y,c.z).project(cam),t=new THREE.Vector3(c.x,b.max.y,c.z).project(cam);return {id:it.userData.id,x:(f.x+1)*50,y:(1-f.y)*50,top:(1-t.y)*50,wall:!!it.userData.onWall};});
 const floorY=new THREE.Vector3(0,0,D*.25).project(cam);
 const out={url:R.domElement.toDataURL('image/jpeg',.88),spots,floor:(1-floorY.y)*50};s.traverse(o=>{if(o.geometry&&o.geometry.dispose)o.geometry.dispose();});snapCache[key]=out;return out;}
/* Grok: free GPU buffers/textures of a scene that is being replaced. Safe for shared/cached
   geometries, materials and textures: three.js re-uploads them automatically if reused later. */
function disposeScene(root){if(!root||!root.traverse)return;const seen=new Set();const tex=t=>{if(t&&t.isTexture&&!seen.has(t)){seen.add(t);t.dispose();}};
 root.traverse(o=>{if(o.geometry&&!seen.has(o.geometry)){seen.add(o.geometry);o.geometry.dispose();}
  (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!m||seen.has(m))return;seen.add(m);for(const k in m){if(m[k]&&m[k].isTexture)tex(m[k]);}m.dispose();});
  if(o.isLight&&o.shadow&&o.shadow.map){o.shadow.map.dispose();o.shadow.map=null;}});
 if(root.background&&root.background.isTexture)tex(root.background);}
/* Cozy clay render helpers (Grok, Nov 1): shared quality + light + matte-clay defaults for every 3D stage */
const RKQ=new WeakMap();
function rkQuality(R,cap){cap=cap||2;const pr=Math.min(cap,window.devicePixelRatio||1);R.setPixelRatio(pr);RKQ.set(R,{pr,min:1,last:0,ema:16,n:0});return R;}
// call once per frame before render: steps pixel ratio down on slow devices (never up, so no flicker)
function rkFrame(R){const q=RKQ.get(R);if(!q)return;const now=performance.now(),dt=q.last?now-q.last:16;q.last=now;if(dt>250)return;q.ema+=(dt-q.ema)*.05;
 if(++q.n>45&&q.ema>30&&q.pr>q.min){q.pr=Math.max(q.min,Math.round((q.pr-.25)*4)/4);R.setPixelRatio(q.pr);q.n=0;q.ema=20;}}
let CREAM=null;
function rkClayMat(m){if(!m||m.userData.rkClay)return;m.userData.rkClay=1;if(!m.isMeshStandardMaterial||m.transparent||m.opacity<1)return;
 if(m.metalness>.5||m.roughness<.25)return; // deliberate glass/metal/glaze stays shiny
 if(m.emissive&&m.emissiveIntensity>0&&(m.emissive.r+m.emissive.g+m.emissive.b)>.05)return; // glowing bits stay glowing
 m.metalness=0;m.roughness=Math.min(.92,Math.max(.8,m.roughness));
 const c=m.color;if(c&&!m.map&&c.r>.94&&c.g>.94&&c.b>.94)c.lerp(CREAM||(CREAM=new THREE.Color(0xfff2e6)),.6); // soften pure white to warm clay cream
 m.needsUpdate=true;}
function rkClay(root){root.traverse(o=>{if(o.isMesh&&!o.userData.rkc){o.userData.rkc=1;(Array.isArray(o.material)?o.material:[o.material]).forEach(rkClayMat);}});}
// warm key + cool soft fill + warm hemisphere + pink rim + cozy glow, like the reference rooms
function rkCozyLights(scene,o){o=o||{};const box=o.box||4;
 scene.add(new THREE.HemisphereLight(0xfff0e2,0xdcb4a6,.58));
 const key=new THREE.DirectionalLight(0xffe4c8,1.15);key.position.set(3,7,5);key.castShadow=true;key.shadow.mapSize.set(o.shadow||1024,o.shadow||1024);key.shadow.radius=6;key.shadow.bias=-.0008;key.shadow.normalBias=.02;const c=key.shadow.camera;c.left=-box;c.right=box;c.top=box;c.bottom=-box;c.far=30;scene.add(key);
 const fill=new THREE.DirectionalLight(0xdfe6ff,.22);fill.position.set(-5,3,4);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffc4dd,.42);rim.position.set(-4,3,-4);scene.add(rim);
 // cozy glow: opt-in (o.glow) because a point light costs every pixel on slow tablets
 let glow=null;if(o.glow){glow=new THREE.PointLight(0xffbf80,o.glow===true?.7:o.glow,10,2);glow.position.set(...(o.glowAt||[1.6,2.4,-1.4]));scene.add(glow);}
 return {key,fill,rim,glow};}
// glow halo texture shared by string lights / lamps (one tiny canvas, reused)
let RK_HALO=null;
function rkHalo(){if(RK_HALO)return RK_HALO;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,236,200,1)');g.addColorStop(.35,'rgba(255,200,150,.55)');g.addColorStop(1,'rgba(255,180,140,0)');x.fillStyle=g;x.fillRect(0,0,64,64);RK_HALO=new THREE.CanvasTexture(c);return RK_HALO;}
// cozy string lights along an arc (radius r, height y, from angle a0 for length al): unlit bulbs + additive halos, no real lights (cheap)
function rkStringLights(parent,o){o=o||{};const r=o.r||3.4,y=o.y||2.6,a0=o.a0??Math.PI*.6,al=o.al??Math.PI*.8,n=o.n||16,sag=o.sag??.14;
 const cols=o.colors||[0xffd59a,0xffb3c7,0xfff1c2,0xffc58f];const g=new THREE.Group();g.userData.glow=1;
 const pts=[];for(let i=0;i<=40;i++){const t=i/40,a=a0+al*t;pts.push(new THREE.Vector3(Math.sin(a)*r,y-Math.sin(t*Math.PI*((n>8)?3:2))**2*sag,Math.cos(a)*r));}
 g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x9a7a6a})));
 const halo=new THREE.SpriteMaterial({map:rkHalo(),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.85});
 const bulbGeo=new THREE.SphereGeometry(.045,10,8);
 for(let i=0;i<n;i++){const p=pts[Math.round((i+.5)/n*40)];const b=new THREE.Mesh(bulbGeo,new THREE.MeshBasicMaterial({color:cols[i%cols.length]}));b.position.copy(p);b.position.y-=.05;g.add(b);
  const s=new THREE.Sprite(halo);s.scale.setScalar(o.halo||.55);s.position.copy(b.position);g.add(s);}
 parent.add(g);return g;}
// soft vertical gradient for scene.background (top → bottom)
function rkGradient(top,bottom){const c=document.createElement('canvas');c.width=4;c.height=128;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,top);g.addColorStop(1,bottom);x.fillStyle=g;x.fillRect(0,0,4,128);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
window.RK3=Object.assign(window.RK3||{},{
  disposeScene,stringLights:rkStringLights,gradient:rkGradient,halo:rkHalo,quality:rkQuality,frame:rkFrame,clay:rkClay,clayMat:rkClayMat,cozyLights:rkCozyLights,
  // Read-only view state for real-browser gesture regression tests.
  roomViewState:()=>({
    room:ED.room,zoom:ED.zoom,az:ED.azT,el:ED.elT,
    dragging:!!ED.drag,
    items:ED.items.map(g=>({id:g.userData.id,x:g.position.x,z:g.position.z}))
  }),
  roomSnapshot,openStorage:storageOpen,closeStorage:storageClose,setFridgeOpen(id,on){const g=ED.items.find(x=>x.userData.id===id);if(g&&g.userData.setFridgeOpen)g.userData.setFridgeOpen(on);},B,mat,fabric,gloss,wood,metalM,RB,BX,CY,SP,CO,add,rbox,eye,legs4,loadThree,shadeHex,canvasTex,rugTex,lights,makeItem,MODEL:(window.RK3&&window.RK3.MODEL)||{}});
})();

/* Fit game screens to the phone (Claude, Oct 29): when a new question appears, scroll so the prompt
   and every choice are on screen together; if they still don't fit, shrink the 3D stage. */
(function(){
const CHOICES='.option,.bubble,.letter,.memory .tile,.match-btn,.show-cell,.st-card,.sel-tile,.sel-choice,[data-wheel-answer],[data-choice]';
const PROMPTS='.st-order,.wheel-question,.show-spotlight,.prompt,.sel-scene,.sel-3d';
const seen=new WeakSet();let timer=0;
function headerH(){const t=document.querySelector('.top');if(!t)return 0;const cs=getComputedStyle(t);return /sticky|fixed/.test(cs.position)?t.getBoundingClientRect().height:0;}
function fit(){
  const app=document.getElementById('app');if(!app)return;
  const cq=app.querySelector('.st-claw-question');if(cq&&!seen.has(cq)){seen.add(cq);const r=cq.getBoundingClientRect();if(r.bottom>innerHeight-20||r.top<0)window.scrollBy({top:r.bottom-innerHeight+24,behavior:'smooth'});return;}const ch=[...app.querySelectorAll(CHOICES)].filter(e=>e.offsetParent&&!e.closest('.comic-theater'));if(!ch.length)return;
  const pr=[...app.querySelectorAll(PROMPTS)].find(e=>e.offsetParent)||ch[0];if(seen.has(pr))return;seen.add(pr);
  const hh=headerH()+6,avail=innerHeight-hh-6;
  const span=()=>{const top=pr.getBoundingClientRect().top;const bot=Math.max(...ch.map(e=>e.getBoundingClientRect().bottom));return {top,bot,need:bot-top};};
  let m=span();
  if(m.need>avail){const st=app.querySelector('.st-stage');if(st){const h=st.getBoundingClientRect().height;const nh=Math.max(140,h-(m.need-avail));st.style.setProperty('--rk-stage-h',nh+'px');st.style.height=nh+'px';window.dispatchEvent(new Event('resize'));m=span();}}
  const target=scrollY+m.top-hh;
  if(m.top<hh||m.bot>innerHeight-4)window.scrollTo({top:Math.max(0,target),behavior:'auto'});
}
const app=document.getElementById('app');
if(app)new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(fit,120);}).observe(app,{childList:true,subtree:true});
/* after an answer, keep the "Next" button reachable without scrolling */
document.addEventListener('click',()=>{setTimeout(()=>{const n=document.querySelector('#app .st-claw-question,#app #next,#app #spinAgain,#app #comicNext:not([hidden])');if(n&&n.offsetParent){const r=n.getBoundingClientRect();if(r.bottom>innerHeight||r.top<0)n.scrollIntoView({block:'end',behavior:'smooth'});}},900);},true);
window.RikiFit=fit;
})();


