// customer.js 
const jwt =require('jsonwebtoken');
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const app=express();

var ExtractJwt=passportJWT.ExtractJwt;
var JwtStrategy=passportJWT.Strategy;

var jwtOptions={};
jwtOptions.jwtFromRequest=ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey='&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

var strategy= new JwtStrategy(jwtOptions, function(jwt_payload, next){

    if(jwt_payload){
        next(null, {_id: jwt_payload._id,
        email:jwt_payload.email,
        firstName: jwt_payload.firstName,
        lastName: jwt_payload.lastName,
        role:jwt_payload.role
    });
    }else{
        next(null, false);
    }

});

passport.use(strategy);
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cors());
/* Customer Routes */
const customerModel = require('../models/customerSchema');


router.post('/', (req, res) => {
    const { firstName, lastName,password, cpassword, phoneNumber, email } = req.body;

    if (firstName == null || lastName == null || firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');

    } else if(phoneNumber == null || phoneNumber.length == ""){
        res.json("Please enter a valid phone number")
    } else if(email == null || email.length == ""){
        res.json("Please enter a email")
    }else if(password == "" || cpassword == "")
    {
        res.json("please enter the password")
    }
    else if (password.length < 6 || password.length > 12 && cpassword.length < 6 || cpassword.length > 12) {
        res.json('Password must 6 to 12 characters long');
    }
    else if (!password.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/) && !cpassword.match(/^(?=.*\d)(?=.*[a-z]).{6,12}$/)) {
        res.json('Password must contain letters and numbers');
    }
    else if (password != cpassword) {
       res.json('Passwords do not match');
    }
    else {
        customerModel.findOne({email: req.body.email}).then(cust=>{
            if(cust!=null){
                res.json('Account with email already exist')
            }
            else{
                bcrypt.hash(password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                
                    req.body.password = hash;
                    let newCustomer = new customerModel(req.body);
               
                    newCustomer.save((err) => {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json(`New customer: ${ newCustomer._id } was added to collection`);
                        }
                    });
                });
                
                
              
            }
        })
        
    }

});

// Get all Customers
router.get('/', (req, res) => {
    customerModel.find().exec()
        .then(customers => res.json(customers))
        .catch(err => res.json(err));
});

// Get customer by id
router.get('/:id', (req, res) => {
    customerModel.findOne({_id: req.params.id}).exec()
        .then(customers => res.json(customers))
        .catch(err => res.json(err));
});

// Update barber by id
router.put('/:id', (req, res) => {
    const { firstName, lastName, phoneNumber} = req.body;

    if (firstName == null || lastName == null || firstName.length == "" || lastName.length == "") {
        res.json('You must enter a full name');
    } else if(phoneNumber == null || phoneNumber.length == ""){
        res.json("Please enter a valid phone number")
    
    }
    else {
        customerModel.updateOne({_id: req.params.id}, {$set: req.body})
            .then(res.json(`customer ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    }

});

router.post('/login', (req, res)=>{
    

    

    if (!req.body.email) {
        res.json('You must enter an email');
    }
    else if (!req.body.password) {
       res.json('You must enter a password');
    }else {

        customerModel.findOne({email: req.body.email})
            .then((customer) => {
                
                // If no matching email found
                if (customer == null) {
                    res.json(`Account with Email address does not exist`);

                } else {
                    // Email found
                    // Compare password with encrypted password
                    console.log(customer);
                    bcrypt.compare(req.body.password, customer.password)
                        .then((isMatched) => {
                            if (isMatched) {
                                
                                //CREATE A SESSION FOR THIS ACCOUNT
                                var payload={
                                    _id:customer._id,
                                    email:customer.email,
                                    firstName:customer.firstName,
                                    lastName:customer.lastName,
                                    role:"customer"
                                };
                                var token =jwt.sign(payload, jwtOptions.secretOrKey);
                                res.json({"message" : "login succeesful", "token" : token});

                            } else {
                                
                                res.json(`Sorry, your email and/or password is incorrect`);
                            }

                        }).catch(err => res.json(err));;
            }})
            .catch(err => res.json(err));
    }

});


module.exports = router;


