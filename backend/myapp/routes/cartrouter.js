var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
var User=require('../models/usermodel');

/* GET users listing. */

router.post('/addtocart', function(req, res, next) {
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

module.exports = router;