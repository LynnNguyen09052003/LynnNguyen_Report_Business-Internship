function display(value) {
    document.getElementById("result").value += value;
}

function clearScreen() {
    document.getElementById("result").value = "";
}

function calculate() {
    let result = eval(document.getElementById("result").value);
    document.getElementById("result").value = result;

}