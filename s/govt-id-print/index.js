
// ==================== STATE MANAGEMENT ====================
let currentSide = 'front';
let currentOrientation = 'portrait';
let customWidth = 85.6;
let customHeight = 54;
let backgroundColor = '#ffffff';
let borderRadius = 16;
let moveStep = 1; // Default to 1px for smooth movement

// Print Layout Variables
let paperSize = 'a4'; // 'a4', 'letter', or '4x6'
let cardCount = 1;
let horizontalGap = 5; // mm
let verticalGap = 5; // mm
let marginVertical = 10; // mm
let marginHorizontal = 10; // mm
let printSide = 'both'; // 'front', 'back', or 'both'

// Image data storage
const images = {
    front: {
        file: null,
        src: null,
        originalWidth: 0,
        originalHeight: 0,
        aspectRatio: 1.585,
        transformations: {
            scale: 1,
            rotate: 0,
            flipH: 1,
            flipV: 1,
            filter: 'none',
            brightness: 100,
            contrast: 100,
            x: 0,
            y: 0
        }
    },
    back: {
        file: null,
        src: null,
        originalWidth: 0,
        originalHeight: 0,
        aspectRatio: 1.585,
        transformations: {
            scale: 1,
            rotate: 0,
            flipH: 1,
            flipV: 1,
            filter: 'none',
            brightness: 100,
            contrast: 100,
            x: 0,
            y: 0
        }
    }
};

// DOM Elements
const elements = {
    frontUpload: document.getElementById('front-upload'),
    backUpload: document.getElementById('back-upload'),
    frontPlaceholder: document.getElementById('front-placeholder'),
    backPlaceholder: document.getElementById('back-placeholder'),
    frontPreviewContainer: document.getElementById('front-preview-container'),
    backPreviewContainer: document.getElementById('back-preview-container'),
    frontPreview: document.getElementById('front-preview'),
    backPreview: document.getElementById('back-preview'),
    frontLiveImg: document.getElementById('front-live-img'),
    backLiveImg: document.getElementById('back-live-img'),
    frontNoImage: document.getElementById('front-no-image'),
    backNoImage: document.getElementById('back-no-image'),
    frontLivePreview: document.getElementById('front-live-preview'),
    backLivePreview: document.getElementById('back-live-preview'),
    selectFront: document.getElementById('select-front'),
    selectBack: document.getElementById('select-back'),
    activeSide: document.getElementById('active-side'),
    positionDisplay: document.getElementById('position-display'),
    xSlider: document.getElementById('x-slider'),
    ySlider: document.getElementById('y-slider'),
    xValue: document.getElementById('x-value'),
    yValue: document.getElementById('y-value'),
    toast: document.getElementById('toast'),
    loading: document.getElementById('loading'),
    portraitMode: document.getElementById('portrait-mode'),
    landscapeMode: document.getElementById('landscape-mode'),
    sizeInfo: document.getElementById('size-info'),
    sizeMessage: document.getElementById('size-message'),
    frontDimensions: document.getElementById('front-dimensions'),
    backDimensions: document.getElementById('back-dimensions'),
    frontSizeInfo: document.getElementById('front-size-info'),
    backSizeInfo: document.getElementById('back-size-info'),
    frontDimensionsText: document.getElementById('front-dimensions-text'),
    backDimensionsText: document.getElementById('back-dimensions-text'),
    currentOrientation: document.getElementById('current-orientation'),
    cardSizeDisplay: document.getElementById('card-size-display'),
    dimensionCompare: document.getElementById('dimension-compare'),
    compareFront: document.getElementById('compare-front'),
    compareBack: document.getElementById('compare-back'),
    matchStatus: document.getElementById('match-status'),
    customSizePanel: document.getElementById('custom-size-panel'),
    customWidth: document.getElementById('custom-width'),
    customHeight: document.getElementById('custom-height'),
    radiusValue: document.getElementById('radius-value'),
    // Print layout elements
    normalPreview: document.getElementById('normal-preview'),
    printPreview: document.getElementById('print-preview'),
    tabNormal: document.getElementById('tab-normal'),
    tabPrint: document.getElementById('tab-print'),
    printGrid: document.getElementById('print-grid'),
    photoPaperContainer: document.getElementById('photo-paper-container'),
    paperIndicator: document.getElementById('paper-indicator'),
    paperSizeDisplay: document.getElementById('paper-size-display'),
    cardsPerPage: document.getElementById('cards-per-page'),
    cardCountInput: document.getElementById('card-count'),
    paperA4: document.getElementById('paper-a4'),
    paperLetter: document.getElementById('paper-letter'),
    paper4x6: document.getElementById('paper-4x6'),
    cardCountContainer: document.getElementById('card-count-container'),
    spacingOptions: document.getElementById('spacing-options'),
    photoPaperInfo: document.getElementById('photo-paper-info'),
    cardCountHint: document.getElementById('card-count-hint')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Setup file upload listeners
    elements.frontUpload.addEventListener('change', function (e) {
        handleImageUpload(e, 'front');
    });

    elements.backUpload.addEventListener('change', function (e) {
        handleImageUpload(e, 'back');
    });

    // Double-click to reset position
    elements.frontLiveImg.addEventListener('dblclick', function () {
        if (currentSide === 'front') centerImage();
    });
    elements.backLiveImg.addEventListener('dblclick', function () {
        if (currentSide === 'back') centerImage();
    });

    // Set default orientation
    updateOrientation();

    // Initialize step buttons - set 1px as active by default
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.step-btn').forEach(b => {
                b.classList.remove('bg-blue-50', 'border-blue-300');
            });
            this.classList.add('bg-blue-50', 'border-blue-300');
        });
    });
    // Set 1px as active
    document.querySelector('.step-btn[data-step="1"]').classList.add('bg-blue-50', 'border-blue-300');

    // Initialize print layout listeners
    elements.cardCountInput.addEventListener('change', function () {
        cardCount = parseInt(this.value) || 1;
        if (cardCount < 1) cardCount = 1;
        if (cardCount > 20) cardCount = 20;
        this.value = cardCount;
        updateCardCountDisplay();
        if (!elements.printPreview.classList.contains('hidden')) {
            generatePrintLayout();
        }
    });
});

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
    if (tab === 'normal') {
        elements.normalPreview.classList.remove('hidden');
        elements.printPreview.classList.add('hidden');
        elements.tabNormal.className = 'flex-1 py-3 px-4 text-center font-medium bg-blue-600 text-white';
        elements.tabPrint.className = 'flex-1 py-3 px-4 text-center font-medium bg-gray-100 text-gray-600 hover:bg-gray-200';
    } else {
        elements.normalPreview.classList.add('hidden');
        elements.printPreview.classList.remove('hidden');
        elements.tabPrint.className = 'flex-1 py-3 px-4 text-center font-medium bg-blue-600 text-white';
        elements.tabNormal.className = 'flex-1 py-3 px-4 text-center font-medium bg-gray-100 text-gray-600 hover:bg-gray-200';
        generatePrintLayout();
    }
}

// ==================== PRINT LAYOUT FUNCTIONS ====================
function setPaperSize(size) {
    paperSize = size;

    // Update UI
    if (size === 'a4') {
        elements.paperA4.className = 'paper-size-btn active flex-1 text-center';
        elements.paperLetter.className = 'paper-size-btn flex-1 text-center';
        elements.paper4x6.className = 'paper-size-btn flex-1 text-center';
        elements.paperIndicator.textContent = 'A4 (210×297mm)';
        elements.paperSizeDisplay.textContent = 'A4 Paper';

        // Show/hide relevant controls
        elements.cardCountContainer.classList.remove('hidden');
        elements.spacingOptions.classList.remove('hidden');
        elements.photoPaperInfo.classList.add('hidden');
        elements.cardCountHint.innerHTML = '<i class="fas fa-info-circle mr-1"></i>Each card shows both sides side-by-side | Cards stack vertically from top';

    } else if (size === 'letter') {
        elements.paperLetter.className = 'paper-size-btn active flex-1 text-center';
        elements.paperA4.className = 'paper-size-btn flex-1 text-center';
        elements.paper4x6.className = 'paper-size-btn flex-1 text-center';
        elements.paperIndicator.textContent = 'Letter (216×279mm)';
        elements.paperSizeDisplay.textContent = 'Letter Paper';

        // Show/hide relevant controls
        elements.cardCountContainer.classList.remove('hidden');
        elements.spacingOptions.classList.remove('hidden');
        elements.photoPaperInfo.classList.add('hidden');
        elements.cardCountHint.innerHTML = '<i class="fas fa-info-circle mr-1"></i>Each card shows both sides side-by-side | Cards stack vertically from top';

    } else if (size === '4x6') {
        elements.paper4x6.className = 'paper-size-btn active flex-1 text-center';
        elements.paperA4.className = 'paper-size-btn flex-1 text-center';
        elements.paperLetter.className = 'paper-size-btn flex-1 text-center';
        elements.paperIndicator.textContent = '4×6 (102×152mm)';
        elements.paperSizeDisplay.textContent = '4×6 Photo Paper';

        // Show/hide relevant controls
        elements.cardCountContainer.classList.add('hidden');
        elements.spacingOptions.classList.add('hidden');
        elements.photoPaperInfo.classList.remove('hidden');
    }

    if (!elements.printPreview.classList.contains('hidden')) {
        generatePrintLayout();
    }
}

function updateCardCount(value) {
    cardCount = parseInt(value) || 1;
    updateCardCountDisplay();
}

function updateCardCountDisplay() {
    if (cardCount === 1) {
        elements.cardsPerPage.textContent = '1 Card (Both Sides)';
    } else {
        elements.cardsPerPage.textContent = cardCount + ' Cards (Each with both sides)';
    }
}

function generatePrintLayout() {
    if (!images.front.src && !images.back.src) {
        showToast('Please upload at least one image first', 'warning');
        return;
    }

    // Hide both containers initially
    elements.printGrid.classList.add('hidden');
    elements.photoPaperContainer.classList.add('hidden');

    if (paperSize === '4x6') {
        // Generate 4x6 photo paper layout
        generatePhotoPaperLayout();
    } else {
        // Generate A4/Letter layout - FIXED: Each card shows both sides side-by-side
        generateStandardLayout();
    }
}

function generatePhotoPaperLayout() {
    // Clear photo paper container
    elements.photoPaperContainer.innerHTML = '';
    elements.photoPaperContainer.classList.remove('hidden');

    // 4x6 paper dimensions in mm
    const paperWidth = 102; // 4 inches = 101.6mm ≈ 102mm
    const paperHeight = 152; // 6 inches = 152.4mm ≈ 152mm

    // Card dimensions
    const cardWidth = 85.6;
    const cardHeight = 54;

    // Calculate vertical spacing - align to top
    const gapBetweenCards = 5; // 5mm gap between front and back

    // Create front card
    const frontCard = document.createElement('div');
    frontCard.className = 'photo-paper-card';

    const frontLabel = document.createElement('span');
    frontLabel.className = 'photo-paper-label';
    frontLabel.textContent = 'FRONT';
    frontCard.appendChild(frontLabel);

    if (images.front && images.front.src) {
        const img = document.createElement('img');
        img.src = images.front.src;
        img.alt = 'Front ID';

        // Apply transformations
        const trans = images.front.transformations;
        img.style.transform = `scale(${trans.scale}) rotate(${trans.rotate}deg) scaleX(${trans.flipH}) scaleY(${trans.flipV}) translate(${trans.x}px, ${trans.y}px)`;
        img.style.filter = trans.filter;

        frontCard.appendChild(img);
    } else {
        frontCard.classList.add('print-placeholder');
        frontCard.innerHTML = '<span>No front image</span>';
    }

    // Create back card
    const backCard = document.createElement('div');
    backCard.className = 'photo-paper-card';

    const backLabel = document.createElement('span');
    backLabel.className = 'photo-paper-label';
    backLabel.textContent = 'BACK';
    backCard.appendChild(backLabel);

    if (images.back && images.back.src) {
        const img = document.createElement('img');
        img.src = images.back.src;
        img.alt = 'Back ID';

        // Apply transformations
        const trans = images.back.transformations;
        img.style.transform = `scale(${trans.scale}) rotate(${trans.rotate}deg) scaleX(${trans.flipH}) scaleY(${trans.flipV}) translate(${trans.x}px, ${trans.y}px)`;
        img.style.filter = trans.filter;

        backCard.appendChild(img);
    } else {
        backCard.classList.add('print-placeholder');
        backCard.innerHTML = '<span>No back image</span>';
    }

    // Add cards to container (top alignment)
    elements.photoPaperContainer.appendChild(frontCard);
    elements.photoPaperContainer.appendChild(backCard);

    // Update display
    elements.cardsPerPage.textContent = 'Front (top) + Back (bottom)';
    elements.paperSizeDisplay.textContent = '4×6 Photo Paper';

    showToast('4×6 photo paper layout generated: Front on top, Back on bottom', 'success');
}

function generateStandardLayout() {
    elements.printGrid.classList.remove('hidden');

    // Get paper dimensions in mm
    let paperWidth, paperHeight;
    if (paperSize === 'a4') {
        paperWidth = 210;
        paperHeight = 297;
    } else {
        paperWidth = 216;
        paperHeight = 279;
    }

    // Get input values
    cardCount = parseInt(elements.cardCountInput.value) || 1;
    horizontalGap = parseFloat(document.getElementById('h-gap').value) || 5;
    verticalGap = parseFloat(document.getElementById('v-gap').value) || 5;
    marginHorizontal = parseFloat(document.getElementById('margin-h').value) || 10;
    marginVertical = parseFloat(document.getElementById('margin-v').value) || 10;

    // Calculate available space
    const availableWidth = paperWidth - (2 * marginHorizontal);
    const availableHeight = paperHeight - (2 * marginVertical);

    // Card dimensions (fixed 85.6mm × 54mm)
    const cardWidth = 85.6;
    const cardHeight = 54;
    const cardAspectRatio = cardWidth / cardHeight;

    // FIXED: For ANY number of cards, each card shows both sides side-by-side
    // So each card is represented by 2 image slots (front + back)
    const totalSlots = cardCount * 2; // Each card needs 2 slots (front & back)

    // Calculate grid: 2 columns (for front & back), rows based on card count
    const cols = 2; // Always 2 columns (front on left, back on right)
    const rows = cardCount; // One row per card
    const totalCards = totalSlots;

    // Update display
    elements.cardsPerPage.textContent = cardCount + ' Card' + (cardCount > 1 ? 's' : '') + ' (Each with both sides)';

    // Calculate column width for 2 columns
    const gapTotal = (cols - 1) * horizontalGap;
    const columnWidth = (availableWidth - gapTotal) / cols;

    // Check if cards fit vertically
    const requiredHeight = (rows * cardHeight) + ((rows - 1) * verticalGap);
    if (requiredHeight > availableHeight) {
        showToast('Cards exceed page height. Reduce card count or margins.', 'warning');
    }

    // Set grid template: 2 columns, rows = cardCount
    elements.printGrid.style.gridTemplateColumns = `repeat(${cols}, ${columnWidth}mm)`;
    elements.printGrid.style.gap = `${verticalGap}mm ${horizontalGap}mm`;
    elements.printGrid.style.padding = `${marginVertical}mm ${marginHorizontal}mm`;

    // Ensure top alignment
    elements.printGrid.style.alignContent = 'start';

    // Clear grid
    elements.printGrid.innerHTML = '';

    // Generate cards - for each card, create front and back
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {

        // Front card (left column)
        const frontCardDiv = document.createElement('div');
        frontCardDiv.className = 'print-card';
        frontCardDiv.style.width = '100%';
        frontCardDiv.style.aspectRatio = `${cardAspectRatio}`;

        // Add card number for preview
        const frontNumberSpan = document.createElement('span');
        frontNumberSpan.className = 'print-card-number';
        frontNumberSpan.textContent = `Card ${cardIndex + 1} FRONT`;
        frontCardDiv.appendChild(frontNumberSpan);

        // Add front image
        if (images.front && images.front.src) {
            const img = document.createElement('img');
            img.src = images.front.src;
            img.alt = `Card ${cardIndex + 1} Front`;

            // Apply transformations
            const trans = images.front.transformations;
            img.style.transform = `scale(${trans.scale}) rotate(${trans.rotate}deg) scaleX(${trans.flipH}) scaleY(${trans.flipV}) translate(${trans.x}px, ${trans.y}px)`;
            img.style.filter = trans.filter;

            frontCardDiv.appendChild(img);
        } else {
            frontCardDiv.classList.add('print-placeholder');
            frontCardDiv.innerHTML = '<span>No front image</span>';
        }

        // Back card (right column)
        const backCardDiv = document.createElement('div');
        backCardDiv.className = 'print-card';
        backCardDiv.style.width = '100%';
        backCardDiv.style.aspectRatio = `${cardAspectRatio}`;

        // Add card number for preview
        const backNumberSpan = document.createElement('span');
        backNumberSpan.className = 'print-card-number';
        backNumberSpan.textContent = `Card ${cardIndex + 1} BACK`;
        backCardDiv.appendChild(backNumberSpan);

        // Add back image
        if (images.back && images.back.src) {
            const img = document.createElement('img');
            img.src = images.back.src;
            img.alt = `Card ${cardIndex + 1} Back`;

            // Apply transformations
            const trans = images.back.transformations;
            img.style.transform = `scale(${trans.scale}) rotate(${trans.rotate}deg) scaleX(${trans.flipH}) scaleY(${trans.flipV}) translate(${trans.x}px, ${trans.y}px)`;
            img.style.filter = trans.filter;

            backCardDiv.appendChild(img);
        } else {
            backCardDiv.classList.add('print-placeholder');
            backCardDiv.innerHTML = '<span>No back image</span>';
        }

        // Add both cards to grid
        elements.printGrid.appendChild(frontCardDiv);
        elements.printGrid.appendChild(backCardDiv);
    }

    // Update display
    elements.paperSizeDisplay.textContent = paperSize.toUpperCase() + ' Paper';
    elements.printGrid.style.backgroundColor = backgroundColor;

    showToast(`Print layout: ${cardCount} card(s) with both sides side-by-side, stacked vertically`, 'success');
}

function showPrintPreview() {
    switchTab('print');
    generatePrintLayout();
}

function printLayout() {
    if (!images.front.src && !images.back.src) {
        showToast('Please upload images first', 'error');
        return;
    }

    // Generate print layout if not already
    generatePrintLayout();

    let printContent;
    let paperSizeStr;

    if (paperSize === '4x6') {
        // 4x6 photo paper print
        paperSizeStr = '4x6';
        printContent = `
                    <div class="photo-paper-layout" style="justify-content: flex-start;">
                        ${elements.photoPaperContainer.innerHTML}
                    </div>
                `;
    } else {
        // A4/Letter print with top alignment - 2 columns for front/back
        paperSizeStr = paperSize;
        printContent = `
                    <div class="print-grid align-top" style="grid-template-columns: ${elements.printGrid.style.gridTemplateColumns}; gap: ${verticalGap}mm ${horizontalGap}mm; padding: ${marginVertical}mm ${marginHorizontal}mm; align-content: start;">
                        ${generatePrintCardsHTML()}
                    </div>
                `;
    }

    // Create print-optimized HTML
    const printHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>ID Cards Print - ${paperSize === '4x6' ? '4×6 Photo' : paperSize.toUpperCase()}</title>
                    <style>
                        /* Reset all margins and padding */
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        /* Page setup - CRITICAL for correct sizing */
                        @page {
                            size: ${paperSize === '4x6' ? '4in 6in' : paperSizeStr + ' portrait'};
                            margin: 0;
                        }
                        
                        body {
                            margin: 0;
                            padding: 0;
                            background: white;
                            width: 100%;
                            min-height: 100vh;
                        }
                        
                        /* Print grid - exact dimensions with top alignment */
                        .print-grid {
                            display: grid;
                            width: 100%;
                            background: white;
                            box-sizing: border-box;
                            align-content: start;
                        }
                        
                        /* Photo paper layout with top alignment */
                        .photo-paper-layout {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: flex-start;
                            gap: 5mm;
                            padding: 5mm;
                            width: 102mm;
                            height: 152mm;
                            background: white;
                            box-sizing: border-box;
                        }
                        
                        /* Print card - exact ID card size */
                        .print-card, .photo-paper-card {
                            aspect-ratio: 85.6 / 54;
                            width: 100%;
                            max-width: 90mm;
                            background: white;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            overflow: hidden;
                            position: relative;
                            box-shadow: none;
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        
                        .print-card img, .photo-paper-card img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            display: block;
                        }
                        
                        /* Hide labels when printing */
                        .print-card-number, .photo-paper-label {
                            display: none;
                        }
                        
                        /* Placeholder styling */
                        .print-placeholder {
                            background: #f5f5f5;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #666;
                            font-size: 10pt;
                        }
                        
                        /* Ensure no scaling */
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        // Auto-trigger print when loaded
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                setTimeout(function() {
                                    window.close();
                                }, 500);
                            }, 300);
                        };
                    <\/script>
                </body>
                </html>
            `;

    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600,menubar=yes,toolbar=yes,location=yes,status=yes');
    printWindow.document.write(printHTML);
    printWindow.document.close();
}

// Helper function to generate cards HTML for print
function generatePrintCardsHTML() {
    const cards = elements.printGrid.querySelectorAll('.print-card');
    let html = '';

    cards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
            html += `
                        <div class="print-card">
                            <img src="${img.src}" style="transform: ${img.style.transform}; filter: ${img.style.filter};">
                        </div>
                    `;
        } else {
            html += `
                        <div class="print-card print-placeholder">
                            <span>No image</span>
                        </div>
                    `;
        }
    });

    return html;
}

function downloadPrintPDF() {
    if (!images.front.src && !images.back.src) {
        showToast('Please upload images first', 'error');
        return;
    }

    toggleLoading(true);

    // Generate print layout
    generatePrintLayout();

    let container;
    let pdfFormat;
    let pdfOrientation = 'portrait';

    if (paperSize === '4x6') {
        // 4x6 PDF with top alignment
        container = document.createElement('div');
        container.style.width = '102mm';
        container.style.height = '152mm';
        container.style.backgroundColor = 'white';
        container.style.position = 'relative';
        container.style.margin = '0';
        container.style.padding = '0';
        container.style.boxSizing = 'border-box';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start';
        container.style.gap = '5mm';
        container.style.padding = '5mm';

        // Clone photo paper cards
        const cards = elements.photoPaperContainer.querySelectorAll('.photo-paper-card');
        cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.style.aspectRatio = '85.6 / 54';
            cardDiv.style.width = '100%';
            cardDiv.style.maxWidth = '90mm';
            cardDiv.style.backgroundColor = 'white';
            cardDiv.style.border = '1px solid #ccc';
            cardDiv.style.borderRadius = '4px';
            cardDiv.style.overflow = 'hidden';

            const img = card.querySelector('img');
            if (img) {
                const newImg = document.createElement('img');
                newImg.src = img.src;
                newImg.style.width = '100%';
                newImg.style.height = '100%';
                newImg.style.objectFit = 'contain';
                newImg.style.transform = img.style.transform;
                newImg.style.filter = img.style.filter;
                cardDiv.appendChild(newImg);
            }

            container.appendChild(cardDiv);
        });

        pdfFormat = [102, 152]; // 4x6 in mm

    } else {
        // A4/Letter PDF with top alignment - 2 columns for front/back
        container = document.createElement('div');
        container.style.width = paperSize === 'a4' ? '210mm' : '216mm';
        container.style.height = paperSize === 'a4' ? '297mm' : '279mm';
        container.style.backgroundColor = 'white';
        container.style.position = 'relative';
        container.style.margin = '0';
        container.style.padding = '0';
        container.style.boxSizing = 'border-box';

        // Create grid with exact dimensions and top alignment
        const gridDiv = document.createElement('div');
        gridDiv.style.display = 'grid';
        gridDiv.style.gridTemplateColumns = elements.printGrid.style.gridTemplateColumns;
        gridDiv.style.gap = `${verticalGap}mm ${horizontalGap}mm`;
        gridDiv.style.padding = `${marginVertical}mm ${marginHorizontal}mm`;
        gridDiv.style.width = '100%';
        gridDiv.style.height = '100%';
        gridDiv.style.boxSizing = 'border-box';
        gridDiv.style.backgroundColor = 'white';
        gridDiv.style.alignContent = 'start';

        // Add cards to grid
        const cards = elements.printGrid.querySelectorAll('.print-card');
        cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.style.aspectRatio = '85.6 / 54';
            cardDiv.style.width = '100%';
            cardDiv.style.backgroundColor = 'white';
            cardDiv.style.border = '1px solid #ccc';
            cardDiv.style.borderRadius = '4px';
            cardDiv.style.overflow = 'hidden';

            const img = card.querySelector('img');
            if (img) {
                const newImg = document.createElement('img');
                newImg.src = img.src;
                newImg.style.width = '100%';
                newImg.style.height = '100%';
                newImg.style.objectFit = 'contain';
                newImg.style.transform = img.style.transform;
                newImg.style.filter = img.style.filter;
                cardDiv.appendChild(newImg);
            }

            gridDiv.appendChild(cardDiv);
        });

        container.appendChild(gridDiv);
        pdfFormat = paperSize;
    }

    document.body.appendChild(container);

    // Use html2canvas with high scale for quality
    html2canvas(container, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true
    }).then(canvas => {
        const { jsPDF } = window.jspdf;

        // Create PDF with exact dimensions
        const pdf = new jsPDF({
            orientation: pdfOrientation,
            unit: 'mm',
            format: pdfFormat
        });

        // Calculate scaling to fit PDF page exactly
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Add image to PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        // Save PDF
        const fileName = paperSize === '4x6' ? 'id-card-4x6-photo.pdf' : `id-cards-${paperSize}-${cardCount}-cards.pdf`;
        pdf.save(fileName);

        // Clean up
        document.body.removeChild(container);
        toggleLoading(false);
        showToast(`PDF downloaded successfully (${paperSize === '4x6' ? '4×6 Photo' : paperSize.toUpperCase()})`, 'success');
    }).catch(error => {
        console.error('PDF Error:', error);
        document.body.removeChild(container);
        toggleLoading(false);
        showToast('Error generating PDF', 'error');
    });
}

// ==================== POSITION CONTROL FUNCTIONS ====================
function moveImage(direction) {
    const side = currentSide;
    if (!images[side].src) {
        showToast('Please upload an image first', 'warning');
        return;
    }

    const trans = images[side].transformations;

    switch (direction) {
        case 'up':
            trans.y -= moveStep;
            break;
        case 'down':
            trans.y += moveStep;
            break;
        case 'left':
            trans.x -= moveStep;
            break;
        case 'right':
            trans.x += moveStep;
            break;
        case 'center':
            trans.x = 0;
            trans.y = 0;
            break;
    }

    updateImageTransform(side);
    updatePositionDisplay(side);
    updateSliders(side);

    if (direction !== 'center') {
        showToast(`Moved ${direction} by ${moveStep}px`, 'info');
    } else {
        showToast('Image centered', 'success');
    }
}

function updatePositionFromSlider(axis, value) {
    const side = currentSide;
    if (!images[side].src) return;

    const trans = images[side].transformations;

    if (axis === 'x') {
        trans.x = parseInt(value);
    } else {
        trans.y = parseInt(value);
    }

    updateImageTransform(side);
    updatePositionDisplay(side);
}

function updatePositionDisplay(side) {
    const trans = images[side].transformations;
    elements.positionDisplay.textContent = `X:${trans.x} Y:${trans.y}`;
    elements.xSlider.value = trans.x;
    elements.ySlider.value = trans.y;
    elements.xValue.textContent = trans.x + 'px';
    elements.yValue.textContent = trans.y + 'px';
}

function updateSliders(side) {
    const trans = images[side].transformations;
    elements.xSlider.value = trans.x;
    elements.ySlider.value = trans.y;
    elements.xValue.textContent = trans.x + 'px';
    elements.yValue.textContent = trans.y + 'px';
}

function resetPosition() {
    const side = currentSide;
    images[side].transformations.x = 0;
    images[side].transformations.y = 0;
    updateImageTransform(side);
    updatePositionDisplay(side);
    showToast('Position reset', 'success');
}

function centerImage() {
    moveImage('center');
}

function setMoveStep(step) {
    moveStep = step;
    showToast(`Move step set to ${step}px`, 'info');
}

function showPositionGrid() {
    document.querySelectorAll('.position-overlay').forEach(el => {
        if (el.style.display === 'block') {
            el.style.display = 'none';
        } else {
            el.style.display = 'block';
            setTimeout(() => {
                el.style.display = 'none';
            }, 2000);
        }
    });
}

// ==================== ORIENTATION MANAGEMENT ====================
function setOrientation(mode) {
    currentOrientation = mode;

    if (mode === 'portrait') {
        elements.portraitMode.className = 'px-4 py-2 text-sm font-medium bg-blue-600 text-white';
        elements.landscapeMode.className = 'px-4 py-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50';
        elements.currentOrientation.textContent = 'Portrait Mode';
        document.documentElement.style.setProperty('--aspect-ratio', '1 / 1.6');
        document.querySelectorAll('.id-card-container').forEach(el => el.classList.remove('landscape'));
        document.querySelectorAll('.upload-placeholder').forEach(el => el.classList.remove('landscape'));
    } else {
        elements.landscapeMode.className = 'px-4 py-2 text-sm font-medium bg-blue-600 text-white';
        elements.portraitMode.className = 'px-4 py-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-50';
        elements.currentOrientation.textContent = 'Landscape Mode';
        document.documentElement.style.setProperty('--aspect-ratio', '1.6 / 1');
        document.querySelectorAll('.id-card-container').forEach(el => el.classList.add('landscape'));
        document.querySelectorAll('.upload-placeholder').forEach(el => el.classList.add('landscape'));
    }

    showToast(`Switched to ${mode} mode`, 'success');
}

// ==================== IMAGE UPLOAD ====================
function handleImageUpload(event, side) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        showToast('Only JPG and PNG images are allowed', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }

    toggleLoading(true);

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;

            images[side].file = file;
            images[side].src = e.target.result;
            images[side].originalWidth = width;
            images[side].originalHeight = height;
            images[side].aspectRatio = aspectRatio;

            detectCardType(side, width, height, aspectRatio);

            if (side === 'front') {
                elements.frontPlaceholder.classList.add('hidden');
                elements.frontPreviewContainer.classList.remove('hidden');
                elements.frontPreview.src = e.target.result;
                elements.frontLiveImg.src = e.target.result;
                elements.frontNoImage.style.display = 'none';
                elements.frontLivePreview.style.display = 'block';

                elements.frontSizeInfo.classList.remove('hidden');
                elements.frontDimensionsText.textContent = `${width} × ${height} px (${(width / 11.81).toFixed(1)} × ${(height / 11.81).toFixed(1)} mm)`;
                elements.frontDimensions.classList.remove('hidden');
                elements.frontDimensions.innerHTML = `${width}×${height}`;

                resetSideTransform('front');
            } else {
                elements.backPlaceholder.classList.add('hidden');
                elements.backPreviewContainer.classList.remove('hidden');
                elements.backPreview.src = e.target.result;
                elements.backLiveImg.src = e.target.result;
                elements.backNoImage.style.display = 'none';
                elements.backLivePreview.style.display = 'block';

                elements.backSizeInfo.classList.remove('hidden');
                elements.backDimensionsText.textContent = `${width} × ${height} px (${(width / 11.81).toFixed(1)} × ${(height / 11.81).toFixed(1)} mm)`;
                elements.backDimensions.classList.remove('hidden');
                elements.backDimensions.innerHTML = `${width}×${height}`;

                resetSideTransform('back');
            }

            elements.sizeInfo.classList.remove('hidden');
            elements.sizeMessage.innerHTML = `Auto-detected: ${width} × ${height} pixels | Aspect Ratio: ${aspectRatio.toFixed(2)}:1 | ${getCardTypeFromRatio(aspectRatio)}`;

            if (images.front.src && images.back.src) {
                compareDimensions();
            }

            toggleLoading(false);
            showToast(`${side} image uploaded successfully (${width}×${height})`, 'success');
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function detectCardType(side, width, height, ratio) {
    const mmWidth = width / 11.81;
    const mmHeight = height / 11.81;

    let cardType = 'Unknown';

    if (Math.abs(mmWidth - 85.6) < 5 && Math.abs(mmHeight - 54) < 5) {
        cardType = 'Standard ID Card (CR80)';
    } else if (Math.abs(mmWidth - 125) < 7 && Math.abs(mmHeight - 88) < 7) {
        cardType = 'Passport Size';
    } else if (Math.abs(mmWidth - 74) < 5 && Math.abs(mmHeight - 105) < 5) {
        cardType = 'Credit Card (ISO/IEC 7810 ID-1)';
    } else if (Math.abs(ratio - 1.414) < 0.1) {
        cardType = 'A5/A4 Ratio';
    }

    showToast(`${side} card detected as: ${cardType}`, 'info');
}

function getCardTypeFromRatio(ratio) {
    if (Math.abs(ratio - 1.585) < 0.1) return 'Standard ID Card (85.6×54mm)';
    if (Math.abs(ratio - 1.42) < 0.1) return 'Passport (125×88mm)';
    if (Math.abs(ratio - 0.705) < 0.1) return 'Vertical ID Card';
    if (Math.abs(ratio - 1.414) < 0.1) return 'A4/A5 Ratio';
    return 'Custom Size Card';
}

function compareDimensions() {
    if (images.front.src && images.back.src) {
        elements.dimensionCompare.classList.remove('hidden');

        const frontRatio = images.front.aspectRatio.toFixed(2);
        const backRatio = images.back.aspectRatio.toFixed(2);

        elements.compareFront.textContent = `${images.front.originalWidth}×${images.front.originalHeight} (${frontRatio})`;
        elements.compareBack.textContent = `${images.back.originalWidth}×${images.back.originalHeight} (${backRatio})`;

        if (Math.abs(images.front.aspectRatio - images.back.aspectRatio) < 0.05) {
            elements.matchStatus.innerHTML = '<i class="fas fa-check-circle text-green-500 mr-1"></i>Matched';
        } else {
            elements.matchStatus.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 mr-1"></i>Different sizes';
        }
    }
}

// ==================== IMAGE MANAGEMENT ====================
function replaceImage(side) {
    if (side === 'front') {
        elements.frontUpload.click();
    } else {
        elements.backUpload.click();
    }
}

function removeImage(side) {
    if (side === 'front') {
        images.front = {
            file: null,
            src: null,
            originalWidth: 0,
            originalHeight: 0,
            aspectRatio: 1.585,
            transformations: { scale: 1, rotate: 0, flipH: 1, flipV: 1, filter: 'none', brightness: 100, contrast: 100, x: 0, y: 0 }
        };

        elements.frontPlaceholder.classList.remove('hidden');
        elements.frontPreviewContainer.classList.add('hidden');
        elements.frontPreview.src = '';
        elements.frontLiveImg.src = '';
        elements.frontNoImage.style.display = 'flex';
        elements.frontLivePreview.style.display = 'none';
        elements.frontUpload.value = '';
        elements.frontSizeInfo.classList.add('hidden');
        elements.frontDimensions.classList.add('hidden');
    } else {
        images.back = {
            file: null,
            src: null,
            originalWidth: 0,
            originalHeight: 0,
            aspectRatio: 1.585,
            transformations: { scale: 1, rotate: 0, flipH: 1, flipV: 1, filter: 'none', brightness: 100, contrast: 100, x: 0, y: 0 }
        };

        elements.backPlaceholder.classList.remove('hidden');
        elements.backPreviewContainer.classList.add('hidden');
        elements.backPreview.src = '';
        elements.backLiveImg.src = '';
        elements.backNoImage.style.display = 'flex';
        elements.backLivePreview.style.display = 'none';
        elements.backUpload.value = '';
        elements.backSizeInfo.classList.add('hidden');
        elements.backDimensions.classList.add('hidden');
    }

    showToast(`${side} image removed`, 'info');

    if (!images.front.src && !images.back.src) {
        elements.sizeInfo.classList.add('hidden');
        elements.dimensionCompare.classList.add('hidden');
    }
}

// ==================== SIDE SELECTION ====================
function selectSide(side) {
    currentSide = side;
    elements.activeSide.textContent = side.charAt(0).toUpperCase() + side.slice(1);

    if (side === 'front') {
        elements.selectFront.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border-2 border-blue-200 bg-blue-50 text-blue-700';
        elements.selectBack.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border-2 border-gray-200 hover:bg-indigo-50';
    } else {
        elements.selectBack.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border-2 border-indigo-200 bg-indigo-50 text-indigo-700';
        elements.selectFront.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border-2 border-gray-200 hover:bg-blue-50';
    }

    if (images[side].src) {
        updatePositionDisplay(side);
        updateSliders(side);
    }
}

// ==================== TRANSFORMATION FUNCTIONS ====================
function applyTransform(transform) {
    const side = currentSide;

    if (!images[side].src) {
        showToast('Please upload an image first', 'warning');
        return;
    }

    const trans = images[side].transformations;

    switch (transform) {
        case 'zoom-in':
            trans.scale = Math.min(trans.scale + 0.05, 3);
            break;
        case 'zoom-out':
            trans.scale = Math.max(trans.scale - 0.05, 0.3);
            break;
        case 'rotate':
            trans.rotate = (trans.rotate + 90) % 360;
            break;
        case 'flip-h':
            trans.flipH *= -1;
            break;
        case 'flip-v':
            trans.flipV *= -1;
            break;
        case 'remove-bg':
            trans.filter = trans.filter === 'none' ? 'brightness(1.1) contrast(1.2) drop-shadow(0 0 5px white)' : 'none';
            break;
        case 'brightness-up':
            trans.brightness = Math.min(trans.brightness + 5, 200);
            updateFilter(side);
            break;
        case 'brightness-down':
            trans.brightness = Math.max(trans.brightness - 5, 50);
            updateFilter(side);
            break;
        case 'contrast-up':
            trans.contrast = Math.min(trans.contrast + 5, 200);
            updateFilter(side);
            break;
        case 'contrast-down':
            trans.contrast = Math.max(trans.contrast - 5, 50);
            updateFilter(side);
            break;
    }

    updateImageTransform(side);
}

function updateFilter(side) {
    const trans = images[side].transformations;
    trans.filter = `brightness(${trans.brightness}%) contrast(${trans.contrast}%)`;
}

function updateImageTransform(side) {
    const img = side === 'front' ? elements.frontLiveImg : elements.backLiveImg;
    const trans = images[side].transformations;

    img.style.transform = `translate(${trans.x}px, ${trans.y}px) scale(${trans.scale}) rotate(${trans.rotate}deg) scaleX(${trans.flipH}) scaleY(${trans.flipV})`;
    img.style.filter = trans.filter;
}

function resetTransform() {
    const side = currentSide;
    resetSideTransform(side);
    updateImageTransform(side);
    updatePositionDisplay(side);
    updateSliders(side);
    showToast(`All transformations reset for ${side} side`, 'success');
}

function resetSideTransform(side) {
    images[side].transformations = {
        scale: 1,
        rotate: 0,
        flipH: 1,
        flipV: 1,
        filter: 'none',
        brightness: 100,
        contrast: 100,
        x: 0,
        y: 0
    };

    const img = side === 'front' ? elements.frontLiveImg : elements.backLiveImg;
    img.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg) scaleX(1) scaleY(1)';
    img.style.filter = 'none';
}

function autoFitImage() {
    const side = currentSide;
    if (!images[side].src) return;

    const container = side === 'front' ? elements.frontLivePreview : elements.backLivePreview;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const imgWidth = images[side].originalWidth;
    const imgHeight = images[side].originalHeight;

    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    images[side].transformations.scale = scale;
    images[side].transformations.x = 0;
    images[side].transformations.y = 0;
    updateImageTransform(side);
    updatePositionDisplay(side);
    updateSliders(side);
    showToast('Image auto-fitted to container', 'success');
}

function matchCardSizes() {
    if (!images.front.src || !images.back.src) {
        showToast('Both images required', 'warning');
        return;
    }

    if (images.front.aspectRatio > images.back.aspectRatio) {
        images.back.transformations.scale = images.front.transformations.scale;
        updateImageTransform('back');
    } else {
        images.front.transformations.scale = images.back.transformations.scale;
        updateImageTransform('front');
    }

    showToast('Card sizes matched', 'success');
}

// ==================== PREVIEW FUNCTIONS ====================
function togglePreviewSize() {
    const containers = document.querySelectorAll('.id-card-container');
    containers.forEach(container => {
        if (container.style.maxWidth === '400px' || container.style.maxWidth === '380px') {
            container.style.maxWidth = currentOrientation === 'portrait' ? '320px' : '400px';
        } else {
            container.style.maxWidth = currentOrientation === 'portrait' ? '380px' : '480px';
        }
    });
}

function syncPreviews() {
    const otherSide = currentSide === 'front' ? 'back' : 'front';

    if (!images[otherSide].src) {
        showToast(`Please upload ${otherSide} image first`, 'warning');
        return;
    }

    images[otherSide].transformations = { ...images[currentSide].transformations };
    updateImageTransform(otherSide);

    if (otherSide === 'front') {
        updatePositionDisplay('front');
        updateSliders('front');
    } else {
        updatePositionDisplay('back');
        updateSliders('back');
    }

    showToast('Views synchronized', 'success');
}

function changeBackgroundColor(color) {
    backgroundColor = color;
    document.querySelectorAll('.id-card-container').forEach(el => {
        el.style.backgroundColor = color;
    });
}

function changeBorderRadius(value) {
    borderRadius = value;
    document.querySelectorAll('.id-card-container').forEach(el => {
        el.style.borderRadius = value + 'px';
    });
    elements.radiusValue.textContent = value + 'px';
}

// ==================== CUSTOM SIZE FUNCTIONS ====================
function showCustomSizePanel() {
    elements.customSizePanel.classList.toggle('hidden');
}

function applyCustomSize() {
    const width = parseFloat(elements.customWidth.value);
    const height = parseFloat(elements.customHeight.value);

    if (width > 0 && height > 0) {
        customWidth = width;
        customHeight = height;

        const ratio = width / height;
        document.documentElement.style.setProperty('--aspect-ratio', ratio);

        elements.cardSizeDisplay.textContent = `${width} × ${height} mm`;
        showToast(`Custom size applied: ${width}×${height} mm`, 'success');
    }
}

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'info') {
    const toast = elements.toast;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    toast.style.background = colors[type];
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function toggleLoading(show) {
    if (show) {
        elements.loading.classList.remove('hidden');
    } else {
        elements.loading.classList.add('hidden');
    }
}

function updateOrientation() {
    setOrientation(currentOrientation);
}

// Make functions globally available
window.selectSide = selectSide;
window.applyTransform = applyTransform;
window.resetTransform = resetTransform;
window.replaceImage = replaceImage;
window.removeImage = removeImage;
window.togglePreviewSize = togglePreviewSize;
window.syncPreviews = syncPreviews;
window.setOrientation = setOrientation;
window.autoFitImage = autoFitImage;
window.matchCardSizes = matchCardSizes;
window.changeBackgroundColor = changeBackgroundColor;
window.changeBorderRadius = changeBorderRadius;
window.showCustomSizePanel = showCustomSizePanel;
window.applyCustomSize = applyCustomSize;
window.moveImage = moveImage;
window.resetPosition = resetPosition;
window.setMoveStep = setMoveStep;
window.showPositionGrid = showPositionGrid;
window.updatePositionFromSlider = updatePositionFromSlider;
window.centerImage = centerImage;
window.switchTab = switchTab;
window.setPaperSize = setPaperSize;
window.showPrintPreview = showPrintPreview;
window.printLayout = printLayout;
window.downloadPrintPDF = downloadPrintPDF;
window.updateCardCount = updateCardCount;
