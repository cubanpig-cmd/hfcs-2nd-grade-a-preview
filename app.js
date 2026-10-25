/* HFCS 2nd Grade A — preview site. Plain vanilla JS. */
(function(){
"use strict";
var D=window.SITE_DATA||{};
function h(t,a,c){var e=document.createElement(t);if(a)for(var k in a){if(k==="class")e.className=a[k];else if(k==="html")e.innerHTML=a[k];else if(k.slice(0,2)==="on")e.addEventListener(k.slice(2),a[k]);else e.setAttribute(k,a[k]);}
 (c||[]).forEach(function(x){if(x!=null)e.appendChild(typeof x==="string"?document.createTextNode(x):x)});return e;}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
var PRAISE=["Great job!","You got it!","Super thinking!","Way to go!","Nice work!","Awesome!"];
var KIND=["Good try! Let's look again.","Almost! Try one more time.","That's okay — mistakes help us learn.","Keep going, you can do it!"];
function pick(a){return a[Math.floor(Math.random()*a.length)];}
var BTN="min-h-12 rounded-pill px-5 text-base font-extrabold";
var CHOICE="flex min-h-12 w-full items-center rounded-xl border-3 border-navy bg-paper px-4 py-2 text-left text-lg font-bold text-navy-deep";

/* ---------- Tabs ---------- */
function initTabs(root){
 (root||document).querySelectorAll("[data-tabs]").forEach(function(box){
  if(box._tabs)return;box._tabs=1;
  var bar=box.querySelector(":scope>[data-tabbar]");if(!bar)return;
  var btns=[].slice.call(bar.querySelectorAll("[data-tab]"));
  function sel(k,push){btns.forEach(function(b){var on=b.getAttribute("data-tab")===k;b.setAttribute("aria-selected",on);b.className=on?b.getAttribute("data-on"):b.getAttribute("data-off");});
   [].slice.call(box.querySelectorAll(":scope>[data-pane]")).forEach(function(p){p.hidden=p.getAttribute("data-pane")!==k;});
   if(push&&box.id)history.replaceState(null,"","#"+box.id+"="+encodeURIComponent(k));}
  bar.addEventListener("click",function(e){var b=e.target.closest("[data-tab]");if(b)sel(b.getAttribute("data-tab"),true);});
  box._sel=sel;
  var m=location.hash.match(new RegExp("^#"+box.id+"=(.+)$"));
  var start=m?decodeURIComponent(m[1]):(bar.querySelector("[data-default]")||btns[0]).getAttribute("data-tab");
  sel(start,false);
 });}
window.goTab=function(boxId,k){var b=document.getElementById(boxId);if(b&&b._sel){b._sel(k,true);b.scrollIntoView({behavior:"smooth"});}};

/* ---------- Quiz engine: adaptive, 3-level hints, shuffled, recap ---------- */
function Quiz(mount,items,opt){
 opt=opt||{};
 var queue=shuffle(items.map(function(it,i){return {it:it,i:i,tries:0};}));
 var stats={first:0,total:items.length,missed:{}};var cur=null,hint=0,answered=false,seen=0;
 var box=h("div",{class:"quiz paper-card rounded-xl p-4 sm:p-5"});mount.innerHTML="";mount.appendChild(box);
 function choicesOf(it){if(typeof it.answer==="boolean")return ["True","False"];return it.choices;}
 function correctIdx(it){if(typeof it.answer==="boolean")return it.answer?0:1;if(typeof it.answer==="string")return it.choices.indexOf(it.answer);return it.answer;}
 function next(){if(!queue.length)return recap();cur=queue.shift();hint=0;answered=false;cur.order=shuffle(choicesOf(cur.it).map(function(c,i){return i;}));cur.hidden={};draw();}
 function draw(msg,ok){var it=cur.it;box.innerHTML="";
  box.appendChild(h("p",{class:"text-sm font-extrabold uppercase tracking-wide text-gold-deep"},[(opt.title||"Quiz")+" · "+(stats.total-queue.length-(answered?0:1)+(answered?0:1))+" of "+stats.total+(cur.tries?" · second chance":"")]));
  if(it.focus)box.appendChild(h("p",{class:"text-sm font-bold text-ink-soft"},[it.focus]));
  box.appendChild(h("h3",{class:"font-display mt-1 text-2xl text-navy-deep"},[it.prompt]));
  var list=h("div",{class:"mt-3 grid gap-2"});var ci=correctIdx(it);var ch=choicesOf(it);
  cur.order.forEach(function(i){if(cur.hidden[i])return;list.appendChild(h("button",{type:"button",class:CHOICE+(answered&&i===ci?" bg-grass/20":""),onclick:function(){answer(i)}},[ch[i]]));});
  box.appendChild(list);
  var hb=h("div",{class:"mt-3 flex flex-wrap gap-2"});
  if(!answered&&hint<3)hb.appendChild(h("button",{type:"button",class:BTN+" bg-gold text-navy-deep",onclick:giveHint},["Hint "+(hint+1)+" of 3"]));
  if(answered)hb.appendChild(h("button",{type:"button",class:BTN+" bg-navy text-chalk",onclick:next},[queue.length?"Next question":"See my recap"]));
  box.appendChild(hb);
  var hs=hints(it);for(var k=0;k<hint;k++)box.appendChild(h("p",{class:"mt-2 font-bold text-navy-deep"},["💡 "+hs[k]]));
  if(msg)box.appendChild(h("p",{class:"mt-3 text-lg font-extrabold "+(ok?"text-grass":"text-apple-deep"),role:"status"},[msg]));}
 function hints(it){var ch=choicesOf(it),ci=correctIdx(it);
  var w=String(it.why||"").split(/(?<=[.!?])\s/)[0];
  return ["Read the question slowly. Which answer sounds like what we learned?"+(opt.hintTopic?" Think about "+opt.hintTopic+".":""),
   ch.length>2?"I took away an answer that is not right. Try again!":"Here is a clue: "+w,
   "Big clue: "+(it.why||("The answer starts with “"+String(ch[ci]).slice(0,3)+"…”"))];}
 function giveHint(){hint++;if(hint===2){var ch=choicesOf(cur.it),ci=correctIdx(cur.it);var wrong=cur.order.filter(function(i){return i!==ci&&!cur.hidden[i];});if(ch.length>2&&wrong.length>1)cur.hidden[wrong[0]]=1;}draw();}
 function answer(i){if(answered)return;var it=cur.it;if(i===correctIdx(it)){answered=true;if(!cur.tries&&!hint)stats.first++;draw(pick(PRAISE)+(it.why?" "+it.why:""),true);}
  else{cur.tries++;stats.missed[cur.i]=1;if(cur.tries===1){/* adaptive: come back to it later */queue.splice(Math.min(2,queue.length),0,{it:it,i:cur.i,tries:1});answered=true;draw(pick(KIND)+" We will come back to this one.",false);}
   else{answered=true;draw("The answer is “"+choicesOf(it)[correctIdx(it)]+"”. "+(it.why||""),false);}}}
 function recap(){box.innerHTML="";var miss=Object.keys(stats.missed).map(Number);
  box.appendChild(h("h3",{class:"font-display text-2xl text-navy-deep"},["⭐ Your recap"]));
  box.appendChild(h("p",{class:"mt-2 text-lg font-bold"},["You got "+stats.first+" of "+stats.total+" right on the first try. "+(miss.length?"Every try makes your brain stronger!":"Perfect! You are a star!")]));
  if(miss.length){var ul=h("ul",{class:"mt-2 list-disc pl-6"});miss.forEach(function(i){ul.appendChild(h("li",{},[items[i].prompt]));});box.appendChild(h("p",{class:"mt-3 font-extrabold"},["Practice these again:"]));box.appendChild(ul);}
  var row=h("div",{class:"mt-4 flex flex-wrap gap-2"});
  row.appendChild(h("button",{type:"button",class:BTN+" bg-navy text-chalk",onclick:function(){Quiz(mount,miss.length?miss.map(function(i){return items[i]}):items,opt);}},[miss.length?"Practice my missed ones":"Play again"]));
  (opt.links||[]).forEach(function(l){row.appendChild(h("a",{href:l.href,class:BTN+" inline-flex items-center bg-gold text-navy-deep no-underline",onclick:l.tab?function(e){e.preventDefault();goTab(l.tab[0],l.tab[1]);}:null},[l.label]));});
  box.appendChild(row);
  try{localStorage.setItem("recap:"+(opt.id||opt.title),JSON.stringify({first:stats.first,total:stats.total,at:Date.now()}));}catch(e){}}
 next();}
window.Quiz=Quiz;

/* ---------- Put-in-order engine ---------- */
function Order(mount,steps,opt){opt=opt||{};var pos=0,hint=0,order=shuffle(steps.map(function(s,i){return i;}));var box=h("div",{class:"paper-card rounded-xl p-4"});mount.innerHTML="";mount.appendChild(box);
 function draw(msg,ok){box.innerHTML="";box.appendChild(h("p",{class:"font-bold text-navy-deep"},[opt.intro||"Tap them in the right order."]));
  var done=h("ol",{class:"mt-2 list-decimal pl-6 font-bold text-grass"});steps.slice(0,pos).forEach(function(s){done.appendChild(h("li",{},[s]));});box.appendChild(done);
  if(pos>=steps.length){box.appendChild(h("p",{class:"mt-3 text-lg font-extrabold text-grass"},["🎉 "+pick(PRAISE)+" All in order!"]));box.appendChild(h("button",{type:"button",class:BTN+" mt-2 bg-navy text-chalk",onclick:function(){Order(mount,steps,opt)}},["Do it again"]));if(opt.onDone)opt.onDone();return;}
  var g=h("div",{class:"mt-3 grid gap-2"});order.forEach(function(i){if(i<pos)return;g.appendChild(h("button",{type:"button",class:CHOICE+(hint>=2&&i===pos?" bg-gold/40":""),onclick:function(){if(i===pos){pos++;hint=0;draw(pick(PRAISE),true);}else draw(pick(KIND),false);}},[steps[i]]));});box.appendChild(g);
  if(hint<3)box.appendChild(h("button",{type:"button",class:BTN+" mt-3 bg-gold text-navy-deep",onclick:function(){hint++;draw();}},["Hint "+(hint+1)+" of 3"]));
  var hs=["Say the whole thing out loud from the start.","The next one is glowing yellow.","The next one is: “"+steps[pos]+"”"];if(hint===1)box.appendChild(h("p",{class:"mt-2 font-bold"},["💡 "+hs[0]]));if(hint>=2)box.appendChild(h("p",{class:"mt-2 font-bold"},["💡 "+hs[hint-1]]));
  if(msg)box.appendChild(h("p",{class:"mt-2 font-extrabold "+(ok?"text-grass":"text-apple-deep")},[msg]));}
 draw();}
window.Order=Order;

/* ---------- Number answer engine (older packet math) ---------- */
function NumSet(mount,probs,opt){opt=opt||{};var cur=0,hint=0,done=probs.map(function(){return false}),typed="",state="";
 var box=h("div",{class:"paper-card rounded-xl p-4"});mount.innerHTML="";mount.appendChild(box);
 function draw(){var p=probs[cur];box.innerHTML="";
  var pills=h("div",{class:"flex flex-wrap gap-2"});probs.forEach(function(_,i){pills.appendChild(h("button",{type:"button",class:"min-h-11 rounded-pill px-3 font-bold "+(i===cur?"bg-navy text-chalk":done[i]?"bg-grass text-paper":"bg-paper-deep text-navy"),onclick:function(){cur=i;typed="";hint=0;state="";draw();}},[String(i+1)]));});box.appendChild(pills);
  box.appendChild(h("p",{class:"font-display mt-4 text-4xl text-navy-deep"},[p.q.replace("?","["+(typed||"?")+"]")]));
  var keys=h("div",{class:"mt-3 grid max-w-xs grid-cols-4 gap-2"});["1","2","3","4","5","6","7","8","9","0","⌫"].forEach(function(k){keys.appendChild(h("button",{type:"button",class:"bg-navy min-h-12 rounded-lg text-xl font-extrabold text-chalk","aria-label":k==="⌫"?"Delete":"Type "+k,onclick:function(){typed=k==="⌫"?typed.slice(0,-1):(typed+k).slice(0,4);state="";draw();}},[k]));});box.appendChild(keys);
  var row=h("div",{class:"mt-3 flex flex-wrap gap-2"});
  row.appendChild(h("button",{type:"button",class:BTN+" bg-grass text-paper",onclick:function(){if(+typed===p.a&&typed!==""){state="ok";done[cur]=true;}else state="no";draw();}},["Check"]));
  if(hint<3)row.appendChild(h("button",{type:"button",class:BTN+" bg-gold text-navy-deep",onclick:function(){hint++;draw();}},["Hint "+(hint+1)+" of 3"]));
  if(state==="ok"&&cur<probs.length-1)row.appendChild(h("button",{type:"button",class:BTN+" bg-navy text-chalk",onclick:function(){cur++;typed="";hint=0;state="";draw();}},["Next"]));
  box.appendChild(row);for(var i=0;i<hint;i++)box.appendChild(h("p",{class:"mt-2 font-bold text-navy-deep"},["💡 "+p.h[i]]));
  if(state==="ok")box.appendChild(h("p",{class:"mt-2 text-lg font-extrabold text-grass"},[pick(PRAISE)]));if(state==="no")box.appendChild(h("p",{class:"mt-2 text-lg font-extrabold text-apple-deep"},[pick(KIND)]));
  var n=done.filter(Boolean).length;box.appendChild(h("p",{class:"mt-3 font-bold"},["Stars earned: "+n+" / "+probs.length+(n===probs.length?" — 🎉 you finished them all!":"")]));}
 draw();}
window.NumSet=NumSet;

/* ---------- Crossword ---------- */
function Crossword(mount,words){var R=0,C=0;words.forEach(function(w){w.cells.forEach(function(c){R=Math.max(R,c[0]+1);C=Math.max(C,c[1]+1);});});
 var sol={},num={};words.forEach(function(w){w.cells.forEach(function(c,i){sol[c]=w.answer[i];});num[w.cells[0]]=w.number;});
 var box=h("div",{class:"paper-card rounded-xl p-4"});mount.innerHTML="";mount.appendChild(box);
 var grid=h("div",{class:"inline-grid gap-1",style:"grid-template-columns:repeat("+C+",2.6rem)"});var inputs={};
 for(var r=0;r<R;r++)for(var c=0;c<C;c++){var k=[r,c];if(sol[k]){var wrap=h("div",{class:"relative"});if(num[k])wrap.appendChild(h("span",{class:"absolute left-0.5 top-0 text-[10px] font-bold"},[String(num[k])]));var inp=h("input",{maxlength:"1",class:"size-10 rounded border-2 border-navy bg-paper text-center text-xl font-extrabold uppercase","aria-label":"row "+(r+1)+" column "+(c+1)});inputs[k]=inp;wrap.appendChild(inp);grid.appendChild(wrap);}else grid.appendChild(h("div",{}));}
 box.appendChild(grid);var clues=h("div",{class:"mt-3 grid gap-2"});var hintLv={};
 words.forEach(function(w){hintLv[w.id]=0;var line=h("div",{class:"flex flex-wrap items-center gap-2"});var t=h("span",{class:"font-bold"},[w.number+" "+w.dir+": "+w.clue]);line.appendChild(t);
  var b=h("button",{type:"button",class:"min-h-10 rounded-pill bg-gold px-3 text-sm font-extrabold text-navy-deep",onclick:function(){var l=++hintLv[w.id];if(l===1)t.textContent=w.number+" "+w.dir+": "+w.clue+" ("+w.answer.length+" letters)";else if(l===2){inputs[w.cells[0]].value=w.answer[0];}else{w.cells.forEach(function(c,i){inputs[c].value=w.answer[i];});b.remove();}if(l<3)b.textContent="Hint "+(l+1)+" of 3";}},["Hint 1 of 3"]);line.appendChild(b);clues.appendChild(line);});
 box.appendChild(clues);var msg=h("p",{class:"mt-2 text-lg font-extrabold",role:"status"});
 box.appendChild(h("button",{type:"button",class:BTN+" mt-3 bg-navy text-chalk",onclick:function(){var bad=0;for(var k in inputs){var ok=inputs[k].value.toUpperCase()===sol[k];inputs[k].style.background=ok?"#d9f2dc":inputs[k].value?"#fde2e2":"";if(!ok)bad++;}msg.textContent=bad?pick(KIND)+" Pink boxes need another look.":"🎉 "+pick(PRAISE)+" Puzzle solved!";msg.className="mt-2 text-lg font-extrabold "+(bad?"text-apple-deep":"text-grass");}},["Check my puzzle"]));box.appendChild(msg);}
window.Crossword=Crossword;

/* ---------- Star words ---------- */
function StarWords(mount,words){var box=h("div",{class:"grid gap-4"});mount.innerHTML="";mount.appendChild(box);
 var fc=h("div",{class:"paper-card rounded-xl p-4"});box.appendChild(fc);var deck=words.slice(),i=0;
 function fdraw(){fc.innerHTML="";fc.appendChild(h("h3",{class:"font-display text-2xl text-navy-deep"},["Flashcards"]));fc.appendChild(h("p",{class:"text-sm font-bold"},["Set "+deck[i][1]+" · Word "+(i+1)+" of "+deck.length]));var w=deck[i],show=false;var card=h("button",{type:"button",class:"mt-2 w-full rounded-xl border-4 border-navy bg-paper p-6 font-display text-5xl text-navy-deep",onclick:function(){show=!show;card.textContent=show?w[3]:w[2];card.style.fontSize=show?"1.5rem":"";}},[w[2]]);fc.appendChild(card);fc.appendChild(h("p",{class:"text-sm"},["Tap the card to see what it means."]));
  var r=h("div",{class:"mt-2 flex flex-wrap gap-2"});r.appendChild(h("button",{type:"button",class:BTN+" bg-paper-deep text-navy",onclick:function(){i=(i+deck.length-1)%deck.length;fdraw();}},["Previous"]));r.appendChild(h("button",{type:"button",class:BTN+" bg-gold text-navy-deep",onclick:function(){deck=shuffle(deck);i=0;fdraw();}},["Shuffle"]));r.appendChild(h("button",{type:"button",class:BTN+" bg-navy text-chalk",onclick:function(){i=(i+1)%deck.length;fdraw();}},["Next"]));fc.appendChild(r);}
 fdraw();
 var mq=h("div",{});box.appendChild(h("h3",{class:"font-display text-2xl text-navy-deep"},["Meaning match"]));box.appendChild(mq);
 function round(){var ten=shuffle(words).slice(0,10);Quiz(mq,ten.map(function(w){var others=shuffle(words.filter(function(x){return x!==w})).slice(0,2).map(function(x){return x[2]});return {prompt:"Which Star Word means: “"+w[3]+"”?",choices:[w[2]].concat(others),answer:0,why:"“"+w[2]+"” means "+w[3]+"."};}),{title:"Star Words",id:"star",hintTopic:"each word's meaning"});}
 round();
 var sp=h("div",{class:"paper-card rounded-xl p-4"});box.appendChild(sp);
 function sround(){var ten=shuffle(words).slice(0,10),k=0,score=0,hint=0;function d(msg,ok){sp.innerHTML="";sp.appendChild(h("h3",{class:"font-display text-2xl text-navy-deep"},["Spelling quiz"]));if(k>=ten.length){sp.appendChild(h("p",{class:"text-lg font-bold"},["Recap: you spelled "+score+" of 10. "+(score>7?"Super speller!":"Keep practicing — you're growing!")]));sp.appendChild(h("button",{type:"button",class:BTN+" bg-navy text-chalk",onclick:sround},["New round"]));return;}
  var w=ten[k];sp.appendChild(h("p",{class:"font-bold"},["Word "+(k+1)+" of 10 · Score "+score]));sp.appendChild(h("p",{class:"mt-1 text-xl"},["Meaning: "+w[3]]));var inp=h("input",{class:"mt-2 min-h-12 w-full max-w-xs rounded-lg border-3 border-navy px-3 text-xl",autocomplete:"off","aria-label":"Type the Star Word"});sp.appendChild(inp);
  var hs=["It has "+w[2].length+" letters.","It starts with “"+w[2][0]+"”.","It is spelled: "+w[2].split("").join(" ")];for(var j=0;j<hint;j++)sp.appendChild(h("p",{class:"mt-1 font-bold"},["💡 "+hs[j]]));
  var r=h("div",{class:"mt-2 flex flex-wrap gap-2"});r.appendChild(h("button",{type:"button",class:BTN+" bg-grass text-paper",onclick:function(){if(inp.value.trim().toLowerCase()===w[2].toLowerCase()){if(!hint)score++;k++;hint=0;d(pick(PRAISE),true);}else d(pick(KIND),false);}},["Submit"]));if(hint<3)r.appendChild(h("button",{type:"button",class:BTN+" bg-gold text-navy-deep",onclick:function(){hint++;d();}},["Hint "+(hint+1)+" of 3"]));r.appendChild(h("button",{type:"button",class:BTN+" bg-paper-deep text-navy",onclick:function(){k++;hint=0;d("The word was “"+w[2]+"”. We'll see it again soon!",false);}},["Skip"]));sp.appendChild(r);if(msg)sp.appendChild(h("p",{class:"mt-2 font-extrabold "+(ok?"text-grass":"text-apple-deep")},[msg]));inp.focus();}d();}
 sround();}
window.StarWords=StarWords;

/* ---------- Checklists remember ticks ---------- */
function initChecks(){document.querySelectorAll("[data-check]").forEach(function(b){var key="chk:"+b.getAttribute("data-check");function paint(){var on=localStorage.getItem(key)==="1";b.setAttribute("aria-pressed",on);b.querySelector(".box").textContent=on?"✅":"⬜";}
 b.addEventListener("click",function(){localStorage.setItem(key,localStorage.getItem(key)==="1"?"0":"1");paint();});paint();});}

/* ---------- YouTube thumbnails -> player ---------- */
function initVideos(){document.querySelectorAll("img[src*='i.ytimg.com/vi/']").forEach(function(img){var id=img.src.split("/vi/")[1].split("/")[0];var holder=img.closest("button")||img.parentElement;holder.style.cursor="pointer";holder.addEventListener("click",function(e){e.preventDefault();var f=h("iframe",{src:"https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1",allow:"autoplay; encrypted-media; picture-in-picture",allowfullscreen:"",class:"aspect-video w-full",title:"Video"});holder.replaceWith(f);});});}

function mounts(){document.querySelectorAll("[data-mount]").forEach(function(m){var f=window.MOUNTS&&window.MOUNTS[m.getAttribute("data-mount")];if(f)f(m);});}
document.addEventListener("DOMContentLoaded",function(){mounts();initTabs();initChecks();initVideos();});
})();
