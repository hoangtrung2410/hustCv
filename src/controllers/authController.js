const db = require('../models');
const User = db.user;
const crypto = require('crypto');
const JwtService = require("../services/jwtServices.js");
const {BadRequestError, UnauthorizedError, ValidationError} = require("../utils/apiError.js");
const sendMail = require('../middlerwares/sendMail.js')
let resetUserId;

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw new BadRequestError("User not found");
        }
        const isPasswordValid = await user.checkPassword(password);
        console.log("isPasswordValid", isPasswordValid);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid password");
        }

        const accessToken = JwtService.jwtSign(user.id, {expiresIn: "1h"});
        const refreshToken = JwtService.jwtSign(user.id, {expiresIn: "7d"});
        //Todo:
        const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 1 ngày có 24 giờ, mỗi giờ có 60 phút, mỗi phút có 60 giây, mỗi giây có 1000 milliseconds
        let checkDate = Date.now() - user.timeCreateRefreshToken;
        console.log(checkDate)
        if (user.timeCreateRefreshToken === 0 || checkDate > 6 * millisecondsInOneDay) {
            await User.update({tokenRefresh: refreshToken, timeCreateRefreshToken: Date.now()}, {where: {id: user.id}});
        } else {
            console.log("Duration is not greater than 6 days");
        }
        const {password: hashedPassword, ...userData} = user.get();
        const resBody = {
            accessToken,
            refreshToken,
            userData
        }
        console.log("Run in here")
        console.log(resBody)
        return res.status(200).json(resBody);
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}
// const refreshToken = async (req, res) => {
//     const cookie = req.cookies
//     if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
//     const rs = await JwtService.jwtVerify(cookie.refreshToken)
//     const user = await User.findOne({_id: rs._id, refreshToken: cookie.refreshToken})
//     return res.status(200).json({
//         success: user ? true : false,
//         newAccessToken: user ? JwtService.jwtSign(user.id) : 'Refresh token not matched'
//     })
// }

const logout = async (req, res) => {
    try {
        JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));
        res.status(200).json({msg: "Authorized"});
    } catch (error) {
        next(error);
    }
}
const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body
        console.log("email:", email);
        if (!email) {
            return (res.status(400).json({success: false, mes: "Email không tồn tại"}))
        }
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw new BadRequestError("User not found");
        }
        console.log("user có tồn tai");
        const verificationCode = await user.createPasswordChangedToken()
        console.log("code da luu chua");
        console.log("code:", verificationCode);
        await user.save();
        console.log("user da luu ");
        const passwordCode = crypto.createHash('sha256').update(verificationCode.toString()).digest('hex');
        console.log("hashedToken:", passwordCode);
        const html = `Chúc mừng bạn đến với HustCv, đây là mã code của bạn: ${verificationCode}. Mã này sẽ hết hạn trong 15 phút.`;
        const data = {
            email,
            html
        }
        console.log(data);
        const rs = await sendMail(data)
        return res.status(200).json({
            success: true,
            rs
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            mes: error.message
        })
    }
}

const checkCode = async (req, res) => {
    try {
        const {verificationCode} = req.body;
        console.log("verificationCode:", verificationCode)
        if (!verificationCode) throw new Error('Missing inputs');
        console.log("code :" + verificationCode);
        const passwordCode = crypto.createHash('sha256').update(verificationCode.toString()).digest('hex');
        console.log("hashedToken:", passwordCode);
        const user = await User.findOne({where: {passwordCode}})
        console.log("user:", user.id);
        if (!user) {
            res.status(400).json({success: false, mes: "Mã code không tồn tại"})
        }
        resetUserId = user.id;
        console.log("resetUserId:", resetUserId)
        res.status(200).json({success: true, mes: "Mã code hợp lệ"})
    } catch (error) {
        console.error('Error in checkCode:', error.message);
        res.status(500).json({success: false, mes: error.message})
        return false;
    }
};

const resetPassword = async (req, res) => {
    try {
        const {newPassword} = req.body;
        console.log("password: " + req.body);
        if (!newPassword) return res.status(400).json({success: false, message: 'Missing inputs'});
        const user = await User.findOne({where: {id: resetUserId}});
        if (!user) return res.status(404).json({success: false, message: 'User not found'});
        console.log("user_reset:", user.id);
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordChangedAt = Date.now();
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Something went wrong'});
    }
};


module.exports = {
    login,
    logout,
    // refreshToken,
    checkCode,
    forgotPassword,
    resetPassword
}
