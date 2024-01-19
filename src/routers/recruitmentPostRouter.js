const recruitmentPostController = require("../controllers/recruitmentPostController")
const authMiddleware = require("../middlerwares/authMiddleware.js")


const router = require('express').Router()


// router.get('/',recruitmentPostController.getAllRecruitmentPost)
// router.get('/:id',recruitmentPostController.getOneRecruitmentPost)
// router.post('/',recruitmentPostController.addRecruitmentPost)
// router.put('/:id',recruitmentPostController.updateRecruitmentPost)
// router.delete('/:id',recruitmentPostController.deleteRecruitmentPost)
router.post('/search', recruitmentPostController.searchRecruitmentPost)
router.get('/getAll', recruitmentPostController.getAllPost)
router.get('/khanh/:id', recruitmentPostController.getOneRecruitmentPost)

router.get('/posts-not-expired', recruitmentPostController.getAllPostNotExpired)

router.get('/', authMiddleware.isEmployer, recruitmentPostController.getAllRecruitmentPost)
router.get('/:id', authMiddleware.isEmployer, recruitmentPostController.getOneRecruitmentPost)
router.post('/', authMiddleware.isEmployer, recruitmentPostController.addRecruitmentPost)
router.put('/:id', authMiddleware.isEmployer, recruitmentPostController.updateRecruitmentPost)
router.delete('/:id', authMiddleware.isEmployer, recruitmentPostController.deleteRecruitmentPost)

module.exports = router