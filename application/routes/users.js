var express = require('express');
var router = express.Router();
var db = require('../conf/database');
/* GET localhost:3000/users */
router.get('/', async function(req, res, next) {
  try{
    let [rows, fields] = await db.query(`select * from users;`
    );
    res.status(200).json({rows, fields})
  }catch(error){
    next(error);
  }
});

router.post('/login', function(req, res, next){
  res.status(200).json({
    id:312312, 
    message: "you are not logged in"

  });
})

module.exports = router;
