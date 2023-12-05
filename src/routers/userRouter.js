const userController = require("../controllers/userController.js")

const router = require('express').Router()

router.get('/', userController.getAllUser)
router.post('/',userController.signUp)
router.put('/:id',userController.updateUser)

module.exports = router