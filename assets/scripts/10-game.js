
/* Riki 3D Dollhouse: sculpted cartoon room and volumetric furniture with interactive orbit and placement.
   All scene geometry is projected from real x/y/z vertices with camera rotation and face shading. */
(function(){
const oldDreamHtml=dreamHtml,oldDreamBind=dreamBind;
let orbit=Number(localStorage.getItem('riki3dOrbit')||0),showRoof=false,activeId=null,canvas,ctx,sceneItems=[],mouseStart=null;
const palette={bedroom:{wall:'#e8c7df',side:'#c7a3c9',floor:'#bb8d67',accent:'#a96bb0',name:'Princess bedroom'},kitchen:{wall:'#e8f4df',side:'#c6dfce',floor:'#c69a78',accent:'#83adac',name:'Sunny kitchen'},living:{wall:'#f1ddc7',side:'#d3b5a5',floor:'#a77958',accent:'#bd847c',name:'Cozy living room'},garden:{wall:'#a9d9f2',side:'#8ebbcf',floor:'#80bd79',accent:'#6fae77',name:'Garden terrace'}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function shade(hex,k){let c=hex.replace('#','');if(c.length!==6)return hex;return '#'+[0,2,4].map(i=>clamp(Math.round(parseInt(c.slice(i,i+2),16)*k),0,255).toString(16).padStart(2,'0')).join('')}
function rgba(hex,a){return hex+' '+Math.round(a*100)+'%'}
function project(v){let [x,y,z]=v,angle=-.66+orbit;let xx=x*Math.cos(angle)-y*Math.sin(angle),yy=x*Math.sin(angle)+y*Math.cos(angle);let elev=.56;return {x:500+xx*63,y:335+yy*31-z*53,depth:yy+z*.004}}
function polygon(pts,color,stroke,alpha=1){ctx.globalAlpha=alpha;ctx.beginPath();pts.forEach((p,i)=>{let q=project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)});ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}ctx.globalAlpha=1}
function face(points,color){sceneItems.push({points,color,depth:points.reduce((a,p)=>a+project(p).depth,0)/points.length})}
function box(x,y,z,w,d,h,color){let A=[x,y,z],B=[x+w,y,z],C=[x+w,y+d,z],D=[x,y+d,z],E=[x,y,z+h],F=[x+w,y,z+h],G=[x+w,y+d,z+h],H=[x,y+d,z+h];face([A,B,F,E],shade(color,.86));face([B,C,G,F],shade(color,.68));face([C,D,H,G],shade(color,.79));face([D,A,E,H],shade(color,.76));face([E,F,G,H],shade(color,1.19))}
function panel(x,y,z,w,d,h,color){box(x,y,z,w,d,h,color)}
function cylinder(x,y,z,r,h,color,n=10){let top=[],bottom=[];for(let i=0;i<n;i++){let a=i/n*Math.PI*2;top.push([x+r*Math.cos(a),y+r*Math.sin(a),z+h]);bottom.push([x+r*Math.cos(a),y+r*Math.sin(a),z])}for(let i=0;i<n;i++)face([bottom[i],bottom[(i+1)%n],top[(i+1)%n],top[i]],shade(color,.78+i/n*.24));face(top,color)}
function artRoom(){const p=palette[currentRoom]||palette.bedroom;
// Distinct room shells with architectural depth and real 3D walls.
box(-6,-5,-.38,12,10,.34,p.floor);
if(currentRoom!=='garden'){
 box(-6,4.68,0,12,.28,7,p.wall);box(-6,-5,0,.3,10,7,p.side);
 // baseboards and wall trim
 box(-5.8,4.48,0,11.8,.16,.22,'#f8ebd8');box(-5.78,-4.9,0,.18,9.7,.22,'#f8ebd8');
 // back wall window with sky and dimensional mullions
 box(-3.9,4.28,2.5,2.8,.18,2.9,'#f9f1e8');box(-3.65,4.18,2.75,2.3,.08,2.4,'#8bd4f3');box(-2.56,4.09,2.75,.13,.12,2.4,'#fffdf1');box(-3.65,4.09,3.9,2.3,.12,.12,'#fffdf1');
 box(-4.1,4.03,2.3,3.2,.23,.17,'#fff9ee');
 // left door with raised molding
 box(-5.73,-3.8,0,.15,2.4,4.5,currentRoom==='bedroom'?'#e7b7d5':'#b68f73');box(-5.56,-2.65,2,.08,.16,.16,'#efca7a');
 }
 if(currentRoom==='bedroom'){
  box(1.3,4.31,1.4,3.4,.2,3.7,'#fff1f9');box(1.5,4.14,1.65,3,.12,3.2,'#ce9fc8');box(1.7,4.04,1.85,2.6,.1,2.8,'#f9e4f4');
  for(let i=0;i<5;i++)cylinder(2+i*.55,4,5.3,.12,.15,'#fff2be');
  box(-.3,1.1,.02,4,2,.08,'#e7b9cf');box(-.1,1.3,.1,3.6,1.6,.06,'#f7dce8');
  cylinder(4.4,-3.4,0,.34,3.8,'#d5a77a');cylinder(4.4,-3.4,3.7,.6,.28,'#ffe4a2');
 }else if(currentRoom==='kitchen'){
  for(let i=0;i<5;i++){box(-5.4+i*2,3.85,0,1.9,.65,2.1,i%2?'#e5d1ad':'#f2e1c4');box(-5.4+i*2,3.77,2.15,1.9,.8,.16,'#a0b4ae');box(-5.4+i*2,4.1,3.8,1.9,.4,1.5,'#f4e6cb')}
  box(1.3,3.69,2.34,2,.11,.04,'#fafafa');cylinder(2.4,3.4,2.36,.08,.4,'#b3c3c7');
  box(3.4,-4,0,1.6,1.3,3.4,'#d6e8e7');box(3.5,-3.9,1.55,1.45,.1,.1,'#a3b7c2');
 }else if(currentRoom==='living'){
  box(1.6,4.12,0,3.3,.65,3.4,'#e9c8ac');box(1.95,4,1.1,2.6,.13,1.7,'#b6786a');box(2.25,3.9,1.2,2,.08,1.25,'#6b4b48');
  box(2.4,3.85,1.3,1.7,.09,1,'#edac60');box(1.5,3.9,3.1,3.5,.2,.28,'#e4bba2');
  box(-1.2,4.03,3.3,1.5,.16,1.4,'#aa865e');box(-1.05,3.92,3.45,1.2,.08,1.1,'#f5e2b3');
  box(-1,-2,.03,4.5,2.5,.07,'#e9d3bc');
 }else{
  for(let i=0;i<13;i++){box(-5.8+i*.9,4.5,0,.12,.2,2.5,'#fff0d6');box(-5.8+i*.9,4.5,2.2,.95,.2,.18,'#fff0d6')}
  box(-4.9,1.8,0,3.4,2.5,.15,'#d9d4a2');box(-4.8,1.9,.15,3.2,2.3,3.4,'#a2d9c9');
  box(-4.6,1.7,.3,2.8,.15,3.4,'#effff0');box(-3.3,1.7,.3,.12,2.4,3.3,'#effff0');
  for(let i=0;i<8;i++){cylinder(-5+i*1.3,-3.8,0,.3,.45,'#a96b4d');cylinder(-5+i*1.3,-3.8,.45,.48,.27,i%2?'#f5a2c7':'#f5d47d')}
  box(1.5,3.8,0,3.5,.25,2.5,'#d8bba0');
 }
}
function furniture(id,x,y){let it=ITEMS.find(t=>t[0]===id);if(!it)return;let n=(it[2]+' '+id).toLowerCase();let col=n.includes('pink')||n.includes('princess')||n.includes('rose')||n.includes('blush')?'#f5a9c8':n.includes('sea')||n.includes('ocean')||n.includes('shell')||n.includes('mermaid')?'#8ed7dc':n.includes('royal')||n.includes('castle')?'#b7a1ed':n.includes('wood')||n.includes('rustic')?'#b98b63':n.includes('cloud')?'#f2e6f9':n.includes('mushroom')?'#e9a36b':n.includes('gold')?'#e9c47b':'#c5b5dc';
let bed=/bed|bunk|loft|crib|carriage/.test(n),seat=/chair|stool|sofa|couch|loveseat|armchair|throne|booth/.test(n),table=/table|desk|island|counter/.test(n),shelf=/shelf|dresser|vanity|cabinet|wardrobe|bookcase|fridge|refrigerator|closet/.test(n),pet=/cat|dog|puppy|bunny|poodle|corgi|hamster|parrot/.test(n);
if(bed){box(x-1.3,y-.75,0,2.6,1.5,.55,'#a87b65');box(x-1.3,y-.75,.55,2.6,1.5,.32,col);box(x-1.3,y+.62,.25,2.6,.23,1.8,shade(col,.83));box(x-1.1,y-.6,.88,.9,.55,.18,'#fff5f0');box(x-.05,y-.6,.88,.9,.55,.18,'#fff5f0');if(/bunk|loft/.test(n)){box(x-1.3,y-.75,2.3,2.6,1.5,.33,col);for(let a of [-1.15,1.12])for(let b of [-.58,.58])box(x+a,y+b,0,.15,.15,2.65,'#ad8a72')}if(/castle/.test(n)){for(let i=0;i<4;i++)box(x-1.35+i*.78,y+.58,1.9,.3,.32,.55,'#e5cbf7')}if(/carriage/.test(n)){for(let i of [-.9,.9])cylinder(x+i,y-.8,0,.33,.16,'#caa77a')}}
else if(seat){let sofa=/sofa|couch|loveseat|booth/.test(n),w=sofa?2.6:1.25;box(x-w/2,y-.55,.35,w,1.15,.62,col);box(x-w/2,y+.37,.32,w,.3,1.55,shade(col,.8));box(x-w/2-.12,y-.55,.35,.25,1.15,.9,shade(col,.82));box(x+w/2-.13,y-.55,.35,.25,1.15,.9,shade(col,.82));for(let a of [-w/2+.12,w/2-.27])for(let b of [-.42,.42])box(x+a,y+b,0,.14,.14,.45,'#9d765d');if(/shell|butterfly/.test(n)){for(let i=0;i<5;i++)box(x-w/2+i*w/5,y+.43,1.45,.2,.17,.25+Math.sin(i/4*Math.PI)*.4,shade(col,1.15))}if(/throne|royal/.test(n))box(x-.35,y+.48,1.9,.7,.18,.55,'#e9c77e')}
else if(table){box(x-1.1,y-.8,1.45,2.2,1.6,.18,col);for(let a of [-.9,.85])for(let b of [-.62,.55])box(x+a,y+b,0,.16,.16,1.5,'#aa8063');if(/butterfly/.test(n)){box(x-1.6,y-.4,1.5,.55,.9,.12,shade(col,1.2));box(x+1.05,y-.4,1.5,.55,.9,.12,shade(col,1.2))}}
else if(shelf){box(x-.95,y-.46,0,1.9,.95,3.2,col);for(let h of [1,2.1])box(x-.94,y-.54,h,1.88,1,.11,shade(col,.76));for(let a of [-.55,.3])box(x+a,y-.56,1.4,.12,.08,.12,'#f5d784');if(/vanity/.test(n)){box(x-.5,y-.58,3.2,1,.16,1.15,'#e9d8e9');box(x-.35,y-.65,3.37,.7,.08,.8,'#b9e3f3')}if(/fridge/.test(n)){box(x-.83,y-.59,1.8,1.65,.1,.13,'#9aafbc')}}
else if(pet){cylinder(x,y,.1,.55,.8,col);cylinder(x,y,.92,.4,.4,shade(col,1.12));for(let a of [-.3,.3])box(x+a-.08,y+.04,1.25,.18,.19,.36,col);cylinder(x-.17,y-.38,1.09,.055,.07,'#352b43');cylinder(x+.17,y-.38,1.09,.055,.07,'#352b43')}
else if(/lamp|light/.test(n)){cylinder(x,y,0,.3,.2,'#b69a7d');cylinder(x,y,.2,.09,2.3,'#b69a7d');cylinder(x,y,2.45,.65,.7,'#fff1ae')}
else if(/rug|carpet/.test(n)){box(x-1.4,y-1,.02,2.8,2,.08,col)}
else if(/plant|flower|tree/.test(n)){cylinder(x,y,0,.42,.6,'#b78063');cylinder(x,y,.6,.14,1.1,'#6b9c73');for(let i=0;i<5;i++)cylinder(x+Math.cos(i*1.26)*.45,y+Math.sin(i*1.26)*.45,1.45,.35,.35,i%2?'#f3a8ca':'#78b88b')}
else{box(x-.52,y-.48,0,1.04,.96,.75,col);box(x-.35,y-.3,.75,.7,.6,.25,shade(col,1.2))}
}
function wallPattern3D(){
 const selection=roomInteriors[currentRoom]||{},wall=INTERIORS.find(t=>t[0]===selection.wall&&interiorOwned(t[0]));
 const curtain=INTERIORS.find(t=>t[0]===selection.curtain&&interiorOwned(t[0]));
 if(currentRoom==='garden')return;
 if(wall){let id=wall[0],base=wall[3];
 for(let z=0.55;z<6.65;z+=.88)for(let x=-5.25;x<5.8;x+=1.05){
 if(x>-4.3&&x<-.6&&z>2.1&&z<5.7)continue;
 const Y=4.485; const f=(pts,col)=>face(pts.map(([xx,zz])=>[xx,Y,zz]),col);
 if(id.includes('stripe')||id.includes('rainbow')){box(x,4.46,z,.21,.036,.86,id.includes('rainbow')?'#d5c5f1':'#efb3cd');continue}
 if(id.includes('star')||id.includes('night')){let pts=[];for(let i=0;i<10;i++){let a=i*Math.PI/5-Math.PI/2,r=i%2?.13:.32;pts.push([x+Math.cos(a)*r,z+Math.sin(a)*r])}f(pts,'#ffe5a0')}
 else if(id.includes('heart'))f([[x-.27,z+.1],[x-.33,z+.27],[x-.17,z+.34],[x,z+.2],[x+.17,z+.34],[x+.33,z+.27],[x+.27,z+.1],[x,z-.25]],'#ee88af');
 else if(id.includes('cloud')){for(let [dx,dz,r] of [[-.23,0,.23],[0,.14,.31],[.25,0,.23]]){let pts=[];for(let i=0;i<12;i++){let a=i*Math.PI/6;pts.push([x+dx+Math.cos(a)*r,z+dz+Math.sin(a)*r])}f(pts,'#fffaf9')}}
 else if(id.includes('rose')||id.includes('daisy')||id.includes('flower')){for(let i=0;i<6;i++){let a=i*Math.PI/3;let cx=x+Math.cos(a)*.2,cz=z+Math.sin(a)*.2;let pts=[];for(let j=0;j<9;j++){let t=j*Math.PI/4;pts.push([cx+Math.cos(t)*.14,cz+Math.sin(t)*.14])}f(pts,id.includes('rose')?'#e48ab4':'#fffaf7')}let pts=[];for(let j=0;j<12;j++){let a=j*Math.PI/6;pts.push([x+Math.cos(a)*.11,z+Math.sin(a)*.11])}f(pts,'#f5c85d')}
 else {box(x,4.46,z,.2,.035,.25,'#fff9f7')}
 }}
 if(curtain){let c=curtain[3];for(let side of [-4.02,-1.2]){box(side,3.89,2.65,.68,.18,2.72,c);for(let i=0;i<3;i++)box(side+i*.21,3.83,2.65,.08,.08,2.72,shade(c,.77));box(side,3.73,3.55,.68,.18,.12,'#e6c37e')}box(-4.18,3.73,5.55,3.7,.13,.12,'#e9c98b')}
}

/* Sculpted miniature-room detailing: layered architectural molding, soft furnishing accents,
   curved accessories and physically placed decoration rather than flat sticker art. */
function orb(x,y,z,r,col){let layers=9;for(let i=0;i<layers;i++){let t=-Math.PI/2+(i+.5)*Math.PI/layers,rr=r*Math.cos(t),zz=z+r*Math.sin(t);cylinder(x,y,zz,Math.max(.02,rr),r*Math.PI/layers+.015,shade(col,.76+.24*Math.cos(t)),14)}}
function extraArchitecture(){
 if(currentRoom==='garden'){
  for(let i=0;i<7;i++){let x=-4.8+i*1.5;box(x,-4.7,0,.16,8,.16,'#d9b68d');box(x,-4.7,.1,.08,8,.035,'#f9e5c7')}
  for(let i=0;i<6;i++){let x=-4.8+i*1.7;orb(x,3.7,1.25,.43,i%2?'#f7c1d4':'#e9cb83');cylinder(x,3.7,.12,.11,1.05,'#78a77d')}
  cylinder(3,-1.6,0,.85,.18,'#f5d7c7');cylinder(3,-1.6,.18,.65,.13,'#faf1e9');orb(3,-1.6,.6,.36,'#f9d1ac');
  for(let i=0;i<4;i++){let x=-4.8+i*2.7;box(x,-4.3,0,1.25,.75,.34,'#d1a47b');orb(x+.4,-4,.56,.35,i%2?'#e58ab1':'#fff2bc')}
  return;
 }
 // Recessed-looking wainscoting and trim on two walls.
 for(let x=-5.4;x<5.6;x+=2.1){box(x,4.36,.32,1.82,.10,1.55,'#faf1e5');box(x+.10,4.24,.43,1.62,.07,1.32,shade(palette[currentRoom].wall,1.05));}
 for(let y=-4.4;y<4.2;y+=2.1){box(-5.59,y,.32,.10,1.84,1.55,'#fff4e9');box(-5.47,y+.1,.43,.07,1.64,1.32,shade(palette[currentRoom].side,1.05))}
 box(-5.6,4.34,6.7,11.2,.24,.18,'#fff6e9');box(-5.56,-4.8,6.7,.2,9.4,.18,'#fff6e9');
 // Window frame, sill and fabric folds: layered depth and warm hardware.
 box(-4.2,3.87,5.48,3.45,.26,.14,'#e8c690');
 for(let side of [-4.24,-1.14]){box(side,3.91,2.53,.53,.22,2.88,currentRoom==='bedroom'?'#eeb5cf':'#f0d8b6');for(let i=0;i<3;i++)box(side+i*.16,3.83,2.6,.08,.12,2.7,'#fff5e9')}
 cylinder(-2.52,3.8,5.62,.07,.18,'#d7b06b');
 if(currentRoom==='bedroom'){
  // Vanity mirror, chandelier, tufted rug and bedside lamp.
  box(2.25,4.01,2.55,2.0,.18,2.15,'#d4b17b');box(2.39,3.91,2.69,1.72,.08,1.88,'#d4e8ef');
  for(let i=0;i<6;i++){let a=i*Math.PI/3;orb(0+Math.cos(a)*.65,0+Math.sin(a)*.65,5.9,.18,'#ffe5b2')}
  cylinder(0,0,6.0,.08,.52,'#e8c78c');
  for(let i=0;i<4;i++){let x=-2.8+i*.48;box(x,-2.7,.04,.37,3.5,.06,i%2?'#f5dce7':'#fff3f5')}
  cylinder(4,-2.9,0,.3,1.1,'#f2e5d3');cylinder(4,-2.9,1.1,.48,.35,'#f8d2e1');
 }else if(currentRoom==='kitchen'){
  for(let x=-5.2;x<5.2;x+=.8){box(x,4.21,2.5,.035,.08,1.1,'#d1b6a6');}
  for(let i=0;i<4;i++){cylinder(-3+i*.9,3.22,2.44,.23,.16,i%2?'#d9a6aa':'#f5e6ce');orb(-3+i*.9,3.22,2.65,.15,'#fff2d8')}
  box(-.5,-3.3,.01,3.1,2.2,.06,'#f1e0c9');for(let i=0;i<5;i++)box(-.4+i*.57,-3.1,.08,.05,1.85,.03,'#d8c6b2');
  cylinder(2.25,3.4,2.52,.16,.2,'#c0c8ce');cylinder(2.25,3.4,2.73,.08,.23,'#c0c8ce');
 }else if(currentRoom==='living'){
  cylinder(-2.6,-2.1,0,2.1,.065,'#e6d6c6',22);cylinder(-2.6,-2.1,.06,1.8,.045,'#f5e8d8',22);
  for(let i=0;i<5;i++){let a=i*Math.PI*2/5;orb(-2.6+Math.cos(a)*1.2,-2.1+Math.sin(a)*1.2,.13,.17,'#d1a9aa')}
  for(let i=0;i<3;i++)orb(3.0+i*.37,3.4,2.2+i*.15,.2,i%2?'#f4b573':'#f6d69e');
  box(-4.2,3.8,1.1,.55,.45,1.5,'#ac8167');orb(-3.92,3.55,2.7,.5,'#78a88b');
 }
}
function extraFurniture(id,x,y){let it=ITEMS.find(t=>t[0]===id);if(!it)return;let n=(it[2]+' '+id).toLowerCase();
 if(/bed|bunk|loft|crib|carriage/.test(n)){
  box(x-1.19,y-.62,.91,2.35,1.14,.11,'#fff5e9');box(x-1.16,y+.12,1.03,2.3,.43,.11,/sea|mermaid/.test(n)?'#8dd5d9':'#f6c5dc');
  for(let a of [-.75,.3]){box(x+a,y-.57,1.04,.68,.38,.15,'#fffefa');orb(x+a+.34,y-.35,1.16,.09,'#f6e5ea')}
  if(/castle|princess/.test(n)){for(let i=0;i<3;i++)orb(x-.85+i*.85,y+.67,2.15,.16,'#f8d889')}
 }else if(/chair|stool|sofa|couch|loveseat|armchair|throne|booth/.test(n)){
  let w=/sofa|couch|loveseat|booth/.test(n)?2.6:1.2;
  for(let a=-w/2+.35;a<w/2;a+=.62){orb(x+a,y+.38,1.5,.12,'#f8e8ed');box(x+a-.24,y-.3,.99,.48,.65,.1,'#f7e4f0')}
  if(/shell/.test(n))for(let i=-2;i<=2;i++){let a=i*.32;orb(x+a,y+.53,1.5+(.55-Math.abs(a))*.3,.25,'#f3c9e4')}
 }else if(/table|desk|island|counter/.test(n)){
  cylinder(x,y,1.55,.34,.1,'#f9e8d6');orb(x,y,1.8,.19,'#f5b3c5');
 }else if(/shelf|dresser|vanity|cabinet|wardrobe|bookcase|fridge|closet/.test(n)){
  for(let i=0;i<3;i++){box(x-.65,y-.62,.6+i*.55,1.3,.08,.055,'#fff0e5');orb(x-.45+i*.35,y-.52,.7+i*.55,.11,i%2?'#f4b9b5':'#e5d7ab')}
 }else if(/lamp|light/.test(n)){orb(x,y,2,.48,'#ffedbd')}
 else if(/flower|plant|rose|daisy/.test(n)){cylinder(x,y,0,.34,.4,'#c69a82');for(let i=0;i<5;i++)orb(x+Math.cos(i*1.25)*.3,y+Math.sin(i*1.25)*.3,.7,.28,i%2?'#f6c4d9':'#8fc6a0')}
}


// Deluxe miniature set dressing: true projected geometry, distinct material details.
function pearl(x,y,z,r,color='#fff6ed'){orb(x,y,z,r,color)}
function floral(x,y,z,scale=1,color='#e78bb5'){
  cylinder(x,y,z,.055*scale,.28*scale,'#6a997b');
  for(let i=0;i<5;i++){let a=i*Math.PI*2/5;orb(x+Math.cos(a)*.19*scale,y+Math.sin(a)*.19*scale,z+.31*scale,.14*scale,color)}
  orb(x,y,z+.34*scale,.12*scale,'#f5d073');
}
function deluxeArchitecture(){
  let r=currentRoom,p=palette[r]||palette.bedroom;
  // Individually laid floorboards / tiled flooring and room-specific edge trim.
  if(r==='kitchen'){
    for(let x=-5.9;x<6;x+=1.22)for(let y=-4.9;y<5;y+=1.22){
      box(x,y,-.018,1.19,1.19,.025,((Math.round(x+y)*3)%3===0)?'#e4c6a9':'#fff0d9');
    }
  }else if(r==='garden'){
    for(let x=-5.9;x<6;x+=1.35)for(let y=-4.9;y<5;y+=1.35){box(x,y,-.02,1.29,1.29,.025,((Math.round(x-y))%2)?'#c8b49a':'#e6d3b4')}
  }else{
    for(let y=-4.9;y<4.9;y+=.68){box(-5.95,y,-.02,11.9,.64,.026,r==='bedroom'?'#d4a77e':'#bc967a');for(let x=-5.9;x<5.9;x+=3.1){box(x+(Math.round(y*10)%2)*1.2,y,-.005,.027,.64,.012,'#a97d62')}}
  }
  if(r==='bedroom'){
    // Dollhouse-scale canopy and crystal chandelier.
    for(let x of [-.75,.75])for(let y of [-.45,.45])cylinder(x,y,5.0,.035,.65,'#c79f66');
    cylinder(0,0,5.65,.12,.35,'#d9b46f');
    for(let i=0;i<8;i++){let a=i*Math.PI/4;pearl(Math.cos(a)*.62,Math.sin(a)*.62,5.33,.17,'#fff6c5');pearl(Math.cos(a)*.62,Math.sin(a)*.62,5.08,.085,'#fffefd')}
    // Wall picture gallery with frames, little flowers and a bookshelf.
    for(let i=0;i<3;i++){let x=.35+i*1.3;box(x,4.11,4.0,.95,.15,1.05,'#bd8e64');box(x+.11,4.0,4.11,.73,.10,.83,['#b9dce6','#f4d4dd','#e8c4f1'][i]);floral(x+.45,3.89,4.4,.45)}
    box(3.65,-4.1,0,1.4,.7,2.0,'#fff1e4');for(let z of [.7,1.4])box(3.65,-4.13,z,1.4,.75,.08,'#c59c80');
  }else if(r==='kitchen'){
    // Copper pendant lamps, tiled backsplash, real-looking upper cabinetry.
    for(let x of [-2.7,.2,3.0]){cylinder(x,0,5.2,.05,.9,'#b9976e');cylinder(x,0,4.85,.52,.45,'#f4d0a6');pearl(x,0,4.8,.16,'#fff9ca')}
    for(let x=-5.5;x<5.5;x+=.62)for(let z=2.45;z<3.7;z+=.55)box(x,4.08,z,.58,.07,.51,(Math.round(x*4+z*5)%3===0)?'#b9d4d1':'#f7e8d9');
    for(let x=-5.1;x<4.6;x+=1.95){box(x,3.63,3.83,1.72,.51,1.4,'#f7e5c8');box(x+.12,3.55,3.95,1.46,.1,1.12,'#fff3de');cylinder(x+.86,3.46,4.5,.06,.11,'#b29b75')}
    // Island with stools, fruit bowl and cookbooks.
    box(-1.6,-1.8,0,3.25,1.65,2.05,'#f1d7bd');box(-1.75,-1.9,2.04,3.55,1.85,.2,'#f9f3e9');cylinder(-.1,-1.1,2.25,.45,.16,'#e9c2a1');for(let i=0;i<4;i++)pearl(-.42+i*.2,-1.1,2.45,.18,['#e8a45c','#b4c773','#ed7e6c','#f0c45d'][i]);
    for(let x of [-1.1,.95]){cylinder(x,-3.0,0,.26,1.32,'#ba9776');cylinder(x,-3,1.32,.45,.18,'#b4d5d0')}
  }else if(r==='living'){
    // Fireplace with a proper mantel, firebox and glowing coals.
    for(let x of [1.8,4.25])box(x,3.68,0,.35,.75,3.3,'#d6b298');box(1.75,3.55,3.18,2.95,1.03,.32,'#f2d7bb');
    box(2.15,3.54,.8,2.2,.1,1.7,'#634c48');for(let i=0;i<4;i++){let x=2.4+i*.5;pearl(x,3.4,1.25+i%2*.12,.21,'#f5ae63');pearl(x,3.4,1.53+i%2*.11,.15,'#f5d08a')}
    // Side table, plant, standing lamp and layered artwork.
    cylinder(-4.5,-2.8,0,.36,1.45,'#b18d76');cylinder(-4.5,-2.8,1.45,.65,.12,'#e9c3ad');cylinder(-4.5,-2.8,1.57,.4,.47,'#f1e6d7');for(let i=0;i<6;i++)pearl(-4.5+Math.cos(i)*.4,-2.8+Math.sin(i)*.4,2.25,.32,'#84ae8e');
    cylinder(4.65,-2.8,0,.26,3.7,'#b48e68');cylinder(4.65,-2.8,3.5,.72,.7,'#f8e3bc');
    for(let i=0;i<3;i++){box(-4.8+i*1.15,4.0,4.1,.95,.16,1.25,'#b58b6e');box(-4.7+i*1.15,3.91,4.22,.75,.07,1.01,['#9fc6c0','#edc1aa','#e9d6a6'][i])}
  }else{
    // Miniature greenhouse garden, planted borders, stone path, string lights.
    for(let y=-4.5;y<4.6;y+=1.12)box(-.65,y,-.02,1.3,1.05,.045,'#e9d9bd');
    for(let i=0;i<9;i++){let y=-4.2+i*1.0;for(let x of [-4.9,4.9]){cylinder(x,y,0,.28,.3,'#b78161');floral(x,y,.32,.7,['#f7a7be','#f2d28a','#c3a7e4'][i%3])}}
    for(let x=-5;x<5.5;x+=1.15){cylinder(x,4.25,2.7,.035,.15,'#bda06f');pearl(x,4.25,2.82,.16,'#fff4bc')}
    box(2.4,1.9,0,2.6,1.6,.16,'#b48c6c');for(let x of [2.5,4.75])cylinder(x,2.05,.1,.08,2.2,'#d5b9a3');
  }
}
function deluxeFurniture(id,x,y){let it=ITEMS.find(t=>t[0]===id);if(!it)return;let n=(it[2]+' '+id).toLowerCase();
  if(/bed|bunk|loft|crib|carriage/.test(n)){
    // Quilted bedspread, fabric piping, shaped headboard and bolsters.
    for(let a=-1.05;a<1.1;a+=.32)box(x+a,y-.04,1.12,.055,.67,.045,'#fff4ed');
    for(let a=-1.05;a<1.1;a+=.48)pearl(x+a,y+.58,1.55,.105,'#f7d7e6');
    if(/canopy|princess|castle|royal/.test(n)){for(let a of [-1.22,1.22])for(let b of [-.64,.64])cylinder(x+a,y+b,.55,.065,3.2,'#d8b28c');box(x-1.28,y-.7,3.7,2.56,1.4,.13,'#f7cde2');for(let a=-1.1;a<1.2;a+=.42)pearl(x+a,y-.65,3.57,.17,'#ffeaf4')}
    if(/bunk|loft/.test(n)){for(let z of [1.5,2,2.5])box(x+1.3,y-.7,z,.11,.15,.09,'#c89a7a')}
  }else if(/sofa|couch|loveseat|chair|throne|armchair|booth/.test(n)){
    let w=/sofa|couch|loveseat|booth/.test(n)?2.55:1.16;
    for(let a=-w/2+.3;a<w/2;a+=.52){box(x+a,y-.42,1.01,.45,.72,.19,'#fff1e9');pearl(x+a+.2,y+.42,1.55,.18,'#fff4ec')}
    if(/cloud/.test(n)){for(let a=-w/2;a<=w/2;a+=.45)pearl(x+a,y+.43,1.8,.34,'#fff8fb')}
    if(/shell|mermaid/.test(n)){for(let a=-w/2+.2;a<w/2;a+=.24)pearl(x+a,y+.47,1.8+Math.cos(a*2)*.3,.23,'#f3d6ec')}
    if(/royal|throne|princess/.test(n)){for(let a of [-w/2+.1,w/2-.1])pearl(x+a,y+.45,2.15,.16,'#e6c06c')}
  }else if(/table|desk|island/.test(n)){
    for(let i=0;i<4;i++){let a=i*Math.PI/2;pearl(x+Math.cos(a)*.52,y+Math.sin(a)*.4,1.68,.11,'#f4c6d0')}
    if(/tea|cafe|diner/.test(n)){cylinder(x,y,1.58,.38,.12,'#f9f5ea');cylinder(x-.12,y,1.7,.12,.19,'#f2c9ce');cylinder(x+.2,y,1.7,.13,.18,'#e5d3ae')}
  }else if(/shelf|dresser|vanity|cabinet|wardrobe|bookcase/.test(n)){
    for(let i=0;i<3;i++){box(x-.76,y-.57,.32+i*.85,1.55,.08,.08,'#fff3e8');for(let k=0;k<3;k++){box(x-.65+k*.4,y-.59,.52+i*.85,.28,.08,.42,['#e9b6be','#b7d5d1','#e3d2ad'][(i+k)%3])}}
    if(/vanity/.test(n)){box(x-.62,y-.62,3.15,1.24,.15,1.3,'#e0b8c6');box(x-.5,y-.72,3.27,1,.08,1.05,'#d8edf0');for(let i=0;i<5;i++)pearl(x-.55+i*.26,y-.77,4.45,.09,'#fff2bc')}
  }else if(/plant|flower|tree/.test(n)){for(let i=0;i<6;i++)floral(x+Math.cos(i)*.35,y+Math.sin(i)*.35,.6,.48,i%2?'#f1a7c7':'#f1db94')}
}

function draw(){canvas=document.getElementById('riki3d');if(!canvas)return;ctx=canvas.getContext('2d');let dpr=Math.min(devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();if(!rect.width)return;canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(canvas.width/1000,0,0,canvas.height/650,0,0);let bg=ctx.createLinearGradient(0,0,0,650);bg.addColorStop(0,'#d6e9fa');bg.addColorStop(1,'#fce3d4');ctx.fillStyle=bg;ctx.fillRect(0,0,1000,650);let halo=ctx.createRadialGradient(520,180,80,520,300,670);halo.addColorStop(0,'#ffffff55');halo.addColorStop(1,'#d9b4d300');ctx.fillStyle=halo;ctx.fillRect(0,0,1000,650);sceneItems=[];artRoom();extraArchitecture();deluxeArchitecture();wallPattern3D();let placements=decor[currentRoom]||{},positions=dreamPosition[currentRoom]||{};let picks=[];for(const [slot,id] of Object.entries(placements)){if(!ownedItem(id))continue;let pos=positions[id]||SLOTS[Number(slot)]||{x:45,y:72};let x=clamp((pos.x-50)/6,-4.8,4.8),y=clamp((pos.y-55)/5.5,-3.7,3.7);furniture(id,x,y);extraFurniture(id,x,y);deluxeFurniture(id,x,y);let q=project([x,y,1.2]);picks.push({id,x:q.x,y:q.y})}sceneItems.sort((a,b)=>b.depth-a.depth);for(let f of sceneItems){polygon(f.points,f.color,'#493b4125');let pts=f.points.map(project),minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));if(maxX-minX>5&&maxY-minY>5){ctx.save();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip();let g=ctx.createLinearGradient(minX,minY,maxX,maxY);g.addColorStop(0,'#ffffff25');g.addColorStop(.48,'#ffffff06');g.addColorStop(1,'#25152e24');ctx.fillStyle=g;ctx.fillRect(minX,minY,maxX-minX,maxY-minY);ctx.restore()}}
// Highlight selectable items with unobtrusive nameplates.
ctx.textAlign='center';ctx.font='bold 15px system-ui';for(let pick of picks){let it=ITEMS.find(t=>t[0]===pick.id);if(!it)continue;let name=it[2].slice(0,18),w=Math.min(185,ctx.measureText(name).width+20);ctx.fillStyle=activeId===pick.id?'#ffe2a9ee':'#fffaf1dd';ctx.beginPath();ctx.roundRect(pick.x-w/2,pick.y-46,w,25,12);ctx.fill();ctx.fillStyle='#654d60';ctx.fillText(name,pick.x,pick.y-28)}canvas._picks=picks;
}
function eventPct(e){const r=canvas.getBoundingClientRect();return {x:clamp((e.clientX-r.left)/r.width*100,8,92),y:clamp((e.clientY-r.top)/r.height*100,26,86)}}
function pickItem(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*1000,y=(e.clientY-r.top)/r.height*650;return (canvas._picks||[]).slice().reverse().find(p=>Math.hypot(p.x-x,p.y-y)<67)?.id||null}
function bind3d(){oldDreamBind();canvas=document.getElementById('riki3d');if(!canvas)return;draw();
canvas.addEventListener('pointerdown',e=>{mouseStart={x:e.clientX,y:e.clientY,id:pickItem(e),moved:false};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!mouseStart)return;let dx=e.clientX-mouseStart.x,dy=e.clientY-mouseStart.y;if(Math.hypot(dx,dy)>10)mouseStart.moved=true;if(mouseStart.moved&&!mouseStart.id){orbit=clamp(orbit+dx*.004,-.55,.65);mouseStart.x=e.clientX;mouseStart.y=e.clientY;draw()}});
canvas.addEventListener('pointerup',e=>{if(!mouseStart)return;let m=mouseStart;mouseStart=null;if(m.id&&m.moved){let p=eventPct(e);placeDream(m.id,p.x,p.y)}else if(m.id){activeId=m.id;selectedItem=m.id;let msg=document.getElementById('dreamMessage');if(msg)msg.textContent='Selected '+(ITEMS.find(t=>t[0]===m.id)?.[2]||'furniture')+'. Tap a new spot to move it, or tap Open for storage.';draw()}else if(!m.moved&&selectedItem){let p=eventPct(e);placeDream(selectedItem,p.x,p.y)}else{localStorage.setItem('riki3dOrbit',orbit);draw()}});
canvas.addEventListener('click',e=>e.stopPropagation());
const left=document.getElementById('orbitLeft'),right=document.getElementById('orbitRight'),reset=document.getElementById('orbitReset');if(left)left.onclick=()=>{orbit=clamp(orbit-.18,-.55,.65);draw()};if(right)right.onclick=()=>{orbit=clamp(orbit+.18,-.55,.65);draw()};if(reset)reset.onclick=()=>{orbit=0;draw()};
const open=document.getElementById('openSelected');if(open)open.onclick=()=>{if(activeId&&isStorage(activeId))storageModal(activeId);else{let msg=document.getElementById('dreamMessage');if(msg)msg.textContent='Select a purchased shelf, vanity or dresser to open it.'}};
window.addEventListener('resize',draw,{once:true});
}
dreamHtml=function(){let html=oldDreamHtml();let start=html.indexOf('<div class="dream-room '),end=html.indexOf('<div class="dream-message"',start);if(start<0||end<0)return html;let stage=`<div class="dream-room dream3d" id="dreamRoom"><canvas id="riki3d" aria-label="Rotatable three dimensional ${currentRoom} dollhouse; tap to place furniture" role="img"></canvas><div class="riki3d-hud"><span>🏡 ${palette[currentRoom]?.name||'Dream room'} · 3D</span><span>👆 Drag to explore · tap to decorate</span></div></div><div class="riki3d-actions"><button id="orbitLeft">↶ Turn left</button><button id="orbitRight">↷ Turn right</button><button id="orbitReset">⌂ Front view</button><button id="openSelected">🗄️ Open selected storage</button></div><p class="riki3d-legend">Tap a purchased item below, then tap the room to place it. Drag furniture to move it. Drag empty space to rotate the room.</p>`;return html.slice(0,start)+stage+html.slice(end)};
dreamBind=bind3d;decorateHtml=dreamHtml;bindDecor=dreamBind;
})();
