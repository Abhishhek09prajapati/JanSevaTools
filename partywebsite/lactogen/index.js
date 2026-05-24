

const url = "https://opensheet.elk.sh/1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA/Dailymilk"

fetch(url)
    .then(res => res.json())
    .then(data => {
        data.map(u => {
            const div = document.createElement('div')
            div.innerHTML = `
            <img width="200px" src="./images/${u.image}.png" alt=""><br>
            <span>${u.ProductName}</span><br>
            <span>MRP : - ${u.Productprice}</span><br>
            <span>Rate :- ${u.rate}</span>
            
            `

            document.getElementById("listitmes").append(div)
        })
    })
    .catch(err => console.log(err))