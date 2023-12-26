const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.post('/getAll',profileController.getAllEducation)
router.post('/getOne',profileController.getOneEducation)
router.post('/add',profileController.addEducation)
router.put('/:id',profileController.updateEducation)
router.delete('/:id',profileController.deleteEducation)

module.exports = router
