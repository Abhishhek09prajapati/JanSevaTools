function loadFile(fileName, elementId) {
    fetch(fileName)
        .then(res => res.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

var products = "computer"

loadFile("../../components/header.html", "header");
loadFile("../../components/footer.html", "footer");

var productdeatiler = []

const activesheet = "1yqyPnBtwf6gUhOT3wFDk-FaQzSo6LfsnnDNm5WFZUE8";
const maindiv = document.getElementsByClassName("maindiv")[0];

fetch(`https://opensheet.elk.sh/${activesheet}/sellerproduct`)
    .then(res => res.json())
    .then(data => {

        var filterdata = data.filter(a => a.catageories === `${products}`);

        // Using forEach instead of map since we are not returning a new array
        filterdata.forEach((d) => {
            var div = document.createElement('div');
            div.classList.add("maindivchild");
            // Dynamic string matching your Google Sheet keys
            // Replaced hardcoded values with variables like d.productname, d.mrp, d.rate
            div.innerHTML = `
            <img width="100px" src="../../images/${d.viewimage}.jpeg" alt="${d.productname || 'product'}">
            <label>${d.name || 'Product Name'}</label>
            <div class="gr">
                <span>MRP: ${d.mrp || '0'}</span>
                <span>Rate: ${d.price || '0'}</span>
            </div>
            <div class="sharebtn">
                <button>View More</button>
            </div>
        `;
            maindiv.append(div);

            div.addEventListener("click",()=>{

                document.getElementsByClassName("productviews")[0].style.display = "block";
                document.getElementById("productviewname").innerHTML = `${d.name}`
                document.getElementById("productviewdiscripiition").innerHTML = `${d.description}`
                document.getElementById("viewmrp").innerHTML = `MRP : ${d.mrp}`
                document.getElementById("viewrate").innerHTML = `Rate : ${d.price}`
                document.getElementById("viewsimg").src = `../../images/${d.viewimage}.jpeg`
            })

    
        });
    });

document.getElementById("closebtn").addEventListener("click", () => {
    document.getElementsByClassName("productviews")[0].style.display = "none"
})

