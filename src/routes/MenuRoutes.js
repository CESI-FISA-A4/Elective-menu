const { getAllMenus, getMenuById, createMenu, deleteMenu } = require('../views/menuView');
const menuRoutes = function(instance, opts, next) {
    instance.get('/', getAllMenus);
    instance.get('/:id', getMenuById);
    instance.post('/create', createMenu);
    instance.post('/delete', deleteMenu);
    next();
};


module.exports = { menuRoutes };