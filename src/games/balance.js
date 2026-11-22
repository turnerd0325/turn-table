/* ================= GAME 5: BALANCE IT: "Balance the scale" (Session 10) =================
   A real balance scale: reactants on the left pan, products on the right. Each coefficient is a
   molecule pack that drops onto its pan as atom balls. The beam tilts by mass until every element
   matches, and the tally lights green per element. Change coefficients with + / −, or drag a pack
   onto its pan (drag a pack off a pan to take one away). Same 10 equations per round, 3/2/1 points,
   2 hints, the "smaller numbers" rule, the already-balanced trick level and TEST_SET order. */
function parseF(str){const c={};str.replace(/([A-Z][a-z]?)(\d*)/g,(m,s,n)=>{c[s]=(c[s]||0)+(n?+n:1);return m;});return c;}
const fmtStr=str=>str.replace(/\d+/g,d=>sub(+d));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const REACTIONS=[
 {t:1,clue:'Hydrogen reacts with chlorine gas.',eq:'H2+Cl2>HCl',c:[1,1,2]},
 {t:1,clue:'Lightning makes nitrogen and oxygen combine.',eq:'N2+O2>NO',c:[1,1,2]},
 {t:1,clue:'Hydrogen burns in oxygen to make water.',eq:'H2+O2>H2O',c:[2,1,2]},
 {t:1,clue:'Sodium metal meets chlorine gas.',eq:'Na+Cl2>NaCl',c:[2,1,2]},
 {t:1,clue:'Magnesium ribbon burns brightly.',eq:'Mg+O2>MgO',c:[2,1,2]},
 {t:1,clue:'Carbon monoxide burns to make carbon dioxide.',eq:'CO+O2>CO2',c:[2,1,2]},
 {t:1,clue:'Heating limestone. (Careful, check before you change anything!)',eq:'CaCO3>CaO+CO2',c:[1,1,1]},
 {t:2,clue:'Hydrogen peroxide breaks down into water and oxygen.',eq:'H2O2>H2O+O2',c:[2,2,1]},
 {t:2,clue:'Zinc dissolves in hydrochloric acid.',eq:'Zn+HCl>ZnCl2+H2',c:[1,2,1,1]},
 {t:2,clue:'Making ammonia for fertilizer.',eq:'N2+H2>NH3',c:[1,3,2]},
 {t:2,clue:'Natural gas burns on a stove.',eq:'CH4+O2>CO2+H2O',c:[1,2,1,2]},
 {t:2,clue:'Aluminum reacts with chlorine.',eq:'Al+Cl2>AlCl3',c:[2,3,2]},
 {t:2,clue:'Rotten egg gas burns.',eq:'H2S+O2>SO2+H2O',c:[2,3,2,2]},
 {t:2,clue:'Heating a chemical to release oxygen.',eq:'KClO3>KCl+O2',c:[2,2,3]},
 {t:3,clue:'Propane burns in a backyard grill.',eq:'C3H8+O2>CO2+H2O',c:[1,5,3,4]},
 {t:3,clue:'Iron rusts.',eq:'Fe+O2>Fe2O3',c:[4,3,2]},
 {t:3,clue:'Ethanol burns.',eq:'C2H6O+O2>CO2+H2O',c:[1,3,2,3]},
 {t:3,clue:'Ethane burns.',eq:'C2H6+O2>CO2+H2O',c:[2,7,4,6]},
 {t:3,clue:'Your cells burn sugar for energy (cellular respiration).',eq:'C6H12O6+O2>CO2+H2O',c:[1,6,6,6]},
 {t:3,clue:'Ammonia burns to make nitric oxide.',eq:'NH3+O2>NO+H2O',c:[4,5,4,6]}
].map(r=>{const [l,rr]=r.eq.split('>'),L=l.split('+'),R=rr.split('+');return Object.assign(r,{L,R,terms:L.concat(R),nL:L.length});});
let BL=null,bcDragS=null,bcTw=null;
const BC_W=1000,BC_H=330,BC_PX=500,BC_PY=64,BC_ARM=300,BC_MAXT=9;
function startBalance(){
  const by=t=>REACTIONS.filter(r=>r.t===t),test=tstOn('balance');
  BL={queue:test?[...by(1).slice(0,3),...by(2).slice(0,4),...by(3).slice(0,3)]:[...sample(by(1),3),...sample(by(2),4),...sample(by(3),3)],i:0,score:0,results:[],test,res:[],tilt:0};
  show('s-balance');$('s-balance').classList.toggle('testing',test);$('bcQuit').textContent=test?'Leave test':'Quit';
  if(test)TST.finish=()=>{const pts=BL.res.reduce((a,b)=>a+b,0);tstFinish(pts/BL.queue.length*100,{right:BL.res.filter(x=>x===1).length,n:BL.queue.length});};
  bcBuildStage();bcRound();
}
function bcRound(){
  const rx=BL.queue[BL.i];Object.assign(BL,{rx,coefs:rx.terms.map(()=>1),prev:rx.terms.map(()=>0),hints:0,wrong:0,done:false});
  $('bcQ').textContent=BL.i+1;$('bcScore').textContent=BL.score;$('bcClue').textContent=rx.clue;
  $('bcHintBox').hidden=true;$('bcMsg').textContent='';$('bcMsg').className='msg';$('bcNext').hidden=true;
  $('bcCheck').disabled=false;$('bcHint').disabled=false;$('bcStage').classList.remove('bcwin');
  BL.mols=rx.terms.map(f=>mkMolSVG(f,{tight:true}));
  bcRenderEq();bcRender();
}
function bcCounts(){
  const L={},R={},rx=BL.rx;
  rx.terms.forEach((f,k)=>{const c=parseF(f),side=k<rx.nL?L:R;Object.keys(c).forEach(s=>side[s]=(side[s]||0)+c[s]*BL.coefs[k]);});
  const syms=[];rx.terms.forEach(f=>Object.keys(parseF(f)).forEach(s=>{if(!syms.includes(s))syms.push(s);}));
  return {L,R,syms};
}
const bcBalanced=()=>{const t=bcCounts();return t.syms.every(s=>(t.L[s]||0)===(t.R[s]||0));};
const bcMass=f=>{const c=parseF(f);return Object.keys(c).reduce((t,s)=>t+c[s]*((BYSYM[s]||{}).mass||1),0);};
const bcSide=k=>k<BL.rx.nL?'L':'R';
/* ---- the equation row ---- */
function bcRenderEq(){
  const rx=BL.rx,eq=$('bcEq');eq.replaceChildren();
  rx.terms.forEach((f,k)=>{
    if(k>0)eq.append(h('span',{class:'bcop'+(k===rx.nL?' arrow':'')},k===rx.nL?'→':'+'));
    const pack=h('button',{class:'bcpack','data-k':k,'aria-label':`Drag a pack of ${f} onto the ${k<rx.nL?'left':'right'} pan`,tabindex:'-1'});pack.innerHTML=BL.mols[k].svg;
    pack.addEventListener('pointerdown',e=>{if((e.button||0)>0)return;e.preventDefault();bcDragBegin(e,{from:'eq',k});});
    eq.append(h('div',{class:'bcterm '+(k<rx.nL?'re':'pr')},pack,
      h('div',{class:'bcstep'},h('button',{'aria-label':'less '+f,onclick:()=>bcChange(k,-1)},'−'),h('b',{class:'bccoef',id:'bcCoef'+k},BL.coefs[k]),h('button',{'aria-label':'more '+f,onclick:()=>bcChange(k,1)},'+')),
      h('div',{class:'bcfs'},h('span',{class:'bcbig',id:'bcBig'+k},BL.coefs[k]>1?BL.coefs[k]:''),fmtStr(f))));
  });
}
/* ---- the scale ---- */
function bcBuildStage(){
  mkDefs();const st=$('bcStage');
  st.innerHTML=`<svg id="bcSvg" viewBox="0 0 ${BC_W} ${BC_H}" preserveAspectRatio="xMidYMid meet" aria-label="Balance scale. Reactants on the left pan, products on the right pan.">
  <defs><linearGradient id="bcMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e3a6"/><stop offset=".5" stop-color="#d4a640"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
  <linearGradient id="bcPost" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a6420"/><stop offset=".45" stop-color="#f1d58a"/><stop offset="1" stop-color="#7a5418"/></linearGradient>
  <linearGradient id="bcPanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dc95"/><stop offset="1" stop-color="#a7791f"/></linearGradient>
  <radialGradient id="bcBg" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#26357a"/><stop offset=".6" stop-color="#151d4c"/><stop offset="1" stop-color="#0b1130"/></radialGradient></defs>
  <rect x="-500" y="-200" width="${BC_W+1000}" height="${BC_H+400}" fill="#0b1130"/><rect x="-100" y="-40" width="${BC_W+200}" height="${BC_H+80}" fill="url(#bcBg)"/>
  <ellipse cx="${BC_PX}" cy="${BC_H-10}" rx="120" ry="12" fill="rgba(0,0,0,.35)"/>
  <path d="M${BC_PX-70} ${BC_H-12} q70 -26 140 0z" fill="url(#bcMetal)" stroke="#6b4a12" stroke-width="2"/>
  <rect x="${BC_PX-9}" y="${BC_PY}" width="18" height="${BC_H-BC_PY-22}" rx="6" fill="url(#bcPost)" stroke="#6b4a12" stroke-width="1.5"/>
  <g id="bcPanL"></g><g id="bcPanR"></g>
  <g id="bcBeam"><rect x="${BC_PX-BC_ARM-8}" y="${BC_PY-7}" width="${2*BC_ARM+16}" height="14" rx="7" fill="url(#bcMetal)" stroke="#6b4a12" stroke-width="1.5"/>
   <circle cx="${BC_PX-BC_ARM}" cy="${BC_PY}" r="7" fill="#f6e3a6" stroke="#6b4a12" stroke-width="1.5"/><circle cx="${BC_PX+BC_ARM}" cy="${BC_PY}" r="7" fill="#f6e3a6" stroke="#6b4a12" stroke-width="1.5"/></g>
  <path id="bcNeedle" d="M${BC_PX-5} ${BC_PY} L${BC_PX} ${BC_PY-34} L${BC_PX+5} ${BC_PY}z" fill="#e2483f"/>
  <circle cx="${BC_PX}" cy="${BC_PY}" r="11" fill="url(#bcMetal)" stroke="#6b4a12" stroke-width="2"/>
  <text x="${BC_PX-BC_ARM}" y="${BC_H-8}" class="bcmass" id="bcMassL" text-anchor="middle"></text><text x="${BC_PX+BC_ARM}" y="${BC_H-8}" class="bcmass" id="bcMassR" text-anchor="middle"></text>
  </svg><div class="bctoast" id="bcToast" role="status" aria-live="polite"></div>`;
  ['L','R'].forEach(sd=>{const g=$('bcPan'+sd);
    g.innerHTML=`<g class="bcstr"><line x1="0" y1="0" x2="-128" y2="150"/><line x1="0" y1="0" x2="128" y2="150"/><line x1="0" y1="0" x2="0" y2="150"/></g>
    <g class="bcpile" id="bcPile${sd}"></g><g class="bcglow"><ellipse cx="0" cy="162" rx="150" ry="20"/></g>
    <path d="M-150 150 Q-140 186 0 188 Q140 186 150 150 Z" fill="url(#bcPanG)" stroke="#6b4a12" stroke-width="2"/>
    <ellipse cx="0" cy="150" rx="150" ry="11" fill="#f8e7b3" stroke="#6b4a12" stroke-width="2" opacity=".95"/>`;
    g.addEventListener('pointerdown',e=>{const p=e.target.closest('.bcmol');if(!p||(e.button||0)>0)return;e.preventDefault();bcDragBegin(e,{from:'pan',k:+p.dataset.k,el:p});});});
  bcPose(0);
}
function bcPose(th){BL&&(BL.tilt=th);const r=th*Math.PI/180;
  $('bcBeam').setAttribute('transform',`rotate(${th.toFixed(2)} ${BC_PX} ${BC_PY})`);$('bcNeedle').setAttribute('transform',`rotate(${th.toFixed(2)} ${BC_PX} ${BC_PY})`);
  [['L',-1],['R',1]].forEach(([sd,s])=>{const x=BC_PX+s*BC_ARM*Math.cos(r),y=BC_PY+s*BC_ARM*Math.sin(r);$('bcPan'+sd).setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);});}
function bcTiltTo(th){if(bcTw)bcTw.cancel();const from=BL.tilt||0;if(Math.abs(from-th)<.05)return bcPose(th);
  bcTw=Art.tween({from,to:th,dur:900,ease:'outElastic',step:v=>bcPose(v)});}
/* pile the molecule packs into a pan, shrinking them to fit */
function bcPile(sd){const rx=BL.rx,items=[];
  rx.terms.forEach((f,k)=>{if(bcSide(k)!==sd)return;for(let i=0;i<BL.coefs[k];i++)items.push({k,i,isNew:i>=BL.prev[k]});});
  const W=272,H=128,gap=4;let s=1,rows;
  for(s=1;s>.25;s-=.05){rows=[];let row=[],rw=0;
    items.forEach(it=>{const m=BL.mols[it.k],w=m.w*s;if(row.length&&rw+w>W){rows.push({row,rw});row=[];rw=0;}row.push(it);rw+=w+gap;});
    if(row.length)rows.push({row,rw});
    const th=rows.reduce((t,r)=>t+Math.max(...r.row.map(it=>BL.mols[it.k].h*s))+gap,0);if(th<=H)break;}
  let y=147,out='';
  rows.forEach(({row,rw})=>{const rh=Math.max(...row.map(it=>BL.mols[it.k].h*s));let x=-(rw-gap)/2;
    row.forEach(it=>{const m=BL.mols[it.k],w=m.w*s;const ty=y-m.h*s;
      out+=`<g class="bcmol" data-k="${it.k}" transform="translate(${x.toFixed(1)} ${ty.toFixed(1)})"><g class="bcmolin${it.isNew?' bcdrop':''}" style="--d:${(it.i-BL.prev[it.k])*70}ms"><g transform="scale(${s.toFixed(3)}) translate(${(-m.x0).toFixed(1)} ${(-m.y0).toFixed(1)})">${m.inner}</g></g></g>`;x+=w+gap;});
    y-=rh+gap;});
  $('bcPile'+sd).innerHTML=out;}
function bcRender(){
  const t=bcCounts(),bal=bcBalanced(),rx=BL.rx;
  rx.terms.forEach((f,k)=>{$('bcCoef'+k).textContent=BL.coefs[k];$('bcBig'+k).textContent=BL.coefs[k]>1?BL.coefs[k]:'';});
  bcPile('L');bcPile('R');BL.prev=BL.coefs.slice();
  let mL=0,mR=0;rx.terms.forEach((f,k)=>{const m=bcMass(f)*BL.coefs[k];if(k<rx.nL)mL+=m;else mR+=m;});
  const th=BL.test||bal?0:Math.max(-BC_MAXT,Math.min(BC_MAXT,-(mL-mR)/Math.max(mL,mR)*40));bcTiltTo(th);
  $('bcMassL').textContent='REACTANTS'+(BL.test?'':'  ·  mass '+Math.round(mL));$('bcMassR').textContent='PRODUCTS'+(BL.test?'':'  ·  mass '+Math.round(mR));
  $('bcStage').classList.toggle('bcok',!BL.test&&bal);
  $('bcTally').replaceChildren(
    h('div',{class:'bchead '+(bal?'okr':'badr')},I(bal?'check':'scale'),bal?'Both sides match!':'Match every element on both pans'),
    ...t.syms.map(s=>{const l=t.L[s]||0,r=t.R[s]||0,ok=l===r,ic=h('span',{class:'bcball'});ic.innerHTML=`<svg viewBox="-17 -17 34 34">${mkBall(s,15)}</svg>`;
      return h('div',{class:'bctal '+(ok?'okr':'badr'),title:`${mkName(s)}: ${l} on the left, ${r} on the right`},ic,h('b',null,l),h('span',{class:'bcvs'},ok?'=':'≠'),h('b',null,r));}));
  $('bcWorth').textContent=BL.done?0:Math.max(1,3-BL.hints-BL.wrong);
}
function bcSay(t,bad){const el=$('bcToast');el.textContent=t;el.className='bctoast on'+(bad?' bad':'');clearTimeout(bcSay.t);bcSay.t=setTimeout(()=>{el.className='bctoast';},2600);}
function bcChange(k,d){
  if(BL.done)return;const v=BL.coefs[k]+d;
  if(v<1){bcSay('Every substance in the reaction needs at least 1.',true);return;}
  if(v>9){bcSay('9 is the most for this game. Try smaller numbers somewhere else.',true);return;}
  BL.coefs[k]=v;$('bcMsg').textContent='';$('bcMsg').className='msg';bcRender();
  const c=$('bcCoef'+k);if(c)Art.pop(c);
}
/* ---- dragging packs ---- */
function bcPanAt(cx,cy){const s=$('bcStage').getBoundingClientRect();if(cx<s.left||cx>s.right||cy<s.top||cy>s.bottom)return null;return cx<s.left+s.width/2?'L':'R';}
function bcDragBegin(e,o){if(!BL||BL.done||bcDragS)return;bcDragS=Object.assign({x0:e.clientX,y0:e.clientY,pid:e.pointerId,on:false},o);}
document.addEventListener('pointermove',e=>{const d=bcDragS;if(!d||e.pointerId!==d.pid)return;
  if(!d.on){if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<7)return;d.on=true;const m=BL.mols[d.k];
    const sc=Math.min(1,90/Math.max(m.w,m.h));d.ghost=h('div',{class:'bcghost'});d.ghost.innerHTML=m.svg;d.ghost.firstChild.setAttribute('width',(m.w*sc).toFixed(0));d.ghost.firstChild.setAttribute('height',(m.h*sc).toFixed(0));
    document.body.append(d.ghost);if(d.el)d.el.classList.add('bcgone');}
  e.preventDefault();d.ghost.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
  const p=bcPanAt(e.clientX,e.clientY);$('bcPanL').classList.toggle('hot',p==='L');$('bcPanR').classList.toggle('hot',p==='R');},{passive:false});
function bcDragEnd(e){const d=bcDragS;if(!d||e.pointerId!==d.pid)return;bcDragS=null;if(d.ghost)d.ghost.remove();
  if(!BL||!$('bcPanL'))return;$('bcPanL').classList.remove('hot');$('bcPanR').classList.remove('hot');if(d.el)d.el.classList.remove('bcgone');
  if(e.type!=='pointerup'||BL.done)return;const f=BL.rx.terms[d.k],side=bcSide(d.k),nm=fmtStr(f);
  if(!d.on){if(d.from==='eq')bcChange(d.k,1);else bcChange(d.k,-1);return;}
  const p=bcPanAt(e.clientX,e.clientY);
  if(d.from==='eq'){if(!p)return;if(p!==side){bcSay(side==='L'?`${nm} is a reactant, so it goes on the left pan.`:`${nm} is a product, so it goes on the right pan.`,true);{const g=$('bcPan'+p);g.classList.add('no');setTimeout(()=>g.classList.remove('no'),700);}return;}bcChange(d.k,1);return;}
  if(p===side)return;if(p){bcSay(`${nm} belongs on the ${side==='L'?'left':'right'} pan.`,true);return;}bcChange(d.k,-1);}
document.addEventListener('pointerup',bcDragEnd);document.addEventListener('pointercancel',bcDragEnd);
/* ---- buttons ---- */
$('bcHint').onclick=()=>{
  if(BL.done||BL.hints>=2)return;BL.hints++;const b=$('bcHintBox');b.hidden=false;
  b.textContent=BL.hints===1?'Count each kind of atom on both pans. Change the big numbers (coefficients) in front of the formulas, never the small subscripts.'
    :'Answer: '+BL.rx.terms.map((f,k)=>BL.rx.c[k]+' '+fmtStr(f)).join(' + ').replace(' + '+BL.rx.c[BL.rx.nL]+' ',' → '+BL.rx.c[BL.rx.nL]+' ');
  if(BL.hints>=2)$('bcHint').disabled=true;bcRender();
};
$('bcCheck').onclick=()=>{
  if(BL.done)return;const m=$('bcMsg');
  if(BL.test){BL.res.push(bcBalanced()?(BL.coefs.reduce(gcd)>1?.5:1):0);BL.done=true;tstSaved();BL.i++;
    setTimeout(()=>{if(!BL||!BL.test)return;if(BL.i>=BL.queue.length)return TST&&TST.finish();bcRound();},300);return;}
  if(!bcBalanced()){BL.wrong++;m.className='msg bad';const t=bcCounts(),off=t.syms.filter(s=>(t.L[s]||0)!==(t.R[s]||0));
    m.textContent=`Not yet. ${off.map(mkName).join(' and ')} ${off.length>1?"don't":"doesn't"} match on both pans.`;fx.pop({icon:'burst',text:'Almost!',kind:'oops'});
    document.querySelectorAll('#bcTally .bctal.badr').forEach(x=>Art.shake(x));bcRender();return;}
  if(BL.coefs.reduce(gcd)>1){m.className='msg bad';m.textContent='Balanced! But can you use smaller numbers? Divide them all by the same number.';fx.pop({icon:'down',text:'Smaller numbers!',kind:'try'});return;}
  BL.done=true;const pts=Math.max(1,3-BL.hints-BL.wrong);BL.score+=pts;BL.results.push(BL.rx);
  $('bcScore').textContent=BL.score;fx.pop({icon:'scale',text:'Balanced! +'+pts,kind:'great',size:'big'});fx.confetti(pts===3?80:45);
  $('bcStage').classList.add('bcwin');['L','R'].forEach(sd=>{const r=$('bcPan'+sd).getBoundingClientRect();Art.burst(r.left+r.width/2,r.top+r.height*.6,{n:22,colors:['#7dffb5','#ffd23f','#ffffff'],speed:240,gravity:260});});
  m.className='msg good';m.textContent=`Balanced! Atoms are never lost or made, only rearranged. +${pts} pt${pts===1?'':'s'}`;
  $('bcCheck').disabled=true;$('bcHint').disabled=true;
  $('bcNext').textContent=BL.i+1>=BL.queue.length?'See my results ▶':'Next ▶';$('bcNext').hidden=false;$('bcNext').focus({preventScroll:true});
  $('bcWorth').textContent=0;
};
$('bcNext').onclick=()=>{BL.i++;if(BL.i>=BL.queue.length)return bcEnd();bcRound();};
$('bcQuit').onclick=()=>BL&&BL.test?tstQuit():goMenu();
function bcEnd(){
  const P=prof(),rec=P.balance,prev=rec.best;rec.plays++;const isBest=BL.score>prev;if(isBest)rec.best=BL.score;saveAll();
  cloudSubmit('balance','',BL.score,{n:BL.queue.length});
  const max=BL.queue.length*3;
  showEnd({emoji:'scale',title:BL.score>=max*.8?'Master Balancer!':BL.score>=max*.5?'Nicely Balanced!':'Keep Balancing!',big:`${BL.score}/${max}`,sub:'Balance It score',
    body:[isBest?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,h('p',null,'High score: ',h('b',null,rec.best)),
      h('div',{class:'tchips'},BL.queue.map(r=>h('span',{class:'tchip'},r.terms.map(fmtStr).join(' + ').replace(' + '+fmtStr(r.terms[r.nL]),' → '+fmtStr(r.terms[r.nL])))))],
    again:startBalance,party:isBest?'New high score!':(BL.score>=max*.7?'Great balancing!':null)});
}
