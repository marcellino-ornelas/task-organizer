var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var taskSchema = new Schema({
  priority: { type: Number, default: 4, min: 0, max: 4 },
  name: { type: String, required: true, unique: true, index: true },
  task: { type: String, required: true },
  slack_user_id: { type: String, required: true, index: true },
  is_done: { type: Boolean, default: false },
  is_current: { type: Boolean, default: false }
});

taskSchema.static('currentTask', function(slack_user_id) {
  return this.findOne({
    slack_user_id
  })
    .where('is_current', true)
    .where('is_done', false)
    .exec();
});

taskSchema.method('complete', function() {
  return new Promise((resolve, reject) => {
    if (this.is_done) {
      reject(new Error('Task is already complete'));
    } else {
      this.is_done = true;
      this.is_current = false;
      this.save()
        .then(resolve)
        .catch(reject);
    }
  });
});

taskSchema.method('setAsCurrent', function() {
  return new Promise((resolve, reject) => {
    Task.currentTask(this.slack_user_id).then(task => {
      if (task) {
        reject(new Error('You already have a current task'));
      } else {
        this.is_current = true;
        this.save()
          .then(resolve)
          .catch(reject);
      }
    });
  });
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
