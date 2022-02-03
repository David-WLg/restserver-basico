const { response, request } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs')

const usuariosGet = async (req = request, res = response) => {
    const excludeDocuments = { state: true };
    const { offset = 2, limit = 5 } = req.query;

    try {

        const [total, users] = await Promise.all([
            User.countDocuments(excludeDocuments),
            User.find(excludeDocuments).skip(Number(offset)).limit(Number(limit))
        ])

        res.json({
            ok: true,
            total,
            users
        });
    } catch (error) {
        console.log('Error user GET', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }

}

const usuariosPost = async (req = request, res = response) => {
    const { name, email, password, role } = req.body;

    try {

        const user = new User({ name, email, password, role });

        //Encriptar la password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //Guardar el usuario
        const userCreated = await user.save();

        res.json({
            ok: true,
            user: userCreated
        })

    } catch (error) {
        console.log('Error user create', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }


}

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { password, google, email, role, state, ...user } = req.body;
    try {
        if (password) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);
        }

        const newUser = await User.findByIdAndUpdate(id, user, { new: true })

        res.json({
            ok: true,
            user: newUser
        })
    } catch (error) {
        console.log('Error user update', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }

}

const usuariosDelete = async(req, res) => {
    const { id } = req.params;
  
    try {
        //Eliminar de forma fisica
        //const user = await User.findByIdAndDelete(id);

        const user = await User.findByIdAndUpdate(id, {state: false}, {new: true});

        res.json({
            ok: true,
            user
        })

    } catch (error) {
        console.log('Error user delete', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
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