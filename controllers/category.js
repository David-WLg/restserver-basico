const { request, response } = require("express");
const Category = require("../models/category");



const getCategories = async(req = request, res = response) => {
    const query = { state: true };
    const { offset = 0, limit = 5} = req.query;
    try {
        const [ categories, total] = await Promise.all([
            Category.find(query).skip( Number( offset )).limit( Number(limit)).populate('user', 'name email role'),
            Category.countDocuments(query)
        ])
        
    
        res.json({
            ok: true,
            total,
            categories
        })
    } catch (error) {
        console.log('Error get categories, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

const getCategoryById = async( req = request, res = response) => {

    try {
        const {id} = req.params;

        const category = await Category.findById( id );
        
        res.json({
            ok: true,
            category
        })
        
    } catch (error) {
        console.log('Error get category, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

const createCategory = async(req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    try {
        const existCategory = await Category.findOne({ name });
        if(existCategory){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: name,
                        msg: 'The category already exists',
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

        const category = new Category( data );
        const newCategory = await category.save();
        
        res.status(201).json({
            ok: true,
            category: newCategory
        })

    } catch (error) {
        console.log('Error create category, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}


const updateCategory = async(req = request, res = response) => {

    try {
        const {id} = req.params;
        const name = req.body.name.toUpperCase();

        const existCategory = await Category.findOne({ name });
        if(existCategory){
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: name,
                        msg: 'The category already exists',
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

        const category = await Category.findByIdAndUpdate(id, data, { new: true} );
        
        res.json({
            ok: true,
            category
        })
        
    } catch (error) {
        console.log('Error update category, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
    
}

const deleteCategory = async(req = request, res = response) => {

    try {
        const {id} = req.params;


        const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true} );
        
        res.json({
            ok: true,
            category
        })
        
    } catch (error) {
        console.log('Error delete category, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory }