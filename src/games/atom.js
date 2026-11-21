/* ================= GAME 4: ATOM BUILDER ("Hands-on atom", Session 8) =================
   Drag protons and neutrons into the nucleus and electrons onto shells (2, 8, 8, 8).
   Live element card (protons decide the element), mass number, charge, stability meter.
   Modes inside the same 3 levels: build it, mystery atom, fix the broken atom, ion factory.
   Bonus: Atom Rush (60 s, not graded) and shell stars (shells filled inside-out, not in the score).
   Contract kept: key 'atom', levels '1','2','3' (+ 'T' test), 10 per round, 3/2/1 points
   (3 − hints − misses, min 1), 2 hints, recordbest/cloudSubmit the same, TEST_SET.atom one check each. */
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
const atSgn=c=>c>0?'+'+c:String(c);
/* ---- round makers ---- */
function atMystery(q,clue){
  const A=q.Z+q.N,C=q.Z-q.E;
  const chips=clue==='an'?[`Mass number ${A}`,`${q.N} neutrons`,'Charge 0']:[`Mass number ${A}`,`Charge ${atSgn(C)}`,`${q.E} electrons`];
  return Object.assign({},q,{mode:'mystery',clue,chips,reveal:q.kind==='neutral'?`${BYSYM[q.sym].name}-${A}`:q.text,text:'Mystery atom',sub:'Use the clues to work out the protons, neutrons and electrons.'});
}
function atFix(q,errs){
  let p=q.Z,n=q.N,e=q.E;
  errs.forEach(t=>{
    if(t==='swap'&&n>0&&p<20){p++;n--;e++;return;}
    if(t==='p'||t==='swap'){const d=p>1&&Math.random()<.5?-1:1;p+=d;return;}
    if(t==='n'){const d=n>0&&Math.random()<.5?-1:1;n=Math.max(0,n+d*(n>2&&Math.random()<.35?2:1));return;}
    if(t==='e'){const d=e>0&&Math.random()<.5?-1:1;e+=d;}
  });
  if(p===q.Z&&n===q.N&&e===q.E)n+=1;
  const el=BYSYM[q.sym],A=q.Z+q.N;
  const sub=q.kind==='isotope'?`It should be ${el.name}-${A}: neutral, mass number ${A}. Something is wrong. Find it and fix it.`
    :q.kind==='ion'?`It should be ${q.text.replace(' ion','')}: mass number ${A}, charge ${atSgn(q.Z-q.E)}. Something is wrong.`
    :`It should be a neutral ${el.name.toLowerCase()} atom with mass number ${A}. Something is wrong. Find it and fix it.`;
  return Object.assign({},q,{mode:'fix',start:{p,n,e},reveal:q.text,text:`Fix this ${q.kind==='isotope'?q.text:el.name+' atom'}`,sub});
}
function atIon(q){
  const el=BYSYM[q.sym],C=q.Z-q.E;
  return Object.assign({},q,{mode:'ion',start:{p:q.Z,n:q.N,e:q.Z},reveal:q.text,text:`Make ${ionLabel(q.sym,C)}`,
    sub:`The ${el.name.toLowerCase()} atom is built. Add or take away electrons to give it a charge of ${atSgn(C)}.`});
}
function atomQueue(level){
  const mc=i=>i%2?'an':'ae';
  if(level==='1'){
    const qs=sample(EL.filter(e=>e.n<=10),ROUND_LEN).map(e=>makeAtomQ('neutral',e.sym)),f=sample(['p','n','e'],2);
    return qs.map((q,i)=>i<6?q:i<8?atFix(q,[f[i-6]]):atMystery(q,mc(i)));
  }
  if(level==='2'){
    const qs=sample(EL.filter(e=>e.n<=20),ROUND_LEN).map(e=>makeAtomQ('neutral',e.sym));
    const plan=['b','b','b','b','m','f','m','f','m','f'];let nf=0;
    return qs.map((q,i)=>plan[i]==='b'?q:plan[i]==='m'?atMystery(q,mc(i)):atFix(q,nf++===0?sample(['p','n','e'],1):sample(['p','n','e'],2)));
  }
  const io=sample(ION_SET,5).map(([s,c])=>makeAtomQ('ion',s,c)),is=sample(ISO_SET,5).map(([s,m])=>makeAtomQ('isotope',s,m));
  return [atIon(io[0]),is[0],atIon(io[1]),is[1],io[2],atFix(is[2],['swap']),io[3],atFix(is[3],['n']),atMystery(io[4],'ae'),atMystery(is[4],'ae')];
}
const ATLEVELS={'1':['Level 1: Neutral atoms','The first 10 elements'],'2':['Level 2: Bigger atoms','Elements 1–20'],'3':['Level 3: Ions & isotopes','Charged atoms and different masses']};
function renderAtomSetup(){
  const P=prof(),B=P.atomBonus||{};
  $('atLevels').replaceChildren(...Object.keys(ATLEVELS).map(l=>{
    const r=P.atom[l];
    return h('button',{class:'lvl',onclick:()=>startAtom(l)},h('b',null,ATLEVELS[l][0]),h('small',null,ATLEVELS[l][1]),
      h('span',{class:'bestline'},r&&r.plays?[I('medal'),`High score: ${r.best}/${ROUND_LEN*3}`,B[l]?`  ·  ★ ${B[l]}/${ROUND_LEN} shell stars`:'']:'No score yet'));
  }));
  $('atRushRow').replaceChildren(h('button',{class:'lvl atrushbtn',onclick:startAtomRush},h('b',null,'⚡ Atom Rush (bonus)'),
    h('small',null,'60 seconds. Build as many neutral atoms as you can. Just for fun: not graded.'),
    h('span',{class:'bestline'},P.atomRush?[I('medal'),`Best: ${P.atomRush} atoms`]:'No rush yet')));
}

/* ---- the board ---- */
const AT_CAPS=[2,8,8,8],AT_RAD=[95,143,191,239],ATC={x:310,y:270},AT_CAP={p:20,n:28,e:26},AT_PR=10.5,AT_SP=10.2;
const AT_SPIN=[16,24,32,40];
/* stable neutron counts for Z = 1..20 (everything else here is radioactive) */
const AT_STABLE={1:[0,1],2:[1,2],3:[3,4],4:[5],5:[5,6],6:[6,7],7:[7,8],8:[8,9,10],9:[10],10:[10,11,12],11:[12],12:[12,13,14],13:[14],14:[14,15,16],15:[16],16:[16,17,18,20],17:[18,20],18:[18,20,22],19:[20,22],20:[20,22,23,24,26,28]};
const atShellsFor=e=>{const s=[0,0,0,0];let l=e;for(let i=0;i<4;i++){s[i]=Math.min(AT_CAPS[i],l);l-=s[i];}return s;};
const atInOrder=sh=>sh.every((c,i)=>c>=AT_CAPS[i]||sh.slice(i+1).every(x=>!x));
const atSum=a=>a.reduce((x,y)=>x+y,0);
const AT_NM={p:'proton',n:'neutron',e:'electron'};
function atPart(k){
  if(k==='e')return `<circle r="13" fill="#5aa0ff" opacity=".22"/><circle r="8.6" fill="url(#atgE)" stroke="#cfe0ff" stroke-width=".8"/><ellipse cx="-2.6" cy="-3.2" rx="3.2" ry="2" fill="#fff" opacity=".75"/><path d="M-3.2 .6h6.4" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>`;
  if(k==='p')return `<circle r="${AT_PR}" fill="url(#atgP)" stroke="#7d1b17" stroke-opacity=".35" stroke-width=".8"/><ellipse cx="-3.4" cy="-4" rx="4" ry="2.5" fill="#fff" opacity=".55"/><path d="M-3.4 .8h6.8M0 -2.6v6.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`;
  return `<circle r="${AT_PR}" fill="url(#atgN)" stroke="#3b4458" stroke-opacity=".35" stroke-width=".8"/><ellipse cx="-3.4" cy="-4" rx="4" ry="2.5" fill="#fff" opacity=".7"/>`;
}
function atDefs(){
  if(document.getElementById('at-defs'))return;
  const d=document.createElementNS('http://www.w3.org/2000/svg','svg');d.id='at-defs';d.setAttribute('aria-hidden','true');
  d.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden');
  const g=(id,a,b,c)=>`<radialGradient id="${id}" cx=".5" cy=".5" r=".55" fx=".34" fy=".3"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
  d.innerHTML=`<defs>${g('atgP','#ffb3a6','#e8473d','#8f1f1a')}${g('atgN','#ffffff','#b4bccc','#5b657a')}${g('atgE','#c4dcff','#3a78ff','#1438a0')}
<radialGradient id="atgBg" cx=".55" cy=".5" r=".75"><stop offset="0" stop-color="#22306a"/><stop offset=".55" stop-color="#121a44"/><stop offset="1" stop-color="#0a0f2a"/></radialGradient>
<radialGradient id="atgCore" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd76a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient>
<filter id="atfGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  document.body.appendChild(d);
}
let atBuilt=false;
const atNodes={p:[],n:[],e:[[],[],[],[]]};
function atBuildBoard(){
  atDefs();
  if(atBuilt)return;atBuilt=true;
  const stars=[];for(let i=0;i<46;i++){const x=(i*137.5)%620,y=(i*89.3+31)%540;stars.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(i%3?.8:1.4)}" fill="#fff" opacity="${(.15+(i%5)*.08).toFixed(2)}"/>`);}
  const rings=AT_RAD.map((r,i)=>`<g class="atshell" data-shell="${i}"><circle class="atring" cx="${ATC.x}" cy="${ATC.y}" r="${r}"/><circle class="atringhit" data-shell="${i}" cx="${ATC.x}" cy="${ATC.y}" r="${r}"/></g>`).join('');
  const orbs=AT_RAD.map((r,i)=>`<g class="atorb" id="atOrb${i}" style="--spin:${AT_SPIN[i]}s"></g>`).join('');
  const labs=AT_RAD.map((r,i)=>`<g class="atslab" id="atSLab${i}" transform="translate(${ATC.x} ${ATC.y-r})"><rect x="-21" y="-10" width="42" height="20" rx="10"/><text y="4.5" text-anchor="middle">0/${AT_CAPS[i]}</text></g>`).join('');
  $('atStage').innerHTML=`<svg id="atSvg" viewBox="0 0 620 540" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Your atom">
${stars.join('')}
<circle cx="${ATC.x}" cy="${ATC.y}" r="90" fill="url(#atgCore)" class="atcore"/>
${rings}<circle id="atNucT" class="atnuct" cx="${ATC.x}" cy="${ATC.y}" r="60"/>
<g id="atNucWrap"><g id="atNuc" class="atnuc"></g></g>${orbs}
<text id="atEmpty" class="atempty" x="${ATC.x}" y="${ATC.y+5}" text-anchor="middle">Drag protons + neutrons here</text>
<g class="atslabs">${labs}</g></svg>`;
  ['p','n','e'].forEach(k=>{const s=document.querySelector(`.atheap[data-k="${k}"]`);
    const pts=k==='e'?[[-11,6],[11,6],[0,-6]]:[[-12,7],[0,7],[12,7],[-6,-4],[6,-4],[0,-14]];
    s.innerHTML=`<svg viewBox="-28 -28 56 50" aria-hidden="true">${pts.map(([x,y])=>`<g transform="translate(${x} ${y})">${atPart(k)}</g>`).join('')}</svg>`;});
}
const atSvg=()=>$('atSvg');
function atPt(cx,cy){const s=atSvg(),m=s.getScreenCTM();if(!m)return {x:0,y:0};const p=new DOMPoint(cx,cy).matrixTransform(m.inverse());return {x:p.x,y:p.y};}
function atScr(x,y){const m=atSvg().getScreenCTM();const p=new DOMPoint(x,y).matrixTransform(m);return {x:p.x,y:p.y};}
function atNucR(){const t=AT?AT.p+AT.n:0;return t?AT_SP*Math.sqrt(Math.max(0,t-1))+AT_PR:0;}
/* undo an orbit group's spin so a point lands where the pointer is */
function atUnrot(i,pt){
  const g=$('atOrb'+i),tr=getComputedStyle(g).transform;if(!tr||tr==='none')return pt;
  const m=new DOMMatrix(tr),a=-Math.atan2(m.b,m.a),dx=pt.x-ATC.x,dy=pt.y-ATC.y;
  return {x:ATC.x+dx*Math.cos(a)-dy*Math.sin(a),y:ATC.y+dx*Math.sin(a)+dy*Math.cos(a)};
}
function atMkNode(k,shell){
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','atpart');g.dataset.k=k;if(shell!=null)g.dataset.shell=shell;
  g.innerHTML=k==='e'?`<g class="atcr"><g class="atpin">${atPart(k)}</g></g>`:`<g class="atpin">${atPart(k)}</g>`;return g;
}
const atSetPos=(g,x,y)=>{g.style.transform=`translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;};
function atKill(g){
  const inn=g.querySelector('.atpin');
  if(Art.reduced()||!inn){g.remove();return;}
  g.style.pointerEvents='none';inn.classList.add('atbye');setTimeout(()=>g.remove(),240);
}
/* make the drawn particles match AT.p, AT.n and AT.sh; spawn = {k, shell, pt} for the newest one */
function atSync(spawn){
  const nuc=$('atNuc'),fresh=[];
  ['p','n'].forEach(k=>{
    const arr=atNodes[k],want=AT[k];
    while(arr.length>want)atKill(arr.pop());
    while(arr.length<want){const g=atMkNode(k);nuc.appendChild(g);arr.push(g);fresh.push(g);
      const sp=spawn&&spawn.k===k&&arr.length===want?spawn.pt:{x:ATC.x+(Math.random()-.5)*8,y:ATC.y+(Math.random()-.5)*8};atSetPos(g,sp.x,sp.y);}
  });
  /* nucleus: proportional p/n mix, sunflower packing, centre drawn last (on top) */
  const order=[];let a=0,b=0;const P=AT.p,N=AT.n;
  while(a<P||b<N){if(a<P&&(b>=N||a/P<=b/N)){order.push('p');a++;}else{order.push('n');b++;}}
  const idx={p:0,n:0},spots=[];
  order.forEach((k,i)=>{const r=i?AT_SP*Math.sqrt(i):0,t=i*2.39996;spots.push([atNodes[k][idx[k]++],ATC.x+r*Math.cos(t),ATC.y+r*Math.sin(t)]);});
  for(let i=AT_RAD.length-1;i>=0;i--){
    const arr=atNodes.e[i],want=AT.sh[i],og=$('atOrb'+i);
    while(arr.length>want)atKill(arr.pop());
    while(arr.length<want){const g=atMkNode('e',i);og.appendChild(g);arr.push(g);fresh.push(g);
      const oa=og.getAnimations?og.getAnimations()[0]:null;if(oa&&oa.currentTime!=null)g.firstElementChild.style.animationDelay=`-${(oa.currentTime%(AT_SPIN[i]*1000)).toFixed(0)}ms`;
      const sp=spawn&&spawn.k==='e'&&spawn.shell===i&&arr.length===want?atUnrot(i,spawn.pt):atUnrot(i,{x:ATC.x+AT_RAD[i]*Math.cos(-1.2),y:ATC.y+AT_RAD[i]*Math.sin(-1.2)});atSetPos(g,sp.x,sp.y);}
  }
  if(fresh.length){fresh[0].getBoundingClientRect();fresh.forEach(g=>g.querySelector('.atpin').classList.add('atborn'));}
  const lay=()=>{
    for(let i=spots.length-1;i>=0;i--){const [g,x,y]=spots[i];nuc.appendChild(g);atSetPos(g,x,y);}
    AT_RAD.forEach((R,i)=>{const arr=atNodes.e[i],c=arr.length;arr.forEach((g,k)=>{const t=-Math.PI/2+i*.5+k*2*Math.PI/Math.max(c,1);atSetPos(g,ATC.x+R*Math.cos(t),ATC.y+R*Math.sin(t));});});
  };
  if(fresh.length&&!Art.reduced())requestAnimationFrame(lay);else lay();
  const nr=atNucR();$('atNucT').setAttribute('r',Math.max(46,nr+22));
}
function atClearNodes(){
  ['p','n'].forEach(k=>{atNodes[k].forEach(g=>g.remove());atNodes[k]=[];});
  atNodes.e.forEach((arr,i)=>{arr.forEach(g=>g.remove());atNodes.e[i]=[];});
}
const atSay=t=>{const l=$('atLive');l.textContent='';setTimeout(()=>{l.textContent=t;},30);};

/* ---- state ---- */
let AT=null,atRushTimer=0;
function atShowScreen(test,rush){
  show('s-atom');const s=$('s-atom');s.classList.toggle('testing',!!test);s.classList.toggle('atrush',!!rush);
  $('atQuit').textContent=test?'Leave test':'Quit';
  $('atTimePill').hidden=!rush;$('atWorthPill').hidden=!!rush;$('atStarPill').hidden=!!(rush||test);
  $('atQLbl').textContent=rush?'Built':'Atom';$('atQOf').textContent=rush?'':'/10';
  atBuildBoard();
}
function startAtom(level){
  atStopRush();const test=tstOn('atom');
  AT={level,queue:test?TEST_SET.atom():atomQueue(level),i:0,score:0,stars:0,test,res:[],rush:false};
  atShowScreen(test,false);
  if(test)TST.finish=()=>{const right=AT.res.filter(Boolean).length;tstFinish(right/AT.queue.length*100,{right,n:AT.queue.length});};
  atRound();
}
function atRushQ(){const last=AT.queue.length?AT.queue[AT.queue.length-1].sym:'';let e;do{e=EL[Math.floor(Math.random()*20)];}while(e.sym===last);return Object.assign(makeAtomQ('neutral',e.sym),{mode:'rush'});}
function startAtomRush(){
  atStopRush();
  AT={level:'rush',queue:[],i:0,score:0,stars:0,test:false,res:[],rush:true,end:0};
  atShowScreen(false,true);AT.queue.push(atRushQ());atRound();
  AT.end=performance.now()+60000;$('atTime').textContent=60;
  atRushTimer=setInterval(()=>{
    if(!AT||!AT.rush||$('s-atom').hidden){atStopRush();return;}
    const left=Math.max(0,Math.ceil((AT.end-performance.now())/1000));$('atTime').textContent=left;
    $('atTimePill').classList.toggle('atlow',left<=10);
    if(left<=0)atRushEnd();
  },200);
}
function atStopRush(){if(atRushTimer){clearInterval(atRushTimer);atRushTimer=0;}}
const AT_MODE={build:'Build it',mystery:'Mystery atom',fix:'Fix the broken atom',ion:'Ion factory',rush:'Atom rush'};
function atTileFor(el,cls){
  if(!el)return h('div',{class:'etile atq '+(cls||'')},h('span',{class:'ts'},'?'),h('span',{class:'tnm'},'Mystery'));
  return h('div',{class:'etile '+(cls||''),style:`background:${CATS[el.cat][1]}`},h('span',{class:'tn'},el.n),h('span',{class:'ts'},el.sym),h('span',{class:'tnm'},el.name),h('span',{class:'tw'},el.mass.toFixed(3)));
}
function atRound(){
  if(AT.rush&&!AT.queue[AT.i])AT.queue.push(atRushQ());
  const q=AT.queue[AT.i],st=q.start||{p:0,n:0,e:0},mode=AT.test?'build':(q.mode||'build');
  atDisarm();atCancelDrag();
  Object.assign(AT,{q,mode,p:st.p,n:st.n,sh:atShellsFor(st.e),hints:0,wrong:0,done:false,lastZ:-1});
  AT.e=atSum(AT.sh);
  $('atQ').textContent=AT.rush?AT.score:AT.i+1;$('atScore').textContent=AT.score;$('atStars').textContent=AT.stars;
  const md=$('atMode');md.textContent=AT_MODE[mode];md.className='atmode m-'+mode;
  $('atPrompt').textContent=q.text;
  $('atSub').replaceChildren(mode==='mystery'?h('span',{class:'atchips'},q.chips.map(c=>h('span',{class:'atchip'},c))):q.sub);
  $('atTile').replaceChildren(atTileFor(mode==='mystery'?null:BYSYM[q.sym]));
  $('atHintBox').hidden=true;$('atMsg').textContent='';$('atMsg').className='msg';
  $('atNext').hidden=!AT.rush;$('atNext').textContent='Skip ▶';
  ['atCheck','atHint','atReset'].forEach(id=>$(id).disabled=false);
  $('atStage').classList.remove('atwin');
  atClearNodes();atSync(null);atRender();
}
function atRender(){
  const {p,n,sh}=AT,e=AT.e=atSum(sh),el=p>=1&&p<=20?EL[p-1]:null,ch=p-e;
  ['p','n','e'].forEach(k=>$('atv_'+k).textContent=AT[k]);
  /* live element card */
  const lc=$('atLiveCard');
  if(AT.lastZ!==p){const t=atTileFor(el,'atlt');if(!el){t.querySelector('.tnm').textContent=p?'Too big':'No protons';}
    lc.replaceChildren(t);if(AT.lastZ>=0&&!Art.reduced())t.classList.add('atflip');AT.lastZ=p;}
  $('atLiveCap').replaceChildren(p?h('span',null,h('b',null,`${p} proton${p===1?'':'s'}`),' = ',h('b',null,el?el.name:'?'),h('br'),h('small',null,'Protons decide the element.')):h('span',null,'Add protons to make an element.',h('br'),h('small',null,'Protons decide the element.')));
  $('atMass').replaceChildren(h('span',{class:'atnl'},'Mass number'),h('b',null,p+n),h('small',null,h('i',{class:'cp'},p+' p'),' + ',h('i',{class:'cn'},n+' n')));
  $('atCharge').replaceChildren(h('span',{class:'atnl'},'Charge'),h('b',{class:ch>0?'pos':ch<0?'neg':''},ch===0?'0':atSgn(ch)),h('small',null,h('i',{class:'cp'},p+' p'),' − ',h('i',{class:'ce'},e+' e')));
  atRenderStab();
  /* shells */
  const outer=sh.reduce((o,c,i)=>c?i:o,-1),ordered=atInOrder(sh);
  $('atShells').replaceChildren(...[h('span',{class:'atnl'},'Shells'),h('b',null,e?sh.filter(Boolean).join(' · '):'none'),
    e?h('small',null,`Outer shell: ${sh[outer]} electron${sh[outer]===1?'':'s'}`):null,
    e&&!ordered?h('span',{class:'atwarn'},'Fill inner shells first'):null].filter(Boolean));
  AT_RAD.forEach((r,i)=>{const lab=$('atSLab'+i);lab.querySelector('text').textContent=`${sh[i]}/${AT_CAPS[i]}`;lab.classList.toggle('full',sh[i]>=AT_CAPS[i]);lab.classList.toggle('some',sh[i]>0);});
  $('atEmpty').style.display=p+n?'none':'';
  $('atWorth').textContent=AT.done?0:Math.max(1,3-AT.hints-AT.wrong);
}
function atRenderStab(){
  const {p,n}=AT,box=$('atStab');
  if(!p){box.replaceChildren(h('span',{class:'atnl'},'Nucleus'),h('div',{class:'atstabtxt'},n?'Neutrons alone are not an atom.':'Empty.'));return;}
  const ok=AT_STABLE[p]||[],lo=ok[0],hi=ok[ok.length-1],stable=ok.includes(n);
  const min=Math.max(0,lo-4),max=hi+4,pc=v=>Math.max(0,Math.min(100,(v-min)/(max-min)*100));
  const label=stable?'Stable nucleus':n<lo?'Radioactive: too few neutrons':n>hi?'Radioactive: too many neutrons':'Radioactive: unstable mix';
  const bar=h('div',{class:'atstabbar'},h('i',{class:'band',style:`left:${pc(lo-.5)}%;width:${pc(hi+.5)-pc(lo-.5)}%`}),h('i',{class:'needle',style:`left:${pc(n)}%`}));
  box.replaceChildren(h('span',{class:'atnl'},'Stability'),h('div',{class:'atstabtxt '+(stable?'ok':'bad')},stable?'✓ ':'⚠ ',label),bar,
    h('div',{class:'atstabends'},h('span',null,'fewer neutrons'),h('span',null,'more neutrons')));
}
function atChanged(){
  if(!AT)return;AT.e=atSum(AT.sh);
  if(!AT.rush&&$('atMsg').className.includes('bad')){$('atMsg').textContent='';$('atMsg').className='msg';}
  atRender();
  if(AT.rush&&!AT.done){const q=AT.q;if(AT.p===q.Z&&AT.n===q.N&&AT.e===q.E)atRushHit();}
}
/* ---- add / remove ---- */
function atFirstOpen(){for(let i=0;i<4;i++)if(AT.sh[i]<AT_CAPS[i])return i;return -1;}
function atAdd(k,pt,shell){
  if(!AT||AT.done)return false;
  if(k==='e'){
    if(shell==null)shell=atFirstOpen();
    if(shell<0||AT.e>=AT_CAP.e){atSay('No more room for electrons.');return false;}
    if(AT.sh[shell]>=AT_CAPS[shell]){atFull(shell);return false;}
    AT.sh[shell]++;atSync({k,shell,pt:pt||atBinPt('e')});
  }else{
    if(AT[k]>=AT_CAP[k]){atSay(`That's the most ${AT_NM[k]}s in this game.`);$('atMsg').className='msg';$('atMsg').textContent=`That's the most ${AT_NM[k]}s in this game (${AT_CAP[k]}).`;return false;}
    AT[k]++;atSync({k,pt:pt||atBinPt(k)});
    const w=$('atNucWrap');w.classList.remove('atjig');void w.getBoundingClientRect();w.classList.add('atjig');
  }
  atChanged();return true;
}
function atFull(i){
  const ring=document.querySelector(`.atshell[data-shell="${i}"]`);ring.classList.remove('atno');void ring.getBoundingClientRect();ring.classList.add('atno');
  setTimeout(()=>ring.classList.remove('atno'),600);
  const t=`Shell ${i+1} is full. It holds only ${AT_CAPS[i]} electrons.`;atSay(t);
  if(!AT.test){$('atMsg').className='msg';$('atMsg').textContent=t;}
}
function atRemove(k,node){
  if(!AT||AT.done)return;
  if(k==='e'){
    let i=node?+node.dataset.shell:AT.sh.reduce((o,c,j)=>c?j:o,-1);if(i<0)return;
    const arr=atNodes.e[i];const at=node?arr.indexOf(node):arr.length-1;if(at<0)return;
    const [g]=arr.splice(at,1);AT.sh[i]--;atKill(g);
  }else{
    if(!AT[k])return;const arr=atNodes[k],at=node?arr.indexOf(node):arr.length-1;
    const [g]=arr.splice(at<0?arr.length-1:at,1);AT[k]--;atKill(g);
  }
  atSync(null);atChanged();
}
function atBinPt(k){const b=document.querySelector(`.atbin[data-k="${k}"]`).getBoundingClientRect();return atPt(b.left+b.width/2,b.top+b.height/2);}
/* where would particle k land at svg point pt? -> {kind:'nuc'} | {kind:'shell',i} | null */
function atTargetAt(k,pt){
  const d=Math.hypot(pt.x-ATC.x,pt.y-ATC.y);
  if(k!=='e')return d<Math.max(70,atNucR()+34)?{kind:'nuc'}:null;
  let best=-1,bd=1e9;AT_RAD.forEach((r,i)=>{const dd=Math.abs(d-r);if(dd<bd){bd=dd;best=i;}});
  return bd<25&&d>66?{kind:'shell',i:best}:null;
}
/* ---- pointer: drag from bins, drag particles out, tap-to-place ---- */
let atDrag=null;
function atHot(k,t,fromShell){
  document.querySelectorAll('#atSvg .atshell').forEach(s=>s.classList.remove('hot','hotno'));
  $('atNucT').classList.remove('hot');
  if(!t)return;
  if(t.kind==='nuc'){$('atNucT').classList.add('hot');return;}
  const ok=AT.sh[t.i]<AT_CAPS[t.i]||fromShell===t.i;
  document.querySelector(`#atSvg .atshell[data-shell="${t.i}"]`).classList.add(ok?'hot':'hotno');
}
function atShowTargets(k,on){
  $('atStage').classList.toggle('atdrag-e',on&&k==='e');$('atStage').classList.toggle('atdrag-pn',on&&k!=='e');
}
function atGhost(k,x,y){
  const g=document.createElement('div');g.className='atghost';
  const m=atSvg().getScreenCTM(),s=(m?m.a:1)*30;
  g.style.width=g.style.height=s+'px';g.innerHTML=`<svg viewBox="-15 -15 30 30">${atPart(k)}</svg>`;
  document.body.appendChild(g);g._s=s;atMoveGhost(g,x,y);return g;
}
function atMoveGhost(g,x,y){g.style.transform=`translate(${x-g._s/2}px,${y-g._s/2}px) scale(1.12)`;}
function atCancelDrag(){if(atDrag){if(atDrag.ghost)atDrag.ghost.remove();if(atDrag.node)atDrag.node.style.opacity='';atDrag=null;}if(AT){atHot();atShowTargets(null,false);}}
function atDisarm(){
  if(!AT)return;AT.armed=null;document.querySelectorAll('.atbin').forEach(b=>b.classList.remove('armed'));
  if($('atStage'))$('atStage').classList.remove('atarmed');atHot();
}
function atArm(mode){
  AT.armed=mode;AT.keyShell=Math.max(0,atFirstOpen());
  document.querySelector('.atbin[data-k="e"]').classList.add('armed');$('atStage').classList.add('atarmed');
  if(mode==='key'){atHot('e',{kind:'shell',i:AT.keyShell});atSay(`Electron picked up. Shell ${AT.keyShell+1}: ${AT.sh[AT.keyShell]} of ${AT_CAPS[AT.keyShell]}. Arrow keys choose a shell, Enter places it, Escape stops.`);}
  else atSay('Electron picked up. Tap a shell to place it. Tap the bin again to stop.');
}
function atBoardDown(e){
  if(!AT||AT.done||(e.button||0)>0)return;
  if(e.target.closest('.atout'))return;
  const bin=e.target.closest('.atbin'),inSvg=e.target.closest('#atSvg');
  if(bin){
    e.preventDefault();atDrag={k:bin.dataset.k,from:'bin',x0:e.clientX,y0:e.clientY,pid:e.pointerId,moved:false};
    try{bin.setPointerCapture(e.pointerId);}catch(_){}return;
  }
  if(!inSvg)return;
  const pt=atPt(e.clientX,e.clientY);
  if(AT.armed){e.preventDefault();const t=atTargetAt('e',pt);if(t)atAdd('e',pt,t.i);return;}
  const part=e.target.closest('.atpart');
  if(part&&!part.querySelector('.atbye')){
    e.preventDefault();atDrag={k:part.dataset.k,from:'atom',node:part,shell:part.dataset.shell!=null?+part.dataset.shell:null,x0:e.clientX,y0:e.clientY,pid:e.pointerId,moved:false};
    try{inSvg.setPointerCapture(e.pointerId);}catch(_){}
  }
}
function atBoardMove(e){
  const d=atDrag;if(!d||e.pointerId!==d.pid)return;
  if(!d.moved){if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<6)return;d.moved=true;d.ghost=atGhost(d.k,e.clientX,e.clientY);
    if(d.node)d.node.style.opacity='.2';atShowTargets(d.k,true);if(AT.armed)atDisarm();}
  atMoveGhost(d.ghost,e.clientX,e.clientY);
  atHot(d.k,atTargetAt(d.k,atPt(e.clientX,e.clientY)),d.shell);
}
function atBoardUp(e){
  const d=atDrag;if(!d||e.pointerId!==d.pid)return;atDrag=null;
  if(!d.moved){
    if(d.from==='bin'){if(d.k==='e'){AT.armed?atDisarm():atArm('tap');}else atAdd(d.k);}
    else atRemove(d.k,d.node);
    return;
  }
  const pt=atPt(e.clientX,e.clientY),t=atTargetAt(d.k,pt),gh=d.ghost;
  atHot();atShowTargets(d.k,false);
  const home=()=>{const b=document.querySelector(`.atbin[data-k="${d.k}"]`).getBoundingClientRect();
    return Art.to(gh,{transform:`translate(${b.left+b.width/2-gh._s/2}px,${b.top+b.height/2-gh._s/2}px) scale(.5)`,opacity:'0'},{dur:280,ease:'inOutCubic'}).then(()=>gh.remove());};
  if(d.from==='bin'){
    if(t&&(t.kind==='nuc'||AT.sh[t.i]<AT_CAPS[t.i])){gh.remove();atAdd(d.k,pt,t.kind==='shell'?t.i:null);}
    else{if(t&&t.kind==='shell')atFull(t.i);home();}
    return;
  }
  /* dragged a particle that was already in the atom */
  if(d.k!=='e'){
    if(t){gh.remove();d.node.style.opacity='';return;}
    d.node.style.opacity='';home();atRemove(d.k,d.node);return;
  }
  if(t&&t.i===d.shell){gh.remove();d.node.style.opacity='';return;}
  if(t&&AT.sh[t.i]<AT_CAPS[t.i]){
    gh.remove();const arr=atNodes.e[d.shell],at=arr.indexOf(d.node);if(at>=0){arr.splice(at,1);d.node.remove();AT.sh[d.shell]--;}
    AT.sh[t.i]++;atSync({k:'e',shell:t.i,pt});atChanged();return;
  }
  if(t)atFull(t.i);
  d.node.style.opacity='';home();atRemove('e',d.node);
}
function atBinClick(e){
  const out=e.target.closest('.atout');
  if(out){atDisarm();atRemove(out.dataset.k);return;}
  const bin=e.target.closest('.atbin');if(!bin||e.detail>0||!AT||AT.done)return;   /* keyboard only: pointer is handled above */
  const k=bin.dataset.k;
  if(k!=='e'){atAdd(k);atSay(`${AT[k]} ${AT_NM[k]}${AT[k]===1?'':'s'}.`);return;}
  if(AT.armed!=='key'){atArm('key');return;}
  if(atAdd('e',null,AT.keyShell))atSay(`Placed. Shell ${AT.keyShell+1}: ${AT.sh[AT.keyShell]} of ${AT_CAPS[AT.keyShell]}.`);
  atHot('e',{kind:'shell',i:AT.keyShell});
}
function atKey(e){
  if(!AT||$('s-atom').hidden||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.target.closest&&e.target.closest('input,textarea,select'))return;
  if(e.key==='Escape'&&(AT.armed||atDrag)){atCancelDrag();atDisarm();atSay('Stopped.');return;}
  if(AT.armed==='key'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
    e.preventDefault();const dir=e.key==='ArrowUp'||e.key==='ArrowRight'?1:-1;AT.keyShell=(AT.keyShell+dir+4)%4;
    atHot('e',{kind:'shell',i:AT.keyShell});atSay(`Shell ${AT.keyShell+1}: ${AT.sh[AT.keyShell]} of ${AT_CAPS[AT.keyShell]}.`);return;
  }
  const k=e.key.toLowerCase();if(AT.done||!['p','n','e'].includes(k))return;
  e.preventDefault();atDisarm();
  if(e.shiftKey)atRemove(k);else atAdd(k);
}
$('atBoard').addEventListener('pointerdown',atBoardDown,{passive:false});
window.addEventListener('pointermove',e=>{if(atDrag)atBoardMove(e);},{passive:true});
window.addEventListener('pointerup',e=>{if(atDrag)atBoardUp(e);});
window.addEventListener('pointercancel',e=>{if(atDrag&&e.pointerId===atDrag.pid)atCancelDrag();});
$('atBins').addEventListener('click',atBinClick);
document.addEventListener('keydown',atKey);
document.addEventListener('pointerdown',e=>{if(AT&&AT.armed==='tap'&&!e.target.closest('#atBoard'))atDisarm();});
/* scripted play and old callers: atChange('p',1), atChange('e',-1) */
function atChange(k,d){if(!AT||AT.done)return;for(let i=0;i<Math.abs(d);i++)d>0?atAdd(k):atRemove(k);}

/* ---- check, hints, results ---- */
$('atReset').onclick=()=>{
  if(!AT||AT.done)return;atDisarm();const st=AT.q.start&&!AT.test?AT.q.start:{p:0,n:0,e:0};
  AT.p=st.p;AT.n=st.n;AT.sh=atShellsFor(st.e);atSync(null);atChanged();
};
function atHint1(){
  const q=AT.q,m=AT.mode;
  if(m==='mystery')return q.clue==='an'?'Protons = mass number − neutrons. A charge of 0 means electrons = protons.':'Protons = electrons + charge. Then neutrons = mass number − protons.';
  if(m==='fix')return 'Compare your element card with the name you need. Check protons first, then the mass number, then the charge.';
  if(m==='ion'||q.kind==='ion')return 'Charge = protons − electrons. A + charge means electrons were lost. A − charge means electrons were gained.';
  if(q.kind==='isotope')return 'The number after the name is the mass number. Neutrons = mass number − protons. Neutral means electrons = protons.';
  return 'Protons = the atomic number on the card. Mass number = the atomic mass, rounded. Neutrons = mass number − protons. Neutral means electrons = protons.';
}
$('atHint').onclick=()=>{
  if(!AT||AT.done||AT.hints>=2||AT.rush)return;AT.hints++;const q=AT.q,b=$('atHintBox');b.hidden=false;
  b.textContent=AT.hints===1?atHint1():`Answer: ${q.Z} protons, ${q.N} neutrons, ${q.E} electrons.`;
  if(AT.hints>=2)$('atHint').disabled=true;atRender();
};
function atFlash(sel){document.querySelectorAll(sel).forEach(x=>{x.classList.remove('atno');void x.getBoundingClientRect();x.classList.add('atno');setTimeout(()=>x.classList.remove('atno'),650);});}
$('atCheck').onclick=()=>{
  if(!AT||AT.done||AT.rush)return;atDisarm();const q=AT.q,m=$('atMsg');
  const ok=AT.p===q.Z&&AT.n===q.N&&AT.e===q.E;
  if(AT.test){AT.res.push(ok);AT.done=true;tstSaved();AT.i++;
    setTimeout(()=>{if(!AT||!AT.test)return;if(AT.i>=AT.queue.length)return TST&&TST.finish();atRound();},300);return;}
  if(ok)return atSuccess();
  AT.wrong++;m.className='msg bad';fx.pop({icon:'burst',text:'Almost!',kind:'oops'});
  const el=AT.p>=1&&AT.p<=20?EL[AT.p-1]:null,need=BYSYM[q.sym],C=q.Z-q.E,ch=AT.p-AT.e;
  if(AT.p!==q.Z){
    m.textContent=AT.mode==='mystery'?(q.clue==='an'?'Not that element yet. Protons = mass number − neutrons.':'Not that element yet. Protons = electrons + charge.')
      :el?`Your card says ${el.name}, not ${need.name}. Protons decide the element!`:'Check the protons. What does the atomic number say?';
    atFlash('#atNucT');Art.shake($('atLiveCard'));
  }else if(AT.n!==q.N){
    m.textContent=`Right element! Now the neutrons: mass number − protons.${q.kind==='neutral'&&AT.mode!=='mystery'?' Round the atomic mass on the card to get the mass number.':''}`;
    atFlash('#atNucT');Art.shake($('atMass'));
  }else{
    m.textContent=C===0?'Nice! Now the electrons. A neutral atom has as many electrons as protons.':`Nearly! Charge = protons − electrons. Yours is ${ch===0?'0':atSgn(ch)}. It needs ${atSgn(C)}.`;
    atFlash('#atSvg .atshell');Art.shake($('atCharge'));
  }
  atRender();
};
function atWinFx(big){
  $('atStage').classList.add('atwin');
  const c=atScr(ATC.x,ATC.y);Art.burst(c.x,c.y,{n:big?34:16,colors:['#ffd23f','#ff8a7a','#8fb8ff','#fff'],shape:['star','dot'],speed:big?300:200,gravity:200});
  if(big)Art.pop($('atLiveCard'),1.12);
}
function atSuccess(){
  AT.done=true;const pts=Math.max(1,3-AT.hints-AT.wrong);AT.score+=pts;
  const star=AT.e>0&&atInOrder(AT.sh);if(star)AT.stars++;
  $('atScore').textContent=AT.score;$('atStars').textContent=AT.stars;
  atWinFx(true);fx.pop({icon:'atom',text:'Atom built! +'+pts,kind:'great',size:'big'});fx.confetti(pts===3?80:45);
  if(AT.mode==='mystery')$('atTile').replaceChildren(atTileFor(BYSYM[AT.q.sym],'atflip'));
  if(star)setTimeout(()=>{if(!AT||AT.rush)return;Art.pop($('atStarPill'),1.25);Art.sparkle&&Art.sparkle($('atStarPill'));},500);
  const outer=AT.sh.reduce((o,c,i)=>c?i:o,-1);
  const m=$('atMsg');m.className='msg good';
  m.replaceChildren(...[h('b',null,`${AT.mode==='mystery'?'It was '+AT.q.reveal:AT.q.reveal||AT.q.text}${AT.mode==='mystery'?'!':' built!'} +${pts} pt${pts===1?'':'s'}`),h('br'),
    star?h('span',{class:'atstarline'},`★ Shell star! Inner shells filled first. Outer shell: ${AT.sh[outer]} valence electron${AT.sh[outer]===1?'':'s'}.`)
      :AT.e?h('span',{class:'atnostar'},'No shell star this time: fill the inner shells first.'):null].filter(Boolean));
  ['atCheck','atHint','atReset'].forEach(id=>$(id).disabled=true);atDisarm();
  $('atNext').textContent=AT.i+1>=AT.queue.length?'See my results ▶':'Next ▶';$('atNext').hidden=false;$('atNext').focus({preventScroll:true});
  $('atWorth').textContent=0;
}
function atRushHit(){
  AT.done=true;AT.score++;$('atScore').textContent=AT.score;$('atQ').textContent=AT.score;
  atWinFx(false);fx.pop({icon:'atom',text:`${AT.q.text.replace(' atom','')}! +1`,kind:'great'});
  setTimeout(()=>{if(!AT||!AT.rush||$('s-atom').hidden)return;AT.i++;atRound();},Art.reduced()?150:520);
}
function atRushEnd(){
  atStopRush();if(!AT||!AT.rush)return;atCancelDrag();atDisarm();AT.done=true;
  const P=prof(),prev=P.atomRush||0,isBest=AT.score>prev;if(isBest)P.atomRush=AT.score;saveAll();
  const n=AT.score;
  showEnd({emoji:'atom',title:n>=8?'Atom Rush Legend!':n>=4?'Speedy Builder!':'Keep Rushing!',big:`${n} atom${n===1?'':'s'}`,sub:'Atom Rush · 60 seconds (bonus, not graded)',
    body:[isBest&&n?h('div',{class:'newbest'},I('sparkle'),'NEW RUSH RECORD!'):null,h('p',null,'Best rush: ',h('b',null,P.atomRush||0),' atoms')],
    again:startAtomRush,party:isBest&&n?'New rush record!':null});
}
$('atNext').onclick=()=>{
  if(!AT)return;
  if(AT.rush){if(AT.done)return;AT.i++;atRound();return;}
  AT.i++;if(AT.i>=AT.queue.length)return atEnd();atRound();
};
$('atQuit').onclick=()=>{atStopRush();atCancelDrag();if(AT&&AT.test)return tstQuit();goMenu();};
function atEnd(){
  const P=prof(),rec=atRec(P,AT.level),prev=rec.best;rec.plays++;const isBest=AT.score>prev;if(isBest)rec.best=AT.score;
  P.atomBonus=P.atomBonus||{};const bonusBest=AT.stars>(P.atomBonus[AT.level]||0);if(bonusBest)P.atomBonus[AT.level]=AT.stars;
  saveAll();
  cloudSubmit('atom',AT.level,AT.score,{n:AT.queue.length});
  const max=AT.queue.length*3;
  showEnd({emoji:'atom',title:AT.score>=max*.8?'Atom Architect!':AT.score>=max*.5?'Great Building!':'Keep Building!',big:`${AT.score}/${max}`,sub:ATLEVELS[AT.level][0],
    body:[isBest?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,h('p',null,'High score here: ',h('b',null,rec.best)),
      h('p',{class:'atendstars'},h('span',{class:'atstar'},'★'),` Shell stars: ${AT.stars}/${AT.queue.length}`,bonusBest&&AT.stars?' (new best!)':''),
      h('div',{class:'tchips'},AT.queue.map(q=>h('span',{class:'tchip'},q.reveal||q.text)))],
    again:()=>startAtom(AT.level),party:isBest?'New high score!':(AT.score>=max*.7?'Great building!':null)});
}
