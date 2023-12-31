const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.post('/getAll', authMidleware.isJobSeeker, profileController.getSkill)
router.post('/add', authMidleware.isJobSeeker, profileController.addSkill)
// router.put('/:id',profileController.updateProject)

module.exports = router
