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
/* ---------------- real continent outlines (100 x 100 box) ---------------- */
const PG_SHAPE={
  sa:'M38 2C52 0 70 6 80 16C92 24 99 34 93 44C87 54 75 58 69 70C63 82 56 92 48 99C43 92 46 82 41 72C35 60 25 50 21 38C17 27 24 11 38 2Z',
  af:'M30 3C46 0 63 2 73 9C80 17 92 23 98 33C94 44 85 50 80 60C76 72 68 86 58 97C51 99 48 90 46 80C44 68 36 60 30 53C20 51 8 45 3 34C1 22 13 9 30 3Z',
  in:'M6 3C30 0 62 2 94 6C88 26 75 46 61 70C55 82 51 92 46 99C40 86 34 70 24 54C14 38 3 22 6 3Z',
  an:'M5 52C9 30 29 14 51 9C64 7 72 2 78 6C82 12 88 18 94 34C100 54 90 76 68 88C46 97 22 92 10 78C3 70 3 60 5 52Z',
  au:'M9 30C19 14 39 8 51 14C57 6 66 3 70 14C84 20 97 36 96 56C94 75 82 90 62 92C50 90 40 84 28 86C16 86 5 74 3 58C2 46 4 38 9 30Z',
  na:'M9 19C23 5 50 1 70 5C84 9 97 17 93 30C88 40 78 44 72 52C66 62 60 72 52 80C46 86 42 94 38 99C34 90 28 82 24 72C18 60 8 52 3 40C1 32 3 25 9 19Z',
  eu:'M3 50C5 30 19 16 39 12C59 7 80 4 97 15C100 30 94 46 84 56C74 64 62 62 54 70C46 78 38 85 28 82C18 78 10 70 5 62Z',
  gr:'M30 3C50 0 74 6 86 20C93 36 84 56 70 72C60 84 50 94 42 97C36 84 30 70 22 56C14 40 14 18 30 3Z'};
const pgInitRot=(G,t,i)=>G.i===0||ngT()?0:[90,0,270,180,0,90,180][(i+G.i)%7];
function pgDefs(p){return `<defs><radialGradient id="${p}sea" cx=".45" cy=".4" r=".85"><stop offset="0" stop-color="#2f86c6"/><stop offset="1" stop-color="#0d3b6e"/></radialGradient>
<pattern id="${p}wv" width="44" height="22" patternUnits="userSpaceOnUse"><path d="M0 11q11-7 22 0t22 0" stroke="#bfe3ff" stroke-width="1.2" fill="none" opacity=".35"/></pattern>
<pattern id="${p}tx" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#000" opacity=".12"/><circle cx="6.5" cy="6" r=".8" fill="#fff" opacity=".18"/></pattern>
<linearGradient id="${p}hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>`;}
/* continent art centred on 0,0, scaled to w x h */
function pgLand(id,w,hh,p,extra){p=p||'pg';const c=PGC[id][1],sx=w/100,sy=hh/100,tr=`scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-50 -50)`;
  return `<g transform="${tr}"><path d="${PG_SHAPE[id]}" fill="#05203d" opacity=".35" transform="translate(1.6 2.4)"/><path d="${PG_SHAPE[id]}" fill="${c}"/><path d="${PG_SHAPE[id]}" fill="url(#${p}tx)"/><path d="${PG_SHAPE[id]}" fill="url(#${p}hl)"/><path d="${PG_SHAPE[id]}" fill="none" stroke="${Art.shade(c,-.45)}" stroke-width="${(2.2/Math.min(sx,sy)).toFixed(2)}" stroke-linejoin="round"/>${extra||''}</g>`;}
const pgSlots=L=>{const sl={};L.slots.forEach(([id,x,y,w,hh])=>{sl[id]={id,x,y,w,h:hh,cx:x+w/2,cy:y+hh/2};});return sl;};
const pgTile=(L,id)=>L.tiles.find(t=>t.id===id);
/* evidence state of each border mark: 'ok' both sides have it, '' not decided yet */
function pgMarks(G){const L=G.L,S=G.st,out={};
  L.borders.forEach(([a,b,ev],bi)=>ev.forEach(e=>{const ta=S.place[a],tb=S.place[b],ra=!S.rot[a],rb=!S.rot[b];
    out[bi+e]=ta&&tb&&ra&&rb&&pgTile(L,ta).ev.includes(e)&&pgTile(L,tb).ev.includes(e)?'ok':'';}));return out;}
function pgFitBoard(G){
  const L=G.L,S=G.st,W=460,H=300,sl=pgSlots(L),mk=pgMarks(G),bad=new Set(S.bad||[]),badEv=S.badEv||{};
  let t=pgDefs('pg')+`<rect width="${W}" height="${H}" fill="url(#pgsea)"/><rect width="${W}" height="${H}" fill="url(#pgwv)" class="pgwaves"/>`;
  for(let x=46;x<W;x+=46)t+=`<path d="M${x} 0V${H}" stroke="#bfe3ff" stroke-width=".6" opacity=".18"/>`;for(let y=50;y<H;y+=50)t+=`<path d="M0 ${y}H${W}" stroke="#bfe3ff" stroke-width=".6" opacity=".18"/>`;
  t+=`<text x="8" y="${H-8}" font-size="10" font-weight="800" fill="#cfe8ff" opacity=".85">About 250 million years ago</text>`;
  /* empty spots under everything */
  L.slots.forEach(([id,x,y,w,hh])=>{if(S.place[id])return;t+=`<g class="pgslot" data-s="${id}" aria-label="Empty spot ${id}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${Math.min(w,hh)/3}" fill="#ffffff" fill-opacity=".14" stroke="#fff" stroke-width="2.4" stroke-dasharray="7 6"/><text x="${x+w/2}" y="${y+hh/2+5}" text-anchor="middle" font-size="13" font-weight="900" fill="#fff" opacity=".85">?</text></g>`;});
  /* evidence links */
  L.borders.forEach(([a,b,ev])=>{const A=sl[a],B=sl[b];const all=ev.every((e,i)=>mk[L.borders.findIndex(x=>x[0]===a&&x[1]===b)+e]==='ok');
    t+=`<line x1="${A.cx}" y1="${A.cy}" x2="${B.cx}" y2="${B.cy}" class="pglink${all?' ok':''}" stroke-width="${all?3:2}" stroke-dasharray="${all?'0':'3 4'}" pointer-events="none"/>`;});
  /* placed continents */
  L.slots.forEach(([id,x,y,w,hh])=>{const tid=S.place[id];if(!tid)return;const s=sl[id],rot=S.rot[id]||0,T=pgTile(L,tid);
    let marks='';L.borders.forEach(([a,b,ev])=>{if(a!==id&&b!==id)return;const o=sl[a===id?b:a],dx=(o.cx-s.cx),dy=(o.cy-s.cy),d=Math.hypot(dx,dy)||1,k=Math.min(.42,(Math.min(w,hh)*.36)/d);
      ev.forEach((e,i)=>{const px=dx*k+(i-(ev.length-1)/2)*15*(-dy/d),py=dy*k+(i-(ev.length-1)/2)*15*(dx/d),has=T.ev.includes(e);
        if(has)marks+=`<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)})"><circle r="7.5" fill="${PG_EV[e][1]}" stroke="#fff" stroke-width="1.5"/><text y="3" text-anchor="middle" font-size="${e.length>1?6.5:8}" font-weight="900" fill="#fff">${e}</text></g>`;
        else if(S.bad&&bad.has(id))marks+=`<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)})"><circle r="7.5" fill="#fff" stroke="#e2483f" stroke-width="2" stroke-dasharray="3 2"/><text y="3" text-anchor="middle" font-size="8" font-weight="900" fill="#e2483f">?</text></g>`;});});
    t+=`<g class="pgslot pgplaced${bad.has(id)?' bad':''}" data-s="${id}" tabindex="0" role="button" aria-label="${PGC[tid][0]} in spot ${id}${rot?`, turned ${rot} degrees`:''}. Press Enter to turn it, Delete to send it back."><g class="pgland" style="transform:translate(${s.cx}px,${s.cy}px) rotate(${rot}deg)">${pgLand(tid,w,hh,'pg')}${marks}<text y="4" text-anchor="middle" font-size="11.5" font-weight="900" fill="#1b2433" stroke="#fff" stroke-width="3" paint-order="stroke">${ngEsc(PGC[tid][0])}</text></g></g>`;
    if(!S.ok&&!G.done&&S.focus===id)t+=`<g class="pgknob" data-rot="${id}" role="button" aria-label="Turn ${PGC[tid][0]}" transform="translate(${x+w-6} ${y+6})"><circle r="10" fill="#fff" stroke="#13203d" stroke-width="1.5"/><path d="M-4.5 2.5a5 5 0 1 0 1-6.5" stroke="#13203d" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-5 -7l1.6 3.6 3.6-1.4" fill="#13203d"/></g><g class="pgknob back" data-back="${id}" role="button" aria-label="Send ${PGC[tid][0]} back to the tray" transform="translate(${x+6} ${y+6})"><circle r="9" fill="#fff" stroke="#13203d" stroke-width="1.5"/><path d="M-3.5-3.5l7 7M3.5-3.5l-7 7" stroke="#13203d" stroke-width="2" stroke-linecap="round"/></g>`;});
  /* border badges on top */
  L.borders.forEach(([a,b,ev],bi)=>{const A=sl[a],B=sl[b],mx=(A.cx+B.cx)/2,my=(A.cy+B.cy)/2;
    ev.forEach((e,i)=>{const x=mx+(i-(ev.length-1)/2)*26,st=mk[bi+e],no=badEv[bi+e];
      t+=`<g class="pgbadge${st?' ok':''}${no?' no':''}" pointer-events="none">${st||no?`<circle cx="${x}" cy="${my}" r="16" fill="none" stroke="${no?'#ff5a4f':'#7dffb2'}" stroke-width="3"/>`:''}<circle cx="${x}" cy="${my}" r="12" fill="${PG_EV[e][1]}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${my+4.5}" text-anchor="middle" font-size="${e.length>1?10:12}" font-weight="900" fill="#fff">${e}</text></g>`;});});
  return ngSvg(W,H,t,'ngsvg pgsvg','Map of Pangaea. Drag continents onto the spots. Badges on the dashed lines show the evidence found on both sides of each border.');
}

/* ---------------- plate boundary cross-sections, animated by p (0 to 1) ---------------- */
function pgBound(R,p,ph){
  const W=460,H=230,mv=R.mv,a=R.ans,E=Art.ease.inOutQuad(p);
  let t=`<defs><linearGradient id="pbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#e9f6ff"/></linearGradient><linearGradient id="pbm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a3c"/><stop offset="1" stop-color="#b8321a"/></linearGradient>
<pattern id="pbrock" width="10" height="8" patternUnits="userSpaceOnUse"><path d="M0 4h10" stroke="#000" stroke-opacity=".12"/><circle cx="3" cy="2" r=".9" fill="#fff" opacity=".25"/></pattern></defs>`;
  if(mv==='slide'){const off=E*40;
    t+=`<rect width="${W}" height="${H}" fill="#d9c79e"/><g transform="translate(${-off} 0)"><rect x="-60" y="0" width="${W+120}" height="113" fill="#c9a46a"/><rect x="-60" y="0" width="${W+120}" height="113" fill="url(#pbrock)"/><path d="M-60 56H${W+60}" stroke="#555" stroke-width="10"/><path d="M-60 56H${W+60}" stroke="#ffd23f" stroke-width="1.6" stroke-dasharray="10 8"/>${[60,170,280,390].map(x=>`<circle cx="${x}" cy="28" r="9" fill="#4f9a3a"/><circle cx="${x+30}" cy="88" r="7" fill="#5aa845"/>`).join('')}</g>`+
      `<g transform="translate(${off} 0)"><rect x="-60" y="117" width="${W+120}" height="113" fill="#b8925a"/><rect x="-60" y="117" width="${W+120}" height="113" fill="url(#pbrock)"/><path d="M-60 174H${W+60}" stroke="#555" stroke-width="10"/>${[30,140,250,360].map(x=>`<circle cx="${x}" cy="150" r="8" fill="#4f9a3a"/><circle cx="${x+40}" cy="200" r="9" fill="#5aa845"/>`).join('')}<path d="M230 117V230" stroke="#fff" stroke-width="5"/></g>`+
      `<path d="M230 0V113" stroke="#fff" stroke-width="5" transform="translate(${-off} 0)"/><line x1="0" y1="115" x2="${W}" y2="115" stroke="#5a2f12" stroke-width="4"/>`+
      `<path d="M150 60h-70m0 0l14-10m-14 10l14 10" stroke="#13203d" stroke-width="5" fill="none" stroke-linecap="round" opacity="${1-E*.6}"/><path d="M310 172h70m0 0l-14-10m14 10l-14 10" stroke="#13203d" stroke-width="5" fill="none" stroke-linecap="round" opacity="${1-E*.6}"/><text x="230" y="16" text-anchor="middle" font-size="12" font-weight="800" fill="#13203d">Top view: a white fence crosses the boundary</text>`;
    if(p>=1)t+=`<g class="pbquake">${[80,190,300,390].map(x=>`<path d="M${x} 103l6 6-6 6 6 6" stroke="#d64545" stroke-width="3" fill="none"/>`).join('')}</g><rect x="140" y="124" width="180" height="22" rx="11" fill="#13203d" opacity=".85"/><text x="230" y="139" text-anchor="middle" font-size="12" font-weight="900" fill="#ffd2cc">Earthquakes along the fault!</text>`;
    return ngSvg(W,H,t,'ngsvg pgsvg pbsvg','Two plates sliding past each other, seen from above');}
  /* side view */
  const sea=74,top=R.a==='cont'&&R.b==='cont'?null:sea;
  t+=`<rect width="${W}" height="${H}" fill="url(#pbsky)"/>`;
  if(top!=null)t+=`<rect y="${sea}" width="${W}" height="${H-sea}" fill="#3d8fd0" opacity=".75"/>`;
  t+=`<rect y="160" width="${W}" height="${H-160}" fill="url(#pbm)"/>`;
  /* mantle flow arrows */
  const flow=mv==='apart'?[[150,-1],[310,1]]:[[90,1],[370,-1]];
  flow.forEach(([x,d])=>{t+=`<path d="M${x} 214q${d*30} 0 ${d*50} -14" stroke="#ffd6a6" stroke-width="3" fill="none" stroke-dasharray="6 5" class="pbflow"/>`;});
  t+=`<text x="8" y="${H-8}" font-size="11" font-weight="800" fill="#ffe7cf">Hot mantle</text>`;
  const plate=(x0,x1,k,dy,sink)=>{const y0=k==='ocean'?110:66,hh=k==='ocean'?24:78,col=k==='ocean'?'#3a4f6e':'#b99060',tp=k==='ocean'?'#5c7397':'#8bbf5a';
    if(!sink)return `<g transform="translate(0 ${dy||0})"><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${hh}" fill="${col}"/><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${hh}" fill="url(#pbrock)"/><rect x="${x0}" y="${y0}" width="${x1-x0}" height="4" fill="${tp}"/></g>`;
    /* plate x0..x1 bending down from bendX */
    return `<path d="M${x0} ${y0}H${sink.x}Q${sink.x+40} ${y0} ${sink.x+40+sink.dx} ${y0+sink.dy}L${sink.x+40+sink.dx-10} ${y0+sink.dy+hh}Q${sink.x+28} ${y0+hh} ${sink.x} ${y0+hh}H${x0}Z" fill="${col}"/><path d="M${x0} ${y0}H${sink.x}Q${sink.x+40} ${y0} ${sink.x+40+sink.dx} ${y0+sink.dy}L${sink.x+40+sink.dx-10} ${y0+sink.dy+hh}Q${sink.x+28} ${y0+hh} ${sink.x} ${y0+hh}H${x0}Z" fill="url(#pbrock)"/>`;};
  const lab=(x,k)=>`<text x="${x}" y="${k==='ocean'?126:110}" text-anchor="middle" font-size="12" font-weight="800" fill="${k==='ocean'?'#fff':'#3a2a10'}">${k==='ocean'?'Ocean plate':'Continent'}</text>`;
  const arrows=(op)=>{const arr=(x,dir)=>`<path d="M${x} 40h${dir*56}m0 0l${-dir*12}-9m${dir*12} 9l${-dir*12} 9" stroke="#13203d" stroke-width="5" fill="none" stroke-linecap="round" opacity="${op}"/>`;return mv==='apart'?arr(170,-1)+arr(290,1):arr(80,1)+arr(380,-1);};
  if(mv==='apart'){const g=E*34;
    if(a==='ridge'){t+=plate(-20,226-g,'ocean')+plate(234+g,W+20,'ocean');
      t+=`<path d="M${226-g} 160C${226-g} 130 ${214} ${110-E*10} 230 ${110-E*34}C246 ${110-E*10} ${234+g} 130 ${234+g} 160Z" fill="url(#pbm)"/>`;
      for(let i=1;i<=3;i++)if(E*3>=i)t+=`<rect x="${230-i*11-3}" y="110" width="6" height="24" fill="#ff8a3c" opacity="${.9-i*.2}"/><rect x="${230+i*11-3}" y="110" width="6" height="24" fill="#ff8a3c" opacity="${.9-i*.2}"/>`;
      t+=`<path d="M${230-50*E} ${110}Q230 ${110-E*40} ${230+50*E} 110Z" fill="#43607f"/>`;}
    else{t+=plate(-20,226-g,'cont')+plate(234+g,W+20,'cont')+`<g transform="translate(0 ${E*30})"><path d="M${206} 66H254L${254+g*.2} 144H${206-g*.2}Z" fill="#a67c4c"/><rect x="206" y="66" width="48" height="4" fill="#8bbf5a"/></g>`;
      t+=`<path d="M${226-g} 160Q230 ${150-E*10} ${234+g} 160Z" fill="url(#pbm)"/>`;if(p>.7)t+=`<rect x="208" y="${92}" width="44" height="${(p-.7)*20}" fill="#4fa3e0" opacity=".85"/>`;}
    t+=lab(100,R.a)+lab(360,R.b);}
  else{const g=E*24;
    if(a==='mtn'){t+=plate(-20,226+g,'cont')+plate(234-g,W+20,'cont');const hgt=E*62;
      t+=`<path d="M${170} 66L${196} ${66-hgt*.6} ${212} ${66-hgt*.4} ${230} ${66-hgt} ${248} ${66-hgt*.5} ${266} ${66-hgt*.7} 290 66Z" fill="#8a6a40" stroke="#5a4020" stroke-width="2"/>`;
      if(p>.8)t+=`<path d="M${224} ${66-hgt+10}l6-10 6 10z" fill="#fff"/><path d="M${190} ${66-hgt*.6+6}l6-6 5 6z" fill="#fff"/>`;
      t+=lab(90,R.a)+lab(370,R.b);}
    else{/* subduction: left ocean plate sinks under right plate */
      const k2=R.b;t+=plate(234-g*.3,W+20,k2);
      t+=plate(-20,0,'ocean',0,{x:200+g,dx:E*30,dy:20+E*50});
      t+=`<path d="M${224+g} 110L${232+g} ${118+E*22}L${242+g} 110Z" fill="#0f2a46"/>`;
      const vx=a==='arc'?330:316,vb=a==='arc'?110:66,vh=E*(a==='arc'?58:46);
      t+=`<path d="M${vx-30} ${vb}L${vx-6} ${vb-vh}H${vx+6}L${vx+30} ${vb}Z" fill="#7a4a2a" stroke="#4a2a12" stroke-width="2"/>`;
      if(p>.5)t+=`<path d="M${270+g} ${150}Q${vx-10} 130 ${vx} ${vb-vh+4}" stroke="#ff6a2a" stroke-width="5" fill="none" stroke-dasharray="7 5" class="pbflow"/>`;
      if(p>=1)t+=`<path d="M${vx-4} ${vb-vh}l-6-14M${vx+4} ${vb-vh}l6-14M${vx} ${vb-vh}v-16" stroke="#ff6a2a" stroke-width="3" stroke-linecap="round"/><circle cx="${vx}" cy="${vb-vh-22}" r="8" fill="#9a9aa6" opacity=".7"/>`;
      t+=lab(100,'ocean')+lab(380,k2);}}
  t+=arrows(ph==='done'?.35:1);
  if(p>=1)t+=`<rect x="120" y="${H-38}" width="220" height="24" rx="12" fill="#13203d" opacity=".88"/><text x="230" y="${H-21}" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">${PG_FEAT.find(f=>f[0]===a)[1]}</text>`;
  if(ph==='move')t+=`<g class="pbgrip"><rect x="${mv==='apart'?300:380}" y="58" width="64" height="30" rx="15" fill="#ffd23f" stroke="#13203d" stroke-width="2"/><text x="${mv==='apart'?332:412}" y="78" text-anchor="middle" font-size="12" font-weight="900" fill="#13203d">${mv==='apart'?'drag ▶':'◀ drag'}</text></g>`;
  return ngSvg(W,H,t,'ngsvg pgsvg pbsvg','A cross-section of two plates at a boundary');
}
/* small pictures for the evidence questions */
function pgPic(R){
  const W=460,H=230,k=R.ans;let t=`<defs><linearGradient id="ppk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9ff"/><stop offset="1" stop-color="#f4faff"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#ppk)"/>`;
  if(k==='moved')t+=`<path d="M0 150Q120 120 230 140T460 136V230H0Z" fill="#eef6fb"/><path d="M0 170Q140 150 260 168T460 160V230H0Z" fill="#dfeaf2"/><rect x="120" y="150" width="220" height="56" rx="8" fill="#5a4a3a"/><rect x="120" y="164" width="220" height="12" fill="#1f1f24"/><text x="230" y="174" text-anchor="middle" font-size="10" font-weight="900" fill="#fff">COAL LAYER</text><g transform="translate(200 196)" stroke="#e8d9b0" stroke-width="2" fill="none"><path d="M0 0q30-14 60-8"/>${[0,12,24,36,48].map(x=>`<path d="M${x} ${-x*.15}l-5-9M${x} ${-x*.15}l7-8"/>`).join('')}</g><text x="230" y="40" text-anchor="middle" font-size="15" font-weight="900" fill="#13203d">Antarctica today: ice, coal and fern fossils</text><circle cx="400" cy="60" r="16" fill="#fff8c8" opacity=".9"/>`;
  else if(k==='pole')t+=`<rect y="120" width="${W}" height="110" fill="#c9a46a"/>${[0,1,2,3,4,5].map(i=>`<path d="M${60+i*55} 140l40 70" stroke="#5a4020" stroke-width="3" stroke-linecap="round"/>`).join('')}<path d="M0 60Q230 20 460 60V120H0Z" fill="#eaf6ff" stroke="#9fd0f0" stroke-width="3"/><text x="230" y="90" text-anchor="middle" font-size="14" font-weight="900" fill="#2a5a8a">Ancient ice sheet (moving ➜)</text><text x="230" y="30" text-anchor="middle" font-size="15" font-weight="900" fill="#13203d">Glacier scratches in rock in India and Africa</text>`;
  else if(k==='fresh')t+=`<rect y="120" width="${W}" height="110" fill="#2b6cb0"/><path d="M0 120h120v110H0z" fill="#5fb85a"/><path d="M340 120h120v110H340z" fill="#d9b44a"/><text x="60" y="150" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">S. America</text><text x="400" y="150" text-anchor="middle" font-size="12" font-weight="900" fill="#3a2a10">Africa</text><g transform="translate(230 170)"><path d="M-40 0q20-12 50-6t34 2q-8 6-20 6t-30 4q-20 2-34-6z" fill="#17a2a2"/><circle cx="34" cy="-4" r="2" fill="#fff"/></g><text x="230" y="210" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">Mesosaurus: 1 meter long, fresh water only</text><text x="230" y="40" text-anchor="middle" font-size="15" font-weight="900" fill="#13203d">The same fossils on both sides of an ocean</text>`;
  else if(k==='A')t+=`<rect y="70" width="${W}" height="60" fill="#3d8fd0" opacity=".7"/>${[0,1,2,3,4,5].map(i=>`<rect x="${230+i*36}" y="130" width="36" height="40" fill="${['#ff8a3c','#e8915a','#c9906e','#a98a7e','#8a7f86','#6f7488'][i]}"/><rect x="${194-i*36}" y="130" width="36" height="40" fill="${['#ff8a3c','#e8915a','#c9906e','#a98a7e','#8a7f86','#6f7488'][i]}"/>`).join('')}<path d="M200 130L230 100L260 130Z" fill="#43607f"/>${[['A',240],['B',320],['C',410]].map(([l,x])=>`<g transform="translate(${x} 150)"><circle r="13" fill="#fff" stroke="#13203d" stroke-width="2"/><text y="5" text-anchor="middle" font-size="13" font-weight="900" fill="#13203d">${l}</text></g>`).join('')}<rect y="170" width="${W}" height="60" fill="#e07a3a"/><text x="230" y="40" text-anchor="middle" font-size="15" font-weight="900" fill="#13203d">Rock samples near a mid-ocean ridge</text>`;
  else if(k==='wider')t+=`<rect y="0" width="${W}" height="${H}" fill="#2b6cb0"/><path d="M0 20h110q20 60 0 120t20 90H0z" fill="#e8a23a"/><path d="M460 20H340q-30 60 0 110t-10 100H460z" fill="#d9b44a"/><path d="M228 10q-14 50 6 100t-10 110" stroke="#ffd2a6" stroke-width="5" fill="none"/><path d="M200 120h-50m0 0l10-8m-10 8l10 8M260 120h50m0 0l-10-8m10 8l-10 8" stroke="#fff" stroke-width="4" fill="none"/><text x="230" y="30" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">Mid-Atlantic Ridge</text>`;
  else t+=`<rect width="${W}" height="${H}" fill="#2b6cb0"/><path d="M30 40h120l-20 80-60 40H40z" fill="#c9a46a"/><path d="M300 30h140v90l-60 30-80-30z" fill="#c9a46a"/><path d="M180 150l60-10 30 60-80 10z" fill="#c9a46a"/>${Array.from({length:22},(_,i)=>{const a=i/22*Math.PI*1.5+.6;return `<circle cx="${(240+Math.cos(a)*150).toFixed(0)}" cy="${(110+Math.sin(a)*80).toFixed(0)}" r="5" fill="#ff5a3c" stroke="#fff" stroke-width="1.5"/>`;}).join('')}<text x="230" y="${H-14}" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">Red dots: earthquakes and volcanoes</text>`;
  return ngSvg(W,H,t,'ngsvg pgsvg pbsvg','A picture of the evidence');
}

/* ---------------- game ---------------- */
let PG_DRAG=null,pgLastDrop=0;
const pgList=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
function pgDragInit(){if(PG_DRAG)PG_DRAG.destroy();
  PG_DRAG=Art.drag({root:$('ngGrid'),items:'.pgtile',targets:'.pgslot',
    accept:()=>!!(G&&G.key==='pangaea'&&G.L.type==='fit'&&!G.st.ok&&!G.done),label:it=>it.getAttribute('aria-label')||'continent',
    onDrop:(it,t)=>pgPlace(it.dataset.t,t.dataset.s)});}
function pgPlace(tid,sid){const L=G.L,S=G.st;if(S.ok||G.done)return;pgLastDrop=Date.now();
  Object.keys(S.place).forEach(k=>{if(S.place[k]===tid){delete S.place[k];delete S.rot[k];}});
  S.focus=sid;S.place[sid]=tid;S.rot[sid]=pgInitRot(G,tid,L.tiles.findIndex(t=>t.id===tid));S.bad=null;S.badEv=null;S.msg=null;S.sel=null;ngRender();
  const g=$('ngMain').querySelector(`.pgplaced[data-s="${sid}"]`);if(g)Art.pop(g.querySelector('.pgland'),1.08);
  const ok=$('ngMain').querySelectorAll('.pgbadge.ok');if(ok.length)ok.forEach(b=>Art.burstAt(b,{n:6,colors:['#7dffb2','#fff'],speed:120}));
  if(!ngT())ngSay(S.rot[sid]?`${PGC[tid][0]} landed turned. **Tap it** (or its ⟳ knob) to turn it so its evidence faces the right borders.`:`${PGC[tid][0]} placed. Green rings mean the evidence matches on both sides of that border.`);}
function pgTurn(sid){const S=G.st;if(S.ok||G.done||!S.place[sid]||Date.now()-pgLastDrop<450)return;S.focus=sid;const was=S.rot[sid]||0;S.rot[sid]=(was+90)%360;S.bad=null;S.badEv=null;S.msg=null;ngRender();
  const g=$('ngMain').querySelector(`.pgplaced[data-s="${sid}"] .pgland`);if(g&&!Art.reduced()){const fin=g.style.transform;g.style.transition='none';g.style.transform=fin.replace(/rotate\([^)]*\)/,`rotate(${was}deg)`);void g.getBoundingClientRect();g.style.transition='';g.style.transform=fin.replace(/rotate\(0deg\)/,'rotate(360deg)');}
  if(!S.rot[sid]){const ok=$('ngMain').querySelectorAll('.pgbadge.ok');ok.forEach(b=>Art.burstAt(b,{n:6,colors:['#7dffb2','#fff'],speed:120}));}}
function pgBack(sid){const S=G.st;if(S.ok||G.done)return;delete S.place[sid];delete S.rot[sid];S.bad=null;S.badEv=null;S.msg=null;ngRender();}
function pgTapSlot(id){pgTurn(id);}
ngDef({key:'pangaea',name:'Pangaea Rebuild',ic:'puzzle',std:'MS-ESS2-3',subj:'earth',cap3:true,
  short:'Rebuild Pangaea from fossil and rock evidence.',menuDesc:'Drag and turn real continents until the fossil and rock evidence lines up. Then push plates together and watch trenches, volcanoes and mountains form.',
  intro:'The continents were once joined in a supercontinent called Pangaea. Use the same evidence scientists used (fossils, glacier scratches and matching rocks) to put it back together. Then predict what forms where plates meet, and move the plates to find out.',
  how:['**Drag a continent** from the tray onto a spot (or tap it, then tap a spot). **Tap it** on the map to turn it.','Every border shows evidence found on **both** sides. A continent must have all of it, facing the right way.','Press **Check my map**. Right on the first check earns 3 ★.'],
  levels:PG_LEVELS,packs:PG_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="#1f6fae"/>${L.type==='fit'?L.slots.map(s=>`<rect x="${s[1]/460*44}" y="${s[2]/300*30}" width="${s[3]/460*44}" height="${s[4]/300*30}" rx="2" fill="#d9b44a"/>`).join(''):'<rect x="2" y="12" width="19" height="9" fill="#c9a46a"/><rect x="23" y="14" width="19" height="7" fill="#2b4a6a"/><path d="M14 7h-6M30 7h6" stroke="#fff" stroke-width="2"/>'}</svg>`),
  start(G){G.st={place:{},rot:{},sel:null,bad:null,badEv:null,msg:null,r:0,pick:null,wrong:[],okNow:false,ok:false,ph:'predict',p:0};pgDragInit();},
  hud(G){return G.L.type==='fit'?{label:'Checks',val:G.tries,target:'3 ★ = right on the first check'}:{label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st;
    if(L.type==='fit'){
      const b=pgFitBoard(G);
      b.addEventListener('click',e=>{const k=e.target.closest('[data-rot]'),bk=e.target.closest('[data-back]'),pl=e.target.closest('.pgplaced');
        if(bk)return pgBack(bk.dataset.back);if(k)return pgTurn(k.dataset.rot);if(pl&&!document.querySelector('.art-picked'))pgTurn(pl.dataset.s);});
      b.addEventListener('focusin',e=>{const pl=e.target.closest&&e.target.closest('.pgplaced');if(pl&&S.focus!==pl.dataset.s){S.focus=pl.dataset.s;}});
      b.addEventListener('keydown',e=>{const pl=e.target.closest('.pgplaced');if(!pl)return;if(e.key==='Enter'||e.key===' '||e.key==='r'||e.key==='R'){e.preventDefault();pgTurn(pl.dataset.s);}else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();pgBack(pl.dataset.s);}});
      const used=new Set(Object.values(S.place)),ev=[...new Set(L.tiles.flatMap(t=>t.ev).concat(L.borders.flatMap(x=>x[2])))];
      ngRC(main,h('div',{class:'pgwrap'},b),h('div',{class:'pglegend'},...ev.map(e=>h('span',{title:PG_EV[e][2]},h('i',{style:`background:${PG_EV[e][1]}`},e),PG_EV[e][0]))));
      const tray=L.tiles.filter(t=>!used.has(t.id)).map(t=>h('button',{type:'button',class:'pgtile','data-t':t.id,disabled:S.ok||G.done,'aria-label':`${PGC[t.id][0]}. Evidence: ${t.ev.map(e=>PG_EV[e][0]).join(', ')}. Drag it onto a spot.`},
        h('b',null,svgEl(`<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">${pgDefs('pgi')}<g transform="translate(20 20)">${pgLand(t.id,34,34,'pgi')}</g></svg>`),PGC[t.id][0]),h('span',{class:'pgev'},...t.ev.map(e=>h('i',{style:`background:${PG_EV[e][1]}`,title:PG_EV[e][0]},e)))));
      const full=L.slots.every(s=>S.place[s[0]]);
      ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Continents tray',h('small',null,'drag one onto a spot')),
        h('div',{class:'pgtray'},...(tray.length?tray:[h('p',{class:'sub'},'All continents are on the map.')])),
        h('div',{class:'pgnotes'},h('b',null,'Tip: '),'tap a continent on the map to turn it. ✕ sends it back. Green rings = the evidence matches across that border.'),
        S.msg?h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])):null,
        S.ok?null:ngBtn('Check my map',pgCheck,'good',{style:'width:100%;font-size:17px',disabled:!full||G.done}));
      if(!S.msg&&!S.ok&&!Object.keys(S.place).length)ngSay('Drag a continent from the tray onto a spot on the map.');
      return;
    }
    const R=L.rounds[S.r],T=ngT();
    let board;
    if(!R)board=h('div');
    else if(R.t==='bd'){board=pgBound(R,S.p,S.ph);
      if(S.ph==='move'&&!T){const grip=board.querySelector('.pbgrip');let x0=null;
        const go=()=>pgMovePlates();
        if(grip){grip.addEventListener('pointerdown',e=>{x0=e.clientX;grip.setPointerCapture(e.pointerId);});
          grip.addEventListener('pointermove',e=>{if(x0!=null&&Math.abs(e.clientX-x0)>24){x0=null;go();}});grip.addEventListener('pointerup',()=>{if(x0!=null){x0=null;go();}});}}}
    else board=pgPic(R);
    ngRC(main,h('div',{class:'pgwrap'},board));
    const prog=h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
    const opts=!R?[]:R.t==='bd'?PG_FEAT:R.opts;
    const pickable=R&&!G.done&&!S.okNow&&(R.t!=='bd'||S.ph==='predict');
    const btns=opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':'')+(R.t==='bd'&&S.pick===v&&!T?' on':''),disabled:!pickable||S.wrong.includes(v),
      onclick:()=>{if(R.t==='bd'&&!T){S.pick=v;S.msg=null;ngRender();}else pgAnswer(v);}},t));
    const box=!R?[]:[h('p',{class:'ppq'},R.t==='bd'?'What will form at this boundary? Predict first.':R.q),h('div',{class:'ppmc'},...btns)];
    if(R&&R.t==='bd'&&!T&&!S.okNow){
      if(S.ph==='predict')box.push(ngBtn('Lock in my prediction',()=>{S.ph='move';S.msg=null;ngRender();ngSay(`Now **drag the plates** ${R.mv==='apart'?'apart':R.mv==='slide'?'past each other':'together'} (or press the button) and watch what forms.`);},'good',{style:'width:100%;margin-top:6px',disabled:!S.pick}));
      else if(S.ph==='move')box.push(ngBtn([I('play'),R.mv==='apart'?' Pull the plates apart':R.mv==='slide'?' Slide the plates':' Push the plates together'],pgMovePlates,'good',{style:'width:100%;margin-top:6px'}));}
    ngRC(side,prog,...box,S.msg?h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])):null,
      S.okNow&&S.r<L.rounds.length?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',pgNextRound,'good',{style:'width:100%;margin-top:6px'}):null);
    if(!S.msg&&R&&S.ph!=='move'&&S.ph!=='anim')ngSay(R.t==='bd'?'Read the arrows and the kinds of crust. Then predict.':'Use the evidence to explain.');
  },
  hints(G){const L=G.L;if(L.type==='fit'){const a=pgSolve(L);return [L.clue,'Read each border badge. A continent can only touch a border if it has that evidence too. The spot with the most borders is usually the easiest to fill first. Turn each continent until its badges face the borders.',
      'Answer: '+L.slots.map(s=>`${s[0]} = ${PGC[a[s[0]]][0]}`).join(', ')+'.'];}
    const R=L.rounds[G.st.r]||L.rounds[0];return [L.clue,'Apart: new crust forms (ridges and rifts). Together: crust sinks or crumples (trenches, volcanoes, mountains). Sliding: earthquakes along a fault.',
      R.t==='bd'?'Answer: '+PG_FEAT.find(f=>f[0]===R.ans)[1]+'.':'Answer: '+R.opts.find(o=>o[0]===R.ans)[1]];}
});
function pgSolve(L){const ids=L.slots.map(s=>s[0]),need={};ids.forEach(id=>{need[id]=new Set();});L.borders.forEach(([a,b,ev])=>ev.forEach(e=>{need[a].add(e);need[b].add(e);}));
  const out={},used=new Set();const go=k=>{if(k===ids.length)return true;const id=ids[k];for(const t of L.tiles){if(used.has(t.id))continue;if([...need[id]].every(e=>t.ev.includes(e))){out[id]=t.id;used.add(t.id);if(go(k+1))return true;used.delete(t.id);}}return false;};go(0);return out;}
function pgCheck(){
  const L=G.L,S=G.st;if(S.ok||G.done)return;G.tries++;
  const probs=[],badEv={};L.borders.forEach(([a,b,ev],bi)=>{ev.forEach(e=>{[a,b].forEach(s=>{const t=S.place[s];if(t&&!pgTile(L,t).ev.includes(e)){probs.push([s,t,e]);badEv[bi+e]=1;}});});});
  if(ngT())return ngTDone(probs.length?0:1);
  const turned=L.slots.map(s=>s[0]).filter(s=>S.rot[s]);
  if(!probs.length&&!turned.length){S.ok=true;S.msg=['ok','✓ Every border matches the evidence. Pangaea is back together!'];ngRender();ngSay('The evidence lines up on every border!','go');G.detail={checks:G.tries};
    $('ngMain').querySelectorAll('.pgbadge').forEach((b,i)=>setTimeout(()=>Art.burstAt(b,{n:8,colors:['#7dffb2','#ffd23f','#fff'],shape:['star','dot'],speed:150}),i*60));
    ngWin(ngStars(G.tries-1,0,1),['You rebuilt the map on check ',h('b',null,G.tries),'.']);return;}
  G.miss++;
  if(probs.length){S.bad=[...new Set(probs.map(p=>p[0]))];S.badEv=badEv;const [,t,e]=probs[0];
    S.msg=['no',`**${PGC[t][0]}** has no ${PG_EV[e][0]} evidence, but a border of that spot does. ${PG_EV[e][2]}`];}
  else{S.bad=turned;S.badEv={};S.msg=['no',`The right continents, but **${pgList(turned.map(s=>PGC[S.place[s]][0]))}** ${turned.length>1?'are':'is'} turned the wrong way, so the evidence faces the wrong borders. Tap to turn.`];}
  fx.pop({icon:'puzzle',text:'Evidence does not match',kind:'oops'});ngRender();ngSay('A red continent does not match the evidence on its borders.','alert');
}
function pgMovePlates(){const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||R.t!=='bd'||S.ph!=='move'||G.done)return;S.ph='anim';
  const fin=()=>{S.p=1;S.ph='done';pgAnswer(S.pick);};
  if(Art.reduced())return fin();
  const g0=G,t0=performance.now(),dur=2600;
  const step=now=>{if(G!==g0||G.st!==S||S.ph!=='anim')return;S.p=Math.min(1,(now-t0)/dur);const m=$('ngMain').querySelector('.pgwrap');
    if(m){const nb=pgBound(R,S.p,'anim');m.replaceChildren(nb);}if(S.p<1)requestAnimationFrame(step);else{fin();const w=$('ngMain').querySelector('.pgwrap');if(w&&R.mv!=='apart')Art.shake(w);}};
  ngRender();requestAnimationFrame(step);}
function pgAnswer(v){const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||S.okNow||G.done)return;
  if(ngT())return ngTAns(v===R.ans,pgNextRound);
  if(R.t==='bd'){S.okNow=true;S.p=1;S.ph='done';
    if(v===R.ans){S.msg=['ok','✓ Just as you predicted! '+R.why];fx.pop({icon:'globe',text:'Prediction right!',kind:'good'});ngRender();ngSay('Your prediction was right!','go');}
    else{G.miss++;G.tries++;S.msg=['no',`You predicted ${PG_FEAT.find(f=>f[0]===v)[1].toLowerCase()}. What really formed: **${PG_FEAT.find(f=>f[0]===R.ans)[1]}**. ${R.why}`];fx.pop({icon:'globe',text:'Not what you predicted',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}
    return;}
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'globe',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no','Not quite. '+R.why];fx.pop({icon:'globe',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function pgNextRound(){const S=G.st;S.r++;S.okNow=false;S.wrong=[];S.msg=null;S.pick=null;S.ph='predict';S.p=0;
  if(S.r>=G.L.rounds.length){ngRender();G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}ngRender();}
NGTHUMB.pangaea=()=>{
  let t=pgDefs('tg')+`<rect width="320" height="180" fill="url(#tgsea)"/><rect width="320" height="180" fill="url(#tgwv)"/>`;
  [['na',38,26,96,70,0],['eu',134,18,150,62,0],['sa',40,96,64,74,0],['af',108,76,84,86,0],['in',190,80,48,50,20],['an',112,150,110,30,0],['au',232,124,62,42,0]].forEach(([id,x,y,w,hh,r])=>{t+=`<g transform="translate(${x+w/2} ${y+hh/2}) rotate(${r})">${pgLand(id,w,hh,'tg')}</g>`;});
  t+=`<g><circle cx="106" cy="122" r="11" fill="#17a2a2" stroke="#fff" stroke-width="2"/><text x="106" y="126" text-anchor="middle" font-size="11" font-weight="900" fill="#fff" font-family="system-ui,Arial">M</text></g><g><circle cx="188" cy="112" r="11" fill="#e07a2a" stroke="#fff" stroke-width="2"/><text x="188" y="116" text-anchor="middle" font-size="11" font-weight="900" fill="#fff" font-family="system-ui,Arial">L</text></g>`+ngStar(300,22,8);
  return ngWrap('pangaea','#1f6fae',t);
};
