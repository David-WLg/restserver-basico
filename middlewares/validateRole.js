const { response } = require("express")


const validateRole = ( ...roles ) => {

    return (req = request, res = response, next) => {

        const {role} = req.user;
        
        if(!roles.includes( role )){
            return res.status(401).json({
                ok: false,
                errors: [
                    {
                        value: role,
                        msg: "The role does not have permissions",
                        param: "role",
                        location: "header"
                    }
                ]
            })
        }

        next();
    }
} 

module.exports = { validateRole };