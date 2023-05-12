function validation1() {
	const specialChars = /[!@#$^&*+\-\[\]\/~]/;
	const usernameInput = document.getElementById("username");
	const passwordInput = document.getElementById("password");
	const confirmPasswordInput = document.getElementById("confirmPassword");
	const errorElement = document.getElementById("error");
  
	const validateUsername = () => {
	  const username = usernameInput.value;
	  if (username.length < 3) {
		errorElement.textContent = "Username must be 3+ alphanumeric characters";
		return false;
	  } else if (!/^[a-zA-Z]/.test(username)) {
		errorElement.textContent = "Username must start with a letter";
		return false;
	  } else {
		errorElement.textContent = "";
		return true;
	  }
	};
  
	const validatePassword = () => {
	  const password = passwordInput.value;
	  if (password.length < 8) {
		errorElement.textContent = "Password must be 8+ characters";
		return false;
	  } else if (!/[A-Z]/.test(password)) {
		errorElement.textContent = "Password must contain at least one uppercase letter";
		return false;
	  } else if (!/\d/.test(password)) {
		errorElement.textContent = "Password must contain at least one number";
		return false;
	  } else if (!specialChars.test(password)) {
		errorElement.textContent = "Password must contain at least one special character (/*-+!@#$^&~[])";
		return false;
	  } else {
		errorElement.textContent = "";
		return true;
	  }
	};
  
	const validateConfirmPassword = () => {
	  const password = passwordInput.value;
	  const confirmPassword = confirmPasswordInput.value;
	  if (confirmPassword !== password) {
		errorElement.textContent = "Confirm password field does not match Password";
		return false;
	  } else {
		errorElement.textContent = "";
		return true;
	  }
	};
  
	usernameInput.addEventListener("input", validateUsername);
	passwordInput.addEventListener("input", validatePassword);
	confirmPasswordInput.addEventListener("input", validateConfirmPassword);
  
	return () => {
	  const validUsername = validateUsername();
	  const validPassword = validatePassword();
	  const validConfirmPassword = validateConfirmPassword();
	  return validUsername && validPassword && validConfirmPassword;
	};

	
  }
  const validate = validation1();

document.getElementById("registerr").addEventListener("submit", (event) => {
  if (!validate()) {
    event.preventDefault();
  }
});