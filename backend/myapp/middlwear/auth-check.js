var User = require('../models/usermodel');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret_this_should_be_longer");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  var usrtid=decodedToken.userId;
  User.findById(usrtid)
  .then(user => {
    req.user = user;
    console.log(req.user+"fff");
    next();
  })
  .catch(err => console.log(err));
};