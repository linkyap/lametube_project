const username = document.getElementById("name");
const password = document.getElementById("password");
const confrim_password = document.getElementById("confirm password");
const email = document.getElementById("email");
const alphanum = /^[a-zA-Z][a-zA-Z0-9]{2,}/;
const firstchar= /^[a-zA-Z]+$/;
function validation(){
    if (username < 3 ){
        alert("Name length should be 3+ characters long and start with A-Z, upper or lowercase");
        username.focus();
        return false;
    }

    
    return true;
}
