function validation(){
    let regex = /[^a-z]/gi;
    let specialChars = /[!@#$^&*+\-\[\]\/~]/;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm password").value;
    if(username == ""){
        document.document.getElementById("username").focus();
        document.getElementById("error").innerHTML = "Username required";
        return false;
    }else if(username != "" && isNAN(username.charAt(0))){
        document.document.getElementById("username").focus();
        document.getElementById("error").innerHTML = "Username must start with a character A-Z";
        return false;
    }else if(username != "" && isNAN(username.charAt(0)) && username.replace(/[^a-z]/gi, "").length < 3){
             document.document.getElementById("username").focus();
             document.getElementById("error").innerHTML = "Username must be 3+ letters or numbers";
             return false;
    }else if(password == ""){
    document.getElementById("password").focus();
    document.getElementById("error").innerHTML = "Password required;"
    return false;
    }else if (password!= "" && /[A-Z]/.test(password) == false){
    document.getElem
    }

}
