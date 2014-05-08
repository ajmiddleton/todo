'use strict';

var Mongo = require('mongodb');
var tasks = global.nss.db.collection('tasks');
var priorities = global.nss.db.collection('priorities');
var _ = require('lodash');

exports.index = (req, res)=>{
  tasks.find().toArray((err, tasks)=>{
    priorities.find().toArray((e,priorities)=>{

      console.log('BEFORE');
      console.log(tasks);

      tasks = tasks.map(task =>{
        var priority = _(priorities).find(pri=> pri._id.toString() === task.priorityId.toString());
        task.priority = priority;
        return task;
      });

      console.log('AFTER');
      console.log(tasks);
      res.render('tasks/index', {tasks: tasks, priorities:priorities, title: 'Tasks Listing'});
    });
  });
};

exports.destroy = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  tasks.findAndRemove({_id:_id}, ()=>res.redirect('/tasks'));
};

exports.create = (req, res)=>{
  req.body.isComplete = false;
  req.body.due = new Date(req.body.due);
  req.body.priorityId = Mongo.ObjectID(req.body.priorityId);

  tasks.save(req.body, ()=>res.redirect('/tasks'));
};

exports.update = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  tasks.findOne({_id:_id}, (err, task)=>{
    task.isComplete = !task.isComplete;
    tasks.save(task, ()=>res.redirect('/tasks'));
  });
};
