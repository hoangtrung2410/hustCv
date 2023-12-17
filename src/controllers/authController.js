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
            return res.status(401).json({error: "Invalid credentials"});
        }
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({error: "Invalid credentials"});
        }
        const accessToken = JwtService.jwtSign({userId: user.id, roleId: user.role_id}, {expiresIn: "-10s"});
        console.log("Generated Access Token:", accessToken);
        const millisecondsInOneDay = 24 * 60 * 60 * 1000;
        const checkDate = Date.now() - user.timeCreateRefreshToken;
        let refreshToken = user.refreshToken;
        if (user.timeCreateRefreshToken === 0 || checkDate > 6 * millisecondsInOneDay) {
            refreshToken = JwtService.jwtSign({userId: user.id, roleId: user.role_id}, {expiresIn: "7d"});
            await User.update(
                {refreshToken, timeCreateRefreshToken: Date.now()},
                {where: {id: user.id}}
            );
        } else {
            console.log("Duration is not greater than 6 days");
        }
        const {password: hashedPassword, ...userData} = user.get();
        const resBody = {
            success: true,
            accessToken,
            refreshToken,
            userData
        };
        return res.status(200).json(resBody);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
};

const refreshToken = async (req, res) => {
    console.log(">>>>>>>>123")

    const refreshToken = req?.body?.refreshToken
    // Check xem có token hay không
    if (!refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ hay không
    const rs = await JwtService.jwtVerify(refreshToken)
    console.log("rs:", rs)
    const response = await User.findOne({id: rs._id, refreshToken: refreshToken})
    console.log("response:", response)
    return res.status(200).json({
        success: response ? true : false,
        accessToken: response ? JwtService.jwtSign(rs, {expiresIn: '1d'}) : null
    })
}

const logout = async (req, res) => {
    try {
        JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req));
        console.log(">>>>>>2 " + JwtService.jwtGetToken(req))
        return res.status(200).json({success: true, message: 'Logout successful'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};
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
        const user = await User.findOne({passwordCode, codeResetExpires: {$gt: Date.now()}})
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
    refreshToken,
    checkCode,
    forgotPassword,
    resetPassword
}
