var express = require('express');
var bodyParser = require('body-parser');

var models = require('../models');


var app = express();

app.use(bodyParser.json());

app.route('/people')
  .get((req, res) => {
    models.Person.all().then((people) => {
      res.json(people);
    });
  })
  .post((req, res) => {
    models.Person.create(req.body).then((person) => {
      res.json(person);
    });
  });

app.get('/people/:handle', (req, res) => {
  models.Person.all({where: {handle: req.params.handle}}).then((people) => {
    res.json(people);
  });
});

app.route('/projects')
  .get((req, res) => {
    models.Project.all().then((projects) => {
      res.json(projects);
    });
  })
  .post((req, res) => {
    models.Project.create(req.body).then((project) => {
      res.json(project);
    });
  });
app.get('/projects/:id', (req, res) => {
  models.Project.find(req.params.id).then((project) => {
    res.json(project);
  });
});
app.get('/projects/:id/people', (req, res) => {
  models.Person.all({where: {project_id: req.params.id}}).then((people) => {
    res.json(people);
  });
});


module.exports = app;

