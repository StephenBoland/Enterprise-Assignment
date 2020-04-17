 //check if a token is attached to a request and valid.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];  //looking in header for token, split on "bearer"
    const decodedToken = jwt.verify(token, "this_is_a_secret_token_for_security"); //decodedToken holds the user ID
    req.userData = {email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication Failedd" });
  }
};
