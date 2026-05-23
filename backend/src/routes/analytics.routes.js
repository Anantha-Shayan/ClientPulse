const router = require('express').Router();
const controller = require('../controllers/analytics.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);
router.get('/overview', authorize('admin'), controller.overview);
router.get('/projects', authorize('admin'), controller.projects);
router.get('/team', authorize('admin'), controller.team);
router.get('/project/:id', authorize('admin', 'member'), controller.project);

module.exports = router;
