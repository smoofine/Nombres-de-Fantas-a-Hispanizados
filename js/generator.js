export function pick(a){return a[Math.floor(Math.random()*a.length)]}

export async function generate(race, gender, surnameType, culture=null){
  // Load all data files
  const [raceData, surnameData, phoneticsData, evolutionData, culturesData, rootsData] = await Promise.all([
    fetch('./data/races.json').then(r=>r.json()),
    fetch('./data/surnames.json').then(r=>r.json()),
    fetch('./data/phonetics.json').then(r=>r.json()),
    fetch('./data/evolution_rules.json').then(r=>r.json()),
    fetch('./data/cultures.json').then(r=>r.json()),
    fetch('./data/roots.json').then(r=>r.json())
  ]);

  // Determine culture
  let selectedCulture = culture;
  if(!selectedCulture){
    // Default to race-associated culture
    for(const [cultName, cultData] of Object.entries(culturasData.culturas)){
      if(cultData.razas_asociadas.includes(race)){
        selectedCulture = cultName;
        break;
      }
    }
  }

  // Get race data
  const r = raceData[race];
  
  // Get cultural data
  const cultData = selectedCulture ? culturesData.culturas[selectedCulture] : null;

  // Select root from culture-preferred categories or race roots
  let root;
  if(cultData && cultData.raices_preferidas){
    // Select a category from culture preferences
    const category = pick(cultData.raices_preferidas);
    if(rootsData.categorias[category]){
      const raceRoots = rootsData.categorias[category][race.toLowerCase()] || rootsData.categorias[category].general;
      root = pick(raceRoots.length > 0 ? raceRoots : rootsData.categorias[category].general);
    } else {
      root = pick(r.roots);
    }
  } else {
    root = pick(r.roots);
  }

  // Apply evolution rules
  let firstName;
  if(evolutionData.reglas_por_raiz[root]){
    const genderRules = evolutionData.reglas_por_raiz[root][gender === 'm' ? 'masculino' : 'femenino'];
    firstName = pick(genderRules);
  } else {
    // Fallback: simple concatenation
    const ending = gender === 'm' ? pick(r.male) : pick(r.female);
    firstName = root + ending;
  }

  // Capitalize first letter
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Select surname
  let categories = Object.keys(surnameData);
  if(surnameType !== 'any') categories = [surnameType];

  // If culture has preferred surname categories, use them
  if(cultData && cultData.apellidos_preferidos){
    const preferred = cultData.apellidos_preferidos.filter(c => categories.includes(c));
    if(preferred.length > 0) categories = preferred;
  }

  let surname = pick(surnameData[pick(categories)]);

  // Handle Dragonborn clan-first naming
  if(race === 'Dracónido' && cultData && cultData.tradicion_nombres === 'clan_primero'){
    // For Dragonborn, surname (clan name) comes first
    return surname + ' ' + firstName;
  }

  return firstName + ' ' + surname;
}
