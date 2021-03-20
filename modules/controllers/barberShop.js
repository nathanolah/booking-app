// barberShop.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const barberShopModel = require('../models/barberShopSchema');
const customerModel = require('../models/customerSchema');

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

// Get all barber shops or with query parameters for pagination (http://localhost:8080/api/barberShops?page=1&perPage=6)
router.get('/', (req, res) => {
    let page = req.query.page;
    let perPage = req.query.perPage;

    if (+page && +perPage) {
        page = (+page - 1);
        barberShopModel.find().skip(page * +perPage).limit(+perPage).exec()
            .then(shops => {
                res.json(shops)
            })
            .catch(err => res.json(err));
    } else {
        barberShopModel.find().populate('barberId').populate('customerId').exec()
            .then(shops => res.json(shops))
            .catch(err => res.json(err));

    }
    
});

// Get barber shop by id
router.get('/:id', (req, res) => {
    barberShopModel.findOne({_id: req.params.id}).populate('barberId').populate('customerId').exec()
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

/// Add barber to shop
router.put('/addBarber/:id', (req, res) => {
    const {barbID} = req.body;
    let tempBarbID = new mongoose.Types.ObjectId(barbID);
    console.log(barbID);

    barberShopModel.updateOne({_id: req.params.id}, {$push: {barbers: tempBarbID}})
            .then(res.json(`Shop ${ req.params.id } successfully updated with new barber`))
            .catch(err => res.json(err));
});

// Delete barber from shop
router.put('/deleteBarber/:id', (req, res) => {
    const {barbID} = req.body;
    console.log(barbID);

    barberShopModel.updateOne({_id: req.params.id}, {$pull: {"barbers":  barbID}}, function(err, obj) {
        if (err) {
            res.json(err);
        } else {
            res.json(`Barber: ${ barbID } removed from queue`);
        }
    }); 
});

// Get all barbers from shop
router.get('/barbers/:id', (req, res) => {
    barberShopModel.findOne({_id: req.params.id}).populate('barbers')
        .then(shop => { res.json(shop.barbers) })
        .catch(err => { res.json(err) })
});

// Get barber by id from shop
router.get('/getOneBarber/:id', (req, res) => {
    const {barbID} = req.body;
    barberShopModel.findOne({_id: req.params.id}, {"barbers" : barbID}).populate('barbers')
        .then(shop => { res.json(shop.barbers) })
        .catch(err => { res.json(err) })
});


//////////////////////////////////////////
/* Barber Shop Queue Routes */

// Get barber shop queue by id
router.get('/queue/:id', (req, res) => {
    //barberShopModel.getBarberShopQueue(req.params.id, res);
    
    //barberShopModel.findOne({_id: req.params.id})
        //.then(shop => { res.json(shop.barberShopQueue) })
        //.catch(err => { res.json(err) });
    
    let page = req.query.page;
    let perPage = req.query.perPage;

    if (+page && +perPage) {
        page = (+page - 1);

        barberShopModel.findOne({_id: req.params.id}).skip(page * +perPage).limit(+perPage).exec()
            .then(shop => { res.json(shop.barberShopQueue) })
            .catch(err => res.json(err));
    } else {
        barberShopModel.findOne({_id: req.params.id})
            .then(shop => { res.json(shop.barberShopQueue) })
            .catch(err => { res.json(err) });
    }
    
    
});

// Add a customer to the barber shop queue by id (Customer is not logged in) 
router.post('/notLoggedIn/queue/:id', (req, res) => {
    //barberShopModel.addNotLoggedInCustomerToQueue(req.params.id, req.body, res);
});

// Add customer to barber shop queue by id
router.post('/queue/:id', (req, res) => {
    //barberShopModel.addCustomerToQueue(req.params.id, req.body, res);

    barberShopModel.findOne({_id: req.params.id}).exec((err, barberShop) => {
        if (err) {
            res.json(err);
        } else {
            barberShop.barberShopQueue.push(req.body);
            barberShop.save((err) => {
                if (err) {
                    res.json(err);
                } else {
                    // customer is the object that holds the customer's details
                    res.json(`Customer: ${ req.body.email } was added to queue`);
                }
            });

        }
    });


});

// Remove from barber shop queue by id
router.put('/queue/:id', (req, res) => {
    // req.params.id is the id of the shop
    // req.body contains the customer details
    //barberShopModel.deleteCustomerFromQueue(req.params.id, req.body, res);      
    barberShopModel.updateOne({_id: req.params.id}, {$pull: {"barberShopQueue": req.body}}, {safe:true, multi:true}, function(err, obj) {
        if (err) {
            res.json(err);
        } else {
            res.json(`Customer: ${ req.body.email } removed from queue`);
        }
    });


});

module.exports = router;
