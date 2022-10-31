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


let mainDiv = document.getElementById('main');
let questionsButton = document.getElementById('questions-button');
let responsesButton = document.getElementById('responses-button');
let summaryButton = document.getElementById('summary-button');

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
        viewButton.textContent = "View/Edit";
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('red-button');
        deleteButton.textContent = "Delete";
        buttonWrapper.appendChild(viewButton);
        buttonWrapper.appendChild(deleteButton);
        quizWrapper.appendChild(categorySpan);
        quizWrapper.appendChild(buttonWrapper);
    
        container.appendChild(quizWrapper);
        mainDiv.appendChild(container);
    });
});

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
    
        sideContainer.appendChild(categoryButton);
        mainDiv.appendChild(sideContainer);
    })

    //for responses
    responses.forEach(response => {
        let quizWrapper = document.createElement('div');
        quizWrapper.classList.add('quiz-wrapper');
        let responseSpan = document.createElement('span');
        responseSpan.textContent = response.name;
        let buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper');
        let viewButton = document.createElement('button');
        viewButton.classList.add('purple-button');
        viewButton.textContent = "View";
        let greenButton = document.createElement('button');
        greenButton.classList.add('green-button');
        greenButton.textContent = "Mark As Checked";
        buttonWrapper.appendChild(viewButton);
        buttonWrapper.appendChild(greenButton);
        quizWrapper.appendChild(responseSpan);
        quizWrapper.appendChild(buttonWrapper);
        container.appendChild(quizWrapper);
        mainDiv.appendChild(container);
    });
});

summaryButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
});