const { request, response } = require("express");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const validateToken = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            errors: [
                {
                    msg: "The token is required",
                    param: "x-token",
                    location: "header"
                }
            ]
        })
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
        const { id } = payload;
        const user = await User.findById(id);

        //Si el usuario ya no existe fisicamente en la base de datos
        if(!user){
            return res.status(401).json({
                ok: false,
                errors: [
                    {
                        msg: "The token is from a user that does not exist",
                        param: "x-token",
                        location: "header"
                    }
                ]
            })
        }
        // Si el usuario esta en estado inactivo
        if (!user.state) {
            return res.status(401).json({
                ok: false,
                errors: [
                    {
                        msg: "The token is from a non-active user",
                        param: "x-token",
                        location: "header"
                    }
                ]
            })
        }

        req.user = user;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            errors: [
                {
                    msg: "The token is not valid",
                    param: "x-token",
                    location: "header"
                }
            ]
        })
    }

    next();
}

module.exports = { validateToken };