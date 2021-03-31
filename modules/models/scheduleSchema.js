const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  
    workDate: String, //monday to sunday
    startTime: String, //usage - start time set
    endTime: String //usage - end time set


});

const scheduleModel = mongoose.model('Schedules', scheduleSchema);
module.exports = scheduleModel;
