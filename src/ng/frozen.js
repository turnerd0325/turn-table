/* ================= PHYSICS 2: KEEP IT FROZEN (MS-PS3-3, PS3-4) =================
   "Build the cooler": a cutaway cooler sits in a scene. Students drag materials from the tray into
   the wall, lid, paint and cold-pack slots (each has a cost), drag a gold marker to the hour they
   think it melts, then Test. Red heat particles creep through each wall at a speed set by the
   material (metal fast, foam slow), warm air pours through an open top, sunlight heats dark paint,
   the thermometer climbs, the cold pack shrinks and the ice cream softens, drips and melts at the
   hour the model gives. Pack 2 is a lab bench (mass and type of matter) and an investigate level
   (change ONE thing, run twice, compare). Heat always flows from hot to cold; good designs only
   slow it down. Hours come from kfHours (unchanged), so which designs pass is the same as before. */
const KF_OPT={
  wall:{lab:'Walls',o:{alu:['Aluminum',0.5,1],steel:['Steel',0.7,3],card:['Cardboard',2,2],wood:['Wood',3,2],foam:['Foam',8,4]}},
  lid:{lab:'Lid',o:{none:['No lid',3,0],thin:['Thin plastic lid',1.6,1],foam:['Foam lid',1,2]}},
  color:{lab:'Outside color',o:{black:['Black',12,0],blue:['Dark blue',8,0],white:['White',2,1]}},
  ice:{lab:'Ice pack',o:{small:['Small ice pack',40,1],big:['Big ice pack',80,3]}}
};
const KF_INFO={alu:'Metal: a heat conductor',steel:'Metal: a heat conductor',card:'Paper with air pockets',wood:'Wood: a fair insulator',foam:'Foam: full of trapped air',none:'Open top',thin:'Thin plastic',black:'Absorbs sunlight',blue:'Absorbs most sunlight',white:'Reflects sunlight',small:'A little cold to spare',big:'Lots of cold to spare'};
/* tray names and one-word notes */
const KF_TILE={wall:{alu:['Aluminum','metal'],steel:['Steel','metal'],card:['Cardboard','paper + air'],wood:['Wood','fair insulator'],foam:['Foam','trapped air']},
  lid:{none:['No lid','open top'],thin:['Thin lid','thin plastic'],foam:['Foam lid','trapped air']},
  color:{black:['Black','soaks up sun'],blue:['Dark blue','soaks up sun'],white:['White','reflects sun']},
  ice:{small:['Small pack','less cold'],big:['Big pack','more cold']}};
const KF_SOUP={small:['Small pot','less soup'],big:['Big pot','more soup']};
const KF_SLOT={wall:'Walls',lid:'Lid',color:'Paint',ice:'Cold pack'};
function kfHours(L,d){const w=KF_OPT.wall.o[d.wall][1],l=KF_OPT.lid.o[d.lid][1],sun=L.sun?KF_OPT.color.o[d.color][1]:0,cap=KF_OPT.ice.o[d.ice][1]*(L.capMul||1);
  const rate=Math.abs(L.Tin-L.Tout)/w*l+sun;return cap/rate;}
/* where the heat gets in (the parts add up to the same rate kfHours uses) */
function kfLeaks(L,d){const dT=Math.abs(L.Tin-L.Tout),w=KF_OPT.wall.o[d.wall][1],l=KF_OPT.lid.o[d.lid][1];
  const walls=dT/w,top=dT/w*(l-1),sun=L.sun?KF_OPT.color.o[d.color][1]:0;return {walls,top,sun,total:walls+top+sun};}
const kfCost=(L,d)=>L.choose.reduce((a,c)=>a+(d[c]?KF_OPT[c].o[d[c]][2]:0),0);
function kfDesigns(L){const cats=L.choose,res=[];const go=(k,d)=>{if(k===cats.length){res.push(Object.assign({},d));return;}Object.keys(L.opts&&L.opts[cats[k]]?L.opts[cats[k]].reduce((o,x)=>(o[x]=1,o),{}):KF_OPT[cats[k]].o).forEach(v=>{d[cats[k]]=v;go(k+1,d);});};
  go(0,Object.assign({},L.fixed));return res;}
const kfPass=(L,d)=>kfHours(L,d)>=L.goal&&(!L.budget||kfCost(L,d)<=L.budget);
const KFL=(name,story,o)=>Object.assign({name,story,type:'design',Tin:-10,Tout:30,sun:false,scene:'patio'},o);
const KF_LEVELS=[
  KFL('Insulator Test','Build the walls for a cooler that keeps ice cream frozen for 5 hours.',{goal:5,choose:['wall'],opts:{wall:['alu','steel','wood','foam']},fixed:{lid:'foam',color:'white',ice:'small'},
    intro:'Heat always moves from **warmer** things to **colder** things. A cooler cannot stop heat, but good walls can **slow it down**. Drag a wall material into the cooler, predict, then press **Test it**.',
    fact:'Metals are conductors: heat moves through them quickly. Foam is an insulator: it is full of tiny pockets of trapped air, and air moves heat very slowly.',
    clue:'Which wall material would feel warm to the touch, and which would feel cold, if you held it on a hot day? Metal moves heat fast.'}),
  KFL('Lid or Not?','The foam cooler needs a lid. Keep the ice cream frozen for 7 hours.',{goal:7,choose:['lid'],fixed:{wall:'foam',color:'white',ice:'small'},
    fact:'An open top lets warm air flow right in. That is convection: heat moving with flowing air or liquid. A tight insulated lid stops it.',
    clue:'Warm air can flow in through any opening. Which lid blocks the air AND insulates?'}),
  KFL('Beach Day','Bright sun on the beach, 35°C. Keep it frozen for 5 hours.',{goal:5,Tout:35,sun:true,scene:'beach',choose:['color'],fixed:{wall:'foam',lid:'foam',ice:'small'},
    fact:'Dark colors absorb more of the Sun’s energy (radiation), and light colors reflect more. That is why light clothes feel cooler in summer.',
    clue:'Which color shirt feels hotter on a sunny day?'}),
  {name:'Cocoa Cool-Down',story:'Two mugs of hot cocoa sit in a 20°C room.',type:'predict',bench:'cocoa',rounds:[
      {q:'A small cup (100 g) and a big pot (500 g) of cocoa both start at 70°C. Which cools down to room temperature first?',opts:[['small','The small cup'],['big','The big pot'],['same','Both at the same time']],ans:'small',
        a:['Small cup (100 g)',[70,52,40,32,27,24,22,21,20.5,20.2,20]],b:['Big pot (500 g)',[70,64,58,53,48,44,40,37,34,32,30]],why:'The small cup has less mass, so it has less thermal energy to lose. It cools faster.'},
      {q:'By the time BOTH reach room temperature, which one gave off more heat energy to the room?',opts:[['big','The big pot'],['small','The small cup'],['same','They gave off the same amount']],ans:'big',why:'Both cooled by 50°C, but the big pot has 5 times the mass, so it gave off about 5 times as much energy.'}],
    intro:'Pick your prediction, then press **Run it** and watch the thermometers.',fact:'The energy needed to change temperature depends on the mass. More mass means more energy is transferred for the same temperature change.',
    clue:'More mass means more matter to warm up or cool down.'},
  {name:'Sand vs Water',story:'A heat lamp shines on 1 kg of sand and 1 kg of water for 10 minutes.',type:'predict',bench:'lamp',rounds:[
      {q:'Both start at 20°C and get the same energy from the lamp. Which one gets hotter?',opts:[['sand','The sand'],['water','The water'],['same','They warm up the same']],ans:'sand',
        a:['Sand',[20,24,28,32,36,40,44,47,50,53,56]],b:['Water',[20,21,22,23,24,25,26,27,28,29,30]],why:'Water needs much more energy to warm up than sand does. With the same energy, the sand gets much hotter.'},
      {q:'On a sunny beach, why is the sand burning hot while the water is still cool?',opts:[['water','Water needs more energy to change temperature than sand.'],['wet','The water is wet, so it can’t get hot.'],['shade','The water is in the shade.']],ans:'water',why:'Different materials need different amounts of energy to change temperature. Water needs a lot.'}],
    fact:'Water can absorb a lot of energy with only a small temperature change. That is why oceans and lakes keep nearby places milder.',
    clue:'Same mass, same energy, different materials. Which material changes temperature more easily?'},
  {name:'Ice Pack Size',story:'Does a bigger ice pack keep ice cream frozen longer? Run a fair test.',type:'invest',Tin:-10,Tout:30,sun:false,scene:'lab',
    base:{wall:'foam',lid:'thin',color:'white',ice:'small'},choose:['wall','lid','ice'],opts:{wall:['wood','foam'],lid:['thin','foam']},test:'ice',
    rounds:[
      {q:'What did your fair test show?',opts:[['big','The big pack (800 g) kept it frozen about twice as long.'],['same','The size of the ice pack made no difference.'],['small','The small pack kept it frozen longer.']],ans:'big',
        why:'The big pack has 4 times the mass of ice, so it has to soak up much more heat before it all melts. Everything else stayed the same, so the ice pack caused the difference.'},
      {q:'One pot holds 1 liter of water and another holds 2 liters. Both are on the same burner. To warm each by 10°C, the 2-liter pot takes...',opts:[['twice','About twice as long'],['half','About half as long'],['same','The same time']],ans:'twice',why:'Twice the mass needs about twice the energy for the same temperature change, so it takes about twice as long.'}],
    intro:'A **fair test** changes only **one** thing. Run cooler A first. Then change ONE thing to test the ice pack, and run B.',
    fact:'Energy transferred = how much matter × how much the temperature changes × what kind of matter it is. Change any one and the energy changes.',
    clue:'A fair test changes only ONE thing. Keep everything else exactly the same.'},
  KFL('Picnic Planner','A shady park, 30°C. Keep it frozen for 6 hours on a $8 budget.',{goal:6,scene:'park',choose:['wall','lid','ice'],opts:{wall:['alu','card','foam']},fixed:{color:'white'},budget:8,
    fact:'Good engineers balance cost and performance. An insulated lid can matter as much as thick walls.',
    clue:'Spend your money where heat gets in the most. Metal walls are hopeless; which upgrades help most?'}),
  KFL('Delivery Truck','A sunny summer street, 38°C. Keep it frozen for 6 hours on a $10 budget.',{goal:6,Tout:38,sun:true,scene:'street',choose:['wall','lid','color','ice'],opts:{wall:['steel','wood','foam']},budget:10,
    fact:'Ice cream trucks use thick insulated walls, tight doors and light colors, and many have a freezer that removes heat using energy.',
    clue:'Sun, open lids and metal walls all let energy in. Fix the biggest leaks first.'}),
  KFL('Hot Soup','A freezing day at -10°C. Keep soup hot (above 60°C) for 4 hours on a $9 budget.',{goal:4,Tin:80,Tout:-10,capMul:1,scene:'snow',choose:['wall','lid','ice'],opts:{wall:['alu','card','wood','foam']},fixed:{color:'white'},budget:9,soup:true,
    intro:'Now heat flows **out** of the hot soup into the cold air. The same insulators slow it down. (The cold-pack slot holds the **soup pot** here: a bigger pot holds more hot soup.)',
    fact:'Insulators slow heat flow in both directions. A thermos keeps cold drinks cold AND hot drinks hot.',
    clue:'Does an insulator care which way the heat is moving?'})
];
const KF_PACKS={0:'Pack 1: Stop the heat',3:'Pack 2: Mass and matter',6:'Pack 3: Design on a budget'};

/* ---------------- geometry ---------------- */
const KF={W:720,H:400,x0:150,x1:470,yT:132,yB:322,t:28,lidY:100,SPAN:12,TX0:84,TX1:636,TY:372,N:44};
KF.cx0=KF.x0+KF.t;KF.cx1=KF.x1-KF.t;KF.cyB=KF.yB-KF.t;
const kfHX=hr=>KF.TX0+(KF.TX1-KF.TX0)*Math.max(0,Math.min(KF.SPAN,hr))/KF.SPAN;
const KF_K={alu:1,steel:.72,card:.26,wood:.18,foam:.065};       /* speed of heat through each wall */
const KF_KL={thin:.42,foam:.065};
const kfFmt=x=>(Math.round(x*10)/10).toFixed(1).replace(/\.0$/,'');

/* ---------------- textures (one set per board) ---------------- */
function kfDefs(){return `<defs>
<pattern id="kfpFoam" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#f5f8fd"/><circle cx="4" cy="4" r="3.1" fill="#fff" stroke="#d3dcea" stroke-width="1"/><circle cx="11" cy="10" r="2.6" fill="#fff" stroke="#d9e1ee" stroke-width="1"/><circle cx="11" cy="2.5" r="1.4" fill="#fff" stroke="#dde4f0" stroke-width=".8"/><circle cx="3" cy="11" r="1.6" fill="#fff" stroke="#dde4f0" stroke-width=".8"/></pattern>
<linearGradient id="kfpAlu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa6b8"/><stop offset=".35" stop-color="#f2f5fa"/><stop offset=".55" stop-color="#b9c3d2"/><stop offset=".8" stop-color="#eaeef5"/><stop offset="1" stop-color="#a3aec0"/></linearGradient>
<pattern id="kfpSteel" width="10" height="6" patternUnits="userSpaceOnUse"><rect width="10" height="6" fill="#7c8698"/><path d="M0 1.5h10M0 4.2h10" stroke="#98a2b3" stroke-width=".8"/><path d="M0 3h10" stroke="#667082" stroke-width=".6"/></pattern>
<pattern id="kfpCard" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="#cfa064"/><path d="M0 5q3-5 6 0t6 0" stroke="#a87a3e" stroke-width="1.6" fill="none"/><path d="M0 0h12M0 10h12" stroke="#b98a4e" stroke-width="1.2"/></pattern>
<pattern id="kfpWood" width="44" height="12" patternUnits="userSpaceOnUse"><rect width="44" height="12" fill="#b8793c"/><path d="M0 3q11-3 22 0t22 0M0 8q11 3 22 0t22 0" stroke="#965c25" stroke-width="1.1" fill="none"/><ellipse cx="30" cy="6" rx="3" ry="1.4" fill="none" stroke="#8a5220" stroke-width=".9"/></pattern>
<linearGradient id="kfpThin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9efff" stop-opacity=".95"/><stop offset="1" stop-color="#8cc4f0" stop-opacity=".85"/></linearGradient>
<linearGradient id="kfCav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3f3ff"/><stop offset="1" stop-color="#bfe1fb"/></linearGradient>
<linearGradient id="kfCavHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1e4"/><stop offset="1" stop-color="#ffd9bd"/></linearGradient>
<linearGradient id="kfPack" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe8ff"/><stop offset=".5" stop-color="#5bb9f5"/><stop offset="1" stop-color="#2b86d6"/></linearGradient>
<linearGradient id="kfTub" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e45d74"/><stop offset=".5" stop-color="#ff8fa2"/><stop offset="1" stop-color="#d2475f"/></linearGradient>
<radialGradient id="kfHeat"><stop offset="0" stop-color="#fff2c4"/><stop offset=".35" stop-color="#ff7a3c"/><stop offset="1" stop-color="#ff3b2f" stop-opacity="0"/></radialGradient>
<radialGradient id="kfSunP"><stop offset="0" stop-color="#fffbe0"/><stop offset=".4" stop-color="#ffc23a"/><stop offset="1" stop-color="#ff9a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="kfCold"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#8fdcff"/><stop offset="1" stop-color="#3fa9ff" stop-opacity="0"/></radialGradient>
<radialGradient id="kfSunG"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#ffe680" stop-opacity=".9"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
<linearGradient id="kfMerc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c81e1e"/><stop offset=".5" stop-color="#ff5a4a"/><stop offset="1" stop-color="#b51818"/></linearGradient>
</defs>`;}
const KF_WFILL={alu:'url(#kfpAlu)',steel:'url(#kfpSteel)',card:'url(#kfpCard)',wood:'url(#kfpWood)',foam:'url(#kfpFoam)'};
const KF_PAINT={black:'#22262e',blue:'#23468c',white:'#f7f9fc'};

/* a small swatch for a tray tile (own pattern ids so tiles never clash) */
let kfSwN=0;
function kfSwatch(cat,v,soup){const u='kfs'+(++kfSwN);let b='';
  if(cat==='wall'){const p={foam:`<pattern id="${u}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f5f8fd"/><circle cx="3" cy="3" r="2.3" fill="#fff" stroke="#c9d3e3"/><circle cx="8" cy="7.5" r="1.9" fill="#fff" stroke="#cfd8e6"/></pattern>`,
      alu:`<linearGradient id="${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa6b8"/><stop offset=".45" stop-color="#f7f9fc"/><stop offset=".6" stop-color="#b9c3d2"/><stop offset="1" stop-color="#e3e8f0"/></linearGradient>`,
      steel:`<pattern id="${u}" width="8" height="5" patternUnits="userSpaceOnUse"><rect width="8" height="5" fill="#7c8698"/><path d="M0 1.3h8M0 3.6h8" stroke="#9ea8b8" stroke-width=".8"/></pattern>`,
      card:`<pattern id="${u}" width="10" height="8" patternUnits="userSpaceOnUse"><rect width="10" height="8" fill="#cfa064"/><path d="M0 4q2.5-4 5 0t5 0" stroke="#a87a3e" stroke-width="1.4" fill="none"/></pattern>`,
      wood:`<pattern id="${u}" width="30" height="9" patternUnits="userSpaceOnUse"><rect width="30" height="9" fill="#b8793c"/><path d="M0 2.5q8-2.5 15 0t15 0M0 6.5q8 2.5 15 0t15 0" stroke="#935a24" stroke-width="1" fill="none"/></pattern>`}[v];
    b=`<defs>${p}</defs><rect x="2" y="2" width="32" height="32" rx="8" fill="url(#${u})" stroke="#5a6475" stroke-width="1.5"/>`+(v==='alu'||v==='steel'?'<path d="M8 8l8-4" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/>':'');}
  else if(cat==='lid')b=v==='none'?'<rect x="3" y="12" width="30" height="12" rx="4" fill="none" stroke="#8a97ad" stroke-width="2" stroke-dasharray="4 3"/><path d="M10 10q4-6 8 0t8 0" stroke="#ff7a4a" stroke-width="2" fill="none"/>'
    :v==='thin'?'<rect x="3" y="15" width="30" height="6" rx="3" fill="#a9d6fb" stroke="#4f8fd0" stroke-width="1.5"/><path d="M7 17h10" stroke="#fff" stroke-width="1.5" opacity=".8"/>'
    :`<defs><pattern id="${u}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#f5f8fd"/><circle cx="3" cy="3" r="2" fill="#fff" stroke="#c9d3e3"/></pattern></defs><rect x="2" y="10" width="32" height="16" rx="5" fill="url(#${u})" stroke="#5a6475" stroke-width="1.5"/>`;
  else if(cat==='color')b=`<defs><radialGradient id="${u}" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><path d="M6 8h24v20a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill="${KF_PAINT[v]}" stroke="#5a6475" stroke-width="1.5"/><ellipse cx="18" cy="8" rx="12" ry="3.5" fill="${KF_PAINT[v]}" stroke="#5a6475" stroke-width="1.5"/><rect x="6" y="8" width="24" height="24" rx="4" fill="url(#${u})"/>`;
  else b=soup?`<path d="M${v==='big'?3:8} 14h${v==='big'?30:20}v${v==='big'?14:11}a5 5 0 0 1-5 5H${v==='big'?8:13}a5 5 0 0 1-5-5z" fill="#8a94a6" stroke="#4a5262" stroke-width="1.4"/><ellipse cx="18" cy="14" rx="${v==='big'?15:10}" ry="3" fill="#d9772f"/>`
    :`<defs><linearGradient id="${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4f0ff"/><stop offset="1" stop-color="#2b86d6"/></linearGradient></defs><rect x="${v==='big'?6:11}" y="${v==='big'?3:13}" width="${v==='big'?24:14}" height="${v==='big'?30:20}" rx="4" fill="url(#${u})" stroke="#1f6fb8" stroke-width="1.4"/><text x="18" y="${v==='big'?22:27}" text-anchor="middle" font-size="${v==='big'?10:8}" fill="#fff" font-weight="900">❄</text>`;
  return svgEl(`<svg viewBox="0 0 36 36" width="34" height="34" aria-hidden="true">${b}</svg>`);}

/* ---------------- scenes ---------------- */
function kfScene(L){const W=KF.W,G0=300;let t='';
  const sky=(a,b)=>`<defs><linearGradient id="kfSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${KF.H}" fill="url(#kfSky)"/>`;
  const cloud=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity=".9"><ellipse cx="0" cy="0" rx="34" ry="13" fill="#fff"/><ellipse cx="-14" cy="-8" rx="16" ry="12" fill="#fff"/><ellipse cx="12" cy="-10" rx="18" ry="14" fill="#fff"/></g>`;
  const s=L.scene;
  if(s==='beach'){t+=sky('#4fb0ff','#cfeeff')+cloud(110,52,.9)+cloud(330,36,.7)+`<rect y="226" width="${W}" height="78" fill="#2a92d6"/><path d="M0 226h${W}v6H0z" fill="#7cd0ff"/><path d="M0 250q30-6 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0" stroke="#bfe8ff" stroke-width="2" fill="none" opacity=".6"/><path d="M0 ${G0}q180-14 360-6t360 2V${KF.H}H0z" fill="#f1d595"/><path d="M0 ${G0+18}q200-10 400-2t320 4" stroke="#e2c27c" stroke-width="2" fill="none"/>`
    +`<g transform="translate(640 296)"><path d="M0 0V-120" stroke="#f4f4f4" stroke-width="5"/><path d="M-62 -110q62-44 124 0z" fill="#ef476f"/><path d="M-62 -110q20-10 31 0q11-10 31 0q11-10 31 0q11-10 31 0" fill="#ffd166"/></g>`;}
  else if(s==='park'){t+=sky('#6cbcff','#e2f4ff')+cloud(120,48,.8)+cloud(300,30,.6)+`<path d="M0 ${G0-10}q180-20 360-6t360 0V${KF.H}H0z" fill="#69bb5f"/><path d="M0 ${G0+8}q200-12 400-4t320 4V${KF.H}H0z" fill="#58a84f"/>`
    +`<ellipse cx="380" cy="${G0+6}" rx="320" ry="26" fill="#2f7a35" opacity=".45"/><g transform="translate(650 300)"><path d="M-10 0q-4-80 4-150h12q8 70 4 150z" fill="#7a4b26"/><circle cx="-40" cy="-160" r="58" fill="#2f8f3a"/><circle cx="30" cy="-180" r="66" fill="#3aa346"/><circle cx="-70" cy="-210" r="48" fill="#37993f"/><circle cx="-10" cy="-238" r="54" fill="#45b052"/><circle cx="-120" cy="-170" r="42" fill="#2f8f3a"/></g>`;}
  else if(s==='street'){t+=sky('#58a8ff','#ffe9c2')+[[10,150,90],[110,110,70],[190,170,60],[560,130,80],[650,90,70]].map(([x,h,w],i)=>`<rect x="${x}" y="${230-h}" width="${w}" height="${h+10}" fill="${['#c9b8a6','#b9a693','#d6c6b4','#c3b09c','#ad9a86'][i]}"/>`+Array.from({length:Math.floor(h/26)},(_,r)=>Array.from({length:Math.floor(w/22)},(_,c)=>`<rect x="${x+8+c*22}" y="${240-h+r*26}" width="10" height="14" fill="#7fb7e6" opacity=".8"/>`).join('')).join('')).join('')
    +`<rect y="230" width="${W}" height="12" fill="#bfc5cf"/><rect y="242" width="${W}" height="${KF.H-242}" fill="#5b616c"/><path d="M0 ${G0+24}h${W}" stroke="#f2d04a" stroke-width="4" stroke-dasharray="40 26"/><path d="M0 ${G0+2}h${W}" stroke="#4b5059" stroke-width="2"/>`
    +`<path d="M0 252q20 4 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".25" class="kfshimmer"/>`;}
  else if(s==='snow'){t+=sky('#a9c6e2','#e9f2fb')+`<path d="M0 ${G0-14}q180-18 360-4t360-2V${KF.H}H0z" fill="#f7fbff"/><path d="M0 ${G0+10}q200-12 400-2t320 2" stroke="#d6e4f2" stroke-width="3" fill="none"/>`
    +`<g fill="#7a8fa8" opacity=".55"><path d="M560 286l40-110 40 110z"/><path d="M620 286l50-140 50 140z"/></g><g fill="#fff"><path d="M590 200l10-24 10 24z"/><path d="M658 180l12-34 12 34z"/></g>`
    +Array.from({length:26},(_,i)=>`<circle cx="${(i*97)%W}" cy="${(i*53)%270+10}" r="${1.4+i%3*.7}" fill="#fff" opacity=".9"/>`).join('');}
  else if(s==='lab'){t+=sky('#e6ecf6','#cfd9ea')+`<rect y="0" width="${W}" height="18" fill="#c3cde0"/>`+[0,1,2,3].map(i=>`<rect x="${40+i*170}" y="40" width="120" height="70" rx="6" fill="#dfe7f3" stroke="#b7c3d8" stroke-width="2"/><path d="M${50+i*170} 92h100" stroke="#b7c3d8" stroke-width="2"/>`).join('')
    +`<rect y="${G0-6}" width="${W}" height="16" fill="#8d99b0"/><rect y="${G0+10}" width="${W}" height="${KF.H}" fill="#6e7a92"/>`;}
  else{t+=sky('#7cc4ff','#e8f6ff')+cloud(100,46,.8)+cloud(310,30,.65)+cloud(560,60,.6)+`<rect y="250" width="${W}" height="10" fill="#c7a77d"/>`+Array.from({length:19},(_,i)=>`<rect x="${i*40-6}" y="190" width="28" height="64" rx="3" fill="#e6c79b" stroke="#c7a77d"/>`).join('')
    +`<rect y="${G0-14}" width="${W}" height="${KF.H}" fill="#d8c3a2"/>`+Array.from({length:10},(_,i)=>`<path d="M${i*80} ${G0-14}l-30 ${KF.H}" stroke="#c4ab86" stroke-width="2"/>`).join('')+`<path d="M0 ${G0+20}h${W}" stroke="#c4ab86" stroke-width="2"/>`;}
  return t;}

/* ---------------- the cooler (redrawn when a part changes) ---------------- */
function kfCooler(L,d,S){
  const {x0,x1,yT,yB,t,cx0,cx1,cyB}=KF,inv=L.type==='invest',soup=L.soup,hot=!!soup;
  const chosen=c=>(L.choose||[]).includes(c)&&!(inv&&S.phase==='A');
  const slotAttr=(c,lab)=>chosen(c)?` class="kfslot" data-cat="${c}" role="button" tabindex="-1" aria-label="${lab} slot"`:'';
  let o='';
  /* ground shadow */
  o+=`<ellipse cx="${(x0+x1)/2}" cy="${yB+6}" rx="${(x1-x0)/2+26}" ry="11" fill="#0b1430" opacity=".22"/>`;
  /* cavity */
  o+=`<rect x="${cx0}" y="${yT}" width="${cx1-cx0}" height="${cyB-yT}" fill="url(#${hot?'kfCavHot':'kfCav'})"/>`;
  if(!hot)o+=`<path d="M${cx0+4} ${cyB-2}h${cx1-cx0-8}" stroke="#fff" stroke-width="3" opacity=".7"/>`+[0,1,2,3,4].map(i=>`<path d="M${cx0+30+i*48} ${yT+8}l3 6l-3 6" stroke="#fff" stroke-width="1.5" fill="none" opacity=".6"/>`).join('');
  /* walls (cutaway U) */
  const U=`M${x0} ${yT}H${cx0}V${cyB}H${cx1}V${yT}H${x1}V${yB-10}Q${x1} ${yB} ${x1-10} ${yB}H${x0+10}Q${x0} ${yB} ${x0} ${yB-10}Z`;
  o+=`<g${slotAttr('wall','Walls')}>`;
  if(d.wall)o+=`<path d="${U}" fill="${KF_WFILL[d.wall]}" stroke="#4a5568" stroke-width="2.5" class="kfwall"/>`+(d.wall==='alu'||d.wall==='steel'?`<path d="M${x0+6} ${yT+8}V${yB-16}M${x1-8} ${yT+8}V${yB-16}" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>`:'')
    +`<path d="M${cx0} ${yT}V${cyB}H${cx1}V${yT}" fill="none" stroke="#4a5568" stroke-width="1.5" opacity=".6"/>`;
  else o+=`<path d="${U}" fill="#ffffff" fill-opacity=".35" stroke="#2f6bff" stroke-width="2.5" stroke-dasharray="8 6" class="kfempty"/><text x="${x0+t/2}" y="${(yT+yB)/2}" text-anchor="middle" font-size="12" font-weight="900" fill="#2f6bff" transform="rotate(-90 ${x0+t/2} ${(yT+yB)/2})">DROP WALLS</text><text x="${x1-t/2}" y="${(yT+yB)/2}" text-anchor="middle" font-size="12" font-weight="900" fill="#2f6bff" transform="rotate(90 ${x1-t/2} ${(yT+yB)/2})">DROP WALLS</text>`;
  o+=`</g>`;
  /* paint skin */
  const skin=`M${x0-4} ${yT}V${yB-10}Q${x0-4} ${yB+4} ${x0+10} ${yB+4}H${x1-10}Q${x1+4} ${yB+4} ${x1+4} ${yB-10}V${yT}`;
  o+=`<g${slotAttr('color','Paint')}>`;
  if(d.color)o+=`<path d="${skin}" fill="none" stroke="${d.color==='white'?'#c7d0de':'#111'}" stroke-width="9.5" stroke-linejoin="round"/><path d="${skin}" fill="none" stroke="${KF_PAINT[d.color]}" stroke-width="7" stroke-linejoin="round" class="kfskin"/>`;
  else o+=`<path d="${skin}" fill="none" stroke="#2f6bff" stroke-width="7" stroke-dasharray="3 6" stroke-linecap="round" opacity=".8"/>`;
  if(chosen('color'))o+=`<path d="${skin}" fill="none" stroke="transparent" stroke-width="22" pointer-events="stroke"/><g transform="translate(${x0-62} ${yB-40})"><rect x="-46" y="-11" width="92" height="22" rx="11" fill="${d.color?KF_PAINT[d.color]:'#fff'}" stroke="${d.color?'#4a5568':'#2f6bff'}" stroke-width="2" ${d.color?'':'stroke-dasharray="4 3"'}/><text y="4.5" text-anchor="middle" font-size="11.5" font-weight="900" fill="${d.color&&d.color!=='white'?'#fff':'#2f6bff'}">${d.color?'Paint':'Drop paint'}</text></g>`;
  o+=`</g>`;
  /* cold pack / soup pot */
  const px=cx0+14,pw=d.ice==='big'?62:52,ph=d.ice==='big'?110:58;
  o+=`<g${slotAttr('ice',soup?'Soup pot':'Cold pack')}>`;
  if(soup){const big=d.ice==='big',cx=318,w=big?118:84,hh=big?62:44,y=cyB-hh;
    if(chosen('ice'))o+=`<rect x="${cx0+8}" y="${yT+30}" width="${cx1-cx0-16}" height="${cyB-yT-32}" fill="transparent"/>`;
    if(d.ice)o+=`<g class="kfpot"><path d="M${cx-w/2} ${y}h${w}v${hh-10}a10 10 0 0 1-10 10H${cx-w/2+10}a10 10 0 0 1-10-10z" fill="#8a94a6" stroke="#4a5262" stroke-width="2.5"/><path d="M${cx-w/2-10} ${y+8}h10M${cx+w/2} ${y+8}h10" stroke="#4a5262" stroke-width="5" stroke-linecap="round"/><ellipse cx="${cx}" cy="${y+3}" rx="${w/2-3}" ry="6" class="kfsoup" fill="#d9772f"/><path d="M${cx-w/2+8} ${y+14}v${hh-28}" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>`
      +`<g class="kfsteam">${[-1,0,1].map(k=>`<path d="M${cx+k*20} ${y-6}q-8-12 0-24t0-24" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}</g></g>`;
    else o+=`<rect x="${cx-50}" y="${cyB-56}" width="100" height="54" rx="8" fill="#fff" fill-opacity=".4" stroke="#2f6bff" stroke-width="2.5" stroke-dasharray="7 5"/><text x="${cx}" y="${cyB-24}" text-anchor="middle" font-size="11.5" font-weight="900" fill="#2f6bff">DROP POT</text>`;}
  else{if(chosen('ice'))o+=`<rect x="${px-6}" y="${yT+20}" width="76" height="${cyB-yT-22}" fill="transparent"/>`;
    if(d.ice)o+=`<g class="kfpack" style="transform-origin:${px+pw/2}px ${cyB}px"><rect x="${px}" y="${cyB-ph}" width="${pw}" height="${ph}" rx="9" fill="url(#kfPack)" stroke="#1f6fb8" stroke-width="2.5"/><path d="M${px+8} ${cyB-ph+10}v${ph-24}" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/><text x="${px+pw/2}" y="${cyB-ph/2+7}" text-anchor="middle" font-size="${d.ice==='big'?24:18}" fill="#fff" font-weight="900">❄</text>${inv?`<text x="${px+pw/2}" y="${cyB-6}" text-anchor="middle" font-size="9.5" font-weight="900" fill="#fff">${d.ice==='big'?'800 g':'200 g'}</text>`:''}</g>`;
    else o+=`<rect x="${px}" y="${cyB-100}" width="60" height="98" rx="9" fill="#fff" fill-opacity=".45" stroke="#2f6bff" stroke-width="2.5" stroke-dasharray="7 5"/><text x="${px+30}" y="${cyB-56}" text-anchor="middle" font-size="11" font-weight="900" fill="#2f6bff">DROP</text><text x="${px+30}" y="${cyB-42}" text-anchor="middle" font-size="11" font-weight="900" fill="#2f6bff">PACK</text>`;}
  o+=`</g>`;
  /* ice cream */
  if(!soup){const cx=362,base=cyB;
    o+=`<g class="kfcream"><ellipse cx="${cx}" cy="${base-2}" rx="40" ry="6" fill="#ffe3ec" class="kfpuddle" opacity="0"/>`
      +`<g class="kfscoops" style="transform-origin:${cx}px ${base-36}px"><circle cx="${cx-17}" cy="${base-46}" r="18" fill="#fff4dc"/><circle cx="${cx+17}" cy="${base-46}" r="18" fill="#ffb3c7"/><circle cx="${cx}" cy="${base-66}" r="19" fill="#8a5a3c"/>`
      +`<circle cx="${cx-22}" cy="${base-52}" r="5" fill="#fff" opacity=".7"/><circle cx="${cx+11}" cy="${base-53}" r="4" fill="#fff" opacity=".6"/><circle cx="${cx-6}" cy="${base-73}" r="4.5" fill="#fff" opacity=".35"/>`
      +`<g class="kfdrips" opacity="0"><path d="M${cx-26} ${base-38}q-2 10 2 14q4-4 2-14z" fill="#fff4dc"/><path d="M${cx+24} ${base-38}q-2 14 2 18q4-4 2-18z" fill="#ffb3c7"/><path d="M${cx+4} ${base-50}q-2 10 2 14q4-4 2-14z" fill="#8a5a3c"/></g></g>`
      +`<path d="M${cx-30} ${base-38}h60l-7 36h-46z" fill="url(#kfTub)" stroke="#a8324a" stroke-width="2"/><path d="M${cx-30} ${base-38}h60" stroke="#fff" stroke-width="3" opacity=".6"/><text x="${cx}" y="${base-14}" text-anchor="middle" font-size="9" font-weight="900" fill="#fff">ICE CREAM</text></g>`;}
  /* lid */
  const lY=KF.lidY;
  o+=`<g${slotAttr('lid','Lid')}>`;
  if(chosen('lid'))o+=`<rect x="${x0-14}" y="${lY-10}" width="${x1-x0+28}" height="${yT-lY+12}" fill="transparent"/>`;
  if(d.lid==='foam')o+=`<rect x="${x0-10}" y="${lY}" width="${x1-x0+20}" height="${yT-lY}" rx="8" fill="url(#kfpFoam)" stroke="#4a5568" stroke-width="2.5"/>`+(d.color?`<path d="M${x0-6} ${lY+1.5}H${x1+6}" stroke="${KF_PAINT[d.color]}" stroke-width="5" stroke-linecap="round"/>`:'')+`<rect x="${(x0+x1)/2-30}" y="${lY-9}" width="60" height="11" rx="5" fill="#5a6475"/>`;
  else if(d.lid==='thin')o+=`<rect x="${x0-6}" y="${yT-10}" width="${x1-x0+12}" height="10" rx="4" fill="url(#kfpThin)" stroke="#3f7fc0" stroke-width="2"/><path d="M${x0+10} ${yT-6}h80" stroke="#fff" stroke-width="2" opacity=".8"/>`;
  else if(d.lid==='none')o+=`<g class="kfopen"><path d="M${cx0+20} ${yT-16}q12-16 24 0t24 0M${cx1-110} ${yT-16}q12-16 24 0t24 0" stroke="#ff7a4a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><text x="${(x0+x1)/2}" y="${yT-10}" text-anchor="middle" font-size="12" font-weight="900" fill="#c2410c">OPEN TOP</text></g>`;
  else o+=`<rect x="${x0-10}" y="${lY}" width="${x1-x0+20}" height="${yT-lY}" rx="8" fill="#fff" fill-opacity=".45" stroke="#2f6bff" stroke-width="2.5" stroke-dasharray="8 6" class="kfempty"/><text x="${(x0+x1)/2}" y="${lY+20}" text-anchor="middle" font-size="12" font-weight="900" fill="#2f6bff">DROP A LID HERE</text>`;
  o+=`</g>`;
  /* locked parts get a small lock tag */
  const locks=[];['wall','lid','color','ice'].forEach(c=>{if(!chosen(c)&&d[c])locks.push(c);});
  if(locks.length&&L.type==='design')o+=`<g transform="translate(${x1+14} ${yB-6})"><rect x="0" y="-15" width="${18+locks.length*0}" height="18" rx="5" fill="#13203d" opacity=".75"/><path d="M5 -6h8v6h-8z M6.5 -6v-3a2.5 2.5 0 0 1 5 0v3" fill="none" stroke="#fff" stroke-width="1.6"/></g>`;
  return o;}

/* ---------------- board ---------------- */
function kfBuild(G){
  const L=G.L,S=G.st,d=S.d,W=KF.W,H=KF.H;
  let t=kfDefs()+kfScene(L);
  const sun=L.sun;
  if(sun)t+=`<g class="kfsunrays">${[0,1,2,3].map(i=>`<path d="M${616-i*10} ${78+i*12}L${KF.x1+8-i*30} ${KF.lidY+6+i*20}" stroke="#ffcf3a" stroke-width="3" stroke-dasharray="10 9" opacity=".75" class="kfray"/>`).join('')}</g><circle cx="650" cy="58" r="72" fill="url(#kfSunG)"/><circle cx="650" cy="58" r="26" fill="#ffd23f" stroke="#ffb000" stroke-width="3"/>`;
  /* outside temperature + clock chips */
  t+=`<g transform="translate(14 14)"><rect width="148" height="34" rx="17" fill="#13203d" opacity=".82"/><text x="16" y="23" font-size="15" font-weight="900" fill="${L.Tout<0?'#9fdcff':'#ffb38a'}">${L.Tout<0?'❄':'☀'}</text><text x="36" y="22.5" font-size="14" font-weight="800" fill="#fff">Outside ${L.Tout}°C</text></g>`;
  t+=`<g transform="translate(176 14)"><rect width="122" height="34" rx="17" fill="#13203d" opacity=".82"/><circle cx="19" cy="17" r="8" fill="none" stroke="#ffd23f" stroke-width="2.4"/><path d="M19 12v5l3 2" stroke="#ffd23f" stroke-width="2.2" fill="none" stroke-linecap="round"/><text x="36" y="22.5" font-size="14" font-weight="800" fill="#fff" class="kfclock">Hour 0</text></g>`;
  /* cooler */
  t+=`<g class="kfcool">${kfCooler(L,d,S)}</g>`;
  /* thermometer */
  const TX=530,T0=146,T1=286,lo=L.soup?-20:-20,hi=L.soup?100:40;
  t+=`<g class="kftherm"><path d="M${KF.x1+4} 200H${TX-12}" stroke="#4a5568" stroke-width="2" stroke-dasharray="4 3"/><rect x="${TX-13}" y="${T0-8}" width="26" height="${T1-T0+22}" rx="13" fill="#fff" stroke="#4a5568" stroke-width="2.5"/>`
    +[0,1,2,3,4,5,6].map(i=>{const y=T1-(T1-T0)*i/6;return `<path d="M${TX+8} ${y}h5" stroke="#4a5568" stroke-width="1.5"/>`;}).join('')
    +`<rect x="${TX-5}" y="${T1}" width="10" height="10" fill="url(#kfMerc)" class="kfmerc"/><circle cx="${TX}" cy="${T1+22}" r="15" fill="url(#kfMerc)" stroke="#4a5568" stroke-width="2.5"/><circle cx="${TX-4}" cy="${T1+17}" r="4" fill="#fff" opacity=".5"/>`
    +(L.soup?'':`<path d="M${TX-17} ${T1-(T1-T0)*(0-lo)/(hi-lo)}h34" stroke="#2f6bff" stroke-width="2" stroke-dasharray="3 2"/><text x="${TX+22}" y="${T1-(T1-T0)*(0-lo)/(hi-lo)+4}" font-size="10" font-weight="900" fill="#2f6bff">0°</text>`)
    +(L.soup?`<path d="M${TX-17} ${T1-(T1-T0)*(60-lo)/(hi-lo)}h34" stroke="#e2483f" stroke-width="2" stroke-dasharray="3 2"/><text x="${TX+22}" y="${T1-(T1-T0)*(60-lo)/(hi-lo)+4}" font-size="10" font-weight="900" fill="#e2483f">60°</text>`:'')
    +`<g transform="translate(${TX} ${T0-26})"><rect x="-34" y="-14" width="68" height="24" rx="12" fill="#13203d"/><text y="3.5" text-anchor="middle" font-size="13" font-weight="900" fill="#fff" class="kftemp">${L.Tin}°C</text></g><text text-anchor="middle" font-size="11" font-weight="800" fill="#13203d" stroke="#fff" stroke-width="3" paint-order="stroke" x="${TX+34}" y="${T1+26}">Inside</text></g>`;
  /* particles */
  t+=`<g class="kfparts" pointer-events="none">${Array.from({length:KF.N},()=>'<circle r="0" cx="-20" cy="-20"/>').join('')}</g>`;
  /* status banner (MELTED / STILL FROZEN) */
  t+=`<g class="kfstamp" opacity="0" pointer-events="none"><rect x="${(KF.x0+KF.x1)/2-110}" y="150" width="220" height="44" rx="12" fill="#13203d" opacity=".88"/><text x="${(KF.x0+KF.x1)/2}" y="180" text-anchor="middle" font-size="22" font-weight="900" fill="#fff" class="kfstampt"></text></g>`;
  /* timeline */
  t+=`<g class="kftl"><rect x="0" y="342" width="${W}" height="58" fill="#13203d" opacity=".9"/><rect x="${KF.TX0}" y="${KF.TY-7}" width="${KF.TX1-KF.TX0}" height="14" rx="7" fill="#2a3a63"/><rect x="${KF.TX0}" y="${KF.TY-7}" width="0" height="14" rx="7" fill="#ff6a3c" class="kfprog"/>`
    +Array.from({length:KF.SPAN+1},(_,i)=>`<path d="M${kfHX(i)} ${KF.TY+7}v5" stroke="#8fa0c6" stroke-width="1.5"/>`+(i%2===0?`<text x="${kfHX(i)}" y="${KF.TY+23}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#cfd8ff">${i}${i===KF.SPAN?' h':''}</text>`:'')).join('')
    +`<text x="14" y="${KF.TY+4}" font-size="11.5" font-weight="900" fill="#fff">HOURS</text><g class="kfgoal"></g><g class="kfpins"></g><g class="kfpred"></g></g>`;
  const svg=ngSvg(W,H,t,'ngsvg kfsvg',L.soup?'A cooler with hot soup inside':'A cutaway cooler with ice cream inside');
  const q=s=>svg.querySelector(s);
  S.el={svg,cool:q('.kfcool'),parts:[...q('.kfparts').children],clock:q('.kfclock'),temp:q('.kftemp'),merc:q('.kfmerc'),prog:q('.kfprog'),
    goal:q('.kfgoal'),pins:q('.kfpins'),pred:q('.kfpred'),stamp:q('.kfstamp'),stampt:q('.kfstampt'),T:{TX,T0,T1,lo,hi},P:[],raf:0};
  kfInput(G);kfStatic(G);kfFrame(G);
  return svg;
}
/* redraw the cooler and the timeline marks (on any change, not every frame) */
function kfStatic(G){
  const S=G.st,E=S.el,L=G.L;if(!E)return;
  E.cool.innerHTML=kfCooler(L,S.d,S);
  /* goal flag */
  const gx=kfHX(L.goal||0);
  E.goal.innerHTML=L.goal?`<path d="M${gx} ${KF.TY-16}V${KF.TY+8}" stroke="#3fd18a" stroke-width="3"/><path d="M${gx} ${KF.TY-16}l18 5-18 5z" fill="#3fd18a"/><text x="${gx+22}" y="${KF.TY-6}" font-size="10.5" font-weight="900" fill="#7df0b0">GOAL ${L.goal} h</text>`:'';
  /* result pins */
  let pins='';const pin=(hr,col,txt,up)=>{const x=kfHX(hr),y=KF.TY,ty=up?-62:-38;return `<g transform="translate(${x} ${y})"><circle r="8" fill="${col}" stroke="#fff" stroke-width="2.5"/>${up?`<path d="M0 -8V${ty+20}" stroke="${col}" stroke-width="2.5"/>`:''}<rect x="-44" y="${ty}" width="88" height="20" rx="10" fill="${col}" stroke="#fff" stroke-width="1.5"/><text y="${ty+14}" text-anchor="middle" font-size="10.5" font-weight="900" fill="#fff">${txt}</text></g>`;};
  if(L.type==='invest'){if(S.runA!=null)pins+=pin(Math.min(S.runA,KF.SPAN),'#2f6bff','A: '+kfFmt(S.runA)+' h',false);if(S.runB!=null)pins+=pin(Math.min(S.runB,KF.SPAN),'#1f9d55','B: '+kfFmt(S.runB)+' h',false);}
  else if(S.res&&!S.busy){const hr=S.res.hours,over=hr>KF.SPAN;pins+=pin(Math.min(hr,KF.SPAN),S.res.ok?'#1f9d55':'#e2483f',(over?(L.soup?'Hot ':'Frozen '):S.res.ok?'Lasted ':(L.soup?'Cold at ':'Melted '))+(over?'12+ h':kfFmt(hr)+' h'),S.pred!=null&&Math.abs(Math.min(hr,KF.SPAN)-S.pred)<2.2);}
  E.pins.innerHTML=pins;
  /* prediction marker */
  if(L.type==='design'&&!ngT()){const has=S.pred!=null,v=has?S.pred:0,x=kfHX(v);
    E.pred.innerHTML=`<g class="kfpm${has?'':' unset'}" tabindex="0" role="slider" aria-label="Your prediction: the hour it ${L.soup?'goes cold':'melts'}" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${v}" aria-valuetext="${has?kfFmt(v)+' hours':'not set'}" transform="translate(${x} ${KF.TY})">`
      +`<rect x="-14" y="-12" width="28" height="40" fill="transparent"/><path d="M0 -9l-9 -14h18z" fill="#ffd23f" stroke="#7a5200" stroke-width="1.5"/><path d="M0 -9V9" stroke="#ffd23f" stroke-width="3"/>`
      +`<g transform="translate(0 -38)"><rect x="${has?-36:-58}" y="-11" width="${has?72:116}" height="20" rx="10" fill="#ffd23f" stroke="#7a5200" stroke-width="1.5"/><text y="3.5" text-anchor="middle" font-size="10.5" font-weight="900" fill="#3a2600">${has?'Guess '+kfFmt(v)+' h':'Drag me: predict!'}</text></g></g>`;}
  else E.pred.innerHTML='';
  kfFrame(G);
}
/* state that moves with the clock */
function kfFrame(G){
  const S=G.st,E=S.el,L=G.L;if(!E)return;
  const clock=S.clock||0,hrs=S.runHrs||0,p=hrs?Math.min(1,clock/hrs):0,soup=L.soup;
  if(E.clock){const txt=S.running||clock?'Hour '+kfFmt(clock):'Hour 0';if(E.clock.textContent!==txt)E.clock.textContent=txt;}
  if(E.prog)E.prog.setAttribute('width',(kfHX(clock)-KF.TX0).toFixed(1));
  const T0v=L.Tin,T=soup?80-20*p:-10+10*p;const {TX,T0,T1,lo,hi}=E.T,y=T1-(T1-T0)*(Math.max(lo,Math.min(hi,T))-lo)/(hi-lo);
  E.merc.setAttribute('y',y.toFixed(1));E.merc.setAttribute('height',(T1-y+12).toFixed(1));
  const tt=Math.round(T)+'°C';if(E.temp.textContent!==tt)E.temp.textContent=tt;void T0v;
  const q=s=>E.cool.querySelector(s);
  if(!soup){const pk=q('.kfpack');if(pk)pk.style.transform=`scale(${(1-.8*p).toFixed(3)},${(1-.92*p).toFixed(3)})`;
    const sc=q('.kfscoops'),dr=q('.kfdrips'),pu=q('.kfpuddle');
    const soft=Math.max(0,(p-.55)/.45);if(sc)sc.style.transform=`scale(${(1+.18*soft).toFixed(3)},${(1-.42*soft).toFixed(3)})`;
    if(dr)dr.setAttribute('opacity',Math.max(0,(p-.75)/.2).toFixed(2));if(pu)pu.setAttribute('opacity',Math.max(0,(p-.7)/.3).toFixed(2));
    if(sc)sc.setAttribute('opacity',p>=1?'.75':'1');}
  else{const st=q('.kfsteam'),so=q('.kfsoup');if(st)st.setAttribute('opacity',(1-p).toFixed(2));if(so)so.setAttribute('fill',p>=1?'#9a7a5a':'#d9772f');}
}

/* ---------------- heat particles ---------------- */
function kfSpawn(G){
  const S=G.st,E=S.el,L=G.L,d=S.d,lk=kfLeaks(L,d),soup=L.soup;
  const free=E.P.length<KF.N;if(!free)return;
  const r=Math.random()*lk.total;const kind=r<lk.walls?'wall':r<lk.walls+lk.top?'top':'sun';
  const {x0,x1,yT,yB,t,cx0,cx1,cyB}=KF;
  const tgt=()=>soup?[318,cyB-40]:(S.clock/(S.runHrs||1)<.8?[cx0+40,cyB-50]:[362,cyB-50]);
  let pts,col='url(#kfHeat)';
  const side=Math.random()<.5;const y=yT+14+Math.random()*(yB-yT-34);
  if(!soup){
    if(kind==='wall')pts=side?[[x0-46,y],[cx0+2,y],tgt()]:[[x1+46,y],[cx1-2,y],tgt()];
    else if(kind==='top'){const x=cx0+20+Math.random()*(cx1-cx0-40);pts=d.lid==='none'?[[x,KF.lidY-30],[x+(Math.random()-.5)*60,yT+20],tgt()]:[[x,KF.lidY-18],[x,yT+2],tgt()];}
    else{pts=[[x1+40,y],[cx1-2,y],tgt()];col='url(#kfSunP)';}
  }else{const s=tgt();
    if(kind==='top'){const x=cx0+30+Math.random()*(cx1-cx0-60);pts=[s,[x,yT+4],[x+(Math.random()-.5)*50,KF.lidY-40]];}
    else pts=side?[s,[cx0-2,y],[x0-50,y]]:[s,[cx1+2,y],[x1+50,y]];}
  E.P.push({pts,i:1,x:pts[0][0],y:pts[0][1],col,kind,wob:Math.random()*6.28,conv:kind==='top'&&d.lid==='none',age:0});
}
function kfSpeed(G,x,y){const S=G.st,d=S.d,{x0,x1,yT,yB,t}=KF;
  if(y>=yT&&y<=yB+2&&((x>=x0-5&&x<=x0+t+1)||(x>=x1-t-1&&x<=x1+5)))return 150*(KF_K[d.wall]||1);
  if(d.lid&&d.lid!=='none'&&x>=x0-10&&x<=x1+10){const top=d.lid==='foam'?KF.lidY:yT-10;if(y>=top&&y<=yT+1)return 150*(KF_KL[d.lid]||1);}
  return 165;}
function kfParticles(G,dt){
  const S=G.st,E=S.el;
  S.spAcc=(S.spAcc||0)+dt*S.spRate;while(S.spAcc>=1){S.spAcc-=1;kfSpawn(G);}
  const keep=[];
  E.P.forEach(P=>{P.age+=dt;const [tx,ty]=P.pts[P.i];const dx=tx-P.x,dy=ty-P.y,dd=Math.hypot(dx,dy);
    const v=kfSpeed(G,P.x,P.y)*dt;
    if(dd<=v){P.x=tx;P.y=ty;P.i++;if(P.i>=P.pts.length){P.dead=true;}}
    else{P.x+=dx/dd*v;P.y+=dy/dd*v;}
    if(!P.dead&&P.age<9)keep.push(P);});
  E.P=keep;
  for(let k=0;k<E.parts.length;k++){const c=E.parts[k],P=E.P[k];
    if(!P){if(c.getAttribute('r')!=='0')c.setAttribute('r','0');continue;}
    const w=P.conv?Math.sin(P.age*7+P.wob)*7:0;
    c.setAttribute('cx',(P.x+w).toFixed(1));c.setAttribute('cy',P.y.toFixed(1));c.setAttribute('r','6.5');if(c.getAttribute('fill')!==P.col)c.setAttribute('fill',P.col);}
}
function kfClearParts(G){const E=G.st.el;if(!E)return;E.P=[];E.parts.forEach(c=>c.setAttribute('r','0'));}

/* run the clock. Calls done() at the end (at once under reduced motion). */
function kfRun(G,hrs,done){
  const S=G.st,E=S.el,L=G.L;S.busy=true;S.running=true;S.runHrs=hrs;S.clock=0;
  const lk=kfLeaks(L,S.d);S.spRate=Math.min(26,4+lk.total*.3);S.spAcc=0;
  kfStatic(G);E.stamp.setAttribute('opacity','0');
  const tEnd=Math.min(hrs,KF.SPAN),dur=Math.max(2300,tEnd/KF.SPAN*6500);
  const finish=()=>{S.clock=tEnd;S.running=false;kfFrame(G);
    const over=hrs>KF.SPAN,met=L.type==='design'&&hrs>=L.goal;E.stampt.textContent=over?(L.soup?'STILL HOT':'STILL FROZEN'):met?'GOAL MET ✓':L.soup?'SOUP WENT COLD':'MELTED!';
    const sr=E.stamp.querySelector('rect');if(sr)sr.setAttribute('fill',met||over?'#116b3a':'#13203d');
    E.stamp.setAttribute('opacity','1');Art.pop(E.stamp,1.1);
    setTimeout(()=>{if(G.st===S)kfClearParts(G);},Art.reduced()?0:900);
    done();};
  if(Art.reduced()){finish();return;}
  let last=0;const t0=performance.now();
  const step=now=>{if(!G||G.st!==S||!E.svg.isConnected){S.running=false;return;}
    const dt=last?Math.min(.05,(now-last)/1000):.016;last=now;
    const f=Math.min(1,(now-t0)/dur);S.clock=f*tEnd;kfParticles(G,dt);kfFrame(G);
    if(f<1)E.raf=requestAnimationFrame(step);else finish();};
  E.raf=requestAnimationFrame(step);
}

/* ---------------- input: prediction marker (pointer + keys) ---------------- */
function kfInput(G){
  const S=G.st,E=S.el,svg=E.svg,L=G.L;if(L.type!=='design')return;
  const pt=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):{x:0,y:0};};
  const hOf=p=>Math.round(Math.max(0,Math.min(KF.SPAN,(p.x-KF.TX0)/(KF.TX1-KF.TX0)*KF.SPAN))*2)/2;
  const can=()=>G&&G.st===S&&!S.busy&&!G.done&&!ngT();
  let drag=null;
  svg.addEventListener('pointerdown',e=>{if(!can())return;const p=pt(e),onM=e.target.closest&&e.target.closest('.kfpm');if(!onM&&p.y<344)return;e.preventDefault();drag=e.pointerId;
    S.pred=hOf(p);kfStatic(G);try{svg.setPointerCapture(e.pointerId);}catch(_){}});
  svg.addEventListener('pointermove',e=>{if(drag!==e.pointerId)return;const v=hOf(pt(e));if(v!==S.pred){S.pred=v;kfStatic(G);}});
  const up=e=>{if(drag!==e.pointerId)return;drag=null;const m=svg.querySelector('.kfpm path');if(m)Art.pop(m,1.3);ngRender();};
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  svg.addEventListener('keydown',e=>{const t=e.target;if(!t.closest||!t.closest('.kfpm')||!can())return;
    if(e.key==='Enter'){e.preventDefault();kfTest();return;}
    const upk=e.key==='ArrowUp'||e.key==='ArrowRight',dn=e.key==='ArrowDown'||e.key==='ArrowLeft';if(!upk&&!dn)return;e.preventDefault();
    S.pred=Math.max(0,Math.min(KF.SPAN,(S.pred==null?KF.SPAN/2:S.pred)+(upk?.5:-.5)));kfStatic(G);ngRender();const m=svg.querySelector('.kfpm');if(m)m.focus();});
}

/* ---------------- drag from the tray into the cooler ---------------- */
let KF_DRAG=null;
function kfDragInit(){
  if(KF_DRAG)KF_DRAG.destroy();
  KF_DRAG=Art.drag({root:$('ngGrid'),items:'.kftile',targets:'.kfslot',
    accept:(it,t)=>!!(G&&G.key==='frozen'&&G.st&&!G.st.busy&&!G.done&&!(G.L.type==='invest'&&G.st.phase!=='B')&&it.dataset.cat===t.dataset.cat),
    label:it=>it.getAttribute('aria-label')||'material',
    onDrop:(it,t)=>kfPlace(it.dataset.cat,it.dataset.v)});
}
function kfPlace(cat,v){
  if(!G||G.key!=='frozen')return;const S=G.st,L=G.L;if(S.busy||G.done)return;
  S.d[cat]=v;S.res=null;S.msg=null;S.clock=0;S.runHrs=0;if(S.el&&S.el.stamp)S.el.stamp.setAttribute('opacity','0');
  ngRender();
  const slot=S.el&&S.el.cool.querySelector(`.kfslot[data-cat="${cat}"]`);
  if(slot){Art.pop(slot,1.05);const r=slot.getBoundingClientRect();Art.burst(r.left+r.width/2,r.top+r.height/2,{n:10,colors:['#ffd23f','#fff','#7fd3ff'],shape:['star','dot']});}
  if(!ngT()){const nm=(L.soup&&cat==='ice'?KF_SOUP:KF_TILE[cat])[v][0];ngSay(`**${nm}**: ${cat==='ice'&&L.soup?(v==='big'?'more hot soup to cool down':'less hot soup'):KF_INFO[v]}.`);}
}

/* ---------------- testing a design ---------------- */
function kfReady(G){const L=G.L,d=G.st.d;return L.choose.every(c=>d[c]);}
function kfTest(){
  if(!G||G.key!=='frozen')return;const L=G.L,S=G.st;if(G.done||S.busy)return;
  if(L.type==='invest')return kfRunInv();
  if(!kfReady(G))return;const cost=L.budget?kfCost(L,S.d):0;if(L.budget&&cost>L.budget)return;
  if(!ngT()&&S.pred==null){ngSay('First drag the gold marker on the timeline to the hour you think it '+(L.soup?'goes cold.':'melts.'),'alert');const m=S.el&&S.el.svg.querySelector('.kfpm');if(m){m.classList.remove('nudge');void m.getBBox();m.classList.add('nudge');m.focus({preventScroll:true});}return;}
  G.tries++;const hrs=kfHours(L,S.d),ok=hrs>=L.goal;
  if(ngT())return ngTDone(ok?1:0);
  S.res=null;S.msg=null;S.busy=true;ngRender();
  kfRun(G,hrs,()=>kfDone(G,hrs,ok));
}
function kfLeakLine(L,d){const lk=kfLeaks(L,d),parts=[['walls',lk.walls],['top',lk.top],['sun',lk.sun]].sort((a,b)=>b[1]-a[1]),big=parts[0][0],pct=Math.round(parts[0][1]/lk.total*100);
  const dir=L.soup?'out':'in';
  if(big==='walls')return `Most heat (**${pct}%**) got ${dir} through the **walls**. `+({alu:'Aluminum is a metal: a conductor.',steel:'Steel is a metal: a conductor.',card:'Cardboard slows heat a little.',wood:'Wood is only a fair insulator.',foam:'Foam is already the best insulator.'}[d.wall]);
  if(big==='top')return `Most heat (**${pct}%**) got ${dir} through the **top**. `+(d.lid==='none'?'With no lid, air flows right through (convection).':'A thin lid does not insulate much.');
  return `Most heat (**${pct}%**) came from the **Sun**. `+(d.color==='white'?'White already reflects most sunlight.':'Dark paint absorbs sunlight (radiation).');}
function kfDone(G,hrs,ok){
  const S=G.st,L=G.L;if(G.st!==S)return;S.busy=false;S.res={hours:hrs,ok};
  const over=hrs>KF.SPAN,hT=over?'more than 12':kfFmt(hrs),diff=S.pred==null?null:Math.abs(Math.min(hrs,KF.SPAN+.5)-S.pred);
  S.predLine=diff==null?null:diff<=.75?`Your guess: ${kfFmt(S.pred)} h. Spot on!`:`Your guess: ${kfFmt(S.pred)} h. Off by ${kfFmt(diff)} h.`;
  const what=L.soup?'stayed hot':'stayed frozen';
  if(ok){S.msg=['ok',`✓ It ${what} for **${hT} hours**. Goal: ${L.goal} hours.`];G.detail={tests:G.tries};
    const tub=S.el.cool.querySelector(L.soup?'.kfpot':'.kfcream');if(tub)Art.burstAt(tub,{n:16,colors:['#7fd3ff','#fff','#ffd23f'],shape:['star','dot']});
    kfStatic(G);ngRender();ngSay('Your design worked! '+kfLeakLine(L,S.d).replace(/\*\*/g,'**'),'go');
    ngWin(ngStars(G.tries-1,0,1),['Your design passed on test ',h('b',null,G.tries),'.']);return;}
  G.miss++;
  S.msg=['no',`It only ${what} for **${hT} hours** (goal ${L.goal}). `+kfLeakLine(L,S.d)];
  fx.pop({icon:'snow',text:L.soup?'The soup got cold':'It melted!',kind:'oops'});Art.shake(S.el.svg);
  kfStatic(G);ngRender();ngSay(S.msg[1],'alert');
}

/* ---------------- investigate level ---------------- */
function kfRunInv(){
  const L=G.L,S=G.st;if(S.busy||G.done)return;
  if(S.phase==='A'){const hrs=kfHours(L,S.d);S.msg=null;S.busy=true;ngRender();
    kfRun(G,hrs,()=>{S.busy=false;S.runA=hrs;S.dA=Object.assign({},S.d);S.phase='B';
      S.msg=['ok',`Cooler A stayed frozen for **${kfFmt(hrs)} hours**. Now change **ONE** thing to test the ice pack, then run B.`];
      kfStatic(G);ngRender();ngSay(S.msg[1],'go');});return;}
  if(S.phase!=='B')return;
  const ch=['wall','lid','color','ice'].filter(c=>S.d[c]!==S.dA[c]),nm=c=>KF_SLOT[c].toLowerCase();
  if(ngT()){/* not a test level, but stay safe */}
  if(!ch.length){S.msg=['no','You did not change anything yet. Drag a new ice pack into the cooler.'];ngRender();ngSay(S.msg[1],'alert');return;}
  if(ch.length>1){G.miss++;G.tries++;S.msg=['no',`Not a fair test: you changed the **${ch.map(nm).join('** and the **')}**. If B lasts longer, which change caused it? Change only the **ice pack**.`];
    fx.pop({icon:'snow',text:'Not a fair test',kind:'oops'});Art.shake(S.el.svg);ngRender();ngSay(S.msg[1],'alert');return;}
  if(ch[0]!==L.test){G.miss++;G.tries++;S.msg=['no',`That is a fair test of the **${nm(ch[0])}**, but our question is about the **ice pack**. Put the ${nm(ch[0])} back and change the ice pack instead.`];
    fx.pop({icon:'snow',text:'Wrong thing changed',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');return;}
  const hrs=kfHours(L,S.d);S.msg=null;S.busy=true;ngRender();
  kfRun(G,hrs,()=>{S.busy=false;S.runB=hrs;S.phase='Q';S.r=0;S.wrong=[];S.okNow=false;
    S.msg=['ok',`Fair test! Only the ice pack changed. A: **${kfFmt(S.runA)} h**, B: **${kfFmt(hrs)} h**.`];
    fx.pop({icon:'snow',text:'Fair test!',kind:'good'});kfStatic(G);ngRender();ngSay('Compare A and B on the timeline. What did your test show?','go');});
}

/* ---------------- lab bench (pack 2) ---------------- */
function kfBenchBuild(G){
  const L=G.L,S=G.st,R=L.rounds[0],W=KF.W,H=KF.H,lamp=L.bench==='lamp';let t=kfDefs()+kfScene({scene:'lab'});
  const A={cx:130},B={cx:345},bench=300;
  t+=`<rect x="0" y="${bench-4}" width="${W}" height="10" fill="#b8c3d6"/>`;
  if(lamp)t+=`<g><rect x="80" y="40" width="370" height="26" rx="13" fill="#3a4152" stroke="#232834" stroke-width="2"/><rect x="96" y="62" width="338" height="10" rx="5" fill="#ffd23f" class="kflampg"/><path d="M265 40V14" stroke="#3a4152" stroke-width="5"/><text x="265" y="58" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">HEAT LAMP</text></g>`
    +`<path d="M100 72L${A.cx-70} 210H${A.cx+70}L200 72z" fill="#ffe680" opacity=".22"/><path d="M330 72L${B.cx-70} 210H${B.cx+70}L430 72z" fill="#ffe680" opacity=".22"/>`;
  const thermo=(x,k)=>`<g transform="translate(${x} 0)"><rect x="-9" y="120" width="18" height="170" rx="9" fill="#fff" stroke="#4a5568" stroke-width="2"/><rect x="-4" y="270" width="8" height="10" fill="url(#kfMerc)" class="kfbm${k}"/><circle cx="0" cy="292" r="11" fill="url(#kfMerc)" stroke="#4a5568" stroke-width="2"/><g transform="translate(0 102)"><rect x="-30" y="-13" width="60" height="22" rx="11" fill="#13203d"/><text y="3" text-anchor="middle" font-size="12.5" font-weight="900" fill="#fff" class="kfbt${k}">${R.a?R.a[1][0]:20}°C</text></g></g>`;
  if(L.bench==='cocoa'){
    t+=`<g transform="translate(${A.cx} ${bench})"><path d="M-32 -58h64l-6 56h-52z" fill="#f3f6fb" stroke="#4a5568" stroke-width="2.5"/><path d="M32 -46q20 0 18 18t-20 14" fill="none" stroke="#4a5568" stroke-width="5"/><ellipse cx="0" cy="-56" rx="30" ry="5" fill="#6b3e22"/><text y="-22" text-anchor="middle" font-size="11" font-weight="900" fill="#4a5568">100 g</text></g>`
      +`<g transform="translate(${B.cx} ${bench})"><path d="M-74 -96h148v84a12 12 0 0 1-12 12h-124a12 12 0 0 1-12-12z" fill="#8a94a6" stroke="#4a5262" stroke-width="3"/><path d="M-90 -84h16M74 -84h16" stroke="#4a5262" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-94" rx="72" ry="8" fill="#6b3e22"/><path d="M-62 -78v62" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/><text y="-36" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">500 g</text></g>`;}
  else{
    t+=`<g transform="translate(${A.cx} ${bench})"><path d="M-62 -70h124v66a6 6 0 0 1-6 6h-112a6 6 0 0 1-6-6z" fill="#e8eef7" fill-opacity=".5" stroke="#4a5568" stroke-width="2.5"/><path d="M-60 -48q30-8 60 0t60 0v44a4 4 0 0 1-4 4h-112a4 4 0 0 1-4-4z" fill="#e7c47c"/>`+Array.from({length:22},(_,i)=>`<circle cx="${-52+(i*37)%104}" cy="${-40+(i*13)%34}" r="1.6" fill="#b88d45"/>`).join('')+`<text y="-14" text-anchor="middle" font-size="12" font-weight="900" fill="#7a5320">1 kg sand</text></g>`
      +`<g transform="translate(${B.cx} ${bench})"><path d="M-62 -70h124v66a6 6 0 0 1-6 6h-112a6 6 0 0 1-6-6z" fill="#e8eef7" fill-opacity=".5" stroke="#4a5568" stroke-width="2.5"/><path d="M-60 -50h120v46a4 4 0 0 1-4 4h-112a4 4 0 0 1-4-4z" fill="#4aa8e8" opacity=".85"/><path d="M-60 -50h120" stroke="#bfe6ff" stroke-width="3"/><text y="-16" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">1 kg water</text></g>`;}
  t+=thermo(A.cx+(L.bench==='cocoa'?62:86),'a')+thermo(B.cx+(L.bench==='cocoa'?112:86),'b');
  /* live graph */
  const gx=500,gy=110,gw=200,gh=170;
  t+=`<g transform="translate(${gx} ${gy})"><rect x="-14" y="-34" width="${gw+24}" height="${gh+66}" rx="14" fill="#fff" stroke="#c9d3e6" stroke-width="2"/><text x="${gw/2}" y="-14" text-anchor="middle" font-size="12" font-weight="900" fill="#13203d">Temperature (°C)</text>`
    +[0,20,40,60,80].map(v=>`<path d="M14 ${gh-v/80*gh}H${gw}" stroke="#e3e9f5"/><text x="8" y="${gh-v/80*gh+4}" text-anchor="end" font-size="9" fill="#6b7a99">${v}</text>`).join('')
    +`<path d="M14 0V${gh}H${gw}" stroke="#8a97ad" stroke-width="1.5" fill="none"/><text x="${gw/2+6}" y="${gh+16}" text-anchor="middle" font-size="10" font-weight="800" fill="#6b7a99">Time →</text>`
    +`<polyline class="kfga" points="" fill="none" stroke="#e2483f" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><polyline class="kfgb" points="" fill="none" stroke="#2f6bff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`
    +`<g font-size="10.5" font-weight="900"><rect x="20" y="${gh+22}" width="10" height="4" fill="#e2483f"/><text x="34" y="${gh+27}" fill="#e2483f" class="kfgla">${R.a?ngEsc(R.a[0]):''}</text></g></g>`;
  t+=`<g transform="translate(${A.cx} 334)"><rect x="-22" y="-12" width="44" height="22" rx="11" fill="#e2483f"/><text y="4" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">A</text></g><g transform="translate(${B.cx} 334)"><rect x="-22" y="-12" width="44" height="22" rx="11" fill="#2f6bff"/><text y="4" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">B</text></g>`;
  t+=`<g class="kfparts" pointer-events="none">${Array.from({length:KF.N},()=>'<circle r="0" cx="-20" cy="-20"/>').join('')}</g>`;
  const svg=ngSvg(W,H,t,'ngsvg kfsvg',L.bench==='cocoa'?'Two pots of cocoa on a lab bench':'Sand and water under a heat lamp');
  const q=s=>svg.querySelector(s);
  S.el={svg,bench:true,A,B,parts:[...q('.kfparts').children],ma:q('.kfbma'),mb:q('.kfbmb'),ta:q('.kfbta'),tb:q('.kfbtb'),ga:q('.kfga'),gb:q('.kfgb'),G:{gw,gh},P:[]};
  /* legend for B */
  const lg=q('.kfgla').parentNode;lg.insertAdjacentHTML('beforeend',`<rect x="110" y="${gh+22}" width="10" height="4" fill="#2f6bff"/><text x="124" y="${gh+27}" fill="#2f6bff">${R.b?ngEsc(R.b[0].replace(/ \(.*\)/,'')):''}</text>`);
  q('.kfgla').textContent=R.a?R.a[0].replace(/ \(.*\)/,''):'';
  kfBenchFrame(G,S.ran?10:0);
  return svg;
}
function kfBenchFrame(G,f){
  const S=G.st,E=S.el,R=G.L.rounds[0];if(!E||!E.bench||!R.a)return;
  const at=(arr,f)=>{const i=Math.min(9,Math.floor(f)),u=f-i;return arr[i]+(arr[Math.min(10,i+1)]-arr[i])*u;};
  const set=(m,tx,v)=>{const y=280-(280-128)*Math.max(0,Math.min(80,v))/80;m.setAttribute('y',y.toFixed(1));m.setAttribute('height',(280-y+10).toFixed(1));const s=Math.round(v)+'°C';if(tx.textContent!==s)tx.textContent=s;};
  set(E.ma,E.ta,at(R.a[1],f));set(E.mb,E.tb,at(R.b[1],f));
  const {gw,gh}=E.G,line=arr=>{let s='';const n=Math.floor(f);for(let i=0;i<=n;i++)s+=`${(14+(gw-14)*i/10).toFixed(1)},${(gh-arr[i]/80*gh).toFixed(1)} `;if(f>n&&n<10)s+=`${(14+(gw-14)*f/10).toFixed(1)},${(gh-at(arr,f)/80*gh).toFixed(1)}`;return s;};
  E.ga.setAttribute('points',f>0?line(R.a[1]):'');E.gb.setAttribute('points',f>0?line(R.b[1]):'');
}
function kfBenchRun(G,done){
  const S=G.st,E=S.el,L=G.L,R=L.rounds[0];S.busy=true;
  if(Art.reduced()||!R.a){kfBenchFrame(G,10);done();return;}
  const dur=3600,t0=performance.now();let last=0,acc=0;
  const spawn=f=>{if(E.P.length>=KF.N)return;const lamp=L.bench==='lamp';
    if(lamp){const side=Math.random()<.5?E.A:E.B,x=side.cx-50+Math.random()*100;E.P.push({x,y:76,tx:x,ty:250,v:160,col:'url(#kfSunP)'});}
    else{/* heat leaving: rate follows energy lost = mass x temperature drop */
      const i=Math.min(9,Math.floor(f)),da=(R.a[1][i]-R.a[1][i+1])*1,db=(R.b[1][i]-R.b[1][i+1])*5,pa=da/(da+db+.001);
      const side=Math.random()<pa?E.A:E.B,w=side===E.A?26:66,x=side.cx-w+Math.random()*w*2,y=side===E.A?bench0-60:bench0-100;E.P.push({x,y,tx:x+(Math.random()-.5)*40,ty:y-120,v:70,col:'url(#kfHeat)',fade:1});}};
  const bench0=300;
  const step=now=>{if(!G||G.st!==S||!E.svg.isConnected){return;}
    const dt=last?Math.min(.05,(now-last)/1000):.016;last=now;const f=Math.min(1,(now-t0)/dur)*10;
    acc+=dt*(L.bench==='lamp'?16:14);while(acc>=1){acc-=1;spawn(f);}
    E.P=E.P.filter(P=>{const dx=P.tx-P.x,dy=P.ty-P.y,dd=Math.hypot(dx,dy),v=P.v*dt;if(dd<=v)return false;P.x+=dx/dd*v;P.y+=dy/dd*v;return true;});
    E.parts.forEach((c,k)=>{const P=E.P[k];if(!P){c.setAttribute('r','0');return;}c.setAttribute('cx',P.x.toFixed(1));c.setAttribute('cy',P.y.toFixed(1));c.setAttribute('r','5.5');c.setAttribute('fill',P.col);});
    kfBenchFrame(G,f);
    if(f<10)requestAnimationFrame(step);else{E.P=[];E.parts.forEach(c=>c.setAttribute('r','0'));done();}};
  requestAnimationFrame(step);
}

/* ---------------- side panel ---------------- */
function kfTask(icon,title,small){return h('div',{class:'mwtask kftask'},h('span',{class:'mwflag kfflag'},icon),h('div',null,h('b',null,title),h('small',null,...ngRich(small))));}
function kfTray(G,cats,locked){
  const L=G.L,S=G.st,d=S.d,hintD=G.hint>=3&&!ngT()&&L.type==='design'?kfDesigns(L).filter(x=>kfPass(L,x)).sort((a,b)=>kfCost(L,a)-kfCost(L,b))[0]:null;
  return h('div',{class:'kftray'+(locked?' locked':'')},...cats.map(c=>{const opts=(L.opts&&L.opts[c])||Object.keys(KF_OPT[c].o);
    const names=L.soup&&c==='ice'?KF_SOUP:KF_TILE[c];
    return h('div',{class:'kfgrp'},h('div',{class:'osl'},L.soup&&c==='ice'?'Soup pot':KF_SLOT[c]),h('div',{class:'kftiles'},...opts.map(k=>{const [nm,sh]=names[k],cost=KF_OPT[c].o[k][2],on=d[c]===k;
      return h('button',{type:'button',class:'kftile'+(on?' on':'')+(hintD&&hintD[c]===k?' hint':''),'data-cat':c,'data-v':k,disabled:locked||G.done||S.busy,
        'aria-label':`${nm}${L.budget?', $'+cost:''}. ${L.soup&&c==='ice'?sh:KF_INFO[k]}. Drag it into the cooler.`,title:L.soup&&c==='ice'?sh:KF_INFO[k]},
        kfSwatch(c,k,L.soup),h('span',{class:'kftn'},h('b',null,nm),h('small',null,(L.budget?'$'+cost+' · ':'')+sh)),on?h('span',{class:'kfin'},'✓'):null);})));}));
}
function kfLeakBars(L,d){const lk=kfLeaks(L,d),rows=[['Walls',lk.walls,'#e2483f'],['Top',lk.top,'#f08a3e']].concat(L.sun?[['Sun',lk.sun,'#f4b13a']]:[]);
  return h('div',{class:'kfleaks'},h('div',{class:'osl'},L.soup?'Where the heat got out':'Where the heat got in'),
    h('div',{class:'kfstack'},...rows.filter(r=>r[1]>0).map(([n,v,c])=>h('i',{style:`width:${v/lk.total*100}%;background:${c}`}))),
    h('div',{class:'kflegend'},...rows.map(([n,v,c])=>h('span',null,h('i',{style:`background:${c}`}),n+' ',h('b',null,Math.round(v/lk.total*100)+'%')))));}
function kfSideDesign(G){
  const L=G.L,S=G.st,d=S.d,ready=kfReady(G),cost=L.budget?kfCost(L,d):null,over=cost!=null&&cost>L.budget;
  const kids=[kfTask(L.soup?'🍲':'❄',L.soup?'Keep the soup hot':'Build the cooler',`${L.soup?'Keep it above 60°C':'Keep it frozen'} for **${L.goal} hours**`+(L.budget?` on a **$${L.budget}** budget.`:'.')+' Drag materials into the cooler.')];
  kids.push(kfTray(G,L.choose,false));
  if(L.budget){const pc=Math.min(100,Math.round((cost||0)/L.budget*100));
    kids.push(h('div',{class:'kfbudget'+(over?' over':'')},h('span',null,'Spent ',h('b',null,'$'+(cost||0)),' of $'+L.budget),h('span',{class:'kfbbar'},h('i',{style:`width:${pc}%`}))));}
  if(!ngT())kids.push(h('div',{class:'kfpredl'+(S.pred==null?' need':'')},S.pred==null?['🎯 Drag the ',h('b',null,'gold marker'),' on the timeline to the hour you think it '+(L.soup?'goes cold.':'melts.')]:['🎯 Your guess: ',h('b',null,kfFmt(S.pred)+' hours'),S.predLine&&S.res?h('span',null,' · '+S.predLine.replace(/^Your guess: [\d.]+ h\. /,'')):null]));
  kids.push(ngBtn([I('clock'),' Test it'],kfTest,'good kftest',{style:'width:100%;font-size:18px',disabled:!ready||G.done||over||S.busy}));
  if(S.res&&!S.busy)kids.push(kfLeakBars(L,d));
  return kids;
}
function kfSideInv(G){
  const L=G.L,S=G.st;
  const steps=h('div',{class:'ppsteps'},...[['A','Run A'],['B','Change one thing'],['Q','Explain']].map(([k,t],i)=>{const idx=['A','B','Q'].indexOf(S.phase);return h('span',{class:'ppst'+(i<idx||(S.finished)?' ok':i===idx?' on':'')},t);}));
  const kids=[steps];
  if(S.phase==='A'||S.phase==='B'){
    kids.push(kfTask('1×',S.phase==='A'?'Run cooler A':'Make cooler B',S.phase==='A'?'Cooler A has foam walls, a thin lid and a **small 200 g ice pack**. Run it and see how long it lasts.':'Change **only one** thing so the test answers our question: does a **bigger ice pack** keep it frozen longer?'));
    kids.push(kfTray(G,L.choose,S.phase==='A'));
    kids.push(ngBtn([I('clock'),S.phase==='A'?' Run A':' Run B'],kfTest,'good kftest',{style:'width:100%;font-size:18px',disabled:S.busy||G.done}));
    if(S.msg)kids.push(h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])));
    return kids;}
  const R=L.rounds[S.r];
  if(S.runA!=null&&S.runB!=null){const mx=Math.max(S.runA,S.runB);kids.push(h('div',{class:'kfcmp'},
    h('div',null,h('span',null,'A · 200 g'),h('span',{class:'kfcb'},h('i',{style:`width:${S.runA/mx*100}%;background:#2f6bff`})),h('b',null,kfFmt(S.runA)+' h')),
    h('div',null,h('span',null,'B · 800 g'),h('span',{class:'kfcb'},h('i',{style:`width:${S.runB/mx*100}%;background:#1f9d55`})),h('b',null,kfFmt(S.runB)+' h'))));}
  if(S.finished||!R)return kids.concat([h('div',{class:'ppdone'},'✓ All done!')]);
  kids.push(h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,tx])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>kfInvAns(v)},tx))));
  if(S.msg)kids.push(h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])));
  if(S.okNow)kids.push(ngBtn(S.r+1<L.rounds.length?'Next question ▶':'Finish ▶',kfInvNext,'good',{style:'width:100%;margin-top:6px',disabled:G.done}));
  return kids;
}
function kfInvAns(v){const S=G.st,R=G.L.rounds[S.r];if(S.okNow||G.done)return;
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'snow',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no','Not quite. '+R.why];fx.pop({icon:'snow',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function kfInvNext(){const S=G.st;if(S.r+1>=G.L.rounds.length){S.finished=true;G.detail={mistakes:G.miss};ngRender();ngWin(ngStars(G.miss,0,1),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}
  S.r++;S.okNow=false;S.wrong=[];S.msg=null;ngRender();}
function kfSidePredict(G){
  const L=G.L,S=G.st,R=L.rounds[S.r];
  const prog=h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
  if(!R)return [prog];
  const kids=[prog,h('p',{class:'ppq'},R.q)];
  const pickOK=v=>!(G.done||S.okNow||S.wrong.includes(v)||S.busy);
  kids.push(h('div',{class:'ppmc'},...R.opts.map(([v,tx])=>h('button',{type:'button','aria-pressed':S.pick===v?'true':'false',class:'ngc wide'+(S.pick===v&&!S.okNow?' on':'')+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:!pickOK(v),onclick:()=>kfPick(v)},tx))));
  if(!S.okNow&&!ngT())kids.push(ngBtn([I('play'),R.a&&!S.ran?' Run it':' Check'],kfPredGo,'good kftest',{style:'width:100%;font-size:18px',disabled:S.pick==null||S.busy||G.done||S.wrong.includes(S.pick)}));
  if(ngT())kids.push(ngBtn('Save answer',kfPredGo,'good kftest',{style:'width:100%;font-size:18px',disabled:S.pick==null||G.done}));
  if(S.msg)kids.push(h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])));
  if(S.okNow)kids.push(ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',kfNextRound,'good',{style:'width:100%;margin-top:6px',disabled:G.done}));
  return kids;
}
function kfPick(v){const S=G.st;if(S.busy||S.okNow||G.done)return;S.pick=v;ngRender();}
function kfPredGo(){
  const S=G.st,L=G.L,R=L.rounds[S.r];if(S.pick==null||S.okNow||G.done||S.busy)return;const v=S.pick;
  if(ngT())return ngTAns(v===R.ans,kfNextRound);
  const judge=()=>{S.busy=false;S.ran=true;
    if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'snow',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
    else{S.wrong.push(v);G.miss++;G.tries++;S.pick=null;S.msg=['no','Not quite. '+(R.a?'Look at the graph. ':'')+R.why];fx.pop({icon:'snow',text:'Not quite',kind:'oops'});Art.shake(S.el.svg);ngRender();ngSay(S.msg[1],'alert');}};
  if(R.a&&!S.ran){S.busy=true;ngRender();kfBenchRun(G,judge);}else judge();
}
function kfNextRound(){const S=G.st;S.r++;S.okNow=false;S.wrong=[];S.msg=null;S.pick=null;
  if(S.r>=G.L.rounds.length){S.r--;S.okNow=true;G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,1),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}ngRender();}

ngDef({key:'frozen',name:'Keep It Frozen',ic:'snow',std:'MS-PS3-3 · PS3-4',subj:'phys',cap3:true,winDelay:900,
  short:'Build a cooler that slows down heat transfer.',menuDesc:'Drag foam, metal, wood and paint into a cutaway cooler, predict when the ice cream melts, then watch the heat flow in. Run fair tests on mass and materials.',
  intro:'Heat always flows from warmer things to colder things. Build coolers that slow that flow down: drag materials into the walls, lid, paint and cold pack, predict when it melts, then watch the heat creep in.',
  how:['**Drag** materials from the tray into the cooler (or tap a material, then tap its spot). Each one has a cost.','Drag the **gold marker** to the hour you think it melts, then press **Test it** and watch the heat flow.','Pass on the first test for 3 ★. Bench levels: predict first, then run the experiment.'],
  levels:KF_LEVELS,packs:KF_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true">${L.type==='predict'?'<polyline points="4,6 14,14 24,20 40,24" fill="none" stroke="#e2483f" stroke-width="2.6"/><polyline points="4,6 14,9 24,12 40,16" fill="none" stroke="#2f6bff" stroke-width="2.6"/>'
    :L.type==='invest'?'<rect x="4" y="8" width="16" height="6" rx="3" fill="#2f6bff"/><rect x="4" y="18" width="34" height="6" rx="3" fill="#1f9d55"/>'
    :`<path d="M6 8v16a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V8h-5v14H11V8z" fill="#f4f6fb" stroke="#5a6475" stroke-width="1.6"/><rect x="11" y="8" width="22" height="14" fill="#dff1ff"/><circle cx="22" cy="16" r="4" fill="${L.soup?'#d9772f':'#ffb3c7'}"/><circle cx="3" cy="15" r="2" fill="#ff6a3c"/><circle cx="41" cy="12" r="2" fill="#ff6a3c"/>`}</svg>`),
  start(G){const L=G.L;
    if(L.type==='predict')G.st={r:0,pick:null,wrong:[],okNow:false,msg:null,ran:false,busy:false,el:null};
    else if(L.type==='invest')G.st={d:Object.assign({},L.base),phase:'A',runA:null,runB:null,r:0,wrong:[],okNow:false,msg:null,busy:false,el:null};
    else{G.st={d:Object.assign({},L.fixed||{}),res:null,msg:null,pred:null,busy:false,el:null};L.choose.forEach(c=>{if(!G.st.d[c])G.st.d[c]=null;});}
    kfDragInit();},
  hud(G){return G.L.type==='design'?{label:'Tests',val:G.tries,target:'3 ★ = pass on the first test'}:{label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st;
    if(!S.el||!S.el.svg.isConnected||(L.type==='predict'&&S.el.r!==S.r)){
      const b=L.type==='predict'?kfBenchBuild(G):kfBuild(G);S.el.r=S.r;
      ngRC(main,h('div',{class:'kfwrap'},b),h('div',{class:'fgkey'},L.type==='predict'?'Pick a prediction on the right, then run the experiment.':L.type==='invest'?'A fair test changes only ONE thing. Drag a material onto its spot to swap it.':'Drag a material onto its glowing spot. Or tap a material, then tap its spot. Keyboard: Enter picks up, arrows choose, Enter drops.'));}
    else if(L.type!=='predict')kfStatic(G);
    if(L.type==='predict'&&S.el&&!S.busy)kfBenchFrame(G,S.ran?10:0);
    ngRC(side,...(L.type==='predict'?kfSidePredict(G):L.type==='invest'?kfSideInv(G):kfSideDesign(G)));
    if(S.msg||S.busy)return;
    if(L.type==='predict')ngSay(S.pick==null?'Make your prediction.':S.el&&G.L.rounds[S.r].a&&!S.ran?'Press **Run it** to test your prediction.':'Press **Check**.');
    else if(L.type==='invest')ngSay(S.phase==='A'?'Press **Run A** to test the first cooler.':'Change ONE thing, then press **Run B**.');
    else{const cost=L.budget&&kfReady(G)?kfCost(L,S.d):0;
      ngSay(!kfReady(G)?'Drag a material into every empty spot in the cooler.':L.budget&&cost>L.budget?'Over budget! Swap in cheaper materials.':!ngT()&&S.pred==null?'Now drag the **gold marker** to the hour you think it '+(L.soup?'goes cold.':'melts.'):'Ready? Press **Test it**.');}
  },
  hints(G){const L=G.L;
    if(L.type==='predict'){const R=L.rounds[G.st.r]||L.rounds[0];return [L.clue,'More mass = more energy needed to change temperature. Water needs more energy to warm up than sand or metal.','Answer: '+R.opts.find(o=>o[0]===R.ans)[1]+'.'];}
    if(L.type==='invest'){const S=G.st,R=L.rounds[S.r]||L.rounds[0];return [L.clue,'Cooler A is the starting point. Cooler B should match it in every way except the one thing you are testing.',
      S.phase==='Q'?'Answer: '+R.opts.find(o=>o[0]===R.ans)[1]:'Run A, then drag the **Big pack** into the cooler and run B. Leave the walls and lid alone.'];}
    const p=kfDesigns(L).filter(d=>kfPass(L,d)).sort((a,b)=>kfCost(L,a)-kfCost(L,b))[0];
    return [L.clue,'Heat gets in three ways: through the walls (conduction), through openings with moving air (convection), and from sunlight (radiation). Insulators, lids and light colors slow each one.',
      p?'A design that works: '+L.choose.map(c=>(L.soup&&c==='ice'?KF_SOUP:KF_TILE[c])[p[c]][0]).join(' + ')+'. Look for the gold tiles.':''];}
});
NGTHUMB.frozen=()=>{
  const dots=[[46,96],[60,124],[264,88],[278,120],[250,140],[160,40],[176,30]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${5+i%2}" fill="url(#tfh)"/>`).join('');
  const t=`<defs><linearGradient id="tfs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb4ff"/><stop offset="1" stop-color="#d9f0ff"/></linearGradient><pattern id="tff" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f5f8fd"/><circle cx="3" cy="3" r="2.3" fill="#fff" stroke="#c9d3e3"/><circle cx="8" cy="7.5" r="1.9" fill="#fff" stroke="#cfd8e6"/></pattern><radialGradient id="tfh"><stop offset="0" stop-color="#fff2c4"/><stop offset=".4" stop-color="#ff7a3c"/><stop offset="1" stop-color="#ff3b2f" stop-opacity="0"/></radialGradient></defs>
<rect width="320" height="180" fill="url(#tfs)"/><rect y="150" width="320" height="30" fill="#f1d595"/><circle cx="282" cy="30" r="20" fill="#ffd23f" stroke="#ffb000" stroke-width="3"/>
<path d="M80 62V146a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8V62h-22V132H102V62z" fill="url(#tff)" stroke="#4a5568" stroke-width="3"/><rect x="102" y="62" width="116" height="70" fill="#dff1ff"/>
<rect x="74" y="44" width="172" height="20" rx="7" fill="url(#tff)" stroke="#4a5568" stroke-width="3"/><rect x="110" y="82" width="28" height="48" rx="6" fill="#5bb9f5" stroke="#1f6fb8" stroke-width="2"/>
<path d="M162 104h40l-5 26h-30z" fill="#e45d74"/><circle cx="172" cy="98" r="11" fill="#fff4dc"/><circle cx="192" cy="98" r="11" fill="#ffb3c7"/><circle cx="182" cy="86" r="11" fill="#8a5a3c"/>${dots}`+ngStar(30,30,7,'#fff',.85);
  return ngWrap('frozen','#2f8fbf',t);
};
