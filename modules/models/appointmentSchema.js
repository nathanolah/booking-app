const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const customerModel = require('../models/customerSchema'); //not sure if needed
const barberModel = require('../models/barberSchema'); //not sure if needed

const appointmentSchema = new Schema({   
    date: {
        type: Date,
        default: Date.now()
    },
    custID: {
        type: Schema.ObjectId, ref: "Customers",
        required: true        
    },
    barberID: {
        type: Schema.ObjectId, ref: "Barbers",
        required: true,      
    },
    isActive: {
        type: Boolean,
        required: true,        
    }
    
});

const appointmentModel = mongoose.model('Appointment', customerSchema);
module.exports = appointmentModel;