const userController = require("../controllers/userController.js")
const authMiddleware =require ("../middlerwares/authMiddleware.js")

const router = require('express').Router()

router.get('/', userController.getAllUser)
router.post('/',userController.signUp)
router.put('/:id',userController.updateUser)
router.get('/me',authMiddleware.authMiddleware,userController.getUserById)


module.exports = router