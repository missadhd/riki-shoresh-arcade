
/* Riki 3D Catalog: a chunky, cartoon 3D model for every shop item, new items, and 3D shop thumbnails. */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
const K=window.RK3;if(!K)return;
const {B,mat,fabric,gloss,wood,metalM,RB,BX,CY,SP,CO,add,eye,legs4,shadeHex}=K;
const M=K.MODEL;

/* ---------- new shop items ---------- */
const NEW=[
 ['rockinghorse','🐴','Rocking horse plush',38,'bedroom','Plushies'],
 ['playtent','⛺','Starry play tent',44,'bedroom','Decor'],
 ['toycastle','🏰','Toy castle playset',52,'bedroom','Plushies'],
 ['bunnyplush','🐰','Giant bunny plush',24,'bedroom','Plushies'],
 ['nightstand','🌙','Moon nightstand',26,'bedroom','Storage'],
 ['fireplace','🔥','Cozy fireplace',70,'living','Decor'],
 ['grandclock','🕰️','Grandfather clock',46,'living','Decor'],
 ['tvcabinet','📺','Cartoon TV cabinet',58,'living','Storage'],
 ['fishtank','🐠','Bubbly fish tank',54,'living','Decor'],
 ['armchairheart','💗','Heart armchair',44,'living','Sofas'],
 ['toaster','🍞','Pastel toaster',18,'kitchen','Appliances'],
 ['waffles','🧇','Waffle tower',16,'kitchen','Treats'],
 ['donuttower','🍩','Donut tower',20,'kitchen','Treats'],
 ['fruitbowl','🍓','Fruit bowl',14,'kitchen','Treats'],
 ['lemonade','🍋','Lemonade stand',62,'garden','Outdoor'],
 ['slide','🛝','Rainbow slide',66,'garden','Outdoor'],
 ['trampoline','🤸','Bouncy trampoline',58,'garden','Outdoor'],
 ['sandbox','🏖️','Sandbox & castle',40,'garden','Outdoor'],
 ['birdhouse','🐦','Birdhouse post',24,'garden','Decor'],
 ['mushroomring','🍄','Mushroom fairy ring',30,'garden','Decor'],
 ['snowglobe','🔮','Snow globe',22,'any','Decor'],
 ['petduck','🦆','Rubber ducky friend',28,'any','Pets'],
 ['petfish','🐟','Goldfish bowl',26,'any','Pets'],
 ['pettoy','🧶','Yarn & toy basket',14,'any','Pet Care'],
 ['pinata','🪅','Star piñata',22,'any','Birthday'],
 ['icecreamtower','🍦','Ice cream sundae tower',26,'any','Birthday']
];
const ITEMS=G('ITEMS');if(Array.isArray(ITEMS))NEW.forEach(it=>{if(!ITEMS.some(x=>x[0]===it[0]))ITEMS.push(it);});

/* ---------- cute helpers ---------- */
const C={pink:'#f7a0bd',hot:'#e2457a',mint:'#8ed6c4',sky:'#8fc6e8',lilac:'#c8a2ff',sun:'#ffd25e',cream:'#fff4e6',white:'#fdfbfb',peach:'#ffb48a',gold:'#f2c94c',choc:'#8a5a35',red:'#ef5a6f',green:'#5fb06a',navy:'#4b4a8f'};
const toy=c=>mat(c,.42);
function face(g,x,y,z,s=1){[-1,1].forEach(k=>{SP(g,.034*s,eye(),x+k*.075*s,y,z);SP(g,.011*s,mat('#ffffff',.1),x+k*.075*s+.012*s,y+.014*s,z+.028*s);SP(g,.03*s,mat('#ff9fb8',.9),x+k*.12*s,y-.045*s,z-.006*s,1,.6,.4);});
  const m=add(g,new THREE.TorusGeometry(.04*s,.011*s,8,16,Math.PI),eye(),x,y-.045*s,z+.004);m.rotation.z=Math.PI;}
function heartShape(r){const s=new THREE.Shape();s.moveTo(0,-r);s.bezierCurveTo(-r*1.1,-r*.2,-r*1.1,r*.85,0,r*.35);s.bezierCurveTo(r*1.1,r*.85,r*1.1,-r*.2,0,-r);return s;}
function starShape(r,ir=.45){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,rr=i%2?r*ir:r;i?s.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):s.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}return s;}
function moonShape(r){const s=new THREE.Shape();s.absarc(0,0,r,Math.PI*.15,Math.PI*1.85,false);s.absarc(r*.45,0,r*.78,Math.PI*1.75,Math.PI*.25,true);return s;}
function ext(g,shape,depth,m,x,y,z,bev=.03){const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:3,curveSegments:16});geo.center();return add(g,geo,m,x,y,z);}
const puff=(g,x,y,z,s,c)=>[[0,0,0,1],[-.6,-.15,0,.75],[.6,-.15,0,.75],[-.3,.3,0,.7],[.3,.3,0,.7]].forEach(([a,b,cz,k])=>SP(g,.2*s*k,fabric(c||C.white),x+a*.22*s,y+b*.22*s,z+cz));
function balloon(g,x,y,z,c,s=1){SP(g,.13*s,gloss(c),x,y,z,1,1.18,1);CO(g,.025*s,.04*s,gloss(c),x,y-.16*s,z).rotation.x=Math.PI;CY(g,.004,.004,y-.05,mat('#ffffff',.6),x,(y-.16*s)/2,z,4);}
function books(g,x,y,z,w,cols){let px=x-w/2,i=0;while(px<x+w/2-.05){const bw=.05+((i*37)%5)/100,bh=.2+((i*53)%9)/60;BX(g,bw,bh,.18,mat(cols[i%cols.length],.6),px+bw/2,y+bh/2,z);px+=bw+.006;i++;}}
function drawers(g,w,h,d,n,c,knob,x=0,y=0,z=0){RB(g,w,h,d,.05,toy(c),x,y+h/2+.06,z);const dh=(h-.08)/n;for(let i=0;i<n;i++){RB(g,w-.1,dh-.05,.04,.02,toy(shadeHex(c,1.06)),x,y+.1+dh*i+dh/2,z+d/2);SP(g,.035,knob||metalM(),x,y+.1+dh*i+dh/2,z+d/2+.04);}legs4(g,w,d,.07,wood('#c08a5a'),.08,.03);}
function mirrorPlate(g,shape,r,frameC,x,y,z){const f=ext(g,shape,.05,metalM(frameC||C.gold),x,y,z,.02);const gl=ext(g,shape,.01,mat('#dff3ff',.05,.6),x,y,z+.035,.0);gl.scale.set(.86,.86,1);return f;}
function cushion(g,w,d,c,x,y,z){RB(g,w,.12,d,.05,fabric(c),x,y,z);}
function rugDisc(g,r,c1,c2){const a=CY(g,r,r,.025,fabric(c1),0,.013,0,48);a.castShadow=false;const b=CY(g,r*.7,r*.7,.03,fabric(c2),0,.016,0,48);b.castShadow=false;}

/* ---------- beds ---------- */
const bedBase=(g,c)=>B.bed(g,c);
M.bed=g=>bedBase(g,C.pink);M.bedpink=g=>bedBase(g,'#f9b8cc');M.bedcanopy=g=>B.canopy(g,C.pink);
M.bedcloud=g=>{bedBase(g,C.sky);puff(g,0,1.15,-.84,1.6,C.white);puff(g,-.45,.95,-.82,1,C.white);puff(g,.45,.95,-.82,1,C.white);};
M.bedbunk=g=>{const w=wood('#e9c58f');bedBase(g,C.mint);const up=new THREE.Group();up.position.y=1.05;g.add(up);bedBase(up,C.pink);[[-.62,-.85],[.62,-.85],[-.62,.85],[.62,.85]].forEach(([x,z])=>RB(g,.09,2.1,.09,.03,w,x,1.05,z));
  ['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2'].forEach((c,i)=>RB(g,.06,.06,1.7,.02,toy(c),-.62,1.5+i*.06,0));for(let i=0;i<5;i++)RB(g,.4,.05,.05,.02,w,.75,.3+i*.32,.6);[-.95,-.55].forEach(z=>{});RB(g,.05,1.6,.05,.02,w,.55,.8,.62);RB(g,.05,1.6,.05,.02,w,.95,.8,.62);};
M.bedshell=g=>{bedBase(g,'#bfe8f2');for(let i=0;i<9;i++){const a=Math.PI*(i/8);const r=SP(g,.18,toy(i%2?'#fbe6f0':'#f7c7da'),Math.cos(a)*.5,.95+Math.sin(a)*.5,-.84,.55,1.4,.4);r.rotation.z=a-Math.PI/2;}SP(g,.08,gloss('#fffaf3'),0,1.25,-.72);};
M.bedcarriage=g=>{const body=SP(g,.85,toy('#ffa95e'),0,.75,0,1.1,.75,1.25);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;SP(g,.12,toy('#ff9a4d'),Math.cos(a)*.93,.75,Math.sin(a)*1.06,.4,3.6,.4);}
  RB(g,1.2,.25,1.5,.1,fabric(C.pink),0,1.1,0);RB(g,.5,.14,.3,.06,fabric(C.cream),0,1.27,-.5);CY(g,.06,.08,.3,toy(C.green),0,1.42,-.95);SP(g,.12,toy(C.green),.12,1.52,-.95,1,.4,.6);
  [[-.8,.75],[.8,.75],[-.8,-.75],[.8,-.75]].forEach(([x,z])=>{const w=add(g,new THREE.TorusGeometry(.22,.05,10,24),metalM(C.gold),x,.24,z);w.rotation.y=Math.PI/2;});};
M.bedloft=g=>{const w=wood('#f3dcc0');const up=new THREE.Group();up.position.y=1.15;g.add(up);bedBase(up,C.lilac);[[-.62,-.85],[.62,-.85],[-.62,.85],[.62,.85]].forEach(([x,z])=>RB(g,.1,2.0,.1,.03,w,x,1.0,z));
  RB(g,1.24,.08,1.7,.03,w,0,1.42,0);cushion(g,.8,.6,C.mint,0,.08,0);RB(g,.7,.3,.12,.05,fabric(C.pink),0,.3,-.3);books(g,-.2,.15,.55,.5,['#e2457a','#ffd25e','#7cc4f2']);
  for(let i=0;i<5;i++)RB(g,.05,.05,.45,.02,w,.72,.35+i*.35,.35);};
M.bedcottage=g=>{const w=wood('#b47c4c');bedBase(g,'#9fd4a8');const sh=new THREE.Shape();sh.moveTo(-.7,0);sh.lineTo(0,.55);sh.lineTo(.7,0);sh.lineTo(-.7,0);ext(g,sh,.12,toy('#e2457a'),0,1.32,-.86,.03);BX(g,.18,.18,.03,mat('#bfe7ff',.1),0,1.02,-.78);};
M.bedcastle=g=>{bedBase(g,C.lilac);[-.62,.62].forEach(x=>{CY(g,.16,.16,1.6,toy('#f3e6ff'),x,.8,-.85);CO(g,.2,.45,toy('#e2457a'),x,1.82,-.85);});BX(g,1.0,.9,.12,toy('#f3e6ff'),0,.85,-.86);for(let i=0;i<4;i++)BX(g,.14,.14,.14,toy('#f3e6ff'),-.36+i*.24,1.35,-.86);};

/* ---------- sofas & seating ---------- */
const sofa=(g,c)=>B.sofa(g,c);
M.lamp=g=>sofa(g,C.sky);M.sofabubble=g=>{sofa(g,'#f6a6c8');[-.4,0,.4].forEach((x,i)=>SP(g,.1,gloss(['#ffffff','#ffd25e','#c8a2ff'][i]),x,.74,.0));};M.sofamint=g=>sofa(g,C.mint);
M.sofastar=g=>{sofa(g,'#7b78c9');[-.4,.4].forEach(x=>ext(g,starShape(.16),.07,toy(C.sun),x,.78,-.05,.02));};
M.sofacrescent=g=>{ext(g,moonShape(.7),.55,fabric('#ffd27a'),0,.65,-.05,.06).rotation.z=Math.PI/2;cushion(g,1.0,.5,'#fff1c9',0,.42,.1);};
M.sofachester=g=>{sofa(g,'#c9486f');for(let i=0;i<8;i++)SP(g,.025,metalM(C.gold),-.6+i*.17,.7,-.14);};
M.sofacloud=g=>{RB(g,1.5,.3,.7,.14,fabric(C.white),0,.3,0);[-.5,0,.5].forEach(x=>SP(g,.32,fabric(C.white),x,.72,-.22,1,.9,.6));[-.78,.78].forEach(x=>SP(g,.26,fabric(C.white),x,.5,0));cushion(g,1.2,.5,'#e7f4ff',0,.5,.08);};
M.sofabow=g=>{sofa(g,'#f7b2c4');[-1,1].forEach(k=>{const b=SP(g,.16,toy(C.hot),k*.17,.98,-.27,1.4,.9,.5);b.rotation.z=k*.4;});SP(g,.07,toy(C.hot),0,.98,-.25);};
M.sofaseashell=g=>{cushion(g,1.4,.6,'#fbe6f0',0,.32,.05);for(let i=0;i<9;i++){const a=Math.PI*(i/8);const r=SP(g,.2,toy(i%2?'#f7c7da':'#ffd9e6'),Math.cos(a)*.62,.42+Math.sin(a)*.5,-.25,.55,1.3,.45);r.rotation.z=a-Math.PI/2;}RB(g,1.4,.22,.6,.08,toy('#f7c7da'),0,.15,.05);};
M.sofacorner=g=>{sofa(g,'#9aa7d6');const s2=new THREE.Group();s2.position.set(-.55,0,.75);s2.rotation.y=Math.PI/2;g.add(s2);RB(s2,.8,.28,.72,.08,fabric('#9aa7d6'),0,.3,0);cushion(s2,.7,.58,'#b3bee6',0,.5,.05);};
M.armchairheart=g=>{cushion(g,.8,.7,C.pink,0,.42,.05);ext(g,heartShape(.45),.18,fabric(C.hot),0,.8,-.28,.05);legs4(g,.7,.6,.3,wood('#c08a5a'),.05,.03);};
M.chair=g=>B.chair(g,C.sky);M.chairpink=g=>B.chair(g,'#f2a5c0');M.chairmint=g=>B.chair(g,C.mint);
M.chairgold=g=>{B.chair(g,'#fff1dc');g.children.forEach(o=>{if(o.geometry&&o.geometry.type==='CylinderGeometry')o.material=metalM(C.gold);});};
M.chairheart=g=>{RB(g,.52,.08,.5,.03,toy(C.cream),0,.46,0);RB(g,.48,.08,.46,.04,fabric(C.pink),0,.53,0);ext(g,heartShape(.27),.06,toy(C.hot),0,.95,-.22,.02);legs4(g,.5,.48,.44,metalM(C.gold),.05,.022);};
M.chairshell=g=>{RB(g,.55,.1,.5,.04,toy('#fbe6f0'),0,.5,0);for(let i=0;i<7;i++){const a=Math.PI*(i/6);const r=SP(g,.11,toy(i%2?'#f7c7da':'#ffd9e6'),Math.cos(a)*.24,.62+Math.sin(a)*.3,-.22,.5,1.4,.4);r.rotation.z=a-Math.PI/2;}legs4(g,.5,.45,.46,metalM(C.gold),.06,.02);};
const toadstool=(g,c,h=.45,r=.33)=>{CY(g,.12,.16,h,toy(C.cream),0,h/2,0);const cap=SP(g,r,toy(c),0,h,0,1,.55,1);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;SP(g,.05,toy('#ffffff'),Math.cos(a)*r*.6,h+r*.38,Math.sin(a)*r*.6,1,.4,1);}SP(g,.06,toy('#ffffff'),0,h+r*.55,0,1,.4,1);};
M.chairmushroom=g=>toadstool(g,C.red);M.stoolmushroom=g=>toadstool(g,'#f28db2');
M.chairdiner=g=>{RB(g,1.1,.25,.55,.08,toy('#ef5a6f'),0,.35,0);RB(g,1.1,.7,.2,.08,toy('#ef5a6f'),0,.75,-.2);RB(g,1.0,.06,.04,.02,metalM('#dfe6ea'),0,.48,.27);RB(g,1.12,.12,.56,.04,metalM('#dfe6ea'),0,.12,0);};
M.chairbow=g=>{B.chair(g,C.cream);[-1,1].forEach(k=>{const b=SP(g,.12,toy(C.hot),k*.12,1.08,-.22,1.4,.9,.4);b.rotation.z=k*.4;});SP(g,.05,toy(C.hot),0,1.08,-.2);};
M.chairbutterfly=g=>{RB(g,.52,.1,.5,.04,toy(C.cream),0,.48,0);[-1,1].forEach(k=>{const w=SP(g,.2,toy(k<0?C.lilac:C.sky),k*.17,.85,-.22,.9,1.2,.2);w.rotation.z=k*.4;SP(g,.13,toy(C.pink),k*.15,.62,-.22,.8,.9,.2);});legs4(g,.5,.45,.46,wood('#c08a5a'),.06,.025);};
M.chairrattan=g=>{const r=mat('#d9b07a',.9);CY(g,.3,.24,.12,r,0,.48,0,24);const back=add(g,new THREE.TorusGeometry(.3,.06,10,24,Math.PI),r,0,.55,-.05);back.rotation.x=-.3;cushion(g,.46,.42,C.cream,0,.58,0);legs4(g,.4,.4,.44,wood('#a8744a'),.04,.022);};
M.beanbag=g=>{SP(g,.48,toy(C.red),0,.42,0,1,.9,1);CO(g,.3,.45,toy(C.red),0,-.0,0).rotation.x=Math.PI;for(let i=0;i<14;i++){const a=i*2.3,y=.25+(i%5)*.12;SP(g,.03,toy(C.sun),Math.cos(a)*.47*Math.sin(y*3),y+.1,Math.sin(a)*.47*Math.sin(y*3),1,1.5,1);}for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const l=SP(g,.14,toy(C.green),Math.cos(a)*.16,.83,Math.sin(a)*.16,1.3,.35,.6);l.rotation.y=-a;}};
M.poufsun=g=>{CY(g,.38,.38,.3,fabric('#a86b45'),0,.16,0,32);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const p=SP(g,.13,fabric(C.sun),Math.cos(a)*.42,.18,Math.sin(a)*.42,1.4,.4,.7);p.rotation.y=-a;}};
M.hangingchair=g=>{const st=metalM('#e8e2d8');const arc=add(g,new THREE.TorusGeometry(.75,.04,10,32,Math.PI),st,0,1.0,0);arc.rotation.z=0;CY(g,.35,.4,.05,st,0,.025,0);
  const egg=SP(g,.42,mat('#e7d3b0',.9,0,{side:THREE.DoubleSide}),0,.95,0,1,1.25,1);CY(g,.01,.01,.35,st,0,1.6,0,6);cushion(g,.55,.45,C.pink,0,.72,.12);SP(g,.12,fabric(C.mint),0,.95,-.15);};

/* ---------- tables ---------- */
M.table=g=>B.table(g);M.tablepink=g=>B.table(g,'#f2a5c0');M.tablewood=g=>B.dining(g);M.coffeetable=g=>{RB(g,1.1,.08,.6,.03,wood('#c99363'),0,.38,0);legs4(g,1.0,.5,.35,wood('#a8744a'),.05,.03);books(g,-.25,.42,0,.3,[C.hot,C.sun]);};
M.tableglass=g=>{const gl=CY(g,.55,.55,.03,mat('#dff3ff',.05,.1,{transparent:true,opacity:.55}),0,.68,0,40);legs4(g,.7,.7,.66,metalM(C.gold),.04,.02);SP(g,.06,toy(C.pink),0,.74,0);};
M.tableheart=g=>{ext(g,heartShape(.5),.06,toy(C.pink),0,.68,0,.03).rotation.x=-Math.PI/2;CY(g,.06,.08,.6,metalM(C.gold),0,.33,0,16);CY(g,.26,.28,.04,metalM(C.gold),0,.02,0);};
M.tabletulip=g=>{CY(g,.5,.5,.06,gloss('#ffffff'),0,.68,0,40);CY(g,.05,.12,.62,gloss('#ffffff'),0,.34,0,24);CY(g,.3,.34,.05,gloss('#ffffff'),0,.03,0);B.flowers?0:0;CY(g,.06,.05,.12,mat('#bfe7ff',.1,0,{transparent:true,opacity:.6}),0,.77,0,12);SP(g,.05,toy(C.hot),0,.88,0);};
M.tablepicnic=g=>{B.dining(g);const t=document.createElement('canvas');t.width=t.height=64;const x=t.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#ffffff':'#ef5a6f';x.fillRect(i*8,j*8,8,8);}const tx=new THREE.CanvasTexture(t);tx.encoding=THREE.sRGBEncoding;
  BX(g,1.56,.012,.9,mat('#ffffff',.9,0,{map:tx}),0,.745,0);SP(g,.08,toy(C.red),.3,.8,.1);SP(g,.08,toy(C.sun),.15,.8,-.1);};
M.tablediner=g=>{CY(g,.5,.5,.06,toy('#7fd1c0'),0,.72,0,32);add(g,new THREE.TorusGeometry(.5,.03,8,40),metalM('#dfe6ea'),0,.72,0).rotation.x=Math.PI/2;CY(g,.05,.05,.7,metalM('#dfe6ea'),0,.36,0,12);CY(g,.25,.25,.04,metalM('#dfe6ea'),0,.02,0);CY(g,.05,.04,.2,toy(C.pink),.15,.85,0);SP(g,.04,toy(C.red),.15,.97,0);};
M.tablebutterfly=g=>{[-1,1].forEach(k=>{const w=SP(g,.42,toy(k<0?C.lilac:C.sky),k*.36,.68,0,1,.08,.9);SP(g,.25,toy(C.pink),k*.3,.69,.28,1,.08,.8);});CY(g,.06,.06,.66,metalM(C.gold),0,.34,0);CY(g,.28,.3,.04,metalM(C.gold),0,.02,0);};
M.tablecafe=g=>{CY(g,.36,.36,.04,mat('#f4f1ec',.3),0,.72,0,32);CY(g,.03,.03,.7,metalM('#3a3438'),0,.36,0);CY(g,.22,.24,.03,metalM('#3a3438'),0,.015,0);CY(g,.05,.04,.08,gloss('#ffffff'),.12,.78,0);SP(g,.06,toy('#f2c94c'),-.1,.8,.05,1.3,.7,1);};
M.tableisland=g=>{RB(g,1.5,.8,.7,.03,toy('#9fd4c6'),0,.4,0);BX(g,1.6,.06,.8,mat('#f4f2f0',.25),0,.83,0);for(let i=0;i<3;i++)SP(g,.03,metalM(C.gold),-.5+i*.5,.55,.36);[-.4,.4].forEach(x=>{CY(g,.13,.13,.06,toy(C.pink),x,.62,.65);CY(g,.02,.02,.6,metalM(C.gold),x,.3,.65);});};
M.tablemushroom=g=>toadstool(g,'#ff9a4d',.32,.48);
M.tableaquarium=g=>{RB(g,1.1,.08,.6,.02,wood('#c99363'),0,.62,0);const tank=BX(g,1.0,.5,.5,mat('#bfe8ff',.05,0,{transparent:true,opacity:.45}),0,.32,0);tank.castShadow=false;BX(g,.95,.05,.45,mat('#f3e3b8',.9),0,.1,0);[[-.2,.3,'#ff8a3d'],[.2,.4,'#ffd25e'],[0,.25,'#c8a2ff']].forEach(([x,y,c])=>SP(g,.06,gloss(c),x,y,0,1.6,1,.6));CY(g,.02,.02,.3,toy(C.green),.35,.25,0);};
M.tablerainbow=g=>{[['#e2457a',.7,.55,0],['#ffd25e',.5,.42,.2],['#7cc4f2',.32,.3,.35]].forEach(([c,w,h,dz])=>{RB(g,w,.05,w*.7,.02,toy(c),0,h,dz);legs4(g,w,w*.7,h,toy(c),.04,.02);g.children.slice(-4).forEach(o=>o.position.z+=dz);});};
M.tablechess=g=>{const t=document.createElement('canvas');t.width=t.height=64;const x=t.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#fff4e6':'#c9486f';x.fillRect(i*8,j*8,8,8);}const tx=new THREE.CanvasTexture(t);tx.encoding=THREE.sRGBEncoding;
  RB(g,.7,.06,.7,.02,wood('#c99363'),0,.6,0);BX(g,.6,.01,.6,mat('#ffffff',.4,0,{map:tx}),0,.635,0);legs4(g,.6,.6,.58,wood('#a8744a'),.06,.03);[[-.15,.1],[.12,-.15]].forEach(([a,b],i)=>{CY(g,.03,.04,.08,gloss(i?'#ffffff':'#4a2338'),a,.68,b);SP(g,.03,gloss(i?'#ffffff':'#4a2338'),a,.74,b);});};

/* ---------- vanities, dressers, storage ---------- */
function vanity(g,c,mirror){RB(g,1.0,.08,.48,.03,toy(c),0,.72,0);RB(g,.36,.5,.44,.04,toy(c),-.3,.45,0);RB(g,.3,.12,.03,.02,toy(shadeHex(c,1.08)),-.3,.55,.23);SP(g,.025,metalM(C.gold),-.3,.55,.26);legs4(g,.95,.42,.7,metalM(C.gold),.04,.02);
  mirror(g);CY(g,.03,.035,.1,gloss('#c8a2ff'),.2,.82,.05);SP(g,.04,gloss('#ffd6e6'),.32,.8,.08);CY(g,.2,.2,.1,fabric(C.pink),0,.42,.5);CY(g,.02,.02,.4,metalM(C.gold),0,.2,.5);}
const ovalMirror=(g,col)=>{const m=SP(g,.3,metalM(col||C.gold),0,1.2,-.18,1,1.25,.15);SP(g,.26,mat('#e4f6ff',.05,.6),0,1.2,-.15,1,1.25,.05);};
M.desk=g=>vanity(g,C.cream,ovalMirror);M.vanity=g=>vanity(g,C.pink,ovalMirror);
M.vanitybow=g=>vanity(g,'#fbe0ea',gg=>{ovalMirror(gg);[-1,1].forEach(k=>{const b=SP(gg,.12,toy(C.hot),k*.11,1.62,-.14,1.4,.9,.4);b.rotation.z=k*.4;});SP(gg,.05,toy(C.hot),0,1.62,-.12);});
M.vanitystar=g=>vanity(g,'#d9ccff',gg=>{ext(gg,starShape(.38),.05,metalM(C.gold),0,1.22,-.18,.02);ext(gg,starShape(.3),.01,mat('#e4f6ff',.05,.6),0,1.22,-.14,0);});
M.vanityheart=g=>vanity(g,C.pink,gg=>{ext(gg,heartShape(.33),.05,toy(C.hot),0,1.2,-.18,.02);ext(gg,heartShape(.26),.01,mat('#e4f6ff',.05,.6),0,1.21,-.14,0);for(let i=0;i<7;i++){const a=Math.PI*.15+i/6*Math.PI*.7;SP(gg,.035,mat('#fff3c4',.3,0,{emissive:new THREE.Color('#ffd27a'),emissiveIntensity:1}),Math.cos(a)*.36,1.15+Math.sin(a)*.32,-.12);}});
M.vanityhollywood=g=>vanity(g,'#ffffff',gg=>{RB(gg,.7,.6,.05,.02,toy('#fbe0ea'),0,1.18,-.18);BX(gg,.6,.5,.01,mat('#e4f6ff',.05,.6),0,1.18,-.15);for(let i=0;i<5;i++){[-.35,.35].forEach(x=>SP(gg,.035,mat('#fff3c4',.3,0,{emissive:new THREE.Color('#ffd27a'),emissiveIntensity:1.2}),x,.95+i*.12,-.14));}});
M.vanityshell=g=>vanity(g,'#cdeef2',gg=>{for(let i=0;i<9;i++){const a=Math.PI*(i/8);const r=SP(gg,.11,toy(i%2?'#f7c7da':'#ffd9e6'),Math.cos(a)*.32,1.0+Math.sin(a)*.34,-.18,.5,1.4,.3);r.rotation.z=a-Math.PI/2;}SP(gg,.07,gloss('#fffaf3'),0,1.05,-.1);});
M.vanitywood=g=>{vanity(g,'#d9a36f',ovalMirror);g.children.forEach(o=>{if(o.material===toy('#d9a36f'))o.material=wood('#b47c4c');});};
M.vanityrainbow=g=>vanity(g,'#fff4e6',gg=>{ovalMirror(gg,'#ffffff');['#e2457a','#ffd25e','#5cc6a8','#7cc4f2'].forEach((c,i)=>{const t=add(gg,new THREE.TorusGeometry(.42-i*.06,.03,8,32,Math.PI),toy(c),0,1.42,-.2);});puff(gg,-.42,1.4,-.17,.6);puff(gg,.42,1.4,-.17,.6);});
M.dresser=g=>drawers(g,.9,.8,.48,3,'#f9cfe0');M.dresserpearl=g=>drawers(g,.9,.8,.48,3,'#f7f1ec',gloss('#ffffff'));M.dressermint=g=>drawers(g,.9,.8,.48,3,C.mint);
M.dresserflower=g=>{drawers(g,.9,.8,.48,3,'#fff1dc');g.children.filter(o=>o.geometry&&o.geometry.type==='SphereGeometry').forEach(o=>{for(let i=0;i<5;i++){const a=i/5*Math.PI*2;SP(g,.03,toy(C.pink),o.position.x+Math.cos(a)*.04,o.position.y+Math.sin(a)*.04,o.position.z);}});};
M.dresserstack=g=>{['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2'].forEach((c,i)=>{RB(g,.8-i*.06,.18,.45,.04,toy(c),(i%2?.04:-.04),.1+i*.19,0);SP(g,.03,metalM(),(i%2?.04:-.04),.1+i*.19,.24);});};
M.wardrobe=g=>{RB(g,1.0,1.8,.55,.05,toy('#f9cfe0'),0,.95,0);BX(g,.01,1.6,.02,mat('#c98aa3',.6),0,.95,.28);[-.08,.08].forEach(x=>RB(g,.03,.25,.03,.01,metalM(C.gold),x,1.0,.3));const sh=new THREE.Shape();sh.moveTo(-.55,0);sh.quadraticCurveTo(0,.35,.55,0);sh.lineTo(-.55,0);ext(g,sh,.5,toy('#f7b2c4'),0,1.95,0,.02);legs4(g,.9,.45,.08,wood('#c08a5a'),.06,.03);};
M.nightstand=g=>{drawers(g,.5,.5,.4,2,'#c8bdf0');ext(g,moonShape(.14),.04,mat('#fff3c4',.3,0,{emissive:new THREE.Color('#ffd27a'),emissiveIntensity:.9}),0,.78,0,.01);};
function openCase(g,w,h,d,m,back){BX(g,w,.05,d,m,0,.025,0);BX(g,w,.05,d,m,0,h-.025,0);BX(g,.05,h,d,m,-w/2+.025,h/2,0);BX(g,.05,h,d,m,w/2-.025,h/2,0);BX(g,w,h,.03,back||m,0,h/2,-d/2+.015);}
B.shelf=function(g,c){const col=c||'#c99363',m=toy(col),bk=toy(shadeHex(col,.85));openCase(g,1.1,1.5,.38,m,bk);[.52,1.0].forEach(y=>BX(g,1.0,.04,.34,m,0,y,0));[.05,.54,1.02].forEach((y,i)=>books(g,0,y,.02,.85,[[C.hot,C.sky,C.sun,C.mint],[C.lilac,C.pink,'#ff9a4d',C.sky],[C.sun,C.mint,C.hot,C.lilac]][i]));SP(g,.08,toy(C.pink),.35,1.6,0);};
const shelf=(g,c)=>B.shelf(g,c);
M.shelfrose=g=>shelf(g,'#c97f8e');M.shelfgold=g=>{shelf(g,'#f6dfa2');};M.shelfmint=g=>shelf(g,'#9fd4c6');
M.shelfcloud=g=>{shelf(g,'#eef6ff');puff(g,0,1.62,0,1.8,C.white);};
M.shelfmoon=g=>{ext(g,moonShape(.8),.35,toy('#c8bdf0'),0,.85,0,.03);[.5,.95].forEach(y=>BX(g,.55,.03,.3,wood('#f3dcc0'),-.15,y,0));books(g,-.15,.53,0,.45,[C.hot,C.sun,C.sky]);books(g,-.18,.98,0,.35,[C.mint,C.lilac]);};
M.shelftree=g=>{CY(g,.16,.22,1.7,mat('#9a6a3f',.95),0,.85,0,10);[[.4,1.4],[.6,-1],[1.0,1]].forEach(([y,s])=>{BX(g,.6,.04,.3,wood('#c99363'),s*.35,y,0);books(g,s*.38,y+.02,0,.4,[C.hot,C.sun,C.sky]);});SP(g,.45,toy(C.green),0,1.85,0);SP(g,.3,toy('#4f9e5b'),-.35,1.7,.1);SP(g,.3,toy('#4f9e5b'),.35,1.75,-.1);};
M.shelfhouse=g=>{openCase(g,1.0,1.15,.36,toy('#fff4e6'),toy('#ffe0ea'));g.children.forEach(o=>o.position.y+=0);const sh=new THREE.Shape();sh.moveTo(-.6,0);sh.lineTo(0,.45);sh.lineTo(.6,0);sh.lineTo(-.6,0);ext(g,sh,.36,toy(C.hot),0,1.35,0,.02);BX(g,.9,.03,.32,toy('#f3dcc0'),0,.62,.01);books(g,0,.64,0,.7,[C.sky,C.sun,C.lilac,C.mint]);SP(g,.09,toy(C.pink),-.2,.2,.05);SP(g,.09,toy(C.sky),.2,.2,.05);};
M.shelfrainbow=g=>{['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2'].forEach((c,i)=>{const t=add(g,new THREE.TorusGeometry(.75-i*.12,.06,10,32,Math.PI),toy(c),0,.1,0);t.scale.z=4;});BX(g,1.4,.04,.3,wood('#f3dcc0'),0,.1,0);books(g,0,.12,0,.8,[C.hot,C.sky,C.sun]);};
M.shelfladder=g=>{const w=wood('#d9a36f');[-.4,.4].forEach(x=>{const r=RB(g,.06,1.7,.06,.02,w,x,.85,0);r.rotation.x=-.18;});[.3,.75,1.2].forEach((y,i)=>{BX(g,.85,.03,.32-i*.06,w,0,y,.1-i*.08);});SP(g,.1,toy(C.green),-.2,1.32,-.05);books(g,0,.32,.1,.5,[C.hot,C.sun]);CY(g,.08,.06,.12,toy(C.pink),.25,.82,.02);};
M.shelfpineapple=g=>{SP(g,.55,toy(C.sun),0,.8,0,1,1.4,.75);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const l=SP(g,.2,toy(C.green),Math.cos(a)*.1,1.62,Math.sin(a)*.1,.3,1.2,.6);l.rotation.z=Math.cos(a)*.5;l.rotation.x=Math.sin(a)*.5;}RB(g,.6,.7,.04,.02,mat('#dff3ff',.05,0,{transparent:true,opacity:.5}),0,.8,.38);BX(g,.55,.02,.3,wood('#f3dcc0'),0,.8,.2);};
M.shelfcastle=g=>{CY(g,.42,.42,1.6,toy('#f3e6ff'),0,.8,0,24);CO(g,.52,.6,toy(C.hot),0,1.9,0);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;BX(g,.12,.12,.12,toy('#f3e6ff'),Math.cos(a)*.4,1.65,Math.sin(a)*.4);}[.4,.9].forEach(y=>{BX(g,.6,.03,.1,wood('#f3dcc0'),0,y,.38);books(g,0,y+.02,.38,.45,[C.sky,C.sun,C.mint]);});};
M.cupboard=g=>{RB(g,1.2,.85,.5,.03,toy('#f9cfe0'),0,.43,0);BX(g,1.25,.05,.55,mat('#f4f2f0',.25),0,.88,0);RB(g,1.2,.55,.3,.03,toy('#f9cfe0'),0,1.55,-.1);[-.3,.3].forEach(x=>{RB(g,.5,.7,.03,.02,toy('#fbe0ea'),x,.43,.25);SP(g,.03,metalM(C.gold),x*.2,.5,.28);RB(g,.5,.45,.03,.02,toy('#fbe0ea'),x,1.55,.06);});};
M.books=g=>{for(let i=0;i<5;i++){const b=RB(g,.5-i*.03,.08,.36,.01,toy([C.hot,C.sky,C.sun,C.mint,C.lilac][i]),0,.04+i*.085,0);b.rotation.y=(i%2?.2:-.15);}SP(g,.06,toy(C.pink),0,.5,0);};
M.bookset=g=>{books(g,0,0,0,.8,[C.hot,'#ff9a4d',C.sun,C.mint,C.sky,C.lilac]);[-.44,.44].forEach(x=>RB(g,.06,.32,.2,.02,toy(C.pink),x,.16,0));};

/* ---------- lights & decor ---------- */
const glow=(c,i=1)=>mat(c,.35,0,{emissive:new THREE.Color(c),emissiveIntensity:i*.45});
M.light=g=>B.lamp(g);
M.dininglamp=g=>{CY(g,.006,.006,1.2,metalM(),0,1.4,0,4);const sh=add(g,new THREE.SphereGeometry(.28,24,12,0,Math.PI*2,0,Math.PI/2),mat(C.mint,.4,0,{side:THREE.DoubleSide}),0,.8,0);SP(g,.08,glow('#ffd27a',1.4),0,.78,0);g.position.y=0;};
M.lampmushroom=g=>{CY(g,.08,.11,.32,glow('#ffe7b8',.5),0,.16,0);const cap=SP(g,.25,glow('#ff8fb2',.7),0,.32,0,1,.6,1);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;SP(g,.035,glow('#ffffff',.8),Math.cos(a)*.15,.43,Math.sin(a)*.15,1,.4,1);}const L=new THREE.PointLight(0xffa3c2,.4,2.2,2);L.position.y=.35;g.add(L);};
M.lampmoon=g=>{ext(g,moonShape(.3),.12,glow('#ffe08a',1),0,.42,0,.03);CY(g,.16,.2,.06,toy(C.navy),0,.03,0);CY(g,.02,.02,.14,metalM(),0,.12,0);face(g,-.12,.45,.09,.8);const L=new THREE.PointLight(0xffe08a,.35,2,2);L.position.y=.5;g.add(L);};
M.fairylights=g=>{const pts=[];for(let i=0;i<=20;i++){const t=i/20;pts.push(new THREE.Vector3(-.9+t*1.8,1.6-Math.sin(t*Math.PI)*.35,0));}const curve=new THREE.CatmullRomCurve3(pts);add(g,new THREE.TubeGeometry(curve,40,.006,4),mat('#6a8a5a',.6),0,0,0);
  for(let i=1;i<20;i+=2){const p=curve.getPoint(i/20);SP(g,.04,glow(['#ffd27a','#ff9fc0','#a9e4ff','#c8a2ff'][i%4],1.3),p.x,p.y-.04,p.z);}[-.9,.9].forEach(x=>RB(g,.05,1.6,.05,.02,wood('#c08a5a'),x,.8,0));};
M.picture=g=>{RB(g,.7,.55,.04,.015,metalM(C.gold),0,0,0);const c=document.createElement('canvas');c.width=128;c.height=100;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,0,100);gr.addColorStop(0,'#8fd0f5');gr.addColorStop(1,'#d8f0ff');x.fillStyle=gr;x.fillRect(0,0,128,100);x.fillStyle='#7cc46f';x.beginPath();x.ellipse(40,100,70,34,0,0,7);x.fill();x.fillStyle='#5fb06a';x.beginPath();x.ellipse(100,100,60,26,0,0,7);x.fill();x.fillStyle='#ffd25e';x.beginPath();x.arc(98,26,12,0,7);x.fill();x.fillStyle='#e2457a';[30,46,60].forEach(px=>{x.beginPath();x.arc(px,78,4,0,7);x.fill();});
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;add(g,new THREE.PlaneGeometry(.6,.46),mat('#ffffff',.7,0,{map:t}),0,0,.025).castShadow=false;};M.picture.wall=1;
M.clock=g=>{CY(g,.3,.3,.08,toy(C.pink),0,0,0,32).rotation.x=Math.PI/2;CY(g,.25,.25,.02,mat('#fffaf3',.4),0,0,.04,32).rotation.x=Math.PI/2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;SP(g,.015,eye(),Math.cos(a)*.2,Math.sin(a)*.2,.055);}
  const h=BX(g,.025,.13,.01,eye(),0,.05,.06);const m=BX(g,.02,.18,.01,eye(),.06,.02,.065);m.rotation.z=-1.1;[-1,1].forEach(k=>SP(g,.07,metalM(C.gold),k*.2,.3,0));};M.clock.wall=1;
M.grandclock=g=>{RB(g,.55,1.9,.38,.04,wood('#8a5a35'),0,.95,0);CY(g,.2,.2,.04,mat('#fffaf3',.4),0,1.55,.2,32).rotation.x=Math.PI/2;BX(g,.02,.12,.01,eye(),0,1.58,.23);BX(g,.3,.55,.01,mat('#dff3ff',.05,0,{transparent:true,opacity:.5}),0,.85,.2);CY(g,.006,.006,.4,metalM(C.gold),0,.92,.15,4);CY(g,.07,.07,.02,metalM(C.gold),0,.7,.15,20).rotation.x=Math.PI/2;CO(g,.3,.25,wood('#8a5a35'),0,2.02,0);};
M.star=g=>{ext(g,starShape(.3),.1,gloss(C.sun),0,.62,0,.04);CY(g,.03,.03,.3,metalM(),0,.18,0);CY(g,.14,.16,.05,toy(C.lilac),0,.03,0);face(g,0,.64,.1,.9);};
M.seastar=g=>{const s=ext(g,starShape(.36,.5),.1,toy('#ff9a7a'),0,.07,0,.05);s.rotation.x=-Math.PI/2;for(let i=0;i<15;i++){const a=Math.random()*Math.PI*2,r=.05+Math.random()*.25;SP(g,.015,toy('#ffd2c2'),Math.cos(a)*r,.15,Math.sin(a)*r);}face(g,0,.16,.06,1.2);};
M.bow=g=>{[-1,1].forEach(k=>{const b=SP(g,.2,toy(C.hot),k*.19,.5,0,1.3,.85,.45);b.rotation.z=k*.45;const t=SP(g,.07,toy(C.hot),k*.1,.28,0,.6,1.7,.3);t.rotation.z=k*.35;});SP(g,.08,toy('#c9356a'),0,.5,.02);CY(g,.03,.03,.3,metalM(),0,.15,0);CY(g,.14,.16,.04,toy(C.pink),0,.02,0);};
M.crystal=g=>{const c=add(g,new THREE.OctahedronGeometry(.3,0),mat('#c9b8ff',.1,.2,{transparent:true,opacity:.85,emissive:new THREE.Color('#9d7bff'),emissiveIntensity:.35}),0,.6,0);c.scale.y=1.4;[[-.22,.2],[.2,.25]].forEach(([x,s])=>{const k=add(g,new THREE.OctahedronGeometry(s*.6,0),mat('#ffc4e1',.1,.2,{transparent:true,opacity:.85}),x,.2,.05);k.scale.y=1.5;});CY(g,.28,.32,.06,toy('#e8e0f8'),0,.03,0);const L=new THREE.PointLight(0xb69bff,.35,2,2);L.position.y=.6;g.add(L);};
M.heartmirror=g=>{ext(g,heartShape(.36),.06,toy(C.hot),0,0,0,.02);ext(g,heartShape(.28),.01,mat('#e4f6ff',.05,.6),0,.01,.04,0);};M.heartmirror.wall=1;
M.mirrorstar=g=>{for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const r=BX(g,.025,.22+(i%2)*.1,.02,metalM(C.gold),Math.cos(a)*.38,Math.sin(a)*.38,0);r.rotation.z=a-Math.PI/2;}CY(g,.26,.26,.04,metalM(C.gold),0,0,0,32).rotation.x=Math.PI/2;CY(g,.22,.22,.02,mat('#e4f6ff',.05,.6),0,0,.025,32).rotation.x=Math.PI/2;};M.mirrorstar.wall=1;
M.pinkcurtains=g=>{CY(g,.018,.018,1.3,metalM(C.gold),0,.65,0,8).rotation.z=Math.PI/2;[-1,1].forEach(k=>{const c=SP(g,.25,fabric('#f7a0bd'),k*.4,.05,.02,.75,2.4,.25);[-1,1].forEach(j=>{const b=SP(g,.07,toy(C.hot),k*.4+j*.07,.05,.1,1.3,.8,.5);b.rotation.z=j*.4;});});};M.pinkcurtains.wall=1;
M.jellyfish=g=>{CY(g,.005,.005,.4,metalM(),0,1.8,0,4);[[0,1.45,0,C.lilac],[-.3,1.25,.1,C.pink],[.3,1.3,-.1,C.sky]].forEach(([x,y,z,c])=>{add(g,new THREE.SphereGeometry(.16,20,12,0,Math.PI*2,0,Math.PI/2),toy(c),x,y,z);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;CY(g,.012,.006,.3,toy(c),x+Math.cos(a)*.1,y-.15,z+Math.sin(a)*.1,4);}face(g,x,y+.06,z+.15,.7);CY(g,.003,.003,1.8-y,metalM(),x,(1.8+y)/2,z,3);});};
M.bubbles=g=>{[[0,.3,0,.25],[-.25,.6,.1,.15],[.22,.75,-.05,.18],[.05,1.0,.1,.12],[-.1,1.2,0,.08]].forEach(([x,y,z,r])=>{const b=SP(g,r,mat('#c9f0ff',.05,.3,{transparent:true,opacity:.4}),x,y,z);b.castShadow=false;SP(g,r*.2,mat('#ffffff',.1),x-r*.4,y+r*.4,z+r*.6);});};
M.sponge=g=>{const s=RB(g,.6,.5,.4,.12,toy('#ff9fb0'),0,.3,0);for(let i=0;i<10;i++){SP(g,.04,toy('#f27891'),-.24+(i*.13)%.5,.12+((i*.17)%.36),.2);}face(g,0,.38,.21,1.3);};
M.pineapple=g=>{SP(g,.7,toy(C.sun),0,.9,0,1,1.35,1);for(let i=0;i<24;i++){const a=i*.8,y=.4+(i%8)*.14;SP(g,.035,toy('#e0a43a'),Math.cos(a)*.69*Math.sin(Math.acos((y-.9)/.95)),y,Math.sin(a)*.69*Math.sin(Math.acos((y-.9)/.95)));}
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const l=SP(g,.3,toy(C.green),Math.cos(a)*.12,1.95,Math.sin(a)*.12,.3,1.3,.6);l.rotation.z=Math.cos(a)*.5;l.rotation.x=Math.sin(a)*.5;}RB(g,.32,.5,.06,.12,wood('#a8744a'),0,.3,.66);SP(g,.025,metalM(C.gold),.08,.3,.7);CY(g,.1,.1,.02,mat('#bfe7ff',.1),0,1.05,.68,20).rotation.x=Math.PI/2;};
M.snowglobe=g=>{CY(g,.26,.3,.16,wood('#c08a5a'),0,.08,0,24);const b=SP(g,.27,mat('#e6f7ff',.05,.1,{transparent:true,opacity:.35}),0,.42,0);b.castShadow=false;CO(g,.1,.22,toy(C.green),0,.32,0);SP(g,.06,toy('#ffffff'),.1,.22,.05);for(let i=0;i<14;i++)SP(g,.012,toy('#ffffff'),Math.cos(i)*.15,.3+(i%5)*.05,Math.sin(i*2)*.15);};
M.plant=g=>B.plant(g);
M.plantcactus=g=>{CY(g,.22,.17,.3,toy('#f7a0bd'),0,.15,0);SP(g,.2,toy('#6ec07a'),0,.55,0,1,1.4,1);[-1,1].forEach(k=>{const a=SP(g,.09,toy('#6ec07a'),k*.2,.6,0,1,1.6,1);a.rotation.z=-k*.3;});face(g,0,.58,.19,1.1);SP(g,.05,toy(C.hot),0,.86,0);};
const vase=(g,c)=>{CY(g,.12,.15,.3,gloss(c),0,.15,0,20);CY(g,.08,.12,.06,gloss(c),0,.33,0,20);};
M.plantmini=g=>{vase(g,C.sky);[[-.06,0,C.red],[.06,.03,C.pink],[0,-.06,C.sun]].forEach(([x,z,c],i)=>{CY(g,.008,.008,.35,toy(C.green),x,.5,z,4);SP(g,.06,toy(c),x,.7,z,1,1.3,1);});};
M.pinkflowers=g=>{vase(g,'#ffffff');for(let i=0;i<9;i++){const a=i*2.4,r=.05+(i%3)*.06;CY(g,.008,.008,.5,toy('#8a5a35'),Math.cos(a)*r*.5,.55,Math.sin(a)*r*.5,4);SP(g,.07,fabric(i%2?'#ffc4d8':'#ff9fc0'),Math.cos(a)*r,.75+(i%4)*.06,Math.sin(a)*r);}};
M.flowers=g=>{vase(g,C.lilac);[[0,0,C.hot],[-.08,.04,C.sun],[.08,-.03,C.sky],[.03,.08,'#ffffff'],[-.05,-.07,C.pink]].forEach(([x,z,c],i)=>{const h=.55+i*.05;CY(g,.008,.008,h-.3,toy(C.green),x*.6,.3+(h-.3)/2,z*.6,4);for(let k=0;k<5;k++){const a=k/5*Math.PI*2;SP(g,.035,fabric(c),x+Math.cos(a)*.04,h,z+Math.sin(a)*.04);}SP(g,.025,toy(C.sun),x,h+.01,z);});};
M.flowers2=g=>B.flowers(g);M.rug=g=>rugDisc(g,.9,'#7fd1c0','#ffd96b');
M.sparklerug=g=>{['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2','#c8a2ff'].forEach((c,i)=>{const r=CY(g,.95-i*.14,.95-i*.14,.03,fabric(c),0,.015+i*.002,0,48);r.castShadow=false;});};
M.rugflower=g=>{for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const p=SP(g,.32,fabric('#ffe3ee'),Math.cos(a)*.48,.02,Math.sin(a)*.48,1,.06,.55);p.rotation.y=-a;p.castShadow=false;}CY(g,.3,.3,.04,fabric(C.sun),0,.025,0,32).castShadow=false;};
M.rugcloud=g=>{[[0,0,.5],[-.45,.1,.38],[.45,.1,.38],[-.2,-.25,.35],[.25,-.25,.35]].forEach(([x,z,r])=>{const c=CY(g,r,r,.04,fabric('#cfe6ff'),x,.02,z,32);c.castShadow=false;});};

/* ---------- toys & plushies ---------- */
M.teddy=g=>B.teddy(g);M.unicorn=g=>B.unicorn(g);
M.bunnyplush=g=>{B.bunny(g);g.scale.setScalar(1.25);g.children.forEach(o=>{if(o.material&&o.material.color&&o.material.roughness>.9)o.material=fabric('#ffd9e6');});};
M.rockinghorse=g=>{const rk=add(g,new THREE.TorusGeometry(.7,.04,8,32,Math.PI*.55),wood('#c08a5a'),0,.72,0);rk.rotation.z=Math.PI*1.225;rk.scale.z=1;[-.15,.15].forEach(z=>{const r=add(g,new THREE.TorusGeometry(.7,.04,8,32,Math.PI*.55),wood('#c08a5a'),0,.72,z);r.rotation.z=Math.PI*1.225;});
  SP(g,.28,fabric('#f7c7da'),0,.6,0,1.4,.8,.8);SP(g,.16,fabric('#f7c7da'),.4,.88,0,1.2,.9,.8);for(let i=0;i<5;i++)SP(g,.06,fabric(C.lilac),.28-i*.06,1.0-i*.04,0);[[-.25,.1],[.25,.1],[-.25,-.1],[.25,-.1]].forEach(([x,z])=>CY(g,.05,.05,.3,fabric('#f7c7da'),x,.35,z));SP(g,.025,eye(),.52,.95,.1);SP(g,.025,eye(),.52,.95,-.1);};
M.toycastle=g=>{BX(g,.9,.5,.5,toy('#f3e6ff'),0,.25,0);[-1,1].forEach(k=>{CY(g,.13,.13,.8,toy('#f3e6ff'),k*.45,.4,.2);CO(g,.17,.3,toy(C.hot),k*.45,.95,.2);CY(g,.13,.13,.8,toy('#f3e6ff'),k*.45,.4,-.2);CO(g,.17,.3,toy(C.lilac),k*.45,.95,-.2);});const d=new THREE.Shape();d.moveTo(-.12,0);d.lineTo(-.12,.15);d.absarc(0,.15,.12,Math.PI,0,true);d.lineTo(.12,0);d.lineTo(-.12,0);ext(g,d,.02,wood('#a8744a'),0,.14,.26,.01);CY(g,.005,.005,.3,metalM(),0,.65,0,4);BX(g,.15,.1,.01,toy(C.sun),.08,.75,0);};
M.playtent=g=>{const sh=new THREE.Shape();sh.moveTo(-.65,0);sh.lineTo(0,1.2);sh.lineTo(.65,0);sh.lineTo(-.65,0);const t=ext(g,sh,1.0,fabric('#c8bdf0'),0,.6,0,.02);for(let i=0;i<6;i++)ext(g,starShape(.05),.01,toy(C.sun),-.3+(i%3)*.3,.35+Math.floor(i/3)*.35,.52,.005);
  const flap=SP(g,.2,fabric('#fff4e6'),0,.3,.5,1,1.4,.2);[-.6,.6].forEach(x=>{});CY(g,.012,.012,.3,metalM(),0,1.35,0,4);BX(g,.18,.1,.01,toy(C.hot),.09,1.42,0);cushion(g,.5,.3,C.pink,0,.06,.7);};
M.piano=g=>B.piano(g);

/* ---------- kitchen ---------- */
M.fridge=g=>B.fridge(g);M.stove=g=>B.stove(g);
M.fridgeretro=g=>{RB(g,.78,1.7,.66,.22,gloss('#9fe0cf'),0,.86,0);BX(g,.7,.012,.02,mat('#6fb8a6',.4),0,1.18,.34);RB(g,.05,.3,.06,.02,metalM('#dfe6ea'),.28,1.4,.36);RB(g,.05,.3,.06,.02,metalM('#dfe6ea'),.28,.9,.36);legs4(g,.6,.5,.1,metalM('#dfe6ea'),.04,.03);g.children.slice(-4).forEach(o=>o.position.y-=.0);};
M.ovenheart=g=>{RB(g,.85,.86,.64,.05,toy('#fbe0ea'),0,.43,0);BX(g,.83,.02,.6,gloss('#4a2338'),0,.87,0);ext(g,heartShape(.2),.02,mat('#ffb48a',.1,0,{emissive:new THREE.Color('#ff8a3d'),emissiveIntensity:.6}),0,.43,.33,.01);[-.3,-.1,.1,.3].forEach(x=>CY(g,.03,.03,.03,gloss(C.hot),x,.76,.33,12).rotation.x=Math.PI/2);};
M.sink=g=>{RB(g,1.0,.85,.55,.03,toy('#cfe8f7'),0,.43,0);BX(g,1.05,.05,.6,mat('#f4f2f0',.25),0,.88,0);BX(g,.5,.04,.32,metalM('#c5ccd0'),0,.9,.03);CY(g,.02,.02,.25,metalM('#dfe6ea'),0,1.02,-.18,10);const sp=CY(g,.018,.018,.18,metalM('#dfe6ea'),0,1.13,-.1,10);sp.rotation.x=Math.PI/2;[-.25,.25].forEach(x=>RB(g,.42,.65,.03,.02,toy('#e2f2fb'),x,.43,.28));};
M.mixer=g=>{RB(g,.36,.08,.24,.03,gloss(C.pink),0,.04,0);RB(g,.1,.45,.14,.05,gloss(C.pink),-.12,.28,0);RB(g,.42,.16,.2,.08,gloss(C.pink),0,.55,0);CY(g,.14,.1,.18,metalM('#dfe6ea'),.06,.18,0);};
M.coffeemachine=g=>{RB(g,.42,.5,.32,.04,gloss('#3a3438'),0,.25,0);RB(g,.44,.1,.34,.03,metalM('#dfe6ea'),0,.55,0);CY(g,.05,.04,.08,gloss('#ffffff'),0,.08,.1);[-.1,.1].forEach(x=>SP(g,.03,gloss(C.hot),x,.42,.17));CY(g,.015,.015,.06,metalM(),0,.2,.1);};
M.icecreamcart=g=>{RB(g,1.0,.6,.55,.05,toy('#fff4e6'),0,.55,0);BX(g,1.02,.12,.57,toy(C.pink),0,.3,0);[-1,1].forEach(k=>{const w=add(g,new THREE.TorusGeometry(.16,.04,10,24),gloss(C.hot),k*.35,.18,.29);});
  CY(g,.02,.02,1.0,metalM(),0,1.3,0,8);const um=add(g,new THREE.ConeGeometry(.75,.3,12),toy(C.mint),0,1.85,0);[[-.25,'#ffd6e6'],[0,'#fff1c9'],[.25,'#c9f0e2']].forEach(([x,c])=>{CO(g,.05,.14,toy('#e0a96d'),x,.9,0).rotation.x=Math.PI;SP(g,.07,toy(c),x,1.0,0);});};
M.cupcakecase=g=>{RB(g,.9,.3,.45,.03,toy(C.pink),0,.15,0);const gl=RB(g,.86,.5,.42,.03,mat('#e6f7ff',.05,0,{transparent:true,opacity:.35}),0,.55,0);gl.castShadow=false;[[-.25,.36],[0,.36],[.25,.36],[-.12,.6],[.12,.6]].forEach(([x,y],i)=>{CY(g,.07,.05,.08,toy(['#ffd25e','#e2457a','#7cc4f2'][i%3]),x,y,0);SP(g,.075,toy(['#fff1dc','#ffc4d8','#c9f0e2'][i%3]),x,y+.08,0,1,.8,1);});};
M.tea=g=>B.tea(g);M.teacups=g=>{[[-.15,0],[.15,.05],[0,-.15]].forEach(([x,z],i)=>{CY(g,.11,.11,.015,gloss('#ffffff'),x,.01,z);CY(g,.07,.055,.08,gloss(['#f7a0bd','#8ed6c4','#c8a2ff'][i]),x,.06,z,20);const h=add(g,new THREE.TorusGeometry(.03,.008,6,12),gloss(['#f7a0bd','#8ed6c4','#c8a2ff'][i]),x+.075,.06,z);});};
M.cake=g=>B.cake(g);
const tier=(g,r,h,y,c)=>{CY(g,r,r,h,toy(c),0,y+h/2,0,32);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;SP(g,.025*(r*3),toy('#ffffff'),Math.cos(a)*r,y+h,Math.sin(a)*r,1,1.4,1);}};
M.birthdaycake=g=>{CY(g,.42,.4,.03,gloss('#ffffff'),0,.015,0);tier(g,.36,.18,.03,C.pink);tier(g,.27,.16,.21,'#fff1dc');tier(g,.18,.14,.37,C.mint);[-.08,0,.08].forEach(x=>{CY(g,.012,.012,.1,toy(C.sky),x,.56,0);SP(g,.018,glow('#ffb020',1.4),x,.63,0,1,1.6,1);});};
M.partycake=g=>{CY(g,.5,.48,.03,gloss('#ffffff'),0,.015,0);['#f7a0bd','#fff1dc','#c8a2ff','#8ed6c4','#ffd25e'].forEach((c,i)=>tier(g,.44-i*.075,.14,.03+i*.14,c));ext(g,starShape(.08),.02,metalM(C.gold),0,.84,0,.01);};
M.cupcake=g=>{[[-.15,0],[.15,0],[0,.14]].forEach(([x,z],i)=>{CY(g,.09,.07,.1,toy(['#ffd25e','#7cc4f2','#e2457a'][i]),x,.05,z,16);SP(g,.095,toy(['#ffc4d8','#fff1dc','#c9f0e2'][i]),x,.14,z,1,.85,1);SP(g,.025,gloss(C.red),x,.23,z);});};
M.cakeplate=g=>{CY(g,.22,.2,.02,gloss('#ffffff'),0,.01,0);const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(.18,-.08);s.lineTo(.18,.08);s.lineTo(0,0);const sl=add(g,new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:false}),toy('#fff1dc'),-.06,.03,0);sl.rotation.x=-Math.PI/2;SP(g,.03,gloss(C.red),.1,.17,0);};
M.toaster=g=>{RB(g,.42,.3,.26,.08,gloss('#9fd4f0'),0,.15,0);[-.07,.07].forEach(x=>{BX(g,.04,.02,.18,eye(),x,.305,0);RB(g,.12,.12,.02,.01,toy('#e0a96d'),x,.36,0);});SP(g,.03,gloss(C.hot),.22,.18,0);face(g,0,.18,.135,.8);};
M.waffles=g=>{CY(g,.2,.2,.01,gloss('#ffffff'),0,.005,0);for(let i=0;i<4;i++){const w=RB(g,.28,.05,.28,.02,toy('#e9b36a'),0,.04+i*.055,0);w.rotation.y=i*.3;}SP(g,.06,toy('#fff8e6'),0,.27,0,1,.5,1);SP(g,.035,gloss(C.red),.04,.3,0);};
M.donuttower=g=>{CY(g,.015,.015,.6,toy('#f4e4c8'),0,.3,0);['#f7a0bd','#c8a2ff','#8ed6c4','#ffd25e'].forEach((c,i)=>{const d=add(g,new THREE.TorusGeometry(.13,.065,12,24),toy('#e9b36a'),0,.08+i*.13,0);d.rotation.x=Math.PI/2;const f=add(g,new THREE.TorusGeometry(.13,.05,10,24),toy(c),0,.1+i*.13,0);f.rotation.x=Math.PI/2;f.scale.z=.7;});CY(g,.18,.2,.03,gloss('#ffffff'),0,.015,0);};
M.fruitbowl=g=>{add(g,new THREE.SphereGeometry(.25,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),gloss(C.sky),0,.25,0).material.side=THREE.DoubleSide;[[0,.28,0,C.red,.09],[-.1,.26,.06,C.sun,.08],[.1,.27,-.05,'#ff9a4d',.08],[.02,.32,.1,'#9d6bd6',.06],[-.05,.35,-.06,C.green,.07]].forEach(([x,y,z,c,r])=>SP(g,r,gloss(c),x,y,z));};
M.icecreamtower=g=>{CY(g,.13,.08,.25,mat('#e6f7ff',.05,0,{transparent:true,opacity:.5}),0,.125,0);['#ffc4d8','#fff1c9','#c9f0e2'].forEach((c,i)=>SP(g,.12,toy(c),0,.3+i*.15,0));SP(g,.06,fabric('#ffffff'),0,.7,0);SP(g,.035,gloss(C.red),0,.78,0);};

/* ---------- party ---------- */
M.birthdayballoons=g=>{[[0,1.3,0,C.hot],[-.25,1.15,.1,C.sky],[.25,1.2,-.05,C.sun],[-.1,1.5,-.1,C.lilac],[.15,1.45,.12,C.mint]].forEach(([x,y,z,c])=>balloon(g,x,y,z,c));CY(g,.1,.12,.12,toy(C.pink),0,.06,0);};
M.partyarch=g=>{const cols=[C.hot,C.sun,C.mint,C.sky,C.lilac,C.pink];for(let i=0;i<=16;i++){const a=Math.PI*(i/16);SP(g,.12,gloss(cols[i%cols.length]),Math.cos(a)*.9,Math.sin(a)*1.3,(i%2)*.08,1,1.15,1);}};
M.birthdaybanner=g=>{[-.9,.9].forEach(x=>RB(g,.05,1.4,.05,.02,wood('#c08a5a'),x,.7,0));const cols=[C.hot,C.sun,C.mint,C.sky,C.lilac];for(let i=0;i<9;i++){const t=i/8,x=-.8+t*1.6,y=1.32-Math.sin(t*Math.PI)*.22;const f=CO(g,.08,.2,toy(cols[i%5]),x,y-.1,0);f.rotation.x=Math.PI;f.scale.z=.15;}CY(g,.004,.004,1.8,metalM(),0,1.3,0,4).rotation.z=Math.PI/2;};
M.birthdaygifts=g=>{[[0,.18,0,.36,C.hot,C.sun],[-.32,.12,.1,.24,C.sky,C.pink],[.3,.13,.05,.26,C.mint,C.hot],[.02,.46,0,.2,C.lilac,C.sun]].forEach(([x,y,z,s,c,r])=>{RB(g,s,s,s,.02,toy(c),x,y,z);BX(g,s+.01,s+.01,.04,toy(r),x,y,z);BX(g,.04,s+.01,s+.01,toy(r),x,y,z);[-1,1].forEach(k=>{const b=SP(g,s*.2,toy(r),x+k*s*.17,y+s/2+.03,z,1.3,.8,.5);b.rotation.z=k*.5;});});};
M.birthdayhat=g=>{[[0,0,C.hot],[-.25,.1,C.sky],[.25,.05,C.mint]].forEach(([x,z,c])=>{CO(g,.12,.32,toy(c),x,.16,z);SP(g,.04,fabric('#ffffff'),x,.34,z);for(let i=0;i<4;i++)SP(g,.018,toy(C.sun),x+Math.cos(i*1.6)*.06,.08+i*.05,z+Math.sin(i*1.6)*.06+.05);});};
M.pinata=g=>{ext(g,starShape(.38,.5),.25,toy(C.hot),0,1.1,0,.05);for(let i=0;i<5;i++){const a=Math.PI/2+i*Math.PI*2/5;for(let j=0;j<3;j++)SP(g,.03,fabric([C.sun,C.mint,C.sky][j]),Math.cos(a)*(.4+j*.04),1.1+Math.sin(a)*(.4+j*.04),.1);}CY(g,.004,.004,.6,metalM(),0,1.7,0,4);face(g,0,1.13,.16,1.1);};
M.partydisco=g=>{const tex=document.createElement('canvas');tex.width=tex.height=64;const x=tex.getContext('2d');for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=[C.hot,C.sky,C.sun,C.lilac][(i+j)%4];x.fillRect(i*16+1,j*16+1,14,14);}const t=new THREE.CanvasTexture(tex);t.encoding=THREE.sRGBEncoding;
  const fl=BX(g,1.3,.04,1.3,mat('#ffffff',.3,0,{map:t,emissive:new THREE.Color('#ffffff'),emissiveIntensity:.15,emissiveMap:t}),0,.02,0);fl.castShadow=false;CY(g,.006,.006,.5,metalM(),0,1.9,0,4);add(g,new THREE.IcosahedronGeometry(.25,2),mat('#e3ecf2',.15,.35,{flatShading:true}),0,1.55,0);};
M.partyphotobooth=g=>{RB(g,1.2,1.7,.1,.04,toy(C.hot),0,.85,0);BX(g,.9,1.3,.12,toy('#fff4e6'),0,.8,0);for(let i=0;i<7;i++)SP(g,.08,gloss([C.sun,C.mint,C.sky,C.lilac][i%4]),-.6+i*.2,1.75,.06);ext(g,starShape(.12),.03,metalM(C.gold),0,1.2,.08,.01);};

/* ---------- small treasures ---------- */
M.perfume=g=>{[[-.12,.12,C.pink,.1],[.05,.15,C.lilac,.08],[.18,.1,C.sky,.06]].forEach(([x,h,c,r])=>{SP(g,r,mat(c,.05,0,{transparent:true,opacity:.75}),x,r,0);CY(g,.02,.02,.06,metalM(C.gold),x,r*2+.03,0);SP(g,.03,gloss('#ffffff'),x,r*2+.08,0);});};
M.makeup=g=>{RB(g,.36,.04,.24,.02,gloss(C.pink),0,.02,0);[[-.1,-.04,C.hot],[0,-.04,'#ff9a4d'],[.1,-.04,C.lilac],[-.1,.06,C.sky],[0,.06,C.mint],[.1,.06,C.sun]].forEach(([x,z,c])=>CY(g,.035,.035,.02,toy(c),x,.05,z));CY(g,.03,.03,.16,metalM(C.gold),.25,.08,0);CY(g,.025,.03,.07,gloss(C.hot),.25,.19,0);};
M.jewels=g=>{RB(g,.4,.2,.28,.04,toy(C.lilac),0,.1,0);const lid=RB(g,.4,.06,.28,.03,toy(C.lilac),0,.24,-.14);lid.rotation.x=-.9;lid.position.y=.32;[[-.1,C.hot],[0,C.sky],[.1,C.mint]].forEach(([x,c])=>add(g,new THREE.OctahedronGeometry(.045,0),mat(c,.05,.3),x,.24,0));add(g,new THREE.TorusGeometry(.07,.012,8,20),metalM(C.gold),0,.22,.08).rotation.x=-1;};
M.trophy=g=>{const gd=metalM(C.gold);RB(g,.28,.08,.28,.02,toy('#4a2338'),0,.04,0);CY(g,.03,.05,.18,gd,0,.17,0);add(g,new THREE.SphereGeometry(.17,20,12,0,Math.PI*2,Math.PI/2,Math.PI/2),gd,0,.42,0).material.side=THREE.DoubleSide;[-1,1].forEach(k=>{const h=add(g,new THREE.TorusGeometry(.07,.015,8,16),gd,k*.18,.36,0);});ext(g,starShape(.05),.01,toy('#ffffff'),0,.34,.16,.005);};

/* ---------- garden ---------- */
M.tree=g=>B.tree(g);M.swing=g=>B.horse(g);M.butterfly=g=>B.butterfly(g);M.rainbow=g=>B.rainbow(g);M.pond=g=>B.pond(g);
M.pool=g=>{const r=add(g,new THREE.TorusGeometry(.7,.16,16,40),gloss('#7cc4f2'),0,.16,0);r.rotation.x=Math.PI/2;const r2=add(g,new THREE.TorusGeometry(.7,.16,16,40),gloss('#ffffff'),0,.4,0);r2.rotation.x=Math.PI/2;r2.scale.set(1,1,.9);const w=CY(g,.68,.68,.3,mat('#5ab4e6',.05,.1,{transparent:true,opacity:.85}),0,.18,0,40);w.castShadow=false;
  const duck=new THREE.Group();duck.position.set(.25,.38,.1);g.add(duck);SP(duck,.09,gloss(C.sun),0,0,0,1.2,.8,1);SP(duck,.06,gloss(C.sun),.07,.08,0);CO(duck,.025,.06,gloss('#ff9a4d'),.13,.08,0).rotation.z=-Math.PI/2;};
M.swingrainbow=g=>{const cols=['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2'];cols.forEach((c,i)=>{const t=add(g,new THREE.TorusGeometry(1.0-i*.06,.04,8,40,Math.PI),toy(c),0,0,-.02*i);});[-.35,.35].forEach(x=>{CY(g,.006,.006,.6,mat('#e8d9bf',.9),x-.12,.7,0,4);CY(g,.006,.006,.6,mat('#e8d9bf',.9),x+.12,.7,0,4);RB(g,.32,.04,.2,.02,toy(C.pink),x,.4,0);});};
M.gazebo=g=>{CY(g,1.0,1.0,.1,wood('#f3dcc0'),0,.05,0,8);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;CY(g,.05,.05,1.5,toy('#ffffff'),Math.cos(a)*.85,.85,Math.sin(a)*.85,10);for(let k=0;k<3;k++)SP(g,.07,fabric([C.pink,C.hot,'#ffffff'][k]),Math.cos(a)*.88,.6+k*.3,Math.sin(a)*.88+.05);}CO(g,1.2,.7,toy(C.pink),0,1.95,0);SP(g,.08,metalM(C.gold),0,2.35,0);};
M.hammock=g=>{const w=wood('#a8744a');[-.95,.95].forEach(x=>{CY(g,.05,.06,1.2,w,x,.6,0,10);});const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector3(-.9+t*1.8,.9-Math.sin(t*Math.PI)*.4,0));}
  const tex=document.createElement('canvas');tex.width=64;tex.height=8;const x=tex.getContext('2d');[C.hot,'#ffffff',C.sky,'#ffffff',C.sun,'#ffffff'].forEach((c,i)=>{x.fillStyle=c;x.fillRect(i*11,0,11,8);});const t=new THREE.CanvasTexture(tex);t.encoding=THREE.sRGBEncoding;
  const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.2,8);const hm=add(g,geo,fabric('#ffffff'),0,0,0);hm.material=mat('#ffffff',.95,0,{map:t,side:THREE.DoubleSide});hm.scale.set(1,.5,1.3);};
M.fountain=g=>{CY(g,.7,.75,.25,toy('#e8e0f8'),0,.125,0,32);const w=CY(g,.62,.62,.04,mat('#7cc4f2',.05,.1,{transparent:true,opacity:.85}),0,.23,0,32);w.castShadow=false;CY(g,.1,.14,.55,toy('#e8e0f8'),0,.5,0);CY(g,.35,.3,.1,toy('#e8e0f8'),0,.8,0,24);ext(g,heartShape(.18),.08,toy(C.pink),0,1.05,0,.03);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const d=SP(g,.04,mat('#bfe8ff',.05,0,{transparent:true,opacity:.7}),Math.cos(a)*.36,.55,Math.sin(a)*.36,1,2,1);d.castShadow=false;}};
M.treehouse=g=>{B.tree(g);const h=new THREE.Group();h.position.set(0,1.35,.35);g.add(h);RB(h,.7,.5,.55,.03,wood('#d9a36f'),0,0,0);const sh=new THREE.Shape();sh.moveTo(-.45,0);sh.lineTo(0,.35);sh.lineTo(.45,0);sh.lineTo(-.45,0);ext(h,sh,.6,toy(C.hot),0,.42,0,.02);BX(h,.18,.18,.02,mat('#bfe7ff',.1),.15,.05,.28);RB(h,.16,.28,.02,.01,wood('#8a5a35'),-.15,-.08,.28);
  for(let i=0;i<6;i++)RB(g,.3,.03,.04,.01,wood('#c08a5a'),-.55,.2+i*.2,.6);[-.7,-.4].forEach(x=>CY(g,.012,.012,1.3,mat('#e8d9bf',.9),x,.68,.6,4));};
M.lemonade=g=>{RB(g,1.2,.7,.5,.03,wood('#f6e3b5'),0,.35,0);BX(g,1.25,.05,.55,toy(C.sun),0,.72,0);[-.55,.55].forEach(x=>CY(g,.03,.03,.9,wood('#c08a5a'),x,1.15,.2,8));
  const tex=document.createElement('canvas');tex.width=64;tex.height=8;const x=tex.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffffff':'#ffd25e';x.fillRect(i*8,0,8,8);}const t=new THREE.CanvasTexture(tex);t.encoding=THREE.sRGBEncoding;
  RB(g,1.3,.08,.6,.03,mat('#ffffff',.9,0,{map:t}),0,1.62,.1);CY(g,.1,.1,.25,mat('#fff59a',.05,0,{transparent:true,opacity:.8}),-.25,.88,0,16);[0,.15,.3].forEach(x=>CY(g,.04,.035,.1,mat('#fff59a',.1,0,{transparent:true,opacity:.8}),x,.8,.1,12));SP(g,.08,gloss(C.sun),.4,.82,-.05,1.3,1,1);};
M.slide=g=>{const cols=['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2'];RB(g,.6,.08,.6,.02,toy(C.lilac),-.6,1.2,0);[[-.88,-.28],[-.32,-.28],[-.88,.28],[-.32,.28]].forEach(([x,z])=>CY(g,.04,.04,1.2,toy('#ffffff'),x,.6,z,10));for(let i=0;i<5;i++)RB(g,.05,.05,.5,.02,toy('#ffffff'),-.95,.25+i*.22,0);
  const pts=[];for(let i=0;i<=10;i++){const t=i/10;pts.push(new THREE.Vector3(-.3+t*1.3,1.2-t*1.1+Math.sin(t*Math.PI)*.0,0));}cols.forEach((c,i)=>{const s=add(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.05,8),toy(c),0,.01,-.2+i*.1);});};
M.trampoline=g=>{const r=add(g,new THREE.TorusGeometry(.75,.07,12,40),toy(C.sky),0,.45,0);r.rotation.x=Math.PI/2;CY(g,.7,.7,.02,mat('#2d2a3a',.7),0,.45,0,40);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;CY(g,.03,.03,.45,metalM('#dfe6ea'),Math.cos(a)*.72,.22,Math.sin(a)*.72,8);}SP(g,.08,gloss(C.sun),.1,.75,0);};
M.sandbox=g=>{const w=wood('#d9a36f');[[0,.55,1.2,.08],[0,-.55,1.2,.08]].forEach(([x,z,ww,d])=>RB(g,ww,.2,d,.02,w,x,.1,z));[-.6,.6].forEach(x=>RB(g,.08,.2,1.18,.02,w,x,.1,0));BX(g,1.12,.12,1.02,mat('#f2d79c',1),0,.06,0);
  CY(g,.14,.18,.18,mat('#e9c57f',1),-.2,.21,0,8);CO(g,.1,.15,mat('#e9c57f',1),-.2,.37,0);CY(g,.004,.004,.15,metalM(),-.2,.5,0,4);BX(g,.08,.05,.01,toy(C.hot),-.16,.55,0);CY(g,.1,.07,.12,gloss(C.hot),.25,.18,.2,16);RB(g,.05,.2,.05,.02,gloss(C.sun),.3,.25,-.15);};
M.birdhouse=g=>{CY(g,.04,.05,1.2,wood('#a8744a'),0,.6,0,10);RB(g,.36,.4,.34,.03,toy(C.sky),0,1.38,0);const sh=new THREE.Shape();sh.moveTo(-.26,0);sh.lineTo(0,.22);sh.lineTo(.26,0);sh.lineTo(-.26,0);ext(g,sh,.4,toy(C.hot),0,1.68,0,.02);CY(g,.06,.06,.02,eye(),0,1.42,.18,16).rotation.x=Math.PI/2;
  SP(g,.08,toy(C.sun),.1,1.7+.12,0);SP(g,.05,toy(C.sun),.17,1.86,0);CO(g,.02,.05,toy('#ff9a4d'),.23,1.86,0).rotation.z=-Math.PI/2;SP(g,.012,eye(),.19,1.88,.04);};
M.mushroomring=g=>{for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const m=new THREE.Group();m.position.set(Math.cos(a)*.6,0,Math.sin(a)*.6);m.scale.setScalar(.4+((i*3)%4)*.1);g.add(m);toadstool(m,[C.red,C.pink,'#ff9a4d'][i%3]);}SP(g,.1,glow('#fff3a8',1.2),0,.45,0);};

/* ---------- pets ---------- */
M.cat=g=>B.cat(g);M.puppy=g=>B.dog(g);M.bunny=g=>B.bunny(g);
M.hamster=g=>{SP(g,.22,fabric('#f2b36d'),0,.2,0,1,.85,1.15);SP(g,.12,fabric('#fff1e3'),0,.17,.15,1,.8,.6);[-1,1].forEach(k=>{SP(g,.05,fabric('#f7c7da'),k*.12,.36,.06);SP(g,.025,eye(),k*.07,.26,.22);SP(g,.04,fabric('#fff1e3'),k*.11,.18,.21);});SP(g,.016,gloss(C.hot),0,.22,.25);g.userData.pet=1;};
M.parrot=g=>{CY(g,.03,.03,.9,wood('#a8744a'),0,.45,0);CY(g,.015,.015,.5,wood('#a8744a'),0,.9,0,6).rotation.z=Math.PI/2;const p=new THREE.Group();p.position.y=.92;g.add(p);SP(p,.13,toy('#ef4f5f'),0,.14,0,.9,1.3,.9);SP(p,.1,toy('#ef4f5f'),0,.33,.03);
  [-1,1].forEach(k=>{const w=SP(p,.09,toy(k<0?'#4fb3e8':'#5fc56b'),k*.11,.14,-.02,.4,1.3,.8);SP(p,.02,eye(),k*.05,.36,.1);});CO(p,.035,.08,toy(C.sun),0,.3,.13).rotation.x=Math.PI/2;const t=SP(p,.06,toy('#4fb3e8'),0,-.05,-.12,.5,1.8,.4);t.rotation.x=.5;g.userData.pet=1;};
M.petcorgi=g=>{const f=fabric('#e8954f'),w=fabric('#fff4e6');SP(g,.27,f,0,.24,0,1,.8,1.4);SP(g,.14,w,0,.2,.25,1,.9,.6);SP(g,.2,f,0,.52,.3);SP(g,.1,w,0,.46,.45,1,.75,.9);[-1,1].forEach(k=>{const e=CO(g,.08,.2,f,k*.12,.75,.27);e.rotation.z=-k*.25;SP(g,.028,eye(),k*.07,.57,.46);SP(g,.06,f,k*.15,.06,.2,1,.8,1.2);SP(g,.06,f,k*.15,.06,-.25,1,.8,1.2);});SP(g,.035,eye(),0,.5,.54);g.userData.pet=1;};
M.petpoodle=g=>{const f=fabric('#fbe3ec');SP(g,.22,f,0,.38,0,1,.9,1.2);SP(g,.18,f,0,.7,.22);SP(g,.12,f,0,.86,.2);[-1,1].forEach(k=>{SP(g,.1,f,k*.18,.66,.2,.7,1.3,.8);SP(g,.025,eye(),k*.06,.72,.37);[.2,-.2].forEach(z=>{CY(g,.04,.04,.22,f,k*.1,.13,z,8);SP(g,.07,f,k*.1,.04,z);});});const t=SP(g,.08,f,0,.55,-.3);SP(g,.03,eye(),0,.65,.4);BX(g,.12,.03,.03,toy(C.hot),0,.9,.27);g.userData.pet=1;};
M.petkitten=g=>{const f=fabric('#cfc6d8');const body=SP(g,.25,f,0,.16,0,1.1,.6,1);SP(g,.16,f,.18,.22,.15);[-1,1].forEach(k=>{CO(g,.05,.1,f,.18+k*.08,.36,.15);});const t=add(g,new THREE.TorusGeometry(.2,.04,8,20,Math.PI*1.3),f,0,.08,0);t.rotation.x=Math.PI/2;[-1,1].forEach(k=>{const e=add(g,new THREE.TorusGeometry(.022,.007,6,10,Math.PI),eye(),.18+k*.06,.24,.3);});CY(g,.36,.4,.08,fabric(C.pink),0,.03,0,32);g.userData.pet=1;};
M.petbunny=g=>{const f=fabric('#e9d3bd');SP(g,.25,f,0,.25,0,1,.9,1.1);SP(g,.17,f,0,.55,.15);[-1,1].forEach(k=>{const e=SP(g,.07,f,k*.16,.45,.12,.7,2.2,.6);e.rotation.z=k*.35;SP(g,.025,eye(),k*.06,.6,.29);});SP(g,.025,gloss(C.hot),0,.55,.32);SP(g,.08,fabric('#ffffff'),0,.25,-.28);g.userData.pet=1;};
M.petparrot=M.parrot;M.pethamster=M.hamster;
M.petduck=g=>{SP(g,.24,gloss(C.sun),0,.2,0,1.2,.8,1);SP(g,.16,gloss(C.sun),.15,.45,0);const b=CO(g,.06,.13,gloss('#ff9a4d'),.33,.43,0);b.rotation.z=-Math.PI/2;[-1,1].forEach(k=>SP(g,.025,eye(),.24,.5,k*.08));const t=SP(g,.08,gloss(C.sun),-.27,.3,0,1,.6,1);g.userData.pet=1;};
M.petfish=g=>B.fish(g);
M.petbedpink=g=>{const r=add(g,new THREE.TorusGeometry(.38,.13,14,32),fabric(C.pink),0,.13,0);r.rotation.x=Math.PI/2;CY(g,.36,.36,.08,fabric('#fff4e6'),0,.06,0,32);};
M.petbedblue=g=>{puff(g,0,.15,0,1.5,'#e3f1ff');CY(g,.32,.32,.1,fabric('#c9e4ff'),0,.08,.12,32);};
M.petbed=g=>{const b=add(g,new THREE.SphereGeometry(.45,24,16,0,Math.PI*2,Math.PI*.45,Math.PI*.55),fabric(C.red),0,.42,0);b.material=mat(C.red,.9,0,{side:THREE.DoubleSide});CY(g,.36,.36,.06,fabric('#fff4e6'),0,.1,0,32);for(let i=0;i<10;i++){const a=i*2.1;SP(g,.025,toy(C.sun),Math.cos(a)*.43,.12+(i%3)*.08,Math.sin(a)*.43,1,1.5,1);}for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const l=SP(g,.12,toy(C.green),Math.cos(a)*.36,.36,Math.sin(a)*.36,1.2,.3,.6);l.rotation.y=-a;}};
M.petbowl=g=>{[-.15,.15].forEach((x,i)=>{CY(g,.13,.16,.1,gloss(i?C.sky:C.pink),x,.05,0,24);CY(g,.11,.11,.02,mat(i?'#7cc4f2':'#c98b5e',i?.05:.9,0,i?{transparent:true,opacity:.8}:undefined),x,.09,0,24);});};
M.petcastle=g=>{RB(g,.9,.5,.6,.04,fabric('#f3e6ff'),0,.25,0);[-1,1].forEach(k=>{CY(g,.14,.14,.75,fabric('#f3e6ff'),k*.42,.38,.25);CO(g,.18,.3,toy(C.hot),k*.42,.9,.25);});const d=new THREE.Shape();d.moveTo(-.16,0);d.lineTo(-.16,.14);d.absarc(0,.14,.16,Math.PI,0,true);d.lineTo(.16,0);d.lineTo(-.16,0);ext(g,d,.02,mat('#4a2338',.9),0,.17,.31,.01);ext(g,starShape(.07),.02,metalM(C.gold),0,.58,.31,.01);};
M.pettower=g=>{const rope=mat('#d9c39a',.95);[[0,.0],[.2,.6],[-.15,1.1]].forEach(([x,y],i)=>{CY(g,.07,.07,.5,rope,x*.5,y+.3,0,12);RB(g,.55,.07,.45,.03,fabric([C.pink,C.lilac,C.mint][i]),x,y+.58,0);});RB(g,.7,.06,.6,.03,fabric(C.pink),0,.03,0);SP(g,.06,fabric(C.hot),.2,1.35,0);CY(g,.004,.004,.15,metalM(),.2,1.48,0,4);};
M.pettoy=g=>{CY(g,.28,.22,.24,mat('#d9b07a',.95),0,.12,0,20);[[-.08,.3,C.hot],[.1,.32,C.sky],[0,.36,C.sun]].forEach(([x,y,c])=>SP(g,.09,fabric(c),x,y,0));SP(g,.06,gloss(C.mint),.2,.3,.1);};

/* ---------- living room extras ---------- */
M.fireplace=g=>{const brick=mat('#f2b5a5',.9);RB(g,1.3,1.1,.4,.04,brick,0,.55,0);BX(g,.7,.6,.42,mat('#3a2a2e',.9),0,.38,.0);BX(g,1.45,.08,.5,toy('#fff4e6'),0,1.12,0);
  [[-.12,0,'#ff9a4d',.12],[.1,0,C.sun,.1],[0,.05,'#ef4f5f',.14]].forEach(([x,z,c,r])=>{CO(g,r,r*2.8,glow(c,1.4),x,.32,z+.12);});[-.15,.15].forEach(x=>{const l=CY(g,.05,.05,.4,wood('#8a5a35'),x,.12,.12,8);l.rotation.z=Math.PI/2;l.rotation.y=x*2;});const L=new THREE.PointLight(0xff9a4d,.7,3,2);L.position.set(0,.5,.4);g.add(L);
  CY(g,.07,.07,.2,gloss(C.mint),-.45,1.26,0,12);SP(g,.09,toy(C.pink),.45,1.25,0);};
M.tvcabinet=g=>{RB(g,1.3,.45,.45,.04,toy('#9fd4c6'),0,.25,0);legs4(g,1.2,.4,.08,wood('#c08a5a'),.05,.025);[-.32,.32].forEach(x=>{RB(g,.55,.33,.03,.02,toy('#b8e3d8'),x,.27,.23);SP(g,.025,metalM(C.gold),x*.2,.27,.26);});
  RB(g,.95,.6,.08,.04,gloss('#3a3438'),0,.82,-.05);const sc=document.createElement('canvas');sc.width=96;sc.height=60;const x=sc.getContext('2d');const gr=x.createLinearGradient(0,0,96,60);gr.addColorStop(0,'#7cc4f2');gr.addColorStop(1,'#c8a2ff');x.fillStyle=gr;x.fillRect(0,0,96,60);x.fillStyle='#ffd25e';x.beginPath();x.arc(48,30,14,0,7);x.fill();x.fillStyle='#4a2338';x.fillRect(42,26,3,3);x.fillRect(51,26,3,3);
  const t=new THREE.CanvasTexture(sc);t.encoding=THREE.sRGBEncoding;add(g,new THREE.PlaneGeometry(.85,.5),new THREE.MeshBasicMaterial({map:t}),0,.82,-.005).castShadow=false;};
M.fishtank=g=>{RB(g,1.0,.45,.45,.03,wood('#c08a5a'),0,.22,0);const tank=RB(g,.95,.55,.42,.02,mat('#bfe8ff',.05,0,{transparent:true,opacity:.42}),0,.73,0);tank.castShadow=false;BX(g,.9,.06,.38,mat('#f3e3b8',.9),0,.49,0);
  [[-.2,.75,'#ff8a3d'],[.2,.85,'#ffd25e'],[.05,.65,C.lilac]].forEach(([x,y,c])=>{SP(g,.06,gloss(c),x,y,0,1.6,1,.6);});[[-.35,C.green],[.33,'#4f9e5b']].forEach(([x,c])=>{for(let i=0;i<3;i++)CY(g,.015,.02,.3-i*.06,toy(c),x+i*.04,.65,-.05,6);});[0,.1,.2].forEach((y,i)=>SP(g,.02,mat('#ffffff',.1,0,{transparent:true,opacity:.7}),.15,.7+y,.05));};

/* ---------- 3D shop thumbnails ---------- */
const stc=document.createElement('style');stc.textContent=`.rk3-art{display:contents}.rk3-thumb{width:100%;height:100%;object-fit:contain;display:block;animation:rk3pop .4s cubic-bezier(.3,1.6,.5,1)}
.shop-item .pic .rk3-thumb,.interior-product .rk3-thumb{transition:transform .2s}.shop-item:hover .pic .rk3-thumb{transform:translateY(-5px) rotate(-3deg) scale(1.04)}
@keyframes rk3pop{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}@media (prefers-reduced-motion:reduce){.rk3-thumb{animation:none}}`;document.head.appendChild(stc);
const thumbs={},queued=new Set(),queue=[];let TR=null,running=false,threeFailed=false;
function thumbRig(){
  if(TR)return TR;const cv=document.createElement('canvas');cv.width=cv.height=320;
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});R.setPixelRatio(1);R.setSize(320,320,false);R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.12;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.setClearColor(0x000000,0);
  const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xffffff,0xffd9e4,.75));
  const key=new THREE.DirectionalLight(0xfff3e6,1.15);key.position.set(3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=6;key.shadow.bias=-.0008;key.shadow.normalBias=.02;const c=key.shadow.camera;c.left=-3;c.right=3;c.top=3;c.bottom=-3;c.far=20;s.add(key);
  const rim=new THREE.DirectionalLight(0xffc4dd,.55);rim.position.set(-4,3,-4);s.add(rim);const fill=new THREE.DirectionalLight(0xdfeaff,.3);fill.position.set(-4,2,4);s.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({opacity:.22}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;s.add(ground);
  const cam=new THREE.PerspectiveCamera(26,1,.05,60);TR={R,s,cam,ground,key};return TR;
}
function renderThumb(id){
  const it=(G('ITEMS')||[]).find(x=>x[0]===id);if(!it)return null;const {R,s,cam,ground,key}=thumbRig();
  const g=K.makeItem(it);g.traverse(o=>{if(o.isMesh){o.castShadow=true;}if(o.isLight&&!o.isDirectionalLight)o.intensity*=.6;});s.add(g);
  const wall=g.userData.onWall;g.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g),size=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3());
  g.position.x-=ctr.x;g.position.z-=ctr.z;g.position.y-=box.min.y;ground.visible=!wall;
  const r=Math.max(size.x,size.y,size.z)*.62+.05,fov=cam.fov*Math.PI/180,d=r/Math.sin(fov/2)*1.02;const az=wall?.25:.62,el=wall?.12:.36,ty=size.y/2;
  cam.position.set(Math.sin(az)*Math.cos(el)*d,ty+Math.sin(el)*d,Math.cos(az)*Math.cos(el)*d);cam.lookAt(0,ty*.95,0);cam.updateProjectionMatrix();
  key.target.position.set(0,0,0);R.render(s,cam);const url=R.domElement.toDataURL('image/png');s.remove(g);
  g.traverse(o=>{if(o.geometry&&!o.geometry.parameters)o.geometry.dispose&&0;});return url;
}
function swapIn(id){const url=thumbs[id];document.querySelectorAll(`.rk3-art[data-rk3-id="${CSS.escape(id)}"]`).forEach(el=>{el.innerHTML=`<img class="furniture-svg rk3-thumb" alt="" src="${url}">`;el.classList.remove('rk3-art');el.classList.add('rk3-done');});}
function pump(){
  if(!queue.length){running=false;return;}running=true;const t0=performance.now();
  while(queue.length&&performance.now()-t0<24){const id=queue.shift();try{const u=renderThumb(id);if(u){thumbs[id]=u;swapIn(id);}}catch(e){console.warn('thumb',id,e);}}
  requestAnimationFrame(pump);
}
function want(id){if(thumbs[id]||queued.has(id)||threeFailed)return;queued.add(id);queue.push(id);
  K.loadThree(()=>{if(!running)requestAnimationFrame(pump);},()=>{threeFailed=true;});}
function wrap(name,idOf){const prev=G(name);if(typeof prev!=='function')return;
  window['__rk3_'+name]=function(){let html='';const a=arguments;try{html=prev.apply(this,a);}catch(e){const it=(G('ITEMS')||[]).find(x=>x[0]===idOf(a));html=`<span class="art-emoji">${it?it[1]:'✨'}</span>`;}
    const id=idOf(a);if(!id||!M[id]||threeFailed)return html;if(typeof html==='string'&&html.indexOf('data-rk3-id="'+id+'"')>=0)return html;
    if(thumbs[id])return `<img class="furniture-svg rk3-thumb" alt="" src="${thumbs[id]}">`;want(id);return `<span class="rk3-art" data-rk3-id="${id}">${html}</span>`;};
  SET(`${name}=window.__rk3_${name};`);}
wrap('furnitureArt',a=>a[0]&&a[0][0]);wrap('dreamFurnitureArt',a=>a[0]&&a[0][0]);wrap('miniArt',a=>a[0]);wrap('petArt',a=>a[0]);
/* catch any art that rendered before the wrap (e.g. a shop already on screen) */
try{const gm=G('game');if(gm==='house'){const hr=G('houseRender');hr&&hr();}}catch(_){}
window.RK3.thumb=renderThumb;
})();
