/* ================= GAME 6: ATOM DINER (MS-PS1-5) ================= */
const ACOL=ATOMC;
function ball(s,big){const c=ACOL[s]||['#ccc','#222'];return h('span',{class:'ball'+(big?' big':''),style:`background:${c[0]};color:${c[1]}`},s);}
function molBalls(f){const c=parseF(f),out=[];Object.keys(c).forEach(s=>{for(let i=0;i<c[s];i++)out.push(ball(s));});return h('span',{class:'balls'},out);}
const addC=(a,b,k=1)=>{for(const s in b)a[s]=(a[s]||0)+b[s]*k;return a;};
const sumC=c=>Object.values(c).reduce((x,y)=>x+y,0);
const fitsIn=(need,have)=>Object.keys(need).every(s=>(have[s]||0)>=need[s]);
const sameC=(a,b)=>{for(const k of new Set(Object.keys(a).concat(Object.keys(b))))if((a[k]||0)!==(b[k]||0))return false;return true;};
const cntList=list=>list.reduce((c,[n,f])=>addC(c,parseF(f),n),{});
const fmtClock=ms=>{const s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
// [name, description, shift seconds, customer patience seconds]
const DN_LEVELS={'1':['Breakfast Shift','Small orders. The ticket tells you how many of each dish.',120,35],
  '2':['Lunch Rush','Bigger orders. You figure out how many of each dish.',150,45],
  '3':['Dinner Madness','Giant molecules, hidden amounts, hungry customers.',180,60]};
const DISHES=[
 {lv:1,dish:'Rocket Fuel Combo',ctx:'Hydrogen burns in oxygen to make water. That’s rocket fuel!',R:[[2,'H2'],[1,'O2']],P:[[2,'H2O']]},
 {lv:1,dish:'Lightning Fizz',ctx:'Lightning makes the nitrogen and oxygen in air combine.',R:[[1,'N2'],[1,'O2']],P:[[2,'NO']]},
 {lv:1,dish:'Campfire Smoke',ctx:'Carbon burns in oxygen to make carbon dioxide.',R:[[1,'C'],[1,'O2']],P:[[1,'CO2']]},
 {lv:1,dish:'Table Salt Fries',ctx:'Sodium metal and chlorine gas react to make table salt.',R:[[2,'Na'],[1,'Cl2']],P:[[2,'NaCl']]},
 {lv:1,dish:'Sparkler Snack',ctx:'Magnesium burns with a blinding white light.',R:[[2,'Mg'],[1,'O2']],P:[[2,'MgO']]},
 {lv:1,dish:'Acid Bites',ctx:'Hydrogen and chlorine react to make hydrogen chloride.',R:[[1,'H2'],[1,'Cl2']],P:[[2,'HCl']]},
 {lv:1,dish:'Limestone Bake',ctx:'Heating limestone breaks it into lime and carbon dioxide.',R:[[1,'CaCO3']],P:[[1,'CaO'],[1,'CO2']]},
 {lv:1,dish:'Bubbly Peroxide',ctx:'Hydrogen peroxide breaks down into water and oxygen gas.',R:[[2,'H2O2']],P:[[2,'H2O'],[1,'O2']]},
 {lv:1,dish:'Fertilizer Fritters',ctx:'Farms use ammonia made from nitrogen and hydrogen.',R:[[1,'N2'],[3,'H2']],P:[[2,'NH3']]},
 {lv:2,dish:'Gas Stove Special',ctx:'Natural gas (methane) burns on a kitchen stove.',R:[[1,'CH4'],[2,'O2']],P:[[1,'CO2'],[2,'H2O']]},
 {lv:2,dish:'Rotten Egg Roast',ctx:'Hydrogen sulfide (rotten egg gas) burns.',R:[[2,'H2S'],[3,'O2']],P:[[2,'SO2'],[2,'H2O']]},
 {lv:2,dish:'Oxygen Candle',ctx:'Heating potassium chlorate releases oxygen gas.',R:[[2,'KClO3']],P:[[2,'KCl'],[3,'O2']]},
 {lv:2,dish:'Zinc Fizz',ctx:'Zinc metal fizzes in hydrochloric acid and gives off hydrogen gas.',R:[[1,'Zn'],[2,'HCl']],P:[[1,'ZnCl2'],[1,'H2']]},
 {lv:2,dish:'Foil Flash',ctx:'Aluminum reacts with chlorine gas.',R:[[2,'Al'],[3,'Cl2']],P:[[2,'AlCl3']]},
 {lv:2,dish:'Volcano Float',ctx:'Baking soda and acid fizz, just like a science-fair volcano.',R:[[1,'NaHCO3'],[1,'HCl']],P:[[1,'NaCl'],[1,'H2O'],[1,'CO2']]},
 {lv:2,dish:'Chalk Fizz',ctx:'Chalk (calcium carbonate) bubbles when acid touches it.',R:[[1,'CaCO3'],[2,'HCl']],P:[[1,'CaCl2'],[1,'H2O'],[1,'CO2']]},
 {lv:3,dish:'Backyard Grill Plate',ctx:'Propane burns in a backyard grill.',R:[[1,'C3H8'],[5,'O2']],P:[[3,'CO2'],[4,'H2O']]},
 {lv:3,dish:'Rusty Iron Platter',ctx:'Iron slowly reacts with oxygen to make rust.',R:[[4,'Fe'],[3,'O2']],P:[[2,'Fe2O3']]},
 {lv:3,dish:'Flambé Special',ctx:'Ethanol burns with a blue flame.',R:[[1,'C2H6O'],[3,'O2']],P:[[2,'CO2'],[3,'H2O']]},
 {lv:3,dish:'Muscle Fuel Smoothie',ctx:'Your cells "burn" sugar for energy. That’s cellular respiration!',R:[[1,'C6H12O6'],[6,'O2']],P:[[6,'CO2'],[6,'H2O']]},
 {lv:3,dish:'Fireworks Fondue',ctx:'Ammonia burns to make nitric oxide and water.',R:[[4,'NH3'],[5,'O2']],P:[[4,'NO'],[6,'H2O']]},
 {lv:3,dish:'Baking Powder Puff',ctx:'Baking soda breaks down in a hot oven and makes bread rise.',R:[[2,'NaHCO3']],P:[[1,'Na2CO3'],[1,'H2O'],[1,'CO2']]},
 {lv:3,dish:'Ethane Torch',ctx:'Ethane gas burns.',R:[[2,'C2H6'],[7,'O2']],P:[[4,'CO2'],[6,'H2O']]}
].map(d=>{
  d.inst=[];d.R.forEach(([n,f])=>{for(let i=0;i<n;i++)d.inst.push(f);});
  d.need=d.P.map(([n,f])=>({f,c:parseF(f),n}));
  d.atoms=sumC(cntList(d.R));
  if(!sameC(cntList(d.R),cntList(d.P)))console.warn('Atom Diner: unbalanced dish',d.dish);
  return d;
});
const DN_CUST=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const DN_SAY=[d=>`I'll have the ${d.dish}, please!`,d=>`One ${d.dish}. Make it snappy!`,d=>`Ooh, the ${d.dish} looks good!`,d=>`${d.dish}! I'm STARVING.`,d=>`Is the ${d.dish} fresh? I'll take it!`];
const DN_THANKS=['Delicious!','Chef’s kiss!','Five stars!','Mmm, perfectly rearranged!','Not a single atom wasted!'];
let DN=null;
const pick=a=>a[Math.floor(Math.random()*a.length)];
function dnBestLine(P){const v=Object.values(P.diner||{}).filter(r=>r.plays).map(r=>r.best);return v.length?`Best shift: ${Math.max(...v)} coins`:'';}
function renderDinerSetup(){
  const P=prof(),ic={'1':'','2':'','3':''};
  $('dnLevels').replaceChildren(...Object.keys(DN_LEVELS).map(k=>{const L=DN_LEVELS[k],r=P.diner[k];
    return h('button',{class:'lvl',onclick:()=>startDiner(k)},h('b',null,ic[k]+L[0]),h('small',null,`${L[1]} ${fmtClock(L[2]*1000)} shift.`),
      h('span',{class:'bestline'},r&&r.plays?`Best: ${r.best} coins`:'Not played yet'));}));
}
async function startDiner(lv){
  lv=String(lv);const L=DN_LEVELS[lv];
  DN={lv,coins:0,streak:0,bestStreak:0,served:0,lost:0,atoms:0,queue:[],last:null,t:null,len:L[2]*1000,pat:L[3]*1000,tEnd:0,iv:null};
  $('dnShift').textContent=L[0];$('dnCoins').textContent='0';$('dnStreak').textContent='0';$('dnServed').textContent='0';
  $('dnTime').textContent=fmtClock(DN.len);$('dnTime').parentElement.classList.remove('low');
  ['dnIngr','dnDishes','dnTray','dnPlate','dnCounter','dnScale','dnServeBtns'].forEach(id=>$(id).replaceChildren());
  $('dnFace').innerHTML=ART.face('chef');$('dnSay').textContent='Doors open in 3…';$('dnCtx').textContent='';$('dnMsg').textContent='';$('dnSmashAll').hidden=true;
  $('dnPatBar').style.width='100%';$('dnPat').className='patience';
  show('s-diner');
  const my=runId;
  if(!await countdown()||my!==runId)return;
  DN.tEnd=Date.now()+DN.len;
  dnNext();
  DN.iv=setInterval(()=>{if(my!==runId){clearInterval(DN.iv);return;}dnTick();},100);
}
function dnNext(){
  if(!DN.queue.length){
    const lv=+DN.lv;let pool=DISHES.filter(d=>d.lv===lv);
    if(lv>1)pool=pool.concat(sample(DISHES.filter(d=>d.lv===lv-1),lv===2?4:3));
    DN.queue=shuffle(pool);
    if(DN.last&&DN.queue[0]===DN.last&&DN.queue.length>1)DN.queue.push(DN.queue.shift());
  }
  const d=DN.queue.shift();DN.last=d;
  const t=DN.t={d,smashed:d.inst.map(()=>false),tray:{},plate:{},made:[],hand:new Set(),t0:Date.now(),done:false,order:[]};
  d.inst.forEach(f=>Object.keys(parseF(f)).forEach(s=>{if(!t.order.includes(s))t.order.push(s);}));
  DN.cust=pick(DN_CUST);$('dnFace').innerHTML=ART.face(DN.cust);$('dnFace').classList.remove('mad');
  $('dnSay').textContent=pick(DN_SAY)(d);
  $('dnCtx').textContent=d.ctx;
  $('dnMsg').textContent='';$('dnMsg').className='msg';
  dnRender();
}
function dnRender(){
  const t=DN.t;if(!t)return;
  const d=t.d,showN=DN.lv==='1',pc=t.plate,pn=sumC(pc);
  $('dnIngr').replaceChildren(...d.inst.map((f,i)=>h('button',{class:'mol'+(t.smashed[i]?' gone':''),title:t.smashed[i]?'Smashed!':'Click to smash into atoms',
    onclick:ev=>dnSmash(i,ev.currentTarget)},molBalls(f),fmtStr(f))));
  $('dnSmashAll').hidden=t.done||t.smashed.every(Boolean);
  const madeN=f=>t.made.filter(x=>x===f).length;
  $('dnDishes').replaceChildren(...d.need.map(p=>h('span',{class:'dish'},h('span',{class:'q'},showN?String(p.n):'?'),fmtStr(p.f),madeN(p.f)?h('small',null,'✔ '+madeN(p.f)):null)));
  $('dnTray').replaceChildren(...t.order.map((s,i)=>h('button',{class:'abtn','data-sym':s,disabled:t.done||!(t.tray[s]>0),'aria-label':`Add ${s} to the plate`,
    onclick:ev=>dnAdd(s,ev.currentTarget)},h('span',{class:'key'},i+1),ball(s),h('span',{class:'cnt'},'×'+(t.tray[s]||0)))));
  const ex=pn?d.need.filter(p=>sameC(p.c,pc)):[];
  const pb=[];t.order.forEach(s=>{for(let i=0;i<(pc[s]||0);i++)pb.push(ball(s,true));});
  const fml=ex.length?fmtStr(ex[0].f):fmtFormula(Object.fromEntries(t.order.filter(s=>pc[s]).map(s=>[s,pc[s]])));
  $('dnPlate').replaceChildren(...(pn?[h('div',{class:'row'},pb),h('span',{class:'pf'},fml)]:[h('span',{class:'empty'},'Empty plate. Click atoms in the tray.')]));
  $('dnServeBtns').replaceChildren(...ex.map(p=>h('button',{class:'btn sm good',onclick:()=>dnServe(p.f)},'Serve as '+fmtStr(p.f))));
  $('dnClear').disabled=!pn||t.done;
  const quick=pn||t.done?[]:d.need.filter(p=>t.hand.has(p.f)&&fitsIn(p.c,t.tray));
  $('dnCounter').replaceChildren(...(t.made.length?t.made.map((f,i)=>h('button',{class:'mol served',title:'Click to break it back into atoms',onclick:()=>dnBreak(i)},molBalls(f),fmtStr(f)))
      :[h('span',{class:'sub',style:'margin:0'},'Nothing yet')]),
    ...quick.map(p=>h('button',{class:'btn sm',style:'align-self:center',title:'You built this once, so now you can make more in one click',onclick:()=>dnQuick(p.f)},'Make another '+fmtStr(p.f))));
  const inTray=sumC(t.tray),inD=t.made.reduce((a,f)=>a+sumC(parseF(f)),0),unsm=d.atoms-inTray-pn-inD;
  $('dnScale').replaceChildren(h('div',null,'Atoms delivered: ',h('b',null,d.atoms),'  →  in ingredients ',h('b',null,unsm),' · tray ',h('b',null,inTray),' · plate ',h('b',null,pn),' · dishes ',h('b',null,inD)));
  if(!t.done&&t.smashed.every(Boolean)&&!pn&&inTray>0&&!d.need.some(p=>fitsIn(p.c,t.tray)))
    $('dnScale').append(h('div',{class:'stuck'},'Stuck! The leftover atoms can’t make any dish. Click a finished dish to break it apart and try a different mix.'));
}
function dnSmash(i,el){
  const t=DN&&DN.t;if(!t||t.done||t.smashed[i])return;
  t.smashed[i]=true;addC(t.tray,parseF(t.d.inst[i]));
  if(el)fx.pop({icon:'burst',text:'Smash!',kind:'try',at:el});
  dnRender();dnCheck();
}
function dnAdd(s,el){
  const t=DN&&DN.t;if(!t||t.done||!(t.tray[s]>0))return;
  const np=Object.assign({},t.plate);np[s]=(np[s]||0)+1;
  if(!t.d.need.some(p=>fitsIn(np,p.c))){
    if(el){el.classList.remove('no');void el.offsetWidth;el.classList.add('no');fx.pop({icon:'x',text:'No dish needs that!',kind:'oops',at:el});}
    return;
  }
  t.tray[s]--;t.plate=np;
  const ex=t.d.need.filter(p=>sameC(p.c,np));
  // serve automatically unless this plate could still grow into a bigger dish
  if(ex.length===1&&!t.d.need.some(p=>p!==ex[0]&&fitsIn(np,p.c)))return dnServe(ex[0].f);
  dnRender();
}
function dnServe(f){
  const t=DN.t;if(t.done)return;
  t.made.push(f);t.hand.add(f);t.plate={};
  fx.pop({icon:'plate',text:fmtStr(f)+'!',kind:'good',at:$('dnPlate')});
  dnRender();dnCheck();
}
function dnQuick(f){
  const t=DN.t,c=parseF(f);if(t.done||!fitsIn(c,t.tray))return;
  addC(t.tray,c,-1);t.made.push(f);dnRender();dnCheck();
}
function dnBreak(i){
  const t=DN.t;if(t.done)return;
  const f=t.made.splice(i,1)[0];addC(t.tray,parseF(f));dnRender();
}
function dnClearPlate(){const t=DN&&DN.t;if(!t||t.done)return;addC(t.tray,t.plate);t.plate={};dnRender();}
function dnCheck(){
  const t=DN.t;if(t.done||!t.smashed.every(Boolean)||sumC(t.tray)||sumC(t.plate))return;
  if(!t.d.need.every(p=>t.made.filter(x=>x===p.f).length===p.n)){
    $('dnMsg').className='msg bad';$('dnMsg').textContent='Every atom is on a plate, but that’s not the order. Break some dishes apart and remix!';return;
  }
  t.done=true;
  const frac=Math.max(0,1-(Date.now()-t.t0)/DN.pat),base=t.d.atoms,tip=Math.ceil(frac*10),sb=Math.min(10,DN.streak*2),earned=base+tip+sb;
  DN.streak++;DN.bestStreak=Math.max(DN.bestStreak,DN.streak);DN.served++;DN.atoms+=t.d.atoms;DN.coins+=earned;
  $('dnCoins').textContent=DN.coins;$('dnStreak').textContent=DN.streak;$('dnServed').textContent=DN.served;
  fx.pop({icon:'coin',text:'+'+earned,kind:frac>.6?'great':'good',size:'big'});fx.confetti(frac>.6?60:30);
  $('dnFace').innerHTML=ART.face(DN.cust||0,'happy');$('dnSay').textContent=pick(DN_THANKS);
  $('dnMsg').className='msg good';
  $('dnMsg').textContent=`${t.d.atoms} atoms in, ${t.d.atoms} atoms out. None lost, none made! (${base} + ${tip} tip${sb?' + '+sb+' streak':''})`;
  dnRender();
  const my=runId;setTimeout(()=>{if(my===runId&&DN&&Date.now()<DN.tEnd)dnNext();},1400);
}
function dnTick(){
  const left=DN.tEnd-Date.now();
  $('dnTime').textContent=fmtClock(Math.max(0,left));$('dnTime').parentElement.classList.toggle('low',left<15000);
  if(left<=0){clearInterval(DN.iv);return dnEnd();}
  const t=DN.t;if(!t||t.done)return;
  const frac=Math.max(0,1-(Date.now()-t.t0)/DN.pat);
  $('dnPatBar').style.width=(frac*100)+'%';$('dnPat').className='patience'+(frac<.25?' low':frac<.55?' mid':'');
  if(frac<=0){
    t.done=true;DN.streak=0;DN.lost++;$('dnStreak').textContent=0;
    $('dnFace').innerHTML=ART.face(DN.cust||0,'mad');$('dnFace').classList.add('mad');$('dnSay').textContent='Too slow! I’m out of here!';
    fx.pop({icon:'warning',text:'Customer left!',kind:'oops'});
    $('dnMsg').className='msg bad';$('dnMsg').textContent='They left hungry. Your streak reset.';
    dnRender();
    const my=runId;setTimeout(()=>{if(my===runId&&DN&&Date.now()<DN.tEnd)dnNext();},1400);
  }
}
function dnEnd(){
  const P=prof(),lv=DN.lv,rec=lvRec(P,'diner',lv),prev=rec.best;rec.plays++;
  const isBest=DN.coins>prev;if(isBest)rec.best=DN.coins;saveAll();
  cloudSubmit('diner',lv,DN.coins,{served:DN.served,lost:DN.lost,atoms:DN.atoms,streak:DN.bestStreak});
  showEnd({emoji:'plate',title:DN.served>=8?'Five-Star Chef!':DN.served>=4?'Great Shift!':'Keep Cooking!',big:`${DN.coins} coins`,sub:DN_LEVELS[lv][0],
    body:[isBest&&DN.coins>0?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,
      h('p',null,'Dishes served: ',h('b',null,DN.served),' · Customers who left: ',h('b',null,DN.lost),' · Best streak: ',h('b',null,DN.bestStreak)),
      h('p',null,'You rearranged ',h('b',null,DN.atoms),' atoms and didn’t lose a single one. That’s the law of conservation of matter!'),
      h('p',null,'Best for this shift: ',h('b',null,rec.best+' coins'))],
    again:()=>startDiner(lv),party:isBest&&DN.coins>0?'New high score!':null});
}
$('dnSmashAll').onclick=()=>{const t=DN&&DN.t;if(!t||t.done)return;t.smashed.forEach((v,i)=>{if(!v){t.smashed[i]=true;addC(t.tray,parseF(t.d.inst[i]));}});fx.pop({icon:'burst',text:'SMASH!',kind:'try'});dnRender();dnCheck();};
$('dnClear').onclick=dnClearPlate;
$('dnQuit').onclick=()=>{renderDinerSetup();show('s-diner-setup');};
document.addEventListener('keydown',e=>{
  if($('s-diner').hidden||!DN||!DN.t||DN.t.done||!$('modal').hidden||e.ctrlKey||e.metaKey||e.altKey)return;
  if(/^[1-9]$/.test(e.key)){const s=DN.t.order[+e.key-1];if(s){e.preventDefault();dnAdd(s,document.querySelector(`#dnTray .abtn[data-sym="${s}"]`));}}
  else if(e.key===' '){e.preventDefault();const i=DN.t.smashed.indexOf(false);if(i>=0)dnSmash(i,$('dnIngr').children[i]);}
  else if(e.key==='Backspace'){e.preventDefault();dnClearPlate();}
});

