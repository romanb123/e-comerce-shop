var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
var User=require('../models/usermodel');

/* GET users listing. */
router.post('/register_step1', function(req, res, next) {
  console.log(req.body);
  res.json("ffgf");
});



router.post('/register', function(req, res, next) {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const street=req.body.street;
  const role=req.body.role;
 

  
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: name,
      password:hash,
      email: email,
      street:street,
      role:role,
      cart: {
          items:[]
      }
    });
      user
          .save()
          .then(result => {
              res.status(201).json({
                  message: "User created!",
                  result: result
              });
          })
          .catch(err => {
              res.status(500).json({
                  error: err
              });
          });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed wrong password"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
        console.log(err);
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});


module.exports = router;