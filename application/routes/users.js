var express = require('express');
var router = express.Router();
var db = require('../conf/database ')
/* GET localhost:3000. */
router.get('/', function(req, res, next) {
  
});

router.post('/login', function(req, res, next){
  res.status(200).json({
    id:312312, 
    message: "you are not logged in"

  });
})

module.exports = router;
