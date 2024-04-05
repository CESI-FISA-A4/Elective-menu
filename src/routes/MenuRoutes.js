const { schemaGetAllMenu, schemaGetMenuById, schemaGetMenuByRestaurantId, schemaGetMenuByName, schemaCreateMenu, schemaDeleteMenu, schemaUpdateMenu, schemaUpdateProductList } = require('../utils/swagger.schema');
const { getAllMenus, getMenuById, createMenu, deleteMenu, updateMenu, updateProductList, getMenuByRestaurantId, getMenuByName } = require('../views/menuView');
const menuRoutes = function(instance, opts, next) {
    instance.get('/', schemaGetAllMenu, getAllMenus);
    instance.get('/:menuId', schemaGetMenuById, getMenuById);
    instance.get('/restaurant/:restaurantId', schemaGetMenuByRestaurantId, getMenuByRestaurantId);
    instance.get('/name/:menuName', schemaGetMenuByName, getMenuByName);
    instance.post('/', schemaCreateMenu, createMenu);
    instance.delete('/:menuId', schemaDeleteMenu, deleteMenu);
    instance.put('/:menuId', schemaUpdateMenu, updateMenu);
    instance.patch('/:menuId', schemaUpdateProductList, updateProductList);
    next();
};


module.exports = { menuRoutes };