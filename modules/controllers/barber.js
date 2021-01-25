

const express = require('express');
const router = express.Router();

// Barber Model
const barberModel = require('../barberSchema');

/* Barber API Routes */

// Add barber
router.post('/', (req, res) => {
    let newBarber = new barberModel(req.body);
    newBarber.save((err) => {
        if (err) {
            res.json(err);
        } else {
            res.json(`New barber: ${ newBarber._id } was added to collection`);
        }
    })
})

// Get all barbers
router.get('/', (req, res) => {
    barberModel.find().exec()
        .then(barbers => res.json(barbers))
        .catch(err => res.json(err));
});

// Get barber by id
router.get('/:id', (req, res) => {
    barberModel.findOne({_id: req.params.id}).exec()
        .then(barbers => res.json(barbers))
        .catch(err => res.json(err));
});

// Update barber by id

// Delete barber by id



// FINISH THIS THEN ACCOUNT ROUTES 


module.exports = router;