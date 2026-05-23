const router = require('express').Router();
const controller = require('../controllers/log.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);
router.get('/', authorize('admin'), controller.list);
router.get('/project/:id', authorize('admin', 'member', 'client'), controller.project);
router.get('/me', authorize('admin', 'member', 'client'), controller.me);

module.exports = router;
