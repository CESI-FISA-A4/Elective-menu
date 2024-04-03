const { getAllMenus, getMenuById, createMenu, deleteMenu, updateMenu } = require('../views/menuView');
const menuRoutes = function(instance, opts, next) {
    instance.get('/', getAllMenus);
    instance.get('/:id', getMenuById);
    instance.post('/create', createMenu);
    instance.post('/delete', deleteMenu);
    instance.post('/update', updateMenu);
    next();
};


module.exports = { menuRoutes };