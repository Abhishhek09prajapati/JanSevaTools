const sheet = "12_FYfDC8Vu76URqRuAgrSl3GCOKoXcNrC5xXSCud30Q";

var question = document.getElementById("mobileView")

var resultScore = 0;

var questionpop = [];

var clinetAnswer = [];

var realAnswer = [];

document.getElementById("scoceCadr").style.display = "none";

document.getElementById("resultClient").style.display = "none";

let p = parseInt(localStorage.getItem("testing"))



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

realAnswer.push(k.answer)

alert("Save Successfully");

resultScore++;

} else {

realAnswer.push(k.answer)

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

fetch(`https://api.npoint.io/d4ea357d5f25c8f772bc?t=${Date.now()}`)

.then(res => res.json())

.then(data => {

p = data[0].second

if (data[0].answer === "SHOW") {

document.getElementById("scoceCadr").style.display = ""

} else {

document.getElementById("scoceCadr").style.display = "none"

}

})

})



var resulttable = document.getElementById("resulttable")



var l = localStorage.getItem("username")

var l1 = localStorage.getItem("number")

document.getElementById("scoceCadr").addEventListener('click', () => {

document.getElementById("resultClient").style.display = "block"

document.getElementById("urResult").innerHTML = `Your Result : ${resultScore} / 10`;

document.getElementById("nameOfUser").innerHTML =`Name : ${l} , Roll Number : ${l1} `

document.getElementById("scoceCadr").disabled = true;

for (let i = 0; i < questionpop.length; i++) {

var tr = document.createElement('tr')



tr.innerHTML = `<td>${questionpop[i]}</td>

<td>${clinetAnswer[i]}</td>

<td>${realAnswer[i]}</td>`

resulttable.append(tr)



}

})