require('dotenv').config(); // Load env variables

const { accountRoutes, menuRoutes } = require('./src/routes/MenuRoutes.js');
const { productRoutes } = require('./src/routes/ProductRoutes.js');
// const bodyParser = require('body-parser');
// const cors = require('cors');
const { initDatabase } = require('./src/utils/initMongoDB.js');

const fastify = require('fastify')();

// Connect to DB
initDatabase();


/** -------------------------------------------Account------------------------------------------------- */
fastify.register(menuRoutes, { prefix: '/api/menu' });
fastify.register(productRoutes, { prefix: '/api/product' });

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