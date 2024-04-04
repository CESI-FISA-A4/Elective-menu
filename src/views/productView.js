const { Article } = require("../models/Article");
const { Menu } = require("../models/Menu");
const { Product } = require("../models/Product");
const { mongoose, isValidObjectId } = require("mongoose");

const errors = {
    invalidId: (() => {
      const err = Error("Invalid Id format");
      err.statusCode = 400;
      return err;
    })(),
    missingRequiredParams: (() => {
      const err = Error("Not all required parameters filled");
      err.statusCode = 400;
      return err;
    })(),
  }

module.exports = {    
    getAllProduct: async(req, res) => {
        var elements = [];
        const products = await Product.find();
        for(let i = 0; i < products.length; i++) {
            const article = await Article.findById(products[i].articleId);
            elements.push({ 
                articleId: article.id, 
                productId: products[i].id, 
                name: article.name, 
                price: article.price, 
                description: article.description, 
                restaurantId: article.restaurantId, 
                imageUrl: article.imageUrl, 
                allergenList: products[i].allergenList, 
                ingredientList: products[i].ingredientList 
            })
        }
        return elements;
    },
    getProductById: async(req, res) => {
        const {productId } = req.params.id;
        if (!isValidObjectId(productId)) return errors.invalidId;

        const product = await Product.findById(productId);
        const article = await Article.findById(product.articleId);
        var element  = { 
            articleId: article.id, 
            productId: product.id, 
            name: article.name, 
            price: article.price, 
            description: article.description, 
            restaurantId: article.restaurantId, 
            imageUrl: article.imageUrl, 
            allergenList: product.allergenList, 
            ingredientList: product.ingredientList 
        }
        return element;
    },
    getProductByRestaurantId: async(req, res) => {
        const { restaurantId } = req.params;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;

        var elements = [];
        const articles = await Article.find({restaurantId: restaurantId});
        for(let i = 0; i < articles.length; i++) {
            const product = await Product.findOne({articleId: articles[i].id});
            if(product) {
                elements.push({
                    articleId: articles[i].id, 
                    productId: product.id, 
                    name: articles[i].name, 
                    price: articles[i].price, 
                    description: articles[i].description, 
                    restaurantId: articles[i].restaurantId, 
                    imageUrl: articles[i].imageUrl, 
                    allergenList: product.allergenList, 
                    ingredientList: product.ingredientList 
                })
            }
        }
        return elements;
    },
    createProduct: async(req, res) => {
        const { name, price, description, restaurantId, imageUrl, allergenList, ingredientList } = req.body;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;

        const article = await Article.create({ name: name, price: price, description: description, restaurantId: restaurantId, imageUrl: imageUrl });
        const resultProduct = await Product.create({ articleId: article.id, allergenList, ingredientList });
        return `product ${resultProduct.id} created`;
    },
    deleteProduct: async(req, res) => {
        const { productId } = req.body;
        if (!isValidObjectId(productId)) return errors.invalidId;

        // delete the product
        const product = await Product.findById(productId);
        await Article.findByIdAndDelete(product.articleId);
        await Product.findByIdAndDelete(productId);
        
        // delete in menus
        await Menu.updateMany({ }, { $pull: { productIdList: { $in: [ productId ]} } })

        return `product ${productId} deleted`;
    },
    updateProduct: async(req, res) => {
        const { productId, name, price, description, restaurantId, imageUrl, allergenList, ingredientList } = req.body;
        if (!isValidObjectId(productId)) return errors.invalidId;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;

        const product = await Product.findOneAndUpdate({
            _id: productId
        }, {
            allergenList: allergenList, 
            ingredientList: ingredientList 
        });

        await Article.findOneAndUpdate({
            _id: product.articleId
        }, {
            name: name, 
            price: price, 
            description: description, 
            restaurantId: restaurantId, 
            imageUrl: imageUrl
        });

        return `product ${productId} updated`;
    }
}