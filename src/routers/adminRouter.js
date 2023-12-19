const adminsController = require("../controllers/adminController.js")

const router = require('express').Router()


router.post('/register',adminsController.registerAdmins)

router.post('/login',adminsController.loginAdmins)

router.get('/auth/me',adminsController.checkToken)

router.put('/changePassword',adminsController.verifyToken,adminsController.updatePassword)

router.get('/allUser',adminsController.verifyToken,adminsController.getAllUsers)

router.post('/oneUserByUsername',adminsController.verifyToken,adminsController.getUserByUsername)

router.post('/oneUserByEmail',adminsController.verifyToken,adminsController.getUserByEmail)

router.post('/oneUserBySDT',adminsController.verifyToken,adminsController.getUserByPhoneNumber)

module.exports = router