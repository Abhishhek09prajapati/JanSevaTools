const sheet = "12_FYfDC8Vu76URqRuAgrSl3GCOKoXcNrC5xXSCud30Q";

var question = document.getElementById("mobileView")

fetch(`https://opensheet.elk.sh/${sheet}/test`)
    .then(res => res.json())
    .then(data => {


        data.forEach(k => {
            var div = document.createElement('div')
            div.className = "questiondiv"
            div.innerHTML = `<label for="">${k.question}</label>
            <div>
                <select name="" id="clientAnswer">
                    <option value="">Select Any One</option>
                    <option value="">${k.option_one}</option>
                    <option value="">${k.option_two}</option>
                    <option value="">${k.option_three}</option>
                    <option value="">${k.option_four}</option>
                </select>
                <button id="lockBtn">Lock This Answer</button>
            </div>`


            question.append((div))

        });
    })
    .catch(err => {
        console.error(err);
    });