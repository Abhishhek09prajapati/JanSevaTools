
let images = { student: null, cartoon: null };
let isHindi = false;
const labels = {
    en: { cls: "Class:", sec: "Sec:", rol: "Roll:", sub: "Subject:" },
    hi: { cls: "कक्षा:", sec: "वर्ग:", rol: "रोल:", sub: "विषय:" }
};

function toggleTheme() {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function toggleLanguage() {
    isHindi = !isHindi;
    document.getElementById('langBtn').innerHTML = isHindi ? "🔄 Switch to English Labels" : "🔄 Switch to Hindi Labels";
    updateUI();
}

function updateUI() {
    const tpl = document.querySelector('input[name="tpl"]:checked').value;
    const name = document.getElementById('nameIn').value || 'Student Name';
    const school = document.getElementById('schoolIn').value || 'SCHOOL NAME';
    const qty = Math.min(document.getElementById('qtyInput').value, 10);

    // Update Theme
    document.getElementById('cardBoy').classList.toggle('active', tpl === 'boy');
    document.getElementById('cardGirl').classList.toggle('active', tpl === 'girl');

    const master = document.getElementById('master-slip');
    master.className = `slip-card slip-${tpl}`;
    document.getElementById('slipName').innerText = name;
    document.getElementById('slipSchool').innerText = school;

    // Apply Language
    const lang = isHindi ? 'hi' : 'en';
    master.querySelector('.lbl-cls').innerText = labels[lang].cls;
    master.querySelector('.lbl-sec').innerText = labels[lang].sec;
    master.querySelector('.lbl-rol').innerText = labels[lang].rol;
    master.querySelector('.lbl-sub').innerText = labels[lang].sub;

    // Apply Cartoon Setup
    const sticker = document.getElementById('cartoonSticker');
    if (images.cartoon) {
        sticker.style.display = 'block';
        document.getElementById('cartoonControls').style.display = 'block';
        sticker.style.width = document.getElementById('cartSize').value + 'px';
        sticker.style.left = document.getElementById('cartX').value + 'px';
        sticker.style.top = document.getElementById('cartY').value + 'px';
    }

    // Sync A4 Preview
    const a4 = document.getElementById('a4-print');
    a4.innerHTML = '';
    for (let i = 0; i < qty; i++) {
        const clone = master.cloneNode(true);
        clone.removeAttribute('id');
        a4.appendChild(clone);
    }
}

function loadImage(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        if (type === 'student') {
            images.student = e.target.result;
            document.getElementById('stuImg').src = e.target.result;
            document.getElementById('stuImg').style.display = 'block';
            document.getElementById('stuPlace').style.display = 'none';
        } else {
            images.cartoon = e.target.result;
            document.getElementById('cartImg').src = e.target.result;
        }
        updateUI();
    };
    reader.readAsDataURL(file);
}

// DOWNLOAD SINGLE PNG FUNCTION
async function downloadPNG() {
    const master = document.getElementById('master-slip');
    try {
        const canvas = await html2canvas(master, { scale: 3, useCORS: true, backgroundColor: null });
        const link = document.createElement('a');
        link.download = 'SmartCSCTools_SingleSlip.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        alert("Error saving PNG.");
    }
}

// FLAWLESS PDF SAVE FUNCTION (No Cut-offs)
async function saveAsPDF() {
    const btn = document.getElementById('btnPdf');
    btn.innerHTML = "⏳ Generating...";
    const a4 = document.getElementById('a4-print');

    // Temporary styles to capture full unscaled A4 without overflow cuts
    const originalTransform = a4.style.transform;
    const originalMargin = a4.style.marginBottom;
    a4.style.transform = 'none';
    a4.style.marginBottom = '0';
    a4.style.position = 'absolute';
    a4.style.top = '0';
    a4.style.left = '0';
    a4.style.width = '210mm';
    a4.style.height = '297mm';

    try {
        const canvas = await html2canvas(a4, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: a4.offsetWidth,
            height: a4.offsetHeight
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save('A4_Name_Slips_SmartCSCTools.pdf');
    } catch (error) {
        alert("Error generating PDF.");
    }

    // Revert styles back to preview mode
    a4.style.position = '';
    a4.style.top = '';
    a4.style.left = '';
    a4.style.width = '210mm';
    a4.style.height = '';
    a4.style.transform = originalTransform;
    a4.style.marginBottom = originalMargin;
    btn.innerHTML = "💾 Save as PDF";
}

document.addEventListener('DOMContentLoaded', updateUI);
