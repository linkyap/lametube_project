function validation(){
	let regex = /[^a-z]/gi;
	let specialChars = /[!@#$^&*+\-\[\]\/~]/;
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let confirmPassword = document.getElementById("confirm password").value;
	let email = document.getElementById("email").value;

	if(!isNaN(username.charAt(0)) ||isNaN(username.charAt(0)) && username.replace(/[^a-z]/gi, "").length < 3)
	{
		document.getElementById("username").focus();
		document.getElementById("error").innerHTML = "Username must start with a character A-Z and be 3+ alphanumeric characters";
		return false;
	}
	else if(/[A-Z]/.test(password) == false ||  /\d/.test(password) == false || specialChars.test(password) == false || password.length < 8)
	{
		document.getElementById("password").focus();
		document.getElementById("error").innerHTML = "Password must be 8+ characters and contain one uppercase letter, one number, and one special character (/*-+!@#$^&~[])";
		return false;
	}
	else if(confirmPassword != password)
	{
		document.getElementById("confirm password").focus();
		document.getElementById("error").innerHTML = "Confirm password field does not match Password";
		return false;
	}
	else
	{
		document.getElementById("error").innerHTML = "";
		alert("Account Created Successfully");
		return true;
	}
}