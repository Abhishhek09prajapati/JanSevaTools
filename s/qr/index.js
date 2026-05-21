
// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const downloadSvgBtn = document.getElementById('download-svg-btn');
const shareBtn = document.getElementById('share-btn');
const copyBtn = document.getElementById('copy-btn');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const qrcodeDiv = document.getElementById('qrcode');
const placeholderText = document.getElementById('placeholder-text');
const colorPickers = document.querySelectorAll('.color-picker');
const customColor = document.getElementById('custom-color');
const errorLevel = document.getElementById('error-level');
const addLogo = document.getElementById('add-logo');
const logoUploadContainer = document.getElementById('logo-upload-container');
const logoUpload = document.getElementById('logo-upload');
const qrStats = document.getElementById('qr-stats');
const historyList = document.getElementById('history-list');
const clearHistory = document.getElementById('clear-history');

// State
let qrcode = null;
let currentQRData = null;
let currentColor = '#000000';
let currentBgColor = '#ffffff';
let history = JSON.parse(localStorage.getItem('qrHistory') || '[]');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateSizeDisplay();
    loadHistory();
    attachEventListeners();
});

function attachEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'text-indigo-600', 'border-indigo-600');
                btn.classList.add('text-gray-500');
            });
            button.classList.add('active', 'text-indigo-600', 'border-indigo-600');
            button.classList.remove('text-gray-500');

            tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(`${button.dataset.tab}-tab`).classList.remove('hidden');
        });
    });

    // Size slider
    sizeSlider.addEventListener('input', updateSizeDisplay);

    // Color pickers
    colorPickers.forEach(picker => {
        picker.addEventListener('click', () => {
            colorPickers.forEach(p => p.classList.remove('active'));
            picker.classList.add('active');
            currentColor = picker.dataset.color;
            customColor.value = currentColor;
        });
    });

    customColor.addEventListener('input', (e) => {
        currentColor = e.target.value;
        colorPickers.forEach(p => p.classList.remove('active'));
    });

    // Background color
    document.querySelectorAll('.bg-picker').forEach(picker => {
        picker.addEventListener('click', () => {
            document.querySelectorAll('.bg-picker').forEach(p => p.classList.remove('active'));
            picker.classList.add('active');
            currentBgColor = picker.dataset.bg || '#ffffff';
        });
    });

    // Logo toggle
    addLogo.addEventListener('change', (e) => {
        logoUploadContainer.classList.toggle('hidden', !e.target.checked);
    });

    // Generate button
    generateBtn.addEventListener('click', generateQRCode);

    // Download buttons
    downloadBtn.addEventListener('click', () => downloadQR('png'));
    downloadSvgBtn.addEventListener('click', () => downloadQR('svg'));
    shareBtn.addEventListener('click', shareQR);
    copyBtn.addEventListener('click', copyQR);

    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const example = btn.dataset.example;
            if (example === 'url') {
                document.getElementById('url').value = 'https://google.com';
            } else if (example === 'text') {
                document.getElementById('text').value = 'Hello World! This is a sample QR code.';
            } else if (example === 'wifi') {
                document.getElementById('ssid').value = 'My WiFi Network';
                document.getElementById('password').value = 'password123';
            }
            generateQRCode();
        });
    });

    // Clear history
    clearHistory.addEventListener('click', () => {
        if (confirm('Clear all history?')) {
            history = [];
            localStorage.removeItem('qrHistory');
            loadHistory();
        }
    });
}

function updateSizeDisplay() {
    sizeValue.textContent = `${sizeSlider.value}px`;
}

function generateQRCode() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    let data = '';
    let type = '';

    // Get data based on active tab
    switch (activeTab) {
        case 'url':
            data = document.getElementById('url').value.trim();
            type = 'URL';
            if (!data) {
                showToast('Please enter a URL', 'error');
                return;
            }
            if (!data.startsWith('http')) {
                data = 'https://' + data;
            }
            break;

        case 'text':
            data = document.getElementById('text').value.trim();
            type = 'Text';
            if (!data) {
                showToast('Please enter some text', 'error');
                return;
            }
            break;

        case 'contact':
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('contact-address').value.trim();
            const company = document.getElementById('company').value.trim();
            const jobTitle = document.getElementById('job-title').value.trim();

            if (!name && !phone && !email && !address) {
                showToast('Please enter at least one contact field', 'error');
                return;
            }

            data = 'BEGIN:VCARD\nVERSION:3.0\n';
            if (name) data += `FN:${name}\nN:${name.split(' ').reverse().join(';')};;;\n`;
            if (phone) data += `TEL:${phone}\n`;
            if (email) data += `EMAIL:${email}\n`;
            if (address) data += `ADR:;;${address};;;\n`;
            if (company) data += `ORG:${company}\n`;
            if (jobTitle) data += `TITLE:${jobTitle}\n`;
            data += 'END:VCARD';
            type = 'Contact';
            break;

        case 'wifi':
            const ssid = document.getElementById('ssid').value.trim();
            const password = document.getElementById('password').value.trim();
            const encryption = document.getElementById('encryption').value;

            if (!ssid) {
                showToast('Please enter WiFi network name (SSID)', 'error');
                return;
            }

            data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
            type = 'WiFi';
            break;
    }

    // Clear previous QR
    qrcodeDiv.innerHTML = '';
    placeholderText.classList.add('hidden');

    // Show loading
    showToast('Generating QR code...', 'info');

    try {
        // Get error correction level
        const errorCorrection = {
            'L': QRCode.CorrectLevel.L,
            'M': QRCode.CorrectLevel.M,
            'Q': QRCode.CorrectLevel.Q,
            'H': QRCode.CorrectLevel.H
        }[errorLevel.value];

        // Generate new QR code
        qrcode = new QRCode(qrcodeDiv, {
            text: data,
            width: parseInt(sizeSlider.value),
            height: parseInt(sizeSlider.value),
            colorDark: currentColor,
            colorLight: currentBgColor,
            correctLevel: errorCorrection
        });

        currentQRData = data;

        // Enable buttons
        [downloadBtn, downloadSvgBtn, shareBtn, copyBtn].forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        });

        // Show stats
        qrStats.classList.remove('hidden');
        document.getElementById('qr-type').textContent = type;
        document.getElementById('qr-size').textContent = `${sizeSlider.value}x${sizeSlider.value}`;
        document.getElementById('qr-error').textContent = errorLevel.value;

        // Add to history
        addToHistory(type, data, sizeSlider.value);

        showToast('QR Code generated successfully!', 'success');

        // Handle logo if selected
        if (addLogo.checked && logoUpload.files[0]) {
            addLogoToQR();
        }

    } catch (error) {
        showToast('Error generating QR code', 'error');
        console.error(error);
    }
}

function downloadQR(format) {
    if (!qrcode) return;

    const canvas = qrcodeDiv.querySelector('canvas');
    if (!canvas) return;

    if (format === 'png') {
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('PNG downloaded!', 'success');
    } else if (format === 'svg') {
        // Convert canvas to SVG
        const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                        <image href="${canvas.toDataURL('image/png')}" width="${canvas.width}" height="${canvas.height}"/>
                    </svg>
                `;
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.svg`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('SVG downloaded!', 'success');
    }
}

function shareQR() {
    if (!qrcode) return;

    const canvas = qrcodeDiv.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
        if (navigator.share) {
            const file = new File([blob], 'qrcode.png', { type: 'image/png' });
            navigator.share({
                title: 'QR Code',
                text: 'Check out this QR code',
                files: [file]
            }).catch(() => {
                showToast('Sharing cancelled', 'info');
            });
        } else {
            // Fallback - copy to clipboard
            copyQR();
        }
    });
}

function copyQR() {
    if (!qrcode) return;

    const canvas = qrcodeDiv.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
        navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]).then(() => {
            showToast('QR code copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    });
}

function addLogoToQR() {
    // This is a simplified logo addition
    // In production, you'd need more sophisticated QR code with logo
    showToast('Logo feature - advanced version coming soon!', 'info');
}

function addToHistory(type, data, size) {
    const item = {
        type,
        data: data.substring(0, 30) + (data.length > 30 ? '...' : ''),
        size,
        timestamp: new Date().toLocaleTimeString()
    };

    history.unshift(item);
    if (history.length > 10) history.pop();

    localStorage.setItem('qrHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-gray-500 text-sm">No history yet</p>';
        return;
    }

    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer';
        div.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-qrcode text-indigo-500 mr-2"></i>
                        <div>
                            <div class="text-sm font-medium">${item.type}</div>
                            <div class="text-xs text-gray-500">${item.data}</div>
                        </div>
                    </div>
                    <span class="text-xs text-gray-400">${item.timestamp}</span>
                `;
        div.onclick = () => loadHistoryItem(index);
        historyList.appendChild(div);
    });
}

function loadHistoryItem(index) {
    // In a real app, you'd store the full data
    showToast('Load from history - feature coming soon!', 'info');
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

// Share functions
window.shareOnWhatsApp = () => {
    const text = 'Check out this free QR Code Generator - Create custom QR codes instantly';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = () => {
    const text = 'Free QR Code Generator - Create custom QR codes online';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};
