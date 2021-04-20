// barber.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

// Barber Model
const barberModel = require('../models/barberSchema');

// BarberShop Model
const barberShopModel = require('../models/barberShopSchema');

const jwt = require('jsonwebtoken');
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require('bcryptjs');
const app = express();

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = '&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

    if (jwt_payload) {
        next(null, {
            _id: jwt_payload._id,
            email: jwt_payload.email,
            firstName: jwt_payload.firstName,
            lastName: jwt_payload.lastName,
            role: jwt_payload.role
        });
    } else {
        next(null, false);
    }

});

passport.use(strategy);
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cors());



/* Barber API Routes */

router.post('/login', (req, res) => {

    if (!req.body.email) {
        res.json('You must enter an email');
    }
    else if (!req.body.password) {
        res.json('You must enter a password');
    } else {

        barberModel.findOne({ email: req.body.email })
            .then((bar) => {

                // If no matching email found
                if (bar == null) {
                    res.json(`Account with Email address does not exist`);

                } else {
                    // Email found
                    // Compare password with encrypted password

                    bcrypt.compare(req.body.password, bar.password)
                        .then((isMatched) => {
                            if (isMatched) {
                                var roleForbar;
                                if (bar.isManager) {
                                    roleForbar = "Manager";
                                }
                                else {
                                    roleForbar = "Barber";
                                }
                                //CREATE A SESSION FOR THIS ACCOUNT
                                var payload = {
                                    _id: bar._id,
                                    email: bar.email,
                                    firstName: bar.firstName,
                                    lastName: bar.lastName,
                                    role: roleForbar
                                };

                                var token = jwt.sign(payload, jwtOptions.secretOrKey);

                                res.json({ "message": "login succeesful", "token": token });

                            } else {

                                res.json(`Sorry, your email and/or password is incorrect`);
                            }

                        }).catch(err => res.json(err));;
                }
            })
            .catch(err => res.json(err));
    }

});


// Add barber
router.post('/:id', (req, res) => {
    const { firstName, lastName, phoneNumber, email, password, cpassword } = req.body;

    if (firstName == null || lastName == null || firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');

    } else if (phoneNumber == null || phoneNumber.length == "") {
        res.json("Please enter a valid phone number")
    } else if (email == null || email.length == "") {
        res.json("Please enter a email")
    } else if (password == "" || cpassword == "") {
        res.json("please enter the password")
    }
    else if (password.length < 6 || password.length > 12 && cpassword.length < 6 || cpassword.length > 12) {
        res.json('Password must 6 to 12 characters long');
    }
    else if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/) && !cpassword.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
        res.json('Password must contain letters and numbers');
    }
    else {
        barberModel.findOne({ email: req.body.email }).then(bar => {
            if (bar != null) {
                res.json('Barber with email already exist');
            }
            else {
                bcrypt.hash(password, 10).then(hash => { // Hash the password using a Salt that was generated using 10 rounds

                    req.body.password = hash;
                    let newBarber = new barberModel(req.body);

                    newBarber.save((err) => {

                        if (err) {

                            res.json(err);

                        } else {

                            barberShopModel.updateOne({ _id: req.params.id }, { $push: { barbers: newBarber } })

                                .then(res.json(`BarberShop ${req.params.id} got new Barber`))

                                .catch(err => res.json(err))

                        }

                    });
                });

            }
        })

    }

});


// Add barber (OLD VERSION)
// router.post('/', (req, res) => {
//     const { firstName, lastName } = req.body;

//     if (firstName.length == "" || lastName.length == "") {
//         res.json('You must enter a full name');

//     } else {
//         let newBarber = new barberModel(req.body);
//         newBarber.save((err) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 res.json(`New barber: ${ newBarber._id } was added to collection`);
//             }
//         });
//     }

// });

// Get all barbers
router.get('/', (req, res) => {
    barberModel.find().populate('reviews').populate('schedules').exec()
        .then(barbers => res.json(barbers))
        .catch(err => res.json(err));
});

// Get barber by id
router.get('/:id', (req, res) => {
    barberModel.findOne({ _id: req.params.id }).populate('reviews').populate('schedules').exec()
        .then(barbers => res.json(barbers))
        .catch(err => res.json(err));
});

// Update barber by id
router.put('/:id', (req, res) => {
    const { firstName, lastName, phoneNumber, password, cpassword } = req.body;

    if (firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');

    } else if (phoneNumber == null || phoneNumber.length == "") {
        res.json("Please enter a valid phone number")
    } else if (password == null || password.length == "") {
        res.json("Please enter a password")
    } else if (cpassword == null || cpassword.length == "") {
        res.json("Please enter a confirm password");
    } else if (password != cpassword) {
        res.json("Password and confirm password not same")
    }




    else {
        crypt.hash(password, 10).then(hash => { // Hash the password using a Salt that was generated using 10 rounds

            req.body.password = hash;
            barberModel.updateOne({ _id: req.params.id }, { $set: req.body })
                .then(res.json(`Barber ${req.params.id} successfully updated`))
                .catch(err => res.json(err));
        });
    }

});

router.put('/:shop/:id/:manage', (req, res) => {

  

    if (req.params.manage == "false") {
        barberModel.updateOne({ _id: req.params.id }, { isManager: req.params.manage })
        .catch(err => res.json(err))
            .then((sucesss) => {

                barberShopModel.updateOne({ _id: req.params.shop }, {"$unset" : {manager:1}}).then(


                res.json(`Barber ${req.params.id} is no longer manager`))
                .catch(err=>res.json(err))
            })
            
    }
    else {
        barberModel.updateOne({ _id: req.params.id }, { isManager: req.params.manage })
        .catch(err => res.json(err))
        .then((success) =>{


                barberShopModel.updateOne({ _id: req.params.shop }, { manager: req.params.id}).then(


                res.json(`Barber ${req.params.id} is now new manager`))
                .catch(err=>res.json(err))
            })
    }

})

// Delete barber by id
router.delete('/:id/:shop', (req, res) => {
    barberModel.deleteOne({ _id: req.params.id }).exec()
        .then(res.json(`Barber ${req.params.id} successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;

