const questions = [
  { type: "single", question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
  { type: "multi", question: "Which are JavaScript frameworks?", options: ["React", "Laravel", "Angular", "Django"], answer: ["React", "Angular"] },
  { type: "blank", question: "HTML stands for _____ Markup Language.", answer: "HyperText" },
  { type: "single", question: "Which tag is used to link CSS?", options: ["<style>", "<script>", "<link>", "<css>"], answer: "<link>" },
  { type: "multi", question: "Select semantic HTML elements.", options: ["<div>", "<header>", "<footer>", "<section>"], answer: ["<header>", "<footer>", "<section>"] },
  { type: "blank", question: "CSS stands for Cascading _____ Sheets.", answer: "Style" },
  { type: "single", question: "Which company developed React?", options: ["Google", "Facebook", "Amazon", "Microsoft"], answer: "Facebook" },
  { type: "multi", question: "Which of these are databases?", options: ["MongoDB", "MySQL", "HTML", "CSS"], answer: ["MongoDB", "MySQL"] },
  { type: "blank", question: "JS is short for _____ Script.", answer: "Java" },
  { type: "single", question: "Which HTML attribute sets unique identifier?", options: ["class", "id", "style", "ref"], answer: "id" }
];

// Track current question, score and timer
let current = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;

const timerText = document.getElementById("time-left");
const timerBox = document.getElementById("timer");
const normalHeartbeat = document.getElementById("heartbeat-normal");
const fastHeartbeat = document.getElementById("heartbeat-fast");

const questionBox = document.getElementById("question-box");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const blankInput = document.getElementById("blank-input");
const submitBtn = document.getElementById("submit");
const resultBox = document.getElementById("result");
const scoreText = document.getElementById("score");

// Load current question
function loadQuestion() {
  const q = questions[current];
  blankInput.style.display = "none";
  blankInput.value = "";
  optionsEl.innerHTML = "";
  questionEl.textContent = q.question;

  // Render inputs
  if (q.type === "single") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="option" value="${opt}"/> ${escapeHTML(opt)}`;
      optionsEl.appendChild(label);
    });
  } else if (q.type === "multi") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" value="${opt}"/> ${escapeHTML(opt)}`;
      optionsEl.appendChild(label);
    });
  } else if (q.type === "blank") {
    blankInput.style.display = "block";
  }
}

// Submit answer logic
submitBtn.addEventListener("click", () => {
  const q = questions[current];
  let userAnswer = [];

  if (q.type === "single") {
    const selected = document.querySelector("input[name='option']:checked");
    if (selected) userAnswer.push(selected.value);
  } else if (q.type === "multi") {
    const selected = document.querySelectorAll("input[type='checkbox']:checked");
    selected.forEach(el => userAnswer.push(el.value));
  } else if (q.type === "blank") {
    userAnswer.push(blankInput.value.trim());
  }

  if (isCorrectAnswer(q.answer, userAnswer)) {
    score++;
  }

  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
});

// Start countdown timer
function startTimer() {
  if (normalHeartbeat) normalHeartbeat.play();

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft;

    if (timeLeft === 20) {
      timerBox.classList.add("blink");
      if (normalHeartbeat) normalHeartbeat.pause();
      if (fastHeartbeat) fastHeartbeat.play();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// Validate answer (case insensitive, sorted)
function isCorrectAnswer(correct, given) {
  if (typeof correct === "string") {
    return given[0]?.toLowerCase() === correct.toLowerCase();
  }

  if (Array.isArray(correct)) {
    return (
      correct.length === given.length &&
      correct.map(a => a.toLowerCase()).sort().join() === given.map(a => a.toLowerCase()).sort().join()
    );
  }

  return false;
}

// End game and show result
function endGame() {
  clearInterval(timerInterval);
  if (normalHeartbeat) normalHeartbeat.pause();
  if (fastHeartbeat) fastHeartbeat.pause();

  questionBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `${score} / ${questions.length}`;
}

// Escape HTML tags (like <link>)
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize

loadQuestion();
startTimer();