var scores = [];
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
    closeModal();
});

logoutButton.addEventListener('click', () => {
    window.close();
});

responsesButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
    let container = createDiv('container');

    // Side buttons for categories
    let sideContainer = createDiv('side-container');


    // Right pane for statistics
    let rightPane = createDiv('right-pane');

    // Button to clear all responses
    let clearAllResponsesButton = createButton('clear-all', 'Clear All Responses')
    clearAllResponsesButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all responses?")) {
            clearLocalStorage();
            responsesButton.click();
        }
    });
    sideContainer.appendChild(clearAllResponsesButton);
    let categories = getClasses();
    // Create a button for each category
    categories.forEach(category => {

        let categoryButton = createButton('category-button', category.classDescription);
        categoryButton.addEventListener('click', () => {
            scores = calculateScores(category.classDescription);
            document.querySelectorAll('.category-button').forEach(cb => {
                cb.classList.remove('selected');
            });
            categoryButton.classList.add('selected');
            let hasResponse = false;
            removeAllChildNodes(container);
            let responses = getResponses();


            responses.forEach(response => {
                if (response.category != category.classDescription) {
                    return;
                }
                hasResponse = true;
                let quizWrapper = createDiv('quiz-wrapper');
                let nameDiv = createDiv('name-div') // Stores student name and ID number
                let scoreDiv = createDiv('score-div'); // Stores student score
                scoreDiv.innerHTML = `<sup>${scores[response.idNumber]}</sup>/<sub>${response.sequence.length}</sub>`;

                let greenButton = createButton('green-button', 'Mark As Checked');
                if (response.isChecked == true) { // Adds classname 'clicked' to span and button if already checked
                    nameDiv.classList.add('clicked');
                    greenButton.classList.add('clicked');
                    greenButton.textContent = "Mark As Unchecked";
                }
                nameDiv.innerHTML = response.idNumber + "<br>" + response.name;
                let buttonWrapper = createDiv('button-wrapper');
                let viewButton = createButton('purple-button', 'View');
                viewButton.addEventListener('click', () => {
                    let content = "";
                    let counter = 1;
                    // Adds all questions and answers to content variable
                    response.sequence.forEach(seq => {
                        let answerIsCorrect = checkAnswer(response.answers[counter - 1], response.sequence[counter - 1], category.classDescription);
                        content += `${counter}. ` +
                            "Question: " + questions[category.classDescription][seq].question +
                            "<br> Type: " + questions[category.classDescription][seq].type +
                            `<br> <span class=${answerIsCorrect ? "correct" : "wrong"} >Answer: ` + response.answers[counter - 1] + `</span>${answerIsCorrect ? "" : `<br><span class="correct">Correct Answer(s): ${questions[category.classDescription][seq].answer}</span>`}<br><br>`;
                        counter++;
                    });
                    setModalContent(category.classDescription, content);
                    openModal();
                });

                greenButton.addEventListener('click', () => {
                    if (greenButton.className == 'green-button') {
                        greenButton.textContent = "Mark As Unchecked";
                        response.isChecked = true;
                    } else {
                        greenButton.textContent = "Mark As Checked";
                        response.isChecked = false;
                    }
                    nameDiv.classList.toggle('clicked');
                    greenButton.classList.toggle('clicked');
                    storeResponses(responses);
                });

                buttonWrapper.appendChild(viewButton);
                buttonWrapper.appendChild(greenButton);
                quizWrapper.appendChild(nameDiv);
                quizWrapper.appendChild(scoreDiv);
                quizWrapper.appendChild(buttonWrapper);
                container.appendChild(quizWrapper);
            });

            // Checks if category has a response
            if (!hasResponse) {
                let quizWrapper = createDiv('quiz-wrapper');
                let nameDiv = document.createElement('span');
                nameDiv.classList.add('name-div');
                nameDiv.textContent = "No response available.";
                rightPane.textContent = "No response for this category";
                quizWrapper.appendChild(nameDiv);
                container.appendChild(quizWrapper);


            } else {
                let searchBar = createDiv('search-bar-div');
                let search = document.createElement('input');
                search.setAttribute('type', 'text');
                search.setAttribute('id', 'search-bar');
                search.setAttribute('placeholder', 'Search');
                let searchicon = document.createElement('img');
                searchicon.src = "res/images/searchicon.png";
                searchBar.appendChild(searchicon);
                searchBar.appendChild(search);
                search.addEventListener('keyup', () => {
                    let quizWrappers = document.querySelectorAll('.quiz-wrapper');
                    let searchkey = document.getElementById('search-bar').value.toLowerCase();
                    for (i = 0; i < responses.length; i++) {
                        if (responses[i].idNumber.indexOf(searchkey) > -1 || responses[i].name.toLowerCase().indexOf(searchkey) > -1) {
                            quizWrappers[i].style.display = 'flex';
                        } else {
                            quizWrappers[i].style.display = 'none';
                        }
                    }
                }
                )

                rightPane.textContent = "Total Number of Respondents: " + getNumberOfResponses(category.classDescription) + "\r\n";
                rightPane.textContent += "Highest Score: " + getHighestScore(scores) + "\r\n";
                rightPane.textContent += "Average Score: " + getAverageScore(scores);

                // Button to view number of correct answers per question
                let seeMoreButton = createButton('purple-button', 'See More');
                seeMoreButton.addEventListener('click', () => {
                    let buttonText = seeMoreButton.textContent;
                    let seeMoreDiv = document.createElement('div');
                    seeMoreDiv.id = "see-more";
                    if (buttonText == "See More") {
                        let content = "Correct answers per question:\n";
                        let questionCount = questions[category.classDescription].length;
                        let responsesCount = responses.length;

                        // Add statistics to content
                        for (let i = 0; i < questionCount; i++) {
                            let correctAnswerCount = getCorrectAnswersCount(category.classDescription, i);
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
                container.insertBefore(searchBar, container.firstChild);
                rightPane.appendChild(seeMoreButton);
            }
            // Button to clear responses for the specified category
            let clearCategoryResponsesButton = createButton('clear-category', 'Clear Responses For This Category');
            clearCategoryResponsesButton.addEventListener('click', () => {
                if (confirm("Are you sure you want to clear responses for this category?")) {
                    clearCategoryResponses(category.classDescription);
                    responsesButton.click();
                }
            });

            container.appendChild(clearCategoryResponsesButton);
        });

        sideContainer.appendChild(categoryButton);

        mainDiv.appendChild(sideContainer);
        mainDiv.appendChild(container);
        mainDiv.appendChild(rightPane);

        var catButts = document.querySelectorAll(".category-button");
        catButts[0].click();
        catButts[0].focus();
    })
});

questionsButton.addEventListener('click', async () => {
    removeAllChildNodes(mainDiv);
    let container = createDiv('container');
    // Side buttons for categories
    let sideContainer = createDiv('side-container');
    let classes = await getClasses();
    classes.forEach(_class => {
        let classButton = createButton('class-button', _class.classDescription);
        sideContainer.appendChild(classButton);
        classButton.addEventListener('click', async () => {
            document.querySelectorAll('.class-button').forEach(cb => {
                cb.classList.remove('selected');
            });
            classButton.classList.add('selected');
            removeAllChildNodes(container);
            let tests = await getTests(_class.classCode);
            tests.forEach(async test => {
                let classDescription = await getClassDescription(test.classCode);
                let questions = await getQuestions(test.classCode);
    
    
                let viewButton = createButton('green-button', 'View');
                viewButton.addEventListener('click', () => {
                    let content = "";
                    let counter = 1;
                    console.log(questions);
                    questions.forEach(question => {
                        content += `${counter}. ${question.question}<br>Type: ${question.type}${question.type == 'multiple-choice' ? `<br>Choices: ${question.options}` : ""}<br>Answer: ${question.answer}<br><br>`;
                        counter++;
                    });
                    setModalContent(test.classDescription, content);
                    openModal();
                });
    
                let addQuestionButton = createButton('green-button', 'Add Question');
                addQuestionButton.addEventListener('click', () => {
                    console.log(test);
                    let form = document.createElement('form');
                    form.setAttribute('method', 'post');
                    form.setAttribute('action', 'processing/new_question.php');
                    let questionLabel = createLabel('question', 'Question:');
                    let question = document.createElement('input');
                    question.setAttribute('type', 'text');
                    question.setAttribute('name', 'question');
                    let questionTypeLabel = createLabel('question-type', 'Question Type');
                    let questionType = document.createElement('select');
                    questionType.setAttribute('name', 'question-type');
                    let types = ['Identification', 'Multiple Choice', 'True or False'];
                    types.forEach(type => {
                        let option = document.createElement('option');
                        option.value = type;
                        option.textContent = type;
                        questionType.appendChild(option);
                    });
    
                    let submitButton = document.createElement('input');
                    submitButton.setAttribute('type', 'submit');
                    submitButton.setAttribute('value', 'Submit');
    
                    let testID = document.createElement('input');
                    testID.setAttribute('type', 'hidden');
                    testID.setAttribute('name', 'test-id');
                    testID.setAttribute('value', parseInt(test.id));
    
                    form.appendChild(testID);
                    form.appendChild(questionLabel);
                    form.appendChild(question);
                    form.appendChild(questionTypeLabel);
                    form.appendChild(questionType);
                    form.appendChild(submitButton);
                    setModalContent('Add new question', form);
                    openModal();
                });
                let testDetails = createDiv('test-details');
                let testName = createSpan('test-name', test.name);
                testDetails.appendChild(testName);
    
                let buttonWrapper = createDiv('button-wrapper');
                buttonWrapper.appendChild(viewButton);
                buttonWrapper.appendChild(addQuestionButton);
    
                let testWrapper = createDiv('test-wrapper');
                testWrapper.appendChild(testDetails);
                testWrapper.appendChild(buttonWrapper);
    
                container.appendChild(testWrapper);
            });
            let addTestButton = createButton('add-test-button', 'Add new test');
            addTestButton.addEventListener('click', async () => {
                let form = document.createElement('form');
                form.setAttribute('method', 'post');
                form.setAttribute('action', 'processing/new_test.php');
                let testNameLabel = createLabel('test-name', 'Test Name');
                let testName = document.createElement('input');
                testName.setAttribute('type', 'text');
                testName.setAttribute('name', 'test-name');
                testName.id = 'test-name';
                let testTypeLabel = createLabel('test-type', 'Test Type');
                let testType = document.createElement('input');
                testType.setAttribute('type', 'text');
                testType.setAttribute('name', 'test-type');
                testType.id = 'test-type';
                let classLabel = createLabel('class-code', 'Class');
                let classSelector = document.createElement('select');
                classSelector.setAttribute('name', 'class-code');
                let classes = await getClasses();
                classes.forEach(_class => {
                    let option = document.createElement('option');
                    option.value = _class.classCode;
                    option.textContent = _class.classDescription;
                    classSelector.appendChild(option);
                });
    
                let submitButton = document.createElement('input');
                submitButton.setAttribute('type', 'submit');
                submitButton.setAttribute('value', 'Submit');
    
                form.appendChild(testNameLabel);
                form.appendChild(testName);
                form.appendChild(testTypeLabel);
                form.appendChild(testType);
                form.appendChild(classLabel);
                form.appendChild(classSelector);
                form.appendChild(submitButton);
                setModalContent('Add new test', form);
                openModal();
            });
            container.appendChild(addTestButton);
        });
        
    });
    mainDiv.appendChild(sideContainer);
    mainDiv.appendChild(container);

    var classButtons = document.querySelectorAll(".class-button");
    classButtons[0].click();
    classButtons[0].focus();
});
function populateTests(classCode) {

}
// Functions
function createLabel(_for, content) {
    let label = document.createElement('label');
    label.htmlFor = _for;
    label.textContent = content;
    return label;
}

function createButton(_class, textContent) {
    let button = document.createElement('button');
    button.classList.add(_class);
    button.textContent = textContent;
    return button;
}

function clearSelectedButtons() {
    BUTTONS.forEach(button => {
        button.classList.remove('selected');
    });
}

function setModalContent(header, content) {
    $('.modal-header span').html(header);
    $('.modal-content').html(content);
}

function openModal() {
    modal.classList.add('is-visible');
}

function closeModal() {
    modal.classList.remove('is-visible');
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
    storeResponses(responses);
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

// Returns an array of scores, accessible through a given id number
function calculateScores(category) {
    let scores = [];
    let responses = getResponsesForCategory(category);
    responses.forEach(response => {
        scores[response.idNumber] = checkAnswers(response.answers, response.sequence, category);
    });
    return scores;
}

function getHighestScore(scores) {
    let counter = Object.values(scores)
    return Math.max.apply(null, counter);
}

function getAverageScore(scores) {
    let counter = Object.values(scores);
    let sum = 0;
    counter.forEach((num) => {
        sum += num
    });
    let average = sum / Object.keys(scores).length;
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

async function getClasses() {
    let classes = [];
    await $.ajax(
        {
            url: 'processing/get_all_classes.php',
            dataType: 'json',
            success: (c) => {
                classes = c;
            }
        });
    return classes;
}

async function getAllTests() {
    let tests = [];
    await $.ajax(
        {
            url: 'processing/get_all_tests.php',
            dataType: 'json',
            success: (t) => {
                tests = t;
            }
        });
    return tests;
}

async function getTests(classCode) {
    let tests = [];
    await $.ajax(
        {
            url: `processing/get_tests.php?classCode=${classCode}`,
            dataType: 'json',
            success: (t) => {
                tests = t;
            }
        });
    return tests;
}

async function getClassDescription(classCode) {
    let classDescription = "";
    await $.ajax(
        {
            url: `processing/get_class_description.php?classCode=${classCode}`,
            dataType: 'text',
            success: (cd) => {
                classDescription = cd.replace(/['"]+/g, "");;
            }
        });
    return classDescription;
}

async function getQuestions(classCode) {
    let questions = [];
    await $.ajax(`processing/get_questions.php?classCode=${classCode}`,
        {
            success: (q) => {
                questions = JSON.parse(q);
            }
        });
    return questions;
}