/*
    This file contains utility functions
*/

function readJSONfile(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    var JSONobject = JSON.parse(request.responseText);
    return JSONobject;
}

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