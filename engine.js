 // Existing JS unchanged
    const emojis = ["😀","😎","😂","😍","🤩","😡","😭","😴","🤓","🥳","😱","🤯","🤠","👻","🎃","🐶","🐱","🐵","🐼","🐸"];
    const playBtn = document.getElementById("playBtn");
    const gridSelect = document.getElementById("gridSelect");
    const levelSelect = document.getElementById("levelSelect");
    const movesEl = document.getElementById("moves");
    const timerEl = document.getElementById("timer");
    const gameBoard = document.getElementById("gameBoard");
    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const overlay = document.getElementById("overlay");
    const resultText = document.getElementById("resultText");
    const stats = document.getElementById("stats");
    const playAgain = document.getElementById("playAgain");

    let moves = 0, time = 0, timer, firstCard, secondCard, lockBoard = false, matchedCount = 0, totalPairs = 0, timeLimit = null;

    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        time++;
        timerEl.textContent = timeLimit
          ? `Time: ${time}s / ${timeLimit}s`
          : `Time: ${time}s`;
        if (timeLimit && time >= timeLimit) {
          clearInterval(timer);
          showMessage("⏰ Time's Up!", false);
        }
      }, 1000);
    }

    function resetGame() {
      clearInterval(timer);
      time = 0;
      moves = 0;
      matchedCount = 0;
      movesEl.textContent = "Moves: 0";
      timerEl.textContent = timeLimit
        ? `Time: 0s / ${timeLimit}s`
        : "Time: 0s";
      gameBoard.innerHTML = "";
    }

    function generateBoard(size, level) {
      resetGame();

      if (level === "medium") timeLimit = 90;
      else if (level === "hard") timeLimit = 60;
      else timeLimit = null;

      let pairsNeeded = (size * size) / 2;
      totalPairs = pairsNeeded;
      let selected = emojis.slice(0, pairsNeeded);
      let cardsArray = [...selected, ...selected];
      cardsArray.sort(() => Math.random() - 0.5);

      gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

      cardsArray.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        const front = document.createElement("div");
        front.classList.add("card-inner", "front");
        const back = document.createElement("div");
        back.classList.add("card-inner", "back");
        back.textContent = symbol;
        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener("click", () => flipCard(card));
        gameBoard.appendChild(card);
      });

      timerEl.textContent = timeLimit
        ? `Time: 0s / ${timeLimit}s`
        : "Time: 0s";
    }

    function flipCard(card) {
      if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
        if (moves === 0) startTimer();
        return;
      }

      secondCard = card;
      moves++;
      movesEl.textContent = "Moves: " + moves;
      checkMatch();
    }

    function checkMatch() {
      const match = firstCard.querySelector(".back").textContent === secondCard.querySelector(".back").textContent;
      if (match) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCount++;
        if (matchedCount === totalPairs) {
          clearInterval(timer);
          setTimeout(() => showMessage("🎉 You Win!", true), 500);
        }
        resetTurn();
      } else {
        lockBoard = true;
        setTimeout(() => {
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          resetTurn();
        }, 800);
      }
    }

    function resetTurn() {
      [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function showMessage(message, win) {
      resultText.textContent = message;
      stats.textContent = `Moves: ${moves} | Time: ${time}s${timeLimit ? " / " + timeLimit + "s" : ""}`;
      overlay.style.display = "flex";
    }

    playBtn.addEventListener("click", () => {
      const size = parseInt(gridSelect.value);
      const level = levelSelect.value;
      startScreen.style.display = "none";
      gameScreen.style.display = "flex";
      overlay.style.display = "none";
      generateBoard(size, level);
    });

    playAgain.addEventListener("click", () => {
      overlay.style.display = "none";
      const size = parseInt(gridSelect.value);
      const level = levelSelect.value;
      generateBoard(size, level);
    });