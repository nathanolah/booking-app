const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const barberSchema = new Schema({
    
   


    
     firstName: { type: String },
     lastName: { type: String },
     email: { type: String, unique: true },
     dateCreated: { type: Date, default: Date.now() },
    // isManager: { type: Boolean },
     phoneNumber: { type: String },
     schedules: [{
        workDate: Date, 
        startTime: Date, 
        endTime: Date 
     }],
     reviews:[{
         ratings : Number,
         comments: String
     }],

});

const barberModel = mongoose.model('Barbers', barberSchema);
module.exports = barberModel;
