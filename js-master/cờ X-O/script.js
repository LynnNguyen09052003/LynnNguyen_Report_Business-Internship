let currentPlayer = "X";
const boxes = document.querySelectorAll("td");
const message = document.getElementById("message");

let xWins = parseInt(localStorage.getItem("xWins")) || 0;
let oWins = parseInt(localStorage.getItem("oWins")) || 0;

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");

updateScoreboard();

boxes.forEach(box => {
    box.addEventListener("click", function() {
        if (box.textContent === "" && !message.textContent) {
            box.textContent = currentPlayer;
            box.classList.add(currentPlayer.toLowerCase());

            if (checkWin()) {
                message.textContent = `Người chơi ${currentPlayer} thắng!`;
                if (currentPlayer === "X") {
                    xWins++;
                    localStorage.setItem("xWins", xWins);
                } else {
                    oWins++;
                    localStorage.setItem("oWins", oWins);
                }

                updateScoreboard();
            } else if (checkDraw()) {
                message.textContent = `Hòa!`;
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
            }
        }
    });
});

function checkWin() {
    const winCombos = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];

    return winCombos.some(combo => {
        const [a, b, c] = combo.map(id => document.getElementById(`box-${id}`).textContent);
        return a !== "" && a === b && b === c;
    });
}

function checkDraw() {
    if (checkWin()) return false;
    for (let box of boxes) {
        if (box.textContent === "") return false;
    }
    return true;
}

function resetBoard() {
    boxes.forEach(box => {
        box.textContent = "";
        box.classList.remove("x", "o");
    });
    message.textContent = "";
    currentPlayer = "X";
}

function updateScoreboard() {
    xScoreEl.textContent = xWins;
    oScoreEl.textContent = oWins;
}

function resetScore() {
    xWins = 0;
    oWins = 0;
    localStorage.setItem("xWins", "0");
    localStorage.setItem("oWins", "0");
    updateScoreboard();
}