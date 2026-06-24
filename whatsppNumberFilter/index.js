var finalOutput = "";
document.getElementById("pastenumber").addEventListener("input", (e) => {
    // 1. Get the pasted raw text/HTML data from the input element
    var rawText = e.target.value;

    // 2. टेक्स्ट में से सभी नंबरों को मैच करें
    var foundNumbers = rawText.match(/(?:\+?\d{1,3}[- ]?)?\d{2,5}[- ]?\d{2,5}[- ]?\d{3,5}/g);


    if (foundNumbers) {
        var cleanNumbers = foundNumbers
            .map(num => num.replace(/[^0-9]/g, '')) // केवल नंबर रखें (अक्षर और स्पेस हटाएं)
            .map(num => num.length > 10 && num.startsWith('91') ? num.slice(2) : num) // आगे से 91 हटाएं
            .filter(num => num.length === 10); // केवल 10-digit वाले नंबर रखें

        // डुप्लीकेट नंबर हटाने के लिए
        var uniqueNumbers = [...new Set(cleanNumbers)];

        // 3. हर 10-digit नंबर के बाद <br> (Next Line) जोड़ें
        finalOutput = uniqueNumbers.join('<br>');
    } else {
        finalOutput = "No 10-digit numbers found...";
    }

    // 4. Output the result cleanly 
    document.getElementById("filterdata").innerHTML = finalOutput;
});


function copydata() {
    // div को सेलेक्ट करें
    var filterDataBox = document.getElementById("filterdata");
    
    // <br> टैग्स को असली न्यू-लाइन (\n) में बदलें ताकि केवल 10-digit नंबर्स ही कॉपी हों
    var textToCopy = filterDataBox.innerHTML.replace(/<br\s*\/?>/mg, "\n");

    // अगर कोई वैलिड नंबर नहीं है तो कॉपी न करे
    if (textToCopy === "" || textToCopy.includes("No 10-digit numbers found")) {
        alert("कॉपी करने के लिए कोई नंबर नहीं है!");
        return;
    }

    // क्लिपबोर्ड में कॉपी करने का कोड
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("सभी नंबर सफलतापूर्वक कॉपी हो गए!");
    }).catch(err => {
        console.error("Copy failed: ", err);
    });
}