/* ================= EARTH 3: PANGAEA REBUILD (MS-ESS2-3) =================
   Rebuild the supercontinent from real evidence: fossils, glacier scratches and matching rocks.
   Every border on the map shows the evidence found on BOTH sides of it, so a continent can only
   go where its evidence matches. Pack 3 predicts what forms at each kind of plate boundary. */
const PG_EV={M:['Mesosaurus','#17a2a2','A small reptile that lived in fresh water. It could not swim across an ocean.'],
  Cy:['Cynognathus','#8a4fd6','A land reptile about the size of a wolf. It could not cross an ocean.'],
  L:['Lystrosaurus','#e07a2a','A land reptile with tusks, about the size of a pig.'],
  G:['Glossopteris','#3f9a3a','A seed fern. Its seeds were too big to blow across an ocean.'],
  I:['Glacier scratches','#3f8fe0','Scratches left in rock by an ancient ice sheet that spread across these lands.'],
  R:['Northern mountain rocks','#8a5a3a','The same old mountain rocks run through North America, Greenland and Europe.'],
  A:['Appalachian–Atlas rocks','#b0603a','The Appalachian Mountains match old mountain rocks in Morocco, Africa.'],
  K:['Matching coal beds','#3a3a3a','Coal beds of the same age line up between North America and Europe.'],
  O:['Matching rock layers','#6a6a9a','The same layers of rock are found in Antarctica and Australia.']};
const PGC={na:['North America','#e8a23a'],sa:['South America','#5fb85a'],af:['Africa','#d9b44a'],eu:['Eurasia','#c97a4a'],gr:['Greenland','#d7e3ea'],an:['Antarctica','#e9f0f5'],in:['India','#e07a6a'],au:['Australia','#e0904a']};
const PGT=(id,ev)=>({id,ev});
const PGL=(name,story,o)=>Object.assign({name,story,type:'fit'},o);
const PG_LEVELS=[
  PGL('Two Coasts','Two continents that were once side by side.',{slots:[['W',70,90,150,150],['E',240,70,160,190]],borders:[['W','E',['M']]],
    tiles:[PGT('sa',['M','Cy','G']),PGT('af',['M','Cy','L','G']),PGT('au',['G','I'])],
    intro:'Each border on the map shows evidence found on **both sides** of it. A continent fits a spot only if it has **every** piece of evidence on that spot’s borders. One continent in the tray does not belong.',
    fact:'Alfred Wegener noticed in 1912 that the same fossils are found on continents now separated by oceans. He called the supercontinent Pangaea.',
    clue:'Mesosaurus lived in fresh water, so it could not cross an ocean. Which continents have its fossils?'}),
  PGL('Fossil Trail','Three continents joined in a row.',{slots:[['W',30,100,130,140],['C',175,70,140,170],['S',230,250,170,46]],borders:[['W','C',['M','Cy']],['C','S',['L']]],
    tiles:[PGT('sa',['M','Cy','G','I']),PGT('af',['M','Cy','L','G','I']),PGT('an',['L','G','I']),PGT('na',['R','K','A'])],
    fact:'Lystrosaurus fossils are found in Africa, India and Antarctica. A land animal could only have walked between them if the continents were joined.',
    clue:'The middle spot touches BOTH borders. Which continent has every fossil on both borders?'}),
  PGL('Gondwana','The southern half of Pangaea.',{slots:[['W',20,90,120,130],['C',150,60,130,150],['E',300,70,110,90],['S',150,225,190,60],['SE',360,200,90,80]],
    borders:[['W','C',['M','Cy']],['C','S',['L','G']],['C','E',['L']],['S','E',['G','I']],['S','SE',['O']]],
    tiles:[PGT('sa',['M','Cy','G','I']),PGT('af',['M','Cy','L','G','I']),PGT('an',['L','G','I','O']),PGT('in',['L','G','I']),PGT('au',['G','I','O'])],
    fact:'Gondwana was the southern part of Pangaea. Glacier scratches show that an ice sheet once covered parts of what are now hot places like India and Africa.',
    clue:'Start with the spot that has the most evidence around it. Then use the rare evidence (like matching rock layers) to place the rest.'}),
  PGL('Mountain Match','The northern half of Pangaea.',{slots:[['W',40,70,150,140],['N',200,20,110,70],['E',300,90,140,110],['S',150,215,170,70]],
    borders:[['W','N',['R']],['N','E',['R']],['W','E',['K']],['W','S',['A']]],
    tiles:[PGT('na',['R','K','A']),PGT('gr',['R']),PGT('eu',['R','K']),PGT('af',['A','M']),PGT('au',['G','O'])],
    fact:'The Appalachian Mountains in New York’s neighborhood are made of the same rocks as mountains in Greenland, Scotland, Norway and Morocco. They formed as one mountain range when the continents collided.',
    clue:'The spot on the left touches three borders with three kinds of rock evidence. Which continent has all three?'}),
  PGL('Climate Clues','Fossils and rocks can also show what the climate used to be.',{type:'rounds',rounds:[
      {t:'mc',q:'Coal and fossils of tropical ferns are found in Antarctica, which is frozen today. What does this tell us?',opts:[['moved','Antarctica was once in a warmer place, closer to the equator.'],['always','Antarctica has always been this cold.'],['blown','The ferns blew there in a storm.']],ans:'moved',why:'Coal forms from swampy, warm forests. Antarctica must have been somewhere warmer before it drifted to the South Pole.'},
      {t:'mc',q:'Glacier scratches are found in hot India and Africa. What is the best explanation?',opts:[['pole','They were once joined together near the South Pole, under an ice sheet.'],['snow','It used to snow in India every year.'],['people','People made the scratches with tools.']],ans:'pole',why:'The scratches line up when the continents are put back together, showing one ice sheet once covered them near the South Pole.'},
      {t:'mc',q:'Why can’t Mesosaurus fossils in Africa and South America be explained by Mesosaurus swimming across the ocean?',opts:[['fresh','It was a small freshwater reptile that could not cross a salty ocean.'],['fly','It flew instead.'],['bridge','It walked across a bridge.']],ans:'fresh',why:'Mesosaurus lived in fresh water and was only about 1 meter long. The continents must have been joined.'}],
    fact:'Wegener used all of these clues together. Each clue alone is interesting, but together they make strong evidence that the continents have moved.',
    clue:'Ask: could this rock or fossil have formed where the continent is TODAY?'}),
  PGL('Pangaea','Put the whole supercontinent back together.',{slots:[['NW',30,20,140,110],['N',190,10,220,80],['W',20,150,110,120],['C',150,105,130,130],['E',300,110,100,70],['S',150,250,190,44],['SE',360,200,90,80]],
    borders:[['NW','N',['R','K']],['NW','C',['A']],['W','C',['M','Cy']],['C','S',['L']],['C','E',['L']],['S','E',['G','I']],['S','SE',['O']]],
    tiles:[PGT('na',['R','K','A']),PGT('eu',['R','K']),PGT('af',['A','M','Cy','L','G','I']),PGT('sa',['M','Cy','G','I']),PGT('an',['L','G','I','O']),PGT('in',['L','G','I']),PGT('au',['G','I','O'])],
    fact:'Pangaea started to break apart about 200 million years ago. The plates are still moving today, a few centimeters each year.',
    clue:'Africa sat in the middle of Pangaea. Then work outward one border at a time.'}),
  PGL('Pulling Apart','Plates that move away from each other.',{type:'rounds',rounds:[
      {t:'bd',a:'ocean',b:'ocean',mv:'apart',ans:'ridge',why:'Where ocean plates pull apart, magma rises and cools into new sea floor, building a long underwater mountain range: a mid-ocean ridge.'},
      {t:'bd',a:'cont',b:'cont',mv:'apart',ans:'rift',why:'When a continent starts to split, the land drops down into a long rift valley, like the East African Rift today.'},
      {t:'mc',q:'Rock samples are taken from the sea floor at A (right next to a ridge), B (farther away) and C (farthest). Which rock is the YOUNGEST?',opts:[['A','Rock A, next to the ridge'],['B','Rock B, in the middle'],['C','Rock C, farthest away']],ans:'A',why:'New sea floor forms at the ridge and is pushed outward. The farther from the ridge, the older the rock.'}],
    fact:'The pattern of sea floor ages, youngest at the ridge and older farther away, is strong evidence for sea-floor spreading.',
    clue:'When plates pull apart, something has to fill the gap. Where does new crust come from?'}),
  PGL('Crashing Together','Plates that push into each other.',{type:'rounds',rounds:[
      {t:'bd',a:'ocean',b:'cont',mv:'together',ans:'trench',why:'The heavier ocean plate sinks under the continent. That makes a deep trench, and melting rock rises to form volcanoes, like the Andes Mountains.'},
      {t:'bd',a:'cont',b:'cont',mv:'together',ans:'mtn',why:'Neither continent sinks easily, so the crust crumples and piles up into tall mountains, like the Himalayas (where India hit Asia).'},
      {t:'bd',a:'ocean',b:'ocean',mv:'together',ans:'arc',why:'One ocean plate sinks under the other, making a trench and a curved line of volcanic islands, like Japan.'}],
    fact:'Mount Everest, the tallest mountain on Earth, is still growing a few millimeters each year because India is still pushing into Asia.',
    clue:'Ocean crust is thinner and heavier than continental crust. When they meet, which one sinks?'}),
  PGL('Plate Detective','Mixed boundaries from around the world.',{type:'rounds',rounds:[
      {t:'bd',a:'cont',b:'cont',mv:'slide',ans:'fault',why:'Plates sliding past each other get stuck, then slip suddenly. That makes earthquakes along a long fault, like the San Andreas Fault in California.'},
      {t:'bd',a:'ocean',b:'ocean',mv:'apart',ans:'ridge',why:'Ocean plates moving apart make a mid-ocean ridge, like the one down the middle of the Atlantic Ocean.'},
      {t:'mc',q:'There is a mid-ocean ridge down the middle of the Atlantic Ocean. What is happening to the Atlantic?',opts:[['wider','It is slowly getting wider, a few centimeters a year.'],['narrow','It is getting narrower.'],['same','It stays exactly the same size.']],ans:'wider',why:'New sea floor forms at the ridge, pushing the Americas and Europe and Africa apart about as fast as your fingernails grow.'},
      {t:'mc',q:'On a world map, earthquakes and volcanoes form long lines. Why?',opts:[['edges','Most happen at the edges of plates, where plates meet.'],['random','They happen in random places.'],['hot','They only happen where the weather is hot.']],ans:'edges',why:'Plate boundaries are where plates pull apart, push together or slide past each other, so that is where most earthquakes and volcanoes happen.'}],
    fact:'The "Ring of Fire" around the Pacific Ocean is a line of volcanoes and earthquakes that marks plate boundaries.',
    clue:'Look at the arrows: apart, together, or sliding past?'})
];
const PG_PACKS={0:'Pack 1: Fossil clues',3:'Pack 2: Rocks and climate',6:'Pack 3: Plate boundaries'};
const PG_FEAT=[['ridge','Mid-ocean ridge'],['rift','Rift valley'],['trench','Trench + volcanic mountains'],['arc','Trench + volcanic islands'],['mtn','Tall folded mountains'],['fault','Sliding fault + earthquakes']];
const pgBadge=(e,x,y)=>`<g><circle cx="${x}" cy="${y}" r="12" fill="${PG_EV[e][1]}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="${e.length>1?10:12}" font-weight="900" fill="#fff">${e}</text></g>`;
function pgFitBoard(G){
  const L=G.L,S=G.st,W=460,H=300;let t=`<rect width="${W}" height="${H}" fill="#1f6fae"/><rect width="${W}" height="${H}" fill="url(#pgw)" opacity=".25"/><defs><pattern id="pgw" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10q10-6 20 0t20 0" stroke="#fff" fill="none"/></pattern></defs>`;
  const sl={};L.slots.forEach(([id,x,y,w,hh])=>{sl[id]={x,y,w,h:hh,cx:x+w/2,cy:y+hh/2};});
  L.slots.forEach(([id,x,y,w,hh])=>{const tid=S.place[id],c=tid?PGC[tid]:null,bad=S.bad&&S.bad.includes(id);
    t+=`<g class="pgslot${tid?' full':''}${bad?' bad':''}" data-s="${id}" role="button" tabindex="0" aria-label="${tid?c[0]:'Empty spot'}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${Math.min(w,hh)/3}" fill="${c?c[1]:'#ffffff'}" fill-opacity="${c?1:.18}" stroke="${bad?'#ff6b6b':c?'#5a4632':'#fff'}" stroke-width="${bad?4:2.5}" ${c?'':'stroke-dasharray="7 6"'}/>`+
      `<text x="${x+w/2}" y="${y+hh/2+5}" text-anchor="middle" font-size="${c?13:12}" font-weight="900" fill="${c?'#1b2433':'#fff'}">${c?ngEsc(c[0]):'?'}</text></g>`;});
  L.borders.forEach(([a,b,ev])=>{const A=sl[a],B=sl[b],mx=(A.cx+B.cx)/2,my=(A.cy+B.cy)/2;
    t+=`<line x1="${A.cx}" y1="${A.cy}" x2="${B.cx}" y2="${B.cy}" stroke="#fff" stroke-width="2" stroke-dasharray="3 4" opacity=".7" pointer-events="none"/>`;
    ev.forEach((e,i)=>{t+=pgBadge(e,mx+(i-(ev.length-1)/2)*26,my);});});
  return ngSvg(W,H,t,'ngsvg pgsvg','Map of spots for the continents. Badges on the dashed lines show the evidence on both sides of each border.');
}
function pgBound(R,done){
  const W=460,H=230,ocean='#2b4a6a',cont='#c9a46a';let t=`<rect width="${W}" height="${H}" fill="#cfe8f7"/><rect y="150" width="${W}" height="80" fill="#e07a3a" opacity=".55"/><text x="10" y="222" font-size="11" font-weight="800" fill="#7a2a0a">Hot mantle</text>`;
  const plate=(x0,x1,k)=>k==='ocean'?`<rect x="${x0}" y="110" width="${x1-x0}" height="26" fill="${ocean}"/><rect x="${x0}" y="80" width="${x1-x0}" height="30" fill="#5aa0d8" opacity=".6"/>`:`<rect x="${x0}" y="78" width="${x1-x0}" height="62" fill="${cont}"/>`;
  if(R.mv==='slide'){t=`<rect width="${W}" height="${H}" fill="#e8dcc0"/><rect x="0" y="0" width="${W}" height="113" fill="${cont}"/><rect x="0" y="117" width="${W}" height="113" fill="#b8925a"/><line x1="0" y1="115" x2="${W}" y2="115" stroke="#5a2f12" stroke-width="4"/>`+
    `<path d="M140 60h-80m0 0l14-10m-14 10l14 10" stroke="#1b2433" stroke-width="5" fill="none"/><path d="M320 170h80m0 0l-14-10m14 10l-14 10" stroke="#1b2433" stroke-width="5" fill="none"/><text x="230" y="20" text-anchor="middle" font-size="13" font-weight="800" fill="#1b2433">Top view</text>`;
    if(done)t+=`<g fill="#d64545">${[80,190,300,390].map(x=>`<path d="M${x} 103l6 6-6 6 6 6" stroke="#d64545" stroke-width="3" fill="none"/>`).join('')}</g><text x="230" y="140" text-anchor="middle" font-size="13" font-weight="900" fill="#7a1a1a">Earthquakes along the fault</text>`;
    return ngSvg(W,H,t,'ngsvg pgsvg','Two plates sliding past each other');}
  t+=plate(0,226,R.a)+plate(234,W,R.b);
  const arr=(x,dir)=>`<path d="M${x} 50h${dir*60}m0 0l${-dir*12}-9m${dir*12} 9l${-dir*12} 9" stroke="#1b2433" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if(R.mv==='apart')t+=arr(170,-1)+arr(290,1);else t+=arr(80,1)+arr(380,-1);
  t+=`<text x="113" y="${R.a==='ocean'?128:114}" text-anchor="middle" font-size="12" font-weight="800" fill="${R.a==='ocean'?'#fff':'#3a2a10'}">${R.a==='ocean'?'Ocean plate':'Continent'}</text><text x="347" y="${R.b==='ocean'?128:114}" text-anchor="middle" font-size="12" font-weight="800" fill="${R.b==='ocean'?'#fff':'#3a2a10'}">${R.b==='ocean'?'Ocean plate':'Continent'}</text>`;
  if(done){const a=R.ans;
    if(a==='ridge')t+=`<path d="M190 110L230 74L270 110Z" fill="#3a5a7a"/><path d="M230 150V92" stroke="#ff6a2a" stroke-width="8"/>`;
    if(a==='rift')t+=`<path d="M190 78L212 112H248L270 78Z" fill="#cfe8f7"/><path d="M230 150V114" stroke="#ff6a2a" stroke-width="6"/>`;
    if(a==='trench'||a==='arc')t+=`<path d="M206 110L226 150L246 110Z" fill="#14304a"/><path d="M${a==='arc'?300:300} 78l20-40 20 40z" fill="#7a4a2a"/><path d="M318 40l-6-14M322 40l6-14" stroke="#ff6a2a" stroke-width="3"/><path d="M226 150Q280 170 320 80" stroke="#ff6a2a" stroke-width="5" fill="none" stroke-dasharray="6 4"/>`;
    if(a==='mtn')t+=`<path d="M170 78L200 30 222 60 240 18 262 58 290 78Z" fill="#8a6a40" stroke="#5a4020" stroke-width="2"/><path d="M234 26l6-8 6 8" fill="#fff"/>`;
    t+=`<text x="230" y="${H-12}" text-anchor="middle" font-size="14" font-weight="900" fill="#1b2433">${PG_FEAT.find(f=>f[0]===a)[1]}</text>`;}
  return ngSvg(W,H,t,'ngsvg pgsvg','A cross-section of two plates at a boundary');
}
ngDef({key:'pangaea',name:'Pangaea Rebuild',ic:'puzzle',std:'MS-ESS2-3',subj:'earth',cap3:true,
  short:'Rebuild Pangaea from fossil and rock evidence.',menuDesc:'Use fossils, glacier scratches and matching rocks to rebuild Pangaea, then predict what forms where plates meet.',
  intro:'The continents were once joined in a supercontinent called Pangaea. Use the same evidence scientists used (fossils, glacier scratches and matching rocks) to put it back together. Then predict what forms where plates meet today.',
  how:['**Tap a continent** in the tray, then **tap a spot** on the map to place it.','Every border shows evidence found on **both** sides. A continent must have all of it.','Press **Check**. Right on the first check earns 3 ★.'],
  levels:PG_LEVELS,packs:PG_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="#1f6fae"/>${L.type==='fit'?L.slots.map(s=>`<rect x="${s[1]/460*44}" y="${s[2]/300*30}" width="${s[3]/460*44}" height="${s[4]/300*30}" rx="2" fill="#d9b44a"/>`).join(''):'<rect x="2" y="12" width="19" height="9" fill="#c9a46a"/><rect x="23" y="14" width="19" height="7" fill="#2b4a6a"/><path d="M14 7h-6M30 7h6" stroke="#fff" stroke-width="2"/>'}</svg>`),
  start(G){G.st={place:{},sel:null,bad:null,msg:null,r:0,pick:null,wrong:[],okNow:false,ok:false};},
  hud(G){return G.L.type==='fit'?{label:'Checks',val:G.tries,target:'3 ★ = right on the first check'}:{label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st;
    if(L.type==='fit'){
      const b=pgFitBoard(G);
      b.querySelectorAll('.pgslot').forEach(el=>{const go=()=>pgTapSlot(el.dataset.s);el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
      const used=new Set(Object.values(S.place)),ev=[...new Set(L.tiles.flatMap(t=>t.ev).concat(L.borders.flatMap(x=>x[2])))];
      ngRC(main,b,h('div',{class:'pglegend'},...ev.map(e=>h('span',{title:PG_EV[e][2]},h('i',{style:`background:${PG_EV[e][1]}`},e),PG_EV[e][0]))));
      const tray=L.tiles.filter(t=>!used.has(t.id)).map(t=>h('button',{type:'button',class:'pgtile'+(S.sel===t.id?' on':''),disabled:S.ok||G.done,'aria-pressed':S.sel===t.id?'true':'false',onclick:()=>{S.sel=S.sel===t.id?null:t.id;S.msg=null;ngRender();}},
        h('b',null,h('i',{style:`background:${PGC[t.id][1]}`}),PGC[t.id][0]),h('span',{class:'pgev'},...t.ev.map(e=>h('i',{style:`background:${PG_EV[e][1]}`,title:PG_EV[e][0]},e)))));
      const full=L.slots.every(s=>S.place[s[0]]);
      ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Continents tray',h('small',null,'tap one, then tap a spot')),
        h('div',{class:'pgtray'},...(tray.length?tray:[h('p',{class:'sub'},'All continents are on the map.')])),
        h('div',{class:'pgnotes'},h('b',null,'Field notes: '),'tap a placed continent to send it back to the tray.'),
        S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
        S.ok?null:ngBtn('Check my map',pgCheck,'good',{style:'width:100%;font-size:17px',disabled:!full||G.done}));
      if(!S.msg&&!S.ok)ngSay(S.sel?`Now tap a spot on the map for ${PGC[S.sel][0]}.`:'Tap a continent in the tray, then a spot on the map.');
      return;
    }
    const R=L.rounds[S.r];
    ngRC(main,R&&R.t==='bd'?pgBound(R,S.okNow):h('div',{class:'pgpic'},h('div',{class:'pgbig'},I('globe',90)),h('p',null,'Think like Alfred Wegener: what could explain this clue?')));
    const prog=h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
    const box=!R?[]:R.t==='bd'?[h('p',{class:'ppq'},'What will form at this boundary?'),h('div',{class:'ppmc'},...PG_FEAT.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>pgAnswer(v)},t)))]
      :[h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>pgAnswer(v)},t)))];
    ngRC(side,prog,...box,S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      S.okNow&&S.r<L.rounds.length?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',pgNextRound,'good',{style:'width:100%;margin-top:6px'}):null);
    if(!S.msg&&R)ngSay(R.t==='bd'?'Read the arrows and the kinds of crust. Then predict.':'Use the evidence to explain.');
  },
  hints(G){const L=G.L;if(L.type==='fit'){const a=pgSolve(L);return [L.clue,'Read each border badge. A continent can only touch a border if it has that evidence too. The spot with the most borders is usually the easiest to fill first.',
      'Answer: '+L.slots.map(s=>`${s[0]} = ${PGC[a[s[0]]][0]}`).join(', ')+'.'];}
    const R=L.rounds[G.st.r]||L.rounds[0];return [L.clue,'Apart: new crust forms (ridges and rifts). Together: crust sinks or crumples (trenches, volcanoes, mountains). Sliding: earthquakes along a fault.',
      R.t==='bd'?'Answer: '+PG_FEAT.find(f=>f[0]===R.ans)[1]+'.':'Answer: '+R.opts.find(o=>o[0]===R.ans)[1]];}
});
function pgSolve(L){const ids=L.slots.map(s=>s[0]),need={};ids.forEach(id=>{need[id]=new Set();});L.borders.forEach(([a,b,ev])=>ev.forEach(e=>{need[a].add(e);need[b].add(e);}));
  const out={},used=new Set();const go=k=>{if(k===ids.length)return true;const id=ids[k];for(const t of L.tiles){if(used.has(t.id))continue;if([...need[id]].every(e=>t.ev.includes(e))){out[id]=t.id;used.add(t.id);if(go(k+1))return true;used.delete(t.id);}}return false;};go(0);return out;}
function pgTapSlot(id){const S=G.st;if(S.ok||G.done)return;
  if(S.sel){const prev=S.place[id];S.place[id]=S.sel;S.sel=prev&&false?prev:null;}else if(S.place[id]){delete S.place[id];}
  S.bad=null;S.msg=null;ngRender();}
function pgCheck(){
  const L=G.L,S=G.st;if(S.ok||G.done)return;G.tries++;
  const probs=[];L.borders.forEach(([a,b,ev])=>{ev.forEach(e=>{[a,b].forEach(s=>{const t=S.place[s];if(t&&!L.tiles.find(x=>x.id===t).ev.includes(e))probs.push([s,t,e]);});});});
  if(ngT())return ngTDone(probs.length?0:1);
  if(!probs.length){S.ok=true;S.msg=['ok','✓ Every border matches the evidence. Pangaea is back together!'];ngRender();ngSay('The evidence lines up on every border!','go');G.detail={checks:G.tries};
    ngWin(ngStars(G.tries-1,0,1),['You rebuilt the map on check ',h('b',null,G.tries),'.']);return;}
  G.miss++;S.bad=[...new Set(probs.map(p=>p[0]))];const [s,t,e]=probs[0];
  S.msg=['no',`${PGC[t][0]} has no ${PG_EV[e][0]} evidence, but a border of that spot does. ${PG_EV[e][2]}`];
  fx.pop({icon:'puzzle',text:'Evidence does not match',kind:'oops'});ngRender();ngSay('A red spot does not match the evidence on its borders.','alert');void s;
}
function pgAnswer(v){const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||S.okNow||G.done)return;
  if(ngT())return ngTAns(v===R.ans,pgNextRound);
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'globe',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no',R.t==='bd'?'Not quite. Look at the arrows and the kinds of crust again.':'Not quite. '+R.why];fx.pop({icon:'globe',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function pgNextRound(){const S=G.st;S.r++;S.okNow=false;S.wrong=[];S.msg=null;
  if(S.r>=G.L.rounds.length){ngRender();G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}ngRender();}
NGTHUMB.pangaea=()=>{
  let t=`<rect width="320" height="180" fill="url(#pgwt)" opacity=".2"/><defs><pattern id="pgwt" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10q10-6 20 0t20 0" stroke="#fff" fill="none"/></pattern></defs>`;
  [[40,30,90,60,'#e8a23a'],[140,20,140,50,'#c97a4a'],[30,100,70,64,'#5fb85a'],[110,76,80,74,'#d9b44a'],[200,84,60,40,'#e07a6a'],[110,154,110,22,'#e9f0f5'],[236,130,56,38,'#e0904a']].forEach(([x,y,w,hh,c])=>{t+=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${Math.min(w,hh)/3}" fill="${c}" stroke="#5a4632" stroke-width="2"/>`;});
  t+=`<g><circle cx="105" cy="118" r="12" fill="#17a2a2" stroke="#fff" stroke-width="2"/><text x="105" y="123" text-anchor="middle" font-size="12" font-weight="900" fill="#fff" font-family="system-ui,Arial">M</text></g><g><circle cx="186" cy="120" r="12" fill="#e07a2a" stroke="#fff" stroke-width="2"/><text x="186" y="125" text-anchor="middle" font-size="12" font-weight="900" fill="#fff" font-family="system-ui,Arial">L</text></g>`+ngStar(300,22,8);
  return ngWrap('pangaea','#1f6fae',t);
};
