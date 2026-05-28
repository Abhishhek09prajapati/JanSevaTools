
const s = "SurgicalItems"

const url = `https://opensheet.elk.sh/1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA/${s}`;

var tables = document.getElementsByClassName("tables")[0];
var amount = document.getElementById("amount")
var amountMRP = document.getElementById("amountMRP")
var amountrate = document.getElementById('amountrate')

var mprvalue = 0;
var ratevalue = 0;

fetch(url)
    .then(res => res.json())
    .then(data => {
        data.map(u => {
            const div = document.createElement('div')
            div.classList = "showdiv"
            div.innerHTML = `       
                    <div id="showitmes">
                        <img  src="./images/${u.image}.jpeg" alt="">
                        <span id="nameitmes1">${u.ProductName}</span>
                        <div id="mrprate">
                            <div><strike>MRP ${u.Productprice}</strike></div>
                            <div>Rate : <span>${u.rate}</span></div>
                        </div>
                        <div  id="hidde">Add</div>
                        <div class="minusplus">
                            <button id="minus">-</button>
                            <label id="valueitmes" for="">0</label>
                            <button id="plus">+</button>
                        </div>
                    </div>     ` ;

            document.getElementById("listitmes").append(div);

            let addbtn = div.querySelector("#hidde");
            let minusplus = div.querySelector(".minusplus");




            let minus = div.querySelector("#minus");
            let valueitmes = div.querySelector("#valueitmes");
            let plus = div.querySelector("#plus");

            addbtn.addEventListener("click", () => {
                addbtn.style.display = "none";
                minusplus.style.display = "block"
            });

            var num = 0;
            // PLUS

            plus.addEventListener("click", () => {
                num++;
                valueitmes.innerText = num;
                let found = false;
                for (let i = 1; i < tables.rows.length; i++) {
                    let cellValue = tables.rows[i].cells[0].innerText;
                    if (cellValue == u.ProductName) {
                        tables.rows[i].cells[1].innerText = num;
                        found = true;
                        break;
                    }
                }
                // create row
                if (!found) {
                    let row = tables.insertRow();
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    cell1.innerText = u.ProductName;
                    cell2.innerText = num;
                }

            });
            // MINUS

            minus.addEventListener("click", () => {
                if (num > 0) {
                    num--;
                    valueitmes.innerText = num;
                }
                for (let i = 1; i < tables.rows.length; i++) {
                    let cellValue = tables.rows[i].cells[0].innerText;
                    if (cellValue == u.ProductName) {
                        // update quantity
                        tables.rows[i].cells[1].innerText = num;
                        // remove row if 0
                        if (num == 0) {
                            tables.rows[i].remove();
                        }
                        break;
                    }

                }

            });





        })
    })
    .catch(err => console.log(err))

document.getElementById("ordernow").addEventListener("click", async () => {
    let bill = document.getElementById("billdata");
    let shopname = document.getElementById("shopname").value;
    if (!shopname) {
        alert("Please Enter Shop Name");
        return;
    }
    bill.style.background = "white";
    html2canvas(bill, {
        scale: 2,
        useCORS: true
    }).then(async (canvas) => {
        canvas.toBlob(async (blob) => {
            // Create Image File
            let file = new File(
                [blob],
                `${shopname}.png`,
                { type: "image/png" }
            );

            // Mobile WhatsApp Share
            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: "Medical Bill",
                        text: `Shop Name : ${shopname}`,
                        files: [file]
                    });
                    // Open WhatsApp Number
                    window.open(
                        `https://wa.me/916387215755`,
                        "_blank"
                    );
                } catch (err) {
                    console.log(err);
                }

            } else {

                // PNG Download Fallback
                const link = document.createElement("a");
                link.download = `${shopname}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
                alert("Direct WhatsApp image share not supported in this browser.");

            }

        });

    });

});

setInterval(function () {
    var d = new Date();
    function addZero(num) {
        return num < 10 ? "0" + num : num;
    }

    var day = addZero(d.getDate());
    var month = addZero(d.getMonth() + 1);
    var year = d.getFullYear();

    var hour = addZero(d.getHours());
    var minute = addZero(d.getMinutes());
    var second = addZero(d.getSeconds());

    var dateData = `Date : ${day}/${month}/${year} Time : ${hour}:${minute}:${second}`;
    document.getElementById("datetime").innerHTML = dateData;
}, 1000)









