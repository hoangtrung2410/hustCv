const manageCvController = require("../controllers/personalFileController/manageCVController")
const multer = require('multer');
const upload = multer();
const router = require('express').Router()

router.post('/getUrlCv', manageCvController.getUrlCv)
router.post('/getNameCv', manageCvController.getNameCv)
router.post('/', upload.single('file'), manageCvController.addCv)
router.delete('/', manageCvController.deleteCv2)
// router.delete('/', manageCvController.deleteCv)

module.exports = router