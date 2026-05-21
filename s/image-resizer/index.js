
// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const imagePreview = document.getElementById('imagePreview');
const preview = document.getElementById('preview');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const originalDimensions = document.getElementById('originalDimensions');
const fileType = document.getElementById('fileType');

// Mode elements
const dimensionModeBtn = document.getElementById('dimensionModeBtn');
const kbModeBtn = document.getElementById('kbModeBtn');
const dimensionControls = document.getElementById('dimensionControls');
const kbControls = document.getElementById('kbControls');
const resizeBtnText = document.getElementById('resizeBtnText');

// Dimension mode inputs
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const aspectRatioLock = document.getElementById('aspectRatioLock');
const resetDimensionsBtn = document.getElementById('resetDimensions');

// KB mode inputs
const targetKB = document.getElementById('targetKB');
const qualityPreset = document.getElementById('qualityPreset');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');

// Size comparison
const sizeComparison = document.getElementById('sizeComparison');
const originalSizeDisplay = document.getElementById('originalSizeDisplay');
const newSizeDisplay = document.getElementById('newSizeDisplay');
const reductionPercent = document.getElementById('reductionPercent');
const sizeProgress = document.getElementById('sizeProgress');

// Buttons
const resizeBtn = document.getElementById('resizeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const loadingText = document.getElementById('loadingText');

// State
let currentMode = 'dimension';
let originalImage = null;
let originalWidth = 0;
let originalHeight = 0;
let aspectRatio = 1;
let originalFileSize = 0;
let resizedImageData = null;
let resizedFileSize = 0;
let originalFileName = '';

// Quality slider
qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value + '%';
});

qualityPreset.addEventListener('change', () => {
    const values = { '0.9': 90, '0.7': 70, '0.5': 50, '0.3': 30 };
    qualitySlider.value = values[qualityPreset.value];
    qualityValue.textContent = qualitySlider.value + '%';
});

// Mode switching
window.setMode = (mode) => {
    currentMode = mode;

    // Update buttons
    dimensionModeBtn.classList.toggle('active', mode === 'dimension');
    kbModeBtn.classList.toggle('active', mode === 'kb');

    // Show/hide controls
    dimensionControls.classList.toggle('hidden', mode !== 'dimension');
    kbControls.classList.toggle('hidden', mode !== 'kb');

    // Update button text
    resizeBtnText.textContent = mode === 'dimension' ? 'Resize Image' : 'Resize to Target KB';

    // Hide size comparison when switching modes
    sizeComparison.classList.add('hidden');
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
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
        showToast('File size should be less than 20MB', 'error');
        return;
    }

    originalFileSize = file.size;
    originalFileName = file.name;

    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Store original image
            originalImage = img;
            originalWidth = img.width;
            originalHeight = img.height;
            aspectRatio = originalWidth / originalHeight;

            // Update UI
            preview.src = e.target.result;
            uploadPrompt.classList.add('hidden');
            imagePreview.classList.remove('hidden');

            // Update file info
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            originalDimensions.textContent = `${originalWidth} x ${originalHeight} px`;
            fileType.textContent = file.type.split('/')[1].toUpperCase();
            fileInfo.classList.remove('hidden');

            // Set input values
            widthInput.value = originalWidth;
            heightInput.value = originalHeight;

            // Enable resize button
            resizeBtn.disabled = false;

            showToast('Image uploaded successfully', 'success');
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// KB to Bytes
function kbToBytes(kb) {
    return kb * 1024;
}

// Bytes to KB
function bytesToKB(bytes) {
    return (bytes / 1024).toFixed(2);
}

// Aspect ratio handling
widthInput.addEventListener('input', () => {
    if (aspectRatioLock.checked && originalHeight > 0) {
        const newWidth = parseInt(widthInput.value) || 0;
        if (newWidth > 0) {
            heightInput.value = Math.round(newWidth / aspectRatio);
        }
    }
});

heightInput.addEventListener('input', () => {
    if (aspectRatioLock.checked && originalWidth > 0) {
        const newHeight = parseInt(heightInput.value) || 0;
        if (newHeight > 0) {
            widthInput.value = Math.round(newHeight * aspectRatio);
        }
    }
});

resetDimensionsBtn.addEventListener('click', () => {
    widthInput.value = originalWidth;
    heightInput.value = originalHeight;
    showToast('Dimensions reset to original', 'info');
});

// Resize button click
resizeBtn.addEventListener('click', async () => {
    if (!originalImage) {
        showToast('Please upload an image first', 'error');
        return;
    }

    if (currentMode === 'dimension') {
        await resizeByDimensions();
    } else {
        await resizeByKB();
    }
});

// Resize by dimensions
async function resizeByDimensions() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    if (!width || !height || width < 1 || height < 1) {
        showToast('Please enter valid dimensions', 'error');
        return;
    }

    if (width > 5000 || height > 5000) {
        showToast('Maximum dimensions allowed: 5000px', 'error');
        return;
    }

    loadingIndicator.classList.remove('hidden');
    resizeBtn.disabled = true;

    try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(originalImage, 0, 0, width, height);

        // Use quality 0.92 for good balance
        resizedImageData = canvas.toDataURL('image/jpeg', 0.92);

        // Calculate new file size
        const base64Data = resizedImageData.split(',')[1];
        const binaryData = atob(base64Data);
        resizedFileSize = binaryData.length;

        // Update preview
        preview.src = resizedImageData;

        // Show size comparison
        showSizeComparison();

        // Enable download
        downloadBtn.disabled = false;

        showToast('Image resized successfully!', 'success');
    } catch (error) {
        showToast('Error resizing image', 'error');
        console.error(error);
    } finally {
        loadingIndicator.classList.add('hidden');
        resizeBtn.disabled = false;
    }
}

// Resize by KB
async function resizeByKB() {
    const targetKb = parseInt(targetKB.value);

    if (!targetKb || targetKb < 1) {
        showToast('Please enter target KB size', 'error');
        return;
    }

    if (targetKb > 5120) { // 5MB max
        showToast('Target size should be less than 5MB (5120 KB)', 'error');
        return;
    }

    loadingIndicator.classList.remove('hidden');
    loadingText.textContent = 'Finding optimal size...';
    resizeBtn.disabled = true;

    try {
        const targetBytes = kbToBytes(targetKb);

        // Binary search for optimal quality
        let low = 0.1;
        let high = 1.0;
        let bestQuality = 0.7;
        let bestData = null;
        let bestSize = 0;
        let attempts = 0;
        const maxAttempts = 8;

        while (attempts < maxAttempts) {
            const mid = (low + high) / 2;

            const canvas = document.createElement('canvas');
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalImage, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg', mid);
            const base64Data = dataUrl.split(',')[1];
            const size = atob(base64Data).length;

            if (Math.abs(size - targetBytes) < Math.abs(bestSize - targetBytes)) {
                bestQuality = mid;
                bestData = dataUrl;
                bestSize = size;
            }

            if (size > targetBytes) {
                high = mid;
            } else {
                low = mid;
            }

            attempts++;
        }

        // If still too large, reduce dimensions
        if (bestSize > targetBytes * 1.1) {
            // Calculate scale factor
            const scale = Math.sqrt(targetBytes / bestSize) * 0.95;
            const newWidth = Math.round(originalWidth * scale);
            const newHeight = Math.round(originalHeight * scale);

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

            bestData = canvas.toDataURL('image/jpeg', bestQuality);
            const base64Data = bestData.split(',')[1];
            bestSize = atob(base64Data).length;
        }

        if (bestData) {
            resizedImageData = bestData;
            resizedFileSize = bestSize;

            // Update preview
            preview.src = resizedImageData;

            // Show size comparison
            showSizeComparison();

            // Update dimensions display
            const tempImg = new Image();
            tempImg.onload = () => {
                originalDimensions.textContent = `${tempImg.width} x ${tempImg.height} px`;
            };
            tempImg.src = bestData;

            // Enable download
            downloadBtn.disabled = false;

            const percentReduction = ((originalFileSize - resizedFileSize) / originalFileSize * 100).toFixed(1);
            showToast(`Reduced by ${percentReduction}% | Achieved: ${bytesToKB(resizedFileSize)} KB`, 'success');
        } else {
            showToast('Could not achieve target size. Try larger target KB.', 'error');
        }
    } catch (error) {
        showToast('Error resizing image', 'error');
        console.error(error);
    } finally {
        loadingIndicator.classList.add('hidden');
        loadingText.textContent = 'Processing image...';
        resizeBtn.disabled = false;
    }
}

// Show size comparison
function showSizeComparison() {
    originalSizeDisplay.textContent = formatFileSize(originalFileSize);
    newSizeDisplay.textContent = formatFileSize(resizedFileSize);

    const percentReduction = ((originalFileSize - resizedFileSize) / originalFileSize * 100).toFixed(1);
    reductionPercent.textContent = `-${percentReduction}%`;

    const percentage = (resizedFileSize / originalFileSize) * 100;
    sizeProgress.style.width = Math.min(percentage, 100) + '%';

    sizeComparison.classList.remove('hidden');
}

// Download image
downloadBtn.addEventListener('click', () => {
    if (!resizedImageData) {
        showToast('Please resize image first', 'error');
        return;
    }

    // Generate filename
    const baseName = originalFileName.split('.')[0];
    const dimensions = currentMode === 'kb' ? targetKB.value + 'kb' : widthInput.value + 'x' + heightInput.value;
    const filename = `${baseName}_resized_${dimensions}.jpg`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = resizedImageData;
    link.click();

    showToast('Download started', 'success');
});

// New image
newImageBtn.addEventListener('click', () => {
    // Reset all
    fileInput.value = '';
    uploadPrompt.classList.remove('hidden');
    imagePreview.classList.add('hidden');
    fileInfo.classList.add('hidden');
    sizeComparison.classList.add('hidden');
    widthInput.value = '';
    heightInput.value = '';
    targetKB.value = '';
    resizeBtn.disabled = true;
    downloadBtn.disabled = true;
    originalImage = null;
    resizedImageData = null;

    showToast('Ready for new image', 'info');
});

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

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    toast.className = `toast-message ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center`;
    toast.innerHTML = `
                <i class="fas ${icons[type]} mr-3"></i>
                <span class="flex-1">${message}</span>
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Share functions
window.shareOnWhatsApp = () => {
    const text = 'Check out this free Image Resizer tool - Resize images by dimensions or exact KB size';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = () => {
    const text = 'Free Online Image Resizer - Resize by Pixels or KB';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

window.copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
};

// Enter key support for inputs
widthInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') resizeBtn.click();
});

heightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') resizeBtn.click();
});

targetKB.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') resizeBtn.click();
});
