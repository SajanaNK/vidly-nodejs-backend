import express from 'express';
import { User, validateUser } from '../models/user.js';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import {auth} from "../middleware/auth.js";


const router = express.Router();

router.get('/me', auth, async (req,res) => {
    try {

        const user = await User.findById(req.user._id).select('-password');

        res.send(user);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
})


router.post('/', async (req,res) => {
    try {
        
        const { error } = validateUser(req.body);
 
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({
            email: req.body.email
        });

        if(user) return res.status(400).send('User already registered');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));

        const salt = await bcrypt.genSalt(10)
        user.password =await bcrypt.hash(user.password, salt);

        // user = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // });

        
        await user.validate();

        user = await user.save();

        // res.send({
        //     name: user.name,
        //     email: user.email
        // });
        
        const token = user.generateAuthToken();
        
        res
            .header('x-auth-token', token)
            .send(_.pick(user, ['_id','name','email']));

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});


export default router;