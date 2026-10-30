
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
const css=`.st{display:flex;flex-direction:column;gap:12px}
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
function chibi(g,{skin='#ffd8bd',hair='#7a4a2a'}={}){
  const sk=toy(skin);[-1,1].forEach(k=>{CY(g,.055,.06,.42,sk,k*.09,.24,0,12);SP(g,.07,sk,k*.09,.05,.04,1,.6,1.3);});
  CY(g,.13,.16,.36,fabric('#ffffff'),0,.6,0,20);[-1,1].forEach(k=>{const a=CY(g,.04,.045,.32,sk,k*.19,.62,0,10);a.rotation.z=k*.35;SP(g,.05,sk,k*.25,.47,0);});
  CY(g,.05,.06,.08,sk,0,.81,0,10);SP(g,.26,sk,0,1.04,0);face(g,0,1.02,.25,1.25);
  const h=toy(hair);const cap=add(g,new THREE.SphereGeometry(.275,24,16,0,Math.PI*2,0,Math.PI*.55),h,0,1.05,-.01);[-1,1].forEach(k=>{SP(g,.1,h,k*.27,1.0,-.08,1,1.4,1);});SP(g,.17,h,0,1.06,-.1,1.2,1.3,.9);
}
function kitty(g){K.B.cat(g);g.children.forEach(o=>{o.userData.baseY=o.position.y;});}
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
  steps:[0,1,2,3,4,5,6,7].map(i=>({ask:'Grab a prize',slot:'p'+i,anim:'claw',vs:[0,1,2,3,4,5].map(k=>V(['Bunny plush','Teddy plush','Star plush','Duck plush','Kitty plush','Unicorn plush'][k],g=>{const p=new THREE.Group();g.add(p);plush(p,k);p.userData.prize=i;}))}))},
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
  try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2')||canvas.getContext('webgl')||canvas.getContext('experimental-webgl');return !!gl;}catch(_){return false;}
}
function startStudio(id){
  if(!studioWebGLAvailable())return false;
  const def=GAMES[id];const {W,pool}=words();if(!W.length)return false;
  try{const a=G('audio');a&&a('tap');}catch(_){}
  SET(`game=${JSON.stringify(id)};round=(typeof round==='number'?round+1:1);`);
  const order=(window.RikiProgress&&window.RikiProgress.pick)?window.RikiProgress.pick(pool,def.steps.length):shuffle(pool).slice(0,def.steps.length);
  S={id,def,order,at:0,score:0,missed:[],tries:0,picks:[]};
  window.__stSession={order,at:0,score:0,missed:[],done:false};SET('session=window.__stSession;');
  K.loadThree(()=>{newScene(def);renderStep();},()=>{const app=document.getElementById('app');if(app)app.innerHTML='<section class="panel"><p>This game needs an internet connection to load its 3D pictures.</p></section>';});
  return true;
}
function frameHTML(body,pct){const fr=G('frame');if(typeof fr==='function'){fr(`${S.def.emoji} ${S.def.title}`,body,pct);return;}document.getElementById('app').innerHTML=body;}
function renderStep(){
  const {def,at,order}=S;const {W,pool}=words();const step=def.steps[at];const id=order[at];const w=W[id];
  const four=!!(window.RikiProgress&&window.RikiProgress.mastered(id));const nOther=four?3:2;
  const others=shuffle(pool.filter(x=>x!==id)).slice(0,nOther);const choiceIds=shuffle([id,...others]);
  let variants=shuffle(step.vs).slice(0,choiceIds.length);while(variants.length<choiceIds.length)variants.push(step.vs[variants.length%step.vs.length]);
  const flip=at%2===1;
  S.cur={id,choiceIds,variants,step,first:true};
  const dots=def.steps.map((_,i)=>`<i class="${i<at?'on':i===at?'now':''}"></i>`).join('');
  const ask=flip?`<small>${def.lead} Find the Hebrew word for</small><b>${esc(w[1])}</b>`:`<small>${def.lead} I would love</small><div class="st-he" lang="he">${esc(w[0])}</div>`;
  const cards=choiceIds.map((cid,i)=>{const v=variants[i];return `<button type="button" class="st-card" data-i="${i}" aria-label="${esc(flip?W[cid][0]:W[cid][1])}: ${esc(v.name)}"><div class="ph">✨</div>${flip?`<span class="st-he" lang="he">${esc(W[cid][0])}</span>`:`<span>${esc(W[cid][1])}</span>`}</button>`;}).join('');
  const body=`<div class="st"><div class="st-order"><div class="st-av" aria-hidden="true">${def.av}</div><div class="st-bub">${ask}</div></div>
   <div class="st-stage" id="stStage"><div class="st-burst" id="stBurst"></div></div>
   <div class="st-dots" aria-label="Step ${at+1} of ${def.steps.length}">${dots}</div>
   <p class="st-ask">${esc(step.ask)} — tap it or drag it up.</p>
   <div class="st-cards${four?' four':''}">${cards}</div>${four?'<p class="st-ask">⭐ You know this word! Now there are 4 choices.</p>':''}
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
  if(busy||b.classList.contains('bad'))return;const i=+b.dataset.i;const {id,choiceIds,variants,step}=S.cur;
  const {W}=words();
  if(choiceIds[i]!==id){b.classList.add('bad');S.cur.first=false;try{const inc=G('incorrect');inc&&inc();}catch(_){}
    const h=document.getElementById('stHint');if(h){h.hidden=false;h.innerHTML=`💡 <b lang="he" class="st-he" style="font-size:1.2rem">${esc(W[id][0])}</b> means <b>${esc(W[id][1])}</b>. ${esc(W[id][2]||'')}`;}return;}
  busy=true;b.classList.add('good');
  try{const cor=G('correct');cor&&cor(S.cur.first?3:1);}catch(_){}
  S.score+=S.cur.first?3:1;if(window.__stSession){window.__stSession.score=S.score;}
  await applyPiece(step,variants[i]);burst();
  S.picks.push(variants[i].name);S.at++;if(window.__stSession)window.__stSession.at=S.at;
  setTimeout(()=>{busy=false;if(S.at>=S.def.steps.length)finishStudio();else renderStep();},650);
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
  const ag=document.getElementById('stAgain');if(ag)ag.onclick=()=>startStudio(def===GAMES[S.id]?S.id:S.id);
  const hs=document.getElementById('stHouse');if(hs)hs.onclick=()=>{try{const hh=G('houseHome');hh&&hh();}catch(_){}};
}

/* ================= hook into the arcade ================= */
/* 2D learning fallback when 3D/WebGL cannot run. */
function startStudio2D(id){
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
  if(c&&!doneQ.has(c.key)){doneQ.add(c.key);const x=rec(c.id),ok=missedQ.has(c.key)?0:1;x.seen++;if(ok){x.first++;const d=today();if(!x.days.includes(d))x.days.push(d);x.days=x.days.slice(-10);}x.hist.push(ok);x.hist=x.hist.slice(-8);x.last=Date.now();save();}
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

/* ---- hear the Hebrew ---- */
const canSpeak='speechSynthesis' in window;let heVoice=null;
function findVoice(){if(!canSpeak)return null;const v=speechSynthesis.getVoices();heVoice=v.find(x=>/^he|^iw/i.test(x.lang))||null;return heVoice;}
if(canSpeak){findVoice();speechSynthesis.onvoiceschanged=findVoice;}
/* American (Ashkenazi) reading: a tav that isn't the first letter is read as a soft s (sav), so it goes to the voice as a samech */
function ashk(t){return String(t).replace(/[\u0591-\u05C7]/g,'').split(/\s+/).map(w=>w.replace(/(?!^)ת/g,'ס')).join(' ');}
function say(text,btn){if(!canSpeak)return;const sOn=G('soundOn');if(sOn===false&&!btn)return;try{if(btn)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(ashk(text));u.lang='he-IL';if(heVoice||findVoice())u.voice=heVoice;u.rate=.8;speechSynthesis.speak(u);
  if(btn){btn.classList.add('on');u.onend=()=>btn.classList.remove('on');}if(!heVoice&&speechSynthesis.getVoices().length&&btn&&!btn.dataset.warned){btn.dataset.warned=1;btn.title='This device may not have a Hebrew voice installed';}}catch(e){}}
const sayBtn=t=>`<button type="button" class="rk-say" data-say="${esc(t)}" aria-label="Hear it">🔊</button>`;
function addSpeakers(root){if(!canSpeak)return;(root||document).querySelectorAll('.prompt .hebrew,.st-order .st-he,.rk-prog-he').forEach(el=>{if(el.dataset.sayAdded)return;el.dataset.sayAdded=1;const t=el.textContent.trim();if(!/[֐-׿]/.test(t))return;el.insertAdjacentHTML('afterend',sayBtn(t));if(!el.classList.contains('rk-prog-he'))setTimeout(()=>{if(el.isConnected)say(t);},350);});}
/* phones only allow speech after the first tap: unlock it silently on the first touch */
let unlocked=false;document.addEventListener('pointerdown',()=>{if(unlocked||!canSpeak)return;unlocked=true;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){}},true);
document.addEventListener('click',e=>{const b=e.target.closest('.rk-say');if(!b)return;e.preventDefault();e.stopPropagation();say(b.dataset.say,b);},true);

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
function upgradeSel(root){(root||document).querySelectorAll('.sel-scene .sel-illustration').forEach(el=>{if(el.dataset.rk3)return;const txt=el.textContent.trim();if(!txt)return;el.dataset.rk3=1;
  const seed=[...txt].reduce((a,c)=>a+c.codePointAt(0),0);const K=window.RK3;if(!K)return;K.loadThree(()=>{const u=sceneImg(txt,seed);if(u&&el.isConnected){el.innerHTML=`<img class="rk-sel-img" src="${u}" alt="${esc(txt)}">`;}},()=>{});});}

/* ---- Progress screen ---- */
function progressPage(){
  const W=G('W')||[];const fr=G('frame');if(typeof fr!=='function')return;SET("game='progress';session=null;");
  const rows=W.map((w,i)=>({i,w,r:P[i]})).filter(x=>x.r&&x.r.seen);const totalSeen=rows.reduce((a,x)=>a+x.r.seen,0),totalFirst=rows.reduce((a,x)=>a+x.r.first,0);
  const mcount=rows.filter(x=>mastered(x.i)).length;rows.sort((a,b)=>(a.r.first/a.r.seen)-(b.r.first/b.r.seen)||b.r.miss-a.r.miss);
  const bar=p=>`<span class="rk-bar"><i style="width:${Math.round(p*100)}%"></i></span>`;
  const list=rows.length?rows.map(x=>{const p=x.r.first/x.r.seen;return `<li><span class="rk-prog-he" lang="he">${esc(x.w[0])}</span><span class="rk-prog-mean">${esc(x.w[1])}${mastered(x.i)?' ⭐':''}</span>${bar(p)}<span class="rk-prog-num">${Math.round(p*100)}% · ${x.r.seen}</span></li>`;}).join(''):'<p class="subtle">Play a few word games and her progress will show up here.</p>';
  fr('📊 Riki\'s Progress',`<div class="rk-prog"><div class="rk-tiles"><div><b>${rows.length}</b><span>words practiced</span></div><div><b>${mcount}</b><span>mastered ⭐</span></div><div><b>${totalSeen?Math.round(totalFirst/totalSeen*100):0}%</b><span>right on first try</span></div></div>
   <p class="subtle">Hardest words are at the top. "Mastered" means right on the first try 3 times in a row, on at least 2 different days. Tricky words come up more often in the games, and mastered words get 4 choices and no hints.</p>
   <ul class="rk-prog-list">${list}</ul><div class="row"><button class="primary" id="rkPractice">🔎 Practice the tricky words</button></div><p class="subtle">Saved on this device only.</p></div>`);
  addSpeakers(document.getElementById('app'));const b=document.getElementById('rkPractice');if(b)b.onclick=()=>{const st=G('start');st&&st('detective');};}
function addProgressButton(){const stats=document.querySelector('.top .stats');if(!stats||document.getElementById('rkProgressBtn'))return;const b=document.createElement('button');b.className='smallbtn';b.id='rkProgressBtn';b.textContent='📊 Progress';b.onclick=progressPage;const set=document.getElementById('settingsToggle');stats.insertBefore(b,set||null);}
addProgressButton();

/* ---- keep everything applied as screens change ---- */
const app=document.getElementById('app');
if(app)new MutationObserver(()=>{addSpeakers(app);upgradeSel(app);hideHints();}).observe(app,{childList:true,subtree:true});
addSpeakers(app);upgradeSel(app);
window.RikiProgress={pick,mastered,data:()=>P,say,show:progressPage};
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
   <div class="hub-grid">${tile('hubGames','<span class="hub-alef" lang="he">אב</span>','Shoresh Games','Learn Hebrew roots')}${tile('hubSocial','💖','Social Skills','Feelings & friends')}${tile('hubHouse','🏠','My Dollhouse','Decorate your rooms')}${tile('hubShop','🛍️','Shop',`🪙 ${coins} coins to spend`)}</div>
   <button type="button" class="hub-progress" id="hubProgress">📊 Progress for grown-ups</button></section>`;
  const $=id=>document.getElementById(id);const tap=()=>{try{const a=G('audio');a&&a('tap');}catch(_){}};
  $('hubGames').onclick=()=>{tap();const m=G('menu');m&&m();window.scrollTo(0,0);};
  $('hubSocial').onclick=()=>{tap();const s=G('selHub');s&&s();addOlderSocial();window.scrollTo(0,0);};
  $('hubHouse').onclick=()=>{tap();const h=G('houseHome');h&&h();window.scrollTo(0,0);};
  $('hubShop').onclick=()=>{tap();const h=G('houseHome');h&&h();SET("housePage='shop';");const r=G('houseRender');r&&r();window.scrollTo(0,0);};
  $('hubProgress').onclick=()=>{tap();window.RikiProgress&&window.RikiProgress.show();};
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
function header(){const stats=document.querySelector('.top .stats');if(!stats||document.getElementById('hubHomeBtn'))return;const b=document.createElement('button');b.className='smallbtn';b.id='hubHomeBtn';b.textContent='🏠 Home';b.onclick=hub;stats.insertBefore(b,stats.firstChild);
  const brand=document.querySelector('.top .brand');if(brand){brand.style.cursor='pointer';brand.onclick=hub;}}
header();
if(!G('game'))hub();
})();
