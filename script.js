// DOM ELEMENTS
const introScreen = document.querySelector("#intro-div");
const startButton = document.querySelector("#start-button");
// QUESTIONS SCREEN
const questionScreen = document.querySelector("#questions-screen");
const question = document.querySelector("#question");
const currentQNo = document.querySelector("#current-question");
const totalQNo = document.querySelector("#total-questions");
const scoring = document.querySelector("#score-span");
const progressBar = document.querySelector("#progress-bar");
const answersContainer = document.querySelector("#answers-div");
// FINAL SCREEN
const resultScreen = document.querySelector("#result-screen");
const yourScore = document.querySelector("#your-score");
const totalScore = document.querySelector("#total");
const remarks = document.querySelector("#remark");
const restart = document.querySelector("#restart-button");

// questions page implementation

async function loadQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple",
    );
    const data = await response.json();

    const allQuestions = [];
    for (let i = 0; i < data.results.length; i++) {
      let currQuestionSet = data.results[i];
      const info = {};

      info.question = currQuestionSet.question;
      info.answers = [
        ...currQuestionSet.incorrect_answers.map((ans) => ({
          text: ans,
          correct: false,
        })),
        { text: currQuestionSet.correct_answer, correct: true },
      ];
      info.answers.sort(() => Math.random() - 0.5);
      allQuestions.push(info);
    }
    return allQuestions;
  } catch (error) {
    console.log("something went wrong", error);
    return;
  }
}

let questionsArrays = [];
let totalQuestions = 0;
startButton.disabled = true;
startButton.textContent = "Loading questions...";

async function initializeQuiz() {
  try {
    const loadedQuestions = await loadQuestions();
    if (Array.isArray(loadedQuestions) && loadedQuestions.length > 0) {
      questionsArrays = loadedQuestions;
    } else {
      throw new Error("No questions loaded from API");
    }
  } catch (error) {
    console.log("Falling back to static questions:", error);
    questionsArrays = questionsArray;
  }

  totalQuestions = questionsArrays.length;
  totalQNo.textContent = totalQuestions;
  totalScore.textContent = totalQuestions;
  scoring.textContent = score;
  yourScore.textContent = score;
  startButton.disabled = false;
  startButton.textContent = "Start Quiz";
}

const questionsArray = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "What is the capital of Ghana?",
    answers: [
      { text: "Accra", correct: true },
      { text: "Kumasi", correct: false },
      { text: "Koforidua", correct: false },
      { text: "Sunyani", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Earth", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Venus", correct: false },
    ],
  },
  {
    question: "What is 5 + 7?",
    answers: [
      { text: "10", correct: false },
      { text: "11", correct: false },
      { text: "12", correct: true },
      { text: "13", correct: false },
    ],
  },
  {
    question: "Which language is used for web styling?",
    answers: [
      { text: "HTML", correct: false },
      { text: "Python", correct: false },
      { text: "CSS", correct: true },
      { text: "Java", correct: false },
    ],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: "Charles Dickens", correct: false },
      { text: "William Shakespeare", correct: true },
      { text: "Mark Twain", correct: false },
      { text: "Jane Austen", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
      { text: "Arctic Ocean", correct: false },
    ],
  },
];

initializeQuiz();

let currentQuestionIndex = 0;
let score = 0;

totalQNo.textContent = totalQuestions;
totalScore.textContent = totalQuestions;
scoring.textContent = score;
yourScore.textContent = score;

startButton.addEventListener("click", startQuiz);
restart.addEventListener("click", restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoring.textContent = score;
  yourScore.textContent = score;
  progressBar.style.width = "0%";

  introScreen.classList.add("screen");
  resultScreen.classList.add("screen");
  questionScreen.classList.remove("screen");

  showQuestion();
}

function restartQuiz() {
  resultScreen.classList.add("screen");
  introScreen.classList.remove("screen");
}

function showQuestion() {
  answersContainer.innerHTML = "";
  const currentQuestionSet = questionsArrays[currentQuestionIndex];
  question.textContent = currentQuestionSet.question;
  currentQNo.textContent = currentQuestionIndex + 1;

  currentQuestionSet.answers.forEach((answer) => {
    const ansButton = document.createElement("button");
    ansButton.textContent = answer.text;
    ansButton.classList.add("answers-div-button");
    ansButton.dataset.correct = answer.correct;
    answersContainer.appendChild(ansButton);

    ansButton.addEventListener("click", () => {
      const isCorrect = ansButton.dataset.correct === "true";
      if (isCorrect) {
        ansButton.classList.add("correct-answer");
        score++;
      } else {
        ansButton.classList.add("wrong-answer");
        const correctButton = Array.from(answersContainer.children).find(
          (button) => button.dataset.correct === "true",
        );
        if (correctButton) {
          correctButton.classList.add("correct-answer");
        }
      }

      scoring.textContent = score;
      yourScore.textContent = score;
      comment(score);

      Array.from(answersContainer.children).forEach((button) => {
        button.disabled = true;
      });

      currentQuestionIndex++;

      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions) {
          const progress = (currentQuestionIndex / totalQuestions) * 100;
          progressBar.style.width = `${progress}%`;
          showQuestion();
        } else {
          progressBar.style.width = "100%";
          questionScreen.classList.add("screen");
          resultScreen.classList.remove("screen");
        }
      }, 800);
    });
  });
}

function comment(grade) {
  if (grade === totalQuestions) {
    remarks.textContent = "You ACED it, AWESOME!";
  } else if (grade >= totalQuestions - 2) {
    remarks.textContent = "Great job!";
  } else if (grade >= Math.ceil(totalQuestions / 2)) {
    remarks.textContent = "Nice effort!";
  } else if (grade > 0) {
    remarks.textContent = "Keep practicing!";
  } else {
    remarks.textContent = "Try again!";
  }
}
