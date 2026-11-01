
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
const CLAY=[
 ['claylamp','💡','Soft clay lamp',22,'any','Decor'],
 ['clayvase','🏺','Rounded clay vase',16,'any','Decor'],
 ['claybowl','🥣','Pastel clay bowl',12,'kitchen','Treats'],
 ['clayplant','🌱','Soft plant pot',18,'any','Decor'],
 ['claymirror','🪞','Rounded clay mirror',28,'bedroom','Decor'],
 ['claytray','🍽️','Soft clay tray',14,'kitchen','Decor'],
 ['clayfridge','🧊','Pink clay fridge',48,'kitchen','Fridges'],
 ['claystove','🔥','Soft clay stove',42,'kitchen','Appliances'],
 ['clayrug','🧶','Fluffy clay rug',24,'any','Rugs'],
 ['claylight','💡','Heart clay light',20,'any','Lighting'],
 ['clayplush','🧸','Soft clay plush',18,'bedroom','Plushies'],
 ['clayjar','🫙','Heart clay jar',14,'kitchen','Kitchen miniatures'],
 ['claycup','☕','Pastel clay cup',10,'kitchen','Tableware'],
 ['clayplate','🍽️','Clay plate set',12,'kitchen','Tableware'],
 ['claysoap','🧼','Heart clay soap',8,'bathroom','Bath accessories'],
 ['claytowel','🧺','Soft clay towels',14,'bathroom','Bath accessories'],
 ['claygift','🎁','Soft clay gift box',16,'any','Gifts & hats'],
 ['clayhat','🎩','Clay party hat',12,'any','Gifts & hats'],
 ['clayjewelry','💍','Clay jewelry box',22,'bedroom','Beauty & jewelry'],
 ['claybrush','🖌️','Soft clay brush set',14,'bedroom','Beauty & jewelry'],
 ['claycake','🎂','Clay birthday cake',28,'any','Cakes & treats'],
 ['claycupcake','🧁','Clay cupcake tower',18,'kitchen','Cakes & treats'],
 ['claytub','🛁','Soft clay tub',52,'bathroom','Bath fixtures'],
 ['claysink','🚰','Clay bathroom sink',32,'bathroom','Bath fixtures'],
 ['claybooks','📚','Soft clay books',14,'any','Books & toys'],
];
const ITEMS=G('ITEMS');if(Array.isArray(ITEMS))[...NEW,...CLAY].forEach(it=>{if(!ITEMS.some(x=>x[0]===it[0]))ITEMS.push(it);});

/* ---------- cute helpers ---------- */
const C={pink:'#f7a0bd',hot:'#e2457a',mint:'#8ed6c4',sky:'#8fc6e8',lilac:'#c8a2ff',sun:'#ffd25e',cream:'#fff4e6',white:'#fdfbfb',peach:'#ffb48a',gold:'#f2c94c',choc:'#8a5a35',red:'#ef5a6f',green:'#5fb06a',navy:'#4b4a8f'};
const toy=c=>mat(c,.84);
function face(g,x,y,z,s=1){[-1,1].forEach(k=>{SP(g,.034*s,eye(),x+k*.075*s,y,z);SP(g,.011*s,mat('#ffffff',.1),x+k*.075*s+.012*s,y+.014*s,z+.028*s);SP(g,.03*s,mat('#ff9fb8',.9),x+k*.12*s,y-.045*s,z-.006*s,1,.6,.4);});
  const m=add(g,new THREE.TorusGeometry(.04*s,.011*s,8,16,Math.PI),eye(),x,y-.045*s,z+.004);m.rotation.z=Math.PI;}
function heartShape(r){const s=new THREE.Shape();s.moveTo(0,-r);s.bezierCurveTo(-r*1.1,-r*.2,-r*1.1,r*.85,0,r*.35);s.bezierCurveTo(r*1.1,r*.85,r*1.1,-r*.2,0,-r);return s;}
function starShape(r,ir=.45){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,rr=i%2?r*ir:r;i?s.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):s.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}return s;}
function moonShape(r){const s=new THREE.Shape();s.absarc(0,0,r,Math.PI*.15,Math.PI*1.85,false);s.absarc(r*.45,0,r*.78,Math.PI*1.75,Math.PI*.25,true);return s;}
function ext(g,shape,depth,m,x,y,z,bev=.03){const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:3,curveSegments:16});geo.center();return add(g,geo,m,x,y,z);}
const puff=(g,x,y,z,s,c)=>[[0,0,0,1],[-.6,-.15,0,.75],[.6,-.15,0,.75],[-.3,.3,0,.7],[.3,.3,0,.7]].forEach(([a,b,cz,k])=>SP(g,.2*s*k,fabric(c||C.white),x+a*.22*s,y+b*.22*s,z+cz));
function balloon(g,x,y,z,c,s=1){SP(g,.13*s,gloss(c),x,y,z,1,1.18,1);CO(g,.025*s,.04*s,gloss(c),x,y-.16*s,z).rotation.x=Math.PI;CY(g,.004,.004,y-.05,mat('#ffffff',.6),x,(y-.16*s)/2,z,4);}
function books(g,x,y,z,w,cols){const placeholder=new THREE.Group();placeholder.userData.stockBooks=true;g.add(placeholder);g=placeholder;let px=x-w/2,i=0;while(px<x+w/2-.05){const bw=.05+((i*37)%5)/100,bh=.2+((i*53)%9)/60;BX(g,bw,bh,.18,mat(cols[i%cols.length],.6),px+bw/2,y+bh/2,z);px+=bw+.006;i++;}}
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
/* ---------- Lighting fixtures (Claude, Oct 31) ---------- */
const glass=c=>mat(c,.05,.1,{transparent:true,opacity:.72});
const pl=(g,c,i,y,d=2.4)=>{const L=new THREE.PointLight(c,i,d,2);L.position.y=y;g.add(L);};
const cord=(g,top,bot,c=C.gold)=>CY(g,.01,.01,top-bot,metalM(c),0,(top+bot)/2,0,6);
M.crystalchandelier=g=>{cord(g,2.15,1.5);const r=add(g,new THREE.TorusGeometry(.38,.03,10,40),metalM(C.gold),0,1.38,0);r.rotation.x=Math.PI/2;CY(g,.06,.12,.22,metalM(C.gold),0,1.48,0,20);
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2,x=Math.cos(a)*.38,z=Math.sin(a)*.38;CY(g,.035,.04,.03,metalM(C.gold),x,1.4,z,12);CY(g,.025,.025,.14,mat('#fffaf3',.5),x,1.48,z,10);SP(g,.035,glow('#ff9d1f',1),x,1.58,z,1,1.4,1);SP(g,.03,glass('#e9f6ff'),x,1.26,z,1,1.6,1);}
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;SP(g,.022,glass('#f3e8ff'),Math.cos(a)*.24,1.2-(i%2)*.06,Math.sin(a)*.24,1,1.5,1);}SP(g,.07,glass('#ffe6f2'),0,1.12,0,1,1.5,1);pl(g,0xffe2b0,.6,1.45);};
M.rosependant=g=>{cord(g,2.15,1.5);const sh=add(g,new THREE.SphereGeometry(.3,28,14,0,Math.PI*2,0,Math.PI/2),mat('#f06f9f',.45,0,{side:THREE.DoubleSide}),0,1.25,0);
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;SP(g,.07,mat('#e8558c',.5),Math.cos(a)*.28,1.25,Math.sin(a)*.28,1,.6,1);}CY(g,.05,.05,.08,metalM(C.gold),0,1.52,0,14);SP(g,.09,glow('#ffb84d',1.1),0,1.2,0);pl(g,0xffd6e2,.55,1.15);};
M.cloudceiling=g=>{cord(g,2.15,1.62,'#ffffff');[[0,0,.26],[.24,-.03,.2],[-.24,-.03,.2],[.1,.12,.18],[-.12,.1,.17]].forEach(([x,y,r])=>SP(g,r,glow('#dff1ff',.45),x,1.45+y,0,1,.85,.85));
 [[-.2,1.08,'#a9e4ff'],[.05,1.0,'#c8a2ff'],[.22,1.1,'#ffd27a']].forEach(([x,y,c])=>{CY(g,.004,.004,1.35-y,mat('#ffffff',.6),x,(1.35+y)/2,0,4);ext(g,starShape(.06),.02,glow(c,1.6),x,y,0,.006);});pl(g,0xeaf6ff,.55,1.4);};
M.paperlanterns=g=>{const pts=[];for(let i=0;i<=20;i++){const t=i/20;pts.push(new THREE.Vector3(-.9+t*1.8,1.65-Math.sin(t*Math.PI)*.3,0));}const cv=new THREE.CatmullRomCurve3(pts);add(g,new THREE.TubeGeometry(cv,40,.006,4),mat('#b89a7a',.6),0,0,0);
 [.15,.32,.5,.68,.85].forEach((t,i)=>{const p=cv.getPoint(t);const col=['#ff5c9a','#ffb020','#38b6ff','#a46bff','#3fcf6a'][i];SP(g,.1,glow(col,.55),p.x,p.y-.14,p.z,1,.85,1);CY(g,.05,.05,.03,mat('#7a5a3a',.6),p.x,p.y-.04,p.z,10);CY(g,.004,.004,.04,mat('#7a5a3a',.6),p.x,p.y-.02,p.z,4);});[-.9,.9].forEach(x=>RB(g,.05,1.65,.05,.02,wood('#c08a5a'),x,.82,0));};
M.starsconce=g=>{RB(g,.16,.26,.04,.02,metalM(C.gold),0,0,0);CY(g,.015,.015,.16,metalM(C.gold),0,0,.09,8).rotation.x=Math.PI/2;ext(g,starShape(.16),.06,glow('#ffbf1f',.75),0,.02,.17,.02);pl(g,0xffe08a,.35,.05,1.8);};M.starsconce.wall=1;
M.heartsconce=g=>{RB(g,.16,.26,.04,.02,metalM(C.gold),0,0,0);CY(g,.015,.015,.14,metalM(C.gold),0,0,.08,8).rotation.x=Math.PI/2;ext(g,heartShape(.15),.06,glow('#ff5c9a',.7),0,.02,.15,.02);pl(g,0xffa3c2,.35,.05,1.8);};M.heartsconce.wall=1;
M.neonrainbow=g=>{RB(g,.95,.55,.03,.02,mat('#3b2a4a',.6),0,0,0);['#ff2f6d','#ff8a00','#ffd000','#22c55e','#2f9bff'].forEach((c,i)=>{const t=add(g,new THREE.TorusGeometry(.4-i*.065,.022,8,36,Math.PI),glow(c,1.1),0,-.18,.03);});[-.36,.36].forEach(x=>SP(g,.06,glow('#ffffff',1.4),x,-.2,.04,1.4,.8,.6));pl(g,0xffc2e0,.35,0,1.8);};M.neonrainbow.wall=1;
M.tulipfloorlamp=g=>{CY(g,.2,.22,.05,metalM(C.gold),0,.025,0,28);CY(g,.022,.022,1.2,mat('#7fbf7a',.5),0,.65,0,10);[-1,1].forEach(k=>{SP(g,.09,mat('#7fbf7a',.6),k*.09,.55,0,1.6,.35,.6).rotation.z=k*.6;});
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const p=SP(g,.13,mat('#f06f9f',.45,0,{side:THREE.DoubleSide}),Math.cos(a)*.07,1.35,Math.sin(a)*.07,.7,1.25,.7);p.rotation.set(Math.sin(a)*.35,0,-Math.cos(a)*.35);}SP(g,.07,glow('#ffb84d',1.1),0,1.33,0);pl(g,0xffd6e2,.5,1.35);};
M.bowdesklamp=g=>{CY(g,.13,.15,.04,toy('#fff1f6'),0,.02,0,24);const a1=CY(g,.018,.018,.32,metalM(C.gold),.04,.2,0,8);a1.rotation.z=-.25;const a2=CY(g,.018,.018,.26,metalM(C.gold),.02,.44,0,8);a2.rotation.z=.6;
 const sh=CO(g,.13,.16,mat('#f06f9f',.45),-.08,.52,0);sh.rotation.z=.5;SP(g,.04,glow('#ffb84d',1.1),-.1,.47,0);[-1,1].forEach(k=>{const b=SP(g,.045,toy('#e2457a'),.08+k*.05,.05,.12,1.3,.8,.4);b.rotation.z=k*.4;});SP(g,.022,toy('#e2457a'),.08,.05,.13);pl(g,0xffe2b8,.3,.45,1.5);};
M.lavalamp=g=>{CO(g,.11,.14,metalM('#c8a2ff'),0,.07,0);CY(g,.08,.11,.42,glass('#ffb3e0'),0,.35,0,24);[[.0,.24,.05],[.02,.38,.04],[-.02,.5,.035],[.01,.31,.03]].forEach(([x,y,r],i)=>SP(g,r,glow(i%2?'#ff2f86':'#8a3dff',.9),x,y,0,1,1.25,1));CO(g,.08,.08,metalM('#c8a2ff'),0,.6,0).rotation.x=Math.PI;pl(g,0xff9fd0,.35,.35,1.6);};
M.picture=g=>{RB(g,.7,.55,.04,.015,metalM(C.gold),0,0,0);const c=document.createElement('canvas');c.width=128;c.height=100;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,0,100);gr.addColorStop(0,'#8fd0f5');gr.addColorStop(1,'#d8f0ff');x.fillStyle=gr;x.fillRect(0,0,128,100);x.fillStyle='#7cc46f';x.beginPath();x.ellipse(40,100,70,34,0,0,7);x.fill();x.fillStyle='#5fb06a';x.beginPath();x.ellipse(100,100,60,26,0,0,7);x.fill();x.fillStyle='#ffd25e';x.beginPath();x.arc(98,26,12,0,7);x.fill();x.fillStyle='#e2457a';[30,46,60].forEach(px=>{x.beginPath();x.arc(px,78,4,0,7);x.fill();});
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;add(g,new THREE.PlaneGeometry(.6,.46),mat('#ffffff',.7,0,{map:t}),0,0,.025).castShadow=false;};M.picture.wall=1;
M.clock=g=>{CY(g,.3,.3,.08,toy(C.pink),0,0,0,32).rotation.x=Math.PI/2;CY(g,.25,.25,.02,mat('#fffaf3',.4),0,0,.04,32).rotation.x=Math.PI/2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;SP(g,.015,eye(),Math.cos(a)*.2,Math.sin(a)*.2,.055);}
  const h=BX(g,.025,.13,.01,eye(),0,.05,.06);const m=BX(g,.02,.18,.01,eye(),.06,.02,.065);m.rotation.z=-1.1;[-1,1].forEach(k=>SP(g,.07,metalM(C.gold),k*.2,.3,0));};M.clock.wall=1;
M.grandclock=g=>{RB(g,.55,1.9,.38,.04,wood('#8a5a35'),0,.95,0);CY(g,.2,.2,.04,mat('#fffaf3',.4),0,1.55,.2,32).rotation.x=Math.PI/2;BX(g,.02,.12,.01,eye(),0,1.58,.23);BX(g,.3,.55,.01,mat('#dff3ff',.05,0,{transparent:true,opacity:.5}),0,.85,.2);CY(g,.006,.006,.4,metalM(C.gold),0,.92,.15,4);CY(g,.07,.07,.02,metalM(C.gold),0,.7,.15,20).rotation.x=Math.PI/2;CO(g,.3,.25,wood('#8a5a35'),0,2.02,0);};
M.star=g=>{ext(g,starShape(.3),.1,gloss(C.sun),0,.62,0,.04);CY(g,.03,.03,.3,metalM(),0,.18,0);CY(g,.14,.16,.05,toy(C.lilac),0,.03,0);face(g,0,.64,.1,.9);};
M.seastar=g=>{const s=ext(g,starShape(.36,.5),.1,toy('#ff9a7a'),0,.07,0,.05);s.rotation.x=-Math.PI/2;for(let i=0;i<15;i++){const a=Math.random()*Math.PI*2,r=.05+Math.random()*.25;SP(g,.015,toy('#ffd2c2'),Math.cos(a)*r,.15,Math.sin(a)*r);}face(g,0,.16,.06,1.2);};
M.bow=g=>{[-1,1].forEach(k=>{const b=SP(g,.2,toy(C.hot),k*.19,.5,0,1.3,.85,.45);b.rotation.z=k*.45;const t=SP(g,.07,toy(C.hot),k*.1,.28,0,.6,1.7,.3);t.rotation.z=k*.35;});SP(g,.08,toy('#c9356a'),0,.5,.02);CY(g,.03,.03,.3,metalM(),0,.15,0);CY(g,.14,.16,.04,toy(C.pink),0,.02,0);};
M.crystal=g=>{SP(g,.25,clay('#c9b8ff'),0,.5,0,1,1.2,1);SP(g,.15,clay('#ffc4e1'),-.15,.3,0);SP(g,.12,clay('#ffc4e1'),.12,.35,0);CY(g,.2,.2,.04,clay('#e8e0f8'),0,.04,0);};
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
M.fridgeretro=g=>B.fridge(g,'#9fe0cf');
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
M.tree=g=>B.tree(g);M.butterfly=g=>B.butterfly(g);M.rainbow=g=>B.rainbow(g);M.pond=g=>B.pond(g);
M.swing=g=>{const timber=wood('#d9b18e'),pink=mat('#f7a0bd',.88),rope=mat('#e6d2b5',.9),skin=mat('#e8be9d',.88),hair=mat('#a97658',.88),dress=mat('#f7a0bd',.88);
  // A-frame legs
  for(const x of [-.85,.85]){
    for(const z of [-.36,.36]){
      const leg=CY(g,.06,.06,1.5,timber,x,.75,z,12);
      leg.rotation.x=z>0?-.16:.16;
    }
  }
  // Top beam
  const beam=CY(g,.075,.075,2.0,timber,0,1.48,0,14);beam.rotation.z=Math.PI/2;
  // Seat pivots so they can swing
  const seats=[];
  for(const x of [-.42,.42]){
    const pivot=new THREE.Group();pivot.position.set(x,1.45,0);g.add(pivot);
    for(const dx of [-.16,.16]){
      CY(pivot,.014,.014,.88,rope,dx,-.44,0,10);
      SP(pivot,.04,metalM('#e4b7ca'),dx,.02,0);
    }
    RB(pivot,.46,.07,.3,.04,pink,0,-.88,0);
    seats.push(pivot);
  }
  // Seated clay doll on the left seat (rides with the pivot)
  const doll=new THREE.Group();doll.position.set(0,-.68,0);seats[0].add(doll);
  // Dress / body
  SP(doll,.17,dress,0,.2,0,1.05,.9,1);
  // Head
  SP(doll,.14,skin,0,.46,0);
  SP(doll,.145,hair,0,.52,-.02,1,.55,1);
  // Arms resting forward
  [-1,1].forEach(k=>{
    const arm=CY(doll,.028,.028,.22,skin,k*.16,.22,.04,8);
    arm.rotation.z=k*.55;arm.rotation.x=.3;
  });
  // Bent sitting legs
  [-1,1].forEach(k=>{
    const thigh=CY(doll,.032,.032,.16,skin,k*.07,.04,.08,8);
    thigh.rotation.x=.85;
    const shin=CY(doll,.028,.028,.14,skin,k*.07,-.06,.16,8);
    shin.rotation.x=-.4;
  });
  // Face
  SP(doll,.014,eye(),-.045,.48,.11);
  SP(doll,.014,eye(),.045,.48,.11);
  const smile=add(doll,new THREE.TorusGeometry(.03,.006,6,10,Math.PI),eye(),0,.44,.12);
  smile.rotation.x=Math.PI;
  g.userData.swingSeats=seats;
  g.userData.swingPhase=Math.random()*6;
};
M.pool=g=>{CY(g,.6,.6,.15,clay('#7cc4f2'),0,.1,0,32);CY(g,.55,.55,.12,clay('#5ab4e6'),0,.16,0,32);CY(g,.5,.5,.08,clay('#ffffff'),0,.2,0,32);
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
  const s=new THREE.Scene();s.add(new THREE.HemisphereLight(0xfffaf3,0xe7c9bc,.95));
  const key=new THREE.DirectionalLight(0xfff3e6,1.15);key.position.set(3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=6;key.shadow.bias=-.0008;key.shadow.normalBias=.02;const c=key.shadow.camera;c.left=-3;c.right=3;c.top=3;c.bottom=-3;c.far=20;s.add(key);
  const rim=new THREE.DirectionalLight(0xffeadc,.4);rim.position.set(-4,3,-4);s.add(rim);const fill=new THREE.DirectionalLight(0xe5f4ed,.45);fill.position.set(-4,2,4);s.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({opacity:.16}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;s.add(ground);
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
Object.assign(window.RK3,{face,heartShape,starShape,moonShape,ext,puff,balloon,books,cushion,toy,glow,toadstool,C});

/* clay style extras */
M.claylamp=g=>{CY(g,.12,.16,.4,toy(C.peach),0,.2,0);SP(g,.18,toy(C.cream),0,.55,0);CY(g,.04,.04,.15,metalM(C.gold),0,.08,0);};
M.clayvase=g=>{CY(g,.18,.14,.35,toy(C.pink),0,.25,0);CY(g,.12,.16,.08,toy(C.cream),0,.45,0);};
M.claybowl=g=>{CY(g,.22,.18,.12,toy(C.sky),0,.08,0);SP(g,.04,toy(C.sun),.08,.16,0);SP(g,.03,toy(C.red),-.06,.15,.04);};
M.clayplant=g=>{CY(g,.14,.16,.2,toy(C.peach),0,.1,0);SP(g,.12,toy(C.green),0,.35,0);SP(g,.08,toy(C.green),.1,.42,.05);SP(g,.07,toy(C.green),-.08,.4,-.03);};
M.claymirror=g=>{SP(g,.28,metalM(C.gold),0,.7,-.1,1,1.2,.12);SP(g,.24,mat('#e8f4ff',.1),0,.7,-.08,1,1.2,.05);CY(g,.04,.04,.4,toy(C.cream),0,.35,0);};
M.claytray=g=>{CY(g,.25,.22,.06,toy(C.cream),0,.04,0);SP(g,.03,toy(C.pink),.08,.08,0);};
M.clayfridge=g=>{RB(g,.6,.9,.5,.08,toy(C.pink),0,.45,0);RB(g,.55,.4,.48,.06,toy(C.cream),0,.7,-.02);SP(g,.04,metalM(C.gold),0,.55,-.2);};
M.claystove=g=>{RB(g,.7,.5,.5,.06,toy(C.cream),0,.25,0);CY(g,.12,.12,.04,metalM('#555'),-.15,.52,-.1);CY(g,.12,.12,.04,metalM('#555'),.15,.52,-.1);RB(g,.5,.08,.4,.04,toy(C.pink),0,.15,0);};
M.clayrug=g=>{CY(g,.6,.6,.04,toy(C.peach),0,.02,0,32);CY(g,.4,.4,.03,toy(C.pink),0,.04,0,32);};
M.claylight=g=>{CY(g,.08,.1,.3,toy(C.cream),0,.15,0);SP(g,.16,toy(C.pink),0,.4,0);SP(g,.06,mat('#fff8e1',.3,0,{emissive:new THREE.Color('#ffe2a0'),emissiveIntensity:.6}),0,.4,0);};
M.clayplush=g=>{SP(g,.2,toy(C.peach),0,.2,0);SP(g,.12,toy(C.cream),0,.35,.08);SP(g,.04,eye(),-.05,.38,.12);SP(g,.04,eye(),.05,.38,.12);};
M.clayjar=g=>{CY(g,.12,.14,.2,toy(C.pink),0,.1,0);CY(g,.1,.12,.04,toy(C.cream),0,.22,0);SP(g,.03,toy(C.hot),0,.25,0);};
M.claycup=g=>{CY(g,.08,.1,.12,toy(C.sky),0,.06,0);CY(g,.06,.08,.02,toy(C.cream),0,.13,0);};
M.clayplate=g=>{CY(g,.18,.16,.03,toy(C.cream),0,.02,0);CY(g,.14,.12,.02,toy(C.pink),0,.04,0);};
M.claysoap=g=>{RB(g,.1,.04,.08,.02,toy(C.pink),0,.02,0);SP(g,.02,toy(C.hot),0,.05,0);};
M.claytowel=g=>{RB(g,.2,.06,.15,.02,toy(C.peach),0,.03,0);RB(g,.18,.04,.13,.02,toy(C.cream),0,.06,0);};
M.claygift=g=>{RB(g,.2,.16,.16,.04,toy(C.pink),0,.08,0);RB(g,.22,.04,.18,.02,toy(C.hot),0,.17,0);SP(g,.04,toy(C.hot),0,.2,0);};
M.clayhat=g=>{CO(g,.12,.2,toy(C.sun),0,.1,0);CY(g,.14,.16,.02,toy(C.sun),0,.02,0);};
M.clayjewelry=g=>{RB(g,.18,.08,.14,.03,toy(C.lilac),0,.04,0);SP(g,.03,metalM(C.gold),0,.09,0);};
M.claybrush=g=>{CY(g,.02,.02,.12,toy(C.peach),0,.06,0);SP(g,.03,toy(C.pink),0,.13,0);};
M.claycake=g=>{CY(g,.2,.2,.12,toy(C.pink),0,.06,0);CY(g,.16,.16,.08,toy(C.cream),0,.14,0);SP(g,.03,toy(C.hot),0,.2,0);};
M.claycupcake=g=>{CY(g,.08,.08,.06,toy(C.peach),0,.03,0);SP(g,.06,toy(C.pink),0,.08,0);};
M.claytub=g=>{CY(g,.4,.4,.2,toy(C.cream),0,.1,0);CY(g,.36,.36,.04,toy(C.sky),0,.18,0);};
M.claysink=g=>{CY(g,.16,.16,.08,toy(C.cream),0,.04,0);CY(g,.12,.12,.04,toy(C.sky),0,.08,0);};
M.claybooks=g=>{RB(g,.12,.08,.1,.02,toy(C.pink),0,.04,0);RB(g,.1,.06,.08,.02,toy(C.sky),.02,.09,0);};
})();

/* ============================================================================================
   Riki Claw Arcade (Claude, Oct 29): GRAB A PRIZE → the claw picks a surprise plushie by itself →
   it pops out of the chute → Hebrew root question → grab again. After 8 roots: golden Claw Coin,
   INSERT COIN, and a mystery mini dollhouse item that goes into her real house inventory.
   Owns [data-extra="claw"]. The older Claw in 13-game.js remains the no-WebGL fallback.
   New saved key: rikiClawPlushV1 (plushies won). Inventory uses the existing rickyHouseInventoryV1.
   ============================================================================================ */
(function(){
const G=n=>{try{return (0,eval)(n)}catch(e){return undefined}};
const SET=c=>{try{(0,eval)(c)}catch(e){}};
const K=window.RK3;if(!K)return;
const {mat,fabric,gloss,metalM,RB,BX,CY,SP,CO,add,eye,face,heartShape,starShape,moonShape,ext,puff,toy,glow}=K;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;

/* ---------------- plush building blocks ---------------- */
const F=fabric;
function headBody(g,c,{belly,headR=.22,bodyR=.26,head=true}={}){SP(g,bodyR,F(c),0,bodyR,0,1,.92,.9);if(belly)SP(g,bodyR*.62,F(belly),0,bodyR*.95,bodyR*.55,1,1.05,.45);if(head)SP(g,headR,F(c),0,bodyR*1.75+headR*.65,0);
  [-1,1].forEach(k=>{SP(g,.07,F(c),k*bodyR*.92,bodyR*1.1,.05,.9,1.3,.9);SP(g,.075,F(c),k*bodyR*.5,.05,bodyR*.55,1,.65,1.3);});return bodyR*1.75+headR*.65;}
const fz=(r)=>r*.9;
const ears={
 round:(g,c,y,r,inner)=>[-1,1].forEach(k=>{SP(g,r*.36,F(c),k*r*.72,y+r*.78,0);if(inner)SP(g,r*.2,F(inner),k*r*.72,y+r*.78,r*.15,1,1,.4);}),
 long:(g,c,y,r,inner)=>[-1,1].forEach(k=>{const e=SP(g,r*.22,F(c),k*r*.38,y+r*1.3,-.01,.8,2.6,.6);e.rotation.z=k*.15;if(inner)SP(g,r*.12,F(inner),k*r*.38,y+r*1.32,r*.1,.7,2.2,.3);}),
 tri:(g,c,y,r,inner)=>[-1,1].forEach(k=>{const e=CO(g,r*.3,r*.55,F(c),k*r*.62,y+r*.95,0);e.rotation.z=-k*.3;if(inner){const i=CO(g,r*.17,r*.32,F(inner),k*r*.6,y+r*.92,r*.1);i.rotation.z=-k*.3;}}),
 flop:(g,c,y,r)=>[-1,1].forEach(k=>{const e=SP(g,r*.3,F(c),k*r*.95,y+r*.05,0,.6,1.5,.8);e.rotation.z=k*.35;})
};
const muzzle=(g,c,y,r)=>SP(g,r*.42,F(c),0,y-r*.25,r*.78,1.1,.75,.6);
const nose=(g,c,y,r)=>SP(g,r*.1,gloss(c||'#3a2430'),0,y-r*.12,r*1.0,1.2,.8,.8);
function kawaii(g,y,r,s=1){face(g,0,y,fz(r),s);}
const PAL={pink:'#f7a0bd',hot:'#e2457a',mint:'#8ed6c4',sky:'#8fc6e8',lilac:'#c8a2ff',sun:'#ffd25e',cream:'#fff4e6',choc:'#8a5a35',red:'#ef5a6f',orange:'#ff9a4d',green:'#6ec07a',grey:'#b9b5c2',navy:'#4b4a8f',white:'#fbf8f6',brown:'#b9814f',tan:'#e2b98a',black:'#3a3440'};

/* 40 plushies: [id, name, rarity, build] */
const PLUSH=[
 ['bear','Honey Bear',0,g=>{const y=headBody(g,PAL.brown,{belly:PAL.tan});ears.round(g,PAL.brown,y,.22,PAL.tan);muzzle(g,PAL.tan,y,.22);nose(g,0,y,.22);kawaii(g,y+.03,.22);}],
 ['bunny','Cotton Bunny',0,g=>{const y=headBody(g,PAL.white,{belly:'#ffe3ea'});ears.long(g,PAL.white,y,.22,PAL.pink);kawaii(g,y,.22);SP(g,.025,gloss(PAL.pink),0,y-.04,.21);}],
 ['cat','Peach Kitty',0,g=>{const y=headBody(g,'#ffb877',{belly:'#fff1e3'});ears.tri(g,'#ffb877',y,.22,PAL.pink);kawaii(g,y,.22);[-1,1].forEach(k=>BX(g,.12,.006,.006,eye(),k*.17,y-.06,.18));const t=CY(g,.035,.03,.4,F('#ffb877'),.18,.25,-.25,10);t.rotation.z=-.6;}],
 ['puppy','Floppy Puppy',0,g=>{const y=headBody(g,'#f2d4ab');ears.flop(g,PAL.choc,y,.22);muzzle(g,'#fff4e6',y,.22);nose(g,0,y,.22);kawaii(g,y+.04,.22);SP(g,.06,F(PAL.choc),.1,y+.08,.17,1,1,.4);}],
 ['fox','Ember Fox',0,g=>{const y=headBody(g,PAL.orange,{belly:PAL.white});ears.tri(g,PAL.orange,y,.24,PAL.black);muzzle(g,PAL.white,y,.22);nose(g,0,y,.22);kawaii(g,y+.04,.22);const t=SP(g,.13,F(PAL.orange),.2,.25,-.25,.8,1.6,.8);t.rotation.z=-.7;SP(g,.07,F(PAL.white),.33,.42,-.31);}],
 ['panda','Bamboo Panda',0,g=>{const y=headBody(g,PAL.white,{bodyR:.28});[-1,1].forEach(k=>{SP(g,.07,F(PAL.black),k*.28*.92,.31,.05,.9,1.3,.9);SP(g,.075,F(PAL.black),k*.14,.05,.15,1,.65,1.3);SP(g,.055,F(PAL.black),k*.075,y+.02,.19,1,1.2,.5);});ears.round(g,PAL.black,y,.22);nose(g,0,y,.22);face(g,0,y+.02,.215,1);BX(g,.03,.25,.03,toy('#6ec07a'),.22,.32,.15);}],
 ['frog','Lily Frog',0,g=>{SP(g,.32,F(PAL.green),0,.3,0,1.1,.85,.95);SP(g,.2,F('#c9f0b0'),0,.26,.18,1,.9,.5);[-1,1].forEach(k=>{SP(g,.1,F(PAL.green),k*.15,.58,.08);SP(g,.05,gloss('#fff'),k*.15,.6,.16);SP(g,.03,eye(),k*.15,.6,.2);SP(g,.08,F(PAL.green),k*.25,.06,.2,1.4,.5,1.3);});const m=add(g,new THREE.TorusGeometry(.08,.012,8,16,Math.PI),eye(),0,.42,.28);m.rotation.z=Math.PI;SP(g,.035,F(PAL.pink),-.18,.44,.25,1,.6,.4);SP(g,.035,F(PAL.pink),.18,.44,.25,1,.6,.4);}],
 ['duck','Puddle Duck',0,g=>{SP(g,.3,F(PAL.sun),0,.28,0,1,.9,1.05);SP(g,.2,F(PAL.sun),0,.62,.03);const b=SP(g,.08,F(PAL.orange),0,.58,.2,1.3,.5,1);kawaii(g,.66,.2);[-1,1].forEach(k=>{const w=SP(g,.12,F(PAL.sun),k*.28,.3,0,.4,.8,1.1);w.rotation.z=k*.4;});SP(g,.06,F(PAL.sky),.0,.84,0,1.4,.4,1.4);}],
 ['penguin','Frosty Penguin',0,g=>{SP(g,.28,F(PAL.navy),0,.36,0,1,1.25,.95);SP(g,.2,F(PAL.white),0,.34,.14,1,1.3,.6);SP(g,.05,F(PAL.orange),0,.55,.27,1.2,.6,1);face(g,0,.62,.25,1);[-1,1].forEach(k=>{const f=SP(g,.1,F(PAL.navy),k*.27,.36,0,.35,1.1,.7);f.rotation.z=k*.35;SP(g,.07,F(PAL.orange),k*.1,.03,.12,1.2,.4,1.4);});const s=add(g,new THREE.TorusGeometry(.25,.045,8,24),F(PAL.hot),0,.44,0);s.rotation.x=Math.PI/2;}],
 ['owl','Moonbeam Owl',0,g=>{SP(g,.3,F('#a87b58'),0,.34,0,1,1.1,.95);SP(g,.2,F('#e9d3b4'),0,.28,.17,1,1.1,.5);[-1,1].forEach(k=>{CY(g,.09,.09,.04,F('#fff4e6'),k*.11,.48,.24,20).rotation.x=Math.PI/2;SP(g,.045,eye(),k*.11,.48,.27);CO(g,.06,.14,F('#a87b58'),k*.18,.72,0).rotation.z=-k*.4;const w=SP(g,.13,F('#8a5a35'),k*.28,.32,0,.35,1,.9);});CO(g,.03,.07,F(PAL.sun),0,.39,.29).rotation.x=Math.PI;}],
 ['pig','Bubble Pig',0,g=>{SP(g,.32,F('#ffc4d6'),0,.32,0,1.1,.9,1);CY(g,.09,.09,.05,F('#ff9fbd'),0,.35,.3,20).rotation.x=Math.PI/2;[-1,1].forEach(k=>{SP(g,.016,eye(),k*.035,.36,.33);const e=CO(g,.07,.1,F('#ff9fbd'),k*.18,.6,.05);e.rotation.z=-k*.5;SP(g,.035,eye(),k*.11,.46,.28);SP(g,.07,F('#ffc4d6'),k*.18,.04,.15,1,.7,1.2);});}],
 ['cow','Daisy Cow',0,g=>{const y=headBody(g,PAL.white);[[.15,.3,.2],[-.2,.18,.15],[.05,y+.1,.2],[-.12,.4,-.2]].forEach(([x,yy,z])=>SP(g,.07,F(PAL.black),x,yy,z,1,1,.5));SP(g,.12,F('#ffc4d6'),0,y-.07,.18,1.2,.7,.7);[-1,1].forEach(k=>{CO(g,.03,.09,toy('#fff1c9'),k*.12,y+.22,0);const e=SP(g,.06,F(PAL.white),k*.24,y+.08,0,1.4,.6,.6);});face(g,0,y+.06,.2,.9);}],
 ['koala','Sleepy Koala',0,g=>{const y=headBody(g,PAL.grey,{belly:'#e8e4ee'});[-1,1].forEach(k=>{SP(g,.12,F(PAL.grey),k*.22,y+.12,0,1,1,.6);SP(g,.07,F('#f3e6f0'),k*.22,y+.12,.05,1,1,.4);});SP(g,.06,gloss('#3a3440'),0,y-.03,.21,.9,1.3,.8);[-1,1].forEach(k=>{const e=add(g,new THREE.TorusGeometry(.025,.008,6,12,Math.PI),eye(),k*.08,y+.04,.2);});}],
 ['monkey','Cheeky Monkey',0,g=>{const y=headBody(g,'#a8744a',{belly:'#e9c59c'});SP(g,.17,F('#e9c59c'),0,y-.02,.1,1.1,1,.7);[-1,1].forEach(k=>{SP(g,.08,F('#a8744a'),k*.24,y,0,1,1,.5);SP(g,.045,F('#e9c59c'),k*.24,y,.03,1,1,.4);});kawaii(g,y+.03,.2);const t=add(g,new THREE.TorusGeometry(.14,.025,8,16,Math.PI*1.4),F('#a8744a'),.18,.3,-.24);}],
 ['lion','Sunny Lion',0,g=>{const y=headBody(g,PAL.sun);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;SP(g,.08,F(PAL.orange),Math.cos(a)*.22,y+Math.sin(a)*.22,-.04);}SP(g,.21,F(PAL.sun),0,y,.02);muzzle(g,'#fff1c9',y,.21);nose(g,'#a8744a',y,.21);kawaii(g,y+.04,.21);}],
 ['elephant','Bluebell Elephant',0,g=>{const y=headBody(g,'#a9b8e0');[-1,1].forEach(k=>{const e=SP(g,.16,F('#a9b8e0'),k*.27,y,-.02,.4,1.2,1);SP(g,.1,F('#f7c7da'),k*.28,y,.03,.3,1,.7);});const tr=CY(g,.05,.04,.2,F('#a9b8e0'),0,y-.14,.2,10);tr.rotation.x=.6;kawaii(g,y+.06,.2);}],
 ['octopus','Squishy Octopus',0,g=>{SP(g,.28,F(PAL.lilac),0,.42,0,1,1.05,1);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const t=SP(g,.07,F(PAL.lilac),Math.cos(a)*.22,.1,Math.sin(a)*.22,1,1.8,1);t.rotation.z=Math.cos(a)*.5;t.rotation.x=-Math.sin(a)*.5;}kawaii(g,.44,.28);[[.12,.62],[-.15,.58],[0,.7]].forEach(([x,yy])=>SP(g,.03,F('#e6d8ff'),x,yy,.22,1,1,.4));}],
 ['whale','Splash Whale',0,g=>{SP(g,.3,F('#6fb3e6'),0,.3,0,1.35,.9,1);SP(g,.22,F('#d6efff'),0,.2,.12,1.2,.6,.7);const t=SP(g,.12,F('#6fb3e6'),-.42,.42,0,.9,.4,.6);t.rotation.z=.6;kawaii(g,.36,.3);[-.05,0,.05].forEach((x,i)=>SP(g,.035,gloss('#bfe6ff'),x,.62+i%2*.05,0));}],
 ['turtle','Shelly Turtle',0,g=>{const sh=add(g,new THREE.SphereGeometry(.3,24,12,0,Math.PI*2,0,Math.PI/2),F('#5fb06a'),0,.12,0);sh.scale.y=.85;for(let i=0;i<6;i++){const a=i/6*Math.PI*2;SP(g,.06,F('#9bd06a'),Math.cos(a)*.17,.27,Math.sin(a)*.17,1,.4,1);}SP(g,.07,F('#9bd06a'),0,.33,0,1,.4,1);CY(g,.3,.3,.05,F('#e9d39a'),0,.1,0,28);SP(g,.14,F('#a8e090'),0,.22,.33);face(g,0,.25,.45,.75);[[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([a,b])=>SP(g,.06,F('#a8e090'),a*.22,.08,b*.2,1.3,.6,1));}],
 ['unicorn','Cloud Unicorn',0,g=>{const y=headBody(g,'#fbf6ff');ears.tri(g,'#fbf6ff',y,.2,PAL.pink);CO(g,.04,.2,metalM('#f2c94c'),0,y+.28,.06);['#f7a0bd','#c8a2ff','#8ed6c4'].forEach((c,i)=>{SP(g,.075,F(c),-.15+i*.03,y+.16-i*.1,-.06,1,1,.8);SP(g,.06,F(c),.22,.18+i*.06,-.2);});muzzle(g,'#ffe3ea',y,.2);kawaii(g,y+.05,.2);}],
 ['dragon','Little Dragon',0,g=>{const y=headBody(g,'#7fcf8f',{belly:'#fff1c9'});[-1,1].forEach(k=>{const w=SP(g,.16,F('#c8a2ff'),k*.26,.48,-.15,.15,1,1.1);w.rotation.y=k*.5;CO(g,.03,.09,toy('#fff1c9'),k*.1,y+.22,0);});for(let i=0;i<4;i++)CO(g,.04,.08,F('#5fb06a'),0,.6-i*.13,-.24-i*.02).rotation.x=-.6;muzzle(g,'#a8e0b0',y,.21);kawaii(g,y+.05,.21);}],
 ['ghost','Boo Ghost',0,g=>{SP(g,.27,F('#fdfbff'),0,.5,0,1,1.2,.95);CY(g,.27,.3,.3,F('#fdfbff'),0,.22,0,24);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;SP(g,.07,F('#fdfbff'),Math.cos(a)*.24,.07,Math.sin(a)*.24);}kawaii(g,.55,.27);[-1,1].forEach(k=>SP(g,.06,F('#fdfbff'),k*.3,.32,.05,1,.6,.8));}],
 ['alien','Zippy Alien',0,g=>{SP(g,.25,F('#9be3a0'),0,.27,0,1,1,.9);SP(g,.26,F('#9be3a0'),0,.68,0,1.1,.9,.9);[-1,0,1].forEach(k=>{SP(g,.06,gloss('#fff'),k*.11,.7,.2);SP(g,.035,eye(),k*.11,.7,.25);});[-1,1].forEach(k=>{const a=CY(g,.01,.01,.22,toy('#5fb06a'),k*.1,.98,0,6);a.rotation.z=k*.3;SP(g,.04,glow('#ff9fc0',1),k*.16,1.08,0);});const m=add(g,new THREE.TorusGeometry(.05,.012,8,16,Math.PI),eye(),0,.6,.23);m.rotation.z=Math.PI;}],
 ['robot','Bolt Robot',0,g=>{RB(g,.44,.38,.34,.08,toy('#c9d3e0'),0,.22,0);RB(g,.4,.32,.3,.08,toy('#dfe6ee'),0,.62,0);RB(g,.3,.16,.02,.04,gloss('#3a4a6a'),0,.64,.16);[-1,1].forEach(k=>{SP(g,.035,glow('#7fdcff',1.4),k*.07,.64,.18);RB(g,.08,.24,.08,.03,toy('#c9d3e0'),k*.27,.24,0);});CY(g,.01,.01,.12,metalM(),0,.85,0,6);SP(g,.04,glow('#ff5a6e',1.4),0,.92,0);[0,1,2].forEach(i=>SP(g,.025,glow(['#ffd25e','#5cc6a8','#e2457a'][i],1.2),-.07+i*.07,.3,.18));}],
 ['cloud','Dreamy Cloud',0,g=>{[[0,.32,0,.24],[-.2,.24,0,.17],[.2,.24,0,.17],[-.1,.45,0,.15],[.11,.44,0,.16]].forEach(([x,y,z,r])=>SP(g,r,F('#eaf4ff'),x,y,z));kawaii(g,.33,.24);SP(g,.05,F('#ffd6e6'),-.15,.28,.17,1,.6,.4);SP(g,.05,F('#ffd6e6'),.15,.28,.17,1,.6,.4);}],
 ['star','Twinkle Star',0,g=>{const s=ext(g,starShape(.34,.5),.18,F(PAL.sun),0,.36,0,.07);kawaii(g,.36,.15);}],
 ['moon','Snooze Moon',0,g=>{ext(g,moonShape(.32),.18,F('#fff1a8'),0,.36,0,.07).rotation.z=.3;[-1,1].forEach(k=>add(g,new THREE.TorusGeometry(.025,.008,6,12,Math.PI),eye(),-.1+k*.06,.4,.19));SP(g,.03,F('#ffb3c8'),-.2,.33,.18,1,.6,.4);CO(g,.08,.18,F(PAL.navy),-.05,.68,0).rotation.z=.5;SP(g,.03,F('#fff'),-.13,.76,0);}],
 ['strawberry','Berry Sweet',0,g=>{const b=CO(g,.3,.55,F(PAL.red),0,.3,0);b.rotation.x=Math.PI;SP(g,.27,F(PAL.red),0,.48,0,1,.6,1);for(let i=0;i<14;i++){const a=i*2.4,yy=.2+(i%5)*.07;SP(g,.016,toy('#ffe27a'),Math.cos(a)*.2*(yy/.5+.3),yy,Math.sin(a)*.2*(yy/.5+.3)+.05);}for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const l=SP(g,.1,F(PAL.green),Math.cos(a)*.1,.64,Math.sin(a)*.1,1.3,.3,.6);l.rotation.y=-a;}kawaii(g,.42,.26);}],
 ['donut','Sprinkle Donut',0,g=>{const d=add(g,new THREE.TorusGeometry(.22,.12,16,32),F('#e9b36a'),0,.34,0);const f=add(g,new THREE.TorusGeometry(.22,.1,16,32),F(PAL.pink),0,.36,.03);f.scale.z=.8;for(let i=0;i<14;i++){const a=i/14*Math.PI*2;CY(g,.01,.01,.05,gloss(['#7cc4f2','#ffd25e','#fff','#5cc6a8'][i%4]),Math.cos(a)*.22,.36+Math.sin(a)*.22,.13,4).rotation.z=a;}face(g,0,.18,.13,.8);}],
 ['cupcake','Frosty Cupcake',0,g=>{CY(g,.24,.18,.3,F('#8fc6e8'),0,.15,0,20);[[.24,.38],[.19,.48],[.12,.56]].forEach(([r,y])=>{const t=add(g,new THREE.TorusGeometry(r,.07,12,24),F('#fff1dc'),0,y,0);t.rotation.x=Math.PI/2;});SP(g,.07,gloss(PAL.red),0,.66,0);kawaii(g,.2,.24);}],
 ['sushi','Salmon Sushi',0,g=>{RB(g,.5,.24,.32,.1,F('#fbfbf5'),0,.14,0);RB(g,.54,.1,.34,.05,F('#ff9a6e'),0,.31,0);[-.12,0,.12].forEach(x=>BX(g,.02,.005,.34,F('#ffd2bd'),x,.365,0));BX(g,.12,.26,.36,F('#2f4a3a'),0,.17,0);face(g,0,.17,.17,.8);}],
 ['boba','Boba Buddy',0,g=>{CY(g,.2,.17,.5,mat('#f6e2c8',.4,0,{transparent:true,opacity:.9}),0,.25,0,24);for(let i=0;i<10;i++)SP(g,.035,gloss('#3a2430'),Math.cos(i*2.1)*.12,.06+(i%3)*.04,Math.sin(i*2.1)*.12);CY(g,.21,.21,.04,toy(PAL.pink),0,.52,0,24);const st=CY(g,.025,.025,.4,toy(PAL.hot),.06,.7,0,8);st.rotation.z=-.2;face(g,0,.3,.19,.9);}],
 ['icecream','Swirly Cone',0,g=>{CO(g,.18,.4,F('#e9b36a'),0,.2,0).rotation.x=Math.PI;[[.2,.44,PAL.mint],[.17,.58,PAL.pink],[.11,.7,'#fff1dc']].forEach(([r,y,c])=>SP(g,r,F(c),0,y,0,1,.75,1));SP(g,.05,gloss(PAL.red),0,.8,0);face(g,0,.46,.19,.85);}],
 ['avocado','Avo Pal',0,g=>{SP(g,.27,F('#5a8a3a'),0,.32,0,1,1.25,.9);SP(g,.23,F('#c9e87a'),0,.32,.06,1,1.2,.75);SP(g,.1,F('#a8744a'),0,.24,.2,1,1,.6);face(g,0,.46,.21,.85);}],
 ['cactus','Prickle Pal',0,g=>{CY(g,.2,.16,.2,toy('#f7a0bd'),0,.1,0,20);SP(g,.17,F('#6ec07a'),0,.42,0,1,1.4,1);[-1,1].forEach(k=>{const a=SP(g,.07,F('#6ec07a'),k*.2,.46,0,1,1.7,1);a.rotation.z=-k*.4;});SP(g,.05,F(PAL.pink),0,.68,0);face(g,0,.45,.16,.8);}],
 ['mushroom','Toadstool Tot',0,g=>{CY(g,.13,.16,.3,F('#fff4e6'),0,.15,0,16);const c=SP(g,.3,F(PAL.red),0,.38,0,1,.6,1);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;SP(g,.04,F('#fff'),Math.cos(a)*.18,.48,Math.sin(a)*.18,1,.4,1);}SP(g,.05,F('#fff'),0,.55,0,1,.4,1);face(g,0,.18,.15,.75);}],
 /* rare */
 ['goldbear','Golden Crown Bear',1,g=>{const y=headBody(g,'#f2c94c',{belly:'#fff1a8'});g.children.forEach(o=>{if(o.isMesh)o.material=metalM('#f2c94c');});ears.round(g,'#f2c94c',y,.22);g.children.slice(-2).forEach(o=>o.material=metalM('#f2c94c'));kawaii(g,y+.03,.22);CY(g,.1,.11,.06,metalM('#f2c94c'),0,y+.25,0,16);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;CO(g,.025,.07,metalM('#f2c94c'),Math.cos(a)*.1,y+.31,Math.sin(a)*.1);}SP(g,.03,gloss(PAL.hot),0,y+.26,.11);}],
 ['rainbowuni','Rainbow Unicorn',1,g=>{const y=headBody(g,'#ffd6ec');ears.tri(g,'#ffd6ec',y,.2,'#ffffff');CO(g,.045,.24,glow('#ffe08a',.8),0,y+.3,.06);['#e2457a','#ff9a4d','#ffd25e','#5cc6a8','#7cc4f2','#c8a2ff'].forEach((c,i)=>{SP(g,.07,F(c),-.2+(i%2)*.04,y+.2-i*.09,-.04,1,1,.8);SP(g,.065,F(c),.24,.12+i*.05,-.2);});kawaii(g,y+.05,.2);for(let i=0;i<5;i++)SP(g,.02,glow('#ffe8f5',2),Math.cos(i*1.3)*.36,.3+i*.12,Math.sin(i*1.3)*.2);}],
 ['galaxydragon','Galaxy Dragon',1,g=>{const y=headBody(g,'#5b4bb0',{belly:'#c8a2ff'});g.children.forEach(o=>{if(o.isMesh&&o.material.color)o.material=mat('#5b4bb0',.5,0,{emissive:new THREE.Color('#2a1a70'),emissiveIntensity:.6});});[-1,1].forEach(k=>{const w=SP(g,.17,glow('#7fdcff',.6),k*.27,.48,-.15,.15,1,1.1);w.rotation.y=k*.5;});for(let i=0;i<8;i++)SP(g,.018,glow('#ffffff',2),Math.cos(i*2)*.2,.2+i*.07,.22);kawaii(g,y+.05,.21);}],
 ['crystalcat','Crystal Kitty',1,g=>{const y=headBody(g,'#d9ccff');g.children.forEach(o=>{if(o.isMesh)o.material=mat('#d9ccff',.1,.2,{transparent:true,opacity:.75,emissive:new THREE.Color('#8f7bff'),emissiveIntensity:.3});});ears.tri(g,'#d9ccff',y,.22);kawaii(g,y,.22);add(g,new THREE.OctahedronGeometry(.06,0),glow('#ff9fc0',1),0,y-.2,.24);}]
];
const PBY={};PLUSH.forEach(p=>PBY[p[0]]=p);
const PKEY='rikiClawPlushV1';
const plushData=()=>{try{return JSON.parse(localStorage.getItem(PKEY)||'{}')||{};}catch(e){return {};}};
function winPlush(id){const d=plushData();d[id]=(d[id]||0)+1;try{localStorage.setItem(PKEY,JSON.stringify(d));}catch(e){}}
function buildPlush(id){const g=new THREE.Group();try{PBY[id][3](g);}catch(e){console.warn('plush',id,e);}g.traverse(o=>{if(o.isMesh){o.castShadow=true;}});return g;}

/* ---------------- mystery mini dollhouse prizes (real items) ---------------- */
const MINI=[
 ['clawpillows','🛋️','Heart throw pillows',0,'any','Claw prizes',g=>{[[-.18,'#f7a0bd'],[.18,'#c8a2ff']].forEach(([x,c],i)=>{const p=ext(g,heartShape(.17),.1,F(c),x,.17,i*.05,.06);p.rotation.x=-.25;});RB(g,.3,.26,.1,.08,F('#8ed6c4'),0,.15,-.12);}],
 ['clawgroceries','🥛','Fridge groceries',0,'kitchen','Claw prizes',g=>{RB(g,.12,.28,.12,.02,toy('#ffffff'),-.2,.14,0);RB(g,.12,.05,.12,.02,toy('#7cc4f2'),-.2,.3,0);RB(g,.22,.09,.16,.02,toy('#f2d4ab'),.05,.045,.05);[-.04,.03,.1].forEach(x=>SP(g,.035,toy('#fff4e6'),x,.11,.05,1,1.2,1));[[.22,.06,'#ef5a6f'],[.18,.14,'#ffd25e'],[.27,.13,'#ff9a4d']].forEach(([x,y,c])=>SP(g,.055,gloss(c),x,y,-.05));}],
 ['clawsucculents','🪴','Tiny succulent trio',0,'any','Claw prizes',g=>{[[-.2,'#f7a0bd'],[0,'#8fc6e8'],[.2,'#ffd25e']].forEach(([x,c])=>{CY(g,.08,.06,.1,toy(c),x,.05,0,16);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const l=SP(g,.04,toy('#6ec07a'),x+Math.cos(a)*.03,.13,Math.sin(a)*.03,.6,1.2,.6);l.rotation.z=Math.cos(a)*.6;l.rotation.x=Math.sin(a)*.6;}});}],
 ['clawtrain','🚂','Toy train',0,'any','Claw prizes',g=>{RB(g,.22,.14,.14,.03,toy('#ef5a6f'),-.12,.13,0);RB(g,.1,.12,.12,.02,toy('#ef5a6f'),-.18,.25,0);CY(g,.03,.035,.08,toy('#4a2338'),-.04,.24,0,10);RB(g,.18,.1,.13,.03,toy('#7cc4f2'),.12,.11,0);[[-.18,-1],[-.06,-1],[.07,-1],[.17,-1],[-.18,1],[-.06,1],[.07,1],[.17,1]].forEach(([x,z])=>{const w=CY(g,.035,.035,.02,toy('#4a2338'),x,.05,z*.075,12);w.rotation.x=Math.PI/2;});}],
 ['clawlantern','🏮','Glowing lantern',0,'any','Claw prizes',g=>{CY(g,.1,.12,.03,metalM('#f2c94c'),0,.015,0,16);SP(g,.13,glow('#ffcf7a',1.1),0,.18,0,1,1.2,1);CY(g,.08,.08,.03,metalM('#f2c94c'),0,.33,0,16);add(g,new THREE.TorusGeometry(.05,.01,6,12,Math.PI),metalM('#f2c94c'),0,.36,0);const L=new THREE.PointLight(0xffcf7a,.4,2,2);L.position.y=.2;g.add(L);}],
 ['clawstarrug','⭐','Star rug',0,'any','Claw prizes',g=>{const r=ext(g,starShape(.5,.55),.02,F('#ffd25e'),0,.012,0,.01);r.rotation.x=-Math.PI/2;r.castShadow=false;const r2=ext(g,starShape(.3,.55),.022,F('#fff1a8'),0,.02,0,.01);r2.rotation.x=-Math.PI/2;r2.castShadow=false;}],
 ['clawcandles','🕯️','Candle set',0,'any','Claw prizes',g=>{[[-.1,.16,'#ffc4d8'],[.02,.22,'#fff4e6'],[.13,.12,'#c9f0e2']].forEach(([x,h,c])=>{CY(g,.045,.045,h,toy(c),x,h/2,0,16);SP(g,.025,glow('#ffb020',2),x,h+.03,0,1,1.6,1);});CY(g,.2,.2,.02,metalM('#f2c94c'),0,.01,0,24);}],
 ['clawmusicbox','🎶','Music box',0,'any','Claw prizes',g=>{RB(g,.3,.16,.2,.03,toy('#c8a2ff'),0,.08,0);const lid=RB(g,.3,.04,.2,.03,toy('#b28af0'),0,.22,-.07);lid.rotation.x=-.9;CY(g,.06,.06,.02,metalM('#f2c94c'),0,.17,0,16);SP(g,.04,toy('#f7a0bd'),0,.22,0);CO(g,.04,.08,toy('#f7a0bd'),0,.28,0);}],
 ['clawglobe','🌍','Desk globe',0,'any','Claw prizes',g=>{CY(g,.09,.11,.03,wood('#a8744a'),0,.015,0,16);CY(g,.012,.012,.12,metalM('#f2c94c'),0,.08,0,6);SP(g,.14,gloss('#7cc4f2'),0,.28,0);[[.05,.3,.1],[-.07,.24,.1],[.02,.35,-.08]].forEach(([x,y,z])=>SP(g,.05,toy('#6ec07a'),x,y,z,1.2,.8,.6));add(g,new THREE.TorusGeometry(.16,.008,6,24,Math.PI),metalM('#f2c94c'),0,.28,0).rotation.y=Math.PI/2;}],
 ['clawpiggy','🐷','Piggy bank',0,'any','Claw prizes',g=>{SP(g,.16,gloss('#ffc4d6'),0,.16,0,1.3,1,1);CY(g,.05,.05,.03,gloss('#ff9fbd'),.2,.17,0,16).rotation.z=Math.PI/2;[[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([a,b])=>CY(g,.03,.03,.06,gloss('#ff9fbd'),a*.1,.03,b*.07,10));BX(g,.07,.005,.015,eye(),0,.32,0);[-1,1].forEach(k=>{SP(g,.016,eye(),.15,.21,k*.05);CO(g,.04,.06,gloss('#ff9fbd'),.08,.3,k*.07);});}],
 ['clawphoto','🖼️','Photo frame',0,'any','Claw prizes',g=>{const f=RB(g,.3,.24,.03,.02,toy('#f7a0bd'),0,.14,0);f.rotation.x=-.15;const p=add(g,new THREE.PlaneGeometry(.22,.16),mat('#bfe7ff',.6),0,.14,.02);p.rotation.x=-.15;SP(g,.03,toy('#ffd25e'),.06,.17,.025);SP(g,.05,toy('#6ec07a'),-.04,.09,.025,1.4,.6,.2);}],
 ['clawbooknook','📚','Mini book stack',0,'any','Claw prizes',g=>{['#e2457a','#7cc4f2','#ffd25e','#5cc6a8'].forEach((c,i)=>{const b=RB(g,.26-i*.02,.05,.18,.01,toy(c),0,.025+i*.052,0);b.rotation.y=(i%2?.2:-.15);});SP(g,.05,toy('#c8a2ff'),0,.26,0);}],
 ['clawteaset','🍵','Mini tea set',0,'kitchen','Claw prizes',g=>{SP(g,.1,gloss('#ffffff'),0,.1,0,1,.85,1);CO(g,.03,.05,gloss('#ffffff'),0,.2,0);CY(g,.012,.02,.1,gloss('#ffffff'),.12,.12,0,8).rotation.z=-1;[[.2,.08],[-.2,.08]].forEach(([x,z])=>{CY(g,.06,.06,.008,gloss('#f7a0bd'),x,.005,z,16);CY(g,.04,.03,.05,gloss('#ffffff'),x,.035,z,16);});}],
 ['clawdollbed','🧸','Teddy in a basket',0,'any','Claw prizes',g=>{CY(g,.18,.15,.14,toy('#d9b07a'),0,.07,0,20);SP(g,.08,F('#b9814f'),0,.2,0);SP(g,.065,F('#b9814f'),0,.3,.02);[-1,1].forEach(k=>SP(g,.025,F('#b9814f'),k*.05,.36,0));face(g,0,.3,.06,.5);RB(g,.3,.03,.2,.01,F('#f7a0bd'),0,.15,.05);}]
];
const wood=K.wood;
const ITEMS=G('ITEMS');if(Array.isArray(ITEMS))MINI.forEach(m=>{if(!ITEMS.some(x=>x[0]===m[0]))ITEMS.push(m.slice(0,6));K.MODEL[m[0]]=g=>{const inner=new THREE.Group();m[6](inner);inner.scale.setScalar(1.8);g.add(inner);};});

/* ---------------- machine scene ---------------- */
let R=null,scene,cam,stageEl,looping=false,M=null,anims=[];
const tween=(dur,fn)=>new Promise(res=>{anims.push({t0:performance.now(),dur,fn:p=>{fn(p);if(p>=1)res();}});});
const PIT=0.82;
function buildMachine(){
  scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xffffff,0xffd9e4,.72));
  const key=new THREE.DirectionalLight(0xfff3e6,1.05);key.position.set(2.5,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);const c=key.shadow.camera;c.left=-3;c.right=3;c.top=3;c.bottom=-3;c.far=20;key.shadow.bias=-.0008;key.shadow.normalBias=.02;scene.add(key);
  scene.add(new THREE.DirectionalLight(0xffc4dd,.45).translateX(-4).translateY(3).translateZ(-3));
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.18}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;scene.add(gr);
  const g=new THREE.Group();scene.add(g);const pk=gloss('#e2457a'),wh=gloss('#ffffff');
  RB(g,1.7,.82,1.2,.08,pk,0,.41,0);RB(g,1.78,.08,1.28,.03,wh,0,.83,0);
  const glass=BX(g,1.62,1.25,1.12,mat('#e6f6ff',.05,0,{transparent:true,opacity:.14,depthWrite:false}),0,1.47,0);glass.castShadow=false;glass.renderOrder=5;
  [-1,1].forEach(a=>[-1,1].forEach(b=>RB(g,.07,1.27,.07,.02,wh,a*.8,1.47,b*.55)));
  RB(g,1.78,.36,1.28,.07,pk,0,2.28,0);
  const sign=RB(g,1.1,.22,.04,.06,glow('#ffd25e',.35),0,2.3,.66);
  const bulbs=[];for(let i=0;i<9;i++){const b=SP(g,.035,glow('#fff3a8',.6),-.72+i*.18,2.48,.64);bulbs.push(b);}
  /* chute: dark hole in the pit floor (front-left) and a door on the front */
  CY(g,.22,.22,.02,mat('#2a1d2a',.9),-.5,.84,.28,24);const rim=add(g,new THREE.TorusGeometry(.22,.03,8,28),wh,-.5,.86,.28);rim.rotation.x=Math.PI/2;
  RB(g,.42,.34,.04,.04,mat('#3a2a3a',.6),-.5,.32,.61);const flap=RB(g,.4,.3,.03,.03,mat('#f7a0bd',.3,0,{transparent:true,opacity:.75}),-.5,.33,.63);
  /* controls */
  RB(g,.6,.16,.3,.05,wh,.42,.9,.5);CY(g,.02,.02,.16,metalM(),.32,1.02,.5,8);SP(g,.05,gloss('#ef5a6f'),.32,1.12,.5);SP(g,.05,gloss('#7cc4f2'),.55,.98,.55);
  const slot=RB(g,.16,.2,.05,.03,metalM('#f2c94c'),.42,.55,.61);BX(g,.08,.012,.02,mat('#2a1d2a',.9),.42,.58,.64);
  /* pit fill */
  BX(g,1.55,.04,1.05,toy('#ffe3ea'),0,.86,0);
  /* claw */
  const claw=new THREE.Group();claw.position.set(.45,2.0,0);g.add(claw);const cable=CY(claw,.008,.008,1,metalM('#dfe6ea'),0,.5,0,4);
  CY(claw,.07,.08,.08,metalM('#dfe6ea'),0,0,0,16);SP(claw,.05,glow('#ff9fc0',.6),0,-.06,0);const prongs=[];
  for(let k=0;k<3;k++){const a=k/3*Math.PI*2;const pr=new THREE.Group();pr.position.set(Math.cos(a)*.05,-.03,Math.sin(a)*.05);pr.rotation.y=-a;claw.add(pr);const r1=CY(pr,.014,.014,.16,metalM('#dfe6ea'),.04,-.07,0,6);r1.rotation.z=.55;const r2=CY(pr,.012,.012,.1,metalM('#dfe6ea'),.07,-.17,0,6);r2.rotation.z=-.4;prongs.push(pr);}
  g.traverse(o=>{if(o.isMesh&&o!==glass){o.castShadow=true;o.receiveShadow=true;}});
  M={g,claw,prongs,cable,flap,bulbs,sign,slot,pile:[],home:claw.position.clone()};
}
function openClaw(a){M.prongs.forEach(p=>p.rotation.z=a);}
function setCable(){const len=2.42-M.claw.position.y;M.cable.scale.y=Math.max(.05,len);M.cable.position.y=len/2;}
function pilePlace(){const spots=[];for(let i=0;i<11;i++){let x,z,t=0;do{x=-.15+Math.random()*.8;z=-.38+Math.random()*.7;t++;}while(t<30&&spots.some(s=>Math.hypot(s[0]-x,s[1]-z)<.2));spots.push([x,z]);}return spots;}
function choosePile(){const won=plushData();const common=PLUSH.filter(p=>!p[2]),rare=PLUSH.filter(p=>p[2]);
  const fresh=shuffle(common.filter(p=>!won[p[0]])),old=shuffle(common.filter(p=>won[p[0]]));const pick=[...fresh,...old].slice(0,10);pick.push(rare[Math.floor(Math.random()*rare.length)]);return shuffle(pick);}
function fillPile(){M.pile.forEach(p=>M.g.remove(p.group));M.pile=[];const spots=pilePlace();choosePile().forEach((p,i)=>addToPile(p[0],spots[i]));}
function addToPile(id,spot,drop){const grp=buildPlush(id);grp.scale.setScalar(.5);const [x,z]=spot;grp.position.set(x,drop?2.0:PIT+.02+(Math.random()*.04),z);grp.rotation.y=(Math.random()-.5)*1.2;grp.rotation.z=(Math.random()-.5)*.4;M.g.add(grp);const item={id,group:grp,spot};M.pile.push(item);
  if(drop){tween(600,p=>{grp.position.y=2.0-(2.0-PIT-.02)*(p*p);});}return item;}
function resize(){if(!R||!stageEl)return;const w=stageEl.clientWidth,h=stageEl.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.9?44:36;cam.updateProjectionMatrix();}
let camShake=0,showPrize=null;
function loop(){
  if(!R||!R.domElement.isConnected){looping=false;return;}requestAnimationFrame(loop);const now=performance.now();
  anims=anims.filter(a=>{const p=cl((now-a.t0)/a.dur,0,1);a.fn(p);return p<1;});
  const sw=Math.sin(now/2600)*.12;const sh=camShake>0?(Math.random()-.5)*camShake:0;camShake*=.9;
  const d=cam.aspect<.9?4.1:3.7;cam.position.set(Math.sin(sw)*d+sh,1.8+sh,Math.cos(sw)*d);cam.lookAt(0,1.3,0);
  M.bulbs.forEach((b,i)=>{b.material.emissiveIntensity=.35+.6*((Math.sin(now/180+i)+1)/2);});setCable();
  if(showPrize){showPrize.rotation.y+=.02;showPrize.position.y=showPrize.userData.baseY+Math.sin(now/300)*.03;}
  R.render(scene,cam);
}
function ensureRenderer(){if(R)return;R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(1.75,devicePixelRatio||1));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.08;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;cam=new THREE.PerspectiveCamera(36,1,.05,60);window.addEventListener('resize',resize);}
function mount(el){ensureRenderer();stageEl=el;el.prepend(R.domElement);resize();if(!looping){looping=true;requestAnimationFrame(loop);}}

/* ---------------- grab animation ---------------- */
async function grab(){
  const run=S;
  const item=M.pile.filter(p=>!p.taken).sort(()=>Math.random()-.5)[0];if(!item)return null;item.taken=true;
  const claw=M.claw,home=M.home.clone(),tx=item.group.position.x,tz=item.group.position.z;
  const a0=claw.position.clone();await tween(650,p=>{const e=ease(p);claw.position.x=a0.x+(tx-a0.x)*e;claw.position.z=a0.z+(tz-a0.z)*e;});if(!clawActive(run))return null;
  openClaw(-.45);beep(520);
  await tween(520,p=>{claw.position.y=2.0-(2.0-(PIT+.42))*ease(p);});if(!clawActive(run))return null;
  openClaw(.2);beep(700);item.group.position.set(0,-.3,0);item.group.rotation.set(0,item.group.rotation.y,0);claw.add(item.group);
  await tween(520,p=>{claw.position.y=(PIT+.42)+(2.0-(PIT+.42))*ease(p);claw.rotation.z=Math.sin(p*Math.PI*3)*.05;});if(!clawActive(run))return null;claw.rotation.z=0;
  const b=claw.position.clone();await tween(650,p=>{const e=ease(p);claw.position.x=b.x+(-.5-b.x)*e;claw.position.z=b.z+(.28-b.z)*e;});if(!clawActive(run))return null;
  openClaw(-.45);beep(440);claw.remove(item.group);M.g.add(item.group);item.group.position.set(-.5,1.65,.28);
  await tween(380,p=>{item.group.position.y=1.65-(1.65-.7)*p*p;item.group.scale.setScalar(.5*(1-p*.4));});if(!clawActive(run))return null;
  M.g.remove(item.group);M.pile=M.pile.filter(x=>x!==item);openClaw(0);
  tween(700,p=>{const e=ease(p);claw.position.x=-.5+(home.x+.5)*e;claw.position.z=.28+(home.z-.28)*e;});if(!clawActive(run))return null;
  /* flap swings, plush pops out toward Riki */
  M.flap.rotation.x=0;tween(500,p=>{M.flap.rotation.x=-Math.sin(p*Math.PI)*1.1;M.flap.position.z=.63+Math.sin(p*Math.PI)*.12;});if(!clawActive(run))return null;
  const prize=buildPlush(item.id);scene.add(prize);prize.position.set(-.5,.3,.75);prize.scale.setScalar(.2);camShake=.05;beep(880,.18);
  await tween(820,p=>{const e=1-Math.pow(1-p,3);prize.position.set(-.5+.5*e,.3+.75*e+Math.sin(p*Math.PI)*.55,.75+.9*e);prize.scale.setScalar(.2+.8*e);prize.rotation.y=p*Math.PI*2;});if(!clawActive(run))return null;
  prize.userData.baseY=prize.position.y;showPrize=prize;
  /* refill the pile so it stays full */
  const spot=item.spot;const pool=PLUSH.filter(p=>!p[2]&&!M.pile.some(x=>x.id===p[0])&&p[0]!==item.id);addToPile(pool[Math.floor(Math.random()*pool.length)][0],spot,true);
  return item.id;
}
function clearPrize(){if(showPrize){const p=showPrize;showPrize=null;tween(350,t=>{p.scale.setScalar(Math.max(.01,1-t));p.position.y+=.01;}).then(()=>scene.remove(p));}}
let actx=null;function beep(f,d=.09){try{if(G('soundOn')===false)return;actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.07,actx.currentTime);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+d);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+d);}catch(e){}}

/* ---------------- game flow ---------------- */
const ROUNDS=8;let S=null;
function clawActive(run=S){return !!run&&S===run&&G('game')==='claw'&&!!document.getElementById('cmPanel');}
function words(){const W=G('W')||[];const f=G('ids');return {W,pool:typeof f==='function'?f():W.map((_,i)=>i)};}
function webgl(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')));}catch(e){return false;}}
function start(){
  const {W,pool}=words();if(!W.length)return false;
  const order=(window.RikiProgress&&window.RikiProgress.pick)?window.RikiProgress.pick(pool,ROUNDS):shuffle(pool).slice(0,ROUNDS);
  SET("game='claw';round=(typeof round==='number'?round+1:1);");window.__cmSession={order,at:0,score:0,missed:[],done:false};SET('session=window.__cmSession;');
  S={order,at:0,score:0,won:[]};
  const fr=G('frame');fr&&fr('🕹️ Claw Machine',`<div class="cm"><div class="cm-top"><span class="cm-dots" id="cmDots"></span><span class="cm-col" id="cmCol"></span></div><div class="cm-stage" id="cmStage"><div class="cm-banner" id="cmBanner" hidden></div><div class="cm-burst" id="cmBurst"></div></div><div class="cm-panel" id="cmPanel"></div></div>`);
  const el=document.getElementById('cmStage');
  const run=S;K.loadThree(()=>{if(!clawActive(run)||!el.isConnected)return;buildMachine();fillPile();mount(el);showGrab();},()=>{const p=document.getElementById('cmPanel');if(p)p.innerHTML='<p>The Claw Machine needs an internet connection to load.</p>';});
  return true;
}
function dots(){const d=document.getElementById('cmDots');if(d)d.innerHTML=Array.from({length:ROUNDS},(_,i)=>`<i class="${i<S.at?'on':i===S.at?'now':''}"></i>`).join('');const c=document.getElementById('cmCol');if(c){const n=Object.keys(plushData()).filter(k=>PBY[k]).length;c.textContent=`🧸 ${n} / ${PLUSH.length} collected`;}}
function panel(html){const p=document.getElementById('cmPanel');if(p)p.innerHTML=html;return p;}
function banner(html,cls=''){const b=document.getElementById('cmBanner');if(!b)return;if(!html){b.hidden=true;return;}b.className='cm-banner '+cls;b.innerHTML=html;b.hidden=false;}
function burst(n=26){const b=document.getElementById('cmBurst');if(!b||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cols=['#ff71ad','#ffd45b','#5bd8bf','#8fc6e8','#c8a2ff'];for(let i=0;i<n;i++){const d=document.createElement('i');d.style.background=cols[i%5];const a=Math.random()*Math.PI*2,r=70+Math.random()*110;d.style.setProperty('--dx',Math.cos(a)*r+'px');d.style.setProperty('--dy',Math.sin(a)*r+'px');b.appendChild(d);setTimeout(()=>d.remove(),1000);}}
function showGrab(){if(!clawActive())return;const run=S;dots();banner('');panel(`<button type="button" class="cm-big cm-grab" id="cmGrab">🕹️ GRAB A PRIZE!</button>`);document.getElementById('cmGrab').onclick=async e=>{const b=e.currentTarget;b.disabled=true;b.textContent='Grabbing…';clearPrize();const id=await grab();if(!clawActive(run))return;if(!id){showGrab();return;}winPlush(id);S.won.push(id);dots();const p=PBY[id];
  banner(`${p[2]?'<span class="cm-rare">✨ RARE ✨</span>':''}<b>You got ${esc(p[1])}!</b>`,p[2]?'rare':'');burst(p[2]?44:24);try{const a=G('audio');a&&a(p[2]?'win':'good');}catch(_){}setTimeout(()=>{if(clawActive(run))question();},650);};}
function question(){
  if(!clawActive())return;const run=S;
  const {W,pool}=words();const id=S.order[S.at];const four=!!(window.RikiProgress&&window.RikiProgress.mastered&&window.RikiProgress.mastered(id));
  const opts=shuffle([id,...shuffle(pool.filter(x=>x!==id)).slice(0,four?3:2)]);let first=true;
  const p=panel(`<div class="prompt cm-q"><div class="eyebrow">Unlock your prize! What does it mean?</div><div class="hebrew" lang="he">${esc(W[id][0])}</div></div><div class="cm-answers${four?' four':''}">${opts.map((o,i)=>`<button type="button" class="cm-ans c${i}" data-choice="${o}">${esc(W[o][1])}</button>`).join('')}</div><p class="cm-hint" id="cmHint" hidden></p>`);
  p.querySelectorAll('.cm-ans').forEach(b=>b.onclick=()=>{if(b.disabled)return;const pick=+b.dataset.choice;
    if(pick!==id){first=false;b.disabled=true;b.classList.add('bad');try{const inc=G('incorrect');inc&&inc();}catch(_){}const h=document.getElementById('cmHint');if(h){h.hidden=false;h.textContent='💡 '+(W[id][2]||'Try another one!');}return;}
    p.querySelectorAll('.cm-ans').forEach(x=>x.disabled=true);b.classList.add('good');try{const cor=G('correct');cor&&cor(first?3:1);}catch(_){}S.score+=first?3:1;S.at++;window.__cmSession.at=S.at;window.__cmSession.score=S.score;burst(16);
    setTimeout(()=>{if(!clawActive(run))return;if(S.at>=ROUNDS)coinPhase();else showGrab();},900);});
  if(window.RikiFit)setTimeout(window.RikiFit,60);
}
/* ---------------- golden Claw Coin + mystery prize ---------------- */
let coinMesh=null;
function coinPhase(){if(!clawActive())return;const run=S;dots();clearPrize();window.__cmSession.done=true;banner('<b>🌟 8 roots! You earned a golden Claw Coin!</b>','gold');burst(40);try{const a=G('audio');a&&a('win');const c=G('celebrate');c&&c();}catch(_){}
  coinMesh=new THREE.Group();const cy=CY(coinMesh,.22,.22,.05,metalM('#f2c94c'),0,0,0,40);cy.rotation.x=Math.PI/2;ext(coinMesh,starShape(.1),.02,glow('#fff3a8',.8),0,0,.03,.01);coinMesh.position.set(0,1.15,1.6);scene.add(coinMesh);
  const spin=()=>{if(!coinMesh)return;coinMesh.rotation.y+=.05;requestAnimationFrame(spin);};spin();
  panel(`<button type="button" class="cm-big cm-coin" id="cmInsert">🪙 INSERT COIN</button>`);document.getElementById('cmInsert').onclick=async e=>{e.currentTarget.disabled=true;banner('');const c=coinMesh;const from=c.position.clone(),to=new THREE.Vector3(.42,.58,.66);
    await tween(900,p=>{const k=ease(p);c.position.lerpVectors(from,to,k);c.position.y+=Math.sin(p*Math.PI)*.4;c.scale.setScalar(1-.55*k);});if(!clawActive(run))return;scene.remove(c);coinMesh=null;beep(660);beep(990,.2);
    M.sign.material=glow('#ffd25e',1.2);camShake=.04;panel(`<button type="button" class="cm-big cm-mystery" id="cmMystery">🎁 PRESS FOR MYSTERY PRIZE!</button>`);document.getElementById('cmMystery').onclick=mystery;};}
function giveItem(){let owned=G('owned');if(!Array.isArray(owned)){try{owned=JSON.parse(localStorage.getItem('rickyHouseInventoryV1')||'[]');}catch(e){owned=null;}}if(!Array.isArray(owned))return {err:true};
  const left=MINI.filter(m=>!owned.includes(m[0]));if(!left.length)return {all:true};const m=left[Math.floor(Math.random()*left.length)];owned.push(m[0]);
  try{const sv=G('saveHouse');if(typeof sv==='function')sv();else localStorage.setItem('rickyHouseInventoryV1',JSON.stringify(owned));}catch(e){}
  let ok=false;try{ok=JSON.parse(localStorage.getItem('rickyHouseInventoryV1')||'[]').includes(m[0]);}catch(e){}if(!ok){owned.splice(owned.indexOf(m[0]),1);return {err:true};}return {item:m};}
async function mystery(e){e.currentTarget.disabled=true;e.currentTarget.textContent='✨ Here it comes…';
  for(let i=0;i<3;i++){camShake=.06;beep(400+i*150);await tween(260,()=>{});}
  const res=giveItem();
  M.flap.rotation.x=0;tween(500,p=>{M.flap.rotation.x=-Math.sin(p*Math.PI)*1.1;});
  const box=new THREE.Group();RB(box,.36,.3,.36,.03,gloss('#e2457a'),0,0,0);BX(box,.38,.31,.06,gloss('#ffd25e'),0,0,0);BX(box,.06,.31,.38,gloss('#ffd25e'),0,0,0);const lid=new THREE.Group();lid.position.y=.17;box.add(lid);RB(lid,.4,.08,.4,.03,gloss('#e2457a'),0,0,0);SP(lid,.07,gloss('#ffd25e'),0,.07,0);
  scene.add(box);box.position.set(-.5,.3,.75);box.scale.setScalar(.3);
  await tween(700,p=>{const k=1-Math.pow(1-p,3);box.position.set(-.5+.5*k,.3+.6*k+Math.sin(p*Math.PI)*.4,.75+.85*k);box.scale.setScalar(.3+.7*k);box.rotation.y=p*Math.PI*2;});
  beep(880,.2);await tween(450,p=>{lid.position.y=.17+p*.6;lid.rotation.z=p*1.2;lid.position.x=p*.3;});burst(46);
  let html,again=true;
  if(res.item){const g=new THREE.Group();try{res.item[6](g);}catch(_){}g.traverse(o=>{if(o.isMesh)o.castShadow=true;});const bx=new THREE.Box3().setFromObject(g),sz=bx.getSize(new THREE.Vector3());g.scale.setScalar(.6/Math.max(sz.x,sz.y,sz.z,.01));scene.add(g);g.position.set(0,1.05,1.65);
    await tween(600,p=>{g.position.y=1.05+p*.25;g.rotation.y=p*Math.PI*2;});g.userData.baseY=g.position.y;showPrize=g;scene.remove(box);
    html=`<b>🎉 NEW for your dollhouse: ${esc(res.item[2])}!</b><span>It's waiting in your house collection.</span>`;try{const a=G('audio');a&&a('win');}catch(_){}
  }else if(res.all){html='<b>🏆 You own every mystery prize!</b><span>Here are 10 bonus coins instead.</span>';try{const aw=G('award');aw&&aw(10);}catch(_){}}
  else{html='<b>Oops, the prize got stuck.</b><span>Nothing was used. Try the button again.</span>';again=false;}
  banner(html,'gold');
  if(!again){panel(`<button type="button" class="cm-big cm-mystery" id="cmMystery">🎁 TRY AGAIN</button>`);document.getElementById('cmMystery').onclick=mystery;return;}
  panel(`<div class="cm-end"><button type="button" class="cm-big cm-house" id="cmHouse">🏠 Put it in my house</button><button type="button" class="cm-small" id="cmAgain">🕹️ Play again</button></div>`);
  document.getElementById('cmHouse').onclick=()=>{const h=G('houseHome');h&&h();window.scrollTo(0,0);};document.getElementById('cmAgain').onclick=()=>{start();};
}

/* ---------------- take over the Claw Machine card (before 13-game.js's handler) ---------------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-extra="claw"],#hubToday');if(!b)return;
  if(b.id==='hubToday'&&!/Claw/i.test(b.textContent))return;
  if(!webgl())return;e.stopImmediatePropagation();e.preventDefault();try{const a=G('audio');a&&a('tap');}catch(_){}start();window.scrollTo(0,0);
},true);
window.RikiClaw={start,plush:PLUSH,mini:MINI,buildPlush};
})();


/* Articulated furniture: real interiors, sliding drawers, hinged doors and shelf positions. */
(function(){
const K=window.RK3;if(!K)return;
const {RB,BX,SP,CY,mat}=K;
const G=n=>{try{return (0,eval)(n);}catch(_){}};
const MINI_FRIDGES=/^(clayfridge|minifridge|heartfridge)$/;
const HEART_KITCHEN='heartkitchencabinet';
const isStorage=id=>id===HEART_KITCHEN||MINI_FRIDGES.test(id)||/^(fridge|shelf|dresser|vanity)|^(wardrobe|cupboard|tvcabinet|nightstand|desk|bathcabinet|bookshelfplay|toybox|rainbowcubbies|blushtoybox)$/.test(id);
function profile(id){
 if(id===HEART_KITCHEN)return {kind:'kitchenSink',w:1.85,h:1.23,d:.72,rows:3,cols:3};
 if(MINI_FRIDGES.test(id))return {kind:'fridge',w:.66,h:.92,d:.54,rows:3,cols:3};
 if(/^fridge/.test(id))return {kind:'fridge',w:.78,h:1.75,d:.66,rows:3,cols:3};
 if(/^dresser|^nightstand/.test(id))return {kind:'drawers',w:id==='nightstand'?.5:.9,h:id==='nightstand'?.6:.95,d:.52,rows:id==='nightstand'?2:3,cols:id==='nightstand'?2:3};
 if(/^vanity|^desk$/.test(id))return {kind:'vanity',w:1,h:1.65,d:.5,rows:2,cols:2};
 if(id==='shelfpineapple')return {kind:'cabinet',w:.9,h:1.4,d:.55,rows:3,cols:3};
 if(id==='toybox'||id==='blushtoybox')return {kind:'chest',w:1.05,h:.55,d:.6,rows:1,cols:3};
 if(id==='bathcabinet')return {kind:'cabinet',w:.85,h:1.1,d:.48,rows:3,cols:3};
 if(id==='wardrobe')return {kind:'cabinet',w:1.05,h:1.8,d:.6,rows:3,cols:3};
 if(id==='cupboard')return {kind:'cabinet',w:1.2,h:1.6,d:.55,rows:3,cols:3};
 if(id==='tvcabinet')return {kind:'cabinet',w:1.3,h:.65,d:.5,rows:2,cols:3};
 return {kind:'shelf',w:1.1,h:1.5,d:.4,rows:3,cols:3};
}
function color(id){return /mint|retro/.test(id)?'#a8d8c6':/gold/.test(id)?'#f2daa0':/cloud|pearl|wood/.test(id)?'#f8eddd':/moon|star/.test(id)?'#d3c5e9':'#f2c3d1';}
function tagPart(group,index,parts,kind,closed,opened){group.userData.storagePart=index;parts.push({group,kind,closed,opened,target:closed});}
function slot(state,parent,x,y,z,part=-1){const pad=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.009,24),new THREE.MeshBasicMaterial({color:0xe9bf72,transparent:true,opacity:0,depthWrite:false}));pad.position.set(x,y+.006,z);pad.userData.storageSlot=state.slots.length;pad.visible=false;parent.add(pad);const target=new THREE.Mesh(new THREE.SphereGeometry(.105,12,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));target.position.set(x,y+.08,z);target.userData.storageSlot=state.slots.length;target.visible=false;parent.add(target);state.slots.push({target,parent,position:new THREE.Vector3(x,y,z),pad,part,content:null,item:null});return state.slots[state.slots.length-1];}
function caseShell(g,w,h,d,c,y=0){const m=mat(c,.9),inner=mat('#fff5e7',.94);RB(g,w,h,.055,.02,m,0,y+h/2,-d/2+.025);[-1,1].forEach(k=>RB(g,.055,h,d,.02,m,k*(w/2-.025),y+h/2,0));[0,h].forEach(v=>RB(g,w,.055,d,.02,m,0,y+v,0));return inner;}
function rows(state,parent,w,d,ys,part=-1,cx=0){ys.forEach(y=>{for(let col=0;col<state.profile.cols;col++)slot(state,parent,cx+(col-(state.profile.cols-1)/2)*(w/state.profile.cols),y,d*.12,part).spaceW=w/state.profile.cols-.02;});}
function drawerUnit(g,state,w,h,d,n,c,x=0,y=0,cols=state.profile.cols){
 caseShell(g,w,h,d,c,y);const dh=h/n;
 for(let i=0;i<n;i++){
  const part=new THREE.Group();part.position.set(x,y+i*dh,0);g.add(part);const index=state.parts.length;
  const m=mat(c,.88),inner=mat('#f8e5ce',.92);
  RB(part,w-.05,dh-.025,.045,.015,m,0,dh/2,d/2+.025);SP(part,.032,mat('#dec187',.8),0,dh/2,d/2+.065);
  RB(part,w-.11,.025,d-.08,.01,inner,0,.028,0);[-1,1].forEach(k=>RB(part,.025,dh-.06,d-.08,.009,inner,k*(w/2-.065),dh/2,0));
  tagPart(part,index,state.parts,'drawer',0,d*.7);
  for(let col=0;col<cols;col++){const space=slot(state,part,(col-(cols-1)/2)*(w-.16)/cols,.046,.03,index);space.spaceW=(w-.16)/cols-.015;space.spaceH=dh-.08;}
 }
}
function doorUnit(g,state,w,h,d,c,y=0){
 const inner=caseShell(g,w,h,d,c,y);const rowH=h/state.profile.rows;
 for(let i=0;i<state.profile.rows;i++){const sy=y+.07+i*rowH;if(i)RB(g,w-.1,.025,d-.08,.008,inner,0,sy-.025,0);rows(state,g,w-.13,d,[sy]);}
 [-1,1].forEach(side=>{const hinge=new THREE.Group();hinge.position.set(side*w/2,y,d/2+.035);g.add(hinge);const index=state.parts.length;const center=-side*w/4;
 RB(hinge,w/2-.015,h-.035,.05,.018,mat(c,.86),center,h/2,0);SP(hinge,.032,mat('#dec187',.8),-side*(w/2-.07),h*.52,.05);tagPart(hinge,index,state.parts,'door',0,side*Math.PI*.56);
 });
}
function disposeContents(o){o.traverse(n=>{if(n.geometry&&!n.geometry.userData.rikiShared)n.geometry.dispose();});}
K.releaseStorageModel=disposeContents;
K.storageProfile=id=>isStorage(id)?profile(id):null;
K.prepareStorage=function(g,it){
 const id=it[0];if(!isStorage(id)||g.userData.storage)return;
 const p=profile(id),state={profile:p,parts:[],slots:[],id,focused:false};g.userData.storage=state;
 if(p.kind==='kitchenSink'){
  // Photo-inspired polymer-clay main kitchen sink: cream countertop, inset sink,
  // faucet, two swing doors and two pull-out utensil drawers.
  // Parts stay functional in the actual room editor and in shop thumbnails.
  for(const child of [...g.children])g.remove(child);
  const P=mat('#e6a1bc',.87),front=mat('#f8d4df',.88),
        inset=mat('#ffeaf0',.87),rim=mat('#fff0e6',.9),
        brass=mat('#d8ae8a',.78),bowl=mat('#b8d8dc',.79),
        inside=mat('#fae8e2',.93);
  const w=p.w,d=p.d;
  // Hollow, reachable storage body, back wall, bottom and separator.
  RB(g,w,.88,.055,.025,P,0,.52,-d/2+.02);
  [-1,1].forEach(side=>RB(g,.055,.92,d,.022,P,side*(w/2-.025),.53,0));
  RB(g,w,.06,d,.022,P,0,.10,0);
  RB(g,w,.035,d-.06,.012,inside,0,.47,-.015);
  RB(g,w,.07,.055,.022,P,0,.79,-d/2+.02);
  RB(g,.052,.76,d-.08,.014,P,0,.49,0);
  // Two bottom doors, which swing independently from rounded side hinges.
  [-1,1].forEach(side=>{
   const pivot=new THREE.Group();pivot.position.set(side*w/2,.16,d/2+.033);g.add(pivot);
   const cx=-side*w/4,dc=w/2-.042;
   RB(pivot,dc,.62,.052,.028,P,cx,.33,0);
   RB(pivot,dc-.10,.51,.013,.02,front,cx,.33,.032);
   RB(pivot,dc-.20,.41,.011,.02,inset,cx,.33,.043);
   const knobX=-side*(w/2-.11),knobY=.37;
   SP(pivot,.045,mat('#e28dac',.85),knobX-.027,knobY+.018,.076,.85,.8,.45);
   SP(pivot,.045,mat('#e28dac',.85),knobX+.027,knobY+.018,.076,.85,.8,.45);
   const heart=RB(pivot,.072,.072,.028,.015,mat('#df82a5',.88),knobX,knobY-.021,.075);
   heart.rotation.z=Math.PI/4;
   tagPart(pivot,state.parts.length,state.parts,'door',0,side*Math.PI*.56);
  });
  // One lower-cupboard shelf: three positions under the sink.
  [-1,0,1].forEach(n=>{
   const slotItem=slot(state,g,n*.49,.23,.07,-1);
   slotItem.spaceW=.37;slotItem.spaceH=.22;
  });
  // Two sliding drawers: six more separate saved positions (9 total).
  [-1,1].forEach(side=>{
   const drawer=new THREE.Group();drawer.position.set(side*w/4,.83,0);g.add(drawer);
   const idx=state.parts.length,bw=w/2-.078;
   RB(drawer,bw,.24,.055,.025,P,0,.06,d/2+.056);
   RB(drawer,bw-.085,.16,.014,.017,front,0,.06,d/2+.087);
   RB(drawer,bw-.18,.045,.055,.015,brass,0,.065,d/2+.111);
   RB(drawer,bw-.055,.027,d-.11,.012,inside,0,-.06,.0);
   [-1,1].forEach(side2=>RB(drawer,.025,.18,d-.11,.01,inside,side2*(bw/2-.025),.015,0));
   tagPart(drawer,idx,state.parts,'drawer',0,.47);
   [-1,0,1].forEach(n=>{
    const slotItem=slot(state,drawer,n*bw/3,-.035,-.10,idx);
    slotItem.spaceW=bw/3-.035;slotItem.spaceH=.17;
   });
  });
  // Sculpted countertop above the working cabinets.
  RB(g,w+.12,.105,d+.12,.045,rim,0,1.16,0);
  // Inset pale mint sink on left, outlined with thick cream clay.
  RB(g,.77,.025,.49,.055,brass,-.43,1.225,-.02);
  RB(g,.69,.023,.42,.048,bowl,-.43,1.232,-.02);
  RB(g,.54,.01,.27,.034,mat('#8bb4bd',.88),-.43,1.237,-.02);
  CY(g,.035,.035,.30,brass,-.43,1.39,-.24,14);
  CY(g,.037,.037,.35,brass,-.43,1.53,-.10,14).rotation.x=Math.PI/2;
  CY(g,.027,.027,.105,brass,-.43,1.48,.035,14);
  [-.65,-.20].forEach(x=>SP(g,.045,front,x,1.24,-.23,1,.4,1));
  // Small decorative heart embossed on the right counter lip.
  SP(g,.06,front,.47,1.23,.32,1.15,.35,.65);
 }else if(p.kind==='fridge'){
  let door=g.userData.fridgeDoor;
  if(!door&&MINI_FRIDGES.test(id)){
   // New clay mini-fridges were decorative only: give them actual hinged doors.
   // Existing inventory, food slots and saved-data formats are unchanged.
   for(const child of [...g.children])g.remove(child);
   const pink=id==='heartfridge'?'#fff2eb':id==='clayfridge'?'#f1b6ca':'#f6cbd9';
   caseShell(g,p.w,p.h,p.d,pink);
   const shelf=mat('#fff5ec',.91);
   [.30,.59].forEach(y=>RB(g,p.w-.12,.023,p.d-.1,.012,shelf,0,y,0));
   door=new THREE.Group();door.position.set(-p.w/2,0,p.d/2+.04);g.add(door);
   const face=mat(id==='heartfridge'?'#f4a8c1':'#f9d8e4',.85);
   RB(door,p.w-.025,p.h-.035,.052,.045,face,p.w/2,p.h/2,0);
   RB(door,p.w-.13,p.h-.20,.012,.018,mat('#ffeaf1',.9),p.w/2,p.h/2,.031);
   const kx=p.w-.13,ky=p.h*.57,kz=.068,heart=mat('#e88cad',.82);
   const tip=RB(door,.075,.075,.025,.018,heart,kx,ky-.025,kz);
   tip.rotation.z=Math.PI/4;
   SP(door,.045,heart,kx-.027,ky+.015,kz,1,.8,.45);
   SP(door,.045,heart,kx+.027,ky+.015,kz,1,.8,.45);
   tagPart(door,0,state.parts,'door',0,-Math.PI*.57);
   g.userData.fridgeDoor=door;
  }else if(door)tagPart(door,0,state.parts,'door',0,Math.PI*.57);
  rows(state,g,p.w-.13,p.d-.10,MINI_FRIDGES.test(id)?[.10,.39,.68]:[.09,.51,.95]);
 }else if(p.kind==='shelf'){
  // Remove only the model's placeholder books; owned books are hydrated below.
  const remove=[];g.traverse(o=>{if(o.userData.stockBooks)remove.push(o);});remove.forEach(o=>o.parent.remove(o));
  let ys=[.07,.55,1.03],width=.9,cx=0,z=.02;
  if(id==='shelfmoon'){ys=[.53,.98,1.43];width=.45;cx=-.15;z=.34;ys.forEach(y=>BX(g,.54,.025,.35,mat('#e4cde1',.9),-.15,y-.025,.29));}
  if(id==='shelfhouse'){g.children.filter(o=>o.geometry&&o.geometry.type==='SphereGeometry'&&o.position.y<.3).forEach(o=>g.remove(o));ys=[.06,.35,.65];width=.8;BX(g,.87,.025,.32,mat('#f4dec7',.9),0,.32,0);}
  if(id==='shelfrainbow'){ys=[.13,.4,.67];width=.68;z=.43;ys.forEach(y=>BX(g,.78,.025,.34,mat('#f4dec7',.9),0,y-.025,.38));}
  if(id==='shelfcastle'){ys=[.43,.93,1.43];width=.46;z=.43;BX(g,.56,.025,.12,mat('#f4dec7',.9),0,1.4,.4);}
  if(id==='shelfladder'){ys=[.32,.77,1.22];width=.72;z=.25;ys.forEach(y=>BX(g,.82,.025,.45,mat('#f4dec7',.9),0,y-.025,.1));}
  if(id==='shelftree'){[ [.42,.49],[.62,-.35],[1.02,.35] ].forEach(([y,x])=>{for(let col=0;col<3;col++)slot(state,g,x+(col-1)*.15,y,.04).spaceW=.13;});}
  else ys.forEach(y=>{for(let col=0;col<3;col++)slot(state,g,cx+(col-1)*width/3,y,z).spaceW=width/3-.02;});
 }else{
  // Retain each item's color and recognizable ornament, with a hollow usable body.
  const old=[...g.children];old.forEach(o=>g.remove(o));const c=color(id);
  if(p.kind==='chest'){caseShell(g,p.w,p.h,p.d,c);const top=g.children.find(o=>o.position.y===p.h);if(top)g.remove(top);const lid=new THREE.Group();lid.position.set(0,p.h,-p.d/2);g.add(lid);RB(lid,p.w,.055,p.d,.02,mat(c,.88),0,0,p.d/2);SP(lid,.035,mat('#dec187',.8),0,-.02,p.d);tagPart(lid,0,state.parts,'lid',0,-Math.PI*.6);rows(state,g,p.w-.13,p.d,[.06]);}
  else if(p.kind==='drawers')drawerUnit(g,state,p.w,p.h,p.d,p.rows,c);
  else if(p.kind==='vanity'){
   const cabinet=new THREE.Group();cabinet.position.x=-.26;g.add(cabinet);drawerUnit(cabinet,state,.44,.7,.45,2,c,0,0,2);
   RB(g,1,.07,.52,.025,mat(c,.9),0,.75,0);CY(g,.025,.035,.72,mat('#dec187',.9),.43,.36,.14,12);CY(g,.025,.035,.72,mat('#dec187',.9),.43,.36,-.14,12);
   SP(g,.34,mat('#dec187',.8),0,1.17,-.18,1,1.2,.13);SP(g,.3,mat('#dfedf0',.07,.4),0,1.17,-.12,1,1.2,.05);
  }else doorUnit(g,state,p.w,p.h,p.d,c);
  if(id==='tvcabinet'){RB(g,.85,.55,.08,.04,mat('#524351',.85),0,.98,-.04);RB(g,.74,.43,.015,.025,mat('#b9d6dc',.2),0,.98,.012);}
  if(id==='shelfpineapple')for(let i=0;i<5;i++){const leaf=SP(g,.16,mat('#96c49a',.9),(i-2)*.07,p.h+.2,0,.35,1.5,.7);leaf.rotation.z=(i-2)*.25;}
  if(id==='wardrobe')SP(g,.16,mat('#f8dfba',.9),0,p.h+.1,0,2.5,.5,.8);
 }
};
K.animateStorage=function(g){const s=g.userData.storage;if(!s)return;for(const p of s.parts){const key=p.kind==='drawer'?'position':'rotation',axis=p.kind==='drawer'?'z':p.kind==='lid'?'x':'y';p.group[key][axis]+=(p.target-p.group[key][axis])*.18;}for(const slot of s.slots){const part=s.parts[slot.part];slot.pad.visible=s.focused&&(!part||Math.abs(part.target-part.closed)>.01);slot.target.visible=slot.pad.visible;}};
K.toggleStoragePart=function(g,index){const s=g.userData.storage,p=s&&s.parts[index];if(!p)return false;
 const open=Math.abs(p.target-p.closed)<.01;
 if(p.kind==='drawer')s.parts.filter(x=>x.kind==='drawer').forEach(x=>x.target=x.closed);
 p.target=open?p.opened:p.closed;return true;
};
K.setStorageOpen=function(g,on){const s=g.userData.storage;if(!s)return;s.focused=on;s.parts.forEach((p,i)=>p.target=on&&(p.kind!=='drawer'||i===0)?p.opened:p.closed);s.slots.forEach(x=>{x.pad.visible=on&&(x.part<0||x.part===0);x.target.visible=x.pad.visible;});};
K.hydrateStorage=function(g,room){const s=g.userData.storage;if(!s)return;const contents=(G('dreamStorage')||{})[room+':'+s.id]||[];
 s.slots.forEach((slot,i)=>{const id=contents[i];if(slot.item===id)return;if(slot.content){slot.parent.remove(slot.content);disposeContents(slot.content);slot.content=null;}slot.item=id;
  const it=(G('ITEMS')||[]).find(x=>x[0]===id);if(!it||isStorage(id))return;
  const content=K.makeItem(it);content.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(content),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const factor=Math.min((slot.spaceW||.22)/Math.max(size.x,.01),(slot.spaceH||.26)/Math.max(size.y,.01),.22/Math.max(size.z,.01));content.scale.setScalar(factor);content.position.copy(slot.position);content.position.x-=center.x*factor;content.position.y-=box.min.y*factor;content.position.z-=center.z*factor;
  content.userData.storedSlot=i;slot.parent.add(content);slot.content=content;
 });
};
})();

/* Interactive fridge: existing item IDs and room:item storage arrays remain compatible. */
(function(){
const G=n=>{try{return (0,eval)(n);}catch(_){return undefined;}};
const SET=s=>{try{(0,eval)(s);}catch(_){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const K=window.RK3;
const groceries=[
 ['milkcarton','🥛','Milk carton',8,'kitchen','Fridge Food'],
 ['eggcarton','🥚','Box of eggs',9,'kitchen','Fridge Food'],
 ['applesbasket','🍎','Basket of apples',10,'kitchen','Fridge Food'],
 ['cheeseplate','🧀','Cheese plate',8,'kitchen','Fridge Food'],
 ['juicebottle','🧃','Orange juice bottle',8,'kitchen','Fridge Food']
];
const items=G('ITEMS')||[];
groceries.forEach(it=>{if(!items.some(x=>x[0]===it[0]))items.push(it);});
const foodIds=new Set([...groceries.map(x=>x[0]),'cupcake','cakeplate','cake','birthdaycake','partycake','fruitbowl','waffles','donuttower','icecreamtower','breadbasket','strawberryjam','macaronplate','clawgroceries']);
const isFridge=id=>/^(fridge|fridgeretro|clayfridge|minifridge|heartfridge)$/.test(id);
const isFood=id=>foodIds.has(id);
const isOwned=id=>(G('owned')||[]).includes(id);
const isPlaced=(id,room)=>Object.values((G('decor')||{})[room]||{}).includes(id);
const storageType=id=>id==='heartkitchencabinet'||/^(fridge|shelf|dresser|vanity)|^(clayfridge|heartfridge|minifridge|wardrobe|cupboard|tvcabinet|nightstand|desk|bathcabinet|bookshelfplay|toybox|rainbowcubbies|blushtoybox)$/.test(id);
const usable=(id,room)=>storageType(id)&&isOwned(id)&&isPlaced(id,room);
const capacityFor=id=>{const p=K&&K.storageProfile?K.storageProfile(id):null;return p?p.rows*p.cols:9;};
const isSmall=item=>{const it=items.find(x=>x[0]===item),fn=G('itemType');return !!(it&&typeof fn==='function'&&['Toys','Miniatures','Claw prizes','Fridge Food'].includes(fn(it)));};
const kitchenItem=id=>{
 const it=items.find(x=>x[0]===id);if(!it||storageType(id))return false;
 const meta=window.RikiCatalog?.meta?.[id];
 const category=meta?.category||(typeof G('itemType')==='function'?G('itemType')(it):'');
 return ['Food & drinks','Treats','Fridge Food','Tableware','Kitchen miniatures'].includes(category)
     ||['spicerack','utensilcrock','cookiejar','heartteapot','claybowl','clayplate','claycup','clayjar','claytray','teacups','milkcarton','eggcarton','fruitbowl','applesbasket','breadbasket','strawberryjam'].includes(id);
};
const eligible=(id,item)=>id==='heartkitchencabinet'?kitchenItem(item):isFridge(id)?isFood(item):storageType(id)&&!storageType(item)&&(isFood(item)||isSmall(item)||['soap','towels','toothbrush','rubberduck','doll','blocks','puzzle','crafts','puppet','trainset'].includes(item)||(G('SMALL_IDS')||[]).includes(item)||/^(claw|mini|book|perfume|makeup|jewel|trophy|teacup|plantmini)/.test(item));
function contents(id,room){const a=(G('dreamStorage')||{})[room+':'+id];return Array.isArray(a)?a:[];}
function storeItem(id,room,food,slot){
 if(!usable(id,room)||!eligible(id,food)||!isOwned(food)||!items.some(x=>x[0]===food)||!Number.isInteger(slot)||slot<0||slot>=capacityFor(id))return false;
 const storage=G('dreamStorage');if(!storage)return false;
 const arr=contents(id,room),origin=arr.indexOf(food),occupant=arr[slot];
 if(occupant===food)return true;
 if(occupant){if(origin<0||!isOwned(occupant)||!eligible(id,occupant))return false;arr[origin]=occupant;arr[slot]=food;const save=G('dreamSave');if(save)save();return true;}
 // Move this owned item; do not duplicate it or replace occupied shelves.
 for(const arr of Object.values(storage))if(Array.isArray(arr))arr.forEach((x,i)=>{if(x===food)delete arr[i];});
 const key=room+':'+id;if(!Array.isArray(storage[key]))storage[key]=[];
 storage[key][slot]=food;const save=G('dreamSave');if(save)save();return true;
}
function takeItem(id,room,slot){
 if(!usable(id,room)||!Number.isInteger(slot)||slot<0||slot>=capacityFor(id))return false;
 const arr=contents(id,room);if(!arr[slot])return false;
 delete arr[slot];const save=G('dreamSave');if(save)save();return true;
}
const previousStorage=G('isStorage');
window.__rkIsStorage=id=>storageType(id)||(typeof previousStorage==='function'&&previousStorage(id));
SET('isStorage=window.__rkIsStorage;');
const previousType=G('itemType');
window.__rkFridgeType=it=>isFridge(it[0])?'Fridges':isFood(it[0])?'Fridge Food':it[0]==='tea'?'Tables':previousType(it);
SET('itemType=window.__rkFridgeType;');
const categories=G('CATEGORIES');
if(categories){categories.kitchen=[...new Set(['Fridges',...(categories.kitchen||[]),'Fridge Food'])];}
/* An existing category lock only recognized the basic fridge. Allow either fridge. */
const previousShop=G('shopHtml');
window.__rkFridgeShop=function(){
 let html=previousShop.apply(this,arguments);
 if(isOwned('fridgeretro')&&!isOwned('fridge'))html=html.replace('disabled aria-label="Fridge Food unlocks after buying a fridge"','').replace('🔒 Fridge Food','Fridge Food').replace(/<p class="house-help">🧊 Buy a fridge[^<]*<\/p>/,'');
 return html;
};
SET('shopHtml=window.__rkFridgeShop;');
if(K){
 const {RB,CY,SP,CO,mat}=K;
 K.MODEL.milkcarton=g=>{const white=mat('#fff8e9',.85),mint=mat('#9ed9c2',.85);RB(g,.42,.62,.33,.035,white,0,.34,0);const roof=RB(g,.42,.17,.33,.025,mint,0,.72,0);roof.rotation.z=.12;RB(g,.32,.2,.015,.015,mint,0,.34,.175);SP(g,.05,white,.07,.74,.11);};
 K.MODEL.eggcarton=g=>{RB(g,.65,.12,.42,.04,mat('#d5b59c',.9),0,.08,0);for(let i=0;i<6;i++)SP(g,.09,mat(i%2?'#fff1db':'#e9cba8',.9),(i%3-1)*.19,.19,(i<3?-.1:.1),.8,1.2,.8);};
 K.MODEL.applesbasket=g=>{CY(g,.27,.21,.2,mat('#d4aa7e',.9),0,.12,0,24);[[-.1,.25,.04],[.1,.26,.03],[0,.3,-.1]].forEach(([x,y,z])=>{SP(g,.12,mat('#ed8d91',.85),x,y,z);CY(g,.008,.008,.065,mat('#906647',.9),x,y+.13,z,6);SP(g,.035,mat('#94c99b',.85),x+.035,y+.13,z,1.4,.35,.7);});};
 K.MODEL.cheeseplate=g=>{CY(g,.3,.29,.035,mat('#fff8ed',.9),0,.03,0,32);const shape=new THREE.Shape();shape.moveTo(-.2,-.16);shape.lineTo(.21,-.16);shape.lineTo(-.2,.18);shape.closePath();const c=K.ext(g,shape,.12,mat('#f2cf7d',.85),0,.13,0,.02);c.rotation.x=-Math.PI/2;[[-.08,-.02],[.01,.09]].forEach(([x,z])=>SP(g,.025,mat('#d9b45f',.9),x,.21,z,1,.15,1));};
 K.MODEL.juicebottle=g=>{CY(g,.14,.15,.45,mat('#ffc38a',.85),0,.25,0,24);CY(g,.08,.11,.12,mat('#ffd7aa',.85),0,.53,0,20);CY(g,.09,.09,.06,mat('#99cdb0',.85),0,.62,0,20);RB(g,.2,.17,.018,.025,mat('#fff7e5',.9),0,.28,.145);SP(g,.055,mat('#eeb271',.85),0,.28,.16,1,1,.18);};
}
/* Correct grocery silhouettes remain available when 3D cannot load. */
function grocerySvg(it){
 const id=it[0],cream='#fff4dd',mint='#9ed9c2',peach='#ffc38a';
 const drawings={
 milkcarton:`<path d="M36 35L48 19H88L102 35V112H36Z" fill="${cream}" stroke="#dfd0ba" stroke-width="3"/><path d="M36 35H102L88 19H48Z" fill="${mint}"/><rect x="44" y="58" width="49" height="33" rx="6" fill="${mint}"/><circle cx="88" cy="30" r="6" fill="#fffaf1"/>`,
 eggcarton:'<rect x="16" y="61" width="108" height="43" rx="12" fill="#d5b59c"/>'+[32,69,106].map(x=>`<ellipse cx="${x}" cy="64" rx="14" ry="23" fill="#fff1db" stroke="#dfc6a6" stroke-width="2"/>`).join(''),
 applesbasket:'<path d="M24 66H116L104 114H36Z" fill="#d4aa7e"/>'+[[45,60],[90,59],[68,44]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="20" fill="#ed8d91"/><path d="M${x} ${y-17}v-10" stroke="#906647" stroke-width="4"/><ellipse cx="${x+8}" cy="${y-25}" rx="10" ry="5" fill="#94c99b"/>`).join(''),
 cheeseplate:'<ellipse cx="70" cy="105" rx="57" ry="14" fill="#fff4dd" stroke="#ddd1b8" stroke-width="3"/><path d="M32 90V56L103 33V84Z" fill="#f2cf7d" stroke="#d9b45f" stroke-width="3"/><path d="M32 56L66 35L103 33" fill="#ffe6a0"/>'+[[48,69],[76,61],[86,78]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#d9b45f"/>`).join(''),
 juicebottle:`<path d="M51 30H89V43Q105 49 105 65V110H35V65Q35 49 51 43Z" fill="${peach}" stroke="#e4ab77" stroke-width="3"/><rect x="49" y="16" width="42" height="18" rx="5" fill="${mint}"/><rect x="40" y="63" width="60" height="33" rx="6" fill="${cream}"/><circle cx="70" cy="79" r="11" fill="#eeb271"/>`
 };
 return `<svg class="furniture-svg" viewBox="0 0 140 140" role="img" aria-label="${esc(it[2])}"><ellipse cx="70" cy="120" rx="53" ry="9" fill="#71513a18"/>${drawings[id]||''}</svg>`;
}
for(const fn of ['furnitureArt','dreamFurnitureArt']){
 const previous=G(fn);if(typeof previous!=='function')continue;
 window['__rkGrocery_'+fn]=function(it){const html=previous.apply(this,arguments);if(!it||!groceries.some(x=>x[0]===it[0])||/rk3-thumb/.test(html))return html;return `<span class="rk3-art" data-rk3-id="${it[0]}">${grocerySvg(it)}</span>`;};
 SET(fn+'=window.__rkGrocery_'+fn+';');
}
/* Every supported storage item opens in its actual room, never in a separate dialog. */
function openStorage(id){return !!(K&&K.openStorage&&K.openStorage(id));}
const previousModal=G('storageModal');
window.__rkFridgeModal=function(id){return storageType(id)?openStorage(id):previousModal.apply(this,arguments);};
SET('storageModal=window.__rkFridgeModal;');
window.RikiFurnitureInteractions={isFridge,isFood,isStorage:storageType,isEligible:eligible,capacityFor,storeItem,takeItem,storeFood:storeItem,takeFood:takeItem,contents,openStorage,openFridge:openStorage};
})();

/* Complete clay catalog: recognizable bathroom/playroom models and a small new collection. */
(function(){
const K=window.RK3;if(!K)return;const {RB,BX,CY,SP,CO,add,mat,B,ext,heartShape}=K,M=K.MODEL;
const C={pink:'#efb8c9',mint:'#b5d9c8',cream:'#fff0d9',peach:'#f3c0a1',lilac:'#cfbfe3',gold:'#e5c889',green:'#91bb8d',white:'#fffaf0'};
const clay=c=>mat(c,.88),p=()=>clay(C.pink),mi=()=>clay(C.mint),cr=()=>clay(C.cream);
function torus(g,r,t,c,x,y,z,arc=Math.PI*2){return add(g,new THREE.TorusGeometry(r,t,10,32,arc),clay(c),x,y,z);}
function dish(g,r=.3,y=.025){CY(g,r,r,.035,cr(),0,y,0,32);}
function flower(g,x,y,z,r=.1){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;SP(g,r*.55,cr(),x+Math.cos(a)*r,y+Math.sin(a)*r,z,1,1,.35);}SP(g,r*.5,clay(C.gold),x,y,z+.015,1,1,.4);}
function plant(g,c=C.pink){CY(g,.17,.12,.22,clay(c),0,.12,0,24);CY(g,.14,.14,.015,clay('#8d7054'),0,.235,0,24);CY(g,.013,.016,.38,clay(C.green),0,.42,0,10);[-1,1].forEach(k=>{const leaf=SP(g,.12,clay(C.green),k*.09,.38+k*.05,0,1,.4,.6);leaf.rotation.z=k*.4;});flower(g,0,.64,0,.11);}
M.soap=g=>{CY(g,.14,.14,.31,mi(),0,.17,0,24);CY(g,.055,.055,.07,cr(),0,.36,0,16);RB(g,.2,.04,.05,.015,cr(),.055,.41,0);ext(g,heartShape(.06),.015,p(),0,.2,.145,.01);};
M.towels=g=>{[C.cream,C.mint,C.pink].forEach((c,i)=>{RB(g,.5,.09,.32,.04,clay(c),0,.06+i*.095,0);RB(g,.4,.012,.01,.005,clay('#e2c7ad'),0,.07+i*.095,.165);});};
M.toothbrush=g=>{CY(g,.13,.11,.24,p(),0,.13,0,24);for(let i=0;i<3;i++){const x=(i-1)*.065;CY(g,.012,.015,.37,clay([C.mint,C.lilac,C.peach][i]),x,.37,0,10);RB(g,.045,.095,.035,.013,cr(),x,.6,0);}};
M.hamper=g=>{CY(g,.28,.23,.55,clay('#dabba0'),0,.29,0,32);for(let i=0;i<5;i++){const ring=torus(g,.245+i*.006,.012,C.cream,0,.08+i*.1,0);ring.rotation.x=Math.PI/2;}SP(g,.2,p(),0,.58,0,1,.25,.75);[-1,1].forEach(k=>{const h=torus(g,.09,.018,C.cream,k*.27,.46,0,Math.PI);h.rotation.y=Math.PI/2;});};
M.bathplant=g=>plant(g,C.mint);M.shelf=g=>B.shelf(g,C.mint);
M.toybox=g=>{};M.bathcabinet=g=>{};M.bookshelfplay=g=>B.shelf(g,C.mint);
M.bathmat=g=>{RB(g,.9,.035,.6,.015,mi(),0,.025,0);for(let i=0;i<5;i++)for(let j=0;j<4;j++)SP(g,.047,mi(),(i-2)*.15,.055,(j-1.5)*.14,1,.35,1);};
M.bath=g=>{const wh=clay(C.white);RB(g,1.25,.18,.65,.08,p(),0,.18,0);[-.55,.55].forEach(x=>RB(g,.13,.44,.72,.06,wh,x,.4,0));[-.3,.3].forEach(z=>RB(g,1.12,.44,.12,.055,wh,0,.4,z));RB(g,.95,.04,.43,.02,clay('#c9e3df'),0,.3,0);CY(g,.025,.025,.35,clay(C.gold),.45,.73,-.2,12);CY(g,.025,.025,.18,clay(C.gold),.38,.9,-.2,12).rotation.z=Math.PI/2;[-.3,.1,.35].forEach((x,i)=>SP(g,.1,wh,x,.56,-.04+i*.04));};
M.toilet=g=>{RB(g,.4,.35,.25,.05,clay(C.white),0,.48,-.2);SP(g,.28,clay(C.white),0,.32,.08,.82,.6,1.1);SP(g,.2,clay('#c7dbd7'),0,.46,.1,.8,.15,1.1);const seat=torus(g,.2,.035,C.pink,0,.48,.1);seat.rotation.x=Math.PI/2;CY(g,.12,.18,.25,clay(C.white),0,.14,0,24);RB(g,.12,.025,.06,.01,clay(C.gold),0,.67,-.2);};
M.bathsink=g=>{CY(g,.12,.18,.55,mi(),0,.28,0,24);SP(g,.32,clay(C.white),0,.6,0,1,.35,.8);SP(g,.24,clay('#d1e6e0'),0,.67,.02,1,.1,.75);CY(g,.02,.025,.25,clay(C.gold),0,.8,-.2,12);CY(g,.02,.02,.18,clay(C.gold),0,.93,-.12,12).rotation.x=Math.PI/2;};
M.bathmirror=g=>{SP(g,.38,mi(),0,.5,0,1,1.2,.13);SP(g,.32,mat('#dfedf0',.07,.4),0,.5,.045,1,1.2,.05);};M.bathmirror.wall=true;
M.towelrack=g=>{CY(g,.025,.025,.72,clay(C.gold),0,.58,0,16).rotation.z=Math.PI/2;[-.34,.34].forEach(x=>CY(g,.02,.02,.55,clay(C.gold),x,.29,0,12));RB(g,.5,.38,.055,.025,p(),0,.39,.035);RB(g,.44,.025,.06,.012,cr(),0,.24,.045);};
M.rubberduck=g=>M.petduck(g);
M.shower=g=>{RB(g,.9,.08,.8,.035,cr(),0,.05,0);CY(g,.02,.02,1.65,clay(C.gold),-.3,.86,-.3,16);CY(g,.02,.02,.45,clay(C.gold),-.08,1.66,-.3,16).rotation.z=Math.PI/2;CY(g,.15,.15,.04,clay(C.gold),.12,1.63,-.3,24);RB(g,.035,1.45,.7,.014,mat('#d9eeee',.06,0,{transparent:true,opacity:.25}),.4,.8,0);[-.34,.34].forEach(z=>CY(g,.016,.016,1.5,mi(),.4,.8,z,12));};
M.puzzle=g=>{RB(g,.7,.045,.5,.018,cr(),0,.04,0);for(let i=0;i<6;i++){const x=(i%3-1)*.2,z=(Math.floor(i/3)-.5)*.22;RB(g,.18,.035,.19,.015,clay([C.pink,C.mint,C.gold,C.lilac,C.peach,C.mint][i]),x,.08,z);SP(g,.025,cr(),x,.105,z);}};
M.crafts=g=>{RB(g,.5,.25,.38,.06,clay(C.peach),0,.14,0);for(let i=0;i<4;i++){const x=(i-1.5)*.09;CY(g,.014,.014,.45,clay([C.mint,C.pink,C.lilac,C.gold][i]),x,.42,0,10);SP(g,.027,cr(),x,.66,0,.7,1.4,.7);}const h=torus(g,.21,.025,C.cream,0,.4,0,Math.PI);};
M.puppet=g=>{CO(g,.2,.38,p(),0,.2,0);SP(g,.16,cr(),0,.49,0);[-1,1].forEach(k=>{SP(g,.055,cr(),k*.075,.7,0,.7,2,1);SP(g,.018,clay('#5d4141'),k*.05,.51,.14);});SP(g,.023,p(),0,.47,.16);};
M.tents=g=>M.playtent(g);
M.marbles=g=>{RB(g,.65,.08,.5,.025,clay(C.peach),0,.06,0);for(let i=0;i<3;i++){const t=torus(g,.16-i*.04,.015,[C.mint,C.pink,C.lilac][i],0,.12,0,Math.PI*1.5);t.rotation.x=Math.PI/2;}[[-.19,.14],[.15,.12],[.05,-.13]].forEach(([x,z],i)=>SP(g,.04,clay([C.mint,C.pink,C.gold][i]),x,.15,z));};
M.playmat=g=>{for(let i=0;i<9;i++)RB(g,.29,.025,.29,.012,clay([C.pink,C.cream,C.mint,C.lilac][i%4]),(i%3-1)*.3,.02,(Math.floor(i/3)-1)*.3);};
M.doll=g=>{SP(g,.15,clay('#e8be9d'),0,.58,0);SP(g,.155,clay('#a97658'),0,.64,-.025,1,.65,1);CO(g,.19,.34,p(),0,.3,0);[-1,1].forEach(k=>{CY(g,.025,.025,.22,clay('#e8be9d'),k*.15,.36,0,10).rotation.z=k*.3;SP(g,.018,clay('#5d4141'),k*.05,.58,.14);SP(g,.04,mi(),k*.07,.06,.04,1,.6,1.5);});flower(g,0,.35,.12,.04);};
M.blocks=g=>{[[0,.12,0,C.mint],[-.22,.12,0,C.pink],[.22,.12,0,C.gold],[0,.36,0,C.lilac]].forEach(([x,y,z,c])=>RB(g,.21,.21,.21,.025,clay(c),x,y,z));};
M.rocker=g=>M.rockinghorse(g);M.trainset=g=>M.clawtrain(g);
M.arttable=g=>{B.table(g,C.mint);RB(g,.4,.012,.25,.006,cr(),0,.68,.02);for(let i=0;i<4;i++)CY(g,.03,.03,.035,clay([C.pink,C.mint,C.lilac,C.gold][i]),-.12+i*.08,.71,0,16);CY(g,.012,.012,.34,clay(C.peach),.1,.72,.15,8).rotation.z=Math.PI/2;};
M.dollhousemini=g=>{const c=clay(C.cream);RB(g,.8,.04,.4,.015,c,0,.04,0);RB(g,.8,.04,.4,.015,c,0,.4,0);[-.38,.38].forEach(x=>RB(g,.04,.75,.4,.015,p(),x,.4,0));RB(g,.8,.75,.035,.015,p(),0,.4,-.2);[-1,1].forEach(k=>{const roof=RB(g,.5,.04,.48,.015,clay(C.peach),k*.2,.88,0);roof.rotation.z=-k*.5;});RB(g,.24,.1,.2,.025,mi(),-.16,.13,0);RB(g,.28,.08,.22,.025,c,.14,.48,0);RB(g,.23,.04,.15,.015,p(),.14,.54,.02);};
M.dollstroller=g=>{const pink=clay('#f7a0bd'),cream=clay('#fff8f4'),wood=clay('#e8d4c0');
  // Basket body
  SP(g,.28,pink,0,.32,0,1.1,.55,.85);
  SP(g,.22,cream,0,.34,.02,1,.4,.7);
  // Canopy hood
  SP(g,.26,pink,0,.48,-.12,.95,.55,.55);
  SP(g,.2,cream,0,.5,-.1,.7,.4,.4);
  // Handle bar
  CY(g,.025,.025,.55,wood,0,.55,-.35,12).rotation.x=.35;
  CY(g,.03,.03,.4,wood,0,.72,-.45,12).rotation.z=Math.PI/2;
  // Four soft wheels
  [[-.32,-.12],[.32,-.12],[-.32,.18],[.32,.18]].forEach(([x,z])=>{
    CY(g,.09,.09,.05,wood,x,.09,z,20).rotation.z=Math.PI/2;
    CY(g,.04,.04,.02,clay('#d4c0a8'),x,.09,z,12).rotation.z=Math.PI/2;
  });
};
M.bunnylamp=g=>{CY(g,.24,.26,.045,mi(),0,.035,0,32);SP(g,.19,cr(),0,.27,0,1,1.1,1);[-1,1].forEach(k=>{SP(g,.06,cr(),k*.09,.52,0,.7,1.9,1);SP(g,.017,clay('#5d4141'),k*.065,.29,.17);});SP(g,.025,p(),0,.24,.19);};
M.strawberrypouf=g=>{SP(g,.38,clay('#e9a1ad'),0,.28,0,1,.75,1);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const leaf=SP(g,.12,clay(C.green),Math.cos(a)*.09,.55,Math.sin(a)*.09,1,.17,.5);leaf.rotation.y=-a;}for(let i=0;i<12;i++){const a=i/12*Math.PI*2;SP(g,.018,cr(),Math.cos(a)*.35,.29+(i%2)*.1,Math.sin(a)*.35,.6,1,.4);}};
M.cloudpetbed=g=>{CY(g,.4,.4,.09,mi(),0,.06,0,40);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;SP(g,.13,cr(),Math.cos(a)*.33,.17,Math.sin(a)*.33,1,.75,1);}SP(g,.28,p(),0,.14,0,1,.25,1);};
M.daisymirror=g=>{for(let i=0;i<10;i++){const a=i/10*Math.PI*2;SP(g,.12,cr(),Math.cos(a)*.3,.5+Math.sin(a)*.3,0,1,1,.4);}SP(g,.27,clay(C.gold),0,.5,0,1,1,.2);SP(g,.235,mat('#dfedf0',.07,.4),0,.5,.055,1,1,.06);};M.daisymirror.wall=true;
M.heartteapot=g=>{SP(g,.2,cr(),0,.24,0,1,.85,1);CY(g,.12,.13,.035,p(),0,.42,0,24);SP(g,.035,p(),0,.46,0);const handle=torus(g,.12,.025,C.pink,-.23,.27,0);handle.rotation.y=Math.PI/2;CY(g,.035,.07,.22,cr(),.23,.32,0,16).rotation.z=-.65;ext(g,heartShape(.065),.015,p(),0,.25,.195,.01);};
M.breadbasket=g=>{CY(g,.28,.23,.16,clay('#dbb58b'),0,.09,0,32);for(let i=0;i<3;i++){const b=SP(g,.1,clay('#efc88e'),(i-1)*.14,.22,0,.8,.8,1.7);b.rotation.y=.25;for(let k=0;k<3;k++)RB(g,.07,.012,.018,.006,cr(),(i-1)*.14,.295,-.08+k*.08);}};
M.strawberryjam=g=>{CY(g,.14,.14,.28,clay('#d892a2'),0,.16,0,24);CY(g,.16,.16,.055,p(),0,.32,0,24);RB(g,.16,.12,.015,.014,cr(),0,.17,.14);SP(g,.035,clay('#d892a2'),0,.17,.155,1,1,.2);};
M.macaronplate=g=>{dish(g,.33);[[-.14,.02,C.pink],[.12,.04,C.mint],[0,-.13,C.lilac]].forEach(([x,z,c])=>{CY(g,.085,.085,.035,clay(c),x,.065,z,24);CY(g,.08,.08,.018,cr(),x,.09,z,24);CY(g,.085,.085,.035,clay(c),x,.115,z,24);});};
M.minipaintset=g=>{SP(g,.22,cr(),0,.04,0,1,.15,.75);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;SP(g,.035,clay([C.pink,C.mint,C.lilac,C.gold,C.peach][i]),Math.cos(a)*.12,.075,Math.sin(a)*.09,1,.3,1);}CY(g,.01,.01,.4,clay(C.peach),.15,.07,0,10).rotation.z=Math.PI/2;};
M.daisyplanter=g=>plant(g,C.peach);M.rainbowcubbies=g=>B.shelf(g,C.mint);M.blushtoybox=g=>{};
})();

/* Curated shop: explicit room/category records, preserved purchases, and mobile browsing. */
(function(){
const G=n=>{try{return (0,eval)(n);}catch(_){}};const SET=s=>{try{(0,eval)(s);}catch(_){}};
const K=window.RK3,items=G('ITEMS');if(!K||!Array.isArray(items))return;
const META={"bed":{"room":"bedroom","category":"Beds"},"lamp":{"room":"living","category":"Seating","name":"Cozy blue sofa"},"chair":{"room":"living","category":"Seating"},"desk":{"room":"bedroom","category":"Vanities","name":"Cream vanity desk"},"plant":{"room":"living","category":"Plants"},"teddy":{"room":"bedroom","category":"Plushies"},"rug":{"room":"living","category":"Rugs"},"light":{"room":"living","category":"Lighting"},"picture":{"room":"living","category":"Decor"},"flowers":{"room":"living","category":"Plants"},"clock":{"room":"living","category":"Decor"},"cat":{"room":"pets","category":"Pets"},"unicorn":{"room":"bedroom","category":"Plushies"},"books":{"room":"miniatures","category":"Books & toys","name":"Pastel book stack"},"table":{"room":"living","category":"Tables"},"cake":{"room":"party","category":"Cakes & treats","name":"Birthday party cake"},"stove":{"room":"kitchen","category":"Appliances"},"fridge":{"room":"kitchen","category":"Fridges","name":"Cream refrigerator"},"tea":{"room":"kitchen","category":"Tables","name":"Tea-party table"},"cupcake":{"room":"kitchen","category":"Treats"},"tree":{"room":"garden","category":"Plants"},"swing":{"room":"garden","category":"Playground"},"butterfly":{"room":"garden","category":"Decor"},"flowers2":{"room":"garden","category":"Plants"},"rainbow":{"room":"garden","category":"Decor","name":"Garden rainbow arch"},"pool":{"room":"garden","category":"Playground"},"star":{"room":"bedroom","category":"Decor"},"bow":{"room":"bedroom","category":"Decor"},"crystal":{"room":"living","category":"Decor","retired":"Unclear magic prop"},"piano":{"room":"living","category":"Decor"},"tablepink":{"room":"kitchen","category":"Tables"},"tablewood":{"room":"kitchen","category":"Tables"},"tableglass":{"room":"kitchen","category":"Tables"},"tableheart":{"room":"kitchen","category":"Tables"},"chairpink":{"room":"kitchen","category":"Chairs"},"chairmint":{"room":"kitchen","category":"Chairs"},"chairgold":{"room":"kitchen","category":"Chairs"},"chairheart":{"room":"kitchen","category":"Chairs"},"bedcanopy":{"room":"bedroom","category":"Beds"},"bedcloud":{"room":"bedroom","category":"Beds"},"bedpink":{"room":"bedroom","category":"Beds"},"vanity":{"room":"bedroom","category":"Vanities"},"dresser":{"room":"bedroom","category":"Storage"},"sofabubble":{"room":"living","category":"Seating"},"sofamint":{"room":"living","category":"Seating"},"sofastar":{"room":"living","category":"Seating"},"coffeetable":{"room":"living","category":"Tables"},"birthdayballoons":{"room":"party","category":"Decorations"},"birthdaybanner":{"room":"party","category":"Decorations"},"birthdaygifts":{"room":"party","category":"Gifts & hats"},"birthdayhat":{"room":"party","category":"Gifts & hats"},"birthdaycake":{"room":"party","category":"Cakes & treats","name":"Three-tier party cake"},"sponge":{"room":"living","category":"Decor","retired":"Theme character outside the dollhouse collection"},"pineapple":{"room":"garden","category":"Decor","retired":"Oversized theme house"},"jellyfish":{"room":"bedroom","category":"Decor","name":"Jellyfish nursery mobile"},"seastar":{"room":"living","category":"Decor"},"bubbles":{"room":"living","category":"Decor","retired":"Floating effect rather than a furnishing"},"pinkcurtains":{"room":"bedroom","category":"Decor"},"heartmirror":{"room":"bedroom","category":"Vanities"},"fairylights":{"room":"bedroom","category":"Lighting"},"pinkflowers":{"room":"miniatures","category":"Flowers & decor"},"sparklerug":{"room":"bedroom","category":"Rugs"},"puzzle":{"room":"playroom","category":"Toys"},"crafts":{"room":"playroom","category":"Toys"},"puppet":{"room":"playroom","category":"Toys"},"dollstroller":{"room":"playroom","category":"Toys"},"tents":{"room":"playroom","category":"Furniture"},"marbles":{"room":"playroom","category":"Toys"},"soap":{"room":"bathroom","category":"Bath accessories"},"towels":{"room":"bathroom","category":"Bath accessories"},"toothbrush":{"room":"bathroom","category":"Bath accessories"},"hamper":{"room":"bathroom","category":"Storage"},"bathplant":{"room":"bathroom","category":"Decor"},"shelf":{"room":"bathroom","category":"Storage"},"toybox":{"room":"playroom","category":"Furniture"},"playmat":{"room":"playroom","category":"Toys"},"doll":{"room":"playroom","category":"Toys"},"dollhousemini":{"room":"playroom","category":"Toys"},"blocks":{"room":"playroom","category":"Toys"},"rocker":{"room":"playroom","category":"Toys","name":"Woodland rocking horse"},"bookshelfplay":{"room":"playroom","category":"Furniture"},"arttable":{"room":"playroom","category":"Furniture"},"trainset":{"room":"playroom","category":"Toys"},"bath":{"room":"bathroom","category":"Bath fixtures"},"toilet":{"room":"bathroom","category":"Bath fixtures"},"bathsink":{"room":"bathroom","category":"Bath fixtures"},"bathmirror":{"room":"bathroom","category":"Decor"},"towelrack":{"room":"bathroom","category":"Storage"},"bathcabinet":{"room":"bathroom","category":"Storage"},"rubberduck":{"room":"bathroom","category":"Bath accessories"},"bathmat":{"room":"bathroom","category":"Rugs"},"shower":{"room":"bathroom","category":"Bath fixtures"},"sink":{"room":"kitchen","category":"Appliances"},"cupboard":{"room":"kitchen","category":"Storage","name":"Pastel kitchen cabinet"},"mixer":{"room":"kitchen","category":"Appliances"},"dininglamp":{"room":"kitchen","category":"Lighting","name":"Mint pendant light"},"shelfrose":{"room":"bedroom","category":"Storage"},"shelfcloud":{"room":"bedroom","category":"Storage"},"shelfgold":{"room":"living","category":"Storage"},"shelfmint":{"room":"kitchen","category":"Storage"},"vanitybow":{"room":"bedroom","category":"Vanities"},"vanitystar":{"room":"bedroom","category":"Vanities"},"dresserpearl":{"room":"bedroom","category":"Storage"},"dressermint":{"room":"bedroom","category":"Storage"},"petbedpink":{"room":"pets","category":"Beds & care"},"petbedblue":{"room":"pets","category":"Beds & care"},"petbowl":{"room":"pets","category":"Beds & care","name":"Pet feeding bowls"},"puppy":{"room":"pets","category":"Pets"},"bunny":{"room":"pets","category":"Pets"},"hamster":{"room":"pets","category":"Pets"},"parrot":{"room":"pets","category":"Pets"},"bookset":{"room":"miniatures","category":"Books & toys"},"perfume":{"room":"miniatures","category":"Beauty & jewelry"},"makeup":{"room":"miniatures","category":"Beauty & jewelry"},"jewels":{"room":"miniatures","category":"Beauty & jewelry"},"trophy":{"room":"miniatures","category":"Flowers & decor"},"plantmini":{"room":"miniatures","category":"Flowers & decor"},"teacups":{"room":"miniatures","category":"Kitchen miniatures"},"cakeplate":{"room":"kitchen","category":"Treats"},"bedcastle":{"room":"bedroom","category":"Beds"},"bedbunk":{"room":"bedroom","category":"Beds"},"bedshell":{"room":"bedroom","category":"Beds"},"bedcarriage":{"room":"bedroom","category":"Beds"},"bedloft":{"room":"bedroom","category":"Beds"},"bedcottage":{"room":"bedroom","category":"Beds"},"vanityheart":{"room":"bedroom","category":"Vanities"},"vanityhollywood":{"room":"bedroom","category":"Vanities"},"vanityshell":{"room":"bedroom","category":"Vanities"},"vanitywood":{"room":"bedroom","category":"Vanities"},"vanityrainbow":{"room":"bedroom","category":"Vanities"},"shelfmoon":{"room":"bedroom","category":"Storage"},"shelftree":{"room":"bedroom","category":"Storage"},"shelfhouse":{"room":"bedroom","category":"Storage"},"dresserflower":{"room":"bedroom","category":"Storage"},"dresserstack":{"room":"bedroom","category":"Storage"},"wardrobe":{"room":"bedroom","category":"Storage"},"beanbag":{"room":"bedroom","category":"Seating"},"poufsun":{"room":"bedroom","category":"Seating"},"hangingchair":{"room":"bedroom","category":"Seating"},"stoolmushroom":{"room":"bedroom","category":"Seating"},"tabletulip":{"room":"kitchen","category":"Tables"},"tablepicnic":{"room":"kitchen","category":"Tables"},"tablediner":{"room":"kitchen","category":"Tables","name":"Mint diner table"},"tablebutterfly":{"room":"kitchen","category":"Tables"},"tablecafe":{"room":"kitchen","category":"Tables"},"tableisland":{"room":"kitchen","category":"Tables"},"chairshell":{"room":"kitchen","category":"Chairs"},"chairmushroom":{"room":"kitchen","category":"Chairs"},"chairdiner":{"room":"kitchen","category":"Chairs","name":"Pink diner booth"},"chairbow":{"room":"kitchen","category":"Chairs"},"chairbutterfly":{"room":"kitchen","category":"Chairs"},"chairrattan":{"room":"kitchen","category":"Chairs"},"fridgeretro":{"room":"kitchen","category":"Fridges","name":"Mint retro refrigerator"},"ovenheart":{"room":"kitchen","category":"Appliances"},"icecreamcart":{"room":"kitchen","category":"Appliances"},"cupcakecase":{"room":"kitchen","category":"Appliances"},"coffeemachine":{"room":"kitchen","category":"Appliances"},"sofacrescent":{"room":"living","category":"Seating"},"sofachester":{"room":"living","category":"Seating"},"sofacloud":{"room":"living","category":"Seating"},"sofabow":{"room":"living","category":"Seating"},"sofaseashell":{"room":"living","category":"Seating"},"sofacorner":{"room":"living","category":"Seating"},"tablemushroom":{"room":"living","category":"Tables"},"tableaquarium":{"room":"living","category":"Tables"},"tablerainbow":{"room":"living","category":"Tables"},"tablechess":{"room":"living","category":"Tables"},"shelfrainbow":{"room":"living","category":"Storage"},"shelfladder":{"room":"living","category":"Storage"},"shelfpineapple":{"room":"living","category":"Storage"},"shelfcastle":{"room":"living","category":"Storage"},"swingrainbow":{"room":"garden","category":"Playground"},"gazebo":{"room":"garden","category":"Furniture"},"pond":{"room":"garden","category":"Decor"},"hammock":{"room":"garden","category":"Furniture"},"fountain":{"room":"garden","category":"Decor"},"treehouse":{"room":"garden","category":"Playground"},"petcorgi":{"room":"pets","category":"Pets"},"petpoodle":{"room":"pets","category":"Pets"},"petkitten":{"room":"pets","category":"Pets"},"petbunny":{"room":"pets","category":"Pets"},"petparrot":{"room":"pets","category":"Pets"},"pethamster":{"room":"pets","category":"Pets"},"petbed":{"room":"pets","category":"Beds & care"},"petcastle":{"room":"pets","category":"Beds & care"},"pettower":{"room":"pets","category":"Beds & care"},"partyarch":{"room":"party","category":"Decorations"},"partycake":{"room":"party","category":"Cakes & treats","name":"Five-tier celebration cake"},"partydisco":{"room":"party","category":"Decorations"},"partyphotobooth":{"room":"party","category":"Decorations"},"lampmushroom":{"room":"living","category":"Lighting"},"lampmoon":{"room":"bedroom","category":"Lighting"},"rugflower":{"room":"living","category":"Rugs"},"rugcloud":{"room":"living","category":"Rugs"},"plantcactus":{"room":"living","category":"Plants"},"mirrorstar":{"room":"living","category":"Decor"},"rockinghorse":{"room":"playroom","category":"Toys","name":"Pastel rocking-horse toy"},"playtent":{"room":"playroom","category":"Furniture"},"toycastle":{"room":"playroom","category":"Toys","name":"Pastel toy castle"},"bunnyplush":{"room":"bedroom","category":"Plushies"},"nightstand":{"room":"bedroom","category":"Storage"},"fireplace":{"room":"living","category":"Decor"},"grandclock":{"room":"living","category":"Decor"},"tvcabinet":{"room":"living","category":"Storage"},"fishtank":{"room":"living","category":"Decor"},"armchairheart":{"room":"living","category":"Seating"},"toaster":{"room":"kitchen","category":"Appliances"},"waffles":{"room":"kitchen","category":"Treats","name":"Breakfast waffle stack"},"donuttower":{"room":"kitchen","category":"Treats","name":"Donut display stand"},"fruitbowl":{"room":"kitchen","category":"Food & drinks"},"lemonade":{"room":"garden","category":"Furniture"},"slide":{"room":"garden","category":"Playground"},"trampoline":{"room":"garden","category":"Playground"},"sandbox":{"room":"garden","category":"Playground"},"birdhouse":{"room":"garden","category":"Decor"},"mushroomring":{"room":"garden","category":"Decor"},"snowglobe":{"room":"living","category":"Decor"},"petduck":{"room":"bathroom","category":"Bath accessories","name":"Rubber duck toy"},"petfish":{"room":"pets","category":"Pets"},"pettoy":{"room":"pets","category":"Beds & care"},"pinata":{"room":"party","category":"Decorations"},"icecreamtower":{"room":"party","category":"Cakes & treats","name":"Party sundae tower"},"clawpillows":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawgroceries":{"room":"miniatures","category":"Kitchen miniatures","rewardOnly":true},"clawsucculents":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawtrain":{"room":"miniatures","category":"Books & toys","rewardOnly":true},"clawlantern":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawstarrug":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawcandles":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawmusicbox":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawglobe":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawpiggy":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawphoto":{"room":"miniatures","category":"Flowers & decor","rewardOnly":true},"clawbooknook":{"room":"miniatures","category":"Books & toys","rewardOnly":true},"clawteaset":{"room":"miniatures","category":"Kitchen miniatures","rewardOnly":true},"clawdollbed":{"room":"miniatures","category":"Books & toys","rewardOnly":true},"milkcarton":{"room":"kitchen","category":"Food & drinks"},"eggcarton":{"room":"kitchen","category":"Food & drinks"},"applesbasket":{"room":"kitchen","category":"Food & drinks"},"cheeseplate":{"room":"kitchen","category":"Food & drinks"},"juicebottle":{"room":"kitchen","category":"Food & drinks"},"bunnylamp":{"room":"bedroom","category":"Lighting","new":true},"strawberrypouf":{"room":"bedroom","category":"Seating","new":true},"cloudpetbed":{"room":"pets","category":"Beds & care","new":true},"daisymirror":{"room":"bedroom","category":"Decor","new":true},"heartteapot":{"room":"kitchen","category":"Tableware","new":true},"breadbasket":{"room":"kitchen","category":"Food & drinks","new":true},"strawberryjam":{"room":"kitchen","category":"Food & drinks","new":true},"macaronplate":{"room":"kitchen","category":"Treats","new":true},"minipaintset":{"room":"playroom","category":"Toys","new":true},"daisyplanter":{"room":"garden","category":"Plants","new":true},"rainbowcubbies":{"room":"playroom","category":"Furniture","new":true},"blushtoybox":{"room":"playroom","category":"Furniture","new":true},"claylamp":{"room":"any","category":"Decor","new":true},"clayvase":{"room":"any","category":"Decor","new":true},"claybowl":{"room":"kitchen","category":"Treats","new":true},"clayplant":{"room":"any","category":"Decor","new":true},"claymirror":{"room":"bedroom","category":"Decor","new":true},"claytray":{"room":"kitchen","category":"Decor","new":true},"clayfridge":{"room":"kitchen","category":"Fridges","new":true},"claystove":{"room":"kitchen","category":"Appliances","new":true},"clayrug":{"room":"any","category":"Rugs","new":true},"claylight":{"room":"any","category":"Lighting","new":true},"clayplush":{"room":"bedroom","category":"Plushies","new":true},"clayjar":{"room":"kitchen","category":"Kitchen miniatures","new":true},"claycup":{"room":"kitchen","category":"Tableware","new":true},"clayplate":{"room":"kitchen","category":"Tableware","new":true},"claysoap":{"room":"bathroom","category":"Bath accessories","new":true},"claytowel":{"room":"bathroom","category":"Bath accessories","new":true},"claygift":{"room":"any","category":"Gifts & hats","new":true},"clayhat":{"room":"any","category":"Gifts & hats","new":true},"clayjewelry":{"room":"bedroom","category":"Beauty & jewelry","new":true},"claybrush":{"room":"bedroom","category":"Beauty & jewelry","new":true},"claycake":{"room":"any","category":"Cakes & treats","new":true},"claycupcake":{"room":"kitchen","category":"Cakes & treats","new":true},"claytub":{"room":"bathroom","category":"Bath fixtures","new":true},"claysink":{"room":"bathroom","category":"Bath fixtures","new":true},"claybooks":{"room":"any","category":"Books & toys","new":true}};
Object.assign(META.tea,{category:'Tableware'});Object.assign(META.piano,{category:'Musical instruments'});Object.assign(META.bathmirror,{category:'Bath fixtures'});
for(const id of ['gazebo','hammock','lemonade'])Object.assign(META[id],{category:'Outdoor furniture'});
for(const id of ['petbedpink','petbedblue','petbed','petcastle','pettower','cloudpetbed'])Object.assign(META[id],{category:'Pet beds'});
for(const id of ['petbowl'])Object.assign(META[id],{category:'Pet care'});for(const id of ['pettoy'])Object.assign(META[id],{category:'Pet toys'});
const NEW=[["bunnylamp", "✨", "Bunny nightlight", 18, "bedroom"], ["strawberrypouf", "✨", "Strawberry floor cushion", 22, "bedroom"], ["cloudpetbed", "✨", "Cloud cuddle pet bed", 24, "any"], ["daisymirror", "✨", "Daisy mirror", 21, "bedroom"], ["heartteapot", "✨", "Heart teapot", 12, "kitchen"], ["breadbasket", "✨", "Bakery bread basket", 14, "kitchen"], ["strawberryjam", "✨", "Strawberry jam jar", 10, "kitchen"], ["macaronplate", "✨", "Pastel macaron plate", 14, "kitchen"], ["minipaintset", "✨", "Tiny paint palette", 12, "playroom"], ["daisyplanter", "✨", "Daisy flower pot", 15, "garden"], ["rainbowcubbies", "✨", "Rainbow cubby shelf", 36, "playroom"], ["blushtoybox", "✨", "Blush toy chest", 30, "playroom"]];
Object.assign(META,{"crystalchandelier":{"room":"living","category":"Lighting","new":true},"rosependant":{"room":"living","category":"Lighting","new":true},"cloudceiling":{"room":"bedroom","category":"Lighting","new":true},"paperlanterns":{"room":"bedroom","category":"Lighting","new":true},"starsconce":{"room":"bedroom","category":"Lighting","new":true},"heartsconce":{"room":"bedroom","category":"Lighting","new":true},"neonrainbow":{"room":"bedroom","category":"Lighting","new":true},"tulipfloorlamp":{"room":"living","category":"Lighting","new":true},"bowdesklamp":{"room":"bedroom","category":"Lighting","new":true},"lavalamp":{"room":"bedroom","category":"Lighting","new":true}});NEW.push(["crystalchandelier","💡","Crystal chandelier",60,"any"],["rosependant","💡","Rose pendant light",34,"any"],["cloudceiling","💡","Glowing cloud light",38,"any"],["paperlanterns","💡","Paper lantern string",26,"any"],["starsconce","💡","Star wall light",22,"any"],["heartsconce","💡","Heart wall light",22,"any"],["neonrainbow","💡","Rainbow neon sign",30,"any"],["tulipfloorlamp","💡","Tulip floor lamp",32,"any"],["bowdesklamp","💡","Bow desk lamp",18,"any"],["lavalamp","💡","Glitter lava lamp",20,"any"]);
NEW.forEach(it=>{if(!items.some(x=>x[0]===it[0]))items.push(it);});
// Duplicate IDs represented the same purchase. Keep the original price and ownership identity.
const seen=new Set();for(let i=0;i<items.length;){if(seen.has(items[i][0]))items.splice(i,1);else{seen.add(items[i][0]);i++;}}
for(const it of items){const m=META[it[0]];if(!m)continue;if(m.name)it[2]=m.name;
 // A recategorized furnishing can still be used in the room where it was originally purchased.
 if(['pets','party','miniatures'].includes(m.room)||(['bedroom','living','kitchen','bathroom','playroom','garden'].includes(m.room)&&it[4]!=='any'&&it[4]!==m.room))it[4]='any';
}
const small=G('SMALL_IDS');if(Array.isArray(small))for(const id of ['heartteapot','breadbasket','strawberryjam','macaronplate','minipaintset'])if(!small.includes(id))small.push(id);
const oldType=G('itemType');window.__clayCatalogType=it=>META[it[0]]?META[it[0]].category:oldType(it);SET('itemType=window.__clayCatalogType;');
const ROOMS=[['all','🌈','All rooms'],['bedroom','🛏️','Bedroom'],['living','🛋️','Living room'],['kitchen','🍓','Kitchen'],['bathroom','🛁','Bathroom'],['playroom','🧸','Playroom'],['garden','🌷','Garden'],['pets','🐾','Pets'],['party','🎂','Party'],['miniatures','🎀','Little treasures'],['collection','💝','My collection']];
const ORDER={bedroom:['Beds','Vanities','Storage','Seating','Plushies','Lighting','Rugs','Decor'],living:['Seating','Tables','Storage','Lighting','Rugs','Plants','Musical instruments','Decor'],kitchen:['Fridges','Appliances','Storage','Tables','Chairs','Food & drinks','Treats','Tableware','Lighting','Decor'],bathroom:['Bath fixtures','Storage','Bath accessories','Rugs','Decor'],playroom:['Furniture','Toys','Decor'],garden:['Plants','Outdoor furniture','Playground','Decor'],pets:['Pets','Pet beds','Pet care','Pet toys'],party:['Decorations','Cakes & treats','Gifts & hats'],miniatures:['Books & toys','Beauty & jewelry','Kitchen miniatures','Flowers & decor']};
const categoryIcon=cat=>({Beds:'🛏️',Vanities:'🪞',Storage:'🗄️',Seating:'🛋️',Plushies:'🧸',Lighting:'💡',Rugs:'🧶',Decor:'🌼',Tables:'🪑',Chairs:'🪑',Fridges:'🧊',Appliances:'🍞','Food & drinks':'🍓',Treats:'🧁',Tableware:'🫖','Bath fixtures':'🛁','Bath accessories':'🫧',Furniture:'🏠',Toys:'🧸',Plants:'🌷',Playground:'🛝',Pets:'🐾','Beds & care':'🐾',Decorations:'🎈','Cakes & treats':'🎂','Gifts & hats':'🎁','Books & toys':'📚','Beauty & jewelry':'🎀','Kitchen miniatures':'🍵','Flowers & decor':'🌷'}[cat]||'🌷');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ownedCount=id=>{const o=G('owned');return (Array.isArray(o)?o:[]).filter(x=>x===id).length},owned=id=>ownedCount(id)>0,usedCount=id=>{const d=G('decor');return Object.values(d&&typeof d==='object'?d:{}).reduce((n,p)=>n+(p&&typeof p==='object'?Object.values(p).filter(x=>x===id).length:0),0)},coins=()=>Number(G('coins'))||0;
const state={room:'all',category:'All',filter:'all',search:'',sort:'cute',page:1,roomScroll:0,categoryScroll:0,legacyRoom:G('shopRoom'),started:false};const PAGE=18;
function normal(it){const m=META[it[0]];return !!m&&!m.retired&&!m.rewardOnly&&it[3]>0;}
function base(){return items.filter(it=>normal(it)||(owned(it[0])&&(state.room==='collection'||state.filter==='owned'))).filter(it=>state.room==='all'||state.room==='collection'&&owned(it[0])||META[it[0]]?.room===state.room);}
function categories(){const values=[...new Set(base().map(it=>META[it[0]].category))];return ['All',...(ORDER[state.room]||values.sort()).filter(x=>values.includes(x)),...values.filter(x=>!(ORDER[state.room]||values).includes(x))];}
function results(){const q=state.search.trim().toLocaleLowerCase();return base().filter(it=>state.category==='All'||META[it[0]].category===state.category).filter(it=>!q||(it[2]+' '+META[it[0]].category+' '+(ROOMS.find(r=>r[0]===META[it[0]].room)?.[2]||'')).toLocaleLowerCase().includes(q)).filter(it=>state.filter==='affordable'?it[3]<=coins():state.filter==='new'?META[it[0]].new:state.filter==='owned'?owned(it[0]):state.filter==='available'?ownedCount(it[0])>usedCount(it[0]):state.filter==='inuse'?usedCount(it[0])>0:true).sort((a,b)=>state.sort==='name'?a[2].localeCompare(b[2]):state.sort==='price'?a[3]-b[3]||a[2].localeCompare(b[2]):Number(owned(a[0]))-Number(owned(b[0]))||Number(!!META[b[0]].new)-Number(!!META[a[0]].new)||a[3]-b[3]||a[2].localeCompare(b[2]));}
function hint(it){const m=META[it[0]];if(it[0]==='heartkitchencabinet')return 'Main sink · opens to store cooking supplies';if(K.storageProfile&&K.storageProfile(it[0]))return 'Opens · keeps little treasures';if(m.room==='pets')return m.category==='Pets'?'A little friend for your rooms':'A cozy corner for your pet';if(m.category==='Food & drinks')return 'Little food for your fridge';if(m.room==='miniatures'||m.category==='Tableware')return 'A tiny treasure for shelves & drawers';return (ROOMS.find(r=>r[0]===m.room)?.[2]||'Dollhouse')+' · '+m.category;}
function product(it){const m=META[it[0]],count=ownedCount(it[0]),used=usedCount(it[0]),afford=coins()>=it[3],art=G('furnitureArt'),free=Math.max(0,count-used);return `<article class="shop-item catalog-card ${count?'owned':''}" data-catalog-id="${it[0]}"><div class="pic">${art(it)}</div><div class="catalog-badges">${m.new?'<span>New & cute</span>':''}${m.retired?'<span>Previously collected</span>':''}${m.rewardOnly?'<span>Won in games</span>':''}</div><h3 class="name">${esc(it[2])}</h3><p class="catalog-purpose">${esc(hint(it))}</p><div class="price">${count?`✓ Own ${count} · ${free} available`:'🪙 '+it[3]+' coins'}</div><button type="button" class="primary" data-catalog-buy="${it[0]}" ${!afford?'disabled':''}>${afford?(count?'Buy another · ':'Buy · ')+it[3]:'Save '+(it[3]-coins())+' more'}</button></article>`;}
const DREAM_PETS=[['puppy','Puppy',0],['kitty','Kitty',50],['bunny','Bunny',50],['unicorn','Unicorn',120],['hamster','Hamster',50],['panda','Panda',90]];
function dreamPetCards(){if(state.room!=='pets'||!['All','Pets'].includes(state.category)||!window.RikiPlay||!window.RikiArt)return '';
 const play=window.RikiPlay.state(),q=state.search.trim().toLowerCase(),list=DREAM_PETS.filter(([id,name,cost])=>!q||(name+' pet companion').toLowerCase().includes(q)).filter(([id,,cost])=>state.filter==='affordable'?cost<=coins():state.filter==='new'?false:state.filter==='owned'?play.pets.includes(id):state.filter==='available'?play.pets.includes(id):state.filter==='inuse'?play.pet===id:true);
 if(!list.length)return '';
 return `<section class="catalog-pet-friends"><h3>💖 Doll friends</h3><p class="catalog-purpose">These are the same pets from My Dolls & Pets. Buy one here and it joins you there.</p><div class="shop-grid catalog-grid">${list.map(([id,name,cost])=>{const own=play.pets.includes(id);return `<article class="shop-item catalog-card ${own?'owned':''}" data-dream-pet-card="${id}"><div class="pic">${window.RikiArt.pet(id,play.pet===id?'love':'happy')}</div><div class="catalog-badges"><span>3D-style pet</span></div><h3 class="name">${name}</h3><p class="catalog-purpose">A little friend for My Dolls & Pets</p><div class="price">${own?'✓ In your pet family':'🪙 '+cost+' coins'}</div><button type="button" class="primary" data-dream-pet="${id}" ${own||coins()<cost?'disabled':''}>${own?'Already yours':coins()>=cost?'Buy · '+cost:'Save '+(cost-coins())+' more'}</button></article>`;}).join('')}</div></section>`;}
function products(){const all=results();const pages=Math.max(1,Math.ceil(all.length/PAGE));state.page=Math.min(Math.max(1,state.page),pages);const shown=all.slice((state.page-1)*PAGE,state.page*PAGE),friends=dreamPetCards();return `${friends}<p class="catalog-count" role="status">${all.length?'Showing '+((state.page-1)*PAGE+1)+'–'+Math.min(state.page*PAGE,all.length)+' of '+all.length+' little treasures':'No dollhouse items match yet'}</p><div class="shop-grid catalog-grid">${shown.map(product).join('')||(!friends?'<div class="catalog-empty"><span>🌷</span><p>Try another collection or clear your filters.</p><button type="button" class="secondary" data-catalog-clear>Show all treasures</button></div>':'')}</div>${pages>1?`<nav class="catalog-paging" aria-label="Shop pages"><button type="button" data-catalog-page="${state.page-1}" ${state.page===1?'disabled':''}>← Previous</button><span>${state.page} / ${pages}</span><button type="button" data-catalog-page="${state.page+1}" ${state.page===pages?'disabled':''}>More treasures →</button></nav>`:''}`;}
function shopHtml(){if(!categories().includes(state.category))state.category='All';return `<section class="panel catalog-shop ${state.started?'catalog-started':'catalog-choosing'}"><header class="catalog-heading"><div><span class="catalog-eyebrow">Made for little rooms</span><h2>Little Clay Boutique</h2><p>Search by name, choose a room, or filter your collection. Buy another copy whenever every one you own is already in use.</p></div><div class="catalog-wallet" id="catalogWallet">🪙 ${coins()} coins</div></header><button type="button" class="secondary catalog-decorate" id="catalogDecorate">🏠 Back to my dollhouse</button> <button type="button" class="secondary catalog-decorate" id="catalogFinishes">🎨 Wallpaper & curtains</button><button type="button" class="secondary catalog-decorate" id="catalogClothes">👗 Doll dresses & shoes</button><div class="catalog-simple-nav"><h3 style="margin-bottom:10px">🏠 Pick a room</h3><nav class="catalog-tabs" id="catalogRooms" aria-label="Shop rooms" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${ROOMS.filter(([id])=>["bedroom","living","kitchen","bathroom","playroom","garden"].includes(id)).map(([id,icon,label])=>`<button type="button" data-catalog-room="${id}" aria-pressed="${state.room===id}" class="${state.room===id?'active':''}" style="font-size:16px;padding:12px 18px;font-weight:700">${icon} ${label}</button>`).join('')}</nav><div class="catalog-special-choices" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">${ROOMS.filter(([id])=>["pets","party","miniatures","collection","all"].includes(id)).map(([id,icon,label])=>'<button type="button" data-catalog-room="'+id+'" aria-pressed="'+(state.room===id)+'" class="'+(state.room===id?'active':'')+'" style="font-size:15px;padding:10px 16px"><span aria-hidden="true">'+icon+'</span> <b>'+label+'</b></button>').join('')}</div>${state.room&&state.room!=='all'?`<div style="background:#fff8fc;border:2px solid #f0d0e0;border-radius:16px;padding:12px 16px;margin-bottom:16px"><h3 style="margin:0 0 8px;font-size:15px">🎀 ${ROOMS.find(r=>r[0]===state.room)?.[2]||'Room'} categories</h3><nav class="catalog-tabs" id="catalogCategories" aria-label="Shop collections" style="display:flex;flex-wrap:wrap;gap:6px">${categories().map(cat=>`<button type="button" data-catalog-category="${esc(cat)}" aria-pressed="${state.category===cat}" class="${state.category===cat?'active':''}" style="font-size:14px;padding:8px 14px">${cat==='All'?'✨':categoryIcon(cat)} ${esc(cat)}</button>`).join('')}</nav></div>`:''}</div><div class="catalog-tools" style="${state.started?'':'display:none'}"><label class="catalog-search"><span class="sr-only">Search shop items</span><input id="catalogSearch" type="search" placeholder="Search beds, bunnies, lamps…" value="${esc(state.search)}" aria-label="Search shop items"></label><label><span class="sr-only">Sort items</span><select id="catalogSort" aria-label="Sort items"><option value="cute" ${state.sort==='cute'?'selected':''}>New & cute first</option><option value="price" ${state.sort==='price'?'selected':''}>Price: low to high</option><option value="name" ${state.sort==='name'?'selected':''}>Name: A–Z</option></select></label></div><div class="catalog-filters" aria-label="Filter items" style="${state.started?'':'display:none'}">${[['all','Show all'],['affordable','Can afford'],['new','New & cute'],['owned','Owned'],['available','Ready to place'],['inuse','In rooms']].map(([v,l])=>`<button type="button" data-catalog-filter="${v}" aria-pressed="${state.filter===v}" class="${state.filter===v?'active':''}">${l}</button>`).join('')}</div><p class="catalog-notice" id="catalogNotice" role="status" aria-live="polite" hidden></p><div id="catalogProducts" style="${state.started?'':'display:none'}">${products()}</div></section>`;}
function redraw(resetCategories=false){const y=window.scrollY,rooms=document.getElementById('catalogRooms'),cats=document.getElementById('catalogCategories');if(rooms)state.roomScroll=rooms.scrollLeft;if(cats)state.categoryScroll=resetCategories?0:cats.scrollLeft;const render=G('houseRender');if(render)render();window.scrollTo(0,y);}
function updateProducts(){const target=document.getElementById('catalogProducts');if(!target)return;target.innerHTML=products();bindProducts();}
function buy(id){const it=items.find(x=>x[0]===id);if(!it||!normal(it)||coins()<it[3])return false;const next=coins()-it[3],before=ownedCount(id);(G('owned')||[]).push(id);SET('coins='+next+';');const save=G('saveHouse');if(save)save();try{window.localStorage.setItem('rickyCoins',String(next));}catch(_){}const stats=G('updateStats');if(stats)stats();const audio=G('audio');if(audio)audio('win');updateProducts();const wallet=document.getElementById('catalogWallet');if(wallet)wallet.textContent='🪙 '+next+' coins';const notice=document.getElementById('catalogNotice');if(notice){notice.hidden=false;notice.innerHTML='✓ '+esc(it[2])+' purchased! <button type="button" id="catalogPlacePurchase" class="secondary">🏠 See it in '+esc(ROOMS.find(r=>r[0]===META[id]?.room)?.[2]||'your room')+'</button>';const place=document.getElementById('catalogPlacePurchase');if(place)place.onclick=()=>{const room=META[id]?.room||'bedroom';SET("currentRoom="+JSON.stringify(room)+";housePage='decorate';selectedItem='';");const render=G('houseRender');if(render)render();};}return true;}
function buyDreamPet(id){const row=DREAM_PETS.find(x=>x[0]===id),play=window.RikiPlay?.state();if(!row||!play||play.pets.includes(id)||coins()<row[2])return;const next=coins()-row[2];play.pets.push(id);play.pet=id;SET('coins='+next+';');const persist=()=>{try{window.localStorage.setItem('rikiPlayTokensV1',JSON.stringify(play));window.localStorage.setItem('rickyCoins',String(next));}catch(e){console.error('pet shop save failed',e)}};persist();const saveHouse=G('saveHouse');if(saveHouse)saveHouse();persist();setTimeout(persist,0);const stats=G('updateStats');if(stats)stats();updateProducts();const wallet=document.getElementById('catalogWallet');if(wallet)wallet.textContent='🪙 '+next+' coins';const notice=document.getElementById('catalogNotice');if(notice){notice.hidden=false;notice.textContent='✓ '+row[1]+' joined your Dolls & Pets family!';}}
function bindProducts(){document.querySelectorAll('[data-catalog-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.catalogBuy));document.querySelectorAll('[data-dream-pet]').forEach(b=>b.onclick=()=>buyDreamPet(b.dataset.dreamPet));document.querySelectorAll('[data-catalog-page]').forEach(b=>b.onclick=()=>{state.page=Number(b.dataset.catalogPage);updateProducts();document.getElementById('catalogProducts').scrollIntoView({block:'start',behavior:'smooth'});});document.querySelectorAll('[data-catalog-clear]').forEach(b=>b.onclick=()=>{state.search='';state.filter='all';state.category='All';state.page=1;redraw();});}
function bindShop(){const clothes=document.getElementById('catalogClothes');if(clothes)clothes.onclick=()=>window.RikiPlay?.wardrobe('shop');const rooms=document.getElementById('catalogRooms'),cats=document.getElementById('catalogCategories');if(rooms)rooms.scrollLeft=state.roomScroll;if(cats)cats.scrollLeft=state.categoryScroll;
 document.querySelectorAll('[data-catalog-room]').forEach(b=>b.onclick=()=>{state.room=b.dataset.catalogRoom;state.started=true;state.category='All';state.page=1;state.categoryScroll=0;redraw(true);});
 document.querySelectorAll('[data-catalog-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.catalogCategory;state.page=1;redraw();});
 document.querySelectorAll('[data-catalog-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.catalogFilter;state.page=1;redraw();});
 document.querySelectorAll('[data-catalog-scroll]').forEach(b=>b.onclick=()=>{const [which,sign]=b.dataset.catalogScroll.split(':');(which==='rooms'?rooms:cats)?.scrollBy({left:Number(sign)*220,behavior:'smooth'});});
 document.getElementById('catalogSearch').oninput=e=>{state.search=e.target.value;state.page=1;updateProducts();};document.getElementById('catalogSort').onchange=e=>{state.sort=e.target.value;state.page=1;updateProducts();};
 document.getElementById('catalogFinishes').onclick=()=>{SET("shopRoom='interiors';shopType='Wallpapers';housePage='shop';");const render=G('houseRender');if(render)render();};
 document.getElementById('catalogDecorate').onclick=()=>{if(['bedroom','living','kitchen','garden','playroom','bathroom'].includes(state.room))SET('currentRoom='+JSON.stringify(state.room)+';');SET("housePage='decorate';selectedItem='';");const render=G('houseRender');if(render)render();};bindProducts();
}
const oldShop=G('shopHtml'),oldBind=G('bindShop');window.__clayCatalogShop=function(){const room=G('shopRoom');if(room==='interiors'){state.legacyRoom=room;return oldShop.apply(this,arguments);}if(state.legacyRoom!==room){if(ROOMS.some(x=>x[0]===room)){state.room=room;state.started=true;state.category='All';state.page=1;}state.legacyRoom=room;}return shopHtml();};window.__clayCatalogBind=function(){return G('shopRoom')==='interiors'?oldBind.apply(this,arguments):bindShop();};SET('shopHtml=window.__clayCatalogShop;bindShop=window.__clayCatalogBind;');
// Preserve queued clay thumbnails, but show a relevant icon while they are being rendered.
const oldArt=G('furnitureArt');window.__clayCatalogArt=function(it){const html=oldArt.apply(this,arguments),m=it&&META[it[0]];if(!m||/rk3-thumb/.test(html))return html;return `<span class="rk3-art" data-rk3-id="${it[0]}"><span class="catalog-placeholder" aria-hidden="true">${categoryIcon(m.category)}</span></span>`;};SET('furnitureArt=window.__clayCatalogArt;');
window.RikiCatalog={meta:META,state,rooms:ROOMS,categories,results,buy,ownedCount,usedCount,isListed:normal,all:()=>items.map(it=>({id:it[0],name:it[2],price:it[3],placementRoom:it[4],...META[it[0]],model:!!K.MODEL[it[0]]}))};

/* Photo furniture from the saved clay samples. A flat picture facing the camera, not a new 3D sculpt. */
function photoProp(g,url,w,h){
  const tex=new THREE.TextureLoader().load(url);
  if(THREE.sRGBEncoding)tex.encoding=THREE.sRGBEncoding;
  const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,alphaTest:.04});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);
  mesh.position.y=h/2;
  mesh.castShadow=false;
  // Turn to face the camera (around the vertical axis) so the picture never goes paper-thin when the room is rotated
  const wp=new THREE.Vector3(),pq=new THREE.Quaternion(),pe=new THREE.Euler();
  mesh.onBeforeRender=function(r,sc,cam){this.getWorldPosition(wp);const yaw=Math.atan2(cam.position.x-wp.x,cam.position.z-wp.z);if(this.parent){this.parent.getWorldQuaternion(pq);pe.setFromQuaternion(pq,'YXZ');this.rotation.y=yaw-pe.y;}else this.rotation.y=yaw;};
  g.add(mesh);
}
const PM=(window.RK3&&window.RK3.MODEL)||{};
PM.bed=g=>photoProp(g,'assets/images/clay/photo-bed.png',1.7,1.14);
PM.softsofa=g=>photoProp(g,'assets/images/clay/photo-sofa.png',1.9,.94);
if(Array.isArray(ITEMS)&&!ITEMS.some(x=>x[0]==='softsofa'))ITEMS.push(['softsofa','🛋️','Soft pink sofa',36,'bedroom']);
META.softsofa={room:'bedroom',category:'Seating',name:'Soft pink sofa',new:true};
try{
  if(localStorage.getItem('rikiPhotoBedroomV1')!=='1'){
    const owned=G('owned'),decor=G('decor'),pos=G('dreamPosition');
    if(Array.isArray(owned)&&decor&&pos){
      decor.bedroom=decor.bedroom||{};
      pos.bedroom=pos.bedroom||{};
      const placed=Object.values(decor.bedroom);
      const hasBed=placed.some(id=>String(id).startsWith('bed'));
      function put(id,x,y){
        if(!owned.includes(id))owned.push(id);
        if(!Object.values(decor.bedroom).includes(id)){
          let slot=String(Object.keys(decor.bedroom).length);
          while(decor.bedroom[slot])slot=String(+slot+1);
          decor.bedroom[slot]=id;
        }
        pos.bedroom[id]=pos.bedroom[id]||{x,y};
      }
      if(!hasBed)put('bed',34,46);
      put('softsofa',66,74);
      const save=G('saveHouse');if(save)save();
      const dream=G('dreamSave');if(dream)dream();
      localStorage.setItem('rikiPhotoBedroomV1','1');
    }
  }
}catch(e){console.warn('photo bedroom',e);}
})();

/* Use each rendered doll's own face pixels for speech instead of painting a
   second mouth over the illustration.  This layer runs before the character
   renderer and upgrades dolls whenever a game adds them to the page. */
(()=>{
 const NS='http://www.w3.org/2000/svg';let nativeMouthId=0;
 function upgrade(svg){
  if(!svg||svg.dataset.nativeMouth==='1')return;
  svg.dataset.nativeMouth='1';
  svg.querySelectorAll('.pd-speech-mouth').forEach(n=>n.remove());
  const visible=[...svg.children].filter(n=>n.localName!=='defs');
  if(!visible.length)return;
  const id='pd-native-face-'+(++nativeMouthId),clip=id+'-clip';
  const defs=document.createElementNS(NS,'defs'),cp=document.createElementNS(NS,'clipPath'),oval=document.createElementNS(NS,'ellipse');
  cp.id=clip;oval.setAttribute('cx','60');oval.setAttribute('cy','84.5');oval.setAttribute('rx','8.2');oval.setAttribute('ry','5.4');cp.append(oval);defs.append(cp);svg.prepend(defs);
  const art=document.createElementNS(NS,'g');art.id=id;art.classList.add('pd-native-face-art');
  visible[0].before(art);visible.forEach(n=>art.append(n));
  const windowGroup=document.createElementNS(NS,'g'),motion=document.createElementNS(NS,'g'),use=document.createElementNS(NS,'use');
  windowGroup.classList.add('pd-native-mouth-window');windowGroup.setAttribute('clip-path',`url(#${clip})`);
  motion.classList.add('pd-native-mouth-motion');use.setAttribute('href',`#${id}`);use.setAttributeNS('http://www.w3.org/1999/xlink','href',`#${id}`);
  motion.append(use);windowGroup.append(motion);svg.append(windowGroup);
 }
 function scan(root){if(root?.matches?.('svg.pd-doll'))upgrade(root);root?.querySelectorAll?.('svg.pd-doll').forEach(upgrade);}
 const watch=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(scan)));
 function start(){scan(document);watch.observe(document.documentElement,{childList:true,subtree:true});}
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();

/* ===== Clay furniture (Claude, Nov 1): Rachel assigned furniture to Claude. Hand-sculpted puffy clay pieces
   replace the main beds, sofas, chairs, tables, dressers, vanities and shelves. Storage pieces keep their
   working drawers and doors; they are dressed in the same clay colors, knobs and mirrors. ===== */
(function(){
const K=window.RK3;if(!K||!K.MODEL)return;
/* Clay furniture kit (Claude, Nov 1): hand-sculpted puffy clay furniture in the style of Rachel's references.
   Every piece: rounded puffy volumes, felt-clay surface, fat round feet, small details (tufts, beads, knobs, quilting). */
function makeClayKit(THREE){
const T=THREE;const MC={};let BUMP=null;
function bump(){if(BUMP)return BUMP;const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');x.fillStyle='#808080';x.fillRect(0,0,256,256);
  for(let i=0;i<900;i++){const r=1+Math.random()*5,px=Math.random()*256,py=Math.random()*256,v=Math.random()<.5?100:160;const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${v},${v},${v},.5)`);g.addColorStop(1,'rgba(128,128,128,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill();}
  BUMP=new T.CanvasTexture(cv);BUMP.wrapS=BUMP.wrapT=T.RepeatWrapping;BUMP.repeat.set(3,3);return BUMP;}
function M(c,o){const k=c+JSON.stringify(o||0);if(MC[k])return MC[k];const m=new T.MeshStandardMaterial(Object.assign({color:new T.Color(c).convertSRGBToLinear(),roughness:.9,metalness:0,bumpMap:bump(),bumpScale:.035},o||{}));m.userData.clay=1;return MC[k]=m;}
const GOLD=()=>M('#e9c46a',{roughness:.35,metalness:.55,bumpScale:.005}),GLASS=()=>M('#dcecf6',{roughness:.12,metalness:.25,bumpScale:0});
const GC={};
function rr(w,h,r){r=Math.min(r,w/2-.001,h/2-.001);const s=new T.Shape(),x=-w/2+r,y=-h/2+r,W=w-2*r,H=h-2*r;s.moveTo(x,y-r);s.absarc(x+W,y,r,-Math.PI/2,0);s.absarc(x+W,y+H,r,0,Math.PI/2);s.absarc(x,y+H,r,Math.PI/2,Math.PI);s.absarc(x,y,r,Math.PI,Math.PI*1.5);return s;}
function ext(shape,d,bev,key){if(key&&GC[key])return GC[key];bev=Math.min(bev,d/2+.05);const g=new T.ExtrudeGeometry(shape,{depth:Math.max(.005,d-2*bev),bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:3,curveSegments:7});g.center();g.computeVertexNormals();if(key)GC[key]=g;return g;}
/* puffy box: w (x), h (y), d (z) */
function puff(w,h,d,r,bev){r=r==null?Math.min(w,h)*.3:r;bev=bev==null?Math.min(w,h,d)*.28:bev;bev=Math.min(bev,w/2-.002,h/2-.002);return ext(rr(Math.max(.01,w-2*bev),Math.max(.01,h-2*bev),Math.max(.002,r-bev)),d,bev,['p',w,h,d,r,bev].map(v=>typeof v==='number'?v.toFixed(3):v).join());}
function add(g,geo,m,x,y,z,rx,ry,rz){const o=new T.Mesh(geo,m);o.position.set(x||0,y||0,z||0);if(rx)o.rotation.x=rx;if(ry)o.rotation.y=ry;if(rz)o.rotation.z=rz;o.castShadow=o.receiveShadow=true;g.add(o);return o;}
const SPH=(r,ws=r<.07?10:16,hs=r<.07?7:11)=>GC['s'+r]||(GC['s'+r]=new T.SphereGeometry(r,ws,hs));
function ball(g,r,m,x,y,z,sx=1,sy=1,sz=1){const o=add(g,SPH(r),m,x,y,z);o.scale.set(sx,sy,sz);if(r<.07)o.castShadow=false;return o;}
function cyl(g,rt,rb,h,m,x,y,z,seg=14){return add(g,new T.CylinderGeometry(rt,rb,h,seg),m,x,y,z);}
/* fat bun foot */
function foot(g,r,h,m,x,z){cyl(g,r*.92,r,h*.7,m,x,h*.38,z);ball(g,r,m,x,h*.12,z,1,.45,1);ball(g,r*.95,m,x,h*.72,z,1,.35,1);}
function feet(g,w,d,r,h,m,inset=.08){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>foot(g,r,h,m,a*(w/2-inset),b*(d/2-inset)));}
function taperLegs(g,w,d,h,m,inset=.07,r=.045){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{cyl(g,r,r*.75,h,m,a*(w/2-inset),h/2,b*(d/2-inset),16);ball(g,r*.8,m,a*(w/2-inset),.02,b*(d/2-inset),1,.5,1);});}
function beads(g,n,x0,x1,y,z,r,m,axis='x'){for(let i=0;i<n;i++){const t=n===1?.5:i/(n-1);const p=x0+(x1-x0)*t;axis==='x'?ball(g,r,m,p,y,z,1.05,.9,1.05):ball(g,r,m,x0,y,p,1.05,.9,1.05);}}
function tuft(g,m,x,y,z){ball(g,.028,m,x,y,z,1,1,.45);}
/* knobs */
function heartShape(s){const h=new T.Shape();h.moveTo(0,-.9*s);h.bezierCurveTo(-.15*s,-.6*s,-1*s,-.25*s,-1*s,.25*s);h.bezierCurveTo(-1*s,.8*s,-.3*s,1*s,0,.55*s);h.bezierCurveTo(.3*s,1*s,1*s,.8*s,1*s,.25*s);h.bezierCurveTo(1*s,-.25*s,.15*s,-.6*s,0,-.9*s);return h;}
function starShape(R,r,n=5){const s=new T.Shape();for(let i=0;i<n*2;i++){const a=i/(n*2)*Math.PI*2+Math.PI/2,rad=i%2?r:R;i?s.lineTo(Math.cos(a)*rad,Math.sin(a)*rad):s.moveTo(Math.cos(a)*rad,Math.sin(a)*rad);}return s;}
function knob(g,type,x,y,z){if(type==='heart')add(g,ext(heartShape(.045),.03,.012,'kh'),M('#e8848f'),x,y,z+.015);else if(type==='pearl')ball(g,.032,M('#fbf6ee',{roughness:.3,bumpScale:0}),x,y,z+.02);else if(type==='flower'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;ball(g,.018,M('#ffffff'),x+Math.cos(a)*.024,y+Math.sin(a)*.024,z+.012);}ball(g,.016,M('#f6c453'),x,y,z+.02);}else if(type==='star')add(g,ext(starShape(.045,.02),.025,.01,'ks'),GOLD(),x,y,z+.015);else ball(g,.03,GOLD(),x,y,z+.018);}
/* head / back shapes (w wide, h tall, base at y=0) */
function shapeOf(kind,w,h){const s=new T.Shape(),hw=w/2;
  if(kind==='arch'){s.moveTo(-hw,0);s.lineTo(-hw,h-hw*.9);s.absarc(0,h-hw*.9,hw,Math.PI,0,true);s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
  if(kind==='scallop'||kind==='cloud'){const n=kind==='cloud'?4:3,base=kind==='cloud'?h*.62:h*.72;s.moveTo(-hw,0);s.lineTo(-hw,base);for(let i=0;i<n;i++){const x0=-hw+i*w/n,x1=x0+w/n,cx=(x0+x1)/2,r=w/n/2;const bump=kind==='cloud'?(i===1||i===2?h-base:(h-base)*.65):(i===1?h-base:(h-base)*.7);s.bezierCurveTo(x0,base+bump*1.3,x1,base+bump*1.3,x1,base);}s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
  if(kind==='castle'){const n=5,cw=w/n;s.moveTo(-hw,0);s.lineTo(-hw,h);for(let i=0;i<n;i++){const x0=-hw+i*cw;const top=i%2?h*.86:h;s.lineTo(x0,top);s.lineTo(x0+cw,top);}s.lineTo(hw,h);s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
  if(kind==='gable'){s.moveTo(-hw,0);s.lineTo(-hw,h*.62);s.lineTo(0,h);s.lineTo(hw,h*.62);s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
  if(kind==='heart'){const hs=heartShape(1);const pts=hs.getPoints(40).map(p=>new T.Vector2(p.x*hw,(p.y+.9)/1.9*h));return new T.Shape(pts);}
  if(kind==='shell'){const n=7;s.moveTo(-hw*.35,0);s.lineTo(-hw,h*.45);for(let i=0;i<n;i++){const a0=Math.PI-i/n*Math.PI,a1=Math.PI-(i+1)/n*Math.PI;const p0=[Math.cos(a0)*hw,h*.45+Math.sin(a0)*(h*.55)],p1=[Math.cos(a1)*hw,h*.45+Math.sin(a1)*(h*.55)];const am=(a0+a1)/2;s.quadraticCurveTo(Math.cos(am)*hw*1.12,h*.45+Math.sin(am)*h*.62,p1[0],p1[1]);}s.lineTo(hw*.35,0);s.lineTo(-hw*.35,0);return s;}
  if(kind==='bow'){s.moveTo(-hw,0);s.lineTo(-hw,h*.8);s.bezierCurveTo(-hw,h*1.02,-hw*.3,h*.95,0,h*.88);s.bezierCurveTo(hw*.3,h*.95,hw,h*1.02,hw,h*.8);s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
  if(kind==='round'){s.moveTo(-hw,0);s.lineTo(-hw,h*.55);s.bezierCurveTo(-hw,h*1.05,hw,h*1.05,hw,h*.55);s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
  if(kind==='mushroom'){s.moveTo(-hw*.4,0);s.lineTo(-hw*.4,h*.5);s.lineTo(-hw,h*.55);s.bezierCurveTo(-hw,h*1.1,hw,h*1.1,hw,h*.55);s.lineTo(hw*.4,h*.5);s.lineTo(hw*.4,0);s.lineTo(-hw*.4,0);return s;}
  if(kind==='butterfly'){s.moveTo(0,h*.2);s.bezierCurveTo(-hw*.3,0,-hw,0,-hw,h*.4);s.bezierCurveTo(-hw,h*1.05,-hw*.2,h*.95,0,h*.62);s.bezierCurveTo(hw*.2,h*.95,hw,h*1.05,hw,h*.4);s.bezierCurveTo(hw,0,hw*.3,0,0,h*.2);return s;}
  /* wave (default, like the photo bed) */
  s.moveTo(-hw,0);s.lineTo(-hw,h*.62);s.bezierCurveTo(-hw,h*.95,-w*.28,h,-w*.12,h*.93);s.bezierCurveTo(-w*.04,h*.9,w*.04,h*.9,w*.12,h*.93);s.bezierCurveTo(w*.28,h,hw,h*.95,hw,h*.62);s.lineTo(hw,0);s.lineTo(-hw,0);return s;}
function panel(g,kind,w,h,d,m,x,y,z){const o=add(g,ext(shapeOf(kind,w,h),d,Math.min(.07,d*.7),['sh',kind,w,h,d].join()),m,x,y,z);o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox;o.position.y=y+h/2-(bb.max.y+bb.min.y)/2+(bb.max.y-bb.min.y-h)/2;return o;}

/* ===== BED ===== */
function bed(g,o){o=Object.assign({W:1.4,L:1.9,head:'wave',headC:'#e8949e',frameC:'#f2dcbc',sideC:null,blanketC:'#f2dcbc',p1:'#f2dcbc',p2:'#ee9fa9',braidC:'#ee9fa9',legC:null,quilt:null,canopy:null,foot:false,trimGold:false},o);const W=o.W,L=o.L;
  const F=M(o.frameC),H=M(o.headC),Sd=M(o.sideC||o.headC),Lg=M(o.legC||o.headC);
  feet(g,W-.1,L-.12,.1,.24,Lg,.08);
  add(g,puff(W,.3,L,.14,.11),F,0,.38,0);
  [-1,1].forEach(s=>add(g,puff(.15,.31,L-.06,.07,.065),Sd,s*(W/2-.02),.38,0));
  add(g,puff(W-.08,.2,L-.12,.12,.09),M('#fbf3e6'),0,.62,.02);
  add(g,puff(W+.02,.14,L*.6,.12,.07),M(o.blanketC),0,.72,L*.2);
  beads(g,Math.round(W/.085),-W/2+.08,W/2-.08,.81,L*.2-L*.3+.02,.05,M(o.braidC));
  if(o.quilt){const qm=M(o.quilt);const shapes=[n=>ext(starShape(.07,.032),.02,.01,'q1'),n=>ext(heartShape(.06),.02,.01,'q2'),n=>new T.CylinderGeometry(.055,.055,.02,20)];let k=0;for(let i=0;i<3;i++)for(let j=0;j<2;j++){const geo=shapes[(k++)%3]();const m=add(g,geo,qm,-W*.3+i*W*.3,.8,L*.07+j*L*.22);if(geo.type!=='CylinderGeometry')m.rotation.x=-Math.PI/2;}}
  [[-W*.23,o.p1],[W*.23,o.p2]].forEach(([x,c],i)=>{const p=add(g,puff(W*.42,.42,.2,.13,.09),M(c),x,.98,-L/2+.3);p.rotation.x=-.2;p.rotation.z=i?-.05:.05;});
  panel(g,o.head,W+.06,1.3,.11,H,0,.1,-L/2-.02);
  if(o.trimGold)beads(g,9,-W/2+.05,W/2-.05,1.32,-L/2+.03,.035,GOLD());
  if(o.foot)panel(g,o.head==='castle'?'castle':'round',W+.06,.55,.1,H,0,.1,L/2+.02);
  if(o.canopy){const pc=M(o.canopy.post||'#fff4e6');[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{cyl(g,.04,.045,2.1,pc,a*(W/2+.02),1.05,b*(L/2+.02),14);ball(g,.07,GOLD(),a*(W/2+.02),2.12,b*(L/2+.02));});
    [[-1],[1]].forEach(([a])=>add(g,puff(.06,.06,L+.06,.03,.025),pc,a*(W/2+.02),2.08,0));[[-1],[1]].forEach(([b])=>add(g,puff(W+.06,.06,.06,.03,.025),pc,0,2.08,b*(L/2+.02)));
    const sh=new T.MeshStandardMaterial({color:new T.Color(o.canopy.sheer||'#ffd6e4').convertSRGBToLinear(),transparent:true,opacity:.55,roughness:.9,side:T.DoubleSide,depthWrite:false});
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const geo=new T.PlaneGeometry(.42,1.9,12,1);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);const pinch=1-Math.max(0,.35-Math.abs(y+.15))*1.4;pos.setX(i,x*pinch);pos.setZ(i,Math.sin(x*28)*.025);}geo.computeVertexNormals();const c=add(g,geo,sh,a*(W/2+.02)-a*.18,1.12,b*(L/2+.03));c.castShadow=false;ball(g,.04,M(o.canopy.sheer||'#ffd6e4'),a*(W/2+.02)-a*.18,.97,b*(L/2+.05),1.6,.7,.7);});}
}
/* ===== SOFA / ARMCHAIR ===== */
function sofa(g,o){o=Object.assign({W:1.8,D:.9,c:'#9fcbe6',c2:null,arm:'roll',back:'puff',tufted:true,pillows:['#f6c9d6','#fff2d6'],legC:'#e9c46a',bow:false},o);const W=o.W,D=o.D,C=M(o.c),C2=M(o.c2||o.c),Lg=o.legC==='gold'?GOLD():M(o.legC);
  feet(g,W-.2,D-.15,.06,.14,Lg,.06);
  add(g,puff(W-.3,.26,D,.12,.1),C,0,.27,0);
  const n=W>1.2?2:1;for(let i=0;i<n;i++){const cw=(W-.36)/n;add(g,puff(cw-.02,.16,D-.22,.08,.07),C2,-W/2+.18+cw*(i+.5),.47,.08);}
  if(o.back==='cloud'){for(let i=0;i<4;i++)ball(g,.26,C,-W*.36+i*W*.24,.72,-D/2+.18,1,1,.7);}
  else if(o.back==='shell'){panel(g,'shell',W-.25,.78,.24,C,0,.3,-D/2+.14);for(let i=0;i<5;i++){const a=Math.PI*(.15+i*.175);add(g,puff(.05,.5,.05,.02,.02),C2,Math.cos(a)*W*.3,.55+Math.sin(a)*.22,-D/2+.28,0,0,a-Math.PI/2);}}
  else if(o.back==='round'||o.back==='bow'){panel(g,o.back,W-.2,.66,.26,C,0,.3,-D/2+.15);}
  else{add(g,puff(W-.22,.56,.26,.16,.11),C,0,.64,-D/2+.15);}
  if(o.tufted&&o.back!=='cloud'&&o.back!=='shell'){const tm=M(o.c2||o.c);const tc=new T.Color(o.c).multiplyScalar(.82);const tmd=M('#'+tc.getHexString());for(let r=0;r<(o.back==='chester'?2:1);r++)for(let i=0;i<(W>1.2?4:2);i++){const cols=W>1.2?4:2;tuft(g,tmd,-W*.33+i*(W*.66/(cols-1||1)),.68+r*.14,-D/2+.29);}}
  [-1,1].forEach(s=>{const x=s*(W/2-.12);if(o.arm==='ball'){ball(g,.21,C,x,.5,0,.9,1,1.25);}else if(o.arm==='square'){add(g,puff(.24,.48,D,.1,.09),C,x,.4,0);}else{add(g,puff(.24,.36,D,.1,.09),C,x,.33,0);const r=add(g,new T.CylinderGeometry(.14,.14,D-.02,14),C,x,.56,0);r.rotation.x=Math.PI/2;}});
  if(o.pillows)o.pillows.forEach((c,i)=>{if(i>=n)return;const sx=n===1?0:(i?1:-1)*W*.24;const p=add(g,puff(.36,.34,.13,.11,.06),M(c),sx,.68,-D/2+.38);p.rotation.x=-.25;p.rotation.z=(i?-1:1)*.12;if(o.star)add(g,ext(starShape(.08,.035),.02,.008,'ps'),M('#f6c453'),sx,.69,-D/2+.46,-.25);});
  if(o.bow){const bm=M(o.bowC||'#f39bb2');[-1,1].forEach(s=>ball(g,.11,bm,s*.12,1.02,-D/2+.18,1.2,.8,.5));ball(g,.06,bm,0,1.02,-D/2+.2);}
}
/* ===== CHAIR ===== */
function chair(g,o){o=Object.assign({c:'#f39bb2',seat:'#fff2e6',frame:'#f2dcbc',back:'round',gold:false},o);const F=o.gold?GOLD():M(o.frame),C=M(o.c);
  taperLegs(g,.52,.5,.42,F,.07,.045);add(g,puff(.58,.1,.55,.14,.05),F,0,.46,0);add(g,puff(.52,.12,.5,.13,.06),M(o.seat),0,.55,.01);
  panel(g,o.back,.56,.62,.1,C,0,.52,-.24);if(o.back==='heart'||o.back==='round'||o.back==='arch')[[-1],[1]].forEach(([s])=>cyl(g,.03,.03,.16,F,s*.2,.58,-.24,10));
  if(o.back==='bow'){ball(g,.07,M('#ffffff'),0,.98,-.17);}if(o.back==='mushroom')[[-.12,1.0],[.1,1.06],[.02,.9]].forEach(([x,y])=>ball(g,.035,M('#ffffff'),x,y,-.18,1,1,.4));
}
/* ===== TABLES ===== */
function lathe(pts,seg=24){return new T.LatheGeometry(pts.map(p=>new T.Vector2(p[0],p[1])),seg);}
function table(g,o){o=Object.assign({shape:'round',c:'#f7c9d4',base:'#f2dcbc',r:.62,h:.72,scallop:null,ped:true,W:1.5,D:.9,mush:false,glass:false},o);const C=o.glass?M('#cfe9f7',{roughness:.2,transparent:true,opacity:.8,bumpScale:0}):M(o.c),Bm=M(o.base),h=o.h;
  if(o.shape==='rect'){add(g,puff(o.W,.1,o.D,.1,.045),C,0,h,0);add(g,puff(o.W-.12,.08,o.D-.12,.08,.035),Bm,0,h-.08,0);taperLegs(g,o.W-.1,o.D-.1,h-.08,Bm,.06,.05);if(o.scallop)beads(g,Math.round(o.W/.1),-o.W/2+.06,o.W/2-.06,h-.06,o.D/2+.005,.04,M(o.scallop));return;}
  if(o.shape==='heart'){const t=add(g,ext(heartShape(o.r),.1,.045,'th'+o.r),C,0,h,0);t.rotation.x=-Math.PI/2;}
  else{const r=o.r;add(g,lathe([[0,h-.05],[r-.04,h-.05],[r,h-.03],[r+.005,h],[r-.01,h+.035],[r-.05,h+.05],[0,h+.05]],32),C,0,0,0);}
  if(o.scallop){const n=Math.round(o.r*2*Math.PI/.11);for(let i=0;i<n;i++){const a=i/n*Math.PI*2;ball(g,.042,M(o.scallop),Math.cos(a)*(o.r-.01),h-.06,Math.sin(a)*(o.r-.01),1,.8,1);}}
  if(o.mush){for(let i=0;i<7;i++){const a=i*2.3,rr2=.15+(i%3)*.15;ball(g,.05,M('#ffffff'),Math.cos(a)*rr2,h+.055,Math.sin(a)*rr2,1,.35,1);}}
  add(g,lathe([[0,0],[.3,0],[.33,.03],[.3,.07],[.12,.12],[.08,.25],[.09,h*.6],[.13,h-.12],[.2,h-.06],[0,h-.06]],40),Bm,0,0,0);
}
/* ===== DRESSER / NIGHTSTAND / WARDROBE ===== */
function dresser(g,o){o=Object.assign({W:1.1,H:.95,D:.52,c:'#f6d6df',front:'#fbe9ee',rows:3,knob:'brass',flower:false,stack:null,doors:false,crown:false},o);const W=o.W,H=o.H,D=o.D,C=M(o.c);
  feet(g,W-.1,D-.1,.06,.14,C,.06);add(g,puff(W,H-.12,D,.08,.07),C,0,.12+(H-.12)/2,0);add(g,puff(W+.06,.07,D+.05,.06,.03),M(o.top||o.c),0,H+.01,0);
  const fz=D/2+.005,inner=W-.14,top=H-.06,bot=.2;
  if(o.doors){const dh=(top-bot)*.72;[-1,1].forEach(s=>{add(g,puff(inner/2-.03,dh,.05,.06,.02),M(o.front),s*(inner/4+.008),top-dh/2-.02,fz);knob(g,o.knob,s*.06,top-dh/2,fz+.02);});const dr=(top-bot)-dh-.06;add(g,puff(inner,dr,.05,.05,.02),M(o.front),0,bot+dr/2,fz);knob(g,o.knob,0,bot+dr/2,fz+.02);}
  else{const n=o.rows,rh=(top-bot)/n;for(let i=0;i<n;i++){const y=bot+rh*(i+.5);const fc=o.stack?o.stack[i%o.stack.length]:o.front;add(g,puff(inner,rh-.045,.05,.05,.02),M(fc),0,y,fz);if(inner>.6){knob(g,o.knob,-inner*.25,y,fz+.02);knob(g,o.knob,inner*.25,y,fz+.02);}else knob(g,o.knob,0,y,fz+.02);}}
  if(o.flower){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;ball(g,.05,M('#ffffff'),-W*.32+Math.cos(a)*.06,H*.75+Math.sin(a)*.06,fz+.04,1,1,.4);}ball(g,.04,M('#f6c453'),-W*.32,H*.75,fz+.05);}
  if(o.crown)panel(g,'arch',W*.9,.32,.08,M(o.c),0,H+.03,-D/2+.06);
}
/* ===== VANITY ===== */
function vanity(g,o){o=Object.assign({W:1.15,D:.5,c:'#f7d2dc',top:'#fff4ec',mirror:'oval',frame:'#e9c46a',bulbs:false,rainbow:false,shell:false,knob:'brass'},o);const W=o.W,D=o.D,C=M(o.c),h=.74;
  taperLegs(g,W-.06,D-.06,h-.06,C,.06,.045);add(g,puff(W,.08,D,.08,.035),M(o.top),0,h,0);add(g,puff(W*.55,.17,D-.06,.06,.04),C,0,h-.13,0);add(g,puff(W*.5,.11,.04,.04,.015),M(o.top),0,h-.13,D/2-.02);knob(g,o.knob,0,h-.13,D/2);
  mirror(g,o,h+.48,-D/2+.06);
  /* two tiny bottles */
  cyl(g,.04,.045,.1,M('#f39bb2',{roughness:.3}),W*.3,h+.09,.02,16);ball(g,.025,GOLD(),W*.3,h+.16,.02);cyl(g,.035,.035,.07,M('#c8b2f2',{roughness:.3}),W*.38,h+.075,.06,16);
}
function mirror(g,o,my,mz){o=Object.assign({mirror:'oval',frame:'#e9c46a'},o);const h=my-.48;const Fm=o.frame==='gold'||o.frame==='#e9c46a'?GOLD():M(o.frame);
  if(o.mirror==='heart'){add(g,ext(heartShape(.36),.06,.03,'mh'),Fm,0,my,mz);add(g,ext(heartShape(.29),.02,.006,'mhg'),GLASS(),0,my+.005,mz+.035);}
  else if(o.mirror==='star'){add(g,ext(starShape(.42,.22),.06,.03,'mst'),Fm,0,my,mz);add(g,ext(starShape(.32,.17),.02,.006,'mstg'),GLASS(),0,my,mz+.035);}
  else if(o.mirror==='arch'||o.rainbow){if(o.rainbow){['#f39bb2','#f6c453','#9fd8b8','#9fcbe6','#c8b2f2'].forEach((c,i)=>{const t=add(g,new T.TorusGeometry(.42-i*.045,.025,6,20,Math.PI),M(c),0,my-.12,mz);});}else panel(g,'arch',.66,.82,.06,Fm,0,my-.42,mz);panel(g,'arch',.52,.68,.02,GLASS(),0,my-.35,mz+.035);}
  else if(o.mirror==='shell'){panel(g,'shell',.78,.7,.07,M(o.frameShell||'#f6c9d6'),0,my-.36,mz);panel(g,'shell',.6,.54,.02,GLASS(),0,my-.3,mz+.04);ball(g,.05,M('#fbf6ee',{roughness:.3,bumpScale:0}),0,my-.38,mz+.07);}
  else{const fr=add(g,new T.TorusGeometry(.3,.045,8,28),Fm,0,my,mz);fr.scale.set(1,1.25,1);const gl=add(g,new T.CircleGeometry(.29,24),GLASS(),0,my,mz+.005);gl.scale.set(1,1.25,1);}
  cyl(g,.03,.035,.18,Fm,0,h+.1,mz,10);
  if(o.bulbs){const bm=new T.MeshBasicMaterial({color:0xfff1c8});for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const b=add(g,SPH(.035),bm,Math.sin(a)*.38,my+Math.cos(a)*.47,mz+.05);b.castShadow=false;}}
}
/* ===== SHELF ===== */
function shelf(g,o){o=Object.assign({W:1.15,H:1.5,D:.42,c:'#f6d6df',back:'#fbe9ee',top:'arch',topC:null,gold:false,books:true},o);const W=o.W,H=o.H,D=o.D,C=M(o.c);
  [-1,1].forEach(s=>add(g,puff(.1,H+.04,D,.05,.04),C,s*(W/2-.05),(H+.04)/2,0));add(g,puff(W-.1,H,.04,.03,.015),M(o.back),0,H/2,-D/2+.03);
  const ys=[.035,.515,.995,H-.02];ys.forEach(y=>add(g,puff(W-.06,.07,D,.035,.03),C,0,y,0));
  if(o.top)panel(g,o.top,W,.34,D*.5,M(o.topC||o.c),0,H+.01,-D*.2);
  if(o.gold)ys.forEach(y=>beads(g,7,-W/2+.12,W/2-.12,y,D/2+.01,.018,GOLD()));
  if(o.books){const cols=['#f39bb2','#9fcbe6','#f6c453','#9fd8b8','#c8b2f2','#f7a88f'];let k=0;[0,1,2].forEach(r=>{const y0=ys[r]+.035;let x=-W/2+.14;const n=r===1?2:3;for(let i=0;i<n;i++){const bh=.24+((k*37)%9)/100,bw=.07+((k*13)%3)/100;const bk=add(g,puff(bw,bh,.22,.025,.018),M(cols[k%6]),x+bw/2,y0+bh/2,.0,0,0,i===n-1&&r!==1?-.25:0);bk.userData.stockBooks=true;x+=bw+.012;k++;}
    if(r===1){cyl(g,.08,.065,.13,M('#e9a07a'),W*.22,y0+.065,0,20).userData.stockBooks=true;for(let j=0;j<5;j++)ball(g,.06,M('#7fbf86'),W*.22+Math.cos(j*1.3)*.05,y0+.17+(j%2)*.04,Math.sin(j*1.3)*.05,1,1.3,1).userData.stockBooks=true;}
    if(r===2)ball(g,.08,M('#fbf6ee'),W*.28,y0+.08,0).userData.stockBooks=true;});}
}
/* ===== LAMP (soft pleated) ===== */
function lamp(g,o){o=Object.assign({c:'#f6c9d6',shade:'#fff4ec',h:.9,mush:false},o);const C=M(o.c);
  add(g,lathe([[0,0],[.18,0],[.2,.03],[.17,.07],[.08,.1],[.07,.2],[.1,.3],[.07,.4],[.04,.45],[.035,o.h-.25],[0,o.h-.25]],32),C,0,0,0);
  const sm=new T.MeshStandardMaterial({color:new T.Color(o.shade).convertSRGBToLinear(),emissive:new T.Color('#ffd9a0'),emissiveIntensity:.55,roughness:.9,side:T.DoubleSide});
  if(o.mush){const cap=add(g,new T.SphereGeometry(.3,32,16,0,Math.PI*2,0,Math.PI/2),sm,0,o.h-.28,0);cap.scale.y=.75;for(let i=0;i<6;i++){const a=i*1.1;ball(g,.04,M('#ffffff'),Math.cos(a)*.2,o.h-.1+(i%2)*.04,Math.sin(a)*.2,1,.4,1);}return;}
  const geo=new T.CylinderGeometry(.17,.27,.3,32,1,true);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),a=Math.atan2(z,x),k=1+Math.sin(a*16)*.035;pos.setX(i,x*k);pos.setZ(i,z*k);}geo.computeVertexNormals();add(g,geo,sm,0,o.h-.12,0).castShadow=false;
  beads(g,18,0,0,0,0,0,C);/* noop for API symmetry */
}
/* ===== more clay sculpts (Claude, Nov 1) ===== */
const W_=(c)=>M(c),WOOD='#e2b984',CREAM='#fff4ec';
function pot(g,c,x,z,s=1){add(g,lathe([[0,0],[.16*s,0],[.19*s,.04*s],[.2*s,.24*s],[.23*s,.26*s],[.22*s,.3*s],[0,.3*s]],20),M(c),x,0,z);ball(g,.18*s,M('#8a5a3c'),x,.29*s,z,1,.25,1);}
function leafy(g,c,x,y,z,s=1,n=9){for(let i=0;i<n;i++){const a=i*2.4,r=.05+(i%3)*.06;const l=ball(g,.12*s,M(c),x+Math.cos(a)*r*s,y+(.1+(i%4)*.09)*s,z+Math.sin(a)*r*s,.55,1.5,.3);l.rotation.y=a;l.rotation.z=Math.cos(a)*.6;}}
function flowerHead(g,c,x,y,z,s=1,center='#f6c453'){for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ball(g,.04*s,M(c),x+Math.cos(a)*.045*s,y,z+Math.sin(a)*.045*s,1,.5,1);}ball(g,.035*s,M(center),x,y+.01*s,z);}
function rug(g,o){o=Object.assign({shape:'round',c:'#f6c9d6',c2:'#ffffff',w:1.7,d:1.2,rings:true,dots:false,fringe:false},o);const C=M(o.c),C2=M(o.c2);let geo;
  if(o.shape==='rect'){geo=puff(o.w,.04,o.d,.18,.02);add(g,geo,C,0,.02,0);if(o.rings)add(g,puff(o.w-.25,.042,o.d-.25,.12,.02),C2,0,.024,0);}
  else{const s=new T.Shape();if(o.shape==='heart'){return void (()=>{const m=add(g,ext(heartShape(o.w/2),.04,.02,'rh'+o.w),C,0,.025,0);m.rotation.x=-Math.PI/2;if(o.rings){const m2=add(g,ext(heartShape(o.w/2-.2),.042,.02,'rh2'+o.w),C2,0,.03,0);m2.rotation.x=-Math.PI/2;}})();}
    if(o.shape==='star'){const m=add(g,ext(starShape(o.w/2,o.w/4.2),.04,.02,'rst'+o.w),C,0,.025,0);m.rotation.x=-Math.PI/2;if(o.rings){const m2=add(g,ext(starShape(o.w/2-.18,o.w/4.2-.09),.042,.02,'rst2'+o.w),C2,0,.03,0);m2.rotation.x=-Math.PI/2;}g.traverse(m=>{if(m.isMesh)m.castShadow=false;});return;}
    if(o.shape==='rainbow'){['#f39bb2','#f7a88f','#f6c453','#9fd8b8','#9fcbe6','#c8b2f2'].forEach((c,i)=>{const r=o.w/2*(1-i*.15);const m=add(g,new T.CylinderGeometry(r,r,.04+i*.002,32,1,false,0,Math.PI),M(c),0,.02+i*.002,0);m.castShadow=false;});return;}
    if(o.shape==='cloud'||o.shape==='flower'){const n=o.shape==='flower'?6:5;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;const r=o.w*(o.shape==='flower'?.24:.2);const c=add(g,new T.CylinderGeometry(r,r,.04,24),C,Math.cos(a)*o.w*.24,.02,Math.sin(a)*o.d*.24);}add(g,new T.CylinderGeometry(o.w*.3,o.w*.3,.042,28),o.shape==='flower'?M('#f6c453'):C,0,.022,0);return;}
    const r=add(g,new T.CylinderGeometry(o.w/2,o.w/2,.04,40),C,0,.02,0);r.scale.z=o.d/o.w;if(o.rings){[.72,.44].forEach((k,i)=>{const m=add(g,new T.CylinderGeometry(o.w/2*k,o.w/2*k,.044+i*.002,36),i?C:C2,0,.022+i*.002,0);m.scale.z=o.d/o.w;});}}
  if(o.dots)for(let i=0;i<10;i++){const a=i*2.1,rr2=.2+(i%3)*.17;ball(g,.05,C2,Math.cos(a)*rr2*o.w/1.7,.045,Math.sin(a)*rr2*o.d/1.7,1,.25,1);}
  if(o.fringe)for(let i=0;i<14;i++){[-1,1].forEach(s=>ball(g,.025,C2,-o.w/2+.1+i*(o.w-.2)/13,.02,s*(o.d/2+.02),1,.4,1));}
  g.traverse(m=>{if(m.isMesh)m.castShadow=false;});}
function plant(g,o){o=Object.assign({kind:'leafy',pot:'#e9a07a',c:'#7fbf86',petal:'#f39bb2',s:1},o);const s=o.s;
  if(o.kind==='tree'){cyl(g,.08,.12,1.1,M('#a7774f'),0,.55,0);[[0,1.4,0,.42],[-.28,1.2,.1,.32],[.3,1.25,-.05,.33],[.05,1.65,.05,.3]].forEach(([x,y,z,r])=>ball(g,r,M(o.c),x,y,z));for(let i=0;i<6;i++)ball(g,.05,M(o.petal),Math.cos(i)*.38,1.25+(i%3)*.15,Math.sin(i)*.38);return;}
  if(o.kind==='topiary'){pot(g,o.pot,0,0,1.2);cyl(g,.025,.03,.5,M('#a7774f'),0,.55,0);ball(g,.28,M(o.c),0,.95,0);return;}
  if(o.kind==='rosebush'||o.kind==='bush'){ball(g,.4,M(o.c),0,.32,0,1.2,.85,1);ball(g,.3,M(o.c),.3,.28,.1);ball(g,.3,M(o.c),-.3,.26,-.05);if(o.kind==='rosebush')for(let i=0;i<9;i++){const a=i*2.3;ball(g,.06,M(o.petal),Math.cos(a)*.42,.3+(i%3)*.14,Math.sin(a)*.32);}return;}
  if(o.kind==='patch'){add(g,puff(1.1,.16,.7,.1,.06),M('#a8744f'),0,.08,0);for(let i=0;i<6;i++){const x=-.4+(i%3)*.4,z=i<3?-.15:.15;leafy(g,o.c,x,.12,z,.6,4);ball(g,.06,M(o.petal),x+.06,.2,z+.08,1,1.2,1);}return;}
  if(o.kind!=='succulent')pot(g,o.pot,0,0,s);const top=.3*s;
  if(o.kind==='cactus'){const c=M(o.c);ball(g,.12*s,c,0,top+.22*s,0,1,2.2,1);ball(g,.06*s,c,.13*s,top+.25*s,0,1,1.8,1);ball(g,.05*s,c,-.12*s,top+.18*s,0,1,1.6,1);flowerHead(g,o.petal,0,top+.48*s,0,.6*s);}
  else if(o.kind==='flowers'||o.kind==='tulip'||o.kind==='daisy'||o.kind==='sunflower'){leafy(g,o.c,0,top-.05,0,s*.8,6);const n=o.kind==='sunflower'?3:5;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=Math.cos(a)*.09*s,z=Math.sin(a)*.09*s,h=top+(.3+(i%2)*.1)*s;cyl(g,.01,.012,h-top,M('#6aa66f'),x,top+(h-top)/2,z,6);if(o.kind==='tulip')ball(g,.06*s,M(o.petal),x,h,z,1,1.3,1);else flowerHead(g,o.kind==='daisy'?'#ffffff':o.kind==='sunflower'?'#f6c453':o.petal,x,h,z,s*(o.kind==='sunflower'?1.4:1),o.kind==='sunflower'?'#8a5a3c':'#f6c453');}}
  else if(o.kind==='monstera'){for(let i=0;i<6;i++){const a=i*1.05;const l=add(g,ext(heartShape(.14*s),.02,.008,'mon'+s),M(o.c),Math.cos(a)*.1*s,top+(.25+(i%3)*.1)*s,Math.sin(a)*.1*s);l.rotation.y=-a;l.rotation.x=-.6;}}
  else if(o.kind==='hanging'){leafy(g,o.c,0,top-.05,0,s,7);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;for(let k=0;k<4;k++)ball(g,.045*s,M(o.c),Math.cos(a)*(.18+k*.02)*s,top-.02-k*.08*s,Math.sin(a)*(.18+k*.02)*s,1,.8,1);}}
  else if(o.kind==='succulent'){[-.26,0,.26].forEach((x,i)=>{pot(g,['#f6c9d6','#9fd8b8','#fff4ec'][i],x*s,0,.5*s);for(let k=0;k<7;k++){const a=k/7*Math.PI*2;ball(g,.06*s,M(o.c),x*s+Math.cos(a)*.05*s,.2*s,Math.sin(a)*.05*s,.8,.7,1.6).rotation.y=-a;}ball(g,.05*s,M(o.c),x*s,.24*s,0);});}
  else leafy(g,o.c,0,top-.05,0,s);}
function light(g,o){o=Object.assign({kind:'table',c:'#f6c9d6',shade:'#fff4ec'},o);const C=M(o.c);
  const glow=(c)=>new T.MeshStandardMaterial({color:new T.Color(c).convertSRGBToLinear(),emissive:new T.Color('#ffd9a0'),emissiveIntensity:.6,roughness:.9,side:T.DoubleSide});
  const pleat=(r1,r2,h,y,c)=>{const geo=new T.CylinderGeometry(r1,r2,h,32,1,true);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x),k=1+Math.sin(a*16)*.035;p.setX(i,x*k);p.setZ(i,z*k);}geo.computeVertexNormals();const m=add(g,geo,glow(c),0,y,0);m.castShadow=false;return m;};
  if(o.kind==='floor'){add(g,lathe([[0,0],[.22,0],[.24,.03],[.2,.06],[0,.06]],24),C,0,0,0);cyl(g,.025,.025,1.4,C,0,.75,0,10);pleat(.2,.3,.34,1.5,o.shade);return;}
  if(o.kind==='pendant'||o.kind==='chandelier'){cyl(g,.012,.012,.6,M('#c9a46a'),0,1.9,0,6);if(o.kind==='chandelier'){for(let i=0;i<6;i++){const a=i/6*Math.PI*2;add(g,new T.TorusGeometry(.22,.012,6,24,Math.PI),GOLD(),0,1.55,0).rotation.y=a;ball(g,.05,glow('#fff4d6'),Math.cos(a)*.22,1.58,Math.sin(a)*.22);}for(let i=0;i<8;i++)ball(g,.025,M('#dcecf6',{roughness:.1,bumpScale:0}),Math.cos(i)*.15,1.42-(i%3)*.04,Math.sin(i)*.15);}else{const sh=add(g,new T.SphereGeometry(.24,24,12,0,Math.PI*2,0,Math.PI/2),glow(o.shade),0,1.45,0);sh.scale.y=.8;ball(g,.07,glow('#fff1c8'),0,1.42,0);}return;}
  if(o.kind==='sconce'){add(g,puff(.14,.24,.05,.06,.02),C,0,1.4,.03);const arm=add(g,new T.TorusGeometry(.07,.015,6,12,Math.PI/2),C,0,1.46,.07);arm.rotation.y=Math.PI/2;const sh=add(g,lathe([[0,0],[.03,0],[.09,.1],[.1,.12],[.085,.12],[.03,.02],[0,.02]],18),glow(o.shade),0,1.52,.14);sh.castShadow=false;return;}
  if(o.kind==='lantern'){for(let i=0;i<3;i++){const x=(i-1)*.45;cyl(g,.008,.008,.5,M('#c9a46a'),x,1.85,0,6);const l=ball(g,.17,glow(['#f6c9d6','#fff4d6','#c8b2f2'][i]),x,1.5,0,1,1.15,1);l.castShadow=false;}return;}
  if(o.kind==='moon'){add(g,lathe([[0,0],[.16,0],[.18,.03],[.15,.05],[0,.05]],20),C,0,0,0);cyl(g,.02,.02,.35,C,0,.22,0,8);const m=add(g,new T.TorusGeometry(.18,.08,12,24,Math.PI*1.25),glow('#fff1c8'),0,.62,0);m.rotation.z=.6;m.castShadow=false;return;}
  if(o.kind==='bunny'){const b=ball(g,.2,glow(o.shade),0,.22,0,1,1.05,.95);b.castShadow=false;[-1,1].forEach(s=>{const e=ball(g,.06,glow(o.shade),s*.08,.48,0,.8,2.2,.6);e.rotation.z=-s*.15;});ball(g,.02,M('#4a2338'),-.07,.27,.18);ball(g,.02,M('#4a2338'),.07,.27,.18);ball(g,.03,M('#f39bb2'),0,.22,.19,1,.7,.5);return;}
  if(o.kind==='lava'){add(g,lathe([[0,0],[.13,0],[.1,.15],[0,.15]],18),C,0,0,0);const gl=add(g,lathe([[0,.15],[.08,.15],[.11,.4],[.06,.62],[0,.62]],18),new T.MeshStandardMaterial({color:new T.Color('#c8b2f2').convertSRGBToLinear(),emissive:new T.Color('#f39bb2'),emissiveIntensity:.5,transparent:true,opacity:.8,roughness:.2}),0,0,0);gl.castShadow=false;[.25,.38,.5].forEach((y,i)=>ball(g,.035+i*.01,new T.MeshBasicMaterial({color:0xff8fb8}),(i-1)*.02,y,0));add(g,lathe([[0,.62],[.06,.62],[.04,.7],[0,.7]],14),C,0,0,0);return;}
  if(o.kind==='string'){[-1,1].forEach(s=>cyl(g,.02,.025,1.5,M(WOOD),s*.6,.75,0,8));const P=[];for(let i=0;i<=12;i++){const t=i/12;P.push(new T.Vector3(-.6+t*1.2,1.45-Math.sin(t*Math.PI)*.25,0));}add(g,new T.TubeGeometry(new T.CatmullRomCurve3(P),24,.006,4,false),M('#5a4038'),0,0,0);P.forEach((p,i)=>{if(i%2===0&&i>0&&i<12){const b=ball(g,.04,new T.MeshBasicMaterial({color:0xffe09a}),p.x,p.y-.05,p.z);b.castShadow=false;}});return;}
  if(o.kind==='neon'){add(g,puff(1.0,.62,.04,.12,.02),M('#fff4ec'),0,1.45,.02);['#ff7eb6','#f6c453','#7fd1a8','#7cc4f2','#c8a2ff'].forEach((c,i)=>{const t=add(g,new T.TorusGeometry(.38-i*.055,.018,6,24,Math.PI),new T.MeshBasicMaterial({color:new T.Color(c)}),0,1.25,.06);t.castShadow=false;});return;}
  if(o.kind==='cloud'){cyl(g,.01,.01,.5,M('#c9a46a'),0,1.95,0,6);[[0,0,.2],[-.2,-.03,.15],[.2,-.03,.15],[.1,.08,.14]].forEach(([x,y,r])=>{const b=ball(g,r,glow('#ffffff'),x,1.6+y,0);b.castShadow=false;});return;}
  add(g,lathe([[0,0],[.15,0],[.17,.03],[.14,.06],[.09,.1],[.12,.22],[.09,.34],[.04,.4],[0,.4]],20),C,0,0,0);pleat(.14,.22,.24,.5,o.shade);}
function appliance(g,o){o=Object.assign({kind:'stove',c:'#fdf3ea',a:'#f39bb2'},o);const C=M(o.c),A=M(o.a);
  if(o.kind==='stove'||o.kind==='oven'){add(g,puff(.95,.88,.68,.1,.07),C,0,.48,0);add(g,puff(.95,.05,.68,.04,.02),M('#5a4a48'),0,.94,0);[[-.22,-.14],[.22,-.14],[-.22,.14],[.22,.14]].forEach(([x,z])=>{const r=add(g,new T.TorusGeometry(.09,.018,6,18),M('#3a2e2c'),x,.975,z);r.rotation.x=Math.PI/2;});
    add(g,puff(.7,.42,.04,.08,.02),M('#3c3236',{roughness:.3}),0,.42,.345);add(g,puff(.6,.06,.06,.03,.02),GOLD(),0,.7,.37);for(let i=0;i<4;i++)ball(g,.04,A,-.3+i*.2,.82,.35,1,1,.7);if(o.kind==='oven')add(g,ext(heartShape(.08),.02,.008,'ovh'),A,0,.42,.37);add(g,puff(.95,.3,.08,.04,.03),C,0,1.1,-.31);return;}
  if(o.kind==='sink'){add(g,puff(1.0,.86,.62,.08,.06),C,0,.45,0);add(g,puff(1.04,.07,.66,.05,.025),M('#fff4ec'),0,.91,0);const b=add(g,puff(.55,.06,.38,.12,.02),M('#cfe6f0',{roughness:.3}),0,.925,0);cyl(g,.025,.025,.3,GOLD(),0,1.06,-.22,10);const sp=add(g,new T.TorusGeometry(.09,.022,8,16,Math.PI),GOLD(),0,1.2,-.14);sp.rotation.y=Math.PI/2;[-1,1].forEach(s=>add(g,puff(.44,.6,.04,.06,.02),M(o.a),s*.24,.42,.31));[-1,1].forEach(s=>knob(g,'heart',s*.06,.6,.32));return;}
  if(o.kind==='mixer'){add(g,puff(.36,.08,.24,.06,.03),A,0,.04,0);add(g,puff(.1,.4,.12,.05,.04),A,0,.26,-.08);add(g,puff(.32,.14,.18,.08,.05),A,0,.5,-.02);add(g,lathe([[0,0],[.1,0],[.15,.18],[0,.18]],20),M('#e8eef2',{roughness:.3,metalness:.4}),0,.08,.06);return;}
  if(o.kind==='toaster'){add(g,puff(.42,.28,.24,.1,.06),A,0,.16,0);[-.08,.08].forEach(x=>{add(g,puff(.06,.02,.18,.02,.008),M('#5a4a48'),x,.3,0);add(g,puff(.05,.12,.14,.02,.01),M('#e2b06a'),x,.36,0);});ball(g,.03,M('#ffffff'),.23,.18,0);return;}
  if(o.kind==='coffee'){add(g,puff(.36,.08,.3,.06,.03),A,0,.04,0);add(g,puff(.36,.5,.14,.08,.05),A,0,.3,-.08);add(g,puff(.36,.1,.3,.06,.04),A,0,.55,0);add(g,lathe([[0,0],[.05,0],[.06,.09],[0,.09]],14),M('#ffffff'),0,.08,.06);ball(g,.03,M('#ffffff'),0,.42,.0);return;}
  if(o.kind==='cupcakecase'){add(g,puff(.9,.06,.5,.04,.03),C,0,.18,0);add(g,puff(.9,.2,.5,.06,.04),C,0,.08,0);add(g,puff(.9,.08,.5,.05,.03),C,0,.92,0);add(g,puff(.9,.8,.05,.04,.02),C,0,.55,-.23);[-1,1].forEach(sd=>add(g,puff(.06,.8,.5,.03,.02),C,sd*.42,.55,0));{const gp=add(g,puff(.8,.56,.04,.06,.02),new T.MeshStandardMaterial({color:0xe7f3f8,roughness:.05,transparent:true,opacity:.22,depthWrite:false}),0,.62,.27);gp.castShadow=false;gp.renderOrder=3;}[.42,.72].forEach(y=>{add(g,puff(.8,.03,.44,.02,.01),M('#ffffff'),0,y,0);for(let i=0;i<4;i++){const x=-.3+i*.2;add(g,lathe([[0,0],[.05,0],[.065,.07],[0,.07]],12),M(['#f39bb2','#9fcbe6','#f6c453','#c8b2f2'][i]),x,y+.015,0);ball(g,.055,M('#fff4ec'),x,y+.11,0,1,.8,1);}});return;}
  if(o.kind==='icecreamcart'){add(g,puff(1.0,.6,.6,.1,.07),C,0,.5,0);[-1,1].forEach(s=>{const w=add(g,new T.TorusGeometry(.14,.05,8,18),M('#f39bb2'),s*.32,.15,.3);});cyl(g,.02,.02,1.0,M('#ffffff'),.4,1.1,0,8);const um=add(g,new T.ConeGeometry(.6,.25,16,1,true),M('#f39bb2',{side:T.DoubleSide}),.0,1.65,0);for(let i=0;i<3;i++){ball(g,.09,M(['#f6c9d6','#fff1c8','#c9a27a'][i]),-.25+i*.25,.88,.05);}return;}
  if(o.kind==='minifridge'){add(g,puff(.6,.85,.55,.1,.07),C,0,.45,0);add(g,puff(.5,.05,.04,.02,.015),A,0,.6,.28);add(g,puff(.05,.2,.05,.02,.015),GOLD(),.2,.45,.3);if(o.heart)add(g,ext(heartShape(.08),.02,.008,'mfh'),A,0,.72,.29);return;}}
function bath(g,o){o=Object.assign({kind:'tub',c:'#ffffff',a:'#f6c9d6'},o);const C=M(o.c),A=M(o.a);
  if(o.kind==='tub'){add(g,lathe([[0,.15],[.5,.15],[.62,.3],[.66,.55],[.6,.6],[.52,.5],[0,.5]],30),C,0,0,0).scale.set(1.35,1,.7);const w=add(g,new T.CylinderGeometry(.48,.48,.03,24),M('#bfe3f5',{roughness:.1,transparent:true,opacity:.85,bumpScale:0}),0,.48,0);w.scale.set(1.35,1,.7);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>foot(g,.06,.18,GOLD(),a*.6,b*.25));for(let i=0;i<6;i++)ball(g,.06+(i%3)*.02,M('#ffffff',{roughness:.6}),-.3+i*.12,.53,(i%2)*.1-.05);cyl(g,.02,.02,.3,GOLD(),-.78,.6,0,8);return;}
  if(o.kind==='toilet'){add(g,lathe([[0,0],[.16,0],[.13,.15],[.2,.3],[.22,.38],[0,.38]],22),C,0,0,.05).scale.z=1.25;add(g,new T.TorusGeometry(.17,.035,8,22),A,0,.4,.07).rotation.x=Math.PI/2;add(g,puff(.48,.4,.2,.08,.06),C,0,.6,-.2);add(g,puff(.5,.05,.22,.04,.02),A,0,.82,-.2);ball(g,.03,GOLD(),.18,.72,-.09);return;}
  if(o.kind==='sink'){add(g,lathe([[0,0],[.14,0],[.08,.1],[.07,.6],[.12,.7],[0,.7]],20),C,0,0,0);add(g,lathe([[0,.66],[.32,.68],[.36,.8],[.3,.82],[0,.74]],26),C,0,0,0).scale.z=.75;cyl(g,.02,.02,.16,GOLD(),0,.9,-.18,8);add(g,new T.TorusGeometry(.06,.016,6,14,Math.PI),GOLD(),0,.98,-.13).rotation.y=Math.PI/2;return;}
  if(o.kind==='shower'){add(g,puff(.9,.12,.9,.12,.05),C,0,.06,0);const gl=new T.MeshStandardMaterial({color:new T.Color('#dcecf6').convertSRGBToLinear(),transparent:true,opacity:.35,roughness:.1});[[0,.4,0,.9],[ -.45,0,Math.PI/2,.9]].forEach(([x,z,ry,w])=>{const p=add(g,new T.PlaneGeometry(w,1.7),gl,x,1.0,z+(z?0:.44));p.rotation.y=ry;p.castShadow=false;});cyl(g,.02,.02,1.7,GOLD(),.38,1.0,-.38,8);const h=add(g,new T.CylinderGeometry(.12,.08,.04,20),GOLD(),.25,1.82,-.25);h.rotation.x=.4;return;}
  if(o.kind==='mirror'){const fr=add(g,new T.TorusGeometry(.32,.05,10,30),A,0,1.4,.04);fr.scale.y=1.2;const gl=add(g,new T.CircleGeometry(.31,26),GLASS(),0,1.4,.03);gl.scale.y=1.2;return;}
  if(o.kind==='rack'){[-1,1].forEach(s=>cyl(g,.025,.03,1.1,GOLD(),s*.3,.55,0,8));[.7,1.0].forEach(y=>{cyl(g,.02,.02,.62,GOLD(),0,y,0,8).rotation.z=Math.PI/2;});add(g,puff(.5,.42,.06,.06,.03),A,0,.82,.04);add(g,puff(.44,.3,.06,.06,.03),M('#9fd8b8'),0,.6,-.03);return;}
  if(o.kind==='hamper'){add(g,lathe([[0,0],[.24,0],[.27,.4],[.25,.48],[0,.48]],22),M('#e2b984'),0,0,0);for(let i=0;i<4;i++)add(g,new T.TorusGeometry(.26,.012,6,24),M('#c99367'),0,.1+i*.1,0).rotation.x=Math.PI/2;add(g,puff(.3,.12,.22,.1,.05),M('#f6c9d6'),0,.52,0);return;}}
function mini(g,o){o=Object.assign({kind:'cupcake',c:'#f39bb2',c2:'#fff4ec'},o);const C=M(o.c),C2=M(o.c2);const plate=(r,y=0)=>add(g,lathe([[0,y],[r,y],[r+.02,y+.03],[0,y+.03]],22),M('#ffffff',{roughness:.4}),0,0,0);
  switch(o.kind){
  case 'cupcake':add(g,lathe([[0,0],[.1,0],[.13,.13],[0,.13]],16),C2,0,0,0);ball(g,.12,C,0,.17,0,1,.8,1);ball(g,.07,C,0,.25,0);ball(g,.03,M('#e2385f'),0,.32,0);break;
  case 'cakeplate':add(g,lathe([[0,0],[.12,0],[.04,.04],[.03,.2],[.3,.22],[.3,.25],[0,.25]],22),M('#ffffff',{roughness:.4}),0,0,0);cyl(g,.22,.22,.2,C,0,.36,0,24);cyl(g,.23,.23,.04,C2,0,.47,0,24);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ball(g,.03,M('#e2385f'),Math.cos(a)*.15,.5,Math.sin(a)*.15);}break;
  case 'waffles':plate(.26);for(let i=0;i<4;i++)add(g,puff(.36,.05,.36,.08,.02),M('#e8b46a'),0,.06+i*.055,0).rotation.y=i*.3;ball(g,.06,M('#fff4ec'),0,.29,0,1,.6,1);for(let i=0;i<3;i++)ball(g,.035,M('#e2385f'),Math.cos(i*2)*.08,.3,Math.sin(i*2)*.08);break;
  case 'donuts':cyl(g,.02,.03,.6,M('#ffffff'),0,.3,0,10);[.18,.38,.56].forEach((y,i)=>{const t=add(g,new T.TorusGeometry(.12,.06,10,20),M(['#f39bb2','#c9a27a','#c8b2f2'][i]),0,y,0);t.rotation.x=Math.PI/2;});break;
  case 'macarons':plate(.28);for(let i=0;i<7;i++){const a=i/7*Math.PI*2,c=['#f39bb2','#9fd8b8','#f6c453','#c8b2f2','#9fcbe6'][i%5];[0,.035].forEach((dy,k)=>ball(g,.06,M(k?c:c),Math.cos(a)*.17,.07+dy,Math.sin(a)*.17,1,.4,1));ball(g,.055,M('#fff4ec'),Math.cos(a)*.17,.087,Math.sin(a)*.17,1,.2,1);}break;
  case 'bowl':add(g,lathe([[0,0],[.1,0],[.24,.12],[.26,.16],[0,.06]],22),C,0,0,0);if(o.fruit)for(let i=0;i<5;i++)ball(g,.08,M(['#e2385f','#f6c453','#9fd36a','#f39b4a','#c8b2f2'][i]),Math.cos(i*1.3)*.1,.17+(i%2)*.05,Math.sin(i*1.3)*.1);break;
  case 'milk':add(g,puff(.16,.26,.16,.04,.03),M('#ffffff'),0,.13,0);add(g,ext(shapeOf('gable',.16,.1),.16,.02,'milkt'),M('#9fcbe6'),0,.3,0);add(g,puff(.162,.07,.162,.03,.01),M('#9fcbe6'),0,.15,0);break;
  case 'eggs':add(g,puff(.42,.08,.22,.05,.03),M('#e9d3b4'),0,.04,0);for(let i=0;i<6;i++)ball(g,.045,M('#fff8ee'),-.15+(i%3)*.15,.1,i<3?-.05:.05,1,1.25,1);break;
  case 'apples':add(g,lathe([[0,0],[.2,0],[.25,.16],[0,.16]],18),M('#d4a56d'),0,0,0);for(let i=0;i<5;i++)ball(g,.08,M('#e2385f'),Math.cos(i*1.3)*.1,.2+(i%2)*.04,Math.sin(i*1.3)*.1);cyl(g,.01,.01,.35,M('#c99367'),0,.3,0,6).rotation.z=Math.PI/2;break;
  case 'cheese':plate(.24);{const s=new T.Shape();s.moveTo(0,0);s.lineTo(.26,0);s.lineTo(.13,.2);s.lineTo(0,0);const c=add(g,ext(s,.12,.02,'chz'),M('#f6c453'),0,.1,0);c.rotation.x=-Math.PI/2;for(let i=0;i<3;i++)ball(g,.02,M('#e0a82a'),-.02+i*.04,.16,.02);}break;
  case 'juice':add(g,lathe([[0,0],[.08,0],[.09,.22],[.05,.3],[.03,.36],[0,.36]],18),M('#ffb547',{roughness:.3}),0,0,0);cyl(g,.035,.035,.04,M('#9fd36a'),0,.38,0,12);add(g,puff(.12,.08,.02,.02,.008),M('#ffffff'),0,.15,.085);break;
  case 'bread':add(g,lathe([[0,0],[.18,0],[.24,.12],[0,.12]],18),M('#d4a56d'),0,0,0);for(let i=0;i<3;i++){const b=ball(g,.09,M('#e8b46a'),-.1+i*.1,.16,0,1.6,.8,.9);b.rotation.y=i*.6;}add(g,puff(.3,.02,.2,.04,.01),M('#f6c9d6'),0,.12,.05);break;
  case 'jam':cyl(g,.08,.08,.14,M('#e2385f',{roughness:.3}),0,.07,0,16);cyl(g,.09,.09,.04,M('#f6c9d6'),0,.16,0,16);ball(g,.09,M('#fff4ec'),0,.18,0,1,.3,1);break;
  case 'teapot':ball(g,.17,C,0,.17,0,1.1,.95,1.1);ball(g,.06,C,0,.33,0);ball(g,.03,GOLD(),0,.39,0);{const sp=add(g,new T.CylinderGeometry(.025,.04,.18,10),C,.2,.2,0);sp.rotation.z=-.9;const h=add(g,new T.TorusGeometry(.08,.02,6,14,Math.PI*1.3),C,-.18,.2,0);h.rotation.z=Math.PI/2;}if(o.heart)add(g,ext(heartShape(.05),.01,.005,'tph'),M('#ffffff'),0,.18,.17);break;
  case 'cup':add(g,lathe([[0,0],[.06,0],[.08,.12],[0,.12]],16),C,0,0,0);add(g,new T.TorusGeometry(.035,.012,6,12),C,.085,.06,0);plate(.11,-.01);break;
  case 'plate':plate(.22);ball(g,.12,C,0,.04,0,1,.15,1);break;
  case 'teacups':plate(.28);[-.12,.12].forEach((x,i)=>{add(g,lathe([[0,0],[.05,0],[.07,.08],[0,.08]],14),M(i?'#c8b2f2':C.color?o.c:'#f39bb2'),x,.03,0);add(g,new T.TorusGeometry(.03,.01,5,10),M('#ffffff'),x+.07,.07,0);});break;
  case 'jar':add(g,lathe([[0,0],[.1,0],[.12,.08],[.11,.22],[.07,.26],[0,.26]],18),M('#e7f3f8',{transparent:true,opacity:.7,roughness:.1,bumpScale:0}),0,0,0);for(let i=0;i<5;i++)ball(g,.04,M(['#c9a27a','#f39bb2','#f6c453'][i%3]),Math.cos(i)*.04,.05+i*.035,Math.sin(i)*.04,1.3,.5,1.3);cyl(g,.075,.075,.04,C,0,.28,0,14);break;
  case 'cookiejar':add(g,lathe([[0,0],[.14,0],[.17,.12],[.15,.3],[.1,.33],[0,.33]],20),M('#e7f3f8',{transparent:true,opacity:.7,roughness:.1,bumpScale:0}),0,0,0);for(let i=0;i<5;i++)cyl(g,.06,.06,.015,M('#c9a27a'),Math.cos(i)*.03,.04+i*.05,Math.sin(i)*.03,14);ball(g,.11,C,0,.35,0,1,.4,1);ball(g,.035,C,0,.42,0);break;
  case 'spicerack':add(g,puff(.5,.36,.12,.04,.02),M(WOOD),0,.18,-.04);[.08,.24].forEach(y=>{for(let i=0;i<4;i++){cyl(g,.035,.035,.11,M(['#e2385f','#f6c453','#9fd36a','#c9a27a'][(i+(y>.1?1:0))%4]),-.18+i*.12,y+.06,.04,10);}});break;
  case 'crock':add(g,lathe([[0,0],[.1,0],[.12,.22],[0,.22]],18),C,0,0,0);[[-.03,.4],[.03,.42],[0,.38]].forEach(([x,h],i)=>{cyl(g,.012,.012,h,M(['#c99367','#f39bb2','#9fcbe6'][i]),x,h/2+.05,0,6);ball(g,.04,M(['#c99367','#f39bb2','#9fcbe6'][i]),x,h+.05,0,1,1.5,.5);});break;
  case 'tray':add(g,puff(.6,.05,.4,.1,.02),C,0,.025,0);[-1,1].forEach(s=>add(g,puff(.04,.06,.4,.02,.015),C,s*.3,.06,0));mini(g,{kind:'cup',c:o.c2});break;
  case 'soap':add(g,lathe([[0,0],[.18,.0],[.2,.04],[0,.04]],18),M('#bfe3f5'),0,0,0).scale.z=.7;add(g,puff(.2,.07,.12,.05,.03),C,0,.07,0);for(let i=0;i<3;i++)ball(g,.03,M('#ffffff',{roughness:.5}),-.05+i*.05,.12,.02*(i-1));break;
  case 'towels':[0,1,2].forEach(i=>add(g,puff(.42,.08,.3,.06,.035),M(['#f6c9d6','#9fd8b8','#fff4ec'][i]),0,.04+i*.085,0));add(g,ext(heartShape(.04),.01,.004,'twh'),M('#f39bb2'),0,.21,.155);break;
  case 'toothbrush':add(g,lathe([[0,0],[.06,0],[.07,.16],[0,.16]],14),C,0,0,0);[[-.02,'#9fcbe6'],[.025,'#f39bb2']].forEach(([x,c])=>{cyl(g,.01,.01,.22,M(c),x,.24,0,6).rotation.z=x*4;ball(g,.015,M('#ffffff'),x*1.6,.36,0,1,1.6,1);});break;
  case 'duck':ball(g,.15,M('#f6d24a'),0,.13,0,1.15,.9,1);ball(g,.1,M('#f6d24a'),.1,.28,0);add(g,new T.ConeGeometry(.04,.08,10),M('#f39b4a'),.21,.27,0).rotation.z=-Math.PI/2;ball(g,.015,M('#2a1622'),.15,.32,.06);ball(g,.015,M('#2a1622'),.15,.32,-.06);break;
  case 'perfume':[[-.08,'#f39bb2',.16],[.08,'#c8b2f2',.12]].forEach(([x,c,h])=>{add(g,lathe([[0,0],[.06,0],[.07,h*.8],[.03,h],[0,h]],14),M(c,{roughness:.2,transparent:true,opacity:.85}),x,0,0);ball(g,.03,GOLD(),x,h+.03,0);});break;
  case 'makeup':add(g,puff(.3,.05,.2,.05,.02),M('#f6c9d6'),0,.025,0);[['#e2385f',-.08],['#f39bb2',0],['#c8b2f2',.08]].forEach(([c,x])=>cyl(g,.03,.03,.02,M(c),x,.06,0,12));cyl(g,.015,.015,.14,M('#e2385f'),.18,.07,.05,8);break;
  case 'jewels':add(g,puff(.3,.12,.22,.05,.03),M('#f39bb2'),0,.06,0);add(g,new T.TorusGeometry(.07,.015,6,18),GOLD(),0,.15,0).rotation.x=Math.PI/2.3;[-1,0,1].forEach(i=>ball(g,.02,M(['#7cc4f2','#e2385f','#9fd36a'][i+1],{roughness:.1}),i*.05,.14,.08));break;
  case 'brush':cyl(g,.02,.025,.24,M('#f39bb2'),0,.12,0,8).rotation.z=Math.PI/2;ball(g,.08,M('#f6c9d6'),.18,.05,0,1,.6,1.2);break;
  case 'bows':[[-.08,'#f39bb2'],[.1,'#9fcbe6']].forEach(([x,c])=>{[-1,1].forEach(s=>ball(g,.05,M(c),x+s*.05,.04,0,1.2,.7,.8));ball(g,.025,M(c),x,.04,0);});break;
  case 'nailpolish':[[-.1,'#e2385f'],[0,'#c8b2f2'],[.1,'#9fd8b8']].forEach(([x,c])=>{add(g,lathe([[0,0],[.035,0],[.04,.06],[0,.08]],12),M(c,{roughness:.2}),x,0,0);cyl(g,.015,.015,.07,M('#2a1622'),x,.11,0,8);});break;
  case 'books':for(let i=0;i<4;i++)add(g,puff(.34,.07,.24,.03,.02),M(['#f39bb2','#9fcbe6','#f6c453','#c8b2f2'][i]),(i%2)*.02,.035+i*.072,0).rotation.y=(i-1.5)*.08;break;
  case 'bookset':[-.12,-.04,.04,.12].forEach((x,i)=>add(g,puff(.07,.3+(i%2)*.04,.22,.02,.015),M(['#f39bb2','#9fcbe6','#f6c453','#9fd8b8'][i]),x,.16,0));[-1,1].forEach(s=>add(g,ext(heartShape(.07),.04,.01,'bse'),M('#fff4ec'),s*.2,.1,0));break;
  case 'diary':add(g,puff(.3,.06,.24,.03,.02),C,0,.03,0);add(g,ext(heartShape(.06),.015,.005,'dh'),GOLD(),0,.065,0).rotation.x=-Math.PI/2;add(g,puff(.04,.07,.06,.01,.01),GOLD(),.15,.03,0);break;
  case 'trophy':add(g,puff(.22,.08,.22,.03,.02),M('#fff4ec'),0,.04,0);cyl(g,.03,.04,.12,GOLD(),0,.14,0,10);add(g,lathe([[0,0],[.04,0],[.12,.08],[.13,.18],[0,.16]],16),GOLD(),0,.2,0);[-1,1].forEach(s=>add(g,new T.TorusGeometry(.04,.012,6,12,Math.PI),GOLD(),s*.13,.3,0).rotation.z=-s*Math.PI/2);add(g,ext(starShape(.04,.018),.01,.004,'trs'),M('#f39bb2'),0,.3,.12);break;
  case 'candles':plate(.18);[[-.06,.18,'#f6c9d6'],[.06,.13,'#fff4ec'],[0,.1,'#c8b2f2']].forEach(([x,h,c])=>{cyl(g,.035,.035,h,M(c),x,.03+h/2,x?0:.06,12);const f=ball(g,.018,new T.MeshBasicMaterial({color:0xffc06a}),x,.06+h,x?0:.06,1,1.6,1);f.castShadow=false;});break;
  case 'fairyjar':{const jj=add(g,lathe([[0,0],[.1,0],[.12,.2],[.08,.26],[0,.26]],18),new T.MeshStandardMaterial({color:0xe7f3f8,transparent:true,opacity:.25,roughness:.05,depthWrite:false}),0,0,0);jj.castShadow=false;jj.renderOrder=3;}for(let i=0;i<6;i++){const b=ball(g,.018,new T.MeshBasicMaterial({color:0xffe09a}),Math.cos(i*1.7)*.05,.06+i*.03,Math.sin(i*1.7)*.05);b.castShadow=false;}cyl(g,.06,.06,.03,M(WOOD),0,.28,0,12);break;
  case 'frame':add(g,puff(.4,.5,.05,.06,.02),C,0,.25,0);add(g,puff(.3,.4,.02,.03,.008),M('#bfe3f5'),0,.26,.025);ball(g,.08,M('#f39bb2'),0,.26,.04,1,1,.2);break;
  case 'gift':add(g,puff(.3,.26,.3,.04,.03),C,0,.13,0);add(g,puff(.06,.27,.31,.02,.01),C2,0,.135,0);add(g,puff(.31,.27,.06,.02,.01),C2,0,.135,0);[-1,1].forEach(s=>ball(g,.06,C2,s*.05,.3,0,1.2,.7,.7));break;
  case 'hat':add(g,new T.ConeGeometry(.12,.32,18),C,0,.16,0);for(let i=0;i<4;i++)ball(g,.018,M(['#f6c453','#9fcbe6','#ffffff','#c8b2f2'][i]),Math.cos(i*1.6)*.07,.08+i*.04,Math.sin(i*1.6)*.07+.02);ball(g,.04,M('#ffffff'),0,.34,0);add(g,new T.TorusGeometry(.11,.025,6,18),C2,0,.02,0).rotation.x=Math.PI/2;break;
  case 'snowglobe':add(g,lathe([[0,0],[.16,0],[.15,.1],[0,.1]],20),M(WOOD),0,0,0);const gl=ball(g,.16,M('#e7f3f8',{transparent:true,opacity:.45,roughness:.05,bumpScale:0}),0,.24,0);gl.castShadow=false;add(g,ext(shapeOf('gable',.1,.1),.08,.01,'sgh'),M('#f39bb2'),0,.17,0);for(let i=0;i<8;i++)ball(g,.01,M('#ffffff'),Math.cos(i*2)*.08,.2+(i%4)*.04,Math.sin(i*2)*.08);break;
  case 'seastar':{const s=add(g,ext(starShape(.22,.1),.06,.03,'sst'),C,0,.05,0);s.rotation.x=-Math.PI/2;for(let i=0;i<8;i++)ball(g,.015,M('#ffffff'),Math.cos(i*.8)*.08,.09,Math.sin(i*.8)*.08);}break;
  case 'starstand':cyl(g,.02,.02,.4,GOLD(),0,.2,0,8);add(g,lathe([[0,0],[.12,0],[.1,.03],[0,.03]],16),GOLD(),0,0,0);add(g,ext(starShape(.22,.1),.07,.03,'stst'),C,0,.55,0);break;
  case 'bowstand':[-1,1].forEach(s=>ball(g,.17,C,s*.17,.35,0,1.2,.85,.5));ball(g,.07,C,0,.35,0);[-1,1].forEach(s=>{const t=ball(g,.06,C,s*.08,.15,0,.7,2,.5);t.rotation.z=s*.3;});break;
  case 'vase':add(g,lathe([[0,0],[.09,0],[.13,.12],[.09,.26],[.06,.32],[.08,.35],[0,.35]],20),C,0,0,0);for(let i=0;i<3;i++){cyl(g,.008,.008,.25,M('#6aa66f'),(i-1)*.04,.45,0,6);flowerHead(g,['#f39bb2','#fff4ec','#f6c453'][i],(i-1)*.05,.58+(i%2)*.03,0,.8);}break;
  case 'claylamp':light(g,{kind:'table',c:o.c,shade:o.c2});break;
  case 'jellyfish':cyl(g,.008,.008,.4,M('#c9a46a'),0,1.9,0,6);{const b=add(g,new T.SphereGeometry(.24,22,12,0,Math.PI*2,0,Math.PI/2),M(o.c),0,1.55,0);b.scale.y=.8;}for(let i=0;i<7;i++){const a=i/7*Math.PI*2;for(let k=0;k<4;k++)ball(g,.025,M(o.c2),Math.cos(a)*.15,1.5-k*.09,Math.sin(a)*.15);}break;
  case 'hairclips':break;
  }}
function cake(g,o){o=Object.assign({tiers:[['#f39bb2',.28,.2],['#fff4ec',.2,.16]],stand:true,topper:'candle',drip:'#ffffff'},o);let y=0;
  if(o.stand){add(g,lathe([[0,0],[.16,0],[.05,.05],[.04,.18],[.38,.2],[.38,.23],[0,.23]],24),M('#ffffff',{roughness:.4}),0,0,0);y=.23;}
  o.tiers.forEach(([c,r,h])=>{cyl(g,r,r,h,M(c),0,y+h/2,0,28);for(let i=0;i<Math.round(r*40);i++){const a=i/Math.round(r*40)*Math.PI*2;ball(g,.03,M(o.drip),Math.cos(a)*r,y+h-.02,Math.sin(a)*r,1,1.4,1);}y+=h;});
  if(o.topper==='candle'){cyl(g,.018,.018,.12,M('#9fcbe6'),0,y+.06,0,8);const f=ball(g,.02,new T.MeshBasicMaterial({color:0xffc06a}),0,y+.14,0,1,1.6,1);f.castShadow=false;}
  else if(o.topper==='strawberry'){ball(g,.06,M('#e2385f'),0,y+.05,0,1,1.2,1);}else if(o.topper==='scoops'){[['#f6c9d6',0],['#fff1c8',.1],['#c9a27a',.2]].forEach(([c,dy])=>ball(g,.1,M(c),0,y+.07+dy,0));ball(g,.035,M('#e2385f'),0,y+.33,0);}
  else if(o.topper==='star')add(g,ext(starShape(.08,.035),.02,.008,'cks'),GOLD(),0,y+.1,0);}
function party(g,o){o=Object.assign({kind:'balloons'},o);const cols=['#f39bb2','#9fcbe6','#f6c453','#c8b2f2','#9fd8b8'];
  if(o.kind==='balloons'){add(g,puff(.2,.1,.2,.04,.03),M('#f39bb2'),0,.05,0);cols.forEach((c,i)=>{const a=i/5*Math.PI*2,x=Math.cos(a)*.22,z=Math.sin(a)*.12,y=1.1+(i%2)*.25;add(g,new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,.1,0),new T.Vector3(x*.5,y*.5,z*.5),new T.Vector3(x,y-.2,z)]),8,.004,3,false),M('#ffffff'),0,0,0);ball(g,.17,M(c,{roughness:.35,bumpScale:.01}),x,y,z,1,1.15,1);});return;}
  if(o.kind==='banner'){[-1,1].forEach(s=>cyl(g,.02,.025,1.5,M(WOOD),s*.7,.75,0,8));for(let i=0;i<7;i++){const t=i/6,x=-.6+t*1.2,y=1.38-Math.sin(t*Math.PI)*.18;const s=new T.Shape();s.moveTo(-.08,0);s.lineTo(.08,0);s.lineTo(0,-.18);s.lineTo(-.08,0);add(g,ext(s,.02,.006,'bnf'),M(cols[i%5]),x,y,0);}return;}
  if(o.kind==='arch'){for(let i=0;i<22;i++){const a=i/21*Math.PI;ball(g,.13,M(cols[i%5],{roughness:.35,bumpScale:.01}),Math.cos(a)*.8,.1+Math.sin(a)*1.3,(i%2)*.08);}return;}
  if(o.kind==='disco'){cyl(g,.008,.008,.5,M('#c9a46a'),0,1.95,0,6);const b=add(g,new T.IcosahedronGeometry(.26,2),M('#f4f6fa',{roughness:.25,metalness:.35,flatShading:true,bumpScale:0}),0,1.55,0);return;}
  if(o.kind==='photobooth'){add(g,puff(1.3,.08,.5,.06,.03),M(WOOD),0,.04,0);[-1,1].forEach(s=>add(g,puff(.12,1.6,.12,.05,.04),M('#f39bb2'),s*.6,.84,0));add(g,puff(1.3,.25,.14,.08,.05),M('#f39bb2'),0,1.68,0);add(g,ext(shapeOf('scallop',1.1,1.3),.03,.01,'pbc'),M('#fff4ec'),0,.85,-.04);for(let i=0;i<5;i++)ball(g,.05,M(cols[i]),-.4+i*.2,1.68,.08);return;}
  if(o.kind==='pinata'){cyl(g,.008,.008,.6,M('#c9a46a'),0,1.9,0,6);const b=ball(g,.22,M('#f6c453'),0,1.4,0,1.4,1,.8);[0,1,2,3].forEach(i=>ball(g,.06,M(cols[i]),-.2+i*.13,1.3,.18,1,.4,.4));ball(g,.1,M('#f6c453'),.3,1.62,0);ball(g,.06,M('#f6c453'),-.2,1.15,0,1,1.8,1);ball(g,.06,M('#f6c453'),.15,1.15,0,1,1.8,1);ball(g,.02,M('#2a1622'),.36,1.66,.07);return;}}
function garden(g,o){o=Object.assign({kind:'pool',c:'#9fcbe6'},o);const C=M(o.c);
  if(o.kind==='pool'){const r=add(g,new T.TorusGeometry(.8,.18,12,32),M('#f39bb2'),0,.18,0);r.rotation.x=Math.PI/2;const w=add(g,new T.CylinderGeometry(.78,.78,.04,30),M('#7cc4f2',{roughness:.1,transparent:true,opacity:.85,bumpScale:0}),0,.22,0);w.castShadow=false;const d=add(g,new T.TorusGeometry(.2,.07,8,18),M('#f6c453'),.3,.27,.1);d.rotation.x=Math.PI/2;return;}
  if(o.kind==='treehouse'){[-1,1].forEach(s=>cyl(g,.06,.07,1.2,M('#a7774f'),s*.45,.6,s*.3,8));add(g,puff(1.2,.1,.9,.06,.04),M(WOOD),0,1.2,0);add(g,puff(.9,.6,.7,.08,.06),M('#f6c9d6'),0,1.55,0);add(g,ext(shapeOf('gable',1.1,.5),.85,.04,'thr'),M('#e8848f'),0,1.85,0);add(g,ext(heartShape(.09),.02,.008,'thw'),M('#bfe3f5'),0,1.6,.36);for(let i=0;i<5;i++)add(g,puff(.3,.04,.06,.02,.015),M(WOOD),.65,.2+i*.2,.3);[0,1].forEach(i=>cyl(g,.02,.02,1.1,M(WOOD),.65+(i?.12:-.12),.6,.3,6));ball(g,.55,M('#7fbf86'),-.2,2.25,-.2);return;}
  if(o.kind==='slide'){[-1,1].forEach(s=>cyl(g,.03,.03,1.1,M('#ffffff'),s*.2,.55,-.5,8));add(g,puff(.5,.06,.4,.05,.03),M('#ffffff'),0,1.1,-.45);const sl=add(g,puff(.44,.06,1.4,.08,.03),C,0,.6,.15);sl.rotation.x=.75;[-1,1].forEach(s=>{const r=add(g,puff(.05,.12,1.4,.025,.02),C,s*.22,.66,.15);r.rotation.x=.75;});for(let i=0;i<4;i++)add(g,puff(.44,.03,.06,.015,.01),M('#ffffff'),0,.25+i*.25,-.55);return;}
  if(o.kind==='trampoline'){const r=add(g,new T.TorusGeometry(.7,.07,8,32),M('#9fcbe6'),0,.35,0);r.rotation.x=Math.PI/2;const m=add(g,new T.CylinderGeometry(.66,.66,.02,30),M('#3c3236'),0,.34,0);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;cyl(g,.025,.025,.35,M('#ffffff'),Math.cos(a)*.66,.17,Math.sin(a)*.66,6);}return;}
  if(o.kind==='sandbox'){add(g,puff(1.2,.22,1.0,.12,.07),M(WOOD),0,.11,0);add(g,puff(1.04,.04,.84,.12,.02),M('#f3dca8'),0,.2,0);ball(g,.12,M('#f3dca8'),.2,.22,.1,1.4,.6,1);add(g,lathe([[0,0],[.08,0],[.1,.12],[0,.12]],14),M('#f39bb2'),-.3,.22,-.1);ball(g,.05,M('#9fcbe6'),-.1,.3,.2,1,.4,1.6);return;}
  if(o.kind==='gazebo'){add(g,new T.CylinderGeometry(1,1,.12,8),M('#fff4ec'),0,.06,0);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;cyl(g,.04,.04,1.6,M('#ffffff'),Math.cos(a)*.9,.9,Math.sin(a)*.9,8);}add(g,new T.ConeGeometry(1.15,.7,8),M('#f39bb2'),0,2.05,0);ball(g,.07,GOLD(),0,2.45,0);return;}
  if(o.kind==='hammock'){[-1,1].forEach(s=>cyl(g,.06,.07,1.3,M('#a7774f'),s*.9,.65,0,8));const geo=new T.CylinderGeometry(.35,.35,1.6,16,1,true,Math.PI*.6,Math.PI*.8);const h=add(g,geo,M('#f6c9d6',{side:T.DoubleSide}),0,.75,0);h.rotation.z=Math.PI/2;add(g,puff(.4,.12,.25,.08,.05),M('#fff4ec'),-.45,.62,0);return;}
  if(o.kind==='lemonade'){add(g,puff(1.0,.7,.5,.08,.06),M('#fff4ec'),0,.35,0);add(g,puff(1.04,.06,.54,.04,.02),M(WOOD),0,.72,0);[-1,1].forEach(s=>cyl(g,.03,.03,.7,M(WOOD),s*.45,1.1,-.2,8));add(g,puff(1.1,.3,.06,.06,.04),M('#f6c453'),0,1.5,-.2);for(let i=0;i<4;i++)add(g,puff(.24,.3,.02,.02,.008),M(i%2?'#ffffff':'#f6c453'),-.38+i*.25,1.25,-.18);add(g,lathe([[0,0],[.1,0],[.11,.25],[0,.25]],16),M('#fff1a8',{transparent:true,opacity:.85,roughness:.1}),-.2,.75,.05);return;}
  if(o.kind==='rainbow'){['#f39bb2','#f7a88f','#f6c453','#9fd8b8','#9fcbe6','#c8b2f2'].forEach((c,i)=>add(g,new T.TorusGeometry(.95-i*.09,.05,8,30,Math.PI),M(c),0,0,0));[-1,1].forEach(s=>[0,.15,-.15].forEach((dz,i)=>ball(g,.2-i*.03,M('#ffffff'),s*.75+dz,.1,dz)));return;}
  if(o.kind==='pond'){const p=add(g,new T.CylinderGeometry(.85,.85,.04,28),M('#7cc4f2',{roughness:.1,transparent:true,opacity:.85,bumpScale:0}),0,.03,0);p.scale.z=.7;p.castShadow=false;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ball(g,.1+(i%3)*.03,M('#d9d2c8'),Math.cos(a)*.88,.06,Math.sin(a)*.62,1.2,.6,1);}[[-.3,.05],[.25,-.15]].forEach(([x,z])=>{cyl(g,.14,.14,.01,M('#7fbf86'),x,.06,z,16);flowerHead(g,'#f6c9d6',x,.08,z,.8);});return;}
  if(o.kind==='fountain'){add(g,lathe([[0,0],[.6,0],[.62,.25],[.55,.28],[0,.2]],28),M('#e8e2da'),0,0,0);const w=add(g,new T.CylinderGeometry(.54,.54,.03,24),M('#7cc4f2',{roughness:.1,transparent:true,opacity:.85,bumpScale:0}),0,.24,0);add(g,lathe([[0,.2],[.08,.2],[.06,.7],[.3,.75],[.32,.85],[0,.8]],22),M('#e8e2da'),0,0,0);ball(g,.1,M('#9fcbe6',{transparent:true,opacity:.7}),0,.95,0,1,1.4,1);return;}
  if(o.kind==='birdhouse'){cyl(g,.03,.03,1.1,M(WOOD),0,.55,0,8);add(g,puff(.3,.3,.28,.05,.04),M('#9fd8b8'),0,1.25,0);add(g,ext(shapeOf('gable',.4,.2),.34,.02,'bhr'),M('#f39bb2'),0,1.42,0);cyl(g,.05,.05,.02,M('#4a3a38'),0,1.27,.15,12).rotation.x=Math.PI/2;cyl(g,.01,.01,.1,M(WOOD),0,1.17,.18,6).rotation.x=Math.PI/2;return;}
  if(o.kind==='mushroomring'){for(let i=0;i<7;i++){const a=i/7*Math.PI*2,x=Math.cos(a)*.55,z=Math.sin(a)*.55,s=.7+(i%3)*.2;cyl(g,.04*s,.05*s,.16*s,M('#fff4ec'),x,.08*s,z,10);const c=add(g,new T.SphereGeometry(.12*s,16,8,0,Math.PI*2,0,Math.PI/2),M(i%2?'#ef7f8a':'#f39bb2'),x,.15*s,z);ball(g,.02*s,M('#ffffff'),x+.04*s,.24*s,z+.03*s);}return;}
  if(o.kind==='bench'){add(g,puff(1.2,.1,.42,.06,.04),M(o.c||WOOD),0,.45,0);add(g,puff(1.2,.4,.08,.08,.04),M(o.c||WOOD),0,.75,-.2);taperLegs(g,1.1,.36,.42,M('#ffffff'),.06,.04);add(g,puff(.4,.1,.3,.08,.05),M('#f6c9d6'),-.3,.55,.02);return;}
  if(o.kind==='picnic'){const m=add(g,puff(1.5,.03,1.2,.1,.012),M('#f39bb2'),0,.015,0);m.castShadow=false;for(let i=0;i<4;i++)for(let j=0;j<3;j++)if((i+j)%2)add(g,puff(.36,.034,.38,.03,.01),M('#ffffff'),-.56+i*.37,.018,-.4+j*.4).castShadow=false;add(g,lathe([[0,0],[.18,0],[.22,.2],[0,.2]],16),M(WOOD),.3,0,.1);mini(g,{kind:'apples'});return;}
  if(o.kind==='umbrella'){table(g,{c:'#ffffff',base:'#ffffff',r:.5});cyl(g,.02,.02,1.4,M('#ffffff'),0,1.2,0,8);const u=add(g,new T.ConeGeometry(.9,.35,12,1,true),M('#f39bb2',{side:T.DoubleSide}),0,1.95,0);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ball(g,.04,M('#ffffff'),Math.cos(a)*.9,1.78,Math.sin(a)*.9);}return;}
  if(o.kind==='adirondack'){add(g,puff(.6,.08,.6,.06,.04),C,0,.32,0);for(let i=0;i<5;i++){const p=add(g,puff(.1,.7,.05,.04,.02),C,-.24+i*.12,.75,-.3);p.rotation.x=-.25;}[-1,1].forEach(s=>{add(g,puff(.12,.05,.7,.04,.02),C,s*.34,.55,0);cyl(g,.03,.03,.5,C,s*.34,.27,.25,6);cyl(g,.03,.03,.3,C,s*.3,.15,-.25,6);});return;}}
function wall(g,o){o=Object.assign({kind:'picture',c:'#f6c9d6'},o);const C=M(o.c);
  if(o.kind==='picture'){add(g,puff(.7,.55,.05,.06,.025),C,0,1.5,.03);add(g,puff(.58,.43,.02,.03,.008),M('#bfe3f5'),0,1.5,.055);add(g,ext(shapeOf('gable',.3,.2),.01,.004,'pic1'),M('#9fd8b8'),-.08,1.36,.07);ball(g,.06,M('#f6c453'),.16,1.6,.07,1,1,.2);return;}
  if(o.kind==='clock'){const f=add(g,new T.CylinderGeometry(.24,.24,.06,28),C,0,1.6,.04);f.rotation.x=Math.PI/2;const fc=add(g,new T.CircleGeometry(.19,24),M('#fff8f0'),0,1.6,.075);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ball(g,.012,M('#4a2338'),Math.cos(a)*.15,1.6+Math.sin(a)*.15,.08);}add(g,puff(.02,.12,.01,.008,.004),M('#4a2338'),0,1.65,.085);add(g,puff(.09,.02,.01,.008,.004),M('#4a2338'),.04,1.6,.085);return;}
  if(o.kind==='grandclock'){add(g,puff(.5,1.7,.36,.08,.06),M(o.c||WOOD),0,.9,0);add(g,ext(shapeOf('arch',.5,.3),.36,.04,'gca'),M(o.c||WOOD),0,1.88,0);const f=add(g,new T.CircleGeometry(.17,24),M('#fff8f0'),0,1.5,.185);add(g,puff(.3,.6,.02,.04,.01),M('#bfe3f5',{transparent:true,opacity:.6}),0,.8,.19);ball(g,.07,GOLD(),0,.65,.17,1,1,.3);cyl(g,.008,.008,.4,GOLD(),0,.88,.17,6);return;}
  if(o.kind==='fireplace'){add(g,puff(1.3,1.0,.4,.08,.06),M(o.c||'#fff4ec'),0,.5,0);add(g,puff(1.45,.1,.48,.05,.03),M(o.c||'#fff4ec'),0,1.04,0);add(g,ext(shapeOf('arch',.7,.6),.06,.02,'fpa'),M('#4a3638'),0,.12,.18);[0,1,2].forEach(i=>{const f=ball(g,.08-i*.015,new T.MeshBasicMaterial({color:[0xff8f5a,0xffc06a,0xffe09a][i]}),(i-1)*.08,.25+i*.05,.16,1,1.6,1);f.castShadow=false;});cyl(g,.04,.04,.4,M('#a7774f'),0,.16,.16,8).rotation.z=Math.PI/2;return;}
  if(o.kind==='curtains'){cyl(g,.018,.018,1.6,GOLD(),0,2.1,.12,8).rotation.z=Math.PI/2;[-1,1].forEach(s=>{const geo=new T.PlaneGeometry(.5,1.5,10,1);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,Math.sin(x*25)*.03);const pinch=1-Math.max(0,.3-Math.abs(y+.2))*1.5;p.setX(i,x*pinch);}geo.computeVertexNormals();const c=add(g,geo,M(o.c,{side:T.DoubleSide}),s*.55,1.35,.14);ball(g,.06,M('#ffffff'),s*.55,1.15,.17,1.6,.8,.6);});return;}
  if(o.kind==='mirror'){const shape=o.shape||'oval';if(shape==='daisy'){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ball(g,.16,M('#ffffff'),Math.cos(a)*.3,1.5+Math.sin(a)*.3,.03,1,1,.3);}add(g,new T.CircleGeometry(.28,24),GLASS(),0,1.5,.08);return;}if(shape==='heart'){add(g,ext(heartShape(.36),.06,.03,'wmh'),C,0,1.5,.04);add(g,ext(heartShape(.28),.02,.006,'wmhg'),GLASS(),0,1.51,.075);return;}if(shape==='star'){add(g,ext(starShape(.42,.22),.06,.03,'wms'),GOLD(),0,1.5,.04);add(g,ext(starShape(.32,.17),.02,.006,'wmsg'),GLASS(),0,1.5,.075);return;}const fr=add(g,new T.TorusGeometry(.3,.06,10,28),C,0,1.5,.04);fr.scale.y=1.3;const gl=add(g,new T.CircleGeometry(.29,24),GLASS(),0,1.5,.035);gl.scale.y=1.3;return;}
  if(o.kind==='hearts'){[[-.2,1.6,.12],[.15,1.75,.09],[.05,1.45,.1],[.3,1.5,.07],[-.3,1.38,.08]].forEach(([x,y,s],i)=>add(g,ext(heartShape(s),.03,.012,'wh'+i),M(['#f39bb2','#f6c9d6','#e2385f','#c8b2f2','#ffffff'][i]),x,y,.03));return;}
  if(o.kind==='dreamcatcher'){const r=add(g,new T.TorusGeometry(.22,.025,8,28),M('#f6c9d6'),0,1.7,.03);for(let i=0;i<3;i++){const x=(i-1)*.15;for(let k=0;k<3;k++)ball(g,.03,M(['#c8b2f2','#9fcbe6','#ffffff'][k]),x,1.4-k*.1,.03);ball(g,.05,M('#ffffff'),x,1.1,.03,.6,1.6,.3);}return;}
  if(o.kind==='fruitprint'){add(g,puff(.5,.6,.04,.05,.02),M('#ffffff'),0,1.5,.03);ball(g,.1,M('#e2385f'),-.08,1.45,.06,1,1,.3);ball(g,.08,M('#f6c453'),.1,1.55,.06,1,1,.3);return;}
  if(o.kind==='kitchenclock'){wall(g,{kind:'clock',c:o.c});add(g,ext(heartShape(.05),.01,.004,'kch'),M('#e2385f'),0,1.88,.04);return;}
  if(o.kind==='wallshelf'){add(g,puff(.9,.06,.25,.04,.02),M(o.c),0,1.4,.13);[-1,1].forEach(s=>add(g,ext(heartShape(.06),.02,.008,'wsh'),M(o.c),s*.3,1.33,.03));mini(g,{kind:'vase',c:'#9fcbe6'});g.children.slice(-12).forEach(m=>{m.position.y+=1.43;m.position.z+=.12;});return;}}
function plush(g,o){o=Object.assign({kind:'teddy',c:'#d4a06a',c2:'#f6e3c6'},o);const C=M(o.c),C2=M(o.c2),eyeM=M('#2a1622',{roughness:.3,bumpScale:0});
  ball(g,.24,C,0,.26,0,1,1.05,.9);ball(g,.12,C2,0,.26,.16,1,1.1,.5);ball(g,.19,C,0,.62,.02);ball(g,.07,C2,0,.58,.17,1.1,.8,.7);[-1,1].forEach(s=>{ball(g,.025,eyeM,s*.065,.66,.18);ball(g,.08,C,s*.2,.3,.1,1,.8,.9);ball(g,.08,C,s*.12,.08,.12,1,.7,1.1);});
  if(o.kind==='teddy'||o.kind==='kitty'){[-1,1].forEach(s=>{if(o.kind==='kitty'){const e=add(g,new T.ConeGeometry(.06,.12,10),C,s*.11,.8,.02);e.rotation.z=-s*.25;}else{ball(g,.065,C,s*.14,.79,0);ball(g,.035,C2,s*.14,.79,.03);}});ball(g,.02,M('#4a2338'),0,.6,.24);if(o.kind==='kitty'){ball(g,.08,C,.26,.18,-.18,1,.5,2.4);}else{const b=ball(g,.05,M('#f39bb2'),0,.47,.15,1.5,.6,.6);}}
  if(o.kind==='bunny'){[-1,1].forEach(s=>{const e=ball(g,.05,C,s*.07,.88,0,.8,2.6,.6);e.rotation.z=s*.12;ball(g,.03,M('#f6c9d6'),s*.07,.88,.03,.6,2,.3);});ball(g,.07,C2,0,.18,-.22);}
  if(o.kind==='unicorn'){add(g,new T.ConeGeometry(.04,.22,10),GOLD(),0,.88,.08).rotation.x=.4;['#f7a0bd','#c8a2ff','#7fd1c0'].forEach((c,i)=>ball(g,.06,M(c),0,.8-i*.08,-.14+i*.02));[-1,1].forEach(s=>{const e=add(g,new T.ConeGeometry(.04,.09,8),C,s*.1,.8,.02);e.rotation.z=-s*.3;});}
  if(o.kind==='dino'){for(let i=0;i<5;i++)ball(g,.04,M('#f6c453'),0,.75-i*.12,-.15-i*.02,1,1,.6);ball(g,.09,C,0,.15,-.25,1,.7,1.8);}
  [-1,1].forEach(s=>ball(g,.03,M('#f6a6b6',{bumpScale:.01}),s*.12,.6,.15,1,.6,.3));}
function seat(g,o){o=Object.assign({kind:'beanbag',c:'#f39bb2'},o);const C=M(o.c);
  if(o.kind==='beanbag'){ball(g,.45,C,0,.3,0,1,.65,1);ball(g,.35,C,0,.5,-.18,1,.8,.6);return;}
  if(o.kind==='pouf'){add(g,lathe([[0,0],[.3,0],[.38,.1],[.38,.25],[.3,.36],[0,.38]],24),C,0,0,0);if(o.sun){for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add(g,new T.ConeGeometry(.06,.14,8),M('#f6c453'),Math.cos(a)*.44,.2,Math.sin(a)*.44).rotation.z=-Math.PI/2+0;}}tuft(g,M('#ffffff'),0,.385,0);return;}
  if(o.kind==='strawberry'){ball(g,.36,M('#e8546a'),0,.3,0,1,.85,1);for(let i=0;i<14;i++){const a=i*2.4,y=.12+(i%5)*.08;ball(g,.02,M('#fff1a8'),Math.cos(a)*.34,y,Math.sin(a)*.34);}for(let i=0;i<5;i++){const a=i/5*Math.PI*2;ball(g,.1,M('#7fbf86'),Math.cos(a)*.1,.56,Math.sin(a)*.1,1.4,.3,.6).rotation.y=-a;}return;}
  if(o.kind==='hanging'){cyl(g,.015,.015,.8,M('#e8d9bf'),0,1.65,0,6);const s=add(g,new T.SphereGeometry(.45,22,14,0,Math.PI*2,0,Math.PI*.62),M('#e2b984',{side:T.DoubleSide}),0,.95,0);s.rotation.x=Math.PI;add(g,puff(.6,.14,.5,.12,.06),M(o.c),0,.68,.05);ball(g,.15,M('#fff4ec'),0,.82,-.15,1.2,1,.6);return;}
  if(o.kind==='stool'){cyl(g,.12,.15,.36,M('#fff4ec'),0,.18,0,14);const c=add(g,new T.SphereGeometry(.28,20,10,0,Math.PI*2,0,Math.PI/2),M(o.c||'#ef7f8a'),0,.34,0);c.scale.y=.6;for(let i=0;i<5;i++)ball(g,.035,M('#ffffff'),Math.cos(i*1.3)*.15,.48,Math.sin(i*1.3)*.15,1,.4,1);return;}
  if(o.kind==='armchair'){sofa(g,{W:1.0,D:.88,c:o.c,back:'round',pillows:[o.p||'#fff4ec'],legC:'gold'});return;}
  if(o.kind==='corner'){sofa(g,{W:1.8,D:.9,c:o.c,pillows:['#fff4ec','#f6c9d6']});const side=new T.Group();sofa(side,{W:1.2,D:.9,c:o.c,pillows:['#fff4ec']});side.rotation.y=-Math.PI/2;side.position.set(1.1,0,.9);g.add(side);return;}
  if(o.kind==='booth'){add(g,puff(1.2,.3,.55,.1,.08),C,0,.2,0);add(g,puff(1.2,.12,.5,.08,.05),M('#fff4ec'),0,.42,.02);add(g,puff(1.2,.7,.2,.12,.08),C,0,.65,-.22);for(let i=0;i<4;i++)add(g,puff(.04,.55,.02,.02,.01),M('#ffffff'),-.42+i*.28,.68,-.11);return;}}
function toy(g,o){o=Object.assign({kind:'blocks',c:'#f39bb2'},o);const C=M(o.c),cols=['#f39bb2','#9fcbe6','#f6c453','#9fd8b8','#c8b2f2'];
  switch(o.kind){
  case 'puzzle':add(g,puff(.6,.04,.45,.05,.015),M('#fff4ec'),0,.02,0);for(let i=0;i<4;i++)for(let j=0;j<3;j++){if(i===3&&j===2)continue;add(g,puff(.13,.035,.13,.03,.012),M(cols[(i+j)%5]),-.21+i*.14,.055,-.14+j*.14);ball(g,.025,M(cols[(i+j)%5]),-.21+i*.14+.07,.055,-.14+j*.14,1,.6,1);}add(g,puff(.13,.035,.13,.03,.012),M(cols[3]),.35,.04,.25).rotation.y=.4;break;
  case 'crafts':add(g,lathe([[0,0],[.28,0],[.32,.2],[0,.2]],18),M('#e2b984'),0,0,0);for(let i=0;i<5;i++){cyl(g,.015,.015,.3,M(cols[i]),Math.cos(i*1.3)*.1,.3,Math.sin(i*1.3)*.1,6).rotation.z=(i-2)*.12;}ball(g,.07,M('#f39bb2'),-.12,.24,.1);ball(g,.06,M('#9fcbe6'),.13,.23,-.08);break;
  case 'puppet':add(g,puff(.9,.7,.25,.08,.06),M('#f39bb2'),0,.35,0);add(g,puff(1.0,.5,.3,.1,.07),M('#e8848f'),0,1.25,0);add(g,puff(.7,.35,.05,.05,.02),M('#3c3236'),0,.95,.05);[-1,1].forEach(s=>{const c=ball(g,.2,M('#f6c9d6'),s*.42,1.0,.1,.6,1.8,.4);});ball(g,.09,M('#f6e3c6'),-.1,.9,.1);ball(g,.08,M('#c8b2f2'),.15,.88,.1);break;
  case 'stroller':[-1,1].forEach(s=>[-1,1].forEach(t=>{const w=add(g,new T.TorusGeometry(.1,.035,8,16),M('#ffffff'),s*.28,.12,t*.25);w.rotation.y=Math.PI/2;}));const b=add(g,new T.SphereGeometry(.38,20,12,0,Math.PI*2,Math.PI*.4,Math.PI*.6),C,0,.62,0);b.scale.set(1,.8,.8);const h=add(g,new T.SphereGeometry(.4,20,10,0,Math.PI,0,Math.PI/2),M('#f6c9d6',{side:T.DoubleSide}),0,.62,-.05);h.rotation.y=-Math.PI/2;h.rotation.z=.4;cyl(g,.02,.02,.6,M('#ffffff'),.4,.8,0,6).rotation.z=-.5;break;
  case 'marbles':add(g,lathe([[0,0],[.1,0],[.13,.12],[.1,.22],[0,.22]],16),M('#e7f3f8',{transparent:true,opacity:.5,roughness:.1,bumpScale:0}),0,0,0);for(let i=0;i<10;i++)ball(g,.03,M(cols[i%5],{roughness:.2,bumpScale:0}),Math.cos(i*1.7)*.06,.04+(i%4)*.04,Math.sin(i*1.7)*.06);for(let i=0;i<4;i++)ball(g,.03,M(cols[i],{roughness:.2,bumpScale:0}),.2+i*.06,.03,.1-i*.05);break;
  case 'playmat':rug(g,{shape:'rect',c:'#ffffff',c2:'#ffffff',w:1.5,d:1.1,rings:false});for(let i=0;i<4;i++)for(let j=0;j<3;j++){const p=add(g,puff(.34,.045,.34,.06,.015),M(cols[(i+j*2)%5]),-.54+i*.36,.03,-.36+j*.36);p.castShadow=false;}break;
  case 'doll':ball(g,.1,M('#f6d6c4'),0,.55,0);ball(g,.11,M('#8a5a3c'),0,.6,-.02,1,1,1);add(g,lathe([[0,0],[.14,0],[.08,.35],[0,.38]],14),M('#f39bb2'),0,.05,0);[-1,1].forEach(s=>{cyl(g,.025,.025,.12,M('#f6d6c4'),s*.04,.03,0,6);ball(g,.012,M('#2a1622'),s*.035,.56,.09);});break;
  case 'dollhouse':add(g,puff(.6,.5,.35,.05,.04),M('#f6c9d6'),0,.25,0);add(g,ext(shapeOf('gable',.7,.35),.4,.03,'dhr'),M('#e8848f'),0,.5,0);[-1,1].forEach(s=>add(g,puff(.12,.12,.02,.02,.008),M('#bfe3f5'),s*.15,.3,.18));add(g,ext(shapeOf('arch',.12,.18),.02,.006,'dhd'),M('#fff4ec'),0,.03,.18);break;
  case 'blocks':[[0,0,0,0],[.17,0,0,1],[.08,.16,0,2],[-.2,0,.1,3],[.3,0,.15,4]].forEach(([x,y,z,i])=>{add(g,puff(.15,.15,.15,.04,.03),M(cols[i]),x,.075+y,z).rotation.y=i*.3;});break;
  case 'rocker':case 'rockinghorse':{const s=new T.Shape();s.absarc(0,.6,.6,Math.PI*1.25,Math.PI*1.75,false);const r=add(g,new T.TorusGeometry(.6,.03,6,20,Math.PI/2),M(WOOD),0,.62,.12);r.rotation.z=Math.PI*1.25;const r2=add(g,new T.TorusGeometry(.6,.03,6,20,Math.PI/2),M(WOOD),0,.62,-.12);r2.rotation.z=Math.PI*1.25;ball(g,.22,M(o.c||'#fff4ec'),0,.55,0,1.5,.8,.8);ball(g,.13,M(o.c||'#fff4ec'),.32,.75,0,1.2,1,.8);ball(g,.06,M(o.c||'#fff4ec'),.45,.72,0);for(let i=0;i<4;i++)ball(g,.05,M('#f39bb2'),.22-i*.04,.88-i*.05,0);[-1,1].forEach(a=>[-1,1].forEach(b=>cyl(g,.03,.03,.25,M(o.c||'#fff4ec'),a*.18,.32,b*.1,6)));ball(g,.02,M('#2a1622'),.4,.8,.08);}break;
  case 'train':[0,1,2].forEach(i=>{const x=-.35+i*.35;add(g,puff(.3,.18,.2,.05,.03),M(cols[i]),x,.15,0);[-1,1].forEach(s=>[-1,1].forEach(t=>{const w=cyl(g,.04,.04,.03,M('#4a3a38'),x+s*.09,.06,t*.11,12);w.rotation.x=Math.PI/2;}));});add(g,puff(.14,.14,.18,.04,.03),M(cols[0]),-.4,.3,0);cyl(g,.04,.05,.12,M('#4a3a38'),-.3,.32,0,10);break;
  case 'paints':add(g,puff(.42,.05,.28,.06,.02),M('#ffffff'),0,.025,0);for(let i=0;i<6;i++)cyl(g,.035,.035,.02,M(cols[i%5]),-.13+(i%3)*.13,.06,i<3?-.06:.06,12);cyl(g,.01,.01,.3,M(WOOD),.24,.03,0,6).rotation.z=Math.PI/2;ball(g,.02,M('#f39bb2'),.39,.03,0,1.4,.8,.8);break;
  case 'castle':add(g,puff(.6,.35,.4,.04,.03),M('#e6dbff'),0,.18,0);[-1,1].forEach(s=>{cyl(g,.1,.1,.6,M('#cdb6f2'),s*.32,.3,.18,12);add(g,new T.ConeGeometry(.13,.22,12),M('#f39bb2'),s*.32,.71,.18);});add(g,ext(shapeOf('castle',.6,.15),.4,.02,'tcc'),M('#e6dbff'),0,.42,0);add(g,ext(shapeOf('arch',.14,.18),.02,.006,'tcd'),M('#f6c9d6'),0,.04,.21);break;
  case 'tent':{const s=new T.Shape();s.moveTo(-.6,0);s.lineTo(0,1.1);s.lineTo(.6,0);s.lineTo(-.6,0);add(g,ext(s,1.0,.04,'tnt'),C,0,.55,0);add(g,ext(shapeOf('arch',.4,.55),.02,.006,'tntd'),M('#fff4ec'),0,.02,.52);for(let i=0;i<5;i++)ball(g,.05,M(cols[i]),-.3+i*.15,1.0-Math.abs(i-2)*.12,.48);add(g,puff(.5,.12,.4,.1,.05),M('#fff4ec'),.1,.06,.2);}break;
  case 'arttable':add(g,puff(1.0,.08,.6,.08,.035),M('#fff4ec'),0,.5,0);taperLegs(g,.9,.5,.46,M(WOOD),.06,.04);add(g,puff(.5,.01,.36,.02,.005),M('#ffffff'),-.1,.55,0);for(let i=0;i<4;i++)cyl(g,.03,.03,.02,M(cols[i]),.28,.555,-.12+i*.08,10);for(let i=0;i<3;i++)cyl(g,.012,.012,.2,M(cols[i+1]),.38+i*.03,.6,.15,6);break;
  }}
function tableX(g,o){o=Object.assign({kind:'aquarium'},o);
  if(o.kind==='aquarium'){add(g,puff(1.1,.1,.6,.06,.04),M('#fff4ec'),0,.55,0);add(g,puff(1.0,.42,.5,.05,.02),M('#cfe9f7',{transparent:true,opacity:.55,roughness:.1,bumpScale:0}),0,.27,0);add(g,puff(1.0,.06,.5,.04,.02),M('#f3dca8'),0,.06,0);[[-.2,.25],[.15,.3]].forEach(([x,y],i)=>{ball(g,.05,M(i?'#f39b4a':'#f6c453'),x,y,0,1.4,1,.6);});for(let i=0;i<3;i++)cyl(g,.015,.02,.2,M('#7fbf86'),-.35+i*.05,.16,-.1,6);taperLegs(g,1.0,.5,.05,M('#fff4ec'));return;}
  if(o.kind==='chess'){table(g,{c:'#fff4ec',base:WOOD,r:.55,h:.7});for(let i=0;i<4;i++)for(let j=0;j<4;j++)if((i+j)%2){const t=add(g,puff(.12,.012,.12,.02,.004),M('#4a3a38'),-.18+i*.12,.76,-.18+j*.12);t.castShadow=false;}[[-.12,'#ffffff'],[.12,'#4a3a38']].forEach(([x,c])=>{add(g,lathe([[0,0],[.03,0],[.02,.06],[.03,.09],[0,.1]],10),M(c),x,.765,.05);});return;}
  if(o.kind==='picnic'){add(g,puff(1.5,.08,.7,.06,.035),M(WOOD),0,.72,0);[-1,1].forEach(s=>{add(g,puff(1.5,.07,.28,.05,.03),M(WOOD),0,.42,s*.55);[-1,1].forEach(t=>{const l=add(g,puff(.07,.8,.07,.03,.02),M(WOOD),t*.6,.38,0);l.rotation.x=s*.55;});});add(g,puff(.6,.01,.6,.03,.004),M('#f39bb2'),0,.765,0);return;}
  if(o.kind==='island'){add(g,puff(1.4,.85,.7,.08,.06),M('#fdf3ea'),0,.43,0);add(g,puff(1.5,.07,.8,.06,.03),M('#fff8f0'),0,.89,0);[-1,1].forEach(s=>add(g,puff(.6,.6,.04,.06,.02),M('#f6c9d6'),s*.34,.42,.36));[-1,1].forEach(s=>knob(g,'heart',s*.1,.6,.37));mini(g,{kind:'bowl',c:'#ffffff',fruit:true});g.children.slice(-6).forEach(m=>m.position.y+=.92);return;}}
function bunk(g,o){o=Object.assign({loft:false,c:'#f6c9d6',frame:'#fff4ec'},o);const F=M(o.frame);
  const deck=(y,c)=>{add(g,puff(1.4,.12,1.9,.08,.05),F,0,y,0);add(g,puff(1.3,.16,1.8,.1,.07),M('#fbf3e6'),0,y+.13,0);add(g,puff(1.32,.1,1.1,.08,.05),M(c),0,y+.23,.35);add(g,puff(.55,.3,.16,.1,.07),M('#ffffff'),0,y+.32,-.7).rotation.x=-.2;};
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>add(g,puff(.1,2.0,.1,.05,.04),F,a*.68,1.0,b*.92));
  if(!o.loft)deck(.3,o.c);else{add(g,puff(1.2,.7,.6,.08,.06),M(o.c),0,.4,.5);add(g,puff(1.24,.06,.64,.04,.02),F,0,.78,.5);}
  deck(1.35,o.loft?'#c8b2f2':'#9fcbe6');[-1,1].forEach(s=>add(g,puff(.06,.3,1.8,.03,.02),F,.68*s,1.75,0));
  for(let i=0;i<5;i++)add(g,puff(.06,.04,.4,.02,.015),F,.72,.3+i*.28,.6);
  add(g,ext(shapeOf('scallop',1.4,.5),.08,.03,'bunkh'),M(o.c),0,1.8,-.95);}
function instrument(g,o){o=Object.assign({kind:'guitar',c:'#f39bb2'},o);const C=M(o.c);
  if(o.kind==='harp'){const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(-.1,.9,.35,1.3);s.lineTo(.45,1.25);s.quadraticCurveTo(.1,.8,.12,0);s.lineTo(0,0);add(g,ext(s,.08,.03,'harpf'),GOLD(),0,.65,0);cyl(g,.04,.05,1.3,GOLD(),.5,.65,0,10);add(g,puff(.6,.08,.3,.05,.03),C,.25,.04,0);for(let i=0;i<7;i++){const x=.12+i*.05;cyl(g,.004,.004,1.0-i*.06,M('#ffffff'),x,.6-i*.03+.1,0,4);}return;}
  const k=o.kind==='ukulele'?.6:1;const body=new T.Group();g.add(body);body.position.set(0,.4*k,0);body.rotation.z=.25;
  ball(body,.22*k,C,0,0,0,1,1,.35);ball(body,.17*k,C,0,.27*k,0,1,1,.35);add(body,new T.CircleGeometry(.06*k,18),M('#4a2338'),0,.12*k,.08*k);add(body,puff(.07*k,.6*k,.05*k,.02,.015),M(WOOD),0,.65*k,.02);add(body,puff(.1*k,.14*k,.05*k,.03,.015),M(o.c),0,1.0*k,.02);for(let i=0;i<4;i++)cyl(body,.003,.003,.85*k,M('#ffffff'),-.018*k+i*.012*k,.55*k,.075*k,4);
  add(g,puff(.3*k,.1,.2,.04,.03),M(WOOD),0,.05,0);}
function petstuff(g,o){o=Object.assign({kind:'bed',c:'#f6c9d6',c2:'#fff4ec'},o);const C=M(o.c),C2=M(o.c2);
  if(o.kind==='bed'){const r=add(g,new T.TorusGeometry(.38,.14,10,24),C,0,.14,0);r.rotation.x=Math.PI/2;add(g,new T.CylinderGeometry(.36,.36,.1,24),C2,0,.08,0);ball(g,.12,C2,.1,.17,.05,1.4,.5,1);return;}
  if(o.kind==='cloud'){[[0,0,.3],[-.28,.05,.22],[.28,.05,.22],[0,-.25,.22],[0,.25,.2]].forEach(([x,z,r])=>ball(g,r,C,x,.14,z,1,.5,1));ball(g,.3,C2,0,.18,0,1,.25,1);return;}
  if(o.kind==='castle'){add(g,puff(.8,.6,.6,.06,.05),C,0,.3,0);add(g,ext(shapeOf('arch',.36,.4),.04,.01,'pcd'),M('#4a3a38'),0,.02,.29);[-1,1].forEach(s=>{cyl(g,.1,.1,.8,C2,s*.4,.4,.28,12);add(g,new T.ConeGeometry(.13,.22,12),M('#f39bb2'),s*.4,.91,.28);});add(g,ext(shapeOf('castle',.8,.14),.6,.02,'pcc'),C,0,.6,0);return;}
  if(o.kind==='tower'){cyl(g,.05,.05,1.4,M('#e8d9bf'),0,.7,0,10);add(g,puff(.7,.06,.6,.06,.03),C,0,.03,0);[[.45,.15],[.9,-.12],[1.35,.05]].forEach(([y,x])=>{add(g,new T.CylinderGeometry(.22,.22,.08,20),C,x,y,0);});ball(g,.05,C2,.25,.3,.1);return;}
  if(o.kind==='bowl'){[-.15,.15].forEach((x,i)=>{add(g,lathe([[0,0],[.1,0],[.13,.08],[0,.06]],18),M(i?'#9fcbe6':'#f6c9d6'),x,0,0);ball(g,.08,M(i?'#bfe3f5':'#c9a27a'),x,.07,0,1,.2,1);});add(g,ext(heartShape(.05),.01,.004,'pbh'),M('#ffffff'),.15,.08,.12);return;}
  if(o.kind==='toy'){ball(g,.12,M('#f6c453'),-.15,.12,0);for(let i=0;i<3;i++)add(g,new T.TorusGeometry(.12,.012,6,18),M('#f39bb2'),-.15,.12,0).rotation.y=i;ball(g,.08,M('#c8b2f2'),.18,.08,0,1.4,.9,1);ball(g,.03,M('#c8b2f2'),.26,.14,.04);ball(g,.03,M('#c8b2f2'),.26,.14,-.04);return;}}
function piano(g,o){o=Object.assign({c:'#f39bb2'},o);const C=M(o.c);add(g,puff(1.3,.62,.5,.06,.04),C,0,.65,0);add(g,puff(1.3,.14,.3,.04,.03),C,0,1.02,-.1);add(g,puff(1.16,.05,.22,.02,.015),M('#fffdf7'),0,.95,.17);for(let i=0;i<8;i++)add(g,puff(.05,.04,.12,.01,.008),M('#2a1622'),-.5+i*.14,.98,.13);[-1,1].forEach(s=>add(g,puff(.1,.66,.4,.04,.03),C,s*.6,.33,.05));add(g,puff(.9,.12,.36,.06,.04),M('#fff4ec'),0,.3,.55);taperLegs(g,.8,.3,.24,M(WOOD),.06,.03);g.children.slice(-4).forEach(m=>m.position.z+=.55);}

return {M,puff,add,ball,cyl,feet,panel,knob,mirror,bed,sofa,chair,table,dresser,vanity,shelf,lamp,rug,plant,light,appliance,bath,mini,cake,party,garden,wall,plush,seat,toy,tableX,bunk,instrument,petstuff,piano};
}
/* Which piece uses which sculpt and colors */
const CLAY_PIECES={
 bed:['bed',{}],bedpink:['bed',{head:'scallop',headC:'#f4a8b6',blanketC:'#fbd3dc',p1:'#fff4ec',p2:'#f4a8b6',braidC:'#ffffff',quilt:'#f4a8b6'}],
 bedcloud:['bed',{head:'cloud',headC:'#ffffff',frameC:'#dcefff',sideC:'#cfe6fb',blanketC:'#cfe6fb',p1:'#ffffff',p2:'#fbd3dc',braidC:'#ffffff',legC:'#cfe6fb',quilt:'#ffffff'}],
 bedcastle:['bed',{head:'castle',headC:'#cdb6f2',frameC:'#f2e9ff',sideC:'#cdb6f2',blanketC:'#e6dbff',p1:'#ffffff',p2:'#f6c9d6',braidC:'#f6c453',foot:true}],
 bedshell:['bed',{head:'shell',headC:'#f6c9d6',frameC:'#fff1ea',blanketC:'#fde1e7',p1:'#ffffff',p2:'#bfe6ea',braidC:'#fbf6ee',trimGold:true}],
 bedcarriage:['bed',{head:'arch',headC:'#f39bb2',frameC:'#fff4ec',blanketC:'#fbd3dc',p1:'#fff4ec',p2:'#f39bb2',braidC:'#e9c46a',trimGold:true,foot:true}],
 bedcottage:['bed',{head:'gable',headC:'#d9a877',frameC:'#e8c49c',sideC:'#d9a877',blanketC:'#f3e2c8',p1:'#ffffff',p2:'#9fd8b8',braidC:'#f39bb2',legC:'#c99367',quilt:'#9fd8b8'}],
 bedcanopy:['bed',{head:'arch',headC:'#f6c9d6',blanketC:'#fde1e7',p1:'#ffffff',p2:'#f6c9d6',braidC:'#ffffff',canopy:{post:'#fff4e6',sheer:'#ffd6e4'}}],
 softsofa:['sofa',{c:'#f2a9b3',c2:'#f6bcc4',pillows:['#fff2d6','#fff2d6'],legC:'#f2a9b3'}],
 lamp:['sofa',{c:'#9fcbe6',c2:'#b3d7ee',pillows:['#f6c9d6','#fff2d6']}],
 sofabubble:['sofa',{c:'#f6b6c8',arm:'ball',back:'round',pillows:['#fff2d6','#c8b2f2'],legC:'gold'}],
 sofamint:['sofa',{c:'#a8dcc6',c2:'#bfe6d4',pillows:['#fff2d6','#f6c9d6'],legC:'#f2dcbc'}],
 sofastar:['sofa',{c:'#c8b2f2',c2:'#d8c8f8',pillows:['#fff2d6','#fff2d6'],star:true,legC:'gold'}],
 sofachester:['sofa',{c:'#f39bb2',back:'chester',arm:'roll',pillows:['#fff2d6','#fff2d6'],legC:'#8a5a44'}],
 sofacloud:['sofa',{c:'#ffffff',c2:'#f4f8ff',back:'cloud',arm:'ball',pillows:['#cfe6fb','#fbd3dc'],legC:'#cfe6fb',tufted:false}],
 sofabow:['sofa',{c:'#f7c9d4',back:'bow',bow:true,pillows:['#ffffff','#ffffff'],legC:'gold'}],
 sofaseashell:['sofa',{c:'#f6c9d6',c2:'#fde1e7',back:'shell',pillows:['#bfe6ea','#fff2d6'],legC:'gold',tufted:false}],
 sofacrescent:['sofa',{c:'#f6c453',c2:'#fbd77e',back:'round',pillows:['#9fcbe6','#ffffff'],legC:'#f2dcbc'}],
 armchairheart:['sofa',{W:1.0,D:.88,c:'#f39bb2',back:'round',pillows:['#ffffff'],legC:'gold'}],
 chairpink:['chair',{c:'#f39bb2',back:'round'}],chairmint:['chair',{c:'#a8dcc6',seat:'#fff2e6',back:'arch'}],chairgold:['chair',{c:'#fff4ec',seat:'#f6c9d6',back:'arch',gold:true}],
 chairheart:['chair',{c:'#f39bb2',seat:'#fde1e7',back:'heart'}],chairshell:['chair',{c:'#f6c9d6',back:'shell',gold:true}],chairmushroom:['chair',{c:'#ef7f8a',seat:'#fff4ec',frame:'#f6e3c6',back:'mushroom'}],
 chairbow:['chair',{c:'#f7c9d4',back:'bow'}],chairbutterfly:['chair',{c:'#c8b2f2',seat:'#fff2e6',back:'butterfly'}],chairrattan:['chair',{c:'#e2b984',seat:'#fff2e6',frame:'#d4a56d',back:'round'}],
 tablepink:['table',{c:'#f7c9d4',scallop:'#ffffff'}],tablewood:['table',{shape:'rect',c:'#e2b984',base:'#d4a56d',W:1.5,D:.85,h:.68}],tableglass:['table',{glass:true,base:'#e9c46a'}],
 tableheart:['table',{shape:'heart',c:'#f39bb2',r:.6,base:'#fff4ec'}],coffeetable:['table',{c:'#fff4ec',base:'#f6c9d6',h:.42,r:.6,scallop:'#f6c9d6'}],
 tabletulip:['table',{c:'#ffffff',base:'#ffffff',r:.55}],tablecafe:['table',{c:'#9fd8b8',base:'#fff4ec',r:.5,scallop:'#ffffff'}],tablebutterfly:['table',{c:'#c8b2f2',base:'#fff4ec',r:.55}],
 tablemushroom:['table',{c:'#ef7f8a',base:'#f6e3c6',h:.5,r:.55,mush:true}],tablerainbow:['table',{c:'#fff4ec',base:'#f6c453',r:.6,scallop:'#f39bb2'}],tablediner:['table',{shape:'rect',c:'#a8dcc6',base:'#f2f2f2',W:1.2,D:.75,scallop:'#ffffff'}],
 tea:['table',{c:'#fff4ec',base:'#f6c9d6',scallop:'#f6c9d6'}],table:['table',{c:'#e2b984',base:'#d4a56d'}],
 dresser:['dresser',{}],dresserpearl:['dresser',{c:'#fbf3ec',front:'#ffffff',knob:'pearl'}],dressermint:['dresser',{c:'#a8dcc6',front:'#d7f0e5',knob:'heart'}],
 dresserflower:['dresser',{c:'#f7c9d4',front:'#fde6ec',knob:'flower',flower:true}],dresserstack:['dresser',{c:'#fff4ec',rows:4,H:1.1,stack:['#f39bb2','#f6c453','#9fd8b8','#9fcbe6'],knob:'pearl'}],
 nightstand:['dresser',{W:.6,H:.62,D:.45,rows:2,knob:'heart'}],wardrobe:['dresser',{W:1.05,H:1.9,D:.55,doors:true,crown:true,knob:'heart'}],
 desk:['vanity',{c:'#fff4ec',top:'#ffffff',mirror:'oval'}],vanity:['vanity',{}],vanitybow:['vanity',{c:'#f7c9d4',mirror:'heart'}],vanitystar:['vanity',{c:'#c8b2f2',top:'#f2ecff',mirror:'star'}],
 vanityheart:['vanity',{c:'#f39bb2',mirror:'heart',knob:'heart'}],vanityhollywood:['vanity',{c:'#ffffff',top:'#fff4ec',mirror:'oval',bulbs:true}],vanityshell:['vanity',{c:'#fde1e7',mirror:'shell',knob:'pearl'}],
 vanitywood:['vanity',{c:'#e2b984',top:'#f2dcbc',mirror:'arch',frame:'#d4a56d'}],vanityrainbow:['vanity',{c:'#fff4ec',mirror:'arch',rainbow:true}],
 shelf:['shelf',{c:'#e2b984',back:'#f2dcbc',top:null}],shelfrose:['shelf',{c:'#f6c9d6',top:'scallop'}],shelfcloud:['shelf',{c:'#ffffff',back:'#dcefff',top:'cloud'}],
 shelfgold:['shelf',{c:'#fff4ec',back:'#fbe9ee',top:'arch',gold:true}],shelfmint:['shelf',{c:'#a8dcc6',back:'#e3f5ec',top:'round'}],
 lampmushroom:['lamp',{c:'#f6e3c6',shade:'#ef7f8a',mush:true}]
};

Object.assign(CLAY_PIECES,{
 sparklerug:['rug',{c:'#f6c9d6',c2:'#fff4ec',dots:true}],bathmat:['rug',{shape:'rect',c:'#bfe3f5',c2:'#ffffff',w:1.0,d:.6}],clayrug:['rug',{shape:'cloud',c:'#fff4ec',w:1.6,d:1.3}],
 rug:['rug',{c:'#f7a88f',c2:'#fff4ec'}],rugflower:['rug',{shape:'flower',c:'#f6c9d6',w:1.6,d:1.6}],rugcloud:['rug',{shape:'cloud',c:'#ffffff',w:1.6,d:1.3}],
 plant:['plant',{}],flowers:['plant',{kind:'flowers'}],plantcactus:['plant',{kind:'cactus'}],bathplant:['plant',{pot:'#ffffff',s:.8}],pinkflowers:['mini',{kind:'vase',c:'#f6c9d6'}],
 plantmini:['plant',{kind:'succulent'}],clayplant:['plant',{kind:'monstera',pot:'#fff4ec'}],daisyplanter:['plant',{kind:'daisy',pot:'#9fd8b8'}],flowers2:['plant',{kind:'tulip',pot:'#f39bb2'}],tree:['plant',{kind:'tree'}],
 light:['light',{kind:'floor'}],fairylights:['light',{kind:'string'}],dininglamp:['light',{kind:'pendant',shade:'#bfe6d4'}],lampmoon:['light',{kind:'moon',c:'#c8b2f2'}],bunnylamp:['light',{kind:'bunny',shade:'#fff4ec'}],
 claylight:['light',{kind:'lantern'}],crystalchandelier:['light',{kind:'chandelier'}],rosependant:['light',{kind:'pendant',shade:'#f6c9d6'}],cloudceiling:['light',{kind:'cloud'}],paperlanterns:['light',{kind:'lantern'}],
 starsconce:['light',{kind:'sconce',c:'#f6c453',shade:'#fff4d6'}],heartsconce:['light',{kind:'sconce',c:'#f39bb2',shade:'#fde1e7'}],neonrainbow:['light',{kind:'neon'}],tulipfloorlamp:['light',{kind:'floor',c:'#f39bb2',shade:'#fde1e7'}],
 bowdesklamp:['light',{kind:'table',c:'#f39bb2',shade:'#fff4ec'}],lavalamp:['light',{kind:'lava',c:'#c8b2f2'}],
 stove:['appliance',{kind:'stove'}],ovenheart:['appliance',{kind:'oven',c:'#f6c9d6',a:'#e8848f'}],sink:['appliance',{kind:'sink',a:'#bfe6d4'}],mixer:['appliance',{kind:'mixer',a:'#f39bb2'}],
 toaster:['appliance',{kind:'toaster',a:'#9fd8b8'}],coffeemachine:['appliance',{kind:'coffee',a:'#f7a88f'}],cupcakecase:['appliance',{kind:'cupcakecase'}],icecreamcart:['appliance',{kind:'icecreamcart'}],
 claystove:['appliance',{kind:'stove',c:'#bfe6d4',a:'#f39bb2'}],clayfridge:['appliance',{kind:'minifridge',c:'#bfe3f5',a:'#f39bb2',heart:true}],
 bath:['bath',{kind:'tub'}],toilet:['bath',{kind:'toilet'}],bathsink:['bath',{kind:'sink'}],bathmirror:['bath',{kind:'mirror'}],shower:['bath',{kind:'shower'}],
 claytub:['bath',{kind:'tub',c:'#fde1e7'}],claysink:['bath',{kind:'sink',c:'#fde1e7'}],towelrack:['bath',{kind:'rack'}],hamper:['bath',{kind:'hamper'}],
 soap:['mini',{kind:'soap',c:'#f6c9d6'}],towels:['mini',{kind:'towels'}],toothbrush:['mini',{kind:'toothbrush',c:'#bfe6d4'}],rubberduck:['mini',{kind:'duck'}],petduck:['mini',{kind:'duck'}],
 claysoap:['mini',{kind:'soap',c:'#c8b2f2'}],claytowel:['mini',{kind:'towels'}],
 fruitbowl:['mini',{kind:'bowl',c:'#fff4ec',fruit:true}],milkcarton:['mini',{kind:'milk'}],eggcarton:['mini',{kind:'eggs'}],applesbasket:['mini',{kind:'apples'}],cheeseplate:['mini',{kind:'cheese'}],
 juicebottle:['mini',{kind:'juice'}],breadbasket:['mini',{kind:'bread'}],strawberryjam:['mini',{kind:'jam'}],cupcake:['mini',{kind:'cupcake'}],cakeplate:['mini',{kind:'cakeplate'}],
 waffles:['mini',{kind:'waffles'}],donuttower:['mini',{kind:'donuts'}],macaronplate:['mini',{kind:'macarons'}],claybowl:['mini',{kind:'bowl',c:'#f6c9d6'}],heartteapot:['mini',{kind:'teapot',c:'#f39bb2',heart:true}],
 claycup:['mini',{kind:'cup',c:'#9fcbe6'}],clayplate:['mini',{kind:'plate',c:'#f6c453'}],teacups:['mini',{kind:'teacups',c:'#f39bb2'}],clayjar:['mini',{kind:'jar',c:'#f6c9d6'}],claytray:['mini',{kind:'tray',c:'#f6c9d6',c2:'#9fcbe6'}],
 cake:['cake',{}],birthdaycake:['cake',{tiers:[['#f39bb2',.3,.18],['#fff4ec',.22,.16],['#9fcbe6',.15,.14]]}],partycake:['cake',{tiers:[['#fff4ec',.36,.16],['#f6c9d6',.29,.15],['#c8b2f2',.22,.14],['#fff4ec',.16,.13],['#f39bb2',.1,.12]],topper:'star'}],
 icecreamtower:['cake',{tiers:[['#fff1c8',.2,.12]],topper:'scoops',drip:'#f39bb2'}],claycake:['cake',{tiers:[['#fff4ec',.26,.2]],topper:'strawberry',drip:'#f39bb2'}],claycupcake:['mini',{kind:'cupcake',c:'#9fcbe6'}],
 birthdayballoons:['party',{kind:'balloons'}],birthdaybanner:['party',{kind:'banner'}],partyarch:['party',{kind:'arch'}],partydisco:['party',{kind:'disco'}],partyphotobooth:['party',{kind:'photobooth'}],pinata:['party',{kind:'pinata'}],
 birthdaygifts:['mini',{kind:'gift',c:'#9fcbe6',c2:'#f39bb2'}],birthdayhat:['mini',{kind:'hat',c:'#f39bb2',c2:'#ffffff'}],claygift:['mini',{kind:'gift',c:'#f6c9d6',c2:'#ffffff'}],clayhat:['mini',{kind:'hat',c:'#c8b2f2',c2:'#ffffff'}],
 pool:['garden',{kind:'pool'}],treehouse:['garden',{kind:'treehouse'}],slide:['garden',{kind:'slide',c:'#f39bb2'}],trampoline:['garden',{kind:'trampoline'}],sandbox:['garden',{kind:'sandbox'}],
 gazebo:['garden',{kind:'gazebo'}],hammock:['garden',{kind:'hammock'}],lemonade:['garden',{kind:'lemonade'}],rainbow:['garden',{kind:'rainbow'}],pond:['garden',{kind:'pond'}],
 fountain:['garden',{kind:'fountain'}],birdhouse:['garden',{kind:'birdhouse'}],mushroomring:['garden',{kind:'mushroomring'}],
 picture:['wall',{kind:'picture'}],clock:['wall',{kind:'clock',c:'#f39bb2'}],seastar:['mini',{kind:'seastar',c:'#f7a88f'}],mirrorstar:['wall',{kind:'mirror',shape:'star'}],fireplace:['wall',{kind:'fireplace'}],
 grandclock:['wall',{kind:'grandclock'}],snowglobe:['mini',{kind:'snowglobe'}],star:['mini',{kind:'starstand',c:'#f6c453'}],bow:['mini',{kind:'bowstand',c:'#f39bb2'}],claylamp:['mini',{kind:'claylamp',c:'#f6c9d6',c2:'#fff4ec'}],clayvase:['mini',{kind:'vase',c:'#9fcbe6'}],
 jellyfish:['mini',{kind:'jellyfish',c:'#c8b2f2',c2:'#f6c9d6'}],pinkcurtains:['wall',{kind:'curtains',c:'#f6c9d6'}],daisymirror:['wall',{kind:'mirror',shape:'daisy'}],claymirror:['wall',{kind:'mirror',c:'#f6c9d6'}],heartmirror:['wall',{kind:'mirror',shape:'heart',c:'#f39bb2'}],
 teddy:['plush',{}],unicorn:['plush',{kind:'unicorn',c:'#fbf6ff',c2:'#ffffff'}],bunnyplush:['plush',{kind:'bunny',c:'#fbf8f6',c2:'#ffffff'}],clayplush:['plush',{kind:'kitty',c:'#f6c9d6',c2:'#ffffff'}],
 perfume:['mini',{kind:'perfume'}],makeup:['mini',{kind:'makeup'}],jewels:['mini',{kind:'jewels'}],clayjewelry:['mini',{kind:'jewels'}],claybrush:['mini',{kind:'brush'}],
 books:['mini',{kind:'books'}],bookset:['mini',{kind:'bookset'}],claybooks:['mini',{kind:'books'}],trophy:['mini',{kind:'trophy'}],
 beanbag:['seat',{kind:'beanbag'}],poufsun:['seat',{kind:'pouf',c:'#fff1c8',sun:true}],hangingchair:['seat',{kind:'hanging',c:'#f6c9d6'}],stoolmushroom:['seat',{kind:'stool'}],strawberrypouf:['seat',{kind:'strawberry'}],
 chair:['seat',{kind:'armchair',c:'#9fcbe6'}],sofacorner:['seat',{kind:'corner',c:'#bfe6d4'}],chairdiner:['seat',{kind:'booth',c:'#f39bb2'}],
 tableaquarium:['tableX',{kind:'aquarium'}],tablechess:['tableX',{kind:'chess'}],tablepicnic:['tableX',{kind:'picnic'}],tableisland:['tableX',{kind:'island'}],
 bedbunk:['bunk',{}],bedloft:['bunk',{loft:true,c:'#c8b2f2'}],
 puzzle:['toy',{kind:'puzzle'}],crafts:['toy',{kind:'crafts'}],puppet:['toy',{kind:'puppet'}],dollstroller:['toy',{kind:'stroller',c:'#f39bb2'}],marbles:['toy',{kind:'marbles'}],playmat:['toy',{kind:'playmat'}],
 doll:['toy',{kind:'doll'}],dollhousemini:['toy',{kind:'dollhouse'}],blocks:['toy',{kind:'blocks'}],rocker:['toy',{kind:'rocker',c:'#fff4ec'}],rockinghorse:['toy',{kind:'rockinghorse',c:'#f6c9d6'}],
 trainset:['toy',{kind:'train'}],minipaintset:['toy',{kind:'paints'}],toycastle:['toy',{kind:'castle'}],tents:['toy',{kind:'tent',c:'#f6c9d6'}],playtent:['toy',{kind:'tent',c:'#9fcbe6'}],arttable:['toy',{kind:'arttable'}],
 petbedpink:['petstuff',{kind:'bed'}],petbedblue:['petstuff',{kind:'bed',c:'#9fcbe6'}],petbed:['petstuff',{kind:'bed',c:'#f7a88f'}],cloudpetbed:['petstuff',{kind:'cloud',c:'#ffffff',c2:'#f6c9d6'}],petcastle:['petstuff',{kind:'castle',c:'#e6dbff',c2:'#cdb6f2'}],pettower:['petstuff',{kind:'tower',c:'#f6c9d6'}],petbowl:['petstuff',{kind:'bowl'}],pettoy:['petstuff',{kind:'toy'}],piano:['piano',{}],
 bookshelfplay:['shelf',{c:'#e2b984',back:'#f2dcbc',top:'round',topC:'#f39bb2'}]
});
/* New items so every shop category has at least four choices: [id, emoji, name, price, placement room, shop room, category, sculpt, options, onWall] */
const CLAY_NEW=[
 ['pinkguitar','🎸','Pink guitar',48,'living','living','Musical instruments','instrument',{kind:'guitar',c:'#f39bb2'}],
 ['ukulele','🪕','Mint ukulele',32,'living','living','Musical instruments','instrument',{kind:'ukulele',c:'#9fd8b8'}],
 ['harp','🎼','Golden harp',70,'living','living','Musical instruments','instrument',{kind:'harp',c:'#f6c9d6'}],
 ['heartrug','💗','Heart rug',36,'bedroom','bedroom','Rugs','rug',{shape:'heart',c:'#f39bb2',c2:'#fde1e7',w:1.5}],
 ['starrug','⭐','Star rug',36,'bedroom','bedroom','Rugs','rug',{shape:'star',c:'#f6c453',c2:'#fff4ec',w:1.6}],
 ['fluffyrug','☁️','Fluffy round rug',30,'bedroom','bedroom','Rugs','rug',{c:'#fff4ec',c2:'#f6c9d6',fringe:true}],
 ['cloudbathmat','☁️','Cloud bath mat',20,'bathroom','bathroom','Rugs','rug',{shape:'cloud',c:'#ffffff',w:1.0,d:.75}],
 ['duckbathmat','🦆','Duck bath mat',22,'bathroom','bathroom','Rugs','rug',{shape:'rect',c:'#f6d24a',c2:'#fff4ec',w:1.0,d:.6,dots:true}],
 ['scallopbathmat','🐚','Scallop bath mat',22,'bathroom','bathroom','Rugs','rug',{shape:'flower',c:'#f6c9d6',w:1.0,d:1.0}],
 ['bathcandles','🕯️','Bath candles',18,'bathroom','bathroom','Decor','mini',{kind:'candles'}],
 ['shelljar','🐚','Seashell jar',18,'bathroom','bathroom','Decor','mini',{kind:'jar',c:'#bfe3f5'}],
 ['bathart','🖼️','Bubble wall art',24,'bathroom','bathroom','Decor','wall',{kind:'picture',c:'#bfe3f5'},1],
 ['berrypendant','🍓','Strawberry pendant',38,'kitchen','kitchen','Lighting','light',{kind:'pendant',shade:'#f39bb2'}],
 ['tulippendant','🌷','Tulip pendant',38,'kitchen','kitchen','Lighting','light',{kind:'pendant',shade:'#fff1c8'}],
 ['kitchensconce','💡','Mint wall light',28,'kitchen','kitchen','Lighting','light',{kind:'sconce',c:'#9fd8b8',shade:'#fff4ec'},1],
 ['cookiejar','🍪','Cookie jar',16,'kitchen','kitchen','Kitchen miniatures','mini',{kind:'cookiejar',c:'#f39bb2'}],
 ['spicerack','🧂','Spice rack',20,'kitchen','kitchen','Kitchen miniatures','mini',{kind:'spicerack'}],
 ['utensilcrock','🥄','Utensil crock',14,'kitchen','kitchen','Kitchen miniatures','mini',{kind:'crock',c:'#9fcbe6'}],
 ['heartkitchencabinet','💗','Heart Kitchen Cabinet',150,'kitchen','kitchen','Storage','appliance',{kind:'sink',a:'#e8adc3'}],
 ['pantry','🗄️','Pastel pantry',55,'kitchen','kitchen','Storage','dresser',{W:.9,H:1.8,D:.55,doors:true,crown:true,c:'#fdf3ea',front:'#f6c9d6',knob:'heart'}],
 ['dishhutch','🍽️','Dish hutch',60,'kitchen','kitchen','Storage','dresser',{W:1.1,H:1.0,D:.5,rows:2,c:'#bfe6d4',front:'#e3f5ec',knob:'pearl'}],
 ['diary','📔','Secret diary',12,'any','miniatures','Books & toys','mini',{kind:'diary',c:'#c8b2f2'}],
 ['hairbows','🎀','Hair bows',10,'any','bedroom','Beauty & jewelry','mini',{kind:'bows'}],
 ['nailpolish','💅','Nail polish set',12,'any','bedroom','Beauty & jewelry','mini',{kind:'nailpolish'}],
 ['monstera','🪴','Monstera plant',30,'any','living','Plants','plant',{kind:'monstera',pot:'#9fd8b8'}],
 ['hangingplant','🌿','Trailing plant',26,'any','living','Plants','plant',{kind:'hanging',pot:'#f6c9d6'}],
 ['rainbowrug','🌈','Rainbow rug',40,'any','living','Rugs','rug',{shape:'rainbow',w:1.8}],
 ['minifridge','🧊','Mini fridge',45,'kitchen','kitchen','Fridges','appliance',{kind:'minifridge',c:'#f6c9d6',a:'#ffffff'}],
 ['heartfridge','💗','Heart fridge',55,'kitchen','kitchen','Fridges','appliance',{kind:'minifridge',c:'#fff4ec',a:'#f39bb2',heart:true}],
 ['sunflowers','🌻','Sunflower pot',24,'garden','garden','Plants','plant',{kind:'sunflower',pot:'#e9a07a',s:1.3}],
 ['rosebush','🌹','Rose bush',30,'garden','garden','Plants','plant',{kind:'rosebush',c:'#6aa66f',petal:'#f39bb2'}],
 ['topiary','🌳','Round topiary',34,'garden','garden','Plants','plant',{kind:'topiary',pot:'#fff4ec'}],
 ['strawberrypatch','🍓','Strawberry patch',28,'garden','garden','Plants','plant',{kind:'patch',petal:'#e2385f'}],
 ['candles','🕯️','Candle trio',14,'any','miniatures','Flowers & decor','mini',{kind:'candles'}],
 ['fairyjar','✨','Fairy light jar',16,'any','miniatures','Flowers & decor','mini',{kind:'fairyjar'}],
 ['photoframe','🖼️','Photo frame',12,'any','miniatures','Flowers & decor','mini',{kind:'frame',c:'#f6c9d6'}],
 ['gardenbench','🪑','Garden bench',40,'garden','garden','Outdoor furniture','garden',{kind:'bench',c:'#f6c9d6'}],
 ['picnicblanket','🧺','Picnic blanket',26,'garden','garden','Outdoor furniture','garden',{kind:'picnic'}],
 ['patiotable','⛱️','Umbrella table',50,'garden','garden','Outdoor furniture','garden',{kind:'umbrella'}],
 ['adirondack','🪑','Lounge chair',36,'garden','garden','Outdoor furniture','garden',{kind:'adirondack',c:'#9fcbe6'}],
 ['kittyplush','🐱','Kitty plush',18,'bedroom','bedroom','Plushies','plush',{kind:'kitty',c:'#f6e3c6',c2:'#ffffff'}],
 ['dinoplush','🦕','Dino plush',20,'bedroom','bedroom','Plushies','plush',{kind:'dino',c:'#9fd8b8',c2:'#e3f5ec'}],
 ['wallhearts','💕','Wall hearts',16,'bedroom','bedroom','Decor','wall',{kind:'hearts'},1],
 ['dreamcatcher','🪶','Dream catcher',18,'bedroom','bedroom','Decor','wall',{kind:'dreamcatcher'},1]
];
/* Put stray items in a real shop room and category */
const CLAY_RECAT={claylight:['living','Lighting'],clayrug:['living','Rugs'],claycake:['party','Cakes & treats'],claybooks:['miniatures','Books & toys'],claygift:['party','Gifts & hats'],clayhat:['party','Gifts & hats'],
 claylamp:['living','Lighting'],clayvase:['living','Decor'],clayplant:['living','Plants'],teacups:['kitchen','Tableware'],claytray:['kitchen','Tableware'],claycupcake:['kitchen','Treats'],
 perfume:['bedroom','Beauty & jewelry'],makeup:['bedroom','Beauty & jewelry'],jewels:['bedroom','Beauty & jewelry'],petbowl:['pets','Pet beds'],pettoy:['pets','Pet beds'],cakeplate:['kitchen','Treats'],playtent:['playroom','Furniture'],petduck:['bathroom','Bath accessories'],rockinghorse:['playroom','Toys'],toycastle:['playroom','Toys']};
const CLAY_DRESS={bathcabinet:{c:'#bfe3f5',front:'#e3f4fb',knob:'pearl'},cupboard:{c:'#fdf3ea',front:'#f6c9d6',knob:'heart'},tvcabinet:{c:'#fff4ec',front:'#f6c9d6'},fridge:{c:'#fdf3ea',front:'#fff8f0'},fridgeretro:{c:'#bfe6d4',front:'#d7f0e5'}};

CLAY_NEW.forEach(n=>{CLAY_PIECES[n[0]]=[n[7],n[8]];});

let kit=null;const fit={};
/* New shop items and category fixes */
{const ITEMS=(0,eval)('typeof ITEMS!=="undefined"?ITEMS:null'),META=window.RikiCatalog&&window.RikiCatalog.meta;
 if(Array.isArray(ITEMS))CLAY_NEW.forEach(n=>{if(!ITEMS.some(x=>x[0]===n[0]))ITEMS.push([n[0],n[1],n[2],n[3],n[4]]);});
 if(META){CLAY_NEW.forEach(n=>{META[n[0]]={room:n[5],category:n[6],name:n[2],new:true};});Object.entries(CLAY_RECAT).forEach(([id,[room,cat]])=>{if(META[id])Object.assign(META[id],{room,category:cat});});}}
const NEW_WALL=new Set(CLAY_NEW.filter(n=>n[9]).map(n=>n[0]));
const KEEP=/^(swing|swingrainbow|butterfly|fishtank|fridge|fridgeretro|shelfmoon|shelftree|shelfhouse|shelfrainbow|shelfladder|shelfcastle|shelfpineapple|rainbowcubbies|toybox|blushtoybox|cupboard|bathcabinet|tvcabinet)$/;
const STORE=/^(fridge|shelf|dresser|vanity)|^(heartkitchencabinet|clayfridge|heartfridge|minifridge|wardrobe|cupboard|tvcabinet|nightstand|desk|bathcabinet|bookshelfplay|toybox|rainbowcubbies|blushtoybox)$/;
Object.keys(CLAY_PIECES).forEach(id=>{if(KEEP.test(id))return;const [fn,o]=CLAY_PIECES[id];const old=K.MODEL[id];
  const f=function(g,it){kit=kit||makeClayKit(THREE);const inner=new THREE.Group();kit[fn](inner,o);
    if(fit[id]===undefined){let s=1;if(old&&!STORE.test(id)){try{const tg=new THREE.Group();old(tg,it||[id]);const a=new THREE.Box3().setFromObject(tg).getSize(new THREE.Vector3()),b=new THREE.Box3().setFromObject(inner).getSize(new THREE.Vector3());const fa=Math.max(a.x,a.z),fb=Math.max(b.x,b.z);if(fa>.05&&fb>.05)s=Math.min(1.3,Math.max(.75,fa/fb));}catch(e){}}fit[id]=s;}
    const s=fit[id];while(inner.children.length){const c=inner.children[0];inner.remove(c);if(s!==1){c.position.multiplyScalar(s);c.scale.multiplyScalar(s);}g.add(c);}
  };
  f.wall=NEW_WALL.has(id)||!!(old&&old.wall);f.clay=1;K.MODEL[id]=f;});
const colorOf=id=>/mint|retro/.test(id)?'#a8d8c6':/gold/.test(id)?'#f2daa0':/cloud|pearl|wood/.test(id)?'#f8eddd':/moon|star/.test(id)?'#d3c5e9':'#f2c3d1';
const near=(m,hex)=>{const c=m.material.color.clone().convertLinearToSRGB(),t=new THREE.Color(hex);return Math.abs(c.r-t.r)+Math.abs(c.g-t.g)+Math.abs(c.b-t.b)<.04;};
function dressStorage(g,id){const P=CLAY_DRESS[id]?['dresser',CLAY_DRESS[id]]:CLAY_PIECES[id];const st=g.userData.storage;if(!P||!st)return;const [fn,o]=P;if(fn!=='dresser'&&fn!=='vanity')return;kit=kit||makeClayKit(THREE);
  const body=kit.M(o.c||'#f6d6df'),front=kit.M(o.front||o.top||o.c||'#fbe9ee'),base=colorOf(id);const fronts=new Set();
  st.parts.forEach(p=>{if(p.kind==='drawer'||p.kind==='door'){const m=p.group.children.find(c=>c.isMesh&&c.geometry&&c.geometry.type!=='SphereGeometry');if(m)fronts.add(m);}});
  const knobs=[],mirrorBits=[];g.traverse(m=>{if(!m.isMesh||!m.material||!m.material.color)return;
    if(fronts.has(m)){m.material=front;return;}
    if(m.geometry&&m.geometry.type==='SphereGeometry'){const r=m.geometry.parameters.radius;if(r>.25)mirrorBits.push(m);else if(near(m,'#dec187'))knobs.push(m);return;}
    if(near(m,base))m.material=body;else if(near(m,'#dec187'))m.material=kit.M(o.c||'#f6d6df');});
  if(o.knob&&o.knob!=='brass')knobs.forEach(k=>{k.visible=false;kit.knob(k.parent,o.knob,k.position.x,k.position.y,k.position.z-.05);});
  if(fn==='vanity'&&mirrorBits.length){mirrorBits.forEach(m=>m.visible=false);kit.mirror(g,o,1.17,-.16);}
  const bb=new THREE.Box3().setFromObject(g),sz=bb.getSize(new THREE.Vector3());if(fn==='dresser'&&sz.x>.2){kit.add(g,kit.puff(sz.x+.06,.06,sz.z+.04,.06,.025),kit.M(o.top||o.c||'#f6d6df'),(bb.max.x+bb.min.x)/2,bb.max.y+.02,(bb.max.z+bb.min.z)/2-.02);}
  if(o.flower){const fz=bb.max.z+.01;for(let i=0;i<5;i++){const a=i/5*Math.PI*2;kit.ball(g,.045,kit.M('#ffffff'),bb.min.x+.18+Math.cos(a)*.055,bb.max.y-.16+Math.sin(a)*.055,fz,1,1,.4);}kit.ball(g,.035,kit.M('#f6c453'),bb.min.x+.18,bb.max.y-.16,fz+.01);}
}
const prevPrep=K.prepareStorage;if(prevPrep)K.prepareStorage=function(g,it){const r=prevPrep.apply(this,arguments);try{dressStorage(g,it&&it[0]);}catch(e){console.warn('clay storage',e);}return r;};
window.RikiClay={pieces:Object.keys(CLAY_PIECES).filter(id=>!KEEP.test(id)),added:CLAY_NEW.map(n=>n[0])};
})();
