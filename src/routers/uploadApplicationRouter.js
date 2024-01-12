const uploadApplicationController = require("../controllers/uploadApplicationController")
const authMidleware = require("../middlerwares/authMiddleware")
const multer = require('multer');
const router = require('express').Router()

router.post('/submit', authMidleware.isJobSeeker, uploadApplicationController.uploadApplication);
router.post('/available', authMidleware.isJobSeeker, uploadApplicationController.useAvailableCv);

module.exports = router
