/*<<BOENGINE*/
const BO_V=1.5,BO_RB=0.1,BO_RW=0.001,BO_P0=Math.pow(BO_V/(1+BO_RB),2);
const boEdge=(k,cols)=>{const q=k.split(':'),t=q[0],c=+q[1],r=+q[2];return t==='h'?[r*cols+c,r*cols+c+1]:[r*cols+c,(r+1)*cols+c];};
/* parts: "h:c:r" / "v:c:r" -> {t:'w'|'L'|'S'|'B', id, o:+1|-1 (battery: +1 puts the + end at the right/lower node), open} */
function boSolve(L,parts,opt){
  opt=opt||{};const cols=L.cols,n=cols*L.rows,burn=opt.burn||[],openIds=opt.open||[],allOpen=openIds==='*';
  const A=[],b=[];for(let i=0;i<n;i++){A.push(new Array(n).fill(0));A[i][i]=1e-9;b.push(0);}
  const stamp=(a,c,g)=>{A[a][a]+=g;A[c][c]+=g;A[a][c]-=g;A[c][a]-=g;};
  const els=[];
  Object.keys(parts).forEach(k=>{const p=parts[k],e=boEdge(k,cols);let g=0,kind=p.t;
    if(p.t==='w')g=1/BO_RW;
    else if(p.t==='S'){const op=allOpen||(Array.isArray(openIds)&&openIds.indexOf(p.id)>=0)||(opt.useState&&p.open);g=op?0:1/BO_RW;}
    else if(p.t==='L'){g=(burn.indexOf(p.id)>=0)?0:1;}
    else if(p.t==='B'){const a=p.o>0?e[0]:e[1],c=p.o>0?e[1]:e[0];g=1/BO_RB;stamp(a,c,g);b[c]+=BO_V/BO_RB;b[a]-=BO_V/BO_RB;els.push({k,p,a,c,g,kind:'B'});return;}
    if(g>0)stamp(e[0],e[1],g);els.push({k,p,a:e[0],c:e[1],g,kind});});
  /* gaussian elimination with partial pivoting */
  const M=A.map((r,i)=>r.concat([b[i]]));
  for(let i=0;i<n;i++){let m=i;for(let j=i+1;j<n;j++)if(Math.abs(M[j][i])>Math.abs(M[m][i]))m=j;[M[i],M[m]]=[M[m],M[i]];
    const d=M[i][i];if(Math.abs(d)<1e-14)continue;for(let j=i+1;j<n;j++){const f=M[j][i]/d;if(f===0)continue;for(let k=i;k<=n;k++)M[j][k]-=f*M[i][k];}}
  const v=new Array(n).fill(0);for(let i=n-1;i>=0;i--){let s=M[i][n];for(let j=i+1;j<n;j++)s-=M[i][j]*v[j];v[i]=Math.abs(M[i][i])<1e-14?0:s/M[i][i];}
  const out={lamps:{},cur:{},short:false,batt:{}};
  els.forEach(x=>{
    if(x.kind==='B'){const vt=v[x.c]-v[x.a],io=(BO_V-vt)/BO_RB;out.batt[x.k]={vt,io};out.cur[x.k]=io;if(io>2&&vt<0.4*BO_V)out.short=true;return;}
    const I=x.g*(v[x.a]-v[x.c]);out.cur[x.k]=I;
    if(x.kind==='L'){const P=I*I,r=P/BO_P0;out.lamps[x.p.id]={i:I,p:P,ratio:r,level:r<0.08?0:r<0.6?1:r<2?2:3};}});
  return out;
}
const BO_LV=['off','dim','bright','blazing'];
const boMeets=(lamp,need)=>{const l=lamp?lamp.level:0;
  if(need==='off')return l===0;if(need==='lit')return l>=1;if(need==='bright')return l>=2;if(need==='blazing')return l>=3;return false;};
/* run every test of a level; returns [{ok,label,why}] */
function boTests(L,parts){
  const res=[];
  L.tests.forEach(t=>{
    if(t.kind==='each'){
      const sw=Object.keys(parts).filter(k=>parts[k].t==='S'),base=boSolve(L,parts,{});
      const ids=Object.keys(base.lamps),allLit=ids.every(i=>base.lamps[i].level>=1);
      let ok=allLit&&sw.length>0,why=allLit?'':'Every lamp needs to light up first.';const covered={};
      if(ok){sw.forEach(k=>{const r=boSolve(L,parts,{open:[parts[k].id]});const off=ids.filter(i=>r.lamps[i].level===0);
        off.forEach(i=>covered[i]=1);if(off.length!==1){ok=false;why=off.length?'One switch turns off more than one lamp.':'A switch does nothing. Wire it in series with a lamp.';}});
        if(ok&&ids.some(i=>!covered[i])){ok=false;why='Every lamp needs its own switch.';}}
      else if(allLit&&!sw.length)why='Add a switch for each lamp.';
      if(base.short){ok=false;why='Short circuit!';}
      res.push({ok,label:t.label,why});return;}
    const r=boSolve(L,parts,{burn:t.burn||[],open:t.open||[]});
    let ok=!r.short,why=r.short?'Short circuit! The battery was connected straight to itself.':'';
    if(ok)Object.keys(t.need).forEach(id=>{if(ok&&!boMeets(r.lamps[id],t.need[id])){ok=false;
      const lv=r.lamps[id]?BO_LV[r.lamps[id].level]:'missing';why=(L.names&&L.names[id]||id)+' should be '+(t.need[id]==='off'?'off':t.need[id]==='lit'?'lit':t.need[id])+' but is '+lv+'.';}});
    res.push({ok,label:t.label,why});});
  return res;
}
/*BOENGINE>>*/
/*<<BOLEVELS*/
const BOW=(...k)=>Object.fromEntries(k.map(x=>[x,{t:'w'}]));
const bo_rail=(r,c0,c1)=>{const a=[];for(let c=c0;c<=c1;c++)a.push('h:'+c+':'+r);return a;};
const BO_LEVELS=[
 {pack:'Closed Circuits',name:'Lamp Post',story:'The street lamp has gone dark. Connect the battery to the lamp with wire.',
  clue:'Electricity needs a complete loop. Wire from one end of the battery, through the lamp, and back to the other end.',
  fact:'A circuit is a closed loop. The battery pushes charges around it and the lamp turns that energy into light.',
  intro:'New tool: Wire. Click a spot, or drag across spots to lay wire quickly. Every circuit needs a closed loop.',
  cols:4,rows:2,names:{a:'Street lamp'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:3:0':{t:'L',id:'a'}},
  tests:[{label:'Light the lamp',need:{a:'bright'}}],
  sol:{parts:BOW(...bo_rail(0,0,2),...bo_rail(1,0,2))}},
 {pack:'Closed Circuits',name:'Light Switch',story:'The shop wants a switch so it can turn its lamp off at night.',
  clue:'The switch has to be part of the loop. When it opens, the loop breaks and the lamp goes out.',
  fact:'A switch opens or closes the loop. An open switch leaves a gap, so the charges stop moving and the lamp goes out.',
  intro:'Click the switch on the board to flip it open or closed. The test will try both.',
  cols:5,rows:2,names:{a:'Shop lamp'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:4:0':{t:'L',id:'a'},'h:2:0':{t:'S',id:'s1',open:false}},
  tests:[{label:'Switch closed: lamp on',need:{a:'bright'}},{label:'Switch open: lamp off',open:['s1'],need:{a:'off'}}],
  sol:{parts:BOW('h:0:0','h:1:0','h:3:0',...bo_rail(1,0,3))}},
 {pack:'Closed Circuits',name:'Twin Lamps',story:'Two lamps on one battery. Get them both glowing.',
  clue:'Chain the lamps in one loop, one after the other.',
  fact:'In a series circuit there is only one path, so the same current flows through every part. The energy is shared between the lamps.',
  cols:6,rows:2,names:{a:'Lamp A',b:'Lamp B'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'h:1:0':{t:'L',id:'a'},'h:3:0':{t:'L',id:'b'}},
  tests:[{label:'Both lamps glow',need:{a:'lit',b:'lit'}}],
  sol:{parts:BOW('h:0:0','h:2:0','h:4:0','v:5:0',...bo_rail(1,0,4))}},
 {pack:'Closed Circuits',name:'Bright Twins',story:'Those twin lamps were dim. The mayor wants both of them BRIGHT.',
  clue:'Give each lamp its own direct path to the battery. Use two rails, one on top and one on the bottom.',
  fact:'In a parallel circuit each lamp has its own path to the battery, so each gets the full push and shines brightly.',
  intro:'Series lamps share the energy and glow dim. Parallel lamps each connect straight to the battery.',
  cols:5,rows:2,names:{a:'Lamp A',b:'Lamp B'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:2:0':{t:'L',id:'a'},'v:4:0':{t:'L',id:'b'}},
  tests:[{label:'Both lamps bright',need:{a:'bright',b:'bright'}}],
  sol:{parts:BOW(...bo_rail(0,0,3),...bo_rail(1,0,3))}},
 {pack:'Closed Circuits',name:'Burnout Boulevard',story:'Lamps burn out all the time here. One bad bulb must never darken the street.',
  clue:'In a parallel circuit, the other paths still work when one breaks.',
  fact:'When one bulb burns out in a series circuit, the loop breaks and everything goes dark. In a parallel circuit the other paths keep working.',
  cols:7,rows:2,names:{a:'Lamp A',b:'Lamp B',c:'Lamp C'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:2:0':{t:'L',id:'a'},'v:4:0':{t:'L',id:'b'},'v:6:0':{t:'L',id:'c'}},
  tests:[{label:'All three glow',need:{a:'lit',b:'lit',c:'lit'}},{label:'Lamp B burns out: A and C stay on',burn:['b'],need:{a:'lit',c:'lit'}},{label:'Lamp A burns out: B and C stay on',burn:['a'],need:{b:'lit',c:'lit'}}],
  sol:{parts:BOW(...bo_rail(0,0,5),...bo_rail(1,0,5))}},
 {pack:'Parallel Power',name:'Hospital Wing',story:'The school switch must never cut power to the hospital.',
  clue:'Put the hospital on its own path. Only the school lamp and its switch belong on the other path.',
  fact:'Devices on separate parallel branches are independent. Opening a switch on one branch does not affect the others.',
  cols:5,rows:3,names:{h:'Hospital',s:'School'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:2:0':{t:'L',id:'h'},'v:4:0':{t:'L',id:'s'},'v:4:1':{t:'S',id:'s1',open:false}},
  tests:[{label:'Switch closed: both lit',need:{h:'lit',s:'lit'}},{label:'School switch open: hospital stays on',open:['s1'],need:{h:'lit',s:'off'}}],
  sol:{parts:BOW(...bo_rail(0,0,3),...bo_rail(2,0,3),'v:0:1','v:2:1')}},
 {pack:'Parallel Power',name:'Polarity',story:'Two batteries should make one super-bright lamp. Right now it stays dark!',
  clue:'Batteries have a plus end and a minus end. Click a battery to flip it.',
  fact:'Batteries in series add their push when they face the same way around the loop. Facing opposite ways, they cancel out.',
  intro:'Click a battery to flip it. Batteries add up only when they push the same way around the loop.',
  cols:4,rows:2,names:{a:'Lamp'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:3:0':{t:'B',o:1},'h:1:0':{t:'L',id:'a'}},
  tests:[{label:'Make the lamp blaze',need:{a:'blazing'}}],
  sol:{parts:BOW('h:0:0','h:2:0',...bo_rail(1,0,2)),flip:['v:0:0']}},
 {pack:'Parallel Power',name:'Power Pair',story:'A tall stack of two batteries feeds two lamps. Wire them in parallel for maximum glow.',
  clue:'Build two rails, top and bottom, and connect each lamp between them.',
  fact:'More batteries in series means more energy for each charge to give away, so the lamps shine brighter.',
  cols:5,rows:3,names:{a:'Lamp A',b:'Lamp B'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:0:1':{t:'B',o:1},'v:2:0':{t:'L',id:'a'},'v:4:0':{t:'L',id:'b'}},
  tests:[{label:'Both lamps blazing',need:{a:'blazing',b:'blazing'}}],
  sol:{parts:BOW(...bo_rail(0,0,3),...bo_rail(2,0,3),'v:2:1','v:4:1')}},
 {pack:'Power Grid',name:'Add a Switch',story:'This lamp has no switch at all. Build one into the loop.',
  clue:'Drag the switch from the tray onto a spot in the loop. The test opens every switch you place.',
  fact:'A switch must be in series with what it controls. Placed anywhere on the loop, it can break the whole circuit.',
  intro:'New tool: Switch. Drag it onto the board or click a spot. Click a placed switch to open or close it.',
  cols:4,rows:2,names:{a:'Lamp'},inv:{S:1},
  fixed:{'v:0:0':{t:'B',o:1},'v:3:0':{t:'L',id:'a'}},
  tests:[{label:'Switch closed: lamp on',need:{a:'bright'}},{label:'Switch open: lamp off',open:'*',need:{a:'off'}}],
  sol:{parts:Object.assign(BOW('h:0:0','h:2:0',...bo_rail(1,0,2)),{'h:1:0':{t:'S',id:'sw1'}})}},
 {pack:'Power Grid',name:'Own Switches',story:'The mayor wants every lamp to have its own switch, so one can go off while the other stays on.',
  clue:'Each switch goes in series with a single lamp, on that lamp\'s own branch.',
  fact:'In a parallel circuit, a switch in one branch controls only that branch. This is how the lights in your house work.',
  cols:5,rows:3,names:{a:'Lamp A',b:'Lamp B'},inv:{S:2},
  fixed:{'v:0:0':{t:'B',o:1},'v:2:0':{t:'L',id:'a'},'v:4:0':{t:'L',id:'b'}},
  tests:[{label:'Every lamp has its own switch',kind:'each'}],
  sol:{parts:Object.assign(BOW(...bo_rail(0,0,3),...bo_rail(2,0,3),'v:0:1'),{'v:2:1':{t:'S',id:'sw1'},'v:4:1':{t:'S',id:'sw2'}})}},
 {pack:'Power Grid',name:'Big City',story:'Four districts, two batteries and a lot of wire. Keep the lights on even when a bulb fails.',
  clue:'Build two long rails and give every district its own path between them.',
  fact:'Cities wire buildings in parallel so that one failure does not black out everyone else.',
  cols:7,rows:3,names:{h:'Hospital',s:'School',l:'Library',t:'Stadium'},inv:{},
  fixed:{'v:0:0':{t:'B',o:1},'v:0:1':{t:'B',o:1},'v:2:0':{t:'L',id:'h'},'v:3:0':{t:'L',id:'s'},'v:4:0':{t:'L',id:'l'},'v:5:0':{t:'L',id:'t'}},
  tests:[{label:'All four districts lit',need:{h:'lit',s:'lit',l:'lit',t:'lit'}},{label:'School bulb burns out: the rest stay on',burn:['s'],need:{h:'lit',l:'lit',t:'lit'}},{label:'Hospital bulb burns out: the rest stay on',burn:['h'],need:{s:'lit',l:'lit',t:'lit'}}],
  sol:{parts:BOW(...bo_rail(0,0,4),...bo_rail(2,0,4),'v:2:1','v:3:1','v:4:1','v:5:1')}},
 {pack:'Power Grid',name:'Grand Grid',story:'The final test. Batteries, switches and burnouts all at once.',
  clue:'Fix the battery stack first. Then build two branches and give each lamp its own switch.',
  fact:'Real power grids combine all of these ideas: series batteries for more push, parallel branches for independence, and switches for control.',
  cols:5,rows:3,names:{a:'Lamp A',b:'Lamp B'},inv:{S:2},
  fixed:{'v:0:0':{t:'B',o:1},'v:0:1':{t:'B',o:-1},'v:2:0':{t:'L',id:'a'},'v:4:0':{t:'L',id:'b'}},
  tests:[{label:'Both lamps blazing',need:{a:'blazing',b:'blazing'}},{label:'Lamp A burns out: B stays on',burn:['a'],need:{b:'bright'}},{label:'Lamp B burns out: A stays on',burn:['b'],need:{a:'bright'}},{label:'Every lamp has its own switch',kind:'each'}],
  sol:{parts:Object.assign(BOW(...bo_rail(0,0,3),...bo_rail(2,0,3)),{'v:2:1':{t:'S',id:'sw1'},'v:4:1':{t:'S',id:'sw2'}}),flip:['v:0:1']}}
];
const BO_N=BO_LEVELS.length;
/*BOLEVELS>>*/
/*<<BOUI*/
const BO_PACKS={0:'Pack 1: Closed Circuits',5:'Pack 2: Parallel Power',8:'Pack 3: Power Grid'};
const BOS=120,BOP=58;
const BOT={w:['Wire','Click or drag along the lines'],S:['Switch','Opens or closes the loop'],B:['Battery','Pushes the charges'],L:['Bulb','Glows when charges flow through it']};
const BO_STATE=['off','dim','bright','blazing'];
let BO=null;
const boCur=()=>BO_LEVELS[BO.i];
const boPt=(c,r)=>[BOP+c*BOS,BOP+r*BOS];
const boEnds=k=>{const q=k.split(':'),c=+q[1],r=+q[2];return q[0]==='h'?[boPt(c,r),boPt(c+1,r)]:[boPt(c,r),boPt(c,r+1)];};
const boAllEdges=L=>{const a=[];for(let r=0;r<L.rows;r++)for(let c=0;c<L.cols;c++){if(c<L.cols-1)a.push('h:'+c+':'+r);if(r<L.rows-1)a.push('v:'+c+':'+r);}return a;};
const boPlacedCount=()=>Object.values(BO.parts).filter(p=>!p.fixed).length;
const boLeft=t=>(boCur().inv[t]||0)-Object.values(BO.parts).filter(p=>!p.fixed&&p.t===t).length;
function boIcon(t,sz){
  sz=sz||34;let b='';
  if(t==='w')b='<path d="M4 24 15 10l5 8 10-12" fill="none" stroke="#8a4f1c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 24 15 10l5 8 10-12" fill="none" stroke="#f0a35a" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>';
  else if(t==='S')b='<circle cx="7" cy="23" r="3.4" fill="#5a6794"/><circle cx="27" cy="23" r="3.4" fill="#5a6794"/><path d="M7 23 22 8" stroke="#f4b13a" stroke-width="3.6" stroke-linecap="round"/>';
  else if(t==='B')b='<rect x="5" y="9" width="24" height="16" rx="4" fill="#2d3a63" stroke="#8d97b5" stroke-width="2"/><path d="M15 12v10" stroke="#fff" stroke-width="3"/><path d="M21 15v4" stroke="#fff" stroke-width="3"/><path d="M9 17h4M23 17h4" stroke="#8d97b5" stroke-width="2"/>';
  else if(t==='L')b='<circle cx="17" cy="14" r="8.5" fill="#ffe28a" stroke="#d58a1e" stroke-width="2"/><path d="M13 14l2-4 2 4 2-4 2 4" stroke="#e8851a" stroke-width="1.6" fill="none"/><rect x="13" y="22" width="8" height="6" rx="2" fill="#8d97b5"/>';
  else b='<path d="M9 9l16 16M25 9L9 25" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 34 34" width="${sz}" height="${sz}" aria-hidden="true">${b}</svg>`;
}
const boMini=L=>{const s=14,w=(L.cols-1)*s+12,h2=(L.rows-1)*s+12;let t=`<svg viewBox="0 0 ${w} ${h2}" width="${w}" height="${h2}" class="lzmini" aria-hidden="true"><rect width="${w}" height="${h2}" rx="4" fill="#1a2238"/>`;
  for(let r=0;r<L.rows;r++)for(let c=0;c<L.cols;c++)t+=`<circle cx="${6+c*s}" cy="${6+r*s}" r="1.8" fill="#6b7595"/>`;
  Object.keys(L.fixed).forEach(k=>{const p=L.fixed[k],q=k.split(':'),c=+q[1],r=+q[2],x=6+c*s+(q[0]==='h'?s/2:0),y=6+r*s+(q[0]==='v'?s/2:0);
    t+=`<circle cx="${x}" cy="${y}" r="3.4" fill="${p.t==='L'?'#f4b13a':p.t==='B'?'#37e0c1':'#ff8a5c'}"/>`;});
  return svgEl(t+'</svg>');};
function renderBlackoutSetup(){renderLevelPicker($('boLevels'),$('boTotal'),'blackout',BO_LEVELS,BO_PACKS,boStart,boMini);}
function boStart(i){
  const L=BO_LEVELS[i];BO={i,parts:{},tool:null,hint:0,results:null,view:null,swn:0,solved:false,testing:false};
  Object.keys(L.fixed).forEach(k=>{BO.parts[k]=Object.assign({fixed:true,open:false},L.fixed[k]);});
  show('s-blackout');$('boMsg').textContent='';$('boResult').hidden=true;boCityBuild();boRender();
}
function boLiveParts(){return BO.parts;}
function boSim(){const L=boCur(),v=BO.view;return boSolve(L,BO.parts,{useState:!v,burn:v?v.burn:[],open:v?v.open:[]});}
function boSay(t,kind){const c=$('boCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),t);}
/* city skyline: one district per lamp; windows light up as that lamp glows, and all districts light in turn at the win */
function boCityBuild(){
  const L=boCur(),ids=Object.keys(L.names||{}).length?Object.keys(L.names):[...Object.values(L.fixed||{}),...Object.values(L.sol.parts)].filter(p=>p.t==='L').map(p=>p.id),n=Math.max(1,ids.length),W=640,dw=W/n;
  let s=`<defs><linearGradient id="boSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1226"/><stop offset="1" stop-color="#1b2748"/></linearGradient><radialGradient id="boDG"><stop offset="0" stop-color="#ffd76a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="84" rx="12" fill="url(#boSky)"/>`;
  for(let i=0;i<22;i++)s+=`<circle cx="${(i*97+13)%W}" cy="${(i*31+7)%34+4}" r="${i%3?.9:1.4}" fill="#fff" opacity="${.25+(i%4)*.12}"/>`;
  ids.forEach((id,i)=>{const x0=i*dw,nb=dw>200?5:4,bw=(dw-16)/nb;
    s+=`<g class="bodist" data-id="${id}" style="--d:${i}"><ellipse class="glow" cx="${x0+dw/2}" cy="58" rx="${dw*.46}" ry="34" fill="url(#boDG)"/>`;
    for(let j=0;j<nb;j++){const bh=24+((i*37+j*53)%30),bx=x0+8+j*bw,by=70-bh,bwd=bw-3;
      s+=`<rect class="bd" x="${bx}" y="${by}" width="${bwd}" height="${bh}" rx="2"/>`;
      const cols=Math.max(1,Math.floor((bwd-5)/7)),rows=Math.max(1,Math.floor((bh-6)/9));
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const wx=bx+4+c*((bwd-8)/Math.max(1,cols)+.2),k=(r*5+c*3+j+i)%5;
        s+=`<rect class="w${k%2?' a':''}" style="--o:${k}" x="${wx.toFixed(1)}" y="${by+5+r*9}" width="3.6" height="4.6" rx=".8"/>`;}}
    s+=`<text x="${x0+dw/2}" y="81" text-anchor="middle" font-size="8.5" font-weight="800" fill="#8d97b5" font-family="system-ui">${(L.names[id]||id).toUpperCase()}</text></g>`;});
  s+=`<rect y="70" width="${W}" height="3" fill="#33406a"/><text id="boCityTxt" x="12" y="14" font-size="10.5" font-weight="800" fill="#8d97b5" letter-spacing="1" font-family="system-ui">CITY POWER: OFF</text>`;
  $('boCity').innerHTML=s;
}
function boCityUpdate(){
  const sv=$('boCity');if(!sv||!BO||!BO.sim)return;const won=!!BO.solved;let lit=0,tot=0;
  sv.classList.toggle('won',won);sv.parentNode.style.maxWidth=$('boBoard').style.maxWidth;
  sv.querySelectorAll('.bodist').forEach(g=>{const l=BO.sim.lamps[g.dataset.id],on=l&&l.level>0;tot++;if(on)lit++;g.classList.toggle('on',won);g.classList.toggle('half',!won&&!!on);});
  const t=$('boCityTxt');if(t){t.textContent=won?'CITY RELIT':lit?`CITY POWER: ${lit} OF ${tot} DISTRICTS`:'CITY POWER: OFF';t.setAttribute('fill',won?'#ffd76a':lit?'#c9b36a':'#8d97b5');}
}
function boPartG(k,p,sim,view){
  const e=boEnds(k),a=e[0],b=e[1],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,ang=k[0]==='h'?0:90,I=sim.cur[k]||0,flow=Math.abs(I)>0.04;
  const wst=`stroke="#7a4616" stroke-width="10" stroke-linecap="round"`,wst2=`stroke="${flow?'#ffc56b':'#e59b52'}" stroke-width="5.5" stroke-linecap="round"`;
  const cls=p.fixed?'bofix':'bopl';
  const gl=flow?`<line class="boglow" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#ffb347" stroke-width="20" stroke-linecap="round"/>`:'';
  if(p.t==='w'){
    let s=gl+`<g class="${cls}"><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${wst}/><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${wst2}/>`;
    if(flow)s+=`<line class="boflow${I<0?' rev':''}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 17" style="animation-duration:${Math.max(.35,Math.min(1.6,1.4/Math.abs(I)))}s"/>`;
    return s+'</g>';}
  let g=(p.t!=='B'?gl:'')+`<g class="${cls}" transform="translate(${mx} ${my}) rotate(${ang})"><line x1="-${BOS/2}" y1="0" x2="${BOS/2}" y2="0" ${wst}/><line x1="-${BOS/2}" y1="0" x2="${BOS/2}" y2="0" ${wst2}/>`;
  let extra='';
  if(p.t==='L'){
    const L0=sim.lamps[p.id],lv=L0?L0.level:0,burnt=view&&view.burn&&view.burn.indexOf(p.id)>=0,r=L0?Math.min(1,L0.ratio/2.2):0;
    if(burnt){g+=`<circle r="25" fill="#2a2f45" stroke="#5a6285" stroke-width="3"/><path d="M-10 8l5-12 5 10 5-12 5 12" stroke="#7a7f99" stroke-width="2" fill="none"/><path d="M-14 -14l28 28M14 -14l-28 28" stroke="#ff6b6b" stroke-width="3" stroke-linecap="round"/>`;}
    else{
      if(lv>0)extra=`<circle cx="${mx}" cy="${my}" r="${34+r*46}" fill="url(#boGlow)" class="bobreathe" opacity="${.35+.65*Math.min(1,r*1.6)}"/>`;
      g+=`<circle r="25" fill="${lv?(lv>=3?'#fff6cf':'#ffe9a3'):'#3a4263'}" fill-opacity="${lv?.55+Math.min(.45,r):0.9}" stroke="${lv?'#ffd76a':'#6b7595'}" stroke-width="3"/><path d="M-11 9l5-13 5 11 5-13 5 13" stroke="${lv?'#ff8a1e':'#7f89aa'}" stroke-width="${lv?3:2.4}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}
  }else if(p.t==='S'){
    const op=(!view&&p.open)||(view&&(view.open==='*'||(Array.isArray(view.open)&&view.open.indexOf(p.id)>=0)));
    g+=`<rect x="-28" y="-17" width="56" height="34" rx="9" fill="#2d3a63" stroke="#8d97b5" stroke-width="2.4"/><circle cx="-18" cy="3" r="4.4" fill="#cfd6ea"/><circle cx="18" cy="3" r="4.4" fill="#cfd6ea"/><line x1="-18" y1="3" x2="${op?10:18}" y2="${op?-14:3}" stroke="${op?'#ff8a5c':'#ffd76a'}" stroke-width="5" stroke-linecap="round"/>`;
    extra='';
  }else if(p.t==='B'){
    const pos=p.o>0?1:-1;
    g+=`<rect x="-30" y="-20" width="60" height="40" rx="9" fill="#2d3a63" stroke="#8d97b5" stroke-width="2.4"/><line x1="${pos*7}" y1="-14" x2="${pos*7}" y2="14" stroke="#fff" stroke-width="5" stroke-linecap="round"/><line x1="${-pos*7}" y1="-8" x2="${-pos*7}" y2="8" stroke="#aab4d1" stroke-width="7" stroke-linecap="round"/>`+
       `<g transform="rotate(${-ang})"><text x="${ang?0:pos*21}" y="${ang?(pos*21+5):5}" text-anchor="middle" font-size="16" font-weight="900" fill="#ffd76a" font-family="system-ui">+</text><text x="${ang?0:-pos*21}" y="${ang?(-pos*21+5):5}" text-anchor="middle" font-size="18" font-weight="900" fill="#aab4d1" font-family="system-ui">−</text></g>`;
    if(sim.short)extra=`<circle cx="${mx}" cy="${my}" r="40" fill="url(#boRed)" class="lzpulse fast"/>`;
  }
  if(p.fixed)g+=`<circle cx="-24" cy="-12" r="2.2" fill="#8d97b5"/><circle cx="24" cy="12" r="2.2" fill="#8d97b5"/>`;
  return extra+g+'</g>';
}
function boSvg(){
  const L=boCur(),sim=BO.sim=boSim(),view=BO.view,w=(L.cols-1)*BOS+BOP*2,hh=(L.rows-1)*BOS+BOP*2;
  let s=`<defs><radialGradient id="boGlow"><stop offset="0" stop-color="#ffe28a" stop-opacity=".95"/><stop offset=".5" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient><radialGradient id="boRed"><stop offset="0" stop-color="#ff3355" stop-opacity=".9"/><stop offset="1" stop-color="#ff3355" stop-opacity="0"/></radialGradient></defs>`+
    `<rect width="${w}" height="${hh}" rx="16" fill="#10182e"/>`;
  boAllEdges(L).forEach(k=>{if(BO.parts[k])return;const e=boEnds(k);s+=`<line x1="${e[0][0]}" y1="${e[0][1]}" x2="${e[1][0]}" y2="${e[1][1]}" stroke="#2a3558" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 12"/>`;});
  if(BO.hint>=3){const sol=L.sol;Object.keys(sol.parts).forEach(k=>{const p=sol.parts[k],e=boEnds(k);
    s+=p.t==='w'?`<line x1="${e[0][0]}" y1="${e[0][1]}" x2="${e[1][0]}" y2="${e[1][1]}" stroke="#37e0c1" stroke-width="7" stroke-linecap="round" stroke-dasharray="10 8" opacity=".75"/>`
    :`<g transform="translate(${(e[0][0]+e[1][0])/2} ${(e[0][1]+e[1][1])/2})"><circle r="26" fill="none" stroke="#37e0c1" stroke-width="4" stroke-dasharray="8 6"/></g>`;});
    (sol.flip||[]).forEach(k=>{const e=boEnds(k);s+=`<g transform="translate(${(e[0][0]+e[1][0])/2} ${(e[0][1]+e[1][1])/2})"><rect x="-34" y="-26" width="68" height="52" rx="12" fill="none" stroke="#37e0c1" stroke-width="4" stroke-dasharray="8 6"/></g>`;});}
  Object.keys(BO.parts).forEach(k=>{s+=boPartG(k,BO.parts[k],sim,view);});
  for(let r=0;r<L.rows;r++)for(let c=0;c<L.cols;c++){const p=boPt(c,r);s+=`<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#10182e" stroke="#aab4d1" stroke-width="3"/>`;}
  /* names under lamps */
  Object.keys(BO.parts).forEach(k=>{const p=BO.parts[k];if(p.t!=='L')return;const e=boEnds(k),mx=(e[0][0]+e[1][0])/2,my=(e[0][1]+e[1][1])/2,q=k.split(':'),L0=sim.lamps[p.id],lv=L0?L0.level:0;
    const burnt=view&&view.burn&&view.burn.indexOf(p.id)>=0,nm=L.names[p.id]||p.id,st=burnt?'burned out':BO_STATE[lv];
    const tx=q[0]==='h'?mx:(+q[1]<L.cols-1?mx+40:mx-40),ty=q[0]==='h'?my+50:my-2,an=q[0]==='h'?'middle':(+q[1]<L.cols-1?'start':'end');
    s+=`<text x="${tx}" y="${ty}" text-anchor="${an}" font-size="15" font-weight="800" fill="#e8eeff" font-family="system-ui">${nm}</text><text x="${tx}" y="${ty+17}" text-anchor="${an}" font-size="13" font-weight="700" fill="${burnt?'#ff8a8a':lv?'#ffd76a':'#7f89aa'}" font-family="system-ui">${st}</text>`;});
  s+=`<line id="boHov" stroke="#6aa7ff" stroke-width="14" stroke-linecap="round" opacity=".4" style="display:none;pointer-events:none"/>`;
  const sv=$('boBoard');sv.setAttribute('viewBox',`0 0 ${w} ${hh}`);sv.style.maxWidth=Math.min(w*1.15,920)+'px';sv.innerHTML=s;
}
function boEdgeAt(cx,cy){
  const sv=$('boBoard'),L=boCur(),pt=sv.createSVGPoint();pt.x=cx;pt.y=cy;const ctm=sv.getScreenCTM();if(!ctm)return null;const q=pt.matrixTransform(ctm.inverse());
  let best=null,bd=1e9;
  boAllEdges(L).forEach(k=>{const e=boEnds(k),x1=e[0][0],y1=e[0][1],x2=e[1][0],y2=e[1][1],dx=x2-x1,dy=y2-y1;
    let t=((q.x-x1)*dx+(q.y-y1)*dy)/(dx*dx+dy*dy);t=Math.max(0,Math.min(1,t));
    const px=x1+t*dx,py=y1+t*dy,d=Math.hypot(q.x-px,q.y-py),mid=Math.hypot(q.x-(x1+x2)/2,q.y-(y1+y2)/2),sc=d+mid*.12;
    if(sc<bd){bd=sc;best={k,d};}});
  return best&&best.d<44?best.k:null;
}
function boRender(){
  const d=boCur();
  $('boLvl').textContent=BO.i+1;$('boLvlN').textContent=BO_N;$('boUsed').textContent=boPlacedCount();$('boPar').textContent=Object.keys(d.sol.parts).length;
  $('boName').textContent=d.name;$('boStory').textContent=d.story;
  $('boIntro').hidden=!d.intro;$('boIntro').textContent=d.intro||'';
  const tools=['w',...['S','B','L'].filter(t=>d.inv[t])];
  $('boTools').replaceChildren(...tools.map(t=>{const left=t==='w'?null:boLeft(t),b=h('button',{class:'tool'+(BO.tool===t?' on':''),disabled:t!=='w'&&left<=0&&BO.tool!==t,
      title:BOT[t][0]+': '+BOT[t][1]+(t==='w'?'.':'. Drag me onto the board, or click me and then click a spot.'),
      onclick:()=>{if(performance.now()<ttDrag.noClick)return;BO.tool=BO.tool===t?null:t;boRender();}},
      h('span',{class:'ti'},svgEl(boIcon(t,30))),h('span',null,h('b',null,BOT[t][0]),h('small',null,BOT[t][1])),t==='w'?null:h('span',{class:'cost'},'×'+left));
    if(t!=='w')b.addEventListener('pointerdown',e=>{if(left<=0)return;ttDragStart(e,{makeGhost:()=>h('div',{class:'dragghost'},h('span',{class:'ti'},svgEl(boIcon(t,28))),BOT[t][0]),
      drop:(x,y)=>{const k=boEdgeAt(x,y);if(k)boPlace(k,t);else boSay('Drop it right onto a line between the dots.','alert');}});});
    return b;}),
    h('button',{class:'tool'+(BO.tool==='X'?' on':''),title:'Remove tool: click a piece to take it back.',onclick:()=>{BO.tool=BO.tool==='X'?null:'X';boRender();}},
      h('span',{class:'ti'},svgEl(boIcon('X',30))),h('span',null,h('b',null,'Remove'),h('small',null,'Click a piece to take it back'))));
  const sim=boSvg();
  const S=BO.sim;
  $('boLamps').replaceChildren(...Object.keys(BO.parts).filter(k=>BO.parts[k].t==='L').map(k=>{const id=BO.parts[k].id,lv=S.lamps[id]?S.lamps[id].level:0,burnt=BO.view&&BO.view.burn&&BO.view.burn.indexOf(id)>=0;
    return h('span',{class:'lampchip'+(lv?' on':'')+(burnt?' burnt':'')},svgEl(boIcon('L',20)),` ${d.names[id]||id}: `,h('b',null,burnt?'burned out':BO_STATE[lv]));}));
  boTestsUI();boCoach();boHintUI();boCityUpdate();
  $('boTest').disabled=BO.testing;$('boTest').classList.toggle('pulse',!BO.testing&&!BO.results&&boPlacedCount()>0);
}
function boCoach(){
  const d=boCur(),S=BO.sim,ids=Object.keys(S.lamps),lit=ids.filter(i=>S.lamps[i].level>0).length;
  if(BO.testing)return boSay('Testing the city…');
  if(S.short)return boSay('SHORT CIRCUIT! A path with no lamp lets the battery empty itself. Break that direct path.','alert');
  if(!boPlacedCount()&&!Object.values(BO.parts).some(p=>p.t==='w'))return boSay(BO.tool==='w'?'Click the dashed lines between the dots, or drag along them, to lay wire.':'Pick the Wire tool in step 1, then drag along the dashed lines.');
  if(!lit)return boSay('No current is flowing yet. Is there a closed loop all the way around?');
  boSay(`${lit} of ${ids.length} lamps are glowing. When you think it is right, press Test the city.`);
}
function boPlace(k,t){
  const L=boCur();if(BO.parts[k]){boSay('That spot is taken. Pick an empty line.','alert');return;}
  if(t==='w'){BO.parts[k]={t:'w'};}
  else{if(boLeft(t)<=0){boSay('You are out of those.','alert');return;}
    BO.parts[k]=t==='S'?{t:'S',id:'sw'+(++BO.swn),open:false}:t==='B'?{t:'B',o:1}:{t:'L',id:'x'+(++BO.swn)};}
  boChanged();
}
function boChanged(){BO.results=null;BO.view=null;BO.solved=false;$('boResult').hidden=true;boRender();}
function boTestsUI(){
  const d=boCur(),R=BO.results;
  $('boTestList').replaceChildren(...d.tests.map((t,i)=>{const r=R&&R[i];
    return h('li',{class:r?(r.ok?'ok':'bad'):''},h('span',{class:'tk'},r?(r.ok?'✓':'✗'):'○'),h('span',null,t.label,r&&!r.ok&&r.why?h('small',null,' '+r.why):null));}));
}
async function boRunTests(){
  if(BO.testing)return;const d=boCur(),my=runId;BO.testing=true;BO.results=d.tests.map(()=>null);BO.view=null;$('boResult').hidden=true;boRender();
  const all=boTests(d,BO.parts);
  for(let i=0;i<d.tests.length;i++){
    const t=d.tests[i];BO.view=t.kind==='each'?null:{burn:t.burn||[],open:t.open||[]};
    BO.results=all.map((r,j)=>j<i?r:null);boRender();$('boTestList').children[i]&&$('boTestList').children[i].classList.add('run');
    await sleep(750);if(my!==runId||!BO)return;
    BO.results=all.map((r,j)=>j<=i?r:null);BO.view=null;boRender();await sleep(280);if(my!==runId||!BO)return;}
  BO.testing=false;BO.view=null;BO.results=all;boRender();
  if(all.every(r=>r.ok))boWin();else{fx.pop({icon:'question',text:'Not yet',kind:'oops'});boSay(all.find(r=>!r.ok).why||'One of the tests failed. Read the red note.','alert');}
}
function boWin(){
  const d=boCur(),n=boPlacedCount(),par=Object.keys(d.sol.parts).length,stars=n<=par?3:n<=par+2?2:1;
  BO.solved=true;boCityUpdate();
  if(!(BO.rec>=stars)){BO.rec=stars;recordStars('blackout',BO.i+1,stars,{parts:n,par});}
  fx.pop({icon:'bolt',text:stars===3?'City relit!':'Lights on!',kind:'great',size:'big'});fx.confetti(stars===3?90:50);
  levelResult($('boResult'),{stars,next:BO.i+1<BO_N,
    line:['You used ',h('b',null,n),` piece${n>1?'s':''}. The 3-star target is `,h('b',null,par),'.',stars<3?' Can you do it with fewer?':' Efficient wiring!'],
    fact:d.fact,onNext:()=>boStart(BO.i+1),onRetry:()=>{$('boResult').hidden=true;},onLevels:()=>{renderBlackoutSetup();show('s-blackout-setup');}});
}
function boHintUI(){
  const d=boCur(),n=BO.hint;
  $('boHintTxt').textContent=['Need a hint?','Another hint','Show me the answer','Answer shown'][n];$('boHint').disabled=n>=3;
  const b=$('boHintBox'),cnt={};Object.values(d.sol.parts).forEach(p=>{cnt[p.t]=(cnt[p.t]||0)+1;});
  const nm={w:'wire',S:'switch',B:'battery',L:'bulb'},list=Object.keys(cnt).map(t=>cnt[t]+' '+nm[t]+(cnt[t]>1?'s':''));
  b.hidden=n===0;b.replaceChildren(...[n>=1?h('div',null,I('bulb'),' ',h('b',null,'Clue: '),d.clue):null,
    n>=2?h('div',null,I('lens'),' ',h('b',null,'Pieces: '),'This level can be solved with '+Object.keys(d.sol.parts).length+' pieces: '+andList(list)+'.'+(d.sol.flip?' You will also need to flip a battery.':'')):null,
    n>=3?h('div',null,I('eye'),' ',h('b',null,'Answer: '),'The teal dashes on the board show where the pieces go.'+(d.sol.flip?' The teal box shows which battery to flip.':'')):null]);
}
$('boHint').onclick=()=>{if(BO.hint<3){BO.hint++;boRender();}};
$('boTest').onclick=boRunTests;
$('boClear').onclick=()=>{const L=boCur();BO.parts={};Object.keys(L.fixed).forEach(k=>{BO.parts[k]=Object.assign({fixed:true,open:false},L.fixed[k]);});BO.swn=0;boChanged();};
$('boBack').onclick=()=>{renderBlackoutSetup();show('s-blackout-setup');};
(()=>{const sv=$('boBoard');let paint=null;
  const apply=k=>{if(!k)return;const p=BO.parts[k];
    if(paint.mode==='add'&&!p){BO.parts[k]={t:'w'};paint.n++;}
    else if(paint.mode==='erase'&&p&&!p.fixed&&p.t==='w'){delete BO.parts[k];paint.n++;}};
  sv.addEventListener('pointerdown',e=>{
    if(BO.testing)return;const k=boEdgeAt(e.clientX,e.clientY);if(!k)return;const p=BO.parts[k];
    if((BO.tool==='w'&&(!p||p.t==='w'&&!p.fixed))||(BO.tool==='X'&&p&&p.t==='w'&&!p.fixed)){
      paint={mode:(p&&p.t==='w')?'erase':'add',n:0,id:e.pointerId,x:e.clientX,y:e.clientY};apply(k);try{sv.setPointerCapture(e.pointerId);}catch(_){}
      if(paint.n)boRender();return;}
    ttDragStart(e,{
      makeGhost:()=>p&&!p.fixed&&p.t!=='w'?h('div',{class:'dragghost'},h('span',{class:'ti'},svgEl(boIcon(p.t,28))),BOT[p.t][0]):h('div',{style:'display:none'}),
      drop:(x,y)=>{if(!p||p.fixed||p.t==='w')return;const k2=boEdgeAt(x,y),r=$('boBoard').getBoundingClientRect();
        const inside=x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
        if(!inside){delete BO.parts[k];boChanged();return;}
        if(k2&&k2!==k&&!BO.parts[k2]){BO.parts[k2]=p;delete BO.parts[k];boChanged();}},
      click:()=>{
        if(p){
          if(BO.tool==='X'&&!p.fixed){delete BO.parts[k];boChanged();return;}
          if(p.t==='S'){p.open=!p.open;BO.results=null;BO.solved=false;$('boResult').hidden=true;boRender();return;}
          if(p.t==='B'){p.o=-p.o;boChanged();return;}
          if(p.t==='w'&&!p.fixed&&BO.tool==='X'){delete BO.parts[k];boChanged();return;}
          if(p.t==='L')boSay('Lamps stay where they are. Wire to them!');return;}
        if(BO.tool&&BO.tool!=='w'&&BO.tool!=='X'){boPlace(k,BO.tool);return;}
        boSay(BO.tool==='X'?'Nothing to remove there.':'Pick a tool in step 1 first.');}});
  });
  sv.addEventListener('pointermove',e=>{
    if(paint&&e.pointerId===paint.id){const n0=paint.n;const sx=paint.x,sy=paint.y;
      for(let t=1;t<=6;t++)apply(boEdgeAt(sx+(e.clientX-sx)*t/6,sy+(e.clientY-sy)*t/6));
      paint.x=e.clientX;paint.y=e.clientY;if(paint.n!==n0)boRender();return;}
    const hv=$('boHov');if(!hv)return;const k=boEdgeAt(e.clientX,e.clientY);
    if(k&&BO.tool&&BO.tool!=='X'&&!BO.parts[k]){const en=boEnds(k);hv.setAttribute('x1',en[0][0]);hv.setAttribute('y1',en[0][1]);hv.setAttribute('x2',en[1][0]);hv.setAttribute('y2',en[1][1]);hv.style.display='';}else hv.style.display='none';});
  const endp=e=>{if(paint&&e.pointerId===paint.id){const n=paint.n;paint=null;if(n){BO.results=null;BO.view=null;BO.solved=false;$('boResult').hidden=true;boRender();}}};
  sv.addEventListener('pointerup',endp);sv.addEventListener('pointercancel',endp);
  sv.addEventListener('pointerleave',()=>{const hv=$('boHov');if(hv)hv.style.display='none';});
})();
/*BOUI>>*/
