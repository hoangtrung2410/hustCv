const manageCvController = require("../controllers/personalFileController/manageCVController")
const authMidleware = require("../middlerwares/authMiddleware")
const multer = require('multer');
const upload = multer();
const router = require('express').Router()

router.post('/getUrlCv', authMidleware.isJobSeeker, manageCvController.getUrlCv)
router.post('/getNameCv', authMidleware.isJobSeeker, manageCvController.getNameCv)
router.post('/', authMidleware.isJobSeeker, upload.single('file'), manageCvController.addCv)
router.delete('/', authMidleware.isJobSeeker, manageCvController.deleteCv2)
// router.delete('/', manageCvController.deleteCv)

module.exports = router