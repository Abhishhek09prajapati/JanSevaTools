fetch(`https://api.npoint.io/db81072fa6eb1e2bd6de?t=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
        update(data)
    })
    .catch(err => {
        console.log(err);
    });


function update(data) {
    document.getElementById("shopname").innerHTML = data[0].shopname;
    document.getElementsByClassName("address")[0].innerHTML = data[0].shopaddhress;
    document.getElementById("mobilenumber1").innerHTML = `<strong>Mobile:</strong> +91 ${data[0].shopmobilenumber}`

    if (data[0].gststatus === "on") {
        document.getElementById("gstno").style.display = `block`;
        document.getElementById("gstno").innerHTML = `<strong>GST No:</strong > ${data[0].gst}`

    } else {
        document.getElementById("gstno").style.display = `none`
    }


    if (data[0].dlstatus === "on") {
        document.getElementById("dls").style.display = `block`;
        document.getElementById("dls").innerHTML = `<strong>Drug License:</strong> ${data[0].dl}`

    } else {
        document.getElementById("dls").style.display = `none`
    }

    document.getElementById("shopname1").innerHTML = `${data[0].shopname}`
}