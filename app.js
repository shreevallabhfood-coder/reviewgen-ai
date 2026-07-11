let foodRating = 5;
let serviceRating = 5;

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho&source=g.page.m.ia._&utm_source=gbp&laa=nmx-review-solicitation-ia2';

const $ = id => document.getElementById(id);

function buildStars(containerId, initialValue, onChange) {
  const box = $(containerId);
  box.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = '★';
    star.tabIndex = 0;
    star.setAttribute('role', 'button');
    star.setAttribute('aria-label', `${i} star rating`);

    const setRating = () => {
      onChange(i);
      [...box.children].forEach((item, index) => item.classList.toggle('on', index < i));
    };

    star.addEventListener('click', setRating);
    star.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') setRating();
    });
    box.appendChild(star);
  }
  [...box.children].forEach((item, index) => item.classList.toggle('on', index < initialValue));
}

buildStars('foodStars', 5, value => foodRating = value);
buildStars('serviceStars', 5, value => serviceRating = value);

function clean(value) {
  return (value || '').trim().replace(/\s+/g, ' ');
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getFormData() {
  return {
    language: $('language').value,
    eventType: $('eventType').value,
    tone: $('tone').value,
    length: $('length').value,
    name: clean($('customerName').value),
    likedMost: clean($('likedMost').value),
    specialItem: clean($('specialItem').value),
    food: foodRating,
    service: serviceRating
  };
}

function localEnglishReview(data) {
  const intros = {
    premium: [`Shreevallabh Caterers delivered a premium and professional catering experience for our ${data.eventType}.`, `For our ${data.eventType}, Shreevallabh Caterers provided excellent food quality and dependable hospitality.`],
    warm: [`We had a wonderful experience with Shreevallabh Caterers for our ${data.eventType}.`, `Shreevallabh Caterers made our ${data.eventType} truly special.`],
    simple: [`We chose Shreevallabh Caterers for our ${data.eventType} and had a very good experience.`, `Our ${data.eventType} catering by Shreevallabh Caterers was very nice.`],
    emotional: [`Our ${data.eventType} became even more memorable because of Shreevallabh Caterers.`, `Shreevallabh Caterers added a beautiful touch to our ${data.eventType}.`]
  };

  const foodLine = data.food === 5 ? 'The food was delicious, fresh, and loved by all our guests.' : `The food was very good and we would rate it ${data.food}/5.`;
  const serviceLine = data.service === 5 ? 'The service team was polite, punctual, and very well coordinated.' : `The service was good and we would rate it ${data.service}/5.`;
  const highlight = data.likedMost ? `We especially liked ${data.likedMost}.` : 'The overall arrangement was handled with care and attention.';
  const special = data.specialItem ? `The ${data.specialItem} was also a special highlight.` : '';
  const close = pick([
    'Highly recommended for anyone looking for tasty food and reliable service.',
    'Thank you to the entire team for making the event smooth and memorable.',
    'We happily recommend Shreevallabh Caterers for family functions, weddings, and special occasions.'
  ]);
  const sign = data.name ? ` - ${data.name}` : '';

  if (data.length === 'short') return `${pick(intros[data.tone])} ${foodLine} ${serviceLine} ${close}${sign}`;
  if (data.length === 'long') return `${pick(intros[data.tone])} ${foodLine} ${serviceLine} ${highlight} ${special} From planning to serving, the team maintained a professional approach and helped us host the event smoothly. ${close}${sign}`;
  return `${pick(intros[data.tone])} ${foodLine} ${serviceLine} ${highlight} ${special} ${close}${sign}`;
}

function localIndicReview(data) {
  const dictionary = {
    hindi: {
      intro: `हमने अपने ${data.eventType} के लिए Shreevallabh Caterers को चुना और हमारा अनुभव बहुत अच्छा रहा।`,
      food: 'खाना स्वादिष्ट, ताज़ा और सभी मेहमानों को पसंद आया।',
      service: 'सेवा समय पर, विनम्र और अच्छी तरह व्यवस्थित थी।',
      liked: data.likedMost ? `हमें खास तौर पर ${data.likedMost} बहुत पसंद आया।` : 'पूरी व्यवस्था बहुत अच्छी रही।',
      special: data.specialItem ? `${data.specialItem} भी बहुत अच्छा था।` : '',
      close: 'हम Shreevallabh Caterers को विशेष अवसरों के लिए ज़रूर recommend करते हैं।'
    },
    marathi: {
      intro: `आमच्या ${data.eventType} साठी आम्ही Shreevallabh Caterers निवडले आणि अनुभव खूप छान होता.`,
      food: 'जेवण चविष्ट, ताजे आणि पाहुण्यांना खूप आवडले.',
      service: 'सेवा वेळेवर, नम्र आणि व्यवस्थित होती.',
      liked: data.likedMost ? `आम्हाला विशेषतः ${data.likedMost} खूप आवडले.` : 'संपूर्ण व्यवस्था उत्तम होती.',
      special: data.specialItem ? `${data.specialItem} ही खास गोष्ट होती.` : '',
      close: 'विशेष कार्यक्रमांसाठी आम्ही Shreevallabh Caterers नक्कीच recommend करू.'
    },
    gujarati: {
      intro: `અમારા ${data.eventType} માટે અમે Shreevallabh Caterers પસંદ કર્યા અને અનુભવ ખૂબ સારો રહ્યો.`,
      food: 'ભોજન સ્વાદિષ્ટ, તાજું અને મહેમાનોને ખૂબ ગમ્યું.',
      service: 'સેવા સમયસર, વિનમ્ર અને સારી રીતે સંચાલિત હતી.',
      liked: data.likedMost ? `અમને ખાસ કરીને ${data.likedMost} ખૂબ ગમ્યું.` : 'સંપૂર્ણ વ્યવસ્થા ખૂબ સારી રહી.',
      special: data.specialItem ? `${data.specialItem} પણ ખાસ રહ્યું.` : '',
      close: 'વિશેષ પ્રસંગો માટે અમે Shreevallabh Caterers ને જરૂરથી recommend કરીએ છીએ.'
    }
  };
  const t = dictionary[data.language];
  const sign = data.name ? ` - ${data.name}` : '';
  if (data.length === 'short') return `${t.intro} ${t.food} ${t.close}${sign}`;
  if (data.length === 'long') return `${t.intro} ${t.food} ${t.service} ${t.liked} ${t.special} ${t.close}${sign}`;
  return `${t.intro} ${t.food} ${t.service} ${t.liked} ${t.special} ${t.close}${sign}`;
}

async function generateWithApi(data) {
  const endpoint = localStorage.getItem('reviewgen_api_endpoint');
  const key = localStorage.getItem('reviewgen_api_key');
  const model = localStorage.getItem('reviewgen_api_model') || 'gpt-4o-mini';
  if (!endpoint || !key) return null;

  const prompt = `Write a natural, positive Google review for Shreevallabh Caterers, Kitchens & Hospitality LLP. Language: ${data.language}. Event: ${data.eventType}. Tone: ${data.tone}. Length: ${data.length}. Food rating: ${data.food}/5. Service rating: ${data.service}/5. Highlights: ${data.likedMost || 'not specified'}. Special dish/service: ${data.specialItem || 'not specified'}. Customer name: ${data.name || 'do not include name'}. Do not overpromise. Keep it suitable for a real customer review.`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You generate concise, authentic customer review drafts.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8
      })
    });
    const json = await response.json();
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn('API generation failed. Falling back to local generator.', error);
    return null;
  }
}

async function generateReview() {
  const data = getFormData();
  $('generateBtn').textContent = 'Generating...';
  $('generateBtn').disabled = true;

  const apiReview = await generateWithApi(data);
  const review = apiReview || (data.language === 'english' ? localEnglishReview(data) : localIndicReview(data));

  $('reviewOutput').value = review;
  $('resultPanel').classList.remove('hidden');
  $('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('generateBtn').textContent = '✨ Generate AI Review';
  $('generateBtn').disabled = false;
}

async function copyReview() {
  const review = $('reviewOutput').value;
  if (!review) return;
  try {
    await navigator.clipboard.writeText(review);
    alert('Review copied successfully!');
  } catch (error) {
    $('reviewOutput').select();
    document.execCommand('copy');
    alert('Review copied successfully!');
  }
}

function openGoogleReview() {
  window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
}

function shareWhatsApp() {
  const review = encodeURIComponent($('reviewOutput').value || '');
  if (review) window.open(`https://wa.me/?text=${review}`, '_blank', 'noopener,noreferrer');
}

function toggleSettings() {
  $('settingsPanel').classList.toggle('hidden');
  if (!$('settingsPanel').classList.contains('hidden')) {
    $('apiEndpoint').value = localStorage.getItem('reviewgen_api_endpoint') || '';
    $('apiKey').value = localStorage.getItem('reviewgen_api_key') || '';
    $('apiModel').value = localStorage.getItem('reviewgen_api_model') || '';
  }
}

function saveSettings() {
  localStorage.setItem('reviewgen_api_endpoint', clean($('apiEndpoint').value));
  localStorage.setItem('reviewgen_api_key', clean($('apiKey').value));
  localStorage.setItem('reviewgen_api_model', clean($('apiModel').value));
  alert('API settings saved on this device.');
}

$('generateBtn').addEventListener('click', generateReview);
$('regenerateBtn').addEventListener('click', generateReview);
$('copyBtn').addEventListener('click', copyReview);
$('googleBtn').addEventListener('click', openGoogleReview);
$('whatsappBtn').addEventListener('click', shareWhatsApp);
$('settingsBtn').addEventListener('click', toggleSettings);
$('saveSettingsBtn').addEventListener('click', saveSettings);
