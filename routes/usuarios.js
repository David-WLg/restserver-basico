const {Router} = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosNotFound } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet)

router.post('/:id', usuariosPost)

router.put('/', usuariosPut)

router.delete('/', usuariosDelete)

router.get('*', usuariosNotFound)

module.exports = router;