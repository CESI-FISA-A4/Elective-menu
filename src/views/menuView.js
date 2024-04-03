const { Menu } = require("../models/Menu");
const { Article } = require("../models/Article");
const { mongoose, isValidObjectId } = require("mongoose");
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
        const { menuId } = req.params.id;
        if (!isValidObjectId(menuId)) return errors.invalidId;

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
        const { name, price, description, restaurantId, imageUrl, productIdList } = req.body;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;

        // check if productId exist and convert it in ObjectId
        for(let i = 0; i < productIdList.length; i++) {
            if (!isValidObjectId(productIdList[i])) return errors.invalidId;
            const product = await Product.exists({_id: productIdList[i]});
            if(!product) return `${productIdList[i]} doesn't exist`; 
        }
        
        const article = await Article.create({ 
            name: name, 
            price: price, 
            description: description, 
            restaurantId: restaurantId, 
            imageUrl: imageUrl 
        });

        const resultMenu = await Menu.create({ 
            articleId: article.id, 
            productIdList: productObjectIdList 
        })

        return `menu ${resultMenu.id} created`;
    },
    deleteMenu: async(req, res) => {
        const { menuId } = req.body;
        if (!isValidObjectId(menuId)) return errors.invalidId;
        const menu = await Menu.findByIdAndDelete(menuId);
        await Article.findByIdAndDelete(menu.articleId);
        return `menu ${id} deleted`;
    },
    updateMenu: async(req, res) => {
        const { menuId, name, price, description, restaurantId, imageUrl, productIdList } = req.body;
        if (!isValidObjectId(menuId)) return errors.invalidId;
        if (!isValidObjectId(articleId)) return errors.invalidId;
        
        // check if productId exist and convert it in ObjectId
        for(let i = 0; i < productIdList.length; i++) {
            if (!isValidObjectId(productIdList[i])) return errors.invalidId;
            const product = await Product.exists({_id: productIdList[i]});
            if(!product) return `${objId} doesn't exist`; 
        }

        await Article.findOneAndUpdate({
            _id: articleId
        }, {
            name: name, 
            price: price, 
            description: description, 
            restaurantId: restaurantId, 
            imageUrl: imageUrl
        });

        await Menu.findOneAndUpdate({
            _id: menuId
        }, {
            articleId: articleObjectId, 
            productIdList: productIdList
        });
        
        return `menu ${menuId} updated`;
    },
    // this function is similar to update menu but allow only update in productIdList
    updateProductList: async(req, res) => {
        const { menuId, productIdList } = req.body;
        if (!isValidObjectId(menuId)) return errors.invalidId;
        
        for(let i = 0; i < productIdList.length; i++) {
            if (!isValidObjectId(productIdList[i])) return errors.invalidId;
            const product = await Product.exists({_id: productIdList[i]});
            if(!product) return `${productIdList[i]} doesn't exist`; 
        }

        await Menu.findOneAndUpdate({
            _id: menuObjectId
        }, {
            productIdList: productObjectIdList
        });
        return `productIdList in menu ${menuId} updated`;
    }
}