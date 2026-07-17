
// Import the background removal library
import { removeBackground } from 'https://esm.sh/@imgly/background-removal@1.4.5';

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const previewSection = document.getElementById('previewSection');
const preview = document.getElementById('preview');
const loadingSection = document.getElementById('loadingSection');
const loadingMessage = document.getElementById('loadingMessage');
const progressFill = document.getElementById('progressFill');
const progressStatus = document.getElementById('progressStatus');
const progressPercent = document.getElementById('progressPercent');
const resultSection = document.getElementById('resultSection');
const originalResult = document.getElementById('originalResult');
const result = document.getElementById('result');
const downloadBtn = document.getElementById('downloadBtn');
const processBtn = document.getElementById('processBtn');

// State
let selectedBgColor = 'transparent';
let originalFile = null;
let originalImageUrl = null;
let processedBlob = null;

// Drag & Drop Handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    }
});

// File Input Handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
    }
});

// Handle File Selection
function handleFileSelect(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file (JPG, PNG, WEBP)', 'error');
        return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
        showToast('File size should be less than 20MB', 'error');
        return;
    }

    originalFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImageUrl = e.target.result;
        preview.src = originalImageUrl;

        // Show preview, hide upload
        previewSection.classList.remove('hidden');
        uploadArea.classList.add('hidden');

        // Reset result section
        resultSection.classList.add('hidden');

        showToast('Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

// Set Background Color
window.setBgColor = function (color) {
    selectedBgColor = color;

    // Update active state on buttons
    document.querySelectorAll('[id^="btn-"]').forEach(btn => {
        btn.classList.remove('active', 'border-purple-500', 'ring-2', 'ring-purple-500');
    });

    if (color === 'transparent') {
        document.getElementById('btn-transparent')?.classList.add('active', 'border-purple-500', 'ring-2', 'ring-purple-500');
    } else if (color === '#ffffff') {
        document.getElementById('btn-white')?.classList.add('active', 'border-purple-500', 'ring-2', 'ring-purple-500');
    } else if (color === '#000000') {
        document.getElementById('btn-black')?.classList.add('active', 'border-purple-500', 'ring-2', 'ring-purple-500');
    } else if (color === '#3b82f6') {
        document.getElementById('btn-blue')?.classList.add('active', 'border-purple-500', 'ring-2', 'ring-purple-500');
    }
};

// Main Background Removal Function
window.removeBackground = async function () {
    if (!originalImageUrl) {
        showToast('Please select an image first', 'error');
        return;
    }

    // Show loading section
    previewSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    processBtn.disabled = true;

    try {
        // Configure the background removal
        const config = {
            progress: (key, current, total) => {
                // Update progress bar
                const percent = Math.round((current / total) * 100);
                progressFill.style.width = percent + '%';
                progressPercent.textContent = percent + '%';

                // Update status message based on key
                if (key === 'fetch') {
                    progressStatus.textContent = 'Downloading model...';
                } else if (key === 'compute') {
                    progressStatus.textContent = 'Processing image...';
                } else if (key === 'inference') {
                    progressStatus.textContent = 'AI is working...';
                }

                loadingMessage.textContent = key === 'fetch' ? 'Downloading AI Model...' : 'Removing Background...';
            },
            model: 'medium',
            output: {
                format: 'image/png',
                quality: 0.9
            }
        };

        // Remove background
        const blob = await removeBackground(originalImageUrl, config);

        // Apply background color if not transparent
        if (selectedBgColor !== 'transparent') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            await new Promise((resolve) => {
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Fill with selected color
                    ctx.fillStyle = selectedBgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw processed image on top
                    ctx.drawImage(img, 0, 0);

                    // Convert to blob
                    canvas.toBlob((newBlob) => {
                        processedBlob = newBlob;
                        resolve();
                    }, 'image/png');
                };
                img.src = URL.createObjectURL(blob);
            });
        } else {
            processedBlob = blob;
        }

        // Show result
        const resultUrl = URL.createObjectURL(processedBlob);
        originalResult.src = originalImageUrl;
        result.src = resultUrl;
        downloadBtn.href = resultUrl;

        // Hide loading, show result
        loadingSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        showToast('Background removed successfully!', 'success');

    } catch (error) {
        console.error('Error:', error);
        showToast('Error removing background. Please try again.', 'error');

        // Reset UI
        loadingSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
    } finally {
        processBtn.disabled = false;
    }
};

// Reset Tool
window.resetTool = function () {
    // Reset file input
    fileInput.value = '';

    // Hide all sections except upload
    previewSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    uploadArea.classList.remove('hidden');

    // Reset state
    originalFile = null;
    originalImageUrl = null;
    processedBlob = null;

    // Reset progress bar
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressStatus.textContent = 'Initializing...';
};

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    toast.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-3 text-xl"></i>
                    <span>${message}</span>
                </div>
            `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Share Functions
window.shareOnWhatsApp = function () {
    const text = 'Check out this free AI background remover - Remove image backgrounds instantly!';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Free AI Background Remover - No upload, 100% private';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

// Initialize
setBgColor('transparent');
