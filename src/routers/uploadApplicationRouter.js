const uploadApplicationController = require("../controllers/uploadApplicationController")
const authMidleware = require("../middlerwares/authMiddleware")
const router = require('express').Router()
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/upload', authMidleware.isJobSeeker, upload.single('fileCV'), uploadApplicationController.uploadApplication);
router.post('/available', authMidleware.isJobSeeker, uploadApplicationController.useAvailableCv);

module.exports = router
