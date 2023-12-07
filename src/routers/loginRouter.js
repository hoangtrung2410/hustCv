const loginController = require("../controllers/loginController.js")
const authMiddleware =require ("../middlerwares/authMiddleware.js")
const router = require('express').Router()

router.post('/',authMiddleware.authorization,loginController.login)
router.get('/',authMiddleware.authMiddleware,loginController.logout)
router.post('/refreshToken',loginController.refreshToken)
router.get('/forgotpassword', loginController.forgotPassword)
router.put('/resetpassword', loginController.resetPassword)

module.exports = router