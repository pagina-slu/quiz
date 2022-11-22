$(document).ready(async () => {
    let logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        resetSession();
    });
});

