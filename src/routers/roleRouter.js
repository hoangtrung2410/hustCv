const roleController = require("../controllers/roleController.js")

const router = require('express').Router()

router.post('/', roleController.addRole)
router.get('/', roleController.getAllRole)
router.put('/:id', roleController.updateRole)


module.exports = router