const router = require('express').Router();
const controller = require('./users.controller');
const authMiddleware = require('../../../middlewares/auth');

router.use('/:user_id', authMiddleware);
router.get('/:user_id/profile', controller.profile);
router.get('/:user_id/favorites', controller.favorites);
router.get('/:user_id/courses/:course_id/like', controller.like);
router.post('/:user_id/new-course', controller.newCourse);

module.exports = router;
