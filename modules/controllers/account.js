// account.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Account Model
const accountModel = require('../models/accountSchema');

/* Account Profile Route */

// Get user's account profile
router.get('/profile/:id', auth().isLoggedIn, (req, res) => {
    // Checks if the route id is the same as the current sessions account id
    if (req.session.account._id != req.params.id) {
        res.json(`invalid id: ${ req.params.id }`);
    } else {
         // Display account details
         accountModel.findById(req.params.id)
         .then(account => res.json(account))
         .catch(err => res.json(err));
    }

});

// Account Logout (End Session)
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json(`You have logged out`);
});

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

                                // Create session for the user
                                req.session.account = account;
                                res.redirect(`/api/accounts/profile/${ account._id }`);

                                //res.json(`Account: ${ account._id } has logged in`);
                                //console.log(`Account: ${ account._id } has logged in`);

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
                        password: password 
                    }
            
                    const newAccount = new accountModel(account);
            
                    newAccount.save((err) => {
                        if (err) {
                            res.json(err);
                        } else {
                        
                            // Redirect user to the login page
                            res.json(`New account: ${ newAccount._id } was added to collection`);
                        }
                    });

                }
            })
            .catch(err => res.json(err));
    }


});

// New password validations
function checkPassword(password, cpassword, errorMessage) {
    if (password.length < 6 || password.length > 12 && cpassword.length < 6 || cpassword.length > 12) {
        errorMessage.push('Password must 6 to 12 characters long');
    }
    if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/) && !cpassword.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
        errorMessage.push('Password must contain letters and numbers');
    }
    if (password != cpassword) {
        errorMessage.push('Passwords do not match');
    }
}

// Update account by id 
router.put('/update/:id', auth().isLoggedIn, (req, res) => {
    if (req.session.account._id != req.params.id) {
        res.json(`This account is not logged in`);

    } else {
        accountModel.findOne({_id: req.params.id}).exec()
            .then(acc => { 
                let accDetails = {};
                let passwordChanged = false;

                accDetails = acc;

                // Update account details
                const errorMessage = [];

                const { firstName, lastName, email, password, cpassword } = req.body; //Details that are in the input fields

                if (firstName == "" || lastName == "") {
                    errorMessage.push('You must enter a full name');
                }

                if (email == "") {
                    errorMessage.push('You must enter an email');
                }

                /* If the user has changed their current email */
                if (accDetails.email != email) {

                    // Check if new email already exists in the accounts collection
                    accountModel.exists({email: email}, function(err, doc) {
                        if (err) {
                            res.json(err)
                        } else {

                            // Checks if new email already exists 
                            if (doc == true) {
                                errorMessage.push(`Email already exists`);
                            }

                            // Password Validation
                            if (password == "" || cpassword == "") {
                                errorMessage.push('You must enter a password');
                            }

                            // Password has been change from the original
                            if (accDetails.password != password) { 
                                passwordChanged = true;
                                checkPassword(password, cpassword, errorMessage);
                            }

                            if (errorMessage.length > 0) {
                                res.json(errorMessage);
                            } else {
                                // Update the account details
                                
                                // If the password has been changed
                                if (passwordChanged == true) {
                                    // Salt random generated character or strings
                                    bcrypt.genSalt(12)
                                    .then((salt) => {
                                        let newPassword = password;
                                        
                                        bcrypt.hash(newPassword, salt)
                                            .then((encryptPassword) => {
                                                newPassword = encryptPassword;

                                                // Update the account details
                                                const editAccount = {
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    email: email,
                                                    password: newPassword
                                                }
                            
                                                accountModel.updateOne({_id: req.params.id}, {$set: editAccount})
                                                    .then(res.json(`Account ${ req.params.id } successfully updated`))
                                                    .catch(err => res.json(err));


                                                
                                            })
                                            .catch(err => console.log(`Error occured when hashing ${ err }`));
                                    })
                                    .catch(err => console.log(`Error occured when salting ${ err }`));
            
            
                                } else {

                                    // Update the account details
                                    const editAccount = {
                                        firstName: firstName,
                                        lastName: lastName,
                                        email: email,
                                        password: password
                                    }
                
                                    accountModel.updateOne({_id: req.params.id}, {$set: editAccount})
                                        .then(res.json(`Account ${ req.params.id } successfully updated`))
                                        .catch(err => res.json(err));

                                }
            
                            }

                        }

                    });


                } else {
                    /** If the user hasn't changed their current email **/

                    // Password Validation
                    if (password == "" || cpassword == "") {
                        errorMessage.push('You must enter a password');
                    }

                    // Password has been change from the original
                    if (accDetails.password != password) { 
                        passwordChanged = true;
                        checkPassword(password, cpassword, errorMessage);
                    }

                    
                    if (errorMessage.length > 0) {
                        res.json(errorMessage);
    
                    } else {
                        // Update the account details
                        if (passwordChanged == true) {
                            // Salt random generated character or strings
                            bcrypt.genSalt(12)
                            .then((salt) => {
                                let newPassword = password;

                                bcrypt.hash(newPassword, salt)
                                    .then((encryptPassword) => {
                                        newPassword = encryptPassword;

                                        
                                        // Update the account details
                                        const editAccount = {
                                            firstName: firstName,
                                            lastName: lastName,
                                            email: email,
                                            password: newPassword
                                        }
                    
                                        accountModel.updateOne({_id: req.params.id}, {$set: editAccount})
                                            .then(res.json(`Account ${ req.params.id } successfully updated`))
                                            .catch(err => res.json(err));


                                    })
                                    .catch(err => console.log(`Error occured when hashing ${ err }`));
                            })
                            .catch(err => console.log(`Error occured when salting ${ err }`));
    
    
                        } else {
                            // Update the account details
                            const editAccount = {
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: password
                            }
        
                            accountModel.updateOne({_id: req.params.id}, {$set: editAccount})
                                .then(res.json(`Account ${ req.params.id } successfully updated`))
                                .catch(err => res.json(err));
                            
                        }
    
                    }

                }

            })
            .catch(err => res.json(err));

    }


});

// Deletes an account by id in the account collection (This account must be logged in and system admin to delete)
router.delete('/:id', auth().isAdmin, (req, res) => {
    accountModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Account ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;

