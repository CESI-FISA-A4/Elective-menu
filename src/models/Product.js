const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
  articleId: mongoose.Schema.Types.ObjectId,
  allergenList: [String],
  ingredientList: [String]
});

const Product = mongoose.model('Product', productModel);

module.exports = { Product };