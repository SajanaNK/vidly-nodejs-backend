import express from 'express'
import mongoose from 'mongoose';
import { Movie, validateMovie } from '../models/movie.js';
import { Genre } from '../models/genre.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await Movie.find().sort('title');
        res.send(result);
        console.log(result);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong' + error);
    }
});

router.post('/', async (req, res) => {
    try {

        const { error } = validateMovie(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid Genre'); 

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.validate();

        const result = await movie.save();
        res.send(result);
        console.log(result);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong' + error);
    }
});


router.put('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Invalid ID Type');
        }

        const { error } = validateMovie(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const newMovie = new Movie({
            title: req.body.title,
            genre: req.body.genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await newMovie.validate();

        const result = await Movie.findByIdAndUpdate(req.params.id,
            {
                title: newMovie.title,
                genre: newMovie.genre,
                numberInStock: newMovie.numberInStock,
                dailyRentalRate: newMovie.dailyRentalRate
            },
            { new: true });

        res.send(result);
        console.log(result);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});


router.delete('/:id', async (req,res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Invalid ID Type');
        }

        const reult = await Movie.findByIdAndDelete(req.params.id);

        if (!reult) return res.status(404).send('The movie with the given ID was not found');

        res.send(reult);
        console.log(reult);
        
    } catch (error) {
        console.log(error); 
        res.status(500).send('Something went wrong' + error);
        
    }
})



export default router;
