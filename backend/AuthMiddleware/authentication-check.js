//check if a token is attached to a request and valid.
const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
  try {
  const token = req.headers.authorization.split(" ")[1]; //looking in header for token, split on "bearer"
    jwt.verify(token,"development_string_secret_password");
    next();
  }catch (error) {
    res.status(401).json({message:'Failed authorization'});
  }

};
