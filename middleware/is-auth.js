const jwt = require('jsonwebtoken');
const { jsonwebtokensecret } = require('../utils/config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, jsonwebtokensecret);
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
}