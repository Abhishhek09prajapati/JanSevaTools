
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const loanAmountSlider = document.getElementById('loanAmount');
    const interestRateSlider = document.getElementById('interestRate');
    const loanTenureSlider = document.getElementById('loanTenure');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('results');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const printBtn = document.getElementById('printResults');
    const downloadBtn = document.getElementById('downloadPDF');

    // Value display elements
    const loanAmountValue = document.getElementById('loanAmountValue');
    const interestRateValue = document.getElementById('interestRateValue');
    const loanTenureValue = document.getElementById('loanTenureValue');

    // Result elements
    const monthlyEmiEl = document.getElementById('monthlyEmi');
    const totalInterestEl = document.getElementById('totalInterest');
    const totalPaymentEl = document.getElementById('totalPayment');
    const principalAmountEl = document.getElementById('principalAmount');
    const totalMonthsEl = document.getElementById('totalMonths');
    const yearlyBreakdownEl = document.getElementById('yearlyBreakdown');

    // Chart variable
    let amortizationChart = null;

    // Load history from localStorage
    let calculationHistory = JSON.parse(localStorage.getItem('emiCalculatorHistory')) || [];
    updateHistoryDisplay();

    // Quick amount buttons
    document.querySelectorAll('.quick-amount').forEach(btn => {
        btn.addEventListener('click', function () {
            const amount = this.getAttribute('data-amount');
            loanAmountSlider.value = amount;
            loanAmountValue.textContent = formatCurrency(amount);
            calculateEMI();
            showToast(`Amount set to ${formatCurrency(amount)}`, 'success');
        });
    });

    // Common loan type buttons
    document.querySelectorAll('.loan-type-btn').forEach(button => {
        button.addEventListener('click', function () {
            loanAmountSlider.value = this.getAttribute('data-amount');
            interestRateSlider.value = this.getAttribute('data-rate');
            loanTenureSlider.value = this.getAttribute('data-tenure');

            loanAmountValue.textContent = formatCurrency(loanAmountSlider.value);
            interestRateValue.textContent = `${interestRateSlider.value}%`;
            loanTenureValue.textContent = `${loanTenureSlider.value} Years`;

            calculateEMI();
            showToast('Loan type loaded successfully!', 'success');
        });
    });

    // Event Listeners
    calculateBtn.addEventListener('click', calculateEMI);
    clearHistoryBtn.addEventListener('click', clearHistory);
    printBtn.addEventListener('click', printResults);
    downloadBtn.addEventListener('click', downloadAsPDF);

    // Update slider value displays
    loanAmountSlider.addEventListener('input', function () {
        loanAmountValue.textContent = formatCurrency(this.value);
    });

    interestRateSlider.addEventListener('input', function () {
        interestRateValue.textContent = `${this.value}%`;
    });

    loanTenureSlider.addEventListener('input', function () {
        loanTenureValue.textContent = `${this.value} Years`;
    });

    // Keyboard support for sliders
    [loanAmountSlider, interestRateSlider, loanTenureSlider].forEach(slider => {
        slider.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                calculateEMI();
            }
        });
    });

    // Format currency function
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount).replace('₹', '₹');
    }

    // Calculate EMI function
    function calculateEMI() {
        try {
            const loanAmount = parseFloat(loanAmountSlider.value);
            const interestRate = parseFloat(interestRateSlider.value);
            const loanTenure = parseFloat(loanTenureSlider.value);

            // Validation
            if (loanAmount < 10000 || loanAmount > 50000000) {
                showToast('Please enter loan amount between ₹10,000 and ₹5 Crore', 'error');
                return;
            }

            if (interestRate < 1 || interestRate > 20) {
                showToast('Please enter interest rate between 1% and 20%', 'error');
                return;
            }

            if (loanTenure < 1 || loanTenure > 30) {
                showToast('Please enter loan tenure between 1 and 30 years', 'error');
                return;
            }

            // Calculate monthly interest rate
            const monthlyInterestRate = interestRate / 12 / 100;

            // Calculate number of monthly installments
            const numberOfMonths = loanTenure * 12;

            // Calculate EMI
            let emi;
            if (monthlyInterestRate === 0) {
                emi = loanAmount / numberOfMonths;
            } else {
                emi = loanAmount * monthlyInterestRate *
                    Math.pow(1 + monthlyInterestRate, numberOfMonths) /
                    (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
            }

            // Calculate total payment and interest
            const totalPayment = emi * numberOfMonths;
            const totalInterest = totalPayment - loanAmount;

            // Update UI
            monthlyEmiEl.textContent = formatCurrency(emi);
            totalInterestEl.textContent = formatCurrency(totalInterest);
            totalPaymentEl.textContent = formatCurrency(totalPayment);
            principalAmountEl.textContent = formatCurrency(loanAmount);
            totalMonthsEl.textContent = numberOfMonths;

            // Generate amortization schedule
            generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfMonths, emi);

            // Show results
            resultsSection.classList.remove('hidden');

            // Add to history
            addToHistory({
                loanAmount,
                interestRate,
                loanTenure,
                emi,
                totalInterest,
                totalPayment,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            showToast('Error calculating EMI', 'error');
            console.error(error);
        }
    }

    // Generate amortization schedule
    function generateAmortizationSchedule(principal, monthlyRate, months, emi) {
        let balance = principal;
        let yearlyData = [];
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;

        yearlyBreakdownEl.innerHTML = '';

        for (let month = 1; month <= months; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = emi - interestPayment;

            yearlyPrincipal += principalPayment;
            yearlyInterest += interestPayment;

            balance -= principalPayment;

            if (month % 12 === 0 || month === months) {
                const year = Math.ceil(month / 12);

                yearlyData.push({
                    year,
                    principalPaid: yearlyPrincipal,
                    interestPaid: yearlyInterest,
                    remainingBalance: balance > 0 ? balance : 0
                });

                // Add row to table
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-200 hover:bg-gray-100 transition';
                row.innerHTML = `
                            <td class="py-3 px-2 text-gray-700 font-medium">Year ${year}</td>
                            <td class="py-3 px-2 text-right text-green-600 font-medium">${formatCurrency(yearlyPrincipal)}</td>
                            <td class="py-3 px-2 text-right text-red-500 font-medium">${formatCurrency(yearlyInterest)}</td>
                            <td class="py-3 px-2 text-right text-indigo-600 font-medium">${formatCurrency(Math.max(0, balance))}</td>
                        `;
                yearlyBreakdownEl.appendChild(row);

                yearlyPrincipal = 0;
                yearlyInterest = 0;
            }
        }

        updateChart(yearlyData);
    }

    // Update chart
    function updateChart(yearlyData) {
        const ctx = document.getElementById('amortizationChart').getContext('2d');

        if (amortizationChart) {
            amortizationChart.destroy();
        }

        const years = yearlyData.map(data => `Y-${data.year}`);
        const principalData = yearlyData.map(data => data.principalPaid);
        const interestData = yearlyData.map(data => data.interestPaid);

        amortizationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Principal Paid',
                        data: principalData,
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Interest Paid',
                        data: interestData,
                        backgroundColor: 'rgba(244, 63, 94, 0.7)',
                        borderColor: 'rgba(244, 63, 94, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: {
                        stacked: true,
                        ticks: {
                            callback: function (value) {
                                return '₹' + (value / 100000).toFixed(1) + 'L';
                            }
                        }
                    }
                },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + formatCurrency(context.raw);
                            }
                        }
                    }
                }
            }
        });
    }

    // Add to history
    function addToHistory(calculation) {
        calculationHistory.unshift(calculation);

        if (calculationHistory.length > 10) {
            calculationHistory.pop();
        }

        localStorage.setItem('emiCalculatorHistory', JSON.stringify(calculationHistory));
        updateHistoryDisplay();
        showToast('Calculation saved to history', 'success');
    }

    // Update history display
    function updateHistoryDisplay() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-history text-4xl mb-3 opacity-50"></i>
                            <p>No calculations yet</p>
                        </div>
                    `;
            return;
        }

        historyList.innerHTML = '';

        calculationHistory.forEach((calc, index) => {
            const date = new Date(calc.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const item = document.createElement('div');
            item.className = 'history-item bg-gray-50 rounded-lg p-3 hover:shadow-md transition cursor-pointer';
            item.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div onclick="loadHistoryItem(${index})" class="flex-1">
                                <p class="font-medium text-indigo-600">${formatCurrency(calc.emi)}/month</p>
                                <p class="text-sm text-gray-600">${formatCurrency(calc.loanAmount)} @ ${calc.interestRate}%</p>
                                <p class="text-xs text-gray-500">${calc.loanTenure} years • ${timeString}</p>
                            </div>
                            <button onclick="removeHistoryItem(${index})" class="text-red-400 hover:text-red-600 p-1">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
            historyList.appendChild(item);
        });
    }

    // Load history item (make global)
    window.loadHistoryItem = function (index) {
        const calc = calculationHistory[index];
        if (calc) {
            loanAmountSlider.value = calc.loanAmount;
            interestRateSlider.value = calc.interestRate;
            loanTenureSlider.value = calc.loanTenure;

            loanAmountValue.textContent = formatCurrency(calc.loanAmount);
            interestRateValue.textContent = `${calc.interestRate}%`;
            loanTenureValue.textContent = `${calc.loanTenure} Years`;

            calculateEMI();
            showToast('Calculation loaded from history', 'success');
        }
    };

    // Remove history item
    window.removeHistoryItem = function (index) {
        calculationHistory.splice(index, 1);
        localStorage.setItem('emiCalculatorHistory', JSON.stringify(calculationHistory));
        updateHistoryDisplay();
        showToast('Item removed from history', 'info');
    };

    // Clear history
    function clearHistory() {
        if (calculationHistory.length > 0 && confirm('Are you sure you want to clear all history?')) {
            calculationHistory = [];
            localStorage.removeItem('emiCalculatorHistory');
            updateHistoryDisplay();
            showToast('History cleared', 'info');
        }
    }

    // Print results
    function printResults() {
        // Create a printable version
        const printContent = document.getElementById('results').cloneNode(true);
        const originalContent = document.getElementById('results');

        // Hide chart temporarily for better print quality
        const chart = printContent.querySelector('canvas');
        if (chart) {
            // Store chart data as image
            const chartImage = document.createElement('img');
            chartImage.src = chart.toDataURL();
            chartImage.style.width = '100%';
            chartImage.style.height = 'auto';
            chart.parentNode.replaceChild(chartImage, chart);
        }

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <html>
            <head>
                <title>Loan EMI Calculator Results</title>
                <style>
                    body { 
                        font-family: 'Poppins', Arial, sans-serif; 
                        padding: 30px;
                        background: white;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #4f46e5;
                    }
                    .print-header h1 {
                        color: #4f46e5;
                        font-size: 28px;
                        margin: 0;
                    }
                    .print-header p {
                        color: #666;
                        margin: 5px 0 0;
                    }
                    .summary-cards {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                        margin: 30px 0;
                    }
                    .card {
                        padding: 20px;
                        border-radius: 12px;
                        color: white;
                    }
                    .card.emi { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
                    .card.interest { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; }
                    .card.total { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
                    .card p { margin: 5px 0; }
                    .card .label { font-size: 14px; opacity: 0.9; }
                    .card .value { font-size: 24px; font-weight: bold; }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0;
                        font-size: 14px;
                    }
                    th { 
                        background: #4f46e5; 
                        color: white; 
                        padding: 12px;
                        text-align: left;
                    }
                    td { 
                        padding: 10px; 
                        border-bottom: 1px solid #ddd;
                    }
                    tr:nth-child(even) { background: #f9f9f9; }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                    .date-time {
                        color: #666;
                        font-size: 14px;
                        margin-top: 10px;
                    }
                    @media print {
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>📊 Loan EMI Calculation Report</h1>
                    <p class="date-time">Generated on: ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
                
                <div class="summary-cards">
                    <div class="card emi">
                        <p class="label">Monthly EMI</p>
                        <p class="value">${document.getElementById('monthlyEmi').textContent}</p>
                    </div>
                    <div class="card interest">
                        <p class="label">Total Interest</p>
                        <p class="value">${document.getElementById('totalInterest').textContent}</p>
                    </div>
                    <div class="card total">
                        <p class="label">Total Payment</p>
                        <p class="value">${document.getElementById('totalPayment').textContent}</p>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h3 style="color: #4f46e5; margin-bottom: 15px;">Loan Details</h3>
                    <table>
                        <tr>
                            <th>Loan Amount</th>
                            <th>Interest Rate</th>
                            <th>Loan Tenure</th>
                            <th>Total Months</th>
                        </tr>
                        <tr>
                            <td>${document.getElementById('principalAmount').textContent}</td>
                            <td>${interestRateSlider.value}% p.a.</td>
                            <td>${loanTenureSlider.value} Years</td>
                            <td>${loanTenureSlider.value * 12} Months</td>
                        </tr>
                    </table>
                </div>
                
                <div style="margin: 30px 0;">
                    <h3 style="color: #4f46e5; margin-bottom: 15px;">Yearly Payment Breakdown</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Principal Paid</th>
                                <th>Interest Paid</th>
                                <th>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generatePrintYearlyData()}
                        </tbody>
                    </table>
                </div>
                
                <div class="footer">
                    <p>Calculated using Smart CSC Tools - Advanced EMI Calculator</p>
                    <p>Visit us at: smartcsctools.com/loan-emi.html</p>
                </div>
            </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();

        // Print after a short delay to ensure content loads
        setTimeout(() => {
            printWindow.print();
            // Close after print dialog closes
            printWindow.onafterprint = () => printWindow.close();
        }, 500);

        showToast('Print window opened', 'success');
    }

    // Generate yearly data for print
    function generatePrintYearlyData() {
        const rows = document.querySelectorAll('#yearlyBreakdown tr');
        let html = '';
        rows.forEach(row => {
            if (row.querySelector('td')) {
                const cells = row.querySelectorAll('td');
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<td>${cell.textContent}</td>`;
                });
                html += '</tr>';
            }
        });
        return html || '<tr><td colspan="4" style="text-align: center;">No data available</td></tr>';
    }

    // Download as PDF
    function downloadAsPDF() {
        showToast('Preparing PDF...', 'info');

        // Create PDF content
        const pdfContent = `
        <html>
            <head>
                <title>Loan EMI Calculator Results</title>
                <style>
                    body { 
                        font-family: 'Poppins', Arial, sans-serif; 
                        padding: 40px;
                        background: white;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid #4f46e5;
                    }
                    .header h1 {
                        color: #4f46e5;
                        font-size: 32px;
                        margin: 0;
                    }
                    .header .subtitle {
                        color: #666;
                        margin-top: 10px;
                        font-size: 14px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                        margin: 30px 0;
                    }
                    .summary-card {
                        padding: 25px;
                        border-radius: 15px;
                        text-align: center;
                    }
                    .summary-card .label {
                        font-size: 16px;
                        margin-bottom: 10px;
                        opacity: 0.9;
                    }
                    .summary-card .value {
                        font-size: 28px;
                        font-weight: bold;
                    }
                    .details-table, .yearly-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    .details-table th, .yearly-table th {
                        background: #4f46e5;
                        color: white;
                        padding: 12px;
                        text-align: left;
                        font-weight: 500;
                    }
                    .details-table td, .yearly-table td {
                        padding: 10px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .yearly-table tr:last-child td {
                        border-bottom: none;
                    }
                    .yearly-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        border-top: 2px solid #eee;
                        padding-top: 20px;
                    }
                    .disclaimer {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666;
                    }
                    .watermark {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        opacity: 0.1;
                        font-size: 60px;
                        transform: rotate(-15deg);
                        pointer-events: none;
                    }
                </style>
            </head>
            <body>
                <div class="watermark">Smart CSC Tools</div>
                
                <div class="header">
                    <h1>📈 LOAN EMI CALCULATION REPORT</h1>
                    <div class="subtitle">
                        Generated on: ${new Date().toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                    </div>
                </div>
                
                <div class="summary-grid">
                    <div class="summary-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                        <div class="label">Monthly EMI</div>
                        <div class="value">${document.getElementById('monthlyEmi').textContent}</div>
                    </div>
                    <div class="summary-card" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                        <div class="label">Total Interest</div>
                        <div class="value">${document.getElementById('totalInterest').textContent}</div>
                    </div>
                    <div class="summary-card" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: white;">
                        <div class="label">Total Payment</div>
                        <div class="value">${document.getElementById('totalPayment').textContent}</div>
                    </div>
                </div>
                
                <h3 style="color: #4f46e5; margin: 30px 0 15px;">📋 Loan Details</h3>
                <table class="details-table">
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td><strong>Loan Amount</strong></td>
                        <td>${document.getElementById('principalAmount').textContent}</td>
                    </tr>
                    <tr>
                        <td><strong>Interest Rate</strong></td>
                        <td>${interestRateSlider.value}% per annum</td>
                    </tr>
                    <tr>
                        <td><strong>Loan Tenure</strong></td>
                        <td>${loanTenureSlider.value} Years (${loanTenureSlider.value * 12} Months)</td>
                    </tr>
                    <tr>
                        <td><strong>Monthly Interest Rate</strong></td>
                        <td>${(interestRateSlider.value / 12).toFixed(2)}%</td>
                    </tr>
                </table>
                
                <h3 style="color: #4f46e5; margin: 30px 0 15px;">📊 Yearly Payment Schedule</h3>
                <table class="yearly-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Principal Paid (₹)</th>
                            <th>Interest Paid (₹)</th>
                            <th>Remaining Balance (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generatePDFYearlyData()}
                    </tbody>
                </table>
                
                <div class="disclaimer">
                    <strong>⚠️ Important Notes:</strong><br>
                    • This is an approximate calculation based on the inputs provided.<br>
                    • Actual EMI may vary based on lender's terms and conditions.<br>
                    • The calculation assumes constant interest rate throughout the loan tenure.<br>
                    • Processing fees, prepayment charges, and other costs are not included.
                </div>
                
                <div class="footer">
                    <p>Generated by Smart CSC Tools - Advanced EMI Calculator</p>
                    <p>Visit us: https://smartcsctools.com/loan-emi.html</p>
                    <p style="margin-top: 10px;">© ${new Date().getFullYear()} Smart CSC Tools. All rights reserved.</p>
                </div>
            </body>
        </html>
    `;

        // Create a temporary iframe for PDF generation
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(pdfContent);
        iframeDoc.close();

        // Wait for content to load then print (save as PDF)
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            // Remove iframe after printing
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);

        showToast('PDF generator opened - Click Save in print dialog', 'success');
    }

    // Generate yearly data for PDF
    function generatePDFYearlyData() {
        const rows = document.querySelectorAll('#yearlyBreakdown tr');
        let html = '';

        if (rows.length === 0) {
            return '<tr><td colspan="4" style="text-align: center;">No data available</td></tr>';
        }

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 4) {
                html += '<tr>';
                html += `<td style="font-weight: 500;">${cells[0].textContent}</td>`;
                html += `<td style="color: #10b981;">${cells[1].textContent}</td>`;
                html += `<td style="color: #ef4444;">${cells[2].textContent}</td>`;
                html += `<td style="color: #4f46e5; font-weight: 500;">${cells[3].textContent}</td>`;
                html += '</tr>';
            }
        });

        return html;
    }

    // Attach event listeners (add these to your existing DOMContentLoaded event)
    printBtn.addEventListener('click', printResults);
    downloadBtn.addEventListener('click', downloadAsPDF);

    // Show toast
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

        toast.className = `toast-message ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`;
        toast.innerHTML = `
                    <i class="fas ${icons[type]} mr-3"></i>
                    ${message}
                `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Share functions
    window.shareOnWhatsApp = function () {
        const text = 'Check out this free EMI Calculator - Calculate your loan EMI instantly!';
        const url = window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    };

    window.shareOnFacebook = function () {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    window.shareOnTwitter = function () {
        const text = 'Free Online EMI Calculator - Calculate Home Loan, Car Loan & Personal Loan EMI';
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    window.copyToClipboard = function () {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy link', 'error');
        });
    };

    // Calculate on page load
    calculateEMI();
});
