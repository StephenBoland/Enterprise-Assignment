// implementing login and signup of users
//REF https://jasonwatmore.com/post/2015/12/09/mean-stack-user-registration-and-login-example-tutorial
//REF https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
const express = require("express");
const User = require ("../models/user");
const bcrypt = require ("bcrypt");
const app = express.Router();
const jwt = require("jsonwebtoken");

app.post("/register",(req,res,next)=> {
  bcrypt.hash(req.body.password, 5) //encrypting password, the # entered refers to how long it will hash for
  .then(hash => {
    const user = new User({ //creating a new user whenever a request is saved
    email: req.body.email,
    password: hash //dont store the password in non-encrpyted format, using bcrypt to encrpyt password
  });
  user.save().then(result => { //save user
    res.status(201).json({
      message:'User registered',
      result:result
  });
}) .catch(er => {
  res.status(500).json({
    error:er
    });
  });
});
});

app.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed" //user doesnt exist with this email
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password); //by inserting a value into becrypt, we can check if its the same as the hash'd password value, aka they are the same
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" } //duration of token = 1 hour ( most optimal for security)
      );
      res.status(200).json({
        token: token,
        tokenExpiresIn: 3600,
        userId : fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});
module.exports = app;
