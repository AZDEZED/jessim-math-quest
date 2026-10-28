"use strict";
const JMQ_PRACTICE={MT2:{module:"tables",kind:"classic",label:"T2"},MT3:{module:"tables",kind:"inverse",label:"T3"},MT4:{module:"tables",kind:"mixed",label:"T4"},SC2:{module:"carres",kind:"square",label:"C2"},SC3:{module:"carres",kind:"root",label:"C3"},SC4:{module:"carres",kind:"squareMixed",label:"C4"}};
MODULES.tables.comps=["T1","MT2","MT3","MT4"];
C.T1.title="Comprendre multiplication et division";C.T1.obj="Une multiplication connue permet de retrouver deux divisions.";
C.T1.theory="7 × 8 = 56 : 7 groupes de 8 donnent 56. Donc 56 ÷ 7 = 8 et 56 ÷ 8 = 7. Chercher 7 × ? = 56, c’est aussi calculer 56 ÷ 7. On utilise ces liens pour calculer de tête.";
C.T1.proc=["Je repère les deux facteurs et le produit.","Je retrouve une multiplication que je connais.","Si un facteur manque, je divise le produit par le facteur connu.","Je vérifie avec la multiplication."];
C.T1.bad="Je divise les nombres au hasard sans vérifier leur lien.";
for(const [code,title,obj]of [["MT2","Tables classiques","Questions aléatoires, avec une priorité aux tables de 7 et 8."],["MT3","Calculs inverses","Retrouver le facteur manquant en utilisant la division."],["MT4","Entraînement mixte","Alterner produits et multiplications à trou."]])C[code]={...C.T1,title,obj,displayCode:JMQ_PRACTICE[code].label};
C.SC1=c("Comprendre carrés et racines","Faire le lien entre le carré et son opération inverse.","8² = 8 × 8 = 64. En sens inverse, √64 = 8 parce que 8² = 64. On mémorise les couples de 1² à 10², puis 11² = 121 et 12² = 144.",["√64 = ?","8"],["Je repère si on cherche un carré ou une racine.","Pour a², je calcule a × a.","Pour √n, je cherche le nombre positif dont le carré vaut n.","Je vérifie avec l’opération inverse."],"Pour trouver la racine carrée, je divise toujours par 2.",["7² = ?","49","7² signifie 7 × 7.","7 × 7 = 49.","7² = 49, donc √49 = 7.",["√81 = ?","9"]],"square","Franky");C.SC1.displayCode="C1";
for(const [code,title,obj]of [["SC2","Carrés à connaître","Enchaîner les carrés de 1 à 12."],["SC3","Racines à connaître","Retrouver les racines des carrés parfaits jusqu’à 144."],["SC4","Carrés et racines mélangés","Passer du carré à la racine dans une même série."]])C[code]={...C.SC1,title,obj,displayCode:JMQ_PRACTICE[code].label};
MODULES.carres.comps=["SC1","SC2","SC3","SC4"];
let jmqPracticeTimer=null;
function jmqWeightedFactor(){return Math.random()<.65?(Math.random()<.5?7:8):[1,2,3,4,5,6,9,10][Math.floor(Math.random()*8)]}
function jmqQuestion(kind,previous){
 let q;for(let i=0;i<20;i++){
  const a=kind==="square"||kind==="root"?1+Math.floor(Math.random()*12):jmqWeightedFactor(),b=kind==="square"||kind==="root"?a:1+Math.floor(Math.random()*10),total=a*b;
  q={id:jmqUid(),kind,a,b,total,expected:kind==="inverse"?b:kind==="root"?a:total,attempts:0,resolved:false,answer:"",anchor:null};
  q.text=kind==="inverse"?`${a} × ? = ${total}`:kind==="square"?`${a}² = ?`:kind==="root"?`√${total} = ?`:`${a} × ${b} = ?`;
  if(q.text!==previous)break;
 }return q;
}
function jmqQuestionFor(p){
 let kind=JMQ_PRACTICE[p.code].kind;
 if(kind==="mixed"||kind==="squareMixed"){
  if(!p.typeBag?.length)p.typeBag=shuffle(kind==="mixed"?["classic","classic","inverse","inverse"]:["square","root"]);
  kind=p.typeBag.pop();
 }return jmqQuestion(kind,p.question?.text);
}
function jmqPractice(){return getState().drills[currentCode]}
function jmqPutPractice(p){const s=getState();p.updatedAt=new Date().toISOString();s.drills[p.code]=p;s.last={module:p.module,code:p.code};s.resume[p.module]=p.code;putState(s)}
function jmqStartPractice(code){
 jmqStopTimer();if(jmqPracticeTimer)clearTimeout(jmqPracticeTimer);jmqDrillActive=true;currentCode=code;currentModule=JMQ_PRACTICE[code].module;
 let p=getState().drills[code];if(!p){p={code,module:currentModule,target:null,streak:0,bestStreak:0,correct:0,direct:0,errors:0,solutions:0,questions:0,completed:false,typeBag:[],milestones:{}};jmqPutPractice(p)}
 if(p.question?.resolved&&p.question.correct&&!p.targetReached){p.question=jmqQuestionFor(p);jmqPutPractice(p)}
 JMQ_BASE.show("lessonScreen");jmqRenderPractice();
}
function jmqChooseTarget(target){if(![10,20,30].includes(target))return;const p=jmqPractice();p.target=target;p.freePractice=false;p.targetReached=p.streak>=target;if(!p.question||p.question.resolved)p.question=jmqQuestionFor(p);jmqPutPractice(p);jmqRenderPractice()}
function jmqExplanation(q){return q.kind==="inverse"?`${q.total} ÷ ${q.a} = ${q.expected}, donc ${q.a} × ${q.expected} = ${q.total}.`:q.kind==="root"?`${q.expected}² = ${q.total}, donc √${q.total} = ${q.expected}.`:q.kind==="square"?`${q.a}² = ${q.a} × ${q.a} = ${q.total}.`:`${q.a} × ${q.b} = ${q.total}.`}
function jmqAnchors(q){return [...new Set([q.b-1,q.b+1,5,10])].filter(n=>n>=1&&n<=12&&n!==q.b).sort((a,b)=>Math.abs(a-q.b)-Math.abs(b-q.b)).slice(0,3)}
function jmqAnchorText(q,k){
 if(q.kind==="root")return `Tu sais que ${k}² = ${k*k}. Cherche le nombre dont le carré vaut ${q.total}.`;
 const known=q.a*k;if(q.kind==="inverse")return `Tu sais que ${q.a} × ${k} = ${known}. Compare ${known} à ${q.total} : combien de groupes de ${q.a} faut-il ajouter ou retirer ?`;
 const gap=q.b-k;return `Tu sais que ${q.a} × ${k} = ${known}. Pour obtenir ${q.a} × ${q.b}, ${gap>0?"ajoute":"retire"} ${Math.abs(gap)===1?"encore "+q.a:Math.abs(gap)+" groupes de "+q.a}.`;
}
function jmqSelectAnchor(k){const p=jmqPractice();if(!p?.question||p.question.resolved)return;p.question.anchor=k;jmqPutPractice(p);jmqRenderPractice();document.getElementById("practiceAnswer")?.focus()}
function jmqCoinChange(amount,transactionId,detail){
 const s=getState();if(s.wallet.ledger.some(x=>x.id===transactionId))return 0;
 const before=s.wallet.balance;s.wallet.balance=Math.max(0,before+amount);const actual=s.wallet.balance-before;
 s.wallet.ledger.push({id:transactionId,date:new Date().toISOString(),module:currentModule,code:currentCode,requestedDelta:amount,delta:actual,detail});putState(s);return actual;
}
function jmqCheckPractice(){
 const p=jmqPractice(),q=p?.question;if(!q||q.resolved)return;const input=document.getElementById("practiceAnswer"),raw=input.value.trim();
 if(!/^\d+$/.test(raw)){document.getElementById("practiceNotice").textContent="Écris un nombre entier avant de valider.";return}
 q.answer=raw;const ok=Number(raw)===q.expected,inverse=q.kind==="inverse"||q.kind==="root";let coins;
 if(ok){coins=jmqCoinChange(inverse?2:1,q.id+":reward",q.text);q.resolved=true;q.correct=true;p.correct++;p.questions++;if(q.attempts===0)p.direct++;p.streak++;p.bestStreak=Math.max(p.bestStreak,p.streak);
  if(p.streak>=p.target&&!p.freePractice){p.completed=true;p.targetReached=true;if(!p.milestones[p.target]){p.milestones[p.target]=new Date().toISOString();const s=getState();s.logs.push({id:jmqUid(),date:new Date().toISOString(),module:MODULES[currentModule].label,moduleKey:currentModule,code:currentCode,skill:C[currentCode].title,status:"autonome",label:`Défi ${p.target} réussi`,detail:{target:p.target,bestStreak:p.bestStreak,direct:p.direct,errors:p.errors}});putState(s)}}
 }else{q.attempts++;coins=jmqCoinChange(inverse?-1:-2,q.id+":error:"+q.attempts,q.text);p.errors++;p.streak=0;if(q.attempts>=2){q.resolved=true;q.correct=false;p.solutions++;p.questions++}}
 jmqPutPractice(p);jmqRecord("question",{question:q.text,label:q.text,correct:ok,answer:raw,expected:q.expected,attempt:q.attempts,coinDelta:coins});jmqRenderPractice();
 if(ok&&!p.targetReached){jmqPracticeTimer=setTimeout(()=>{jmqPracticeTimer=null;if(jmqDrillActive&&currentCode===p.code)jmqNextPractice()},1000)}
}
function jmqFreePractice(){const p=jmqPractice();p.freePractice=true;jmqPutPractice(p);jmqNextPractice()}
function jmqNextPractice(){const p=jmqPractice();if(!p)return;if(jmqPracticeTimer)clearTimeout(jmqPracticeTimer);jmqPracticeTimer=null;p.question=jmqQuestionFor(p);p.targetReached=false;jmqPutPractice(p);jmqRenderPractice()}
function jmqRenderPractice(){
 const p=jmqPractice(),d=C[currentCode],q=p.question;phase=4;const followup=document.getElementById("stageFollowup");if(followup)followup.hidden=true;
 document.getElementById("lessonPill").textContent=d.displayCode+" • "+d.guide;document.getElementById("lessonTitle").textContent=d.title;document.getElementById("lessonObjective").textContent=d.obj;document.getElementById("stepper").innerHTML="";
 document.getElementById("visual").innerHTML=jmqChestMarkup(getState().wallet.balance,true)+`<div class="practice-stats"><span>Réussites : <b>${p.correct}</b></span><span>Meilleure série : <b>${p.bestStreak}</b></span><span>Erreurs : <b>${p.errors}</b></span></div>`;
 guide("Bonne réponse : la question suivante arrive. En cas d’erreur, utilise un résultat proche que tu connais.",d.guide);
 const host=document.getElementById("stage");
 if(!p.target){host.innerHTML=`<h3>Choisis ton défi</h3><p>Vise une série de bonnes réponses. Une erreur remet la série à zéro, mais tes résultats et tes pièces restent conservés.</p><div class="challenge-choices">${[10,20,30].map(n=>`<button class="btn" onclick="jmqChooseTarget(${n})">${n} à la suite</button>`).join("")}</div><p class="small muted">Aucun chronomètre. Les tables de 7 et 8 reviennent plus souvent.</p>`;return}
 if(p.targetReached){host.innerHTML=`<div class="challenge-win"><span>🏴‍☠️</span><h3>Défi ${p.target} réussi !</h3><p>Tu as enchaîné ${p.streak} bonnes réponses. Ton trésor et tes résultats sont enregistrés.</p></div><div class="challenge-choices">${[10,20,30].filter(n=>n>p.target).map(n=>`<button class="btn" onclick="jmqChooseTarget(${n})">Viser ${n}</button>`).join("")}<button class="btn ghost" onclick="jmqFreePractice()">Continuer à m’entraîner</button></div><div class="actions"><button class="btn green" onclick="sendForm()">Envoyer mon bilan au suivi</button></div>`;return}
 const inverse=q.kind==="inverse"||q.kind==="root",reward=inverse?2:1,cost=inverse?1:2;
 let feedback="";
 if(q.resolved)feedback=q.correct?`<div class="feedback show good" role="status">✅ Bonne réponse ! +${reward} pièce${reward>1?"s":""}.</div>`:`<div class="feedback show bad" role="status"><b>Réponse : ${q.expected}</b><p>${escapeHTML(jmqExplanation(q))}</p><p>La prochaine question te permettra de réessayer.</p></div><button class="btn" onclick="jmqNextPractice()">Question suivante</button>`;
 else if(q.attempts===1)feedback=`<div class="feedback show warn" role="status"><b>Un résultat connu peut t’aider.</b><p>−${cost} pièce${cost>1?"s":""} · le trésor ne descend pas sous zéro.</p><p>Quel calcul proche connais-tu ?</p><div class="anchor-choices">${jmqAnchors(q).map(k=>`<button class="btn ghost sm" onclick="jmqSelectAnchor(${k})">${q.kind==="root"?k+"²":q.a+" × "+k}</button>`).join("")}</div>${q.anchor!==null?`<p>${escapeHTML(jmqAnchorText(q,q.anchor))}</p>`:""}<p>Tu as encore un essai.</p></div>`;
 host.innerHTML=`<div class="practice-heading"><span class="pill">Série : ${p.streak} / ${p.target}</span><span class="small muted">+${reward} si juste · −${cost} si faux</span></div><div class="practice-question">${escapeHTML(q.text)}</div><form onsubmit="event.preventDefault();jmqCheckPractice()"><label for="practiceAnswer" class="small">Ta réponse</label><input id="practiceAnswer" class="answer" inputmode="numeric" autocomplete="off" value="${escapeHTML(q.answer||"")}" ${q.resolved?"disabled":""}><div class="actions"><button class="btn" type="submit" ${q.resolved?"disabled":""}>${q.attempts?"Valider mon deuxième essai":"Valider"}</button></div></form><div id="practiceNotice" class="small" role="status"></div>${feedback}<div class="practice-footer"><button class="btn ghost sm" onclick="jmqShowHistory('${currentModule}')">Mon historique</button><button class="btn ghost sm" onclick="sendForm()">Envoyer mon bilan au suivi</button><details><summary>Changer de défi</summary><div class="actions">${[10,20,30].map(n=>`<button class="btn ghost sm" onclick="jmqChooseTarget(${n})">${n}</button>`).join("")}</div></details></div>`;
 if(!q.resolved)document.getElementById("practiceAnswer")?.focus();
}
document.addEventListener("input",e=>{if(e.target.id==="practiceAnswer"&&jmqDrillActive){const p=jmqPractice();if(p?.question&&!p.question.resolved){p.question.answer=e.target.value;jmqPutPractice(p)}}});
function jmqChestMarkup(balance,large=false){
 const count=balance===0?0:Math.min(24,Math.ceil(balance/4));let coins="";
 for(let i=0;i<count;i++){const x=35+(i%6)*16+(Math.floor(i/6)%2?3:0),y=64-Math.floor(i/6)*10;coins+=`<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="#f7cb42" stroke="#b27915" stroke-width="1.6"/><path d="M${x-3} ${y-2}h6" stroke="#fff2a3" stroke-width="1.5"/>`}
 return `<div class="treasure ${large?"treasure-large":"treasure-small"}" role="img" aria-label="Coffre : ${balance} pièces d’or"><svg viewBox="0 0 160 112" aria-hidden="true"><ellipse cx="80" cy="101" rx="61" ry="7" fill="#17202a" opacity=".12"/><path d="M23 52V34Q80-8 137 34V52Z" fill="#9a512a" stroke="#63361f" stroke-width="4"/><path d="M27 38Q80 7 133 38" fill="none" stroke="#e7b649" stroke-width="8"/><path d="M22 57h116v41H22Z" fill="#8d4827" stroke="#63361f" stroke-width="4"/><path d="M24 60h112v30H24Z" fill="#55321f"/>${coins}<path d="M22 73h116v25H22Z" fill="#a65a30" stroke="#63361f" stroke-width="4"/><path d="M38 74v24M122 74v24M22 96h116" stroke="#e0ad3a" stroke-width="7"/><rect x="69" y="72" width="22" height="19" rx="3" fill="#f1c449" stroke="#956313" stroke-width="2"/><circle cx="80" cy="80" r="3" fill="#6e461c"/></svg><div><b>${balance.toLocaleString("fr-FR")}</b><span>pièce${balance>1?"s":""} d’or</span></div></div>`;
}
function jmqRenderTreasure(){
 const balance=getState().wallet.balance;let mini=document.getElementById("treasureMini");if(!mini){mini=document.createElement("div");mini.id="treasureMini";document.querySelector(".top-actions").prepend(mini)}mini.innerHTML=jmqChestMarkup(balance);
 let home=document.getElementById("treasureHome");if(!home){home=document.createElement("div");home.id="treasureHome";home.className="treasure-home card";document.getElementById("moduleCards").before(home)}home.innerHTML=`<div><span class="pill">Le trésor de Jessim</span><h2>Chaque réussite remplit ton coffre.</h2><p class="small muted">Ton trésor est conservé quand tu quittes l’application. Minimum : zéro pièce.</p></div>${jmqChestMarkup(balance,true)}`;
}
