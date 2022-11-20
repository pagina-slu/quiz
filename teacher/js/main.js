$(document).ready(async () => {
    let currentClass = (await getCurrentClass());

    let scores = [];
    let mainDiv = document.getElementById('main');
    let logoutButton = document.getElementById('logout-button');
    let testsButton = document.getElementById('tests-button');
    let responsesButton = document.getElementById('responses-button');

    logoutButton.addEventListener('click', () => {
        window.close();
    });

    responsesButton.addEventListener('click', async () => {
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');

        // Side buttons for categories
        let sideContainer = createDiv('side-container');

        // Right pane for statistics
        let rightPane = createDiv('right-pane');

        let tests = await getTests(currentClass.classCode);
        // Create a button for each category
        tests.forEach(test => {
            console.log(test);
            let testButton = createButton('category-button', test.name);
            testButton.addEventListener('click', () => {
                scores = calculateScores(test.name);
                document.querySelectorAll('.category-button').forEach(cb => {
                    cb.classList.remove('selected');
                });
                testButton.classList.add('selected');
                let hasResponse = false;
                removeAllChildNodes(container);
                let responses = getResponses();

                responses.forEach(response => {
                    console.log(response);
                    if (response.category != test.classDescription) {
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
                        // Adds all questions and answers to content letiable
                        response.sequence.forEach(seq => {
                            let answerIsCorrect = checkAnswer(response.answers[counter - 1], response.sequence[counter - 1], test.classDescription);
                            content += `${counter}. ` +
                                "Question: " + questions[test.classDescription][seq].question +
                                "<br> Type: " + questions[test.classDescription][seq].type +
                                `<br> <span class=${answerIsCorrect ? "correct" : "wrong"} >Answer: ` + response.answers[counter - 1] + `</span>${answerIsCorrect ? "" : `<br><span class="correct">Correct Answer(s): ${questions[test.classDescription][seq].answer}</span>`}<br><br>`;
                            counter++;
                        });
                        setModalContent(test.classDescription, content);
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

                    rightPane.textContent = "Total Number of Respondents: " + getNumberOfResponses(test.classDescription) + "\r\n";
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
                            let questionCount = questions[test.classDescription].length;
                            let responsesCount = responses.length;

                            // Add statistics to content
                            for (let i = 0; i < questionCount; i++) {
                                let correctAnswerCount = getCorrectAnswersCount(test.classDescription, i);
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
                        clearCategoryResponses(test.classDescription);
                        responsesButton.click();
                    }
                });

                container.appendChild(clearCategoryResponsesButton);
            });

            sideContainer.appendChild(testButton);

            mainDiv.appendChild(sideContainer);
            mainDiv.appendChild(container);
            mainDiv.appendChild(rightPane);
        });
        let catButts = document.querySelectorAll(".category-button");
        catButts[0].click();
        catButts[0].focus();
    });

    testsButton.addEventListener('click', async () => {
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');
        // Side buttons for categories
        document.querySelectorAll('.class-button').forEach(cb => {
            cb.classList.remove('selected');
        });
        removeAllChildNodes(container);

        let tests = await getTests(currentClass.classCode);

        let addTestButton = createButton('add-test-button', 'Add new test');
        addTestButton.addEventListener('click', () => {
            setModalContent('Add new test', createNewTestForm(currentClass.classCode));
            openModal();
        });
        container.appendChild(addTestButton);

        tests.forEach(async test => {
            console.log(test);
            let questions = await getQuestions(test.id);

            let viewButton = createButton('green-button', 'View');
            viewButton.addEventListener('click', () => {
                let content = "";
                let counter = 1;
                console.log(questions);
                questions.forEach(question => {
                    content += `${counter}. ${question.question}<br>Type: ${question.type}${question.type == 'multiple-choice' ? `<br>Choices: ${question.choices}` : ""}<br>Answer: ${question.answer}<br><br>`;
                    counter++;
                });
                setModalContent(currentClass.classDescription, content);
                openModal();
            });

            let addQuestionButton = createButton('green-button', 'Add Question');
            addQuestionButton.addEventListener('click', () => {
                setModalContent('Add new question', createNewQuestionForm(test.id));
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

        mainDiv.appendChild(container);
    });
});

const BUTTONS = document.querySelectorAll('#top-nav li');
BUTTONS.forEach(button => {
    button.addEventListener('click', () => {
        clearSelectedButtons();
        button.classList.add('selected');
    });
});

function createNewTestForm(classCode) {
    let form = document.createElement('form');
    form.id = 'new-test-form';
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

    let submitButton = document.createElement('button');
    submitButton.textContent = "Submit";
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        let form = $('#new-test-form').serialize();
        console.log(form);
        $.ajax({
            type: 'POST',
            url: 'processing/new_test.php',
            data: form,
            dataType: 'text',
            success: () => {
                closeModal();
            }
        })
    });

    form.appendChild(createHiddenInput('class-code', classCode));
    form.appendChild(testNameLabel);
    form.appendChild(testName);
    form.appendChild(testTypeLabel);
    form.appendChild(testType);
    form.appendChild(submitButton);

    return form;
}

function createNewQuestionForm(id) {
    let form = document.createElement('form');
    form.id = 'new-question-form';
    let questionLabel = createLabel('question', 'Question:');
    let question = document.createElement('input');
    question.setAttribute('type', 'text');
    question.setAttribute('name', 'question');
    let questionTypeLabel = createLabel('question-type', 'Question Type');
    let questionType = document.createElement('select');
    questionType.setAttribute('name', 'question-type');
    let types = ['identification', 'multiple-choice', 'true-or-false'];
    types.forEach(type => {
        let option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        questionType.appendChild(option);
    });

    let submitButton = document.createElement('button');
    submitButton.textContent = "Submit";
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        let form = $('#new-question-form').serialize();
        console.log(form);
        $.ajax({
            type: 'POST',
            url: 'processing/new_question.php',
            data: form,
            dataType: 'text',
            success: () => {
                closeModal();
            }
        })
    });

    questionType.addEventListener('change', () => {
        if ($('#answers-div').length > 0) $('#answers-div').empty();
        if ($('#choices-div').length > 0) $('#choices-div').empty();

        if (questionType.value == 'multiple-choice') {
            let choicesLabel = createLabel('choices', 'Choices');

            let choicesDiv = createDiv('choices-div');
            choicesDiv.id = 'choices-div';
            choicesDiv.appendChild(choicesLabel);
            let choices = [];
            for (let i = 0; i < 4; i++) {
                let choice = document.createElement('input');
                choice.setAttribute('type', 'text');
                choice.setAttribute('name', 'choices[]');
                choices.push(choice);
                choicesDiv.appendChild(choice);
            }

            let answerLabel = createLabel('answer', 'Answer');
            let answers = document.createElement('select');
            answers.setAttribute('name', 'answer');

            choices.forEach(choiceInput => {
                choiceInput.addEventListener('input', () => {
                    removeAllChildNodes(answers);
                    let values = [];
                    choices.forEach(ci => {
                        values.push(ci.value);
                    });
                    values.forEach(choice => {
                        let c = document.createElement('option');
                        c.value = choice;
                        c.textContent = choice;
                        answers.appendChild(c);
                    });
                });
            });

            let answersDiv = createDiv('answers-div');
            answersDiv.id = 'answers-div';
            answersDiv.appendChild(answerLabel);
            answersDiv.appendChild(answers);

            form.insertBefore(choicesDiv, submitButton);
            form.insertBefore(answersDiv, submitButton);
        } else if (questionType.value == 'true-or-false') {
            let answerLabel = createLabel('answer', 'Answer');
            let answers = document.createElement('select');
            answers.setAttribute('name', 'answer');
            ['True', 'False'].forEach(choice => {
                let c = document.createElement('option');
                c.value = choice;
                c.textContent = choice;
                answers.appendChild(c);
            });

            let answersDiv = createDiv('answers-div');
            answersDiv.id = 'answers-div';
            answersDiv.appendChild(answerLabel);
            answersDiv.appendChild(answers);
            form.insertBefore(answersDiv, submitButton);
        }
    })

    form.appendChild(createHiddenInput('test-id', parseInt(id)));
    form.appendChild(questionLabel);
    form.appendChild(question);
    form.appendChild(questionTypeLabel);
    form.appendChild(questionType);
    form.appendChild(submitButton);

    return form;
}

// Functions
function clearSelectedButtons() {
    BUTTONS.forEach(button => {
        button.classList.remove('selected');
    });
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