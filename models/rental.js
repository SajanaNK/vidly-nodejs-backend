import mongoose, { Schema } from "mongoose";
import { genreSchema } from "./genre.js";
import Joi from "joi";


const rentalSchema = new Schema({
    customer: {
        type : new Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 10,
            }
        }),
        required: true
    },

    movie: {
        type: new Schema({
            title: {
                type:String,
                required: true,
                trim: true,
                minlength: 5,
                maxlenght: 50,
        
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                required: true,
            }
        })
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },

    dateReturned: {
        type: Date
    },

    rentalFee: {
        type: Number,
        min: 0
    }
});


const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        dateOut: Joi.date(),
        deteReturned: Joi.date(),
        rentalFee: Joi.number().min(0)
    });

    return schema.validate(rental);
}

export {Rental, validateRental, rentalSchema};