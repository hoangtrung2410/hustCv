const uploadApplicationController = require("../controllers/uploadApplicationController")
const authMidleware = require("../middlerwares/authMiddleware")
const multer = require('multer');
const upload = multer();
const router = require('express').Router()

router.post('/upload', authMidleware.isJobSeeker, upload.single('file'), uploadApplicationController.uploadApplication);
router.post('/available', authMidleware.isJobSeeker, uploadApplicationController.useAvailableCv);

module.exports = router
