/* ================= GAME 4: ATOM BUILDER ================= */
const ION_SET=[['Li',1],['Na',1],['K',1],['Be',2],['Mg',2],['Ca',2],['Al',3],['F',-1],['Cl',-1],['O',-2],['S',-2],['N',-3]];
const ISO_SET=[['H',2],['H',3],['He',3],['Li',6],['C',13],['C',14],['N',15],['O',17],['O',18],['Cl',37],['Mg',26],['Ne',22]];
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const supNum=n=>String(n).split('').map(d=>SUP[+d]).join('');
const ionLabel=(sym,ch)=>sym+(Math.abs(ch)>1?supNum(Math.abs(ch)):'')+(ch>0?'⁺':'⁻');
const chargeText=c=>c===0?'neutral (0)':(c>0?'+'+c:String(c));
function makeAtomQ(kind,sym,extra){
  const e=BYSYM[sym],mass=Math.round(e.mass);
  if(kind==='ion')return {kind,sym,Z:e.n,N:mass-e.n,E:e.n-extra,text:`${ionLabel(sym,extra)} ion`,sub:`${e.name} with a charge of ${extra>0?'+'+extra:extra}.`};
  if(kind==='isotope')return {kind,sym,Z:e.n,N:extra-e.n,E:e.n,text:`${e.name}-${extra}`,sub:`A neutral atom with mass number ${extra}.`};
  return {kind:'neutral',sym,Z:e.n,N:mass-e.n,E:e.n,text:`${e.name} atom`,sub:'A neutral atom: no overall charge.'};
}
function atomQueue(level){
  if(level==='1')return sample(EL.filter(e=>e.n<=10),ROUND_LEN).map(e=>makeAtomQ('neutral',e.sym));
  if(level==='2')return sample(EL.filter(e=>e.n<=20),ROUND_LEN).map(e=>makeAtomQ('neutral',e.sym));
  return shuffle([...sample(ION_SET,5).map(([s,c])=>makeAtomQ('ion',s,c)),...sample(ISO_SET,5).map(([s,m])=>makeAtomQ('isotope',s,m))]);
}
const ATLEVELS={'1':['Level 1: Neutral atoms','The first 10 elements'],'2':['Level 2: Bigger atoms','Elements 1–20'],'3':['Level 3: Ions & isotopes','Charged atoms and different masses']};
function renderAtomSetup(){
  const P=prof();
  $('atLevels').replaceChildren(...Object.keys(ATLEVELS).map(l=>{
    const r=P.atom[l];
    return h('button',{class:'lvl',onclick:()=>startAtom(l)},h('b',null,ATLEVELS[l][0]),h('small',null,ATLEVELS[l][1]),
      h('span',{class:'bestline'},r&&r.plays?[I('medal'),`High score: ${r.best}/${ROUND_LEN*3}`]:'No score yet'));
  }));
}
function atomSVG(p,n,e){
  const ns='http://www.w3.org/2000/svg',C=160;
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 320 320');
  const mk=(t,a)=>{const x=document.createElementNS(ns,t);for(const k in a)x.setAttribute(k,a[k]);return x;};
  const caps=[2,8,8,18],radii=[64,92,120,148];let left=e;const shells=[];
  for(let i=0;i<4&&left>0;i++){const c=Math.min(caps[i],left);shells.push(c);left-=c;}
  shells.forEach((c,i)=>svg.append(mk('circle',{cx:C,cy:C,r:radii[i],fill:'none',stroke:'#d3dcf0','stroke-width':1.8})));
  const order=[];let pp=p,nn=n;
  while(pp>0||nn>0){if(pp>0){order.push('p');pp--;}if(nn>0){order.push('n');nn--;}}
  {const nR=Math.sqrt(order.length+.5)*6.8+12,R=Math.max(shells.length?radii[shells.length-1]:0,nR,58)+20;
   svg.setAttribute('viewBox',`${C-R} ${C-R} ${2*R} ${2*R}`);}
  order.forEach((t,i)=>{const a=i*2.39996,r=Math.sqrt(i+.5)*6.8,x=C+r*Math.cos(a),y=C+r*Math.sin(a);
    svg.append(mk('circle',{cx:x,cy:y,r:6.6,fill:t==='p'?'#e2483f':'#aab3c5',stroke:'#fff','stroke-width':1.2}));
    if(t==='p')svg.append(mk('path',{d:`M${x-2.6} ${y}h5.2M${x} ${y-2.6}v5.2`,stroke:'#fff','stroke-width':1.5,'stroke-linecap':'round'}));});
  shells.forEach((c,i)=>{for(let k=0;k<c;k++){const a=(-90+k*360/c+i*20)*Math.PI/180,x=C+radii[i]*Math.cos(a),y=C+radii[i]*Math.sin(a);
    svg.append(mk('circle',{cx:x,cy:y,r:10,fill:'#2f6bff','fill-opacity':.16}));
    svg.append(mk('circle',{cx:x,cy:y,r:7,fill:'#2f6bff',stroke:'#fff','stroke-width':1.6}));
    svg.append(mk('path',{d:`M${x-2.6} ${y}h5.2`,stroke:'#fff','stroke-width':1.6,'stroke-linecap':'round'}));}});
  if(!order.length){const t=mk('text',{x:C,y:C+5,'text-anchor':'middle','font-size':15,fill:'#7a8aa6','font-family':'system-ui'});t.textContent='Add some particles!';svg.append(t);}
  return svg;
}
const AT_CAP={p:20,n:24,e:24};
let AT=null;
function startAtom(level){
  const test=tstOn('atom');
  AT={level,queue:test?TEST_SET.atom():atomQueue(level),i:0,score:0,test,res:[]};
  show('s-atom');$('s-atom').classList.toggle('testing',test);$('atQuit').textContent=test?'Leave test':'Quit';
  if(test)TST.finish=()=>{const right=AT.res.filter(Boolean).length;tstFinish(right/AT.queue.length*100,{right,n:AT.queue.length});};
  atRound();
}
function atRound(){
  const q=AT.queue[AT.i];Object.assign(AT,{q,p:0,n:0,e:0,hints:0,wrong:0,done:false});
  const el=BYSYM[q.sym];
  $('atQ').textContent=AT.i+1;$('atScore').textContent=AT.score;
  $('atPrompt').textContent=q.text;$('atSub').textContent=q.sub;
  $('atTile').replaceChildren(h('div',{class:'etile',style:`background:${CATS[el.cat][1]}`},
    h('span',{class:'tn'},el.n),h('span',{class:'ts'},el.sym),h('span',{class:'tnm'},el.name),h('span',{class:'tw'},el.mass.toFixed(3))));
  $('atHintBox').hidden=true;$('atMsg').textContent='';$('atMsg').className='msg';$('atNext').hidden=true;
  ['atCheck','atHint','atReset'].forEach(id=>$(id).disabled=false);
  atRender();
}
function atRender(){
  const {p,n,e}=AT,el=p>0&&p<=118?EL[p-1]:null,ch=p-e;
  $('atSvg').replaceChildren(atomSVG(p,n,e));
  ['p','n','e'].forEach(k=>$('atv_'+k).textContent=AT[k]);
  $('atRead').replaceChildren(h('div',null,h('b',null,`${p}`),' protons · ',h('b',null,`${n}`),' neutrons · ',h('b',null,`${e}`),' electrons'),
    h('div',null,el?`This is ${el.name}-${p+n}`:'Not an atom yet',` · mass number ${p+n} · charge ${chargeText(ch)}`));
  $('atWorth').textContent=AT.done?0:Math.max(1,3-AT.hints-AT.wrong);
}
function atChange(k,d){
  if(!AT||AT.done)return;
  AT[k]=Math.max(0,Math.min(AT_CAP[k],AT[k]+d));$('atMsg').textContent='';atRender();
}
$('atCtrs').addEventListener('click',ev=>{const b=ev.target.closest('button[data-k]');if(b)atChange(b.dataset.k,+b.dataset.d);});
$('atReset').onclick=()=>{if(!AT||AT.done)return;AT.p=AT.n=AT.e=0;atRender();};
$('atHint').onclick=()=>{
  if(!AT||AT.done||AT.hints>=2)return;AT.hints++;const q=AT.q,b=$('atHintBox');b.hidden=false;
  b.textContent=AT.hints===1?'Protons = the atomic number on the tile. Mass number = protons + neutrons. A neutral atom has as many electrons as protons.'
    :`Answer: ${q.Z} protons, ${q.N} neutrons, ${q.E} electrons.`;
  if(AT.hints>=2)$('atHint').disabled=true;atRender();
};
$('atCheck').onclick=()=>{
  if(!AT||AT.done)return;const q=AT.q,m=$('atMsg');
  if(AT.test){AT.res.push(AT.p===q.Z&&AT.n===q.N&&AT.e===q.E);AT.done=true;tstSaved();AT.i++;
    setTimeout(()=>{if(!AT||!AT.test)return;if(AT.i>=AT.queue.length)return TST&&TST.finish();atRound();},300);return;}
  if(AT.p===q.Z&&AT.n===q.N&&AT.e===q.E)return atSuccess();
  AT.wrong++;m.className='msg bad';fx.pop({icon:'burst',text:'Almost!',kind:'oops'});
  m.textContent=AT.p!==q.Z?'Check the protons. What does the atomic number say?'
    :AT.n!==q.N?'Protons are right! Now the neutrons: mass number − protons.'
    :'Nice! Now the electrons. Think about the charge.';
  atRender();
};
function atSuccess(){
  AT.done=true;const pts=Math.max(1,3-AT.hints-AT.wrong);AT.score+=pts;
  $('atScore').textContent=AT.score;fx.pop({icon:'atom',text:'Atom built! +'+pts,kind:'great',size:'big'});fx.confetti(pts===3?80:45);
  const m=$('atMsg');m.className='msg good';m.textContent=`${AT.q.text} built! +${pts} pt${pts===1?'':'s'}`;
  ['atCheck','atHint','atReset'].forEach(id=>$(id).disabled=true);
  $('atNext').textContent=AT.i+1>=AT.queue.length?'See my results ▶':'Next ▶';$('atNext').hidden=false;$('atNext').focus({preventScroll:true});
  $('atWorth').textContent=0;
}
$('atNext').onclick=()=>{AT.i++;if(AT.i>=AT.queue.length)return atEnd();atRound();};
$('atQuit').onclick=()=>AT&&AT.test?tstQuit():goMenu();
function atEnd(){
  const P=prof(),rec=atRec(P,AT.level),prev=rec.best;rec.plays++;const isBest=AT.score>prev;if(isBest)rec.best=AT.score;saveAll();
  cloudSubmit('atom',AT.level,AT.score,{n:AT.queue.length});
  const max=AT.queue.length*3;
  showEnd({emoji:'atom',title:AT.score>=max*.8?'Atom Architect!':AT.score>=max*.5?'Great Building!':'Keep Building!',big:`${AT.score}/${max}`,sub:ATLEVELS[AT.level][0],
    body:[isBest?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,h('p',null,'High score here: ',h('b',null,rec.best)),
      h('div',{class:'tchips'},AT.queue.map(q=>h('span',{class:'tchip'},q.text)))],
    again:()=>startAtom(AT.level),party:isBest?'New high score!':(AT.score>=max*.7?'Great building!':null)});
}

