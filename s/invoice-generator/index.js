
// ==================== STATE & VARIABLES ====================
let itemCount = 1;
let currentTheme = 'blue';
let watermarkEnabled = false;
let darkModeEnabled = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    document.getElementById('printInvoiceDate').textContent = formatDate(today);

    // Set due date (15 days from now for compact invoice)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    document.getElementById('dueDate').value = dueDateStr;
    document.getElementById('printDueDate').textContent = formatDate(dueDateStr);

    // Add first item row
    addItem();

    // Initialize listeners
    attachListeners();

    // Check for saved invoice
    checkSavedInvoice();

    // Setup editable fields
    setupEditableFields();

    // Update print values periodically
    setInterval(updatePrintValues, 500);
});

// Format date for display
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Setup contenteditable fields
function setupEditableFields() {
    const editableFields = ['businessName', 'businessAddress', 'businessPhone'];
    editableFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('blur', function () {
                // Update print values if needed
            });
        }
    });
}

// ==================== UPDATE PRINT VALUES ====================
function updatePrintValues() {
    // Update invoice numbers
    document.getElementById('printInvoiceNo').textContent = document.getElementById('invoiceNo').value;

    // Update dates
    const invoiceDate = document.getElementById('invoiceDate').value;
    if (invoiceDate) {
        document.getElementById('printInvoiceDate').textContent = formatDate(invoiceDate);
    }

    const dueDate = document.getElementById('dueDate').value;
    if (dueDate) {
        document.getElementById('printDueDate').textContent = formatDate(dueDate);
    }

    // Update customer info - 3 separate rows
    document.getElementById('printCustomerName').textContent = document.getElementById('customerName').value || '-';
    document.getElementById('printCustomerAddress').textContent = document.getElementById('customerAddress').value || '-';
    document.getElementById('printCustomerPhone').textContent = document.getElementById('customerPhone').value || '-';

    // Update shipping info - 3 separate rows
    document.getElementById('printShipName').textContent = document.getElementById('shipName').value || '-';
    document.getElementById('printShipAddress').textContent = document.getElementById('shipAddress').value || '-';
    document.getElementById('printShipPhone').textContent = document.getElementById('shipPhone').value || '-';

    // Update payment info
    document.getElementById('printBankName').textContent = document.getElementById('bankName').value || '-';
    document.getElementById('printAccountNo').textContent = document.getElementById('accountNo').value || '-';
    document.getElementById('printIfscCode').textContent = document.getElementById('ifscCode').value || '-';
    document.getElementById('printUpiId').textContent = document.getElementById('upiId').value || '-';

    // Update tax/discount
    document.getElementById('printTaxPercent').textContent = document.getElementById('taxPercent').value || '0';
    document.getElementById('printDiscountPercent').textContent = document.getElementById('discountPercent').value || '0';
    document.getElementById('printAmountPaid').textContent = document.getElementById('amountPaid').value || '0';

    // Update notes
    document.getElementById('printNotes').textContent = document.getElementById('invoiceNotes').value || '-';

    // Update items print table
    updateItemsPrintTable();
}

// Update items for print
function updateItemsPrintTable() {
    const printTbody = document.getElementById('itemsBodyPrint');
    if (!printTbody) return;

    printTbody.innerHTML = '';

    document.querySelectorAll('.item-row').forEach((row, index) => {
        const desc = row.querySelector('.item-desc')?.value || '-';
        const qty = row.querySelector('.item-qty')?.value || '0';
        const price = row.querySelector('.item-price')?.value || '0';
        const total = row.querySelector('.item-total')?.textContent || '0';

        const currency = document.getElementById('currencySelector').value;

        const tr = document.createElement('tr');
        tr.className = 'item-row-print';
        tr.innerHTML = `
                    <td class="p-1">${index + 1}</td>
                    <td class="p-1">${desc}</td>
                    <td class="p-1 text-right">${qty}</td>
                    <td class="p-1 text-right">${currency}${parseFloat(price).toFixed(2)}</td>
                    <td class="p-1 text-right">${currency}${parseFloat(total).toFixed(2)}</td>
                `;

        printTbody.appendChild(tr);
    });
}

// ==================== ITEMS MANAGEMENT ====================
function addItem() {
    const tbody = document.getElementById('itemsBody');
    const row = document.createElement('tr');
    row.className = 'item-row';
    row.id = `item-${itemCount}`;

    row.innerHTML = `
                <td class="p-1 text-xs">${itemCount}</td>
                <td class="p-1"><input type="text" class="item-desc w-full border rounded p-0.5 text-xs" placeholder="Item description"></td>
                <td class="p-1"><input type="number" class="item-qty w-14 border rounded p-0.5 text-right text-xs" value="1" min="1" onchange="calculateItemTotal(this)"></td>
                <td class="p-1"><input type="number" class="item-price w-20 border rounded p-0.5 text-right text-xs" value="0" min="0" step="0.01" onchange="calculateItemTotal(this)"></td>
                <td class="p-1 text-right"><span class="item-total font-semibold text-xs">0.00</span></td>
                <td class="p-1 text-center">
                    <button onclick="removeItem(${itemCount})" class="text-red-500 hover:text-red-700 text-xs">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

    tbody.appendChild(row);
    itemCount++;
}

function removeItem(id) {
    const row = document.getElementById(`item-${id}`);
    if (row) {
        row.remove();
        calculateTotals();
        updatePrintValues();
    }
}

function calculateItemTotal(element) {
    const row = element.closest('tr');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = qty * price;

    row.querySelector('.item-total').textContent = total.toFixed(2);
    calculateTotals();
    updatePrintValues();
}

// ==================== CALCULATIONS ====================
function calculateTotals() {
    let subtotal = 0;
    document.querySelectorAll('.item-total').forEach(el => {
        subtotal += parseFloat(el.textContent) || 0;
    });

    const taxPercent = parseFloat(document.getElementById('taxPercent').value) || 0;
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;

    const taxAmount = subtotal * (taxPercent / 100);
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal + taxAmount - discountAmount;

    const currency = document.getElementById('currencySelector').value;

    document.getElementById('subtotal').textContent = currency + subtotal.toFixed(2);
    document.getElementById('taxAmount').textContent = currency + taxAmount.toFixed(2);
    document.getElementById('discountAmount').textContent = currency + discountAmount.toFixed(2);
    document.getElementById('total').textContent = currency + total.toFixed(2);

    calculateBalance();
    updatePrintValues();
}

function calculateBalance() {
    const total = parseFloat(document.getElementById('total').textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const paid = parseFloat(document.getElementById('amountPaid').value) || 0;
    const balance = total - paid;

    const currency = document.getElementById('currencySelector').value;
    document.getElementById('balanceDue').textContent = currency + balance.toFixed(2);
}

// ==================== UPLOAD HANDLERS ====================
// Logo Upload
document.getElementById('logoUpload').addEventListener('click', () => {
    document.getElementById('logoInput').click();
});

document.getElementById('logoInput').addEventListener('change', function (e) {
    handleImageUpload(e, 'logoPreview', 'logoIcon', 'logoPrintImg', 'logoPrintContainer');
});

// Signature Upload
document.getElementById('signatureUpload').addEventListener('click', () => {
    document.getElementById('signatureInput').click();
});

document.getElementById('signatureInput').addEventListener('change', function (e) {
    handleImageUpload(e, 'signaturePreview', 'signatureIcon', 'signaturePrintImg', 'signaturePrintContainer');
});

function handleImageUpload(event, previewId, iconId, printImgId, printContainerId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Screen preview
            const previewEl = document.getElementById(previewId);
            previewEl.src = e.target.result;
            previewEl.style.display = 'block';
            document.getElementById(iconId).style.display = 'none';

            // Print version
            const printImg = document.getElementById(printImgId);
            printImg.src = e.target.result;
            document.getElementById(printContainerId).style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Drag & Drop
['logoUpload', 'signatureUpload'].forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('drag-over');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('drag-over');
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (file) {
            const inputId = id === 'logoUpload' ? 'logoInput' : 'signatureInput';
            const previewId = id === 'logoUpload' ? 'logoPreview' : 'signaturePreview';
            const iconId = id === 'logoUpload' ? 'logoIcon' : 'signatureIcon';
            const printImgId = id === 'logoUpload' ? 'logoPrintImg' : 'signaturePrintImg';
            const printContainerId = id === 'logoUpload' ? 'logoPrintContainer' : 'signaturePrintContainer';

            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById(previewId).src = e.target.result;
                document.getElementById(previewId).style.display = 'block';
                document.getElementById(iconId).style.display = 'none';

                document.getElementById(printImgId).src = e.target.result;
                document.getElementById(printContainerId).style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
});

// ==================== PAYMENT TABS ====================
document.querySelectorAll('.payment-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.payment-tab').forEach(t => {
            t.classList.remove('active', 'border-b-2', 'border-blue-600', 'font-medium');
        });
        this.classList.add('active', 'border-b-2', 'border-blue-600', 'font-medium');

        const paymentType = this.dataset.payment;
        document.querySelectorAll('.payment-details').forEach(el => el.classList.add('hidden'));
        document.getElementById(paymentType + 'Details').classList.remove('hidden');

        // Update print version
        const paymentMethodPrint = document.getElementById('printPaymentMethod');
        if (paymentMethodPrint) {
            if (paymentType === 'bank') paymentMethodPrint.textContent = 'Bank Transfer';
            else if (paymentType === 'upi') paymentMethodPrint.textContent = 'UPI Payment';
            else paymentMethodPrint.textContent = 'Cash Payment';
        }
    });
});

// ==================== QR CODE GENERATOR (FIXED) ====================
function generateQRCode() {
    const upiId = document.getElementById('upiId').value.trim();
    if (!upiId) {
        showToast('Please enter UPI ID first', 'error');
        return;
    }

    // Validate UPI ID format (basic check)
    if (!upiId.includes('@')) {
        showToast('Please enter a valid UPI ID (e.g., name@okhdfcbank)', 'error');
        return;
    }

    const amount = document.getElementById('total').textContent.replace(/[^0-9.-]+/g, '');
    const cleanAmount = parseFloat(amount).toFixed(2);

    // Get business name for payee name
    const payeeName = document.getElementById('businessName').textContent || 'Business';

    // Create UPI payment URL
    // Format: upi://pay?pa=user@okhdfcbank&pn=PayeeName&am=100.00&cu=INR
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${cleanAmount}&cu=INR`;

    // Clear previous QR code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';

    showToast('Generating QR Code...', 'info');

    // Use QRCode library to generate
    try {
        QRCode.toCanvas(document.createElement('canvas'), upiUrl, {
            width: 150,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function (err, canvas) {
            if (err) {
                console.error('QR Code error:', err);
                // Fallback to Google Charts API
                fallbackQRCode(upiUrl);
                return;
            }

            // Clear and append canvas
            qrContainer.innerHTML = '';
            canvas.style.maxWidth = '100px';
            canvas.style.maxHeight = '100px';
            qrContainer.appendChild(canvas);

            // Also create an image for print
            const printQR = document.getElementById('printQRCode');
            printQR.innerHTML = '';
            const printCanvas = document.createElement('canvas');
            QRCode.toCanvas(printCanvas, upiUrl, { width: 100 }, function (printErr) {
                if (!printErr) {
                    const printImg = document.createElement('img');
                    printImg.src = printCanvas.toDataURL('image/png');
                    printImg.style.maxWidth = '80px';
                    printImg.alt = 'UPI QR Code';
                    printQR.appendChild(printImg);
                }
            });

            showToast('QR Code generated successfully!', 'success');
        });
    } catch (e) {
        console.error('QR Code library error:', e);
        fallbackQRCode(upiUrl);
    }
}

// Fallback QR Code generator using Google Charts API
function fallbackQRCode(upiUrl) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = `<img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(upiUrl)}&choe=UTF-8" alt="UPI QR Code" style="max-width:100px; max-height:100px;">`;

    // For print
    document.getElementById('printQRCode').innerHTML = `<img src="https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(upiUrl)}&choe=UTF-8" alt="UPI QR Code" style="max-width:80px;">`;

    showToast('QR Code generated (fallback)', 'success');
}

// ==================== THEME MANAGEMENT ====================
function changeTheme(theme) {
    currentTheme = theme;
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-red');
    document.body.classList.add(`theme-${theme}`);

    // Update primary color
    const root = document.documentElement;
    if (theme === 'blue') {
        root.style.setProperty('--invoice-primary', '#3b82f6');
        root.style.setProperty('--invoice-secondary', '#1e40af');
    } else if (theme === 'green') {
        root.style.setProperty('--invoice-primary', '#10b981');
        root.style.setProperty('--invoice-secondary', '#047857');
    } else {
        root.style.setProperty('--invoice-primary', '#ef4444');
        root.style.setProperty('--invoice-secondary', '#b91c1c');
    }
}

// ==================== CURRENCY MANAGEMENT ====================
function updateCurrency() {
    calculateTotals();
}

// ==================== WATERMARK TOGGLE ====================
function toggleWatermark() {
    watermarkEnabled = !watermarkEnabled;
    const sheet = document.getElementById('invoice-sheet');

    if (watermarkEnabled) {
        sheet.classList.add('watermark');
        showToast('Watermark enabled', 'info');
    } else {
        sheet.classList.remove('watermark');
    }
}

// ==================== DARK MODE ====================
function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    const body = document.getElementById('body');
    const icon = document.getElementById('darkModeIcon');

    if (darkModeEnabled) {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ==================== SAVE/LOAD INVOICE ====================
function saveInvoice() {
    const invoiceData = {
        businessName: document.getElementById('businessName').textContent,
        businessAddress: document.getElementById('businessAddress').textContent,
        businessPhone: document.getElementById('businessPhone').textContent,
        invoiceNo: document.getElementById('invoiceNo').value,
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        customerName: document.getElementById('customerName').value,
        customerAddress: document.getElementById('customerAddress').value,
        customerPhone: document.getElementById('customerPhone').value,
        shipName: document.getElementById('shipName').value,
        shipAddress: document.getElementById('shipAddress').value,
        shipPhone: document.getElementById('shipPhone').value,
        taxPercent: document.getElementById('taxPercent').value,
        discountPercent: document.getElementById('discountPercent').value,
        amountPaid: document.getElementById('amountPaid').value,
        notes: document.getElementById('invoiceNotes').value,
        bankName: document.getElementById('bankName').value,
        accountNo: document.getElementById('accountNo').value,
        ifscCode: document.getElementById('ifscCode').value,
        upiId: document.getElementById('upiId').value,
        items: []
    };

    // Save items
    document.querySelectorAll('.item-row').forEach(row => {
        invoiceData.items.push({
            desc: row.querySelector('.item-desc')?.value || '',
            qty: row.querySelector('.item-qty')?.value || 0,
            price: row.querySelector('.item-price')?.value || 0
        });
    });

    // Save logos
    const logoPreview = document.getElementById('logoPreview');
    if (logoPreview.src) invoiceData.logo = logoPreview.src;

    const signaturePreview = document.getElementById('signaturePreview');
    if (signaturePreview.src) invoiceData.signature = signaturePreview.src;

    localStorage.setItem('savedInvoice', JSON.stringify(invoiceData));
    showToast('Invoice saved successfully!', 'success');
}

function loadInvoice() {
    const saved = localStorage.getItem('savedInvoice');
    if (!saved) {
        showToast('No saved invoice found', 'error');
        return;
    }

    const data = JSON.parse(saved);

    // Restore basic fields
    document.getElementById('businessName').textContent = data.businessName || 'Your Business Name';
    document.getElementById('businessAddress').textContent = data.businessAddress || '123 Business Street, City - 400001';
    document.getElementById('businessPhone').textContent = data.businessPhone || '+91 98765 43210';
    document.getElementById('invoiceNo').value = data.invoiceNo || 'INV-2024-001';
    document.getElementById('invoiceDate').value = data.invoiceDate || new Date().toISOString().split('T')[0];
    document.getElementById('dueDate').value = data.dueDate || '';
    document.getElementById('customerName').value = data.customerName || '';
    document.getElementById('customerAddress').value = data.customerAddress || '';
    document.getElementById('customerPhone').value = data.customerPhone || '';
    document.getElementById('shipName').value = data.shipName || '';
    document.getElementById('shipAddress').value = data.shipAddress || '';
    document.getElementById('shipPhone').value = data.shipPhone || '';
    document.getElementById('taxPercent').value = data.taxPercent || 0;
    document.getElementById('discountPercent').value = data.discountPercent || 0;
    document.getElementById('amountPaid').value = data.amountPaid || 0;
    document.getElementById('invoiceNotes').value = data.notes || 'Thank you for your business!';
    document.getElementById('bankName').value = data.bankName || '';
    document.getElementById('accountNo').value = data.accountNo || '';
    document.getElementById('ifscCode').value = data.ifscCode || '';
    document.getElementById('upiId').value = data.upiId || '';

    // Restore items
    if (data.items && data.items.length > 0) {
        document.getElementById('itemsBody').innerHTML = '';
        itemCount = 1;

        data.items.forEach(item => {
            addItem();
            const row = document.getElementById(`item-${itemCount - 1}`);
            if (row) {
                row.querySelector('.item-desc').value = item.desc || '';
                row.querySelector('.item-qty').value = item.qty || 1;
                row.querySelector('.item-price').value = item.price || 0;
                calculateItemTotal(row.querySelector('.item-qty'));
            }
        });
    }

    // Restore images
    if (data.logo) {
        document.getElementById('logoPreview').src = data.logo;
        document.getElementById('logoPreview').style.display = 'block';
        document.getElementById('logoIcon').style.display = 'none';
        document.getElementById('logoPrintImg').src = data.logo;
        document.getElementById('logoPrintContainer').style.display = 'block';
    }

    if (data.signature) {
        document.getElementById('signaturePreview').src = data.signature;
        document.getElementById('signaturePreview').style.display = 'block';
        document.getElementById('signatureIcon').style.display = 'none';
        document.getElementById('signaturePrintImg').src = data.signature;
        document.getElementById('signaturePrintContainer').style.display = 'block';
    }

    calculateTotals();
    updatePrintValues();
    showToast('Invoice loaded successfully!', 'success');
}

function checkSavedInvoice() {
    const saved = localStorage.getItem('savedInvoice');
    if (saved && confirm('You have a saved invoice. Would you like to load it?')) {
        loadInvoice();
    }
}

function resetInvoice() {
    if (confirm('Are you sure you want to reset all fields?')) {
        location.reload();
    }
}

// ==================== ATTACH LISTENERS ====================
function attachListeners() {
    ['taxPercent', 'discountPercent', 'amountPaid'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function () {
                calculateTotals();
                updatePrintValues();
            });
        }
    });

    // Add listeners for all inputs to update print values
    const inputIds = ['customerName', 'customerAddress', 'customerPhone', 'shipName', 'shipAddress', 'shipPhone',
        'bankName', 'accountNo', 'ifscCode', 'upiId', 'invoiceNotes', 'invoiceNo'];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatePrintValues);
            el.addEventListener('change', updatePrintValues);
        }
    });
}

// ==================== PDF & PRINT (Single Page Optimized) ====================
function downloadPDF() {
    // Update all print values before PDF generation
    updatePrintValues();

    // Show print table
    document.querySelector('.print-table').style.display = 'table';

    const element = document.getElementById('invoice-sheet');

    // Add PDF mode class for compact layout
    element.classList.add('pdf-mode');

    const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `invoice_${document.getElementById('invoiceNo').value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            letterRendering: true,
            logging: false,
            useCORS: true,
            allowTaint: false
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
            precision: 12
        },
        pagebreak: { mode: 'avoid-all' } // Prevent page breaks
    };

    showToast('Generating PDF (A4 single page)...', 'info');

    html2pdf().from(element).set(opt).save().then(() => {
        element.classList.remove('pdf-mode');
        document.querySelector('.print-table').style.display = 'none';
        showToast('PDF downloaded successfully!', 'success');
    }).catch(error => {
        element.classList.remove('pdf-mode');
        document.querySelector('.print-table').style.display = 'none';
        showToast('Error generating PDF', 'error');
        console.error(error);
    });
}

function printInvoice() {
    // Update all print values before printing
    updatePrintValues();

    // Show print table
    document.querySelector('.print-table').style.display = 'table';

    // Prepare for print
    const logoPreview = document.getElementById('logoPreview');
    const signaturePreview = document.getElementById('signaturePreview');

    // Update print versions
    if (logoPreview && logoPreview.src) {
        document.getElementById('logoPrintImg').src = logoPreview.src;
        document.getElementById('logoPrintContainer').style.display = 'block';
    }

    if (signaturePreview && signaturePreview.src) {
        document.getElementById('signaturePrintImg').src = signaturePreview.src;
        document.getElementById('signaturePrintContainer').style.display = 'block';
    }

    // Trigger print
    window.print();

    // After print, hide print table again
    setTimeout(() => {
        document.querySelector('.print-table').style.display = 'none';
    }, 1000);
}

function downloadImage() {
    const element = document.getElementById('invoice-sheet');

    html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `invoice_${document.getElementById('invoiceNo').value}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showToast('Image downloaded successfully!', 'success');
    });
}

function shareWhatsApp() {
    const text = `Invoice ${document.getElementById('invoiceNo').value} - Total: ${document.getElementById('total').textContent}`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    toast.className = `toast-message ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg flex items-center text-sm`;
    toast.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
                ${message}
            `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Make functions globally available
window.addItem = addItem;
window.removeItem = removeItem;
window.calculateItemTotal = calculateItemTotal;
window.changeTheme = changeTheme;
window.updateCurrency = updateCurrency;
window.toggleWatermark = toggleWatermark;
window.toggleDarkMode = toggleDarkMode;
window.saveInvoice = saveInvoice;
window.loadInvoice = loadInvoice;
window.resetInvoice = resetInvoice;
window.downloadPDF = downloadPDF;
window.printInvoice = printInvoice;
window.downloadImage = downloadImage;
window.shareWhatsApp = shareWhatsApp;
window.generateQRCode = generateQRCode;
window.calculateBalance = calculateBalance;
