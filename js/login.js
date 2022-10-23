var btn = document.getElementById('login-form-btn');
var ovrly = document.getElementById('overlay');
var cross = document.getElementById('cross');
var login = document.getElementById('login');
btn.addEventListener('click', openForm);
ovrly.addEventListener('click', closeForm);
cross.addEventListener('click', closeForm);

function openForm(){
	ovrly.style.display = "block";
	login.style.display = "block";
}
function closeForm(){
	ovrly.style.display = "none";
	login.style.display = "none";
}

var loginButton = document.getElementById('login-btn');
loginButton.addEventListener('click', loginUser);

function loginUser(){
	let uname = document.getElementById('uname').value;
	let upassword = document.getElementById('upass').value;
	if(uname =="instructor" && upassword=="admin"){
		window.open("admin.html");
		closeForm();
	} else{
		alert("Sorry! You entered a wrong username or pasword");
	}
}

// Make label float when input element has focus
const INPUTS = document.querySelectorAll("#login .input input");
console.log(INPUTS);
INPUTS.forEach(input => {
	input.addEventListener("focus", () => {
		input.parentElement.classList.add("focus");
	});
	input.addEventListener("blur", () => {
		console.log(input.value);
		if (input.value === "") {
		  input.parentElement.classList.remove("focus");
		}
	  });
})
