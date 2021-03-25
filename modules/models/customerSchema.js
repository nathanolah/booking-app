const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const customerSchema = new Schema({   
    firstName: {
        type: String,
        required: true,
        length: 50
    },
    lastName: {
        type: String,
        required: true,
        length: 50
    },
    password:{
        type: String,
        required:true
    },
    phoneNumber: {
        type: String,
        required: true,
        length: 10
    },
    email: {
        type: String,
        required: true,
        length: 50
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

const customerModel = mongoose.model('Customers', customerSchema);
module.exports = customerModel;
