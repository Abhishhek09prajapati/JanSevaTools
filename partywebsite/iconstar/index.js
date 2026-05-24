document.getElementById("contactus").addEventListener("click", () => {
    const message = "Mujhe Recharge Vali id Chahiye, ham ne aapke website se message kiya hai, Thank you. Please reply.";
    const url = `https://wa.me/916387215755?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

});

document.getElementById("sharenowbtn").addEventListener("click", () => {

    const websiteUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=Click Here ${encodeURIComponent(websiteUrl)}`;
    window.open(whatsappUrl, "_blank");

});