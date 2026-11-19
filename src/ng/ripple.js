/* ================= LIFE 2: RIPPLE (MS-LS2-2, LS2-3, LS2-4) =================
   Something changes in an ecosystem. Predict which populations go up, go down or stay the same,
   THEN run the season and watch the graph. Every miss explains the food-web link. */
const RP_OPT=[['up','↑','More'],['same','–','Same'],['down','↓','Fewer']];
const RPL=(name,story,nodes,edges,ev,qs,fact,clue,intro,help)=>({name,story,nodes,edges,help:help||[],ev,qs,fact,clue,intro});
const RP_LEVELS=[
  RPL('The Pond','A quiet pond food chain.',
    [['algae','Algae','🌱',70,190],['flea','Water fleas','🦐',190,120],['minnow','Minnows','🐟',310,190],['heron','Herons','🦩',430,110]],
    [['algae','flea'],['flea','minnow'],['minnow','heron']],
    {id:'heron',kind:'remove',txt:'The herons fly away to a new pond and never come back.'},
    [['minnow','up','The herons ate minnows. With no herons hunting them, more minnows survive.'],
     ['flea','down','More minnows means more water fleas get eaten.'],
     ['algae','up','Fewer water fleas are eating the algae, so the algae grows.']],
    'Removing a top predator can ripple all the way down a food chain. Scientists call this a trophic cascade.',
    'Start next to the herons. Who did the herons eat? Then keep going down the chain one step at a time.',
    'Arrows point from the **food** to the **eater**, the way energy flows. Predict each population, then press **Run the season**.'),
  RPL('Dry Meadow','A meadow food chain in a very dry summer.',
    [['grass','Grass','🌾',90,190],['rabbit','Rabbits','🐇',250,130],['fox','Foxes','🦊',410,190]],
    [['grass','rabbit'],['rabbit','fox']],
    {id:'grass',kind:'down',txt:'A drought hits. With almost no rain, much less grass grows.'},
    [['rabbit','down','Rabbits eat grass. Less food means fewer rabbits survive and have babies.'],
     ['fox','down','Foxes eat rabbits. With fewer rabbits, foxes have less food too.']],
    'Producers like grass are the base of the food chain. When producers drop, every consumer above them has less energy to live on.',
    'A drought hurts the producer. Who depends on grass for food, and who depends on THEM?'),
  RPL('Acorn Year','An oak forest food web.',
    [['oak','Oak acorns','🌳',80,200],['squirrel','Squirrels','🐿️',230,110],['deer','Deer','🦌',230,230],['hawk','Hawks','🦅',420,110]],
    [['oak','squirrel'],['oak','deer'],['squirrel','hawk']],
    {id:'oak',kind:'up',txt:'A bumper year! The oak trees drop twice as many acorns as usual.'},
    [['squirrel','up','More acorns means more food for squirrels, so more of them survive the winter.'],
     ['deer','up','Deer eat acorns too, so they also have more food.'],
     ['hawk','up','More squirrels means more food for the hawks.']],
    'When resources are plentiful, populations that depend on them can grow. When resources are scarce, populations shrink.',
    'More food at the bottom of a food web means more energy for everything that eats it.'),
  RPL('Grassland Web','A grassland food web. Some animals eat more than one thing.',
    [['grass','Grass','🌾',70,200],['hopper','Grasshoppers','🦗',200,110],['rabbit','Rabbits','🐇',200,240],['frog','Frogs','🐸',330,110],['snake','Snakes','🐍',450,180]],
    [['grass','hopper'],['grass','rabbit'],['hopper','frog'],['frog','snake'],['rabbit','snake']],
    {id:'hopper',kind:'down',txt:'A farmer sprays insect poison, and most of the grasshoppers die.'},
    [['frog','down','Frogs eat grasshoppers. With most grasshoppers gone, frogs lose their main food.'],
     ['grass','up','Grasshoppers eat grass. With fewer grasshoppers eating it, more grass grows.']],
    'In a food web, a change to one population affects both the things it eats and the things that eat it.',
    'Look at both arrows on the grasshoppers: one comes IN (what they eat), one goes OUT (who eats them).'),
  RPL('Too Many Rabbits','Deer and rabbits share the same shrubs.',
    [['shrub','Shrubs','🌿',80,190],['deer','Deer','🦌',240,110],['rabbit','Rabbits','🐇',240,250],['wolf','Wolves','🐺',420,110]],
    [['shrub','deer'],['shrub','rabbit'],['deer','wolf']],
    {id:'rabbit',kind:'up',txt:'Someone releases a huge number of pet rabbits into the area.'},
    [['shrub','down','Many more rabbits are eating the shrubs, so the shrubs get eaten faster than they grow.'],
     ['deer','down','Deer and rabbits compete for the same shrubs. With less food left, fewer deer survive.'],
     ['wolf','down','Wolves eat deer. Fewer deer means less food for the wolves.']],
    'When two species need the same limited resource, they compete. More of one can mean fewer of the other.',
    'Rabbits do not eat deer, but they eat the SAME food. What happens to the deer’s food?',
    null),
  RPL('Busy Bees','Bees drink nectar from flowers and carry pollen between them.',
    [['bee','Bees','🐝',260,110],['flower','Wildflowers','🌸',110,210],['apple','Apple trees','🍎',410,210],['grass','Grass','🌾',260,250]],
    [['flower','bee'],['apple','bee']],
    {id:'bee',kind:'down',txt:'A pesticide is sprayed nearby, and many bees die.'},
    [['flower','down','Bees carry pollen from flower to flower. With fewer bees, fewer flowers get pollinated and make seeds.'],
     ['apple','down','Apple trees need bees to pollinate their blossoms. Fewer bees means fewer apples and fewer new trees.'],
     ['grass','same','Grass is pollinated by the wind, not bees, so it is not affected.']],
    'Bees and flowers have a mutualism: both benefit. The bee gets food, and the flower gets pollinated.',
    'This web has a helper link (dashed): bees help flowers make seeds. What if the helpers disappear?',
    'The dashed lines show a **helping** relationship: the bees pollinate these plants.',[['bee','flower'],['bee','apple']]),
  RPL('Wolves Return','Yellowstone National Park, 1995.',
    [['wolf','Wolves','🐺',430,100],['elk','Elk','🦌',290,170],['willow','Willow trees','🌿',140,240],['beaver','Beavers','🦫',80,120]],
    [['willow','elk'],['elk','wolf'],['willow','beaver']],
    {id:'wolf',kind:'add',txt:'After 70 years without them, wolves are brought back to the park.'},
    [['elk','down','Wolves hunt elk, so the number of elk drops.'],
     ['willow','up','Fewer elk are eating young willow trees, so more willows grow tall.'],
     ['beaver','up','Beavers use willows for food and for building dams. More willows means more beavers.']],
    'This really happened! When wolves returned to Yellowstone, elk numbers fell, willows came back along the rivers, and beaver colonies grew.',
    'Follow the change two steps: wolves → elk → willows. Then see who else uses willows.'),
  RPL('Invaders','Tiny floating algae feed a lake food chain.',
    [['algae','Floating algae','🌱',90,200],['zoo','Tiny animals (zooplankton)','🦐',240,120],['fish','Small fish','🐟',400,200],['zebra','Zebra mussels','🐚',240,250]],
    [['algae','zoo'],['zoo','fish'],['algae','zebra']],
    {id:'zebra',kind:'add',txt:'Zebra mussels arrive on a boat. They spread fast and filter algae out of the water all day.'},
    [['algae','down','Zebra mussels filter huge amounts of algae out of the water.'],
     ['zoo','down','The tiny animals eat algae. The mussels are competing with them for it.'],
     ['fish','down','Small fish eat the tiny animals. Fewer tiny animals means less food for fish.']],
    'An invasive species is a living thing brought to a new place where it spreads and harms the ecosystem. Zebra mussels are a real problem in the Great Lakes and in New York lakes.',
    'The mussels do not eat fish. But they eat what is at the very bottom of the chain.'),
  RPL('Forest Floor','Nothing in a forest is wasted.',
    [['tree','Trees','🌳',90,110],['leaves','Dead leaves','🍂',270,90],['decomp','Fungi and worms','🍄',420,190],['soil','Soil nutrients','🟫',220,240]],
    [['tree','leaves'],['leaves','decomp'],['decomp','soil'],['soil','tree']],
    {id:'decomp',kind:'down',txt:'A chemical spill kills most of the fungi and worms in the soil.'},
    [['leaves','up','Fungi and worms break down dead leaves. Without them, dead leaves pile up.'],
     ['soil','down','Decomposers return nutrients from dead leaves to the soil. Without them, the soil runs low.'],
     ['tree','down','Trees need those nutrients to grow. Matter is no longer cycling back to them.']],
    'Decomposers recycle matter. They break down dead things and return nutrients to the soil, where plants use them again.',
    'This is a loop! Matter cycles: tree → leaves → decomposers → soil → tree. Which step got broken?',
    'This web is a **cycle**: matter goes around and around.')
];
const RP_PACKS={0:'Pack 1: Food chains',3:'Pack 2: Food webs',6:'Pack 3: Big changes'};
const RP_EVTXT={remove:'Gone',add:'Arrives',up:'Increases',down:'Decreases'};
function rpCurve(kind,seed){const n=12,v=[];for(let i=0;i<n;i++){const u=i/(n-1),w=Math.sin(i*1.7+seed)*0.015;
  v.push(kind==='up'?0.42+0.36*(1-Math.exp(-u*3))+w:kind==='down'?0.58-0.38*(1-Math.exp(-u*3))+w:kind==='remove'?0.55*Math.max(0,1-u*4):kind==='add'?0.5*(1-Math.exp(-u*5)):0.5+w);}return v;}
const RP_COLS=['#2f6bff','#d64545','#1f9d55','#8a4fd6','#f08a3e'];
function rpBoard(L,S){
  const node={};L.nodes.forEach(n=>{node[n[0]]={id:n[0],label:n[1],em:n[2],x:n[3],y:n[4]};});
  let t='<defs><marker id="rpa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10z" fill="#5b6b86"/></marker></defs>';
  const line=(a,b,dash)=>{const A=node[a],B=node[b],dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy),r=34;
    return `<line x1="${A.x+dx/d*r}" y1="${A.y+dy/d*r}" x2="${B.x-dx/d*(r+4)}" y2="${B.y-dy/d*(r+4)}" stroke="#5b6b86" stroke-width="3" ${dash?'stroke-dasharray="7 6" marker-start="url(#rpa)"':''} marker-end="url(#rpa)"/>`;};
  L.edges.forEach(([a,b])=>{t+=line(a,b);});(L.help||[]).forEach(([a,b])=>{t+=line(a,b,1);});
  const asked=new Set(L.qs.map(q=>q[0]));
  L.nodes.forEach(n=>{const N=node[n[0]],ev=L.ev.id===N.id,ask=asked.has(N.id),res=S.res&&ask?S.res[N.id]:null;
    const ring=ev?'#f4b13a':ask?'#2f6bff':'#c3cadb';
    t+=`<g class="rpnode${ev?' ev':''}"><circle cx="${N.x}" cy="${N.y}" r="32" fill="#fff" stroke="${ring}" stroke-width="${ev||ask?4:2.5}"/>`+
      `<text x="${N.x}" y="${N.y+10}" text-anchor="middle" font-size="30">${N.em}</text>`+
      `<text x="${N.x}" y="${N.y+50}" text-anchor="middle" font-size="13" font-weight="800" fill="#1b2433">${ngEsc(N.label)}</text>`;
    if(ev){const k=L.ev.kind,col=k==='remove'||k==='down'?'#d64545':'#1f9d55',sym=k==='remove'?'✕':k==='add'?'+':k==='up'?'▲':'▼';
      t+=`<circle cx="${N.x+26}" cy="${N.y-24}" r="13" fill="${col}"/><text x="${N.x+26}" y="${N.y-19}" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">${sym}</text>`;}
    if(res!=null)t+=`<circle cx="${N.x-26}" cy="${N.y-24}" r="12" fill="${res?'#1f9d55':'#d64545'}"/><text x="${N.x-26}" y="${N.y-19}" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">${res?'✓':'✗'}</text>`;
    t+='</g>';});
  return ngSvg(520,290,t,'ngsvg rpsvg','Food web. Arrows point from food to eater.');
}
ngDef({key:'ripple',name:'Ripple',ic:'web',std:'MS-LS2-2 · LS2-3 · LS2-4',subj:'life',cap3:true,
  short:'Predict how one change ripples through a food web.',menuDesc:'Something changes in an ecosystem. Predict which populations rise or fall, then watch the season play out.',
  intro:'Every living thing in an ecosystem is connected. When one population changes, the change ripples through the food web. Predict what happens to each population before you run the season. All right earns 3 stars.',
  how:['**Read the change** in the yellow box. It is marked on the web.','For each blue-ringed population, predict **More**, **Same** or **Fewer**.','Press **Run the season**. The graph shows what really happened, and every answer is explained.'],
  levels:RP_LEVELS,packs:RP_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 30" width="48" height="34" aria-hidden="true">${L.nodes.map(n=>`<circle cx="${4+n[3]/520*36}" cy="${3+n[4]/290*24}" r="4" fill="${n[0]===L.ev.id?'#f4b13a':'#7aa2ff'}"/>`).join('')}</svg>`),
  start(G){G.st={pred:{},res:null};},
  hud(G){return {label:'Wrong',val:G.miss,target:'3 ★ = every prediction right'};},
  render(G,main,side){
    const L=G.L,S=G.st,ran=!!S.res;
    const kids=[rpBoard(L,S)];if(ran)kids[0].classList.add('ran');
    if(ran){const series=[{name:L.nodes.find(n=>n[0]===L.ev.id)[1],color:'#f4b13a',vals:rpCurve(L.ev.kind,0),dash:1,w:2.6}];
      L.qs.forEach((q,k)=>series.push({name:L.nodes.find(n=>n[0]===q[0])[1],color:RP_COLS[k%5],vals:rpCurve(q[1],k+1)}));
      kids.push(h('div',{class:'rpgraph'},h('div',{class:'osl'},'What happened over the season'),ngChart(series,{w:520,h:200,xlab:'Time →',ylab:'Population',anim:1,label:'Population graph'})));}
    ngRC(main,...kids);
    const opts=L.qs.map(([id,ans,why])=>{const nm=L.nodes.find(n=>n[0]===id),mine=S.pred[id],ok=ran?mine===ans:null;
      return h('div',{class:'rpq'+(ran?(ok?' ok':' no'):'')},h('div',{class:'rpqh'},h('span',{class:'rpem'},nm[2]),h('b',null,nm[1])),
        ngChoices(RP_OPT,mine,v=>{if(ran||G.done)return;S.pred[id]=v;ngRender();},{locked:ran||G.done,label:'Prediction for '+nm[1],mark:ran?{[ans]:'ok',...(mine!==ans?{[mine]:'no'}:{})}:null}),
        ran?h('div',{class:'rpwhy'},ok?'✓ ':'✗ ',why):null);});
    const all=L.qs.every(q=>S.pred[q[0]]);
    ngRC(side,h('div',{class:'rpev'},h('b',null,'The change: '),L.ev.txt),
      h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Predict'),...opts,
      ran?null:ngBtn([I('play'),' Run the season'],rpRun,'good',{style:'width:100%;font-size:18px',disabled:!all||G.done}));
    if(!ran){const left=L.qs.filter(q=>!S.pred[q[0]]).length;ngSay(left?`Predict ${left} more population${left>1?'s':''}. Arrows point from food to eater.`:'All predicted. Press **Run the season** to see what happens!');}
  },
  hints(G){const L=G.L,q=L.qs[0],nm=L.nodes.find(n=>n[0]===q[0])[1];
    return ['Arrows point from the food to the eater. '+L.clue,'Change one link at a time. Ask: does this population now have MORE food or LESS food? MORE predators or FEWER predators?',`${nm}: ${({up:'More',down:'Fewer',same:'Same'})[q[1]]}. ${q[2]}`];},
  onHint(G){if(G.hint===3){const q=G.L.qs[0];if(!G.st.res)G.st.pred[q[0]]=q[1];}}
});
function rpRun(){
  if(!G||G.done)return;const L=G.L,S=G.st;S.res={};let wrong=0;
  L.qs.forEach(([id,ans])=>{const ok=S.pred[id]===ans;S.res[id]=ok;if(!ok)wrong++;});
  G.tries++;G.miss=wrong;G.detail={wrong,of:L.qs.length};ngRender();
  const n=L.qs.length,right=n-wrong;
  if(wrong===0){ngSay('Every prediction was right! You followed the ripple perfectly.','go');ngWin(3,['You predicted ',h('b',null,`all ${n}`),' populations correctly.']);}
  else if(right*2>=n){ngSay(`${right} of ${n} right. Read the ✗ explanations to see the links you missed.`,'alert');ngWin(wrong===1?2:1,['You predicted ',h('b',null,`${right} of ${n}`),' populations correctly. Read why the others changed.']);}
  else{ngSay(`Only ${right} of ${n} right. Read each ✗ explanation, then try again.`,'alert');ngRetry([`You got ${right} of ${n}. You need at least half right to pass. Read the explanations on each population, then try again.`]);}
}
NGTHUMB.ripple=()=>{
  let t=`<circle cx="160" cy="92" r="70" fill="none" stroke="#bff0d4" stroke-opacity=".25" stroke-width="10"/><circle cx="160" cy="92" r="44" fill="none" stroke="#bff0d4" stroke-opacity=".35" stroke-width="8"/>`;
  const N=[[60,140,'🌱'],[130,60,'🐇'],[210,120,'🦊'],[270,50,'🦅']];
  [[0,1],[1,2],[2,3],[0,2]].forEach(([a,b])=>{t+=`<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="#f6efe0" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;});
  N.forEach(([x,y,e])=>{t+=`<circle cx="${x}" cy="${y}" r="24" fill="#f6efe0"/><text x="${x}" y="${y+9}" text-anchor="middle" font-size="25">${e}</text>`;});
  t+=`<circle cx="160" cy="92" r="16" fill="#f4b13a"/><text x="160" y="99" text-anchor="middle" font-family="system-ui,Arial" font-weight="900" font-size="18" fill="#101536">!</text>`+ngStar(300,160,7)+ngStar(24,26,6,'#f6efe0',.7);
  return ngWrap('ripple','#0f6b55',t);
};
