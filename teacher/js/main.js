$(document).ready(async () => {
    let currentTest = await getCurrentTest();
    console.log(currentTest);
    let totalPoints = await getTotalPoints(currentTest.testId);
    let questions = await getQuestions(currentTest.testId);
    console.log(questions);
    let mainDiv = document.getElementById('main');
    let questionsButton = document.getElementById('questions-button');
    let responsesButton = document.getElementById('responses-button');
    let schedulesButton = document.getElementById('schedules-button');


    responsesButton.addEventListener('click', async () => {
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');
        document.querySelectorAll('.category-button').forEach(cb => {
            cb.classList.remove('selected');
        });

        let hasResponse = false;
        removeAllChildNodes(container);
        let responses = await getResponses(currentTest.testId);

        responses.forEach(async response => {
            console.log(response);
            let student = await getStudent(response.student_id);
            hasResponse = jQuery.isEmptyObject(responses);
            let responseWrapper = createDiv('response-wrapper');
            let nameDiv = createDiv('name-div') // Stores student name and ID number
            let scoreDiv = createDiv('score-div'); // Stores student score
            scoreDiv.innerHTML = `<sup>${response.score}</sup>/<sub>${totalPoints}</sub>`;

            let greenButton = createButton('green-button', 'Mark As Checked');
            if (response.isChecked == true) { // Adds classname 'clicked' to span and button if already checked
                nameDiv.classList.add('clicked');
                greenButton.classList.add('clicked');
                greenButton.textContent = "Mark As Unchecked";
            }
            nameDiv.innerHTML = response.student_id + "<br>" + student.f_name + " " + student.l_name;
            let buttonWrapper = createDiv('button-wrapper');
            let viewButton = createButton('purple-button', 'View');

            viewButton.addEventListener('click', async () => {
                let content = "";
                let counter = 1;
                let responseDetails = await getResponseDetails(response.id);
                console.log(responseDetails);
                // Adds all questions and answers to content letiable
                responseDetails.forEach(res => {

                    let answerIsCorrect = checkAnswer(res.answer, questions[counter - 1].answer);
                    content += `${counter}. ` +
                        "Question: " + questions[counter - 1].question +
                        "<br> Type: " + questions[counter - 1].type +
                        `<br> <span class=${answerIsCorrect ? "correct" : "wrong"} >Answer: ` + res.answer + `</span>
                                ${answerIsCorrect ? "" :
                            `<br><span class="correct">Correct Answer(s): ${questions[counter - 1].answer}</span>`}<br><br>`;
                    counter++;

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
            responseWrapper.appendChild(nameDiv);
            responseWrapper.appendChild(scoreDiv);
            responseWrapper.appendChild(buttonWrapper);
            container.appendChild(responseWrapper);
        });

        // Checks if category has a response
        if (hasResponse) {
            let responseWrapper = createDiv('response-wrapper');
            let nameDiv = document.createElement('span');
            nameDiv.classList.add('name-div');
            nameDiv.textContent = "No response available.";
            responseWrapper.appendChild(nameDiv);
            container.appendChild(responseWrapper);
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
                let responseWrappers = document.querySelectorAll('.response-wrapper');
                let searchkey = document.getElementById('search-bar').value.toLowerCase();
                for (i = 0; i < responses.length; i++) {
                    if (responses[i].student_id.indexOf(searchkey) > -1 || responses[i].name.toLowerCase().indexOf(searchkey) > -1) {
                        responseWrappers[i].style.display = 'flex';
                    } else {
                        responseWrappers[i].style.display = 'none';
                    }
                }
            }
            );
            container.insertBefore(searchBar, container.firstChild);
            // Button to clear responses for the specified category
            let clearCategoryResponsesButton = createButton('clear-category', 'Clear Responses For This Category');
            clearCategoryResponsesButton.addEventListener('click', () => {
                if (confirm("Are you sure you want to clear responses for this category?")) {
                    clearCategoryResponses(test.classDescription);
                    responsesButton.click();
                }
            });
            container.appendChild(clearCategoryResponsesButton);
        }

        mainDiv.appendChild(container);
    });

    questionsButton.addEventListener('click', async () => {
        questions = await getQuestions(currentTest.testId);
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');
        let forms = [];

        document.querySelectorAll('.class-button').forEach(cb => {
            cb.classList.remove('selected');
        });
        removeAllChildNodes(container);

        let addQuestionButton = createButton('add-question-button', 'Add new question');
        addQuestionButton.addEventListener('click', () => {
            console.log(currentTest);
            let questionWrapper = createDiv('question-wrapper');
            let form = createQuestionForm(createBlankQuestion(), currentTest.testId);
            forms.push(form);
            questionWrapper.appendChild(form);
            container.appendChild(questionWrapper);
        });

        let saveChangesButton = createButton('save-changes-button', 'Save changes');
        saveChangesButton.addEventListener('click', () => {
            console.log(forms);
            forms.forEach(form => {
                // Convert to jQuery object for serialize function
                form = $(form);
                let formArray = form.serializeArray();
                let isNew = false;
                let willDelete = false;
                let questionId = null;
                // Check if current form contains a new question or not
                formArray.forEach(data => {
                    if (data.name == 'questionId') {
                        isNew = data.value == 'null' || data.value == 'undefined';
                        questionId = parseInt(data.value);
                    }
                    if (data.name == 'delete') {
                        willDelete = data.value == 'true';
                    }
                });

                if (isNew) {
                    // Add new question to database
                    $.ajax({
                        type: 'POST',
                        url: 'processing/new_question.php',
                        data: form.serialize(),
                        dataType: 'text',
                        success: (r) => {
                            console.log("Added new question.");
                        }
                    });
                } else {
                    // Delete question
                    if (willDelete) {
                        deleteQuestion(questionId);
                    } else {
                        console.log(form.serialize());
                        // Update question
                        $.ajax({
                            type: 'POST',
                            url: 'processing/update_question.php',
                            data: form.serialize(),
                            dataType: 'text',
                            success: (r) => {
                                //console.log(r);
                                console.log("Updated question.");
                            }
                        });
                    }

                }

                console.log(JSON.stringify(form.serialize()));
            })
        });

        questions.forEach(question => {
            let questionWrapper = createDiv('question-wrapper');
            let form = createQuestionForm(question, currentTest.testId);
            forms.push(form);
            questionWrapper.appendChild(form);
            container.appendChild(questionWrapper);
        });

        mainDiv.appendChild(addQuestionButton);
        mainDiv.appendChild(saveChangesButton);
        mainDiv.appendChild(container);
    });

    schedulesButton.addEventListener('click', async () => {
        removeAllChildNodes(mainDiv);
        let container = createDiv('container');
        let schedules = await getSchedules(currentTest.testId);
        let hasSchedule = false;

        schedules.forEach(schedule => {
            console.log(schedule);
            let s = new Date(schedule.open_date);
            console.log(s);
            hasSchedule = true;
            let scheduleWrapper = createDiv('schedule-wrapper');
            let scheduleDetails = document.createElement('span');
            scheduleDetails.classList.add('schedule-details');
            scheduleDetails.textContent = `${schedule.open_date} to ${schedule.close_date}`;
            scheduleWrapper.appendChild(scheduleDetails);
            container.appendChild(scheduleWrapper);
        });
        let addScheduleButton = createButton('add-schedule-button', 'Add new schedule');
        addScheduleButton.addEventListener('click', () => {
            setModalContent('Add new schedule', createScheduleForm(currentTest.testId));
            openModal();
        });

        if (!hasSchedule) {
            let scheduleWrapper = createDiv('schedule-wrapper');
            let scheduleDetails = document.createElement('span');
            scheduleDetails.classList.add('schedule-details');
            scheduleDetails.textContent = 'No schedule available.';

            scheduleWrapper.appendChild(scheduleDetails);
            container.appendChild(scheduleWrapper);
        }

        mainDiv.appendChild(addScheduleButton);
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

// Functions
function createBlankQuestion() {
    let question = [];
    question.question = '';
    question.type = 'identification';
    question.answer = [];
    question.answer[0] = '';
    return question;
}

function createQuestionForm(question, testId) {
    let form = document.createElement('form');

    let questionLabel = createLabel('question', 'Question:');
    let questionInput = document.createElement('input');
    questionInput.value = question.question;
    questionInput.setAttribute('type', 'text');
    questionInput.setAttribute('name', 'question');
    let questionTypeLabel = createLabel('questionType', 'Question Type');
    let questionType = document.createElement('select');
    questionType.setAttribute('name', 'questionType');
    let types = ['identification', 'multiple-choice', 'true-or-false'];
    types.forEach(type => {
        let option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        questionType.appendChild(option);
    });
    questionType.value = question.type;

    let willDelete = createHiddenInput('delete', false);
    form.appendChild(willDelete);
    form.appendChild(createHiddenInput('questionId', question.id));
    form.appendChild(createHiddenInput('testId', parseInt(testId)));

    let pointsLabel = createLabel('points', 'Points: ');
    let pointsInput = document.createElement('input');
    pointsInput.setAttribute('type', 'number');
    pointsInput.setAttribute('name', 'points');
    if (question.points) {
        pointsInput.value = question.points;
    } else {
        pointsInput.value = 1;
    }

    let deleteButton = document.createElement('img');
    deleteButton.src = 'images/delete.svg';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        form.parentElement.style.display = 'none';
        willDelete.value = true;
    });

    // Append points
    let rowWrapper = createDiv('wrapper');
    rowWrapper.classList.add('row');
    rowWrapper.style.justifyContent = 'space-between';
    let columnWrapper = createDiv('wrapper');
    columnWrapper.append(questionTypeLabel);
    columnWrapper.append(questionType);
    rowWrapper.appendChild(columnWrapper);

    // Append question type picker
    columnWrapper = createDiv('wrapper');
    columnWrapper.append(pointsLabel);
    columnWrapper.append(pointsInput);

    rowWrapper.appendChild(columnWrapper);

    // Append delete button
    columnWrapper = createDiv('wrapper');
    columnWrapper.append(deleteButton);
    rowWrapper.append(deleteButton);
    form.appendChild(rowWrapper);

    rowWrapper = createDiv('wrapper');
    rowWrapper.classList.add('row');
    columnWrapper.append(questionLabel);
    columnWrapper.append(questionInput);
    columnWrapper.style.flex = 1;
    rowWrapper.appendChild(columnWrapper);
    form.appendChild(rowWrapper);

    let wrapper = createDiv('wrapper');
    let answerLabel = createLabel('answer', 'Answer');
    let answers = document.createElement('select');
    let answersDiv = createDiv('answers-div');
    let choicesLabel = createLabel('choices', 'Choices');
    let choicesDiv = createDiv('choices-div');
    choicesDiv.id = 'choices-div';
    if (questionType.value == 'multiple-choice') {
        let choices = [];
        for (let i = 0; i < question.choices.length; i++) {
            let choice = document.createElement('input');
            choice.setAttribute('type', 'text');
            choice.setAttribute('name', 'choices[]');
            choice.value = question.choices[i];
            choices.push(choice);
            choicesDiv.appendChild(choice);
        }
        columnWrapper = createDiv('wrapper');
        columnWrapper.style.width = '100%';
        columnWrapper.style.alignItems = 'center';
        let addChoiceButton = createButton('add-choice-button', '+');
        addChoiceButton.setAttribute('type', 'button');
        addChoiceButton.addEventListener('click', () => {
            let choice = document.createElement('input');
            choice.setAttribute('type', 'text');
            choice.setAttribute('name', 'choices[]');
            choice.addEventListener('input', () => {
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
            choices.push(choice);
            choicesDiv.insertBefore(choice, addChoiceButton.parentElement);
        });
        columnWrapper.appendChild(addChoiceButton);
        choicesDiv.appendChild(columnWrapper);

        answers = document.createElement('select');
        answers.setAttribute('name', 'answer');
        choices.forEach(choiceInput => {
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
        answers.value = question.answer[0];

        answersDiv.appendChild(answerLabel);
        answersDiv.appendChild(answers);
        columnWrapper = createDiv('wrapper');
        columnWrapper.appendChild(choicesLabel);
        columnWrapper.appendChild(choicesDiv);
        wrapper.appendChild(columnWrapper);
        columnWrapper = createDiv('wrapper');
        columnWrapper.appendChild(answersDiv);
        wrapper.appendChild(columnWrapper);
    } else if (questionType.value == 'true-or-false') {
        answers = document.createElement('select');
        answers.setAttribute('name', 'answer');
        ['True', 'False'].forEach(choice => {
            let c = document.createElement('option');
            c.value = choice;
            c.textContent = choice;
            answers.appendChild(c);
        });
        answers.value = question.answer[0];

        answersDiv.appendChild(answerLabel);
        answersDiv.appendChild(answers);
        columnWrapper = createDiv('wrapper');
        columnWrapper.appendChild(answersDiv);
        wrapper.appendChild(columnWrapper);
    } else if (questionType.value == 'identification') {
        answers = document.createElement('input');
        answers.setAttribute('type', 'text');
        answers.setAttribute('name', 'answer');
        answers.value = question.answer[0];

        answersDiv.appendChild(answerLabel);
        answersDiv.appendChild(answers);
        columnWrapper = createDiv('wrapper');
        columnWrapper.appendChild(answersDiv);
        wrapper.appendChild(columnWrapper);
    }
    form.appendChild(wrapper);

    questionType.addEventListener('change', () => {
        wrapper.remove();
        wrapper = createDiv('wrapper');
        // answersDiv.remove();
        // choicesDiv.remove();
        if (questionType.value == 'multiple-choice') {
            choicesLabel = createLabel('choices', 'Choices');
            choicesDiv = createDiv('choices-div');
            choicesDiv.id = 'choices-div';
            choicesDiv.appendChild(choicesLabel);
            let choices = [];

            let choice = document.createElement('input');
            choice.setAttribute('type', 'text');
            choice.setAttribute('name', 'choices[]');
            choices.push(choice);
            choicesDiv.appendChild(choice);

            columnWrapper = createDiv('wrapper');
            columnWrapper.style.width = '100%';
            columnWrapper.style.alignItems = 'center';
            let addChoiceButton = createButton('add-choice-button', '+');
            addChoiceButton.setAttribute('type', 'button');
            addChoiceButton.addEventListener('click', () => {
                let choice = document.createElement('input');
                choice.setAttribute('type', 'text');
                choice.setAttribute('name', 'choices[]');
                choices.push(choice);
                choice.addEventListener('input', () => {
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
                choicesDiv.insertBefore(choice, addChoiceButton.parentElement);
            });
            columnWrapper.appendChild(addChoiceButton);
            choicesDiv.appendChild(columnWrapper);

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

            answersDiv = createDiv('answers-div');
            answersDiv.id = 'answers-div';
            answersDiv.appendChild(answerLabel);
            answersDiv.appendChild(answers);
            columnWrapper = createDiv('wrapper');
            columnWrapper.appendChild(choicesDiv);
            wrapper.appendChild(columnWrapper);
            columnWrapper = createDiv('wrapper');
            columnWrapper.appendChild(answersDiv);
            wrapper.appendChild(columnWrapper);
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

            answersDiv = createDiv('answers-div');
            answersDiv.id = 'answers-div';
            answersDiv.appendChild(answerLabel);
            answersDiv.appendChild(answers);
            columnWrapper = createDiv('wrapper');
            columnWrapper.appendChild(answersDiv);
            wrapper.appendChild(columnWrapper);
        } else if (questionType.value == 'identification') {
            let answerLabel = createLabel('answer', 'Answer');
            let answers = document.createElement('input');
            answers.setAttribute('name', 'answer');
            answers.value = question.answer[0];

            answersDiv = createDiv('answers-div');
            answersDiv.id = 'answers-div';
            answersDiv.appendChild(answerLabel);
            answersDiv.appendChild(answers);
            columnWrapper = createDiv('wrapper');
            columnWrapper.appendChild(answersDiv);
            wrapper.appendChild(columnWrapper);
        }

        form.appendChild(wrapper);
    });

    return form;
}

function createScheduleForm(testId) {
    let form = document.createElement('form');
    let openDateLabel = createLabel('open-date', 'Open Date');
    let openDate = document.createElement('input');
    openDate.setAttribute('type', 'datetime-local');
    openDate.id = 'open-date';
    openDate.required = true;
    let closeDateLabel = createLabel('close-date', 'Close Date');
    let closeDate = document.createElement('input');
    closeDate.setAttribute('type', 'datetime-local');
    closeDate.id = 'close-date';

    let errorMessage = document.createElement('p');
    errorMessage.style.whiteSpace = 'pre';

    let submitButton = document.createElement('button');
    submitButton.textContent = 'Create Schedule';
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        let proceed = false;
        let errorMessageContent = '';
        if (openDate.value == '') {
            errorMessageContent += 'Open date is empty!\n';
        }

        if (closeDate.value == '') {
            errorMessageContent += 'Close date is empty!\n';
        }

        if (openDate.value > closeDate.value) {
            errorMessageContent += 'Open date cannot be later than close date!';
        } else {
            form.appendChild(createHiddenInput('open-date', formatDateForSql(openDate.value)));
            form.appendChild(createHiddenInput('close-date', formatDateForSql(closeDate.value)));
            proceed = true;
        }

        errorMessage.textContent = errorMessageContent;
        if (proceed) {
            let serialized = $(form).serialize();
            console.log(serialized);
            $.ajax({
                type: 'POST',
                url: 'processing/new_schedule.php',
                data: serialized,
                dataType: 'text',
                success: (e) => {
                    console.log(e);
                    closeModal();
                    document.getElementById('schedules-button').click();
                }
            });
        }
    });

    form.appendChild(createHiddenInput('test-id', testId));
    form.appendChild(errorMessage);
    form.appendChild(openDateLabel);
    form.appendChild(openDate);
    form.appendChild(closeDateLabel);
    form.appendChild(closeDate);
    form.appendChild(submitButton);

    return form;
}

function formatDateForSql(date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

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
// function calculateScores(category) {
//     let scores = [];
//     let responses = getResponsesForCategory(category);
//     responses.forEach(response => {
//         scores[response.student_id] = checkAnswers(response.answers, response.sequence, category);
//     });
//     return scores;
// }

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
// function checkAnswer(studentAnswer, questionNumber, category) {
//     let currentQuestions = questions[category];
//     let currentQuestion = currentQuestions[questionNumber];
//     let correctAnswer = currentQuestion.answer;
//     let correct = false;

//     if (Array.isArray(correctAnswer) && correctAnswer.length > 1) {
//         let stop = false;
//         correctAnswer.forEach(answer => {
//             answer = answer.toLowerCase();
//             if (answer == studentAnswer.toLowerCase() && !stop) {
//                 stop = true;
//                 correct = true;
//             }
//         });
//     }
//     else if (correctAnswer.toLowerCase() == studentAnswer.toLowerCase()) {
//         correct = true;
//     }
//     return correct;
// }

function checkAnswer(studentAnswer, correctAnswer) {
    if (Array.isArray(correctAnswer) && correctAnswer.length > 1) {
        correctAnswer.forEach(answer => {
            answer = answer.toLowerCase();
            if (answer == studentAnswer.toLowerCase()) {
                return true;
            }
        });
    }
    else if (correctAnswer.toLowerCase() == studentAnswer.toLowerCase()) {
        return true;
    }
    return false;
}

// Checks the number of correct answers
function checkAnswers(answers, sequence, category) {
    let counter = 0;
    for (let i = 0; i < sequence.length; i++) {
        if (checkAnswer(answers[i], sequence[i], category)) counter++;
    }
    return counter;
}