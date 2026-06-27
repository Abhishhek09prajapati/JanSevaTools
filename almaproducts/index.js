document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const sidebar = document.getElementById("sidebar");

    // Open Sidebar
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
    });

    // Close Sidebar
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });

    // Close sidebar if clicked outside of it
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove("active");
        }
    });
});

var sheet = "1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA"
var sheenumber = 'DiwashFoods'

fetch(`https://opensheet.elk.sh/${sheet}/${sheenumber}`)
    .then(res => res.json())
    .then(d => {
        d.forEach(lo => {
            var div = document.createElement('div')
            div.className = "prointmes"
            div.innerHTML = `<img src="./images/${lo.image}" alt="">
        <label for="">${lo.name}</label>
        <label for="">Rate : ${lo.rate} per ${lo.weight}</label>
        <label for="">Mrp : ${lo.mrp}</label>


        <div class="counter-container">
        <button id="minusvalue" class="counter-btn">-</button>
        <span id="valueitems" class="counter-value">0</span>
        <button id="addvalue" class="counter-btn">+</button>


    </div>
        `
            document.getElementById("productitmes").append(div);

            let count = 0;
            const valueDisplay = div.querySelector("#valueitems");
            const plusBtn = div.querySelector("#addvalue");
            const minusBtn = div.querySelector("#minusvalue");

            var a = document.querySelector('tbody');

            plusBtn.addEventListener('click', () => {
                valueDisplay.innerText = ++count;
                let found = false;

                // Changed i = 0 to make sure we check the first row of tbody
                for (let i = 0; i < a.rows.length; i++) {
                    let cellValue = a.rows[i].cells[0].innerText;
                    if (cellValue == lo.name) {
                        a.rows[i].cells[1].innerText = count;
                        found = true;
                        break;
                    }
                }

                // Create row if it doesn't exist
                if (!found) {
                    let row = a.insertRow();
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    cell1.innerText = lo.name;
                    cell2.innerText = count;
                }
            });

            minusBtn.addEventListener('click', () => {
                // 1. Return early if count is already 0 to prevent unnecessary processing
                if (count <= 0) return;

                valueDisplay.innerText = --count;

                // Changed i = 0 to ensure the first row isn't skipped
                for (let i = 0; i < a.rows.length; i++) {
                    let cellValue = a.rows[i].cells[0].innerText;
                    if (cellValue == lo.name) {

                        if (count === 0) {
                            // Remove the row completely if count hits 0
                            a.deleteRow(i);
                        } else {
                            // Otherwise, just update the quantity text
                            a.rows[i].cells[1].innerText = count;
                        }
                        break;
                    }
                }
            });





        });
    })


document.getElementById("orderLists").style.display = "none"



document.getElementById("homebtn").addEventListener('click', () => {
    document.getElementById("productitmes").style.display = "flex";
    document.getElementById("orderLists").style.display = "none"
})

document.getElementById("orderbtn").addEventListener('click', () => {
    document.getElementById("orderLists").style.display = "block";
    document.getElementById("productitmes").style.display = "none";
})


let shopname = document.getElementById("shopname");
let shopnumber = document.getElementById("shopnumber");
let shopaddress = document.getElementById("shopaddress");



document.getElementById("sharebtn").addEventListener("click", async () => {


    if (shopname.value && shopaddress.value && shopnumber.value) {
        const element = document.getElementById("orderLists");
        const canvas = await html2canvas(element);
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "OrderList.png", {
                type: "image/png"
            });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {

                await navigator.share({
                    title: "Order List",
                    text: `${shopname.value} to ${shopnumber.value} in Address ${shopaddress.value}`,
                    files: [file]
                });

            } else {
                alert("Your browser doesn't support file sharing.");
            }
        }, "image/png");
    } else {
        alert("Please Eter Full Details")
    }


});

document.getElementById("closebtn").addEventListener("click", () => {
    document.getElementsByClassName("ordernowbtn")[0].style.display = "none"
})


document.getElementById("ordernow").addEventListener("click", () => {
    document.getElementsByClassName("ordernowbtn")[0].style.display = "flex"
})