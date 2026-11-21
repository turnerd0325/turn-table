/* ================= EARTH 4: WEATHER DESK (MS-ESS2-5, ESS2-6) =================
   "You're on air." A TV forecast desk over a real map of New York and the Great Lakes.
   Front levels: read the station chips (temperature, wind, humidity, pressure), drag fronts,
   air masses and H / L into place, then drag a forecast icon onto every city and press
   Play tomorrow: the fronts sweep across, clouds build, rain, storms or snow fall where they
   should, temperatures change, and each icon is checked. Later levels animate the cause
   (air-mass factory, sea breeze, lake-effect bands, ocean currents) and end with a TV
   forecast sentence builder.
   Contract kept: key 'weather', 9 levels in the same order, mistakes-based stars
   (0 = 3 stars, up to 2 = 2 stars), 3-step hints, Pre/Post-Test levels 2, 5, 8 score the same
   city forecasts (fraction of fields right; rain and storms both count as "wet") and the
   same lake-effect question, with no map step and no animation. */

/* ---------------- map projection + geography ---------------- */
const WX={W:760,H:480,MH:440};
const wxNY=(lo,la)=>[(lo+80.3)*80,(45.3-la)*92];
const wxNA=(lo,la)=>[(lo+130)*5.43,(72-la)*7.2];
const wxF=v=>String(Math.round(v*10)/10);
/* smooth closed (or open) path through lon/lat points */
function wxSm(pts,pr,closed){const P=pts.map(p=>pr(p[0],p[1])),n=P.length,f=wxF;
  if(closed===false){let d=`M${f(P[0][0])} ${f(P[0][1])}`;for(let i=1;i<n-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];d+=`Q${f(P[i][0])} ${f(P[i][1])} ${f(m[0])} ${f(m[1])}`;}return d+`L${f(P[n-1][0])} ${f(P[n-1][1])}`;}
  const mid=i=>{const a=P[i%n],b=P[(i+1)%n];return [(a[0]+b[0])/2,(a[1]+b[1])/2];};
  let m=mid(n-1),d=`M${f(m[0])} ${f(m[1])}`;for(let i=0;i<n;i++){m=mid(i);d+=`Q${f(P[i][0])} ${f(P[i][1])} ${f(m[0])} ${f(m[1])}`;}return d+'Z';}
const WD_GEO={
  ny:[[-79.76,42.0],[-79.76,42.27],[-79.45,42.42],[-79.2,42.55],[-79.05,42.68],[-78.92,42.8],[-78.9,42.89],[-78.95,43.0],[-79.02,43.12],[-79.06,43.26],[-78.7,43.35],[-78.2,43.37],[-77.85,43.32],[-77.6,43.26],[-77.3,43.28],[-77.0,43.28],[-76.7,43.35],[-76.51,43.46],[-76.25,43.53],[-76.2,43.68],[-76.2,43.85],[-76.3,43.98],[-76.33,44.1],[-76.1,44.25],[-75.8,44.42],[-75.5,44.7],[-75.2,44.86],[-74.9,45.0],[-74.3,45.0],[-73.35,45.0],[-73.38,44.6],[-73.36,44.2],[-73.36,43.8],[-73.4,43.58],[-73.27,43.3],[-73.25,42.75],[-73.5,42.05],[-73.49,41.5],[-73.53,41.1],[-73.66,41.0],[-73.8,40.86],[-73.97,40.74],[-74.02,40.7],[-73.92,41.0],[-74.3,41.15],[-74.69,41.36],[-74.98,41.48],[-75.07,41.8],[-75.36,42.0]],
  li:[[-74.03,40.6],[-73.75,40.58],[-73.4,40.6],[-73.0,40.66],[-72.5,40.8],[-72.1,40.92],[-71.86,41.06],[-72.15,41.05],[-72.35,41.12],[-72.6,41.0],[-73.1,40.94],[-73.5,40.9],[-73.78,40.8],[-73.95,40.68]],
  ocean:[[-74.3,39.6],[-74.02,40.48],[-74.1,40.6],[-74.05,40.66],[-73.95,40.76],[-73.8,40.84],[-73.66,40.99],[-73.4,41.08],[-73.1,41.15],[-72.9,41.25],[-72.5,41.27],[-72.1,41.3],[-71.85,41.33],[-71.5,41.38],[-71.4,41.55],[-71.2,41.48],[-70.95,41.55],[-70.75,41.7],[-70.65,41.9],[-70.7,42.1],[-70.85,42.25],[-71.02,42.33],[-70.95,42.45],[-70.85,42.55],[-70.8,42.7],[-70.75,42.9],[-70.6,43.1],[-69.8,43.4],[-69.8,39.6]],
  lakes:[
    [[-81,41.8],[-80.3,42.03],[-80.08,42.15],[-79.76,42.27],[-79.45,42.42],[-79.2,42.55],[-79.05,42.68],[-78.92,42.8],[-78.88,42.88],[-79.0,42.89],[-79.25,42.87],[-79.6,42.84],[-79.9,42.8],[-80.1,42.66],[-80.0,42.57],[-80.25,42.58],[-80.5,42.6],[-81,42.7]],
    [[-79.06,43.26],[-79.3,43.2],[-79.6,43.2],[-79.8,43.28],[-79.72,43.4],[-79.55,43.55],[-79.38,43.63],[-79.1,43.76],[-78.85,43.87],[-78.4,43.93],[-77.95,43.98],[-77.55,43.98],[-77.25,43.9],[-77.05,43.86],[-76.85,43.97],[-76.6,44.1],[-76.4,44.18],[-76.3,44.08],[-76.22,43.92],[-76.2,43.7],[-76.25,43.53],[-76.51,43.46],[-76.7,43.35],[-77.0,43.28],[-77.3,43.28],[-77.6,43.26],[-77.85,43.32],[-78.2,43.37],[-78.7,43.35]],
    [[-73.42,43.6],[-73.4,44.0],[-73.37,44.4],[-73.35,44.8],[-73.37,45.15],[-73.29,45.15],[-73.26,44.8],[-73.24,44.4],[-73.3,44.0],[-73.38,43.6]],
    [[-81,44.3],[-80.3,44.5],[-80.05,44.65],[-79.9,44.9],[-80.0,45.2],[-80.2,45.6],[-81,45.6]]],
  rivers:[[5,[[-76.33,44.12],[-76.0,44.3],[-75.7,44.5],[-75.45,44.72],[-75.15,44.88],[-74.85,45.02],[-74.4,45.25],[-74.0,45.45]]],
    [2.4,[[-73.95,40.75],[-73.92,41.0],[-73.95,41.4],[-73.97,41.8],[-73.9,42.2],[-73.78,42.45],[-73.7,42.75]]],
    [1.8,[[-73.7,42.78],[-74.0,42.82],[-74.4,42.92],[-74.9,43.0],[-75.25,43.1]]],
    [3,[[-76.9,42.88],[-76.87,42.4]]],[3,[[-76.73,42.95],[-76.52,42.45]]],[2.4,[[-77.27,42.88],[-77.33,42.7]]],[2.4,[[-77.1,42.65],[-77.13,42.42]]],[2.4,[[-76.42,42.95],[-76.38,42.82]]]],
  borders:[[[-72.45,42.73],[-72.4,43.2],[-72.3,43.7],[-72.0,44.3],[-71.5,45.0]],[[-73.25,42.75],[-72.45,42.73],[-71.3,42.7],[-70.9,42.85]],[[-73.5,42.05],[-71.8,42.02],[-71.38,42.02]],
    [[-71.8,42.02],[-71.8,41.33]],[[-71.38,42.02],[-71.12,41.5]],[[-74.69,41.36],[-74.95,41.1],[-75.13,40.8],[-75.1,40.3]],[[-73.35,45.0],[-71.5,45.0]]]
};
const WD_NA={
  land:[[[-136,76],[-136,57],[-130,54.5],[-128,51],[-124.6,48.4],[-124,46],[-124.2,42],[-123.8,39.5],[-122.5,37.5],[-120.6,34.6],[-117.2,32.7],[-114.8,30.5],[-112,27],[-110,23.6],[-105.6,20.2],[-103,18.2],[-97,15.8],[-94,16],[-92,14.5],[-87.5,12.6],[-85.7,10.5],[-83.6,10.5],[-83.4,15],[-88,15.9],[-88.3,18.5],[-87.5,21.5],[-90.3,21.1],[-90.6,19.8],[-92,18.6],[-94.5,18.2],[-96,19.2],[-97.3,21.5],[-97.6,25],[-97.2,27.6],[-95,29.2],[-93.5,29.7],[-91,29.2],[-89.4,29.1],[-89.2,30.3],[-87,30.4],[-85,29.7],[-83.5,29.7],[-82.7,28],[-81.8,26.1],[-81,25.2],[-80.4,25.4],[-80.1,26.8],[-80.6,28.5],[-81.3,30.3],[-81,31.8],[-79.5,33],[-77.9,33.9],[-76.5,34.7],[-75.5,35.3],[-75.9,36.9],[-75.5,37.8],[-75,38.8],[-74,39.8],[-73.9,40.6],[-72,41],[-70.5,41.5],[-70,42],[-70.6,42.8],[-70,43.8],[-68,44.4],[-66.9,44.8],[-65.5,43.6],[-63.5,44.6],[-61,45.4],[-64.5,48.3],[-64,50.2],[-60,50.2],[-57,51.5],[-55.8,52.5],[-56,53.8],[-58,54.6],[-60.5,55.5],[-61.8,57],[-64,59.5],[-65,60.3],[-69.5,61],[-71.5,61.5],[-74,62.3],[-77.5,62.5],[-78.2,60.5],[-77.4,58],[-76.8,56.5],[-79,54.5],[-79.5,52],[-80.5,51.3],[-82.5,52.8],[-82.2,55],[-85,55.3],[-88.5,56.8],[-92.5,57.5],[-94.5,58.8],[-94.2,61],[-92.5,62.5],[-90.5,63.5],[-88,64.2],[-86.8,66.5],[-88,68.5],[-94,68.5],[-98,69],[-104,68],[-108,68.5],[-115,68],[-121,69.5],[-128,70],[-136,70.5]],
    [[-62,66.5],[-64.5,63.5],[-68,62.4],[-72,63.8],[-78,64.5],[-74,67],[-80,70],[-78,73],[-72,76],[-62,73],[-65,70]],
    [[-58,76],[-56,72.5],[-53,69.5],[-53.5,66.5],[-50,63],[-46,60.8],[-43,60],[-41,62],[-40,65],[-37,65.6],[-32,68],[-25,69.5],[-22,71],[-20,76]],
    [[-24,65.5],[-22,66.4],[-16,66.5],[-13.5,65],[-18,63.4],[-22.5,63.9]],
    [[-5.7,50.1],[-3.5,50.3],[1.3,51.1],[1.7,52.7],[0.2,53.5],[-0.5,54.5],[-1.6,55.6],[-2.1,57.1],[-1.8,57.6],[-4,57.6],[-3,58.6],[-5,58.6],[-6.2,57.5],[-5.6,56],[-4.8,55],[-3,54.9],[-3.2,54.1],[-3,53.3],[-4.6,53.3],[-4.2,52.3],[-5.3,51.7],[-3.2,51.4]],
    [[-6,52.2],[-6.2,53.4],[-5.5,54.4],[-6.2,55.2],[-8,55.2],[-8.5,54.3],[-10,54.1],[-9.5,53],[-10.3,51.9],[-8.5,51.6]],
    [[14,58],[8.6,57.1],[8.1,55.5],[8.6,54],[7,53.5],[5,53.4],[4,51.8],[1.6,50.9],[-1.4,49.7],[-1.9,48.7],[-4.7,48.5],[-4.2,47.8],[-2,47.3],[-1.2,46],[-1.4,44],[-1.8,43.4],[-8,43.7],[-9.3,43],[-8.8,41.2],[-9.5,38.8],[-8.9,37],[-6.2,36.4],[-5.4,36],[-2,36.7],[0,38.8],[0.9,41],[3.2,42],[3,43.3],[4.8,43.4],[6.5,43.1],[9,44.4],[14,44]],
    [[14,66],[12,65],[8.5,63.5],[5,62],[5.2,60],[5.6,58.5],[7,58],[10,59],[14,59.5]],
    [[14,37.2],[10,37.2],[1,36.5],[-2,35.2],[-6,35.8],[-9.8,31],[-10,29],[-13,27.5],[-16.5,24],[-17,21],[-16.5,16],[-17.5,14.7],[-16,8],[14,8]],
    [[-84.9,21.9],[-82,23.2],[-80,23.1],[-77,21.5],[-74.2,20.2],[-75,19.9],[-77.7,19.9],[-78,20.7],[-80.5,21.8],[-83,22],[-84.5,21.7]],
    [[-74.5,18.3],[-72.8,19.9],[-70,19.7],[-68.4,18.6],[-71.2,17.7]]],
  gulf:[[-81,24.6],[-80,28],[-79,32],[-75,35.5],[-70,38.5],[-60,40.5],[-45,43],[-35,47],[-22,51],[-12,54.5],[-4,59],[6,63]],
  lab:[[-63,62],[-58.5,57],[-54.5,52.5],[-51,47.5],[-54,43.5]],
  canary:[[-12,46],[-14,39],[-17,31],[-20,23],[-24,15]],
  calif:[[-128.5,50],[-126.5,44],[-123.8,37.5],[-119.5,31],[-115,24]]
};

/* ---------------- cities, fields, cards ---------------- */
/* lab:[dx,dy,anchor]  slot:[dx,dy,align] (c = centered, l = start, r = end)  tc: temp chip centre offset */
const WD_CITY={
  buf:{n:'Buffalo',ll:[-78.88,42.89],lab:[-10,4,'end'],slot:[0,13,'c'],tc:[-32,-20]},
  roc:{n:'Rochester',ll:[-77.61,43.16],lab:[0,-11,'middle'],slot:[0,13,'c'],tc:[42,0]},
  syr:{n:'Syracuse',ll:[-76.15,43.05],lab:[0,-11,'middle'],slot:[0,13,'c'],tc:[42,0]},
  alb:{n:'Albany',ll:[-73.76,42.65],lab:[0,-11,'middle'],slot:[0,13,'c'],tc:[42,0]},
  nyc:{n:'New York City',ll:[-74.0,40.71],lab:[-10,4,'end'],slot:[12,-15,'l'],tc:[-48,-18]},
  tor:{n:'Toronto',ll:[-79.38,43.65],lab:[0,-11,'middle'],slot:[12,-15,'l'],tc:[-34,-26]},
  bos:{n:'Boston',ll:[-71.06,42.36],lab:[8,-11,'end'],slot:[8,13,'r'],tc:[-36,0]}};
const wdXY=id=>wxNY(WD_CITY[id].ll[0],WD_CITY[id].ll[1]);
const WD_F={temp:[['warm','Warmer'],['same','Same'],['cold','Colder']],sky:[['dry','Sunny, dry'],['rain','Rain'],['storm','Storms']],
  humid:[['humid','Muggy'],['dryair','Dry air']],snow:[['snow','Heavy snow'],['none','Little or none']]};
const WD_FL={temp:'Temperature',sky:'Sky',humid:'Air',snow:'Snow'};
const WD_IC={warm:'warm',same:'same',cold:'cold',dry:'sun',rain:'rain',storm:'storm',humid:'muggy',dryair:'crisp',snow:'snow',none:'flurry'};
const WD_CARD={cold:{k:'front',n:'Cold front'},warm:{k:'front',n:'Warm front'},mc:{k:'mass',n:'Cold, dry air',c:'cold'},mw:{k:'mass',n:'Warm, humid air',c:'warm'},H:{k:'hl',n:'High pressure'},L:{k:'hl',n:'Low pressure'}};
const WD_FAC={wh:['Warm and humid','warm'],cd:['Cold and dry','cold'],wd:['Warm and dry','dry'],ch:['Cold and humid','cool']};
const WD_FACC={warm:'#ff8a5c',cold:'#4f95ff',dry:'#f2b134',cool:'#3fc0c0'};
const WD_WIND={n:90,ne:135,e:180,se:-135,s:-90,sw:-45,w:0,nw:45};

/* ---------------- levels ---------------- */
const WR={city:o=>Object.assign({t:'city'},o),mc:(q,opts,ans,why,pic,o)=>Object.assign({t:'mc',q,opts,ans,why,pic},o||{}),
  tv:o=>Object.assign({t:'tv',test:false},o),fac:o=>Object.assign({t:'fac'},o),breeze:o=>Object.assign({t:'breeze'},o)};
const WDL=(name,story,rounds,o)=>Object.assign({name,story,rounds},o);
const WD_LEVELS=[
  WDL('Cold Front','A cold front is moving east across New York State.',[WR.city({
      map:{fronts:[{k:'cold',p:[[200,-10],[178,120],[163,200],[148,300],[128,450]],dx:230,dy:0}],
        masses:[{lab:'Cold, dry air',x:84,y:372,c:'cold'},{lab:'Warm, humid air',x:470,y:335,c:'warm'}],
        st:[[75,305,47,'nw'],[110,92,44,'nw'],[215,292,75,'sw',1],[300,350,77,'sw',1],[455,150,74,'s',1],[640,345,76,'sw',1]]},
      place:{lines:[{id:'a',off:[-105,0]},{id:'b',ans:'cold'},{id:'c',off:[112,0]}],zones:[{id:'zw',x:84,y:372,ans:'mc'},{id:'ze',x:470,y:335,ans:'mw'}],
        why:{cold:'The front sits where the temperature jumps from the 40s to the 70s and the wind turns: between Buffalo and Rochester.',
          warm:'It is not a warm front. Behind the line the air is colder, with northwest winds. Cold air is pushing in, so it is a **cold front**.',
          mc:'The stations in the west read 44–47°F with northwest winds. That is the **cold, dry air**.',
          mw:'The stations in the east read the mid-70s and humid, with southwest winds. That is the **warm, humid air**.'}},
      fields:['temp','sky'],
      cities:[['buf',{temp:'same',sky:'dry'},'The front already passed Buffalo. It stays in the cold, dry air behind the front.',47],
        ['roc',{temp:'cold',sky:'storm'},'The cold front passes Rochester tomorrow: a burst of thunderstorms, then colder air.',75],
        ['syr',{temp:'cold',sky:'storm'},'The front reaches Syracuse tomorrow too: storms as it passes, then colder air.',76],
        ['alb',{temp:'same',sky:'dry'},'The front will not reach Albany until the day after. Albany stays in the warm air for now.',74]]})],
    {intro:'Each station chip shows the **temperature** and an arrow for the **wind**. A **cold front** (blue triangles) is where cold air pushes into warm air. Find it, then forecast.',
     fact:'Cold air is dense and wedges under warm air, pushing it up fast. That quick lifting makes towering clouds, heavy rain or thunderstorms, and then a cool, dry change.',
     clue:'Which cities will the front pass by tomorrow? Which are already behind it, and which are too far ahead?'}),
  WDL('Warm Front','A warm front is moving slowly north.',[WR.city({
      map:{fronts:[{k:'warm',p:[[-30,346],[380,328],[790,304]],dx:0,dy:-110}],
        masses:[{lab:'Cool air',x:330,y:100,c:'cold'},{lab:'Warm, humid air',x:215,y:400,c:'warm'}],
        st:[[590,212,52,'e'],[300,272,54,'e'],[170,128,50,'e'],[430,372,72,'s',1],[82,393,74,'sw',1],[690,408,75,'s',1]]},
      place:{lines:[{id:'a',off:[0,-165]},{id:'b',ans:'warm'},{id:'c',off:[0,72]}],zones:[{id:'zn',x:330,y:100,ans:'mc'},{id:'zs',x:215,y:400,ans:'mw'}],lab:{mc:'Cool air'},
        why:{warm:'The front sits between the cool stations (50s, east wind) and the warm, humid ones (70s, south wind): south of Albany, north of New York City.',
          cold:'It is not a cold front. Here the warm air is the one moving in, sliding north. Red half-circles mark a **warm front**.',
          mc:'North of the front the stations read the low 50s with an east wind. That is the **cool air**.',
          mw:'South of the front the stations read the 70s and humid. That is the **warm, humid air**.'}},
      fields:['temp','sky'],
      cities:[['nyc',{temp:'same',sky:'dry'},'New York City is already south of the front, in the warm air. Not much changes.',74],
        ['alb',{temp:'warm',sky:'rain'},'The warm front passes Albany: steady rain first, then warmer, more humid air.',52],
        ['syr',{temp:'same',sky:'rain'},'The front stops just short of Syracuse, but warm air slides up over the cool air far ahead of the front, so steady rain spreads over Syracuse.',53]]})],
    {intro:'A **warm front** (red half-circles) is warm air sliding up and over cooler air. Find it from the station data. It moves north.',
     fact:'Warm fronts move slowly. Warm air rises gently over cold air, so a wide area of clouds and steady rain often comes well before the front arrives.',
     clue:'Rain from a warm front spreads out AHEAD of it, not just at the front line.'}),
  WDL('Storm System','A low-pressure storm is crossing the state.',[WR.city({
      map:{lows:[[150,150]],fronts:[{k:'warm',p:[[150,150],[420,240],[790,338]],dx:150,dy:0},{k:'cold',p:[[150,150],[132,260],[104,450]],dx:150,dy:0}],
        masses:[{lab:'Warm, humid air',x:430,y:378,c:'warm'},{lab:'Cold air',x:52,y:368,c:'cold'}],
        st:[[58,300,40,'nw'],[300,118,50,'e'],[610,205,52,'e'],[300,360,70,'s',1],[648,405,72,'sw',1]]},
      place:{lines:[{id:'aw',front:0,ans:'warm'},{id:'ac',front:1,ans:'cold'}],zones:[{id:'zw',x:430,y:378,ans:'mw'},{id:'zc',x:52,y:368,ans:'mc'}],lab:{mc:'Cold air'},
        why:{warm:'The arm heading east has cool air (50s, east wind) to its north and warm, humid air to its south. Warm air is moving in, so that arm is the **warm front**.',
          cold:'The arm trailing south has cold air (low 40s, northwest wind) pushing in behind it. That arm is the **cold front**.',
          mc:'West of the low the station reads 40°F with a northwest wind. That is the **cold air**.',
          mw:'Between the two fronts the stations are in the 70s and humid. That is the **warm, humid air**.'}},
      fields:['temp','sky'],
      cities:[['buf',{temp:'same',sky:'dry'},'Buffalo is behind the cold front, in cold, dry air. It stays that way.',40],
        ['alb',{temp:'warm',sky:'rain'},'The warm front passes Albany: steady rain, then warmer air.',51],
        ['nyc',{temp:'same',sky:'dry'},'New York City is in the warm air between the two fronts, and the cold front does not reach it yet.',72]]}),
    WR.tv({cid:'alb',parts:[['Rain, then warmer','Storms, then colder','Sunny and dry'],['a warm front','a cold front','a high-pressure system'],['is sliding warm, humid air up over cooler air','is pushing cold air down to the ground','is making the air sink and dry out']],ans:[0,0,0],
      why:['Albany gets steady rain as the warm front passes, then warmer air.','The front crossing Albany tomorrow is the warm front.','A warm front slides warm air gently up over cooler air. Rising air cools and makes rain.'],
      ok:'That is a real forecast: what will happen, and why.'})],
    {intro:'A **low (L)** is a storm center. A warm front and a cold front spin out from it. Decide which arm is which, then forecast.',
     fact:'Most big storms in New York are low-pressure systems with a warm front and a cold front. Forecasters watch where the fronts will be to predict each town’s weather.',
     clue:'Handle one front at a time. Which front crosses each city tomorrow, if any?'}),
  WDL('Air Mass Factory','Air takes on the temperature and moisture of the place where it sits.',[WR.fac({
      regions:[{id:'gulf',ll:[-90,25.5],ans:'wh',clue:'Warm water 85°F',why:'Warm water heats the air and adds lots of water vapor, so air over the Gulf of Mexico becomes **warm and humid**.'},
        {id:'canada',ll:[-100,61],ans:'cd',clue:'Snow −30°F',why:'Cold, snowy land chills the air, and there is little water to add moisture, so air over northern Canada becomes **cold and dry**.'},
        {id:'desert',ll:[-112,33],ans:'wd',clue:'Hot sand 110°F',why:'Hot, dry land makes hot, dry air, so air over the desert Southwest becomes **warm and dry**.'},
        {id:'atl',ll:[-42,52],ans:'ch',clue:'Cold water 45°F',why:'Cold water cools the air, and the ocean adds moisture, so air over the North Atlantic becomes **cold and humid**.'}],
      cards:['wh','cd','wd','ch']})],
    {fact:'An air mass is a huge body of air with about the same temperature and humidity throughout. It gets those properties from where it forms.',
     clue:'Over water = humid. Over land = dry. Near the equator = warm. Near the pole = cold.'}),
  WDL('Air Mass Arrives','Two different air masses are on the move.',[
      WR.city({map:{masses:[{lab:'Cold, dry air from Canada',x:200,y:40,c:'cold',rx:200,ry:110,mx:10,my:150}],st:[[255,62,18,'nw'],[430,72,20,'nw'],[652,380,68,'s',1]]},
        place:{zones:[{id:'zn',x:220,y:80,ans:'mc'}],task:'The air arriving from the north reads 18°F and very dry. Drag the air mass it matches onto the map.',
          why:{mw:'Not this one. The border stations read 18°F and very dry. Warm, humid air would read warm and muggy. This is **cold, dry air** from Canada.',mc:''}},
        fields:['temp','humid'],
        cities:[['buf',{temp:'cold',humid:'dryair'},'The cold, dry Canadian air pours into Buffalo.',52],['roc',{temp:'cold',humid:'dryair'},'Rochester also gets the cold, dry air.',54],
          ['nyc',{temp:'same',humid:'humid'},'The cold air does not reach New York City by tomorrow, and the ocean keeps the air there humid.',61]]}),
      WR.city({map:{masses:[{lab:'Warm, humid air from the Gulf',x:470,y:470,c:'warm',rx:200,ry:130,mx:40,my:-150}],st:[[330,425,86,'s',1],[655,420,84,'s',1],[200,110,55,'w']]},
        place:{zones:[{id:'zs',x:430,y:405,ans:'mw'}],task:'The air arriving from the south reads 86°F and muggy. Drag the air mass it matches onto the map.',
          why:{mc:'Not this one. The southern stations read 84–86°F and humid. That is **warm, humid air** from the Gulf of Mexico.',mw:''}},
        fields:['temp','humid'],
        cities:[['nyc',{temp:'warm',humid:'humid'},'Warm, muggy Gulf air surges into New York City.',66],['alb',{temp:'warm',humid:'humid'},'The warm, humid air reaches Albany too.',60],
          ['buf',{temp:'same',humid:'dryair'},'The warm air does not reach Buffalo. It stays in the drier air.',55]]})],
    {fact:'When a new air mass moves in, the weather changes to match it: Canadian air brings cold, crisp days, and Gulf air brings hot, muggy days.',
     clue:'A city only changes if the air mass actually reaches it.'}),
  WDL('Highs and Lows','A high and a low are on the weather map.',[
      WR.city({map:{highs:[[165,300]],lows:[[650,375]],st:[[90,350,null,null,0,1030],[245,345,null,null,0,1031],[300,290,null,null,0,1022],[390,168,null,null,0,1015],[505,88,null,null,0,1013],[575,330,null,null,0,1001],[716,328,null,null,0,998],[604,420,null,null,0,997]]},
        place:{spots:[{id:'s1',x:165,y:300,ans:'H'},{id:'s2',x:650,y:375,ans:'L'},{id:'s3',x:430,y:120}],task:'Each chip shows the air pressure in millibars (mb). Drag the **H** and the **L** to where they belong.',
          why:{H:'High pressure is where the readings are highest: 1030–1031 mb, in western New York. Put the **H** there.',L:'Low pressure is where the readings are lowest: 997–1001 mb, near the coast by New York City. Put the **L** there.'}},
        fields:['sky'],
        cities:[['buf',{sky:'dry'},'Buffalo is under the high. Sinking air means clear, dry weather.'],['roc',{sky:'dry'},'Rochester is also under the high: dry and sunny.'],
          ['nyc',{sky:['rain','storm']},'New York City is near the low. Rising air makes clouds and rain.'],['bos',{sky:['rain','storm']},'Boston is near the low too: cloudy and rainy.']]}),
      WR.tv({cid:'nyc',parts:[['Rain','Sunny and dry','Heavy snow'],['a low-pressure system','a high-pressure system','a sea breeze'],['makes air rise, cool and form clouds','makes air sink and warm up','stops the wind completely']],ans:[0,0,0],
        why:['New York City is near the low, so tomorrow brings clouds and rain.','The pressure is lowest near New York City: that is the low.','In a low, air flows in and rises. Rising air cools, and its water vapor condenses into clouds and rain.'],
        ok:'Lows mean rising air, clouds and rain. Highs mean sinking air and clear skies.'})],
    {fact:'High pressure (H) usually means fair, dry weather. Low pressure (L) usually means clouds, rain or snow.',
     clue:'H = air sinking = clear. L = air rising = clouds.'}),
  WDL('Beach Breeze','A hot summer day at a beach on Long Island.',[
      WR.breeze({night:false,ans:'sea',why:'Land heats up faster than water. Warm air over the land rises, and cooler air from the ocean flows in to take its place: a **sea breeze**.'}),
      WR.mc('Why does the land heat up faster than the ocean?',[['water','Water needs much more energy to warm up than land does.'],['dark','The ocean is darker, so it reflects heat.'],['sun','The Sun only shines on land.']],'water','Water can absorb lots of energy with only a small temperature change. Sand and rock warm up much more quickly.','day'),
      WR.breeze({night:true,ans:'land',why:'At night the land cools faster than the water. Now the air over the warmer ocean rises, and air flows from the land out to sea: a **land breeze**.'})],
    {fact:'Sea breezes are a small version of what happens all over Earth: uneven heating of land and water makes air move.',
     clue:'Air rises where it is warmest. Cooler air flows in to take its place.'}),
  WDL('Lake-Effect Snow','A freezing wind from the northwest blows across the Great Lakes in December.',[
      WR.city({map:{lake:1,chips:[[96,332,'Lake Erie water 40°F'],[252,126,'Lake Ontario water 42°F'],[566,80,'Air 18°F · wind from the northwest']]},fields:['snow'],snow:{buf:24,syr:18,tor:0,alb:1},
        cities:[['buf',{snow:'snow'},'Buffalo is downwind of Lake Erie. The cold wind picks up heat and moisture from the lake and dumps it as snow.'],
          ['syr',{snow:'snow'},'Syracuse is downwind (southeast) of Lake Ontario, so it gets lake-effect snow too.'],
          ['tor',{snow:'none'},'Toronto is on the upwind side. The air has not crossed the lake yet, so it is still dry.'],
          ['alb',{snow:'none'},'Albany is far from the lakes. By the time the air gets there, most of the snow has fallen.']]}),
      WR.mc('Why does lake-effect snow happen?',[['warm','Cold air crosses warmer lake water, picks up heat and moisture, then rises and snows.'],['ice','The lake freezes and the ice blows onto land.'],['cold','The lake makes the air colder, and cold air always snows.']],'warm','The lake water is warmer than the air. It adds heat and water vapor to the air, which rises, cools and drops heavy snow downwind.',null,{play:false}),
      WR.tv({cid:'buf',parts:[['Heavy snow','Sunny and dry','Warm rain'],['freezing air crossing the warmer lake','a warm front','ice blowing off the lake'],['picks up heat and moisture, then rises and snows','pushes all the clouds away','makes the air sink and dry out']],ans:[0,0,0],
        why:['Buffalo is downwind of Lake Erie, so it gets heavy snow.','The lake water (40°F) is warmer than the air (18°F). The cold air crossing it is the cause.','The lake adds heat and water vapor. The air rises, cools and drops heavy snow downwind.'],
        ok:'Lake-effect snow: cold air, warmer water, snow downwind.'})],
    {fact:'Parts of New York, like the Tug Hill area east of Lake Ontario, get over 300 inches of snow in a winter because of lake-effect snow.',
     clue:'Snow falls DOWNWIND of the lake, after the air has crossed the water.'}),
  WDL('Ocean Heaters','Oceans move heat around the planet.',[
      WR.tv({board:'gulf',city:'London',parts:[['Mild winters','Frozen winters','Snowy summers'],['a warm ocean current','the city lights','more sunlight'],['carries heat from the tropics','blocks the cold wind','reflects the sunlight']],ans:[0,0,0],
        why:['London is about as far north as Labrador, but its winters are mild (45°F vs 5°F).','The Gulf Stream, a warm ocean current, flows from near the equator to western Europe.','The Gulf Stream carries warm water from the tropics across the Atlantic, warming the air in western Europe.'],
        ok:'London is as far north as Labrador, but the Gulf Stream keeps it mild.'}),
      WR.mc('Which city has a SMALLER difference between summer and winter temperatures?',[['coast','A city on the ocean coast'],['inland','A city far inland'],['same','They are always the same']],'coast','Water warms up and cools down slowly, so the ocean keeps nearby coastal cities milder all year.','coast'),
      WR.mc('How do ocean currents affect climate around the world?',[['carry','They carry warm water toward the poles and cold water toward the equator.'],['stop','They stop heat from moving.'],['salt','They only move salt around.']],'carry','Currents act like a global conveyor belt, moving heat from warm places to cold places and shaping each region’s climate.','currents')],
    {fact:'The Gulf Stream moves more water than all the rivers in the world combined.',
     clue:'Water holds heat for a long time, and moving water carries that heat with it.'})
];
const WD_PACKS={0:'Pack 1: Fronts',3:'Pack 2: Air masses and pressure',6:'Pack 3: Land, lakes and oceans'};

/* ---------------- small helpers ---------------- */
const wdR=G=>G.st.rounds[G.st.r];
const wdSky=a=>Array.isArray(a)?a[0]:a;
const wdWet=v=>v==='rain'||v==='storm';
const wdT1=(t0,a)=>a==='warm'?t0+16:a==='cold'?t0-20:t0+1;
const wdCN=(R,c)=>(R.place&&R.place.lab&&R.place.lab[c])||WD_CARD[c].n;
const wdShuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function wdOk(f,a,v){if(v==null)return false;if(Array.isArray(a))return a.includes(v);if(a===v)return true;return ngT()&&f==='sky'&&wdWet(a)&&wdWet(v);}
function wdClose(f,a,v){if(f!=='sky'||Array.isArray(a)||!wdWet(a)||!wdWet(v)||a===v)return '';
  return a==='storm'?' Close: it does get wet. But a cold front shoves warm air up fast, which builds **thunderstorms**.':' Close: it does get wet. But a warm front lifts air gently, so it brings **steady rain**, not thunderstorms.';}
function wdReal(ans){return ans.snow?WD_IC[ans.snow]:ans.sky?WD_IC[wdSky(ans.sky)]:ans.humid?WD_IC[ans.humid]:null;}
const wdTempCol=t=>t>=65?'#d6452f':t>=50?'#c47a10':'#2f6bd8';

/* ---------------- art: clouds, icons, fronts, stations ---------------- */
function wdCloud(x,y,s,dk,extra){const c1=dk===2?'#e3e9f3':dk?'#8a93a8':'#ffffff',c2=dk===2?'#a9b7cc':dk?'#5b6479':'#d9e2ef',hl=dk===2?'#ffffff':dk?'#aab2c4':'#ffffff';
  return `<g transform="translate(${wxF(x)} ${wxF(y)}) scale(${s})"${extra||''}><ellipse cx="0" cy="11" rx="27" ry="5.5" fill="#0b1530" opacity=".16"/><rect x="-23" y="-1" width="46" height="11" rx="5.5" fill="${c2}"/><circle cx="-13" cy="0" r="9.5" fill="${c1}"/><circle cx="-1" cy="-6" r="13" fill="${c1}"/><circle cx="13" cy="-1" r="9.5" fill="${c1}"/><rect x="-22" y="-2" width="44" height="9" rx="4.5" fill="${c1}"/><ellipse cx="-5" cy="-12" rx="6.5" ry="3.4" fill="${hl}" opacity=".75"/></g>`;}
function wdFlake(x,y,r,c){return `<g transform="translate(${wxF(x)} ${wxF(y)})" stroke="${c}" stroke-width="${r>6?2.6:1.9}" stroke-linecap="round">${[0,60,120].map(a=>`<path d="M0 ${-r}V${r}" transform="rotate(${a})"/>`).join('')}</g>`;}
function wdTherm(col,arrow){return `<g transform="translate(-6 0)"><rect x="-4.5" y="-15" width="9" height="22" rx="4.5" fill="#fff" stroke="#4a5568" stroke-width="2"/><circle cy="9" r="6.5" fill="${col}" stroke="#4a5568" stroke-width="2"/><rect x="-1.8" y="-7" width="3.6" height="14" fill="${col}"/></g>${arrow}`;}
/* forecast icons in a 40 x 40 box centred on 0,0 */
function wdIco(k){
  if(k==='sun')return [0,45,90,135,180,225,270,315].map(a=>`<path d="M0 -12.5V-17.5" transform="rotate(${a})" stroke="#f5a300" stroke-width="3.2" stroke-linecap="round"/>`).join('')+`<circle r="10" fill="#ffc928" stroke="#f08c00" stroke-width="2"/><circle cx="-3.2" cy="-3.2" r="3.4" fill="#fff" opacity=".55"/>`;
  if(k==='rain')return wdCloud(0,-5,.62,2)+[-8,0,8].map(x=>`<path d="M${x} 9q-2.8 4.2 0 6.6q2.8-2.4 0-6.6z" fill="#2f8be8"/>`).join('');
  if(k==='storm')return wdCloud(0,-6,.62,1)+`<path d="M1 0l-7 9.5h5.5l-3.5 8.5 9.5-11.5h-5.5l3-6.5z" fill="#ffd23f" stroke="#b07d00" stroke-width="1"/>`+[-11,11].map(x=>`<path d="M${x} 9q-2.4 3.6 0 5.6q2.4-2 0-5.6z" fill="#2f8be8"/>`).join('');
  if(k==='snow')return wdCloud(0,-6,.62,2)+[[-9,11],[0,14],[9,11]].map(([x,y])=>wdFlake(x,y,3.6,'#3f95e8')).join('');
  if(k==='flurry')return wdFlake(0,0,11,'#9aa6ba')+`<path d="M-12 12L12 -12" stroke="#e2483f" stroke-width="3.6" stroke-linecap="round"/>`;
  if(k==='warm')return wdTherm('#e8433a',`<path d="M10 4V-12M5 -7l5-5 5 5" stroke="#e8433a" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  if(k==='cold')return wdTherm('#2f7be8',`<path d="M10 -12V4M5 -1l5 5 5-5" stroke="#2f7be8" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  if(k==='same')return wdTherm('#8a94a6',`<path d="M5 -6h10M5 0h10" stroke="#6b7486" stroke-width="3.2" stroke-linecap="round"/>`);
  if(k==='muggy')return `<path d="M-5 -15C-12 -4 -15 1 -15 6a10 10 0 0 0 20 0c0-5-3-10-10-21z" fill="#3a8ee8"/><ellipse cx="-9" cy="3" rx="2.5" ry="4" fill="#fff" opacity=".55"/><path d="M6 -8q3-3 6 0t6 0M6 0q3-3 6 0t6 0M6 8q3-3 6 0t6 0" stroke="#f08a3e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if(k==='crisp')return `<path d="M-15 -7h17a5 5 0 1 0-5-5M-15 1h23a5 5 0 1 1-5 5M-15 9h11" stroke="#3aa0e0" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  return '';}
const wdIcoSvg=(k,w)=>svgEl(`<svg viewBox="-20 -20 40 40" width="${w||30}" height="${w||30}" aria-hidden="true">${wdIco(k)}</svg>`);
const wdD=pts=>'M'+pts.map(p=>wxF(p[0])+' '+wxF(p[1])).join('L');
function wdFront(pts,k,mv,thin){const col=k==='cold'?'#2563eb':'#dc3b3b',ml=Math.hypot(mv[0],mv[1])||1,ux=mv[0]/ml,uy=mv[1]/ml,d=wdD(pts);
  let sym='';
  for(let i=0;i<pts.length-1;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1],len=Math.hypot(x1-x0,y1-y0);if(len<1)continue;
    const n=Math.max(1,Math.floor(len/40)),tx=(x1-x0)/len,ty=(y1-y0)/len;let nx=-ty,ny=tx;if(nx*ux+ny*uy<0){nx=-nx;ny=-ny;}
    for(let j=0;j<n;j++){const u=(j+.5)/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u;
      if(k==='cold')sym+=`M${wxF(x-tx*9)} ${wxF(y-ty*9)}L${wxF(x+nx*14)} ${wxF(y+ny*14)}L${wxF(x+tx*9)} ${wxF(y+ty*9)}Z`;
      else sym+=`M${wxF(x-tx*9)} ${wxF(y-ty*9)}A9 9 0 0 ${nx*ty-ny*tx>0?1:0} ${wxF(x+tx*9)} ${wxF(y+ty*9)}Z`;}}
  return `<path d="${d}" fill="none" stroke="#fff" stroke-width="${thin?7:9}" stroke-linejoin="round" stroke-linecap="round" opacity=".6"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${thin?4:5}" stroke-linejoin="round" stroke-linecap="round"/><path d="${sym}" fill="${col}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>`;}
function wdSt(s){const [x,y,t,w,hu,p]=s;let o=`<g class="wdst" transform="translate(${x} ${y})">`;
  if(t!=null){const wd=hu?66:56;
    o+=`<rect x="-27" y="-9" width="${wd}" height="22" rx="11" fill="#0b1530" opacity=".18"/><rect x="-28" y="-11" width="${wd}" height="22" rx="11" fill="#fff"/><g transform="translate(-17 0) rotate(${WD_WIND[w]||0})"><circle r="8.5" fill="#e6ecf7"/><path d="M-6 0H4M0.5 -4.5l4.5 4.5-4.5 4.5" stroke="#13203d" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><text x="10" y="4.8" text-anchor="middle" font-size="13.5" font-weight="900" fill="${wdTempCol(t)}">${t}°</text>`
      +(hu?`<path d="M31 -6.5c-3.2 4.2-4.6 6.2-4.6 8.2a4.6 4.6 0 0 0 9.2 0c0-2-1.4-4-4.6-8.2z" fill="#3a8ee8"/>`:'');}
  else o+=`<rect x="-31" y="-9" width="62" height="22" rx="11" fill="#0b1530" opacity=".18"/><rect x="-32" y="-11" width="64" height="22" rx="11" fill="#fff"/><text y="4.6" text-anchor="middle" font-size="12.5" font-weight="900" fill="${p>=1020?'#2f6bd8':p<=1005?'#d6452f':'#4a5568'}">${p} mb</text>`;
  return o+'</g>';}
function wdChip(x,y,txt,col){const w=txt.length*6.6+22;return `<g transform="translate(${x} ${y})"><rect x="${-w/2+1}" y="-9" width="${w}" height="22" rx="11" fill="#0b1530" opacity=".2"/><rect x="${-w/2}" y="-11" width="${w}" height="22" rx="11" fill="${col||'#13203d'}" opacity=".9"/><text y="4.3" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">${ngEsc(txt)}</text></g>`;}
function wdPill(x,y,lab,cold){const w=lab.length*6.7+38;
  return `<g transform="translate(${wxF(x)} ${wxF(y)})"><rect x="${-w/2+1}" y="-10" width="${w}" height="24" rx="12" fill="#0b1530" opacity=".2"/><rect x="${-w/2}" y="-12" width="${w}" height="24" rx="12" fill="${cold?'#1f4fb8':'#c2412a'}" opacity=".93"/>`
    +(cold?wdFlake(-w/2+14,0,6,'#cfe3ff'):`<circle cx="${-w/2+14}" cy="0" r="5.5" fill="#ffd23f"/>`)+`<text x="${-w/2+26}" y="4.4" font-size="12" font-weight="800" fill="#fff">${ngEsc(lab)}</text></g>`;}
function wdMass(m,ox,oy,o){o=o||{};const x=m.x+ox,y=m.y+oy,rx=m.rx||92,ry=m.ry||46,cold=m.c==='cold';
  if(o.ghost)return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="8 6" opacity=".8"/>`;
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${cold?'wdMc':'wdMw'})"/>${wdPill(x,y,m.lab,cold)}`;}
function wdHL(x,y,k){const c=k==='H'?'#2563eb':'#dc3b3b';return `<g transform="translate(${x} ${y})"><circle r="25" fill="#0b1530" opacity=".18" cy="2"/><circle r="24" fill="#fff"/><circle r="24" fill="none" stroke="${c}" stroke-width="3.2"/><text y="12.5" text-anchor="middle" font-size="35" font-weight="900" fill="${c}">${k}</text></g>`;}
/* circulation arrows round a high (out, clockwise) or low (in, counter-clockwise) */
function wdCirc(x,y,k){const out=k==='H';let t='';
  for(let i=0;i<4;i++){const a0=i*Math.PI/2+.3,a1=a0+(out?1:-1)*.95,r0=out?32:62,r1=out?60:34;
    const p0=[x+Math.cos(a0)*r0,y+Math.sin(a0)*r0*.8],p1=[x+Math.cos(a1)*r1,y+Math.sin(a1)*r1*.8],c=[x+Math.cos((a0+a1)/2)*(r0+r1)/1.75,y+Math.sin((a0+a1)/2)*(r0+r1)/1.75*.8];
    t+=`<path d="M${wxF(p0[0])} ${wxF(p0[1])}Q${wxF(c[0])} ${wxF(c[1])} ${wxF(p1[0])} ${wxF(p1[1])}" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" class="wdflow" marker-end="url(#wdAr)" opacity=".9"/>`;}
  return t;}

/* ---------------- shared defs + broadcast frame ---------------- */
function wdDefs(){return `<defs>
<linearGradient id="wdLand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6d9ab"/><stop offset="1" stop-color="#b0c890"/></linearGradient>
<linearGradient id="wdNYg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f2d2"/><stop offset="1" stop-color="#d1e4b0"/></linearGradient>
<linearGradient id="wdSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f8fd8"/><stop offset="1" stop-color="#2160aa"/></linearGradient>
<linearGradient id="wdLake" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#62b1ec"/><stop offset="1" stop-color="#3a84cc"/></linearGradient>
<radialGradient id="wdMtn"><stop offset="0" stop-color="#6f8f4c" stop-opacity=".5"/><stop offset="1" stop-color="#6f8f4c" stop-opacity="0"/></radialGradient>
<radialGradient id="wdMc"><stop offset="0" stop-color="#3f86ff" stop-opacity=".52"/><stop offset=".7" stop-color="#3f86ff" stop-opacity=".3"/><stop offset="1" stop-color="#3f86ff" stop-opacity="0"/></radialGradient>
<radialGradient id="wdMw"><stop offset="0" stop-color="#ff6a3c" stop-opacity=".5"/><stop offset=".7" stop-color="#ff6a3c" stop-opacity=".28"/><stop offset="1" stop-color="#ff6a3c" stop-opacity="0"/></radialGradient>
<radialGradient id="wdSunG"><stop offset="0" stop-color="#ffe066" stop-opacity=".8"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
<radialGradient id="wdSpot"><stop offset=".55" stop-color="#ffd23f" stop-opacity="0"/><stop offset=".8" stop-color="#ffd23f" stop-opacity=".55"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
<linearGradient id="wdBar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#101b38"/><stop offset="1" stop-color="#1d3264"/></linearGradient>
<pattern id="wdWv" width="26" height="14" patternUnits="userSpaceOnUse"><path d="M0 9q6.5-5 13 0t13 0" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.4"/></pattern>
<clipPath id="wdClip"><rect width="760" height="440"/></clipPath>
<marker id="wdAr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0L10 5 0 10z" fill="#fff"/></marker>
<marker id="wdArW" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto"><path d="M0 0L10 5 0 10z" fill="#fff"/></marker>
</defs>`;}
function wdSentence(R,sel,city){const p=i=>sel[i]!=null?R.parts[i][sel[i]]:'_____';return `${city}: ${p(0)} because ${p(1)} ${p(2)}.`;}
function wdTvCity(R){return R.city||WD_CITY[R.cid].n;}
function wdTicker(G,R){const S=G.st,L=G.L;
  if(R.t==='city'){if(S.ph==='played'){const n=R.cities.length*R.fields.length;return ['TOMORROW',`Your forecast: ${n-(S.wrongN||0)} of ${n} right`];}
    return [S.ph==='place'?'THE MAP':'FORECAST',L.story];}
  if(R.t==='tv')return ['ON AIR',wdSentence(R,S.tv,wdTvCity(R))];
  if(R.t==='fac')return ['FACTORY',L.story];
  if(R.t==='breeze')return ['BEACH CAM',R.night?'Night falls over the beach. The land cools fast.':'A hot, sunny afternoon at a Long Island beach.'];
  return ['QUESTION',L.story];}
function wdFrame(G,R,right){const [tag,txt]=wdTicker(G,R),air=R.t==='tv',long=txt.length>72;
  return `<g class="wdframe" pointer-events="none"><rect width="760" height="30" fill="#0b1430"/>
<g transform="translate(14 15)"><rect x="0" y="-8.5" width="22" height="15" rx="3" fill="none" stroke="#ffd23f" stroke-width="2"/><path d="M6 6.5l-3 4.5M16 6.5l3 4.5" stroke="#ffd23f" stroke-width="2" stroke-linecap="round"/><path d="M5.5 -1.5q5.5-4.5 11 0" stroke="#7fd3ff" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>
<text x="44" y="20" font-size="13" font-weight="900" fill="#fff" letter-spacing="2">WEATHER DESK</text>
<g class="wdair${air?' on':''}" transform="translate(172 15)"><rect x="0" y="-9" width="72" height="18" rx="9" fill="#e2483f"/><circle cx="11.5" cy="0" r="3.6" fill="#fff" class="wdrec"/><text x="20" y="4.2" font-size="10.5" font-weight="900" fill="#fff" letter-spacing="1">ON AIR</text></g>
<text x="746" y="19.5" text-anchor="end" font-size="11" font-weight="800" fill="#cfd8ff" letter-spacing="1.5">${right}</text></g>
<g class="wdlower" pointer-events="none"><rect y="440" width="760" height="40" fill="url(#wdBar)"/><rect y="440" width="760" height="3" fill="#ffd23f"/><rect x="0" y="443" width="128" height="37" fill="#ffd23f"/>
<text x="64" y="466.5" text-anchor="middle" font-size="13" font-weight="900" fill="#13203d" letter-spacing="1.5">${tag}</text>
<text x="142" y="466" font-size="14.5" font-weight="800" fill="#fff" class="wdtick"${long?' textLength="604" lengthAdjust="spacingAndGlyphs"':''}>${ngEsc(txt)}</text></g>`;}

/* ---------------- New York base map (built once) ---------------- */
let WD_NYB=null;
function wdNYBase(){if(WD_NYB)return WD_NYB;const P=wxNY,S=(a,c)=>wxSm(a,P,c),g=WD_GEO,xy=(lo,la)=>P(lo,la).map(wxF);
  let t=`<rect width="760" height="440" fill="url(#wdLand)"/>`;
  t+=`<path d="${S(g.ocean)}" fill="url(#wdSea)"/><path d="${S(g.ocean)}" fill="url(#wdWv)"/>`;
  t+=`<path d="${S(g.ny)}" fill="url(#wdNYg)" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`;
  [[-74.2,44.05,88,62],[-74.4,42.15,40,20],[-75.65,43.72,24,16],[-77.6,42.2,70,22]].forEach(([lo,la,rx,ry])=>{const [x,y]=xy(lo,la);t+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#wdMtn)"/>`;});
  [[-74.6,44.25],[-74.1,44.15],[-73.85,43.95],[-74.4,43.85],[-74.0,44.4],[-74.5,42.2],[-74.2,42.12]].forEach(([lo,la])=>{const [x,y]=xy(lo,la);t+=`<path d="M${x-7} ${+y+3}L${x} ${y-6}L${+x+7} ${+y+3}" fill="none" stroke="#6a8748" stroke-width="1.6" stroke-linejoin="round" opacity=".55"/>`;});
  g.borders.forEach(b=>{t+=`<path d="${S(b,false)}" fill="none" stroke="#6f8160" stroke-width="1.3" stroke-dasharray="5 4" opacity=".6"/>`;});
  t+=`<path d="${S(g.li)}" fill="url(#wdNYg)" stroke="#fff" stroke-width="2"/>`;
  g.lakes.forEach(l=>{const d=S(l);t+=`<path d="${d}" fill="url(#wdLake)" stroke="#eaf6ff" stroke-width="1.6" stroke-opacity=".85"/><path d="${d}" fill="url(#wdWv)"/>`;});
  g.rivers.forEach(([w,pts])=>{t+=`<path d="${S(pts,false)}" fill="none" stroke="#4f9fe0" stroke-width="${w}" stroke-linecap="round"/>`;});
  [[-79.4,44.4,16,11],[-75.85,43.21,13,4]].forEach(([lo,la,rx,ry])=>{const [x,y]=xy(lo,la);t+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#wdLake)" stroke="#eaf6ff" stroke-width="1.2"/>`;});
  const lab=(lo,la,s,txt,o)=>{const [x,y]=xy(lo,la);return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${s}" font-weight="800" ${o}>${txt}</text>`;};
  const reg='fill="#5d6f4c" letter-spacing="2.5" opacity=".7"',wat='fill="#e8f5ff" font-style="italic" letter-spacing="1" opacity=".9"';
  t+=lab(-78.4,44.55,11,'ONTARIO',reg)+lab(-77.4,41.62,11,'PENNSYLVANIA',reg)+lab(-72.75,44.05,10,'VERMONT',reg)+lab(-72.15,42.45,10,'MASS.',reg)+lab(-72.75,41.62,10,'CONN.',reg)+lab(-74.62,40.92,9,'N.J.',reg)
    +lab(-75.05,42.42,12,'NEW YORK','fill="#4f6440" letter-spacing="4" opacity=".55"')
    +lab(-79.55,42.47,11,'Lake Erie',wat)+lab(-77.9,43.66,11,'Lake Ontario',wat)+lab(-71.6,40.86,11,'Atlantic Ocean',wat)
    +lab(-74.15,44.42,9.5,'Adirondacks','fill="#55703c" font-style="italic" opacity=".75"');
  WD_NYB=t;return t;}

/* ---------------- the New York board ---------------- */
function wdTargets(R){const P=R.place||{},M=R.map||{},out=[];
  (P.lines||[]).forEach(l=>{const f=M.fronts[l.front||0],o=l.off||[0,0];out.push({id:l.id,k:'front',ans:l.ans,pts:f.p.map(([x,y])=>[x+o[0],y+o[1]]),f});});
  (P.zones||[]).forEach(z=>out.push({id:z.id,k:'mass',ans:z.ans,x:z.x,y:z.y}));
  (P.spots||[]).forEach(s=>out.push({id:s.id,k:'hl',ans:s.ans,x:s.x,y:s.y}));
  return out;}
function wdTargetsSvg(G,R){const S=G.st,hint=G.hint>=3&&!ngT();
  return wdTargets(R).map(t=>{const c=S.pl[t.id],lk=S.lockT[t.id];let o='';
    if(t.k==='front'){const d=wdD(t.pts),mid=t.pts[Math.floor(t.pts.length/2)];
      o=`<path d="${d}" fill="none" stroke="transparent" stroke-width="34" stroke-linecap="round"/>`;
      o+=c?wdFront(t.pts,c,[t.f.dx||0,t.f.dy||0]):`<path d="${d}" fill="none" stroke="#13203d" stroke-width="5.5" stroke-dasharray="10 8" stroke-linecap="round" opacity=".28"/><path d="${d}" class="wddash" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="10 8" stroke-linecap="round"/>`
        +`<g transform="translate(${wxF(mid[0])} ${wxF(mid[1])})"><circle r="11" fill="#13203d" opacity=".85"/><text y="4.6" text-anchor="middle" font-size="13" font-weight="900" fill="#ffd23f">?</text></g>`;
      if(hint&&t.ans&&!lk)o+=`<path d="${d}" fill="none" stroke="#ffd23f" stroke-width="16" stroke-linecap="round" opacity=".45" class="wdhint"/>`;}
    else if(t.k==='mass'){o=`<ellipse cx="${t.x}" cy="${t.y}" rx="78" ry="40" fill="transparent"/>`;
      o+=c?wdMass({x:t.x,y:t.y,lab:wdCN(R,c),c:WD_CARD[c].c},0,0):`<ellipse cx="${t.x}" cy="${t.y}" rx="72" ry="36" fill="#fff" fill-opacity=".18" stroke="#fff" stroke-width="2.6" stroke-dasharray="8 6" class="wddash"/><text x="${t.x}" y="${t.y+4.5}" text-anchor="middle" font-size="12.5" font-weight="900" fill="#13203d" stroke="#fff" stroke-width="3" paint-order="stroke">Air mass?</text>`;
      if(hint&&t.ans&&!lk)o+=`<ellipse cx="${t.x}" cy="${t.y}" rx="82" ry="45" fill="none" stroke="#ffd23f" stroke-width="5" class="wdhint"/>`;}
    else{o=`<circle cx="${t.x}" cy="${t.y}" r="30" fill="transparent"/>`;
      o+=c?wdHL(t.x,t.y,c):`<circle cx="${t.x}" cy="${t.y}" r="25" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="2.6" stroke-dasharray="7 5" class="wddash"/><text x="${t.x}" y="${t.y+5}" text-anchor="middle" font-size="15" font-weight="900" fill="#13203d" stroke="#fff" stroke-width="3" paint-order="stroke">?</text>`;
      if(hint&&t.ans&&!lk)o+=`<circle cx="${t.x}" cy="${t.y}" r="33" fill="none" stroke="#ffd23f" stroke-width="5" class="wdhint"/>`;}
    return `<g class="${lk?'wdlk':'wdtgt'} wdpop" data-k="${t.k}" data-id="${t.id}" aria-label="${t.k==='front'?'A spot for a front':t.k==='mass'?'A spot for an air mass':'A spot for H or L'}">${o}</g>`;}).join('');}
/* clouds along a front, on its leading side */
function wdFrontClouds(f){let o='';const mv=[f.dx||0,f.dy||0],ml=Math.hypot(mv[0],mv[1])||1,ux=mv[0]/ml,uy=mv[1]/ml,cold=f.k==='cold';
  for(let i=0;i<f.p.length-1;i++){const [x0,y0]=f.p[i],[x1,y1]=f.p[i+1],len=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.round(len/(cold?56:70)));
    for(let j=0;j<n;j++){const u=(j+.5)/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u;
      if(cold)o+=wdCloud(x+ux*22,y+uy*22-8,.74,1);else if(j%2===0||n===1)o+=wdCloud(x+ux*58,y+uy*58-4,.58,2);}}
  if(!cold){const a=f.p.map(([x,y])=>[x+ux*12,y+uy*12]),b=f.p.map(([x,y])=>[x+ux*125,y+uy*125]).reverse(),c=f.p.map(([x,y])=>[x+ux*70,y+uy*70]).reverse();
    o=`<path d="${wdD(a.concat(b))}Z" fill="#eef3fa" opacity=".34"/><path d="${wdD(a.concat(c))}Z" fill="#e3eaf5" opacity=".38"/>`+o;}
  return o;}
function wdSlotXY(id,n,j){const c=WD_CITY[id],[x,y]=wdXY(id),[ax,dy,al]=c.slot,w=n*30+(n-1)*4,x0=al==='c'?x+ax-w/2:al==='l'?x+ax:x+ax-w;return [x0+j*34,y+dy];}
function wdNYBoard(G,R,mode){
  const S=G.st,M=R.map||{},played=mode==='played'||mode==='tv'||mode==='plain-played',anim=mode==='anim',pre=mode==='place';
  let t=`<g clip-path="url(#wdClip)">`+wdNYBase();
  /* air masses */
  if(!pre)(M.masses||[]).forEach(m=>{const mx=m.mx||0,my=m.my||0;
    if(mode==='cast'&&(mx||my))t+=wdMass(m,mx,my,{ghost:1})+`<path d="M${m.x+mx*.2} ${m.y+my*.2+(my<0?-10:10)}L${m.x+mx*.75} ${m.y+my*.75}" stroke="#fff" stroke-width="4" stroke-dasharray="8 6" marker-end="url(#wdArW)" opacity=".9"/>`+wdChip(m.x+mx,m.y+my-m.ry+18,my<0?'Tomorrow ↑':'Tomorrow ↓','#13203d');
    t+=`<g class="wdmv" data-dx="${mx}" data-dy="${my}">${wdMass(m,played?mx:0,played?my:0)}</g>`;});
  /* lake effect */
  if(M.lake){
    if(!played)t+=[[6,250],[18,92],[150,84],[290,78],[430,96]].map(([x,y])=>`<path d="M${x} ${y}l${wxF(Math.cos(.38)*66)} ${wxF(Math.sin(.38)*66)}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".75" class="wdflow" marker-end="url(#wdArW)"/>`).join('');
    const band=[...Array(7)].map((_,i)=>wdCloud(22+i*20,276-i*9.5,.5,0)).join('')+[...Array(10)].map((_,i)=>wdCloud(118+i*27,160+i*(i<6?1.5:6),.52,0)).join('');
    if(played||anim)t+=`<g class="wdband"${anim?' opacity="0"':''}>${played?`<ellipse cx="128" cy="240" rx="40" ry="16" fill="#fff" opacity=".7"/><ellipse cx="346" cy="196" rx="42" ry="22" fill="#fff" opacity=".7"/>`:''}${band}</g>`;
    if(!played)(M.chips||[]).forEach(([x,y,s])=>{t+=wdChip(x,y,s,'#13203d');});}
  /* stations */
  if(!played)(M.st||[]).forEach(s=>{t+=wdSt(s);});
  /* fronts, H and L */
  if(pre){if(!(R.place.spots||[]).length){(M.lows||[]).forEach(([x,y])=>{t+=wdHL(x,y,'L');});(M.highs||[]).forEach(([x,y])=>{t+=wdHL(x,y,'H');});}t+=wdTargetsSvg(G,R);}
  else{
    (M.fronts||[]).forEach(f=>{const dx=f.dx||0,dy=f.dy||0,end=f.p.map(([x,y])=>[x+dx,y+dy]);
      if(mode==='cast'){t+=`<path d="${wdD(end)}" fill="none" stroke="#fff" stroke-width="3.2" stroke-dasharray="9 7" opacity=".85" stroke-linecap="round"/>`;
        const a=f.p[Math.floor(f.p.length/2)-(f.p.length>3?0:0)],b=[a[0]+dx,a[1]+dy];
        t+=`<path d="M${wxF(a[0]+dx*.18)} ${wxF(a[1]+dy*.18)}L${wxF(b[0]-dx*.12)} ${wxF(b[1]-dy*.12)}" stroke="#fff" stroke-width="4" stroke-dasharray="8 6" marker-end="url(#wdArW)" opacity=".9"/>`+(dx?wdChip(Math.min(700,f.p[0][0]+dx+8),56,'Tomorrow →','#13203d'):wdChip(690,end[end.length-1][1]-34+(dy<0?0:40),dy<0?'Tomorrow ↑':'Tomorrow ↓','#13203d'));}
      if(played)t+=`<g opacity=".22">${wdFront(f.p,f.k,[dx,dy],1)}</g>`;
      t+=`<g class="wdmv" data-dx="${dx}" data-dy="${dy}"${played?` transform="translate(${dx} ${dy})"`:''}>${played||anim?`<g class="wdfcl"${anim?' opacity="0"':''}>${wdFrontClouds(f)}</g>`:''}${wdFront(f.p,f.k,[dx,dy])}</g>`;});
    const fdx=M.fronts&&M.fronts[0]?M.fronts[0].dx||0:0;
    (M.highs||[]).forEach(([x,y])=>{if(played||anim)t+=`<g class="wdcirc"${anim?' opacity="0"':''}>${wdCirc(x,y,'H')}</g>`;t+=wdHL(x,y,'H');});
    (M.lows||[]).forEach(([x,y])=>{const lc=!M.fronts&&(played||anim)?`<g class="wdlcl"${anim?' opacity="0"':''}>${wdCloud(x-40,y-8,.7,1)}${wdCloud(x+34,y-14,.65,1)}${wdCloud(x-6,y-40,.75,1)}</g><g class="wdcirc"${anim?' opacity="0"':''}>${wdCirc(x,y,'L')}</g>`:'';
      t+=lc+`<g class="wdmv" data-dx="${fdx}" data-dy="0"${played&&fdx?` transform="translate(${fdx} 0)"`:''}>${wdHL(x,y,'L')}</g>`;});}
  t+='</g>';
  /* cities */
  const tvc=mode==='tv'?R.__tv:null;
  if(tvc){const [x,y]=wdXY(tvc);t+=`<circle cx="${x}" cy="${y}" r="62" fill="url(#wdSpot)" class="wdspot"/>`;}
  (R.cities||[]).forEach(([id,ans,why,t0],k)=>{const c=WD_CITY[id],[x,y]=wdXY(id),real=wdReal(ans);
    if(real&&(played||anim)){const op=anim?' opacity="0"':'';
      t+=real==='sun'?`<g class="wdcw" data-i="${k}"${op}><circle cx="${x}" cy="${y}" r="38" fill="url(#wdSunG)"/><g transform="translate(${x} ${y-36}) scale(.85)">${wdIco('sun')}</g></g>`
        :`<g class="wdcw" data-i="${k}"${op} transform="translate(${x} ${y-36}) scale(.95)">${wdIco(real)}</g>`;}
    t+=`<circle cx="${x}" cy="${y}" r="7.5" fill="#fff"/><circle cx="${x}" cy="${y}" r="4.6" fill="#13203d"/>`;
    t+=`<text x="${x+c.lab[0]}" y="${y+c.lab[1]}" text-anchor="${c.lab[2]}" font-size="12.5" font-weight="900" fill="#13203d" stroke="#fff" stroke-width="3.4" paint-order="stroke" stroke-linejoin="round">${ngEsc(c.n)}</text>`;
    const cx=x+c.tc[0],cy=y+c.tc[1];
    if(t0!=null&&!pre){const t1=wdT1(t0,ans.temp),txt=played?`${t0}°→${t1}°`:`${t0}°`,col=wdTempCol(played?t1:t0),w=played?62:36;
      t+=`<g class="wdtc" data-i="${k}" transform="translate(${wxF(cx)} ${wxF(cy)})"><rect x="${-w/2}" y="-10" width="${w}" height="20" rx="10" fill="#fff" stroke="${col}" stroke-width="2" class="wdtcr"/><text y="4.4" text-anchor="middle" font-size="12" font-weight="900" fill="${col}" class="wdtt">${txt}</text></g>`;}
    if(R.snow&&(played||anim)){const v=R.snow[id]||0;t+=`<g transform="translate(${wxF(cx)} ${wxF(cy)})"><rect x="-27" y="-10" width="54" height="20" rx="10" fill="#fff" stroke="#3f95e8" stroke-width="2"/>${wdFlake(-15,0,5,'#3f95e8')}<text x="5" y="4.4" text-anchor="middle" font-size="12" font-weight="900" fill="#1f5fb8" class="wdsn" data-i="${k}">${played?v:0} in</text></g>`;}
    /* forecast slots */
    if(!pre&&mode!=='tv'&&mode!=='plain'&&mode!=='plain-played'){const a=S.ans[k]||{};
      R.fields.forEach((f,j)=>{const [sx,sy]=wdSlotXY(id,R.fields.length,j),v=a[f],res=S.res&&S.res[k]&&mode==='played'?S.res[k][f]:null;
        t+=`<g class="wdtgt wdslot wdpop${v?' on':''}${res===true?' ok':res===false?' no':''}" data-k="slot" data-i="${k}" data-f="${f}" transform="translate(${wxF(sx)} ${wxF(sy)})" aria-label="${ngEsc(c.n)}: ${WD_FL[f]}${v?' — '+WD_F[f].find(o=>o[0]===v)[1]:''}">`
          +`<rect x="1" y="2" width="30" height="30" rx="9" fill="#0b1530" opacity=".18"/><rect width="30" height="30" rx="9" fill="#fff" fill-opacity="${v?.96:.82}" stroke="${res===true?'#1f9d55':res===false?'#e2483f':v?'#2f6bff':'#2f6bff'}" stroke-width="${res!=null?3:2}" ${v?'':'stroke-dasharray="5 4" class="wddash"'}/>`
          +(v?`<g transform="translate(15 15) scale(.66)">${wdIco(WD_IC[v])}</g>`:`<text x="15" y="20" text-anchor="middle" font-size="14" font-weight="900" fill="#2f6bff" opacity=".7">?</text>`)
          +(res!=null?`<g transform="translate(29 1)"><circle r="7.5" fill="${res?'#1f9d55':'#e2483f'}" stroke="#fff" stroke-width="1.6"/><text y="3.6" text-anchor="middle" font-size="9.5" font-weight="900" fill="#fff">${res?'✓':'✗'}</text></g>`:'')+`</g>`;});}});
  t+=`<g class="wdfx" pointer-events="none"></g><rect class="wdflash" width="760" height="440" fill="#fff" opacity="0" pointer-events="none"/>`;
  return t;}

/* ---------------- North America / Atlantic board ---------------- */
let WD_NAB=null;
function wdNABase(){if(WD_NAB)return WD_NAB;let t=`<rect width="760" height="440" fill="url(#wdSea)"/><rect width="760" height="440" fill="url(#wdWv)"/>`;
  for(let lo=-120;lo<=10;lo+=20){const x=wxNA(lo,0)[0];t+=`<path d="M${wxF(x)} 0V440" stroke="#fff" stroke-opacity=".08"/>`;}
  for(let la=20;la<=70;la+=10){const y=wxNA(0,la)[1];t+=`<path d="M0 ${wxF(y)}H760" stroke="#fff" stroke-opacity=".08"/>`;}
  WD_NA.land.forEach(p=>{t+=`<path d="${wxSm(p,wxNA)}" fill="url(#wdNYg)" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`;});
  const lab=(lo,la,s,txt,o)=>{const [x,y]=wxNA(lo,la);return `<text x="${wxF(x)}" y="${wxF(y)}" text-anchor="middle" font-size="${s}" font-weight="800" ${o}>${txt}</text>`;};
  t+=lab(-104,47,13,'NORTH AMERICA','fill="#5d6f4c" letter-spacing="3" opacity=".7"')+lab(-48,32,13,'ATLANTIC OCEAN','fill="#e8f5ff" font-style="italic" letter-spacing="2" opacity=".85"')
    +lab(4,46.5,10,'EUROPE','fill="#5d6f4c" letter-spacing="2" opacity=".7"')+lab(1,23,10,'AFRICA','fill="#5d6f4c" letter-spacing="2" opacity=".7"')+lab(-122,22,11,'PACIFIC','fill="#e8f5ff" font-style="italic" letter-spacing="2" opacity=".85"');
  WD_NAB=t;return t;}
function wdCur(pts,warm,id){const d=wxSm(pts,wxNA,false),c=warm?'#ff6a3c':'#7cc4ff',P=pts.map(p=>wxNA(p[0],p[1])),a=P[P.length-2],b=P[P.length-1],an=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
  return `<g class="wdcur"${id?` data-c="${id}"`:''}><path d="${d}" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" opacity=".3"/><path d="${d}" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="12 10" class="wdflow"/><path d="M0 -8L13 0L0 8z" fill="${c}" transform="translate(${wxF(b[0])} ${wxF(b[1])}) rotate(${wxF(an)})"/></g>`;}
function wdMarker(lo,la,txt,sub,col,right){const [x,y]=wxNA(lo,la),w=Math.max(txt.length,sub?sub.length:0)*6.8+20,dx=right?14:-14-w;
  return `<g transform="translate(${wxF(x)} ${wxF(y)})"><circle r="7" fill="#fff"/><circle r="4.3" fill="#13203d"/><g transform="translate(${dx} ${sub?-20:-11})"><rect x="1" y="2" width="${w}" height="${sub?40:22}" rx="9" fill="#0b1530" opacity=".2"/><rect width="${w}" height="${sub?40:22}" rx="9" fill="#fff"/><text x="10" y="15" font-size="12.5" font-weight="900" fill="#13203d">${ngEsc(txt)}</text>${sub?`<text x="10" y="32" font-size="12" font-weight="900" fill="${col}">${ngEsc(sub)}</text>`:''}</g></g>`;}
function wdNABoard(G,R){const S=G.st;let t=`<g clip-path="url(#wdClip)">`+wdNABase();
  if(R.t==='fac'){const all=R.regions.every(r=>S.fac[r.id]),ny=wxNA(-74.5,42.8),hint=G.hint>=3&&!ngT();
    if(all)R.regions.forEach(r=>{const [x,y]=wxNA(r.ll[0],r.ll[1]);t+=`<path d="M${wxF(x+(ny[0]-x)*.18)} ${wxF(y+(ny[1]-y)*.18)}L${wxF(ny[0]-(ny[0]-x)*.12)} ${wxF(ny[1]-(ny[1]-y)*.12)}" stroke="${WD_FACC[WD_FAC[r.ans][1]]}" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 8" class="wdflow" marker-end="url(#wdArW)"/>`;});
    R.regions.forEach(r=>{const [x,y]=wxNA(r.ll[0],r.ll[1]),v=S.fac[r.id],up=r.id==='atl',RX=r.id==='gulf'?44:58,RY=r.id==='gulf'?25:30;
      let o=`<ellipse cx="${wxF(x)}" cy="${wxF(y)}" rx="${RX+8}" ry="${RY+6}" fill="transparent"/>`;
      if(v){const [n,k]=WD_FAC[v],col=WD_FACC[k];o+=`<ellipse cx="${wxF(x)}" cy="${wxF(y)}" rx="${RX+4}" ry="${RY+3}" fill="${col}" opacity=".42"/><ellipse cx="${wxF(x)}" cy="${wxF(y)}" rx="${RX+4}" ry="${RY+3}" fill="none" stroke="#fff" stroke-width="2.4"/>`+wdChip(x,y,n,col==='#f2b134'?'#b07a10':col==='#3fc0c0'?'#178a8a':col==='#4f95ff'?'#1f4fb8':'#c2412a');}
      else o+=`<ellipse cx="${wxF(x)}" cy="${wxF(y)}" rx="${RX}" ry="${RY}" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-width="2.6" stroke-dasharray="8 6" class="wddash"/><text x="${wxF(x)}" y="${wxF(y+4.5)}" text-anchor="middle" font-size="12.5" font-weight="900" fill="#13203d" stroke="#fff" stroke-width="3" paint-order="stroke">Air mass?</text>`
        +(hint?`<ellipse cx="${wxF(x)}" cy="${wxF(y)}" rx="${RX+8}" ry="${RY+7}" fill="none" stroke="#ffd23f" stroke-width="5" class="wdhint"/><text x="${wxF(x)}" y="${wxF(y-42)}" text-anchor="middle" font-size="11.5" font-weight="900" fill="#ffd23f" stroke="#13203d" stroke-width="3" paint-order="stroke">${WD_FAC[r.ans][0]}</text>`:'');
      t+=`<g class="${v?'wdlk':'wdtgt'} wdpop" data-k="reg" data-id="${r.id}" aria-label="Where air sits: ${ngEsc(r.clue)}">${o}</g>`;
      t+=wdChip(x,y+(up?-48:RY+18),r.clue,'#13203d');});
    t+=wdMarker(-74.5,42.8,'New York','','#13203d',true);}
  else if(R.board==='gulf'||R.pic==='currents'){
    t+=wdCur(WD_NA.gulf,1,'g');if(R.pic==='currents')t+=wdCur(WD_NA.canary,0)+wdCur(WD_NA.calif,0);t+=wdCur(WD_NA.lab,0);
    if(R.board==='gulf'){const y=wxNA(0,52.6)[1];t+=`<path d="M300 ${wxF(y)}H748" stroke="#fff" stroke-width="2" stroke-dasharray="6 6" opacity=".8"/><text x="590" y="${wxF(y+16)}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" opacity=".9">Same distance north of the equator</text>`;
      t+=wdMarker(-60.4,53.3,'Labrador','January 5°F','#2f6bd8',false)+wdMarker(-0.12,51.5,'London','January 45°F','#d6452f',false);
      if(R.t==='tv'){const [x,y2]=wxNA(-0.12,51.5);t+=`<circle cx="${wxF(x)}" cy="${wxF(y2)}" r="54" fill="url(#wdSpot)" class="wdspot"/>`;}}
    t+=wdChip(wxNA(-62,37)[0],wxNA(-62,37)[1],'Gulf Stream (warm)','#c2412a')+wdChip(wxNA(-52,58)[0],wxNA(-52,58)[1],'Labrador Current (cold)','#1f4fb8');}
  else if(R.pic==='coast'){t+=wdMarker(-122.4,37.8,'Coastal city','','#13203d',true)+wdMarker(-94.6,39.1,'Inland city','','#13203d',true);
    if(S.okNow){const X0=470,Y0=246,W=272,H=172,yv=v=>Y0+H-24-(v-30)/(95-30)*(H-76),xv=i=>X0+30+i*(W-44)/11,
      sf=[57,60,62,63,64,67,67,68,70,69,63,57],kc=[40,46,57,67,76,85,90,88,80,68,54,42],line=(a,c)=>`<polyline points="${a.map((v,i)=>wxF(xv(i))+','+wxF(yv(v))).join(' ')}" fill="none" stroke="${c}" stroke-width="3.4" stroke-linejoin="round" class="ngdraw"/>`;
      t+=`<g><rect x="${X0+2}" y="${Y0+3}" width="${W}" height="${H}" rx="12" fill="#0b1530" opacity=".25"/><rect x="${X0}" y="${Y0}" width="${W}" height="${H}" rx="12" fill="#fff"/><text x="${X0+14}" y="${Y0+20}" font-size="12" font-weight="900" fill="#13203d">Daytime highs through the year (°F)</text>`
        +[40,60,80].map(v=>`<path d="M${X0+30} ${wxF(yv(v))}H${X0+W-12}" stroke="#e3e9f5"/><text x="${X0+25}" y="${wxF(yv(v)+4)}" text-anchor="end" font-size="10" fill="#6b7a99">${v}</text>`).join('')
        +line(kc,'#e2483f')+line(sf,'#2f6bff')+`<circle cx="${X0+18}" cy="${Y0+36}" r="4.5" fill="#e2483f"/><text x="${X0+27}" y="${Y0+40}" font-size="11.5" font-weight="900" fill="#e2483f">Inland 40°–90°</text><circle cx="${X0+138}" cy="${Y0+36}" r="4.5" fill="#2f6bff"/><text x="${X0+147}" y="${Y0+40}" font-size="11.5" font-weight="900" fill="#2f6bff">Coast 57°–70°</text>`
        +`<text x="${X0+30}" y="${Y0+H-9}" font-size="10" fill="#6b7a99">Jan</text><text x="${X0+W-12}" y="${Y0+H-9}" text-anchor="end" font-size="10" fill="#6b7a99">Dec</text></g>`;}}
  t+='</g><g class="wdfx" pointer-events="none"></g>';return t;}

/* ---------------- beach board (sea and land breeze) ---------------- */
const WD_BT={day:{land:[72,95],sea:[72,76]},night:{land:[82,60],sea:[76,72]}};
const wdBY=v=>270-(v-50)/50*115;
function wdThermo(x,lab,v,side){const y=wdBY(v);
  return `<g transform="translate(${x} 0)"><rect x="-38" y="114" width="76" height="24" rx="12" fill="#13203d" opacity=".85"/><text y="130.5" text-anchor="middle" font-size="12.5" font-weight="900" fill="#fff"><tspan>${lab} </tspan><tspan class="wdthv" data-s="${side}" fill="#ffd23f">${v}°F</tspan></text>`
    +`<rect x="-10" y="146" width="20" height="140" rx="10" fill="#fff" stroke="#4a5568" stroke-width="2.4"/><rect x="-4.5" y="${wxF(y)}" width="9" height="${wxF(296-y)}" fill="#e8433a" class="wdmerc" data-s="${side}"/><circle cy="298" r="15" fill="#e8433a" stroke="#4a5568" stroke-width="2.4"/><circle cx="-4" cy="293" r="4" fill="#fff" opacity=".5"/>`
    +[60,70,80,90].map(t=>`<path d="M10 ${wxF(wdBY(t))}h6" stroke="#4a5568" stroke-width="1.5"/>`).join('')+`</g>`;}
function wdBeachBoard(G,R,ran){const night=!!R.night,S=G.st,T=WD_BT[night?'night':'day'],dir=night?'land':'sea';
  let t=`<defs><linearGradient id="wdBsky" x1="0" y1="0" x2="0" y2="1">${night?'<stop offset="0" stop-color="#0a1736"/><stop offset="1" stop-color="#2c4580"/>':'<stop offset="0" stop-color="#5fb3f2"/><stop offset="1" stop-color="#d4eeff"/>'}</linearGradient>
<linearGradient id="wdBsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night?'#1d4f86':'#2f8fd8'}"/><stop offset="1" stop-color="${night?'#0c2a52':'#195ca6'}"/></linearGradient>
<linearGradient id="wdBsand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night?'#8f7f5c':'#f3dca2'}"/><stop offset="1" stop-color="${night?'#6b5d40':'#dcbd78'}"/></linearGradient></defs>`;
  t+=`<rect width="760" height="440" fill="url(#wdBsky)"/>`;
  if(night)t+=[...Array(34)].map((_,i)=>`<circle cx="${(i*137+40)%760}" cy="${(i*71+38)%200+30}" r="${i%5===0?1.8:1.1}" fill="#fff" opacity="${.5+(i%3)*.2}"/>`).join('')+`<circle cx="110" cy="80" r="24" fill="#f4efd2"/><circle cx="121" cy="72" r="22" fill="#0e1c40"/>`;
  else t+=`<circle cx="110" cy="80" r="70" fill="url(#wdSunG)"/><circle cx="110" cy="80" r="27" fill="#ffd23f" stroke="#ffb000" stroke-width="3"/>`;
  t+=`<path d="M372 338Q560 328 760 336V440H372Z" fill="url(#wdBsea)"/><path d="M372 338Q560 328 760 336V440H372Z" fill="url(#wdWv)"/>`+[0,1,2].map(i=>`<path d="M${420+i*110} ${358+i*22}q14-6 28 0t28 0" stroke="#fff" stroke-width="2.2" fill="none" opacity=".5" class="wdwave"/>`).join('');
  t+=`<path d="M0 296H290Q332 296 356 310L452 352L452 440H0Z" fill="url(#wdBsand)"/><path d="M0 286H286Q320 286 336 298L0 302Z" fill="${night?'#3f6b3a':'#6fb35a'}"/>`;
  [[104,0],[162,1],[226,0]].forEach(([x,k])=>{t+=`<g transform="translate(${x} 286)"><rect x="0" y="-34" width="46" height="34" fill="${k?'#e9e1d2':'#f4f0e8'}" stroke="#7a6a55" stroke-width="1.5"/><path d="M-5 -34L23 -54L51 -34Z" fill="${k?'#b0533a':'#4f6a8a'}"/><rect x="18" y="-16" width="10" height="16" fill="#7a5a3a"/><rect x="5" y="-27" width="9" height="8" fill="${night?'#ffd77a':'#bfe3ff'}"/><rect x="32" y="-27" width="9" height="8" fill="${night?'#ffd77a':'#bfe3ff'}"/></g>`;});
  t+=`<text x="150" y="420" text-anchor="middle" font-size="16" font-weight="900" fill="#5a4020" letter-spacing="3" opacity=".75">LAND</text><text x="600" y="420" text-anchor="middle" font-size="16" font-weight="900" fill="#fff" letter-spacing="3" opacity=".8">OCEAN</text>`;
  /* heat shimmer over the warmer side */
  const wx=night?600:170;t+=`<g class="wdshim" opacity="${ran?.8:0}">${[0,1,2].map(i=>`<path d="M${wx-40+i*40} 280q-6-10 0-20t0-20" stroke="${night?'#ffb38a':'#ff8a5c'}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
  /* convection loop */
  const loop=night?'M230 322L570 322Q610 322 610 282L610 152Q610 112 570 112L230 112Q190 112 190 152L190 282Q190 322 230 322Z':'M570 322L230 322Q190 322 190 282L190 152Q190 112 230 112L570 112Q610 112 610 152L610 282Q610 322 570 322Z';
  const ch=(x,y,a)=>`<path d="M-7 -7L3 0L-7 7" transform="translate(${x} ${y}) rotate(${a})" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  t+=`<g class="wdloop" opacity="${ran?1:0}"><path d="${loop}" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="10 9" class="wdflow wdlooppath" opacity=".9"/>`
    +(night?ch(400,322,0)+ch(610,217,-90)+ch(400,112,180)+ch(190,217,90):ch(400,322,180)+ch(190,217,-90)+ch(400,112,0)+ch(610,217,90))
    +wdChip(night?610:190,186,'Warm air rises',night?'#c2412a':'#c2412a')+wdChip(night?190:610,246,'Cool air sinks','#1f4fb8')+wdChip(400,348,night?'Land breeze':'Sea breeze','#13203d')+`</g>`;
  t+=wdThermo(60,'LAND',ran?T.land[1]:T.land[0],'land')+wdThermo(706,'SEA',ran?T.sea[1]:T.sea[0],'sea');
  /* beach flag */
  const fl=ran?(dir==='sea'?-1:1):0;
  t+=`<g transform="translate(418 340)"><path d="M0 0V-70" stroke="#5a4a3a" stroke-width="3.5" stroke-linecap="round"/><g class="wdflag" style="transform:scaleX(${fl||1})">${fl?`<path d="M0 -70Q20 -64 40 -68L36 -58L40 -48Q20 -52 0 -46Z" fill="#e2483f"/>`:`<path d="M0 -70Q6 -54 2 -36L-3 -38Q1 -54 -4 -68Z" fill="#e2483f"/>`}</g></g>`;
  /* the wind drop target */
  if(R.t==='breeze'){const v=S.wind;
    t+=`<g class="${S.ran?'wdlk':'wdtgt'} wdpop" data-k="wind" aria-label="A spot for the wind arrow"><rect x="250" y="186" width="300" height="52" rx="26" fill="#fff" fill-opacity="${v?.9:.25}" stroke="${S.ran?(v===R.ans?'#1f9d55':'#e2483f'):'#fff'}" stroke-width="3" ${v?'':'stroke-dasharray="9 7" class="wddash"'}/>`
      +(v?`<path d="${v==='sea'?'M520 218H290M306 204L290 218 306 232':'M280 218H510M494 204L510 218 494 232'}" stroke="#2563eb" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="400" y="205" text-anchor="middle" font-size="12" font-weight="900" fill="#13203d">${v==='sea'?'Ocean → land':'Land → ocean'}</text>`
        :`<text x="400" y="217" text-anchor="middle" font-size="14" font-weight="900" fill="#13203d" stroke="#fff" stroke-width="3.4" paint-order="stroke">Drop the wind arrow here</text>`)+(G.hint>=3&&!S.ran&&!ngT()?`<rect x="244" y="180" width="312" height="64" rx="32" fill="none" stroke="#ffd23f" stroke-width="5" class="wdhint"/>`:'')+`</g>`;}
  t+=`<g class="wdfx" pointer-events="none"></g>`;return t;}

/* ---------------- building the board ---------------- */
function wdBoard(G){const S=G.st,R=wdR(G);let body='',right='FORECAST · TOMORROW',label='Weather map of New York State';
  if(R.t==='fac'||R.board==='gulf'||R.pic==='coast'||R.pic==='currents'){body=wdNABoard(G,R);right=R.t==='fac'?'AIR MASS FACTORY':'OCEANS AND CLIMATE';label='Map of North America and the Atlantic Ocean';}
  else if(R.t==='breeze'||R.pic==='day'||R.pic==='night'){body=wdBeachBoard(G,R.t==='breeze'?R:{night:R.pic==='night',t:'mc'},R.t==='breeze'?!!S.ran:true);right='BEACH CAM · LONG ISLAND';label='A beach with land on the left and ocean on the right';}
  else if(R.t==='city')body=wdNYBoard(G,R,S.busy?'anim':S.ph);
  else{const src=wdSrcRound(G);if(src){const R2=Object.assign({},src);if(R.t==='tv'){R2.__tv=R.cid;body=wdNYBoard(G,R2,'tv');}else body=wdNYBoard(G,R2,'plain');}else body=wdNYBoard(G,{map:{},cities:[],fields:[]},'plain');}
  const svg=ngSvg(WX.W,WX.H,wdDefs()+body+wdFrame(G,R,right),'ngsvg wdsvg',label);
  S.el={svg};return svg;}
function wdSrcRound(G){const S=G.st;for(let i=S.r-1;i>=0;i--)if(S.rounds[i].t==='city')return S.rounds[i];return null;}

/* ---------------- animation runner ---------------- */
function wdRun(S,dur,step,done){
  if(Art.reduced()){step(1,.016);done();return;}
  let t0=0,last=0;const f=now=>{if(!G||G.st!==S||!S.el||!S.el.svg.isConnected)return;if(!t0)t0=last=now;
    const p=S.skip?1:Math.min(1,(now-t0)/dur),dt=Math.min(.05,(now-last)/1000);last=now;step(p,dt);if(p<1)requestAnimationFrame(f);else done();};
  requestAnimationFrame(f);}
const WD_NS='http://www.w3.org/2000/svg';
const wdMk=(tag,a)=>{const e=document.createElementNS(WD_NS,tag);for(const k in a)e.setAttribute(k,a[k]);return e;};
function wdPassF(c,f){const D=[f.dx||0,f.dy||0],Ln=Math.hypot(D[0],D[1]);if(!Ln)return null;const m=[D[0]/Ln,D[1]/Ln];let best=null;
  for(let i=0;i<f.p.length-1;i++){const P0=f.p[i],e=[f.p[i+1][0]-P0[0],f.p[i+1][1]-P0[1]],w=[c[0]-P0[0],c[1]-P0[1]],det=-e[0]*m[1]+m[0]*e[1];if(Math.abs(det)<1e-9)continue;
    const u=(-w[0]*m[1]+m[0]*w[1])/det,s=(e[0]*w[1]-e[1]*w[0])/det;if(u<0||u>1)continue;if(best==null||Math.abs(s)<Math.abs(best))best=s;}
  return best==null?null:-best/Ln;}
function wdPassM(c,m){if(!m.mx&&!m.my)return null;for(let i=0;i<=40;i++){const p=i/40,x=m.x+m.mx*p,y=m.y+m.my*p;if(((c[0]-x)/(m.rx||92))**2+((c[1]-y)/(m.ry||46))**2<=1)return p;}return null;}

/* Play tomorrow on the New York map */
function wdAnimCity(G,done){
  const S=G.st,R=wdR(G),M=R.map||{},svg=S.el.svg,fx=svg.querySelector('.wdfx'),flash=svg.querySelector('.wdflash');
  const mv=[...svg.querySelectorAll('.wdmv')].map(g=>({g,dx:+g.dataset.dx||0,dy:+g.dataset.dy||0}));
  const fades=[['.wdfcl',0,.25],['.wdcirc',0,.2],['.wdlcl',.08,.35],['.wdband',.12,.5]].map(([s,a,b])=>({els:[...svg.querySelectorAll(s)],a,b}));
  const POOL=[...Array(96)].map(()=>{const e=wdMk('line',{x1:-9,y1:-9,x2:-9,y2:-9,'stroke-linecap':'round'});fx.appendChild(e);return {e,life:0};});
  const spawn=(x,y,kind)=>{const P=POOL.find(q=>q.life<=0);if(!P)return;P.x=x;P.y=y;P.kind=kind;
    if(kind==='snow'){P.vx=(Math.random()-.5)*16;P.vy=38+Math.random()*16;P.life=1.1;P.e.setAttribute('stroke','#fff');P.e.setAttribute('stroke-width','4.4');}
    else{P.vx=-50;P.vy=310;P.life=.17;P.e.setAttribute('stroke','#2f7fd8');P.e.setAttribute('stroke-width','2.2');}};
  const lake=!!M.lake;
  const plans=R.cities.map(([id,ans,why,t0],k)=>{const xy=wdXY(id),sky=ans.sky?wdSky(ans.sky):null;
    const tps=[...(M.fronts||[]).map(f=>wdPassF(xy,f)),...(M.masses||[]).map(m=>wdPassM(xy,m))].filter(v=>v!=null&&v>=0&&v<=1),tp=tps.length?Math.min(...tps):null;
    let kind=null,win=null;
    if(ans.snow==='snow'){kind='snow';win=[.3,1];}
    else if(sky==='storm'){kind='storm';win=tp!=null?[Math.max(.02,tp-.1),Math.min(1,tp+.24)]:[.3,.8];}
    else if(sky==='rain'){kind='rain';win=tp!=null?[Math.max(.02,tp-.45),Math.min(1,tp+.12)]:M.fronts?[.42,1]:[.25,1];}
    const cw=svg.querySelector(`.wdcw[data-i="${k}"]`),tc=svg.querySelector(`.wdtc[data-i="${k}"]`),sn=svg.querySelector(`.wdsn[data-i="${k}"]`);
    let bolt=null;if(kind==='storm'){bolt=wdMk('path',{d:`M${xy[0]+4} ${xy[1]-28}l-7 12h6l-5 13`,stroke:'#fff7a8','stroke-width':2.8,fill:'none','stroke-linejoin':'round',opacity:0});fx.appendChild(bolt);}
    return {xy,kind,win,cw,tc,sn,t0,t1:t0!=null?wdT1(t0,ans.temp):null,tc0:tp!=null?tp:.55,acc:0,bolt,bt:0,tDone:false,snow:R.snow?R.snow[id]||0:0,cwA:win?win[0]:tp!=null?tp:.78};});
  const wisps=lake?[...Array(18)].map(()=>{const e=wdMk('ellipse',{rx:7,ry:4,fill:'#fff',opacity:0});fx.appendChild(e);return {e,life:0};}):[];
  const axes=[[[10,290],[110,226]],[[50,175],[300,165]]];
  let wAcc=0,bAcc=0,fl=0;
  wdRun(S,lake?4600:4200,(p,dt)=>{
    mv.forEach(o=>{if(o.dx||o.dy)o.g.setAttribute('transform',`translate(${wxF(o.dx*p)} ${wxF(o.dy*p)})`);});
    fades.forEach(F=>{const v=Math.max(0,Math.min(1,(p-F.a)/(F.b-F.a)));F.els.forEach(e=>e.setAttribute('opacity',v.toFixed(2)));});
    /* rain along each front's leading band */
    (M.fronts||[]).forEach(f=>{const dx=(f.dx||0)*p,dy=(f.dy||0)*p,ml=Math.hypot(f.dx||0,f.dy||0)||1,ux=(f.dx||0)/ml,uy=(f.dy||0)/ml;
      f.acc=(f.acc||0)+dt*(f.k==='cold'?30:26);while(f.acc>=1){f.acc--;const i=Math.floor(Math.random()*(f.p.length-1)),u=Math.random(),a=f.p[i],b=f.p[i+1],d=f.k==='cold'?6+Math.random()*24:12+Math.random()*90;
        const x=a[0]+(b[0]-a[0])*u+dx+ux*d,y=a[1]+(b[1]-a[1])*u+dy+uy*d;if(y>35&&y<432&&x>0&&x<760)spawn(x,y,'rain');}});
    plans.forEach(pl=>{
      if(pl.cw)pl.cw.setAttribute('opacity',Math.max(0,Math.min(1,(p-pl.cwA)/.08)).toFixed(2));
      const on=pl.win&&p>=pl.win[0]&&p<=pl.win[1];
      if(on){pl.acc+=dt*(pl.kind==='snow'?24:pl.kind==='storm'?48:34);while(pl.acc>=1){pl.acc--;spawn(pl.xy[0]+(Math.random()-.5)*64,pl.xy[1]-30+Math.random()*8,pl.kind==='snow'?'snow':'rain');}
        if(pl.bolt){pl.bt-=dt;if(pl.bt<=0&&Math.random()<dt*2.4){pl.bt=.1;fl=.2;}pl.bolt.setAttribute('opacity',pl.bt>0?'1':'0');}}
      else if(pl.bolt)pl.bolt.setAttribute('opacity','0');
      if(pl.tc&&pl.t1!=null&&!pl.tDone&&p>=pl.tc0){pl.tDone=true;const col=wdTempCol(pl.t1),tt=pl.tc.querySelector('.wdtt'),rr=pl.tc.querySelector('.wdtcr');
        tt.textContent=`${pl.t0}°→${pl.t1}°`;tt.setAttribute('fill',col);rr.setAttribute('stroke',col);rr.setAttribute('x','-31');rr.setAttribute('width','62');if(pl.t1!==pl.t0+1)Art.pop(pl.tc,1.25);}
      if(pl.sn)pl.sn.textContent=Math.round(pl.snow*Math.max(0,Math.min(1,(p-.4)/.55)))+' in';});
    if(lake){if(p<.92){wAcc+=dt*20;while(wAcc>=1){wAcc--;const W=wisps.find(q=>q.life<=0);if(!W)break;const ax=axes[Math.random()<.4?0:1],u=Math.random();W.x=ax[0][0]+(ax[1][0]-ax[0][0])*u+(Math.random()-.5)*14;W.y=ax[0][1]+(ax[1][1]-ax[0][1])*u+(Math.random()-.5)*10;W.life=1;}}
      if(p>.35){bAcc+=dt*22;while(bAcc>=1){bAcc--;const band=Math.random()<.4;const u=Math.random();spawn(band?30+u*100:130+u*240,band?266-u*44:156+u*30,'snow');}}
      wisps.forEach(W=>{if(W.life<=0){if(W.e.getAttribute('opacity')!=='0')W.e.setAttribute('opacity','0');return;}W.life-=dt*1.1;W.y-=dt*24;W.x+=dt*18;W.e.setAttribute('cx',wxF(W.x));W.e.setAttribute('cy',wxF(W.y));W.e.setAttribute('opacity',(Math.max(0,W.life)*.6).toFixed(2));});}
    POOL.forEach(P=>{if(P.life<=0){if(P.e.getAttribute('x1')!=='-9'){P.e.setAttribute('x1',-9);P.e.setAttribute('x2',-9);P.e.setAttribute('y1',-9);P.e.setAttribute('y2',-9);}return;}
      P.life-=dt;P.x+=P.vx*dt;P.y+=P.vy*dt;if(P.kind==='snow')P.vx+=Math.sin(P.y*.12)*dt*30;
      P.e.setAttribute('x1',wxF(P.x));P.e.setAttribute('y1',wxF(P.y));P.e.setAttribute('x2',wxF(P.kind==='snow'?P.x+.1:P.x-4));P.e.setAttribute('y2',wxF(P.kind==='snow'?P.y:P.y+11));});
    fl=Math.max(0,fl-dt*2.2);flash.setAttribute('opacity',fl.toFixed(2));
  },()=>{fx.replaceChildren();flash.setAttribute('opacity','0');done();});}

/* the beach day / night */
function wdAnimBeach(G,done){const S=G.st,R=wdR(G),svg=S.el.svg,T=WD_BT[R.night?'night':'day'],fx=svg.querySelector('.wdfx');
  const mer={land:svg.querySelector('.wdmerc[data-s="land"]'),sea:svg.querySelector('.wdmerc[data-s="sea"]')},tv={land:svg.querySelector('.wdthv[data-s="land"]'),sea:svg.querySelector('.wdthv[data-s="sea"]')};
  const loop=svg.querySelector('.wdloop'),path=svg.querySelector('.wdlooppath'),shim=svg.querySelector('.wdshim'),Lp=path.getTotalLength();
  const dots=[...Array(14)].map(()=>{const e=wdMk('circle',{r:5.5,fill:'#fff',opacity:0});fx.appendChild(e);return e;});
  wdRun(S,4000,p=>{
    ['land','sea'].forEach(s=>{const [a,b]=T[s],v=a+(b-a)*Math.min(1,p/.7),y=wdBY(v);mer[s].setAttribute('y',wxF(y));mer[s].setAttribute('height',wxF(296-y));tv[s].textContent=Math.round(v)+'°F';});
    const o=Math.max(0,Math.min(1,(p-.3)/.18));loop.setAttribute('opacity',o.toFixed(2));shim.setAttribute('opacity',(Math.min(1,p/.3)*.8).toFixed(2));
    dots.forEach((e,i)=>{const pt=path.getPointAtLength(((i/dots.length+p*1.4)%1)*Lp);e.setAttribute('cx',wxF(pt.x));e.setAttribute('cy',wxF(pt.y));e.setAttribute('opacity',(o*.85).toFixed(2));});
  },()=>{fx.replaceChildren();done();});}

/* lower-third type-out when going on air */
function wdAir(G){const S=G.st,svg=S.el&&S.el.svg;if(!svg)return;const tick=svg.querySelector('.wdtick'),air=svg.querySelector('.wdair');if(air)air.classList.add('live');if(!tick)return;
  const full=tick.textContent;if(Art.reduced())return;tick.textContent='';let i=0;const st=()=>{if(!tick.isConnected)return;i+=2;tick.textContent=full.slice(0,i);if(i<full.length)requestAnimationFrame(st);else tick.textContent=full;};requestAnimationFrame(st);}

/* ---------------- drag and drop ---------------- */
let WD_DRAG=null;
function wdDragInit(){if(WD_DRAG)WD_DRAG.destroy();
  WD_DRAG=Art.drag({root:$('ngGrid'),items:'.wdcard',targets:'.wdtgt',accept:wdAccept,label:it=>it.getAttribute('aria-label')||'card',onDrop:wdDrop});}
function wdAccept(it,t){if(!G||G.key!=='weather'||!G.st||G.st.busy||G.done)return false;const S=G.st,ik=it.dataset.k,tk=t.dataset.k;
  if(tk==='slot')return ik==='icon'&&it.dataset.f===t.dataset.f&&S.ph==='cast';
  if(tk==='reg')return ik==='fac'&&!S.fac[t.dataset.id];
  if(tk==='wind')return ik==='wind'&&!S.ran;
  return ik===tk&&S.ph==='place'&&!S.lockT[t.dataset.id];}
function wdPopT(sel,burst){const el=G.st.el&&G.st.el.svg.querySelector(sel);if(!el)return;Art.pop(el,1.06);if(burst)Art.burstAt(el,{n:10,colors:['#ffd23f','#fff','#7fd3ff'],shape:['star','dot']});}
function wdDrop(it,t){if(!wdAccept(it,t))return;const S=G.st,R=wdR(G),tk=t.dataset.k,v=it.dataset.v;
  if(tk==='slot'){const i=+t.dataset.i,f=t.dataset.f;(S.ans[i]=S.ans[i]||{})[f]=v;ngRender();wdPopT(`.wdslot[data-i="${i}"][data-f="${f}"]`);return;}
  if(tk==='reg')return wdFacDrop(v,t.dataset.id);
  if(tk==='wind'){S.wind=v;S.msg=null;ngRender();wdPopT('[data-k="wind"]',true);return;}
  const id=t.dataset.id;Object.keys(S.pl).forEach(k=>{if(S.pl[k]===v)delete S.pl[k];});S.pl[id]=v;S.msg=null;ngRender();wdPopT(`[data-id="${id}"]`,true);
  if(!ngT())ngSay(`**${wdCN(R,v)}** placed. ${Object.keys(S.pl).length>=wdNeed(R)?'Press **Lock in the map** when you are sure.':'Keep going.'}`);}
const wdNeed=R=>wdTargets(R).filter(t=>t.ans).length;

/* ---------------- actions ---------------- */
function wdLock(){const S=G.st,R=wdR(G);if(S.ph!=='place'||G.done||Object.keys(S.pl).length<wdNeed(R))return;
  const T=wdTargets(R),wrong=[];Object.keys(S.pl).forEach(id=>{const t=T.find(x=>x.id===id);if(!t||t.ans!==S.pl[id])wrong.push(S.pl[id]);});
  if(!wrong.length){S.ph='cast';S.msg=['ok','Map locked in! The dashed line shows where everything will be by tomorrow.'];fx.pop({icon:'rain',text:'Map locked in!',kind:'good'});ngRender();
    const b=S.el&&S.el.svg;if(b)Art.burstAt(b,{n:16,colors:['#ffd23f','#fff','#7fd3ff'],shape:['star','dot']});ngSay('Now drag a forecast icon onto every spot by each city.','go');return;}
  G.miss+=wrong.length;G.tries++;wrong.forEach(c=>{Object.keys(S.pl).forEach(k=>{if(S.pl[k]===c)delete S.pl[k];});});Object.keys(S.pl).forEach(id=>{S.lockT[id]=1;});
  S.msg=['no',wrong.map(c=>R.place.why[c]).filter(Boolean).join(' ')+' Try again.'];fx.pop({icon:'rain',text:wrong.length>1?wrong.length+' pieces are off':'One piece is off',kind:'oops'});ngRender();
  if(S.el)Art.shake(S.el.svg);ngSay(S.msg[1],'alert');}
function wdAll(R,S){return R.cities.every((c,k)=>R.fields.every(f=>S.ans[k]&&S.ans[k][f]));}
function wdPlay(){if(!G||G.key!=='weather')return;const S=G.st,R=wdR(G);if(S.ph!=='cast'||S.busy||G.done||!wdAll(R,S))return;
  const res=[];let wrong=0;R.cities.forEach(([id,ans],k)=>{const a=S.ans[k]||{},o={};R.fields.forEach(f=>{o[f]=wdOk(f,ans[f],a[f]);if(!o[f])wrong++;});res.push(o);});
  if(ngT())return ngTAns(1-wrong/(R.cities.length*R.fields.length),wdNext);
  G.tries++;S.res=res;S.wrongN=wrong;S.busy=true;S.skip=false;S.msg=null;S.el=null;ngRender();ngSay('Here comes tomorrow...');
  wdAnimCity(G,()=>{if(G.st!==S)return;S.busy=false;S.ph='played';G.miss+=wrong;ngRender();
    ngSay(wrong?`${wrong} part${wrong>1?'s':''} of your forecast missed. Read each ✗ to see why.`:'Perfect forecast! Every city was right.',wrong?'alert':'go');
    fx.pop({icon:'rain',text:wrong?'Forecast missed':'Perfect forecast!',kind:wrong?'oops':'great'});});}
function wdFacDrop(v,id){const S=G.st,R=wdR(G),rg=R.regions.find(r=>r.id===id);if(!rg||S.fac[id]||G.done)return;
  if(rg.ans===v){S.fac[id]=v;S.msg=['ok',rg.why];const all=R.regions.every(r=>S.fac[r.id]);if(all)S.okNow=true;
    fx.pop({icon:'rain',text:all?'Air mass factory done!':'Correct!',kind:all?'great':'good'});ngRender();wdPopT(`[data-id="${id}"]`,true);
    ngSay(all?'All four air masses are made. The arrows show them blowing toward New York, bringing their weather.':'Right! '+rg.why,'go');}
  else{G.miss++;G.tries++;S.msg=['no',`Not quite: that spot does not make **${WD_FAC[v][0].toLowerCase()}** air. `+rg.why];fx.pop({icon:'rain',text:'Not quite',kind:'oops'});ngRender();
    const el=S.el&&S.el.svg.querySelector(`[data-id="${id}"]`);if(el)Art.bad(el);ngSay(S.msg[1],'alert');}}
function wdBreezeGo(){const S=G.st,R=wdR(G);if(!S.wind||S.ran||S.busy||G.done)return;S.busy=true;S.skip=false;ngRender();
  wdAnimBeach(G,()=>{if(G.st!==S)return;S.busy=false;S.ran=true;const ok=S.wind===R.ans;if(!ok){G.miss++;G.tries++;}
    S.msg=[ok?'ok':'no',(ok?'Right! ':'Not this time. Watch the flag and the arrows. ')+R.why];ngRender();
    fx.pop({icon:'rain',text:ok?'Correct!':'Not quite',kind:ok?'good':'oops'});ngSay(S.msg[1],ok?'go':'alert');});}
function wdAnswer(v){const S=G.st,R=wdR(G);if(S.okNow||G.done)return;
  if(ngT())return ngTAns(v===R.ans,wdNext);
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'rain',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no','Not quite. '+R.why];fx.pop({icon:'rain',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function wdChipPick(i,j){const S=G.st;if(S.okNow||G.done||S.tvNo[i].includes(j))return;S.tv[i]=j;S.msg=null;ngRender();}
function wdGoLive(){const S=G.st,R=wdR(G);if(S.okNow||G.done||S.tv.some(v=>v==null))return;
  const wrong=[];S.tv.forEach((v,i)=>{if(v!==R.ans[i])wrong.push(i);});
  if(!wrong.length){S.okNow=true;S.msg=['ok',R.ok||'Great forecast!'];ngRender();wdAir(G);fx.pop({icon:'rain',text:'You’re on air!',kind:'great'});ngSay('Great broadcast! '+(R.ok||''),'go');return;}
  G.miss+=wrong.length;G.tries++;wrong.forEach(i=>{S.tvNo[i].push(S.tv[i]);S.tv[i]=null;});
  S.msg=['no',wrong.map(i=>R.why[i]).join(' ')];fx.pop({icon:'rain',text:wrong.length>1?wrong.length+' blanks are off':'One blank is off',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}
function wdRound(G){const S=G.st,R=wdR(G);
  Object.assign(S,{ph:'cast',pl:{},lockT:{},ans:{},res:null,wrongN:0,msg:null,busy:false,skip:false,wrong:[],okNow:false,tv:[null,null,null],tvNo:[[],[],[]],ord:null,fac:{},wind:null,ran:false});
  if(R.t==='city'&&R.place&&!ngT())S.ph='place';
  if(R.t==='tv')S.ord=R.parts.map(p=>wdShuf(p.map((_,j)=>j)));}
function wdNext(){const S=G.st;
  if(S.r+1>=S.rounds.length){S.fin=true;G.detail={mistakes:G.miss};if(!ngT())ngRender();const m=G.miss;ngWin(ngStars(m,0,2),['You finished with ',h('b',null,m),` mistake${m===1?'':'s'}.`]);return;}
  S.r++;wdRound(G);ngRender();}

/* ---------------- side panel ---------------- */
function wdTask(icon,title,small){return h('div',{class:'mwtask wdtask'},h('span',{class:'mwflag wdflag'},icon),h('div',null,h('b',null,title),h('small',null,...ngRich(small))));}
function wdMsg(S){return S.msg?h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])):null;}
function wdProg(G){const S=G.st;if(S.rounds.length<2)return null;
  return h('div',{class:'ppsteps'},...S.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&(S.okNow||S.ph==='played'&&x.t==='city'||S.ran))?' ok':k===S.r?' on':'')},x.t==='tv'?'On air':'Round '+(k+1))));}
function wdCardIco(c,R){const k=WD_CARD[c];
  if(k.k==='front')return svgEl(`<svg viewBox="0 0 60 30" width="48" height="24" aria-hidden="true">${wdFront([[4,22],[56,14]],c,[0,-1],1)}</svg>`);
  if(k.k==='mass')return svgEl(`<svg viewBox="0 0 44 28" width="38" height="24" aria-hidden="true"><ellipse cx="22" cy="14" rx="20" ry="12" fill="${k.c==='cold'?'#6fa4ff':'#ff8f66'}"/><ellipse cx="17" cy="9" rx="9" ry="4" fill="#fff" opacity=".35"/>${k.c==='cold'?wdFlake(22,14,6,'#fff'):'<circle cx="22" cy="14" r="5.5" fill="#ffd23f"/>'}</svg>`);
  return svgEl(`<svg viewBox="0 0 30 30" width="28" height="28" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="#fff" stroke="${c==='H'?'#2563eb':'#dc3b3b'}" stroke-width="2.5"/><text x="15" y="21.5" text-anchor="middle" font-size="19" font-weight="900" fill="${c==='H'?'#2563eb':'#dc3b3b'}">${c}</text></svg>`);}
function wdTrayPlace(G,R){const S=G.st,P=R.place,cards=[];(P.lines||[]).length&&cards.push(['Fronts',['cold','warm']]);(P.zones||[]).length&&cards.push(['Air masses',['mc','mw']]);(P.spots||[]).length&&cards.push(['Pressure',['H','L']]);
  return h('div',{class:'wdtray'},...cards.map(([g,cs])=>h('div',{class:'wdgrp'},h('div',{class:'osl'},g),h('div',{class:'wdcards'},...cs.map(c=>{const on=Object.values(S.pl).includes(c),lk=on&&Object.keys(S.pl).some(id=>S.pl[id]===c&&S.lockT[id]);
    return h('button',{type:'button',class:'wdcard'+(on?' on':'')+(lk?' lk':''),'data-k':WD_CARD[c].k,'data-v':c,disabled:lk||G.done||S.busy,'aria-label':`${wdCN(R,c)}. Drag it onto the map.`},wdCardIco(c,R),h('span',null,wdCN(R,c)),on?h('i',{class:'wdin'},lk?'🔒':'✓'):null);})))));}
function wdTrayIcons(G,R){const S=G.st;
  return h('div',{class:'wdtray'},...R.fields.map(f=>h('div',{class:'wdgrp'},h('div',{class:'osl'},WD_FL[f]),h('div',{class:'wdicons'},...WD_F[f].map(([v,n])=>
    h('button',{type:'button',class:'wdcard wdico','data-k':'icon','data-f':f,'data-v':v,disabled:G.done||S.busy,'aria-label':`${n}. Drag it onto a city's ${WD_FL[f].toLowerCase()} spot.`},wdIcoSvg(WD_IC[v],30),h('span',null,n)))))));}
function wdSideCity(G,R){const S=G.st,kids=[wdProg(G)],test=ngT(),hasPl=!!(R.place&&!test);
  if(!test){const st=hasPl?[['place','Read the map'],['cast','Forecast'],['played','Tomorrow']]:[['cast','Forecast'],['played','Tomorrow']],idx=st.findIndex(x=>x[0]===S.ph);
    kids.push(h('div',{class:'ppsteps wdsteps'},...st.map(([k,tx],i)=>h('span',{class:'ppst'+(i<idx||S.ph==='played'?' ok':i===idx?' on':'')},(i+1)+' · '+tx))));}
  if(S.ph==='place'){const need=wdNeed(R),n=Object.keys(S.pl).length;
    kids.push(wdTask('🗺','Read the map',R.place.task||'Use the **temperatures** and **wind arrows**. Drag each card onto its spot on the map.'),wdTrayPlace(G,R),wdMsg(S),
      ngBtn([I('check'),` Lock in the map (${Math.min(n,need)}/${need})`],wdLock,'good wdgo',{disabled:n<need||G.done}));return kids;}
  if(S.ph==='cast'){kids.push(wdTask('📡','Forecast tomorrow',`Drag a weather icon onto ${R.fields.length>1?'both spots':'the spot'} by every city.`));
    if(S.msg&&!S.busy)kids.push(wdMsg(S));kids.push(wdTrayIcons(G,R));
    kids.push(S.busy?ngBtn('Skip ▶',()=>{S.skip=true;},'ghost wdgo',{}):ngBtn([I('play'),test?' Save forecast':' Play tomorrow'],wdPlay,'good wdgo',{disabled:!wdAll(R,S)||G.done}));return kids;}
  const n=R.cities.length*R.fields.length;
  kids.push(h('div',{class:'ppmsg '+(S.wrongN?'no':'ok')},S.wrongN?`${n-S.wrongN} of ${n} right. Read each ✗ below.`:`Perfect forecast: ${n} of ${n}!`));
  kids.push(h('div',{class:'wdres'},...R.cities.map(([id,ans,why],k)=>{const o=S.res[k],a=S.ans[k]||{},ok=R.fields.every(f=>o[f]);
    const close=R.fields.map(f=>o[f]?'':wdClose(f,ans[f],a[f])).join('');
    return h('div',{class:'wdrow'+(ok?' ok':' no')},h('span',{class:'wdrb'},ok?'✓':'✗'),h('div',null,h('b',null,WD_CITY[id].n),h('small',null,...ngRich(why+close))));})));
  kids.push(ngBtn(S.r+1<S.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good wdgo',{disabled:G.done}));
  return kids;}
function wdSideTv(G,R){const S=G.st,city=wdTvCity(R),lab=['Weather','Cause','How it works'];
  const slot=i=>h('span',{class:'wdsl'+(S.tv[i]!=null?' on':S.tvNo[i].length?' no':'')+(S.okNow?' ok':'')},S.tv[i]!=null?R.parts[i][S.tv[i]]:'?');
  const sent=h('div',{class:'wdsent'},h('b',null,city+': '),slot(0),' because ',slot(1),' ',slot(2),'.');
  if(S.okNow)return [wdProg(G),wdTask('🎙','You’re on air!',`Your forecast for **${city}** is live.`),sent,wdMsg(S),ngBtn(S.r+1<S.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good wdgo',{disabled:G.done})];
  return [wdProg(G),wdTask('🎙','You’re on air!',`Forecast **${city}**: tap a card for each blank, then go live.`),sent,
    ...[0,1,2].map(i=>h('div',{class:'wdbank'},h('small',null,lab[i]),h('div',{class:'wdchips'},...S.ord[i].map(j=>h('button',{type:'button',class:'wdchip'+(S.tv[i]===j?' on':'')+(S.tvNo[i].includes(j)?' no':''),disabled:G.done||S.tvNo[i].includes(j),'aria-pressed':S.tv[i]===j?'true':'false',onclick:()=>wdChipPick(i,j)},R.parts[i][j]))))),
    S.msg&&S.msg[0]==='no'?h('div',{class:'ppmsg no wdtvno'},'✗ Fill the red blanks again. The coach line at the top says why.'):null,
    ngBtn('🎙 Go live',wdGoLive,'good wdgo',{disabled:S.tv.some(v=>v==null)||G.done})];}
function wdSideFac(G,R){const S=G.st,left=R.cards.filter(c=>!Object.values(S.fac).includes(c));
  return [wdTask('🏭','Air mass factory','Each spot shows what the ground or water is like. Drag each air mass to the place where it forms.'),
    h('div',{class:'wdtray'},h('div',{class:'wdgrp'},h('div',{class:'osl'},'Air masses'),h('div',{class:'wdcards'},...left.map(c=>{const [n,k]=WD_FAC[c];
      return h('button',{type:'button',class:'wdcard','data-k':'fac','data-v':c,disabled:G.done,'aria-label':`${n} air. Drag it to where it forms.`},svgEl(`<svg viewBox="0 0 44 28" width="38" height="24" aria-hidden="true"><ellipse cx="22" cy="14" rx="20" ry="12" fill="${WD_FACC[k]}"/><ellipse cx="17" cy="9" rx="9" ry="4" fill="#fff" opacity=".35"/></svg>`),h('span',null,n));}),
      left.length?null:h('span',{class:'wddone'},'✓ All placed')))),
    wdMsg(S),S.okNow?ngBtn(S.r+1<S.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good wdgo',{disabled:G.done}):null];}
function wdSideBreeze(G,R){const S=G.st;
  return [wdProg(G),wdTask(R.night?'🌙':'☀',R.night?'Night at the beach':'Afternoon at the beach',R.night?'The Sun has set. Which way will the wind blow at night? Drag a wind arrow onto the beach.':'The Sun is heating the beach. Which way will the wind blow this afternoon? Drag a wind arrow onto the beach.'),
    h('div',{class:'wdtray'},h('div',{class:'wdgrp'},h('div',{class:'osl'},'Wind arrows'),h('div',{class:'wdcards'},...[['sea','From the ocean to the land','M34 12H6M12 6L6 12 12 18'],['land','From the land to the ocean','M6 12H34M28 6L34 12 28 18']].map(([v,n,d])=>
      h('button',{type:'button',class:'wdcard'+(S.wind===v?' on':''),'data-k':'wind','data-v':v,disabled:S.ran||S.busy||G.done,'aria-label':`Wind ${n.toLowerCase()}. Drag it onto the beach.`},svgEl(`<svg viewBox="0 0 40 24" width="38" height="22" aria-hidden="true"><path d="${d}" stroke="#2563eb" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`),h('span',null,n)))))),
    wdMsg(S),S.ran?ngBtn(S.r+1<S.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good wdgo',{disabled:G.done})
      :S.busy?ngBtn('Skip ▶',()=>{S.skip=true;},'ghost wdgo',{}):ngBtn([I('play'),R.night?' Play the night':' Play the afternoon'],wdBreezeGo,'good wdgo',{disabled:!S.wind||G.done})];}
function wdSideMc(G,R){const S=G.st;
  return [wdProg(G),h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>wdAnswer(v)},t))),
    wdMsg(S),S.okNow?ngBtn(S.r+1<S.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good wdgo',{disabled:G.done}):null];}
function wdKey(G,R){const S=G.st;
  if(R.t==='city'&&S.ph==='place')return h('div',{class:'fgkey wdkey'},'Drag a card onto a glowing spot on the map, or tap a card and then the spot. Keyboard: Enter picks up, arrows choose, Enter drops.');
  if(R.t==='city'||R.t==='tv'&&!R.board)return h('div',{class:'wdkey'},h('span',null,h('i',{class:'wdk cold'}),'Cold front'),h('span',null,h('i',{class:'wdk warm'}),'Warm front'),h('span',null,h('b',{style:'color:#2563eb'},'H'),' High pressure'),h('span',null,h('b',{style:'color:#dc3b3b'},'L'),' Low pressure'),h('span',null,'Chips: temperature °F, wind arrow, 💧 humid'));
  if(R.t==='fac')return h('div',{class:'fgkey wdkey'},'Over water = humid. Over land = dry. Near the equator = warm. Near the pole = cold.');
  if(R.t==='breeze')return h('div',{class:'fgkey wdkey'},'Drag a wind arrow onto the beach (or tap it, then the beach), then play it.');
  return h('div',{class:'fgkey wdkey'},R.pic==='currents'||R.board==='gulf'?'Red = warm current. Blue = cold current.':'Read the question on the right.');}

/* ---------------- the game ---------------- */
ngDef({key:'weather',name:'Weather Desk',ic:'rain',std:'MS-ESS2-5 · ESS2-6',subj:'earth',cap3:true,winDelay:700,
  short:'Read weather maps, forecast each city, then go on air.',menuDesc:'You are the TV forecaster. Put fronts, air masses, highs and lows on a map of New York, drag a forecast onto every city, then play tomorrow and watch it happen.',
  intro:'You are the TV forecaster! Read the station data, put the fronts and air masses on the map of New York, drag a forecast onto every city, then play tomorrow and see how you did. Later levels show how land, lakes and oceans shape weather, and you go on air to explain why.',
  how:['**Read the map:** use the temperatures, winds and pressures to drag fronts, air masses, H and L into place.','**Forecast:** drag a weather icon onto every city.','Press **Play tomorrow** and watch the weather move in. Then go on air and say why.'],
  levels:WD_LEVELS,packs:WD_PACKS,
  mini:L=>{const R=L.rounds[0];let b='';
    if(R.t==='city'&&R.map.fronts)b=R.map.fronts.map(f=>`<polyline points="${f.p.map(([x,y])=>`${wxF(x/760*44)},${wxF(y/440*30)}`).join(' ')}" fill="none" stroke="${f.k==='cold'?'#2563eb':'#dc3b3b'}" stroke-width="2.6"/>`).join('');
    else if(R.t==='city'&&R.map.lake)b=`<ellipse cx="14" cy="17" rx="10" ry="4" fill="#5eaeea"/>${wdFlake(30,12,5,'#fff')}${wdFlake(36,20,3.5,'#fff')}`;
    else if(R.t==='city'&&R.map.highs)b=`<text x="12" y="21" text-anchor="middle" font-size="15" font-weight="900" fill="#2563eb">H</text><text x="32" y="21" text-anchor="middle" font-size="15" font-weight="900" fill="#dc3b3b">L</text>`;
    else if(R.t==='city')b=`<ellipse cx="18" cy="12" rx="14" ry="8" fill="#6fa4ff" opacity=".8"/><ellipse cx="28" cy="20" rx="14" ry="8" fill="#ff8f66" opacity=".8"/>`;
    else if(R.t==='fac')b=['#ff8a5c','#4f95ff','#f2b134','#3fc0c0'].map((c,i)=>`<circle cx="${8+i*9.5}" cy="15" r="4.5" fill="${c}"/>`).join('');
    else if(R.t==='breeze')b=`<rect y="18" width="22" height="12" fill="#f3dca2"/><rect x="22" y="20" width="22" height="10" fill="#2f8fd8"/><circle cx="9" cy="8" r="4.5" fill="#ffd23f"/><path d="M36 13H16M20 9l-4 4 4 4" stroke="#fff" stroke-width="2" fill="none"/>`;
    else b=`<path d="M4 26Q16 20 22 14T40 4" stroke="#ff6a3c" stroke-width="3" fill="none"/>`;
    return svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="${R.t==='breeze'?'#9fd4f7':R.t==='city'?'#dbe9c4':'#3f8fd8'}"/>${b}</svg>`);},
  start(G){const L=G.L;G.st={rounds:L.rounds.filter(r=>ngT()?r.test!==false:r.play!==false),r:0,el:null};wdRound(G);wdDragInit();},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){const S=G.st,R=wdR(G);if(!R)return;
    if(!S.busy||!S.el||!S.el.svg.isConnected)ngRC(main,h('div',{class:'wdwrap'+(G.L.intro?'':' nointro')},wdBoard(G)),wdKey(G,R));
    ngRC(side,...(R.t==='city'?wdSideCity(G,R):R.t==='tv'?wdSideTv(G,R):R.t==='fac'?wdSideFac(G,R):R.t==='breeze'?wdSideBreeze(G,R):wdSideMc(G,R)));
    if(S.msg||S.busy)return;
    if(R.t==='city'){if(S.ph==='place')ngSay(Object.keys(S.pl).length<wdNeed(R)?((R.place.spots||[]).length?'Read the pressure on each chip. Then drag the H and the L onto the map.':'Read the temperatures and winds. Then drag each card onto the map.'):'Everything placed? Press **Lock in the map**.');
      else if(S.ph==='cast')ngSay(wdAll(R,S)?(ngT()?'Forecast done? Press **Save forecast**.':'Forecast done? Press **Play tomorrow**!'):'Drag a forecast icon onto every spot by each city.');}
    else if(R.t==='tv')ngSay('Build the forecast sentence, then press **Go live**.');
    else if(R.t==='fac')ngSay('Drag each air mass to the place where it forms.');
    else if(R.t==='breeze')ngSay(S.wind?'Press play and watch the air move.':'Which way will the wind blow? Drag an arrow onto the beach.');
    else ngSay('Think about how heat and water move.');},
  hints(G){const L=G.L,S=G.st,R=wdR(G)||S.rounds[0];
    const tip='Cold front passing: storms, then colder. Warm front passing: steady rain, then warmer (rain spreads out ahead of it). No front reaching a city: about the same. High = dry; low = rainy. Snow falls downwind of the lakes.';
    let big='';
    if(R.t==='city'&&S.ph==='place')big='The gold glow on the map shows where each piece goes.';
    else if(R.t==='city')big='Answers: '+R.cities.map(([id,ans])=>`${WD_CITY[id].n}: ${R.fields.map(f=>WD_F[f].find(o=>o[0]===wdSky(ans[f]))[1].toLowerCase()).join(', ')}`).join('; ')+'.';
    else if(R.t==='mc')big='Answer: '+R.opts.find(o=>o[0]===R.ans)[1];
    else if(R.t==='tv')big='Say: “'+wdSentence(R,R.ans,wdTvCity(R))+'”';
    else if(R.t==='fac')big='Gulf of Mexico: warm and humid. Northern Canada: cold and dry. Desert: warm and dry. North Atlantic: cold and humid. The gold labels show them.';
    else if(R.t==='breeze')big='Answer: '+(R.ans==='sea'?'from the ocean to the land (a sea breeze).':'from the land to the ocean (a land breeze).')+' The gold glow marks the spot.';
    return [L.clue,R.t==='breeze'||L.name==='Beach Breeze'?'Land heats up and cools down fast. Water changes temperature slowly. Air rises over the warmer side, and air flows in near the ground to replace it.':tip,big];}
});
NGTHUMB.weather=()=>{
  const t=`<defs><linearGradient id="twl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4e6b8"/><stop offset="1" stop-color="#b6cf96"/></linearGradient></defs>
<rect width="320" height="180" fill="url(#twl)"/><path d="M0 104Q40 92 78 86Q60 112 20 128L0 132Z" fill="#4f9fe0"/><path d="M70 52Q130 36 196 50Q206 60 186 66Q130 70 74 64Z" fill="#4f9fe0"/><path d="M240 180Q262 150 320 136V180Z" fill="#3f8fd8"/>
<polyline points="128,24 118,80 108,150" fill="none" stroke="#fff" stroke-width="10" opacity=".6"/><polyline points="128,24 118,80 108,150" fill="none" stroke="#2563eb" stroke-width="6"/>${[[126,40],[121,68],[115,100],[110,130]].map(([x,y])=>`<path d="M${x-1} ${y-7}l15 5-15 8z" fill="#2563eb"/>`).join('')}
<circle cx="178" cy="104" r="5" fill="#13203d"/><circle cx="236" cy="78" r="5" fill="#13203d"/>
<g transform="translate(240 50) scale(1.2)"><ellipse cx="0" cy="10" rx="24" ry="5" fill="#0b1530" opacity=".15"/><circle cx="-11" cy="0" r="9" fill="#fff"/><circle cx="0" cy="-6" r="12" fill="#fff"/><circle cx="12" cy="-1" r="9" fill="#fff"/><rect x="-20" y="-2" width="40" height="10" rx="5" fill="#fff"/></g>
<path d="M172 120l-4 10M182 118l-4 10M192 120l-4 10" stroke="#2f8be8" stroke-width="3.2" stroke-linecap="round"/><g transform="translate(160 86) scale(.9)"><circle cx="-10" cy="0" r="8" fill="#8a93a8"/><circle cx="2" cy="-5" r="11" fill="#8a93a8"/><circle cx="12" cy="0" r="8" fill="#8a93a8"/><rect x="-18" y="-2" width="38" height="9" rx="4.5" fill="#8a93a8"/></g>
<rect width="320" height="26" fill="#0b1430" opacity=".9"/><text x="12" y="18" font-family="system-ui,Arial" font-size="12" font-weight="900" fill="#fff" letter-spacing="2">WEATHER DESK</text><rect x="132" y="6" width="58" height="14" rx="7" fill="#e2483f"/><circle cx="142" cy="13" r="3" fill="#fff"/><text x="149" y="17" font-family="system-ui,Arial" font-size="8.5" font-weight="900" fill="#fff">ON AIR</text>
<rect y="154" width="320" height="26" fill="#13203d"/><rect y="154" width="320" height="2.5" fill="#ffd23f"/><rect y="156.5" width="70" height="23.5" fill="#ffd23f"/><text x="35" y="172" text-anchor="middle" font-family="system-ui,Arial" font-size="9" font-weight="900" fill="#13203d">FORECAST</text><rect x="82" y="164" width="150" height="7" rx="3.5" fill="#fff" opacity=".75"/>`;
  return ngWrap('weather','#3a7bc8',t);
};
