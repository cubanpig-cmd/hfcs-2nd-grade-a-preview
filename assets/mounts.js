window.MOUNTS={};
(function(){var M=window.M||{};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e;}
Object.keys(M).forEach(function(k){var spec=M[k];window.MOUNTS[k]=function(node){
 var kind=spec[0],data=spec[1],opt=spec[2]||{};
 if(kind==="MustKnow")return MustKnow(node,data);
 window[kind](node,data,opt);};});
function MustKnow(node,d){
 var defs=[["cross","Sign of the Cross",function(m,done){Order(m,d.cross,{intro:"Tap the places in order, the way your right hand moves.",onDone:done});}],
 ["act","Act of Contrition",function(m,done){Order(m,d.act,{intro:"Put the Act of Contrition in order. Say each line out loud.",onDone:done});}],
 ["two","Two great commandments",function(m,done){Order(m,d.two,{intro:"Jesus gave us two great commandments. Tap them in order.",onDone:done});}],
 ["ten","Ten Commandments",function(m,done){Quiz(m,d.ten,{title:"Ten Commandments",id:"mk-ten"});done();}],
 ["sin","Sin or accident",function(m,done){Quiz(m,d.sin,{title:"Sin or accident?",id:"mk-sin"});done();}],
 ["six","Six parts",function(m,done){Order(m,d.six,{intro:"Put the parts of confession in order.",onDone:done});}],
 ["words","Words I say",function(m,done){Order(m,d.words,{intro:"What do I say and do in confession? Tap in order.",onDone:done});}],
 ["five","Five facts",function(m,done){Quiz(m,d.five,{title:"Five facts",id:"mk-five"});done();}]];
 var top=el("p","text-lg font-extrabold text-navy-deep");var grid=el("div","mt-2 grid gap-2 sm:grid-cols-2");var stage=el("div","mt-4");
 node.appendChild(top);node.appendChild(grid);node.appendChild(stage);
 function learned(){return defs.filter(function(x){return localStorage.getItem("mk:"+x[0])==="1"}).length;}
 function paint(){top.textContent=learned()+" of 8 learned";grid.innerHTML="";defs.forEach(function(x,i){var b=el("button","flex min-h-12 w-full items-center gap-2 rounded-xl border-3 border-navy bg-paper px-4 text-left text-lg font-extrabold text-navy-deep",(localStorage.getItem("mk:"+x[0])==="1"?"✅ ":"⬜ ")+(i+1)+". "+x[1]);b.type="button";b.onclick=function(){stage.innerHTML="";stage.appendChild(el("h4","font-display text-xl text-navy-deep",x[1]));var m=el("div");stage.appendChild(m);x[2](m,function(){localStorage.setItem("mk:"+x[0],"1");paint();});stage.scrollIntoView({behavior:"smooth"});};grid.appendChild(b);});}
 paint();}
})();
