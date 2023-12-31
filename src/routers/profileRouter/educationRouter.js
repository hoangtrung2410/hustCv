const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.post('/getAll', authMidleware.isJobSeeker, profileController.getAllEducation)
router.post('/getOne', authMidleware.isJobSeeker, profileController.getOneEducation)
router.post('/add', authMidleware.isJobSeeker, profileController.addEducation)
router.put('/:id', authMidleware.isJobSeeker, profileController.updateEducation)
router.delete('/:id', authMidleware.isJobSeeker, profileController.deleteEducation)

module.exports = router
