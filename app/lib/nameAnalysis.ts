export type Gender = 'Female' | 'Male' | 'Unknown';
export type Nationality = string;

// Finnish female first names
const finnishFemale = new Set([
  'aino','aino-kaisa','aino-maija','aisa','anu','anna','anna-kaisa','anna-maija',
  'eeva','eija','eija-liisa','elina','erika','hannele','heini','helena','heli',
  'inkeri','irja','jaana','johanna','kaarina','kaisa','kati','kaija','kirsi',
  'kristiina','laura','leena','leevi','liisa','maarit','maija','minna','mirja',
  'niina','nora','outi','päivi','pirjo','riitta','riikka','sanna','sari','saara',
  'seija','sinikka','sofia','susanna','taru','terhi','tuija','tuulia','tuulikki',
  'ulla','ulla-maija','ulrika','virpi','katja','marianne','mervi','tiina','taina',
  'pilvi','asta','reetta','asel'
]);

// Finnish male first names
const finnishMale = new Set([
  'ahti','aleksi','anssi','antero','arto','esa','erkki','harri','hannu','heikki',
  'ilkka','jaakko','jarkko','jari','jari-pekka','jouni','juho','juhani','juha',
  'jukka','kari','kimmo','lauri','matti','markus','mikko','mikael','olli','osmo',
  'pasi','paavo','pekka','pentti','petri','petteri','raimo','risto','sami',
  'taavi','timo','tommi','tuomas','uolevi','vesa','ville','olavi','jarmo',
  'eero','eerik','arvo','veikko','aimo','pertti','jouko','tapio','seppo',
  'leevi','jyrki','keijo','kalevi','urho','lauri'
]);

// Swedish/Finland-Swedish names
const swedishFemale = new Set([
  'bettina','catharina','eva','ingrid','kristina','maria','sofia','anne','erika',
  'helena','linnea','margareta','maja','anna','stina','ulrika'
]);
const swedishMale = new Set([
  'carl-gustav','carl','erik','göran','hans','henrik','jan','johan','jonas',
  'lars','lars-erik','magnus','martin','mikael','nils','peter','rolf','stefan',
  'sven','tobias','patrick','gustav'
]);

// Anglo / International
const angloFemale = new Set(['sarah','emma','emily','jessica','claire','rachel','kate','amy']);
const angloMale = new Set(['james','john','michael','robert','david','richard','william','thomas','lukas','bernhard']);

// Arabic
const arabicFemale = new Set(['amira','fatima','layla','nadia','rania','sara','yasmin','zeinab','aisha']);
const arabicMale = new Set(['ahmed','ali','faisal','hassan','khalid','mohammed','omar','youssef','ibrahim']);

// East Asian
const asianFemale = new Set(['mei-ling','yuki','akiko','haruko','keiko','naoko','sakura','yoko','ling','wei']);
const asianMale = new Set(['hiroshi','kenji','takeshi','yuki','chen','jun','wei','ming']);

// South Asian
const southAsianFemale = new Set(['priya','ananya','deepa','kavya','meera','nisha','pooja','rina','sunita']);
const southAsianMale = new Set(['arjun','deepak','rahul','rajesh','ravi','sanjay','suresh','vikram']);

// African
const africanMale = new Set(['oluwaseun','emeka','chibuike','kwame','kofi','seun','tunde']);
const africanFemale = new Set(['amaka','chioma','ngozi','adaeze','fatou']);

// Slavic
const slavicFemale = new Set(['asel','natasha','olga','tatiana','irina','oksana','katya']);
const slavicMale = new Set(['ivan','viktor','aleksandr','dmitri','sergei','nikolai','andrei','lukas']);

// Latin/Hispanic
const latinFemale = new Set(['maria','sofia','isabella','valentina','camila','lucia','elena']);
const latinMale = new Set(['tomás','tomas','carlos','diego','jose','luis','miguel','pedro','alejandro']);

// German
const germanFemale = new Set(['nora','sophie','lisa','julia','anna','katharina','franziska']);
const germanMale = new Set(['lukas','felix','maximilian','alexander','sebastian','philipp','bernhard','stephan']);

type NameEntry = { gender: Gender; nationality: string };

function normalise(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/å/g, 'a').replace(/é/g, 'e').replace(/ó/g, 'o')
    .replace(/í/g, 'i').replace(/ú/g, 'u').replace(/á/g, 'a')
    .trim();
}

function checkSets(
  first: string,
  pairs: Array<{ set: Set<string>; gender: Gender; nationality: string }>
): NameEntry | null {
  for (const { set, gender, nationality } of pairs) {
    if (set.has(first)) return { gender, nationality };
  }
  return null;
}

export function inferGenderAndNationality(fullName: string): NameEntry {
  const parts = fullName.trim().split(/\s+/);
  const rawFirst = parts[0];
  const first = normalise(rawFirst);

  const checks: Array<{ set: Set<string>; gender: Gender; nationality: string }> = [
    { set: finnishFemale, gender: 'Female', nationality: 'Finnish' },
    { set: finnishMale,   gender: 'Male',   nationality: 'Finnish' },
    { set: swedishFemale, gender: 'Female', nationality: 'Finnish-Swedish' },
    { set: swedishMale,   gender: 'Male',   nationality: 'Finnish-Swedish' },
    { set: arabicFemale,  gender: 'Female', nationality: 'Arabic/Middle Eastern' },
    { set: arabicMale,    gender: 'Male',   nationality: 'Arabic/Middle Eastern' },
    { set: asianFemale,   gender: 'Female', nationality: 'East Asian' },
    { set: asianMale,     gender: 'Male',   nationality: 'East Asian' },
    { set: southAsianFemale, gender: 'Female', nationality: 'South Asian' },
    { set: southAsianMale,   gender: 'Male',   nationality: 'South Asian' },
    { set: africanFemale, gender: 'Female', nationality: 'African' },
    { set: africanMale,   gender: 'Male',   nationality: 'African' },
    { set: slavicFemale,  gender: 'Female', nationality: 'Slavic/Eastern European' },
    { set: slavicMale,    gender: 'Male',   nationality: 'Slavic/Eastern European' },
    { set: latinFemale,   gender: 'Female', nationality: 'Latin/Hispanic' },
    { set: latinMale,     gender: 'Male',   nationality: 'Latin/Hispanic' },
    { set: germanFemale,  gender: 'Female', nationality: 'German' },
    { set: germanMale,    gender: 'Male',   nationality: 'German' },
    { set: angloFemale,   gender: 'Female', nationality: 'Anglo' },
    { set: angloMale,     gender: 'Male',   nationality: 'Anglo' },
  ];

  const hit = checkSets(first, checks);
  if (hit) return hit;

  // Heuristic fallback by suffix
  const gender = inferGenderBySuffix(first);
  return { gender, nationality: 'Unknown' };
}

function inferGenderBySuffix(name: string): Gender {
  // Common feminine endings in Finnish/Nordic
  if (/[aäe]$/.test(name)) return 'Female';
  if (/nen$/.test(name)) return 'Unknown'; // Finnish surname pattern
  if (/[io]$/.test(name)) return 'Male';
  return 'Unknown';
}

export function categorisePosition(position: string): string {
  const p = position.toLowerCase();
  if (/director|ceo|executive director/.test(p)) return 'Leadership';
  if (/chief curator|head of collections|head of/.test(p)) return 'Leadership';
  if (/senior curator|curator|guest curator/.test(p)) return 'Curatorial';
  if (/researcher|senior researcher|collections researcher/.test(p)) return 'Research';
  if (/education|outreach/.test(p)) return 'Education';
  if (/communications|press|marketing|pr/.test(p)) return 'Communications';
  if (/registrar|administrative|coordinator|assistant/.test(p)) return 'Administration';
  if (/conservation|conservat/.test(p)) return 'Conservation';
  if (/security|facilities|operations|it |it$/.test(p)) return 'Operations';
  if (/artist in residence/.test(p)) return 'Artist in Residence';
  if (/manager/.test(p)) return 'Administration';
  return 'Other';
}
