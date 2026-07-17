
// Wait for document to be ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded');

    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const browseBtn = document.getElementById('browseBtn');
    const compressBox = document.getElementById('compressBox');
    const status = document.getElementById('status');
    const canvas = document.getElementById('imageCanvas');
    const resultBox = document.getElementById('resultBox');
    const compressedPreview = document.getElementById('compressedPreview');
    const qualityRange = document.getElementById('qualityRange');
    const qualityValue = document.getElementById('qualityValue');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const compressBtn = document.getElementById('compressBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const compressNewBtn = document.getElementById('compressNewBtn');

    let selectedImage = null;
    let originalFileSize = 0;
    const ctx = canvas.getContext('2d');

    // Quality range display
    if (qualityRange) {
        qualityRange.addEventListener('input', function () {
            const value = Math.round(this.value * 100);
            qualityValue.textContent = value + '%';
        });
    }

    // Browse button click
    if (browseBtn) {
        browseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Browse button clicked');
            imageInput.click();
        });
    }

    // Drop zone click
    if (dropZone) {
        dropZone.addEventListener('click', function (e) {
            // Don't trigger if browse button was clicked
            if (e.target === browseBtn || browseBtn.contains(e.target)) {
                return;
            }
            console.log('Drop zone clicked');
            imageInput.click();
        });
    }

    // Drop zone keyboard
    if (dropZone) {
        dropZone.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                imageInput.click();
            }
        });
    }

    // Drag and drop events
    if (dropZone) {
        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', function () {
            this.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length) {
                handleImageUpload(files[0]);
            }
        });
    }

    // File input change
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            console.log('File input changed');
            if (this.files.length) {
                handleImageUpload(this.files[0]);
            }
        });
    }

    // Handle image upload
    function handleImageUpload(file) {
        console.log('Handling image upload:', file.name);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            showToast('Image size should be less than 50MB', 'error');
            return;
        }

        selectedImage = file;
        originalFileSize = file.size;

        // Display original size
        if (originalSize) {
            originalSize.textContent = formatFileSize(file.size);
        }

        if (dropZone) dropZone.style.display = 'none';
        if (compressBox) compressBox.classList.remove('hidden');

        renderImage(file);
        showToast('Image uploaded successfully!', 'success');
    }

    // Render image on canvas
    function renderImage(file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();

            img.onload = function () {
                // Limit maximum dimensions for performance
                const maxWidth = 1200;
                const maxHeight = 1200;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    } else {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    // Compress image
    if (compressBtn) {
        compressBtn.addEventListener('click', function () {
            if (!selectedImage) {
                showToast('Please upload an image first', 'error');
                return;
            }

            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Compressing...';
            if (status) status.classList.remove('hidden');
            if (resultBox) resultBox.classList.add('hidden');

            setTimeout(function () {
                try {
                    const quality = parseFloat(qualityRange.value);
                    const img = new Image();

                    img.onload = function () {
                        const compressCanvas = document.createElement('canvas');
                        compressCanvas.width = img.width;
                        compressCanvas.height = img.height;
                        const context = compressCanvas.getContext('2d');
                        context.drawImage(img, 0, 0);

                        compressCanvas.toBlob(function (blob) {
                            const url = URL.createObjectURL(blob);
                            compressedPreview.src = url;

                            // Display compressed size
                            if (compressedSize) {
                                compressedSize.textContent = formatFileSize(blob.size);
                            }

                            // Calculate savings
                            const savings = ((originalFileSize - blob.size) / originalFileSize * 100).toFixed(1);

                            if (resultBox) resultBox.classList.remove('hidden');
                            if (status) status.classList.add('hidden');

                            showToast(`Compressed! Saved ${savings}%`, 'success');

                            // Store blob URL for download
                            downloadBtn.dataset.blobUrl = url;

                        }, 'image/jpeg', quality);
                    };

                    img.src = canvas.toDataURL();

                } catch (error) {
                    console.error('Compression error:', error);
                    showToast('Failed to compress image', 'error');
                    if (status) status.classList.add('hidden');
                } finally {
                    compressBtn.disabled = false;
                    compressBtn.innerHTML = '<i class="fas fa-compress-alt mr-2"></i>Compress';
                }
            }, 100);
        });
    }

    // Download compressed image
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const url = this.dataset.blobUrl;

            if (!url) {
                showToast('No compressed image available', 'error');
                return;
            }

            const link = document.createElement('a');
            link.href = url;
            link.download = 'compressed_' + (selectedImage ? selectedImage.name : 'image.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Download started!', 'success');
        });
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            qualityRange.value = 0.7;
            qualityValue.textContent = '70%';

            if (selectedImage) {
                renderImage(selectedImage);
            }

            showToast('Settings reset', 'info');
        });
    }

    // Compress new image
    if (compressNewBtn) {
        compressNewBtn.addEventListener('click', function () {
            // Clear everything
            selectedImage = null;
            if (compressBox) compressBox.classList.add('hidden');
            if (dropZone) dropZone.style.display = 'block';
            if (resultBox) resultBox.classList.add('hidden');

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (compressedPreview) compressedPreview.src = '';
            if (imageInput) imageInput.value = '';

            // Clean up blob URL
            const url = downloadBtn.dataset.blobUrl;
            if (url) {
                URL.revokeObjectURL(url);
                delete downloadBtn.dataset.blobUrl;
            }

            showToast('Ready for new image!', 'info');
        });
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

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

        const toast = document.createElement('div');
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
});

// Share functions
window.shareOnWhatsApp = function () {
    const text = 'Check out this free Image Compressor - Compress images online without losing quality';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

window.shareOnFacebook = function () {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

window.shareOnTwitter = function () {
    const text = 'Free Image Compressor - Reduce image size online without quality loss';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

// FAQ toggle
window.toggleFAQ = function (button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');

    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        content.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
};
