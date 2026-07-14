const scdata = "https://script.google.com/macros/s/AKfycbxFJzy93QB307PtFQlrcrcn5GxjzUwxDo-6EOnAvFrMxzFzwXVI7MV97xZMpu5D44aW/exec";

const SHEET_ID = "17Hci52sjdHkgFK-9MFNN8R_aLptajLS11a8qDb9ph-8";
const SHEET_NAME = "whatsapplo";

const mainDiv = document.querySelector(".maindiv");
const inputBox = document.getElementById("inputdata");

function randomId() {
    return Math.floor(Math.random() * 1000000000);
}

async function loadData() {
    try {

        const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`);
        const data = await res.json();

        mainDiv.innerHTML = "";

        data.forEach((element, index) => {

            const div = document.createElement("div");
            div.className = "div1";
            div.innerHTML = `${index + 1}. ${element.name}`;

            const color = (element.color || "").trim().toLowerCase();

            div.style.background =
                color === "green"
                    ? "#9be46d"
                    : "#f9b184";

            div.addEventListener("click", () => sendMessage(element, div));

            mainDiv.appendChild(div);

        });

    } catch (err) {
        console.error(err);
        alert("Unable to load data.");
    }
}

function sendMessage(element, div) {

    const message = inputBox.value.trim();

    if (!message) {
        inputBox.focus();
        return alert("Please enter your message.");
    }

    const uniqueId = randomId();

    // Change button color
    div.style.background = "#ff7043";

    // Update Google Sheet
    fetch(scdata, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            number: element.numberx,
            color: "red"
        })
    }).catch(err => console.log(err));

    // WhatsApp Message
    const whatsappMessage =
        `Hello Dear ${element.name},

${message}

ID : ${uniqueId}`;

    window.open(
        `https://wa.me/91${element.numberx}?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank"
    );

}

loadData();