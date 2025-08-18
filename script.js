function getRandomQuestions(allQuestions, count) {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

let allCategories = {};
let currentQuestions = [];
let selectedCategory = "mix";

// Načtení otázek ze souboru questions.json
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    allCategories = data;
  })
  .catch(error => {
    console.error("Chyba při načítání otázek:", error);
  });

function loadQuiz(questionsToRender) {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("actions").style.display = "none";
  document.getElementById("submit").style.display = "inline-block";
  document.getElementById("showAnswers").style.display = "none";

  questionsToRender.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question fade-in";

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(questionText);

    q.options.forEach((option, i) => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="radio" name="question${index}" value="${i}" />
        ${option}
      `;
      questionDiv.appendChild(label);
      questionDiv.appendChild(document.createElement("br"));
    });

    // Připrav místo pro info (skryté)
    if (q.info) {
      const infoBlock = document.createElement("div");
      infoBlock.className = "info";
      infoBlock.style.display = "none";
      infoBlock.textContent = q.info;
      questionDiv.appendChild(infoBlock);
    }

    quizContainer.appendChild(questionDiv);
  });
}

function evaluateQuiz() {
  const quizContainer = document.getElementById("quiz");
  let score = 0;

  currentQuestions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="question${index}"]:checked`);
    const questionDiv = quizContainer.children[index];

    if (selected) {
      const answerIndex = parseInt(selected.value);
      if (answerIndex === q.correctIndex) {
        score++;
        questionDiv.classList.add("correct");
      } else {
        questionDiv.classList.add("incorrect");
      }
    } else {
      questionDiv.classList.add("incorrect");
    }
  });

  const percent = Math.round((score / currentQuestions.length) * 100);
  let comment = "";

  if (percent >= 90) comment = "🧠 Geniální! Tohle byl výkon hodný mistra!";
  else if (percent >= 70) comment = "👍 Skvělá práce! Máš to v malíku.";
  else if (percent >= 50) comment = "🙂 Dobré! Ale ještě je co pilovat.";
  else if (percent >= 30) comment = "🤔 Základy máš, ale chce to trénink.";
  else comment = "😅 No… aspoň ses snažil/a. Zkus to znovu!";

  document.getElementById("result").innerHTML = `<h2>Výsledek: ${percent}%</h2><p>${comment}</p>`;
  document.getElementById("actions").style.display = "block";
  document.getElementById("submit").style.display = "none";
  document.getElementById("showAnswers").style.display = "inline-block";
}

function showCorrectAnswers() {
  const quizContainer = document.getElementById("quiz");

  currentQuestions.forEach((q, index) => {
    const questionDiv = quizContainer.children[index];
    const correctOption = q.options[q.correctIndex];

    const correctInfo = document.createElement("p");
    correctInfo.style.color = "green";
    correctInfo.style.fontWeight = "bold";
    correctInfo.textContent = `Správná odpověď: ${correctOption}`;
    questionDiv.appendChild(correctInfo);

    // Zobraz doplňkovou informaci, pokud existuje
    const infoBlock = questionDiv.querySelector(".info");
    if (infoBlock) {
      infoBlock.style.display = "block";
      infoBlock.style.marginTop = "5px";
      infoBlock.style.fontStyle = "italic";
      infoBlock.style.color = "#444";
    }
  });

  document.getElementById("showAnswers").style.display = "none";
}

// Tlačítka
document.getElementById("start").addEventListener("click", () => {
  selectedCategory = document.getElementById("category").value;

  let selectedSet = [];

  if (selectedCategory === "mix") {
    const allQuestions = Object.values(allCategories).flat();
    selectedSet = getRandomQuestions(allQuestions, 10);
  } else {
    selectedSet = getRandomQuestions(allCategories[selectedCategory], 10);
  }

  currentQuestions = selectedSet;
  loadQuiz(currentQuestions);
});

document.getElementById("submit").addEventListener("click", evaluateQuiz);
document.getElementById("retry").addEventListener("click", () => {
  loadQuiz(currentQuestions);
});
document.getElementById("new").addEventListener("click", () => {
  document.getElementById("start").click();
});
document.getElementById("showAnswers").addEventListener("click", showCorrectAnswers);
