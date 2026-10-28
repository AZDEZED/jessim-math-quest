const path=require('node:path'),fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();let cards=[],timers=[];
function el(){return {innerHTML:'',textContent:'',value:'',className:'',dataset:{},attrs:{},classList:{toggle(){}},setAttribute(k,v){this.attrs[k]=v},querySelector(){return this.number}}}
const document={getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id)},querySelectorAll(){return cards}};
const ctx=vm.createContext({document,TextEncoder,URL,console,Math,setTimeout(fn){timers.push(fn)},localStorage:{getItem(){return null},setItem(){}},sessionStorage:{getItem(){return null},setItem(){}},scrollTo(){}});
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const code=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n').replace(/renderHome\(\);\s*initAccess\(\);\s*$/,'');vm.runInContext(code,ctx);
function run(code){return vm.runInContext(code,ctx)}
function reset(){timers=[];cards=[];elements.clear();run('currentCode="T1";currentModule="tables";attempts=0;phase=2;run={maxAid:0,transferAid:0,theoryAid:0,procedureAid:0,recallAid:0};')}
let checks=0;function check(ok,msg){assert.ok(ok,msg);checks++}
reset();run('procedure(1)');check(!/class="n">\d/.test(document.getElementById('order').innerHTML),'No initial number');check(document.getElementById('order').innerHTML.includes('aria-pressed="false"'),'Accessible toggles');
cards=Array.from({length:6},(_,i)=>{const c=el();c.dataset.i=String(i);c.number=el();return c});
ctx.cards=cards;run('pick(cards[4]);pick(cards[1]);pick(cards[5]);');check(cards[4].number.textContent==='1'&&cards[1].number.textContent==='2'&&cards[5].number.textContent==='3','Click order, not source order');run('pick(cards[1])');check(cards[1].number.textContent===''&&cards[5].number.textContent==='2','Deselect renumbers remaining choices');run('pick(cards[1])');check(cards[1].number.textContent==='3','Reselection appends');run('clearPicks()');check(cards.every(c=>c.number.textContent===''),'Reset clears numbering');
for(let n=1;n<=3;n++){run('checkOrder(1)');check(document.getElementById('ofb').innerHTML.includes(n===3?'correction':'Indice '+n),'Procedure help level '+n)}
check(timers.length===0,'Wrong order never advances');check(document.getElementById('ofb').innerHTML.includes('Je récite toutes les tables depuis 1.'),'Correction identifies intruder');check(run('statusFromRun()[0]')==='solution','Procedure help prevents autonomous label');
run('clearPicks();picks=[C[currentCode].bad,...C[currentCode].proc].map(x=>order.indexOf(x));checkOrder(1)');check(run('run.procedure1')===true&&timers.length===1,'Correct order still progresses after help');
reset();document.getElementById('theoryAns').value='faux';for(let n=1;n<=3;n++){run('validateTheory()');check(document.getElementById('tfb').innerHTML.includes(n===3?'Réponse attendue':'Indice '+n),'Theory help level '+n)}check(timers.length===0,'Wrong theory never advances');check(run('run.theoryAid')===3,'Theory help tracked');
reset();document.getElementById('recall').value='';for(let n=1;n<=3;n++){run('checkRecall()');check(document.getElementById('rfb').innerHTML.includes(n===3?'méthode à reconstruire':'Indice '+n),'Recall help level '+n)}check(run('run.recallAid')===3,'Recall help tracked');
for(const transfer of [false,true]){reset();document.getElementById('ans').value='erreur';for(let n=1;n<=3;n++)run('checkAnswer('+transfer+')');check(document.getElementById('afb').innerHTML.includes('Réponse attendue : <b>24</b>'),'Explicit correct answer for '+(transfer?'transfer':'exercise'));check(timers.length===0,'Wrong answer never advances');}
reset();run('run.theoryAid=1');check(run('statusFromRun()[0]')==='indice1','First hint status');run('run.procedureAid=2');check(run('statusFromRun()[0]')==='indice2','Second hint status');run('run.transferAid=3');check(run('statusFromRun()[0]')==='transfert_echoue','Transfer failure priority preserved');
console.log(JSON.stringify({passed:checks,failed:0}));
