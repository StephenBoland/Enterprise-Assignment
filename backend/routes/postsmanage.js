const express = require("express");
const multer = require("multer");
const AuthorizationCheck = require("../AuthMiddleware/authentication-check");
const Post = require("../models/post");

const app = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      //error check if file type not in types
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;// no error if type is right
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype]; //getting extension of file
    cb(null, name + "-" + Date.now() + "." + ext); //pass this info to malter in a proper filename format
  }
});
//malter will look for a single file from image
app.post(
  "",
  AuthorizationCheck,//auth check
  multer({ storage: storage }).single("image"),
  (req, res, next) => { //POST to /api/posts
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({ // pass in the model content
      title: req.body.title,
      content: req.body.content,
      imgPath: url + "/images/" + req.file.filename, // the img path want to store in db
      creator: req.userData.userId
    });
    post.save().then(createdPost => {
      res.status(201).json({//return json data and status code 201 for confirmation of post added
        message: "Post added successfully",//save the post to mongodb
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

app.put( //create a new post
  "/:id",AuthorizationCheck,//auth check
  multer({ storage: storage }).single("image"), //replace old post with the new post, essentially 'updating' it.
  (req, res, next) => {
    let imgPath = req.body.imgPath;
    if (req.file) { //if req file exists, a new file was uploaded
      const url = req.protocol + "://" + req.get("host"); //get new url
      imgPath = url + "/images/" + req.file.filename

    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imgPath: imgPath,
      creator: req.userData.userId
    });
    console.log(post); //user can only edit if they made the post
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      console.log(result);
      if(result.nModified > 0) { //Nmodified > 0 means an edit was made
        res.status(200).json({ message: "Update successful!" });

      }else{
        res.status(401).json({ message: "No authority" });
      }
    });
  }
);

app.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",//return data in json format
      posts: documents
    });
  });
});

app.get("/:id", (req, res, next) => {//have mongoose check the db for an ID
  Post.findById(req.params.id).then(post => {//find will get all entries, unless you specify
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});
//User can only delete if they made the post
app.delete("/:id", AuthorizationCheck, (req, res, next) => { //deleting from backend database based off ID
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.n > 0) {
      console.log(result);
      res.status(200).json({ message: "Update successful!" });

    }else{
      res.status(401).json({ message: "No authority" });
    }
  });
});

module.exports = app;
