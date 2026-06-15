var sildebar = document.getElementById("slidebar");
var flag = 1;

// OPENING THE SIDEBAR
document.getElementById("menubtn").addEventListener("click", () => {
    if (flag === 1) {
        document.querySelector("#slidebar div").style.display = "block";
        sildebar.style.width = "50%";
        flag = 0;
    }
});

// CLOSING THE SIDEBAR
document.querySelector("#slidebar span").addEventListener("click", () => {
    if (flag === 0) {
        // We hide the width first for the animation
        sildebar.style.width = "0px";

        // Optional: Hide the inner div after the transition ends 
        // to prevent text from overflowing while it closes
        setTimeout(() => {
            document.querySelector("#slidebar div").style.display = "none";
        }, 300);

        flag = 1;
    }
});

// DATA FETCHING (Corrected mapping)
const activesheet = "1yqyPnBtwf6gUhOT3wFDk-FaQzSo6LfsnnDNm5WFZUE8";
const sheet = ["sellerproduct", "images", "catagories"];

fetch(`https://opensheet.elk.sh/${activesheet}/${sheet[2]}`)
    .then(res => res.json())
    .then(data => {
        data.forEach((d, i) => {
            var div = document.createElement("div");
            div.className = "catalist";

            // Note: Ensure your JSON key is exactly 'catagories' (check spelling in Sheet)
            div.innerHTML = `
                <img width="100px" src="./images/${d.image}.jpg" alt="">
                <h3>${d.catagories}</h3>
            `;

            document.getElementById("catagories").append(div);

            div.addEventListener("click", () => {
                window.open(`./pages/${d.links}/index.html`, "_blank");
            });
        });
    })
    .catch(err => console.error("Fetch Error:", err));

var flag1 = 1

document.getElementById("productbtn").addEventListener("click", () => {
    if (flag1 == 1) {
        document.getElementById("doblelist").style.display = "block"
        flag1 = 0
    } else {
        document.getElementById("doblelist").style.display = "none"
        flag1 = 1
    }

})

function loadFile(fileName, elementId) {

    fetch(fileName)
        .then(res => res.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });

}

loadFile("/components/header.html", "header");
loadFile("footer.html", "footer");