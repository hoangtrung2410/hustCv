const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.post('/', authMidleware.isJobSeeker, profileController.getUserInfor)
router.put('/:id', authMidleware.isJobSeeker, profileController.updateUserInfor)

module.exports = router
