var numberInput = document.getElementById("numberInput");
var sheet = "1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA";
var historyData = document.getElementById("historydata");


let po = null;

document.getElementById("agentData").style.display = "none"


function searchbtn() {
    if (numberInput.value && numberInput.value.length >= 10) {
        fetch(`https://opensheet.elk.sh/${sheet}/agentData`)
            .then(res => res.json())
            .then(d => {
                var ud = d.filter(dv => dv.number == numberInput.value)
                po = ud;
                profiles(ud)
            })
            .catch(error => console.error("Error fetching sheet data:", error));
    } else {
        alert("Please Some Data Enter or Check Your Number");
    }
}

function profiles(d) {
    if (d.length > 0) {
        document.getElementById("agentData").style.display = ""
        document.getElementById("profilesImage").src = `./images/${d[0].image}`;
        document.getElementById("profileName").innerText = `${d[0].name}`;
        document.getElementById("profileAddress").innerText = `Address : ${d[0].address} `;
        document.getElementById("profileWallat").innerText = `Your Money : ${d[0].money}`;
        numberInput.value = ""
    } else {
        alert("Aap agent Nahi hai  , Admin se Contact Kare , 7607658761")
    }

}

document.getElementById("withdrawBtn").addEventListener("click", () => {
    let m = `Mera naam ${po[0].name} hai. Kripya mera ₹${po[0].money} bank account mein withdraw kar dijiye.`;

    window.open(
        `https://wa.me/916387215755?text=${encodeURIComponent(m)}`,
        "_blank"
    );
});

document.getElementById("datahistory").addEventListener("click", () => {
    fetch(`https://opensheet.elk.sh/${sheet}/agentHistory`)
        .then(res => res.json())
        .then(d => {
            var historyfilter = po[0].history;
            
            // 1. Clear previous history data so it doesn't pile up on multiple clicks
            historyData.innerHTML = ""; 

            d.forEach(t => {
                var div = document.createElement("div");
                div.className = "historyClass";
                
                // 2. Corrected logic: Check if the value exists and isn't empty
                if (t[historyfilter] && t[historyfilter].toString().trim().length > 0) {
                    div.innerHTML = `${t[historyfilter]}`;
                } else {
                    div.innerHTML = `No history`; // Fixed the stray '}' typo here
                }
                
                historyData.append(div);
            });
            document.querySelector("#historydata").style.display = "block";
        })
        .catch(error => console.error("Error fetching sheet data:", error));
});
document.querySelector("#historydata").style.display = "none";