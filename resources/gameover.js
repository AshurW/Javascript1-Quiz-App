const playerName = document.getElementById("playerName");
const finalScore = document.getElementById("finalScore");
const endScore = localStorage.getItem("endScore");
const name = localStorage.getItem("name");

playerName.innerText = name;
finalScore.innerText = endScore;


