function showNumbers() {

    let data = document.getElementById("numbers").value;
    let message = document.getElementById("message").value;

    // Array create
    let numbers = data.split(",");

    // Space remove
    numbers = numbers.map(num => num.trim());
   

    // Empty remove
    numbers = numbers.filter(num => num !== "");
    
    let output = "";

    numbers.forEach(num => { output += `

        <div class="amesage">
            <span>${num}</span>

            <a href="https://wa.me/91${num}?text=${encodeURIComponent(message)}" 
               target="_blank"
               style="
                    background:#25D366;
                    color:white;
                    padding:8px 15px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
               ">
               Message
            </a>
        </div>

        `;
    });

    document.getElementById("numdata").innerHTML = output;
}