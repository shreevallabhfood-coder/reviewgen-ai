const GOOGLE_REVIEW_URL="https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho&source=g.page.m.ia._&utm_source=gbp&laa=nmx-review-solicitation-ia2";
let foodRating=5,serviceRating=5,lastData=null;
const $=id=>document.getElementById(id);
const pick=a=>a[Math.floor(Math.random()*a.length)];

function buildStars(id,cb){
  const c=$(id); c.innerHTML="";
  for(let i=1;i<=5;i++){
    const s=document.createElement("span");
    s.textContent="★"; s.className="star on"; s.title=i+" star";
    s.onclick=()=>{[...c.children].forEach((x,n)=>x.classList.toggle("on",n<i)); cb(i)};
    c.appendChild(s);
  }
}
buildStars("foodStars",v=>foodRating=v);
buildStars("serviceStars",v=>serviceRating=v);

function settings(){return{endpoint:localStorage.getItem("reviewgen_api_endpoint")||"",model:localStorage.getItem("reviewgen_api_model")||"gpt-4o-mini",key:localStorage.getItem("reviewgen_api_key")||""}}
function updateAIStatus(){const s=settings();$("aiStatus").textContent=s.endpoint&&s.key?"AI Mode: Real AI API enabled":"AI Mode: Human-style smart generator"}
function clean(v){return (v||"").trim().replace(/\s+/g," ")}
function inputs(){return{language:$("language").value,eventType:$("eventType").value,tone:$("tone").value,length:$("length").value,likedMost:clean($("likedMost").value),specialMention:clean($("specialMention").value),foodRating,serviceRating}}

function eventLine(eventType){
  const event = eventType.toLowerCase();
  if(event.includes("wedding")) return pick(["We booked Shreevallabh Caterers for a wedding function.","We recently had Shreevallabh Caterers for a wedding in our family.","For our wedding function, we chose Shreevallabh Caterers and had a very good experience."]);
  if(event.includes("engagement")) return pick(["We booked Shreevallabh Caterers for an engagement function.","For our engagement ceremony, we selected Shreevallabh Caterers."]);
  if(event.includes("birthday")) return pick(["We used Shreevallabh Caterers for a birthday celebration.","For a birthday function at home, we booked Shreevallabh Caterers."]);
  if(event.includes("corporate")) return pick(["We booked Shreevallabh Caterers for a corporate event.","For our office event, Shreevallabh Caterers managed the food arrangements."]);
  if(event.includes("house")) return pick(["We booked Shreevallabh Caterers for a housewarming function.","For our housewarming, Shreevallabh Caterers handled the catering nicely."]);
  return pick([`We booked Shreevallabh Caterers for our ${eventType}.`,`Recently used Shreevallabh Caterers for a family function.`,`We had Shreevallabh Caterers for a special occasion.`]);
}
function foodSentence(r){
  if(r>=5) return pick(["The food was fresh, tasty, and many guests appreciated the taste.","Food quality was excellent, and the menu was enjoyed by almost everyone.","The taste, freshness, and presentation of the food were really good."]);
  if(r===4) return pick(["The food was good overall and most guests enjoyed it.","Food taste was nice, with only small scope for improvement.","Overall food quality was quite good and satisfying."]);
  if(r===3) return pick(["The food was decent overall, though a few items could have been better.","Food quality was satisfactory, with some dishes better than others."]);
  return pick(["The food was manageable, but there is definitely room for improvement.","Some food items were okay, while a few things could be improved next time."]);
}
function serviceSentence(r){
  if(r>=5) return pick(["The service staff was polite, punctual, and managed everything smoothly.","Service was well coordinated, and the team was helpful throughout the event.","The team handled the setup and serving very professionally."]);
  if(r===4) return pick(["The service was good and the staff was cooperative.","The team managed the arrangements well overall.","Service was smooth, with only minor areas that can be improved."]);
  if(r===3) return pick(["Service was satisfactory, though coordination could be a little better.","The staff was cooperative, but the overall service can be improved further."]);
  return pick(["Service could have been better in a few areas, but the team did support the event.","There is scope to improve service coordination for future events."]);
}
function highlightSentence(d){
  const parts=[];
  if(d.likedMost) parts.push(pick([`We especially liked ${d.likedMost}.`,`A good part of the experience was ${d.likedMost}.`,`What stood out for us was ${d.likedMost}.`]));
  if(d.specialMention) parts.push(pick([`${d.specialMention} was also appreciated by guests.`,`The ${d.specialMention} was a nice highlight.`,`A special mention for ${d.specialMention}.`]));
  return parts.join(" ");
}
function closingSentence(d){
  const good=d.foodRating>=4&&d.serviceRating>=4;
  if(good) return pick(["Overall, it felt like a smooth and pleasant catering experience.","Overall, we were happy with the arrangements and would recommend them for similar functions.","Thank you to the team for making the function easier to manage and more memorable."]);
  return pick(["Overall, the experience was decent, and with a few improvements it can become even better.","We appreciate the effort from the team and hope the small improvement areas are taken positively.","Overall, it was a satisfactory experience with some good parts and some scope for improvement."]);
}
function englishReview(d){
  let pieces=[eventLine(d.eventType), foodSentence(d.foodRating), serviceSentence(d.serviceRating), highlightSentence(d), closingSentence(d)].filter(Boolean);
  let review=pieces.join(" ");
  if(d.tone==="Short & Simple"||d.length==="Short") review=pieces.slice(0,3).join(" ")+" "+closingSentence(d);
  if(d.tone==="Highly Emotional" && d.foodRating>=4 && d.serviceRating>=4) review += " It genuinely helped us enjoy the occasion without worrying too much about the arrangements.";
  if(d.tone==="Royal Wedding Style" && d.foodRating>=4 && d.serviceRating>=4) review = review.replace("good experience","premium experience").replace("nice highlight","premium highlight");
  if(d.length==="Detailed") review += " The review is based on our actual experience with the food, service, and overall event support.";
  return review.replace(/\s+/g," ").trim();
}
function localReview(d){
  if(d.language==="English") return englishReview(d);
  const liked=d.likedMost?` ${d.likedMost} खास आवडले.`:"";
  const special=d.specialMention?` ${d.specialMention} विशेष उल्लेखनीय होते.`:"";
  const good=d.foodRating>=4&&d.serviceRating>=4;
  if(d.language==="Hindi") return `हमने अपने ${d.eventType} के लिए Shreevallabh Caterers को चुना। खाना अच्छा था और मेहमानों ने भी स्वाद की तारीफ की। सेवा टीम विनम्र और सहयोगी रही।${d.likedMost?` हमें खास तौर पर ${d.likedMost} पसंद आया।`:""}${d.specialMention?` ${d.specialMention} भी अच्छा रहा।`:""} ${good?"कुल मिलाकर अनुभव बहुत अच्छा रहा और हम इन्हें कार्यक्रमों के लिए recommend करेंगे।":"कुल मिलाकर अनुभव ठीक रहा, कुछ जगह सुधार की गुंजाइश है।"}`;
  if(d.language==="Gujarati") return `અમારા ${d.eventType} માટે અમે Shreevallabh Caterers પસંદ કર્યા. ભોજન સારું હતું અને મહેમાનોને સ્વાદ ગમ્યો. સર્વિસ ટીમ સહયોગી અને સમયસર હતી.${d.likedMost?` અમને ખાસ કરીને ${d.likedMost} ગમ્યું.`:""}${d.specialMention?` ${d.specialMention} પણ સારું રહ્યું.`:""} ${good?"કુલ મળીને અનુભવ ખૂબ સારો રહ્યો અને અમે જરૂરથી recommend કરીશું.":"કુલ અનુભવ ઠીક રહ્યો, થોડા સુધારા માટે જગ્યા છે."}`;
  if(d.language==="Marathi") return `आमच्या ${d.eventType} साठी आम्ही Shreevallabh Caterers निवडले. जेवण चांगले होते आणि पाहुण्यांनीही चवीचे कौतुक केले. सर्विस टीम सहकार्य करणारी आणि वेळेवर होती.${liked}${special} ${good?"एकूण अनुभव खूप चांगला राहिला आणि आम्ही नक्की recommend करू.":"एकूण अनुभव ठीक होता, काही सुधारणा केल्या तर अजून चांगले होईल."}`;
  return englishReview(d);
}
async function callAI(d,instruction=""){
  const s=settings(); if(!s.endpoint||!s.key) return null;
  const prompt=`Write one natural first-person Google review for Shreevallabh Caterers, Kitchens & Hospitality LLP. It must sound like a real customer wrote it, not like a third person or AI. Do not say "customer feedback". Do not mention "selected ratings". Event:${d.eventType}. Language:${d.language}. Tone:${d.tone}. Length:${d.length}. Food rating:${d.foodRating}/5. Service rating:${d.serviceRating}/5. Customer liked:${d.likedMost||"not specified"}. Special mention:${d.specialMention||"not specified"}. Extra instruction:${instruction||"none"}. If ratings are below 4, write balanced polite feedback, not fake perfect praise. Output only the review text.`;
  const res=await fetch(s.endpoint,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${s.key}`},body:JSON.stringify({model:s.model,messages:[{role:"system",content:"You write authentic first-person customer reviews."},{role:"user",content:prompt}],temperature:.9,presence_penalty:.4,frequency_penalty:.4})});
  if(!res.ok) throw new Error("AI API error "+res.status);
  const j=await res.json(); return j.choices?.[0]?.message?.content?.trim()||null;
}
async function generate(instruction="",useLast=false){
  const d=useLast&&lastData?lastData:inputs(); lastData=d;
  let r=null; try{r=await callAI(d,instruction)}catch(e){console.warn(e)}
  if(!r) r=localReview(d);
  $("reviewOutput").value=r;
  $("formScreen").classList.add("hidden"); $("resultScreen").classList.remove("hidden");
}
function copyReview(){const o=$("reviewOutput");o.select();navigator.clipboard.writeText(o.value);alert("Review copied successfully!")}
function openSettings(){const s=settings();$("apiEndpoint").value=s.endpoint;$("apiModel").value=s.model;$("apiKey").value=s.key;$("settingsDialog").showModal()}
function saveSettings(e){e.preventDefault();localStorage.setItem("reviewgen_api_endpoint",$("apiEndpoint").value.trim());localStorage.setItem("reviewgen_api_model",$("apiModel").value.trim()||"gpt-4o-mini");localStorage.setItem("reviewgen_api_key",$("apiKey").value.trim());$("settingsDialog").close();updateAIStatus()}
$("generateBtn").onclick=()=>generate();
$("freshBtn").onclick=()=>generate("",true);
$("rewriteBtn").onclick=()=>generate($("customInstruction").value.trim(),true);
$("copyBtn").onclick=copyReview;
$("googleBtn").onclick=()=>window.open(GOOGLE_REVIEW_URL,"_blank","noopener,noreferrer");
$("againBtn").onclick=()=>{$("resultScreen").classList.add("hidden");$("formScreen").classList.remove("hidden")};
$("apiSettingsBtn").onclick=openSettings;
$("saveSettingsBtn").onclick=saveSettings;
updateAIStatus();
