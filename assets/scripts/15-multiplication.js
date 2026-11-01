/* Separate multiplication games. Keeps existing Shoresh and social activities untouched. */
(()=>{
'use strict';
const app=document.getElementById('app'),nav=document.querySelector('.top .stats'),KEY='rikiMathProgressV1';
if(!app||!nav||window.RikiMath)return;
const $=id=>document.getElementById(id);
const G=n=>{try{return (0,eval)(n)}catch(_){return undefined}};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const defaults={families:[3,4,6,7,8],correct:0,attempts:0,byFact:{},completed:{recipe:0,array:0,match:0}};
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
 app.innerHTML='<div class="rk-math" data-rk-section="multiplication">'+body+'</div>';
 window.scrollTo(0,0);activeTab();
}
function header(title,subtitle){
 return '<header class="rk-math-heading"><button type="button" id="rkMathBack" class="rk-math-link">← Math games</button><h1>'+esc(title)+'</h1><p>'+esc(subtitle||'Take your time. There is no countdown.')+'</p></header>';
}
function startHome(){
 active=null;
 let buttons='';for(let n=2;n<=9;n++)buttons+='<button type="button" data-family="'+n+'" class="'+(progress.families.includes(n)?'on':'')+'" aria-pressed="'+progress.families.includes(n)+'">×'+n+'</button>';
 show('<section class="rk-math-hero"><h1>🍰 Multiplication Arcade</h1><p>Three different ways to play, build and learn your times tables.</p><div>⭐ '+(Number(progress.correct)||0)+' answers correct so far</div></section>'+
 '<section class="rk-math-panel"><h2>Choose the tables to practice</h2><div class="rk-math-families">'+buttons+'</div><p id="rkMathFamilyMessage" role="status">Tap a table to include or exclude it. Keep at least one selected.</p></section>'+
 '<div class="rk-math-choices"><button type="button" id="rkMathRecipe"><span>🧁</span><b>Recipe Studio</b><small>Count trays and bake treats for customers.</small><em>Five bakery orders</em></button>'+
 '<button type="button" id="rkMathArray"><span>🧩</span><b>Array Builder</b><small>Build equal rows, then find the total.</small><em>Five builds</em></button>'+
 '<button type="button" id="rkMathMatch"><span>🎴</span><b>Fact Match</b><small>Find which answer goes with each multiplication fact.</small><em>Four matching pairs</em></button></div>'+
 '<button type="button" class="rk-math-link" id="rkMathMain">← Main home</button>');
 app.querySelectorAll('[data-family]').forEach(b=>b.onclick=()=>{
  const n=Number(b.dataset.family);
  if(progress.families.includes(n)){
   if(progress.families.length===1){$('rkMathFamilyMessage').textContent='Keep at least one table selected.';return}
   progress.families=progress.families.filter(v=>v!==n);
  }else progress.families.push(n);
  progress.families.sort((a,b)=>a-b);save();sound();startHome();
 });
 $('rkMathRecipe').onclick=()=>start('recipe');
 $('rkMathArray').onclick=()=>start('array');
 $('rkMathMatch').onclick=()=>start('match');
 $('rkMathMain').onclick=goHub;
}
let active=null;
function start(type){
 sound();let questions=pick(type==='match'?4:5);
 if(type==='match'){
  const seen=new Set();questions=[];
  for(const f of shuffle(facts())){if(seen.has(f.answer))continue;seen.add(f.answer);questions.push(f);if(questions.length===4)break}
 }
 active={type,questions,at:0,built:0,done:false,score:0,selected:null,used:[],answers:shuffle(questions.map(x=>x.answer)),message:''};
 render();
}
const question=()=>active.questions[active.at];
function progressBar(){const x=active;return '<div class="rk-math-bar" aria-label="'+x.at+' of '+x.questions.length+' done"><span style="width:'+(x.at/x.questions.length*100)+'%"></span></div>'}
function dots(n,emoji){let out='<span class="rk-math-dots">';for(let i=0;i<n;i++)out+='<span aria-hidden="true">'+emoji+'</span>';return out+'</span>'}
function form(){return '<form id="rkMathForm" class="rk-math-answer"><label for="rkMathInput">How many altogether?</label><input id="rkMathInput" type="number" inputmode="numeric" min="0" max="100" step="1" required placeholder="?" autocomplete="off"><button type="submit">Check answer</button></form>'}
function status(){const x=active;return '<p id="rkMathStatus" class="rk-math-status" role="status" aria-live="polite">'+esc(x.message||'Use the picture to help you figure it out.')+'</p>'+(x.done?'<button type="button" id="rkMathNext" class="rk-math-primary">'+(x.at===x.questions.length-1?'See results 🎉':'Next one →')+'</button>':'')}
function hint(q){const multiples=Array.from({length:q.a},(_,i)=>(i+1)*q.b).join(' → ');return '<button type="button" id="rkMathHint" class="rk-math-link">💡 Show counting hint</button><p id="rkMathHelp" class="rk-math-help" hidden>Count by '+q.b+'s: '+multiples+'.</p>'}
function recipe(){
 const q=question(),stuff=[['🍪','cookies'],['🧁','cupcakes'],['🥞','pancakes'],['🍓','strawberries'],['🍩','doughnuts']][active.at%5];
 let trays='';for(let i=0;i<q.a;i++)trays+='<div class="rk-math-tray"><b>Tray '+(i+1)+'</b>'+dots(q.b,stuff[0])+'</div>';
 return header('🧁 Recipe Studio','Bakery order '+(active.at+1)+' of '+active.questions.length)+progressBar()+
 '<section class="rk-math-panel"><div class="rk-math-order"><span>👩‍🍳</span><div><small>NEW BAKERY ORDER</small><h2>'+q.a+' trays of '+q.b+' '+stuff[1]+'</h2><p>Each tray has '+q.b+'. How many '+stuff[1]+' altogether?</p></div></div><div class="rk-math-trays">'+trays+'</div>'+
 '<p class="rk-math-equation">'+q.a+' × '+q.b+' = '+(active.done?q.answer:'?')+'</p>'+
 (active.done?'<div class="rk-math-success">✅ Order served! Great job!</div>':form())+status()+hint(q)+'</section>';
}
function array(){
 const q=question(),x=active;let rows='';
 for(let i=0;i<q.a;i++)rows+='<div class="rk-math-array-row '+(i<x.built?'built':'')+'">'+(i<x.built?dots(q.b,'●'):'<small>Row '+(i+1)+': '+q.b+' counters</small>')+'</div>';
 return header('🧩 Array Builder','Build '+(x.at+1)+' of '+x.questions.length)+progressBar()+
 '<section class="rk-math-panel"><h2>Make '+q.a+' equal rows</h2><p>Each row needs '+q.b+' circles. Build the rows one at a time.</p><div class="rk-math-array">'+rows+'</div><p class="rk-math-equation">'+q.a+' × '+q.b+' = '+(x.done?q.answer:'?')+'</p>'+
 (x.built<q.a?'<button type="button" id="rkMathBuild" class="rk-math-primary">＋ Build row '+(x.built+1)+' of '+q.a+'</button><p>'+x.built+' of '+q.a+' rows ready</p>':x.done?'<div class="rk-math-success">✅ You built '+q.answer+' counters!</div>':form())+
 (x.built===q.a?status():'')+hint(q)+'</section>';
}
function matching(){
 const x=active;let left='',right='';
 x.questions.forEach((q,i)=>{left+='<button type="button" class="rk-math-matchcard '+(x.used.includes(i)?'matched':x.selected===i?'selected':'')+'" data-fact="'+i+'" '+(x.used.includes(i)?'disabled':'')+'>'+q.a+' × '+q.b+'</button>'});
 x.answers.forEach((a,i)=>{const matched=x.used.some(n=>x.questions[n].answer===a);right+='<button type="button" class="rk-math-matchcard '+(matched?'matched':'')+'" data-answer="'+i+'" '+(matched?'disabled':'')+'>'+a+'</button>'});
 return header('🎴 Fact Match','Pick a multiplication fact, then its correct answer.')+progressBar()+
 '<section class="rk-math-panel"><h2>Find the matching pairs</h2><div class="rk-math-matchboard"><div><h3>Facts</h3>'+left+'</div><div><h3>Answers</h3>'+right+'</div></div><p class="rk-math-status" role="status" id="rkMathStatus">'+esc(x.message||'Start by choosing a multiplication fact.')+'</p></section>';
}
function render(){
 if(!active)return startHome();
 if(active.at>=active.questions.length)return finish();
 show(active.type==='recipe'?recipe():active.type==='array'?array():matching());
 $('rkMathBack').onclick=startHome;
 const h=$('rkMathHint');if(h)h.onclick=()=>{$('rkMathHelp').hidden=!$('rkMathHelp').hidden;sound()};
 const build=$('rkMathBuild');if(build)build.onclick=()=>{active.built++;sound();render()};
 const f=$('rkMathForm');if(f)f.onsubmit=e=>{
  e.preventDefault();if(active.done)return;
  const q=question(),ans=Number($('rkMathInput').value);
  if(ans===q.answer){give(q);active.done=true;active.score++;active.message='Correct! '+q.a+' groups of '+q.b+' are '+q.answer+'. +6 coins!';render();}
  else{wrong(q);active.message='Not yet. Count the groups of '+q.b+', then try again.';$('rkMathStatus').textContent=active.message;$('rkMathHelp').hidden=false;$('rkMathInput').focus();$('rkMathInput').select()}
 };
 const next=$('rkMathNext');if(next)next.onclick=()=>{active.at++;active.built=0;active.done=false;active.message='';render()};
 app.querySelectorAll('[data-fact]').forEach(b=>b.onclick=()=>{active.selected=Number(b.dataset.fact);active.message='Now choose its answer.';sound();render()});
 app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
  if(active.selected===null){active.message='Choose a fact on the left first.';render();return}
  const q=active.questions[active.selected],v=active.answers[Number(b.dataset.answer)];
  if(q.answer===v){give(q);active.score++;active.used.push(active.selected);active.at=active.used.length;active.selected=null;active.message='Great match! +6 coins.';render();}
  else{wrong(q);active.message='Not that one. Count '+q.a+' groups of '+q.b+'.';active.selected=null;render()}
 });
}
function finish(){
 const x=active;progress.completed[x.type]=(Number(progress.completed[x.type])||0)+1;save();active=null;
 const title={recipe:'Recipe Studio',array:'Array Builder',match:'Fact Match'}[x.type];
 show(header('🎉 Nice multiplying!','You completed '+title+'.')+'<section class="rk-math-panel rk-math-done"><div>🏆</div><h2>'+x.score+' correct!</h2><p>🪙 '+(x.score*6)+' coins earned. You can try another activity or decorate your dollhouse.</p><div class="rk-math-actions"><button id="rkMathReplay">Play again</button><button id="rkMathChoose">Other games</button><button id="rkMathHouse">Dollhouse</button></div></section>');
 $('rkMathBack').onclick=startHome;$('rkMathReplay').onclick=()=>start(x.type);$('rkMathChoose').onclick=startHome;$('rkMathHouse').onclick=goHouse;
}
const tab=document.createElement('button');tab.type='button';tab.id='rkMathShortcut';tab.className='smallbtn';tab.textContent='✖️ Multiply';tab.onclick=()=>{sound();startHome()};
const house=$('houseShortcut');if(house){house.textContent='🏠 Dollhouse';nav.insertBefore(tab,house)}else nav.appendChild(tab);
function addTile(){
 const grid=app.querySelector('.hub-grid');if(grid&&!$('hubMath')){
  const button=document.createElement('button');button.type='button';button.className='hub-tile hub-math';button.id='hubMath';
  button.innerHTML='<span class="hub-ic rk-math-hub-icon" aria-hidden="true">✖️</span><b>Multiplication</b><span>Bake, build & match</span>';
  const houseTile=$('hubHouse');if(houseTile)grid.insertBefore(button,houseTile);else grid.appendChild(button);
  button.onclick=()=>{sound();startHome()};
 }
 activeTab();
}
let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;addTile()})}).observe(app,{childList:true});
addTile();
window.RikiMath={home:startHome,start,getProgress:()=>({...progress}),section:()=>!!app.querySelector('.rk-math')};
})();
