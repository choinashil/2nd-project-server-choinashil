const router = require('express').Router();
const controller = require('./courses.controller');
const authMiddleware = require('../../../middlewares/auth');


// router.use('/:user_id', authMiddleware);
router.get('/', controller.searchCourses);
router.get('/:course_id/details', controller.details);
// router.post('/:user_id/new-course', controller.newCourse);


module.exports = router;
