const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.get('/', authMidleware.isJobSeeker, profileController.getAllExperience)
router.get('/:id', authMidleware.isJobSeeker, profileController.getOneExperience)
router.post('/', authMidleware.isJobSeeker, profileController.addExperience)
router.put('/:id', authMidleware.isJobSeeker, profileController.updateExperience)
router.delete('/:id', authMidleware.isJobSeeker, profileController.deleteExperience)

module.exports = router
