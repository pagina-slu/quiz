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
	

function fadeIn(element) {
	var opacity = 0;
	var intervalID = setInterval(function() {

		if (opacity < 1) {
			opacity = opacity + 0.1
			element.style.opacity = opacity;
		} else {
			clearInterval(intervalID);
		}
	}, 200);
}