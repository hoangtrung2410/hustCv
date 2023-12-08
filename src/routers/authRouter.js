const authController = require("../controllers/authController.js")
const authMiddleware = require("../middlerwares/authMiddleware.js")
const router = require('express').Router()

router.post('/login', authController.login)
router.get('/logout', authMiddleware.authMiddleware, authController.logout)
router.post('/refreshToken', authController.refreshToken)
router.get('/forgotPassword', authController.forgotPassword)
router.put('/resetPassword', authController.resetPassword)

module.exports = router