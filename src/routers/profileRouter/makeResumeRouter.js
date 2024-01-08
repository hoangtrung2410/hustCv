const resumeMaker = require("../../controllers/personalFileController/resumeMaker")
const authMidleware = require("../../middlerwares/authMiddleware")

const router = require('express').Router()

router.get('/', authMidleware.isJobSeeker, resumeMaker.makeResume)

module.exports = router
