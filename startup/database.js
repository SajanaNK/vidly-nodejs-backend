import mongoose from 'mongoose';
import {logger} from '../startup/logging.js';
import config from 'config';

export function setupDatabase(){
    const db = config.get('db');
    mongoose.connect(db)
    .then(() => {
        logger.info(`Connected to ${db}...`);
    });
}