const mongoose = require("mongoose");

const articleModel = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  restaurantId:	mongoose.Schema.Types.ObjectId,
  imageUrl: String
});

const Article = mongoose.model('Article', articleModel);

module.exports = { Article };