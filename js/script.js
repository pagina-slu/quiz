var path1 = '../res/questions/';
var questions = "";
window.onload = function () {
    document.getElementById('quiz-wrapper').innerHTML = '';
    document.getElementById('category-wrapper').innerHTML = '';
    document.getElementById('title-wrapper').innerHTML = '<span id="title">Choose a category</span>';

    readJSONfile('../res/categories.json').forEach(category => {
        console.log(category);
        let categoryButton = document.createElement("button");
        categoryButton.classList = "category-button";
        categoryButton.innerHTML = category.name;
        
        categoryButton.onclick = () => {
            document.getElementById('category-wrapper').remove();
            document.getElementById('title').innerHTML = category.name;
            questions = readJSONfile(category.path);
            startQuiz();
            generateSubmitButton();
        }
        document.getElementById('category-wrapper').appendChild(categoryButton);
    });
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
    window.onbeforeunload = function() {
       return "Your progress would be lost";
    }
    let quizWrapper = document.getElementById("quiz-wrapper");
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

function generateSubmitButton(){
    let submitWrapper = document.getElementById("submit-wrapper");
    let submitButton = document.createElement("button");
    submitButton.setAttribute("id", "submit-button");
    submitButton.innerHTML = "Submit";
    submitButton.addEventListener("click", checkQuiz);
    submitWrapper.appendChild(submitButton);
}

function checkQuiz(){
   //get answers

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

function showResults () { // KIEFER

}

function rotateProgressBar(value){
    const circle = document.getElementById('progress-circle');
    const bar = document.getElementById('value-bar');
    const text = document.getElementById('progress-text');
    let deg = Math.round(360/questions.length) * value;
    if(deg <= 180){
        text.innerHTML = Math.round(value/questions.length*100)+'%';
        circle.className = ' ';
        bar.style.transform = 'rotate('+deg+'deg)';
    }else{
        text.innerHTML = Math.round(value/questions.length*100)+'%';
        circle.className = 'over50';
        bar.style.transform = 'rotate('+deg+'deg)';
    }
}