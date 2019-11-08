var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
var User=require('../models/usermodel');
var Order=require('../models/ordermodel');



router.post('/addtoorder', function(req, res, next) {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
  });

  module.exports = router;