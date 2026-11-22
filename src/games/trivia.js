/* ================= GAME 2: ELEMENT TRIVIA ================= */
function hintsFor(e){
  const typ=METALS.includes(e.cat)?'a metal':e.cat==='metalloid'?'a metalloid':'a nonmetal';
  const fam=CATS[e.cat][0].toLowerCase();
  return [
    `At room temperature I'm a ${e.state}, and I'm ${typ}.`,
    FACTS[e.sym],
    `I live in Period ${e.period} and I'm classified as ${an(fam)} ${fam}. My atomic mass is about ${Math.round(e.mass)}.`,
    `I'm in Group ${e.group}. My atomic number is ${e.n} (that's my number of protons) and my symbol is ${e.sym}.`
  ];
}
const HINT_LABELS=['Property of matter','Clue','Period & size','Big giveaway'];
let T=null,trCells={},trGrid=null;
function startTrivia(){
  stopAll();const test=tstOn('trivia');T={queue:test?TEST_SET.trivia.map(x=>BYSYM[x]):sample(POOL_EL,ROUND_LEN),i:0,score:0,results:[],done:false,test};
  show('s-trivia');$('s-trivia').classList.toggle('testing',test);$('trQuit').textContent=test?'Leave test':'Quit';
  if(test)TST.finish=()=>{const right=T.results.filter(r=>r.ok).length;tstFinish(T.score/(T.queue.length*4)*100,{right,n:T.queue.length,points:T.score});};
  const t=buildTable($('trTable'),{names:false,colors:false,onPick:trClick});trCells=t.map;trGrid=t.grid;
  $('trColor').checked=false;legend($('trLegend'),false);
  trQuestion();
}
$('trColor').onchange=()=>{const on=$('trColor').checked;trGrid.classList.toggle('mono',!on);legend($('trLegend'),on);};
function trQuestion(){
  T.target=T.queue[T.i];T.hints=hintsFor(T.target);T.shown=1;T.ruled=new Set();T.done=false;T.lastTries=0;
  clearCells(trCells);
  $('trQ').textContent=T.i+1;$('trScore').textContent=T.score;
  $('trMsg').textContent='';$('trMsg').className='msg';$('trNext').hidden=true;
  $('trGuess').disabled=false;$('trGo').disabled=false;$('trGuess').value='';
  renderHints(false);
  if(!matchMedia('(pointer:coarse)').matches)$('trGuess').focus();
}
function renderHints(animate){
  $('trHints').replaceChildren(...T.hints.map((txt,i)=>{
    const open=i<T.shown||T.done;
    return h('li',{class:'hint h'+(i+1)+' '+(open?'shown':'locked')+(open&&!T.done&&i===T.shown-1?' fresh':''),style:animate&&i===T.shown-1&&!T.done?'':'animation:none'},
      h('b',null,`Hint ${i+1} · ${HINT_LABELS[i]}`),open?txt:[I('lock'),' Locked']);
  }));
  $('trWorth').textContent=T.done?0:5-T.shown;
  $('trHintBtn').disabled=T.done||T.shown>=4;
  trCardFill(animate);
}
/* mystery card: fields fill in as the hints that give them away are revealed */
function trCardFill(animate){
  const e=T.target,k=T.shown,tile=$('trTile'),pips=$('trPips').children;
  const set=(id,on,txt)=>{const f=$(id),b=f.lastChild,was=f.classList.contains('on');f.classList.toggle('on',on);b.textContent=on?txt:'?';
    if(on&&!was&&animate&&!Art.reduced())Art.pop(f);};
  const all=T.done;
  set('trfP',all||k>=3,e.period);set('trfG',all||k>=4,e.group);set('trfN',all||k>=4,e.n);set('trfS',all||k>=4,e.sym);
  for(let i=0;i<4;i++)pips[i].className=(!all&&i<5-k)?'on':'';
  if(!T.done){tile.className='trtile mys';tile.replaceChildren(h('span',{class:'trq'},'?'));tile.style.removeProperty('--wob');}
}
/* solved reveal: the ? flips over into the real element tile */
function trSolved(ok){
  const e=T.target,tile=$('trTile');
  tile.className='trtile rev cat-'+e.cat+(ok?' win':' miss');
  tile.replaceChildren(h('i',{class:'trn'},e.n),h('b',{class:'trs'},e.sym),h('span',{class:'trnm'},e.name),h('span',{class:'trm'},e.mass.toFixed(e.mass<10?3:2)));
  if(ok&&!Art.reduced())setTimeout(()=>{if(tile.isConnected)Art.burstAt(tile,{n:T.shown<=2?30:18,colors:['#ffd23f','#ff7a59','#4fc3f7','#a5e86b','#c792ea']});},380);
}
function trReveal(){if(T.done||T.shown>=4)return;T.shown++;renderHints(true);}
$('trHintBtn').onclick=trReveal;
function lookup(str){
  const s=str.trim().toLowerCase();if(!s)return null;
  if(ALIAS[s])return BYSYM[ALIAS[s]].n;
  const e=EL.find(x=>x.name.toLowerCase()===s||x.sym.toLowerCase()===s);return e?e.n:null;
}
function trClick(n){
  if(T&&T.test){if(T.done)return;Object.values(trCells).forEach(c=>c.classList.remove('sel'));trCells[n].classList.add('sel');$('trGuess').value=EL[n-1].name;return;}
  trGuess(n);}
function trTyped(){
  if(T.done)return;const v=$('trGuess').value;if(!v.trim())return;
  const n=lookup(v);
  if(!n){$('trMsg').className='msg bad';$('trMsg').textContent=`I don't know an element called “${v.trim()}”. Check your spelling!`;return;}
  $('trGuess').value='';trGuess(n);
}
$('trGo').onclick=trTyped;
$('trGuess').addEventListener('keydown',e=>{if(e.key==='Enter')trTyped();});
function trGuess(n){
  if(!T||T.done||T.ruled.has(n))return;
  const g=EL[n-1],msg=$('trMsg');
  if(T.test){const ok=n===T.target.n,pts=ok?5-T.shown:0;T.score+=pts;T.results.push({e:T.target,pts,hints:T.shown,ok});T.done=true;tstSaved();T.i++;
    setTimeout(()=>{if(!T||!T.test)return;if(T.i>=T.queue.length)return TST&&TST.finish();trQuestion();},300);return;}
  if(n===T.target.n)return trFinishQ(true);
  T.ruled.add(n);const c=trCells[n];c.classList.add('out','bad');setTimeout(()=>c.classList.remove('bad'),350);
  msg.className='msg bad';fx.pop({icon:'question',text:'Not quite!',kind:'try',at:c});
  if(T.shown<4){T.shown++;msg.textContent=`Not ${g.name}. Here's another hint!`;renderHints(true);}
  else{T.lastTries++;if(T.lastTries>=2)return trFinishQ(false);msg.textContent=`Not ${g.name}. One more try!`;}
}
function trFinishQ(ok){
  T.done=true;const e=T.target,pts=ok?5-T.shown:0;T.score+=pts;
  T.results.push({e,pts,hints:T.shown,ok});bdTriviaQ(e.sym,ok,T.shown);
  if(!ok)bumpMissed(e.sym);
  trCells[e.n].classList.remove('out');trCells[e.n].classList.add('hit');
  $('trScore').textContent=T.score;renderHints(false);trSolved(ok);
  const m=$('trMsg');m.className='msg '+(ok?'good':'bad');
  m.textContent=ok?`Yes! It's ${e.name} (${e.sym}). +${pts} point${pts===1?'':'s'}!`:`The answer was ${e.name} (${e.sym}). Study its spot on the table!`;
  if(ok){const k=T.shown,P=[null,['bulb','Genius! +4','great'],['star','Awesome! +3','great'],['check','Nice! +2','good'],['check','Phew! +1','good']][k];
    fx.pop({icon:P[0],text:P[1],kind:P[2],size:'big'});if(k<=3)fx.confetti(k===1?80:45);}
  else fx.pop({icon:'book',text:'Study its spot!',kind:'try',size:'big'});
  $('trGuess').disabled=true;$('trGo').disabled=true;
  $('trNext').textContent=T.i+1>=T.queue.length?'See my results ▶':'Next ▶';$('trNext').hidden=false;$('trNext').focus({preventScroll:true});
}
$('trNext').onclick=()=>{T.i++;if(T.i>=T.queue.length)return trEnd();trQuestion();};
$('trQuit').onclick=()=>T&&T.test?tstQuit():goMenu();
function trEnd(){
  const P=prof(),rec=P.trivia,prev=rec.best;rec.plays++;const isBest=T.score>prev;if(isBest)rec.best=T.score;saveAll();bdTriviaEnd(T.results);cloudSubmit('trivia','',T.score,{n:T.queue.length});
  const right=T.results.filter(r=>r.ok).length,max=T.queue.length*4;
  const title=T.score>=max*.85?'Element Master!':T.score>=max*.6?'Lab Pro!':T.score>=max*.35?'Rising Scientist':'Keep Exploring!';
  showEnd({emoji:T.score>=max*.6?'trophy':'question',title,big:`${T.score}/${max}`,sub:`${right} of ${T.queue.length} solved`,
    body:[isBest?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,
      h('p',null,'High score: ',h('b',null,rec.best)),
      h('div',{class:'tchips'},T.results.map(r=>h('span',{class:'tchip'+(r.ok?'':' slow')},`${r.e.name}: ${r.pts}`)))],
    again:startTrivia,party:isBest?'New high score!':(T.score>=max*.6?'Great job!':null)});
}

