const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberModel = require('../models/barberSchema'); //not sure if needed

const barberShopSchema = new Schema({
    barberShopName: String,
    phoneNumber: String,
    barbers: [{        
        type: Schema.ObjectId, ref: "Barbers",
    }],
    barberShopQueue: [{ 
        customerId: String
    }],

    // barberID: { type: Number },
    // firstName: { type: String },
    // lastName: { type: String },
    // email: { type: String, unique: true },
    // //dateCreated: { type: Date, default: Date.now() },
    // isManager: { type: Boolean },
    // paymentID: { type: Number },
    // scheduleID: { type: Number }

});

// Delete customer from queue
barberShopSchema.statics.deleteCustomerFromQueue = (barberShopID, customer, res) => {
    barberShopModel.updateOne({_id: barberShopID}, {$pull: {"barberShopQueue": {"customerId": customer.customerId}}}, {safe:true, multi:true}, function(err, obj) {
        if (err) {
            res.json(err);
        } else {
            res.json(`Customer: ${ customer.customerId } removed from queue`);
        }
    }); 
}

// Add customer to queue
barberShopSchema.statics.addCustomerToQueue = (barberShopId, customer, res) => {
    barberShopModel.findOne({_id: barberShopId}).exec((err, barberShop) => {
        if (err) {
            res.json(err);
        } else {
            barberShop.barberShopQueue.push(customer);
            barberShop.save();

            // customer is the object that holds the customer's details
            res.json(`Customer: ${ customer.customerId } was added to queue`);
        }
    });
}

// Get all customers in queue
barberShopSchema.statics.getBarberShopQueue = (barberShopId, res) => {
    barberShopModel.findOne({_id: barberShopId})
        .then(shop => { res.json(shop.barberShopQueue) })
        .catch(err => { res.json(err) });
}

const barberShopModel = mongoose.model('BarberShops', barberShopSchema);
module.exports = barberShopModel;