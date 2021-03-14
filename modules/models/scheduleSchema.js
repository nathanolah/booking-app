const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  
    workDate: Date, //monday to sunday
    startTime: Date, //usage - start time set
    endTime: Date //usage - end time set


});

const scheduleModel = mongoose.model('Schedules', scheduleSchema);
module.exports = scheduleModel;