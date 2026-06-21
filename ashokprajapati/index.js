var datadiv = document.getElementById("datadiv");
let activePhoneNumber = ""; // Renamed for clarity

fetch("https://opensheet.elk.sh/1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA/ashok")
    .then(res => res.json())
    .then(data => {
        data.map((d) => {
            const div = document.createElement("div");
            div.className = "divdata";
            div.innerHTML = `${d.name} - (${d.numbers})`;
            document.getElementById("whatsappdata").append(div);

            div.addEventListener("click", () => {
                datadiv.style.display = "block";
                activePhoneNumber = d.numbers; // Store globally when clicked
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
        let msg = encodeURIComponent(`Hello, aapka bakaya raashi hai: ${amount}`);

        // Open WhatsApp link
        window.open(`https://wa.me/91${activePhoneNumber}?text=${msg}`, "_blank");
    } else {
        alert("Please enter an amount and select a customer.");
    }
    datadiv.style.display = "none";
    amountInput.value = ""
});