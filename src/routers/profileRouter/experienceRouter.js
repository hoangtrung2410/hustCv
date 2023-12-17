const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.get('/',profileController.getAllExperience)
router.get('/:id',profileController.getOneExperience)
router.post('/',profileController.addExperience)
router.put('/:id',profileController.updateExperience)
router.delete('/:id',profileController.deleteExperience)

module.exports = router
