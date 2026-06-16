
import {generate} from './generator.js';

const races = await fetch('./data/races.json').then(r=>r.json());
const surnames = await fetch('./data/surnames.json').then(r=>r.json());

const raceSelect=document.getElementById('race');
Object.keys(races).forEach(r=>{
 let o=document.createElement('option');
 o.value=r;o.textContent=r;
 raceSelect.appendChild(o);
});

document.getElementById('generate').onclick=()=>{
 const result=generate(
  races,
  surnames,
  raceSelect.value,
  document.getElementById('gender').value,
  document.getElementById('surnameType').value
 );
 document.getElementById('result').textContent=result;
};

if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./service-worker.js');
}
