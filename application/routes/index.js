


var express = require('express');
const { isLoggedIn } = require('../middleware/auth');
var router = express.Router();
var db = require('../conf/database');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    var [posts, fields] = await db.execute(
      `SELECT id, title, description, video, thumbnail FROM posts;`
    );
    if (posts.length === 0) {
      req.flash("error", `No posts available`);
    }
    res.render('index', { title: 'Home page', posts: posts, css: ["thumbnailLink.css"] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});;


router.get('/login', function(req,res){
  res.render('login',{ title: 'Login', css:["form.css"]});
})

router.get('/postvideo', isLoggedIn, function(req, res){
  res.render('postvideo',{ title: 'Post Video', css:["form.css"] })
})

 
router.get('/registration', function(req,res){
  res.render('registration', { title: 'Registration form',  js:["validation1.js"], css:["form.css"] });
})

module.exports = router;
