var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
var User=require('../models/usermodel');
var Order=require('../models/ordermodel');
var auth=require('../middlwear/auth-check');
var usercheck=require('../middlwear/user-check');
var d = new Date();



router.post('/makeorder',auth,usercheck,function(req, res, next) {
  console.log(req.body);
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        datecreated:d,
        user: {
          name: req.user.name,
          userId: req.user,
       
     
        },
           addres:{
          city:req.body.city,
          street:req.body.street,
          date:req.body.date,
        },
          creditcart:req.body.creditcart,
        products: products,
       
      
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.json("orderd");
    })
    .catch(err => console.log(err));
  });



  router.get('/showorders',auth,usercheck,function(req, res, next) {
    Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.send(orders);
    })
    .catch(err => console.log(err));
  });

  router.get('/showallorders',function(req, res, next) {
    Order.find()
    .then(orders => {
      console.log(orders);
      res.send(orders);
    })
    .catch(err => console.log(err));
  });

  module.exports = router;