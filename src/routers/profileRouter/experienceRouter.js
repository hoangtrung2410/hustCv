const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.get('/getAll', authMidleware.isJobSeeker, profileController.getAllExperience)
router.post('/add', authMidleware.isJobSeeker, profileController.addExperience)
router.put('/:id', authMidleware.isJobSeeker, profileController.updateExperience)
router.delete('/:id', authMidleware.isJobSeeker, profileController.deleteExperience)

module.exports = router
