/*
    This file contains utility functions
*/

// Removes all child nodes of a given element
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Returns all responses
function getResponses() {
    return JSON.parse(localStorage.getItem('responses')) || [];
}

// Returns all responses in a given category
function getResponsesForCategory(_category) {
    return getResponses().filter(({category}) => category === _category);
}

function clearLocalStorage() {
    localStorage.clear();
}