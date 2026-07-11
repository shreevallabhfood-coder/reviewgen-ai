const tr={en:'What was your event?',hi:'आपका कार्यक्रम क्या था?',gu:'તમારો પ્રસંગ શું હતો?'};
function lang(l){document.getElementById('t1').innerText=tr[l];window.L=l;}
window.L='en';
function generateReview(){
let e=document.getElementById('event').value;
let f=document.getElementById('food').value;
let s=document.getElementById('service').value;
let c=document.getElementById('comments').value.trim();
let r='';
if(window.L==='en'){
r=`We chose Shreevallabh Caterers for our ${e}. The food quality was excellent (${f}/5) and the service was outstanding (${s}/5). ${c?c+' ':''}The team was professional, punctual and made our event memorable. Highly recommended!`;
}
if(window.L==='hi'){
r=`हमने अपने ${e} के लिए श्रीवल्लभ कैटरर्स को चुना। भोजन ${f}/5 और सेवा ${s}/5 रही। ${c?c+' ':''}पूरी टीम ने शानदार सेवा दी। हम इन्हें अवश्य सुझाएंगे।`;
}
if(window.L==='gu'){
r=`અમારા ${e} માટે અમે શ્રીવલ્લભ કેટરર્સ પસંદ કર્યા. ભોજન ${f}/5 અને સેવા ${s}/5 રહી. ${c?c+' ':''}ટીમે ખૂબ સરસ સેવા આપી. અમે જરૂર ભલામણ કરીશું.`;
}
document.getElementById('review').value=r;
document.getElementById('out').style.display='block';
}
function copyReview(){navigator.clipboard.writeText(document.getElementById('review').value).then(()=>alert('Copied!'));}