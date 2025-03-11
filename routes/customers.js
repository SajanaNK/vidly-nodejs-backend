import mongoose from "mongoose"
import express from "express"
import {Customer, validateCustomer} from "../models/customer.js"

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const result = await Customer.find().sort('name');
        res.send(result);
        console.log(result);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});


router.get('/:id', async (req, res) => {
    try {

        const customerId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(404).send('Invalid ID Type');
        }

        const customer = await Customer.findById(customerId);

        if(!customer) return res.status(404).send("The customer with the given ID was not found");

        res.send(customer);


    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});

router.post('/', async (req,res) => {
    try {

        const { error} = validateCustomer(req.body);

        if(error) return res.status(400).send(error.details[0].message);

        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });

        customer =  await customer.save();

        res.send(customer);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});


router.put('/:id', async (req,res) => {
    try {
        
        const customerId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(customerId)){
            return res.status(404).send('Invalid ID Type');
        }

        let customer =  await Customer.findById(customerId);

        if(!customer) return res.status(404).send("The customer with the given ID was not found");

        const { error} = validateCustomer(req.body);

        if(error) return res.status(400).send(error.details[0].message);

        customer = await Customer.findByIdAndUpdate({_id: customerId}, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, {new: true});

        res.send(customer);

        console.log("Customer Updated : ", customer);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});


router.delete('/:id', async (req,res) => {
    try {

        const customerId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(customerId)){
            return res.status(404).send('Invalid ID Type');
        }

        let customer =  await Customer.findById(customerId);

        if(!customer) return res.status(404).send("The customer with the given ID was not found");

        const result = await Customer.deleteOne({_id: customerId});

        res.send(result);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong : ' + error);
    }
});






export default router;