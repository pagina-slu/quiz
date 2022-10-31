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
                    responseSpan.textContent = response.name;
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
                        
                        
                    })
                    //
                    let greenButton = document.createElement('button');
                    greenButton.classList.add('green-button');``
                    greenButton.textContent = "Mark As Checked";
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
    })

    
});

summaryButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
});