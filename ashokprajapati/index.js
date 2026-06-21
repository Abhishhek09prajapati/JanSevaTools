var datadiv = document.getElementById("datadiv");
let activePhoneNumber = "";
let activename = ""; // Renamed for clarity

var sheet = "18PFRXnhsRKWBE1XM576nWiKAVvt290ksegkUsolQul4"

fetch(`https://opensheet.elk.sh/${sheet}/ashok`)
    .then(res => res.json())
    .then(data => {
        data.map((d) => {
            const div = document.createElement("div");
            div.className = "divdata";
            div.innerHTML = `${d.name} - (${d.numbers})`;
            document.getElementById("whatsappdata").append(div);

            div.addEventListener("click", () => {
                datadiv.style.display = "block";
                activePhoneNumber = d.numbers;
                activename = d.name
                profiles(d.name, d.numbers);
            });
        });
    })
    .catch(err => console.error(err));

document.getElementById("close").addEventListener("click", () => {
    datadiv.style.display = "none";
});

function profiles(a, b) {
    document.getElementById('customername').innerText = a;
    document.getElementById('customernumber').innerText = b;
}

// Ensure this ID matches your input field
var amountInput = document.getElementById("valueamunt");

document.getElementById("sendmsg").addEventListener("click", () => {
    // Check if amount is provided and a number is selected
    if (amountInput.value && activePhoneNumber) {
        let amount = amountInput.value;
        let msg = encodeURIComponent(`Dear, ${activename} ji
Your payment of Rs ${amount} is pending Ashok Mobile Basti

If you have already made the payment, kindly ignore this message.

Thank You
Ashok Mobile reparing
8887868003`);

        // Open WhatsApp link
        window.open(`https://wa.me/91${activePhoneNumber}?text=${msg}`, "_blank");
    } else {
        alert("Please enter an amount and select a customer.");
    }
    datadiv.style.display = "none";
    amountInput.value = ""
});