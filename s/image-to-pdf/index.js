
// State management
let images = [];
let imageElements = new Map(); // Store image elements for reordering

// DOM Elements
const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const convertBtn = document.getElementById('convertBtn');
const sortBtn = document.getElementById('sortBtn');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const countDisplay = document.getElementById('countDisplay');
const pageSizeSelect = document.getElementById('pageSize');
const orientationSelect = document.getElementById('orientation');

// Event Listeners
imageInput.addEventListener('change', (e) => handleFiles(e.target.files));
clearBtn.addEventListener('click', clearAll);
convertBtn.addEventListener('click', convertToPDF);
sortBtn.addEventListener('click', sortByName);

// Drag and drop handlers
dropZone.addEventListener('click', () => imageInput.click());

// Handle files upload
function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    let newImages = [];

    // Check total images limit
    if (images.length + files.length > 50) {
        showToast('Maximum 50 images allowed', 'error');
        return;
    }

    Array.from(files).forEach(file => {
        // Validate file type
        if (!validTypes.includes(file.type)) {
            showToast(`File ${file.name} is not supported`, 'error');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            showToast(`File ${file.name} is too large (max 10MB)`, 'error');
            return;
        }

        newImages.push(file);
    });

    if (newImages.length > 0) {
        images = [...images, ...newImages];
        updatePreview();
        showToast(`${newImages.length} image(s) uploaded successfully`, 'success');
    }
}

// Update preview with all images
function updatePreview() {
    preview.innerHTML = '';

    if (images.length === 0) {
        preview.innerHTML = '<div class="col-span-full text-center text-gray-400 py-8"><i class="fas fa-images text-4xl mb-2"></i><p>No images selected. Upload images to see preview.</p></div>';
        updateButtons();
        return;
    }

    images.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const card = createImageCard(e.target.result, file.name, index);
            preview.appendChild(card);

            // Enable drag and drop sorting
            card.setAttribute('draggable', 'true');
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('drop', handleDrop);
            card.addEventListener('dragend', handleDragEnd);
        };
        reader.readAsDataURL(file);
    });

    updateButtons();
}

// Create image card with controls
function createImageCard(src, fileName, index) {
    const card = document.createElement('div');
    card.className = 'image-card relative group';
    card.dataset.index = index;

    card.innerHTML = `
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical text-gray-600"></i>
                </div>
                <img src="${src}" class="preview-image w-full h-32 object-cover rounded-lg" alt="${fileName}">
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate rounded-b-lg">
                    ${fileName.substring(0, 15)}${fileName.length > 15 ? '...' : ''}
                </div>
                <button class="remove-btn absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110" 
                        onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;

    return card;
}

// Drag and drop functions
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.index);
    e.currentTarget.classList.add('opacity-50');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('border-2', 'border-blue-500');
}

function handleDrop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = parseInt(e.currentTarget.dataset.index);

    if (fromIndex !== toIndex) {
        // Reorder images array
        const [movedItem] = images.splice(fromIndex, 1);
        images.splice(toIndex, 0, movedItem);

        // Update preview
        updatePreview();
        showToast('Images reordered', 'info');
    }

    e.currentTarget.classList.remove('border-2', 'border-blue-500');
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('opacity-50');
    document.querySelectorAll('.image-card').forEach(card => {
        card.classList.remove('border-2', 'border-blue-500');
    });
}

// Remove single image
window.removeImage = function (index) {
    images.splice(index, 1);
    updatePreview();
    showToast('Image removed', 'info');
};

// Clear all images
function clearAll() {
    if (images.length > 0 && confirm('Are you sure you want to remove all images?')) {
        images = [];
        updatePreview();
        showToast('All images cleared', 'info');
    }
}

// Sort images by name
function sortByName() {
    images.sort((a, b) => a.name.localeCompare(b.name));
    updatePreview();
    showToast('Images sorted by name', 'success');
}

// Update buttons state
function updateButtons() {
    const hasImages = images.length > 0;
    clearBtn.disabled = !hasImages;
    convertBtn.disabled = !hasImages;
    sortBtn.disabled = !hasImages;

    countDisplay.textContent = `${images.length} image${images.length !== 1 ? 's' : ''} selected`;
}

// Convert to PDF
async function convertToPDF() {
    if (images.length === 0) {
        showToast('Please select images first', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;

    // Get settings
    const orientation = orientationSelect.value;
    const pageSize = pageSizeSelect.value;

    // Create PDF with selected settings
    const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
    });

    progress.classList.remove('hidden');
    let successCount = 0;

    for (let i = 0; i < images.length; i++) {
        try {
            const img = images[i];

            // Convert to base64
            const imgData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(img);
            });

            // Get image dimensions
            const imgProps = await new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve({
                    width: image.width,
                    height: image.height
                });
                image.onerror = reject;
                image.src = imgData;
            });

            // Calculate dimensions to fit page
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            let imgWidth, imgHeight;

            if (orientation === 'portrait') {
                imgWidth = pageWidth - 20; // 10mm margin each side
                imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                // If image height exceeds page height, scale down
                if (imgHeight > pageHeight - 20) {
                    imgHeight = pageHeight - 20;
                    imgWidth = (imgProps.width * imgHeight) / imgProps.height;
                }
            } else {
                imgHeight = pageHeight - 20;
                imgWidth = (imgProps.width * imgHeight) / imgProps.height;

                if (imgWidth > pageWidth - 20) {
                    imgWidth = pageWidth - 20;
                    imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                }
            }

            // Center the image on page
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            // Add new page if not first image
            if (i > 0) {
                doc.addPage();
            }

            // Add image to PDF
            doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

            successCount++;

            // Update progress
            const percent = Math.round(((i + 1) / images.length) * 100);
            progressBar.style.width = percent + '%';
            progressPercentage.textContent = percent + '%';

        } catch (error) {
            console.error('Error processing image:', error);
            showToast(`Error processing image ${i + 1}`, 'error');
        }
    }

    // Save PDF if at least one image was processed
    if (successCount > 0) {
        const fileName = `converted-images-${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);
        showToast(`PDF created successfully with ${successCount} images!`, 'success');
    }

    // Reset progress
    setTimeout(() => {
        progress.classList.add('hidden');
        progressBar.style.width = '0%';
        progressPercentage.textContent = '0%';
    }, 1000);
}

// Share functions
window.shareOnWhatsApp = function () {
    const text = 'Convert images to PDF free online - Fast and easy tool';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Free Image to PDF Converter - Merge multiple images into one PDF';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

// Toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
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

    toast.className = `toast-message ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300`;
    toast.innerHTML = `
                <i class="fas ${icons[type]} mr-3 text-lg"></i>
                <span>${message}</span>
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize
updateButtons();
