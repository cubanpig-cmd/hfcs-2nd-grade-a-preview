(function(){
var P=[[248,653],[665,142],[314,352],[432,478],[602,258],[732,156],[324,259],[487,326],[232,527],[587,323],[659,265],[533,222],[494,334],[657,422],[475,243],[236,234],[406,426],[253,574],[625,265],[459,347],[648,260],[326,362]];
var cur=0,typed="",hint=0,done=P.map(function(){return false;});
function $(id){return document.getElementById(id);}
function hintsFor(a,b){var o=a%10+b%10,t=Math.floor(a/10)%10+Math.floor(b/10)%10+(o>9?1:0);
return["Start with the ones: "+(a%10)+" + "+(b%10)+" = ?"+(o>9?" That is 10 or more, so regroup 1 ten.":""),
"Fill in the blank: ones make "+(o%10)+(o>9?" (carry 1)":"")+". Now add the tens"+(o>9?" plus the 1":"")+".",
"The answer is "+(a+b)+". Ones "+(o%10)+", tens "+(t%10)+", hundreds "+Math.floor((a+b)/100)+". You can do this!"];}
function render(){var p=P[cur],a=p[0],b=p[1];
$("p9-pills").innerHTML=P.map(function(_,i){return '<button type="button" data-i="'+i+'" class="min-h-11 shrink-0 rounded-pill px-3 font-display text-base font-bold '+(i===cur?"bg-navy text-chalk":done[i]?"bg-grass text-paper":"bg-paper-deep text-navy")+'">'+(i+1)+'</button>';}).join("");
var c=["hundreds","tens","ones"].map(function(h){return '<p class="bg-gold/30 py-1 text-sm font-extrabold uppercase">'+h+'</p>';}).join("");
[a,b].forEach(function(n,r){var d=String(n).split("");d.forEach(function(x,k){c+='<p class="font-display border-t-2 '+(k?"border-l-2 ":"")+'border-navy py-3 text-4xl">'+(r===1&&k===0?'<span class="text-2xl">+</span> ':'')+x+'</p>';});});
$("p9-grid").innerHTML=c;
var msg="";if(state==="ok")msg='<span class="text-grass font-extrabold">Yes! '+(a+b)+'. Great adding!</span>';else if(state==="retry")msg='<span class="text-apple-deep font-extrabold">Try again. Add the ones first, then tens, then hundreds.</span>';
$("p9-answer").innerHTML='<span>'+a+' + '+b+' = </span><span class="min-w-16 rounded-lg border-2 border-navy bg-paper px-3 py-1">'+(typed||"?")+'</span> '+msg;
var h=hintsFor(a,b),hs="";for(var i=0;i<hint;i++)hs+='<p class="mt-2 text-base font-bold text-navy-deep">'+(i===0?"Hint: ":"")+h[i]+'</p>';$("p9-hints").innerHTML=hs;
$("p9-next").hidden=!(state==="ok"&&cur<P.length-1);
$("p9-stars").textContent="Stars earned: "+done.filter(Boolean).length+" / "+P.length;}
var state="idle";
function go(i){cur=i;typed="";hint=0;state="idle";render();}
$("p9-keys").innerHTML=["1","2","3","4","5","6","7","8","9","0","⌫"].map(function(k){return '<button type="button" data-k="'+k+'" class="bg-navy min-h-12 rounded-lg text-xl font-extrabold text-chalk" aria-label="'+(k==="⌫"?"Delete last digit":"Type "+k)+'">'+k+'</button>';}).join("");
$("p9-keys").addEventListener("click",function(e){var k=e.target.getAttribute("data-k");if(!k)return;state="idle";typed=k==="⌫"?typed.slice(0,-1):(typed+k).slice(0,4);render();});
$("p9-pills").addEventListener("click",function(e){var i=e.target.getAttribute("data-i");if(i!==null)go(+i);});
$("p9-check").addEventListener("click",function(){var p=P[cur];if(typed!==""&&+typed===p[0]+p[1]){state="ok";done[cur]=true;}else state="retry";render();});
$("p9-hint").addEventListener("click",function(){if(hint<3)hint++;render();});
$("p9-next").addEventListener("click",function(){go(cur+1);});
render();
document.getElementById("p9-subtabs").addEventListener("click",function(e){var t=e.target.getAttribute("data-p9tab");if(!t)return;
document.querySelectorAll("[data-p9tab]").forEach(function(b){var on=b===e.target;b.className="min-h-12 shrink-0 rounded-pill px-4 text-base font-extrabold "+(on?"bg-navy text-chalk":"bg-paper-deep text-navy-deep");});
document.querySelectorAll("[data-p9pane]").forEach(function(p){p.hidden=p.getAttribute("data-p9pane")!==t;});});
})();