const profileController = require("../controllers/personalFileController/jobPreferenceController")
const authMidleware = require("../middlerwares/authMiddleware")
const router = require('express').Router()

router.get('/getAll',authMidleware.isJobSeeker, profileController.getCriterionJob)
router.post('/add',authMidleware.isJobSeeker, profileController.addCriterionJob)

module.exports = router
