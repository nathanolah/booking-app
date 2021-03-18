// barber.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

// Barber Model
const barberModel = require('../models/barberSchema');

/* Barber API Routes */

// Add barber
router.post('/', (req, res) => {
    const { firstName, lastName } = req.body;

    if (firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');

    } else {
        let newBarber = new barberModel(req.body);
        newBarber.save((err) => {
            if (err) {
                res.json(err);
            } else {
                res.json(`New barber: ${ newBarber._id } was added to collection`);
            }
        });
    }

});

// Get all barbers
router.get('/', (req, res) => {
    barberModel.find().populate('reviewID').populate('scheduleID').exec()
        .then(barbers => res.json(barbers))
        .catch(err => res.json(err));
});

// Get barber by id
router.get('/:id', (req, res) => {
    barberModel.findOne({_id: req.params.id}).populate('reviewID').populate('scheduleID').exec()
        .then(barbers => res.json(barbers))
        .catch(err => res.json(err));
});

// Update barber by id
router.put('/:id', (req, res) => {
    const { firstName, lastName } = req.body;

    if (firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');

    } else {
        barberModel.updateOne({_id: req.params.id}, {$set: req.body})
            .then(res.json(`Barber ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    }

});

// Delete barber by id
router.delete('/:id', (req, res) => {
    barberModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Barber ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;