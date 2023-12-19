const skillsController = require('../controllers/skillsController')
const router = require('express').Router()

router.get('/getAllSkills', skillsController.getAllSkills)

module.exports = router