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

function startHome(){
 active=null;
 let buttons='';for(let n=2;n<=9;n++)buttons+='<button type="button" data-family="'+n+'" class="'+(progress.families.includes(n)?'on':'')+'" aria-pressed="'+progress.families.includes(n)+'">×'+n+'</button>';
 show('<section class="rk-math-hero"><h1>🍰 Multiplication Arcade</h1><p>Think of the product first — then serve the customer!</p><div>⭐ '+(Number(progress.correct)||0)+' answers correct</div></section>'+
 '<section class="rk-math-panel"><h2>Choose the tables to practice</h2><div class="rk-math-families">'+buttons+'</div><p id="rkMathFamilyMessage" role="status">Tap to include or exclude a table. Keep at least one selected.</p></section>'+
 '<div class="rk-math-choices">'+[
 ['recipe','🧁','Bakery Orders','Multiply, then choose the plate to serve.'],
 ['aquarium','🐠','Aquarium Rescue','Multiply to rescue fish and build the tank.'],
 ['fashion','👗','Fashion Studio','Multiply, then pack the right accessories.'],
 ['array','⚡','Quick Math','Solve the fact in your head and type it.'],
 ['match','🎴','Fact Match','Find the correct product for each fact.']
 ].map(g=>'<button type="button" '+({recipe:'id="rkMathRecipe"',array:'id="rkMathArray"',match:'id="rkMathMatch"'}[g[0]]||'')+' data-math-game="'+g[0]+'"><span>'+g[1]+'</span><b>'+g[2]+'</b><small>'+g[3]+'</small><em>'+(g[0]==='match'?'4 pairs':'5 questions')+'</em></button>').join('')+'</div>'+
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
}
let active=null;
// Aquarium plays the Shoreshim 3D Aquarium Rescue with multiplication questions (Grok, Nov 1). Falls back to the order scene without WebGL.
function startAquarium3D(){
 const st=window.RikiStudio;if(!st||typeof st.start!=='function')return false;
 const n=(st.games&&st.games.aquarium&&st.games.aquarium.steps.length)||8;const qs=pick(n);if(!qs.length)return false;while(qs.length<n)qs.push(qs[qs.length%qs.length]);
 let ok=false;try{ok=st.start('aquarium',{math:{questions:qs,choices:q=>answerChoices(q),hint:q=>hintText(q),
  right:q=>give(q),wrong:q=>wrong(q),
  done:()=>{progress.completed.aquarium=(Number(progress.completed.aquarium)||0)+1;save();},
  again:()=>start('aquarium'),exit:()=>startHome()}});}catch(_){ok=false}
 if(ok){active=null;activeTab();}return ok;
}
function start(type){
 if(type==='aquarium'&&startAquarium3D())return;
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
 '<section class="rk-math-panel"><h2>Solve it without building rows.</h2><p>Think of the answer and type your product.</p>'+
 '<p class="rk-math-equation">'+q.a+' × '+q.b+' = '+(x.done?q.answer:'?')+'</p>'+
 (x.done?'<div class="rk-math-success">✅ Correct! +6 coins.</div>':form()+hint(q))+status()+'</section>';
}
function matching(){
 const x=active;let left='',right='';
 x.questions.forEach((q,i)=>{left+='<button type="button" class="rk-math-matchcard '+(x.used.includes(i)?'matched':x.selected===i?'selected':'')+'" data-fact="'+i+'" '+(x.used.includes(i)?'disabled':'')+'>'+q.a+' × '+q.b+'</button>'});
 x.answers.forEach((a,i)=>{const matched=x.used.some(n=>x.questions[n].answer===a);right+='<button type="button" class="rk-math-matchcard '+(matched?'matched':'')+'" data-answer="'+i+'" '+(matched?'disabled':'')+'>'+a+'</button>'});
 return header('🎴 Fact Match','Pick a multiplication fact, then its correct answer.')+progressBar()+
 '<section class="rk-math-panel"><h2>Find the matching pairs</h2><div class="rk-math-matchboard"><div><h3>Facts</h3>'+left+'</div><div><h3>Answers</h3>'+right+'</div></div><p class="rk-math-status" role="status" id="rkMathStatus">'+esc(x.message||'Start by choosing a multiplication fact.')+'</p></section>';
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
window.RikiMath={home:startHome,start,getProgress:()=>({...progress}),section:()=>!!app.querySelector('.rk-math')};
})();
