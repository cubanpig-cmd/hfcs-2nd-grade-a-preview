(function(){
var P=[[359,243],[674,570],[873,103],[459,310],[767,221],[652,321],[559,248],[169,137],[842,132],[454,332],[648,223],[647,222],[698,631],[397,123],[423,103],[879,327],[256,42],[738,136],[575,341],[966,345],[324,102]];
var WORD=P.length-1;
var cur=0,typed="",hint=0,state="idle",done=P.map(function(){return false;});
function $(id){return document.getElementById(id);}
function d(n,k){return Math.floor(n/k)%10;}
/* Hints help the learner work it out; they never state the answer. */
function hintsFor(a,b){
 var w=a===324&&b===102;
 return[(w?"“Gives away” means take away. Write 324 − 102. ":"")+"Start with the ones: "+d(a,1)+" take away "+d(b,1)+".",
 "Now the tens: "+d(a,10)+" take away "+d(b,10)+". Write that digit in the tens place, next to your ones digit.",
 "Last, the hundreds: "+(d(a,100))+" take away "+(d(b,100))+". Put your three digits together. Check: your answer + "+b+" should make "+a+"."];}
function render(){var p=P[cur],a=p[0],b=p[1],w=cur===WORD;
 $("p10-pills").innerHTML=P.map(function(_,i){return '<button type="button" data-i="'+i+'" class="min-h-11 shrink-0 rounded-pill px-3 font-display text-base font-bold '+(i===cur?"bg-navy text-chalk":done[i]?"bg-grass text-paper":"bg-paper-deep text-navy")+'">'+(i===WORD?"Story":(i+1))+'</button>';}).join("");
 var st=$("p10-story");st.hidden=!w;if(w)st.textContent="Word problem: Hector has 324 marbles. He gives 102 marbles to his brother. How many marbles does Hector have now?";
 var c=["hundreds","tens","ones"].map(function(h){return '<p class="bg-gold/30 py-1 text-sm font-extrabold uppercase">'+h+'</p>';}).join("");
 [a,b].forEach(function(n,r){var s=String(n);while(s.length<3)s=" "+s;s.split("").forEach(function(x,k){
  c+='<p class="font-display border-t-2 '+(k?"border-l-2 ":"")+'border-navy py-3 text-4xl">'+(r===1&&k===0?'<span class="text-2xl">−</span> ':'')+(x===" "?"&nbsp;":x)+'</p>';});});
 $("p10-grid").innerHTML=c;
 var msg="";if(state==="ok")msg='<span class="text-grass font-extrabold">Yes! Great subtracting!</span>';else if(state==="retry")msg='<span class="text-apple-deep font-extrabold">Try again. Take away the ones first, then tens, then hundreds. Tap Hint if you need help.</span>';
 $("p10-answer").innerHTML='<span>'+a+' − '+b+' = </span><span class="min-w-16 rounded-lg border-2 border-navy bg-paper px-3 py-1">'+(typed||"?")+'</span> '+msg;
 var h=hintsFor(a,b),hs="";for(var i=0;i<hint;i++)hs+='<p class="mt-2 text-base font-bold text-navy-deep">'+(i===0?"Hint: ":"")+h[i]+'</p>';$("p10-hints").innerHTML=hs;
 $("p10-next").hidden=!(state==="ok"&&cur<P.length-1);
 $("p10-stars").textContent="Stars earned: "+done.filter(Boolean).length+" / "+P.length;}
function go(i){cur=i;typed="";hint=0;state="idle";render();}
$("p10-keys").innerHTML=["1","2","3","4","5","6","7","8","9","0","⌫"].map(function(k){return '<button type="button" data-k="'+k+'" class="bg-navy min-h-12 rounded-lg text-xl font-extrabold text-chalk" aria-label="'+(k==="⌫"?"Delete last digit":"Type "+k)+'">'+k+'</button>';}).join("");
$("p10-keys").addEventListener("click",function(e){var k=e.target.getAttribute("data-k");if(!k)return;state="idle";typed=k==="⌫"?typed.slice(0,-1):(typed+k).slice(0,4);render();});
$("p10-pills").addEventListener("click",function(e){var i=e.target.getAttribute("data-i");if(i!==null)go(+i);});
$("p10-check").addEventListener("click",function(){var p=P[cur];if(typed!==""&&+typed===p[0]-p[1]){state="ok";done[cur]=true;}else state="retry";render();});
$("p10-hint").addEventListener("click",function(){if(hint<3)hint++;render();});
$("p10-next").addEventListener("click",function(){go(cur+1);});
render();
$("p10-subtabs").addEventListener("click",function(e){var t=e.target.getAttribute("data-p10tab");if(!t)return;
 document.querySelectorAll("[data-p10tab]").forEach(function(b){var on=b===e.target;b.className="min-h-12 shrink-0 rounded-pill px-4 text-base font-extrabold "+(on?"bg-navy text-chalk":"bg-paper-deep text-navy-deep");});
 document.querySelectorAll("[data-p10pane]").forEach(function(p){p.hidden=p.getAttribute("data-p10pane")!==t;});});

/* Open or closed syllable game (uses the site's quiz engine: hints, second chances, recap) */
var W=[["she","O","the vowel e"],["wet","C","the consonant t"],["hi","O","the vowel i"],["him","C","the consonant m"],["go","O","the vowel o"],["got","C","the consonant t"],["me","O","the vowel e"],["met","C","the consonant t"],["we","O","the vowel e"],["red","C","the consonant d"],["strap","C","the consonant p"],["clump","C","the consonant p"],["strand","C","the consonant d"],["no","O","the vowel o"],["bed","C","the consonant d"],["so","O","the vowel o"]];
var items=W.map(function(w){var open=w[1]==="O";return {prompt:"Is “"+w[0]+"” an open or a closed syllable?",choices:["Open","Closed"],answer:open?"Open":"Closed",
 why:"Look at the last letter of “"+w[0]+"”. It is "+w[2]+", so the syllable is "+(open?"open and the vowel says its long sound.":"closed and the vowel says its short sound.")};});
if(window.Quiz&&$("p10-quiz"))window.Quiz($("p10-quiz"),items,{title:"Open or closed?",id:"p10-open-closed",hintTopic:"the last letter: vowel or consonant"});

/* One-minute timer */
var t=null,left=60;
function paintT(){var el=$("p10-time");el.textContent="0:"+(left<10?"0":"")+left;if(left===60)el.textContent="1:00";}
$("p10-start").addEventListener("click",function(){if(t)return;left=60;paintT();t=setInterval(function(){left--;paintT();if(left<=0){clearInterval(t);t=null;$("p10-time").textContent="Time! Stop reading.";}},1000);});
$("p10-reset").addEventListener("click",function(){clearInterval(t);t=null;left=60;paintT();});
})();
