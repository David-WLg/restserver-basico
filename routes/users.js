const {Router} = require('express');
const { body, check } = require('express-validator')
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosNotFound } = require('../controllers/users');
const { isRoleValid, notEmailExist, isIdExist } = require('../helpers/validators');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.get('/', usuariosGet)

router.post('/',[
    body('name', 'Name is required').notEmpty(),
    body('email', 'The email is not valid').isEmail(),
    body('password', 'The password must have at least six characters').isLength({ min: 6 }),
    body('role').custom( isRoleValid ),
    body('email').custom( notEmailExist ),
    validateFields
], usuariosPost)

//Check toma en cuenta tambien los parametros y body solo el cuerpo de la peticion

router.put('/:id',[
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom(isIdExist),
    body('name', 'Name is required').notEmpty(),
    validateFields
], usuariosPut)

router.delete('/:id', [
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom(isIdExist),
    validateFields
], usuariosDelete)

router.get('*', usuariosNotFound)

module.exports = router;