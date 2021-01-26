const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberSchema = new Schema({
    barberID: Number,
    firstName: String,
    lastName: String


    // barberID: { type: Number },
    // firstName: { type: String },
    // lastName: { type: String },
    // email: { type: String, unique: true },
    // //dateCreated: { type: Date, default: Date.now() },
    // isManager: { type: Boolean },
    // paymentID: { type: Number },
    // scheduleID: { type: Number }

});

const barberModel = mongoose.model('Barbers', barberSchema);
module.exports = barberModel;

//module.exports = barberSchema;