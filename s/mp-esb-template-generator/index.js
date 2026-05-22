
const nameInput = document.getElementById('nameInput');
const dateInput = document.getElementById('dateInput');
const nameText = document.getElementById('nameText');
const dateText = document.getElementById('dateText');

const photoInput = document.getElementById('photoInput');
const signInput = document.getElementById('signInput');
const declInput = document.getElementById('declInput');

const photoImg = document.getElementById('photoImg');
const signImg = document.getElementById('signImg');
const declImg = document.getElementById('declImg');

function readToImg(input, img) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; };
    reader.readAsDataURL(file);
}

function waitForImage(img) {
    return new Promise(resolve => {
        if (img.complete && img.naturalWidth) resolve();
        else {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
        }
    });
}

nameInput.addEventListener('input', e => { nameText.textContent = e.target.value || 'Name'; });
dateInput.addEventListener('input', e => { dateText.textContent = e.target.value || 'DD-MM-YYYY'; });

photoInput.addEventListener('change', e => readToImg(e.target, photoImg));
signInput.addEventListener('change', e => readToImg(e.target, signImg));
declInput.addEventListener('change', e => readToImg(e.target, declImg));

document.getElementById('downloadBtn').addEventListener('click', async () => {
    await Promise.all([waitForImage(photoImg), waitForImage(signImg), waitForImage(declImg)]);
    const node = document.getElementById('template');
    const canvas = await html2canvas(node, { useCORS: true, backgroundColor: '#ffffff', scale: 2, windowWidth: node.scrollWidth, windowHeight: node.scrollHeight });
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mp-esb-template.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    link.remove();
});


    async function loadComponent(id, file) {
      const response = await fetch(file);
      const data = await response.text();
      document.getElementById(id).innerHTML = data;
    }
    loadComponent("footer", "../footer.html");
