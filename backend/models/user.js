const uniqueVal = require("mongoose-unique-validator"); //mongoose runs extra validation on schema
const mongoose = require ("mongoose");

const usersSchema = mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true } //make email unique
});

usersSchema.plugin(uniqueVal); //validation in place

module.exports = mongoose.model("User", usersSchema);
