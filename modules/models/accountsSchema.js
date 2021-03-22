// Account Model

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const roles = { discriminatorKey: 'role' };


const accountSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }

},roles);

// Encrypt account password
accountSchema.pre('save', function(next) {

    // Salt random generated character or strings
    bcrypt.genSalt(12)
        .then((salt) => {
            
            bcrypt.hash(this.password, salt)
                .then((encryptPassword) => {
                    this.password = encryptPassword;
                    next();
                })
                .catch(err => console.log(`Error occured when hashing ${ err }`));
        })
        .catch(err => console.log(`Error occured when salting ${ err }`));

});

const accountsModel = mongoose.model('AccountSchema', accountSchema);
const barber=accountsModel.discriminator('Barber', new mongoose.Schema({
    schedules: [{ type: Schema.ObjectId, ref: 'Schedules' }],
    reviews:[{
        type: Schema.ObjectId, ref: 'Reviews'
    }]


}, roles));

const shopmanager=accountsModel.discriminator('ShopManager', new mongoose.Schema({
    ManagingShop: { type: Schema.ObjectId, ref: 'BarberShops' }
    


}, roles));

const Customer=accountsModel.discriminator('Customer', new mongoose.Schema({
    favoriteShops: [{ type: Schema.ObjectId, ref: 'BarberShops' }],
    myreviews:[{
        type: Schema.ObjectId, ref: 'Reviews'
    }],
    phoneNumber: {
        type: String,
        required: true,
        length: 10
    },
    
    myBooks:[{ type: Schema.ObjectId, ref: 'Appointment'}]

}, roles));



module.exports = {accountsModel,barber,shopmanager,Customer};