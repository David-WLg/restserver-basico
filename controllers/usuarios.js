const {response, request} = require('express')

const usuariosGet = (req = request, res = response) => { //Forma para recibir la ayuda
    const query = req.query;
    res.json({ mensaje: 'Petición GET - controller', query})
}

const usuariosPost = (req = request, res) => {
    const id = req.params.id;
    const {nombre, edad} = req.body;
    res.status(404).json({ mensaje: 'Petición POST - controller', nombre, edad, id})
}

const usuariosPut = (req, res) => {
    res.json({ mensaje: 'Petición PUT - controller'})
}

const usuariosDelete = (req, res) => {
    res.json({ mensaje: 'Petición DELETE - controller'})
}

const usuariosNotFound = (req, res) => {
    res.status(404).send('404 | not found')
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosNotFound
}