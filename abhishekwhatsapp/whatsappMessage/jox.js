const scdata = "https://script.google.com/macros/s/AKfycbxFJzy93QB307PtFQlrcrcn5GxjzUwxDo-6EOnAvFrMxzFzwXVI7MV97xZMpu5D44aW/exec";
const b = `17Hci52sjdHkgFK-9MFNN8R_aLptajLS11a8qDb9ph-8`;
const t = `whatsapplo`;

fetch(`https://opensheet.elk.sh/${b}/${t}`)
    .then(res => res.json())
    .then((data) => {
        const mainDiv = document.querySelector(".maindiv");
        mainDiv.innerHTML = "";

        data.forEach((element, i) => {
            const div = document.createElement("div");
            div.classList.add("div1");
            div.innerHTML = `${i + 1}. ${element.name}`;

            // Color set (Safely handling potential empty/undefined color cells)
            const elementColor = element.color ? element.color.trim().toLowerCase() : "";
            if (elementColor === "green") {
                div.style.backgroundColor = "rgb(141, 236, 106)";
            } else {
                div.style.backgroundColor = "rgb(247, 151, 109)";
            }

            // Click Event
            div.addEventListener("click", () => {
                const textmsg = document.getElementById('inputdata').value.trim();
                const k = Math.ceil(Math.random() * 1000000000);

                if (textmsg !== "") {
                    // Update UI color immediately since 'no-cors' won't return data
                    div.style.backgroundColor = "rgb(246, 127, 76)";

                    // Send tracking data to Google Script
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
                    })
                    .catch(err => console.error("Tracking failed:", err));

                    // Open WhatsApp in a new tab
                    const encodedMsg = encodeURIComponent(`Hello Dear ${element.name}, ${textmsg} \n ${k}`);
                    window.open(`https://wa.me/91${element.numberx}?text=${encodedMsg}`, '_blank');

                } else {
                    alert("Please, Enter Message");
                }
            });

            mainDiv.appendChild(div);
        });

        // Ensure maindiv displays after population
        mainDiv.style.display = "block";
    })
    .catch(err => console.error("Error fetching sheet data:", err));