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

module.exports = router;


