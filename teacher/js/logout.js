$(document).ready(async () => {
    let logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        resetSession();
    });

    let logo = document.getElementById('logo');
    logo.addEventListener('click', () => {
        resetSession();
    })
});

