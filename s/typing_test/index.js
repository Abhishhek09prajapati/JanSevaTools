
// Sample texts for typing test
const englishTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
    "Typing speed is measured in words per minute. Accuracy is equally important when it comes to typing.",
    "Practice makes perfect. Regular typing practice can significantly improve your speed and accuracy over time.",
    "The internet has revolutionized communication, making it easier to connect with people around the world."
];

const hindiTexts = [
    "मैं घर जा रहा हूँ। आज मौसम बहुत सुहावना है और पक्षी चहचहा रहे हैं।",
    "भारत एक विविधतापूर्ण देश है जहाँ अनेक भाषाएँ बोली जाती हैं और विभिन्न संस्कृतियाँ पनपती हैं।",
    "प्रौद्योगिकी ने हमारे जीवन को पूरी तरह से बदल दिया है और दैनिक कार्यों को आसान बना दिया है।",
    "शिक्षा मनुष्य का सबसे बड़ा हथियार है जिसके द्वारा वह दुनिया को बदल सकता है।",
    "प्रकृति का सौंदर्य मन को शांति प्रदान करता है और आत्मा को तरोताजा कर देता है।"
];

// DOM Elements
const englishBtn = document.getElementById('englishBtn');
const hindiBtn = document.getElementById('hindiBtn');
const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const retryBtn = document.getElementById('retryBtn');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const errorsElement = document.getElementById('errors');
const charCountElement = document.getElementById('charCount');
const resultsSection = document.getElementById('results');
const resultWpm = document.getElementById('resultWpm');
const resultAccuracy = document.getElementById('resultAccuracy');
const resultTime = document.getElementById('resultTime');
const soundToggle = document.getElementById('soundToggle');

// Variables
let currentLanguage = 'english';
let currentText = '';
let timer;
let timeLeft = 60;
let isTestRunning = false;
let startTime;
let errors = 0;
let correctChars = 0;
let totalChars = 0;
let wpmInterval;

// Initialize the app
function init() {
    setLanguage('english');
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    englishBtn.addEventListener('click', () => setLanguage('english'));
    hindiBtn.addEventListener('click', () => setLanguage('hindi'));
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    retryBtn.addEventListener('click', resetTest);
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault(); // Prevent default backspace behavior
        }
    });
}

// Set language and update UI
function setLanguage(language) {
    currentLanguage = language;

    // Update language buttons
    if (language === 'english') {
        englishBtn.classList.remove('bg-gray-200', 'text-gray-700');
        englishBtn.classList.add('bg-blue-600', 'text-white');
        hindiBtn.classList.remove('bg-blue-600', 'text-white');
        hindiBtn.classList.add('bg-gray-200', 'text-gray-700');
        textDisplay.classList.remove('hindi-text');
    } else {
        hindiBtn.classList.remove('bg-gray-200', 'text-gray-700');
        hindiBtn.classList.add('bg-blue-600', 'text-white');
        englishBtn.classList.remove('bg-blue-600', 'text-white');
        englishBtn.classList.add('bg-gray-200', 'text-gray-700');
        textDisplay.classList.add('hindi-text');
    }

    // Reset test if running
    if (isTestRunning) {
        resetTest();
    }

    // Load new text
    loadNewText();
}

// Load a new random text
function loadNewText() {
    const texts = currentLanguage === 'english' ? englishTexts : hindiTexts;
    const randomIndex = Math.floor(Math.random() * texts.length);
    currentText = texts[randomIndex];

    // Display text with spans for each character
    textDisplay.innerHTML = '';
    for (let i = 0; i < currentText.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = currentText[i];
        charSpan.id = `char-${i}`;
        textDisplay.appendChild(charSpan);
    }

    // Reset input
    typingInput.value = '';
    charCountElement.textContent = '0';

    // Highlight first character
    document.getElementById('char-0').classList.add('current');
}

// Start the typing test
function startTest() {
    if (isTestRunning) return;

    isTestRunning = true;
    startBtn.disabled = true;
    resetBtn.disabled = false;
    typingInput.disabled = false;
    typingInput.focus();

    // Reset stats
    timeLeft = 60;
    errors = 0;
    correctChars = 0;
    totalChars = 0;
    startTime = new Date();

    // Update UI
    updateStats();

    // Start timer
    timer = setInterval(updateTimer, 1000);

    // Start WPM calculation
    wpmInterval = setInterval(updateStats, 500);
}

// Update the timer
function updateTimer() {
    timeLeft--;
    timerElement.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
        endTest();
    }
}

// Handle typing input
function handleTyping() {
    if (!isTestRunning) return;

    const typedText = typingInput.value;
    totalChars = typedText.length;
    charCountElement.textContent = totalChars;

    // Update character highlighting
    updateCharacterHighlighting(typedText);

    // Calculate and update stats
    updateStats();
}

// Update character highlighting based on typed text
function updateCharacterHighlighting(typedText) {
    let newErrors = 0;
    let newCorrectChars = 0;

    for (let i = 0; i < currentText.length; i++) {
        const charElement = document.getElementById(`char-${i}`);
        charElement.classList.remove('correct', 'incorrect', 'current', 'typed');

        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                charElement.classList.add('correct');
                newCorrectChars++;
            } else {
                charElement.classList.add('incorrect');
                newErrors++;

                // Play error sound if enabled
                if (soundToggle.checked) {
                    playErrorSound();
                }
            }
            charElement.classList.add('typed');
        }

        if (i === typedText.length) {
            charElement.classList.add('current');
        }
    }

    errors = newErrors;
    correctChars = newCorrectChars;

    // Check if user has completed the text
    if (typedText.length >= currentText.length) {
        endTest();
    }
}

// Play error sound
function playErrorSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 200;
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Update statistics
function updateStats() {
    if (!isTestRunning) return;

    const elapsedTimeInMinutes = (new Date() - startTime) / 1000 / 60;
    const wpm = elapsedTimeInMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeInMinutes) : 0;
    const accuracy = totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 0;

    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;
    errorsElement.textContent = errors;
}

// End the test
function endTest() {
    isTestRunning = false;
    clearInterval(timer);
    clearInterval(wpmInterval);
    typingInput.disabled = true;
    startBtn.disabled = false;

    // Calculate final stats
    const elapsedTime = 60 - timeLeft;
    const elapsedTimeInMinutes = elapsedTime / 60;
    const finalWpm = elapsedTimeInMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeInMinutes) : 0;
    const finalAccuracy = totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 0;

    // Display results
    resultWpm.textContent = `${finalWpm} WPM`;
    resultAccuracy.textContent = `${finalAccuracy}%`;
    resultTime.textContent = `${elapsedTime}s`;
    resultsSection.classList.remove('hidden');
}

// Reset the test
function resetTest() {
    isTestRunning = false;
    clearInterval(timer);
    clearInterval(wpmInterval);
    timeLeft = 60;
    timerElement.textContent = '60s';
    wpmElement.textContent = '0';
    accuracyElement.textContent = '0%';
    errorsElement.textContent = '0';
    charCountElement.textContent = '0';

    typingInput.value = '';
    typingInput.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = true;

    resultsSection.classList.add('hidden');

    loadNewText();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
