const express = require('express');
const { task } = require('../controller');

const Task = require('../models/task');

/*
 * Initialize Router
 */
const router = (module.exports = express.Router());

router.param('user_id', (req, res, next, id) => {
  req.slack_user_id = id;
  next();
});

router.param('task_id', (req, res, next, id) => {
  console.log('task param', req.slack_user_id);
  Task.findOne({
    slack_user_id: req.slack_user_id,
    _id: id
  })
    .exec()
    .then(task => {
      if (!task) {
        return Promise.reject(new Error('No task found'));
      }
      req.task = task || null;
      next();
    })
    .catch(err => {
      console.log('task not completed', err.message);
      res.json({ ok: false, message: err.message });
    });
});

router
  .route('/users/:user_id/tasks')
  .get(task.index)
  .post(task.create);

/**
 * Complete a task
 */
router.put('/users/:user_id/tasks/:task_id/complete', task.complete);

/**
 * Current task
 */
router.get('/users/:user_id/tasks/current', task.current);
router.put('/users/:user_id/tasks/:task_id/current', task.setCurrent);
