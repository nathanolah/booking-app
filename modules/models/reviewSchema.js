const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const reviewSchema = new Schema({
    
    ratings: Number,
    comments: String,
    valid:{type:Boolean, default:false},
    author: {
        type: Schema.ObjectId, ref: "Customers",
        required: true        
    }


});

const reviewModel = mongoose.model('Reviews', reviewSchema);
module.exports = reviewModel;