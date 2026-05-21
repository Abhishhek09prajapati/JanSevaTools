
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const gstRateInput = document.getElementById('gstRate');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportHistoryBtn = document.getElementById('exportHistoryBtn');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const gstTypeRadios = document.querySelectorAll('input[name="gstType"]');
    const ratePresets = document.querySelectorAll('.rate-preset');
    const rateBtns = document.querySelectorAll('.rate-btn');

    // Result elements
    const originalAmountEl = document.getElementById('originalAmount');
    const gstAmountEl = document.getElementById('gstAmount');
    const totalAmountEl = document.getElementById('totalAmount');
    const cgstAmountEl = document.getElementById('cgstAmount');
    const sgstAmountEl = document.getElementById('sgstAmount');
    const igstAmountEl = document.getElementById('igstAmount');
    const cgstPercentEl = document.getElementById('cgstPercent');
    const sgstPercentEl = document.getElementById('sgstPercent');
    const igstPercentEl = document.getElementById('igstPercent');

    // History elements
    const historyList = document.getElementById('historyList');

    // State
    let calculationHistory = JSON.parse(localStorage.getItem('gstHistory')) || [];

    // Initialize
    updateHistoryDisplay();
    calculateGST(); // Initial calculation

    // Event Listeners
    calculateBtn.addEventListener('click', calculateGST);
    resetBtn.addEventListener('click', resetForm);
    exportPdfBtn.addEventListener('click', exportToPDF);
    exportHistoryBtn.addEventListener('click', exportHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Quick rate buttons
    ratePresets.forEach(preset => {
        preset.addEventListener('click', function () {
            const rate = this.dataset.rate;
            gstRateInput.value = rate;
            calculateGST();
            showToast(`GST rate set to ${rate}%`, 'success');
        });
    });

    rateBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const rate = this.dataset.rate;
            gstRateInput.value = rate;
            calculateGST();
        });
    });

    // GST type change
    gstTypeRadios.forEach(radio => {
        radio.addEventListener('change', calculateGST);
    });

    // Real-time calculation on input
    amountInput.addEventListener('input', calculateGST);
    gstRateInput.addEventListener('input', calculateGST);

    // Enter key support
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateGST();
    });

    gstRateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateGST();
    });

    // Main calculation function
    function calculateGST() {
        const amount = parseFloat(amountInput.value) || 0;
        const gstRate = parseFloat(gstRateInput.value) || 0;
        const gstType = document.querySelector('input[name="gstType"]:checked').value;

        if (amount <= 0 || gstRate <= 0) {
            // Show empty state but don't error
            updateResults(0, 0, 0, 0, 0, 0, 0);
            return;
        }

        let originalAmount, gstAmount, totalAmount;

        if (gstType === 'exclusive') {
            originalAmount = amount;
            gstAmount = (amount * gstRate) / 100;
            totalAmount = originalAmount + gstAmount;
        } else {
            totalAmount = amount;
            originalAmount = (amount * 100) / (100 + gstRate);
            gstAmount = totalAmount - originalAmount;
        }

        // Calculate CGST, SGST, IGST
        const cgstAmount = gstAmount / 2;
        const sgstAmount = gstAmount / 2;
        const igstAmount = gstAmount;

        // Update UI
        updateResults(originalAmount, gstAmount, totalAmount, cgstAmount, sgstAmount, igstAmount, gstRate);

        // Add to history
        addToHistory({
            amount: originalAmount,
            gstRate: gstRate,
            gstAmount: gstAmount,
            totalAmount: totalAmount,
            gstType: gstType,
            timestamp: new Date().toISOString()
        });
    }

    function updateResults(original, gst, total, cgst, sgst, igst, rate) {
        // Format numbers with commas
        originalAmountEl.textContent = formatINR(original);
        gstAmountEl.textContent = formatINR(gst);
        totalAmountEl.textContent = formatINR(total);

        cgstAmountEl.textContent = formatINR(cgst);
        sgstAmountEl.textContent = formatINR(sgst);
        igstAmountEl.textContent = formatINR(igst);

        cgstPercentEl.textContent = `(${(rate / 2).toFixed(1)}%)`;
        sgstPercentEl.textContent = `(${(rate / 2).toFixed(1)}%)`;
        igstPercentEl.textContent = `(${rate}%)`;

        // Update progress bars
        const totalGst = gst || 1;
        document.querySelectorAll('.bg-blue-600').forEach(bar => bar.style.width = `${(cgst / totalGst) * 100}%`);
        document.querySelectorAll('.bg-green-600').forEach(bar => bar.style.width = `${(sgst / totalGst) * 100}%`);
        document.querySelectorAll('.bg-purple-600').forEach(bar => bar.style.width = `100%`);
    }

    function formatINR(amount) {
        return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function resetForm() {
        amountInput.value = '1000';
        gstRateInput.value = '18';
        document.querySelector('input[value="exclusive"]').checked = true;
        calculateGST();
        showToast('Form reset to default values', 'info');
    }

    function addToHistory(calc) {
        calculationHistory.unshift(calc);

        if (calculationHistory.length > 15) {
            calculationHistory = calculationHistory.slice(0, 15);
        }

        localStorage.setItem('gstHistory', JSON.stringify(calculationHistory));
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-calculator text-4xl mb-3 opacity-30"></i>
                            <p>No calculations yet</p>
                            <p class="text-sm">Your history will appear here</p>
                        </div>
                    `;
            return;
        }

        historyList.innerHTML = '';

        calculationHistory.forEach((calc, index) => {
            const date = new Date(calc.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = date.toLocaleDateString();

            const historyItem = document.createElement('div');
            historyItem.className = 'history-item bg-gray-50 rounded-xl p-4';
            historyItem.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-bold text-gray-800">${formatINR(calc.totalAmount)}</p>
                                <p class="text-sm text-gray-600">
                                    ${calc.gstType === 'exclusive' ? 'Exclusive' : 'Inclusive'} | ${calc.gstRate}% GST
                                </p>
                                <p class="text-xs text-gray-400 mt-1">
                                    <i class="far fa-clock mr-1"></i> ${dateString} ${timeString}
                                </p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="reuseCalculation(${index})" class="text-blue-500 hover:text-blue-700 text-sm" title="Use this calculation">
                                    <i class="fas fa-redo-alt"></i>
                                </button>
                                <button onclick="copyToClipboard(${index})" class="text-green-500 hover:text-green-700 text-sm" title="Copy to clipboard">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;

            historyList.appendChild(historyItem);
        });
    }

    // Make functions global
    window.reuseCalculation = function (index) {
        const calc = calculationHistory[index];
        amountInput.value = calc.gstType === 'exclusive' ? calc.amount : calc.totalAmount;
        gstRateInput.value = calc.gstRate;

        document.querySelector(`input[value="${calc.gstType}"]`).checked = true;

        calculateGST();
        showToast('Calculation loaded', 'success');
    };

    window.copyToClipboard = function (index) {
        const calc = calculationHistory[index];
        const text = `GST Calculation Results:
Amount: ${formatINR(calc.amount)}
GST Rate: ${calc.gstRate}%
GST Amount: ${formatINR(calc.gstAmount)}
Total Amount: ${formatINR(calc.totalAmount)}
Type: ${calc.gstType === 'exclusive' ? 'Exclusive' : 'Inclusive'}`;

        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    };

    function clearHistory() {
        if (calculationHistory.length === 0) {
            showToast('No history to clear', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all calculation history?')) {
            calculationHistory = [];
            localStorage.removeItem('gstHistory');
            updateHistoryDisplay();
            showToast('History cleared', 'info');
        }
    }

    function exportHistory() {
        if (calculationHistory.length === 0) {
            showToast('No history to export', 'warning');
            return;
        }

        let csv = 'Date,Time,Amount,GST Rate,GST Amount,Total Amount,Type\n';

        calculationHistory.forEach(calc => {
            const date = new Date(calc.timestamp);
            const row = [
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                calc.amount.toFixed(2),
                calc.gstRate + '%',
                calc.gstAmount.toFixed(2),
                calc.totalAmount.toFixed(2),
                calc.gstType
            ].join(',');
            csv += row + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gst_history_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();

        showToast('History exported successfully', 'success');
    }

    function exportToPDF() {
        const element = document.querySelector('.calculator-card');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `gst_calculation_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        showToast('Generating PDF...', 'info');

        html2pdf().from(element).set(opt).save().then(() => {
            showToast('PDF downloaded successfully!', 'success');
        });
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

        toast.className = `toast-message ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center`;
        toast.innerHTML = `
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-3"></i>
                    ${message}
                `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Share functions
    window.shareOnWhatsApp = function () {
        const text = 'Check out this free GST Calculator India - Calculate GST instantly with CGST/SGST/IGST breakdown';
        const url = window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    };

    window.shareOnFacebook = function () {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    window.shareOnTwitter = function () {
        const text = 'Advanced GST Calculator India - Free Online Tool';
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    window.shareOnLinkedIn = function () {
        const url = window.location.href;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    // Initial calculation
    calculateGST();
});
