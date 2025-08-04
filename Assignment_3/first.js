function arithmaticoperation(result) {
    let a = parseFloat(document.getElementById('number_1').value);
    let b = parseFloat(document.getElementById('number_2').value);
    if (isNaN(a) || isNaN(b)) {
        document.getElementById('result').innerHTML = "<strong style='color:red;'>Please enter valid numbers</strong>";
        return;
    }
    let resultText = "";
    if (result === 'add') {
        resultText = a + b;
    }
    else if (result === 'sub') {
        resultText = a - b;
    }
    else if (result === 'mul') {
        resultText = a * b;
    }
    else {
        resultText = "Please select a valid operation";
    }
    document.getElementById('result').innerText = resultText;
}