//

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

// BarberShop Model
const barberShopModel = require('./barberShopSchema');

module.exports = function queue() {
    // Initialize


    // -----------
    
    this.getAllCustomers = (id) => {

        // find the barber shop by id
        barberShopModel.findOne({_id: id})
            .then(lineUp => { 
                return lineUp;
            })
            .catch(err => { 
                return err;
            });


        //return 
    }

    // Add function
    this.addCustomerToQueue = (id, customer) => {
        
        // Find barber shop
        barberShopModel.findOne({_id: id})
            .then(barberShop => {
                // Add customer to this documents queue array



            })  
            .catch(err => {console.log(err)});
    }

    // Remove




}