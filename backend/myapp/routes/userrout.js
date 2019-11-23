var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
var User=require('../models/usermodel');

/* GET users listing. */
router.post('/register_step1', function(req, res, next) {
  const passport = req.body.passport;
  const email = req.body.passport;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;

  User.findOne({ passport: passport })
    .then(userDoc => {
      if (userDoc) {
        return res.json({message:'user already taken',value:false});
      }
      else   if (password!=password_confirm) {
        return res.json({message:'passwords are different',value:false});
      }
      else   if (!passport||!email||!password||!password_confirm) {
        return res.json({message:'one of values are missing',value:false});
      }
      else {
        return res.json({message:'completed!!!',value:true});
      }
    }) .catch(err => {
      console.log(err);
    });
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