const editor = document.getElementById('editor');
const themeToggle = document.getElementById('themeToggle');
const wordCountDisplay = document.getElementById('wordCount');
const readTimeDisplay = document.getElementById('readTime');
const paraStatus = document.getElementById('paraStatus');
const paraIndicator = document.getElementById('paraIndicator');
const seoStatus = document.getElementById('seoStatus');
const cleanBtn = document.getElementById('cleanText');

// Elemen Baru untuk Keyword
const keywordInput = document.getElementById('keywordInput');
const keywordResult = document.getElementById('keywordResult');

// Theme Toggle Logic
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerText = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerText = 'Light Mode';
    }
});

// Event Listeners
editor.addEventListener('input', analyzeText);
keywordInput.addEventListener('input', analyzeText);

const welcomeOverlay = document.getElementById('welcomeOverlay');

function analyzeText() {
    const text = editor.value.trim();
    
    // --- Logika Overlay ---
    if (text.length > 0) {
        welcomeOverlay.classList.add('overlay-hidden');
    } else {
        welcomeOverlay.classList.remove('overlay-hidden');
    }

    // 1. Word Count
    const words = text ? text.split(/\s+/).length : 0;
    wordCountDisplay.innerText = words;

    // 2. Reading Time
    const time = Math.ceil(words / 200);
    readTimeDisplay.innerText = time + ' mnt';

    // 3. Keyword Finder (Fitur Baru)
    const keyword = keywordInput.value.trim().toLowerCase();
    if (keyword && text) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const count = (text.match(regex) || []).length;
        keywordResult.innerText = `${count} ditemukan`;
    } else {
        keywordResult.innerText = `0 ditemukan`;
    }

    // 4. Paragraph Analysis
    const paragraphs = text.split(/\n+/);
    let longParas = 0;
    if (text !== "") {
        paragraphs.forEach(p => {
            const sentenceCount = (p.match(/\./g) || []).length;
            if (sentenceCount > 5) longParas++;
        });
    }

    updateParaStatus(text, longParas);

    // 5. SEO Title Analysis
    const firstLine = text.split('\n')[0];
    updateSEOStatus(text, firstLine);
}

function updateParaStatus(text, longParas) {
    if (longParas > 0) {
        paraStatus.innerText = longParas + ' paragraf terlalu padat.';
        paraStatus.className = 'alert alert-warning';
        paraIndicator.style.background = 'var(--warning)';
        paraIndicator.style.width = '60%';
    } else if (text === "") {
        paraStatus.innerText = 'Siap menganalisis...';
        paraStatus.className = 'alert alert-success';
        paraIndicator.style.width = '100%';
    } else {
        paraStatus.innerText = 'Struktur paragraf ideal!';
        paraStatus.className = 'alert alert-success';
        paraIndicator.style.background = 'var(--success)';
        paraIndicator.style.width = '100%';
    }
}

function updateSEOStatus(text, firstLine) {
    if (firstLine.length > 60) {
        seoStatus.innerText = 'Judul terlalu panjang (>60 char)';
        seoStatus.className = 'alert alert-warning';
    } else if (text.length > 0) {
        seoStatus.innerText = 'Panjang judul ideal.';
        seoStatus.className = 'alert alert-success';
    } else {
        seoStatus.innerText = 'Belum ada input';
        seoStatus.className = 'alert alert-success';
    }
}

// Cleaning Function
cleanBtn.addEventListener('click', () => {
    let text = editor.value;
    text = text.replace(/ +(?= )/g,'');
    text = text.replace(/\n{3,}/g, '\n\n');
    editor.value = text.trim();
    analyzeText();
    alert('Teks telah dibersihkan!');
});