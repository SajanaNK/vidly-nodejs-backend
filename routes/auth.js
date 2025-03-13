import express from 'express';
import { User } from '../models/user.js';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const router = express.Router();


router.post('/', async (req,res) => {
    try {
        
        const { error } = validateUser(req.body);
 
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({
            email: req.body.email
        });

        if(!user) return res.status(400).send('Invalid email or password');

        const validPassword = await bcrypt.compare(req.body.password, user.password)
       
        if(!validPassword) return res.status(400).send('Invalid email or password');

        const token = user.generateAuthToken();

        res.send(token);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});

function validateUser(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    })

    return schema.validate(user);
}



export default router;