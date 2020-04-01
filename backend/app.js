//Express APP
//mongo pw D42I6DsXmBtpn6cj
//NODE JS SERVER, using express features
//this app is a listener for server.js
const express = require('express'); //import express
const bodyParser = require('body-parser');
const Post = require('./models/post') // import post model
const mongoose = require("mongoose");
//create express app
const app = express();

app.use(bodyParser.json());
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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res) => { //POST to /api/posts
  const post = new Post ({ // pass in the model content
    title: req.body.title,
    content:req.body.content
  });
  post.save().then(postCreated => {
    res.status(201).json({
      message: "post was added",
      postId: postCreated._id
  }); //save the post to mongodb

  }); //return json data and status code 201 for confirmation of post added
});


app.get('/api/posts',(req , res, next) => {
  //fetch data from mongo database
  Post.find().then(documents => {
    res.status(200).json({   //return data in json format
      message: 'Post gathered',
      posts: documents
  }); //find will get all entries, unless you specify
  });
});
//delete post
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => { //deleting from backend database based off ID
    console.log(result) //showing deletion in console
    res.status(200).json({message: 'Deleted Post'});
  });

}); //name the url dynamically to pass ID of post to delete
module.exports = app; //export the entire app.
