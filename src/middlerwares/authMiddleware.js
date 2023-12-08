const db = require('../models');
const JwtService = require("../services/jwtServices.js");
const {BadTokenError} = require("../utils/apiError.js");

const authMiddleware = async (req, res, next) => {
    try {
        if (process.env.SERVER_JWT === "false") return next();

        const token = JwtService.jwtGetToken(req);

        const decoded = JwtService.jwtVerify(token);

        req.userId = decoded;

        return next();
    } catch (error) {
        return next(new BadTokenError());
    }
};
module.exports = {
    authMiddleware,
};
