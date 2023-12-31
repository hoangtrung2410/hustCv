const db = require('../models');
const JwtService = require("../services/jwtServices.js");
const {BadTokenError} = require("../utils/apiError.js");

const authMiddleware = async (req, res, next) => {
    try {
        if (process.env.SERVER_JWT === "false") return next();
        console.log(">>>>>>>token1<<<<<<<<<");
        const token = JwtService.jwtGetToken(req);
        console.log("Received Token in Middleware:", token);
        const decoded = JwtService.jwtVerify(token);
        console.log("Decoded Token in Middleware:", decoded);
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        next(new BadTokenError())
    }
};
const isEmployer = async (req, res, next) => {
    try {
        if (process.env.SERVER_JWT === "false") return next()
        console.log(">>>>>>>token <<<<<<<<<");
        const token = JwtService.jwtGetToken(req)
        console.log("Received Token in Middleware:", token);
        const decoded = JwtService.jwtVerify(token);
        console.log("Decoded Token in Middleware:", decoded);
        if (!decoded.roleId) {
            return res.status(403).json("You need sign in")
        }
        if (decoded.roleId !== 1) {
            return res.status(401).json("You don't have employer")
        }
        req.userId = decoded.userId;
        return next()
    } catch (error) {
        next(new BadTokenError())
    }

}
const isJobSeeker = async (req, res, next) => {
    try {
        if (process.env.SERVER_JWT === "false") return next()
        console.log(">>>>>>>token <<<<<<<<<");
        const token = JwtService.jwtGetToken(req)
        console.log("Received Token in Middleware:", token);
        const decoded = JwtService.jwtVerify(token);
        console.log("Decoded Token in Middleware:", decoded);
        if (!decoded.roleId) {
            return res.status(403).json("You need sign in")
        }
        if (decoded.roleId !== 2) {
            return res.status(403).json("You don't have job seekers")
        }
        req.userId = decoded.userId;
        return next()
    } catch (error) {
        next(new BadTokenError())
    }

}
module.exports = {
    authMiddleware,
    isEmployer,
    isJobSeeker
};
