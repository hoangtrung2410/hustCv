const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.get('/',profileController.getAllCertificate)
router.get('/:id',profileController.getOneCertificate)
router.post('/',profileController.addCertificate)
router.put('/:id',profileController.updateCertificate)
router.delete('/:id',profileController.deleteCertificate)

module.exports = router
