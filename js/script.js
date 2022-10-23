var path1 = '../res/questions/';
var questions = "";
window.onload = function () {
    document.getElementById('quiz-wrapper').innerHTML = '';
    document.getElementById('category-wrapper').innerHTML = '';
    document.getElementById('title-wrapper').innerHTML = '<span id="title">Choose a category</span>';

    let btn1 = document.createElement("button");
    btn1.classList = "category-button";
    btn1.innerHTML = "Applications Development";
    document.getElementById('category-wrapper').appendChild(btn1);

    let btn2 = document.createElement("button");
    btn2.classList = "category-button";
    btn2.innerHTML = "Web Systems Development";
    document.getElementById('category-wrapper').appendChild(btn2);

    btn1.onclick = function () {
        document.getElementById('category-wrapper').remove();
        document.getElementById('title').innerHTML = 'Applications Development';
        path1 += 'appdev.json';
        questions = readJSONfile(path1);
        startQuiz(); //starts the quiz by reading and appending of JSON data
    }
    btn2.onclick = function () {
        document.getElementById('category-wrapper').remove();
        document.getElementById('title').innerHTML = 'Web Systems Development';
        path1 += 'webtech.json';
        questions = readJSONfile(path1);
        startQuiz(); //starts the quiz by reading and appending of JSON data
    }
}

function readJSONfile(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    var JSONobject = JSON.parse(request.responseText);
    return JSONobject;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Functions
// Start reading and appending the JSON
function startQuiz() {
    let quizWrapper = document.getElementById("quiz-wrapper");
    let currentIndex = 0;
    console.log(questions);
    for (let i = 0; i < questions.length; i++) {
        switch (questions[i].type) {
            case "identification":
                quizWrapper.appendChild(identification(questions[i], i));
                break;
            case "true-or-false":
                quizWrapper.appendChild(trueOrFalse(questions[i], i));
                break;
            case "multiple-choice":
                quizWrapper.appendChild(multipleChoice(questions[i], i));
                break;
        }
    }
}

function generateQuestionWrapper() {
    let questionWrapper = document.createElement("div");
    questionWrapper.classList = "question-wrapper";
    return questionWrapper;
}

function generateQuestionLabel(question, index) {
    let label = document.createElement("label");
    label.className = "question";
    label.innerHTML = `${index + 1}. ${question}`;
    return label;
}

function generateInputWrapper() {
    let inputWrapper = document.createElement("div");
    inputWrapper.classList = "input-wrapper";
    return inputWrapper;
}

function multipleChoice(data, index) {
    let questionWrapper = generateQuestionWrapper();
    let label = generateQuestionLabel(data.question, index);
    let inputWrapper = generateInputWrapper();
    for (let i = 0; i < data.options.length; i++) {
        let inputDiv = document.createElement("div");
        inputDiv.className = "input";
        let input = document.createElement("input");
        input.type = "radio";
        input.name = `q${index + 1}`;
        input.value = data.options[i];

        let label = document.createElement('label');
        label.innerHTML = data.options[i];
        label.for = data.answer;
        inputDiv.appendChild(input);
        inputDiv.appendChild(label);
        inputWrapper.appendChild(inputDiv);
    }

    questionWrapper.appendChild(label);
    questionWrapper.appendChild(inputWrapper);
    return questionWrapper;
}

function identification(data, index) {
    let questionWrapper = generateQuestionWrapper();
    let label = generateQuestionLabel(data.question, index);
    let inputWrapper = generateInputWrapper();

    let input = document.createElement('input');
    input.type = "text";
    inputWrapper.appendChild(input);

    questionWrapper.appendChild(label);
    questionWrapper.appendChild(inputWrapper);
    return questionWrapper;
}

function trueOrFalse(data, index) {
    let questionWrapper = generateQuestionWrapper();
    let label = generateQuestionLabel(data.question, index);
    let inputWrapper = generateInputWrapper();

    const options = ["True", "False"];
    for (let i = 0; i < options.length; i++) {
        let inputDiv = document.createElement("div");
        inputDiv.className = "input";

        let input = document.createElement("input");
        input.type = "radio";
        input.name = `q${index++}`;
        input.value = options[i];

        let label = document.createElement('label');
        label.innerHTML = options[i];
        label.for = data.answer;
        inputDiv.appendChild(input);
        inputDiv.appendChild(label);
        inputWrapper.appendChild(inputDiv);
    }

    questionWrapper.appendChild(label);
    questionWrapper.appendChild(inputWrapper);
    return questionWrapper;
}