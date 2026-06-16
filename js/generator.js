
export function pick(a){return a[Math.floor(Math.random()*a.length)]}

export function generate(raceData,surnameData,race,gender,type){
 const r=raceData[race];
 let first=pick(r.roots)+(gender==='m'?pick(r.male):pick(r.female));

 let categories = Object.keys(surnameData);
 if(type!=='any') categories=[type];

 let surname=pick(surnameData[pick(categories)]);
 return first.charAt(0).toUpperCase()+first.slice(1)+" "+surname;
}
