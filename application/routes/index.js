var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', name:"James Donnelly" });
});


router.get('/login', function(req,res){
  res.render('login',{ title: 'Login', css:["form.css"]});
})



// router.use("/postvideo", function(req, res, next){
//   if(req.userIsLoggedIn){
//     next();
//   }
//   else {
    
//       res.redirect('/users/login');
    
//   }
// })

router.get('/postvideo', function(req, res){
  res.render('postvideo',{ title: 'Post Video', css:["form.css"] })
})





 
router.get('/registration', function(req,res){
  res.render('registration', { title: 'Registration form',  js:["validation1.js"], css:["form.css"] });
})

module.exports = router;
