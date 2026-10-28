"use strict";
const JMQ_BASE={renderLesson,show,showModule,renderCompetencies,startLesson,next,checkpoint,exportProgress};
let jmqRestoringLesson=false,jmqPendingNext=false,jmqAdvanceTimer=null,jmqMemory=null,jmqStorageProblem=false,jmqPendingReset=null,jmqHistoryModule=null,jmqDrillActive=false;
const JMQ_STAGE_NAMES=["Théorie","Compréhension","Procédure 1","Mémoire","Exercice","Procédure 2","Transfert","Validation"];
function jmqNormalize(s){
 if(!s||typeof s!=="object"||Array.isArray(s))throw Error("Sauvegarde invalide");
 for(const k of ["progress","sessions","drills","resume"])if(!s[k]||typeof s[k]!=="object"||Array.isArray(s[k]))s[k]={};
 for(const k of ["logs","events"])if(!Array.isArray(s[k]))s[k]=[];
 if(!s.wallet||typeof s.wallet!=="object")s.wallet={balance:0,ledger:[]};
 s.wallet.balance=Math.max(0,Number(s.wallet.balance)||0);if(!Array.isArray(s.wallet.ledger))s.wallet.ledger=[];
 s.schemaVersion=3;return s;
}
function jmqStorageNotice(message){
 let n=document.getElementById("storageNotice");if(!n){n=document.createElement("div");n.id="storageNotice";n.className="storage-notice";n.setAttribute("role","alert");document.body.prepend(n)}
 n.textContent=message;n.hidden=false;
}
getState=function(){
 let failed=false;
 for(const key of ["jmq_v1","jmq_backup_v3"]){try{const raw=localStorage.getItem(key);if(raw){const s=jmqNormalize(JSON.parse(raw));jmqMemory=s;return s}}catch(e){failed=true}}
 if(failed){jmqStorageProblem=true;jmqStorageNotice("La sauvegarde ne peut pas être relue. Exporte tes données et demande de l’aide avant de continuer.")}
 return jmqNormalize(jmqMemory||{progress:{},last:null,logs:[]});
};
putState=function(s){
 s=jmqNormalize(s);s.updatedAt=new Date().toISOString();jmqMemory=s;
 if(!jmqStorageProblem){try{localStorage.setItem("jmq_v1",JSON.stringify(s));try{localStorage.setItem("jmq_backup_v3",JSON.stringify(s))}catch(e){/* La sauvegarde principale reste valide. */}}catch(e){jmqStorageNotice("La sauvegarde sur cet appareil est indisponible. Garde cet onglet ouvert et utilise « Exporter ma progression ».")}}
 if(typeof jmqRenderTreasure==="function")jmqRenderTreasure();renderHomeSummary();
};
function jmqUid(){return Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}
function jmqRecord(type,details={}){const s=getState();s.events.push({id:jmqUid(),date:new Date().toISOString(),module:currentModule,code:currentCode,phase,type,runId:jmqDrillActive?null:run.id,...details});putState(s)}
function jmqSaveCurrent(){
 const active=document.getElementById("lessonScreen");if(jmqRestoringLesson||jmqDrillActive||!active?.classList.contains("active")||!currentCode||!C[currentCode])return;
 const s=getState(),old=s.sessions[currentCode]||{},drafts=old.drafts||{},feedbacks=old.feedbacks||{};drafts[phase]={};
 for(const id of ["theoryAns","ans","recall"]){const e=document.getElementById(id);if(e)drafts[phase][id]=e.value}
 const feedback=["tfb","ofb","rfb","afb"].map(id=>document.getElementById(id)).find(e=>e&&e.classList.contains("show"));
 if(feedback)feedbacks[phase]={id:feedback.id,html:feedback.innerHTML,className:feedback.className};
 s.sessions[currentCode]={code:currentCode,module:currentModule,phase,attempts,run:JSON.parse(JSON.stringify(run)),order:[...order],picks:[...picks],drafts,feedbacks,pendingNext:jmqPendingNext,updatedAt:new Date().toISOString()};
 s.last={module:currentModule,code:currentCode};s.resume[currentModule]=currentCode;putState(s);
}
function jmqStopTimer(){if(jmqAdvanceTimer!==null)clearTimeout(jmqAdvanceTimer);jmqAdvanceTimer=null}
function jmqQueueNext(delay){if(jmqAdvanceTimer!==null)return;jmqPendingNext=true;jmqSaveCurrent();jmqAdvanceTimer=setTimeout(()=>{jmqAdvanceTimer=null;jmqPendingNext=false;next()},delay)}
show=function(id){if(id!=="lessonScreen"){jmqSaveCurrent();jmqStopTimer();jmqDrillActive=false}JMQ_BASE.show(id)};
renderLesson=function(){JMQ_BASE.renderLesson();jmqSaveCurrent()};
startLesson=function(code,restart=false){
 jmqSaveCurrent();jmqStopTimer();jmqPendingNext=false;
 if(typeof JMQ_PRACTICE!=="undefined"&&JMQ_PRACTICE[code]){jmqStartPractice(code);return}
 jmqDrillActive=false;const followup=document.getElementById("stageFollowup");if(followup)followup.hidden=false;currentCode=code;currentModule=Object.keys(MODULES).find(k=>MODULES[k].comps.includes(code));if(!currentModule)return;
 const saved=!restart&&getState().sessions[code];
 if(saved){phase=saved.phase;attempts=saved.attempts||0;run={...saved.run};order=[...(saved.order||[])];picks=[...(saved.picks||[])];
  if(saved.pendingNext){phase=Math.min(7,phase+1);attempts=0;order=[];picks=[]}
  jmqRestoringLesson=true;try{JMQ_BASE.renderLesson();for(const [id,value]of Object.entries(saved.drafts?.[phase]||{})){const e=document.getElementById(id);if(e)e.value=value}
   if(phase===2||phase===5)updateOrderNumbers();const f=saved.feedbacks?.[phase];if(f){const e=document.getElementById(f.id);if(e){e.innerHTML=f.html;e.className=f.className}}
  }finally{jmqRestoringLesson=false}
  JMQ_BASE.show("lessonScreen");jmqSaveCurrent();return;
 }
 phase=0;attempts=0;order=[];picks=[];run={id:jmqUid(),maxAid:0,transferAid:0,theoryAid:0,procedureAid:0,recallAid:0,procedure1:false,procedure2:false,recall:false};JMQ_BASE.renderLesson();JMQ_BASE.show("lessonScreen");jmqSaveCurrent();
};
next=function(){jmqRecord("etape_suivante",{label:JMQ_STAGE_NAMES[phase]});jmqPendingNext=false;phase++;attempts=0;renderLesson()};
function jmqRecordCheckpoint(status,label,detail){
 if(run.completed)return;run.completed=true;const s=getState(),d=C[currentCode],date=new Date().toISOString();
 s.progress[currentCode]={status,date,detail};s.last={module:currentModule,code:currentCode};s.logs.push({id:run.id||jmqUid(),date,student:"Jessim",module:MODULES[currentModule].label,moduleKey:currentModule,code:currentCode,skill:d.title,status,label,detail});putState(s);
}
for(const [name,id] of [["validateTheory","tfb"],["checkOrder","ofb"],["checkRecall","rfb"],["checkAnswer","afb"]]){
 const original=window[name];window[name]=function(...args){const result=original(...args),f=document.getElementById(id);jmqRecord("verification",{label:JMQ_STAGE_NAMES[phase],correct:!!f?.classList.contains("good"),help:Math.min(attempts,3)});jmqSaveCurrent();return result};
}
for(const name of ["pick","clearPicks"]){const original=window[name];window[name]=function(...args){const result=original(...args);jmqSaveCurrent();return result}}
showModule=function(k){jmqSaveCurrent();jmqStopTimer();jmqDrillActive=false;currentCode=null;jmqHistoryModule=k;JMQ_BASE.showModule(k);jmqRenderModuleActions(k)};
function jmqRenderModuleActions(k){
 let host=document.getElementById("moduleActions");if(!host){host=document.createElement("div");host.id="moduleActions";host.className="actions";document.getElementById("competencyList").before(host)}
 const saved=getState().resume[k];host.innerHTML=(saved&&MODULES[k].comps.includes(saved)?`<button class="btn" onclick="startLesson('${saved}')">Reprendre mon activité</button>`:"")+`<button class="btn ghost" onclick="jmqShowHistory('${k}')">Historique de ce bloc</button><button class="btn ghost danger-text" onclick="jmqAskReset('${k}')">Effacer ma progression dans ce bloc</button>`;
}
renderCompetencies=function(){
 const s=getState(),m=MODULES[currentModule];document.getElementById("modulePct").innerHTML=`<b>${moduleProgress(currentModule)}%</b> autonome`;
 document.getElementById("competencyList").innerHTML=m.comps.map(code=>{const d=C[code],session=s.sessions[code],drill=s.drills[code],st=s.progress[code];let label="Non commencé",action="Commencer";
  if(drill){label=`Défi ${drill.target||10} · meilleure série ${drill.bestStreak||0}`;action="Reprendre"}else if(session){label=session.phase===7?(st?.status==="autonome"?"🟢 autonome":"Bilan enregistré"):`En cours · ${JMQ_STAGE_NAMES[session.phase]}`;action=session.phase===7?"Voir mon bilan":"Reprendre"}else if(st){label=st.status==="autonome"?"🟢 autonome":"Progression enregistrée";action="Reprendre"}
  return `<div class="competency"><div><span class="code">${escapeHTML(d.displayCode||code)}</span><b>${escapeHTML(d.title)}</b><div class="small muted">${escapeHTML(d.obj)}</div></div><div><span class="status">${label}</span><div style="height:6px"></div><button class="btn sm" onclick="startLesson('${code}')">${action}</button></div></div>`}).join("");
};
moduleProgress=function(k){const s=getState(),codes=MODULES[k].comps;return Math.round(codes.filter(c=>s.drills[c]?.completed||(!JMQ_PRACTICE[c]&&s.progress[c]?.status==="autonome")).length/codes.length*100)};
overall=function(){const codes=Object.values(MODULES).flatMap(m=>m.comps),s=getState();return Math.round(codes.filter(c=>s.drills[c]?.completed||(!JMQ_PRACTICE[c]&&s.progress[c]?.status==="autonome")).length/codes.length*100)};
continueMission=function(){const s=getState();if(s.last?.code&&Object.values(MODULES).some(m=>m.comps.includes(s.last.code)))startLesson(s.last.code);else showModule("tables")};
function jmqAskReset(k){
 if(!MODULES[k])return;jmqPendingReset=k;let d=document.getElementById("resetDialog");if(!d){d=document.createElement("dialog");d.id="resetDialog";document.body.append(d)}
 d.innerHTML=`<h2>Effacer ce bloc ?</h2><p>La progression et l’historique du bloc <b>${escapeHTML(MODULES[k].label)}</b> seront effacés sur cet appareil.</p><p>Les autres blocs et ton trésor sont conservés.</p><div class="actions"><button class="btn ghost" onclick="document.getElementById('resetDialog').close();jmqPendingReset=null">Annuler</button><button class="btn" onclick="jmqConfirmReset()">Oui, effacer ce bloc</button></div>`;d.showModal();
}
function jmqConfirmReset(){
 const k=jmqPendingReset;if(!k||!MODULES[k])return;jmqStopTimer();const s=getState(),codes=new Set([...MODULES[k].comps,...Object.keys(C).filter(c=>jmqModuleForCode(c)===k)]);
 for(const c of codes){delete s.progress[c];delete s.sessions[c];delete s.drills[c]}
 s.logs=s.logs.filter(x=>x.moduleKey!==k&&x.module!==MODULES[k].label&&!codes.has(x.code));s.events=s.events.filter(x=>x.module!==k&&!codes.has(x.code));delete s.resume[k];
 if(s.last?.module===k){const other=[...Object.values(s.sessions),...Object.values(s.drills)].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""))[0];s.last=other?{module:other.module,code:other.code}:null}
 currentCode=null;jmqPendingReset=null;putState(s);document.getElementById("resetDialog").close();showModule(k);
}
function jmqModuleForCode(code){if(/^T\d|^MT/.test(code))return"tables";if(/^C\d|^SC/.test(code))return"carres";if(/^F/.test(code))return"fractions";if(/^G/.test(code))return"geo";if(/^P/.test(code))return"pythagore";return null}
function jmqShowHistory(k){
 jmqHistoryModule=k;const s=getState();let screen=document.getElementById("historyScreen");if(!screen){screen=document.createElement("section");screen.id="historyScreen";screen.className="screen";document.querySelector(".shell").append(screen)}
 const rows=[...s.events.filter(e=>e.module===k),...s.logs.filter(e=>e.moduleKey===k||e.module===MODULES[k].label).map(e=>({...e,type:"bilan",correct:e.status==="autonome"}))].sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 screen.innerHTML=`<button class="back" onclick="showModule('${k}')">← Retour au bloc</button><div class="card"><h2>Historique · ${escapeHTML(MODULES[k].label)}</h2><p>${rows.length} trace(s) conservée(s) sur cet appareil.</p>${rows.length?`<div class="history-list">${rows.map(e=>`<article><b>${escapeHTML(C[e.code]?.displayCode||e.code||"")} · ${escapeHTML(e.label||e.question||e.type)}</b><div class="small muted">${new Date(e.date).toLocaleString("fr-FR")}</div><p>${e.type==="etape_suivante"?"Étape enregistrée":e.type==="bilan"?escapeHTML(e.label||e.status):e.correct?"✅ Réussite":"↪ Nouvelle tentative / aide"}${typeof e.coinDelta==="number"?` · ${e.coinDelta>0?"+":""}${e.coinDelta} pièce(s)`:""}</p></article>`).join("")}</div>`:"<p>Aucune activité enregistrée dans ce bloc pour le moment.</p>"}<div class="actions"><button class="btn ghost" onclick="exportProgress()">Exporter ma progression</button><button class="btn ghost danger-text" onclick="jmqAskReset('${k}')">Effacer ma progression dans ce bloc</button></div></div>`;show("historyScreen");
}
exportProgress=function(){jmqSaveCurrent();const blob=new Blob([JSON.stringify({app:"Jessim Math Quest",exportedAt:new Date().toISOString(),state:getState()},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="jessim-math-quest-progression-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(a.href)};
toggleSettings=function(){
 const h=document.getElementById("settingsScreen");h.innerHTML=`<button class="back" onclick="goHome()">← Retour</button><div class="card"><h2>Ma progression et mon historique</h2><p>Ta progression est enregistrée automatiquement dans ce navigateur, sur cet appareil, à chaque étape. Tu peux fermer l’application et revenir plus tard.</p><div class="actions"><button class="btn" onclick="exportProgress()">Exporter ma progression</button><button class="btn ghost" onclick="jmqImportProgress()">Restaurer une sauvegarde</button></div><p class="small muted">Une sauvegarde exportée permet de conserver une copie personnelle. Si tu changes d’appareil ou effaces les données du navigateur, cette sauvegarde sera nécessaire.</p><h3>Mes blocs</h3>${Object.entries(MODULES).map(([k,m])=>`<div class="progress-block"><b>${escapeHTML(m.label)}</b><div class="actions"><button class="btn ghost sm" onclick="jmqShowHistory('${k}')">Historique</button><button class="btn ghost sm danger-text" onclick="jmqAskReset('${k}')">Effacer ce bloc</button></div></div>`).join("")}<h3>Suivi parent</h3><p>Le bouton de suivi ouvre un formulaire déjà prérempli. Il suffit de vérifier le bilan puis de cliquer sur Envoyer dans Google Forms.</p><button class="btn ghost" onclick="openTracking()">Ouvrir le tableau de suivi</button></div>`;show("settingsScreen");
};
document.addEventListener("input",e=>{if(["theoryAns","ans","recall"].includes(e.target.id))jmqSaveCurrent()});
window.addEventListener("pagehide",jmqSaveCurrent);document.addEventListener("visibilitychange",()=>{if(document.hidden)jmqSaveCurrent()});
window.addEventListener("storage",e=>{if(e.key==="jmq_v1"){renderHomeSummary();if(typeof jmqRenderTreasure==="function")jmqRenderTreasure()}});
function jmqBootstrap(){
 try{const raw=localStorage.getItem("jmq_v1");if(raw&&!localStorage.getItem("jmq_before_v3"))localStorage.setItem("jmq_before_v3",raw)}catch(e){/* getState affiche la consigne de sauvegarde si nécessaire. */}
 getState();renderHome();initAccess();jmqRenderTreasure();
}
function jmqImportProgress(){
 const input=document.createElement("input");input.type="file";input.accept="application/json,.json";
 input.onchange=async()=>{try{
  const file=input.files?.[0];if(!file)return;const parsed=JSON.parse(await file.text());if(parsed.app&&parsed.app!=="Jessim Math Quest")throw Error("Ce fichier ne correspond pas à Jessim Math Quest.");
  const incoming=jmqNormalize(parsed.state||parsed),s=getState();
  for(const key of ["progress","sessions","drills"]){for(const[code,item]of Object.entries(incoming[key])){if(!s[key][code]||(item.updatedAt||item.date||"")>(s[key][code].updatedAt||s[key][code].date||""))s[key][code]=item}}
  const unique=items=>[...new Map(items.map(x=>[x.id||JSON.stringify(x),x])).values()];
  s.logs=unique([...s.logs,...incoming.logs]);s.events=unique([...s.events,...incoming.events]);s.wallet.ledger=unique([...s.wallet.ledger,...incoming.wallet.ledger]).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  s.wallet.balance=s.wallet.ledger.length?s.wallet.ledger.reduce((n,e)=>Math.max(0,n+Number(e.requestedDelta??e.delta??0)),0):Math.max(s.wallet.balance,incoming.wallet.balance);
  for(const[k,code]of Object.entries(incoming.resume))if(!s.resume[k])s.resume[k]=code;if(!s.last)s.last=incoming.last;
  putState(s);goHome();alert("La sauvegarde a été restaurée. Les données déjà présentes ont été conservées.");
 }catch(e){alert("Import impossible : "+e.message)}};input.click();
}
