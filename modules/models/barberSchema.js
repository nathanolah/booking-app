const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now() },
    isManager: { type: Boolean, default:false},
    password:{
        type: String,
        required:true
    },
    phoneNumber: { type: String },
    schedules: [{ type: Schema.ObjectId, ref: 'Schedules' }],
    reviews:[{
        type: Schema.ObjectId, ref: 'Reviews'
    }]


});

const barberModel = mongoose.model('Barbers', barberSchema);
module.exports = barberModel;