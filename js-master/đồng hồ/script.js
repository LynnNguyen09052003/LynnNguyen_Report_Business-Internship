window.onload = function() {
    let secondCount = 0;
    let milisecondCount = 0;

    const appendMilisecond = document.getElementById("Milisecond");
    const appendSecond = document.getElementById("Second");

    const buttonStart = document.getElementById('start');
    const buttonPause = document.getElementById('pause');
    const buttonStop = document.getElementById('stop');
    const buttonReset = document.getElementById('reset');

    let Interval;

    buttonStart.onclick = function() {
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
    }

    buttonPause.onclick = function() {
        clearInterval(Interval);
    }

    buttonStop.onclick = function() {
        clearInterval(Interval);
        milisecondCount = 0;
        secondCount = 0;
        buttonStart.disabled = true;
    }

    buttonReset.onclick = function() {
        clearInterval(Interval);
        milisecondCount = 0;
        secondCount = 0;
        buttonStart.disabled = false;
        appendMilisecond.innerHTML = "00";
        appendSecond.innerHTML = "00";
    }

    function startTimer() {
        milisecondCount++;

        if (milisecondCount <= 9) {
            appendMilisecond.innerHTML = "0" + milisecondCount;
        } else {
            appendMilisecond.innerHTML = milisecondCount;
        }

        if (milisecondCount > 99) {
            secondCount++;
            appendSecond.innerHTML = secondCount <= 9 ? "0" + secondCount : secondCount;
            milisecondCount = 0;
            appendMilisecond.innerHTML = "00";
        }
    }
}