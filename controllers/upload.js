const { response, request } = require("express");
const { uploadFile } = require("../helpers/uploadFile");
const Product = require("../models/product");
const User = require("../models/user");

// Require the Cloudinary library
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const path = require('path');
const fs = require('fs')



const upload = async (req = request, res = response) => {


    try {
        // const name = await uploadFile( req.files, ['md', 'txt'], 'textos' );
        const name = await uploadFile(req.files, undefined, 'imgs');

        res.json({
            name
        })
    } catch (error) {
        console.log('Error upload file', error);
        res.status(400).json(error)
    }
}

const updateImage = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    errors: [
                        {
                            value: id,
                            msg: 'The User is not exists',
                            param: 'id',
                            location: 'params'
                        }
                    ]
                })
            }
            break;
        case 'products':

            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    errors: [
                        {
                            value: id,
                            msg: 'The Product is not exists',
                            param: 'id',
                            location: 'params'
                        }
                    ]
                })
            }
            break;
        default:
            break;
    }

    //Limpiar imagenes previas
    if (model.img) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }


    //Subir archivo
    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;

    await model.save();

    res.json(model)
}

const updateImageCloudinary = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    errors: [
                        {
                            value: id,
                            msg: 'The User is not exists',
                            param: 'id',
                            location: 'params'
                        }
                    ]
                })
            }
            break;
        case 'products':

            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    errors: [
                        {
                            value: id,
                            msg: 'The Product is not exists',
                            param: 'id',
                            location: 'params'
                        }
                    ]
                })
            }
            break;
        default:
            break;
    }

    //Limpiar imagenes previas
    if (model.img) {
        const nombreArr = model.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
        
    }


    //Subir archivo
    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;

    await model.save();

    res.json( model )
}

const showImage = async (req = request, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    errors: [
                        {
                            value: id,
                            msg: 'The User is not exists',
                            param: 'id',
                            location: 'params'
                        }
                    ]
                })
            }
            break;
        case 'products':

            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    errors: [
                        {
                            value: id,
                            msg: 'The Product is not exists',
                            param: 'id',
                            location: 'params'
                        }
                    ]
                })
            }
            break;
        default:
            break;
    }

    //devolver la imagen
    if (model.img) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImage)) {
            return res.sendFile( pathImage );
        }
    }

    const pathImage = path.join( __dirname, '../assets', 'no-image.jpg')
    res.status(400).sendFile( pathImage );

}


module.exports = { upload, updateImage, showImage, updateImageCloudinary };