
// ==================== GLOBAL VARIABLES ====================
let uploadedImage = null;
let croppedImage = null;
let selectedSize = { width: 35, height: 45, unit: 'mm' };
let aspectRatio = 35 / 45;
let cropData = { x: 0, y: 0, width: 200, height: 200, scale: 1 };
let brightness = 100;
let contrast = 100;
let saturation = 100;
let selectedBackground = 'changed';
let backgroundColor = '#FFFFFF';
let borderType = 'none';
let borderColor = '#FFFFFF';
let borderSize = 4;
let isDragging = false;
let dragHandle = null;
let dragStart = { x: 0, y: 0 };

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Set default selected border
    document.getElementById('border-none').classList.add('ring-2', 'ring-indigo-600');
});

// ==================== FILE UPLOAD ====================
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            showToast('File size must be less than 10MB', 'error');
            return;
        }
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file', 'error');
            return;
        }
        loadImage(file);
    }
});

// Drag & Drop
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-indigo-600', 'bg-indigo-50');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-600', 'bg-indigo-50');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-600', 'bg-indigo-50');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            uploadedImage = img;

            // Hide upload section, show main tool
            document.getElementById('uploadSection').classList.add('hidden');
            document.getElementById('mainToolSection').classList.remove('hidden');

            // Show size section
            document.getElementById('sizeSection').classList.remove('hidden');

            // Update progress
            updateProgress(2);

            showToast('Image loaded successfully!', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ==================== PROGRESS TRACKER ====================
function updateProgress(step) {
    const steps = [1, 2, 3, 4, 5];
    steps.forEach(s => {
        const stepEl = document.getElementById(`step${s}`);
        const lineEl = document.getElementById(`line${s}`);

        if (s < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active', 'bg-gray-300');
            if (lineEl) lineEl.classList.add('completed');
        } else if (s === step) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed', 'bg-gray-300');
        } else {
            stepEl.classList.remove('active', 'completed');
            stepEl.classList.add('bg-gray-300');
            if (lineEl) lineEl.classList.remove('completed');
        }
    });
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    toast.className = `toast-message ${colors[type]} flex items-center`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mr-3"></i>${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==================== SIZE SECTION ====================
function selectSize(width, height, unit, country, elementId) {
    selectedSize = { width, height, unit };
    aspectRatio = width / height;

    // Update UI
    document.querySelectorAll('.preset-card').forEach(el => {
        el.classList.remove('selected', 'border-indigo-600', 'bg-indigo-50');
    });

    const selected = document.getElementById(elementId);
    if (selected) {
        selected.classList.add('selected', 'border-indigo-600', 'bg-indigo-50');
    }

    showToast(`Selected: ${width}${unit} x ${height}${unit}`, 'success');
}

function selectCustomSize() {
    const width = parseFloat(document.getElementById('customWidth').value);
    const height = parseFloat(document.getElementById('customHeight').value);
    const unit = document.querySelector('input[name="unit"]:checked').value;

    if (width > 0 && height > 0) {
        selectedSize = { width, height, unit };
        aspectRatio = width / height;
        showToast(`Custom size: ${width}${unit} x ${height}${unit}`, 'success');
    } else {
        showToast('Please enter valid dimensions', 'error');
    }
}

function updateDpi() {
    const slider = document.getElementById('dpiSlider');
    const input = document.getElementById('dpiInput');
    input.value = slider.value;
}

function goToCrop() {
    document.getElementById('sizeSection').classList.add('hidden');
    document.getElementById('cropSection').classList.remove('hidden');
    updateProgress(3);
    setTimeout(initCropCanvas, 100);
}

// ==================== CROP SECTION ====================
function initCropCanvas() {
    const canvas = document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');

    // Calculate dimensions
    let maxWidth = window.innerWidth > 768 ? 600 : window.innerWidth - 60;
    const scale = maxWidth / uploadedImage.width;

    canvas.width = uploadedImage.width * scale;
    canvas.height = uploadedImage.height * scale;

    // Initialize crop box
    const boxWidth = canvas.width * 0.8;
    const boxHeight = boxWidth / aspectRatio;

    cropData = {
        x: (canvas.width - boxWidth) / 2,
        y: (canvas.height - boxHeight) / 2,
        width: boxWidth,
        height: boxHeight,
        scale: 1
    };

    drawCropCanvas();
    initCropBox();
}

function drawCropCanvas() {
    const canvas = document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
}

function initCropBox() {
    const cropBox = document.getElementById('cropBox');
    cropBox.style.left = cropData.x + 'px';
    cropBox.style.top = cropData.y + 'px';
    cropBox.style.width = cropData.width + 'px';
    cropBox.style.height = cropData.height + 'px';
    cropBox.style.display = 'block';

    // Remove old listeners and add new ones
    cropBox.removeEventListener('mousedown', startDrag);
    cropBox.removeEventListener('touchstart', startDrag);
    cropBox.addEventListener('mousedown', startDrag);
    cropBox.addEventListener('touchstart', startDrag, { passive: false });
}

function startDrag(e) {
    e.preventDefault();

    if (e.target.classList.contains('resize-handle')) {
        dragHandle = e.target.className.split(' ')[1];
    } else {
        dragHandle = 'move';
    }

    isDragging = true;
    dragStart.x = e.clientX || e.touches[0].clientX;
    dragStart.y = e.clientY || e.touches[0].clientY;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    const canvas = document.getElementById('cropCanvas');

    if (dragHandle === 'move') {
        let newX = cropData.x + deltaX;
        let newY = cropData.y + deltaY;

        newX = Math.max(0, Math.min(newX, canvas.width - cropData.width));
        newY = Math.max(0, Math.min(newY, canvas.height - cropData.height));

        cropData.x = newX;
        cropData.y = newY;
    } else if (dragHandle === 'se') {
        let newWidth = Math.max(100, cropData.width + deltaX);
        let newHeight = newWidth / aspectRatio;

        if (cropData.y + newHeight <= canvas.height) {
            cropData.width = newWidth;
            cropData.height = newHeight;
        }
    } else if (dragHandle === 'sw') {
        let newWidth = Math.max(100, cropData.width - deltaX);
        let newHeight = newWidth / aspectRatio;
        let newX = cropData.x + cropData.width - newWidth;

        if (newX >= 0 && cropData.y + newHeight <= canvas.height) {
            cropData.x = newX;
            cropData.width = newWidth;
            cropData.height = newHeight;
        }
    } else if (dragHandle === 'ne') {
        let newWidth = Math.max(100, cropData.width + deltaX);
        let newHeight = newWidth / aspectRatio;
        let newY = cropData.y + cropData.height - newHeight;

        if (newY >= 0) {
            cropData.width = newWidth;
            cropData.height = newHeight;
            cropData.y = newY;
        }
    } else if (dragHandle === 'nw') {
        let newWidth = Math.max(100, cropData.width - deltaX);
        let newHeight = newWidth / aspectRatio;
        let newX = cropData.x + cropData.width - newWidth;
        let newY = cropData.y + cropData.height - newHeight;

        if (newX >= 0 && newY >= 0) {
            cropData.x = newX;
            cropData.y = newY;
            cropData.width = newWidth;
            cropData.height = newHeight;
        }
    }

    // Update UI
    const cropBox = document.getElementById('cropBox');
    cropBox.style.left = cropData.x + 'px';
    cropBox.style.top = cropData.y + 'px';
    cropBox.style.width = cropData.width + 'px';
    cropBox.style.height = cropData.height + 'px';

    dragStart.x = clientX;
    dragStart.y = clientY;
}

function stopDrag() {
    isDragging = false;
    dragHandle = null;

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
}

function zoomIn() {
    cropData.scale *= 1.1;
    drawCropCanvas();
}

function zoomOut() {
    cropData.scale /= 1.1;
    drawCropCanvas();
}

function toggleBrightness() {
    document.getElementById('brightnessControl').classList.toggle('hidden');
}

function adjustContrast() {
    contrast = contrast === 100 ? 120 : 100;
    applyFilters();
    showToast(`Contrast: ${contrast}%`, 'info');
}

function resetAdjustments() {
    brightness = 100;
    contrast = 100;
    saturation = 100;
    document.getElementById('brightnessSlider').value = 100;
    document.getElementById('brightnessControl').classList.add('hidden');
    applyFilters();
    showToast('Adjustments reset', 'success');
}

function applyFilters() {
    brightness = document.getElementById('brightnessSlider').value;
    drawCropCanvas();
}

function saveCropAndNext() {
    const canvas = document.getElementById('cropCanvas');
    const croppedCanvas = document.createElement('canvas');
    const ctx = croppedCanvas.getContext('2d');

    croppedCanvas.width = cropData.width;
    croppedCanvas.height = cropData.height;

    ctx.drawImage(canvas, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, cropData.width, cropData.height);

    croppedImage = new Image();
    croppedImage.src = croppedCanvas.toDataURL();

    document.getElementById('cropSection').classList.add('hidden');
    document.getElementById('borderSection').classList.remove('hidden');
    updateProgress(4);

    setTimeout(initBackgroundCanvas, 100);
    showToast('Photo cropped successfully!', 'success');
}

function showSizeSection() {
    document.getElementById('cropSection').classList.add('hidden');
    document.getElementById('sizeSection').classList.remove('hidden');
    updateProgress(2);
}

function showCropSection() {
    document.getElementById('borderSection').classList.add('hidden');
    document.getElementById('cropSection').classList.remove('hidden');
    updateProgress(3);
}

// ==================== BACKGROUND SECTION ====================
function initBackgroundCanvas() {
    const origCanvas = document.getElementById('originalBgCanvas');
    const changedCanvas = document.getElementById('changedBgCanvas');

    origCanvas.width = 300;
    origCanvas.height = 300;
    changedCanvas.width = 300;
    changedCanvas.height = 300;

    const img = croppedImage || uploadedImage;

    // Original
    const origCtx = origCanvas.getContext('2d');
    origCtx.drawImage(img, 0, 0, 300, 300);

    // Changed background
    const changedCtx = changedCanvas.getContext('2d');
    changedCtx.fillStyle = backgroundColor;
    changedCtx.fillRect(0, 0, 300, 300);
    changedCtx.drawImage(img, 25, 25, 250, 250);
}

function selectBackground(type) {
    selectedBackground = type;

    document.getElementById('bg-original').classList.remove('selected', 'border-indigo-600', 'bg-indigo-50');
    document.getElementById('bg-changed').classList.remove('selected', 'border-indigo-600', 'bg-indigo-50');

    if (type === 'original') {
        document.getElementById('bg-original').classList.add('selected', 'border-indigo-600', 'bg-indigo-50');
    } else {
        document.getElementById('bg-changed').classList.add('selected', 'border-indigo-600', 'bg-indigo-50');
    }
}

function changeBgColor() {
    backgroundColor = document.getElementById('bgColorPicker').value;
    initBackgroundCanvas();
}

// ==================== BORDER FUNCTIONS ====================
function selectBorder(type) {
    borderType = type;

    // Set color based on type
    switch (type) {
        case 'white': borderColor = '#FFFFFF'; break;
        case 'black': borderColor = '#000000'; break;
        case 'gray': borderColor = '#9CA3AF'; break;
        case 'gold': borderColor = '#FBBF24'; break;
        case 'blue': borderColor = '#3B82F6'; break;
        case 'custom': borderColor = document.getElementById('customBorderColor').value; break;
        default: borderColor = '#FFFFFF';
    }

    // Update UI
    document.querySelectorAll('.border-preset').forEach(el => {
        el.classList.remove('ring-2', 'ring-indigo-600');
    });

    if (type !== 'none') {
        const el = document.getElementById('border-' + type);
        if (el) el.classList.add('ring-2', 'ring-indigo-600');
    }

    showToast(`Border: ${type}`, 'success');
}

function selectCustomBorder() {
    borderType = 'custom';
    borderColor = document.getElementById('customBorderColor').value;

    document.querySelectorAll('.border-preset').forEach(el => {
        el.classList.remove('ring-2', 'ring-indigo-600');
    });

    showToast('Custom border selected', 'success');
}

function updateBorderSize() {
    borderSize = parseInt(document.getElementById('borderSize').value) || 4;
    if (borderSize < 1) borderSize = 1;
    if (borderSize > 20) borderSize = 20;
}

function applyBorder(ctx, canvas) {
    if (borderType !== 'none') {
        ctx.save();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderSize;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

function toggleTextInput() {
    document.getElementById('textInputSection').classList.toggle('hidden');
}

function goToDownload() {
    document.getElementById('borderSection').classList.add('hidden');
    document.getElementById('downloadSection').classList.remove('hidden');
    updateProgress(5);
    setTimeout(initDownloadCanvas, 100);
}

function showBorderSection() {
    document.getElementById('downloadSection').classList.add('hidden');
    document.getElementById('borderSection').classList.remove('hidden');
    updateProgress(4);
}

// ==================== DOWNLOAD SECTION ====================
function initDownloadCanvas() {
    const dpi = parseInt(document.getElementById('dpiInput').value);
    let pixelWidth, pixelHeight;

    // Convert to pixels
    if (selectedSize.unit === 'mm') {
        pixelWidth = Math.round((selectedSize.width / 25.4) * dpi);
        pixelHeight = Math.round((selectedSize.height / 25.4) * dpi);
    } else if (selectedSize.unit === 'cm') {
        pixelWidth = Math.round((selectedSize.width * 10 / 25.4) * dpi);
        pixelHeight = Math.round((selectedSize.height * 10 / 25.4) * dpi);
    } else if (selectedSize.unit === 'inch') {
        pixelWidth = Math.round(selectedSize.width * dpi);
        pixelHeight = Math.round(selectedSize.height * dpi);
    }

    // Single image
    const singleCanvas = document.getElementById('singleImageCanvas');
    singleCanvas.width = pixelWidth;
    singleCanvas.height = pixelHeight;
    singleCanvas.style.width = '200px';
    singleCanvas.style.height = (200 * pixelHeight / pixelWidth) + 'px';

    const ctx = singleCanvas.getContext('2d');

    if (selectedBackground === 'changed') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, pixelWidth, pixelHeight);
    }

    const img = croppedImage || uploadedImage;
    ctx.drawImage(img, 0, 0, pixelWidth, pixelHeight);

    // Add border
    applyBorder(ctx, singleCanvas);

    // Add text if checked
    if (document.getElementById('addTextCheckbox').checked) {
        const text = document.getElementById('imageText').value;
        const textSize = parseInt(document.getElementById('textSize').value) || 16;
        const textColor = document.getElementById('textColor').value;

        ctx.fillStyle = textColor;
        ctx.font = `${textSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(text, pixelWidth / 2, pixelHeight - 20);
    }

    updateLayout();
}

function updateLayout() {
    const dpi = parseInt(document.getElementById('dpiInput').value);
    let pixelWidth, pixelHeight;

    // Calculate pixel dimensions
    if (selectedSize.unit === 'mm') {
        pixelWidth = Math.round((selectedSize.width / 25.4) * dpi);
        pixelHeight = Math.round((selectedSize.height / 25.4) * dpi);
    } else if (selectedSize.unit === 'cm') {
        pixelWidth = Math.round((selectedSize.width * 10 / 25.4) * dpi);
        pixelHeight = Math.round((selectedSize.height * 10 / 25.4) * dpi);
    } else if (selectedSize.unit === 'inch') {
        pixelWidth = Math.round(selectedSize.width * dpi);
        pixelHeight = Math.round(selectedSize.height * dpi);
    }

    const multiCanvas = document.getElementById('multipleImageCanvas');
    const layout = document.querySelector('input[name="layout"]:checked')?.value || 'single';

    let rows, cols;

    if (layout === 'single') {
        multiCanvas.width = 0;
        multiCanvas.height = 0;
        return;
    } else if (layout === '2x2') {
        rows = 2;
        cols = 2;
    } else if (layout === '3x4') {
        rows = 3;
        cols = 4;
    } else if (layout === '4x6') {
        rows = 4;
        cols = 6;
    } else if (layout === 'a4') {
        // A4 paper size at given DPI
        const a4WidthPx = Math.round((210 / 25.4) * dpi);
        const a4HeightPx = Math.round((297 / 25.4) * dpi);

        cols = Math.floor(a4WidthPx / (pixelWidth + 10));
        rows = Math.floor(a4HeightPx / (pixelHeight + 10));

        cols = Math.max(1, Math.min(cols, 10));
        rows = Math.max(1, Math.min(rows, 10));

        document.getElementById('a4Info').classList.remove('hidden');
    } else if (layout === 'custom') {
        rows = parseInt(document.getElementById('customRows').value) || 2;
        cols = parseInt(document.getElementById('customCols').value) || 4;
        document.getElementById('customLayoutInput').classList.remove('hidden');
        document.getElementById('a4Info').classList.add('hidden');
    }

    const padding = 10;
    const totalWidth = cols * pixelWidth + (cols - 1) * padding;
    const totalHeight = rows * pixelHeight + (rows - 1) * padding;

    multiCanvas.width = totalWidth;
    multiCanvas.height = totalHeight;
    multiCanvas.style.width = '400px';
    multiCanvas.style.height = (400 * totalHeight / totalWidth) + 'px';

    const ctx = multiCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    const img = croppedImage || uploadedImage;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * (pixelWidth + padding);
            const y = row * (pixelHeight + padding);

            if (selectedBackground === 'changed') {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x, y, pixelWidth, pixelHeight);
            }

            ctx.drawImage(img, x, y, pixelWidth, pixelHeight);

            // Add border to each photo
            applyBorderToArea(ctx, x, y, pixelWidth, pixelHeight);

            // Add text if checked
            if (document.getElementById('addTextCheckbox').checked) {
                const text = document.getElementById('imageText').value;
                const textSize = parseInt(document.getElementById('textSize').value) || 16;
                const textColor = document.getElementById('textColor').value;

                ctx.fillStyle = textColor;
                ctx.font = `${textSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(text, x + pixelWidth / 2, y + pixelHeight - 10);
            }
        }
    }
}

function applyBorderToArea(ctx, x, y, width, height) {
    if (borderType !== 'none') {
        ctx.save();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderSize;
        ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }
}

function downloadSingle() {
    const canvas = document.getElementById('singleImageCanvas');
    const link = document.createElement('a');
    link.download = 'passport-photo-' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Photo downloaded!', 'success');
}

function downloadMultiple() {
    const canvas = document.getElementById('multipleImageCanvas');
    if (canvas.width === 0) {
        showToast('Please select a multiple layout first', 'error');
        return;
    }
    const link = document.createElement('a');
    link.download = 'passport-photos-' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Multiple photos downloaded!', 'success');
}

function resetTool() {
    if (confirm('Start over? Your current progress will be lost.')) {
        location.reload();
    }
}
