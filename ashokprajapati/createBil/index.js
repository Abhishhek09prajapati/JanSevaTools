// --- DOM Elements ---
const customerInput = document.querySelector('input[placeholder="Enter Customer Name"]');
const previewPatient = document.getElementById('preview-patient');
const serialInput = document.querySelector('input[placeholder="Enter Serial no."]');
const previewSerial = document.getElementById('serialnumber');
const dateInput = document.querySelector('input[type="date"]');
const previewDate = document.getElementById('daate');

// Product Fields
const productInput = document.querySelector('input[placeholder="e.g., Mobile Product"]');
const qtyInput = document.querySelector('input[placeholder="Enter Quantity"]');
const mrpInput = document.querySelector('input[placeholder="Enter MRP"]');
const batchInput = document.querySelector('input[placeholder="Enter Batch"]');

// Table & Actions
const addButton = document.querySelector('.btn-primary');
const invoiceTableBody = document.querySelector('.invoice-table tbody');
const totalAmountElement = document.querySelector('.invoice-table tfoot td:last-child');

let billItems = [];

// --- 1. Live Text Mirroring ---
customerInput.addEventListener('input', (e) => {
    previewPatient.textContent = e.target.value || '-';
});

serialInput.addEventListener('input', (e) => {
    previewSerial.textContent = e.target.value || '-';
});

dateInput.addEventListener('input', (e) => {
    previewDate.textContent = e.target.value || '';
});

// --- 2. Logic: Add Item to Table ---
function updateInvoiceTable() {
    invoiceTableBody.innerHTML = '';
    let grandTotal = 0;

    billItems.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.qty}</td>
            <td>${item.batch}</td>
            <td>₹${item.mrp.toFixed(2)}</td>
            <td class="text-right">₹${item.amount.toFixed(2)}</td>
        `;
        invoiceTableBody.appendChild(row);
        grandTotal += item.amount;
    });

    totalAmountElement.textContent = `₹${grandTotal.toFixed(2)}`;
}

addButton.addEventListener('click', () => {
    const product = productInput.value.trim();
    const qty = parseInt(qtyInput.value);
    const mrp = parseFloat(mrpInput.value);
    const batch = batchInput.value.trim() || 'N/A';

    if (!product || isNaN(qty) || isNaN(mrp)) {
        alert('Please fill in valid Product, Quantity, and MRP.');
        return;
    }

    const amount = qty * mrp;
    billItems.push({ product, qty, mrp, batch, amount });

    updateInvoiceTable();

    // Reset product fields
    productInput.value = '';
    qtyInput.value = '';
    mrpInput.value = '';
    batchInput.value = '';
    productInput.focus();
});