

module.exports = (req, res, next) => {
  const userrole = req.userrole;
  if (userrole!='user') {
    const error = new Error('you are not a user');
    error.statusCode = 401;
    throw error;
  }
    next();
};