const rateLimit = require('express-rate-limit');

// Fonction middleware personnalisée pour configurer la limite de taux
const createRateLimiter = (windowMs, max) => {
    return rateLimit({
        windowMs: windowMs, // Durée de la fenêtre en millisecondes
        max: max, // Nombre maximal de requêtes autorisées dans la fenêtre
        handler: (req, res, next) => {
            const cooldownRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
            res.status(429).send({
                error: `Too many requests, please try again in ${cooldownRemaining} seconds.`,
            });
        },
    });
};


exports.imgLimiter = createRateLimiter(2 * 60 * 1000, 1);