const sheet = "12_FYfDC8Vu76URqRuAgrSl3GCOKoXcNrC5xXSCud30Q";
var question = document.getElementById("mobileView")
var resultScore = 0;
var questionpop = [];
var clinetAnswer = [];

fetch(`https://opensheet.elk.sh/${sheet}/test`)
    .then(res => res.json())
    .then(data => {
        data.forEach(k => {
            var div = document.createElement("div");
            div.className = "questiondiv";
            div.innerHTML = `
            <label>${k.question}</label>
            <div>
                <select class="clientAnswer" id="clientAnswer">
                    <option value="">Select Any One</option>
                    <option value="${k.option_one}">${k.option_one}</option>
                    <option value="${k.option_two}">${k.option_two}</option>
                    <option value="${k.option_three}">${k.option_three}</option>
                    <option value="${k.option_four}">${k.option_four}</option>
                </select>
                <button class="lockBtn" id="lockBtn">Lock This Answer</button>
            </div>
        `;
            question.appendChild(div);
            const answerClient = div.querySelector(".clientAnswer");
            const lockBtn = div.querySelector(".lockBtn");
            lockBtn.addEventListener("click", () => {

                if (answerClient.value === k.answer) {
                    questionpop.push(k.question)
                    clinetAnswer.push(answerClient.value)
                    alert("Save Successfully");
                    console.log(questionpop, clinetAnswer)
                    resultScore++;
                } else {
                    questionpop.push(k.question)
                    clinetAnswer.push(answerClient.value)
                    alert("Save Successfully");
                }

                lockBtn.disabled = true;
                answerClient.disabled = true;

                console.log("Score:", resultScore);
            });
        });
    })
    .catch(err => console.error(err));


document.getElementById("showResult").addEventListener('click', () => {
    alert("Show Reult")
})