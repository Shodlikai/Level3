const card = document.querySelector('.card');
const word = document.querySelector('.word');
const type = document.querySelector('.type');
const slider = document.querySelector('.slider input[type="range"]');
const sliderValue = document.getElementById('slider-value');
const sliderMax = document.getElementById('slider-max');
const nextButton = document.getElementById('next-button');
const audioButton = document.getElementById('audio-button');
const frontImage = document.getElementById('front-image'); // Not used for display now but kept for consistency
const backImage = document.getElementById('back-image');
const pronunciationElement = document.querySelector('.pronunciation');
const uzbekHintElement = document.getElementById('uzbek-hint');
const uzbekDefinitionElement = document.getElementById('uzbek-definition');
const instructionModal = document.getElementById('instruction-modal');
const closeModalButton = document.getElementById('close-modal');

const PIXABAY_API_KEY = "49146347-e05e26bd1aae0010e8163774c";
const learnedWords = [];
let words = [
  { english: "root", definition: "the part of a plant or tree that grows under the ground and gets water from the soil.", uzbekDefinition: "o‘simlik yoki daraxtning yer ostida o‘sadigan va tuproqdan suv oladigan qismi.", uzbek: "ildiz", type: "ot", pronunciation: "/ruːt/" },
  { english: "edible", definition: "something that is edible can be eaten.", uzbekDefinition: "yeyish mumkin bo‘lgan narsa.", uzbek: "yeyiladigan", type: "sifat", pronunciation: "/ˈed.ə.bəl/" },
  { english: "cell", definition: "the smallest part of a living thing that can exist independently.", uzbekDefinition: "tirik organizmning mustaqil yashay oladigan eng kichik birligi.", uzbek: "hujayra", type: "ot", pronunciation: "/sel/" },
  { english: "sugarcane", definition: "a tall tropical plant from whose stems sugar is obtained.", uzbekDefinition: "poyasidan shakar olinadigan baland tropik o‘simlik.", uzbek: "qamish (shakarqamish)", type: "ot", pronunciation: "/ˈʃʊɡ.ə.keɪn/" },
  { english: "eventually", definition: "after a long time, or after a lot of things have happened.", uzbekDefinition: "ko‘p vaqt o‘tib yoki ko‘p narsa sodir bo‘lgandan keyin.", uzbek: "oxiri, yakunda", type: "ravish", pronunciation: "/ɪˈven.tʃu.ə.li/" },
  { english: "raw", definition: "not cooked.", uzbekDefinition: "pishirilmagan.", uzbek: "xom", type: "sifat", pronunciation: "/rɔː/" },
  { english: "occur", definition: "to happen.", uzbekDefinition: "sodir bo‘lmoq.", uzbek: "ro‘y bermoq", type: "fe’l", pronunciation: "/əˈkɜːr/" },
  { english: "likely", definition: "something that is likely will probably happen or is probably true.", uzbekDefinition: "ehtimol sodir bo‘ladigan yoki rost bo‘lishi mumkin bo‘lgan narsa.", uzbek: "ehtimolli", type: "sifat", pronunciation: "/ˈlaɪk.li/" }
];

function shuffleWords() {
    words = words.sort(() => Math.random() - 0.5);
}
shuffleWords();

let currentIndex = 0;

// Slayderning min va max qiymatlari to'g'ri o'rnatildi
slider.min = 0;
slider.max = words.length - 1; // 0 dan boshlab to'g'ri indekslash
slider.value = 0; // Boshlang'ich qiymat 0-indeksga teng
sliderMax.textContent = words.length; // Umumiy so'zlar soni

async function getPixabayImage(query) {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return (data.hits.length > 0) ? data.hits[0].webformatURL : "placeholder.png";
    } catch (error) {
        console.error("Pixabay API error:", error);
        return "placeholder.png";
    }
}

async function updateCard(index) {
    // Agar so'zlar ro'yxati bo'sh bo'lsa, kartani tozalash
    if (words.length === 0) {
        document.querySelector('.card-front .en-word').textContent = "Barcha so'zlar yodlandi!";
        pronunciationElement.textContent = "";
        type.textContent = "";
        uzbekHintElement.textContent = "";
        backImage.src = "placeholder.png";
        document.querySelector('.card-back .uz-word').textContent = "";
        uzbekDefinitionElement.textContent = "";
        document.querySelector('.card-back .type').textContent = "";
        slider.value = 0;
        sliderMax.textContent = 0;
        sliderValue.textContent = "0 / 0";
        return;
    }

    // Indeks chegaradan chiqib ketmasligini ta'minlash
    if (index < 0) {
        index = 0; // Birinchi so'zga qaytarish
    } else if (index >= words.length) {
        index = words.length - 1; // Oxirgi so'zga qaytarish
    }

    // Kartaning old tomoni
    document.querySelector('.card-front .en-word').textContent = words[index].english;
    pronunciationElement.textContent = words[index].pronunciation;
    type.textContent = words[index].type;
    uzbekHintElement.textContent = words[index].uzbek;

    // Kartaning orqa tomoni
    document.querySelector('.card-back .uz-word').textContent = words[index].definition;
    uzbekDefinitionElement.textContent = words[index].uzbekDefinition;
    document.querySelector('.card-back .type').textContent = words[index].type;

    slider.value = index; // Slayder qiymati joriy indeksga teng
    sliderValue.textContent = `${index + 1} / ${words.length}`; // Foydalanuvchi uchun 1 dan boshlab ko'rsatish
    currentIndex = index;

    const imageUrl = await getPixabayImage(words[index].english);
    backImage.src = imageUrl;

    checkAndDownloadAudio(words[index].english);
}

async function checkAndDownloadAudio(audioFile) {
    console.log("Audio check/download for:", audioFile);
}

card.addEventListener('click', function () {
    this.classList.toggle('flipped');
});

slider.addEventListener('input', function () {
    updateCard(parseInt(this.value)); // parseInt(this.value) allaqachon to'g'ri indeksni beradi
    card.classList.remove('flipped');
});

nextButton.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= words.length) {
        shuffleWords();
        currentIndex = 0;
    }
    updateCard(currentIndex);
    card.classList.remove('flipped');
    instructionModal.style.display = "flex"; // "Keyingi" tugmasi bosilganda modal oyna chiqsin
});

function speak(text) {
    responsiveVoice.speak(text, "US English Male", { rate: 0.9 });
}

audioButton.addEventListener('click', function () {
    if (card.classList.contains('flipped')) {
        speak(words[currentIndex].definition);
    } else {
        speak(words[currentIndex].english);
    }
});

let startX = 0;
let endX = 0;

card.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

card.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = endX - startX;
    if (deltaX > 50) { // O'ngga surish (Oldingi so'zga qaytish)
        card.classList.add('swiping-right');
        setTimeout(() => {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = words.length - 1; // Oxiriga o'tkazish
            }
            updateCard(currentIndex);
            card.classList.remove('swiping-right');
            card.style.left = '';
            card.style.transform = '';
            card.classList.remove('flipped');
        }, 300);
    } else if (deltaX < -50) { // Chapga surish (Yodlangan deb belgilash va keyingiga o'tish)
        const learnedWord = words.splice(currentIndex, 1)[0];
        learnedWords.push(learnedWord);
        console.log("Yodlangan so'zlar:", learnedWords);

        if (words.length === 0) {
            alert("Barcha so'zlar yodlandi! Yangi so'zlar qo'shishingiz mumkin.");
            updateCard(-1); // Kartani tozalash uchun
            return;
        }

        // Agar joriy indeks mavjud bo'lmagan so'zga ishora qilsa, uni to'g'rilash
        if (currentIndex >= words.length) {
            currentIndex = 0; // Agar oxirgi so'z o'chirilgan bo'lsa, birinchiga qaytarish
        }
        
        updateCard(currentIndex);

        card.classList.add('swiping-left');
        setTimeout(() => {
            card.classList.remove('swiping-left');
            card.style.left = '';
            card.style.transform = '';
            card.classList.remove('flipped');
        }, 300);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    closeModalButton.addEventListener("click", function () {
        instructionModal.style.display = "none";
    });
    // Sahifa yuklanganda modalni ko'rsatish
    instructionModal.style.display = "flex";
});
updateCard(0);