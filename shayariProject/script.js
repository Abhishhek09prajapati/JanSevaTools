document.getElementById("sliderBar").style.display = "none";
var shyaridiv = document.getElementById("shayariData")
var m1 = 0;
const sheet = "1kO3qRaQB5bzuv8WF5H_yHMVJfjwl9dLiCuG1jb_y39c";


document.getElementById("menuBar").addEventListener("click", (e) => {

    if (m1 == 0) {
        document.getElementById("sliderBar").style.display = "block";
        e.target.innerHTML = "&#10006;"
        m1 = 1;
    } else {
        document.getElementById("sliderBar").style.display = "none";
        e.target.innerHTML = "&#9776;"
        m1 = 0;
    }
});
var slect = document.getElementById("shayariOtion");

fetch(`https://opensheet.elk.sh/${sheet}/shayariAbhishek`)
    .then(response => response.json())
    .then(data => {


        // 1. Extract all categories and filter out empty ones
        const allCategories = data.map(d => d.catagories).filter(Boolean);



        // 2. Use 'Set' to remove duplicate category names
        const uniqueCategories = [...new Set(allCategories)];

        // 3. Clear existing options first (except maybe a placeholder)
        slect.innerHTML = '<option value="">Select a Category</option>';

        // 4. Loop through unique categories to build the dropdown options
        uniqueCategories.forEach(category => {
            var option = document.createElement("option");
            option.value = category;       // Good practice: sets the backend value
            option.textContent = category; // Sets the visible text
            slect.appendChild(option);
        });
    })
    .catch(error => console.error("Error updating dropdown:", error));

slect.addEventListener("change", (e) => {
    shayarifetch(e.target.value)

})


function shayarifetch(m) {
    fetch(`https://opensheet.elk.sh/${sheet}/shayariAbhishek`)
        .then(response => response.json())
        .then(data => {
            shyaridiv.innerHTML = "";   

            // 1. Filter out rows where the column 'm' is empty, null, or undefined
            const validData = data.filter(k => k[m] && k[m].trim() !== "");

            // 2. Loop through only the valid, non-empty data
            validData.forEach((k, i) => {
                var div = document.createElement("div");
                div.className = "shaDiv";
                
                // i + 1 keeps the numbering clean (1, 2, 3...) without gaps
                div.innerHTML = `
                    <p>${i + 1}. ${k[m]}</p>
                    <div class="shareBtn">
                        <img src="" alt="shareBtn" >
                        <img src="" alt="copyBtn">
                    </div>
                `;
                shyaridiv.append(div);
            });
        })
        .catch(error => console.error("Error:", error));
}

