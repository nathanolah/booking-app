const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const reviewSchema = new Schema({
    
    ratings: Number,
    comments: String,
    valid:{type:String, default:"Submit"},
    author: {
        type: Schema.ObjectId, ref: "Customers",
        required: true        
    }


});

const reviewModel = mongoose.model('Reviews', reviewSchema);
module.exports = reviewModel;
