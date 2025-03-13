import express from 'express';
import genres from './routes/genres.js';
import customers from './routes/customers.js';
import movies from './routes/movies.js';
import rentals from './routes/rentals.js';
import mongoose from "mongoose";
import users from './routes/users.js';
import joiObjectid from "joi-objectid";
import Joi from "joi";

Joi.objectId = joiObjectid(Joi);


const app = express();
app.use(express.json());

app.use("/api/genres",genres);
app.use("/api/customers",customers);
app.use("/api/movies",movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

mongoose.connect('mongodb://localhost/vidly')
    .then(() => {
        console.log('Connected to MongoDB...');
    })
    .catch(err => console.error('Could not connect to MongoDB...'+ err));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});