var serachdata = document.getElementById("serachdata")

var sh = "16Z4hqbx03qxABQIn8JtwvwjSlTrYxTzfcjjR7eULESU"
let userData = null

document.getElementsByClassName("close-btn")[0].addEventListener("click", () => {
    document.getElementById("addentery").style.display = "none"
})







document.getElementById("searchnumber").addEventListener("click", () => {
    if (serachdata.value && serachdata.value.length === 10) {

        fetch(`https://opensheet.elk.sh/${sh}/shop`) // सही URL और Quotes
            .then(res => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json(); // फ़ंक्शन को () के साथ कॉल किया
            })
            .then(data => {
                var newData = data.filter(u => u.number === serachdata.value)
                userData = newData[0]

                document.getElementById("namedata").innerHTML = ` Customer Name : ${userData.name} </br>`
                document.getElementById("numberdata").innerHTML = `Customer Number : ${userData.number}`

            })
            .catch(error => {
                console.error("डेटा फेच करने में एरर आई:", error);
            });

    } else {
        alert("Please Enter Valid Number")
    }
})

var billNumber = document.getElementById("billNumber");
var enterAmount = document.getElementById("enterAmount");

var dr = document.getElementById("dooo");
var cr = document.getElementById("cooo");

document.getElementById("sendData").addEventListener("click", () => {

    const data = [
        billNumber.value,
        enterAmount.value,
        dr.value,
        cr.value
    ];

    fetch("YOUR_GOOGLE_SCRIPT_WEB_APP_URL", {

        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data : data })
    })
        .then(res => res.text())
        .then(result => {
            alert("Data Saved Successfully");
            console.log(result);
        })
        .catch(err => {
            console.log(err);
            alert("Error Sending Data");
        });

});