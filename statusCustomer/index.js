var searchValue = document.getElementById("searchValue");
var s = "1cb28gYunLwsO9v6Jpxbhxg6NqGYN_9v0MwCJ5e-GyzQ";
var n = "searchNummber"; // Make sure this exactly matches your sheet tab name
var showDiv = document.getElementsByClassName("showDiv")[0];

function serachnumber() {
    if (searchValue.value) {
        // Show a temporary loading state or keep it clean
        fetch(`https://opensheet.elk.sh/${s}/${n}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then(data => {
                // Filters the rows matching the user's input number
                var filterData = data.filter(v => v.number == searchValue.value );

                // Pass the filtered array to the display function
                showdiv(filterData);
            })
            .catch(error => {
                console.error("Failed to fetch sheet data:", error);
                alert("Server issue. Please try again later.");
            });
    } else {
        alert("Please enter a valid number first.");
    }
}

// Hide the success message on initial page load
showDiv.style.display = "none";

function showdiv(k) {
    // Check if the filtered array contains any matching records
    if (k.length > 0) {       

        if (k[0].status == "pending") {
            showDiv.style.display = "block";
            document.getElementById("h1text").innerHTML = `Status Pending hai`
            document.getElementById("h1text").style.color = "#054f77"
            document.getElementById("ptext").innerHTML = `Hello ${k[0].name} Ji , Abhi aap ka medicine aa raha hai`
        } else {
            showDiv.style.display = "block";
            document.getElementById("h1text").innerHTML = `congratulations`
            document.getElementById("h1text").style.color = "Green"
            document.getElementById("ptext").innerHTML = `Hello ${k[0].name} Ji , app ki Medicine Shop pe aa chuka hai , Please Pickup`
        }
       

    } else {
        // No match found! Keep the container hidden and alert the user
        showDiv.style.display = "block";
        document.getElementById("h1text").innerHTML = `Sorry`
        document.getElementById("h1text").style.color = "red"
        document.getElementById("ptext").innerHTML = `Appka Koi Bhi Order Nahi hai Meri Pass , ThanksYou`

    }


}