import express from 'express';
import { auth } from '../middleware/auth.js';
import { Rental } from '../models/rental.js';
import { Movie } from '../models/movie.js';
import Joi from 'joi';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) {
        return res.status(404).send("Rental not found");
    }

    if (rental.dateReturned) {
        return res.status(400).send("Rental already processed");
    }

    rental.return();
    const result = await rental.save();

    await Movie.findByIdAndUpdate({
        _id: rental.movie.id
    },
        {
            $inc: { numberInStock: 1 }
        }
    )

    return res.send(result);

});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(req);
}



export default router;

