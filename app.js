const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho&source=g.page.m.ia._&utm_source=gbp&laa=nmx-review-solicitation-ia2";
let foodRating = 5;
let serviceRating = 5;
let lastData = null;

const $ = id => document.getElementById(id);
const pick = a => a[Math.floor(Math.random() * a.length)];

function clean(v) {
  return (v || "").trim().replace(/\s+/g, " ");
}

function ensureCustomEventInput() {
  let customBox = $("customEventType");

  if (!customBox) {
    customBox = document.createElement("input");
    customBox.type = "text";
    customBox.id = "customEventType";
    customBox.name = "customEventType";
    customBox.placeholder = "Enter Event Type";
    customBox.style.display = "none";
    customBox.style.marginTop = "8px";
    customBox.autocomplete = "off";

    const eventType = $("eventType");
    if (eventType && eventType.parentNode) {
      eventType.parentNode.insertBefore(customBox, eventType.nextSibling);
    }
  }

  return customBox;
}

function setupOtherEventType() {
  const eventType = $("eventType");
  if (!eventType) return;

  const customBox = ensureCustomEventInput();

  function toggleCustomBox() {
    if (eventType.value === "Other") {
      customBox.style.display = "block";
      customBox.required = true;
      customBox.focus();
    } else {
      customBox.style.display = "none";
      customBox.required = false;
      customBox.value = "";
    }
  }

  eventType.addEventListener("change", toggleCustomBox);
  toggleCustomBox();
}

function applyRequestedUIChanges() {
  // Remove the display heading/description shown on the page.
  const headings = Array.from(document.querySelectorAll("h1, h2, .hero h1, .heading h1"));
  headings.forEach(h => {
    const headingText = (h.textContent || "").trim().toLowerCase();
    if (headingText === "generate natural customer reviews") {
      const parent = h.closest(".hero, .header, .heading, section, div") || h.parentElement;
      const next = h.nextElementSibling;
      if (next && /creates natural, human-style google review drafts/i.test(next.textContent || "")) {
        next.remove();
      }
      h.remove();
      if (parent && parent.children.length === 0 && parent.parentElement) {
        parent.remove();
      }
    }
  });

  // Event Type options. Includes Other option for custom text entry.
  const eventType = $("eventType");
  if (!eventType) return;

  if (eventType.tagName === "SELECT") {
    const options = [
      { value: "", label: "" },
      { value: "Engagement", label: "Engagement" },
      { value: "Birthday", label: "Birthday" },
      { value: "Corporate Event", label: "Corporate Event" },
      { value: "Housewarming", label: "Housewarming" },
      { value: "Party", label: "Party" },
      { value: "Other", label: "Other (Enter Custom Text)" }
    ];

    eventType.innerHTML = "";
    options.forEach(o => {
      const option = document.createElement("option");
      option.value = o.value;
      option.textContent = o.label;
      eventType.appendChild(option);
    });
  } else {
    eventType.placeholder = "Enter Event Type";
  }

  setupOtherEventType();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyRequestedUIChanges);
} else {
  applyRequestedUIChanges();
}

function buildStars(id, cb) {
  const c = $(id);
  if (!c) return;

  c.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement("span");
    s.textContent = "★";
    s.className = "star on";
    s.title = i + " star";
    s.onclick = () => {
      [...c.children].forEach((x, n) => x.classList.toggle("on", n < i));
      cb(i);
    };
    c.appendChild(s);
  }
}

buildStars("foodStars", v => foodRating = v);
buildStars("serviceStars", v => serviceRating = v);

function settings() {
  return {
    endpoint: localStorage.getItem("reviewgen_api_endpoint") || "",
    model: localStorage.getItem("reviewgen_api_model") || "gpt-4o-mini",
    key: localStorage.getItem("reviewgen_api_key") || ""
  };
}

function updateAIStatus() {
  const s = settings();
  const aiStatus = $("aiStatus");
  if (aiStatus) {
    aiStatus.textContent = s.endpoint && s.key ? "AI Mode: Real AI API enabled" : "AI Mode: Human-style smart generator";
  }
}

function inputs() {
  const eventTypeElement = $("eventType");
  const selectedEventType = clean(eventTypeElement ? eventTypeElement.value : "");
  const customEventType = clean($("customEventType")?.value);
  const finalEventType = selectedEventType === "Other" ? customEventType : selectedEventType;

  return {
    language: $("language")?.value || "",
    eventType: finalEventType,
    tone: $("tone")?.value || "",
    length: $("length")?.value || "",
    likedMost: clean($("likedMost")?.value),
    specialMention: clean($("specialMention")?.value),
    foodRating,
    serviceRating
  };
}

function eventLine(eventType) {
  const typedEvent = clean(eventType);
  if (!typedEvent) return "";

  const event = typedEvent.toLowerCase();

  if (event.includes("engagement")) {
    return pick([
      "We booked Shreevallabh Caterers for an engagement function.",
      "For our engagement ceremony, we selected Shreevallabh Caterers."
    ]);
  }

  if (event.includes("birthday")) {
    return pick([
      "We used Shreevallabh Caterers for a birthday celebration.",
      "For a birthday function at home, we booked Shreevallabh Caterers."
    ]);
  }

  if (event.includes("corporate") || event.includes("office")) {
    return pick([
      "We booked Shreevallabh Caterers for a corporate event.",
      "For our office event, Shreevallabh Caterers managed the food arrangements."
    ]);
  }

  if (event.includes("house")) {
    return pick([
      "We booked Shreevallabh Caterers for a housewarming function.",
      "For our housewarming, Shreevallabh Caterers handled the catering nicely."
    ]);
  }

  if (event.includes("party")) {
    return pick([
      "We booked Shreevallabh Caterers for a party.",
      "For our party, Shreevallabh Caterers handled the catering arrangements well.",
      "We used Shreevallabh Caterers for a party and had a good overall experience."
    ]);
  }

  return `We booked Shreevallabh Caterers for our ${typedEvent}.`;
}

function foodSentence(r) {
  if (r >= 5) return pick([
    "The food was fresh, tasty, and many guests appreciated the taste.",
    "Food quality was excellent, and the menu was enjoyed by almost everyone.",
    "The taste, freshness, and presentation of the food were really good."
  ]);

  if (r === 4) return pick([
    "The food was good overall and most guests enjoyed it.",
    "Food taste was nice, with only small scope for improvement.",
    "Overall food quality was quite good and satisfying."
  ]);

  if (r === 3) return pick([
    "The food was decent overall, though a few items could have been better.",
    "Food quality was satisfactory, with some dishes better than others."
  ]);

  return pick([
    "The food was manageable, but there is definitely room for improvement.",
    "Some food items were okay, while a few things could be improved next time."
  ]);
}

function serviceSentence(r) {
  if (r >= 5) return pick([
    "The service staff was polite, punctual, and managed everything smoothly.",
    "Service was well coordinated, and the team was helpful throughout the event.",
    "The team handled the setup and serving very professionally."
  ]);

  if (r === 4) return pick([
    "The service was good and the staff was cooperative.",
    "The team managed the arrangements well overall.",
    "Service was smooth, with only minor areas that can be improved."
  ]);

  if (r === 3) return pick([
    "Service was satisfactory, though coordination could be a little better.",
    "The staff was cooperative, but the overall service can be improved further."
  ]);

  return pick([
    "Service could have been better in a few areas, but the team did support the event.",
    "There is scope to improve service coordination for future events."
  ]);
}

function highlightSentence(d) {
  const parts = [];

  if (d.likedMost) parts.push(pick([
    `We especially liked ${d.likedMost}.`,
    `A good part of the experience was ${d.likedMost}.`,
    `What stood out for us was ${d.likedMost}.`
  ]));

  if (d.specialMention) parts.push(pick([
    `${d.specialMention} was also appreciated by guests.`,
    `The ${d.specialMention} was a nice highlight.`,
    `A special mention for ${d.specialMention}.`
  ]));

  return parts.join(" ");
}

function closingSentence(d) {
  const good = d.foodRating >= 4 && d.serviceRating >= 4;

  if (good) return pick([
    "Overall, it felt like a smooth and pleasant catering experience.",
    "Overall, we were happy with the arrangements and would recommend them for similar functions.",
    "Thank you to the team for making the function easier to manage and more memorable."
  ]);

  return pick([
    "Overall, the experience was decent, and with a few improvements it can become even better.",
    "We appreciate the effort from the team and hope the small improvement areas are taken positively.",
    "Overall, it was a satisfactory experience with some good parts and some scope for improvement."
  ]);
}

function englishReview(d) {
  let pieces = [
    eventLine(d.eventType),
    foodSentence(d.foodRating),
    serviceSentence(d.serviceRating),
    highlightSentence(d),
    closingSentence(d)
  ].filter(Boolean);

  let review = pieces.join(" ");

  if (d.tone === "Short & Simple" || d.length === "Short") {
    review = pieces.slice(0, 3).join(" ") + " " + closingSentence(d);
  }

  if (d.tone === "Highly Emotional" && d.foodRating >= 4 && d.serviceRating >= 4) {
    review += " It genuinely helped us enjoy the occasion without worrying too much about the arrangements.";
  }

  if (d.tone === "Royal Wedding Style" && d.foodRating >= 4 && d.serviceRating >= 4) {
    review = review.replace("good experience", "premium experience").replace("nice highlight", "premium highlight");
  }

  if (d.length === "Detailed") {
    review += " The review is based on our actual experience with the food, service, and overall event support.";
  }

  return review.replace(/\s+/g, " ").trim();
}

function localReview(d) {
  if (d.language === "English") return englishReview(d);

  const typedEvent = d.eventType ? d.eventType : "event";
  const liked = d.likedMost ? ` ${d.likedMost} खास आवडले.` : "";
  const special = d.specialMention ? ` ${d.specialMention} विशेष उल्लेखनीय होते.` : "";
  const good = d.foodRating >= 4 && d.serviceRating >= 4;

  if (d.language === "Hindi") {
    return `हमने अपने ${typedEvent} के लिए Shreevallabh Caterers को चुना। खाना अच्छा था और मेहमानों ने भी स्वाद की तारीफ की। सेवा टीम विनम्र और सहयोगी रही।${d.likedMost ? ` हमें खास तौर पर ${d.likedMost} पसंद आया।` : ""}${d.specialMention ? ` ${d.specialMention} भी अच्छा रहा।` : ""} ${good ? "कुल मिलाकर अनुभव बहुत अच्छा रहा और हम इन्हें कार्यक्रमों के लिए recommend करेंगे।" : "कुल मिलाकर अनुभव ठीक रहा, कुछ जगह सुधार की गुंजाइश है।"}`;
  }

  if (d.language === "Gujarati") {
    return `અમારા ${typedEvent} માટે અમે Shreevallabh Caterers પસંદ કર્યા. ભોજન સારું હતું અને મહેમાનોને સ્વાદ ગમ્યો. સર્વિસ ટીમ સહયોગી અને સમયસર હતી.${d.likedMost ? ` અમને ખાસ કરીને ${d.likedMost} ગમ્યું.` : ""}${d.specialMention ? ` ${d.specialMention} પણ સારું રહ્યું.` : ""} ${good ? "કુલ મળીને અનુભવ ખૂબ સારો રહ્યો અને અમે જરૂરથી recommend કરીશું." : "કુલ અનુભવ ઠીક રહ્યો, થોડા સુધારા માટે જગ્યા છે."}`;
  }

  if (d.language === "Marathi") {
    return `आमच्या ${typedEvent} साठी आम्ही Shreevallabh Caterers निवडले. जेवण चांगले होते आणि पाहुण्यांनीही चवीचे कौतुक केले. सर्विस टीम सहकार्य करणारी आणि वेळेवर होती.${liked}${special} ${good ? "एकूण अनुभव खूप चांगला राहिला आणि आम्ही नक्की recommend करू." : "एकूण अनुभव ठीक होता, काही सुधारणा केल्या तर अजून चांगले होईल."}`;
  }

  return englishReview(d);
}

async function callAI(d, instruction = "") {
  const s = settings();
  if (!s.endpoint || !s.key) return null;

  const eventInstruction = d.eventType ? `Event:${d.eventType}.` : "Event: not specified by customer.";
  const prompt = `Write one natural first-person Google review for Shreevallabh Caterers, Kitchens & Hospitality LLP. It must sound like a real customer wrote it, not like a third person or AI. Do not say "customer feedback". Do not mention "selected ratings". ${eventInstruction} Language:${d.language}. Tone:${d.tone}. Length:${d.length}. Food rating:${d.foodRating}/5. Service rating:${d.serviceRating}/5. Customer liked:${d.likedMost || "not specified"}. Special mention:${d.specialMention || "not specified"}. Extra instruction:${instruction || "none"}. If ratings are below 4, write balanced polite feedback, not fake perfect praise. Output only the review text.`;

  const res = await fetch(s.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${s.key}`
    },
    body: JSON.stringify({
      model: s.model,
      messages: [
        { role: "system", content: "You write authentic first-person customer reviews." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      presence_penalty: 0.4,
      frequency_penalty: 0.4
    })
  });

  if (!res.ok) throw new Error("AI API error " + res.status);
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() || null;
}

async function generate(instruction = "", useLast = false) {
  const d = useLast && lastData ? lastData : inputs();
  lastData = d;

  let r = null;
  try {
    r = await callAI(d, instruction);
  } catch (e) {
    console.warn(e);
  }

  if (!r) r = localReview(d);

  $("reviewOutput").value = r;
  $("formScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");
}

function copyReview() {
  const o = $("reviewOutput");
  o.select();
  navigator.clipboard.writeText(o.value);
  alert("Review copied successfully!");
}

function openSettings() {
  const s = settings();
  $("apiEndpoint").value = s.endpoint;
  $("apiModel").value = s.model;
  $("apiKey").value = s.key;
  $("settingsDialog").showModal();
}

function saveSettings(e) {
  e.preventDefault();
  localStorage.setItem("reviewgen_api_endpoint", $("apiEndpoint").value.trim());
  localStorage.setItem("reviewgen_api_model", $("apiModel").value.trim() || "gpt-4o-mini");
  localStorage.setItem("reviewgen_api_key", $("apiKey").value.trim());
  $("settingsDialog").close();
  updateAIStatus();
}

if ($("generateBtn")) $("generateBtn").onclick = () => generate();
if ($("freshBtn")) $("freshBtn").onclick = () => generate("", true);
if ($("rewriteBtn")) $("rewriteBtn").onclick = () => generate($("customInstruction").value.trim(), true);
if ($("copyBtn")) $("copyBtn").onclick = copyReview;
if ($("googleBtn")) $("googleBtn").onclick = () => window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
if ($("againBtn")) $("againBtn").onclick = () => {
  $("resultScreen").classList.add("hidden");
  $("formScreen").classList.remove("hidden");
};
if ($("apiSettingsBtn")) $("apiSettingsBtn").onclick = openSettings;
if ($("saveSettingsBtn")) $("saveSettingsBtn").onclick = saveSettings;

updateAIStatus();
