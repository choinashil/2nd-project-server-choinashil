const router = require('express').Router();
const controller = require('./auth.controller');
const authMiddleware = require('../../../middlewares/auth');

router.post('/check', controller.check);
router.post('/sign-up', controller.signUp);
router.post('/login', controller.login);

router.use('/verify', authMiddleware);
router.get('/verify', controller.verify);

module.exports = router;
