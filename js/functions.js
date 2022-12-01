/*
    This file contains utility functions
*/

// Removes all child nodes of a given element
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Stores responses locally
function storeResponses(responses) {
    localStorage.setItem('responses', JSON.stringify(responses));
}

// Returns all responses
// function getResponses() {
//     return JSON.parse(localStorage.getItem('responses')) || [];
// }

// Returns all responses in a given category
// function getResponsesForCategory(_category) {
//     return getResponses().filter(({category}) => category === _category);
// }

// Clears the local storage
function clearLocalStorage() {
    localStorage.clear();
}

// Creates a div with the given class
function createDiv(_class) {
    let div = document.createElement('div');
    div.classList.add(_class);
    return div;
}

// Creates a span with the given class
function createSpan(_class, content) {
    let span = document.createElement('span');
    span.classList.add(_class);
    span.textContent = content;
    return span;
}