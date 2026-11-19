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
function csDraw(L,hv,glow){
  const W=380,H=260,cx=190,cy=128,wall=hv.wall>0,shape=L.kind==='bact'?'bact':wall?'box':'blob';
  let t='';
  const outline=shape==='bact'?`<rect x="60" y="72" width="260" height="116" rx="58"/>`:shape==='box'?`<rect x="54" y="38" width="272" height="184" rx="16"/>`:`<path d="M190 34C262 30 334 70 330 132S270 228 192 226 46 196 52 128 118 38 190 34z"/>`;
  const inner=shape==='bact'?`<rect x="66" y="78" width="248" height="104" rx="52"/>`:shape==='box'?`<rect x="64" y="48" width="252" height="164" rx="10"/>`:outline;
  if(hv.flag){const fx0=shape==='bact'?320:shape==='box'?326:330;t+=`<path d="M${fx0} 130c18-14 26 14 42 0s22 12 32 2" fill="none" stroke="${CS_PARTS.flag.col}" stroke-width="5" stroke-linecap="round" class="csflag"/>`;}
  if(wall)t+=`<g fill="#cfe8bc" stroke="${CS_PARTS.wall.col}" stroke-width="9">${outline.replace('/>',' />')}</g>`;
  t+=`<g fill="${hv.cyto?'#e6f5fc':'#fff'}" stroke="${hv.mem?CS_PARTS.mem.col:'#d64545'}" stroke-width="${hv.mem?4:3}" ${hv.mem?'':'stroke-dasharray="7 6"'}>${inner}</g>`;
  if(hv.vac)t+=`<ellipse cx="${cx+30}" cy="${cy+10}" rx="${shape==='bact'?40:78}" ry="${shape==='bact'?24:52}" fill="#cfe9fb" stroke="${CS_PARTS.vac.col}" stroke-width="3"/>`;
  if(hv.nuc)t+=`<circle cx="${cx-58}" cy="${cy-14}" r="27" fill="#d9c6f7" stroke="${CS_PARTS.nuc.col}" stroke-width="3.5"/><circle cx="${cx-54}" cy="${cy-16}" r="9" fill="${CS_PARTS.nuc.col}" opacity=".7"/>`;
  else if(L.kind==='bact'&&hv.cyto){t+=`<path d="M${cx-80} ${cy-10}c10-16 26 10 36-4s20 14 34 0" fill="none" stroke="#8a4fd6" stroke-width="2.4" stroke-dasharray="1 0" opacity=".55"/>`;}
  const spots=[[cx-100,cy+40],[cx-40,cy+60],[cx+100,cy-60],[cx-10,cy-62],[cx+120,cy+62],[cx-118,cy-58],[cx+40,cy-70],[cx-70,cy+70]];
  for(let i=0;i<(hv.mito||0);i++){const [x,y]=spots[i];t+=`<g transform="translate(${x} ${y}) rotate(${i*40-20})"><ellipse rx="17" ry="9" fill="#ffd2b0" stroke="${CS_PARTS.mito.col}" stroke-width="2.6"/><path d="M-11 0q3-6 6 0t6 0 6 0" fill="none" stroke="${CS_PARTS.mito.col}" stroke-width="1.8"/></g>`;}
  for(let i=0;i<(hv.chloro||0);i++){const [x,y]=spots[7-i];t+=`<g transform="translate(${x} ${y}) rotate(${i*35+10})"><ellipse rx="16" ry="10" fill="#7fd08a" stroke="${CS_PARTS.chloro.col}" stroke-width="2.6"/><path d="M-9-3h18M-9 3h18" stroke="#2c7a3d" stroke-width="1.6"/></g>`;}
  if(hv.ribo){const r=[[cx-20,cy+20],[cx+8,cy-34],[cx-96,cy+14],[cx+74,cy-26],[cx-30,cy-40],[cx+20,cy+70],[cx-128,cy+20],[cx+140,cy+10]];
    r.forEach(([x,y])=>{if(shape==='bact'&&(y<cy-46||y>cy+46))return;t+=`<circle cx="${x}" cy="${y}" r="3.4" fill="${CS_PARTS.ribo.col}"/>`;});}
  return ngSvg(W,H,(glow?`<rect width="${W}" height="${H}" rx="14" fill="${glow==='ok'?'#e9f9ef':'#fff0f0'}"/>`:'')+t,'ngsvg cssvg','Your cell drawing');
}
ngDef({key:'cell',name:'Cell Shop',ic:'cell',std:'MS-LS1-1 · LS1-2',subj:'life',
  short:'Build a cell with the right parts for its job.',menuDesc:'A job order comes in. Build a cell with the right parts, then run a day to see if it survives.',
  intro:'Orders are coming in for cells with special jobs. Build each cell from the right organelles, then run a day. A cell with a missing part, or a part it should not have, will fail. Build it right the first time, with no extra parts, for 3 stars.',
  how:['**Read the job order.** Every line is a clue about which parts the cell needs.','**Add parts** from the shelf. Watch your cell take shape.','Press **Run a day**. Fix what failed. Right on the first run, with no extras, earns 3 ★.'],
  levels:CS_LEVELS,packs:CS_PACKS,cap3:true,
  mini:L=>{const w=L.kind==='plant'||L.kind==='fungus'||L.kind==='bact';return svgEl(`<svg viewBox="0 0 40 30" width="44" height="34" aria-hidden="true">${L.kind==='bact'?'<rect x="4" y="9" width="32" height="13" rx="6.5" fill="#e6f5fc" stroke="#5c9a3a" stroke-width="2.4"/>':w?'<rect x="4" y="3" width="32" height="24" rx="4" fill="#e6f5fc" stroke="#5c9a3a" stroke-width="2.6"/>':'<ellipse cx="20" cy="15" rx="16" ry="12" fill="#e6f5fc" stroke="#e7884a" stroke-width="2.4"/>'}${L.kind!=='bact'?'<circle cx="15" cy="13" r="4.5" fill="#d9c6f7" stroke="#8a4fd6" stroke-width="1.8"/>':''}${L.req.chloro?'<ellipse cx="27" cy="19" rx="4" ry="2.6" fill="#7fd08a"/>':''}${L.req.flag?'<path d="M36 15q4-4 6 0" stroke="#c0607a" stroke-width="2" fill="none"/>':''}</svg>`);},
  start(G){G.st={hv:{},res:null};},
  hud(G){return {label:'Runs',val:G.tries,target:'3 ★ = first run, no extra parts'};},
  render(G,main,side){
    const L=G.L,S=G.st,hv=S.hv,showF=G.i<3||G.hint>=1,res=S.res,budget=csMin(L)+4,cost=csCost(hv);
    const order=h('div',{class:'csorder'},h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Job order'),
      h('ul',null,...L.jobs.map(j=>h('li',null,j))),h('div',{class:'csbase'},'Every cell also needs the basic parts all cells share.'));
    const checks=res?h('div',{class:'cschecks'},...(res.ok?[h('div',{class:'ok'},'✓ The cell made it through the whole day!'),res.waste?h('div',{class:'warn'},`It works, but you paid for ${res.waste} extra part${res.waste>1?'s':''} it did not need.`):null]
      :res.fails.map(f=>h('div',{class:'no'},'✗ ',f.msg)))):null;
    ngRC(main,h('div',{class:'cswrap'},order,h('div',{class:'cscell'},csDraw(L,hv,res?(res.ok?'ok':'bad'):null),checks)));
    const rows=CS_ORDER.map(k=>{const p=CS_PARTS[k],n=hv[k]||0;
      const ctl=p.multi?h('div',{class:'csq'},ngBtn('−',()=>csSet(k,n-1),'ghost sm',{disabled:n<=0||G.done,'aria-label':'Remove '+p.n}),h('b',null,n),ngBtn('+',()=>csSet(k,n+1),'ghost sm',{disabled:n>=p.multi||G.done,'aria-label':'Add '+p.n}))
        :ngBtn(n?'Remove':'Add',()=>csSet(k,n?0:1),n?'ghost sm':'sm',{disabled:G.done});
      return h('div',{class:'csrow'+(n?' on':'')},h('span',{class:'csdot',style:`background:${p.col}`}),h('div',{class:'csn'},h('b',null,p.n,h('small',null,` ${p.c} coin${p.c>1?'s':''}${p.multi?' each':''}`)),showF?h('small',null,p.f):null),ctl);});
    ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Parts shelf',showF?null:h('small',null,'Hint 1 shows what each part does')),
      h('div',{class:'csshelf'},...rows),
      h('div',{class:'csbudget'+(cost>budget?' over':'')},'Cost ',h('b',null,cost),' / budget ',h('b',null,budget),' coins'),
      ngBtn([I('play'),' Run a day'],csRun,'good',{style:'width:100%;font-size:18px',disabled:G.done||cost>budget||!cost}));
    if(!res&&!G.done){
      if(!cost)ngSay('Read the job order, then add parts from the shelf.');
      else if(cost>budget)ngSay('Over budget! Take out parts the order does not need.','alert');
      else ngSay('When you think your cell can do the whole job, press **Run a day**.');
    }
  },
  hints(G){const L=G.L,need=CS_ORDER.filter(k=>L.req[k]).map(k=>CS_PARTS[k].n+(L.req[k]>1?' ×'+L.req[k]:''));
    return [L.clue,'Is this cell a plant, an animal, a fungus or a bacterium? That tells you which kinds of parts it can have. Count the ⚡ and ☀ marks for how many mitochondria and chloroplasts.','This cell needs: '+need.join(', ')+'.'];}
});
function csSet(k,n){if(!G||G.done)return;G.st.hv[k]=Math.max(0,n);if(!G.st.hv[k])delete G.st.hv[k];G.st.res=null;ngRender();}
function csRun(){
  if(!G||G.done)return;const L=G.L,r=csJudge(L,G.st.hv);if(ngT())return ngTDone(r.ok?(r.waste?.75:1):0);G.tries++;G.st.res=r;
  if(r.ok){ngRender();ngSay(r.waste?'It survived! Next time leave out the extra parts.':'Perfect cell! It did every job.','go');
    const score=(G.tries-1)+r.waste;G.detail={runs:G.tries,waste:r.waste};
    ngWin(ngStars(score,0,2),['Your cell worked after ',h('b',null,G.tries),` run${G.tries>1?'s':''}`,r.waste?` with ${r.waste} extra part${r.waste>1?'s':''}.`:' with no extra parts.']);}
  else{G.miss++;ngRender();ngSay(r.fails[0].msg+(r.fails.length>1?` (${r.fails.length} problems in all)`:''),'alert');fx.pop({icon:'cell',text:'The cell failed',kind:'oops'});}
}
NGTHUMB.cell=()=>{
  let t=`<rect x="58" y="22" width="204" height="138" rx="18" fill="#cfe8bc" stroke="#2f7a2a" stroke-width="9"/><rect x="70" y="34" width="180" height="114" rx="10" fill="#e6f5fc" stroke="#e7884a" stroke-width="4"/>`+
    `<ellipse cx="190" cy="98" rx="52" ry="36" fill="#cfe9fb" stroke="#6fb8e8" stroke-width="3"/><circle cx="118" cy="76" r="24" fill="#d9c6f7" stroke="#8a4fd6" stroke-width="4"/><circle cx="122" cy="74" r="8" fill="#8a4fd6" opacity=".7"/>`;
  [[110,128,-20],[226,52,30],[150,52,10]].forEach(([x,y,r])=>{t+=`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="17" ry="9" fill="#ffd2b0" stroke="#f08a3e" stroke-width="3"/></g>`;});
  [[230,128,20],[96,112,-10],[176,46,-30]].forEach(([x,y,r])=>{t+=`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="15" ry="9" fill="#7fd08a" stroke="#2c7a3d" stroke-width="2.6"/></g>`;});
  t+=`<rect x="236" y="6" width="74" height="30" rx="8" fill="#f6efe0"/><text x="273" y="27" text-anchor="middle" font-family="system-ui,Arial" font-weight="800" font-size="15" fill="#14824a">ORDER</text>`+ngStar(30,30,9)+ngStar(292,156,6,'#f6efe0',.7);
  return ngWrap('cell','#1d7a4d',t);
};
