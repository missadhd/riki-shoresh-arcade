
/* Riki Real 3D: one shared Three.js engine for the room editor and the whole-house view.
   Reads and writes the game's own saved data (owned, decor, dreamPosition, roomInteriors) through the game's functions. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=code=>{try{(0,eval)(code)}catch(e){}};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const THREE_URL='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
let threeWaiters=null;
function loadThree(cb,fail){if(window.THREE)return cb();if(threeWaiters){threeWaiters.push([cb,fail]);return;}threeWaiters=[[cb,fail]];const s=document.createElement('script');s.src=THREE_URL;s.onload=()=>{const w=threeWaiters;threeWaiters=null;w.forEach(x=>x[0]());};s.onerror=()=>{const w=threeWaiters;threeWaiters=null;w.forEach(x=>x[1]&&x[1]());};document.head.appendChild(s);}

/* ================= styles ================= */
const css=`.rk3-room{position:relative;height:clamp(320px,min(64vh,118vw),580px);border-radius:26px;overflow:hidden;touch-action:none;background:linear-gradient(#f7ebe4,#efe0d6);border:3px solid #fff;box-shadow:0 18px 34px -16px #4a233866;margin:10px 0}
.rk3-room canvas{display:block;width:100%;height:100%;outline:none}
.rk3-room .riki3d-hud{position:absolute;left:10px;right:10px;top:10px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;pointer-events:none;z-index:2}
.rk3-room .riki3d-hud span{background:#ffffffde;border-radius:999px;padding:5px 12px;font-weight:800;font-size:13px;color:#4a2338;box-shadow:0 2px 8px #0001}
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
function wallFor(room){
  const owned=G('owned')||[],ri=(G('roomInteriors')||{})[room]||{},INTER=G('INTERIORS')||[];
  const w=INTER.find(t=>t[0]===ri.wall&&owned.includes(t[0]));
  if(w)return wallTex(patternKey(w),/^#[0-9a-f]{6}$/i.test(w[3])?w[3]:'#fbe3f4');
  const rooms=G('ROOMS')||[];let base=(G('wallColors')||{})[room]||(rooms.find(x=>x.id===room)||{}).wall||'#fbe3f4';if(!/^#[0-9a-f]{6}$/i.test(base))base='#fbe3f4';
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
function mat(c,rough=.75,metal=0,extra){const k=c+rough+metal+(extra?JSON.stringify(Object.keys(extra)):'');if(!extra&&matCache[k])return matCache[k];
  const m=new THREE.MeshStandardMaterial(Object.assign({color:new THREE.Color(c).convertSRGBToLinear(),roughness:rough,metalness:metal},extra||{}));if(!extra)matCache[k]=m;return m;}
const fabric=c=>mat(c,.95),gloss=c=>mat(c,.22),wood=(c='#b9824f')=>mat('#ffffff',.6,0,{map:woodGrain(c)}),metalM=(c='#d8b46a')=>mat(c,.3,.85);
const geoCache={};
function rbox(w,h,d,r){const k=[w,h,d,r].join();if(geoCache[k])return geoCache[k];r=Math.min(r,w/2-.001,h/2-.001,d/2-.001);
  const s=new THREE.Shape(),x=-w/2+r,y=-h/2+r,W=w-2*r,H=h-2*r;s.moveTo(x,y);s.lineTo(x+W,y);s.lineTo(x+W,y+H);s.lineTo(x,y+H);s.lineTo(x,y);
  const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.001,d-2*r),bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:4,curveSegments:4});g.center();g.computeVertexNormals();geoCache[k]=g;return g;}
function add(g,geo,m,x,y,z){const o=new THREE.Mesh(geo,m);o.position.set(x||0,y||0,z||0);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
const RB=(g,w,h,d,r,m,x,y,z)=>add(g,rbox(w,h,d,r),m,x,y,z);
const BX=(g,w,h,d,m,x,y,z)=>add(g,new THREE.BoxGeometry(w,h,d),m,x,y,z);
const CY=(g,rt,rb,h,m,x,y,z,seg=24)=>add(g,new THREE.CylinderGeometry(rt,rb,h,seg),m,x,y,z);
const SP=(g,r,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=add(g,new THREE.SphereGeometry(r,24,18),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
const CO=(g,r,h,m,x,y,z)=>add(g,new THREE.ConeGeometry(r,h,20),m,x,y,z);
const eye=()=>gloss('#2a1622');

/* ================= furniture models ================= */
function legs4(g,w,d,h,m,inset=.06,r=.03){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>CY(g,r,r*.75,h,m,a*(w/2-inset),h/2,b*(d/2-inset),12));}
const B={
 bed(g,c){c=c||'#f28db2';const wd=wood('#c08a5a');RB(g,1.2,.22,1.7,.04,wd,0,.25,0);legs4(g,1.2,1.7,.16,wd,.08,.04);
  RB(g,1.1,.2,1.6,.08,fabric('#fbf7f2'),0,.45,0);RB(g,1.16,.09,1.05,.04,fabric(c),0,.58,.3);RB(g,1.16,.05,.18,.03,fabric(shadeHex(c,.92)),0,.6,-.2);
  RB(g,.48,.13,.3,.06,fabric('#fffaf5'),-.27,.63,-.6);RB(g,.48,.13,.3,.06,fabric('#fffaf5'),.27,.63,-.6);
  RB(g,1.24,.95,.1,.05,wd,0,.62,-.85);RB(g,1.0,.55,.04,.04,fabric(shadeHex(c,1.05)),0,.74,-.79);},
 canopy(g,c){c=c||'#f7b2c4';B.bed(g,c);[[-.58,-.82],[.58,-.82],[-.58,.82],[.58,.82]].forEach(([x,z])=>{CY(g,.035,.035,1.75,mat('#fff4e6',.4),x,1.0,z,14);SP(g,.05,metalM(),x,1.9,z);});
  const sheer=new THREE.MeshStandardMaterial({color:new THREE.Color(c).convertSRGBToLinear(),transparent:true,opacity:.42,side:THREE.DoubleSide,roughness:.9});
  BX(g,1.2,.04,1.7,sheer,0,1.86,0);[-.6,.6].forEach(x=>{const p=add(g,new THREE.PlaneGeometry(1.7,.9),sheer,x,1.45,0);p.rotation.y=Math.PI/2;p.castShadow=false;});},
 sofa(g,c){c=c||'#8fc6e8';const f=fabric(c),f2=fabric(shadeHex(c,1.08));RB(g,1.6,.28,.72,.08,f,0,.3,0);RB(g,1.6,.55,.22,.1,f,0,.62,-.26);RB(g,.2,.42,.72,.09,f,-.8,.48,0);RB(g,.2,.42,.72,.09,f,.8,.48,0);
  [-.34,.34].forEach(x=>{RB(g,.66,.13,.58,.06,f2,x,.5,.05);RB(g,.66,.4,.14,.07,f2,x,.72,-.13);});RB(g,.3,.28,.1,.05,fabric('#ffd96b'),-.5,.7,-.02).rotation.z=.2;
  legs4(g,1.5,.6,.16,wood('#8a5a35'),.04,.025);},
 chair(g,c){c=c||'#f28db2';const wd=wood('#c08a5a');RB(g,.52,.08,.5,.03,wd,0,.46,0);RB(g,.48,.08,.46,.04,fabric(c),0,.53,0);RB(g,.5,.55,.07,.035,wd,0,.83,-.22);RB(g,.42,.36,.06,.04,fabric(c),0,.86,-.18);legs4(g,.5,.48,.44,wd,.05,.025);},
 table(g,c){const top=c?mat(c,.35):wood('#c99363');CY(g,.55,.55,.06,top,0,.66,0,40);CY(g,.52,.5,.04,wood('#a8744a'),0,.62,0,40);CY(g,.06,.08,.56,wood('#a8744a'),0,.33,0,16);CY(g,.3,.33,.05,wood('#a8744a'),0,.03,0,32);},
 dining(g,c){const w=wood('#b47c4c');RB(g,1.5,.07,.85,.025,c?mat(c,.35):w,0,.7,0);legs4(g,1.5,.85,.67,w,.08,.035);RB(g,1.3,.08,.65,.02,w,0,.62,0);},
 tea(g){B.table(g);const p=gloss('#ffffff');SP(g,.12,p,0,.82,0,1,.85,1);CY(g,.02,.03,.14,p,.14,.82,0,10).rotation.z=-.9;CY(g,.05,.06,.03,p,0,.93,0);SP(g,.02,metalM(),0,.96,0);[[.3,.15],[-.28,.2],[.05,-.32]].forEach(([x,z])=>{CY(g,.05,.04,.06,p,x,.72,z,16);CY(g,.07,.07,.008,p,x,.69,z,20);});},
 lamp(g){const m=metalM();CY(g,.2,.24,.04,m,0,.02,0,32);CY(g,.018,.018,1.25,m,0,.66,0,10);
  const shade=new THREE.Mesh(new THREE.CylinderGeometry(.17,.3,.34,32,1,true),new THREE.MeshStandardMaterial({color:new THREE.Color('#fff2cf').convertSRGBToLinear(),emissive:new THREE.Color('#ffcf7a'),emissiveIntensity:.55,side:THREE.DoubleSide,roughness:.9}));shade.position.y=1.38;g.add(shade);
  SP(g,.06,mat('#fff8e1',.2,0,{emissive:new THREE.Color('#ffe2a0'),emissiveIntensity:1}),0,1.32,0);const L=new THREE.PointLight(0xffd59a,.55,3.2,2);L.position.y=1.3;g.add(L);},
 plant(g){const pot=mat('#c96a43',.85);CY(g,.24,.17,.36,pot,0,.18,0,28);CY(g,.26,.26,.05,pot,0,.36,0,28);CY(g,.22,.22,.02,mat('#5a3a25',1),0,.375,0,24);
  const L=[mat('#4f9e5b',.7),mat('#62b56b',.7),mat('#3f8a4e',.7)];for(let i=0;i<14;i++){const a=i*2.4,r=.05+(i%3)*.06,h=.55+(i%5)*.09;const leaf=SP(g,.11,L[i%3],Math.cos(a)*r,h,Math.sin(a)*r,.45,1.1,.12);leaf.rotation.set(Math.sin(a)*.6,a,Math.cos(a)*.6);CY(g,.008,.01,h-.38,L[2],Math.cos(a)*r*.5,(h+.38)/2,Math.sin(a)*r*.5,6);}},
 shelf(g,c){const w=wood(c?c:'#a97448');RB(g,1.15,1.55,.4,.02,w,0,.78,0);BX(g,1.03,1.43,.02,mat('#7d5233',.8),0,.78,-.18);[.08,.56,1.02,1.5].forEach(y=>BX(g,1.05,.04,.36,w,0,y,0));
  const cols=['#e2457a','#7cc4f2','#ffc943','#5cc6a8','#c8a2ff','#f28db2','#8a6577'];[.1,.58,1.04].forEach((y,row)=>{let x=-.46;let i=row*3;while(x<.4){const bw=.06+rnd()*.05,bh=.28+rnd()*.12;const b=BX(g,bw,bh,.25,mat(cols[i++%cols.length],.7),x+bw/2,y+.02+bh/2,.02);if(rnd()<.15)b.rotation.z=.18;x+=bw+.008;}});},
 rug(g,id){const r=add(g,new THREE.CylinderGeometry(.9,.9,.02,48),mat('#ffffff',1,0,{map:rugTex((id||'').length)}),0,.012,0);r.castShadow=false;},
 teddy(g,c){c=c||'#b9814f';const f=fabric(c),light=fabric('#f1d9b8');SP(g,.25,f,0,.27,0,1,1.05,.9);SP(g,.12,light,0,.27,.16,1,1.1,.5);SP(g,.19,f,0,.64,.02);SP(g,.075,f,-.15,.8,0);SP(g,.075,f,.15,.8,0);SP(g,.04,light,-.15,.8,.03);SP(g,.04,light,.15,.8,.03);
  SP(g,.08,light,0,.6,.16,1,.8,.8);SP(g,.025,eye(),0,.63,.23);SP(g,.022,eye(),-.07,.69,.17);SP(g,.022,eye(),.07,.69,.17);
  [[-.22,.35],[.22,.35]].forEach(([x,y])=>SP(g,.08,f,x,y,.06,.8,1.3,.8));[[-.12,.06],[.12,.06]].forEach(([x])=>SP(g,.09,f,x,.07,.12,1,.7,1.3));BX(g,.2,.05,.03,fabric('#e2457a'),0,.47,.15);},
 unicorn(g){B.teddy(g,'#fbf6ff');const h=CO(g,.045,.26,metalM('#f2c94c'),0,.93,.1);h.rotation.x=.45;['#f7a0bd','#c8a2ff','#7fd1c0'].forEach((c,i)=>SP(g,.06,fabric(c),0,.84-i*.08,-.14+i*.02));},
 piano(g){const p=gloss('#e2457a');RB(g,1.3,.6,.52,.03,p,0,.62,0);RB(g,1.3,.12,.3,.02,p,0,.98,-.11);BX(g,1.16,.05,.22,gloss('#fffdf7'),0,.94,.17);for(let i=0;i<8;i++)BX(g,.05,.04,.12,gloss('#1e1418'),-.5+i*.14,.975,.13);
  [[-.58],[.58]].forEach(([x])=>RB(g,.08,.34,.42,.02,p,x,.17,0));RB(g,.7,.06,.32,.03,fabric('#fff1dc'),0,.46,.55);legs4(g,.66,.28,.42,wood('#8a5a35'),.04,.02);g.children.slice(-4).forEach(o=>o.position.z+=.55);},
 fridge(g){const e=mat('#f4f8fb',.28),ch=metalM('#d7dde2');RB(g,.78,1.75,.66,.06,e,0,.88,0);BX(g,.76,.012,.02,mat('#b8c4cc',.5),0,1.18,.34);RB(g,.04,.32,.05,.02,ch,-.3,1.42,.36);RB(g,.04,.48,.05,.02,ch,-.3,.82,.36);SP(g,.04,gloss('#ffc943'),.15,1.5,.34);SP(g,.04,gloss('#e2457a'),.2,.75,.34);BX(g,.14,.1,.01,mat('#ffffff',.9),.12,1.35,.335);},
 stove(g){const w=mat('#fbfaf7',.35);RB(g,.85,.86,.64,.03,w,0,.43,0);BX(g,.83,.02,.6,gloss('#1d1a1d'),0,.87,0);[[-.2,-.13],[.2,-.13],[-.2,.15],[.2,.15]].forEach(([x,z])=>{const r=add(g,new THREE.TorusGeometry(.08,.012,8,24),metalM('#8f8f8f'),x,.885,z);r.rotation.x=Math.PI/2;});
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
function makeItem(it){
  const MD=window.RK3&&window.RK3.MODEL&&window.RK3.MODEL[it[0]];if(MD){const g=new THREE.Group();MD(g,it);g.userData.onWall=!!MD.wall;return g;}
  const g=new THREE.Group(),p=pick(it[0],it[2]),wall=ON_WALL.test((it[0]+' '+it[2]).toLowerCase())&&!p;
  if(p&&B[p[0]])B[p[0]](g,p[1]);else emojiCard(g,it[1],wall);
  g.userData.onWall=wall;return g;
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
}
function roomShell(g,id,W,D,H,opts={}){
  if(id==='garden'){
    const lawn=add(g,new THREE.BoxGeometry(W+2,.1,D+1.5),mat('#ffffff',.95,0,{map:grassTex()}),0,-.05,.3);lawn.castShadow=false;
    const fence=wood('#fbf4ea');for(let i=0;i<=Math.round(W*2.2);i++){const x=-W/2-.5+i*(W+1)/Math.round(W*2.2);RB(g,.1,.7,.06,.02,fence,x,.35,-D/2);CO(g,.06,.1,fence,x,.75,-D/2);}
    [.25,.55].forEach(y=>BX(g,W+1,.06,.04,fence,0,y,-D/2+.04));
    for(let i=0;i<5;i++){const s=add(g,new THREE.CylinderGeometry(.22,.24,.04,10),mat('#ffffff',.9,0,{map:stoneTex()}),(i-2)*.28,.01,D/2-.2-i*.55);s.castShadow=false;}
    [[-W/2,-D/2+.3],[W/2,-D/2+.3]].forEach(([x,z])=>{[0,.3,-.3].forEach((dx,i)=>add(g,new THREE.IcosahedronGeometry(.32-i*.05,1),mat(['#4f9e5b','#5fb06a','#3e8a4c'][i],.9),x+dx,.25,z));});
    return;
  }
  const fl=woodFloor().clone();fl.needsUpdate=true;fl.repeat.set(W/2.2,D/2.2);
  const floor=add(g,new THREE.BoxGeometry(W,.12,D),mat('#ffffff',.55,0,{map:fl}),0,-.06,0);floor.castShadow=false;
  const wt=wallFor(id).clone();wt.needsUpdate=true;wt.repeat.set(W/2,H/2);const wtS=wallFor(id).clone();wtS.needsUpdate=true;wtS.repeat.set(D/2,H/2);
  const wm=mat('#ffffff',.92,0,{map:wt}),wms=mat('#ffffff',.92,0,{map:wtS});
  const back=add(g,new THREE.BoxGeometry(W,H,.12),wm,0,H/2,-D/2-.06);back.castShadow=false;
  if(!opts.noSides){const L=add(g,new THREE.BoxGeometry(.12,H,D),wms,-W/2-.06,H/2,0);const R=add(g,new THREE.BoxGeometry(.12,H,D),wms,W/2+.06,H/2,0);L.castShadow=R.castShadow=false;}
  const trim=mat('#fffaf4',.5);
  BX(g,W,.16,.04,trim,0,.08,-D/2+.02);BX(g,W,.08,.08,trim,0,H-.04,-D/2+.04);BX(g,W,.04,.03,trim,0,1.0,-D/2+.015);
  if(!opts.noSides)[-1,1].forEach(s=>{BX(g,.04,.16,D,trim,s*(W/2-.02),.08,0);BX(g,.08,.08,D,trim,s*(W/2-.04),H-.04,0);});
  const wins=opts.windows||(W>5.5?[-W/4,W/4]:[0]);wins.forEach(x=>windowOn(g,x,H*.56,-D/2+.01,0,id));
  if(!opts.noSides&&W>=5.5)windowOn(g,W/2-.01,H*.56,0,-Math.PI/2,id);
}
function pctToLocal(p,W,D){const fx=(cl(+p.x||50,8,92)-8)/84,fz=(cl(+p.y||70,26,86)-26)/60;return [(fx-.5)*(W-1.3),-(D-1.3)/2+fz*(D-1.3)];}
function localToPct(X,Z,W,D){return {x:8+((X/(W-1.3))+.5)*84,y:26+((Z+(D-1.3)/2)/(D-1.3))*60};}
function fillItems(group,room,W,D,S){
  while(group.children.length)group.remove(group.children[0]);
  const owned=G('owned')||[],ITEMS=G('ITEMS')||[],decor=G('decor')||{},pos=G('dreamPosition')||{},SL=G('SLOTS')||[];
  const placements=decor[room]||{},positions=pos[room]||{};const out=[];
  Object.entries(placements).forEach(([slot,id])=>{
    if(!owned.includes(id))return;const it=ITEMS.find(x=>x[0]===id);if(!it)return;
    const p=positions[id]||SL[Number(slot)]||{x:45,y:72};const [X,Z]=pctToLocal(p,W,D);
    const g=makeItem(it);g.scale.setScalar(S);g.userData.id=id;
    if(g.userData.onWall){g.position.set(X,1.55,-D/2+.06);}else{g.position.set(X,0,Z);if(room!=='garden')g.rotation.y=X<-(W/3)?.45:X>W/3?-.45:0;}
    g.userData.base=g.position.y;g.userData.phase=rnd()*6;group.add(g);out.push(g);
  });
  return out;
}
function lights(scene,size,shadowMap){
  scene.add(new THREE.HemisphereLight(0xfff4ea,0xc9a27e,.55));scene.add(new THREE.AmbientLight(0xffffff,.12));
  const sun=new THREE.DirectionalLight(0xfff1dd,1.05);sun.position.set(-size*.6,size*1.3,size*1.1);sun.castShadow=true;sun.shadow.mapSize.set(shadowMap,shadowMap);
  const c=sun.shadow.camera;c.left=-size;c.right=size;c.top=size;c.bottom=-size;c.near=.5;c.far=size*5;sun.shadow.bias=-.0006;sun.shadow.normalBias=.02;sun.shadow.radius=4;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xe6efff,.25);fill.position.set(size,size*.6,size);scene.add(fill);
}
function makeRenderer(){const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(1.75,window.devicePixelRatio||1));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;return R;}
function animateItems(list,t){list.forEach(g=>{
  if(g.userData.bob){g.userData.bob.position.y=Math.sin(t*1.6+g.userData.phase)*.15;g.userData.bob.children.forEach((w,i)=>{const s=.35+Math.abs(Math.sin(t*9+i));w.userData.flap[0].scale.x=s;w.userData.flap[1].scale.x=s;});}
  if(g.userData.pet)g.position.y=g.userData.base+Math.abs(Math.sin(t*2.2+g.userData.phase))*.04;
  if(g.userData.fish)g.userData.fish.position.x=Math.sin(t*1.5)*.12;});}

/* ================= ROOM EDITOR ================= */
const ROOM_SIZE={bedroom:[6.4,4.6,3.2],living:[6.4,4.6,3.2],kitchen:[6.4,4.6,3.2],garden:[7.4,5.2,3]};
const ED={R:null,scene:null,cam:null,items:[],group:null,room:null,W:6,D:4.5,az:0,el:.5,azT:0,elT:.5,zoom:1,sel:null,ring:null,ro:null,looping:false,ray:null,drag:null};
try{ED.az=ED.azT=cl(Number(localStorage.getItem('rikiReal3dAz')||0),-.9,.9);}catch(e){}
let lastPtr=null;['pointermove','pointerdown','pointerup'].forEach(t=>document.addEventListener(t,e=>{lastPtr={x:e.clientX,y:e.clientY};},true));
function msg(t){const m=document.getElementById('dreamMessage');if(m)m.textContent=t;}
function edBuild(room){
  const s=new THREE.Scene();ED.scene=s;ED.room=room;const [W,D,H]=ROOM_SIZE[room]||ROOM_SIZE.bedroom;ED.W=W;ED.D=D;ED.H=H;
  if(room==='garden'){s.background=null;}
  lights(s,Math.max(W,D),1024);
  const shell=new THREE.Group();s.add(shell);roomShell(shell,room,W,D,H);
  if(room!=='garden'){const L=new THREE.PointLight(0xffe2b8,.35,9,2);L.position.set(0,H-.4,.6);s.add(L);}
  ED.group=new THREE.Group();s.add(ED.group);ED.items=fillItems(ED.group,room,W,D,1.35);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.62,.72,48),new THREE.MeshBasicMaterial({color:0xe2457a,transparent:true,opacity:.85,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.02;ring.visible=false;s.add(ring);ED.ring=ring;
  ED.floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  const selId=ED.sel;ED.sel=null;if(selId)edSelect(selId,true);
}
function edCamera(){
  const c=ED.R.domElement,w=c.clientWidth||1,h=c.clientHeight||1;ED.cam.aspect=w/h;ED.cam.fov=42;
  const vf=ED.cam.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*ED.cam.aspect);
  const need=Math.max((ED.W/2+.15)/Math.tan(hf/2),(ED.H*.62)/Math.tan(vf/2));const dist=need*ED.zoom+ED.D*.35;
  const tgt=new THREE.Vector3(0,ED.H*.3,-.3);
  ED.cam.position.set(tgt.x+Math.sin(ED.az)*Math.cos(ED.el)*dist,tgt.y+Math.sin(ED.el)*dist,tgt.z+Math.cos(ED.az)*Math.cos(ED.el)*dist);ED.cam.lookAt(tgt);ED.cam.updateProjectionMatrix();
}
function edResize(){if(!ED.R)return;const c=ED.R.domElement.parentElement;if(!c)return;const w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;ED.R.setSize(w,h,false);}
function edLoop(){
  if(!ED.R||!ED.R.domElement.isConnected){ED.looping=false;return;}
  requestAnimationFrame(edLoop);
  ED.az+=(ED.azT-ED.az)*.12;ED.el+=(ED.elT-ED.el)*.12;edCamera();
  const t=performance.now()/1000;animateItems(ED.items,t);
  if(ED.ring.visible){ED.ring.material.opacity=.55+Math.sin(t*4)*.3;const g=ED.items.find(x=>x.userData.id===ED.sel);if(g&&!g.userData.onWall)ED.ring.position.set(g.position.x,.02,g.position.z);}
  ED.R.render(ED.scene,ED.cam);
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
  if(!quiet&&g){const it=(G('ITEMS')||[]).find(t=>t[0]===id);const isSt=G('isStorage');const store=typeof isSt==='function'&&isSt(id);
    msg('Selected '+(it?it[2]:'furniture')+'. Drag it to move it'+(store?', or tap Open selected storage.':', or tap Remove to put it away.'));}
}
function place(id,X,Z){const p=localToPct(X,Z,ED.W,ED.D);ED.internal=true;try{ORIG_PLACE(id,p.x,p.y);}finally{ED.internal=false;}}
function edPointers(cv){
  cv.addEventListener('pointerdown',e=>{const pt={x:e.clientX,y:e.clientY};const it=hitItem(pt);ED.drag={sx:e.clientX,sy:e.clientY,lx:e.clientX,ly:e.clientY,item:it,moved:false,id:e.pointerId};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener('pointermove',e=>{const d=ED.drag;if(!d||d.id!==e.pointerId)return;if(!d.moved&&Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>8){d.moved=true;if(d.item){edSelect(d.item.userData.id,true);}}
    if(!d.moved)return;
    if(d.item&&!d.item.userData.onWall){const v=hitFloor({x:e.clientX,y:e.clientY});if(v){d.item.position.x=v.x;d.item.position.z=v.z;}}
    else if(d.item&&d.item.userData.onWall){const v=hitFloor({x:e.clientX,y:e.clientY});if(v)d.item.position.x=v.x;}
    else{ED.azT=cl(ED.azT-(e.clientX-d.lx)*.006,-.9,.9);ED.elT=cl(ED.elT+(e.clientY-d.ly)*.004,.12,.9);ED.az=ED.azT;ED.el=ED.elT;}
    d.lx=e.clientX;d.ly=e.clientY;});
  const up=e=>{const d=ED.drag;if(!d||d.id!==e.pointerId)return;ED.drag=null;
    if(d.item&&d.moved){const g=d.item;place(g.userData.id,g.position.x,g.userData.onWall?ED.D/2:g.position.z);return;}
    if(d.item&&!d.moved){edSelect(d.item.userData.id);try{const a=G('audio');a&&a('tap');}catch(_){}return;}
    if(!d.moved){const sel=G('selectedItem');const owned=G('owned')||[];
      if(sel&&owned.includes(sel)){const v=hitFloor({x:e.clientX,y:e.clientY});if(v){place(sel,v.x,v.z);return;}}
      ED.sel=null;ED.ring.visible=false;return;}
    try{localStorage.setItem('rikiReal3dAz',ED.azT);}catch(_){}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{ED.drag=null;});
  cv.addEventListener('wheel',e=>{e.preventDefault();ED.zoom=cl(ED.zoom+e.deltaY*.001,.55,1.4);},{passive:false});
}
function edMount(){
  const box=document.getElementById('dreamRoom');if(!box||!box.classList.contains('rk3-room'))return;
  const room=G('currentRoom')||'bedroom';
  loadThree(()=>{
    try{
      if(!ED.R){ED.R=makeRenderer();ED.cam=new THREE.PerspectiveCamera(42,1,.1,100);ED.ray=new THREE.Raycaster();edPointers(ED.R.domElement);}
      const ld=box.querySelector('.rk3-load');if(ld)ld.remove();
      box.prepend(ED.R.domElement);
      edBuild(room);
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
    return ORIG_PLACE.call(this,id,x,y);
  };
}
const NICE={bedroom:'Princess bedroom',living:'Cozy living room',kitchen:'Sunny kitchen',garden:'Garden terrace'};
const prevHtml=G('decorateHtml'),prevBind=G('bindDecor');
if(typeof prevHtml==='function'&&typeof prevBind==='function'){
  const newHtml=function(){let h=prevHtml.apply(this,arguments);const room=G('currentRoom')||'bedroom';
    h=h.replace(/<div class="dream-room dream3d" id="dreamRoom">\s*<canvas[^>]*><\/canvas>/,`<div class="rk3-room ${room}" id="dreamRoom"><div class="rk3-load">Building your room…</div>`);
    h=h.replace(/<div class="riki3d-hud">[\s\S]*?<\/div>/,`<div class="riki3d-hud"><span>🏡 ${NICE[room]||'Dream room'}</span><span>Drag to look around</span></div>`);
    h=h.replace(/<p class="riki3d-legend">[\s\S]*?<\/p>/,'<p class="riki3d-legend">Tap something you bought below, then tap the floor to place it. Drag furniture to move it. Drag the empty room to look around.</p>');
    h=h.replace(/<p class="riki3d-legend">[\s\S]*?<\/p>/,`<p class="riki3d-legend">Tap an owned item below, then tap the floor to place it. Tap furniture to select it and drag to move. Drag empty space to look around.</p><div class="rk3-selection-tools" style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:10px 0"><strong id="rk3SelectedStatus" role="status" aria-live="polite">✨ Tap furniture to select it, or choose an owned item below</strong><button type="button" class="smallbtn" id="rk3ClearSelection" hidden>✕ Deselect</button></div>`);
    return h;};
  const newBind=function(){prevBind.apply(this,arguments);const box=document.getElementById('dreamRoom');if(!box||!box.classList.contains('rk3-room'))return;
    box.onclick=null;
    const $=id=>document.getElementById(id);
    if($('rk3ClearSelection'))$('rk3ClearSelection').onclick=()=>{edSelect(null,true);msg('Selection cleared. Choose an item below to decorate.');};
    if($('orbitLeft'))$('orbitLeft').onclick=()=>{ED.azT=cl(ED.azT-.3,-.9,.9);};
    if($('orbitRight'))$('orbitRight').onclick=()=>{ED.azT=cl(ED.azT+.3,-.9,.9);};
    if($('orbitReset'))$('orbitReset').onclick=()=>{ED.azT=0;ED.elT=.5;ED.zoom=1;};
    if($('openSelected'))$('openSelected').onclick=()=>{const id=ED.sel||G('selectedItem');const isSt=G('isStorage'),sm=G('storageModal');if(id&&typeof isSt==='function'&&isSt(id)&&typeof sm==='function')sm(id);else msg('Tap a shelf, vanity or dresser in the room first, then tap Open.');};
    edMount();};
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
  const s=new THREE.Scene();H.scene=s;lights(s,9,1536);H.items=[];
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
  if(H.garden)H.garden.visible=(H.focus==='all'||H.focus==='garden');animateItems(H.items,performance.now()/1000);H.R.render(H.scene,H.cam);}
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
window.RK3=Object.assign(window.RK3||{},{B,mat,fabric,gloss,wood,metalM,RB,BX,CY,SP,CO,add,rbox,eye,legs4,loadThree,shadeHex,canvasTex,rugTex,lights,makeItem,MODEL:(window.RK3&&window.RK3.MODEL)||{}});
})();
