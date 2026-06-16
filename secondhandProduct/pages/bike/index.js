function loadFile(fileName, elementId){
    fetch(fileName)
        .then(res => res.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

loadFile("../../components/header.html", "header");
loadFile("../../components/footer.html", "footer");


const activesheet = "1yqyPnBtwf6gUhOT3wFDk-FaQzSo6LfsnnDNm5WFZUE8";
const maindiv = document.getElementsByClassName("maindiv")[0];

fetch(`https://opensheet.elk.sh/${activesheet}/sellerproduct`)
.then(res => res.json())
.then(data => {
    // Using forEach instead of map since we are not returning a new array
    data.forEach((d) => {
        var div = document.createElement('div');
        div.classList.add("maindivchild");
        
        // Dynamic string matching your Google Sheet keys
        // Replaced hardcoded values with variables like d.productname, d.mrp, d.rate
        div.innerHTML = `
            <img width="100px" src="../../images/${d.viewimage}.jpg" alt="${d.productname || 'product'}">
            <label>${d.name || 'Product Name'}</label>
            <div class="gr">
                <span>MRP: ${d.mrp || '0'}</span>
                <span>Rate: ${d.rate || '0'}</span>
            </div>
            <div class="sharebtn">
                <button>Viiew More</button>
            </div>
        `;
        
        maindiv.append(div);
    });
});