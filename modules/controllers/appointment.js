const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Added to get around the deprecation warning: "Mongoose: promise (mongoose's default promise library) is deprecated"

const appointmentModel = require('../models/appointmentSchema');

router.post('/', (req, res) => {
    //const { date, custID , barberID } = req.body;
    const temp = req.body;
    //adding customer and barber IDs to appointment
    let custID = new mongoose.Types.ObjectId(temp.custID);
    let barberID = new mongoose.Types.ObjectId(temp.barberID);
    //adding date to appointment 
    let dateStr = temp.date.split(" ");
    let tempDateStart = new Date(dateStr[0], dateStr[1], dateStr[2], dateStr[3], dateStr[4]);
    //let tempDateEnd = new Date (tempDateStart.getTime() + 45*60000); 
    let realDateStart = new Date( tempDateStart.getTime() - Math.abs(tempDateStart.getTimezoneOffset()*-60000)) //removing utc offset
    let realDateEnd = new Date(realDateStart.getTime() + 45*60000)
    //console.log(dateStr[0], dateStr[1], dateStr[2], dateStr[3], dateStr[4])
    //adding isActive
    let isActiveTemp = true;
    if(temp.isActive == "false"){
        isActiveTemp = false; 
    }
    
    appointmentModel.countDocuments({ $or:
            [{
                endDate : { "$gte": new Date(realDateStart)}, startDate:{"$lte": new Date(realDateEnd)}
            }]
        }).then(count => {
                if(count > 0){
                    res.json('Double booked, pick a different time');
                }else{
                    let newAppointment = new appointmentModel();
                    newAppointment.custID = custID;
                    newAppointment.startDate = realDateStart;
                    newAppointment.endDate = realDateEnd;
                    newAppointment.barberID = barberID;
                    newAppointment.isActive = isActiveTemp;
    //TO DO - ensure a barber can't get double booked
                    newAppointment.save((err) => {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(`New appointment: ${ newAppointment._id } was added to collection`);
                    }})
                }
            })
        

    /*overLappingTimes = count(realDateStart, realDateEnd);
    console.log(overLappingTimes);

    if (overLappingTimes > 0){
        res.json('Double booked, pick a different time')
    }else{     
    //putting values into mongoDB
    let newAppointment = new appointmentModel();
    newAppointment.custID = custID;
    newAppointment.startDate = realDateStart;
    newAppointment.endDate = realDateEnd;
    newAppointment.barberID = barberID;
    newAppointment.isActive = isActiveTemp;
    //TO DO - ensure a barber can't get double booked
    newAppointment.save((err) => {
        if (err) {
            res.json(err);
        } else {
            res.json(`New appointment: ${ newAppointment._id } was added to collection`);
        }});
        
    }*/

});

router.get('/:id', (req, res) => {
    appointmentModel.findOne({_id: req.params.id}).populate('custID').populate('barberID').exec()
        .then(appointment => res.json(appointment))
        .catch(err => res.json(err));

});

module.exports = router;