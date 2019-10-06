localStorage.clear();
const playgame = document.getElementById("playgame");

playgame.addEventListener("click", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const cat = document.getElementById("category");
    let catStr = cat.options[cat.selectedIndex].value;
    const qNR = document.getElementById("qNR");
    let qNRStr = qNR.options[qNR.selectedIndex].value;

    localStorage.setItem("name", name);
    localStorage.setItem("category", catStr);
    localStorage.setItem("qNR", qNRStr);
    window.location.assign("gameboard.html");
})