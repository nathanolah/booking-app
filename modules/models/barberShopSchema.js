const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberShopSchema = new Schema({
    barberShopName: String,
    phoneNumber: String,
    address:String,
    barbers: [{
        type: Schema.ObjectId, ref: 'Barbers'
    }],
    barberShopQueue: [{ 
        customerId: String
    }],

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