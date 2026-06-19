function showqr() {

    var upii = document.getElementsByClassName("maindiv")[0].querySelector("input[placeholder='Enter UPI ID']").value;
    var amount = document.getElementsByClassName("maindiv")[0].querySelector("input[placeholder='Enter Amount']").value;

    if (upii && amount) {
        showqr1(upii, amount)
    } else {
        alert("Please UPI and Amount")
    }
}

function showqr1(a, b) {
    document.getElementById("showbarcode").style.display = "block"
    document.getElementById("showbarcode").innerHTML = "";
    const note = "Payment for Services";
    const payeeName = "Iconstar Business";

    const upiString = `upi://pay?pa=${a}&pn=${encodeURIComponent(payeeName)}&am=${b}&tn=${encodeURIComponent(note)}&cu=INR`;

    // 3. Generate the QR Code
    // Your existing code
    new QRCode(document.getElementById("showbarcode"), {
        text: upiString,
        width: 300,
        height: 300,
        colorDark: "#110101",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });

    document.getElementsByClassName("maindiv")[0].querySelector("input[placeholder='Enter UPI ID']").value = "";
    document.getElementsByClassName("maindiv")[0].querySelector("input[placeholder='Enter Amount']").value = "";
    // 6387215755@ptaxis

}