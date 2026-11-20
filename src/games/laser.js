/*<<LZENGINE*/
const LZ_DIR={'>':[1,0],'<':[-1,0],'^':[0,-1],'v':[0,1]};
function lzParse(def){
  const rows=def.map.map(r=>r.split('')),H=rows.length,W=rows[0].length;
  const L={W,H,cells:[],targets:[],alarms:[],laser:null,name:def.name};
  for(let y=0;y<H;y++){L.cells.push([]);for(let x=0;x<W;x++){
    const c=rows[y][x];let t='.';
    if(LZ_DIR[c]){L.laser={x,y,dx:LZ_DIR[c][0],dy:LZ_DIR[c][1]};t='L';}
    else if(c==='*'){t='*';L.targets.push({x,y});}
    else if(c==='!'){t='!';L.alarms.push({x,y});}
    else if(c==='#'||c==='g'||c==='/'||c==='\\'||c==='t'||c==='u')t=c;
    L.cells[y].push(t);}}
  return L;
}
/* placed: object "x,y" -> {t:'M'|'T'|'B', o:'/'|'\\'} ; returns beam segments, lit targets, hit alarms */
function lzTrace(L,placed){
  const segs=[],lit={},hit={},seen={};
  const stack=[{x:L.laser.x,y:L.laser.y,dx:L.laser.dx,dy:L.laser.dy,i:1}];
  const refl=(dx,dy,o)=>o==='/'?[-dy,-dx]:[dy,dx];
  while(stack.length){
    let b=stack.pop(),{x,y,dx,dy}=b,sx=x,sy=y;
    for(let n=0;n<300;n++){
      const nx=x+dx,ny=y+dy;
      if(nx<0||ny<0||nx>=L.W||ny>=L.H){segs.push([sx,sy,x+dx*.5,y+dy*.5,b.i]);break;}
      const k=nx+','+ny,p=placed[k],c=p?p.t:L.cells[ny][nx];
      const key=k+','+dx+','+dy;if(seen[key]){segs.push([sx,sy,nx,ny,b.i]);break;}seen[key]=1;
      if(c==='#'||c==='B'||c==='L'){segs.push([sx,sy,nx-dx*.5,ny-dy*.5,b.i]);break;}
      if(c==='*'){segs.push([sx,sy,nx,ny,b.i]);lit[k]=1;break;}
      if(c==='!'){segs.push([sx,sy,nx,ny,b.i]);hit[k]=1;break;}
      if(c==='/'||c==='\\'||c==='M'){
        const o=c==='M'?p.o:c;segs.push([sx,sy,nx,ny,b.i]);
        const r=refl(dx,dy,o);dx=r[0];dy=r[1];x=nx;y=ny;sx=nx;sy=ny;continue;}
      if(c==='T'||c==='t'||c==='u'){
        const o=c==='T'?p.o:(c==='t'?'/':'\\'),r=refl(dx,dy,o);
        stack.push({x:nx,y:ny,dx:r[0],dy:r[1],i:b.i/2});
        b={x:nx,y:ny,dx,dy,i:b.i/2};x=nx;y=ny;continue;}
      x=nx;y=ny;   /* empty floor or clear glass: light passes straight through */
    }
  }
  const ok=L.targets.every(t=>lit[t.x+','+t.y])&&L.alarms.every(a=>!hit[a.x+','+a.y]);
  return {segs,lit,hit,ok};
}
/* cheapest solution: iterative deepening over cells the beams actually cross */
function lzSolve(L,inv,maxN){
  const types=[];Object.keys(inv).forEach(t=>{if(inv[t]>0){if(t==='B')types.push(['B','/']);else{types.push([t,'/']);types.push([t,'\\']);}}});
  const total=Object.keys(inv).reduce((a,t)=>a+inv[t],0),lim=Math.min(maxN||total,total);
  for(let k=0;k<=lim;k++){
    const seen={};
    const rec=(placed,left,left_inv)=>{
      const tr=lzTrace(L,placed);
      if(tr.ok&&left===0)return placed;
      if(left===0)return null;
      const cand={};
      tr.segs.forEach(s=>{
        const x0=Math.round(s[0]),y0=Math.round(s[1]),x1=Math.floor(s[2]+.5),y1=Math.floor(s[3]+.5);
        const ax=Math.min(Math.round(s[0]),Math.round(s[2])),bx=Math.max(Math.round(s[0]),Math.round(s[2]));
        const ay=Math.min(Math.round(s[1]),Math.round(s[3])),by=Math.max(Math.round(s[1]),Math.round(s[3]));
        for(let yy=ay;yy<=by;yy++)for(let xx=ax;xx<=bx;xx++){
          if(xx<0||yy<0||xx>=L.W||yy>=L.H)continue;
          if(L.cells[yy][xx]==='.'&&!placed[xx+','+yy])cand[xx+','+yy]=1;}});
      for(const ck of Object.keys(cand)){
        for(const ty of types){
          if(left_inv[ty[0]]<=0)continue;
          const np=Object.assign({},placed);np[ck]={t:ty[0],o:ty[1]};
          const sig=Object.keys(np).sort().map(q=>q+np[q].t+np[q].o).join(';');
          if(seen[sig])continue;seen[sig]=1;
          const ni=Object.assign({},left_inv);ni[ty[0]]--;
          const r=rec(np,left-1,ni);if(r)return r;}}
      return null;
    };
    const r=rec({},k,Object.assign({},inv));
    if(r)return {n:k,sol:Object.keys(r).map(q=>{const [x,y]=q.split(',').map(Number);return [x,y,r[q].t,r[q].o];})};
  }
  return null;
}
/*LZENGINE>>*/
/*<<LZLEVELS*/
const LZ_LEVELS=[
 {pack:'Mirrors',name:'First Light',story:'The laser is on! Bounce it onto the crystal to switch on the lab sign.',
  clue:'A mirror turns a beam. Put one where the beam should change direction.',fact:'A mirror reflects light. The beam leaves at the same angle it arrived.',
  intro:'New tool: the Mirror. Place it, then click it to flip which way it leans.',
  map:['....*..','.......','>......','.......','.......'],inv:{M:1}},
 {pack:'Mirrors',name:'Double Bounce',story:'The crystal is up in the corner. One mirror will not be enough.',
  clue:'First send the beam up. Then turn it toward the crystal.',fact:'Light can bounce off many mirrors in a row. Each bounce follows the same rule.',
  map:['.......','......*','.......','....###','>......'],inv:{M:2}},
 {pack:'Mirrors',name:'Around the Wall',story:'A solid wall blocks the middle. There is one gap along the bottom.',
  clue:'The beam cannot go through the wall. Find the gap at the bottom.',fact:'Black or solid walls absorb light, so a beam has to go around them.',
  map:['...#....','...#..*.','>..#....','...#....','........'],inv:{M:3}},
 {pack:'Mirrors',name:'Zig-Zag',story:'The crystal is at the far end of a zig-zag hall.',
  clue:'Follow the hall. Every corner of the beam needs a mirror.',fact:'Reflected light keeps its energy. The beam is just as bright after each bounce.',
  map:['>.......','#######.','........','.#######','.......*'],inv:{M:4}},
 {pack:'Mirrors',name:'Mirror Maze',story:'Someone left mirrors fixed to the floor. Use them, or work around them.',
  clue:'Trace the beam first. Where does it go after the fixed mirror?',fact:'The angle in equals the angle out. That is the law of reflection.',
  map:['........','........','>.\\.....','........','.....\\.*','........'],inv:{M:3}},
 {pack:'Glass',name:'The Window',story:'A black wall has one glass window. The beam can pass through glass.',
  clue:'Clear glass lets light through. It does not bend or stop the beam here.',fact:'Clear glass transmits light. Most of the light passes straight through.',
  intro:'Clear glass transmits light. Black walls absorb it. Aim for the window!',
  map:['...#...*','...#.###','>..g....','...#....','...#....'],inv:{M:2}},
 {pack:'Glass',name:'Window Shopping',story:'The window is high up and the laser is down low.',
  clue:'Aim the beam at the window first. Then steer it to the crystal.',fact:'Windows work because glass transmits light and walls absorb it.',
  map:['...#...*','...#....','...g....','...#....','...#....','>..#....'],inv:{M:4}},
 {pack:'Glass',name:'Tilted Glass',story:'Two crystals, one laser. Glass can reflect a little and pass a little.',
  clue:'Tilted glass splits the beam in two. Send one half to each crystal.',fact:'Real glass both reflects and transmits light. That is why you can see your face in a window.',
  intro:'New tool: Tilted glass. It reflects part of the beam and lets part through. One beam becomes two!',
  map:['.......*','........','>.......','........','.......*'],inv:{T:1,M:3}},
 {pack:'Glass',name:'Two Splits',story:'Both crystals are back by the laser this time.',
  clue:'Split the beam twice. Each tilted glass sends one part toward a crystal.',fact:'Each split makes the beams weaker. The light energy is shared between them.',
  map:['*.......','........','>...#...','........','*.......'],inv:{T:2,M:3}},
 {pack:'Glass',name:'Glass Gauntlet',story:'Glass, walls and a tight route. Think about what each material does.',
  clue:'Only the glass cell lets the beam through the wall.',fact:'Materials respond to light differently: reflect, transmit or absorb.',
  map:['....#...*','....g....','>...#....','....#....','....#....','.........'],inv:{M:4,T:1}},
 {pack:'Shields',name:'Alarm Hall',story:'An alarm sensor sits right in the laser\'s path. Do not set it off!',
  clue:'Turn the beam before it reaches the alarm.',fact:'Light travels in a straight line until it hits something.',
  intro:'Red alarms go off if any light hits them. Keep the beam away!',
  map:['.......*','........','>..!....','........','........'],inv:{M:2}},
 {pack:'Shields',name:'Block the Beam',story:'A fixed tilted glass splits the beam and one half heads for the alarm.',
  clue:'Something black can stop the unwanted beam.',fact:'A black surface absorbs light and turns it into a tiny bit of heat.',
  intro:'New tool: the Black block. It absorbs all light that hits it.',
  map:['...!....','........','>..t...*','........'],inv:{B:1,M:2}},
 {pack:'Shields',name:'Shield and Steer',story:'Split the beam, shield one alarm and steer the other half.',
  clue:'Count the beams. Each one must end up at a crystal or in a black block.',fact:'Engineers shield sensors with black material so stray light does not set them off.',
  map:['.......*','........','>..t...!','........','..!....*'],inv:{M:4,B:2}},
 {pack:'Shields',name:'Light Show',story:'Three crystals. One laser. A lot of glass.',
  clue:'Use tilted glass to share the beam three ways.',fact:'One light source can power many receivers when the beam is split.',
  map:['..*.....','........','>.......','...!....','..*...*.'],inv:{T:2,M:3,B:1}},
 {pack:'Shields',name:'Grand Laser Master',story:'The final lab. Two crystals, two alarms, no mistakes.',
  clue:'Split once, steer with mirrors, and block the leftover beams.',fact:'Reflect, transmit, absorb: that is how light interacts with matter.',
  map:['*..#...!','........','>..u....','........','...!...*'],inv:{M:4,T:2,B:2}}
];
/*LZLEVELS>>*/
/*<<LZBAKE*/
const LZ_BAKE=[[1,[[4,2,"M","/"]]],[2,[[1,4,"M","/"],[1,1,"M","/"]]],[3,[[1,2,"M","\\"],[1,4,"M","\\"],[6,4,"M","/"]]],[4,[[7,0,"M","\\"],[7,2,"M","/"],[0,2,"M","/"],[0,4,"M","\\"]]],[2,[[2,3,"M","\\"],[5,3,"M","\\"]]],[2,[[4,2,"M","/"],[4,0,"M","/"]]],[3,[[1,5,"M","/"],[1,2,"M","/"],[7,2,"M","/"]]],[3,[[1,2,"T","/"],[7,2,"M","\\"],[1,0,"M","/"]]],[4,[[1,2,"T","/"],[2,2,"T","\\"],[2,4,"M","/"],[1,0,"M","\\"]]],[3,[[1,2,"M","/"],[1,1,"M","/"],[8,1,"M","/"]]],[2,[[1,2,"M","/"],[1,0,"M","/"]]],[1,[[3,1,"B","/"]]],[3,[[4,2,"M","\\"],[4,4,"M","\\"],[3,0,"M","/"]]],[4,[[1,2,"T","/"],[2,2,"T","\\"],[6,2,"M","\\"],[1,0,"M","/"]]],[4,[[1,2,"M","/"],[1,0,"M","\\"],[1,1,"T","/"],[7,1,"M","\\"]]]];
/*LZBAKE>>*/
/*<<LZUI*/
LZ_LEVELS.forEach((d,i)=>{d.L=lzParse(d);d.par=LZ_BAKE[i][0];d.sol=LZ_BAKE[i][1];});
const LZ_N=LZ_LEVELS.length;
const LZ_PACKS={0:'Pack 1: Mirrors',5:'Pack 2: Glass and Windows',10:'Pack 3: Shields and Alarms'};
const LZT={M:['Mirror','Reflects all the light'],T:['Tilted glass','Reflects some, lets some through'],B:['Black block','Absorbs all the light']};
const LZ_ORDER=['M','T','B'];
let LZ=null;
const lzCur=()=>LZ_LEVELS[LZ.i];
const lzKey=(x,y)=>x+','+y;
const lzUsed=()=>Object.keys(LZ.placed).length;
const lzCount=t=>Object.values(LZ.placed).filter(p=>p.t===t).length;
const lzLeft=t=>(lzCur().inv[t]||0)-lzCount(t);
function lzIcon(t,sz){
  sz=sz||34;let b='';
  if(t==='M')b='<line x1="7" y1="27" x2="27" y2="7" stroke="#2f3a57" stroke-width="7" stroke-linecap="round"/><line x1="7" y1="27" x2="27" y2="7" stroke="#e3e9f4" stroke-width="4.4" stroke-linecap="round"/><line x1="10" y1="24" x2="24" y2="10" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>';
  else if(t==='T')b='<line x1="7" y1="27" x2="27" y2="7" stroke="#5f93c4" stroke-width="7" stroke-linecap="round"/><line x1="7" y1="27" x2="27" y2="7" stroke="#cfeaff" stroke-width="4.4" stroke-linecap="round" opacity=".75"/><line x1="10" y1="24" x2="24" y2="10" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>';
  else if(t==='B')b='<rect x="5" y="5" width="24" height="24" rx="6" fill="#07080c" stroke="#59627f" stroke-width="2"/><rect x="8" y="8" width="18" height="6" rx="3" fill="#fff" opacity=".12"/>';
  else b='<path d="M9 9l16 16M25 9L9 25" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 34 34" width="${sz}" height="${sz}" aria-hidden="true">${b}</svg>`;
}
const lzMini=d=>{const L=d.L,s=11;let t=`<svg viewBox="0 0 ${L.W*s} ${L.H*s}" width="${L.W*s}" height="${L.H*s}" class="lzmini" aria-hidden="true"><rect width="${L.W*s}" height="${L.H*s}" rx="3" fill="#1a2238"/>`;
  for(let y=0;y<L.H;y++)for(let x=0;x<L.W;x++){const c=L.cells[y][x];
    const f=c==='#'?'#59627f':c==='g'?'#8fd0ff':c==='*'?'#f4b13a':c==='!'?'#ff4d6d':c==='L'?'#37e0c1':c==='/'||c==='\\'?'#dfe6f3':c==='t'||c==='u'?'#8fd0ff':null;
    if(f)t+=`<rect x="${x*s+1}" y="${y*s+1}" width="${s-2}" height="${s-2}" rx="${c==='*'||c==='!'?s/2:1.5}" fill="${f}"/>`;}
  return svgEl(t+'</svg>');};
function renderLaserSetup(){renderLevelPicker($('lzLevels'),$('lzTotal'),'laser',LZ_LEVELS,LZ_PACKS,lzStart,lzMini);}
function lzStart(i){
  LZ={i,placed:{},tool:null,hint:0,solved:false};
  show('s-laser');$('lzMsg').textContent='';$('lzResult').hidden=true;lzRender();
}
function lzPiece(t,o,cx,cy,cls){
  const y1=o==='/'?cy+22:cy-22,y2=o==='/'?cy-22:cy+22,x1=cx-22,x2=cx+22;
  if(t==='B')return `<g class="${cls||''}"><rect x="${cx-26}" y="${cy-26}" width="52" height="52" rx="9" fill="#05060a" stroke="#6b7595" stroke-width="2.4"/><rect x="${cx-20}" y="${cy-21}" width="40" height="9" rx="4" fill="#fff" opacity=".1"/><circle cx="${cx}" cy="${cy+3}" r="9" fill="none" stroke="#6b7595" stroke-width="1.4" opacity=".6"/><circle cx="${cx}" cy="${cy+3}" r="3.5" fill="#6b7595" opacity=".7"/></g>`;
  if(t==='T')return `<g class="${cls||''}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#4f86b8" stroke-width="15" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#bfe3ff" stroke-opacity=".72" stroke-width="10" stroke-linecap="round"/><line x1="${x1+4}" y1="${o==='/'?y1-4:y1+4}" x2="${x2-4}" y2="${o==='/'?y2+4:y2-4}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/></g>`;
  return `<g class="${cls||''}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2c3550" stroke-width="13" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#lzMir)" stroke-width="8.5" stroke-linecap="round"/><line x1="${x1+4}" y1="${o==='/'?y1-4:y1+4}" x2="${x2-4}" y2="${o==='/'?y2+4:y2-4}" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".85"/></g>`;
}
function lzSvg(){
  const d=lzCur(),L=d.L,S=64,W=L.W,H=L.H,tr=LZ.tr=lzTrace(L,LZ.placed);
  let s=`<defs><linearGradient id="lzMir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fc"/><stop offset=".5" stop-color="#aab6cc"/><stop offset="1" stop-color="#eef2f9"/></linearGradient>`+
   `<radialGradient id="lzGlow"><stop offset="0" stop-color="#ffd76a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient>`+
   `<radialGradient id="lzRed"><stop offset="0" stop-color="#ff3355" stop-opacity=".9"/><stop offset="1" stop-color="#ff3355" stop-opacity="0"/></radialGradient>`+
   `<linearGradient id="lzGem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b8"/><stop offset=".55" stop-color="#f4b13a"/><stop offset="1" stop-color="#d98712"/></linearGradient>`+
   `<pattern id="lzHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#2a3149"/><rect width="4" height="10" fill="#343c58"/></pattern>`+
   `<filter id="lzBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter></defs>`+
   `<rect width="${W*S}" height="${H*S}" rx="14" fill="#141b2f"/>`;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)s+=`<rect x="${x*S+1.5}" y="${y*S+1.5}" width="${S-3}" height="${S-3}" rx="7" fill="${(x+y)%2?'#1b2440':'#18203a'}"/>`;
  /* fixed pieces */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=L.cells[y][x],cx=x*S+S/2,cy=y*S+S/2;
    if(c==='#')s+=`<rect x="${x*S+2}" y="${y*S+2}" width="${S-4}" height="${S-4}" rx="6" fill="url(#lzHatch)" stroke="#4a5476" stroke-width="2"/>`;
    else if(c==='g')s+=`<rect x="${x*S+6}" y="${y*S+6}" width="${S-12}" height="${S-12}" rx="6" fill="#8fd0ff" fill-opacity=".2" stroke="#a9dcff" stroke-opacity=".9" stroke-width="2"/><path d="M${x*S+14} ${y*S+S-14}L${x*S+S-14} ${y*S+14}M${x*S+14} ${y*S+S-30}L${x*S+S-30} ${y*S+14}" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`;
    else if(c==='/'||c==='\\')s+=lzPiece('M',c,cx,cy,'fixed');
    else if(c==='t'||c==='u')s+=lzPiece('T',c==='t'?'/':'\\',cx,cy,'fixed');}
  /* beams */
  const seg=(k)=>tr.segs.map(q=>`<line x1="${q[0]*S+S/2}" y1="${q[1]*S+S/2}" x2="${q[2]*S+S/2}" y2="${q[3]*S+S/2}" ${k(q[4])}/>`).join('');
  s+=`<g filter="url(#lzBlur)">${seg(i=>`stroke="#ff2e63" stroke-width="16" stroke-linecap="round" opacity="${.35+.45*i}"`)}</g>`+
     `<g>${seg(i=>`stroke="#ff5d7d" stroke-width="7" stroke-linecap="round" opacity="${.6+.4*i}"`)}${seg(i=>`stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity="${.7+.3*i}"`)}</g>`+
     `<g class="lzflow">${seg(i=>`stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="3 22" opacity="${.5+.4*i}"`)}</g>`;
  /* laser, targets, alarms */
  const ls=L.laser,lcx=ls.x*S+S/2,lcy=ls.y*S+S/2,ang=Math.atan2(ls.dy,ls.dx)*180/Math.PI;
  s+=`<g transform="rotate(${ang} ${lcx} ${lcy})"><rect x="${lcx-26}" y="${lcy-19}" width="48" height="38" rx="9" fill="#2c3550" stroke="#5a6794" stroke-width="2"/><rect x="${lcx+8}" y="${lcy-10}" width="22" height="20" rx="5" fill="#1a2036" stroke="#5a6794" stroke-width="2"/><circle cx="${lcx+31}" cy="${lcy}" r="7" fill="#ff5d7d"/><circle cx="${lcx+31}" cy="${lcy}" r="3" fill="#fff"/><circle cx="${lcx-12}" cy="${lcy}" r="5" fill="#37e0c1"/></g>`;
  L.targets.forEach(t=>{const cx=t.x*S+S/2,cy=t.y*S+S/2,on=tr.lit[lzKey(t.x,t.y)];
    s+=on?`<circle cx="${cx}" cy="${cy}" r="34" fill="url(#lzGlow)" class="lzpulse"/><polygon points="${cx},${cy-24} ${cx+18},${cy} ${cx},${cy+24} ${cx-18},${cy}" fill="url(#lzGem)" stroke="#fff3b8" stroke-width="2.4"/><polygon points="${cx},${cy-24} ${cx+18},${cy} ${cx},${cy-3} ${cx-18},${cy}" fill="#fff" opacity=".35"/>`
    :`<polygon points="${cx},${cy-24} ${cx+18},${cy} ${cx},${cy+24} ${cx-18},${cy}" fill="#4a587a" stroke="#8b9abf" stroke-width="2.4"/><polygon points="${cx},${cy-24} ${cx+18},${cy} ${cx},${cy-3} ${cx-18},${cy}" fill="#fff" opacity=".12"/>`;});
  L.alarms.forEach(a=>{const cx=a.x*S+S/2,cy=a.y*S+S/2,on=tr.hit[lzKey(a.x,a.y)];
    s+=(on?`<circle cx="${cx}" cy="${cy}" r="36" fill="url(#lzRed)" class="lzpulse fast"/>`:'')+`<rect x="${cx-19}" y="${cy+8}" width="38" height="11" rx="4" fill="#3a4263"/><path d="M${cx-17} ${cy+9}a17 17 0 0 1 34 0z" fill="${on?'#ff2d4d':'#7a2638'}" stroke="${on?'#ffd0d8':'#a74a5d'}" stroke-width="2"/><rect x="${cx-4}" y="${cy-9}" width="8" height="12" rx="3" fill="#fff" opacity="${on?.9:.3}"/>`;});
  /* hint 3: the answer, drawn as a faint ghost */
  if(LZ.hint>=3)d.sol.forEach(q=>{const cx=q[0]*S+S/2,cy=q[1]*S+S/2;s+=lzPiece(q[2],q[3],cx,cy,'lzghostp')+`<rect x="${q[0]*S+4}" y="${q[1]*S+4}" width="${S-8}" height="${S-8}" rx="8" fill="none" stroke="#37e0c1" stroke-width="2.4" stroke-dasharray="6 6"/>`;});
  /* placed pieces */
  Object.keys(LZ.placed).forEach(k=>{const p=LZ.placed[k],q=k.split(',').map(Number);s+=lzPiece(p.t,p.o,q[0]*S+S/2,q[1]*S+S/2,'lzplaced'+(LZ.lift===k?' lift':''));});
  s+=`<rect id="lzHov" width="${S-6}" height="${S-6}" rx="8" fill="#6aa7ff" fill-opacity=".22" stroke="#9fc4ff" stroke-width="2.4" style="display:none;pointer-events:none"/>`;
  const sv=$('lzBoard');sv.setAttribute('viewBox',`0 0 ${W*S} ${H*S}`);sv.style.maxWidth=Math.min(W*84,820)+'px';sv.innerHTML=s;
}
function lzCell(cx,cy){const r=$('lzBoard').getBoundingClientRect(),L=lzCur().L;
  const x=Math.floor((cx-r.left)/r.width*L.W),y=Math.floor((cy-r.top)/r.height*L.H);return(x>=0&&y>=0&&x<L.W&&y<L.H)?[x,y]:null;}
function lzSay(t,kind){const c=$('lzCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),t);}
function lzRender(){
  const d=lzCur(),L=d.L;
  $('lzLvl').textContent=LZ.i+1;$('lzLvlN').textContent=LZ_N;$('lzUsed').textContent=lzUsed();$('lzPar').textContent=d.par;
  $('lzName').textContent=d.name;$('lzStory').textContent=d.story;
  $('lzGoal').replaceChildren(...[h('span',null,'Goal:'),h('span',{class:'tag g'},'◆ Light all '+L.targets.length+' crystal'+(L.targets.length>1?'s':'')),
    L.alarms.length?h('span',{class:'tag bad'},'● Never touch '+(L.alarms.length>1?'the '+L.alarms.length+' alarms':'the alarm')):null].filter(Boolean));
  $('lzIntro').hidden=!d.intro;$('lzIntro').textContent=d.intro||'';
  $('lzTools').replaceChildren(...LZ_ORDER.filter(t=>d.inv[t]).map(t=>{const left=lzLeft(t),b=h('button',{class:'tool'+(LZ.tool===t?' on':''),disabled:left<=0&&LZ.tool!==t,
      title:LZT[t][0]+': '+LZT[t][1]+'. Drag me onto the maze, or click me and then click a square.',
      onclick:()=>{if(performance.now()<ttDrag.noClick)return;LZ.tool=LZ.tool===t?null:t;lzRender();}},
      h('span',{class:'ti'},svgEl(lzIcon(t,30))),h('span',null,h('b',null,LZT[t][0]),h('small',null,LZT[t][1])),h('span',{class:'cost'},'×'+left));
    b.addEventListener('pointerdown',e=>{if(left<=0)return;ttDragStart(e,{makeGhost:()=>{const g=h('div',{class:'dragghost'},h('span',{class:'ti'},svgEl(lzIcon(t,28))),LZT[t][0]);return g;},
      drop:(x,y)=>{const c=lzCell(x,y);if(c)lzPlace(c,t,'/');else lzSay('Drop it right onto a square in the maze.');}});});
    return b;}),
    h('button',{class:'tool'+(LZ.tool==='X'?' on':''),title:'Remove tool: click a piece to take it back.',onclick:()=>{LZ.tool=LZ.tool==='X'?null:'X';lzRender();}},
      h('span',{class:'ti'},svgEl(lzIcon('X',30))),h('span',null,h('b',null,'Remove'),h('small',null,'Click a piece to take it back'))));
  lzSvg();lzCoach();lzHintUI();
  const tr=LZ.tr;
  if(tr.ok&&lzUsed()>0){if(!LZ.solved){LZ.solved=true;lzWin();}}
  else if(LZ.solved){LZ.solved=false;$('lzResult').hidden=true;}
}
function lzCoach(){
  const d=lzCur(),L=d.L,tr=LZ.tr,nl=L.targets.filter(t=>tr.lit[lzKey(t.x,t.y)]).length,hitA=L.alarms.some(a=>tr.hit[lzKey(a.x,a.y)]);
  if(tr.ok&&lzUsed()>0)return lzSay('Every crystal is lit and no alarm went off. Nice!','go');
  if(hitA)return lzSay('The beam is hitting an alarm! Turn it away with a mirror, or block it with something black.','alert');
  if(!lzUsed())return lzSay(LZ.tool?'Now click a square in the maze (or drag the piece there).':'Pick a piece from step 1, then click a square. Follow the red beam!');
  if(nl)return lzSay(`${nl} of ${L.targets.length} crystals are lit. Keep going!`);
  const lastCells=tr.segs.length;if(!tr.segs.some(q=>Math.hypot(q[2]-q[0],q[3]-q[1])>0))return lzSay('Follow the beam. Where does it need to turn?');
  lzSay(LZ.tool?'Click a square on the beam to place your piece. Click a placed mirror to flip it.':'Click a mirror to flip it. Drag a piece off the maze to take it back.');
}
function lzPlace(c,t,o){
  const L=lzCur().L,k=lzKey(c[0],c[1]);
  if(L.cells[c[1]][c[0]]!=='.'||LZ.placed[k]){lzSay('That square is taken. Pick an empty one.','alert');return;}
  if(lzLeft(t)<=0){lzSay('You are out of those pieces.','alert');return;}
  LZ.placed[k]={t,o:o||'/'};lzRender();
}
function lzHintUI(){
  const d=lzCur(),n=LZ.hint;
  $('lzHintTxt').textContent=['Need a hint?','Another hint','Show me the answer','Answer shown'][n];$('lzHint').disabled=n>=3;
  const b=$('lzHintBox'),cnt={};d.sol.forEach(q=>{cnt[q[2]]=(cnt[q[2]]||0)+1;});
  const names=LZ_ORDER.filter(t=>cnt[t]).map(t=>cnt[t]+' '+LZT[t][0].toLowerCase()+(cnt[t]>1&&t!=='B'?'s':cnt[t]>1?'s':''));
  b.hidden=n===0;b.replaceChildren(...[n>=1?h('div',null,I('bulb'),' ',h('b',null,'Clue: '),d.clue):null,
    n>=2?h('div',null,I('lens'),' ',h('b',null,'Pieces: '),'This level can be solved with '+d.par+' piece'+(d.par>1?'s':'')+': '+andList(names)+'.'):null,
    n>=3?h('div',null,I('eye'),' ',h('b',null,'Answer: '),'The dashed squares on the maze show where the pieces go. Click them to flip.'):null]);
}
function lzWin(){
  const d=lzCur(),n=lzUsed(),stars=n<=d.par?3:n<=d.par+1?2:1;
  if(!(LZ.rec>=stars)){LZ.rec=stars;recordStars('laser',LZ.i+1,stars,{pieces:n,par:d.par});}
  fx.pop({icon:'sparkle',text:stars===3?'Perfect!':'Crystals lit!',kind:'great',size:'big'});fx.confetti(stars===3?90:50);
  $('lzMsg').textContent='';
  levelResult($('lzResult'),{stars,next:LZ.i+1<LZ_N,
    line:['You used ',h('b',null,n),` piece${n>1?'s':''}. The 3-star target is `,h('b',null,d.par),'.',stars<3?' Can you do it with fewer?':' You found the cheapest way!'],
    fact:d.fact,onNext:()=>lzStart(LZ.i+1),onRetry:()=>{$('lzResult').hidden=true;},onLevels:()=>{renderLaserSetup();show('s-laser-setup');}});
}
$('lzHint').onclick=()=>{if(LZ.hint<3){LZ.hint++;lzRender();}};
$('lzClear').onclick=()=>{LZ.placed={};LZ.solved=false;$('lzResult').hidden=true;lzRender();};
$('lzBack').onclick=()=>{renderLaserSetup();show('s-laser-setup');};
(()=>{const sv=$('lzBoard');
  sv.addEventListener('pointerdown',e=>{
    const c=lzCell(e.clientX,e.clientY);if(!c)return;const k=lzKey(c[0],c[1]),p=LZ.placed[k];
    ttDragStart(e,{
      makeGhost:()=>p?h('div',{class:'dragghost'},h('span',{class:'ti'},svgEl(lzIcon(p.t,28))),LZT[p.t][0]):h('div',{style:'display:none'}),
      begin:()=>{if(p){LZ.lift=k;lzSvg();}},
      end:()=>{LZ.lift=null;},
      drop:(x,y)=>{if(!p)return;const t=lzCell(x,y);
        if(!t){delete LZ.placed[k];lzRender();return;}
        const k2=lzKey(t[0],t[1]);if(k2===k){lzRender();return;}
        if(lzCur().L.cells[t[1]][t[0]]!=='.'||LZ.placed[k2]){lzRender();return;}
        delete LZ.placed[k];LZ.placed[k2]=p;lzRender();},
      click:()=>{
        if(p){if(LZ.tool==='X'||p.t==='B')delete LZ.placed[k];else p.o=p.o==='/'?'\\':'/';lzRender();return;}
        if(!LZ.tool||LZ.tool==='X'){lzSay('Pick a piece from step 1 first, then click a square.');return;}
        lzPlace(c,LZ.tool,'/');}});
  });
  sv.addEventListener('pointermove',e=>{const hv=$('lzHov');if(!hv)return;const c=lzCell(e.clientX,e.clientY),L=lzCur().L;
    if(c&&LZ.tool&&LZ.tool!=='X'&&L.cells[c[1]][c[0]]==='.'&&!LZ.placed[lzKey(c[0],c[1])]){hv.setAttribute('x',c[0]*64+3);hv.setAttribute('y',c[1]*64+3);hv.style.display='';}else hv.style.display='none';});
  sv.addEventListener('pointerleave',()=>{const hv=$('lzHov');if(hv)hv.style.display='none';});
})();
/*LZUI>>*/
