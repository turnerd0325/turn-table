/*<<CAENGINE*/
const CA_MINDH=0.5,CA_G=10,CA_SEG=12,CA_LOOPN=28,CA_STEEL=0.25;
/* track pieces a student can drop into a build slot */
const CA_PIECES={hill:{n:'Hill',d:'You set its height'},dip:{n:'Dip',d:'Drops to the ground'},flat:{n:'Flat',d:'Stays level'},loop2:{n:'Small loop',d:'2 m radius'},loop3:{n:'Big loop',d:'3 m radius'},steel:{n:'Steel track',d:'Smooth: less friction'}};
/* monotone cubic interpolation of heights between track posts (never overshoots) */
function caSlopes(y){const n=y.length,d=[],m=[];
  for(let i=0;i<n-1;i++)d.push(y[i+1]-y[i]);
  m.push(d[0]);for(let i=1;i<n-1;i++)m.push(d[i-1]*d[i]<=0?0:(d[i-1]+d[i])/2);m.push(d[n-2]);
  for(let i=0;i<n-1;i++){if(d[i]===0){m[i]=0;m[i+1]=0;}else{const a=m[i]/d[i],b=m[i+1]/d[i],s=a*a+b*b;if(s>9){const t=3/Math.sqrt(s);m[i]=t*a*d[i];m[i+1]=t*b*d[i];}}}
  return m;}
function caHerm(y,m,i,u){const u2=u*u,u3=u2*u;return (2*u3-3*u2+1)*y[i]+(u3-2*u2+u)*m[i]+(-2*u3+3*u2)*y[i+1]+(u3-u2)*m[i+1];}
/* the track as built: pieces fill the build slots; steel segments have less friction */
function caCtx(L,pieces,steel){pieces=pieces||{};steel=steel||[];
  const pts=L.pts.map((p,i)=>{if(!p.build)return p;const k=pieces[i];
    if(!k)return {h:0,empty:true,name:p.name};if(k==='hill')return {lo:p.lo,hi:p.hi,name:p.name,piece:k};if(k==='dip')return {h:0,name:p.name,piece:k};
    if(k==='flat')return {flat:true,name:p.name,piece:k};return {h:0,loop:k==='loop2'?2:3,name:p.name,piece:k};});
  const frs=L.pts.slice(1).map((_,j)=>steel.includes(j)?L.fr*CA_STEEL:L.fr),cum=[0];frs.forEach((f,j)=>cum.push(cum[j]+f));
  return {pts,frs,cum,steel,pieces,lossAt:k=>{const j=Math.min(frs.length-1,Math.floor(k));return k>=frs.length?cum[frs.length]:cum[j]+(k-j)*frs[j];}};}
const caFixFlats=(ctx,Hs)=>{ctx.pts.forEach((p,i)=>{if(p.flat&&i>0)Hs[i]=Hs[i-1];});return Hs;};
/* every sample of the cart's ride. Hs[0] is the start height. */
function caSamples(L,Hs,ctx){
  const n=Hs.length,m=caSlopes(Hs),h0=Hs[0],out=[];
  for(let j=0;j<n-1;j++){
    for(let q=(j===0?0:1);q<=CA_SEG;q++){const u=q/CA_SEG,k=j+u,y=caHerm(Hs,m,j,u),Eh=h0-ctx.lossAt(k);
      out.push({k,y,Eh,dh:Eh-y,req:(q===CA_SEG&&k>0)?CA_MINDH:0,post:q===CA_SEG?j+1:-1,loop:false,seg:j});}
    const pt=ctx.pts[j+1];
    if(pt&&pt.loop&&j+1<n){const r=pt.loop,b=Hs[j+1],Eh=h0-ctx.lossAt(j+1);
      for(let q=1;q<=CA_LOOPN;q++){const th=2*Math.PI*q/CA_LOOPN,y=b+r*(1-Math.cos(th));
        out.push({k:j+1,y,Eh,dh:Eh-y,req:Math.max(0,-r*Math.cos(th)/2),post:-1,loop:true,th,r,b,seg:j});}}
  }
  return out;
}
const caFirstFail=S=>{for(let i=1;i<S.length;i++)if(S[i].dh<S[i].req-1e-9)return i;return -1;};
function caGoals(L,Hs,ctx){
  ctx=ctx||caCtx(L);const S=caSamples(L,Hs,ctx),f=caFirstFail(S),n=Hs.length,h0=Hs[0],res=[];
  const at=i=>Math.max(0,h0-ctx.lossAt(i)-Hs[i]);
  const sp=i=>Math.sqrt(2*CA_G*at(i));
  const empty=ctx.pts.some(p=>p.empty);
  let why='';
  if(empty)why='Drop a piece into every dashed slot first.';
  else if(f>=0){const s=S[f];why=s.loop?'It ran out of speed at the top of a loop (needs enough energy to stay on the track).':`It ran out of energy near hill ${Math.min(n-1,Math.ceil(s.k))}. The energy line dropped to the track.`;}
  res.push({label:'Cart makes it to the end',ok:f<0&&!empty,why});
  (L.goals||[]).forEach(g=>{
    if(g.t==='minv'){const v=sp(g.at);res.push({label:`Speed at "${g.name}": at least ${g.v} m/s`,ok:v>=g.v-1e-9,why:`Right now it is ${v.toFixed(1)} m/s.`});}
    if(g.t==='maxv'){const v=sp(g.at);res.push({label:`Speed at "${g.name}": no more than ${g.v} m/s`,ok:v<=g.v+1e-9&&f<0&&!empty,why:`Right now it is ${v.toFixed(1)} m/s.`});}
    if(g.t==='minh'){res.push({label:`"${g.name}" is at least ${g.h} m tall`,ok:ctx.pts[g.at].piece!=='flat'&&Hs[g.at]>=g.h,why:ctx.pts[g.at].empty?'Put a piece there first.':`It is ${Hs[g.at]} m now.`});}
    if(g.t==='piece'){const k=ctx.pts[g.at].piece;res.push({label:g.label,ok:k===g.p,why:k?`That spot has a ${CA_PIECES[k].n.toLowerCase()}.`:'That spot is empty.'});}
    if(g.t==='both'){const ks=g.at.map(i=>ctx.pts[i].piece);res.push({label:g.label,ok:g.need.every(k=>ks.includes(k)),why:'Use one of each.'});}
  });
  return {S,f,res,ok:res.every(r=>r.ok)};
}
const caEditable=ctx=>ctx.pts.map((p,i)=>i>0&&p.lo!==undefined?i:-1).filter(i=>i>=0);
function caCombos(n,k){const out=[[]];for(let c=1;c<=k;c++){const go=(s,a)=>{if(a.length===c){out.push(a.slice());return;}for(let i=s;i<n;i++){a.push(i);go(i+1,a);a.pop();}};go(0,[]);}return out;}
function caSolve(L){ /* lowest start height that can work, over every piece choice, steel placement and editable height */
  const slots=L.pts.map((p,i)=>p.build?i:-1).filter(i=>i>=0),builds=[{}];
  slots.forEach(i=>{const nb=[];builds.forEach(b=>L.pts[i].build.forEach(k=>nb.push(Object.assign({},b,{[i]:k}))));builds.splice(0,builds.length,...nb);});
  const steels=caCombos(L.pts.length-1,L.steel||0);
  for(let h0=L.pts[0].lo;h0<=L.pts[0].hi;h0++)for(const b of builds)for(const st of steels){
    const ctx=caCtx(L,b,st),ed=caEditable(ctx);
    const Hs=ctx.pts.map((p,i)=>i===0?h0:p.lo===undefined?(p.h||0):p.lo);
    const found=(function r(k){if(k===ed.length)return caGoals(L,caFixFlats(ctx,Hs),ctx).ok;const p=ctx.pts[ed[k]];for(let v=p.lo;v<=p.hi;v++){Hs[ed[k]]=v;if(r(k+1))return true;}return false;})(0);
    if(found)return {par:h0,Hs:Hs.slice(),pieces:b,steel:st};
  }
  return null;
}
/*CAENGINE>>*/
/*<<CALEVELS*/
const CA_HMAX=16;
const caP=(lo,hi)=>({lo,hi});
const CA_LEVELS=[
 {pack:'Pack 1: Hills',name:'First Drop',fr:0,story:'Get the cart over the 6 m hill. Raise the starting hill until the energy line clears it.',
  clue:'The cart can never rise higher than where it started. The dashed energy line shows its limit.',
  intro:'Drag the big start hill up or down. Potential energy (height) turns into kinetic energy (speed) as the cart rolls down. Press Launch to test it.',
  fact:'Energy is conserved. All the cart\'s energy starts as potential energy at the top. It can only climb a hill as tall as the one it started from.',
  pts:[caP(3,CA_HMAX),{h:0},{h:6},{h:0}],goals:[]},
 {pack:null,name:'Speed Trap',fr:0,story:'The speed camera at the bottom needs 14 m/s or more. How high must the start be?',
  clue:'Speed depends on how far the cart has dropped. Check the speed readout as you raise the hill.',
  fact:'Kinetic energy is ½mv². The farther the cart drops, the more potential energy turns into kinetic energy, and the faster it goes.',
  pts:[caP(3,CA_HMAX),{h:0,name:'the bottom'},{h:4},{h:0}],goals:[{t:'minv',at:1,v:14,name:'the bottom'}]},
 {pack:null,name:'Thrill Hill',fr:0,story:'Park managers want a thrilling second hill: at least 9 m tall! Drop a track piece into the dashed slot and build it. Then make sure the cart can still get over it.',
  clue:'A hill piece lets you set the height. Raise it to 9 m, then raise the start until the cart clears it.',
  intro:'New: the toolbox. Drag a track piece into the dashed slot (or tap the piece, then tap the slot).',
  fact:'Taller hills give a bigger thrill but need more starting energy. Engineers always start a coaster with its highest hill.',
  pts:[caP(3,CA_HMAX),{h:0},{build:['hill','dip','flat'],lo:0,hi:14,name:'the thrill hill'},{h:2},{h:0}],goals:[{t:'minh',at:2,h:9,name:'the thrill hill'}]},
 {pack:null,name:'Gentle Landing',fr:0,story:'Riders must arrive at the end platform at 8 m/s or slower. Raise the end platform to slow the cart.',
  clue:'A higher end platform means the cart has dropped less by the end, so it keeps less speed.',
  fact:'A cart that ends higher has more potential energy left and less kinetic energy. That means it is moving slower.',
  pts:[caP(3,CA_HMAX),{h:0},{h:8},{lo:0,hi:14,name:'the end platform'}],goals:[{t:'maxv',at:3,v:8,name:'the end platform'}]},
 {pack:'Pack 2: Friction',name:'Heat Loss',fr:0.4,steel:1,story:'Friction turns some energy into heat on every stretch of wooden track. You have 1 piece of smooth steel track. Where does it help most?',
  clue:'Steel loses much less energy to heat. Energy saved early is still there for every hill after it.',
  intro:'New: friction. Wooden track turns some of the cart\'s energy into heat (watch the red bar). Drag the steel piece onto a stretch of track to make it smooth.',
  fact:'Friction does not destroy energy. It changes some into thermal energy. Smoother surfaces, like steel rails, turn less energy into heat.',
  pts:[caP(3,CA_HMAX),{h:0},{h:6},{h:0},{h:5},{h:0}],goals:[]},
 {pack:null,name:'Long Ride',fr:0.8,steel:2,story:'A long wooden track means lots of friction. Reach the end past three hills. You have 2 steel pieces.',
  clue:'The last hill is the hardest. Every stretch of steel before it saves energy for it.',
  fact:'The longer the track, the more energy turns into heat. That is why real coasters get shorter hills toward the end, and why most use steel rails.',
  pts:[caP(3,CA_HMAX),{h:0},{h:7},{h:0},{h:6},{h:0},{h:5},{h:0}],goals:[]},
 {pack:null,name:'Fast and Far',fr:0.6,steel:1,story:'Build a tall middle hill (8 m) and still hit 15 m/s at the bottom after it.',
  clue:'Fast bottom plus tall hill plus friction: the start height must beat all three. Steel before the bottom saves speed.',
  fact:'Engineers balance height, speed and friction. Raising the lift hill costs energy, so they use the lowest hill that works.',
  pts:[caP(3,CA_HMAX),{h:0},{build:['hill','dip','flat'],lo:0,hi:12,name:'the tall hill'},{h:0,name:'the second bottom'},{h:6},{h:0}],goals:[{t:'minh',at:2,h:8,name:'the tall hill'},{t:'minv',at:3,v:15,name:'the second bottom'}]},
 {pack:'Pack 3: Loops & Safety',name:'Loop the Loop',fr:0.4,story:'Add a 3 m radius loop. The cart must stay on the track at the very top.',
  clue:'At the top of a loop, the cart needs enough speed to stay pressed to the track. That takes extra height.',
  intro:'Loops need a minimum speed at the top. The loop top is 2 × radius high, and the cart needs 2.5 × radius of starting energy.',
  fact:'To stay on a loop, the cart needs a start height of at least 2.5 times the loop radius. Slower, and gravity pulls it off the track.',
  pts:[caP(3,CA_HMAX),{h:0},{build:['loop3','flat'],name:'the loop spot'},{h:0}],goals:[{t:'piece',at:2,p:'loop3',label:'A big loop (3 m) is on the track'}]},
 {pack:null,name:'Twin Loops',fr:0.5,story:'Place one small loop and one big loop. Which order needs the lower lift hill?',
  clue:'Friction takes energy before every loop. Which loop needs the most energy? Put it where the cart has the most.',
  fact:'Each stretch of track costs a bit of energy to friction, so later loops should be smaller than earlier ones.',
  pts:[caP(3,CA_HMAX),{h:0},{build:['loop2','loop3'],name:'loop spot 1'},{h:0},{build:['loop2','loop3'],name:'loop spot 2'},{h:0}],goals:[{t:'both',at:[2,4],need:['loop2','loop3'],label:'One small loop and one big loop'}]},
 {pack:null,name:'Grand Coaster',fr:0.5,steel:1,story:'The final design! Build a 7 m hill, loop the loop, then bring riders in as slowly as safely possible: 5 m/s or less, but they must make it.',
  clue:'Raise the end platform to slow the cart, but not so high that it stalls. Then trim the start hill.',
  fact:'Real coaster designers use exactly this energy accounting: lift hill, hills, loops, friction and brakes all have to add up, and riders must arrive slowly but safely.',
  pts:[caP(3,CA_HMAX),{h:0},{h:0,loop:2},{h:0},{lo:0,hi:14,name:'the big hill'},{h:0},{lo:0,hi:16,name:'the end platform'}],
  goals:[{t:'minh',at:4,h:7,name:'the big hill'},{t:'maxv',at:6,v:5,name:'the end platform'}]}
];
CA_LEVELS.forEach(L=>{const r=caSolve(L);if(!r)throw new Error('unsolvable '+L.name);L.par=r.par;L.solHs=r.Hs;L.solPieces=r.pieces;L.solSteel=r.steel;});
const CA_N=CA_LEVELS.length;
/*CALEVELS>>*/
/*<<CAUI*/
const CA_PACKS={0:'Pack 1: Hills',4:'Pack 2: Friction',7:'Pack 3: Loops & Safety'};
const CAW=900,CAH=440,CAG=402,CAM=22,CAX0=80,CAX1=840;
let CAS=null;
const caLvl=()=>CA_LEVELS[CAS.i];
const caXk=k=>CAX0+k*(CAX1-CAX0)/(caLvl().pts.length-1);
const caY=y=>CAG-y*CAM;
const caMini=L=>{const n=L.pts.length,w=44,hh=30,hs=L.solHs,mx=Math.max(...hs,8),ctx=caCtx(L,L.solPieces,L.solSteel);
  let d='';hs.forEach((v,i)=>{d+=(i?'L':'M')+(2+i*(w-4)/(n-1)).toFixed(1)+' '+(hh-3-v/mx*(hh-8)).toFixed(1);});
  const lp=ctx.pts.map((p,i)=>p.loop?`<circle cx="${2+i*(w-4)/(n-1)}" cy="${hh-3-p.loop*1.7}" r="${p.loop*1.4}" fill="none" stroke="#ff8a5c" stroke-width="1.6"/>`:'').join('');
  return svgEl(`<svg viewBox="0 0 ${w} ${hh}" width="${w+10}" height="${hh+4}" aria-hidden="true"><path d="${d}" fill="none" stroke="${L.fr?'#b07a3e':'#6aa7ff'}" stroke-width="2.4" stroke-linejoin="round"/>${lp}</svg>`);};
function renderCoasterSetup(){renderLevelPicker($('caLevels'),$('caTotal'),'coaster',CA_LEVELS,CA_PACKS,caStart,caMini);}
function caStart(i){
  const L=CA_LEVELS[i];
  CAS={i,pieces:{},steel:[],Hs:L.pts.map((p,k)=>k===0?Math.min(p.hi,L.par+3<p.hi?Math.max(p.lo,5):p.lo+2):p.h!==undefined?p.h:p.build?0:p.lo),sel:0,hint:0,raf:0,pos:0,run:false,fail:-1,rec:CAS&&CAS.i===i?CAS.rec:0};
  show('s-coaster');$('caResult').hidden=true;caRender(true);
}
const caCtxNow=()=>caCtx(caLvl(),CAS.pieces,CAS.steel);
function caSay(t,kind){const c=$('caCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),t);}
function caStop(){if(CAS&&CAS.raf){cancelAnimationFrame(CAS.raf);CAS.raf=0;}if(CAS)CAS.run=false;}
function caCartAt(S,pos){const a=Math.max(0,Math.min(S.length-1,Math.floor(pos))),b=Math.min(S.length-1,a+1),f=pos-a,A=S[a],B=S[b];
  const px=s=>s.loop?caXk(s.k)+s.r*CAM*Math.sin(s.th):caXk(s.k),py=s=>caY(s.y);
  const x=px(A)+(px(B)-px(A))*f,y=py(A)+(py(B)-py(A))*f,ang=Math.atan2(py(B)-py(A),px(B)-px(A))*180/Math.PI;
  const dh=A.dh+(B.dh-A.dh)*f,Eh=A.Eh+(B.Eh-A.Eh)*f,yy=A.y+(B.y-A.y)*f;
  return {x,y,ang:Math.abs(b-a)?ang:0,dh,Eh,yy,seg:A.seg};}
/* scenery that never changes during a level */
function caScenery(){
  let s=`<defs><linearGradient id="caSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb2f5"/><stop offset=".7" stop-color="#bfe4ff"/><stop offset="1" stop-color="#e8f6ff"/></linearGradient>
<radialGradient id="caSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8c8"/><stop offset=".4" stop-color="#ffd23f" stop-opacity=".8"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
<linearGradient id="caGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fbf4f"/><stop offset="1" stop-color="#3f8a36"/></linearGradient>
<linearGradient id="caCar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a6a"/><stop offset="1" stop-color="#c8282a"/></linearGradient>
<linearGradient id="caSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#8fa4c6"/></linearGradient></defs>
<rect width="${CAW}" height="${CAH}" rx="16" fill="url(#caSky)"/><circle cx="790" cy="70" r="70" fill="url(#caSun)"/><circle cx="790" cy="70" r="22" fill="#ffe27a"/>`;
  [[120,70,1],[420,46,.8],[640,110,.7]].forEach(([x,y,k])=>{s+=`<g transform="translate(${x} ${y}) scale(${k})" opacity=".9" class="cacloud"><ellipse cx="0" cy="0" rx="46" ry="16" fill="#fff"/><ellipse cx="-20" cy="-10" rx="22" ry="16" fill="#fff"/><ellipse cx="14" cy="-14" rx="26" ry="20" fill="#fff"/></g>`;});
  s+=`<path d="M0 ${CAG-40}C120 ${CAG-90} 220 ${CAG-60} 330 ${CAG-80}S560 ${CAG-50} 680 ${CAG-95}S860 ${CAG-60} 900 ${CAG-70}V${CAG}H0Z" fill="#9fd08a" opacity=".55"/>`;
  for(let m=0;m<=CA_HMAX;m+=4)s+=`<line x1="0" y1="${caY(m)}" x2="${CAW}" y2="${caY(m)}" stroke="#ffffff" stroke-opacity=".45" stroke-width="1"/><text x="8" y="${caY(m)-3}" font-size="11" font-weight="700" fill="#3a5a7a" font-family="system-ui">${m} m</text>`;
  s+=`<rect y="${CAG}" width="${CAW}" height="${CAH-CAG}" fill="url(#caGrass)"/><rect y="${CAG}" width="${CAW}" height="5" fill="#2f6a2a"/>`;
  [[30,0],[870,0],[455,1]].forEach(([x,k])=>{s+=`<g transform="translate(${x} ${CAG+2})"><rect x="-3" y="-18" width="6" height="18" fill="#6b4a2c"/><circle cy="-26" r="${k?11:14}" fill="#3f8a36"/><circle cx="-6" cy="-20" r="9" fill="#4f9a3a"/></g>`;});
  return s;}
function caBoardSvg(G){
  const L=caLvl(),ctx=CAS.ctx,Hs=CAS.Hs,S=G.S,n=Hs.length,h0=Hs[0];
  let s=CAS.scen||(CAS.scen=caScenery());
  /* energy line (bends where friction changes) */
  s+=`<path d="${ctx.cum.map((c,i)=>(i?'L':'M')+caXk(i)+' '+caY(h0-c)).join('')}" stroke="#0b8f7a" stroke-width="3" stroke-dasharray="9 7" fill="none"/><text x="${caXk(n-1)-4}" y="${caY(h0-ctx.cum[n-1])-8}" text-anchor="end" font-size="13" font-weight="800" fill="#0b6f5f" font-family="system-ui">energy line</text>`;
  /* supports */
  Hs.forEach((v,i)=>{if(v<=0)return;const x=caXk(i),st=ctx.steel.includes(Math.max(0,i-1))||ctx.steel.includes(i),c=st?'#e8eef8':'#8a5a2e',w=i===0?10:7;
    s+=`<path d="M${x-w} ${CAG}L${x} ${caY(v)}L${x+w} ${CAG}" stroke="${c}" stroke-width="3" fill="none"/>`;for(let y=CAG-18;y>caY(v)+8;y-=22){const f=(CAG-y)/(CAG-caY(v)),ww=w*(1-f);s+=`<path d="M${x-ww} ${y}L${x+ww} ${y-14}" stroke="${c}" stroke-width="1.6"/>`;}});
  /* track, segment by segment: wood or steel */
  const segs=[];S.forEach(p=>{(segs[p.seg]=segs[p.seg]||[]).push(p);});
  const xs=p=>(p.loop?caXk(p.k)+p.r*CAM*Math.sin(p.th):caXk(p.k)).toFixed(1);
  segs.forEach((pts,j)=>{const prev=j>0?segs[j-1][segs[j-1].length-1]:null,all=prev?[prev,...pts]:pts,d=all.map((p,i)=>(i?'L':'M')+xs(p)+' '+caY(p.y).toFixed(1)).join(''),st=ctx.steel.includes(j);
    s+=st?`<path d="${d}" fill="none" stroke="#2a3550" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#5a6a8a" stroke-width="14" stroke-dasharray="2 10" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="url(#caSteel)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`
      :`<path d="${d}" fill="none" stroke="#4a2e14" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#8a5a2e" stroke-width="15" stroke-dasharray="3 9" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e0a85a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    if(L.steel)s+=`<path class="caseg${st?' steel':''}" data-seg="${j}" d="${d}" fill="none" stroke="transparent" stroke-width="26" stroke-linecap="round" aria-label="Track stretch ${j+1}, ${st?'steel':'wood'}"/>`;});
  /* hint 3: the best design */
  if(CAS.hint>=3){L.solHs.forEach((v,i)=>{const p=ctx.pts[i];if(i===0||p.lo!==undefined)s+=`<circle cx="${caXk(i)}" cy="${caY(v)}" r="16" fill="none" stroke="#37e0c1" stroke-width="4" stroke-dasharray="6 5"/>`;});
    (L.solSteel||[]).forEach(j=>{s+=`<path d="M${caXk(j)} ${CAG-6}H${caXk(j+1)}" stroke="#37e0c1" stroke-width="5" stroke-dasharray="8 6"/>`;});}
  /* build slots */
  L.pts.forEach((p,i)=>{if(!p.build)return;const x=caXk(i),k=CAS.pieces[i];
    s+=`<g class="caslot${k?' full':''}" data-pt="${i}" aria-label="${p.name}: ${k?CA_PIECES[k].n:'empty slot'}"><rect x="${x-34}" y="${k?caY(Math.max(Hs[i],0))-30:CAG-74}" width="68" height="${k?Math.max(60,CAG-caY(Hs[i])+34):74}" rx="14" fill="${k?'transparent':'rgba(255,255,255,.4)'}" stroke="${k?'transparent':'#2f6bff'}" stroke-width="2.5" stroke-dasharray="7 6"/>${k?'':`<text x="${x}" y="${CAG-34}" text-anchor="middle" font-size="12" font-weight="900" fill="#1d4fd0" font-family="system-ui">drop a</text><text x="${x}" y="${CAG-19}" text-anchor="middle" font-size="12" font-weight="900" fill="#1d4fd0" font-family="system-ui">piece</text>`}</g>`;});
  /* handles */
  Hs.forEach((v,i)=>{const p=ctx.pts[i],ed=i===0||p.lo!==undefined,sel=CAS.sel===i,x=caXk(i),y=caY(v);
    if(p.empty)return;
    if(ed)s+=`<g class="cahandle${sel?' sel':''}" data-pt="${i}"><circle cx="${x}" cy="${y}" r="${i===0?20:17}" fill="${sel?'#2f6bff':'#fff'}" stroke="#2f6bff" stroke-width="4"/><path d="M${x-6} ${y+2}l6-8 6 8M${x-6} ${y+5}l6 8 6-8" fill="none" stroke="${sel?'#fff':'#2f6bff'}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    else if(!p.loop)s+=`<circle cx="${x}" cy="${y}" r="6" fill="#55617d"/>`;
    const nm=i===0?'start ':'';s+=`<text x="${x}" y="${y-(ed?27:p.loop?p.loop*2*CAM+10:14)}" text-anchor="middle" font-size="14" font-weight="800" fill="#1b2a4a" font-family="system-ui" stroke="#fff" stroke-width="3" paint-order="stroke">${nm}${p.loop?p.loop+' m loop':v+' m'}</text>`;});
  /* failure mark */
  if(CAS.fail>=0){const c=caCartAt(S,CAS.fail);s+=`<g transform="translate(${c.x} ${c.y-30})"><circle r="15" fill="#ff3355"/><path d="M-6 -6l12 12M6 -6l-12 12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>`;}
  /* cart */
  s+=`<g id="caSpark"></g><g id="caCart"><g transform="translate(0 0)"><rect x="-21" y="-25" width="42" height="19" rx="7" fill="url(#caCar)" stroke="#7a1414" stroke-width="2.2"/><path d="M21 -22q8 2 8 10v4h-8z" fill="#ffd23f" stroke="#7a1414" stroke-width="2"/><rect x="-17" y="-19" width="34" height="3" fill="#fff" opacity=".5"/>`+
    `<circle cx="-8" cy="-31" r="5.5" fill="#f2c39a"/><circle cx="7" cy="-31" r="5.5" fill="#8a5a3a"/><path class="caarms" d="M-12 -32l-5-10M-4 -32l3-10M3 -32l-3-10M11 -32l5-10" stroke="#f2c39a" stroke-width="2.6" stroke-linecap="round"/>`+
    `<circle cx="-12" cy="-4" r="5.5" fill="#2a2f45" stroke="#9aa6c6" stroke-width="1.5"/><circle cx="12" cy="-4" r="5.5" fill="#2a2f45" stroke="#9aa6c6" stroke-width="1.5"/></g></g>`;
  const sv=$('caBoard');sv.setAttribute('viewBox',`0 0 ${CAW} ${CAH}`);sv.innerHTML=s;
  return caCartMove(S,CAS.pos);
}
/* move only the cart (and its friction sparks) during a ride */
function caCartMove(S,pos){const c=caCartAt(S,pos),g=document.getElementById('caCart');
  if(g)g.setAttribute('transform',`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${(CAS.fail>=0&&pos>=CAS.fail?0:c.ang).toFixed(1)})`);
  if(g)g.classList.toggle('fast',Math.sqrt(2*CA_G*Math.max(0,c.dh))>9);
  const sp=document.getElementById('caSpark'),L=caLvl();
  if(sp){const wood=L.fr>0&&!CAS.ctx.steel.includes(c.seg)&&CAS.run;let t='';
    if(wood)for(let i=0;i<4;i++){const a=Math.random()*Math.PI,r=6+Math.random()*10;t+=`<circle cx="${(c.x-Math.cos(a)*r).toFixed(1)}" cy="${(c.y-2+Math.sin(a)*4).toFixed(1)}" r="${(1.2+Math.random()*1.6).toFixed(1)}" fill="${i%2?'#ffb347':'#ff6a2a'}"/>`;}
    sp.innerHTML=t;}
  return c;}
function caRender(reset){
  const L=caLvl();CAS.ctx=caCtxNow();caFixFlats(CAS.ctx,CAS.Hs);const G=CAS.G=caGoals(L,CAS.Hs,CAS.ctx);
  if(reset){CAS.pos=0;CAS.scen=null;}
  $('caLvl').textContent=CAS.i+1;$('caLvlN').textContent=CA_N;$('caUsed').textContent=CAS.Hs[0];$('caPar').textContent=L.par;
  $('caName').textContent=L.name;$('caStory').textContent=L.story;$('caIntro').hidden=!L.intro;$('caIntro').textContent=L.intro||'';
  const c=caBoardSvg(G);
  caBars(c);
  $('caGoalList').replaceChildren(...G.res.map(r=>h('li',{class:r.ok?'ok':'bad'},h('span',{class:'tk'},r.ok?'✓':'✗'),h('span',null,r.label,!r.ok&&r.why?h('small',null,' '+r.why):null))));
  const p=CAS.ctx.pts[CAS.sel],ed=CAS.sel===0||(p&&p.lo!==undefined);
  $('caSel').textContent=CAS.sel===0?'the start hill':(p.name||('hill '+CAS.sel));
  $('caUp').disabled=CAS.run||!ed||CAS.Hs[CAS.sel]>=(CAS.sel===0?L.pts[0].hi:p.hi);$('caDown').disabled=CAS.run||!ed||CAS.Hs[CAS.sel]<=(CAS.sel===0?L.pts[0].lo:p.lo);
  $('caLaunch').disabled=CAS.run;
  $('caScrub').max=G.S.length-1;$('caScrub').value=Math.round(CAS.pos);
  caTools();caCoach();caHintUI();
}
function caTools(){
  const L=caLvl(),box=$('caToolBox'),list=[...new Set(L.pts.flatMap(p=>p.build||[]))];if(L.steel)list.push('steel');
  box.hidden=!list.length;if(!list.length)return;
  const left=(L.steel||0)-CAS.steel.length;
  $('caTools').replaceChildren(...list.map(k=>h('button',{type:'button',class:'catool k'+k,'data-tool':k,disabled:CAS.run||(k==='steel'&&left<=0),'aria-label':`${CA_PIECES[k].n}: ${CA_PIECES[k].d}. Drag it onto the track.`},
    svgEl(`<svg viewBox="0 0 40 26" width="40" height="26" aria-hidden="true">${({hill:'<path d="M2 22C12 22 14 4 20 4S28 22 38 22" stroke="#e0a85a" stroke-width="4" fill="none"/>',dip:'<path d="M2 6C12 6 14 22 20 22S28 6 38 6" stroke="#e0a85a" stroke-width="4" fill="none"/>',flat:'<path d="M2 14H38" stroke="#e0a85a" stroke-width="4"/>',loop2:'<path d="M2 22H14a6 6 0 1 1 12 0H38" stroke="#e0a85a" stroke-width="4" fill="none"/>',loop3:'<path d="M2 23H11a9 9 0 1 1 18 0H38" stroke="#e0a85a" stroke-width="4" fill="none"/>',steel:'<path d="M2 14H38" stroke="#2a3550" stroke-width="7"/><path d="M2 14H38" stroke="#dfe8f6" stroke-width="3"/>'})[k]}</svg>`),
    h('span',null,h('b',null,CA_PIECES[k].n),h('small',null,k==='steel'?`${left} left`:CA_PIECES[k].d)))));
}
function caCoach(){
  const G=CAS.G,L=caLvl();
  if(CAS.run)return caSay('The cart is rolling. Watch potential energy turn into kinetic energy!');
  if(CAS.ctx.pts.some(p=>p.empty))return caSay('Drag a track piece from the toolbox into each dashed slot.');
  if(CAS.fail>=0)return caSay(G.res[0].why||'The cart stalled. Raise the start hill.','alert');
  if(G.ok)return caSay('Every goal is checked. Press Launch!');
  const bad=G.res.find(r=>!r.ok);caSay(bad.label.indexOf('Cart makes')===0?'The cart will not make it. Raise the start hill so the dashed energy line stays above the track.':'Goal not met yet: '+bad.label+'.');
}
function caAdjust(dv){
  if(CAS.run)return;const L=caLvl(),i=CAS.sel,p=CAS.ctx.pts[i],lo=i===0?L.pts[0].lo:p.lo,hi=i===0?L.pts[0].hi:p.hi;
  if(i>0&&p.lo===undefined)return;
  const v=Math.max(lo,Math.min(hi,CAS.Hs[i]+dv));if(v===CAS.Hs[i])return;
  CAS.Hs[i]=v;CAS.fail=-1;CAS.pos=0;$('caResult').hidden=true;caRender();
}
let caLastDrop=0;
function caDropTool(k,t){
  if(CAS.run)return;const L=caLvl();caLastDrop=Date.now();
  if(k==='steel'){const j=+t.dataset.seg;if(!CAS.steel.includes(j)&&CAS.steel.length<(L.steel||0))CAS.steel.push(j);}
  else{const i=+t.dataset.pt,p=L.pts[i];if(!p.build||!p.build.includes(k))return;CAS.pieces[i]=k;CAS.Hs[i]=k==='hill'?Math.max(p.lo,Math.min(p.hi,6)):0;CAS.sel=k==='hill'?i:CAS.sel;}
  CAS.fail=-1;CAS.pos=0;$('caResult').hidden=true;caRender();
  const tgt=k==='steel'?$('caBoard').querySelector(`.caseg[data-seg="${t.dataset.seg}"]`):$('caBoard').querySelector(`.caslot[data-pt="${t.dataset.pt}"]`);
  if(tgt)Art.burstAt(tgt,{n:10,colors:k==='steel'?['#dfe8f6','#9fb6d8','#fff']:['#e0a85a','#ffd23f','#fff'],shape:['star','dot'],speed:160});
  caSay(k==='steel'?'Steel placed. Look: the energy line drops less over that stretch.':`${CA_PIECES[k].n} placed.${k==='hill'?' Drag its blue handle to set the height.':''}`);
}
function caLaunch(){
  if(CAS.run)return;CAS.ctx=caCtxNow();const G=CAS.G=caGoals(caLvl(),CAS.Hs,CAS.ctx);
  if(CAS.ctx.pts.some(p=>p.empty)){caSay('Drop a track piece into every dashed slot before you launch.','alert');return;}
  const S=G.S,end=G.f>=0?G.f:S.length-1;
  CAS.fail=-1;CAS.pos=0;CAS.run=true;$('caResult').hidden=true;caRender();let last=performance.now();const my=CAS;
  if(Art.reduced())CAS.pos=end;
  const step=now=>{
    if(CAS!==my||!CAS.run)return;const dt=Math.max(0,Math.min(0.05,(now-last)/1000));last=now;
    const i=Math.max(0,Math.min(S.length-1,Math.floor(CAS.pos))),v=Math.sqrt(2*CA_G*Math.max(0,S[i].dh));
    CAS.pos=Math.min(end,CAS.pos+dt*(5+v*1.6));
    const c=caCartMove(S,CAS.pos);caBars(c);$('caScrub').value=Math.round(CAS.pos);
    if(CAS.pos>=end){CAS.run=false;CAS.raf=0;
      if(G.f>=0){CAS.fail=G.f;CAS.pos=G.f;fx.pop({icon:'question',text:'Stalled!',kind:'oops'});}
      caRender();
      if(G.f<0&&G.ok)caWin();
      else if(G.f<0)caSay('The cart finished, but a goal in the list is not met. Fix the red items and try again.','alert');
      return;}
    CAS.raf=requestAnimationFrame(step);};
  CAS.raf=requestAnimationFrame(step);
}
function caBars(c){
  const h0=CAS.Hs[0],hs=Math.max(0,c.yy),ke=Math.max(0,c.dh),heat=Math.max(0,h0-c.Eh),T=Math.max(h0,1);
  $('caPE').style.width=(hs/T*100)+'%';$('caKE').style.width=(ke/T*100)+'%';$('caHE').style.width=(heat/T*100)+'%';
  $('caSpeed').textContent=Math.sqrt(2*CA_G*ke).toFixed(1);
}
function caWin(){
  const L=caLvl(),h0=CAS.Hs[0],stars=h0<=L.par?3:h0<=L.par+2?2:1;
  if(!(CAS.rec>=stars)){CAS.rec=stars;recordStars('coaster',CAS.i+1,stars,{h:h0,par:L.par});}
  fx.pop({icon:'bolt',text:stars===3?'Perfect ride!':'What a ride!',kind:'great',size:'big'});fx.confetti(stars===3?90:50);
  setTimeout(()=>{try{$('caResult').scrollIntoView({block:'nearest',behavior:'smooth'});}catch(_){}},60);
  levelResult($('caResult'),{stars,next:CAS.i+1<CA_N,
    line:['Your start hill was ',h('b',null,h0+' m'),'. The 3-star design needs only ',h('b',null,L.par+' m'),'.',stars<3?' A lower lift hill saves energy. Can you trim it?':' Efficient engineering!'],
    fact:L.fact,onNext:()=>caStart(CAS.i+1),onRetry:()=>{$('caResult').hidden=true;},onLevels:()=>{caStop();renderCoasterSetup();show('s-coaster-setup');}});
}
function caHintUI(){
  const L=caLvl(),n=CAS.hint,sp=Object.entries(L.solPieces||{}).map(([i,k])=>`${CA_PIECES[k].n.toLowerCase()} at ${L.pts[i].name}`),st=(L.solSteel||[]).length?` Steel on stretch ${L.solSteel.map(j=>j+1).join(' and ')}.`:'';
  $('caHintTxt').textContent=['Need a hint?','Another hint','Show me the answer','Answer shown'][n];$('caHint').disabled=n>=3;
  const b=$('caHintBox');b.hidden=n===0;
  b.replaceChildren(...[n>=1?h('div',null,I('bulb'),' ',h('b',null,'Clue: '),L.clue):null,
    n>=2?h('div',null,I('lens'),' ',h('b',null,'Tip: '),`The best start hill is between ${Math.max(L.pts[0].lo,L.par-2)} and ${L.par+2} m tall.`):null,
    n>=3?h('div',null,I('eye'),' ',h('b',null,'Answer: '),`Start at ${L.par} m.${sp.length?' Use a '+sp.join(', ')+'.':''}${st} The teal marks show where.`):null]);
}
$('caHint').onclick=()=>{if(CAS.hint<3){CAS.hint++;caRender();}};
$('caLaunch').onclick=caLaunch;
$('caReset').onclick=()=>{caStop();CAS.pos=0;CAS.fail=-1;$('caResult').hidden=true;caRender();};
$('caUp').onclick=()=>caAdjust(1);$('caDown').onclick=()=>caAdjust(-1);
$('caBack').onclick=()=>{caStop();renderCoasterSetup();show('s-coaster-setup');};
$('caScrub').oninput=e=>{caStop();CAS.pos=+e.target.value;CAS.fail=-1;const c=caCartMove(CAS.G.S,CAS.pos);caBars(c);};
(()=>{const sv=$('caBoard');let drag=null;
  const toH=e=>{const r=sv.getBoundingClientRect(),y=(e.clientY-r.top)*CAH/r.height;return Math.round((CAG-y)/CAM);};
  sv.addEventListener('pointerdown',e=>{
    if(CAS.run||document.querySelector('.art-picked'))return;const g=e.target.closest&&e.target.closest('.cahandle');if(!g)return;
    const i=+g.getAttribute('data-pt');CAS.sel=i;drag={i,id:e.pointerId};try{sv.setPointerCapture(e.pointerId);}catch(_){}
    e.preventDefault();caRender();});
  sv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;
    const L=caLvl(),p=CAS.ctx.pts[drag.i],lo=drag.i===0?L.pts[0].lo:p.lo,hi=drag.i===0?L.pts[0].hi:p.hi,v=Math.max(lo,Math.min(hi,toH(e)));
    if(v!==CAS.Hs[drag.i]){CAS.Hs[drag.i]=v;CAS.fail=-1;CAS.pos=0;$('caResult').hidden=true;caRender();}});
  const end=e=>{if(drag&&e.pointerId===drag.id)drag=null;};
  sv.addEventListener('pointerup',end);sv.addEventListener('pointercancel',end);
  /* tap a steel stretch to take the steel back */
  sv.addEventListener('click',e=>{if(!CAS||CAS.run||Date.now()-caLastDrop<450||document.querySelector('.art-picked'))return;const s=e.target.closest&&e.target.closest('.caseg.steel');if(!s)return;
    CAS.steel=CAS.steel.filter(j=>j!==+s.dataset.seg);CAS.fail=-1;CAS.pos=0;caRender();caSay('Steel taken back. That stretch is wood again.');});
  Art.drag({root:$('s-coaster'),items:'.catool',targets:'.caslot,.caseg',
    accept:(it,t)=>{if(!CAS||CAS.run)return false;const k=it.dataset.tool,L=caLvl();
      if(k==='steel')return t.classList.contains('caseg')&&!t.classList.contains('steel')&&CAS.steel.length<(L.steel||0);
      return t.classList.contains('caslot')&&L.pts[+t.dataset.pt].build.includes(k);},
    label:it=>it.getAttribute('aria-label')||'track piece',onDrop:(it,t)=>caDropTool(it.dataset.tool,t)});
})();
/*CAUI>>*/
