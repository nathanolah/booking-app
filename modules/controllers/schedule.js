const express=require('express');
const router=express.Router();

const mongoose = require('mongoose');

mongoose.Promise=global.Promise;


const scheduleModel=require('../models/scheduleSchema');
const barberModel = require('../models/barberSchema');


// Add barber
router.post('/:id', (req, res) => {
    const { workDay, startTime, endTime } = req.body;
    //not sure about date
    console.log(workDay);

    if (workDay ==null || startTime == null || endTime == null) {
        res.json('You must enter the working date with start and end time');

    }
     else {
        var day;
        switch (workDay) {
            case 0:
              day = "Sunday";
              break;
            case 1:
              day = "Monday";
              break;
            case 2:
               day = "Tuesday";
              break;
            case 3:
              day = "Wednesday";
              break;
            case 4:
              day = "Thursday";
              break;
            case 5:
              day = "Friday";
              break;
            case 6:
              day = "Saturday";
          }

        console.log(day);
            let tempWorkDay = day;            
            let tempStartTime = req.body.startTime;
            let tempEndTime = req.body.endTime;
      
        

        let newSchedule = new scheduleModel();
        newSchedule.workDate = tempWorkDay;
        newSchedule.startTime = tempStartTime;
        newSchedule.endTime = tempEndTime;

        console.log(newSchedule.workDate);

        newSchedule.save((err) => {
            if (err) {
                res.json(err);
            } else {
                barberModel.updateOne({_id: req.params.id}, {$push: {schedules: newSchedule}})
                        .then(res.json(`Barber ${ req.params.id } got new schedule`))
                        .catch(err => res.json(err))}
            
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
    const {workDay, startTime, endTime } = req.body;

    if (workDay ==null || startTime == null || endTime== null) {
        res.json('You must put the date with start and end time to update schedule');

    } else {
        var day;
        switch (workDay) {
            case 0:
              day = "Sunday";
              break;
            case 1:
              day = "Monday";
              break;
            case 2:
               day = "Tuesday";
              break;
            case 3:
              day = "Wednesday";
              break;
            case 4:
              day = "Thursday";
              break;
            case 5:
              day = "Friday";
              break;
            case 6:
              day = "Saturday";
          };

          console.log(day);
          let tempWorkDay = day;            
          let tempStartTime = req.body.startTime;
          let tempEndTime = req.body.endTime;
    
      

      let newSchedule = new scheduleModel();
      newSchedule.workDate = tempWorkDay;
      newSchedule.startTime = tempStartTime;
      newSchedule.endTime = tempEndTime;

      console.log(newSchedule.workDate);


      
        scheduleModel.updateOne({_id: req.params.id}, {$set: newSchedule})
            .then(res.json(`Schedule ${ req.params.id } successfully updated`))
            .catch(err => res.json(err));
    };

});

// Delete schedule by id
router.delete('/:id', (req, res) => {
    scheduleModel.deleteOne({_id: req.params.id}).exec()
        .then(res.json(`Schedule ${ req.params.id } successfully deleted`))
        .catch(err => res.json(err));
});



















// (OLD VERSION)

// router.post('/:id', (req, res) => {
//     const { workDate, startTime, endTime } = req.body;
//     //not sure about date

//     if (workDate ==null || startTime == null || endTime == null) {
//         res.json('You must enter the working date with start and end time');

//     } else {
//         let newSchedule = new scheduleModel(req.body);
//         newSchedule.save((err) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 barberModel.updateOne({_id: req.params.id}, {$push: {schedules: newSchedule}})
//                 .then(res.json(`Barber ${ req.params.id } got new schedule`))
//                 .catch(err => res.json(err));
            
//                 //res.json(`New schedule entered: ${ newSchedule._id }`);
//             }
//         });
//     }
   
// });


// // Get all schedule 
// //not sure about this route since schedule is connected to each barber.
// router.get('/', (req, res) => {
//     scheduleModel.find().exec()
//         .then(schedules => res.json(schedules))
//         .catch(err => res.json(err));
// });

// // Get schedule by id
// router.get('/:id', (req, res) => {
//     scheduleModel.findOne({_id: req.params.id}).exec()
//         .then(schedule => res.json(schedule))
//         .catch(err => res.json(err));
// });

// // Update schedule by id
// router.put('/:id', (req, res) => {
//     const {workDate, startTime, endTime } = req.body;

//     if (workDate ==null || startTime == null || endTime== null) {
//         res.json('You must put the date with start and end time to update schedule');

//     } else {
//         scheduleModel.updateOne({_id: req.params.id}, {$set: req.body})
//             .then(res.json(`Schedule ${ req.params.id } successfully updated`))
//             .catch(err => res.json(err));
//     }

// });

// // Delete schedule by id
// router.delete('/:id', (req, res) => {
//     scheduleModel.deleteOne({_id: req.params.id}).exec()
//         .then(res.json(`Schedule ${ req.params.id } successfully deleted`))
//         .catch(err => res.json(err));
// });

module.exports = router;

