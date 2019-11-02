var express = require('express');
var router = express.Router();
var User=require('../models/usermodel');

/* GET users listing. */
router.post('/register', function(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const user = new User({
    name: name,
    email: email,
    cart: {
        items:[]
    }
  });
  user
    .save()
    .then(result => {
    res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports = router;