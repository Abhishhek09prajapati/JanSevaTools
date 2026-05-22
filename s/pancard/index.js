
// Presets Configuration
const presets = {
    'nsdl-photo': { width: 276, height: 197, ratio: 276 / 197, maxSize: 20, dpi: 200, name: 'NSDL Photo' },
    'nsdl-sig': { width: 354, height: 157, ratio: 354 / 157, maxSize: 10, dpi: 200, name: 'NSDL Signature' },
    'uti-photo': { width: 213, height: 213, ratio: 1, maxSize: 30, dpi: 300, name: 'UTI Photo' },
    'uti-sig': { width: 400, height: 200, ratio: 2, maxSize: 60, dpi: 600, name: 'UTI Signature' }
};

let cropper = null;
let currentPreset = 'nsdl-photo';
let originalImage = null;

const image = document.getElementById('image');
const inputImage = document.getElementById('inputImage');
const downloadBtn = document.getElementById('download');
const previewCanvas = document.getElementById('previewCanvas');
const previewSection = document.getElementById('preview-section');

// Select Preset Function
window.selectPreset = function (preset) {
    currentPreset = preset;

    // Update UI
    document.querySelectorAll('.preset-option').forEach(opt => {
        opt.classList.remove('border-blue-600', 'bg-blue-50');
        opt.classList.add('border-gray-300');
    });

    const selectedLabel = document.getElementById(`label-${preset}`);
    selectedLabel.classList.remove('border-gray-300');
    selectedLabel.classList.add('border-blue-600', 'bg-blue-50');

    // Update radio
    document.getElementById(preset).checked = true;

    // Update cropper aspect ratio
    if (cropper) {
        cropper.setAspectRatio(presets[preset].ratio);
        updatePreview();
    }

    showToast(`${presets[preset].name} selected`, 'info');
};

// Initialize with NSDL Photo
selectPreset('nsdl-photo');

// File Upload Handler
inputImage.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    // Validate file size
    if (files[0].size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
    }

    // Validate file type
    if (!files[0].type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        originalImage = event.target.result;
        image.src = event.target.result;

        document.getElementById('cropper-container').classList.remove('hidden');
        downloadBtn.classList.add('hidden');
        previewSection.classList.add('hidden');

        if (cropper) cropper.destroy();

        const config = presets[currentPreset];
        cropper = new Cropper(image, {
            aspectRatio: config.ratio,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.9,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            crop: updatePreview,
            ready: () => {
                downloadBtn.classList.remove('hidden');
                updatePreview();
                showToast('Image loaded successfully!', 'success');
            }
        });
    };
    reader.readAsDataURL(files[0]);
});

// Update Preview
function updatePreview() {
    if (!cropper) return;

    const config = presets[currentPreset];
    const canvas = cropper.getCroppedCanvas({
        width: config.width,
        height: config.height,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    // Apply white background for signatures
    if (currentPreset.includes('sig') && document.getElementById('whiteBackground').checked) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = config.width;
        tempCanvas.height = config.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);

        // Show preview
        previewCanvas.width = config.width;
        previewCanvas.height = config.height;
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.drawImage(tempCanvas, 0, 0);
    } else {
        previewCanvas.width = config.width;
        previewCanvas.height = config.height;
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx.drawImage(canvas, 0, 0);
    }

    // Update dimensions display
    document.getElementById('finalDimensions').textContent = `${config.width}×${config.height}px`;

    // Calculate file size
    previewCanvas.toBlob((blob) => {
        const size = (blob.size / 1024).toFixed(1);
        document.getElementById('finalSize').textContent = `${size}KB`;
    }, 'image/jpeg', 0.95);

    previewSection.classList.remove('hidden');

    // Update original image dimensions
    if (image.naturalWidth) {
        document.getElementById('image-dimensions').textContent = `${image.naturalWidth}×${image.naturalHeight}`;
    }
}

// Cropper Controls
document.getElementById('zoomIn').onclick = () => cropper && cropper.zoom(0.1);
document.getElementById('zoomOut').onclick = () => cropper && cropper.zoom(-0.1);
document.getElementById('rotateLeft').onclick = () => cropper && cropper.rotate(-45);
document.getElementById('rotateRight').onclick = () => cropper && cropper.rotate(45);
document.getElementById('reset').onclick = () => {
    if (cropper) {
        cropper.reset();
        showToast('Reset complete', 'info');
    }
};

// Auto Enhance Options
document.getElementById('whiteBackground').addEventListener('change', updatePreview);
document.getElementById('autoContrast').addEventListener('change', function () {
    if (this.checked) {
        showToast('Auto contrast applied', 'success');
    }
    updatePreview();
});

// Download with Compression
downloadBtn.addEventListener('click', () => {
    if (!cropper) return;

    const config = presets[currentPreset];
    let canvas = cropper.getCroppedCanvas({
        width: config.width,
        height: config.height,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    // Apply white background for signatures
    if (currentPreset.includes('sig') && document.getElementById('whiteBackground').checked) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = config.width;
        tempCanvas.height = config.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);
        canvas = tempCanvas;
    }

    // Apply auto contrast if checked
    if (document.getElementById('autoContrast').checked) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Simple contrast enhancement
        const contrast = 1.1; // 10% contrast increase
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, ((data[i] - 128) * contrast + 128)));
            data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - 128) * contrast + 128)));
            data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - 128) * contrast + 128)));
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Compress to meet size limit
    let quality = 0.95;
    const maxBytes = config.maxSize * 1024;

    const compressAndDownload = () => {
        canvas.toBlob((blob) => {
            if (blob.size > maxBytes && quality > 0.2) {
                quality -= 0.05;
                compressAndDownload();
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${currentPreset}_${config.width}x${config.height}_${new Date().toISOString().slice(0, 10)}.jpg`;
                a.click();
                URL.revokeObjectURL(url);

                const finalSize = (blob.size / 1024).toFixed(1);
                showToast(`Downloaded! Size: ${finalSize}KB`, 'success');
            }
        }, 'image/jpeg', quality);
    };

    showToast('Processing image...', 'info');
    compressAndDownload();
});

// Toast Notification Function
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

// Drag & Drop Support
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-blue-600', 'bg-blue-100');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-600', 'bg-blue-100');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-600', 'bg-blue-100');

    const files = e.dataTransfer.files;
    if (files.length) {
        inputImage.files = files;
        inputImage.dispatchEvent(new Event('change'));
    }
});

// Share Functions
window.shareOnWhatsApp = function () {
    const text = 'Free PAN Card Photo & Signature Resizer - Exact size for NSDL & UTI applications';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'PAN Card Photo Resizer - Free tool for NSDL & UTI format';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

