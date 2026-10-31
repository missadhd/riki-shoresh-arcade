/* Textured 2D mesh with a local joint hierarchy. Jewelry is bone-local geometry.
   Raster dimensions are used only for texture upload, never attachment placement. */
(async function () {
'use strict';
const $ = s => document.querySelector(s);
const canvas = $('#rigCanvas'), svg = $('#jewelry'), status = $('#status');
const dir = 'assets/characters/riki-layered/';
const data = await fetch(dir+'rig.json?v=joint-1').then(r => {if(!r.ok)throw Error('Rig unavailable');return r.json()});
const config = data.jointRig, aspect = config.aspect, motionMargin=.045;
const I = () => [1,0,0,1,0,0];
const mul = (a,b) => [a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
const inv = a => {const d=a[0]*a[3]-a[1]*a[2];return [a[3]/d,-a[1]/d,-a[2]/d,a[0]/d,(a[2]*a[5]-a[3]*a[4])/d,(a[1]*a[4]-a[0]*a[5])/d]};
const transform = (m,p) => [m[0]*p[0]+m[2]*p[1]+m[4],m[1]*p[0]+m[3]*p[1]+m[5]];
const local = (p=[0,0],a=0,s=[1,1]) => [Math.cos(a)*s[0],Math.sin(a)*s[0],-Math.sin(a)*s[1],Math.cos(a)*s[1],p[0],p[1]];
const smooth = (a,b,x) => {const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const state = {outfit:'dress',shoes:'white',earrings:true,bracelet:true,headband:true,blink:false,mouth:-1,action:'idle',pose:'neutral',started:0,talking:false};
let nodes={},bind={},skin={},mesh=[],images={},dirty=true,meshDirty=true,raf=0,manual=false;
const skinBones=['body','head','earLeft','earRight','forearmRight','wristRight','legLeft','legRight'];
const durations={wave:2200,walk:2400,jump:950,nod:1100,listen:1500,think:1600,reach:1600,celebrate:1700};
function skeleton(pose){
 const overrides=config.poses[pose]||{}; nodes={};
 for(const [name,base] of Object.entries(config.bones)){
  const def={...base,...overrides[name]};nodes[name]={name,parent:def.parent,position:[...def.position],rotation:def.rotation||0,angle:0,offset:[0,0],scale:[1,1],world:I()};
 }
 updateWorld();bind=Object.fromEntries(Object.entries(nodes).map(([n,b])=>[n,[...b.world]]));
}
function updateWorld(){for(const b of Object.values(nodes)){const m=local([b.position[0]+b.offset[0],b.position[1]+b.offset[1]],b.rotation+b.angle,b.scale);b.world=b.parent?mul(nodes[b.parent].world,m):m}if(bind.body)for(const n of skinBones)skin[n]=mul(nodes[n].world,inv(bind[n]));}
function weights(p){
 const e=transform(bind.forearmRight,[0,0]),w=transform(bind.wristRight,[0,0]);
 const dx=w[0]-e[0],dy=w[1]-e[1],len=Math.hypot(dx,dy),ax=dx/len,ay=dy/len;
 const along=(p[0]-e[0])*ax+(p[1]-e[1])*ay,across=Math.abs((p[0]-e[0])*-ay+(p[1]-e[1])*ax);
 // Keep lobe skin with the head even when the raised hand overlaps its height.
 const earDistance=Math.min(...['earLeft','earRight'].map(n=>{const c=transform(bind[n],[0,0]);return Math.hypot(p[0]-c[0],p[1]-c[1])}));
 const arm=smooth(-.018,.022,along)*(1-smooth(.026,.105,across))*(1-smooth(len+.09,len+.18,along))*smooth(.02,.075,earDistance);
 const h=(1-arm)*(1-smooth(.476,.545,p[1]));
 const earWeight=n=>{const c=transform(bind[n],[0,0]);return (1-smooth(.012,.029,Math.hypot(p[0]-c[0],p[1]-c[1])))*h};
 const el=earWeight('earLeft'),er=earWeight('earRight');
 const leg=smooth(.742,.79,p[1]),left=1-smooth(.34,.41,p[0]);
 const l=leg*left*(1-h)*(1-arm),r=leg*(1-left)*(1-h)*(1-arm);
 const hand=smooth(len-.025,len-.009,along);
 return [Math.max(0,1-h-arm-l-r),h-el-er,el,er,arm*(1-hand),arm*hand,l,r];
}
function buildMesh(){
 mesh=[];meshDirty=true;const cols=96,rows=128;
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  for(const [dx,dy] of [[0,0],[1,0],[0,1],[1,0],[1,1],[0,1]]){const uv=[(x+dx)/cols,(y+dy)/rows],p=[uv[0]*aspect,uv[1]];mesh.push({p,uv,w:weights(p)});}
 }
}
function deform(p,w){let out=[0,0];skinBones.forEach((n,i)=>{const q=transform(skin[n]||I(),p);out[0]+=q[0]*w[i];out[1]+=q[1]*w[i]});return out}
const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:true});
if(!gl)throw Error('This preview needs WebGL. Please enable graphics acceleration.');
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 position;attribute vec4 weightsA;attribute vec4 weightsB;uniform mat3 bones[8];varying vec2 tex;void main(){vec3 p=vec3(position,1.);vec3 q=(bones[0]*p)*weightsA.x+(bones[1]*p)*weightsA.y+(bones[2]*p)*weightsA.z+(bones[3]*p)*weightsA.w+(bones[4]*p)*weightsB.x+(bones[5]*p)*weightsB.y+(bones[6]*p)*weightsB.z+(bones[7]*p)*weightsB.w;gl_Position=vec4((q.x/.75*2.-1.)/1.09,(1.-q.y*2.)/1.09,0.,1.);tex=vec2(position.x/.75,position.y);}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 tex;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,tex);}'));gl.linkProgram(program);gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
for(const [name,count,offset]of [['position',2,0],['weightsA',4,8],['weightsB',4,24]]){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,count,gl.FLOAT,false,40,offset);}
const boneUniform=gl.getUniformLocation(program,'bones[0]'),boneMatrices=new Float32Array(72);
const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
const art=document.createElement('canvas');[art.width,art.height]=data.canvas;const ctx=art.getContext('2d');
const files=[...Object.values(data.parts),data.wearables.dress,data.wearables.mintDress,data.wearables.headbandOn,data.wearables.hairClips,'accessory-shoes-pink.png','accessory-shoes-mint.png',...Object.values(data.wavePoses)];
await Promise.all([...new Set(files)].map(f=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[f]=im;resolve()};im.onerror=()=>reject(Error('Missing image: '+f));im.src=dir+f;})));
function paint(){
 ctx.clearRect(0,0,art.width,art.height);const draw=f=>ctx.drawImage(images[f],0,0,art.width,art.height);
 if(state.pose==='wave'){draw(data.wavePoses[state.outfit==='dress'?'pink':state.outfit==='mint'?'mint':'basics']);}
 else{
  draw(data.parts.neutralBase);
  if(state.blink)draw(data.parts.blink);else{draw(data.parts.eyeLeft);draw(data.parts.eyeRight)}
  draw([data.parts.mouthSmall,data.parts.mouthWide,data.parts.mouthO][state.mouth]||data.parts.mouthClosed);
  if(state.outfit==='dress')draw(data.wearables.dress);if(state.outfit==='mint')draw(data.wearables.mintDress);
  if(state.headband)draw(data.wearables.headbandOn);draw(data.wearables.hairClips);
  if(state.shoes!=='white')draw('accessory-shoes-'+state.shoes+'.png');
 }
 gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,art);dirty=false;
}
const NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs||{}))n.setAttribute(k,v);parent?.append(n);return n}
svg.setAttribute('viewBox',[-aspect*motionMargin,-motionMargin,aspect*(1+2*motionMargin),1+2*motionMargin].join(' '));
const defs=el('defs',{},svg),gem=el('radialGradient',{id:'gem',cx:'.3',cy:'.25'},defs);el('stop',{offset:'0%','stop-color':'#fff0fb'},gem);el('stop',{offset:'48%','stop-color':'#f6a3cf'},gem);el('stop',{offset:'100%','stop-color':'#b63f84'},gem);
const pearl=el('radialGradient',{id:'pearl',cx:'.3',cy:'.25'},defs);el('stop',{offset:'0%','stop-color':'#ffffff'},pearl);el('stop',{offset:'50%','stop-color':'#fff3df'},pearl);el('stop',{offset:'100%','stop-color':'#c69470'},pearl);
const boneElements={};
function makeAttachments(){
 for(const old of svg.querySelectorAll('[data-bone]'))old.remove();
 for(const [name,b] of Object.entries(nodes)){boneElements[name]=el('g',{'data-bone':name},b.parent?boneElements[b.parent]:svg)}
 for(const [name,a] of Object.entries(config.attachments)){
  const g=el('g',{'data-attachment':name,transform:`translate(${a.position.join(' ')})`},boneElements[a.bone]);
  if(name.startsWith('earring')){
   el('circle',{r:a.radius,fill:'url(#pearl)',stroke:'#bc915b','stroke-width':a.radius*.16},g);
   el('circle',{cx:-a.radius*.26,cy:-a.radius*.3,r:a.radius*.2,fill:'#fff'},g);
  }else{
   // The far half is occluded by wrist skin. Only its side returns remain visible.
   const r=a.radius,d=a.depth;
   el('path',{d:`M${-r} 0 A${r} ${d} 0 0 1 ${r} 0`,fill:'none',stroke:'#a46142','stroke-width':.0018,'stroke-opacity':'.6','stroke-dasharray':`${r*.18} ${r*2.7}`},g);
   el('path',{d:`M${-r} 0 A${r} ${d} 0 0 0 ${r} 0`,fill:'none',stroke:'#c39264','stroke-width':.0026},g);
   for(let i=0;i<=8;i++){const t=Math.PI*i/8;el('circle',{cx:-r*Math.cos(t),cy:d*Math.sin(t),r:.00225,fill:'url(#pearl)',stroke:'#b6825b','stroke-width':.0004},g)}
  }
 }
}
function jewelry(){
 for(const [n,b] of Object.entries(nodes))boneElements[n].setAttribute('transform','matrix('+local([b.position[0]+b.offset[0],b.position[1]+b.offset[1]],b.rotation+b.angle,b.scale).join(' ')+')');
 for(const g of svg.querySelectorAll('[data-attachment]'))g.style.display=g.dataset.attachment.startsWith('earring')?(state.earrings?'':'none'):(state.bracelet?'':'none');
}
function resetBones(){for(const b of Object.values(nodes)){b.angle=0;b.offset=[0,0];b.scale=[1,1]}}
function setPose(p){if(state.pose===p&&mesh.length)return;state.pose=p;skeleton(p);buildMesh();makeAttachments();dirty=true;}
function frameAt(action,t){
 setPose(action==='wave'?'wave':'neutral');resetBones();const pulse=Math.sin(Math.PI*t),cycle=Math.sin(t*Math.PI*6);
 switch(action){
  case 'wave':nodes.forearmRight.angle=Math.sin(t*Math.PI*8)*.06*pulse;nodes.wristRight.angle=Math.sin(t*Math.PI*8)*.18*pulse;nodes.head.angle=-.025*pulse;break;
  case 'nod':nodes.head.offset[1]=.009*Math.sin(t*Math.PI*4)*pulse;nodes.head.angle=.045*Math.sin(t*Math.PI*4)*pulse;break;
  case 'listen':nodes.head.angle=-.07*pulse;break;
  case 'think':nodes.head.angle=.07*pulse;break;
  case 'reach':nodes.forearmRight.angle=-.32*pulse;break;
  case 'walk':nodes.legLeft.angle=-.05*Math.sin(t*Math.PI*6);nodes.legRight.angle=.05*Math.sin(t*Math.PI*6);nodes.legLeft.offset[1]=-.012*Math.max(0,cycle)*pulse;nodes.legRight.offset[1]=-.012*Math.max(0,-cycle)*pulse;nodes.body.offset[1]=-.003*Math.abs(cycle);break;
  case 'jump':nodes.root.offset[1]=-.05*pulse;nodes.legLeft.angle=.035*pulse;nodes.legRight.angle=-.035*pulse;break;
  case 'celebrate':nodes.root.offset[1]=-.025*Math.abs(Math.sin(t*Math.PI*2))*pulse;nodes.head.angle=.035*Math.sin(t*Math.PI*3)*pulse;break;
 }
 updateWorld();
}
function resize(){const width=canvas.clientWidth,dpr=Math.min(devicePixelRatio||1,2);const w=Math.round(width*dpr),h=Math.round(w/aspect);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);renderKey='' }}
let renderKey='';
function render(){resize();const key=skinBones.map(n=>skin[n].join(',')).join('|')+[state.earrings,state.bracelet].join();if(!dirty&&!meshDirty&&renderKey===key)return;renderKey=key;if(dirty)paint();
 if(meshDirty){const vertices=new Float32Array(mesh.length*10);for(let i=0;i<mesh.length;i++)vertices.set([...mesh[i].p,...mesh[i].w],i*10);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);meshDirty=false;}
 skinBones.forEach((n,i)=>{const m=skin[n];boneMatrices.set([m[0],m[1],0,m[2],m[3],0,m[4],m[5],1],i*9)});gl.uniformMatrix3fv(boneUniform,false,boneMatrices);
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,mesh.length);jewelry();}
let lastFrame=0,reducedActionTimer=0;
function tick(now){if(!manual&&now-lastFrame>30){lastFrame=now;let t=state.action==='idle'?0:(now-state.started)/(durations[state.action]||1000);if(t>=1){state.action='idle';t=0;status.textContent='Ready';}frameAt(state.action,t);render()}raf=requestAnimationFrame(tick)}
function play(action){clearTimeout(reducedActionTimer);manual=false;if(action!=='idle'&&matchMedia('(prefers-reduced-motion: reduce)').matches){manual=true;frameAt(action,.4);render();reducedActionTimer=setTimeout(()=>{manual=false;state.action='idle';status.textContent='Ready'},600);status.textContent=action;return;}state.action=action;state.started=performance.now();status.textContent=action==='idle'?'Ready':action[0].toUpperCase()+action.slice(1);}
function stop(){speechId++;clearTimeout(speechTimeout);clearTimeout(talkBlinkTimer);clearInterval(mouthTimer);play('idle');state.talking=false;state.mouth=-1;dirty=true;window.speechSynthesis?.cancel();}
function selectButtons(selector,value){document.querySelectorAll(selector).forEach(b=>{const on=(b.dataset.outfit||b.dataset.shoes)===value;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
for(const b of document.querySelectorAll('[data-action]'))b.onclick=()=>{if(b.dataset.action==='wave')stop();play(b.dataset.action)};
for(const b of document.querySelectorAll('[data-outfit]'))b.onclick=()=>{state.outfit=b.dataset.outfit;dirty=true;selectButtons('[data-outfit]',state.outfit)};
for(const b of document.querySelectorAll('[data-shoes]'))b.onclick=()=>{state.shoes=b.dataset.shoes;dirty=true;selectButtons('[data-shoes]',state.shoes)};
for(const key of ['earrings','bracelet','headband'])$('#'+key).onclick=()=>{state[key]=!state[key];$('#'+key).classList.toggle('selected',state[key]);$('#'+key).setAttribute('aria-pressed',String(state[key]));dirty=true;};
let blinkTimer=0,mouthTimer=0,speechId=0,speechTimeout=0,talkBlinkTimer=0;
function blink(){state.blink=true;dirty=true;clearTimeout(blinkTimer);blinkTimer=setTimeout(()=>{state.blink=false;dirty=true},140)}
$('#blink').onclick=blink;$('#stop').onclick=()=>{clearInterval(mouthTimer);stop()};
setInterval(()=>{if(!manual&&!document.hidden&&state.pose!=='wave')blink()},4600);
$('#talk').onclick=()=>{
 stop();if(!window.speechSynthesis){status.textContent='Speech is unavailable on this device.';return}
 const token=speechId;state.talking=true;let frame=0;clearInterval(mouthTimer);mouthTimer=setInterval(()=>{state.mouth=[0,1,0,2,-1,0][frame++%6];dirty=true},150);talkBlinkTimer=setTimeout(blink,700);
 const u=new SpeechSynthesisUtterance('Hi! I am Riki. My jewelry follows my joints when I move.');u.lang='en-US';u.pitch=1.04;u.rate=.94;
 const score=v=>{const n=v.name.toLowerCase();let s=/natural|neural|premium|enhanced/.test(n)?100:0;if(/\b(female|ana|aria|jenny|samantha|ava|zira|victoria|karen|serena)\b|google us english/.test(n))s+=140;if(/\b(male|david|daniel|mark|george|fred|alex)\b|espeak|festival|robot/.test(n))s-=200;return s};
 const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>score(b)-score(a));if(vs.length)u.voice=vs[0];
 const done=()=>{if(token!==speechId)return;clearTimeout(speechTimeout);clearInterval(mouthTimer);state.talking=false;state.mouth=-1;dirty=true;status.textContent='Ready'};u.onend=done;u.onerror=done;speechTimeout=setTimeout(done,15000);status.textContent='Speaking';speechSynthesis.speak(u);
};
skeleton('neutral');buildMesh();makeAttachments();updateWorld();render();raf=requestAnimationFrame(tick);status.textContent='Ready';
// Deterministic rig API for integration and regression tests. No screen coordinates.
window.RikiJointRig={config,state,play,stop,sample(action,t){manual=true;frameAt(action,t);render()},resume(){manual=false},setBone(name,angle,offset=[0,0]){manual=true;nodes[name].angle=angle;nodes[name].offset=offset;updateWorld();render()},
 inspect(){return {pose:state.pose,bones:Object.fromEntries(Object.entries(nodes).map(([n,b])=>[n,{world:[...b.world],bind:bind[n]}])),attachments:Object.fromEntries(Object.entries(config.attachments).map(([n,a])=>[n,{bone:a.bone,local:a.position,world:transform(nodes[a.bone].world,a.position)}]))}},
 meshPoint(p){return {position:deform(p,weights(p)),weights:weights(p)}},meshQuality(){let flipped=0,min=1;for(let i=0;i<mesh.length;i+=3){const ps=mesh.slice(i,i+3).map(v=>deform(v.p,v.w)),[a,b,c]=ps,area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);min=Math.min(min,area);if(area<=0)flipped++;}return {flipped,min}},reset(){manual=true;frameAt('idle',0);render()}};
})().catch(e=>{console.error(e);document.querySelector('#status').textContent='Could not load Riki: '+e.message;});
