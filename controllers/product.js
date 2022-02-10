
const { request, response } = require("express");
const Product = require("../models/product");



const getProducts = async(req = request, res = response) => {
    const query = { state: true };
    const { offset = 0, limit = 5} = req.query;
    try {
        const [ products, total] = await Promise.all([
            Product.find(query).skip( Number( offset )).limit( Number(limit))
            .populate('user', 'name email role').populate('category', 'name'),
            Product.countDocuments(query)
        ])
        
    
        res.json({
            ok: true,
            total,
            products
        })
    } catch (error) {
        console.log('Error get products, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

const getProductById = async( req = request, res = response) => {

    try {
        const {id} = req.params;

        const product = await Product.findById( id )
        .populate('user', 'name email role').populate('category', 'name');
        
        res.json({
            ok: true,
            product
        })
        
    } catch (error) {
        console.log('Error get product, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

const createProduct = async(req = request, res = response) => {

    const {name: nameLower, state, user,  ...rest} = req.body;
    const name = nameLower.toUpperCase();
    

    try {
        const existProduct = await Product.findOne({ name });
        if(existProduct){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: name,
                        msg: 'The product already exists',
                        param: 'name',
                        location: 'body'
                    }
                ]
            })
        }

        const data = {
            name,
            ...rest,
            user: req.user.id
        }

        const product = new Product( data );
        const newProduct = await product.save();
        
        res.status(201).json({
            ok: true,
            product: newProduct
        })

    } catch (error) {
        console.log('Error create product, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

const updateProduct = async(req = request, res = response) => {

    try {
        const {id} = req.params;
        const name = req.body.name.toUpperCase();

        const existProduct = await Product.findOne({ name });
        if(existProduct){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: name,
                        msg: 'The product already exists',
                        param: 'name',
                        location: 'body'
                    }
                ]
            })
        }

        const data = {
            name,
            user: req.user.id
        }

        const product = await Product.findByIdAndUpdate(id, data, { new: true} );
        
        res.json({
            ok: true,
            product
        })
        
    } catch (error) {
        console.log('Error update product, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
    
}

const deleteProduct = async(req = request, res = response) => {

    try {
        const {id} = req.params;


        const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true} );
        
        res.json({
            ok: true,
            product
        })
        
    } catch (error) {
        console.log('Error delete product, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}


module.exports = {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct
}