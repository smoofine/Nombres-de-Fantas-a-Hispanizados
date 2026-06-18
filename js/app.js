import {generate} from './generator.js';

const raceSelect=document.getElementById('race');
const genderSelect=document.getElementById('gender');
const surnameTypeSelect=document.getElementById('surnameType');

// Populate race select
fetch('./data/races.json').then(r=>r.json()).then(races=>{
 Object.keys(races).forEach(r=>{
 let o=document.createElement('option');
 o.value=r;o.textContent=r;
 raceSelect.appendChild(o);
});

// Populate culture select
fetch('./data/cultures.json').then(r=>r.json()).then(cultures=>{
 const cultureSelect=document.getElementById('culture');
 if(cultureSelect){
  Object.keys(cultures.culturas).forEach(c=>{
   let o=document.createElement('option');
   o.value=c;o.textContent=c;
   cultureSelect.appendChild(o);
  });
 }
});

document.getElementById('generate').onclick=async ()=>{
 const result=await generate(
  raceSelect.value,
  genderSelect.value,
  surnameTypeSelect.value,
  document.getElementById('culture')?.value || null
 );
 document.getElementById('result').textContent=result;
};

if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./service-worker.js');
}
