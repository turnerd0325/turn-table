/* ================= PHYSICS 1: SPACE COURIER (MS-PS2-2) =================
   Plan every thruster burn BEFORE launch, then watch the pod fly. In space nothing slows the pod
   down: with no force it keeps moving (1st law). The same push changes a heavier pod's speed less
   (2nd law). Dock exactly at the station with zero speed. */
/* units: half-cells. small burn changes speed by 2/m half-cells per step; big burn by 4/m */
const SC_TOOLS=[['c','Coast','·'],['f','Push forward','▶'],['r','Push backward','◀'],['F','Big push forward','⏩'],['R','Big push backward','⏪']];
const scDv=(k,m)=>({c:0,f:2/m,r:-2/m,F:4/m,R:-4/m})[k];
function scRun(L,plan){const out=[];let x=0,v=L.v0*2;const D=L.D*2;
  for(let i=0;i<plan.length;i++){v+=scDv(plan[i],L.m);x+=v;out.push({x,v,k:plan[i]});if((D>=0&&x>D)||(D<0&&x<D)){out.crash=i;break;}}
  const last=out[out.length-1]||{x:0,v:L.v0*2};out.ok=out.crash==null&&last.x===D&&last.v===0;out.end=last;return out;}
function scSolve(L){const tools=L.big?['c','f','r','F','R']:['c','f','r'];let best=null;
  const go=(plan)=>{if(plan.length===L.T){const r=scRun(L,plan);if(r.ok){const burns=plan.filter(k=>k!=='c').length;if(!best||burns<best.b)best={p:plan.slice(),b:burns};}return;}
    for(const k of tools){plan.push(k);go(plan);plan.pop();}};go([]);return best;}
const SCL=(name,story,o)=>Object.assign({name,story,m:1,v0:0,big:false},o);
const SC_LEVELS=[
  SCL('Already Moving','Your pod is already drifting toward the station at 1 space per second.',{v0:1,D:4,T:5,
    intro:'In space there is no friction. With **no force**, a moving pod keeps moving at the same speed. Plan each second of the trip, then press **Launch**. Dock exactly at the station with a speed of 0.',
    fact:'Newton’s first law: an object keeps moving at the same speed and direction unless a force acts on it. Out in space, a pod could coast for years.',
    clue:'The pod is already moving. Does it need a push to keep going? What does it need to STOP?'}),
  SCL('Start and Stop','The pod is sitting still. The station is 4 spaces away.',{D:4,T:5,
    fact:'A force is needed to START moving and another force is needed to STOP. Coasting in between costs no fuel at all.',
    clue:'One push to get going, coast, then one push the other way to stop.'}),
  SCL('Speed Run','Deliver the package 6 spaces away in only 5 seconds.',{D:6,T:5,
    fact:'Two pushes in a row make the pod go twice as fast. Each push changes the speed by the same amount.',
    clue:'Coasting at speed 1 is too slow. What if you push twice before coasting?'}),
  SCL('Heavy Cargo','The pod is loaded with 2 crates, so it has twice the mass.',{m:2,D:4,T:6,
    intro:'Same thrusters, but **twice the mass**. Watch how much each push changes the speed now.',
    fact:'Newton’s second law: the same force changes the speed of a heavier object less. Twice the mass means half the change in speed.',
    clue:'With 2 crates, one push only gets the pod to half speed. How many pushes does it take to reach speed 1?'}),
  SCL('Bigger Thrusters','Heavy pod again, but now you have big thrusters too.',{m:2,D:4,T:5,big:true,
    fact:'A bigger force makes a bigger change in speed. A big push on a heavy pod can do what a small push does on a light pod.',
    clue:'A big push is twice the force. On a pod with twice the mass, what speed change does that make?'}),
  SCL('Heavy Deadline','Heavy pod, 6 spaces, only 5 seconds.',{m:2,D:6,T:5,big:true,
    fact:'To make a heavy object speed up or slow down quickly, you need a large force. That is why big trucks need bigger engines and better brakes than cars.',
    clue:'This is the Speed Run plan, but the pod is twice as heavy. Which thrusters keep the same pattern working?'}),
  SCL('Too Fast!','The pod is racing toward the station at 2 spaces per second.',{v0:2,D:5,T:5,
    fact:'Slowing down is a change in motion too, so it also needs a force. A push opposite to the motion slows an object down.',
    clue:'If you do nothing, the pod crashes into the station. When should you slow it down?'}),
  SCL('Back Up','The station is BEHIND you, 3 spaces back.',{D:-3,T:4,
    fact:'Force has a direction. A push backward makes a still pod move backward, and a push forward stops it.',
    clue:'Which way must the first push go? Which way stops it?'}),
  SCL('Heavy and Fast','A heavy pod is already drifting forward at 1 space per second.',{m:2,v0:1,D:5,T:6,
    fact:'The heavier and faster an object is, the more it takes to stop it. Engineers plan braking forces using both mass and speed.',
    clue:'A heavy pod needs TWO small pushes to stop from speed 1. Count the spaces it travels while slowing down.'})
];
const SC_PACKS={0:'Pack 1: Keep on moving',3:'Pack 2: Mass matters',6:'Pack 3: Tricky deliveries'};
const scFmt=v=>{const s=v/2;return (Number.isInteger(s)?String(s):s.toFixed(1)).replace('-','−');};
/* ---------------- board: parallax starfield, docking ring, real pod ---------------- */
const SCB={W:720,H:240,TY:150};
function scGeo(L){const lo=Math.min(0,L.D)-1,hi=Math.max(L.D,0)+2,n=hi-lo,cw=(SCB.W-80)/n;return {lo,hi,cw,X:x=>40+(x-lo)*cw};}
function scStars(n,seed,w,r0,op){let t='';for(let i=0;i<n;i++){const x=((i*97+seed*31)%(w+240))-120,y=(i*53+seed*17)%SCB.H,r=r0*(i%3?1:1.6);t+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(op*(.5+(i%4)*.17)).toFixed(2)}"/>`;}return t;}
function scPod(L){
  const crates=Array.from({length:L.m},(_,i)=>`<g transform="translate(${-20+i*16} -40)"><rect width="15" height="14" rx="2.5" fill="#c98a3a" stroke="#7a4a1a" stroke-width="1.5"/><path d="M0 7h15M7.5 0v14" stroke="#7a4a1a" stroke-width="1" opacity=".6"/></g>`).join('');
  return `<g class="scflame back" opacity="0"><path d="M-30 -9L-62 0L-30 9Z" fill="#ff8a3a"/><path d="M-30 -5L-48 0L-30 5Z" fill="#ffe27a"/></g><g class="scflame backbig" opacity="0"><path d="M-30 -12L-86 0L-30 12Z" fill="#ff6a2a"/><path d="M-30 -7L-62 0L-30 7Z" fill="#ffe27a"/></g>`+
  `<g class="scflame front" opacity="0"><path d="M30 -9L62 0L30 9Z" fill="#ff8a3a"/><path d="M30 -5L48 0L30 5Z" fill="#ffe27a"/></g><g class="scflame frontbig" opacity="0"><path d="M30 -12L86 0L30 12Z" fill="#ff6a2a"/><path d="M30 -7L62 0L30 7Z" fill="#ffe27a"/></g>`+
  `<rect x="-34" y="-8" width="8" height="16" rx="2" fill="#5a6488"/><rect x="26" y="-8" width="8" height="16" rx="2" fill="#5a6488"/>`+
  `<rect x="-28" y="-22" width="56" height="44" rx="18" fill="url(#scHull)" stroke="#8d97c5" stroke-width="2"/><path d="M-12 -21V21M8 -21V21" stroke="#9aa6cc" stroke-width="1.2" opacity=".6"/><rect x="-26" y="10" width="52" height="5" fill="#ff8a3a" opacity=".85"/>`+
  `<circle cx="14" cy="-3" r="8" fill="url(#scGlass)" stroke="#5a6488" stroke-width="2"/><circle cx="11" cy="-6" r="2.4" fill="#fff" opacity=".7"/>`+crates;
}
function scBoard(G){
  const L=G.L,S=G.st,{lo,hi,X}=scGeo(L),W=SCB.W,H=SCB.H,TY=SCB.TY;
  let t=`<defs><radialGradient id="scSpace" cx=".3" cy=".3" r="1"><stop offset="0" stop-color="#1a2160"/><stop offset=".6" stop-color="#0b1130"/><stop offset="1" stop-color="#05081c"/></radialGradient>
<radialGradient id="scNeb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#b05cff" stop-opacity=".35"/><stop offset="1" stop-color="#b05cff" stop-opacity="0"/></radialGradient>
<radialGradient id="scNeb2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2fd1c7" stop-opacity=".28"/><stop offset="1" stop-color="#2fd1c7" stop-opacity="0"/></radialGradient>
<linearGradient id="scHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#dfe6f3"/><stop offset="1" stop-color="#9aa6c6"/></linearGradient>
<radialGradient id="scGlass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#2f6bff"/></radialGradient>
<linearGradient id="scMod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eef8"/><stop offset="1" stop-color="#8a95b8"/></linearGradient>
<pattern id="scPanel" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#1d3f8a"/><path d="M0 0H8V8" stroke="#6fa0ff" stroke-width=".8" fill="none"/></pattern>
<radialGradient id="scPlanet" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#7fc4ff"/><stop offset=".6" stop-color="#2f6bc0"/><stop offset="1" stop-color="#0b2a5a"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#scSpace)"/><ellipse cx="180" cy="70" rx="200" ry="90" fill="url(#scNeb)"/><ellipse cx="560" cy="190" rx="220" ry="80" fill="url(#scNeb2)"/>`;
  t+=`<g class="scl0">${scStars(70,1,W,.8,.5)}</g><g class="scl1">${scStars(40,2,W,1.1,.75)}</g>`;
  t+=`<circle cx="70" cy="${H+150}" r="190" fill="url(#scPlanet)"/><path d="M-120 ${H+40}a190 190 0 0 1 380 0" stroke="#bfe6ff" stroke-width="3" fill="none" opacity=".35"/>`;
  t+=`<g class="scl2">${scStars(18,3,W,1.6,1)}</g>`;
  /* distance ruler */
  t+=`<path d="M${X(lo)} ${TY+42}H${X(hi)}" stroke="#3a4a7a" stroke-width="2"/>`;
  for(let x=lo;x<=hi;x++)t+=`<path d="M${X(x)} ${TY+36}v12" stroke="#5a6a9a" stroke-width="2"/><text x="${X(x)}" y="${TY+64}" text-anchor="middle" font-size="12" fill="#a9b3e0" font-weight="800">${x}</text>`;
  t+=`<path d="M${X(lo)} ${TY}H${X(hi)}" stroke="#6f7fc0" stroke-width="1.5" stroke-dasharray="2 7" opacity=".7"/>`;
  /* trail */
  (S.trail||[]).forEach(p=>{t+=`<circle cx="${X(p.x/2)}" cy="${TY}" r="3.5" fill="#ffd34d" opacity=".55"/>`;});
  /* station: module above, truss down to a docking ring */
  const dx=X(L.D),dock=S.dock||'wait',lc=dock==='ok'?'#3fd18a':dock==='miss'?'#ff5a4f':'#ffd34d';
  t+=`<g class="scstation"><rect x="${dx-70}" y="14" width="44" height="34" fill="url(#scPanel)" stroke="#9fb6ff" stroke-width="1"/><rect x="${dx+26}" y="14" width="44" height="34" fill="url(#scPanel)" stroke="#9fb6ff" stroke-width="1"/><path d="M${dx-26} 31H${dx+26}" stroke="#9aa6c6" stroke-width="4"/>`+
    `<rect x="${dx-22}" y="10" width="44" height="54" rx="12" fill="url(#scMod)" stroke="#6a75a0" stroke-width="2"/><circle cx="${dx}" cy="28" r="6" fill="url(#scGlass)"/><text x="${dx}" y="54" text-anchor="middle" font-size="9" font-weight="900" fill="#13203d">DOCK</text>`+
    `<path d="M${dx-4} 64V${TY-30}M${dx+4} 64V${TY-30}" stroke="#9aa6c6" stroke-width="3"/>${[80,96,112].map(y=>`<path d="M${dx-4} ${y}l8 8M${dx+4} ${y}l-8 8" stroke="#9aa6c6" stroke-width="1.5"/>`).join('')}`+
    `<ellipse cx="${dx}" cy="${TY}" rx="14" ry="32" fill="none" stroke="#5a6488" stroke-width="9"/><ellipse cx="${dx}" cy="${TY}" rx="14" ry="32" fill="none" stroke="#c9d2ee" stroke-width="4"/>`+
    [-26,-9,9,26].map((y,i)=>`<circle class="sclight" cx="${dx+(i%2?12:-12)*.5}" cy="${TY+y}" r="3.2" fill="${lc}" style="animation-delay:${i*.2}s"/>`).join('')+
    `<g class="scclamp${dock==='ok'?' shut':''}" style="transform-origin:${dx}px ${TY-32}px"><path d="M${dx-3} ${TY-32}l-16 -12h-8" stroke="#ffd34d" stroke-width="4" fill="none" stroke-linecap="round"/></g>`+
    `<g class="scclamp b${dock==='ok'?' shut':''}" style="transform-origin:${dx}px ${TY+32}px"><path d="M${dx-3} ${TY+32}l-16 12h-8" stroke="#ffd34d" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>`;
  /* pod */
  const px=X((S.pos!=null?S.pos:0)/2);
  t+=`<g class="scpod" transform="translate(${px.toFixed(1)} ${TY})">${scPod(L)}</g>`;
  /* the front half of the ring goes over the pod */
  t+=`<path d="M${dx} ${TY-32}a14 32 0 0 1 0 64" fill="none" stroke="#c9d2ee" stroke-width="4" pointer-events="none"/>`;
  t+=`<g class="scchip" transform="translate(${px.toFixed(1)} ${TY-64})"><rect x="-46" y="-13" width="92" height="22" rx="11" fill="#13203d" stroke="#5a6a9a" stroke-width="1.5" opacity=".92"/><text y="3" text-anchor="middle" font-size="11.5" font-weight="900" fill="#ffd34d">speed ${S.vShow!=null?scFmt(S.vShow):scFmt(L.v0*2)}</text></g>`;
  t+=`<g class="sctime"><rect x="${W-112}" y="${H-34}" width="100" height="24" rx="12" fill="#13203d" opacity=".85"/><text x="${W-62}" y="${H-17}" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">time ${S.sec||0} s</text></g>`;
  t+=`<g class="sccall" opacity="${S.call?1:0}"><rect x="${W/2-190}" y="${H-80}" width="380" height="30" rx="15" fill="#13203d" stroke="#ffd34d" stroke-width="2" opacity=".95"/><text x="${W/2}" y="${H-60}" text-anchor="middle" font-size="13" font-weight="900" fill="#ffd34d">${ngEsc(S.call||'')}</text></g>`;
  const svg=ngSvg(W,H,t,'ngsvg scsvg','The pod, the docking station and a distance ruler');
  S.el={svg,pod:svg.querySelector('.scpod'),chip:svg.querySelector('.scchip'),chipT:svg.querySelector('.scchip text'),time:svg.querySelector('.sctime text'),
    l0:svg.querySelector('.scl0'),l1:svg.querySelector('.scl1'),l2:svg.querySelector('.scl2'),fl:[...svg.querySelectorAll('.scflame')],X};
  scParallax(S.el,px-X(0));
  return svg;
}
function scParallax(E,d){[[E.l0,.04],[E.l1,.1],[E.l2,.22]].forEach(([g,k])=>g&&g.setAttribute('transform',`translate(${(-d*k).toFixed(1)} 0)`));}
function scFrame(G,pos,burn,v,sec){const S=G.st,E=S.el;if(!E)return;const px=E.X(pos/2);
  E.pod.setAttribute('transform',`translate(${px.toFixed(1)} ${SCB.TY})`);E.chip.setAttribute('transform',`translate(${px.toFixed(1)} ${SCB.TY-64})`);
  E.chipT.textContent='speed '+scFmt(v);if(sec!=null)E.time.textContent=`time ${sec} s`;
  const on={back:burn==='f',backbig:burn==='F',front:burn==='r',frontbig:burn==='R'};
  E.fl.forEach(f=>{const k=[...f.classList].find(c=>c in on);f.setAttribute('opacity',on[k]?1:0);});
  scParallax(E,px-E.X(0));}
ngDef({key:'courier',name:'Space Courier',ic:'rocket',std:'MS-PS2-2',subj:'phys',cap3:true,
  short:'Plan thruster burns to dock a pod in space.',menuDesc:'Plan every thruster burn before launch. In space, the pod keeps moving until a force stops it.',
  intro:'Deliver packages across space. There is no friction in space, so the pod only changes speed when a thruster pushes it. Plan every second of the trip first, then launch. Stop inside the docking ring with zero speed. Dock on the first launch for 3 stars.',
  how:['**Pick a thruster** from the toolbox, then **tap the seconds** in the flight plan.','Every empty second is a coast: the pod keeps its speed.','Press **Launch**. Stop exactly in the docking ring with speed 0.'],
  levels:SC_LEVELS,packs:SC_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 24" width="48" height="26" aria-hidden="true"><rect width="44" height="24" rx="4" fill="#0b1130"/><ellipse cx="${L.D>=0?36:8}" cy="12" rx="3" ry="7" fill="none" stroke="#c9d2ee" stroke-width="2"/><rect x="${L.D>=0?8:26}" y="9" width="10" height="7" rx="3" fill="#e8eef8"/>${L.m>1?'<rect x="9" y="5" width="4" height="4" fill="#c98a3a"/><rect x="14" y="5" width="4" height="4" fill="#c98a3a"/>':''}</svg>`),
  start(G){G.st={plan:Array(G.L.T).fill('c'),tool:'f',pos:0,trail:[],res:null,running:false,burn:null,crash:false,msg:null,dock:'wait',call:null,sec:0,vShow:null,el:null};},
  hud(G){return {label:'Launches',val:G.tries,target:'3 ★ = dock on the first launch'};},
  render(G,main,side){
    const L=G.L,S=G.st,show=G.i<3||G.hint>=1,prev=scRun(L,S.plan);
    if(S.running&&S.el&&S.el.svg.isConnected){/* keep the live board while flying */}
    else{const rows=S.plan.map((k,i)=>{const pr=prev[i];return h('button',{type:'button',class:'scslot k'+k+(S.res&&S.res.crash===i?' bad':''),disabled:S.running||G.done,'aria-label':`Second ${i+1}: ${SC_TOOLS.find(x=>x[0]===k)[1]}`,
        onclick:()=>{S.plan[i]=S.plan[i]===S.tool?'c':S.tool;scReset(S);ngRender();const b=$('ngMain').querySelectorAll('.scslot')[i];if(b)Art.pop(b,1.1);}},h('small',null,(i+1)+'s'),h('b',null,SC_TOOLS.find(x=>x[0]===k)[2]),
        show&&pr?h('span',{class:'scv'},'speed '+scFmt(pr.v)):null);});
      ngRC(main,h('div',{class:'scwrap'},scBoard(G)),h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Flight plan',h('small',null,show?'each box shows the speed after that second':'Hint 1 shows the speed after each second')),h('div',{class:'scplan'},...rows),
        h('div',{class:'scinfo'},`Start: position 0, speed ${L.v0}. Dock at ${L.D}. Mass: ${L.m} crate${L.m>1?'s':''}. One small push changes the speed by ${scFmt(2/L.m)}${L.big?`; a big push by ${scFmt(4/L.m)}`:''}.`));}
    const tools=SC_TOOLS.filter(x=>L.big||!'FR'.includes(x[0]));
    ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Thruster toolbox'),
      h('div',{class:'sctools'},...tools.map(([k,n,s])=>h('button',{type:'button',class:'ngc sctool'+(S.tool===k?' on':''),disabled:S.running||G.done,onclick:()=>{S.tool=k;ngRender();}},h('b',null,s),h('small',null,n)))),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      ngBtn([I('rocket'),' Launch!'],scLaunch,'good',{style:'width:100%;font-size:19px',disabled:S.running||G.done}),
      ngBtn('Clear plan',()=>{S.plan=Array(L.T).fill('c');scReset(S);ngRender();},'ghost sm',{style:'width:100%',disabled:S.running||G.done}));
    if(!S.running&&!S.msg)ngSay('Plan the whole trip, then launch. Remember: with no push, the pod keeps its speed.');
  },
  hints(G){const L=G.L,b=scSolve(L);return [L.clue,'Each second: first the thruster changes the speed, then the pod moves by its speed. A coast keeps the same speed. You must end with speed 0 exactly in the docking ring.',
    b?'One plan that works: '+b.p.map((k,i)=>`${i+1}s ${SC_TOOLS.find(x=>x[0]===k)[2]}`).join(', ')+'.':''];}
});
function scReset(S){S.res=null;S.msg=null;S.pos=0;S.trail=[];S.crash=false;S.dock='wait';S.call=null;S.sec=0;S.vShow=null;}
function scLaunch(){
  const L=G.L,S=G.st;if(S.running||G.done)return;if(ngT())return ngTDone(scRun(L,S.plan).ok?1:0);G.tries++;const r=scRun(L,S.plan);
  scReset(S);S.running=true;ngRender();
  /* steps: each second tweens from the old x to the new x; after a miss the pod keeps drifting */
  const steps=[];let x=0,v=L.v0*2;r.forEach((p,i)=>{steps.push({x0:x,x1:p.x,k:p.k,v:p.v,sec:i+1,p});x=p.x;v=p.v;});
  const drift=!r.ok&&(r.crash!=null||r.end.v!==0);if(drift)for(let j=0;j<3;j++){steps.push({x0:x,x1:x+v,k:'c',v,sec:null,drift:true});x+=v;}
  const g0=G,fin=()=>{if(G!==g0)return;S.running=false;S.burn=null;S.pos=r.end.x;S.vShow=r.end.v;S.sec=r.length;S.trail=r.slice();S.res=r;scDone(r);};
  if(Art.reduced())return fin();
  const DUR=560;let i=0,t0=0;
  const tick=now=>{if(G!==g0||G.st!==S||!S.running)return;if(!t0)t0=now;const st=steps[i];if(!st)return fin();
    const f=Math.min(1,(now-t0)/DUR),pos=st.x0+(st.x1-st.x0)*f;scFrame(G,pos,f<.6?st.k:null,st.v,st.sec);
    if(st.drift&&!S.call){S.call=`No friction: it keeps moving at speed ${scFmt(st.v)}!`;const c=S.el.svg.querySelector('.sccall');if(c){c.setAttribute('opacity',1);c.querySelector('text').textContent=S.call;}}
    if(f>=1){if(st.p){S.trail.push(st.p);const tr=S.el.svg.querySelector('.scpod');if(tr)tr.insertAdjacentHTML('beforebegin',`<circle cx="${S.el.X(st.p.x/2)}" cy="${SCB.TY}" r="3.5" fill="#ffd34d" opacity=".55"/>`);}i++;t0=now;}
    requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
}
function scDone(r){
  const L=G.L,S=G.st,e=r.end;
  if(r.ok){S.dock='ok';S.msg=['ok','✓ Docked perfectly: inside the ring with speed 0!'];ngRender();ngSay('Perfect docking! The clamps close.','go');G.detail={launches:G.tries};
    const ring=$('ngMain').querySelector('.scstation');if(ring)Art.burstAt(ring,{n:16,colors:['#3fd18a','#ffd34d','#fff'],shape:['star','dot'],speed:170});
    ngWin(ngStars(G.tries-1,0,1),['You docked on launch ',h('b',null,G.tries),'.']);return;}
  G.miss++;S.dock='miss';let m;
  if(r.crash!=null)m=`In second ${r.crash+1} the pod flew past the dock at speed ${scFmt(r[r.crash].v)}. With no friction it just keeps going. It needed a push the other way sooner.`;
  else if(e.v!==0)m=`The pod is still moving at speed ${scFmt(e.v)} at the end. With no force to stop it, it keeps going! Add a push the other way.`;
  else m=`The pod stopped at ${scFmt(e.x)}, not at the dock (${L.D}). ${Math.abs(e.x)<Math.abs(L.D*2)?'It stopped short.':'It went too far.'} Change when you push.`;
  if(r.crash!=null||e.v!==0){S.call=`No friction: it keeps moving at speed ${scFmt(r.crash!=null?r[r.crash].v:e.v)}!`;S.pos=r.end.x+3*(r.crash!=null?r[r.crash].v:e.v);}
  else S.call=Math.abs(e.x)<Math.abs(L.D*2)?'Stopped short of the ring':'Stopped past the ring';
  S.msg=['no',m];fx.pop({icon:'rocket',text:r.crash!=null?'Flew past the dock!':'Missed the dock',kind:'oops'});ngRender();ngSay(m,'alert');
}
NGTHUMB.courier=()=>{
  let t=`<defs><linearGradient id="tcHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9aa6c6"/></linearGradient><radialGradient id="tcNeb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#b05cff" stop-opacity=".45"/><stop offset="1" stop-color="#b05cff" stop-opacity="0"/></radialGradient></defs><ellipse cx="90" cy="60" rx="140" ry="70" fill="url(#tcNeb)"/>`;
  for(let i=0;i<34;i++)t+=`<circle cx="${(i*83)%320}" cy="${(i*47)%180}" r="${i%3?1.1:1.9}" fill="#fff" opacity=".7"/>`;
  t+=`<rect x="248" y="18" width="40" height="44" rx="10" fill="#dfe6f3" stroke="#6a75a0" stroke-width="2"/><rect x="214" y="26" width="30" height="24" fill="#1d3f8a" stroke="#9fb6ff"/><rect x="292" y="26" width="26" height="24" fill="#1d3f8a" stroke="#9fb6ff"/><path d="M268 62V82" stroke="#9aa6c6" stroke-width="4"/><ellipse cx="268" cy="108" rx="12" ry="28" fill="none" stroke="#c9d2ee" stroke-width="6"/>`+
    `<g transform="translate(130 108)"><path d="M-36 -12L-86 0L-36 12Z" fill="#ff6a2a"/><path d="M-36 -6L-62 0L-36 6Z" fill="#ffe27a"/><rect x="-36" y="-26" width="72" height="52" rx="20" fill="url(#tcHull)" stroke="#8d97c5" stroke-width="3"/><circle cx="18" cy="-3" r="10" fill="#4fa3ff"/><rect x="-26" y="-46" width="18" height="18" rx="3" fill="#c98a3a"/><rect x="-6" y="-46" width="18" height="18" rx="3" fill="#c98a3a"/></g>`+ngStar(30,30,7);
  return ngWrap('courier','#0b1130',t);
};
