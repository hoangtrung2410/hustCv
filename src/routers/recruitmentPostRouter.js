const recruitmentPostController = require("../controllers/recruitmentPostController")

const router = require('express').Router()

router.get('/',recruitmentPostController.getAllRecruitmentPost)
router.get('/:id',recruitmentPostController.getOneRecruitmentPost)
router.post('/',recruitmentPostController.addRecruitmentPost)
router.put('/:id',recruitmentPostController.updateRecruitmentPost)
router.delete('/:id',recruitmentPostController.deleteRecruitmentPost)

module.exports = router
