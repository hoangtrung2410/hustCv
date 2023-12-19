const businessController = require("../controllers/businessController.js")
const authMiddlerware = require("../middlerwares/authMiddleware.js")

const router = require('express').Router()

router.get('/', authMiddlerware.isEmployer, businessController.getAllBusiness)
router.get('/:id', businessController.getOneBusiness)
router.post('/', businessController.addBusiness)
router.put('/:id', businessController.updateBusiness)
router.delete('/:id', businessController.deleteBusiness)

module.exports = router