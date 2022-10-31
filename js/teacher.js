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
const CATEGORIES = readJSONfile('../res/categories.json');
let questions = {};
CATEGORIES.forEach(category => {
    questions[category.name] = readJSONfile(category.path);
});
console.log(questions);

let mainDiv = document.getElementById('main');
let questionsButton = document.getElementById('questions-button');
let responsesButton = document.getElementById('responses-button');
let summaryButton = document.getElementById('summary-button');
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
    CATEGORIES.forEach(category => {
        let quizWrapper = document.createElement('div');
        quizWrapper.classList.add('quiz-wrapper');
        let categorySpan = document.createElement('span');
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
                content += `${counter}. ${question.question}<br>Type: ${question.type}${question.type == 'multiple-choice' ? `<br>Choices: ${JSON.stringify(question.options)}` : ""}<br>Answer: ${question.answer}<br><br>`;
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
    console.log(responses);
    removeAllChildNodes(mainDiv);
    let container = document.createElement('div');
    container.classList.add('container');

    //side buttons for categories
    let sideContainer = document.createElement('div');
    sideContainer.classList.add('side-container');
    CATEGORIES.forEach(category =>{
        let categoryButton = document.createElement('button');
        categoryButton.classList.add('category-button');
        categoryButton.textContent = category.name;

        categoryButton.addEventListener('click', ()=>{
            let hasResponse = false; 
            removeAllChildNodes(container);

            //for responses
            responses.forEach(response => {
                if(response.category == category.name){
                    hasResponse = true;
                    let quizWrapper = document.createElement('div');
                    quizWrapper.classList.add('quiz-wrapper');
                    let responseSpan = document.createElement('span');
                    let greenButton = document.createElement('button');
                    greenButton.classList.add('green-button');
                    greenButton.textContent = "Mark As Checked";
                    if(response.isChecked == true){ //adds classname 'clicked' to span and button if already checked
                        responseSpan.classList.add('clicked');
                        greenButton.classList.add('clicked');
                        greenButton.textContent = "Mark As Unchecked";
                    }
                    responseSpan.innerHTML = response.idNumber+"<br>"+response.name;
                    let buttonWrapper = document.createElement('div');
                    buttonWrapper.classList.add('button-wrapper');
                    let viewButton = document.createElement('button');
                    //view button
                    viewButton.classList.add('purple-button');
                    viewButton.textContent = "View";
                    viewButton.addEventListener('click', ()=>{
                        console.log(response);
                        let content = "";
                        let counter = 1;
                        response.sequence.forEach(seq =>{
                            content+=`${counter}. `+
                                "Question: "+questions[category.name][seq].question+
                                "<br> Type: "+questions[category.name][seq].type+
                                "<br> Answer: "+response.answers[counter-1]+
                                "<br><br>";
                                counter++;
                        })

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

                    greenButton.addEventListener('click',()=>{
                        if(greenButton.className == 'green-button'){
                            greenButton.textContent = "Mark As Unchecked";
                            responseSpan.classList.add('clicked');
                            greenButton.classList.add('clicked');
                            response.isChecked = true;
                            localStorage.setItem('responses', JSON.stringify(responses));
                        }else{
                            greenButton.textContent = "Mark As Checked";
                            responseSpan.classList.remove('clicked');
                            greenButton.classList.remove('clicked');
                            response.isChecked = false;
                            localStorage.setItem('responses', JSON.stringify(responses));
                        }
                    });

                    buttonWrapper.appendChild(viewButton);
                    buttonWrapper.appendChild(greenButton);
                    quizWrapper.appendChild(responseSpan);
                    quizWrapper.appendChild(buttonWrapper);
                    container.appendChild(quizWrapper);
                    mainDiv.appendChild(container);
                }
            });
            console.log(hasResponse);
            //checks if category has a response
            if(hasResponse == false){
                let quizWrapper = document.createElement('div');
                quizWrapper.classList.add('quiz-wrapper');
                let responseSpan = document.createElement('span');
                responseSpan.textContent = "No response available.";
                quizWrapper.appendChild(responseSpan);
                container.appendChild(quizWrapper);
                mainDiv.appendChild(container);
            }
        })

        sideContainer.appendChild(categoryButton);
        mainDiv.appendChild(sideContainer);
        var catButts = document.querySelectorAll(".category-button");
        catButts[0].click();
        catButts[0].focus();
    })
});

summaryButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
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
console.log(getNumberOfResponses("Applications Development"))
console.log(getTotalNumberOfResponses());