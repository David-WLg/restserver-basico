const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { googleVerify } = require("../helpers/googleVerify");
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
        console.log('Error login', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

const googleSignIn = async( req = request, res = response) => {
    const { id_token } = req.body;

    try {
        try {
            const googleUser = await googleVerify( id_token );
            const { name, email, picture} = googleUser;

            let user = await User.findOne({ email });

            if( !user){
                const data = {
                    name,
                    email,
                    password: ':)',
                    role: 'USER_ROLE',
                    google: true,
                    img: picture
                }
                user = new User( data );
                await user.save();

            }
            if( !user.state){
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

            const token = generateJWT( user.id );
            res.json({
                ok: true,
                user,
                token
            });

        } catch (error) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        msg: 'The id_token is not valid',
                        param: 'id_token',
                        location: 'body'
                    }
                ]
            })
        }
        
    } catch (error) {
        console.log('Error google sign in', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

module.exports = { login, googleSignIn }