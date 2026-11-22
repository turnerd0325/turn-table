/*<<EVDATA*/
const EV_TESTS={
  look:{n:'Look closely',q:'What does it look like?'},
  water:{n:'Add water',q:'Stir it into water'},
  vinegar:{n:'Add vinegar',q:'Drop vinegar on it'},
  iodine:{n:'Add iodine',q:'Drop iodine on it'},
  heat:{n:'Heat it',q:'Warm a pinch over a flame'},
  magnet:{n:'Magnet',q:'Hold a magnet close'},
  conduct:{n:'Conductivity',q:'Does the bulb light in a circuit?'},
  density:{n:'Density check',q:'Weigh it and measure its volume'}};
const EV_SUBS={
  sugar:{n:'Sugar',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'Melts, browns',magnet:'No pull',conduct:'Bulb off',density:'1.6 g/mL'},
  salt:{n:'Table salt',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'2.2 g/mL'},
  soda:{n:'Baking soda',look:'Fine white powder',water:'Dissolves',vinegar:'Fizzes!',iodine:'Stays brown',heat:'Gives off gas',magnet:'No pull',conduct:'Bulb lights',density:'2.2 g/mL'},
  cornstarch:{n:'Cornstarch',look:'Fine white powder',water:'Cloudy',vinegar:'No change',iodine:'Turns blue-black',heat:'Tans, clumps',magnet:'No pull',conduct:'Bulb off',density:'1.5 g/mL'},
  flour:{n:'Flour',look:'Fine white powder',water:'Cloudy',vinegar:'No change',iodine:'Turns blue-black',heat:'Browns, burns',magnet:'No pull',conduct:'Bulb off',density:'1.4 g/mL'},
  chalk:{n:'Chalk powder',look:'Gritty white powder',water:'Does not dissolve',vinegar:'Fizzes!',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb off',density:'2.7 g/mL'},
  iron:{n:'Iron filings',look:'Shiny dark bits',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'Sticks!',conduct:'Bulb off',density:'7.9 g/mL'},
  epsom:{n:'Epsom salt',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'Crumbles',magnet:'No pull',conduct:'Bulb lights',density:'1.7 g/mL'},
  citric:{n:'Citric acid',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'Melts, yellows',magnet:'No pull',conduct:'Bulb lights',density:'1.7 g/mL'},
  sand:{n:'Sand',look:'Gritty tan grains',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb off',density:'2.6 g/mL'},
  gold:{n:'Gold',look:'Shiny yellow metal',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'19.3 g/mL'},
  brass:{n:'Brass',look:'Shiny yellow metal',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'8.5 g/mL'},
  pyrite:{n:'Fool\'s gold',look:'Shiny yellow crystals',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb off',density:'5.0 g/mL'},
  leadbar:{n:'Painted lead',look:'Yellow painted block',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'11.3 g/mL'}};
/* reaction-or-not tests */
const EV_RT={
  gas:{n:'New gas?',q:'Look for new bubbles (not from boiling)',strong:true},
  solid:{n:'New solid?',q:'Look for a new solid or crust',strong:true},
  smell:{n:'New smell or light?',q:'Waft a sniff. Look for a glow.',strong:true},
  props:{n:'Same properties?',q:'Compare with the starting stuff',strong:true},
  color:{n:'Color change?',q:'Compare the color to before',strong:false},
  temp:{n:'Temperature change?',q:'Touch the container',strong:false}};
const EV_SC={
  soda_vin:{n:'Baking soda + vinegar',story:'You stir baking soda into a cup of vinegar.',truth:'chem',
    gas:[1,'Tons of new gas bubbles'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[0,'No. The gas and liquid are new stuff'],color:[0,'Still clear'],temp:[1,'The cup gets colder']},
  salt_water:{n:'Salt + water',story:'You stir table salt into warm water until it vanishes.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Still salt and water (evaporate it to get salt back)'],color:[0,'Still clear'],temp:[0,'No change']},
  ice:{n:'Ice melting',story:'An ice cube sits in a warm room.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Melted ice is still water (freeze it to get ice)'],color:[0,'Still clear'],temp:[1,'It feels cold']},
  dye:{n:'Food coloring + water',story:'You drop red food coloring into a glass of water.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Still dye and water, just spread out'],color:[1,'The water turns pink'],temp:[0,'No change']},
  rust:{n:'Rusting nail',story:'A nail has sat in salty water for a week.',truth:'chem',
    gas:[0,'No new gas'],solid:[1,'A flaky orange crust formed'],smell:[0,'Nothing new to smell'],props:[0,'No. Rust is crumbly and not magnetic'],color:[1,'Orange-brown patches'],temp:[0,'No change']},
  paper:{n:'Tearing paper',story:'You rip a sheet of paper into little bits.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Every piece is still paper'],color:[0,'Same color'],temp:[0,'No change']},
  match:{n:'Burning a match',story:'You strike a match and let it burn down.',truth:'chem',
    gas:[1,'Smoke and gas are given off'],solid:[1,'Black ash is left behind'],smell:[1,'Smoky smell and bright light'],props:[0,'No. Ash is not wood'],color:[1,'Wood turns black'],temp:[1,'It gets hot']},
  sandiron:{n:'Sand + iron filings',story:'You stir sand and iron filings together in a bowl.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. A magnet pulls the iron back out'],color:[0,'Just a speckled mix'],temp:[0,'No change']},
  alka:{n:'Fizzy tablet in water',story:'You drop a fizzy antacid tablet into a glass of water.',truth:'chem',
    gas:[1,'Streams of new bubbles'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[0,'No. The tablet is gone and gas escapes'],color:[0,'Still clear'],temp:[0,'No change']},
  egg:{n:'Frying an egg',story:'You crack an egg onto a hot pan.',truth:'chem',
    gas:[0,'No new gas'],solid:[1,'The runny egg turns solid'],smell:[1,'It smells cooked'],props:[0,'No. You cannot un-fry an egg'],color:[1,'Clear turns white'],temp:[1,'It is hot (but the pan is hot too)']},
  caramel:{n:'Heating sugar',story:'You heat sugar in a pan until it turns brown.',truth:'chem',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[1,'A sweet burnt-sugar smell'],props:[0,'No. Caramel is not sugar anymore'],color:[1,'White turns brown'],temp:[1,'It is hot']}};
/* answer logic ------------------------------------------------------------ */
function evSubsOK(cands,tests,secret){ /* do these tests separate secret from every other candidate? */
  return cands.every(c=>c===secret||tests.some(t=>EV_SUBS[c][t]!==EV_SUBS[secret][t]));}
function evParPowder(cs){
  const ts=cs.tests,n=ts.length;let best=99,bs=null;
  for(let m=1;m<(1<<n);m++){const sub=ts.filter((t,i)=>m>>i&1);if(sub.length<best&&evSubsOK(cs.cands,sub,cs.secret)){best=sub.length;bs=sub;}}
  if(!bs)throw new Error('unsolvable '+cs.secret);
  return {par:best,set:bs};
}
function evProof(sc,done,avail){ /* what do the finished tests prove? 'chem' | 'phys' | null */
  const S=EV_SC[sc];
  for(const t of done){if(EV_RT[t].strong&&t!=='props'&&S[t][0])return 'chem';}
  if(done.indexOf('props')>=0)return S.props[0]?'phys':'chem';
  if(avail.indexOf('props')<0&&['gas','solid','smell'].every(t=>done.indexOf(t)>=0))return 'phys';
  return null;
}
function evParReact(cs){
  const ts=cs.tests,n=ts.length;let best=99,bs=null;
  for(let m=1;m<(1<<n);m++){const sub=ts.filter((t,i)=>m>>i&1);if(sub.length<best&&evProof(cs.sc,sub,ts)){best=sub.length;bs=sub;}}
  if(!bs)throw new Error('no proof '+cs.sc);
  if(evProof(cs.sc,bs,ts)!==EV_SC[cs.sc].truth)throw new Error('proof disagrees '+cs.sc);
  return {par:best,set:bs};
}
const EVP=['look','water','vinegar','iodine','heat','magnet','conduct'],EVR=['gas','solid','smell','props','color','temp'],EVR2=['gas','solid','smell','color','temp'];
const EV_LEVELS=[
 {pack:'Pack 1: Kitchen Powders',name:'Kitchen Mix-Up',kind:'powder',
  story:'Three white powders from the pantry lost their labels. Which one is baking soda?',
  clue:'Baking soda is a base. Acids like vinegar make it bubble.',
  intro:'New tool: the field guide. Each row shows what a substance does in each test. Run a test on the mystery sample, then match its result to a row.',
  fact:'A chemical reaction between an acid (vinegar) and baking soda makes carbon dioxide gas. That gas is the fizz.',
  cases:[{cands:['sugar','salt','soda'],secret:'soda',tests:['look','water','vinegar']}]},
 {pack:null,name:'Starch Detective',kind:'powder',
  story:'A cook mixed up a jar of cornstarch. Find it among these four.',
  clue:'Iodine turns starchy foods blue-black. Starch makes water cloudy, too.',
  fact:'Iodine reacts with starch to make a deep blue-black color. Chemists use that to find starch in foods.',
  cases:[{cands:['sugar','cornstarch','soda','chalk'],secret:'cornstarch',tests:['look','water','vinegar','iodine']}]},
 {pack:null,name:'Sweet or Salty?',kind:'powder',
  story:'Two jars look the same: white crystals. One of them is sugar. Which?',
  clue:'Looks can fool you. Try a test that depends on what the stuff is made of.',
  fact:'Sugar is made of molecules, so it does not carry current. Salt breaks into charged particles in water, so the bulb lights.',
  cases:[{cands:['sugar','salt','epsom'],secret:'sugar',tests:['look','water','vinegar','heat','conduct']}]},
 {pack:null,name:'Flour Power',kind:'powder',
  story:'Cornstarch, flour and baking soda all look alike. Name the flour.',
  clue:'Flour and cornstarch both have starch. Which test might tell them apart?',
  fact:'Flour also contains proteins and other stuff, so it browns and burns when heated. Pure cornstarch just tans.',
  cases:[{cands:['flour','cornstarch','soda'],secret:'flour',tests:['look','water','vinegar','iodine','heat']}]},
 {pack:null,name:'Three Samples',kind:'powder',
  story:'The lab has three mystery samples today. Name all three!',
  clue:'Each sample has its own list of candidates. Pick the best test for each one.',
  fact:'Every pure substance has its own set of properties. Like a fingerprint, they identify what it is.',
  cases:[{cands:['sugar','salt','soda'],secret:'soda',tests:['water','vinegar','heat']},
         {cands:['iron','sand','chalk'],secret:'iron',tests:['water','vinegar','magnet']},
         {cands:['salt','citric','epsom'],secret:'salt',tests:['look','heat','conduct']}]},
 {pack:'Pack 2: Tough Cases',name:'Two Tests Needed',kind:'powder',
  story:'The heat lamp is broken. With only these tests, find the table salt.',
  clue:'No single test points to salt. Combine two tests to rule out every other candidate.',
  intro:'Some cases need more than one test. Each test narrows the list. Use as few as you can.',
  fact:'Scientists often use two or three properties together. One property alone can match many substances.',
  cases:[{cands:['salt','soda','sugar','chalk'],secret:'salt',tests:['look','vinegar','conduct']}]},
 {pack:null,name:'Dark Dust',kind:'powder',
  story:'A sample from the workshop floor. Is it iron, sand or chalk?',
  clue:'One tool is great for metal. Another one is great for chalk.',
  fact:'Iron is one of only a few elements that magnets pull. That makes sorting scrap metal easy.',
  cases:[{cands:['iron','sand','chalk','soda'],secret:'chalk',tests:['water','vinegar','magnet']}]},
 {pack:null,name:'Salt Family',kind:'powder',
  story:'Epsom salt, table salt and citric acid look like twins. Find the Epsom salt.',
  clue:'All three dissolve and light the bulb. Think about what happens when you heat them.',
  fact:'Epsom salt holds water inside its crystals. Heat drives that water out and the crystals crumble.',
  cases:[{cands:['epsom','salt','citric','sugar'],secret:'epsom',tests:['look','water','iodine','heat','conduct']}]},
 {pack:null,name:'Weigh It In',kind:'powder',
  story:'Four jars have different weights for the same scoop. Use density to find the table salt.',
  clue:'Density is mass divided by volume. Every substance has its own density.',
  intro:'New test: Density check. Density is how much mass fits in a certain volume (g/mL).',
  fact:'Density = mass ÷ volume. It does not change with the size of the sample, so it helps identify a substance.',
  cases:[{cands:['salt','sugar','cornstarch','chalk'],secret:'salt',tests:['look','density','heat']}]},
 {pack:null,name:'Fool\'s Gold',kind:'powder',
  story:'A pawn shop customer brings in a shiny yellow bar. Is it real gold, or a fake?',
  clue:'Several metals look the same. Which test can tell them apart for sure?',
  fact:'Gold is extremely dense (19.3 g/mL). Fake gold is lighter, so density catches the cheat every time.',
  cases:[{cands:['gold','brass','pyrite','leadbar'],secret:'gold',tests:['look','magnet','density']}]},
 {pack:null,name:'Mystery Trio',kind:'powder',
  story:'Three tricky samples. The tools in each case are limited. Be smart!',
  clue:'Check the tests available for each sample before you choose.',
  fact:'A good investigator plans tests that rule out the most suspects at once.',
  cases:[{cands:['salt','soda','sugar','chalk'],secret:'salt',tests:['look','vinegar','conduct']},
         {cands:['flour','cornstarch','chalk','sand'],secret:'flour',tests:['look','water','iodine','heat']},
         {cands:['cornstarch','flour'],secret:'cornstarch',tests:['look','iodine','heat']}]},
 {pack:'Pack 3: Reaction or Not?',name:'Fizz or Fake?',kind:'react',
  story:'Three events happened in the lab. Did a chemical reaction make new stuff, or was it only a physical change?',
  clue:'Look for strong evidence: a new gas, a new solid, a new smell or light, or new properties.',
  intro:'Run evidence tests. Some are strong proof. Others (color, temperature) are only weak clues. When you have strong proof, decide.',
  fact:'In a chemical reaction the atoms rearrange to make NEW substances with new properties. In a physical change the substance stays the same.',
  cases:[{sc:'soda_vin',tests:EVR},{sc:'salt_water',tests:EVR},{sc:'ice',tests:EVR}]},
 {pack:null,name:'Weak Clues',kind:'react',
  story:'A color change and a temperature change are tempting clues. Are they proof?',
  clue:'A color change alone does not prove a reaction. Dye spreading in water changes the color too.',
  fact:'Color and temperature changes can come from physical changes, such as dissolving. You need strong evidence to be sure.',
  cases:[{sc:'dye',tests:EVR},{sc:'rust',tests:EVR},{sc:'paper',tests:EVR}]},
 {pack:null,name:'Broken Comparer',kind:'react',
  story:'The properties kit is broken. Use the other tests to decide.',
  clue:'To call it physical, you must check for new gas, new solid and new smell and find none.',
  fact:'Proving something did NOT happen takes more work. You have to rule out every sign of a reaction.',
  cases:[{sc:'match',tests:EVR2},{sc:'sandiron',tests:EVR2},{sc:'alka',tests:EVR2}]},
 {pack:null,name:'Cold Case',kind:'react',
  story:'The final cases. Watch out for weak clues that point the wrong way.',
  clue:'Cold, hot, and colored can all happen in a physical change. Look for strong proof.',
  fact:'You cannot un-fry an egg. New substances with new properties are the sign of a chemical change.',
  cases:[{sc:'dye',tests:EVR2},{sc:'egg',tests:EVR2},{sc:'ice',tests:EVR2}]}
];
EV_LEVELS.forEach(L=>{L.cases.forEach(c=>{const r=L.kind==='powder'?evParPowder(c):evParReact(c);c.par=r.par;c.set=r.set;});
  L.par=L.cases.reduce((a,c)=>a+c.par,0);L.slack=L.kind==='react'?L.cases.length:0;});
const EV_N=EV_LEVELS.length;
/*EVDATA>>*/
/*<<EVUI*/
/* ===== Evidence Lab: "Lab bench detective" (Session 9) =====
   Drag a tool from the tray onto the bench. The test plays out on a fresh pinch of the
   sample, the result writes itself into the lab notebook, and the field guide clipboard
   rules out every substance that does not match. Reaction levels: drag evidence tools onto
   the scene to collect Strong proof / Weak clue stickers, then stamp your call. */
const EV_PACKS={0:'Pack 1: Kitchen Powders',5:'Pack 2: Tough Cases',11:'Pack 3: Reaction or Not?'};
let EVS=null,EV_DRAG=null;
const evLv=()=>EV_LEVELS[EVS.i],evCase=()=>evLv().cases[EVS.ci];
const evMini=L=>{const pw=L.kind==='powder',col=pw?'#6aa7ff':'#ff8a5c';
  const b=pw?`<path d="M11 4h10M13 4v8l-6 11a3 3 0 0 0 3 4h12a3 3 0 0 0 3-4l-6-11V4" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round"/><path d="M9.5 19h13" stroke="${col}" stroke-width="2.4"/><circle cx="14" cy="23" r="1.4" fill="${col}"/><circle cx="19" cy="22" r="1.1" fill="${col}"/>`
  :`<circle cx="9" cy="16" r="5" fill="none" stroke="${col}" stroke-width="2.4"/><circle cx="23" cy="16" r="5" fill="none" stroke="#37e0c1" stroke-width="2.4"/><path d="M14 16h4m-1.8-2.2L18 16l-1.8 2.2" fill="none" stroke="#8d97b5" stroke-width="2" stroke-linecap="round"/>`;
  return svgEl(`<svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true">${b}</svg>`);};
function renderEvidenceSetup(){renderLevelPicker($('evLevels'),$('evTotal'),'evidence',EV_LEVELS,EV_PACKS,evStart,evMini);}

/* ---------- tool names and icons ---------- */
const EV_TOOL={look:['Magnifier','Look closely'],water:['Water','Stir into water'],vinegar:['Vinegar','Drop vinegar on'],iodine:['Iodine','Drop iodine on'],
  heat:['Flame','Heat a pinch'],magnet:['Magnet','Hold it close'],conduct:['Bulb tester','Test in a circuit'],density:['Density kit','Mass ÷ volume'],
  gas:['Bubble check','New gas?'],solid:['Solid check','New solid?'],smell:['Sniff & glow','New smell or light?'],props:['Compare','Same properties?'],
  color:['Color chart','Color change?'],temp:['Thermometer','Temperature change?']};
const EV_SHORT={look:'Look',water:'Water',vinegar:'Vinegar',iodine:'Iodine',heat:'Heat',magnet:'Magnet',conduct:'Bulb',density:'Density'};
const EV_ICON={
  look:'<circle cx="17" cy="16" r="10" fill="#dff1ff" stroke="#2d3f63" stroke-width="3.2"/><path d="M12 12a6 6 0 0 1 6-3" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M24.5 23.5l9 9" stroke="#7a4a22" stroke-width="5.5" stroke-linecap="round"/>',
  water:'<path d="M8 8h22l-2 4v20a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V12z" fill="#eef6ff" stroke="#6f86ad" stroke-width="2.2"/><path d="M10.5 20h17v12a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" fill="#4aa8ff"/><path d="M10.5 20q8.5 3 17 0" fill="#8fd0ff"/>',
  vinegar:'<rect x="15" y="3" width="8" height="7" rx="2" fill="#c0392b"/><path d="M14 10h10v5l4 5v14a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V20l4-5z" fill="#f6efc9" stroke="#8a7b45" stroke-width="2"/><rect x="11" y="22" width="16" height="9" rx="2" fill="#fff" stroke="#c0392b" stroke-width="1.5"/><text x="19" y="29.5" font-size="7.5" font-weight="900" text-anchor="middle" fill="#c0392b">V</text>',
  iodine:'<rect x="14" y="3" width="10" height="9" rx="4" fill="#3b3f4a"/><path d="M15 12h8v16l-4 6-4-6z" fill="#e9eef7" stroke="#6f7b93" stroke-width="2"/><path d="M16.2 19h5.6v8.6L19 32l-2.8-4.4z" fill="#9a4b12"/><circle cx="19" cy="37" r="2" fill="#9a4b12"/>',
  heat:'<path d="M19 4c5 7 9 10 9 17a9 9 0 0 1-18 0c0-5 3-7 4-11 1 3 3 4 3 4 0-4 0-7 2-10z" fill="#ff8a2a"/><path d="M19 15c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-4 3-7 .5 2 2 2.5 2 2.5z" fill="#ffe066"/><rect x="13" y="32" width="12" height="5" rx="1.5" fill="#6b7891"/>',
  magnet:'<path d="M9 6h7v15a3 3 0 0 0 6 0V6h7v15a10 10 0 0 1-20 0z" fill="#e2483f"/><rect x="9" y="6" width="7" height="6" fill="#d9e0ec"/><rect x="22" y="6" width="7" height="6" fill="#d9e0ec"/><path d="M12 25q7 6 14 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>',
  conduct:'<circle cx="19" cy="13" r="9" fill="#fff3b0" stroke="#c9a227" stroke-width="2"/><path d="M15 21h8v5h-8z" fill="#9aa5ba"/><path d="M16 13l2 3 2-3 2 3" stroke="#c97a00" stroke-width="1.6" fill="none"/><rect x="6" y="28" width="26" height="8" rx="2" fill="#2f6bff"/><rect x="28" y="30" width="4" height="4" fill="#b9c6e0"/>',
  density:'<rect x="5" y="30" width="28" height="6" rx="2" fill="#4c5a78"/><rect x="12" y="32" width="14" height="3" rx="1" fill="#7ef0c4"/><path d="M15 6h8v22h-8z" fill="#eef6ff" stroke="#6f86ad" stroke-width="2"/><rect x="16" y="16" width="6" height="11" fill="#4aa8ff"/><path d="M23 11h3M23 16h3M23 21h3" stroke="#6f86ad" stroke-width="1.6"/>',
  gas:'<circle cx="13" cy="26" r="6" fill="#bfe6ff" stroke="#3d8bd9" stroke-width="2"/><circle cx="24" cy="17" r="5" fill="#bfe6ff" stroke="#3d8bd9" stroke-width="2"/><circle cx="16" cy="9" r="3.5" fill="#bfe6ff" stroke="#3d8bd9" stroke-width="2"/><circle cx="29" cy="30" r="3" fill="#bfe6ff" stroke="#3d8bd9" stroke-width="2"/>',
  solid:'<path d="M7 28l6-12 8 3 9-7 2 16z" fill="#c9d1df" stroke="#59657f" stroke-width="2" stroke-linejoin="round"/><circle cx="25" cy="12" r="7" fill="#dff1ff" fill-opacity=".7" stroke="#2d3f63" stroke-width="2.4"/><path d="M30 17l5 5" stroke="#7a4a22" stroke-width="3.5" stroke-linecap="round"/>',
  smell:'<path d="M8 14q4-4 8 0t8 0 8 0M8 21q4-4 8 0t8 0 8 0" stroke="#8a5fd6" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M19 27l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#ffd23f"/>',
  props:'<rect x="4" y="9" width="13" height="18" rx="3" fill="#fff" stroke="#3fae8a" stroke-width="2.2"/><rect x="21" y="9" width="13" height="18" rx="3" fill="#fff" stroke="#e2483f" stroke-width="2.2"/><path d="M17 15h4M17 21h4" stroke="#2d3f63" stroke-width="2"/><circle cx="10.5" cy="18" r="3" fill="#3fae8a"/><path d="M24.5 21l3-6 3 6z" fill="#e2483f"/>',
  color:'<rect x="5" y="6" width="9" height="26" rx="3" fill="#f2c94c"/><rect x="15" y="6" width="9" height="26" rx="3" fill="#e2483f"/><rect x="25" y="6" width="9" height="26" rx="3" fill="#2f6bff"/><circle cx="9.5" cy="27" r="2" fill="#fff"/>',
  temp:'<rect x="15" y="4" width="8" height="24" rx="4" fill="#fff" stroke="#6f7b93" stroke-width="2"/><circle cx="19" cy="31" r="6" fill="#e2483f" stroke="#6f7b93" stroke-width="2"/><rect x="17.5" y="14" width="3" height="16" fill="#e2483f"/><path d="M24 10h4M24 15h4M24 20h4" stroke="#6f7b93" stroke-width="1.6"/>'};
const evIcon=(t,sz)=>`<svg viewBox="0 0 38 40" width="${sz||34}" height="${sz||34}" aria-hidden="true">${EV_ICON[t]}</svg>`;

/* ---------- how a substance looks ---------- */
function evLookOf(k){const l=EV_SUBS[k].look;
  if(/painted/i.test(l))return {c:'#f2c230',c2:'#a7800c',form:'block',paint:1};
  if(/yellow metal/i.test(l))return {c:'#f6d35e',c2:'#a8780f',form:'block',shine:1};
  if(/yellow crystals/i.test(l))return {c:'#e3c050',c2:'#8f6d17',form:'block',cubes:1};
  if(/dark/i.test(l))return {c:'#5b6170',c2:'#272b33',form:'bits'};
  if(/tan/i.test(l))return {c:'#dcc08a',c2:'#a88a4f',form:'grains'};
  if(/crystals/i.test(l))return {c:'#ffffff',c2:'#b9c4d8',form:'crystals'};
  if(/gritty/i.test(l))return {c:'#f4f2ec',c2:'#c3bdae',form:'grit'};
  return {c:'#fbfbfd',c2:'#cdd4e3',form:'powder'};}
function evSampleLook(){ /* neutral until "Look closely" has been run */
  const cs=evCase();
  if(EVS.done.indexOf('look')>=0&&EVS.pending!=='look')return evLookOf(cs.secret);
  const metal=cs.cands.every(c=>evLookOf(c).form==='block');
  return {c:'#d9dee8',c2:'#9aa4b8',form:metal?'block':'powder',unknown:1};}
let evSeed=1;const evR=()=>(evSeed=(evSeed*9301+49297)%233280)/233280;
function evPile(lk,x,y,w,cls){ /* sample sitting at (x,y) bottom-centre, width w */
  evSeed=7;const s=w/80;
  if(lk.form==='block'){const bw=40*s,bh=22*s;
    return `<g class="${cls||''}"><rect x="${x-bw/2}" y="${y-bh}" width="${bw}" height="${bh}" rx="${4*s}" fill="${lk.c}" stroke="${lk.c2}" stroke-width="1.6"/>`+
      `<path d="M${x-bw/2+3*s} ${y-bh+5*s}h${bw-6*s}" stroke="#fff" stroke-opacity=".6" stroke-width="${2.4*s}" stroke-linecap="round"/>`+
      (lk.paint?`<path d="M${x+6*s} ${y-6*s}l${8*s} -${5*s}l${3*s} ${4*s}z" fill="#8f96a3"/>`:'')+
      (lk.cubes?`<path d="M${x-10*s} ${y-bh}l${6*s} -${7*s}l${8*s} ${7*s}M${x+4*s} ${y-bh}l${5*s} -${6*s}l${6*s} ${6*s}" fill="${lk.c}" stroke="${lk.c2}" stroke-width="1.4"/>`:'')+`</g>`;}
  const hw=w/2,hh=w*.36;let d=`<path d="M${x-hw} ${y} Q${x-hw*.55} ${y-hh*.35} ${x-hw*.3} ${y-hh*.8} Q${x} ${y-hh*1.15} ${x+hw*.3} ${y-hh*.8} Q${x+hw*.55} ${y-hh*.35} ${x+hw} ${y} Z" fill="${lk.c}" stroke="${lk.c2}" stroke-width="1.4"/>`;
  let tex='';const n=lk.form==='powder'?26:16;
  for(let i=0;i<n;i++){const u=evR()*2-1,px=x+u*hw*.8,top=y-hh*(1-Math.abs(u))*.95,py=top+evR()*(y-top-2)+1;
    if(lk.form==='crystals')tex+=`<rect x="${px-2*s}" y="${py-2*s}" width="${4*s}" height="${4*s}" fill="#fff" stroke="${lk.c2}" stroke-width=".8" transform="rotate(${evR()*60} ${px} ${py})"/>`;
    else if(lk.form==='bits')tex+=`<path d="M${px-3*s} ${py}l${6*s} -${2*s}" stroke="#c9ced8" stroke-width="${1.4*s}" stroke-linecap="round"/>`;
    else if(lk.form==='grains')tex+=`<circle cx="${px}" cy="${py}" r="${2*s}" fill="#c9a86b"/>`;
    else if(lk.form==='grit')tex+=`<path d="M${px} ${py}l${2.5*s} ${1*s}l-${1*s} ${2*s}z" fill="#d6d0c0"/>`;
    else tex+=`<circle cx="${px}" cy="${py}" r="${.9*s}" fill="${lk.c2}" opacity=".7"/>`;}
  return `<g class="${cls||''}">${d}${tex}</g>`;}

/* ---------- the bench ---------- */
const EVBX=400,EVBY=336; /* beaker bottom centre */
function evDefs(){return `<defs>
<linearGradient id="evWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f5fb"/><stop offset="1" stop-color="#d4dcec"/></linearGradient>
<pattern id="evTile" width="46" height="46" patternUnits="userSpaceOnUse"><path d="M46 0H0V46" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/></pattern>
<linearGradient id="evTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6b88"/><stop offset="1" stop-color="#3c4864"/></linearGradient>
<linearGradient id="evFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3550"/><stop offset="1" stop-color="#1b2238"/></linearGradient>
<linearGradient id="evGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="#e8f3ff" stop-opacity=".18"/><stop offset=".8" stop-color="#e8f3ff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient>
<radialGradient id="evBulbGlow"><stop offset="0" stop-color="#fff6b0" stop-opacity=".95"/><stop offset=".5" stop-color="#ffd23f" stop-opacity=".45"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
<radialGradient id="evFlameG" cx=".5" cy=".75" r=".7"><stop offset="0" stop-color="#fff7c2"/><stop offset=".45" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5a1f" stop-opacity=".1"/></radialGradient>
<linearGradient id="evMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef2f8"/><stop offset=".5" stop-color="#9aa5ba"/><stop offset="1" stop-color="#5f6a80"/></linearGradient>
<filter id="evBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<clipPath id="evBkClip"><path d="M344 202h112v122q0 12-12 12h-88q-12 0-12-12z"/></clipPath>
</defs>`;}
function evRoom(){
  const bottle=(x,h,c,lab)=>`<g><rect x="${x-11}" y="${96-h}" width="22" height="${h}" rx="5" fill="${c}" opacity=".85"/><rect x="${x-11}" y="${96-h}" width="22" height="${h}" rx="5" fill="url(#evGlass)"/><rect x="${x-5}" y="${88-h}" width="10" height="9" rx="2" fill="#56627c"/>${lab?`<rect x="${x-8}" y="${96-h*.62}" width="16" height="${h*.3}" rx="2" fill="#fff" opacity=".9"/>`:''}</g>`;
  const flask=(x,c)=>`<g><path d="M${x-5} 50h10v14l14 26q2 6-4 6h-30q-6 0-4-6l14-26z" fill="${c}" opacity=".8"/><path d="M${x-5} 50h10v14l14 26q2 6-4 6h-30q-6 0-4-6l14-26z" fill="url(#evGlass)" stroke="#9fb2cf" stroke-width="1.5"/></g>`;
  return `<rect width="800" height="340" fill="url(#evWall)"/><rect width="800" height="340" fill="url(#evTile)"/>
<rect x="70" y="96" width="660" height="9" rx="3" fill="#aeb9cf"/><rect x="70" y="105" width="660" height="6" fill="#0b1430" opacity=".07"/>
${bottle(130,46,'#7fd3ff',1)}${bottle(162,34,'#ffcf6b',1)}${flask(230,'#b6f0c9')}${bottle(300,52,'#c9b8ff',1)}${bottle(560,40,'#ff9fa8',1)}${flask(620,'#ffe08a')}${bottle(690,48,'#9ee6e0',1)}
<g transform="translate(470 30)"><rect width="56" height="44" rx="4" fill="#fff" stroke="#c7d0e2"/><g fill="#7da4ff">${[0,1,2,3,4,5].map(i=>`<rect x="${5+i*8}" y="8" width="6" height="6" rx="1" opacity="${.4+i*.1}"/>`).join('')}${[0,1,2,3,4,5].map(i=>`<rect x="${5+i*8}" y="17" width="6" height="6" rx="1" fill="#ff9f7a" opacity=".7"/>`).join('')}</g><rect x="5" y="28" width="46" height="3" rx="1" fill="#d6dcea"/><rect x="5" y="34" width="30" height="3" rx="1" fill="#d6dcea"/></g>
<rect x="0" y="336" width="800" height="18" fill="url(#evTop)"/><rect x="0" y="336" width="800" height="3" fill="#8392b0"/><rect x="0" y="354" width="800" height="120" fill="url(#evFront)"/>
<path d="M0 380h800M0 420h800" stroke="#fff" stroke-opacity=".03" stroke-width="10"/>
<ellipse cx="${EVBX}" cy="341" rx="80" ry="6" fill="#0b1430" opacity=".25"/>`;}
function evBeaker(inner){return `<g id="evVessel">
<path d="M338 196h124l-6 8v120q0 14-14 14h-84q-14 0-14-14V204z" fill="#eaf4ff" fill-opacity=".25"/>
<g clip-path="url(#evBkClip)" id="evIn">${inner||''}</g>
<path d="M338 196h124l-6 8v120q0 14-14 14h-84q-14 0-14-14V204z" fill="url(#evGlass)" stroke="#8ea3c4" stroke-width="2.6" stroke-linejoin="round"/>
<path d="M440 236h10M444 256h6M440 276h10M444 296h6M440 316h10" stroke="#8ea3c4" stroke-width="1.6"/>
<rect x="350" y="212" width="7" height="104" rx="3.5" fill="#fff" opacity=".55"/>
<ellipse class="evring" cx="400" cy="270" rx="92" ry="92" fill="none" stroke="#ffd23f" stroke-width="4" stroke-dasharray="10 8"/></g>`;}
function evBag(lk,lab){return `<g transform="translate(205 0)">
<ellipse cx="0" cy="340" rx="54" ry="5" fill="#0b1430" opacity=".2"/>
<path d="M-46 236h92l4 100h-100z" fill="#f4f8ff" fill-opacity=".72" stroke="#9fb2cf" stroke-width="2"/>
<rect x="-46" y="230" width="92" height="9" rx="2" fill="#c43c3c"/><path d="M-44 244h88" stroke="#9fb2cf" stroke-dasharray="4 3"/>
${evPile(lk,0,333,58)}
<rect x="-34" y="252" width="68" height="34" rx="4" fill="#fff" stroke="#d2d9e6"/>
<text x="0" y="265" font-size="9" font-weight="900" text-anchor="middle" fill="#c43c3c" letter-spacing="1">EVIDENCE</text>
<text x="0" y="280" font-size="11" font-weight="800" text-anchor="middle" fill="#24304d">${lab}</text></g>`;}
function evDrawStage(){
  const L=evLv(),svg=$('evSvg');let body;
  if(L.kind==='powder'){const lk=evSampleLook();
    body=evRoom()+evBag(lk,'Sample '+(EVS.ci+1)+' ?')+evBeaker(evPile(lk,EVBX,EVBY,80,'evpile'));}
  else body=evRoom()+evScene(evCase().sc);
  svg.innerHTML=evDefs()+body+'<g id="evFx"></g>';
  $('evTag').hidden=true;$('evStamp').hidden=true;
}

/* ---------- small animation helpers ---------- */
const evQ=sel=>$('evSvg').querySelector(sel);
const evWait=ms=>new Promise(r=>setTimeout(r,Art.reduced()?0:ms));
function evAdd(markup){const g=$('evFx');g.insertAdjacentHTML('beforeend',markup);return g.lastElementChild;}
function evTw(el,attr,a,b,dur,e){return Art.tween({from:a,to:b,dur,ease:e||'outCubic',step:v=>el&&el.setAttribute(attr,v)}).done;}
function evMove(el,x0,y0,x1,y1,dur,e,rot){return Art.tween({from:0,to:1,dur,ease:e||'outCubic',step:t=>el&&el.setAttribute('transform',`translate(${x0+(x1-x0)*t} ${y0+(y1-y0)*t})${rot?` rotate(${rot*t})`:''}`)}).done;}
function evLiquid(color,op,id){const e=document.createElementNS('http://www.w3.org/2000/svg','g');e.id=id||'evLiq';
  e.innerHTML=`<rect x="330" y="336" width="140" height="20" fill="${color}" opacity="${op}"/><ellipse cx="400" cy="336" rx="56" ry="4" fill="#fff" opacity=".45"/>`;
  $('evSvg').querySelector('#evIn').prepend(e);return e;}
async function evFill(liq,y,dur){const r=liq.firstElementChild,m=liq.lastElementChild;
  await Art.tween({from:336,to:y,dur,ease:'inOutQuad',step:v=>{r.setAttribute('y',v);r.setAttribute('height',340-v);m.setAttribute('cy',v);}}).done;}
function evBubbles(x0,x1,yb,yt,n,col,cls){let s='';for(let i=0;i<n;i++){const x=x0+(x1-x0)*((i*37)%n)/n,r=2+(i%3)*1.4;
  s+=`<circle class="${cls||'evbub'}" cx="${x}" cy="${yb}" r="${r}" fill="${col||'#fff'}" fill-opacity=".55" stroke="#fff" stroke-width="1" style="--rise:${yt-yb}px;animation-delay:${(i*0.17)%1.4}s"/>`;}return s;}
function evPour(x,y){return `<path class="evstream" d="M${x} ${y} Q${x-6} ${y+40} ${x-14} ${y+90}" stroke-width="6" fill="none" stroke-linecap="round"/>`;}
function evWisps(x,y,col,n){let s='';for(let i=0;i<(n||3);i++)s+=`<path class="evwisp" d="M${x-20+i*20} ${y}q-10-18 0-36t0-36" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round" style="animation-delay:${i*.45}s"/>`;return s;}

/* ---------- powder tests: each plays the real result ---------- */
async function evPlayPowder(t){
  const cs=evCase(),sub=cs.secret,res=EV_SUBS[sub][t],pile=evQ('.evpile'),lk=t==='look'?evLookOf(sub):evSampleLook();
  if(t==='look'){
    const lens=evAdd(`<g transform="translate(700 120)"><path d="M58 58l60 60" stroke="#7a4a22" stroke-width="16" stroke-linecap="round"/><circle r="84" cx="0" cy="0" fill="#fff"/><clipPath id="evLensC"><circle r="78"/></clipPath><g clip-path="url(#evLensC)"><rect x="-90" y="-90" width="180" height="180" fill="${lk.form==='block'?lk.c2:lk.form==='bits'?'#cfd6e3':'#4d5b7a'}"/>${evLensPattern(lk)}</g><circle r="80" fill="none" stroke="#2d3f63" stroke-width="9"/><path d="M-50-40a64 64 0 0 1 40-30" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/></g>`);
    await evMove(lens,720,120,400,200,700,'outBack');await evWait(900);
    if(pile)pile.outerHTML=evPile(lk,EVBX,EVBY,80,'evpile');
    const bag=$('evSvg').querySelector('g[transform="translate(205 0)"]');if(bag)bag.outerHTML=evBag(lk,'Sample '+(EVS.ci+1));
    return;}
  if(t==='water'||t==='vinegar'||t==='conduct'){
    const vin=t==='vinegar',liqC=vin?'#f2e7b0':'#9fd3ff',liq=evLiquid(liqC,vin?.55:.5);
    const src=evAdd(`<g><g>${vin?`<rect x="-12" y="-62" width="24" height="16" rx="4" fill="#c0392b"/><path d="M-14-46h28v12l10 14v40q0 8-8 8h-32q-8 0-8-8v-40l10-14z" fill="#f6efc9" stroke="#8a7b45" stroke-width="2.5"/><rect x="-20" y="-6" width="40" height="22" rx="3" fill="#fff" stroke="#c0392b" stroke-width="2"/><text y="9" font-size="11" font-weight="900" text-anchor="middle" fill="#c0392b">VINEGAR</text>`
      :`<path d="M-30-40h60l-4 6v56q0 8-8 8h-36q-8 0-8-8v-56z" fill="#eef6ff" fill-opacity=".6" stroke="#8ea3c4" stroke-width="2.5"/><path d="M-26-6h52v28q0 6-6 6h-40q-6 0-6-6z" fill="#4aa8ff" opacity=".8"/>`}</g></g>`);
    await evMove(src,560,140,488,150,500,'outCubic',-55);
    const st=evAdd(evPour(452,178));await evFill(liq,vin?292:262,800);st.remove();await evMove(src,488,150,560,120,350,'inQuad',0);src.remove();
    if(t==='conduct')return evPlayCircuit(res,pile,liq);
    if(vin&&/Fizz/.test(res)){evAdd(evBubbles(352,448,330,200,22));
      const foam=evAdd(`<path d="M346 292q9-8 18 0t18 0 18 0 18 0 18 0 18 0v8h-108z" fill="#fff" opacity=".9"/>`);
      await evMove(foam,0,0,0,-78,1300,'outCubic');if(pile)evTw(pile,'opacity',1,.25,900);await evWait(400);return;}
    if(t==='water'&&res==='Dissolves'){evAdd(`<g class="evswirl"><ellipse cx="400" cy="300" rx="34" ry="8" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/><ellipse cx="400" cy="282" rx="24" ry="6" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/></g>`);
      if(pile)await evTw(pile,'opacity',1,0,1300,'inOutQuad');return;}
    if(t==='water'&&res==='Cloudy'){const r=liq.firstElementChild;if(pile)evTw(pile,'opacity',1,.15,1200);
      await Art.tween({from:0,to:1,dur:1300,step:v=>{r.setAttribute('fill',v>.5?'#eef1f6':liqC);r.setAttribute('opacity',.5+.42*v);}}).done;return;}
    /* no change / does not dissolve: a few grains drift and settle */
    evAdd(`<g fill="${lk.c2}">${[0,1,2,3,4].map(i=>`<circle class="evsettle" cx="${375+i*12}" cy="300" r="2" style="animation-delay:${i*.15}s"/>`).join('')}</g>`);
    await evWait(900);return;}
  if(t==='iodine'){
    const dr=evAdd(`<g><rect x="-9" y="-70" width="18" height="18" rx="7" fill="#3b3f4a"/><path d="M-7-52h14v34l-7 12-7-12z" fill="#e9eef7" stroke="#6f7b93" stroke-width="2"/><path d="M-5-40h10v22l-5 9-5-9z" fill="#9a4b12"/></g>`);
    await evMove(dr,400,60,400,200,600,'outCubic');
    for(let k=0;k<3;k++){const d=evAdd(`<circle cx="400" cy="200" r="4.5" fill="#9a4b12"/>`);evTw(d,'cy',200,310,420,'inQuad').then(()=>d.remove());await evWait(260);}
    await evWait(250);const blue=/blue/.test(res);
    const spot=evAdd(`<ellipse cx="400" cy="316" rx="1" ry="1" fill="${blue?'#1c2150':'#9a4b12'}" opacity="${blue?.95:.75}"/>`);
    await Promise.all([evTw(spot,'rx',1,blue?34:22,800),evTw(spot,'ry',1,blue?12:7,800)]);
    await evMove(dr,400,200,400,40,350,'inQuad');dr.remove();return;}
  if(t==='heat'){
    const v=$('evSvg').querySelector('#evVessel');
    const rig=evAdd(`<g><path d="M326 270h148M336 270l-14 66M464 270l14 66M400 270v-4" stroke="#5c6680" stroke-width="5" stroke-linecap="round"/><rect x="384" y="300" width="32" height="36" rx="4" fill="url(#evMetal)"/><rect x="376" y="330" width="48" height="8" rx="3" fill="#4c5a78"/>
      <g class="evflame"><path d="M400 238c10 14 18 22 18 38a18 18 0 0 1-36 0c0-14 8-20 18-38z" fill="url(#evFlameG)"/><path d="M400 258c5 7 9 11 9 18a9 9 0 0 1-18 0c0-7 4-10 9-18z" fill="#7cc4ff" opacity=".85"/></g></g>`);
    rig.setAttribute('opacity',0);await Promise.all([evTw(rig,'opacity',0,1,400),evMove(v,0,0,0,-68,600,'outBack')]);
    v.setAttribute('transform','translate(0 -68)');
    const tgt={'Melts, browns':'#a5641f','Melts, yellows':'#f0cf5a','Browns, burns':'#3a2414','Tans, clumps':'#d9b47a'}[res];
    const body=pile&&pile.firstElementChild;
    if(res==='Crumbles'){evAdd(`<g transform="translate(0 -68)">${evWisps(400,250,'#ffffff',2)}</g>`);
      if(pile){pile.setAttribute('opacity',0);}
      const bits=[[-22,-6],[-8,-12],[8,-4],[22,-10],[0,-2]].map(([dx,dy])=>evAdd(`<path transform="translate(${400+dx} ${268})" d="M-7 0l3-8 8 1 3 7z" fill="#fff" stroke="#b9c4d8"/>`));
      await Promise.all(bits.map((b,k)=>{const [dx]=[[-22],[-8],[8],[22],[0]][k];return evMove(b,400+dx,262,400+dx*1.5,268,700,'outBounce');}));return;}
    if(/gas/.test(res)){evAdd(`<g transform="translate(0 -68)">${evWisps(400,196,'#dfe6f2',3)}</g>`);if(pile)evTw(pile,'opacity',1,.55,1500);await evWait(1500);return;}
    if(tgt&&body){const sm=/burn/.test(res);if(sm)evAdd(`<g transform="translate(0 -68)">${evWisps(400,196,'#5b6170',3)}</g>`);
      if(/Melts/.test(res))Art.tween({from:1,to:.45,dur:1400,step:s=>pile.setAttribute('transform',`translate(0 ${EVBY*(1-s)}) scale(1 ${s})`)});
      await Art.tween({from:0,to:1,dur:1500,step:p=>body.setAttribute('fill',p<1?evMix(lk.c,tgt,p):tgt)}).done;return;}
    evAdd(`<g transform="translate(0 -68)" class="evshimmer"><path d="M380 190q6-10 0-20t0-20M400 190q6-10 0-20t0-20M420 190q6-10 0-20t0-20" stroke="#ffb02e" stroke-width="2" fill="none" opacity=".5"/></g>`);
    await evWait(1300);return;}
  if(t==='magnet'){
    const m=evAdd(`<g><g class="evwob"><g transform="rotate(180)"><path d="M-36-60h22v40a14 14 0 0 0 28 0v-40h22v40a36 36 0 0 1-72 0z" fill="#e2483f" stroke="#a52a24" stroke-width="2"/><rect x="-36" y="-60" width="22" height="14" fill="#dfe5ef"/><rect x="14" y="-60" width="22" height="14" fill="#dfe5ef"/></g></g></g>`);
    await evMove(m,400,40,400,172,700,'outBack');
    if(/Stick/.test(res)){
      if(lk.form==='block'&&pile){await evMove(pile,0,0,0,-150,500,'inQuad');return;}
      const bits=[];for(let k=0;k<14;k++)bits.push(evAdd(`<path d="M-3 0l6-2" stroke="#3a3f4a" stroke-width="3" stroke-linecap="round"/>`));
      if(pile)evTw(pile,'opacity',1,.2,700);
      await Promise.all(bits.map((b,k)=>{const sx=372+(k*7)%56,tx=k%2?375:425;return evMove(b,sx,326-(k%4)*4,tx+((k*5)%10-5),228+(k%3)*3,500+k*30,'inQuad');}));return;}
    m.firstElementChild.classList.add('evwiggle');await evWait(1100);return;}
  if(t==='density'){
    const dens=parseFloat(res),mass=Math.round(dens*100)/10;
    const kit=evAdd(`<g><rect x="520" y="316" width="140" height="20" rx="5" fill="#3c4864"/><rect x="560" y="320" width="66" height="13" rx="3" fill="#0d1a12"/><text id="evMass" x="622" y="330.5" font-size="11" font-weight="800" fill="#7ef0c4" text-anchor="end" font-family="ui-monospace,monospace">0.0 g</text>
      <path d="M572 160h36v156h-36z" fill="#eef6ff" fill-opacity=".45" stroke="#8ea3c4" stroke-width="2.4"/><rect id="evCyl" x="574" y="236" width="32" height="80" fill="#4aa8ff" opacity=".6"/>
      ${[0,1,2,3,4,5,6].map(i=>`<path d="M604 ${196+i*20}h8" stroke="#6f86ad" stroke-width="1.6"/><text x="616" y="${199+i*20}" font-size="8" fill="#53627f">${60-i*10}</text>`).join('')}
      <text x="590" y="152" font-size="10" font-weight="800" text-anchor="middle" fill="#53627f">mL</text></g>`);
    kit.setAttribute('opacity',0);await evTw(kit,'opacity',0,1,350);
    const ch=evAdd(evPile(lk.form==='block'?lk:{...lk,form:'block'},0,0,34));
    await evMove(ch,EVBX,EVBY-6,590,170,650,'outCubic');await evMove(ch,590,170,590,312,500,'inQuad');
    const cyl=evQ('#evCyl');Art.tween({from:236,to:216,dur:600,step:v=>{cyl.setAttribute('y',v);cyl.setAttribute('height',316-v);}});
    await Art.count(evQ('#evMass'),mass,{from:0,dur:900,fmt:v=>v.toFixed(1)+' g'}).done;
    evAdd(`<g><rect x="380" y="114" width="250" height="34" rx="9" fill="#24304d"/><text x="505" y="136" font-size="14" font-weight="800" text-anchor="middle" fill="#fff">${mass} g ÷ 10 mL = ${res}</text></g>`);
    await evWait(700);return;}
}
function evPlayCircuit(res,pile,liq){
  const on=/lights/.test(res);
  const c=evAdd(`<g><rect x="508" y="304" width="74" height="32" rx="5" fill="#2f6bff"/><rect x="582" y="312" width="8" height="16" rx="2" fill="#b9c6e0"/><text x="545" y="325" font-size="11" font-weight="900" fill="#fff" text-anchor="middle">1.5 V</text>
    <circle cx="548" cy="214" r="${on?60:0}" fill="url(#evBulbGlow)" class="evglow"/>
    <path d="M532 214a16 16 0 1 1 32 0c0 8-6 12-6 20h-20c0-8-6-12-6-20z" fill="${on?'#fff6b0':'#eef2f8'}" stroke="#9aa5ba" stroke-width="2.4"/><rect x="538" y="234" width="20" height="12" rx="2" fill="#8792a8"/>
    <path d="M542 214l3 6 3-6 3 6" stroke="${on?'#e08a00':'#8792a8'}" stroke-width="1.8" fill="none"/>
    <path class="${on?'evwire on':'evwire'}" d="M538 246v20h-118v44M558 246v20h22v38M508 320h-52q-28 0-28-10" stroke="#3b4256" stroke-width="3" fill="none"/>
    <rect x="416" y="250" width="7" height="74" rx="2" fill="#9aa5ba"/><rect x="430" y="256" width="7" height="68" rx="2" fill="#9aa5ba"/></g>`);
  if(on)evAdd(`<g stroke="#ffcb2e" stroke-width="3" stroke-linecap="round" class="evrays">${[0,1,2,3,4,5].map(k=>{const a=-Math.PI*(.1+k*.16),x=548+Math.cos(a)*26,y=210+Math.sin(a)*26;return `<path d="M${x} ${y}L${548+Math.cos(a)*40} ${210+Math.sin(a)*40}"/>`;}).join('')}</g>`);
  return evWait(1300);}
function evLensPattern(lk){let s='';evSeed=11;
  if(lk.form==='block'){if(lk.paint)return `<rect x="-90" y="-90" width="180" height="180" fill="${lk.c}"/>${[0,1,2,3,4,5].map(i=>`<path d="M-90 ${-70+i*28}q90 ${i%2?8:-8} 180 0" stroke="${lk.c2}" stroke-width="3" fill="none" opacity=".35"/>`).join('')}<path d="M10 20l40-18 18 30-44 10z" fill="#8f96a3"/>`;
    if(lk.cubes){for(let i=0;i<9;i++){const x=-70+(i%3)*50,y=-70+Math.floor(i/3)*50;s+=`<path d="M${x} ${y+14}l18-12 22 10v26l-18 12-22-10z" fill="${lk.c}" stroke="${lk.c2}" stroke-width="2"/><path d="M${x} ${y+14}l22 10 18-12M${x+22} ${y+24}v26" stroke="${lk.c2}" stroke-width="2" fill="none"/>`;}return s;}
    return `<rect x="-90" y="-90" width="180" height="180" fill="${lk.c}"/><path d="M-90 30L60-90h40L-50 30z" fill="#fff" opacity=".45"/><path d="M-90 80L90-60v20L-90 100z" fill="#fff" opacity=".25"/>`;}
  for(let i=0;i<34;i++){const x=evR()*170-85,y=evR()*170-85;
    if(lk.form==='crystals')s+=`<g transform="translate(${x} ${y}) rotate(${evR()*90})"><rect x="-8" y="-8" width="16" height="16" fill="#fff" stroke="#9fb0cc" stroke-width="2"/><path d="M-8-8l5-5h16v16l-5 5M8-8l5-5" fill="#f0f4fb" stroke="#9fb0cc" stroke-width="1.5"/></g>`;
    else if(lk.form==='bits')s+=`<path transform="translate(${x} ${y}) rotate(${evR()*180})" d="M-12 0l24-4 2 4-24 4z" fill="${lk.c2}" stroke="#aeb6c4" stroke-width="1.5"/>`;
    else if(lk.form==='grains')s+=`<ellipse cx="${x}" cy="${y}" rx="${7+evR()*5}" ry="${6+evR()*3}" fill="${lk.c}" stroke="${lk.c2}" stroke-width="2"/>`;
    else if(lk.form==='grit')s+=`<path transform="translate(${x} ${y}) rotate(${evR()*180})" d="M-8-3l6-6 9 2 2 8-8 5-8-3z" fill="#fff" stroke="#c3bdae" stroke-width="2"/>`;
    else s+=`<circle cx="${x}" cy="${y}" r="${2+evR()*2.5}" fill="#fff" stroke="#c9d0de"/>`;}
  return s;}
function evMix(a,b,p){const h=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)),A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*p).toString(16).padStart(2,'0')).join('');}

/* ---------- reaction scenes ---------- */
const EV_SCN={soda_vin:{f:[400,250],b:'#f4eecf',a:'#f4eecf'},salt_water:{f:[400,280],b:'#cfe8ff',a:'#cfe8ff'},ice:{f:[400,296],b:'#dff3ff',a:'#bfe3ff'},
  dye:{f:[400,282],b:'#d9efff',a:'#f7a3b8'},rust:{f:[400,306],b:'#9aa3b2',a:'#c0622a'},paper:{f:[400,276],b:'#ffffff',a:'#ffffff'},match:{f:[452,222],b:'#e8c48a',a:'#2a2a2a'},
  sandiron:{f:[400,300],b:'#d8bf8c',a:'#d8bf8c'},alka:{f:[400,300],b:'#d8ecff',a:'#d8ecff'},egg:{f:[400,302],b:'#f2efe2',a:'#ffffff'},caramel:{f:[400,306],b:'#ffffff',a:'#9a5a1c'}};
function evGlass2(top,col,op,inner){return `<clipPath id="evGl"><path d="M355 192h90l-6 144h-78z"/></clipPath>
<ellipse cx="400" cy="341" rx="58" ry="5" fill="#0b1430" opacity=".25"/>
<path d="M352 188h96l-7 148q0 4-4 4h-74q-4 0-4-4z" fill="#eaf4ff" fill-opacity=".25"/>
<g clip-path="url(#evGl)"><rect x="340" y="${top}" width="120" height="${340-top}" fill="${col}" opacity="${op}"/><ellipse cx="400" cy="${top}" rx="46" ry="4" fill="#fff" opacity=".5"/>${inner||''}</g>
<path d="M352 188h96l-7 148q0 4-4 4h-74q-4 0-4-4z" fill="url(#evGlass)" stroke="#8ea3c4" stroke-width="2.6"/><rect x="362" y="200" width="6" height="124" rx="3" fill="#fff" opacity=".55"/>`;}
function evPan(inner){return `<ellipse cx="400" cy="341" rx="120" ry="6" fill="#0b1430" opacity=".25"/><rect x="350" y="318" width="100" height="18" rx="4" fill="#4c5a78"/><path d="M362 318q38-10 76 0" stroke="#ff6a2a" stroke-width="4" fill="none" opacity=".8"/>
<path d="M500 300l110-12" stroke="#2b2f38" stroke-width="12" stroke-linecap="round"/><ellipse cx="400" cy="304" rx="112" ry="22" fill="#2b2f38"/><ellipse cx="400" cy="300" rx="100" ry="17" fill="#454b57"/>${inner}`;}
function evScene(sc){
  switch(sc){
  case 'soda_vin':return evGlass2(252,'#f2e7b0',.6,evBubbles(366,434,336,252,18)+`<path d="M356 252q8-9 16 0t16 0 16 0 16 0 16 0 16 0v6h-96z" fill="#fff" opacity=".95" class="evfoam"/>`)+
    `<g transform="translate(476 150) rotate(-30)"><rect x="-6" y="0" width="12" height="70" rx="5" fill="#c9d1df"/><ellipse cx="0" cy="-4" rx="16" ry="10" fill="#c9d1df"/><ellipse cx="0" cy="-6" rx="11" ry="6" fill="#fff"/></g>`+
    [0,1,2,3].map(i=>`<circle class="evfall" cx="${462-i*4}" cy="168" r="2.2" fill="#fff" stroke="#c9d1df" style="animation-delay:${i*.3}s"/>`).join('');
  case 'salt_water':return evGlass2(236,'#9fd3ff',.45,`<g class="evswirl"><ellipse cx="400" cy="300" rx="30" ry="7" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/></g>`+[0,1,2,3,4].map(i=>`<rect class="evdissolve" x="${388+i*6}" y="240" width="4" height="4" fill="#fff" style="animation-delay:${i*.35}s"/>`).join(''))+
    `<rect class="evstir" x="410" y="160" width="7" height="160" rx="3.5" fill="url(#evMetal)"/>`;
  case 'ice':return `<ellipse cx="400" cy="341" rx="120" ry="6" fill="#0b1430" opacity=".2"/><ellipse cx="400" cy="330" rx="118" ry="16" fill="#f4f7fc" stroke="#c7d0e2" stroke-width="2"/>
    <ellipse class="evpuddle" cx="400" cy="330" rx="80" ry="10" fill="#9fd3ff" opacity=".6"/>
    <g class="evmelt"><rect x="358" y="262" width="84" height="66" rx="12" fill="#d9f1ff" stroke="#9cc9ea" stroke-width="2.5"/><path d="M368 272h40" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/><path d="M372 300l20-14M410 316l18-12" stroke="#fff" stroke-width="2" opacity=".7"/></g>
    <circle class="evdrip" cx="442" cy="318" r="3.5" fill="#9fd3ff"/>`;
  case 'dye':return evGlass2(230,'#cfe8ff',.4,`<g filter="url(#evBlur)"><g class="evcloud"><ellipse cx="398" cy="262" rx="16" ry="26" fill="#f05a7e" opacity=".7"/><ellipse cx="386" cy="296" rx="26" ry="18" fill="#f05a7e" opacity=".55"/><ellipse cx="414" cy="312" rx="30" ry="16" fill="#f47a96" opacity=".5"/></g></g><rect x="340" y="312" width="120" height="30" fill="#f7a3b8" opacity=".45" filter="url(#evBlur)"/>`)+
    `<g transform="translate(400 130)"><rect x="-7" y="-26" width="14" height="14" rx="6" fill="#3b3f4a"/><path d="M-6-12h12v28l-6 10-6-10z" fill="#e9eef7" stroke="#6f7b93" stroke-width="2"/><path d="M-4-2h8v18l-4 7-4-7z" fill="#e2483f"/></g><circle class="evfall" cx="400" cy="170" r="4" fill="#e2483f"/>`;
  case 'rust':return `<ellipse cx="400" cy="341" rx="120" ry="6" fill="#0b1430" opacity=".2"/><path d="M286 300h228l-14 34q-2 6-8 6H308q-6 0-8-6z" fill="#eaf4ff" fill-opacity=".5" stroke="#8ea3c4" stroke-width="2.4"/><path d="M294 312h212l-9 22q-2 4-6 4H309q-4 0-6-4z" fill="#bfe0f0" opacity=".7"/>
    <g transform="rotate(-6 400 316)"><rect x="318" y="310" width="160" height="10" rx="2" fill="url(#evMetal)"/><rect x="306" y="302" width="12" height="26" rx="3" fill="#8792a8"/><path d="M478 310l18 5-18 5z" fill="#8792a8"/>
    ${[[340,315,9],[372,313,7],[410,316,10],[448,314,8],[322,312,5]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.6}" fill="#c0622a" opacity=".9"/>`).join('')}</g>
    ${[0,1,2,3].map(i=>`<path d="M${350+i*30} 333l5-3 4 3z" fill="#b2541f"/>`).join('')}`;
  case 'paper':return `<ellipse cx="400" cy="341" rx="120" ry="5" fill="#0b1430" opacity=".18"/>
    <path d="M300 200h86l-6 20 8 18-10 22 8 20-6 22 6 34h-86z" fill="#fff" stroke="#c7d0e2" stroke-width="2"/>${[0,1,2,3,4,5].map(i=>`<path d="M310 ${222+i*18}h62" stroke="#bcd3f2" stroke-width="2"/>`).join('')}
    ${[[430,330,12],[470,326,-20],[512,332,30],[450,250,0],[490,220,0]].map(([x,y,r],k)=>`<path class="${k>2?'evflutter':''}" transform="translate(${x} ${y}) rotate(${r})" d="M-16-10h28l4 8-6 12h-24z" fill="#fff" stroke="#c7d0e2" stroke-width="2" style="animation-delay:${k*.5}s"/>`).join('')}`;
  case 'match':return `<ellipse cx="400" cy="341" rx="110" ry="5" fill="#0b1430" opacity=".2"/><rect x="296" y="312" width="78" height="26" rx="3" fill="#c0392b"/><rect x="296" y="312" width="78" height="7" fill="#7a2018"/><rect x="306" y="322" width="58" height="8" rx="2" fill="#f2c94c"/>
    <path d="M384 336L446 228" stroke="#e8c48a" stroke-width="9" stroke-linecap="round"/><path d="M432 252L446 228" stroke="#2a2a2a" stroke-width="10" stroke-linecap="round"/><circle cx="447" cy="226" r="7" fill="#ff7a2a"/>
    <g class="evflame"><path d="M450 222c14 -20 4 -40 -2 -60 -8 18 -22 30 -12 54z" fill="url(#evFlameG)"/><path d="M448 220c6-8 2-18-1-26-4 8-9 14-4 24z" fill="#fff4b8"/></g>
    ${evWisps(450,150,'#8a93a6',2)}${[0,1,2].map(i=>`<path d="M${470+i*16} 335l4-3 5 3z" fill="#555"/>`).join('')}`;
  case 'sandiron':evSeed=5;return `<ellipse cx="400" cy="341" rx="120" ry="6" fill="#0b1430" opacity=".2"/><path d="M290 280h220q-10 60-110 60t-110-60z" fill="#f4f7fc" stroke="#c7d0e2" stroke-width="2.4"/><ellipse cx="400" cy="282" rx="104" ry="14" fill="#d8bf8c"/>
    ${Array.from({length:40},()=>{const x=310+evR()*180,y=276+evR()*12;return evR()<.45?`<path d="M${x} ${y}l6-2" stroke="#3a3f4a" stroke-width="2.4" stroke-linecap="round"/>`:`<circle cx="${x}" cy="${y}" r="1.6" fill="#b49660"/>`;}).join('')}
    <path class="evstir" d="M470 200l-48 74" stroke="url(#evMetal)" stroke-width="8" stroke-linecap="round"/>`;
  case 'alka':return evGlass2(236,'#9fd3ff',.45,evBubbles(380,420,328,236,16)+evBubbles(390,410,328,236,8)+`<ellipse cx="400" cy="330" rx="20" ry="5" fill="#fff" stroke="#c7d0e2" class="evshrink"/>`);
  case 'egg':return evPan(`<path d="M330 302C320 286 350 278 372 282C392 270 430 276 446 286C474 290 476 310 452 316C430 324 390 322 366 318C344 316 332 312 330 302Z" fill="#fff" stroke="#e6e1cf" stroke-width="2" class="evcook"/><circle cx="402" cy="294" r="15" fill="#f5b51c"/><circle cx="397" cy="289" r="4" fill="#fff" opacity=".7"/>${evWisps(400,270,'#dfe6f2',3)}`);
  case 'caramel':return evPan(`<ellipse cx="400" cy="302" rx="70" ry="11" fill="#9a5a1c" class="evbrown"/><ellipse cx="392" cy="299" rx="30" ry="4" fill="#d38b3a" opacity=".6"/>${[0,1,2,3,4,5].map(i=>`<rect x="${326+i*26}" y="${300+(i%2)*4}" width="5" height="5" fill="#fff"/>`).join('')}${evWisps(400,270,'#dfe6f2',3)}`);
  }return '';}
async function evPlayReact(t){
  const sc=evCase().sc,S=EV_SC[sc],Z=EV_SCN[sc],[fx,fy]=Z.f,v=S[t],yes=!!v[0];
  const tool=evAdd(`<g><circle r="30" fill="#fff" stroke="#2d3f63" stroke-width="3"/><g transform="translate(-19 -20)">${EV_ICON[t]}</g></g>`);
  await evMove(tool,400,520,fx+90,fy-70,600,'outBack');
  const ring=evAdd(`<circle cx="${fx}" cy="${fy}" r="10" fill="none" stroke="${yes?'#ffd23f':'#9aa5ba'}" stroke-width="5" class="evping"/>`);
  await evTw(ring,'r',10,54,500);
  if(t==='temp'){const dn=/cold/i.test(v[1]),up=/hot/i.test(v[1]);
    const th=evAdd(`<g transform="translate(${fx+150} ${fy-60})"><rect x="-10" y="-50" width="20" height="100" rx="10" fill="#fff" stroke="#6f7b93" stroke-width="2.4"/><circle cy="58" r="15" fill="#e2483f" stroke="#6f7b93" stroke-width="2.4"/><rect id="evTh" x="-4" y="0" width="8" height="58" fill="#e2483f"/></g>`);
    const col=th.querySelector('#evTh');await Art.tween({from:0,to:dn?30:up?-38:0,dur:900,step:d=>{col.setAttribute('y',d);col.setAttribute('height',58-d);}}).done;}
  else if(t==='color'){evAdd(`<g transform="translate(${fx+120} ${fy-120})"><rect x="0" y="0" width="120" height="58" rx="10" fill="#fff" stroke="#c7d0e2" stroke-width="2"/><rect x="10" y="10" width="40" height="28" rx="6" fill="${Z.b}" stroke="#9aa5ba"/><rect x="70" y="10" width="40" height="28" rx="6" fill="${Z.a}" stroke="#9aa5ba"/><text x="30" y="51" font-size="10" font-weight="800" text-anchor="middle" fill="#53627f">Before</text><text x="90" y="51" font-size="10" font-weight="800" text-anchor="middle" fill="#53627f">After</text></g>`);await evWait(800);}
  else await evWait(700);
  tool.remove();
}

/* ---------- running a test ---------- */
function evAlive(done){const cs=evCase(),sec=EV_SUBS[cs.secret];
  return cs.cands.filter(c=>!EVS.wrong.includes(c)&&done.every(t=>EV_SUBS[c][t]===sec[t]));}
async function evRunTest(t){
  if(!EVS||EVS.busy||EVS.caseOK||EVS.done.indexOf(t)>=0)return;
  const L=evLv(),tok=EVS.tok,before=L.kind==='powder'?evAlive(EVS.done):null;
  EVS.done.push(t);EVS.used++;EVS.busy=true;EVS.pending=t;EVS.introOff=true;
  if(L.kind==='powder')EVS.out[t]=before.filter(c=>evAlive(EVS.done).indexOf(c)<0);
  evDrawStage();evRender();Art.count($('evUsed'),EVS.used,{dur:400});
  try{await (L.kind==='powder'?evPlayPowder(t):evPlayReact(t));}catch(e){console.error(e);}
  if(!EVS||EVS.tok!==tok)return;
  EVS.busy=false;EVS.pending=null;EVS.fresh=t;
  const res=L.kind==='powder'?EV_SUBS[evCase().secret][t]:EV_SC[evCase().sc][t][1];
  const tag=$('evTag');tag.replaceChildren(h('span',{class:'evtagi'}),h('span',null,EV_TOOL[t][1]+': '),h('b',null,res));
  tag.firstChild.innerHTML=evIcon(t,24);tag.hidden=false;Art.pop(tag,1.08);
  evRender();EVS.fresh=null;
}
function evSay(t,kind){const c=$('evCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),h('span',null,...[].concat(t)));}

/* ---------- side panel ---------- */
function evSide(){
  const L=evLv(),cs=evCase(),box=$('evSide'),shown=EVS.done.filter(t=>t!==EVS.pending);
  if(L.kind==='powder'){
    const sec=EV_SUBS[cs.secret];
    const nb=h('div',{class:'evnote'},h('div',{class:'evnoteh'},I('flask'),' Lab notebook ',h('small',null,'Sample '+(EVS.ci+1))),
      shown.length?h('ol',null,...shown.map(t=>{const out=EVS.out[t]||[];
        return h('li',{class:t===EVS.fresh?'new':''},h('span',{class:'evni'}),h('b',null,EV_TOOL[t][1]+':'),' ',h('span',{class:'evres'},sec[t]),
          h('em',{class:out.length?'':'none'},out.length?'✗ Rules out '+out.map(c=>EV_SUBS[c].n).join(', '):'Rules out nobody'));})):
      h('p',{class:'evempty'},'Drag a tool onto the beaker. The result writes itself here.'));
    nb.querySelectorAll('.evni').forEach((s,k)=>s.innerHTML=evIcon(shown[k],20));
    const cols=`minmax(84px,1.25fr) repeat(${cs.tests.length},minmax(0,1fr)) 64px`;
    const head=h('div',{class:'evgrow evghead',style:'--cols:'+cols},h('span',null,'Substance'),...cs.tests.map(t=>{const sp=h('span',{class:shown.includes(t)?'on':'',title:EV_TESTS[t].n});sp.innerHTML=evIcon(t,20)+'<i>'+EV_SHORT[t]+'</i>';return sp;}),h('span',null,''));
    const alive=evAlive(shown);
    const rows=cs.cands.map(c=>{const bad=EVS.wrong.includes(c),out=bad||alive.indexOf(c)<0,just=EVS.fresh&&(EVS.out[EVS.fresh]||[]).includes(c);
      return h('div',{class:'evgrow'+(out?' out':'')+(just?' just':'')+(!out&&shown.length&&alive.length===1?' only':'')+(EVS.caseOK&&c===cs.secret?' win':''),style:'--cols:'+cols},
        h('b',null,EV_SUBS[c].n),...cs.tests.map(t=>{const dn=shown.includes(t);return h('span',{class:dn?(EV_SUBS[c][t]===sec[t]?'yes':'no'):''},EV_SUBS[c][t]);}),
        EVS.caseOK?h('span',null,c===cs.secret?'✓':''):h('button',{class:'btn sm evname',disabled:bad||EVS.busy,onclick:()=>evNamePowder(c)},bad?'No':'This one!'));});
    box.replaceChildren(nb,h('div',{class:'evclip'},h('div',{class:'evclipt'}),h('div',{class:'evnoteh'},I('lens'),' Field guide ',h('small',null,'Who matches your results?')),h('div',{class:'evguide'},head,...rows)));
  }else{
    const S=EV_SC[cs.sc],proof=evProof(cs.sc,shown,cs.tests);
    const st=shown.map(t=>{const k=evSticker(cs.sc,t);return h('div',{class:'evstk '+k.k+(t===EVS.fresh?' new':'')},h('span',{class:'evstkl'},k.lab),h('b',null,EV_RT[t].n),h('small',null,S[t][1]));});
    box.replaceChildren(
      h('div',{class:'evnote'},h('div',{class:'evnoteh'},I('flask'),' Evidence board ',h('small',null,S.n)),
        st.length?h('div',{class:'evstks'},...st):h('p',{class:'evempty'},'Drag an evidence tool onto the scene. Each test gives you a sticker.')),
      h('div',{class:'evproof'+(proof?' has':'')},proof?'✔ You have strong proof. Make your call!':'No strong proof yet. Keep testing.'),
      EVS.caseOK?h('div',{class:'evgoodbox'},'✓ '+(S.truth==='chem'?'Chemical reaction':'Physical change')+'. Properties: '+S.props[1]+'.'):
      h('div',{class:'evdecide'},h('button',{class:'evstampbtn chem',disabled:EVS.busy,onclick:()=>evDeclare('chem')},'Chemical reaction',h('small',null,'new stuff formed')),
        h('button',{class:'evstampbtn phys',disabled:EVS.busy,onclick:()=>evDeclare('phys')},'Physical change',h('small',null,'same stuff'))),
      h('p',{class:'evlegend'},h('b',null,'Strong proof: '),'new gas, new solid, new smell or light, new properties. ',h('b',null,'Weak clue: '),'color or temperature change.'));
  }
}
function evSticker(sc,t){const r=EV_RT[t],v=EV_SC[sc][t];
  if(t==='props')return v[0]?{k:'phys',lab:'STRONG PROOF'}:{k:'chem',lab:'STRONG PROOF'};
  if(r.strong)return v[0]?{k:'chem',lab:'STRONG PROOF'}:{k:'none',lab:'NO SIGN'};
  return v[0]?{k:'weak',lab:'WEAK CLUE'}:{k:'none',lab:'NO CHANGE'};}

/* ---------- tray, HUD, coach ---------- */
function evTray(){
  const cs=evCase(),L=evLv(),gold=EVS.hint>=3;
  $('evTray').replaceChildren(...cs.tests.map(t=>{const dn=EVS.done.includes(t);
    const b=h('div',{class:'evtool'+(dn?' used':'')+(gold&&cs.set.includes(t)?' best':'')+(L.kind==='react'?(EV_RT[t].strong?' strong':' weak'):''),'data-t':t,'aria-label':EV_TOOL[t][0]+(dn?' (used)':''),title:(L.kind==='powder'?EV_TESTS[t].q:EV_RT[t].q)},
      h('span',{class:'evti'}),h('b',null,EV_TOOL[t][0]),h('small',null,dn?'✓ used':L.kind==='react'?(EV_RT[t].strong?'Strong proof':'Weak clue'):EV_TOOL[t][1]));
    b.firstChild.innerHTML=evIcon(t,30);return b;}));
}
function evRank(){const L=evLv(),allow=L.par+L.slack,n=L.cases.length,u=EVS.used;
  return u<=allow?['Master detective','★★★']:u<=allow+2*n?['Detective','★★']:['Rookie','★'];}
function evRender(){
  const L=evLv(),n=L.cases.length;
  $('evLvl').textContent=EVS.i+1;$('evLvlN').textContent=EV_N;if(!EVS.busy)$('evUsed').textContent=EVS.used;$('evPar').textContent=L.par+L.slack;
  const rk=evRank();$('evRank').replaceChildren(h('span',{class:'evrkst'},rk[1]),' ',rk[0]);
  $('evName').textContent=L.name;$('evStory').textContent=L.story;
  $('evIntro').hidden=!L.intro||EVS.introOff;$('evIntro').replaceChildren(h('b',null,'New! '),L.intro||'');
  $('evCaseBar').replaceChildren(...L.cases.map((c,k)=>{const ok=k<EVS.ci||(k===EVS.ci&&EVS.caseOK);return h('span',{class:'evcase'+(ok?' ok':k===EVS.ci?' on':'')},L.kind==='powder'?'Sample '+(k+1):EV_SC[c.sc].n.split(' ')[0]+'…',ok?' ✓':'');}));
  $('evCaseBar').hidden=n<2;
  $('evStage').setAttribute('aria-label',L.kind==='powder'?'Lab bench. Drop a tool on the beaker.':'Lab bench: '+EV_SC[evCase().sc].n+'. Drop an evidence tool here.');
  evTray();evSide();evCoach();evHintUI();
  $('evNextCase').hidden=!(EVS.caseOK&&EVS.ci<n-1);
}
function evCoach(){
  const L=evLv(),cs=evCase();
  if(EVS.caseOK){
    if(L.kind==='powder'){const sec=EV_SUBS[cs.secret],key=EVS.done.filter(t=>(EVS.out[t]||[]).length);
      return evSay(['Case closed! ',h('b',null,EV_SUBS[cs.secret].n),' is the only one that matches: ',key.map(t=>EV_TOOL[t][1].toLowerCase()+' → '+sec[t]).join(', ')+'.',EVS.ci<L.cases.length-1?' Press Next sample.':'']);}
    return evSay(['Case closed! ',EVS.ci<L.cases.length-1?'Press Next sample.':'All cases solved!']);}
  if(EVS.busy)return evSay('Testing… watch the bench.');
  if(L.kind==='powder'){const alive=evAlive(EVS.done),last=EVS.done[EVS.done.length-1];
    if(!EVS.done.length)return evSay(['Drag a ',h('b',null,'tool'),' from the tray onto the beaker. Pick the test where the suspects act ',h('b',null,'differently'),'.']);
    if(alive.length===1)return evSay(['Only ',h('b',null,EV_SUBS[alive[0]].n),' still matches every result. Press ',h('b',null,'This one!'),' on the field guide.'],'good');
    if(last&&!(EVS.out[last]||[]).length)return evSay(['That test ruled out ',h('b',null,'nobody'),'. Every suspect left does the same thing. Look for a column where they differ.'],'alert');
    return evSay([h('b',null,alive.length+' suspects'),' still match. Run another test to rule more out.']);}
  const proof=evProof(cs.sc,EVS.done,cs.tests);
  if(!EVS.done.length)return evSay(['Drag an ',h('b',null,'evidence tool'),' onto the scene. ',h('b',null,'Strong'),' tools give proof; ',h('b',null,'weak'),' ones are only clues.']);
  evSay(proof?['You have ',h('b',null,'strong proof'),'. Stamp your call!']:['Weak clues and "no sign" are not enough yet. Look for ',h('b',null,'strong proof'),'.']);
}
function evStampShow(text,good){const s=$('evStamp');s.className='evstamp'+(good?'':' bad');s.textContent=text;s.hidden=false;
  if(!Art.reduced()){s.classList.remove('slam');void s.offsetWidth;s.classList.add('slam');}}
function evNamePowder(c){
  if(EVS.busy||EVS.caseOK)return;const cs=evCase();
  if(c===cs.secret){EVS.caseOK=true;evStampShow('IDENTIFIED: '+EV_SUBS[c].n.toUpperCase(),true);fx.pop({icon:'flask',text:'Case solved!',kind:'great'});fx.confetti(30);evCaseDone();return;}
  EVS.wrong.push(c);EVS.used+=2;Art.count($('evUsed'),EVS.used,{dur:400});fx.pop({icon:'question',text:'Not that one (+2)',kind:'oops'});
  const why=EVS.done.find(t=>EV_SUBS[c][t]!==EV_SUBS[cs.secret][t]);
  evRender();
  evSay(why?[h('b',null,EV_SUBS[c].n),' does not match: your sample gave "',EV_SUBS[cs.secret][why],'" for ',EV_TOOL[why][1].toLowerCase(),', but ',EV_SUBS[c].n,' gives "',EV_SUBS[c][why],'". A wrong answer costs 2 tests.']
    :['No test has ruled out ',h('b',null,EV_SUBS[c].n),' or the others yet. Guessing costs 2 tests. Run a test first!'],'alert');
  Art.shake($('evSide'));
}
function evDeclare(a){
  if(EVS.busy||EVS.caseOK)return;const cs=evCase(),S=EV_SC[cs.sc],proof=evProof(cs.sc,EVS.done,cs.tests);
  if(!proof){evSay(['You need ',h('b',null,'strong proof'),' first: a new gas, solid, smell or light, or the properties check. Keep testing!'],'alert');Art.shake($('evSide'));return;}
  if(a===S.truth){EVS.caseOK=true;evStampShow(S.truth==='chem'?'CHEMICAL REACTION':'PHYSICAL CHANGE',true);fx.pop({icon:'flask',text:'Correct!',kind:'great'});fx.confetti(30);evCaseDone();return;}
  EVS.used+=2;Art.count($('evUsed'),EVS.used,{dur:400});fx.pop({icon:'question',text:'Check the proof (+2)',kind:'oops'});evRender();
  evSay(S.truth==='chem'?['Look at your stickers again. A ',h('b',null,'strong proof'),' sticker says new stuff formed. That means a chemical reaction. A wrong call costs 2 tests.']
    :['Look again. The properties stayed the same (or no new gas, solid or smell showed up), so no new stuff formed. Color or temperature alone is only a clue. A wrong call costs 2 tests.'],'alert');
  Art.shake($('evSide'));
}
function evCaseDone(){const L=evLv();evRender();if(EVS.ci>=L.cases.length-1)setTimeout(evWin,Art.reduced()?300:1100);}
function evWin(){
  if(!EVS)return;const L=evLv(),n=L.cases.length,allow=L.par+L.slack,stars=EVS.used<=allow?3:EVS.used<=allow+2*n?2:1;
  if(!(EVS.rec>=stars)){EVS.rec=stars;recordStars('evidence',EVS.i+1,stars,{tests:EVS.used,par:L.par});}
  fx.pop({icon:'flask',text:stars===3?'Master detective!':'Case closed!',kind:'great',size:'big'});fx.confetti(stars===3?90:50);
  levelResult($('evResult'),{stars,next:EVS.i+1<EV_N,
    line:['You ran ',h('b',null,EVS.used),` test${EVS.used===1?'':'s'} (counting penalties). 3 stars needs `,h('b',null,allow),' or fewer.',stars<3?' Can you spot the best test sooner?':' Sharp detective work!'],
    fact:L.fact,onNext:()=>evStart(EVS.i+1),onRetry:()=>evStart(EVS.i),onLevels:()=>{renderEvidenceSetup();show('s-evidence-setup');}});
}
function evHintUI(){
  const L=evLv(),cs=evCase(),n=EVS.hint;
  $('evHintTxt').textContent=['Need a hint?','Another hint','Show me the best tests','Answer shown'][n];$('evHint').disabled=n>=3||EVS.caseOK;
  const nm=t=>EV_TOOL[t][0],b=$('evHintBox');
  b.hidden=n===0;
  b.replaceChildren(...[n>=1?h('div',null,I('bulb'),' ',h('b',null,'Clue: '),L.clue):null,
    n>=2?h('div',null,I('lens'),' ',h('b',null,'Tip: '),L.kind==='powder'?'This sample can be named with '+cs.par+' test'+(cs.par>1?'s':'')+'. On the field guide, find a column where just one suspect is different.':'You can prove this one with '+cs.par+' test'+(cs.par>1?'s':'')+'. Strong proof tools are the green ones.'):null,
    n>=3?h('div',null,I('eye'),' ',h('b',null,'Best tools: '),cs.set.map(nm).join(' + ')+' (ringed in gold).'):null]);
}

/* ---------- start ---------- */
function evStart(i){
  EVS={i,ci:0,done:[],out:{},used:0,wrong:[],hint:0,caseOK:false,busy:false,pending:null,fresh:null,introOff:false,tok:Math.random(),rec:EVS&&EVS.i===i?EVS.rec:0};
  show('s-evidence');$('evResult').hidden=true;
  if(!EV_DRAG)EV_DRAG=Art.drag({root:$('s-evidence'),items:'.evtool',targets:'#evStage',
    accept:it=>!!(EVS&&!EVS.busy&&!EVS.caseOK&&!EVS.done.includes(it.dataset.t)),
    label:it=>it.getAttribute('aria-label')||'tool',onDrop:it=>evRunTest(it.dataset.t)});
  evDrawStage();evRender();
}
$('evHint').onclick=()=>{if(EVS.hint<3){EVS.hint++;evRender();}};
$('evBack').onclick=()=>{EVS.tok=0;renderEvidenceSetup();show('s-evidence-setup');};
$('evIntro').onclick=()=>{EVS.introOff=true;$('evIntro').hidden=true;};
$('evNextCase').onclick=()=>{EVS.ci++;EVS.done=[];EVS.out={};EVS.wrong=[];EVS.caseOK=false;EVS.hint=0;$('evResult').hidden=true;evDrawStage();evRender();};
/*EVUI>>*/
