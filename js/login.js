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



// var uelement = document.getElementById('uname');
// var pelement = document.getElementById('upass');

// if(uelement != null){
// 	uname = uelement.value;
// }
// if(pelement != null){
// 	upassword = pelement.value;
// }
// console.log(uname);
// console.log(upassword);

var loginButton = document.getElementById('login-btn');
loginButton.addEventListener('click', loginUser);

function loginUser(){
	let uname = document.getElementById('uname').value;
	let upassword = document.getElementById('upass').value;
	if(uname =="instructor" && upassword=="admin"){
		window.location.assign("admin.html");
	} else{
		alert("Sorry! You entered a wrong username or pasword");
	}
}
