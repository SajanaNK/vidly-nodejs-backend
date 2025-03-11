import express from 'express';
import genres from './routes/genres.js';
import customers from './routes/customers.js';
import mongoose from "mongoose";


const app = express();
app.use(express.json());

app.use("/api/genres",genres);
app.use("/api/customers",customers)

mongoose.connect('mongodb://localhost/vidly')
    .then(() => {
        console.log('Connected to MongoDB...');
    })
    .catch(err => console.error('Could not connect to MongoDB...'+ err));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});