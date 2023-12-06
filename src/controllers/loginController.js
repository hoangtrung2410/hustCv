const db = require('../models');
const Yup = require("yup");
const bcrypt = require("bcrypt");
const User = db.user;
const JwtService = require("../services/jwtServices.js");
// const {
//     BadRequestError,
//     UnauthorizedError,
//     ValidationError,
// } = require("../utils/apiError.js");


const   login= async (req, res, next) => {
        try {
            const token = JwtService.jwtSign(req.user.id);
            res.setHeader("Authorization", token);
            return res.status(200).json({success:true,});
        } catch (error) {
            next(error);
        }
}
const    logout = async (req, res, next) => {
        try {
            JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));

            res.status(200).json({ msg: "Authorized" });
        } catch (error) {
            next(error);
        }
}
module.exports={
    login,
    logout
}
