const { getProductById, getAllProduct, createProduct, deleteProduct, updateProduct, getProductByRestaurantId } = require('../views/productView')
const productRoutes = function(instance, opts, next) {
  instance.get('/', getAllProduct);
  instance.get('/:id', getProductById);
  instance.get('/restaurant/:restaurantId', getProductByRestaurantId);
  instance.post('/create', createProduct);
  instance.post('/delete', deleteProduct);
  instance.post('/update', updateProduct);
    next();
};


module.exports = { productRoutes };