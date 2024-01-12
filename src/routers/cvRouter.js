const manageCvController = require("../controllers/personalFileController/manageCVController")
const authMidleware = require("../middlerwares/authMiddleware")
const multer = require('multer');
const upload = multer();
const router = require('express').Router()

router.get('/getUrlCv', authMidleware.isJobSeeker, manageCvController.getUrlCv)
router.get('/getNameCv', authMidleware.isJobSeeker, manageCvController.getNameCv)
router.post('/', authMidleware.isJobSeeker, upload.single('file'), manageCvController.addCv)
router.delete('/', authMidleware.isJobSeeker, manageCvController.deleteCv)
// router.delete('/', manageCvController.deleteCv)

module.exports = router