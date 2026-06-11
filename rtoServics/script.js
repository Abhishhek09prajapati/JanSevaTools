var flag = 1

document.getElementById("menuIcon").addEventListener("click", function () {

    if (flag == 1) {
        document.getElementById("menuIcon").innerHTML = "&#10006;"
        document.getElementById("slidebar").style.width = "50%";
        document.getElementById("slidebar").style.display = "block"
        flag = 0
    } else {
        document.getElementById("menuIcon").innerHTML = "&#9776;"
        document.getElementById("slidebar").style.width = "0%";
        document.getElementById("slidebar").style.display = "none"
        flag = 1
    }
})

var mainServics = document.getElementById("mainServics")

var sheetId = "1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA"

fetch(`https://opensheet.elk.sh/${sheetId}/rto`)
    .then(res => res.json())
    .then(data => {

        var nober = data[0].companyname ;
        document.getElementById("companyname1").innerHTML = `${data[1].companyname}`
        


        data.forEach((l, i) => {
            var div = document.createElement('div');
            div.className = "product-card"
            div.innerHTML = `<img src="../images/bike.png" alt="Product">

        <h3>${l.rtoservics}</h3>

        <p class="price">₹${l.rtoprics}</p>

        <button>Contact Us</button>`

            const btn = div.querySelector("button");

            btn.addEventListener("click", () => {
                window.open(`https://wa.me/91${nober}?text=Mujhe Yeh Servics Chahiye ${l.rtoservics}`,"_blank")
            });
            mainServics.append(div)

        });




    })
    .catch(err => {
        console.error(err);
    });

