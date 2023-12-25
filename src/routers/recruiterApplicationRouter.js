const route = require('express').Router();
const controller = require('../controllers/recruiterApplicationController')
const authMiddleware =  require('../middlerwares/authMiddleware');

route.get('/getPosts', authMiddleware.isEmployer,controller.getRecruiterPosts);
route.get('/getAcceptedApplications/:postId', authMiddleware.isEmployer,controller.getAcceptedApplications)
route.get('/getPendingApplications/:postId', authMiddleware.isEmployer,controller.getPendingApplications)
route.get('/getDetailedApplication/:applicationId', authMiddleware.isEmployer,controller.getDetailedApplication)
route.post('/postAcceptApplication/:applicationId', authMiddleware.isEmployer,controller.postAcceptApplication)
route.post('/postDeclineApplication/:applicationId', authMiddleware.isEmployer,controller.postDeclineApplication)
route.get('/getAcceptedDetailedApplication/:applicationId', authMiddleware.isEmployer, controller.getAcceptedDetailedApplication)
module.exports =  route;