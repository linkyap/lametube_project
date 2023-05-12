var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');


// localhost:3000/users/register 
router.post('/registration', async function (req, res, next) {
  var { username, email, password } = req.body;
  //check username unique

  try {
    var [rows, fields] = await db.execute(`select id from users 
    where username=?;`, [username]);
    if (rows && rows.length > 0) {
      return res.redirect('/registration');
    }

    //check email unique
    var [rows, fields] = await db.execute(`select id from users 
    where email=?;`, [email]);
    if (rows && rows.length > 0) {
      return res.redirect('/registration');
    }

    var hashedPassword = await bcrypt.hash(password, 5);

    //insert
    var [resultObject, fields] = await db.execute(
      `INSERT INTO users
    (username,email,password)
     value
    (?,?,?);`, [username, email, hashedPassword]);

    //respond  
    if (resultObject && resultObject.affectedRows == 1) {
      return res.redirect('/login');
    } else {
      return res.redirect("/registration")
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

router.get('/profile/:id(\\d+)', function (req, res) {
  res.render('profile', { title: 'Profile page' });
})

router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {

    if (err) {
      next(error);
    }
    return res.redirect('/');
  })
});


module.exports = router;
