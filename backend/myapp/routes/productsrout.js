var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');

/* GET users listing. */
router.post('/addproduct', function(req, res, next) {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.body.userId;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId:userId
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
  Product.find().populate()
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

router.post('/editproduct', function(req, res, next) {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log(result);
      res.json('edited');
    })
    .catch(err => console.log(err));
});

router.post('/deleteproduct', function(req, res, next) {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log(prodId);
      res.json('deleted');
    })
});

module.exports = router;
