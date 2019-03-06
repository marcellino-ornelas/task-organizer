const Task = require('../models/task');

exports.index = (req, res) => {
  const slack_user_id = req.slack_user_id;
  const completed = req.query.completed ? true : false;
  const findBy = {
    slack_user_id
  };

  if (!completed) {
    findBy.is_done = false;
  }

  Task.find(findBy)
    .exec()
    .then(tasks => res.json({ ok: true, tasks }))
    .catch(err => res.json({ ok: false, message: err.message }));
};

exports.create = (req, res) => {
  const taskData = req.body;

  taskData.slack_user_id = req.slack_user_id;

  const task = new Task(taskData);

  task
    .save()
    .then(product => res.json({ ok: true, task: product }))
    .catch(err => res.json({ ok: false, message: err.message }));
};

exports.complete = (req, res) => {
  const task = req.task;

  task
    .complete()
    .then(task => {
      res.json({ ok: true, task });
    })
    .catch(err => {
      res.json({ ok: false, message: err.message });
    });
};

exports.current = (req, res) => {
  const slack_user_id = req.slack_user_id;

  Task.currentTask(slack_user_id)
    .then(task => {
      res.json({ ok: true, current_task: task || null });
    })
    .catch(err => {
      res.json({ ok: false, message: err.message });
    });
};

exports.setCurrent = (req, res) => {
  const task = req.task;

  task
    .setAsCurrent()
    .then(task => {
      res.json({ ok: true, current_task: task });
    })
    .catch(err => {
      res.json({ ok: false, message: err.message });
    });
};

// function ErrorRes(err){

// }
