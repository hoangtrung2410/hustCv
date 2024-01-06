const route = require('express').Router();
const controller = require('../controllers/manageApplicationController');
const authMiddleware =  require('../middlerwares/authMiddleware');

route.delete('/:applicationId', authMiddleware.isJobSeeker, controller.deleteApplication);
route.get('/', authMiddleware.isJobSeeker, controller.getAllApplications);
route.get('/:applicationId',authMiddleware.isJobSeeker, controller.getApplicationDetails);
route.put('/updateApplication/:applicationId', authMiddleware.isJobSeeker, controller.updateStatusApplication);
module.exports = route;