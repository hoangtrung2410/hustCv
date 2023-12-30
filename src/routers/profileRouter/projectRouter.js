const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.post('/getAll',profileController.getAllProject)
router.get('/:id',profileController.getOneProject)
router.post('/add',profileController.addProject)
router.put('/:id',profileController.updateProject)
router.delete('/:id',profileController.deleteProject)

module.exports = router
