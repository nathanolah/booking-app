// Rest API 
//
//

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataService = require('./modules/data-service.js'); 

const myData = dataService(`mongodb+srv://nolah:prj123@cluster0.qbhut.mongodb.net/simple-api-users?retryWrites=true&w=majority`);
const app = express();

app.use(cors());
app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

/** API Routes **/
// GET 
app.get(`/api/barbers`, (req, res) => {
    myData.getAllBarbers()
        .then(barbers => res.json(barbers))
        .catch(err => res.json({message: err}));
});

// GET BY ID
app.get(`/api/barbers/:id`, (req, res) => {
    myData.getBarberById(req.params.id)
        .then(barber => res.json(barber))
        .catch(err => res.json({message: err}));
});
 
// POST (Create new barber) ////////////// test with postman
app.post(`/api/barbers`, (req, res) => {
    myData.addBarber(req.body) 
        .then(barber => res.json(barber))
        .catch(err => res.json({message: err}));
});

// PUT
app.put(`/api/barbers/:id`, (req, res) => {
    myData.updateBarberById(req.body, req.params.id)
        .then(barber => res.json(barber))
        .catch(err => res.json({message: err}));

});

// DELETE
app.delete(`/api/barbers/:id`, (req, res) => {
    myData.deleteBarberById(req.params.id)
        .then(barber => res.json(barber))
        .catch(err => res.json({message: err}));
}); 


// TO DO : 
// - CREATE THE ACCOUNT CRUD OPERATIONS, THEN THE ACCOUNT CREATION AND LOGIN

/** Initialize the database service and start the server **/ 

myData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${ HTTP_PORT }`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
