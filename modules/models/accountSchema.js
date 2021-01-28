// Account Model

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

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

});

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

const accountModel = mongoose.model('Accounts', accountSchema);
module.exports = accountModel;