var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
var User=require('../models/usermodel');
var auth=require('../middlwear/auth-check');
var usercheck=require('../middlwear/user-check');

/* GET users listing. */

router.post('/addtocart',auth,usercheck,function(req, res, next) {
  console.log(req.user);
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        console.log(result);
        res.json(result);
      }).catch(err=>{
          console.log(err);
      });
});

router.post('/deletefromcart',auth,usercheck,function(req, res, next) {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.json({message:'/deleted',product:result});
    })
    .catch(err => console.log(err));
});

router.post('/clearcart',auth,usercheck,function(req, res, next) {
  return req.user.clearCart()
    .then(result => {
      res.json("cleared"+result);
    })
    .catch(err => console.log(err));
});






router.get('/viewcart',auth,usercheck,function(req, res, next) {
  console.log(req.user+"ggggggggggggggggggggggggggggggggg");
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        res.json(products);
      })
      .catch(err => console.log(err));

});

module.exports = router;