(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const rnd=(a,b)=>a+Math.random()*(b-a);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pad=n=>String(Math.max(0,Math.round(n))).padStart(6,"0");
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S=Object.assign({unlocked:1,dev:false,best:{},runs:{},board:[]},store.get("rb_save_v1",{}));
const save=()=>store.set("rb_save_v1",S);
const LV=[
 {n:1,key:"DELULU",name:"Delulu",game:"Balloon popping",sub:"Pop the claims. Leave the facts alone.",steps:["Claims float up as red balloons.","Pop each one to see the reality check and sources.","Cream balloons are verified facts. Don't pop them.","Let too many escape and the afwah meter fills."],toWin:null},
 {n:2,key:"DELULU PRO MAX",name:"Delulu Pro Max",game:"Dart the myth",sub:"Targets cross the board. Aim, tap, throw.",steps:["Claim targets slide across the board.","Tap a red target to throw a dart at it.","Green targets are facts. A dart there costs you.","Every hit opens a reality check."],toWin:null},
 {n:3,key:"PROPAGANDA FINAL BOSS",name:"Propaganda Final Boss",game:"Final boss fight",sub:"Ten shields. Break any five.",steps:["The boss hides behind ten shields.","Tap a shield to break it and read the receipt.","Break five shields and the boss is down."],toWin:5},
 {n:4,key:"ANARCHYMAXXING",name:"Anarchymaxxing",game:"Rumour wildfire",sub:"Stop the lie before it spreads.",steps:["Spot the rumour on the network.","Pick the correct reality check.","Get it right before the rumour infects the network."],toWin:null}];
const LVH={1:{game:"गुब्बारे फोड़ो",sub:"दावे फोड़ो। तथ्यों को हाथ मत लगाओ।",steps:["दावे लाल गुब्बारों की तरह ऊपर उड़ते हैं।","हर दावे को फोड़ो और रियलिटी चेक व सोर्स देखो।","क्रीम रंग के गुब्बारे सत्यापित तथ्य हैं। उन्हें मत फोड़ो।","बहुत सारे निकल गए तो अफ़वाह मीटर भर जाएगा।"]},2:{game:"मिथक पर डार्ट",sub:"टारगेट बोर्ड पर सरकते हैं। निशाना लगाओ, टैप करो, फेंको।",steps:["दावों वाले टारगेट बोर्ड पर सरकते हैं।","डार्ट फेंकने के लिए लाल टारगेट पर टैप करो।","हरे टारगेट तथ्य हैं। वहाँ डार्ट मारने पर अंक कटते हैं।","हर सही निशाना एक रियलिटी चेक खोलता है।"]},3:{game:"फ़ाइनल बॉस फ़ाइट",sub:"दस ढालें। कोई भी पाँच तोड़ो।",steps:["बॉस दस ढालों के पीछे छिपा है।","ढाल तोड़ने और रसीद पढ़ने के लिए उस पर टैप करो।","पाँच ढालें तोड़ दो तो बॉस ढेर।"]},4:{game:"अफ़वाह की आग",sub:"झूठ फैलने से पहले उसे रोको।",steps:["नेटवर्क पर अफ़वाह को पहचानो।","सही रियलिटी चेक चुनो।","अफ़वाह के नेटवर्क में फैलने से पहले सही जवाब दो।"]}};
if(window.RB_LANG==="hi")LV.forEach(l=>Object.assign(l,LVH[l.n]));
const claimsFor=l=>CLAIMS.filter(c=>c.level===l.key);
const total=l=>l.toWin||claimsFor(l).length;
let G=null,cur="landing",raf=0,timers=[];
const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t};
function clearTimers(){timers.forEach(clearTimeout);timers=[];cancelAnimationFrame(raf)}
function show(id){if(window.SFX&&id!=="game")setTimeout(SFX.section,70);clearTimers();$$(".screen").forEach(s=>s.hidden=s.id!==id);cur=id;window.scrollTo(0,0)}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove("on"),1800)}
function ft(x,y,t,neg){const d=document.createElement("div");d.className="ft"+(neg?" neg":"");d.textContent=t;d.style.left=x+"px";d.style.top=y+"px";$("#fx").appendChild(d);setTimeout(()=>d.remove(),1000)}
function renderLevels(){
 $("#dev").checked=S.dev;
 $("#levelList").innerHTML=LV.map(l=>{const lock=!S.dev&&l.n>S.unlocked;const b=S.best[l.n];return `<button class="lv${lock?" lock":""}" data-lv="${l.n}"><div class="n">0${l.n}</div><div><div class="mono">${T("Level","लेवल")} ${l.n} · ${l.game}</div><b>${l.name}</b><span>${l.sub}</span></div><div class="best mono">${lock?T("🔒 Locked","🔒 बंद"):(b?T("Best ","बेस्ट ")+pad(b):T("Not played","खेला नहीं"))}</div></button>`}).join("")}
function intro(n){const l=LV[n-1];G={l,n};$("#introKick").textContent=T("LEVEL 0","लेवल 0")+n+" · "+l.game;$("#introTitle").textContent=l.name;$("#introLead").textContent=l.sub;$("#introSteps").innerHTML=l.steps.map(s=>`<li>${esc(s)}</li>`).join("");$("#introGo").onclick=()=>start(n);show("intro")}
function start(n){
 if(window.SFX)SFX.level();const l=LV[n-1];G={l,n,score:0,combo:1,streak:0,correct:0,wrong:0,miss:0,meter:0,queue:shuffle(claimsFor(l)),done:new Set(),t0:Date.now(),modal:false,ended:false};
 show("game");$("#hLvl").textContent=T("LVL 0","लेवल 0")+n;$("#hName").textContent=l.name;hud();
 const a=$("#arena");a.innerHTML="";a.onpointerdown=null;
 [balloons,darts,boss,wildfire][n-1](a)}
function hud(){$("#hScore").textContent=pad(G.score);$("#hCombo").textContent="x"+G.combo;$("#hClaims").textContent=T("Claims ","दावे ")+G.correct+"/"+total(G.l);$("#hMeter").style.width=Math.min(100,G.meter)+"%";$("#hMeter").style.background=G.meter>70?"#fff":"var(--gold)"}
function award(x,y){if(window.SFX)SFX.good();const pts=100*G.combo;G.score+=pts;G.streak++;G.combo=Math.min(5,1+Math.floor(G.streak/2));G.correct++;ft(x,y,"+"+pts);hud()}
function penalize(x,y,t){if(window.SFX)SFX.bad();G.score=Math.max(0,G.score-25);G.streak=0;G.combo=1;G.wrong++;ft(x,y,"-25 "+(t||T("Bro. Source?","भाई, सोर्स?")),true);hud()}
function reality(c,cb){
 G.modal=true;
 $("#realityCard").innerHTML=`<span class="chip">${esc(c.tag)}</span><div class="lab">${T("The claim","दावा")}</div><div class="claimq">${esc(c.claim)}</div><div class="who">${esc(c.who)}</div><div class="lab">${T("The reality","हक़ीक़त")}</div>${c.reality.map(p=>`<p>${esc(p)}</p>`).join("")}<div class="lab">${T("Sources","सोर्स")}</div><div class="srcs">${c.src.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}: ${esc(s.note)} ↗</a>`).join("")}</div><button class="go" id="rNext">${T("Next →","आगे →")}</button>`;
 $("#ovReality").hidden=false;$("#rNext").focus();
 $("#rNext").onclick=()=>{$("#ovReality").hidden=true;G.modal=false;cb&&cb()}}
function finishIf(){if(G.ended)return true;const need=total(G.l);if(G.correct>=need){G.ended=true;later(complete,300);return true}return false}
function complete(){
 if(window.SFX)SFX.win();
 const n=G.n;const secs=Math.round((Date.now()-G.t0)/1000);const bonus=Math.max(0,300-secs*2);G.score+=bonus;
 S.best[n]=Math.max(S.best[n]||0,G.score);S.runs[n]=G.score;if(n<4)S.unlocked=Math.max(S.unlocked,n+1);save();
 $("#doneKick").textContent=T("LEVEL 0","लेवल 0")+n+T(" CLEARED"," पूरा");$("#doneTitle").textContent=G.l.name+T(" done."," पूरा।");
 $("#doneStats").innerHTML=`<div>${T("Score","स्कोर")}<b>${pad(G.score)}</b></div><div>${T("Right","सही")}<b>${G.correct}</b></div><div>${T("Oops","ग़लत")}<b>${G.wrong}</b></div><div>${T("Missed","छूटे")}<b>${G.miss}</b></div><div>${T("Time","समय")}<b>${secs}${T("s","से")}</b></div>`;
 const nx=$("#doneNext");nx.textContent=n<4?T("NEXT LEVEL →","अगला लेवल →"):T("FINISH →","ख़त्म →");nx.onclick=()=>n<4?intro(n+1):final();show("done")}
function final(){const t=Object.values(S.runs).reduce((a,b)=>a+b,0);G.finalScore=t;$("#finalStats").innerHTML=`<div>${T("Total score","कुल स्कोर")}<b>${pad(t)}</b></div><div>${T("Claims","दावे")}<b>36</b></div>`;$("#nick").value=store.get("rb_nick","");show("final")}
function over(){if(G.ended)return;G.ended=true;clearTimers();$("#realityCard").innerHTML=`<span class="chip">${T("Rumour spread","अफ़वाह फैल गई")}</span><h3>${T("The afwah meter maxed out.","अफ़वाह मीटर फुल हो गया।")}</h3><p>${T("Too many claims got away. Try again, you've now seen some of the receipts.","बहुत सारे दावे निकल गए। दोबारा कोशिश करो, कुछ रसीदें तो अब तुमने देख ली हैं।")}</p><button class="go" id="rNext">${T("Retry","दोबारा")}</button>`;$("#ovReality").hidden=false;$("#rNext").onclick=()=>{$("#ovReality").hidden=true;start(G.n)}}
const facts=()=>shuffle(CLAIMS.map(c=>c.fact));
// ---- L1 balloons
function balloons(a){
 const fl=facts();let fi=0;const live=new Set();let last=performance.now(),acc=0;
 function spawn(){let item;
  if(Math.random()<.22){item={fact:fl[fi++%fl.length]}}else{const c=G.queue.shift();if(!c)return;item={c}}
  const e=document.createElement("div");e.className="balloon"+(item.c?"":" fact");e.innerHTML=`<span class="tag">${item.c?T("CLAIM","दावा"):T("✓ FACT","✓ तथ्य")}</span>${esc(item.c?item.c.claim:item.fact)}`;
  const w=a.clientWidth;e.style.left=rnd(6,Math.max(10,w-160))+"px";const o={e,y:a.clientHeight+10,v:rnd(55,85)+G.n*5,item};e.style.top=o.y+"px";live.add(o);a.appendChild(e);
  e.onpointerdown=ev=>{ev.stopPropagation();if(G.modal||G.ended)return;live.delete(o);e.remove();const r=e.getBoundingClientRect();
   if(item.c){award(ev.clientX,ev.clientY);G.done.add(item.c.id);reality(item.c,()=>{hud();finishIf()})}else{penalize(ev.clientX,ev.clientY,T("That one is a fact","यह तो तथ्य है"))}}}
 function loop(t){const dt=Math.min(.25,(t-last)/1000);last=t;
  if(!G.modal&&!G.ended){acc+=dt;const left=G.queue.length;if(acc>1.25&&live.size<7){acc=0;spawn()}
   live.forEach(o=>{o.y-=o.v*dt;o.e.style.top=o.y+"px";if(o.y<-220){live.delete(o);o.e.remove();if(o.item.c){G.queue.push(o.item.c);G.miss++;G.streak=0;G.combo=1;G.meter+=14;hud();if(G.meter>=100)over()}}})}
  raf=requestAnimationFrame(loop)}
 raf=requestAnimationFrame(loop)}
// ---- L2 darts
function darts(a){
 const fl=facts();let fi=0;const live=new Set();let last=performance.now(),acc=0;
 function spawn(){let item;if(Math.random()<.25)item={fact:fl[fi++%fl.length]};else{const c=G.queue.shift();if(!c)return;item={c}}
  const e=document.createElement("div");e.className="tgt"+(item.c?"":" fact");const txt=item.c?item.c.claim:item.fact;e.innerHTML=`<span>${esc(txt.length>70?txt.slice(0,68)+"…":txt)}</span>`;
  const h=a.clientHeight,dir=Math.random()<.5?1:-1,w=a.clientWidth;const y=rnd(40,Math.max(60,h-260));const o={e,x:dir>0?-200:w+10,y,v:dir*rnd(90,140),item};e.style.top=y+"px";e.style.left=o.x+"px";a.appendChild(e);live.add(o)}
 a.onpointerdown=ev=>{if(G.modal||G.ended)return;const r=a.getBoundingClientRect();const px=ev.clientX-r.left,py=ev.clientY-r.top;
  const d=document.createElement("div");d.className="dart";d.style.left=px+"px";d.style.top=(py)+"px";a.appendChild(d);d.animate([{transform:"translateY(260px) scale(1.4)",opacity:.2},{transform:"translateY(0) scale(1)",opacity:1}],{duration:160});setTimeout(()=>d.remove(),700);
  let hit=null;live.forEach(o=>{const bx=o.x,by=o.y;if(px>=bx&&px<=bx+190&&py>=by&&py<=by+190)hit=o});
  if(!hit){G.streak=0;G.combo=1;hud();return}
  live.delete(hit);hit.e.remove();
  if(hit.item.c){award(ev.clientX,ev.clientY);G.done.add(hit.item.c.id);reality(hit.item.c,()=>{hud();finishIf()})}else penalize(ev.clientX,ev.clientY,T("That one is a fact","यह तो तथ्य है"))};
 function loop(t){const dt=Math.min(.25,(t-last)/1000);last=t;
  if(!G.modal&&!G.ended){acc+=dt;if(acc>1.6&&live.size<5){acc=0;spawn()}
   const w=a.clientWidth;live.forEach(o=>{o.x+=o.v*dt;o.e.style.left=o.x+"px";if(o.x>w+220||o.x<-420){live.delete(o);o.e.remove();if(o.item.c){G.queue.push(o.item.c);G.miss++;G.streak=0;G.combo=1;G.meter+=12;hud();if(G.meter>=100)over()}}})}
  raf=requestAnimationFrame(loop)}
 raf=requestAnimationFrame(loop)}
// ---- L3 boss
function boss(a){
 a.innerHTML=`<div class="bosshead"><div class="face">👹</div><div class="mono small">${T("Propaganda Final Boss","प्रोपेगैंडा फ़ाइनल बॉस")}</div><div class="hp"><i id="hp"></i></div></div><div class="boss" id="shields"></div>`;
 const cs=claimsFor(G.l);$("#shields").innerHTML=cs.map(c=>`<button class="shield" data-id="${c.id}">${esc(c.claim)}</button>`).join("");
 $("#shields").onclick=ev=>{const b=ev.target.closest(".shield");if(!b||G.modal||G.ended)return;const c=cs.find(x=>x.id==b.dataset.id);b.classList.add("broke");const r=b.getBoundingClientRect();award(r.left+r.width/2,r.top);G.done.add(c.id);$("#hp").style.width=Math.max(0,100-G.correct*20)+"%";reality(c,()=>{hud();finishIf()})}}
// ---- L4 wildfire
function wildfire(a){
 const cs=shuffle(claimsFor(G.l));let i=0;
 a.innerHTML=`<div class="net"><div class="nodes" id="nodes"></div><div class="rumour" id="rum"></div></div>`;
 const nodes=$("#nodes");const N=26;for(let k=0;k<N;k++){const n=document.createElement("i");n.style.left=rnd(2,96)+"%";n.style.top=rnd(4,86)+"%";nodes.appendChild(n)}
 function next(){if(G.ended)return;if(i>=cs.length){return}const c=cs[i];G.cur=c;
  $$("#nodes i").forEach(n=>n.classList.remove("hot"));
  const wrong=shuffle(CLAIMS.filter(x=>x.id!==c.id)).slice(0,2).map(x=>x.check);const opts=shuffle([c.check,...wrong]);
  $("#rum").innerHTML=`<div class="mono small">${T("Rumour","अफ़वाह")} ${i+1} ${T("of","/")} ${cs.length}</div><h3>${esc(c.claim)}</h3><div class="mono small dim">${T("Pick the correct reality check","सही रियलिटी चेक चुनो")}</div><div class="opts">${opts.map(o=>`<button class="opt">${esc(o)}</button>`).join("")}</div>`;
  let t0=performance.now(),dur=16000,spread=0;
  const tick=t=>{if(G.ended)return;if(!G.modal){spread=Math.min(1,(t-t0)/dur);const hot=Math.floor(spread*N);$$("#nodes i").forEach((n,k)=>n.classList.toggle("hot",k<hot));G.meter=spread*100;hud();if(spread>=1){G.miss++;G.streak=0;G.combo=1;G.meter=0;i++;reality(c,()=>{finishNext()});return}}else{t0+=16}raf=requestAnimationFrame(tick)};
  raf=requestAnimationFrame(tick);
  $$("#rum .opt").forEach(b=>b.onclick=ev=>{if(G.modal)return;cancelAnimationFrame(raf);
   if(b.textContent===c.check){award(ev.clientX,ev.clientY);G.done.add(c.id);G.meter=0;i++;reality(c,()=>{hud();if(!finishIf())next()})}
   else{penalize(ev.clientX,ev.clientY,T("Wrong check","ग़लत चेक"));t0-=3000;b.style.opacity=.3;b.disabled=true;raf=requestAnimationFrame(tick)}})}
 function finishNext(){hud();if(G.correct>=total(G.l)){finishIf();return}
  // missed rumours come back around once
  if(i>=cs.length){const m=cs.filter(c=>!G.done.has(c.id));if(m.length){cs.length=0;cs.push(...m);i=0}else{finishIf();return}}next()}
 next()}
// ---- receipts
function renderReceipts(f){
 const keys=["ALL",...LV.map(l=>l.key)];$("#rTabs").innerHTML=keys.map(k=>`<button data-f="${k}" class="${(f||"ALL")==k?"on":""}">${k==="ALL"?T("All 36","सभी 36"):k}</button>`).join("");
 $("#rList").innerHTML=CLAIMS.filter(c=>!f||f==="ALL"||c.level===f).map(c=>`<details><summary><span class="chip">${esc(c.tag)}</span>${esc(c.claim)}</summary><div class="who">${esc(c.who)}</div>${c.reality.map(p=>`<p>${esc(p)}</p>`).join("")}<div class="srcs">${c.src.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}: ${esc(s.note)} ↗</a>`).join("")}</div></details>`).join("")}
$("#rTabs").onclick=e=>{const b=e.target.closest("button");if(b)renderReceipts(b.dataset.f)};
// ---- board
let bt="all";
function renderBoard(){const today=new Date().toISOString().slice(0,10);let r=[...S.board].filter(x=>bt==="all"||x.d===today).sort((a,b)=>b.s-a.s).slice(0,15);
 $("#bCap").textContent=bt==="all"?T("Best runs saved on this device.","इस डिवाइस पर सहेजे गए सबसे अच्छे रन।"):T("Runs posted today on this device.","आज इस डिवाइस पर पोस्ट हुए रन।");
 $("#bList").innerHTML=r.length?r.map(x=>`<li>${esc(x.n)} <span>${pad(x.s)}</span></li>`).join(""):"<li>"+T("No scores yet. Finish all four levels to post one.","अभी कोई स्कोर नहीं। स्कोर पोस्ट करने के लिए चारों लेवल पूरे करो।")+"</li>";
 $$("#bTabs button").forEach(b=>b.classList.toggle("on",b.dataset.t===bt))}
$("#bTabs").onclick=e=>{const b=e.target.closest("button");if(b){bt=b.dataset.t;renderBoard()}};
$("#saveScore").onclick=()=>{const n=($("#nick").value||"Anon").trim().slice(0,16)||"Anon";store.set("rb_nick",n);S.board.push({n,s:G.finalScore||0,d:new Date().toISOString().slice(0,10)});save();bt="all";renderBoard();$("#ovBoard").hidden=false};
async function share(){const d={title:"It's Reality Check, Bro.",text:T("Pop claims, dart myths, check the receipts.","दावे फोड़ो, मिथकों पर डार्ट मारो, रसीदें देखो।"),url:location.href};try{if(navigator.share){await navigator.share(d);return}await navigator.clipboard.writeText(d.url);toast(T("Link copied","लिंक कॉपी हुआ"))}catch(e){}}
document.addEventListener("click",e=>{
 const lv=e.target.closest("[data-lv]");if(lv){const n=+lv.dataset.lv;if(S.dev||n<=S.unlocked)intro(n);else toast(T("Clear the previous level first","पहले पिछला लेवल पूरा करो"));return}
 const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act;
 if(a==="home")show("landing");else if(a==="levels"){renderLevels();show("levels")}
 else if(a==="receipts"){renderReceipts();show("receipts")}else if(a==="board"){renderBoard();$("#ovBoard").hidden=false}
 else if(a==="closeBoard")$("#ovBoard").hidden=true;else if(a==="share")share();else if(a==="retry")start(G.n)});
$("#dev").onchange=e=>{S.dev=e.target.checked;save();renderLevels()};
renderLevels();
})();
