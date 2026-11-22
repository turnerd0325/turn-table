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
/* ---------------- the space scene ---------------- */
const SC_W=640,SC_H=230,SC_Y=112;
function scGeo(L){const lo=Math.min(0,L.D)-(L.D<0?2:1),hi=Math.max(L.D,0)+(L.D<0?1:3),n=hi-lo,cw=(SC_W-60)/n;return {lo,hi,cw,X:x=>30+(x-lo)*cw};}
function scStars(n,seed,r0,op){let t='';for(let i=0;i<n;i++){const x=(i*137+seed*53)%SC_W,y=(i*71+seed*29)%(SC_H-8)+4,r=r0*(.6+((i*7)%5)/6);t+=`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="#fff" opacity="${(op*(.5+((i*3)%4)/6)).toFixed(2)}"/><circle cx="${x+SC_W}" cy="${y}" r="${r.toFixed(2)}" fill="#fff" opacity="${(op*(.5+((i*3)%4)/6)).toFixed(2)}"/>`;}return t;}
function scPodSvg(m){
  let t=`<g class="scflR"><path d="M-33 -7C-48 -9 -64 -4 -74 0C-64 4 -48 9 -33 7Z" fill="url(#scfl)"/><path d="M-33 -4C-42 -4 -50 -2 -55 0C-50 2 -42 4 -33 4Z" fill="#fffbe0"/></g>`+
    `<g class="scflF"><path d="M22 -15C32 -20 46 -22 56 -21C46 -16 34 -12 24 -11Z" fill="url(#scfl2)"/><path d="M22 15C32 20 46 22 56 21C46 16 34 12 24 11Z" fill="url(#scfl2)"/></g>`+
    `<path d="M-24 -14L-34 -24H-22L-14 -14ZM-24 14L-34 24H-22L-14 14Z" fill="#c9465a" stroke="#7a1f2e" stroke-width="1.2"/>`+
    `<path d="M-33 -8H-28V8H-33Z" fill="#59627d" stroke="#2c3350" stroke-width="1.2"/>`+
    `<path d="M-28 -14H10Q30 -14 33 0Q30 14 10 14H-28Q-31 14 -31 0Q-31 -14 -28 -14Z" fill="url(#schull)" stroke="#7d88b3" stroke-width="1.6"/>`+
    `<path d="M-26 -3H8" stroke="#ff9a3c" stroke-width="3"/><path d="M-12 -14V14M-2 -14V14" stroke="#9aa5cc" stroke-width=".9" opacity=".7"/>`+
    `<rect x="19" y="-16" width="5" height="4" rx="1" fill="#59627d"/><rect x="19" y="12" width="5" height="4" rx="1" fill="#59627d"/>`+
    `<ellipse cx="16" cy="-1" rx="8" ry="6.5" fill="url(#scwin)" stroke="#2c3350" stroke-width="1.4"/><path d="M12 -4q3-3 7-2" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8" stroke-linecap="round"/>`;
  for(let i=0;i<m;i++)t+=`<g transform="translate(${-22+i*15} -28)"><rect width="13" height="13" rx="2" fill="#c98a3a" stroke="#6e4214" stroke-width="1.3"/><path d="M0 6.5h13M6.5 0v13" stroke="#8a5420" stroke-width="1.2"/></g>`;
  if(m)t+=`<path d="M-24 -15H${-24+m*15}" stroke="#4a5270" stroke-width="2"/>`;
  return t;
}
function scStationSvg(x,f){
  /* f=+1: the docking port opens to the left (the pod comes from the left); f=-1: it opens to the right */
  const px=x+f*30,core=f>0?px+26:px-82;let t='';
  const py=SC_Y-104,wx=f>0?core+56:core-64;
  t+=`<rect x="${core+21}" y="${SC_Y-76}" width="14" height="42" fill="#6d7aa6"/><rect x="${f>0?core+56:core-30}" y="${SC_Y-6}" width="30" height="12" fill="#6d7aa6"/>`+
    `<rect x="${core-6}" y="${py}" width="68" height="28" rx="3" fill="url(#scsol)" stroke="#9fb4ff" stroke-width="1.2"/><path d="M${core+11} ${py}v28M${core+28} ${py}v28M${core+45} ${py}v28M${core-6} ${py+14}h68" stroke="#9fb4ff" stroke-width=".8" opacity=".7"/>`+
    `<rect x="${f>0?wx+30:wx-34}" y="${SC_Y-34}" width="38" height="68" rx="3" fill="url(#scsol)" stroke="#9fb4ff" stroke-width="1.2"/><path d="M${f>0?wx+30:wx-34} ${SC_Y-11}h38M${f>0?wx+30:wx-34} ${SC_Y+11}h38M${f>0?wx+49:wx-15} ${SC_Y-34}v68" stroke="#9fb4ff" stroke-width=".8" opacity=".7"/>`;
  t+=`<rect x="${core}" y="${SC_Y-34}" width="56" height="68" rx="14" fill="url(#scmet)" stroke="#5a6690" stroke-width="2"/><path d="M${core+8} ${SC_Y-34}v68M${core+48} ${SC_Y-34}v68" stroke="#5a6690" stroke-width="1.4" opacity=".7"/>`+
    `<circle cx="${core+28}" cy="${SC_Y-14}" r="5" fill="#9fdcff" stroke="#3a4670"/><circle cx="${core+28}" cy="${SC_Y+10}" r="5" fill="#9fdcff" stroke="#3a4670"/>`;
  t+=`<rect x="${f>0?px:px-26}" y="${SC_Y-18}" width="26" height="36" rx="4" fill="url(#scmet)" stroke="#5a6690" stroke-width="2"/><rect x="${f>0?px-3:px}" y="${SC_Y-20}" width="3" height="40" fill="#ffd34d"/>`;
  const arm=d=>`<g class="scclamp" style="transform-origin:${px+f*8}px ${SC_Y+d*18}px;--d:${d*f}"><path d="M${px+f*8} ${SC_Y+d*18}L${px-f*12} ${SC_Y+d*24}L${px-f*17} ${SC_Y+d*15}" stroke="#c4cbe4" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  t+=arm(-1)+arm(1)+[-1,0,1].map(i=>`<circle class="sclight" cx="${f>0?px+13:px-13}" cy="${SC_Y+i*11}" r="3.2"/>`).join('');
  t+=`<text x="${core+28}" y="${SC_Y-44}" text-anchor="middle" font-size="12" font-weight="900" fill="#ffd34d" letter-spacing=".08em">DOCK</text>`;
  return `<g class="scstation">${t}</g>`;
}
function scBoard(G){
  const L=G.L,S=G.st,{lo,hi,X}=scGeo(L);
  let t=`<defs><linearGradient id="scsky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070b26"/><stop offset=".6" stop-color="#121a4a"/><stop offset="1" stop-color="#22134a"/></linearGradient>
<radialGradient id="scneb"><stop offset="0" stop-color="#8a5cff" stop-opacity=".35"/><stop offset="1" stop-color="#8a5cff" stop-opacity="0"/></radialGradient>
<radialGradient id="scneb2"><stop offset="0" stop-color="#2fd0c0" stop-opacity=".22"/><stop offset="1" stop-color="#2fd0c0" stop-opacity="0"/></radialGradient>
<radialGradient id="scpl" cx=".35" cy=".35"><stop offset="0" stop-color="#ffcf8a"/><stop offset=".7" stop-color="#d9733a"/><stop offset="1" stop-color="#7a2f1a"/></radialGradient>
<linearGradient id="schull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#dfe5f5"/><stop offset="1" stop-color="#a9b3d6"/></linearGradient>
<radialGradient id="scwin" cx=".35" cy=".35"><stop offset="0" stop-color="#bfe8ff"/><stop offset="1" stop-color="#2f6bff"/></radialGradient>
<linearGradient id="scmet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e8f6"/><stop offset="1" stop-color="#8e99c2"/></linearGradient>
<linearGradient id="scsol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b4fb8"/><stop offset="1" stop-color="#16286a"/></linearGradient>
<linearGradient id="scfl" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3b0"/><stop offset=".35" stop-color="#ffb347"/><stop offset="1" stop-color="#ff4d2e" stop-opacity="0"/></linearGradient>
<linearGradient id="scfl2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3b0"/><stop offset=".4" stop-color="#7fd3ff"/><stop offset="1" stop-color="#2f6bff" stop-opacity="0"/></linearGradient></defs>`+
    `<rect width="${SC_W}" height="${SC_H}" fill="url(#scsky)"/><ellipse cx="170" cy="60" rx="190" ry="90" fill="url(#scneb)"/><ellipse cx="470" cy="190" rx="200" ry="80" fill="url(#scneb2)"/>`+
    `<g class="scst scst1">${scStars(46,1,.8,.55)}</g><g class="scst scst2">${scStars(26,2,1.2,.75)}</g>`+
    `<g class="scplanet"><circle cx="430" cy="40" r="17" fill="url(#scpl)"/><ellipse cx="430" cy="40" rx="29" ry="6" fill="none" stroke="#ffd9a8" stroke-width="2" opacity=".7" transform="rotate(-18 430 40)"/></g>`+
    `<g class="scst scst3">${scStars(12,3,1.8,.95)}</g>`;
  const ry=SC_Y+58;
  t+=`<line x1="${X(lo)}" y1="${ry}" x2="${X(hi)}" y2="${ry}" stroke="#4f63b8" stroke-width="2.5" opacity=".8"/>`;
  for(let x=lo;x<=hi;x++)t+=`<line x1="${X(x)}" y1="${ry-6}" x2="${X(x)}" y2="${ry+6}" stroke="#7d8fd6" stroke-width="2"/><text x="${X(x)}" y="${ry+22}" text-anchor="middle" font-size="12.5" fill="#aab6e8" font-weight="800">${String(x).replace('-','−')}</text>`;
  t+=`<line x1="${X(L.D)}" y1="${ry-10}" x2="${X(L.D)}" y2="${ry+10}" stroke="#ffd34d" stroke-width="3"/>`;
  t+=`<g class="scdock${S.docked?' docked':''}">${scStationSvg(X(L.D),L.D>=0?1:-1)}</g>`;
  t+=`<g class="sctrail">${(S.trail||[]).map(p=>`<circle cx="${X(p.x/2)}" cy="${SC_Y}" r="3.5" fill="#ffd34d" opacity=".45"/>`).join('')}</g>`;
  const px=X((S.pos!=null?S.pos:0)/2);
  t+=`<g class="scpod" transform="translate(${px.toFixed(1)} ${SC_Y})"><g class="scpodin${S.burn?' burn-'+S.burn:''}">${scPodSvg(L.m)}</g>`+
    `<g class="sctag" transform="translate(0 -${L.m?48:34})"><rect x="-42" y="-11" width="84" height="20" rx="10" fill="#0b1130" stroke="#7fd3ff" stroke-width="1.5" opacity=".9"/><text class="sctagt" y="4" text-anchor="middle" font-size="11.5" font-weight="900" fill="#cfeaff">speed ${scFmt(S.v!=null?S.v:L.v0*2)}</text></g></g>`;
  t+=`<g class="scclock"><rect x="10" y="10" width="78" height="24" rx="12" fill="#0b1130" stroke="#4f63b8" stroke-width="1.5"/><text class="scclockt" x="49" y="27" text-anchor="middle" font-size="12.5" font-weight="900" fill="#ffd34d">t = ${S.t||0} s</text></g>`;
  if(S.callout)t+=scCallout(S.callout,X(S.pos/2));
  return ngSvg(SC_W,SC_H,t,'ngsvg scsvg','The pod and the docking station');
}
function scCallout(txt,x){const w=Math.min(300,24+txt.length*6.4),bx=Math.max(8,Math.min(SC_W-w-8,x-w/2));
  return `<g class="sccall"><rect x="${bx}" y="${SC_Y-92}" width="${w}" height="28" rx="14" fill="#fff" stroke="#ff8a3a" stroke-width="2.5"/><path d="M${Math.max(bx+14,Math.min(bx+w-14,x))-7} ${SC_Y-64}l7 10 7-10z" fill="#fff" stroke="#ff8a3a" stroke-width="2.5" stroke-linejoin="round"/><rect x="${Math.max(bx+14,Math.min(bx+w-14,x))-9}" y="${SC_Y-66}" width="18" height="4" fill="#fff"/><text x="${bx+w/2}" y="${SC_Y-73}" text-anchor="middle" font-size="12" font-weight="900" fill="#1b2433">${ngEsc(txt)}</text></g>`;}
ngDef({key:'courier',name:'Space Courier',ic:'rocket',std:'MS-PS2-2',subj:'phys',cap3:true,
  short:'Plan thruster burns to dock a pod in space.',menuDesc:'Plan every thruster burn before launch. In space, the pod keeps moving until a force stops it.',
  intro:'Deliver packages across space. There is no friction in space, so the pod only changes speed when a thruster pushes it. Plan every second of the trip first, then launch. Dock exactly at the station with zero speed. Dock on the first launch for 3 stars.',
  how:['**Pick a thruster** from the toolbox, then **tap the seconds** in the flight plan.','Every empty second is a coast: the pod keeps its speed.','Press **Launch**. Stop exactly at the dock with speed 0.'],
  levels:SC_LEVELS,packs:SC_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 24" width="48" height="26" aria-hidden="true"><rect width="44" height="24" rx="4" fill="#0b1130"/><rect x="${L.D>=0?34:4}" y="6" width="6" height="12" fill="#8d97c5"/><rect x="${L.D>=0?8:26}" y="9" width="10" height="7" rx="3" fill="#e8eef8"/>${L.m>1?'<rect x="9" y="5" width="4" height="4" fill="#c98a3a"/><rect x="14" y="5" width="4" height="4" fill="#c98a3a"/>':''}</svg>`),
  start(G){G.st={plan:Array(G.L.T).fill('c'),tool:'f',running:false};scReset(G.st);},
  hud(G){return {label:'Launches',val:G.tries,target:'3 ★ = dock on the first launch'};},
  render(G,main,side){
    const L=G.L,S=G.st,show=G.i<3||G.hint>=1,prev=scRun(L,S.plan);
    const rows=S.plan.map((k,i)=>{const pr=prev[i];return h('button',{type:'button',class:'scslot k'+k+(S.res&&S.res.crash===i?' bad':''),disabled:S.running||G.done,'aria-label':`Second ${i+1}: ${SC_TOOLS.find(x=>x[0]===k)[1]}`,
      onclick:()=>{S.plan[i]=S.plan[i]===S.tool?'c':S.tool;scReset(S);ngRender();}},h('small',null,(i+1)+'s'),h('b',null,SC_TOOLS.find(x=>x[0]===k)[2]),
      show&&pr?h('span',{class:'scv'},'speed '+scFmt(pr.v)):null);});
    ngRC(main,h('div',{class:'scwrap'},scBoard(G)),h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Flight plan',h('small',null,show?'each box shows the speed after that second':'Hint 1 shows the speed after each second')),h('div',{class:'scplan'},...rows),
      h('div',{class:'scinfo'},`Start: position 0, speed ${L.v0}. Dock at ${L.D}. Mass: ${L.m} crate${L.m>1?'s':''}. One small push changes the speed by ${scFmt(2/L.m)}${L.big?`; a big push by ${scFmt(4/L.m)}`:''}.`));
    const tools=SC_TOOLS.filter(x=>L.big||!'FR'.includes(x[0]));
    ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Thruster toolbox'),
      h('div',{class:'sctools'},...tools.map(([k,n,s])=>h('button',{type:'button',class:'ngc sctool'+(S.tool===k?' on':''),disabled:S.running||G.done,onclick:()=>{S.tool=k;ngRender();}},h('b',null,s),h('small',null,n)))),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      ngBtn([I('rocket'),' Launch!'],scLaunch,'good',{style:'width:100%;font-size:19px',disabled:S.running||G.done}),
      ngBtn('Clear plan',()=>{S.plan=Array(L.T).fill('c');scReset(S);ngRender();},'ghost sm',{style:'width:100%',disabled:S.running||G.done}));
    if(!S.running&&!S.msg)ngSay('Plan the whole trip, then launch. Remember: with no push, the pod keeps its speed.');
  },
  hints(G){const L=G.L,b=scSolve(L);return [L.clue,'Each second: first the thruster changes the speed, then the pod moves by its speed. A coast keeps the same speed. You must end with speed 0 exactly at the dock.',
    b?'One plan that works: '+b.p.map((k,i)=>`${i+1}s ${SC_TOOLS.find(x=>x[0]===k)[2]}`).join(', ')+'.':''];}
});
function scReset(S){S.res=null;S.msg=null;S.pos=0;S.trail=[];S.crash=false;S.docked=false;S.callout=null;S.t=0;S.v=null;S.burn=null;}
function scLaunch(){
  const L=G.L,S=G.st;if(S.running||G.done)return;if(ngT())return ngTDone(scRun(L,S.plan).ok?1:0);
  G.tries++;const r=scRun(L,S.plan),key=G.key,lv=G.i;scReset(S);S.running=true;S.v=L.v0*2;ngRender();
  const live=()=>G&&G.key===key&&G.i===lv&&!$('s-ng').hidden&&G.st===S;
  const svg=()=>$('ngMain').querySelector('.scsvg'),q=c=>{const s2=svg();return s2&&s2.querySelector(c);};
  const {X}=scGeo(L),RM=Art.reduced(),STEP=RM?90:720;
  const place=x=>{const p=q('.scpod');if(p)p.setAttribute('transform',`translate(${X(x/2).toFixed(1)} ${SC_Y})`);};
  const tag=v=>{const e=q('.sctagt');if(e)e.textContent='speed '+scFmt(v);},clock=n=>{const e=q('.scclockt');if(e)e.textContent=`t = ${n} s`;};
  const burn=k=>{const e=q('.scpodin');if(e)e.setAttribute('class','scpodin'+(k&&k!=='c'?' burn-'+k:''));};
  const dot=x=>{const g=q('.sctrail');if(g)g.insertAdjacentHTML('beforeend',`<circle cx="${X(x/2)}" cy="${SC_Y}" r="3.5" fill="#ffd34d" opacity=".45"/>`);};
  const move=(x0,x1,dur)=>new Promise(res=>{if(RM||dur<=0){place(x1);return res();}Art.tween({from:x0,to:x1,dur,ease:'linear',step:v=>{if(live())place(v);},done:res});});
  (async()=>{
    await new Promise(z=>setTimeout(z,RM?0:250));let x=0;
    for(let i=0;i<r.length;i++){if(!live())return;const p=r[i];
      burn(p.k);tag(p.v);clock(i+1);S.burn=p.k==='c'?null:p.k;
      const off=setTimeout(()=>{if(live())burn(null);},RM?0:Math.min(320,STEP*.45));
      await move(x,p.x,STEP);clearTimeout(off);burn(null);
      x=p.x;S.pos=x;S.v=p.v;S.t=i+1;S.trail.push(p);dot(x);}
    if(!live())return;S.burn=null;
    /* a moving pod keeps its speed: let it drift on */
    const e=r.end;
    if(r.crash!=null||e.v!==0){const v=e.v;S.callout=`No friction! It keeps moving at speed ${scFmt(v)}.`;
      const s2=svg();if(s2)s2.insertAdjacentHTML('beforeend',scCallout(S.callout,X(x/2)));
      for(let k=0;k<2;k++){if(!live())return;await move(x,x+v,STEP);x+=v;S.pos=x;S.t++;clock(S.t);const c=q('.sccall');if(c)c.remove();const s3=svg();if(s3)s3.insertAdjacentHTML('beforeend',scCallout(S.callout,X(x/2)));}}
    else if(!r.ok)S.callout=`Stopped at ${scFmt(e.x)}. The dock is at ${L.D}.`;
    S.running=false;S.res=r;scDone(r);
  })();
}
function scDone(r){
  const L=G.L,S=G.st,e=r.end;
  if(r.ok){S.docked=true;S.msg=['ok','✓ Docked perfectly: right at the station with speed 0!'];ngRender();
    const d=$('ngMain').querySelector('.scdock');if(d){requestAnimationFrame(()=>d.classList.add('closing'));Art.burstAt(d,{n:22,colors:['#7fe0a8','#ffd34d','#fff'],shape:['star','dot']});}
    ngSay('Perfect docking! The clamps lock on.','go');G.detail={launches:G.tries};
    ngWin(ngStars(G.tries-1,0,1),['You docked on launch ',h('b',null,G.tries),'.']);return;}
  G.miss++;let m;
  if(r.crash!=null)m=`Missed! In second ${r.crash+1} the pod flew past the dock at speed ${scFmt(r[r.crash].v)}. In space nothing slows it down, so it needed a push the other way sooner.`;
  else if(e.v!==0)m=`The pod is still moving at speed ${scFmt(e.v)} at the end. With no force to stop it, it keeps going! Add a push the other way.`;
  else m=`The pod stopped at ${scFmt(e.x)}, not at the dock (${L.D}). ${Math.abs(e.x)<Math.abs(L.D*2)?'It stopped short.':'It went too far.'} Change when you push.`;
  S.msg=['no',m];fx.pop({icon:'rocket',text:r.crash!=null?'Flew past!':'Missed the dock',kind:'oops'});ngRender();ngSay(m,'alert');
}
NGTHUMB.courier=()=>{
  let t='';for(let i=0;i<30;i++)t+=`<circle cx="${(i*83)%320}" cy="${(i*47)%180}" r="${i%3?1.2:2}" fill="#fff" opacity=".6"/>`;
  t+=`<rect x="256" y="50" width="40" height="80" fill="#5a6a9a"/><rect x="264" y="58" width="32" height="64" rx="6" fill="#8d97c5"/><rect x="252" y="76" width="8" height="28" fill="#ffd34d"/>`+
    `<g transform="translate(120 90)"><path d="M-40 -12L-86 0L-40 12Z" fill="#ff8a3a"/><path d="M-40 -6L-64 0L-40 6Z" fill="#ffd34d"/><rect x="-40" y="-24" width="80" height="48" rx="18" fill="#e8eef8" stroke="#8d97c5" stroke-width="3"/><circle cx="20" cy="-2" r="10" fill="#4fa3ff"/><rect x="-28" y="-44" width="18" height="18" rx="3" fill="#c98a3a"/><rect x="-8" y="-44" width="18" height="18" rx="3" fill="#c98a3a"/></g>`+
    `<path d="M160 140h80" stroke="#ffd34d" stroke-width="3" stroke-dasharray="6 6"/>`+ngStar(30,30,7);
  return ngWrap('courier','#0b1130',t);
};
