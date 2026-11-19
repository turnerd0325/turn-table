/* ================= SUBJECT GAMES: wiring into menu, dashboard, profiles, badges, feedback, live quiz ================= */
NG_ORDER.forEach(k=>{const d=NGS[k];GAME_NAMES[d.key]=d.name;SW_GAMES.push([d.key,d.name]);});
DEFAULT_OFF.push(...NG_ORDER);   /* new games start locked until a teacher opens them */
/* profiles: every star game needs its own record */
(function(){const f0=fixProfile,n0=newProfile;
  fixProfile=function(P){f0(P);NEWG.forEach(g=>{P[g.key]=P[g.key]||{};});return P;};
  newProfile=function(...a){return fixProfile(n0(...a));};
  Object.keys(profiles).forEach(k=>fixProfile(profiles[k]));})();
/* feedback form: the new games can be named too (the server list matches) */
(function(){const at=FB_GAMES.findIndex(x=>x[0]==='class');FB_GAMES.splice(at<0?FB_GAMES.length:at,0,...NG_ORDER.map(k=>[k,NGS[k].name]));})();
/* ranks are about all of science now, not just chemistry */
BD_RANKS.forEach(r=>{if(r[1]==='Chemist')r[1]='Scientist';if(r[1]==='Senior chemist')r[1]='Senior scientist';});
Object.assign(BD_G,{
  leaf:`<path d="M-16,16 C-18,-8 0,-20 18,-18 C18,2 6,18 -16,16 Z" ${bdS}/><line x1="-14" y1="14" x2="8" y2="-8" ${bdS}/>`,
  mtn:`<polyline points="-22,16 -6,-12 2,0 10,-14 24,16 -22,16" ${bdS}/><polyline points="-10,-5 -6,-12 -2,-6" ${bdS}/>`,
  rocket:`<path d="M0,-22 C10,-12 10,2 6,12 H-6 C-10,2 -10,-12 0,-22 Z" ${bdS}/><circle cy="-6" r="4" ${bdS}/><path d="M-6,8 L-14,18 M6,8 L14,18" ${bdS}/>`
});
const ngSubjSolved=(P,s)=>SUBJ_GAMES[s].filter(k=>NGS[k]).reduce((a,k)=>a+bdSolved(P,k,NGS[k].n),0);
BADGES.splice(BADGES.findIndex(b=>b.id==='thinker'),0,
  {id:'life',fam:'m',name:'Life scientist',g:'leaf',th:[1,8,20,36],val:P=>ngSubjSolved(P,'life'),d:v=>`Solve ${v} Life Science level${v>1?'s':''}`},
  {id:'earth',fam:'m',name:'Earth explorer',g:'mtn',th:[1,8,20,36],val:P=>ngSubjSolved(P,'earth'),d:v=>`Solve ${v} Earth & Space level${v>1?'s':''}`},
  {id:'force',fam:'m',name:'Force master',g:'rocket',th:[1,8,20,36],val:P=>ngSubjSolved(P,'phys'),d:v=>`Solve ${v} levels in the newest Physics games`});
/* the hint pop-up closes and reopens like the other star games */
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#ngHint'))document.querySelectorAll('.hintfloat').forEach(x=>{x.dataset.closed='';});},true);

/* ---- Live Quiz: one class game per subject ---- */
(function(){const g0=genLiveQs;genLiveQs=function(n,mix){return LQ_BANK[mix]?lqSubjectQs(mix,n):g0(n,mix);};
  const sel=$('tlMix');if(sel){sel.replaceChildren(
    h('optgroup',{label:'Chemistry'},h('option',{value:'mixed',selected:true},'Chemistry: mixed'),h('option',{value:'find'},'Chemistry: find it on the table'),h('option',{value:'quiz'},'Chemistry: quiz questions')),
    h('optgroup',{label:'Other subjects'},h('option',{value:'phys'},'Physics'),h('option',{value:'life'},'Life Science'),h('option',{value:'earth'},'Earth & Space')));
    const lab=document.querySelector('label[for="tlMix"]');if(lab)lab.textContent='Subject';}})();

/* ---- subject menu ---- */
let menuSubj=null;try{menuSubj=sessionStorage.getItem('tt_subj')||null;}catch(e){}
function setSubj(s){menuSubj=s;try{s?sessionStorage.setItem('tt_subj',s):sessionStorage.removeItem('tt_subj');}catch(e){}}
$('btnHome').onclick=()=>{setSubj(null);goMenu();};
$('brand').onclick=()=>{setSubj(null);me?goMenu():show('s-login');};
$('btnLogout').addEventListener('click',()=>setSubj(null));
function subjStats(P,s){const ks=SUBJ_GAMES[s],open=ks.filter(k=>!gameLocked(k)).length;let st=0,mx=0;
  ks.forEach(k=>{const n=k==='sep'?SEP_LEVELS.length:NEWGK[k]?NEWGK[k].n:0;if(n){st+=gameStars(P,k,n);mx+=n*3;}});return {open,n:ks.length,st,mx};}
renderMenu=function(){
  try{$('btnLogout').textContent=isPreview()?'Exit preview':'Log out';}catch(e){}
  const P=prof(),S=menuSubj&&SUBJECTS.find(s=>s.id===menuSubj);
  $('menuHello').textContent=S?`${S.name}`:`Hi, ${P.name}! Pick a subject`;
  $('menuSub').textContent=S?S.desc+' Pick a game!':(P.cinfo&&P.cinfo.name?`${P.cinfo.teacher}'s class: ${P.cinfo.name}. Pick a subject, then a game.`:'Pick a subject, then a game. Show what you know!');
  try{bdStrip();bdCheck();}catch(e){}
  $('bdStrip').hidden=!!S;
  const sb=Object.values(P.speed).map(r=>r.best).filter(x=>x!=null),ab=Object.values(P.atom).map(r=>r.best).filter(x=>x>0);
  const mc=(cls,ic,title,desc,best,fn)=>{const art=h('div',{class:'art'});art.innerHTML=ART.thumb(ic);
    const locked=gameLocked(ic),sd=SHORT_DESC[ic]||desc;
    const tip=h('div',{class:'tip'});
    if(locked){tip.append(h('div',{class:'lk'},I('lock'),'Locked for now'));}
    tip.append(sd);art.append(tip);
    if(locked)art.append(h('div',{class:'lockbadge'},I('lock')));
    const btn=h('button',{class:'mcard '+cls+(locked?' locked':''),title:(locked?'Locked for now. ':'')+sd,'aria-label':title+(locked?' (locked for now). ':'. ')+sd,
      onclick:locked?(()=>fx.pop({icon:'lock',text:'Locked for now. Ask your teacher!',kind:'try',at:btn})):(()=>ttGate(ic,fn))},art,
      h('div',{class:'body'},h('b',null,title,STD[ic]?h('i',{class:'stdchip'+(STD[ic][1]?' sup':''),title:STD[ic][1]?'Helps you get ready for '+STD[ic][0]+'.':'NY science standard '+STD[ic][0]},STD[ic][0]):null),h('span',null,desc),locked?h('div',{class:'best lockedpill'},'Locked for now'):(best?h('div',{class:'best'},best):null)));
    return btn;};
  const cards={
    speed:()=>mc('m1','speed','Speed Find','Find elements by name, number, group or family. Beat your best average time!',sb.length?'Best avg: '+fmtT(Math.min(...sb)):'',()=>{renderSpeedSetup();show('s-speed-setup');}),
    trivia:()=>mc('m2','trivia','Element Trivia','Guess the mystery element from 4 hints. Fewer hints = more points!',P.trivia.plays?`High score: ${P.trivia.best}/${ROUND_LEN*4}`:'',startTrivia),
    explore:()=>mc('m4','explore','Explore the Table','Click any element to learn about it. No score, just discovery.','',startExplore),
    lab:()=>mc('m3','lab','Compound Lab','Build real compounds like H₂O by combining atoms from the table.',P.lab.plays?`High score: ${P.lab.best}/${ROUND_LEN*3}`:'',startLab),
    atom:()=>mc('m6','atom','Atom Builder','Add protons, neutrons and electrons to build atoms, ions and isotopes.',ab.length?`High score: ${Math.max(...ab)}/${ROUND_LEN*3}`:'',()=>{renderAtomSetup();show('s-atom-setup');}),
    balance:()=>mc('m7','balance','Balance It','Balance chemical equations to show that atoms are never lost.',P.balance.plays?`High score: ${P.balance.best}/${ROUND_LEN*3}`:'',startBalance),
    diner:()=>mc('m9','diner','Atom Diner','Smash ingredients into atoms and rebuild them into dishes before customers lose patience!',dnBestLine(P),()=>{renderDinerSetup();show('s-diner-setup');}),
    sep:()=>mc('m10','sep','Separation Station','Build a factory line of magnets, sieves, filters, funnels and stills to split mixtures apart.',sepStars(P)?`${sepStars(P)}/${SEP_LEVELS.length*3} stars`:'',()=>{renderSepSetup();show('s-sep-setup');}),
    laser:()=>mc('m11','laser','Laser Maze','Bounce a laser off mirrors, through glass and around walls to light every crystal.',starLine(P,'laser',LZ_N),()=>{renderLaserSetup();show('s-laser-setup');}),
    blackout:()=>mc('m12','blackout','Blackout!','The city has gone dark! Wire batteries, bulbs and switches to bring the lights back.',starLine(P,'blackout',BO_N),()=>{renderBlackoutSetup();show('s-blackout-setup');}),
    evidence:()=>mc('m13','evidence','Evidence Lab','Run tests on mystery samples and name each one. Fewer tests earns a higher detective rank.',starLine(P,'evidence',EV_N),()=>{renderEvidenceSetup();show('s-evidence-setup');}),
    coaster:()=>mc('m14','coaster','Coaster Architect','Design a roller coaster. Watch potential energy turn into kinetic energy as the cart rolls.',starLine(P,'coaster',CA_N),()=>{renderCoasterSetup();show('s-coaster-setup');})
  };
  NG_ORDER.forEach(k=>{const d=NGS[k];cards[k]=()=>mc('mng m-'+d.subj,k,d.name,d.menuDesc,starLine(P,k,d.n),()=>ngSetup(k));});
  const join=()=>mc('m8','class','Join a Class Game','Your teacher is running a live game? Enter the code and join!','',openLiveJoin);
  const tail=[mc('m5','stats','My Profile','See your badges, rank, best scores and the levels you have solved.','',()=>{renderStats();show('s-stats');}),
    mc('m15','feedback','Feedback','Have an idea to make a game better? Send your teacher a serious recommendation.','',()=>{renderFeedback();show('s-feedback');})];
  const preview=isPreview()?[h('div',{class:'ownernote tpnote'},h('b',null,'Teacher preview. '),'Every game is open for you, including Pre-Test and Post-Test practice. Nothing here is saved to a class. ',h('button',{class:'btn sm ghost',type:'button',onclick:openDash},'Back to my dashboard'))]:[];
  const owner=!isPreview()&&isOwner()&&classOff().length?[h('div',{class:'ownernote'},'Owner view: all games are open for you. Your class currently has '+classOff().length+' game'+(classOff().length===1?'':'s')+' switched off.')]:[];
  const note=h('div',{class:'stdnote'},'Tags show the NY science standard each game practices. A dashed tag means the game helps you get ready for that standard.');
  if(S){
    const st=subjStats(P,S.id);
    ngRC($('menuGrid'),...preview,
      h('div',{class:'subjbar',style:`--c1:${S.c1};--c2:${S.c2}`},ngBtn('← All subjects',()=>{setSubj(null);renderMenu();window.scrollTo(0,0);},'ghost sm'),
        h('span',{class:'subjsym'},S.sym),h('div',null,h('b',null,S.name),h('small',null,`${st.n} games${st.mx?` · ${st.st}/${st.mx} ★`:''}`))),
      join(),...SUBJ_GAMES[S.id].map(k=>cards[k]()),
      S.more?h('div',{class:'mcard soon',style:`--c1:${S.c1};--c2:${S.c2}`},h('div',{class:'body'},h('b',null,'More games coming soon'),h('span',null,`New ${S.name} games are on the way.`))):null,
      note,...owner);
    return;
  }
  const tcard=mc('m16','cgames','Class Games','Run a live quiz or a game-show-style board for the whole class from your projector.','Live Quiz · Quiz Board Maker',cgEnter);tcard.classList.add('teachcard');
  const tiles=SUBJECTS.map(s=>{const st=subjStats(P,s.id);
    return h('button',{type:'button',class:'subjtile',style:`--c1:${s.c1};--c2:${s.c2}`,'aria-label':`${s.name}: ${st.n} games. ${s.desc}`,onclick:()=>{setSubj(s.id);renderMenu();window.scrollTo(0,0);}},
      h('span',{class:'stnum'},s.num),h('span',{class:'stsym'},s.sym),h('span',{class:'stname'},s.name),
      h('span',{class:'stdesc'},s.desc),h('span',{class:'stmeta'},`${st.open} of ${st.n} games open`+(st.mx?` · ${st.st} ★`:'')),
      h('span',{class:'stthumbs'},...SUBJ_GAMES[s.id].slice(0,4).map(k=>{const a=h('i');a.innerHTML=ART.thumb(k);return a;})));});
  ngRC($('menuGrid'),...preview,
    h('div',{class:'secthead teach'},I('cap'),'For teachers'),
    h('div',{class:'teachrow'},tcard,h('div',{class:'teachside'},
      teacherSay(['This platform is used to study for science, not to just play around!'],{small:true}),
      h('div',{class:'teachnote'},h('b',null,'Teacher-led games. '),'Put your screen on the projector, start a game, and your students join on their Chromebooks with a 4-number code. Sign in with your teacher account to run it. ',h('a',{class:'tlink',role:'button',tabindex:'0',onclick:openDash,onkeydown:e=>{if(e.key==='Enter')openDash();}},'Teacher dashboard')))),
    h('div',{class:'secthead stud'},'For students'),
    h('div',{class:'subjgrid'},...tiles),
    join(),...tail,note,...owner);
};

/* ---- teacher dashboard: game switches grouped by subject ---- */
function dashGameGroups(C,off){
  return SUBJECTS.map(s=>{const ids=SUBJ_GAMES[s.id],on=ids.filter(id=>!off.has(id)).length;
    return h('div',{class:'tdsubj'},h('div',{class:'tdsubjh',style:`--c1:${s.c1}`},h('span',{class:'subjsym sm'},s.sym),h('b',null,s.name),h('small',null,` ${on} of ${ids.length} open`),
        h('span',{class:'tdsubjbtn'},h('button',{class:'btn sm ghost',type:'button',onclick:()=>saveGames(C,[...off].filter(x=>!ids.includes(x)))},'Open all'),h('button',{class:'btn sm ghost',type:'button',onclick:()=>saveGames(C,[...new Set([...off,...ids])])},'Lock all'))),
      h('div',{class:'td-games'},...ids.map(id=>{const name=(SW_GAMES.find(g=>g[0]===id)||[id,id])[1],on1=!off.has(id),art=h('div',{class:'art'});art.innerHTML=ART.thumb(id);
        const sw=h('button',{class:'sw',type:'button',role:'switch','aria-checked':on1?'true':'false','aria-label':`${name}: ${on1?'open':'locked'} for ${C.name}`,onclick:()=>toggleGame(C,id,!on1)});
        return h('div',{class:'swt '+(on1?'on':'off')},art,h('div',{class:'row'},h('div',null,h('div',{class:'nm'},name),h('div',{class:'st'},on1?'Open':'Locked')),sw));})));});
}
/* test hook: only with ?ngtest in the address (used by the automated tests) */
if(/[?&]ngtest\b/.test(location.search))window.__ng=s=>eval(s);
