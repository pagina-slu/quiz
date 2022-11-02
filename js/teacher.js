var scores = {};
var mainDiv = document.getElementById('main');
var logoutButton = document.getElementById('logout-button');
var questionsButton = document.getElementById('questions-button');
var responsesButton = document.getElementById('responses-button');
var categoryButton = document.getElementsByClassName('category-button');
var modal = document.getElementById('modal');
var closeModalButton = document.getElementById('close-modal-button');

const BUTTONS = document.querySelectorAll('#top-nav li');
BUTTONS.forEach(button => {
    button.addEventListener('click', () => {
        clearSelectedButtons();
        button.classList.add('selected');
    });
});

closeModalButton.addEventListener('click', () => {
    modal.classList.remove('is-visible');
});

logoutButton.addEventListener('click', () => {
    window.close();
});

responsesButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
    let container = document.createElement('div');
    container.classList.add('container');

    // Side buttons for categories
    let sideContainer = document.createElement('div');
    sideContainer.classList.add('side-container');

    // Right pane for statistics
    let rightPane = document.createElement('div');
    rightPane.classList.add('right-pane');
    rightPane.classList.add('respondents');

    // Button to clear all responses
    let rmAllResponse = document.createElement('button');
    rmAllResponse.classList.add('clr-btn-all');
    rmAllResponse.textContent = "Clear All Responses";
    rmAllResponse.addEventListener('click', () => {
        clearLocalStorage();
    })
    sideContainer.appendChild(rmAllResponse);

    // Create a button for each category
    categories.forEach(category => {
        let categoryButton = document.createElement('button');
        categoryButton.classList.add('category-button');
        categoryButton.textContent = category.name;

        categoryButton.addEventListener('click', () => {
            document.querySelectorAll('.category-button').forEach(cb => {
                cb.classList.remove('selected');
            });
            categoryButton.classList.add('selected');
            let hasResponse = false;
            removeAllChildNodes(container);
            scores = [];
            //for responses
            let responses = getResponsesForCategory(category.name);
            responses.forEach(response => {
                // Calculate scores
                scores[response.idNumber] = checkAnswers(response.answers, response.sequence, category.name);

                hasResponse = true;
                let quizWrapper = document.createElement('div');
                quizWrapper.classList.add('quiz-wrapper');
                let nameDiv = document.createElement('div');
                nameDiv.setAttribute('class', 'name-div');
                let scoreDiv = document.createElement('div'); // Div to store scores
                scoreDiv.setAttribute('class', 'score-div');

                scoreDiv.innerHTML = `<sup>${scores[response.idNumber]}</sup>/<sub>${response.sequence.length}</sub>`;

                let greenButton = document.createElement('button');
                greenButton.classList.add('green-button');
                greenButton.textContent = "Mark As Checked";
                if (response.isChecked == true) { // Adds classname 'clicked' to span and button if already checked
                    nameDiv.classList.add('clicked');
                    greenButton.classList.add('clicked');
                    greenButton.textContent = "Mark As Unchecked";
                }
                nameDiv.innerHTML = response.idNumber + "<br>" + response.name;
                let buttonWrapper = document.createElement('div');
                buttonWrapper.classList.add('button-wrapper');
                let viewButton = document.createElement('button');
                // View button
                viewButton.classList.add('purple-button');
                viewButton.textContent = "View";
                viewButton.addEventListener('click', () => {
                    let content = "";
                    let counter = 1;
                    response.sequence.forEach(seq => {
                        let answerIsCorrect = checkAnswer(response.answers[counter - 1], response.sequence[counter - 1], category.name);
                        content += `${counter}. ` +
                            "Question: " + questions[category.name][seq].question +
                            "<br> Type: " + questions[category.name][seq].type +
                            `<br> <span class=${answerIsCorrect ? "correct" : "wrong"} >Answer: ` + response.answers[counter - 1] + `</span>${answerIsCorrect ? "" : `<br><span class="correct">Correct Answer(s): ${questions[category.name][seq].answer}</span>`}<br><br>`;
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
                mainDiv.appendChild(rightPane);

            });
            // Checks if category has a response
            if (hasResponse == false) {
                let quizWrapper = document.createElement('div');
                quizWrapper.classList.add('quiz-wrapper');
                let nameDiv = document.createElement('span');
                nameDiv.classList.add('name-div');
                nameDiv.textContent = "No response available.";
                quizWrapper.appendChild(nameDiv);
                container.appendChild(quizWrapper);
                mainDiv.appendChild(container);
                mainDiv.appendChild(rightPane);
                rightPane.textContent = "No response for this category";
            } else {
                rightPane.textContent = "Total Number of Respondents: " + getNumberOfResponses(category.name) + "\r\n";
                rightPane.textContent += "Highest Score: " + getHighestScore(category.name) + "\r\n";
                rightPane.textContent += "Average Score: " + getAverageScore(category.name);

                // Button to view number of correct answers per question
                let seeMoreButton = document.createElement('button');
                seeMoreButton.classList.add('purple-button');
                seeMoreButton.textContent = "See More";
                seeMoreButton.addEventListener('click', () => {
                    let buttonText = seeMoreButton.textContent;
                    let seeMoreDiv = document.createElement('div');
                    seeMoreDiv.id = "see-more";
                    if (buttonText == "See More") {
                        let content = "Correct answers per question:\n";
                        let questionCount = questions[category.name].length;
                        let responsesCount = responses.length;

                        // Add statistics to content
                        for (let i = 0; i < questionCount; i++) {
                            let correctAnswerCount = getCorrectAnswersCount(category.name, i);
                            content += `${(`Question ${i + 1}:`).padEnd(13)} ${correctAnswerCount.toString().padStart(3)} / ${responsesCount}, ${(correctAnswerCount / responsesCount * 100).toString().padStart(3)}%\n`;
                        }

                        seeMoreDiv.textContent = content;

                        rightPane.appendChild(seeMoreDiv);
                        seeMoreButton.textContent = "Hide";
                    }
                    else if (buttonText == "Hide") {
                        rightPane.removeChild(document.getElementById('see-more'));                        
                        seeMoreButton.textContent = "See More";
                    }
                });

                rightPane.appendChild(seeMoreButton);
            }

            //button: clear response for this category 
            let rmCategoryResponse = document.createElement('button');
            rmCategoryResponse.classList.add('clr-btn-category');
            rmCategoryResponse.textContent = "Clear Responses For This Category";
            rmCategoryResponse.addEventListener('click', () => {
                clearCategoryResponses(category.name);
            });
            container.appendChild(rmCategoryResponse);
        })

        sideContainer.appendChild(categoryButton);
        mainDiv.appendChild(sideContainer);
        var catButts = document.querySelectorAll(".category-button");
        catButts[0].click();
        catButts[0].focus();
    })
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

// Functions
function clearSelectedButtons() {
    BUTTONS.forEach(button => {
        button.classList.remove('selected');
    });
}

function setModalContent(header, content) {
    document.querySelector('.modal-header span').innerHTML = header;
    document.querySelector('.modal-content').innerHTML = content;
}

function openModal() {
    modal.classList.add('is-visible');
}

function clearCategoryResponses(category) {
    let responses = getResponses();
    let toRemove = [];
    for (let i = 0; i < responses.length; i++) {
        let response = responses[i];
        if (response.category == category) {
            toRemove.push(i);
        }
    }
    toRemove.forEach(num => {
        delete responses[num];
    })
    responses = removeNullValues(responses);
    localStorage.setItem('responses', JSON.stringify(responses));
}

function removeNullValues(array) {
    return array.filter(el => el != null);
}

// Return the number of correct answers for a question
function getCorrectAnswersCount(category, questionNumber) {
    let question = questions[category][questionNumber];
    let count = 0;
    let responses = getResponsesForCategory(category);
    responses.forEach(response => {
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
        if (hasAnswer && checkAnswer(response.answers[index], questionNumber, category)) count++;
    });
    return count;
}

function getHighestScore(category) {
    let responses = getResponsesForCategory(category);
    scores = [];
    counter = [];
    responses.forEach(response => {
        counter.push(scores[response.idNumber] = checkAnswers(response.answers, response.sequence, category));
    });
    return Math.max.apply(null, counter);
}

function getAverageScore(category) {
    let responses = getResponsesForCategory(category);
    scores = [];
    counter = [];
    let sum = 0;
    responses.forEach(response => {

        counter.push(scores[response.idNumber] = checkAnswers(response.answers, response.sequence, category));

    })
    counter.forEach((num) => { sum += num });
    average = sum / counter.length;
    return average.toFixed(2);
}

function getNumberOfResponses(category) {
    let responses = getResponsesForCategory(category);
    return responses.length;
}

function getTotalNumberOfResponses() {
    return getResponses().length;
}

// Returns true if the answer is correct, and false if not
function checkAnswer(studentAnswer, questionNumber, category) {
    let currentQuestions = questions[category];
    console.log(currentQuestions);
    let currentQuestion = currentQuestions[questionNumber];
    let correctAnswer = currentQuestion.answer;
    let correct = false;

    if (Array.isArray(correctAnswer) && correctAnswer.length > 1) {
        let stop = false;
        correctAnswer.forEach(answer => {
            answer = answer.toLowerCase();
            if (answer == studentAnswer.toLowerCase() && !stop) {
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

// Checks the number of correct answers
function checkAnswers(answers, sequence, category) {
    let counter = 0;
    for (let i = 0; i < sequence.length; i++) {
        if (checkAnswer(answers[i], sequence[i], category)) counter++;
    }
    return counter;
}