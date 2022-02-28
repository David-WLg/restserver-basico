
const { Router } = require('express');
const { check } = require('express-validator');
const {  upload, updateImage, showImage, updateImageCloudinary } = require('../controllers/upload');
const { isValidCollection } = require('../helpers/validators');
const { validateFields } = require('../middlewares/validateFields');
const { validateFile } = require('../middlewares/validateFile');


const router = Router();


router.post('/',[
    validateFile
], upload);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'The ID is not valid').isMongoId(),
    check('collection', 'The collection is not valid').custom( c => isValidCollection(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
    check('id', 'The ID is not valid').isMongoId(),
    check('collection', 'The collection is not valid').custom( c => isValidCollection(c, ['users', 'products'])),
    validateFields
], showImage);

module.exports = router;