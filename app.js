const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho";

let foodRating = 5;
let serviceRating = 5;

const $ = (id) => document.getElementById(id);

function buildStars(containerId, onChange) {
  const container = $(containerId);
  container.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "star on";
    star.setAttribute("role", "button");
    star.setAttribute("aria-label", `${i} star rating`);

    star.addEventListener("click", () => {
      [...container.children].forEach((child, index) => {
        child.classList.toggle("on", index < i);
      });
      onChange(i);
    });

    container.appendChild(star);
  }
}

buildStars("foodStars", (value) => foodRating = value);
buildStars("serviceStars", (value) => serviceRating = value);

function getSettings() {
  return {
    endpoint: localStorage.getItem("reviewgen_api_endpoint") || "",
    model: localStorage.getItem("reviewgen_api_model") || "gpt-4o-mini",
    key: localStorage.getItem("reviewgen_api_key") || ""
  };
}

function updateAIStatus() {
  const { endpoint, key } = getSettings();
  $("aiStatus").textContent = endpoint && key
    ? "AI Mode: Real AI API enabled"
    : "AI Mode: Smart local generator";
}

function collectInputs() {
  return {
    language: $("language").value,
    eventType: $("eventType").value,
    tone: $("tone").value,
    length: $("length").value,
    customerName: $("customerName").value.trim(),
    likedMost: $("likedMost").value.trim(),
    specialMention: $("specialMention").value.trim(),
    foodRating,
    serviceRating
  };
}

function localReview(data) {
  const customer = data.customerName ? `${data.customerName}` : "our family";
  const highlight = data.likedMost || "the delicious food, smooth coordination and professional service";
  const special = data.specialMention ? ` A special mention for ${data.specialMention}, which everyone appreciated.` : "";

  const english = {
    Short: `We chose Shreevallabh Caterers, Kitchens & Hospitality LLP for our ${data.eventType}. The food quality was excellent (${data.foodRating}/5) and the service was outstanding (${data.serviceRating}/5). We especially liked ${highlight}.${special} Thank you for making ${customer}'s event memorable. Highly recommended!`,
    Medium: `Shreevallabh Caterers, Kitchens & Hospitality LLP did a wonderful job for our ${data.eventType}. The food was tasty, fresh and beautifully served, and the service team handled everything with great care. Food quality: ${data.foodRating}/5. Service quality: ${data.serviceRating}/5. We especially liked ${highlight}.${special} The team was punctual, polite and well organized. We would happily recommend them for family functions, weddings and special occasions.`,
    Detailed: `Our experience with Shreevallabh Caterers, Kitchens & Hospitality LLP for our ${data.eventType} was excellent from start to finish. The food quality was impressive (${data.foodRating}/5), the presentation was neat, and the taste was appreciated by our guests. The service quality was also excellent (${data.serviceRating}/5), with the team managing the event professionally and on time. We especially liked ${highlight}.${special} Thank you for making ${customer}'s celebration smooth, special and memorable. We strongly recommend Shreevallabh Caterers for any important occasion.`
  };

  let review = english[data.length] || english.Short;

  if (data.language === "Hindi") {
    review = `हमने अपने ${data.eventType} कार्यक्रम के लिए Shreevallabh Caterers, Kitchens & Hospitality LLP को चुना। भोजन की गुणवत्ता बहुत अच्छी थी (${data.foodRating}/5) और सेवा भी शानदार थी (${data.serviceRating}/5)। हमें खास तौर पर ${highlight} बहुत पसंद आया।${special} पूरी टीम समय पर, विनम्र और प्रोफेशनल थी। हमारे कार्यक्रम को यादगार बनाने के लिए धन्यवाद। Highly recommended!`;
  }

  if (data.language === "Gujarati") {
    review = `અમારા ${data.eventType} પ્રસંગ માટે અમે Shreevallabh Caterers, Kitchens & Hospitality LLP પસંદ કર્યા. ભોજન ખૂબ સ્વાદિષ્ટ હતું (${data.foodRating}/5) અને સેવા પણ ઉત્તમ હતી (${data.serviceRating}/5). અમને ખાસ કરીને ${highlight} બહુ ગમ્યું.${special} આખી ટીમ સમયસર, સંસ્કારી અને પ્રોફેશનલ હતી. પ્રસંગ યાદગાર બનાવવા બદલ આભાર. Highly recommended!`;
  }

  if (data.language === "Marathi") {
    review = `आमच्या ${data.eventType} कार्यक्रमासाठी आम्ही Shreevallabh Caterers, Kitchens & Hospitality LLP ची निवड केली. जेवणाची गुणवत्ता उत्कृष्ट होती (${data.foodRating}/5) आणि सेवा देखील खूप छान होती (${data.serviceRating}/5). आम्हाला विशेषतः ${highlight} खूप आवडले.${special} संपूर्ण टीम वेळेवर, विनम्र आणि प्रोफेशनल होती. आमचा कार्यक्रम संस्मरणीय केल्याबद्दल धन्यवाद. Highly recommended!`;
  }

  if (data.tone === "Royal Wedding Style") {
    review = review.replace("excellent", "royal and excellent").replace("wonderful", "grand and wonderful");
  }

  if (data.tone === "Highly Emotional") {
    review += " This experience will always remain close to our hearts.";
  }

  return review;
}

async function callRealAI(data, instruction = "") {
  const { endpoint, model, key } = getSettings();
  if (!endpoint || !key) return null;

  const prompt = `Create a customer review for Shreevallabh Caterers, Kitchens & Hospitality LLP.\nLanguage: ${data.language}\nEvent: ${data.eventType}\nTone: ${data.tone}\nLength: ${data.length}\nFood rating: ${data.foodRating}/5\nService rating: ${data.serviceRating}/5\nCustomer/family name: ${data.customerName || "not provided"}\nLiked most: ${data.likedMost || "not provided"}\nSpecial mention: ${data.specialMention || "not provided"}\nExtra instruction: ${instruction || "none"}\nRules: write only the review text, make it natural, positive, ready to post on Google, no hashtags.`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You write authentic, warm, high-quality customer reviews for a catering and hospitality business." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    })
  });

  if (!response.ok) throw new Error(`AI API error: ${response.status}`);
  const json = await response.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}

async function generateReview(instruction = "") {
  const button = instruction ? $("rewriteBtn") : $("generateBtn");
  button.disabled = true;
  button.textContent = "Generating...";

  const data = collectInputs();
  let review;

  try {
    review = await callRealAI(data, instruction);
  } catch (error) {
    console.warn(error);
    review = null;
    alert("Real AI API failed, so V6 used the smart local generator instead.");
  }

  if (!review) review = localReview(data);

  $("reviewOutput").value = review;
  $("formScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");

  button.disabled = false;
  button.textContent = instruction ? "✨ Rewrite with AI" : "✨ Generate AI Review";
}

function copyReview() {
  const output = $("reviewOutput");
  output.select();
  navigator.clipboard.writeText(output.value);
  alert("Review copied successfully!");
}

function shareWhatsApp() {
  const text = encodeURIComponent($("reviewOutput").value);
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function openSettings() {
  const settings = getSettings();
  $("apiEndpoint").value = settings.endpoint;
  $("apiModel").value = settings.model;
  $("apiKey").value = settings.key;
  $("settingsDialog").showModal();
}

function saveSettings(event) {
  event.preventDefault();
  localStorage.setItem("reviewgen_api_endpoint", $("apiEndpoint").value.trim());
  localStorage.setItem("reviewgen_api_model", $("apiModel").value.trim() || "gpt-4o-mini");
  localStorage.setItem("reviewgen_api_key", $("apiKey").value.trim());
  $("settingsDialog").close();
  updateAIStatus();
}

$("generateBtn").addEventListener("click", () => generateReview());
$("rewriteBtn").addEventListener("click", () => generateReview($("customInstruction").value.trim()));
$("copyBtn").addEventListener("click", copyReview);
$("googleBtn").addEventListener("click", () => window.open(GOOGLE_REVIEW_URL, "_blank"));
$("whatsappBtn").addEventListener("click", shareWhatsApp);
$("generateAnotherBtn").addEventListener("click", () => location.reload());
$("apiSettingsBtn").addEventListener("click", openSettings);
$("saveSettingsBtn").addEventListener("click", saveSettings);

updateAIStatus();
