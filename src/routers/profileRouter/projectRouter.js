const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.get('/getAll', authMidleware.isJobSeeker, profileController.getAllProject)
router.get('/:id', authMidleware.isJobSeeker, profileController.getOneProject)
router.post('/add', authMidleware.isJobSeeker, profileController.addProject)
router.put('/:id', authMidleware.isJobSeeker, profileController.updateProject)
router.delete('/:id', authMidleware.isJobSeeker, profileController.deleteProject)

module.exports = router
