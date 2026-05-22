
// Initialize Lucide Icons
if (window.lucide) {
    lucide.createIcons();
} else {
    console.error("Lucide library not found");
}

// Global State
const state = {
    mode: 'idcard', // 'idcard' or 'document'
    images: {
        front: null,
        back: null
    },
    scanned: {
        front: null,
        back: null
    },
    scanPoints: {
        front: null,
        back: null
    },
    currentStep: 1,
    scanningSide: 'front', // 'front' or 'back'
    points: [],
    enhancement: 'original',
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    rotation: 0,
    layout: 'vertical',
    zoom: 1.0,
    highQuality: false,
    isCvReady: false,
    processedMat: null // Cache for the enhanced preview
};

// DOM Elements
const steps = {
    1: document.getElementById('step-1'),
    2: document.getElementById('step-2'),
    3: document.getElementById('step-3')
};

const canvas = document.getElementById('scan-canvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvas-wrapper');

// Offscreen canvas for processed preview
const offscreenCanvas = document.createElement('canvas');

// --- STEP 1: UPLOAD LOGIC ---

function setMode(mode) {
    state.mode = mode;

    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('border-blue-600', 'bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-100');
        btn.classList.add('border-slate-200', 'bg-white', 'text-slate-600');
    });
    const activeBtn = document.getElementById(`mode-${mode}`);
    activeBtn.classList.remove('border-slate-200', 'bg-white', 'text-slate-600');
    activeBtn.classList.add('border-blue-600', 'bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-100');

    // Update UI
    const grid = document.getElementById('upload-grid');
    const containerBack = document.getElementById('container-back');
    const labelFront = document.getElementById('label-front');
    const title = document.getElementById('step1-title');
    const desc = document.getElementById('step1-desc');

    if (mode === 'document') {
        grid.classList.remove('md:grid-cols-2');
        grid.classList.add('max-w-2xl');
        containerBack.classList.add('hidden');
        labelFront.innerHTML = '<i data-lucide="file-text" class="w-5 h-5"></i> Upload Document';
        title.innerText = 'Upload Document';
        desc.innerText = 'Please upload your single-side document to begin.';
        state.images.back = null; // Clear back image if switching
    } else {
        grid.classList.add('md:grid-cols-2');
        grid.classList.remove('max-w-2xl');
        containerBack.classList.remove('hidden');
        labelFront.innerHTML = '<i data-lucide="image" class="w-5 h-5"></i> Front Side';
        title.innerText = 'Upload ID Card';
        desc.innerText = 'Please upload the front and back images of your ID card to begin.';
    }

    lucide.createIcons();
    checkProceed();
}

function setupUpload(side) {
    const dropZone = document.getElementById(`drop-${side}`);
    const input = document.getElementById(`input-${side}`);
    const preview = document.getElementById(`preview-${side}`);
    const previewContainer = document.getElementById(`preview-${side}-container`);
    const prompt = document.getElementById(`upload-prompt-${side}`);

    dropZone.onclick = () => input.click();

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file, side);
    };

    dropZone.ondragover = (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-500', 'bg-blue-50');
    };

    dropZone.ondragleave = () => {
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    };

    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file, side);
    };
}

function handleFile(file, side) {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images[side] = img;
            document.getElementById(`preview-${side}`).src = e.target.result;
            document.getElementById(`preview-${side}-container`).classList.remove('hidden');
            document.getElementById(`upload-prompt-${side}`).classList.add('hidden');
            checkProceed();
            lucide.createIcons();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeImage(side) {
    state.images[side] = null;
    document.getElementById(`preview-${side}-container`).classList.add('hidden');
    document.getElementById(`upload-prompt-${side}`).classList.remove('hidden');
    document.getElementById(`input-${side}`).value = '';
    checkProceed();
    event.stopPropagation();
}

function checkProceed() {
    const btn = document.getElementById('btn-proceed');
    if (state.mode === 'document') {
        btn.disabled = !state.images.front;
    } else {
        btn.disabled = !(state.images.front && state.images.back);
    }
}

setupUpload('front');
setupUpload('back');

document.getElementById('btn-proceed').onclick = () => {
    if (!state.isCvReady) {
        alert("OpenCV engine is still loading. Please wait a moment.");
        return;
    }
    goToStep(2);
    startScanning('front');
};

// --- STEP 2: SCAN & ADJUST LOGIC ---

function startScanning(side) {
    state.scanningSide = side;
    state.rotation = 0;
    state.enhancement = 'original';
    state.brightness = 0;
    state.contrast = 0;
    state.zoom = 1.0;

    const sideLabel = document.getElementById('scan-side-label');
    const confirmBtn = document.getElementById('btn-confirm-scan');

    if (state.mode === 'document') {
        sideLabel.innerText = 'Document';
        confirmBtn.innerText = 'Confirm & Finish';
    } else {
        sideLabel.innerText = side === 'front' ? 'Front Side' : 'Back Side';
        confirmBtn.innerText = side === 'front' ? 'Confirm & Scan Back' : 'Confirm & Finish';
    }

    resetSliders();
    initCanvas();

    // Auto-detect edges after a short delay to ensure canvas is ready
    setTimeout(() => {
        autoDetectEdges();
    }, 300);
}

function initCanvas(keepPoints = false) {
    const img = state.images[state.scanningSide];

    // Calculate scale to fit in view
    const maxWidth = window.innerWidth * 0.6;
    const maxHeight = 600;

    // Handle rotation in scale calculation
    const isRotated = state.rotation % 180 !== 0;
    const imgW = isRotated ? img.height : img.width;
    const imgH = isRotated ? img.width : img.height;

    let baseScale = Math.min(maxWidth / imgW, maxHeight / imgH);
    let scale = baseScale * state.zoom;

    canvas.width = imgW * scale;
    canvas.height = imgH * scale;

    if (!keepPoints) {
        // Initial points (rectangle in center)
        const w = canvas.width;
        const h = canvas.height;
        const padding = 50;
        state.points = [
            { x: padding, y: padding }, // TL
            { x: w - padding, y: padding }, // TR
            { x: w - padding, y: h - padding }, // BR
            { x: padding, y: h - padding } // BL
        ];
    }

    updateProcessedPreview();
    createHandles();
}

function changeZoom(delta) {
    const oldZoom = state.zoom;
    state.zoom = Math.max(0.5, Math.min(3.0, state.zoom + delta));
    const factor = state.zoom / oldZoom;

    // Scale points relative to zoom
    state.points.forEach(p => {
        p.x *= factor;
        p.y *= factor;
    });

    initCanvas(true);
}

function resetZoom() {
    const oldZoom = state.zoom;
    state.zoom = 1.0;
    const factor = state.zoom / oldZoom;

    state.points.forEach(p => {
        p.x *= factor;
        p.y *= factor;
    });

    initCanvas(true);
}

function updateProcessedPreview() {
    if (!state.isCvReady) return;

    const img = state.images[state.scanningSide];
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    // Use processImage logic but for preview size
    const previewPoints = [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: canvas.width, y: canvas.height },
        { x: 0, y: canvas.height }
    ];

    // We don't want to crop for the preview, just apply rotation and filters
    // So we pass the full canvas as destination
    processImage(img, null, offscreenCanvas, true);
    renderCanvas();
}

function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the processed preview from offscreen canvas
    ctx.drawImage(offscreenCanvas, 0, 0);

    // Draw overlay polygon
    ctx.beginPath();
    ctx.moveTo(state.points[0].x, state.points[0].y);
    state.points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw semi-transparent outer area (dimmed)
    // This creates a "crop" effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(state.points[0].x, state.points[0].y);
    state.points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill('evenodd');

    // Draw inner highlight
    ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.beginPath();
    ctx.moveTo(state.points[0].x, state.points[0].y);
    state.points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
}

function createHandles() {
    // Remove existing handles
    const existing = document.querySelectorAll('.corner-handle');
    existing.forEach(h => h.remove());

    const handleContainer = canvas.parentElement;

    state.points.forEach((p, i) => {
        const handle = document.createElement('div');
        handle.className = 'corner-handle';
        handle.style.left = `${p.x}px`;
        handle.style.top = `${p.y}px`;
        handle.dataset.index = i;

        let isDragging = false;

        handle.onmousedown = (e) => {
            e.preventDefault();
            isDragging = true;
            document.onmousemove = (me) => {
                if (!isDragging) return;
                const rect = canvas.getBoundingClientRect();
                let x = me.clientX - rect.left;
                let y = me.clientY - rect.top;

                x = Math.max(0, Math.min(x, canvas.width));
                y = Math.max(0, Math.min(y, canvas.height));

                state.points[i] = { x, y };
                handle.style.left = `${x}px`;
                handle.style.top = `${y}px`;
                renderCanvas();
            };
            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        // Touch support
        handle.ontouchstart = (e) => {
            isDragging = true;
            e.preventDefault();
        };
        handle.ontouchmove = (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            let x = touch.clientX - rect.left;
            let y = touch.clientY - rect.top;
            x = Math.max(0, Math.min(x, canvas.width));
            y = Math.max(0, Math.min(y, canvas.height));
            state.points[i] = { x, y };
            handle.style.left = `${x}px`;
            handle.style.top = `${y}px`;
            renderCanvas();
        };
        handle.ontouchend = () => {
            isDragging = false;
        };

        handleContainer.appendChild(handle);
    });
}

function rotateImage(deg) {
    state.rotation = (state.rotation + deg) % 360;
    if (state.rotation < 0) state.rotation += 360;

    // Re-initialize canvas to handle new aspect ratio
    // We reset points because rotating existing points correctly is complex
    initCanvas(false);
}

function setEnhancement(mode, btn) {
    state.enhancement = mode;
    document.querySelectorAll('.enhance-btn').forEach(b => {
        b.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
    });

    const activeBtn = btn || event.currentTarget;
    activeBtn.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600', 'shadow-md');
    activeBtn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

    updateProcessedPreview();
}

// Sliders
document.getElementById('slider-brightness').oninput = (e) => {
    state.brightness = parseInt(e.target.value);
    document.getElementById('val-brightness').innerText = state.brightness;
    updateProcessedPreview();
};
document.getElementById('slider-contrast').oninput = (e) => {
    state.contrast = parseInt(e.target.value);
    document.getElementById('val-contrast').innerText = state.contrast;
    updateProcessedPreview();
};
document.getElementById('slider-sharpness').oninput = (e) => {
    state.sharpness = parseInt(e.target.value);
    document.getElementById('val-sharpness').innerText = state.sharpness;
    updateProcessedPreview();
};

function resetSliders() {
    state.brightness = 0;
    state.contrast = 0;
    state.sharpness = 0;
    document.getElementById('slider-brightness').value = 0;
    document.getElementById('slider-contrast').value = 0;
    document.getElementById('slider-sharpness').value = 0;
    document.getElementById('val-brightness').innerText = 0;
    document.getElementById('val-contrast').innerText = 0;
    document.getElementById('val-sharpness').innerText = 0;
}

function resetStep2() {
    initCanvas();
    resetSliders();
    setEnhancement('original');
}

function autoDetectEdges() {
    if (!state.isCvReady) return;
    const img = state.images[state.scanningSide];
    let src = cv.imread(img);

    // 1. Resize for faster and more consistent processing
    let maxDim = 500;
    let scale = maxDim / Math.max(src.cols, src.rows);
    let dsize = new cv.Size(src.cols * scale, src.rows * scale);
    let small = new cv.Mat();
    cv.resize(src, small, dsize, 0, 0, cv.INTER_AREA);

    // 2. Pre-process
    let gray = new cv.Mat();
    cv.cvtColor(small, gray, cv.COLOR_RGBA2GRAY);

    // Local Contrast Enhancement (CLAHE) - better for varying lighting
    let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
    let enhanced = new cv.Mat();
    clahe.apply(gray, enhanced);

    let blurred = new cv.Mat();
    cv.GaussianBlur(enhanced, blurred, new cv.Size(5, 5), 0);

    // 3. Edge Detection (Combined Canny and Thresholding)
    let edged = new cv.Mat();
    cv.Canny(blurred, edged, 30, 150);

    let thresh = new cv.Mat();
    cv.threshold(blurred, thresh, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

    // Combine them
    cv.bitwise_or(edged, thresh, edged);

    // 4. Morphological operations to close gaps
    let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(7, 7));
    cv.dilate(edged, edged, kernel);
    cv.erode(edged, edged, kernel);

    // 5. Find Contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(edged, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    let bestPoints = null;

    for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        let area = cv.contourArea(cnt);

        // Only consider large enough contours (at least 5% of image)
        if (area > (small.cols * small.rows * 0.05)) {
            // Simplify contour using convex hull
            let hull = new cv.Mat();
            cv.convexHull(cnt, hull);

            let peri = cv.arcLength(hull, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(hull, approx, 0.02 * peri, true);

            // If it has 4 points, it's a strong candidate
            if (approx.rows === 4 && area > maxArea) {
                maxArea = area;
                bestPoints = [];
                for (let j = 0; j < 4; j++) {
                    bestPoints.push({
                        x: approx.data32S[j * 2] / scale,
                        y: approx.data32S[j * 2 + 1] / scale
                    });
                }
            }
            hull.delete();
            approx.delete();
        }
    }

    // Fallback: If no 4-point contour found, try the largest contour's rotated bounding box
    if (!bestPoints) {
        let largestArea = 0;
        let largestIdx = -1;
        for (let i = 0; i < contours.size(); ++i) {
            let area = cv.contourArea(contours.get(i));
            if (area > largestArea) {
                largestArea = area;
                largestIdx = i;
            }
        }

        if (largestIdx !== -1) {
            let rotatedRect = cv.minAreaRect(contours.get(largestIdx));
            let vertices = cv.RotatedRect.points(rotatedRect);
            bestPoints = [];
            for (let i = 0; i < 4; i++) {
                bestPoints.push({
                    x: vertices[i].x / scale,
                    y: vertices[i].y / scale
                });
            }
        }
    }

    if (bestPoints) {
        // Scale points to current canvas size
        const canvasScaleX = canvas.width / src.cols;
        const canvasScaleY = canvas.height / src.rows;

        state.points = sortPoints(bestPoints.map(p => ({
            x: p.x * canvasScaleX,
            y: p.y * canvasScaleY
        })));
        renderCanvas();
        createHandles();
    } else {
        // Final fallback: default rectangle
        const w = canvas.width;
        const h = canvas.height;
        const padding = 50;
        state.points = [
            { x: padding, y: padding },
            { x: w - padding, y: padding },
            { x: w - padding, y: h - padding },
            { x: padding, y: h - padding }
        ];
        renderCanvas();
        createHandles();
    }

    // Cleanup
    src.delete(); small.delete(); gray.delete(); clahe.delete(); enhanced.delete();
    blurred.delete(); edged.delete(); thresh.delete();
    contours.delete(); hierarchy.delete(); kernel.delete();
}

// --- OPENCV PERSPECTIVE TRANSFORM ---

function confirmScan() {
    // 1. Get source points (scaled back to original image size)
    const img = state.images[state.scanningSide];
    const scaleX = img.width / canvas.width;
    const scaleY = img.height / canvas.height;

    // Sort points: TL, TR, BR, BL
    const sortedPoints = sortPoints(state.points.map(p => ({
        x: p.x * scaleX,
        y: p.y * scaleY
    })));

    // Save points for re-processing
    state.scanPoints[state.scanningSide] = sortedPoints;

    processAndSave(state.scanningSide);

    if (state.mode === 'idcard' && state.scanningSide === 'front') {
        startScanning('back');
    } else {
        goToStep(3);
        updatePrintPreview();
    }
}

function processAndSave(side) {
    const img = state.images[side];
    const sortedPoints = state.scanPoints[side];
    if (!img || !sortedPoints) return;

    const resultCanvas = document.createElement('canvas');

    // Set output dimensions based on mode and quality
    let outWidth, outHeight;
    const qFactor = state.highQuality ? 2 : 1;

    if (state.mode === 'document') {
        outWidth = 1240 * qFactor;
        outHeight = 1754 * qFactor;
    } else {
        outWidth = 1012 * qFactor;
        outHeight = 638 * qFactor;
    }

    resultCanvas.width = outWidth;
    resultCanvas.height = outHeight;

    try {
        processImage(img, sortedPoints, resultCanvas);
        state.scanned[side] = resultCanvas.toDataURL('image/jpeg', state.highQuality ? 0.98 : 0.95);
    } catch (err) {
        console.error(err);
        if (state.currentStep !== 3) alert("Error processing image. Please try again.");
    }
}

async function toggleHighQuality() {
    state.highQuality = document.getElementById('toggle-quality').checked;

    // Show loading state
    const previewArea = document.getElementById('a4-page');
    previewArea.style.opacity = '0.5';
    previewArea.style.pointerEvents = 'none';

    // Small delay to allow UI to update
    await new Promise(r => setTimeout(r, 100));

    // Re-process all scanned sides
    if (state.scanned.front) processAndSave('front');
    if (state.scanned.back) processAndSave('back');

    updatePrintPreview();

    previewArea.style.opacity = '1';
    previewArea.style.pointerEvents = 'auto';
}

function sortPoints(pts) {
    // Sort by Y to find top and bottom
    pts.sort((a, b) => a.y - b.y);
    const top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottom = pts.slice(2, 4).sort((a, b) => a.x - b.x);
    return [top[0], top[1], bottom[1], bottom[0]]; // TL, TR, BR, BL
}

function processImage(img, srcPts, dstCanvas, isPreview = false) {
    let src = cv.imread(img);

    // 1. Handle Rotation
    if (state.rotation !== 0) {
        let rotated = new cv.Mat();
        let center = new cv.Point(src.cols / 2, src.rows / 2);
        let M = cv.getRotationMatrix2D(center, -state.rotation, 1);

        // Calculate new bounding box
        let cos = Math.abs(Math.cos(state.rotation * Math.PI / 180));
        let sin = Math.abs(Math.sin(state.rotation * Math.PI / 180));
        let newW = src.cols * cos + src.rows * sin;
        let newH = src.cols * sin + src.rows * cos;

        // Adjust rotation matrix to include translation
        M.data64F[2] += (newW - src.cols) / 2;
        M.data64F[5] += (newH - src.rows) / 2;

        cv.warpAffine(src, rotated, M, new cv.Size(newW, newH), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        src.delete();
        src = rotated;
        M.delete();
    }

    let dst = new cv.Mat();
    let dsize = new cv.Size(dstCanvas.width, dstCanvas.height);

    if (!isPreview && srcPts) {
        // 2. Perspective Transform (Crop)
        let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
            srcPts[0].x, srcPts[0].y,
            srcPts[1].x, srcPts[1].y,
            srcPts[2].x, srcPts[2].y,
            srcPts[3].x, srcPts[3].y
        ]);

        let dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            dstCanvas.width, 0,
            dstCanvas.width, dstCanvas.height,
            0, dstCanvas.height
        ]);

        let M = cv.getPerspectiveTransform(srcCoords, dstCoords);
        cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        M.delete();
        srcCoords.delete();
        dstCoords.delete();
    } else {
        // For preview, just resize to fit canvas
        cv.resize(src, dst, dsize, 0, 0, cv.INTER_LINEAR);
    }

    // 3. Apply Brightness & Contrast
    if (state.brightness !== 0 || state.contrast !== 0) {
        // alpha = contrast [1.0-3.0], beta = brightness [-100, 100]
        let alpha = (state.contrast + 100) / 100;
        let beta = state.brightness;
        dst.convertTo(dst, -1, alpha, beta);
    }

    // 3.5 Apply Manual Sharpness
    let finalSharpness = state.sharpness;
    if (state.highQuality) finalSharpness += 30; // Extra boost for high quality

    if (finalSharpness > 0) {
        let blurred = new cv.Mat();
        let sigma = Math.min(5, finalSharpness / 20); // Scale 0-100 to 0-5
        cv.GaussianBlur(dst, blurred, new cv.Size(0, 0), sigma);
        let amount = finalSharpness / 50; // Scale 0-100 to 0-2
        cv.addWeighted(dst, 1 + amount, blurred, -amount, 0, dst);
        blurred.delete();
    }

    // 4. Apply Modes
    if (state.enhancement === 'magic') {
        // Convert to RGB first for CLAHE
        let rgb = new cv.Mat();
        cv.cvtColor(dst, rgb, cv.COLOR_RGBA2RGB);

        // CLAHE on L channel
        let lab = new cv.Mat();
        cv.cvtColor(rgb, lab, cv.COLOR_RGB2Lab);
        let channels = new cv.MatVector();
        cv.split(lab, channels);
        let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
        clahe.apply(channels.get(0), channels.get(0));
        cv.merge(channels, lab);
        cv.cvtColor(lab, rgb, cv.COLOR_Lab2RGB);

        // Sharpening
        let blurred = new cv.Mat();
        cv.GaussianBlur(rgb, blurred, new cv.Size(0, 0), 3);
        cv.addWeighted(rgb, 1.5, blurred, -0.5, 0, rgb);

        cv.cvtColor(rgb, dst, cv.COLOR_RGB2RGBA);

        rgb.delete(); lab.delete(); channels.delete(); clahe.delete(); blurred.delete();
    } else if (state.enhancement === 'clear') {
        // Aggressive sharpening and contrast for text clarity
        let rgb = new cv.Mat();
        cv.cvtColor(dst, rgb, cv.COLOR_RGBA2RGB);

        // 1. Denoise slightly to avoid amplifying noise
        let denoised = new cv.Mat();
        cv.bilateralFilter(rgb, denoised, 5, 75, 75);

        // 2. Aggressive Sharpening (Unsharp Mask)
        let blurred = new cv.Mat();
        cv.GaussianBlur(denoised, blurred, new cv.Size(0, 0), 2);
        cv.addWeighted(denoised, 2.0, blurred, -1.0, 0, rgb);

        // 3. Contrast Enhancement (CLAHE)
        let lab = new cv.Mat();
        cv.cvtColor(rgb, lab, cv.COLOR_RGB2Lab);
        let channels = new cv.MatVector();
        cv.split(lab, channels);
        let clahe = new cv.CLAHE(3.0, new cv.Size(8, 8));
        clahe.apply(channels.get(0), channels.get(0));
        cv.merge(channels, lab);
        cv.cvtColor(lab, rgb, cv.COLOR_Lab2RGB);

        cv.cvtColor(rgb, dst, cv.COLOR_RGB2RGBA);

        rgb.delete(); denoised.delete(); blurred.delete(); lab.delete(); channels.delete(); clahe.delete();
    } else if (state.enhancement === 'bw') {
        // High-quality Grayscale with slight smoothing to remove noise
        cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);
        let ksize = new cv.Size(3, 3);
        cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
    }

    cv.imshow(dstCanvas, dst);

    // Cleanup
    src.delete(); dst.delete();
}

// --- STEP 3: PRINT LAYOUT LOGIC ---

function setLayout(mode) {
    state.layout = mode;
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600', 'shadow-md');
        btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
    });
    const activeBtn = document.getElementById(`layout-${mode}`);
    activeBtn.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600', 'shadow-md');
    activeBtn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
    updatePrintPreview();
}

function updatePrintPreview() {
    const container = document.getElementById('print-content');
    const showBorder = document.getElementById('toggle-border').checked;
    container.innerHTML = '';

    // Adjust layout classes
    const isVertical = state.layout === 'vertical';
    const isDocument = state.mode === 'document';

    // Use flex-nowrap for horizontal to force side-by-side preview
    container.className = `w-full h-full p-4 md:p-10 flex ${isVertical ? 'flex-col' : 'flex-row flex-nowrap'} items-center justify-center gap-4 md:gap-8`;

    const sides = isDocument ? ['front'] : ['front', 'back'];

    sides.forEach(side => {
        if (state.scanned[side]) {
            const img = document.createElement('img');
            img.src = state.scanned[side];

            if (isDocument) {
                // Document fills more of the page
                img.style.width = '85%';
                img.style.maxWidth = '500px';
            } else {
                if (isVertical) {
                    img.style.width = '70%';
                    img.style.maxWidth = '320px';
                } else {
                    img.style.width = '45%';
                    img.style.maxWidth = '260px';
                }
            }

            img.className = `shadow-md transition-all ${showBorder ? 'border-2 border-slate-400' : 'border-0'}`;
            container.appendChild(img);
        }
    });
}

// --- OUTPUT FEATURES ---

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

async function downloadJPG() {
    if (!state.scanned.front || (state.mode === 'idcard' && !state.scanned.back)) {
        alert("Please complete scanning first.");
        return;
    }

    try {
        const printCanvas = document.createElement('canvas');
        const ctx = printCanvas.getContext('2d');

        // A4 at 300 DPI: 2480 x 3508
        printCanvas.width = 2480;
        printCanvas.height = 3508;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);

        const showBorder = document.getElementById('toggle-border').checked;
        const margin = 200;
        const gap = 150;

        const frontImg = await loadImage(state.scanned.front);
        ctx.strokeStyle = '#94a3b8'; // slate-400
        ctx.lineWidth = 4;

        if (state.mode === 'document') {
            // Document Layout (Centered and Large)
            const docW = 1800; // Large enough for A4
            const docH = (docW * frontImg.height) / frontImg.width;
            const x = (printCanvas.width - docW) / 2;
            const y = (printCanvas.height - docH) / 2;

            ctx.drawImage(frontImg, x, y, docW, docH);
            if (showBorder) ctx.strokeRect(x, y, docW, docH);
        } else {
            // ID Card Layout
            const cardW = 1012; // 85.6mm at 300 DPI
            const cardH = 638;  // 53.98mm at 300 DPI
            const backImg = await loadImage(state.scanned.back);

            if (state.layout === 'vertical') {
                let x = (printCanvas.width - cardW) / 2;
                let y = margin;

                ctx.drawImage(frontImg, x, y, cardW, cardH);
                if (showBorder) ctx.strokeRect(x, y, cardW, cardH);

                y += cardH + gap;
                ctx.drawImage(backImg, x, y, cardW, cardH);
                if (showBorder) ctx.strokeRect(x, y, cardW, cardH);
            } else {
                // Horizontal (Side by Side)
                let totalW = (cardW * 2) + gap;
                let x = (printCanvas.width - totalW) / 2;
                let y = margin;

                ctx.drawImage(frontImg, x, y, cardW, cardH);
                if (showBorder) ctx.strokeRect(x, y, cardW, cardH);

                x += cardW + gap;
                ctx.drawImage(backImg, x, y, cardW, cardH);
                if (showBorder) ctx.strokeRect(x, y, cardW, cardH);
            }
        }

        const link = document.createElement('a');
        link.download = `Scanned_${state.mode}.jpg`;
        link.href = printCanvas.toDataURL('image/jpeg', 0.9);
        link.click();
    } catch (error) {
        console.error("JPG Download Error:", error);
        alert("Failed to generate JPG. Please try again.");
    }
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const showBorder = document.getElementById('toggle-border').checked;

    if (state.mode === 'document') {
        const docW = 170; // mm
        const img = await loadImage(state.scanned.front);
        const docH = (docW * img.height) / img.width;
        const x = (210 - docW) / 2;
        const y = (297 - docH) / 2;

        doc.addImage(state.scanned.front, 'JPEG', x, y, docW, docH);
        if (showBorder) doc.rect(x, y, docW, docH);
    } else {
        const cardW = 85.6;
        const cardH = 53.98;
        const margin = 20;

        let x = (210 - cardW) / 2;
        let y = margin;

        if (state.layout === 'vertical') {
            doc.addImage(state.scanned.front, 'JPEG', x, y, cardW, cardH);
            if (showBorder) doc.rect(x, y, cardW, cardH);

            y += cardH + 10;
            doc.addImage(state.scanned.back, 'JPEG', x, y, cardW, cardH);
            if (showBorder) doc.rect(x, y, cardW, cardH);
        } else {
            // Horizontal layout in PDF
            x = (210 - (cardW * 2 + 10)) / 2;
            y = margin;

            doc.addImage(state.scanned.front, 'JPEG', x, y, cardW, cardH);
            if (showBorder) doc.rect(x, y, cardW, cardH);

            x += cardW + 10;
            doc.addImage(state.scanned.back, 'JPEG', x, y, cardW, cardH);
            if (showBorder) doc.rect(x, y, cardW, cardH);
        }
    }

    doc.save(`Scanned_${state.mode}.pdf`);
}

function triggerPrint() {
    // Ensure the preview is updated before printing
    updatePrintPreview();
    setTimeout(() => {
        window.print();
    }, 500);
}

// --- UTILS ---

function goToStep(step) {
    Object.values(steps).forEach(s => {
        s.classList.add('hidden-step');
        s.classList.remove('active-step');
    });
    steps[step].classList.remove('hidden-step');
    steps[step].classList.add('active-step');
    state.currentStep = step;

    // Update Progress Bar
    const progressLine = document.getElementById('progress-line');
    const stepDots = [
        document.getElementById('step-dot-1'),
        document.getElementById('step-dot-2'),
        document.getElementById('step-dot-3')
    ];

    const progressWidth = ((step - 1) / 2) * 100;
    progressLine.style.width = `${progressWidth}%`;

    stepDots.forEach((dot, i) => {
        if (i + 1 < step) {
            dot.classList.remove('bg-white', 'border-slate-200', 'text-slate-400', 'bg-blue-600', 'text-white', 'border-blue-600');
            dot.classList.add('bg-emerald-500', 'text-white', 'border-emerald-500');
            dot.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else if (i + 1 === step) {
            dot.classList.remove('bg-white', 'border-slate-200', 'text-slate-400', 'bg-emerald-500', 'text-white', 'border-emerald-500');
            dot.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-lg', 'shadow-blue-200');
            dot.innerHTML = i + 1;
        } else {
            dot.classList.remove('bg-blue-600', 'text-white', 'border-blue-600', 'bg-emerald-500', 'border-emerald-500', 'shadow-lg', 'shadow-blue-200');
            dot.classList.add('bg-white', 'border-2', 'border-slate-200', 'text-slate-400');
            dot.innerHTML = i + 1;
        }
    });
    if (window.lucide) lucide.createIcons();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
