const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const customerModel = require('../models/customerSchema');

const barberShopSchema = new Schema({
    name: {
        type: String,
        required: true,
        length: 50
    },
    phoneNumber: {
        type: String,
        required: true,
        length: 10
    },
    barberID:[{
        type: String,
        required: true
    }],
    queue:[{
        type: String        
        
    }]
    

});

const barberShopModel = mongoose.model('BarberShops', barberShopSchema);
module.exports = barberShopModel;