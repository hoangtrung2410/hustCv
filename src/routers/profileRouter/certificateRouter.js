const profileController = require("../../controllers/personalFileController/profileController")
const authMidleware = require("../../middlerwares/authMiddleware")
const router = require('express').Router()

router.post('/getAll',authMidleware.isJobSeeker, profileController.getAllCertificate)
router.get('/:id',authMidleware.isJobSeeker, profileController.getOneCertificate)
router.post('/add',authMidleware.isJobSeeker, profileController.addCertificate)
router.put('/:id',authMidleware.isJobSeeker, profileController.updateCertificate)
router.delete('/:id',authMidleware.isJobSeeker, profileController.deleteCertificate)

module.exports = router
