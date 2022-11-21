$(document).ready(async () => {
    let currentTest = await getCurrentTest();
    console.log(currentTest);
    let scores = [];
    let mainDiv = document.getElementById('main');
    let logoutButton = document.getElementById('logout-button');
    let questionsButton = document.getElementById('questions-button');
    let responsesButton = document.getElementById('responses-button');

    logoutButton.addEventListener('click', () => {
        resetSession();
    });

    responsesButton.addEventListener('click', async () => {
        document.getElementById("main").style.flexDirection = "row";
        console.log(mainDiv.style.display.flexDirection);
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');

        // Right pane for statistics
        let rightPane = createDiv('right-pane');

        scores = calculateScores(currentTest.name);
        document.querySelectorAll('.category-button').forEach(cb => {
            cb.classList.remove('selected');
        });

        let hasResponse = false;
        removeAllChildNodes(container);
        let responses = getResponses(currentTest.id);

        responses.forEach(response => {
            console.log(response);
            hasResponse = jQuery.isEmptyObject(responses);
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
                    /*
                    let answerIsCorrect = checkAnswer(response.answers[counter - 1], response.sequence[counter - 1], test.classDescription);
                    content += `${counter}. ` +
                        "Question: " + questions[currentTest.classDescription][seq].question +
                        "<br> Type: " + questions[currentTest.classDescription][seq].type +
                        `<br> <span class=${answerIsCorrect ? "correct" : "wrong"} >Answer: ` + response.answers[counter - 1] + `</span>${answerIsCorrect ? "" : `<br><span class="correct">Correct Answer(s): ${questions[test.classDescription][seq].answer}</span>`}<br><br>`;
                    counter++;
                    */
                });
                setModalContent(currentTest.classDescription, content);
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
            );

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


        mainDiv.appendChild(container);
        mainDiv.appendChild(rightPane);
    });


    questionsButton.addEventListener('click', async () => {
        document.getElementById("main").style.flexDirection = "column";
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');
        // Side buttons for categories
        document.querySelectorAll('.class-button').forEach(cb => {
            cb.classList.remove('selected');
        });
        removeAllChildNodes(container);

        let addQuestionButton = createButton('add-question-button', 'Add new question');
        addQuestionButton.addEventListener('click', () => {
            let questionWrapper = createDiv('question-wrapper');
            questionWrapper.appendChild(createNewQuestionForm(currentTest.id));
            container.appendChild(questionWrapper);
        });

        let saveChangesButton = createButton('save-changes-button', 'Save changes');
        mainDiv.appendChild(addQuestionButton);
        mainDiv.appendChild(saveChangesButton);

        let questions = await getQuestions(currentTest.testId);
        console.log(questions);
        questions.forEach(question => {
            let questionWrapper = createDiv('question-wrapper');
            questionWrapper.appendChild(createQuestionForm(question, currentTest.testId));
            container.appendChild(questionWrapper);
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

function createQuestionForm(q, id) {
    let form = document.createElement('form');
    let wrapper = createDiv('wrapper');
    let questionLabel = createLabel('question', 'Question:');
    let question = document.createElement('input');
    question.value = q.question;
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
    questionType.value = q.type;

    form.appendChild(createHiddenInput('question-id', null));
    form.appendChild(createHiddenInput('test-id', parseInt(id)));

    wrapper.appendChild(questionLabel);
    wrapper.appendChild(question);
    form.appendChild(wrapper);
    wrapper = createDiv('wrapper');
    wrapper.appendChild(questionTypeLabel);
    wrapper.appendChild(questionType);
    form.appendChild(wrapper);
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
            choice.value = q.choices[i];
            choices.push(choice);
            choicesDiv.appendChild(choice);
        }

        let answerLabel = createLabel('answer', 'Answer');
        let answers = document.createElement('select');
        answers.setAttribute('name', 'answer');
        choices.forEach(() => {
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
        answers.value = q.answer[0];

        let answersDiv = createDiv('answers-div');
        answersDiv.id = 'answers-div';
        answersDiv.appendChild(answerLabel);
        answersDiv.appendChild(answers);
        wrapper = createDiv('wrapper');
        wrapper.appendChild(choicesDiv);
        form.appendChild(wrapper);
        wrapper = createDiv('wrapper');
        wrapper.appendChild(answersDiv);
        form.appendChild(wrapper);
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
        answers.value = q.answer[0];

        let answersDiv = createDiv('answers-div');
        answersDiv.id = 'answers-div';
        answersDiv.appendChild(answerLabel);
        answersDiv.appendChild(answers);
        wrapper = createDiv('wrapper');
        wrapper.appendChild(answersDiv);
        form.appendChild(wrapper);
    }

    questionType.addEventListener('change', () => {
        if ($('#answers-div').length > 0) $('#answers-div').empty();
        if ($('#choices-div').length > 0) $('#choices-div').empty();
        console.log(questionType.value);
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
            wrapper = createDiv('wrapper');
            wrapper.appendChild(choicesDiv);
            form.appendChild(wrapper);
            wrapper = createDiv('wrapper');
            wrapper.appendChild(answersDiv);
            form.appendChild(wrapper);
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
            wrapper = createDiv('wrapper');
            wrapper.appendChild(answersDiv);
            form.appendChild(wrapper);
        }
    })

    return form;
}

function createNewQuestionForm(id) {
    let form = document.createElement('form');
    let wrapper = createDiv('wrapper');
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

    /*
    let submitButton = document.createElement('button');
    submitButton.textContent = "Submit";
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        form = form.serialize();
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
    */

    questionType.addEventListener('change', () => {
        if ($('#answers-div').length > 0) $('#answers-div').empty();
        if ($('#choices-div').length > 0) $('#choices-div').empty();
        console.log(questionType.value);
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
            wrapper = createDiv('wrapper');
            wrapper.appendChild(choicesDiv);
            form.appendChild(wrapper);
            wrapper = createDiv('wrapper');
            wrapper.appendChild(answersDiv);
            form.appendChild(wrapper);
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
            wrapper = createDiv('wrapper');
            wrapper.appendChild(answersDiv);
            form.appendChild(wrapper);
        }
    })
    form.appendChild(createHiddenInput('question-id', null));
    form.appendChild(createHiddenInput('test-id', parseInt(id)));

    wrapper.appendChild(questionLabel);
    wrapper.appendChild(question);
    form.appendChild(wrapper);
    wrapper = createDiv('wrapper');
    wrapper.appendChild(questionTypeLabel);
    wrapper.appendChild(questionType);
    form.appendChild(wrapper);
    // form.appendChild(submitButton);

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