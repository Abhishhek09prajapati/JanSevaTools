
// DOM Elements
const birthdateInput = document.getElementById('birthdate');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

// Result Elements
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const totalMonthsEl = document.getElementById('totalMonths');
const totalDaysEl = document.getElementById('totalDays');
const totalHoursEl = document.getElementById('totalHours');
const totalMinutesEl = document.getElementById('totalMinutes');
const totalSecondsEl = document.getElementById('totalSeconds');
const nextBirthdayEl = document.getElementById('nextBirthday');
const zodiacSignEl = document.getElementById('zodiacSign');
const birthDayOfWeekEl = document.getElementById('birthDayOfWeek');

// Set max date to today
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
birthdateInput.setAttribute('max', todayStr);

// Set default date to 25 years ago (common age)
const defaultDate = new Date();
defaultDate.setFullYear(today.getFullYear() - 25);
birthdateInput.value = defaultDate.toISOString().split('T')[0];

// Event Listeners
birthdateInput.addEventListener('change', calculateAge);
birthdateInput.addEventListener('input', calculateAge);
calculateBtn.addEventListener('click', calculateAge);

// Auto-calculate on page load
window.addEventListener('load', calculateAge);

function calculateAge() {
    const birthDate = new Date(birthdateInput.value);
    const now = new Date();

    // Reset displays
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    // Simulate loading for better UX
    setTimeout(() => {
        // Validation
        if (!birthdateInput.value) {
            showError("Please select your birth date.");
            loadingDiv.classList.add('hidden');
            return;
        }

        if (isNaN(birthDate.getTime())) {
            showError("Please enter a valid date.");
            loadingDiv.classList.add('hidden');
            return;
        }

        if (birthDate > now) {
            showError("Birth date cannot be in the future!");
            loadingDiv.classList.add('hidden');
            return;
        }

        // Calculate detailed age
        const age = calculateDetailedAge(birthDate, now);

        // Update UI
        updateResultDisplay(age, birthDate, now);

        resultDiv.classList.remove('hidden');
        loadingDiv.classList.add('hidden');

        // Save to history
        saveToHistory(birthDate, age);
    }, 300);
}

function calculateDetailedAge(birthDate, currentDate) {
    // Years calculation
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate total units
    const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
    const totalMonths = (years * 12) + months;
    const totalHours = totalDays * 24 + currentDate.getHours() - birthDate.getHours();
    const totalMinutes = totalHours * 60 + currentDate.getMinutes() - birthDate.getMinutes();
    const totalSeconds = totalMinutes * 60 + currentDate.getSeconds() - birthDate.getSeconds();

    return {
        years, months, days,
        totalMonths,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds
    };
}

function updateResultDisplay(age, birthDate, currentDate) {
    // Main age
    yearsEl.textContent = age.years;
    monthsEl.textContent = age.months;
    daysEl.textContent = age.days;

    // Total units
    totalMonthsEl.textContent = age.totalMonths.toLocaleString();
    totalDaysEl.textContent = age.totalDays.toLocaleString();
    totalHoursEl.textContent = age.totalHours.toLocaleString();
    totalMinutesEl.textContent = age.totalMinutes.toLocaleString();
    totalSecondsEl.textContent = age.totalSeconds.toLocaleString();

    // Next birthday
    let nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < currentDate) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));

    if (daysUntilBirthday === 0) {
        nextBirthdayEl.innerHTML = 'Today! 🎉';
    } else if (daysUntilBirthday === 1) {
        nextBirthdayEl.innerHTML = 'Tomorrow! 🎂';
    } else {
        nextBirthdayEl.innerHTML = `${daysUntilBirthday} days`;
    }

    // Zodiac sign
    zodiacSignEl.textContent = getZodiacSign(birthDate);

    // Birth day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    birthDayOfWeekEl.textContent = daysOfWeek[birthDate.getDay()];
}

function getZodiacSign(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries ♈';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus ♉';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini ♊';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer ♋';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo ♌';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo ♍';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra ♎';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio ♏';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius ♐';
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn ♑';
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius ♒';
    return 'Pisces ♓';
}

// Quick set functions
window.setAge = function (years) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    birthdateInput.value = date.toISOString().split('T')[0];
    calculateAge();
};

window.setToday = function () {
    birthdateInput.value = todayStr;
    calculateAge();
};

// Utility functions
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    toast.className = `toast-message ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`;
    toast.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-3"></i>
                ${message}
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Copy result
window.copyResult = function () {
    const text = `Age: ${yearsEl.textContent} Years, ${monthsEl.textContent} Months, ${daysEl.textContent} Days | Total Days: ${totalDaysEl.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Result copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
};

// Download result
window.downloadResult = function () {
    const result = `AGE CALCULATION RESULTS
------------------------
Date: ${new Date().toLocaleDateString()}
Birth Date: ${birthdateInput.value}

EXACT AGE:
${yearsEl.textContent} Years, ${monthsEl.textContent} Months, ${daysEl.textContent} Days

TOTAL UNITS:
Total Months: ${totalMonthsEl.textContent}
Total Days: ${totalDaysEl.textContent}
Total Hours: ${totalHoursEl.textContent}
Total Minutes: ${totalMinutesEl.textContent}
Total Seconds: ${totalSecondsEl.textContent}

Next Birthday: ${nextBirthdayEl.textContent}
Zodiac Sign: ${zodiacSignEl.textContent}
Born on: ${birthDayOfWeekEl.textContent}

Calculated using Smart CSC Tools Age Calculator`;

    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `age-calculation-${todayStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Result downloaded!', 'success');
};

// Share result
window.shareResult = function () {
    const text = `My age is ${yearsEl.textContent} years, ${monthsEl.textContent} months, ${daysEl.textContent} days. Calculate yours at Smart CSC Tools!`;
    if (navigator.share) {
        navigator.share({
            title: 'My Age Calculation',
            text: text,
            url: window.location.href
        }).catch(() => { });
    } else {
        copyResult();
    }
};

// Save to history
function saveToHistory(birthDate, age) {
    let history = JSON.parse(localStorage.getItem('ageHistory') || '[]');
    history.unshift({
        date: birthDate.toISOString().split('T')[0],
        age: `${age.years}y ${age.months}m ${age.days}d`,
        timestamp: new Date().toISOString()
    });
    history = history.slice(0, 5); // Keep only last 5
    localStorage.setItem('ageHistory', JSON.stringify(history));
}

// Share functions
window.shareOnWhatsApp = function () {
    const text = 'Check out this accurate age calculator - Calculate your exact age in years, months, and days';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Free Accurate Age Calculator - Find your exact age';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

// Initial calculation
calculateAge();
