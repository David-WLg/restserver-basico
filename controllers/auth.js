const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generateJWT } = require("../helpers/jwt");
const User = require("../models/user");


const login = async(req = request, res = response) => {
    const {email, password} = req.body;

    try {

        //Validar si el email existe en la bd
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: email,
                        msg: 'The email / password not exist',
                        param: 'email',
                        location: 'body'
                    }
                ]
            })
        }
        //Validar si el email esta activo
        if( user.state === false){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: email,
                        msg: 'The email is not active',
                        param: 'email',
                        location: 'body'
                    }
                ]
            })
        }
        //Validar si la contraseña es correcta
        const isValidPassword = bcryptjs.compareSync( password, user.password);
        if( !isValidPassword ){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: 'password',
                        msg: 'The email / password not exist',
                        param: 'password',
                        location: 'body'
                    }
                ]
            })
        }
        //Gener jwt
        const token = generateJWT( user.id );

        res.json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        console.log('Error user GET', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}


module.exports = { login }