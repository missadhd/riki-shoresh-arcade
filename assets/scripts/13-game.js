
/* Claw game improvements claimed by ChatGPT. */
/* Riki Studio Games: the make-something Shoresh games rebuilt in 3D.
   Every right answer puts the chosen piece onto the creation. Words come from the game's own list (W, ids()). */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
const K=window.RK3;if(!K)return;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ================= styles ================= */
const css=`.st-claw-question{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0;padding:12px;background:#fff8fc;border:2px solid #f3d6dc;border-radius:22px}.st-claw-question p{grid-column:1/-1;text-align:center;font-size:1.15rem;font-weight:900;margin:0 0 5px}.st-claw-answer{font:inherit;font-size:1.05rem;font-weight:900;min-height:64px;padding:14px 12px;border-radius:18px;background:#fff;border:3px solid #eaa6c6;box-shadow:0 5px 0 #eac6d8;color:#54253e;cursor:pointer;touch-action:manipulation}.st-claw-answer:disabled{opacity:.65;background:#f8e6ed}.st-claw-answer:active{transform:translateY(2px)}@media(max-width:400px){.st-claw-question{gap:8px;padding:9px}.st-claw-answer{font-size:1rem;min-height:62px;padding:10px 7px}}
.st{display:flex;flex-direction:column;gap:12px}
.st-order{display:flex;gap:12px;align-items:center;background:#fff;border:2px solid #f3d6dc;border-radius:22px;padding:12px 14px}
.st-av{width:54px;height:54px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:30px;background:#ffe3ea}
.st-bub{flex:1;min-width:0}
.st-bub small{display:block;font-weight:800;color:#8a6577;font-size:13px;letter-spacing:.02em}
.st-bub b{display:block;font-family:"Baloo 2","Trebuchet MS",system-ui,sans-serif;font-size:1.25rem;line-height:1.2;color:#4a2338}
.st-he{font-family:"Frank Ruhl Libre","David","Arial Hebrew","Noto Sans Hebrew",serif;direction:rtl;unicode-bidi:isolate;font-weight:900;font-size:2.1rem;color:#e2457a;letter-spacing:.04em;line-height:1.1}
.st-stage{position:relative;height:clamp(260px,46vh,420px);border-radius:26px;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fff 0,#ffe8ef 55%,#f6d8e8 100%);border:3px solid #fff;box-shadow:0 14px 30px -14px #e2457a66;touch-action:none}
.st-stage canvas{display:block;width:100%;height:100%}
.st-stage.drop{box-shadow:0 0 0 4px #7cc4f2,0 14px 30px -14px #e2457a66}
.st-dots{display:flex;justify-content:center;gap:7px}
.st-dots i{width:12px;height:12px;border-radius:50%;background:#f3d6dc}.st-dots i.on{background:#5cc6a8}.st-dots i.now{background:#e2457a;transform:scale(1.25)}
.st-ask{text-align:center;font-weight:800;color:#8a6577;margin:0}
.st-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.st-card{position:relative;background:#fff;border:2px solid #f3d6dc;border-radius:20px;padding:6px 6px 10px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 5px 0 #f3d6dc;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab;color:#4a2338;font:inherit}
.st-card img,.st-card .ph{width:100%;aspect-ratio:1;max-width:100%;object-fit:contain;border-radius:14px;background:radial-gradient(circle at 50% 40%,#fff,#fff1f6)}
.st-card .ph{display:grid;place-items:center;font-size:34px}
.st-card span{font-weight:900;font-size:.92rem;line-height:1.15;text-align:center;min-height:2.3em;display:flex;align-items:center}
.st-card span.st-he{font-size:1.6rem;min-height:1.4em}
.st-card:active{transform:translateY(2px);box-shadow:0 3px 0 #f3d6dc}
.st-card.bad{animation:stShake .4s;border-color:#ffb3c8;opacity:.55}
.st-card.good{border-color:#5cc6a8;box-shadow:0 5px 0 #5cc6a8}
@keyframes stShake{25%{transform:translateX(-6px) rotate(-2deg)}75%{transform:translateX(6px) rotate(2deg)}}
.st-ghost{position:fixed;z-index:9999;width:96px;pointer-events:none;transform:translate(-50%,-60%) rotate(-6deg);filter:drop-shadow(0 10px 12px #4a233855)}
.st-ghost img{width:100%;border-radius:16px}
.st-hint{background:#fff7d6;border-radius:16px;padding:10px 14px;font-weight:700;color:#6a4b2a;margin:0}
.st-hint[hidden]{display:none}
.st-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.st-end{text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center}
.st-end h2{margin:0;font-family:"Baloo 2","Trebuchet MS",system-ui,sans-serif;font-size:1.8rem}
.st-burst{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.st-burst i{position:absolute;width:12px;height:12px;border-radius:50%;animation:stFly .9s ease-out forwards}
@keyframes stFly{to{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0}}
@media (prefers-reduced-motion:reduce){.st-card.bad,.st-burst i{animation:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ================= helpers from the engine ================= */
const {mat,fabric,gloss,wood,metalM,RB,BX,CY,SP,CO,add,eye,legs4,face,heartShape,starShape,moonShape,ext,puff,balloon,toy,glow,toadstool,C}=K;
const P={pink:'#f7a0bd',hot:'#e2457a',mint:'#8ed6c4',sky:'#8fc6e8',lilac:'#c8a2ff',sun:'#ffd25e',cream:'#fff4e6',choc:'#8a5a35',red:'#ef5a6f',peach:'#ffb48a',white:'#fdfbfb',green:'#5fb06a',gold:'#f2c94c',navy:'#6b68b8'};
function patTex(kind,a,b){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=a;x.fillRect(0,0,128,128);x.fillStyle=b;
  if(kind==='dots')for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.beginPath();x.arc(16+i*32+(j%2)*16,16+j*32,7,0,7);x.fill();}
  if(kind==='stripes')for(let i=0;i<4;i++)x.fillRect(i*32,0,16,128);
  if(kind==='hearts')for(let i=0;i<3;i++)for(let j=0;j<3;j++){const cx=22+i*42+(j%2)*20,cy=22+j*42,s=11;x.beginPath();x.moveTo(cx,cy+s*.35);x.bezierCurveTo(cx-s,cy-s*.3,cx-s*.4,cy-s,cx,cy-s*.45);x.bezierCurveTo(cx+s*.4,cy-s,cx+s,cy-s*.3,cx,cy+s*.35);x.fill();}
  if(kind==='stars')for(let i=0;i<3;i++)for(let j=0;j<3;j++){const cx=22+i*42+(j%2)*20,cy=22+j*42;x.beginPath();for(let k=0;k<10;k++){const a2=-Math.PI/2+k*Math.PI/5,r=k%2?5:12;x.lineTo(cx+Math.cos(a2)*r,cy+Math.sin(a2)*r);}x.fill();}
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
const pmat=(kind,a,b,rep=2)=>{const t=patTex(kind,a,b);t.repeat.set(rep,rep);return mat('#ffffff',.6,0,{map:t});};
const pop=(g)=>{g.userData.pop=performance.now();return g;};

/* ================= shared pieces ================= */
function chibi(g,options={}){if(gameCharacter(g,'doll',.8,1.35))return;return chibiLegacy(g,options);}
function gameCharacter(g,type,w,h){if(!window.RikiArt?.gameTexture)return false;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,opacity:0,depthWrite:false}));sprite.position.y=h/2;sprite.scale.set(w,h,1);g.add(sprite);window.RikiArt.gameTexture(type).then(cv=>{const tex=new THREE.CanvasTexture(cv);tex.encoding=THREE.sRGBEncoding;sprite.material.map=tex;sprite.material.opacity=1;sprite.material.needsUpdate=true;}).catch(()=>{g.remove(sprite);if(type==='doll')chibiLegacy(g);else K.B.cat(g);});return true;}
function chibiLegacy(g,{skin='#ffd8bd',hair='#7a4a2a'}={}){
  const sk=toy(skin);[-1,1].forEach(k=>{CY(g,.055,.06,.42,sk,k*.09,.24,0,12);SP(g,.07,sk,k*.09,.05,.04,1,.6,1.3);});
  CY(g,.13,.16,.36,fabric('#ffffff'),0,.6,0,20);[-1,1].forEach(k=>{const a=CY(g,.04,.045,.32,sk,k*.19,.62,0,10);a.rotation.z=k*.35;SP(g,.05,sk,k*.25,.47,0);});
  CY(g,.05,.06,.08,sk,0,.81,0,10);SP(g,.26,sk,0,1.04,0);face(g,0,1.02,.25,1.25);
  const h=toy(hair);const cap=add(g,new THREE.SphereGeometry(.275,24,16,0,Math.PI*2,0,Math.PI*.55),h,0,1.05,-.01);[-1,1].forEach(k=>{SP(g,.1,h,k*.27,1.0,-.08,1,1.4,1);});SP(g,.17,h,0,1.06,-.1,1.2,1.3,.9);
}
function kitty(g){if(gameCharacter(g,'pet',.8,.96))return;K.B.cat(g);g.children.forEach(o=>{o.userData.baseY=o.position.y;});}
function fish(g,c,c2){const b=SP(g,.13,gloss(c),0,0,0,1.5,1,.7);const t=CO(g,.09,.14,gloss(c2||c),-.2,0,0);t.rotation.z=Math.PI/2;SP(g,.025,eye(),.12,.04,.06);SP(g,.025,eye(),.12,.04,-.06);const f=SP(g,.05,gloss(c2||c),0,.11,0,1.2,.6,.3);}

/* ================= game definitions ================= */
const V=(name,build)=>({name,build});
const GAMES={
 cupcakes:{title:'Cupcake Café',emoji:'🧁',av:'👩‍🍳',lead:'Order up!',cam:[.75,2.6,.42],done:'Cupcake served!',
  base(g){CY(g,.62,.58,.04,gloss('#ffffff'),0,.02,0,40);const lin=new THREE.Group();g.add(lin);this.liner(lin,P.pink);CY(g,.31,.31,.12,toy('#f2c28a'),0,.5,0,32);SP(g,.31,toy('#f2c28a'),0,.56,0,1,.4,1);g.userData.liner=lin;},
  liner(g,c){CY(g,.3,.22,.46,toy(c),0,.27,0,24);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;CY(g,.022,.016,.46,toy(K.shadeHex(c,.9)),Math.cos(a)*.27,.27,Math.sin(a)*.27,6);}},
  steps:[
   {ask:'Pick the cupcake wrapper',slot:'liner',vs:[V('Pink wrapper',g=>GAMES.cupcakes.liner(g,P.pink)),V('Mint wrapper',g=>GAMES.cupcakes.liner(g,P.mint)),V('Sunny wrapper',g=>GAMES.cupcakes.liner(g,P.sun)),V('Lilac wrapper',g=>GAMES.cupcakes.liner(g,P.lilac))]},
   {ask:'Pick the frosting',slot:'frost',vs:['#ffc4d8','#fff1dc','#c9f0e2','#d9ccff','#8a5a35'].map((c,i)=>V(['Strawberry','Vanilla','Mint','Blueberry','Chocolate'][i]+' frosting',g=>{[[.3,.66],[.24,.78],[.17,.88],[.1,.96]].forEach(([r,y])=>{const t=add(g,new THREE.TorusGeometry(r,.075,14,32),toy(c),0,y,0);t.rotation.x=Math.PI/2;});CO(g,.08,.14,toy(c),0,1.04,0);}))},
   {ask:'Pick the sprinkles',slot:'spr',vs:[['#e2457a','#ffd25e','#7cc4f2','#5cc6a8'],['#ffffff','#ffc4d8'],['#f2c94c','#ffffff'],['#c8a2ff','#7cc4f2']].map((cols,i)=>V(['Rainbow','Snowy','Gold','Galaxy'][i]+' sprinkles',g=>{for(let k=0;k<26;k++){const a=k*2.39,lvl=k%4,r=[.33,.27,.2,.12][lvl],y=[.7,.82,.92,.99][lvl];const s=CY(g,.012,.012,.06,gloss(cols[k%cols.length]),Math.cos(a)*r,y,Math.sin(a)*r,6);s.rotation.set(a,k,a*.5);}}))},
   {ask:'Pick the topper',slot:'top',vs:[V('Cherry',g=>{SP(g,.09,gloss(P.red),0,1.15,0);CY(g,.008,.008,.12,toy(P.green),.02,1.27,0,4).rotation.z=-.3;}),V('Strawberry',g=>{CO(g,.09,.18,gloss(P.red),0,1.16,0).rotation.x=Math.PI;SP(g,.07,toy(P.green),0,1.24,0,1,.3,1);}),V('Star',g=>{ext(g,starShape(.12),.04,gloss(P.sun),0,1.2,0,.02);}),V('Heart',g=>{ext(g,heartShape(.12),.04,gloss(P.hot),0,1.18,0,.02);})]},
   {ask:'Pick the drizzle',slot:'driz',vs:['#8a5a35','#ffffff','#ffd25e','#e2457a'].map((c,i)=>V(['Chocolate','Icing','Honey','Berry'][i]+' drizzle',g=>{for(let k=0;k<10;k++){const a=k/10*Math.PI*2;SP(g,.035,gloss(c),Math.cos(a)*.31,.62,Math.sin(a)*.31,1,2,1);}const t=add(g,new THREE.TorusGeometry(.3,.02,8,36),gloss(c),0,.7,0);t.rotation.x=Math.PI/2;}))},
   {ask:'Pick the candle',slot:'candle',vs:['#7cc4f2','#e2457a','#5cc6a8','#f2c94c'].map((c,i)=>V(['Blue','Pink','Green','Gold'][i]+' candle',g=>{CY(g,.025,.025,.22,toy(c),.15,1.0,.1,10);SP(g,.03,glow('#ffb020',2.2),.15,1.15,.1,1,1.7,1);}))},
   {ask:'Pick a sweet extra',slot:'extra',vs:[V('Sugar pearls',g=>{for(let k=0;k<12;k++){const a=k/12*Math.PI*2;SP(g,.025,gloss('#ffffff'),Math.cos(a)*.44,.07,Math.sin(a)*.44);}}),V('Macarons',g=>{[[-.42,'#ffc4d8'],[.42,'#c9f0e2']].forEach(([x,c])=>{CY(g,.08,.08,.04,toy(c),x,.08,.2,20);CY(g,.07,.07,.02,toy('#fff1dc'),x,.11,.2,20);CY(g,.08,.08,.04,toy(c),x,.14,.2,20);});}),V('Little flag',g=>{CY(g,.006,.006,.35,metalM(),-.1,1.15,-.05,4);const f=CO(g,.06,.14,toy(P.hot),-.03,1.27,-.05);f.rotation.z=-Math.PI/2;f.scale.z=.2;}),V('Mini berries',g=>{[[-.4,.2],[.4,.25],[.2,-.42]].forEach(([x,z])=>SP(g,.05,gloss('#5a5ad6'),x,.08,z));})]},
   {ask:'Pick the magic finish',slot:'fin',vs:[V('Gold sparkles',g=>{for(let k=0;k<10;k++){const a=k*1.7;SP(g,.018,glow('#ffd25e',2),Math.cos(a)*.38,.9+(k%4)*.12,Math.sin(a)*.38);}}),V('Rainbow sparkles',g=>{for(let k=0;k<12;k++){const a=k*1.5;SP(g,.018,glow(['#ff9fc0','#a9e4ff','#c8a2ff','#ffd25e'][k%4],2),Math.cos(a)*.4,.85+(k%5)*.1,Math.sin(a)*.4);}}),V('Glitter heart',g=>{ext(g,heartShape(.07),.02,glow('#ff9fc0',1.5),-.32,1.05,.2,.01);ext(g,heartShape(.05),.02,glow('#ff9fc0',1.5),.34,.95,.15,.01);}),V('Snowflakes',g=>{for(let k=0;k<8;k++){const a=k*.8;ext(g,starShape(.04,.3),.01,glow('#e6f7ff',1.6),Math.cos(a)*.42,.95+(k%3)*.12,Math.sin(a)*.42,.005);}})]}
  ]},
 cake:{title:'Birthday Cake Designer',emoji:'🎂',av:'🥳',lead:'Birthday order!',cam:[1.05,3.2,.4],done:'What a cake!',
  base(g){CY(g,.75,.7,.05,gloss('#ffffff'),0,.42,0,48);CY(g,.07,.12,.38,gloss('#ffffff'),0,.2,0,20);CY(g,.35,.4,.04,gloss('#ffffff'),0,.02,0,32);},
  tier(g,r,y,c){CY(g,r,r,.28,toy(c),0,y+.14,0,40);for(let k=0;k<16;k++){const a=k/16*Math.PI*2;SP(g,.035,toy('#ffffff'),Math.cos(a)*r,y+.28,Math.sin(a)*r,1,1.2,1);}},
  steps:[
   {ask:'Pick the bottom layer',slot:'t1',vs:['#ffc4d8','#fff1dc','#c9f0e2','#8a5a35'].map((c,i)=>V(['Strawberry','Vanilla','Pistachio','Chocolate'][i]+' layer',g=>GAMES.cake.tier(g,.6,.45,c)))},
   {ask:'Pick the middle layer',slot:'t2',vs:['#d9ccff','#ffe08a','#ffb48a','#c9e4ff'].map((c,i)=>V(['Lavender','Lemon','Peach','Blueberry'][i]+' layer',g=>GAMES.cake.tier(g,.45,.73,c)))},
   {ask:'Pick the top layer',slot:'t3',vs:['#ffffff','#ffc4d8','#c9f0e2','#fff1dc'].map((c,i)=>V(['Snow','Rose','Mint','Cream'][i]+' layer',g=>GAMES.cake.tier(g,.3,1.01,c)))},
   {ask:'Pick the drips',slot:'drip',vs:['#8a5a35','#e2457a','#ffd25e','#c8a2ff'].map((c,i)=>V(['Chocolate','Berry','Caramel','Grape'][i]+' drips',g=>{[[.6,.73],[.45,1.01],[.3,1.29]].forEach(([r,y])=>{for(let k=0;k<12;k++){const a=k/12*Math.PI*2;SP(g,.04,gloss(c),Math.cos(a)*r,y-.04-(k%3)*.02,Math.sin(a)*r,1,1.8,1);}});}))},
   {ask:'Pick the decorations',slot:'deco',vs:[V('Sugar flowers',g=>{for(let k=0;k<8;k++){const a=k/8*Math.PI*2;for(let j=0;j<5;j++){const b=j/5*Math.PI*2;SP(g,.025,toy(k%2?'#ff9fc0':'#ffffff'),Math.cos(a)*.61+Math.cos(b)*.03,.6+Math.sin(b)*.03,Math.sin(a)*.61);}}}),V('Pearls',g=>{[[.61,.55],[.46,.85],[.31,1.13]].forEach(([r,y])=>{for(let k=0;k<20;k++){const a=k/20*Math.PI*2;SP(g,.022,gloss('#ffffff'),Math.cos(a)*r,y,Math.sin(a)*r);}});}),V('Hearts',g=>{for(let k=0;k<6;k++){const a=k/6*Math.PI*2;const h=ext(g,heartShape(.05),.02,gloss(P.hot),Math.cos(a)*.62,.6,Math.sin(a)*.62,.01);h.rotation.y=-a+Math.PI/2;}}),V('Stars',g=>{for(let k=0;k<6;k++){const a=k/6*Math.PI*2;const h=ext(g,starShape(.05),.02,gloss(P.sun),Math.cos(a)*.47,.88,Math.sin(a)*.47,.01);h.rotation.y=-a+Math.PI/2;}})]},
   {ask:'Pick the candles',slot:'cand',vs:['#7cc4f2','#e2457a','#5cc6a8','#f2c94c'].map((c,i)=>V(['Sky','Pink','Mint','Gold'][i]+' candles',g=>{[-.14,0,.14].forEach((x,j)=>{CY(g,.02,.02,.2,toy(j===1?'#ffffff':c),x,1.4,j===1?.08:0,10);SP(g,.025,glow('#ffb020',2.2),x,1.53,j===1?.08:0,1,1.7,1);});}))},
   {ask:'Pick the cake topper',slot:'top',vs:[V('Gold star',g=>ext(g,starShape(.15),.04,metalM(P.gold),0,1.75,-.1,.02)),V('Big heart',g=>ext(g,heartShape(.15),.04,gloss(P.hot),0,1.72,-.1,.02)),V('Unicorn horn',g=>{const h=CO(g,.06,.32,metalM(P.gold),0,1.6,-.1);}),V('Crown',g=>{CY(g,.12,.12,.08,metalM(P.gold),0,1.5,-.1,16);for(let k=0;k<5;k++){const a=k/5*Math.PI*2;CO(g,.03,.08,metalM(P.gold),Math.cos(a)*.11,1.58,-.1+Math.sin(a)*.11);}})]},
   {ask:'Pick the party finish',slot:'fin',vs:[V('Sparklers',g=>{[-.3,.3].forEach(x=>{CY(g,.006,.006,.35,metalM(),x,1.45,.1,4);for(let k=0;k<6;k++)SP(g,.015,glow('#ffe08a',2.5),x+Math.cos(k)*.06,1.64+Math.sin(k)*.06,.1);});}),V('Balloons',g=>{balloon(g,-.8,1.6,-.2,P.hot);balloon(g,.8,1.7,-.1,P.sky);}),V('Confetti',g=>{for(let k=0;k<24;k++){const a=k*2.4;BX(g,.03,.005,.03,toy(['#ff9fc0','#a9e4ff','#ffd25e','#c8a2ff'][k%4]),Math.cos(a)*(.5+k%3*.1),.45,Math.sin(a)*(.5+k%3*.1));}}),V('Glow stars',g=>{for(let k=0;k<7;k++){const a=k*.9;ext(g,starShape(.04),.01,glow('#ffe08a',1.8),Math.cos(a)*.7,1.2+(k%3)*.15,Math.sin(a)*.5,.005);}})]}
  ]},
 dressup:{title:'Dress-Up Studio',emoji:'👗',av:'💃',lead:'Style request!',cam:[.95,2.5,.25],done:'Looking fabulous!',
  base(g){CY(g,.5,.55,.08,gloss('#ffffff'),0,.04,0,40);const d=new THREE.Group();d.position.y=.08;g.add(d);chibi(d);},
  steps:[
   {ask:'Pick the dress',slot:'dress',vs:[[P.pink,'Ballgown'],[P.mint,'Party dress'],[P.lilac,'Fairy dress'],[P.sun,'Sunshine dress']].map(([c,n])=>V(n,g=>{const y=.08;CY(g,.15,.17,.22,fabric(c),0,y+.66,0,20);const sk=CY(g,.17,n==='Ballgown'?.42:.33,.42,fabric(c),0,y+.36,0,28);if(n!=='Sunshine dress')for(let k=0;k<14;k++){const a=k/14*Math.PI*2;SP(g,.04,fabric(K.shadeHex(c,1.08)),Math.cos(a)*(n==='Ballgown'?.42:.33),y+.16,Math.sin(a)*(n==='Ballgown'?.42:.33));}SP(g,.05,toy(P.hot),0,y+.56,.16);}))},
   {ask:'Pick the shoes',slot:'shoes',vs:[[P.hot,'Ruby shoes'],['#ffffff','Glass slippers'],[P.sky,'Blue sneakers'],[P.gold,'Gold boots']].map(([c,n])=>V(n,g=>{[-1,1].forEach(k=>SP(g,.075,gloss(c),k*.09,.12,.05,1,.6,1.5));}))},
   {ask:'Pick the hair bow',slot:'hair',vs:[[P.hot,'Pink bow'],[P.sky,'Blue bow'],[P.sun,'Flower clip'],[P.lilac,'Headband']].map(([c,n])=>V(n,g=>{const y=1.32;if(n==='Flower clip'){for(let k=0;k<5;k++){const a=k/5*Math.PI*2;SP(g,.05,toy(c),.18+Math.cos(a)*.05,y-.02+Math.sin(a)*.05,.12);}SP(g,.035,toy('#ff9a4d'),.18,y-.02,.14);return;}
     if(n==='Headband'){const t=add(g,new THREE.TorusGeometry(.27,.025,8,24,Math.PI),toy(c),0,1.12,0);return;}[-1,1].forEach(k=>{const b=SP(g,.07,toy(c),k*.08,y,.0,1.3,.85,.45);b.rotation.z=k*.4;});SP(g,.03,toy(c),0,y,.02);}))},
   {ask:'Pick the necklace',slot:'neck',vs:[[P.hot,'Ruby necklace'],[P.sky,'Sapphire necklace'],['#ffffff','Pearl necklace'],[P.mint,'Emerald necklace']].map(([c,n])=>V(n,g=>{const t=add(g,new THREE.TorusGeometry(.12,.012,8,28),metalM(P.gold),0,.89,.03);t.rotation.x=Math.PI/2.4;add(g,new THREE.OctahedronGeometry(.04,0),gloss(c),0,.82,.14);}))},
   {ask:'Pick the bag',slot:'bag',vs:[[P.hot,'Heart purse'],[P.mint,'Mint handbag'],[P.sun,'Star bag'],[P.lilac,'Bunny backpack']].map(([c,n])=>V(n,g=>{if(n==='Heart purse'){ext(g,heartShape(.1),.05,toy(c),.33,.5,.05,.02);}else if(n==='Star bag'){ext(g,starShape(.1),.05,toy(c),.33,.5,.05,.02);}else RB(g,.18,.15,.07,.03,toy(c),.33,.5,.05);const st=add(g,new THREE.TorusGeometry(.07,.008,6,16,Math.PI),metalM(P.gold),.33,.58,.05);if(n==='Bunny backpack'){SP(g,.03,toy('#ffffff'),.29,.66,.05,.7,2,.7);SP(g,.03,toy('#ffffff'),.37,.66,.05,.7,2,.7);}}))},
   {ask:'Pick the magic wings',slot:'wings',vs:[[P.pink,'Fairy wings'],[P.sky,'Butterfly wings'],['#ffffff','Angel wings'],[P.lilac,'Dragonfly wings']].map(([c,n])=>V(n,g=>{const m=mat(c,.3,0,{transparent:true,opacity:.7,side:THREE.DoubleSide});[-1,1].forEach(k=>{const w=SP(g,.26,m,k*.22,.75,-.18,.8,1.2,.08);w.rotation.z=k*-.5;w.rotation.y=k*.4;const w2=SP(g,.17,m,k*.18,.45,-.16,.8,1.1,.08);w2.rotation.z=k*.5;w2.rotation.y=k*.4;});}))},
   {ask:'Pick the crown',slot:'crown',vs:[[P.gold,'Gold crown'],['#e6eaee','Silver tiara'],[P.pink,'Flower crown'],[P.lilac,'Star crown']].map(([c,n])=>V(n,g=>{const y=1.3;if(n==='Flower crown'){for(let k=0;k<9;k++){const a=k/9*Math.PI*2;SP(g,.04,toy(k%2?P.pink:'#ffffff'),Math.cos(a)*.22,y-.03,Math.sin(a)*.22);}return;}
     CY(g,.13,.14,.06,metalM(c),0,y,0,20);for(let k=0;k<5;k++){const a=k/5*Math.PI*2;if(n==='Star crown')ext(g,starShape(.04),.01,metalM(c),Math.cos(a)*.13,y+.07,Math.sin(a)*.13,.005);else CO(g,.03,.09,metalM(c),Math.cos(a)*.13,y+.07,Math.sin(a)*.13);}SP(g,.03,gloss(P.hot),0,y+.02,.14);}))},
   {ask:'Pick the magic wand',slot:'wand',vs:[[P.sun,'Star wand'],[P.hot,'Heart wand'],[P.sky,'Moon wand'],[P.lilac,'Gem wand']].map(([c,n])=>V(n,g=>{const r=CY(g,.012,.012,.42,metalM(P.gold),-.34,.6,.06,6);r.rotation.z=.3;const top=n==='Heart wand'?heartShape(.08):n==='Moon wand'?moonShape(.07):starShape(.08);if(n==='Gem wand')add(g,new THREE.OctahedronGeometry(.07,0),glow(c,1),-.4,.82,.06);else ext(g,top,.03,glow(c,1),-.4,.83,.06,.01);}))}
  ]},
 pets:{title:'Rainbow Pet Spa',emoji:'🐱',av:'🐾',lead:'Spa request!',cam:[.25,2.1,.35],done:'So pampered!',
  base(g){const tub=CY(g,.6,.55,.12,gloss('#e3f1ff'),0,.06,0,40);const k=new THREE.Group();k.position.y=.12;g.add(k);kitty(k);},
  steps:[
   {ask:'Pick the bubble bath',slot:'bath',vs:[['#c9f0ff','Ocean bubbles'],['#ffd6e6','Rose bubbles'],['#e6dcff','Lavender bubbles'],['#fff3c4','Honey bubbles']].map(([c,n])=>V(n,g=>{for(let k=0;k<14;k++){const a=k*2.4,r=.38+(k%3)*.08;const b=SP(g,.06+(k%3)*.025,mat(c,.05,.2,{transparent:true,opacity:.6}),Math.cos(a)*r,.2+(k%4)*.06,Math.sin(a)*r);b.castShadow=false;}}))},
   {ask:'Pick the bow',slot:'bow',vs:[[P.hot,'Pink bow'],[P.sky,'Blue bow'],[P.sun,'Yellow bow'],[P.mint,'Mint bow']].map(([c,n])=>V(n,g=>{[-1,1].forEach(k=>{const b=SP(g,.06,toy(c),.06+k*.07,.95,.22,1.3,.85,.45);b.rotation.z=k*.4;});SP(g,.03,toy(c),.06,.95,.24);}))},
   {ask:'Pick the collar',slot:'collar',vs:[[P.hot,'Ruby collar'],[P.lilac,'Purple collar'],[P.sky,'Sky collar'],[P.gold,'Gold collar']].map(([c,n])=>V(n,g=>{const t=add(g,new THREE.TorusGeometry(.13,.025,8,24),toy(c),0,.52,.22);t.rotation.x=Math.PI/2.2;SP(g,.035,metalM(P.gold),0,.47,.34);}))},
   {ask:'Pick the sweater',slot:'sweater',vs:[['dots','#ffc4d8','#ffffff','Polka sweater'],['stripes','#c9e4ff','#ffffff','Stripy sweater'],['hearts','#fff1dc',P.hot,'Heart sweater'],['stars','#d9ccff',P.sun,'Star sweater']].map(([k,a,b,n])=>V(n,g=>{const s=SP(g,.27,pmat(k,a,b,2),0,.37,0,1.03,.75,1.32);}))},
   {ask:'Pick the flower crown',slot:'crown',vs:[[P.pink,'Rose crown'],['#ffffff','Daisy crown'],[P.sun,'Sunflower crown'],[P.lilac,'Violet crown']].map(([c,n])=>V(n,g=>{for(let k=0;k<8;k++){const a=k/8*Math.PI*2;SP(g,.035,toy(k%2?c:'#ffffff'),Math.cos(a)*.17,.82,.24+Math.sin(a)*.17);}}))},
   {ask:'Pick the sunglasses',slot:'glasses',vs:[[P.hot,'Heart glasses'],[P.sun,'Star glasses'],['#4a2338','Cool glasses'],[P.sky,'Round glasses']].map(([c,n])=>V(n,g=>{[-1,1].forEach(k=>{const sh=n==='Heart glasses'?heartShape(.045):n==='Star glasses'?starShape(.05):null;if(sh)ext(g,sh,.01,gloss(c),k*.07,.72,.43,.005);else{const t=add(g,new THREE.TorusGeometry(.04,.01,8,20),gloss(c),k*.07,.72,.43);}});BX(g,.05,.008,.008,gloss(c),0,.73,.43);}))},
   {ask:'Pick a toy',slot:'toy',vs:[V('Yarn ball',g=>{SP(g,.1,fabric(P.hot),.5,.22,.2);for(let k=0;k<3;k++){const t=add(g,new THREE.TorusGeometry(.1,.008,6,20),fabric('#ffd6e6'),.5,.22,.2);t.rotation.set(k,k*2,0);}}),V('Bouncy ball',g=>SP(g,.09,gloss(P.sky),.5,.21,.2)),V('Toy mouse',g=>{SP(g,.07,toy('#c9c2d8'),.5,.19,.2,1.4,1,1);SP(g,.025,toy(P.pink),.46,.25,.24);CY(g,.006,.006,.15,toy(P.pink),.4,.15,.2,4).rotation.z=1.3;}),V('Feather wand',g=>{CY(g,.008,.008,.5,wood('#c08a5a'),.5,.3,.2,4).rotation.z=-.5;SP(g,.06,fabric(P.lilac),.62,.5,.2,.5,1.4,.3);})]},
   {ask:'Pick the spa sparkle',slot:'fin',vs:[V('Rainbow sparkles',g=>{for(let k=0;k<12;k++){const a=k*1.5;SP(g,.02,glow(['#ff9fc0','#a9e4ff','#c8a2ff','#ffd25e'][k%4],2),Math.cos(a)*.55,.5+(k%5)*.12,Math.sin(a)*.4);}}),V('Glow hearts',g=>{for(let k=0;k<5;k++){const a=k*1.3;ext(g,heartShape(.05),.02,glow('#ff9fc0',1.4),Math.cos(a)*.55,.8+(k%3)*.1,Math.sin(a)*.35,.01);}}),V('Bubble cloud',g=>{K.puff(g,-.5,.9,0,.8,'#eaf6ff');K.puff(g,.5,1,0,.7,'#eaf6ff');}),V('Gold stars',g=>{for(let k=0;k<6;k++){const a=k*1.1;ext(g,starShape(.05),.02,glow('#ffd25e',1.6),Math.cos(a)*.55,.9+(k%3)*.1,Math.sin(a)*.3,.01);}})]}
  ]},
 boutique:{title:'Fashion Boutique',emoji:'👛',av:'🛍️',lead:'Shop window!',cam:[.95,3.6,.18],done:'Shop window ready!',
  base(g){RB(g,2.4,1.9,.08,.02,toy('#fff1f5'),0,.95,-.55);BX(g,2.5,.08,1.2,wood('#e9c58f'),0,.04,0);[.75,1.35].forEach(y=>BX(g,.8,.05,.32,toy('#ffffff'),-.75,y,-.38));
    const man=new THREE.Group();man.position.set(.35,.08,0);g.add(man);CY(man,.03,.03,.7,metalM(P.gold),0,.35,0,8);CY(man,.18,.22,.05,metalM(P.gold),0,.02,0);CY(man,.17,.14,.42,toy('#fbe6ee'),0,.92,0,20);SP(man,.1,toy('#fbe6ee'),0,1.2,0);
    const sign=RB(g,.9,.22,.04,.05,toy(P.hot),0,1.72,-.48);},
  steps:[
   {ask:'Pick the dress',slot:'dress',vs:[[P.pink,'Rose gown'],[P.mint,'Mint dress'],[P.lilac,'Lilac dress'],[P.sun,'Lemon dress']].map(([c,n])=>V(n,g=>{CY(g,.18,.4,.55,fabric(c),.35,.68,0,24);for(let k=0;k<12;k++){const a=k/12*Math.PI*2;SP(g,.04,fabric(K.shadeHex(c,1.08)),.35+Math.cos(a)*.4,.42,Math.sin(a)*.4);}}))},
   {ask:'Pick the hat',slot:'hat',vs:[[P.pink,'Sun hat'],[P.navy,'Beret'],['#ffffff','Bow hat'],[P.sun,'Straw hat']].map(([c,n])=>V(n,g=>{CY(g,.2,.2,.02,fabric(c),-.95,.81,-.38,24);CY(g,.1,.11,.1,fabric(c),-.95,.87,-.38,20);const r=add(g,new THREE.TorusGeometry(.105,.015,6,20),toy(P.hot),-.95,.84,-.38);r.rotation.x=Math.PI/2;}))},
   {ask:'Pick the handbag',slot:'bag',vs:[[P.hot,'Ruby bag'],[P.mint,'Mint bag'],[P.sky,'Sky bag'],[P.gold,'Gold bag']].map(([c,n])=>V(n,g=>{RB(g,.22,.17,.08,.03,toy(c),-.55,.87,-.38);add(g,new THREE.TorusGeometry(.07,.01,6,16,Math.PI),metalM(P.gold),-.55,.95,-.38);}))},
   {ask:'Pick the shoes',slot:'shoes',vs:[[P.hot,'Red heels'],['#ffffff','White sneakers'],[P.lilac,'Purple flats'],[P.gold,'Gold sandals']].map(([c,n])=>V(n,g=>{[-.88,-.68].forEach(x=>SP(g,.06,gloss(c),x,1.41,-.36,1,.55,1.6));}))},
   {ask:'Pick the sunglasses',slot:'glass',vs:[[P.hot,'Heart shades'],['#4a2338','Cool shades'],[P.sun,'Star shades'],[P.sky,'Round shades']].map(([c,n])=>V(n,g=>{[-1,1].forEach(k=>{const sh=n==='Heart shades'?heartShape(.04):n==='Star shades'?starShape(.045):null;if(sh)ext(g,sh,.01,gloss(c),.35+k*.06,1.22,.1,.005);else add(g,new THREE.TorusGeometry(.035,.009,8,16),gloss(c),.35+k*.06,1.22,.1);});}))},
   {ask:'Pick the scarf',slot:'scarf',vs:[['stripes',P.pink,'#ffffff','Stripy scarf'],['dots',P.sky,'#ffffff','Dotty scarf'],['hearts','#fff1dc',P.hot,'Heart scarf'],['stars',P.lilac,P.sun,'Star scarf']].map(([k,a,b,n])=>V(n,g=>{const t=add(g,new THREE.TorusGeometry(.12,.04,10,24),pmat(k,a,b,3),.35,1.1,0);t.rotation.x=Math.PI/2;RB(g,.08,.25,.03,.02,pmat(k,a,b,1),.4,.98,.12);}))},
   {ask:'Pick the jewelry',slot:'jewel',vs:[[P.hot,'Ruby ring'],[P.sky,'Diamond ring'],[P.mint,'Emerald ring'],[P.lilac,'Amethyst ring']].map(([c,n])=>V(n,g=>{CY(g,.1,.1,.06,toy('#ffffff'),-.75,1.4,-.38,20);const t=add(g,new THREE.TorusGeometry(.04,.01,8,20),metalM(P.gold),-.75,1.48,-.38);add(g,new THREE.OctahedronGeometry(.03,0),gloss(c),-.75,1.53,-.38);}))},
   {ask:'Pick the shop sign',slot:'sign',vs:[V('Hearts sign',g=>{for(let k=0;k<5;k++)ext(g,heartShape(.05),.02,gloss('#ffffff'),-.3+k*.15,1.72,-.44,.01);}),V('Stars sign',g=>{for(let k=0;k<5;k++)ext(g,starShape(.05),.02,gloss(P.sun),-.3+k*.15,1.72,-.44,.01);}),V('Sparkle lights',g=>{for(let k=0;k<9;k++)SP(g,.03,glow(['#ffd27a','#ff9fc0','#a9e4ff'][k%3],1.8),-1.1+k*.275,1.88,-.48);}),V('Flower garland',g=>{for(let k=0;k<11;k++)SP(g,.045,toy(k%2?P.pink:'#ffffff'),-1.15+k*.23,1.86,-.5);})]}
  ]},
 aquarium:{title:'Aquarium Rescue',emoji:'🐠',av:'🐬',lead:'Ocean rescue!',cam:[.7,3.4,.22],done:'A happy aquarium!',
  base(g){RB(g,2.1,.14,1.1,.03,wood('#c08a5a'),0,.07,0);const w=BX(g,2.0,1.15,1.0,mat('#7cc8f0',.05,.1,{transparent:true,opacity:.35}),0,.72,0);w.castShadow=false;w.renderOrder=2;BX(g,1.98,.12,.98,mat('#f2dfae',1),0,.2,0);
    [[-.8,.3],[.7,-.3]].forEach(([x,z])=>SP(g,.07,mat('#c9c2b8',.9),x,.27,z,1.3,.7,1));const lid=RB(g,2.06,.06,1.06,.02,toy(P.sky),0,1.32,0);},
  fishAnim:true,
  steps:[
   ...[0,1,2].map(i=>({ask:'Rescue a fish',slot:'fish'+i,anim:'swim',vs:[['#ff8a3d','#ffffff','Clownfish'],['#ffd25e','#7cc4f2','Sunny fish'],['#c8a2ff','#ff9fc0','Purple fish'],['#7cc4f2','#ffd25e','Blue tang']].map(([a,b,n])=>V(n,g=>{const f=new THREE.Group();f.position.set(0,.75+i*.15,0);g.add(f);fish(f,a,b);f.userData.swim={r:.55-i*.1,s:.6+i*.25,y:.65+i*.17,ph:i*2};}))})),
   {ask:'Pick the coral',slot:'coral',vs:[[P.hot,'Pink coral'],['#ff9a4d','Orange coral'],[P.lilac,'Purple coral'],['#ffd25e','Yellow coral']].map(([c,n])=>V(n,g=>{for(let k=0;k<6;k++){const b=CY(g,.03,.04,.25+(k%3)*.08,toy(c),-.6+Math.cos(k*1.3)*.12,.35,.2+Math.sin(k*1.3)*.12,8);b.rotation.z=(k%3-1)*.4;SP(g,.04,toy(c),b.position.x+(k%3-1)*.06,.48+(k%3)*.05,b.position.z);}}))},
   {ask:'Pick the castle',slot:'castle',vs:[[P.pink,'Pink castle'],['#ffffff','Pearl castle'],[P.sky,'Sky castle'],[P.sun,'Sand castle']].map(([c,n])=>V(n,g=>{BX(g,.35,.3,.25,toy(c),.55,.4,-.2);[-1,1].forEach(k=>{CY(g,.07,.07,.42,toy(c),.55+k*.18,.46,-.2,12);CO(g,.09,.15,toy(P.hot),.55+k*.18,.75,-.2);});CY(g,.06,.06,.02,mat('#2a3d5a',.9),.55,.35,-.07,16).rotation.x=Math.PI/2;}))},
   {ask:'Pick the seaweed',slot:'weed',vs:[['#5fb06a','Green seaweed'],['#4fb3a0','Sea grass'],['#9bd06a','Kelp forest'],['#3e8a4c','Ocean ferns']].map(([c,n])=>V(n,g=>{for(let k=0;k<6;k++){const x=-.9+k*.12,h=.4+(k%3)*.15;for(let j=0;j<4;j++)SP(g,.04,toy(c),x+Math.sin(j*1.5)*.03,.3+j*h/4,-.35,.7,1.6,.5);}}))},
   {ask:'Pick the shells',slot:'shell',vs:[[P.pink,'Pink shells'],['#ffffff','Pearl shells'],[P.peach,'Peach shells'],[P.lilac,'Purple shells']].map(([c,n])=>V(n,g=>{[[-.2,.3],[.15,.32],[.35,.25]].forEach(([x,z])=>{for(let k=0;k<5;k++){const a=Math.PI*(k/4);const r=SP(g,.04,toy(c),x+Math.cos(a)*.05,.28+Math.sin(a)*.05,z,.5,1.3,.4);r.rotation.z=a-Math.PI/2;}SP(g,.02,gloss('#ffffff'),x,.29,z+.02);});}))},
   {ask:'Pick a sea friend',slot:'friend',vs:[V('Sea turtle',g=>{const t=new THREE.Group();t.position.set(-.3,.95,0);g.add(t);SP(t,.14,toy('#6fbf7f'),0,0,0,1.3,.5,1);SP(t,.06,toy('#9bd06a'),.2,0,0);[-1,1].forEach(k=>SP(t,.05,toy('#9bd06a'),.05,0,k*.14,1.4,.3,.6));t.userData.swim={r:.4,s:.3,y:.95,ph:1};}),V('Starfish',g=>{const s=ext(g,starShape(.13,.5),.04,toy('#ff9a7a'),-.1,.29,.3,.02);s.rotation.x=-Math.PI/2;}),V('Octopus',g=>{SP(g,.13,toy(P.lilac),.1,.45,.1);for(let k=0;k<6;k++){const a=k/6*Math.PI*2;SP(g,.035,toy(P.lilac),.1+Math.cos(a)*.13,.3,.1+Math.sin(a)*.13,1,2,1);}face(g,.1,.47,.22,.8);}),V('Seahorse',g=>{SP(g,.07,toy(P.sun),.0,.7,.1,1,1.6,.8);SP(g,.06,toy(P.sun),.04,.86,.1);CO(g,.03,.08,toy(P.sun),.1,.86,.1).rotation.z=-Math.PI/2;add(g,new THREE.TorusGeometry(.05,.02,6,12,Math.PI*1.3),toy(P.sun),-.02,.55,.1);})]},
   {ask:'Pick the bubbles',slot:'bub',vs:[V('Bubble stream',g=>{for(let k=0;k<8;k++){const b=SP(g,.03+k*.005,mat('#e6f7ff',.05,.2,{transparent:true,opacity:.6}),.75,.35+k*.12,.2);b.castShadow=false;b.userData.rise=k;}}),V('Treasure chest',g=>{RB(g,.25,.15,.16,.02,wood('#a8744a'),-.75,.33,.1);const lid=RB(g,.25,.06,.16,.03,wood('#8a5a35'),-.75,.44,.03);lid.rotation.x=-.7;SP(g,.04,glow('#ffd25e',1.5),-.75,.42,.1);}),V('Glow pearls',g=>{for(let k=0;k<5;k++)SP(g,.03,glow('#ffffff',1),-.3+k*.15,.28,-.1);}),V('Pirate ship',g=>{RB(g,.4,.12,.15,.04,wood('#8a5a35'),.0,.3,-.3);CY(g,.01,.01,.35,wood('#8a5a35'),0,.5,-.3,4);const s=BX(g,.18,.2,.01,toy('#ffffff'),.05,.55,-.3);})]}
  ]},
 giftwrap:{title:'Gift Wrap Workshop',emoji:'🎁',av:'🎀',lead:'Gift order!',cam:[.7,2.6,.4],done:'Perfectly wrapped!',
  base(g){RB(g,1.6,.05,1.1,.02,wood('#e9c58f'),0,.025,0);g.userData.box=new THREE.Group();g.add(g.userData.box);RB(g.userData.box,.7,.55,.6,.03,toy('#d9b07a'),0,.33,0);},
  steps:[
   {ask:'Pick the wrapping paper',slot:'paper',vs:[['dots',P.pink,'#ffffff','Polka paper'],['stripes',P.sky,'#ffffff','Stripy paper'],['hearts','#fff1dc',P.hot,'Heart paper'],['stars',P.lilac,P.sun,'Star paper']].map(([k,a,b,n])=>V(n,g=>RB(g,.72,.57,.62,.03,pmat(k,a,b,1.5),0,.33,0)))},
   {ask:'Pick the ribbon',slot:'ribbon',vs:[[P.hot,'Pink ribbon'],[P.gold,'Gold ribbon'],[P.mint,'Mint ribbon'],['#ffffff','White ribbon']].map(([c,n])=>V(n,g=>{const m=c===P.gold?metalM(c):gloss(c);BX(g,.74,.59,.08,m,0,.33,0);BX(g,.08,.59,.64,m,0,.33,0);}))},
   {ask:'Pick the bow',slot:'bow',vs:[[P.hot,'Big pink bow'],[P.gold,'Gold bow'],[P.mint,'Mint bow'],[P.sky,'Sky bow']].map(([c,n])=>V(n,g=>{const m=c===P.gold?metalM(c):gloss(c);[-1,1].forEach(k=>{const b=SP(g,.13,m,k*.12,.7,0,1.4,.8,.5);b.rotation.z=k*.5;const t=SP(g,.05,m,k*.08,.62,.08,.6,1.6,.3);});SP(g,.06,m,0,.7,0);}))},
   {ask:'Pick the gift tag',slot:'tag',vs:[[P.sun,'Star tag'],[P.pink,'Heart tag'],['#ffffff','Cloud tag'],[P.mint,'Leaf tag']].map(([c,n])=>V(n,g=>{const sh=n==='Star tag'?starShape(.08):n==='Heart tag'?heartShape(.08):null;if(sh)ext(g,sh,.015,toy(c),.42,.4,.31,.005);else if(n==='Cloud tag')K.puff(g,.42,.42,.31,.35,c);else{const l=SP(g,.08,toy(c),.42,.4,.31,.6,1,.15);}CY(g,.004,.004,.2,metalM(),.38,.55,.31,4).rotation.z=.5;}))},
   {ask:'Pick the stickers',slot:'stick',vs:[[P.hot,'Heart stickers'],[P.sun,'Star stickers'],[P.lilac,'Moon stickers'],[P.mint,'Flower stickers']].map(([c,n])=>V(n,g=>{[[-.22,.5],[.2,.2],[-.15,.15]].forEach(([x,y])=>{const sh=n==='Heart stickers'?heartShape(.05):n==='Star stickers'?starShape(.05):n==='Moon stickers'?moonShape(.04):starShape(.05,.8);ext(g,sh,.005,gloss(c),x,y,.315,.003);});}))},
   {ask:'Pick the little gift',slot:'small',vs:[['dots',P.mint,'#ffffff','Mint present'],['stripes',P.sun,'#ffffff','Lemon present'],['hearts','#ffffff',P.hot,'Love present'],['stars',P.navy,P.sun,'Night present']].map(([k,a,b,n])=>V(n,g=>{RB(g,.36,.3,.32,.02,pmat(k,a,b,1),.62,.18,.2);BX(g,.38,.31,.04,gloss(P.hot),.62,.18,.2);BX(g,.04,.31,.34,gloss(P.hot),.62,.18,.2);SP(g,.05,gloss(P.hot),.62,.36,.2);}))},
   {ask:'Pick a balloon',slot:'bal',vs:[[P.hot,'Red balloon'],[P.sky,'Blue balloon'],[P.sun,'Yellow balloon'],[P.lilac,'Purple balloon']].map(([c,n])=>V(n,g=>balloon(g,-.45,1.35,0,c)))},
   {ask:'Pick the magic finish',slot:'fin',vs:[V('Gold glitter',g=>{for(let k=0;k<12;k++){const a=k*1.5;SP(g,.016,glow('#ffd25e',2),Math.cos(a)*.5,.3+(k%5)*.12,Math.sin(a)*.45);}}),V('Confetti',g=>{for(let k=0;k<26;k++){const a=k*2.4;BX(g,.03,.005,.03,toy(['#ff9fc0','#a9e4ff','#ffd25e','#c8a2ff'][k%4]),Math.cos(a)*(.5+k%3*.1),.06,Math.sin(a)*(.4+k%3*.06));}}),V('Glow hearts',g=>{for(let k=0;k<5;k++){const a=k*1.3;ext(g,heartShape(.05),.02,glow('#ff9fc0',1.4),Math.cos(a)*.6,.7+(k%3)*.12,Math.sin(a)*.3,.01);}}),V('Snow sparkles',g=>{for(let k=0;k<8;k++){const a=k*.8;ext(g,starShape(.035,.3),.01,glow('#e6f7ff',1.6),Math.cos(a)*.6,.6+(k%3)*.15,Math.sin(a)*.35,.005);}})]}
  ]},
 garden:{title:'Magic Garden',emoji:'🌷',av:'🧚',lead:'Garden wish!',cam:[.55,3.5,.5],done:'A blooming garden!',
  base(g){const w=wood('#b47c4c');RB(g,2.2,.25,1.2,.03,w,0,.125,0);BX(g,2.05,.06,1.05,mat('#6b4a32',1),0,.24,0);for(let k=0;k<8;k++){const x=-.78+(k%4)*.52,z=k<4?-.25:.25;CY(g,.08,.08,.02,mat('#5a3d28',1),x,.27,z,16);}
    CY(g,.03,.03,1.1,wood('#c08a5a'),1.25,.55,-.4,8);RB(g,.3,.2,.03,.03,toy('#fff4e6'),1.25,1.0,-.39);},
  steps:[0,1,2,3,4,5,6,7].map(i=>({ask:'Plant a magic flower',slot:'f'+i,anim:'grow',vs:[V('Tulip',fl=>flower(fl,i,'tulip')),V('Sunflower',fl=>flower(fl,i,'sun')),V('Daisy',fl=>flower(fl,i,'daisy')),V('Rose',fl=>flower(fl,i,'rose')),V('Lavender',fl=>flower(fl,i,'lav')),V('Bluebell',fl=>flower(fl,i,'bell'))]}))},
 claw:{title:'Claw Machine',emoji:'🕹️',av:'🎟️',lead:'Prize pick!',cam:[.45,3.6,.2],done:'Prize collection!',
  base(g){const pk=toy(P.hot);RB(g,1.5,.7,1.0,.06,pk,0,.35,0);const gl=BX(g,1.4,1.2,.92,mat('#dff3ff',.05,0,{transparent:true,opacity:.22}),0,1.3,0);gl.castShadow=false;gl.renderOrder=3;
    [-1,1].forEach(a=>[-1,1].forEach(b=>RB(g,.06,1.2,.06,.02,toy('#ffffff'),a*.7,1.3,b*.46)));RB(g,1.55,.25,1.05,.05,pk,0,2.0,0);RB(g,.9,.16,.04,.04,toy(P.sun),0,2.0,.53);
    BX(g,.36,.04,.36,mat('#3a2a3a',.9),-.5,.72,.25);RB(g,.4,.25,.25,.04,toy('#ffffff'),.45,.5,.55);CY(g,.02,.02,.14,metalM(),.35,.7,.55,8);SP(g,.05,gloss(P.red),.35,.78,.55);SP(g,.04,gloss(P.sky),.55,.66,.62);
    for(let k=0;k<12;k++){const p=new THREE.Group();p.position.set(-.3+(k%4)*.25,.78+Math.floor(k/4)*.09,-.3+Math.floor(k/4)*.18);p.scale.setScalar(.5);g.add(p);plush(p,k%6);}
    const claw=new THREE.Group();claw.position.set(.45,1.75,0);g.add(claw);CY(claw,.006,.006,.3,metalM(),0,.15,0,4);CY(claw,.05,.06,.06,metalM('#dfe6ea'),0,0,0,12);g.userData.prongs=[];for(let k=0;k<3;k++){const a=k/3*Math.PI*2;const pr=new THREE.Group();pr.position.set(Math.cos(a)*.04,-.02,Math.sin(a)*.04);pr.rotation.y=-a;claw.add(pr);const r=CY(pr,.01,.01,.16,metalM('#dfe6ea'),.03,-.07,0,6);r.rotation.z=.5;g.userData.prongs.push(pr);}
    g.userData.claw=claw;const tray=new THREE.Group();tray.position.set(0,0,.0);g.add(tray);g.userData.won=0;},
  steps:[0,1,2,3,4,5,6,7].map(i=>({ask:'Grab a prize',slot:'p'+i,anim:'claw',vs:["Bunny plush","Teddy plush","Star plush","Duck plush","Kitty plush","Unicorn plush","Panda plush","Frog plush","Penguin plush","Fox plush","Rainbow bear","Sleepy koala","Pink puppy","Baby dragon","Moon plush","Happy cloud","Heart plush","Dinosaur plush"].map((name,k)=>V(name,g=>{const p=new THREE.Group();g.add(p);plush(p,k%6);p.userData.prize=i;}))}))},
 quest:{title:'Adventure Missions',emoji:'🗺️',av:'🧭',lead:'Mission!',cam:[.4,4.2,.5],done:'Adventure complete!',
  base(g){for(let k=0;k<9;k++){const p=QP(k);const isl=new THREE.Group();isl.position.set(p[0],0,p[1]);g.add(isl);CY(isl,.32,.22,.25,mat('#c9a27e',.95),0,-.1,0,16);CY(isl,.34,.34,.06,toy(k===8?P.lilac:'#7cc46f'),0,.04,0,20);if(k%3===1){SP(isl,.08,toy('#4f9e5b'),.2,.12,-.1);}}
    const c=new THREE.Group();const p8=QP(8);c.position.set(p8[0],.07,p8[1]);g.add(c);BX(c,.4,.3,.3,toy('#f3e6ff'),0,.15,0);[-1,1].forEach(k=>{CY(c,.07,.07,.45,toy('#f3e6ff'),k*.2,.22,0,12);CO(c,.09,.18,toy(P.hot),k*.2,.54,0);});
    const hero=new THREE.Group();hero.scale.setScalar(.45);const p0=QP(0);hero.position.set(p0[0],.07,p0[1]);g.add(hero);chibi(hero,{hair:'#3a2a20'});g.userData.hero=hero;g.userData.at=0;
    const W2=mat('#7cc8f0',.1,.1,{transparent:true,opacity:.85});const sea=add(g,new THREE.PlaneGeometry(9,9),W2,0,-.12,0);sea.rotation.x=-Math.PI/2;sea.castShadow=false;},
  steps:[0,1,2,3,4,5,6,7].map(i=>({ask:'Find the treasure',slot:'q'+i,anim:'hop',vs:[V('Magic key',g=>{const p=QP(i+1);const k=new THREE.Group();k.position.set(p[0]+.18,.15,p[1]);g.add(k);add(k,new THREE.TorusGeometry(.05,.015,8,16),metalM(P.gold),0,.1,0);BX(k,.015,.1,.015,metalM(P.gold),0,.02,0);}),V('Shiny gem',g=>{const p=QP(i+1);add(g,new THREE.OctahedronGeometry(.07,0),glow('#c9b8ff',.8),p[0]+.18,.2,p[1]);}),V('Gold star',g=>{const p=QP(i+1);ext(g,starShape(.07),.02,metalM(P.gold),p[0]+.18,.22,p[1],.01);}),V('Treasure chest',g=>{const p=QP(i+1);RB(g,.16,.1,.1,.02,wood('#a8744a'),p[0]+.18,.12,p[1]);SP(g,.025,glow('#ffd25e',1.5),p[0]+.18,.19,p[1]);}),V('Rainbow flag',g=>{const p=QP(i+1);CY(g,.006,.006,.3,metalM(),p[0]+.18,.22,p[1],4);BX(g,.12,.07,.01,toy(P.hot),p[0]+.24,.32,p[1]);})]}))}
};
function QP(k){const pts=[[-1.6,1.2],[-.8,1.4],[0,1.0],[.8,1.3],[1.6,.7],[1.0,0],[.1,-.3],[-.8,-.6],[0,-1.4]];return pts[k];}
function flower(g,i,kind){const x=-.78+(i%4)*.52,z=i<4?-.25:.25;const f=new THREE.Group();f.position.set(x,.27,z);g.add(f);f.userData.grow=1;f.scale.setScalar(1.3);
  const stem=toy('#5fb06a');CY(f,.015,.018,.45,stem,0,.22,0,6);const l=SP(f,.07,stem,.06,.18,0,.4,1,.15);l.rotation.z=-.6;const y=.47;
  if(kind==='tulip'){CO(f,.08,.16,toy(P.red),0,y+.02,0).rotation.x=Math.PI;for(let k=0;k<3;k++){const a=k/3*Math.PI*2;SP(f,.06,toy(P.red),Math.cos(a)*.03,y+.04,Math.sin(a)*.03,.7,1.2,.7);}}
  else if(kind==='sun'){CY(f,.07,.07,.04,toy(P.choc),0,y+.05,.02,16).rotation.x=1.2;for(let k=0;k<10;k++){const a=k/10*Math.PI*2;const p=SP(f,.05,toy(P.sun),Math.cos(a)*.1,y+.05+Math.sin(a)*.1*.36,.02+Math.sin(a)*.1*.93,1,.3,.6);}}
  else if(kind==='daisy'){for(let k=0;k<8;k++){const a=k/8*Math.PI*2;SP(f,.04,toy('#ffffff'),Math.cos(a)*.07,y+.03,Math.sin(a)*.07,1,.3,.55).rotation.y=-a;}SP(f,.035,toy(P.sun),0,y+.04,0,1,.6,1);}
  else if(kind==='rose'){for(let k=0;k<3;k++)add(f,new THREE.TorusGeometry(.05-k*.014,.025,8,16),toy(k%2?'#ff8fb2':P.hot),0,y+k*.03,0).rotation.x=Math.PI/2;SP(f,.02,toy(P.hot),0,y+.09,0);}
  else if(kind==='lav'){for(let k=0;k<7;k++)SP(f,.025,toy(P.lilac),0,y-.05+k*.04,0,1,1,1);}
  else{for(let k=0;k<3;k++){const b=add(f,new THREE.SphereGeometry(.04,12,10,0,Math.PI*2,0,Math.PI*.6),mat('#7c9cf2',.5,0,{side:THREE.DoubleSide}),.05*(k-1),y-.03*k,0);b.rotation.x=Math.PI;}}
}
function plush(g,k){const col=['#ffffff','#c98b5e',P.sun,P.sun,'#f0a061','#fbf6ff'][k];const f=fabric(col);
  if(k===2){ext(g,starShape(.22,.5),.12,f,0,.25,0,.05);face(g,0,.27,.12,1.2);return;}
  SP(g,.22,f,0,.2,0,1,.9,1);SP(g,.18,f,0,.5,.03);face(g,0,.5,.2,1.1);
  if(k===0)[-1,1].forEach(s=>SP(g,.05,f,s*.08,.75,0,.8,2.4,.6));
  if(k===1||k===4)[-1,1].forEach(s=>{if(k===1)SP(g,.06,f,s*.14,.65,0);else CO(g,.06,.12,f,s*.11,.7,0);});
  if(k===3){CO(g,.05,.12,gloss('#ff9a4d'),0,.47,.24).rotation.x=Math.PI/2;}
  if(k===5){CO(g,.035,.18,metalM(P.gold),0,.75,.06);SP(g,.05,fabric(P.lilac),0,.62,-.14);}}

/* ================= renderer & scene ================= */
let R=null,scene=null,cam=null,stageEl=null,root=null,anims=[],looping=false,az=.5,azT=.5,el=.38,camCfg=[.8,3,.4],dragCam=null;
let SNAP=null;
function ensure(){
  if(R)return;R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(1.75,devicePixelRatio||1));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.08;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
  cam=new THREE.PerspectiveCamera(36,1,.05,80);const cv=R.domElement;
  cv.addEventListener('pointerdown',e=>{dragCam={x:e.clientX,y:e.clientY};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener('pointermove',e=>{if(!dragCam)return;azT-= (e.clientX-dragCam.x)*.008;el=cl(el+(e.clientY-dragCam.y)*.004,.05,1.1);dragCam={x:e.clientX,y:e.clientY};});
  ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>{dragCam=null;}));
}
function newScene(def){
  scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xffffff,0xffd9e4,.72));
  const key=new THREE.DirectionalLight(0xfff3e6,1.1);key.position.set(3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=5;key.shadow.bias=-.0008;key.shadow.normalBias=.02;const c=key.shadow.camera;c.left=-4;c.right=4;c.top=4;c.bottom=-4;c.far=30;scene.add(key);
  const rim=new THREE.DirectionalLight(0xffc4dd,.5);rim.position.set(-4,3,-4);scene.add(rim);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.2}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  root=new THREE.Group();scene.add(root);root.userData.slots={};def.base.call(def,root);root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  camCfg=def.cam;az=azT=.5;el=camCfg[2];anims=[];
}
function mountStage(el2){ensure();stageEl=el2;el2.prepend(R.domElement);resize();if(!looping){looping=true;requestAnimationFrame(loop);}}
function resize(){if(!R||!stageEl)return;const w=stageEl.clientWidth,h=stageEl.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
window.addEventListener('resize',resize);
function loop(t){
  if(!R||!R.domElement.isConnected||!scene){looping=false;return;}requestAnimationFrame(loop);
  const now=performance.now();if(!dragCam)azT+=Math.sin(now/2600)*.0009;az+=(azT-az)*.08;
  const [ty,dist]=camCfg;const d=dist*(cam.aspect<.8?1.22:1);const hr=root&&root.userData.hero;const lx=hr?hr.position.x*.7:0,lz=hr?hr.position.z*.7:0;cam.position.set(lx+Math.sin(az)*Math.cos(el)*d,ty+Math.sin(el)*d,lz+Math.cos(az)*Math.cos(el)*d);cam.lookAt(lx,ty,lz);
  anims=anims.filter(a=>{const p=cl((now-a.t0)/a.dur,0,1);a.fn(p);return p<1;});
  root.traverse(o=>{
    if(o.userData.pop){const p=cl((now-o.userData.pop)/520,0,1);const s=p<1?1+Math.sin(p*Math.PI)*.18*(1-p)+(p<.35?(p/.35)-1:0):1;o.scale.setScalar(Math.max(.001,p<.35?p/.35*1.1:s));if(p>=1){o.scale.setScalar(1);delete o.userData.pop;}}
    if(o.userData.swim){const s=o.userData.swim,a=now/1000*s.s+s.ph;o.position.set(Math.cos(a)*s.r,s.y+Math.sin(a*2)*.05,Math.sin(a)*s.r*.6);o.rotation.y=-a-Math.PI/2;}
    if(o.userData.rise!==undefined){o.position.y=.35+((now/1000*.25+o.userData.rise*.12)%1)*.95;}
  });
  R.render(scene,cam);
}
function tween(dur,fn){return new Promise(res=>{anims.push({t0:performance.now(),dur,fn:p=>{fn(p);if(p>=1)res();}});});}
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;

/* thumbnails of a piece */
function snapRig(){if(SNAP)return SNAP;const cv=document.createElement('canvas');cv.width=cv.height=220;const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(220,220,false);r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.12;r.setClearColor(0,0);
  const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0xffd9e4,.85));const k=new THREE.DirectionalLight(0xfff3e6,1.1);k.position.set(3,6,5);s.add(k);const rim=new THREE.DirectionalLight(0xffc4dd,.5);rim.position.set(-4,3,-4);s.add(rim);
  SNAP={r,s,c:new THREE.PerspectiveCamera(30,1,.01,50)};return SNAP;}
const snapCache={};
function snap(key,build){if(snapCache[key])return snapCache[key];const {r,s,c}=snapRig();const g=new THREE.Group();build(g);s.add(g);g.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(g);if(box.isEmpty()){s.remove(g);return '';}const size=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3());
  const rad=Math.max(size.x,size.y,size.z)*.62+.02,d=rad/Math.sin(c.fov*Math.PI/360);c.position.set(ctr.x+Math.sin(.5)*d*.94,ctr.y+d*.32,ctr.z+Math.cos(.5)*d*.94);c.lookAt(ctr);c.updateProjectionMatrix();
  r.render(s,c);const u=r.domElement.toDataURL('image/png');s.remove(g);snapCache[key]=u;return u;}

/* ================= game flow ================= */
const IDS=Object.keys(GAMES);
let S=null;
function words(){const W=G('W')||[];const idsFn=G('ids');const pool=typeof idsFn==='function'?idsFn():W.map((_,i)=>i);return {W,pool};}
function studioWebGLAvailable(){
  /* The 3D library is lazy-loaded by K.loadThree; do not treat its absence at menu time as lack of WebGL. */
  try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2')||canvas.getContext('webgl')||canvas.getContext('experimental-webgl');const available=!!gl;try{gl&&gl.getExtension('WEBGL_lose_context')?.loseContext();}catch(_){}return available;}catch(_){return false;}
}
function startStudio(id){
  if(!studioWebGLAvailable())return false;
  const def=GAMES[id];const {W,pool}=words();if(!def||!W.length)return false;busy=false;
  try{const a=G('audio');a&&a('tap');}catch(_){}
  SET(`game=${JSON.stringify(id)};round=(typeof round==='number'?round+1:1);`);
  const order=(window.RikiProgress&&window.RikiProgress.pick)?window.RikiProgress.pick(pool,def.steps.length):shuffle(pool).slice(0,def.steps.length);
  S={id,def,order,at:0,score:0,missed:[],tries:0,picks:[]};
  window.__stSession={order,at:0,score:0,missed:[],done:false};SET('session=window.__stSession;');
  const run=S;K.loadThree(()=>{if(S!==run||G('game')!==id)return;newScene(def);renderStep();},()=>{const app=document.getElementById('app');if(app)app.innerHTML='<section class="panel"><p>This game needs an internet connection to load its 3D pictures.</p></section>';});
  return true;
}
function frameHTML(body,pct){const fr=G('frame');if(typeof fr==='function'){fr(`${S.def.emoji} ${S.def.title}`,body,pct);return;}document.getElementById('app').innerHTML=body;}
function renderStep(){
  if(!S||G('game')!==S.id)return;
  const {def,at,order}=S;const {W,pool}=words();const step=def.steps[at];const id=order[at];const w=W[id];
  const four=!!(window.RikiProgress&&window.RikiProgress.mastered(id));const nOther=S.id==='claw'?5:(four?3:2);
  const others=shuffle(pool.filter(x=>x!==id)).slice(0,nOther);const choiceIds=shuffle([id,...others]);
  let variants=shuffle(step.vs).slice(0,choiceIds.length);while(variants.length<choiceIds.length)variants.push(step.vs[variants.length%step.vs.length]);
  const flip=at%2===1;
  S.cur={id,choiceIds,variants,step,first:true};
  const dots=def.steps.map((_,i)=>`<i class="${i<at?'on':i===at?'now':''}"></i>`).join('');
  const ask=S.id==='claw'?`<small>Choose the plush you want to win!</small><b>The prize will reveal your Hebrew root.</b>`:flip?`<small>${def.lead} Find the Hebrew word for</small><b>${esc(w[1])}</b>`:`<small>${def.lead} I would love</small><div class="st-he" lang="he">${esc(w[0])}</div>`;
  const cards=choiceIds.map((cid,i)=>{const v=variants[i];return `<button type="button" class="st-card" data-i="${i}" aria-label="${esc(S.id==='claw'?v.name:(flip?W[cid][0]:W[cid][1]))}"><div class="ph">${S.id==='claw'?['🐰','🧸','⭐','🦆','🐱','🦄','🐼','🐸','🐧','🦊','🌈','🐨','🐶','🐉','🌙','☁️','💗','🦕'][Math.max(0,step.vs.findIndex(x=>x.name===v.name))%18]:'✨'}</div>${S.id==='claw'?`<span>${esc(v.name)}</span>`:flip?`<span class="st-he" lang="he">${esc(W[cid][0])}</span>`:`<span>${esc(W[cid][1])}</span>`}</button>`;}).join('');
  const body=`<div class="st"><div class="st-order"><div class="st-av" aria-hidden="true">${window.RikiArt?(S.id==='pets'?window.RikiArt.pet(window.RikiPlay.state().pet):window.RikiArt.doll(window.RikiArt.look(window.RikiPlay.state().doll),'stand','happy',true)):def.av}</div><div class="st-bub">${ask}</div></div>
   <div class="st-stage" id="stStage"><div class="st-burst" id="stBurst"></div></div>
   <div class="st-dots" aria-label="Step ${at+1} of ${def.steps.length}">${dots}</div>
   <p class="st-ask">${esc(step.ask)} — tap it or drag it up.</p>
   <div class="st-cards${four||S.id==='claw'?' four':''}">${cards}</div>${four&&S.id!=='claw'?'<p class="st-ask">⭐ You know this word! Now there are 4 choices.</p>':''}
   <p class="st-hint" id="stHint" hidden></p></div>`;
  frameHTML(body,Math.round(at/def.steps.length*100));
  mountStage(document.getElementById('stStage'));
  requestAnimationFrame(()=>{document.querySelectorAll('.st-card').forEach((b,i)=>{const v=variants[i];const u=snap(def.title+'|'+step.slot+'|'+v.name,v.build);const ph=b.querySelector('.ph');if(u&&ph){const im=new Image();im.alt='';im.src=u;ph.replaceWith(im);}});});
  bindCards();
}
function bindCards(){
  const stage=document.getElementById('stStage');
  document.querySelectorAll('.st-card').forEach(b=>{
    let d=null,ghost=null;
    b.addEventListener('pointerdown',e=>{d={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};});
    b.addEventListener('pointermove',e=>{if(!d||d.id!==e.pointerId)return;if(!d.moved&&Math.hypot(e.clientX-d.x,e.clientY-d.y)>10){d.moved=true;try{b.setPointerCapture(e.pointerId)}catch(_){}ghost=document.createElement('div');ghost.className='st-ghost';const im=b.querySelector('img');ghost.innerHTML=im?`<img src="${im.src}" alt="">`:'✨';document.body.appendChild(ghost);}
      if(d.moved){e.preventDefault();ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const r=stage.getBoundingClientRect();stage.classList.toggle('drop',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom);}});
    const end=e=>{if(!d||d.id!==e.pointerId)return;const moved=d.moved;d=null;if(ghost){ghost.remove();ghost=null;}stage.classList.remove('drop');
      if(moved){const r=stage.getBoundingClientRect();if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom)choose(b);}};
    b.addEventListener('pointerup',end);b.addEventListener('pointercancel',()=>{d=null;ghost&&ghost.remove();ghost=null;stage.classList.remove('drop');});
    b.addEventListener('click',()=>choose(b));
  });
}
let busy=false;
async function choose(b){
  const run=S;if(!run||G('game')!==run.id)return;

  if(busy||b.classList.contains('bad'))return;const i=+b.dataset.i;const {id,choiceIds,variants,step}=S.cur;
  const {W}=words();
  if(S.id==='claw'){
    busy=true;b.classList.add('good');
    await applyPiece(step,variants[i]);if(S!==run||G('game')!==run.id)return;
    const reveal=document.getElementById('stHint');
    if(reveal){reveal.hidden=false;reveal.innerHTML=`🎁 <b>${esc(variants[i].name)}</b> — <b lang="he" class="st-he">${esc(W[id][0])}</b>. ${esc(W[id][2]||'')}`;}
    S.picks.push(variants[i].name);
    const question=document.createElement('div');question.className='st-claw-question';
    question.innerHTML=`<p><b lang="he" class="st-he">${esc(W[id][0])}</b> — What does this shoresh mean?</p>`+
      shuffle([id,...shuffle(words().pool.filter(x=>x!==id)).slice(0,2)]).map(cid=>`<button type="button" class="st-claw-answer" data-root="${cid}">${esc(W[cid][1])}</button>`).join('');
    const hint=document.getElementById('stHint');if(hint){hint.after(question);}
    question.querySelectorAll('.st-claw-answer').forEach(answer=>answer.addEventListener('click',()=>{
      if(+answer.dataset.root!==id){answer.disabled=true;answer.textContent+=' — try again';return;}
      question.remove();try{const cor=G('correct');cor&&cor(3);}catch(_){}
      S.score+=3;if(window.__stSession)window.__stSession.score=S.score;
      S.at++;if(window.__stSession)window.__stSession.at=S.at;
      setTimeout(()=>{if(S!==run||G('game')!==run.id)return;busy=false;if(S.at>=S.def.steps.length)finishStudio();else renderStep();},700);
    }));
    return;
  }
  if(choiceIds[i]!==id){b.classList.add('bad');S.cur.first=false;try{const inc=G('incorrect');inc&&inc();}catch(_){}
    const h=document.getElementById('stHint');if(h){h.hidden=false;h.innerHTML=`💡 <b lang="he" class="st-he" style="font-size:1.2rem">${esc(W[id][0])}</b> means <b>${esc(W[id][1])}</b>. ${esc(W[id][2]||'')}`;}return;}
  busy=true;b.classList.add('good');
  try{const cor=G('correct');cor&&cor(S.cur.first?3:1);}catch(_){}
  S.score+=S.cur.first?3:1;if(window.__stSession){window.__stSession.score=S.score;}
  await applyPiece(step,variants[i]);if(S!==run||G('game')!==run.id)return;burst();
  S.picks.push(variants[i].name);S.at++;if(window.__stSession)window.__stSession.at=S.at;
  setTimeout(()=>{if(S!==run||G('game')!==run.id)return;busy=false;if(S.at>=S.def.steps.length)finishStudio();else renderStep();},650);
}
async function applyPiece(step,v){
  const slots=root.userData.slots;if(slots[step.slot]){root.remove(slots[step.slot]);}
  if(step.slot==='liner'&&root.userData.liner){root.remove(root.userData.liner);root.userData.liner=null;}
  if(step.slot==='paper'&&root.userData.box){root.remove(root.userData.box);root.userData.box=null;}
  const g=new THREE.Group();v.build(g);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});slots[step.slot]=g;
  if(step.anim==='claw'){await clawGrab(g);return;}
  if(step.anim==='hop'){root.add(g);pop(g);await hop();return;}
  if(step.anim==='grow'){root.add(g);const S0=g.children.map(f=>f.scale.x);g.children.forEach(f=>{f.scale.setScalar(.01);});await tween(700,p=>{const s=1-Math.pow(1-p,3);g.children.forEach((f,j)=>{const b=S0[j]||1;f.scale.set(s*b,Math.max(.01,s*b*(1+Math.sin(p*Math.PI)*.2)),s*b);});});return;}
  g.position.y=.6;root.add(g);pop(g);await tween(420,p=>{g.position.y=.6*(1-ease(p));});
}
async function hop(){const hero=root.userData.hero;const from=hero.position.clone();const i=++root.userData.at;const p=QP(i);const to=new THREE.Vector3(p[0],.07,p[1]);
  hero.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);await tween(700,t=>{hero.position.lerpVectors(from,to,ease(t));hero.position.y=.07+Math.sin(t*Math.PI)*.45;});}
async function clawGrab(g){
  const claw=root.userData.claw,pr=root.userData.prongs;const prize=g.children[0];const tx=-.2+Math.random()*.5,tz=-.15+Math.random()*.25;
  const home=claw.position.clone();const open=a=>pr.forEach(p=>p.rotation.z=a);
  await tween(500,t=>{claw.position.x=home.x+(tx-home.x)*ease(t);claw.position.z=home.z+(tz-home.z)*ease(t);});open(-.3);
  await tween(450,t=>{claw.position.y=1.75-(1.75-1.08)*ease(t);});
  prize.scale.setScalar(.5);prize.position.set(0,-.33,0);claw.add(prize);open(.15);
  await tween(450,t=>{claw.position.y=1.08+(1.75-1.08)*ease(t);});
  await tween(500,t=>{claw.position.x=tx+(-.5-tx)*ease(t);claw.position.z=tz+(.25-tz)*ease(t);});open(-.3);
  claw.remove(prize);const n=root.userData.won++;const dest=new THREE.Vector3(-.75+(n%4)*.5,0,.95+Math.floor(n/4)*.45);g.add(prize);root.add(g);prize.position.set(-.5,1.3,.25);
  await tween(600,t=>{prize.position.x=-.5+(dest.x+.5)*t;prize.position.z=.25+(dest.z-.25)*t;prize.position.y=1.3*(1-t)+Math.sin(t*Math.PI)*.4;prize.scale.setScalar(.5+.1*t);});
  open(0);await tween(400,t=>{claw.position.x=-.5+(home.x+.5)*ease(t);claw.position.z=.25+(home.z-.25)*ease(t);});
}
function burst(){const b=document.getElementById('stBurst');if(!b||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cols=['#ff71ad','#ffd45b','#5bd8bf','#8fc6e8','#c8a2ff'];
  for(let i=0;i<22;i++){const d=document.createElement('i');d.style.left='50%';d.style.top='45%';d.style.background=cols[i%5];const a=Math.random()*Math.PI*2,r=80+Math.random()*90;d.style.setProperty('--dx',Math.cos(a)*r+'px');d.style.setProperty('--dy',Math.sin(a)*r+'px');b.appendChild(d);setTimeout(()=>d.remove(),950);}}
function finishStudio(){
  const def=S.def;try{const a=G('audio');a&&a('win');const c=G('celebrate');c&&c();const aw=G('award');aw&&aw(5);}catch(_){}
  if(window.__stSession)window.__stSession.done=true;
  const body=`<div class="st st-end"><div class="st-stage" id="stStage" style="height:clamp(300px,52vh,460px)"><div class="st-burst" id="stBurst"></div></div>
   <h2>${esc(def.done)}</h2><p style="margin:0;font-weight:800;color:#8a6577">You earned <b>${S.score}</b> stars and a <b>+5</b> coin bonus for your dollhouse!</p>
   <div class="st-row"><button class="primary" id="stAgain">Play again</button><button class="secondary" id="stHouse">🏠 Spend my coins</button></div></div>`;
  frameHTML(body,100);mountStage(document.getElementById('stStage'));camCfg=[camCfg[0],camCfg[1]*.92,camCfg[2]];burst();
  if(S.id==='claw'){
    const rewards=[['teddy','🧸 Teddy bear'],['flowers','💐 Flower bouquet'],['books','📚 Little book stack'],['tea','🫖 Tiny tea set'],['cupcake','🧁 Fridge treat'],['plant','🪴 Mini plant'],['picture','🖼️ Wall picture'],['light','💡 Small lamp'],['rug','🧶 Cozy rug']];
    const extra=document.createElement('div');extra.className='st-claw-reward';
    extra.innerHTML='<p style="font-weight:900">🪙 You earned a special Claw Coin! Feed it into the machine for a mystery dollhouse prize.</p><button type="button" class="primary" id="stClawCoin">🪙 Feed the Claw Coin</button><p id="stClawGift" aria-live="polite"></p>';
    const buttons=document.querySelector('.st-end .st-row');if(buttons)buttons.before(extra);
    const feed=document.getElementById('stClawCoin');
    if(feed)feed.onclick=()=>{
      feed.disabled=true;feed.textContent='✨ Mystery prize coming out…';
      const gift=document.getElementById('stClawGift');
      let owned=G('owned');const save=G('saveHouse');
      if(!Array.isArray(owned)){
        try{const raw=JSON.parse(localStorage.getItem('rickyHouseInventoryV1')||'[]');if(Array.isArray(raw))owned=raw;}catch(_){}
      }
      if(!Array.isArray(owned)){feed.disabled=false;feed.textContent='🪙 Try the Claw Coin again';if(gift)gift.textContent='Could not read your dollhouse inventory. No prize was used.';return;}
      const choices=rewards.filter(([id])=>!owned.includes(id));
      if(!choices.length){feed.textContent='🏠 All mini prizes collected!';if(gift)gift.textContent='Amazing! You already own every available mini prize.';return;}
      const reward=rand(choices);
      const previous=owned.slice();
      owned.push(reward[0]);
      try{
        if(typeof save==='function'&&owned===G('owned'))save();
        else localStorage.setItem('rickyHouseInventoryV1',JSON.stringify(owned));
        const stored=JSON.parse(localStorage.getItem('rickyHouseInventoryV1')||'[]');
        if(!Array.isArray(stored)||!stored.includes(reward[0]))throw Error('Inventory did not save');
      }catch(_){
        owned.splice(0,owned.length,...previous);
        feed.disabled=false;feed.textContent='🪙 Try the Claw Coin again';
        if(gift)gift.textContent='The prize could not be saved. Please try again.';
        return;
      }
      if(gift)gift.innerHTML=`<span style="font-size:2.5rem;display:block" aria-hidden="true">${esc(reward[1].split(' ')[0])}</span>🎁 Surprise! <b>${esc(reward[1])}</b> was added to your dollhouse inventory!`;
      feed.textContent='🎁 Prize collected!';
    };
  }
  const ag=document.getElementById('stAgain');if(ag)ag.onclick=()=>startStudio(def===GAMES[S.id]?S.id:S.id);
  const hs=document.getElementById('stHouse');if(hs)hs.onclick=()=>{try{const hh=G('houseHome');hh&&hh();}catch(_){}};
}

/* ================= hook into the arcade ================= */
/* 2D learning fallback when 3D/WebGL cannot run. */
function startStudio2D(id){
 SET('game='+JSON.stringify(id)+';');busy=false;
 const def=GAMES[id],data=words(),W=data.W,pool=data.pool;
 if(!def||!W.length||!pool.length)return false;
 const order=shuffle(pool).slice(0,Math.min(def.steps.length,pool.length));
 let at=0,score=0,missed=false;const fallbackSession={order,at:0,score:0,missed:[],done:false};window.__st2DSession=fallbackSession;SET('session=window.__st2DSession;');
 function frame2D(html,pct){const fr=G('frame');if(fr)fr(def.emoji+' '+def.title,html,pct);else document.getElementById('app').innerHTML=html;sync2DHeader();}function sync2DHeader(){const h=document.querySelector('.gamehead .pill');if(h)h.textContent=score+' ⭐';}
 function show(){
  if(at>=order.length){
   fallbackSession.done=true;frame2D('<div class="end"><h2>🎉 Fantastic work!</h2><p>⭐ '+score+' stars earned!</p><button class="primary" id="studio2DAgain">Play again</button><button class="secondary" id="studio2DMenu">Other games</button></div>',100);
   document.getElementById('studio2DAgain').onclick=()=>startStudio2D(id);
   document.getElementById('studio2DMenu').onclick=()=>{const menu=G('menu');if(menu)menu();};
   return;
  }
  missed=false;
  const w=W[order[at]],others=shuffle(pool.filter(x=>x!==order[at])).slice(0,2),options=shuffle([order[at],...others]);
  frame2D('<div class="panel"><h2>'+esc(def.title)+' — 2D mode</h2><p>Choose the Hebrew word that means:</p><div class="prompt"><strong>'+esc(w[1])+'</strong></div><div class="extra-choices">'+options.map(i=>'<button class="secondary" data-studio2d="'+i+'">'+esc(W[i][0])+'</button>').join('')+'</div><p id="studio2DHint" aria-live="polite"></p><p>⭐ '+score+' stars · Question '+(at+1)+' of '+order.length+'</p></div>',Math.round(at/order.length*100));
  document.querySelectorAll('[data-studio2d]').forEach(b=>b.onclick=()=>{
   if(+b.dataset.studio2d!==order[at]){
    missed=true;b.disabled=true;document.getElementById('studio2DHint').textContent='Try again! '+(w[2]||'');const bad=G('incorrect');if(bad&&G('session'))bad();return;
   }
   const points=missed?1:3;score+=points;fallbackSession.score=score;const good=G('correct');
   if(good&&G('session'))good(points);else{const award=G('award');if(award)award(points*2);}
   at++;fallbackSession.at=at;show();sync2DHeader();
  });
 }
 show();return true;
}
const prevStart=G('start'),prevRender=G('render');
if(typeof prevStart==='function'){
  window.__stStart=function(g){if(IDS.includes(g)){if(studioWebGLAvailable()&&startStudio(g))return;if(startStudio2D(g))return;}return prevStart.apply(this,arguments);};
  SET('start=window.__stStart;');
}
if(typeof prevRender==='function'){
  window.__stRender=function(){const g=G('game');if(IDS.includes(g)&&S&&S.id===g)return;return prevRender.apply(this,arguments);};
  SET('render=window.__stRender;');
}
/* menu cards call start through their own handlers; route them here too */
document.addEventListener('click',e=>{const b=e.target.closest('[data-creative],[data-extra],[data-special]');if(!b)return;const id=b.dataset.creative||b.dataset.extra||b.dataset.special;if(IDS.includes(id)){e.stopPropagation();e.preventDefault();if(!studioWebGLAvailable()||!startStudio(id))startStudio2D(id);}},true);
window.RikiStudio={start:startStudio,games:GAMES,state:()=>S,chibi};
})();

/* Menu tidy-up (Claude, Oct 29): group games into "Make something" and "Word games", show each
   make-game as a 3D picture of a finished creation, point "Play inside" at the 3D rooms, and
   re-draw the menu once every script has loaded so all games appear on first open. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
const MAKE=['cupcakes','cake','dressup','pets','boutique','claw','aquarium','quest','giftwrap','garden'];
const pics={};let rig=null;
function snapCreation(id){
  if(pics[id])return pics[id];const def=window.RikiStudio&&window.RikiStudio.games[id];if(!def||!window.THREE)return null;
  if(!rig){const cv=document.createElement('canvas');cv.width=cv.height=240;const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(240,240,false);r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.12;r.setClearColor(0,0);
    const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0xffd9e4,.85));const k=new THREE.DirectionalLight(0xfff3e6,1.1);k.position.set(3,6,5);s.add(k);const rim=new THREE.DirectionalLight(0xffc4dd,.5);rim.position.set(-4,3,-4);s.add(rim);rig={r,s,c:new THREE.PerspectiveCamera(30,1,.01,60)};}
  const g=new THREE.Group();try{def.base.call(def,g);def.steps.forEach((st,i)=>{const v=st.vs[i%st.vs.length];if(v&&!st.anim)v.build(g);else if(v&&(st.anim==='grow'||st.anim==='swim'))v.build(g);});}catch(e){}
  const {r,s,c}=rig;s.add(g);g.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g);if(box.isEmpty()){s.remove(g);return null;}
  const size=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3()),rad=Math.max(size.x,size.y,size.z)*.6,d=rad/Math.sin(c.fov*Math.PI/360);
  c.position.set(ctr.x+Math.sin(.55)*d*.95,ctr.y+d*.3,ctr.z+Math.cos(.55)*d*.95);c.lookAt(ctr);c.updateProjectionMatrix();r.render(s,c);pics[id]=r.domElement.toDataURL('image/png');s.remove(g);return pics[id];
}
function organize(){
  const grid=document.querySelector('.games');if(!grid||grid.dataset.grouped)return;grid.dataset.grouped='1';
  const cards=[...grid.querySelectorAll('.gamecard')];const idOf=c=>c.dataset.creative||c.dataset.extra||c.dataset.special||c.dataset.game;
  const make=cards.filter(c=>MAKE.includes(idOf(c))),words=cards.filter(c=>!MAKE.includes(idOf(c)));
  grid.innerHTML='';const head=t=>{const h=document.createElement('h3');h.className='games-group';h.textContent=t;grid.appendChild(h);};
  if(make.length){head('🎨 Make something');make.forEach(c=>grid.appendChild(c));}
  if(words.length){head('🧠 Word games');words.forEach(c=>grid.appendChild(c));}
  const live=document.getElementById('livingHouse');if(live)live.textContent='🧸 Decorate my rooms';
  const paint=()=>make.forEach(c=>{const u=snapCreation(idOf(c));const em=c.querySelector('.emoji');if(u&&em&&!em.querySelector('img')){em.innerHTML=`<img src="${u}" alt="">`;em.classList.add('emoji-3d');}});
  const K=window.RK3;if(K&&K.loadThree)K.loadThree(()=>requestAnimationFrame(paint),()=>{});
}
const prevMenu=G('menu');
if(typeof prevMenu==='function'){window.__tidyMenu=function(){const r=prevMenu.apply(this,arguments);try{organize();}catch(e){}return r;};SET('menu=window.__tidyMenu;');}
/* "Play inside" now opens the 3D rooms, which hold the same shelves, drawers and storage */
document.addEventListener('click',e=>{const b=e.target.closest('#livingHouse,#playHouse');if(!b)return;e.preventDefault();e.stopPropagation();const hh=G('houseHome');if(typeof hh==='function')hh();},true);
/* All scripts are loaded now: the Home hub (defined below) takes over the first screen */
window.__rkMenuReady=true;
})();

/* Learning layer (Claude, Oct 29): per-root progress, smarter word picking, mastery, hear the Hebrew,
   a Progress screen, quiz celebrations, and 3D Social Skills scenes.
   Progress is saved under its own new key 'rikiRootProgressV1'; no existing key is touched. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const KEY='rikiRootProgressV1';
let P={};try{P=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){P={};}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
const rec=id=>P[id]||(P[id]={seen:0,first:0,miss:0,hist:[],days:[]});
function mastered(id){const r=P[id];if(!r||r.hist.length<3)return false;const last=r.hist.slice(-3);return last.every(x=>x===1)&&(r.days||[]).length>=2;}
function priority(id){const r=P[id];if(!r||!r.seen)return 1.1;const acc=r.first/r.seen;return (mastered(id)?.25:1)*(1.6-acc)+Math.min(r.miss,6)*.08;}
function pick(pool,n){
  const ranked=shuffle(pool).map(id=>({id,p:priority(id)*(0.7+Math.random()*.6)})).sort((a,b)=>b.p-a.p).map(x=>x.id);
  const take=ranked.slice(0,Math.max(1,n-1));const rest=ranked.slice(take.length);if(rest.length&&take.length<n)take.push(rest[Math.floor(Math.random()*rest.length)]);
  return shuffle(take).slice(0,n);
}
/* ---- tracking ---- */
const TRACK=['detective','bubbles','builder','sort','cupcakes','cake','dressup','pets','boutique','claw','aquarium','quest','giftwrap','garden'];
const missedQ=new Set(),doneQ=new Set();
function cur(){const g=G('game'),s=G('session');if(!TRACK.includes(g)||!s||!Array.isArray(s.order))return null;const id=s.order[s.at];if(id===undefined)return null;return {id,key:g+'|'+(G('round')||0)+'|'+s.at+'|'+id};}
const prevCorrect=G('correct'),prevIncorrect=G('incorrect');
if(typeof prevCorrect==='function'){window.__rkCorrect=function(){const c=cur();const r=prevCorrect.apply(this,arguments);
  if(c&&!doneQ.has(c.key)){doneQ.add(c.key);const x=rec(c.id),ok=missedQ.has(c.key)?0:1;x.seen++;if(ok){x.first++;const d=today();if(!x.days.includes(d))x.days.push(d);x.days=x.days.slice(-10);}x.hist.push(ok);x.hist=x.hist.slice(-8);x.last=Date.now();try{const L=P._log||(P._log={});const d=today();const e=L[d]||(L[d]={n:0,f:0,w:[]});e.n++;if(ok)e.f++;if(!e.w.includes(c.id))e.w.push(c.id);Object.keys(L).sort().slice(0,-60).forEach(k=>delete L[k]);}catch(_){}save();}
  try{celebrateGame(G('game'));}catch(e){}try{const W=G('W');if(c&&W&&W[c.id])setTimeout(()=>say(W[c.id][0]),250);}catch(e){}return r;};SET('correct=window.__rkCorrect;');}
if(typeof prevIncorrect==='function'){window.__rkIncorrect=function(){const c=cur();if(c&&!missedQ.has(c.key)){missedQ.add(c.key);rec(c.id).miss++;save();}return prevIncorrect.apply(this,arguments);};SET('incorrect=window.__rkIncorrect;');}
/* ---- weak roots come up more often in the quiz games ---- */
const WEIGHT=['detective','bubbles','builder','sort'];
const prevStart=G('start');
if(typeof prevStart==='function'){window.__rkStart=function(g){const r=prevStart.apply(this,arguments);try{const s=G('session'),idsFn=G('ids');
  if(WEIGHT.includes(g)&&s&&Array.isArray(s.order)&&s.order.length&&typeof idsFn==='function'&&G('game')===g){s.order=pick(idsFn(),s.order.length);s.opts=null;s.letters=[];s.at=0;const rd=G('render');rd&&rd();}}catch(e){}return r;};SET('start=window.__rkStart;');}
/* ---- mastered word: hide the hint button in quiz games ---- */
function hideHints(){const c=cur();const app=document.getElementById('app');if(!app)return;const on=!!(c&&WEIGHT.includes(G('game'))&&mastered(c.id));app.classList.toggle('rk-mastered',on);
  if(on){app.querySelectorAll('button').forEach(b=>{if(/hint|clue/i.test(b.textContent)&&!b.closest('.st'))b.hidden=true;});const pr=app.querySelector('.prompt');if(pr&&!pr.querySelector('.rk-star'))pr.insertAdjacentHTML('beforeend','<div class="rk-star">⭐ Mastered word — no hints needed!</div>');}}

/* ---- expressive character voices ---- */
const canSpeak='speechSynthesis' in window;
const VOICE_PROFILES={narrator:{slot:0,pitch:1.02,rate:.94},riki:{slot:1,pitch:1.16,rate:.96},maya:{slot:2,pitch:1.04,rate:.9},friend:{slot:2,pitch:1.04,rate:.9},zoe:{slot:3,pitch:1.23,rate:1.02},friend2:{slot:3,pitch:1.23,rate:1.02},mom:{slot:4,pitch:.9,rate:.91},teacher:{slot:5,pitch:.98,rate:.87}};
let activeSpeech=0;
function voiceChoices(lang){const want=String(lang||'en-US').slice(0,2).toLowerCase(),all=speechSynthesis.getVoices();return all.filter(v=>String(v.lang).toLowerCase().startsWith(want)).sort((a,b)=>(b.localService?1:0)-(a.localService?1:0)||a.name.localeCompare(b.name));}
function voiceTarget(target){if(target instanceof Element)return target;if(typeof target==='string')return document.querySelector(target);return document.querySelector('.sl-actor.talk,.comic-panel.on .comic-actor,#app .game-title-doll,#app .pd-actor');}
function speechStop(){activeSpeech++;try{speechSynthesis.cancel();}catch(_){}document.querySelectorAll('.riki-speaking').forEach(el=>el.classList.remove('riki-speaking','riki-mouth-open'));}
function expressiveSpeak(text,options={}){if(!canSpeak||G('soundOn')===false)return Promise.resolve();const character=options.character||'narrator',profile={...(VOICE_PROFILES[character]||VOICE_PROFILES.narrator),...options},lang=profile.lang||'en-US',target=voiceTarget(profile.target);if(profile.cancel)speechStop();const token=++activeSpeech;if(target)target.classList.add('riki-speaking');
 const clean=String(text).replace(/[“”]/g,'"').replace(/\s+/g,' ').trim(),phrases=clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[clean],voices=voiceChoices(lang),voice=voices.length?voices[profile.slot%voices.length]:null;
 return new Promise(resolve=>{let at=0,done=false,timer=0;const finish=()=>{if(done)return;done=true;clearTimeout(timer);if(target)target.classList.remove('riki-speaking','riki-mouth-open');resolve();};const next=()=>{if(token!==activeSpeech||at>=phrases.length){finish();return;}const phrase=phrases[at++].trim(),u=new SpeechSynthesisUtterance(phrase);u.lang=lang;if(voice)u.voice=voice;const lift=/\?$/.test(phrase)?.09:/!$/.test(phrase)?.13:at===phrases.length?.01:0;u.pitch=Math.max(.6,Math.min(1.6,profile.pitch+lift));u.rate=Math.max(.65,Math.min(1.3,profile.rate+(/!$/.test(phrase)?.03:0)));u.onboundary=()=>{if(target)target.classList.toggle('riki-mouth-open');};u.onend=next;u.onerror=next;try{speechSynthesis.speak(u);}catch(_){finish();}};
  timer=setTimeout(finish,Math.max(2200,clean.length*95));window.dispatchEvent(new CustomEvent('riki:voice-start',{detail:{character,lang,voice:voice?.name||'',pitch:profile.pitch,rate:profile.rate}}));next();});}
window.RikiVoice={speak:expressiveSpeak,stop:speechStop,profiles:VOICE_PROFILES};

/* ---- hear the Hebrew ---- */
let heVoice=null;
function findVoice(){if(!canSpeak)return null;const v=speechSynthesis.getVoices();heVoice=v.find(x=>/^he|^iw/i.test(x.lang))||null;return heVoice;}
if(canSpeak){findVoice();speechSynthesis.onvoiceschanged=findVoice;}
/* American (Ashkenazi) reading: a tav that isn't the first letter is read as a soft s (sav), so it goes to the voice as a samech */
function ashk(t){return String(t).replace(/[\u0591-\u05C7]/g,'').split(/\s+/).map(w=>w.replace(/(?!^)ת/g,'ס')).join(' ');}
function say(text,btn){if(!canSpeak)return;const sOn=G('soundOn');if(sOn===false&&!btn)return;try{if(btn)btn.classList.add('on');expressiveSpeak(ashk(text),{character:'riki',lang:'he-IL',rate:.8,pitch:1.08,cancel:!!btn,target:'.game-title-doll'}).finally(()=>btn&&btn.classList.remove('on'));if(!heVoice&&speechSynthesis.getVoices().length&&btn&&!btn.dataset.warned){btn.dataset.warned=1;btn.title='This device may not have a Hebrew voice installed';}}catch(e){}}
const sayBtn=t=>`<button type="button" class="rk-say" data-say="${esc(t)}" aria-label="Hear it">🔊</button>`;
/* Speak once per question, not when feedback re-renders the same prompt. */
let rkLastSpeechQuestion='',rkLastSpeechPhase='';
function rkQuestionSignature(text){
 const sess=G('session'),game=G('game');
 return [game,sess&&sess.at,sess&&sess.order&&sess.order[sess.at],text].join('|');
}
function addSpeakers(root){if(!canSpeak)return;(root||document).querySelectorAll('.prompt .hebrew,.st-order .st-he,.rk-prog-he').forEach(el=>{
 if(el.dataset.sayAdded)return;el.dataset.sayAdded=1;
 const t=el.textContent.trim();if(!/[֐-׿]/.test(t))return;
 el.insertAdjacentHTML('afterend',sayBtn(t));
 if(el.classList.contains('rk-prog-he'))return;
 const app=document.getElementById('app');
 const answered=!!(app&&app.querySelector('.feedback.good,.feedback.bad,.option.correct,.option.wrong,.match-btn.solved,.sel-feedback'));
 const signature=rkQuestionSignature(t);
 if(answered||signature===rkLastSpeechQuestion)return;
 rkLastSpeechQuestion=signature;
 setTimeout(()=>{if(el.isConnected&&!document.querySelector('.feedback.good,.feedback.bad,.option.correct,.option.wrong'))say(t);},350);
});}
/* phones only allow speech after the first tap: unlock it silently on the first touch */
let unlocked=false;document.addEventListener('pointerdown',()=>{if(unlocked||!canSpeak)return;unlocked=true;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){}},true);
document.addEventListener('click',e=>{const b=e.target.closest('.rk-say');if(!b)return;e.preventDefault();e.stopPropagation();say(b.dataset.say,b);},true);

/* Phone Back button (Claude, Oct 29; replaces the #24 block): Back closes any open overlay,
   otherwise goes to the Home screen. On Home, Back asks once ("press Back again to leave")
   so the site is never left by accident. */
(function(){
 const onHub=()=>!!document.querySelector('#app .hub');
 const push=()=>{try{history.pushState({riki:1},'',location.href);}catch(_){}};
 push();
 let leaveArmed=false,toastT=0;
 function toast(msg){let t=document.getElementById('rkBackToast');if(!t){t=document.createElement('div');t.id='rkBackToast';t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#4a2338;color:#fff;padding:10px 18px;border-radius:999px;font-weight:800;z-index:100000;transition:opacity .3s';document.body.appendChild(t);}
   t.textContent=msg;t.style.opacity='1';clearTimeout(toastT);toastT=setTimeout(()=>{t.style.opacity='0';},1800);}
 function closeOverlay(){
   const wh=document.querySelector('.wh3d:not([hidden])');if(wh){const c=wh.querySelector('[data-close]');if(c){c.click();return true;}}
   const st=document.querySelector('.storage-overlay');if(st){const c=st.querySelector('#closeStorage,.close-storage');if(c)c.click();else st.remove();return true;}
   const pv=document.getElementById('rkShopPreview');if(pv){pv.remove();return true;}
   return false;}
 window.addEventListener('popstate',()=>{
   if(closeOverlay()){push();return;}
   if(!onHub()){try{speechSynthesis.cancel();}catch(_){}const h=window.RikiHub||G('menu');if(typeof h==='function')h();window.scrollTo(0,0);leaveArmed=false;push();return;}
   if(leaveArmed){history.back();return;}
   leaveArmed=true;toast('Press Back again to leave');setTimeout(()=>{leaveArmed=false;},2200);push();
 });
})();
/* ---- quiz celebrations ---- */
function burstAt(el,n=26){if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=el.getBoundingClientRect();const cols=['#ff71ad','#ffd45b','#5bd8bf','#8fc6e8','#c8a2ff'];
  for(let i=0;i<n;i++){const d=document.createElement('i');d.className='rk-spark';d.style.left=(r.left+r.width/2)+'px';d.style.top=(r.top+r.height/2)+'px';d.style.background=cols[i%5];const a=Math.random()*Math.PI*2,rr=60+Math.random()*120;d.style.setProperty('--dx',Math.cos(a)*rr+'px');d.style.setProperty('--dy',Math.sin(a)*rr+'px');document.body.appendChild(d);setTimeout(()=>d.remove(),1000);}}
function celebrateGame(g){
  requestAnimationFrame(()=>{const app=document.getElementById('app');if(!app)return;const pr=app.querySelector('.prompt');
    if(g==='sort'&&pr){const rk=[...pr.children].find(c=>/🚀/.test(c.textContent)&&c.children.length===0);if(rk&&!rk.classList.contains('rk-launch')){rk.classList.add('rk-launch');pr.classList.add('rk-launchpad');}burstAt(pr,18);}
    else if(g==='detective'&&pr){if(!pr.querySelector('.rk-stamp')){pr.style.position='relative';pr.insertAdjacentHTML('beforeend','<div class="rk-stamp">CASE SOLVED</div>');}burstAt(pr,20);}
    else if(g==='builder'){app.querySelectorAll('.slot').forEach((s,i)=>{s.style.animationDelay=(i*.08)+'s';s.classList.add('rk-hop');});burstAt(app.querySelector('.buildslots'),22);}
    else if(g==='bubbles'){burstAt(app.querySelector('.bubble.pop')||pr,24);}
    else if(g==='memory'){app.querySelectorAll('.tile.matched').forEach(t=>{if(!t.dataset.rkDone){t.dataset.rkDone=1;t.classList.add('rk-hop');burstAt(t,10);}});}
    else if(g==='pairs'||g==='show'||g==='wheel'){burstAt(app.querySelector('.match-btn.solved:last-of-type,.option.correct,.feedback.good')||pr,18);}
  });}

/* ---- 3D Social Skills scenes ---- */
let srig=null;const scache={};
function sceneImg(emojis,seed){
  const key=emojis+'|'+seed;if(scache[key])return scache[key];const ch=window.RikiStudio&&window.RikiStudio.chibi;const K=window.RK3;if(!ch||!K||!window.THREE)return null;
  if(!srig){const cv=document.createElement('canvas');cv.width=480;cv.height=300;const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(480,300,false);r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.1;r.setClearColor(0,0);r.shadowMap.enabled=true;
    const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0xffd9e4,.8));const k=new THREE.DirectionalLight(0xfff3e6,1.05);k.position.set(2,6,5);k.castShadow=true;k.shadow.mapSize.set(512,512);const c2=k.shadow.camera;c2.left=-3;c2.right=3;c2.top=3;c2.bottom=-3;s.add(k);
    const gr=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.ShadowMaterial({opacity:.18}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;s.add(gr);srig={r,s,c:new THREE.PerspectiveCamera(30,480/300,.05,40)};}
  const {r,s,c}=srig;const g=new THREE.Group();s.add(g);
  const hairs=['#3a2a20','#c98b5e','#2a2a3a','#e0a96d','#7a4a2a'],dresses=['#8fc6e8','#8ed6c4','#ffd25e','#c8a2ff','#ffb48a'];
  const mk=(x,hair,dress,ry)=>{const d=new THREE.Group();d.position.x=x;d.rotation.y=ry;g.add(d);ch(d,{hair});K.CY(d,.15,.3,.4,K.fabric(dress),0,.36,0,24);K.CY(d,.14,.16,.2,K.fabric(dress),0,.66,0,20);};
  mk(-.42,'#7a4a2a','#f7a0bd',.35);mk(.42,hairs[seed%5],dresses[seed%5],-.35);
  const em=[...emojis].filter(ch2=>/\p{Extended_Pictographic}/u.test(ch2)).slice(0,3);
  em.forEach((e,i)=>{const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');x.textAlign='center';x.textBaseline='middle';x.font='96px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';x.fillText(e,64,70);
    const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));sp.scale.set(.42,.42,.42);sp.position.set((i-(em.length-1)/2)*.42,1.62,0);g.add(sp);});
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});c.position.set(0,1.05,4.1);c.lookAt(0,.85,0);c.updateProjectionMatrix();r.render(s,c);const u=r.domElement.toDataURL('image/png');s.remove(g);scache[key]=u;return u;}
function upgradeSel(root){(root||document).querySelectorAll('.sel-scene .sel-illustration').forEach(el=>{if(el.dataset.rk3||!window.RikiArt)return;el.dataset.rk3='1';el.innerHTML='<div class="game-social-cast">'+window.RikiArt.doll(window.RikiArt.look('riki'),'stand','happy',true)+window.RikiArt.doll(window.RikiArt.look('maya'),'stand','neutral',true)+'</div>';});}

/* ---- Progress screen ---- */
function weekSummary(W){
  const L=P._log||{};const days=[];for(let i=6;i>=0;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10);days.push([d,L[d]]);}
  const played=days.filter(x=>x[1]);const n=played.reduce((a,x)=>a+x[1].n,0),f=played.reduce((a,x)=>a+x[1].f,0);const words=new Set(played.flatMap(x=>x[1].w));
  const prev=[];for(let i=13;i>=7;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10);if(L[d])prev.push(L[d]);}const pn=prev.reduce((a,x)=>a+x.n,0),pf=prev.reduce((a,x)=>a+x.f,0);
  const better=[...words].filter(id=>{const r=P[id];return r&&r.hist.length>=3&&r.hist.slice(-3).every(x=>x===1)&&r.miss>0;}).slice(0,6);
  const shaky=[...words].filter(id=>{const r=P[id];return r&&r.seen>=2&&r.first/r.seen<.6;}).slice(0,6);
  const chip=id=>`<span class="rk-chip"><b lang="he">${esc(W[id][0])}</b> ${esc(W[id][1])}</span>`;
  const bars=days.map(([d,e])=>{const h=e?Math.min(100,12+e.n*4):4;return `<span class="rk-day" title="${d}"><i style="height:${h}%;${e?'':'background:#f3d6dc'}"></i><small>${'SMTWTFS'[new Date(d+'T12:00').getDay()]}</small></span>`;}).join('');
  if(!played.length)return `<div class="rk-week"><h3>This week</h3><p class="subtle">No word games played in the last 7 days yet.</p></div>`;
  const trend=pn?(Math.round(f/n*100)-Math.round(pf/pn*100)):null;
  return `<div class="rk-week"><h3>This week</h3><div class="rk-days">${bars}</div>
    <p><b>${played.length}</b> day${played.length===1?'':'s'} played · <b>${words.size}</b> words · <b>${Math.round(f/n*100)}%</b> right on first try${trend!==null?` (${trend>=0?'▲':'▼'} ${Math.abs(trend)} from last week)`:''}</p>
    ${better.length?`<p class="rk-wl">🌱 Getting stronger</p><div class="rk-chips">${better.map(chip).join('')}</div>`:''}
    ${shaky.length?`<p class="rk-wl">🧩 Still tricky</p><div class="rk-chips">${shaky.map(chip).join('')}</div>`:''}</div>`;}
/* Move progress from another copy of the site (e.g. the old Netlify link) with a code */
const XFER_KEYS=['rickyCoins','rickyHouseInventoryV1','rickyHouseDecorV1','rickyHouseWallsV1','rickyDreamStorageV2','rickyDreamPetsV2','rickyDreamPositionsV2','rickyRoomInteriorsV3','rickyTinyOwnedV1','rickyTinyPlacedV1','rickyAdventureXPV1','rickySpatialMusicV1','riki3dOrbit','rikiReal3dAz','rikiRootProgressV1','rikiDreamRotationV1','rikiClawPlushV1'];
function exportCode(){const o={};XFER_KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)o[k]=v;});return 'RIKI1:'+btoa(unescape(encodeURIComponent(JSON.stringify(o))));}
function importCode(code){const m=String(code).trim().match(/^RIKI1:([A-Za-z0-9+/=]+)$/);if(!m)return 'That code doesn’t look right. It should start with RIKI1:';let o;try{o=JSON.parse(decodeURIComponent(escape(atob(m[1]))));}catch(e){return 'That code is damaged. Copy it again.';}
  const bak=exportCode();try{localStorage.setItem('rikiBackupBeforeImport',bak);}catch(e){}
  const mergeList=(a,b)=>{try{const x=JSON.parse(a||'[]'),y=JSON.parse(b||'[]');if(Array.isArray(x)&&Array.isArray(y))return JSON.stringify([...new Set([...x,...y])]);}catch(e){}return b;};
  Object.entries(o).forEach(([k,v])=>{if(!XFER_KEYS.includes(k))return;const cur=localStorage.getItem(k);
    if(k==='rickyCoins'){localStorage.setItem(k,String(Math.max(+cur||0,+v||0)));return;}
    if(k==='rickyHouseInventoryV1'||k==='rickyTinyOwnedV1'){localStorage.setItem(k,mergeList(cur,v));return;}
    if(cur===null||cur==='{}'||cur==='[]')localStorage.setItem(k,v);});
  return '';}
function progressPage(){
  const W=G('W')||[];const fr=G('frame');if(typeof fr!=='function')return;SET("game='progress';session=null;");
  const rows=W.map((w,i)=>({i,w,r:P[i]})).filter(x=>x.r&&x.r.seen);const week=weekSummary(W);const totalSeen=rows.reduce((a,x)=>a+x.r.seen,0),totalFirst=rows.reduce((a,x)=>a+x.r.first,0);
  const mcount=rows.filter(x=>mastered(x.i)).length;rows.sort((a,b)=>(a.r.first/a.r.seen)-(b.r.first/b.r.seen)||b.r.miss-a.r.miss);
  const bar=p=>`<span class="rk-bar"><i style="width:${Math.round(p*100)}%"></i></span>`;
  const list=rows.length?rows.map(x=>{const p=x.r.first/x.r.seen;return `<li><span class="rk-prog-he" lang="he">${esc(x.w[0])}</span><span class="rk-prog-mean">${esc(x.w[1])}${mastered(x.i)?' ⭐':''}</span>${bar(p)}<span class="rk-prog-num">${Math.round(p*100)}% · ${x.r.seen}</span></li>`;}).join(''):'<p class="subtle">Play a few word games and her progress will show up here.</p>';
  fr('📊 Riki\'s Progress',`<div class="rk-prog"><div class="rk-tiles"><div><b>${rows.length}</b><span>words practiced</span></div><div><b>${mcount}</b><span>mastered ⭐</span></div><div><b>${totalSeen?Math.round(totalFirst/totalSeen*100):0}%</b><span>right on first try</span></div></div>
   <p class="subtle">Hardest words are at the top. "Mastered" means right on the first try 3 times in a row, on at least 2 different days. Tricky words come up more often in the games, and mastered words get 4 choices and no hints.</p>
   ${week}<ul class="rk-prog-list">${list}</ul><div class="row"><button class="primary" id="rkPractice">🔎 Practice the tricky words</button></div><p class="subtle">Saved on this device only.</p>
   <details class="rk-xfer"><summary>Move progress to another phone or link</summary>
     <p class="subtle">On the old copy, copy this code. On the new copy, paste it below. Coins keep the higher amount; furniture and pets are added, nothing is deleted.</p>
     <textarea id="rkXOut" readonly rows="3"></textarea><button class="secondary" id="rkXCopy">📋 Copy my code</button>
     <textarea id="rkXIn" rows="3" placeholder="Paste a RIKI1: code here"></textarea><button class="primary" id="rkXGo">Bring it here</button><p class="subtle" id="rkXMsg"></p>
   </details></div>`);
  addSpeakers(document.getElementById('app'));try{const out=document.getElementById('rkXOut');out.value=exportCode();document.getElementById('rkXCopy').onclick=()=>{out.select();(navigator.clipboard?navigator.clipboard.writeText(out.value):Promise.reject()).then(()=>{document.getElementById('rkXMsg').textContent='Copied!';}).catch(()=>{document.getElementById('rkXMsg').textContent='Selected — use your phone’s Copy.';});};document.getElementById('rkXGo').onclick=()=>{const err=importCode(document.getElementById('rkXIn').value);const msg=document.getElementById('rkXMsg');if(err){msg.textContent=err;return;}msg.textContent='Done! Reloading…';setTimeout(()=>location.reload(),700);};}catch(_){}const b=document.getElementById('rkPractice');if(b)b.onclick=()=>{const st=G('start');st&&st('detective');};}
function addProgressButton(){const stats=document.querySelector('.top .stats');if(!stats||document.getElementById('rkProgressBtn'))return;const b=document.createElement('button');b.className='smallbtn';b.id='rkProgressBtn';b.textContent='📊 Progress';b.onclick=progressPage;const set=document.getElementById('settingsToggle');stats.insertBefore(b,set||null);}
addProgressButton();

/* ---- keep everything applied as screens change ---- */
const app=document.getElementById('app');
if(app)new MutationObserver(()=>{addSpeakers(app);upgradeSel(app);hideHints();}).observe(app,{childList:true,subtree:true});
addSpeakers(app);upgradeSel(app);
const prevOpts=G('optionsFor');
if(typeof prevOpts==='function'){window.__rkOpts=function(id,n,rev){if(G('game')==='bubbles'&&mastered(id))n=Math.max(n||3,4);return prevOpts.call(this,id,n,rev);};SET('optionsFor=window.__rkOpts;');}
/* English read aloud: the English meaning in quiz prompts and studio orders is spoken automatically */
function sayEn(t){if(!canSpeak||G('soundOn')===false)return;expressiveSpeak(t,{character:'riki',target:'.game-title-doll'});}
function speakEnglish(root){(root||document).querySelectorAll('.prompt .meaning,.st-order .st-bub b,.wheel-question h2,.show-spotlight h2').forEach(el=>{if(el.dataset.enSaid)return;el.dataset.enSaid=1;const t=el.textContent.trim();if(!t||/[֐-׿]/.test(t))return;setTimeout(()=>{if(el.isConnected)sayEn(t);},350);});}
if(app)new MutationObserver(()=>speakEnglish(app)).observe(app,{childList:true,subtree:true});
document.addEventListener('click',e=>{const b=e.target.closest('#app .option:not(.he),#app .bubble,#app .match-btn,#app .cm-ans,#app .st-card span:not(.st-he)');if(!b)return;const t=(b.matches('.st-card span')?b:b).textContent.trim();if(t&&!/[֐-׿]/.test(t)&&t.length<40){try{speechSynthesis.cancel();}catch(_){}sayEn(t);}},true);
(function(){if(document.getElementById('rkWeekCss'))return;const st=document.createElement('style');st.id='rkWeekCss';st.textContent=`.rk-week{background:#fff;border:2px solid #f3d6dc;border-radius:18px;padding:12px 14px}.rk-week h3{margin:0 0 6px;font-family:"Baloo 2",system-ui,sans-serif}.rk-week p{margin:6px 0;font-weight:700}
.rk-days{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;height:70px;align-items:end}.rk-day{display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:2px}.rk-day i{display:block;width:70%;background:#e2457a;border-radius:6px 6px 2px 2px}.rk-day small{font-size:10px;font-weight:800;color:#8a6577}
.rk-wl{font-weight:900!important;margin-top:10px!important}.rk-chips{display:flex;flex-wrap:wrap;gap:6px}.rk-chip{background:#ffe3ea;border-radius:999px;padding:4px 10px;font-weight:800;font-size:13px}.rk-chip b{font-family:"Frank Ruhl Libre","David",serif;font-size:16px;color:#b92e5e}
.rk-xfer{background:#fff;border:2px solid #f3d6dc;border-radius:18px;padding:8px 12px}.rk-xfer summary{font-weight:900;cursor:pointer;padding:4px 0}.rk-xfer textarea{width:100%;border-radius:12px;border:2px solid #f3d6dc;padding:8px;font:12px monospace;margin:6px 0}`;document.head.appendChild(st);})();
window.RikiProgress={pick,mastered,data:()=>P,say,show:progressPage,exportCode,importCode};
})();

/* Home hub (Claude, Oct 29): the first screen is a few big choices. Shoresh Games opens the full games list. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
const MAKE=['cupcakes','cake','dressup','pets','boutique','claw','aquarium','quest','giftwrap','garden'];
const NAMES={cupcakes:'Cupcake Café',cake:'Birthday Cake',dressup:'Dress-Up Studio',pets:'Pet Spa',boutique:'Fashion Boutique',claw:'Claw Machine',aquarium:'Aquarium Rescue',quest:'Adventure Missions',giftwrap:'Gift Wrap',garden:'Magic Garden'};
function hub(){
  SET("game='';session=null;");const app=document.getElementById('app');if(!app)return;
  const coins=G('coins')||0;const pick=MAKE[new Date().getDate()%MAKE.length];
  const tile=(id,icon,title,sub,cls='')=>`<button type="button" class="hub-tile ${cls}" id="${id}"><span class="hub-ic">${icon}</span><b>${title}</b><span>${sub}</span></button>`;
  app.innerHTML=`<section class="hub"><div class="hub-hi"><h1>Hi Riki! 👋</h1><p>What do you want to do?</p></div>
   <button type="button" class="hub-today" id="hubToday"><span class="hub-today-tag">⭐ Today's pick</span><b>${NAMES[pick]}</b><span>Tap to play</span></button>
   <div class="hub-grid">${tile('hubGames','<span class="hub-alef" lang="he">אב</span>','Shoresh Games','Learn Hebrew roots')}${tile('hubSocial','💖','Social Skills','Feelings & friends')}${tile('hubHouse','🏠','My Dollhouse','Decorate your rooms')}${tile('hubShop','🛍️','Shop',`🪙 ${coins} coins to spend`)}${tile('hubPlay','🎀','Play with Dolls',`🎟️ ${window.RikiPlay?window.RikiPlay.state().tokens:0} plays · dolls & pets`,'hub-play')}</div>
   <button type="button" class="hub-progress" id="hubProgress">📊 Progress for grown-ups</button></section>`;
  const $=id=>document.getElementById(id);const tap=()=>{try{const a=G('audio');a&&a('tap');}catch(_){}};
  $('hubGames').onclick=()=>{tap();const m=G('menu');m&&m();window.scrollTo(0,0);};
  $('hubSocial').onclick=()=>{tap();const s=G('selHub');s&&s();window.scrollTo(0,0);};
  $('hubHouse').onclick=()=>{tap();const h=G('houseHome');h&&h();window.scrollTo(0,0);};
  $('hubShop').onclick=()=>{tap();const h=G('houseHome');h&&h();SET("housePage='shop';");const r=G('houseRender');r&&r();window.scrollTo(0,0);};
  $('hubPlay').onclick=()=>{tap();window.RikiPlay&&window.RikiPlay.open();};$('hubProgress').onclick=()=>{tap();window.RikiProgress&&window.RikiProgress.show();};
  $('hubToday').onclick=()=>{tap();window.RikiStudio&&window.RikiStudio.start(pick);};
  window.scrollTo(0,0);
}
/* Two Social Skills sets exist: the newer one opens from the tile; keep the original six games one tap away */
let oldSel=null;try{const hb=[...document.querySelectorAll('.top .stats button')].find(x=>/Social Skills/.test(x.textContent));if(hb&&typeof hb.onclick==='function')oldSel=hb.onclick;}catch(_){}
function addOlderSocial(){if(!oldSel||oldSel===G('selHub'))return;const app=document.getElementById('app');if(!app||app.querySelector('#hubOldSel'))return;
  app.insertAdjacentHTML('beforeend','<section class="panel"><button type="button" class="sel-card hub-oldsel" id="hubOldSel"><span class="sel-emoji">🦋</span><strong>More Social Skills games</strong><p>Plan B Power, Pause &amp; Choose, Friendship Studio, Feelings Detective, Problem-Solving Lab, Calm-Down Lab</p></button></section>');
  document.getElementById('hubOldSel').onclick=()=>{try{oldSel();}catch(e){}window.scrollTo(0,0);};}
window.RikiHub=hub;
/* Games list: just the games (plus the word-set picker), with a way back Home */
const prevMenu=G('menu');
if(typeof prevMenu==='function'){window.__hubMenu=function(){const r=prevMenu.apply(this,arguments);try{
  const app=document.getElementById('app');const gamesPanel=app&&app.querySelector('.games')&&app.querySelector('.games').closest('section');
  if(app&&gamesPanel){[...app.children].forEach(sec=>{if(sec!==gamesPanel&&!sec.classList.contains('settings'))sec.classList.add('hub-hide');});
    const h=gamesPanel.querySelector('.sectiontitle');if(h)h.textContent='Shoresh Games';
    if(!app.querySelector('.hub-back')){gamesPanel.insertAdjacentHTML('beforebegin','<button type="button" class="secondary hub-back" id="hubBack">← Home</button>');document.getElementById('hubBack').onclick=hub;}
    const set=app.querySelector('.settings');if(set)app.appendChild(set);}
}catch(e){}return r;};SET('menu=window.__hubMenu;');}
/* Header: Home, coins, settings. The rest lives on the Home screen. */
function header(){const stats=document.querySelector('.top .stats');if(!stats||document.getElementById('hubHomeBtn'))return;const sb=[...stats.querySelectorAll('button')].find(x=>/Social Skills/.test(x.textContent));if(sb){sb.id=sb.id||'hubSocialBtn';sb.onclick=()=>{const h=G('selHub');h&&h();window.scrollTo(0,0);};}const b=document.createElement('button');b.className='smallbtn';b.id='hubHomeBtn';b.textContent='🏠 Home';b.onclick=hub;stats.insertBefore(b,stats.firstChild);
  const brand=document.querySelector('.top .brand');if(brand){brand.style.cursor='pointer';brand.onclick=hub;}}
header();
if(!G('game'))hub();
})();

/* Doll & pet play mode (Claude, Oct 30): separate from decorating. Plays are earned by winning coins in games. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
/* ---- Doll & pet art v2: shaded, glossy, cute ---- */
const SKIN=['#ffe4d2','#f9dac3','#ffe8d9','#f4d2be','#ffdfcd'];
const HAIR=['#6b3f26','#2b1e1e','#ecc06a','#c9582e','#f5a6c9','#a184e8','#74c6ec'];
const OUTFIT=[['#ff8fbd','#ffd1e4'],['#a895ff','#e2dbff'],['#5fd0c0','#cdf5ef'],['#ffb547','#ffe9bf'],['#ff6f7d','#ffd5da'],['#6fa8ff','#d6e6ff']];
const STYLES=['long','pigtails','bun','bob','ponytail'];
const OUTS=['dress','tutu','overalls','hoodie','pajamas'];
const ACC=['none','bow','headband','crown','flower','cat-ears','glasses'];
const IRIS=['#8b6247','#4b86a3','#679777','#8c654b','#6e8b9b'];
let uid=0;
function shade(hex,amt){let c=parseInt(hex.slice(1),16),r=c>>16,g=c>>8&255,b=c&255;const f=v=>Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);}
const lg=(id,c,a=.22,b=-.12,vert=true)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}"><stop offset="0" stop-color="${shade(c,a)}"/><stop offset="1" stop-color="${shade(c,b)}"/></linearGradient>`;
const rg=(id,c,a=.25,b=-.1)=>`<radialGradient id="${id}" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${shade(c,a)}"/><stop offset="1" stop-color="${shade(c,b)}"/></radialGradient>`;
function eyesFor(id,expr,iris){
 const lid=(cx,flip)=>{const s=flip?-1:1;return `<path d="M${cx-11*s} ${64} C${cx-8*s} 55 ${cx+8*s} 54 ${cx+11*s} 62" stroke="#2a1622" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${cx-10.5*s} 63 q-3.5 -2 -4.5 -5.5 M${cx-9*s} 59.5 q-2.5 -3 -2.5 -6.5 M${cx-6*s} 57 q-1 -3.5 0 -6" stroke="#2a1622" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;};
 if(expr==='sleep')return [46,74].map((cx,i)=>{const s=i?1:-1;return `<path d="M${cx-10} 66 Q${cx} 74 ${cx+10} 66" stroke="#2a1622" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M${cx+10*s} 66 q${3*s} 1 ${5*s} 4 M${cx+6*s} 69.5 q${2*s} 2 ${2.5*s} 5" stroke="#2a1622" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;}).join('');
 const big=expr==='surprised'?1.12:1;const look={think:[2.5,-2.5],sad:[0,2],nervous:[-1.5,0]}[expr]||[0,0];
 return [46,74].map((cx,i)=>{const cid=`${id}c${i}`;const ex=cx+look[0],ey=67+look[1];
  return `<g transform="translate(${cx} 66) scale(${big}) translate(${-cx} -66)"><clipPath id="${cid}"><path d="M${cx-11} 66 C${cx-10} 55 ${cx+10} 55 ${cx+11} 65 C${cx+10} 76 ${cx-10} 77 ${cx-11} 66Z"/></clipPath>
   <path d="M${cx-11} 66 C${cx-10} 55 ${cx+10} 55 ${cx+11} 65 C${cx+10} 76 ${cx-10} 77 ${cx-11} 66Z" fill="#fff"/>
   <g clip-path="url(#${cid})"><circle cx="${ex}" cy="${ey}" r="8.6" fill="url(#${id}ir)"/><circle cx="${ex}" cy="${ey}" r="8.6" fill="none" stroke="${shade(iris,-.45)}" stroke-width="1.2"/><circle cx="${ex}" cy="${ey+.5}" r="4.2" fill="#1d0f18"/>
   <path d="M${ex-6} ${ey+3} q6 5 12 0" stroke="${shade(iris,.55)}" stroke-width="2" fill="none" opacity=".8"/><path d="M${cx-12} 58 h24 v4 h-24z" fill="#2a1622" opacity=".18"/></g>
   <ellipse cx="${ex-3}" cy="${ey-3.5}" rx="3.2" ry="2.6" fill="#fff"/><circle cx="${ex+3.4}" cy="${ey+3.6}" r="1.3" fill="#fff"/>
   ${lid(cx,i===1)}<path d="M${cx-7} 75 q7 3 14 0" stroke="#2a1622" stroke-width="1" fill="none" opacity=".35"/></g>`;}).join('');}
function browsFor(expr){const B={sad:['M37 50 q6 -1 12 -5','M71 45 q6 4 12 5'],nervous:['M37 50 q6 -2 12 -5','M71 45 q6 3 12 5'],upset:['M37 46 q6 2 12 6','M71 52 q6 -4 12 -6'],surprised:['M37 46 q6 -6 12 -3','M71 43 q6 -3 12 3'],think:['M37 49 q6 -4 12 -2','M71 45 q6 -3 12 1']}[expr]||['M37 49 q6 -5 12 -3','M71 46 q6 -2 12 3'];return B.map(d=>`<path d="${d}" stroke="#4a2a30" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55" transform="translate(0 -3)"/>`).join('');}
function mouthFor(expr){return {happy:'<path d="M52 83 Q60 93 68 83 Q60 86.5 52 83Z" fill="#d6456f" stroke="#a8315a" stroke-width="1.4" stroke-linejoin="round"/><path d="M55 86 q5 3 10 0" stroke="#ff9fb8" stroke-width="1.6" fill="none"/>',
  excited:'<path d="M50 82 Q60 98 70 82 Q60 85 50 82Z" fill="#c43a63" stroke="#9c2a52" stroke-width="1.4" stroke-linejoin="round"/><path d="M53 83.5 q7 2 14 0 v2 q-7 2 -14 0z" fill="#fff"/><ellipse cx="60" cy="91" rx="5" ry="2.6" fill="#ff8fab"/>',
  sad:'<path d="M53 88 Q60 82 67 88" stroke="#a8315a" stroke-width="2.4" fill="none" stroke-linecap="round"/>',upset:'<path d="M53 87 q7 -3 14 0" stroke="#a8315a" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
  surprised:'<ellipse cx="60" cy="87" rx="4.5" ry="5.5" fill="#c43a63" stroke="#9c2a52" stroke-width="1.4"/>',nervous:'<path d="M52 87 q2 -3 4 0 t4 0 t4 0 t4 0" stroke="#a8315a" stroke-width="2" fill="none" stroke-linecap="round"/>',
  think:'<path d="M55 86 q6 2 11 -2" stroke="#a8315a" stroke-width="2.2" fill="none" stroke-linecap="round"/>',neutral:'<path d="M54 84 Q60 89.5 66 84" stroke="#a8315a" stroke-width="2.3" fill="none" stroke-linecap="round"/>',
  sleep:'<ellipse cx="60" cy="86" rx="2.6" ry="2" fill="#c45a78"/>'}[expr]||'';}
function doll(d,pose='stand',expr,crop){
 d=d||{};expr=expr||(pose==='sleep'?'sleep':pose==='wave'?'excited':'happy');const id='dl'+(++uid);
 const garment=wearBy(d.dressId),shoe=wearBy(d.shoeId);
 const profile=({riki:{iris:'#936747',face:'M28 47Q28 24 60 24Q92 24 92 47V70Q92 87 77 96Q60 108 43 96Q28 87 28 70Z',eyes:1},maya:{iris:'#648ca5',face:'M29 46Q31 23 60 23Q89 23 91 46V68Q90 88 73 99Q60 107 47 99Q30 88 29 68Z',eyes:.92},lily:{iris:'#759b7c',face:'M26 48Q26 23 60 23Q94 23 94 48V70Q94 96 60 102Q26 96 26 70Z',eyes:1.04},zoe:{iris:'#a47649',face:'M28 47Q28 24 60 24Q92 24 92 47V69Q90 86 60 103Q30 86 28 69Z',eyes:.96},ava:{iris:'#689ba0',face:'M30 46Q30 23 60 23Q90 23 90 46V71Q89 95 60 105Q31 95 30 71Z',eyes:1.02},luna:{iris:'#777da5',face:'M27 47Q28 23 60 23Q92 23 93 47V70Q91 91 60 103Q29 91 27 70Z',eyes:.94}}[d.identity]||{iris:IRIS[(d.hair||0)%IRIS.length],face:'M28 47Q28 24 60 24Q92 24 92 47V70Q92 87 77 96Q60 108 43 96Q28 87 28 70Z',eyes:1});
 const sk=SKIN[d.skin]||SKIN[0],hair=HAIR[d.hair]||HAIR[0],[dress,trim]=garment?[garment.c,garment.trim]:(OUTFIT[d.color]||OUTFIT[0]),dark=shade(hair,-.3),edge=shade(dress,-.22),style=STYLES[d.style]||'long',out=garment?(garment.pattern==='ballet'?'tutu':'dress'):(OUTS[d.out]||'dress'),acc=ACC[d.acc]||'none',iris=profile.iris;
 const defs=`<defs>${rg(id+'skin',sk,.12,-.1)}${lg(id+'hair',hair,.2,-.2)}${lg(id+'dress',dress,.17,-.12)}${lg(id+'trim',trim,.12,-.08)}${rg(id+'ir',iris,.22,-.45)}<radialGradient id="${id}blush"><stop stop-color="#eea6ad" stop-opacity=".6"/><stop offset="1" stop-color="#eea6ad" stop-opacity="0"/></radialGradient></defs>`;
 const bow=(x,y,c=dress,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0Q-16-13-15 1Q-17 12 0 2Q17 12 15 1Q16-13 0 0" fill="${c}" stroke="${shade(c,-.18)}" stroke-width="1"/><path d="M-3 3l-5 11 5-2 2 3 3-11M3 3l5 11-5-2-2 3-3-11" fill="${c}"/><ellipse rx="3.5" ry="4" fill="${shade(c,-.12)}"/><path d="M-12 0l8 1M12 0L4 1" stroke="#fff" opacity=".45" fill="none"/></g>`;
 const hairBack=style==='long'?`<path d="M26 38C17 56 17 104 24 128Q32 144 43 130L79 130Q99 136 97 105L94 38Z" fill="url(#${id}hair)" stroke="${dark}"/><path d="M27 76q-3 35 6 52M90 76q6 33-3 52M32 93q-1 23 4 31" stroke="${shade(hair,.18)}" fill="none" stroke-width="2"/>`:style==='pigtails'?`<path d="M29 46C3 36 10 82 19 100Q24 110 30 102Q22 82 35 60M91 46C117 36 110 82 101 100Q96 110 90 102Q98 82 85 60" fill="url(#${id}hair)" stroke="${dark}"/>${bow(24,58,trim,.45)}${bow(96,58,trim,.45)}`:style==='bun'?`<circle cx="60" cy="20" r="16" fill="url(#${id}hair)" stroke="${dark}"/><path d="M49 14q11-8 20 1M48 22q12 8 24-1" fill="none" stroke="${shade(hair,.25)}"/>`:style==='ponytail'?`<path d="M88 29Q116 32 105 64Q99 80 102 103Q86 102 88 82Q97 53 80 47Z" fill="url(#${id}hair)" stroke="${dark}"/>${bow(96,38,trim,.5)}`:`<path d="M26 37Q12 77 25 102Q60 118 95 102Q108 77 94 37" fill="url(#${id}hair)" stroke="${dark}"/>`;
 const legs=`<path d="M47 158l-1 27M73 158l1 27" stroke="${shade(sk,-.16)}" stroke-width="11" stroke-linecap="round"/><path d="M47 158l-1 27M73 158l1 27" stroke="${sk}" stroke-width="8.5" stroke-linecap="round"/><path d="M46 178v9M74 178v9" stroke="#fffaf8" stroke-width="10"/>${shoe?shoeArt(shoe):`<path d="M40 184q5-4 11 0l1 7q-4 8-16 3q-2-5 4-10M80 184q-5-4-11 0l-1 7q4 8 16 3q2-5-4-10" fill="${edge}" stroke="${shade(edge,-.18)}"/><path d="M39 188h12M69 188h12" stroke="${trim}" stroke-width="2.4"/><path d="M38 194h13M69 194h13" stroke="#fff" stroke-opacity=".65" stroke-width="1.3"/>`}`;
 const sleeve=`<path d="M43 111q-10 0-13 13l10 5 7-12M77 111q10 0 13 13l-10 5-7-12" fill="url(#${id}dress)" stroke="${edge}"/>`;
 const arms=pose==='wave'?`<path d="M35 124q-10-6-12-20l-1-9" fill="none" stroke="${shade(sk,-.14)}" stroke-width="9" stroke-linecap="round"/><path d="M35 124q-10-6-12-20l-1-9" fill="none" stroke="${sk}" stroke-width="7" stroke-linecap="round"/><path d="M20 102C17 101 16 99 16 96V90Q16 88 18 89L20 95V85Q21 82 23 85V94L24 84Q26 82 27 85L26 95L29 89Q31 87 32 90L29 99L33 97Q36 97 34 100L29 105Q24 108 20 102Z" fill="url(#${id}skin)" stroke="${shade(sk,-.17)}" stroke-width=".8"/>`:`<path d="M35 125l-5 20" stroke="${shade(sk,-.17)}" stroke-width="9" stroke-linecap="round"/><path d="M35 125l-5 20" stroke="${sk}" stroke-width="7" stroke-linecap="round"/><path d="M28 141C25 143 25 149 28 152Q31 154 34 151L35 146Q35 144 33 144L32 147" fill="${sk}" stroke="${shade(sk,-.17)}" stroke-width=".8"/>`;
 const rightArm=`<path d="M85 125l5 20" stroke="${shade(sk,-.17)}" stroke-width="9" stroke-linecap="round"/><path d="M85 125l5 20" stroke="${sk}" stroke-width="7" stroke-linecap="round"/><path d="M92 141C95 143 95 149 92 152Q89 154 86 151L85 146Q85 144 87 144L88 147" fill="${sk}" stroke="${shade(sk,-.17)}" stroke-width=".8"/>`;
 let body='';
 if(out==='dress'||out==='tutu')body=`<path d="M44 110Q60 104 76 110L73 135H47Z" fill="url(#${id}dress)" stroke="${edge}"/><path d="M49 109q11 13 22 0l-4-3H53Z" fill="${trim}"/><path d="M47 135Q42 151 34 164Q60 178 86 164Q78 151 73 135Z" fill="url(#${id}dress)" stroke="${edge}"/><path d="M46 136h28" stroke="${trim}" stroke-width="4"/><path d="M47 143l-5 19M56 144l-2 23M65 144l3 23M73 143l6 19" fill="none" stroke="${shade(dress,-.12)}" stroke-width="1.2"/><path d="M36 164q24 12 48 0" fill="none" stroke="${trim}" stroke-width="4"/>${out==='tutu'?`<path d="M44 140L31 160Q60 180 89 160L76 140" fill="${trim}" opacity=".55"/>`:''}${bow(60,135,trim,.42)}${garment?dressPrint(garment):[[48,152],[65,157],[73,148],[55,164]].map(([x,y])=>`<g transform="translate(${x} ${y})" fill="#fff" opacity=".8"><circle cx="0" cy="0" r="1.3"/><path d="M-3 0h6M0-3v6" stroke="#fff" stroke-width="1.2"/></g>`).join('')}`;
 else{body=`<path d="M43 110Q60 104 77 110L78 142H42Z" fill="url(#${id}dress)" stroke="${edge}"/><path d="M47 140h26l5 29H63l-3-21-3 21H42Z" fill="${out==='overalls'?trim:dress}" stroke="${edge}"/><path d="M50 109q10 10 20 0" fill="none" stroke="${trim}" stroke-width="3"/>`;
 if(out==='overalls')body+=`<path d="M47 111v24h26v-24M50 126h20v11q-10 6-20 0Z" fill="${trim}" stroke="${edge}"/><circle cx="49" cy="121" r="2" fill="${dress}"/><circle cx="71" cy="121" r="2" fill="${dress}"/>`;
 if(out==='hoodie')body+=`<path d="M47 113q13 13 26 0M49 130h22l3 9H46Z" fill="none" stroke="${trim}" stroke-width="2"/><path d="M56 118v9M64 118v9" stroke="${trim}"/>`;
 if(out==='pajamas')body+=`<path d="M60 117v23" stroke="${trim}" stroke-width="1.4"/>${[121,128,135].map(y=>`<circle cx="62" cy="${y}" r="1.2" fill="${trim}"/>`).join('')}<path d="M70 122a5 5 0 1 0 0 9a4 4 0 0 1 0-9" fill="${trim}"/>`;}
 const bangs=style==='bob'?`<path d="M24 61Q19 19 59 18Q103 17 96 61L84 54L83 35Q71 51 54 50L58 38Q45 52 24 61" fill="url(#${id}hair)" stroke="${dark}"/>`:`<path d="M24 62Q17 22 48 18Q80 7 95 34Q101 48 95 64Q86 54 84 38Q74 53 55 55Q63 47 65 36Q49 52 26 57Z" fill="url(#${id}hair)" stroke="${dark}"/><path d="M29 46q13-20 31-21M73 24q13 7 15 23M33 50q9-6 14-12" stroke="${shade(hair,.28)}" stroke-width="2" stroke-linecap="round" fill="none" opacity=".65"/>`;
 const extra=acc==='bow'?bow(85,32,dress,.72):acc==='headband'?`<path d="M25 45Q60 2 95 45" fill="none" stroke="${dress}" stroke-width="4"/>${bow(84,30,trim,.5)}`:acc==='crown'?`<path d="M46 25L45 12L53 18L60 7L67 18L75 12L74 25Z" fill="#ecd39a" stroke="#ba975b" stroke-width=".9"/><circle cx="60" cy="19" r="2.5" fill="${dress}"/>`:acc==='flower'?`<g transform="translate(87 33)">${[0,72,144,216,288].map(a=>`<ellipse rx="3.5" ry="6" transform="rotate(${a}) translate(0 -4)" fill="${trim}"/>`).join('')}<circle r="3" fill="#e9bf68"/></g>`:acc==='cat-ears'?`<path d="M28 37L28 15L44 26M92 37L92 15L76 26" fill="url(#${id}hair)" stroke="${dark}"/><path d="M31 28v-7l7 5M89 28v-7l-7 5" fill="${trim}"/>`:'';
 const glasses=acc==='glasses'?'<g stroke="#8b6781" stroke-width="1.5" fill="none"><circle cx="46" cy="66" r="12"/><circle cx="74" cy="66" r="12"/><path d="M58 65h4M34 63l-9-3M86 63l9-3"/></g>':'';
 const mouth=expr==='happy'?'<path d="M53 84q7 8 14 0" fill="none" stroke="#b66c77" stroke-width="1.7" stroke-linecap="round"/><path d="M57 89q3 1 6 0" stroke="#e8a6ad" fill="none" stroke-width="1.5"/>':mouthFor(expr);
 const ids=['riki','maya','lily','zoe','ava','luna'],base=ids.indexOf(d.identity),original=base<0?0:base,defaults=[0,1,2,3,4,0];
 const sprite=d.style===undefined||d.style===defaults[original]?original:[0,1,2,3,4][d.style]??original;
 const centers=[204,552,906,1256,1610,1990],edges=[0,388,728,1086,1460,1803,2172],cx=centers[sprite];
 const image='assets/images/dolls/soft-toy-dolls.webp?v=wardrobe-6';
 const masks=['0,0 120,0 120,204 0,204','16,0 104,0 104,48 120,60 120,204 0,204 0,60 16,48','0,0 120,0 120,35 99,40 95,110 120,120 120,204 0,204','16,0 120,0 120,204 0,204 0,50 16,40','0,0 120,0 120,204 0,204','16,0 120,0 120,204 0,204 0,60 16,45'];
 const art=`<defs><clipPath id="${id}spritecrop"><polygon points="${masks[sprite]}"/></clipPath></defs><g clip-path="url(#${id}spritecrop)"><svg x="0" y="0" width="120" height="204" viewBox="${cx-213} 0 426 724"><defs><clipPath id="${id}cell"><rect x="${edges[sprite]}" y="0" width="${edges[sprite+1]-edges[sprite]}" height="724"/></clipPath></defs><g clip-path="url(#${id}cell)"><image href="${image}" width="2172" height="724"/></g></svg></g>`;
 const hairColor=HAIR[d.hair]||HAIR[original],changeHair=d.hair!==undefined&&d.hair!==sprite;
 const rgb=[1,3,5].map(i=>parseInt(hairColor.slice(i,i+2),16)/255);
 const tint=changeHair?`<defs><mask id="${id}hairmask"><rect width="120" height="140" fill="white"/><ellipse cx="60" cy="71" rx="37" ry="31" fill="black"/><rect x="35" y="101" width="50" height="45" fill="black"/></mask><filter id="${id}tint"><feColorMatrix values="${rgb.map(c=>`${.2126*c} ${.7152*c} ${.0722*c} 0 ${c*.28}`).join(' ')} 0 0 0 1 0"/></filter></defs><g mask="url(#${id}hairmask)" filter="url(#${id}tint)">${art}</g>`:'';
 const facial=!['happy','excited','neutral'].includes(expr)?`<defs><radialGradient id="${id}mouthblend"><stop offset=".7" stop-color="#f8d5c2"/><stop offset="1" stop-color="#f8d5c2" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="86" rx="12" ry="7" fill="url(#${id}mouthblend)"/>${mouthFor(expr)}${browsFor(expr)}`:'';
 const identityFace=sprite!==original?`<defs><clipPath id="${id}identity"><ellipse cx="60" cy="77" rx="29" ry="22"/></clipPath></defs><g clip-path="url(#${id}identity)"><svg width="120" height="204" viewBox="${centers[original]-213} 0 426 724"><image href="${image}" width="2172" height="724"/></svg></g>`:'';
 const extras=d.acc!==undefined&&d.acc!==[1,3,2,4,5,3][original]?extra+glasses:'';
 const speechMouth=`<g class="pd-speech-mouth" aria-hidden="true"><ellipse cx="60" cy="86" rx="8.5" ry="6.5" fill="${sk}"/><ellipse class="pd-speech-mouth-shape" cx="60" cy="87" rx="4.5" ry="2.2" fill="#a8315a"/><path d="M57 87q3 2 6 0" stroke="#ff9fb8" stroke-width="1" fill="none"/></g>`;
 return `<svg class="pd-doll" viewBox="${crop?'0 0 120 118':'0 0 120 204'}" aria-hidden="true" data-skin-tone="${sk}" data-art-style="soft-3d-toy" data-doll-identity="${d.identity||'guest'}" data-dress="${garment?.id||'saved'}" data-shoes="${shoe?.id||'saved'}">${defs}${art}${tint}${identityFace}${out==='dress'||out==='tutu'?(garment?(wearGroup(garment)==='pajamas'?pajamaArt(garment):dressArt(garment)):signatureDress(d.color||0)):sleeve+body}${shoe?toyFeet(shoe):''}${facial}${extras}${dollAccessories(d)}${speechMouth}</svg>`;
}

const PETS={puppy:{name:'Puppy',c:'#eebd84',d:'#a86f3e',e:'#5a3420'},kitty:{name:'Kitty',c:'#c9c2d6',d:'#7c7290',e:'#4fae7a'},bunny:{name:'Bunny',c:'#fff6f8',d:'#efc3d2',e:'#c9558a'},
 unicorn:{name:'Unicorn',c:'#fffaff',d:'#c9b0ff',e:'#8a5cf0'},hamster:{name:'Hamster',c:'#f5c690',d:'#fff4e2',e:'#3a2416'},panda:{name:'Panda',c:'#ffffff',d:'#2f2a33',e:'#2a1a24'}};
function petBase(kind,mood='happy'){const p=PETS[kind]||PETS.puppy;const id='pt'+(++uid);const c=p.c,d=p.d,o=shade(c,-.28);
 const fluffy=(cx,cy,rx,ry,n)=>{let s='';for(let i=0;i<n;i++){const a=i/n*Math.PI*2,a2=(i+.5)/n*Math.PI*2;const x1=cx+Math.cos(a)*rx,y1=cy+Math.sin(a)*ry,x2=cx+Math.cos(a2)*rx*1.09,y2=cy+Math.sin(a2)*ry*1.09,x3=cx+Math.cos((i+1)/n*Math.PI*2)*rx,y3=cy+Math.sin((i+1)/n*Math.PI*2)*ry;s+=(i?'':`M${x1.toFixed(1)} ${y1.toFixed(1)}`)+` Q${x2.toFixed(1)} ${y2.toFixed(1)} ${x3.toFixed(1)} ${y3.toFixed(1)}`;}return s+'Z';};
 const defs=`<defs>${rg(id+'b',c,.25,-.08)}${rg(id+'d',d,.25,-.1)}<radialGradient id="${id}bl"><stop offset="0" stop-color="#ff7fa3" stop-opacity=".7"/><stop offset="1" stop-color="#ff7fa3" stop-opacity="0"/></radialGradient><radialGradient id="${id}e" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="${shade(p.e,.4)}"/><stop offset="1" stop-color="${shade(p.e,-.5)}"/></radialGradient></defs>`;
 const ears={puppy:`<path d="M24 34 C8 34 8 66 18 74 C26 72 30 54 32 42Z M76 34 C92 34 92 66 82 74 C74 72 70 54 68 42Z" fill="url(#${id}d)" stroke="${shade(d,-.3)}" stroke-width="1.4"/>`,
  kitty:`<path d="M20 44 L22 12 L44 30Z M80 44 L78 12 L56 30Z" fill="url(#${id}b)" stroke="${o}" stroke-width="1.4" stroke-linejoin="round"/><path d="M25 37 L26 20 L37 30Z M75 37 L74 20 L63 30Z" fill="#ffb8cc"/>`,
  bunny:`<path d="M30 34 C22 -8 42 -8 42 32Z M70 34 C78 -8 58 -8 58 32Z" fill="url(#${id}b)" stroke="#e9c9d4" stroke-width="1.6"/><path d="M33 30 C28 2 39 2 39 30Z M67 30 C72 2 61 2 61 30Z" fill="#ffc4d6"/>`,
  unicorn:`<path d="M22 40 L26 18 L40 32Z M78 40 L74 18 L60 32Z" fill="url(#${id}b)" stroke="#e2d4ff" stroke-width="1.4"/><path d="M50 2 L43 30 H57Z" fill="#ffd34d" stroke="#e0a800" stroke-width="1.2"/><path d="M45 24 l10 -3 M46 17 l8 -2.5 M48 10 l4 -1.2" stroke="#fff6c4" stroke-width="1.6"/><path d="M30 32 C14 42 14 66 22 78 C22 60 30 48 38 42Z" fill="#ff9ccf"/><path d="M36 28 C26 40 28 58 34 64 C34 50 40 40 46 34Z" fill="#9fd6ff"/><path d="M40 26 C36 34 38 44 42 48 C42 40 46 34 50 30Z" fill="#c8f2a0"/>`,
  hamster:`<circle cx="25" cy="30" r="10" fill="url(#${id}b)" stroke="${o}" stroke-width="1.3"/><circle cx="75" cy="30" r="10" fill="url(#${id}b)" stroke="${o}" stroke-width="1.3"/><circle cx="25" cy="30" r="5.5" fill="#ffb8cc"/><circle cx="75" cy="30" r="5.5" fill="#ffb8cc"/>`,
  panda:`<circle cx="23" cy="28" r="12" fill="url(#${id}d)"/><circle cx="77" cy="28" r="12" fill="url(#${id}d)"/>`}[kind];
 const patch=kind==='panda'?`<ellipse cx="37" cy="55" rx="10" ry="12" fill="url(#${id}d)" transform="rotate(-25 37 55)"/><ellipse cx="63" cy="55" rx="10" ry="12" fill="url(#${id}d)" transform="rotate(25 63 55)"/>`:kind==='hamster'?`<ellipse cx="50" cy="66" rx="22" ry="14" fill="${d}"/>`:kind==='puppy'?`<ellipse cx="64" cy="46" rx="11" ry="10" fill="${d}" opacity=".55"/>`:kind==='kitty'?`<path d="M44 30 l2 8 M50 29 v9 M56 30 l-2 8" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`:'';
 const eye=mood==='sleep'?`<path d="M32 56 q6 5 12 0 M56 56 q6 5 12 0" stroke="#2a1a24" stroke-width="2.6" fill="none" stroke-linecap="round"/>`:mood==='love'?`<path d="M38 50 c-4.5-6-12 0-6 6 l6 6 6-6 c6-6-1.5-12-6-6z M62 50 c-4.5-6-12 0-6 6 l6 6 6-6 c6-6-1.5-12-6-6z" fill="#ff4f8b" stroke="#d62e6a" stroke-width="1"/><path d="M33 51 q2 -2 4 -1 M57 51 q2 -2 4 -1" stroke="#fff" stroke-width="1.4"/>`
  :[38,62].map(x=>`<ellipse cx="${x}" cy="55" rx="7" ry="8" fill="url(#${id}e)"/><ellipse cx="${x}" cy="56" rx="3.6" ry="4.2" fill="#140a10"/><ellipse cx="${x-2.6}" cy="51.5" rx="2.8" ry="2.4" fill="#fff"/><circle cx="${x+2.6}" cy="59" r="1.3" fill="#fff"/>`).join('');
 const tail={kitty:`<path d="M72 92 C94 90 96 70 88 62" stroke="${o}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M72 92 C94 90 96 70 88 62" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`,puppy:`<path d="M74 86 q14 -6 12 -20" stroke="${shade(d,-.3)}" stroke-width="8" fill="none" stroke-linecap="round" class="pd-wag"/><path d="M74 86 q14 -6 12 -20" stroke="${d}" stroke-width="6" fill="none" stroke-linecap="round" class="pd-wag"/>`,bunny:`<path d="${fluffy(77,92,7,7,7)}" fill="#fff" stroke="#eed7df" stroke-width="1"/>`,unicorn:`<path d="M74 90 C92 92 96 76 92 66 C88 76 82 82 74 84Z" fill="#ff9ccf"/><path d="M74 88 C88 88 92 80 90 72" stroke="#9fd6ff" stroke-width="3" fill="none"/>`}[kind]||'';
 return `<svg class="pd-pet" viewBox="0 0 100 110" aria-hidden="true">${defs}<ellipse cx="50" cy="106" rx="26" ry="4" fill="#4a2338" opacity=".16"/>
  ${tail}<path d="${fluffy(50,88,26,17,12)}" fill="url(#${id}b)" stroke="${o}" stroke-width="1.3"/><ellipse cx="50" cy="92" rx="14" ry="9" fill="#fff" opacity=".35"/>
  ${[36,64].map(x=>`<ellipse cx="${x}" cy="102" rx="8.5" ry="5.5" fill="url(#${id}b)" stroke="${o}" stroke-width="1.3"/><path d="M${x-3} 101 v2 M${x} 100.5 v2.5 M${x+3} 101 v2" stroke="${o}" stroke-width="1" stroke-linecap="round"/>`).join('')}
  ${ears}<path d="${fluffy(50,56,33,29,14)}" fill="url(#${id}b)" stroke="${o}" stroke-width="1.4"/>
  ${patch}${eye}<ellipse cx="27" cy="66" rx="7" ry="4.5" fill="url(#${id}bl)"/><ellipse cx="73" cy="66" rx="7" ry="4.5" fill="url(#${id}bl)"/>
  <path d="M46 62 q4 -3 8 0 q-1 4 -4 5 q-3 -1 -4 -5z" fill="#3a2430"/><ellipse cx="48.6" cy="62.5" rx="1.4" ry=".8" fill="#fff" opacity=".8"/>
  <path d="M44 70 q6 5 6 -1 q0 6 6 1" stroke="#3a2430" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${mood!=='sleep'&&kind==='puppy'?`<path d="M47 72 q3 9 6 0z" fill="#ff7a9c" stroke="#d65a7c" stroke-width=".8"/>`:''}
  ${kind==='kitty'||kind==='hamster'?`<path d="M18 64 h10 M18 69 l10 -2 M82 64 h-10 M82 69 l-10 -2" stroke="${shade(c,-.35)}" stroke-width="1" stroke-linecap="round"/>`:''}
 </svg>`;}
function pet(kind,mood='happy'){
 const order=['puppy','kitty','bunny','unicorn','hamster','panda'],n=Math.max(0,order.indexOf(kind)),x=n%3*512,y=Math.floor(n/3)*512,id='petcell'+(++uid);
 return `<svg class="pd-pet" viewBox="0 0 100 120" aria-hidden="true" data-pet-kind="${kind}" data-art-style="soft-3d-toy"><svg x="2" y="5" width="96" height="110" viewBox="${x} ${y} 512 512" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="512" height="512"/></clipPath></defs><g clip-path="url(#${id})"><image href="assets/images/dolls/pet-collection.webp?v=pet-style-7" width="1536" height="1024"/></g></svg>${petExtras(kind)}${mood==='love'?'<path d="M84 24C72 16 77 8 84 15C91 8 96 16 84 24Z" fill="#e896b4"/>':''}</svg>`;
}
/* auto-shading for room art: every flat fill gets a soft top-light gradient */
function shadeArt(svg){const seen={};let defs='';const out=svg.replace(/fill="(#[0-9a-fA-F]{6})"/g,(m,c)=>{const k='g'+c.slice(1);if(!seen[k]){seen[k]=1;defs+=lg(k,c,.18,-.1);}return `fill="url(#${k})"`;});
 const svgOut=out.replace(/<g data-spot=/g,'<g filter="url(#soft)" data-spot=');return `<defs>${defs}<filter id="soft" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#5a2a40" flood-opacity=".22"/></filter></defs>`+svgOut;}

/* ---- Play mode ---- */
const KEY='rikiPlayTokensV1';
const DOLLS=[{id:'riki',name:'Riki',cost:0,look:{skin:0,hair:0,style:0,color:0,out:0,acc:1}},{id:'maya',name:'Maya',cost:0,look:{skin:2,hair:1,style:1,color:1,out:1,acc:3}},
 {id:'lily',name:'Lily',cost:60,look:{skin:1,hair:2,style:2,color:2,out:0,acc:2}},{id:'zoe',name:'Zoe',cost:60,look:{skin:3,hair:3,style:3,color:3,out:0,acc:4}},
 {id:'ava',name:'Ava',cost:80,look:{skin:4,hair:4,style:4,color:4,out:0,acc:5}},{id:'luna',name:'Luna',cost:100,look:{skin:0,hair:5,style:0,color:5,out:1,acc:3}}];
const PETCOST={puppy:0,kitty:50,bunny:50,hamster:50,panda:90,unicorn:120};
const fresh=()=>({tokens:5,carry:0,dolls:['riki','maya'],pets:['puppy'],doll:'riki',pet:'puppy',looks:{},room:'bed',plays:0});
let S=(()=>{try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return fresh();}})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const look=id=>({...DOLLS.find(d=>d.id===id).look,...S.looks[id],identity:id,dressId:WARD.equipped[id]?.dress,shoeId:WARD.equipped[id]?.shoes,hairAccessoryId:WARD.equipped[id]?.hair,earringId:WARD.equipped[id]?.earrings});
/* Clothing is saved separately; existing doll looks and house inventory stay intact. */
const CLOTHES=[
 {id:'daydress',kind:'dress',name:'Rose day dress',cost:0,c:'#f394b6',trim:'#ffe3ed',pattern:'dots'},
 {id:'berrydress',kind:'dress',name:'Strawberry picnic dress',cost:18,c:'#ed819b',trim:'#ffe5dc',pattern:'berry'},
 {id:'daisydress',kind:'dress',name:'Daisy garden dress',cost:20,c:'#ecc76c',trim:'#fff9dd',pattern:'daisy'},
 {id:'cloudress',kind:'dress',name:'Blue cloud dress',cost:22,c:'#88bde5',trim:'#eef8ff',pattern:'cloud'},
 {id:'balletdress',kind:'dress',name:'Blush ballet dress',cost:25,c:'#e8a6c5',trim:'#fff1f8',pattern:'ballet'},
 {id:'lavenderdress',kind:'dress',name:'Lavender party dress',cost:28,c:'#ad99db',trim:'#f2eaff',pattern:'sparkle'},
 {id:'mintdress',kind:'dress',name:'Mint ribbon dress',cost:24,c:'#8dc9b7',trim:'#eafff4',pattern:'ribbon'},
 {id:'nightdress',kind:'dress',group:'pajamas',pj:0,name:'Starry cotton pajamas',cost:20,c:'#8f9fd9',trim:'#fff1bb',pattern:'stars'},
 {id:'mintpajamas',kind:'dress',group:'pajamas',pj:1,name:'Mint cloud pajamas',cost:20,c:'#a6cdc2',trim:'#f4fffa'},
 {id:'pinkpajamas',kind:'dress',group:'pajamas',pj:2,name:'Pink short pajamas',cost:18,c:'#e7afc3',trim:'#fff1f7'},
 {id:'pinkhairbow',kind:'hair',name:'Rose satin hair bow',cost:6,c:'#dc92b1',trim:'#fff1f6',shape:'bow'},
 {id:'minthairbow',kind:'hair',name:'Mint satin hair bow',cost:6,c:'#9acdbd',trim:'#effff6',shape:'bow'},
 {id:'daisyhairclip',kind:'hair',name:'Daisy hair clip',cost:8,c:'#fff7e6',trim:'#e4bf69',shape:'flower'},
 {id:'starhairclip',kind:'hair',name:'Golden star hair clip',cost:8,c:'#e8cb80',trim:'#fff6d4',shape:'star'},
 {id:'pearlearrings',kind:'earrings',name:'Tiny pearl earrings',cost:8,c:'#fff0e1',trim:'#c8a66f',shape:'pearl'},
 {id:'starearrings',kind:'earrings',name:'Little star earrings',cost:10,c:'#e5c574',trim:'#fff5cb',shape:'star'},
 {id:'heartearrings',kind:'earrings',name:'Pink heart earrings',cost:10,c:'#e8a2bd',trim:'#ffe7f1',shape:'heart'},
 {id:'sneakers',kind:'shoes',name:'Everyday sneakers',cost:0,c:'#f5eff5',trim:'#caafc7',shape:'sneakers'},
 {id:'pinkflats',kind:'shoes',name:'Pink bow flats',cost:12,c:'#d887ab',trim:'#ffe1ef',shape:'flats'},
 {id:'blueflats',kind:'shoes',name:'Blue Mary Janes',cost:14,c:'#7da8d1',trim:'#f5e8bf',shape:'maryjane'},
 {id:'lavendershoes',kind:'shoes',name:'Lavender ballet shoes',cost:16,c:'#af94cd',trim:'#f7e8ff',shape:'ballet'},
 {id:'mintboots',kind:'shoes',name:'Mint rain boots',cost:18,c:'#7abeb0',trim:'#e5f9e8',shape:'boots'},
 {id:'goldshoes',kind:'shoes',name:'Golden party shoes',cost:20,c:'#c5a25c',trim:'#fff3c7',shape:'flats'}
];
const PET_GEAR=[
 {id:'petrosebow',kind:'pet',slot:'bow',name:'Rose pet bow',cost:5,c:'#e7a1bc',trim:'#fff0f7',shape:'bow'},
 {id:'petmintbow',kind:'pet',slot:'bow',name:'Mint pet bow',cost:5,c:'#9fcdbf',trim:'#f0fff8',shape:'bow'},
 {id:'petdaisyclip',kind:'pet',slot:'clip',name:'Daisy pet clip',cost:6,c:'#fff7e8',trim:'#e7c267',shape:'flower'},
 {id:'petstarclip',kind:'pet',slot:'clip',name:'Little star pet clip',cost:6,c:'#e8c977',trim:'#fff8d8',shape:'star'},
 {id:'petrosebandana',kind:'pet',slot:'bandana',name:'Rose heart bandana',cost:7,c:'#dba0b5',trim:'#fff1f6',shape:'bandana'},
 {id:'petbluebandana',kind:'pet',slot:'bandana',name:'Cloud-blue bandana',cost:7,c:'#9cbfdf',trim:'#f1faff',shape:'bandana'},
 {id:'petmintcollar',kind:'pet',slot:'collar',name:'Mint heart collar',cost:8,c:'#8fbdad',trim:'#ead399',shape:'collar'},
 {id:'petlavendercollar',kind:'pet',slot:'collar',name:'Lavender star collar',cost:8,c:'#b4a1d0',trim:'#ead399',shape:'collar'}
];
CLOTHES.push(...PET_GEAR);
function petGearArt(item,x=50,y=70,scale=1){if(['bow','flower','star'].includes(item.shape))return `<g data-pet-accessory="${item.id}">${accessoryArt(item,x,y,scale)}</g>`;const id='pg'+(++uid);return `<defs>${rg(id,item.c,.3,-.2)}</defs><g data-pet-accessory="${item.id}" transform="translate(${x} ${y}) scale(${scale})">${item.shape==='bandana'?`<path d="M-18-5q18 8 36 0L0 18Z" fill="url(#${id})" stroke="${shade(item.c,-.2)}" stroke-width=".7"/><path d="M-12 0L0 12 12 0" fill="none" stroke="${item.trim}" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M0 4C-7-1-3-5 0-2C3-5 7-1 0 4" fill="${item.trim}"/>`:`<path d="M-18-2q18 8 36 0" fill="none" stroke="url(#${id})" stroke-width="6" stroke-linecap="round"/><path d="M-14-3q14 4 28 0" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/><circle cy="9" r="5" fill="${item.trim}" stroke="#b69b61" stroke-width=".6"/><path d="M0 11C-6 7-3 4 0 7C3 4 6 7 0 11" fill="${item.c}"/>`}</g>`;}
function petExtras(kind){const e=WARD.petEquipped?.[kind]||{},neck={puppy:74,kitty:75,bunny:77,unicorn:67,hamster:72,panda:69}[kind]||74;return Object.values(e).map(id=>{const it=wearBy(id);if(!it)return '';return it.slot==='bow'?petGearArt(it,73,kind==='bunny'?48:35,.45):it.slot==='clip'?petGearArt(it,29,kind==='bunny'?43:33,.42):petGearArt(it,50,neck+4,.75);}).join('');}
function equipPetGear(id){const it=wearBy(id);if(!it||it.kind!=='pet'||!WARD.owned.includes(id)||!S.pets.includes(S.pet))return;WARD.petEquipped??={};const old=JSON.stringify(WARD.petEquipped);for(const e of Object.values(WARD.petEquipped)){if(e[it.slot]===id)delete e[it.slot];}WARD.petEquipped[S.pet]??={};WARD.petEquipped[S.pet][it.slot]=id;if(!saveWard())WARD.petEquipped=JSON.parse(old);}
function petWardrobe(){SET("game='';session=null;");const app=document.getElementById('app'),co=G('coins')||0;app.innerHTML=`<section class="panel pd wd"><div class="pd-top"><button class="secondary" id="pgBack">← Dolls & Pets</button><b>🐾 Pet accessories</b><b class="pd-tok">🪙 ${co}</b></div><div class="wd-preview"><div class="wd-model pg-model">${pet(S.pet)}</div><div><label for="pgPet">Dress your pet</label><select id="pgPet">${S.pets.filter(k=>PETS[k]).map(k=>`<option value="${k}" ${S.pet===k?'selected':''}>${PETS[k].name}</option>`).join('')}</select><p>Bows, clips, bandanas and collars stay in your collection.</p><button class="secondary" id="pgTakeOff">Put extras away</button></div></div><div class="wd-cupboard"><div class="wd-grid">${PET_GEAR.map(i=>{const own=WARD.owned.includes(i.id),on=WARD.petEquipped?.[S.pet]?.[i.slot]===i.id;return `<article class="wd-item ${on?'wearing':''}"><div class="wd-object"><svg viewBox="0 0 100 110" aria-hidden="true">${petGearArt(i,50,50,1.5)}</svg></div><b>${i.name}</b><small>${own?'In your pet collection':'🪙 '+i.cost+' coins'}</small><button data-pet-gear="${i.id}" ${on||(!own&&co<i.cost)?'disabled':''}>${on?'Wearing':own?'Wear':'Buy · 🪙 '+i.cost}</button></article>`;}).join('')}</div></div></section>`;
 document.getElementById('pgBack').onclick=friends;document.getElementById('pgPet').onchange=e=>{if(S.pets.includes(e.target.value)){S.pet=e.target.value;save();petWardrobe();}};document.getElementById('pgTakeOff').onclick=()=>{const old=WARD.petEquipped?.[S.pet];if(WARD.petEquipped)delete WARD.petEquipped[S.pet];if(!saveWard()&&old)WARD.petEquipped[S.pet]=old;petWardrobe();};app.querySelectorAll('[data-pet-gear]').forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;const id=b.dataset.petGear;if(WARD.owned.includes(id))equipPetGear(id);else buyWear(id);petWardrobe();});window.scrollTo(0,0);
}

const WKEY='rikiDollWardrobeV1';
let WARD=(()=>{try{const v=JSON.parse(localStorage.getItem(WKEY)||'{}');return {...v,owned:[...new Set(['daydress','sneakers',...(Array.isArray(v.owned)?v.owned:[])])],equipped:v.equipped&&typeof v.equipped==='object'?v.equipped:{}};}catch(_){return {owned:['daydress','sneakers'],equipped:{}};}})();
const wearBy=id=>CLOTHES.find(i=>i.id===id);
const wornBy=id=>Object.keys(WARD.equipped).find(k=>Object.values(WARD.equipped[k]||{}).includes(id));
const saveWard=()=>{try{localStorage.setItem(WKEY,JSON.stringify(WARD));return true;}catch(_){toast('Your wardrobe could not be saved. Please free some browser storage.');return false;}};
function dressPrint(item){const pat=item?.pattern||'dots';return [[48,151],[66,155],[74,147],[55,163]].map(([x,y])=>{const m=pat==='berry'?'<path d="M-3-1Q0-4 3-1Q3 3 0 5Q-3 3-3-1" fill="#c95370"/><path d="M-3-2l3 2 3-2-3-2Z" fill="#638b61"/><path d="M-1 1h.5M1 3h.5" stroke="#fff1b7"/>':pat==='daisy'?'<g fill="#fffdf2"><ellipse rx="1.5" ry="4"/><ellipse rx="4" ry="1.5"/><ellipse rx="1.5" ry="4" transform="rotate(45)"/><ellipse rx="1.5" ry="4" transform="rotate(-45)"/></g><circle r="1.4" fill="#c59c43"/>':pat==='cloud'?'<path d="M-5 2q-2-4 2-4q2-5 5-1q5-1 5 3q0 3-5 3h-5Z" fill="#fff"/>':pat==='stars'||pat==='sparkle'?'<path d="M0-4l1.2 2.7 3 .3-2.3 2 .6 3L0 2.4-2.5 4l.6-3-2.3-2 3-.3Z" fill="#fff5c9"/>':pat==='ribbon'?'<path d="M0 0q-7-5-5 1q2 2 5-1q7-5 5 1q-2 2-5-1M-1 1l-1 4M1 1l1 4" fill="#fff6eb" stroke="#fff6eb" stroke-width="1"/>':'<circle r="1.7" fill="#fff6f5"/>';return `<g transform="translate(${x} ${y})">${m}</g>`;}).join('');}
function shoeArt(item){const c=item.c,t=item.trim;return [0,1].map(i=>`<g transform="${i?'translate(120 0) scale(-1 1)':''}">${item.shape==='boots'?`<path d="M40 173h12v19q-3 6-17 3q-2-5 5-10Z" fill="${c}" stroke="${shade(c,-.2)}"/><path d="M40 175h12" stroke="${t}" stroke-width="3"/>`:`<path d="M40 184q5-4 11 0l1 7q-4 8-16 3q-2-5 4-10" fill="${c}" stroke="${shade(c,-.2)}"/><path d="M39 188h12" stroke="${t}" stroke-width="2"/>${item.shape==='sneakers'?'<path d="M43 185l5 5m-5-3h5m-4-2h5" stroke="#a48c9e" stroke-width="1"/>':item.shape==='ballet'?`<path d="M42 177l8 7m-8 0 8-7" stroke="${c}" stroke-width="1.3"/>`:`<path d="M43 188q-5-4-4 0q1 3 5 0q5-4 4 0q-1 3-4 0" fill="${t}"/>`}`}<path d="M37 195h14" stroke="${t}" stroke-width="1.5"/></g>`).join('');}
function toyFeet(item){const id='feet'+(++uid),rgb=[1,3,5].map(k=>parseInt(item.c.slice(k,k+2),16)/255);return `<defs><clipPath id="${id}clip"><rect x="31" y="185" width="59" height="18"/></clipPath><filter id="${id}color"><feColorMatrix values="${rgb.map(c=>`${.2126*c} ${.7152*c} ${.0722*c} 0 ${c*.14}`).join(' ')} 0 0 0 1 0"/></filter>${lg(id+'boot',item.c,.2,-.2)}</defs>${item.shape==='boots'?`<path d="M41 175h11v17H40Z M68 175h11l1 17H68Z" fill="url(#${id}boot)"/><path d="M41 177h11M68 177h11" stroke="${item.trim}" stroke-width="2"/>`:''}<g clip-path="url(#${id}clip)" filter="url(#${id}color)"><svg width="120" height="204" viewBox="-9 0 426 724"><image href="assets/images/dolls/soft-toy-dolls.webp?v=wardrobe-6" width="2172" height="724"/></svg></g>${item.shape==='flats'||item.shape==='ballet'?`<path d="M46 191q-6-5-5 0q1 4 5 0q6-5 5 0q-1 4-5 0M74 191q-6-5-5 0q1 4 5 0q6-5 5 0q-1 4-5 0" fill="${item.trim}"/>`:''}`;}
function dressArt(item,x=30,y=99,w=60,h=68){const n=Math.max(0,CLOTHES.filter(i=>i.kind==='dress'&&!i.group).findIndex(i=>i.id===item.id)),frames=[[0,60,400,425],[400,60,380,425],[780,60,380,425],[1160,60,376,425],[0,550,400,425],[400,550,380,425],[780,550,380,425],[1160,550,376,425]],f=frames[n],id='dresscut'+(++uid);return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${f.join(' ')}" preserveAspectRatio="none"><defs><clipPath id="${id}"><polygon points="${[[.26,0],[.74,0],[.87,.04],[.94,.11],[.9,.28],[.72,.34],[.72,.4],[1,.98],[1,1],[0,1],[0,.98],[.28,.4],[.28,.34],[.1,.28],[.06,.11],[.13,.04]].map(([px,py])=>(f[0]+px*f[2])+','+(f[1]+py*f[3])).join(' ')}"/></clipPath></defs><g clip-path="url(#${id})"><image href="assets/images/dolls/dress-collection.webp?v=wardrobe-6" width="1536" height="1024"/></g></svg>`;}
function signatureDress(color){const id='signature'+(++uid),hue=[0,-80,-175,60,20,-120][color]||0;return `<defs><filter id="${id}"><feColorMatrix type="hueRotate" values="${hue}"/></filter></defs><g filter="url(#${id})">${dressArt(CLOTHES[0])}</g>`;}
const wearGroup=item=>item?.group||item?.kind;
function accessoryArt(item,x=60,y=55,scale=1){const id='acc'+(++uid),c=item.c,t=item.trim;let shape='';
 if(item.shape==='bow')shape=`<path d="M0 0C-7-10-19-11-18 0C-19 11-7 10 0 2C7 10 19 11 18 0C19-11 7-10 0 0" fill="url(#${id}g)" stroke="${shade(c,-.2)}" stroke-width=".7"/><path d="M-2 3l-4 12 5-3 3-8M2 3l4 12-5-3-3-8" fill="${c}"/><ellipse rx="3.5" ry="4" fill="${shade(c,-.12)}"/><path d="M-14-2q4-3 8 0M6-2q4-3 8 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>`;
 else if(item.shape==='flower')shape=`${[0,60,120,180,240,300].map(a=>`<ellipse rx="3.8" ry="7" transform="rotate(${a}) translate(0 -5)" fill="url(#${id}g)" stroke="${shade(c,-.12)}" stroke-width=".5"/>`).join('')}<circle r="4" fill="${t}"/><circle cx="-1" cy="-1" r="1.4" fill="#fff" opacity=".7"/>`;
 else if(item.shape==='star')shape=`<path d="M0-13l4 8 9 1-7 7 2 10-8-5-8 5 2-10-7-7 9-1Z" fill="url(#${id}g)" stroke="${shade(c,-.2)}"/><path d="M-2-7l-2 4-4 1" stroke="#fff" stroke-opacity=".7" fill="none" stroke-width="1.8"/>`;
 else if(item.shape==='pearl')shape=`<circle r="6" fill="url(#${id}g)" stroke="#b99c77" stroke-width=".7"/><ellipse cx="-2" cy="-2" rx="2.3" ry="1.7" fill="#fff" opacity=".9"/>`;
 else if(item.shape==='heart')shape=`<path d="M0 6C-15-3-7-12 0-5C7-12 15-3 0 6Z" fill="url(#${id}g)" stroke="${shade(c,-.2)}"/><path d="M-6-5q2-2 4 0" stroke="#fff" fill="none" stroke-width="1.6" opacity=".7"/>`;
 return `<defs>${rg(id+'g',c,.35,-.2)}</defs><g data-accessory="${item.id}" transform="translate(${x} ${y}) scale(${scale})">${shape}</g>`;
}
function dollAccessories(d){const h=wearBy(d.hairAccessoryId),e=wearBy(d.earringId);return `${h?accessoryArt(h,87,31,.55):''}${e?[31,89].map(x=>accessoryArt(e,x,78,e.shape==='star'?.23:.4)).join(''):''}`;}

function pajamaArt(item){const frames=[[320,10,465,704],[851,10,465,704],[1390,10,465,704]],f=frames[item.pj||0];return `<svg x="30" y="99" width="60" height="94" viewBox="${f.join(' ')}" preserveAspectRatio="none" data-pajama-set="${item.id}"><image href="assets/images/dolls/pajama-collection.webp?v=pet-style-7" width="2172" height="724"/></svg>`;}
function wearIcon(i){const g=wearGroup(i);return g==='hair'||g==='earrings'?`<svg viewBox="0 0 120 110" aria-hidden="true">${g==='earrings'?[40,80].map(x=>accessoryArt(i,x,55,1.8)).join(''):accessoryArt(i,60,50,1.7)}</svg>`:g==='pajamas'?`<svg viewBox="24 94 72 110" aria-hidden="true">${pajamaArt(i)}</svg>`:i.kind==='dress'?`<svg viewBox="25 94 70 80" aria-hidden="true">${dressArt(i)}</svg>`:`<svg viewBox="25 165 70 39" aria-hidden="true">${toyFeet(i)}</svg>`;}
let wearTab='wardrobe',wearKind='dress';
function buyWear(id){const item=wearBy(id);if(!item||WARD.owned.includes(id))return false;if((G('coins')||0)<item.cost){toast('Win learning games to earn more coins for this item.');return false;}WARD.owned.push(id);if(!saveWard()){WARD.owned.pop();return false;}if(!spend(item.cost)){WARD.owned=WARD.owned.filter(k=>k!==id);saveWard();return false;}good();toast(item.name+' is now in your wardrobe!');return true;}
function equipWear(id){const item=wearBy(id);if(!item||!WARD.owned.includes(id)||!S.dolls.includes(S.doll))return false;const before=JSON.stringify(WARD.equipped),previous=wornBy(id);for(const e of Object.values(WARD.equipped)){if(e[item.kind]===id)delete e[item.kind];}WARD.equipped[S.doll]??={};WARD.equipped[S.doll][item.kind]=id;if(!saveWard()){WARD.equipped=JSON.parse(before);return false;}if(previous&&previous!==S.doll)toast('Moved to '+DOLLS.find(d=>d.id===S.doll).name+'’s outfit.');good();return true;}
function wardrobe(tab='wardrobe'){wearTab=tab;SET("game='';session=null;");const app=document.getElementById('app'),selected=DOLLS.find(d=>d.id===S.doll),coins=G('coins')||0;
 const list=CLOTHES.filter(i=>wearGroup(i)===wearKind&&(wearTab==='shop'||WARD.owned.includes(i.id)));
 app.innerHTML=`<section class="panel pd wd"><div class="pd-top"><button class="secondary" id="wdBack">← Play</button><b>🎀 Doll wardrobe</b><b class="pd-tok">🪙 ${coins}</b></div><button class="secondary wd-open" id="wdPetAccessories">🐾 Pet accessories</button><div class="wd-tabs"><button data-wd-tab="wardrobe" aria-pressed="${wearTab==='wardrobe'}">My wardrobe</button><button data-wd-tab="shop" aria-pressed="${wearTab==='shop'}">Buy clothes</button></div><div class="wd-preview"><div class="wd-model">${doll(look(S.doll))}</div><div><label for="wdDoll">Dress your doll</label><select id="wdDoll">${DOLLS.filter(d=>S.dolls.includes(d.id)).map(d=>`<option value="${d.id}" ${d.id===S.doll?'selected':''}>${d.name}</option>`).join('')}</select><p>Purchased clothes can move between dolls. Each item stays yours.</p><button class="secondary" id="wdOriginal">Wear saved outfit</button></div></div><div class="wd-kinds">${[['dress','👗 Dresses'],['pajamas','🌙 Pajamas'],['shoes','👟 Shoes'],['hair','🎀 Hair accessories'],['earrings','✨ Earrings']].map(([kind,label])=>`<button data-wd-kind="${kind}" aria-pressed="${wearKind===kind}">${label} · ${WARD.owned.filter(k=>wearGroup(wearBy(k))===kind).length}</button>`).join('')}</div><button class="secondary wd-takeoff" id="wdTakeOff" ${wearGroup(wearBy(WARD.equipped[S.doll]?.[wearKind==='pajamas'?'dress':wearKind]))!==wearKind?'disabled':''}>Put this ${wearKind==='hair'?'accessory':wearKind==='earrings'?'pair of earrings':'item'} away</button><p class="wd-guide">${wearTab==='shop'?'Earn coins in learning games, then choose something new. Your purchases go straight into the wardrobe.':'Tap an item to dress '+selected.name+'. Clothes marked “Stored” are waiting on the rail or shoe shelf.'}</p><div class="wd-cupboard"><div class="wd-grid">${list.map(i=>{const own=WARD.owned.includes(i.id),who=wornBy(i.id),on=who===S.doll;return `<article class="wd-item ${on?'wearing':''}"><div class="wd-object">${wearIcon(i)}</div><b>${i.name}</b><small>${own?(who?'Worn by '+DOLLS.find(d=>d.id===who)?.name:'Stored'):('🪙 '+i.cost+' coins')}</small><button type="button" data-wear="${i.id}" ${on||(!own&&coins<i.cost)?'disabled':''}>${on?'Wearing':own?(who?'Move to '+selected.name:'Wear'):(coins<i.cost?'Need '+(i.cost-coins)+' more coins':'Buy · 🪙 '+i.cost)}</button></article>`;}).join('')}</div></div></section>`;
 document.getElementById('wdPetAccessories').onclick=petWardrobe;document.getElementById('wdTakeOff').onclick=()=>{const slot=wearKind==='pajamas'?'dress':wearKind;const old=WARD.equipped[S.doll]?.[slot];if(WARD.equipped[S.doll])delete WARD.equipped[S.doll][slot];if(!saveWard()&&old)WARD.equipped[S.doll][slot]=old;wardrobe(wearTab);};document.getElementById('wdBack').onclick=screen;document.getElementById('wdDoll').onchange=e=>{if(S.dolls.includes(e.target.value)){S.doll=e.target.value;save();wardrobe(wearTab);}};
 document.getElementById('wdOriginal').onclick=()=>{const old=WARD.equipped[S.doll];delete WARD.equipped[S.doll];if(!saveWard())WARD.equipped[S.doll]=old;wardrobe(wearTab);};
 app.querySelectorAll('[data-wd-tab]').forEach(b=>b.onclick=()=>wardrobe(b.dataset.wdTab));app.querySelectorAll('[data-wd-kind]').forEach(b=>b.onclick=()=>{wearKind=b.dataset.wdKind;wardrobe(wearTab);});
 app.querySelectorAll('[data-wear]').forEach(b=>b.onclick=()=>{if(b.disabled)return;b.disabled=true;const id=b.dataset.wear;if(WARD.owned.includes(id))equipWear(id);else buyWear(id);wardrobe(wearTab);});window.scrollTo(0,0);
}

const MAXT=30,PER=12;let buying=false;
/* earn plays from coins won in games */
(function(){const prior=G('award');if(typeof prior!=='function'||prior.__rkPlay)return;const wrap=function(n){prior.apply(this,arguments);if(n>0&&!buying){S.carry+=n;let got=0;while(S.carry>=PER){S.carry-=PER;if(S.tokens<MAXT){S.tokens++;got++;}}save();if(got)toast(`+${got} 🎟️ play${got>1?'s':''} for your dolls!`);}};wrap.__rkPlay=1;window.__rkAward=wrap;SET('award=window.__rkAward');})();
function toast(t){let el=document.getElementById('pdToast');if(!el){el=document.createElement('div');el.id='pdToast';document.body.appendChild(el);}el.textContent=t;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200);}
const spend=c=>{const co=G('coins')||0;if(co<c)return false;buying=true;SET(`coins-=${c};try{localStorage.setItem('rickyCoins',coins)}catch(e){};updateStats&&updateStats();`);buying=false;return true;};
const tap=()=>{try{G('audio')('tap');}catch(_){}};const good=()=>{try{G('audio')('good');}catch(_){}};
const sayEn=t=>{try{if(G('soundOn')===false)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=1;u.pitch=1.25;speechSynthesis.speak(u);}catch(e){}};

/* ---- rooms: art + spots (x = where the doll walks, % of width) ---- */
const wall=(a,b,pat)=>`<defs><pattern id="pw" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="${a}"/>${pat}</pattern><pattern id="pk" width="60" height="18" patternUnits="userSpaceOnUse"><rect width="60" height="18" fill="${b}"/><path d="M0 17.5 h60 M30 0 v18" stroke="${shade(b,-.14)}" stroke-width="1.2"/><path d="M8 6 q10 -2 18 0 M38 12 q8 -2 16 1" stroke="${shade(b,-.07)}" stroke-width="1" fill="none"/></pattern><linearGradient id="pvig" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a2a40" stop-opacity=".18"/></linearGradient><linearGradient id="pbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="360" height="200" fill="url(#pw)"/><rect y="150" width="360" height="46" fill="${shade(a,-.06)}"/>${[0,1,2,3,4,5,6].map(i=>`<rect x="${8+i*52}" y="156" width="44" height="34" rx="4" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/>`).join('')}<rect y="146" width="360" height="5" fill="#fff" opacity=".9"/><rect y="196" width="360" height="74" fill="url(#pk)"/><rect y="190" width="360" height="9" fill="#fff"/><rect y="197" width="360" height="3" fill="#000" opacity=".06"/>`;
const lights=()=>`<path d="M0 10 Q45 32 90 12 T180 12 T270 12 T360 10" stroke="#8a6a7a" stroke-width="1.2" fill="none"/>${[14,36,58,80,104,126,148,170,194,216,238,260,284,306,328,350].map((x,i)=>`<g><circle cx="${x}" cy="${14+Math.abs(Math.sin(x/28))*12}" r="6" fill="${['#ffe58a','#ffb3d1','#b9e6ff','#d6c4ff'][i%4]}" opacity=".35"/><circle cx="${x}" cy="${14+Math.abs(Math.sin(x/28))*12}" r="3" fill="${['#ffd34d','#ff7fb4','#6fc3ff','#a98bff'][i%4]}"/></g>`).join('')}`;
const rug=(x,w,c,c2)=>`<ellipse cx="${x}" cy="246" rx="${w}" ry="16" fill="${c}"/><ellipse cx="${x}" cy="246" rx="${w-10}" ry="10" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="6 5"/>`;
const beam=x=>`<path d="M${x} 92 L${x+70} 92 L${x+120} 268 L${x-40} 268Z" fill="url(#pbeam)" opacity=".5"/>`;
const plant=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 0 h24 l-3 22 h-18z" fill="#ff9d7a"/><path d="M0 0 C-4 -16 -18 -20 -22 -14 C-14 -10 -6 -8 0 0 M0 0 C2 -20 14 -28 20 -22 C12 -16 6 -10 0 0 M0 0 C-2 -14 2 -26 0 -32" fill="#6cc47a" stroke="#4fa35e" stroke-width="1"/></g>`;
const win=(x,cur)=>`<g transform="translate(${x} 30)"><rect width="70" height="62" rx="8" fill="#bfe8ff" stroke="#fff" stroke-width="5"/><path d="M35 0 v62 M0 31 h70" stroke="#fff" stroke-width="4"/><circle cx="52" cy="16" r="7" fill="#fff7b0"/><path d="M-10 -6 q10 40 2 74 h16 q4-40 -4-74z M80 -6 q-10 40 -2 74 h-16 q-4-40 4-74z" fill="${cur}"/><rect x="-14" y="-10" width="98" height="7" rx="3" fill="${shade(cur,-.2)}"/></g>`;
const ROOMS={
 bed:{name:'Bedroom',ic:'🛏️',art:()=>wall('#ffe4ef','#e9b98f','<circle cx="12" cy="12" r="3" fill="#ffc6dc"/><path d="M0 0l3 3M24 24l-3-3" stroke="#ffd3e4"/>')+lights()+win(140,'#ff9cc6')+beam(140)+rug(190,64,'#ffd1e4','#ff9cc6')+'<g transform="translate(18 66)"><rect width="70" height="5" rx="2" fill="#f2c9a8"/><text x="12" y="-2" font-size="20">🧸</text><text x="40" y="-2" font-size="16">📚</text></g>'+
  `<g data-spot="bed"><path d="M14 132 q0-36 48-36 q48 0 48 36z" fill="#c9a2ff"/><path d="M46 112 c-6-8-18 0-9 9 l9 8 9-8 c9-9-3-17-9-9z" fill="#ff7fb4"/><rect x="10" y="168" width="134" height="40" rx="10" fill="#fff"/><rect x="10" y="180" width="134" height="40" rx="10" fill="#ffb3d1"/>${[30,60,90,120].map(x=>`<circle cx="${x}" cy="200" r="4" fill="#fff" opacity=".7"/>`).join('')}<rect x="20" y="152" width="44" height="22" rx="10" fill="#fff" stroke="#f3cfe0" stroke-width="2"/><rect x="12" y="218" width="10" height="20" rx="3" fill="#a77bd9"/><rect x="132" y="218" width="10" height="20" rx="3" fill="#a77bd9"/></g>
  <g data-spot="closet"><rect x="160" y="100" width="70" height="130" rx="10" fill="#b8a4ff"/><rect x="166" y="108" width="28" height="114" rx="6" fill="#cbbcff"/><rect x="196" y="108" width="28" height="114" rx="6" fill="#cbbcff"/><circle cx="190" cy="165" r="3" fill="#ffd34d"/><circle cx="200" cy="165" r="3" fill="#ffd34d"/><path d="M180 96 q15-14 30 0" stroke="#b8a4ff" stroke-width="5" fill="none"/></g>
  <g data-spot="mirror"><rect x="262" y="160" width="84" height="44" rx="8" fill="#fff" stroke="#ffc6dc" stroke-width="3"/><rect x="270" y="204" width="8" height="34" fill="#ffc6dc"/><rect x="330" y="204" width="8" height="34" fill="#ffc6dc"/><ellipse cx="304" cy="118" rx="30" ry="38" fill="#d9f2ff" stroke="#ffd34d" stroke-width="6"/><path d="M290 100 l14 -10 M292 116 l22 -16" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="276" cy="154" r="5" fill="#ff7fb4"/><rect x="316" y="148" width="8" height="12" rx="2" fill="#9f8cff"/></g>`,
  spots:{bed:[22,'Sleep','😴'],closet:[54,'Get dressed','👗'],mirror:[84,'Mirror','🪞']}},
 kitchen:{name:'Kitchen',ic:'🍳',art:()=>wall('#e3f8f1','#f2d3a8','<rect width="12" height="12" fill="#cdf0e4"/><rect x="12" y="12" width="12" height="12" fill="#cdf0e4"/>')+lights()+rug(190,70,'#ffe6b8','#ffb547')+'<text x="124" y="166" font-size="14">🍎🍊🍋</text>'+plant(250,30,.55)+
  `<g data-spot="stove"><rect x="14" y="140" width="96" height="100" rx="8" fill="#fff" stroke="#e7d7ea" stroke-width="3"/><rect x="26" y="172" width="72" height="50" rx="6" fill="#3d3550"/><rect x="32" y="178" width="60" height="16" rx="4" fill="#ff9d5c" opacity=".55"/>${[34,62,90].map(x=>`<circle cx="${x}" cy="156" r="4" fill="#ff8fb2"/>`).join('')}<ellipse cx="46" cy="138" rx="22" ry="5" fill="#555"/><rect x="66" y="135" width="26" height="4" rx="2" fill="#555"/></g>
  <g data-spot="cabinet"><rect x="122" y="40" width="120" height="70" rx="8" fill="#ffd1e4"/>${[0,1,2].map(i=>`<rect x="${128+i*38}" y="46" width="34" height="58" rx="5" fill="#ffe3ee"/><circle cx="${145+i*38}" cy="98" r="3" fill="#ffb547"/>`).join('')}<rect x="118" y="168" width="128" height="10" rx="3" fill="#fff"/><rect x="122" y="178" width="120" height="62" rx="6" fill="#ffd1e4"/>${[0,1].map(i=>`<rect x="${128+i*58}" y="184" width="52" height="50" rx="5" fill="#ffe3ee"/>`).join('')}<path d="M150 162 h16 v6 h-16z M200 150 q6-12 12 0 v18 h-12z" fill="#9fd6ff"/></g>
  <g data-spot="fridge"><rect x="262" y="70" width="84" height="170" rx="14" fill="#bfe6ff"/><path d="M262 128 h84" stroke="#9cc9e8" stroke-width="3"/><rect x="270" y="90" width="6" height="26" rx="3" fill="#fff"/><rect x="270" y="138" width="6" height="40" rx="3" fill="#fff"/><circle cx="312" cy="96" r="6" fill="#ff7fb4"/><path d="M322 150 l6 10 h-12z" fill="#ffd34d"/><rect x="300" y="160" width="14" height="10" rx="2" fill="#7ad7a0"/></g>`,
  spots:{stove:[18,'Cook','🥞'],cabinet:[50,'Put away','🥫'],fridge:[84,'Snack','🍓']}},
 bath:{name:'Bathroom',ic:'🛁',art:()=>wall('#e6f3ff','#ffffff','<rect width="23" height="23" fill="#d6ebff" rx="3"/>')+lights()+'<g transform="translate(168 96)"><rect width="52" height="5" rx="2" fill="#d9c2e8"/><path d="M6 5 h18 v40 h-18z" fill="#ffb3d1"/><path d="M28 5 h18 v32 h-18z" fill="#b9e6ff"/></g>'+plant(212,176,.7)+
  `<g data-spot="tub"><ellipse cx="80" cy="168" rx="70" ry="10" fill="#bde3ff"/><path d="M10 168 h140 q-4 52 -40 56 h-60 q-36-4 -40-56z" fill="#fff" stroke="#ffc6dc" stroke-width="4"/><path d="M30 238 l-6 12 M130 238 l6 12" stroke="#ffd34d" stroke-width="6" stroke-linecap="round"/><path d="M140 168 v-60 q0-10 -12 -10 h-8" stroke="#c9c9d9" stroke-width="6" fill="none"/><circle cx="56" cy="164" r="8" fill="#fff" opacity=".9"/><circle cx="72" cy="160" r="10" fill="#fff" opacity=".9"/><circle cx="92" cy="163" r="7" fill="#fff" opacity=".9"/></g>
  <g data-spot="sink"><rect x="244" y="54" width="70" height="80" rx="30" fill="#d9f2ff" stroke="#ffc6dc" stroke-width="5"/><path d="M256 80 l16 -12 M258 96 l24 -18" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="234" y="150" width="90" height="16" rx="8" fill="#fff" stroke="#e5e5f0" stroke-width="2"/><rect x="266" y="166" width="26" height="70" rx="6" fill="#fff" stroke="#e5e5f0" stroke-width="2"/><rect x="276" y="138" width="6" height="14" rx="2" fill="#c9c9d9"/><rect x="300" y="132" width="8" height="18" rx="3" fill="#ff9cc6"/><rect x="312" y="136" width="6" height="14" rx="2" fill="#7ad7a0"/></g>
  <rect x="160" y="236" width="70" height="18" rx="9" fill="#ffc6dc"/>`,
  spots:{tub:[22,'Bubble bath','🛁'],sink:[78,'Brush teeth','🪥']}},
 play:{name:'Playroom',ic:'🧸',art:()=>wall('#fff6d6','#cfe6a8','<path d="M12 6 l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#ffe08a"/>')+lights()+win(130,'#8fd3ff')+beam(130)+rug(150,80,'#e2d6ff','#a98bff')+[20,50,80,110,140,170,200,230,260,290,320,350].map((x,i)=>'<path d="M'+(x-9)+' '+(44+Math.sin(x/40)*6)+' l9 15 l9 -15z" fill="'+['#ff9cc6','#ffd34d','#8fd3ff','#a6e3a1'][i%4]+'"/>').join('')+
  `<g data-spot="toys"><rect x="14" y="176" width="90" height="62" rx="10" fill="#ff9d7a"/><rect x="10" y="168" width="98" height="16" rx="6" fill="#ff7f5c"/><circle cx="40" cy="160" r="12" fill="#7ac3ff"/><path d="M62 166 l10 -24 l10 24z" fill="#ffd34d"/><rect x="30" y="200" width="58" height="18" rx="9" fill="#fff" opacity=".6"/><text x="59" y="214" font-size="12" text-anchor="middle" font-weight="900" fill="#ff7f5c">TOYS</text></g>
  <g data-spot="easel"><path d="M150 240 l20 -120 l20 120 M170 120 v120" stroke="#b77b4a" stroke-width="6" stroke-linecap="round"/><rect x="138" y="110" width="64" height="70" rx="4" fill="#fff" stroke="#e8d3c2" stroke-width="3"/><path d="M146 170 q12-30 24-12 q12-24 24 0" stroke="#ff9cc6" stroke-width="5" fill="none"/><circle cx="186" cy="128" r="7" fill="#ffd34d"/></g>
  <g data-spot="tv"><rect x="232" y="70" width="110" height="64" rx="8" fill="#3d3550"/><rect x="238" y="76" width="98" height="52" rx="5" fill="#8fd3ff"/><path d="M250 120 q20-30 40 0 q12-16 24 0z" fill="#7ad7a0"/><path d="M280 134 v10" stroke="#3d3550" stroke-width="5"/><path d="M226 186 q0-20 20-20 h80 q20 0 20 20 v40 h-120z" fill="#c9a2ff"/><rect x="220" y="196" width="132" height="34" rx="14" fill="#b38be0"/><rect x="236" y="186" width="44" height="20" rx="8" fill="#ffc6dc"/><rect x="292" y="186" width="44" height="20" rx="8" fill="#ffc6dc"/></g>`,
  spots:{toys:[18,'Play toys','🧸'],easel:[48,'Paint','🎨'],tv:[80,'Movie','🍿']}},
 yard:{name:'Yard',ic:'🌳',art:()=>`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff"/><stop offset="1" stop-color="#e8f7ff"/></linearGradient></defs><rect width="360" height="270" fill="url(#sky)"/><circle cx="300" cy="44" r="22" fill="#fff3a0"/><g fill="#fff"><ellipse cx="90" cy="40" rx="30" ry="12"/><ellipse cx="112" cy="34" rx="22" ry="12"/><ellipse cx="220" cy="60" rx="26" ry="10"/></g><path d="M0 190 q90-24 180 0 t180 0 v80 h-360z" fill="#8edc8a"/><path d="M0 214 q90-14 180 0 t180 0 v56 h-360z" fill="#7acf78"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<rect x="${i*31+4}" y="166" width="16" height="36" rx="7" fill="#ffffff" opacity=".9"/>`).join('')}<rect y="176" width="360" height="5" fill="#ffffff" opacity=".9"/><ellipse cx="150" cy="212" rx="34" ry="12" fill="#6cc47a"/><text x="120" y="120" font-size="16">🦋</text><text x="250" y="150" font-size="13">🦋</text>
  <g data-spot="swing"><rect x="34" y="40" width="16" height="170" rx="6" fill="#b77b4a"/><ellipse cx="60" cy="50" rx="56" ry="38" fill="#7ad07a"/><ellipse cx="34" cy="40" rx="30" ry="24" fill="#8fe08f"/><circle cx="50" cy="58" r="5" fill="#ff7fb4"/><circle cx="82" cy="40" r="5" fill="#ff7fb4"/><path d="M66 80 h70" stroke="#b77b4a" stroke-width="8" stroke-linecap="round"/><g class="pd-swing"><path d="M84 80 v100 M120 80 v100" stroke="#c9a27c" stroke-width="3"/><rect x="78" y="178" width="48" height="8" rx="4" fill="#ff9cc6"/></g></g>
  <g data-spot="doghouse"><path d="M168 230 v-50 l36 -32 l36 32 v50z" fill="#ffc78f"/><path d="M160 184 l44 -40 l44 40" stroke="#ff7fa8" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M190 230 v-24 q14-16 28 0 v24z" fill="#5e3d2a"/><ellipse cx="248" cy="236" rx="14" ry="6" fill="#7ac3ff"/><text x="204" y="176" font-size="11" text-anchor="middle">💖</text></g>
  <g data-spot="flowers">${[[284,214,'#ff7fb4'],[304,224,'#ffd34d'],[326,212,'#b38be0'],[344,226,'#ff9d7a'],[296,236,'#7ac3ff']].map(([x,y,c])=>`<path d="M${x} ${y} v24" stroke="#4fae4f" stroke-width="3"/>${[0,72,144,216,288].map(a=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="7" transform="rotate(${a} ${x} ${y}) translate(0 -6)" fill="${c}"/>`).join('')}<circle cx="${x}" cy="${y}" r="3.5" fill="#fff3a0"/>`).join('')}<path d="M262 230 l10 -12 h16 l-4 14z" fill="#7ac3ff"/></g>`,
  spots:{swing:[28,'Swing','🎠'],doghouse:[58,'Play with pet','🎾'],flowers:[86,'Water flowers','🌷']}}
};
const ROOM_ORDER=['bed','kitchen','bath','play','yard'];
/* ---- the play screen ---- */
let busy=false;
function screen(){const app=document.getElementById('app');if(!app)return;SET("game='';session=null;");busy=false;const r=ROOMS[S.room]||ROOMS.bed;
 app.innerHTML=`<section class="panel pd"><div class="pd-top"><button class="secondary" id="pdHome">← Home</button><b class="pd-tok" id="pdTok">🎟️ ${S.tokens}</b><button class="secondary" id="pdFriends">💖 Dolls & Pets</button></div>
  <button class="secondary wd-open" id="pdWardrobe">👗 Wardrobe & accessories</button><div class="pd-rooms">${ROOM_ORDER.map(k=>`<button class="pd-room ${k===S.room?'on':''}" data-room="${k}">${ROOMS[k].ic}<small>${ROOMS[k].name}</small></button>`).join('')}</div>
  <div class="pd-scene" id="pdScene"><svg viewBox="0 0 360 270" preserveAspectRatio="xMidYMid slice">${shadeArt(r.art())}<rect width="360" height="270" fill="url(#pvig)" pointer-events="none"/></svg><div class="pd-fx" id="pdFx"></div>
   <div class="pd-actor" id="pdDoll" style="left:${50}%">${doll(look(S.doll))}</div><div class="pd-petw" id="pdPet" style="left:${64}%">${pet(S.pet)}</div><div class="pd-bubble" id="pdBub" hidden></div></div>
  <div class="pd-spots">${Object.entries(r.spots).map(([k,s])=>`<button class="pd-spot" data-spot="${k}"><b>${s[2]}</b>${s[1]}</button>`).join('')}<button class="pd-spot free" data-spot="pet"><b>🐾</b>Pet ${PETS[S.pet].name}</button></div>
  <div class="pd-panel" id="pdPanel"></div>
  <p class="pd-hint">Tap the furniture or a button. Each play uses 🎟️ 1. Win games to earn more!</p></section>`;
 const $=id=>document.getElementById(id);
 $('pdWardrobe').onclick=()=>wardrobe();$('pdHome').onclick=()=>{tap();(window.RikiHub||G('menu'))();};$('pdFriends').onclick=()=>{tap();friends();};
 app.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{tap();S.room=b.dataset.room;save();screen();});
 app.querySelectorAll('.pd-scene [data-spot]').forEach(g=>g.addEventListener('click',()=>act(g.dataset.spot)));
 app.querySelectorAll('.pd-spots [data-spot]').forEach(b=>b.onclick=()=>act(b.dataset.spot));
 $('pdPet').onclick=()=>act('pet');$('pdDoll').onclick=()=>{if(busy)return;wave();};
 window.scrollTo(0,0);}
const live=()=>!!document.getElementById('pdScene');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function bub(t,ms=2200){const b=document.getElementById('pdBub');if(!b)return;b.textContent=t;b.hidden=false;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');sayEn(t);clearTimeout(b._t);b._t=setTimeout(()=>{b.hidden=true;},ms);}
function fx(chars,n=8,x=50,y=55){const f=document.getElementById('pdFx');if(!f)return;for(let i=0;i<n;i++){const s=document.createElement('span');s.textContent=chars[i%chars.length];s.style.left=(x-12+Math.random()*24)+'%';s.style.top=(y-10+Math.random()*20)+'%';s.style.animationDelay=(i*.1)+'s';f.appendChild(s);setTimeout(()=>s.remove(),2200);}}
function pose(p){const d=document.getElementById('pdDoll');if(d)d.innerHTML=doll(look(S.doll),p);}
async function walk(x){const d=document.getElementById('pdDoll'),p=document.getElementById('pdPet');if(!d)return;d.classList.add('walk');d.style.left=x+'%';if(p)p.style.left=Math.min(92,Math.max(8,x+(x>60?-16:16)))+'%';await wait(900);if(d.isConnected)d.classList.remove('walk');}
function wave(){const node=document.getElementById('pdScene');pose('wave');bub(['Hi Riki! 💖','Let’s play!','I love you!','You’re my best friend!'][Math.floor(Math.random()*4)]);setTimeout(()=>document.getElementById('pdScene')===node&&!busy&&pose('stand'),1400);}
function useToken(){if(S.tokens<=0){outOf();return false;}S.tokens--;S.plays++;save();const t=document.getElementById('pdTok');if(t){t.textContent='🎟️ '+S.tokens;t.classList.remove('bump');void t.offsetWidth;t.classList.add('bump');}return true;}
function outOf(){const p=document.getElementById('pdPanel');if(!p)return;p.innerHTML=`<div class="pd-out"><b>🎟️ Out of plays!</b><span>Win games to earn more plays for your dolls.</span><div class="pd-row"><button class="sl-big" id="pdEarnG">אב Shoresh Games</button><button class="sl-big alt" id="pdEarnS">💖 Social Skills</button></div></div>`;
 document.getElementById('pdEarnG').onclick=()=>{tap();G('menu')();};document.getElementById('pdEarnS').onclick=()=>{tap();G('selHub')();};p.scrollIntoView({block:'nearest',behavior:'smooth'});bub('We need more plays! Let’s win some!');}
async function act(spot){if(busy||!live())return;const sceneNode=document.getElementById('pdScene'),still=()=>document.getElementById('pdScene')===sceneNode;const r=ROOMS[S.room];
 if(spot==='pet'){const p=document.getElementById('pdPet');p.innerHTML=pet(S.pet,'love');p.classList.remove('hop');void p.offsetWidth;p.classList.add('hop');fx(['💖','💕'],5,parseFloat(p.style.left),70);good();setTimeout(()=>p.isConnected&&(p.innerHTML=pet(S.pet)),1300);return;}
 if(spot==='closet'||spot==='mirror'){busy=true;await walk(r.spots[spot][0]);if(!still())return;busy=false;if(spot==='closet'){wardrobe();return;}if(spot==='mirror'){pose('wave');fx(['✨','💫','⭐'],8,r.spots[spot][0]);bub('Look at me! So cute!');}style();return;}
 const s=r.spots[spot];if(!s)return;document.getElementById('pdPanel').innerHTML='';if(!useToken())return;busy=true;tap();await walk(s[0]);if(!still())return;const x=s[0];const d=document.getElementById('pdDoll');
 const A={
  bed:async()=>{d.classList.add('lie');pose('sleep');bub('Goodnight! Zzz…',3000);fx(['💤','🌙','⭐'],7,x,40);await wait(3200);if(!still())return;d.classList.remove('lie');pose('wave');bub('Good morning! ☀️');},
  stove:async()=>{await cook();},
  cabinet:async()=>{await cabinet();},
  fridge:async()=>{await snack();},
  tub:async()=>{d.classList.add('dip');bub('Bubble bath time!',2600);fx(['🫧','🫧','🦆','🫧'],12,x,62);await wait(2800);if(!still())return;d.classList.remove('dip');fx(['✨'],5,x,45);bub('So fresh and clean! ✨');},
  sink:async()=>{bub('Brush, brush, brush!',2500);fx(['🪥','🫧','✨'],8,x,38);d.classList.add('wig');await wait(2600);if(!still())return;d.classList.remove('wig');bub('Sparkly teeth! 😁');},
  toys:async()=>{const t=['🧸','🪀','🎲','🪁','🚂','🎈'];fx(t,10,x,45);d.classList.add('hop');bub('Toy party!',2500);await wait(2400);if(!still())return;d.classList.remove('hop');},
  easel:async()=>{bub('I’m painting something for you!',2600);fx(['🎨','🖌️'],5,x,40);await wait(2400);if(!still())return;const art=['🌈','🦄','🌸','🏰','🐬','🌻','🎂','💖'][Math.floor(Math.random()*8)];const p=document.getElementById('pdPanel');p.innerHTML=`<div class="pd-art"><div class="pd-frame">${art}</div><b>${look(S.doll)&&DOLLS.find(z=>z.id===S.doll).name} painted this for you!</b></div>`;good();},
  tv:async()=>{bub('Movie night! 🍿',2800);fx(['🍿','⭐','🍿'],9,x,45);await wait(3000);if(!still())return;bub('That was the best movie!');},
  swing:async()=>{const sw=document.querySelector('.pd-swing');d.classList.add('swing');sw&&sw.classList.add('go');bub('Wheee! Higher!',2800);fx(['💨','✨'],6,x,50);await wait(3200);if(!still())return;d.classList.remove('swing');sw&&sw.classList.remove('go');},
  doghouse:async()=>{const p=document.getElementById('pdPet');bub(`Fetch, ${PETS[S.pet].name}!`);fx(['🎾'],1,x,40);p.style.left='88%';await wait(900);if(!still())return;p.classList.add('hop');p.innerHTML=pet(S.pet,'love');await wait(700);if(!still())return;p.style.left=(x+12)+'%';fx(['💖','🎾'],5,x+10,65);await wait(900);if(!still())return;p.classList.remove('hop');p.innerHTML=pet(S.pet);bub('Good job! You’re the best!');},
  flowers:async()=>{bub('Grow, flowers, grow!',2500);fx(['💧','💧','🌸','🌷'],10,x,50);await wait(2600);if(!still())return;fx(['🦋'],3,x,35);bub('A butterfly came to visit! 🦋');}
 };
 try{await (A[spot]||(async()=>{}))();}catch(e){}
 if(still()){good();pose('stand');busy=false;}}
/* mini moments */
async function cook(){const sceneNode=document.getElementById('pdScene'),p=document.getElementById('pdPanel');let flips=0;bub('Let’s make pancakes!');p.innerHTML=`<div class="pd-cook"><div class="pd-pan"><span id="pdCake">🥞</span></div><div class="z-bar"><i id="pdHeat" style="width:0"></i></div><button class="sl-big" id="pdFlip">Flip when it’s golden! 🍳</button><small id="pdCookN">Flip 3 times</small></div>`;
 return new Promise(res=>{let h=0,dir=1;const iv=setInterval(()=>{if(!live()||document.getElementById('pdScene')!==sceneNode||!p.isConnected){clearInterval(iv);res();return;}h+=dir*3;if(h>=100||h<=0)dir*=-1;const b=document.getElementById('pdHeat');if(b){b.style.width=h+'%';b.style.background=h>70?'#ffb547':'#ffe0a8';}},40);
  document.getElementById('pdFlip').onclick=()=>{const c=document.getElementById('pdCake');c.classList.remove('flip');void c.offsetWidth;c.classList.add('flip');if(h>70){flips++;good();fx(['✨','⭐'],4,20,40);}else{tap();bub('Not yet! Wait for golden.',1200);}document.getElementById('pdCookN').textContent=`${flips}/3 golden flips`;
   if(flips>=3){clearInterval(iv);p.innerHTML='<div class="pd-art"><div class="pd-frame">🥞🍓</div><b>Perfect pancakes! Yum!</b></div>';bub('Yummy! Thank you, chef!');setTimeout(res,1600);}};});}
async function snack(){const p=document.getElementById('pdPanel');const foods=['🍓','🍎','🧀','🍌','🥕','🍦','🧃','🍇'];bub('What snack should I have?');p.innerHTML=`<div class="pd-pick"><b>Pick a snack!</b><div class="pd-row">${foods.map(f=>`<button class="pd-food" data-f="${f}">${f}</button>`).join('')}</div></div>`;
 return new Promise(res=>p.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=b.dataset.f;p.innerHTML=`<div class="pd-art"><div class="pd-frame">${f}</div><b>Nom nom nom!</b></div>`;fx([f,'😋','💖'],7,84,45);bub(`Mmm, I love ${f==='🍦'?'ice cream':'this'}!`);setTimeout(res,1500);}));}
async function cabinet(){const p=document.getElementById('pdPanel');const items=zs([['🥫','can'],['🫙','can'],['🍯','can'],['🍝','box'],['🥣','box'],['🍪','box'],['🍚','box'],['🥜','can']]).slice(0,6);let sel=null,left=items.length;bub('Help me put the groceries away!');
 p.innerHTML=`<div class="pd-cab"><div class="pd-shelf" data-shelf="box"><b>📦 Boxes & bags</b><div class="pd-on" id="pdOnBox"></div></div><div class="pd-shelf" data-shelf="can"><b>🥫 Cans & jars</b><div class="pd-on" id="pdOnCan"></div></div><div class="pd-row pd-groc">${items.map((it,i)=>`<button class="pd-food" data-g="${i}">${it[0]}</button>`).join('')}</div><small>Tap a grocery, then tap its shelf.</small></div>`;
 return new Promise(res=>{p.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{p.querySelectorAll('[data-g]').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=+b.dataset.g;tap();});
  p.querySelectorAll('[data-shelf]').forEach(sh=>sh.onclick=()=>{if(sel===null)return;const it=items[sel];const b=p.querySelector(`[data-g="${sel}"]`);if(it[1]===sh.dataset.shelf){b.remove();document.getElementById(it[1]==='box'?'pdOnBox':'pdOnCan').insertAdjacentHTML('beforeend',`<span>${it[0]}</span>`);good();left--;sel=null;
    if(!left){bub('All organized! You’re so helpful!');fx(['✨','⭐','💖'],8,50,30);setTimeout(res,1500);}}else{tap();sh.classList.remove('no');void sh.offsetWidth;sh.classList.add('no');bub(it[1]==='can'?'That’s a can or jar!':'That one is a box or bag!',1300);}});});}
const zs=a=>[...a].sort(()=>Math.random()-.5);
/* style studio (free) */
function style(){const p=document.getElementById('pdPanel');if(!p)return;const L={...look(S.doll)};
 const row=(k,label,n,show)=>`<div class="pd-srow"><b>${label}</b><div class="pd-opts">${Array.from({length:n},(_,i)=>`<button class="pd-opt ${L[k]===i?'on':''}" data-k="${k}" data-v="${i}" aria-label="${label} ${i+1}" aria-pressed="${L[k]===i}">${show(i)}</button>`).join('')}</div></div>`;
 const sw=c=>`<i style="background:${c}"></i>`;
 p.innerHTML=`<div class="pd-style"><h3>👗 Style ${DOLLS.find(z=>z.id===S.doll).name}</h3>${row('out','Outfit',OUTS.length,i=>['👗','🩰','👖','🧥','🌙'][i])}${row('color','Color',OUTFIT.length,i=>sw(OUTFIT[i][0]))}${row('style','Hair',STYLES.length,i=>['💁‍♀️','🎀','🍩','💇‍♀️','🐴'][i])}${row('hair','Hair color',HAIR.length,i=>sw(HAIR[i]))}${row('acc','Extras',ACC.length,i=>['🚫','🎀','〰️','👑','🌸','🐱','👓'][i])}${row('skin','Skin',SKIN.length,i=>sw(SKIN[i]))}</div>`;
 p.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(['out','color'].includes(b.dataset.k)&&WARD.equipped[S.doll]?.dress){delete WARD.equipped[S.doll].dress;saveWard();}L[b.dataset.k]=+b.dataset.v;const {identity,dressId,shoeId,hairAccessoryId,earringId,...savedLook}=L;S.looks[S.doll]=savedLook;save();tap();p.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b));});pose('wave');fx(['✨'],3,parseFloat(document.getElementById('pdDoll').style.left),40);});
 p.scrollIntoView({block:'nearest',behavior:'smooth'});}
/* dolls & pets collection */
function friends(){SET("game='';session=null;");const app=document.getElementById('app');const coins=G('coins')||0;
 app.innerHTML=`<section class="panel pd"><div class="pd-top"><button class="secondary" id="pdBack">← Play</button><b>💖 My Dolls & Pets</b><b class="pd-tok">🪙 ${coins}</b></div>
  <div class="wd-links"><button class="secondary" id="pdCollectionWardrobe">👗 My wardrobe</button><button class="secondary" id="pdClothesShop">🛍️ Clothes & accessories</button></div><h3 class="pd-h">Dolls</h3><div class="pd-col">${DOLLS.map(d=>{const own=S.dolls.includes(d.id);return `<button class="pd-card ${S.doll===d.id?'on':''} ${own?'':'locked'}" data-doll="${d.id}">${doll(look(d.id),S.doll===d.id?'wave':'stand')}<b>${d.name}</b><span>${own?(S.doll===d.id?'💖 Playing':'Tap to play'):`🪙 ${d.cost}`}</span></button>`;}).join('')}</div>
  <h3 class="pd-h">Pets</h3><button class="secondary wd-open" id="pdPetAccessories">🎀 Pet accessories</button><div class="pd-col pets">${Object.keys(PETS).map(k=>{const own=S.pets.includes(k);return `<button class="pd-card ${S.pet===k?'on':''} ${own?'':'locked'}" data-pet="${k}">${pet(k,S.pet===k?'love':'happy')}<b>${PETS[k].name}</b><span>${own?(S.pet===k?'💖 With you':'Tap to choose'):`🪙 ${PETCOST[k]}`}</span></button>`;}).join('')}</div></section>`;
 document.getElementById('pdBack').onclick=()=>{tap();screen();};
 const buy=(cost,name,ok)=>{if(!spend(cost)){toast(`You need 🪙 ${cost} for ${name}. Play games to earn coins!`);return;}ok();good();toast(`Welcome home, ${name}! 💖`);try{G('celebrate')();}catch(e){}};
 document.getElementById('pdPetAccessories').onclick=petWardrobe;document.getElementById('pdCollectionWardrobe').onclick=()=>wardrobe();document.getElementById('pdClothesShop').onclick=()=>wardrobe('shop');
 app.querySelectorAll('[data-doll]').forEach(b=>b.onclick=()=>{const d=DOLLS.find(x=>x.id===b.dataset.doll);if(S.dolls.includes(d.id)){S.doll=d.id;save();tap();friends();}else buy(d.cost,d.name,()=>{S.dolls.push(d.id);S.doll=d.id;save();friends();});});
 app.querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>{const k=b.dataset.pet;if(S.pets.includes(k)){S.pet=k;save();tap();friends();}else buy(PETCOST[k],PETS[k].name,()=>{S.pets.push(k);S.pet=k;save();friends();});});
 window.scrollTo(0,0);}
const CSS=`.pd-top{display:flex;align-items:center;justify-content:space-between;gap:6px}.pd-top .secondary{white-space:nowrap;padding:8px 12px;font-size:14px}.pd-tok{background:#fff3c4;border-radius:999px;padding:6px 12px;font-weight:900;color:#7a4f00}.pd-tok.bump{animation:pdBump .5s}
.pd-rooms{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin:10px 0}.pd-room{border:0;border-radius:14px;background:#fff;font-size:22px;padding:6px 0;display:flex;flex-direction:column;align-items:center;box-shadow:0 3px 0 #f3d6dc,0 0 0 2px #f3d6dc;cursor:pointer}.pd-room small{font-size:10px;font-weight:900;color:#6a4558}.pd-room.on{background:linear-gradient(#ff9cc6,#e2457a);box-shadow:0 3px 0 #b92e5e}.pd-room.on small{color:#fff}
.pd-scene{position:relative;width:100%;aspect-ratio:4/3;border-radius:22px;overflow:hidden;box-shadow:0 0 0 4px #fff,0 8px 20px #b9567a33;background:#fff}.pd-scene>svg{width:100%;height:100%;display:block}.pd-scene [data-spot]{cursor:pointer}.pd-scene [data-spot]:active{opacity:.85}
.pd-actor{position:absolute;bottom:3%;width:24%;transform:translateX(-50%);transition:left .9s ease-in-out;z-index:3;cursor:pointer}.pd-actor svg,.pd-petw svg{width:100%;height:auto;display:block}
.pd-actor.walk{animation:pdWalk .3s infinite alternate}.pd-actor.lie{bottom:22%;transform:translateX(-50%) rotate(-80deg)}.pd-actor.dip{bottom:-6%}.pd-actor.wig{animation:pdWig .25s infinite alternate}.pd-actor.hop,.pd-petw.hop{animation:pdHop .45s 4}.pd-actor.swing{bottom:18%;animation:pdSwing 1s infinite alternate ease-in-out;transform-origin:50% -60%}
.pd-swing{transform-origin:102px 80px}.pd-swing.go{animation:pdSwingG 1s infinite alternate ease-in-out}
.pd-petw{position:absolute;bottom:3%;width:15%;transform:translateX(-50%);transition:left .9s ease-in-out;z-index:4;cursor:pointer}.pd-wag{transform-origin:74px 86px;animation:pdWag .4s infinite alternate}
.pd-bubble{position:absolute;top:5%;left:50%;transform:translateX(-50%);max-width:80%;background:#fff;border-radius:18px;padding:8px 14px;font-weight:900;color:#4a2338;box-shadow:0 4px 0 #f3d6dc;z-index:6;text-align:center}.pd-bubble.on{animation:pdPop .3s}
.pd-fx{position:absolute;inset:0;pointer-events:none;z-index:5}.pd-fx span{position:absolute;font-size:26px;animation:pdFloat 2s ease-out forwards}
.pd-spots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.pd-spot{border:0;border-radius:16px;padding:10px;background:linear-gradient(#fff,#fff0f6);font-weight:900;color:#4a2338;display:flex;align-items:center;gap:8px;box-shadow:0 4px 0 #f0cddc,0 0 0 2px #f6d9e5;cursor:pointer;font-size:14px}.pd-spot b{font-size:24px}.pd-spot.free{background:linear-gradient(#fff,#eef8ff);box-shadow:0 4px 0 #cfe3f2,0 0 0 2px #dcebf6}
.pd-hint{font-size:12px;font-weight:800;color:#8a6577;text-align:center;margin:8px 0 0}
.pd-panel:empty{display:none}.pd-panel{margin-top:10px;background:#fff;border-radius:20px;padding:12px;box-shadow:0 0 0 2px #f6d9e5}
.pd-out,.pd-art,.pd-pick,.pd-cook,.pd-cab{display:grid;gap:8px;text-align:center;justify-items:center}.pd-out b{font-size:20px;color:#b92e5e}.pd-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:100%}.pd-row .sl-big{flex:1;min-width:140px;font-size:17px}.sl-big.alt{background:linear-gradient(135deg,#7c6cf2,#a99bff);box-shadow:0 6px 0 #5848c2}
.pd-frame{font-size:64px;background:#fff;border:8px solid #ffd34d;border-radius:12px;padding:6px 18px;box-shadow:0 6px 14px #0002}
.pd-food{border:0;border-radius:14px;background:#fff6fa;font-size:32px;padding:6px 10px;box-shadow:0 3px 0 #f3d6dc,0 0 0 2px #f3d6dc;cursor:pointer}.pd-food.sel{box-shadow:0 0 0 4px #e2457a;transform:scale(1.1)}
.pd-cab{grid-template-columns:1fr 1fr}.pd-cab .pd-groc,.pd-cab small{grid-column:1/-1}.pd-shelf{border:0;border-radius:14px;background:#ffe3ee;padding:8px;min-height:84px;cursor:pointer;box-shadow:inset 0 -6px 0 #ffc6dc}.pd-shelf b{font-size:12px;color:#8a3c5c}.pd-on{font-size:28px;min-height:36px}.pd-shelf.no{animation:pdShake .35s}
.pd-pan{width:120px;height:70px;border-radius:50%;background:radial-gradient(#666,#333);display:grid;place-items:center;font-size:42px}.pd-pan span.flip{animation:pdFlip .5s}
.pd-style h3{margin:0 0 6px;font-family:"Baloo 2",system-ui,sans-serif}.pd-srow{margin:6px 0}.pd-srow>b{font-size:12px;color:#8a6577}.pd-opts{display:flex;flex-wrap:wrap;gap:6px;margin-top:3px}.pd-opt{border:0;border-radius:12px;min-width:40px;height:40px;background:#fff6fa;font-size:20px;box-shadow:0 0 0 2px #f3d6dc;cursor:pointer;display:grid;place-items:center}.pd-opt i{width:24px;height:24px;border-radius:50%;display:block;box-shadow:inset 0 0 0 2px #0001}.pd-opt.on{box-shadow:0 0 0 3px #e2457a;background:#ffe3ee}
.pd-h{margin:12px 0 6px;font-family:"Baloo 2",system-ui,sans-serif}.pd-col{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.pd-card{border:0;border-radius:18px;background:linear-gradient(#fff,#fff0f6);padding:6px 4px 8px;display:flex;flex-direction:column;align-items:center;box-shadow:0 4px 0 #f0cddc,0 0 0 2px #f6d9e5;cursor:pointer}.pd-card svg{width:80%;height:auto}.pd-card b{font-size:14px;color:#4a2338}.pd-card span{font-size:11px;font-weight:900;color:#b92e5e}.pd-card.on{box-shadow:0 4px 0 #b92e5e,0 0 0 3px #e2457a;background:linear-gradient(#fff,#ffe0ec)}.pd-card.locked svg{filter:saturate(.5) brightness(1.05);opacity:.75}
#pdToast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,120px);background:#4a2338;color:#fff;font-weight:900;padding:10px 18px;border-radius:999px;z-index:9999;transition:transform .35s;pointer-events:none}#pdToast.on{transform:translate(-50%,0)}
.hub-play{grid-column:1/-1;background:linear-gradient(135deg,#ffd6e8,#e9dcff)!important}
@keyframes pdWalk{from{margin-bottom:0}to{margin-bottom:6px}}@keyframes pdWig{from{transform:translateX(-50%) rotate(-3deg)}to{transform:translateX(-50%) rotate(3deg)}}@keyframes pdHop{0%,100%{margin-bottom:0}50%{margin-bottom:18px}}
@keyframes pdSwing{from{transform:translateX(-50%) rotate(-14deg)}to{transform:translateX(-50%) rotate(14deg)}}@keyframes pdSwingG{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}@keyframes pdWag{from{transform:rotate(-12deg)}to{transform:rotate(14deg)}}
@keyframes pdFloat{0%{transform:translateY(0) scale(.6);opacity:0}20%{opacity:1}100%{transform:translateY(-70px) scale(1.15);opacity:0}}@keyframes pdShake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}@keyframes pdBump{50%{transform:scale(1.25)}}@keyframes pdFlip{50%{transform:translateY(-30px) rotateX(180deg)}}
@keyframes pdPop{0%{transform:translateX(-50%) scale(.85);opacity:0}100%{transform:translateX(-50%) scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){.pd-actor,.pd-petw,.pd-fx span,.pd-swing,.pd-wag{animation:none!important;transition:none!important}}`;
if(!document.getElementById('pdCss')){const st=document.createElement('style');st.id='pdCss';st.textContent=CSS;document.head.appendChild(st);}
/* Reuse the exact dressed character art as game-scene textures. */
const artData=new Map(),gameTextures=new Map();
async function embeddedArt(url){if(url.startsWith('data:'))return url;if(!artData.has(url))artData.set(url,fetch(url).then(r=>{if(!r.ok)throw Error('Artwork unavailable');return r.blob();}).then(blob=>new Promise((res,rej)=>{const f=new FileReader();f.onload=()=>res(f.result);f.onerror=rej;f.readAsDataURL(blob);})));return artData.get(url);}
function gameTexture(type='doll',id){id=id||(type==='pet'?S.pet:S.doll);const key=JSON.stringify([type,id,type==='pet'?WARD.petEquipped?.[id]:look(id)]);if(gameTextures.has(key))return gameTextures.get(key);const promise=(async()=>{let svg=(type==='pet'?pet(id):doll(look(id))).replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');const urls=[...new Set([...svg.matchAll(/href="([^"]+)"/g)].map(m=>m[1]))];for(const url of urls)svg=svg.split('href="'+url+'"').join('href="'+await embeddedArt(url)+'"');const im=new Image();await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});const cv=document.createElement('canvas');cv.width=type==='pet'?300:360;cv.height=type==='pet'?360:612;cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);return cv;})();gameTextures.set(key,promise);promise.catch(()=>gameTextures.delete(key));return promise;}

window.RikiPlay={open:screen,friends,wardrobe,petWardrobe,petGear:PET_GEAR,clothes:CLOTHES,wardrobeState:()=>JSON.parse(JSON.stringify(WARD)),state:()=>S};window.RikiArt={doll,pet,look,gameTexture};
const nav=document.querySelector('.top .stats');if(nav&&!document.getElementById('rkDollsShortcut')){const tab=document.createElement('button');tab.type='button';tab.id='rkDollsShortcut';tab.className='smallbtn';tab.textContent='🎀 Dolls & Pets';tab.onclick=()=>{tap();friends();window.scrollTo(0,0);};nav.insertBefore(tab,document.getElementById('rkShopShortcut')||nav.firstChild);}

})();


/* Shared soft 3D game illustrations, leaving word labels and controls intact. */
(function(){
 const map={sort:0,detective:1,bubbles:2,memory:3,pairs:3,wheel:4,show:4,cupcakes:5,cake:5,giftwrap:6,claw:6,garden:7,quest:7,aquarium:8};let uid=0;
 function icon(game){if(['dressup','boutique'].includes(game))return RikiArt.doll(RikiArt.look(RikiPlay.state().doll));if(game==='pets')return RikiArt.pet(RikiPlay.state().pet);const n=map[game]??6,x=n%3*1261/3,y=Math.floor(n/3)*1247/3,id='gameart'+(++uid);return `<svg viewBox="0 0 100 100" aria-hidden="true"><svg width="100" height="100" viewBox="${x} ${y} ${1261/3} ${1247/3}"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${1261/3}" height="${1247/3}"/></clipPath></defs><g clip-path="url(#${id})"><image href="assets/images/dolls/game-illustrations.webp?v=pet-play-8" width="1261" height="1247"/></g></svg></svg>`;}
 function paint(){document.querySelectorAll('.gamecard').forEach(c=>{const id=c.dataset.game||c.dataset.creative||c.dataset.extra||c.dataset.special,el=c.querySelector('.emoji');if(!id||!el||el.dataset.softToy)return;el.dataset.softToy='1';el.classList.add('game-card-art');el.innerHTML='<img class="game-art-marker" alt="" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=">'+icon(id);});document.querySelectorAll('.learning-rocket').forEach(el=>{if(el.dataset.softToy)return;el.dataset.softToy='1';el.innerHTML=icon('sort');});}
 window.RikiGameArt={icon};const app=document.getElementById('app');if(app)new MutationObserver(paint).observe(app,{childList:true,subtree:true});paint();
})();
