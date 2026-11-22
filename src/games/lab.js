/* ================= GAME 3: COMPOUND LAB: "Build with real atoms" (Session 10) =================
   Click an element (or drag it) to drop an atom into the lab. Drag atoms onto each other to bond.
   Every atom has bonding hands (H 1, O 2, N 3, C 4 ...). A full atom refuses more bonds and the new
   atom jiggles off with the reason. When the atoms add up to a real compound it snaps into its real
   shape (water bends, carbon dioxide is a straight line). Combine checks the atom counts, the same
   check as before: 10 compounds, 3/2/1 points, 2 hints, TEST_SET.lab, same records.
   After compound 10 (not in tests): a 60 s Combo Rush bonus (not part of the score). */

/* ---------- molecule kit (shared with Balance It) ---------- */
const MK_VAL={H:[1],F:[1],Cl:[1],Br:[1],I:[1],Li:[1],Na:[1],K:[1],O:[2],S:[2,4,6],Mg:[2],Ca:[2],Be:[2],Zn:[2],Cu:[1,2],
  N:[3],P:[3,5],B:[3],Al:[3],Fe:[2,3],C:[4],Si:[4]};
function mkVals(s){if(MK_VAL[s])return MK_VAL[s];const e=BYSYM[s];if(!e)return [1];const g=e.group;
  return g===18?[0]:g===1?[1]:g===2?[2]:g===13?[3]:g===14?[4]:g===15?[3]:g===16?[2]:g===17?[1]:(e.cat==='lanthanide'||e.cat==='actinide')?[3]:[2];}
const mkMax=s=>Math.max(...mkVals(s));
const mkMetal=s=>{const c=(BYSYM[s]||{}).cat;return c==='alkali'||c==='alkaline'||c==='transition'||c==='post'||c==='lanthanide'||c==='actinide';};
function mkLP(s,bs){if(mkMetal(s)||s==='H')return 0;const g=(BYSYM[s]||{}).group||14;const ve=g>=13?g-10:g;return Math.max(0,Math.floor((ve-bs)/2));}
function mkR(s){if(s==='H')return 15;const p=(BYSYM[s]||{}).period||2;return p<=2?21:p===3?25:27;}
const MK_HANDS=['no','1','2','3','4','5','6'];
const mkName=s=>(BYSYM[s]||{name:s}).name;
function mkHex(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(c.slice(i,i+2),16));}
function mkMix(c,t,a){const A=mkHex(c),B=mkHex(t);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*a).toString(16).padStart(2,'0')).join('');}
function mkCol(s){if(ATOMC[s])return ATOMC[s];const e=BYSYM[s];const c=e&&CATS[e.cat]?CATS[e.cat][1]:'#c9d3e6';return [c,'#14193a'];}
/* one shared, always-rendered <defs> (gradients inside a display:none screen don't paint in Chrome) */
function mkDefs(){let d=document.getElementById('mkdefs');if(d)return d.firstChild;
  d=document.createElementNS('http://www.w3.org/2000/svg','svg');d.id='mkdefs';d.setAttribute('aria-hidden','true');
  d.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden;pointer-events:none');
  d.innerHTML='<defs><radialGradient id="mkHalo"><stop offset="0" stop-color="#7dffb5" stop-opacity=".34"/><stop offset=".7" stop-color="#3ddc84" stop-opacity=".12"/><stop offset="1" stop-color="#3ddc84" stop-opacity="0"/></radialGradient>'+
    '<linearGradient id="mkStick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef2fb"/><stop offset="1" stop-color="#9aa6c4"/></linearGradient></defs>';
  document.body.append(d);return d.firstChild;}
function mkGrad(s){const id='mkg-'+s.replace(/[^A-Za-z]/g,'');if(!document.getElementById(id)){const c=mkCol(s)[0];
  const g=document.createElementNS('http://www.w3.org/2000/svg','radialGradient');g.id=id;
  [['cx','.5'],['cy','.5'],['r','.6'],['fx','.33'],['fy','.28']].forEach(([k,v])=>g.setAttribute(k,v));
  g.innerHTML=`<stop offset="0" stop-color="${mkMix(c,'#ffffff',.62)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${mkMix(c,'#000000',.42)}"/>`;
  mkDefs().append(g);}return id;}
/* a glossy 3D atom ball (SVG markup, centred on 0,0) */
function mkBall(s,r){r=r||mkR(s);const id=mkGrad(s),tc=mkCol(s)[1],fs=Math.round(r*(s.length>1?.82:.98));
  return `<circle r="${r}" fill="url(#${id})" stroke="rgba(10,14,40,.35)" stroke-width="1.2"/>`+
    `<ellipse cx="${(-r*.33).toFixed(1)}" cy="${(-r*.4).toFixed(1)}" rx="${(r*.36).toFixed(1)}" ry="${(r*.2).toFixed(1)}" fill="#fff" opacity=".6" transform="rotate(-32 ${(-r*.33).toFixed(1)} ${(-r*.4).toFixed(1)})"/>`+
    (r>=11?`<text y="${(fs*.36).toFixed(1)}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="${tc}" font-family="system-ui,sans-serif" style="pointer-events:none">${s}</text>`:'');}
/* tiny SMILES-like structures: atoms, ( ) branches, = and # bonds, . separates ions */
function mkParse(sm){const atoms=[],bonds=[],stack=[];let prev=-1,ord=1,i=0;
  while(i<sm.length){const c=sm[i];
    if(c==='('){stack.push(prev);i++;continue;} if(c===')'){prev=stack.pop();i++;continue;}
    if(c==='='){ord=2;i++;continue;} if(c==='#'){ord=3;i++;continue;} if(c==='.'){prev=-1;i++;continue;}
    const s=/^[A-Z][a-z]?/.exec(sm.slice(i))[0];i+=s.length;const k=atoms.push(s)-1;
    if(prev>=0)bonds.push([prev,k,ord]);ord=1;prev=k;}
  return {atoms,bonds};}
const MK_SM={'Water':'O(H)H','Carbon dioxide':'C(=O)=O','Sodium chloride':'NaCl','Oxygen gas':'O=O','Hydrogen gas':'HH','Nitrogen gas':'N#N',
  'Carbon monoxide':'C#O','Hydrogen chloride':'HCl','Magnesium oxide':'Mg=O','Silicon dioxide':'Si(=O)=O','Ammonia':'N(H)(H)H','Hydrogen sulfide':'S(H)H',
  'Potassium chloride':'KCl','Methane':'C(H)(H)(H)H','Hydrogen peroxide':'O(H)OH','Ozone':'O(=O)O','Sulfur dioxide':'S(=O)=O','Sodium hydroxide':'O(Na)H',
  'Calcium chloride':'Ca(Cl)Cl','Calcium carbonate':'C(=O)(O)OCa','Iron(III) oxide':'O(Fe=O)Fe=O','Nitric acid':'N(=O)(O)OH','Aluminum oxide':'O(Al=O)Al=O',
  'Sodium bicarbonate':'C(=O)(ONa)OH','Propane':'C(H)(H)(C(H)(H)H)C(H)(H)H','Ethanol':'C(H)(H)(C(H)(H)H)OH','Acetic acid':'C(=O)(C(H)(H)H)OH',
  'Sulfuric acid':'S(=O)(=O)(OH)OH','Calcium oxide':'Ca=O','Chlorine gas':'ClCl','Potassium iodide':'KI','Sodium fluoride':'NaF','Magnesium chloride':'Mg(Cl)Cl',
  'Nitrogen dioxide':'N(=O)O','Nitrous oxide':'N(#N)O','Zinc oxide':'Zn=O','Aluminum chloride':'Al(Cl)(Cl)Cl','Sulfur trioxide':'S(=O)(=O)=O',
  'Carbonic acid':'C(=O)(OH)OH','Phosphoric acid':'P(=O)(OH)(OH)OH','Calcium hydroxide':'Ca(OH)OH','Ammonium nitrate':'N(H)(H)(H)H.N(=O)(O)O',
  'Acetylene':'C(H)#CH','Butane':'C(H)(H)(C(H)(H)H)C(H)(H)C(H)(H)H','Ethane':'C(H)(H)(H)C(H)(H)H'};
const MK_EXTRA=[['Nitric oxide','N=O'],['Zinc chloride','Zn(Cl)Cl'],['Potassium chlorate','Cl(=O)(=O)OK'],['Ethene','C(H)(H)=C(H)H'],
  ['Glucose','C(=O)(H)C(H)(OH)C(H)(OH)C(H)(OH)C(H)(OH)C(H)(H)OH'],['Hydrogen fluoride','HF'],['Fluorine gas','FF'],['Iodine','II'],['Sodium oxide','O(Na)Na'],['Potassium hydroxide','O(K)H'],['Lithium chloride','LiCl']];
const mkKey=c=>Object.keys(c).filter(k=>c[k]>0).sort().map(k=>k+c[k]).join('');
let MK_CAT=null;
function mkCat(){if(MK_CAT)return MK_CAT;MK_CAT={};
  const add=(name,sm,f)=>{const p=mkParse(sm);if(!f){f={};p.atoms.forEach(s=>f[s]=(f[s]||0)+1);}
    const key=mkKey(f);if(MK_CAT[key])return;MK_CAT[key]={name,f,sm,p,ionic:p.atoms.some(mkMetal)||sm.includes('.')};};
  COMPOUNDS.forEach(c=>{if(MK_SM[c.name])add(c.name,MK_SM[c.name],c.f);});
  MK_EXTRA.forEach(([n,sm])=>add(n,sm));return MK_CAT;}
const mkFind=c=>mkCat()[mkKey(c)]||null;
/* bond orders for a tree of single links so every atom uses exactly one of its allowed bond counts (null = can't) */
function mkOrders(syms,edges){const n=syms.length;if(n<2)return null;
  const adj=syms.map(()=>[]);edges.forEach(([a,b],k)=>{adj[a].push([b,k]);adj[b].push([a,k]);});
  const P=[],REC=[],REACH=[],par=new Array(n).fill(-1),pe=new Array(n).fill(-1),order=[],seen=new Array(n).fill(false);
  const st=[0];seen[0]=true;while(st.length){const v=st.pop();order.push(v);adj[v].forEach(([w,k])=>{if(!seen[w]){seen[w]=true;par[w]=v;pe[w]=k;st.push(w);}});}
  if(order.length<n)return null;
  for(let i=n-1;i>=0;i--){const v=order[i],ch=adj[v].filter(([w])=>par[w]===v).map(([w])=>w);
    let reach=new Map([[0,[]]]);
    ch.forEach(c=>{const nx=new Map();reach.forEach((pick,sum)=>P[c].forEach(o=>{const s2=sum+o;if(!nx.has(s2))nx.set(s2,pick.concat([[c,o]]));}));reach=nx;});
    REACH[v]=reach;P[v]=[];REC[v]={};
    mkVals(syms[v]).forEach(val=>{if(v===order[0]){if(reach.has(val)&&REC[v].root===undefined)REC[v].root=val;}
      else reach.forEach((pick,sum)=>{const o=val-sum;if(o>=1&&o<=3&&!P[v].includes(o)){P[v].push(o);REC[v][o]=sum;}});});}
  const root=order[0];if(REC[root].root===undefined)return null;
  const ord=new Array(edges.length).fill(1);
  const go=(v,sum)=>{REACH[v].get(sum).forEach(([c,o])=>{ord[pe[c]]=o;go(c,REC[c][o]);});};
  go(root,REC[root].root);return ord;}
/* 2D layout of one connected tree. extra[i] = open hands (or lone pairs) that take up directions too. */
function mkLayout(syms,edges,extra,tight){
  const n=syms.length,adj=syms.map(()=>[]);edges.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const R=syms.map(s=>mkR(s)),pos=syms.map(()=>({x:0,y:0})),stubs=syms.map(()=>[]);
  if(!n)return {pos,stubs};
  const far=s=>{const d=new Array(n).fill(-1),p=new Array(n).fill(-1),q=[s];d[s]=0;
    while(q.length){const v=q.shift();adj[v].forEach(w=>{if(d[w]<0){d[w]=d[v]+1;p[w]=v;q.push(w);}});}
    let b=s;d.forEach((x,i)=>{if(x>d[b])b=i;});return {b,d,p};};
  const A=far(0).b,F=far(A),path=[];for(let v=F.b;v>=0;v=F.p[v])path.push(v);
  const root=path[Math.floor((path.length-1)/2)];
  const size=new Array(n).fill(1),parent=new Array(n).fill(-1),ord=[root],vis=new Array(n).fill(false);vis[root]=true;
  for(let i=0;i<ord.length;i++){const v=ord[i];adj[v].forEach(w=>{if(!vis[w]){vis[w]=true;parent[w]=v;ord.push(w);}});}
  for(let i=n-1;i>0;i--)size[parent[ord[i]]]+=size[ord[i]];
  const kids=v=>adj[v].filter(w=>parent[w]===v).sort((a,b)=>size[b]-size[a]||R[b]-R[a]);
  const bl=(a,b)=>tight?(R[a]+R[b])*.62:R[a]+R[b]+26,rad=d=>d*Math.PI/180;
  const stubMode=!!extra.stub;
  const place=(v,phi,alt,depth)=>{const k=adj[v].length,D=k+extra[v],ch=kids(v),lp=!stubMode&&extra[v]>0;let sl;
    if(v===root){
      sl=D<=1?[0]:D===2?[180,0]:D===3?(k===2?[150,30,-90]:[150,30,-90]):D===4?(k===4?[180,0,-90,90]:k===3?[90,150,30,-90]:k===2?[142,38,-142,-38]:k===1?[0,180,-90,90]:[-90,90,180,0])
        :Array.from({length:D},(_,i)=>-90+i*360/D);
    }else{const back=phi+180;
      sl=D<=1?[]:D===2?[phi]:D===3?[phi+60*alt,phi-60*alt]:D===4?(k===2&&lp?[phi+75*alt]:k===3&&lp?[phi+60*alt,phi-60*alt]:[phi,phi-90*alt,phi+90*alt])
        :Array.from({length:D-1},(_,i)=>back+(i+1)*360/D);}
    ch.forEach((w,i)=>{const a=sl[i]!==undefined?sl[i]:phi+30*(i+1),L=bl(v,w);pos[w]={x:pos[v].x+L*Math.cos(rad(a)),y:pos[v].y+L*Math.sin(rad(a))};place(w,a,-alt,depth+1);});
    stubs[v]=sl.slice(ch.length,ch.length+(extra.stub?extra.stub[v]:0));};
  place(root,0,1,0);
  /* untangle: push apart atoms that are not bonded but too close, keep bonds at length */
  const bonded=new Set(edges.map(([a,b])=>a<b?a+'-'+b:b+'-'+a));
  for(let it=0;it<60;it++){let moved=false;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const dx=pos[j].x-pos[i].x,dy=pos[j].y-pos[i].y,d=Math.hypot(dx,dy)||.01;
      if(bonded.has(i+'-'+j)){const L=bl(i,j),f=(d-L)/d*.25;pos[i].x+=dx*f;pos[i].y+=dy*f;pos[j].x-=dx*f;pos[j].y-=dy*f;continue;}
      const need=tight?(R[i]+R[j])*.9:R[i]+R[j]+8;if(d<need){const f=(need-d)/d*.5;pos[i].x-=dx*f;pos[i].y-=dy*f;pos[j].x+=dx*f;pos[j].y+=dy*f;moved=true;}}
    if(!moved&&it>4)break;}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;pos.forEach((p,i)=>{x0=Math.min(x0,p.x-R[i]);x1=Math.max(x1,p.x+R[i]);y0=Math.min(y0,p.y-R[i]);y1=Math.max(y1,p.y+R[i]);});
  const cx=(x0+x1)/2,cy=(y0+y1)/2;pos.forEach(p=>{p.x-=cx;p.y-=cy;});
  return {pos,stubs,w:x1-x0,h:y1-y0};}
/* layout of a known compound (may be several ions side by side) */
function mkBlueprint(cat,tight){const p=cat.p,n=p.atoms.length,comp=new Array(n).fill(-1);let nc=0;
  const adj=p.atoms.map(()=>[]);p.bonds.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  for(let i=0;i<n;i++)if(comp[i]<0){const q=[i];comp[i]=nc;while(q.length){const v=q.pop();adj[v].forEach(w=>{if(comp[w]<0){comp[w]=nc;q.push(w);}});}nc++;}
  const pos=new Array(n);let x=0;const parts=[];
  for(let c=0;c<nc;c++){const idx=[];comp.forEach((k,i)=>{if(k===c)idx.push(i);});const loc=new Map(idx.map((v,i)=>[v,i]));
    const bs=p.bonds.filter(([a])=>comp[a]===c);const bsum=idx.map(v=>bs.reduce((t,[a,b,o])=>t+(a===v||b===v?o:0),0));
    const L=mkLayout(idx.map(i=>p.atoms[i]),bs.map(([a,b,o])=>[loc.get(a),loc.get(b),o]),idx.map((v,i)=>mkLP(p.atoms[v],bsum[i])),tight);
    parts.push({idx,L});}
  const gap=tight?6:26,tw=parts.reduce((t,q)=>t+q.L.w,0)+gap*(parts.length-1);x=-tw/2;
  parts.forEach(q=>{q.idx.forEach((v,i)=>{pos[v]={x:x+q.L.w/2+q.L.pos[i].x,y:q.L.pos[i].y};});x+=q.L.w+gap;});
  return {pos,bonds:p.bonds,atoms:p.atoms};}
/* a whole molecule as a small SVG (space-filling when tight) for cards and pans */
function mkMolSVG(f,opt){opt=opt||{};const c=typeof f==='string'?parseF(f):f,cat=mkFind(c);let atoms,pos,bonds=[];
  if(cat){const B=mkBlueprint(cat,opt.tight);atoms=B.atoms;pos=B.pos;bonds=B.bonds;}
  else{atoms=[];Object.keys(c).forEach(s=>{for(let i=0;i<c[s];i++)atoms.push(s);});
    pos=atoms.map((s,i)=>{if(!i)return {x:0,y:0};const a=i*2.4,r=Math.sqrt(i)*(opt.tight?15:22);return {x:r*Math.cos(a),y:r*Math.sin(a)};});}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;atoms.forEach((s,i)=>{const r=mkR(s);x0=Math.min(x0,pos[i].x-r);x1=Math.max(x1,pos[i].x+r);y0=Math.min(y0,pos[i].y-r);y1=Math.max(y1,pos[i].y+r);});
  let out='';if(!opt.tight)bonds.forEach(([a,b,o])=>{out+=mkStick(pos[a],pos[b],o,mkMetal(atoms[a])||mkMetal(atoms[b]));});
  atoms.map((s,i)=>i).sort((a,b)=>opt.tight?pos[a].y-pos[b].y:0).forEach(i=>{out+=`<g transform="translate(${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)})">${mkBall(atoms[i])}</g>`;});
  const pad=3,vb=`${(x0-pad).toFixed(1)} ${(y0-pad).toFixed(1)} ${(x1-x0+pad*2).toFixed(1)} ${(y1-y0+pad*2).toFixed(1)}`;
  return {svg:`<svg viewBox="${vb}" class="mkmol" aria-hidden="true">${out}</svg>`,w:x1-x0+pad*2,h:y1-y0+pad*2,inner:out,x0:x0-pad,y0:y0-pad};}
function mkStick(p,q,o,ionic){if(ionic)return `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" class="mkion"/>`;
  const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,offs=o===2?[-4.5,4.5]:o===3?[-7,0,7]:[0];let s='';
  offs.forEach(k=>{const a=`x1="${(p.x+nx*k).toFixed(1)}" y1="${(p.y+ny*k).toFixed(1)}" x2="${(q.x+nx*k).toFixed(1)}" y2="${(q.y+ny*k).toFixed(1)}"`;
    s+=`<line ${a} class="mkst0"/><line ${a} class="mkst1"/>`;});return s;}

/* ---------- Compound Lab ---------- */
let LB=null,lbCells={},lbSeq=0,lbRaf=0,lbDragS=null;
const mkSvgEl=str=>{const t=document.createElement('template');t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg">${str.trim()}</svg>`;return t.content.firstChild.firstChild;};
const LB_W=680,LB_H=360,LB_MAXP=20;
const LB_TRAYS=[['H','C','O','N'],['H','O','Na','Cl'],['H','C','O','S']];
function startLab(){
  stopAll();mkCat();const by=t=>COMPOUNDS.filter(c=>c.t===t),test=tstOn('lab');
  LB={queue:test?TEST_SET.lab():[...sample(by(1),4),...sample(by(2),4),...sample(by(3),2)],i:0,score:0,results:[],test,rushBest:null};
  show('s-lab');$('s-lab').classList.toggle('testing',test);$('s-lab').classList.remove('rushing');$('lbQuit').textContent=test?'Leave test':'Quit';
  if(test)TST.finish=()=>{const right=LB.results.filter(r=>r.ok).length;tstFinish(right/LB.queue.length*100,{right,n:LB.queue.length});};
  lbBuildTable();lbBuildChamber();lbRound();
}
function lbBuildTable(){
  const box=$('lbTable');lbCells={};const grid=h('div',{class:'lbpt'});
  EL.filter(e=>e.period<=5&&e.group).forEach(e=>{
    const b=h('button',{class:'lbel','data-n':e.n,'data-s':e.sym,style:`grid-row:${e.period};grid-column:${e.group};--c:${(CATS[e.cat]||['','#ccd'])[1]}`,
      'aria-label':`${e.name}. Press Enter to drop a${/^[aeiou]/i.test(e.name)?'n':''} ${e.name.toLowerCase()} atom into the lab.`},
      h('span',{class:'n'},e.n),h('span',{class:'s'},e.sym),h('span',{class:'nm'},e.name));
    lbCells[e.sym]=b;grid.append(b);});
  grid.addEventListener('pointerdown',e=>{const b=e.target.closest('.lbel');if(!b||b.disabled||(e.button||0)>0)return;e.preventDefault();lbDragBegin(e,{src:'table',s:b.dataset.s,cell:b});});
  grid.addEventListener('click',e=>{const b=e.target.closest('.lbel');if(b&&e.detail===0&&!b.disabled)lbAdd(b.dataset.s,b);});
  box.replaceChildren(grid);
}
function lbBuildChamber(){
  mkDefs();const ch=$('lbChamber');
  ch.innerHTML=`<svg id="lbSvg" viewBox="0 0 ${LB_W} ${LB_H}" preserveAspectRatio="xMidYMid meet" role="application" aria-label="Lab bench. Atoms you drop in appear here.">
  <defs><radialGradient id="lbBg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#26357a"/><stop offset=".6" stop-color="#151d4c"/><stop offset="1" stop-color="#0b1130"/></radialGradient>
  <pattern id="lbGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(150,180,255,.07)" stroke-width="1"/></pattern></defs>
  <rect x="-600" y="-300" width="${LB_W+1200}" height="${LB_H+600}" fill="#0b1130"/><rect x="-200" y="-60" width="${LB_W+400}" height="${LB_H+120}" fill="url(#lbBg)"/><rect x="-600" y="-300" width="${LB_W+1200}" height="${LB_H+600}" fill="url(#lbGrid)"/>
  <ellipse cx="340" cy="346" rx="300" ry="18" fill="rgba(0,0,0,.25)"/>
  <g id="lbHalos"></g><g id="lbBonds"></g><g id="lbStubs"></g><g id="lbAtoms"></g><g id="lbTags"></g></svg>
  <div class="lbhands" id="lbHands"></div><div class="lbtoast" id="lbToast" role="status" aria-live="polite"></div>
  <div class="lbempty" id="lbEmpty">Click an element to drop an atom in.<br>Drag atoms onto each other to bond them.</div>
  <div class="lbover" id="lbOver" hidden></div>`;
  const svg=$('lbSvg');
  svg.addEventListener('pointerdown',e=>{if((e.button||0)>0)return;const g=e.target.closest('.lbatom');
    if(g){e.preventDefault();lbDragBegin(e,{src:'atom',id:+g.dataset.id,s:g.dataset.s});}
    else if(LB&&LB.sel!=null){const p=lbPt(e.clientX,e.clientY);lbMoveLoose(LB.sel,p);lbSelect(null);}});
  svg.addEventListener('keydown',e=>{const g=e.target.closest&&e.target.closest('.lbatom');if(!g||!LB)return;const id=+g.dataset.id;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();lbTap(id);}
    else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();lbRemove(id);}
    else if(e.key==='Escape'){lbSelect(null);}});
}
function lbPt(cx,cy){const s=$('lbSvg'),m=s&&s.getScreenCTM();if(!m)return {x:0,y:0};const p=new DOMPoint(cx,cy).matrixTransform(m.inverse());return {x:p.x,y:p.y};}
function lbScr(x,y){const s=$('lbSvg'),m=s&&s.getScreenCTM();if(!m)return {x:-99,y:-99};const p=new DOMPoint(x,y).matrixTransform(m);return {x:p.x,y:p.y};}
function lbInside(cx,cy){const r=$('lbChamber').getBoundingClientRect();return cx>=r.left&&cx<=r.right&&cy>=r.top&&cy<=r.bottom;}

function lbRound(){
  const c=LB.queue[LB.i];Object.assign(LB,{c,hints:0,wrong:0,done:false,atoms:new Map(),bonds:[],order:[],sel:null,formed:new Set(),rush:null});
  $('lbQ').textContent=LB.i+1;$('lbScore').textContent=LB.score;$('lbKicker').textContent='Build this compound';
  $('lbName').textContent=c.name;$('lbClue').textContent=c.clue;$('lbMade').hidden=true;$('lbOver').hidden=true;
  $('lbHintBox').hidden=true;$('lbMsg').textContent='';$('lbMsg').className='msg';$('lbNext').hidden=true;
  $('lbCombine').disabled=false;$('lbHint').disabled=false;$('lbClear').disabled=false;
  Object.values(lbCells).forEach(b=>{b.classList.remove('lbneed','lboff');b.disabled=false;});
  $('lbAtoms').classList.remove('lbwin');lbRelayout();
}
/* ---- structure ---- */
const lbDeg=id=>LB.bonds.reduce((t,[a,b])=>t+(a===id||b===id?1:0),0);
function lbComps(){const ids=[...LB.atoms.keys()],par=new Map(ids.map(i=>[i,i]));const f=x=>{while(par.get(x)!==x){par.set(x,par.get(par.get(x)));x=par.get(x);}return x;};
  LB.bonds.forEach(([a,b])=>par.set(f(a),f(b)));const g=new Map();ids.forEach(i=>{const r=f(i);if(!g.has(r))g.set(r,[]);g.get(r).push(i);});return [...g.values()];}
function lbCounts(ids){const c={};(ids||[...LB.atoms.keys()]).forEach(i=>{const s=LB.atoms.get(i).s;c[s]=(c[s]||0)+1;});return c;}
function lbRelayout(hint){
  const comps=lbComps(),disp={bonds:[],stubs:[],halos:[]},all=lbCounts(),allCat=mkFind(all);
  let groups=comps.map(ids=>({ids}));
  /* an ionic compound can be built as separate pieces: if every atom is bonded and the whole lab adds up, it forms */
  if(allCat&&allCat.ionic&&comps.length>1&&comps.every(ids=>ids.length>1))groups=[{ids:comps.flat(),cat:allCat}];
  groups.forEach(g=>{
    const ids=g.ids,cnt=lbCounts(ids),cat=g.cat||(ids.length>1?mkFind(cnt):null),A=ids.map(i=>LB.atoms.get(i));let lay,bonds;
    if(cat){const B=mkBlueprint(cat,false),used=new Set();
      const map=B.atoms.map(s=>{const a=A.find(x=>x.s===s&&!used.has(x.id));used.add(a.id);return a.id;});
      lay=B.pos.map((p,k)=>({id:map[k],x:p.x,y:p.y}));bonds=B.bonds.map(([a,b,o])=>({a:map[a],b:map[b],o,ion:mkMetal(B.atoms[a])||mkMetal(B.atoms[b])}));
      g.formed=true;g.name=cat.name;
    }else{const loc=new Map(ids.map((v,i)=>[v,i])),edges=LB.bonds.filter(([a])=>loc.has(a)).map(([a,b])=>[loc.get(a),loc.get(b)]);
      const syms=A.map(a=>a.s),ord=mkOrders(syms,edges),deg=ids.map(v=>lbDeg(v));
      g.formed=!!ord;
      const extra=ids.map((v,i)=>{if(ord){const bs=edges.reduce((t,[a,b],k)=>t+(a===i||b===i?ord[k]:0),0);return mkLP(syms[i],bs);}
        const vs=mkVals(syms[i]),nx=vs.find(x=>x>=deg[i]);return (nx===undefined?deg[i]:nx)-deg[i];});
      extra.stub=ord?ids.map(()=>0):extra.slice();
      const L=mkLayout(syms,edges,extra,false);lay=L.pos.map((p,k)=>({id:ids[k],x:p.x,y:p.y}));
      L.stubs.forEach((arr,k)=>arr.forEach(ang=>disp.stubs.push({id:ids[k],ang})));
      bonds=edges.map(([a,b],k)=>({a:ids[a],b:ids[b],o:ord?ord[k]:1,ion:ord&&(mkMetal(syms[a])||mkMetal(syms[b]))}));
      if(ord&&ids.length>1)g.name=null;}
    let ax,ay;if(hint&&ids.some(i=>hint.ids.includes(i))){ax=hint.x;ay=hint.y;}
    else{const known=A.filter(a=>!a.fresh);const S=known.length?known:A;ax=S.reduce((t,a)=>t+a.tx,0)/S.length;ay=S.reduce((t,a)=>t+a.ty,0)/S.length;}
    let rad=0;lay.forEach(p=>{rad=Math.max(rad,Math.hypot(p.x,p.y)+mkR(LB.atoms.get(p.id).s));});
    Object.assign(g,{lay,bonds,ax,ay,rad});disp.bonds.push(...bonds);});
  /* keep pieces inside the bench and apart from each other */
  for(let it=0;it<30;it++){groups.forEach(g=>{const m=Math.min(g.rad+8,190);g.ax=Math.max(m,Math.min(LB_W-m,g.ax));g.ay=Math.max(Math.min(m,200),Math.min(LB_H-12-Math.min(m,200),g.ay));});
    for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){const a=groups[i],b=groups[j],dx=b.ax-a.ax,dy=b.ay-a.ay,d=Math.hypot(dx,dy)||.1,need=a.rad+b.rad+14;
      if(d<need){const f=(need-d)/d/2,ha=hint&&a.ids.some(x=>hint.ids.includes(x)),hb=hint&&b.ids.some(x=>hint.ids.includes(x));const wa=ha?.25:1,wb=hb?.25:1;
        a.ax-=dx*f*wa;a.ay-=dy*f*wa;b.ax+=dx*f*wb;b.ay+=dy*f*wb;}}}
  groups.forEach(g=>{g.lay.forEach(p=>{const a=LB.atoms.get(p.id);a.tx=g.ax+p.x;a.ty=g.ay+p.y;a.fresh=false;});
    if(g.formed&&g.ids.length>1)disp.halos.push(g);});
  LB.groups=groups;LB.disp=disp;lbDraw();lbCard();lbAnimate();
  /* newly formed molecules sparkle */
  const now=new Set(groups.filter(g=>g.formed&&g.ids.length>1).map(g=>g.ids.slice().sort().join(',')));
  groups.forEach(g=>{const k=g.ids.slice().sort().join(',');if(g.formed&&g.ids.length>1&&!LB.formed.has(k)){
    if(!LB.test&&!LB.done){setTimeout(()=>{if(!LB||!$('lbSvg'))return;const p=lbScr(g.ax,g.ay);Art.burst(p.x,p.y,{n:16,colors:['#7dffb5','#ffffff','#ffd23f'],speed:200,gravity:120,size:4});},260);}
    if(LB.rush)lbRushMade(g);}});
  LB.formed=now;
}
function lbDraw(){
  const A=$('lbAtoms'),ids=new Set(LB.atoms.keys());
  [...A.children].forEach(g=>{if(!ids.has(+g.dataset.id)&&!g.classList.contains('lbbye'))g.remove();});
  LB.atoms.forEach(a=>{if(!a.el){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','lbatom lbborn');g.dataset.id=a.id;g.dataset.s=a.s;
      g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',mkName(a.s)+' atom. Enter to pick it up, then Enter on another atom to bond. Delete removes it.');
      g.innerHTML=`<circle class="lbsel" r="${mkR(a.s)+7}"/><g class="lbbody">${mkBall(a.s)}</g>`;a.el=g;A.append(g);setTimeout(()=>g.classList.remove('lbborn'),420);}
    a.el.classList.toggle('lbloose',lbDeg(a.id)===0&&LB.atoms.size>1);a.el.classList.toggle('lbpicked',LB.sel===a.id);});
  $('lbBonds').innerHTML='';$('lbStubs').innerHTML='';$('lbHalos').innerHTML='';$('lbTags').innerHTML='';
  LB.disp.halos.forEach(g=>{g.halo=mkSvgEl(`<circle class="lbhalo" r="${g.rad+18}" fill="url(#mkHalo)"/>`);$('lbHalos').append(g.halo);
    if(g.name&&!LB.test&&(LB.done||LB.rush)){g.tag=mkSvgEl(`<g class="lbtag"><rect x="${-(g.name.length*4.4+16)}" y="-13" width="${g.name.length*8.8+32}" height="26" rx="13"/><text y="5" text-anchor="middle">✓ ${g.name}</text></g>`);$('lbTags').append(g.tag);}});
  LB.disp.bonds.forEach(b=>{b.el=document.createElementNS('http://www.w3.org/2000/svg','g');b.el.setAttribute('class','lbbond');$('lbBonds').append(b.el);});
  LB.disp.stubs.forEach(s=>{s.el=mkSvgEl('<circle class="lbstub" r="5.5"/>');$('lbStubs').append(s.el);});
  $('lbEmpty').hidden=LB.atoms.size>0||!!LB.rushIntro;
  const syms=[...new Set([...LB.atoms.values()].map(a=>a.s))];
  $('lbHands').replaceChildren(...syms.map(s=>h('span',{class:'lbhand'},h('b',null,s),' ',mkMax(s)===0?'no bonds':mkMax(s)+(mkVals(s).length>1?'+':'')+' hand'+(mkMax(s)===1?'':'s'))));
  $('lbHands').hidden=!syms.length;
  lbFrame();
}
function lbFrame(){
  if(!LB||!LB.atoms)return;
  LB.atoms.forEach(a=>{if(a.el)a.el.setAttribute('transform',`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})`);});
  LB.disp.bonds.forEach(b=>{const p=LB.atoms.get(b.a),q=LB.atoms.get(b.b);if(!p||!q||!b.el)return;b.el.innerHTML=mkStick(p,q,b.o,b.ion);});
  LB.disp.stubs.forEach(s=>{const a=LB.atoms.get(s.id);if(!a||!s.el)return;const r=mkR(a.s)+8,t=s.ang*Math.PI/180;s.el.setAttribute('cx',(a.x+r*Math.cos(t)).toFixed(1));s.el.setAttribute('cy',(a.y+r*Math.sin(t)).toFixed(1));});
  LB.disp.halos.forEach(g=>{let x=0,y=0;g.ids.forEach(i=>{const a=LB.atoms.get(i);x+=a.x;y+=a.y;});x/=g.ids.length;y/=g.ids.length;
    if(g.halo)g.halo.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    if(g.tag){let top=1e9;g.ids.forEach(i=>{const a=LB.atoms.get(i);top=Math.min(top,a.y-mkR(a.s));});g.tag.setAttribute('transform',`translate(${x.toFixed(1)} ${Math.max(16,top-20).toFixed(1)})`);}});
}
function lbAnimate(){
  if(Art.reduced()){LB.atoms.forEach(a=>{a.x=a.tx;a.y=a.ty;});lbFrame();return;}
  if(lbRaf)return;
  const step=()=>{lbRaf=0;if(!LB||!LB.atoms||$('s-lab').hidden)return;let busy=false;
    LB.atoms.forEach(a=>{if(LB.drag&&LB.drag.on&&LB.drag.id===a.id)return;const dx=a.tx-a.x,dy=a.ty-a.y;if(Math.abs(dx)+Math.abs(dy)>.4){a.x+=dx*.2;a.y+=dy*.2;busy=true;}else{a.x=a.tx;a.y=a.ty;}});
    lbFrame();if(busy)lbRaf=requestAnimationFrame(step);};
  lbRaf=requestAnimationFrame(step);
}
/* ---- actions ---- */
function lbSay(t,bad){const el=$('lbToast');el.textContent=t;el.className='lbtoast on'+(bad?' bad':'');clearTimeout(lbSay.t);lbSay.t=setTimeout(()=>{el.className='lbtoast';},2600);}
function lbFree(){let best=null,bs=-1;const ctr={x:LB_W/2,y:LB_H/2+10},pts=[...LB.atoms.values()];
  for(let y=70;y<=LB_H-60;y+=50)for(let x=70;x<=LB_W-70;x+=55){let md=1e9;pts.forEach(a=>{md=Math.min(md,Math.hypot(a.tx-x,a.ty-y));});
    const sc=Math.min(md,110)*3-Math.hypot(x-ctr.x,y-ctr.y)*.6;if(sc>bs){bs=sc;best={x,y};}}return best;}
function lbNewAtom(s,from,to){if(LB.atoms.size>=LB_MAXP){lbSay('That is a lot of atoms! Try fewer.',true);return null;}
  const id=++lbSeq,a={id,s,x:from.x,y:from.y,tx:to.x,ty:to.y,fresh:true};LB.atoms.set(id,a);if(!LB.order.includes(s))LB.order.push(s);return a;}
function lbCanPlay(){return LB&&!LB.done&&!LB.rushIntro&&!(LB.rushOver);}
function lbAdd(s,cell){if(!lbCanPlay())return;
  const to=lbFree();let from={x:to.x,y:-40};
  if(cell){const r=cell.getBoundingClientRect(),p=lbPt(r.left+r.width/2,r.top+r.height/2);from={x:Math.max(30,Math.min(LB_W-30,p.x)),y:-40};}
  const a=lbNewAtom(s,from,to);if(!a)return;lbClearMsg();lbRelayout({ids:[a.id],x:to.x,y:to.y});
  if(cell)Art.pulse&&Art.pulse(cell,'#ffd23f');}
function lbClearMsg(){if(!LB.done){$('lbMsg').textContent='';$('lbMsg').className='msg';}}
function lbDetach(id){LB.bonds=LB.bonds.filter(([a,b])=>a!==id&&b!==id);}
function lbRemove(id){if(!lbCanPlay())return;const a=LB.atoms.get(id);if(!a)return;lbDetach(id);LB.atoms.delete(id);if(LB.sel===id)LB.sel=null;
  if(a.el){const p=lbScr(a.x,a.y);a.el.remove();if(!LB.test)Art.burst(p.x,p.y,{n:8,colors:['#cfd8ff','#ffffff'],speed:140,gravity:60,size:3});}
  lbClearMsg();lbRelayout();}
function lbMoveLoose(id,p){if(!lbCanPlay())return;const a=LB.atoms.get(id);if(!a)return;lbDetach(id);a.tx=p.x;a.ty=p.y;lbClearMsg();lbRelayout({ids:[id],x:p.x,y:p.y});}
function lbReason(b){const mx=mkMax(b.s),nm=mkName(b.s);
  if(mx===0)return `${nm} doesn't bond. Its outer shell is already full.`;
  if(mx===1)return `${nm} can only make 1 bond.`;
  return `This ${nm.toLowerCase()} already has ${mx===2?'both':'all '+mx} of its bonds.`;}
/* atom a (already detached) tries to bond to atom b */
function lbTryBond(aId,bId){const a=LB.atoms.get(aId),b=LB.atoms.get(bId);if(!a||!b||aId===bId)return;lbClearMsg();
  let why=null;if(mkMax(a.s)===0)why=lbReason(a);else if(lbDeg(bId)>=mkMax(b.s))why=lbReason(b);
  if(why){const ang=Math.atan2(a.ty-b.ty,a.tx-b.tx)||(-Math.PI/2),d=mkR(a.s)+mkR(b.s)+40;
    const p={x:b.tx+Math.cos(ang)*d,y:b.ty+Math.sin(ang)*d};a.tx=p.x;a.ty=p.y;lbSay(why,true);
    [a,b].forEach(x=>{if(x.el){const body=x.el.querySelector('.lbbody');body.classList.remove('lbno');void body.getBBox();body.classList.add('lbno');}});
    lbRelayout({ids:[aId],x:p.x,y:p.y});return false;}
  const grp=(LB.groups||[]).find(g=>g.ids.includes(bId));LB.bonds.push([bId,aId]);
  lbRelayout(grp?{ids:grp.ids.concat([aId]),x:grp.ax,y:grp.ay}:null);return true;}
function lbSelect(id){LB.sel=id;LB.atoms.forEach(a=>a.el&&a.el.classList.toggle('lbpicked',a.id===id));
  if(id!=null)lbSay(`${mkName(LB.atoms.get(id).s)} picked up. Tap another atom to bond, or an empty spot to move it.`);}
function lbTap(id){if(!lbCanPlay())return;if(LB.sel==null)return lbSelect(id);if(LB.sel===id)return lbSelect(null);
  const a=LB.sel;lbSelect(null);lbDetach(a);lbTryBond(a,id);}
/* ---- dragging (from the table or inside the bench) ---- */
function lbHitAtom(p,skip){let best=null,bd=1e9;LB.atoms.forEach(a=>{if(a.id===skip)return;const d=Math.hypot(a.x-p.x,a.y-p.y);if(d<mkR(a.s)+24&&d<bd){bd=d;best=a;}});return best;}
function lbDragBegin(e,o){if(!lbCanPlay()||lbDragS)return;if(o.src==='table'&&LB.rush&&!LB.rush.tray.includes(o.s))return;
  lbDragS=Object.assign({x0:e.clientX,y0:e.clientY,pid:e.pointerId,on:false},o);LB.drag=lbDragS;}
document.addEventListener('pointermove',e=>{const d=lbDragS;if(!d||e.pointerId!==d.pid)return;
  if(!d.on){if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<7)return;d.on=true;
    if(d.src==='atom'){const a=LB.atoms.get(d.id);if(!a){lbDragS=null;return;}if(LB.sel!=null)lbSelect(null);
      const had=lbDeg(d.id)>0;lbDetach(d.id);if(had)lbRelayout();a.el&&a.el.classList.add('lbhide');}
    const r=mkR(d.s),gh=h('div',{class:'lbghost'});gh.innerHTML=`<svg viewBox="${-r-4} ${-r-4} ${2*r+8} ${2*r+8}" width="${(2*r+8)*1.15}" height="${(2*r+8)*1.15}">${mkBall(d.s)}</svg>`;
    d.ghost=gh;document.body.append(gh);}
  e.preventDefault();const sc=$('lbSvg').getScreenCTM(),k=sc?sc.a:1;d.ghost.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%) scale(${Math.max(.6,k).toFixed(2)})`;
  const p=lbPt(e.clientX,e.clientY),t=lbInside(e.clientX,e.clientY)?lbHitAtom(p,d.id):null;
  LB.atoms.forEach(a=>a.el&&a.el.classList.remove('lbhot','lbhotno'));
  if(t&&t.el)t.el.classList.add(mkMax(d.s)>0&&lbDeg(t.id)<mkMax(t.s)?'lbhot':'lbhotno');
  d.ghost.classList.toggle('lbout',!lbInside(e.clientX,e.clientY)&&d.src==='atom');},{passive:false});
function lbDragEnd(e){const d=lbDragS;if(!d||e.pointerId!==d.pid)return;lbDragS=null;if(LB)LB.drag=null;if(d.ghost)d.ghost.remove();
  if(!LB||!LB.atoms)return;LB.atoms.forEach(a=>a.el&&a.el.classList.remove('lbhot','lbhotno','lbhide'));
  if(e.type!=='pointerup'){lbRelayout();return;}
  if(!d.on){if(d.src==='table')lbAdd(d.s,d.cell);else lbTap(d.id);return;}
  const inside=lbInside(e.clientX,e.clientY),p=lbPt(e.clientX,e.clientY),t=inside?lbHitAtom(p,d.id):null;
  if(d.src==='table'){if(!inside)return;const a=lbNewAtom(d.s,p,p);if(!a)return;lbClearMsg();a.fresh=false;if(t)lbTryBond(a.id,t.id);else lbRelayout({ids:[a.id],x:p.x,y:p.y});return;}
  const a=LB.atoms.get(d.id);if(!a)return;a.x=p.x;a.y=p.y;a.tx=p.x;a.ty=p.y;
  if(!inside)return lbRemove(d.id);
  if(t)lbTryBond(d.id,t.id);else lbMoveLoose(d.id,p);}
document.addEventListener('pointerup',lbDragEnd);document.addEventListener('pointercancel',lbDragEnd);
/* ---- the molecule card ---- */
function lbCard(){
  const c=lbCounts(),n=LB.atoms.size,cat=mkFind(c);
  const keys=cat?Object.keys(cat.f):LB.order.filter(s=>c[s]);
  $('lbFormula').textContent=n?keys.filter(s=>c[s]).map(s=>s+sub(c[s])).join(''):'—';
  $('lbTray').replaceChildren(...keys.filter(s=>c[s]).map(s=>h('span',{class:'lbchip',style:`--c:${mkCol(s)[0]}`},h('i'),`${s} × ${c[s]}`)));
  const loose=[...LB.atoms.keys()].filter(i=>lbDeg(i)===0).length,stubs=LB.disp.stubs.length,G=LB.groups||[];
  let st='',cls='';
  if(!n)st='No atoms yet.';
  else if(n>1&&loose){st=`${loose} loose atom${loose>1?'s':''}: drag ${loose>1?'them':'it'} onto another atom to bond.`;cls='warn';}
  else if(G.length&&G.every(g=>g.formed)){cls='ok';st=G.length===1?'Complete molecule! Every bonding hand is used.':G.length+' complete molecules.';}
  else if(stubs){st=`${stubs} open bonding hand${stubs>1?'s':''}.`;}
  else st='';
  const el=$('lbStatus');el.textContent=st;el.className='lbstatus '+cls;
  $('lbWorth').textContent=LB.done?0:Math.max(1,3-LB.hints-LB.wrong);
}
/* ---- buttons ---- */
$('lbClear').onclick=()=>{if(!lbCanPlay())return;LB.atoms.forEach(a=>a.el&&a.el.remove());LB.atoms=new Map();LB.bonds=[];LB.order=[];LB.sel=null;lbClearMsg();lbRelayout();};
$('lbHint').onclick=()=>{
  if(LB.done||LB.hints>=2||LB.test)return;LB.hints++;const f=LB.c.f,box=$('lbHintBox');box.hidden=false;
  Object.keys(f).forEach(s=>lbCells[s]&&lbCells[s].classList.add('lbneed'));
  box.textContent=LB.hints===1?'You need: '+Object.keys(f).map(s=>BYSYM[s].name).join(', ')+'. They glow on the table.':'The formula is '+fmtFormula(f)+'. The small number tells how many atoms of that element!';
  if(LB.hints>=2)$('lbHint').disabled=true;lbCard();
};
$('lbCombine').onclick=()=>{
  if(!lbCanPlay())return;const t=LB.c.f,a=lbCounts(),msg=$('lbMsg');
  if(!LB.atoms.size){msg.className='msg bad';msg.textContent='Click elements on the table to drop atoms in first.';return;}
  const loose=[...LB.atoms.keys()].filter(i=>lbDeg(i)===0).length;
  if(LB.atoms.size>1&&loose){msg.className='msg bad';msg.textContent='Bond your atoms first: drag each loose atom onto another atom.';Art.shake($('lbChamber'));return;}
  const tk=Object.keys(t),ak=Object.keys(a);
  const missing=tk.some(k=>!a[k]),extra=ak.some(k=>!t[k]),same=!missing&&!extra&&tk.every(k=>a[k]===t[k]);
  if(LB.test){LB.results.push({c:LB.c,ok:same});LB.done=true;tstSaved();LB.i++;
    setTimeout(()=>{if(!LB||!LB.test)return;if(LB.i>=LB.queue.length)return TST&&TST.finish();lbRound();},300);return;}
  if(same)return lbSuccess();
  LB.wrong++;msg.className='msg bad';fx.pop({icon:'burst',text:'Almost!',kind:'oops'});
  const at=$('lbAtoms');at.classList.remove('lbjig');void at.getBBox();at.classList.add('lbjig');
  msg.textContent=missing?"Not yet: you're missing a type of element.":extra?"Not yet: one of your elements doesn't belong.":"Right elements! Now check how many atoms of each.";
  if(LB.wrong>=3&&LB.hints<2){LB.hints=2;$('lbHint').disabled=true;const b=$('lbHintBox');b.hidden=false;b.textContent='The formula is '+fmtFormula(t)+'.';msg.textContent+=' (Formula revealed.)';}
  lbCard();
};
function lbSuccess(){
  LB.done=true;const pts=Math.max(1,3-LB.hints-LB.wrong);LB.score+=pts;LB.results.push({c:LB.c,pts});
  $('lbScore').textContent=LB.score;lbRelayout();$('lbFormula').textContent=fmtFormula(LB.c.f);
  const at=$('lbAtoms');at.classList.remove('lbjig');at.classList.add('lbwin');
  const G=LB.groups||[];G.forEach(g=>{const p=lbScr(g.ax,g.ay);Art.burst(p.x,p.y,{n:30,colors:['#7dffb5','#ffd23f','#ffffff','#8fb6ff'],speed:300,gravity:200});});
  const m=$('lbMsg');m.className='msg good';m.textContent=`${LB.c.name} = ${fmtFormula(LB.c.f)}  +${pts} pt${pts===1?'':'s'}!`;
  const st=$('lbStatus');st.className='lbstatus ok';st.textContent=mkCat()[mkKey(LB.c.f)]&&mkCat()[mkKey(LB.c.f)].ionic?'Real '+LB.c.name.toLowerCase()+' is a giant crystal of these atoms, repeating in this ratio.':'Complete: '+LB.c.name+'!';
  fx.pop({icon:'flask',text:'Success! +'+pts,kind:'great',size:'big'});fx.confetti(pts===3?80:45);
  $('lbCombine').disabled=true;$('lbHint').disabled=true;$('lbClear').disabled=true;
  $('lbNext').textContent=LB.i+1>=LB.queue.length?'Bonus round ▶':'Next ▶';$('lbNext').hidden=false;$('lbNext').focus({preventScroll:true});
  $('lbWorth').textContent=0;
}
$('lbNext').onclick=()=>{LB.i++;if(LB.i>=LB.queue.length)return lbRushIntro();lbRound();};
$('lbQuit').onclick=()=>{lbStopRush();LB&&LB.test?tstQuit():goMenu();};
/* ---- Combo Rush (bonus, not in the score) ---- */
let lbRushTimer=0;
function lbStopRush(){if(lbRushTimer){clearInterval(lbRushTimer);lbRushTimer=0;}}
function lbRushIntro(){
  const tray=LB_TRAYS[Math.floor(Math.random()*LB_TRAYS.length)];
  Object.assign(LB,{done:false,atoms:new Map(),bonds:[],order:[],sel:null,formed:new Set(),rush:null,rushIntro:{tray}});
  $('lbAtoms').classList.remove('lbwin');$('s-lab').classList.add('rushing');$('lbClear').disabled=false;lbRelayout();$('lbNext').hidden=true;$('lbMsg').textContent='';$('lbHintBox').hidden=true;
  Object.values(lbCells).forEach(b=>b.classList.remove('lbneed'));
  $('lbKicker').textContent='Bonus round';$('lbName').textContent='Combo Rush';$('lbClue').textContent='Make as many different real compounds as you can in 60 seconds.';
  const o=$('lbOver');o.hidden=false;
  o.replaceChildren(h('div',{class:'lbovercard'},h('b',null,'⚡ Combo Rush'),h('p',null,'60 seconds. Use only these atoms:'),
    h('div',{class:'lbtray'},tray.map(s=>{const d=h('span',{class:'lbtrayball'});d.innerHTML=`<svg viewBox="-28 -28 56 56">${mkBall(s,24)}</svg>`;return d;})),
    h('p',null,'Every time your atoms snap into a real compound, it counts (once each). Keep building: a small molecule can grow into a bigger one! Press Clear when the bench gets full.'),
    h('div',{class:'lbbtnrow'},h('button',{class:'btn good',onclick:lbRushStart},'Start ▶'),h('button',{class:'btn ghost',onclick:()=>lbEnd()},'Skip to results'))));
  o.querySelector('.btn.good').focus({preventScroll:true});
}
function lbRushStart(){
  const tray=LB.rushIntro.tray;LB.rushIntro=null;LB.rush={tray,t:60,made:[]};$('lbOver').hidden=true;
  $('s-lab').classList.add('rushing');$('lbTimePill').hidden=false;$('lbTime').textContent=60;$('lbMade').hidden=false;$('lbMade').replaceChildren(h('small',null,'Made: none yet'));
  Object.values(lbCells).forEach(b=>{const off=!tray.includes(b.dataset.s);b.classList.toggle('lboff',off);b.disabled=off;});
  lbRelayout();lbStopRush();
  lbRushTimer=setInterval(()=>{if(!LB||!LB.rush||$('s-lab').hidden)return lbStopRush();LB.rush.t--;$('lbTime').textContent=LB.rush.t;
    if(LB.rush.t<=0){lbStopRush();LB.rushOver=true;lbSay('Time!');setTimeout(()=>{if(LB&&LB.rush)lbEnd();},900);}},1000);
}
function lbRushMade(g){const R=LB.rush;if(!g.name||LB.rushOver)return;const isNew=!R.made.includes(g.name);
  if(isNew){R.made.push(g.name);const f=mkCat()[mkKey(lbCounts(g.ids))].f;
    $('lbMade').replaceChildren(h('small',null,`Made: ${R.made.length}`),...R.made.map(nm=>{const c=Object.values(mkCat()).find(x=>x.name===nm);return h('span',{class:'lbmadechip'},fmtFormula(c.f));}));
    lbSay(`+1 ${g.name} (${fmtFormula(f)})`);fx.pop({icon:'flask',text:'+1 '+g.name,kind:'great'});}
  else lbSay(`Already made ${g.name}. Try a new one!`,true);}
function lbEnd(){
  lbStopRush();$('lbTimePill').hidden=true;$('s-lab').classList.remove('rushing');
  const P=prof(),rec=P.lab,prev=rec.best;rec.plays++;const isBest=LB.score>prev;if(isBest)rec.best=LB.score;
  let rushLine=null;if(LB.rush){const n=LB.rush.made.length,rb=rec.rush||0;if(n>rb)rec.rush=n;
    rushLine=h('p',null,'⚡ Combo Rush: ',h('b',null,n),' compound'+(n===1?'':'s')+(n>rb&&rb?' (new best!)':rec.rush?` · best ${rec.rush}`:''));}
  saveAll();cloudSubmit('lab','',LB.score,{n:LB.queue.length});
  const max=LB.queue.length*3;LB.rush=null;
  showEnd({emoji:'flask',title:LB.score>=max*.8?'Master Chemist!':LB.score>=max*.5?'Great Lab Work!':'Keep Experimenting!',big:`${LB.score}/${max}`,sub:'Compound Lab score',
    body:[isBest?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,h('p',null,'High score: ',h('b',null,rec.best)),rushLine,
      h('div',{class:'tchips'},LB.results.map(r=>h('span',{class:'tchip'},`${r.c.name} ${fmtFormula(r.c.f)}`)))],
    again:startLab,party:isBest?'New high score!':(LB.score>=max*.7?'Great lab work!':null)});
}
