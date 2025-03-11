import express from 'express';
import mongoose from 'mongoose';
import { Genre, validateGenre } from '../models/genres.js';

const router = express.Router();

router.get('/', async (req,res) => {

    try {
        const result = await Genre.find().sort('name');
        res.send(result);
        console.log(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong' + error);
    }

});

router.get('/:id', async (req,res) => {
   
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(404).send('Invalid ID Type');
        }

        const genre = await Genre.findById(req.params.id);

        if (!genre) return res.status(404).send('The genre with the given ID was not found');
        
        res.send(genre);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong' + error);
    }
    
});

router.post('/', async (req,res) => {
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
        res.status(500).send('Something went wrong' + error);
    }
});

router.put('/:id', async (req,res) => {

    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(404).send('Invalid ID Type');
        }
    
        const genre = await Genre.findById(req.params.id);
    
        if( !genre) return res.status(404).send('The genre with the given ID was not found');
    
        const { error } = validateGenre(req.body);
    
        if(error) {
            return res.status(400).send(error.details[0].message);
        }
    
        const updatedGenre = new Genre({
            name: req.body.name
        });

        await updatedGenre.validate();

        const result = await Genre.findByIdAndUpdate({_id: req.params.id},{
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
        res.status(500).send('Something went wrong' + error);
    }

});


router.delete('/:id', async (req,res) => {

    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(404).send('Invalid ID Type');
        }
    
        const genre = await Genre.findById(req.params.id);
    
        if(!genre) return res.status(404).send('The genre with the given ID was not found');
    
        const result = await Genre.deleteOne({_id: req.params.id});
    
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong' + error);
    }
})




export default router;