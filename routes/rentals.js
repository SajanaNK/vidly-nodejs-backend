import express from 'express';
import { Rental, validateRental} from '../models/rental.js';
import { Customer } from '../models/customer.js';
import { Movie } from '../models/movie.js';
import mongoose from "mongoose";


const router = express.Router();

router.get('/', async (req,res) => {
    try {

        const result = await Rental.find().sort('-dateOut');

        res.send(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});


router.post('/', async (req,res) => {
    try {

        const {error} = validateRental(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
            return res.status(404).send('Invalid ID Type : Customer');
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.movieId)) {
            return res.status(404).send('Invalid ID Type : Movie');
        }

        const customer = await Customer.findById(req.body.customerId);
        if(!customer) return res.status(400).send('Invalid customer');

        const movie = await Movie.findById(req.body.movieId);
        if(!movie) return res.status(400).send('Invalid movie');

        if(movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');



        let rental = new Rental({
            movie : {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            rentalFee: movie.dailyRentalRate
        });

        const session = await Rental.startSession();

        try {

            session.startTransaction();
            rental = await rental.save();
            movie.numberInStock--;
            await movie.save();
            await session.commitTransaction();
            session.endSession();
            res.send(rental);
            
        } catch (error) {
            console.log(error);
            res.status(500).send('Something went wrong : ' + error);
        }

        // rental = await rental.save();

        // movie.numberInStock--;
        // await movie.save();

        // res.send(rental);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
})



export default router;