function displayQuiz() {
    getData();
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

const questions = readJSONfile("../res/webtech.json");

console.log(questions)

let previousQuestion = document.getElementById("previous-button");
let nextQuestion = document.getElementById("next-button");

let currentIndex = 0;
let currentQuestion = questions[currentIndex];
let questionWrapper = document.getElementById("question-wrapper");


nextQuestion.addEventListener("click", () => {
    currentIndex++;
    console.log(currentIndex);
    removeAllChildNodes(questionWrapper);
    currentQuestion = questions[currentIndex];
    if(currentIndex<questions.length){
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
    console.log("new index= "+currentIndex);
});

previousQuestion.addEventListener("click", () => {
    removeAllChildNodes(questionWrapper);
    currentIndex--;
    console.log(currentIndex);
    if(currentIndex>=0 && currentIndex<questions.length){
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
    console.log("new index= "+currentIndex);
});

function multipleChoice(data, index) {
    let questionWrapper = document.getElementById("question-wrapper");
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

function identification(data){
  let questionWrapper = document.getElementById("question-wrapper");
  let label = document.createElement('label');
  let input = document.createElement('input');
  label.innerHTML = data.question;
  input.type = "text";
  questionWrapper.appendChild(label);
  questionWrapper.appendChild(input);
  return questionWrapper;
}