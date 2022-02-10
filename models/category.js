const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: Boolean,
        required: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

categorySchema.method('toJSON', function(){
    const { _id: categoryId, __v, user,  ...category} = this.toObject();

    const { _id: userId, ...myUser } = user;
    const newUser = {
        id: userId,
        ...myUser
    }

    const newObject = {
        id: categoryId,
        ...category,
        user: newUser
    }

    return newObject;
})

const Category = model('Category', categorySchema);

module.exports = Category;