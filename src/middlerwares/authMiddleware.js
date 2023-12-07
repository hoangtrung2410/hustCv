const db = require('../models');
const JwtService = require("../services/jwtServices.js");
const { BadTokenError } = require("../utils/apiError.js");
const Yup = require("yup");
const User = db.user;
const {
    BadRequestError,
    UnauthorizedError,
    ValidationError,
} = require("../utils/apiError.js");

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

const authorization = async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return next(new BadRequestError("Invalid request body"));
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next(new BadRequestError("User not found"));
        }
        const isPasswordValid = await user.checkPassword(password);
        console.log("isPasswordValid", isPasswordValid);
        if (!isPasswordValid) {
            return next(new UnauthorizedError("Invalid password"));
        }
        req.user = user;
        req.isAuthenticated = true;
        return next();
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    authMiddleware,
    authorization
};
