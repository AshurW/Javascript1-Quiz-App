/**
 * declaring some variable so they become "Global" and i can use them freely around the code
 */
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const POINTS = 10;
let q;
let currentQuestion = {};
let questions = [];

/**
 * before Starting the game we are fetchin the questions and storing them
 */
fetch("questions.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    if(localStorage.getItem("category") == "math"){
      questions = loadedQuestions.mathq;
    } else {
      questions = loadedQuestions.computerq;
    }
    startGame();
  })

  /**
   * Simply starting the game by creating an quiz object and calling the getNewQuestion method 
   */
  function startGame() {
    q = new Quiz(localStorage.getItem("name"), localStorage.getItem("qNR"));
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
        //if the there are no more question to diplay it moves to the gameover.html to display the result
        if(this.availableQuestions.length === 0 || this.questionCounter >= this.maxQ){
            localStorage.setItem("endScore", this.score);
            return window.location.assign("/gameover.html");
        }
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

        /**
         * after displaying the question and asnwers remove it from available question
         * and then sets this.acceptingAnwsers to true so that it can accepts the answer
         */
        this.availableQuestions.splice(questionIndex, 1);
        console.log(this.availableQuestions);
        this.acceptingAnwsers = true;
        
        this.checkAnswer();
    }

    /**
     * Adds event listeners on all the choices
     * then check to see if the answer that is click is correct or not
     * makes the backround color green for correct and rec for incorrect pause for 800 msec
     * and then gets a new question to display.
     */
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

          // If the answer waas correct increment the score by the constant POINT
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

//not doing mutch right now just stores the some values and set the score to 0 at the begining
class Quiz extends Questions {
  constructor(name, maxQ) {
    super();
    this.username = name;
    this.maxQ = maxQ;
    this.score = 0
  }
}






