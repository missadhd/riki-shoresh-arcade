/* Shared 2D skinning for the six live dolls. Artwork is reused, never regenerated.
   Bone and accessory coordinates are local, in units of character height. */
(async()=>{
'use strict';
const data=await fetch('assets/characters/doll-joints.json?v=1').then(r=>{if(!r.ok)throw Error('Doll joints unavailable');return r.json()});
const profiles=data.characters,instances=new Map(),resources=new Map(),NS='http://www.w3.org/2000/svg';
const I=()=>[1,0,0,1,0,0];
const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
const inv=a=>{const d=a[0]*a[3]-a[1]*a[2];return[a[3]/d,-a[1]/d,-a[2]/d,a[0]/d,(a[2]*a[5]-a[3]*a[4])/d,(a[1]*a[4]-a[0]*a[5])/d]};
const point=(m,p)=>[m[0]*p[0]+m[2]*p[1]+m[4],m[1]*p[0]+m[3]*p[1]+m[5]];
const local=(p,a)=>[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),...p];
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const names=['body','head','earLeft','earRight','forearmRight','wristRight','legLeft','legRight'];
function resource(url){if(!resources.has(url))resources.set(url,fetch(url).then(r=>{if(!r.ok)throw Error('Missing art '+url);return r.blob()}).then(b=>new Promise((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.onerror=reject;f.readAsDataURL(b)})));return resources.get(url)}
const loadImage=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
async function inlineSVG(svg){const clone=svg.cloneNode(true);clone.querySelectorAll('[data-rig-joint],foreignObject').forEach(n=>n.remove());
 if(svg.dataset.jointCharacter==='riki')clone.querySelectorAll('image').forEach(n=>{if(/eye-(left|right)-tight|mouth-closed-tight/.test(n.getAttribute('href')))n.remove()});
 clone.setAttribute('viewBox',`0 0 ${profiles[svg.dataset.jointCharacter].width} 204`);clone.setAttribute('width',profiles[svg.dataset.jointCharacter].width);clone.setAttribute('height','204');clone.setAttribute('xmlns',NS);
 await Promise.all([...clone.querySelectorAll('image')].map(async n=>n.setAttribute('href',await resource(n.getAttribute('href')))));
 return loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clone)));
}
class DollRig{
 constructor(svg){this.svg=svg;this.id=svg.dataset.jointCharacter;this.p=profiles[this.id];this.bones={};this.bind={};this.skin={};this.action='idle';this.started=performance.now();this.visible=true;this.ready=false;this.manual=false;this.mesh=[];
  for(const[n,b]of Object.entries(this.p.bones))this.bones[n]={...b,position:[...b.position],angle:0,offset:[0,0],world:I()};this.update();for(const[n,b]of Object.entries(this.bones))this.bind[n]=[...b.world];this.update();
 }
 update(){for(const[n,b]of Object.entries(this.bones)){const m=local(b.position.map((v,i)=>v+b.offset[i]),(b.rotation||0)+b.angle);b.world=b.parent?mul(this.bones[b.parent].world,m):m;if(this.bind[n])this.skin[n]=mul(b.world,inv(this.bind[n]))}}
 weights(p){const e=this.bind.forearmRight.slice(4),w=this.bind.wristRight.slice(4),dx=w[0]-e[0],dy=w[1]-e[1],len=Math.hypot(dx,dy),along=((p[0]-e[0])*dx+(p[1]-e[1])*dy)/len,across=Math.abs((p[0]-e[0])*-dy+(p[1]-e[1])*dx)/len;
  const arm=smooth(-.018,.022,along)*(1-smooth(.026,.105,across))*(1-smooth(len+.09,len+.18,along));
  const h=(1-arm)*(1-smooth(.476,.545,p[1])),ear=n=>{const c=this.bind[n].slice(4);return(1-smooth(.012,.029,Math.hypot(p[0]-c[0],p[1]-c[1])))*h},el=ear('earLeft'),er=ear('earRight');
  const leg=smooth(.742,.79,p[1]),middle=(this.bind.legLeft[4]+this.bind.legRight[4])/2,left=1-smooth(middle-.035,middle+.035,p[0]),l=leg*left*(1-h)*(1-arm),r=leg*(1-left)*(1-h)*(1-arm),hand=smooth(len-.025,len-.009,along);
  return[Math.max(0,1-h-arm-l-r),h-el-er,el,er,arm*(1-hand),arm*hand,l,r];
 }
 async init(){
  this.base=await inlineSVG(this.svg);if(!this.svg.isConnected)return;
  this.face={};if(this.id==='riki')await Promise.all(['eye-left-tight.png','eye-right-tight.png','eyes-blink.webp','mouth-closed-tight.png','mouth-small-fitted.png','mouth-wide-fitted.png','mouth-o-fitted.png'].map(async f=>this.face[f]=await loadImage(await resource('assets/characters/riki-layered/'+f))));
  if(!this.svg.isConnected)return;
  const fo=document.createElementNS(NS,'foreignObject');fo.setAttribute('width',this.p.width);fo.setAttribute('height',204);fo.setAttribute('pointer-events','none');
  this.canvas=document.createElementNS('http://www.w3.org/1999/xhtml','canvas');this.canvas.style.cssText='width:100%;height:100%;display:block';fo.append(this.canvas);this.fo=fo;
  const gl=this.gl=this.canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true,preserveDrawingBuffer:true});if(!gl)return;
  const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
  const prog=this.program=gl.createProgram();
  gl.attachShader(prog,shader(gl.VERTEX_SHADER,`attribute vec2 position;attribute vec4 wa;attribute vec4 wb;uniform mat3 bones[8];uniform float aspect;uniform vec4 eyes;uniform vec2 mouth;uniform float blink;uniform float speaking;varying vec2 uv;
  void main(){vec2 s=position;float eye=exp(-pow((s.x-eyes.x)/.032,2.)-pow((s.y-eyes.y)/.027,2.));float eye2=exp(-pow((s.x-eyes.z)/.032,2.)-pow((s.y-eyes.w)/.027,2.));s.y-=blink*.92*((s.y-eyes.y)*eye+(s.y-eyes.w)*eye2);float lip=exp(-pow((s.x-mouth.x)/.028,2.)-pow((s.y-mouth.y)/.018,2.));s.y+=(s.y-mouth.y)*lip*speaking*.32;
  vec3 p=vec3(s,1.);vec3 q=(bones[0]*p)*wa.x+(bones[1]*p)*wa.y+(bones[2]*p)*wa.z+(bones[3]*p)*wa.w+(bones[4]*p)*wb.x+(bones[5]*p)*wb.y+(bones[6]*p)*wb.z+(bones[7]*p)*wb.w;gl_Position=vec4(q.x/aspect*2.-1.,1.-q.y*2.,0.,1.);uv=vec2(position.x/aspect,position.y);}`));
  gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 uv;uniform sampler2D art;void main(){gl_FragColor=texture2D(art,uv);}'));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
  const v=[];for(let y=0;y<112;y++)for(let x=0;x<80;x++)for(const[dx,dy]of[[0,0],[1,0],[0,1],[1,0],[1,1],[0,1]]){const p=[(x+dx)/80*this.p.aspect,(y+dy)/112],w=this.weights(p);this.mesh.push({p,w});v.push(...p,...w)}
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);for(const[n,size,offset]of[['position',2,0],['wa',4,8],['wb',4,24]]){const a=gl.getAttribLocation(prog,n);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,size,gl.FLOAT,false,40,offset)}
  this.uniforms=Object.fromEntries(['bones[0]','aspect','eyes','mouth','blink','speaking'].map(n=>[n,gl.getUniformLocation(prog,n)]));gl.uniform1f(this.uniforms.aspect,this.p.aspect);gl.uniform4fv(this.uniforms.eyes,this.p.eyes.flat());gl.uniform2fv(this.uniforms.mouth,this.p.mouth);
  gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());for(const[a,b]of[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,a,b);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  this.art=document.createElement('canvas');this.art.width=612;this.art.height=Math.round(612/this.p.aspect);this.ctx=this.art.getContext('2d');this.lastFace='';this.paint(false,-1);
  this.fallback=[...this.svg.children].filter(n=>n.tagName!=='defs'&&!n.dataset.rigJoint);this.fallback.forEach(n=>n.style.visibility='hidden');this.svg.insertBefore(fo,this.svg.querySelector('[data-rig-joint]'));this.svg.dataset.rigReady='true';this.ready=true;
  this.canvas.addEventListener('webglcontextlost',()=>this.destroy());this.sample('idle',0);this.manual=false;
 }
 paint(blink,mouth){const key=blink+':'+mouth;if(this.lastFace===key)return;this.lastFace=key;const c=this.ctx,w=this.art.width,h=this.art.height;c.clearRect(0,0,w,h);c.drawImage(this.base,0,0,w,h);
  if(this.id==='riki'){const draw=f=>c.drawImage(this.face[f],0,0,w,h);if(blink)draw('eyes-blink.webp');else{draw('eye-left-tight.png');draw('eye-right-tight.png')}draw(['mouth-small-fitted.png','mouth-wide-fitted.png','mouth-o-fitted.png'][mouth]||'mouth-closed-tight.png')}
  this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.art);
 }
 sample(action,t,draw=true){this.manual=true;for(const b of Object.values(this.bones)){b.angle=0;b.offset=[0,0]}const b=this.bones,pulse=Math.sin(Math.PI*t),cycle=Math.sin(t*Math.PI*6);
  if(action==='wave'){b.forearmRight.angle=-.32*pulse+Math.sin(t*Math.PI*8)*.04*pulse;b.wristRight.angle=Math.sin(t*Math.PI*8)*.13*pulse}
  if(action==='reach')b.forearmRight.angle=-.28*pulse;
  if(action==='nod'){b.head.angle=.035*Math.sin(t*Math.PI*4)*pulse;b.head.offset[1]=.006*Math.sin(t*Math.PI*4)*pulse}
  if(action==='listen'||action==='think')b.head.angle=(action==='listen'?-.05:.05)*pulse;
  if(action==='walk'){b.legLeft.angle=-.04*cycle;b.legRight.angle=.04*cycle;b.legLeft.offset[1]=-.009*Math.max(0,cycle)*pulse;b.legRight.offset[1]=-.009*Math.max(0,-cycle)*pulse}
  if(action==='jump'||action==='celebrate')b.root.offset[1]=-.015*(action==='jump'?pulse:Math.abs(Math.sin(t*Math.PI*2))*pulse);
  this.update();if(draw)this.render(false,-1);
 }
 render(blink,mouth){if(!this.ready)return;const gl=this.gl,box=this.svg.getBoundingClientRect(),w=Math.max(1,Math.round(Math.min(440,box.width)*Math.min(devicePixelRatio||1,2))),h=Math.round(w/this.p.aspect);if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;gl.viewport(0,0,w,h)}
  if(this.id==='riki')this.paint(blink,mouth);gl.uniform1f(this.uniforms.blink,this.id==='riki'?0:+blink);gl.uniform1f(this.uniforms.speaking,this.id==='riki'?0:mouth<0?0:(mouth+1)/3);
  const m=[];for(const n of names){const a=this.skin[n];m.push(a[0],a[1],0,a[2],a[3],0,a[4],a[5],1)}gl.uniformMatrix3fv(this.uniforms['bones[0]'],false,new Float32Array(m));gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,this.mesh.length);
  this.svg.querySelectorAll('[data-rig-joint]').forEach(n=>{const m=[...this.bones[n.dataset.rigJoint].world];m[4]*=204;m[5]*=204;n.setAttribute('transform','matrix('+m.join(' ')+')')});
 }
 tick(now){if(!this.ready||!this.visible||this.manual)return;let action=this.svg.dataset.rigAction==='wave'?'wave':'idle';let el=this.svg;for(let k=0;el&&k<6;el=el.parentElement,k++){const classes=el.classList;for(const a of['listen','think','reach','nod','celebrate'])if(classes.contains('rk-motion-'+a))action=a;if(classes.contains('walk'))action='walk';if(classes.contains('hop'))action='jump';}
  const talking=!!this.svg.closest('.riki-speaking'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(action!==this.action){this.action=action;this.started=now}let t=(now-this.started)/1800;if(t>1){if(action==='walk')t%=1;else{action='idle';t=0}}
  const blink=now%4700>4550,mouth=talking?[0,1,0,2,-1,0][Math.floor(now/150)%6]:-1;const key=[action,reduced?0:Math.round(t*30),blink,mouth,this.svg.clientWidth].join(':');if(key===this.frameKey)return;this.frameKey=key;
  this.sample(reduced?'idle':action,reduced?0:t,false);this.manual=false;this.render(blink,mouth);
 }
 inspect(){return{action:this.action,ready:this.ready,bones:Object.fromEntries(Object.entries(this.bones).map(([n,b])=>[n,[...b.world]])),attachments:[...this.svg.querySelectorAll('[data-rig-joint]')].map(n=>({bone:n.dataset.rigJoint,matrix:[...['a','b','c','d','e','f'].map(k=>n.transform.baseVal.consolidate().matrix[k])]}))}}
 quality(){const deform=v=>{let q=[0,0];names.forEach((n,i)=>{const p=point(this.skin[n],v.p);q[0]+=p[0]*v.w[i];q[1]+=p[1]*v.w[i]});return q};let flipped=0;for(let i=0;i<this.mesh.length;i+=3){const[a,b,c]=this.mesh.slice(i,i+3).map(deform);if((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])<=0)flipped++}return{flipped}}
 destroy(){this.ready=false;this.fo?.remove();this.fallback?.forEach(n=>n.style.visibility='');delete this.svg.dataset.rigReady;instances.delete(this.svg);this.gl?.getExtension('WEBGL_lose_context')?.loseContext()}
}
const visibility=new IntersectionObserver(entries=>entries.forEach(e=>{const r=instances.get(e.target);if(r)r.visible=e.isIntersecting}));
let scanning=false;
function scan(){if(scanning)return;scanning=true;requestAnimationFrame(()=>{scanning=false;for(const[el,r]of instances)if(!el.isConnected){visibility.unobserve(el);r.destroy()}
 document.querySelectorAll('.pd-doll').forEach(el=>{if(!el.dataset.jointCharacter){try{const look=JSON.parse(decodeURIComponent(el.dataset.rigLook||'{}'));delete look.__rigFallback;el.outerHTML=window.RikiArt.doll(look,'stand',undefined,el.dataset.rigCrop==='true')}catch(_){}}});
 document.querySelectorAll('.pd-doll[data-joint-character]').forEach(el=>{if(el.dataset.rigFailed||instances.has(el)||!profiles[el.dataset.jointCharacter])return;const r=new DollRig(el);instances.set(el,r);visibility.observe(el);r.init().catch(e=>{console.warn('Doll art fallback',e);el.dataset.rigFailed='1';r.destroy()})});
 })}
window.RikiDollRig={ready:true,profiles,instances,scan,get:el=>instances.get(el)};
const style=document.createElement('style');style.textContent=`.rk-motion-target:has(.pd-doll[data-rig-ready]),.pd-actor.walk:has(.pd-doll[data-rig-ready]),.pd-actor.hop:has(.pd-doll[data-rig-ready]){animation:none!important}.pd-doll[data-rig-ready][data-rig-crop="false"]{overflow:visible}.pd-doll[data-rig-ready][data-rig-crop="true"]{overflow:hidden!important}.pd-doll[data-rig-ready] .pd-speech-mouth{display:none!important}`;document.head.append(style);
new MutationObserver(scan).observe(document.getElementById('app'),{childList:true,subtree:true});scan();let previous=0;function tick(now){if(now-previous>45&&!document.hidden){previous=now;instances.forEach(r=>r.tick(now))}requestAnimationFrame(tick)}requestAnimationFrame(tick);
})().catch(e=>console.warn('Doll joint renderer unavailable; original artwork retained.',e));
