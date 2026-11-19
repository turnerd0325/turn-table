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
function scBoard(G){
  const L=G.L,S=G.st,lo=Math.min(0,L.D)-1,hi=Math.max(L.D,0)+2,n=hi-lo,W=520,H=170,cw=(W-40)/n,X=x=>20+(x-lo)*cw;
  let t=`<rect width="${W}" height="${H}" fill="#0b1130"/>`;for(let i=0;i<40;i++)t+=`<circle cx="${(i*97)%W}" cy="${(i*53)%H}" r="${i%3?1:1.6}" fill="#fff" opacity="${.3+i%4*.15}"/>`;
  for(let x=lo;x<=hi;x++)t+=`<line x1="${X(x)}" y1="118" x2="${X(x)}" y2="128" stroke="#5a6a9a" stroke-width="2"/><text x="${X(x)}" y="144" text-anchor="middle" font-size="12" fill="#8d97c5" font-weight="700">${x}</text>`;
  t+=`<line x1="${X(lo)}" y1="123" x2="${X(hi)}" y2="123" stroke="#3a4a7a" stroke-width="2"/>`;
  const dx=X(L.D);t+=`<g><rect x="${dx-4}" y="40" width="${L.D>=0?36:-36}" height="70" fill="#5a6a9a" transform="${L.D>=0?'':`translate(${0} 0)`}"/><rect x="${L.D>=0?dx+4:dx-40}" y="48" width="34" height="54" rx="6" fill="#8d97c5"/><rect x="${dx-3}" y="60" width="6" height="30" fill="#ffd34d"/><text x="${dx+(L.D>=0?22:-22)}" y="36" text-anchor="middle" font-size="11" font-weight="900" fill="#ffd34d">DOCK</text></g>`;
  (S.trail||[]).forEach(p=>{t+=`<circle cx="${X(p.x/2)}" cy="75" r="4" fill="#ffd34d" opacity=".5"/>`;});
  const px=X((S.pos!=null?S.pos:0)/2),dir=1,burn=S.burn;
  t+=`<g transform="translate(${px} 75)">`+(burn==='f'||burn==='F'?`<path d="M-22 -8L${burn==='F'?-50:-38} 0L-22 8Z" fill="#ff8a3a"/>`:'')+(burn==='r'||burn==='R'?`<path d="M22 -8L${burn==='R'?50:38} 0L22 8Z" fill="#ff8a3a"/>`:'')+
    `<rect x="-22" y="-16" width="44" height="32" rx="12" fill="#e8eef8" stroke="#8d97c5" stroke-width="2"/><circle cx="${12*dir}" cy="-2" r="6" fill="#4fa3ff"/>`+
    Array.from({length:L.m},(_,i)=>`<rect x="${-16+i*12}" y="-30" width="11" height="12" rx="2" fill="#c98a3a" stroke="#7a4a1a"/>`).join('')+`</g>`;
  if(S.crash)t+=`<text x="${px}" y="40" text-anchor="middle" font-size="26">💥</text>`;
  return ngSvg(W,H,t,'ngsvg scsvg','The pod and the docking station');
}
ngDef({key:'courier',name:'Space Courier',ic:'rocket',std:'MS-PS2-2',subj:'phys',cap3:true,
  short:'Plan thruster burns to dock a pod in space.',menuDesc:'Plan every thruster burn before launch. In space, the pod keeps moving until a force stops it.',
  intro:'Deliver packages across space. There is no friction in space, so the pod only changes speed when a thruster pushes it. Plan every second of the trip first, then launch. Dock exactly at the station with zero speed. Dock on the first launch for 3 stars.',
  how:['**Pick a thruster** from the toolbox, then **tap the seconds** in the flight plan.','Every empty second is a coast: the pod keeps its speed.','Press **Launch**. Stop exactly at the dock with speed 0.'],
  levels:SC_LEVELS,packs:SC_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 24" width="48" height="26" aria-hidden="true"><rect width="44" height="24" rx="4" fill="#0b1130"/><rect x="${L.D>=0?34:4}" y="6" width="6" height="12" fill="#8d97c5"/><rect x="${L.D>=0?8:26}" y="9" width="10" height="7" rx="3" fill="#e8eef8"/>${L.m>1?'<rect x="9" y="5" width="4" height="4" fill="#c98a3a"/><rect x="14" y="5" width="4" height="4" fill="#c98a3a"/>':''}</svg>`),
  start(G){G.st={plan:Array(G.L.T).fill('c'),tool:'f',pos:0,trail:[],res:null,running:false,burn:null,crash:false,msg:null};},
  hud(G){return {label:'Launches',val:G.tries,target:'3 ★ = dock on the first launch'};},
  render(G,main,side){
    const L=G.L,S=G.st,show=G.i<3||G.hint>=1,prev=scRun(L,S.plan);
    const rows=S.plan.map((k,i)=>{const pr=prev[i];return h('button',{type:'button',class:'scslot k'+k+(S.res&&S.res.crash===i?' bad':''),disabled:S.running||G.done,'aria-label':`Second ${i+1}: ${SC_TOOLS.find(x=>x[0]===k)[1]}`,
      onclick:()=>{S.plan[i]=S.plan[i]===S.tool?'c':S.tool;S.res=null;S.msg=null;S.pos=0;S.trail=[];S.crash=false;ngRender();}},h('small',null,(i+1)+'s'),h('b',null,SC_TOOLS.find(x=>x[0]===k)[2]),
      show&&pr?h('span',{class:'scv'},'speed '+scFmt(pr.v)):null);});
    ngRC(main,scBoard(G),h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Flight plan',h('small',null,show?'each box shows the speed after that second':'Hint 1 shows the speed after each second')),h('div',{class:'scplan'},...rows),
      h('div',{class:'scinfo'},`Start: position 0, speed ${L.v0}. Dock at ${L.D}. Mass: ${L.m} crate${L.m>1?'s':''}. One small push changes the speed by ${scFmt(2/L.m)}${L.big?`; a big push by ${scFmt(4/L.m)}`:''}.`));
    const tools=SC_TOOLS.filter(x=>L.big||!'FR'.includes(x[0]));
    ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Thruster toolbox'),
      h('div',{class:'sctools'},...tools.map(([k,n,s])=>h('button',{type:'button',class:'ngc sctool'+(S.tool===k?' on':''),disabled:S.running||G.done,onclick:()=>{S.tool=k;ngRender();}},h('b',null,s),h('small',null,n)))),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      ngBtn([I('rocket'),' Launch!'],scLaunch,'good',{style:'width:100%;font-size:19px',disabled:S.running||G.done}),
      ngBtn('Clear plan',()=>{S.plan=Array(L.T).fill('c');S.res=null;S.msg=null;S.pos=0;S.trail=[];S.crash=false;ngRender();},'ghost sm',{style:'width:100%',disabled:S.running||G.done}));
    if(!S.running&&!S.msg)ngSay('Plan the whole trip, then launch. Remember: with no push, the pod keeps its speed.');
  },
  hints(G){const L=G.L,b=scSolve(L);return [L.clue,'Each second: first the thruster changes the speed, then the pod moves by its speed. A coast keeps the same speed. You must end with speed 0 exactly at the dock.',
    b?'One plan that works: '+b.p.map((k,i)=>`${i+1}s ${SC_TOOLS.find(x=>x[0]===k)[2]}`).join(', ')+'.':''];}
});
function scLaunch(){
  const L=G.L,S=G.st;if(S.running||G.done)return;if(ngT())return ngTDone(scRun(L,S.plan).ok?1:0);G.tries++;const r=scRun(L,S.plan),key=G.key,lv=G.i;S.running=true;S.trail=[];S.pos=0;S.crash=false;S.msg=null;ngRender();
  let i=0;const step=()=>{if(!G||G.key!==key||G.i!==lv||$('s-ng').hidden)return;
    if(i>=r.length){S.running=false;S.burn=null;S.res=r;scDone(r);return;}
    const p=r[i];S.burn=p.k==='c'?null:p.k;S.pos=p.x;S.trail.push(p);if(r.crash===i)S.crash=true;i++;ngRender();setTimeout(step,matchMedia('(prefers-reduced-motion:reduce)').matches?80:520);};
  setTimeout(step,250);
}
function scDone(r){
  const L=G.L,S=G.st,e=r.end;
  if(r.ok){S.msg=['ok','✓ Docked perfectly: right at the station with speed 0!'];ngRender();ngSay('Perfect docking!','go');G.detail={launches:G.tries};
    ngWin(ngStars(G.tries-1,0,1),['You docked on launch ',h('b',null,G.tries),'.']);return;}
  G.miss++;let m;
  if(r.crash!=null)m=`Crash! In second ${r.crash+1} the pod flew past the dock at speed ${scFmt(r[r.crash].v)}. It needed a push the other way sooner.`;
  else if(e.v!==0)m=`The pod is still moving at speed ${scFmt(e.v)} at the end. With no force to stop it, it keeps going! Add a push the other way.`;
  else m=`The pod stopped at ${scFmt(e.x)}, not at the dock (${L.D}). ${Math.abs(e.x)<Math.abs(L.D*2)?'It stopped short.':'It went too far.'} Change when you push.`;
  S.msg=['no',m];fx.pop({icon:'rocket',text:r.crash!=null?'Crash!':'Missed the dock',kind:'oops'});ngRender();ngSay(m,'alert');
}
NGTHUMB.courier=()=>{
  let t='';for(let i=0;i<30;i++)t+=`<circle cx="${(i*83)%320}" cy="${(i*47)%180}" r="${i%3?1.2:2}" fill="#fff" opacity=".6"/>`;
  t+=`<rect x="256" y="50" width="40" height="80" fill="#5a6a9a"/><rect x="264" y="58" width="32" height="64" rx="6" fill="#8d97c5"/><rect x="252" y="76" width="8" height="28" fill="#ffd34d"/>`+
    `<g transform="translate(120 90)"><path d="M-40 -12L-86 0L-40 12Z" fill="#ff8a3a"/><path d="M-40 -6L-64 0L-40 6Z" fill="#ffd34d"/><rect x="-40" y="-24" width="80" height="48" rx="18" fill="#e8eef8" stroke="#8d97c5" stroke-width="3"/><circle cx="20" cy="-2" r="10" fill="#4fa3ff"/><rect x="-28" y="-44" width="18" height="18" rx="3" fill="#c98a3a"/><rect x="-8" y="-44" width="18" height="18" rx="3" fill="#c98a3a"/></g>`+
    `<path d="M160 140h80" stroke="#ffd34d" stroke-width="3" stroke-dasharray="6 6"/>`+ngStar(30,30,7);
  return ngWrap('courier','#0b1130',t);
};
