let foodRating = 5;
let serviceRating = 5;

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJQ0w0F7K5wjsRzAlDupaKUho';

function buildStars(containerId, initialValue, onChange) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = '★';
    star.setAttribute('role', 'button');
    star.setAttribute('tabindex', '0');
    star.setAttribute('aria-label', `${i} star rating`);

    const setValue = () => {
      onChange(i);
      [...container.children].forEach((child, index) => {
        child.classList.toggle('on', index < i);
      });
    };

    star.addEventListener('click', setValue);
    star.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') setValue();
    });

    container.appendChild(star);
  }

  [...container.children].forEach((child, index) => child.classList.toggle('on', index < initialValue));
}

buildStars('foodStars', foodRating, value => foodRating = value);
buildStars('serviceStars', serviceRating, value => serviceRating = value);

function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function cleanText(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function generateEnglish(data) {
  const intro = {
    warm: [`We had a wonderful experience with Shreevallabh Caterers for our ${data.event}.`, `Shreevallabh Caterers made our ${data.event} truly special.`],
    premium: [`Shreevallabh Caterers delivered a highly professional catering experience for our ${data.event}.`, `For our ${data.event}, Shreevallabh Caterers provided excellent food quality and dependable hospitality.`],
    simple: [`We chose Shreevallabh Caterers for our ${data.event} and had a very good experience.`, `Our ${data.event} catering by Shreevallabh Caterers was very nice.`],
    emotional: [`Our ${data.event} became even more memorable because of Shreevallabh Caterers.`, `Shreevallabh Caterers added a beautiful touch to our ${data.event}.`]
  };

  const foodLine = data.food >= 5 ? 'The food was delicious, fresh, and appreciated by our guests.' : `The food was very good and deserves ${data.food}/5 from us.`;
  const serviceLine = data.service >= 5 ? 'The service team was polite, punctual, and well coordinated.' : `The service was good and we would rate it ${data.service}/5.`;
  const highlightLine = data.highlights ? `We especially liked ${data.highlights}.` : 'Everything was handled with care and attention.';
  const closing = choice([
    'We happily recommend Shreevallabh Caterers for weddings, family functions, and special occasions.',
    'Thank you to the entire team for making the event smooth and memorable.',
    'Highly recommended for anyone looking for tasty food and reliable service.'
  ]);
  const name = data.name ? ` - ${data.name}` : '';

  if (data.length === 'short') return `${choice(intro[data.tone])} ${foodLine} ${serviceLine} ${closing}${name}`;
  if (data.length === 'long') return `${choice(intro[data.tone])} ${foodLine} ${serviceLine} ${highlightLine} From planning to serving, the team maintained a professional approach and helped us host the event smoothly. ${closing}${name}`;
  return `${choice(intro[data.tone])} ${foodLine} ${serviceLine} ${highlightLine} ${closing}${name}`;
}

function generateIndic(data, language) {
  const translations = {
    hindi: {
      intro: `हमने अपने ${data.event} के लिए Shreevallabh Caterers को चुना और हमारा अनुभव बहुत अच्छा रहा।`,
      food: `खाना स्वादिष्ट, ताज़ा और सभी मेहमानों को पसंद आया।`,
      service: `सेवा समय पर, विनम्र और अच्छी तरह व्यवस्थित थी।`,
      highlight: data.highlights ? `हमें खास तौर पर ${data.highlights} बहुत पसंद आया।` : `पूरी व्यवस्था बहुत अच्छी रही।`,
      close: `हम Shreevallabh Caterers को विशेष अवसरों के लिए ज़रूर recommend करते हैं।`
    },
    gujarati: {
      intro: `અમારા ${data.event} માટે અમે Shreevallabh Caterers પસંદ કર્યા અને અનુભવ ખૂબ સારો રહ્યો.`,
      food: `ભોજન સ્વાદિષ્ટ, તાજું અને મહેમાનોને ખૂબ ગમ્યું.`,
      service: `સેવા સમયસર, વિનમ્ર અને સારી રીતે સંચાલિત હતી.`,
      highlight: data.highlights ? `અમને ખાસ કરીને ${data.highlights} ખૂબ ગમ્યું.` : `સંપૂર્ણ વ્યવસ્થા ખૂબ સારી રહી.`,
      close: `વિશેષ પ્રસંગો માટે અમે Shreevallabh Caterers ને જરૂરથી recommend કરીએ છીએ.`
    },
    marathi: {
      intro: `आमच्या ${data.event} साठी आम्ही Shreevallabh Caterers निवडले आणि अनुभव खूप छान होता.`,
      food: `जेवण चविष्ट, ताजे आणि पाहुण्यांना खूप आवडले.`,
      service: `सेवा वेळेवर, नम्र आणि व्यवस्थित होती.`,
      highlight: data.highlights ? `आम्हाला विशेषतः ${data.highlights} खूप आवडले.` : `संपूर्ण व्यवस्था उत्तम होती.`,
      close: `विशेष कार्यक्रमांसाठी आम्ही Shreevallabh Caterers नक्कीच recommend करू.`
    }
  };

  const t = translations[language];
  const name = data.name ? ` - ${data.name}` : '';
  if (data.length === 'short') return `${t.intro} ${t.food} ${t.close}${name}`;
  if (data.length === 'long') return `${t.intro} ${t.food} ${t.service} ${t.highlight} संपूर्ण टीमने कार्यक्रम सुंदर आणि लक्षात राहील असा केला. ${t.close}${name}`;
  return `${t.intro} ${t.food} ${t.service} ${t.highlight} ${t.close}${name}`;
}

function generateReview() {
  const data = {
    language: document.getElementById('language').value,
    event: document.getElementById('eventType').value,
    tone: document.getElementById('tone').value,
    length: document.getElementById('length').value,
    food: foodRating,
    service: serviceRating,
    highlights: cleanText(document.getElementById('highlights').value),
    name: cleanText(document.getElementById('customerName').value)
  };

  const review = data.language === 'english' ? generateEnglish(data) : generateIndic(data, data.language);
  document.getElementById('reviewOutput').value = review;
  document.getElementById('resultCard').classList.remove('hidden');
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function copyReview() {
  const review = document.getElementById('reviewOutput').value;
  if (!review) return;
  try {
    await navigator.clipboard.writeText(review);
    alert('Review copied successfully!');
  } catch (error) {
    document.getElementById('reviewOutput').select();
    document.execCommand('copy');
    alert('Review copied successfully!');
  }
}

function shareWhatsApp() {
  const review = encodeURIComponent(document.getElementById('reviewOutput').value);
  window.open(`https://wa.me/?text=${review}`, '_blank');
}

document.getElementById('generateBtn').addEventListener('click', generateReview);
document.getElementById('newReviewBtn').addEventListener('click', generateReview);
document.getElementById('copyBtn').addEventListener('click', copyReview);
document.getElementById('googleBtn').addEventListener('click', () => window.open(GOOGLE_REVIEW_URL, '_blank'));
document.getElementById('whatsappBtn').addEventListener('click', shareWhatsApp);
