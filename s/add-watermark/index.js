
// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

// Global variables
let pdfFile = null;
let pdfDoc = null;
let watermarkImg = null;
let pageWidth = 0;
let pageHeight = 0;

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const loading = document.getElementById('loading');
const controls = document.getElementById('controls');
const preview = document.getElementById('preview');
const ctx = preview.getContext('2d');
const fileName = document.getElementById('fileName');
const pageCount = document.getElementById('pageCount');
const pageSize = document.getElementById('pageSize');
const toast = document.getElementById('toast');

// Browse button click
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Drop zone click
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// File input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Handle file selection
async function handleFile(file) {
    if (file.type !== 'application/pdf') {
        showToast('Please select a PDF file', 'error');
        return;
    }

    pdfFile = file;
    fileName.textContent = file.name;

    // Show loading, hide drop zone
    dropZone.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // Read file
        const arrayBuffer = await readFile(file);

        // Load PDF
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;

        // Update page count
        pageCount.textContent = pdfDoc.numPages;

        // Render first page
        await renderPage(1);

        // Show controls
        loading.classList.add('hidden');
        controls.classList.remove('hidden');

        showToast('PDF loaded successfully!', 'success');

    } catch (error) {
        console.error('Error:', error);
        showToast('Error loading PDF', 'error');
        loading.classList.add('hidden');
        dropZone.classList.remove('hidden');
    }
}

// Read file as ArrayBuffer
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Render PDF page
async function renderPage(pageNum) {
    try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });

        pageWidth = viewport.width;
        pageHeight = viewport.height;

        // Show page size
        pageSize.textContent = Math.round(pageWidth) + ' x ' + Math.round(pageHeight) + ' pts';

        preview.width = viewport.width;
        preview.height = viewport.height;

        await page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise;

    } catch (error) {
        console.error('Render error:', error);
    }
}

// Tab switching
document.getElementById('textTab').addEventListener('click', function () {
    document.getElementById('textTab').classList.add('active');
    document.getElementById('imageTab').classList.remove('active');
    document.getElementById('textControls').classList.remove('hidden');
    document.getElementById('imageControls').classList.add('hidden');
    document.getElementById('colorControl').classList.remove('hidden');
});

document.getElementById('imageTab').addEventListener('click', function () {
    document.getElementById('imageTab').classList.add('active');
    document.getElementById('textTab').classList.remove('active');
    document.getElementById('textControls').classList.add('hidden');
    document.getElementById('imageControls').classList.remove('hidden');
    document.getElementById('colorControl').classList.add('hidden');
});

// Image upload
document.getElementById('imageInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const arrayBuffer = await readFile(file);
        const tempPdf = await PDFLib.PDFDocument.create();

        if (file.type === 'image/png') {
            watermarkImg = await tempPdf.embedPng(new Uint8Array(arrayBuffer));
        } else {
            watermarkImg = await tempPdf.embedJpg(new Uint8Array(arrayBuffer));
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);

        showToast('Image loaded successfully!', 'success');

    } catch (error) {
        console.error('Image error:', error);
        showToast('Error loading image', 'error');
    }
});

// Process button
document.getElementById('processBtn').addEventListener('click', async () => {
    if (!pdfFile) {
        showToast('Please upload a PDF first', 'error');
        return;
    }

    const isText = document.getElementById('textTab').classList.contains('active');

    if (isText && !document.getElementById('watermarkText').value) {
        showToast('Please enter watermark text', 'error');
        return;
    }

    if (!isText && !watermarkImg) {
        showToast('Please upload an image', 'error');
        return;
    }

    const btn = document.getElementById('processBtn');
    const status = document.getElementById('status');

    btn.disabled = true;
    status.classList.remove('hidden');
    status.innerHTML = '<div class="flex items-center justify-center"><div class="spinner-small mr-3"></div>Adding watermark...</div>';

    try {
        // Read PDF
        const arrayBuffer = await readFile(pdfFile);
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

        // Get settings
        const opacity = parseFloat(document.getElementById('opacity').value);
        const rotation = parseInt(document.getElementById('diagonalStyle').value);
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const imageScale = parseFloat(document.getElementById('imageScale').value);
        const autoAdjust = document.getElementById('autoAdjust').checked;

        // Get font
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        // Get color
        const color = document.getElementById('textColor').value;
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;

        // Process pages
        const pages = pdfDoc.getPages();

        for (const page of pages) {
            const { width, height } = page.getSize();

            // Center position - FIXED
            const centerX = width / 2;
            const centerY = height / 2;

            if (isText) {
                // Calculate max allowed font size
                let finalFontSize = fontSize;

                if (autoAdjust) {
                    const textLength = document.getElementById('watermarkText').value.length;
                    const estimatedWidth = finalFontSize * textLength * 0.6;
                    const maxAllowedWidth = width * 0.8;

                    if (estimatedWidth > maxAllowedWidth) {
                        finalFontSize = Math.floor((maxAllowedWidth) / (textLength * 0.6));
                        finalFontSize = Math.max(finalFontSize, 16);
                    }

                    if (finalFontSize > height * 0.3) {
                        finalFontSize = height * 0.3;
                    }
                }

                // Draw text at center
                page.drawText(document.getElementById('watermarkText').value, {
                    x: centerX,
                    y: centerY,
                    size: finalFontSize,
                    font: font,
                    color: PDFLib.rgb(r, g, b),
                    opacity: opacity,
                    rotate: PDFLib.degrees(rotation)
                });
            } else {
                // Image watermark
                if (watermarkImg) {
                    let imgWidth = watermarkImg.width * imageScale;
                    let imgHeight = watermarkImg.height * imageScale;

                    if (autoAdjust) {
                        const maxWidth = width * 0.7;
                        const maxHeight = height * 0.7;

                        if (imgWidth > maxWidth) {
                            const ratio = maxWidth / imgWidth;
                            imgWidth = maxWidth;
                            imgHeight = watermarkImg.height * imageScale * ratio;
                        }

                        if (imgHeight > maxHeight) {
                            const ratio = maxHeight / imgHeight;
                            imgHeight = maxHeight;
                            imgWidth = watermarkImg.width * imageScale * ratio;
                        }
                    }

                    // Draw image centered
                    page.drawImage(watermarkImg, {
                        x: centerX - imgWidth / 2,
                        y: centerY - imgHeight / 2,
                        width: imgWidth,
                        height: imgHeight,
                        opacity: opacity,
                        rotate: PDFLib.degrees(rotation)
                    });
                }
            }
        }

        // Save PDF
        const pdfBytes = await pdfDoc.save();

        // Download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'watermarked_' + pdfFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('✅ Watermark added! PDF downloaded successfully.', 'success');
        status.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Watermark added successfully!';

    } catch (error) {
        console.error('Error:', error);
        showToast('Error: ' + error.message, 'error');
        status.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Failed to add watermark';
    } finally {
        btn.disabled = false;
        setTimeout(() => status.classList.add('hidden'), 3000);
    }
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset everything?')) {
        location.reload();
    }
});

// Show toast
function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast bg-${type === 'success' ? 'green-600' : 'red-600'}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Share functions
window.shareOnWhatsApp = function () {
    const text = 'Add Watermark to PDF - Free Online Tool by Smart CSC Tools';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Add Watermark to PDF - Free Online Tool';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};
