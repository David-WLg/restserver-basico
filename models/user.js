const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    img:{
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

userSchema.method('toJSON', function(){
    const {_id: idUser, __v, password, ...user } = this.toObject();
    const newObject = {
        id: idUser,
        ...user
    }
    return newObject;
});

const User = model('User', userSchema);

module.exports = User;