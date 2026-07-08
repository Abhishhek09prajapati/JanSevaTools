// ==========================================
// 1. Global Configuration & DOM Elements
// ==========================================
const sheetId = "1kO3qRaQB5bzuv8WF5H_yHMVJfjwl9dLiCuG1jb_y39c";
const apiURL = `https://opensheet.elk.sh/${sheetId}/shayariAbhishek`;

const menuBar = document.getElementById("menuBar");
const navLinksitems = document.getElementById("navLinksitems");
const shayariOption = document.getElementById("shayariOtion");
const shayariDiv = document.getElementById("shayariData");

let globalShayariData = []; // बार-बार fetch करने से बचने के लिए डेटा यहाँ स्टोर होगा
let isMenuOpen = false;

// ==========================================
// 2. Responsive Mobile Navbar Menu Toggle
// ==========================================
menuBar.addEventListener("click", () => {
    if (!isMenuOpen) {
        navLinksitems.classList.add("active");
        menuBar.innerHTML = "&#10006;"; // Close (X) icon
        isMenuOpen = true;
    } else {
        navLinksitems.classList.remove("active");
        menuBar.innerHTML = "&#9776;"; // Hamburger menu icon
        isMenuOpen = false;
    }
});

// ==========================================
// 3. Fetch Data Once & Initialize Dropdown
// ==========================================
fetch(apiURL)
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => {
        globalShayariData = data; // डेटा सुरक्षित रख लिया

        // Google Sheet से सारी कैटेगरीज निकालना और खाली फ़ील्ड्स को हटाना
        const allCategories = data.map(d => d.catagories).filter(Boolean);

        // Duplicate कैटेगरीज हटाना
        const uniqueCategories = [...new Set(allCategories)];

        // ड्रॉपडाउन में पहला ऑप्शन सेट करना
        shayariOption.innerHTML = '<option value="">--- चुनें शायरी कैटेगरी ---</option>';

        // लूप चलाकर ड्रॉपडाउन में कैटेगरीज जोड़ना
        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            shayariOption.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching or parsing data:", error));

// ==========================================
// 4. Dropdown Change Event Listener
// ==========================================
shayariOption.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory) {
        renderShayari(selectedCategory);
    } else {
        shayariDiv.innerHTML = ""; // अगर कोई कैटेगरी सिलेक्ट न हो तो स्क्रीन क्लियर रखें
    }
});

// ==========================================
// 5. Render Selected Shayari to the Screen
// ==========================================
function renderShayari(categoryName) {
    shayariDiv.innerHTML = ""; // पुराना डेटा साफ़ करें

    // सिलेक्ट की गई कैटेगरी में से सिर्फ वही रो फ़िल्टर करें जो खाली नहीं हैं
    const filteredData = globalShayariData.filter(
        item => item[categoryName] && item[categoryName].trim() !== ""
    );

    if (filteredData.length === 0) {
        shayariDiv.innerHTML = "<p style='text-align:center; width:100%; color:#64748b;'>इस कैटेगरी में अभी कोई शायरी उपलब्ध नहीं है।</p>";
        return;
    }

    // स्क्रीन पर शायरी के कार्ड्स बनाना
    filteredData.forEach((item, index) => {
        const text = item[categoryName];
        const card = document.createElement("div");
        card.className = "shaDiv"; // यह क्लास आपके CSS से मैच करेगी

        // शायरी और आधुनिक SVG कॉपी/शेयर बटन्स
        card.innerHTML = `
            <p>${index + 1}. ${text}</p>
            <div class="shareBtn" style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                <button onclick="copyToClipboard(\`${text.replace(/`/g, '\\`').replace(/\n/g, '\\n')}\`)" title="Copy Shayari" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">📋 Copy</button>
                <button onclick="shareToWhatsApp(\`${text.replace(/`/g, '\\`').replace(/\n/g, '\\n')}\`)" title="Share on WhatsApp" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🟢 WhatsApp</button>
            </div>
        `;
        shayariDiv.appendChild(card);
    });
}

// ==========================================
// 6. Utility Functions (Copy & Share)
// ==========================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert("शायरी कॉपी हो गई है!"))
        .catch(err => console.error("Copy failed: ", err));
}

function shareToWhatsApp(text) {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
}