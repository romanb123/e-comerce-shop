module.exports = (req, res, next) => {
    const userrole = req.userrole;
    if (userrole!='admin') {
      const error = new Error('you are not a admin');
      error.statusCode = 401;
      throw error;
    }
      next();
  };