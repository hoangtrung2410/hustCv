const route = require('express').Router();
const controller = require('../controllers/recruiterApplicationController')
const authMiddleware =  require('../middlerwares/authMiddleware');

route.get('/getPosts', authMiddleware.isEmployer,controller.getRecruiterPosts);
route.get('/getAcceptedApplications/:postId', authMiddleware.isEmployer,controller.getAcceptedApplications)
route.get('/getPendingApplications/:postId', authMiddleware.isEmployer,controller.getPendingApplications)
route.get('/getDetailedApplication/:applicationId', authMiddleware.isEmployer,controller.getDetailedApplication)
route.put('/putAcceptApplication/:applicationId', authMiddleware.isEmployer,controller.putAcceptApplication)
route.put('/putDeclineApplication/:applicationId', authMiddleware.isEmployer,controller.putDeclineApplication)
route.get('/getAcceptedDetailedApplication/:applicationId', authMiddleware.isEmployer, controller.getAcceptedDetailedApplication)
module.exports =  route;