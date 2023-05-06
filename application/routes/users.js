var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next){
  res.status(200).json({
    id:312312, 
    message: "you are not logged in"

  });
})

module.exports = router;
