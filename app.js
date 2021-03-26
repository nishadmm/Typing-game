let startBtn = document.getElementById("start-btn"),
  playPage = document.getElementById("play-page"),
  initialPage = document.getElementById("initial-page"),
  secondInPara = document.getElementById("second-in-para"),
  timeLeft = document.getElementById("time-left"),
  difficulty = document.querySelector("#difficulty"),
  wordShow = document.getElementById("word-show"),
  score = document.getElementById("score"),
  playAgainBtn = document.getElementById("play-again-btn"),
  timeUpMsg = document.getElementById("time-up-msg"),
  input = document.getElementById("input")

document.addEventListener("readystatechange", () => {
  setHighestScore();
})

startBtn.addEventListener("click", (e) => {
  difficultyValue = difficulty.value
  let time = 0;
  initialPage.style.display = "none"
  playPage.style.display = "block"

  timeUpMsg.style.display = "none"
  playAgainBtn.style.display = "none"
  input.removeAttribute("disabled")

  input.focus();

  if (difficultyValue === "easy") time = 6;
  if (difficultyValue === "medium") time = 4;
  if (difficultyValue === "hard") time = 3;

  setUI(time);
  e.preventDefault();
})

function setUI(time) {


  let wordArray;
  // get random words
  fetch("https://random-word-api.herokuapp.com/word?number=40")
    .then(res => res.json())
    .then(data => {
      wordArray = data;

      let randomIndex = Math.floor(Math.random() * 30 + 1)
      let word = wordArray[randomIndex];
      score.textContent = 0
      wordShow.textContent = word
      secondInPara.textContent = time
      timeLeft.textContent = time

      let timeLeftInNumber = Number(timeLeft.textContent)

      let timeIntervel = setInterval(() => {
        timeLeftInNumber -= 1;
        timeLeft.textContent = timeLeftInNumber;
        if (timeLeftInNumber === 0) {
          clearInterval(timeIntervel);
          timeUpMsg.textContent = `Time Up... Score : ${score.textContent}`
          timeUpMsg.classList.remove("bg-success")
          timeUpMsg.classList.add("bg-danger")
          timeUpMsg.style.display = "block"
          playAgainBtn.style.display = "block"

          input.setAttribute("disabled", true)

          let scores;
          if (localStorage.getItem("scores"))
            scores = JSON.parse(localStorage.getItem("scores"));
          else
            scores = [];

          let s = Number(score.textContent)
          scores.push(s);
          let uniqueScoreVAlue = [... new Set(scores)];
          let scoreArray = Array.from(uniqueScoreVAlue)
          localStorage.setItem("scores", JSON.stringify(scoreArray));


        } else {
          input.addEventListener("input", () => {

            let typingWord = input.value
            if (typingWord === word) {
              // show message
              timeUpMsg.textContent = "Right "
              timeUpMsg.classList.remove("bg-danger")
              timeUpMsg.classList.add("bg-success")
              timeUpMsg.style.display = "block"
              setTimeout(() => {
                timeUpMsg.style.display = "none";
              }, 1500)

              input.value = ""

              // catch next word
              randomIndex = Math.floor(Math.random() * 30 + 1);
              word = wordArray[randomIndex]
              wordShow.textContent = word;

              // add 1 point
              let s = Number(score.textContent)
              s += 1;
              score.textContent = s;

              // reset time
              timeLeft.textContent = time
              timeLeftInNumber = timeLeft.textContent
            }
          })
        }
      }, 1000);
    })
}

// play again listner
playAgainBtn.addEventListener("click", (e) => {

  playPage.style.display = "none"
  initialPage.style.display = "block"

  input.value = ""
  wordShow.textContent = ''

  setHighestScore();

  e.preventDefault()
})

// Get Score array
function getScoreArray() {
  let scores;
  if (localStorage.getItem("scores"))
    scores = JSON.parse(localStorage.getItem("scores"));
  else
    scores = [];
  let uniqueScoreVAlue = [... new Set(scores)];
  let scoreArray = Array.from(uniqueScoreVAlue)
  return scoreArray;
}

// set highest score
function setHighestScore() {
  let scoreArray = getScoreArray();
  let highScore = Math.max(...scoreArray)
  if (highScore >= 2) {
    document.getElementById("high-score-card").style.display = "block"
    document.getElementById("high-score").textContent = highScore;
  } else {
    document.getElementById("high-score-card").style.display = "none"
  }
}


