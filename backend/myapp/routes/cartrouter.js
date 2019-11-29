var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
var User=require('../models/usermodel');
var auth=require('../middlwear/auth-check');

/* GET users listing. */

router.post('/addtocart',auth, function(req, res, next) {
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

router.post('/deletefromcart', function(req, res, next) {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.json({message:'/deleted',product:result});
    })
    .catch(err => console.log(err));
});

router.post('/clearcart', function(req, res, next) {
  return req.user.clearCart()
    .then(result => {
      res.json("cleared"+result);
    })
    .catch(err => console.log(err));
});






router.get('/viewcart', function(req, res, next) {
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