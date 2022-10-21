var path1 = '../res/questions/';
var questions = "";
window.onload = function () {
    document.getElementById('quiz-wrapper').innerHTML = '';
    document.getElementById('category-wrapper').innerHTML = '';
    document.getElementById('title-wrapper').innerHTML = '<span id="category">Choose a category</span>';

    let btn1 = document.createElement("button");
    btn1.innerHTML = "AppDev";
    document.getElementById('category-wrapper').appendChild(btn1);

    let btn2 = document.createElement("button");
    btn2.innerHTML = "Webtech";
    document.getElementById('category-wrapper').appendChild(btn2);

    btn1.onclick = function () {
        document.getElementById('category-wrapper').remove();
        document.getElementById('category').innerHTML = 'Appdev';
        generateQuizWrapper();
        path1 += 'appdev.json';
        questions = readJSONfile(path1);
        startQuiz(); //starts the quiz by reading and appending of JSON data
        document.getElementById("question-count").innerHTML = questions.length;
    }
    btn2.onclick = function () {
        document.getElementById('category-wrapper').remove();
        document.getElementById('category').innerHTML = 'Web Systems Development';
        path1 += 'webtech.json';
        generateQuizWrapper();
        questions = readJSONfile(path1);
        startQuiz(); //starts the quiz by reading and appending of JSON data
        document.getElementById("question-count").innerHTML = questions.length;
    }

}

function generateQuizWrapper() {
    let buttonwrapper = document.createElement("div");
    buttonwrapper.setAttribute("class", "button-wrapper");
    let questionwrapper = document.createElement("div");
    questionwrapper.setAttribute("id", "question-wrapper");

    buttonwrapper.innerHTML = `
    <a class="button" id="previous-button">
                <img src="res/arrow-left-circle.svg" alt="" srcset="">
            </a>
            <input type="number" name="question-number" id="question-number" value="1"/>
            <span>of <span id="question-count">x</span></span>
            <a class="button" id="next-button">
                <img src="res/arrow-right-circle.svg" alt="" srcset="">
            </a>`;
    document.getElementById("quiz-wrapper").appendChild(questionwrapper);
    document.getElementById("quiz-wrapper").appendChild(buttonwrapper);
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



// FUNCTIONS

//starts the reading and appending of JSON data
function startQuiz() {
    var previousQuestion = document.getElementById("previous-button");
    var nextQuestion = document.getElementById("next-button");

    let currentIndex = 0;
    let currentQuestion = questions[currentIndex];
    console.log(questions.length);
    let questionWrapper = document.getElementById("question-wrapper");
    console.log(questionWrapper);
    switch (currentQuestion.type) {
        case "identification":
            questionWrapper = identification(currentQuestion);
            break;
        case "multiple-choice":
            questionWrapper = (multipleChoice(currentQuestion), currentIndex);
            break;
    }

    let questionNumber = document.getElementById("question-number");

    nextQuestion.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex > questions.length - 1) {
            alert("question index out of bounds: " + currentIndex);
            currentIndex--;
        }
        else {
            removeAllChildNodes(questionWrapper);
            currentQuestion = questions[currentIndex];
            if (currentIndex < questions.length) {
                console.log(currentQuestion.type);
                switch (currentQuestion.type) {
                    case "identification":
                        questionWrapper = identification(currentQuestion);
                        break;
                    case "multiple-choice":
                        questionWrapper = (multipleChoice(currentQuestion));
                        break;
                }
            }
            questionNumber.value = currentIndex + 1;
            console.log(currentIndex);
        }
    });

    previousQuestion.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            alert("question index out of bounds: " + currentIndex);
            currentIndex++;
        }
        else {
            removeAllChildNodes(questionWrapper);
            if (currentIndex < 0 || currentIndex > questions.length - 1) {
                alert("question index out of bounds: " + currentIndex);
            }

            else if (currentIndex >= 0 && currentIndex < questions.length) {
                currentQuestion = questions[currentIndex];
                console.log(currentQuestion.type);
                switch (currentQuestion.type) {
                    case "identification":
                        questionWrapper = identification(currentQuestion);
                        break;
                    case "multiple-choice":
                        questionWrapper = (multipleChoice(currentQuestion), currentIndex);
                        break;
                }
            }
            questionNumber.value = currentIndex + 1;
            console.log(currentIndex);
        }
    });

    questionNumber.addEventListener("input", () => {
        currentIndex = questionNumber.value - 1;
        if (currentIndex >= 0 && currentIndex < questions.length) {
            currentQuestion = questions[currentIndex];
            console.log(currentQuestion.type);
            switch (currentQuestion.type) {
                case "identification":
                    questionWrapper = identification(currentQuestion);
                    break;
                case "multiple-choice":
                    questionWrapper = (multipleChoice(currentQuestion), currentIndex);
                    break;
            }
        }
    });
}

function multipleChoice(data, index) {
    let questionWrapper = document.getElementById("question-wrapper");
    removeAllChildNodes(questionWrapper);
    let label = document.createElement("label");
    label.className = "question";
    label.innerHTML = data.question;
    questionWrapper.appendChild(label);

    let inputWrapper = document.createElement("div");
    for (let i = 0; i < data.options.length; i++) {
        let inputDiv = document.createElement("div");
        inputDiv.className = "input";
        let input = document.createElement("input");
        input.type = "radio";
        input.name = `q${index++}`;
        input.value = data.options[i];

        let label = document.createElement('label');
        label.innerHTML = data.options[i];
        label.for = data.answer;
        inputDiv.appendChild(input);
        inputDiv.appendChild(label);
        inputWrapper.appendChild(inputDiv);
    }
    questionWrapper.appendChild(inputWrapper);
    console.log(questionWrapper);
    return questionWrapper;
}

function identification(data) {
    let questionWrapper = document.getElementById("question-wrapper");
    removeAllChildNodes(questionWrapper);
    let label = document.createElement('label');
    let input = document.createElement('input');
    label.innerHTML = data.question;
    input.type = "text";
    questionWrapper.appendChild(label);
    questionWrapper.appendChild(input);
    return questionWrapper;
}