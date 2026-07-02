var catagor = "";

fetch('https://api.npoint.io/f1c1bf09eb96314477d5?t=' + Date.now())
    .then(res => res.json())
    .then(data => {
        let select = document.getElementById('selectcata2');
        data.catagories.forEach(w => {
            let option = document.createElement('option');
            option.textContent = w;
            option.value = w;   // important
            select.append(option);
        });

        // ✅ Only ONE event listener
        select.addEventListener("change", () => {
            catagor = select.value;
            // console.log(catagor);
        });

        // console.log(catagor)
        var listclass = document.getElementsByClassName('listclass')[0];
        var optionSelect = document.getElementById("selectcata");
        data.catagories.forEach((item) => {
            var option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            optionSelect.appendChild(option);
        });
        // ✅ change event select pe lagao
        optionSelect.addEventListener('change', function () {
            fetch('https://opensheet.elk.sh/1EuqJxpY5KCyjKtJFR4bZOn2Hdz7Ma6kGpMBZ4LEyg9U/shop')
                .then(res => res.json())
                .then(data => {
                    listclass.innerHTML = ""
                    const result = data.filter(e =>
                        e.whatsappcata.toLowerCase() === this.value.toLowerCase()
                    );


                    result.forEach((k, i) => {
                        const div = document.createElement("div");
                        div.className = "listitmes";
                        div.textContent = k.WhatsappGorupName;

                        div.addEventListener("click", () => {
                            window.open(k.Whatsappgrouplinks, "_blank");
                        });
                        listclass.append(div);
                    })
                })
                .catch(err => console.error("Error:", err));
        });

    })
    .catch(err => console.log(err));

var catago = localStorage.getItem('Catagories')

if (!catago) {
    localStorage.setItem("Catagories", "love group")
}





let div = document.querySelector(".addgroupdiv");
function addgroup() {
    if (div.style.display === "none") {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

document.querySelector('#closeid').addEventListener('click', () => {
    div.style.display = "none";
})

function addgroupbtn() {

    var groupnameInput = document.getElementById("groupname");
    var grouplinkInput = document.getElementById("grouplink");

    var groupname = groupnameInput.value.trim();
    var grouplink = grouplinkInput.value.trim();

    // Check empty fields
    if (!groupname || !grouplink) {
        alert("Please Enter Group Name and Link");
        return;
    }

    // Validate WhatsApp group link
    if (!grouplink.startsWith("https://chat.whatsapp.com/")) {
        alert("Please Enter Valid WhatsApp Group Link");
        return;
    }    // Optional: Check category selected
    if (!catagor) {
        alert("Please Select Category");
        return;
    }
    // Encode message
    var message = `Add my group: ${groupname} My link: ${grouplink}Category: ${catagor}`;

    var encodedMessage = encodeURIComponent(message);
    var url = `https://wa.me/916387215755?text=${encodedMessage}`;

    window.open(url, "_blank");

    // Clear input fields correctly
    groupnameInput.value = "";
    grouplinkInput.value = "";
}

fetch('https://opensheet.elk.sh/1EuqJxpY5KCyjKtJFR4bZOn2Hdz7Ma6kGpMBZ4LEyg9U/shop')
.then(res => res.json())
.then(data => {
    console.log(data)
    data.slice(0, 25).forEach(e => {   // 👈 only first 25
        const div = document.createElement('div');
        div.innerHTML = e.WhatsappGorupName;
        div.classList.add("lastestlist");
        document.getElementsByClassName('listclass')[0].append(div);
        div.addEventListener('click', () => {
            window.open(e.Whatsappgrouplinks, "_blank");
        });

    });

});

