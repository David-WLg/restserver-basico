const { request, response } = require("express");
const Category = require("../models/category");
const Product = require("../models/product");
const { ObjectId } = require('mongoose').Types;
const User = require('../models/user')

const allowedCollections = [
    'users',
    'categories',
    'products'
]

const searchUsers = async (term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            ok: true,
            result: (user) ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const users = await Category.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    })

    res.json({
        ok: true,
        result: users
    })
}

const searchCategories = async (term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const category = await Category.findById(term);
        return res.json({
            ok: true,
            result: (category) ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const categories = await Category.find( { name: regex } ).populate('user', 'name email')

    res.json({
        ok: true,
        result: categories
    })
}

const searchProducts = async (term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const product = await Product.findById(term);
        return res.json({
            ok: true,
            result: (product) ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const products = await Product.find( { name: regex } )
    .populate('user', 'name email')
    .populate('category', 'name')

    res.json({
        ok: true,
        result: products
    })
}

const search = (req = request, res = response) => {

    try {
        const { collection, term } = req.params;

        if (!allowedCollections.includes(collection)) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        value: collection,
                        msg: 'The collection does not exists',
                        param: 'collection',
                        location: 'params'
                    }
                ]
            })
        }


        switch (collection) {
            case 'users':
                searchUsers(term, res);
                break;

            case 'categories':
                searchCategories(term, res);
                break;

            case 'products':
                searchProducts(term, res);
                break;

            default:
                console.log('Error collection not controlled');
                return res.status(500).json({
                    ok: false,
                    msg: 'Por favor comuniquese con el administrador'
                })
        }

    } catch (error) {
        console.log('Error search, ', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        })
    }
}


module.exports = { search }