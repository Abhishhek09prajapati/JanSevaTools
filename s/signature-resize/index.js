
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

// Background options
const bgTransparent = document.getElementById('bgTransparent');
const bgWhite = document.getElementById('bgWhite');
const bgBlack = document.getElementById('bgBlack');
const bgCustom = document.getElementById('bgCustom');
const bgRemove = document.getElementById('bgRemove');
const customColorPicker = document.getElementById('customColorPicker');
const bgColor = document.getElementById('bgColor');

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
let currentBackground = 'transparent';
let currentResizeMode = 'dimension';
let originalWidth = 0;
let originalHeight = 0;
let originalFileSize = 0;
let fileName_str = '';
let currentFileSize = 0;

// Signature size presets
const presets = {
    'email': { width: 350, height: 100, desc: 'Email signature' },
    'document': { width: 500, height: 150, desc: 'Document signature' },
    'contract': { width: 600, height: 180, desc: 'Contract signature' },
    'website': { width: 250, height: 80, desc: 'Website signature' },
    'form': { width: 400, height: 120, desc: 'Form signature' }
};

// Set target KB from preset buttons
window.setTargetKB = (kb) => {
    manualTargetKB.value = kb;
    showToast(`Target set to ${kb} KB`, 'success');
};

// Apply size preset
window.applyPreset = (type) => {
    if (!processedImageData) {
        showToast('Please crop a signature first', 'error');
        return;
    }

    const preset = presets[type];
    if (preset) {
        widthInput.value = preset.width;
        heightInput.value = preset.height;
        showToast(`${preset.desc} size applied`, 'success');
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

        showToast('Signature loaded. Crop to signature area.', 'success');
    };

    reader.readAsDataURL(file);
}

// Crop button
document.getElementById('cropButton').addEventListener('click', () => {
    if (!cropper) return;

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = 'Cropping signature...';

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
        showToast('Signature cropped!', 'success');
    }, 100);
});

// Reset crop
document.getElementById('resetCropButton').addEventListener('click', () => {
    if (cropper) cropper.reset();
});

// Background functions
window.setBackground = (type) => {
    currentBackground = type;

    document.querySelectorAll('.bg-option').forEach(opt => opt.classList.remove('active'));

    switch (type) {
        case 'transparent':
            bgTransparent.classList.add('active');
            customColorPicker.classList.add('hidden');
            break;
        case 'white':
            bgWhite.classList.add('active');
            customColorPicker.classList.add('hidden');
            break;
        case 'black':
            bgBlack.classList.add('active');
            customColorPicker.classList.add('hidden');
            break;
        case 'custom':
            bgCustom.classList.add('active');
            customColorPicker.classList.remove('hidden');
            break;
        case 'remove':
            bgRemove.classList.add('active');
            customColorPicker.classList.add('hidden');
            removeBackground();
            return;
    }

    if (processedImageData) {
        applyBackground();
    }
};

// Remove white background
function removeBackground() {
    if (!processedImageData) return;

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = 'Removing background...';

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Remove white background
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If pixel is white or very light, make transparent
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        processedImageData = canvas.toDataURL('image/png');
        preview.src = processedImageData;

        updateCurrentFileSize();
        loadingIndicator.classList.add('hidden');
        showToast('Background removed!', 'success');
    };
    img.src = processedImageData;
}

// Apply background color
function applyBackground() {
    if (!processedImageData) return;

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = 'Applying background...';

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        if (currentBackground === 'transparent') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = currentBackground === 'white' ? '#ffffff' :
                currentBackground === 'black' ? '#000000' :
                    bgColor.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        processedImageData = canvas.toDataURL('image/png');
        preview.src = processedImageData;

        updateCurrentFileSize();
        loadingIndicator.classList.add('hidden');
        showToast('Background applied!', 'success');
    };
    img.src = processedImageData;
}

// Custom color change
bgColor.addEventListener('input', () => {
    if (currentBackground === 'custom') {
        applyBackground();
    }
});

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
                sizeMessage.innerHTML = '<span class="text-green-600">✓ Target size achieved!</span>';
            } else {
                const overSize = ((currentFileSize - targetBytes) / 1024).toFixed(1);
                sizeMessage.innerHTML = `<span class="text-orange-600">⚠ ${overSize} KB over target</span>`;
            }

            achievedSize.textContent = `Achieved: ${(currentFileSize / 1024).toFixed(2)} KB`;
        }

        sizeInfo.classList.remove('hidden');
    }
}

// KB Resize function
applyKBResize.addEventListener('click', () => {
    if (!processedImageData) {
        showToast('Please crop a signature first', 'error');
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
    const baseQuality = parseFloat(kbQualityPreset.value);

    const img = new Image();
    img.onload = () => {
        let bestData = null;
        let bestSize = 0;

        // Try different qualities
        const qualities = [baseQuality, baseQuality * 0.8, baseQuality * 0.6, 0.4, 0.3];

        // Try with original dimensions
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
            }
        }

        // If still too large, reduce dimensions
        if (!bestData) {
            let scale = 0.8;
            for (let attempt = 0; attempt < 5; attempt++) {
                const newWidth = Math.max(100, Math.round(img.width * scale));
                const newHeight = Math.max(50, Math.round(img.height * scale));

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
                    }
                }

                if (bestData) break;
                scale *= 0.7;
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
            showToast(`✓ Resized to ${achievedKb} KB (Target: ${targetKb} KB)`, 'success');
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
        const quality = format === 'jpg' ? 0.92 : 1;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        const link = document.createElement('a');
        const baseName = fileName_str.split('.')[0] || 'signature';
        link.download = `${baseName}_signature.${format}`;
        link.href = dataUrl;
        link.click();

        loadingIndicator.classList.add('hidden');
        showToast(`${format.toUpperCase()} downloaded!`, 'success');
    };
    img.src = processedImageData;
}

// New signature
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
    showToast('Ready for new signature', 'info');
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
    const text = 'Free Signature Resizer - Resize signatures for documents and emails';
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
