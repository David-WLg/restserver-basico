const Category = require("../models/category")
const Product = require("../models/product")
const Role = require("../models/role")
const User = require("../models/user")

//Con funciones asincronas se utiliza el lanzar una excepcion
//Con funciones NO asincronas se utiliza el retornar false
const isRoleValid = async (value = '') => {
    const isRoleExist = await Role.findOne({ role: value })
    if (!isRoleExist) {
        throw new Error(`The role ${value} does not exist`)
    }
}


const notEmailExist = async (value) => {
    const isEmailExist = await User.findOne({ email: value });
    if (isEmailExist) {
        throw new Error('There is already a user with that email')
    }
}

const isIdExist = async (value) => {
    try {
        const isIdExist = await User.findById(value);

        if (!isIdExist) {
            throw new Error('The ID is not exist')
        }
    } catch (error) {
        throw new Error('The ID is not exist')
    }

}

const isCategoryIdExist = async (value) => {
    try {
        const isIdExist = await Category.findById(value);
        if (!isIdExist) {
            throw new Error('The ID Category is not exist')
        }
    } catch (error) {
        throw new Error('The ID Category is not exist')
    }
}

const isProductIdExist = async (value) => {
    try {
        const isIdExist = await Product.findById(value);
        if (!isIdExist) {
            throw new Error('The ID Product is not exist')
        }
    } catch (error) {
        throw new Error('The ID Product is not exist')
    }
}

const isValidCollection = (collection = '', allowedCollections = []) => {
    const isValid = allowedCollections.includes( collection );
    if(!isValid){
        return false;
    }
    
    return true;
}

module.exports = { isRoleValid, notEmailExist, isIdExist, isCategoryIdExist, isProductIdExist, isValidCollection };