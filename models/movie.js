import mongoose, { Schema } from "mongoose";
import { genreSchema } from "./genre.js";
import Joi from "joi";

const movieSchema = new Schema({
    title: {
        type:String,
        required: true,
        trim: true,
        minlength: 5,
        maxlenght: 50,

    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        default: 0
    }

});


const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0),
    })

    return schema.validate(movie);
}

export {Movie, validateMovie, movieSchema};