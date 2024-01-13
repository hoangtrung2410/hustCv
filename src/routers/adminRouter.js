const { ControlTower } = require("aws-sdk")
const adminsController = require("../controllers/adminController.js")

const router = require('express').Router()


router.post('/register',adminsController.registerAdmins)

router.post('/login',adminsController.loginAdmins)

router.get('/auth/me',adminsController.checkToken)

router.put('/changePassword',adminsController.verifyToken,adminsController.updatePassword)

router.put('/updateUser/:id',adminsController.verifyToken,adminsController.updateUser)

router.get('/allUser',adminsController.verifyToken,adminsController.getRanDomUsers)

router.post('/allUserByUsername',adminsController.verifyToken,adminsController.getUserByUsername)

router.post('/allUserByEmail',adminsController.verifyToken,adminsController.getUserByEmail)

router.post('/allUserBySDT',adminsController.verifyToken,adminsController.getUserByPhoneNumber)

router.post('/allEmailPhoneNumber',adminsController.verifyToken,adminsController.getUserByEmailAndPhoneNumber)

router.post('/allEmailUserName',adminsController.verifyToken,adminsController.getUserByEmailAndUsername)

router.post('/allUsernamePhoneNumber',adminsController.verifyToken,adminsController.getUserByUsernameAndPhoneNumber)

router.post('/allUserCheck',adminsController.verifyToken,adminsController.getUserByEmailUsernameAndPhoneNumber)
module.exports = router