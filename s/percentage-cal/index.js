
        // DOM Elements
        const calculateBtn = document.getElementById("calculateBtn");
        const resetBtn = document.getElementById("resetBtn");
        const saveBtn = document.getElementById("saveCalculation");
        const resultsDiv = document.getElementById("results");
        const stepExplanation = document.getElementById("stepExplanation");
        const stepList = document.getElementById("stepList");
        const resultsContainer = document.getElementById("resultsContainer");
        const formulaList = document.getElementById("formulaList");
        const examplesList = document.getElementById("examplesList");

        // Percentage type buttons
        const percentageBtns = document.querySelectorAll(".percentage-btn");

        // Input containers
        const basicInputs = document.getElementById("basicInputs");
        const increaseInputs = document.getElementById("increaseInputs");
        const decreaseInputs = document.getElementById("decreaseInputs");
        const percentageOfInputs = document.getElementById("percentageOfInputs");

        // Visualization containers
        const basicViz = document.getElementById("basicViz");
        const increaseViz = document.getElementById("increaseViz");
        const decreaseViz = document.getElementById("decreaseViz");
        const percentageOfViz = document.getElementById("percentageOfViz");

        // Input elements
        const basicPercentage = document.getElementById("basicPercentage");
        const basicNumber = document.getElementById("basicNumber");
        const increaseFrom = document.getElementById("increaseFrom");
        const increaseTo = document.getElementById("increaseTo");
        const decreaseFrom = document.getElementById("decreaseFrom");
        const decreaseTo = document.getElementById("decreaseTo");
        const partValue = document.getElementById("partValue");
        const wholeValue = document.getElementById("wholeValue");

        // Basic visualization elements
        const basicBar = document.getElementById("basicBar");
        const basicPercentageLabel = document.getElementById("basicPercentageLabel");
        const basicPercentageDisplay = document.getElementById("basicPercentageDisplay");
        const basicValueDisplay = document.getElementById("basicValueDisplay");

        // Increase visualization elements
        const originalBar = document.getElementById("originalBar");
        const increaseBar = document.getElementById("increaseBar");
        const originalValueLabel = document.getElementById("originalValueLabel");
        const newValueLabel = document.getElementById("newValueLabel");
        const increasePercentageLabel = document.getElementById("increasePercentageLabel");
        const originalValue = document.getElementById("originalValue");
        const increaseValue = document.getElementById("increaseValue");
        const newValue = document.getElementById("newValue");

        // Decrease visualization elements
        const decreaseOriginalBar = document.getElementById("decreaseOriginalBar");
        const decreaseBar = document.getElementById("decreaseBar");
        const decreaseOriginalLabel = document.getElementById("decreaseOriginalLabel");
        const decreaseNewLabel = document.getElementById("decreaseNewLabel");
        const decreasePercentageLabel = document.getElementById("decreasePercentageLabel");
        const decreaseOriginalValue = document.getElementById("decreaseOriginalValue");
        const decreaseAmount = document.getElementById("decreaseAmount");
        const decreaseNewValue = document.getElementById("decreaseNewValue");

        // Percentage of visualization elements
        const partBar = document.getElementById("partBar");
        const partLabel = document.getElementById("partLabel");
        const wholeLabel = document.getElementById("wholeLabel");
        const percentageOfLabel = document.getElementById("percentageOfLabel");
        const partDisplay = document.getElementById("partDisplay");
        const percentageOfDisplay = document.getElementById("percentageOfDisplay");

        let currentPercentageType = "basic";
        let savedCalculations = JSON.parse(localStorage.getItem('savedPercentages') || '[]');

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            attachEventListeners();
            updateInputVisibility();
            calculate();
            checkForSavedCalculations();
        });

        // Attach event listeners
        function attachEventListeners() {
            percentageBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    switchPercentageType(this.dataset.percentage);
                });
            });

            calculateBtn.addEventListener('click', calculate);
            resetBtn.addEventListener('click', resetCalculator);
            saveBtn.addEventListener('click', saveCalculation);

            // Auto-calculate on input
            document.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', calculate);
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'Enter') {
                    calculate();
                    showToast('Calculated!', 'success');
                }
                if (e.key === 'Escape') {
                    resetCalculator();
                }
            });

            // Scroll to top
            document.getElementById('scrollToTop').addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Switch percentage type
        function switchPercentageType(type) {
            percentageBtns.forEach(btn => {
                btn.classList.remove('active', 'border-indigo-500', 'text-indigo-700', 'bg-indigo-50');
                btn.classList.add('border-gray-200', 'text-gray-700', 'bg-white');
            });

            const activeBtn = Array.from(percentageBtns).find(btn => btn.dataset.percentage === type);
            if(activeBtn) {
                activeBtn.classList.add('active', 'border-indigo-500', 'text-white');
                activeBtn.classList.remove('border-gray-200', 'text-gray-700', 'bg-white');
            }

            currentPercentageType = type;
            updateInputVisibility();
            calculate();
        }

        // Update input visibility
        function updateInputVisibility() {
            basicInputs.classList.add('hidden');
            increaseInputs.classList.add('hidden');
            decreaseInputs.classList.add('hidden');
            percentageOfInputs.classList.add('hidden');

            basicViz.classList.add('hidden');
            increaseViz.classList.add('hidden');
            decreaseViz.classList.add('hidden');
            percentageOfViz.classList.add('hidden');

            switch(currentPercentageType) {
                case 'basic':
                    basicInputs.classList.remove('hidden');
                    basicViz.classList.remove('hidden');
                    break;
                case 'increase':
                    increaseInputs.classList.remove('hidden');
                    increaseViz.classList.remove('hidden');
                    break;
                case 'decrease':
                    decreaseInputs.classList.remove('hidden');
                    decreaseViz.classList.remove('hidden');
                    break;
                case 'percentageOf':
                    percentageOfInputs.classList.remove('hidden');
                    percentageOfViz.classList.remove('hidden');
                    break;
            }
        }

        // Calculate functions
        function calculateBasic(percentage, number) {
            const result = (percentage / 100) * number;

            // Update visualization
            const percentageWidth = Math.min(percentage, 100);
            basicBar.style.width = `${percentageWidth}%`;
            basicBar.querySelector('.bar-label').textContent = `${percentage}%`;
            basicPercentageLabel.textContent = `${percentage}%`;
            basicPercentageDisplay.textContent = `${percentage}%`;
            basicValueDisplay.textContent = result.toFixed(2);

            const steps = [
                `Step 1: Convert ${percentage}% to decimal: ${percentage} ÷ 100 = ${(percentage/100).toFixed(4)}`,
                `Step 2: Multiply decimal by ${number}: ${(percentage/100).toFixed(4)} × ${number} = ${result.toFixed(2)}`,
                `Result: ${percentage}% of ${number} = ${result.toFixed(2)}`
            ];

            return {
                results: [
                    { label: "Percentage", value: `${percentage}%`, color: "text-indigo-600" },
                    { label: "Number", value: number, color: "text-blue-600" },
                    { label: "Result", value: result.toFixed(2), color: "text-green-600" },
                    { label: "Decimal", value: (percentage/100).toFixed(4), color: "text-purple-600" }
                ],
                steps,
                formulas: [
                    "Formula: X% of Y = (X/100) × Y",
                    "Step 1: Convert percentage to decimal: X ÷ 100",
                    "Step 2: Multiply decimal by Y"
                ],
                examples: [
                    "💰 Discount: 20% off ₹1500 = ₹300 savings",
                    "🍽️ Tip: 15% tip on ₹800 bill = ₹120",
                    "📊 Tax: 18% GST on ₹2000 = ₹360",
                    "📈 Commission: 5% on ₹10,000 sale = ₹500"
                ]
            };
        }

        function calculateIncrease(from, to) {
            const increase = to - from;
            const percentage = (increase / from) * 100;

            // Update visualization
            const originalWidth = (from / to) * 100;
            const increaseWidth = 100 - originalWidth;

            originalBar.style.width = `${originalWidth}%`;
            increaseBar.style.width = `${increaseWidth}%`;
            increaseBar.querySelector('.bar-label').textContent = `+${percentage.toFixed(1)}%`;

            originalValueLabel.textContent = from;
            newValueLabel.textContent = to;
            increasePercentageLabel.textContent = `+${percentage.toFixed(1)}%`;

            originalValue.textContent = from;
            increaseValue.textContent = increase.toFixed(2);
            newValue.textContent = to;

            const steps = [
                `Step 1: Calculate increase: ${to} - ${from} = ${increase.toFixed(2)}`,
                `Step 2: Divide increase by original: ${increase.toFixed(2)} ÷ ${from} = ${(increase/from).toFixed(4)}`,
                `Step 3: Convert to percentage: ${(increase/from).toFixed(4)} × 100 = ${percentage.toFixed(2)}%`,
                `Result: ${percentage.toFixed(2)}% increase from ${from} to ${to}`
            ];

            return {
                results: [
                    { label: "Original", value: from, color: "text-blue-600" },
                    { label: "New", value: to, color: "text-purple-600" },
                    { label: "Increase", value: increase.toFixed(2), color: "text-green-600" },
                    { label: "Increase %", value: `${percentage.toFixed(2)}%`, color: "text-indigo-600" }
                ],
                steps,
                formulas: [
                    "Formula: % Increase = [(New - Original) ÷ Original] × 100",
                    "Step 1: Find the difference (New - Original)",
                    "Step 2: Divide difference by Original",
                    "Step 3: Multiply by 100"
                ],
                examples: [
                    "📈 Salary: ₹50,000 to ₹55,000 = 10% increase",
                    "👥 Population: 1,000 to 1,200 = 20% increase",
                    "📊 Sales: ₹10,000 to ₹12,500 = 25% increase",
                    "🏠 Rent: ₹15,000 to ₹16,500 = 10% increase"
                ]
            };
        }

        function calculateDecrease(from, to) {
            const decrease = from - to;
            const percentage = (decrease / from) * 100;

            // Update visualization
            const remainingWidth = (to / from) * 100;
            const decreaseWidth = 100 - remainingWidth;

            decreaseOriginalBar.style.width = `${remainingWidth}%`;
            decreaseBar.style.width = `${decreaseWidth}%`;
            decreaseBar.querySelector('.bar-label').textContent = `-${percentage.toFixed(1)}%`;

            decreaseOriginalLabel.textContent = from;
            decreaseNewLabel.textContent = to;
            decreasePercentageLabel.textContent = `-${percentage.toFixed(1)}%`;

            decreaseOriginalValue.textContent = from;
            decreaseAmount.textContent = decrease.toFixed(2);
            decreaseNewValue.textContent = to;

            const steps = [
                `Step 1: Calculate decrease: ${from} - ${to} = ${decrease.toFixed(2)}`,
                `Step 2: Divide decrease by original: ${decrease.toFixed(2)} ÷ ${from} = ${(decrease/from).toFixed(4)}`,
                `Step 3: Convert to percentage: ${(decrease/from).toFixed(4)} × 100 = ${percentage.toFixed(2)}%`,
                `Result: ${percentage.toFixed(2)}% decrease from ${from} to ${to}`
            ];

            return {
                results: [
                    { label: "Original", value: from, color: "text-red-600" },
                    { label: "New", value: to, color: "text-purple-600" },
                    { label: "Decrease", value: decrease.toFixed(2), color: "text-gray-600" },
                    { label: "Decrease %", value: `${percentage.toFixed(2)}%`, color: "text-indigo-600" }
                ],
                steps,
                formulas: [
                    "Formula: % Decrease = [(Original - New) ÷ Original] × 100",
                    "Step 1: Find the decrease (Original - New)",
                    "Step 2: Divide decrease by Original",
                    "Step 3: Multiply by 100"
                ],
                examples: [
                    "🏷️ Discount: ₹200 to ₹150 = 25% off",
                    "⚖️ Weight: 80kg to 72kg = 10% loss",
                    "📉 Stock: ₹500 to ₹400 = 20% drop",
                    "🌡️ Temperature: 30°C to 24°C = 20% decrease"
                ]
            };
        }

        function calculatePercentageOf(part, whole) {
            const percentage = (part / whole) * 100;

            // Update visualization
            const percentageWidth = Math.min(percentage, 100);
            partBar.style.width = `${percentageWidth}%`;
            partBar.querySelector('.bar-label').textContent = `${percentage.toFixed(1)}%`;

            partLabel.textContent = part;
            wholeLabel.textContent = whole;
            percentageOfLabel.textContent = `${percentage.toFixed(1)}%`;

            partDisplay.textContent = part;
            percentageOfDisplay.textContent = `${percentage.toFixed(2)}%`;

            const steps = [
                `Step 1: Divide part by whole: ${part} ÷ ${whole} = ${(part/whole).toFixed(4)}`,
                `Step 2: Convert to percentage: ${(part/whole).toFixed(4)} × 100 = ${percentage.toFixed(2)}%`,
                `Result: ${part} is ${percentage.toFixed(2)}% of ${whole}`
            ];

            return {
                results: [
                    { label: "Part", value: part, color: "text-indigo-600" },
                    { label: "Whole", value: whole, color: "text-blue-600" },
                    { label: "Percentage", value: `${percentage.toFixed(2)}%`, color: "text-green-600" },
                    { label: "Decimal", value: (part/whole).toFixed(4), color: "text-purple-600" }
                ],
                steps,
                formulas: [
                    "Formula: Percentage = (Part ÷ Whole) × 100",
                    "Step 1: Divide part by whole",
                    "Step 2: Multiply by 100"
                ],
                examples: [
                    "📝 Test Score: 45 out of 50 = 90%",
                    "💰 Budget: ₹300 spent of ₹1000 = 30%",
                    "📚 Progress: 75 pages of 300 = 25% complete",
                    "👥 Attendance: 45 out of 60 students = 75%"
                ]
            };
        }

        // Main calculate function
        function calculate() {
            let result;

            switch(currentPercentageType) {
                case 'basic':
                    const perc = parseFloat(basicPercentage.value) || 0;
                    const num = parseFloat(basicNumber.value) || 0;
                    if(perc < 0 || num < 0) {
                        showToast('Please enter positive numbers', 'error');
                        return;
                    }
                    result = calculateBasic(perc, num);
                    break;
                case 'increase':
                    const fromInc = parseFloat(increaseFrom.value) || 0;
                    const toInc = parseFloat(increaseTo.value) || 0;
                    if(fromInc <= 0) {
                        showToast('Original value must be greater than 0', 'error');
                        return;
                    }
                    result = calculateIncrease(fromInc, toInc);
                    break;
                case 'decrease':
                    const fromDec = parseFloat(decreaseFrom.value) || 0;
                    const toDec = parseFloat(decreaseTo.value) || 0;
                    if(fromDec <= 0) {
                        showToast('Original value must be greater than 0', 'error');
                        return;
                    }
                    result = calculateDecrease(fromDec, toDec);
                    break;
                case 'percentageOf':
                    const part = parseFloat(partValue.value) || 0;
                    const whole = parseFloat(wholeValue.value) || 0;
                    if(whole <= 0) {
                        showToast('Whole value must be greater than 0', 'error');
                        return;
                    }
                    result = calculatePercentageOf(part, whole);
                    break;
            }

            displayResults(result);
        }

        // Display results
        function displayResults(result) {
            // Update results container
            resultsContainer.innerHTML = '';
            result.results.forEach(item => {
                const div = document.createElement('div');
                div.className = `stat-card p-4`;
                div.innerHTML = `
                    <p class="text-gray-600 text-sm mb-1">${item.label}</p>
                    <p class="text-2xl font-bold ${item.color}">${item.value}</p>
                `;
                resultsContainer.appendChild(div);
            });

            // Update steps
            stepList.innerHTML = '';
            result.steps.forEach((step, index) => {
                const div = document.createElement('div');
                div.className = 'flex items-start space-x-3';
                div.innerHTML = `
                    <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">${index + 1}</span>
                    <p class="text-gray-700">${step}</p>
                `;
                stepList.appendChild(div);
            });

            // Update formulas
            formulaList.innerHTML = '';
            result.formulas.forEach(formula => {
                const div = document.createElement('div');
                div.className = 'formula-box';
                div.textContent = formula;
                formulaList.appendChild(div);
            });

            // Update examples
            examplesList.innerHTML = '';
            result.examples.forEach(example => {
                const div = document.createElement('div');
                div.className = 'flex items-center space-x-2 text-sm border-b border-gray-100 pb-2';
                div.innerHTML = `
                    <i class="fas fa-check-circle text-green-500 text-xs"></i>
                    <span>${example}</span>
                `;
                examplesList.appendChild(div);
            });

            // Show results with animation
            resultsDiv.classList.remove('hidden');
            resultsDiv.classList.add('glow');
            setTimeout(() => resultsDiv.classList.remove('glow'), 1000);
        }

        // Reset calculator
        function resetCalculator() {
            basicPercentage.value = "20";
            basicNumber.value = "150";
            increaseFrom.value = "100";
            increaseTo.value = "150";
            decreaseFrom.value = "200";
            decreaseTo.value = "150";
            partValue.value = "30";
            wholeValue.value = "150";

            switchPercentageType('basic');
            showToast('Calculator reset to default values', 'info');
        }

        // Save calculation
        function saveCalculation() {
            const calculation = {
                type: currentPercentageType,
                inputs: {},
                timestamp: new Date().toISOString(),
                id: Date.now()
            };

            switch(currentPercentageType) {
                case 'basic':
                    calculation.inputs = {
                        percentage: basicPercentage.value,
                        number: basicNumber.value
                    };
                    break;
                case 'increase':
                    calculation.inputs = {
                        from: increaseFrom.value,
                        to: increaseTo.value
                    };
                    break;
                case 'decrease':
                    calculation.inputs = {
                        from: decreaseFrom.value,
                        to: decreaseTo.value
                    };
                    break;
                case 'percentageOf':
                    calculation.inputs = {
                        part: partValue.value,
                        whole: wholeValue.value
                    };
                    break;
            }

            savedCalculations.push(calculation);
            if(savedCalculations.length > 10) {
                savedCalculations = savedCalculations.slice(-10);
            }
            localStorage.setItem('savedPercentages', JSON.stringify(savedCalculations));
            showToast('Calculation saved!', 'success');
        }

        // Check for saved calculations
        function checkForSavedCalculations() {
            if(savedCalculations.length > 0) {
                showToast(`You have ${savedCalculations.length} saved calculations`, 'info');
            }
        }

        // Toast notification
        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            
            const colors = {
                success: 'bg-gradient-to-r from-green-500 to-green-600',
                error: 'bg-gradient-to-r from-red-500 to-red-600',
                info: 'bg-gradient-to-r from-blue-500 to-blue-600',
                warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            };
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                info: 'fa-info-circle',
                warning: 'fa-exclamation-triangle'
            };
            
            toast.className = `toast-message ${colors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center`;
            toast.innerHTML = `
                <i class="fas ${icons[type]} mr-3 text-xl"></i>
                <span class="font-medium">${message}</span>
            `;
            
            container.appendChild(toast);
            
            setTimeout(() => toast.remove(), 3000);
        }

        // Share functions
        window.shareOnWhatsApp = function() {
            const text = 'Check out this free Percentage Calculator - Calculate percentages instantly';
            const url = window.location.href;
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            showToast('Opening WhatsApp...', 'info');
        };

        window.shareOnFacebook = function() {
            const url = window.location.href;
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            showToast('Opening Facebook...', 'info');
        };

        window.shareOnTwitter = function() {
            const text = 'Free Percentage Calculator - Calculate percentages with step-by-step solutions';
            const url = window.location.href;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            showToast('Opening Twitter...', 'info');
        };

        window.copyToClipboard = function() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Failed to copy link', 'error');
            });
        };

        // Initialize with calculation
        calculate();
