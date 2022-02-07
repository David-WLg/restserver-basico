const {Router} = require('express');
const { body } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');


const router = Router();

router.post('/login', [
    body('email', 'The email is required').isEmail(),
    body('password', 'The password is required').notEmpty(),
    validateFields
], login)

router.post('/google', [
    body('id_token', 'The id_token is required').notEmpty(),
    validateFields
], googleSignIn)

module.exports = router;