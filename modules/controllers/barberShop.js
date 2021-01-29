const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const queue = require('../models/queue');
const barberShopModel = require('../models/barberShopSchema');

// Add new barber shop
router.post('/', (req, res) => {
    const { barberShopName } = req.body;

    if (barberShopName.length == "") {
        res.json(`You must enter a shop name`);
    } else {
        let newShop = new barberShopModel(req.body);
        newShop.save((err) => {
            if (err) {
                res.json(err);
            } else {
                res.json(`New shop ${ newShop._id } was added successfully`);
            }
        });
    }


});

// Get all barber shops
router.get('/', (req, res) => {
    barberShopModel.find().exec()
        .then(shops => res.json(shops))
        .catch(err => res.json(err));
});

// Get barber shop by id

// Get barber shop queue by id
router.get('/queue/:id', (req, res) => {
    barberShopModel.getBarberShopQueue(req.params.id, res);
    //res.json(queue.getAllCustomers(req.params.id));
});


// Add customer to barber shop queue by id
router.post('/queue/:id', (req, res) => {
    barberShopModel.addCustomerToQueue(req.params.id, req.body, res);

//     let customer = "newCustomer";

//     queue.addCustomerToQueue(id, customer);
});


// Remove from barber shop queue by id


module.exports = router;