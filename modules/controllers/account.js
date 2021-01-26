

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const bcrypt = require('bcryptjs');

// Account Model
const accountModel = require('../models/accountSchema');

/* Account API Routes */

// Get all accounts
router.get('/', (req, res) => {
    accountModel.find().exec()
        .then(accounts => res.json(accounts))
        .catch(err => res.json(err));
});

// Get account by id
router.get('/:id', (req, res) => {
    accountModel.findOne({_id: req.params.id}).exec()
        .then(accounts => res.json(accounts))
        .catch(err => res.json(err));
});

// Account Login
router.post('/login', (req, res) => {
    const errorMessage = [];
    const { password, email } = req.body;

    // Check for empty fields
    if (email == "") {
        errorMessage.push('You must enter an email');
    }
    if (password == "") {
        errorMessage.push('You must enter a password');
    }

    if (errorMessage.length > 0) {
        res.json(errorMessage);

    } else {

        accountModel.findOne({email: req.body.email})
            .then((account) => {

                // If no matching email found
                if (account == null) {
                    res.json(`Email address does not exist`);

                } else {
                    // Email found
                    // Compare password with encrypted password
                    bcrypt.compare(req.body.password, account.password)
                        .then((isMatched) => {
                            if (isMatched == true) {
                                
                                //CREATE A SESSION FOR THIS ACCOUNT
                                res.json(`Account: ${ account._id } has logged in`);

                            } else {
                                res.json(`Sorry, your email and/or password is incorrect`);
                            }

                        })
                        .catch(err => res.json(err));
                }
            })
            .catch(err => res.json(err));
    }

});

// Add account (Account sign up)
router.post('/signup', (req, res) => {
    const errorMessage = [];
    const { firstName, lastName, email, password, cpassword } = req.body;
    
    if (firstName == "" || lastName == "") {
        errorMessage.push('You must enter a full name');
    }
    if (email == "") {
        errorMessage.push('You must enter an email');
    }
    if (password == "" || cpassword == "") {
        errorMessage.push('You must enter a password');
    }
    if (password.length < 6 || password.length > 12 && cpassword.length < 6 || cpassword.length > 12) {
        errorMessage.push('Password must 6 to 12 characters long');
    }
    if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/) && !cpassword.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
        errorMessage.push('Password must contain letters and numbers');
    }
    if (password != cpassword) {
        errorMessage.push('Passwords do not match');
    }

    if (errorMessage.length > 0) {
        res.json(errorMessage);

    } else {

        // Check for an existing email
        accountModel.findOne({email: req.body.email})
            .then(account => {
                if (account != null) {
                    res.json(`Email already exists`);

                } else {
            
                    // Create new account object to update (this is to encrypt the new password)
                    const account = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password // TEST THIS
                    }
            
                    const newAccount = new accountModel(account);
            
                    newAccount.save((err) => {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json(`New account: ${ newAccount._id } was added to collection`);
                        }
                    });

                }
            })
            .catch(err => res.json(err));
    }


});

// Update account by id
router.put('/:id', (req, res) => {
    const errorMessage = [];
    const { firstName, lastName, email, password, cpassword } = req.body;
    
    if (firstName == "" || lastName == "") {
        errorMessage.push('You must enter a full name');
    }
    if (email == "") {
        errorMessage.push('You must enter an email');
    }
    if (password == "" || cpassword == "") {
        errorMessage.push('You must enter a password');
    }
    if (password.length < 6 || password.length > 12 && cpassword.length < 6 || cpassword.length > 12) {
        errorMessage.push('Password must 6 to 12 characters long');
    }
    if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/) && !cpassword.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
        errorMessage.push('Password must contain letters and numbers');
    }
    if (password != cpassword) {
        errorMessage.push('Passwords do not match');
    }

    if (errorMessage.length > 0) {
        res.json(errorMessage);

    } else {

        // Check for an existing email
        accountModel.findOne({email: req.body.email})
            .then(account => {
                if (account != null) {
                    res.json(`Email already exists`);

                } else {
                    console.log('else statement');

                    // Create new account object to update (this is to encrypt the new password)
                    const editAccount = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email, // EMAIL NOT CHANGING
                        password: password // TEST THIS
                    }
            
                    const updatedAccount = new accountModel(editAccount);
            
                    accountModel.updateOne({_id: req.params.id}, {$set: updatedAccount})
                        .then(res.json(`Account ${ req.params.id } successfully updated`))
                        .catch(err => res.json(err));


                    
                }
            })
            .catch(err => res.json(err));


    }

});

// Delete account by id
router.delete('/:id', (req, res) => {
    accountModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Account ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;

