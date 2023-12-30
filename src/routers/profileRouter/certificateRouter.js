const profileController = require("../../controllers/personalFileController/profileController")

const router = require('express').Router()

router.post('/getAll',profileController.getAllCertificate)
router.get('/:id',profileController.getOneCertificate)
router.post('/add',profileController.addCertificate)
router.put('/:id',profileController.updateCertificate)
router.delete('/:id',profileController.deleteCertificate)

module.exports = router
