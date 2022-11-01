/*
    This file contains utility functions
*/
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getResponses() {
    return JSON.parse(localStorage.getItem('responses')) || [];
}

function clearLocalStorage() {
    localStorage.clear();
}