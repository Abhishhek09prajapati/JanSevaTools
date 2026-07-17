
// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const cropperContainer = document.getElementById('cropperContainer');
const cropperImage = document.getElementById('cropper-image');
const cropControls = document.getElementById('cropControls');
const cropWidth = document.getElementById('cropWidth');
const cropHeight = document.getElementById('cropHeight');
const preview = document.getElementById('preview');
const noPreviewText = document.getElementById('noPreviewText');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const imageDimensions = document.getElementById('imageDimensions');

// Enhancement options
const enhanceNormal = document.getElementById('enhanceNormal');
const enhanceInvert = document.getElementById('enhanceInvert');
const enhanceBW = document.getElementById('enhanceBW');
const enhanceContrast = document.getElementById('enhanceContrast');
const enhanceStamp = document.getElementById('enhanceStamp');

// Resize controls
const dimensionModeBtn = document.getElementById('dimensionModeBtn');
const kbModeBtn = document.getElementById('kbModeBtn');
const dimensionControls = document.getElementById('dimensionControls');
const kbControls = document.getElementById('kbControls');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const manualTargetKB = document.getElementById('manualTargetKB');
const kbQualityPreset = document.getElementById('kbQualityPreset');
const applyKBResize = document.getElementById('applyKBResize');
const aspectRatioLock = document.getElementById('aspectRatioLock');
const resetDimensionsBtn = document.getElementById('resetDimensions');

// Size info
const sizeInfo = document.getElementById('sizeInfo');
const currentSize = document.getElementById('currentSize');
const targetSizeDisplay = document.getElementById('targetSizeDisplay');
const sizeProgress = document.getElementById('sizeProgress');
const sizeMessage = document.getElementById('sizeMessage');
const achievedSize = document.getElementById('achievedSize');

// Buttons
const downloadPNGBtn = document.getElementById('downloadPNGBtn');
const downloadJPGBtn = document.getElementById('downloadJPGBtn');
const newImageBtn = document.getElementById('newImageBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const loadingText = document.getElementById('loadingText');

// State
let cropper = null;
let processedImageData = null;
let currentEnhancement = 'normal';
let currentResizeMode = 'dimension';
let originalWidth = 0;
let originalHeight = 0;
let originalFileSize = 0;
let fileName_str = '';
let currentFileSize = 0;

// Preset sizes
const presets = {
    'passport': { width: 600, height: 600, desc: '2x2 inch' },
    'visa': { width: 600, height: 600, desc: '2x2 inch' },
    'pan': { width: 450, height: 450, desc: '1.5x1.5 inch' },
    'aadhaar': { width: 600, height: 600, desc: '2x2 inch' },
    'voter': { width: 525, height: 525, desc: '1.75x1.75 inch' }
};

// Function to set target KB from preset buttons
window.setTargetKB = (kb) => {
    manualTargetKB.value = kb;
    showToast(`Target set to ${kb} KB`, 'success');
};

// Apply preset
window.applyPreset = (type) => {
    if (!processedImageData) {
        showToast('Please crop an image first', 'error');
        return;
    }

    const preset = presets[type];
    if (preset) {
        widthInput.value = preset.width;
        heightInput.value = preset.height;
        showToast(`${type.toUpperCase()} size applied: ${preset.desc}`, 'success');
    }
};

// Upload handlers
uploadArea.addEventListener('click', () => fileInput.click());

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
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Handle file upload
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showToast('File size should be less than 10MB', 'error');
        return;
    }

    fileName_str = file.name;
    originalFileSize = file.size;

    const reader = new FileReader();

    reader.onload = (e) => {
        cropperImage.src = e.target.result;
        uploadPrompt.classList.add('hidden');
        cropperContainer.classList.remove('hidden');
        cropControls.classList.remove('hidden');

        if (cropper) cropper.destroy();

        cropper = new Cropper(cropperImage, {
            aspectRatio: NaN,
            viewMode: 1,
            dragMode: 'crop',
            autoCropArea: 1,
            crop: function (event) {
                cropWidth.value = Math.round(event.detail.width);
                cropHeight.value = Math.round(event.detail.height);
            }
        });

        showToast('Image loaded. Crop to thumb area.', 'success');
    };

    reader.readAsDataURL(file);
}

// Crop button
document.getElementById('cropButton').addEventListener('click', () => {
    if (!cropper) return;

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = 'Cropping thumb impression...';

    setTimeout(() => {
        const canvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });

        processedImageData = canvas.toDataURL('image/png');
        preview.src = processedImageData;
        preview.style.display = 'block';
        noPreviewText.style.display = 'none';

        fileName.textContent = fileName_str;
        fileSize.textContent = formatFileSize(originalFileSize);
        imageDimensions.textContent = `${canvas.width} x ${canvas.height} px`;
        fileInfo.classList.remove('hidden');

        originalWidth = canvas.width;
        originalHeight = canvas.height;

        widthInput.value = originalWidth;
        heightInput.value = originalHeight;

        updateCurrentFileSize();
        downloadPNGBtn.disabled = false;
        downloadJPGBtn.disabled = false;

        loadingIndicator.classList.add('hidden');
        showToast('Thumb impression cropped!', 'success');
    }, 100);
});

// Reset crop
document.getElementById('resetCropButton').addEventListener('click', () => {
    if (cropper) cropper.reset();
});

// Enhancement functions
window.setEnhancement = (type) => {
    currentEnhancement = type;

    document.querySelectorAll('.enhance-option').forEach(opt => opt.classList.remove('active'));

    switch (type) {
        case 'normal': enhanceNormal.classList.add('active'); break;
        case 'invert': enhanceInvert.classList.add('active'); break;
        case 'bw': enhanceBW.classList.add('active'); break;
        case 'contrast': enhanceContrast.classList.add('active'); break;
        case 'stamp': enhanceStamp.classList.add('active'); break;
    }

    if (processedImageData) {
        applyEnhancement();
    }
};

function applyEnhancement() {
    if (!processedImageData) return;

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = 'Applying enhancement...';

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        switch (currentEnhancement) {
            case 'invert':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                break;

            case 'bw':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    const bw = gray > 128 ? 255 : 0;
                    data[i] = bw;
                    data[i + 1] = bw;
                    data[i + 2] = bw;
                }
                break;

            case 'contrast':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i] > 128 ? 255 : 0;
                    data[i + 1] = data[i + 1] > 128 ? 255 : 0;
                    data[i + 2] = data[i + 2] > 128 ? 255 : 0;
                }
                break;

            case 'stamp':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg > 100 ? 255 : 0;
                    data[i + 1] = avg > 100 ? 255 : 0;
                    data[i + 2] = avg > 100 ? 255 : 0;
                }
                break;
        }

        ctx.putImageData(imageData, 0, 0);
        processedImageData = canvas.toDataURL('image/png');
        preview.src = processedImageData;

        updateCurrentFileSize();
        loadingIndicator.classList.add('hidden');
        showToast('Enhancement applied!', 'success');
    };
    img.src = processedImageData;
}

// Resize mode
window.setResizeMode = (mode) => {
    currentResizeMode = mode;

    dimensionModeBtn.classList.toggle('active', mode === 'dimension');
    kbModeBtn.classList.toggle('active', mode === 'kb');

    dimensionControls.classList.toggle('hidden', mode !== 'dimension');
    kbControls.classList.toggle('hidden', mode !== 'kb');
    sizeInfo.classList.add('hidden');
};

// Aspect ratio handling
widthInput.addEventListener('input', () => {
    if (aspectRatioLock.checked && originalHeight > 0) {
        const newWidth = parseInt(widthInput.value) || 0;
        if (newWidth > 0) {
            heightInput.value = Math.round(newWidth * (originalHeight / originalWidth));
        }
    }
});

heightInput.addEventListener('input', () => {
    if (aspectRatioLock.checked && originalWidth > 0) {
        const newHeight = parseInt(heightInput.value) || 0;
        if (newHeight > 0) {
            widthInput.value = Math.round(newHeight * (originalWidth / originalHeight));
        }
    }
});

resetDimensionsBtn.addEventListener('click', () => {
    widthInput.value = originalWidth;
    heightInput.value = originalHeight;
});

// Update current file size
function updateCurrentFileSize() {
    if (!processedImageData) return;

    const base64Data = processedImageData.split(',')[1];
    if (base64Data) {
        currentFileSize = atob(base64Data).length;
        currentSize.textContent = formatFileSize(currentFileSize);

        if (manualTargetKB.value) {
            const targetBytes = parseInt(manualTargetKB.value) * 1024;
            targetSizeDisplay.textContent = manualTargetKB.value + ' KB';
            const percentage = (currentFileSize / targetBytes) * 100;
            sizeProgress.style.width = Math.min(percentage, 100) + '%';

            if (currentFileSize <= targetBytes) {
                sizeMessage.innerHTML = '<span class="text-green-600">? Target size achieved!</span>';
                sizeMessage.classList.add('text-green-600');
            } else {
                const overSize = ((currentFileSize - targetBytes) / 1024).toFixed(1);
                sizeMessage.innerHTML = `<span class="text-orange-600">? Image is ${overSize} KB over target</span>`;
            }

            achievedSize.textContent = `Achieved: ${(currentFileSize / 1024).toFixed(2)} KB`;
        }

        sizeInfo.classList.remove('hidden');
    }
}

// KB Resize - FIXED WITH MANUAL TARGET
applyKBResize.addEventListener('click', () => {
    if (!processedImageData) {
        showToast('Please crop an image first', 'error');
        return;
    }

    const targetKb = parseInt(manualTargetKB.value);
    if (!targetKb || targetKb < 1 || targetKb > 500) {
        showToast('Please enter valid target KB (1-500)', 'error');
        return;
    }

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = `Resizing to ${targetKb} KB...`;

    const targetBytes = targetKb * 1024;
    const quality = parseFloat(kbQualityPreset.value);

    const img = new Image();
    img.onload = () => {
        let bestData = null;
        let bestSize = 0;
        let bestQuality = quality;

        // Try different qualities
        const qualities = [quality, quality * 0.8, quality * 0.6, quality * 0.4, 0.3, 0.2];

        // First try: Same dimensions, different qualities
        for (let q of qualities) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg', q);
            const size = atob(dataUrl.split(',')[1]).length;

            if (size <= targetBytes && size > bestSize) {
                bestSize = size;
                bestData = dataUrl;
                bestQuality = q;
            }
        }

        // If still too large, reduce dimensions
        if (!bestData) {
            // Try progressive dimension reduction
            let scale = 0.9;
            for (let attempt = 0; attempt < 5; attempt++) {
                const newWidth = Math.max(100, Math.round(img.width * scale));
                const newHeight = Math.max(100, Math.round(img.height * scale));

                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                for (let q of qualities) {
                    const dataUrl = canvas.toDataURL('image/jpeg', q);
                    const size = atob(dataUrl.split(',')[1]).length;

                    if (size <= targetBytes && size > bestSize) {
                        bestSize = size;
                        bestData = dataUrl;
                        bestQuality = q;
                    }
                }

                if (bestData) break;
                scale *= 0.8; // Reduce more
            }
        }

        if (bestData) {
            processedImageData = bestData;
            preview.src = bestData;

            const tempImg = new Image();
            tempImg.onload = () => {
                imageDimensions.textContent = `${tempImg.width} x ${tempImg.height} px`;
                widthInput.value = tempImg.width;
                heightInput.value = tempImg.height;
            };
            tempImg.src = bestData;

            updateCurrentFileSize();

            const achievedKb = (bestSize / 1024).toFixed(2);
            showToast(`? Resized to ${achievedKb} KB (Target: ${targetKb} KB)`, 'success');
        } else {
            showToast('Could not achieve target size. Try higher KB target.', 'error');
        }

        loadingIndicator.classList.add('hidden');
    };
    img.src = processedImageData;
});

// Download functions
downloadPNGBtn.addEventListener('click', () => downloadImage('png'));
downloadJPGBtn.addEventListener('click', () => downloadImage('jpg'));

function downloadImage(format) {
    if (!processedImageData) return;

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = `Preparing ${format.toUpperCase()}...`;

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width, height;
        if (currentResizeMode === 'dimension' && widthInput.value && heightInput.value) {
            width = parseInt(widthInput.value);
            height = parseInt(heightInput.value);
        } else {
            width = img.width;
            height = img.height;
        }

        canvas.width = width;
        canvas.height = height;

        if (format === 'jpg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpg' ? 0.9 : 1;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        const link = document.createElement('a');
        const baseName = fileName_str.split('.')[0] || 'thumb';
        link.download = `${baseName}_thumb.${format}`;
        link.href = dataUrl;
        link.click();

        loadingIndicator.classList.add('hidden');
        showToast(`${format.toUpperCase()} downloaded!`, 'success');
    };
    img.src = processedImageData;
}

// New image
newImageBtn.addEventListener('click', () => {
    fileInput.value = '';
    uploadPrompt.classList.remove('hidden');
    cropperContainer.classList.add('hidden');
    cropControls.classList.add('hidden');
    preview.style.display = 'none';
    noPreviewText.style.display = 'block';
    fileInfo.classList.add('hidden');
    sizeInfo.classList.add('hidden');

    downloadPNGBtn.disabled = true;
    downloadJPGBtn.disabled = true;

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    processedImageData = null;
    showToast('Ready for new thumb impression', 'info');
});

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    toast.className = `toast-message ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center`;
    toast.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-3"></i>
                <span>${message}</span>
            `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Share functions
window.shareOnWhatsApp = () => {
    const text = 'Free Thumb Impression Resizer - Resize fingerprints for official documents';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
};



async function loadComponent(id, file) {
    const response = await fetch(file);
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
}
loadComponent("footer", "../footer.html");
