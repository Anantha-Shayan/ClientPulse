const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const validateBody = require('../middleware/validateBody');
const { registerSchema, loginSchema, updateMeSchema } = require('../validators/auth.validator');

router.post('/register', validateBody(registerSchema), auth.register);
router.post('/login', validateBody(loginSchema), auth.login);
router.post('/logout', authenticate, auth.logout);
router.get('/me', authenticate, auth.me);
router.patch('/me', authenticate, validateBody(updateMeSchema), auth.updateMe);

module.exports = router;
