const { Menu } = require("../models/Menu");
const { Article } = require("../models/Article");
var mongoose = require("mongoose");
const { Product } = require("../models/Product");

module.exports = {
    getAllMenus: async(req, res) => {
        var elements = [];
        const menus = await Menu.find();
        for(let i = 0; i < menus.length; i++) {
            const article = await Article.findById(menus[i].articleId);
            elements.push({ 
                articleId: article.id, 
                menuId: menus[i].id, 
                name: article.name, 
                price: article.price, 
                description: article.description, 
                restaurantId: article.restaurantId, 
                imageUrl: article.imageUrl, 
                productIdList: menus[i].productIdList
            })
        }
        return elements;
    },
    getMenuById: async(req, res) => {
        const menuId = req.params.id;
        const menu = await Menu.findById(menuId);
        const article = await Article.findById(menu.articleId);
        var element  = { 
            articleId: article.id, 
            menuId: menu.id, 
            name: article.name, 
            price: article.price, 
            description: article.description, 
            restaurantId: article.restaurantId, 
            imageUrl: article.imageUrl, 
            productIdList: menu.productIdList
        }
        return element;
    },
    createMenu: async(req, res) => {
        const { Name, Price, Description, RestaurantId, ImageUrl, productIdList } = req.body;
        var productObjectIdList = [];
        // check if productId exist and convert it in ObjectId
        for(let i = 0; i < productIdList.length; i++) {
            const objId = new mongoose.Types.ObjectId(productIdList[i]);
            const product = await Product.exists({_id: objId});
            if(!product) return `${objId} doesn't exist`; 
            productObjectIdList.push(objId);
        }
        const RestaurantObjId = new mongoose.Types.ObjectId(RestaurantId);
        const resultArticle = await Article.create({ 
            name: Name, 
            price: Price, 
            description: Description, 
            restaurantId: RestaurantObjId, 
            imageUrl: ImageUrl 
        });
        const ArticleId = resultArticle.id;
        const resultMenu = await Menu.create({ 
            articleId: ArticleId, 
            productIdList: productObjectIdList 
        })
        return `menu ${resultMenu.id} created`;
    },
    deleteMenu: async(req, res) => {
        const { id } = req.body;
        const menu = await Menu.findById(id);
        await Article.findByIdAndDelete(menu.articleId);
        await Menu.findByIdAndDelete(id);
        return `menu ${id} deleted`;
    },
    updateMenu: async(req, res) => {
        const { articleId, menuId, name, price, description, restaurantId, imageUrl, productIdList } = req.body;
        const articleObjectId = new mongoose.Types.ObjectId(articleId);
        const menuObjectId = new mongoose.Types.ObjectId(menuId);
        
        var productObjectIdList = [];
        // check if productId exist and convert it in ObjectId
        for(let i = 0; i < productIdList.length; i++) {
            const objId = new mongoose.Types.ObjectId(productIdList[i]);
            const product = await Product.exists({_id: objId});
            if(!product) return `${objId} doesn't exist`; 
            productObjectIdList.push(objId);
        }

        await Article.findOneAndUpdate({
            _id: articleObjectId
        }, {
            name: name, 
            price: price, 
            description: description, 
            restaurantId: restaurantId, 
            imageUrl: imageUrl
        });

        await Menu.findOneAndUpdate({
            _id: menuObjectId
        }, {
            articleId: articleObjectId, 
            productIdList: productObjectIdList
        });
        
        return `menu ${menuId} updated`;
    }
}