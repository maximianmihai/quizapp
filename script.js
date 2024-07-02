const questionContainer = document.querySelector("h2");
const options = document.querySelectorAll(".option");
const submitButton = document.querySelector("button");
const scoreArea = document.querySelector("#ShowScore");
const timerDisplay = document.getElementById('timer');
const questionCounter = document.getElementById('questionCounter');

let questions = [];
let questionCount = 0;
let score = 0;
let countdown;
let timeLeft = 120; 

document.addEventListener('DOMContentLoaded', function() {
    const category = localStorage.getItem('selectedCategory');
    if (category) {
        fetchQuestions(category);
    } else {
        alert("No category selected, redirecting to category selection.");
        window.location.href = 'index.html';
    }
});

async function fetchQuestions(category) {
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        questions = data.results.map((question) => ({
            question: question.question,
            options: [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5),
            correctAnswer: question.correct_answer
        }));
        mainFunc();
        startTimer();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function mainFunc() {
  if (questions.length > 0) {
      const list = questions[questionCount];
      questionContainer.innerText = list.question;
      options.forEach((option, index) => {
          option.innerText = list.options[index];
          option.classList.remove('selected');
          option.onclick = () => selectOption(option);
      });
      questionCounter.innerText = `Question: ${questionCount + 1} / ${questions.length}`;
  }
}

function selectOption(selectedOption) {
  options.forEach(option => {
      option.classList.remove('selected');
  });
  selectedOption.classList.add('selected');
}


submitButton.addEventListener("click", () => {
    const selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) {
        alert('Please select an option!');
        return;
    }
    const checkAnswer = selectedOption.innerText;
    if (checkAnswer === questions[questionCount].correctAnswer) {
        score++;
    }
    questionCount++;
    if (questionCount < questions.length) {
        mainFunc();
    } else {
        finishQuiz();
    }
});

function updateTimer() {
    timerDisplay.innerText = `Time Remaining: ${timeLeft} seconds`;
    if (timeLeft <= 0) {
        finishQuiz();
    } else {
        timeLeft--;
    }
}

function startTimer() {
    countdown = setInterval(updateTimer, 1000);
}

function finishQuiz() {
  clearInterval(countdown);
  scoreArea.style.display = "block";
  scoreArea.innerHTML = `
      <h3>Your score is ${score} / ${questions.length}</h3>
      <button class='btn' onclick='redirectToCategorySelection()'>Play Again</button>`;
}

function redirectToCategorySelection() {
  window.location.href = 'index.html';
}

