const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.get('/',profileController.getAllEducation)
router.get('/:id',profileController.getOneEducation)
router.post('/',profileController.addEducation)
router.put('/:id',profileController.updateEducation)
router.delete('/:id',profileController.deleteEducation)

module.exports = router
