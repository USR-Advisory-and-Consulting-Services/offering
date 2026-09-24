(function(){
document.documentElement.classList.add("js");
var menu=document.querySelector(".menu"),nav=document.querySelector("nav");
function setMenu(o){if(!nav||!menu)return;nav.classList.toggle("open",o);menu.setAttribute("aria-expanded",o);menu.textContent=o?"✕":"☰";}
if(menu&&nav){
menu.addEventListener("click",function(){setMenu(!nav.classList.contains("open"))});
nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){setMenu(false)})});
document.addEventListener("keydown",function(e){if(e.key==="Escape")setMenu(false)});
window.addEventListener("resize",function(){if(window.innerWidth>1120)setMenu(false)});
}
var y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear();
var els=document.querySelectorAll(".card,.step,.service-box,.fin-head");
if("IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.08});els.forEach(function(el){el.classList.add("reveal");io.observe(el)});}
})();
