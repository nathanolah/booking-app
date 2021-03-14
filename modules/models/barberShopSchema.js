const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberModel = require('../models/barberSchema'); //not sure if needed

const barberShopSchema = new Schema({
    barberShopName: String,
    phoneNumber: String,
    address: String,

    barbers: [{        
        type: Schema.ObjectId, ref: "Barbers",
    }],
    barberShopQueue: [{ 
        type: Schema.ObjectId, ref: "Customers"
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
    console.log(customer);
    barberShopModel.updateOne({_id: barberShopID}, {$pull: {"barberShopQueue": customer.customerID}}, {safe:true, multi:true}, function(err, obj) {
        if (err) {
            res.json(err);
        } else {
            res.json(`Customer: ${ customer.customerID } removed from queue`);
        }
    }); 
}

// Add customer to queue
barberShopSchema.statics.addCustomerToQueue = (barberShopId, customer, res) => {
    barberShopModel.findOne({_id: barberShopId}).exec((err, barberShop) => {
        if (err) {
            res.json(err);
        } else {
            let tempCustID = new mongoose.Types.ObjectId(customer.customerID)

            barberShop.barberShopQueue.push(tempCustID);
            barberShop.save();

            // customer is the object that holds the customer's details
            res.json(`Customer: ${ customer.customerID } was added to queue`);
        }
    });
}

// Get all customers in queue
barberShopSchema.statics.getBarberShopQueue = (barberShopId, res) => {
    barberShopModel.findOne({_id: barberShopId}).populate('barberShopQueue')
        .then(shop => { res.json(shop.barberShopQueue) })
        .catch(err => { res.json(err) });
}

const barberShopModel = mongoose.model('BarberShops', barberShopSchema);
module.exports = barberShopModel;