/* ================= LIFE 4: ISLAND DRIFT (MS-LS4-4, LS4-6) =================
   The environment changes. Predict which variation becomes more common and what the graph will
   look like, THEN run the generations. Individuals never change: the population does.
   Finish by choosing the explanation (one choice is always a common misconception). */
const DRL=(name,story,o)=>Object.assign({name,story,gens:10},o);
const DR_LEVELS=[
  DRL('Sooty Trees','England, 1850s. Factory soot turns the tree bark black.',{hab:'bark',crit:'moth',A:['Light moths','#efe9dc'],B:['Dark moths','#2d2a28'],p0:.1,wA:.5,wB:1,
    why:[['surv','Dark moths were harder for birds to see on black bark, so more of them survived and had dark babies.'],['turn','The light moths turned dark so they could hide.'],['want','The moths wanted to be dark, so their wings changed.']],
    fact:'This really happened to peppered moths in England. No moth changed color. Dark moths simply survived and reproduced more on sooty trees.',
    clue:'Birds eat the moths they can SEE. Which color is hard to see on black bark?',
    intro:'Birds hunt these moths. Each round of the graph is one **generation**: the survivors have babies that look like them.'}),
  DRL('White Sand','New dunes of bright white sand form along the beach.',{hab:'sand',crit:'mouse',A:['Light mice','#efe1c6'],B:['Dark mice','#5a4632'],p0:.5,wA:1,wB:.6,focus:'A',
    why:[['surv','Owls spotted the dark mice on white sand more easily, so light mice survived and had more babies.'],['sun','The sun bleached the dark mice’s fur light.'],['learn','The mice learned to be light colored.']],
    fact:'Beach mice in Florida have pale fur that matches the white sand dunes. Mice of the same species living inland are darker.',
    clue:'Owls hunt by sight. Which mice stand out on white sand?'}),
  DRL('Lava Rock','A volcano covers the desert with black lava rock.',{hab:'lava',crit:'mouse',A:['Light mice','#d8c39e'],B:['Dark mice','#2b2622'],p0:.2,wA:.55,wB:1,
    why:[['surv','Dark mice blended in with the black rock, so predators caught fewer of them. They survived and passed on dark fur.'],['need','The mice needed dark fur, so they grew it.'],['all','Every mouse slowly got a little darker each year.']],
    fact:'Rock pocket mice in Arizona live on both light sand and dark lava. On the lava, almost all of them are dark.',
    clue:'Same idea as the moths: which fur color hides on black rock?'}),
  DRL('Drought Island','The Galápagos Islands, 1977. A drought kills the plants with small, soft seeds.',{hab:'seeds',crit:'finch',A:['Small beaks','#c9a26b'],B:['Big beaks','#7a4a1e'],p0:.3,wA:.6,wB:1,
    why:[['surv','Only big, hard seeds were left. Finches with big beaks could crack them, so they survived and had big-beaked chicks.'],['grow','Finches grew bigger beaks by cracking hard seeds.'],['eat','The small-beaked finches ate more and their beaks stretched.']],
    fact:'Scientists Peter and Rosemary Grant measured this on Daphne Major island. After the drought, the average beak size of the finches got bigger.',
    clue:'What food was left after the drought? Which beak can handle it?'}),
  DRL('Super Germs','Germs in a sick person. Most are killed by an antibiotic, but a few are resistant.',{hab:'dish',crit:'germ',A:['Normal germs','#7fc8f8'],B:['Resistant germs','#e2483f'],p0:.02,wA:.15,wB:1,gens:8,
    why:[['surv','The antibiotic killed the normal germs. The few resistant ones survived and multiplied.'],['used','The germs got used to the medicine and learned to resist it.'],['make','The antibiotic turned normal germs into resistant ones.']],
    fact:'This is why doctors tell you to finish all your medicine and not to use antibiotics when you do not need them. Resistance is a real and growing problem.',
    clue:'The medicine kills germs that are NOT resistant. Who is left to multiply?'}),
  DRL('Striped Beetles','Some beetles have stripes and some do not. Birds here eat both kinds equally.',{hab:'leaf',crit:'beetle',A:['Plain beetles','#3f8a3a'],B:['Striped beetles','#d9a21e'],p0:.5,wA:1,wB:1,
    why:[['none','Stripes do not help or hurt survival here, so neither kind has an advantage.'],['strong','Striped beetles are stronger, so they will take over.'],['pretty','Birds like pretty beetles, so striped ones will disappear.']],
    fact:'Natural selection only changes a population when a trait affects survival or reproduction. A trait that makes no difference is not selected.',
    clue:'Read the story carefully: do birds prefer one kind?'}),
  DRL('Rare at First','Dark beetles start out rare: only 2 in every 100. On this dark soil, they survive twice as well.',{hab:'soil',crit:'beetle',A:['Light beetles','#c9b48a'],B:['Dark beetles','#2a2622'],p0:.02,wA:.5,wB:1,gens:12,shape:1,
    why:[['curve','At first there are so few dark beetles that the change is slow. As they become common, the change speeds up, then levels off near 100%.'],['line','The number of dark beetles goes up by the same amount every generation.'],['jump','All the beetles change at once in the first generation.']],
    fact:'Graphs of natural selection often make an S-shape: slow at first, fast in the middle, then leveling off.',
    clue:'With only 2 dark beetles out of 100, how fast can their numbers grow at the very start?'}),
  DRL('Clean Air','Pollution laws clean the air. The soot washes off, and tree bark turns light again.',{hab:'birch',crit:'moth',A:['Light moths','#efe9dc'],B:['Dark moths','#2d2a28'],p0:.9,wA:1,wB:.6,focus:'A',
    why:[['surv','Now the dark moths stand out on light bark, so birds eat more of them. Light moths survive and reproduce more.'],['back','The dark moths remembered being light and changed back.'],['wash','Rain washed the dark color off the moths.']],
    fact:'After clean-air laws, light peppered moths became common again in England. Selection depends on the environment, so it can reverse.',
    clue:'Which moth is easy to see on light bark now?'}),
  DRL('Spray Stops','Farmers stop spraying a pesticide. Resistant insects are slightly worse at finding food.',{hab:'farm',crit:'bug',A:['Normal insects','#5aa04a'],B:['Resistant insects','#b04a2a'],p0:.8,wA:1,wB:.85,gens:12,
    why:[['surv','Without the spray, resistance no longer helps. Normal insects find food a little better, so they slowly become more common.'],['forget','The insects forgot how to resist the spray.'],['stay','Once insects are resistant, they stay resistant forever.']],
    fact:'A trait that helps in one environment can be a small disadvantage in another. When the spray stops, the population slowly shifts back.',
    clue:'With no spray, does being resistant still help? Which kind has the edge now?'})
];
const DR_PACKS={0:'Pack 1: Hide and seek',3:'Pack 2: Survival tools',6:'Pack 3: Reading the graph'};
function drSim(L){const v=[L.p0];let p=L.p0;for(let g=0;g<L.gens;g++){p=p*L.wB/(p*L.wB+(1-p)*L.wA);v.push(p);}return v;}
const drFocus=L=>L.focus==='A'?0:1;  /* which variant the graph shows */
const drVals=L=>{const v=drSim(L);return drFocus(L)?v:v.map(x=>1-x);};
function drShapes(L){
  const t=drVals(L),n=t.length,s0=t[0],dir=t[n-1]-s0;
  const rise=Array.from({length:n},(_,i)=>i===0?s0:Math.min(.99,Math.max(s0,.95)));
  const fall=t.map((_,i)=>s0*(1-i/(n-1)*.85));
  const flat=t.map(()=>s0);
  const line=t.map((_,i)=>s0+(t[n-1]-s0)*i/(n-1));
  const opts=Math.abs(dir)<.03?[['true',t],['rise',t.map((_,i)=>s0+(0.95-s0)*i/(n-1))],['fall',fall]]
    :L.shape?[['true',t],['line',line],['jump',rise]]
    :dir>0?[['true',t],['jump',rise],['fall',fall]]:[['true',t],['flat',flat],['jump',t.map((_,i)=>i===0?s0:.04)]];
  return opts;
}
const drOrder=(L,arr)=>{const k=L.name.length%3;return arr.slice(k).concat(arr.slice(0,k));};
function drCritter(c,x,y,col,o){
  if(c==='moth')return `<g transform="translate(${x} ${y})" opacity="${o}"><path d="M0 0C-10-10-15 0-13 6S-4 8 0 2C4 8 11 12 13 6S10-10 0 0z" fill="${col}" stroke="#555" stroke-width=".8"/><path d="M0-4v10" stroke="#333" stroke-width="1.6"/></g>`;
  if(c==='mouse')return `<g transform="translate(${x} ${y})" opacity="${o}"><ellipse rx="10" ry="6" fill="${col}" stroke="#6b5a45" stroke-width=".8"/><circle cx="8" cy="-5" r="3.2" fill="${col}" stroke="#6b5a45" stroke-width=".8"/><path d="M-10 1q-8 2-10-4" stroke="#6b5a45" fill="none"/><circle cx="11" cy="-1" r="1" fill="#111"/></g>`;
  if(c==='finch')return `<g transform="translate(${x} ${y})" opacity="${o}"><ellipse rx="9" ry="7" fill="#6f6052"/><circle cx="7" cy="-5" r="5" fill="#6f6052"/><path d="M11 -6l${col==='#7a4a1e'?8:5} 2-${col==='#7a4a1e'?8:5} 3z" fill="${col}"/></g>`;
  if(c==='germ')return `<g transform="translate(${x} ${y})" opacity="${o}"><rect x="-9" y="-4.5" width="18" height="9" rx="4.5" fill="${col}" stroke="#2a4a6a" stroke-width=".8"/></g>`;
  if(c==='bug')return `<g transform="translate(${x} ${y})" opacity="${o}"><ellipse rx="7" ry="9" fill="${col}"/><path d="M-7-3h-5M-7 3h-5M7-3h5M7 3h5" stroke="#333" stroke-width="1.2"/></g>`;
  return `<g transform="translate(${x} ${y})" opacity="${o}"><ellipse rx="8" ry="10" fill="${col}" stroke="#222" stroke-width=".8"/>${col==='#d9a21e'?'<path d="M-6-3h12M-7 2h14" stroke="#222" stroke-width="2"/>':''}<circle cy="-11" r="3.5" fill="#222"/></g>`;
}
const DR_BG={bark:['#2b2724','#3a3430'],sand:['#f4efe2','#e6dcc6'],lava:['#1f1c1b','#33302d'],seeds:['#c9b48a','#a8915e'],dish:['#e7f2f7','#cfe3ec'],leaf:['#6aa84f','#58913f'],soil:['#3a2f26','#4a3d30'],birch:['#e8e4da','#cfc8b8'],farm:['#9cc46a','#86ad57']};
function drHabitat(L,p,gen,run){
  const W=480,H=180,bg=DR_BG[L.hab]||['#ddd','#ccc'];let t=`<rect width="${W}" height="${H}" fill="${bg[0]}"/>`;
  for(let i=0;i<14;i++)t+=`<path d="M${(i*37)%W} 0q${12+i%5*3} ${H/2} ${-6+i%3*5} ${H}" stroke="${bg[1]}" stroke-width="${6+i%4*3}" fill="none" opacity=".7"/>`;
  const n=30,nB=Math.round(p*n);let k=0;
  for(let i=0;i<n;i++){const r=(i*9301+49297)%233280/233280,x=24+((i*67)%(W-48)),y=22+((i*43+gen*7)%(H-44)),isB=((i*7+3)%n)<nB;
    t+=drCritter(L.crit,x,y,isB?L.B[1]:L.A[1],1);void r;void k;}
  t+=`<rect x="8" y="8" width="${run?150:110}" height="24" rx="12" fill="#fff" opacity=".88"/><text x="18" y="25" font-size="13" font-weight="800" fill="#1b2433">${run?'Generation '+gen:'Now'}</text>`;
  return ngSvg(W,H,t,'ngsvg drsvg','The habitat and the population');
}
ngDef({key:'drift',name:'Island Drift',ic:'beetle',std:'MS-LS4-4 · LS4-6',subj:'life',
  short:'Predict how natural selection changes a population.',menuDesc:'The environment changes. Predict which variation takes over, then watch the generations go by.',
  intro:'Individuals in a population are not all the same. When the environment changes, some variations survive and reproduce better than others. Predict what happens to the population, run the generations, and then explain why. No mistakes earns 3 stars.',
  how:['**Read the change.** Look at the habitat and the two kinds of animals.','**Predict** which kind becomes more common and pick the matching graph.','**Run the generations**, then choose the best explanation. Watch out for the trap answers!'],
  levels:DR_LEVELS,packs:DR_PACKS,cap3:true,
  mini:L=>{const v=drVals(L);return svgEl(`<svg viewBox="0 0 44 28" width="48" height="32" aria-hidden="true"><rect width="44" height="28" rx="4" fill="${DR_BG[L.hab][0]}"/><polyline points="${v.map((x,i)=>`${3+i*38/(v.length-1)},${25-x*22}`).join(' ')}" fill="none" stroke="#f4b13a" stroke-width="2.6"/></svg>`);},
  start(G){G.st={q1:null,q2:null,q3:null,ran:false,gen:0,shown:[G.L.p0],q3ok:false,tried3:[]};},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,fi=drFocus(L),fname=[L.A,L.B][fi][0],other=[L.A,L.B][1-fi][0];
    const cur=S.shown[S.shown.length-1];
    const series=[{name:fname,color:'#f4b13a',vals:S.shown.map(x=>fi?x:1-x).concat(S.ran?[]:[])}];
    const chartVals=S.shown.map(x=>fi?x:1-x);
    const pad=chartVals.concat(Array(Math.max(0,L.gens+1-chartVals.length)).fill(null)).map(v=>v);
    ngRC(main,drHabitat(L,cur,S.gen,S.ran),
      h('div',{class:'drlegend'},h('span',null,h('i',{style:`background:${L.A[1]}`}),L.A[0]),h('span',null,h('i',{style:`background:${L.B[1]}`}),L.B[0])),
      h('div',{class:'osl'},`Percent of the population that are ${fname.toLowerCase()}`),
      ngChart([{color:'#f4b13a',vals:chartVals.length>1?chartVals:[chartVals[0],chartVals[0]],name:''}],{w:480,h:170,pct:1,xlab:`Generations (0 to ${L.gens})`,label:'Graph of the population'}));
    void series;void pad;void other;
    const lockP=S.ran||G.done;
    const q1o=[['A','More '+L.A[0].toLowerCase()],['B','More '+L.B[0].toLowerCase()],['N','Neither: it stays about the same']];
    const shapes=drOrder(L,drShapes(L)).map(([k,v])=>[k,[ngChart([{color:'#2f6bff',vals:v,w:3}],{w:120,h:64,left:4,bottom:4,label:'Graph choice'})]]);
    const truthQ1=Math.abs(drSim(L)[L.gens]-L.p0)<.03?'N':drSim(L)[L.gens]>L.p0?'B':'A';
    const kids=[h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Which kind will become more common?'),
      ngChoices(q1o,S.q1,v=>{if(lockP)return;S.q1=v;ngRender();},{cls:'col',locked:lockP,mark:S.ran?{[truthQ1]:'ok',...(S.q1!==truthQ1?{[S.q1]:'no'}:{})}:null}),
      h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),`Which graph shows the ${fname.toLowerCase()}?`),
      ngChoices(shapes,S.q2,v=>{if(lockP)return;S.q2=v;ngRender();},{cls:'shapes',locked:lockP,mark:S.ran?{true:'ok',...(S.q2!=='true'?{[S.q2]:'no'}:{})}:null})];
    if(!S.ran)kids.push(ngBtn([I('play'),' Run the generations'],drRun,'good',{style:'width:100%;font-size:18px',disabled:!S.q1||!S.q2||G.done||S.running}));
    if(S.ran&&!S.running){kids.push(h('div',{class:'osl'},h('span',{class:'stepchip'},'3'),'Why did this happen?'),
      h('div',{class:'ppmc'},...drOrder(L,L.why).map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.q3===v?' on':'')+(S.tried3.includes(v)&&v!==L.why[0][0]?' no':'')+(S.q3ok&&v===L.why[0][0]?' ok':''),disabled:G.done||S.q3ok||S.tried3.includes(v),onclick:()=>drWhy(v)},t))));}
    ngRC(side,...kids);
    if(!S.ran)ngSay(!S.q1||!S.q2?'Make both predictions, then run the generations.':'Predictions locked? Press **Run the generations**!');
  },
  hints(G){const L=G.L;return [L.clue,'Individuals do not change their traits to fit in. The ones that already have a helpful trait survive and have more offspring, so the population changes over many generations.',
    `The ${({A:L.A[0],B:L.B[0],N:'neither kind'})[Math.abs(drSim(L)[L.gens]-L.p0)<.03?'N':drSim(L)[L.gens]>L.p0?'B':'A'].toLowerCase()} ${Math.abs(drSim(L)[L.gens]-L.p0)<.03?'(no change)':'become more common'}. The right explanation is about who survives and reproduces.`];}
});
function drRun(){
  const L=G.L,S=G.st,v=drSim(L),key=G.key,lv=G.i;S.running=true;S.ran=true;
  const truthQ1=Math.abs(v[L.gens]-L.p0)<.03?'N':v[L.gens]>L.p0?'B':'A';
  if(S.q1!==truthQ1)G.miss++;if(S.q2!=='true')G.miss++;G.tries++;
  let g=0;const step=()=>{if(!G||G.key!==key||G.i!==lv||$('s-ng').hidden)return;g++;S.gen=g;S.shown.push(v[g]);
    if(g>=L.gens){S.running=false;ngRender();
      const bad=(S.q1!==truthQ1?1:0)+(S.q2!=='true'?1:0);
      ngSay(bad?`Your prediction${bad>1?'s were':' was'} not quite right (red). Look at the graph, then choose the best explanation.`:'Both predictions right! Now choose the best explanation.',bad?'alert':'go');return;}
    ngRender();setTimeout(step,matchMedia('(prefers-reduced-motion:reduce)').matches?60:380);};
  ngRender();setTimeout(step,300);
}
function drWhy(v){
  const L=G.L,S=G.st;if(S.q3ok||G.done)return;S.q3=v;
  if(v===L.why[0][0]){S.q3ok=true;ngRender();ngSay('Exactly! '+L.why[0][1],'go');G.detail={mistakes:G.miss};
    ngWin(ngStars(G.miss,0,1),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);}
  else{S.tried3.push(v);G.miss++;ngRender();fx.pop({icon:'beetle',text:'That’s a trap!',kind:'oops'});
    ngSay('That is a common mistake. Individuals cannot change their traits because they need to. Think about who SURVIVES and has offspring.','alert');}
}
NGTHUMB.drift=()=>{
  let t=`<path d="M0 132q80-26 160-6t160-10v64H0z" fill="#e8d9a8"/><path d="M0 146q80-20 160-4t160-8v46H0z" fill="#d9c48a"/>`;
  t+=`<rect x="196" y="30" width="110" height="78" rx="8" fill="#f6efe0"/><polyline points="206,98 226,96 244,90 260,72 274,52 288,44 298,42" fill="none" stroke="#e2483f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  [[40,60,'#2d2a28'],[80,90,'#efe9dc'],[120,52,'#2d2a28'],[150,96,'#2d2a28'],[60,112,'#efe9dc']].forEach(([x,y,c])=>{t+=`<g transform="translate(${x} ${y}) scale(1.8)"><path d="M0 0C-10-10-15 0-13 6S-4 8 0 2C4 8 11 12 13 6S10-10 0 0z" fill="${c}" stroke="#555" stroke-width=".6"/></g>`;});
  t+=ngStar(296,154,7)+ngStar(24,24,6,'#f6efe0',.7);
  return ngWrap('drift','#2f6d63',t);
};
