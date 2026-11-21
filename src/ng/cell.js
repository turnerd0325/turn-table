/* ================= LIFE 1: CELL SHOP (MS-LS1-1, LS1-2) =================
   A job order comes in. Build a cell from organelles that can do that job, then run a day.
   Missing parts fail with a specific consequence; wrong-kind parts (a wall on an animal cell)
   fail with the reason. 3 stars = right on the first run with no extra parts. */
const CS_PARTS={
  mem:{n:'Cell membrane',c:1,f:'Thin outer layer that controls what goes in and out.',col:'#e7884a'},
  cyto:{n:'Cytoplasm',c:1,f:'Jelly-like fluid that fills the cell. Reactions happen here.',col:'#9fd6f0'},
  ribo:{n:'Ribosomes',c:1,f:'Tiny parts that build proteins.',col:'#7a5bd0'},
  nuc:{n:'Nucleus',c:2,f:'Holds the DNA and controls the cell.',col:'#8a4fd6'},
  mito:{n:'Mitochondria',c:2,f:'Release energy from food (cellular respiration).',multi:4,col:'#f08a3e'},
  chloro:{n:'Chloroplasts',c:2,f:'Capture sunlight to make sugar (photosynthesis).',multi:4,col:'#3fae5a'},
  wall:{n:'Cell wall',c:2,f:'Stiff outer layer that supports and protects.',col:'#5c9a3a'},
  vac:{n:'Large vacuole',c:2,f:'Big storage sac of water that keeps a plant cell firm.',col:'#6fb8e8'},
  flag:{n:'Flagellum',c:2,f:'Whip-like tail that moves the cell.',col:'#c0607a'}
};
const CS_ORDER=['mem','cyto','ribo','nuc','mito','chloro','wall','vac','flag'];
const CS_BASE={mem:1,cyto:1,ribo:1};
const CS_MISS={
  mem:'No cell membrane: nothing controls what goes in and out, so the cell leaks apart.',
  cyto:'No cytoplasm: the parts have nothing to sit in, and there is no place for the cell’s reactions.',
  ribo:'No ribosomes: the cell cannot build the proteins it needs to grow and repair itself.',
  nuc:'No nucleus: there is no DNA control center, so the cell cannot run itself.',
  mito0:'No mitochondria: the cell cannot release energy from its food, so it shuts down.',
  mito:'Too few mitochondria: this job needs more energy, and the cell runs out by noon.',
  chloro0:'No chloroplasts: the cell cannot make its own sugar from sunlight.',
  chloro:'Not enough chloroplasts to make all the sugar this cell needs.',
  wall:'No cell wall: nothing stiff holds the cell up, so it collapses.',
  vac:'No large vacuole: there is no water store to keep the cell firm.',
  flag:'No flagellum: the cell has no way to swim.'
};
const CSL=(name,story,kind,jobs,req,fatal,fact,clue,intro,miss)=>({name,story,kind,jobs,req:Object.assign({},CS_BASE,req),fatal:fatal||{},fact,clue,intro,miss:miss||{}});
const CS_ANIMAL={wall:'Animal cells have no cell wall. Only plants, fungi and bacteria have one.',chloro:'Animal cells have no chloroplasts. Animals get food by eating, not from sunlight.',vac:'A large central vacuole is a plant cell part. Animal cells do not have one.'};
const CS_LEVELS=[
  CSL('Cheek Cell','A cheek cell lines the inside of your mouth.','animal',
    ['Is an animal cell from the inside of your cheek','Uses energy for normal work ⚡'],{nuc:1,mito:1},
    Object.assign({},CS_ANIMAL,{flag:'Cheek cells stay in place. They do not swim.'}),
    'Your cheek cells are animal cells. They have a membrane, cytoplasm, ribosomes, a nucleus and mitochondria, but no cell wall and no chloroplasts.',
    'Every cell needs the 3 basic parts. Animal cells also have a nucleus and mitochondria.',
    'Every cell needs the 3 basic parts all cells share: a **cell membrane**, **cytoplasm** and **ribosomes**. Then add what the job needs. Each part on the shelf says what it does.'),
  CSL('Leaf Cell','This cell sits near the top of a sunny leaf.','plant',
    ['Lives in a sunny leaf and makes its own sugar ☀☀','Stays stiff so the leaf does not flop','Keeps a big store of water to stay firm','Uses energy for normal work ⚡'],{nuc:1,mito:1,chloro:2,wall:1,vac:1},
    {flag:'Leaf cells do not swim.'},
    'Plant cells have everything an animal cell has, plus a cell wall, a large vacuole and (in green parts) chloroplasts. Plants have mitochondria too, to release the energy stored in the sugar they make.',
    'Making sugar from sunlight, staying stiff and storing water each need their own part. And plants still need to release energy from that sugar.',
    null,{mito0:'No mitochondria: the leaf makes sugar, but plant cells still need mitochondria to release the energy stored in that sugar.'}),
  CSL('Muscle Cell','A muscle cell in your leg squeezes every time you take a step.','animal',
    ['Is an animal cell in a leg muscle','Squeezes and relaxes all day, so it needs a LOT of energy ⚡⚡⚡'],{nuc:1,mito:3},
    Object.assign({},CS_ANIMAL,{wall:'A cell wall is stiff, but a muscle cell must stretch and squeeze. Animal cells have no wall.',flag:'Muscle cells pull; they do not swim.'}),
    'Muscle cells are packed with mitochondria because squeezing (contracting) uses so much energy.',
    'Which part releases energy from food? A busy cell needs more of them.'),
  CSL('Root Hair Cell','This plant cell grows down into the dark soil.','plant',
    ['Lives underground in the dark soil','Is a plant cell with stiff support','Soaks up and stores lots of water','Uses energy to pull in minerals ⚡⚡'],{nuc:1,mito:2,wall:1,vac:1},
    {chloro:'Chloroplasts need light, and roots live in the dark soil. Root cells do not have chloroplasts.',flag:'Root cells do not swim.'},
    'Root hair cells have no chloroplasts. They get their sugar sent down from the leaves.',
    'Think about where this cell lives. Is there any sunlight underground?'),
  CSL('Sperm Cell','This animal cell has to swim a long way to reach an egg.','animal',
    ['Is an animal cell that must swim a long way','Needs a LOT of energy for swimming ⚡⚡⚡','Carries DNA to the egg'],{nuc:1,mito:3,flag:1},
    CS_ANIMAL,
    'A sperm cell has a tail (flagellum) to swim and lots of mitochondria packed near the tail for energy.',
    'Swimming needs a moving part. Carrying DNA needs the part that holds DNA.'),
  CSL('Bacterium','A bacterium is a whole living thing made of just one tiny cell.','bact',
    ['Is a bacterium: one cell with NO nucleus (its DNA floats loose)','Has a stiff outer layer for protection','Swims toward food'],{wall:1,flag:1},
    {nuc:'Bacteria have no nucleus. Their DNA floats loose in the cytoplasm.',mito:'Bacteria have no mitochondria. They release energy using their cell membrane instead.',chloro:'This bacterium eats food. It does not make food from sunlight.',vac:'Bacteria do not have a large central vacuole.'},
    'Bacteria are prokaryotes: no nucleus and no mitochondria. They still have a membrane, cytoplasm, ribosomes and DNA.',
    'Read the order carefully: it tells you a part this cell does NOT have.'),
  CSL('Onion Skin Cell','This cell is deep inside an onion bulb, where no light gets in.','plant',
    ['Is a plant cell inside an onion bulb (no light reaches it)','Has stiff support','Stores water in a big sac','Uses energy for normal work ⚡'],{nuc:1,mito:1,wall:1,vac:1},
    {chloro:'No light reaches inside the onion, so onion skin cells have no chloroplasts.',flag:'Onion cells do not swim.'},
    'Not every plant cell is green! Onion skin cells are plant cells with no chloroplasts.',
    'It is a plant cell, but does it get sunlight?'),
  CSL('Euglena','Euglena is a single-celled living thing that swims in ponds.','protist',
    ['Is one cell with a nucleus, living in a pond','Makes sugar from sunlight when it is sunny ☀','Swims toward the light','Has NO stiff wall, so it can bend and twist','Uses energy ⚡⚡'],{nuc:1,mito:2,chloro:1,flag:1},
    {wall:'Euglena has a bendy outer layer, not a stiff cell wall.',vac:'Euglena does not have a large central vacuole.'},
    'Euglena can make food like a plant and swim like an animal. One cell can do all of life’s jobs.',
    'This cell does a plant job AND an animal job. Give it a part for each.'),
  CSL('Yeast Cell','Yeast is a fungus. Bakers add it to bread dough.','fungus',
    ['Is a yeast cell (a fungus) with a nucleus','Has a stiff outer wall','Eats the sugar in bread dough (it cannot make food)','Stores water and wastes in a big sac','Uses energy ⚡⚡'],{nuc:1,mito:2,wall:1,vac:1},
    {chloro:'Fungi cannot make food from sunlight. Yeast eats sugar instead.',flag:'Yeast cells do not swim.'},
    'Fungi like yeast have cell walls but no chloroplasts. They get food from what they grow on.',
    'A fungus has a wall like a plant, but can it make its own food?')
];
const CS_PACKS={0:'Pack 1: Plant or animal?',3:'Pack 2: Cells with special jobs',6:'Pack 3: Tricky orders'};
const csCost=hv=>CS_ORDER.reduce((a,k)=>a+(hv[k]||0)*CS_PARTS[k].c,0);
const csMin=L=>csCost(L.req);
function csJudge(L,hv){
  const out=[];
  CS_ORDER.forEach(k=>{
    const need=L.req[k]||0,got=hv[k]||0;
    if(need&&got<need){const key=(k==='mito'||k==='chloro')&&got>0?k:(k==='mito'||k==='chloro')?k+'0':k;out.push({k,bad:true,msg:L.miss[key]||CS_MISS[key]});}
    if(!need&&got&&L.fatal[k])out.push({k,bad:true,msg:L.fatal[k]});
    else if(!need&&got)out.push({k,bad:true,msg:CS_PARTS[k].n+' do not belong in this cell.'});
  });
  const waste=CS_ORDER.reduce((a,k)=>a+((L.req[k]||0)&&(hv[k]||0)>L.req[k]?(hv[k]-L.req[k]):0),0);
  return {fails:out,waste,ok:!out.length};
}

/* ---------------- board geometry, scenes, art ---------------- */
const CSB={W:720,H:400,cx:360,cy:176,TY:376,TX0:120,TX1:660,N:44};
/* scene per level (same order as CS_LEVELS) */
const CS_SCENE=['body','leaf','muscle','soil','body','pond','onion','pond','dough'];
const CS_SHORT={mem:'controls what goes in and out',cyto:'jelly that fills the cell',ribo:'build proteins',nuc:'holds DNA, runs the cell',mito:'release energy from food',chloro:'make sugar from sunlight',wall:'stiff support',vac:'stores water',flag:'whip tail for swimming'};
const CS_STAGE_OF={mem:'in',cyto:'in',nuc:'orders',ribo:'proteins',chloro:'sugar',mito:'energy',wall:'firm',vac:'firm',flag:'swim'};
const csLight=L=>(L.req.chloro||0)>0;
const csScene=G=>CS_SCENE[G.i]||'body';
const csMax=k=>CS_PARTS[k].multi||1;
function csStages(L,hv){
  const s=['in','orders','proteins','sugar','energy'];
  if(L.req.wall||L.req.vac||hv.wall||hv.vac)s.push('firm');
  if(L.req.flag||hv.flag)s.push('swim');
  s.push('night');return s;}
function csStageInfo(L,k){const b=L.kind==='bact',lt=csLight(L);
  return ({in:['Take in','Morning: food and water come in through the membrane.'],
    orders:['Orders',b?'The loose DNA sends out instructions.':'The nucleus sends out instructions.'],
    proteins:['Proteins','Ribosomes build the proteins the cell needs.'],
    sugar:[lt?'Sugar':'Food',lt?'Sunlight hits the chloroplasts. They make sugar.':'Food (sugar) comes in from outside the cell.'],
    energy:['Energy',b?'The membrane releases energy from the sugar.':'Mitochondria turn sugar into energy.'],
    firm:['Stay firm','Afternoon: wind, squeezing and drying out. Can it hold its shape?'],
    swim:['Swim','Time to swim!'],
    night:['Night','Night falls. The cell made it through the day!']})[k];}

/* one hidden set of gradients and patterns, shared by the board and the shelf icons */
function csDefsMarkup(p){p=p||'cs';return `<defs>
<radialGradient id="${p}Mito" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffd8b4"/><stop offset=".55" stop-color="#ff9a52"/><stop offset="1" stop-color="#d0601e"/></radialGradient>
<radialGradient id="${p}Chl" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#c8f0a8"/><stop offset=".55" stop-color="#6cc96a"/><stop offset="1" stop-color="#2c8a3f"/></radialGradient>
<radialGradient id="${p}Nuc" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#f1e6ff"/><stop offset=".6" stop-color="#c7a6f2"/><stop offset="1" stop-color="#8e5ad6"/></radialGradient>
<radialGradient id="${p}Nol" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#a77ae8"/><stop offset="1" stop-color="#4b2190"/></radialGradient>
<radialGradient id="${p}Ribo" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#c9b2ff"/><stop offset="1" stop-color="#4a2a9a"/></radialGradient>
<radialGradient id="${p}Vac" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".5" stop-color="#bfe3fb" stop-opacity=".9"/><stop offset="1" stop-color="#6fb8e8" stop-opacity=".85"/></radialGradient>
<radialGradient id="${p}Cyto" cx=".45" cy=".4" r=".75"><stop offset="0" stop-color="#f4fcff"/><stop offset=".7" stop-color="#d6f0fb"/><stop offset="1" stop-color="#b6e1f4"/></radialGradient>
<pattern id="${p}Gran" width="26" height="22" patternUnits="userSpaceOnUse"><circle cx="5" cy="6" r="1.3" fill="#7fb9d6" opacity=".45"/><circle cx="18" cy="15" r="1" fill="#7fb9d6" opacity=".4"/><circle cx="13" cy="3" r=".8" fill="#7fb9d6" opacity=".35"/></pattern>
<pattern id="${p}Wall" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="12" height="12" fill="#8fcf6a"/><path d="M0 3h12M0 8h12" stroke="#5f9f3c" stroke-width="1.6" opacity=".7"/><path d="M4 0v12" stroke="#b5e597" stroke-width="1" opacity=".6"/></pattern>
<linearGradient id="${p}Flag" x1="0" x2="1"><stop offset="0" stop-color="#e07a96"/><stop offset="1" stop-color="#a8405e"/></linearGradient>
<radialGradient id="${p}Vig" cx=".5" cy=".46" r=".72"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0b1430" stop-opacity=".42"/></radialGradient>
<radialGradient id="${p}Sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8c8"/><stop offset=".35" stop-color="#ffd23f" stop-opacity=".9"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient>
</defs>`;}
function csDefs(){if(document.getElementById('cs-defs'))return;const d=svgEl(`<svg id="cs-defs" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${csDefsMarkup()}</svg>`);document.body.appendChild(d);}

/* organelle drawings, each centred on 0,0 */
const CS_ART={
  mito:(p)=>`<ellipse rx="25" ry="13" fill="url(#${p}Mito)" stroke="#b9541a" stroke-width="2.2"/><ellipse rx="20" ry="8.5" fill="#ffe6cf" opacity=".55"/>`+
    [-14,-7,0,7,14].map((x,i)=>`<path d="M${x} ${i%2?7.5:-7.5}V${i%2?-1:1}" stroke="#d0651f" stroke-width="3" stroke-linecap="round"/>`).join('')+`<path d="M-15 -8q8-4 18-3" stroke="#fff" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>`,
  chloro:(p)=>`<ellipse rx="23" ry="13" fill="url(#${p}Chl)" stroke="#1f7a37" stroke-width="2.2"/><path d="M-16 0H16" stroke="#3f9f55" stroke-width="1.2" opacity=".8"/>`+
    [-11,0,11].map(x=>[-4.5,-1.5,1.5,4.5].map(y=>`<rect x="${x-4.2}" y="${y-1.2}" width="8.4" height="2.4" rx="1.2" fill="#23763a"/>`).join('')).join('')+`<path d="M-15 -8q9-4 20-3" stroke="#fff" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>`,
  nuc:(p,r)=>{r=r||40;let t=`<circle r="${r}" fill="url(#${p}Nuc)" stroke="#6a35b8" stroke-width="3"/>`;
    for(let a=0;a<360;a+=30)t+=`<circle cx="${(Math.cos(a*Math.PI/180)*r).toFixed(1)}" cy="${(Math.sin(a*Math.PI/180)*r).toFixed(1)}" r="1.9" fill="#f3eaff"/>`;
    t+=`<path d="M${-r*.6} ${r*.2}q${r*.2} ${-r*.4} ${r*.4} 0t${r*.4} 0M${-r*.3} ${-r*.45}q${r*.2} ${r*.3} ${r*.4} 0" stroke="#8a5ad8" stroke-width="2" fill="none" opacity=".55"/>`;
    return t+`<circle cx="${r*.22}" cy="${-r*.08}" r="${r*.34}" fill="url(#${p}Nol)"/><circle cx="${r*.12}" cy="${-r*.2}" r="${r*.1}" fill="#fff" opacity=".4"/><path d="M${-r*.62} ${-r*.42}a${r*.75} ${r*.75} 0 0 1 ${r*.55} ${-r*.32}" stroke="#fff" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>`;},
  ribo:(p)=>`<circle r="3.8" fill="url(#${p}Ribo)"/><circle cx="2.6" cy="-2.4" r="2.5" fill="url(#${p}Ribo)"/>`,
  vac:(p,rx,ry)=>{rx=rx||84;ry=ry||58;return `<ellipse rx="${rx}" ry="${ry}" fill="url(#${p}Vac)" stroke="#4d9fd8" stroke-width="2.6"/><path d="M${-rx*.7} ${-ry*.35}a${rx*.8} ${ry*.8} 0 0 1 ${rx*.5} ${-ry*.42}" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/><circle cx="${rx*.3}" cy="${ry*.3}" r="3" fill="#fff" opacity=".6"/><circle cx="${rx*.45}" cy="${ry*.1}" r="2" fill="#fff" opacity=".5"/>`;},
  flag:()=>`<path d="M0 0c16-16 26 14 42 0s22 14 36 0 22-12 30 2" fill="none" stroke="#7a2a42" stroke-width="7" stroke-linecap="round" opacity=".35"/><path d="M0 0c16-16 26 14 42 0s22 14 36 0 22-12 30 2" fill="none" stroke="url(#csFlag)" stroke-width="5" stroke-linecap="round"/>`
};
/* shelf icons (40 x 40 view) */
function csIcon(k){
  const P='cs',b={
    mem:`<circle cx="20" cy="20" r="15" fill="none" stroke="#f6b37f" stroke-width="6"/><circle cx="20" cy="20" r="15" fill="none" stroke="#c9622a" stroke-width="1.6" stroke-dasharray="1.6 3"/>`,
    cyto:`<circle cx="20" cy="20" r="15" fill="url(#csCyto)" stroke="#9fd6f0" stroke-width="2"/><circle cx="20" cy="20" r="15" fill="url(#csGran)"/><circle cx="14" cy="15" r="2" fill="#fff" opacity=".8"/>`,
    ribo:[[12,14],[24,11],[28,24],[15,27],[20,19]].map(([x,y])=>`<g transform="translate(${x} ${y}) scale(1.1)">${CS_ART.ribo(P)}</g>`).join(''),
    nuc:`<g transform="translate(20 20)">${CS_ART.nuc(P,15)}</g>`,
    mito:`<g transform="translate(20 20) rotate(-25) scale(.72)">${CS_ART.mito(P)}</g>`,
    chloro:`<g transform="translate(20 20) rotate(-20) scale(.72)">${CS_ART.chloro(P)}</g>`,
    wall:`<rect x="4" y="5" width="32" height="30" rx="6" fill="url(#csWall)" stroke="#3f7f26" stroke-width="2"/><rect x="10" y="11" width="20" height="18" rx="4" fill="#e6f5fc" stroke="#e7884a" stroke-width="2"/>`,
    vac:`<g transform="translate(20 20)">${CS_ART.vac(P,15,11)}</g>`,
    flag:`<g transform="translate(4 20) scale(.3)">${CS_ART.flag()}</g><circle cx="5" cy="20" r="4" fill="#e6f5fc" stroke="#e7884a" stroke-width="2"/>`
  }[k];
  return svgEl(`<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">${b}</svg>`);
}

/* where each part sits, as offsets from the cell centre */
const rrPath=(x,y,w,hh,r)=>`M${x+r} ${y}H${x+w-r}A${r} ${r} 0 0 1 ${x+w} ${y+r}V${y+hh-r}A${r} ${r} 0 0 1 ${x+w-r} ${y+hh}H${x+r}A${r} ${r} 0 0 1 ${x} ${y+hh-r}V${y+r}A${r} ${r} 0 0 1 ${x+r} ${y}z`;
const CS_BLOB='M0 -115C86 -120 173 -72 168 2S96 118 2 115-173 79-166-2-86-110 0-115z';
const CS_RIBO=[[-140,20],[-148,-34],[-100,-62],[-28,-52],[-18,40],[-64,46],[-96,28],[-4,-58],[100,-54],[148,-30],[150,40],[140,4],[-146,78],[-84,92],[10,94],[102,94],[40,-60],[-44,16],[20,30],[90,60],[-120,-14],[60,-20]];
function csShape(L,hv){
  if(L.kind==='bact')return {k:'bact',outer:rrPath(-172,-76,344,152,76),mem:rrPath(-160,-64,320,128,64),fx:hv.wall?172:160,fy:0};
  if(hv.wall)return {k:'box',outer:rrPath(-174,-120,348,240,24),mem:rrPath(-160,-106,320,212,14),fx:174,fy:0};
  return {k:'blob',outer:CS_BLOB,mem:CS_BLOB,fx:168,fy:2};
}
function csPos(shape){
  if(shape==='bact')return {nuc:[-70,0,30],vac:[56,0,56,36],dna:[-36,-4],
    mito:[[-112,30,0],[-64,-36,10],[24,38,-8],[96,-34,6]],chloro:[[120,28,0],[56,-38,-6],[-124,-26,8],[-24,40,4]],
    ribo:CS_RIBO.map(([x,y])=>[x*.95,y*.56])};
  const s=shape==='blob'?.86:1,m=a=>[a[0]*s,a[1]*s,a[2]];
  return {nuc:[-78*s,-18*s,shape==='blob'?37:40],vac:[52*s,14*s,shape==='blob'?74:84,shape==='blob'?52:58],dna:[-40,0],
    mito:[[-120,62,20],[-40,80,-10],[-124,-76,-25],[8,-84,12]].map(m),chloro:[[126,-80,15],[66,-86,-10],[130,88,-15],[60,92,8]].map(m),
    ribo:CS_RIBO.map(([x,y])=>[x*s,y*s])};
}
function csRiboSpots(pos,hv){
  return pos.ribo.filter(([x,y])=>{
    if(hv.nuc&&Math.hypot(x-pos.nuc[0],y-pos.nuc[1])<pos.nuc[2]+7)return false;
    if(hv.vac){const v=pos.vac;if(((x-v[0])/(v[2]+7))**2+((y-v[1])/(v[3]+7))**2<1)return false;}
    for(let i=0;i<(hv.mito||0);i++)if(Math.hypot(x-pos.mito[i][0],y-pos.mito[i][1])<28)return false;
    for(let i=0;i<(hv.chloro||0);i++)if(Math.hypot(x-pos.chloro[i][0],y-pos.chloro[i][1])<28)return false;
    return true;}).slice(0,12);
}

/* the backdrop: a view down the microscope into this cell's world */
function csBackdrop(G){
  const W=CSB.W,H=CSB.H,sc=csScene(G);let t='';
  const pal={body:['#ffe3e6','#f5aebd','#f7c4cd'],muscle:['#ffd7d4','#e98a8f','#f3b0b2'],leaf:['#effbe2','#a9dc88','#cdebb5'],soil:['#c9a278','#6e4a2c','#a7835d'],
    onion:['#fbf3ea','#e6cfe0','#f1e1ea'],pond:['#e2f6f4','#7cc7c4','#b5e2dc'],dough:['#fbf0d8','#e7c890','#f3dfb5']}[sc];
  t+=`<defs><radialGradient id="csBg" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#csBg)"/>`;
  const ghost=(x,y,w,hh,r)=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${r}" fill="${pal[2]}" stroke="${Art.shade(pal[1],-.15)}" stroke-width="3" opacity=".55"/>`;
  if(sc==='leaf'||sc==='onion'){[[-60,-30,170,150],[-40,140,150,170],[600,-40,170,160],[610,140,160,170],[110,-120,160,140],[440,-120,170,140],[100,300,170,140],[450,300,180,140]].forEach(a=>{t+=ghost(...a,18);});
    if(sc==='leaf')[[30,60],[640,230],[150,320],[560,20]].forEach(([x,y])=>{t+=`<ellipse cx="${x}" cy="${y}" rx="11" ry="7" fill="#5fbf5f" opacity=".5"/>`;});
    if(sc==='onion')t+=`<rect width="${W}" height="${H}" fill="#3b2a4a" opacity=".22"/>`;}
  else if(sc==='body'||sc==='muscle'){
    if(sc==='muscle')for(let y=-10;y<H;y+=46)t+=`<path d="M0 ${y}C180 ${y+16} 360 ${y-14} 720 ${y+8}" stroke="#d76f78" stroke-width="16" fill="none" opacity=".25"/>`;
    [[30,40,60],[680,70,70],[60,300,64],[660,300,58],[200,-10,50],[520,-14,54]].forEach(([x,y,r])=>{t+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.8}" fill="${pal[2]}" stroke="${Art.shade(pal[1],-.15)}" stroke-width="3" opacity=".55"/><circle cx="${x-8}" cy="${y-4}" r="${r*.25}" fill="#c9a6e6" opacity=".45"/>`;});}
  else if(sc==='soil'){for(let i=0;i<34;i++){const x=(i*137)%W,y=(i*89+40)%H,r=6+(i*7)%16;t+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.75}" fill="${i%3?'#8a6440':'#5c3d22'}" opacity=".55"/>`;}
    t+=`<path d="M0 22C120 30 240 12 360 24S600 14 720 26V0H0z" fill="#3d2814" opacity=".75"/><text x="18" y="16" font-size="11" font-weight="800" fill="#e8d2b4">deep in the dark soil</text>`;}
  else if(sc==='pond'){for(let i=0;i<14;i++){const x=(i*157+40)%W,y=(i*71+30)%H,r=4+(i*5)%10;t+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".35" stroke="#fff" stroke-width="1"/>`;}
    [[70,90],[650,300],[600,60],[90,320]].forEach(([x,y])=>{t+=`<path d="M${x} ${y}q8-10 16 0t16 0" stroke="#4f9f6a" stroke-width="3" fill="none" opacity=".5"/>`;});}
  else if(sc==='dough'){for(let i=0;i<18;i++){const x=(i*149+20)%W,y=(i*83+30)%H,r=8+(i*11)%22;t+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.8}" fill="#fff8e8" stroke="#d6b06a" stroke-width="2" opacity=".6"/>`;}}
  if(csLight(G.L))t+=`<circle cx="46" cy="40" r="74" fill="url(#csSun)"/><g stroke="#ffb000" stroke-width="3" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(d=>{const c=Math.cos(d*Math.PI/180),n=Math.sin(d*Math.PI/180);return `<path d="M${46+c*28} ${40+n*28}L${46+c*38} ${40+n*38}"/>`;}).join("")}</g><circle cx="46" cy="40" r="22" fill="#ffd23f" stroke="#ffb000" stroke-width="3"/>`;
  t+=`<rect width="${W}" height="${H}" fill="url(#csVig)"/>`;
  /* scale bar */
  t+=`<g transform="translate(22 334)"><path d="M0 0h60" stroke="#13203d" stroke-width="4" stroke-linecap="round"/><text x="30" y="-6" text-anchor="middle" font-size="10.5" font-weight="900" fill="#13203d" stroke="#fff" stroke-width="3" paint-order="stroke">10 µm</text></g>`;
  return t;
}

/* the cell itself (redrawn on every change; also draws what went wrong after a run) */
function csCell(G){
  const L=G.L,S=G.st,hv=S.hv,sh=csShape(L,hv),pos=csPos(sh.k),P='cs',res=S.res,bad=new Set(),ghost=new Set();
  if(res&&!res.ok)(S.failParts||[]).forEach(f=>{((L.req[f.k]||0)>(hv[f.k]||0)?ghost:bad).add(f.k);});
  const B=k=>bad.has(k)?' csbad':'';
  let t='';
  /* drop zone (bigger than the cell, so it is easy to hit) */
  t+=`<path class="cshit" d="${rrPath(-200,-140,400,282,60)}" fill="transparent"/>`;
  let body='';
  if(hv.flag)body+=`<g class="csorg csflagg${B('flag')}" data-k="flag" transform="translate(${sh.fx-2} ${sh.fy})" tabindex="0" role="button" aria-label="Flagellum. Press to take it out."><g class="csflag">${CS_ART.flag()}</g></g>`;
  else if(ghost.has('flag'))body+=`<path class="csghost" d="M${sh.fx} ${sh.fy}c16-16 26 14 42 0s22 14 36 0" fill="none" stroke-width="4"/>`;
  if(hv.wall)body+=`<g class="csorg${B('wall')}" data-k="wall" tabindex="0" role="button" aria-label="Cell wall. Press to take it out."><path d="${sh.outer}" fill="url(#csWall)" stroke="#3f7f26" stroke-width="2.5"/></g>`;
  else if(ghost.has('wall'))body+=`<path class="csghost" d="${csShape(L,{wall:1}).outer}" fill="none" stroke-width="4"/>`;
  /* cytoplasm + membrane */
  if(hv.cyto)body+=`<path d="${sh.mem}" fill="url(#csCyto)"/><path d="${sh.mem}" fill="url(#csGran)" class="cscyto${B('cyto')}"/>`;
  else body+=`<path d="${sh.mem}" fill="#ffffff" opacity=".55"/><text y="${sh.k==='bact'?54:96}" text-anchor="middle" font-size="12" font-weight="800" fill="#8a96b0">${hv.mem?'no cytoplasm yet':''}</text>`;
  if(hv.mem)body+=`<g class="csmem${B('mem')}"><path d="${sh.mem}" fill="none" stroke="#f6b37f" stroke-width="7"/><path d="${sh.mem}" fill="none" stroke="#c9622a" stroke-width="1.8" stroke-dasharray="1.8 3.4"/></g>`;
  else body+=`<path d="${sh.mem}" fill="none" stroke="#d64545" stroke-width="3" stroke-dasharray="9 7" class="csnomem"/>`;
  /* parts inside */
  const og=(k,x,y,rot,inner,lab)=>`<g class="csorg${B(k)}" data-k="${k}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})${rot?` rotate(${rot})`:''}" tabindex="0" role="button" aria-label="${lab}. Press to take one out.">${inner}</g>`;
  if(hv.vac){const v=pos.vac;body+=og('vac',v[0],v[1],0,CS_ART.vac(P,v[2],v[3]),'Large vacuole');}else if(ghost.has('vac')){const v=pos.vac;body+=`<ellipse class="csghost" cx="${v[0]}" cy="${v[1]}" rx="${v[2]}" ry="${v[3]}"/>`;}
  if(L.kind==='bact'&&hv.cyto&&!hv.nuc){const [x,y]=pos.dna;body+=`<path class="csdna" d="M${x-46} ${y}c6-20 24-22 32-8s18 18 30 4 26-18 34 0-10 24-26 18-22-14-38-4-30 8-32-10z" fill="none" stroke="#8a4fd6" stroke-width="2.6" opacity=".75"/>`;}
  if(hv.nuc){const n=pos.nuc;body+=og('nuc',n[0],n[1],0,CS_ART.nuc(P,n[2]),'Nucleus');}else if(ghost.has('nuc')){const n=pos.nuc;body+=`<g class="csghost"><circle cx="${n[0]}" cy="${n[1]}" r="${n[2]}"/><text x="${n[0]}" y="${n[1]+9}" text-anchor="middle" font-size="26" font-weight="900" stroke="none">?</text></g>`;}
  for(let i=0;i<(hv.mito||0);i++){const [x,y,r]=pos.mito[i];body+=og('mito',x,y,r,CS_ART.mito(P),'Mitochondrion');}
  if(ghost.has('mito'))for(let i=hv.mito||0;i<L.req.mito;i++){const [x,y,r]=pos.mito[i];body+=`<ellipse class="csghost" transform="translate(${x} ${y}) rotate(${r})" rx="25" ry="13"/>`;}
  for(let i=0;i<(hv.chloro||0);i++){const [x,y,r]=pos.chloro[i];body+=og('chloro',x,y,r,CS_ART.chloro(P),'Chloroplast');}
  if(ghost.has('chloro'))for(let i=hv.chloro||0;i<L.req.chloro;i++){const [x,y,r]=pos.chloro[i];body+=`<ellipse class="csghost g" transform="translate(${x} ${y}) rotate(${r})" rx="23" ry="13"/>`;}
  const rs=csRiboSpots(pos,hv);
  if(hv.ribo)body+=`<g class="csorg csribos${B('ribo')}" data-k="ribo" tabindex="0" role="button" aria-label="Ribosomes. Press to take them out.">${rs.map(([x,y])=>`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${CS_ART.ribo(P)}</g>`).join('')}</g>`;
  else if(ghost.has('ribo'))body+=`<g class="csghost">${rs.slice(0,8).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g>`;
  const fail=res&&!res.ok?S.failStage:null,cls=fail==='firm'&&(ghost.has('wall')||ghost.has('vac'))?' cssag':fail==='in'&&ghost.has('cyto')?' csdrift':'';
  t+=`<g class="csbody${cls}">${body}</g>`;
  return t;
}

/* ---------------- board build + redraw ---------------- */
function csBuild(G){
  csDefs();const L=G.L,S=G.st,W=CSB.W,H=CSB.H;
  let t=csBackdrop(G);
  t+=`<g class="csrays" opacity="0"></g>`;
  t+=`<g class="cscellg" transform="translate(${CSB.cx} ${CSB.cy})"><g class="cscell csdrop" aria-label="The cell. Drop a part here."></g></g>`;
  t+=`<g class="csparts" pointer-events="none">${Array.from({length:CSB.N},()=>'<circle r="0" cx="-20" cy="-20"/>').join('')}</g>`;
  /* energy meter */
  t+=`<g class="csmeter" opacity="0" transform="translate(556 14)"><rect width="150" height="40" rx="20" fill="#13203d" opacity=".86"/><path d="M18 10l-6 11h6l-3 10 9-13h-6l3-8z" fill="#ffd23f"/><rect x="36" y="14" width="100" height="12" rx="6" fill="#2a3a63"/><rect x="36" y="14" width="0" height="12" rx="6" fill="#ffd23f" class="csmfill"/><g class="csmticks"></g></g>`;
  /* stage banner */
  t+=`<g class="csbanner" opacity="0"><rect x="160" y="10" width="400" height="34" rx="17" fill="#13203d" opacity=".88"/><text x="360" y="32" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" class="csbant"></text></g>`;
  t+=`<g class="csstamp" opacity="0" pointer-events="none"><rect x="190" y="8" width="340" height="40" rx="14" opacity=".94"/><text x="360" y="35" text-anchor="middle" font-size="21" font-weight="900" fill="#fff" class="csstampt"></text></g>`;
  /* the day track */
  t+=`<g class="csday"><rect x="0" y="348" width="${W}" height="52" fill="#13203d" opacity=".92"/><text x="16" y="380" font-size="11.5" font-weight="900" fill="#fff">A DAY</text><rect x="${CSB.TX0}" y="${CSB.TY-5}" width="${CSB.TX1-CSB.TX0}" height="10" rx="5" fill="#2a3a63"/><rect x="${CSB.TX0}" y="${CSB.TY-5}" width="0" height="10" rx="5" fill="#ffb347" class="csprog"/><g class="cssun"><circle r="10" fill="#ffd23f" stroke="#fff3b0" stroke-width="2.5"/></g><g class="csticks"></g></g>`;
  const svg=ngSvg(W,H,t,'ngsvg cssvg','A cell seen through a microscope');
  const q=s=>svg.querySelector(s);
  S.el={svg,cell:q('.cscell'),cellg:q('.cscellg'),parts:[...q('.csparts').children],rays:q('.csrays'),meter:q('.csmeter'),mfill:q('.csmfill'),mticks:q('.csmticks'),
    banner:q('.csbanner'),bant:q('.csbant'),stamp:q('.csstamp'),stampt:q('.csstampt'),ticks:q('.csticks'),sun:q('.cssun'),prog:q('.csprog'),P:[],raf:0};
  svg.addEventListener('click',e=>{if(Date.now()-csLastDrop<450)return;const o=e.target.closest&&e.target.closest('.csorg');if(o)csRemove(o.dataset.k,true);});
  svg.addEventListener('keydown',e=>{const o=e.target.closest&&e.target.closest('.csorg');if(o&&(e.key==='Enter'||e.key===' '||e.key==='Delete'||e.key==='Backspace')){e.preventDefault();csRemove(o.dataset.k,true);}});
  csStatic(G);
  return svg;
}
const csTX=f=>CSB.TX0+(CSB.TX1-CSB.TX0)*f;
function csStatic(G){
  const S=G.st,E=S.el,L=G.L;if(!E)return;
  E.cell.innerHTML=csCell(G);
  const st=csStages(L,S.hv),n=st.length,fi=S.res&&!S.res.ok?st.indexOf(S.failStage):-1,ok=S.res&&S.res.ok;
  E.ticks.innerHTML=st.map((k,i)=>{const x=csTX(i/(n-1)),done=ok||(fi>=0&&i<fi),f=i===fi;
    return `<g transform="translate(${x.toFixed(1)} ${CSB.TY})" class="cstick" data-i="${i}"><circle r="7" fill="${f?'#e2483f':done?'#3fd18a':'#3a4a74'}" stroke="#13203d" stroke-width="2"/>${f?'<path d="M-3-3l6 6M3-3l-6 6" stroke="#fff" stroke-width="2"/>':done?'<path d="M-3.5 0l2.5 2.5 4.5-5" stroke="#13203d" stroke-width="2.2" fill="none"/>':''}<text y="-12" text-anchor="middle" font-size="10" font-weight="800" fill="${f?'#ff9a92':done?'#8ff0c0':'#cfd8ff'}">${csStageInfo(L,k)[0]}</text></g>`;}).join('');
  const f=ok?1:fi>=0?fi/(n-1):0;
  E.sun.setAttribute('transform',`translate(${csTX(f)} ${CSB.TY})`);E.prog.setAttribute('width',(CSB.TX1-CSB.TX0)*f);
  E.rays.setAttribute('opacity','0');E.banner.setAttribute('opacity','0');
  E.meter.setAttribute('opacity',S.res?'1':'0');
  if(S.res){const need=Math.max(1,L.req.mito||0),got=L.kind==='bact'?(S.hv.mem?need:0):(S.hv.mito||0),en=ok?1:S.failStage==='energy'?0:(fi>=0&&fi<st.indexOf('energy'))?0:Math.min(1,got/need);E.mfill.setAttribute('width',100*en);}
  csMeterTicks(G);
  if(S.res){E.stamp.setAttribute('opacity','1');E.stamp.querySelector('rect').setAttribute('fill',ok?'#1f9d55':'#c2362f');
    E.stampt.textContent=ok?'✓ SURVIVED THE DAY':'✗ STOPPED AT: '+csStageInfo(L,S.failStage)[0].toUpperCase();}
  else E.stamp.setAttribute('opacity','0');
  csParts(G,true);
}
function csMeterTicks(G){const L=G.L,E=G.st.el,need=Math.max(1,L.req.mito||0);let t='';for(let i=1;i<need;i++)t+=`<path d="M${36+100*i/need} 12v16" stroke="#13203d" stroke-width="2"/>`;E.mticks.innerHTML=t;}

/* ---------------- particles ---------------- */
function csSpawn(G,o){const E=G.st.el;if(E.P.length>=CSB.N)return;E.P.push(Object.assign({t:0,delay:0,dur:900,r:3.6,bend:0,col:'#ffd23f',stroke:'#fff',fade:true},o,{t0:null}));}
function csParts(G,clear,now){
  const E=G.st.el;if(clear){E.P=[];E.parts.forEach(c=>c.setAttribute('r','0'));return;}
  const keep=[];E.P.forEach(p=>{if(p.t0==null)p.t0=now+p.delay;const f=(now-p.t0)/p.dur;if(f<1)keep.push(p);});
  E.P=keep;
  E.parts.forEach((c,i)=>{const p=E.P[i];if(!p){c.setAttribute('r','0');return;}
    let f=(now-p.t0)/p.dur;if(f<0){c.setAttribute('r','0');return;}f=Art.ease.inOutQuad(Math.min(1,f));
    const mx=(p.x0+p.x1)/2-(p.y1-p.y0)*p.bend,my=(p.y0+p.y1)/2+(p.x1-p.x0)*p.bend,u=1-f;
    c.setAttribute('cx',(u*u*p.x0+2*u*f*mx+f*f*p.x1).toFixed(1));c.setAttribute('cy',(u*u*p.y0+2*u*f*my+f*f*p.y1).toFixed(1));
    c.setAttribute('r',p.r);c.setAttribute('fill',p.col);c.setAttribute('stroke',p.stroke);c.setAttribute('stroke-width','1.4');
    c.setAttribute('opacity',p.fade?Math.min(1,(1-f)*3).toFixed(2):'1');});
}

/* ---------------- run a day ---------------- */
const CS_STEP=1550;
function csRun(){
  if(!G||G.key!=='cell'||G.done)return;const L=G.L,S=G.st;if(S.busy)return;
  const r=csJudge(L,S.hv);if(ngT())return ngTDone(r.ok?(r.waste?.75:1):0);
  G.tries++;const st=csStages(L,S.hv);
  let fi=-1;r.fails.forEach(f=>{const i=st.indexOf(CS_STAGE_OF[f.k]);if(i>=0&&(fi<0||i<fi))fi=i;});
  S.res=null;S.run={st,fi,r};S.busy=true;S.failStage=fi>=0?st[fi]:null;S.failParts=fi>=0?r.fails.filter(f=>CS_STAGE_OF[f.k]===st[fi]):[];
  csStatic(G);ngRender();
  const E=S.el;E.meter.setAttribute('opacity','1');E.mfill.setAttribute('width','0');
  if(Art.reduced())return csFinish(G);
  const last=fi>=0?fi:st.length-1,tot=CS_STEP*(last+1);let cur=-1,t0=0;
  const step=now=>{if(!G||G.st!==S||!S.busy)return;if(!t0)t0=now;const el=now-t0,i=Math.min(last,Math.floor(el/CS_STEP)),lf=Math.min(1,(el-i*CS_STEP)/CS_STEP);
    if(i!==cur){cur=i;csStageStart(G,st[i],i===fi);}
    csStageTick(G,st[i],lf,i===fi);
    const g=(i+(st[i]==='night'?1:lf*(i===fi?.5:1)))/(st.length-1);E.sun.setAttribute('transform',`translate(${csTX(Math.min(1,g)).toFixed(1)} ${CSB.TY})`);E.prog.setAttribute('width',(CSB.TX1-CSB.TX0)*Math.min(1,g));
    csParts(G,false,now);
    if(el<tot+150)E.raf=requestAnimationFrame(step);else csFinish(G);};
  E.raf=requestAnimationFrame(step);
}
function csSkip(){if(G&&G.key==='cell'&&G.st.busy)csFinish(G);}
/* board point of a part (in board coordinates) */
function csSpots(G){const L=G.L,hv=G.st.hv,sh=csShape(L,hv),pos=csPos(sh.k),X=CSB.cx,Y=CSB.cy,mp=a=>[X+a[0],Y+a[1]];
  return {nuc:mp(pos.nuc),dna:mp(pos.dna),vac:mp(pos.vac),mito:pos.mito.slice(0,hv.mito||0).map(mp),chloro:pos.chloro.slice(0,hv.chloro||0).map(mp),ribo:csRiboSpots(pos,hv).map(mp),flag:[X+sh.fx,Y+sh.fy],sh};}
function csRnd(i,a,b){const x=Math.sin(i*12.9898+a*78.233)*43758.5453;return x-Math.floor(x);}
function csStageStart(G,k,fail){
  const S=G.st,E=S.el,L=G.L,hv=S.hv,sp=csSpots(G),X=CSB.cx,Y=CSB.cy,body=E.cell.querySelector('.csbody'),q=s=>[...E.cell.querySelectorAll(s)];
  const info=csStageInfo(L,k);E.bant.textContent=info[1];E.banner.setAttribute('opacity','1');Art.pop(E.banner,1.04);
  const tick=E.ticks.querySelector(`.cstick[data-i="${S.run.st.indexOf(k)}"] circle`);
  E.ticks.querySelectorAll('.cstick').forEach((g,i)=>{const c=g.querySelector('circle');const idx=S.run.st.indexOf(k);if(i<idx)c.setAttribute('fill','#3fd18a');});
  if(tick)tick.setAttribute('fill','#ffd23f');
  const glow=sel=>q(sel).forEach(o=>o.classList.add('csglow'));
  const badParts=S.failParts.map(f=>f.k);
  const markBad=()=>{badParts.forEach(b=>q(`.csorg[data-k="${b}"]`).forEach(o=>o.classList.add('csbad')));};
  const inside=i=>{const a=csRnd(i,1,2)*Math.PI*2,rr=csRnd(i,3,4)*(sp.sh.k==='bact'?50:85);return [X+Math.cos(a)*rr*1.5,Y+Math.sin(a)*rr*(sp.sh.k==='bact'?.8:1)];};
  const outside=i=>{const a=csRnd(i,5,6)*Math.PI*2;return [X+Math.cos(a)*300,Y+Math.sin(a)*200];};
  if(k==='in'){
    for(let i=0;i<14;i++){const [x0,y0]=outside(i),[x1,y1]=inside(i);csSpawn(G,{x0,y0,x1,y1,col:i%2?'#8fd0ff':'#ffe08a',r:3.4,delay:i*70,dur:1000,bend:.1});}
    if(hv.mem)glow('.csmem');
    if(fail&&!hv.mem){for(let i=0;i<10;i++){const [x0,y0]=inside(i+30),[x1,y1]=outside(i+30);csSpawn(G,{x0,y0,x1,y1,col:'#9fd6f0',r:3.2,delay:500+i*60,dur:900});}const c=E.cell.querySelector('.cscyto');if(c)c.classList.add('csleak');}
    if(fail&&!hv.cyto&&body)body.classList.add('csdrift');
  }
  else if(k==='orders'){
    const from=hv.nuc?sp.nuc:L.kind==='bact'&&hv.cyto?sp.dna:null;
    if(from&&!(fail&&badParts.includes('nuc'))){if(hv.nuc)glow('.csorg[data-k="nuc"]');else q('.csdna').forEach(o=>o.classList.add('csglow'));
      sp.ribo.slice(0,8).forEach((r,i)=>csSpawn(G,{x0:from[0],y0:from[1],x1:r[0],y1:r[1],col:'#b98cff',r:3,delay:i*90,dur:900,bend:.15}));}
    if(fail){markBad();if(!hv.nuc&&(L.req.nuc||0))body&&body.insertAdjacentHTML('beforeend',`<g class="csghost"><circle cx="${sp.nuc[0]-X}" cy="${sp.nuc[1]-Y}" r="38"/><text x="${sp.nuc[0]-X}" y="${sp.nuc[1]-Y+9}" text-anchor="middle" font-size="26" font-weight="900" stroke="none">?</text></g>`);}
  }
  else if(k==='proteins'){
    if(hv.ribo){glow('.csribos');sp.ribo.slice(0,10).forEach((r,i)=>{const a=csRnd(i,7,8)*Math.PI*2;csSpawn(G,{x0:r[0],y0:r[1],x1:r[0]+Math.cos(a)*30,y1:r[1]+Math.sin(a)*30,col:'#ff8fb8',r:2.6,delay:200+i*80,dur:900});});}
    if(fail){markBad();if(!hv.ribo)body&&body.insertAdjacentHTML('beforeend',`<g class="csghost">${sp.ribo.slice(0,8).map(([x,y])=>`<circle cx="${x-X}" cy="${y-Y}" r="4"/>`).join('')}</g>`);}
  }
  else if(k==='sugar'){
    const lt=csLight(L);
    if(lt){const tg=sp.chloro.length?sp.chloro:[[X+80,Y-60]];E.rays.innerHTML=tg.map(([x,y])=>`<path d="M60 52L${x} ${y}" stroke="#ffcf3a" stroke-width="4" stroke-dasharray="12 10" class="csray" opacity=".85"/>`).join('');E.rays.setAttribute('opacity','1');}
    if(sp.chloro.length&&lt&&!badParts.includes('chloro')||sp.chloro.length&&lt&&fail&&(hv.chloro||0)>0){glow('.csorg[data-k="chloro"]');
      sp.chloro.forEach((c,j)=>{for(let i=0;i<3;i++){const a=csRnd(i+j*5,9,10)*Math.PI*2;csSpawn(G,{x0:c[0],y0:c[1],x1:c[0]+Math.cos(a)*34,y1:c[1]+Math.sin(a)*30,col:'#ffd23f',stroke:'#b07a00',r:4,delay:350+i*160+j*60,dur:900,fade:false});}});}
    else if(!lt&&!sp.chloro.length){for(let i=0;i<10;i++){const [x0,y0]=outside(i+60),[x1,y1]=inside(i+60);csSpawn(G,{x0,y0,x1,y1,col:'#ffd23f',stroke:'#b07a00',r:4,delay:i*80,dur:1000,bend:-.1,fade:false});}}
    if(fail)markBad();
  }
  else if(k==='energy'){
    const M=[E.meter.transform.baseVal.consolidate().matrix.e+20,38];
    if(L.kind==='bact'){if(hv.mem&&!badParts.includes('mito')){glow('.csmem');for(let i=0;i<10;i++){const a=csRnd(i,11,12)*Math.PI*2,x0=X+Math.cos(a)*160,y0=Y+Math.sin(a)*64;csSpawn(G,{x0,y0,x1:M[0],y1:M[1],col:'#fff36b',stroke:'#ff9f1a',r:3.4,delay:300+i*70,dur:850,bend:.1});}}}
    else if(sp.mito.length){glow('.csorg[data-k="mito"]');
      sp.mito.forEach((m,j)=>{for(let i=0;i<2;i++){const [x0,y0]=inside(i+j*3+80);csSpawn(G,{x0,y0,x1:m[0],y1:m[1],col:'#ffd23f',stroke:'#b07a00',r:4,delay:i*150+j*80,dur:600});
        csSpawn(G,{x0:m[0],y0:m[1],x1:M[0],y1:M[1],col:'#fff36b',stroke:'#ff9f1a',r:3.4,delay:650+i*150+j*90,dur:800,bend:.12});}});}
    if(fail)markBad();
  }
  else if(k==='firm'){
    if(hv.wall&&!badParts.includes('wall'))glow('.csorg[data-k="wall"]');
    if(hv.vac&&!badParts.includes('vac'))q('.csorg[data-k="vac"]').forEach(o=>o.classList.add('csswell'));
    for(let i=0;i<6;i++)csSpawn(G,{x0:40,y0:40+i*48,x1:200,y1:60+i*44,col:'#ffffff',stroke:'#cfd8ff',r:2.5,delay:i*120,dur:700});
    if(fail){markBad();if((!hv.wall&&L.req.wall)||(!hv.vac&&L.req.vac))body&&body.classList.add('cssag');}
  }
  else if(k==='swim'){
    if(hv.flag&&!badParts.includes('flag')){q('.csflagg').forEach(o=>o.classList.add('csfast'));E.cellg.classList.add('csswim');}
    else if(fail&&!hv.flag)Art.shake(E.cellg);
    if(fail)markBad();
  }
  else if(k==='night'){E.mfill.setAttribute('width','100');}
  if(fail){Art.shake(E.svg);}
}
function csStageTick(G,k,f,fail){
  const S=G.st,E=S.el,L=G.L,hv=S.hv;
  if(k==='energy'){const need=Math.max(1,L.req.mito||0),got=L.kind==='bact'?(hv.mem?need:0):(hv.mito||0);let en=Math.min(1,got/need)*Math.min(1,Math.max(0,(f-.4)/.45));
    if(fail&&got>0&&f>.8)en*=Math.max(0,1-(f-.8)/.2);E.mfill.setAttribute('width',(100*en).toFixed(1));}
}
function csFinish(G){
  const S=G.st,E=S.el,L=G.L;if(!S.busy)return;cancelAnimationFrame(E.raf);S.busy=false;E.cellg.classList.remove('csswim');
  const r=S.run.r;S.res=r;csStatic(G);ngRender();
  if(r.ok){ngSay(r.waste?'It survived! Next time leave out the extra parts.':'Perfect cell! It did every job.','go');Art.burstAt(E.cell,{n:22,colors:['#3fd18a','#ffd23f','#fff','#7fd3ff'],shape:['star','dot']});
    const score=(G.tries-1)+r.waste;G.detail={runs:G.tries,waste:r.waste};
    ngWin(ngStars(score,0,2),['Your cell worked after ',h('b',null,G.tries),` run${G.tries>1?'s':''}`,r.waste?` with ${r.waste} extra part${r.waste>1?'s':''}.`:' with no extra parts.']);}
  else{G.miss++;const m=S.failParts[0]?S.failParts[0].msg:r.fails[0].msg;ngSay(m+(r.fails.length>1?` (${r.fails.length} problems in all)`:''),'alert');fx.pop({icon:'cell',text:'The cell failed',kind:'oops'});}
}

/* ---------------- building ---------------- */
let CS_DRAG=null;
function csDragInit(){
  if(CS_DRAG)CS_DRAG.destroy();
  CS_DRAG=Art.drag({root:$('ngGrid'),items:'.cstile',targets:'.csdrop',
    accept:(it)=>!!(G&&G.key==='cell'&&G.st&&!G.st.busy&&!G.done&&(G.st.hv[it.dataset.k]||0)<csMax(it.dataset.k)),
    label:it=>it.getAttribute('aria-label')||'part',
    onDrop:it=>csAdd(it.dataset.k)});
}
let csLastDrop=0;
function csAdd(k){csLastDrop=Date.now();
  if(!G||G.key!=='cell'||G.done||G.st.busy)return;const S=G.st,L=G.L,was=S.hv.wall;
  if((S.hv[k]||0)>=csMax(k))return;
  S.hv[k]=(S.hv[k]||0)+1;S.res=null;S.failParts=[];ngRender();
  const E=S.el;if(!E)return;
  const o=[...E.cell.querySelectorAll(`.csorg[data-k="${k}"]`)].pop()||E.cell.querySelector(k==='mem'?'.csmem':'.cscyto');
  if(o){Art.pop(o,1.18);const r=o.getBoundingClientRect();Art.burst(r.left+r.width/2,r.top+r.height/2,{n:10,colors:[CS_PARTS[k].col,'#fff','#ffd23f'],shape:['star','dot'],speed:180});}
  if(k==='wall'&&!was&&L.kind!=='bact')Art.pop(E.cellg,1.05);
  if(!ngT())ngSay(`**${CS_PARTS[k].n}** added${G.i<3||G.hint>=1?': '+CS_SHORT[k]:''}. `+(csCost(S.hv)>csMin(L)+4?'You are over budget!':''));
}
function csRemove(k,fromCell){
  if(!G||G.key!=='cell'||G.done||G.st.busy)return;const S=G.st;if(!S.hv[k])return;
  S.hv[k]--;if(!S.hv[k])delete S.hv[k];S.res=null;S.failParts=[];ngRender();
  if(!ngT())ngSay(`Took out **${CS_PARTS[k].n}**.`);
  if(!fromCell){const b=$('ngSide').querySelector(`.cstile[data-k="${k}"]`);if(b)Art.pop(b,1.08);}
}

/* ---------------- side panel ---------------- */
function csSide(G){
  const L=G.L,S=G.st,hv=S.hv,showF=G.i<3||G.hint>=1,budget=csMin(L)+4,cost=csCost(hv),need=G.hint>=3&&!ngT()?L.req:null;
  const kids=[h('div',{class:'mwtask cstask'},h('span',{class:'mwflag csflagic'},svgEl(`<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true"><ellipse cx="20" cy="20" rx="16" ry="13" fill="#e6f5fc" stroke="#e7884a" stroke-width="2.6"/><circle cx="15" cy="18" r="5.5" fill="#c7a6f2" stroke="#6a35b8" stroke-width="1.6"/><ellipse cx="26" cy="25" rx="5" ry="2.8" fill="#ff9a52" transform="rotate(-20 26 25)"/></svg>`)),h('div',null,h('b',null,'Job order'),h('ul',null,...L.jobs.map(j=>h('li',null,j))),h('small',null,'+ the basic parts every cell shares')))];
  kids.push(h('div',{class:'osl cstrayl'},'Parts shelf',h('small',null,showF?' drag into the cell':' Hint 1 shows what each part does')));
  kids.push(h('div',{class:'cstiles'},...CS_ORDER.map(k=>{const p=CS_PARTS[k],n=hv[k]||0,full=n>=csMax(k);
    return h('div',{class:'cstw'},h('button',{type:'button',class:'cstile'+(n?' on':'')+(need&&need[k]?' hint':''),'data-k':k,disabled:G.done||S.busy||full,
      'aria-label':`${p.n}, ${p.c} coin${p.c>1?'s':''}.${showF?' '+p.f:''} Drag it into the cell.`,title:showF?p.f:p.n},
      csIcon(k),h('span',{class:'cstn'},h('b',null,p.n),h('small',null,showF?CS_SHORT[k]:`${p.c} coin${p.c>1?'s':''}${p.multi?' each':''}`)),h('i',{class:'cscoin'},p.c)),
      n?h('button',{type:'button',class:'cscnt','aria-label':`Take out one ${p.n}. You have ${n}.`,title:'Take one out',disabled:G.done||S.busy,onclick:()=>csRemove(k)},p.multi?'×'+n:'✓',h('span',null,'−')):null);})));
  const pc=Math.min(100,Math.round(cost/budget*100));
  kids.push(h('div',{class:'kfbudget csbudget'+(cost>budget?' over':'')},h('span',null,'Cost ',h('b',null,cost),' of ',budget,' coins'),h('span',{class:'kfbbar'},h('i',{style:`width:${pc}%`}))));
  if(S.busy)kids.push(ngBtn('Skip ⏭',csSkip,'ghost',{style:'width:100%'}));
  else kids.push(ngBtn([I('play'),' Run a day'],csRun,'good',{style:'width:100%;font-size:18px',disabled:G.done||cost>budget||!cost}));
  const res=S.res;
  if(res&&!S.busy)kids.push(h('div',{class:'cschecks'},...(res.ok?[h('div',{class:'ok'},'✓ The cell made it through the whole day!'),res.waste?h('div',{class:'warn'},`It works, but you paid for ${res.waste} extra part${res.waste>1?'s':''} it did not need.`):null]
    :res.fails.map(f=>h('div',{class:'no'+(S.failParts.includes(f)?' first':'')},'✗ ',f.msg)))));
  return kids;
}

ngDef({key:'cell',name:'Cell Shop',ic:'cell',std:'MS-LS1-1 · LS1-2',subj:'life',winDelay:700,
  short:'Build a cell with the right parts for its job.',menuDesc:'A job order comes in. Drag organelles into the cell, then run a day and watch sunlight, sugar and energy flow through it.',
  intro:'Orders are coming in for cells with special jobs. Drag the right organelles into each cell, then run a day and watch it work. A missing part, or a part the cell should not have, stops the day at that step. Build it right the first time, with no extra parts, for 3 stars.',
  how:['**Read the job order.** Every line is a clue about which parts the cell needs.','**Drag parts** from the shelf into the cell (or tap a part, then tap the cell). Tap a part in the cell to take it out.','Press **Run a day**. Fix what failed. Right on the first run, with no extras, earns 3 ★.'],
  levels:CS_LEVELS,packs:CS_PACKS,cap3:true,
  mini:L=>{const w=L.kind==='plant'||L.kind==='fungus'||L.kind==='bact';return svgEl(`<svg viewBox="0 0 40 30" width="44" height="34" aria-hidden="true">${L.kind==='bact'?'<rect x="4" y="9" width="32" height="13" rx="6.5" fill="#e6f5fc" stroke="#5c9a3a" stroke-width="2.4"/>':w?'<rect x="4" y="3" width="32" height="24" rx="4" fill="#e6f5fc" stroke="#5c9a3a" stroke-width="2.6"/>':'<ellipse cx="20" cy="15" rx="16" ry="12" fill="#e6f5fc" stroke="#e7884a" stroke-width="2.4"/>'}${L.kind!=='bact'?'<circle cx="15" cy="13" r="4.5" fill="#d9c6f7" stroke="#8a4fd6" stroke-width="1.8"/>':''}${L.req.chloro?'<ellipse cx="27" cy="19" rx="4" ry="2.6" fill="#7fd08a"/>':''}${L.req.flag?'<path d="M36 15q4-4 6 0" stroke="#c0607a" stroke-width="2" fill="none"/>':''}</svg>`);},
  start(G){G.st={hv:{},res:null,busy:false,el:null,failParts:[],failStage:null};csDragInit();},
  hud(G){return {label:'Runs',val:G.tries,target:'3 ★ = first run, no extra parts'};},
  render(G,main,side){
    const S=G.st,L=G.L,budget=csMin(L)+4,cost=csCost(S.hv);
    if(!S.el||!S.el.svg.isConnected){const b=csBuild(G);
      ngRC(main,h('div',{class:'cswrap'},b),h('div',{class:'fgkey'},'Drag a part into the cell, or tap a part, then tap the cell. Tap a part in the cell to take it out. Keyboard: Enter picks up, arrows choose, Enter drops.'));}
    else if(!S.busy)csStatic(G);
    ngRC(side,...csSide(G));
    if(S.res||S.busy||G.done)return;
    if(!cost)ngSay('Read the job order, then drag parts from the shelf into the cell.');
    else if(cost>budget)ngSay('Over budget! Take out parts the order does not need.','alert');
  },
  hints(G){const L=G.L,need=CS_ORDER.filter(k=>L.req[k]).map(k=>CS_PARTS[k].n+(L.req[k]>1?' ×'+L.req[k]:''));
    return [L.clue,'Is this cell a plant, an animal, a fungus or a bacterium? That tells you which kinds of parts it can have. Count the ⚡ and ☀ marks for how many mitochondria and chloroplasts.','This cell needs: '+need.join(', ')+'. Look for the gold parts on the shelf.'];}
});
NGTHUMB.cell=()=>{
  const P='ct';let t=csDefsMarkup(P)+`<radialGradient id="ctbg" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#effbe2"/><stop offset="1" stop-color="#7fc46a"/></radialGradient>`;
  t+=`<rect width="320" height="180" fill="url(#ctbg)"/><g transform="translate(160 92) scale(.66)"><path d="${rrPath(-174,-120,348,240,24)}" fill="url(#${P}Wall)" stroke="#3f7f26" stroke-width="3"/><path d="${rrPath(-160,-106,320,212,14)}" fill="url(#${P}Cyto)"/><path d="${rrPath(-160,-106,320,212,14)}" fill="none" stroke="#f6b37f" stroke-width="7"/>`+
    `<g transform="translate(52 14)">${CS_ART.vac(P)}</g><g transform="translate(-78 -18)">${CS_ART.nuc(P,40)}</g>`+
    [[-120,62,20],[-124,-76,-25],[8,-84,12]].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})">${CS_ART.mito(P)}</g>`).join('')+
    [[126,-80,15],[130,88,-15],[60,92,8]].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})">${CS_ART.chloro(P).replace(/url\(#csFlag\)/g,'')}</g>`).join('')+`</g>`;
  t+=`<circle cx="160" cy="90" r="150" fill="none" stroke="#0b1430" stroke-opacity=".25" stroke-width="40"/>`+ngStar(290,24,9)+ngStar(30,150,6,'#fff',.8);
  return ngWrap('cell','#1d7a4d',t);
};
