const recruitmentPostController = require("../controllers/recruitmentPostController")
const authMiddleware = require("../middlerwares/authMiddleware.js")


const router = require('express').Router()

router.get('/', authMiddleware.authMiddleware, recruitmentPostController.getAllRecruitmentPost)
router.get('/:id', authMiddleware.authMiddleware, recruitmentPostController.getOneRecruitmentPost)
router.post('/', authMiddleware.authMiddleware, recruitmentPostController.addRecruitmentPost)
router.put('/:id', authMiddleware.authMiddleware, recruitmentPostController.updateRecruitmentPost)
router.delete('/:id', authMiddleware.authMiddleware, recruitmentPostController.deleteRecruitmentPost)

module.exports = router
