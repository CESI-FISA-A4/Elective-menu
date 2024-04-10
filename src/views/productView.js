const { Article } = require("../models/Article");
const { Menu } = require("../models/Menu");
const { Product } = require("../models/Product");
const { mongoose, isValidObjectId } = require("mongoose");
const { Restaurant } = require("../models/Restaurant");

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
    idNotFound: (() => {
        const err = Error("Id not found");
        err.statusCode = 404;
        return err;
    })(),
    Unauthorized: (() => {
        const err = Error("Access denied");
        err.statusCode = 403;
        return err;
    })(),
  }

module.exports = { 
    ping: async(req,res)=>{
      return;
    },   
    getAllProduct: async(req, res) => {
        let elements = [];
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
        const { productId } = req.params;
        if (!isValidObjectId(productId)) return errors.invalidId;

        const product = await Product.findById(productId);
        if(product) {
            const article = await Article.findById(product.articleId);
            let element  = { 
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
        }
        else return errors.idNotFound;
    },
    getProductByRestaurantId: async(req, res) => {
        const { restaurantId } = req.params;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;

        let elements = [];
        const articles = await Article.find({restaurantId: restaurantId});
        if(articles.length <= 0) return errors.idNotFound;
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
    getProductByName: async(req, res) => {
        const { productName } = req.params;

        let elements = [];
        const articles = await Article.find({name: { '$regex' : productName, '$options' : 'i' }});
        if(articles.length <= 0) return errors.idNotFound;
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
        const restaurant = await Restaurant.findById(restaurantId)
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        const article = await Article.create({ 
            name: name, 
            price: price, 
            description: description, 
            restaurantId: restaurantId, 
            imageUrl: imageUrl });

        const product = await Product.create({ 
            articleId: article.id, 
            allergenList: allergenList, 
            ingredientList: ingredientList });

        return `product ${product.id} created`;
    },
    deleteProduct: async(req, res) => {
        const { productId } = req.params;
        if (!isValidObjectId(productId)) return errors.invalidId;

        const product = await Product.findById(productId);
        const article = await Article.findById(product.articleId);
        const restaurant = await Restaurant.findById(article.restaurantId);
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        // delete the product
        if(product) {
            await Product.findByIdAndDelete(productId);
            await Article.findByIdAndDelete(product.articleId);
        }
        else return errors.idNotFound;

        // delete in menus
        await Menu.updateMany({ }, { $pull: { productIdList: { $in: [ productId ]} } })

        return `product ${productId} deleted`;
    },
    updateProduct: async(req, res) => {

        const { productId } = req.params;
        const { name, price, description, restaurantId, imageUrl, allergenList, ingredientList } = req.body;
        if (!isValidObjectId(productId)) return errors.invalidId;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;
        const restaurant = await Restaurant.findById(restaurantId);
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        const product = await Product.findOneAndUpdate({
            _id: productId
        }, {
            allergenList: allergenList, 
            ingredientList: ingredientList 
        });

        if(product) {
            await Article.findOneAndUpdate({
                _id: product.articleId
            }, {
                name: name, 
                price: price, 
                description: description, 
                restaurantId: restaurantId, 
                imageUrl: imageUrl
            });
        }
        else return errors.idNotFound;

        return `product ${productId} updated`;
    }
}