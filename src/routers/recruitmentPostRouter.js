const recruitmentPostController = require("../controllers/recruitmentPostController")
const applicationController = require("../controllers/applicationController")
const authMiddleware = require("../middlerwares/authMiddleware.js")


const router = require('express').Router()


// router.get('/',recruitmentPostController.getAllRecruitmentPost)
// router.get('/:id',recruitmentPostController.getOneRecruitmentPost)
// router.post('/',recruitmentPostController.addRecruitmentPost)
// router.put('/:id',recruitmentPostController.updateRecruitmentPost)
// router.delete('/:id',recruitmentPostController.deleteRecruitmentPost)
router.post('/search', recruitmentPostController.searchRecruitmentPost)
router.post("/apply", applicationController.createApplication)

router.get('/', authMiddleware.authMiddleware, recruitmentPostController.getAllRecruitmentPost)
router.get('/:id', authMiddleware.authMiddleware, recruitmentPostController.getOneRecruitmentPost)
router.post('/', authMiddleware.authMiddleware, recruitmentPostController.addRecruitmentPost)
router.put('/:id', authMiddleware.authMiddleware, recruitmentPostController.updateRecruitmentPost)
router.delete('/:id', authMiddleware.authMiddleware, recruitmentPostController.deleteRecruitmentPost)

module.exports = router