require('dotenv').config(); // Load env variables

const { menuRoutes } = require('./src/routes/MenuRoutes.js');
const { productRoutes } = require('./src/routes/ProductRoutes.js')
const { initDatabase } = require('./src/utils/initMongoDB.js');
const { setupSwagger } = require('./src/utils/swagger');
const { subscribeToApiGateway } = require('./src/utils/registrySubscription');

const fastify = require('fastify')();

// Connect to DB
initDatabase();
setupSwagger(fastify);
subscribeToApiGateway();

/** -------------------------------------------Account------------------------------------------------- */
fastify.register(menuRoutes, { prefix: '/api/articles/menus' });
fastify.register(productRoutes, { prefix: '/api/articles/products' });

/**--------------------------------------------Start server--------------------------------------------- */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

fastify.listen({ port: PORT, host: HOST }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server started : ${PORT}`);
})