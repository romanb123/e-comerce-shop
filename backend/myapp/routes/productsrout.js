var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');

/* GET users listing. */
router.post('/products', function(req, res, next) {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl
  });
  product
    .save()
    .then(result => {
    res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/products', function(req, res, next) {
  Product.find()
  .then(products => {
    console.log(products);
    res.send(products);
  })
  .catch(err => {
    console.log(err);
  });
});
router.post('/singleproduct/:productId', function(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.send(product);
    })
    .catch(err => console.log(err));
});

module.exports = router;
