function searchh() {

    let inputlink = document.getElementById("inputtxt").value;
    let result = document.getElementById("result");
    if (!inputlink) {
        alert("Enter API URL");
        return;
    }

    fetch(inputlink)
        .then(res => res.json())
        .then(data => {

            result.textContent =
                JSON.stringify(data, null, 2);

        })
        .catch(err => {

            result.innerHTML =
                `<span style="color:red">${err}</span>`;
        });

}