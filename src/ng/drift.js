/* ================= LIFE 4: ISLAND DRIFT (MS-LS4-4, LS4-6) =================
   "You are the predator."
   1. Predict which kind becomes more common and which graph shape it makes.
   2. Hunt: the student plays the bird (or owl). Prey are scattered on the habitat for 8 seconds and
      the student taps every one they can spot (the bird is full after 8). Prey that match the
      background really are harder to see, so the student feels the selection pressure.
      Survivors have babies that look like them (tiny mutation chance). The graph builds one point
      per generation from what the student actually caught.
   3. After 3 hunted generations, fast forward the rest with the same pressure.
   4. Explain WHY. One choice is always a misconception ("the moths turned dark").
   Levels where hunting does not fit (finch beaks, germs, pesticide) let the student play the
   ENVIRONMENT: drag the drought, the antibiotic or the "no spray" sign onto the habitat each
   generation, then watch who survives.
   Stars come from the predictions and the explanation only, never from hunting skill.
   Pre-Test / Post-Test: no hunt. The scene is shown and the student answers the prediction, the
   graph and the "why" in one try (3 scored items, same as before). */
const DRL=(name,story,o)=>Object.assign({name,story,gens:10},o);
const DR_LEVELS=[
  DRL('Sooty Trees','England, 1850s. Factory soot turns the tree bark black.',{hab:'bark',crit:'moth',A:['Light moths','#efe9dc'],B:['Dark moths','#2d2a28'],p0:.1,wA:.5,wB:1,
    why:[['surv','Dark moths were harder for birds to see on black bark, so more of them survived and had dark babies.'],['turn','The light moths turned dark so they could hide.'],['want','The moths wanted to be dark, so their wings changed.']],
    fact:'This really happened to peppered moths in England. No moth changed color. Dark moths simply survived and reproduced more on sooty trees.',
    clue:'Birds eat the moths they can SEE. Which color is hard to see on black bark?',
    intro:'You are the **bird**. Tap every moth you can spot before time runs out. The survivors have babies that look like them. Each point on the graph is one **generation**.'}),
  DRL('White Sand','New dunes of bright white sand form along the beach.',{hab:'sand',crit:'mouse',A:['Light mice','#efe1c6'],B:['Dark mice','#5a4632'],p0:.5,wA:1,wB:.6,focus:'A',
    why:[['surv','Owls spotted the dark mice on white sand more easily, so light mice survived and had more babies.'],['sun','The sun bleached the dark mice’s fur light.'],['learn','The mice learned to be light colored.']],
    fact:'Beach mice in Florida have pale fur that matches the white sand dunes. Mice of the same species living inland are darker.',
    clue:'Owls hunt by sight. Which mice stand out on white sand?'}),
  DRL('Lava Rock','A volcano covers the desert with black lava rock.',{hab:'lava',crit:'mouse',A:['Light mice','#d8c39e'],B:['Dark mice','#2b2622'],p0:.2,wA:.55,wB:1,
    why:[['surv','Dark mice blended in with the black rock, so predators caught fewer of them. They survived and passed on dark fur.'],['need','The mice needed dark fur, so they grew it.'],['all','Every mouse slowly got a little darker each year.']],
    fact:'Rock pocket mice in Arizona live on both light sand and dark lava. On the lava, almost all of them are dark.',
    clue:'Same idea as the moths: which fur color hides on black rock?'}),
  DRL('Drought Island','The Galápagos Islands, 1977. A drought kills the plants with small, soft seeds.',{hab:'seeds',crit:'finch',A:['Small beaks','#c9a26b'],B:['Big beaks','#7a4a1e'],p0:.3,wA:.6,wB:1,
    why:[['surv','Only big, hard seeds were left. Finches with big beaks could crack them, so they survived and had big-beaked chicks.'],['grow','Finches grew bigger beaks by cracking hard seeds.'],['eat','The small-beaked finches ate more and their beaks stretched.']],
    fact:'Scientists Peter and Rosemary Grant measured this on Daphne Major island. After the drought, the average beak size of the finches got bigger.',
    clue:'What food was left after the drought? Which beak can handle it?',
    intro:'This time you are the **environment**. Drag the drought onto the island and watch which finches can still eat.'}),
  DRL('Super Germs','Germs in a sick person. Most are killed by an antibiotic, but a few are resistant.',{hab:'dish',crit:'germ',A:['Normal germs','#7fc8f8'],B:['Resistant germs','#e2483f'],p0:.02,wA:.15,wB:1,gens:8,
    why:[['surv','The antibiotic killed the normal germs. The few resistant ones survived and multiplied.'],['used','The germs got used to the medicine and learned to resist it.'],['make','The antibiotic turned normal germs into resistant ones.']],
    fact:'This is why doctors tell you to finish all your medicine and not to use antibiotics when you do not need them. Resistance is a real and growing problem.',
    clue:'The medicine kills germs that are NOT resistant. Who is left to multiply?'}),
  DRL('Striped Beetles','Some beetles have stripes and some do not. Birds here eat both kinds equally.',{hab:'leaf',crit:'beetle',A:['Plain beetles','#3f8a3a'],B:['Striped beetles','#d9a21e'],p0:.5,wA:1,wB:1,
    why:[['none','Stripes do not help or hurt survival here, so neither kind has an advantage.'],['strong','Striped beetles are stronger, so they will take over.'],['pretty','Birds like pretty beetles, so striped ones will disappear.']],
    fact:'Natural selection only changes a population when a trait affects survival or reproduction. A trait that makes no difference is not selected.',
    clue:'Read the story carefully: do birds prefer one kind?'}),
  DRL('Rare at First','Dark beetles start out rare: only 2 in every 100. On this dark soil, they survive twice as well.',{hab:'soil',crit:'beetle',A:['Light beetles','#c9b48a'],B:['Dark beetles','#2a2622'],p0:.02,wA:.5,wB:1,gens:12,shape:1,
    why:[['curve','At first there are so few dark beetles that the change is slow. As they become common, the change speeds up, then levels off near 100%.'],['line','The number of dark beetles goes up by the same amount every generation.'],['jump','All the beetles change at once in the first generation.']],
    fact:'Graphs of natural selection often make an S-shape: slow at first, fast in the middle, then leveling off.',
    clue:'With only 2 dark beetles out of 100, how fast can their numbers grow at the very start?'}),
  DRL('Clean Air','Pollution laws clean the air. The soot washes off, and tree bark turns light again.',{hab:'birch',crit:'moth',A:['Light moths','#efe9dc'],B:['Dark moths','#2d2a28'],p0:.9,wA:1,wB:.6,focus:'A',
    why:[['surv','Now the dark moths stand out on light bark, so birds eat more of them. Light moths survive and reproduce more.'],['back','The dark moths remembered being light and changed back.'],['wash','Rain washed the dark color off the moths.']],
    fact:'After clean-air laws, light peppered moths became common again in England. Selection depends on the environment, so it can reverse.',
    clue:'Which moth is easy to see on light bark now?'}),
  DRL('Spray Stops','Farmers stop spraying a pesticide. Resistant insects are slightly worse at finding food.',{hab:'farm',crit:'bug',A:['Normal insects','#5aa04a'],B:['Resistant insects','#b04a2a'],p0:.8,wA:1,wB:.85,gens:12,
    why:[['surv','Without the spray, resistance no longer helps. Normal insects find food a little better, so they slowly become more common.'],['forget','The insects forgot how to resist the spray.'],['stay','Once insects are resistant, they stay resistant forever.']],
    fact:'A trait that helps in one environment can be a small disadvantage in another. When the spray stops, the population slowly shifts back.',
    clue:'With no spray, does being resistant still help? Which kind has the edge now?'})
];
const DR_PACKS={0:'Pack 1: Hide and seek',3:'Pack 2: Survival tools',6:'Pack 3: Reading the graph'};

/* ---- the model (unchanged: grading, the level-picker mini graph and the graph choices use it) ---- */
function drSim(L){const v=[L.p0];let p=L.p0;for(let g=0;g<L.gens;g++){p=p*L.wB/(p*L.wB+(1-p)*L.wA);v.push(p);}return v;}
const drFocus=L=>L.focus==='A'?0:1;  /* which variant the graph shows */
const drVals=L=>{const v=drSim(L);return drFocus(L)?v:v.map(x=>1-x);};
function drShapes(L){
  const t=drVals(L),n=t.length,s0=t[0],dir=t[n-1]-s0;
  const rise=Array.from({length:n},(_,i)=>i===0?s0:Math.min(.99,Math.max(s0,.95)));
  const fall=t.map((_,i)=>s0*(1-i/(n-1)*.85));
  const flat=t.map(()=>s0);
  const line=t.map((_,i)=>s0+(t[n-1]-s0)*i/(n-1));
  const opts=Math.abs(dir)<.03?[['true',t],['rise',t.map((_,i)=>s0+(0.95-s0)*i/(n-1))],['fall',fall]]
    :L.shape?[['true',t],['line',line],['jump',rise]]
    :dir>0?[['true',t],['jump',rise],['fall',fall]]:[['true',t],['flat',flat],['jump',t.map((_,i)=>i===0?s0:.04)]];
  return opts;
}
const drOrder=(L,arr)=>{const k=L.name.length%3;return arr.slice(k).concat(arr.slice(0,k));};
const drTruth=L=>{const v=drSim(L);return Math.abs(v[L.gens]-L.p0)<.03?'N':v[L.gens]>L.p0?'B':'A';};
const DR_BG={bark:['#2b2724','#3a3430'],sand:['#f4efe2','#e6dcc6'],lava:['#1f1c1b','#33302d'],seeds:['#c9b48a','#a8915e'],dish:['#e7f2f7','#cfe3ec'],leaf:['#cfe6b2','#b5d693'],soil:['#3a2f26','#4a3d30'],birch:['#e8e4da','#cfc8b8'],farm:['#9cc46a','#86ad57']};

/* ---- game constants ---- */
const DR_W=720,DR_H=380,DR_HUNTS=3,DR_TIME=8000,DR_FULL=8,DR_MUT=.004;
const DR_N={moth:20,mouse:16,beetle:20,finch:14,germ:24,bug:18};
const DR_SZ={moth:50,mouse:60,beetle:40,finch:62,germ:42,bug:44};
const DR_NOUN={moth:['moth','moths'],mouse:['mouse','mice'],beetle:['beetle','beetles'],finch:['finch','finches'],germ:['germ','germs'],bug:['insect','insects']};
const DR_ENV={
  seeds:{card:'Drought year',sub:'No rain. Soft seeds die.',ic:'sun',how:'Drag the **Drought year** card onto the island. Which finches can still crack the seeds that are left?',kill:'flee',place:'island'},
  dish:{card:'Antibiotic dose',sub:'Medicine for the germs.',ic:'pill',how:'Drag the **Antibiotic dose** onto the dish. Watch which germs survive.',kill:'gpop',place:'dish'},
  farm:{card:'No spray',sub:'Farmers stop spraying.',ic:'nospray',how:'Drag the **No spray** sign onto the farm. Then watch which insects find enough food.',kill:'fade',place:'farm'}};
const drHunt=L=>!DR_ENV[L.hab];
const drWho=L=>L.crit==='mouse'?'owl':'bird';
const drRed=()=>Art.reduced();
function drRng(s){s=s>>>0||1;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const drCount=(p,N)=>{let b=Math.round(p*N);if(b===0&&p>=.015)b=1;if(b===N&&p<=.985)b=N-1;return b;};
const drMut=p=>p*(1-DR_MUT)+(1-p)*DR_MUT;
const drShuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const drLum=c=>{const n=parseInt(c.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255;};

/* ---- prey art (each drawn in a 100 x 100 box, centred) ---- */
function drArt(L,k,u,soft){
  /* soft = the camouflaged kind: gentler shading so it really melts into the habitat */
  const col=L[k][1],sh=Art.shade,d=sh(col,soft?-.17:-.42),l=sh(col,soft?.1:.32),c=L.crit,so=soft?.07:.2;
  const lg=(id,a,b,x2,y2)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2==null?0:x2}" y2="${y2==null?1:y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  if(c==='moth')return Art.g('moth',{size:100,color:col,tone:drLum(col)<.35?'dark':'light',shadow:false});
  if(c==='mouse'){let fur='';for(let i=0;i<9;i++)fur+=`<path d="M${34+i*4.6} ${44+Math.abs(i-4)*1.2}l3 4" />`;
    const pink=soft?sh(col,-.08):'#e7a3a9',inner=soft?sh(col,-.12):'#e8a0a8';
    return `<defs>${lg(u+'f',l,d)}</defs><ellipse cx="50" cy="84" rx="32" ry="4" fill="#000" opacity="${so}"/>
<path d="M24 66C10 72 4 60 10 52S6 38 1 40" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M22 64C20 44 40 34 60 38C74 41 84 52 82 62C80 75 60 79 44 77C30 76 22 72 22 64z" fill="url(#${u}f)"/>
<g stroke="${l}" stroke-width="1.3" stroke-linecap="round" opacity="${soft?.3:.55}" fill="none">${fur}</g>
<ellipse cx="34" cy="71" rx="10" ry="6.5" fill="${sh(col,-.15)}"/><ellipse cx="30" cy="78" rx="5" ry="2.4" fill="${pink}"/><ellipse cx="62" cy="78" rx="4.5" ry="2.2" fill="${pink}"/>
<path d="M64 42C70 30 86 32 94 45C97 51 93 56 86 57C77 59 66 54 64 42z" fill="url(#${u}f)"/>
<ellipse cx="69" cy="33" rx="9" ry="10" fill="${sh(col,-.1)}" stroke="${d}" stroke-width="1"/><ellipse cx="69.5" cy="34.5" rx="5" ry="6.2" fill="${inner}" opacity=".85"/>
<circle cx="82" cy="44" r="2.8" fill="#121212"/><circle cx="83" cy="43" r=".9" fill="#fff"/><circle cx="95" cy="48" r="2.2" fill="${soft?sh(col,-.3):'#d27885'}"/>
<g stroke="${drLum(col)<.35?'#9a9088':'#6b5a45'}" stroke-width=".7" opacity="${soft?.35:.8}"><path d="M90 49l9-4M90 50.5l10 0M90 52l9 4"/></g>`;}
  if(c==='beetle'){const striped=k==='B'&&L.name.startsWith('Striped');
    return `<defs><radialGradient id="${u}e" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${l}"/><stop offset=".55" stop-color="${col}"/><stop offset="1" stop-color="${d}"/></radialGradient>
<clipPath id="${u}c"><path d="M50 38C34 38 28 52 29 64C30 80 40 90 50 91C60 90 70 80 71 64C72 52 66 38 50 38z"/></clipPath></defs>
<ellipse cx="50" cy="92" rx="22" ry="3.5" fill="#000" opacity="${so}"/>
<g stroke="${soft?sh(col,-.35):'#1b1916'}" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M33 46l-12-6-4-8M31 60H17l-6 6M33 74l-12 8-2 8M67 46l12-6 4-8M69 60h14l6 6M67 74l12 8 2 8"/><path d="M45 12l-6-8M55 12l6-8" stroke-width="1.6"/></g>
<ellipse cx="50" cy="17" rx="8" ry="7" fill="${sh(col,-.6)}"/>
<path d="M36 30C36 22 64 22 64 30C64 36 58 39 50 39C42 39 36 36 36 30z" fill="${sh(col,-.25)}"/>
<path d="M50 38C34 38 28 52 29 64C30 80 40 90 50 91C60 90 70 80 71 64C72 52 66 38 50 38z" fill="url(#${u}e)"/>
${striped?`<g clip-path="url(#${u}c)" fill="#2a1d0c" opacity=".88"><path d="M20 50q30 -8 60 0v7q-30 -8 -60 0z"/><path d="M20 66q30 -8 60 0v7q-30 -8 -60 0z"/><path d="M20 81q30 -8 60 0v8q-30 -8 -60 0z"/></g>`:''}
<path d="M50 39V90" stroke="${sh(col,-.55)}" stroke-width="1.5"/>
<ellipse cx="41" cy="55" rx="4.5" ry="11" fill="#fff" opacity="${soft?.12:.32}" transform="rotate(-12 41 55)"/><ellipse cx="44" cy="28" rx="5" ry="2" fill="#fff" opacity=".25"/>`;}
  if(c==='finch'){const big=k==='B',p='#6f6052';
    return `<defs>${lg(u+'b',sh(p,.3),sh(p,-.3))}${lg(u+'k',sh(col,.3),sh(col,-.35))}</defs><ellipse cx="46" cy="88" rx="26" ry="3.5" fill="#000" opacity=".2"/>
<path d="M22 56L2 46l4 12-6 7 22-3z" fill="${sh(p,-.4)}"/>
<ellipse cx="44" cy="58" rx="26" ry="19" fill="url(#${u}b)"/><path d="M28 66c10 9 28 10 38 2-12 2-26 0-38-2z" fill="#e2d2b4" opacity=".75"/>
<path d="M24 52c8-11 26-13 36-3-6 9-24 13-36 3z" fill="${sh(p,-.25)}"/><path d="M30 53c6-4 14-5 21-2M32 57c6-3 13-3 18-1" stroke="${sh(p,.4)}" stroke-width="1.1" fill="none" opacity=".6"/>
<circle cx="67" cy="40" r="15" fill="url(#${u}b)"/>
${big?`<path d="M78 30C92 32 100 40 98 46C94 50 84 52 78 50Q74 40 78 30z" fill="url(#${u}k)" stroke="${sh(col,-.5)}" stroke-width="1"/><path d="M79 40.5L97 44" stroke="${sh(col,-.55)}" stroke-width="1.1"/>`
  :`<path d="M80 36L94 41L80 45z" fill="url(#${u}k)" stroke="${sh(col,-.5)}" stroke-width="1" stroke-linejoin="round"/>`}
<circle cx="70" cy="36" r="3.2" fill="#121212"/><circle cx="71" cy="35" r="1" fill="#fff"/>
<path d="M40 76l-3 10M52 76l2 10" stroke="#5b4636" stroke-width="2.4" stroke-linecap="round"/>`;}
  if(c==='germ'){const res=k==='B';
    return `<defs>${lg(u+'g',l,d)}</defs>
<path d="M86 50c5-6 8 6 13 0" stroke="${d}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M14 48c-5-6-8 6-13 0" stroke="${d}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
${res?`<rect x="10" y="33" width="80" height="34" rx="17" fill="${col}" opacity=".22"/>`:''}
<rect x="14" y="37" width="72" height="26" rx="13" fill="url(#${u}g)" stroke="${sh(col,-.5)}" stroke-width="${res?3:2}"/>
<g fill="${sh(col,-.35)}" opacity=".7"><circle cx="34" cy="49" r="3"/><circle cx="52" cy="53" r="2.4"/><circle cx="66" cy="47" r="3.2"/><circle cx="44" cy="45" r="1.6"/></g>
<rect x="22" y="40" width="44" height="5" rx="2.5" fill="#fff" opacity=".45"/>`;}
  /* bug: a leafhopper seen from above */
  return `<defs>${lg(u+'w',l,d,1,1)}</defs><ellipse cx="50" cy="92" rx="18" ry="3" fill="#000" opacity=".2"/>
<g stroke="#2b2a24" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M38 40l-12-8M37 52H22l-4 6M39 64l-12 10M62 40l12-8M63 52h15l4 6M61 64l12 10"/><path d="M45 16l-8-12M55 16l8-12" stroke-width="1.4"/></g>
<path d="M38 26Q50 8 62 26L60 32H40z" fill="${sh(col,-.2)}"/><circle cx="41" cy="24" r="3.6" fill="#7a1d12"/><circle cx="59" cy="24" r="3.6" fill="#7a1d12"/>
<path d="M37 32H63L65 42H35z" fill="${sh(col,-.1)}"/>
<path d="M35 42H65L61 84Q50 96 39 84z" fill="url(#${u}w)" stroke="${d}" stroke-width="1"/>
<path d="M50 42V90M42 50l-2 26M58 50l2 26" stroke="${d}" stroke-width="1" opacity=".6"/>
<path d="M40 46q4 12 2 30" stroke="#fff" stroke-width="2.2" fill="none" opacity=".3" stroke-linecap="round"/>`;
}
const drSoft=(L,k)=>drHunt(L)&&L['w'+k]>L['w'+(k==='A'?'B':'A')];
const drSym=(L,k,id)=>`<symbol id="${id}" viewBox="0 0 100 100" overflow="visible">${drArt(L,k,id+'x',drSoft(L,k))}</symbol>`;

/* ---- habitat backgrounds: drawn once as an image, so taps never repaint the texture ---- */
const DR_BGURL={};
function drBgUrl(hab){if(!DR_BGURL[hab])DR_BGURL[hab]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(drBgSvg(hab));return DR_BGURL[hab];}
function drBgSvg(hab){
  const W=DR_W,H=DR_H,R=drRng(hab.length*977+hab.charCodeAt(0)*31),r=(a,b)=>a+R()*(b-a),pk=a=>a[Math.floor(R()*a.length)];
  const f=n=>n.toFixed(1);
  let s='',defs='';
  const grad=(id,stops,v)=>{defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="${v?0:1}" y2="${v?1:0}">${stops.map((c,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient>`;return `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;};
  const grain=(dark,light,fq)=>{defs+=`<filter id="gd" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${fq}" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -1.2"/></filter>
<filter id="gl" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${fq}" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 2.4 0 0 -1.25"/></filter>`;
    return `<rect width="${W}" height="${H}" filter="url(#gd)" opacity="${dark}"/><rect width="${W}" height="${H}" filter="url(#gl)" opacity="${light}"/>`;};
  const vign=op=>{defs+=`<radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient>`;return `<rect width="${W}" height="${H}" fill="url(#vg)"/>`;};
  const wob=(x0,dx,step)=>{let x=x0,d=`M${f(x)} -10`;for(let y=20;y<=H+20;y+=step){x+=r(-dx,dx);d+=` L${f(x)} ${y}`;}return d;};
  if(hab==='bark'){
    s+=grad('b',['#2f2a26','#3a342f','#2b2724','#36302b','#2a2623']);
    for(let i=0;i<70;i++){const w=r(14,34);s+=`<rect x="${f(r(-10,W))}" y="${f(r(-40,H))}" width="${f(w)}" height="${f(r(50,150))}" rx="${f(w/2)}" fill="${pk(['#423b35','#3d3631','#47403a','#322c28'])}" opacity="${f(r(.35,.7))}"/>`;}
    for(let i=0;i<36;i++){const d=wob(r(0,W),7,26);s+=`<path d="${d}" stroke="#15120f" stroke-width="${f(r(2,8))}" fill="none" opacity=".85" stroke-linejoin="round"/><path d="${d}" transform="translate(${f(r(3,5))} 0)" stroke="#5a524b" stroke-width="1.1" fill="none" opacity=".3"/>`;}
    for(let i=0;i<34;i++){const x=r(0,W),y=r(0,H),a=r(-30,30),sc=r(.7,1.3);s+=`<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(sc)})" fill="#1f1c1a" opacity=".75"><ellipse cx="-8" cy="0" rx="10" ry="6.5"/><ellipse cx="8" cy="0" rx="10" ry="6.5"/></g>`;}
    for(let i=0;i<60;i++)s+=`<circle cx="${f(r(0,W))}" cy="${f(r(0,H))}" r="${f(r(.6,2.2))}" fill="${pk(['#5b6152','#4d4a43'])}" opacity=".45"/>`;
    s+=grain(.5,.18,.85)+vign(.45);
  }else if(hab==='birch'){
    s+=grad('b',['#efebe2','#e4dfd3','#ebe7dd','#ddd6c8'],0);
    for(let i=0;i<40;i++){const x=r(0,W);s+=`<path d="M${f(x)} 0 V${H}" stroke="#cfc8b9" stroke-width="${f(r(.6,2))}" opacity=".45"/>`;}
    for(let i=0;i<26;i++){const x=r(0,W),y=r(0,H);for(let k=0;k<7;k++)s+=`<circle cx="${f(x+r(-12,12))}" cy="${f(y+r(-8,8))}" r="${f(r(3,8))}" fill="${pk(['#d2d5c6','#f2f0e8','#c5cab6','#e6e3d6'])}" opacity=".75"/>`;}
    for(let i=0;i<150;i++){const x=r(0,W),y=r(0,H),l=r(6,30),w=r(1.2,3.2);s+=`<path d="M${f(x)} ${f(y)} q${f(l/2)} ${f(r(-1.5,1.5))} ${f(l)} 0" stroke="${pk(['#4a443d','#5c554c','#3a352f'])}" stroke-width="${f(w)}" fill="none" stroke-linecap="round" opacity="${f(r(.45,.8))}"/>`;}
    for(let i=0;i<8;i++){const x=r(20,W-20),y=r(20,H-20),z=r(14,30);s+=`<path d="M${f(x-z)} ${f(y)} Q${f(x)} ${f(y-z*.6)} ${f(x+z)} ${f(y)} Q${f(x)} ${f(y-z*.15)} ${f(x-z)} ${f(y)}z" fill="#26231f" opacity=".85"/>`;}
    for(let i=0;i<10;i++){const x=r(0,W),y=r(0,H);s+=`<path d="M${f(x)} ${f(y)} q14 -6 28 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><path d="M${f(x)} ${f(y+2.5)} q14 -6 28 0" stroke="#b8b0a0" stroke-width="1.2" fill="none" opacity=".6"/>`;}
    s+=grain(.18,.25,.9)+vign(.22);
  }else if(hab==='sand'){
    s+=grad('b',['#f8f3e8','#f1e9d8','#ebe1cb'],1);
    for(let y=8;y<H+10;y+=r(13,19)){let d=`M-10 ${f(y)}`;for(let x=-10;x<W+40;x+=40)d+=` q20 ${f(r(-6,6))} 40 0`;s+=`<path d="${d}" stroke="#d6c7a9" stroke-width="3.2" fill="none" opacity=".55"/><path d="${d}" transform="translate(0 -3)" stroke="#fffbf2" stroke-width="2" fill="none" opacity=".85"/>`;}
    for(let i=0;i<34;i++){const x=r(0,W),y=r(0,H),rx=r(14,26),ry=r(7,12);s+=`<ellipse cx="${f(x)}" cy="${f(y+ry*.5)}" rx="${f(rx)}" ry="${f(ry*.6)}" fill="#cbbb9a" opacity=".35"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${pk(['#eadcc0','#efe3cb','#e4d4b6'])}" opacity=".9"/><ellipse cx="${f(x-rx*.3)}" cy="${f(y-ry*.35)}" rx="${f(rx*.4)}" ry="${f(ry*.3)}" fill="#fffaf0" opacity=".6"/>`;}
    for(let i=0;i<60;i++)s+=`<ellipse cx="${f(r(0,W))}" cy="${f(r(0,H))}" rx="${f(r(1.2,4))}" ry="${f(r(1,3))}" fill="${pk(['#d9cdb4','#c8b89a','#fff8ea','#bfae8e'])}"/>`;
    [[30,H-10],[W-40,H-6],[W-120,40],[90,60]].forEach(([x,y])=>{for(let k=0;k<9;k++){const a=r(-55,55)*Math.PI/180,l=r(26,46);s+=`<path d="M${x} ${y} q${f(Math.sin(a)*l*.3)} ${f(-l*.5)} ${f(Math.sin(a)*l)} ${f(-Math.cos(a)*l)}" stroke="${pk(['#b5a36a','#9c9455','#c9b880'])}" stroke-width="2" fill="none" stroke-linecap="round"/>`;}});
    s+=grain(.2,.35,1.1)+vign(.16);
  }else if(hab==='lava'){
    s+=grad('b',['#211e1d','#272322','#1d1a19'],1);
    const cw=52,ch=44;
    for(let gy=-1;gy<H/ch+1;gy++)for(let gx=-1;gx<W/cw+1;gx++){const cx=gx*cw+cw/2+r(-16,16),cy=gy*ch+ch/2+r(-14,14),n=7,sc=r(.75,1.35);let pts=[];
      for(let k=0;k<n;k++){const a=k/n*6.283+r(-.35,.35),rr=r(.36,.66)*sc;pts.push([cx+Math.cos(a)*cw*rr,cy+Math.sin(a)*ch*rr]);}
      const d='M'+pts.map(p=>f(p[0])+' '+f(p[1])).join(' L')+'z';
      s+=`<path d="${d}" fill="${pk(['#24211f','#2a2725','#2f2b29','#262322','#312d2a'])}" stroke="#0e0c0b" stroke-width="${f(r(1.2,3.4))}" stroke-linejoin="round"/><path d="M${f(pts[3][0])} ${f(pts[3][1])} L${f(pts[4][0])} ${f(pts[4][1])} L${f(pts[5][0])} ${f(pts[5][1])}" stroke="#4d4845" stroke-width="1.1" fill="none" opacity=".45"/>`;}
    for(let i=0;i<40;i++){let x=r(0,W),y=r(0,H),d=`M${f(x)} ${f(y)}`;for(let k=0;k<5;k++){x+=r(-18,18);y+=r(-14,14);d+=` L${f(x)} ${f(y)}`;}s+=`<path d="${d}" stroke="#0c0a09" stroke-width="${f(r(.6,1.6))}" fill="none" opacity=".8"/>`;}
    for(let i=0;i<12;i++){const x=r(0,W),y=r(0,H);for(let k=0;k<4;k++)s+=`<path d="M${f(x-20)} ${f(y+k*5)} q20 ${f(-8-k)} 40 0" stroke="#3b3734" stroke-width="1.6" fill="none" opacity=".45"/>`;}
    for(let i=0;i<170;i++)s+=`<circle cx="${f(r(0,W))}" cy="${f(r(0,H))}" r="${f(r(.7,2.2))}" fill="#0b0a09" opacity=".8"/>`;
    for(let i=0;i<50;i++)s+=`<circle cx="${f(r(0,W))}" cy="${f(r(0,H))}" r="${f(r(.4,1))}" fill="#9aa3ad" opacity=".35"/>`;
    s+=grain(.35,.16,.95)+vign(.4);
  }else if(hab==='soil'){
    s+=grad('b',['#3f3329','#342a22','#2d241d'],1);
    for(let i=0;i<110;i++){const x=r(0,W),y=r(0,H),rx=r(6,18),c=pk(['#4a3d31','#3a2f26','#2c241d','#544537','#45382c']);s+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(rx*r(.6,.9))}" fill="${c}" opacity="${f(r(.55,.95))}"/><ellipse cx="${f(x-rx*.25)}" cy="${f(y-rx*.3)}" rx="${f(rx*.45)}" ry="${f(rx*.22)}" fill="#6a5745" opacity=".35"/>`;}
    for(let i=0;i<22;i++)s+=`<ellipse cx="${f(r(0,W))}" cy="${f(r(0,H))}" rx="${f(r(7,10))}" ry="${f(r(10,13))}" transform="rotate(${f(r(0,180))})" transform-origin="center" fill="#28221d" opacity=".85"/>`;
    for(let i=0;i<9;i++){const x=r(0,W);s+=`<path d="M${f(x)} ${f(r(0,H))} q${f(r(-60,60))} ${f(r(20,60))} ${f(r(-90,90))} ${f(r(40,100))}" stroke="#5c4838" stroke-width="${f(r(1,2.4))}" fill="none" opacity=".7"/>`;}
    for(let i=0;i<44;i++){const x=r(0,W),y=r(0,H),z=r(1.5,4.5);s+=`<ellipse cx="${f(x+1)}" cy="${f(y+1.5)}" rx="${f(z)}" ry="${f(z*.75)}" fill="#1a1512" opacity=".6"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(z)}" ry="${f(z*.75)}" fill="${pk(['#8a7a66','#a08f78','#776753'])}"/>`;}
    s+=grain(.4,.12,.9)+vign(.38);
  }else if(hab==='leaf'){
    s+=grad('b',['#e3f1cf','#d5eabd','#c7e1a9'],0);
    [[150,190,260,-25],[520,150,280,20],[380,330,240,-8]].forEach(([x,y,len,a],i)=>{
      s+=`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M${-len} 0C${-len*.5} ${-len*.55} ${len*.5} ${-len*.55} ${len} 0C${len*.5} ${len*.55} ${-len*.5} ${len*.55} ${-len} 0z" fill="${['#d2e9b6','#cbe5ad','#d9eec0'][i]}" stroke="#b3d48e" stroke-width="2"/>
<path d="M${-len} 0H${len}" stroke="#aacd84" stroke-width="3"/>${Array.from({length:7},(_,k)=>{const x0=-len*.75+k*len*.25;return `<path d="M${f(x0)} 0q${f(len*.12)} -30 ${f(len*.24)} -60M${f(x0)} 0q${f(len*.12)} 30 ${f(len*.24)} 60" stroke="#b6d692" stroke-width="1.6" fill="none"/>`;}).join('')}</g>`;});
    for(let i=0;i<22;i++)s+=`<circle cx="${f(r(0,W))}" cy="${f(r(0,H))}" r="${f(r(10,34))}" fill="#fffbe0" opacity=".14"/>`;
    s+=grain(.06,.2,.8)+vign(.15);
  }else if(hab==='seeds'){
    s+=grad('b',['#d4bf95','#c5ac7e','#b39a6c'],1);
    for(let i=0;i<46;i++){let x=r(0,W),y=r(0,H),d=`M${f(x)} ${f(y)}`;for(let k=0;k<4;k++){x+=r(-30,30);y+=r(-24,24);d+=` L${f(x)} ${f(y)}`;}s+=`<path d="${d}" stroke="#8d7550" stroke-width="${f(r(1,2.6))}" fill="none" opacity=".7" stroke-linejoin="round"/>`;}
    for(let i=0;i<50;i++)s+=`<ellipse cx="${f(r(0,W))}" cy="${f(r(0,H))}" rx="${f(r(1.5,5))}" ry="${f(r(1,3.5))}" fill="${pk(['#a28c66','#8e7a59','#e0d0ac'])}"/>`;
    s+=grain(.22,.2,1)+vign(.25);
  }else if(hab==='dish'){
    s+=grad('b',['#e3e9f3','#d3dceb','#c3cede'],1);
    for(let x=0;x<W;x+=90)s+=`<path d="M${x} 0V${H}" stroke="#b9c5d8" stroke-width="1.2" opacity=".6"/>`;
    defs+=`<radialGradient id="ag" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#fbf0c6"/><stop offset=".7" stop-color="#f0d995"/><stop offset="1" stop-color="#ddbf6e"/></radialGradient>`;
    s+=`<ellipse cx="368" cy="${DR_H/2+16}" rx="186" ry="176" fill="#0b1430" opacity=".18"/><circle cx="360" cy="${DR_H/2+6}" r="178" fill="#f4f7fb" stroke="#aebbd0" stroke-width="2"/><circle cx="360" cy="${DR_H/2+6}" r="168" fill="url(#ag)"/>`;
    for(let i=0;i<30;i++){const a=r(0,6.283),q=Math.sqrt(R())*150;s+=`<circle cx="${f(360+Math.cos(a)*q)}" cy="${f(DR_H/2+6+Math.sin(a)*q)}" r="${f(r(1,3))}" fill="#e2c57a" opacity=".6"/>`;}
    s+=`<path d="M248 70A168 168 0 0 1 430 40" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="360" cy="${DR_H/2+6}" r="173" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`;
    s+=`<rect x="600" y="300" width="96" height="30" rx="4" fill="#fff" transform="rotate(-8 648 315)" opacity=".9"/><text x="648" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#3a4a66" transform="rotate(-8 648 315)">Sample 7B</text>`;
    s+=grain(.06,.12,1)+vign(.18);
  }else if(hab==='farm'){
    s+=grad('b',['#7c5b3d','#6f5136','#634830'],1);
    for(let row=0;row<6;row++){const y=34+row*64;
      s+=`<path d="M-10 ${y+22}H${W+10}" stroke="#4f3924" stroke-width="10" opacity=".45"/><path d="M-10 ${y-4}H${W+10}" stroke="#8a6849" stroke-width="5" opacity=".4"/>`;
      for(let x=r(10,40);x<W+20;x+=r(52,70)){for(let k=0;k<5;k++){const a=k*72+r(-15,15);s+=`<g transform="translate(${f(x)} ${y}) rotate(${f(a)})"><path d="M0 0C6 -6 22 -8 30 -2C22 6 6 6 0 0z" fill="${pk(['#6cb04f','#5ea446','#78bb5a'])}"/><path d="M2 -1L28 -2" stroke="#9dd47f" stroke-width="1"/></g>`;}s+=`<circle cx="${f(x)}" cy="${y}" r="4" fill="#4b8a36"/>`;}}
    s+=grain(.3,.12,.9)+vign(.3);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${s}</svg>`;
}

/* ---- small icons for the side panel and cards ---- */
const drUse=(id,sz)=>svgEl(`<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" aria-hidden="true"><use href="#${id}"/></svg>`);
function drCardIc(k){
  if(k==='sun')return Art.sprite('sun',{size:42});
  if(k==='pill')return `<svg viewBox="0 0 100 100" width="42" height="42" aria-hidden="true"><g transform="rotate(-35 50 50)"><rect x="16" y="34" width="68" height="32" rx="16" fill="#fff" stroke="#9aa9c4" stroke-width="2"/><path d="M50 34h18a16 16 0 0 1 0 32H50z" fill="#e2483f"/><rect x="24" y="39" width="22" height="6" rx="3" fill="#fff" opacity=".9"/><rect x="54" y="39" width="22" height="6" rx="3" fill="#fff" opacity=".45"/></g></svg>`;
  return `<svg viewBox="0 0 100 100" width="42" height="42" aria-hidden="true"><rect x="47" y="56" width="6" height="40" fill="#8a6849"/><rect x="12" y="10" width="76" height="52" rx="8" fill="#fff" stroke="#c4302b" stroke-width="5"/><rect x="34" y="24" width="18" height="30" rx="4" fill="#5aa04a"/><rect x="38" y="18" width="10" height="7" fill="#555"/><path d="M48 20h8l4 -3" stroke="#555" stroke-width="3" fill="none"/><path d="M22 18L78 54" stroke="#c4302b" stroke-width="6" stroke-linecap="round"/></svg>`;
}
const DR_CUR={
  bird:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='26' cy='26' r='11' fill='%232f6bff' stroke='white' stroke-width='2.5'/%3E%3Cpath d='M3 3L21 15L15 21Z' fill='%23ffb703' stroke='%23a35f00' stroke-width='1.6' stroke-linejoin='round'/%3E%3Ccircle cx='27' cy='22' r='2.6' fill='%23141a2e'/%3E%3Ccircle cx='27.8' cy='21.2' r='.9' fill='white'/%3E%3C/svg%3E") 3 3, crosshair`,
  owl:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cellipse cx='27' cy='27' rx='10' ry='9' fill='%23ffcf5a' stroke='white' stroke-width='2.5'/%3E%3Cg stroke='%23222' stroke-width='3' stroke-linecap='round' fill='none'%3E%3Cpath d='M3 4Q9 16 20 21'/%3E%3Cpath d='M4 13Q12 20 20 23'/%3E%3Cpath d='M12 3Q15 13 22 19'/%3E%3C/g%3E%3C/svg%3E") 3 3, crosshair`
};

/* ---- the board: background image + prey layer + HUD ---- */
function drBuild(G){
  const L=G.L,S=G.st,u=Art.uid('dr'),wrap=document.createElement('div');
  S.ids={A:u+'a',B:u+'b'};
  wrap.className='drboard'+(drHunt(L)?'':' drdrop');
  if(!drHunt(L))wrap.setAttribute('aria-label',DR_ENV[L.hab].place);
  wrap.innerHTML=`<img class="drbg" alt="" draggable="false" src="${drBgUrl(L.hab)}">
<svg class="drlayer" viewBox="0 0 ${DR_W} ${DR_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The habitat and the ${DR_NOUN[L.crit][1]}">
<defs>${drSym(L,'A',S.ids.A)}${drSym(L,'B',S.ids.B)}</defs>
<g class="drdeco"></g><g class="drpop"></g><g class="drfx"></g>
<g class="drret" style="display:none"><circle r="20" fill="none" stroke="#fff" stroke-width="3"/><circle r="20" fill="none" stroke="#141a2e" stroke-width="1.2"/><path d="M-28 0h12M16 0h12M0-28v12M0 16v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g></svg>
<div class="drgenchip">Now</div>
<div class="drhud" hidden><span class="drtime"><i></i></span><span class="drbelly">Caught <b>0</b>/${DR_FULL}</span><span class="drdots">${'<i></i>'.repeat(DR_FULL)}</span></div>
<div class="drmsg" role="status" aria-live="polite"></div>`;
  const q=s=>wrap.querySelector(s);
  S.el={wrap,svg:q('.drlayer'),deco:q('.drdeco'),pop:q('.drpop'),fx:q('.drfx'),ret:q('.drret'),chip:q('.drgenchip'),hud:q('.drhud'),
    bar:q('.drtime i'),cnt:q('.drbelly b'),dots:[...wrap.querySelectorAll('.drdots i')],msg:q('.drmsg')};
  const leg=h('div',{class:'drlegend'});
  ['A','B'].forEach(k=>{const b=h('b',null,'0');S.el['n'+k]=b;leg.append(h('span',null,drUse(S.ids[k],34),L[k][0],b));});
  S.el.leg=leg;
  wrap.addEventListener('pointerdown',drPeck);
  wrap.addEventListener('keydown',drKey);
  if(L.hab==='seeds')drSeedDeco(S);
  if(L.hab==='farm'&&S.gen>0)drSign(S);
  drPlace(G,'');
}
function drSeedDeco(S){
  const R=drRng(77),r=(a,b)=>a+R()*(b-a),f=n=>n.toFixed(1);let s='';
  [[70,120],[640,100],[120,330],[600,320],[360,90],[380,330]].forEach(([x,y])=>{
    let g='',b='';for(let k=0;k<9;k++){const a=k*40+r(-12,12),l=r(18,30);const leaf=`<path transform="translate(${x} ${y}) rotate(${f(a)})" d="M0 0C6 -7 ${f(l*.7)} -8 ${f(l)} -1C${f(l*.7)} 6 6 6 0 0z"/>`;g+=leaf;b+=leaf;}
    s+=`<g fill="#9a7a45" opacity=".9">${b}</g><g class="drgreen" fill="#5fae4a">${g}</g><circle cx="${x}" cy="${y}" r="5" fill="#6b5232"/>`;});
  for(let i=0;i<30;i++)s+=`<ellipse class="drsoft" cx="${f(r(20,DR_W-20))}" cy="${f(r(50,DR_H-14))}" rx="4" ry="2.6" transform="rotate(${f(r(0,180))})" transform-origin="center" fill="#a7d36a" stroke="#6f9a3a" stroke-width=".8"/>`;
  for(let i=0;i<14;i++){const x=r(20,DR_W-20),y=r(50,DR_H-14);s+=`<g transform="translate(${f(x)} ${f(y)}) rotate(${f(r(0,180))})"><ellipse rx="8" ry="6" fill="#6b4220" stroke="#3e240f" stroke-width="1.2"/><path d="M-6 0h12" stroke="#3e240f" stroke-width="1"/><ellipse cx="-2" cy="-2.5" rx="3" ry="1.4" fill="#fff" opacity=".3"/></g>`;}
  S.el.deco.innerHTML=s;if(S.dry)S.el.deco.classList.add('dry');
}
function drSign(S){if(S.el.deco.querySelector('.drsign'))return;S.el.deco.insertAdjacentHTML('beforeend',`<g transform="translate(606 34) scale(1.02)"><g class="drsign">${drCardIc('nospray').replace(/<\/?svg[^>]*>/g,'')}</g></g>`);}
function drSpots(L,n,sz){
  const out=[],m=sz*.55,top=sz*.5+40,dish=L.hab==='dish';let tries=0,minD=sz*.98;
  while(out.length<n&&tries<6000){tries++;
    let x,y;
    if(dish){const a=Math.random()*6.283,q=Math.sqrt(Math.random())*148;x=360+Math.cos(a)*q;y=DR_H/2+6+Math.sin(a)*q;}
    else{x=m+Math.random()*(DR_W-2*m);y=top+Math.random()*(DR_H-top-m);}
    if(x>DR_W-250&&y<top+10)continue;   /* keep the HUD corner clear */
    if(L.hab==='farm'&&x>580&&y<160)continue;   /* and the farm's sign */
    if(out.every(p=>Math.hypot(p.x-x,p.y-y)>=minD))out.push({x,y});
    if(tries%900===0)minD*=.86;}
  const spin=L.crit==='beetle'||L.crit==='bug'||L.crit==='germ';
  return out.map(p=>Object.assign(p,{r:spin?Math.random()*360:L.crit==='moth'?(Math.random()-.5)*50:(Math.random()-.5)*14,fl:!spin&&L.crit!=='moth'&&Math.random()<.5}));
}
function drPlace(G,mode){
  const L=G.L,S=G.st,N=DR_N[L.crit],nB=drCount(S.p,N),sz=DR_SZ[L.crit];
  const types=drShuf(Array(N-nB).fill('A').concat(Array(nB).fill('B')));
  const spots=drSpots(L,N,sz);
  S.prey=spots.map((p,i)=>Object.assign(p,{k:types[i],alive:true}));
  S.el.pop.innerHTML=S.prey.map((p,i)=>`<g class="drp${mode?' '+mode:''}" data-k="${p.k}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})" style="--r:${p.r.toFixed(0)}deg;--d:${mode==='hatch'?(i*.03).toFixed(2):0}s"><g class="drpi"><use href="#${S.ids[p.k]}" x="${-sz/2}" y="${-sz/2}" width="${sz}" height="${sz}"${p.fl?' transform="scale(-1 1)"':''}/></g></g>`).join('');
  [...S.el.pop.children].forEach((el,i)=>{S.prey[i].el=el;});
  drSync(G);
}
function drSync(G){
  const L=G.L,S=G.st;if(!S.el)return;
  ['A','B'].forEach(k=>{S.el['n'+k].textContent=S.prey.filter(p=>p.alive&&p.k===k).length;});
  S.el.chip.textContent=S.gen?`Generation ${S.gen}`:'Now';
  const hunting=!!S.hunting;S.el.wrap.classList.toggle('hunt',hunting);
  S.el.wrap.style.cursor=hunting?DR_CUR[drWho(L)]:'';
}
function drMsg(S,txt,ms){
  const m=S.el.msg;m.textContent=txt;m.classList.add('show');
  return new Promise(res=>setTimeout(()=>{if(m.textContent===txt)m.classList.remove('show');res();},ms));
}
const drScreen=(S,x,y)=>{const r=S.el.svg.getBoundingClientRect();return [r.left+x/DR_W*r.width,r.top+y/DR_H*r.height];};

/* ---- hunting ---- */
function drHuntGo(){
  const S=G.st,L=G.L;if(S.phase!=='play'||S.busy||!drHunt(L))return;
  S.busy=true;S.c={A:0,B:0};S.kx=DR_W/2;S.ky=DR_H/2;
  ngRender();
  const E=S.el;E.hud.hidden=false;E.bar.style.transform='scaleX(1)';E.cnt.textContent='0';E.dots.forEach(d=>d.classList.remove('on'));
  E.wrap.tabIndex=0;E.wrap.setAttribute('aria-label',`Hunting ground. Tap the ${DR_NOUN[L.crit][1]} you can see. Keyboard: arrow keys move, Space pecks.`);
  try{E.wrap.focus({preventScroll:true});}catch(e){}
  const who=drWho(L);
  ngSay(`**You are the ${who}!** Tap every ${DR_NOUN[L.crit][0]} you can spot. Your ${who} is full after ${DR_FULL}.`);
  const go=()=>{if(!G||G.st!==S)return;S.hunting=true;S.cool=0;S.tEnd=performance.now()+DR_TIME;drSync(G);drTick(S);};
  if(drRed()){go();return;}
  drMsg(S,'Ready…',650).then(()=>{if(!G||G.st!==S)return;drMsg(S,'Hunt!',500);go();});
}
function drTick(S){
  if(!G||G.st!==S||!S.hunting)return;
  const left=S.tEnd-performance.now();S.el.bar.style.transform=`scaleX(${Math.max(0,left/DR_TIME).toFixed(3)})`;
  if(left<=0)return drHuntEnd(S,'time');
  S.raf=requestAnimationFrame(()=>drTick(S));
}
function drPeck(e){
  const S=G&&G.key==='drift'?G.st:null;if(!S||!S.hunting||(e.button||0)>0)return;
  e.preventDefault();
  const r=S.el.svg.getBoundingClientRect();
  S.el.ret.style.display='none';
  drHit(S,(e.clientX-r.left)/r.width*DR_W,(e.clientY-r.top)/r.height*DR_H,e.pointerType==='touch'?Math.max(1.3,Math.min(2,520/r.width)):1);
}
function drKey(e){
  const S=G&&G.key==='drift'?G.st:null;if(!S||!S.hunting)return;
  const st=e.shiftKey?44:20,mv={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[e.key];
  if(mv){e.preventDefault();S.kx=Math.max(10,Math.min(DR_W-10,S.kx+mv[0]));S.ky=Math.max(10,Math.min(DR_H-10,S.ky+mv[1]));}
  else if(e.key===' '||e.key==='Enter'){e.preventDefault();drHit(S,S.kx,S.ky);}
  else return;
  S.el.ret.style.display='';S.el.ret.setAttribute('transform',`translate(${S.kx} ${S.ky})`);
}
function drHit(S,x,y,reach){
  const now=performance.now();if(now<S.cool)return;S.cool=now+160;
  const L=G.L,sz=DR_SZ[L.crit];let best=null,bd=sz*.46*(reach||1);   /* fingers get a bigger reach on small screens */
  S.prey.forEach(p=>{if(!p.alive)return;const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p;}});
  const [cx,cy]=drScreen(S,x,y);
  if(!best){
    S.tEnd-=400;
    S.el.fx.insertAdjacentHTML('beforeend',`<g class="drmiss" transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><circle r="14" fill="none" stroke="#fff" stroke-width="2.5"/><text y="-20" text-anchor="middle">-0.4 s</text></g>`);
    const m=S.el.fx.lastChild;setTimeout(()=>m.remove(),drRed()?250:600);
    return;
  }
  best.alive=false;S.c[best.k]++;
  const el=best.el;el.classList.add('caught');setTimeout(()=>el.remove(),drRed()?0:330);
  Art.burst(cx,cy,{n:14,colors:[L[best.k][1],'#ffffff',Art.shade(L[best.k][1],.4),'#ffd23f'],shape:['dot','ring','dot'],speed:190,gravity:280,life:.55,size:4.5});
  S.el.fx.insertAdjacentHTML('beforeend',`<text class="drplus" x="${x.toFixed(0)}" y="${(y-18).toFixed(0)}" text-anchor="middle">+1</text>`);
  const pl=S.el.fx.lastChild;setTimeout(()=>pl.remove(),drRed()?250:700);
  const n=S.c.A+S.c.B;Art.count(S.el.cnt,n,{dur:250});S.el.dots.slice(0,n).forEach(d=>d.classList.add('on'));
  drSync(G);
  if(n>=DR_FULL)drHuntEnd(S,'full');
}
function drHuntEnd(S,why){
  if(!S.hunting)return;S.hunting=false;cancelAnimationFrame(S.raf);
  const L=G.L,E=S.el;E.ret.style.display='none';E.wrap.removeAttribute('tabindex');drSync(G);
  drMsg(S,why==='full'?`Your ${drWho(L)} is full!`:'Time!',1000);
  const nA=S.prey.filter(p=>p.k==='A').length,nB=S.prey.length-nA;
  drSurvivors(S);
  /* One hunt is one patch of the island. k scales the student's catches so a bird that takes the
     easiest-to-see animals gives the same pressure as the model; catching hidden ones counts too. */
  const lo=L.wA<=L.wB?'A':'B',nV=lo==='A'?nA:nB,k=Math.max(.35,(1-Math.min(L.wA,L.wB)/Math.max(L.wA,L.wB))/Math.min(1,DR_FULL/Math.max(1,nV)));
  const sA=nA?Math.max(.1,1-k*S.c.A/nA):1,sB=nB?Math.max(.1,1-k*S.c.B/nB):1,a=S.p*sB,b=(1-S.p)*sA;
  S.log.push({nA,nB,cA:S.c.A,cB:S.c.B});
  S.nextP=drMut(a+b>0?a/(a+b):S.p);
  const hidA=nA-S.c.A,hidB=nB-S.c.B;
  ngSay(`You caught ${S.c.A+S.c.B}. The gold rings show who survived: ${hidA} ${L.A[0].toLowerCase()} and ${hidB} ${L.B[0].toLowerCase()}. Now the survivors have babies…`);
  ngRender();
  setTimeout(()=>drHatch(S),drRed()?350:1900);
}
function drSurvivors(S){
  const sz=DR_SZ[G.L.crit];
  S.prey.forEach(p=>{if(p.alive&&p.el.isConnected)p.el.insertAdjacentHTML('beforeend',`<circle class="drring" r="${(sz*.52).toFixed(0)}"/>`);});
}

/* ---- playing the environment ---- */
function drEnvGo(){
  const S=G.st,L=G.L,E=S.el,env=DR_ENV[L.hab];if(!S||S.phase!=='play'||S.busy||drHunt(L))return;
  S.busy=true;ngRender();
  const mx=Math.max(L.wA,L.wB),w={A:L.wA/mx,B:L.wB/mx},n={A:0,B:0},c={A:0,B:0};
  ['A','B'].forEach(k=>{const grp=S.prey.filter(p=>p.k===k);n[k]=grp.length;c[k]=Math.round(grp.length*(1-w[k]));drShuf(grp.slice()).slice(0,c[k]).forEach(p=>{p.alive=false;});});
  if(L.hab==='seeds'){S.dry=true;E.deco.classList.add('dry');}
  if(L.hab==='dish'){E.fx.insertAdjacentHTML('beforeend',`<circle class="drwave" cx="360" cy="${DR_H/2+6}" r="168"/>`);const wv=E.fx.lastChild;setTimeout(()=>wv.remove(),1400);}
  if(L.hab==='farm')drSign(S);
  drMsg(S,env.card+'!',900);
  const dying=S.prey.filter(p=>!p.alive);
  setTimeout(()=>{if(!G||G.st!==S)return;
    dying.forEach((p,i)=>{p.el.style.setProperty('--d',(i*.06).toFixed(2)+'s');p.el.classList.add(env.kill);});
    if(L.hab==='dish'&&!drRed())dying.slice(0,10).forEach((p,i)=>setTimeout(()=>{if(G&&G.st===S){const [x,y]=drScreen(S,p.x,p.y);Art.burst(x,y,{n:6,colors:[L.A[1],'#fff'],speed:120,gravity:80,life:.45,size:3.5});}},i*60));
    drSync(G);
    setTimeout(()=>{if(!G||G.st!==S)return;drSurvivors(S);},drRed()?0:700+dying.length*60);
  },drRed()?0:650);
  S.log.push({nA:n.A,nB:n.B,cA:c.A,cB:c.B});
  const p=S.p;S.nextP=p*L.wB/(p*L.wB+(1-p)*L.wA);
  const lines={seeds:`The drought left only big, hard seeds. ${c.A} small-beaked finch${c.A===1?'':'es'} could not crack them and flew off hungry.`,
    dish:`The antibiotic killed ${c.A} normal germ${c.A===1?'':'s'}. ${c.B?'':'Every resistant germ survived. '}Now the survivors divide…`,
    farm:c.B?`No spray this season. ${c.B} resistant insect${c.B===1?'':'s'} did not find enough food.`:'No spray this season. This time every insect found food.'};
  ngSay(lines[L.hab]);
  setTimeout(()=>drHatch(S),drRed()?400:2600);
}

/* ---- babies, fast forward ---- */
function drHatch(S){
  if(!G||G.st!==S)return;
  const L=G.L,surv={A:S.prey.filter(p=>p.alive&&p.k==='A').length,B:S.prey.filter(p=>p.alive&&p.k==='B').length};
  S.gen++;S.p=S.nextP;S.shown.push(S.p);
  S.el.hud.hidden=true;
  drPlace(G,'hatch');
  Art.pop(S.el.chip,1.25);
  /* a kind with no survivors can still appear through a rare mutation */
  ['A','B'].forEach(k=>{if(surv[k]===0){const m=S.prey.filter(p=>p.k===k);if(m.length){S.mutant=true;
    m.forEach(p=>p.el.insertAdjacentHTML('beforeend',`<text class="drmut" y="${-DR_SZ[L.crit]*.62}" text-anchor="middle">Mutation!</text>`));}}});
  S.busy=false;if(S.gen>=DR_HUNTS)S.phase='ff';
  ngRender();
  const pl=DR_NOUN[L.crit][1];
  if(S.gen<DR_HUNTS)ngSay(`**Generation ${S.gen}** is born. ${L.crit==='germ'?'Each germ divides into copies of itself.':'The babies look like their parents.'}${S.mutant?' A rare **mutation** made a new variation!':''} ${drHunt(L)?'Hunt again!':'The environment stays the same. Do it again.'}`);
  else ngSay(`Three generations done. ${drHunt(L)?`Real ${drWho(L)}s`:'The environment'} keep${drHunt(L)?'':'s'} doing this year after year. Press **Fast forward** to see where the ${pl} end up.`);
  S.mutant=false;
}
function drFF(){
  const S=G.st,L=G.L;if(S.phase!=='ff'||S.busy)return;S.busy=true;S.phase='ffing';ngRender();
  const step=()=>{if(!G||G.st!==S)return;
    if(S.gen>=L.gens){S.busy=false;S.phase='why';return drReveal(S);}
    const p=S.p;let q=p*L.wB/(p*L.wB+(1-p)*L.wA);if(drHunt(L))q=drMut(q);
    S.p=q;S.gen++;S.shown.push(q);drPlace(G,'quick');ngRender();
    setTimeout(step,drRed()?60:330);};
  setTimeout(step,drRed()?0:250);
}
function drReveal(S){
  const L=G.L,fi=drFocus(L);
  if(!S.ok1)G.miss++;if(!S.ok2)G.miss++;
  ngRender();
  const bad=(S.ok1?0:1)+(S.ok2?0:1);
  const mine=fi?S.p:1-S.p,model=drVals(L)[L.gens];
  const odd=drHunt(L)&&Math.abs(mine-model)>.2?` Your graph ended up different from the usual result. A real ${drWho(L)} catches whatever is easiest to see, over and over.`:'';
  ngSay((bad?`Your prediction${bad>1?'s were':' was'} not quite right (red). Look at the graph, then choose the best explanation.`:'Both predictions right! Now choose the best explanation.')+odd,bad?'alert':'go');
}

/* ---- the live graph ---- */
function drGraph(G){
  const L=G.L,S=G.st,fi=drFocus(L),n=L.gens,W=330,H=172,l=36,r=12,t=8,b=24,pw=W-l-r,ph=H-t-b;
  const X=i=>l+i*pw/n,Y=v=>t+ph-Math.max(0,Math.min(1,v))*ph,F=v=>v.toFixed(1);
  let s=`<rect x="${l}" y="${t}" width="${pw}" height="${ph}" rx="6" fill="#f7f9fd" stroke="#d5deee"/>`;
  s+=`<rect x="${l+1}" y="${t+1}" width="${F(X(DR_HUNTS)-l-1)}" height="${ph-2}" rx="5" fill="#fff1c9" opacity=".8"/><text x="${F((l+X(DR_HUNTS))/2)}" y="${(fi?L.p0:1-L.p0)>.6?t+ph-6:t+13}" text-anchor="middle" font-size="10" font-weight="800" fill="#a07311">${drHunt(L)?'YOU HUNTED':'YOU CHOSE'}</text>`;
  [0,.25,.5,.75,1].forEach(v=>{s+=`<line x1="${l}" x2="${l+pw}" y1="${F(Y(v))}" y2="${F(Y(v))}" stroke="#e1e8f4"/>`;if(v%.5===0)s+=`<text x="${l-5}" y="${F(Y(v)+3.5)}" text-anchor="end" font-size="10" fill="#6b7a99">${v*100}%</text>`;});
  [0,DR_HUNTS,n].forEach(i=>{s+=`<text x="${F(X(i))}" y="${t+ph+13}" text-anchor="middle" font-size="10" fill="#6b7a99">${i}</text>`;});
  s+=`<text x="${l+pw/2}" y="${H-2}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#6b7a99">Generation</text>`;
  if(S.q2&&S.phase!=='predict'){const pv=(drShapes(L).find(([k])=>k===S.q2)||[0,[]])[1];
    s+=`<polyline points="${pv.map((v,i)=>F(X(i))+','+F(Y(v))).join(' ')}" fill="none" stroke="#8a96b3" stroke-width="2.4" stroke-dasharray="6 5" stroke-linecap="round"/>`;}
  const vals=S.shown.map(p=>fi?p:1-p);
  if(vals.length>1)s+=`<polyline points="${vals.map((v,i)=>F(X(i))+','+F(Y(v))).join(' ')}" fill="none" stroke="#f0a020" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>`;
  vals.forEach((v,i)=>{const last=i===vals.length-1;s+=`<circle cx="${F(X(i))}" cy="${F(Y(v))}" r="${last?5.5:3.4}" fill="${last?'#ffd23f':'#f0a020'}" stroke="#fff" stroke-width="1.8"${last&&i?' class="drnew"':''}/>`;});
  if(vals.length)s+=`<text x="${F(Math.min(X(vals.length-1)+8,l+pw-4))}" y="${F(Math.max(t+24,Y(vals[vals.length-1])-9))}" text-anchor="${vals.length-1>n*.7?'end':'start'}" font-size="12" font-weight="900" fill="#b8750b" stroke="#fff" stroke-width="3" paint-order="stroke">${Math.round(vals[vals.length-1]*100)}%</text>`;
  return ngSvg(W,H,s,'ngchart drgraph','Graph of the population');
}
function drTally(G){
  const L=G.L,S=G.st,g=S.log[S.log.length-1];if(!g)return null;
  const row=k=>{const n=g['n'+k],sv=n-g['c'+k];return h('div',{class:'drtrow'},drUse(S.ids[k],24),h('span',null,L[k][0]),h('span',{class:'drtbar'},h('i',{style:`width:${n?Math.round(sv/n*100):0}%`})),h('b',null,n?`${sv} of ${n}`:'none'));};
  return h('div',{class:'drtally'},h('div',{class:'drtt'},`Generation ${S.log.length-1} → survivors`),row('A'),row('B'));
}

/* ---- side panel pieces ---- */
function drQ1(G,locked,mark){const L=G.L,S=G.st;
  return [h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),h('span',null,'Which kind will become more common?')),
    ngChoices([['A','More '+L.A[0].toLowerCase()],['B','More '+L.B[0].toLowerCase()],['N','Neither: it stays about the same']],S.q1,v=>{if(locked)return;S.q1=v;ngRender();},{cls:'col',locked,mark})];}
function drQ2(G,locked,mark){const L=G.L,S=G.st,fname=[L.A,L.B][drFocus(L)][0];
  const shapes=drOrder(L,drShapes(L)).map(([k,v])=>[k,[ngChart([{color:'#2f6bff',vals:v,w:3}],{w:120,h:64,left:4,bottom:4,label:'Graph choice'})]]);
  return [h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),h('span',null,`Which graph shows the ${fname.toLowerCase()}?`)),
    ngChoices(shapes,S.q2,v=>{if(locked)return;S.q2=v;ngRender();},{cls:'shapes',locked,mark})];}
function drWhyBtns(G,test){const L=G.L,S=G.st,right=L.why[0][0];
  return h('div',{class:'ppmc drwhy'},...drOrder(L,L.why).map(([v,t])=>h('button',{type:'button',
    class:'ngc wide'+(S.q3===v?' on':'')+(!test&&S.tried3.includes(v)&&v!==right?' no':'')+(!test&&S.q3ok&&v===right?' ok':''),
    disabled:test?false:(G.done||S.q3ok||S.tried3.includes(v)),onclick:()=>{if(test){S.q3=v;ngRender();}else drWhy(v);}},t)));}
function drRecap(G){
  const L=G.L,S=G.st,rev=S.phase==='why'||G.done;
  const q1t={A:'More '+L.A[0].toLowerCase(),B:'More '+L.B[0].toLowerCase(),N:'Stays the same'}[S.q1];
  const pv=(drShapes(L).find(([k])=>k===S.q2)||[0,[0,0]])[1];
  return h('div',{class:'drrecap'+(rev?(S.ok1&&S.ok2?' ok':' no'):'')},h('span',{class:'drrl'},'You said'),
    h('span',{class:'drrq'+(rev?(S.ok1?' ok':' no'):'')},q1t),
    h('span',{class:'drrg'+(rev?(S.ok2?' ok':' no'):'')},ngChart([{color:'#8a96b3',vals:pv,w:3}],{w:70,h:36,left:2,bottom:2,label:'Your graph choice'})));
}
function drSide(G){
  const L=G.L,S=G.st,fname=[L.A,L.B][drFocus(L)][0],kids=[];
  if(S.phase==='predict'){
    kids.push(S.el.leg,...drQ1(G,false),...drQ2(G,false));
    kids.push(ngBtn([I('play'),drHunt(L)?' Start the hunt':' Start'],drBegin,'good',{style:'width:100%;font-size:18px',disabled:!S.q1||!S.q2||G.done}));
    const who=drWho(L),pl=DR_NOUN[L.crit][1],env=DR_ENV[L.hab];
    const steps=drHunt(L)?[['eye',`Tap the ${pl} you can see. You have ${DR_TIME/1000} seconds, and your ${who} is full after ${DR_FULL}.`],['paw','The survivors have babies that look like them.'],['play',`Hunt ${DR_HUNTS} times, then fast forward.`]]
      :[['bulb',`Drag the ${env.card} card onto the ${env.place}.`],['eye',`Watch which ${pl} survive. ${L.crit==='germ'?'The survivors divide into more germs.':'The survivors have babies.'}`],['play',`Do it ${DR_HUNTS} times, then fast forward.`]];
    kids.push(h('ol',{class:'drsteps'},...steps.map(([ic,t])=>h('li',null,I(ic),h('span',null,t)))));
    return kids;
  }
  kids.push(drRecap(G));
  kids.push(h('div',{class:'osl'},`Percent that are ${fname.toLowerCase()}`),drGraph(G),
    h('div',{class:'drkey'},h('span',null,h('i'),'Population'),h('span',null,h('i',{class:'dash'}),'Your prediction')));
  if(S.phase==='play'||S.phase==='ff'||S.phase==='ffing'){
    kids.push(S.el.leg);
    const tl=drTally(G);if(tl)kids.push(tl);
    if(S.phase==='play'){
      if(drHunt(L))kids.push(ngBtn([I('play'),S.busy?' Hunting…':` Hunt again (round ${S.gen+1} of ${DR_HUNTS})`],drHuntGo,'good',{style:'width:100%;font-size:18px',disabled:S.busy}));
      else if(!drNarrow())kids.push(drCard(G));
    }else kids.push(ngBtn([I('play'),` Fast forward ${L.gens-DR_HUNTS} generations`],drFF,'good',{style:'width:100%;font-size:18px',disabled:S.phase==='ffing'}));
  }
  if(S.phase==='why'){
    kids.push(h('div',{class:'osl'},h('span',{class:'stepchip'},'3'),h('span',null,'Why did this happen?')),drWhyBtns(G,false));
  }
  return kids;
}
const drNarrow=()=>matchMedia('(max-width:900px)').matches;
function drCard(G){const L=G.L,S=G.st,env=DR_ENV[L.hab],card=h('div',{class:'drcard'+(S.busy?' used':''),'aria-label':env.card+' card. Drop it on the '+env.place+'.'});
  card.innerHTML=drCardIc(env.ic);card.append(h('span',null,env.card,h('small',null,S.busy?'Working…':`Drag me onto the ${env.place} · round ${S.gen+1} of ${DR_HUNTS}`)));
  return card;}
function drBegin(){
  const S=G.st,L=G.L;if(!S.q1||!S.q2||S.phase!=='predict')return;
  S.ok1=S.q1===drTruth(L);S.ok2=S.q2==='true';G.tries++;
  S.phase='play';
  if(drHunt(L))return drHuntGo();
  ngRender();drDragInit();
  ngSay(DR_ENV[L.hab].how);
}
let DR_DRAG=null;
function drDragInit(){
  if(DR_DRAG)return;
  DR_DRAG=Art.drag({root:$('s-ng'),items:'.drcard',targets:'.drdrop',
    accept:()=>!!(G&&G.key==='drift'&&G.st&&G.st.phase==='play'&&!G.st.busy),
    onDrop:()=>{if(G&&G.key==='drift')drEnvGo();},
    label:it=>it.getAttribute('aria-label')||'card'});
}

ngDef({key:'drift',name:'Island Drift',ic:'beetle',std:'MS-LS4-4 · LS4-6',subj:'life',
  short:'Hunt as a predator and watch natural selection change a population.',menuDesc:'You are the predator. Predict which variation takes over, hunt for 3 generations, then explain why.',
  intro:'Individuals in a population are not all the same. You play the predator (or the environment) and see which variations survive and have babies. Predict first, then play, then explain why. No mistakes earns 3 stars.',
  how:['**Predict** which kind becomes more common and pick the matching graph.','**Hunt!** You are the bird. Tap every animal you can spot before time runs out. Survivors have babies that look like them.','**Fast forward**, then choose **why** the population changed. Watch out for the trap answers!'],
  levels:DR_LEVELS,packs:DR_PACKS,cap3:true,winDelay:700,
  mini:L=>{const v=drVals(L);return svgEl(`<svg viewBox="0 0 44 28" width="48" height="32" aria-hidden="true"><rect width="44" height="28" rx="4" fill="${DR_BG[L.hab][0]}"/><polyline points="${v.map((x,i)=>`${3+i*38/(v.length-1)},${25-x*22}`).join(' ')}" fill="none" stroke="#f4b13a" stroke-width="2.6"/></svg>`);},
  start(G){if(DR_DRAG)DR_DRAG.cancel();G.st={q1:null,q2:null,q3:null,phase:'predict',gen:0,p:G.L.p0,shown:[G.L.p0],log:[],q3ok:false,tried3:[],busy:false,hunting:false};},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const S=G.st;
    if(!S.el)drBuild(G);
    drSync(G);
    if(ngT()){
      ngRC(main,S.el.wrap,S.el.leg,h('div',{class:'drtq2'},...drQ2(G,false)));
      ngRC(side,...drQ1(G,false),h('div',{class:'osl'},h('span',{class:'stepchip'},'3'),h('span',null,'Why will this happen?')),drWhyBtns(G,true),
        ngBtn('Turn in my answers',drTestDone,'good',{style:'width:100%;font-size:17px',disabled:!S.q1||!S.q2||!S.q3||G.done}));
      ngSay('Look at the habitat. Answer all three questions, then turn in your answers.');
      return;
    }
    /* on a phone the card sits right under the habitat, so it is a short drag */
    if(drNarrow()&&!drHunt(G.L)&&S.phase==='play')ngRC(main,S.el.wrap,drCard(G));
    else if(main.children[0]!==S.el.wrap||main.children.length!==1)ngRC(main,S.el.wrap);
    ngRC(side,...drSide(G));
    if(S.phase==='predict')ngSay(!S.q1||!S.q2?(drHunt(G.L)?'Look at the habitat. Which animals are easy to see? Make both predictions.':'Read what changed. Which kind does the new environment help? Make both predictions.'):`Predictions locked? Press **${drHunt(G.L)?'Start the hunt':'Start'}**!`);
  },
  hints(G){const L=G.L;return [L.clue,'Individuals do not change their traits to fit in. The ones that already have a helpful trait survive and have more offspring, so the population changes over many generations.',
    `The ${({A:L.A[0],B:L.B[0],N:'neither kind'})[drTruth(L)].toLowerCase()} ${drTruth(L)==='N'?'(no change)':'become more common'}. The right explanation is about who survives and reproduces.`];}
});
function drTestDone(){
  const L=G.L,S=G.st;if(!ngT()||!S.q1||!S.q2||!S.q3)return;
  ngTRound(S.q1===drTruth(L));ngTRound(S.q2==='true');ngTRound(S.q3===L.why[0][0]);ngTDone();
}
function drWhy(v){
  const L=G.L,S=G.st;if(S.q3ok||G.done||S.phase!=='why')return;S.q3=v;
  if(v===L.why[0][0]){S.q3ok=true;ngRender();ngSay('Exactly! '+L.why[0][1],'go');G.detail={mistakes:G.miss};
    ngWin(ngStars(G.miss,0,1),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);}
  else{S.tried3.push(v);G.miss++;ngRender();fx.pop({icon:'beetle',text:'That’s a trap!',kind:'oops'});
    ngSay('That is a common mistake. Individuals cannot change their traits because they need to. Think about who SURVIVES and has offspring.','alert');}
}
NGTHUMB.drift=()=>{
  let t=`<path d="M0 132q80-26 160-6t160-10v64H0z" fill="#e8d9a8"/><path d="M0 146q80-20 160-4t160-8v46H0z" fill="#d9c48a"/>`;
  t+=`<rect x="196" y="30" width="110" height="78" rx="8" fill="#f6efe0"/><polyline points="206,98 226,96 244,90 260,72 274,52 288,44 298,42" fill="none" stroke="#e2483f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  [[40,60,'#2d2a28'],[80,90,'#efe9dc'],[120,52,'#2d2a28'],[150,96,'#2d2a28'],[60,112,'#efe9dc']].forEach(([x,y,c])=>{t+=`<g transform="translate(${x} ${y}) scale(1.8)"><path d="M0 0C-10-10-15 0-13 6S-4 8 0 2C4 8 11 12 13 6S10-10 0 0z" fill="${c}" stroke="#555" stroke-width=".6"/></g>`;});
  t+=ngStar(296,154,7)+ngStar(24,24,6,'#f6efe0',.7);
  return ngWrap('drift','#2f6d63',t);
};
