const mongoose = require("mongoose");

const menuModel = new mongoose.Schema({
  articleId: mongoose.Schema.ObjectId,
  productIdList: [String]
});

const Menu = mongoose.model('Menu', menuModel);

module.exports = { Menu };