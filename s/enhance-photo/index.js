
// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const controls = document.getElementById('controls');
const result = document.getElementById('result');
const imageInfo = document.getElementById('image-info');
const beforeImg = document.getElementById('before-img');
const afterImg = document.getElementById('after-img');
const imageName = document.getElementById('image-name');
const imageSize = document.getElementById('image-size');
const imageDimensions = document.getElementById('image-dimensions');
const uploadProgress = document.getElementById('upload-progress');
const progressBar = uploadProgress.querySelector('div');

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let originalData = null;
let currentFile = null;
let isLoading = false;

// Initialize
function init() {
    attachEventListeners();
}

// Attach Event Listeners
function attachEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => {
        if (!isLoading) fileInput.click();
    });

    // Drag & Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!isLoading) {
            uploadArea.classList.add('drag-over');
        }
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (!isLoading && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) {
            handleFile(fileInput.files[0]);
        }
    });

    // Sliders
    ['brightness', 'contrast', 'saturation', 'sharpen'].forEach(id => {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(id[0] + '-val');

        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
            applyFilters();
        });
    });

    // Buttons
    document.getElementById('auto-enhance').addEventListener('click', autoEnhance);
    document.getElementById('reset').addEventListener('click', resetFilters);
    document.getElementById('download-jpg').addEventListener('click', () => download('jpeg'));
    document.getElementById('download-png').addEventListener('click', () => download('png'));
}

// Handle File Upload
function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file (JPG, PNG, WebP)', 'error');
        return;
    }

    // Validate file size (16MB max for 16MP)
    if (file.size > 16 * 1024 * 1024) {
        showToast('File size should be less than 16MB', 'error');
        return;
    }

    isLoading = true;
    currentFile = file;

    // Show progress
    uploadProgress.classList.remove('hidden');
    progressBar.style.width = '0%';

    const reader = new FileReader();

    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            progressBar.style.width = percent + '%';
        }
    };

    reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
            // Calculate dimensions (max 16MP)
            const maxPixels = 16e6;
            let width = img.width;
            let height = img.height;

            if (width * height > maxPixels) {
                const ratio = Math.sqrt(maxPixels / (width * height));
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image with smooth rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Store original data
            originalData = ctx.getImageData(0, 0, width, height);

            // Update preview
            beforeImg.src = canvas.toDataURL();
            afterImg.src = canvas.toDataURL();

            // Update image info
            imageName.textContent = file.name;
            imageSize.textContent = `(${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            imageDimensions.textContent = `${width} × ${height}`;

            // Show controls
            uploadArea.innerHTML = `
                        <div class="space-y-2">
                            <i class="fas fa-check-circle text-4xl text-green-500"></i>
                            <p class="text-lg font-semibold text-green-600">Photo loaded successfully!</p>
                            <p class="text-sm text-gray-500">Click to upload a different photo</p>
                        </div>
                    `;

            controls.classList.remove('hidden');
            result.classList.remove('hidden');
            imageInfo.classList.remove('hidden');

            // Hide progress after delay
            setTimeout(() => {
                uploadProgress.classList.add('hidden');
                isLoading = false;
            }, 500);

            showToast('Photo loaded successfully!', 'success');
        };

        img.src = e.target.result;
    };

    reader.onerror = () => {
        showToast('Error loading image', 'error');
        isLoading = false;
        uploadProgress.classList.add('hidden');
    };

    reader.readAsDataURL(file);
}

// Apply Filters
function applyFilters() {
    if (!originalData) return;

    // Get slider values
    const brightness = parseInt(document.getElementById('brightness').value);
    const contrast = parseInt(document.getElementById('contrast').value) / 100 + 1;
    const saturation = parseInt(document.getElementById('saturation').value) / 100 + 1;
    const sharpen = parseInt(document.getElementById('sharpen').value) / 100;

    // Copy original data
    let data = new ImageData(
        new Uint8ClampedArray(originalData.data),
        canvas.width,
        canvas.height
    );

    // Apply adjustments
    for (let i = 0; i < data.data.length; i += 4) {
        let r = data.data[i];
        let g = data.data[i + 1];
        let b = data.data[i + 2];

        // Brightness
        r += brightness;
        g += brightness;
        b += brightness;

        // Contrast
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;

        // Saturation
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        // Clamp values
        data.data[i] = Math.max(0, Math.min(255, r));
        data.data[i + 1] = Math.max(0, Math.min(255, g));
        data.data[i + 2] = Math.max(0, Math.min(255, b));
    }

    // Apply sharpen if needed
    if (sharpen > 0) {
        ctx.putImageData(data, 0, 0);
        const weights = [0, -sharpen, 0, -sharpen, 1 + 4 * sharpen, -sharpen, 0, -sharpen, 0];
        data = convolute(ctx.getImageData(0, 0, canvas.width, canvas.height), weights);
    }

    // Update canvas and preview
    ctx.putImageData(data, 0, 0);
    afterImg.src = canvas.toDataURL();
}

// Convolution for sharpen
function convolute(pixels, weights) {
    const side = 3;
    const half = Math.floor(side / 2);
    const src = pixels.data;
    const sw = pixels.width;
    const sh = pixels.height;

    const output = ctx.createImageData(sw, sh);
    const dst = output.data;

    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const dstIndex = (y * sw + x) * 4;

            let r = 0, g = 0, b = 0;

            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = Math.min(sh - 1, Math.max(0, y + cy - half));
                    const scx = Math.min(sw - 1, Math.max(0, x + cx - half));
                    const srcIndex = (scy * sw + scx) * 4;
                    const weight = weights[cy * side + cx];

                    r += src[srcIndex] * weight;
                    g += src[srcIndex + 1] * weight;
                    b += src[srcIndex + 2] * weight;
                }
            }

            dst[dstIndex] = Math.max(0, Math.min(255, r));
            dst[dstIndex + 1] = Math.max(0, Math.min(255, g));
            dst[dstIndex + 2] = Math.max(0, Math.min(255, b));
            dst[dstIndex + 3] = src[dstIndex + 3];
        }
    }

    return output;
}

// Auto Enhance
function autoEnhance() {
    showToast('Applying auto enhancement...', 'info');

    // Smart auto-enhance values
    setSliderValues({
        brightness: 12,
        contrast: 15,
        saturation: 18,
        sharpen: 22
    });

    showToast('Auto enhance applied! Fine-tune manually if needed', 'success');
}

// Reset Filters
function resetFilters() {
    setSliderValues({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        sharpen: 0
    });

    showToast('All adjustments reset', 'info');
}

// Set Slider Values
function setSliderValues(values) {
    Object.keys(values).forEach(id => {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(id[0] + '-val');

        slider.value = values[id];
        valueDisplay.textContent = values[id];
    });

    applyFilters();
}

// Download Image
function download(type) {
    if (!originalData) {
        showToast('Please upload an image first', 'error');
        return;
    }

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enhanced-photo-${Date.now()}.${type === 'jpeg' ? 'jpg' : 'png'}`;
        a.click();
        URL.revokeObjectURL(url);

        showToast(`Photo downloaded as ${type.toUpperCase()}!`, 'success');
    }, `image/${type}`, 0.95);
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const colors = {
        success: 'bg-gradient-to-r from-green-500 to-emerald-600',
        error: 'bg-gradient-to-r from-red-500 to-pink-600',
        info: 'bg-gradient-to-r from-blue-500 to-purple-600',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-600'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    toast.className = `toast-message ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center`;
    toast.innerHTML = `
                <i class="fas ${icons[type]} mr-3 text-xl"></i>
                <span class="font-medium">${message}</span>
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Share Functions
window.shareOnWhatsApp = function () {
    const text = 'Check out this free online photo enhancer - Enhance your photos instantly!';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Free Online Photo Enhancer - Brightness, Contrast, Saturation tools';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

window.copyLink = function () {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy link', 'error');
    });
};

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
