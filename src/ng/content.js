/* ================= SUBJECT GAMES: Science Check questions, Live Quiz banks, Quiz Board clues ================= */
SC_BANK.push(
/* ---- Cell Shop ---- */
SQ('cs1','cell','What does the mitochondria do for a cell?',[
 [['energy','power','fuel'],'You said energy. Great!',['Think about what a cell needs to do work. What does the mitochondria give it?','Mitochondria give the cell energy.','Use the word "energy" in your sentence.']],
 [['food','sugar','glucose','respiration','break* down','releas*','nutrient*'],'You said where the energy comes from. Excellent!',['Where does that energy come from?','The energy comes from food (sugar).','Say "...releases energy from food."']]],
 'Mitochondria release energy from food for the cell to use.','Mitochondria...'),
SQ('cs2','cell','Name two parts that plant cells have but animal cells do not have.',[
 [['wall'],'You named the cell wall. Good!',['What stiff outer layer holds a plant cell up?','Plant cells have a cell wall.','Say "a cell wall."']],
 [['chloroplast*','vacuole*'],'You named another plant part. Great!',['What green part makes food from sunlight? Or what big storage sac holds water?','Plant cells also have chloroplasts (or a large vacuole).','Say "...and chloroplasts."']]],
 'Plant cells have a cell wall and chloroplasts, but animal cells do not.','Plant cells have... but animal cells...'),
SQ('cs3','cell','Why do plant cells need mitochondria if they make their own food?',[
 [['energy'],'You said energy. Good!',['What do plants need to get out of the food they make?','They need energy from it.','Use the word "energy."']],
 [['sugar','food','glucose'],'You named the food. Great!',['Where is the energy stored?','The energy is stored in the sugar the plant makes.','Say "...from the sugar."']],
 [['releas*','break*','use','get*','turn*','change*','respiration','unlock*','out of'],'You said the mitochondria release it. Excellent!',['What does the mitochondria DO to that energy?','Mitochondria release the energy stored in sugar.','Say "Mitochondria release the energy..."']]],
 'Plant cells need mitochondria to release the energy stored in the sugar they make.','Plant cells need mitochondria to...',[{re:/(don.?t|do not|dont) (need|have) mitochondria/,msg:'Careful! Plant cells DO have mitochondria. Explain why they need them.'}]),
SQ('cs4','cell','What is the job of the cell membrane?',[
 [['control*','let*','allow*','decid*','regulat*','choose*','keep*'],'You said it controls things. Good!',['Think of the membrane as a gatekeeper. What does a gatekeeper do?','It controls what goes in and out.','Say "It controls..."']],
 [['enter*','leav*','in and out','go in','goes in','come in','get in','pass*','through','out of'],'You said what moves in and out. Great!',['Controls WHAT? Think about things moving into and out of the cell.','It controls what enters and leaves the cell.','Say "...what goes in and out of the cell."']]],
 'The cell membrane controls what goes in and out of the cell.','The cell membrane...'),
/* ---- Ripple ---- */
SQ('rp1','ripple','If a predator disappears from a food chain, what happens to the animals it used to eat? Explain why.',[
 [['increas*','more','grow*','go up','goes up','rise*','rais*','bigger'],'You said they increase. Good!',['Do their numbers go up or down?','Their population increases.','Say "...their population increases."']],
 [['eaten','eat*','hunt*','predator*','killed','catch*','caught'],'You explained why. Great!',['Why would there be more of them?','Fewer of them are being eaten.','Say "...because fewer are being eaten."']]],
 'The animals it used to eat increase because fewer of them are being eaten.','The animals it used to eat...'),
SQ('rp2','ripple','What is competition in an ecosystem?',[
 [['same','share*','both','limited','not enough','fight*'],'You said they need the same thing. Good!',['Competition happens when two living things need what?','They need the same thing.','Say "...need the same..."']],
 [['food','resource*','water','space','shelter','sunlight','light','prey'],'You named a resource. Great!',['Name something they might both need.','Food, water, space or light.','Say "...like food or space."']]],
 'Competition is when organisms need the same limited resources, like food or space.','Competition is when...'),
SQ('rp3','ripple','What do decomposers do for an ecosystem?',[
 [['break* down','decompos*','break* up','rot*','eat* dead','recycl*','breakdown'],'You said they break things down. Good!',['What do fungi and worms do to dead leaves?','They break them down.','Say "Decomposers break down..."']],
 [['dead','waste*','remains','leaves','leaf','corpse*'],'You said what they break down. Great!',['What do they break down?','Dead plants and animals.','Say "...dead things."']],
 [['nutrient*','soil','matter','return*','recycl*','mineral*'],'You said they return nutrients. Excellent!',['Where does that matter go afterward?','It goes back into the soil as nutrients.','Say "...and return nutrients to the soil."']]],
 'Decomposers break down dead things and return nutrients to the soil.','Decomposers...'),
SQ('rp4','ripple','Where does the energy in a food chain come from at the very start?',[
 [['sun','sunlight','light','solar'],'You named the Sun. Great!',['What gives plants their energy?','The energy starts with the Sun.','Say "The Sun..."']],
 [['plant*','producer*','photosynth*','grass','algae','tree*'],'You named the producers. Good!',['Who captures that energy first?','Producers like plants capture it.','Say "...and plants capture it."']]],
 'The energy starts with the Sun, and producers like plants capture it.','The energy comes from...'),
/* ---- Pup Predictor ---- */
SQ('pp1','pup','What is the difference between a dominant allele and a recessive allele?',[
 [['dominant'],'You described the dominant allele.',['Write about the dominant allele first.','A dominant allele shows its trait with just one copy.','Use the word "dominant."']],
 [['recessive'],'You described the recessive allele.',['Now write about the recessive allele.','A recessive allele only shows with two copies.','Use the word "recessive."']],
 [['two','both','2','pair','copies','double'],'You said a recessive trait needs two copies. Excellent!',['How many copies of a recessive allele does it take for the trait to show?','It takes two copies.','Say "...only shows with two copies."']]],
 'A dominant allele shows its trait with just one copy, but a recessive allele only shows when there are two copies.','A dominant allele... but a recessive allele...'),
SQ('pp2','pup','What does a Punnett square show?',[
 [['chance*','possib*','probab*','predict*','likely','odds','percent*','could'],'You said it shows chances. Good!',['Does it show what WILL happen, or what COULD happen?','It shows the possible outcomes and their chances.','Say "...the chances of..."']],
 [['offspring','babies','baby','pup*','kids','children','trait*','genotype*','allele*','young'],'You said what the chances are about. Great!',['The chances of what?','The possible traits or genotypes of the offspring.','Say "...of the offspring."']]],
 'A Punnett square shows the possible genotypes of the offspring and the chance of each one.','A Punnett square shows...'),
SQ('pp3','pup','Why do brothers and sisters from the same parents look different from each other?',[
 [['two','both','mother','father','parents','mom','dad'],'You mentioned both parents. Good!',['Where do the genes come from?','Half come from each parent.','Say "...from both parents."']],
 [['mix*','combin*','different','half','each','random','chance','vary','varie*'],'You said each gets a different mix. Great!',['Does every child get the same genes from each parent?','Each child gets a different mix.','Say "...a different mix..."']],
 [['allele*','gene*','dna','trait*','chromosome*'],'You said it is about genes. Excellent!',['A different mix of what?','A different mix of genes.','Use the word "genes."']]],
 'Each child gets a different mix of genes from the two parents.','They look different because...'),
SQ('pp4','pup','How is asexual reproduction different from sexual reproduction?',[
 [['identical','same','copy','copies','clone*','exact'],'You described asexual reproduction. Good!',['What are the offspring of asexual reproduction like?','They are identical copies of the parent.','Say "Asexual reproduction makes identical..."']],
 [['two','both','mix*','different','variation','vary','varie*','combin*'],'You described sexual reproduction. Great!',['Sexual reproduction uses how many parents?','It mixes genes from two parents.','Say "...but sexual reproduction mixes genes from two parents."']]],
 'Asexual reproduction makes identical copies of one parent, but sexual reproduction mixes genes from two parents.','Asexual reproduction... but sexual reproduction...'),
/* ---- Island Drift ---- */
SQ('dr1','drift','Explain natural selection in your own words.',[
 [['surviv*','live*','alive','die*'],'You said who survives. Good!',['Which individuals stay alive?','The ones with helpful traits survive.','Say "...survive..."']],
 [['reproduc*','offspring','babies','young','pass*','children'],'You said they reproduce. Great!',['What do the survivors do next?','They reproduce and pass on their traits.','Say "...and reproduce."']],
 [['trait*','variation*','helpful','advantage','adapt*','better','fit*'],'You mentioned the helpful trait. Excellent!',['Why do those individuals survive?','They have a helpful trait.','Say "Individuals with helpful traits..."']]],
 'Individuals with helpful traits survive and reproduce more, so those traits become more common.','In natural selection, individuals with...',[{re:/(because|so) they (needed|wanted) to/,msg:'Careful! Living things do not change because they need to. Think about who survives.'}]),
SQ('dr2','drift','Did the light moths turn dark to hide on the sooty trees? Explain.',[
 [['no','not','didnt','didn t','couldnt','cannot','cant','never'],'You said no. Correct!',['Can a moth change its own wing color?','No, the moths did not change.','Start with "No, ..."']],
 [['surviv*','eaten','live*','reproduc*','alive','caught'],'You explained what really happened. Great!',['So why were there more dark moths?','The dark moths survived and reproduced more.','Say "...the dark moths survived."']]],
 'No, the moths did not change; the dark moths survived and reproduced more.','No, ...'),
SQ('dr3','drift','Why do antibiotics stop working against some bacteria over time?',[
 [['resist*','immune','not killed','survive the'],'You mentioned resistant bacteria. Good!',['Some bacteria are not killed by the medicine. What are they called?','They are resistant bacteria.','Use the word "resistant."']],
 [['surviv*','live*','left','not killed','alive'],'You said they survive. Great!',['What happens to the resistant bacteria when the medicine is used?','They survive.','Say "...survive..."']],
 [['reproduc*','multipl*','grow*','spread*','pass*','more','divid*'],'You said they multiply. Excellent!',['Then what do the survivors do?','They multiply, so more bacteria are resistant.','Say "...and multiply."']]],
 'Resistant bacteria survive the medicine and multiply, so more of them become resistant over time.','Antibiotics stop working because...',[{re:/(get|gets|got|become|became) used to/,msg:'Bacteria do not get used to the medicine. Think about which bacteria survive and multiply.'}]),
/* ---- Moonwatch ---- */
SQ('mw1','moon','Why does the Moon have phases?',[
 [['half','side','part','portion','amount','how much','some','more','less'],'You said we see different amounts. Good!',['Half of the Moon is always lit. Do we always see all of that half?','We see different amounts of the lit half.','Say "We see different amounts of..."']],
 [['lit','light','sun*','reflect*','bright'],'You mentioned sunlight. Great!',['What lights up the Moon?','The Sun lights up half of the Moon.','Say "...the sunlit half..."']],
 [['orbit*','around','circl*','revolv*','moves','position*'],'You said the Moon orbits. Excellent!',['Why does the amount we see change?','Because the Moon orbits Earth.','Say "...as it orbits Earth."']]],
 'We see different amounts of the Moon’s sunlit half as it orbits Earth.','The Moon has phases because...',[{re:/earth.?s shadow|shadow of (the )?earth/,msg:'Earth’s shadow only causes a lunar eclipse, not the phases. Think about the sunlit half of the Moon.'}]),
SQ('mw2','moon','What happens during a solar eclipse?',[
 [['moon'],'You named the Moon. Good!',['Which object moves into the way?','The Moon.','Use the word "Moon."']],
 [['between','block*','cover*','front','in the way','blocks'],'You said it blocks the Sun. Great!',['Where is the Moon?','It is between the Sun and Earth, blocking the light.','Say "...between the Sun and Earth."']],
 [['sun'],'You mentioned the Sun.',['What gets blocked?','The Sun’s light.','Use the word "Sun."']]],
 'During a solar eclipse, the Moon moves between the Sun and Earth and blocks the sunlight.','During a solar eclipse...'),
SQ('mw3','moon','What causes the seasons on Earth?',[
 [['tilt*','axis','lean*','angle','slant*'],'You named the tilt. Great!',['Earth’s axis is not straight up and down. What is it?','Earth’s axis is tilted.','Say "The tilt of Earth’s axis..."']],
 [['direct*','sunlight','light','energy','longer','daylight','day*','heat','sun'],'You said it changes the sunlight. Good!',['What does the tilt change?','It changes how directly sunlight hits us and how long the days are.','Say "...changes how directly sunlight hits..."']]],
 'The tilt of Earth’s axis changes how directly sunlight hits each hemisphere.','The seasons are caused by...',[{re:/^(?!.*\bnot\b).*\b(closer|nearer) to the sun/,msg:'Careful! Earth is actually closest to the Sun in January. Seasons are not caused by distance.'}]),
/* ---- Deep Time ---- */
SQ('st1','strata','What is the law of superposition?',[
 [['bottom','lower','deeper','below','under*','beneath','deepest'],'You talked about the bottom layers. Good!',['Where are the oldest layers?','The oldest layers are at the bottom.','Say "The bottom layers..."']],
 [['older','oldest','first','earlier','before'],'You said they are older. Great!',['Are the bottom layers older or younger?','They are older.','Say "...are the oldest."']]],
 'In undisturbed rock, the bottom layers are the oldest and the top layers are the youngest.','The law of superposition says...'),
SQ('st2','strata','A fault cuts through three rock layers. Is the fault older or younger than the layers? Explain.',[
 [['younger','after','later','newer','more recent'],'You said younger. Correct!',['Which came first: the layers or the crack through them?','The fault is younger.','Say "The fault is younger..."']],
 [['cut*','break*','broke','crack*','through','already','exist*','there first','before'],'You explained why. Great!',['Why must the layers be older?','The layers had to be there before the fault could cut them.','Say "...because the layers had to be there first."']]],
 'The fault is younger because the layers had to be there before it could cut through them.','The fault is...',[{re:/fault is older|older than the layers/,msg:'Think again: can a crack break rock that does not exist yet?'}]),
SQ('st3','strata','How do fossils help scientists learn about Earth’s history?',[
 [['age','old','older','when','time','history','date*','order','past','long ago'],'You talked about time. Good!',['What can fossils tell us about the past?','They show what lived long ago and when.','Say "...what lived in the past."']],
 [['layer*','rock*','life','organism*','animal*','living','change*','plant*'],'You connected it to life or rock layers. Great!',['What can they show about living things?','They show how life changed over time.','Say "...how life has changed."']]],
 'Fossils show what lived in the past, and the rock layers show the order in which life changed over time.','Fossils help because...'),
/* ---- Pangaea Rebuild ---- */
SQ('pg1','pangaea','What evidence shows that the continents were once joined together?',[
 [['fossil*'],'You named fossils. Good!',['What remains of ancient living things are found on many continents?','The same fossils.','Use the word "fossils."']],
 [['same','match*','similar','both','line up','fit*','identical'],'You said they match. Great!',['How do the fossils on different continents compare?','They are the same kinds.','Say "the same..."']],
 [['continent*','rock*','coast*','land*','ocean*'],'You mentioned where. Excellent!',['Where are they found?','On continents now separated by oceans.','Say "...on different continents."']]],
 'The same fossils and matching rocks are found on continents that are now far apart, and their coastlines fit together.','The evidence is...'),
SQ('pg2','pangaea','Why are Mesosaurus fossils good evidence that Africa and South America were once joined?',[
 [['fresh*','swim','could not','cant','couldnt','cannot','ocean','small'],'You explained that it could not cross the ocean. Good!',['Could a small freshwater reptile swim across an ocean?','No, it could not cross an ocean.','Say "Mesosaurus could not swim across an ocean..."']],
 [['joined','connect*','together','attached','touch*','one','same land','pangaea'],'You concluded they were joined. Great!',['So what must have been true about the continents?','They must have been joined.','Say "...so the continents were joined."']]],
 'Mesosaurus could not swim across an ocean, so the continents must have been joined.','Mesosaurus fossils show...'),
SQ('pg3','pangaea','What happens where two plates move apart under the ocean?',[
 [['magma','lava','molten','melt*','hot rock'],'You mentioned magma. Good!',['What rises up into the gap?','Magma rises up.','Say "Magma rises..."']],
 [['new','form*','crust','sea floor','seafloor','ridge','cool*','harden*'],'You said new sea floor forms. Great!',['What does the magma become?','It cools into new sea floor.','Say "...and cools into new sea floor."']]],
 'Magma rises and cools to form new sea floor at a mid-ocean ridge.','Where plates move apart...'),
/* ---- Weather Desk ---- */
SQ('wd1','weather','What usually happens when a cold front passes a city?',[
 [['colder','cool*','drop*','fall*','lower','chill*','cold'],'You said it gets colder. Good!',['What happens to the temperature after a cold front?','It gets colder.','Say "...the temperature drops."']],
 [['rain*','storm*','thunder*','shower*','precip*','snow*'],'You mentioned storms. Great!',['What weather comes as the front passes?','Rain or thunderstorms.','Say "...there are storms..."']]],
 'When a cold front passes, there are often storms and then the temperature drops.','When a cold front passes...'),
SQ('wd2','weather','What is an air mass?',[
 [['large','huge','big','body','giant','lot','area'],'You said it is a large body of air. Good!',['Is an air mass small or huge?','It is a huge body of air.','Say "a large body of air..."']],
 [['same','similar','temperature','humid*','moist*','properties'],'You described its properties. Great!',['What is the same throughout an air mass?','Its temperature and humidity.','Say "...with the same temperature and humidity."']]],
 'An air mass is a large body of air with about the same temperature and humidity throughout.','An air mass is...'),
SQ('wd3','weather','Why does a sea breeze blow from the ocean on a sunny day?',[
 [['land','ground','sand','beach'],'You mentioned the land. Good!',['Which heats up faster in the sun: land or water?','The land heats up faster.','Say "The land heats up..."']],
 [['heat*','warm*','hotter','faster','quickly'],'You said it heats faster. Great!',['How does the land compare with the water?','It warms faster.','Say "...heats up faster than the water."']],
 [['rise*','up','replace*','flow*','move*','cool*','in'],'You explained the air moving. Excellent!',['What does the warm air over the land do?','It rises, and cool ocean air flows in.','Say "...warm air rises and cool air flows in."']]],
 'The land heats faster than the water, so warm air over the land rises and cool ocean air flows in.','A sea breeze happens because...'),
SQ('wd4','weather','How does lake-effect snow form?',[
 [['cold'],'You mentioned cold air. Good!',['What kind of air crosses the lake?','Cold air.','Use the word "cold."']],
 [['lake','water','warm*','moist*','evaporat*','vapor'],'You said the lake adds moisture. Great!',['What does the cold air pick up from the lake?','Heat and moisture from the warmer lake water.','Say "...picks up moisture from the warm lake."']],
 [['snow*','cloud*','downwind','fall*','drop*','dump*'],'You said it snows. Excellent!',['Then what happens on the other side?','It drops heavy snow downwind.','Say "...and snows downwind."']]],
 'Cold air crosses the warmer lake, picks up moisture, and then drops heavy snow downwind.','Lake-effect snow forms when...'),
/* ---- Space Courier ---- */
SQ('sc1','courier','What happens to a moving object in space if no force acts on it?',[
 [['keep*','continu*','stay*','same','constant','forever','doesnt stop','does not stop','never stop','wont stop','will not stop'],'You said it keeps going. Great!',['Does it slow down, or keep going?','It keeps moving.','Say "It keeps moving..."']],
 [['mov*','speed','motion','going','direction','velocity'],'You described its motion. Good!',['Keeps doing what?','It keeps moving at the same speed and direction.','Say "...at the same speed."']]],
 'It keeps moving at the same speed in the same direction.','If no force acts on it...'),
SQ('sc2','courier','Two space pods get the same push. One pod is twice as heavy. How does its change in speed compare?',[
 [['half','less','smaller','slower','not as','lower'],'You said it changes less. Good!',['Does the heavy pod speed up more or less?','It speeds up less: half as much.','Say "It speeds up half as much..."']],
 [['mass','heav*','weigh*','more matter','crates'],'You explained it is the mass. Great!',['Why does it change less?','Because it has more mass.','Say "...because it has more mass."']]],
 'The heavier pod speeds up only half as much because it has more mass.','The heavier pod...'),
SQ('sc3','courier','Why does a pod in space need a force to stop?',[
 [['force','push','thrust*','burn','engine'],'You mentioned a force. Good!',['What does it take to change motion?','A force.','Use the word "force."']],
 [['change*','stop*','slow*','motion','speed','keep'],'You connected it to changing motion. Great!',['What is stopping?','Stopping is a change in motion.','Say "...because stopping is a change in motion."']]],
 'A force is needed to change motion, and stopping is a change in motion.','A pod needs a force to stop because...'),
/* ---- Keep It Frozen ---- */
SQ('kf1','frozen','Why is foam a good material for a cooler?',[
 [['insulat*','slow*','trap*','air','poor conductor','doesnt conduct','does not conduct','block*'],'You said it insulates. Great!',['Does foam let heat through easily?','Foam is an insulator: it slows heat down.','Say "Foam is an insulator..."']],
 [['heat','energy','thermal','warm*'],'You mentioned heat. Good!',['What does foam slow down?','It slows heat from getting in.','Say "...slows down heat."']]],
 'Foam is an insulator with trapped air, so it slows heat from moving into the cooler.','Foam is good because...'),
SQ('kf2','frozen','Which way does heat flow between a warm room and cold ice cream?',[
 [['warm*','hot*','room'],'You named the warm side. Good!',['Where does the heat start?','In the warm room.','Say "from the warm room..."']],
 [['cold*','ice','cream','colder'],'You named the cold side. Great!',['Where does the heat go?','Into the cold ice cream.','Say "...into the cold ice cream."']],
 [['flow*','move*','travel*','go*','transfer*','pass*'],'You described the flow. Excellent!',['What does the heat do?','It flows.','Say "Heat flows..."']]],
 'Heat flows from the warm room into the cold ice cream.','Heat flows...',[{re:/\bcold(ness)? (flows|moves|goes|travels)/,msg:'Careful! Cold does not flow. Heat (energy) always flows from warmer to colder.'}]),
SQ('kf3','frozen','Why does a big pot of water take longer to heat up than a small cup?',[
 [['mass','more water','bigger','more matter','heavier','larger','more of'],'You mentioned the mass. Good!',['What is different about the pot?','It has more mass (more water).','Say "The big pot has more mass..."']],
 [['energy','heat'],'You mentioned energy. Great!',['What does more mass need?','More energy to warm up.','Say "...so it needs more energy."']]],
 'The big pot has more mass, so it needs more energy to warm up.','The big pot takes longer because...'),
/* ---- Field Golf ---- */
SQ('fg1','fields','What do like charges and opposite charges do to each other?',[
 [['like','same'],'You described like charges.',['Start with two charges that are the same.','Like charges...','Say "Like charges..."']],
 [['repel*','push* away','push* apart','push'],'You said they repel. Great!',['Do like charges push or pull?','Like charges repel (push apart).','Say "...repel."']],
 [['attract*','pull*'],'You said opposites attract. Excellent!',['What do opposite charges do?','Opposite charges attract.','Say "...and opposite charges attract."']]],
 'Like charges repel each other, and opposite charges attract each other.','Like charges... and opposite charges...'),
SQ('fg2','fields','How does distance change the strength of an electric or magnetic force?',[
 [['closer','near*','distance','far*','apart'],'You talked about distance. Good!',['Think about objects close together and far apart.','Closer objects...','Say "The closer..."']],
 [['strong*','weak*','bigger','smaller','more','less','harder'],'You described the strength. Great!',['Is the force stronger or weaker when they are closer?','The closer they are, the stronger the force.','Say "...the stronger the force."']]],
 'The closer the objects are, the stronger the force; farther apart, the weaker it is.','As distance changes...'),
SQ('fg3','fields','How can a magnet pull a steel ball without touching it?',[
 [['field'],'You named the field. Great!',['A magnet has an invisible region around it. What is it called?','A magnetic field.','Say "magnetic field."']],
 [['distance','touch*','space','around','invisible','without','apart','away'],'You said it works at a distance. Good!',['Does the field need contact?','It acts from a distance, without touching.','Say "...from a distance."']]],
 'A magnet has a magnetic field that can push or pull objects from a distance.','A magnet can do this because...'),
/* ---- Wave Tuner ---- */
SQ('wv1','waves','What is the amplitude of a wave?',[
 [['height','tall*','high*','distance','how far','size'],'You said it is a height. Good!',['Is amplitude a length across, or a height?','It is a height.','Say "the height..."']],
 [['middle','rest','center','line','zero','normal'],'You said where to measure from. Great!',['Where do you start measuring?','From the middle line (the rest position).','Say "...from the middle line..."']],
 [['crest','top','peak'],'You said where to measure to. Excellent!',['Where do you stop measuring?','At the top of a crest.','Say "...to the crest."']]],
 'Amplitude is the height from the middle line to the top of a crest.','Amplitude is...'),
SQ('wv2','waves','How does the amplitude of a wave affect its energy?',[
 [['bigger','larger','more','higher','taller','increas*','greater'],'You said bigger. Good!',['What kind of amplitude carries more energy?','A bigger amplitude.','Say "A bigger amplitude..."']],
 [['energy'],'You mentioned energy. Great!',['What does it carry more of?','More energy.','Use the word "energy."']]],
 'A wave with a bigger amplitude carries more energy.','The bigger the amplitude...'),
SQ('wv3','waves','On the same rope, what happens to the wavelength if you shake the rope faster?',[
 [['short*','smaller','less','decreas*','closer'],'You said it gets shorter. Great!',['Do the waves get longer or shorter?','They get shorter.','Say "...gets shorter."']],
 [['wavelength','waves','wave'],'You named the wavelength. Good!',['What gets shorter?','The wavelength.','Use the word "wavelength."']]],
 'If you shake the rope faster, the wavelength gets shorter.','If you shake it faster...')
);

/* ---- Live Quiz banks for the other subjects: [question, right answer, wrong, wrong, wrong] ---- */
const LQ_BANK={
 life:[
  ['What is the basic unit of all living things?','The cell','The atom','The organ','The tissue'],
  ['Which part controls what goes in and out of a cell?','Cell membrane','Nucleus','Cell wall','Vacuole'],
  ['Which part holds a cell’s DNA?','Nucleus','Ribosome','Cell membrane','Cytoplasm'],
  ['Which part releases energy from food?','Mitochondria','Chloroplast','Vacuole','Cell wall'],
  ['Which part makes food using sunlight?','Chloroplast','Mitochondria','Nucleus','Ribosome'],
  ['Which of these do plant cells have but animal cells do NOT?','Cell wall','Nucleus','Cell membrane','Mitochondria'],
  ['Bacteria are different from plant and animal cells because they have no...','Nucleus','Cell membrane','DNA','Ribosomes'],
  ['In a food chain, arrows point from...','The food to the eater','The eater to the food','Big animals to small ones','The sun to the decomposers'],
  ['Where does the energy in almost every food chain start?','The Sun','The soil','Water','Decomposers'],
  ['If wolves are removed from an area, what will most likely happen to the deer?','Their numbers go up','Their numbers go down','They stop eating','They turn into wolves'],
  ['Two species need the same food. This is called...','Competition','Mutualism','Predation','Photosynthesis'],
  ['Bees get nectar and flowers get pollinated. This relationship is...','Mutualism','Competition','Predation','Parasitism'],
  ['What do decomposers do?','Break down dead things and recycle nutrients','Make food from sunlight','Hunt other animals','Pollinate flowers'],
  ['A brown dog is bb. A black dog is BB. What color will their pups be?','All black','All brown','Half black, half brown','Gray'],
  ['Bb × Bb. What is the chance of a bb pup?','25%','50%','75%','0%'],
  ['A dominant allele...','Shows its trait with just one copy','Only shows with two copies','Never shows','Is always harmful'],
  ['Offspring from asexual reproduction are...','Identical to the parent','A mix of two parents','Always smaller','Always different from the parent'],
  ['Which gives more variety among offspring?','Sexual reproduction','Asexual reproduction','Cloning','Budding'],
  ['In natural selection, which individuals pass on their traits most?','Those that survive and reproduce more','The biggest ones','The oldest ones','The ones that try hardest'],
  ['Why did dark moths increase on sooty trees?','Birds saw and ate more light moths','The moths painted themselves','The soot dyed the moths','The moths wanted to be dark'],
  ['Antibiotic-resistant bacteria become common because...','Resistant ones survive and multiply','Bacteria get used to medicine','Medicine turns into bacteria','Bacteria learn to hide'],
  ['In rock layers, fossils in lower layers are usually...','Older','Younger','The same age','Made of plastic']],
 earth:[
  ['What causes the phases of the Moon?','How much of the Moon’s lit half we see','Earth’s shadow on the Moon','Clouds covering the Moon','The Moon changing shape'],
  ['During a full moon, where is the Moon?','On the opposite side of Earth from the Sun','Between Earth and the Sun','Behind the Sun','Next to the Sun'],
  ['A solar eclipse happens when...','The Moon blocks the Sun from Earth','Earth blocks the Sun from the Moon','The Sun goes out','Clouds cover the Sun'],
  ['A lunar eclipse can only happen during a...','Full moon','New moon','First quarter','Crescent moon'],
  ['What causes Earth’s seasons?','The tilt of Earth’s axis','Earth’s distance from the Sun','The Moon’s phases','Ocean currents'],
  ['When it is summer in New York, it is ___ in Australia.','Winter','Summer','Spring','Also summer'],
  ['About how long does the Moon take to go through all its phases?','About 29.5 days','About 7 days','About 365 days','About 24 hours'],
  ['In undisturbed rock layers, the oldest layer is...','At the bottom','At the top','In the middle','Anywhere'],
  ['A fault cuts through layers A, B and C. The fault is...','Younger than A, B and C','Older than A, B and C','The same age as A','Older than everything'],
  ['Sediment is always laid down in layers that are...','Flat','Tilted','Folded','Vertical'],
  ['The supercontinent made of all the continents joined together was called...','Pangaea','Atlantis','Gondwana Prime','Laurasia Max'],
  ['Mesosaurus fossils in Africa and South America show that...','The continents were once joined','Mesosaurus could fly','Oceans used to be dry land everywhere','The fossils were moved by people'],
  ['What forms where two ocean plates pull apart?','A mid-ocean ridge','A deep trench','Tall folded mountains','A desert'],
  ['The Himalayas formed when...','Two continents crashed together','Two plates pulled apart','A volcano erupted','Glaciers piled up rock'],
  ['Sea floor rock is youngest...','Near the mid-ocean ridge','Near the coasts','At the North Pole','Deep under continents'],
  ['When a cold front passes, the weather usually becomes...','Stormy, then colder','Warmer and humid','Foggy for a week','Exactly the same'],
  ['An air mass that forms over the Gulf of Mexico is...','Warm and humid','Cold and dry','Cold and humid','Hot and dry'],
  ['High pressure (H) usually brings...','Clear, dry weather','Thunderstorms','Hurricanes','Heavy snow'],
  ['Lake-effect snow falls...','Downwind of the lake','Upwind of the lake','Only on the lake','Only at night'],
  ['On a sunny afternoon at the beach, the wind usually blows...','From the ocean toward the land','From the land toward the ocean','Straight up','Not at all'],
  ['Why are coastal cities milder than inland cities?','Water warms and cools slowly','The ocean is always warm','Coasts get less sunlight','People live there'],
  ['The Gulf Stream is a...','Warm ocean current','Cold wind','Mountain range','River in Florida']],
 phys:[
  ['An object moving in space with no forces on it will...','Keep moving at the same speed','Slow down and stop','Speed up','Fall to Earth'],
  ['The same push is given to a light cart and a heavy cart. Which speeds up more?','The light cart','The heavy cart','They speed up the same','Neither moves'],
  ['To stop a moving object, you need...','A force opposite to its motion','No force at all','A force in the same direction','More mass'],
  ['Like electric charges...','Repel each other','Attract each other','Do nothing','Cancel out'],
  ['How does distance affect magnetic force?','Closer = stronger','Closer = weaker','Distance does not matter','Farther = stronger'],
  ['A magnet’s S pole near a steel paper clip will...','Attract it','Repel it','Melt it','Do nothing'],
  ['At the top of a roller coaster hill, the cart has the most...','Potential energy','Kinetic energy','Heat energy','Sound energy'],
  ['As a cart rolls down a hill, potential energy changes into...','Kinetic energy','Chemical energy','Nuclear energy','Mass'],
  ['Friction turns some motion energy into...','Heat','Light','Mass','Electric charge'],
  ['Heat always flows from...','Warmer objects to colder objects','Colder objects to warmer objects','Small objects to big objects','Up to down'],
  ['Which material is the best insulator?','Foam','Aluminum','Copper','Steel'],
  ['Which gets hotter with the same energy: 1 kg of sand or 1 kg of water?','Sand','Water','They heat the same','Neither heats up'],
  ['A bigger mass of water needs ___ energy to warm up by the same amount.','More','Less','The same','No'],
  ['Dark colors in sunlight...','Absorb more energy','Reflect more energy','Stay colder','Make their own light'],
  ['The amplitude of a wave is measured from...','The middle line to the crest','Crest to trough','Crest to crest','Trough to trough'],
  ['A wave with a bigger amplitude carries...','More energy','Less energy','The same energy','No energy'],
  ['If you double a wave’s amplitude, its energy becomes...','4 times as much','2 times as much','Half as much','The same'],
  ['On the same rope, a higher frequency means a ___ wavelength.','Shorter','Longer','Same','Wavy'],
  ['A louder sound has a bigger...','Amplitude','Wavelength','Speed','Pitch'],
  ['A mirror ___ light.','Reflects','Absorbs','Creates','Destroys'],
  ['In a series circuit, if one bulb burns out, the others...','Go out too','Get brighter','Stay on','Change color'],
  ['In a parallel circuit, each bulb...','Has its own path','Shares one path','Needs its own battery','Is always off']]
};
function lqSubjectQs(subj,n){
  const bank=shuffle(LQ_BANK[subj]||[]),out=[];
  for(let i=0;i<n;i++){const q=bank[i%bank.length],opts=shuffle(q.slice(1));out.push({type:'mc',label:q[0],text:'',choices:opts,answer:opts.indexOf(q[1])});}
  return out;
}

/* ---- Quiz Board Maker: Life Science and Earth & Space standards and clue sets ---- */
JP_STD.push(
  {c:'MS-LS1-1',t:'Cells',g:'Life: Molecules to Organisms'},{c:'MS-LS1-2',t:'Cell Parts',g:'Life: Molecules to Organisms'},{c:'MS-LS1-6',t:'Photosynthesis',g:'Life: Molecules to Organisms'},
  {c:'MS-LS2-2',t:'Ecosystem Interactions',g:'Life: Ecosystems'},{c:'MS-LS2-3',t:'Matter & Energy in Ecosystems',g:'Life: Ecosystems'},{c:'MS-LS2-4',t:'Ecosystem Changes',g:'Life: Ecosystems'},
  {c:'MS-LS3-2',t:'Heredity & Reproduction',g:'Life: Heredity & Evolution'},{c:'MS-LS4-1',t:'Fossil Record',g:'Life: Heredity & Evolution'},{c:'MS-LS4-4',t:'Natural Selection',g:'Life: Heredity & Evolution'},
  {c:'MS-ESS1-1',t:'Moon, Eclipses & Seasons',g:'Earth & Space'},{c:'MS-ESS1-4',t:'Rock Layers & Geologic Time',g:'Earth & Space'},{c:'MS-ESS2-3',t:'Plate Tectonics',g:'Earth & Space'},
  {c:'MS-ESS2-4',t:'Water Cycle',g:'Earth & Space'},{c:'MS-ESS2-5',t:'Weather & Air Masses',g:'Earth & Space'},{c:'MS-ESS2-6',t:'Climate & Oceans',g:'Earth & Space'}
);
JP_BANK.push(
 {n:'Cells',s:'MS-LS1-1',k:[['The smallest unit of life.','A cell.'],['A living thing made of just one cell.','A unicellular (single-celled) organism.'],['The tool scientists use to see cells.','A microscope.'],['A living thing made of many cells, like you.','A multicellular organism.'],['Name the three parts of the cell theory.','All living things are made of cells, the cell is the basic unit of life, and cells come from other cells.']]},
 {n:'Cell Parts',s:'MS-LS1-2',k:[['The control center of the cell that holds DNA.','The nucleus.'],['The part that controls what enters and leaves the cell.','The cell membrane.'],['The "powerhouse" that releases energy from food.','The mitochondria.'],['Two parts plant cells have that animal cells do not.','A cell wall and chloroplasts (also a large vacuole).'],['Why do muscle cells have so many mitochondria?','They use lots of energy to contract.']]},
 {n:'Photosynthesis',s:'MS-LS1-6',k:[['The process plants use to make food from sunlight.','Photosynthesis.'],['The cell part where photosynthesis happens.','The chloroplast.'],['The gas plants take in for photosynthesis.','Carbon dioxide.'],['The two products of photosynthesis.','Sugar (glucose) and oxygen.'],['Why do plants still need mitochondria?','To release the energy stored in the sugar they make.']]},
 {n:'Food Webs',s:'MS-LS2-2',k:[['A living thing that makes its own food, like grass.','A producer.'],['An animal that eats other animals.','A predator (a carnivore).'],['Two species that need the same limited food.','Competition.'],['Bees and flowers both benefit from each other. This is called...','Mutualism.'],['If the hawks in a food chain disappear, what happens to the mice they ate?','The mice increase because fewer are eaten.']]},
 {n:'Energy & Matter Cycles',s:'MS-LS2-3',k:[['The source of energy for almost every food chain.','The Sun.'],['Living things like fungi and worms that break down dead matter.','Decomposers.'],['What decomposers return to the soil.','Nutrients (matter).'],['In a food chain, arrows show the flow of this.','Energy (and matter).'],['Why is there less energy at each step up a food chain?','Living things use most of the energy to live and lose some as heat.']]},
 {n:'Ecosystem Changes',s:'MS-LS2-4',k:[['A species brought to a new place where it spreads and causes harm.','An invasive species.'],['A long dry period with little rain.','A drought.'],['When wolves returned to Yellowstone, this animal decreased.','Elk.'],['After elk decreased in Yellowstone, these trees grew back along rivers.','Willows.'],['Name an invasive species found in New York lakes.','Zebra mussels.']]},
 {n:'Heredity',s:'MS-LS3-2',k:[['Different forms of a gene, like B and b.','Alleles.'],['An allele that shows its trait even with one copy.','A dominant allele.'],['The chart used to predict offspring traits.','A Punnett square.'],['Bb × Bb: the chance of a bb offspring.','25%.'],['Why are offspring of sexual reproduction different from each other?','Each gets a different mix of alleles from two parents.']]},
 {n:'Fossils',s:'MS-LS4-1',k:[['The preserved remains or traces of ancient life.','Fossils.'],['Where the oldest fossils are found in undisturbed rock layers.','In the bottom layers.'],['The record of life found in rock layers.','The fossil record.'],['A fossil that helps date rock layers because it lived a short time over a wide area.','An index fossil.'],['What does the fossil record show about life on Earth?','Life has changed over time.']]},
 {n:'Natural Selection',s:'MS-LS4-4',k:[['Differences among individuals of the same species.','Variations.'],['The process where individuals with helpful traits survive and reproduce more.','Natural selection.'],['On sooty trees, which peppered moths survived better?','The dark moths.'],['Do individual animals change their traits because they need to?','No. The population changes because some survive and reproduce more.'],['Why do antibiotics stop working against some bacteria?','Resistant bacteria survive and multiply.']]},
 {n:'Moon & Seasons',s:'MS-ESS1-1',k:[['The phase when the Moon’s whole lit side faces Earth.','A full moon.'],['The Moon blocks the Sun from part of Earth.','A solar eclipse.'],['About how many days from one full moon to the next?','About 29.5 days.'],['What causes Earth’s seasons?','The tilt of Earth’s axis.'],['Why isn’t there a solar eclipse every month?','The Moon’s orbit is tilted, so it usually passes above or below the Sun.']]},
 {n:'Rock Layers',s:'MS-ESS1-4',k:[['In undisturbed layers, the oldest rock is here.','At the bottom.'],['The rule that lower layers are older.','The law of superposition.'],['A crack where rock has moved.','A fault.'],['A fault cuts layers A to C. Is it older or younger than them?','Younger.'],['A wavy line where rock was worn away, showing missing time.','An unconformity (an erosion surface).']]},
 {n:'Plate Tectonics',s:'MS-ESS2-3',k:[['The supercontinent from about 250 million years ago.','Pangaea.'],['The scientist who proposed continental drift.','Alfred Wegener.'],['What forms where ocean plates pull apart?','A mid-ocean ridge.'],['Where is the youngest sea floor?','Next to the mid-ocean ridge.'],['Why do earthquakes and volcanoes form lines on a world map?','They happen mostly at plate boundaries.']]},
 {n:'Water Cycle',s:'MS-ESS2-4',k:[['Liquid water turning into water vapor.','Evaporation.'],['Water vapor cooling into tiny droplets in clouds.','Condensation.'],['Rain, snow, sleet or hail.','Precipitation.'],['What powers evaporation in the water cycle?','Energy from the Sun.'],['What pulls precipitation and runoff back down to the oceans?','Gravity.']]},
 {n:'Weather',s:'MS-ESS2-5',k:[['The edge where a cold air mass pushes into warm air.','A cold front.'],['A huge body of air with the same temperature and humidity.','An air mass.'],['The weather symbol H stands for this.','High pressure.'],['What weather usually comes with a low-pressure system?','Clouds and rain (or snow).'],['What weather often comes as a cold front passes?','Storms, then colder temperatures.']]},
 {n:'Climate & Oceans',s:'MS-ESS2-6',k:[['The warm ocean current that flows from the Gulf of Mexico toward Europe.','The Gulf Stream.'],['Wind blowing from the ocean onto land on a sunny day.','A sea breeze.'],['Which heats up faster in the sun: land or water?','Land.'],['Heavy snow that forms downwind of the Great Lakes.','Lake-effect snow.'],['Why do coastal cities have milder climates than inland cities?','Water warms and cools slowly, so the ocean keeps the air milder.']]}
);
JP_FINALS.push(
 ['MS-LS4-4','Natural Selection','Explain why a population can change over many generations even though no individual changes its traits.','Individuals with helpful traits survive and reproduce more, so those traits become more common in the population.'],
 ['MS-ESS1-1','Seasons','Earth is closest to the Sun in January. Explain why New York still has winter then.','Seasons are caused by the tilt of Earth’s axis. In January the Northern Hemisphere tilts away from the Sun.'],
 ['MS-ESS2-3','Plate Tectonics','Give two kinds of evidence that the continents were once joined.','Matching fossils (like Mesosaurus) and matching rock layers or mountain belts on continents now far apart; coastlines that fit; glacier scratches.']
);
