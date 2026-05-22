
https://jansevakendratools.vercel.app/

https://smartcsctools.com/



JanSeva Kendra

https://www.jansevakendratools.in/


<script src="index.js"></script>



    async function loadComponent(id, file) {
      const response = await fetch(file);
      const data = await response.text();
      document.getElementById(id).innerHTML = data;
    }
    loadComponent("footer", "../footer.html");


 <div id="footer"></div>































