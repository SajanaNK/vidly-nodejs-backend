import Joi from "joi";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";

const userSchema = new Schema({
    email: {
        type:String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    name: {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isAdmin: Boolean,
    roles: [],
    operations: []
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));

    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        name: Joi.string().min(5).max(50).required()
    })

    return schema.validate(user);
}


export {User, userSchema, validateUser};