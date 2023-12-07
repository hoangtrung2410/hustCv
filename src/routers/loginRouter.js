const loginController = require("../controllers/loginController.js")
const authMiddleware =require ("../middlerwares/authMiddleware.js")
const router = require('express').Router()

router.post('/',authMiddleware.authorization,loginController.login)
router.get('/',authMiddleware.authMiddleware,loginController.logout)
router.post('/refreshToken',loginController.refreshToken)
router.get('/forgotPassword', loginController.forgotPassword)
router.put('/resetPassword', loginController.resetPassword)

module.exports = router