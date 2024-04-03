const jwtUtils = require('../utils/jwt.utils');
const { getUserById } = require('../controllers/usersController');
const { getDatabaseConnection } = require('../utils/initBDD');

const bddConnection = getDatabaseConnection(); // MYSQL CONNECTOR

exports.authMid = (req, res, next) => { //This midleware check the token and share the userId return
    console.log("Auth mid");
    var headerAuth = req.headers['authorization']; //Get the token
    var userId = jwtUtils.getUserId(headerAuth); //Check if it exist and get the userId

    if (userId < 0) return res.status(400).send({ 'error': 'wrong token' });

    req.auth = { userId };

    next();
}

exports.adminCheckMid = async(req, res, next) => {
    console.log("Admin mid");
    let userId = req.auth.userId;

    let userResponse = await getUserById(bddConnection, userId);
    let user = userResponse[0];

    if (user.admin != 1) return res.status(403).send({ 'error': 'access forbidden' });

    next();
}