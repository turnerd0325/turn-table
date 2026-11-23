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
/* ---- periodic-table menu (the primary view) ----
   Every game is a tile on a table shaped like the real one: 1 tile + 1 tile on top, then 2 + 6 across
   (twice), with the extra games in a detached bottom row like the lanthanides. Colors are subjects.
   The number in each corner is the game's number (like an atomic number); a key above the table
   explains it. Games get their number from PT_ORDER; a new game that is not listed there is added
   at the end automatically (its tile lands in PT_POS, or in row 6 once the table is full). */
let menuView='table';try{menuView=localStorage.getItem('tt_menu_view')==='subjects'?'subjects':'table';}catch(e){}
function setView(v){menuView=v;setSubj(null);try{localStorage.setItem('tt_menu_view',v);}catch(e){}renderMenu();window.scrollTo(0,0);}
Object.assign(ART.P,{
  ptable:'<rect x="3" y="3" width="4.5" height="4.5" rx="1"/><rect x="16.5" y="3" width="4.5" height="4.5" rx="1"/><rect x="3" y="9.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="9.5" width="4.5" height="4.5" rx="1"/><rect x="16.5" y="9.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="16" width="4.5" height="4.5" rx="1"/><rect x="3" y="16" width="4.5" height="4.5" rx="1"/><rect x="16.5" y="16" width="4.5" height="4.5" rx="1"/>',
  rows:'<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1.3"/><circle cx="4.5" cy="12" r="1.3"/><circle cx="4.5" cy="18" r="1.3"/>'
});
const PT_SYM={speed:'Sf',trivia:'Et',explore:'Ex',lab:'Cl',atom:'Ab',balance:'Bi',diner:'Ad',sep:'Ss',evidence:'Ev',
  laser:'Lm',blackout:'Bo',coaster:'Ca',courier:'Sc',frozen:'Kf',fields:'Fg',waves:'Wt',
  cell:'Cs',ripple:'Rp',pup:'Pp',drift:'Id',moon:'Mw',strata:'Dt',pangaea:'Pr',weather:'Wd'};
const PT_ORDER=['speed','trivia','explore','lab','atom','balance','diner','sep','evidence',
  'laser','blackout','coaster','courier','frozen','fields','waves','cell','ripple','pup','drift','moon','strata','pangaea','weather'];
const PT_POS=(()=>{const a=[[1,1],[1,18]];[2,3].forEach(r=>{a.push([r,1],[r,2]);for(let c=13;c<=18;c++)a.push([r,c]);});for(let c=7;c<=12;c++)a.push([5,c]);return a;})();
const ptPos=i=>PT_POS[i]||[6,7+(i-PT_POS.length)];
const ptList=()=>{const all=Object.values(SUBJ_GAMES).flat();return [...PT_ORDER.filter(k=>all.includes(k)),...all.filter(k=>!PT_ORDER.includes(k))];};
let ptCur=null,ptFocus=null;
function ptLockPop(k,el){const r=el.getBoundingClientRect(),cx=Math.min(Math.max(r.left+r.width/2,190),innerWidth-190);   /* keep the pop-up on screen for tiles at the edges */
  fx.pop({icon:'lock',text:freeMode()&&!FREE_GAMES[k]&&!classOff().includes(k)?'Full version only. Ask your teacher about Turn-Table!':'Locked for now. Ask your teacher!',kind:'try',at:{getBoundingClientRect:()=>({left:cx-1,width:2,top:r.top})}});}
function ptBuild(P,meta){
  const list=ptList(),subj=k=>SUBJECTS.find(s=>s.id===SUBJ_OF[k]);
  if(!ptCur||!list.includes(ptCur))ptCur=list.find(k=>!gameLocked(k))||list[0];
  const prev=h('div',{class:'ptprev','aria-live':'polite'});
  const fill=k=>{ptCur=k;const m=meta[k],S=subj(k),lk=gameLocked(k),n=list.indexOf(k)+1,art=h('div',{class:'pvart'});art.innerHTML=ART.thumb(k);
    const go=lk?h('button',{class:'btn pvplay lockd',type:'button',onclick:e=>ptLockPop(k,e.currentTarget)},I('lock'),'Locked for now'):h('button',{class:'btn pvplay',type:'button',onclick:()=>ttGate(k,m.fn)},'Play ',m.title);
    ngRC(prev,h('div',{class:'pvin',style:`--c1:${S.c1};--c2:${S.c2}`},art,h('div',{class:'pvtxt'},
      h('div',{class:'pvhead'},h('span',{class:'pvnum'},n),h('span',{class:'pvsym'},PT_SYM[k]),h('span',{class:'pvsub'},S.name)),
      h('b',{class:'pvname'},m.title,STD[k]?stdTag(STD[k][0],STD[k][1]?'sup':'',STD[k][1]?'Helps students get ready for '+stdOrg(STD[k][0])+' '+STD[k][0]+'.':null):null,typeof HS_STD!=='undefined'&&HS_STD[k]?stdTag(HS_STD[k],'hs','Also matches high school NGSS '+HS_STD[k]+'.'):null),
      h('p',null,m.desc),m.best&&!lk?h('div',{class:'best'},m.best):null,go)));};
  const tile=(k,i)=>{const m=meta[k],S=subj(k),lk=gameLocked(k),[r,c]=ptPos(i);
    const b=h('button',{type:'button',class:`ptile s-${S.id}`+(lk?' locked':''),style:`grid-row:${r};grid-column:${c};--c1:${S.c1};--c2:${S.c2}`,'data-k':k,'data-n':i+1,
      'aria-label':`Game ${i+1}: ${m.title}. ${S.name}.${lk?' Locked for now.':''} ${m.desc}`,
      onclick:()=>{fill(k);lk?ptLockPop(k,b):ttGate(k,m.fn);},onmouseenter:()=>fill(k),onfocus:()=>fill(k)},
      h('span',{class:'ptn'},i+1),lk?h('span',{class:'ptl'},I('lock')):null,h('span',{class:'pts'},PT_SYM[k]),h('span',{class:'ptt'},m.title));
    return b;};
  const util=(cls,pos,title,sub,fn)=>h('button',{type:'button',class:'ptutil '+cls,style:`grid-row:5;grid-column:${pos}`,onclick:fn},h('b',null,title),h('span',null,sub));
  const grid=h('div',{class:'ptgrid',role:'group','aria-label':'All games, laid out like the periodic table'},
    ...list.map(tile),prev,
    util('u-join','1/7','Join a Class Game','Got a 4-number code from your teacher?',openLiveJoin),
    util('u-prof','13/16','My Profile','Badges and best scores',()=>{renderStats();show('s-stats');}),
    util('u-fb','16/19','Feedback','Send an idea to your teacher',()=>{renderFeedback();show('s-feedback');}));
  if(ptFocus)grid.dataset.focus=ptFocus;
  fill(ptCur);
  const chips=SUBJECTS.slice().sort((a,b)=>list.indexOf(SUBJ_GAMES[a.id][0])-list.indexOf(SUBJ_GAMES[b.id][0])).map(s=>{const ks=SUBJ_GAMES[s.id],open=ks.filter(k=>!gameLocked(k)).length;
    return h('button',{type:'button',class:'ptchip',style:`--c1:${s.c1};--c2:${s.c2}`,'aria-pressed':ptFocus===s.id?'true':'false','data-s':s.id,
      title:'Click to light up only the '+s.name+' games. Click again to show them all.',
      onclick:e=>{ptFocus=ptFocus===s.id?null:s.id;if(ptFocus)grid.dataset.focus=ptFocus;else delete grid.dataset.focus;
        e.currentTarget.parentNode.querySelectorAll('.ptchip').forEach(x=>x.setAttribute('aria-pressed',x.dataset.s===ptFocus?'true':'false'));}},
      h('i',{class:'chsw'},s.sym),h('span',{class:'cn'},h('b',null,s.name),h('small',null,`${ks.length} games · ${open} open`)));});
  const how=(ic,kids)=>h('div',{class:'kitem'},ic,h('span',null,...kids));
  const key=h('section',{class:'ptkey','aria-label':'Key: how to use the table'},
    h('div',{class:'ptkey-row'},h('b',{class:'ptkey-t'},'KEY'),h('div',{class:'ptkey-sub'},h('b',null,'Color = subject.'),' Tap a color to light up just that subject.'),h('div',{class:'ptchips'},...chips)),
    h('div',{class:'ptkey-how'},
      how(h('span',{class:'kmini'},h('i',null,'5'),h('b',null,'Ab')),[h('b',null,'Number in the corner'),' = the game’s number, like an atomic number. The letters are its short symbol.']),
      how(h('span',{class:'kic'},'☝'),[h('b',null,'Click a tile to play it.'),' Hover over a tile, or press Tab, to read about it in the middle.']),
      how(h('span',{class:'kic keys'},'←→'),[h('b',null,'Keyboard:'),' arrow keys move around, ',h('b',null,'type a number'),' to jump to that game, Enter plays.']),
      how(h('span',{class:'kic'},I('lock')),[h('b',null,'Padlock'),' = not open yet. Ask your teacher.'])));
  return {key,grid};
}
/* type a number to jump to that game; arrow keys move between tiles */
(function(){let buf='',tm=0,pill=null;
  const active=()=>{const m=$('s-menu');return m&&!m.hidden&&menuView==='table'&&!menuSubj&&document.querySelector('#menuGrid .ptgrid');};
  const say=t=>{if(!pill){pill=h('div',{class:'ptbuf','aria-hidden':'true'});document.body.append(pill);}pill.textContent=t;pill.style.display=t?'block':'none';};
  const jump=n=>{const t=document.querySelector(`#menuGrid .ptile[data-n="${n}"]`);if(t){t.focus();}};
  const move=(dx,dy)=>{const tiles=[...document.querySelectorAll('#menuGrid .ptile,#menuGrid .ptutil')],cur=document.activeElement&&tiles.includes(document.activeElement)?document.activeElement:null;
    if(!cur){const t=tiles[0];if(t)t.focus();return;}
    const a=cur.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;
    const pick=strict=>{let best=null,bd=1e9;
      tiles.forEach(t=>{if(t===cur)return;const r=t.getBoundingClientRect(),x=r.left+r.width/2-ax,y=r.top+r.height/2-ay,pri=dx?x*dx:y*dy,sec=dx?Math.abs(y):Math.abs(x);
        if(pri<=(dx?a.width:a.height)*.3)return;                       /* must be in the direction asked */
        if(strict&&sec>(dx?a.height:a.width)*.6)return;                /* first try: stay in the same row / column */
        const d=pri+sec*2.2;if(d<bd){bd=d;best=t;}});return best;};
    const best=pick(true)||pick(false);
    if(best)best.focus();};
  document.addEventListener('keydown',e=>{if(!active()||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;
    if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
    if(/^[0-9]$/.test(e.key)){clearTimeout(tm);buf+=e.key;let n=+buf;
      if(n>ptList().length){buf=e.key;n=+buf;}
      say('Go to game: '+buf);const fin=()=>{if(n>=1)jump(n);buf='';say('');};
      if(n*10>ptList().length)fin();else tm=setTimeout(fin,800);e.preventDefault();return;}
    const D={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(D){move(D[0],D[1]);e.preventDefault();}});})();
renderMenu=function(){
  try{$('btnLogout').textContent=isPreview()?'Exit preview':'Log out';}catch(e){}
  const P=prof(),S=menuSubj&&SUBJECTS.find(s=>s.id===menuSubj);
  const TV=!S&&menuView==='table';
  $('s-menu').classList.toggle('ptview',TV);
  $('menuHello').textContent=S?`${S.name}`:`Hi, ${P.name}! Pick a ${TV?'game':'subject'}`;
  $('menuSub').textContent=S?S.desc+' Pick a game!':TV?(P.cinfo&&P.cinfo.name?`${P.cinfo.teacher}'s class: ${P.cinfo.name}. Every game is on the table. Pick one!`:'Every game is on the table. Pick one and show what you know!'):(P.cinfo&&P.cinfo.name?`${P.cinfo.teacher}'s class: ${P.cinfo.name}. Pick a subject, then a game.`:'Pick a subject, then a game. Show what you know!');
  try{bdStrip();bdCheck();}catch(e){}
  $('bdStrip').hidden=!!S;
  const sb=Object.values(P.speed).map(r=>r.best).filter(x=>x!=null),ab=Object.values(P.atom).map(r=>r.best).filter(x=>x>0);
  const meta={};let metaOnly=false;
  const mc=(cls,ic,title,desc,best,fn)=>{meta[ic]={title,desc,best,fn};if(metaOnly)return null;const art=h('div',{class:'art'});art.innerHTML=ART.thumb(ic);
    const locked=gameLocked(ic),sd=SHORT_DESC[ic]||desc;
    const tip=h('div',{class:'tip'});
    if(locked){tip.append(h('div',{class:'lk'},I('lock'),'Locked for now'));}
    tip.append(sd);art.append(tip);
    if(locked)art.append(h('div',{class:'lockbadge'},I('lock')));
    const btn=h('button',{class:'mcard '+cls+(locked?' locked':''),title:(locked?'Locked for now. ':'')+sd,'aria-label':title+(locked?' (locked for now). ':'. ')+sd,
      onclick:locked?(()=>fx.pop({icon:'lock',text:freeMode()&&!FREE_GAMES[ic]&&!classOff().includes(ic)?'Full version only. Ask your teacher about Turn-Table!':'Locked for now. Ask your teacher!',kind:'try',at:btn})):(()=>ttGate(ic,fn))},art,
      h('div',{class:'body'},h('b',null,title,STD[ic]?stdTag(STD[ic][0],STD[ic][1]?'sup':'',STD[ic][1]?'Helps students get ready for '+stdOrg(STD[ic][0])+' '+STD[ic][0]+'.':null):null,typeof HS_STD!=='undefined'&&HS_STD[ic]?stdTag(HS_STD[ic],'hs','Also matches high school NGSS '+HS_STD[ic]+'.'):null),h('span',null,desc),locked?h('div',{class:'best lockedpill'},'Locked for now'):(best?h('div',{class:'best'},best):null)));
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
  if(freeMode())preview.push(h('div',{class:'freebar'},h('b',null,'Free version. '),'You can play Speed Find, Cell Shop and Moonwatch (first levels, 3 plays a day each). Ask your teacher about the full version to unlock every game.'));
  const owner=!isPreview()&&isOwner()&&classOff().length?[h('div',{class:'ownernote'},'Owner view: all games are open for you. Your class currently has '+classOff().length+' game'+(classOff().length===1?'':'s')+' switched off.')]:[];
  const note=h('div',{class:'stdnote'},'Each tag is the NGSS standard the game is built on. NYSSLS marks one of New York\u2019s added standards. A dashed tag means the game helps you get ready for that standard.');
  const ngssbar=h('div',{class:'ngssbar'},h('span',{class:'ngssbadge'},'NGSS-ALIGNED'),h('span',null,'Every game is built around a middle school NGSS standard. The tag on each card shows which one.'));
  const viewTog=()=>h('div',{class:'viewtog'},h('span',{class:'vtl'},'Show the games as:'),
    h('div',{class:'vtseg',role:'group','aria-label':'How to show the games'},
      h('button',{type:'button',class:'vtb','aria-pressed':TV?'true':'false',onclick:()=>{if(!TV)setView('table');}},I('ptable'),'Periodic table'),
      h('button',{type:'button',class:'vtb','aria-pressed':TV?'false':'true',onclick:()=>{if(TV||S)setView('subjects');}},I('rows'),'4 subjects')),
    h('span',{class:'vth'},'Same games, two ways to find them.'));
  const teach=()=>{const tcard=mc('m16','cgames','Class Games','Run a live quiz or a game-show-style board for the whole class from your projector.','Live Quiz · Quiz Board Maker',cgEnter);tcard.classList.add('teachcard');
    return [h('div',{class:'secthead teach'},I('cap'),'For teachers'),
      h('div',{class:'teachrow'},tcard,h('div',{class:'teachside'},
        teacherSay(['This platform is used to study for science, not to just play around!'],{small:true}),
        h('div',{class:'teachnote'},h('b',null,'Teacher-led games. '),'Put your screen on the projector, start a game, and your students join on their Chromebooks with a 4-number code. Sign in with your teacher account to run it. ',h('a',{class:'tlink',role:'button',tabindex:'0',onclick:openDash,onkeydown:e=>{if(e.key==='Enter')openDash();}},'Teacher dashboard'))))];};
  if(TV){
    metaOnly=true;ptList().forEach(k=>{if(cards[k])cards[k]();});metaOnly=false;
    const af=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.k;
    const pt=ptBuild(P,meta);
    ngRC($('menuGrid'),...preview,viewTog(),pt.key,pt.grid,ngssbar,...teach(),note,...owner);
    if(af){const t=pt.grid.querySelector('[data-k="'+af+'"]');if(t)t.focus({preventScroll:true});}
    return;
  }
  if(S){
    const st=subjStats(P,S.id);
    ngRC($('menuGrid'),...preview,viewTog(),
      h('div',{class:'subjbar',style:`--c1:${S.c1};--c2:${S.c2}`},ngBtn('← All subjects',()=>{setSubj(null);renderMenu();window.scrollTo(0,0);},'ghost sm'),
        h('span',{class:'subjsym'},S.sym),h('div',null,h('b',null,S.name),h('small',null,`${st.n} games${st.mx?` · ${st.st}/${st.mx} ★`:''}`))),
      ngssbar,join(),...SUBJ_GAMES[S.id].map(k=>cards[k]()),
      S.more?h('div',{class:'mcard soon',style:`--c1:${S.c1};--c2:${S.c2}`},h('div',{class:'body'},h('b',null,'More games coming soon'),h('span',null,`New ${S.name} games are on the way.`))):null,
      note,...owner);
    return;
  }
  const tiles=SUBJECTS.map(s=>{const st=subjStats(P,s.id);
    return h('button',{type:'button',class:'subjtile',style:`--c1:${s.c1};--c2:${s.c2}`,'aria-label':`${s.name}: ${st.n} games. ${s.desc}`,onclick:()=>{setSubj(s.id);renderMenu();window.scrollTo(0,0);}},
      h('span',{class:'stnum'},s.num),h('span',{class:'stsym'},s.sym),h('span',{class:'stname'},s.name),
      h('span',{class:'stdesc'},s.desc),h('span',{class:'stmeta'},`${st.open} of ${st.n} games open`+(st.mx?` · ${st.st} ★`:'')),
      h('span',{class:'stthumbs'},...SUBJ_GAMES[s.id].slice(0,4).map(k=>{const a=h('i');a.innerHTML=ART.thumb(k);return a;})));});
  ngRC($('menuGrid'),...preview,viewTog(),
    ...teach(),
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
        return h('div',{class:'swt '+(on1?'on':'off')},art,h('div',{class:'row'},h('div',null,h('div',{class:'nm'},name),STD[id]?stdTag(STD[id][0],STD[id][1]?'sup':''):null,h('div',{class:'st'},on1?'Open':'Locked')),sw));})));});
}
/* test hook: only with ?ngtest in the address (used by the automated tests) */
if(/[?&]ngtest\b/.test(location.search))window.__ng=s=>eval(s);

/* NGSS tag on every game's level-picker screen (built from STD, so it always matches the menu card) */
['speed','atom','diner','sep','laser','blackout','evidence','coaster'].forEach(k=>{const sc=$('s-'+k+'-setup'),h2=sc&&sc.querySelector('h2');if(!h2||!STD[k])return;
  h2.querySelectorAll('.stdchip').forEach(x=>x.remove());h2.append(' ',stdTag(STD[k][0],STD[k][1]?'sup':''));
  if(typeof HS_STD!=='undefined'&&HS_STD[k])h2.append(stdTag(HS_STD[k],'hs'));});
