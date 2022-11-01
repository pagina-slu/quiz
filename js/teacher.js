let scores = {};
const BUTTONS = document.querySelectorAll('#top-nav li');
BUTTONS.forEach(button => {
    button.addEventListener('click', () => {
        clearSelected();
        button.classList.add('selected');
    });
});

function clearSelected() {
    BUTTONS.forEach(button => {
        button.classList.remove('selected');
    });
}

console.log(questions);

let mainDiv = document.getElementById('main');
let questionsButton = document.getElementById('questions-button');
let responsesButton = document.getElementById('responses-button');
let categoryButton = document.getElementsByClassName('category-button');

let modal = document.getElementById('modal');
let closeModalButton = document.getElementById('close-modal-button');
closeModalButton.addEventListener('click', () => {
    modal.classList.remove('is-visible');
});

questionsButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
    let container = document.createElement('div');
    container.classList.add('container');
    categories.forEach(category => {
        let quizWrapper = document.createElement('div');
        quizWrapper.classList.add('quiz-wrapper');
        let categorySpan = document.createElement('div');
        categorySpan.setAttribute('class', 'name-div');
        categorySpan.textContent = category.name;
        let buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper');
        let viewButton = document.createElement('button');
        viewButton.classList.add('green-button');
        viewButton.textContent = "View";
        viewButton.addEventListener('click', () => {
            let content = "";
            let counter = 1;
            questions[category.name].forEach(question => {
                console.log(question);
                content += `${counter}. ${question.question}<br>Type: ${question.type}${question.type == 'multiple-choice' ? `<br>Choices: ${question.options}` : ""}<br>Answer: ${question.answer}<br><br>`;
                counter++;
            })
            setModalContent(category.name, content);
            openModal();
        });
        buttonWrapper.appendChild(viewButton);
        quizWrapper.appendChild(categorySpan);
        quizWrapper.appendChild(buttonWrapper);

        container.appendChild(quizWrapper);
        mainDiv.appendChild(container);
    });
});

function setModalContent(header, content) {
    document.querySelector('.modal-header span').innerHTML = header;
    document.querySelector('.modal-content').innerHTML = content;
}


function openModal() {
    modal.classList.add('is-visible');
}

responsesButton.addEventListener('click', () => {
    var responses = getResponses();
    removeAllChildNodes(mainDiv);
    let container = document.createElement('div');
    container.classList.add('container');

    //side buttons for categories
    let sideContainer = document.createElement('div');
    sideContainer.classList.add('side-container');
    categories.forEach(category => {
        let categoryButton = document.createElement('button');
        categoryButton.classList.add('category-button');
        categoryButton.textContent = category.name;

        categoryButton.addEventListener('click', () => {
            let hasResponse = false;
            removeAllChildNodes(container);
            scores = [];
            //for responses
            responses.forEach(response => {
                if (response.category == category.name) {
                    // Calculate scores
                    scores[response.idNumber] = checkAnswers(response.answers, response.sequence, category.name);

                    hasResponse = true;
                    let quizWrapper = document.createElement('div');
                    quizWrapper.classList.add('quiz-wrapper');
                    let nameDiv = document.createElement('div');
                    nameDiv.setAttribute('class', 'name-div');
                    let scoreDiv = document.createElement('div'); // div to store scores
                    scoreDiv.setAttribute('class', 'score-div');

                    scoreDiv.innerHTML = `<sup>${scores[response.idNumber]}</sup>/<sub>${response.sequence.length}</sub>`;

                    let greenButton = document.createElement('button');
                    greenButton.classList.add('green-button');
                    greenButton.textContent = "Mark As Checked";
                    if (response.isChecked == true) { //adds classname 'clicked' to span and button if already checked
                        nameDiv.classList.add('clicked');
                        greenButton.classList.add('clicked');
                        greenButton.textContent = "Mark As Unchecked";
                    }
                    nameDiv.innerHTML = response.idNumber + "<br>" + response.name;
                    let buttonWrapper = document.createElement('div');
                    buttonWrapper.classList.add('button-wrapper');
                    let viewButton = document.createElement('button');
                    //view button
                    viewButton.classList.add('purple-button');
                    viewButton.textContent = "View";
                    viewButton.addEventListener('click', () => {
                        console.log(response);
                        let content = "";
                        let counter = 1;
                        response.sequence.forEach(seq => {
                            content += `${counter}. ` +
                                "Question: " + questions[category.name][seq].question +
                                "<br> Type: " + questions[category.name][seq].type +
                                `<br> <span class=${checkAnswer(response.answers[counter - 1], response.sequence[counter - 1], category.name) ? "correct" : "wrong"} >Answer: ` + response.answers[counter - 1] +"</span><br><br>";
                            counter++;
                        });

                        //ALL QUESTIONS (DONT DELETE SALAMAT)
                        // questions[category.name].forEach(question=>{
                        //     var ans = " "
                        //     console.log(response);
                        //     content+=`${counter}. `+
                        //         "Question: "+question.question+
                        //         "<br> Type: "+question.type+
                        //         "<br> Answer: "+
                        //         "<br><br>";
                        //     counter++;
                        // })
                        setModalContent(category.name, content);
                        openModal();
                    });

                    greenButton.addEventListener('click', () => {
                        if (greenButton.className == 'green-button') {
                            greenButton.textContent = "Mark As Unchecked";
                            nameDiv.classList.add('clicked');
                            greenButton.classList.add('clicked');
                            response.isChecked = true;
                            localStorage.setItem('responses', JSON.stringify(responses));
                        } else {
                            greenButton.textContent = "Mark As Checked";
                            nameDiv.classList.remove('clicked');
                            greenButton.classList.remove('clicked');
                            response.isChecked = false;
                            localStorage.setItem('responses', JSON.stringify(responses));
                        }
                    });

                    buttonWrapper.appendChild(viewButton);
                    buttonWrapper.appendChild(greenButton);
                    quizWrapper.appendChild(nameDiv);
                    quizWrapper.appendChild(scoreDiv);
                    quizWrapper.appendChild(buttonWrapper);
                    container.appendChild(quizWrapper);
                    mainDiv.appendChild(container);
                }
            });
            //checks if category has a response
            if (hasResponse == false) {
                let quizWrapper = document.createElement('div');
                quizWrapper.classList.add('quiz-wrapper');
                let nameDiv = document.createElement('span');
                nameDiv.classList.add('name-div');
                nameDiv.textContent = "No response available.";
                quizWrapper.appendChild(nameDiv);
                container.appendChild(quizWrapper);
                mainDiv.appendChild(container);
            }
            //clear buttons
            let rmCategoryResponse = document.createElement('clear-category-btn');
            rmCategoryResponse.textContent = "clear response for this category";
            container.appendChild(rmCategoryResponse);
        })

        sideContainer.appendChild(categoryButton);
        mainDiv.appendChild(sideContainer);
        var catButts = document.querySelectorAll(".category-button");
        catButts[0].click();
        catButts[0].focus();
    })
    
});

// Return the number of correct answers for a question
function getCorrectAnswersCount(category, questionNumber) {
    let question = questions[category][questionNumber];
    let count = 0;
    let responses = getResponses();
    responses.forEach(response => {
        if (response.category == category) {
            let sequence = response.sequence;
            let index = 0;
            // Get index of answer based on sequence
            let hasAnswer = false; // To avoid errors when question is not yet answered
            sequence.every(s => {
                if (s == questionNumber) {
                    hasAnswer = true;
                    return false;
                }
                index++;
                return true;
            });
            if (hasAnswer && response.answers[index].toLowerCase() == question.answer.toLowerCase()) count++;
        };
    });
    return count;
}

// Example: getCorrectAnswersCount("Applications Development", 18);

function getNumberOfResponses(category) {
    let responses = getResponses();
    let count = 0;
    responses.forEach(response => {
        if (response.category == category) count++;
    });
    return count;
}

function getTotalNumberOfResponses() {
    return getResponses().length;
}

function checkAnswer(studentAnswer, questionNumber, category) {
    let currentQuestions = questions[category];
    let currentQuestion = currentQuestions[questionNumber];
    let correctAnswer = currentQuestion.answer;
    let correct = false;
    if (Array.isArray(correctAnswer) && correctAnswer.length > 1) {
        let stop = false;
        correctAnswer.forEach(answer => {
            answer = answer.toLowerCase();
            if (answer == studentAnswer.toLowerCase() && !stop){
                stop = true;
                correct = true;
            }
        });
    }
    else if (correctAnswer.toLowerCase() == studentAnswer.toLowerCase()) {
        correct = true;
    }
    return correct;
}

// Checks the answer, converts the answer of the user and the correct answer to lowercase and returns the number of correct answers
function checkAnswers(answers, sequence, category) {
    let counter = 0;
    for (let i = 0; i < sequence.length; i++) {
        if (checkAnswer(answers[i], sequence[i], category)) counter++;
    }
    return counter;
}
// console.log(getNumberOfResponses("Applications Development"))
// console.log(getTotalNumberOfResponses());