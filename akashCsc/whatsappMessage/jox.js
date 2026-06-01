const scdata =
    "https://script.google.com/macros/s/AKfycbyc8dj5vgdZ9jH9LsCvv-2FIlqKbxwrSxOiv_pTB8Q0zUq-0diOpntaqbQaIM2Acuf4/exec";



const b = `1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA`;
const t = `whatsappdata`

fetch(`https://opensheet.elk.sh/${b}/${t}`)
    .then(res => res.json())
    .then((data) => {

        document.querySelector(".maindiv").innerHTML = "";
        data.forEach((element, i) => {
            const div = document.createElement("div");
            div.classList.add("div1");
            div.innerHTML = `${i + 1} .  Message on Different Number`;

            // Color set
            if (element.color.trim().toLowerCase() === "green") {
                div.style.backgroundColor = "rgb(141, 236, 106)";
            } else {

                
                div.style.backgroundColor = "rgb(247, 151, 109)";
            }
            // Click Event
            div.addEventListener("click", () => {

                var textmsg = document.getElementById('inputdata').value;
                var k = Math.ceil(Math.random() * 1000000000)
                if (textmsg != "") {
                    fetch(scdata, {
                        method: "POST",
                        mode: "no-cors",
                        body: JSON.stringify({
                            number: element.numberx,
                            color: "red"
                        })
                    })
                        .then(res => res.text())
                        .then(result => {
                            div.style.backgroundColor = "rgb(246, 127, 76)";

                        })
                        .catch(err => console.log(err));
                    window.open(`https://wa.me/91${element.numberx}?text=Hello Dear ${element.name},  ${textmsg} \n ${k}`)
                } else {
                    alert("PLease , Enter Message")
                }
            });

            document.querySelector(".maindiv").appendChild(div);

        });

    })
    .catch(err => console.log(err));

document.querySelector(".maindiv").style.display = "block";




