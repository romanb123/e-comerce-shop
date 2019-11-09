var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
const multer = require("multer");

const type = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const isValid = type[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "./images");
  },
  filename: (req, file, cb) => {
      const name = file.originalname
          .toLowerCase()
          .split(" ")
          .join("-");
      const ext = type[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
  }
});
/* GET users listing. */
router.post('/addproduct',multer({storage:storage}).single("image"), function(req, res, next) {
  const url=req.protocol+'://'+req.get("host");
  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;
  const image=url+"/images/"+req.file.filename;
  const product = new Product({
    name: name,
    category: category,
    price: price,
    image: image,
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
