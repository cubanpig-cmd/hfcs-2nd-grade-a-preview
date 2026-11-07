(function(){
/* Packet 11 math: three-digit subtraction with regrouping. Answers are checked, never shown. */
var P=[[851,659],[935,47],[522,173],[671,84],[417,338],[311,82],[561,384,"Sarah went 384 meters. Grace went 561 meters. How much farther did Grace go?"],
[800,65],[307,152],[205,127],[902,48],[300,128],[400,68],[505,119],[804,79],[200,148,"Nolan has 148 rocks. His goal is 200 rocks. How many more rocks does Nolan need?"],
[796,577],[832,125],[483,204],[860,702],[280,237],[691,343],[422,113],[553,126],[325,218,"There are 325 tickets. 218 tickets are sold. How many tickets are left?"],
[756,681],[469,146],[728,56],[635,584],[749,473],[657,62],[915,760,"The class has 760 cans. The goal is 915 cans. How many more cans are needed?"]];
var LABEL=["A1","A1","A1","A1","A1","A1","A1","A2","A2","A2","A2","A2","A2","A2","A2","A2","B1","B1","B1","B1","B1","B1","B1","B1","B1","B2","B2","B2","B2","B2","B2","B2"];
var cur=0,typed="",hint=0,state="idle",done=P.map(function(){return false;}),num=0;
function $(id){return document.getElementById(id);}
function d(n,k){return Math.floor(n/k)%10;}
function hintsFor(a,b,story){
 var o1=d(a,1),o2=d(b,1),t1=d(a,10),t2=d(b,10),h1=d(a,100),h2=d(b,100),pre=story?"Write it as a subtraction problem: the bigger number on top. ":"";
 var regO=o1<o2,tl=regO?t1-1:t1,regT=tl<t2;
 var s1=regO?(t1===0?"Ones: "+o1+" is smaller than "+o2+". There are 0 tens, so first trade 1 hundred for 10 tens. Then trade 1 ten for 10 ones. Now you have "+(o1+10)+" ones. Take away "+o2+".":"Ones: "+o1+" is smaller than "+o2+". Regroup: trade 1 ten for 10 ones. Now you have "+(o1+10)+" ones. Take away "+o2+"."):"Ones: "+o1+" take away "+o2+". No regrouping needed here.";
 var tn=regO&&t1===0?9:tl;
 var s2=(tn<t2)?"Tens: you now have "+tn+" tens. That is smaller than "+t2+", so trade 1 hundred for 10 tens. Now you have "+(tn+10)+" tens. Take away "+t2+".":"Tens: you now have "+tn+" tens. Take away "+t2+".";
 var hl=h1-((regO&&t1===0)||regT||(tn<t2)?1:0);
 var s3="Hundreds: you now have "+hl+" hundreds. Take away "+h2+". Check: your answer + "+b+" should make "+a+".";
 return[pre+s1,s2,s3];}
function noRegroup(a,b){var r=0,m=1;for(var i=0;i<3;i++){r+=Math.abs(d(a,m)-d(b,m))*m;m*=10;}return r;}
function render(){var p=P[cur],a=p[0],b=p[1],w=!!p[2];
 var n=0;$("p11-pills").innerHTML=P.map(function(q,i){var lab=q[2]?"Story":(++n);return '<button type="button" data-i="'+i+'" title="Page '+LABEL[i]+'" class="min-h-11 shrink-0 rounded-pill px-3 font-display text-base font-bold '+(i===cur?"bg-navy text-chalk":done[i]?"bg-grass text-paper":"bg-paper-deep text-navy")+'">'+lab+'</button>';}).join("");
 $("p11-page").textContent="Page "+LABEL[cur];
 var st=$("p11-story");st.hidden=!w;if(w)st.textContent="Word problem: "+p[2];
 var c=["hundreds","tens","ones"].map(function(h){return '<p class="bg-gold/30 py-1 text-sm font-extrabold uppercase">'+h+'</p>';}).join("");
 [a,b].forEach(function(x,r){var s=String(x);while(s.length<3)s=" "+s;s.split("").forEach(function(ch,k){
  c+='<p class="font-display border-t-2 '+(k?"border-l-2 ":"")+'border-navy py-3 text-4xl">'+(r===1&&k===0?'<span class="text-2xl">−</span> ':'')+(ch===" "?"&nbsp;":ch)+'</p>';});});
 $("p11-grid").innerHTML=c;
 var msg="";if(state==="ok")msg='<span class="text-grass font-extrabold">Yes! Great subtracting!</span>';
 else if(state==="flip")msg='<span class="text-apple-deep font-extrabold">Close! It looks like the smaller digit was taken from the bigger one. When the top digit is smaller, regroup first. Tap Hint.</span>';
 else if(state==="retry")msg='<span class="text-apple-deep font-extrabold">Try again. Start with the ones. Is the top digit smaller? Then regroup. Tap Hint if you need help.</span>';
 $("p11-answer").innerHTML='<span>'+a+' − '+b+' = </span><span class="min-w-16 rounded-lg border-2 border-navy bg-paper px-3 py-1">'+(typed||"?")+'</span> '+msg;
 var h=hintsFor(a,b,w),hs="";for(var i=0;i<hint;i++)hs+='<p class="mt-2 text-base font-bold text-navy-deep">'+(i===0?"Hint: ":"")+h[i]+'</p>';$("p11-hints").innerHTML=hs;
 $("p11-next").hidden=!(state==="ok"&&cur<P.length-1);
 $("p11-stars").textContent="Stars earned: "+done.filter(Boolean).length+" / "+P.length;}
function go(i){cur=i;typed="";hint=0;state="idle";render();}
function check(){var p=P[cur];if(typed!==""&&+typed===p[0]-p[1]){state="ok";done[cur]=true;}else if(typed!==""&&+typed===noRegroup(p[0],p[1]))state="flip";else state="retry";render();}
if(!$("p11-panel"))return;
$("p11-keys").innerHTML=["1","2","3","4","5","6","7","8","9","0","⌫"].map(function(k){return '<button type="button" data-k="'+k+'" class="bg-navy min-h-12 rounded-lg text-xl font-extrabold text-chalk" aria-label="'+(k==="⌫"?"Delete last digit":"Type "+k)+'">'+k+'</button>';}).join("");
$("p11-keys").addEventListener("click",function(e){var k=e.target.getAttribute("data-k");if(!k)return;state="idle";typed=k==="⌫"?typed.slice(0,-1):(typed+k).slice(0,4);render();});
$("p11-pills").addEventListener("click",function(e){var b=e.target.closest("[data-i]");if(b)go(+b.getAttribute("data-i"));});
$("p11-check").addEventListener("click",check);
$("p11-hint").addEventListener("click",function(){if(hint<3)hint++;render();});
$("p11-next").addEventListener("click",function(){go(cur+1);});
render();
$("p11-subtabs").addEventListener("click",function(e){var t=e.target.getAttribute("data-p11tab");if(!t)return;
 document.querySelectorAll("[data-p11tab]").forEach(function(b){var on=b===e.target;b.className="min-h-12 shrink-0 rounded-pill px-4 text-base font-extrabold "+(on?"bg-navy text-chalk":"bg-paper-deep text-navy-deep");});
 document.querySelectorAll("[data-p11pane]").forEach(function(p){p.hidden=p.getAttribute("data-p11pane")!==t;});});
/* Compound word builder */
var C=[["sun","set"],["hot","dog"],["kick","ball"],["up","hill"],["him","self"],["bath","tub"],["step","dad"],["sand","box"],["some","thing"],["back","drop"],["snap","shot"],["can","not"],["wind","mill"]];
var items=C.map(function(c,i){var o=C[(i+4)%C.length],q=C[(i+7)%C.length];return {prompt:"Put the two small words together: "+c[0]+" + "+c[1]+" = ?",choices:[c[0]+c[1],c[0]+o[1],q[0]+c[1]],answer:0,why:"“"+c[0]+"” and “"+c[1]+"” join to make one new word: "+c[0]+c[1]+"."};});
if(window.Quiz&&$("p11-quiz"))window.Quiz($("p11-quiz"),items,{title:"Build a compound word",id:"p11-compound",hintTopic:"the two small words inside"});
/* One-minute timer */
var t=null,left=60;
function paintT(){var el=$("p11-time");el.textContent=left===60?"1:00":"0:"+(left<10?"0":"")+left;}
$("p11-start").addEventListener("click",function(){if(t)return;left=60;paintT();t=setInterval(function(){left--;paintT();if(left<=0){clearInterval(t);t=null;$("p11-time").textContent="Time! Stop reading.";}},1000);});
$("p11-reset").addEventListener("click",function(){clearInterval(t);t=null;left=60;paintT();});
window.__P11=P;window.__P11hints=hintsFor;
})();
