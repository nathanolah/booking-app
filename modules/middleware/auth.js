// auth.js
// Middleware functions used for authentication

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"
const accountModel = require('../models/accountSchema');

module.exports = () => {
    return {
        // Checks if account has logged in
        isLoggedIn: (req, res, next) => {
            if (req.session.account) {
                console.log(`account has logged in "auth.js" ${ req.session.account._id }`);


                // accountModel.findOne({_id: req.session.account._id}) 
                //     .then((account) => {

                //         console.log(`accounts model ${account}`);
                //         next();
                //     })
                //     .catch(err => res.json(err));
                    
                next();

            } else {
                // Not logged in redirect to login page
                res.json(`Account logged out`);
            }
        }, 

        isBarberLoggedIn: (req, res, next) => {
            if (req.session.account) {
                if (req.session.account.isBarber == true) {



                    next();
                } else {
                    res.json(`This account is not a barber`);
                }
            }
        },
        
        isShopManager: (req, res, next) => {
            if (req.session.account) {
                if (req.session.account.isManager == true) {
                    // check the shop id

                    next();
                } else {
                    res.json('This account is not the shop manager');
                }
            }

        },

        isAdmin: (req, res, next) => {
            if (req.session.account) {
                // check the account details 
                // check if system admin
                next();
            } else {
                res.json('This account is not a system admin');
            }

        }


    }

}