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