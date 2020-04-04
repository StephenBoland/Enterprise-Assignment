const express = require("express");
const app = express.Router();
const multer = require("multer");
const Post = require('../models/post') // import post model

const types = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const store = multer.diskStorage({
  destination: (req,file,cb) => {
    //error check if file type not in types
    const isValid = types[file.mimetype];
    let error = new Error("Invalid type");
    if (isValid) {
      error = null; // no error if type is right
    }

    cb(null, "backend/imageStore");
  },
  filename: (req, file, cb) => {
    const fname = file.originalname.toLowerCase().split(' ').join('-');
    const extension = types[file.mimetype]; //getting extension of file
    cb(null, name + '-' + Date.now() + '.' + ext); //pass this info to malter in a proper filename format
  }
}); //check github
//malter will look for a single file from image
app.post("", multer({store:store}).single("image"), (req, res, next) => { //POST to /api/posts
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

app.put("/:id", (req, res, next) => { //create a new post
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id }, post).then(result => { //replace old post with the new post, essentially 'updating' it.
    console.log(result);
    res.status(200).json({
      message: "Updated Post"});
    });
  }); //mongo still uses _id
 //we want the ID of the post we will replace


app.get('',(req , res, next) => {
  //fetch data from mongo database
  Post.find().then(documents => {
    res.status(200).json({   //return data in json format
      message: 'Post gathered',
      posts: documents
  }); //find will get all entries, unless you specify
  });
});
app.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then( post => { //have mongoose check the db for an ID
    if (post) {
      res.status(200).json(post); //if ID found
    }
    else{
      res.status(404).json({message:'post not found'}); //If ID not found
    }
  });
});

//delete post
app.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => { //deleting from backend database based off ID
    console.log(result) //showing deletion in console
    res.status(200).json({message: 'Deleted Post'});
  });

}); //name the url dynamically to pass ID of post to delete



 module.exports = app;
