import Joi from 'joi';
import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
});

const Genre = mongoose.model('Genre', genreSchema);



function validateGenre(genre) {
    const schema =  Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}

export {Genre, validateGenre, genreSchema};