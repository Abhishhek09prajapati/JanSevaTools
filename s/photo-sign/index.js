
// State Management
let photoFile = null;
let signatureFile = null;
let cropper = null;
let currentCropType = null;

// Border Settings
let borderStyle = 'solid';
let borderWidth = 3;
let borderColor = '#0891b2';
let borderRadius = 0;

// Signature Settings
let signatureHeightPercent = 40;

// DOM Elements
const photoInput = document.getElementById('photoInput');
const signatureInput = document.getElementById('signatureInput');
const photoFileName = document.getElementById('photoFileName');
const signatureFileName = document.getElementById('signatureFileName');
const photoInfo = document.getElementById('photoInfo');
const signatureInfo = document.getElementById('signatureInfo');
const photoPreview = document.getElementById('photoPreview');
const signaturePreview = document.getElementById('signaturePreview');
const photoPreviewImg = document.getElementById('photoPreviewImg');
const signaturePreviewImg = document.getElementById('signaturePreviewImg');
const cropPhotoBtn = document.getElementById('cropPhotoBtn');
const cropSignatureBtn = document.getElementById('cropSignatureBtn');
const sizeSelect = document.getElementById('sizeSelect');
const sizeSearch = document.getElementById('sizeSearch');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultCanvas = document.getElementById('resultCanvas');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const cropModal = document.getElementById('cropModal');
const cropImage = document.getElementById('cropImage');
const cropBtn = document.getElementById('cropBtn');
const zoomSlider = document.getElementById('zoomSlider');
const sizeError = document.getElementById('sizeError');
const photoUploadArea = document.getElementById('photoUploadArea');
const signatureUploadArea = document.getElementById('signatureUploadArea');

// Border Elements
const borderWidthSlider = document.getElementById('borderWidth');
const borderWidthValue = document.getElementById('borderWidthValue');
const borderColorInput = document.getElementById('borderColor');
const borderColorDisplay = document.getElementById('borderColorDisplay');
const borderRadiusSlider = document.getElementById('borderRadius');
const borderRadiusValue = document.getElementById('borderRadiusValue');

// Signature Elements
const signatureHeightSlider = document.getElementById('signatureHeight');
const signatureHeightValue = document.getElementById('signatureHeightValue');
const signatureGuide = document.getElementById('signatureGuide');

// Event Listeners
photoInput.addEventListener('change', handlePhotoUpload);
signatureInput.addEventListener('change', handleSignatureUpload);
cropPhotoBtn.addEventListener('click', () => openCropModal('photo'));
cropSignatureBtn.addEventListener('click', () => openCropModal('signature'));
generateBtn.addEventListener('click', generateImage);
downloadBtn.addEventListener('click', downloadImage);
cropBtn.addEventListener('click', applyCrop);
zoomSlider.addEventListener('input', handleZoom);
sizeSearch.addEventListener('input', filterSizes);

// Drag and Drop
photoUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoUploadArea.classList.add('dragover');
});

photoUploadArea.addEventListener('dragleave', () => {
    photoUploadArea.classList.remove('dragover');
});

photoUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    photoUploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file, 'photo');
    }
});

signatureUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    signatureUploadArea.classList.add('dragover');
});

signatureUploadArea.addEventListener('dragleave', () => {
    signatureUploadArea.classList.remove('dragover');
});

signatureUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    signatureUploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file, 'signature');
    }
});

// Border Style Selection
window.selectBorderStyle = function (style) {
    borderStyle = style;

    // Update UI
    document.querySelectorAll('.border-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    if (style === 'none') document.getElementById('borderNone').classList.add('selected');
    if (style === 'solid') document.getElementById('borderSolid').classList.add('selected');
    if (style === 'dashed') document.getElementById('borderDashed').classList.add('selected');
    if (style === 'dotted') document.getElementById('borderDotted').classList.add('selected');

    // Enable/disable border controls
    const controls = [borderWidthSlider, borderColorInput, borderRadiusSlider];
    if (style === 'none') {
        controls.forEach(c => c.disabled = true);
    } else {
        controls.forEach(c => c.disabled = false);
    }
};

// Update Border Preview
window.updateBorderPreview = function () {
    borderWidth = borderWidthSlider.value;
    borderWidthValue.textContent = borderWidth + 'px';

    borderColor = borderColorInput.value;
    borderColorDisplay.style.backgroundColor = borderColor;

    borderRadius = borderRadiusSlider.value;
    borderRadiusValue.textContent = borderRadius + 'px';
};

// Update Signature Height
window.updateSignatureHeight = function () {
    signatureHeightPercent = signatureHeightSlider.value;
    signatureHeightValue.textContent = signatureHeightPercent + '%';

    // Update visual guide
    signatureGuide.style.height = signatureHeightPercent + '%';
};

// Handle Photo Upload
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file, 'photo');
    }
}

// Handle Signature Upload
function handleSignatureUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file, 'signature');
    }
}

// Handle File
function handleFile(file, type) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        if (type === 'photo') {
            photoFile = event.target.result;
            photoFileName.textContent = file.name;
            photoInfo.classList.remove('hidden');
            photoPreview.classList.remove('hidden');
            photoPreviewImg.src = photoFile;
            cropPhotoBtn.classList.remove('hidden');
            photoUploadArea.classList.add('hidden');
        } else {
            signatureFile = event.target.result;
            signatureFileName.textContent = file.name;
            signatureInfo.classList.remove('hidden');
            signaturePreview.classList.remove('hidden');
            signaturePreviewImg.src = signatureFile;
            cropSignatureBtn.classList.remove('hidden');
            signatureUploadArea.classList.add('hidden');
        }

        showToast(`${type === 'photo' ? 'Photo' : 'Signature'} uploaded successfully`, 'success');
    };
    reader.readAsDataURL(file);
}

// Remove Photo
window.removePhoto = function () {
    photoFile = null;
    photoInfo.classList.add('hidden');
    photoPreview.classList.add('hidden');
    cropPhotoBtn.classList.add('hidden');
    photoUploadArea.classList.remove('hidden');
    photoInput.value = '';
    showToast('Photo removed', 'info');
};

// Remove Signature
window.removeSignature = function () {
    signatureFile = null;
    signatureInfo.classList.add('hidden');
    signaturePreview.classList.add('hidden');
    cropSignatureBtn.classList.add('hidden');
    signatureUploadArea.classList.remove('hidden');
    signatureInput.value = '';
    showToast('Signature removed', 'info');
};

// Filter Sizes
function filterSizes() {
    const searchTerm = sizeSearch.value.toLowerCase();
    const options = sizeSelect.options;

    for (let option of options) {
        const text = option.text.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
}

// Open Crop Modal
function openCropModal(type) {
    currentCropType = type;
    const imageData = type === 'photo' ? photoFile : signatureFile;

    if (!imageData) return;

    cropImage.src = imageData;
    cropModal.classList.remove('hidden');
    cropModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(cropImage, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: NaN,
            autoCropArea: 1,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
        zoomSlider.value = 0;
    }, 100);
}

// Close Crop Modal
window.closeCropModal = function () {
    cropModal.classList.add('hidden');
    cropModal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
};

// Handle Zoom
function handleZoom(e) {
    if (cropper) {
        cropper.zoomTo(parseFloat(e.target.value));
    }
}

// Apply Crop
function applyCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        maxWidth: 1000,
        maxHeight: 1000,
        fillColor: '#fff'
    });

    const croppedImage = canvas.toDataURL('image/png');

    if (currentCropType === 'photo') {
        photoFile = croppedImage;
        photoPreviewImg.src = croppedImage;
    } else {
        signatureFile = croppedImage;
        signaturePreviewImg.src = croppedImage;
    }

    closeCropModal();
    showToast('Image cropped successfully', 'success');
}

// Generate Image with Border and Custom Signature Size
function generateImage() {
    if (!photoFile || !signatureFile) {
        showToast('Please upload both photo and signature', 'error');
        return;
    }

    const selectedSize = sizeSelect.value;
    if (!selectedSize) {
        sizeError.classList.remove('hidden');
        showToast('Please select a size', 'error');
        return;
    }
    sizeError.classList.add('hidden');

    // Show progress
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';

    const [width, height] = selectedSize.split('x').map(Number);

    const photoImg = new Image();
    const signatureImg = new Image();
    let loadedImages = 0;

    function checkAllLoaded() {
        loadedImages++;
        if (loadedImages === 2) {
            createCombinedImageWithBorder(photoImg, signatureImg, width, height);
        }
    }

    photoImg.onload = checkAllLoaded;
    signatureImg.onload = checkAllLoaded;

    photoImg.src = photoFile;
    signatureImg.src = signatureFile;

    // Progress animation
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
            progressBar.style.width = progress + '%';
            progressPercentage.textContent = progress + '%';
        }
    }, 100);
}

// Create Combined Image with Border
function createCombinedImageWithBorder(photoImg, signatureImg, width, height) {
    // Calculate signature height based on percentage
    const signatureHeight = Math.floor(height * (signatureHeightPercent / 100));
    const photoHeight = height - signatureHeight;

    // Set canvas size
    resultCanvas.width = width;
    resultCanvas.height = height;

    const ctx = resultCanvas.getContext('2d');

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Draw photo (top portion)
    ctx.drawImage(photoImg, 0, 0, width, photoHeight);

    // Draw signature (bottom portion)
    ctx.drawImage(signatureImg, 0, photoHeight, width, signatureHeight);

    // Add border if not 'none'
    if (borderStyle !== 'none') {
        ctx.save();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;

        // Set border style
        if (borderStyle === 'dashed') {
            ctx.setLineDash([10, 5]);
        } else if (borderStyle === 'dotted') {
            ctx.setLineDash([2, 4]);
        }

        // Draw border with rounded corners
        if (borderRadius > 0) {
            ctx.beginPath();
            ctx.moveTo(borderRadius, 0);
            ctx.lineTo(width - borderRadius, 0);
            ctx.quadraticCurveTo(width, 0, width, borderRadius);
            ctx.lineTo(width, height - borderRadius);
            ctx.quadraticCurveTo(width, height, width - borderRadius, height);
            ctx.lineTo(borderRadius, height);
            ctx.quadraticCurveTo(0, height, 0, height - borderRadius);
            ctx.lineTo(0, borderRadius);
            ctx.quadraticCurveTo(0, 0, borderRadius, 0);
            ctx.closePath();
        } else {
            ctx.strokeRect(0, 0, width, height);
        }

        ctx.stroke();
        ctx.restore();
    }

    // Add a thin line between photo and signature
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, photoHeight);
    ctx.lineTo(width, photoHeight);
    ctx.stroke();

    // Hide progress
    progressContainer.classList.add('hidden');

    // Show result
    resultSection.classList.remove('hidden');
    downloadSection.classList.remove('hidden');

    // Scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    showToast('Image with border generated successfully!', 'success');
}

// Download Image
function downloadImage() {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const borderText = borderStyle !== 'none' ? `-border-${borderWidth}px` : '';
    link.download = `photo-signature${borderText}-${timestamp}.png`;
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
    showToast('Download started!', 'success');
}

// Show Toast
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

    toast.className = `toast-message ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`;
    toast.innerHTML = `
                <i class="fas ${icons[type]} mr-3"></i>
                ${message}
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Share Functions
window.shareOnWhatsApp = function () {
    const text = 'Check out this Photo Signature Joiner with Border - Customize your exam photos';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Free Photo Signature Joiner with Border and Adjustable Signature';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Set default size
    sizeSelect.value = '295x360';

    // Initialize border
    selectBorderStyle('solid');
    updateBorderPreview();
    updateSignatureHeight();
});
