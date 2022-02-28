const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
})

productSchema.method('toJSON', function(){
    const { _id: productId, __v, user, category,  ...product} = this.toObject();

    const { _id: userId, ...myUser } = user;
    const newUser = {
        id: userId,
        ...myUser
    }

    const {_id: categoryId, ...myCategory} = category;
    const newCategory = {
        id: categoryId,
        ...myCategory
    }
    const newObject = {
        id: productId,
        ...product,
        user: newUser,
        category: newCategory
    }

    return newObject;
})

const Product = model('Product', productSchema);

module.exports = Product;