const router = require('express').Router({ mergeParams: true });
const controller = require('../controllers/milestone.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validateBody = require('../middleware/validateBody');
const { createMilestoneSchema, updateMilestoneSchema } = require('../validators/milestone.validator');

router.use(authenticate);
router.post('/', authorize('admin', 'member'), validateBody(createMilestoneSchema), controller.create);
router.get('/', authorize('admin', 'member', 'client'), controller.list);
router.get('/:id', authorize('admin', 'member', 'client'), controller.get);
router.patch('/:id', authorize('admin', 'member'), validateBody(updateMilestoneSchema), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);

module.exports = router;
