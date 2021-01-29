const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberShopSchema = new Schema({
    barberShopName: String,
    barberShopQueue: [{ customerId: String }],

    // barberID: { type: Number },
    // firstName: { type: String },
    // lastName: { type: String },
    // email: { type: String, unique: true },
    // //dateCreated: { type: Date, default: Date.now() },
    // isManager: { type: Boolean },
    // paymentID: { type: Number },
    // scheduleID: { type: Number }

});

barberShopSchema.statics.addCustomerToQueue = (barberShopId, customerId, res) => {
    barberShopModel.findOne({_id: barberShopId}).exec((err, barberShop) => {
        if (err) {
            res.json(err);
        }

        barberShop.barberShopQueue.push(customerId);
        barberShop.save();

    });

        // .then(barberShop => {
            
        // })
        // .catch(err => res.json(err));
}

barberShopSchema.statics.getBarberShopQueue = (barberShopId, res) => {
    console.log('testing')
    barberShopModel.findOne({_id: barberShopId})
        .then(shop => { res.json(shop.barberShopQueue) })
        .catch(err => { res.json(err) });
        // .then(shop => console.log(shop.barberShopQueue))
        // .catch(err => console.log(err));
}


const barberShopModel = mongoose.model('BarberShops', barberShopSchema);
module.exports = barberShopModel;