/* ================= EARTH 2: DEEP TIME (MS-ESS1-4, LS4-1) =================
   Read a rock cross-section like a geologist. Put the events in order from oldest to youngest
   using superposition, original horizontality and cross-cutting relationships. Every wrong check
   points at the clue you missed. */
const ST_ROCK={sand:['#e8c37a','Sandstone'],shale:['#8f8a80','Shale'],lime:['#c9d3dc','Limestone'],cong:['#b98b5e','Conglomerate'],silt:['#c7a98a','Siltstone'],coal:['#45403b','Coal']};
const STF={tri:'🦐',fish:'🐟',fern:'🌿',dino:'🦖',mam:'🦣',shell:'🐚'};
let stUid=0;
function stDefs(u){return `<defs>
<pattern id="pd${u}" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#000" opacity=".25"/><circle cx="7" cy="8" r="1" fill="#000" opacity=".25"/></pattern>
<pattern id="ph${u}" width="16" height="8" patternUnits="userSpaceOnUse"><path d="M1 4h8" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/></pattern>
<pattern id="pb${u}" width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0 0h24M0 12h24M12 0v6M0 6h24M6 6v6M18 6v6" stroke="#000" stroke-opacity=".2" fill="none"/></pattern>
<pattern id="pc${u}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="10" cy="10" r="2" fill="none" stroke="#000" stroke-opacity=".3"/></pattern>
<pattern id="pm${u}" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M2 2l3 3M8 7l2 3M3 9l2-2" stroke="#fff" stroke-opacity=".45" stroke-width="1.4"/></pattern>
</defs>`;}
const ST_PAT={sand:'pd',shale:'ph',lime:'pb',cong:'pc',silt:'pd',coal:'ph'};
/* one flat band: [letter, rock, y0, y1, fossil] */
function stBand(u,b,x0,x1,hl){const [id,rock,y0,y1,fos]=b,c=ST_ROCK[rock][0];
  let t=`<g class="stf" data-f="${id}"><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="${c}"/><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="url(#${ST_PAT[rock]}${u})"/><line x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}" stroke="#4a3d30" stroke-opacity=".5"/>`;
  if(fos)t+=`<text x="${(x0+x1)/2+40}" y="${(y0+y1)/2+8}" font-size="20" text-anchor="middle">${STF[fos]}</text>`;
  return t+`</g>`;}
const stLabel=(id,x,y)=>`<g class="stlab"><circle cx="${x}" cy="${y}" r="12" fill="#fff" stroke="#1b2433" stroke-width="2"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="900" fill="#1b2433">${id}</text></g>`;
/* spec: {low:[bands], tilt:deg, ero:y, up:[bands], fault:{x0,x1,d,top}, dike:{x,w,top}, dikeCut:bool} */
function stDike(u,d,H){const p=`M${d.x} ${H}L${d.x+d.w} ${H}L${d.x+d.w+8} ${d.top+30}L${d.x+d.w-4} ${d.top}L${d.x+6} ${d.top}L${d.x-6} ${d.top+40}Z`;return `<g class="stf" data-f="${d.id}"><path d="${p}" fill="#b8402a"/><path d="${p}" fill="url(#pm${u})"/></g>`;}
function stDraw(spec){
  const u='s'+(++stUid),W=460,H=280;let t=stDefs(u)+`<rect width="${W}" height="${H}" fill="#9ccbe8"/><rect y="0" width="${W}" height="18" fill="#b7e0f5"/>`;
  let cut='';
  (spec.low||[]).forEach((b,i)=>{const bb=b.slice();if(i===0&&spec.fault)bb[2]=Math.min(bb[2],20);if(i===0&&spec.tilt)bb[2]-=300;if(i===spec.low.length-1)bb[3]+=160;cut+=stBand(u,bb,-260,W+260);});
  if(spec.dike&&spec.dikeCut){const d=spec.dike;cut+=`<g class="stf" data-f="${d.id}"><path d="M${d.x} ${H+60}L${d.x+d.w} ${H+60}L${d.x+d.w+8} ${d.top+30}L${d.x+d.w-4} ${d.top}L${d.x+6} ${d.top}L${d.x-6} ${d.top+40}Z" fill="#b8402a"/><path d="M${d.x} ${H+60}L${d.x+d.w} ${H+60}L${d.x+d.w+8} ${d.top+30}L${d.x+d.w-4} ${d.top}L${d.x+6} ${d.top}L${d.x-6} ${d.top+40}Z" fill="url(#pm${u})"/></g>`;}
  if(spec.tilt)cut=`<g transform="rotate(${spec.tilt} 230 ${spec.pivot||spec.ero||140})">${cut}</g>`;
  if(spec.fault){const f=spec.fault;
    t+=`<clipPath id="cl${u}"><path d="M-10 -10H${f.x0}L${f.x1} ${H+10}H-10Z"/></clipPath><clipPath id="cr${u}"><path d="M${f.x0} -10H${W+10}V${H+10}H${f.x1}Z"/></clipPath>`;
    t+=`<g clip-path="url(#cl${u})">${cut}</g><g clip-path="url(#cr${u})"><g transform="translate(0 ${f.d})">${cut}</g></g>`;
  }else if(spec.ero){t+=`<clipPath id="ce${u}"><path d="M-10 ${spec.ero}${Array.from({length:12},(_,i)=>`L${i*42} ${spec.ero+(i%2?6:-4)}`).join('')}L${W+10} ${spec.ero}V${H+10}H-10Z"/></clipPath><g clip-path="url(#ce${u})">${cut}</g>`;}
  else t+=cut;
  if(spec.ero){t+=`<g class="stf" data-f="ero"><path d="M-10 ${spec.ero}${Array.from({length:12},(_,i)=>`L${i*42} ${spec.ero+(i%2?6:-4)}`).join('')}L${W+10} ${spec.ero}" fill="none" stroke="#5a2f12" stroke-width="3.5"/></g>`;}
  if(spec.fault){const f=spec.fault;t+=`<g class="stf" data-f="${f.id}"><line x1="${f.x0}" y1="${f.top}" x2="${f.x1}" y2="${H}" stroke="#2a1a10" stroke-width="3.5"/><path d="M${f.x0+(f.x1-f.x0)*.55+12} ${f.top+(H-f.top)*.55}l0 22m-5-6 5 6 5-6M${f.x0+(f.x1-f.x0)*.55-12} ${f.top+(H-f.top)*.55+22}l0-22m-5 6 5-6 5 6" stroke="#2a1a10" stroke-width="2" fill="none"/></g>`;}
  if(spec.dike&&!spec.dikeCut&&!(spec.dike.cuts||[]).length)t+=stDike(u,spec.dike,H);
  const cutsUp=(spec.dike&&spec.dike.cuts)||[];
  (spec.up||[]).filter(b=>cutsUp.includes(b[0])).forEach(b=>{t+=stBand(u,b,-10,W+10);});
  if(spec.dike&&!spec.dikeCut&&cutsUp.length)t+=stDike(u,spec.dike,H);
  (spec.up||[]).filter(b=>!cutsUp.includes(b[0])).forEach(b=>{t+=stBand(u,b,-10,W+10);});
  let labs=(spec.labels||[]).slice();
  if(spec.tilt){const lowIds=(spec.low||[]).map(b=>b[0]),a=spec.tilt*Math.PI/180,px=230,py=spec.pivot||spec.ero||140,top=(spec.ero||18)+16;labs=labs.filter(l=>!lowIds.includes(l[0]));
    (spec.low||[]).forEach((b,i)=>{const ym=i===spec.low.length-1?b[2]+40:(b[2]+b[3])/2;
      for(let x=-40;x<=520;x+=10){const dx=x-px,dy=ym-py,X=px+dx*Math.cos(a)-dy*Math.sin(a),Y=py+dx*Math.sin(a)+dy*Math.cos(a);
        if(X>40&&X<420&&Y>top&&Y<H-16&&!(spec.dike&&X>spec.dike.x-20&&X<spec.dike.x+spec.dike.w+20)){labs.push([b[0],X,Y]);break;}}});}
  labs.forEach(([id,x,y])=>{t+=stLabel(id,x,y);});
  return ngSvg(W,H,t,'ngsvg stsvg','Cross-section of rock layers');
}
const SE=(id,txt,why)=>({id,txt,why});
const seL=(id,rock,where)=>SE(id,`Layer ${id} (${ST_ROCK[rock][1].toLowerCase()}) is laid down`,`Layer ${id} sits ${where}. In undisturbed rock, lower layers were laid down first and are older.`);
const STL=(name,story,spec,events,o)=>Object.assign({name,story,spec,events},o);
const ST_LEVELS=[
  STL('Layer Cake','A road cut shows three rock layers.',{low:[['C','lime',18,100],['B','shale',100,185],['A','sand',185,300]],labels:[['C',30,60],['B',30,142],['A',30,232]]},
    [seL('A','sand','at the bottom'),seL('B','shale','in the middle'),seL('C','lime','on top')],
    {intro:'Drag the order with the ▲ ▼ buttons. The **oldest** event goes at the **bottom** of the list, just like the oldest rock is at the bottom.',
     fact:'This rule is called the Law of Superposition: in undisturbed layers, the oldest rock is at the bottom and the youngest is on top.',
     clue:'Sediment piles up like laundry in a basket: the first thing in ends up at the bottom.'}),
  STL('Fossil Layers','Each layer holds different fossils.',{low:[['D','silt',18,80,'mam'],['C','sand',80,140,'dino'],['B','shale',140,205,'fish'],['A','lime',205,300,'tri']],labels:[['D',30,50],['C',30,110],['B',30,172],['A',30,242]]},
    [SE('A','Layer A forms with trilobite fossils','Layer A is the lowest layer, so its trilobites are the oldest fossils here.'),SE('B','Layer B forms with fish fossils','Layer B is just above A.'),SE('C','Layer C forms with dinosaur fossils','Layer C is above B.'),SE('D','Layer D forms with mammoth fossils','Layer D is on top, so its fossils are the youngest.')],
    {fact:'Fossils in lower layers are older than fossils in higher layers. This is how scientists know trilobites lived long before dinosaurs, and dinosaurs long before mammoths.',
     clue:'The deeper the layer, the older the fossils inside it.'}),
  STL('Tipped Over','These layers are tilted, not flat.',{low:[['C','lime',-80,95],['B','shale',95,175],['A','sand',175,380]],tilt:-18,pivot:150,labels:[['C',120,60],['B',190,130],['A',230,230]]},
    [seL('A','sand','lowest in the tilted stack'),seL('B','shale','in the middle of the stack'),seL('C','lime','at the top of the stack'),SE('T','Forces in the crust tilt the layers','Sediment always settles in FLAT layers. If layers are tilted, the tilting happened AFTER all of them were laid down.')],
    {intro:'Sediment always settles in **flat** layers.',fact:'Layers are always laid down flat (original horizontality). Tilted or folded layers were moved later by forces inside Earth.',
     clue:'Could the layers have been laid down tilted? Or were they flat first?'}),
  STL('The Fault','A crack has moved part of the rock.',{low:[['C','lime',60,120],['B','shale',120,190],['A','sand',190,330]],up:[['D','cong',18,60]],fault:{id:'F',x0:250,x1:310,d:30,top:60},labels:[['D',30,40],['C',30,90],['B',30,155],['A',30,240]]},
    [seL('A','sand','at the bottom'),seL('B','shale','above A'),seL('C','lime','above B'),SE('F','A fault cracks and moves the rock','The fault breaks layers A, B and C, so it is younger than them. It does NOT break layer D, so it is older than D.'),seL('D','cong','on top, unbroken')],
    {intro:'A **fault** is a crack where rock has moved. Something that cuts across rock must be **younger** than the rock it cuts.',
     fact:'This is the Law of Cross-Cutting Relationships: a fault or an intrusion is younger than the rocks it cuts through.',
     clue:'Which layers does the fault break? Which layer is NOT broken?'}),
  STL('Magma Rising','A band of dark igneous rock cuts upward through the layers.',{low:[['D','silt',60,115],['C','lime',115,170],['B','shale',170,225],['A','sand',225,320]],up:[['E','sand',18,60]],dike:{id:'I',x:220,w:34,top:60},labels:[['E',30,40],['D',30,88],['C',30,142],['B',30,197],['A',30,262]]},
    [seL('A','sand','at the bottom'),seL('B','shale','above A'),seL('C','lime','above B'),seL('D','silt','above C'),SE('I','Magma pushes up and cools into rock (the red band)','The magma cuts through A to D, so it came after them. It stops under E, so E formed later.'),seL('E','sand','on top, not cut')],
    {intro:'The red band is an **intrusion**: magma that squeezed up through cracks and cooled.',
     fact:'Magma that pushes into older rock and cools is called an intrusion. Like a fault, it is younger than every layer it cuts.',
     clue:'Look at the top of the red band. Which layer does it stop under?'}),
  STL('Fault vs Magma','Both a fault and an intrusion. Which came first?',{low:[['C','lime',60,130],['B','shale',130,200],['A','sand',200,330]],up:[['D','silt',18,60]],dike:{id:'I',x:262,w:34,top:60},dikeCut:true,fault:{id:'F',x0:250,x1:320,d:34,top:60},labels:[['D',30,40],['C',30,95],['B',30,165],['A',30,250]]},
    [seL('A','sand','at the bottom'),seL('B','shale','above A'),seL('C','lime','above B'),SE('I','Magma pushes up and cools (the red band)','The red band cuts A, B and C. Look closely at the fault: does it break the red band too?'),SE('F','A fault cracks and moves the rock','The fault cuts the layers AND the red band, so the fault is the younger of the two.'),seL('D','silt','on top, not broken')],
    {fact:'If one cross-cutting feature cuts another, the one doing the cutting is younger. Geologists use this to untangle complicated histories.',
     clue:'The fault moved the bottom of the red band. Could it move something that was not there yet?'}),
  STL('Missing Time','A wavy line separates tilted layers from flat ones.',{low:[['C','lime',115,170],['B','shale',170,230],['A','sand',230,380]],tilt:-15,ero:150,up:[['E','silt',18,85],['D','cong',85,150]],labels:[['E',30,52],['D',30,118]]},
    [seL('A','sand','lowest in the tilted stack'),seL('B','shale','in the middle of the tilted stack'),seL('C','lime','at the top of the tilted stack'),SE('T','Forces tilt layers A, B and C','They were laid down flat, so the tilting came after them.'),SE('R','Erosion wears the tilted layers flat (the wavy line)','The wavy line cuts off the tops of the tilted layers, so erosion came after the tilting.'),seL('D','cong','flat, just above the wavy line'),seL('E','silt','flat, on top')],
    {intro:'The wavy line is an **erosion surface**: a time when rock was worn away instead of laid down.',
     fact:'An erosion surface between rock layers is called an unconformity. It marks missing time: rock that was worn away and is gone.',
     clue:'Tilted layers first, then tilting, then erosion, then new flat layers on top.'}),
  STL('Fossil Timeline','A tall cliff holds a long fossil record.',{low:[['E','silt',18,70,'mam'],['D','sand',70,120,'dino'],['C','coal',120,165,'fern'],['B','shale',165,215,'fish'],['A','lime',215,300,'shell']],labels:[['E',30,44],['D',30,95],['C',30,142],['B',30,190],['A',30,256]]},
    [SE('A','Simple sea animals with shells live (layer A)','Layer A is at the bottom: the oldest life in this cliff.'),SE('B','Fish live (layer B)','Layer B is above A.'),SE('C','Fern forests grow and become coal (layer C)','Layer C is above B.'),SE('D','Dinosaurs live (layer D)','Layer D is above C.'),SE('E','Mammoths live (layer E)','Layer E is on top: the youngest life here.')],
    {fact:'The fossil record shows that life on Earth has changed over time. Older layers hold simpler life forms; younger layers hold life more like today’s.',
     clue:'Use superposition on the fossils: lower layer, older life.'}),
  STL('Canyon Challenge','A canyon wall with a long, tricky history.',{low:[['B','shale',150,215],['A','sand',215,380]],tilt:-14,ero:175,up:[['E','lime',18,70],['D','silt',70,120],['C','cong',120,175]],dike:{id:'I',x:330,w:30,top:70,cuts:['C','D']},labels:[['E',30,44],['D',30,95],['C',30,148],['B',70,215],['A',200,250]]},
    [seL('A','sand','lowest in the tilted stack'),seL('B','shale','above A in the tilted stack'),SE('T','Forces tilt layers A and B','They were laid down flat, so the tilting came after them.'),SE('R','Erosion wears the tilted layers flat (the wavy line)','The wavy line cuts across the tilted layers.'),seL('C','cong','just above the wavy line'),seL('D','silt','above C'),SE('I','Magma pushes up and cools (the red band)','The red band cuts C and D but stops under E.'),seL('E','lime','on top, not cut')],
    {fact:'The Grand Canyon shows almost 2 billion years of Earth’s history, including tilted layers, erosion surfaces and intrusions, all read with these same rules.',
     clue:'Work from the bottom up. Each feature that cuts or wears away rock is younger than the rock it affects.'})
];
const ST_PACKS={0:'Pack 1: Superposition',3:'Pack 2: Cross-cutting',6:'Pack 3: Missing time'};
function stShuffle(L){const ids=L.events.map(e=>e.id),n=ids.length,out=[];for(let k=0;k<n;k++)out.push(ids[(k*3+1)%n]);
  if(new Set(out).size!==n)return ids.slice().reverse();if(out.join()===ids.join())out.reverse();return out;}
ngDef({key:'strata',name:'Deep Time',ic:'layers',std:'MS-ESS1-4 · LS4-1',subj:'earth',cap3:true,
  short:'Read rock layers to put Earth’s history in order.',menuDesc:'Read rock layers, faults and fossils like a geologist, then put Earth’s history in order.',
  intro:'Rock layers are a history book. Use the geologist’s rules (superposition, flat layers and cross-cutting) to put each event in order from oldest to youngest. Get it right on the first check for 3 stars.',
  how:['**Study the cross-section.** Letters label the layers.','**Order the events** with ▲ ▼: oldest at the bottom, youngest at the top.','Press **Check my order**. A wrong order points to the clue you missed.'],
  levels:ST_LEVELS,packs:ST_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true">${(L.spec.up||[]).concat(L.spec.low).map((b,i,a)=>`<rect x="2" y="${2+i*26/a.length}" width="40" height="${26/a.length}" fill="${ST_ROCK[b[1]][0]}"/>`).join('')}${L.spec.dike?'<rect x="22" y="8" width="5" height="20" fill="#b8402a"/>':''}${L.spec.fault?'<line x1="28" y1="6" x2="34" y2="28" stroke="#2a1a10" stroke-width="2"/>':''}</svg>`),
  start(G){G.st={order:stShuffle(G.L),bad:null,ok:false,msg:null,sel:null};},
  hud(G){return {label:'Checks',val:G.tries,target:'3 ★ = right on the first check'};},
  render(G,main,side){
    const L=G.L,S=G.st,ev=id=>L.events.find(e=>e.id===id),n=S.order.length;
    const svg=stDraw(L.spec);
    if(S.sel)svg.querySelectorAll(`.stf[data-f="${S.sel==='R'?'ero':S.sel}"]`).forEach(x=>x.classList.add('hl'));
    ngRC(main,svg);
    const mv=(k,d)=>{const o=S.order,j=k+d;if(j<0||j>=n||S.ok||G.done)return;[o[k],o[j]]=[o[j],o[k]];S.bad=null;S.msg=null;ngRender();};
    /* show youngest at top: display index 0 = last in history */
    const disp=S.order.slice().reverse();
    const list=h('ol',{class:'stlist',reversed:true},...disp.map((id,di)=>{const k=n-1-di,e=ev(id),bad=S.bad&&S.bad[k];
      return h('li',{class:'stcard'+(bad?' bad':'')+(S.ok?' ok':'')+(S.sel===id?' sel':''),onmouseenter:()=>{S.sel=id;main.querySelectorAll('.stf').forEach(x=>x.classList.toggle('hl',x.dataset.f===(id==='R'?'ero':id)));},onmouseleave:()=>{S.sel=null;main.querySelectorAll('.stf.hl').forEach(x=>x.classList.remove('hl'));}},
        h('span',{class:'stn'},String(k+1)),h('span',{class:'stt'},e.txt),
        h('span',{class:'stmv'},ngBtn('▲',()=>mv(k,1),'ghost sm',{disabled:k===n-1||S.ok||G.done,'aria-label':'Move later'}),ngBtn('▼',()=>mv(k,-1),'ghost sm',{disabled:k===0||S.ok||G.done,'aria-label':'Move earlier'})));}));
    ngRC(side,h('div',{class:'stend'},'⬆ Youngest (most recent)'),list,h('div',{class:'stend'},'⬇ Oldest (happened first)'),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      S.ok?null:ngBtn('Check my order',stCheck,'good',{style:'width:100%;font-size:17px',disabled:G.done}));
    if(!S.msg&&!S.ok)ngSay('Put the events in order. Point at an event to light it up in the picture.');
  },
  hints(G){const L=G.L,e=L.events;return [L.clue,'Three rules: (1) lower layers are older, (2) layers are laid down flat, so tilting comes later, (3) anything that cuts across rock is younger than the rock it cuts.',`Oldest: "${e[0].txt}". Youngest: "${e[e.length-1].txt}".`];}
});
function stCheck(){
  const L=G.L,S=G.st,ans=L.events.map(e=>e.id);if(S.ok||G.done)return;G.tries++;
  S.bad=S.order.map((id,k)=>id!==ans[k]);
  if(!S.bad.some(Boolean)){S.ok=true;S.msg=['ok','✓ That is the true history of these rocks!'];ngRender();ngSay('You read the rocks like a real geologist!','go');
    stReplay(()=>{G.detail={checks:G.tries};ngWin(ngStars(G.tries-1,0,1),['You got the order right on check ',h('b',null,G.tries),'.']);});return;}
  G.miss++;const k=S.bad.indexOf(true),wrongId=S.order[k],e=L.events.find(x=>x.id===wrongId),should=L.events[k];
  S.msg=['no',`Event ${k+1} (counting up from the oldest) is in the wrong place. You put "${e.txt}" there. ${e.why}`];void should;
  fx.pop({icon:'layers',text:'Not quite',kind:'oops'});ngRender();ngSay('Not quite. The red events are out of order. Read the clue below the list.','alert');
}
function stReplay(done){
  const L=G.L,key=G.key,lv=G.i,ids=L.events.map(e=>e.id);let k=0;const svg=$('ngMain').querySelector('svg');
  const step=()=>{if(!G||G.key!==key||G.i!==lv)return;if(svg)svg.querySelectorAll('.stf').forEach(x=>x.classList.toggle('hl',x.dataset.f===(ids[k]==='R'?'ero':ids[k])));
    k++;if(k<=ids.length&&!matchMedia('(prefers-reduced-motion:reduce)').matches)setTimeout(step,420);else{if(svg)svg.querySelectorAll('.stf.hl').forEach(x=>x.classList.remove('hl'));done();}};
  step();
}
NGTHUMB.strata=()=>{
  let t='';const cols=['#c7a98a','#e8c37a','#8f8a80','#c9d3dc','#b98b5e'];
  cols.forEach((c,i)=>{t+=`<rect x="0" y="${36+i*29}" width="320" height="29" fill="${c}"/>`;});
  t+=`<path d="M0 36h320" stroke="#4a3d30" opacity=".5"/><path d="M196 36L236 180" stroke="#2a1a10" stroke-width="4"/><path d="M98 180L104 70l14-6 4 116z" fill="#b8402a"/>`+
    `<text x="40" y="148" font-size="24">🦐</text><text x="250" y="92" font-size="22">🦖</text><text x="150" y="122" font-size="22">🐟</text>`+
    `<rect x="0" y="0" width="320" height="36" fill="#7ab8e0"/>`+ngStar(296,18,8)+ngStar(30,16,6,'#f6efe0',.8);
  return ngWrap('strata','#7a5a3a',t);
};
