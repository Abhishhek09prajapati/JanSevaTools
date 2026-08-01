// document.getElementById("downloadPDF").addEventListener("click", async () => {

//     const { jsPDF } = window.jspdf;
//     const element = document.getElementById("scoreCard");
//     const canvas = await html2canvas(element, {
//         scale: 2
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     const imgWidth = pdfWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pdfHeight;
//     while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;
//     }
//     pdf.save("Quiz_Result.pdf");
// });

document.getElementById("hideen").style.display = "none"


var a = document.getElementById("namee")
var b = document.getElementById("numberr")

const d = new Date();

const t = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")
    }/${d.getFullYear()} - ${String(d.getHours()).padStart(2, "0")
    }:${String(d.getMinutes()).padStart(2, "0")
    }`;



document.getElementById("startdiv").addEventListener('click', () => {
    if (b.value != "" && a.value != "") {
        fetch(`https://api.npoint.io/d4ea357d5f25c8f772bc?t=${Date.now()}`)
            .then(res => res.json())
            .then(f => {
                if (f[0].testTiming >= "31/07/2026 - 13:29") {
                    document.getElementById("userData").style.display = "none"
                    localStorage.setItem("username", a.value)
                    localStorage.setItem("number", b.value)
                    localStorage.setItem("testing", f[0].second)
                    document.getElementById("hideen").style.display = ""

                    nahitoh()


                } else {
                    document.getElementById("aalert").innerHTML = `Test Start in ${f[0].testTiming}`
                    document.getElementById("aalert").style.color = "red"
                }
            })
    } else {
        alert("Please name or number")
    }
})

function nahitoh() {
    setInterval(function () {
        p--;
        var po = document.getElementById("timout") || 120 ;
        po.style.color = "red"
        po.innerHTML = `Timing Remaing - ${p} s `
        if (p === 0) {
            var d = document.getElementById("mobileView")
            d.style.display = "none"
            d.style.color = "red"
        }
    }, 1000)
}