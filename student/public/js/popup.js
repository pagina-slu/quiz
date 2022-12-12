function addStatusMessage(type, message, lifespan = 3000) {
    let statusMessagesContainer = document.getElementById("status-messages-container");

    let divElement = document.createElement("div");
    divElement.className = "status-message " + type + "-message";

    let iElement = document.createElement("i");
    switch (type) {
        case "info":
            iElement.className = "info-circle";
            break;

        case "success":
            iElement.className = "check";
            break;

        case "warning":
            iElement.className = "warning";
            break;

        case "error":
            iElement.className = "times-circle";
            break;
    }

    let text = document.createTextNode(" " + message);

    divElement.appendChild(iElement);
    divElement.appendChild(text);
    statusMessagesContainer.prepend(divElement);


    setTimeout(removeStatusMessage, lifespan, divElement);
}

function removeStatusMessage(divElement) {
    fadeout(divElement);
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

