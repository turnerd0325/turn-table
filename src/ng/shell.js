/* ================= SUBJECT GAMES: Life Science, Earth & Space, Physics =================
   Shared shell for the 12 subject games. Each game file calls ngDef({...}).
   Every game follows the same rules: the science is the move, predict before you run,
   limited tries with explained misses, mixed review, and the same level/star backbone
   as the other star games (level picker, 3-step hints, coach, fact, cloud stars). */

const SUBJECTS=[
  {id:'life',sym:'Ls',num:1,name:'Life Science',c1:'#14824a',c2:'#3fc07c',desc:'Cells, food webs, genes and evolution.',more:true},
  {id:'phys',sym:'Ph',num:2,name:'Physics',c1:'#2153d6',c2:'#4f95ff',desc:'Forces, motion, energy, heat, waves and circuits.'},
  {id:'chem',sym:'Ch',num:3,name:'Chemistry',c1:'#6a3fd6',c2:'#a77bff',desc:'Elements, atoms, compounds, reactions and mixtures.'},
  {id:'earth',sym:'Es',num:4,name:'Earth & Space',c1:'#c46a12',c2:'#f0a64a',desc:'The Moon, rock layers, moving plates and weather.',more:true}
];
const SUBJ_GAMES={chem:['speed','trivia','explore','lab','atom','balance','diner','sep','evidence'],
  phys:['laser','blackout','coaster','courier','frozen','fields','waves'],
  life:['cell','ripple','pup','drift'],earth:['moon','strata','pangaea','weather']};
const SUBJ_OF={};Object.keys(SUBJ_GAMES).forEach(s=>SUBJ_GAMES[s].forEach(g=>{SUBJ_OF[g]=s;}));
const STAR_GAMES=()=>['sep',...NEWG.map(g=>g.key)];

/* ---- icons for the new games (added to the shared icon set) ---- */
Object.assign(ART.P,{
  cell:'<ellipse cx="12" cy="12" rx="9.5" ry="7.5"/><circle cx="11" cy="11.5" r="3"/><path d="M16.5 8.5l1.5 1.2M15.8 15l2 .6M6 15.5l1.2-.8"/>',
  web:'<circle cx="12" cy="4.5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19.5" r="2"/><path d="M12 17.5v-11M6.6 13.3l3.8 4.6M17.4 13.3l-3.8 4.6M7 12h10"/>',
  paw:'<ellipse cx="12" cy="16" rx="4.6" ry="3.8"/><circle cx="6.4" cy="10.6" r="1.9"/><circle cx="9.8" cy="6.8" r="1.9"/><circle cx="14.2" cy="6.8" r="1.9"/><circle cx="17.6" cy="10.6" r="1.9"/>',
  beetle:'<ellipse cx="12" cy="13.5" rx="5.5" ry="7"/><circle cx="12" cy="5.3" r="2.2"/><path d="M12 7.5v13M6.5 10 3 8M6.5 14H3M6.8 18l-3 2M17.5 10 21 8M17.5 14H21M17.2 18l3 2"/>',
  moon:'<path d="M19.5 14.6A8.2 8.2 0 1 1 9.4 4.5a6.6 6.6 0 0 0 10.1 10.1z"/>',
  layers:'<path d="M3 7.5l9-4 9 4-9 4z"/><path d="M3 12l9 4 9-4"/><path d="M3 16.5l9 4 9-4"/>',
  puzzle:'<path d="M4 8h4a2.2 2.2 0 1 1 4 0h4v4a2.2 2.2 0 1 0 0 4v4H4v-4a2.2 2.2 0 1 1 0-4z"/>',
  rain:'<path d="M7 15a4.3 4.3 0 0 1-.5-8.6A5.8 5.8 0 0 1 17.4 7a4 4 0 0 1-.6 8z"/><path d="M8.5 18l-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5"/>',
  rocket:'<path d="M14.5 4.5c3-1 5-1 5-1s0 2-1 5l-6 6-4-4z"/><path d="M8.5 10.5 5 11l-2 3 4 .5M13.5 15.5 13 19l-3 2-.5-4"/><circle cx="15.5" cy="8.5" r="1.4"/>',
  snow:'<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.5 3.8 12 6l2.5-2.2M9.5 20.2 12 18l2.5 2.2"/>',
  magnet:'<path d="M6 3.5v8a6 6 0 0 0 12 0v-8h-4v8a2 2 0 0 1-4 0v-8z"/><path d="M6 7.5h4M14 7.5h4"/>',
  wave:'<path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4.5 5-3"/>',
  play:'<path d="M7 4.5v15l12-7.5z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
});

/* ---- thumbnails for the new games (320 x 180) ---- */
const NGTHUMB={};
const ngWrap=(id,bg,body)=>`<svg class="thumb" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
<defs><pattern id="g${id}" width="30" height="30" patternUnits="userSpaceOnUse"><rect x="3" y="3" width="24" height="24" rx="5" fill="none" stroke="#fff" stroke-opacity=".085" stroke-width="1.5"/></pattern></defs>
<rect width="320" height="180" fill="${bg}"/><rect width="320" height="180" fill="url(#g${id})"/>${body}</svg>`;
const ngStar=(x,y,r,f,o)=>`<path transform="translate(${x} ${y}) scale(${r/12})" d="M0-12c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12 7.2-.9 11.1-4.8 12-12z" fill="${f||'#f4b13a'}" opacity="${o==null?1:o}"/>`;
(function(){
  const t0=ART.thumb;let u=0;
  ART.thumb=n=>{if(!NGTHUMB[n])return t0(n);const k='n'+(++u);return NGTHUMB[n]().replace(/id="([^"]+)"/g,(m,i)=>`id="${i}_${k}"`).replace(/url\(#([^)]+)\)/g,(m,i)=>`url(#${i}_${k})`);};
})();

/* ---- small helpers ---- */
const ngRC=(el,...k)=>el.replaceChildren(...k.flat().filter(x=>x!=null&&x!==false&&x!==''));
const ngRich=s=>String(s==null?'':s).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(p=>/^\*\*.*\*\*$/.test(p)?h('b',null,p.slice(2,-2)):document.createTextNode(p));
const ngStars=(m,a,b)=>m<=a?3:m<=b?2:1;
const ngSvg=(w,hh,body,cls,label)=>svgEl(`<svg viewBox="0 0 ${w} ${hh}" xmlns="http://www.w3.org/2000/svg" class="${cls||'ngsvg'}" role="img" aria-label="${label||''}">${body}</svg>`);
const ngEsc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const ngBtn=(txt,fn,cls,extra)=>h('button',Object.assign({class:'btn '+(cls||''),type:'button',onclick:fn},extra||{}),...(Array.isArray(txt)?txt:[txt]));
/* a row of choice buttons; value = current pick; mark = {value:'ok'|'no'} after a check */
function ngChoices(opts,value,onPick,o){
  o=o||{};
  return h('div',{class:'ngch'+(o.cls?' '+o.cls:''),role:'group','aria-label':o.label||'Choices'},...opts.map(([v,label,sub])=>{
    const st=o.mark&&o.mark[v];
    return h('button',{type:'button',class:'ngc'+(value===v?' on':'')+(st?' '+st:''),disabled:!!o.locked,'aria-pressed':value===v?'true':'false',onclick:()=>onPick(v)},
      ...(Array.isArray(label)?label:[label]),sub?h('small',null,sub):null);
  }));
}

/* ---- registry ---- */
const NGS={},NG_ORDER=[];
function ngDef(d){
  d.n=d.levels.length;NGS[d.key]=d;NG_ORDER.push(d.key);
  const reg={key:d.key,name:d.name,std:d.std,n:d.n,lv:d.levels};NEWG.push(reg);NEWGK[d.key]=reg;
  STD[d.key]=[d.std,0];SHORT_DESC[d.key]=d.short;
  if(d.thumb)NGTHUMB[d.key]=d.thumb;
}

/* ---- level runtime ---- */
let G=null,NGK=null;
const ngD=()=>NGS[G.key];
function ngSay(t,kind){if(kind&&ngT())return;const c=$('ngCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),h('span',null,...ngRich(t)));}
function ngSetup(key){
  const d=NGS[key];if(!d)return;
  if(gameLocked(key)){goMenu();return;}
  NGK=key;
  $('ngArt').innerHTML=ART.thumb(key);
  $('ngTitle').replaceChildren(I(d.ic),d.name,' ',stdTag(d.std));
  $('ngSub').replaceChildren(...ngRich(d.intro));
  $('ngHow').replaceChildren(...d.how.map(t=>h('li',null,...ngRich(t))));
  renderLevelPicker($('ngLevels'),$('ngTotal'),key,d.levels,d.packs,i=>ngStart(key,i),L=>d.mini?d.mini(L):h('span',null,''));
  show('s-ngset');scGame=key;
}
function ngStart(key,i){
  const d=NGS[key];if(!d)return;
  if(gameLocked(key)){goMenu();return;}
  if(!ngT()&&freeLvLocked(key,i)){ngSetup(key);return;}
  if(!ngT()&&freeMode()&&!(G&&G.key===key&&G.i===i)&&!ngStart.ok){freePlay(key).then(ok=>{if(!ok)return ngSetup(key);ngStart.ok=1;try{ngStart(key,i);}finally{ngStart.ok=0;}});return;}
  const keep=G&&G.key===key&&G.i===i?G.rec:0;
  G={key,i,L:d.levels[i],hint:0,rec:keep,tries:0,miss:0,done:false,detail:{},t:{n:0,right:0}};
  show('s-ng');scGame=key;$('s-ng').classList.toggle('testing',ngT());
  const r=$('ngResult');r.hidden=true;r.classList.remove('sciwait');
  const hb=$('ngHintBox');hb.hidden=true;hb.dataset.closed='';
  $('s-ng').dataset.g=key;
  $('ngLvl').textContent=i+1;$('ngLvlN').textContent=d.n;
  $('ngName').textContent=G.L.name;$('ngStory').replaceChildren(...ngRich(G.L.story||''));
  $('ngIntro').hidden=!G.L.intro;$('ngIntro').replaceChildren(...(G.L.intro?[I('bulb'),' ',...ngRich(G.L.intro)]:[]));
  $('ngGrid').className='ngrid'+(d.wide?' wide':'');
  d.start(G);
  ngRender();
}
function ngRender(){
  if(!G)return;const d=ngD();
  d.render(G,$('ngMain'),$('ngSide'));
  const m=d.hud?d.hud(G):{};
  $('ngBack').textContent=ngT()?'Leave test':'← Levels';
  if(ngT()){$('ngMetricL').textContent=NGT.kind==='pre'?'Pre-Test':'Post-Test';$('ngMetric').textContent=`${NGT.k+1} of ${NGT.lv.length}`;$('ngTarget').textContent='One try · no hints · score at the end';}
  else{$('ngMetricL').textContent=m.label||'Tries';$('ngMetric').textContent=m.val!=null?m.val:G.tries;
  $('ngTarget').replaceChildren(...ngRich(m.target||'3 ★ = right on the first try'));}
  ngHintUI();
}
function ngHintUI(){
  const d=ngD(),n=G.hint,b=$('ngHintBox');
  $('ngHintTxt').textContent=['Need a hint?','Another hint','Show me more','No more hints'][n];
  $('ngHint').disabled=n>=3||G.done;
  const hs=d.hints(G)||[];
  b.hidden=n===0;
  ngRC(b,...hs.slice(0,n).map((t,k)=>h('div',null,I(['bulb','lens','eye'][k]),' ',h('b',null,['Clue: ','Tip: ','Big help: '][k]),...ngRich(t))),
    n>=3&&d.cap3?h('div',{class:'ngcap'},'Hint 3 gives a lot away, so this try can earn at most 2 ★.'):null);
}
/* finish a level. stars 1..3 */
function ngWin(stars,line){
  if(ngT())return ngTDone(G.t.n?G.t.right/G.t.n:1);
  const d=ngD();if(G.hint>=3&&d.cap3)stars=Math.min(stars,2);stars=Math.max(1,Math.min(3,stars));
  G.done=true;ngHintUI();
  if(!(G.rec>=stars)){G.rec=stars;recordStars(G.key,G.i+1,stars,Object.assign({tries:G.tries,miss:G.miss},G.detail||{}));}
  fx.pop({icon:d.ic,text:stars===3?pick(d.cheer||['Brilliant!','Nailed it!','Science star!']):'Level complete!',kind:'great',size:'big'});fx.confetti(stars===3?90:50);
  const k=G.key,i=G.i;
  setTimeout(()=>{if(!G||G.key!==k||G.i!==i)return;
    levelResult($('ngResult'),{stars,next:i+1<d.n,line:Array.isArray(line)?line:ngRich(line),fact:G.L.fact,
      onNext:()=>ngStart(k,i+1),onRetry:()=>ngStart(k,i),onLevels:()=>ngSetup(k)});},d.winDelay==null?500:d.winDelay);
}
/* not enough right to pass: explain and retry (no stars saved) */
function ngRetry(line){
  if(ngT())return ngTDone(G.t.n?G.t.right/G.t.n:0);
  const k=G.key,i=G.i;G.done=true;ngHintUI();
  fx.pop({icon:'bulb',text:'Not yet. Read the feedback!',kind:'try',size:'big'});
  const box=$('ngResult');
  setTimeout(()=>{if(!G||G.key!==k||G.i!==i)return;
    ngRC(box,h('div',{class:'big'},h('span',{class:'dimstar'},'★★★')),h('p',null,...(Array.isArray(line)?line:ngRich(line))),
      h('div',{style:'display:flex;gap:8px;justify-content:center;flex-wrap:wrap'},ngBtn('Look at my answers',()=>{box.hidden=true;},'ghost'),ngBtn('Try again',()=>ngStart(k,i),'good'),ngBtn('Levels',()=>ngSetup(k),'ghost')));
    box.hidden=false;},700);
}
$('ngHint').onclick=()=>{if(!G||G.hint>=3||G.done)return;G.hint++;const d=ngD();if(d.onHint)d.onHint(G);$('ngHintBox').dataset.closed='';ngRender();};
$('ngBack').onclick=()=>{if(ngT())return tstQuit();if(G)ngSetup(G.key);else goMenu();};

/* ---- Pre-Test / Post-Test mode for the subject games ----
   One try per item, no hints, no coach feedback, no stars. Each test level scores 0..1.
   Round games call ngTAns(ok,next) for each answer; one-check games call ngTDone(fraction). */
let NGT=null;
const NG_TEST_LV=[1,4,7];
const ngT=()=>!!(NGT&&G&&G.key===NGT.key);
function ngTRound(v){G.t.n++;G.t.right+=v===true?1:v===false?0:Math.max(0,Math.min(1,+v||0));}
function ngTAns(v,next){ngTRound(v);tstSaved();next();}
function ngTDone(frac){
  if(!ngT()||G.done)return;G.done=true;if(frac==null)frac=G.t.n?G.t.right/G.t.n:0;
  NGT.res.push({lv:G.i+1,s:Math.round(Math.max(0,Math.min(1,frac))*1000)/1000});NGT.k++;tstSaved();
  const T=NGT;setTimeout(()=>{if(NGT!==T)return;if(T.k<T.lv.length)ngStart(T.key,T.lv[T.k]);else tstFinish(T.res.reduce((a,r)=>a+r.s,0)/T.lv.length*100,{levels:T.res});},450);
}
function ngTestStart(key,kind){const d=NGS[key];NGT={key,kind,lv:NG_TEST_LV.filter(i=>i<d.n),k:0,res:[]};ngStart(key,NGT.lv[0]);}
$('ngSetBack').onclick=()=>goMenu();

/* a tiny line chart. series: [{name,color,vals:[0..1]}] */
function ngChart(series,o){
  o=o||{};const W=o.w||420,H=o.h||190,L=o.left||36,B=o.bottom||26,T=10,R=10,n=Math.max(...series.map(s=>s.vals.length)),pw=W-L-R,ph=H-T-B;
  const x=i=>L+(n<=1?0:i*pw/(n-1)),y=v=>T+ph-(Math.max(0,Math.min(1,v)))*ph;
  let t=`<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="#f6f8fd" stroke="#d5deee"/>`;
  [0,.25,.5,.75,1].forEach(v=>{t+=`<line x1="${L}" x2="${L+pw}" y1="${y(v)}" y2="${y(v)}" stroke="#e3e9f5"/>`;if(o.pct)t+=`<text x="${L-5}" y="${y(v)+4}" text-anchor="end" font-size="10" fill="#6b7a99">${Math.round(v*100)}%</text>`;});
  if(o.xlab)t+=`<text x="${L+pw/2}" y="${H-5}" text-anchor="middle" font-size="11" fill="#6b7a99" font-weight="700">${ngEsc(o.xlab)}</text>`;
  if(o.ylab&&!o.pct)t+=`<text x="12" y="${T+ph/2}" text-anchor="middle" font-size="11" fill="#6b7a99" font-weight="700" transform="rotate(-90 12 ${T+ph/2})">${ngEsc(o.ylab)}</text>`;
  const labs=[];
  series.forEach(s=>{const pts=s.vals.map((v,i)=>`${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    t+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.w||3.2}" stroke-linejoin="round" stroke-linecap="round" ${s.dash?'stroke-dasharray="6 5"':''} class="${o.anim?'ngdraw':''}"/>`;
    if(s.name){const lv=s.vals[s.vals.length-1];labs.push({y:y(lv)-7,x:x(s.vals.length-1)-4,s});}});
  labs.sort((a,b)=>a.y-b.y);for(let i=1;i<labs.length;i++)if(labs[i].y-labs[i-1].y<14)labs[i].y=labs[i-1].y+14;
  const over=labs.length?labs[labs.length-1].y-(H-B-4):0;if(over>0)labs.forEach(l=>{l.y-=over;});
  labs.forEach(l=>{t+=`<text x="${l.x}" y="${Math.max(T+11,l.y)}" text-anchor="end" font-size="12" font-weight="800" fill="${l.s.color}" stroke="#fff" stroke-width="3" paint-order="stroke">${ngEsc(l.s.name)}</text>`;});
  return ngSvg(W,H,t,'ngchart',o.label||'Graph');
}
