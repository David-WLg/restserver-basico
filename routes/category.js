
const { Router } = require('express');
const { body, check } = require('express-validator');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { isCategoryIdExist } = require('../helpers/validators');
const { validateFields } = require('../middlewares/validateFields');
const { validateRole } = require('../middlewares/validateRole');
const { validateToken } = require('../middlewares/validateToken');

const router = Router();

// Obtener todas las categorias - paginado - total - populate
router.get('/', [
    validateToken
], getCategories);

// Obtener una categoria por id - populate
router.get('/:id',[
    validateToken,
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom( isCategoryIdExist ),
    validateFields
], getCategoryById);

// Crear categoria
router.post('/',[
    validateToken,
    body('name', 'Name is required').notEmpty(),
    validateFields
], createCategory);

// Actualizar categoria
router.put('/:id', [
    validateToken,
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom( isCategoryIdExist ),
    body('name', 'Name is required').notEmpty(),
    validateFields
], updateCategory);

// Eliminar categoria - state: false
router.delete('/:id',[
    validateToken,
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom( isCategoryIdExist ),
    validateRole('ADMIN_ROLE'),
    validateFields
], deleteCategory);


module.exports = router;