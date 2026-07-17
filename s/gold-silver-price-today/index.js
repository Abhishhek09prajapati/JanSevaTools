
// Helper functions
function formatINR(amount) { return '₹' + Math.round(amount).toLocaleString('en-IN'); }

// Gold Cart State
let goldCart = [];

// Silver Cart State
let silverCart = [];

// Calculate individual gold item price
function calculateGoldItemPrice(rate10g, weight, karat, makingPercent, gstPercent) {
    let perGram = rate10g / 10;
    let purity = karat === 24 ? 1 : (karat === 22 ? 0.916 : 0.75);
    let metalRate = perGram * purity;
    let metalValue = weight * metalRate;
    let making = metalValue * (makingPercent / 100);
    let subtotal = metalValue + making;
    let gst = subtotal * (gstPercent / 100);
    return { metalValue, making, gst, total: subtotal + gst };
}

// Calculate individual silver item price
function calculateSilverItemPrice(rateKg, weight, purityValue, makingPercent, gstPercent) {
    let perGram = rateKg / 1000;
    let purityFactor = purityValue === 999 ? 1 : 0.925;
    let metalRate = perGram * purityFactor;
    let metalValue = weight * metalRate;
    let making = metalValue * (makingPercent / 100);
    let subtotal = metalValue + making;
    let gst = subtotal * (gstPercent / 100);
    return { metalValue, making, gst, total: subtotal + gst };
}

// Render Gold Cart
function renderGoldCart() {
    const container = document.getElementById('goldCartItems');
    const rate10g = parseFloat(document.getElementById('goldCartRate').value) || 0;

    if (goldCart.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-4">No items added. Add gold jewellery above.</div>';
        document.getElementById('goldCartFinalTotal').innerHTML = '₹0';
        document.getElementById('goldCartBreakdown').innerHTML = '';
        return;
    }

    let grandTotal = 0;
    let breakdownItems = [];

    container.innerHTML = goldCart.map((item, idx) => {
        const price = calculateGoldItemPrice(rate10g, item.weight, item.karat, item.making, item.gst);
        grandTotal += price.total;
        breakdownItems.push(`${item.name}: ${formatINR(price.total)} (${item.weight}g, ${item.karat}K, making ${item.making}%, GST ${item.gst}%)`);
        return `
                    <div class="cart-item bg-amber-50 p-3 rounded-lg flex justify-between items-center">
                        <div class="flex-1">
                            <span class="font-semibold">${item.name}</span>
                            <span class="text-xs text-gray-500 ml-2">${item.weight}g | ${item.karat}K | Making ${item.making}% | GST ${item.gst}%</span>
                        </div>
                        <div class="text-right">
                            <span class="font-bold text-amber-700">${formatINR(price.total)}</span>
                            <button onclick="removeGoldItem(${idx})" class="ml-3 text-red-500 hover:text-red-700"><i class="fas fa-trash-alt text-sm"></i></button>
                        </div>
                    </div>
                `;
    }).join('');

    document.getElementById('goldCartFinalTotal').innerHTML = formatINR(grandTotal);
    document.getElementById('goldCartBreakdown').innerHTML = breakdownItems.map((item, i) => `<span>${item}</span>`).join('<br>');
}

// Render Silver Cart
function renderSilverCart() {
    const container = document.getElementById('silverCartItems');
    const rateKg = parseFloat(document.getElementById('silverCartRate').value) || 0;

    if (silverCart.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-4">No items added. Add silver jewellery above.</div>';
        document.getElementById('silverCartFinalTotal').innerHTML = '₹0';
        document.getElementById('silverCartBreakdown').innerHTML = '';
        return;
    }

    let grandTotal = 0;
    let breakdownItems = [];

    container.innerHTML = silverCart.map((item, idx) => {
        const price = calculateSilverItemPrice(rateKg, item.weight, item.purity, item.making, item.gst);
        grandTotal += price.total;
        let purityText = item.purity === 999 ? '99.9%' : '92.5%';
        breakdownItems.push(`${item.name}: ${formatINR(price.total)} (${item.weight}g, ${purityText}, making ${item.making}%, GST ${item.gst}%)`);
        return `
                    <div class="cart-item bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                        <div class="flex-1">
                            <span class="font-semibold">${item.name}</span>
                            <span class="text-xs text-gray-500 ml-2">${item.weight}g | ${purityText} | Making ${item.making}% | GST ${item.gst}%</span>
                        </div>
                        <div class="text-right">
                            <span class="font-bold text-gray-700">${formatINR(price.total)}</span>
                            <button onclick="removeSilverItem(${idx})" class="ml-3 text-red-500 hover:text-red-700"><i class="fas fa-trash-alt text-sm"></i></button>
                        </div>
                    </div>
                `;
    }).join('');

    document.getElementById('silverCartFinalTotal').innerHTML = formatINR(grandTotal);
    document.getElementById('silverCartBreakdown').innerHTML = breakdownItems.map((item, i) => `<span>${item}</span>`).join('<br>');
}

// Add Gold Item
function addGoldItem() {
    let name = document.getElementById('goldItemName').value.trim();
    if (!name) name = 'Gold Item';
    let weight = parseFloat(document.getElementById('goldItemWeight').value);
    let karat = parseInt(document.getElementById('goldItemKarat').value);
    let making = parseFloat(document.getElementById('goldItemMaking').value);
    let gst = parseFloat(document.getElementById('goldItemGst').value);

    if (isNaN(weight) || weight <= 0) { alert('Please enter valid weight'); return; }

    goldCart.push({ name, weight, karat, making, gst });
    renderGoldCart();

    // Reset input fields
    document.getElementById('goldItemName').value = '';
    document.getElementById('goldItemWeight').value = '10';
}

// Remove Gold Item
window.removeGoldItem = function (idx) {
    goldCart.splice(idx, 1);
    renderGoldCart();
};

// Add Silver Item
function addSilverItem() {
    let name = document.getElementById('silverItemName').value.trim();
    if (!name) name = 'Silver Item';
    let weight = parseFloat(document.getElementById('silverItemWeight').value);
    let purity = parseInt(document.getElementById('silverItemPurity').value);
    let making = parseFloat(document.getElementById('silverItemMaking').value);
    let gst = parseFloat(document.getElementById('silverItemGst').value);

    if (isNaN(weight) || weight <= 0) { alert('Please enter valid weight'); return; }

    silverCart.push({ name, weight, purity, making, gst });
    renderSilverCart();

    document.getElementById('silverItemName').value = '';
    document.getElementById('silverItemWeight').value = '50';
}

// Remove Silver Item
window.removeSilverItem = function (idx) {
    silverCart.splice(idx, 1);
    renderSilverCart();
};

// Clear Carts
function clearGoldCart() { goldCart = []; renderGoldCart(); }
function clearSilverCart() { silverCart = []; renderSilverCart(); }

// Event Listeners
document.getElementById('addGoldItemBtn').addEventListener('click', addGoldItem);
document.getElementById('addSilverItemBtn').addEventListener('click', addSilverItem);
document.getElementById('clearGoldCart').addEventListener('click', clearGoldCart);
document.getElementById('clearSilverCart').addEventListener('click', clearSilverCart);
document.getElementById('goldCartRate').addEventListener('input', () => renderGoldCart());
document.getElementById('silverCartRate').addEventListener('input', () => renderSilverCart());

// Basic Gold Calculator (Tool 1)
const gold10g = document.getElementById('gold10gRate'), goldWeightBase = document.getElementById('goldWeightBase'), goldKaratBase = document.getElementById('goldKaratBase'), goldMakingBase = document.getElementById('goldMakingBase'), goldGstBase = document.getElementById('goldGstBase');
const goldBaseTotalSpan = document.getElementById('goldBaseTotal'), goldBaseBreakdown = document.getElementById('goldBaseBreakdown');
function updateGoldBase() {
    let rate10g = parseFloat(gold10g.value) || 0, weight = parseFloat(goldWeightBase.value) || 0, karat = parseInt(goldKaratBase.value), makingP = parseFloat(goldMakingBase.value) || 0, gstP = parseFloat(goldGstBase.value) || 0;
    let perGram = rate10g / 10, purity = karat === 24 ? 1 : karat === 22 ? 0.916 : 0.75, metalRate = perGram * purity, metalVal = weight * metalRate, making = metalVal * (makingP / 100), sub = metalVal + making, gst = sub * (gstP / 100), total = sub + gst;
    goldBaseTotalSpan.innerText = formatINR(total);
    goldBaseBreakdown.innerHTML = `💎 Metal: ${formatINR(metalVal)} | Making(${makingP}%): ${formatINR(making)} | GST(${gstP}%): ${formatINR(gst)}`;
}
[gold10g, goldWeightBase, goldKaratBase, goldMakingBase, goldGstBase].forEach(el => el.addEventListener('input', updateGoldBase));
document.getElementById('resetGoldBase').addEventListener('click', () => { gold10g.value = '75200'; goldWeightBase.value = '10'; goldKaratBase.value = '22'; goldMakingBase.value = '3'; goldGstBase.value = '3'; updateGoldBase(); });

// Basic Silver Calculator
const silverKg = document.getElementById('silverKgRate'), silverWeight = document.getElementById('silverWeightBase'), silverUnit = document.getElementById('silverUnitBase'), silverMaking = document.getElementById('silverMakingBase'), silverGst = document.getElementById('silverGstBase');
const silverTotalSpan = document.getElementById('silverBaseTotal'), silverBreakdown = document.getElementById('silverBaseBreakdown');
function updateSilverBase() {
    let kgRate = parseFloat(silverKg.value) || 0, weightVal = parseFloat(silverWeight.value) || 0, unit = silverUnit.value, makingP = parseFloat(silverMaking.value) || 0, gstP = parseFloat(silverGst.value) || 0;
    let grams = unit === 'kg' ? weightVal * 1000 : weightVal, perGram = kgRate / 1000, metalVal = grams * perGram, making = metalVal * (makingP / 100), sub = metalVal + making, gst = sub * (gstP / 100), total = sub + gst;
    silverTotalSpan.innerText = formatINR(total);
    silverBreakdown.innerHTML = `⚖️ Metal: ${formatINR(metalVal)} | Making(${makingP}%): ${formatINR(making)} | GST(${gstP}%): ${formatINR(gst)}`;
}
[silverKg, silverWeight, silverUnit, silverMaking, silverGst].forEach(el => el.addEventListener('input', updateSilverBase));
document.getElementById('resetSilverBase').addEventListener('click', () => { silverKg.value = '92500'; silverWeight.value = '100'; silverUnit.value = 'gram'; silverMaking.value = '3'; silverGst.value = '3'; updateSilverBase(); });

// Initialize
updateGoldBase();
updateSilverBase();
renderGoldCart();
renderSilverCart();

// Add sample items for demonstration
setTimeout(() => {
    if (goldCart.length === 0) {
        goldCart.push({ name: "Gold Necklace", weight: 15, karat: 22, making: 5, gst: 3 });
        goldCart.push({ name: "Gold Earrings", weight: 8, karat: 22, making: 8, gst: 3 });
        renderGoldCart();
    }
    if (silverCart.length === 0) {
        silverCart.push({ name: "Silver Bangle", weight: 100, purity: 999, making: 3, gst: 3 });
        silverCart.push({ name: "Silver Chain", weight: 150, purity: 925, making: 5, gst: 3 });
        renderSilverCart();
    }
}, 100);
