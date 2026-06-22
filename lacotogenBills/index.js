document.addEventListener("DOMContentLoaded", () => {
    // 1. Select Form Inputs (Mapped exactly to your new HTML order)
    const inputs = document.querySelectorAll(".form-group input");
    const customerInput = inputs[0]; // Customer Name
    const medicineInput = inputs[1]; // Medicine Name
    const quantityInput = inputs[2]; // Quantity
    const mrpInput = inputs[3];      // MRP
    const discountInput = inputs[4]; // Discount (%)
    const batchInput = inputs[5];    // Batch Number
    const expiryInput = inputs[6];   // Expiry Date
    const serialInput = inputs[7];   // Serial No.
    const dateInput = inputs[8];     // Date

    // 2. Select Invoice Preview Elements
    const previewCustomer = document.getElementById("preview-patient");
    const previewDate = document.getElementById("daate");
    const previewSerial = document.getElementById("serialnumber");
    
    // 3. Select Table & Button Elements
    const tableBody = document.querySelector(".invoice-table tbody");
    const totalAmountCell = document.querySelector(".invoice-table tfoot td:last-child");
    const addButton = document.querySelector(".btn-primary");

    let totalBillAmount = 0;

    // 4. Add Click Event to the Button
    addButton.addEventListener("click", () => {
        // --- Update Invoice Header Details ---
        previewCustomer.textContent = customerInput.value || "-";
        previewSerial.textContent = serialInput.value || "-";
        
        // Format the date to standard Indian format (DD/MM/YYYY)
        if (dateInput.value) {
            const dateObj = new Date(dateInput.value);
            previewDate.textContent = dateObj.toLocaleDateString("en-IN");
        } else {
            previewDate.textContent = "-";
        }

        // --- Extract Item Details ---
        const medicineName = medicineInput.value.trim();
        const quantity = parseInt(quantityInput.value) || 0;
        const mrp = parseFloat(mrpInput.value) || 0;
        const discountPercent = parseFloat(discountInput.value) || 0;
        const batch = batchInput.value.trim() || "-";
        const expiry = expiryInput.value.trim() || "-";

        // Basic Validation: Stop if required item fields are empty
        if (!medicineName || quantity <= 0 || mrp <= 0) {
            alert("Please enter a valid Medicine Name, Quantity, and MRP.");
            return; // Stop function execution
        }

        // --- Calculate Amount with Discount ---
        const grossAmount = quantity * mrp;
        const discountValue = grossAmount * (discountPercent / 100);
        const itemAmount = grossAmount - discountValue;
        
        // Add to total bill amount
        totalBillAmount += itemAmount;

        // --- Create and Add to Table ---
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${medicineName}</td>
            <td>${quantity}</td>
            <td>${batch}</td>
            <td>${discountPercent}%</td>
            <td>${expiry}</td>
            <td>₹${mrp.toFixed(2)}</td>
            <td class="text-right">₹${itemAmount.toFixed(2)}</td>
        `;
        
        // Append row to the table body
        tableBody.appendChild(row);

        // Update the Total Amount in the footer
        totalAmountCell.textContent = `₹${totalBillAmount.toFixed(2)}`;

        // --- Auto-Clear Item Inputs ---
        // Clears the medicine info for the next item, leaving Customer, Serial, and Date intact.
        medicineInput.value = "";
        quantityInput.value = "";
        mrpInput.value = "";
        discountInput.value = "";
        batchInput.value = "";
        expiryInput.value = "";
    });
});