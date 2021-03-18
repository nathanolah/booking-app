// customer.js 

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

/* Customer Routes */
const customerModel = require('../models/customerSchema');

router.post('/', (req, res) => {
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (firstName == null || lastName == null || firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');

    } else if(phoneNumber == null || phoneNumber.length == ""){
        res.json("Please enter a valid phone number")
    } else if(email == null || email.length == ""){
        res.json("Please enter a valid phone number")
    }
    else {
        let newCustomer = new customerModel(req.body);
        newCustomer.save((err) => {
            if (err) {
                res.json(err);
            } else {
                res.json(`New customer: ${ newCustomer._id } was added to collection`);
            }
        });
    }

});

// Get all Customers
router.get('/', (req, res) => {
    customerModel.find().exec()
        .then(customers => res.json(customers))
        .catch(err => res.json(err));
});

// Get customer by id
router.get('/:id', (req, res) => {
    customerModel.findOne({_id: req.params.id}).exec()
        .then(customers => res.json(customers))
        .catch(err => res.json(err));
});

// Update barber by id
router.put('/:id', (req, res) => {
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (firstName == null || lastName == null || firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');
    } else if(phoneNumber == null || phoneNumber.length == ""){
        res.json("Please enter a valid phone number")
    } else if(email == null || email.length == ""){
        res.json("Please enter a valid phone number")
    }
    else {
        customerModel.updateOne({_id: req.params.id}, {$set: req.body})
            .then(res.json(`customer ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    }

});

module.exports = router;