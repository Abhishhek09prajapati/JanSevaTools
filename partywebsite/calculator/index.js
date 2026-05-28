var result = 0;
var totalmrp = 0;


function addTable() {
    const itmesname = document.getElementById('itemname').value.trim();
    const mrp = document.getElementById('mrp').value.trim();
    const discount = document.getElementById('discount').value.trim();
    const qty = document.getElementById('qty').value.trim();

    if (!itmesname || !mrp || !discount || !qty) {
        alert("Please Inter All Value")
        return
    }
    var date = new Date();

    // Format date and time
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months start from 0
    var year = date.getFullYear();

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Add leading zero if needed
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    // Display formatted date and time
    document.getElementById("date1").innerText = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;


    var rate = Math.round(mrp - mrp * discount / 100);
    var total = rate * qty;

    totalmrp += mrp * qty;

    result += total;


    document.getElementById('result').innerHTML = "Total Amount " + result;
    document.getElementById('totalmrp').innerHTML = `Aapka total mrp yeh hai ${totalmrp.toFixed(2)} rs hai`;


    const tablebody = document.getElementById('dataTable').querySelector('tbody');


    const newRow = tablebody.insertRow();

    // Desktop: right click delete (optional)
    newRow.insertCell(0).textContent = qty;
    newRow.insertCell(1).textContent = itmesname;
    newRow.insertCell(2).textContent = mrp;
    newRow.insertCell(3).textContent = rate;
    newRow.insertCell(4).textContent = discount;
    newRow.insertCell(5).textContent = total;

    document.getElementById('itemname').value = "";
    document.getElementById('mrp').value = "";
    document.getElementById('discount').value = "";
    document.getElementById('qty').value = "";

}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode() {

    let code = "";
    for (let i = 0; i < 10; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

document.getElementById('promocode').innerHTML = `Code : ${generateCode()}`

var mrpvale = document.getElementById('mrp')
mrpvale.addEventListener("input", () => {
    var totalmrp = ""
    totalmrp = Math.round(mrpvale.value - mrpvale.value * 15 / 100)
    document.getElementById('ratevale').placeholder = totalmrp
})

document.getElementById("passwordbox").addEventListener('input', () => {
    fetch('https://api.npoint.io/38bf6272169995caf595?t=' + Date.now())
        .then(res => res.json())
        .then(data => {
           var s =  document.getElementById("passwordbox").value
            if (data.password == s) {
                document.getElementsByClassName("viewopen")[0].style.display = "block"
                document.getElementById('passwordbox').style.display = "none"
            }
        })
})


