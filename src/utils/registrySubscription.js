const axios = require("axios");

module.exports = {
    subscribeToApiGateway: async() => {
        try {
            const response = await axios({
                method: "POST",
                baseURL: `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`,
                url: `/registry/services`,
                headers: { 'Content-Type': 'application/json' },
                data: {
                    serviceLabel: "Service Articles",
                    host: process.env.HOST,
                    port: process.env.PORT,
                    entrypointUrl: "/api/articles",
                    redirectUrl: "/api/articles",
                    routeProtections: [
                        { methods: ["POST"], route: "/menu", roles: ["restaurantOwner", "admin"] },
                        { methods: ["DELETE", "PUT", "PATCH"], route: "/menu/:menuId", roles: ["restaurantOwner", "admin"] },
                        { methods: ["POST"], route: "/products", roles: ["restaurantOwner", "admin"] },
                        { methods: ["DELETE", "PUT"], route: "/products/:productId", roles: ["restaurantOwner", "admin"] },
                    ]
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}