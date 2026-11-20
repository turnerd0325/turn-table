/* ================= LIFE 2: RIPPLE (MS-LS2-2, LS2-3, LS2-4) =================
   "Pull the thread." The food web is a living scene: each population is a crowd of animals
   with a number. The student drags the change in (a card onto the web), predicts by dragging
   each population's arrow up, flat or down, then runs the season: the change ripples out one
   step at a time along the arrows. Wrong predictions point at the step where the reasoning broke.
   Levels 7 and 9 are goal levels: pick the ONE action that reaches the goal, then predict.
   Pre/Post-Test (levels 2, 5, 8): same change + predictions, one try, no ripple shown. */

/* ---------------- illustrated sprites (100 x 100 box, facing right) ---------------- */
const rpLG=(id,a,b,x2,y2)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2||0}" y2="${y2==null?1:y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const rpRG=(id,a,b,cx,cy,r)=>`<radialGradient id="${id}" cx="${cx==null?.4:cx}" cy="${cy==null?.35:cy}" r="${r||.7}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const rpSh=(c,a)=>Art.shade(c,a);
const rpShadow=(rx,y)=>`<ellipse cx="50" cy="${y||91}" rx="${rx||28}" ry="4" fill="#0b1430" opacity=".2"/>`;
const rpEye=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r||2.8}" fill="#141a2e"/><circle cx="${x+r*.35||x+1}" cy="${y-(r||2.8)*.4}" r="${(r||2.8)*.38}" fill="#fff"/>`;
function rpCanid(u,c,belly,tip){const o=rpSh(c,-.5);
  return `<defs>${rpLG(u+'b',rpSh(c,.25),rpSh(c,-.2))}</defs>${rpShadow(30)}
<path d="M27 50C14 46 6 54 3 66c9-1 17-5 24-11z" fill="url(#${u}b)" stroke="${o}" stroke-width="2" stroke-linejoin="round"/><path d="M8 62c-3 2-4 4-5 4 3 0 6-1 9-3z" fill="${tip}"/>
<g stroke="${rpSh(c,-.35)}" stroke-width="6" stroke-linecap="round"><path d="M33 60l-3 26M62 60l1 26"/></g>
<path d="M24 50c0-9 9-13 20-13h18c9 0 13 6 13 14s-6 13-14 13H36c-7 0-12-6-12-14z" fill="url(#${u}b)" stroke="${o}" stroke-width="2.2"/>
<path d="M34 60c10 5 22 5 32 0v2c-8 4-24 4-32 0z" fill="${belly}"/>
<g stroke="${c}" stroke-width="6" stroke-linecap="round"><path d="M39 61l1 26M68 59l2 27"/></g>
<g fill="#2a2320"><ellipse cx="41" cy="88" rx="4" ry="2"/><ellipse cx="71" cy="88" rx="4" ry="2"/></g>
<path d="M66 46c-2-11 5-19 13-19l2-9 6 9c5 1 9 6 12 11-4 4-10 5-16 6-7 2-13 5-17 2z" fill="url(#${u}b)" stroke="${o}" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M76 27l1-10 6 9z" fill="${rpSh(c,-.35)}"/><path d="M82 44c6 0 12-1 16-4-3 4-8 7-15 8z" fill="${belly}"/>
<circle cx="98" cy="39.5" r="2.6" fill="#1b1512"/>${rpEye(84,34,2.6)}`;}
function rpDeer(u,c,kind){const o=rpSh(c,-.5),elk=kind==='elk';
  const ant=elk?`<path d="M80 12C76 4 70 0 62 0M72 4l-2-6M68 1l-6-3M80 12c2-6 8-9 14-9M88 4l2-5" stroke="#7a5a36" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    :`<path d="M81 13c-2-6 0-11 5-13M83 6l5-2M80 9l-5-4" stroke="#8a6a44" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  return `<defs>${rpLG(u+'b',rpSh(c,.25),rpSh(c,-.2))}</defs>${rpShadow(30,92)}
<g stroke="${rpSh(c,-.3)}" stroke-width="4.5" stroke-linecap="round"><path d="M31 56l-3 33M63 56l-2 33"/></g>
<path d="M22 46c0-8 8-12 18-12h20c9 0 14 6 14 12s-5 12-14 12H34c-8 0-12-5-12-12z" fill="url(#${u}b)" stroke="${o}" stroke-width="2.2"/>
<path d="M30 55c12 4 28 4 40-1v3c-12 3-28 3-40 0z" fill="#f4ead8"/>
<g stroke="${c}" stroke-width="4.5" stroke-linecap="round"><path d="M37 57l1 32M69 55l1 34"/></g>
<g fill="#2a2320"><rect x="25" y="88" width="5" height="3" rx="1"/><rect x="36" y="88" width="5" height="3" rx="1"/><rect x="59" y="88" width="5" height="3" rx="1"/><rect x="68" y="88" width="5" height="3" rx="1"/></g>
<path d="M63 40c2-10 6-17 12-22l8 4c-4 8-7 16-9 24z" fill="${elk?rpSh(c,-.3):`url(#${u}b)`}" stroke="${o}" stroke-width="2"/>
<path d="M74 18c4-6 12-6 16-2l6 6c0 4-4 5-8 4-4 0-8-2-12-2z" fill="url(#${u}b)" stroke="${o}" stroke-width="2" stroke-linejoin="round"/>
<path d="M77 16l-7-7 9 4z" fill="${rpSh(c,-.2)}" stroke="${o}" stroke-width="1.4"/>${kind==='doe'?'':ant}
<circle cx="95.5" cy="22.5" r="1.8" fill="#1b1512"/>${rpEye(84,18,2.2)}<path d="M22 42c-4-2-6 2-4 5z" fill="#fff"/>`;}
function rpFish(u,c,belly,pat){const o=rpSh(c,-.5);
  const body='M12 50C22 32 50 26 70 35c7 3 12 8 14 15-2 7-7 12-14 15-20 9-48 3-58-15z';
  const marks=pat==='bars'?[30,42,54,64].map(x=>`<path d="M${x} 30c-2 8-2 32 0 40" stroke="${rpSh(c,-.45)}" stroke-width="5" opacity=".55"/>`).join('')
    :pat==='trout'?`<path d="M14 52c20 3 44 3 68-2" stroke="#ff8fa3" stroke-width="6" opacity=".7" fill="none"/>`+[[28,40],[38,36],[48,41],[58,37],[66,43],[34,58],[46,60],[60,58]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#2b2a1c"/>`).join('')
    :`<path d="M14 50c22 2 46 2 70 0" stroke="${rpSh(c,-.4)}" stroke-width="3" opacity=".6" fill="none"/>`;
  return `<defs>${rpLG(u+'b',rpSh(c,-.1),belly)}<clipPath id="${u}c"><path d="${body}"/></clipPath></defs>${rpShadow(28,90)}
<path d="M16 50L0 32c-2 6-2 30 0 36z" fill="${rpSh(c,-.15)}" stroke="${o}" stroke-width="2" stroke-linejoin="round"/>
<path d="M42 31c4-9 14-13 22-11-3 6-6 11-8 15z" fill="${rpSh(c,-.2)}" stroke="${o}" stroke-width="1.6"/>
<path d="${body}" fill="url(#${u}b)" stroke="${o}" stroke-width="2.2"/><g clip-path="url(#${u}c)">${marks}</g>
<path d="M62 38c-3 8-3 16 0 24" stroke="${o}" stroke-width="1.6" fill="none" opacity=".5"/>
<path d="M44 58c4 6 9 9 15 9-3-3-5-7-5-11z" fill="${rpSh(c,-.15)}"/>${rpEye(74,45,3.4)}
<path d="M28 38c10-6 24-8 36-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".5"/>`;}
function rpTree(u,leaf,extra,trunk){return `<defs>${rpRG(u+'l',rpSh(leaf,.3),rpSh(leaf,-.3),.4,.3,.75)}${rpLG(u+'t',rpSh(trunk||'#7a5233',.15),rpSh(trunk||'#7a5233',-.25),1,0)}</defs>${rpShadow(26,92)}
<path d="M44 92c3-12 3-26 2-40h9c-1 14-1 28 2 40z" fill="url(#${u}t)" stroke="#4a3220" stroke-width="2"/>
<g stroke="${rpSh(leaf,-.5)}" stroke-width="2.2" fill="url(#${u}l)"><circle cx="34" cy="44" r="18"/><circle cx="66" cy="44" r="18"/><circle cx="50" cy="28" r="21"/><circle cx="50" cy="50" r="17"/></g>
<g fill="${rpSh(leaf,-.25)}" opacity=".5"><circle cx="40" cy="52" r="5"/><circle cx="62" cy="34" r="4"/><circle cx="56" cy="56" r="4"/></g>
<g fill="#fff" opacity=".35"><circle cx="42" cy="20" r="5"/><circle cx="28" cy="38" r="3.5"/></g>${extra||''}`;}
const RP_SPR={
  heron:u=>`<defs>${rpLG(u+'b','#b9c8dc','#6d819f')}</defs>${rpShadow(18,93)}
<g stroke="#c9a23a" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M44 62l-3 30M41 92h-6M52 62l4 30M56 92h6"/></g>
<path d="M22 56L6 64l14-1z" fill="#8798b4" stroke="#55657f" stroke-width="1.6"/>
<path d="M22 56c6-15 30-19 40-9 4 4 2 14-6 17-12 6-26 3-34-8z" fill="url(#${u}b)" stroke="#4d5d78" stroke-width="2.2"/>
<path d="M58 49c12-8 2-18 8-26" stroke="#4d5d78" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M58 49c12-8 2-18 8-26" stroke="#eef3fa" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M60 38c3-2 4-6 3-9" stroke="#55657f" stroke-width="1.6" fill="none" stroke-dasharray="2 2"/>
<circle cx="68" cy="20" r="7" fill="#eef3fa" stroke="#4d5d78" stroke-width="2"/><path d="M73 17l23 4-23 3z" fill="#f2c230" stroke="#b08414" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M66 14l-14-4 15 7z" fill="#26324a"/>${rpEye(70,18.5,1.9)}<path d="M30 54c8-8 22-8 28-2-8 6-20 8-28 2z" fill="#5f7392" opacity=".8"/>`,
  hawk:u=>`<defs>${rpLG(u+'b','#a8703c','#5c3a1c')}${rpRG(u+'c','#fff8ea','#ead2a8')}</defs>
<path d="M10 88h80" stroke="#6b4a2c" stroke-width="6" stroke-linecap="round"/><path d="M70 88l10-8" stroke="#6b4a2c" stroke-width="4" stroke-linecap="round"/>
<path d="M42 78l-7 12h16l-1-12z" fill="#b8572a" stroke="#5c2e14" stroke-width="1.8"/>
<path d="M36 34c10-10 28-6 30 10 2 16-6 32-18 38-10-8-16-30-12-48z" fill="url(#${u}b)" stroke="#3e2712" stroke-width="2.2"/>
<path d="M50 40c8 2 12 12 10 24-2 8-6 13-10 16-5-8-6-26 0-40z" fill="url(#${u}c)"/>
<g stroke="#a8703c" stroke-width="1.6" stroke-linecap="round"><path d="M53 52v3M57 58v3M52 63v3M56 68v2"/></g>
<path d="M36 36c-6 14-4 34 10 46l-8 2c-10-12-12-32-2-48z" fill="#4a2d14" stroke="#2e1b0a" stroke-width="1.6"/>
<circle cx="56" cy="27" r="12" fill="url(#${u}b)" stroke="#3e2712" stroke-width="2.2"/><path d="M48 31c6 4 14 4 18-1-2 6-8 9-14 8z" fill="#f4e6cc"/>
<path d="M66 24c6 0 9 4 7 10l-5-4-4 1z" fill="#ffd166" stroke="#6b5a2a" stroke-width="1.4" stroke-linejoin="round"/>
<circle cx="60" cy="24" r="3.4" fill="#ffcf3f"/><circle cx="60.6" cy="24" r="2" fill="#141a2e"/><path d="M54 20l9 1" stroke="#3e2712" stroke-width="2"/>
<g stroke="#e6b422" stroke-width="2.6" stroke-linecap="round"><path d="M46 82v6M54 82v6"/></g>`,
  fox:u=>rpCanid(u,'#e8742a','#fff5ea','#fff'),
  coyote:u=>rpCanid(u,'#b99568','#f1e6d2','#3a2c1f'),
  wolf:u=>rpCanid(u,'#7d8794','#e7ebf0','#2c3138'),
  deer:u=>rpDeer(u,'#b9773f','deer'),
  elk:u=>rpDeer(u,'#c99b62','elk'),
  rabbit:u=>`<defs>${rpLG(u+'b','#d8c3a8','#9c8264')}</defs>${rpShadow(26,91)}
<path d="M62 40c-6-16-4-30 1-33 5 1 8 16 6 32z" fill="url(#${u}b)" stroke="#5e4a34" stroke-width="2"/>
<path d="M68 40c0-16 6-28 11-29 4 3 1 17-5 30z" fill="url(#${u}b)" stroke="#5e4a34" stroke-width="2"/><path d="M72 38c1-10 4-19 6-21" stroke="#f2b1b8" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="44" cy="66" rx="25" ry="20" fill="url(#${u}b)" stroke="#5e4a34" stroke-width="2.2"/>
<circle cx="35" cy="70" r="14" fill="#a88b6b" opacity=".55"/><ellipse cx="34" cy="86" rx="12" ry="4" fill="#9c8264" stroke="#5e4a34" stroke-width="1.8"/>
<circle cx="19" cy="62" r="7" fill="#fff" stroke="#c9bba8" stroke-width="1.4"/>
<circle cx="68" cy="50" r="14" fill="url(#${u}b)" stroke="#5e4a34" stroke-width="2.2"/><ellipse cx="62" cy="84" rx="6" ry="4" fill="#cdb79a" stroke="#5e4a34" stroke-width="1.6"/>
<path d="M66 58c6 3 12 2 15-2" fill="none" stroke="#f4ead8" stroke-width="4" stroke-linecap="round"/><circle cx="81" cy="51" r="2.2" fill="#e88a9a"/>${rpEye(72,46,2.6)}
<path d="M82 54l8 1M82 56l8 3" stroke="#5e4a34" stroke-width=".9"/>`,
  squirrel:u=>`<defs>${rpLG(u+'b','#c46a35','#7c3b18')}${rpLG(u+'t','#d98a52','#8a4420',1,0)}</defs>${rpShadow(24,91)}
<path d="M40 86C16 84 8 60 16 40 22 24 40 18 48 30c-9 4-16 14-14 28 2 12 8 18 6 28z" fill="url(#${u}t)" stroke="#5c2a10" stroke-width="2.2"/>
<path d="M24 40c4-10 12-14 18-12" stroke="#f0b27a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
<ellipse cx="54" cy="64" rx="16" ry="21" fill="url(#${u}b)" stroke="#5c2a10" stroke-width="2.2"/><ellipse cx="58" cy="68" rx="8" ry="14" fill="#f4e0c6"/>
<ellipse cx="50" cy="86" rx="10" ry="4" fill="#9a4a20" stroke="#5c2a10" stroke-width="1.6"/>
<circle cx="64" cy="40" r="12" fill="url(#${u}b)" stroke="#5c2a10" stroke-width="2.2"/><path d="M58 31l2-9 5 8z" fill="#9a4a20" stroke="#5c2a10" stroke-width="1.4"/>
<circle cx="75" cy="43" r="2" fill="#2b160a"/>${rpEye(67,37,2.4)}
<ellipse cx="70" cy="60" rx="5" ry="6" fill="#a86a2c" stroke="#4a2a10" stroke-width="1.4"/><path d="M65 56h10c0-4-10-4-10 0z" fill="#6b4220"/>`,
  beaver:u=>`<defs>${rpLG(u+'b','#9a6538','#55331a')}</defs>${rpShadow(32,90)}
<path d="M22 70C10 66 2 72 3 80c4 6 16 4 24-4z" fill="#3e3a3a" stroke="#1f1c1c" stroke-width="2"/><path d="M6 76l16-4M8 80l14-3M10 72l8 6M15 70l5 9" stroke="#5a5555" stroke-width="1"/>
<path d="M18 62c0-15 16-24 34-24 18 0 28 10 28 22s-10 22-28 22-34-6-34-20z" fill="url(#${u}b)" stroke="#3a2210" stroke-width="2.2"/>
<path d="M32 70c4-6 12-8 20-6" stroke="#b07c4e" stroke-width="2" fill="none" opacity=".6"/>
<circle cx="76" cy="52" r="14" fill="url(#${u}b)" stroke="#3a2210" stroke-width="2.2"/><circle cx="70" cy="40" r="3.6" fill="#6a4222" stroke="#3a2210" stroke-width="1.4"/>
<ellipse cx="88" cy="55" rx="5" ry="4" fill="#7a5030"/><circle cx="92" cy="52" r="2.2" fill="#1b0f08"/>
<rect x="84" y="59" width="6" height="6" rx="1" fill="#ffb347" stroke="#7a4a10" stroke-width="1"/>${rpEye(79,48,2.4)}
<ellipse cx="66" cy="81" rx="7" ry="3.6" fill="#4a2a14"/><ellipse cx="38" cy="81" rx="8" ry="3.6" fill="#4a2a14"/>`,
  frog:u=>`<defs>${rpRG(u+'b','#8fe06a','#2f8a2c',.45,.3,.8)}</defs>${rpShadow(30,91)}
<path d="M26 74c-12 2-14 14-4 16h20c-6-4-10-8-8-13z" fill="#3f9b34" stroke="#1d5a1a" stroke-width="2"/>
<path d="M20 72c0-18 16-30 34-28 18 2 28 14 26 28-2 10-14 16-30 16S20 82 20 72z" fill="url(#${u}b)" stroke="#1d5a1a" stroke-width="2.4"/>
<path d="M36 80c8 4 22 4 32 0" stroke="#e9f7b0" stroke-width="5" stroke-linecap="round" opacity=".8"/>
<g fill="#2b7a28" opacity=".7"><circle cx="38" cy="60" r="4"/><circle cx="50" cy="54" r="3"/><circle cx="30" cy="70" r="3"/></g>
<path d="M66 82c4 4 10 6 14 4" stroke="#1d5a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<circle cx="58" cy="44" r="8" fill="url(#${u}b)" stroke="#1d5a1a" stroke-width="2.2"/><circle cx="72" cy="46" r="8" fill="url(#${u}b)" stroke="#1d5a1a" stroke-width="2.2"/>
<circle cx="59" cy="43" r="4.6" fill="#f7e86a"/><circle cx="73" cy="45" r="4.6" fill="#f7e86a"/><rect x="57.6" y="40.5" width="3" height="5" rx="1.5" fill="#141a2e"/><rect x="71.6" y="42.5" width="3" height="5" rx="1.5" fill="#141a2e"/>
<path d="M62 62c6 3 12 3 16-1" stroke="#1d5a1a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  snake:u=>`<defs>${rpLG(u+'b','#9ccc4a','#4f7f1e',1,1)}</defs>${rpShadow(34,90)}
<path d="M12 80c18 14 40 10 42-6 2-14-18-16-16-30 2-12 22-16 34-8" stroke="#2f5212" stroke-width="15" fill="none" stroke-linecap="round"/>
<path d="M12 80c18 14 40 10 42-6 2-14-18-16-16-30 2-12 22-16 34-8" stroke="url(#${u}b)" stroke-width="11" fill="none" stroke-linecap="round"/>
<path d="M12 80c18 14 40 10 42-6 2-14-18-16-16-30 2-12 22-16 34-8" stroke="#e6c94a" stroke-width="3" fill="none" stroke-dasharray="4 7" stroke-linecap="round"/>
<ellipse cx="76" cy="38" rx="11" ry="8" fill="#7fb03a" stroke="#2f5212" stroke-width="2.2" transform="rotate(18 76 38)"/>
<path d="M86 42l8 2-4 1 5 2" stroke="#e23b3b" stroke-width="1.8" fill="none" stroke-linecap="round"/>${rpEye(79,35,2.2)}`,
  hopper:u=>`<defs>${rpLG(u+'b','#a6dc5a','#4e8c22')}</defs>${rpShadow(30,88)}
<path d="M46 56L30 34l-5 3 14 22z" fill="#6aa832" stroke="#2f5a14" stroke-width="2"/><path d="M28 36L16 78" stroke="#2f5a14" stroke-width="3" stroke-linecap="round"/>
<path d="M18 58c10-10 42-12 58-7 7 2 7 9 0 11-16 5-46 4-58-4z" fill="url(#${u}b)" stroke="#2f5a14" stroke-width="2.2"/>
<path d="M30 52c14-5 30-5 40-2" stroke="#3d7418" stroke-width="2" fill="none"/><path d="M30 56c12 2 26 2 38 0" stroke="#d8f0a0" stroke-width="2" fill="none" opacity=".7"/>
<g stroke="#2f5a14" stroke-width="2" stroke-linecap="round" fill="none"><path d="M64 62l-4 14M70 61l4 15M56 62l-6 12"/><path d="M84 46c4-12 10-18 16-20M82 46c0-12 2-20 6-24"/></g>
<ellipse cx="80" cy="54" rx="9" ry="10" fill="url(#${u}b)" stroke="#2f5a14" stroke-width="2.2"/>${rpEye(83,51,2.6)}`,
  bee:u=>`<defs>${rpLG(u+'b','#ffd84a','#e09a10')}<clipPath id="${u}c"><ellipse cx="48" cy="58" rx="24" ry="17"/></clipPath>${rpLG(u+'w','#ffffff','#bfe4ff')}</defs>${rpShadow(22,90)}
<ellipse cx="42" cy="36" rx="12" ry="18" fill="url(#${u}w)" opacity=".85" stroke="#7aa6c8" stroke-width="1.6" transform="rotate(-25 42 36)"/>
<path d="M24 60l-8 2 8 2z" fill="#3a2a10"/>
<ellipse cx="48" cy="58" rx="24" ry="17" fill="url(#${u}b)" stroke="#5a3a06" stroke-width="2.2"/>
<g clip-path="url(#${u}c)" fill="#2a1d08"><rect x="30" y="38" width="7" height="40"/><rect x="44" y="38" width="7" height="40"/><rect x="58" y="38" width="6" height="40"/></g>
<ellipse cx="58" cy="34" rx="11" ry="17" fill="url(#${u}w)" opacity=".9" stroke="#7aa6c8" stroke-width="1.6" transform="rotate(15 58 34)"/>
<circle cx="76" cy="56" r="11" fill="#2f2410" stroke="#140d02" stroke-width="2"/><path d="M80 46c2-6 6-9 10-10M76 46c0-6 2-10 5-12" stroke="#140d02" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<circle cx="80" cy="54" r="3" fill="#fff"/><circle cx="80.8" cy="54" r="1.8" fill="#141a2e"/>`,
  flea:u=>`<defs>${rpRG(u+'b','#ffe2c8','#f08a5a',.45,.4,.8)}</defs>${rpShadow(18,92)}
<path d="M30 30C50 22 72 34 72 54 72 74 54 86 40 80 28 74 22 52 30 30z" fill="url(#${u}b)" stroke="#b0502a" stroke-width="2.2" opacity=".95"/>
<path d="M38 40c8 10 12 22 10 36" stroke="#b5532a" stroke-width="3" fill="none" opacity=".55"/><g fill="#e0613a" opacity=".5"><circle cx="54" cy="56" r="5"/><circle cx="58" cy="66" r="4"/></g>
<g stroke="#b0502a" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M32 34C20 28 14 18 12 10M20 28c-6 0-12-4-16-8M30 36c-10 0-18 4-22 10M16 38c-6 2-10 6-12 12"/><path d="M50 79l10 13"/></g>
<circle cx="35" cy="34" r="5" fill="#141a2e"/><circle cx="36.5" cy="32.5" r="1.6" fill="#fff"/>`,
  plankton:u=>`<defs>${rpLG(u+'b','#b9f1ff','#3fb2d6')}</defs>${rpShadow(22,90)}
<g stroke="#1f7fa0" stroke-width="2" fill="none" stroke-linecap="round"><path d="M30 46C40 22 70 14 96 18"/><path d="M30 54C40 78 70 86 96 82"/><path d="M64 50l18-6M64 52l18 6"/></g>
<path d="M22 50c0-12 22-16 38-8 8 4 8 12 0 16-16 8-38 4-38-8z" fill="url(#${u}b)" stroke="#1f7fa0" stroke-width="2.2"/>
<g stroke="#1f7fa0" stroke-width="1.4" opacity=".6"><path d="M36 41v18M44 40v20M52 42v16"/></g><circle cx="28" cy="48" r="3" fill="#e23b3b"/>`,
  minnow:u=>rpFish(u,'#8fa4b8','#eef4fa','line'),
  smallfish:u=>rpFish(u,'#e2b33a','#fff3c4','bars'),
  trout:u=>rpFish(u,'#8a8f4a','#f4ead0','trout'),
  zebra:u=>`<defs>${rpLG(u+'b','#f2e2bd','#b98f52',1,1)}<clipPath id="${u}c"><path d="M18 64C16 42 42 24 70 28c14 2 18 14 12 26-8 18-40 26-64 10z"/></clipPath></defs>${rpShadow(30,88)}
<path d="M18 64C16 42 42 24 70 28c14 2 18 14 12 26-8 18-40 26-64 10z" fill="url(#${u}b)" stroke="#5a3e1a" stroke-width="2.4"/>
<g clip-path="url(#${u}c)" stroke="#4a2e10" stroke-width="4.5" fill="none" stroke-linejoin="round"><path d="M20 40l8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10"/><path d="M14 58l8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10"/><path d="M24 76l8 8 8-8 8 8 8-8 8 8"/></g>
<path d="M22 66c20 6 44 2 60-12" stroke="#3a260c" stroke-width="2.4" fill="none"/><path d="M30 38c10-6 24-8 34-6" stroke="#fff" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"/>`,
  algae:u=>`<defs>${rpRG(u+'b','#b7f07a','#3d9a2c',.4,.35,.75)}</defs>${rpShadow(28,90)}
<g stroke="#2f7a22" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M30 86c-6-16 6-26 0-44M50 86c4-18-6-30 2-50M70 86c-4-14 6-24 2-38"/></g>
<g fill="url(#${u}b)" stroke="#2a6e1e" stroke-width="1.8"><circle cx="30" cy="44" r="9"/><circle cx="52" cy="34" r="11"/><circle cx="72" cy="48" r="9"/><circle cx="40" cy="62" r="8"/><circle cx="62" cy="66" r="8"/><circle cx="50" cy="80" r="7"/></g>
<g fill="#fff" opacity=".45"><circle cx="49" cy="30" r="3"/><circle cx="28" cy="41" r="2.2"/><circle cx="70" cy="45" r="2.2"/></g>`,
  grass:u=>`<defs>${rpLG(u+'b','#9be05a','#3d8a2a')}</defs>${rpShadow(30,91)}
<g fill="url(#${u}b)" stroke="#2d6a1c" stroke-width="1.8" stroke-linejoin="round"><path d="M22 90C20 66 14 50 6 40c14 8 22 26 24 50z"/><path d="M34 90c0-26 4-48 12-64-2 22-4 44-2 64z"/><path d="M48 90c4-30 14-52 28-66-10 20-16 44-18 66z"/><path d="M60 90c4-20 14-32 30-38-14 10-20 22-22 38z"/><path d="M40 90c-6-18-14-28-26-32 14 2 24 14 30 32z"/></g>
<path d="M44 84c2-20 4-38 10-52" stroke="#d8f6a8" stroke-width="1.6" fill="none" opacity=".7"/>`,
  shrub:u=>`<defs>${rpRG(u+'b','#8fd35a','#2f7a2a',.4,.3,.8)}</defs>${rpShadow(34,91)}
<path d="M46 90l2-14M54 90l-1-14" stroke="#5a3a20" stroke-width="4" stroke-linecap="round"/>
<g fill="url(#${u}b)" stroke="#225a1c" stroke-width="2.2"><circle cx="30" cy="64" r="17"/><circle cx="70" cy="64" r="17"/><circle cx="50" cy="48" r="20"/><circle cx="50" cy="70" r="16"/></g>
<g fill="#3d8f30"><path d="M36 54c4-6 10-6 12 0-6 2-8 2-12 0z"/><path d="M56 62c4-6 10-6 12 0-6 2-8 2-12 0z"/><path d="M26 66c4-6 10-6 12 0-6 2-8 2-12 0z"/></g>
<g fill="#e84f6a"><circle cx="40" cy="44" r="2.8"/><circle cx="64" cy="54" r="2.8"/><circle cx="52" cy="72" r="2.8"/></g><g fill="#fff" opacity=".4"><circle cx="44" cy="36" r="4"/></g>`,
  willow:u=>`<defs>${rpRG(u+'l','#b8e07a','#5f9a2e',.5,.25,.8)}</defs>${rpShadow(28,92)}
<path d="M46 92c2-14 0-30-6-42M54 92c-1-14 2-30 8-40" stroke="#6b4a2a" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M14 58C14 26 36 10 52 10s36 16 36 46c-10-10-24-14-38-14S22 48 14 58z" fill="url(#${u}l)" stroke="#3f6a1c" stroke-width="2.2"/>
<g stroke="#6faa36" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M18 52c0 12-2 22-4 30M28 46c0 14 0 26-2 36M40 42c0 16 2 28 0 40M62 42c0 16-2 28 0 40M74 46c0 14 0 26 2 36M84 52c0 12 2 22 4 30"/></g>
<g stroke="#a6d86a" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M22 50c0 12-1 20-3 28M34 44c0 14 0 24-1 34M68 44c0 14 0 24 1 34M80 50c0 12 1 20 3 28"/></g>`,
  acorn:u=>`<defs>${rpRG(u+'n','#e0a35a','#8a5420',.4,.35,.75)}${rpLG(u+'c','#a07a4a','#5e4222')}</defs>${rpShadow(20,92)}
<path d="M30 46c0 26 8 42 20 44 12-2 20-18 20-44z" fill="url(#${u}n)" stroke="#5a3410" stroke-width="2.4"/>
<path d="M24 46c0-16 12-24 26-24s26 8 26 24c-10 4-42 4-52 0z" fill="url(#${u}c)" stroke="#3e2a12" stroke-width="2.4"/>
<g stroke="#3e2a12" stroke-width="1.2" opacity=".6"><path d="M32 30l6 14M44 26l2 18M56 26l-2 18M68 30l-6 14"/></g>
<path d="M50 22c0-8 4-12 8-14" stroke="#5a3e1e" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M40 56c0 12 4 22 8 26" stroke="#fff" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/>`,
  oak:u=>rpTree(u,'#5fae3a'),
  tree:u=>rpTree(u,'#3f9a4a'),
  apple:u=>rpTree(u,'#5aa83c',`<g stroke="#8a1414" stroke-width="1.2"><circle cx="32" cy="48" r="5" fill="#e23b3b"/><circle cx="60" cy="30" r="5" fill="#e23b3b"/><circle cx="70" cy="52" r="5" fill="#e23b3b"/><circle cx="46" cy="56" r="5" fill="#e23b3b"/><circle cx="44" cy="24" r="4.6" fill="#e23b3b"/></g><g fill="#fff" opacity=".6"><circle cx="30.5" cy="46.5" r="1.4"/><circle cx="58.5" cy="28.5" r="1.4"/><circle cx="68.5" cy="50.5" r="1.4"/></g>`),
  flower:u=>`<defs>${rpRG(u+'p','#ffd1e6','#e2508f',.5,.5,.6)}</defs>${rpShadow(26,92)}
<g stroke="#3f8a2c" stroke-width="3" fill="none" stroke-linecap="round"><path d="M30 90c0-18 0-30 2-44M52 90c0-22 0-38-2-58M72 90c0-16 0-28-4-40"/></g>
<g fill="#5fae3a" stroke="#2f6a1c" stroke-width="1.4"><path d="M31 74c-10-2-14-8-14-12 8 0 12 4 14 12z"/><path d="M52 66c10-2 14-8 14-12-8 0-12 4-14 12z"/></g>
${[[32,44,9],[50,30,11],[68,50,9]].map(([x,y,r])=>`<g>${[0,60,120,180,240,300].map(a=>`<ellipse cx="${x}" cy="${y-r*.62}" rx="${r*.42}" ry="${r*.6}" fill="url(#${u}p)" stroke="#b52a68" stroke-width="1.2" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="${r*.38}" fill="#ffc533" stroke="#b07a10" stroke-width="1.2"/></g>`).join('')}`,
  leaves:u=>`<defs>${rpLG(u+'a','#f0a040','#b85a18')}${rpLG(u+'b','#d8b25a','#8a6020')}${rpLG(u+'c','#c8602a','#7a2e10')}</defs>${rpShadow(36,90)}
${[[30,72,-30,'a'],[62,74,25,'c'],[46,62,70,'b'],[24,56,-70,'c'],[70,56,-20,'a'],[48,80,0,'b'],[44,46,40,'a']].map(([x,y,r,g])=>`<g transform="rotate(${r} ${x} ${y})"><path d="M${x-16} ${y}c6-10 26-10 32 0-6 10-26 10-32 0z" fill="url(#${u}${g})" stroke="#5a2e10" stroke-width="1.8"/><path d="M${x-14} ${y}h28" stroke="#5a2e10" stroke-width="1.2" opacity=".7"/></g>`).join('')}`,
  fungi:u=>`<defs>${rpRG(u+'m','#ff7a5a','#b8321c',.4,.3,.8)}${rpLG(u+'s','#fff7ea','#e6d6bc',1,0)}</defs>${rpShadow(32,91)}
<path d="M14 88c8-6 18-6 22 0s14 6 20 0" stroke="#e88aa0" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M14 88c8-6 18-6 22 0s14 6 20 0" stroke="#f8b8c8" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="1 4"/><circle cx="55" cy="87" r="1.6" fill="#141a2e"/>
<path d="M60 90c2-10 2-20 0-30h12c-2 10-2 20 0 30z" fill="url(#${u}s)" stroke="#8a7458" stroke-width="2"/>
<path d="M44 62c0-18 14-28 22-28s22 10 22 28c-14 4-30 4-44 0z" fill="url(#${u}m)" stroke="#7a1e10" stroke-width="2.2"/>
<g fill="#fff"><circle cx="58" cy="46" r="3.2"/><circle cx="72" cy="42" r="2.6"/><circle cx="78" cy="54" r="2.4"/><circle cx="54" cy="56" r="2.2"/></g>
<path d="M30 90c1-6 1-12 0-16h7c-1 4-1 10 0 16z" fill="url(#${u}s)" stroke="#8a7458" stroke-width="1.8"/>
<path d="M22 76c0-10 7-16 12-16s12 6 12 16c-8 2-16 2-24 0z" fill="#c98a4a" stroke="#6a3e14" stroke-width="2"/>`,
  soil:u=>`<defs>${rpLG(u+'b','#8a5a34','#4a2c16')}${rpRG(u+'g','#fff7a8','#ffd23f',.5,.5,.5)}</defs>${rpShadow(38,92)}
<path d="M8 88c4-22 22-36 42-36s38 14 42 36z" fill="url(#${u}b)" stroke="#2e1a0a" stroke-width="2.4"/>
<g fill="#6a4224"><circle cx="30" cy="76" r="3"/><circle cx="60" cy="70" r="2.4"/><circle cx="72" cy="80" r="3"/><circle cx="44" cy="84" r="2"/></g>
<g fill="url(#${u}g)" stroke="#c99a10" stroke-width="1"><circle cx="38" cy="68" r="4"/><circle cx="56" cy="80" r="4.4"/><circle cx="66" cy="64" r="3.4"/><circle cx="24" cy="82" r="3"/></g>
<path d="M50 52c0-8 4-14 10-16M50 52c-2-6-6-10-12-10" stroke="#4f9a34" stroke-width="3" fill="none" stroke-linecap="round"/>`
};
function rpDefs(){
  if(document.getElementById('rp-defs'))return;
  const d=document.createElementNS('http://www.w3.org/2000/svg','svg');
  d.id='rp-defs';d.setAttribute('aria-hidden','true');d.setAttribute('focusable','false');
  d.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden');
  d.innerHTML='<defs>'+Object.keys(RP_SPR).map(k=>`<symbol id="rpS-${k}" viewBox="0 0 100 100" overflow="visible">${RP_SPR[k]('rpq'+k)}</symbol>`).join('')+
    '<marker id="rp-ah" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5 0 10 2.5 5z" fill="#fff" stroke="#1b2a4a" stroke-width="1.1" stroke-linejoin="round"/></marker>'+
    '<marker id="rp-ahh" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5 0 10 2.5 5z" fill="#ffd1e8" stroke="#a0306a" stroke-width="1.1"/></marker>'+
    '<marker id="rp-ahb" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5 0 10 2.5 5z" fill="#ff5a5f" stroke="#7a1418" stroke-width="1.1"/></marker>'+
    '<filter id="rp-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  document.body.appendChild(d);Art.defs();
}
const rpUse=(sp,sz,cls)=>svgEl(`<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" class="${cls||''}" aria-hidden="true"><use href="#rpS-${sp}"/></svg>`);

/* ---------------- scenes (760 x 420) ---------------- */
const RP_W=760,RP_H=420,RP_R=46;
function rpScene(kind){
  const W=RP_W,H=RP_H,u='rpb'+kind;
  const sky=(a,b,c)=>`<linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".7" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const sun=(x,y,r)=>`<radialGradient id="${u}u"><stop offset="0" stop-color="#fffbe0" stop-opacity=".95"/><stop offset=".3" stop-color="#fff2a8" stop-opacity=".5"/><stop offset="1" stop-color="#fff2a8" stop-opacity="0"/></radialGradient><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}u)"/>`;
  const vig=`<radialGradient id="${u}v" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${u}v)"/>`;
  const blades=(y0,col,n,seed)=>{let s=seed||3,t='';const r=()=>(s=(s*9301+49297)%233280)/233280;for(let i=0;i<n;i++){const x=r()*W,y=y0+r()*(H-y0),hh=8+r()*12;t+=`M${x.toFixed(0)} ${y.toFixed(0)}q${(r()*6-3).toFixed(1)} -${(hh/2).toFixed(0)} ${(r()*8-4).toFixed(1)} -${hh.toFixed(0)}`;}return `<path d="${t}" stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>`;};
  const pines=(y,col,n,sc,seed)=>{let s=seed||5,t='';const r=()=>(s=(s*9301+49297)%233280)/233280;for(let i=0;i<n;i++){const x=i*W/(n-1)+r()*20-10,hh=(40+r()*30)*sc;t+=`<path d="M${x} ${y-hh}l${hh*.32} ${hh}h-${hh*.64}z"/>`;}return `<g fill="${col}">${t}</g>`;};
  let b='';
  if(kind==='pond'){
    b=`<defs>${sky('#6fbfff','#cfeaff','#e8f6ff')}<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb3c9"/><stop offset="1" stop-color="#1d6f8a"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#${u}s)"/>${sun(640,50,110)}
<path d="M0 150q60-34 120-14t130-6 140 8 150-14 220 10V190H0z" fill="#5e9f4a"/><path d="M0 168q90-22 190-6t190 0 200-4 180 6V200H0z" fill="#4c8c3c"/>
<path d="M0 182q190-14 380 0t380 0V${H}H0z" fill="url(#${u}w)"/>
<g fill="none" stroke="#bff0ff" stroke-width="2" opacity=".35"><ellipse cx="200" cy="260" rx="60" ry="8"/><ellipse cx="520" cy="320" rx="80" ry="10"/><ellipse cx="380" cy="390" rx="70" ry="8"/><ellipse cx="640" cy="230" rx="44" ry="6"/></g>
<g fill="#4f9a3a" stroke="#2f6a22" stroke-width="2"><path d="M690 380a26 10 0 1 0 1 0l-12 4z"/><path d="M60 230a22 8 0 1 0 1 0l-10 3z"/><path d="M470 400a20 7 0 1 0 1 0l-9 3z"/></g><circle cx="694" cy="376" r="5" fill="#ffd1e6"/>
<g stroke="#5a7a2a" stroke-width="3" stroke-linecap="round"><path d="M20 ${H}v-120M34 ${H}v-96M748 ${H}v-130M734 ${H}v-100"/></g><g fill="#7a4a24"><rect x="15" y="${H-136}" width="10" height="28" rx="5"/><rect x="743" y="${H-146}" width="10" height="30" rx="5"/></g>${vig}`;
  }else if(kind==='meadow'||kind==='orchard'){
    b=`<defs>${sky('#6cbcff','#d6efff','#f2fbff')}<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86cf5e"/><stop offset="1" stop-color="#3f9440"/></linearGradient><linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6c470"/><stop offset="1" stop-color="#b98a3a"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#${u}s)"/>${sun(650,60,120)}
<g fill="#fff" opacity=".85"><ellipse cx="140" cy="60" rx="46" ry="14"/><ellipse cx="170" cy="50" rx="30" ry="14"/><ellipse cx="460" cy="40" rx="38" ry="11"/></g>
<path d="M0 170q120-50 260-20t250-10 250 0V${H}H0z" fill="#7cbf6a" class="rpgreen"/><path d="M0 170q120-50 260-20t250-10 250 0V${H}H0z" fill="#d8b866" class="rpdry"/>
${kind==='orchard'?`<g class="rpgreen" opacity=".9">${[60,150,620,700].map((x,i)=>`<path d="M${x} 168v-30" stroke="#6b4a2a" stroke-width="6"/><circle cx="${x}" cy="${130-i%2*6}" r="${22+i%2*4}" fill="#4f9a3a"/><circle cx="${x-8}" cy="${124-i%2*6}" r="4" fill="#e23b3b"/><circle cx="${x+9}" cy="${136-i%2*6}" r="4" fill="#e23b3b"/>`).join('')}</g>`:''}
<path d="M0 200q200-30 400-6t360-8V${H}H0z" fill="url(#${u}g)" class="rpgreen"/><path d="M0 200q200-30 400-6t360-8V${H}H0z" fill="url(#${u}d)" class="rpdry"/>
<g class="rpgreen">${blades(210,'#2f7a2a',140,7)}${kind==='orchard'?[...Array(26)].map((_,i)=>`<circle cx="${(i*97)%W}" cy="${220+(i*53)%190}" r="3.2" fill="${['#ffd1e6','#fff','#ffe066'][i%3]}"/>`).join(''):''}</g>
<g class="rpdry">${blades(210,'#8a6420',120,7)}<path d="M120 300l20 14 -8 16M520 360l16-10 10 14M600 260l-18 12" stroke="#7a5418" stroke-width="2" fill="none"/></g>${vig}`;
  }else if(kind==='forest'||kind==='autumn'){
    const au=kind==='autumn',c1=au?'#e8a040':'#3f8a4a',c2=au?'#c4642a':'#2f6e3c',c3=au?'#d98a30':'#4f9a52';
    b=`<defs>${sky(au?'#ffcf8a':'#8fd0f0',au?'#ffe9c8':'#d8f0f6',au?'#fff4e2':'#eef9fb')}<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${au?'#b8823a':'#5a8a3a'}"/><stop offset="1" stop-color="${au?'#7a4e22':'#3a5e2a'}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#${u}s)"/>${sun(au?120:640,50,110)}
<g opacity=".55">${[30,110,200,300,420,520,610,700].map((x,i)=>`<rect x="${x-5}" y="90" width="10" height="120" fill="#5a3e24"/><circle cx="${x}" cy="${86-i%3*8}" r="${34+i%2*8}" fill="${[c1,c2,c3][i%3]}"/>`).join('')}</g>
<path d="M0 205q190-22 380-4t380-6V${H}H0z" fill="url(#${u}g)"/>
${[...Array(30)].map((_,i)=>`<path transform="translate(${(i*131)%W} ${220+(i*71)%190}) rotate(${i*47})" d="M-6 0c2-4 10-4 12 0-2 4-10 4-12 0z" fill="${au?['#f0a040','#c8602a','#e8c050'][i%3]:['#7a5a2a','#9a7038','#5a8a3a'][i%3]}" opacity=".7"/>`).join('')}${vig}`;
  }else if(kind==='park'){
    b=`<defs>${sky('#7cc4ff','#d8efff','#eef8ff')}<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ccf6a"/><stop offset="1" stop-color="#5f9a40"/></linearGradient><linearGradient id="${u}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5fc0f0"/><stop offset="1" stop-color="#2f8ad0"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#${u}s)"/>${sun(90,50,100)}
<path d="M0 150l90-80 60 40 90-90 110 100 70-50 110 80 90-60 140 100V${H}H0z" fill="#8a9ab8"/><path d="M150 110l90-90 46 42-30-6-24 18-30-10z M460 130l90-60 50 34-28-6-20 12z" fill="#fff" opacity=".9"/>
${pines(170,'#2f5e3a',18,1,3)}<path d="M0 160q190-20 380 0t380-6V${H}H0z" fill="url(#${u}g)"/>
<path d="M0 400q120-40 230-30t200-60 200-30 130-40" stroke="url(#${u}r)" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9"/><path d="M0 400q120-40 230-30t200-60 200-30 130-40" stroke="#dff4ff" stroke-width="3" fill="none" stroke-dasharray="14 22" opacity=".7"/>
${blades(190,'#3f7a2a',90,9)}${vig}`;
  }else if(kind==='lake'){
    b=`<defs><linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cc6e8"/><stop offset=".55" stop-color="#1f7fb0"/><stop offset="1" stop-color="#0d4a78"/></linearGradient><linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#${u}w)"/><g fill="url(#${u}l)"><path d="M120 0h50l-90 ${H}h-40z"/><path d="M330 0h40l-40 ${H}h-50z"/><path d="M560 0h60l40 ${H}h-50z"/></g>
<path d="M0 14q47 -8 95 0t95 0 95 0 95 0 95 0 95 0 95 0 95 0V0H0z" fill="#dff7ff" opacity=".6"/>
<g fill="#fff" opacity=".35">${[[80,120,4],[90,90,3],[700,200,5],[690,160,3],[420,60,3]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
<path d="M0 380q120-24 260-6t260-10 240 4V${H}H0z" fill="#c9b07a"/><path d="M0 396q190-14 380 0t380-4V${H}H0z" fill="#a88e58"/>
<g stroke="#3f8a4a" stroke-width="4" fill="none" stroke-linecap="round"><path d="M40 ${H}c-8-40 10-60 0-100M56 ${H}c6-30-6-50 4-80M720 ${H}c8-40-10-60 0-110M704 ${H}c-6-30 6-50-4-70"/></g>
<g fill="#7a7a72"><ellipse cx="200" cy="392" rx="26" ry="10"/><ellipse cx="560" cy="390" rx="20" ry="8"/></g>${vig}`;
  }
  return `<g class="art-backdrop rpscene">${b}</g>`;
}

/* ---------------- levels ----------------
   N(id,label,sprite,x,y,count,icons)  E = food -> eater   help = dashed helper links
   change levels: ev = the card to drag in; qs = [id, up|same|down, why]
   goal levels: goal = {id,dir,txt}; cards = actions, each with its own qs (ok = reaches the goal)
   also = populations that change but are not asked (shown, not scored) */
const RPN=(id,label,sp,x,y,n,k)=>({id,label,sp,x,y,n,k:k==null?5:k});
const RPL=(name,story,scene,nodes,edges,o)=>Object.assign({name,story,scene,nodes,edges,help:[],also:{}},o);
const RP_LEVELS=[
  RPL('The Pond','A quiet pond food chain.','pond',
    [RPN('algae','Algae','algae',100,300,900,6),RPN('flea','Water fleas','flea',275,165,400,5),RPN('minnow','Minnows','minnow',450,300,120,5),RPN('heron','Herons','heron',620,150,6,3)],
    [['algae','flea'],['flea','minnow'],['minnow','heron']],
    {ev:{id:'heron',kind:'remove',card:'Herons fly away',txt:'The herons fly away to a new pond and never come back.'},
     qs:[['minnow','up','The herons ate minnows. With no herons hunting them, more minnows survive.'],
      ['flea','down','More minnows means more water fleas get eaten.'],
      ['algae','up','Fewer water fleas are eating the algae, so the algae grows.']],
     fact:'Removing a top predator can ripple all the way down a food chain. Scientists call this a trophic cascade.',
     clue:'Start next to the herons. Who did the herons eat? Then keep going down the chain one step at a time.'}),
  RPL('Dry Meadow','A meadow food chain in a very dry summer.','meadow',
    [RPN('grass','Grass','grass',120,290,2000,7),RPN('rabbit','Rabbits','rabbit',360,160,60,5),RPN('fox','Foxes','fox',600,290,8,3)],
    [['grass','rabbit'],['rabbit','fox']],
    {ev:{id:'grass',kind:'down',card:'Drought',txt:'A drought hits. With almost no rain, much less grass grows.',dry:1},
     qs:[['rabbit','down','Rabbits eat grass. Less food means fewer rabbits survive and have babies.'],
      ['fox','down','Foxes eat rabbits. With fewer rabbits, foxes have less food too.']],
     fact:'Producers like grass are the base of the food chain. When producers drop, every consumer above them has less energy to live on.',
     clue:'A drought hurts the producer. Who depends on grass for food, and who depends on THEM?'}),
  RPL('Acorn Year','An oak forest food web.','autumn',
    [RPN('oak','Oak acorns','acorn',110,240,5000,4),RPN('squirrel','Squirrels','squirrel',340,115,80,4),RPN('deer','Deer','deer',340,320,30,4),RPN('hawk','Hawks','hawk',600,140,5,3)],
    [['oak','squirrel'],['oak','deer'],['squirrel','hawk']],
    {ev:{id:'oak',kind:'up',card:'Bumper acorn year',txt:'A bumper year! The oak trees drop twice as many acorns as usual.'},
     qs:[['squirrel','up','More acorns means more food for squirrels, so more of them survive the winter.'],
      ['deer','up','Deer eat acorns too, so they also have more food.'],
      ['hawk','up','More squirrels means more food for the hawks.']],
     fact:'When resources are plentiful, populations that depend on them can grow. When resources are scarce, populations shrink.',
     clue:'More food at the bottom of a food web means more energy for everything that eats it.'}),
  RPL('Grassland Web','A grassland food web. Some animals eat more than one thing.','meadow',
    [RPN('grass','Grass','grass',100,250,2000,6),RPN('hopper','Grasshoppers','hopper',290,105,900,6),RPN('rabbit','Rabbits','rabbit',290,320,60,4),RPN('frog','Frogs','frog',480,120,150,5),RPN('snake','Snakes','snake',640,265,12,3)],
    [['grass','hopper'],['grass','rabbit'],['hopper','frog'],['frog','snake'],['rabbit','snake']],
    {ev:{id:'hopper',kind:'down',card:'Insect spray',txt:'A farmer sprays insect poison, and most of the grasshoppers die.'},
     qs:[['frog','down','Frogs eat grasshoppers. With most grasshoppers gone, frogs lose their main food.'],
      ['grass','up','Grasshoppers eat grass. With fewer grasshoppers eating it, more grass grows.']],
     fact:'In a food web, a change to one population affects both the things it eats and the things that eat it.',
     clue:'Look at both arrows on the grasshoppers: one comes IN (what they eat), one goes OUT (who eats them).'}),
  RPL('Too Many Rabbits','Deer and rabbits share the same shrubs.','meadow',
    [RPN('shrub','Shrubs','shrub',110,230,600,6),RPN('deer','Deer','deer',350,105,40,5),RPN('rabbit','Rabbits','rabbit',350,320,50,3),RPN('wolf','Wolves','wolf',600,140,6,3)],
    [['shrub','deer'],['shrub','rabbit'],['deer','wolf']],
    {ev:{id:'rabbit',kind:'up',card:'Release pet rabbits',txt:'Someone releases a huge number of pet rabbits into the area.'},
     qs:[['shrub','down','Many more rabbits are eating the shrubs, so the shrubs get eaten faster than they grow.'],
      ['deer','down','Deer and rabbits compete for the same shrubs. With less food left, fewer deer survive.'],
      ['wolf','down','Wolves eat deer. Fewer deer means less food for the wolves.']],
     fact:'When two species need the same limited resource, they compete. More of one can mean fewer of the other.',
     clue:'Rabbits do not eat deer, but they eat the SAME food. What happens to the deer’s food?'}),
  RPL('Busy Bees','Bees drink nectar from flowers and carry pollen between them.','orchard',
    [RPN('bee','Bees','bee',370,110,3000,7),RPN('flower','Wildflowers','flower',130,280,800,6),RPN('apple','Apple trees','apple',600,270,40,4),RPN('grass','Grass','grass',370,330,2000,5)],
    [['flower','bee'],['apple','bee']],
    {help:[['bee','flower'],['bee','apple']],
     ev:{id:'bee',kind:'down',card:'Pesticide spray',txt:'A pesticide is sprayed nearby, and many bees die.'},
     qs:[['flower','down','Bees carry pollen from flower to flower. With fewer bees, fewer flowers get pollinated and make seeds.'],
      ['apple','down','Apple trees need bees to pollinate their blossoms. Fewer bees means fewer apples and fewer new trees.'],
      ['grass','same','Grass is pollinated by the wind, not bees. It has no link to the bees, so it stays the same.']],
     fact:'Bees and flowers have a mutualism: both benefit. The bee gets food, and the flower gets pollinated.',
     clue:'This web has helper links (dashed pink): bees help flowers make seeds. What if the helpers disappear?',
     note:'The dashed pink lines are **helpers**: bees carry pollen so these plants can make seeds.'}),
  RPL('Wolves Return','Yellowstone National Park. The elk are eating the young willows along the river.','park',
    [RPN('willow','Willow trees','willow',100,140,300,2),RPN('grass','Grass','grass',100,335,5000,5),RPN('elk','Elk','elk',330,85,9000,8),RPN('beaver','Beavers','beaver',270,245,20,2),RPN('rabbit','Rabbits','rabbit',440,345,400,3),RPN('wolf','Wolves','wolf',640,105,0,0),RPN('coyote','Coyotes','coyote',640,290,300,6)],
    [['willow','elk'],['willow','beaver'],['elk','wolf'],['grass','rabbit'],['rabbit','coyote'],['coyote','wolf']],
    {goal:{id:'willow',dir:'up',txt:'Bring back the willow trees. Pick ONE action.'},
     cards:[
      {key:'wolves',id:'wolf',kind:'add',n:40,k:4,card:'Bring back wolves',txt:'Wolves are brought back to the park after 70 years away.',ok:true,
       qs:[['elk','down','Wolves hunt elk, so the number of elk drops.'],
        ['coyote','down','Wolves chase and kill coyotes, so there are fewer coyotes.'],
        ['willow','up','Fewer elk are eating young willows, so more willows grow tall.'],
        ['rabbit','up','The tricky one! Coyotes eat rabbits. With fewer coyotes, more rabbits survive.'],
        ['beaver','up','Beavers use willows for food and for building dams. More willows means more beavers.']],
       also:{grass:['down','More rabbits eat more grass.']},
       fact:'This really happened! When wolves returned to Yellowstone in 1995, elk numbers fell, willows came back along the rivers, and beaver colonies grew.'},
      {key:'feed',id:'elk',kind:'up',card:'Feed the elk in winter',txt:'Rangers put out hay so more elk survive the winter.',
       qs:[['willow','down','More elk eat more young willows. The willows shrink even more.'],
        ['beaver','down','Beavers need willows for food and dams. Fewer willows means fewer beavers.']],
       miss:'Feeding the elk made MORE elk, and elk eat willows. The willows got worse.'},
      {key:'coy',id:'coyote',kind:'down',card:'Trap the coyotes',txt:'Trappers remove most of the coyotes.',
       qs:[['rabbit','up','Coyotes eat rabbits. With fewer coyotes, more rabbits survive.'],
        ['willow','same','Coyotes are not linked to the willows. Nothing changed for the elk, so they keep eating willows.',{step:2,cause:null}]],
       also:{grass:['down','More rabbits eat more grass.']},
       miss:'Coyotes are not part of the willow’s chain. The elk were still eating the willows.'}],
     fact:'This really happened! When wolves returned to Yellowstone in 1995, elk numbers fell, willows came back along the rivers, and beaver colonies grew.',
     clue:'Who is eating the willows? Find something that would make THAT population smaller.'}),
  RPL('Invaders','Floating algae feed a lake food chain. Zooplankton are tiny animals that eat algae.','lake',
    [RPN('algae','Floating algae','algae',110,290,9000,7),RPN('zoo','Zooplankton','plankton',330,130,5000,6),RPN('fish','Small fish','smallfish',580,250,300,5),RPN('zebra','Zebra mussels','zebra',350,330,0,0)],
    [['algae','zoo'],['zoo','fish'],['algae','zebra']],
    {ev:{id:'zebra',kind:'add',n:90000,k:7,card:'Zebra mussels arrive',txt:'Zebra mussels arrive on a boat. They spread fast and filter algae out of the water all day.'},
     qs:[['algae','down','Zebra mussels filter huge amounts of algae out of the water.'],
      ['zoo','down','The tiny animals eat algae. The mussels are competing with them for it.'],
      ['fish','down','Small fish eat the tiny animals. Fewer tiny animals means less food for fish.']],
     fact:'An invasive species is a living thing brought to a new place where it spreads and harms the ecosystem. Zebra mussels are a real problem in the Great Lakes and in New York lakes.',
     clue:'The mussels do not eat fish. But they eat what is at the very bottom of the chain.'}),
  RPL('Forest Floor','A chemical spill killed most of the fungi and worms. Dead leaves are piling up, and the trees look weak.','forest',
    [RPN('tree','Trees','tree',110,130,200,3),RPN('flower','Forest plants','flower',110,330,900,2),RPN('leaves','Dead leaves','leaves',370,90,9000,9),RPN('decomp','Fungi and worms','fungi',620,215,500,1),RPN('soil','Soil nutrients','soil',380,315,100,2)],
    [['tree','leaves'],['leaves','decomp'],['decomp','soil'],['soil','tree'],['soil','flower']],
    {goal:{id:'tree',dir:'up',txt:'Help the trees grow strong again. Pick ONE action.'},
     cards:[
      {key:'decomp',id:'decomp',kind:'up',card:'Bring back fungi and worms',txt:'Clean soil with fungi and worms is mixed into the forest floor.',ok:true,
       qs:[['leaves','down','Fungi and worms eat and break down the dead leaves, so the pile shrinks.'],
        ['soil','up','Decomposers return the matter in dead leaves to the soil as nutrients.'],
        ['tree','up','Trees take up those nutrients through their roots and grow strong again.',{step:2,cause:'soil'}],
        ['flower','up','Forest plants use the same soil nutrients, so they grow better too.',{step:2,cause:'soil'}]]},
      {key:'rake',id:'leaves',kind:'down',card:'Rake away the dead leaves',txt:'Workers rake up the dead leaves and haul them away.',
       qs:[['soil','down','Raking hauls away the matter that would have become new soil nutrients.',{step:1,cause:'leaves'}],
        ['tree','down','With even fewer nutrients in the soil, the trees get weaker.',{step:2,cause:'soil'}]],
       also:{flower:['down','Forest plants need the same soil nutrients.',{step:2,cause:'soil'}]},
       miss:'Raking took the matter OUT of the forest. Nothing was left to turn back into nutrients.'},
      {key:'pile',id:'leaves',kind:'up',card:'Pile on more leaves',txt:'Trucks dump extra dead leaves on the forest floor.',
       qs:[['soil','same','Almost no fungi and worms are left to break leaves down, so no new nutrients reach the soil.',{step:1,cause:'leaves'}],
        ['tree','same','The soil did not get any new nutrients, so the trees stay weak.',{step:2,cause:'soil'}]],
       miss:'More leaves do not help if nothing breaks them down. The broken step was the decomposers.'}],
     fact:'Decomposers recycle matter. They break down dead things and return nutrients to the soil, where plants use them again.',
     clue:'This web is a loop: tree → leaves → decomposers → soil → tree. Which step of the loop is broken?',
     note:'This web is a **loop**: matter goes around and around.'})
];
const RP_PACKS={0:'Pack 1: Food chains',3:'Pack 2: Food webs',6:'Pack 3: Big changes'};
const RP_DIR={up:['More','▲'],same:['Same','▬'],down:['Fewer','▼']};
const RP_EVB={remove:['✕','#e5484d','Gone'],add:['+','#1f9d55','Arrived'],up:['▲','#1f9d55','More'],down:['▼','#e5484d','Less']};
const RP_MOVE={heron:'stand',hawk:'stand',bee:'fly',flea:'swim',plankton:'swim',minnow:'swim',smallfish:'swim',trout:'swim',zebra:'still',algae:'sway',grass:'sway',shrub:'sway',willow:'sway',oak:'sway',tree:'sway',apple:'sway',flower:'sway',acorn:'still',leaves:'still',soil:'still',fungi:'still'};
const RP_SLOTS=[[0,6],[-22,-10],[22,-10],[-24,16],[24,16],[0,-24],[-6,26],[14,30],[-34,2]];
const rpGoal=L=>!!L.goal;
const rpNode=(L,id)=>L.nodes.find(n=>n.id===id);
const rpCard=(L,S)=>rpGoal(L)?(L.cards.find(c=>c.key===S.card)||null):L.ev;
const rpQs=(L,S)=>{const c=rpCard(L,S);return c?c.qs||L.qs:(rpGoal(L)?[]:L.qs);};
const rpAlso=(L,S)=>{const c=rpCard(L,S);return Object.assign({},L.also||{},(c&&c.also)||{});};
const rpNextK=(k,d,c)=>d==='up'?Math.min(9,Math.max(k+3,Math.round(k*1.6))):d==='down'?Math.max(1,Math.round(k*.4)):d==='remove'?0:d==='add'?(c&&c.k)||4:k;
const rpNextN=(n,d,c)=>d==='up'?Math.round(n*1.8):d==='down'?Math.round(n*.4):d==='remove'?0:d==='add'?(c&&c.n)||40:n;
const rpFmt=n=>n>=10000?Math.round(n/1000)+'k':n.toLocaleString('en-US');
/* steps away from the change, along the arrows (either direction) */
function rpSteps(L,from){const adj={};L.nodes.forEach(n=>{adj[n.id]=[];});
  [...L.edges,...(L.help||[])].forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const d={[from]:0},par={},q=[from];while(q.length){const a=q.shift();adj[a].forEach(b=>{if(d[b]==null){d[b]=d[a]+1;par[b]=a;q.push(b);}});}
  return {d,par};}

/* ---------------- the board ---------------- */
function rpEdgePath(A,B,bend){
  const dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,k=(bend==null?.12:bend)*len;
  const r0=RP_R+4,r1=RP_R+9,sx=A.x+ux*r0+nx*k*.35,sy=A.y+uy*r0+ny*k*.35,ex=B.x-ux*r1+nx*k*.35,ey=B.y-uy*r1+ny*k*.35;
  return `M${sx.toFixed(1)} ${sy.toFixed(1)}Q${((A.x+B.x)/2+nx*k).toFixed(1)} ${((A.y+B.y)/2+ny*k).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}
function rpIcons(N,k,rnd){
  let t='';const mv=RP_MOVE[N.sp]||'walk',sl=RP_SLOTS.slice(0,k).map((p,i)=>({p,i})).sort((a,b)=>a.p[1]-b.p[1]);
  sl.forEach(({p,i})=>{const flip=(i%3===1)&&mv!=='sway'&&mv!=='still'?-1:1,sz=38;
    t+=`<g class="rpi" data-i="${i}" transform="translate(${N.x+p[0]} ${N.y+p[1]})"><g class="rpz"><g class="rpm rpm-${mv}" style="--d:${(-rnd()*3).toFixed(2)}s;--t:${(2.4+rnd()*1.6).toFixed(2)}s"><use href="#rpS-${N.sp}" x="${-sz/2}" y="${-sz/2}" width="${sz}" height="${sz}" transform="scale(${flip} 1)"/></g></g></g>`;});
  return t;
}
function rpBuild(G){
  rpDefs();
  const L=G.L,S=G.st;let s=G.i*7+3;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
  let t=rpScene(L.scene)+'<g class="rpedges">';
  const pairs=new Set(L.edges.map(([a,b])=>a+'>'+b));
  const edge=(a,b,help)=>{const A=rpNode(L,a),B=rpNode(L,b),back=pairs.has(b+'>'+a)||(help&&pairs.has(b+'>'+a));
    const d=rpEdgePath(A,B,help||back?.22:.1);
    t+=`<g class="rpe${help?' help':''}" data-a="${a}" data-b="${b}"><path class="rpe-o" d="${d}"/><path class="rpe-l" d="${d}" marker-end="url(#${help?'rp-ahh':'rp-ah'})"/><path class="rpe-f" d="${d}"/></g>`;};
  L.edges.forEach(([a,b])=>edge(a,b,0));(L.help||[]).forEach(([a,b])=>edge(a,b,1));
  t+='</g><g class="rpnodes">';
  L.nodes.forEach(N=>{const k=S.k[N.id],lw=Math.max(84,(N.label.length+rpFmt(S.n[N.id]).length)*7.3+30);
    t+=`<g class="rpn rpdrop${k?'':' empty'}" data-id="${N.id}" aria-label="${ngEsc(N.label)}">
<circle class="rppatch" cx="${N.x}" cy="${N.y}" r="${RP_R}"/><circle class="rpring" cx="${N.x}" cy="${N.y}" r="${RP_R+5}"/>
<g class="rpcrowd">${rpIcons(N,k,rnd)}</g>
<g class="rplab"><rect x="${N.x-lw/2}" y="${N.y+RP_R+3}" width="${lw}" height="22" rx="11"/><text x="${N.x}" y="${N.y+RP_R+18.5}" text-anchor="middle">${ngEsc(N.label)} <tspan class="rpnum">${rpFmt(S.n[N.id])}</tspan></text></g>
<g class="rpbadges"></g></g>`;});
  t+='</g><g class="rplevers"></g>';
  const svg=svgEl(`<svg viewBox="0 0 ${RP_W} ${RP_H}" class="rpsvg" role="img" aria-label="Food web. Arrows point from food to eater.">${t}</svg>`);
  const wrap=h('div',{class:'rpboard sc-'+L.scene},svg);
  S.el={wrap,svg,rnd};
}
const rpQ=(S,sel)=>S.el.svg.querySelector(sel);
const rpN=(S,id)=>rpQ(S,`.rpn[data-id="${id}"]`);
/* animate one population to a new size: icons hatch in or fade out, the number counts */
function rpSetPop(S,N,k,n,fast){
  const g=rpN(S,N.id),crowd=g.querySelector('.rpcrowd'),num=g.querySelector('.rpnum'),old=S.k[N.id],from=S.n[N.id];
  S.k[N.id]=k;S.n[N.id]=n;g.classList.toggle('empty',!k);
  const still=fast||Art.reduced();
  if(k<old){[...crowd.querySelectorAll('.rpi')].filter(e=>+e.dataset.i>=k).forEach((e,j)=>{if(still)return e.remove();e.style.setProperty('--o',(j*.08)+'s');e.classList.add('out');setTimeout(()=>e.remove(),900+j*80);});}
  else if(k>old){const tmp=document.createElementNS('http://www.w3.org/2000/svg','g');tmp.innerHTML=rpIcons(N,k,S.el.rnd);
    [...tmp.querySelectorAll('.rpi')].filter(e=>+e.dataset.i>=old).forEach((e,j)=>{if(!still){e.classList.add('in');e.style.setProperty('--o',(j*.09)+'s');}crowd.appendChild(e);});
    [...crowd.querySelectorAll('.rpi')].sort((a,b)=>RP_SLOTS[a.dataset.i][1]-RP_SLOTS[b.dataset.i][1]).forEach(e=>crowd.appendChild(e));}
  if(still)num.textContent=rpFmt(n);else Art.tween({from,to:n,dur:900,step:v=>{num.textContent=rpFmt(Math.round(v));}});
  const lab=g.querySelector('.rplab rect'),lw=Math.max(84,(N.label.length+rpFmt(n).length)*7.3+30);lab.setAttribute('x',N.x-lw/2);lab.setAttribute('width',lw);
}
function rpBadge(S,id,sym,col,cls){
  const N=rpNode(G.L,id),b=rpN(S,id).querySelector('.rpbadges'),x=N.x+(cls==='res'?-RP_R+4:cls==='dir'?0:RP_R-6),y=cls==='dir'?N.y-RP_R-4:N.y-RP_R+6;
  b.querySelectorAll('.'+cls).forEach(e=>e.remove());
  b.insertAdjacentHTML('beforeend',`<g class="rpbadge ${cls}" transform="translate(${x} ${y})"><g class="rpbi"><circle r="13" fill="${col}"/><text y="5" text-anchor="middle">${sym}</text></g></g>`);
}
/* ---------------- prediction levers: drag the arrow up, flat or down ---------------- */
const RP_LV=[['up',-24],['same',0],['down',24]];
function rpLevers(G){
  const L=G.L,S=G.st,box=rpQ(S,'.rplevers');box.innerHTML='';
  if(S.phase==='change')return;
  rpQs(L,S).forEach(([id])=>{const N=rpNode(L,id),x=N.x+RP_R+21,y=N.y,v=S.pred[id];
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','rplev'+(v?' set '+v:'')+(S.phase!=='predict'?' locked':''));g.dataset.id=id;
    g.setAttribute('transform',`translate(${x} ${y})`);
    if(S.phase==='predict'){g.setAttribute('tabindex','0');g.setAttribute('role','slider');g.setAttribute('aria-valuemin','-1');g.setAttribute('aria-valuemax','1');}
    g.setAttribute('aria-label',`Prediction for ${N.label}`);
    g.innerHTML=`<rect class="rplt" x="-15" y="-41" width="30" height="82" rx="15"/><path class="rplz up" d="M-10 -26h20M-6 -33l6-6 6 6"/><path class="rplz dn" d="M-10 26h20M-6 33l6 6 6-6"/>
<g class="rplk"><circle r="15"/><path class="rpla" d="M0 8V-8M-6.5 -1.5L0 -8l6.5 6.5"/><text class="rplq" y="5" text-anchor="middle">?</text></g>`;
    box.appendChild(g);rpLeverShow(g,v,null);});
}
function rpLeverShow(g,v,dy){
  const k=g.querySelector('.rplk'),y=dy!=null?dy:v?RP_LV.find(r=>r[0]===v)[1]:0,ang=dy!=null?Math.max(-90,Math.min(90,dy*3.75)):v==='up'?0:v==='down'?180:v==='same'?90:0;
  const set=v=>k.setAttribute('transform',`translate(0 ${v})`);
  if(g._tw)g._tw.cancel();
  if(dy==null&&g._y!=null&&g._y!==y&&!Art.reduced())g._tw=Art.tween({from:g._y,to:y,dur:220,ease:'outBack',step:set});else set(y);
  g._y=y;k.querySelector('.rpla').setAttribute('transform',`rotate(${ang})`);
  g.classList.remove('up','same','down','set');if(v){g.classList.add('set',v);}
  g.setAttribute('aria-valuenow',v==='up'?1:v==='down'?-1:0);
  g.setAttribute('aria-valuetext',v?RP_DIR[v][0]:'Not set yet');
}
function rpSetPred(id,v,quiet){
  const S=G.st;if(S.phase!=='predict'||G.done)return;
  S.pred[id]=v;const g=rpQ(S,`.rplev[data-id="${id}"]`);if(g){rpLeverShow(g,v,null);if(!quiet)Art.pop(g.querySelector('.rplk'),1.18);}
  ngRender();
}
function rpLeverInit(G){
  const S=G.st,svg=S.el.svg;if(S.el.lev)return;S.el.lev=1;
  let drag=null;
  const toY=e=>{const r=svg.getBoundingClientRect();return e.clientY/1*RP_H/r.height;};
  svg.addEventListener('pointerdown',e=>{const g=e.target.closest&&e.target.closest('.rplev');if(!g||!G||G.st!==S||S.phase!=='predict'||G.done)return;
    e.preventDefault();drag={g,id:g.dataset.id,y0:toY(e),moved:false,pid:e.pointerId};g.classList.add('drag');try{g.setPointerCapture(e.pointerId);}catch(_){}});
  svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;const dy=Math.max(-26,Math.min(26,toY(e)-drag.y0+(RP_LV.find(r=>r[0]===S.pred[drag.id])||[0,0])[1]));
    if(Math.abs(toY(e)-drag.y0)>3)drag.moved=true;if(drag.moved)rpLeverShow(drag.g,S.pred[drag.id],dy);});
  const up=e=>{if(!drag||e.pointerId!==drag.pid)return;const d=drag;drag=null;d.g.classList.remove('drag');
    let v;if(!d.moved){const cur=S.pred[d.id];v=cur==='up'?'same':cur==='same'?'down':'up';}
    else{const dy=toY(e)-d.y0+(RP_LV.find(r=>r[0]===S.pred[d.id])||[0,0])[1];v=dy<-11?'up':dy>11?'down':'same';}
    rpSetPred(d.id,v);
    const nx=svg.querySelector(`.rplev[data-id="${d.id}"]`);if(nx&&e.pointerType!=='mouse')nx.blur();};
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  svg.addEventListener('keydown',e=>{const g=e.target.closest&&e.target.closest('.rplev');if(!g||S.phase!=='predict')return;
    const id=g.dataset.id,cur=S.pred[id],i=cur?RP_LV.findIndex(r=>r[0]===cur):1;let v=null;
    if(e.key==='ArrowUp'||e.key==='ArrowRight')v=RP_LV[Math.max(0,cur?i-1:0)][0];
    else if(e.key==='ArrowDown'||e.key==='ArrowLeft')v=RP_LV[Math.min(2,cur?i+1:2)][0];
    else if(e.key==='Enter'||e.key===' ')v=cur==='up'?'same':cur==='same'?'down':'up';
    else if(e.key==='Home')v='up';else if(e.key==='End')v='down';
    if(!v)return;e.preventDefault();rpSetPred(id,v);const n=svg.querySelector(`.rplev[data-id="${id}"]`);n&&n.focus();});
}

/* ---------------- the change cards ---------------- */
let RP_DRAG=null;
function rpDragInit(){
  if(RP_DRAG)return;
  RP_DRAG=Art.drag({root:$('s-ng'),items:'.rpcard',targets:'.rpdrop',
    accept:(it,t)=>!!(G&&G.key==='ripple'&&G.st&&G.st.phase==='change'&&!G.done&&it.dataset.target===t.dataset.id),
    onDrop:(it)=>{if(G&&G.key==='ripple')rpApply(it.dataset.key);},
    label:it=>it.getAttribute('aria-label')||'card'});
}
function rpCardEl(L,c,key){
  const N=rpNode(L,c.id),b=RP_EVB[c.kind];
  const ic=h('span',{class:'rpcic'},rpUse(N.sp,46),h('i',{style:`background:${b[1]}`},b[0]));
  return h('div',{class:'rpcard'+(rpGoal(L)?' act':''),'data-key':key,'data-target':c.id,'aria-label':`${c.card} card. Drop it on the ${N.label}.`},
    ic,h('span',{class:'rpct'},h('b',null,c.card),h('small',null,`Drag onto the ${N.label.toLowerCase()}`)));
}
function rpApply(key){
  const L=G.L,S=G.st;if(S.phase!=='change'||G.done)return;
  if(rpGoal(L))S.card=key;
  const c=rpCard(L,S),N=rpNode(L,c.id);
  rpSetPop(S,N,rpNextK(S.k[c.id],c.kind,c),rpNextN(S.n[c.id],c.kind,c));
  const b=RP_EVB[c.kind];rpBadge(S,c.id,b[0],b[1],'ev');rpN(S,c.id).classList.add('isev');
  if(c.dry)S.el.wrap.classList.add('dry');
  Art.burstAt(rpN(S,c.id).querySelector('.rppatch'),{n:16,colors:[b[1],'#fff','#ffd23f'],speed:180,shape:['dot','star']});
  S.phase='predict';
  if(G.hint>=3){const q=rpQs(L,S)[0];if(q&&!S.pred[q[0]])S.pred[q[0]]=q[1];}
  rpLevers(G);rpLeverInit(G);
  ngRender();
  const first=rpQ(S,'.rplev:not(.set)');if(first&&!ngT())Art.pulse(first.querySelector('.rplk'),'#ffd23f');
}

/* ---------------- run the season: the ripple ---------------- */
function rpRun(){
  if(!G||G.done)return;const L=G.L,S=G.st,qs=rpQs(L,S);
  if(S.phase!=='predict'||!qs.every(q=>S.pred[q[0]]))return;
  const c=rpCard(L,S),goalOk=rpGoal(L)?!!c.ok:true;
  let wrong=0;S.res={};qs.forEach(([id,ans])=>{const ok=S.pred[id]===ans;S.res[id]=ok;if(!ok)wrong++;});
  if(ngT()){S.phase='done';const n=qs.length+(rpGoal(L)?1:0),right=qs.length-wrong+(rpGoal(L)&&goalOk?1:0);return ngTDone(right/n);}
  G.tries++;S.phase='run';S.shown=[];rpLevers(G);ngRender();
  const {d,par}=rpSteps(L,c.id),also=rpAlso(L,S);
  const items=[...qs.map(q=>({id:q[0],dir:q[1],why:q[2],o:q[3],asked:1})),...Object.keys(also).map(id=>({id,dir:also[id][0],why:also[id][1],o:also[id][2],asked:0}))];
  const far=Math.max(1,...items.map(it=>d[it.id]||0));
  items.forEach(it=>{const o=it.o||{};it.step=o.step!=null?o.step:d[it.id]==null?far+1:d[it.id];it.cause=o.cause!==undefined?o.cause:(par[it.id]||null);});
  S.items=items;const steps=[...new Set(items.map(it=>it.step))].sort((a,b)=>a-b);
  const gap=Art.reduced()?0:1250,my=S;let t=200;
  steps.forEach(st=>{
    setTimeout(()=>{if(!G||G.st!==my)return;
      items.filter(it=>it.step===st&&it.cause).forEach(it=>{const e=rpQ(S,`.rpe[data-a="${it.id}"][data-b="${it.cause}"],.rpe[data-a="${it.cause}"][data-b="${it.id}"]`);if(e){e.classList.add('hot');setTimeout(()=>e.classList.remove('hot'),gap+600);}});
    },t);
    setTimeout(()=>{if(!G||G.st!==my)return;
      items.filter(it=>it.step===st).forEach(it=>{const N=rpNode(L,it.id);
        rpSetPop(S,N,rpNextK(S.k[it.id],it.dir),rpNextN(S.n[it.id],it.dir));
        rpBadge(S,it.id,RP_DIR[it.dir][1],it.dir==='up'?'#1f9d55':it.dir==='down'?'#e5484d':'#6b7a99','dir');
        if(it.asked){const ok=S.res[it.id];rpBadge(S,it.id,ok?'✓':'✗',ok?'#1f9d55':'#e5484d','res');
          const p=rpN(S,it.id).querySelector('.rppatch');if(ok)Art.good(p);else Art.bad(p);}
        S.shown.push(it.id);});
      S.stepNow=st;ngRender();
    },t+(gap?450:0));
    t+=gap;
  });
  setTimeout(()=>{if(!G||G.st!==my)return;rpFinish(wrong,goalOk);},t+(gap?500:0));
}
function rpFinish(wrong,goalOk){
  const L=G.L,S=G.st,qs=rpQs(L,S),n=qs.length,right=n-wrong,c=rpCard(L,S);
  S.phase='done';G.miss=wrong;G.detail={wrong,of:n};
  /* where did the reasoning break? the first wrong prediction, closest to the change */
  const bad=S.items.filter(it=>it.asked&&!S.res[it.id]).sort((a,b)=>a.step-b.step)[0];
  if(bad){S.broke=bad.id;rpN(S,bad.id).classList.add('broke');
    if(bad.cause){const e=rpQ(S,`.rpe[data-a="${bad.id}"][data-b="${bad.cause}"],.rpe[data-a="${bad.cause}"][data-b="${bad.id}"]`);if(e)e.classList.add('broke');}}
  ngRender();
  if(rpGoal(L)&&!goalOk){const gN=rpNode(L,L.goal.id);
    ngSay(`${c.miss} The ${gN.label.toLowerCase()} did not come back. Try a different action.`,'alert');
    return ngRetry([`Your action did not help the ${gN.label.toLowerCase()}. ${c.miss} Read the ripple on the right, then pick a different action.`]);}
  if(wrong===0){ngSay(rpGoal(L)?`You saved the ${rpNode(L,L.goal.id).label.toLowerCase()} AND predicted every ripple!`:'Every prediction was right! You followed the ripple perfectly.','go');
    return ngWin(3,['You predicted ',h('b',null,`all ${n}`),' populations correctly.']);}
  ngSay(rpBrokeTxt(L,S,bad),'alert');
  if(right*2>=n)ngWin(wrong===1?2:1,['You predicted ',h('b',null,`${right} of ${n}`),' populations correctly. Read why the others changed.']);
  else ngRetry([`You got ${right} of ${n}. You need at least half right to pass. Find the red ✗ on the web: that is where the ripple went a different way.`]);
}
function rpWord(d){return d==='up'?'UP':d==='down'?'DOWN':'the SAME';}
function rpBrokeTxt(L,S,it){
  const N=rpNode(L,it.id),c=rpCard(L,S);
  if(!it.cause)return `Step ${it.step}: **${N.label}** stayed ${rpWord(it.dir)}. ${it.why}`;
  const C=rpNode(L,it.cause),cd=it.cause===c.id?null:((S.items.find(x=>x.id===it.cause)||{}).dir||'same');
  const head=cd?`${C.label} went ${rpWord(cd)}`:`${C.label} ${({remove:'are gone',add:'arrived',up:'went UP',down:'went DOWN'})[c.kind]}`;
  return `Your ripple broke at step ${it.step}: ${head}, so **${N.label.toLowerCase()} went ${rpWord(it.dir)}**. ${it.why}`;
}

/* ---------------- side panel ---------------- */
function rpSide(G){
  const L=G.L,S=G.st,kids=[],c=rpCard(L,S);
  if(rpGoal(L)){const gN=rpNode(L,L.goal.id);
    kids.push(h('div',{class:'rpgoal'},rpUse(gN.sp,40),h('span',null,h('b',null,'Goal: '),L.goal.txt)));}
  else kids.push(h('div',{class:'rpev'},h('b',null,'The change: '),L.ev.txt));
  if(S.phase==='change'){
    kids.push(h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),rpGoal(L)?'Pick one action and drag it onto the web':'Drag the change onto the web'));
    if(rpGoal(L))L.cards.forEach(cd=>kids.push(rpCardEl(L,cd,cd.key)));else kids.push(rpCardEl(L,L.ev,'ev'));
    kids.push(h('ol',{class:'drsteps rpsteps'},...[['web','The arrows point from the **food** to the **eater**. Energy flows that way.'],['wave','Then predict: drag each arrow **up**, **flat** or **down**.'],['play','Run the season and watch the ripple spread.']].map(([ic,t])=>h('li',null,I(ic),h('span',null,...ngRich(t))))));
    if(L.note)kids.push(h('div',{class:'rpnote'},...ngRich(L.note)));
    return kids;
  }
  if(rpGoal(L))kids.push(h('div',{class:'rpdone'},I('check'),' You chose: ',h('b',null,c.card)));
  const qs=rpQs(L,S),ran=S.phase==='run'||S.phase==='done';
  if(!ran){
    kids.push(h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Predict: drag each arrow on the web'));
    kids.push(h('div',{class:'rppreds'},...qs.map(([id])=>{const N=rpNode(L,id),v=S.pred[id];
      return h('button',{type:'button',class:'rpp'+(v?' '+v:''),'aria-label':`${N.label}: ${v?RP_DIR[v][0]:'not set'}. Tap to change.`,
        onclick:()=>{const cur=S.pred[id];rpSetPred(id,cur==='up'?'same':cur==='same'?'down':'up');}},
        rpUse(N.sp,30),h('span',{class:'rppn'},N.label),h('span',{class:'rppv'},v?[RP_DIR[v][1],' ',RP_DIR[v][0]]:'?'));})));
    const left=qs.filter(q=>!S.pred[q[0]]).length;
    kids.push(ngBtn([I('play'),ngT()?' Turn in my answers':' Run the season'],rpRun,'good',{style:'width:100%;font-size:18px',disabled:!!left||G.done}));
    return kids;
  }
  /* the ripple log, step by step */
  kids.push(h('div',{class:'osl'},h('span',{class:'stepchip'},'3'),S.phase==='run'?'The season is running…':'What happened, step by step'));
  if(rpGoal(L)&&kids.length>=3)kids.splice(1,1);
  const shown=(S.items||[]).filter(it=>S.shown.includes(it.id)).sort((a,b)=>a.step-b.step||b.asked-a.asked);
  const log=h('div',{class:'rplog'});
  shown.forEach(it=>{const N=rpNode(L,it.id);
    const ok=it.asked?S.res[it.id]:null,mine=S.pred[it.id];
    log.append(h('div',{class:'rplr'+(ok===true?' ok':ok===false?' no':' info')+(S.broke===it.id?' broke':'')},
      h('div',{class:'rplh'},h('span',{class:'rpsn',title:'Step '+it.step,'aria-label':'Step '+it.step},it.step),rpUse(N.sp,24),h('b',null,N.label),h('span',{class:'rptag '+it.dir},RP_DIR[it.dir][1],' ',RP_DIR[it.dir][0]),
        it.asked?h('span',{class:'rpmark'},ok?'✓':['✗ you said ',RP_DIR[mine][0].toLowerCase()]):h('span',{class:'rpmark'},'not scored')),
      h('div',{class:'rpwhy'},it.why)));});
  kids.push(log);
  return kids;
}

ngDef({key:'ripple',name:'Ripple',ic:'web',std:'MS-LS2-2 · LS2-3 · LS2-4',subj:'life',cap3:true,winDelay:900,
  short:'Pull the thread: make a change and predict how it ripples through a food web.',menuDesc:'Drag a change into a living food web, drag each population’s arrow up or down, then watch the ripple spread.',
  intro:'Every living thing in an ecosystem is connected. You make the change, predict how every population responds, then run the season and watch the ripple spread along the food web. All right earns 3 stars.',
  how:['**Drag the change** onto the food web (later, pick the one action that reaches the goal).','**Predict:** drag each population’s arrow **up**, **flat** or **down**, right on the web.','**Run the season.** The change ripples out one step at a time, and every miss shows where the chain went a different way.'],
  levels:RP_LEVELS,packs:RP_PACKS,
  mini:L=>{const ev=rpGoal(L)?L.goal.id:L.ev.id;return svgEl(`<svg viewBox="0 0 44 30" width="48" height="34" aria-hidden="true">${L.nodes.map(n=>`<circle cx="${4+n.x/RP_W*36}" cy="${3+n.y/RP_H*24}" r="4" fill="${n.id===ev?'#f4b13a':'#7aa2ff'}"/>`).join('')}</svg>`);},
  start(G){if(RP_DRAG)RP_DRAG.cancel();const L=G.L,k={},n={};L.nodes.forEach(N=>{k[N.id]=N.k;n[N.id]=N.n;});
    G.st={phase:'change',card:null,pred:{},res:null,k,n,shown:[],items:null,broke:null};},
  hud(G){return {label:'Wrong',val:G.miss,target:'3 ★ = every prediction right'};},
  render(G,main,side){
    const L=G.L,S=G.st;
    if(!S.el){rpBuild(G);rpDragInit();}
    if(main.children[0]!==S.el.wrap||main.children.length!==1)ngRC(main,S.el.wrap);
    ngRC(side,...rpSide(G));
    if(S.phase==='change')ngSay(rpGoal(L)?'Read the goal. Which population is the problem? Drag ONE action card onto the web.':`Make the change: drag the **${L.ev.card}** card onto the ${rpNode(L,L.ev.id).label.toLowerCase()}.`);
    else if(S.phase==='predict'){const left=rpQs(L,S).filter(q=>!S.pred[q[0]]).length;
      ngSay(left?`Drag each **?** arrow up (more), flat (same) or down (fewer). ${left} left.${ngT()?'':' Follow the arrows one step at a time.'}`:`All predicted. Press **${ngT()?'Turn in my answers':'Run the season'}**!`);}
    else if(S.phase==='run')ngSay('Watch the ripple spread along the arrows, one step at a time.');
  },
  hints(G){const L=G.L,S=G.st;
    if(rpGoal(L)){const ok=L.cards.find(c=>c.ok);
      return [L.clue,'Follow the arrows into the goal population. What is eating it, or what is it missing? Change THAT.',`Pick **${ok.card}**. ${ok.qs[0][2]}`];}
    const q=L.qs[0],nm=rpNode(L,q[0]).label;
    return ['Arrows point from the food to the eater. '+L.clue,'Change one link at a time. Ask: does this population now have MORE food or LESS food? MORE predators or FEWER predators?',`${nm}: ${RP_DIR[q[1]][0]}. ${q[2]}`];},
  onHint(G){if(G.hint===3&&!rpGoal(G.L)&&G.st.phase==='predict'){const q=G.L.qs[0];G.st.pred[q[0]]=q[1];const g=rpQ(G.st,`.rplev[data-id="${q[0]}"]`);if(g)rpLeverShow(g,q[1],null);}}
});
NGTHUMB.ripple=()=>{
  const spr=(k,x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s/100})">${RP_SPR[k]('t'+k)}</g>`;
  let t=`<circle cx="160" cy="96" r="76" fill="none" stroke="#bff0d4" stroke-opacity=".22" stroke-width="10"/><circle cx="160" cy="96" r="48" fill="none" stroke="#bff0d4" stroke-opacity=".32" stroke-width="8"/>`;
  const N=[[64,132],[138,62],[214,124],[270,54]];
  [[0,1],[1,2],[2,3]].forEach(([a,b])=>{t+=`<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="#f6efe0" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 9" opacity=".9"/>`;});
  N.forEach(([x,y])=>{t+=`<circle cx="${x}" cy="${y}" r="27" fill="#f6efe0" opacity=".95"/>`;});
  t+=spr('algae',42,110,44)+spr('flea',116,40,44)+spr('minnow',192,102,44)+spr('heron',248,30,46);
  t+=`<g transform="translate(296 92)"><rect x="-11" y="-26" width="22" height="52" rx="11" fill="#f6efe0"/><circle cy="-12" r="10" fill="#3fd17c"/><path d="M0 -6v-12M-5 -13l5-5 5 5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>`+ngStar(24,26,6,'#f6efe0',.7);
  return ngWrap('ripple','#0f6b55',t);
};
