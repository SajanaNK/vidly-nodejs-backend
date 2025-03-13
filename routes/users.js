import express from 'express';
import mongoose from 'mongoose';
import { User, validateUser } from '../models/user.js';

const router = express.Router();

router.get('/', async (req,res) => {
    try {
        


    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong' + error);
    }
});

export default router;