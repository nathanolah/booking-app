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
    let barbID = new mongoose.Types.ObjectId(temp.barberID);
    //adding date to appointment 
    let dateStr = temp.date.split(" ");
    let tempDateStart = new Date(dateStr[0], dateStr[1], dateStr[2], dateStr[3], dateStr[4]);
    
    let realDateStart = new Date( tempDateStart.getTime() - Math.abs(tempDateStart.getTimezoneOffset()*-60000)) //removing utc offset
    let realDateEnd = new Date(realDateStart.getTime() + 45*60000)
    
    
    let isActiveTemp = true;
    //if(temp.isActive == "false"){
    //    isActiveTemp = false; 
    //}
    
    appointmentModel.countDocuments({ 
        $and:[{
            
            barberID: barbID,
            $or:
                [
                    {
                            endDate : { "$gte": new Date(realDateStart)}, startDate:{"$lte": new Date(realDateEnd)}
                    }
                ]
                
        }]}
        ).then(count => {
                if(count > 0){
                    res.json('Double booked, pick a different time');
                }else{
                    let newAppointment = new appointmentModel();
                    newAppointment.custID = custID;
                    newAppointment.startDate = realDateStart;
                    newAppointment.endDate = realDateEnd;
                    newAppointment.barberID = barbID;
                    newAppointment.isActive = isActiveTemp;    
                    newAppointment.save((err) => {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(`New appointment: ${ newAppointment._id } was added to collection`);
                    }})
                }
            })        

  

});

router.get('/:id', (req, res) => {
    appointmentModel.findOne({_id: req.params.id}).populate('custID').populate('barberID').exec()
        .then(appointment => res.json(appointment))
        .catch(err => res.json(err));

});

router.get('/', (req, res) => {
    appointmentModel.find().populate('custID').populate('barberID').exec()
        .then(appointments => res.json(appointments))
        .catch(err => res.json(err));
});

router.put('/:id', (req, res) => {
    const temp = req.body;
    //adding customer and barber IDs to appointment
    let ncustID = new mongoose.Types.ObjectId(temp.custID);
    let barbID = new mongoose.Types.ObjectId(temp.barberID);
    //adding date to appointment 
    let dateStr = temp.date.split(" ");
    let tempDateStart = new Date(dateStr[0], dateStr[1], dateStr[2], dateStr[3], dateStr[4]);
    
    let realDateStart = new Date( tempDateStart.getTime() - Math.abs(tempDateStart.getTimezoneOffset()*-60000)) //removing utc offset
    let realDateEnd = new Date(realDateStart.getTime() + 45*60000)
    
    

    appointmentModel.countDocuments({ 
        $and:[{
            
            barberID: barbID,
            $or:
                [
                    {
                            endDate : { "$gte": new Date(realDateStart)}, startDate:{"$lte": new Date(realDateEnd)}
                    }
                ]
                
        }]}
        ).then(count => {
                if(count > 0){
                    res.json('Double booked, pick a different time');
                }else{
                    //let newAppointment = new appointmentModel();
                    //newAppointment.custID = custID;
                    //newAppointment.startDate = realDateStart;
                    //newAppointment.endDate = realDateEnd;
                    //newAppointment.barberID = barbID;
                    //newAppointment.isActive = isActiveTemp;    
                appointmentModel.updateOne({_id: req.params.id}, {$set: {startDate: realDateStart}, endDate:realDateEnd, custID: ncustID, barberID: barbID})
                    .then(res.json(`Appointment ${ req.params.id } successfully updated`))
                    .catch(err => res.json(err));
                    }
            })   

});

router.delete('/:id', (req, res) => {
    appointmentModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Appointment ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;