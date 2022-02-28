const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtensions = ['jpg', 'png', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;

        //Identificar la extension del archivo
        const separateName = file.name.split('.');
        const extension = separateName[separateName.length - 1];

        //Validar la extension
        if (!validExtensions.includes(extension)) {
            return reject( {
                ok: false,
                errors: [
                    {
                        msg: 'Extension not valid',
                        param: 'file',
                        location: 'form-data'
                    }
                ]
            } )
        }

        //Dar un nombre unico al archivo
        const name = `${uuidv4()}.${extension}`;

        //Almacenar el archivo
        const uploadPath = path.join(__dirname, '../uploads/', folder , name);

        file.mv(uploadPath, (err) => {
            if (err) {
                console.log('Error upload file', err);
                return reject( {
                    ok: false,
                    msg: 'Por favor comuniquese con el administrador'
                } )
            }

            resolve( name )
        })

    })


}

module.exports = { uploadFile }