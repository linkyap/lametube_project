var express = require('express');
var router = express.Router();
var db = require('../conf/database');

// localhost:3000/users/register 
router.post('/registration', async function(req, res, next) {
  var {username,email,password} = req.body;
  //check username unique
  try{
    var [rows, fields] = await db.execute(`select id from users 
    where username=?;`,[username]);
    if (rows && rows.length > 0){
      return res.redirect('/registration');
    }
    //check email unique
    var [rows, fields] = await db.execute(`select id from users 
    where email=?;`,[email]);
    if (rows && rows.length > 0){
      return res.redirect('/registration');
    }
    
    //insert
    var [resultObject, fields] = await db.execute(`INSERT INTO users
    (username,email,password)
     value
    (?,?,?);`,[username, email, password]);
    //respond  
    if(resultObject && resultObject.affectedRows == 1){
  return res.redirect('login');      
    }else{
      return res.redirect("/registration")
    }

  }catch(error){
    next(error);
  }
});
// localhost:3000/users/login
router.post('/login', async function(req, res, next) {
  const {username,password} = req.body;
  
  if(!username || !password){
    return res.redirect('/login');
  } else {
    var [rows, fields] = await db.execute(
      `select * from users where username=? and password=?;`,
      [username,password]);
    var user = rows[0];
    if (!user){
      return res.redirect('/login');     
    }else{
      return res.redirect("/")
    }
  }
});
// router.post('/login', function(req, res, next){
//   res.status(200).json({
//     id:312312, 
//     message: "you are not logged in"

//   });
// }) 

module.exports = router;
