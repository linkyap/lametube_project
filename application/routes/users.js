var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
var { isLoggedIn, isMyProfile } = require("../middleware/auth.js")
const { isUsernameUnique, usernameCheck, passwordCheck, emailCheck, tosCheck, ageCheck, isEmailUnique } = require('../middleware/validation')

// localhost:3000/users/register 
router.post('/registration', 
usernameCheck,
passwordCheck,
emailCheck,
tosCheck,
ageCheck,
isUsernameUnique,
isEmailUnique,
  async function (req, res, next) {
    var { username, email, password } = req.body;
    //check username unique

    try {


      //check email unique


      var hashedPassword = await bcrypt.hash(password, 5);

      //insert
      var [resultObject, fields] = await db.execute(
        `INSERT INTO users
    (username,email,password)
     value
    (?,?,?);`, 
    [username, email, hashedPassword]
    );

      //respond  
      if (resultObject && resultObject.affectedRows == 1) {
        req.flash("success", `${username}'s account has been created`);
        return req.session.save(function (err) {
          return res.redirect('/login');
        })
      } else {
        req.flash("error", `${username}'s account could not be created. 
      Please try again later`
        );
        return req.session.save(function (err) {
          return res.redirect("/registration");
        }

        )
      }

    } catch (error) {
      next(error);
    }
  });

// localhost:3000/users/login
router.post('/login', async function (req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/login');
  } else {
    var [rows, fields] = await db.execute(
      `select id,username,password,email from users where username=?;`,
      [username]
    );
    var user = rows[0];
    if (!user) {
      req.flash("error", `Log in failed: Invalid username/password`);
      req.session.save(function (err) {
        return res.redirect('/login');
      })

    } else {

      var passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        req.session.user = {
          userId: user.id,
          email: user.email,
          username: user.username
        };
        req.flash("success", `You are now logged in!`);
        req.session.save(function (err) {
          return res.redirect('/');
        })
      } else {
        req.flash("error", `Log in failed: Invalid username/password`);
        req.session.save(function (err) {
          return res.redirect('/login');
        })
      }
    }
  }
});

router.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return res.redirect('/login');
  }
})

router.get('/profile/:id(\\d+)', isLoggedIn, isMyProfile, async function (req, res) {
  try {
    var [posts, fields] = await db.execute(
      `SELECT id, title, description, video, thumbnail FROM posts WHERE fk_userId = ?;`,
      [req.params.id]
    );
    if (posts.length === 0) {
      req.flash("error", `No posts available`);
    }
    res.render('profile', { title: 'Profile page', posts: posts, css: ["thumbnailLink.css"]  });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//if i have time come back to
// router.post('/profile/update', isLoggedIn, function(req,res){
//   // update user information in database
//   res.redirect('/profile');
//   })

router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {

    if (err) {
      next(error);
    }
    return res.redirect('/');
  })
});


module.exports = router;
