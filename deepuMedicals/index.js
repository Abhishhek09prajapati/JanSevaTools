var sheetName = "1cb28gYunLwsO9v6Jpxbhxg6NqGYN_9v0MwCJ5e-GyzQ";
var whastappData = document.getElementById("whatsappnumber");
var whastappNumber = "8467822578";

var scipt = "https://script.google.com/macros/s/AKfycbzutnWIxWzZHfzWOwomlw1Z4uZwsTzm028nqwFNGlOZvBoWzwOiRyhiYdcMM3CbJHN6Ow/exec";


let tempmessagetext = "";

fetch(`https://opensheet.elk.sh/${sheetName}/Customer`)
    .then(response => response.json())
    .then(data => {
        data.map((d, i) => {

            var div = document.createElement("div");
            div.style.padding = "10px 0px";
            div.style.borderRadius = "5px";
            div.style.paddingLeft = "15px"
            div.className = "divwhatsapp"
            div.innerHTML = `${d.customerName.toUpperCase()} - ${d.customerNumber}`
            whastappData.append(div);


            if (d.color == "green") {
                div.style.background = "white"
            } else {
                div.style.background = "red"
                div.style.color = "white"
            }


            div.addEventListener('click', () => {


                if (tempmessagetext) {
                    fetch(`${scipt}`, {
                        method: "POST",
                        mode: "no-cors", // Bypasses standard cross-origin restriction rules
                        headers: {
                            "Content-Type": "text/plain" // Prevents browser from sending an OPTIONS preflight request
                        },
                        body: JSON.stringify({
                            number: d.customerNumber,
                            color: "red"
                        })
                    })
                        .then(() => {
                            /* With mode: "no-cors", the response is 'opaque'. 
                              We cannot read response.ok, but the fetch will complete.
                              We can now safely trigger the WhatsApp redirect.
                            */

                            if (d.color == "green") {
                                const message = `Dear ${d.customerName.toUpperCase()} Ji , \n\n ${tempmessagetext}`;
                                window.open(`https://wa.me/91${d.customerNumber}?text=${encodeURIComponent(message)}`, "target");
                            } else {
                                alert("Message already Send")
                            }



                        })
                        .catch(error => {
                            console.error("Network Error:", error);
                            alert("Something went wrong with the network request.");
                        });
                } else {
                    alert("Please Enter Template Value");
                }
            });



        })
    })
    .catch(error => console.error('Error fetching data:', error));




// The link you provided
const whatsappUrl = `https://wa.me/91${whastappNumber}?text=Hello`;

// The API endpoint for QR generation
const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappUrl)}`;

// Inject the image into the div
const container = document.getElementById('barcodeVew');
container.innerHTML = `<img src="${qrApi}" alt="WhatsApp QR Code">`;




document.getElementsByClassName("messagebtn")[0].addEventListener('click', () => {
    document.getElementById("whatsappnumber").style.display = "block";
    document.getElementById("Barcodebox").style.display = "none";
    document.getElementById("templatebox").style.display = "none"
})

document.getElementsByClassName("barcodebtn")[0].addEventListener('click', () => {
    document.getElementById("whatsappnumber").style.display = "none";
    document.getElementById("Barcodebox").style.display = "flex";
    document.getElementById("templatebox").style.display = "none"
})

document.getElementsByClassName("templatebtn")[0].addEventListener('click', () => {
    document.getElementById("whatsappnumber").style.display = "none";
    document.getElementById("Barcodebox").style.display = "none";
    document.getElementById("templatebox").style.display = "block"
})

document.getElementById('copyBtn').addEventListener('click', function () {
    const textArea = document.getElementById('messageInput');

    // Select the text
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    // Copy to clipboard
    navigator.clipboard.writeText(textArea.value).then(() => {
        // Optional: Provide feedback to the user
        const originalText = this.textContent;
        this.textContent = "Copied!";

        // Reset button text after 2 seconds
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

document.getElementById("messageInput").addEventListener("input", (e) => {
    tempmessagetext = e.target.value;
})