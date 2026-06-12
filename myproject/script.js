const dbsheet = "1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA";
const sheet = "myproject";
var maindiv = document.getElementById("maindiv");

fetch(`https://opensheet.elk.sh/${dbsheet}/${sheet}`)
    .then(res => res.json())
    .then(data => {
        data.map((d, i) => {
            var div = document.createElement("div")
            div.className = "websitediv";
            div.innerHTML = `${d.name}`

            maindiv.append(div)


            div.addEventListener("click", () => {
                window.open(`${d.website}`,"_blank")
            })




        })
    })
    .catch(err => {
        console.log(err);
    });