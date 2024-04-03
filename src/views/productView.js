const { Article } = require("../models/Article");
const { Menu } = require("../models/Menu");
const { Product } = require("../models/Product");
var mongoose = require("mongoose");

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
        const productId = req.params.id;
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
    createProduct: async(req, res) => {
        const { name, price, description, restaurantId, imageUrl, allergenList, ingredientList } = req.body;
        const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);
        const article = await Article.create({ name: name, price: price, description: description, restaurantId: restaurantObjId, imageUrl: imageUrl });
        const articleId = article.id;
        const resultProduct = await Product.create({ articleId: articleId, allergenList, ingredientList });
        return `product ${resultProduct.id} created`;
    },
    deleteProduct: async(req, res) => {
        const { productId } = req.body;
        
        // delete the product 
        const product = await Product.findById(productId);
        await Article.findByIdAndDelete(product.articleId);
        await Product.findByIdAndDelete(productId);
        
        // delete in menus
        await Menu.updateMany({ }, { $pull: { productIdList: { $in: [ productId ]} } })

        return `product ${productId} deleted`;
    },
    updateProduct: async(req, res) => {
        const { articleId, productId, name, price, description, restaurantId, imageUrl, allergenList, ingredientList } = req.body;
        const articleObjectId = new mongoose.Types.ObjectId(articleId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        
        await Article.findOneAndUpdate({
            _id: articleObjectId
        }, {
            name: name, 
            price: price, 
            description: description, 
            restaurantId: restaurantId, 
            imageUrl: imageUrl
        });

        await Product.updateOne({
            _id: productObjectId
        }, {
            articleId: articleObjectId, 
            allergenList: allergenList, 
            ingredientList: ingredientList 
        });
5
        return `product ${productId} updated`;
    }
}