const express=require('express');
const router=express.Router();

const mongoose = require('mongoose');

mongoose.Promise=global.Promise;


const scheduleModel=require('../models/scheduleSchema');

// Add barber
router.post('/', (req, res) => {
    const { workDate, startTime, endTime } = req.body;
    //not sure about date

    if (workDate ==null || startTime == null || endTime == null) {
        res.json('You must enter the working date with start and end time');

    } else {
        let newSchedule = new scheduleModel(req.body);
        newSchedule.save((err) => {
            if (err) {
                res.json(err);
            } else {
                res.json(`New schedule entered: ${ newSchedule._id }`);
            }
        });
    }

});

// Get all schedule 
//not sure about this route since schedule is connected to each barber.
router.get('/', (req, res) => {
    scheduleModel.find().exec()
        .then(schedules => res.json(schedules))
        .catch(err => res.json(err));
});

// Get schedule by id
router.get('/:id', (req, res) => {
    scheduleModel.findOne({_id: req.params.id}).exec()
        .then(schedule => res.json(schedule))
        .catch(err => res.json(err));
});

// Update schedule by id
router.put('/:id', (req, res) => {
    const {workDate, startTime, endTime } = req.body;

    if (workDate ==null || startTime == null || endTime== null) {
        res.json('You must put the date with start and end time to update schedule');

    } else {
        scheduleModel.updateOne({_id: req.params.id}, {$set: req.body})
            .then(res.json(`Schedule ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    }

});

// Delete schedule by id
router.delete('/:id', (req, res) => {
    scheduleModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Schedule ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});

module.exports = router;

