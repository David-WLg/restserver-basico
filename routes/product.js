
const { Router } = require('express');
const { body, check } = require('express-validator');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product');
const { isCategoryIdExist, isProductIdExist } = require('../helpers/validators');
const { validateFields } = require('../middlewares/validateFields');
const { validateRole } = require('../middlewares/validateRole');
const { validateToken } = require('../middlewares/validateToken');


const router = Router();

// Obtener todos los productos- paginado - total - populate
router.get('/', [
    validateToken
], getProducts);

// Obtener un producto por id - populate
router.get('/:id',[
    validateToken,
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom( isProductIdExist ),
    validateFields
], getProductById);

// Crear producto
router.post('/',[
    validateToken,
    body('name', 'Name is required').notEmpty(),
    body('category', 'Category is required').isMongoId(),
    body('category').custom( isCategoryIdExist ), 
    validateFields
], createProduct);

// Actualizar producto
router.put('/:id', [
    validateToken,
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom( isProductIdExist ),
    body('name', 'Name is required').notEmpty(),
    validateFields
], updateProduct);

// Eliminar categoria - state: false
router.delete('/:id',[
    validateToken,
    check('id', 'The ID is not valid').isMongoId(),
    check('id').custom( isProductIdExist ),
    validateRole('ADMIN_ROLE'),
    validateFields
], deleteProduct);

module.exports = router;