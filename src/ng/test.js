/* ===================== PRE-TEST / POST-TEST =====================
   Every testable game gets a mode choice: Review (normal play) or the test the teacher has open.
   Test rules: the same fixed questions every time, one try each, no hints, no tips, no right/wrong
   feedback, score only at the end. The teacher opens a Pre-Test or Post-Test window per game per class.
   Backend: tt_test_submit, tt_test_mine (students); tt_a_set_tests, tt_a_tests, tt_a_test_reset (teachers). */
const TEST_SET={
  speed:['O','Na','Fe','Cl','He','Ca','K','N','Mg','Ar'],
  trivia:['O','Na','Fe','He','C','Ca','Cu','N','Ne','Au'],
  lab:()=>{const by=t=>COMPOUNDS.filter(c=>c.t===t);return [...by(1).slice(0,4),...by(2).slice(0,4),...by(3).slice(0,2)];},
  atom:()=>[...['C','N','Na','Ar'].map(s=>makeAtomQ('neutral',s)),makeAtomQ('ion','Na',1),makeAtomQ('ion','Cl',-1),makeAtomQ('ion','Mg',2),
    makeAtomQ('isotope','H',2),makeAtomQ('isotope','C',14),makeAtomQ('isotope','Cl',37)]
};
const TEST_GAMES={
  speed:{n:10,unit:'elements',what:'Find 10 elements on the table. One click each.',how:['A name appears at the top. Click that element on the table.','Your time is saved too, but the score is how many you find.']},
  trivia:{n:10,unit:'mystery elements',what:'Name 10 mystery elements from their clues. One guess each.',how:['Read the clue. You may open more clues, but each one lowers the points.','Click an element on the table (or type its name), then press Guess. You get one guess.']},
  lab:{n:10,unit:'compounds',what:'Build 10 compounds from atoms. One check each.',how:['Click an element to drop an atom into the lab. Drag atoms onto each other to bond them (drag one off the bench to remove it).','Press Combine when your compound is ready. You get one try.']},
  atom:{n:10,unit:'atoms',what:'Build 10 atoms, ions and isotopes. One check each.',how:['Drag protons and neutrons into the nucleus and electrons onto the shells. You can also tap a bin, or use the P, N and E keys.','Press Check when you are ready. You get one try.']},
  balance:{n:10,unit:'equations',what:'Balance 10 equations. One check each.',how:['Use + and − (or drag a molecule pack onto its pan) to change the big numbers in front of each formula.','Press Check when you think both sides match. You get one try.']},
  /* star games: 3 fixed setups, one from each pack. Nothing runs: the student predicts from a still picture (see TEST_ITEMS below) */
  blackout:{n:3,unit:'circuits',what:'Predict what 3 circuits will do. One try each.',how:['Look at the circuit. Nothing is switched on yet.','Tap each lamp (or use the buttons) to choose **Lit** or **Dark**, answer any other question, then press **Save answer**.']},
  laser:{n:3,unit:'laser boards',what:'Predict where the laser beam goes on 3 boards. One try each.',how:['Look at the board. The laser is not on yet.','Tap each crystal (or use the buttons) to choose **Lights up** or **Stays dark**, answer any other question, then press **Save answer**.']},
  coaster:{n:3,unit:'coasters',what:'Predict what happens on 3 coasters. One try each.',how:['Look at the track. The cart has not started yet.','Pick your prediction and the reason, then press **Save answer**.']},
  evidence:{n:3,unit:'cases',what:'Solve 3 lab cases from the evidence. One try each.',how:['Read the test results.','Pick your answer, then press **Save answer**.']},
  sep:{n:3,unit:'mixtures',what:'Plan how to separate 3 mixtures. One try each.',how:['Look at the mixture.','Pick the machines in order, then press **Save answer**.']},
  diner:{n:3,unit:'orders',what:'Count the atoms in 3 orders. No timer. One try each.',how:['Read the order and the ingredients.','Answer each question, then press **Save answer**.']}
};
/* Games whose test items are not built yet stay out of the mode picker and the dashboard until
   their TEST_ITEMS entry exists. All 6 star games are built now (Session B added evidence, sep, diner). */
const TST_LATER=new Set([]);
const tstHas=g=>!!TEST_GAMES[g]&&!TST_LATER.has(g);
NG_ORDER.forEach(k=>{TEST_GAMES[k]={n:NG_TEST_LV.length,unit:'levels',what:`Play ${NG_TEST_LV.length} levels, one from each pack. One try each.`,how:NGS[k].how};});
const tstName=g=>NGS[g]?NGS[g].name:((SW_GAMES.find(x=>x[0]===g)||[g,g])[1]);
let TST=null;
const tstOn=g=>!!(TST&&TST.game===g);
const tstWindow=g=>{const P=prof();return (P&&P.cinfo&&P.cinfo.tests||{})[g]||null;};
const tstTook=(P,g,k)=>!!(k&&P.ttests&&P.ttests[g+'|'+k]);
const tstPct=v=>Math.round(v)+'%';

/* no pops, confetti or sounds of success/failure while a test is running */
(()=>{const p=fx.pop,c=fx.confetti;fx.pop=o=>{if(TST)return;return p(o);};fx.confetti=n=>{if(TST)return;return c(n);};})();

/* neutral "answer saved" note (never says right or wrong) */
const tstToast=h('div',{class:'tsttoast',role:'status','aria-live':'polite',hidden:true});document.body.append(tstToast);
let tstToastT=0;
function tstSaved(){tstToast.replaceChildren(I('doc'),' Answer saved');tstToast.hidden=false;tstToast.classList.remove('go');void tstToast.offsetWidth;tstToast.classList.add('go');
  clearTimeout(tstToastT);tstToastT=setTimeout(()=>{tstToast.hidden=true;},900);}

/* ---- cloud sync: class windows + this student's taken tests ---- */
async function tstSync(P){
  if(!P||!P.cloud)return;const a={p_id:P.cloud.id,p_token:P.cloud.token};
  const [ci,mine]=await Promise.all([rpc('tt_class_info',a,3500).catch(()=>null),rpc('tt_test_mine',a,3500).catch(()=>null)]);
  if(ci&&ci.ok)P.cinfo=ci.class||null;
  if(mine&&mine.ok){const m={};mine.rows.forEach(r=>{m[r.game+'|'+r.kind]={score:+r.score,at:Date.parse(r.at)||Date.now()};});
    Object.entries(P.ttests||{}).forEach(([k,v])=>{if(v.pend&&!m[k])m[k]=v;});P.ttests=m;}
  saveAll();
  for(const k of Object.keys(P.ttests||{})){const v=P.ttests[k];if(v.pend){const [g,kind]=k.split('|');await tstPush(P,g,kind);}}
}
async function tstPush(P,g,kind){
  const key=g+'|'+kind,v=P.ttests&&P.ttests[key];if(!v||!v.pend)return 'ok';if(!P.cloud)return 'local';
  try{const r=await rpc('tt_test_submit',{p_id:P.cloud.id,p_token:P.cloud.token,p_game:g,p_kind:kind,p_score:v.pend.score,p_detail:v.pend.detail},8000);
    if(r&&r.ok){delete v.pend;saveAll();return r.dup?'dup':'ok';}
    if(r&&r.error==='closed'){delete v.pend;v.closed=true;saveAll();return 'closed';}
    return 'retry';}catch(e){return 'retry';}
}

/* ---- the gate every game card goes through ---- */
async function ttGate(g,fn){
  if(!tstHas(g)||freeMode())return fn();
  const P=prof(),own=isOwner();
  if(!own&&!tstWindow(g)&&!(P&&P.cloud))return fn();
  if(P&&P.cloud)await tstSync(P);
  const w=tstWindow(g);
  if(!own&&(!w||tstTook(P,g,w)))return fn();
  tstChooser(g,fn);
}
function tstBox(kids){ngRC($('tstBody'),...kids);show('s-test');}
function tstChooser(g,fn){
  const P=prof(),own=isOwner(),w=tstWindow(g),art=h('div',{class:'tstart'});art.innerHTML=ART.thumb(g);
  const done=k=>P.ttests&&P.ttests[g+'|'+k];
  const card=(k,title,desc,state,onGo)=>h('button',{type:'button',class:'tstopt '+k+(onGo?'':' off'),disabled:!onGo,onclick:onGo||null},
    h('b',null,title),h('span',null,desc),state?h('em',null,state):null);
  const preDone=done('pre'),postDone=done('post');
  const reviewLocked=!own&&w==='pre'&&!preDone;
  const preOK=own||(w==='pre'&&!preDone),postOK=own||(w==='post'&&!postDone);
  tstBox([
    h('div',{class:'tsthead'},art,h('div',null,h('div',{class:'tstk'},'Choose a mode'),h('h2',null,tstName(g)))),
    h('div',{class:'tstopts'},
      card('review','Review','Play with hints, tips and feedback. Practice as much as you like.',reviewLocked?'Take the Pre-Test first':null,reviewLocked?null:fn),
      card('pre','Pre-Test','Before the unit. Show what you already know. One try per question, no hints.',
        preDone?`Done: ${tstPct(preDone.score)}`:preOK?(own&&w!=='pre'?'Owner practice':'Open now'):w==='post'?'Not taken':'Your teacher opens this before the unit',
        preOK&&!(preDone&&!own)?()=>tstIntro(g,'pre',fn):null),
      card('post','Post-Test','After the unit. The same test again, so you can see how much you grew.',
        postDone?`Done: ${tstPct(postDone.score)}`:postOK?(own&&w!=='post'?'Owner practice':'Open now'):'Your teacher opens this after the unit',
        postOK&&!(postDone&&!own)?()=>tstIntro(g,'post',fn):null)),
    own?h('p',{class:'sub tstnote'},'Owner view: every mode is open for you. Practice runs only count when your class has that test open.'):null,
    h('div',{class:'tstbtns'},ngBtn('Back to games',goMenu,'ghost'))]);
}
function tstIntro(g,kind,fn){
  const m=TEST_GAMES[g],pre=kind==='pre';
  tstBox([
    h('div',{class:'tsthead'},h('div',null,h('div',{class:'tstk'},pre?'Pre-Test':'Post-Test'),h('h2',null,tstName(g)))),
    STD[g]?h('p',{class:'tststd'},stdTag(STD[g][0],STD[g][1]?'sup':''),'This test checks the standard the game is built on.'):null,
    h('p',{class:'tstbig'},m.what),
    h('ul',{class:'tstrules'},
      h('li',null,h('b',null,'One try for each question. '),'You will not see if you are right or wrong until the end.'),
      h('li',null,h('b',null,'No hints and no tips. '),'Just show what you know right now.'),
      h('li',null,pre?[h('b',null,'It is OK not to know everything yet! '),'This shows your teacher where to start.']:[h('b',null,'Same test as before the unit, '),'so you can see how much you grew.']),
      h('li',null,h('b',null,'Do not leave in the middle. '),'If you leave, the test ends and the questions you did not finish count as wrong.')),
    h('div',{class:'tsthow'},h('b',null,'How to play'),h('ol',null,...m.how.map(t=>h('li',null,...ngRich(t))))),
    h('div',{class:'tstbtns'},ngBtn('Back',()=>tstChooser(g,fn),'ghost'),ngBtn([I('play'),pre?' Start the Pre-Test':' Start the Post-Test'],()=>tstStart(g,kind,fn),'good big'))]);
}
function tstStart(g,kind,fn){
  TST={game:g,kind,t0:Date.now(),fn,finish:null};
  if(NGS[g]){TST.finish=()=>{if(!NGT)return;while(NGT.res.length<NGT.lv.length)NGT.res.push({lv:NGT.lv[NGT.res.length]+1,s:0,left:1});
      tstFinish(NGT.res.reduce((a,r)=>a+r.s,0)/NGT.lv.length*100,{levels:NGT.res,left:true});};ngTestStart(g,kind);}
  else if(g==='speed')startSpeed(2,'');
  else if(g==='trivia')startTrivia();
  else if(g==='lab')startLab();
  else if(g==='atom')startAtom('T');
  else if(g==='balance')startBalance();
  else if(TEST_ITEMS[g])gtStart(g);
}
async function tstQuit(){
  if(!TST)return goMenu();
  const t=TST;
  const ok=await modal({title:'Leave the test?',text:'If you leave now, the test ends. The questions you did not finish count as wrong, and you cannot take it again.',ok:'Leave and turn it in'});
  if(ok&&TST===t&&t.finish)t.finish();
}
async function tstFinish(score,detail){
  const t=TST;if(!t)return;TST=null;NGT=null;
  document.querySelectorAll('.screen.testing').forEach(x=>x.classList.remove('testing'));
  score=Math.round(Math.max(0,Math.min(100,score))*10)/10;
  detail=Object.assign({mins:Math.round((Date.now()-t.t0)/6000)/10},detail||{});
  const P=prof(),key=t.game+'|'+t.kind,own=isOwner(),counts=!own||tstWindow(t.game)===t.kind;
  if(counts){P.ttests=P.ttests||{};if(!P.ttests[key])P.ttests[key]={score,at:Date.now(),pend:{score,detail}};saveAll();}
  tstResult(t,score,counts?'saving':'practice');
  if(counts){const r=await tstPush(P,t.game,t.kind);if(!$('s-test').hidden)tstResult(t,score,r);}
}
function tstResult(t,score,status){
  const P=prof(),pre=t.kind==='pre',other=P.ttests&&P.ttests[t.game+'|pre'];
  const msg={saving:'Saving…',ok:'Saved. Your teacher can see your score.',dup:'Saved. Your teacher can see your score.',
    retry:'Saved on this Chromebook. It will be sent to your teacher the next time you are online.',local:'Saved on this device.',
    closed:'Your teacher closed this test before you finished, so this score was not sent.',practice:'Owner practice run. This score is not saved to a class.'}[status]||'';
  const grow=!pre&&other&&status!=='practice'?h('div',{class:'tstgrow'},'Pre-Test ',h('b',null,tstPct(other.score)),' → Post-Test ',h('b',null,tstPct(score)),
    h('span',{class:score>=other.score?'up':'down'},` (${score>=other.score?'+':''}${Math.round(score-other.score)})`)):null;
  tstBox([
    h('div',{class:'tsthead'},h('div',null,h('div',{class:'tstk'},(pre?'Pre-Test':'Post-Test')+' complete'),h('h2',null,tstName(t.game)))),
    h('div',{class:'tstscore'},tstPct(score)),grow,
    h('p',{class:'sub',style:'text-align:center'},msg),
    h('p',{style:'text-align:center'},pre?'Now you can play in Review mode, with hints and tips, to learn more.':'Great work finishing the test!'),
    h('div',{class:'tstbtns'},ngBtn('Back to games',goMenu,'ghost'),t.fn?ngBtn([I('play'),' Play in Review mode'],t.fn,'good'):null)]);
  if(status!=='saving'&&grow&&other&&score>other.score)setTimeout(()=>{fx.confetti(60);},200);
}

/* ---- teacher dashboard: open tests and compare scores ---- */
const TSTD={game:null,rows:null,cls:null,busy:false};
async function tstLoad(C){
  TSTD.cls=C.id;TSTD.busy=true;
  try{const r=await rpc('tt_a_tests',{p_class:C.id},10000);TSTD.rows=r&&r.ok?r.rows:[];}catch(e){TSTD.rows=null;}
  TSTD.busy=false;if(TA&&TA.cls===C.id)renderDash();
}
async function tstSetWindow(C,g,v){
  const prev=Object.assign({},C.tests||{}),next=Object.assign({},prev);if(v)next[g]=v;else delete next[g];
  C.tests=next;renderDash();
  try{const r=await rpc('tt_a_set_tests',{p_class:C.id,p_tests:next},10000);if(!r||!r.ok)throw 0;C.tests=r.tests;}
  catch(e){C.tests=prev;await modal({title:"That didn't save",text:'Check the Wi-Fi and try again.',cancel:false});}
  renderDash();
}
function tstByStudent(g){const m={};(TSTD.rows||[]).filter(r=>r.game===g).forEach(r=>{(m[r.sid]=m[r.sid]||{name:r.name,sid:r.sid})[r.kind]=r;});return Object.values(m).sort((a,b)=>a.name.localeCompare(b.name));}
function tstDashCard(C){
  if(TSTD.cls!==C.id||(TSTD.rows===null&&!TSTD.busy)){TSTD.rows=TSTD.cls===C.id?TSTD.rows:null;if(!TSTD.busy)tstLoad(C);}
  const W=C.tests||{},rows=TSTD.rows||[],n=g=>k=>rows.filter(r=>r.game===g&&r.kind===k).length;
  const seg=g=>{const v=W[g]||'';return h('div',{class:'tstseg',role:'group','aria-label':'Test window for '+tstName(g)},
    ...[['','Closed'],['pre','Pre-Test open'],['post','Post-Test open']].map(([k,t])=>h('button',{type:'button',class:v===k?'on '+(k||'off'):'','aria-pressed':v===k?'true':'false',onclick:()=>{if(v!==k)tstSetWindow(C,g,k);}},t)));};
  const groups=[...SUBJECTS.map(s=>[s,SUBJ_GAMES[s.id].filter(tstHas)])].filter(x=>x[1].length);
  const gamesWithData=[...new Set(rows.map(r=>r.game))];
  if(!TSTD.game||!TEST_GAMES[TSTD.game])TSTD.game=gamesWithData[0]||Object.keys(W)[0]||null;
  const g=TSTD.game,list=g?tstByStudent(g):[];
  const both=list.filter(x=>x.pre&&x.post),avg=a=>a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):null;
  const aPre=avg(list.filter(x=>x.pre).map(x=>+x.pre.score)),aPost=avg(list.filter(x=>x.post).map(x=>+x.post.score)),aGain=avg(both.map(x=>x.post.score-x.pre.score));
  const cell=(x,k)=>x[k]?h('td',null,tstPct(x[k].score),' ',h('button',{type:'button',class:'tstreset',title:'Let this student take it again','aria-label':`Let ${x.name} retake the ${k}-test`,onclick:()=>tstReset(C,x,g,k)},'↺')):h('td',{class:'dim'},'—');
  return h('div',{class:'card',style:'margin-top:14px'},
    h('h3',{class:'td-sec',style:'margin-top:0'},'Pre-Test and Post-Test'),
    h('p',{class:'sub',style:'margin:0 0 6px'},'Open a Pre-Test before you teach a unit and a Post-Test after it. Each student takes each test once: the same questions both times, no hints, no feedback, score shown only at the end. While a Pre-Test is open, students must take it before they can play that game in Review mode.'),
    ...groups.map(([s,ids])=>h('div',{class:'tdsubj'},h('div',{class:'tdsubjh',style:`--c1:${s.c1}`},h('span',{class:'subjsym sm'},s.sym),h('b',null,s.name)),
      h('div',{class:'tstrows'},...ids.map(id=>h('div',{class:'tstrow'},h('span',{class:'nm'},tstName(id)),seg(id),
        h('small',{class:'cnt'},`Pre ${n(id)('pre')} · Post ${n(id)('post')} of ${C.students}`)))))),
    h('h3',{class:'td-sec'},'Compare scores'),
    TSTD.busy&&!TSTD.rows?h('p',{class:'sub'},'Loading…'):!gamesWithData.length?h('p',{class:'sub'},'No test scores yet. Open a Pre-Test above and your students’ scores will show here.'):
    h('div',null,
      h('div',{class:'tbar'},h('label',null,'Game: ',h('select',{onchange:e=>{TSTD.game=e.target.value;renderDash();}},...gamesWithData.map(x=>h('option',{value:x,selected:x===g},tstName(x))))),
        ngBtn('See the chart',()=>{PT.game=TSTD.game;TA.cls=C.id;openProgress({tab:'tests'});},'sm good'),ngBtn('Refresh',()=>tstLoad(C),'sm ghost'),ngBtn('Download CSV (all games)',()=>tstCsv(C),'sm ghost')),
      h('div',{class:'tstavg'},h('span',null,'Class average Pre ',h('b',null,aPre==null?'—':aPre+'%')),h('span',null,'Post ',h('b',null,aPost==null?'—':aPost+'%')),
        h('span',null,'Average growth ',h('b',null,aGain==null?'—':(aGain>=0?'+':'')+aGain+' points'),h('small',null,` (${both.length} student${both.length===1?'':'s'} took both)`))),
      h('div',{class:'tstwrap'},h('table',{class:'tsttab'},h('thead',null,h('tr',null,h('th',null,'Student'),h('th',null,'Pre-Test'),h('th',null,'Post-Test'),h('th',null,'Change'))),
        h('tbody',null,...list.map(x=>{const d=x.pre&&x.post?Math.round(x.post.score-x.pre.score):null;
          return h('tr',null,h('td',null,x.name),cell(x,'pre'),cell(x,'post'),h('td',{class:d==null?'dim':d>0?'up':d<0?'down':''},d==null?'—':(d>0?'+':'')+d));}))))));
}
async function tstReset(C,x,g,k){
  if(!(await modal({title:'Let them retake it?',text:`This deletes ${x.name}'s ${k==='pre'?'Pre':'Post'}-Test score for ${tstName(g)} so they can take it again (for example, if their Chromebook died). Their next score replaces it.`,ok:'Delete and allow retake'})))return;
  try{const r=await rpc('tt_a_test_reset',{p_student:x.sid,p_game:g,p_kind:k},10000);if(!r||!r.ok)throw 0;}catch(e){await modal({title:"That didn't work",text:'Check the Wi-Fi and try again.',cancel:false});}
  tstLoad(C);
}
function tstCsv(C){
  const q=v=>`"${String(v==null?'':v).replace(/"/g,'""')}"`,out=[['Student','Game','Pre-Test %','Post-Test %','Change','Pre date','Post date'].map(q).join(',')];
  [...new Set((TSTD.rows||[]).map(r=>r.game))].forEach(g=>tstByStudent(g).forEach(x=>{
    out.push([x.name,tstName(g),x.pre?x.pre.score:'',x.post?x.post.score:'',x.pre&&x.post?Math.round(x.post.score-x.pre.score):'',
      x.pre?x.pre.at.slice(0,10):'',x.post?x.post.at.slice(0,10):''].map(q).join(','));}));
  const a=h('a',{href:URL.createObjectURL(new Blob([out.join('\n')],{type:'text/csv'})),download:`${C.name} pre-post tests.csv`});document.body.append(a);a.click();a.remove();
}

/* ===================== STAR-GAME TESTS (Blackout!, Laser Maze, Coaster Architect, Evidence Lab, Separation Station, Atom Diner) =====================
   One shared screen (#s-gtest). Each game gives 3 fixed items, one per pack. An item is a still picture
   (nothing runs, so nothing gives the answer away) plus one-try questions:
     {title, text, svg:()=>svg string, alt, qs:[{id, q, opts:[[value,label],...], ans}]}
   The answers come from each game's own solver (boSolve, lzTrace, caGoals). Board shapes with
   data-gq="<question id>" can be tapped to cycle that question's choice. Item score = fraction of
   its questions right; test score = average of the 3 items. Review mode is not touched. */
const TEST_ITEMS={};
let GT=null;
PLAY_SCREENS.add('s-gtest');
function gtStart(g){
  GT={g,items:TEST_ITEMS[g](),k:0,res:[],pick:{}};
  TST.finish=()=>{if(!GT)return;const n=GT.items.length;while(GT.res.length<n)GT.res.push({i:GT.res.length+1,s:0,left:1});
    const r=GT.res;GT=null;tstFinish(r.reduce((a,x)=>a+x.s,0)/n*100,{items:r,left:true});};
  show('s-gtest');gtRender();
}
function gtCycle(qid){const it=GT.items[GT.k],q=it.qs.find(x=>x.id===qid);if(!q)return;
  const i=q.opts.findIndex(o=>o[0]===GT.pick[qid]);GT.pick[qid]=q.opts[(i+1)%q.opts.length][0];gtRender();}
function gtRender(){
  const it=GT.items[GT.k],n=GT.items.length,ready=it.qs.every(q=>GT.pick[q.id]!=null);
  $('gtKind').textContent=TST&&TST.kind==='post'?'Post-Test':'Pre-Test';$('gtGame').textContent=tstName(GT.g);
  $('gtNum').textContent=GT.k+1;$('gtOf').textContent=n;
  $('gtTitle').textContent=it.title;$('gtText').replaceChildren(...ngRich(it.text));
  const sv=svgEl(it.svg(GT.pick));sv.classList.add('gtsvg');sv.setAttribute('role','img');sv.setAttribute('aria-label',it.alt||it.title);
  sv.querySelectorAll('[data-gq]').forEach(e=>{const q=it.qs.find(x=>x.id===e.dataset.gq);if(!q)return;const v=GT.pick[q.id];
    e.setAttribute('data-pick',v==null?'':v);const lab=e.querySelector('.gtlab');if(lab)lab.textContent=v==null?'?':(q.opts.find(o=>o[0]===v)||['',''])[1];
    e.addEventListener('click',()=>gtCycle(q.id));});
  $('gtBoard').replaceChildren(sv);
  $('gtQs').replaceChildren(...it.qs.map((q,qi)=>h('div',{class:'gtq'},h('div',{class:'gtqt'},h('span',{class:'stepchip'},String(qi+1)),h('span',null,...ngRich(q.q))),
    h('div',{class:'gtopts',role:'group','aria-label':q.q.replace(/\*\*/g,'')},...q.opts.map(([v,l])=>h('button',{type:'button',class:'gtopt'+(GT.pick[q.id]===v?' on':''),'aria-pressed':GT.pick[q.id]===v?'true':'false',
      onclick:()=>{GT.pick[q.id]=v;gtRender();}},l))))));
  $('gtSave').disabled=!ready;$('gtSave').classList.toggle('pulse',ready);
  $('gtLeft').textContent=ready?'':'Answer every question to save.';
}
function gtSave(){
  if(!GT)return;const it=GT.items[GT.k];if(!it.qs.every(q=>GT.pick[q.id]!=null))return;
  const a={};let ok=0;it.qs.forEach(q=>{a[q.id]=GT.pick[q.id];if(GT.pick[q.id]===q.ans)ok++;});
  /* an item may score itself (e.g. Separation Station: any working machine order is right) */
  const sc=it.score?Math.max(0,Math.min(1,it.score(a))):ok/it.qs.length;
  GT.res.push({i:GT.k+1,s:Math.round(sc*1000)/1000,a});GT.pick={};tstSaved();
  if(GT.k+1<GT.items.length){GT.k++;gtRender();window.scrollTo(0,0);return;}
  const r=GT.res,n=GT.items.length;GT=null;tstFinish(r.reduce((s,x)=>s+x.s,0)/n*100,{items:r});
}
$('gtSave').onclick=gtSave;$('gtQuit').onclick=()=>tstQuit();
/* a tappable answer marker drawn on a board */
const gtMark=(id,cx,cy,r,lx,ly,an)=>`<g class="gtpick" data-gq="${id}"><circle class="gtring" cx="${cx}" cy="${cy}" r="${r}"/><text class="gtlab" x="${lx}" y="${ly}" text-anchor="${an||'middle'}">?</text></g>`;

/* ---------- Blackout! (MS-PS3-6): still circuits, predict the lamps ---------- */
function boTestSvg(L,parts,view,ask){
  const w=(L.cols-1)*BOS+BOP*2,hh=(L.rows-1)*BOS+BOP*2+36,blank={cur:{},lamps:{},batt:{},short:false};
  let s=`<svg viewBox="0 0 ${w} ${hh}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${hh}" rx="16" fill="#10182e"/>`;
  Object.keys(parts).forEach(k=>{s+=boPartG(k,Object.assign({fixed:true},parts[k]),blank,view);});
  for(let r=0;r<L.rows;r++)for(let c=0;c<L.cols;c++){const p=boPt(c,r);s+=`<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#10182e" stroke="#aab4d1" stroke-width="3"/>`;}
  Object.keys(parts).forEach(k=>{const p=parts[k];if(p.t!=='L')return;const e=boEnds(k),mx=(e[0][0]+e[1][0])/2,my=(e[0][1]+e[1][1])/2,q=k.split(':'),burnt=view&&view.burn&&view.burn.includes(p.id);
    const side=q[0]==='h'?0:(+q[1]<L.cols-1?1:-1),tx=side?mx+side*42:mx,ty=side?my-6:my+50,an=side>0?'start':side<0?'end':'middle';
    s+=`<text x="${tx}" y="${ty}" text-anchor="${an}" font-size="16" font-weight="800" fill="#e8eeff" font-family="system-ui">${L.names[p.id]}</text>`+
      (burnt?`<text x="${tx}" y="${ty+18}" text-anchor="${an}" font-size="13" font-weight="800" fill="#ff8a8a" font-family="system-ui">burned out</text>`:'');
    if(ask.includes(p.id))s+=gtMark(p.id,mx,my,34,tx,ty+21,an);});
  return s+'</svg>';
}
const boLit=(L,parts,opt,id)=>{const r=boSolve(L,parts,opt);return r.lamps[id]&&r.lamps[id].level>0?'lit':'dark';};
const BO_LD=[['lit','Lit'],['dark','Dark']];
TEST_ITEMS.blackout=()=>{
  const W=(...k)=>Object.fromEntries(k.map(x=>[x,{t:'w'}]));
  /* 1. Closed circuit (pack 1): a loop with a closed switch, plus a lamp on a dead-end wire */
  const L1={cols:6,rows:3,names:{a:'Lamp A',b:'Lamp B',c:'Lamp C'}};
  const P1=Object.assign(W('h:0:0','h:2:0','h:4:0','h:0:1','h:1:1','h:2:1','h:3:1','h:4:1','h:2:2'),
    {'v:0:0':{t:'B',o:1},'h:1:0':{t:'L',id:'a'},'h:3:0':{t:'S',id:'s1',open:false},'v:5:0':{t:'L',id:'b'},'v:2:1':{t:'L',id:'c'}});
  /* 2. Parallel circuit (pack 2): A and B in series on one branch, C on its own branch; Lamp A burns out */
  const L2={cols:5,rows:3,names:{a:'Lamp A',b:'Lamp B',c:'Lamp C'}};
  const P2=Object.assign(W('v:0:1','h:0:0','h:1:0','h:2:0','h:3:0','h:0:2','h:1:2','h:2:2','h:3:2','v:4:1'),
    {'v:0:0':{t:'B',o:1},'v:2:0':{t:'L',id:'a'},'v:2:1':{t:'L',id:'b'},'v:4:0':{t:'L',id:'c'}});
  /* 3. Switch and battery (pack 3): two batteries that push the same way, one lamp, one switch */
  const L3={cols:4,rows:2,names:{a:'Lamp'}};
  const P3=Object.assign(W('h:0:0','h:0:1','h:1:1','h:2:1'),{'v:0:0':{t:'B',o:-1},'v:3:0':{t:'B',o:1},'h:1:0':{t:'L',id:'a'},'h:2:0':{t:'S',id:'s1',open:true}});
  const P3f=Object.assign({},P3,{'v:0:0':{t:'B',o:1}});
  return [
    {title:'Which lamps light up?',text:'The switch is **closed**. Predict each lamp: **Lit** or **Dark**.',alt:'A circuit with a battery, a closed switch and three lamps',
     svg:()=>boTestSvg(L1,P1,null,['a','b','c']),
     qs:['a','b','c'].map(id=>({id,q:`**${L1.names[id]}**`,opts:BO_LD,ans:boLit(L1,P1,{},id)}))},
    {title:'A bulb burns out',text:'Every lamp was on. Then **Lamp A burns out**. Which lamps are still lit?',alt:'A circuit with two branches. Lamp A is burned out.',
     svg:()=>boTestSvg(L2,P2,{burn:['a'],open:[]},['b','c']),
     qs:['b','c'].map(id=>({id,q:`**${L2.names[id]}**`,opts:BO_LD,ans:boLit(L2,P2,{burn:['a']},id)}))},
    {title:'Switches and batteries',text:'Two batteries, one lamp and a switch. The picture shows the switch **open**.',alt:'A circuit with two batteries, one lamp and an open switch',
     svg:()=>boTestSvg(L3,P3,null,[]),
     qs:[{id:'open',q:'The switch is **open** (as shown). What does the lamp do?',opts:BO_LD,ans:boLit(L3,P3,{useState:true},'a')},
         {id:'closed',q:'The switch is **closed**. What does the lamp do?',opts:BO_LD,ans:boLit(L3,P3,{},'a')},
         {id:'flip',q:'The switch is closed and the **left battery is flipped** the other way. What does the lamp do?',opts:BO_LD,ans:boLit(L3,P3f,{},'a')}]}];
};

/* ---------- Laser Maze (MS-PS4-2): still boards, predict which crystals light ---------- */
function lzTestSvg(map,placed){
  const L=lzParse({map}),S=64,W=L.W,H=L.H;placed=placed||{};
  let s=`<svg viewBox="0 0 ${W*S} ${H*S}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="lzMir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fc"/><stop offset=".5" stop-color="#aab6cc"/><stop offset="1" stop-color="#eef2f9"/></linearGradient>`+
   `<pattern id="lzHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#2a3149"/><rect width="4" height="10" fill="#343c58"/></pattern></defs><rect width="${W*S}" height="${H*S}" rx="14" fill="#141b2f"/>`;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)s+=`<rect x="${x*S+1.5}" y="${y*S+1.5}" width="${S-3}" height="${S-3}" rx="7" fill="${(x+y)%2?'#1b2440':'#18203a'}"/>`;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=L.cells[y][x],cx=x*S+S/2,cy=y*S+S/2;
    if(c==='#')s+=`<rect x="${x*S+2}" y="${y*S+2}" width="${S-4}" height="${S-4}" rx="6" fill="url(#lzHatch)" stroke="#4a5476" stroke-width="2"/>`;
    else if(c==='g')s+=`<rect x="${x*S+6}" y="${y*S+6}" width="${S-12}" height="${S-12}" rx="6" fill="#8fd0ff" fill-opacity=".2" stroke="#a9dcff" stroke-opacity=".9" stroke-width="2"/>`;
    else if(c==='/'||c==='\\')s+=lzPiece('M',c,cx,cy,'fixed');
    else if(c==='t'||c==='u')s+=lzPiece('T',c==='t'?'/':'\\',cx,cy,'fixed');}
  Object.keys(placed).forEach(k=>{const p=placed[k],q=k.split(',').map(Number);s+=lzPiece(p.t,p.o,q[0]*S+S/2,q[1]*S+S/2,'fixed');});
  const ls=L.laser,lcx=ls.x*S+S/2,lcy=ls.y*S+S/2,ang=Math.atan2(ls.dy,ls.dx)*180/Math.PI;
  s+=`<g transform="rotate(${ang} ${lcx} ${lcy})"><rect x="${lcx-26}" y="${lcy-19}" width="48" height="38" rx="9" fill="#2c3550" stroke="#5a6794" stroke-width="2"/><rect x="${lcx+8}" y="${lcy-10}" width="22" height="20" rx="5" fill="#1a2036" stroke="#5a6794" stroke-width="2"/><circle cx="${lcx+31}" cy="${lcy}" r="6" fill="#7a2638"/><circle cx="${lcx-12}" cy="${lcy}" r="5" fill="#37e0c1"/></g>`;
  L.targets.forEach((t,i)=>{const cx=t.x*S+S/2,cy=t.y*S+S/2,nm=String.fromCharCode(65+i);
    s+=`<polygon points="${cx},${cy-22} ${cx+16},${cy} ${cx},${cy+22} ${cx-16},${cy}" fill="#4a587a" stroke="#8b9abf" stroke-width="2.4"/><text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="15" font-weight="900" fill="#fff" font-family="system-ui">${nm}</text>`+gtMark(nm,cx,cy,29,cx,cy+45);});
  L.alarms.forEach(a=>{const cx=a.x*S+S/2,cy=a.y*S+S/2;s+=`<rect x="${cx-19}" y="${cy+8}" width="38" height="11" rx="4" fill="#3a4263"/><path d="M${cx-17} ${cy+9}a17 17 0 0 1 34 0z" fill="#7a2638" stroke="#a74a5d" stroke-width="2"/>`;});
  return s+'</svg>';
}
const LZ_LD=[['lit','Lights up'],['dark','Stays dark']];
function lzTestQs(map,placed){const L=lzParse({map}),tr=lzTrace(L,placed||{});
  return L.targets.map((t,i)=>{const nm=String.fromCharCode(65+i);return {id:nm,q:`Crystal **${nm}**`,opts:LZ_LD,ans:tr.lit[t.x+','+t.y]?'lit':'dark'};});}
TEST_ITEMS.laser=()=>{
  /* 1. Mirrors (pack 1): two fixed mirrors */
  const M1=['....*...','........','>...\\...','........','*...\\..*'];
  /* 2. Glass (pack 2): a tilted glass splits the beam */
  const M2=['....*...','........','>...t..*','...#....','...*....'];
  /* 3. Shields (pack 3): tilted glass, a mirror and a black block */
  const M3=['*..#...*','........','>..u....','........','...\\...*'],B3={'6,2':{t:'B',o:'/'}};
  const tr2=lzTrace(lzParse({map:M2}),{}),split=Math.min(...tr2.segs.map(q=>q[4]))<1;
  return [
    {title:'Follow the mirrors',text:'When the laser turns on, which crystals will light up? Mirrors reflect all the light.',alt:'A laser board with two fixed mirrors and three crystals',
     svg:()=>lzTestSvg(M1),qs:lzTestQs(M1)},
    {title:'Tilted glass',text:'The tilted glass **reflects some** light and **lets some through**. Which crystals light up?',alt:'A laser board with a tilted glass, a wall and three crystals',
     svg:()=>lzTestSvg(M2),qs:[...lzTestQs(M2),{id:'weak',q:'After the glass splits the beam, each new beam is…',opts:[['weaker','Weaker'],['same','Just as strong'],['stronger','Stronger']],ans:split?'weaker':'same'}]},
    {title:'Glass, mirror and black block',text:'The black square is a **black block**. Which crystals light up?',alt:'A laser board with a tilted glass, a mirror, a black block and three crystals',
     svg:()=>lzTestSvg(M3,B3),qs:[...lzTestQs(M3,B3),{id:'black',q:'What does the black block do to light that hits it?',opts:[['absorb','Absorbs it'],['reflect','Reflects it'],['pass','Lets it pass through']],ans:'absorb'}]}];
};

/* ---------- Coaster Architect (MS-PS3-1, PS3-2): still tracks, predict from the energy model ---------- */
function caTestTrack(t,y0,hgt){
  /* t: {L, Hs, steel, marks:{post:'A'}, label}. Drawn with no energy line and no ride. */
  const ctx=caCtx(t.L,{},t.steel||[]),S=caSamples(t.L,t.Hs,ctx),n=t.Hs.length,M=hgt/12.5,G=y0+hgt-14,X0=70,X1=850;
  const xk=k=>X0+k*(X1-X0)/(n-1),px=p=>p.loop?xk(p.k)+p.r*M*Math.sin(p.th):xk(p.k),py=y=>G-y*M;
  let s=`<rect x="0" y="${y0}" width="900" height="${hgt}" fill="url(#gtcaSky)"/><rect x="0" y="${G}" width="900" height="${y0+hgt-G}" fill="url(#gtcaGrass)"/>`;
  for(let m=0;m<=10;m+=2)s+=`<line x1="0" x2="900" y1="${py(m)}" y2="${py(m)}" stroke="#fff" stroke-opacity=".45"/><text x="6" y="${py(m)-3}" font-size="11" font-weight="700" fill="#3a5a7a" font-family="system-ui">${m} m</text>`;
  t.Hs.forEach((v,i)=>{if(v>0)s+=`<path d="M${xk(i)-8} ${G}L${xk(i)} ${py(v)}L${xk(i)+8} ${G}" stroke="#8a5a2e" stroke-width="3" fill="none"/>`;});
  const segs=[];S.forEach(p=>{(segs[p.seg]=segs[p.seg]||[]).push(p);});
  segs.forEach((pts,j)=>{const prev=j>0?segs[j-1][segs[j-1].length-1]:null,all=prev?[prev,...pts]:pts,d=all.map((p,i)=>(i?'L':'M')+px(p).toFixed(1)+' '+py(p.y).toFixed(1)).join(''),st=ctx.steel.includes(j);
    s+=st?`<path d="${d}" fill="none" stroke="#2a3550" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#dfe8f6" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
      :`<path d="${d}" fill="none" stroke="#4a2e14" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#8a5a2e" stroke-width="14" stroke-dasharray="3 9" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e0a85a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;});
  ctx.pts.forEach((p,i)=>{const v=t.Hs[i];s+=`<text x="${xk(i)}" y="${py(p.loop?v+2*p.loop:v)-(i===0?40:(t.marks||{})[i]?22:12)}" text-anchor="middle" font-size="14" font-weight="800" fill="#1b2a4a" font-family="system-ui" stroke="#fff" stroke-width="3" paint-order="stroke">${p.loop?p.loop+' m radius loop':v+' m'}</text>`;});
  Object.entries(t.marks||{}).forEach(([i,nm])=>{const x=xk(+i),y=py(t.Hs[i]);s+=`<circle cx="${x}" cy="${y}" r="13" fill="#2f6bff" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="system-ui">${nm}</text>`;});
  const cx=xk(0)+14,cy=py(t.Hs[0]);
  s+=`<g transform="translate(${cx} ${cy})"><rect x="-17" y="-22" width="34" height="16" rx="6" fill="#e0453c" stroke="#7a1414" stroke-width="2"/><circle cx="-9" cy="-4" r="4.5" fill="#2a2f45"/><circle cx="9" cy="-4" r="4.5" fill="#2a2f45"/></g>`;
  if(t.label)s+=`<rect x="${900-10-t.label.length*8.4}" y="${y0+8}" width="${t.label.length*8.4}" height="24" rx="12" fill="#fff" opacity=".9"/><text x="${900-10-t.label.length*4.2}" y="${y0+25}" text-anchor="middle" font-size="14" font-weight="900" fill="#1b2a4a" font-family="system-ui">${t.label}</text>`;
  return s;
}
function caTestSvg(tracks){
  const hgt=tracks.length>1?210:330,H=hgt*tracks.length+(tracks.length-1)*8;
  let s=`<svg viewBox="0 0 900 ${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gtcaSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb2f5"/><stop offset="1" stop-color="#e8f6ff"/></linearGradient><linearGradient id="gtcaGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fbf4f"/><stop offset="1" stop-color="#3f8a36"/></linearGradient><clipPath id="gtcaClip"><rect width="900" height="${H}" rx="16"/></clipPath></defs><g clip-path="url(#gtcaClip)">`;
  tracks.forEach((t,i)=>{s+=caTestTrack(t,i*(hgt+8),hgt);});
  return s+'</g></svg>';
}
TEST_ITEMS.coaster=()=>{
  const lv=(pts,fr)=>({pts,fr,goals:[]}),spd=(L,Hs,ctx,i)=>Math.sqrt(2*CA_G*Math.max(0,Hs[0]-ctx.lossAt(i)-Hs[i]));
  /* 1. Hills (pack 1): no friction, the second hill is taller than the start */
  const L1=lv([{lo:3,hi:16},{h:0},{h:7},{h:0}],0),H1=[6,0,7,0],c1=caCtx(L1),g1=caGoals(L1,H1,c1);
  const far=g1.f<0?H1.length:Math.ceil(g1.S[g1.f].k),best=[0,1,2].filter(i=>i<far).reduce((b,i)=>spd(L1,H1,c1,i)>spd(L1,H1,c1,b)?i:b,0);
  /* 2. Friction (pack 2): same track, wood vs steel */
  const L2=lv([{lo:3,hi:16},{h:0},{h:5},{h:0}],0.6),H2=[8,0,5,0],w2=caCtx(L2,{},[]),s2=caCtx(L2,{},[0,1,2]);
  const vw=caGoals(L2,H2,w2).ok?spd(L2,H2,w2,3):0,vs=caGoals(L2,H2,s2).ok?spd(L2,H2,s2,3):0;
  /* 3. Loop (pack 3): start height equal to the loop top, below 2.5 × radius */
  const L3=lv([{lo:3,hi:16},{h:0},{h:0,loop:3},{h:0}],0),H3=[6,0,0,0],ok3=caGoals(L3,H3,caCtx(L3)).ok;
  return [
    {title:'Two hills',text:'No friction on this track. The cart starts at the top of the **6 m** hill.',alt:'A coaster track: a 6 m start hill, a dip, then a 7 m hill',
     svg:()=>caTestSvg([{L:L1,Hs:H1,marks:{0:'A',1:'B',2:'C'}}]),
     qs:[{id:'clear',q:'Will the cart make it over the **7 m** hill?',opts:[['yes','Yes'],['no','No']],ans:g1.ok?'yes':'no'},
         {id:'fast',q:'Where does the cart have the **most kinetic energy** (the most speed)?',opts:[['A','A: top of the start hill'],['B','B: bottom of the drop'],['C','C: top of the 7 m hill']],ans:'ABC'[best]}]},
    {title:'Wood vs steel',text:'Two carts start at **8 m** on the same shape of track. Wooden track has more friction than steel track.',alt:'Two identical coaster tracks, one wooden and one steel',
     svg:()=>caTestSvg([{L:L2,Hs:H2,label:'Cart 1: wooden track'},{L:L2,Hs:H2,steel:[0,1,2],label:'Cart 2: steel track'}]),
     qs:[{id:'faster',q:'Which cart is going **faster at the end**?',opts:[['1','Cart 1 (wood)'],['2','Cart 2 (steel)'],['same','Same speed']],ans:Math.abs(vw-vs)<0.05?'same':vw>vs?'1':'2'},
         {id:'lost',q:'Cart 1 ends with less energy. Where did that energy go?',opts:[['heat','It turned into heat from friction'],['gone','It was destroyed'],['height','It was stored as height']],ans:'heat'}]},
    {title:'Loop the loop',text:'No friction. The cart starts at **6 m**. The loop has a **3 m radius**, so its top is 6 m high.',alt:'A coaster track: a 6 m start hill and a loop with a 3 m radius',
     svg:()=>caTestSvg([{L:L3,Hs:H3}]),
     qs:[{id:'loop',q:'Will the cart make it all the way around the loop?',opts:[['yes','Yes'],['no','No']],ans:ok3?'yes':'no'},
         {id:'why',q:'Why?',opts:[['need','A loop needs a start at least 2.5 × the radius (7.5 m) so the cart still has speed at the top'],['top','The start is as tall as the loop top, so that is exactly enough'],['heavy','A heavy cart always makes the loop']],ans:'need'}]}];
};

/* ---------- shared drawing bits for the Session B tests ---------- */
const gtEsc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const gtTxt=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'start'}" font-size="${o.s||15}" font-weight="${o.w||700}" fill="${o.c||'#22304f'}" font-family="system-ui">${gtEsc(t)}</text>`;};
const gtIcon=(n,x,y,sz)=>ART.cic(n).replace('<svg ',`<svg x="${x}" y="${y}" width="${sz}" height="${sz}" `);

/* ---------- Evidence Lab (MS-PS1-2, PS1-7): results already written down, no testing ---------- */
function evTestPage(sample,rows,cands,cols){
  /* rows: [[label, result]]; cands/cols: the field guide (substances x tests) */
  const W=900,gx=330,nw=118,cw=(W-gx-20-nw)/cols.length,H=Math.max(110+rows.length*44,96+cands.length*46)+20;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" rx="16" fill="#2b3550"/>`+
   `<rect x="16" y="16" width="296" height="${H-32}" rx="10" fill="#fffaf0" stroke="#d9cfb5" stroke-width="2"/>`;
  for(let y=82;y<H-24;y+=44)s+=`<line x1="28" x2="300" y1="${y+8}" y2="${y+8}" stroke="#bcd3f0" stroke-width="1.5"/>`;
  s+=`<line x1="58" x2="58" y1="16" y2="${H-16}" stroke="#f2a7a7" stroke-width="2"/>`+gtTxt(70,46,'Lab notebook',{s:18,w:900})+gtTxt(70,68,sample,{s:13,c:'#6b7894'});
  rows.forEach(([k,v],i)=>{s+=gtTxt(70,108+i*44,k+':',{s:14,c:'#5b6b8c'})+gtTxt(70,126+i*44,v,{s:16,w:900,c:'#1b2a4a'});});
  s+=`<rect x="${gx}" y="16" width="${W-gx-16}" height="${H-32}" rx="10" fill="#f4f7fd" stroke="#c7d2e8" stroke-width="2"/>`+
   `<rect x="${gx+(W-gx-16)/2-40}" y="8" width="80" height="18" rx="6" fill="#8a96b3"/>`+gtTxt(gx+16,50,'Field guide',{s:18,w:900});
  const wrap=v=>{if(v.length<=11)return [v];const w=v.split(' ');let a=w[0],i=1;while(i<w.length-1&&(a+' '+w[i]).length<=11)a+=' '+w[i++];return [a.replace(/,$/,''),w.slice(i).join(' ')];};
  cols.forEach((t,j)=>{s+=gtTxt(gx+nw+cw*j+cw/2,80,EV_SHORT[t],{s:13,w:800,a:'middle',c:'#5b6b8c'});});
  cands.forEach((c,i)=>{const y=96+i*46;s+=`<rect x="${gx+10}" y="${y}" width="${W-gx-36}" height="40" rx="8" fill="${i%2?'#fff':'#eaf0fb'}"/>`+gtTxt(gx+20,y+25,EV_SUBS[c].n,{s:15,w:900});
    cols.forEach((t,j)=>{const ln=wrap(EV_SUBS[c][t]);ln.forEach((l,k)=>{s+=gtTxt(gx+nw+cw*j+cw/2,y+(ln.length>1?18+k*15:25),l,{s:12.5,w:700,a:'middle'});});});});
  return s+'</svg>';
}
function evTestStickers(sc,tests){
  const S=EV_SC[sc],W=900,H=250;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" rx="16" fill="#2b3550"/>`+
   gtTxt(24,42,'Evidence board: '+S.n,{s:19,w:900,c:'#fff'})+gtTxt(24,66,S.story,{s:14,c:'#cdd6ec'});
  const cw=(W-48-(tests.length-1)*12)/tests.length;
  tests.forEach((t,i)=>{const k=evSticker(sc,t),x=24+i*(cw+12),y=90,col=k.k==='weak'?['#fff3c4','#b98a00']:k.k==='none'?['#e9edf6','#6b7894']:['#ffe1cc','#c2541a'];
    const words=S[t][1].split(' '),lines=[''];words.forEach(w=>{if((lines[lines.length-1]+' '+w).trim().length>15)lines.push(w);else lines[lines.length-1]=(lines[lines.length-1]+' '+w).trim();});
    const tt=EV_RT[t].n.length>14?EV_RT[t].n.replace(/ (\S+)$/,'\n$1').split('\n'):[EV_RT[t].n];
    s+=`<g transform="rotate(${i%2?2:-2} ${x+cw/2} ${y+70})"><rect x="${x}" y="${y}" width="${cw}" height="140" rx="14" fill="${col[0]}" stroke="${col[1]}" stroke-width="3"/>`+
      gtTxt(x+cw/2,y+26,k.lab,{s:12.5,w:900,a:'middle',c:col[1]})+tt.map((l,j)=>gtTxt(x+cw/2,y+52+j*18,l,{s:15,w:900,a:'middle'})).join('')+
      lines.map((l,j)=>gtTxt(x+cw/2,y+(tt.length>1?100:88)+j*19,l,{s:14,w:700,a:'middle',c:'#33415f'})).join('')+'</g>';});
  return s+'</svg>';
}
TEST_ITEMS.evidence=()=>{
  /* answer = the one candidate that matches every shown result (checked with the game's own evSubsOK) */
  const solve=(cands,tests,secret)=>{const m=cands.filter(c=>tests.every(t=>EV_SUBS[c][t]===EV_SUBS[secret][t]));if(m.length!==1||!evSubsOK(cands,tests,secret))console.warn('Evidence test: case not unique',secret);return m[0];};
  /* 1. Powder case (pack 1, Flour Power): iodine says "starch", heat tells the two starches apart */
  const C1=['flour','cornstarch','soda'],T1=['water','iodine','heat'],A1=solve(C1,T1,'flour');
  /* 2. Metal case (pack 2, Fool's Gold): density and magnet; the seller says it is gold */
  const C2=['gold','brass','pyrite','leadbar'],T2=['magnet','density'],A2=solve(C2,T2,'pyrite'),d2=parseFloat(EV_SUBS[A2].density);
  /* 3. Reaction or not (pack 3, Cold Case): only weak clues, no strong sign of new stuff */
  const R3=['gas','solid','smell','color','temp'],A3=evProof('dye',R3,R3);
  return [
    {title:'Name the powder',text:'A white powder lost its label. The tests are already done. Use the **field guide** to name it.',alt:'A lab notebook with three test results next to a field guide of three powders',
     svg:()=>evTestPage('Mystery powder',T1.map(t=>[EV_TOOL[t][1],EV_SUBS[A1][t]]),C1,['look','water','vinegar','iodine','heat']),
     qs:[{id:'name',q:'Which substance is the mystery powder?',opts:C1.map(c=>[c,EV_SUBS[c].n]),ans:A1}]},
    {title:'Is it really gold?',text:'A seller says this shiny yellow nugget is **real gold**. Here are the test results.',alt:'A lab notebook with a magnet result and a density result next to a field guide of four yellow metals',
     svg:()=>evTestPage('Shiny yellow nugget',[['Hold a magnet close',EV_SUBS[A2].magnet],['Density check',`${Math.round(d2*10)} g ÷ 10 mL = ${EV_SUBS[A2].density}`]],C2,['look','magnet','conduct','density']),
     qs:[{id:'name',q:'What is the nugget really made of?',opts:C2.map(c=>[c,EV_SUBS[c].n]),ans:A2}]},
    {title:'Reaction or not?',text:'Here is every evidence sticker for this event. Decide what kind of change it was.',alt:'Five evidence stickers for food coloring dropped into water',
     svg:()=>evTestStickers('dye',R3),
     qs:[{id:'stamp',q:'Stamp it:',opts:[['chem','Chemical reaction (new stuff formed)'],['phys','Physical change (same stuff)']],ans:A3}]}];
};

/* ---------- Separation Station (MS-PS1-8): plan the belt, nothing runs ---------- */
function sepTestSvg(L,n,tools,pick){
  const W=900,H=330,mix=L.mix;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gtsepBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26324f"/><stop offset="1" stop-color="#1a2338"/></linearGradient></defs><rect width="${W}" height="${H}" rx="16" fill="url(#gtsepBg)"/>`;
  /* the hopper with the mixture */
  s+=`<path d="M24 34h220l-30 120h-160z" fill="#3a4766" stroke="#6f7fa6" stroke-width="3" stroke-linejoin="round"/>`+gtTxt(134,26,'The mixture',{s:14,w:900,a:'middle',c:'#cfd8ee'});
  const per=mix.length>3?2:mix.length,rows=Math.ceil(mix.length/per),isz=rows>1?34:44;
  mix.forEach((k,i)=>{const row=Math.floor(i/per),inRow=Math.min(per,mix.length-row*per),cx=134+((i%per)-(inRow-1)/2)*84,cy=rows>1?52+row*52:62;
    s+=gtIcon(SB[k].ic,cx-isz/2,cy,isz)+gtTxt(cx,cy+isz+12,cap1(SB[k].n.replace(' pieces','').replace('Cooking ','')),{s:12,w:800,a:'middle',c:'#fff'});});
  const gl=L.goal.map(k=>SB[k].n.replace(' pieces','').replace('Cooking ','').toLowerCase());
  s+=gtTxt(134,182,'Get back pure:',{s:13,w:800,a:'middle',c:'#9fb0d6'})+gtTxt(134,202,gl.slice(0,2).join(', ')+(gl.length>2?',':''),{s:13.5,w:900,a:'middle',c:'#ffd76a'})+
    (gl.length>2?gtTxt(134,220,gl.slice(2).join(', '),{s:13.5,w:900,a:'middle',c:'#ffd76a'}):'');
  /* the belt with empty numbered slots (a picked machine shows in its slot) */
  const x0=276,bw=W-x0-24,sw=Math.min(150,(bw-(n-1)*14)/n);
  s+=`<rect x="${x0-14}" y="168" width="${bw+28}" height="22" rx="11" fill="#55617f"/>`;
  for(let i=0;i<n;i++){const x=x0+i*(sw+14),m=pick&&pick['s'+(i+1)];
    s+=`<rect x="${x}" y="64" width="${sw}" height="100" rx="12" fill="${m?'#e9f0ff':'rgba(255,255,255,.06)'}" stroke="${m?'#6aa7ff':'#9aa6c6'}" stroke-width="2.5" ${m?'':'stroke-dasharray="7 6"'}/>`+
      gtTxt(x+sw/2,56,'Step '+(i+1),{s:13,w:900,a:'middle',c:'#cfd8ee'})+
      (m?gtIcon(MACH[m].ic,x+sw/2-24,76,48)+gtTxt(x+sw/2,150,MACH[m].n,{s:12.5,w:900,a:'middle'}):gtTxt(x+sw/2,124,'?',{s:34,w:900,a:'middle',c:'#9aa6c6'}));
    if(i<n-1)s+=`<path d="M${x+sw+3} 114l8 0" stroke="#9aa6c6" stroke-width="3"/>`;}
  /* the machines you may use (names only) */
  s+=gtTxt(24,246,'Machines you can use:',{s:13,w:800,c:'#9fb0d6'});
  tools.forEach((m,i)=>{const x=24+i*(W-48)/tools.length;s+=gtIcon(MACH[m].ic,x,258,40)+gtTxt(x+46,284,MACH[m].n,{s:13,w:800,c:'#fff'});});
  return s+'</svg>';
}
function sepTestItem(lvName,n,title,text){
  const L=SEP_LEVELS.find(x=>x.name===lvName),tools=sepTools(L),ok=[];
  /* every belt of exactly n machines that works (the game's own sepRun decides) */
  for(let c=0;c<Math.pow(tools.length,n);c++){const b=[];let x=c;for(let j=0;j<n;j++){b.push(tools[x%tools.length]);x=Math.floor(x/tools.length);}if(sepRun(L,b).ok)ok.push(b);}
  if(!ok.length)console.warn('Separation test: no answer',lvName);
  const belt=a=>Array.from({length:n},(_,i)=>a['s'+(i+1)]);
  return {title,text,alt:`A mixture of ${L.mix.map(k=>SB[k].n.toLowerCase()).join(', ')} and an empty factory belt with ${n} step${n>1?'s':''}`,
    svg:p=>sepTestSvg(L,n,tools,p),
    qs:Array.from({length:n},(_,i)=>({id:'s'+(i+1),q:n>1?`**Step ${i+1}**`:'Which machine?',opts:tools.map(m=>[m,MACH[m].n]),ans:ok[0]?ok[0][i]:null})),
    /* full credit for any working order; otherwise the fraction of steps that match the closest working order */
    score:a=>{const b=belt(a);if(sepRun(L,b).ok)return 1;return ok.reduce((best,o)=>Math.max(best,o.filter((m,i)=>m===b[i]).length/n),0);},
    sols:ok};
}
TEST_ITEMS.sep=()=>[
  sepTestItem('Junkyard Cleanup',1,'One machine','Pick the **one machine** that gets back both substances, pure.'),
  sepTestItem('Muddy Sea',2,'Two steps','Pick **2 machines** in order. Step 1 runs first.'),
  sepTestItem('Pool Party Cleanup',3,'Harder mix','Pick **3 machines** in order. Step 1 runs first.')];

/* ---------- Atom Diner (MS-PS1-5): untimed orders, count the atoms ---------- */
function dnTestSvg(R,P,hideP){
  /* the shelf shows sealed ingredient jars (formulas only, not smashed), so the student counts from the formula */
  const W=900,H=250;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gtdnBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6c7"/><stop offset="1" stop-color="#f6c992"/></linearGradient>`+
   `<linearGradient id="gtdnJar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9f4ff"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d7e8fa"/></linearGradient></defs><rect width="${W}" height="${H}" rx="16" fill="url(#gtdnBg)"/>`;
  s+=`<rect x="16" y="16" width="560" height="${H-32}" rx="12" fill="#fff8ee" stroke="#d9a86a" stroke-width="2"/>`+gtTxt(32,44,'Ingredients on the shelf',{s:17,w:900});
  const jars=[];R.forEach(([n,f])=>{for(let i=0;i<n;i++)jars.push(f);});
  const jw=Math.min(84,(528-(jars.length-1)*8)/jars.length),x0=296-(jars.length*jw+(jars.length-1)*8)/2;
  s+=`<rect x="28" y="182" width="536" height="12" rx="4" fill="#b9814a"/>`;
  jars.forEach((f,i)=>{const x=x0+i*(jw+8),lab=fmtFormula(parseF(f));
    s+=`<rect x="${x+jw*.18}" y="64" width="${jw*.64}" height="14" rx="4" fill="#c46a3a"/><rect x="${x}" y="76" width="${jw}" height="106" rx="14" fill="url(#gtdnJar)" stroke="#8fb0d6" stroke-width="2"/>`+
      `<rect x="${x+5}" y="108" width="${jw-10}" height="40" rx="8" fill="#fff" stroke="#e2487a" stroke-width="2"/>`+gtTxt(x+jw/2,135,lab,{s:lab.length>4?15:19,w:900,a:'middle',c:'#1b2a4a'});});
  const groups=R.map(([n,f])=>`${n} × ${fmtFormula(parseF(f))}`).join('   +   ');
  s+=gtTxt(296,222,groups,{s:16,w:900,a:'middle',c:'#5b4630'});
  /* order ticket */
  s+=`<g transform="rotate(1.5 740 125)"><rect x="604" y="22" width="276" height="${H-44}" rx="6" fill="#fff" stroke="#c9ced8" stroke-width="2"/><rect x="604" y="22" width="276" height="34" rx="6" fill="#e2487a"/>`+gtTxt(742,45,'ORDER TICKET',{s:15,w:900,a:'middle',c:'#fff'});
  P.forEach(([n,f],i)=>{s+=gtTxt(626,96+i*44,(hideP?'? × ':n+' × ')+fmtFormula(parseF(f)),{s:24,w:900,c:'#1b2a4a'});});
  s+=gtTxt(626,H-36,hideP?'You work out how many.':'Make exactly this.',{s:13,w:700,c:'#6b7894'})+'</g>';
  return s+'</svg>';
}
TEST_ITEMS.diner=()=>{
  /* counts and leftovers come from the game's own atom counting (cntList, parseF) */
  const left=(R,P)=>{const a=cntList(R),b=cntList(P),o={};Object.keys(a).forEach(k=>{const d=a[k]-(b[k]||0);if(d>0)o[k]=d;});return o;};
  const leftKey=o=>Object.keys(o).length?Object.keys(o).map(k=>k+o[k]).join(''):'none';
  const NAME={H:'hydrogen',O:'oxygen',C:'carbon',N:'nitrogen'};
  const leftOpts=(ans,alts)=>{const lab=k=>k==='none'?'None. Every atom is used':k.replace(/([A-Z][a-z]?)(\d+)/g,(m,e,n)=>`${n} ${NAME[e]} atom${n>1?'s':''}`);
    return [...new Set([ans,...alts])].slice(0,4).sort().map(k=>[k,lab(k)]);};
  const num=(ans,alts)=>[...new Set([ans,...alts])].filter(v=>v>0).slice(0,4).sort((a,b)=>a-b).map(v=>[String(v),String(v)]);
  const cnt=(R,e)=>cntList(R)[e]||0;
  const dish=n=>DISHES.find(d=>d.dish===n);
  /* 1. Breakfast Shift: Rocket Fuel Combo, exact ingredients */
  const d1=dish('Rocket Fuel Combo'),R1=d1.R,P1=d1.P,L1=leftKey(left(R1,P1));
  /* 2. Lunch Rush: Gas Stove Special, but the shelf has 3 O₂ instead of 2 */
  const d2=dish('Gas Stove Special'),R2=[[1,'CH4'],[3,'O2']],P2=d2.P,L2=leftKey(left(R2,P2));
  /* 3. Dinner Madness: Backyard Grill Plate, amounts hidden on the ticket */
  const d3=dish('Backyard Grill Plate'),R3=d3.R,P3=d3.P,L3=leftKey(left(R3,P3)),n3=f=>(P3.find(x=>x[1]===f)||[0])[0];
  return [
    {title:'Breakfast order',text:'Smash the ingredients into atoms, then make the order. Count carefully.',alt:'Ingredients: 2 H2 and 1 O2. The ticket asks for 2 H2O.',
     svg:()=>dnTestSvg(R1,P1),
     qs:[{id:'H',q:'How many **hydrogen (H)** atoms are in the ingredients?',opts:num(cnt(R1,'H'),[2,6,8]),ans:String(cnt(R1,'H'))},
         {id:'O',q:'How many **oxygen (O)** atoms are in the ingredients?',opts:num(cnt(R1,'O'),[1,3,4]),ans:String(cnt(R1,'O'))},
         {id:'left',q:'After you make the order, which atoms are **left over**?',opts:leftOpts(L1,['H2','O1','O2']),ans:L1}]},
    {title:'Lunch order',text:'Here is what is on the shelf and what the customer ordered.',alt:'Ingredients: 1 CH4 and 3 O2. The ticket asks for 1 CO2 and 2 H2O.',
     svg:()=>dnTestSvg(R2,P2),
     qs:[{id:'H',q:'How many **hydrogen (H)** atoms are in the ingredients?',opts:num(cnt(R2,'H'),[2,6,8]),ans:String(cnt(R2,'H'))},
         {id:'O',q:'How many **oxygen (O)** atoms are in the ingredients?',opts:num(cnt(R2,'O'),[3,4,8]),ans:String(cnt(R2,'O'))},
         {id:'left',q:'After you make the order, which atoms are **left over**?',opts:leftOpts(L2,['none','H2','C1']),ans:L2}]},
    {title:'Dinner order',text:'The ticket does not say how many. Use **every atom** on the shelf, with none left over.',alt:'Ingredients: 1 C3H8 and 5 O2. The ticket asks for some CO2 and some H2O.',
     svg:()=>dnTestSvg(R3,P3,true),
     qs:[{id:'O',q:'How many **oxygen (O)** atoms are in the ingredients?',opts:num(cnt(R3,'O'),[5,8,12]),ans:String(cnt(R3,'O'))},
         {id:'CO2',q:'How many **CO₂** can you make?',opts:num(n3('CO2'),[1,4,5]),ans:String(n3('CO2'))},
         {id:'H2O',q:'How many **H₂O** can you make?',opts:num(n3('H2O'),[2,3,8]),ans:String(n3('H2O'))}]}];
};
