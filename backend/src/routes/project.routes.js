const router = require('express').Router();
const controller = require('../controllers/project.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validateBody = require('../middleware/validateBody');
const { createProjectSchema, updateProjectSchema, memberSchema } = require('../validators/project.validator');

router.use(authenticate);
router.post('/', authorize('admin'), validateBody(createProjectSchema), controller.create);
router.get('/', authorize('admin'), controller.list);
router.get('/my', authorize('member'), controller.my);
router.get('/client-portal', authorize('client'), controller.clientPortal);
router.get('/:id', authorize('admin', 'member'), controller.get);
router.patch('/:id', authorize('admin', 'member'), validateBody(updateProjectSchema), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);
router.post('/:id/members', authorize('admin'), validateBody(memberSchema), controller.addMember);
router.delete('/:id/members/:userId', authorize('admin'), controller.removeMember);

module.exports = router;
