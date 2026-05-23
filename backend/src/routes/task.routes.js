const router = require('express').Router({ mergeParams: true });
const controller = require('../controllers/task.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validateBody = require('../middleware/validateBody');
const { createTaskSchema, updateTaskSchema, commentSchema } = require('../validators/task.validator');

router.use(authenticate);
router.post('/', authorize('admin', 'member'), validateBody(createTaskSchema), controller.create);
router.get('/', authorize('admin', 'member', 'client'), controller.list);
router.get('/:id', authorize('admin', 'member', 'client'), controller.get);
router.patch('/:id', authorize('admin', 'member'), validateBody(updateTaskSchema), controller.update);
router.delete('/:id', authorize('admin'), controller.remove);
router.post('/:id/comments', authorize('admin', 'member'), validateBody(commentSchema), controller.comment);

module.exports = router;
