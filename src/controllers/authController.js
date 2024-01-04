const db = require('../models');
const User = db.user;
const { Op } = require("sequelize");
const crypto = require('crypto');
const Yup = require('yup');
const JwtService = require("../services/jwtServices.js");
const { BadRequestError, UnauthorizedError, ValidationError } = require("../utils/apiError.js");
const sendMail = require('../middlerwares/sendMail.js')
const login = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            email: Yup.string().email().required().test(
                'is-gmail',
                'Email must be a Gmail address',
                (value) => {
                    if (value) {
                        return value.endsWith('@gmail.com');
                    }
                    return false;
                }
            ),
            password: Yup.string().required(),
        });
        console.log(">>>>>>1")

        try {
            await schema.validate(req.body);
        } catch (e) {
            console.error(e)
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
                error: e.errors
            }
            );
        }
        let { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized",
                error: 'User does not exist'
            });
        }
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized",
                error: 'Invalid password.'
            });
        }
        const accessToken = JwtService.jwtSign({ userId: user.id, roleId: user.role_id }, { expiresIn: "-10s" });
        console.log("Generated Access Token:", accessToken);
        const millisecondsInOneDay = 24 * 60 * 60 * 1000;
        const checkDate = Date.now() - user.timeCreateRefreshToken;
        let refreshToken = user.refreshToken;
        if (user.timeCreateRefreshToken === 0 || checkDate > 6 * millisecondsInOneDay) {
            refreshToken = JwtService.jwtSign({ userId: user.id, roleId: user.role_id }, { expiresIn: "7d" });
            await User.update(
                { refreshToken, timeCreateRefreshToken: Date.now() },
                { where: { id: user.id } }
            );
        } else {
            console.log("Duration is not greater than 6 days");
        }
        console.log("refreshToken" + refreshToken)
        const { password: hashedPassword, ...userData } = user.get();
        const resBody = {
            accessToken,
            refreshToken,
            userData
        };

        return res.status(200).json({
            statusCode: 200,
            message: "OK",
            resBody,
        });
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: e.errors
        });
    }
};
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req?.body?.refreshToken
        if (!refreshToken)
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized",
                error: 'Invalid password.'
            });
        const rs = await JwtService.jwtVerify(refreshToken)
        console.log("rs:", rs)
        const response = await User.findOne({ id: rs._id, refreshToken: refreshToken })
        console.log("response:", response)
        return res.status(200).json({
            success: response ? true : false,
            accessToken: response ? JwtService.jwtSign(rs, { expiresIn: '1d' }) : null
        })
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
}

const logout = async (req, res) => {
    try {
        JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));
        console.log(">>>>>>2 " + JwtService.jwtGetToken(req))
        return res.status(200).json({
            statusCode: 200,
            message: 'Logout successful'
        });
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: e.errors
        });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            email: Yup.string().email().required().test(
                'is-gmail',
                'Email must be a Gmail address',
                (value) => {
                    if (value) {
                        return value.endsWith('@gmail.com');
                    }
                    return false;
                }
            ),
        });
        try {
            await schema.validate(req.body);
        } catch (e) {
            console.error(e)
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
                error: e.errors
            }
            );
        }
        let { email } = req.body;

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        email: email,
                        status: true
                    },
                ],
            },
        });
        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized",
                error: 'User does not exist'
            });
        }
        console.log("user có tồn tai");
        const verificationCode = await user.createPasswordChangedToken()
        console.log("code da luu chua");
        console.log("code:", verificationCode);
        await user.save();
        resetUserId = user.id;
        console.log(">>>>>>!>>>>>!>>>>1>" + resetUserId)
        console.log("user da luu ");
        const passwordCode = crypto.createHash('sha256').update(verificationCode.toString()).digest('hex');
        console.log("passwordCode:", passwordCode);
        const html = `Chúc mừng bạn đến với GoodBody, đây là mã code của bạn: ${verificationCode}. Mã này sẽ hết hạn trong 15 phút.`;
        const text = {
            email,
            html
        }
        console.log(text);
        const rs = await sendMail(text)
        return res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: rs
        })
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: e.errors
        })
    }
}
const checkCode = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            email: Yup.string().required(),
            verificationCode: Yup.number().required(),
        });
        try {
            await schema.validate(req.body);
        } catch (e) {
            console.error(e);
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
                error: e.errors,
            });
        }
        console.log("verificationCode");
        const { email, verificationCode } = req.body;
        console.log("code:", verificationCode);
        const hashedVerificationCode = crypto
            .createHash("sha256")
            .update(verificationCode.toString())
            .digest("hex");
        console.log("hashedToken:", hashedVerificationCode);
        const user = await User.findOne({
            where: {
                email: email,
                passwordCode: hashedVerificationCode,
                codeResetExpires: {
                    [Op.gt]: Date.now(),
                },
            },
        });

        if (!user)
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
            });

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            notification: "Valid code",
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: e.errors
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            email: Yup.string().required(),
            newPassword: Yup.string().required().min(8),
        });
        let { email, newPassword } = req.body
        try {
            await schema.validate(req.body);
        } catch (e) {
            console.error(e)
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
                error: e.errors
            }
            );
        }
        console.log("newPassword: ", +newPassword);
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
            });
        }
        user.password = newPassword;
        user.passwordCode = null;
        user.passwordChangedAt = Date.now();
        user.codeResetExpires = null;
        await user.save();
        return res.status(200).json({
            statusCode: 200,
            message: 'OK',
            notification: "Password updated"
        });
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: e.errors
        })
    }
};
module.exports = {
    login,
    logout,
    checkCode,
    forgotPassword,
    refreshToken,
    resetPassword
}
