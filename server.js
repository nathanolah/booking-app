// Rest API 
//
//

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dataService = require('./modules/data-service.js'); 
// const myData = dataService(`mongodb+srv://nolah:prj123@cluster0.qbhut.mongodb.net/simple-api-users?retryWrites=true&w=majority`);
const myData = dataService(`mongodb+srv://groupone:group1prj@cluster0.w4a97.mongodb.net/booking-app?retryWrites=true&w=majority`);


const connectionString = `mongodb+srv://groupone:group1prj@cluster0.w4a97.mongodb.net/booking-app?retryWrites=true&w=majority`;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;



const barberController = require('./modules/controllers/barber');

// Controllers
app.use('/api/barbers', barberController);

// Promise operation asynchronous // REPLACE myData with process.env.MONGO_DB_URL
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to mongoDB`); // If promise is fulfilled
    })
    .catch(err => console.log(`Error ${ err }`)); // If the promise is rejected



/** Barber API Routes **/
// GET 
// app.get(`/api/barbers`, (req, res) => {
//     myData.getAllBarbers()
//         .then(barbers => res.json(barbers))
//         .catch(err => res.json({message: err}));
// });

// // GET BY ID
// app.get(`/api/barbers/:id`, (req, res) => {
//     myData.getBarberById(req.params.id)
//         .then(barber => res.json(barber))
//         .catch(err => res.json({message: err}));
// });
 
// // POST (Create new barber) ////////////// test with postman
// app.post(`/api/barbers`, (req, res) => {
//     myData.addBarber(req.body) 
//         .then(barber => res.json(barber))
//         .catch(err => res.json({message: err}));
// });

// // PUT
// app.put(`/api/barbers/:id`, (req, res) => {
//     myData.updateBarberById(req.body, req.params.id)
//         .then(barber => res.json(barber))
//         .catch(err => res.json({message: err}));

// });

// // DELETE
// app.delete(`/api/barbers/:id`, (req, res) => {
//     myData.deleteBarberById(req.params.id)
//         .then(barber => res.json(barber))
//         .catch(err => res.json({message: err}));
// }); 


// TO DO : 
// - CREATE THE ACCOUNT CRUD OPERATIONS, THEN THE ACCOUNT CREATION AND LOGIN

/* Account API Routes */

/** Initialize the database service and start the server **/ 
app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${ HTTP_PORT }`);
});


// myData.initialize()
//     .then(() => {
//         app.listen(HTTP_PORT, () => {
//             console.log(`Server listening on: ${ HTTP_PORT }`);
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     });
