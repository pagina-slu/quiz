hideProgressBar();
var path1 = '../res/questions/';    // Path of the questions
var questions = "";                 // List of questions
var sequence;                       // List of question order
const numberOfQuestions = 5;        // Number of questions to show

// Runs after the page loads
window.onload = function () {
    document.getElementById('title-wrapper').innerHTML = '<span id="title">Choose a category</span>';

    readJSONfile('../res/categories.json').forEach(category => {
        // Create category buttons for each category in the JSON
        let categoryButton = document.createElement("button");
        categoryButton.classList = "category-button";
        categoryButton.innerHTML = category.name;

        categoryButton.onclick = () => {
            document.getElementById('category-wrapper').remove();
            document.getElementById('title').innerHTML = category.name;
            questions = readJSONfile(category.path);
            startQuiz();

        }
        document.getElementById('category-wrapper').appendChild(categoryButton);
    });
}

// Functions
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

let userPlace = document.getElementById("user-form");
function generateUserLogIn(){
    let form = document.createElement("form");
    form.setAttribute("action", "index.html");

    let user = document.createElement("input");
    user.setAttribute("id", "username");
    user.setAttribute("type", "text");
    user.setAttribute("name", "Enter your name");
    user.setAttribute("placeholder", "Enter your name");

    let enter = document.createElement("button");
    enter.setAttribute("id","btn");
    enter.setAttribute("disabled", "")
    enter.innerHTML = "Enter!";

    form.append(user);
    form.append(enter);
 
    document.getElementById("user-wrapper")
    .appendChild(form);

    const username = document.getElementById("username");
    const startButton = document.getElementById("btn");

    username.addEventListener('keyup', () => {
        startButton.disabled = !username.value;
    });
}

let down = document.getElementById("user-form");
function generateUserLogIn(){
    let form = document.createElement("form");
    form.setAttribute("action", "index.html");

    let user = document.createElement("input");
    user.setAttribute("id", "username");
    user.setAttribute("type", "text");
    user.setAttribute("name", "Enter your name");
    user.setAttribute("placeholder", "Enter your name");

    let enter = document.createElement("button");
    enter.setAttribute("id","btn");
    enter.setAttribute("disabled", "")
    enter.innerHTML = "Enter!";

    form.append(user);
    form.append(enter);
 
    document.getElementById("user-wrapper")
    .appendChild(form);

    const username = document.getElementById("username");
    const startButton = document.getElementById("btn");

    username.addEventListener('keyup', () => {
        startButton.disabled = !username.value;
    });
}

// Start reading and appending the JSON
function startQuiz() {
    showProgressBar()
    window.onbeforeunload = function () {
        return "Your progress would be lost";
    }

    let quizWrapper = document.getElementById("quiz-wrapper");
    let totalQuestions = Object.keys(questions).length; // Total number of questions in JSON
    sequence = generateNumberSequence(numberOfQuestions, totalQuestions); // Sequence of questions

    for (let i = 0; i < sequence.length; i++) {
        switch (questions[sequence[i]].type) {
            case "identification":
                quizWrapper.appendChild(identification(questions[sequence[i]], i));
                break;
            case "true-or-false":
                quizWrapper.appendChild(trueOrFalse(questions[sequence[i]], i));
                break;
            case "multiple-choice":
                quizWrapper.appendChild(multipleChoice(questions[sequence[i]], i));
                break;
        }
    }
    generateSubmitButton();
}

//this function will return an array of 'length' length consisting random numbers from 0  to 'max'
function generateNumberSequence(length, max) {
    let numberSequence = [];
    let newNum = Math.floor(Math.random() * max);
    numberSequence.push(newNum);
    let count = length - 1;
    while (count > 0) {
        newNum = Math.floor(Math.random() * max);
        if (numberSequence.indexOf(newNum) == -1) {
            numberSequence.push(newNum);
            count--;
        }
    }
    return numberSequence;
}

function generateSubmitButton() {  // Generate and assign event listener to submit button
    let submitWrapper = document.getElementById("submit-wrapper");
    let submitButton = document.createElement("button");
    submitButton.setAttribute("id", "submit-button");
    submitButton.innerHTML = "Submit";
    submitButton.addEventListener("click", submitQuiz);
    submitWrapper.appendChild(submitButton);
}

function submitQuiz() {
    let answerWrapper = document.querySelectorAll(".input-wrapper");
    let answers = []; // Holds the answer of the user

    for (let index = 0; index < answerWrapper.length; index++) { // Get answers
        let answer = "";
        if (answerWrapper[index].firstChild.className == "identification") {
            answer = answerWrapper[index].firstChild.firstChild.value;
            // if(a == "" || a == null){
            //     alert("please answer all the items");
            //     break;
            // }

        } else if (answerWrapper[index].firstChild.className == "multiple-choice") {
            if (answerWrapper[index].querySelector("input[name='q" + (index + 1) + "']:checked")) {
                answer = answerWrapper[index].querySelector("input[name='q" + (index + 1) + "']:checked").value;
            }
            // else{
            //     alert("Please answer all the qestions");
            //     break;
            // }
        } else if (answerWrapper[index].firstChild.className == "true-false") {
            if (answerWrapper[index].querySelector("input[name='q" + (index + 1) + "']:checked")) {
                answer = answerWrapper[index].querySelector("input[name='q" + (index + 1) + "']:checked").value;
            }
            // else{
            //     alert("Please answer all the qestions");
            //     break;
            // }
        }
        answers.push(answer);

    }
    let score = checkAnswers(answers);
    console.log("you got: " + score);
    showResults(answers);
}

function countAnsweredQuestions() {
    let answerWrapper = document.querySelectorAll(".input-wrapper");
    let answerCount = 0; // Holds the answer of the user

    for (let index = 0; index < answerWrapper.length; index++) { // Get answers
        let answer = "";
        let type = answerWrapper[index].firstChild.classList;
        if (type.contains("identification")) {
            answer = answerWrapper[index].firstChild.firstChild.value;
            console.log(answer);
            if(answer.length != 0){
                answerCount++;
            }
        } else if (type.contains("multiple-choice")) {
            if (answerWrapper[index].querySelector("input[name='q" + (index + 1) + "']:checked")) {
                answerCount++;
            }
        } else if (type.contains("true-false")) {
            if (answerWrapper[index].querySelector("input[name='q" + (index + 1) + "']:checked")) {
                console.log("Answered trueorfalse");
                answerCount++;
            }
        }
    }
    console.log(answerCount);
    return answerCount;
}

//checks the answer and return the number of correct answers
function checkAnswers(answers) {
    let counter = 0;
    for (let i = 0; i < sequence.length; i++) {
        if (questions[sequence[i]].answer == answers[i]) {
            counter++;
        }
    }

    return counter;
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
        let inputDiv = generateInputDiv("multiple-choice");
        inputDiv.appendChild(generateRadioButton(`q${index + 1}`, data.options[i]));
        inputDiv.appendChild(generateLabelForRadioButton(data.options[i]));
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
    let inputDiv = document.createElement('div')
    inputDiv.className = "identification";

    let input = document.createElement('input');
    input.type = "text";
    input.addEventListener("input", () => {
        rotateProgressBar(countAnsweredQuestions());
    });
    
    inputDiv.appendChild(input);
    inputWrapper.appendChild(inputDiv);

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
        let inputDiv = generateInputDiv("true-false");
        inputDiv.appendChild(generateRadioButton(`q${index + 1}`, options[i]));
        inputDiv.appendChild(generateLabelForRadioButton(options[i]));
        inputWrapper.appendChild(inputDiv);
    }

    questionWrapper.appendChild(label);
    questionWrapper.appendChild(inputWrapper);
    return questionWrapper;
}

function generateInputDiv(questionType) {
    let inputDiv = document.createElement("div");
    inputDiv.className = `${questionType} input`;
    return inputDiv;
}

function generateLabelForRadioButton(value) {
    let label = document.createElement("label");
    label.innerHTML = value;
    return label;
}

function generateRadioButton(name, value) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.addEventListener("click", () => {
        rotateProgressBar(countAnsweredQuestions());
    });
    return input;
}

function showResults(answers) {

}

function rotateProgressBar(numOfAnswers) {
    const circle = document.getElementById('progress-circle');
    const bar = document.getElementById('value-bar');
    const text = document.getElementById('progress-text');

    let deg = Math.round(360 / sequence.length) * numOfAnswers;
    if (deg <= 180) {
        text.innerHTML = Math.round(numOfAnswers / sequence.length * 100) + '%';
        circle.className = ' ';
        bar.style.transform = 'rotate(' + deg + 'deg)';
    } else {
        text.innerHTML = Math.round(numOfAnswers / sequence.length * 100) + '%';
        circle.className = 'over50';
        bar.style.transform = 'rotate(' + deg + 'deg)';
    }
}

function hideProgressBar() {
    const circle = document.getElementById('progress-circle');
    circle.style.display = "none";
}

function showProgressBar() {
    const circle = document.getElementById('progress-circle');
    circle.style.display = "";
}

function saveLocally() {

}