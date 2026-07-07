// Initially hide the containers

document.querySelector("#user-info").style.display = "none";
var historyTableBody = document.getElementById("historyTableBody");

let userHistoryCode = ""

const baseID = "1_EA_Jg_Cl4GE2Vhvnl42SE6jVeDhn8S44LD1V8iZ4IU";
var sheetName = "Sheet1";

// 1. Search Button Click Event
document.getElementById("searchBtn").addEventListener("click", () => {
    const inputVal = document.getElementById("userId").value.trim();
    if (!inputVal) {
        alert("Please enter a User ID");
        return;
    }
    // Reveal container and clear previous data while loading
    document.querySelector("#user-info").style.display = "";
    document.getElementById("user-info").innerHTML = "<p>Loading user data...</p>";
    document.querySelector("#userHistory").style.display = "none"; // Hide previous history

    getUserData(inputVal);
});

// 2. Event Delegation for Dynamically Created Buttons
document.querySelector("#user-info").addEventListener("click", (event) => {
    // Check if the clicked element is the View History button
    if (event.target && event.target.id === "viewHistoryBtn") {
        showUserHistory();
        // You can call your history loading function here if needed
    }

    // Check if the clicked element is the WhatsApp button
    if (event.target && event.target.id === "ShareButton") {
        alert("WhatsApp functionality triggered!");
        // Add your WhatsApp link logic here
    }
});

// 3. Fetch Data Function
function getUserData(userId) {
    fetch(`https://opensheet.elk.sh/${baseID}/${sheetName}`)
        .then(response => response.json())
        .then(data => {
            // Filter user data based on input matching 'number' column
            const userFilter = data.filter(u => u.number == userId);

            if (userFilter.length === 0) {
                document.getElementById("user-info").innerHTML = `<p class="error-message">User not found.</p>`;
                return;
            }

            const user = userFilter[0];
            userHistoryCode = user.historyCode || "No history available";

            // Render updated template (Fixed duplicate IDs)
            document.getElementById("user-info").innerHTML = `
                <h2>User Information</h2>
                <div
                    style="width: 100%; display: flex; justify-content: center; align-items: center; margin-bottom: 15px;position: relative;">
                    <img width="100px" height="100px" src="./images/bike.jpeg" alt="User Avatar" id="userAvatar"
                        style="border-radius: 50%; object-fit: cover;position: absolute; top: 0; right: 0%">
                </div>
                <p><strong>Name:</strong> <span>${user.name || "N/A"}</span></p>
                <p><strong>Phone Number:</strong> <span>${user.phone || "N/A"}</span></p>
                <p><strong>Email:</strong> <span>${user.gmail || "N/A"}</span></p>
                <p><strong>Address:</strong> <span>${user.address || "N/A"}</span></p>
                <p><strong>Account Number:</strong> <span>${user.accountNo || "N/A"}</span></p>
                <p><strong>Loan Number:</strong> <span>${user.loanNumber || "N/A"}</span></p>
                <p><strong>Loan Amount:</strong> <span>${user.loanAmount || "N/A"}</span></p>
                <p><strong>RD Amount:</strong> <span>${user.rdAmount || "N/A"}</span></p>
                <p><strong>FD Amount:</strong> <span>${user.fdAmount || "N/A"}</span></p>
                <div class="button-container" style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="viewHistoryBtn">View History</button>
                    <button id="ShareButton">WhatsApp Message</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            document.getElementById("user-info").innerHTML = `<p class="error-message">Failed to load data. Please try again.</p>`;
        });
}


document.querySelector("#userHistory").style.display = "none";


function showUserHistory() {
    fetch(`https://opensheet.elk.sh/${baseID}/${userHistoryCode}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var row = document.createElement("tr");
                row.innerHTML = `
            <td>${item.date || "N/A"}</td>
            <td>${item.transactionID || "N/A"}</td>
            <td>${item.amount || "N/A"}</td>
            <td>${item.description || "N/A"}</td>
            <td>${item.status || "N/A"}</td>
        `;
                historyTableBody.appendChild(row);
            })
        });
    document.querySelector("#userHistory").style.display = "";
}
