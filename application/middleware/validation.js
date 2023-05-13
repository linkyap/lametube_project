var validator = require('validator');
var db = require(`../conf/database`);
module.exports = {
    usernameCheck: function (req, res, next) {
        var { username } = req.body;
        username = username.trim();
        if (!validator.isLength(username, { min: 3 })) {
            req.flash("error", "Username must be 3+ characters");

        } if (!/[a-zA-Z]/.test(username.charAt(0))) {
            req.flash("error", "username must begin with a character");
        }
        if (req.session.flash.error) {
            res.redirect('/registration');
        } else {
            next();
        }
    },
    passwordCheck: function (req, res, next) { 
        var {password} = req.body;
        var {confirmPassword} =req.body;
        password = password.trim();

        if(!validator.isStrongPassword(password, {
            min: 8, minUppercase: 1, minSymboles: 1
        })){
            req.flash("error", 
            "Password must be 8+ characters, 1+ uppercase letter, 1+ number, and 1+ symbol");
        }
        if(!password==confirmPassword){
            req.flash("error",
            "Password and Confirm Password must match");
        }
        if (req.session.flash.error) {
            res.redirect('/registration');
        } else {
            next();
        }

    },
    emailCheck: function (req, res, next) { 
        var {email} = req.body;

        if(!validator.isEmail(email)){
            req.flash("error","Email address is required");
        }
        if (req.session.flash.error) {
            res.redirect('/registration');
        } else {
            next();
        }
        

    },
    tosCheck: function (req, res, next) { 
        var {TOS} = req.body;
        if(!TOS){
            req.flash("error","You must consent to TOS & Privacy Rules");
        }
        if (req.session.flash.error) {
            res.redirect('/registration');
        } else {
            next();
        }
    },
    ageCheck: function (req, res, next) {
        var {ageOfConsent} = req.body;
        if(!ageOfConsent){
            req.flash("error","You must be 13+ to register");
        }
        if (req.session.flash.error) {
            res.redirect('/registration');
        } else {
            next();
        }
     },
    isUsernameUnique: async function (req, res, next) {
        var { username } = req.body;
        try {
            var [rows, fields] = await db.execute(
                `select id from users where username=?;`,
                [username]
            );
            if (rows && rows.length > 0) {
                req.flash("error", `${username} is already taken`);
                return req.session.save(function (err) {
                    return res.redirect('/registration');
                });
            } else {
                next();
            }
        }
        catch (error) {
            next(error);
        }
    },


    isEmailUnique: async function (req, res, next) {
        var {email} = req.body;
        try {
            [rows, fields] = await db.execute(
                `select id from users where email=?;`,
                [email]
            );
            if(rows && rows.length > 0){
                req.flash("error", `${email} is already taken`);
                return req.session.save(function (err){
                    return res.redirect("/registration");
                });
            } else {
                next();
            }
        } catch (error) {
            next(error)
        }

    }
}