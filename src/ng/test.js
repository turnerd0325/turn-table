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
  lab:{n:10,unit:'compounds',what:'Build 10 compounds from atoms. One check each.',how:['Click elements on the table to add atoms. Use + and − to fix the count.','Press Combine when your molecule is ready. You get one try.']},
  atom:{n:10,unit:'atoms',what:'Build 10 atoms, ions and isotopes. One check each.',how:['Use + and − to set protons, neutrons and electrons.','Press Check when you are ready. You get one try.']},
  balance:{n:10,unit:'equations',what:'Balance 10 equations. One check each.',how:['Use + and − to change the big numbers in front of each formula.','Press Check when you think both sides match. You get one try.']}
};
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
  if(!TEST_GAMES[g]||freeMode())return fn();
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
  const groups=[...SUBJECTS.map(s=>[s,SUBJ_GAMES[s.id].filter(g=>TEST_GAMES[g])])].filter(x=>x[1].length);
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
        ngBtn('Refresh',()=>tstLoad(C),'sm ghost'),ngBtn('Download CSV (all games)',()=>tstCsv(C),'sm ghost')),
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
