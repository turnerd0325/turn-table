/* ================= EARTH 3: PANGAEA REBUILD (MS-ESS2-3) =================
   "Rebuild the jigsaw". Real continent outlines are dragged onto the Pangaea map and turned until
   they fit. Every border shows the evidence found on BOTH sides of it (fossils, glacier scratches,
   matching rocks), so a continent fits a spot only if it has all of that evidence. A wrong fit is
   explained and sent back; a right continent turned the wrong way waits in its spot until it is
   turned to line up, then snaps in and its evidence links glow across the seam.
   Pack 3 (plate boundaries): predict what forms, then drag the plates and watch it happen.
   Continent outlines: Natural Earth 1:50m (public domain), one Lambert equal-area projection per
   continent so shapes and sizes are true. The Pangaea poses were fitted so neighbors touch
   without overlapping (Africa fixed, turns in 15 degree steps). */
/* continent outlines: Natural Earth (public domain), Lambert equal-area per continent, 1 unit = 10 km */
const PG_SHAPE={sa:{d:'M-230 -97 -227 -82 -203 -59 -165 10 -104 49 -99 83 -107 166 -103 207 -117 260 -110 282 -117 329 -110 334 -118 363 -107 366 -114 383 -98 426 -72 447 -45 455 -42 447 -21 441 -50 431 -62 404 -40 370 -55 350 -25 313 -27 307 -37 307 -38 295 -20 296 -10 274 27 263 36 249 26 225 53 229 63 224 115 162 120 132 128 123 164 106 189 105 201 95 225 49 233 -1 279 -51 278 -84 228 -118 184 -125 174 -140 126 -155 117 -161 118 -175 101 -204 87 -183 70 -182 72 -221 38 -224 14 -247 -3 -253 -4 -262 -22 -268 -16 -276 -35 -275 -38 -280 -51 -268 -85 -272 -106 -290 -110 -281 -124 -276 -123 -292 -160 -277 -171 -258 -190 -247 -195 -232 -187 -193 -207 -165 -219 -159 -227 -125 -219 -114Z',r:457},na:{d:'M-358 -221 -332 -199 -292 -205 -298 -190 -281 -191 -275 -212 -264 -213 -266 -203 -233 -194 -212 -169 -203 -100 -191 -91 -193 -40 -178 -15 -201 90 -186 151 -161 165 -137 224 -148 230 -124 252 -123 270 -97 287 -140 206 -138 188 -60 297 -58 326 -36 345 26 371 62 367 97 388 138 393 165 424 211 435 212 443 231 438 238 420 256 435 263 425 251 414 214 427 190 415 184 363 156 354 127 364 137 301 105 310 90 338 61 346 45 339 23 300 27 248 62 219 105 223 112 208 155 203 191 248 186 259 197 253 199 231 179 180 220 128 211 110 217 67 245 48 234 23 258 -6 269 10 295 -35 286 -44 282 -27 258 -28 252 -49 232 -43 229 -53 266 -60 251 -66 270 -77 280 -99 290 -54 333 -71 313 -93 291 -91 275 -122 228 -132 187 -165 184 -136 161 -159 131 -167 113 -157 124 -117 143 -96 130 -73 145 -49 139 -36 112 -73 47 -86 30 -115 48 -156 63 -173 75 -156 98 -169 76 -181 81 -205 71 -231 94 -228 100 -210 118 -217 119 -196 104 -185 109 -166 126 -186 147 -172 181 -174 166 -181 177 -184 170 -197 145 -211 166 -210 164 -232 129 -237 122 -252 73 -273 37 -260 59 -212 33 -224 22 -246 31 -268 19 -273 60 -282 57 -372 34 -369 11 -346 1 -331 13 -317 -11 -325 -5 -307 10 -307 8 -296 -14 -289 -23 -299 -30 -288 -40 -310 -61 -300 -39 -275 -4 -284 17 -272 -8 -255 14 -240 5 -215 -16 -236 -16 -265 -38 -258 -74 -284 -88 -261 -83 -249 -65 -250 -67 -220 -100 -238 -102 -250 -141 -249 -178 -315 -223 -326 -239 -295 -260 -312 -259 -273 -275 -282 -300 -268 -312 -274 -297 -217Z',r:505},gr:{d:'M-71 -67 -68 -49 -51 -43 -44 -23 -49 10 -44 18 -51 32 -37 40 -53 61 -49 101 -37 135 -14 147 5 90 20 84 39 54 61 42 72 23 61 -10 68 -34 60 -38 56 -62 46 -70 49 -105 32 -105 16 -117 -29 -102 -46 -90 -47 -79 -64 -78Z',r:148},an:{d:'M-296 -150 -300 -119 -286 -91 -232 -36 -249 48 -211 52 -215 81 -200 118 -145 142 -123 132 -104 143 -86 129 -93 106 -82 72 -44 73 -15 105 -22 129 -7 161 -17 210 52 221 73 212 94 218 124 196 142 200 139 188 167 150 168 132 193 114 193 81 212 67 199 41 212 -2 161 -59 177 -80 164 -150 94 -171 82 -190 49 -185 -21 -213 -47 -200 -76 -202 -100 -173 -100 -151 -122 -122 -128 -90 -149 -85 -140 -59 -162 -19 -188 -35 -209 -81 -276 -96 -296 -123Z',r:332},au:{d:'M-212 16 -185 56 -173 83 -176 110 -166 114 -149 115 -132 100 -99 96 -78 77 -28 66 -4 74 13 104 30 91 21 115 43 112 56 140 81 150 91 145 105 156 120 144 138 142 153 107 175 82 187 51 192 7 184 8 167 -27 157 -31 154 -53 128 -68 119 -114 103 -122 93 -162 87 -164 82 -145 76 -99 64 -86 57 -90 58 -101 43 -98 14 -119 19 -128 30 -126 24 -135 29 -161 10 -149 -18 -162 -26 -158 -17 -154 -23 -148 -32 -150 -28 -158 -42 -159 -45 -153 -35 -148 -52 -119 -79 -130 -88 -127 -104 -111 -105 -101 -126 -90 -138 -61 -207 -26 -209 1 -203 13Z',r:213},in:{d:'M-166 -69 -148 -34 -162 -27 -166 -16 -117 -14 -80 39 -57 35 -50 94 -17 174 -7 183 3 172 14 170 9 165 19 158 23 98 44 88 85 49 93 31 138 18 147 35 168 -32 186 -41 187 -50 172 -65 135 -42 70 -43 12 -73 5 -80 7 -109 -1 -121 -31 -139 -60 -132 -66 -108 -77 -107 -74 -100 -85 -84 -108 -79 -116 -63 -151 -62Z',r:194},af:{d:'M-384 -106 -377 -93 -375 -62 -367 -64 -351 -47 -344 -20 -296 16 -250 9 -228 15 -191 0 -161 -2 -141 21 -110 20 -112 34 -102 27 -99 48 -105 74 -111 76 -74 126 -53 192 -75 246 -74 270 -44 318 -38 360 -4 418 -2 444 14 450 39 442 68 442 91 432 139 385 146 353 174 338 171 292 227 254 239 236 239 189 226 165 233 155 227 155 226 124 238 99 321 17 354 -52 346 -70 279 -50 265 -63 264 -76 231 -101 229 -112 223 -108 211 -134 199 -142 190 -178 177 -187 177 -197 152 -235 162 -258 153 -277 122 -279 103 -270 30 -292 15 -284 14 -269 4 -263 -28 -276 -33 -286 -79 -302 -80 -308 -69 -312 -75 -328 -69 -335 -81 -340 -160 -336 -193 -322 -227 -333 -241 -314 -266 -301 -283 -266 -313 -252 -351 -209 -369 -176 -362 -169 -365 -138ZM258 326 264 353 275 357 293 349 341 244 331 206 312 235 276 253 270 267 272 294Z',r:456},eu:{d:'M-606 -167 -602 -133 -581 -111 -502 -123 -466 -98 -461 -19 -472 -5 -496 -20 -487 7 -452 -16 -443 -5 -452 -51 -448 -78 -434 -84 -426 -16 -443 23 -437 56 -422 46 -411 66 -416 22 -394 21 -403 83 -338 111 -382 194 -338 344 -339 389 -205 375 -149 327 -179 298 -178 278 -204 296 -228 294 -249 222 -233 224 -205 269 -175 269 -170 285 -129 298 -108 278 -125 250 -78 250 -48 228 -27 179 5 171 41 196 43 230 118 256 177 244 209 216 225 223 194 314 223 338 226 362 261 349 287 434 312 443 330 472 367 474 347 440 293 411 294 370 353 383 356 398 393 350 384 314 335 277 357 244 372 254 367 277 382 267 375 238 420 190 435 145 431 87 378 56 386 13 365 35 343 24 359 -14 368 9 381 -19 395 -5 412 -10 429 21 443 1 431 -24 401 -36 397 -90 410 -120 388 -184 361 -214 416 -179 422 -188 392 -207 400 -215 343 -239 346 -225 311 -204 291 -268 313 -332 288 -352 301 -364 293 -383 342 -327 405 -306 369 -356 311 -379 309 -417 274 -464 234 -469 235 -500 211 -507 190 -445 199 -390 184 -391 181 -364 146 -337 156 -324 149 -295 120 -305 87 -276 67 -297 38 -298 8 -240 -18 -220 -27 -228 -28 -214 -40 -231 -50 -180 -82 -202 -80 -182 -105 -190 -142 -175 -138 -194 -147 -199 -156 -175 -184 -251 -238 -265 -277 -246 -335 -246 -357 -224 -334 -205 -350 -177 -361 -181 -347 -196 -360 -200 -387 -175 -405 -189 -431 -185 -440 -193 -404 -249 -371 -267 -393 -285 -413 -268 -440 -280 -468 -266 -452 -247 -424 -253 -429 -236 -472 -229 -447 -187 -485 -213 -494 -176 -520 -158 -549 -210Z',r:629}};
/* Pangaea fit (Africa fixed): x, y, turn in degrees (clockwise) from today's north-up map */
const PG_POSE={"af":[0,0,0],"sa":[-486,174,-60],"na":[-643,-394,45],"eu":[84,-753,15],"gr":[-466,-821,15],"an":[10,679,15],"in":[342,478,75],"au":[271,909,120]};
/* border contact: m = midpoint in the Pangaea frame; per continent: local coast point + outward normal */
const PG_BP={"sa-af":{"m":[-358,-35],"sa":[232,5,0.992,0.13],"af":[-350,-45,-0.608,0.794]},"af-an":{"m":[28,458],"af":[35,443,-0.42,0.908],"an":[-43,-202,0.171,-0.985]},"af-in":{"m":[314,330],"af":[307,318,0.492,0.871],"in":[-137,-15,-0.968,0.249]},"an-in":{"m":[174,539],"an":[112,-166,0.675,-0.737],"in":[11,164,0.301,0.954]},"an-au":{"m":[163,857],"an":[178,125,0.914,0.406],"au":[12,102,-0.156,0.988]},"na-gr":{"m":[-548,-717],"na":[-157,-278,-0.244,-0.97],"gr":[-48,104,-0.274,0.962]},"gr-eu":{"m":[-384,-881],"gr":[46,-75,0.977,-0.213],"eu":[-467,-6,-0.977,0.213]},"na-eu":{"m":[-361,-563],"na":[59,-299,0.72,-0.694],"eu":[-353,292,-0.97,0.241]},"na-af":{"m":[-352,-221],"na":[319,-86,0.94,0.34],"af":[-348,-212,-0.424,-0.905]}};
const PG_SPOT={"sa":{"M":[105,144],"Cy":[-23,208],"G":[147,-21],"I":[-28,284]},"af":{"M":[-17,335],"Cy":[64,399],"L":[107,357],"G":[57,247],"I":[14,181],"A":[-239,-281]},"an":{"L":[15,-133],"G":[-96,-118],"I":[116,-53],"O":[63,143]},"in":{"L":[40,28],"G":[-1,117],"I":[-41,-17]},"au":{"G":[113,54],"I":[17,82],"O":[105,141]},"na":{"R":[235,-18],"K":[138,105],"A":[188,128]},"gr":{"R":[14,71]},"eu":{"R":[-395,-268],"K":[-424,-167]}};
const PG_EV={M:['Mesosaurus','#17a2a2','A small reptile that lived in fresh water. It could not swim across an ocean.'],
  Cy:['Cynognathus','#8a4fd6','A land reptile about the size of a wolf. It could not cross an ocean.'],
  L:['Lystrosaurus','#e07a2a','A land reptile with tusks, about the size of a pig.'],
  G:['Glossopteris','#3f9a3a','A seed fern. Its seeds were too big to blow across an ocean.'],
  I:['Glacier scratches','#3f8fe0','Scratches left in rock by an ancient ice sheet that spread across these lands.'],
  R:['Northern mountain rocks','#8a5a3a','The same old mountain rocks run through North America, Greenland and Europe.'],
  A:['Appalachian–Atlas rocks','#b0603a','The Appalachian Mountains match old mountain rocks in Morocco, Africa.'],
  K:['Matching coal beds','#3a3a3a','Coal beds of the same age line up between North America and Europe.'],
  O:['Matching rock layers','#6a6a9a','The same layers of rock are found in Antarctica and Australia.']};
/* name, fill, light, dark */
const PGC={na:['North America','#e8a23a','#ffd27a','#8a5a14'],sa:['South America','#5fb85a','#9be38f','#2c6a2a'],af:['Africa','#d9b44a','#f6dc86','#7f6118'],
  eu:['Eurasia','#c97a4a','#eeae84','#73401f'],gr:['Greenland','#cfe0ea','#ffffff','#6f8796'],an:['Antarctica','#e4eef6','#ffffff','#7d93a6'],
  in:['India','#e07a6a','#ffb1a3','#863a2e'],au:['Australia','#e0904a','#ffc48a','#8a4c18']};
const PGT=(id,ev)=>({id,ev});
const PGL=(name,story,o)=>Object.assign({name,story,type:'fit'},o);
const PG_LEVELS=[
  PGL('Two Coasts','Two continents that were once side by side.',{sock:{W:'sa',E:'af'},anchor:'E',borders:[['W','E',['M']]],
    tiles:[PGT('sa',['M','Cy','G']),PGT('af',['M','Cy','L','G']),PGT('au',['G','I'])],
    intro:'Africa is pinned in place. The badge on its coast shows evidence found on **both sides** of that border. Drag the continent that has the same evidence onto the glowing spot, then **turn it** until it snaps in. One continent does not belong.',
    fact:'Alfred Wegener noticed in 1912 that the same fossils are found on continents now separated by oceans. He called the supercontinent Pangaea.',
    clue:'Mesosaurus lived in fresh water, so it could not cross an ocean. Which continent in the tray has its fossils?'}),
  PGL('Fossil Trail','Three continents joined in a row.',{sock:{W:'sa',C:'af',S:'an'},borders:[['W','C',['M','Cy']],['C','S',['L']]],
    tiles:[PGT('sa',['M','Cy','G','I']),PGT('af',['M','Cy','L','G','I']),PGT('an',['L','G','I']),PGT('na',['R','K','A'])],
    fact:'Lystrosaurus fossils are found in Africa, India and Antarctica. A land animal could only have walked between them if the continents were joined.',
    clue:'The middle spot touches BOTH borders. Which continent has every fossil on both borders?'}),
  PGL('Gondwana','The southern half of Pangaea.',{sock:{W:'sa',C:'af',E:'in',S:'an',SE:'au'},
    borders:[['W','C',['M','Cy']],['C','S',['L','G']],['C','E',['L']],['S','E',['G','I']],['S','SE',['O']]],
    tiles:[PGT('sa',['M','Cy','G','I']),PGT('af',['M','Cy','L','G','I']),PGT('an',['L','G','I','O']),PGT('in',['L','G','I']),PGT('au',['G','I','O'])],
    fact:'Gondwana was the southern part of Pangaea. Glacier scratches show that an ice sheet once covered parts of what are now hot places like India and Africa.',
    clue:'Start with the spot that has the most evidence around it. Then use the rare evidence (like matching rock layers) to place the rest.'}),
  PGL('Mountain Match','The northern half of Pangaea.',{sock:{W:'na',N:'gr',E:'eu',S:'af'},
    borders:[['W','N',['R']],['N','E',['R']],['W','E',['K']],['W','S',['A']]],
    tiles:[PGT('na',['R','K','A']),PGT('gr',['R']),PGT('eu',['R','K']),PGT('af',['A','M']),PGT('au',['G','O'])],
    fact:'The Appalachian Mountains in New York’s neighborhood are made of the same rocks as mountains in Greenland, Scotland, Norway and Morocco. They formed as one mountain range when the continents collided.',
    clue:'The big spot on the left touches three borders with three kinds of rock evidence. Which continent has all three?'}),
  PGL('Climate Clues','Fossils and rocks can also show what the climate used to be.',{type:'rounds',rounds:[
      {t:'mc',art:'coal',q:'Coal and fossils of tropical ferns are found in Antarctica, which is frozen today. What does this tell us?',opts:[['moved','Antarctica was once in a warmer place, closer to the equator.'],['always','Antarctica has always been this cold.'],['blown','The ferns blew there in a storm.']],ans:'moved',why:'Coal forms from swampy, warm forests. Antarctica must have been somewhere warmer before it drifted to the South Pole.'},
      {t:'mc',art:'scratch',q:'Glacier scratches are found in hot India and Africa. What is the best explanation?',opts:[['pole','They were once joined together near the South Pole, under an ice sheet.'],['snow','It used to snow in India every year.'],['people','People made the scratches with tools.']],ans:'pole',why:'The scratches line up when the continents are put back together, showing one ice sheet once covered them near the South Pole.'},
      {t:'mc',art:'meso',q:'Why can’t Mesosaurus fossils in Africa and South America be explained by Mesosaurus swimming across the ocean?',opts:[['fresh','It was a small freshwater reptile that could not cross a salty ocean.'],['fly','It flew instead.'],['bridge','It walked across a bridge.']],ans:'fresh',why:'Mesosaurus lived in fresh water and was only about 1 meter long. The continents must have been joined.'}],
    fact:'Wegener used all of these clues together. Each clue alone is interesting, but together they make strong evidence that the continents have moved.',
    clue:'Ask: could this rock or fossil have formed where the continent is TODAY?'}),
  PGL('Pangaea','Put the whole supercontinent back together.',{sock:{NW:'na',N:'eu',W:'sa',C:'af',E:'in',S:'an',SE:'au'},
    borders:[['NW','N',['R','K']],['NW','C',['A']],['W','C',['M','Cy']],['C','S',['L']],['C','E',['L']],['S','E',['G','I']],['S','SE',['O']]],
    tiles:[PGT('na',['R','K','A']),PGT('eu',['R','K']),PGT('af',['A','M','Cy','L','G','I']),PGT('sa',['M','Cy','G','I']),PGT('an',['L','G','I','O']),PGT('in',['L','G','I']),PGT('au',['G','I','O'])],
    fact:'Pangaea started to break apart about 200 million years ago. The plates are still moving today, a few centimeters each year.',
    clue:'Africa sat in the middle of Pangaea. Then work outward one border at a time.'}),
  PGL('Pulling Apart','Plates that move away from each other.',{type:'rounds',rounds:[
      {t:'bd',a:'ocean',b:'ocean',mv:'apart',ans:'ridge',why:'Where ocean plates pull apart, magma rises and cools into new sea floor, building a long underwater mountain range: a mid-ocean ridge.'},
      {t:'bd',a:'cont',b:'cont',mv:'apart',ans:'rift',why:'When a continent starts to split, the land drops down into a long rift valley, like the East African Rift today.'},
      {t:'mc',art:'ages',q:'Rock samples are taken from the sea floor at A (right next to a ridge), B (farther away) and C (farthest). Which rock is the YOUNGEST?',opts:[['A','Rock A, next to the ridge'],['B','Rock B, in the middle'],['C','Rock C, farthest away']],ans:'A',why:'New sea floor forms at the ridge and is pushed outward. The farther from the ridge, the older the rock.'}],
    fact:'The pattern of sea floor ages, youngest at the ridge and older farther away, is strong evidence for sea-floor spreading.',
    clue:'When plates pull apart, something has to fill the gap. Where does new crust come from?'}),
  PGL('Crashing Together','Plates that push into each other.',{type:'rounds',rounds:[
      {t:'bd',a:'ocean',b:'cont',mv:'together',ans:'trench',why:'The heavier ocean plate sinks under the continent. That makes a deep trench, and melting rock rises to form volcanoes, like the Andes Mountains.'},
      {t:'bd',a:'cont',b:'cont',mv:'together',ans:'mtn',why:'Neither continent sinks easily, so the crust crumples and piles up into tall mountains, like the Himalayas (where India hit Asia).'},
      {t:'bd',a:'ocean',b:'ocean',mv:'together',ans:'arc',why:'One ocean plate sinks under the other, making a trench and a curved line of volcanic islands, like Japan.'}],
    fact:'Mount Everest, the tallest mountain on Earth, is still growing a few millimeters each year because India is still pushing into Asia.',
    clue:'Ocean crust is thinner and heavier than continental crust. When they meet, which one sinks?'}),
  PGL('Plate Detective','Mixed boundaries from around the world.',{type:'rounds',rounds:[
      {t:'bd',a:'cont',b:'cont',mv:'slide',ans:'fault',why:'Plates sliding past each other get stuck, then slip suddenly. That makes earthquakes along a long fault, like the San Andreas Fault in California.'},
      {t:'bd',a:'ocean',b:'ocean',mv:'apart',ans:'ridge',why:'Ocean plates moving apart make a mid-ocean ridge, like the one down the middle of the Atlantic Ocean.'},
      {t:'mc',art:'atlantic',q:'There is a mid-ocean ridge down the middle of the Atlantic Ocean. What is happening to the Atlantic?',opts:[['wider','It is slowly getting wider, a few centimeters a year.'],['narrow','It is getting narrower.'],['same','It stays exactly the same size.']],ans:'wider',why:'New sea floor forms at the ridge, pushing the Americas and Europe and Africa apart about as fast as your fingernails grow.'},
      {t:'mc',art:'ring',q:'On a world map, earthquakes and volcanoes form long lines. Why?',opts:[['edges','Most happen at the edges of plates, where plates meet.'],['random','They happen in random places.'],['hot','They only happen where the weather is hot.']],ans:'edges',why:'Plate boundaries are where plates pull apart, push together or slide past each other, so that is where most earthquakes and volcanoes happen.'}],
    fact:'The "Ring of Fire" around the Pacific Ocean is a line of volcanoes and earthquakes that marks plate boundaries.',
    clue:'Look at the arrows: apart, together, or sliding past?'})
];
const PG_PACKS={0:'Pack 1: Fossil clues',3:'Pack 2: Rocks and climate',6:'Pack 3: Plate boundaries'};
const PG_FEAT=[['ridge','Mid-ocean ridge'],['rift','Rift valley'],['trench','Trench + volcanic mountains'],['arc','Trench + volcanic islands'],['mtn','Tall folded mountains'],['fault','Sliding fault + earthquakes']];
const PG_DIR={W:'west',E:'east',C:'middle',S:'south',N:'north',NW:'northwest',SE:'southeast'};

/* ---------------- geometry helpers ---------------- */
const pgPolys=k=>{const S=PG_SHAPE[k];if(!S.pp)S.pp=S.d.split('M').filter(Boolean).map(s=>{const n=s.replace('Z','').trim().split(/\s+/).map(Number),o=[];for(let i=0;i+1<n.length;i+=2)o.push([n[i],n[i+1]]);return o;});return S.pp;};
const pgRot=(x,y,a)=>{const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r);return [x*c-y*s,x*s+y*c];};
const pgNorm=a=>{a=((a%360)+360)%360;return a>180?a-360:a;};
function pgIn(k,x,y){let n=0;pgPolys(k).forEach(pl=>{for(let i=0,j=pl.length-1;i<pl.length;j=i++){const [xi,yi]=pl[i],[xj,yj]=pl[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)n++;}});return n%2===1;}
function pgInside(k,x,y,nx,ny,step){for(let i=0;i<14&&!pgIn(k,x,y);i++){x-=nx*step;y-=ny*step;}return [x,y];}
function pgFrame(L){
  const H=window.innerWidth<600?560:400;if(L._f&&L._f.H===H)return L._f;const W=640,pad=20;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  Object.values(L.sock).forEach(k=>{const [px,py,a]=PG_POSE[k];pgPolys(k).forEach(pl=>pl.forEach(([x,y])=>{const [u,v]=pgRot(x,y,a);x0=Math.min(x0,u+px);x1=Math.max(x1,u+px);y0=Math.min(y0,v+py);y1=Math.max(y1,v+py);}));});
  const s=Math.min((W-2*pad)/(x1-x0),(H-2*pad)/(y1-y0));
  return (L._f={s,ox:W/2-s*(x0+x1)/2,oy:H/2-s*(y0+y1)/2,W,H,br:Math.max(7.5,Math.min(11,s*50)),mr:Math.max(6,Math.min(8.5,s*40))});
}
const pgPx=(F,x,y)=>[F.ox+F.s*x,F.oy+F.s*y];
const pgSlotOf=(L,k)=>Object.keys(L.sock).find(s=>L.sock[s]===k);
const pgBpKey=(a,b)=>PG_BP[a+'-'+b]?a+'-'+b:b+'-'+a;
const pgNeed=(L,slot)=>{const n=new Set();L.borders.forEach(([a,b,ev])=>{if(a===slot||b===slot)ev.forEach(e=>n.add(e));});return [...n];};
const pgTile=(L,k)=>L.tiles.find(t=>t.id===k);
const pgEvList=ev=>ev.map(e=>PG_EV[e][0]).join(', ').replace(/, ([^,]*)$/,' and $1');
/* where each piece's evidence marks sit, in board pixels */
function pgMarks(L,k,slot,F,cx,cy,rot){
  const ev=pgTile(L,k).ev,out=[],used=new Set(),s=F.s;
  if(slot&&L.sock[slot]===k)L.borders.forEach(([a,b,bev])=>{if(a!==slot&&b!==slot)return;
    const ok=L.sock[a===slot?b:a],key=pgBpKey(k,ok),bp=PG_BP[key];if(!bp||!bp[k])return;
    const [lx,ly,nx,ny]=bp[k],list=bev.filter(e=>ev.includes(e)&&!used.has(e));
    list.forEach((e,i)=>{used.add(e);const off=(i-(list.length-1)/2)*F.mr*2.9/s,ins=F.mr*1.65/s;
      const [x,y]=pgInside(k,lx-nx*ins-ny*off,ly-ny*ins+nx*off,nx,ny,5/s),[u,v]=pgRot(x,y,rot);out.push({e,x:cx+u*s,y:cy+v*s,b:key});});});
  const rest=ev.filter(e=>!used.has(e));
  rest.forEach((e,i)=>{const sp=(PG_SPOT[k]||{})[e]||[(i-1)*30,0],[u,v]=pgRot(sp[0],sp[1],rot);out.push({e,x:cx+u*s,y:cy+v*s});});
  for(let it=0;it<4;it++)for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){const A=out[i],B=out[j],dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1,md=F.mr*2.35;if(d<md){const m=(md-d)/2,ux=dx/d,uy=dy/d;if(!A.b){A.x-=ux*m;A.y-=uy*m;}if(!B.b){B.x+=ux*m;B.y+=uy*m;}}}
  return out;
}
const pgBadge=(e,x,y,r,cls)=>`<g class="pgbadge${cls?' '+cls:''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${PG_EV[e][1]}" stroke="#fff" stroke-width="2.2"/><text x="${x.toFixed(1)}" y="${(y+r*.36).toFixed(1)}" text-anchor="middle" font-size="${e.length>1?r*.8:r*.98}" font-weight="900" fill="#fff">${e}</text></g>`;
function pgShapeDefs(F){
  return Object.keys(PGC).map(k=>`<linearGradient id="pgf-${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PGC[k][2]}"/><stop offset=".55" stop-color="${PGC[k][1]}"/><stop offset="1" stop-color="${PGC[k][3]}" stop-opacity=".9"/></linearGradient>`).join('')+
    `<pattern id="pgtex" width="${(11/F.s).toFixed(2)}" height="${(11/F.s).toFixed(2)}" patternUnits="userSpaceOnUse"><circle cx="${(3/F.s).toFixed(2)}" cy="${(3/F.s).toFixed(2)}" r="${(1/F.s).toFixed(2)}" fill="#000" opacity=".22"/><circle cx="${(8.5/F.s).toFixed(2)}" cy="${(7.5/F.s).toFixed(2)}" r="${(.8/F.s).toFixed(2)}" fill="#fff" opacity=".35"/></pattern>`+
    `<filter id="pgsh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.6" flood-color="#04142e" flood-opacity=".45"/></filter>`;
}
function pgPieceSvg(k,F,cx,cy,rot,cls,attrs){
  const s=F.s,sw=(2.2/s).toFixed(2);
  return `<g class="pgpc ${cls||''}" ${attrs||''}><g filter="url(#pgsh)"><g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot})"><g transform="scale(${s.toFixed(5)})">`+
    `<path class="pgland" d="${PG_SHAPE[k].d}" fill="url(#pgf-${k})" stroke="${PGC[k][3]}" stroke-width="${sw}" stroke-linejoin="round"/><path d="${PG_SHAPE[k].d}" fill="url(#pgtex)" pointer-events="none"/>`+
    `<path class="pgedge" d="${PG_SHAPE[k].d}" fill="none" stroke-width="${(4/s).toFixed(2)}" stroke-linejoin="round" pointer-events="none"/></g></g></g></g>`;
}
const pgMini=(k,rot,size)=>{const r=PG_SHAPE[k].r,sc=size/2/r;
  return `<svg viewBox="${-size/2} ${-size/2} ${size} ${size}" width="${size}" height="${size}" aria-hidden="true"><g class="pgmrot" transform="rotate(${rot})"><g transform="scale(${sc.toFixed(5)})"><path d="${PG_SHAPE[k].d}" fill="${PGC[k][1]}" stroke="${PGC[k][3]}" stroke-width="${(1.6/sc).toFixed(1)}" stroke-linejoin="round"/></g></g></svg>`;};

/* ---------------- the fit board ---------------- */
function pgFitBoard(G){
  const L=G.L,S=G.st,F=pgFrame(L),W=F.W,H=F.H,T=ngT();
  let t=`<defs>${pgShapeDefs(F)}<linearGradient id="pgsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d6db5"/><stop offset="1" stop-color="#0d3f78"/></linearGradient>`+
    `<radialGradient id="pgvig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#021530" stop-opacity=".45"/></radialGradient>`+
    `<pattern id="pgwv" width="46" height="22" patternUnits="userSpaceOnUse"><path d="M0 11q11.5-7 23 0t23 0" stroke="#bfe4ff" stroke-width="1.3" fill="none" opacity=".22"/></pattern></defs>`+
    `<rect width="${W}" height="${H}" fill="url(#pgsea)"/><rect class="pgwaves" x="-46" width="${W+92}" height="${H}" fill="url(#pgwv)"/>`;
  for(let x=40;x<W;x+=80)t+=`<path d="M${x} 0Q${x+(x-W/2)*.08} ${H/2} ${x} ${H}" stroke="#cfe9ff" stroke-width=".8" fill="none" opacity=".16"/>`;
  for(let y=50;y<H;y+=75)t+=`<path d="M0 ${y}Q${W/2} ${y+(y-H/2)*.06} ${W} ${y}" stroke="#cfe9ff" stroke-width=".8" fill="none" opacity=".16"/>`;
  t+=`<rect width="${W}" height="${H}" fill="url(#pgvig)" pointer-events="none"/><text x="12" y="${H-12}" font-size="12" font-weight="800" fill="#d8ecff" opacity=".8" letter-spacing=".04em">250 MILLION YEARS AGO</text>`;
  const slots=Object.keys(L.sock),P=S.place;
  const ctr=sl=>{const [x,y]=PG_POSE[L.sock[sl]];return pgPx(F,x,y);};
  /* hint 3: gold outlines of the answer */
  if(G.hint>=3&&!T)slots.forEach(sl=>{const p=P[sl];if(p&&p.st==='snap')return;const k=L.sock[sl],[cx,cy]=ctr(sl);
    t+=`<g class="pgghost" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${PG_POSE[k][2]}) scale(${F.s.toFixed(5)})"><path d="${PG_SHAPE[k].d}" fill="#ffd23f" fill-opacity=".12" stroke="#ffd23f" stroke-width="${(2.4/F.s).toFixed(2)}" stroke-dasharray="${(7/F.s).toFixed(1)} ${(5/F.s).toFixed(1)}"/></g>`+
      `<text x="${cx.toFixed(1)}" y="${(cy+4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="900" fill="#ffe680" stroke="#3a2a00" stroke-width="3" paint-order="stroke" pointer-events="none">${PGC[k][0]}</text>`;});
  /* empty spots (drop targets), small ones last so they sit on top */
  slots.filter(sl=>!P[sl]).sort((a,b)=>PG_SHAPE[L.sock[b]].r-PG_SHAPE[L.sock[a]].r).forEach(sl=>{const k=L.sock[sl],[cx,cy]=ctr(sl),r=Math.max(26,Math.min(70,PG_SHAPE[k].r*F.s*.55));
    t+=`<g class="pgzone" data-s="${sl}" aria-label="Empty ${PG_DIR[sl]} spot. Its borders need ${ngEsc(pgEvList(pgNeed(L,sl)))}."><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="#bfe4ff" fill-opacity=".14" stroke="#e8f6ff" stroke-width="2.4" stroke-dasharray="8 6" class="pgzring"/>`+
      `<text x="${cx.toFixed(1)}" y="${(cy+7).toFixed(1)}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff" opacity=".85" pointer-events="none">?</text></g>`;});
  /* placed pieces */
  const marks={},parks=[];
  slots.forEach(sl=>{const p=P[sl];if(!p)return;const [cx,cy]=ctr(sl);
    if(p.st==='park'||p.st==='wrong'||p.st==='test'){parks.push([sl,p,cx,cy]);return;}
    t+=pgPieceSvg(p.k,F,cx,cy,p.rot,'snap'+(p.fresh?' fresh':'')+(p.anchor?' anchor':''),`data-s="${sl}"`);
    marks[sl]=pgMarks(L,p.k,sl,F,cx,cy,p.rot);});
  /* border badges, or glowing links where both sides have snapped */
  L.borders.forEach(([a,b,ev])=>{const ka=L.sock[a],kb=L.sock[b],key=pgBpKey(ka,kb),bp=PG_BP[key];if(!bp)return;
    const both=marks[a]&&marks[b],[mx,my]=pgPx(F,bp.m[0],bp.m[1]),ln=bp[ka],[nx,ny]=pgRot(ln[2],ln[3],PG_POSE[ka][2]);
    const wrongSl=parks.find(q=>q[1].st==='wrong'&&(q[0]===a||q[0]===b));
    ev.forEach((e,i)=>{const off=(i-(ev.length-1)/2)*F.br*2.35,x=mx-ny*off,y=my+nx*off;
      if(both){const A=marks[a].find(m=>m.e===e&&m.b===key),B=marks[b].find(m=>m.e===e&&m.b===key);
        if(A&&B){t+=`<g class="pglink${S.fresh===a||S.fresh===b?' fresh':''}"><line x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" stroke="#fff3a6" stroke-width="7" stroke-linecap="round" opacity=".55"/><line x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/></g>`;return;}}
      let cls='';if(wrongSl){const k=wrongSl[1].k;if(!pgTile(L,k).ev.includes(e))cls='miss';}
      t+=pgBadge(e,x,y,F.br,cls);if(cls)t+=`<path d="M${x-5} ${y-5}l10 10m0-10l-10 10" stroke="#fff" stroke-width="2.6" stroke-linecap="round" class="pgx"/>`;});});
  Object.values(marks).forEach(ms=>ms.forEach(m=>{t+=pgBadge(m.e,m.x,m.y,F.mr,'mk');}));
  /* waiting, wrong and test pieces sit on top */
  parks.forEach(([sl,p,cx,cy])=>{const cls=p.st==='park'?'park'+(S.sel===p.k?' sel':''):p.st;
    t+=pgPieceSvg(p.k,F,cx,cy,p.rot,cls,`data-s="${sl}" data-k="${p.k}"${p.st==='park'||p.st==='test'?` tabindex="0" role="button" aria-label="${PGC[p.k][0]}, turned ${pgNorm(p.rot)} degrees. ${p.st==='park'?'Arrow keys turn it.':'Enter sends it back.'}"`:''}`);
    pgMarks(L,p.k,sl,F,cx,cy,p.rot).forEach(m=>{t+=pgBadge(m.e,m.x,m.y,F.mr,'mk');});
    if(p.st==='park'){const r=Math.max(34,Math.min(84,PG_SHAPE[p.k].r*F.s*.62));
      t+=`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" class="pgring" fill="none"/>`+
        `<g class="pgturn" data-s="${sl}" data-d="-15" role="button" aria-label="Turn left"><circle cx="${(cx-r).toFixed(1)}" cy="${cy.toFixed(1)}" r="15"/><path d="M${cx-r+5} ${cy+4}a6 6 0 1 0-9-7m0 0v-5m0 5h5" fill="none"/></g>`+
        `<g class="pgturn" data-s="${sl}" data-d="15" role="button" aria-label="Turn right"><circle cx="${(cx+r).toFixed(1)}" cy="${cy.toFixed(1)}" r="15"/><path d="M${cx+r-5} ${cy+4}a6 6 0 1 1 9-7m0 0v-5m0 5h-5" fill="none"/></g>`;}});
  return ngSvg(W,H,t,'ngsvg pgsvg pgfit','Pangaea map. Drag continents onto the glowing spots. Badges between spots show the evidence found on both sides of each border.');
}
let PG_DRAG=null;
function pgDragInit(){
  if(PG_DRAG)PG_DRAG.destroy();
  PG_DRAG=Art.drag({root:$('ngGrid'),items:'.pgcard',targets:'.pgzone',
    accept:(it,t)=>!!(G&&G.key==='pangaea'&&G.st&&!G.st.busy&&!G.done&&!G.st.ok&&!G.st.place[t.dataset.s]),
    label:it=>it.getAttribute('aria-label')||'continent',
    onPick:it=>{const S=G&&G.key==='pangaea'&&G.st;if(!S)return;S.sel=it.dataset.k;pgSideSync();},
    onDrop:(it,t)=>pgDrop(it.dataset.k,t.dataset.s)});
}
/* light refresh of the side panel selection without a full render (keeps a picked-up card alive) */
function pgSideSync(){const S=G.st;document.querySelectorAll('.pgcard').forEach(c=>{c.classList.toggle('on',c.dataset.k===S.sel);const g=c.querySelector('.pgmrot');if(g)g.setAttribute('transform',`rotate(${S.rot[c.dataset.k]||0})`);});
  const tl=$('pgTurnLbl');if(tl)tl.textContent=S.sel?`${PGC[S.sel][0]}: turned ${Math.abs(pgNorm(pgRotOf(S.sel)))}°`:'Pick a continent to turn it';
  document.querySelectorAll('.pgtbtn').forEach(b=>{b.disabled=!S.sel||G.done||S.ok;});}
function pgRotOf(k){const S=G.st,sl=Object.keys(S.place).find(s=>S.place[s].k===k);return sl?S.place[sl].rot:(S.rot[k]||0);}
function pgTurn(d){
  const S=G.st,L=G.L;if(!S.sel||G.done||S.ok||S.busy)return;const k=S.sel;
  const sl=Object.keys(S.place).find(s=>S.place[s].k===k&&(S.place[s].st==='park'||S.place[s].st==='test'));
  if(sl){const p=S.place[sl];p.rot=pgNorm(p.rot+d);if(p.st==='park'&&pgNorm(p.rot-PG_POSE[k][2])===0)return pgSnap(sl);ngRender();
    const el=document.querySelector(`.pgpc.park[data-s="${sl}"],.pgpc.test[data-s="${sl}"]`);if(el)el.focus({preventScroll:true});return;}
  if(Object.values(S.place).some(p=>p.k===k))return;
  S.rot[k]=pgNorm((S.rot[k]||0)+d);pgSideSync();void L;
}
function pgDrop(k,sl){
  const L=G.L,S=G.st;if(!k||!sl||S.place[sl]||G.done||S.ok||S.busy)return;
  const rot=S.rot[k]||0;S.sel=k;S.msg=null;
  if(ngT()){S.place[sl]={k,rot,st:'test'};ngRender();return;}
  G.tries++;const need=pgNeed(L,sl),have=pgTile(L,k).ev,miss=need.filter(e=>!have.includes(e));
  if(miss.length||L.sock[sl]!==k){
    G.miss++;S.place[sl]={k,rot,st:'wrong'};S.busy=true;
    const e=miss[0];
    S.msg=['no',miss.length?`${PGC[k][0]} has no ${PG_EV[e][0]} evidence, but a border of this spot does. ${PG_EV[e][2]}`
      :`${PGC[k][0]} has the ${pgEvList(need)} evidence, but its coast does not fit here. Look for the spot that needs evidence ONLY ${PGC[k][0]} has.`];
    fx.pop({icon:'puzzle',text:'Evidence does not match',kind:'oops'});ngRender();ngSay(miss.length?'The red badge shows the evidence this continent is missing.':'Right evidence, wrong spot. Which spot needs it most?','alert');
    const key=G.key,lv=G.i;setTimeout(()=>{if(!G||G.key!==key||G.i!==lv||!G.st.busy)return;delete G.st.place[sl];G.st.busy=false;ngRender();},Art.reduced()?600:1500);
    return;}
  S.place[sl]={k,rot,st:'park'};
  if(pgNorm(rot-PG_POSE[k][2])===0)return pgSnap(sl,true);
  S.msg=['ok',`✓ ${PGC[k][0]} has the right evidence for this spot! Now turn it so its marks line up with the badges.`];
  ngRender();ngSay('Right continent! **Turn it** with ⟲ ⟳ (or Q / E) until it snaps in.','go');
  const el=document.querySelector(`.pgpc.park[data-s="${sl}"]`);if(el){Art.pop(el,1.04);}
}
function pgSnap(sl,first){
  const L=G.L,S=G.st,p=S.place[sl];p.st='snap';p.rot=PG_POSE[p.k][2];p.fresh=true;S.fresh=sl;S.sel=null;
  Object.values(S.place).forEach(q=>{if(q!==p)q.fresh=false;});
  const done=Object.keys(L.sock).every(s=>S.place[s]&&S.place[s].st==='snap');
  S.msg=['ok',`✓ ${PGC[p.k][0]} snaps in. Its ${pgEvList(pgNeed(L,sl).filter(e=>pgTile(L,p.k).ev.includes(e)))} evidence lines up across the border${first?' on the first try':''}.`];
  ngRender();
  const el=document.querySelector(`.pgpc.snap[data-s="${sl}"]`);if(el){Art.sparkle(el,{n:14});const r=el.getBoundingClientRect();Art.burst(r.left+r.width/2,r.top+r.height/2,{n:16,colors:['#ffd23f','#fff','#7fe0a8'],shape:['star','dot']});}
  if(!done){ngSay('It fits! The evidence lines up across the border.','go');return;}
  S.ok=true;const out=L.tiles.filter(t=>!Object.values(L.sock).includes(t.id));
  S.msg=['ok','✓ Every border matches the evidence. Pangaea is back together!'+(out.length?` ${out.map(t=>PGC[t.id][0]).join(' and ')} stayed out: ${out.length>1?'they do':'it does'} not have the evidence these borders need.`:'')];
  ngRender();ngSay('The evidence lines up on every border!','go');G.detail={checks:G.miss+1,wrongFits:G.miss};
  ngWin(ngStars(G.miss,0,1),G.miss?['You rebuilt the map with ',h('b',null,G.miss),` wrong fit${G.miss===1?'':'s'}.`]:['You rebuilt the map with ',h('b',null,'no wrong fits'),'!']);
}
function pgUnplace(sl){const S=G.st,p=S.place[sl];if(!p||(p.st!=='park'&&p.st!=='test')||G.done)return;S.sel=p.k;S.rot[p.k]=p.rot;delete S.place[sl];S.msg=null;ngRender();}
function pgSubmit(){
  const L=G.L,S=G.st;if(G.done)return;const slots=Object.keys(L.sock);if(!slots.every(s=>S.place[s]))return;
  const ok=slots.every(sl=>{const k=S.place[sl].k,have=pgTile(L,k).ev;return pgNeed(L,sl).every(e=>have.includes(e));});
  ngTDone(ok?1:0);
}
/* rotate a waiting piece by dragging around it */
function pgBindBoard(svg){
  const S=G.st;
  svg.querySelectorAll('.pgturn').forEach(b=>{const go=e=>{e.preventDefault();e.stopPropagation();const p=S.place[b.dataset.s];if(!p)return;S.sel=p.k;pgTurn(+b.dataset.d);};b.addEventListener('pointerdown',go);});
  svg.querySelectorAll('.pgpc.park,.pgpc.test').forEach(el=>{const sl=el.dataset.s;
    el.addEventListener('keydown',e=>{const p=S.place[sl];if(!p)return;S.sel=p.k;
      if(['ArrowLeft','ArrowDown','q','Q','['].includes(e.key)){e.preventDefault();pgTurn(-15);}
      else if(['ArrowRight','ArrowUp','e','E',']'].includes(e.key)){e.preventDefault();pgTurn(15);}
      else if(e.key==='Enter'||e.key===' '||e.key==='Backspace'||e.key==='Delete'){e.preventDefault();pgUnplace(sl);}});
    el.addEventListener('pointerdown',e=>{const p=S.place[sl];if(!p||G.done)return;e.preventDefault();S.sel=p.k;
      const F=pgFrame(G.L),[cx,cy]=pgPx(F,PG_POSE[G.L.sock[sl]][0],PG_POSE[G.L.sock[sl]][1]),m=svg.getScreenCTM();if(!m)return;
      const scx=m.a*cx+m.c*cy+m.e,scy=m.b*cx+m.d*cy+m.f,a0=Math.atan2(e.clientY-scy,e.clientX-scx),r0=p.rot,x0=e.clientX,y0=e.clientY;let moved=false;
      const mv=ev=>{if(!G||!G.st.place[sl]||G.st.place[sl].st==='snap'){end();return;}if(!moved&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<6)return;moved=true;
        const a=Math.atan2(ev.clientY-scy,ev.clientX-scx),deg=Math.round(((a-a0)*180/Math.PI)/15)*15,want=pgNorm(r0+deg),q=G.st.place[sl];
        if(want!==q.rot){pgTurn(pgNorm(want-q.rot));}};
      const end=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);};
      const up=()=>{end();if(!moved&&G&&G.st.place[sl]&&G.st.place[sl].st!=='snap'){if(G.st.place[sl].st==='test')pgUnplace(sl);else{S.sel=p.k;ngRender();}}};
      window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);});});
}
function pgFitRender(G,main,side){
  const L=G.L,S=G.st,T=ngT(),b=pgFitBoard(G);pgBindBoard(b);
  Object.values(S.place).forEach(p=>{if(p.fresh)setTimeout(()=>{p.fresh=false;},900);});if(S.fresh)setTimeout(()=>{if(G&&G.st===S)S.fresh=null;},900);
  const ev=[...new Set(L.tiles.flatMap(t=>t.ev).concat(L.borders.flatMap(x=>x[2])))];
  ngRC(main,h('div',{class:'pgwrap'},b),h('div',{class:'pglegend'},...ev.map(e=>h('span',{title:PG_EV[e][2]},h('i',{style:`background:${PG_EV[e][1]}`},e),PG_EV[e][0]))));
  const used=new Set(Object.values(S.place).map(p=>p.k));
  const cards=L.tiles.filter(t=>!used.has(t.id)).map(t=>h('div',{class:'pgcard'+(S.sel===t.id?' on':''),'data-k':t.id,'aria-label':`${PGC[t.id][0]}: ${pgEvList(t.ev)}`},
    h('span',{class:'pgcm'},svgEl(pgMini(t.id,S.rot[t.id]||0,44))),h('span',{class:'pgcn'},h('b',null,PGC[t.id][0]),h('span',{class:'pgev'},...t.ev.map(e=>h('i',{style:`background:${PG_EV[e][1]}`,title:PG_EV[e][0]},e))))));
  const slots=Object.keys(L.sock),nSnap=slots.filter(s=>S.place[s]&&S.place[s].st==='snap').length,full=slots.every(s=>S.place[s]);
  ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Continents',h('small',null,'drag one onto a glowing spot')),
    h('div',{class:'pgtray'},...(cards.length?cards:[h('p',{class:'sub'},'All continents are on the map.')])),
    h('div',{class:'pgturnrow'},h('span',{class:'stepchip'},'2'),h('span',{id:'pgTurnLbl'},''),
      ngBtn('⟲',()=>pgTurn(-15),'ghost sm pgtbtn',{'aria-label':'Turn left'}),ngBtn('⟳',()=>pgTurn(15),'ghost sm pgtbtn',{'aria-label':'Turn right'})),
    T?null:h('div',{class:'pgprog'},h('i',{style:`width:${Math.round(nSnap/slots.length*100)}%`}),h('span',null,`${nSnap} of ${slots.length} fitted`)),
    S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
    T?ngBtn('Submit my map',pgSubmit,'good',{style:'width:100%;font-size:17px',disabled:!full||G.done}):null,
    T?h('p',{class:'pgnotes'},'Tap a placed continent to send it back.'):null);
  pgSideSync();
  if(!S.msg&&!S.ok)ngSay(S.sel?`Drag **${PGC[S.sel][0]}** onto a glowing spot, or tap a spot. Turn it with ⟲ ⟳ or Q / E.`:'Drag a continent onto a glowing spot. Its evidence must match every badge on that spot’s borders.');
}

/* ---------------- plate boundaries: predict, then drag the plates ---------------- */
const pgCl=v=>Math.max(0,Math.min(1,v));
const PG_BD_DEFS=`<defs><linearGradient id="pgbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#e6f6ff"/></linearGradient>
<linearGradient id="pgbman" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d3c"/><stop offset="1" stop-color="#a92e18"/></linearGradient>
<linearGradient id="pgbwat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4aa3e0" stop-opacity=".9"/><stop offset="1" stop-color="#174f88"/></linearGradient>
<linearGradient id="pgbcon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9b27a"/><stop offset="1" stop-color="#9a6f3c"/></linearGradient>
<linearGradient id="pgbbas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6d88"/><stop offset="1" stop-color="#2e394e"/></linearGradient>
<radialGradient id="pgbmag"><stop offset="0" stop-color="#fff3a0"/><stop offset=".45" stop-color="#ff8a1e"/><stop offset="1" stop-color="#c2280e" stop-opacity="0"/></radialGradient>
<linearGradient id="pgbgrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc36a"/><stop offset="1" stop-color="#4f9a45"/></linearGradient>
<pattern id="pgbfield" width="60" height="40" patternUnits="userSpaceOnUse"><rect width="60" height="40" fill="#9ccf6e"/><rect width="30" height="20" fill="#b8dc7c"/><rect x="30" y="20" width="30" height="20" fill="#86c066"/><circle cx="12" cy="31" r="5" fill="#3f8a3c"/><circle cx="47" cy="9" r="4" fill="#3f8a3c"/></pattern></defs>`;
const pgTxt=(x,y,t,c,sz,anc)=>`<text x="${x}" y="${y}" text-anchor="${anc||'middle'}" font-size="${sz||12}" font-weight="800" fill="${c||'#1b2433'}" stroke="${c==='#fff'?'#0c2340':'#fff'}" stroke-width="3" paint-order="stroke" pointer-events="none">${t}</text>`;
const pgArrow=(x,y,dir,c)=>`<path d="M${x} ${y}h${dir*44}m0 0l${-dir*11}-8m${dir*11} 8l${-dir*11} 8" stroke="${c||'#1b2433'}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
function pgStrata(x0,x1,top,bot,wav){let t='';for(let i=1;i<4;i++){const y=top+(bot-top)*i/4;t+=`<path d="M${x0} ${y}${wav?`Q${(x0+x1)/2} ${y-wav*(1+i*.3)} ${x1} ${y}`:`H${x1}`}" stroke="#7a5428" stroke-width="1.3" fill="none" opacity=".45"/>`;}return t;}
function pgBdInner(R,p,o){
  const W=640,H=300,SEA=112,a=R.ans;p=pgCl(p);let t=PG_BD_DEFS;
  if(R.mv==='slide'){
    const d1=-48*p,d2=48*p;
    t+=`<g transform="translate(${d1} 0)"><rect x="-80" y="0" width="${W+160}" height="148" fill="url(#pgbfield)"/><rect x="${320-17}" y="0" width="34" height="148" fill="#59606d"/><path d="M320 0V148" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="10 9"/></g>`+
      `<g transform="translate(${d2} 0)"><rect x="-80" y="152" width="${W+160}" height="148" fill="url(#pgbfield)"/><rect x="${320-17}" y="152" width="34" height="148" fill="#59606d"/><path d="M320 152V300" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="10 9"/></g>`+
      `<path d="M0 150l40-3 30 5 40-4 35 4 45-3 40 3 40-4 45 5 40-3 45 3 40-4 40 4 45-3 40 3 35-2" stroke="#4a2a10" stroke-width="5" fill="none"/>`;
    const ph=(p*3)%1;if(p>.04&&(o.done||ph<.45))[110,250,400,540].forEach((x,i)=>{const r=10+((o.done?(.3+i*.17)%1:ph/.45))*46;t+=`<circle cx="${x}" cy="150" r="${r}" fill="none" stroke="#e2483f" stroke-width="3" opacity="${(1-r/60).toFixed(2)}"/>`;});
    t+=pgArrow(150,70,-1,'#fff')+pgArrow(490,230,1,'#fff')+pgTxt(150,104,'Plate 1','#fff',13)+pgTxt(490,264,'Plate 2','#fff',13)+pgTxt(320,20,'Top view','#fff',13);
    if(o.done)t+=pgTxt(320,140,'Earthquakes along the fault','#fff',14);
    return t+pgHandle(R,p,o,470+d2,226);
  }
  t+=`<rect width="${W}" height="${SEA+40}" fill="url(#pgbsky)"/><rect y="168" width="${W}" height="${H-168}" fill="url(#pgbman)"/>`;
  /* slow mantle currents */
  const cur=(x,dir)=>`<path class="pgcur" d="M${x} 284C${x} 214 ${x+dir*30} 200 ${x+dir*96} 196" stroke="#ffd9a0" stroke-width="2.5" fill="none" stroke-dasharray="7 7" opacity=".7"/><path d="M${x+dir*96} 196l${-dir*10}-6m${dir*10} 6l${-dir*10} 6" stroke="#ffd9a0" stroke-width="2.5" fill="none" opacity=".7"/>`;
  if(R.mv==='apart')t+=cur(300,-1)+cur(340,1);else t+=cur(120,1)+cur(520,-1);
  t+=pgTxt(14,292,'Hot mantle','#fff',11,'start');
  const ocean=(x0,x1)=>`<rect x="${x0}" y="${SEA}" width="${x1-x0}" height="${150-SEA}" fill="url(#pgbwat)"/><rect x="${x0}" y="150" width="${x1-x0}" height="24" fill="url(#pgbbas)"/>`;
  const cont=(x0,x1)=>`<rect x="${x0}" y="92" width="${x1-x0}" height="84" fill="url(#pgbcon)"/>${pgStrata(x0,x1,98,176)}<rect x="${x0}" y="90" width="${x1-x0}" height="7" fill="url(#pgbgrass)"/>`;
  const blobs=(x,y0,y1,n,ph)=>{let s='';for(let i=0;i<n;i++){const f=((ph+i/n)%1);s+=`<circle cx="${(x+Math.sin(i*2.1+f*4)*6).toFixed(1)}" cy="${(y0+(y1-y0)*f).toFixed(1)}" r="${(5-f*2).toFixed(1)}" fill="#ffb347" opacity="${(1-f*.7).toFixed(2)}"/>`;}return s;};
  if(a==='ridge'){const d=26*p;
    t+=`<rect x="0" y="${SEA}" width="${W}" height="${150-SEA}" fill="url(#pgbwat)"/>`;
    t+=`<ellipse cx="320" cy="182" rx="${30+d}" ry="${12+16*p}" fill="url(#pgbmag)"/>`;
    t+=`<rect x="-10" y="150" width="${330-d}" height="24" fill="url(#pgbbas)"/><rect x="${320+d}" y="150" width="${330}" height="24" fill="url(#pgbbas)"/>`;
    for(let x=0;x<d;x+=7){const c=Math.floor(x/7)%2?'#7d91b3':'#46566f';t+=`<rect x="${(320-x-7).toFixed(1)}" y="150" width="7" height="24" fill="${c}"/><rect x="${(320+x).toFixed(1)}" y="150" width="7" height="24" fill="${c}"/>`;}
    if(p>0)t+=`<path d="M${320-d-56} 150Q${320-d-14} ${150-12*p} ${320-7} ${150-30*p}L${320+7} ${150-30*p}Q${320+d+14} ${150-12*p} ${320+d+56} 150Z" fill="#53647f" stroke="#2e394e" stroke-width="1.5"/><path d="M${314} ${150-30*p}l6 ${8*p} 6 ${-8*p}" fill="#ff8a1e"/>`+blobs(320,186,152-24*p,4,p*2);
    t+=pgTxt(150,138,'Ocean plate','#fff')+pgTxt(490,138,'Ocean plate','#fff')+pgArrow(250,58,-1)+pgArrow(390,58,1);
  }else if(a==='rift'){const d=18*p,xl=320-d-46,xr=320+d+46,fl=92+40*p,st=92+16*p;
    t+=`<ellipse cx="320" cy="182" rx="${48+d*1.6}" ry="${10+22*p}" fill="url(#pgbmag)"/>`;
    t+=`<path d="M-10 92H${xl}L${xl+12} ${st}H${320-d-8}L${320-d} ${fl}H${320+d}L${320+d+8} ${st}H${xr-12}L${xr} 92H650V176H${320+d+70}Q320 ${176-36*p} ${320-d-70} 176H-10Z" fill="url(#pgbcon)" stroke="#6a4520" stroke-width="1.5"/>`+pgStrata(-10,650,104,170,6*p);
    t+=`<path d="M-10 90H${xl}M${xr} 90H650" stroke="#5fae52" stroke-width="7"/><path d="M${xl} 92L${xl+12} ${st}M${320-d-8} ${st}L${320-d} ${fl}M${320+d} ${fl}L${320+d+8} ${st}M${xr-12} ${st}L${xr} 92" stroke="#4a2a10" stroke-width="2.5"/>`;
    if(p>.7){const lk=(p-.7)/.3*9;t+=`<rect x="${320-d}" y="${fl-lk}" width="${2*d}" height="${lk}" fill="#4aa3e0"/>`;}
    if(p>0)t+=blobs(320,190,176-30*p,3,p*2);
    t+=pgTxt(130,140,'Continent')+pgTxt(510,140,'Continent')+pgArrow(250,52,-1)+pgArrow(390,52,1);
  }else if(a==='trench'||a==='arc'){const sb=8*p,bx=330-sb,vp=pgCl((p-.3)/.7),tipx=bx+70+50*p,tipy=200+74*p;
    t+=`<rect x="0" y="${SEA}" width="${a==='arc'?W:bx+20}" height="${150-SEA}" fill="url(#pgbwat)"/>`;
    t+=`<path d="M${bx-60} 162C${bx} 162 ${bx+26} 176 ${tipx} ${tipy}" stroke="#2e394e" stroke-width="25" fill="none" stroke-linecap="round"/><path d="M${bx-60} 152C${bx} 152 ${bx+30} 166 ${tipx+4} ${tipy-10}" stroke="#6d7d98" stroke-width="3" fill="none"/>`;
    for(let i=0;i<8;i++){const sx=-10+((i*90+34*p*3)%(bx+60));t+=`<rect x="${sx.toFixed(1)}" y="152" width="3" height="20" fill="#7d91b3" opacity=".5"/>`;}
    t+=`<rect x="-10" y="150" width="${bx-50}" height="24" fill="url(#pgbbas)"/>`;
    t+=`<path d="M${bx-64} 150Q${bx-12} ${158+30*p} ${bx+10} 150Z" fill="#0d3866"/>`;
    if(a==='trench')t+=`<path d="M${bx+4} 176L${bx+18} 92H650V176Z" fill="url(#pgbcon)" stroke="#6a4520" stroke-width="1.5"/>${pgStrata(bx+14,650,100,174)}<rect x="${bx+18}" y="89" width="${650-bx}" height="7" fill="url(#pgbgrass)"/>`;
    else t+=`<rect x="${bx+6}" y="150" width="${650-bx}" height="24" fill="url(#pgbbas)" stroke="#2e394e" stroke-width="1"/>`;
    if(p>.25){const mx=bx+86+20*p;t+=`<path d="M${tipx-20} ${tipy-24}Q${mx+10} 200 ${bx+122} ${a==='trench'?150:170}" stroke="#ff8a1e" stroke-width="3" stroke-dasharray="5 6" fill="none" opacity=".8"/>`+blobs(bx+124,tipy-30,a==='trench'?140:166,4,p*2.5);}
    const vx=bx+124,base=a==='trench'?92:150,ht=(a==='trench'?66:84)*vp;
    if(vp>0){t+=`<path d="M${vx-54} ${base}L${vx-8} ${base-ht}H${vx+8}L${vx+54} ${base}Z" fill="${a==='trench'?'#8a5a34':'#6b5a46'}" stroke="#4a2f18" stroke-width="1.5"/>`;
      if(a==='arc'&&base-ht<SEA)t+=`<path d="M${vx-54+46*(1-(SEA-(base-ht))/ht)} ${SEA}L${vx-8} ${base-ht}H${vx+8}L${vx+54-46*(1-(SEA-(base-ht))/ht)} ${SEA}Z" fill="#7a9a52" opacity=".55"/>`;
      if(vp>.6)t+=`<path d="M${vx-7} ${base-ht+1}l3 ${16*vp} 4 ${-10*vp} 3 ${18*vp}" stroke="#ff6a1e" stroke-width="3" fill="none"/>`;}
    if(o.done)t+=`<g class="pgsmoke"><circle cx="${vx}" cy="${base-ht-14}" r="10" fill="#8a8f99" opacity=".75"/><circle cx="${vx+12}" cy="${base-ht-28}" r="13" fill="#9aa0aa" opacity=".6"/><circle cx="${vx+2}" cy="${base-ht-46}" r="16" fill="#b3b8c0" opacity=".45"/></g><circle cx="${vx}" cy="${base-ht+2}" r="7" fill="#ffd34d"/>`;
    t+=pgTxt(120,138,'Ocean plate','#fff')+(a==='trench'?pgTxt(560,140,'Continent'):pgTxt(560,168,'Ocean plate','#fff'))+pgArrow(100,52,1)+pgArrow(540,52,-1);
  }else if(a==='mtn'){const pk=[0,.35,.6,.42,.82,1,.7,.92,.5,.3,0],w=230,x0=320-w/2;
    t+=`<path d="M-10 92H${x0}${pk.map((v,i)=>`L${(x0+i*w/10).toFixed(1)} ${(92-v*96*p).toFixed(1)}`).join('')}L650 92V176H${320+150}Q320 ${176+50*p} ${320-150} 176H-10Z" fill="url(#pgbcon)" stroke="#6a4520" stroke-width="1.5"/>`;
    for(let i=1;i<5;i++){const y=96+i*16;t+=`<path d="M-10 ${y}H${x0-20}C${x0+30} ${y-30*p} ${x0+60} ${y+24*p} 320 ${y-34*p}S${x0+w-30} ${y+20*p} ${x0+w+20} ${y}H650" stroke="#7a5428" stroke-width="1.4" fill="none" opacity=".5"/>`;}
    t+=`<path d="M-10 90H${x0}M${x0+w} 90H650" stroke="#5fae52" stroke-width="7"/>`;
    if(p>.72)pk.forEach((v,i)=>{if(v>.75){const x=x0+i*w/10,y=92-v*96*p;t+=`<path d="M${x-9} ${y+12}L${x} ${y}L${x+9} ${y+12}Q${x} ${y+8} ${x-9} ${y+12}Z" fill="#fff"/>`;}});
    t+=pgTxt(100,140,'Continent')+pgTxt(540,140,'Continent')+pgArrow(70,40,1)+pgArrow(570,40,-1);
  }
  if(o.done)t+=`<g><rect x="${320-118}" y="8" width="236" height="26" rx="13" fill="#fff" stroke="#1b2433" stroke-width="2"/>${pgTxt(320,26,PG_FEAT.find(f=>f[0]===a)[1],'#1b2433',14)}</g>`;
  const hx=R.mv==='apart'?470+(a==='ridge'?26:18)*p:470-(a==='mtn'?24:8)*p;
  return t+pgHandle(R,p,o,hx,64);
}
function pgHandle(R,p,o,x,y){
  if(o.done)return '';const lock=!o.pred;
  return `<g class="pghandle${lock?' lock':''}${o.moved?'':' wiggle'}" tabindex="${lock?-1:0}" role="slider" aria-label="Push the plates" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p*100)}">`+
    `<circle cx="${x}" cy="${y}" r="24" fill="${lock?'#9aa6bb':'#ffd23f'}" stroke="#fff" stroke-width="3"/>`+
    (R.mv==='together'?`<path d="M${x+11} ${y}h-22m0 0l7-6m-7 6l7 6" stroke="#1b2433" stroke-width="3.5" fill="none" stroke-linecap="round"/>`:`<path d="M${x-11} ${y}h22m0 0l-7-6m7 6l-7 6" stroke="#1b2433" stroke-width="3.5" fill="none" stroke-linecap="round"/>`)+
    (lock?pgTxt(x,y-32,'Predict first','#1b2433',11):'')+`</g>`;
}
function pgBdBoard(G){
  const S=G.st,R=G.L.rounds[S.r];
  const svg=ngSvg(640,300,pgBdInner(R,S.p,{pred:!!S.pred,done:S.ran,moved:S.p>0}),'ngsvg pgsvg pgbd','A cross-section of two plates at a boundary. Predict, then drag the yellow handle to push the plates.');
  const upd=()=>{svg.innerHTML=pgBdInner(R,S.p,{pred:!!S.pred,done:S.ran,moved:S.p>0});};
  const dir=R.mv==='together'?-1:1;
  const setP=v=>{if(S.ran||!S.pred||G.done)return;S.p=pgCl(v);upd();if(S.p>=1)pgBdFinish();};
  svg.addEventListener('pointerdown',e=>{const hd=e.target.closest&&e.target.closest('.pghandle');if(!hd||!S.pred||S.ran)return;e.preventDefault();
    const m=svg.getScreenCTM(),sc=m?m.a:1,x0=e.clientX,p0=S.p;
    const mv=ev=>setP(p0+dir*(ev.clientX-x0)/sc/140),up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);};
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);});
  svg.addEventListener('keydown',e=>{if(!(e.target.closest&&e.target.closest('.pghandle')))return;
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setP(S.p+((e.key==='ArrowRight')===(dir>0)?.1:-.1));setTimeout(()=>{const h2=svg.querySelector('.pghandle');if(h2)h2.focus();},0);}});
  S.play=()=>{if(S.ran||!S.pred)return;const p0=S.p;Art.tween({from:p0,to:1,dur:1800*(1-p0)+200,ease:'inOutQuad',step:v=>{if(G&&G.st===S&&!S.ran){S.p=v;upd();}},done:()=>{if(G&&G.st===S&&!S.ran){S.p=1;upd();pgBdFinish();}}});};
  return svg;
}
function pgBdFinish(){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(S.ran)return;S.ran=true;S.p=1;
  const fn=v=>PG_FEAT.find(f=>f[0]===v)[1];
  if(S.pred===R.ans){S.okNow=true;S.msg=['ok','✓ You predicted it! '+R.why];fx.pop({icon:'globe',text:'Good prediction!',kind:'good'});ngSay('Your prediction was right!','go');}
  else{S.okNow=true;G.miss++;G.tries++;S.wrong=[S.pred];S.msg=['no',`You predicted: ${fn(S.pred)}. What formed: ${fn(R.ans)}. ${R.why}`];fx.pop({icon:'globe',text:'Not what you predicted',kind:'oops'});ngSay('Compare your prediction with what formed.','alert');}
  ngRender();
}

/* ---------------- pictures for the evidence questions ---------------- */
function pgMcArt(R){
  const W=640,H=300;let t=PG_BD_DEFS;const k=R.art;
  if(k==='coal'){
    t+=`<rect width="${W}" height="${H}" fill="#cfe6f7"/><path d="M0 120L90 60 150 100 230 40 320 96 400 50 470 92 560 46 640 90V300H0Z" fill="#f4f9fd" stroke="#b8cfe0" stroke-width="2"/>`+
      `<rect x="120" y="150" width="400" height="130" rx="10" fill="#9a8a78"/><rect x="120" y="150" width="400" height="22" fill="#b5a593"/><rect x="120" y="200" width="400" height="26" fill="#22201f"/><rect x="120" y="240" width="400" height="40" fill="#8a7a68"/>`+
      `<g transform="translate(250 254)" stroke="#5a4a38" stroke-width="2" fill="none"><path d="M0 0Q40-6 80-18"/>${[10,24,38,52,66].map(x=>`<path d="M${x} ${-x*.2}l-6-12M${x} ${-x*.2}l8-10"/>`).join('')}</g>`+
      pgTxt(320,215,'COAL (from warm swamp forests)','#fff',13)+pgTxt(340,272,'tropical fern fossil','#2a1e10',12,'start')+
      `<g transform="translate(560 160)"><rect x="-9" y="-60" width="18" height="80" rx="9" fill="#fff" stroke="#3a4a66" stroke-width="2"/><rect x="-4" y="-10" width="8" height="26" fill="#3f8fe0"/><circle cy="24" r="13" fill="#3f8fe0" stroke="#3a4a66" stroke-width="2"/></g>`+pgTxt(560,206,'−40 °C today','#1b2433',13)+pgTxt(320,30,'Antarctica today','#1b2433',16);
  }else if(k==='scratch'){
    t+=`<rect width="${W}" height="${H}" fill="#ffe9b8"/><circle cx="560" cy="58" r="34" fill="#ffd23f"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${560+Math.cos(i*.785)*44} ${58+Math.sin(i*.785)*44}l${Math.cos(i*.785)*14} ${Math.sin(i*.785)*14}" stroke="#ffb703" stroke-width="4" stroke-linecap="round"/>`).join('')}`+
      [[60,'India'],[340,'Africa']].map(([x,n])=>`<g><rect x="${x}" y="110" width="240" height="150" rx="16" fill="#a99a88" stroke="#7a6a58" stroke-width="3"/>${[0,1,2,3,4,5].map(i=>`<path d="M${x+20} ${130+i*20}l200 ${16}" stroke="#5e5144" stroke-width="3" stroke-linecap="round" opacity=".8"/>`).join('')}${pgTxt(x+120,290,n,'#1b2433',15)}</g>`).join('')+
      pgTxt(320,40,'Glacier scratches in hot places','#1b2433',16)+pgTxt(320,64,'The scratches point the same way when the continents fit together.','#5a4a38',12);
  }else if(k==='meso'){
    const sa=PG_SHAPE.sa,af=PG_SHAPE.af,s1=110/sa.r,s2=110/af.r;
    t+=`<rect width="${W}" height="${H}" fill="#1d6db5"/><rect width="${W}" height="${H}" fill="url(#pgbwat)" opacity=".4"/>`+
      `<g transform="translate(130 160) scale(${s1.toFixed(4)})"><path d="${sa.d}" fill="#5fb85a" stroke="#2c6a2a" stroke-width="${(2/s1).toFixed(1)}"/></g><g transform="translate(500 150) scale(${s2.toFixed(4)})"><path d="${af.d}" fill="#d9b44a" stroke="#7f6118" stroke-width="${(2/s2).toFixed(1)}"/></g>`+
      pgBadge('M',168,196,12)+pgBadge('M',450,214,12)+`<path d="M200 200C280 150 360 160 432 210" stroke="#fff" stroke-width="3" stroke-dasharray="8 7" fill="none"/><path d="M300 152l22 22m0-22l-22 22" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>`+
      pgTxt(316,128,'5,000 km of salty ocean','#fff',14)+pgTxt(320,32,'Mesosaurus: a 1-meter freshwater reptile','#fff',15)+
      `<g transform="translate(250 262)"><path d="M0 0q30-14 70-6 24 5 46-4-14 14-44 16-20 1-40-2-18 8-32-4z" fill="#17a2a2"/><circle cx="62" cy="-5" r="2.2" fill="#fff"/><path d="M14 2l-6 9M44 6l-4 9" stroke="#0f6f6f" stroke-width="3"/></g>`;
  }else if(k==='ages'){
    t+=`<rect width="${W}" height="${H}" fill="#cfe6f7"/><rect y="70" width="${W}" height="90" fill="url(#pgbwat)"/><rect y="200" width="${W}" height="100" fill="url(#pgbman)"/>`;
    const cols=['#ffd23f','#ffb347','#ff8a3d','#e36a4a','#b4566d','#7d4e8a','#4c4f8f'];
    for(let i=0;i<7;i++){const w=44;t+=`<rect x="${320+i*w}" y="160" width="${w}" height="40" fill="${cols[i]}"/><rect x="${320-(i+1)*w}" y="160" width="${w}" height="40" fill="${cols[i]}"/>`;}
    t+=`<path d="M250 160Q300 150 314 128H326Q340 150 390 160Z" fill="#53647f"/><path d="M320 200V132" stroke="#ff6a1e" stroke-width="6"/>`+pgArrow(250,110,-1,'#fff')+pgArrow(390,110,1,'#fff');
    [['A',360],['B',470],['C',590]].forEach(([n,x])=>{t+=`<path d="M${x} 158V98" stroke="#1b2433" stroke-width="2.5"/><path d="M${x} 98h22l-6 7 6 7h-22" fill="#fff" stroke="#1b2433" stroke-width="2"/>${pgTxt(x+10,110,n,'#1b2433',12)}<circle cx="${x}" cy="168" r="6" fill="#fff" stroke="#1b2433" stroke-width="2.5"/>`;});
    t+=pgTxt(320,40,'Sea floor next to a mid-ocean ridge','#1b2433',16)+pgTxt(320,228,'Ridge','#fff',12);
  }else if(k==='atlantic'){
    const pc=(k2,x,y,a,sc)=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})"><path d="${PG_SHAPE[k2].d}" fill="${PGC[k2][1]}" stroke="${PGC[k2][3]}" stroke-width="${(1.5/sc).toFixed(1)}"/></g>`;
    t+=`<rect width="${W}" height="${H}" fill="#1d6db5"/>`+pc('na',150,80,0,.11)+pc('sa',230,222,0,.11)+pc('eu',560,40,0,.11)+pc('af',450,196,0,.11);
    t+=`<path d="M300 20l14 22-10 18 16 22-12 22 18 24-14 26 16 24-10 24 14 26-12 24 8 28" stroke="#ff6a3c" stroke-width="5" fill="none" stroke-linejoin="round"/>`+pgArrow(268,150,-1,'#fff')+pgArrow(352,150,1,'#fff')+pgTxt(320,290,'Mid-Atlantic Ridge','#fff',13);
  }else if(k==='ring'){
    t+=`<rect width="${W}" height="${H}" fill="#1d6db5"/><ellipse cx="320" cy="150" rx="210" ry="118" fill="#2a7fca" stroke="#9fd2ff" stroke-width="1.5" stroke-dasharray="4 6"/>`;
    for(let i=0;i<34;i++){const an=i/34*Math.PI*2,x=320+Math.cos(an)*210,y=150+Math.sin(an)*118;if(an>1.2&&an<1.95)continue;t+=`<path d="M${x-6} ${y+5}L${x} ${y-6}L${x+6} ${y+5}Z" fill="#ff5a3c" stroke="#7a1a0a" stroke-width="1"/>`;}
    const pc=(k2,x,y,a,sc)=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})"><path d="${PG_SHAPE[k2].d}" fill="${PGC[k2][1]}" stroke="${PGC[k2][3]}" stroke-width="${(1.5/sc).toFixed(1)}"/></g>`;
    t+=pc('eu',-40,40,0,.12)+pc('au',90,250,0,.12)+pc('na',640,60,0,.12)+pc('sa',650,230,0,.12);
      pgTxt(320,154,'Pacific Ocean','#fff',15)+pgTxt(320,24,'Volcanoes around the Pacific: the Ring of Fire','#fff',14)+pgTxt(60,110,'Asia','#3a2a10',12)+pgTxt(90,262,'Australia','#3a2a10',12)+pgTxt(590,120,'Americas','#3a2a10',12);
  }else t+=`<rect width="${W}" height="${H}" fill="#f2f5fb"/>`;
  return ngSvg(W,H,t,'ngsvg pgsvg pgbd','Picture of the evidence for this question');
}

/* ---------------- the game ---------------- */
ngDef({key:'pangaea',name:'Pangaea Rebuild',ic:'puzzle',std:'MS-ESS2-3',subj:'earth',cap3:true,
  short:'Rebuild Pangaea from fossil and rock evidence.',menuDesc:'Drag and turn real continents until the fossils, glacier scratches and rocks line up, then push plates together and apart.',
  intro:'The continents were once joined in a supercontinent called Pangaea. Drag and turn the real continents until the evidence lines up across every border: fossils, glacier scratches and matching rocks. Then push plates together and apart to see what forms.',
  how:['**Drag a continent** onto a glowing spot (or tap it, then tap the spot).','Each border shows evidence found on **both** sides. A continent must have all of it.','**Turn it** with ⟲ ⟳ (or Q / E) until it snaps in. No wrong fits = 3 ★.','Plate levels: **predict** first, then drag the plates and watch.'],
  levels:PG_LEVELS,packs:PG_PACKS,
  mini:L=>{if(L.type!=='fit')return svgEl('<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="#ff9d3c"/><rect width="44" height="13" rx="4" fill="#8fd0ff"/><rect y="10" width="20" height="9" fill="#c9a46a"/><rect x="24" y="12" width="20" height="6" fill="#3d4c66"/><path d="M14 5h-6M30 5h6" stroke="#1b2433" stroke-width="2"/></svg>');
    const F=pgFrame(L),sc=44/F.W;return svgEl(`<svg viewBox="0 0 ${F.W} ${F.H}" width="48" height="32" aria-hidden="true"><rect width="${F.W}" height="${F.H}" rx="40" fill="#1d6db5"/>${Object.values(L.sock).map(k=>{const [x,y,a]=PG_POSE[k],[cx,cy]=pgPx(F,x,y);return `<g transform="translate(${cx} ${cy}) rotate(${a}) scale(${F.s})"><path d="${PG_SHAPE[k].d}" fill="${PGC[k][1]}"/></g>`;}).join('')}</svg>`);void sc;},
  start(G){const L=G.L;G.st={place:{},rot:{},sel:null,msg:null,ok:false,busy:false,fresh:null,r:0,pred:null,p:0,ran:false,wrong:[],okNow:false};
    if(L.type==='fit'){if(L.anchor){const k=L.sock[L.anchor];G.st.place[L.anchor]={k,rot:PG_POSE[k][2],st:'snap',anchor:true};}pgDragInit();}},
  hud(G){return G.L.type==='fit'?{label:'Wrong fits',val:G.miss,target:'3 ★ = no wrong fits'}:{label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st;
    if(L.type==='fit')return pgFitRender(G,main,side);
    const R=L.rounds[S.r],T=ngT();
    const prog=h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
    if(!R){ngRC(main,h('div',{class:'pgwrap bd'},pgMcArt({art:''})));ngRC(side,prog);return;}
    if(R.t==='bd'){
      ngRC(main,h('div',{class:'pgwrap bd'},pgBdBoard(G)),h('div',{class:'fgkey'},S.ran?'This is what formed at the boundary.':S.pred?'Drag the yellow handle the way the arrows point (or press Play). Keyboard: arrow keys.':'First make a prediction. Then you push the plates.'));
      const fn=v=>PG_FEAT.find(f=>f[0]===v)[1];
      ngRC(side,prog,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Predict',h('small',null,'what will form here?')),
        h('div',{class:'ppmc pgfeat'},...PG_FEAT.map(([v,tx])=>h('button',{type:'button',class:'ngc wide'+(S.pred===v?' on':'')+(S.ran&&v===R.ans?' ok':'')+(S.ran&&S.pred===v&&v!==R.ans?' no':''),disabled:G.done||!!S.pred,'aria-pressed':S.pred===v?'true':'false',onclick:()=>pgPredict(v)},tx))),
        T?null:h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Push the plates',h('small',null,S.pred?(S.ran?'done':'drag the handle'):'predict first')),
        T||S.ran||!S.pred?null:ngBtn([I('play'),' Play it'],()=>S.play&&S.play(),'ghost',{style:'width:100%'}),
        S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
        S.okNow&&S.r<L.rounds.length?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',pgNextRound,'good',{style:'width:100%;margin-top:6px'}):null);
      if(!S.msg)ngSay(S.pred?`You predicted **${fn(S.pred)}**. Now push the plates and see!`:'Read the arrows and the kinds of crust. Then predict what will form.');
      return;
    }
    ngRC(main,h('div',{class:'pgwrap bd'},pgMcArt(R)),h('div',{class:'fgkey'},'Think like Alfred Wegener: what could explain this clue?'));
    ngRC(side,prog,h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,tx])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>pgAnswer(v)},tx))),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      S.okNow&&S.r<L.rounds.length?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',pgNextRound,'good',{style:'width:100%;margin-top:6px'}):null);
    if(!S.msg)ngSay('Use the evidence to explain.');
  },
  onHint(G){if(G.L.type!=='fit')return;},
  hints(G){const L=G.L;if(L.type==='fit'){const inMap=Object.values(L.sock),out=L.tiles.filter(t=>!inMap.includes(t.id)).map(t=>PGC[t.id][0]);
      return [L.clue,'Read each border badge. A continent can only touch a border if it has that evidence too. The spot with the most borders is usually the easiest to fill first.',
        'Answer: '+Object.keys(L.sock).filter(s=>s!==L.anchor).map(s=>`${PGC[L.sock[s]][0]} (${PG_DIR[s]})`).join(', ')+'.'+(out.length?` ${out.join(' and ')} stays out.`:'')+' Gold outlines on the map show where each one goes and how it turns.'];}
    const R=L.rounds[G.st.r]||L.rounds[0];return [L.clue,'Apart: new crust forms (ridges and rifts). Together: crust sinks or crumples (trenches, volcanoes, mountains). Sliding: earthquakes along a fault.',
      R.t==='bd'?'Answer: '+PG_FEAT.find(f=>f[0]===R.ans)[1]+'.':'Answer: '+R.opts.find(o=>o[0]===R.ans)[1]];}
});
function pgPredict(v){const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||S.pred||G.done)return;
  if(ngT())return ngTAns(v===R.ans,pgNextRound);
  S.pred=v;S.msg=null;ngRender();setTimeout(()=>{const hd=document.querySelector('.pghandle');if(hd)Art.pulse(hd,'#ffd23f');},50);}
function pgAnswer(v){const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||S.okNow||G.done)return;
  if(ngT())return ngTAns(v===R.ans,pgNextRound);
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'globe',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no','Not quite. '+R.why];fx.pop({icon:'globe',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function pgNextRound(){const S=G.st;S.r++;S.okNow=false;S.wrong=[];S.msg=null;S.pred=null;S.p=0;S.ran=false;
  if(S.r>=G.L.rounds.length){ngRender();G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}ngRender();}
/* grid keys: Q / E turn the selected continent while a card is focused */
document.addEventListener('keydown',e=>{if(!G||G.key!=='pangaea'||G.L.type!=='fit')return;const c=e.target.closest&&e.target.closest('.pgcard');if(!c)return;
  if(['q','Q','['].includes(e.key)){e.preventDefault();G.st.sel=c.dataset.k;pgTurn(-15);}else if(['e','E',']'].includes(e.key)){e.preventDefault();G.st.sel=c.dataset.k;pgTurn(15);}});
NGTHUMB.pangaea=()=>{
  const sc=.088;let t=`<rect width="320" height="180" fill="url(#pgwt)" opacity=".18"/><defs><pattern id="pgwt" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10q10-6 20 0t20 0" stroke="#fff" fill="none"/></pattern></defs>`;
  ['na','eu','gr','sa','af','an','in','au'].forEach(k=>{const [x,y,a]=PG_POSE[k];t+=`<g transform="translate(${160+x*sc} ${96+y*sc}) rotate(${a}) scale(${sc})"><path d="${PG_SHAPE[k].d}" fill="${PGC[k][1]}" stroke="${PGC[k][3]}" stroke-width="${(1.6/sc).toFixed(1)}" stroke-linejoin="round"/></g>`;});
  t+=`<line x1="${160-366*sc}" y1="${96-35*sc}" x2="${160-350*sc}" y2="${96-35*sc}" stroke="#ffd23f" stroke-width="3"/>`+
    `<g><circle cx="${160-372*sc}" cy="${96+30*sc}" r="9" fill="#17a2a2" stroke="#fff" stroke-width="2"/><text x="${160-372*sc}" y="${96+30*sc+3.5}" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" font-family="system-ui,Arial">M</text></g>`+ngStar(296,22,8);
  return ngWrap('pangaea','#1f6fae',t);
};
