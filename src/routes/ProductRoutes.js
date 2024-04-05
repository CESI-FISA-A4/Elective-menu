const { getProductById, getAllProduct, createProduct, deleteProduct, updateProduct, getProductByRestaurantId, getProductByName } = require('../views/productView')

const { schemaGetAllProduct, schemaGetProductById, schemaGetProductByRestaurantId, schemaGetProductByName, schemaCreateMenu, schemaCreateProduct, schemaUpdateProduct, schemaDeleteProduct } = require('../utils/swagger.schema');

const productRoutes = function(instance, opts, next) {
  instance.get('/', schemaGetAllProduct, getAllProduct);
  instance.get('/:productId', schemaGetProductById, getProductById);
  instance.get('/restaurant/:restaurantId', schemaGetProductByRestaurantId, getProductByRestaurantId);
  instance.get('/name/:productName', schemaGetProductByName, getProductByName);
  instance.post('/', schemaCreateProduct, createProduct);
  instance.delete('/:productId', schemaDeleteProduct, deleteProduct);
  instance.put('/:productId', schemaUpdateProduct,updateProduct);
    next();
};


module.exports = { productRoutes };