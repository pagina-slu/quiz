var btn = document.getElementById('login-form-btn');
var ovrly = document.getElementById('overlay');
var cross = document.getElementById('cross');
var login = document.getElementById('login');
var loginButton = document.getElementById('login-btn');
const INPUTS = document.querySelectorAll("#login .input input");

// Add event listeners
btn.addEventListener('click', openForm);
ovrly.addEventListener('click', closeForm);
cross.addEventListener('click', closeForm);
loginButton.addEventListener('click', loginUser);

// Make label float when input element has focus
INPUTS.forEach(input => {
	input.addEventListener("focus", () => {
		input.parentElement.classList.add("focus");
	});
	input.addEventListener("blur", () => {
		if (input.value === "") {
			input.parentElement.classList.remove("focus");
		}
	});
})

function openForm() {
	ovrly.style.display = "block";
	login.style.display = "block";
}

function closeForm() {
	ovrly.style.display = "none";
	login.style.display = "none";
}

function loginUser() {
	let uname = document.getElementById('uname').value;
	let upassword = document.getElementById('upass').value;
	if (uname == "instructor" && upassword == "admin") {
		clearInputs();
		window.open("teacher.html");
		closeForm();
	} else {
		alert("Sorry! You entered a wrong username or pasword");
	}
}

function clearInputs() {
	let uname = document.getElementById('uname');
	let upass = document.getElementById('upass');
	uname.value = "";
	upass.value = "";
	uname.parentElement.classList.remove("focus");
	upass.parentElement.classList.remove("focus");
}