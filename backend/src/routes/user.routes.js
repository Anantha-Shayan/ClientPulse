const router = require('express').Router();
const controller = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validateBody = require('../middleware/validateBody');
const { statusSchema, inviteClientSchema } = require('../validators/user.validator');

router.use(authenticate, authorize('admin'));
router.get('/', controller.list);
router.get('/:id', controller.get);
router.patch('/:id/status', validateBody(statusSchema), controller.updateStatus);
router.delete('/:id', controller.remove);
router.post('/invite-client', validateBody(inviteClientSchema), controller.inviteClient);

module.exports = router;
