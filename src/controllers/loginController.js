const db = require('../models');
const Yup = require("yup");
const bcrypt = require("bcrypt");
const User = db.user;
const asyncHandler = require('express-async-handler')
const JwtService = require("../services/jwtServices.js");
const { BadRequestError, UnauthorizedError, ValidationError } = require("../utils/apiError.js");
const sendMail = require('../middlerwares/sendMail.js')
const crypto = require("crypto");


const   login= async (req, res) => {
        try {
            const token = JwtService.jwtSign(req.user.id);
            const refreshToken = JwtService.jwtSignIn(req.user.id);
            console.log("refreshToken", refreshToken);
            await User.update({ tokenRefresh: refreshToken }, { where: { id: req.user.id } });
            res.setHeader("Authorization", token);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({success:true,});
        } catch (error) {
            next(error);
        }
}
const refreshToken = async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ hay không
    const rs = await JwtService.jwtVerify(cookie.refreshToken)
    const user = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: user ? true : false,
        newAccessToken: user ? JwtService.jwtSign(user.id ) : 'Refresh token not matched'
    })
}

const   logout = async (req, res) => {
        try {
            JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));
            res.status(200).json({ msg: "Authorized" });
        } catch (error) {
            next(error);
        }
}
const forgotPassword = async (req, res) => {
    try{
        const { email } = req.query
        if (!email) throw new Error('Missing email')
        const user = await User.findOne({ email })
        if (!user) throw new Error('User not found')
        const resetToken = await user.createPasswordChangedToken()
        console.log("resetToke da luu chua");
        console.log("resetToken:", resetToken);
        await user.save();
        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/logins/reset-password/${resetToken}>Click here</a>`;
        const data = {
            email,
            html
        }
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
const resetPassword = async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) return  new Error('Missing imputs')
    console.log("password :" +password);
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) return new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
}

module.exports={
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
}
