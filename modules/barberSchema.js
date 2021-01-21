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

    // title: String,
    // postDate: Date,
    // featuredImage: String,
    // post: String,
    // postedBy: String,
    // comments: [{ author: String, comment: String, date: Date }],
    // category: String,
    // tags: [String],
    // isPrivate: Boolean,
    // views: Number
});

// const barberModel = mongoose.model('Barbers', barberSchema);
// module.exports = barberModel;

module.exports = barberSchema;