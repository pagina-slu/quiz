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

const questions = readJSONfile("../res/questions.json");

console.log(questions)


// Fetch data from json file
fetch('./res/webtech.json')
.then(function (response) {
    return response.json();
})
.then(function (data) {
    appendData(data);
})
.catch(function (err) {
    console.log('error: ' + err);
});


function appendDataMultipleChoice(data) {
var mainContainer = document.getElementById(""); //Insert id for multple questions
    for (var i = 0; i < data.length; i++) {
        let div = document.createElement("h1");
        if (data[i].type ==="multiple-choice") {
            div.innerHTML = data[i].question;
            mainContainer.appendChild(div);
            for (let index = 0; index < data[i].options.length; index++) {

                let radiobox = document.createElement('input');
                let label = document.createElement('label');
                radiobox.type = 'radio';
                radiobox.innerHTML = data[i].options[index];
                label.innerHTML = data[i].options[index]
                let newline = document.createElement('br');
                mainContainer.appendChild(label);
                mainContainer.appendChild(radiobox);
                mainContainer.appendChild(newline);
            }
        }
    }
  }