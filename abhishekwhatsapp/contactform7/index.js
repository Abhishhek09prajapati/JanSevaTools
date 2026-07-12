var loading = document.getElementById("loading")
loading.style.display = "none"

document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "flex"
    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        referral: document.getElementById("referral").value,
        address: document.getElementById("address").value,
        ocupation: document.getElementById("ocupation").value
    };

    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbzJAoWVlfmy2p3gmOht65KLjld0CezhYefvvNo7Uv-2ok4I0riQUEgz_h1BSspKp1nV/exec",
            {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data)
            }
        );

        
        loading.style.display = "none"
        document.getElementById("contactForm").reset();

    } catch (error) {
        console.log(error);
        alert("Error Sending Data");
    }

});