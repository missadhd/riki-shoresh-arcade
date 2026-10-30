
(function(){
  // Pointer Events work with a mouse, stylus and touch. The original tap controls remain available.
  let drag=null,ghost=null,over=null;
  const sourceSel='[data-life-item],[data-life-shelf],[data-drawer-object],[data-select],[data-item-slot],[data-extra-choice]';
  function targetFor(source){
    if(source.matches('[data-extra-choice]'))return '.extra-stage';
    if(source.matches('[data-select],[data-item-slot]'))return '[data-slot],[data-item-slot]';
    return '[data-life-shelf],[data-life-drawer]';
  }
  function label(el){return (el.innerText||el.textContent||'✨').trim().slice(0,65)}
  document.addEventListener('pointerdown',function(e){
    if(e.button!==0||drag)return;
    const el=e.target.closest(sourceSel);if(!el||el.disabled)return;
    drag={source:el,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,selector:targetFor(el)};
  },true);
  document.addEventListener('pointermove',function(e){
    if(!drag||drag.id!==e.pointerId)return;
    if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<9)return;
    if(!drag.moved){
      drag.moved=true;ghost=document.createElement('div');ghost.className='drag-float';ghost.textContent=label(drag.source);document.body.appendChild(ghost);
    }
    if(e.cancelable)e.preventDefault();
    ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
    const hit=document.elementFromPoint(e.clientX,e.clientY);
    const dest=hit&&hit.closest(drag.selector);
    if(over!==dest){if(over)over.classList.remove('drag-over');over=dest;if(over)over.classList.add('drag-over')}
  },{capture:true,passive:false});
  function clear(){if(over)over.classList.remove('drag-over');if(ghost)ghost.remove();over=null;ghost=null;drag=null}
  document.addEventListener('pointerup',function(e){
    if(!drag||drag.id!==e.pointerId)return;
    if(!drag.moved){clear();return}
    const source=drag.source,dest=over;
    // Prevent the synthetic tap from triggering a second, unrelated selection.
    const blocker=function(ev){ev.preventDefault();ev.stopImmediatePropagation();document.removeEventListener('click',blocker,true)};
    document.addEventListener('click',blocker,true);
    setTimeout(()=>document.removeEventListener('click',blocker,true),350);
    clear();
    if(!dest||!source.isConnected)return;
    if(source.matches('[data-extra-choice]')){
      source.click();return;
    }
    // Select an object, then put it into the chosen slot. Reuse the game's own saving handlers.
    if(source.matches('[data-life-item],[data-life-shelf],[data-drawer-object]')){
      if(source===dest)return;
      if(source.matches('[data-life-shelf]')&&!source.textContent.includes('＋')&&source.textContent.trim()!=='')source.click();
      else source.click();
      const refreshed=document.querySelector(dest.matches('[data-life-shelf]')?'[data-life-shelf="'+dest.dataset.lifeShelf+'"]':'[data-life-drawer="'+dest.dataset.lifeDrawer+'"]');
      if(refreshed){
        if(refreshed.matches('[data-life-drawer]')){
          // Open first, then place item on a second tap if the drawer was closed.
          if(!refreshed.classList.contains('open'))refreshed.click();
          const d=document.querySelector('[data-life-drawer="'+dest.dataset.lifeDrawer+'"]');if(d)d.click();
        }else refreshed.click();
      }
    }else if(source.matches('[data-select],[data-item-slot]')){
      const sourceKey=source.matches('[data-select]')?'data-select':'data-item-slot';
      const sourceValue=source.getAttribute(sourceKey);
      source.click();
      const slotKey=dest.hasAttribute('data-slot')?'data-slot':'data-item-slot';
      const slotValue=dest.getAttribute(slotKey);
      const updated=document.querySelector('['+slotKey+'="'+CSS.escape(slotValue)+'"]');
      if(updated)updated.click();
    }
  },true);
  document.addEventListener('pointercancel',clear,true);
  // Add a visible drop area and simple instructions on creative scenes.
  const observer=new MutationObserver(()=>{
    const stage=document.querySelector('.extra-stage');
    if(stage&&!stage.classList.contains('drop-spot')&&document.querySelector('[data-extra-choice]')){
      stage.classList.add('drop-spot');stage.insertAdjacentHTML('beforeend','<div class="drag-tip">👆 Drag the correct Hebrew label here to complete the order! (Or tap it.)</div>');
    }
    const life=document.querySelector('.life-room');
    if(life&&!life.dataset.dragReady){life.dataset.dragReady='1';life.insertAdjacentHTML('afterbegin','<div class="drag-tip">✨ Drag treasures from your collection onto a shelf or drawer. Tap also works!</div>')}
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();
