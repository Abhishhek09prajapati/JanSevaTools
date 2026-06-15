function loadFile(fileName, elementId){

    fetch(fileName)
        .then(res => res.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });

}

loadFile("../../components/header.html", "header");
loadFile("../../components/footer.html", "footer");


