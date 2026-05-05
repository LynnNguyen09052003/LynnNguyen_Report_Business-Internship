const userResult = document.querySelector(".result-user img");
const npcResult = document.querySelector(".result-npc img");
const resultText = document.querySelector(".result-text");
const playButton = document.querySelector(".btn");
const optionImages = document.querySelectorAll(".options");

const choices = ["rock", "paper", "scissors"];
let YouWins = parseInt(localStorage.getItem("YouWins")) || 0;
let PcWins = parseInt(localStorage.getItem("PcWins")) || 0;

const xScoreEl = document.getElementById("userScore");
const oScoreEl = document.getElementById("pcScore");
xScoreEl.textContent = YouWins;
oScoreEl.textContent = PcWins;

optionImages.forEach((Image) => {
    Image.addEventListener("click", () => {
        optionImages.forEach(img => img.classList.remove("active"));
        Image.classList.add("active");

        const userChoice = Image.getAttribute("data-choice");

        npcResult.src = "img/loading.gif";
        userResult.src = `img/${userChoice}.png`;
        resultText.textContent = "Đang chọn...";

        userResult.classList.add("shake");
        npcResult.classList.add("shake");

        setTimeout(() => {
            userResult.classList.remove("shake");
            npcResult.classList.remove("shake");

            const npcChoice = choices[Math.floor(Math.random() * 3)];
            npcResult.src = `img/${npcChoice}.png`;

            if (userChoice === npcChoice) {
                resultText.textContent = "Hoà!";
            } else if (
                (userChoice === "rock" && npcChoice === "scissors") ||
                (userChoice === "scissors" && npcChoice === "paper") ||
                (userChoice === "paper" && npcChoice === "rock")
            ) {
                resultText.textContent = "Bạn thắng!";
                YouWins++;
                localStorage.setItem("YouWins", YouWins);
                xScoreEl.textContent = YouWins;
            } else {
                resultText.textContent = "Máy thắng!";
                PcWins++;
                localStorage.setItem("PcWins", PcWins);
                oScoreEl.textContent = PcWins;
            }

        }, 900);
    });
});

playButton.addEventListener("click", () => {
    userResult.src = "img/question.png";
    npcResult.src = "img/question.png";
    resultText.textContent = "Hãy chọn Rock, Scissors hoặc Paper!";
    optionImages.forEach(option => option.classList.remove("active"));
    YouWins = 0;
    PcWins = 0;
    localStorage.setItem("YouWins", 0);
    localStorage.setItem("PcWins", 0);
    xScoreEl.textContent = 0;
    oScoreEl.textContent = 0;
});