const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imgPath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true } //creating creator so we know who made a post
});

module.exports = mongoose.model("Post", postSchema);
