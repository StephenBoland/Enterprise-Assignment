//Express APP
//mongo pw D42I6DsXmBtpn6cj
//NODE JS SERVER, using express features
//this app is a listener for server.js
const express = require('express'); //import express
const path = require("path")
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
//create express app
const app = express();
const routesofPost = require("./routes/postsmanage");

app.use(bodyParser.json());
app.use("/imageStore", express.static(path.join("backend/imageStore")));
//connecting to mongo db using mongoose
mongoose.connect("mongodb+srv://Stephen:D42I6DsXmBtpn6cj@enterpriseassignment-6kbhl.mongodb.net/AssignmentDatabase?retryWrites=true&w=majority")
.then(() => {
  console.log('Success connecting') //check if connected
})
.catch (() => {
  console.log('failed to connect'); //check if failed to connect
});


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use("/api/posts", routesofPost);
module.exports = app; //export the entire app.
