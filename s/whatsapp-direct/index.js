
(function () {
    // ========== DOM Elements ==========
    const countryCode = document.getElementById('countryCode');
    const waNumber = document.getElementById('waNumber');
    const customMsg = document.getElementById('customMessage');
    const generatedLink = document.getElementById('generatedLink');

    // Buttons
    const sendBtn = document.getElementById('sendMessageBtn');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const bulkSendBtn = document.getElementById('bulkSendBtn');

    // QR Elements
    const qrCanvas = document.getElementById('qrCanvas');
    const generateQrBtn = document.getElementById('generateQrBtn');
    const downloadPngBtn = document.getElementById('downloadQrPngBtn');
    const printQrBtn = document.getElementById('printQrBtn');
    const businessName = document.getElementById('businessName');
    const tagline = document.getElementById('tagline');
    const cardBusinessName = document.getElementById('cardBusinessName');
    const cardTagline = document.getElementById('cardTagline');

    // Templates
    const templateChips = document.querySelectorAll('.template-chip');
    const bulkNumbers = document.getElementById('bulkNumbers');

    // ========== Helper Functions ==========
    function cleanNumber(num) {
        return num.replace(/[\+\s\-\(\)]/g, '');
    }

    function getFullNumber() {
        let code = countryCode.value;
        let num = waNumber.value.trim();
        if (code === 'other') return cleanNumber(num);
        return cleanNumber(code) + cleanNumber(num);
    }

    function getWhatsAppLink() {
        let full = getFullNumber();
        if (!full) return null;
        let msg = encodeURIComponent(customMsg.value.trim());
        return msg ? `https://wa.me/${full}?text=${msg}` : `https://wa.me/${full}`;
    }

    function updateLinkField() {
        let link = getWhatsAppLink();
        generatedLink.value = link || 'https://wa.me/...';
    }

    function updateCardText() {
        cardBusinessName.textContent = businessName.value.trim() || 'Smart CSC Center';
        cardTagline.textContent = tagline.value.trim() || 'Scan & WhatsApp me';
    }

    function generateQR() {
        let link = getWhatsAppLink();
        if (!link) {
            alert('Please enter a WhatsApp number');
            return;
        }
        QRCode.toCanvas(qrCanvas, link, { width: 160, margin: 1 }, function (err) {
            if (err) console.error(err);
        });
        updateCardText();
    }

    // ========== Event Listeners ==========
    countryCode.addEventListener('change', updateLinkField);
    waNumber.addEventListener('input', updateLinkField);
    customMsg.addEventListener('input', updateLinkField);
    businessName.addEventListener('input', updateCardText);
    tagline.addEventListener('input', updateCardText);

    // Send Message
    sendBtn.addEventListener('click', () => {
        let link = getWhatsAppLink();
        if (link) window.open(link, '_blank');
        else alert('Enter number first');
    });

    // Generate Link (just updates field, already done)
    generateLinkBtn.addEventListener('click', () => {
        updateLinkField();
        alert('Link updated! You can copy it now.');
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        countryCode.value = '91';
        waNumber.value = '';
        customMsg.value = '';
        businessName.value = 'Smart CSC Center';
        tagline.value = 'Scan & WhatsApp me';
        bulkNumbers.value = '';
        updateLinkField();
        updateCardText();
        generateQR();
    });

    // Sample
    sampleBtn.addEventListener('click', () => {
        countryCode.value = '91';
        waNumber.value = '9876543210';
        customMsg.value = 'Hello, I need information about your CSC services.';
        updateLinkField();
        generateQR();
    });

    // Copy Link
    copyLinkBtn.addEventListener('click', () => {
        if (generatedLink.value && generatedLink.value !== 'https://wa.me/...') {
            navigator.clipboard.writeText(generatedLink.value);
            alert('Link copied!');
        } else {
            alert('No link to copy');
        }
    });

    // Template Chips
    templateChips.forEach(chip => {
        chip.addEventListener('click', () => {
            customMsg.value = chip.getAttribute('data-msg');
            updateLinkField();
        });
    });

    // Bulk Send
    bulkSendBtn.addEventListener('click', () => {
        let raw = bulkNumbers.value.trim();
        if (!raw) return alert('Paste numbers first');
        let lines = raw.split(/\n/).map(l => l.trim()).filter(l => l);
        let msg = encodeURIComponent(customMsg.value.trim() || '');
        let opened = 0;
        for (let line of lines) {
            if (opened >= 5) break;
            let num = line.replace(/[\+\s]/g, '');
            if (num.length > 5) {
                let url = msg ? `https://wa.me/${num}?text=${msg}` : `https://wa.me/${num}`;
                window.open(url, '_blank');
                opened++;
            }
        }
        alert(`Opened ${opened} chats (first 5)`);
    });

    // QR Generate
    generateQrBtn.addEventListener('click', generateQR);

    // Download PNG
    downloadPngBtn.addEventListener('click', () => {
        html2canvas(document.getElementById('qrBusinessCard'), { scale: 2 }).then(canvas => {
            let link = document.createElement('a');
            link.download = `whatsapp-card-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // Print Card
    printQrBtn.addEventListener('click', () => {
        window.print();
    });

    // Initialize on load
    window.addEventListener('load', () => {
        updateLinkField();
        generateQR();
        updateCardText();
    });

})();
