const { getAllMenus, getMenuById, createMenu, deleteMenu, updateMenu, updateProductList, getMenuByRestaurantId } = require('../views/menuView');
const menuRoutes = function(instance, opts, next) {
    instance.get('/', getAllMenus);
    instance.get('/:id', getMenuById);
    instance.get('/restaurant/:restaurantId', getMenuByRestaurantId);
    instance.post('/create', createMenu);
    instance.post('/delete', deleteMenu);
    instance.post('/update', updateMenu);
    instance.post('/updateProduct', updateProductList);
    next();
};


module.exports = { menuRoutes };