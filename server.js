// Rest API 
// Entry point file
// server.js
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require("passport");
const passportJWT = require("passport-jwt");
// Load the environment file
require('dotenv').config({ path: "./config/keys.env" });


const app = express();

app.use(cors());
app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

const barberController = require('./modules/controllers/barber');
const barberShopController = require('./modules/controllers/barberShop');
const customerController = require('./modules/controllers/customer');
const appointmentController = require('./modules/controllers/appointment');
const scheduleController = require('./modules/controllers/schedule');
const reviewController = require('./modules/controllers/review');

// Controllers
app.use('/api/barbers', barberController);
app.use('/api/barberShops', barberShopController);
app.use('/api/customers', customerController);
app.use('/api/appointments', appointmentController);
app.use('/api/schedules', scheduleController);
app.use('/api/reviews', reviewController);


var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = process.env.JWT_SECRET_OR_KEY;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

    if (jwt_payload) {
        next(null, {
            _id: jwt_payload._id,

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

var administrator = {
    
    id : process.env.ADMIN_ID,
    password : process.env.ADMIN_PASS

}
bcrypt.hash(administrator.password, 10).then(hash => { // Hash the password using a Salt that was generated using 10 rounds
    administrator.password = hash;
});


// Promise operation asynchronous 
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to mongoDB`); // If promise is fulfilled
    })
    .catch(err => console.log(`Error ${err}`)); // If the promise is rejected
mongoose.set('useCreateIndex', true);

/** Initialize the database service and start the server **/
app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
});

// Admin Route
app.post('/admin', (req, res) => {

    if (!req.body.id) {
        res.json('You must enter an id');
    }
    else if (!req.body.password) {
        res.json('You must enter a password');
    }
    else if (req.body.id != administrator.id) {
        res.json('Id it not correct')
    } else {


        bcrypt.compare(req.body.password, administrator.password)
            .then((isMatched) => {
                if (isMatched) {

                    //CREATE A SESSION FOR THIS ACCOUNT
                    var payload = {
                        _id: "Admin",

                        role: "Admin"
                    };
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.json({ "message": "login succeesful", "token": token });

                } else {

                    res.json(`Sorry, your id and/or password is incorrect`);
                }

            }).catch(err => res.json(err));;
    }
});
           

