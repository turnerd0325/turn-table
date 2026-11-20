/*<<TTCOMMON*/
/* ---- shared helpers for the placement games (Laser Maze, Blackout!, Coaster Architect) ---- */
const ttDrag={d:null,noClick:0};
function ttDragStart(e,cfg){if(ttDrag.d||(e.button||0)>0)return;ttDrag.d=Object.assign({x0:e.clientX,y0:e.clientY,on:false,ghost:null,id:e.pointerId},cfg);}
document.addEventListener('pointermove',e=>{const d=ttDrag.d;if(!d||e.pointerId!==d.id)return;
  if(!d.on){if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<7)return;d.on=true;d.ghost=d.makeGhost();document.body.append(d.ghost);if(d.begin)d.begin();}
  e.preventDefault();d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';if(d.move)d.move(e.clientX,e.clientY);},{passive:false});
function ttDragEnd(e){const d=ttDrag.d;if(!d||e.pointerId!==d.id)return;ttDrag.d=null;if(d.ghost)d.ghost.remove();
  if(d.on){ttDrag.noClick=performance.now()+350;if(d.end)d.end();if(e.type==='pointerup'&&d.drop)d.drop(e.clientX,e.clientY);}
  else if(e.type==='pointerup'&&d.click)d.click(e.clientX,e.clientY);}
document.addEventListener('pointerup',ttDragEnd);document.addEventListener('pointercancel',ttDragEnd);
const svgEl=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild;};
/* stars saved for a level of one of the star-based games */
const lvStars=(P,g,n)=>(P[g]&&P[g][n]&&P[g][n].best)||0;
const gameStars=(P,g,count)=>{let t=0;for(let i=1;i<=count;i++)t+=lvStars(P,g,i);return t;};
function recordStars(g,lv,stars,detail){
  const P=prof(),r=lvRec(P,g,String(lv));r.plays++;const best=stars>r.best;if(best)r.best=stars;saveAll();
  cloudSubmit(g,String(lv),stars,detail);return best;}
const NEWGAMES_UNLOCK_ALL=false;   /* true = every level of the four newer games is open from the start */
/* Level picker: levels open one after another (each needs a star on the one before) */
function renderLevelPicker(box,totalBox,g,levels,packs,start,mini){
  const P=prof();let prev=true;
  totalBox.textContent=`${gameStars(P,g,levels.length)} / ${levels.length*3} stars`;
  box.replaceChildren(...levels.flatMap((L,i)=>{
    const st=lvStars(P,g,i+1),fl=freeLvLocked(g,i),open=(NEWGAMES_UNLOCK_ALL||prev)&&!fl;prev=st>0;
    const b=h('button',{class:'seplv'+(fl?' freelock':''),disabled:!open,onclick:()=>start(i)},h('small',{class:'sub'},'Level '+(i+1)),
      h('b',null,open?L.name:fl?'Full version':'Locked'),h('div',{class:'mx lvmini'},open?mini(L):h('span',{class:'lvlock'},I('lock'))),h('div',{class:'st'},starStr(st)));
    return packs[i]?[h('div',{class:'seppack'},packs[i]),b]:[b];}));
}
/* the end-of-level panel */
function levelResult(box,{stars,line,fact,next,onNext,onRetry,onLevels,retryText}){
  box.replaceChildren(
    h('div',{class:'big'},h('span',null,'★'.repeat(stars)),h('span',{class:'dimstar'},'★'.repeat(3-stars))),
    h('p',null,...line),
    h('p',{class:'infobox'},I('flask'),' ',h('b',null,'Science says: '),fact),
    h('div',{style:'display:flex;gap:8px;justify-content:center;flex-wrap:wrap'},
      next?h('button',{class:'btn good',onclick:onNext},'Next level ▶'):h('button',{class:'btn good',onclick:onLevels},'All levels done! ★'),
      h('button',{class:'btn ghost',onclick:onRetry},retryText||(stars<3?'Try for 3 ★':'Keep tinkering')),
      h('button',{class:'btn ghost',onclick:onLevels},'Levels')));
  box.hidden=false;
}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.hintfloat');if(b)b.dataset.closed='1';});
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#lzHint,#boHint,#evHint,#caHint'))document.querySelectorAll('.hintfloat').forEach(x=>{x.dataset.closed='';});},true);
/*TTCOMMON>>*/
