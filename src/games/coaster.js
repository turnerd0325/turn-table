/*<<CAENGINE*/
const CA_MINDH=0.5,CA_G=10,CA_SEG=12,CA_LOOPN=28;
/* monotone cubic interpolation of heights between track posts (never overshoots) */
function caSlopes(y){const n=y.length,d=[],m=[];
  for(let i=0;i<n-1;i++)d.push(y[i+1]-y[i]);
  m.push(d[0]);for(let i=1;i<n-1;i++)m.push(d[i-1]*d[i]<=0?0:(d[i-1]+d[i])/2);m.push(d[n-2]);
  for(let i=0;i<n-1;i++){if(d[i]===0){m[i]=0;m[i+1]=0;}else{const a=m[i]/d[i],b=m[i+1]/d[i],s=a*a+b*b;if(s>9){const t=3/Math.sqrt(s);m[i]=t*a*d[i];m[i+1]=t*b*d[i];}}}
  return m;}
function caHerm(y,m,i,u){const u2=u*u,u3=u2*u;return (2*u3-3*u2+1)*y[i]+(u3-2*u2+u)*m[i]+(-2*u3+3*u2)*y[i+1]+(u3-u2)*m[i+1];}
/* every sample of the cart's ride. Hs[0] is the start height. */
function caSamples(L,Hs){
  const n=Hs.length,m=caSlopes(Hs),h0=Hs[0],fr=L.fr,out=[];
  for(let j=0;j<n-1;j++){
    for(let q=(j===0?0:1);q<=CA_SEG;q++){const u=q/CA_SEG,k=j+u,y=caHerm(Hs,m,j,u),Eh=h0-fr*k;
      out.push({k,y,Eh,dh:Eh-y,req:(q===CA_SEG&&k>0)?CA_MINDH:0,post:q===CA_SEG?j+1:-1,loop:false});}
    const pt=L.pts[j+1];
    if(pt&&pt.loop&&j+1<n){const r=pt.loop,b=Hs[j+1],Eh=h0-fr*(j+1);
      for(let q=1;q<=CA_LOOPN;q++){const th=2*Math.PI*q/CA_LOOPN,y=b+r*(1-Math.cos(th));
        out.push({k:j+1,y,Eh,dh:Eh-y,req:Math.max(0,-r*Math.cos(th)/2),post:-1,loop:true,th,r,b});}}
  }
  return out;
}
const caFirstFail=S=>{for(let i=1;i<S.length;i++)if(S[i].dh<S[i].req-1e-9)return i;return -1;};
function caGoals(L,Hs){
  const S=caSamples(L,Hs),f=caFirstFail(S),n=Hs.length,h0=Hs[0],fr=L.fr,res=[];
  const at=i=>{const E=h0-fr*i;return Math.max(0,E-Hs[i]);};
  const sp=i=>Math.sqrt(2*CA_G*at(i));
  let why='';
  if(f>=0){const s=S[f];why=s.loop?'It ran out of speed at the top of a loop (needs enough energy to stay on the track).':`It ran out of energy near hill ${Math.min(n-1,Math.ceil(s.k))}. The energy line dropped to the track.`;}
  res.push({label:'Cart makes it to the end',ok:f<0,why});
  (L.goals||[]).forEach(g=>{
    if(g.t==='minv'){const v=sp(g.at);res.push({label:`Speed at "${g.name}": at least ${g.v} m/s`,ok:v>=g.v-1e-9,why:`Right now it is ${v.toFixed(1)} m/s.`});}
    if(g.t==='maxv'){const v=sp(g.at);res.push({label:`Speed at "${g.name}": no more than ${g.v} m/s`,ok:v<=g.v+1e-9&&f<0,why:`Right now it is ${v.toFixed(1)} m/s.`});}
    if(g.t==='minh'){res.push({label:`"${g.name}" is at least ${g.h} m tall`,ok:Hs[g.at]>=g.h,why:`It is ${Hs[g.at]} m now.`});}
  });
  return {S,f,res,ok:res.every(r=>r.ok)};
}
const caEditable=L=>L.pts.map((p,i)=>i>0&&p.lo!==undefined?i:-1).filter(i=>i>=0);
function caSolve(L){ /* lowest start height that can work (brute force over editable posts) */
  const ed=caEditable(L);
  for(let h0=L.pts[0].lo;h0<=L.pts[0].hi;h0++){
    const Hs=L.pts.map((p,i)=>i===0?h0:p.lo===undefined?p.h:p.lo);
    const found=(function r(k){if(k===ed.length)return caGoals(L,Hs).ok;const p=L.pts[ed[k]];for(let v=p.lo;v<=p.hi;v++){Hs[ed[k]]=v;if(r(k+1))return true;}return false;})(0);
    if(found)return {par:h0,Hs:Hs.slice()};
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
 {pack:null,name:'Thrill Hill',fr:0,story:'Park managers want a thrilling second hill: at least 9 m tall! Build it, then make sure the cart can still get over it.',
  clue:'First raise the middle hill to 9 m. Then raise the start until the cart clears it.',
  fact:'Taller hills give a bigger thrill but need more starting energy. Engineers always start a coaster with its highest hill.',
  pts:[caP(3,CA_HMAX),{h:0},{lo:0,hi:14,name:'the thrill hill'},{h:2},{h:0}],goals:[{t:'minh',at:2,h:9,name:'the thrill hill'}]},
 {pack:null,name:'Gentle Landing',fr:0,story:'Riders must arrive at the end platform at 8 m/s or slower. Raise the end platform to slow the cart.',
  clue:'A higher end platform means the cart has dropped less by the end, so it keeps less speed.',
  fact:'A cart that ends higher has more potential energy left and less kinetic energy. That means it is moving slower.',
  pts:[caP(3,CA_HMAX),{h:0},{h:8},{lo:0,hi:14,name:'the end platform'}],goals:[{t:'maxv',at:3,v:8,name:'the end platform'}]},
 {pack:'Pack 2: Friction',name:'Heat Loss',fr:0.5,story:'Friction turns some energy into heat on every stretch of track. Get the cart over both hills!',
  clue:'The energy line now slopes down. That is energy escaping as heat. Make sure it stays above every hill.',
  intro:'New: friction. Some of the cart\'s energy turns into thermal energy (heat) as it rolls. Watch the red heat bar grow.',
  fact:'Friction does not destroy energy. It changes some into thermal energy. The total energy stays the same.',
  pts:[caP(3,CA_HMAX),{h:0},{h:6},{h:0},{h:5},{h:0}],goals:[]},
 {pack:null,name:'Long Ride',fr:0.8,story:'A long track means more friction. Reach the end past three hills.',
  clue:'The last hill is the hardest. Friction has been stealing energy the whole way.',
  fact:'The longer the track, the more energy turns into heat. That is why real coasters get shorter hills toward the end.',
  pts:[caP(3,CA_HMAX),{h:0},{h:7},{h:0},{h:6},{h:0},{h:5},{h:0}],goals:[]},
 {pack:null,name:'Fast and Far',fr:0.6,story:'Build a tall middle hill (8 m) and still hit 15 m/s at the bottom after it.',
  clue:'Fast bottom plus tall hill plus friction: the start height must beat all three.',
  fact:'Engineers balance height, speed and friction. Raising the lift hill costs energy, so they use the lowest hill that works.',
  pts:[caP(3,CA_HMAX),{h:0},{lo:0,hi:12,name:'the tall hill'},{h:0,name:'the second bottom'},{h:6},{h:0}],goals:[{t:'minh',at:2,h:8,name:'the tall hill'},{t:'minv',at:3,v:15,name:'the second bottom'}]},
 {pack:'Pack 3: Loops & Safety',name:'Loop the Loop',fr:0.4,story:'Add a 3 m radius loop. The cart must stay on the track at the very top.',
  clue:'At the top of a loop, the cart needs enough speed to stay pressed to the track. That takes extra height.',
  intro:'Loops need a minimum speed at the top. The loop top is 2 × radius high, and the cart needs 2.5 × radius of starting energy.',
  fact:'To stay on a loop, the cart needs a start height of at least 2.5 times the loop radius. Slower, and gravity pulls it off the track.',
  pts:[caP(3,CA_HMAX),{h:0},{h:0,loop:3},{h:0}],goals:[]},
 {pack:null,name:'Twin Loops',fr:0.5,story:'Two loops in a row: a small one, then a big one. Friction takes energy from the first one.',
  clue:'Check the second loop. It needs more height, and the cart has already lost some energy.',
  fact:'Each trip through a loop costs a bit of energy to friction, so later loops should be smaller than earlier ones.',
  pts:[caP(3,CA_HMAX),{h:0},{h:0,loop:2},{h:0},{h:0,loop:3},{h:0}],goals:[]},
 {pack:null,name:'Grand Coaster',fr:0.5,story:'The final design! Build a 7 m hill, loop the loop, and stop the cart gently: no more than 6 m/s at the end.',
  clue:'Raise the end platform to slow the cart. Then check every goal in the list.',
  fact:'Real coaster designers use exactly this energy accounting: lift hill, hills, loops, friction and brakes all have to add up.',
  pts:[caP(3,CA_HMAX),{h:0},{h:0,loop:2},{h:0},{lo:0,hi:14,name:'the big hill'},{h:0},{lo:0,hi:16,name:'the end platform'}],
  goals:[{t:'minh',at:4,h:7,name:'the big hill'},{t:'maxv',at:6,v:6,name:'the end platform'}]}
];
CA_LEVELS.forEach(L=>{const r=caSolve(L);if(!r)throw new Error('unsolvable '+L.name);L.par=r.par;L.solHs=r.Hs;});
const CA_N=CA_LEVELS.length;
/*CALEVELS>>*/
/*<<CAUI*/
const CA_PACKS={0:'Pack 1: Hills',4:'Pack 2: Friction',7:'Pack 3: Loops & Safety'};
const CAW=900,CAH=440,CAG=402,CAM=22,CAX0=80,CAX1=840;
let CAS=null;
const caLvl=()=>CA_LEVELS[CAS.i];
const caXk=k=>CAX0+k*(CAX1-CAX0)/(caLvl().pts.length-1);
const caY=y=>CAG-y*CAM;
const caMini=L=>{const n=L.pts.length,w=44,hh=30,hs=L.pts.map((p,i)=>i===0?L.par:p.h!==undefined?p.h:(p.lo+p.hi)/2),mx=Math.max(...hs,8);
  let d='';hs.forEach((v,i)=>{d+=(i?'L':'M')+(2+i*(w-4)/(n-1)).toFixed(1)+' '+(hh-3-v/mx*(hh-8)).toFixed(1);});
  const lp=L.pts.map((p,i)=>p.loop?`<circle cx="${2+i*(w-4)/(n-1)}" cy="${hh-3-p.loop*1.7}" r="${p.loop*1.4}" fill="none" stroke="#ff8a5c" stroke-width="1.6"/>`:'').join('');
  return svgEl(`<svg viewBox="0 0 ${w} ${hh}" width="${w+10}" height="${hh+4}" aria-hidden="true"><path d="${d}" fill="none" stroke="#6aa7ff" stroke-width="2.4" stroke-linejoin="round"/>${lp}</svg>`);};
function renderCoasterSetup(){renderLevelPicker($('caLevels'),$('caTotal'),'coaster',CA_LEVELS,CA_PACKS,caStart,caMini);}
function caStart(i){
  const L=CA_LEVELS[i];
  CAS={i,Hs:L.pts.map((p,k)=>k===0?Math.min(p.hi,L.par+3<p.hi?Math.max(p.lo,5):p.lo+2):p.h!==undefined?p.h:p.lo),sel:0,hint:0,raf:0,pos:0,run:false,fail:-1,rec:CAS&&CAS.i===i?CAS.rec:0};
  show('s-coaster');$('caResult').hidden=true;caRender(true);
}
function caSay(t,kind){const c=$('caCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),t);}
function caStop(){if(CAS&&CAS.raf){cancelAnimationFrame(CAS.raf);CAS.raf=0;}if(CAS)CAS.run=false;}
function caCartAt(S,pos){const a=Math.max(0,Math.min(S.length-1,Math.floor(pos))),b=Math.min(S.length-1,a+1),f=pos-a,A=S[a],B=S[b];
  const px=s=>s.loop?caXk(s.k)+s.r*CAM*Math.sin(s.th):caXk(s.k),py=s=>caY(s.y);
  const x=px(A)+(px(B)-px(A))*f,y=py(A)+(py(B)-py(A))*f,ang=Math.atan2(py(B)-py(A),px(B)-px(A))*180/Math.PI;
  const dh=A.dh+(B.dh-A.dh)*f,Eh=A.Eh+(B.Eh-A.Eh)*f,yy=A.y+(B.y-A.y)*f;
  return {x,y,ang:Math.abs(b-a)?ang:0,dh,Eh,yy};}
function caBoardSvg(G){
  const L=caLvl(),Hs=CAS.Hs,S=G.S,n=Hs.length,h0=Hs[0];
  let s=`<defs><linearGradient id="caSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#d9f1ff"/></linearGradient></defs><rect width="${CAW}" height="${CAH}" rx="16" fill="url(#caSky)"/>`;
  for(let m=0;m<=CA_HMAX;m+=4)s+=`<line x1="0" y1="${caY(m)}" x2="${CAW}" y2="${caY(m)}" stroke="#ffffff" stroke-opacity=".55" stroke-width="1"/><text x="8" y="${caY(m)-3}" font-size="11" font-weight="700" fill="#4a6a8a" font-family="system-ui">${m} m</text>`;
  s+=`<rect y="${CAG}" width="${CAW}" height="${CAH-CAG}" fill="#5c8a4f"/><rect y="${CAG}" width="${CAW}" height="6" fill="#3f6a36"/>`;
  /* energy line */
  s+=`<path d="M${caXk(0)} ${caY(h0)} L${caXk(n-1)} ${caY(h0-L.fr*(n-1))}" stroke="#0b8f7a" stroke-width="3" stroke-dasharray="9 7" fill="none"/><text x="${caXk(n-1)-4}" y="${caY(h0-L.fr*(n-1))-8}" text-anchor="end" font-size="13" font-weight="800" fill="#0b6f5f" font-family="system-ui">energy line</text>`;
  /* supports */
  Hs.forEach((v,i)=>{s+=`<line x1="${caXk(i)}" y1="${caY(v)}" x2="${caXk(i)}" y2="${CAG}" stroke="#7b8294" stroke-width="${i===0?9:5}" stroke-linecap="round"/>`;});
  /* track */
  let d='';S.forEach((p,i)=>{const x=p.loop?caXk(p.k)+p.r*CAM*Math.sin(p.th):caXk(p.k);d+=(i?'L':'M')+x.toFixed(1)+' '+caY(p.y).toFixed(1);});
  s+=`<path d="${d}" fill="none" stroke="#3b2a1e" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#e8a64a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(CAS.hint>=3)L.solHs.forEach((v,i)=>{if(L.pts[i].h===undefined||i===0)s+=`<circle cx="${caXk(i)}" cy="${caY(v)}" r="16" fill="none" stroke="#37e0c1" stroke-width="4" stroke-dasharray="6 5"/>`;});
  /* handles */
  Hs.forEach((v,i)=>{const p=L.pts[i],ed=i===0||p.lo!==undefined,sel=CAS.sel===i,x=caXk(i),y=caY(v);
    if(ed)s+=`<g class="cahandle${sel?' sel':''}" data-pt="${i}"><circle cx="${x}" cy="${y}" r="${i===0?20:17}" fill="${sel?'#2f6bff':'#fff'}" stroke="#2f6bff" stroke-width="4"/><path d="M${x-6} ${y+2}l6-8 6 8M${x-6} ${y+5}l6 8 6-8" fill="none" stroke="${sel?'#fff':'#2f6bff'}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    else s+=`<circle cx="${x}" cy="${y}" r="6" fill="#55617d"/>`;
    const nm=i===0?'start':'';s+=`<text x="${x}" y="${y-(ed?27:14)}" text-anchor="middle" font-size="14" font-weight="800" fill="#1b2a4a" font-family="system-ui">${nm?nm+' ':''}${v} m</text>`;});
  /* failure mark */
  if(CAS.fail>=0){const c=caCartAt(S,CAS.fail);s+=`<g transform="translate(${c.x} ${c.y-30})"><circle r="15" fill="#ff3355"/><path d="M-6 -6l12 12M6 -6l-12 12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>`;}
  /* cart */
  const c=caCartAt(S,CAS.pos);
  s+=`<g id="caCart" transform="translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${(CAS.fail>=0&&CAS.pos>=CAS.fail?0:c.ang).toFixed(1)})"><rect x="-17" y="-24" width="34" height="18" rx="6" fill="#ff4d4d" stroke="#8a1f1f" stroke-width="2.4"/><rect x="-11" y="-30" width="22" height="9" rx="4" fill="#ffd0a0" stroke="#8a1f1f" stroke-width="2"/><circle cx="-10" cy="-4" r="5" fill="#2a2f45"/><circle cx="10" cy="-4" r="5" fill="#2a2f45"/></g>`;
  const sv=$('caBoard');sv.setAttribute('viewBox',`0 0 ${CAW} ${CAH}`);sv.innerHTML=s;
  return c;
}
function caRender(reset){
  const L=caLvl(),G=CAS.G=caGoals(L,CAS.Hs);
  if(reset)CAS.pos=0;
  $('caLvl').textContent=CAS.i+1;$('caLvlN').textContent=CA_N;$('caUsed').textContent=CAS.Hs[0];$('caPar').textContent=L.par;
  $('caName').textContent=L.name;$('caStory').textContent=L.story;$('caIntro').hidden=!L.intro;$('caIntro').textContent=L.intro||'';
  const c=caBoardSvg(G);
  caBars(c);
  $('caGoalList').replaceChildren(...G.res.map(r=>h('li',{class:r.ok?'ok':'bad'},h('span',{class:'tk'},r.ok?'✓':'✗'),h('span',null,r.label,!r.ok&&r.why?h('small',null,' '+r.why):null))));
  const p=L.pts[CAS.sel],ed=CAS.sel===0||p.lo!==undefined;
  $('caSel').textContent=CAS.sel===0?'the start hill':(p.name||('hill '+CAS.sel));
  $('caUp').disabled=CAS.run||!ed||CAS.Hs[CAS.sel]>=(CAS.sel===0?L.pts[0].hi:p.hi);$('caDown').disabled=CAS.run||!ed||CAS.Hs[CAS.sel]<=(CAS.sel===0?L.pts[0].lo:p.lo);
  $('caLaunch').disabled=CAS.run;
  $('caScrub').max=G.S.length-1;$('caScrub').value=Math.round(CAS.pos);
  caCoach();caHintUI();
}
function caBars(c){
  const L=caLvl(),h0=CAS.Hs[0],hs=Math.max(0,c.yy),ke=Math.max(0,c.dh),heat=Math.max(0,h0-c.Eh),T=Math.max(h0,1);
  $('caPE').style.width=(hs/T*100)+'%';$('caKE').style.width=(ke/T*100)+'%';$('caHE').style.width=(heat/T*100)+'%';
  $('caSpeed').textContent=Math.sqrt(2*CA_G*ke).toFixed(1);
}
function caCoach(){
  const G=CAS.G,L=caLvl();
  if(CAS.run)return caSay('The cart is rolling. Watch potential energy turn into kinetic energy!');
  if(CAS.fail>=0)return caSay(G.res[0].why||'The cart stalled. Raise the start hill.','alert');
  if(G.ok)return caSay('Every goal is checked. Press Launch!');
  const bad=G.res.find(r=>!r.ok);caSay(bad.label.indexOf('Cart makes')===0?'The cart will not make it. Raise the start hill so the dashed energy line stays above the track.':'Goal not met yet: '+bad.label+'.');
}
function caAdjust(dv){
  if(CAS.run)return;const L=caLvl(),i=CAS.sel,p=L.pts[i],lo=i===0?L.pts[0].lo:p.lo,hi=i===0?L.pts[0].hi:p.hi;
  if(i>0&&p.lo===undefined)return;
  const v=Math.max(lo,Math.min(hi,CAS.Hs[i]+dv));if(v===CAS.Hs[i])return;
  CAS.Hs[i]=v;CAS.fail=-1;CAS.pos=0;$('caResult').hidden=true;caRender();
}
function caLaunch(){
  if(CAS.run)return;const G=CAS.G=caGoals(caLvl(),CAS.Hs),S=G.S,end=G.f>=0?G.f:S.length-1;
  CAS.fail=-1;CAS.pos=0;CAS.run=true;$('caResult').hidden=true;caRender();let last=performance.now();const my=CAS;
  const step=now=>{
    if(CAS!==my||!CAS.run)return;const dt=Math.max(0,Math.min(0.05,(now-last)/1000));last=now;
    const i=Math.max(0,Math.min(S.length-1,Math.floor(CAS.pos))),v=Math.sqrt(2*CA_G*Math.max(0,S[i].dh));
    CAS.pos=Math.min(end,CAS.pos+dt*(5+v*1.6));
    const c=caBoardSvg(G);caBars(c);$('caScrub').value=Math.round(CAS.pos);
    if(CAS.pos>=end){CAS.run=false;CAS.raf=0;
      if(G.f>=0){CAS.fail=G.f;CAS.pos=G.f;fx.pop({icon:'question',text:'Stalled!',kind:'oops'});}
      caRender();
      if(G.f<0&&G.ok)caWin();
      else if(G.f<0)caSay('The cart finished, but a goal in the list is not met. Fix the red items and try again.','alert');
      return;}
    CAS.raf=requestAnimationFrame(step);};
  CAS.raf=requestAnimationFrame(step);
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
  const L=caLvl(),n=CAS.hint;
  $('caHintTxt').textContent=['Need a hint?','Another hint','Show me the answer','Answer shown'][n];$('caHint').disabled=n>=3;
  const b=$('caHintBox');b.hidden=n===0;
  b.replaceChildren(...[n>=1?h('div',null,I('bulb'),' ',h('b',null,'Clue: '),L.clue):null,
    n>=2?h('div',null,I('lens'),' ',h('b',null,'Tip: '),`The best start hill is between ${Math.max(L.pts[0].lo,L.par-2)} and ${L.par+2} m tall.`):null,
    n>=3?h('div',null,I('eye'),' ',h('b',null,'Answer: '),`Start at ${L.par} m. The teal circles show where to set the hills.`):null]);
}
$('caHint').onclick=()=>{if(CAS.hint<3){CAS.hint++;caRender();}};
$('caLaunch').onclick=caLaunch;
$('caReset').onclick=()=>{caStop();CAS.pos=0;CAS.fail=-1;$('caResult').hidden=true;caRender();};
$('caUp').onclick=()=>caAdjust(1);$('caDown').onclick=()=>caAdjust(-1);
$('caBack').onclick=()=>{caStop();renderCoasterSetup();show('s-coaster-setup');};
$('caScrub').oninput=e=>{caStop();CAS.pos=+e.target.value;CAS.fail=-1;const c=caBoardSvg(CAS.G);caBars(c);};
(()=>{const sv=$('caBoard');let drag=null;
  const toH=e=>{const r=sv.getBoundingClientRect(),y=(e.clientY-r.top)*CAH/r.height;return Math.round((CAG-y)/CAM);};
  sv.addEventListener('pointerdown',e=>{
    if(CAS.run)return;const g=e.target.closest&&e.target.closest('[data-pt]');if(!g)return;
    const i=+g.getAttribute('data-pt');CAS.sel=i;drag={i,id:e.pointerId};try{sv.setPointerCapture(e.pointerId);}catch(_){}
    e.preventDefault();caRender();});
  sv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;
    const L=caLvl(),p=L.pts[drag.i],lo=drag.i===0?L.pts[0].lo:p.lo,hi=drag.i===0?L.pts[0].hi:p.hi,v=Math.max(lo,Math.min(hi,toH(e)));
    if(v!==CAS.Hs[drag.i]){CAS.Hs[drag.i]=v;CAS.fail=-1;CAS.pos=0;$('caResult').hidden=true;caRender();}});
  const end=e=>{if(drag&&e.pointerId===drag.id)drag=null;};
  sv.addEventListener('pointerup',end);sv.addEventListener('pointercancel',end);
})();
/*CAUI>>*/
