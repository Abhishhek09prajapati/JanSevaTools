
// Initialize with today's date
const today = new Date().toISOString().split('T')[0];
document.getElementById('startDate').value = today;
document.getElementById('endDate').value = today;

// DOM Elements
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const loadingSpinner = document.getElementById('loadingSpinner');

// Set date range presets
window.setDateRange = function (range) {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const today = new Date();

    switch (range) {
        case 'today':
            startDate.value = today.toISOString().split('T')[0];
            endDate.value = today.toISOString().split('T')[0];
            break;
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            startDate.value = yesterday.toISOString().split('T')[0];
            endDate.value = today.toISOString().split('T')[0];
            break;
        case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            startDate.value = today.toISOString().split('T')[0];
            endDate.value = tomorrow.toISOString().split('T')[0];
            break;
        case 'week':
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            startDate.value = today.toISOString().split('T')[0];
            endDate.value = nextWeek.toISOString().split('T')[0];
            break;
        case 'month':
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            startDate.value = today.toISOString().split('T')[0];
            endDate.value = nextMonth.toISOString().split('T')[0];
            break;
        case 'year':
            const nextYear = new Date(today);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            startDate.value = today.toISOString().split('T')[0];
            endDate.value = nextYear.toISOString().split('T')[0];
            break;
    }

    calculateBtn.click();
};

// Calculate difference
calculateBtn.addEventListener('click', function () {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start) {
        showToast('Please select start date', 'error');
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    setTimeout(() => {
        const date1 = new Date(start);
        const date2 = new Date(end);

        if (date2 < date1) {
            loadingSpinner.classList.add('hidden');
            showToast('End date must be after start date', 'error');
            return;
        }

        // Calculate difference
        let diffInMs = date2 - date1;

        // Basic calculations
        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Detailed year/month calculation
        let years = date2.getFullYear() - date1.getFullYear();
        let months = date2.getMonth() - date1.getMonth();
        let dayDiff = date2.getDate() - date1.getDate();

        if (dayDiff < 0) {
            months--;
            const daysInPrevMonth = new Date(date2.getFullYear(), date2.getMonth(), 0).getDate();
            dayDiff += daysInPrevMonth;
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Remaining time
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        // Decimal values
        const totalDaysDecimal = diffInMs / (1000 * 60 * 60 * 24);

        // Update display
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = remainingHours;
        document.getElementById('minutes').textContent = remainingMinutes;
        document.getElementById('seconds').textContent = remainingSeconds;

        document.getElementById('yearsDecimal').textContent = (totalDaysDecimal / 365).toFixed(2);
        document.getElementById('monthsDecimal').textContent = (totalDaysDecimal / 30.44).toFixed(2);
        document.getElementById('daysDecimal').textContent = totalDaysDecimal.toFixed(2);
        document.getElementById('hoursDecimal').textContent = (totalDaysDecimal * 24).toFixed(2);
        document.getElementById('minutesDecimal').textContent = (totalDaysDecimal * 24 * 60).toFixed(2);
        document.getElementById('secondsDecimal').textContent = (totalDaysDecimal * 24 * 60 * 60).toFixed(2);

        document.getElementById('totalDays').textContent = days.toLocaleString();
        document.getElementById('totalHours').textContent = hours.toLocaleString();
        document.getElementById('totalMinutes').textContent = minutes.toLocaleString();
        document.getElementById('totalSeconds').textContent = seconds.toLocaleString();

        document.getElementById('dateRange').textContent =
            `From ${formatDate(date1)} to ${formatDate(date2)}`;

        document.getElementById('exactTime').innerHTML =
            `<i class="fas fa-hourglass-half mr-2"></i> Exact: ${years} years, ${months} months, ${dayDiff} days, ${remainingHours} hours, ${remainingMinutes} minutes, ${remainingSeconds} seconds`;

        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;
        document.getElementById('weeksBreakdown').innerHTML =
            `<i class="fas fa-calendar-week mr-2"></i> ${weeks} weeks, ${remainingDays} days`;

        // Calculate business days (Mon-Fri)
        let businessDays = 0;
        let currentDate = new Date(date1);
        while (currentDate <= date2) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) businessDays++;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        document.getElementById('businessDays').textContent =
            `Business days (Mon-Fri): ${businessDays} days`;

        // Hide loading, show result
        loadingSpinner.classList.add('hidden');
        resultDiv.classList.remove('hidden');

        // Save to localStorage
        saveCalculation(start, end, years, months, days);

        showToast('Calculation completed!', 'success');
    }, 500); // Simulate loading for better UX
});

// Format date helper
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Save calculation to history
function saveCalculation(start, end, years, months, days) {
    let history = JSON.parse(localStorage.getItem('dateCalcHistory') || '[]');
    history.unshift({
        start,
        end,
        years,
        months,
        days,
        timestamp: new Date().toISOString()
    });
    if (history.length > 10) history.pop(); // Keep last 10
    localStorage.setItem('dateCalcHistory', JSON.stringify(history));
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    toast.className = `toast-message ${colors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center transform transition-all`;
    toast.innerHTML = `
                <i class="fas ${icons[type]} mr-3 text-xl"></i>
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.remove()" class="ml-4 hover:opacity-75">
                    <i class="fas fa-times"></i>
                </button>
            `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// Download result as text
window.downloadResult = function () {
    const years = document.getElementById('years').textContent;
    const months = document.getElementById('months').textContent;
    const days = document.getElementById('totalDays').textContent;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    const content = `Date Difference Calculation
===========================
Start Date: ${start}
End Date: ${end}
===========================
Years: ${years}
Months: ${months}
Total Days: ${days}
Hours: ${document.getElementById('hours').textContent}
Minutes: ${document.getElementById('minutes').textContent}
Seconds: ${document.getElementById('seconds').textContent}
===========================
Generated by JanSeva Kendra Date Calculator
${new Date().toLocaleString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `date-difference-${start}-to-${end}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Result downloaded!', 'success');
};

// Copy result to clipboard
window.copyResult = function () {
    const result = document.getElementById('exactTime').innerText;
    navigator.clipboard.writeText(result).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
};

// Reset calculator
window.resetCalculator = function () {
    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = today;
    resultDiv.classList.add('hidden');
    showToast('Calculator reset', 'info');
};

// Share functions
window.shareOnWhatsApp = function () {
    const text = 'Check out this Date Difference Calculator - Calculate exact difference between two dates';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.copyLink = function () {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied!', 'success');
    });
};

// Auto-calculate on date change
document.getElementById('startDate').addEventListener('change', function () {
    if (this.value && document.getElementById('endDate').value) {
        calculateBtn.click();
    }
});

document.getElementById('endDate').addEventListener('change', function () {
    if (this.value && document.getElementById('startDate').value) {
        calculateBtn.click();
    }
});

// Load last calculation from history
window.addEventListener('load', function () {
    const history = JSON.parse(localStorage.getItem('dateCalcHistory') || '[]');
    if (history.length > 0) {
        // Optional: Show recent calculations
    }
});
