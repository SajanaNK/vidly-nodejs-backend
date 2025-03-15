import express from 'express';
import mongoose from 'mongoose';
import { Genre, validateGenre } from '../models/genre.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import "express-async-errors";
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await Genre.find().sort('name');
    res.send(result);
    console.log(result);
});

router.get('/:id', validateObjectId , async (req, res, next) => {


    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //     return res.status(404).send('Invalid ID Type');
    // }

    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    try {

        const { error } = validateGenre(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let genre = new Genre({
            name: req.body.name
        });

        await genre.validate();

        genre = await genre.save();

        res.send(genre);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});

router.put('/:id', auth, async (req, res) => {

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Invalid ID Type');
        }

        const genre = await Genre.findById(req.params.id);

        if (!genre) return res.status(404).send('The genre with the given ID was not found');

        const { error } = validateGenre(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const updatedGenre = new Genre({
            name: req.body.name
        });

        await updatedGenre.validate();

        const result = await Genre.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                name: updatedGenre.name
            }
        }, {
            new: true
        }
        );

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }

});


router.delete('/:id', [auth, admin], async (req, res) => {

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Invalid ID Type');
        }

        const genre = await Genre.findById(req.params.id);

        if (!genre) return res.status(404).send('The genre with the given ID was not found');

        const result = await Genre.deleteOne({ _id: req.params.id });

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
})




export default router;