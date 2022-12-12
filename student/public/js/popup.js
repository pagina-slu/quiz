function addStatusMessage(type, message, lifespan = 3000) {
    let statusMessagesContainer = document.getElementById("status-messages-container");

    let divElement = document.createElement("div");
    divElement.className = "status-message " + type + "-message";

    let iElement = document.createElement("i");
    iElement.className = "fa";
    switch (type) {
        case "info":
            iElement.className += " fa-info-circle";
            break;

        case "success":
            iElement.className += " fa-check";
            break;

        case "warning":
            iElement.className += " fa-warning";
            break;

        case "error":
            iElement.className += " fa-times-circle";
            break;
    }

    let text = document.createTextNode(" " + message);

    divElement.appendChild(iElement);
    divElement.appendChild(text);
    statusMessagesContainer.prepend(divElement);

    // $(divElement).fadeOut(0);
    fadeIn(divElement);

    setTimeout(removeStatusMessage, lifespan, divElement);
}

function removeStatusMessage(divElement) {
    fadeout(divElement);
}

function fadeIn(divElement){
    divElement.style.visibility = "visible";
    divElement.style.opacity= "1";
    divElement.style.transition= "opacity 2s linear";
}
function fadeout(divElement){
    divElement.style.visibility = "hidden";
    divElement.style.opacity= "0";
    divElement.style.transition= "visibility 0s 2s, opacity 2s linear";
    divElement.remove();
}


// /* Only for CodePen */
// addStatusMessage("info", "Follow this info...");
// addStatusMessage("success", "Everything went as planned");
// addStatusMessage("warning", "This might not be correct...");
// addStatusMessage("error", "Something went wrong");

