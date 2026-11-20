/* ================= EARTH 1: MOONWATCH (MS-ESS1-1) =================
   "Drive the Moon." Split screen: on the left, a top-down model (sunlight from the right,
   Earth, the Moon's orbit). On the right, the view from Earth. The student DRAGS the Moon
   around its orbit and the Earth view updates live: make a phase, line up an eclipse, show
   what someone in Australia sees, or move the Moon forward in time. Some rounds cover the
   Earth view with clouds: place the Moon first, then lock it in to see if you were right.
   Eclipse levels tilt the Moon's orbit; seasons levels drag Earth around the Sun with the
   tilted axis drawn. Every miss explains what the student actually made.
   Pre/Post-Test (levels 2, 5, 8): same scored items, Earth view covered, one try each. */

const MW_NAMES={0:'New moon',45:'Waxing crescent',90:'First quarter',135:'Waxing gibbous',180:'Full moon',225:'Waning gibbous',270:'Third quarter',315:'Waning crescent'};
const MW_ALL=[0,45,90,135,180,225,270,315],MW_KEY=[0,90,180,270];
const mwN=a=>((a%360)+360)%360;
const mwSnap=a=>mwN(Math.round(a/45)*45);
const mwSeen=th=>(1-Math.cos(th*Math.PI/180))/2;          /* part of the lit half that faces Earth */
const mwDiff=(a,b)=>{const d=mwN(a-b);return d>180?d-360:d;};
const MW_RAD=Math.PI/180;
/* flat phase icon (level picker minis) */
function mwPhase(th,r,cx,cy,dark,lit){
  th=mwN(th);let t=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dark||'#2a2f45'}"/>`;
  const p=mwLit(th,cx,cy,r);return p?t+`<path d="${p}" fill="${lit||'#f6efc8'}"/>`:t+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#5a6385" stroke-width="1.2"/>`;
}
/* the lit part of the Moon as seen from New York (waxing = lit on the right) */
function mwLit(th,cx,cy,r){
  th=mwN(th);if(th<1.2||th>358.8)return '';
  const R=r*1.06;
  if(Math.abs(th-180)<1.2)return `M${cx} ${cy-R}A${R} ${R} 0 1 1 ${cx} ${cy+R}A${R} ${R} 0 1 1 ${cx} ${cy-R}Z`;
  const c=Math.cos(th*MW_RAD),rx=Math.max(.01,Math.abs(c)*r),wax=th<180,f=n=>n.toFixed(2);
  return wax?`M${f(cx)} ${f(cy-r)}L${f(cx+R*.04)} ${f(cy-R)}A${R} ${R} 0 0 1 ${f(cx)} ${f(cy+R)}L${f(cx)} ${f(cy+r)}A${f(rx)} ${r} 0 0 ${c>0?0:1} ${f(cx)} ${f(cy-r)}Z`
    :`M${f(cx)} ${f(cy-r)}L${f(cx-R*.04)} ${f(cy-R)}A${R} ${R} 0 0 0 ${f(cx)} ${f(cy+R)}L${f(cx)} ${f(cy+r)}A${f(rx)} ${r} 0 0 ${c>0?1:0} ${f(cx)} ${f(cy-r)}Z`;
}
let MW_U=0;
const mwUid=()=>'mw'+(++MW_U).toString(36);
/* a real-looking Moon: limb-darkened disk, seas (maria), craters and a soft day/night line */
const MW_MARIA=[[-.36,-.3,.3,.22,20],[.04,-.44,.22,.15,-10],[.26,-.06,.19,.27,15],[-.12,.14,.28,.2,0],[.4,.34,.13,.11,0],[-.47,.27,.11,.17,30],[-.02,.42,.12,.08,0]];
const MW_CRAT=[[.12,.64,.08],[-.56,-.6,.06],[.62,-.38,.06],[-.2,-.72,.045],[.68,.12,.05]];
function mwMoonG(th,cx,cy,r,o){
  o=o||{};const u=mwUid(),f=n=>(+n).toFixed(2);
  let t=`<defs><radialGradient id="${u}g" cx=".42" cy=".38" r=".66"><stop offset="0" stop-color="#fbf8ee"/><stop offset=".62" stop-color="#e5e0d0"/><stop offset="1" stop-color="#aaa595"/></radialGradient>`+
    `<filter id="${u}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${f(Math.max(.6,r*.045))}"/></filter>`+
    `<mask id="${u}k" maskUnits="userSpaceOnUse" x="${f(cx-r*1.4)}" y="${f(cy-r*1.4)}" width="${f(r*2.8)}" height="${f(r*2.8)}"><rect x="${f(cx-r*1.4)}" y="${f(cy-r*1.4)}" width="${f(r*2.8)}" height="${f(r*2.8)}" fill="#fff"/><path class="mwlit" d="${mwLit(th,cx,cy,r)}" fill="#000" filter="url(#${u}f)"/></mask>`+
    `<clipPath id="${u}c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`;
  t+=`<g${o.rot?` transform="rotate(${o.rot} ${cx} ${cy})"`:''}>`;
  if(o.glow)t+=`<circle class="mwmglow" cx="${cx}" cy="${cy}" r="${f(r*1.35)}" fill="#fff6d6" opacity="${o.glow}" filter="url(#${u}f)"/>`;
  t+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}g)"/><g clip-path="url(#${u}c)">`;
  MW_MARIA.forEach(([x,y,a,b,rt])=>{t+=`<ellipse cx="${f(cx+x*r)}" cy="${f(cy+y*r)}" rx="${f(a*r)}" ry="${f(b*r)}" transform="rotate(${rt} ${f(cx+x*r)} ${f(cy+y*r)})" fill="#8f8b7f" opacity=".5"/>`;});
  if(r>14)MW_CRAT.forEach(([x,y,a])=>{t+=`<circle cx="${f(cx+x*r)}" cy="${f(cy+y*r)}" r="${f(a*r)}" fill="#d9d4c5" stroke="#a9a493" stroke-width="${f(Math.max(.5,r*.012))}"/>`;});
  t+=`</g><circle class="mwdk" cx="${cx}" cy="${cy}" r="${f(r+.4)}" fill="#060a1a" opacity="${o.dark||.9}" mask="url(#${u}k)"/>`;
  if(o.extra)t+=o.extra;
  return t+'</g>';
}
const mwIcon=(th,s,rot)=>svgEl(`<svg viewBox="0 0 40 40" width="${s||38}" height="${s||38}" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#0e1736"/>${mwMoonG(th,20,20,15.5,{rot})}</svg>`);
/* tiny seeded stars so every screen looks the same */
function mwStars(n,w,hh,seed,o){
  o=o||{};let s=seed||7,t='';const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<n;i++){const x=rnd()*w,y=rnd()*(o.maxY||hh),r=rnd()<.12?1.6:rnd()*.9+.4,a=(.35+rnd()*.6).toFixed(2);
    t+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${a}"${rnd()<.18?` class="mwtw" style="animation-delay:-${(rnd()*4).toFixed(1)}s"`:''}/>`;}
  return t;
}

/* ---------------- levels ---------------- */
const MR={make:(th,o)=>Object.assign({t:'make',th},o||{}),time:(from,days,th)=>({t:'time',from,days,th,cover:true}),ecl:k=>({t:'ecl',k,th:k==='solar'?0:180}),
  mc:(q,opts,ans,why,o)=>Object.assign({t:'mc',q,opts,ans,why},o||{}),season:(q,ans,why,hemi)=>({t:'season',q,ans:[].concat(ans),why,hemi:hemi||'N'}),tilt:()=>({t:'tilt'}),node:()=>({t:'node'})};
const MWL=(name,story,rounds,o)=>Object.assign({name,story,rounds,board:'orbit'},o);
const MW_LEVELS=[
  MWL('Four Key Phases','Sunlight always lights up half of the Moon. How much of that lit half can we see from Earth?',[MR.make(180),MR.make(0),MR.make(90),MR.make(270),
      MR.mc('Why do we only see part of the Moon on some nights?',[['part','Half the Moon is always lit, but only part of that lit half faces Earth.'],['shadow','Earth’s shadow covers part of the Moon.'],['cloud','Clouds in space block part of the Moon.']],'part','The Sun always lights half of the Moon. As the Moon goes around Earth, we see more or less of that lit half. Earth’s shadow only touches the Moon during a lunar eclipse.',{pic:135})],{
    live:'name',
    intro:'Sunlight comes from the **right**. **Drag the Moon** around its orbit and watch the view from Earth. The glowing blue edge shows the half of the Moon that faces Earth.',
    fact:'The Moon makes no light of its own. Half of it is always lit by the Sun. The phases are how much of that lit half we can see from Earth.',
    clue:'Picture yourself standing on Earth and looking at the Moon. Is the Moon’s lit side facing you, facing away, or half and half?'}),
  MWL('In Between','Between the key phases are crescents and gibbous moons.',[MR.make(135),MR.make(45),MR.make(315,{cover:true}),MR.make(225,{cover:true})],{
    intro:'**Waxing** means growing (more lit each night). **Waning** means shrinking. A **crescent** is less than half lit. **Gibbous** is more than half lit.',
    fact:'From New York, a waxing moon is lit on the right side and a waning moon is lit on the left side.',
    clue:'Is the Moon on its way from new moon to full (waxing) or from full back to new (waning)? The Moon moves counterclockwise.'}),
  MWL('Place the Moon','Now add time. The Moon takes about 29.5 days to go all the way around.',[MR.time(180,7,270),MR.time(0,7,90),MR.time(90,15,270),
      MR.mc('A full moon turned into a third quarter moon in one week. Why?',[['orbit','The Moon moved a quarter of the way around Earth, so less of its lit half faces us.'],['shadow','Earth’s shadow moved over half of the Moon.'],['sun','The Sun lit up less of the Moon that week.']],'orbit','In one week the Moon travels about a quarter of its orbit. The Sun still lights half of it, but now only half of that lit half faces Earth.',{pic:270})],{
    fact:'It takes about 29.5 days for the Moon to go through all its phases. That is where the idea of a "month" comes from.',
    clue:'One week is about a quarter of the Moon’s trip (29.5 days for the whole orbit). The Moon moves counterclockwise.'}),
  MWL('Moon Clock','The Moon’s position also tells you WHEN it is in the sky, and WHERE you stand changes how it looks.',[
      MR.mc('A full moon rises in the east at about what time?',[['sunset','Sunset (about 6 pm)'],['noon','Noon'],['sunrise','Sunrise (about 6 am)']],'sunset','A full moon is opposite the Sun, so it rises as the Sun sets and is up all night.',{pic:180}),
      MR.make(45,{aus:true}),
      MR.mc('From Australia, which side of a waxing crescent is lit?',[['left','The left side'],['right','The right side'],['bottom','Only the bottom']],'left','People in Australia see the Moon “upside down” compared with New York, so a waxing crescent is lit on the left there. It is still the same phase.',{pic:45,aus:true}),
      MR.make(90,{cover:true}),
      MR.mc('Why do we always see the same side of the Moon?',[['spin','The Moon spins once in the same time it takes to orbit Earth.'],['nospin','The Moon does not spin at all.'],['dark','The other side is always in darkness.']],'spin','The Moon rotates once for every orbit, so the same side always faces Earth. The “far side” still gets sunlight!')],{
    fact:'The far side of the Moon is not dark. It gets just as much sunlight as the near side; we just never see it from Earth.',
    clue:'Full moon means the Moon is on the opposite side of Earth from the Sun.'}),
  MWL('Eclipse Maker','Sometimes the Sun, Earth and Moon line up exactly.',[MR.ecl('solar'),MR.ecl('lunar'),
      MR.mc('A lunar eclipse can only happen during which phase?',[['full','Full moon'],['new','New moon'],['quarter','First quarter']],'full','In a lunar eclipse, Earth is between the Sun and Moon, which is the full moon position.',{pic:180}),
      MR.mc('In a solar eclipse, what blocks the sunlight?',[['moon','The Moon blocks the Sun from part of Earth.'],['earth','Earth’s shadow covers the Sun.'],['cloud','Clouds cover the Sun.']],'moon','In a solar eclipse, the Moon passes between the Sun and Earth, and its shadow falls on Earth.',{pic:0})],{
    fact:'A total solar eclipse crossed New York State on April 8, 2024. The next one visible from New York will not happen until 2079.',
    clue:'Solar eclipse: the Moon blocks the Sun. Lunar eclipse: Earth’s shadow falls on the Moon.'}),
  MWL('Not Every Month','There is a new moon every month. So why are solar eclipses rare?',[MR.tilt(),MR.node(),
      MR.mc('Why is there not a solar eclipse at every new moon?',[['tilt','The Moon’s orbit is tilted, so it usually passes above or below the Sun.'],['far','The Moon is too far away most months.'],['small','The Moon is too small to block the Sun.']],'tilt','The Moon’s orbit is tilted about 5 degrees, so at most new moons its shadow misses Earth.')],{
    board:'node',
    intro:'Left: Earth going around the Sun, seen from above. Right: a **side view** of the new moon. The yellow dashed line points straight from Earth to the Sun.',
    fact:'The Moon’s orbit is tilted about 5° from Earth’s orbit. Eclipses only happen when a new or full moon lines up with the place where the two orbits cross.',
    clue:'For an eclipse, the Moon must sit right ON the line between Earth and the Sun.'}),
  MWL('Summer in New York','Earth’s axis is tilted, and it always points the same way in space.',[MR.season('Drag Earth to where it is when New York has summer.','jun','In June, the Northern Hemisphere tilts toward the Sun. Sunlight hits it more directly and days are longer.','N'),
      MR.mc('Why is it warmer in summer?',[['tilt','Our half of Earth is tilted toward the Sun: more direct light and longer days.'],['close','Earth is closer to the Sun in summer.'],['spin','Earth spins faster in summer.']],'tilt','Seasons are caused by the tilt, not distance. Direct sunlight is more concentrated, and longer days give more hours of heating.')],{
    board:'season',
    intro:'Left: Earth going around the Sun. The white line is Earth’s **axis**, and **N** is the North Pole. Right: Earth up close, with sunlight coming from the right.',
    fact:'Earth’s axis is tilted about 23.5°. As Earth orbits the Sun, first the Northern and then the Southern Hemisphere leans toward the Sun.',
    clue:'Find the spot where the North Pole leans TOWARD the Sun.'}),
  MWL('Down Under','Australia is in the Southern Hemisphere.',[MR.season('Drag Earth to where it is when Australia has summer.','dec','In December, the Southern Hemisphere tilts toward the Sun, so it is summer in Australia and winter in New York.','S'),
      MR.mc('When New York has winter, what season does Australia have?',[['summer','Summer'],['winter','Winter too'],['spring','Spring']],'summer','The hemispheres have opposite seasons, because when one tilts toward the Sun the other tilts away.'),
      MR.season('Drag Earth to a spot where both hemispheres get about EQUAL sunlight (spring or fall).',['mar','sep'],'In March and September, neither pole leans toward the Sun. Day and night are about equal everywhere.','E')],{
    board:'season',
    fact:'In Australia, people often have Christmas at the beach because December is summer there.',
    clue:'Australia is in the bottom half of Earth. Find where the SOUTH Pole leans toward the Sun.'}),
  MWL('Closest in January','Earth’s orbit is almost a circle, but not quite.',[
      MR.mc('Earth is closest to the Sun in early January. What season is it in New York then?',[['winter','Winter'],['summer','Summer'],['spring','Spring']],'winter','It is winter in New York in January, even though Earth is closest to the Sun. Distance is not what causes seasons.',{pic:180}),
      MR.mc('So what really causes the seasons?',[['tilt','The tilt of Earth’s axis as Earth orbits the Sun'],['dist','How close Earth is to the Sun'],['moon','The phases of the Moon']],'tilt','Earth’s tilt changes how directly sunlight hits each hemisphere and how long the days are.',{pic:180}),
      MR.season('Drag Earth to where it is when New York has winter.','dec','In December, the Northern Hemisphere tilts away from the Sun. Light is spread out and days are short.','W'),
      MR.make(315,{cover:true})],{
    board:'season',
    fact:'The difference in Earth’s distance from the Sun is only about 3%. That is far too small to cause the seasons.',
    clue:'If distance caused seasons, both hemispheres would have summer at the same time. Do they?'})
];
const MW_PACKS={0:'Pack 1: Moon phases',3:'Pack 2: Eclipses and timing',6:'Pack 3: Seasons'};
const MW_SK={0:'jun',90:'sep',180:'dec',270:'mar'},MW_SA={jun:0,sep:90,dec:180,mar:270};
const MW_SMON={jun:'June',sep:'September',dec:'December',mar:'March'};
const MW_MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MW_WK=d=>d===7?'1 week':d===15?'about 2 weeks':d+' days';

/* which board a round uses */
function mwKind(L,R){if(!R)return L.board;if(R.t==='make'||R.t==='time'||R.t==='ecl')return 'orbit';if(R.t==='season')return 'season';if(R.t==='tilt'||R.t==='node')return 'node';
  if(R.pic!=null&&L.board==='orbit')return 'orbit';if(R.pic!=null&&L.board==='season')return 'season';return L.board;}
const mwDrag=R=>!!R&&R.t!=='mc';
const mwCover=R=>!!R&&(ngT()?R.t!=='mc'&&R.t!=='tilt'&&R.t!=='node':!!R.cover);

/* ---------------- geometry ---------------- */
const MW_W=470,MW_H=440,MW_VW=320;
const MO={x:228,y:220,r:148};                 /* Moon orbit (top view) */
const MS={x:235,y:222,rx:172,ry:84};          /* Earth orbit (seasons, tilted view) */
const MN={x:226,y:222,r:160};                 /* Earth orbit (eclipse seasons, top view) */
const mwMoonXY=a=>[MO.x+MO.r*Math.cos(a*MW_RAD),MO.y-MO.r*Math.sin(a*MW_RAD)];
const mwSeasXY=s=>[MS.x-MS.rx*Math.cos(s*MW_RAD),MS.y+MS.ry*Math.sin(s*MW_RAD)];
const mwMonA=m=>-90+m*30;                     /* month angle (0 = January, at the bottom) */
const mwNodeXY=a=>[MN.x+MN.r*Math.cos(a*MW_RAD),MN.y-MN.r*Math.sin(a*MW_RAD)];
const mwDecl=s=>23.44*Math.cos(s*MW_RAD);
function mwDay(lat,dec){const x=-Math.tan(lat*MW_RAD)*Math.tan(dec*MW_RAD);return 24/Math.PI*Math.acos(Math.max(-1,Math.min(1,x)));}

/* ---------------- shared art ---------------- */
function mwSunGlow(x,y,r,u){
  return `<defs><radialGradient id="${u}s"><stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffe17a"/><stop offset=".7" stop-color="#ffb83d"/><stop offset="1" stop-color="#ff9a1f"/></radialGradient>
<radialGradient id="${u}h"><stop offset="0" stop-color="#ffd76a" stop-opacity=".55"/><stop offset=".55" stop-color="#ffb13d" stop-opacity=".16"/><stop offset="1" stop-color="#ff9a1f" stop-opacity="0"/></radialGradient></defs>
<circle cx="${x}" cy="${y}" r="${r*2.6}" fill="url(#${u}h)" class="mwsunh"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}s)"/>`;
}
/* Earth seen from above the North Pole: ice cap, continents, night side away from the Sun (right) */
function mwEarthTop(x,y,r,u){
  const f=n=>(+n).toFixed(1);
  const land=[[ 'M-.18 -.62C.1 -.8 .5 -.6 .62 -.3C.7 -.1 .5 .02 .36 -.08C.2 -.2 .02 -.3 -.2 -.4Z'],['M.1 .36C.3 .3 .62 .32 .72 .52C.6 .74 .3 .8 .14 .66C.04 .56 .02 .44 .1 .36Z'],['M-.72 -.1C-.6 -.34 -.36 -.3 -.3 -.08C-.24 .18 -.42 .5 -.62 .5C-.82 .4 -.82 .1 -.72 -.1Z'],['M-.2 .62C-.08 .58 0 .72 -.12 .86C-.26 .84 -.3 .7 -.2 .62Z']];
  let t=`<defs><radialGradient id="${u}o" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#4fb3ff"/><stop offset=".7" stop-color="#1f6fd1"/><stop offset="1" stop-color="#123f8a"/></radialGradient>
<linearGradient id="${u}n" x1="1" y1="0" x2="0" y2="0"><stop offset=".4" stop-color="#030716" stop-opacity="0"/><stop offset=".58" stop-color="#030716" stop-opacity=".74"/><stop offset="1" stop-color="#030716" stop-opacity=".82"/></linearGradient>
<linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fcf6b"/><stop offset="1" stop-color="#3f9a4a"/></linearGradient><clipPath id="${u}c"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs>
<circle cx="${x}" cy="${y}" r="${f(r+5)}" fill="#7fd3ff" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}o)"/>
<g clip-path="url(#${u}c)"><g class="mwspin" style="transform-origin:${x}px ${y}px"><g transform="translate(${x} ${y}) scale(${r})">${land.map(p=>`<path d="${p}" fill="url(#${u}l)"/>`).join('')}<circle r=".24" fill="#eef6ff" opacity=".92"/><circle r=".3" fill="#eef6ff" opacity=".35"/></g></g>
<rect x="${f(x-r)}" y="${f(y-r)}" width="${f(r*2)}" height="${f(r*2)}" fill="url(#${u}n)"/></g>
<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#bfe6ff" stroke-opacity=".55" stroke-width="1.5"/>`;
  return t;
}
/* a small Earth in the seasons model: lit toward the Sun, tilted axis always leaning the same way */
function mwEarthSmall(r,u,noAxis){
  return `<defs><radialGradient id="${u}o" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#5cc0ff"/><stop offset="1" stop-color="#1550a8"/></radialGradient></defs>
<circle r="${r+4}" fill="#7fd3ff" opacity=".2"/><circle r="${r}" fill="url(#${u}o)"/>
<path d="M${-r*.6} ${-r*.55}C${-r*.1} ${-r*.9} ${r*.4} ${-r*.6} ${r*.3} ${-r*.2}C${r*.1} ${r*.05} ${-r*.3} ${-r*.05} ${-r*.6} ${-r*.55}Z" fill="#5fbf62"/><path d="M${-r*.1} ${r*.2}C${r*.2} ${r*.15} ${r*.3} ${r*.5} ${r*.05} ${r*.85}C${-r*.15} ${r*.6} ${-r*.25} ${r*.35} ${-r*.1} ${r*.2}Z" fill="#5fbf62"/>
<path class="mwens" d="M0 ${-r}A${r} ${r} 0 0 0 0 ${r}Z" fill="#030716" opacity=".66"/>
`+(noAxis?'':`<g transform="rotate(23.44)"><line x1="0" y1="${-r-14}" x2="0" y2="${r+12}" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cy="${-r-14}" r="2.6" fill="#fff"/>
<text y="${-r-19}" text-anchor="middle" class="mwtxt" font-size="13" fill="#fff">N</text></g>`);
}
function mwHorizon(aus){
  let t=`<path d="M0 360C40 344 80 350 120 340C170 328 220 346 260 338C290 332 310 336 320 334V440H0Z" fill="#0d1838"/>`;
  t+=`<path d="M0 384C60 370 110 380 170 372C230 364 280 376 320 368V440H0Z" fill="#070f26"/>`;
  if(!aus){[[28,372,1],[48,376,.8],[262,366,1.1],[286,370,.85],[302,368,.7]].forEach(([x,y,s])=>{t+=`<path d="M${x} ${y-44*s}l${-13*s} ${24*s}h${6*s}l${-10*s} ${16*s}h${8*s}l${-9*s} ${12*s}h${36*s}l${-9*s} ${-12*s}h${8*s}l${-10*s} ${-16*s}h${6*s}z" fill="#050b1d"/>`;});
    t+=`<path d="M190 380v-22l18-14 18 14v22z" fill="#050b1d"/><rect x="200" y="364" width="8" height="8" fill="#ffd36b" opacity=".85"/>`;}
  else{t+=`<path d="M52 384c2-20-2-34-6-46-8-4-20-2-26-10 8-6 20-2 26 2-2-8-10-14-8-22 8 2 12 12 14 20 4-8 14-14 22-12-2 8-12 12-18 16 10-2 22 2 26 10-10 4-22-2-30-4 2 14 6 30 4 46z" fill="#050b1d"/>`;
    t+=`<g transform="translate(236 382)" fill="#050b1d"><path d="M0 0c-4-10-2-22 8-30 4-4 6-10 4-16 4 0 8 4 8 8 6-2 10 0 10 4-4 2-8 2-10 6-2 10-6 18-12 22l14 6h-8l-10-4-2 4z"/><path d="M-2 -6c-10 4-26 6-38 2 12-2 24-6 34-10z"/></g>`;}
  return t;
}
function mwClouds(){
  const puff=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 18C-92 18-96-8-74-12C-76-34-46-42-34-26C-26-50 12-54 22-30C34-46 66-38 62-14C86-14 90 18 66 18Z" fill="${c}"/><path d="M-70 18C-92 18-96 2-82-4C-60 6 40 6 80 0C88 10 80 18 66 18Z" fill="#000" opacity=".08"/></g>`;
  return `<g class="mwclouds"><rect x="0" y="0" width="${MW_VW}" height="${MW_H}" fill="#3a4a78" opacity=".93"/>${puff(90,120,1.25,'#c9d3ea')}${puff(230,96,1.05,'#dbe3f3')}${puff(170,206,1.5,'#eef2fa')}${puff(70,286,1.15,'#d6deef')}${puff(250,300,1.25,'#e4e9f5')}${puff(110,380,1.4,'#cdd6ec')}${puff(260,400,1.2,'#dfe5f3')}
<g transform="translate(160 214)"><rect x="-118" y="-30" width="236" height="60" rx="16" fill="#13203d" opacity=".9"/><text y="-6" text-anchor="middle" class="mwtxt" font-size="15" fill="#fff">Cloudy! You can’t see it yet.</text><text y="16" text-anchor="middle" class="mwtxt mwthin" font-size="12.5" fill="#cfd8ff">Place it, then lock it in to look.</text></g></g>`;
}
const mwPill=(x,y,txt,o)=>{o=o||{};const w=o.w||txt.length*7.4+26;return `<g transform="translate(${x} ${y})"${o.cls?` class="${o.cls}"`:''}><rect x="${-w/2}" y="-13" width="${w}" height="26" rx="13" fill="${o.bg||'#13203d'}" opacity="${o.op||.88}"/><text y="5" text-anchor="middle" class="mwtxt${o.tcls?' '+o.tcls:''}" font-size="${o.fs||13}" fill="${o.fg||'#fff'}">${ngEsc(txt)}</text></g>`;};

/* ---------------- board: ORBIT (phases, time, eclipses) ---------------- */
function mwOrbitModel(G,R){
  const u=mwUid(),L=G.L;let t=`<defs><radialGradient id="${u}b" cx=".75" cy=".5" r=".9"><stop offset="0" stop-color="#1b2a5e"/><stop offset="1" stop-color="#070d24"/></radialGradient>
<linearGradient id="${u}e" x1="1" x2="0"><stop offset="0" stop-color="#03050f" stop-opacity=".8"/><stop offset="1" stop-color="#03050f" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}m" x1="1" x2="0"><stop offset="0" stop-color="#03050f" stop-opacity=".85"/><stop offset="1" stop-color="#03050f" stop-opacity="0"/></linearGradient></defs>`;
  t+=`<rect width="${MW_W}" height="${MW_H}" fill="url(#${u}b)"/>${mwStars(70,MW_W,MW_H,11)}`;
  t+=mwSunGlow(MW_W+40,MO.y,92,u);
  t+=`<defs><linearGradient id="${u}y" gradientUnits="userSpaceOnUse" x1="${MW_W}" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffd76a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></linearGradient></defs><g class="mwrays">${[0,1,2,3,4].map(i=>{const y=58+i*81;return `<line x1="${MW_W}" y1="${y}" x2="0" y2="${y}" stroke="url(#${u}y)" stroke-width="2.5" stroke-dasharray="46 34" stroke-linecap="round" style="animation-delay:-${i*.5}s"/>`;}).join('')}</g>`;
  t+=`<g transform="translate(${MW_W-14} 24)"><text text-anchor="end" class="mwtxt" font-size="14" fill="#ffd76a">Sunlight ←</text></g>`;
  if(R&&R.t==='ecl')t+=`<path d="M${MO.x} ${MO.y-34}L${MO.x-226} ${MO.y-10}L${MO.x-226} ${MO.y+10}L${MO.x} ${MO.y+34}Z" fill="url(#${u}e)"/><text x="40" y="${MO.y-22}" class="mwtxt" font-size="11.5" fill="#8d97c5">Earth’s shadow</text>`;
  t+=`<circle cx="${MO.x}" cy="${MO.y}" r="${MO.r}" fill="none" stroke="#6d7fc4" stroke-opacity=".55" stroke-width="2" stroke-dasharray="5 7"/>`;
  [60,240].forEach(a=>{const [x,y]=mwMoonXY(a),d=a+90;t+=`<path d="M-5 -6L4 0L-5 6" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${-d})" fill="none" stroke="#a9b6f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;});
  t+=mwEarthTop(MO.x,MO.y,34,u)+`<text x="${MO.x}" y="${MO.y+52}" text-anchor="middle" class="mwtxt" font-size="12.5" fill="#cfe2ff">Earth</text>`;
  t+=`<g class="mwghost" opacity="0"><circle r="24" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="5 5"/></g>`;
  t+=`<g class="mwtrail"></g><g class="mwstart"></g>`;
  /* the draggable Moon */
  const shadow=R&&R.t==='ecl'?`<path class="mwmsh" d="M0 -15L-150 -2L-150 2L0 15Z" fill="url(#${u}m)"/>`:'';
  t+=`<g class="mwmoon${mwDrag(R)?' mwgrab':''}"${mwDrag(R)?` tabindex="0" role="slider" aria-label="The Moon. Drag it around its orbit, or use the arrow keys." aria-valuemin="0" aria-valuemax="359"`:''}>${shadow}
<circle r="34" fill="#fff" opacity="0"/>${L.live==='name'||L===MW_LEVELS[0]||L===MW_LEVELS[1]?`<path class="mwface" d="" fill="none" stroke="#59d6ff" stroke-width="3.5" stroke-linecap="round" opacity=".95"/>`:''}
<g class="mwbody">${mwMoonG(90,0,0,17,{dark:.82})}</g><circle class="mwfoc" r="23" fill="none" stroke="transparent" stroke-width="3"/></g>`;
  t+=`<g class="mwdays"></g>`;
  return ngSvg(MW_W,MW_H,t,'mwm','Top view: sunlight from the right, Earth in the middle and the Moon’s orbit');
}
function mwOrbitView(G,R){
  const u=mwUid(),aus=!!(R&&R.aus),solar=R&&R.t==='ecl'&&R.k==='solar',lunar=R&&R.t==='ecl'&&R.k==='lunar';
  let t=`<defs><linearGradient id="${u}n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050b24"/><stop offset=".7" stop-color="#16285e"/><stop offset="1" stop-color="#2b3f7c"/></linearGradient>
<linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b8be0"/><stop offset=".8" stop-color="#8fd0ff"/><stop offset="1" stop-color="#cdeaff"/></linearGradient>
<radialGradient id="${u}r"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".45" stop-color="#e8f0ff" stop-opacity=".55"/><stop offset="1" stop-color="#9fb8ff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}u"><stop offset="0" stop-color="#2a0c06" stop-opacity=".9"/><stop offset=".72" stop-color="#3a1208" stop-opacity=".82"/><stop offset=".86" stop-color="#1a0a06" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<clipPath id="${u}c"><circle cx="160" cy="170" r="74"/></clipPath></defs>`;
  t+=`<rect width="${MW_VW}" height="${MW_H}" fill="url(#${u}${solar?'d':'n'})"/>`;
  if(solar)t+=`<rect class="mwnight" width="${MW_VW}" height="${MW_H}" fill="#050b24" opacity="0"/>`;
  t+=`<g class="mwstars"${solar?' opacity="0"':''}>${mwStars(80,MW_VW,330,5)}</g>`;
  if(solar){
    t+=`<circle class="mwcorona" cx="160" cy="170" r="120" fill="url(#${u}r)" opacity="0"/>`+mwSunGlow(160,170,58,u)+
      `<g class="mwsolm"><circle cx="160" cy="170" r="60" fill="#151a2e"/><circle cx="160" cy="170" r="60" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/></g>`;
  } else {
    t+=`<g class="mwbig">${mwMoonG(R&&R.th!=null?R.th:180,160,170,74,{rot:aus?180:0,glow:.18,dark:.9})}</g>`;
    if(lunar)t+=`<g clip-path="url(#${u}c)"><circle class="mwred" cx="160" cy="170" r="74" fill="#b8432a" opacity="0" style="mix-blend-mode:multiply"/><circle class="mwumb" cx="160" cy="170" r="190" fill="url(#${u}u)"/></g>`;
  }
  t+=mwHorizon(aus);
  t+=mwPill(160,24,aus?'View from Australia':solar?'Looking at the Sun (eclipse glasses on!)':'View from New York',{bg:'#0b1430',w:aus?170:solar?256:170});
  t+=`<g class="mwname"></g><g class="mwseen"><rect x="40" y="398" width="240" height="30" rx="15" fill="#0b1430" opacity=".82"/><text class="mwseent mwtxt" x="160" y="418" text-anchor="middle" font-size="12.5" fill="#fff"></text></g>`;
  t+=mwClouds();
  return ngSvg(MW_VW,MW_H,t,'mwv','The view from Earth');
}
/* the half of the Moon that faces Earth (blue edge), drawn around the Moon at angle a */
function mwFace(a){const r=22,c=a+180,p0=(c-90)*MW_RAD,p1=(c+90)*MW_RAD;
  return `M${(r*Math.cos(p0)).toFixed(2)} ${(-r*Math.sin(p0)).toFixed(2)}A${r} ${r} 0 0 0 ${(r*Math.cos(p1)).toFixed(2)} ${(-r*Math.sin(p1)).toFixed(2)}`;}
function mwArc(a0,a1,rr){/* counterclockwise arc on the orbit from a0 to a1 */
  const s=mwMoonXY(a0),d=mwN(a1-a0),e=[MO.x+rr*Math.cos(a1*MW_RAD),MO.y-rr*Math.sin(a1*MW_RAD)],s2=[MO.x+rr*Math.cos(a0*MW_RAD),MO.y-rr*Math.sin(a0*MW_RAD)];
  return `M${s2[0].toFixed(1)} ${s2[1].toFixed(1)}A${rr} ${rr} 0 ${d>180?1:0} 0 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;}
function mwSyncOrbit(G){
  const S=G.st,E=S.el,R=G.L.rounds[S.r],L=G.L,a=S.ang,[x,y]=mwMoonXY(a);
  const mg=E.m.querySelector('.mwmoon');mg.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  mg.setAttribute('aria-valuenow',Math.round(mwN(a)));mg.setAttribute('aria-valuetext',S.reveal||!mwCover(R)?`${MW_NAMES[mwSnap(a)]} position`:`Moon position ${Math.round(mwN(a))} degrees`);
  const fc=E.m.querySelector('.mwface');if(fc)fc.setAttribute('d',mwFace(a));
  const sh=E.m.querySelector('.mwmsh');if(sh){sh.setAttribute('opacity',Math.max(0,1-Math.abs(mwDiff(a,0))/50).toFixed(2));}
  const gh=E.m.querySelector('.mwghost');if(gh){const on=S.ghost&&R&&R.th!=null&&R.t!=='mc';gh.setAttribute('opacity',on?1:0);if(on){const [gx,gy]=mwMoonXY(R.th);gh.setAttribute('transform',`translate(${gx} ${gy})`);}}
  const st=E.m.querySelector('.mwstart');
  if(R&&R.t==='time'){const [sx,sy]=mwMoonXY(R.from);st.innerHTML=`<g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})" opacity=".85">${mwMoonG(90,0,0,13,{dark:.82})}<circle r="18" fill="none" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="4 4"/></g>`+
    `<g transform="translate(${(sx+(sx>MO.x?-4:4)).toFixed(1)} ${(sy+(R.from===90?-30:R.from===270?32:-28)).toFixed(1)})">${mwPill(0,0,'Today',{bg:'#ffd23f',fg:'#13203d',w:58,fs:12})}</g>`;}
  else st.innerHTML='';
  const tr=E.m.querySelector('.mwtrail'),dy=E.m.querySelector('.mwdays');
  if(R&&R.t==='time'&&(S.reveal||S.okNow)&&mwN(a-R.from)>1){const d=mwN(a-R.from),days=Math.round(d/360*29.5);
    tr.innerHTML=`<path d="${mwArc(R.from,a,MO.r+26)}" fill="none" stroke="#ffd23f" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 9"/>`;
    const mid=R.from+d/2,mx=MO.x+(MO.r+52)*Math.cos(mid*MW_RAD),my=MO.y-(MO.r+52)*Math.sin(mid*MW_RAD);
    dy.innerHTML=mwPill(Math.max(60,Math.min(MW_W-60,mx)),Math.max(20,Math.min(MW_H-20,my)),`+${days} days`,{bg:'#ffd23f',fg:'#13203d',w:96});}
  else{tr.innerHTML='';dy.innerHTML='';}
  /* the view from Earth */
  const V=E.v,cov=mwCover(R)&&!S.reveal;
  const cl=V.querySelector('.mwclouds');cl.classList.toggle('gone',!cov);
  const lit=V.querySelector('.mwbig .mwlit');if(lit)lit.setAttribute('d',mwLit(a,160,170,74));
  const glow=V.querySelector('.mwmglow');if(glow)glow.setAttribute('opacity',(.04+.22*mwSeen(a)).toFixed(2));
  if(R&&R.t==='ecl'&&R.k==='solar'){const d=mwDiff(a,0),dx=Math.max(-200,Math.min(200,-d*3.2)),k=Math.max(0,1-Math.abs(d)/22),tot=Math.abs(d)<.6;
    V.querySelector('.mwsolm').setAttribute('transform',`translate(${dx.toFixed(1)} ${(Math.abs(d)*.4).toFixed(1)})`);
    V.querySelector('.mwnight').setAttribute('opacity',(tot?.9:k*.45).toFixed(2));V.querySelector('.mwstars').setAttribute('opacity',tot?1:0);
    V.querySelector('.mwcorona').setAttribute('opacity',tot?1:0);}
  if(R&&R.t==='ecl'&&R.k==='lunar'){const d=mwDiff(a,180),dx=-d*5.5,tot=Math.abs(d)<.6;
    V.querySelector('.mwumb').setAttribute('transform',`translate(${dx.toFixed(1)} ${(Math.abs(d)*1.2).toFixed(1)})`);
    V.querySelector('.mwred').setAttribute('opacity',tot?.85:Math.max(0,.5-Math.abs(d)/30).toFixed(2));}
  const nm=V.querySelector('.mwname'),sn=a,snap=mwSnap(sn),showName=!cov&&(L.live==='name'||S.reveal||S.okNow)&&Math.abs(mwDiff(sn,snap))<3&&!(R&&R.t==='ecl');
  nm.innerHTML=showName?mwPill(160,280,MW_NAMES[snap],{bg:'#ffd23f',fg:'#13203d',fs:15,w:MW_NAMES[snap].length*8.6+30}):'';
  const se=V.querySelector('.mwseen');se.style.display=cov||(R&&R.t==='ecl'&&R.k==='solar')?'none':'';
  V.querySelector('.mwseent').textContent=`We can see ${Math.round(mwSeen(a)*100)}% of the Moon’s lit half`;
}

/* ---------------- board: SEASONS ---------------- */
function mwSeasModel(G,R){
  const u=mwUid();let t=`<defs><radialGradient id="${u}b" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#1a2758"/><stop offset="1" stop-color="#070d24"/></radialGradient></defs>`;
  t+=`<rect width="${MW_W}" height="${MW_H}" fill="url(#${u}b)"/>${mwStars(70,MW_W,MW_H,23)}`;
  t+=`<ellipse cx="${MS.x}" cy="${MS.y}" rx="${MS.rx}" ry="${MS.ry}" fill="none" stroke="#6d7fc4" stroke-opacity=".6" stroke-width="2" stroke-dasharray="5 7"/>`;
  t+=`<path d="M-5 -6L4 0L-5 6" transform="translate(${MS.x-30} ${MS.y+MS.ry})" fill="none" stroke="#a9b6f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M-5 -6L4 0L-5 6" transform="translate(${MS.x+30} ${MS.y-MS.ry}) rotate(180)" fill="none" stroke="#a9b6f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  t+=`<g class="mwsback"></g>`+mwSunGlow(MS.x,MS.y,40,u)+`<text x="${MS.x}" y="${MS.y+5}" text-anchor="middle" class="mwtxt" font-size="13" fill="#7a4a00">SUN</text>`;
  t+=`<g class="mwsmon"></g><g class="mwghost" opacity="0"><circle r="34" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="5 5"/></g>`;
  t+=`<g class="mwearth mwgrab" tabindex="0" role="slider" aria-label="Earth. Drag it around the Sun, or use the arrow keys." aria-valuemin="0" aria-valuemax="359"><circle r="40" fill="#fff" opacity="0"/><g class="mwesm">${mwEarthSmall(21,u)}</g><circle class="mwfoc" r="30" fill="none" stroke="transparent" stroke-width="3"/></g>`;
  t+=`<text x="14" y="24" class="mwtxt" font-size="13" fill="#8d97c5">Earth’s orbit (seen at an angle)</text>`;
  return ngSvg(MW_W,MW_H,t,'mwm','Earth going around the Sun, with its tilted axis');
}
function mwSeasView(G,R){
  const u=mwUid(),cx=150,cy=176,E=104;
  let t=`<defs><radialGradient id="${u}b" cx="1" cy=".4" r="1.1"><stop offset="0" stop-color="#2b2f5e"/><stop offset="1" stop-color="#070d24"/></radialGradient>
<radialGradient id="${u}o" cx=".55" cy=".4" r=".75"><stop offset="0" stop-color="#5cc0ff"/><stop offset=".75" stop-color="#1f6fd1"/><stop offset="1" stop-color="#103a80"/></radialGradient>
<linearGradient id="${u}n" x1="1" x2="0"><stop offset=".46" stop-color="#030716" stop-opacity="0"/><stop offset=".54" stop-color="#030716" stop-opacity=".7"/><stop offset="1" stop-color="#030716" stop-opacity=".8"/></linearGradient>
<linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd27a"/><stop offset=".6" stop-color="#4fa652"/><stop offset="1" stop-color="#c9a86a"/></linearGradient>
<clipPath id="${u}c"><circle cx="${cx}" cy="${cy}" r="${E}"/></clipPath></defs>`;
  t+=`<rect width="${MW_VW}" height="${MW_H}" fill="url(#${u}b)"/>${mwStars(50,MW_VW,MW_H,31)}`;
  t+=`<g class="mwrays">${[0,1,2,3,4].map(i=>`<line x1="${MW_VW}" y1="${cy-80+i*40}" x2="${cx+E+8}" y2="${cy-80+i*40}" stroke="#ffd76a" stroke-width="2.5" stroke-dasharray="4 14" opacity=".55"/>`).join('')}</g>`;
  t+=`<path d="M${MW_VW-6} ${cy}H${cx+E+10}" stroke="#ffe17a" stroke-width="5" stroke-linecap="round"/><path d="M${cx+E+10} ${cy}l12-7v14z" fill="#ffe17a"/>`;
  t+=`<circle cx="${cx}" cy="${cy}" r="${E+7}" fill="#7fd3ff" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="${E}" fill="url(#${u}o)"/>`;
  /* rotating frame: continents, latitude lines, places */
  const la=(lat)=>{const y=-Math.sin(lat*MW_RAD)*E,w=Math.cos(lat*MW_RAD)*E;return [y,w];};
  const [yNY,wNY]=la(43),[ySY,wSY]=la(-34);
  t+=`<g clip-path="url(#${u}c)"><g class="mwtilt" style="transform-origin:${cx}px ${cy}px"><g transform="translate(${cx} ${cy}) scale(${E})">
<path d="M-.5 -.66C-.28 -.86 .16 -.86 .34 -.7C.44 -.6 .3 -.5 .26 -.4C.2 -.28 .1 -.18 .02 -.1L-.06 -.02C-.16 -.08 -.3 -.18 -.4 -.32C-.5 -.44 -.62 -.52 -.5 -.66Z" fill="url(#${u}l)"/>
<path d="M-.04 .04C.08 0 .24 .06 .32 .16C.4 .3 .26 .46 .16 .62C.08 .76 .02 .84 -.02 .86C-.06 .68 -.14 .46 -.16 .3C-.18 .18 -.14 .08 -.04 .04Z" fill="url(#${u}l)"/>
<path d="M.26 -.88C.4 -.92 .48 -.8 .4 -.7C.3 -.68 .2 -.76 .26 -.88Z" fill="#eef6ff"/><path d="M.7 -.5C.82 -.5 .92 -.32 .96 -.12C.98 .1 .9 .3 .82 .28C.74 .14 .66 0 .66 -.2Z" fill="url(#${u}l)"/>
<ellipse cx="0" cy="-.97" rx=".5" ry=".1" fill="#eef6ff"/><ellipse cx="0" cy=".97" rx=".55" ry=".1" fill="#f4f8ff"/></g>
<line x1="${cx-E}" y1="${cy}" x2="${cx+E}" y2="${cy}" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>
<line class="mwlatn" x1="${cx-wNY}" y1="${cy+yNY}" x2="${cx+wNY}" y2="${cy+yNY}" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="6 5"/>
<line class="mwlats" x1="${cx-wSY}" y1="${cy+ySY}" x2="${cx+wSY}" y2="${cy+ySY}" stroke="#ff8fc8" stroke-width="2.5" stroke-dasharray="6 5"/>
<circle cx="${cx+.2*E}" cy="${cy+yNY}" r="6" fill="#ffd23f" stroke="#13203d" stroke-width="2"/>
<line x1="${cx}" y1="${cy-E-26}" x2="${cx}" y2="${cy+E+20}" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>
<rect x="${cx-E}" y="${cy-E}" width="${E*2}" height="${E*2}" fill="url(#${u}n)"/></g>
<circle class="mwdirect" cx="${cx+E-2}" cy="${cy}" r="9" fill="#fff6c2" opacity=".9"/>`;
  t+=`<g class="mwtilt" style="transform-origin:${cx}px ${cy}px"><line x1="${cx}" y1="${cy-E-28}" x2="${cx}" y2="${cy-E}" stroke="#fff" stroke-width="3" stroke-linecap="round"/><line x1="${cx}" y1="${cy+E}" x2="${cx}" y2="${cy+E+20}" stroke="#fff" stroke-width="3" stroke-linecap="round"/><text x="${cx}" y="${cy-E-33}" text-anchor="middle" class="mwtxt" font-size="14" fill="#fff">N</text>
<text x="${cx-E+6}" y="${cy+yNY-8}" class="mwtxt" font-size="11.5" fill="#ffd23f">New York</text><text x="${cx-E+12}" y="${cy+ySY+16}" class="mwtxt" font-size="11.5" fill="#ff8fc8">Australia’s latitude</text></g>`;
  t+=mwPill(160,22,'Earth up close',{bg:'#0b1430',w:140});
  t+=`<text x="${MW_VW-10}" y="${cy-18}" text-anchor="end" class="mwtxt" font-size="11.5" fill="#ffe17a">Sunlight</text>`;
  t+=`<g transform="translate(0 316)"><rect x="12" y="0" width="${MW_VW-24}" height="112" rx="14" fill="#0b1430" opacity=".86"/>
<text x="26" y="24" class="mwtxt" font-size="12.5" fill="#ffd23f">New York</text><text class="mwdny mwtxt" x="${MW_VW-26}" y="24" text-anchor="end" font-size="12.5" fill="#fff"></text>
<rect x="26" y="32" width="${MW_VW-52}" height="10" rx="5" fill="#26345e"/><rect class="mwbny" x="26" y="32" width="0" height="10" rx="5" fill="#ffd23f"/>
<text x="26" y="66" class="mwtxt" font-size="12.5" fill="#ff8fc8">Australia</text><text class="mwdsy mwtxt" x="${MW_VW-26}" y="66" text-anchor="end" font-size="12.5" fill="#fff"></text>
<rect x="26" y="74" width="${MW_VW-52}" height="10" rx="5" fill="#26345e"/><rect class="mwbsy" x="26" y="74" width="0" height="10" rx="5" fill="#ff8fc8"/>
<text class="mwdir mwtxt" x="${MW_VW/2}" y="102" text-anchor="middle" font-size="12" fill="#cfd8ff"></text></g>`;
  t+=mwClouds();
  return ngSvg(MW_VW,MW_H,t,'mwv','Earth up close, with sunlight from the right');
}
function mwSyncSeas(G){
  const S=G.st,E=S.el,R=G.L.rounds[S.r],s=S.s,[x,y]=mwSeasXY(s);
  const eg=E.m.querySelector('.mwearth');eg.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(1+.12*Math.sin(s*MW_RAD)).toFixed(3)})`);
  /* Earth behind the Sun when it is at the back of the orbit */
  const back=Math.sin(s*MW_RAD)<-.55,bk=E.m.querySelector('.mwsback');if(back&&eg.parentNode!==bk)bk.appendChild(eg);else if(!back&&eg.parentNode===bk)E.m.querySelector('.mwghost').after(eg);
  const sunA=Math.atan2(MS.y-y,MS.x-x)/MW_RAD;eg.querySelector('.mwens').setAttribute('transform',`rotate(${sunA.toFixed(1)})`);
  const key=MW_SK[mwN(Math.round(s/90)*90)],near=Math.abs(mwDiff(s,MW_SA[key]))<3;
  eg.setAttribute('aria-valuenow',Math.round(mwN(s)));eg.setAttribute('aria-valuetext',S.reveal||S.okNow?MW_SMON[key]:`Earth at position ${Math.round(mwN(s))} degrees`);
  const mo=E.m.querySelector('.mwsmon');mo.innerHTML=(S.reveal||S.okNow)&&near?mwPill(x,y+(Math.sin(s*MW_RAD)>.5?44:-46),MW_SMON[key],{bg:'#ffd23f',fg:'#13203d',w:MW_SMON[key].length*8+28}):'';
  const gh=E.m.querySelector('.mwghost');const on=S.ghost&&R&&R.t==='season';gh.setAttribute('opacity',on?1:0);if(on){const [gx,gy]=mwSeasXY(MW_SA[R.ans[0]]);gh.setAttribute('transform',`translate(${gx} ${gy})`);}
  const V=E.v,cov=mwCover(R)&&!S.reveal;V.querySelector('.mwclouds').classList.toggle('gone',!cov);
  const dec=mwDecl(s);V.querySelectorAll('.mwtilt').forEach(g=>g.style.transform=`rotate(${dec.toFixed(2)}deg)`);
  const hNY=mwDay(43,dec),hSY=mwDay(-34,dec),W=MW_VW-52,fmt=h=>`${Math.round(h*2)/2} hours of daylight`;
  V.querySelector('.mwdny').textContent=fmt(hNY);V.querySelector('.mwdsy').textContent=fmt(hSY);
  V.querySelector('.mwbny').setAttribute('width',(W*hNY/24).toFixed(1));V.querySelector('.mwbsy').setAttribute('width',(W*hSY/24).toFixed(1));
  V.querySelector('.mwdir').textContent=Math.abs(dec)<4?'Direct sunlight hits the equator.':dec>0?'Direct sunlight hits the Northern Hemisphere.':'Direct sunlight hits the Southern Hemisphere.';
}

/* ---------------- board: ECLIPSE SEASONS (tilted Moon orbit) ---------------- */
const MW_K=8;   /* side view: pixels per degree of tilt (drawn bigger than real) */
function mwNodeModel(G,R){
  const u=mwUid();let t=`<defs><radialGradient id="${u}b" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#1a2758"/><stop offset="1" stop-color="#070d24"/></radialGradient></defs>`;
  t+=`<rect width="${MW_W}" height="${MW_H}" fill="url(#${u}b)"/>${mwStars(60,MW_W,MW_H,41)}`;
  t+=`<circle cx="${MN.x}" cy="${MN.y}" r="${MN.r}" fill="none" stroke="#6d7fc4" stroke-opacity=".6" stroke-width="2" stroke-dasharray="5 7"/>`;
  t+=mwSunGlow(MN.x,MN.y,34,u)+`<text x="${MN.x}" y="${MN.y+5}" text-anchor="middle" class="mwtxt" font-size="12" fill="#7a4a00">SUN</text>`;
  MW_MON.forEach((m,i)=>{const a=mwMonA(i),x=MN.x+(MN.r+24)*Math.cos(a*MW_RAD),y=MN.y-(MN.r+24)*Math.sin(a*MW_RAD);t+=`<text class="mwmon mwtxt" data-m="${i}" x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="#8d97c5">${m.slice(0,3)}</text>`;});
  t+=`<g class="mwghost" opacity="0"><circle r="30" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="5 5"/></g>`;
  const drag=R&&R.t==='node';
  t+=`<g class="mwearth${drag?' mwgrab':''}"${drag?' tabindex="0" role="slider" aria-label="Earth. Drag it around the Sun to change the month, or use the arrow keys." aria-valuemin="0" aria-valuemax="11"':''}><circle r="44" fill="#fff" opacity="0"/>
<path class="mwnl" d="M-56 0H56" stroke="#ff9f43" stroke-width="2.5" stroke-dasharray="6 5"/>
<path class="mwabove" d="M-34 0A34 34 0 0 1 34 0" fill="none" stroke="#bfe6ff" stroke-width="2.5"/><path class="mwbelow" d="M34 0A34 34 0 0 1 -34 0" fill="none" stroke="#bfe6ff" stroke-width="2" stroke-dasharray="3 5" opacity=".55"/>
<text class="mwtabove mwtxt" y="-40" text-anchor="middle" font-size="10.5" fill="#bfe6ff">above</text><text class="mwtbelow mwtxt" y="49" text-anchor="middle" font-size="10.5" fill="#bfe6ff" opacity=".7">below</text>
<g class="mwnear">${mwEarthTop(0,0,15,u)}</g><g class="mwnm">${mwMoonG(90,0,0,7,{dark:.82})}</g><circle class="mwfoc" r="22" fill="none" stroke="transparent" stroke-width="3"/></g>`;
  t+=`<text x="14" y="24" class="mwtxt" font-size="13" fill="#8d97c5">Top view of Earth’s year</text>`;
  t+=`<g transform="translate(14 48)"><path d="M0 0H20" stroke="#ff9f43" stroke-width="2.5" stroke-dasharray="6 5"/><text x="26" y="4" class="mwtxt" font-size="10.5" fill="#ffc690">Where the Moon’s</text><text x="26" y="18" class="mwtxt" font-size="10.5" fill="#ffc690">orbit crosses ours</text></g>`;
  return ngSvg(MW_W,MW_H,t,'mwm','Top view: Earth going around the Sun through the year, with the Moon’s tilted orbit');
}
function mwNodeView(G,R){
  const u=mwUid(),cy=210,ex=64,mx=176;
  let t=`<defs><radialGradient id="${u}b" cx="1" cy=".5" r="1"><stop offset="0" stop-color="#2b2f5e"/><stop offset="1" stop-color="#070d24"/></radialGradient>
<linearGradient id="${u}m" x1="1" x2="0"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient></defs>`;
  t+=`<rect width="${MW_VW}" height="${MW_H}" fill="url(#${u}b)"/>${mwStars(50,MW_VW,MW_H,51)}`;
  t+=mwSunGlow(MW_VW+30,cy,64,u);
  t+=`<line x1="${ex}" y1="${cy}" x2="${MW_VW}" y2="${cy}" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="7 6" opacity=".9"/><text x="${MW_VW-12}" y="${cy-10}" text-anchor="end" class="mwtxt" font-size="11.5" fill="#ffd23f">to the Sun</text>`;
  t+=`<line class="mworb" x1="${ex-40}" y1="${cy}" x2="${mx+70}" y2="${cy}" stroke="#bfe6ff" stroke-width="2" stroke-dasharray="3 5" opacity=".7"/>`;
  t+=`<g transform="translate(${ex} ${cy})">${mwEarthSmall(28,u,true)}</g><circle class="mwspot" cx="${ex+24}" cy="${cy}" r="9" fill="#000" opacity="0"/>`;
  t+=`<path class="mwcone" d="" fill="url(#${u}m)"/><g class="mwside">${mwMoonG(90,0,0,11,{dark:.9})}</g>`;
  t+=`<g class="mwhand" opacity="0"><line class="mwhl" x1="0" y1="0" x2="0" y2="0" stroke="#ff9f43" stroke-width="2" stroke-dasharray="3 4"/><g class="mwhk mwgrab" tabindex="0" role="slider" aria-label="Tilt of the Moon’s orbit. Drag up or down, or use the arrow keys." aria-valuemin="0" aria-valuemax="5"><circle r="22" fill="#fff" opacity="0"/><circle r="13" fill="#ff9f43" stroke="#fff" stroke-width="3"/><path d="M0 -6v12M-4 -2l4-4 4 4M-4 2l4 4 4-4" stroke="#fff" stroke-width="1.8" fill="none"/><circle class="mwfoc" r="17" fill="none" stroke="transparent" stroke-width="3"/></g></g>`;
  t+=`<g class="mwtiltp"></g><g class="mwecl"></g>`;
  t+=mwPill(160,22,'Side view: this month’s new moon',{bg:'#0b1430',w:250});
  t+=`<text x="${MW_VW/2}" y="${MW_H-16}" text-anchor="middle" class="mwtxt mwthin" font-size="11" fill="#8d97c5">The tilt is drawn bigger so you can see it.</text>`;
  return ngSvg(MW_VW,MW_H,t,'mwv','Side view of the new moon and the line to the Sun');
}
const mwHeight=(G)=>{const S=G.st,a=mwMonA(S.m);return -Math.sin(a*MW_RAD)*S.tilt*MW_K;};
function mwSyncNode(G){
  const S=G.st,E=S.el,R=G.L.rounds[S.r],a=mwMonA(S.m),[x,y]=mwNodeXY(a);
  const eg=E.m.querySelector('.mwearth');eg.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  const sun=Math.atan2(-(MN.y-y),MN.x-x);const nm=eg.querySelector('.mwnm');nm.setAttribute('transform',`translate(${(34*Math.cos(sun)).toFixed(1)} ${(-34*Math.sin(sun)).toFixed(1)}) rotate(${(-sun/MW_RAD).toFixed(1)})`);
  eg.querySelector('.mwnear').setAttribute('transform',`rotate(${(-sun/MW_RAD).toFixed(1)})`);
  const flat=S.tilt<.5;['.mwabove','.mwbelow','.mwtabove','.mwtbelow','.mwnl'].forEach(s=>{const n=eg.querySelector(s);n.style.display=flat&&s!=='.mwabove'&&s!=='.mwbelow'?'none':'';});
  eg.querySelector('.mwbelow').setAttribute('stroke-dasharray',flat?'0':'3 5');eg.querySelector('.mwbelow').setAttribute('opacity',flat?.9:.55);
  const mi=Math.round(mwN(S.m*30)/30)%12;eg.setAttribute('aria-valuenow',mi);eg.setAttribute('aria-valuetext',MW_MON[mi]);
  E.m.querySelectorAll('.mwmon').forEach(n=>{const on=+n.dataset.m===mi;n.setAttribute('fill',on?'#ffd23f':'#8d97c5');n.setAttribute('font-size',on?14:11.5);});
  const gh=E.m.querySelector('.mwghost');const on=S.ghost&&R&&R.t==='node';gh.setAttribute('opacity',on?1:0);if(on){const [gx,gy]=mwNodeXY(mwMonA(3));gh.setAttribute('transform',`translate(${gx} ${gy})`);}
  /* side view */
  const V=E.v,cy=210,ex=64,mx=176,hv=mwHeight(G),my=cy-hv,hit=Math.abs(hv)<=12;
  V.querySelector('.mwside').setAttribute('transform',`translate(${mx} ${my.toFixed(1)})`);
  const slope=(my-cy)/(mx-ex);V.querySelector('.mworb').setAttribute('y1',(cy-40*slope).toFixed(1));V.querySelector('.mworb').setAttribute('y2',(my+70*slope).toFixed(1));
  const tipx=ex+18,tipy=my+(cy-my)*0;V.querySelector('.mwcone').setAttribute('d',`M${mx} ${(my-10).toFixed(1)}L${tipx} ${(tipy-3).toFixed(1)}L${tipx} ${(tipy+3).toFixed(1)}L${mx} ${(my+10).toFixed(1)}Z`);
  V.querySelector('.mwspot').setAttribute('opacity',hit?.75:0);V.querySelector('.mwspot').setAttribute('cy',(cy-hv*.3).toFixed(1));
  V.querySelector('.mwecl').innerHTML=hit?mwPill(ex+50,cy+70,'Solar eclipse!',{bg:'#ffd23f',fg:'#13203d',w:122,cls:'mweclp'}):mwPill(160,cy+70,hv>0?'Shadow misses: Moon passes above':'Shadow misses: Moon passes below',{bg:'#0b1430',w:236,fs:12});
  const hd=V.querySelector('.mwhand');const tiltR=R&&R.t==='tilt';hd.setAttribute('opacity',tiltR?1:0);hd.style.pointerEvents=tiltR?'':'none';
  if(tiltR){const hx=mx+70,hy=cy-(hv/(mx-ex))*(hx-ex);V.querySelector('.mwhk').setAttribute('transform',`translate(${hx} ${hy.toFixed(1)})`);
    const hl=V.querySelector('.mwhl');hl.setAttribute('x1',hx);hl.setAttribute('x2',hx);hl.setAttribute('y1',cy);hl.setAttribute('y2',hy.toFixed(1));
    const hk=V.querySelector('.mwhk');hk.setAttribute('aria-valuenow',Math.round(S.tilt));hk.setAttribute('aria-valuetext',`${Math.round(S.tilt)} degrees`);}
  V.querySelector('.mwtiltp').innerHTML=mwPill(250,cy+120,`Moon’s orbit tilt: ${Math.round(S.tilt)}°`,{bg:'#ff9f43',fg:'#13203d',w:150,fs:12.5});
}

/* ---------------- building + syncing ---------------- */
function mwBuild(G){
  const S=G.st,L=G.L,R=L.rounds[S.r],k=mwKind(L,R||L.rounds[L.rounds.length-1]);
  const m=k==='orbit'?mwOrbitModel(G,R):k==='season'?mwSeasModel(G,R):mwNodeModel(G,R);
  const v=k==='orbit'?mwOrbitView(G,R):k==='season'?mwSeasView(G,R):mwNodeView(G,R);
  const wrap=h('div',{class:'mwboard'},m,v);
  S.el={wrap,m,v,k,r:S.r};
  mwInput(G);
  /* clouds start in place without sliding */
  const cl=v.querySelector('.mwclouds');if(cl){cl.classList.add('now');cl.classList.toggle('gone',!(mwCover(R)&&!S.reveal));requestAnimationFrame(()=>requestAnimationFrame(()=>cl.classList.remove('now')));}
  mwSync(G);
}
function mwSync(G){const S=G.st;if(!S.el)return;if(S.el.k==='orbit')mwSyncOrbit(G);else if(S.el.k==='season')mwSyncSeas(G);else mwSyncNode(G);}
function mwCanMove(G){const S=G.st,R=G.L.rounds[S.r];return !!(G&&G.key==='moon'&&R&&mwDrag(R)&&!S.okNow&&!G.done);}
function mwInput(G){
  const S=G.st,E=S.el,svg=E.m;
  const pt=(el,e)=>{const p=el.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=el.getScreenCTM();return m?p.matrixTransform(m.inverse()):{x:0,y:0};};
  const angOf=(p)=>E.k==='orbit'?mwN(Math.atan2(-(p.y-MO.y),p.x-MO.x)/MW_RAD):E.k==='season'?mwN(Math.atan2((p.y-MS.y)/MS.ry,(MS.x-p.x)/MS.rx)/MW_RAD):mwN((Math.atan2(-(p.y-MN.y),p.x-MN.x)/MW_RAD+90)/30*30);
  const hitOK=(p,e)=>{if(e.target.closest&&e.target.closest('.mwgrab'))return true;
    if(E.k==='orbit'){const d=Math.hypot(p.x-MO.x,p.y-MO.y);return Math.abs(d-MO.r)<46;}
    if(E.k==='season'){const d=Math.hypot((p.x-MS.x)/MS.rx,(p.y-MS.y)/MS.ry);return d>.62&&d<1.4;}
    const d=Math.hypot(p.x-MN.x,p.y-MN.y);return Math.abs(d-MN.r)<44;};
  let drag=null;
  const setA=v=>{if(E.k==='orbit')S.ang=v;else if(E.k==='season')S.s=v;else S.m=v/30;mwSync(G);};
  const getA=()=>E.k==='orbit'?S.ang:E.k==='season'?S.s:S.m*30;
  svg.addEventListener('pointerdown',e=>{const R=G.L.rounds[S.r];if(!mwCanMove(G)||G.st!==S||R.t==='tilt')return;const p=pt(svg,e);if(!hitOK(p,e))return;
    e.preventDefault();if(S.anim){S.anim.cancel();S.anim=null;}drag={pid:e.pointerId,moved:false,x0:e.clientX,y0:e.clientY,p};S.el.wrap.classList.add('mwdragging');try{svg.setPointerCapture(e.pointerId);}catch(_){}});
  svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;if(Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)>3)drag.moved=true;if(!drag.moved)return;if(S.anim){S.anim.cancel();S.anim=null;}setA(angOf(pt(svg,e)));S.touched=true;});
  const up=e=>{if(!drag||e.pointerId!==drag.pid)return;const d=drag;drag=null;S.el.wrap.classList.remove('mwdragging');
    if(!d.moved){const onPiece=e.target.closest&&e.target.closest('.mwgrab');if(onPiece){mwSettle(G,setA,getA);return;}S.touched=true;mwGlide(G,getA(),angOf(d.p),true,setA);return;}
    mwSettle(G,setA,getA);};
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  svg.addEventListener('keydown',e=>{const g=e.target.closest&&e.target.closest('.mwgrab');if(!g||!mwCanMove(G)||G.st!==S)return;
    const step=E.k==='orbit'?45:E.k==='season'?90:30;let v=null;
    if(e.key==='ArrowRight'||e.key==='ArrowUp')v=getA()+step;else if(e.key==='ArrowLeft'||e.key==='ArrowDown')v=getA()-step;else if(e.key==='Enter'){e.preventDefault();mwLock();return;}
    if(v==null)return;e.preventDefault();S.touched=true;mwGlide(G,getA(),Math.round(v/step)*step,true,setA);});
  /* the tilt handle (side view) */
  const V=E.v,hk=V.querySelector('.mwhk');
  if(hk){let td=null;
    const tiltOf=e=>{const p=pt(V,e),cy=210,ex=64,hx=176+70;const hv=(cy-p.y)/((hx-ex))*(176-ex);const a=mwMonA(S.m),f=-Math.sin(a*MW_RAD)||1;return Math.max(0,Math.min(5,hv/(MW_K*f)));};
    hk.addEventListener('pointerdown',e=>{const R=G.L.rounds[S.r];if(!mwCanMove(G)||R.t!=='tilt')return;e.preventDefault();e.stopPropagation();td=e.pointerId;try{hk.setPointerCapture(e.pointerId);}catch(_){}S.el.wrap.classList.add('mwdragging');});
    hk.addEventListener('pointermove',e=>{if(td!==e.pointerId)return;S.tilt=tiltOf(e);S.touched=true;mwSync(G);});
    const hu=e=>{if(td!==e.pointerId)return;td=null;S.el.wrap.classList.remove('mwdragging');const to=Math.round(S.tilt);Art.tween({from:S.tilt,to,dur:180,step:v=>{S.tilt=v;mwSync(G);},done:()=>{S.tilt=to;mwSync(G);ngRender();}});};
    hk.addEventListener('pointerup',hu);hk.addEventListener('pointercancel',hu);
    hk.addEventListener('keydown',e=>{const R=G.L.rounds[S.r];if(!mwCanMove(G)||R.t!=='tilt')return;let v=null;
      if(e.key==='ArrowUp'||e.key==='ArrowRight')v=Math.min(5,Math.round(S.tilt)+1);else if(e.key==='ArrowDown'||e.key==='ArrowLeft')v=Math.max(0,Math.round(S.tilt)-1);else if(e.key==='Enter'){e.preventDefault();mwLock();return;}
      if(v==null)return;e.preventDefault();S.touched=true;S.tilt=v;mwSync(G);ngRender();V.querySelector('.mwhk').focus();});}
}
/* smooth move (shortest way round) */
function mwGlide(G,from,to,settle,setA){
  const S=G.st;if(S.anim)S.anim.cancel();const d=mwDiff(to,from);
  S.anim=Art.tween({from:0,to:1,dur:Math.min(520,180+Math.abs(d)*2.4),ease:'outCubic',step:v=>setA(from+d*v),done:()=>{S.anim=null;setA(mwN(from+d));if(settle)mwSettle(G,setA,()=>mwN(from+d));}});
}
/* snap to the nearest spot with a little bounce */
function mwSettle(G,setA,getA){
  const S=G.st,k=S.el.k,step=k==='orbit'?45:k==='season'?90:30,a=getA(),to=Math.round(a/step)*step,d=mwDiff(to,a);
  if(S.anim)S.anim.cancel();
  S.anim=Art.tween({from:0,to:1,dur:Math.abs(d)<.5?0:260,ease:'outBack',step:v=>setA(a+d*v),done:()=>{S.anim=null;setA(mwN(to));S.touched=true;
    const g=S.el.m.querySelector(k==='orbit'?'.mwmoon .mwbody':k==='season'?'.mwesm':null);if(g)Art.pop(g,1.1);ngRender();}});
}

/* ---------------- checking ---------------- */
function mwAnswer(R){return R.t==='make'||R.t==='time'||R.t==='ecl'?[R.th]:R.t==='season'?R.ans:R.t==='tilt'?[5]:R.t==='node'?[3,9]:[R.ans];}
function mwCur(G){const S=G.st,R=G.L.rounds[S.r];return R.t==='season'?MW_SK[mwN(Math.round(S.s/90)*90)]:R.t==='tilt'?Math.round(S.tilt):R.t==='node'?Math.round(mwN(S.m*30)/30)%12:mwSnap(S.ang);}
function mwPhaseWhy(made,R){
  const want=R.th,n=MW_NAMES[made].toLowerCase(),pm=Math.round(mwSeen(made)*100),pw=Math.round(mwSeen(want)*100);
  if(made===0)return `That makes a **new moon**: the lit half faces away from Earth, so we see none of it. ${R.aus?'':'Move the Moon away from the Sun’s side.'}`;
  if(pm===pw&&made!==want)return `Right amount, wrong side! That is a **${n}**. ${want<180?'Waxing moons (growing) are on the top half of the orbit, on the way to full moon.':'Waning moons (shrinking) are on the bottom half of the orbit, after full moon.'}`;
  return `That makes a **${n}**: we see ${pm}% of the lit half. A ${MW_NAMES[want].toLowerCase()} shows ${pw>pm?'MORE':'LESS'} (${pw}%). Move the Moon ${pw>pm?'farther from':'closer to'} the Sun’s side.`;
}
function mwWhy(G,R,ok,cur){
  if(R.t==='make'){const nm=MW_NAMES[R.th].toLowerCase();
    if(ok)return R.aus?`Yes! It is a **${nm}** in both places. From Australia it looks upside down, so the lit side is on the left.`:`Yes: a **${nm}**. ${R.th===0?'The lit half faces away from Earth.':R.th===180?'The whole lit half faces Earth.':`We see ${Math.round(mwSeen(R.th)*100)}% of the lit half. `+(R.th<180?'Waxing: lit on the right from New York.':'Waning: lit on the left from New York.')}`;
    return mwPhaseWhy(cur,R);}
  if(R.t==='time'){const d=mwN(R.th-R.from)/360*29.5;
    if(ok)return `Yes! In ${MW_WK(R.days)} the Moon travels ${R.days===7?'a quarter':'half'} of its orbit, so a ${MW_NAMES[R.from].toLowerCase()} becomes a **${MW_NAMES[R.th].toLowerCase()}**.`;
    const moved=mwN(cur-R.from)/360*29.5;
    return `That spot is about ${Math.round(moved)} days later (a ${MW_NAMES[cur].toLowerCase()}). The whole orbit takes 29.5 days, so ${MW_WK(R.days)} is about ${R.days===7?'one quarter':'half'} of the way around, counterclockwise.`;}
  if(R.t==='ecl'){if(ok)return R.k==='solar'?'Yes! The Moon is between the Sun and Earth, and its shadow falls on Earth. The sky goes dark in the daytime.':'Yes! Earth is between the Sun and the Moon. Earth’s shadow falls on the Moon and turns it a coppery red.';
    return R.k==='solar'?`That is a ${MW_NAMES[cur].toLowerCase()} spot. To block the Sun, the Moon must sit right between the Sun and Earth.`:`That is a ${MW_NAMES[cur].toLowerCase()} spot. Earth’s shadow points away from the Sun. Put the Moon in it.`;}
  if(R.t==='season'){if(ok)return R.why;
    const dec=mwDecl(MW_SA[cur]),lean=Math.abs(dec)<4?'neither pole leans toward the Sun, so both hemispheres get equal sunlight (spring or fall)':dec>0?'the North Pole leans TOWARD the Sun: summer in New York, winter in Australia':'the North Pole leans AWAY from the Sun: winter in New York, summer in Australia';
    return `This is ${MW_SMON[cur]}. Here ${lean}. Watch the daylight hours.`;}
  if(R.t==='tilt')return ok?'Yes, that is the real tilt. Now the Moon passes ABOVE the Sun line at this new moon, so its shadow misses Earth. No eclipse!':`Not yet: the tilt is ${cur}°. The real Moon’s orbit is tilted 5°. Drag the orange handle all the way up.`;
  if(R.t==='node')return ok?`Yes! In ${MW_MON[cur]} the Sun lines up with the place where the orbits cross, so the new moon sits right on the Sun line. Its shadow hits Earth.`:`In ${MW_MON[cur]} the new moon passes ${mwHeight(G)>0?'above':'below'} the Sun line, so its shadow misses Earth. Look for the month when the orange crossing line points at the Sun.`;
  return ok?R.why:'Not quite. '+R.why;
}
function mwLock(){
  if(!G||G.key!=='moon')return;const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||G.done||S.okNow||R.t==='mc')return;
  const cur=mwCur(G),ok=mwAnswer(R).includes(cur);
  if(ngT())return ngTAns(ok,mwNext);
  S.reveal=true;
  if(ok){S.okNow=true;S.msg=['ok',mwWhy(G,R,true,cur)];fx.pop({icon:'moon',text:'Correct!',kind:'good'});
    const g=S.el.m.querySelector(S.el.k==='orbit'?'.mwmoon':'.mwearth');if(g&&S.el.k!=='node'){Art.burstAt(g,{n:18,colors:['#ffd23f','#fff','#59d6ff'],shape:['star','dot']});}
    if(R.t==='tilt'||R.t==='node'){const sv=S.el.v.querySelector('.mwside');if(sv)Art.burstAt(sv,{n:12,colors:['#ffd23f','#fff']});}
    ngRender();ngSay(mwWhy(G,R,true,cur),'go');}
  else{if(!S.tried.includes(cur)){S.tried.push(cur);G.miss++;}G.tries++;S.msg=['no',mwWhy(G,R,false,cur)];fx.pop({icon:'moon',text:'Not quite',kind:'oops'});
    Art.shake&&Art.shake(S.el.wrap);ngRender();ngSay(mwWhy(G,R,false,cur),'alert');}
  mwSync(G);
}
function mwCheckMC(){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||G.done||S.okNow||S.pick==null)return;
  const ok=S.pick===R.ans;
  if(ngT())return ngTAns(ok,mwNext);
  if(ok){S.okNow=true;S.msg=['ok',mwWhy(G,R,true)];fx.pop({icon:'moon',text:'Correct!',kind:'good'});ngRender();ngSay(R.why,'go');}
  else{S.bad.push(S.pick);G.miss++;G.tries++;S.msg=['no',mwWhy(G,R,false)];fx.pop({icon:'moon',text:'Not quite',kind:'oops'});S.pick=null;ngRender();ngSay(mwWhy(G,R,false),'alert');}
}
function mwRoundInit(G){
  const S=G.st,L=G.L,R=L.rounds[S.r];if(!R)return;
  Object.assign(S,{pick:null,bad:[],okNow:false,msg:null,reveal:false,tried:[],ghost:false,touched:false,anim:null});
  if(R.t==='make'||R.t==='ecl')S.ang=R.start!=null?R.start:mwN(R.th+135);
  else if(R.t==='time')S.ang=R.from;
  else if(R.t==='season')S.s=[90,0,180,270].find(v=>!R.ans.includes(MW_SK[v]));
  else if(R.t==='tilt'){S.tilt=0;S.m=0;}
  else if(R.t==='node'){S.tilt=5;S.m=0;}
  else if(R.t==='mc'){if(R.pic!=null){if(mwKind(L,R)==='orbit')S.ang=R.pic;else S.s=R.pic;}
    if(R.aus)S.ausView=true;}
  if(S.ang==null)S.ang=135;if(S.s==null)S.s=0;if(S.m==null)S.m=0;if(S.tilt==null)S.tilt=5;
}
function mwNext(){const S=G.st;S.r++;S.el=null;
  if(S.r>=G.L.rounds.length){S.r--;mwRoundInitDone(G);ngRender();G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}
  mwRoundInit(G);ngRender();
  const f=S.el&&S.el.m.querySelector('.mwgrab');if(f&&!ngT()&&document.activeElement&&document.activeElement.closest&&document.activeElement.closest('#ngSide'))f.focus({preventScroll:true});}
function mwRoundInitDone(G){const S=G.st;S.finished=true;S.okNow=true;S.msg=null;}

/* ---------------- side panel ---------------- */
function mwTask(G,R){
  const L=G.L,S=G.st,cov=mwCover(R);
  if(R.t==='make'){const nm=MW_NAMES[R.th];
    return h('div',{class:'mwtask'},R.aus?h('span',{class:'mwflag'},'AUS'):mwIcon(R.th,58),h('div',null,h('b',null,`Make a ${nm.toLowerCase()}`),
      h('small',null,...ngRich(R.aus?'This time you are standing in **Australia**. Watch how it looks from there.':cov?'Clouds cover the sky. Place the Moon, then **lock it in** to look.':'Drag the Moon around its orbit. Watch the view from Earth.'))));}
  if(R.t==='time')return h('div',{class:'mwtask'},mwIcon(R.from,58),h('div',null,h('b',null,`Today is a ${MW_NAMES[R.from].toLowerCase()}.`),h('small',null,...ngRich(`Drag the Moon to where it will be in **${MW_WK(R.days)}**.`))));
  if(R.t==='ecl')return h('div',{class:'mwtask'},h('span',{class:'mwflag '+R.k},R.k==='solar'?'☀':'●'),h('div',null,h('b',null,R.k==='solar'?'Line up a SOLAR eclipse':'Line up a LUNAR eclipse'),
    h('small',null,...ngRich(cov?'Clouds cover the sky. Place the Moon, then **lock it in**.':R.k==='solar'?'Drag the Moon so it **blocks the Sun** for people on Earth.':'Drag the Moon into **Earth’s shadow**.'))));
  if(R.t==='season')return h('div',{class:'mwtask'},h('span',{class:'mwflag seas'},R.hemi==='S'?'AUS':R.hemi==='E'?'=':'NY'),h('div',null,h('b',null,R.q),h('small',null,...ngRich(cov?'Clouds cover the close-up. Place Earth, then **lock it in**.':'The axis always points the same way in space. Watch the close-up.'))));
  if(R.t==='tilt')return h('div',{class:'mwtask'},h('span',{class:'mwflag tilt'},'5°'),h('div',null,h('b',null,'Tilt the Moon’s orbit'),h('small',null,...ngRich('If the orbit were flat, every new moon would make an eclipse. Drag the **orange handle** to the real tilt: **5°**.'))));
  if(R.t==='node')return h('div',{class:'mwtask'},h('span',{class:'mwflag tilt'},'?'),h('div',null,h('b',null,'Find an eclipse month'),h('small',null,...ngRich('Drag **Earth** around the Sun, one month at a time. Find a month when the new moon’s shadow hits Earth.'))));
  return null;
}
function mwSide(G){
  const L=G.L,S=G.st,R=L.rounds[S.r];
  const prog=h('div',{class:'ppsteps'},...L.rounds.map((Q,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
  if(!R||S.finished)return [prog,h('div',{class:'ppdone'},'✓ All rounds done!')];
  const kids=[prog];const lock=G.done||S.okNow;
  if(R.t==='mc'){
    kids.push(h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.pick===v?' on':'')+(S.bad.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:lock||S.bad.includes(v),onclick:()=>{S.pick=v;mwCheckMC();}},t))));
  } else {
    kids.push(mwTask(G,R));
    if(!S.okNow)kids.push(ngBtn([I('check'),' Lock it in'],mwLock,'good mwlock',{style:'width:100%;font-size:18px',disabled:G.done}));
    if(!S.okNow&&!ngT())kids.push(h('p',{class:'mwkeys'},R.t==='tilt'?'Tip: tap the handle, then use the ↑ ↓ keys.':'Tip: tap or drag. Arrow keys work too; Enter locks it in.'));
  }
  if(S.msg)kids.push(h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])));
  if(S.okNow)kids.push(ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',mwNext,'good',{style:'width:100%;margin-top:6px'}));
  return kids;
}

ngDef({key:'moon',name:'Moonwatch',ic:'moon',std:'MS-ESS1-1',subj:'earth',cap3:true,winDelay:700,
  short:'Drive the Moon: drag it around Earth to make phases and eclipses, and drag Earth to make the seasons.',menuDesc:'Drag the Moon around its orbit and watch the view from Earth change. Make phases, line up eclipses and drag Earth around the Sun to make the seasons.',
  intro:'Drive the Moon! Drag the Moon around Earth and watch what people on Earth see. Make phases on demand, line up eclipses, jump ahead in time, then drag Earth around the Sun to make the seasons. No mistakes earns 3 stars.',
  how:['**Drag the Moon** (or Earth) in the model on the left. The view from Earth on the right changes as you go.','**Lock it in** when it matches the task. Some rounds are cloudy: place it first, then look.','A wrong answer shows what you really made and why. Fewer mistakes earns more stars.'],
  levels:MW_LEVELS,packs:MW_PACKS,
  mini:L=>{const w=h('span',{class:'ppmini'}),R=L.rounds.find(r=>r.th!=null);[0,90,180].forEach(d=>w.append(svgEl(`<svg viewBox="0 0 40 40" width="20" height="20" aria-hidden="true">${mwPhase(R?(R.th+d)%360:d+45,17,20,20)}</svg>`)));return w;},
  start(G){G.st={r:0,el:null};mwRoundInit(G);},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,R=L.rounds[S.r];
    if(!S.el)mwBuild(G);
    if(main.children[0]!==S.el.wrap||main.children.length!==1)ngRC(main,S.el.wrap);
    ngRC(side,...mwSide(G));
    mwSync(G);
    if(!S.msg&&R&&!S.finished){
      const t=R.t==='mc'?'Use the model to explain. Tap the best answer.':R.t==='tilt'?'Drag the orange handle to tilt the Moon’s orbit. Watch where the shadow goes.':R.t==='node'?'Drag Earth around the Sun, month by month. Watch the side view.':R.t==='season'?'Drag Earth around the Sun. Watch how the sunlight hits Earth.':
        mwCover(R)&&!S.reveal?'It is cloudy! Use the model: where must the Moon be? Then lock it in.':R.t==='time'?'The Moon moves counterclockwise. How far does it go in that time?':R.t==='ecl'?'Line up the Sun, Earth and Moon.':'Drag the Moon. Picture yourself on Earth looking at it.';
      ngSay(t);}
  },
  hints(G){const L=G.L,R=L.rounds[G.st.r]||L.rounds[0];
    return [L.clue,'Half of the Moon is always lit (the side facing the Sun, on the right). New moon: lit side faces away from Earth. Full moon: lit side faces Earth. Waxing = top half of the orbit, waning = bottom half.',
      R.t==='make'||R.t==='time'?`The answer is the **${MW_NAMES[R.th].toLowerCase()}** spot. It is marked with a gold ring.`:R.t==='ecl'?(R.k==='solar'?'Put the Moon between Earth and the Sun (the new moon spot, marked in gold).':'Put the Moon behind Earth, opposite the Sun (the full moon spot, marked in gold).'):
      R.t==='tilt'?'Drag the handle all the way up to 5°.':R.t==='node'?'Try April (marked in gold) or October: the orange crossing line points at the Sun.':R.t==='season'?`Look for where the N end of the axis leans ${R.hemi==='N'?'toward':R.hemi==='E'?'sideways (neither toward nor away from)':'away from'} the Sun (marked in gold).`:'The answer: '+(R.opts.find(o=>o[0]===R.ans)||['',''])[1]];},
  onHint(G){if(G.hint===3){G.st.ghost=true;mwSync(G);}}
});
NGTHUMB.moon=()=>{
  MW_U=0;
  let t=mwSunGlow(352,90,62,'tsun');
  t+=`<circle cx="138" cy="90" r="66" fill="none" stroke="#8d9be0" stroke-width="2.5" stroke-dasharray="6 7"/>`+mwEarthTop(138,90,24,'tea');
  t+=`<g transform="translate(138 24)">${mwMoonG(90,0,0,13,{dark:.82})}</g><g transform="translate(72 90)">${mwMoonG(90,0,0,13,{dark:.82})}</g>`;
  t+=`<g transform="translate(262 92)"><circle r="44" fill="#0b1430" opacity=".85"/>${mwMoonG(135,0,0,34,{glow:.2})}</g>`;
  t+=ngStar(30,24,6,'#f6efe0',.8)+ngStar(220,160,5,'#f6efe0',.6)+ngStar(40,150,4,'#f6efe0',.6);
  return ngWrap('moon','#121c45',t);
};
