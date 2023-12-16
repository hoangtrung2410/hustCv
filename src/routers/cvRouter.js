const manageCvController = require("../controllers/manageCvController")

const router = require('express').Router()

router.get('/', manageCvController.getCv)
router.post('/', manageCvController.addCv)
// router.delete('/', manageCvController.deleteCv)

module.exports = router