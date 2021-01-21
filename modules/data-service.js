const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

barberSchema = require('./barberSchema.js');

// Receives the mongoDB connection string
module.exports = (connectionString) => {

    let Barber;

    return {

        initialize: () => {
            return new Promise((resolve, reject) => {

                let db1 = mongoose.createConnection(connectionString,{ useNewUrlParser: true,useUnifiedTopology: true });

                db1.on(`error`, () => {
                    console.log('Error connecting to database');
                    reject();
                });
                
                db1.once(`open`, () => {
                    Barber = db1.model('Barbers', barberSchema); // barberModel
                    resolve();
                });

            });
        },

        addBarber: (data) => { // NOT INSERTING CORRECTLY
            return new Promise((resolve, reject) => {
                let newBarber = new Barber(data); // create new barber object
                newBarber.save((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`New barber: ${ newBarber._id } was added to collection`);
                    }
                });
            });
        },

        getAllBarbers: () => {
            return new Promise((resolve, reject) => {
                Barber.find().exec() // exec() returns null if not found
                    .then(barbers => {
                        resolve(barbers);
                    })
                    .catch(err => { 
                        reject(err);
                    });
            });
        },

        getBarberById: (id) => {
            return new Promise((resolve, reject) => {
                Barber.findOne({_id: id}).exec()
                .then(barber => {
                    resolve(barber);
                })
                .catch(err => {
                    reject(err);
                })

            });
        },

        

        updateBarberById: (data, id) => {
            console.log(data._id);

            return new Promise((resolve, reject) => {
                Barber.updateOne({_id: id}, {$set: data})
                    .then(() => {
                        resolve(`Barber ${id} successfully updated`)
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },

        deleteBarberById: (id) => {
            return new Promise((resolve, reject) => {
                Barber.deleteOne({_id: id}).exec()
                    .then(() => {
                        resolve(`Barber ${id} successfully deleted`);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }


    }

}