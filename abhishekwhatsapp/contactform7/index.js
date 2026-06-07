document.getElementById("contactForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        referral: document.getElementById("referral").value,
        address: document.getElementById("address").value
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

        alert("Data Saved Successfully");
        document.getElementById("contactForm").reset();

    } catch (error) {
        console.log(error);
        alert("Error Saving Data");
    }

});