// customer.js 

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const customerModel = require('../models/customerSchema');

/* Customer Routes */


module.exports = router;