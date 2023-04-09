const username = document.querySelector("username");
const password = document.querySelector("password");
const confirm_password = document.querySelector("confirm password");
const form = document.querySelector("#registerr");

form.addEventListener("submit", function(e)){

    e.preventDefault();

    

});

const req = value => value === ""? false:true;
const greater = (length, min) => min > length ? false : true;
const securepss = (password) => {
    const a = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return a.test(password);
}

const showErr = (input, message) => {
    const input_group = input.parent;
    input_group.classList.remove("success");
    input_group.classList.add("add");
    const err = input_group.querySelector("small");
    err.textContent = message;
};

const success = (input) => {
    const input_group = input.parent;
    input_group.classList.remove("error");
    input_group.classList.add("success");
    const err = input_group.querySelector("small");
    err.textContent = "";
}

const chkUser = () => {
    let valid = false;
    const min = 3;
    const username1 = username.value.trim();
    if (!req(username1)){
        showErr(username, "Musn't be blank");
    } else if (!greater(username.length,min)){
        showErr(username,`Must be ${min}+ characters`)
    } else {
        success(username);
        valid = true;
    }
    return valid;
}

const chkpass = () => {
    let valid = false;
    const password1 = password.value.trim();
    if (!req(password1)){
        showErr(password, "Musn't be blank");
    } else if (!securepss(password1)){
        showErr(password, "Password must have 8+ characters including 1+ lowercase, 1+ uppercase, and 1 special character (!@#$%^&*()/[])")
    }else {
        success(password);
        valid = true;
    }
    return valid;
}

const matchpass = () => {
    let valid = false;
    const confirm_password1 = confirm_password.value.trim();
    const password1 = password.value.trim();
    if (!req(confirm_password1)){
        showErr(confirm_password, "Please enter password");
    } else if (password1 !== confirm_password1) {
        showErr(confirm_password, "Password does not match");
    } else {
        success(confirm_password);
        valid = true;
    }
    return valid;
};


