const { request, response } = require("express");

const validateFile = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok: false,
            errors: [
                {
                    msg: 'No files were uploaded',
                    param: 'file',
                    location: 'form-data'
                }
            ]
        });
    }

    next();
}

module.exports = { validateFile }