const router = require('express').Router();
const auth = require('./auth');
const courses = require('./courses');
const users = require('./users');

router.use('/auth', auth);
router.use('/courses', courses);
router.use('/users', users);

module.exports = router;
