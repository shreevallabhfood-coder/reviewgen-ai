let food=5,service=5;
function build(id,valSetter){
const el=document.getElementById(id);
for(let i=1;i<=5;i++){
 let s=document.createElement('span');s.innerHTML='★';
 if(i<=5)s.classList.add('on');
 s.onclick=()=>{[...el.children].forEach((c,idx)=>c.classList.toggle('on',idx<i));valSetter(i);}
 el.appendChild(s);
}}
build('foodStars',v=>food=v);build('serviceStars',v=>service=v);
function generate(){
const e=event.value,c=comments.value.trim();
review.value=`We recently chose Shreevallabh Caterers for our ${e}. The food was delicious (${food}/5) and the service was exceptional (${service}/5). ${c?c+' ':''}The entire team was professional, punctual, and made our celebration memorable. We highly recommend Shreevallabh Caterers for any special occasion.`;
screen1.style.display='none';screen2.style.display='block';
}
function copyReview(){navigator.clipboard.writeText(review.value);alert('Copied to clipboard');}
function back(){screen2.style.display='none';screen1.style.display='block';}
