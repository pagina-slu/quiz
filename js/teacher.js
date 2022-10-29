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
    removeAllChildNodes(mainDiv);
});

summaryButton.addEventListener('click', () => {
    removeAllChildNodes(mainDiv);
});