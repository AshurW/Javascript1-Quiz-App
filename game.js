const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const POINTS = 10;

let q;
let currentQuestion = {};
let questions = [];

fetch("questions.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions;
    startGame();
  })

  function startGame() {
    q = new Quiz(localStorage.getItem("name"), localStorage.getItem("qNR"));
    q.getNewQuestion();
  }

class Questions {
    constructor() {
        this.questionCounter = 0;
        this.score = 0
        this.availableQuestions = [...questions];
    }
  
    getNewQuestion() {
        if(this.availableQuestions.length === 0 || this.questionCounter >= this.maxQ){
            localStorage.setItem("endScore", this.score);
            return window.location.assign("/gameover.html");
        }
        this.questionCounter++;
        questionCounterText.innerText = this.questionCounter + "/" + this.maxQ; 

        const questionIndex = Math.floor(Math.random() * this.availableQuestions.length);
        currentQuestion = this.availableQuestions[questionIndex];
        question.innerText = currentQuestion.question;

        choices.forEach(choice => {
            let number = choice.dataset["number"];
            choice.innerText = currentQuestion["choice" + number];
        });

        this.availableQuestions.splice(questionIndex, 1);
        console.log(this.availableQuestions);
        this.acceptingAnwsers = true;
        
        this.checkAnswer();
    }

    checkAnswer() {
      choices.forEach(choice => {
        choice.addEventListener("click", e => {
          if(!this.acceptingAnwsers) return;
          this.acceptingAnwsers = false;
          const selectedChoice = e.target;
          const selectedAnswer = selectedChoice.dataset["number"];

          let classToApply = "";
          if (selectedAnswer == currentQuestion.answer) {
            classToApply = "correct";
          }else {
            classToApply = "incorrect";
          }

          if(classToApply === "correct"){
            this.incrementScore(POINTS);
          }

          selectedChoice.parentElement.classList.add(classToApply);

          setTimeout(function() {
            selectedChoice.parentElement.classList.remove(classToApply);
            q.getNewQuestion();
          }, 800);
        });
      });
    }

    incrementScore(num) {
      this.score += num;
      scoreText.innerText = this.score;
    }
}

class Quiz extends Questions {
  constructor(name, maxQ) {
    super();
    this.username = name;
    this.maxQ = maxQ;
  }
}






