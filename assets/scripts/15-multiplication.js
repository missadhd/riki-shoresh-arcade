/* Separate multiplication games. Keeps existing Shoresh and social activities untouched. */
(()=>{
'use strict';
const app=document.getElementById('app'),nav=document.querySelector('.top .stats'),KEY='rikiMathProgressV1';
if(!app||!nav||window.RikiMath)return;
const $=id=>document.getElementById(id);
const G=n=>{try{return (0,eval)(n)}catch(_){return undefined}};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const defaults={families:[3,4,6,7,8],correct:0,attempts:0,byFact:{},completed:{recipe:0,array:0,match:0,aquarium:0,fashion:0}};
let progress;try{progress={...defaults,...JSON.parse(localStorage.getItem(KEY)||'null')}}catch(_){progress={...defaults}};
if(!Array.isArray(progress.families)||!progress.families.length)progress.families=[3,4,6,7,8];
progress.families=progress.families.filter(n=>Number.isInteger(n)&&n>=2&&n<=9);
if(!progress.families.length)progress.families=[3,4,6,7,8];
if(!progress.byFact||typeof progress.byFact!=='object')progress.byFact={};
if(!progress.completed||typeof progress.completed!=='object')progress.completed={...defaults.completed};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress))}catch(_){}};
const sound=k=>{try{G('audio')?.(k||'tap')}catch(_){}};
const facts=()=>progress.families.flatMap(a=>[2,3,4,5,6,7,8,9].map(b=>({a,b,answer:a*b,key:a+'×'+b})));
function pick(count){
 const all=facts(),weak=all.filter(f=>(progress.byFact[f.key]?.wrong||0)>(progress.byFact[f.key]?.right||0));
 const seen=new Set(),out=[];
 for(const f of shuffle(weak).concat(shuffle(all))){if(seen.has(f.key))continue;seen.add(f.key);out.push(f);if(out.length>=count)break}return out;
}
function give(f){
 const row=progress.byFact[f.key]||{right:0,wrong:0};row.right++;progress.byFact[f.key]=row;
 progress.correct++;progress.attempts++;save();
 const a=G('award');if(typeof a==='function')a(6);
 sound('good');
}
function wrong(f){
 const row=progress.byFact[f.key]||{right:0,wrong:0};row.wrong++;progress.byFact[f.key]=row;progress.attempts++;save();sound('bad');
}
function goHouse(){const fn=G('houseHome');if(typeof fn==='function')fn();window.scrollTo(0,0)}
function goHub(){const fn=window.RikiHub;if(typeof fn==='function')fn();window.scrollTo(0,0)}
function activeTab(){
 const yes=!!app.querySelector('.rk-math');
 const btn=$('rkMathShortcut');if(btn){btn.classList.toggle('rk-math-active',yes);btn.setAttribute('aria-current',yes?'page':'false')}
}
function show(body){
 const wasMath=!!app.querySelector('.rk-math'),scroll=window.scrollY;
 app.innerHTML='<div class="rk-math" data-rk-section="multiplication">'+body+'</div>';
 if(!wasMath)window.scrollTo(0,0);else if(window.scrollY!==scroll)window.scrollTo(0,scroll);
 activeTab();
}
function header(title,subtitle){
 return '<header class="rk-math-heading"><button type="button" id="rkMathBack" class="rk-math-link">← Math games</button><h1>'+esc(title)+'</h1><p>'+esc(subtitle||'Take your time. There is no countdown.')+'</p></header>';
}

/* Clay diorama scenes for the math arcade (Grok, Nov 1): soft isometric cutaway rooms in the
   style Rachel shared — pastel clay, warm window glow, string lights. Static renders (drawn only
   on resize or after an answer), one shared renderer, so they cost almost nothing per frame. */
const DIO={R:null,cam:null,scene:null,kind:null,host:null,ro:null,board:null,bounce:0,raf:0};
const LC=c=>new window.THREE.Color(c).convertSRGBToLinear();
const RM=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function rbox(w,h,d,r,col,o){const T=window.THREE;r=Math.min(r,w/2-.001,d/2-.001);const b=Math.max(.002,Math.min(r*.8,h*.45)),bs=b*.9;
 // the bevel grows the outline by bs, so draw the shape that much smaller to keep the real size w × d
 const W0=w-2*bs,D0=d-2*bs,rr=Math.max(.001,Math.min(r-bs,W0/2-.001,D0/2-.001)),s=new T.Shape(),x=-W0/2+rr,z=-D0/2+rr,W=W0-2*rr,D=D0-2*rr;
 s.moveTo(x,-D0/2);s.lineTo(x+W,-D0/2);s.quadraticCurveTo(W0/2,-D0/2,W0/2,z);s.lineTo(W0/2,z+D);s.quadraticCurveTo(W0/2,D0/2,x+W,D0/2);s.lineTo(x,D0/2);s.quadraticCurveTo(-W0/2,D0/2,-W0/2,z+D);s.lineTo(-W0/2,z);s.quadraticCurveTo(-W0/2,-D0/2,x,-D0/2);
 const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,h-2*b),bevelEnabled:true,bevelSize:bs,bevelThickness:b,bevelSegments:3,curveSegments:6});g.rotateX(Math.PI/2);g.translate(0,h-b,0);
 const m=new T.Mesh(g,new T.MeshStandardMaterial(Object.assign({color:LC(col),roughness:.88},o||{})));m.castShadow=m.receiveShadow=true;return m;}
function ball(r,col,o){const T=window.THREE;const m=new T.Mesh(new T.SphereGeometry(r,20,14),new T.MeshStandardMaterial(Object.assign({color:LC(col),roughness:.9},o||{})));m.castShadow=m.receiveShadow=true;return m;}
function cyl(rt,rb,h,col,o){const T=window.THREE;const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,24),new T.MeshStandardMaterial(Object.assign({color:LC(col),roughness:.88},o||{})));m.castShadow=m.receiveShadow=true;return m;}
const at=(m,x,y,z,ry)=>{m.position.set(x,y,z);if(ry)m.rotation.y=ry;return m;};
function plant(g,x,z,s,pot){pot=pot||0xf6efe4;const p=at(cyl(.2*s,.16*s,.28*s,pot),x,.14*s,z);g.add(p);[[0,.42,0,.2],[.12,.36,.06,.15],[-.12,.38,-.04,.16],[.04,.5,-.1,.14]].forEach(([a,b,c,r])=>g.add(at(ball(r*s,0x8fc79a),x+a*s,b*s,z+c*s)));}
function room(g,o){const T=window.THREE,K=window.RK3;
 g.add(at(rbox(4.4,.36,4.4,.16,o.base||0xe9c8b0),0,-.36,0));                         // chunky clay base
 for(let i=0;i<8;i++)g.add(at(rbox(.52,.04,4.2,.04,i%2?0xf1d6bf:0xecceb4),-1.83+i*.523,0,0));   // floor planks
 g.add(at(rbox(4.4,3,.3,.12,o.wall||0xf3c6c0),0,0,-2.05));g.add(at(rbox(.3,3,4.1,.12,o.wall2||0xf6d5cc),-2.05,0,.15));
 g.add(at(rbox(4.4,.16,.36,.06,0xd9b49a),0,2.9,-2.05));g.add(at(rbox(.36,.16,4.1,.06,0xd9b49a),-2.05,2.9,.15));
 // sunny window with warm glow
 const win=new T.Group();win.add(at(rbox(1.3,1.1,.12,.05,0xfff8ef),0,0,0));const pane=new T.Mesh(new T.PlaneGeometry(1.05,.86),new T.MeshBasicMaterial({color:0xffe7b0}));pane.position.set(0,.55,.07);win.add(pane);
 win.add(at(rbox(.06,.9,.06,.02,0xfff8ef),0,.1,.1));win.add(at(rbox(1.08,.06,.06,.02,0xfff8ef),0,.52,.1));win.position.set(.9,1.25,-1.84);g.add(win);
 const sun=new T.Sprite(new T.SpriteMaterial({map:K.halo(),blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:.22}));sun.scale.set(2,1.8,1);sun.position.set(.9,1.8,-1.6);g.add(sun);
 // rug
 const rug=new T.Mesh(new T.CircleGeometry(1.15,40),new T.MeshStandardMaterial({color:LC(o.rug||0xf7c9d4),roughness:.95}));rug.rotation.x=-Math.PI/2;rug.position.set(.35,.05,.45);rug.receiveShadow=true;g.add(rug);
 // string lights hugging the corner (straight runs: a small arc with huge radius is close enough)
 const L=new T.Group();g.add(L);const cols=[0xffd59a,0xfff1c2,0xffc58f];
 const run=(a,b,n)=>{const pts=[];for(let i=0;i<=n;i++){const t=i/n;pts.push(new T.Vector3(a[0]+(b[0]-a[0])*t,a[1]-Math.sin(t*Math.PI*3)**2*.18,a[2]+(b[2]-a[2])*t));}
  L.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x9a7a6a})));
  const hm=new T.SpriteMaterial({map:K.halo(),blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:.5,depthTest:false});
  pts.forEach((p,i)=>{if(!i)return;const bl=new T.Mesh(new T.SphereGeometry(.055,10,8),new T.MeshBasicMaterial({color:cols[i%3]}));bl.position.copy(p);bl.position.y-=.06;L.add(bl);const s=new T.Sprite(hm);s.scale.setScalar(.3);s.position.copy(bl.position);L.add(s);});};
 run([-1.72,2.55,-1.72],[2.0,2.55,-1.72],11);run([-1.72,2.55,-1.72],[-1.72,2.55,2.0],10);}
function lamp(g,x,y,z){const T=window.THREE,K=window.RK3;g.add(at(cyl(.05,.05,.38,0xf3e2c8),x,y+.19,z));g.add(at(cyl(.08,.14,.05,0xe8c9a8),x,y+.02,z));
 g.add(at(cyl(.14,.26,.26,0xffeacb,{emissive:0xffc98a,emissiveIntensity:.45}),x,y+.48,z));const h=new T.Sprite(new T.SpriteMaterial({map:K.halo(),blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:.35}));h.scale.setScalar(.6);h.position.set(x,y+.42,z);g.add(h);}
function boardTex(text){const T=window.THREE;const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');x.fillStyle='#7fae9a';x.fillRect(0,0,256,160);
 x.fillStyle='#fffaf0';x.font='800 64px Nunito, system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,128,84);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
const BUILD={
 study(g,o){room(g,{wall:0xf3c6c0,wall2:0xf6d5cc,rug:0xf8cdd8});
  // desk with chalkboard, books, lamp
  g.add(at(rbox(1.7,.12,.8,.06,0xf2d3b3),-.6,.8,-1.35));[-1.3,.1].forEach(x=>[-1.62,-1.08].forEach(z=>g.add(at(rbox(.12,.8,.12,.05,0xe8c3a0),x,0,z))));
  const bd=new window.THREE.Mesh(new window.THREE.PlaneGeometry(1.2,.75),new window.THREE.MeshStandardMaterial({map:boardTex(o.text||'× ='),roughness:.95}));bd.position.set(-.6,1.75,-1.82);g.add(bd);DIO.board=bd;
  g.add(at(rbox(1.36,.9,.08,.06,0xe2b995),-.6,1.3,-1.89));
  [[0xb7d8f0,.18],[0xf6b6c8,.16],[0xd9c8f2,.17],[0xfbe3a6,.15]].forEach(([c,w],i)=>g.add(at(rbox(w,.5,.4,.04,c),-1.35+i*.19,.92,-1.4)));
  lamp(g,-.05,.92,-1.5);g.add(at(rbox(.5,.06,.36,.05,0xfffaf0),-.65,.92,-1.25,.15));
  const bb=at(ball(.5,0xf7b9c8),-1.15,.32,.75);bb.scale.set(1,.7,1);g.add(bb);           // beanbag
  plant(g,1.55,-1.4,1.3);plant(g,-1.6,1.5,1.1,0xf9d7e0);
  g.add(at(rbox(.7,.14,.5,.06,0xfff2df),.45,.06,.55,.3));g.add(at(rbox(.55,.12,.4,.05,0xd8e8f6),.45,.2,.55,-.2));},     // floor books
 cards(g){room(g,{wall:0xe9cde6,wall2:0xf1dcec,rug:0xd8ecdf,base:0xe6c6b6});
  g.add(at(cyl(.85,.85,.1,0xf2d3b3),.3,.62,.2));g.add(at(cyl(.08,.12,.6,0xe8c3a0),.3,.3,.2));g.add(at(cyl(.35,.4,.05,0xe8c3a0),.3,.03,.2));
  const cc=[0xf6b6c8,0xb7d8f0,0xfbe3a6,0xd9c8f2,0xbfe3c7,0xffd0b0];for(let i=0;i<6;i++){const a=i/6*Math.PI*2;g.add(at(rbox(.3,.04,.42,.05,cc[i]),.3+Math.cos(a)*.5,.68,.2+Math.sin(a)*.5,a+.4));}
  // armchair with throw
  const ch=new window.THREE.Group();ch.add(at(rbox(1,.42,.9,.18,0xf7c3cf),0,.1,0));ch.add(at(rbox(1,.7,.24,.12,0xf7c3cf),0,.4,-.36));[-.44,.44].forEach(x=>ch.add(at(rbox(.2,.42,.9,.1,0xf4b6c4),x,.36,0)));ch.add(at(rbox(.5,.06,.7,.04,0xfff3dd),.15,.54,.05,.2));
  ch.position.set(-1.3,0,-1.2);ch.rotation.y=.5;g.add(ch);g.add(at(rbox(.5,.7,.5,.08,0xf2d3b3),1.5,0,-1.5));lamp(g,1.5,.7,-1.5);plant(g,-1.5,1.5,1.2);plant(g,1.55,1.3,1,0xdbeafc);
  },
 arcade(g){room(g,{wall:0xf6cdb8,wall2:0xf8dccb,rug:0xf8d4c4});
  // counter with clay cupcakes, fish bowl and a bow — the five math games in one cozy shop
  g.add(at(rbox(2.2,.8,.7,.12,0xf7c3cf),-.2,0,-1.3));g.add(at(rbox(2.4,.1,.85,.06,0xfff3e6),-.2,.8,-1.3));
  [[-1,0xf6b6c8],[-.55,0xb7d8f0],[-.1,0xfbe3a6]].forEach(([x,c])=>{g.add(at(cyl(.16,.12,.18,c),x,.99,-1.3));g.add(at(ball(.17,0xfff6f0),x,1.12,-1.3));g.add(at(ball(.05,0xe6627a),x,1.3,-1.3));});
  const bowl=at(ball(.3,0xcfeaf6,{transparent:true,opacity:.55,roughness:.2}),.55,1.15,-1.3);g.add(bowl);g.add(at(ball(.09,0xffa86b),.55,1.12,-1.3));
  g.add(at(rbox(.55,.6,.55,.08,0xf2d3b3),1.5,0,-1.6));lamp(g,1.5,.6,-1.6);plant(g,-1.55,1.5,1.2);plant(g,1.5,1.3,1.1,0xf9d7e0);
  g.add(at(ball(.5,0xd9c8f2),-.9,.3,.6));}
};
function dioRender(){const D=DIO;if(!D.R||!D.host||!D.scene)return;const K=window.RK3;const w=D.host.clientWidth,h=D.host.clientHeight;if(!w||!h)return;
 if(D.R.domElement.parentNode!==D.host)D.host.prepend(D.R.domElement);D.R.setSize(w,h,false);D.cam.aspect=w/h;
 const narrow=w/h<1.6;D.cam.fov=narrow?32:22;D.cam.position.set(8,6.4,8);D.cam.lookAt(-.1,1.05,-.1);D.cam.updateProjectionMatrix();
 if(K.frame)K.frame(D.R);D.R.render(D.scene,D.cam);}
function dioBounce(){if(RM()||!DIO.scene)return;const g=DIO.scene.userData.hero;if(!g)return;const t0=performance.now();cancelAnimationFrame(DIO.raf);
 const step=()=>{const t=(performance.now()-t0)/700;if(t>=1||!DIO.scene){if(DIO.scene){g.scale.setScalar(1);dioRender();}return;}g.scale.setScalar(1+Math.sin(t*Math.PI)*.05);dioRender();DIO.raf=requestAnimationFrame(step);};step();}
function dioBoard(text){if(DIO.board&&DIO.kind==='study'){const m=DIO.board.material;if(m.map)m.map.dispose();m.map=boardTex(text);m.needsUpdate=true;dioRender();}}
// Mount (or reuse) a clay diorama inside host. Without WebGL the host keeps its 2D emoji fallback.
function diorama(host,kind,o){if(!host)return;const K=window.RK3;if(!K||!K.loadThree)return;
 K.loadThree(()=>{try{if(!document.body.contains(host))return;const T=window.THREE,D=DIO;
  if(!D.R){D.R=new T.WebGLRenderer({antialias:true,alpha:true});K.quality(D.R,1.75);D.R.outputEncoding=T.sRGBEncoding;D.R.toneMapping=T.ACESFilmicToneMapping;D.R.toneMappingExposure=.82;D.R.shadowMap.enabled=true;D.R.shadowMap.type=T.PCFSoftShadowMap;
   D.R.domElement.className='rk-math-dio-canvas';D.R.domElement.setAttribute('aria-hidden','true');D.cam=new T.PerspectiveCamera(30,1,.1,60);}
  if(D.kind!==kind||!D.scene){if(D.scene&&K.disposeScene)K.disposeScene(D.scene);const s=new T.Scene();K.cozyLights(s,{box:3.4,shadow:1024,glow:.9,glowAt:[.6,2.2,.2]});
   const g=new T.Group();s.add(g);D.board=null;BUILD[kind](g,o||{});K.clay(s);s.userData.hero=g;D.scene=s;D.kind=kind;}
  D.host=host;host.classList.add('rk-math-dio-on');if(o&&o.text)dioBoard(o.text);
  if(!D.ro&&window.ResizeObserver){D.ro=new ResizeObserver(()=>dioRender());}if(D.ro){D.ro.disconnect();D.ro.observe(host);}dioRender();
 }catch(e){console.warn('math diorama',e);}},()=>{});}

function startHome(){
 active=null;
 let buttons='';for(let n=2;n<=9;n++)buttons+='<button type="button" data-family="'+n+'" class="'+(progress.families.includes(n)?'on':'')+'" aria-pressed="'+progress.families.includes(n)+'">×'+n+'</button>';
 show('<section class="rk-math-hero"><div class="rk-math-dio rk-math-dio-hero rk-clay-art" id="rkMathDio"><img src="assets/images/clay-sample/math-home.webp" width="960" height="720" alt="" aria-hidden="true" decoding="async"></div><h1>🍰 Multiplication Arcade</h1><p>Think of the product first — then serve the customer!</p><div>⭐ '+(Number(progress.correct)||0)+' answers correct</div></section>'+
 '<section class="rk-math-panel"><h2>Choose the tables to practice</h2><div class="rk-math-families">'+buttons+'</div><p id="rkMathFamilyMessage" role="status">Tap to include or exclude a table. Keep at least one selected.</p></section>'+
 '<div class="rk-math-choices">'+[
 ['recipe','🧁','Bakery Orders','Multiply, then choose the plate to serve.'],
 ['aquarium','🐠','Aquarium Rescue','Multiply to rescue fish and build the tank.'],
 ['fashion','👗','Fashion Studio','Multiply, then pack the right accessories.'],
 ['array','⚡','Quick Math','Solve the fact in your head and type it.'],
 ['match','🎴','Fact Match','Find the correct product for each fact.']
 ].map(g=>'<button type="button" '+({recipe:'id="rkMathRecipe"',array:'id="rkMathArray"',match:'id="rkMathMatch"'}[g[0]]||'')+' data-math-game="'+g[0]+'"><span class="rk-clay-tile" aria-hidden="true"><img src="assets/images/clay-sample/'+g[0]+'.webp" width="256" height="256" alt="" decoding="async"></span><b>'+g[2]+'</b><small>'+g[3]+'</small><em>'+(g[0]==='match'?'4 pairs':'5 questions')+'</em></button>').join('')+'</div>'+
 '<button type="button" class="rk-math-link" id="rkMathMain">← Main home</button>');
 app.querySelectorAll('[data-family]').forEach(b=>b.onclick=()=>{
  const n=Number(b.dataset.family);
  if(progress.families.includes(n)){
   if(progress.families.length===1){$('rkMathFamilyMessage').textContent='Keep at least one table selected.';return}
   progress.families=progress.families.filter(v=>v!==n);
  }else progress.families.push(n);
  progress.families.sort((a,b)=>a-b);save();sound();startHome();
 });
 app.querySelectorAll('[data-math-game]').forEach(b=>b.onclick=()=>start(b.dataset.mathGame));
 $('rkMathMain').onclick=goHub;
 /* clay sample: home hero is pre-rendered clay art (no live 3D) */
}
let active=null;
// Aquarium, Bakery Orders and Fashion Studio play the matching Shoreshim 3D clay studio games with
// multiplication questions (Grok, Nov 1). Each falls back to the 2D order scene without WebGL.
const STUDIO3D={aquarium:'aquarium',recipe:'cupcakes',fashion:'boutique'};
function startStudio3D(type){
 const id=STUDIO3D[type],st=window.RikiStudio;if(!id||!st||typeof st.start!=='function')return false;
 const n=(st.games&&st.games[id]&&st.games[id].steps.length)||8;const qs=pick(n);if(!qs.length)return false;while(qs.length<n)qs.push(qs[qs.length%qs.length]);
 let ok=false;try{ok=st.start(id,{math:{questions:qs,choices:q=>answerChoices(q),hint:q=>hintText(q),
  right:q=>give(q),wrong:q=>wrong(q),
  done:()=>{progress.completed[type]=(Number(progress.completed[type])||0)+1;save();},
  again:()=>start(type),exit:()=>startHome()}});}catch(_){ok=false}
 if(ok){active=null;activeTab();}return ok;
}
const startAquarium3D=()=>startStudio3D('aquarium');
function start(type){
 if(STUDIO3D[type]&&startStudio3D(type))return;
 sound();let questions=pick(type==='match'?4:5);
 if(type==='match'){
  const seen=new Set();questions=[];
  for(const f of shuffle(facts())){if(seen.has(f.answer))continue;seen.add(f.answer);questions.push(f);if(questions.length===4)break}
 }
 active={type,questions,at:0,built:0,prepared:0,recipeStage:'solve',done:false,score:0,selected:null,used:[],answers:shuffle(questions.map(x=>x.answer)),message:'',optionSet:answerChoices(questions[0])};
 render();
}
const question=()=>active.questions[active.at];
function progressBar(){const x=active;return '<div class="rk-math-bar" aria-label="'+x.at+' of '+x.questions.length+' done"><span style="width:'+(x.at/x.questions.length*100)+'%"></span></div>'}
function dots(n,emoji){let out='<span class="rk-math-dots">';for(let i=0;i<n;i++)out+='<span aria-hidden="true">'+emoji+'</span>';return out+'</span>'}
function form(){return '<form id="rkMathForm" class="rk-math-answer"><label for="rkMathInput">How many altogether?</label><input id="rkMathInput" type="number" inputmode="numeric" min="0" max="100" step="1" required placeholder="?" autocomplete="off"><button type="submit">Check answer</button></form>'}
function status(){const x=active;return '<p id="rkMathStatus" class="rk-math-status" role="status" aria-live="polite">'+esc(x.message||'Multiply in your head, then choose the answer.')+'</p>'+(x.done?'<button type="button" id="rkMathNext" class="rk-math-primary">'+(x.at===x.questions.length-1?'See results 🎉':'Next one →')+'</button>':'')}
function hintText(q){return q.a===4||q.b===4?'Double, then double again.':q.a===8||q.b===8?'Double three times.':q.a===9||q.b===9?'Multiply by 10, then subtract one group.':'Use a fact you know and build on it.';}
function hint(q){const n=hintText(q);return '<button type="button" id="rkMathHint" class="rk-math-link">💡 Strategy hint</button><p id="rkMathHelp" class="rk-math-help" hidden>'+n+'</p>'}

function answerChoices(q){
 const p=shuffle([q.answer+q.a,q.answer-q.a,q.answer+q.b,q.answer-q.b,q.a*(q.b+1),(q.a+1)*q.b,q.answer+2,q.answer-2,q.answer+5]);
 const out=[q.answer];for(const n of p)if(n>0&&n<=100&&!out.includes(n)){out.push(n);if(out.length===4)break}return shuffle(out);
}
function serveChoices(emoji,unit){
 return '<div class="rk-math-serving" role="group" aria-label="Choose the correct total">'+active.optionSet.map(n=>
 '<button class="rk-math-serve-choice" type="button" data-math-answer="'+n+'" '+(active.done?'disabled':'')+'><span aria-hidden="true">'+emoji+'</span><strong>'+n+'</strong><small>'+unit+'</small></button>').join('')+'</div>';
}
function customerScene(theme,emoji){
 return '<div class="rk-math-order-scene rk-math-'+theme+'" data-solved="'+active.done+'"><div class="rk-math-scene-decoration">'+
 '<span aria-hidden="true">'+emoji+'</span><span aria-hidden="true">'+(theme==='aquarium'?'🪸':theme==='fashion'?'🎀':'🥣')+'</span>'+
 '<span aria-hidden="true">'+(theme==='aquarium'?'🫧':theme==='fashion'?'👜':'🧁')+'</span></div>'+
 '<div class="rk-math-order-result">'+(active.done?'😊 Correct order served!':'🙂 Customer waiting for your answer')+'</div></div>';
}
function orderScene(kind,title,unit,icon){
 const q=question(),x=active;
 return header(title,'Customer '+(x.at+1)+' of '+x.questions.length)+progressBar()+
 '<section class="rk-math-panel rk-math-customer-panel"><div class="rk-math-order"><span>🧾</span><div><small>ORDER #'+(x.at+1)+'</small><h2>'+q.a+' sets of '+q.b+' '+unit+'</h2><p>How many '+unit+' altogether? Do it in your head.</p></div></div>'+
 '<p class="rk-math-equation">'+q.a+' × '+q.b+' = '+(x.done?q.answer:'?')+'</p>'+
 customerScene(kind,icon)+
 (x.done?'<div class="rk-math-success">✓ You chose '+q.answer+' '+unit+'. +6 coins!</div>':
 '<p class="rk-kitchen-instruction">Choose what to serve the customer.</p>'+serveChoices(icon,unit)+hint(q))+
 status()+'</section>';
}
function recipe(){const f=[['🍪','cookies'],['🧁','cupcakes'],['🥞','pancakes'],['🍓','strawberries'],['🍩','doughnuts']][active.at%5];return orderScene('bakery','🧁 Bakery Orders',f[1],f[0]);}
function aquarium(){return orderScene('aquarium','🐠 Aquarium Shop','fish','🐟');}
function fashion(){const f=[['🎀','bows'],['👟','pairs of shoes'],['👜','bags'],['👒','hats'],['🧣','scarves']][active.at%5];return orderScene('fashion','👗 Fashion Studio',f[1],f[0]);}

function array(){
 const q=question(),x=active;
 return header('⚡ Quick Math','Mental math '+(x.at+1)+' of '+x.questions.length)+progressBar()+
 '<section class="rk-math-panel"><div class="rk-math-dio" id="rkMathDio"><span aria-hidden="true">📚✏️</span></div><h2>Solve it without building rows.</h2><p>Think of the answer and type your product.</p>'+
 '<p class="rk-math-equation">'+q.a+' × '+q.b+' = '+(x.done?q.answer:'?')+'</p>'+
 (x.done?'<div class="rk-math-success">✅ Correct! +6 coins.</div>':form()+hint(q))+status()+'</section>';
}
function matching(){
 const x=active;let left='',right='';
 x.questions.forEach((q,i)=>{left+='<button type="button" class="rk-math-matchcard '+(x.used.includes(i)?'matched':x.selected===i?'selected':'')+'" data-fact="'+i+'" '+(x.used.includes(i)?'disabled':'')+'>'+q.a+' × '+q.b+'</button>'});
 x.answers.forEach((a,i)=>{const matched=x.used.some(n=>x.questions[n].answer===a);right+='<button type="button" class="rk-math-matchcard '+(matched?'matched':'')+'" data-answer="'+i+'" '+(matched?'disabled':'')+'>'+a+'</button>'});
 return header('🎴 Fact Match','Pick a multiplication fact, then its correct answer.')+progressBar()+
 '<section class="rk-math-panel"><div class="rk-math-dio rk-math-dio-short" id="rkMathDio"><span aria-hidden="true">🎴</span></div><h2>Find the matching pairs</h2><div class="rk-math-matchboard"><div><h3>Facts</h3>'+left+'</div><div><h3>Answers</h3>'+right+'</div></div><p class="rk-math-status" role="status" id="rkMathStatus">'+esc(x.message||'Start by choosing a multiplication fact.')+'</p></section>';
}

function mathAnswer(value){
 if(!active||active.done||active.type==='match')return;
 const q=question();
 if(value===q.answer){active.done=true;active.score++;active.message='Correct! '+q.a+' × '+q.b+' = '+q.answer+'. +6 coins!';give(q);render();}
 else{wrong(q);active.message='Not '+value+'. Try another mental-math strategy.';render();}
}
function render(){
 if(!active)return startHome();
 if(active.at>=active.questions.length)return finish();
 show(active.type==='recipe'?recipe():active.type==='aquarium'?aquarium():active.type==='fashion'?fashion():active.type==='array'?array():matching());
 $('rkMathBack').onclick=startHome;
 if(active.type==='array'){const q=question();diorama($('rkMathDio'),'study',{text:q.a+'×'+q.b+'='+(active.done?q.answer:'?')});if(active.done)dioBounce();}
 else if(active.type==='match'){diorama($('rkMathDio'),'cards');if(/Great match/.test(active.message))dioBounce();}
 app.querySelectorAll('[data-math-answer]').forEach(b=>b.onclick=()=>mathAnswer(Number(b.dataset.mathAnswer)));
 const h=$('rkMathHint');if(h)h.onclick=()=>{$('rkMathHelp').hidden=!$('rkMathHelp').hidden;sound()};
 const f=$('rkMathForm');if(f)f.onsubmit=e=>{e.preventDefault();const value=$('rkMathInput').value.trim();if(value)mathAnswer(Number(value));};
 const next=$('rkMathNext');if(next)next.onclick=()=>{
  active.at++;active.done=false;active.message='';
  if(active.at<active.questions.length)active.optionSet=answerChoices(question());
  render();
 };
 app.querySelectorAll('[data-fact]').forEach(b=>b.onclick=()=>{active.selected=Number(b.dataset.fact);active.message='Now choose its answer.';sound();render()});
 app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
  if(active.selected===null){active.message='Choose a fact on the left first.';render();return}
  const q=active.questions[active.selected],v=active.answers[Number(b.dataset.answer)];
  if(q.answer===v){give(q);active.score++;active.used.push(active.selected);active.at=active.used.length;active.selected=null;active.message='Great match! +6 coins.';render();}
  else{wrong(q);active.message='Not that one. Multiply '+q.a+' × '+q.b+' mentally.';active.selected=null;render()}
 });
}
function finish(){
 const x=active;progress.completed[x.type]=(Number(progress.completed[x.type])||0)+1;save();active=null;
 const title={recipe:'Bakery Orders',aquarium:'Aquarium Shop',fashion:'Fashion Studio',array:'Quick Math',match:'Fact Match'}[x.type];
 show(header('🎉 Nice multiplying!','You completed '+title+'.')+'<section class="rk-math-panel rk-math-done"><div>🏆</div><h2>'+x.score+' correct!</h2><p>🪙 '+(x.score*6)+' coins earned. You can try another activity or decorate your dollhouse.</p><div class="rk-math-actions"><button id="rkMathReplay">Play again</button><button id="rkMathChoose">Other games</button><button id="rkMathHouse">Dollhouse</button></div></section>');
 $('rkMathBack').onclick=startHome;$('rkMathReplay').onclick=()=>start(x.type);$('rkMathChoose').onclick=startHome;$('rkMathHouse').onclick=goHouse;
}
const tab=document.createElement('button');tab.type='button';tab.id='rkMathShortcut';tab.className='smallbtn';tab.textContent='✖️ Multiply';tab.onclick=()=>{sound();startHome()};
const house=$('houseShortcut');if(house){house.textContent='🏠 Dollhouse';nav.insertBefore(tab,house)}else nav.appendChild(tab);
// A legacy rule uses many :not(#id) selectors and !important to hide shortcuts.
// Inline importance wins that specificity without editing another assistant's stylesheet.
tab.style.setProperty('display','flex','important');
if(house)house.style.setProperty('display','flex','important');
// Older game layers inserted two extra Hebrew-roots buttons even though the
// original Shoresh Games shortcut already opens the same roots menu.
// Keep one visible, accessible destination instead of three duplicates.
const shoresh=$('gamesShortcut');
if(shoresh){
 shoresh.textContent='📚 Shoreshim';
 shoresh.setAttribute('aria-label','Open Shoreshim — Hebrew root games');
 shoresh.setAttribute('title','Practice Hebrew roots');
}
function hideShoreshDuplicates(){
 for(const id of ['rikiShoreshTab','rikiShoreshimTab']){
  const duplicate=$(id);
  if(!duplicate)continue;
  duplicate.style.setProperty('display','none','important');
  duplicate.setAttribute('aria-hidden','true');
  duplicate.tabIndex=-1;
 }
}
hideShoreshDuplicates();
// An older module inserts a second duplicate at DOMContentLoaded, *after*
// our module has initialized. Catch late additions without re-rendering the
// page or modifying another assistant's claimed file.
new MutationObserver(hideShoreshDuplicates).observe(nav,{childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hideShoreshDuplicates,{once:true});
function addTile(){
 const grid=app.querySelector('.hub-grid');if(grid&&!$('hubMath')){
  const button=document.createElement('button');button.type='button';button.className='hub-tile hub-math';button.id='hubMath';
  button.innerHTML='<span class="hub-ic rk-math-hub-icon" aria-hidden="true">✖️</span><b>Multiplication</b><span>Serve, style & solve</span>';
  const houseTile=$('hubHouse');if(houseTile)grid.insertBefore(button,houseTile);else grid.appendChild(button);
  button.onclick=()=>{sound();startHome()};
 }
 activeTab();
}
let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;addTile()})}).observe(app,{childList:true});
addTile();
window.RikiMath={home:startHome,start,dio:()=>DIO,getProgress:()=>({...progress}),section:()=>!!app.querySelector('.rk-math')};
})();
