const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.post('/',profileController.getUserInfor)
router.put('/:id',profileController.updateUserInfor)

module.exports = router
