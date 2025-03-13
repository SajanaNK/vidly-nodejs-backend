import mongoose from 'mongoose';
import {logger} from '../startup/logging.js';

export function setupDatabase(){
    mongoose.connect('mongodb://localhost/vidly')
    .then(() => {
        logger.info('Connected to MongoDB...');
    });
}