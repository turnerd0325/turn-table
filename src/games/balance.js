/* ================= GAME 5: BALANCE IT ================= */
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
let BL=null;
function startBalance(){
  const by=t=>REACTIONS.filter(r=>r.t===t),test=tstOn('balance');
  BL={queue:test?[...by(1).slice(0,3),...by(2).slice(0,4),...by(3).slice(0,3)]:[...sample(by(1),3),...sample(by(2),4),...sample(by(3),3)],i:0,score:0,results:[],test,res:[]};
  show('s-balance');$('s-balance').classList.toggle('testing',test);$('bcQuit').textContent=test?'Leave test':'Quit';
  if(test)TST.finish=()=>{const pts=BL.res.reduce((a,b)=>a+b,0);tstFinish(pts/BL.queue.length*100,{right:BL.res.filter(x=>x===1).length,n:BL.queue.length});};
  bcRound();
}
function bcRound(){
  const rx=BL.queue[BL.i];Object.assign(BL,{rx,coefs:rx.terms.map(()=>1),hints:0,wrong:0,done:false});
  $('bcQ').textContent=BL.i+1;$('bcScore').textContent=BL.score;$('bcClue').textContent=rx.clue;
  $('bcHintBox').hidden=true;$('bcMsg').textContent='';$('bcMsg').className='msg';$('bcNext').hidden=true;
  $('bcCheck').disabled=false;$('bcHint').disabled=false;
  bcRender();
}
function bcCounts(){
  const L={},R={},rx=BL.rx;
  rx.terms.forEach((f,k)=>{const c=parseF(f),side=k<rx.nL?L:R;Object.keys(c).forEach(s=>side[s]=(side[s]||0)+c[s]*BL.coefs[k]);});
  return {L,R,syms:[...new Set(Object.keys(L).concat(Object.keys(R)))]};
}
const bcBalanced=()=>{const t=bcCounts();return t.syms.every(s=>(t.L[s]||0)===(t.R[s]||0));};
function bcMini(f){const c={};f.replace(/([A-Z][a-z]?)(\d*)/g,(m,s,n)=>{c[s]=(c[s]||0)+(n?+n:1);});
  if(Object.values(c).reduce((a,b)=>a+b,0)>6)return null;
  const d=h('span',{class:'mini'});d.append(molSVG(c));return d;}
function bcRender(){
  const rx=BL.rx,eq=$('bcEq');eq.replaceChildren();
  rx.terms.forEach((f,k)=>{
    if(k>0)eq.append(h('span',{class:'op'},k===rx.nL?'→':'+'));
    eq.append(h('span',{class:'term'},bcMini(f),
      h('span',{class:'stepper'},h('button',{'aria-label':'less '+f,onclick:()=>bcChange(k,-1)},'−'),h('b',{class:'coef'},BL.coefs[k]),h('button',{'aria-label':'more '+f,onclick:()=>bcChange(k,1)},'+')),
      h('span',{class:'fs'},fmtStr(f))));
  });
  const t=bcCounts(),bal=bcBalanced(),mx=Math.max(1,...t.syms.map(s=>Math.max(t.L[s]||0,t.R[s]||0)));
  $('bcTally').replaceChildren(
    h('div',{class:'tally-head '+(bal?'okr':'badr')},I(bal?'check':'scale'),bal?'Both sides match!':'Not balanced yet: the atoms on each side must match'),
    ...t.syms.map(s=>{const l=t.L[s]||0,r=t.R[s]||0;
      return h('div',{class:'trow '+(l===r?'okr':'badr')},h('b',{class:'tsym'},s),
        h('div',{class:'tbars'},h('div',{class:'bar l',style:`width:${l/mx*100}%`},l),h('div',{class:'bar r',style:`width:${r/mx*100}%`},r)),
        h('span',{class:'tmark'},I(l===r?'check':'x')));}));
  $('bcWorth').textContent=BL.done?0:Math.max(1,3-BL.hints-BL.wrong);
}
function bcChange(k,d){
  if(BL.done)return;BL.coefs[k]=Math.max(1,Math.min(9,BL.coefs[k]+d));$('bcMsg').textContent='';bcRender();
}
$('bcHint').onclick=()=>{
  if(BL.done||BL.hints>=2)return;BL.hints++;const b=$('bcHintBox');b.hidden=false;
  b.textContent=BL.hints===1?'Count each kind of atom on both sides. Change the big numbers (coefficients) in front of the formulas, never the small subscripts.'
    :'Answer: '+BL.rx.terms.map((f,k)=>BL.rx.c[k]+' '+fmtStr(f)).join(' + ').replace(' + '+BL.rx.c[BL.rx.nL]+' ',' → '+BL.rx.c[BL.rx.nL]+' ');
  if(BL.hints>=2)$('bcHint').disabled=true;bcRender();
};
$('bcCheck').onclick=()=>{
  if(BL.done)return;const m=$('bcMsg');
  if(BL.test){BL.res.push(bcBalanced()?(BL.coefs.reduce(gcd)>1?.5:1):0);BL.done=true;tstSaved();BL.i++;
    setTimeout(()=>{if(!BL||!BL.test)return;if(BL.i>=BL.queue.length)return TST&&TST.finish();bcRound();},300);return;}
  if(!bcBalanced()){BL.wrong++;m.className='msg bad';m.textContent='Not yet. Compare the left and right atom counts below.';fx.pop({icon:'burst',text:'Almost!',kind:'oops'});bcRender();return;}
  if(BL.coefs.reduce(gcd)>1){m.className='msg bad';m.textContent='Balanced! But can you use smaller numbers? Divide them all by the same number.';fx.pop({icon:'down',text:'Smaller numbers!',kind:'try'});return;}
  BL.done=true;const pts=Math.max(1,3-BL.hints-BL.wrong);BL.score+=pts;BL.results.push(BL.rx);
  $('bcScore').textContent=BL.score;fx.pop({icon:'scale',text:'Balanced! +'+pts,kind:'great',size:'big'});fx.confetti(pts===3?80:45);
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


