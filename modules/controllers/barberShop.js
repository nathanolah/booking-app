// barberShop.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const barberShopModel = require('../models/barberShopSchema');

/* Shop Routes */

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
router.get('/:id', (req, res) => {
    barberShopModel.findOne({_id: req.params.id}).exec()
        .then(shop => res.json(shop))
        .catch(err => res.json(err));

});

// Update barber shop by id
router.put('/:id', (req, res) => {
    const { barberShopName } = req.body;

    if (barberShopName == "") {
        res.json(`You must enter a shop name`);
    } else {
        barberShopModel.updateOne({_id: req.params.id}, {$set: req.body})
            .then(res.json(`Shop ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    }
});

// Delete barber shop by id
router.delete('/:id', (req, res) => {
    barberShopModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Shop: ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});


/* Routes that refer to the barbers of the shop */

// Add barber to shop (id refers to the shop id)
router.post('/barber/:id', (req, res) => {

    const tempId = req.body;
    //console.log(req.body);

    let barberId = mongoose.Types.ObjectId(tempId.newId);

    console.log(barberId);
    barberShopModel.updateOne({_id: req.params.id}, {$push: {'barbers': barberId}}, function(err, result) {
        if (err) {
            res.json(err)
        } else {
            res.json(`Added new barber to the barber list`);
        }
    });
    
    // barberShopModel.updateOne({_id: req.params.id}, {$push:{"queue": newID}}, 
    // function(err, result) {
    //     if (err) { console.log(err); res.send(err); return;}
    //     else{
    //         res.json('worked');
    //     }
        
    //   });
});

// Delete barber from shop
router.delete('/barber', (req, res) => {

});

// Get all barbers from shop (id is shop id)
router.get('/barber/:id', (req, res) => {
    barberShopModel.findOne({_id: req.params.id}).populate('barbers').exec()
    .then(barberShops => res.json(barberShops))
    .catch(err => res.json(err));

});

// Get barber by id from shop
router.get('/barber/:id', (req, res) => {

});

/* Barber Shop Queue Routes */

// Get barber shop queue by id
router.get('/queue/:id', (req, res) => {
    barberShopModel.getBarberShopQueue(req.params.id, res);
});

// Add customer to barber shop queue by id
router.post('/queue/:id', (req, res) => {
    barberShopModel.addCustomerToQueue(req.params.id, req.body, res);
});

// Remove from barber shop queue by id
router.delete('/queue/:id', (req, res) => {
    // req.params.id is the id of the shop
    // req.body contains the customer details
    barberShopModel.deleteCustomerFromQueue(req.params.id, req.body, res); 
});


module.exports = router;