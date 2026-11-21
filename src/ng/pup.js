/* ================= LIFE 3: PUP PREDICTOR (MS-LS3-2) =================
   Choose parents, fill in the Punnett square, predict the chance of each trait, THEN breed.
   Real litters vary: the square gives the chance, not a promise. Mistakes are explained. */
const PP_PCT=[[0,'0%'],[25,'25%'],[50,'50%'],[75,'75%'],[100,'100%']];
const ppGeno=(a,b)=>{const s=[a,b].sort((x,y)=>(x===x.toUpperCase()?0:1)-(y===y.toUpperCase()?0:1));return s.join('');};
const ppCells=(g1,g2)=>[[ppGeno(g1[0],g2[0]),ppGeno(g1[0],g2[1])],[ppGeno(g1[1],g2[0]),ppGeno(g1[1],g2[1])]];
const ppPctOf=(g1,g2,test)=>{const c=ppCells(g1,g2).flat();return c.filter(test).length*25;};
/* dogs: name, sex, genotype, known (show genotype) */
const PPD=(n,s,g,k)=>({n,s,g,k:k!==false});
const PPL=(name,story,o)=>Object.assign({name,story,dom:'B',rec:'b',domN:'black',recN:'brown',kind:'dog'},o);
const PP_LEVELS=[
  PPL('Black or Brown?','Ace and Bella are having puppies.',{pair:[PPD('Ace','M','Bb'),PPD('Bella','F','bb')],
    intro:'**B** = black coat (dominant). **b** = brown coat (recessive). A pup is brown only if it gets **b from BOTH** parents (bb).',
    steps:[{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:50,why:'2 of the 4 boxes are bb, so the chance is 2 out of 4 = 50%.'},{t:'breed'}],
    fact:'Each parent passes on ONE of its two alleles to each pup, by chance. The Punnett square shows every combination that can happen.',
    clue:'Write Ace’s two alleles along one side and Bella’s along the other. Each box gets one letter from its row and one from its column.'}),
  PPL('Hidden Brown','Two black dogs, Rex and Luna, are having puppies.',{pair:[PPD('Rex','M','Bb'),PPD('Luna','F','Bb')],
    steps:[{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:25,why:'Only 1 of the 4 boxes is bb, so the chance is 1 out of 4 = 25%.'},{t:'breed'},
      {t:'mc',q:'Both parents are black. How can a pup be brown?',opts:[['carry','Both parents carry a hidden b allele, and the pup got b from each.'],['mut','The pup changed color because it was born in a dark den.'],['mix','The colors blended together.']],ans:'carry',why:'A black Bb dog carries a hidden brown allele. If a pup gets b from both parents, it is bb and brown.'}],
    fact:'A recessive allele can hide for generations. Two parents who do not show a trait can still pass it to their offspring.',
    clue:'Both parents are Bb. That means each one has a hidden b to pass on.'}),
  PPL('All Black?','Max is BB and Coco is bb.',{pair:[PPD('Max','M','BB'),PPD('Coco','F','bb')],
    steps:[{t:'square'},{t:'pct',q:'What is the chance each pup is black?',ans:100,why:'Every box is Bb. B is dominant, so every pup is black.'},
      {t:'pct',q:'What is the chance a pup carries a hidden brown allele (Bb)?',ans:100,why:'Every box is Bb. Every pup is black but carries a hidden b.'},{t:'breed'}],
    fact:'A dominant allele shows its trait even when only one copy is there. Bb dogs look black but carry brown.',
    clue:'Max can only pass on B. Coco can only pass on b. What does every pup get?'}),
  PPL('Brown Puppy Wanted','The Smith family wants a brown puppy.',{choose:{goal:'Pick a male and a female with the BEST chance of brown pups.',
      dogs:[PPD('Max','M','BB'),PPD('Duke','M','Bb'),PPD('Rusty','M','bb'),PPD('Luna','F','Bb'),PPD('Coco','F','bb')],best:[['Rusty','Coco']],test:g=>g[0]==='b'},
    steps:[{t:'parents'},{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:100,why:'Both parents are bb, so every box is bb. Every pup is brown.'},{t:'breed'}],
    fact:'Two parents that show a recessive trait (bb) can only pass on the recessive allele, so all their offspring show it too.',
    clue:'A brown pup needs b from BOTH parents. Which parents can only give b?'}),
  PPL('Show Dogs','A show needs a litter with NO brown pups at all.',{choose:{goal:'Pick a male and a female so NO pup can be brown.',
      dogs:[PPD('Max','M','BB'),PPD('Duke','M','Bb'),PPD('Luna','F','Bb'),PPD('Coco','F','bb')],best:[['Max','Luna'],['Max','Coco']],test:g=>g[0]==='b'},
    steps:[{t:'parents'},{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:0,why:'Max always passes on B, so every pup has at least one B and is black.'},{t:'breed'}],
    fact:'If one parent is BB, every offspring gets a dominant B, so none can show the recessive trait.',
    clue:'If one parent can ONLY give B, no pup can be bb.'}),
  PPL('Only One Brown','The kennel has only one brown dog.',{choose:{goal:'Pick a male and a female with the BEST chance of brown pups.',
      dogs:[PPD('Max','M','BB'),PPD('Duke','M','Bb'),PPD('Luna','F','BB'),PPD('Coco','F','bb')],best:[['Duke','Coco']],test:g=>g[0]==='b'},
    steps:[{t:'parents'},{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:50,why:'Duke (Bb) × Coco (bb) gives 2 bb boxes out of 4 = 50%.'},{t:'breed'}],
    fact:'A parent that carries a hidden recessive allele (Bb) can pass it on half the time.',
    clue:'Coco is the only brown dog. Which male carries a hidden b?'}),
  PPL('Puppy Detective','Black dogs Ace and Luna had a litter with two brown pups.',{pair:[PPD('Ace','M','Bb',false),PPD('Luna','F','Bb',false)],past:['Bb','bb','BB','Bb','bb','Bb'],
    steps:[{t:'genos',q:'Both parents are black, but two pups are brown. What are the parents’ genotypes?',ans:'Bb',why:'A brown pup is bb, so it got b from EACH parent. Black parents with a b must be Bb.'},
      {t:'square'},{t:'pct',q:'If they have another litter, what is the chance each pup is brown?',ans:25,rec:1,why:'Bb × Bb gives 1 bb box out of 4 = 25%.'}],
    fact:'Scientists can figure out hidden genotypes by looking at the offspring. This is how breeders and geneticists work out family patterns.',
    clue:'What genotype does a brown pup have? Where did each of its alleles come from?'}),
  PPL('Test Cross','Max is black. Nobody knows if he is BB or Bb.',{choose:{goal:'To find out Max’s genotype, which female should he be bred with?',
      dogs:[PPD('Max','M','Bb',false),PPD('Coco','F','bb'),PPD('Luna','F','BB'),PPD('Daisy','F','Bb')],fixed:'Max',best:[['Max','Coco']],
      why:'Breed him with a bb dog. If Max is Bb, some pups will be brown. If he is BB, none will be. A BB or Bb female would hide the answer.'},
    litter:['Bb','bb','Bb','Bb','bb','Bb','Bb','bb'],
    steps:[{t:'parents'},{t:'breed'},{t:'genos',who:'Max',q:'Some pups came out brown. What is Max’s genotype?',ans:'Bb',why:'Each brown pup is bb, so it got a b from Max. Max must be Bb.'}],
    fact:'Breeding an unknown with a recessive (bb) partner is called a test cross. The offspring reveal the hidden allele.',
    clue:'Which female would let a hidden b from Max SHOW in the pups?'}),
  PPL('Clones or Seeds?','A red-flowered strawberry plant (Rr) can reproduce two ways.',{dom:'R',rec:'r',domN:'red',recN:'white',kind:'plant',pair:[PPD('Plant A','',''+'Rr'),PPD('Plant B','','Rr')],
    intro:'**Runners** are stems that grow new plants with no partner (asexual). **Seeds** come from two parents (sexual). R = red flowers (dominant), r = white.',
    steps:[{t:'mc',q:'A runner grows a new plant from Plant A alone. What is the chance it is Rr, exactly like Plant A?',opts:[['100','100%: it is a copy of the one parent'],['50','50%: like a Punnett square'],['25','25%']],ans:'100',why:'Asexual reproduction makes offspring with the SAME genetic information as the one parent.'},
      {t:'square'},{t:'pct',q:'Seeds come from Plant A × Plant B (Rr × Rr). What is the chance a seedling is Rr like its parents?',ans:50,why:'2 of the 4 boxes are Rr, so 50%. The others are RR or rr: different from the parents.'},
      {t:'mc',q:'Which way of reproducing makes more VARIETY in the offspring?',opts:[['sex','Seeds (sexual): genes from two parents mix'],['asex','Runners (asexual): copies of one parent'],['same','Both make the same amount of variety']],ans:'sex',why:'Sexual reproduction mixes alleles from two parents, so the offspring vary. Asexual offspring are identical copies.'}],
    fact:'Asexual reproduction makes identical offspring. Sexual reproduction mixes genes from two parents and makes variation.',
    clue:'A runner has only ONE parent. Seeds have TWO.'})
];
const PP_PACKS={0:'Pack 1: The Punnett square',3:'Pack 2: Choose the parents',6:'Pack 3: Detective work'};
/* ---------------- art: puppies and strawberry plants ---------------- */
const PP_COAT={black:{a:'#5a5a68',b:'#1c1c24',lt:'#757584',ear:'#121217',nose:'#0e0e12'},brown:{a:'#d08f52',b:'#83481c',lt:'#ecc08c',ear:'#5f3210',nose:'#3a1d08'},
  grey:{a:'#c7cede',b:'#9aa4b8',lt:'#e3e8f1',ear:'#8590a6',nose:'#5b6680'}};
function ppDefsMarkup(p){p=p||'pp';return `<defs>${Object.keys(PP_COAT).map(k=>{const c=PP_COAT[k];return `<radialGradient id="${p}C${k}" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></radialGradient>`;}).join('')}
<radialGradient id="${p}Fred" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ff8a7a"/><stop offset="1" stop-color="#c8282a"/></radialGradient>
<radialGradient id="${p}Fwhite" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2ddd2"/></radialGradient>
<linearGradient id="${p}Leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fd46a"/><stop offset="1" stop-color="#2f8a3a"/></linearGradient></defs>`;}
function ppDefs(){if(document.getElementById('pp-defs'))return;document.body.appendChild(svgEl(`<svg id="pp-defs" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${ppDefsMarkup()}</svg>`));}
/* a sitting puppy in a 100 x 100 box */
function ppPupArt(coat,o,p){
  o=o||{};p=p||'pp';const c=PP_COAT[coat],f=`url(#${p}C${coat})`,col=o.collar;
  return `<ellipse cx="50" cy="95" rx="30" ry="4.5" fill="#0b1430" opacity=".18"/>`+
  `<path d="M72 80c10-2 16-12 14-24" stroke="${c.b}" stroke-width="7" fill="none" stroke-linecap="round" class="pptail"/>`+
  `<ellipse cx="51" cy="72" rx="25" ry="21" fill="${f}"/><ellipse cx="50" cy="74" rx="11" ry="14" fill="${c.lt}" opacity=".85"/>`+
  `<rect x="37" y="74" width="10" height="20" rx="5" fill="${f}"/><rect x="53" y="74" width="10" height="20" rx="5" fill="${f}"/>`+
  `<ellipse cx="42" cy="93" rx="6.5" ry="3.6" fill="${c.lt}"/><ellipse cx="58" cy="93" rx="6.5" ry="3.6" fill="${c.lt}"/>`+
  (col?`<path d="M33 56q17 9 34 0" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="50" cy="62" r="3.4" fill="#ffd23f" stroke="#b07a00" stroke-width="1"/>`:'')+
  `<path d="M31 27C17 27 14 50 22 58c7-3 11-14 12-26z" fill="${c.ear}"/><path d="M69 27c14 0 17 23 9 31-7-3-11-14-12-26z" fill="${c.ear}"/>`+
  `<circle cx="50" cy="38" r="21" fill="${f}"/><ellipse cx="43" cy="27" rx="9" ry="5" fill="#fff" opacity=".13" transform="rotate(-20 43 27)"/>`+
  `<ellipse cx="50" cy="47" rx="11.5" ry="8.5" fill="${c.lt}"/>`+
  `<circle cx="42" cy="36" r="3.7" fill="#0e0e12"/><circle cx="58" cy="36" r="3.7" fill="#0e0e12"/><circle cx="43.2" cy="34.8" r="1.3" fill="#fff"/><circle cx="59.2" cy="34.8" r="1.3" fill="#fff"/>`+
  `<ellipse cx="50" cy="43.5" rx="4.6" ry="3.3" fill="${c.nose}"/><ellipse cx="48.6" cy="42.6" rx="1.4" ry=".9" fill="#fff" opacity=".5"/>`+
  `<path d="M50 46.5v3M45.5 50q4.5 3.4 9 0" stroke="${c.nose}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`+
  `<ellipse cx="36" cy="44" rx="3.5" ry="2" fill="#ff8fa3" opacity=".3"/><ellipse cx="64" cy="44" rx="3.5" ry="2" fill="#ff8fa3" opacity=".3"/>`;
}
function ppPlantArt(red,p){p=p||'pp';const fl=`url(#${p}F${red?'red':'white'})`,st=red?'#a51f22':'#bdb5a6';
  const flower=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-8" rx="6" ry="8" fill="${fl}" stroke="${st}" stroke-width="1" transform="rotate(${a})"/>`).join('')}<circle r="4.6" fill="#f4b13a" stroke="#c98a12" stroke-width="1"/><circle cx="-1.2" cy="-1.2" r="1.4" fill="#fff3b0"/></g>`;
  const leaf=(x,y,a)=>`<g transform="translate(${x} ${y}) rotate(${a})">${[-34,0,34].map(r=>`<path d="M0 0c-7-6-7-16 0-22 7 6 7 16 0 22z" fill="url(#${p}Leaf)" stroke="#2a7a33" stroke-width="1" transform="rotate(${r})"/>`).join('')}</g>`;
  return `<ellipse cx="50" cy="94" rx="30" ry="5" fill="#6b4a2c" opacity=".55"/><path d="M50 92V58M50 80q-14-6-20-22M50 76q14-6 22-20" stroke="#3f8a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`+
    leaf(30,64,-40)+leaf(72,62,40)+leaf(50,88,0)+flower(50,44,1.15)+flower(28,54,.85)+flower(73,52,.85);
}
function ppDog(geno,L,o){
  o=o||{};const s=o.s||64,dom=geno&&geno.indexOf(L.dom)>=0;
  const body=L.kind==='plant'?ppPlantArt(geno?dom:true):ppPupArt(geno?(dom?'black':'brown'):'grey',o);
  return svgEl(`<svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true" class="ppart">${body}</svg>`);
}
const ppPheno=(g,L)=>g.indexOf(L.dom)>=0?L.domN:L.recN;
function ppParents(G){const L=G.L,S=G.st;if(L.pair)return L.pair;if(!S.pick)return null;return [L.choose.dogs.find(d=>d.n===S.pick.M),L.choose.dogs.find(d=>d.n===S.pick.F)];}
function ppCard(d,L,known,extra){extra=extra||{};
  return h('div',{class:'ppdog'+(extra.cls?' '+extra.cls:'')},ppDog(d.g,L,{s:extra.s||78,collar:d.s==='M'?'#2f6bff':d.s==='F'?'#e2487a':null}),
    h('b',null,d.n),h('small',null,d.s==='M'?h('i',{class:'ppsex m'},'♂'):d.s==='F'?h('i',{class:'ppsex f'},'♀'):null,ppPheno(d.g,L)),h('span',{class:'ppg'+(known?'':' unk')},known?d.g:'?'));}

/* ---------------- the Punnett square (drag the parents' letters into the boxes) ---------------- */
function ppSquare(G,P,kn){
  const L=G.L,S=G.st,step=L.steps[S.step],sqStep=!!(step&&step.t==='square')&&!G.done,g1=P[0].g,g2=P[1].g,checked=S.sqDone&&!ngT();
  const tok=(a,who,known)=>known?h('span',{class:'pptok'+(sqStep?'':' off')+(a===L.dom?' dom':' rec'),'data-a':a,'aria-label':`${who}'s allele ${a}. Drag it into a box.`,tabindex:sqStep?'0':'-1'},a):h('span',{class:'pptok unk'},'?');
  const cell=(r,c)=>{const v=S.sq[r][c],bad=S.sqBad&&S.sqBad[r][c],shown=v.length===2?ppGeno(v[0],v[1]):v;
    const kids=[0,1].map(i=>h('span',{class:'ppslot'+(shown[i]?' set':'')},shown[i]||''));
    if(checked&&v.length===2)kids.push(h('i',{class:'ppcoat',style:`background:${L.kind==='plant'?(shown.indexOf(L.dom)>=0?'#e2483f':'#f6f2ea'):(shown.indexOf(L.dom)>=0?'#2b2b33':'#a8642c')}`,title:ppPheno(shown,L)}));
    return h('div',{class:'ppcell'+(v.length===2?' full':'')+(bad?' bad':'')+(checked?' done':''),'data-r':r,'data-c':c,role:'button',tabindex:sqStep&&v?'0':'-1',
      'aria-label':`Box row ${r+1} column ${c+1}: ${v?v.split('').join(' and '):'empty'}.${sqStep&&v?' Press to clear it.':''}`,
      onclick:()=>ppClearCell(r,c),onkeydown:e=>{if((e.key==='Enter'||e.key==='Backspace'||e.key==='Delete')&&!document.querySelector('.art-picked')){e.preventDefault();ppClearCell(r,c);}}},...kids);};
  return h('div',{class:'ppsqwrap'},h('div',{class:'ppsq'+(sqStep?' live':'')},
    h('div',{class:'ppcorner'},h('span',null,P[1].n+' →'),h('span',null,P[0].n+' ↓')),
    tok(g2[0],P[1].n,kn(P[1])),tok(g2[1],P[1].n,kn(P[1])),
    tok(g1[0],P[0].n,kn(P[0])),cell(0,0),cell(0,1),
    tok(g1[1],P[0].n,kn(P[0])),cell(1,0),cell(1,1)));
}
let PP_DRAG=null,ppLastDrop=0;
function ppDragInit(){
  if(PP_DRAG)PP_DRAG.destroy();
  PP_DRAG=Art.drag({root:$('ngGrid'),items:'.pptok:not(.off):not(.unk)',targets:'.ppcell',
    accept:(it,t)=>{if(!G||G.key!=='pup'||G.done)return false;const st=G.L.steps[G.st.step];return !!(st&&st.t==='square')&&G.st.sq[+t.dataset.r][+t.dataset.c].length<2;},
    label:it=>it.getAttribute('aria-label')||'allele',
    onDrop:(it,t)=>ppDrop(+t.dataset.r,+t.dataset.c,it.dataset.a)});
}
function ppDrop(r,c,a){
  if(!G||G.key!=='pup'||G.done)return;const S=G.st;if(S.sq[r][c].length>=2)return;
  ppLastDrop=Date.now();S.sq[r][c]+=a;S.sqBad=null;S.msg=null;ngRender();
  const el=$('ngMain').querySelector(`.ppcell[data-r="${r}"][data-c="${c}"]`);
  if(el){Art.pop(el,1.07);const sl=el.querySelectorAll('.ppslot.set');sl.forEach(x=>x.classList.add('in'));}
  if(S.sq.flat().every(v=>v.length===2)&&!ngT())ngSay('All 4 boxes are full. Press **Check my square**.');
}
function ppClearCell(r,c){
  if(!G||G.key!=='pup'||G.done||Date.now()-ppLastDrop<450)return;const S=G.st,st=G.L.steps[S.step];
  if(!st||st.t!=='square'||!S.sq[r][c])return;S.sq[r][c]='';S.sqBad=null;S.msg=null;ngRender();
}

/* ---------------- the whelping box: litter reveal + compare with the prediction ---------------- */
function ppDen(G){
  const L=G.L,S=G.st,pl=L.kind==='plant';
  if(pl)return h('div',{class:'ppden plant'},h('div',{class:'osl'},'Two ways to make new plants'),
    h('div',{class:'ppways'},
      h('div',{class:'ppway'},h('div',{class:'ppwayart'},ppDog('Rr',L,{s:62}),h('i',{class:'pprun'}),ppDog('Rr',L,{s:46})),h('b',null,'Runner'),h('small',null,'1 parent → a copy')),
      h('div',{class:'ppway'},h('div',{class:'ppwayart'},ppDog('Rr',L,{s:46}),h('span',{class:'ppx sm'},'×'),ppDog('Rr',L,{s:46})),h('b',null,'Seeds'),h('small',null,'2 parents → a mix'))));
  if(L.past&&!S.litter){const n=L.past.length,rec=L.past.filter(g=>g.indexOf(L.dom)<0).length;
    return h('div',{class:'ppden'},h('div',{class:'osl'},'Their last litter'),h('div',{class:'pplitter'},...L.past.map(g=>h('div',{class:'pppup shown'},ppDog(g,L,{s:58}),h('small',null,ppPheno(g,L))))),
      h('div',{class:'ppsum'},`${rec} of ${n} pups came out ${L.recN}. That is your evidence!`));}
  if(!S.litter){
    const will=L.steps.some(s=>s.t==='breed');
    return h('div',{class:'ppden empty'},h('div',{class:'osl'},'Whelping box'),h('div',{class:'ppbasket'},
      h('div',{class:'ppghosts'},...Array.from({length:8},()=>h('i'))),h('p',null,will?'8 puppies will be born here. Predict first!':'No litter yet.')));}
  const anim=S.justBorn&&!Art.reduced();S.justBorn=false;
  const n=S.litter.length,rec=S.litter.filter(g=>g.indexOf(L.dom)<0).length,pct=Math.round(rec/n*100);
  const pups=S.litter.map((g,i)=>h('div',{class:'pppup'+(anim?' born':' shown'),style:`--d:${i*.2}s`},ppDog(g,L,{s:58}),h('small',null,g)));
  const bar=(lab,val,cls,txt)=>h('div',{class:'ppbar'},h('span',null,lab),h('span',{class:'ppbt'},h('i',{class:cls,style:`width:${val}%`})),h('b',null,txt));
  const cmp=h('div',{class:'ppcmp'+(anim?' late':'')},
    S.chance!=null?bar('Predicted',S.chance,'pred',`${S.chance}% ${L.recN}`):null,
    bar('This litter',pct,'got',`${rec} of ${n} ${L.recN}`),
    h('p',null,S.chance!=null?`The square said about ${Math.round(S.chance/100*n)} of ${n}. `:'',`Real litters vary: every pup is a new chance, like a coin flip.`));
  if(anim)S.litter.forEach((g,i)=>setTimeout(()=>{const el=$('ngMain').querySelectorAll('.pppup')[i];if(el)Art.burstAt(el,{n:8,colors:['#ffd23f','#fff','#ff9fb8'],shape:['star','dot'],speed:150});},i*200+250));
  return h('div',{class:'ppden'},h('div',{class:'osl'},'The litter is born!'),h('div',{class:'pplitter'},...pups),cmp);
}
function ppSide(G){
  const L=G.L,S=G.st,step=L.steps[S.step];
  const prog=h('div',{class:'ppsteps'},...L.steps.map((s,k)=>h('span',{class:'ppst'+(k<S.step?' ok':k===S.step?' on':'')},({parents:'Parents',square:'Square',pct:'Predict',breed:'Breed',genos:'Genotype',mc:'Explain'})[s.t])));
  const box=[];
  if(!step)box.push(h('div',{class:'ppdone'},'✓ All steps done!'));
  else if(step.t==='parents')box.push(h('div',{class:'mwtask pptask'},h('span',{class:'mwflag ppflag'},I('paw')),h('div',null,h('b',null,'Choose the parents'),h('small',null,L.choose.goal))),h('p',{class:'pphow'},'Tap one ♂ and one ♀ in the kennel.'),ngBtn('These two!',ppCheckParents,'good',{disabled:!S.pick.M||!S.pick.F||G.done,style:'width:100%'}));
  else if(step.t==='square')box.push(h('div',{class:'mwtask pptask'},h('span',{class:'mwflag ppflag'},'Aa'),h('div',null,h('b',null,'Fill the Punnett square'),h('small',null,...ngRich('Drag each parent’s letters into the boxes. Every box gets **one letter from its row** and **one from its column**.')))),h('p',{class:'pphow'},'Or tap a letter, then tap a box. Tap a full box to clear it.'),ngBtn('Check my square',ppCheckSquare,'good',{disabled:S.sq.flat().some(v=>v.length<2)||G.done,style:'width:100%'}));
  else if(step.t==='pct')box.push(h('p',{class:'ppq'},step.q),ngChoices(PP_PCT,S.pct,v=>{S.pct=v;S.msg=null;ngRender();},{label:step.q,locked:G.done}),ngBtn('Lock in my prediction',ppCheckPct,'good',{disabled:S.pct==null||G.done,style:'width:100%;margin-top:6px'}));
  else if(step.t==='genos')box.push(h('p',{class:'ppq'},step.q),ngChoices([[L.dom+L.dom,L.dom+L.dom],[L.dom+L.rec,L.dom+L.rec],[L.rec+L.rec,L.rec+L.rec]],S.geno,v=>{S.geno=v;S.msg=null;ngRender();},{locked:G.done}),ngBtn('Check',ppCheckGeno,'good',{disabled:!S.geno||G.done,style:'width:100%;margin-top:6px'}));
  else if(step.t==='mc')box.push(h('p',{class:'ppq'},step.q),h('div',{class:'ppmc'},...step.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.mc===v?' on':''),disabled:G.done,onclick:()=>{S.mc=v;S.msg=null;ngRender();}},t))),ngBtn('Check',ppCheckMc,'good',{disabled:!S.mc||G.done,style:'width:100%;margin-top:6px'}));
  else if(step.t==='breed')box.push(h('p',{class:'ppq'},S.chance!=null?`Your prediction (${S.chance}% ${L.recN}) is locked in. Time to see the puppies!`:'Time to see the puppies!'),ngBtn([I('paw'),' Breed!'],ppBreed,'good',{style:'width:100%;font-size:18px',disabled:G.done}));
  return [prog,...box,S.msg?h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])):null];
}
ngDef({key:'pup',name:'Pup Predictor',ic:'paw',std:'MS-LS3-2',subj:'life',
  short:'Use Punnett squares to predict traits, then breed.',menuDesc:'Pick the parents, drag their alleles into the Punnett square and predict the chances. Then watch a litter of 8 puppies be born and compare.',
  intro:'Traits pass from parents to offspring through genes. Use Punnett squares to predict the chance of each trait, choose the best parents, and solve family mysteries. Every litter is real chance, so predict the odds, not the exact pups. No mistakes earns 3 stars.',
  how:['**Read the goal** and choose parents when asked.','**Drag the letters** into the Punnett square: one from the row parent and one from the column parent in every box.','**Predict the chance**, then breed and compare the litter of 8 with your prediction.'],
  levels:PP_LEVELS,packs:PP_PACKS,cap3:true,
  mini:L=>{const w=h('span',{class:'ppmini'});w.append(ppDog(L.kind==='plant'?'Rr':'Bb',L,{s:30}),ppDog(L.kind==='plant'?'rr':'bb',L,{s:30}));return w;},
  start(G){G.st={step:0,pick:L0(G.L),sq:[['',''],['','']],sqBad:null,pct:null,mc:null,geno:null,litter:null,msg:null,stepOK:false};ppDefs();ppDragInit();},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,P=ppParents(G),step=L.steps[S.step],kn=d=>d.k||S.revealed;
    const fam=[];
    if(L.choose&&(!S.pick.M||!S.pick.F||(step&&step.t==='parents'))){
      fam.push(h('div',{class:'osl'},'Kennel'),h('div',{class:'ppkennel'},...L.choose.dogs.map(d=>{const on=S.pick[d.s]===d.n,fixed=L.choose.fixed===d.n;
        return h('button',{type:'button',class:'ppkbtn'+(on?' on':''),disabled:G.done||(fixed&&on)||!step||step.t!=='parents','aria-pressed':on?'true':'false','aria-label':`${d.n}, ${d.s==='M'?'male':'female'}, ${ppPheno(d.g,L)}, ${kn(d)?d.g:'genotype unknown'}`,
          onclick:()=>{S.pick[d.s]=on&&!fixed?null:d.n;S.msg=null;ngRender();const b=$('ngMain').querySelector(`.ppkbtn[aria-pressed="true"]`);if(!on&&b)Art.pop(b,1.06);}},ppCard(d,L,kn(d),{s:66}));})));}
    else if(P&&P[0]&&P[1])fam.push(h('div',{class:'pppair'},ppCard(P[0],L,kn(P[0])),h('span',{class:'ppx'},'×'),ppCard(P[1],L,kn(P[1]))));
    if(P&&P[0]&&P[1]&&!(step&&step.t==='parents')){const si=L.steps.findIndex(s=>s.t==='square');if(si>=0&&si<=S.step)fam.push(ppSquare(G,P,kn));}
    ngRC(main,h('div',{class:'ppboard'+(L.kind==='plant'?' plant':'')},h('div',{class:'ppfam'},...fam),ppDen(G)));
    ngRC(side,...ppSide(G));
    if(step&&!S.msg)ngSay(({parents:'Choose the parents. Think about which alleles each one can pass on.',square:'Drag the letters into the Punnett square: one from each parent in every box.',pct:'Count the boxes to find the chance.',breed:'Now see what really happens.',genos:'Use the offspring as evidence.',mc:'Explain what you saw.'})[step.t]);
  },
  hints(G){const L=G.L,P=ppParents(G);
    return [L.clue,'Capital letter = dominant allele: it shows if there is at least one. Lowercase = recessive: it only shows with two (bb). Each box in the square is 1 chance out of 4 = 25%.',
      P&&P[0]&&P[1]?`${P[0].n} is ${P[0].g} and ${P[1].n} is ${P[1].g}. The square is: ${ppCells(P[0].g,P[1].g).flat().join(', ')}.`+(L.choose?` Best parents: ${L.choose.best.map(b=>b.join(' + ')).join(' or ')}.`:''):L.choose?`Best parents: ${L.choose.best.map(b=>b.join(' + ')).join(' or ')}.`:''];}
});
function L0(L){return L.choose?{M:L.choose.fixed||null,F:null}:{};}
function ppNext(msgOK){const S=G.st;if(ngT()){if(msgOK)ngTRound(true);msgOK=null;}S.msg=msgOK?['ok',msgOK]:null;S.step++;S.pct=null;S.mc=null;S.geno=null;S.sqBad=null;
  if(S.step>=G.L.steps.length){const wait=!ngT()&&S.bornAt&&Date.now()-S.bornAt<1500&&!Art.reduced();ngRender();const m=G.miss;G.detail={mistakes:m};
    const fin=()=>{ngSay(m?'Done! Check the steps where you slipped.':'Perfect genetics!','go');ngWin(ngStars(m,0,2),['You finished with ',h('b',null,m),` mistake${m===1?'':'s'}.`]);};
    if(!wait)return fin();
    G.done=true;ngHintUI();ngSay('Look at the litter. Does it match your prediction?');const g0=G;setTimeout(()=>{if(G!==g0)return;G.done=false;fin();},2700);return;}
  ngRender();}
function ppMiss(t){if(ngT()){const S=G.st,st=G.L.steps[S.step];ngTRound(false);tstSaved();
    if(st.t==='parents'){G.t.n+=G.L.steps.slice(S.step+1).filter(x=>x.t!=='breed').length;return ngTDone();}return ppNext(null);}
  G.miss++;G.tries++;G.st.msg=['no',t];fx.pop({icon:'paw',text:'Not quite',kind:'oops'});ngRender();ngSay(t,'alert');}
function ppCheckParents(){
  const L=G.L,S=G.st,C=L.choose,ok=C.best.some(([m,f])=>S.pick.M===m&&S.pick.F===f);
  if(ok){ppNext(C.why||'Great choice! Those parents give the best chance.');return;}
  const M=C.dogs.find(d=>d.n===S.pick.M),F=C.dogs.find(d=>d.n===S.pick.F);
  if(C.why)return ppMiss(C.why);
  const p=ppPctOf(M.g,F.g,C.test);
  ppMiss(`${M.n} (${M.g}) × ${F.n} (${F.g}) gives a ${p}% chance. Another pair does better. Think about which alleles each parent can pass on.`);
}
function ppCheckSquare(){
  const S=G.st,P=ppParents(G),c=ppCells(P[0].g,P[1].g);
  const bad=S.sq.map((r,i)=>r.map((v,j)=>ppGeno(v[0],v[1])!==c[i][j]));
  if(bad.flat().some(Boolean)){S.sqBad=bad;ppMiss('Some boxes are wrong (red). Each box gets the letter at the start of its row plus the letter at the top of its column.');return;}
  S.sqDone=1;ppNext('Square checked! Now count the boxes.');
}
function ppCheckPct(){const S=G.st,st=G.L.steps[S.step];if(S.pct===st.ans){if(st.rec)S.chance=st.ans;ppNext('Right! '+st.why);}else ppMiss('Not quite. Count how many of the 4 boxes give that trait. Each box is a 25% chance.');}
function ppCheckMc(){const S=G.st,st=G.L.steps[S.step];if(S.mc===st.ans)ppNext('Right! '+st.why);else ppMiss('Not quite. '+st.why);}
function ppCheckGeno(){const S=G.st,st=G.L.steps[S.step];if(S.geno===st.ans){S.revealed=true;ppNext('Right! '+st.why);}else ppMiss('Not quite. '+st.why);}
function ppBreed(){
  const L=G.L,S=G.st,P=ppParents(G);
  if(L.litter)S.litter=L.litter.slice();
  else{const opts=ppCells(P[0].g,P[1].g).flat();S.litter=Array.from({length:8},()=>opts[Math.floor(Math.random()*4)]);}
  S.justBorn=true;S.bornAt=Date.now();fx.pop({icon:'paw',text:'Puppies!',kind:'great'});ppNext(null);
}
NGTHUMB.pup=()=>{
  let t=ppDefsMarkup('tp')+`<radialGradient id="tpg" cx=".5" cy=".2" r="1"><stop offset="0" stop-color="#c2895a"/><stop offset="1" stop-color="#6a3a16"/></radialGradient>`;
  t+=`<rect width="320" height="180" fill="url(#tpg)"/><rect x="194" y="34" width="108" height="108" rx="12" fill="#fffaf0" stroke="#13203d" stroke-width="3"/><path d="M248 34v108M194 88h108" stroke="#13203d" stroke-width="2.5" opacity=".6"/>`;
  [['BB',221,70],['Bb',275,70],['Bb',221,124],['bb',275,124]].forEach(([g,x,y])=>{t+=`<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,Arial" font-weight="900" font-size="22" fill="${g==='bb'?'#9a5b2a':'#13203d'}">${g}</text>`;});
  t+=`<g transform="translate(6 30) scale(1.2)">${ppPupArt('black',{collar:'#2f6bff'},'tp')}</g><g transform="translate(92 62) scale(1.05)">${ppPupArt('brown',{},'tp')}</g>`+ngStar(300,20,8)+ngStar(178,26,6,'#fff',.7);
  return ngWrap('pup','#8a4a1c',t);
};
