const n = "6387215755"

document.getElementById("contactus").addEventListener("click", () => {
    const message = "Mujhe Recharge Vali id Chahiye, ham ne aapke website se message kiya hai, Thank you. Please reply.";
    const url = `https://wa.me/91${n}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

});

document.getElementById("sharenowbtn").addEventListener("click", () => {

    const websiteUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=Click Here ${encodeURIComponent(websiteUrl)}`;
    window.open(whatsappUrl, "_blank");

});

var servicsdiv = document.getElementById("servicsdiv")
var activesheet = "1yqyPnBtwf6gUhOT3wFDk-FaQzSo6LfsnnDNm5WFZUE8"

fetch(`https://opensheet.elk.sh/${activesheet}/Servics`)
    .then(res => res.json())
    .then(data => {
        data.map((d, i) => {
            const div = document.createElement('div')
            div.className = "divOfServics"
            div.innerHTML = `<img src="../images/${d.images}.jpeg" alt="">
                <label for="">${d.name}</label>`

            servicsdiv.append(div)

            div.addEventListener("click", () => {
                if (d.images === "bike") {
                    window.open(`${d.redirectWebsite}`, "_blank")
                }else{
                    window.open(`${d.website}`, "_blank")
                }
                
            });
            div.addEventListener("dblclick", () => {
                window.open(`${d.redirectWebsite}`, "_blank")
            })
        })
    })
    .catch(err => {
        console.error(err);
    });