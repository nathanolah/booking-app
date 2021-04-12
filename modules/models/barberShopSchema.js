const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberModel = require('../models/barberSchema'); 
const customerModel = require('../models/customerSchema');

const barberShopSchema = new Schema({
    barberShopName: String,
    phoneNumber: String,
    address: String,
    manager: String,
    barbers: [{        
        type: Schema.ObjectId, ref: "Barbers",
    }],
    barberShopQueue: [{ 
        firstName: String,
        lastName: String,
        email: String
        //type: Schema.ObjectId, ref: "Customers",
        //type: Schema.ObjectId, ref: "Accounts"
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

// Delete customer from queue by their email
// barberShopSchema.statics.deleteCustomerFromQueue = (barberShopID, customer, res) => {
//     console.log(customer);

//     // find the customer id of matching email
//     barberShopModel.findOne({_id: barberShopID})


//     barberShopModel.updateOne({_id: barberShopID}, {$pull: {"barberShopQueue": customer._id}}, {safe:true, multi:true}, function(err, obj) {
//         if (err) {
//             res.json(err);
//         } else {
//             res.json(`Customer: ${ customer.email } removed from queue`);
//         }
//     }); 
// }

// Add customer that isn't logged in to the queue
// barberShopSchema.statics.addNotLoggedInCustomerToQueue = (barberShopId, customer, res) => {
//     barberShopModel.findOne({_id: barberShopId}).exec((err, barberShop) => {
//         if (err) {
//             res.json(err);
//         } else {
//             let newCust = new customerModel(customer);

//             barberShop.barberShopQueue.push(newCust);
//             barberShop.save();

//             res.json(`Customer: ${ customer.customerID } was added to queue`);
//         }
//     });

// }

// Add customer to queue
// barberShopSchema.statics.addCustomerToQueue = (barberShopId, customer, res) => {
//     barberShopModel.findOne({_id: barberShopId}).exec((err, barberShop) => {
//         if (err) {
//             res.json(err);
//         } else {

//             //let tempCustID = new mongoose.Types.ObjectId(customer._id)
        
//             let newCust = new customerModel(customer);
//             newCust.save((err) => {
//                 if (err) {
//                     res.json(err);
//                 } else {

//                     res.json(`New customer: ${ newCust._id } was added to collection`);
//                 }
//             });

//             barberShop.barberShopQueue.push(newCust);

//             barberShop.save((err) => {
//                 if (err) {
//                     res.json(err);
//                 } else {
//                     // customer is the object that holds the customer's details
//                     res.json(`Customer: ${ newCust._id } was added to queue`);
//                 }
//             });

//         }
//     });
// }

// Get all customers in queue
// barberShopSchema.statics.getBarberShopQueue = (barberShopId, res) => {
//     barberShopModel.findOne({_id: barberShopId}).populate('barberShopQueue')
//         .then(shop => { 
//             res.json(shop.barberShopQueue);
//         })
//         .catch(err => { res.json(err) });
// }


const barberShopModel = mongoose.model('BarberShops', barberShopSchema);
module.exports = barberShopModel;
