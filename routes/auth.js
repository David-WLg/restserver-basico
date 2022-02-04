const {Router} = require('express');
const { body } = require('express-validator');
const { login } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');


const router = Router();

router.post('/login', [
    body('email', 'The email is required').isEmail(),
    body('password', 'The password is required').notEmpty(),
    validateFields
], login)


module.exports = router;