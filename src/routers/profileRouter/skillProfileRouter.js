const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.post('/getAll',profileController.getSkill)
router.post('/add',profileController.addSkill)
// router.put('/:id',profileController.updateProject)

module.exports = router
