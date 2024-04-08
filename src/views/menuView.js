const { Menu } = require("../models/Menu");
const { Article } = require("../models/Article");
const { mongoose, isValidObjectId } = require("mongoose");
const { Product } = require("../models/Product");
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
    getAllMenus: async(req, res) => {
        let elements = [];
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
        const { menuId } = req.params;
        if (!isValidObjectId(menuId)) return errors.invalidId;

        const menu = await Menu.findById(menuId);
        if(menu) {
            const article = await Article.findById(menu.articleId);
            let element  = { 
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
        }
        else return errors.idNotFound;
    },
    getMenuByRestaurantId: async(req, res) => {
        const { restaurantId } = req.params;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;

        let elements = [];
        const articles = await Article.find({restaurantId: restaurantId});
        if(articles.length <= 0) error.idNotFound;
        for(let i = 0; i < articles.length; i++) {
            const menu = await Menu.findOne({articleId: articles[i].id});
            if(menu) {
                elements.push({
                    articleId: articles[i].id, 
                    menuId: menu.id, 
                    name: articles[i].name, 
                    price: articles[i].price, 
                    description: articles[i].description, 
                    restaurantId: articles[i].restaurantId, 
                    imageUrl: articles[i].imageUrl, 
                    productIdList: menu.productIdList
                })
            }
        }
        return elements;
    },
    getMenuByName: async(req, res) => {
        const { menuName } = req.params;

        let elements = [];
        const articles = await Article.find({name: { '$regex' : menuName, '$options' : 'i' }});
        if(articles.length <= 0) return error.idNotFound;
        for(let i = 0; i < articles.length; i++) {
            const menu = await Menu.findOne({articleId: articles[i].id});
            if(menu) {
                elements.push({
                    articleId: articles[i].id, 
                    menuId: menu.id, 
                    name: articles[i].name, 
                    price: articles[i].price, 
                    description: articles[i].description, 
                    restaurantId: articles[i].restaurantId, 
                    imageUrl: articles[i].imageUrl, 
                    productIdList: menu.productIdList
                })
            }
        }
        return elements;
    },
    createMenu: async(req, res) => {
        const { name, price, description, restaurantId, imageUrl, productIdList } = req.body;
        if (!isValidObjectId(restaurantId)) return errors.invalidId;
        const restaurant = await Restaurant.findById(restaurantId);
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        // check if productId exist
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
            productIdList: productIdList 
        })

        return `menu ${resultMenu.id} created`;
    },
    deleteMenu: async(req, res) => {
        const { menuId } = req.params;
        if (!isValidObjectId(menuId)) return errors.invalidId;
        
        const menu = await Menu.findById(menuId);
        const article = await Article.findById(menu.articleId);
        const restaurant = await Restaurant.findById(article.restaurantId);
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        if(!menu) return errors.idNotFound;
        await Menu.findByIdAndDelete(menuId);
        await Article.findByIdAndDelete(menu.articleId);
        return `menu ${menuId} deleted`;
    },
    updateMenu: async(req, res) => {
        const { menuId } = req.params;
        const { name, price, description, restaurantId, imageUrl, productIdList } = req.body;
        if (!isValidObjectId(menuId)) return errors.invalidId;
        const restaurant = await Restaurant.findById(restaurantId);
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        // check if productId exist and convert it in ObjectId
        for(let i = 0; i < productIdList.length; i++) {
            if (!isValidObjectId(productIdList[i])) return errors.invalidId;
            const product = await Product.exists({_id: productIdList[i]});
            if(!product) return `${objId} doesn't exist`; 
        }

        const menu = await Menu.findOneAndUpdate({
            _id: menuId
        }, {
            productIdList: productIdList
        });
        if(menu) {
            await Article.findOneAndUpdate({
                _id: menu.articleId
            }, {
                name: name, 
                price: price, 
                description: description, 
                restaurantId: restaurantId, 
                imageUrl: imageUrl
            });
        }
        else return idNotFound;

        return `menu ${menuId} updated`;
    },
    // this function is similar to update menu but allow only update in productIdList
    updateProductList: async(req, res) => {
        const { menuId } = req.params;
        const { productIdList } = req.body;
        if (!isValidObjectId(menuId)) return errors.invalidId;
        
        for(let i = 0; i < productIdList.length; i++) {
            if (!isValidObjectId(productIdList[i])) return errors.invalidId;
            const product = await Product.exists({_id: productIdList[i]});
            if(!product) return `${productIdList[i]} doesn't exist`; 
        }
        const menu = await Menu.findById(menuId);
        const article = await Article.findById(menu.articleId);
        const restaurant = await Restaurant.findById(article.restaurantId);
        if(req.query.roleLabel != 'admin' && req.query.userId != restaurant.restaurantOwnerId) return errors.Unauthorized;

        if(!menu) return errors.idNotFound;
        await Menu.findOneAndUpdate({
            _id: menuId
        }, {
            productIdList: productIdList
        });
        return `productIdList in menu ${menuId} updated`;
    }
}