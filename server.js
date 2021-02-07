// Rest API 
// Entry point file
// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

// Stores the session in the database
const MongoStore = require('connect-mongo')(session);

// Load the environment file
require('dotenv').config({ path: "./config/keys.env" });

//connection string if needed
//const connectionString = `mongodb+srv://groupone:group1prj@cluster0.w4a97.mongodb.net/booking-app?retryWrites=true&w=majority`; 

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: true, 
    // cookie: { secure: true },

    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 80 * 1000 }
}));

const HTTP_PORT = process.env.PORT || 8080;

const barberController = require('./modules/controllers/barber');
const accountController = require('./modules/controllers/account');
const barberShopController = require('./modules/controllers/barberShop');
const customerController = require('./modules/controllers/customer');
const appointmentController = require('./modules/controllers/appointment');
const scheduleController = require('./modules/controllers/schedule');
const reviewController = require('./modules/controllers/review');

// Controllers
app.use('/api/barbers', barberController);
app.use('/api/accounts', accountController);
app.use('/api/barberShops', barberShopController);
app.use('/api/customers', customerController);
app.use('/api/appointments', appointmentController);
app.use('/api/schedules', scheduleController);
app.use('/api/reviews', reviewController);

// Promise operation asynchronous 
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to mongoDB`); // If promise is fulfilled
    })
    .catch(err => console.log(`Error ${ err }`)); // If the promise is rejected
mongoose.set('useCreateIndex', true);

/** Initialize the database service and start the server **/ 
app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${ HTTP_PORT }`);
});
