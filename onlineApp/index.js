const closeBtn = document.getElementById("closebtn");
// This global variable will hold the active row's data when a user clicks a card
let activeRowData = null;

fetch("https://opensheet.elk.sh/1G5kY3GGIv-wyA8qq-Um_SazeQgzUzyVMCfRtXXAzrVA/earningApp")
    .then(res => res.json())
    .then(sheetData => { // Changed from 'data' to 'sheetData' to avoid variable collision
        sheetData.forEach((row) => {

            const div = document.createElement("div");
            div.className = "earningapp";

            if (row.status == "Yes") {
                div.innerHTML = `
                <img src="./image/${row.images}" width="100px" height="100px" alt="${row.CompanyName}">
                <label>${row.CompanyName}</label>
            `;
                document.getElementById("mobileView").append(div);
            }





            div.addEventListener("click", () => {
                document.getElementById("view").style.display = "flex";
                activeRowData = row;
            });
        });
    })
    .catch(error => console.error("Error fetching sheet data:", error));

// Close the modal popup view
closeBtn.addEventListener("click", () => {
    document.getElementById("view").style.display = "none";
});

// Account Button - Opens the specific link for the clicked card
document.getElementById("accountbtn").addEventListener('click', () => {
    // Check if a card has actually been selected and has a link
    if (activeRowData && activeRowData.Links) {

        if (activeRowData.CompanyName === "Iconstar Business") {
            window.open(`https://wa.me/91638721755?text=${activeRowData.advanceLinks}`, "_blank");
        } else {
            window.open(activeRowData.Links, "_blank");
        }


    } else {
        alert("Please select an app first!");
    }
});

// Share Button - Native Web Share API functionality
document.getElementById("sharebtn").addEventListener('click', () => {
    if (activeRowData && activeRowData.Links) {
        if (navigator.share) {
            navigator.share({
                title: activeRowData.CompanyName,
                text: `Check out this app: ${activeRowData.CompanyName}`,
                url: activeRowData.Links
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support native sharing
            navigator.clipboard.writeText(activeRowData.Links);
            alert("Link copied to clipboard!");
        }
    } else {
        alert("Nothing to share yet. Select an app first!");
    }
});