var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var User = require('../models/usermodel');
var auth=require('../middlwear/auth-check');
var passport;
var email;
var password;
var password_confirm;
/* GET users listing. */
router.post('/register_step1', function (req, res, next) {
  passport = req.body.passport;
  email = req.body.email;
  password = req.body.password;
  password_confirm = req.body.password_confirm;
  User.findOne({ passport: passport })
    .then(userexist => {
      if (userexist) {
        return res.json({ message: 'user with this passport already exist', value: false });
      } else {
        User.findOne({ email: email })
          .then(userDoc => {
            if (userDoc) {
              return res.json({ message: 'user with this email already exist', value: false });
            }
            else if (password != password_confirm) {
              return res.json({ message: 'passwords are different', value: false });
            }
            else if (!passport || !email || !password || !password_confirm) {
              return res.json({ message: 'one of values are missing', value: false });
            }
            else {
              return res.json({ message: 'check completed!!! go to next step', value: true });
            }
          }).catch(err => {
            console.log(err);
          });
      }
    }).catch(err => {
      console.log(err);
    });

});



router.post('/register', function (req, res, next) {
  const city = req.body.city;
  const street = req.body.street;
  const name = req.body.name;
  const lastname = req.body.lastname;
  console.log(req.body);
  console.log(passport, email, email, password_confirm);


  bcrypt.hash(password, 10).then(hash => {
    const user = new User({
      passport: passport,
      email: email,
      password: hash,
      city: city,
      street: street,
      name: name,
      lastname: lastname,
      role: 'user',

      cart: {
        items: []
      }
    });
    console.log(user);
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
        { email: fetchedUser.email, userId: fetchedUser._id,role:fetchedUser.role },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        user:fetchedUser
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});


router.get('/userdata',auth,function(req, res, next) {
  User.findById(req.userid)
    .then(user => {
      console.log(user);
      res.send(user);
    })
    .catch(err => console.log(err));
});


module.exports = router;