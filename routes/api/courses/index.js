const router = require('express').Router();
const controller = require('./courses.controller');

router.get('/', controller.searchCourses);
router.get('/:course_id/details', controller.details);

module.exports = router;
