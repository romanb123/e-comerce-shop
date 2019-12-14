var express = require('express');
var router = express.Router();
var Product=require('../models/productsmodel');
const multer = require("multer");
var auth=require('../middlwear/auth-check');
var usercheck=require('../middlwear/user-check');
var admincheck=require('../middlwear/admin-check');


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
router.post('/addproduct',multer({storage:storage}).single("image"),auth,admincheck, function(req, res, next) {
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
      console.log(result);
    res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/products',auth,function(req, res, next) {
  Product.find().populate()
  .then(products => {
    // console.log(products);
    res.send(products);
  })
  .catch(err => {
    console.log(err);
  });
});
router.get('/singleproduct/:productId',auth,admincheck,function(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.send(product);
    })
    .catch(err => console.log(err));
});
router.get('/searchproduct/:productname',auth,function(req, res, next) {
  const productname = req.params.productname;
  Product.find({"name":productname})
    .then(product => {
      console.log(product);
      res.send(product);
    })
    .catch(err => console.log(err));
});

router.get('/categoryproduct/:productcategory',auth,function(req, res, next) {
  const productcategory = req.params.productcategory;
  Product.find({"category":productcategory})
    .then(product => {
      console.log(product);
      res.send(product);
    })
    .catch(err => console.log(err));
});

router.put('/updateproduct/:id',multer({storage:storage}).single("image"),function (req, res, next) {
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    image = url + "/images/" + req.file.filename
  }
  const product = new Product({
      _id: req.params.id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: image
  });
  Product.updateOne({ _id: req.params.id }, product).then(result => {
      console.log(result);
      res.json("updated");
  })
});

// router.post('/deleteproduct', function(req, res, next) {
//   const prodId = req.body.productId;
//   Product.findByIdAndRemove(prodId)
//     .then(() => {
//       console.log(prodId);
//       res.json('deleted');
//     })
// });

module.exports = router;
