
// Language Dictionary
const translations = {
    en: {
        'form-title': 'Exam Details',
        'label-institution': 'Institution Name',
        'label-exam-title': 'Exam Title',
        'label-class': 'Class',
        'label-subject': 'Subject',
        'label-time': 'Time',
        'label-marks': 'Total Marks',
        'mcq-title': 'MCQ Questions',
        'descriptive-title': 'Descriptive Questions',
        'add-mcq-btn': 'Add MCQ',
        'add-desc-btn': 'Add Question',
        'print-btn': 'Print',
        'download-pdf': 'PDF',
        'question': 'Question',
        'option': 'Option',
        'marks': 'Marks',
        'type-question': 'Type question...',
        'type-option': 'Type option...',
        'remove': 'Remove',
        'add-option': '+ Add Option',
        'no-mcq': 'No MCQ questions added',
        'no-descriptive': 'No descriptive questions added',
        'total-questions': 'Total Questions',
        'max-marks': 'Max Marks',
        'instructions': 'GENERAL INSTRUCTIONS:',
        'instruction-line1': '1. All questions are compulsory.',
        'instruction-line2': '2. Marks for each question are indicated against it.',
        'instruction-line3': '3. Write your answers in the space provided.',
        'roll-no': 'Roll No.',
        'date': 'Date',
        'signature': 'Signature',
        'section-a': 'SECTION - A (MCQ)',
        'section-b': 'SECTION - B (Descriptive)'
    },
    hi: {
        'form-title': 'परीक्षा विवरण',
        'label-institution': 'संस्थान का नाम',
        'label-exam-title': 'परीक्षा शीर्षक',
        'label-class': 'कक्षा',
        'label-subject': 'विषय',
        'label-time': 'समय',
        'label-marks': 'कुल अंक',
        'mcq-title': 'बहुविकल्पीय प्रश्न',
        'descriptive-title': 'वर्णनात्मक प्रश्न',
        'add-mcq-btn': 'प्रश्न जोड़ें',
        'add-desc-btn': 'प्रश्न जोड़ें',
        'print-btn': 'प्रिंट',
        'download-pdf': 'पीडीएफ',
        'question': 'प्रश्न',
        'option': 'विकल्प',
        'marks': 'अंक',
        'type-question': 'प्रश्न लिखें...',
        'type-option': 'विकल्प लिखें...',
        'remove': 'हटाएं',
        'add-option': '+ विकल्प जोड़ें',
        'no-mcq': 'कोई प्रश्न नहीं',
        'no-descriptive': 'कोई प्रश्न नहीं',
        'total-questions': 'कुल प्रश्न',
        'max-marks': 'कुल अंक',
        'instructions': 'सामान्य निर्देश:',
        'instruction-line1': '1. सभी प्रश्न अनिवार्य हैं।',
        'instruction-line2': '2. प्रत्येक प्रश्न के अंक उसके सामने अंकित हैं।',
        'instruction-line3': '3. अपने उत्तर निर्धारित स्थान पर लिखें।',
        'roll-no': 'रोल नंबर',
        'date': 'दिनांक',
        'signature': 'हस्ताक्षर',
        'section-a': 'खण्ड - अ (बहुविकल्पीय)',
        'section-b': 'खण्ड - ब (वर्णनात्मक)'
    }
};

let currentLang = 'en';
let currentNumberFormat = 'normal';
let instructionsHidden = false;
let mcqQuestions = [];
let descriptiveQuestions = [];
let nextMcqId = 1;
let nextDescId = 1;

function toHindiNumber(num) {
    const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, d => hindiDigits[parseInt(d)]);
}

function formatNumber(num) {
    return currentNumberFormat === 'hindi' ? toHindiNumber(num) : num;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    Object.keys(translations[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.textContent = translations[lang][key];
    });

    renderMCQList();
    renderDescriptiveList();
    updatePreview();
}

function switchNumberFormat(format) {
    currentNumberFormat = format;
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.num === format);
    });
    renderMCQList();
    renderDescriptiveList();
    updatePreview();
}

function toggleInstructions() {
    const checkbox = document.getElementById('hide-instructions');
    instructionsHidden = checkbox.checked;
    const label = document.getElementById('instructions-toggle-label');
    label.textContent = instructionsHidden ? 'Show' : 'Hide';
    updatePreview();
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    answer.classList.toggle('show');
    icon.style.transform = answer.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
}

function addMCQ() {
    mcqQuestions.push({
        id: nextMcqId++,
        text: '',
        marks: '1',
        options: ['', '', '', '']
    });
    renderMCQList();
    updatePreview();
    showToast('MCQ question added', 'success');
}

function renderMCQList() {
    const container = document.getElementById('mcq-list');
    if (mcqQuestions.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-400 text-sm py-4">${translations[currentLang]['no-mcq']}</div>`;
        return;
    }

    container.innerHTML = mcqQuestions.map((q, idx) => `
                <div class="border rounded-lg p-3 question-item bg-white">
                    <div class="flex justify-between items-start gap-2">
                        <div class="flex-1">
                            <textarea class="w-full p-2 border rounded-lg text-sm question-input" rows="2" 
                                onchange="updateMCQ(${q.id}, 'text', this.value)"
                                placeholder="${translations[currentLang]['type-question']}">${escapeHtml(q.text)}</textarea>
                        </div>
                        <div class="w-20">
                            <input type="text" class="w-full p-2 border rounded-lg text-sm" value="${q.marks}" 
                                onchange="updateMCQ(${q.id}, 'marks', this.value)" placeholder="Marks">
                        </div>
                        <button onclick="removeMCQ(${q.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="mt-2 space-y-1">
                        ${q.options.map((opt, optIdx) => `
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-gray-500 w-5">${String.fromCharCode(97 + optIdx)}.</span>
                                <input type="text" class="flex-1 p-1.5 border rounded-lg text-sm option-input" 
                                    value="${escapeHtml(opt)}" 
                                    placeholder="${translations[currentLang]['type-option']}"
                                    onchange="updateMCQ(${q.id}, 'option${optIdx}', this.value)">
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="addOptionToMCQ(${q.id})" class="text-xs text-blue-500 hover:text-blue-700 mt-2">
                        <i class="fas fa-plus mr-1"></i> ${translations[currentLang]['add-option']}
                    </button>
                </div>
            `).join('');
}

function updateMCQ(id, field, value) {
    const q = mcqQuestions.find(q => q.id === id);
    if (!q) return;

    if (field === 'text') q.text = value;
    else if (field === 'marks') q.marks = value;
    else if (field.startsWith('option')) {
        const optIdx = parseInt(field.replace('option', ''));
        q.options[optIdx] = value;
    }
    updatePreview();
}

function addOptionToMCQ(id) {
    const q = mcqQuestions.find(q => q.id === id);
    if (q) {
        q.options.push('');
        renderMCQList();
        updatePreview();
    }
}

function removeMCQ(id) {
    mcqQuestions = mcqQuestions.filter(q => q.id !== id);
    renderMCQList();
    updatePreview();
    showToast('MCQ removed', 'info');
}

function addDescriptive() {
    descriptiveQuestions.push({
        id: nextDescId++,
        text: '',
        marks: '5'
    });
    renderDescriptiveList();
    updatePreview();
    showToast('Descriptive question added', 'success');
}

function renderDescriptiveList() {
    const container = document.getElementById('descriptive-list');
    if (descriptiveQuestions.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-400 text-sm py-4">${translations[currentLang]['no-descriptive']}</div>`;
        return;
    }

    container.innerHTML = descriptiveQuestions.map((q, idx) => `
                <div class="border rounded-lg p-3 question-item bg-white">
                    <div class="flex justify-between items-start gap-2">
                        <div class="flex-1">
                            <textarea class="w-full p-2 border rounded-lg text-sm question-input" rows="2" 
                                onchange="updateDescriptive(${q.id}, 'text', this.value)"
                                placeholder="${translations[currentLang]['type-question']}">${escapeHtml(q.text)}</textarea>
                        </div>
                        <div class="w-20">
                            <input type="text" class="w-full p-2 border rounded-lg text-sm" value="${q.marks}" 
                                onchange="updateDescriptive(${q.id}, 'marks', this.value)" placeholder="Marks">
                        </div>
                        <button onclick="removeDescriptive(${q.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
}

function updateDescriptive(id, field, value) {
    const q = descriptiveQuestions.find(q => q.id === id);
    if (q) q[field] = value;
    updatePreview();
}

function removeDescriptive(id) {
    descriptiveQuestions = descriptiveQuestions.filter(q => q.id !== id);
    renderDescriptiveList();
    updatePreview();
    showToast('Descriptive question removed', 'info');
}

function generatePaperHTML() {
    const institution = document.getElementById('institution').value || '_________________';
    const examTitle = document.getElementById('exam-title').value || '_________________';
    const className = document.getElementById('class').value || '______';
    const subject = document.getElementById('subject').value || '______';
    const time = document.getElementById('time').value || '______';
    const marks = document.getElementById('marks').value || '______';
    const headerFont = document.getElementById('header-font').value;
    const questionFont = document.getElementById('question-font').value;

    const today = new Date().toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-IN');
    let totalMcqMarks = 0, totalDescMarks = 0;

    let mcqHtml = '';
    if (mcqQuestions.length > 0) {
        mcqHtml = `
                    <div class="question-section" style="margin-bottom: 12px;">
                        <h3 class="font-bold border-b border-gray-400 pb-1 mb-2" style="font-size: ${parseInt(headerFont) * 0.6}px">
                            ${translations[currentLang]['section-a']}
                        </h3>
                        ${mcqQuestions.map((q, idx) => {
            totalMcqMarks += parseInt(q.marks) || 0;
            return `
                                <div style="margin-bottom: 12px;">
                                    <p class="font-medium" style="font-size: ${questionFont}px; line-height: 1.3; margin-bottom: 3px;">
                                        <span class="font-bold">${formatNumber(idx + 1)}.</span> 
                                        ${escapeHtml(q.text) || '_________________________'}
                                        <span class="text-gray-500 ml-2" style="font-size: ${parseInt(questionFont) - 1}px">[${q.marks}]</span>
                                    </p>
                                    <div class="mcq-option" style="margin-left: 20px;">
                                        ${q.options.map((opt, optIdx) => opt ? `
                                            <p style="font-size: ${parseInt(questionFont) - 1}px; margin: 2px 0;">
                                                ${String.fromCharCode(97 + optIdx)}. ${escapeHtml(opt)}
                                            </p>
                                        ` : '').join('')}
                                    </div>
                                </div>
                            `;
        }).join('')}
                    </div>
                `;
    }

    let descHtml = '';
    if (descriptiveQuestions.length > 0) {
        descHtml = `
                    <div class="question-section" style="margin-bottom: 12px;">
                        <h3 class="font-bold border-b border-gray-400 pb-1 mb-2" style="font-size: ${parseInt(headerFont) * 0.6}px">
                            ${translations[currentLang]['section-b']}
                        </h3>
                        ${descriptiveQuestions.map((q, idx) => {
            totalDescMarks += parseInt(q.marks) || 0;
            return `
                                <div style="margin-bottom: 18px;">
                                    <p class="font-medium" style="font-size: ${questionFont}px; line-height: 1.3; margin-bottom: 5px;">
                                        <span class="font-bold">${formatNumber(mcqQuestions.length + idx + 1)}.</span> 
                                        ${escapeHtml(q.text) || '_________________________'}
                                        <span class="text-gray-500 ml-2" style="font-size: ${parseInt(questionFont) - 1}px">[${q.marks}]</span>
                                    </p>
                                    <div class="answer-space" style="min-height: 50px; border-bottom: 1px dotted #9ca3af;"></div>
                                </div>
                            `;
        }).join('')}
                    </div>
                `;
    }

    const totalQuestions = mcqQuestions.length + descriptiveQuestions.length;
    const totalPaperMarks = totalMcqMarks + totalDescMarks;

    const instructionsHtml = !instructionsHidden ? `
                <div class="instructions-box">
                    <h4 class="font-bold mb-1" style="font-size: ${parseInt(questionFont)}px">${translations[currentLang]['instructions']}</h4>
                    <p style="margin: 0; font-size: ${parseInt(questionFont) - 1}px;">${translations[currentLang]['instruction-line1']}</p>
                    <p style="margin: 0; font-size: ${parseInt(questionFont) - 1}px;">${translations[currentLang]['instruction-line2']}</p>
                    <p style="margin: 0; font-size: ${parseInt(questionFont) - 1}px;">${translations[currentLang]['instruction-line3']}</p>
                </div>
            ` : '';

    return `
                <div class="fixed-header">
                    <div class="text-center">
                        <h2 class="font-bold uppercase" style="font-size: ${headerFont}px; margin-bottom: 3px;">${escapeHtml(institution)}</h2>
                        <h3 class="font-semibold" style="font-size: ${parseInt(headerFont) * 0.65}px; margin-bottom: 5px;">${escapeHtml(examTitle)}</h3>
                        
                        <div class="flex justify-between text-xs border-t border-b border-gray-400 py-1 mt-1" style="font-size: ${parseInt(questionFont) - 1}px;">
                            <span><strong>${translations[currentLang]['label-class']}:</strong> ${escapeHtml(className)}</span>
                            <span><strong>${translations[currentLang]['label-subject']}:</strong> ${escapeHtml(subject)}</span>
                            <span><strong>${translations[currentLang]['label-time']}:</strong> ${escapeHtml(time)}</span>
                            <span><strong>${translations[currentLang]['max-marks']}:</strong> ${escapeHtml(marks)}</span>
                        </div>
                        
                        <div class="flex justify-between mt-1" style="font-size: ${parseInt(questionFont) - 1}px;">
                            <span><strong>${translations[currentLang]['roll-no']}:</strong> _______________</span>
                            <span><strong>${translations[currentLang]['date']}:</strong> ${today}</span>
                        </div>
                    </div>
                    
                    ${instructionsHtml}
                </div>
                
                ${mcqHtml}
                ${descHtml}
                
                ${(mcqQuestions.length === 0 && descriptiveQuestions.length === 0) ?
            `<div class="text-center text-gray-400 py-8" style="font-size: ${questionFont}px;">Add questions from the left panel</div>` : ''
        }
                
                <div class="flex justify-between mt-4 pt-2 border-t border-gray-400" style="font-size: ${parseInt(questionFont) - 1}px;">
                    <div>
                        <p><strong>${translations[currentLang]['total-questions']}:</strong> ${totalQuestions}</p>
                        <p><strong>${translations[currentLang]['max-marks']}:</strong> ${totalPaperMarks}</p>
                    </div>
                    <div class="text-center">
                        <p>${translations[currentLang]['signature']}</p>
                        <div style="border-top: 1px solid #9ca3af; width: 100px; margin-top: 15px;"></div>
                    </div>
                </div>
            `;
}

function updatePreview() {
    const html = generatePaperHTML();
    document.getElementById('paper-content').innerHTML = html;

    if (currentLang === 'hi') {
        document.querySelectorAll('.a4-content *').forEach(el => {
            if (el.classList) el.classList.add('hindi-font');
        });
    }
}

function printPaper() {
    const html = generatePaperHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Exam Paper</title>
                    <meta charset="UTF-8">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { margin: 0; padding: 0; background: white; font-family: 'Inter', sans-serif; }
                        @page { size: A4; margin: 0; }
                        .print-paper { padding: 0.5in 0.4in 0.5in 0.4in !important; width: 100% !important; background: white !important; }
                        .fixed-header { margin-bottom: 12px; border-bottom: 2px solid #1f2937; padding-bottom: 10px; }
                        .instructions-box { margin-top: 10px; margin-bottom: 15px; padding: 8px 12px; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 6px; }
                        .question-section { page-break-inside: avoid; margin-bottom: 15px; }
                        .mcq-option { margin-left: 20px; margin-top: 3px; }
                        .answer-space { min-height: 50px; border-bottom: 1px dotted #9ca3af; margin-top: 8px; }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .font-semibold { font-weight: 600; }
                        .uppercase { text-transform: uppercase; }
                        .border-b { border-bottom: 1px solid #d1d5db; }
                        .border-t { border-top: 1px solid #d1d5db; }
                        .border-gray-400 { border-color: #9ca3af; }
                        .text-gray-500 { color: #6b7280; }
                        .flex { display: flex; }
                        .justify-between { justify-content: space-between; }
                        ${currentLang === 'hi' ? '.print-paper, .print-paper * { font-family: "Noto Sans Devanagari", "Inter", sans-serif; }' : ''}
                    </style>
                </head>
                <body>
                    <div class="print-paper">${html}</div>
                    <script>
                        window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 1000); };
                    <\/script>
                </body>
                </html>
            `);
    printWindow.document.close();
    showToast('Print dialog opened', 'info');
}

function generatePDF() {
    const element = document.createElement('div');
    element.style.padding = '0.5in 0.4in 0.5in 0.4in';
    element.style.backgroundColor = 'white';
    element.style.width = '210mm';
    element.innerHTML = generatePaperHTML();

    if (currentLang === 'hi') {
        element.style.fontFamily = "'Noto Sans Devanagari', 'Inter', sans-serif";
    }

    document.body.appendChild(element);

    const opt = {
        margin: [0, 0, 0, 0],
        filename: `exam_paper_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    showToast('Generating PDF...', 'info');

    html2pdf().from(element).set(opt).save().then(() => {
        document.body.removeChild(element);
        showToast('PDF downloaded!', 'success');
    }).catch((error) => {
        document.body.removeChild(element);
        showToast('PDF error', 'error');
    });
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    toast.className = `toast ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg mb-2 text-sm`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

document.querySelectorAll('#institution, #exam-title, #class, #subject, #time, #marks').forEach(el => {
    el.addEventListener('input', () => updatePreview());
});

document.getElementById('header-font').addEventListener('input', () => updatePreview());
document.getElementById('question-font').addEventListener('input', () => updatePreview());

function init() {
    mcqQuestions.push({ id: nextMcqId++, text: 'What is the capital of India?', marks: '1', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'] });
    mcqQuestions.push({ id: nextMcqId++, text: 'Who wrote the national anthem of India?', marks: '1', options: ['Bankim Chandra', 'Rabindranath Tagore', 'Sarojini Naidu', 'Mahatma Gandhi'] });
    descriptiveQuestions.push({ id: nextDescId++, text: 'Explain the importance of education in modern society.', marks: '5' });
    descriptiveQuestions.push({ id: nextDescId++, text: 'Write an essay on "Digital India" campaign.', marks: '10' });

    renderMCQList();
    renderDescriptiveList();
    updatePreview();
}

init();
