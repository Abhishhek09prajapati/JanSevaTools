var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");
var p4 = document.getElementById("p4");
var p5 = document.getElementById("p5");
var p6 = document.getElementById("p6");
var p7 = document.getElementById("p7");
var p8 = document.getElementById("p8");
var p9 = document.getElementById("p9");
var p10 = document.getElementById("p10");
var p11 = document.getElementById("p11");
var p12 = document.getElementById("p12");
var p13 = document.getElementById("p13");
var p14 = document.getElementById("p14");
var p15 = document.getElementById("p15");
var p16 = document.getElementById("p16");
var p17 = document.getElementById("p17");
var p18 = document.getElementById("p18");
var p19 = document.getElementById("p19");
var p20 = document.getElementById("p20");
var p21 = document.getElementById("p21");
var p22 = document.getElementById("p22");


var o0 = document.getElementsByClassName("marks")[0];
var o1 = document.getElementsByClassName("marks")[1];
var o2 = document.getElementsByClassName("marks")[2];
var o3 = document.getElementsByClassName("marks")[3];

var o5 = document.getElementsByClassName("marks")[5];
var o6 = document.getElementsByClassName("marks")[6];
var o7 = document.getElementsByClassName("marks")[7];
var o8 = document.getElementsByClassName("marks")[8];

var o10 = document.getElementsByClassName("marks")[10];
var o11 = document.getElementsByClassName("marks")[11];
var o12 = document.getElementsByClassName("marks")[12];
var o13 = document.getElementsByClassName("marks")[13];

var o15 = document.getElementsByClassName("marks")[15];
var o16 = document.getElementsByClassName("marks")[16];
var o17 = document.getElementsByClassName("marks")[17];
var o18 = document.getElementsByClassName("marks")[18];


var o20 = document.getElementsByClassName("marks")[20];
var o21 = document.getElementsByClassName("marks")[21];
var o22 = document.getElementsByClassName("marks")[22];
var o23 = document.getElementsByClassName("marks")[23];


var a1 = document.getElementsByClassName("marks")[4];
var a2 = document.getElementsByClassName("marks")[9];
var a3 = document.getElementsByClassName("marks")[14];
var a4 = document.getElementsByClassName("marks")[19];
var a5 = document.getElementsByClassName("marks")[24];

var total = document.getElementsByClassName("totals")[0];


var game = document.getElementsByClassName("game")[0];
var displan = document.getElementsByClassName("displan")[0];



var cName = document.getElementById("z1");
var sName = document.getElementById("z2");
var fName = document.getElementById("z3");
var rNumber = document.getElementById("z4");

var iName = document.getElementById("institute")
var studentName = document.getElementById("studentName")
var fatherName = document.getElementById("fatherName")
var rollNumber = document.getElementById("rollNumber")








document.getElementById("checkBtn").addEventListener("click", function () {

    if (cName.value == "" || sName.value == "" || fName.value == "" || rNumber.value == "" || p1.value == "" || p2.value == "" || p3.value == "" || p4.value == "" || p5.value == "" || p6.value == "" || p7.value == "" || p8.value == "" || p9.value == "" || p10.value == "" || p11.value == "" || p12.value == "" || p13.value == "" || p14.value == "" || p15.value == "" || p16.value == "" || p17.value == "" || p18.value == "" || p19.value == "" || p20.value == "" || p21.value == "" || p22.value == "") {
        alert("Please fill all the fields before submitting the form.");
    } else {
        fish()
    }




})


function fish() {
    iName.innerHTML = cName.value.toUpperCase();
    studentName.innerHTML = sName.value.toUpperCase();
    fatherName.innerHTML = fName.value.toUpperCase();
    rollNumber.innerHTML = rNumber.value.toUpperCase();
    o0.innerHTML = p1.value;
    o1.innerHTML = p2.value;
    o2.innerHTML = p11.value;
    o3.innerHTML = p12.value;
    var s1 = parseInt(p1.value) + parseInt(p2.value) + parseInt(p11.value) + parseInt(p12.value);
    a1.innerHTML = s1;
    o5.innerHTML = p3.value;
    o6.innerHTML = p4.value;
    o7.innerHTML = p13.value;
    o8.innerHTML = p14.value;
    var s2 = parseInt(p3.value) + parseInt(p4.value) + parseInt(p13.value) + parseInt(p14.value);
    a2.innerHTML = s2;
    o10.innerHTML = p5.value;
    o11.innerHTML = p6.value;
    o12.innerHTML = p15.value;
    o13.innerHTML = p16.value;
    var s3 = parseInt(p5.value) + parseInt(p6.value) + parseInt(p15.value) + parseInt(p16.value);
    a3.innerHTML = s3;
    o15.innerHTML = p7.value;
    o16.innerHTML = p8.value;
    o17.innerHTML = p17.value;
    o18.innerHTML = p18.value;
    var s4 = parseInt(p7.value) + parseInt(p8.value) + parseInt(p17.value) + parseInt(p18.value);
    a4.innerHTML = s4;
    o20.innerHTML = p9.value;
    o21.innerHTML = p10.value;
    o22.innerHTML = p19.value;
    o23.innerHTML = p20.value;
    var s5 = parseInt(p9.value) + parseInt(p10.value) + parseInt(p19.value) + parseInt(p20.value);
    a5.innerHTML = s5;
    game.innerHTML = p21.value;
    displan.innerHTML = p22.value;
    var totall = s1 + s2 + s3 + s4 + s5 + parseInt(p21.value) + parseInt(p22.value);
    total.innerHTML = totall;

    var too = totall / 1050 * 100 ;

    document.getElementById("disclamer").innerHTML = `Hello Dear ,${sName.value.toUpperCase()} JI , aapka itna ${too.toFixed(2)}% hai , koi bhi issue hai , Contact to Abhishek Prajapati (  +91-7607658761 ) `;
     document.getElementById("formdata").style.display = "none";
}

document.getElementById("numberdaalo").addEventListener("click", function () {
    document.getElementById("formdata").style.display = "block";
})


document.getElementById("closeBtn").addEventListener("click", function () {
    document.getElementById("formdata").style.display = "none";
})