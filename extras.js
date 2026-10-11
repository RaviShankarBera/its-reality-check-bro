/* Language toggle (EN/HI) + subtle generated sound effects. No audio files, no external assets. */
(function(){
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var lang=LS.get("rb_lang")==="hi"?"hi":"en";
window.RB_LANG=lang;
window.T=function(en,hi){return lang==="hi"&&hi!=null?hi:en};
document.documentElement.lang=lang==="hi"?"hi":"en";
if(lang==="hi")document.documentElement.classList.add("hi");

// ---- claims content
if(lang==="hi"&&window.CLAIMS&&window.HI_CLAIMS){
 window.CLAIMS.forEach(function(c){var h=window.HI_CLAIMS[c.id];if(!h)return;
  c.claim=h[0];c.who=h[1];c.tag=h[2];c.check=h[3];c.reality=h[4];c.fact=h[5];
  c.src.forEach(function(s,i){if(h[6][i])s.note=h[6][i]})});
}

// ---- static UI text (exact text-node match, English -> Hindi)
var D={
"POPPING THE PROPAGANDA.":"प्रोपेगैंडा की हवा निकालो।",
"Share":"शेयर","Receipts":"रसीदें","BIG CLAIMS. REAL SOURCES.":"बड़े दावे। असली सोर्स।","LET'S SEE WHAT SURVIVES.":"देखते हैं क्या टिकता है।",
"START PLAYING":"खेलना शुरू करें","🏆 SCOREBOARD":"🏆 स्कोरबोर्ड","⇪ SHARE":"⇪ शेयर",
"An independent explainer game by":"एक स्वतंत्र एक्सप्लेनर गेम, बनाने वाले:",
"· Stacknity. Not affiliated with any party, the ECI or any movement. Reality checks summarise the linked public reporting as of Oct 2026. Open the sources and judge for yourself.":"· Stacknity। किसी भी दल, ECI या आंदोलन से कोई संबंध नहीं। रियलिटी चेक अक्टूबर 2026 तक की लिंक की गई सार्वजनिक रिपोर्टिंग का सार हैं। सोर्स खोलिए और ख़ुद फ़ैसला कीजिए।",
"← Home":"← होम","Scoreboard":"स्कोरबोर्ड","Choose your level of delulu":"अपना डेलुलु लेवल चुनिए","Clear a level to unlock the next one.":"अगला लेवल खोलने के लिए एक लेवल पूरा कीजिए।",
"Dev mode: unlock every level":"डेव मोड: सभी लेवल खोलें","← Level select":"← लेवल चुनें","GO →":"शुरू →",
"Score":"स्कोर","Combo":"कॉम्बो","Afwah meter":"अफ़वाह मीटर","NEXT LEVEL →":"अगला लेवल →","Replay":"दोबारा खेलें","Levels":"लेवल",
"ALL 4 LEVELS CLEARED":"चारों लेवल पूरे","Claims popped. Myths darted. Shields broken. Rumours contained.":"दावे फोड़े। मिथकों पर डार्ट मारे। ढाल तोड़ी। अफ़वाहें रोकीं।",
"POST SCORE":"स्कोर पोस्ट करें","Read the receipts":"रसीदें पढ़ें","Play":"खेलें","The receipts":"रसीदें",
"All 36 claims, each with a reality check and sources. Tap any card to open it.":"सभी 36 दावे, हर एक के साथ रियलिटी चेक और सोर्स। खोलने के लिए किसी भी कार्ड पर टैप करें।",
"Each check summarises the linked pages. Where the reporting is mixed, the card says so. If you spot an error, open an issue on the repo.":"हर चेक लिंक किए गए पेजों का सार है। जहाँ रिपोर्टिंग मिली-जुली है, कार्ड में यही लिखा है। कोई ग़लती दिखे तो repo पर issue खोलिए।",
"All time":"अब तक के","Today":"आज के","Best runs saved on this device.":"इस डिवाइस पर सहेजे गए सबसे अच्छे रन।"
};
var DEXTRA={"It's Reality Check, Bro. Done.":"It's Reality Check, Bro. पूरा!"};
function tr(txt){var k=txt.replace(/\s+/g," ").trim();return D[k]||DEXTRA[k]||null}
function applyStatic(){
 if(lang!=="hi")return;
 var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,list=[];
 while(n=w.nextNode()){var p=n.parentNode;if(p&&/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;list.push(n)}
 list.forEach(function(n){var h=tr(n.nodeValue);if(h){var lead=/^\s/.test(n.nodeValue)?" ":"",trail=/\s$/.test(n.nodeValue)?" ":"";n.nodeValue=lead+h+trail}});
 var ni=document.getElementById("nick");if(ni)ni.placeholder="आपका उपनाम";
 document.title="It's Reality Check, Bro. - एक राजनीतिक रियलिटी-चेक गेम";
}

// ---- sound
var ctx=null,muted=LS.get("rb_mute")==="1",master=null;
function ac(){
 if(ctx)return ctx;
 var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
 try{ctx=new C();master=ctx.createGain();master.gain.value=.16;master.connect(ctx.destination)}catch(e){ctx=null}
 return ctx}
function tone(f,t0,dur,type,vol,f2){
 var c=ac();if(!c||muted)return;if(c.state==="suspended")c.resume();
 var o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;
 o.type=type||"sine";o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.6,t+.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03)}
window.SFX={
 click:function(){tone(900,0,.05,"square",.35,520)},
 section:function(){tone(523,0,.09,"triangle",.5);tone(784,.08,.14,"triangle",.5)},
 level:function(){[392,494,587,784].forEach(function(f,i){tone(f,i*.09,.16,"triangle",.55)})},
 good:function(){tone(660,0,.07,"sine",.5);tone(990,.06,.1,"sine",.45)},
 bad:function(){tone(220,0,.16,"sawtooth",.3,140)},
 win:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*.1,.22,"triangle",.55)})}
};
document.addEventListener("pointerdown",function(e){
 ac();
 if(e.target.closest&&e.target.closest("button,.pill,.lv,.opt,.shield,summary,a,label,[data-act],[data-lv]")&&!e.target.closest("#ctl"))SFX.click()
},true);

// ---- controls (language + mute)
function build(){
 var d=document.createElement("div");d.id="ctl";
 d.innerHTML='<button type="button" id="langBtn" aria-label="Language / भाषा"><span class="'+(lang==="en"?"on":"")+'">EN</span><span class="'+(lang==="hi"?"on":"")+'">हिं</span></button><button type="button" id="muteBtn" aria-label="Sound on/off"></button>';
 document.body.appendChild(d);
 var m=d.querySelector("#muteBtn");
 function paint(){m.textContent=muted?"🔇":"🔊";m.setAttribute("aria-pressed",muted?"true":"false")}
 paint();
 m.onclick=function(){muted=!muted;LS.set("rb_mute",muted?"1":"0");paint();if(!muted){ac();SFX.click()}};
 d.querySelector("#langBtn").onclick=function(){LS.set("rb_lang",lang==="hi"?"en":"hi");SFX.click();location.reload()};
}
build();applyStatic();
})();
