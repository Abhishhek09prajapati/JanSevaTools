fetch('https://api.npoint.io/f1c1bf09eb96314477d5')
    .then(res => res.json())
    .then(data => {

        var maindiv = document.getElementById('maindiv1'); // spelling check

        data.catagories.forEach((e, i) => {
            var div = document.createElement("div");
            var img = document.createElement('img');
            img.src = "../image/as.png"
            img.classList = "imgcata"
            div.classList = "divcata"
            div.textContent = e;   // safer than innerHTML
            maindiv.append(div);
            div.prepend(img)

            div.addEventListener("click", () => {
                localStorage.setItem("Catagories", e)
                window.location.href = "../"
            })
        });

    })
    .catch(err => console.log(err));