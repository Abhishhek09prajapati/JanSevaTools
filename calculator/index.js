// --- DOM Elements ---
// Patient & Doctor Fields
const patientInput = document.querySelector('input[placeholder="Enter Patient Name"]');
const doctorInput = document.querySelector('input[placeholder="Enter Doctor Name"]');
const previewPatient = document.getElementById('preview-patient');
const previewDoctor = document.getElementById('preview-doctor');
const serial = document.getElementById('serialnumber');
const serialnumber = document.querySelector('input[placeholder="Enter Serial no."]');

// Medicine Detail Fields
const medicineInput = document.querySelector('input[placeholder="e.g., Paracetamol"]');
const quantityInput = document.querySelector('input[placeholder="Enter Quantity"]');
const mrpInput = document.querySelector('input[placeholder="Enter MRP"]');
const batchInput = document.querySelector('input[placeholder="Enter Batch"]');
const expiryInput = document.querySelector('input[placeholder="Expiry Date"]');

// Layout Actions & Targets
const addButton = document.querySelector('.btn-primary');
const invoiceTableBody = document.querySelector('.invoice-table tbody');
const totalAmountElement = document.querySelector('.invoice-table tfoot td:last-child');

// Tracking array for item states
let billItems = [];

// --- 1. Live Text Mirroring ---
// Instantly mirrors inputs to the right-hand receipt as you type
patientInput.addEventListener('input', (e) => {
    previewPatient.textContent = e.target.value.trim() || '-';
});

doctorInput.addEventListener('input', (e) => {
    previewDoctor.textContent = e.target.value.trim() || '-';
});

serialnumber.addEventListener('input', (e) => {
    serial.textContent = e.target.value.trim() || '-';
});

// --- 2. Calculate Expiry Date Helper ---



// --- 3. Render Table Updates ---
function updateInvoiceTable() {
    // Clear old sample text rows
    invoiceTableBody.innerHTML = '';
    let grandTotal = 0;

    billItems.forEach((item) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.batch}</td>
            <td>${item.expiry}</td>
            <td>₹${item.mrp.toFixed(2)}</td>
            <td class="text-right">₹${item.amount.toFixed(2)}</td>
        `;
        
        invoiceTableBody.appendChild(row);
        grandTotal += item.amount;
    });

    // Update grand total value
    totalAmountElement.textContent = `₹${grandTotal.toFixed(2)}`;
}

// --- 4. Add Medicine Action Handler ---
addButton.addEventListener('click', () => {
    // Collect values safely
    const name = medicineInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const mrp = parseFloat(mrpInput.value);
    const batch = batchInput.value.trim() || 'N/A';

    // Basic Data Validation
    if (!name) {
        alert('Please enter a medicine name.');
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity greater than 0.');
        return;
    }
    if (isNaN(mrp) || mrp <= 0) {
        alert('Please enter a valid price/MRP.');
        return;
    }

    // Process total calculations
    const amount = quantity * mrp;
    const expiry = expiryInput.value.trim();

    // Push structured data object into the array tracker
    billItems.push({ name, quantity, batch, expiry, mrp, amount });

    // Refresh UI display components
    updateInvoiceTable();

    // Reset layout fields for next medicine item entry
    medicineInput.value = '';
    quantityInput.value = '';
    mrpInput.value = '';
    batchInput.value = '';
    expiryInput.value = "";
    
    // Auto-focus back onto medicine input for speed typing workflow
    medicineInput.focus();
});



// Get the current date and time
const date = new Date();

// Options to format it nicely: e.g., "15-Jun-2026, 06:07 PM"
const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
};

// Format and inject into the HTML element
document.getElementById("daate").innerHTML = date.toLocaleString('en-IN', options);