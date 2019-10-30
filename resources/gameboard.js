/**
 * declaring some variable so they become "Global" and i can use them freely around the code
 */
const question = document.getElementById("question");
const choices = document.querySelectorAll(".choice-text");
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const nextQ = document.getElementById("nextQ")
const POINTS = 10;
let q;
let currentQuestion = {};
let questions = [];
let answerChoice = [];
/**
 * before Starting the game we are fetchin the questions from a json file and storing them
 */
fetch("questions.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    if (localStorage.getItem("category") == "math") {
      questions = loadedQuestions.mathq;
    } else {
      questions = loadedQuestions.computerq;
    }
    startGame();
  })

/**
 * The next question button gets the selected answers and puts them in an array
 * resets the selection of the answers
 * and calls the checkanswer
 */
nextQ.addEventListener("click", e => {
  //resets answerchoice and answers
  answerChoice = [];
  let answers = null;
  answers = document.querySelectorAll("p.choice-text.choiceSelected");
  answers.forEach(ans => {
    answerChoice.push(ans.dataset.number);
  });
  let els = document.querySelectorAll(".choiceSelected");
  for (let i = 0; i < els.length; i++) {
    els[i].classList.remove("choiceSelected");
  }

  q.checkAnswer();
})
/**
 * Simply starting the game by creating an quiz object and calling the getNewQuestion method 
 */
function startGame() {
  q = new Quiz(localStorage.getItem("name"), localStorage.getItem("qNumber"));
  q.getNewQuestion();
}

/**Class Questions creates the question for diplaying, check if the user has clicked the correct answer
 * and increments the score
  */
class Questions {
  constructor() {
    this.questionCounter = 0;
    this.availableQuestions = [...questions];
  }

  getNewQuestion() {
    //increments quesiontCounter and displays at what question the user is currently at
    this.questionCounter++;
    questionCounterText.innerText = this.questionCounter + "/" + this.maxQ;

    //Prints a random question and aswers from the pool of available questions
    const questionIndex = Math.floor(Math.random() * this.availableQuestions.length);
    currentQuestion = this.availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach(choice => {
      let number = choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
    });

    // This is to prevent it from storing multipleclickers on one element
    // so it creates evenetlistner only once the game starts
    if (this.questionCounter < 2) {
      choices.forEach(choice => {
        choice.addEventListener("click", (e) => {
          // So that you can see what answers you have marked 
          e.target.classList.toggle("choiceSelected");
        });
      });
    }
    
    //after displaying the question and asnwers remove it from available question
    this.availableQuestions.splice(questionIndex, 1);
    console.log(this.availableQuestions);

  }


  /**
   * check to see if the answers that is click is correct or not
   * increments the score if you have picked one of the right answers and decrease if you picked the wrong
   * and then gets a new question to display.
   */
  checkAnswer() {
    // Loops through the answers you have picked and checks if they exsist in the "json array"
    for (let i = 0; i < answerChoice.length; i++) {
      if (answerChoice.indexOf(currentQuestion.answer[i]) >= 0) {
        this.addScore(POINTS);
      } else {
        this.subtractScore(POINTS);
      }

    }

    //if the there are no more question to diplay it moves to the gameover.html to display the result
    //else gets a new question
    if (this.availableQuestions.length === 0 || this.questionCounter >= this.maxQ) {
      this.endGame();
    } else {
      q.getNewQuestion();
    }
  }

  addScore(points) {
    this.score += points;
    scoreText.innerText = this.score;
  }
  subtractScore(points) {
    this.score -= points;
    scoreText.innerText = this.score;
  }

  //store the score and sends you to the gameover.html
  endGame() {
    localStorage.setItem("endScore", this.score);
    return window.location.assign("gameover.html");
  }
}

//not doing mutch right now just stores some values and set the score to 0 at the begining
class Quiz extends Questions {
  constructor(name, maxQ) {
    super();
    this.username = name;
    this.maxQ = maxQ;
    this.score = 0
  }
}






