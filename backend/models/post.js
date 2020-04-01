const mongoose = require('mongoose');

const postSchema = mongoose.Schema({ //pass a javascript object to the schema
  title: { type: String, required: true },
  content: { type: String, required:true }
});

module.exports = mongoose.model('Post', postSchema); //pass the Post model and the Post schema
