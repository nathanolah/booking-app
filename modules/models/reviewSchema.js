const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const reviewSchema = new Schema({
    
    ratings: Number,
    comments: String
    


});

const reviewModel = mongoose.model('Reviews', reviewSchema);
module.exports = reviewModel;