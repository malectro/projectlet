var express = require('express');
var bodyParser = require('body-parser');

var models = require('../models');


var app = express();

app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('', (req, res) => {
  res.render('index');
});

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
  models.Person.all({where: {handle: req.params.handle}, include: [{model: models.Project, required: true}]}).then((people) => {
    res.format({
      json: function () {
        res.json(people);
      },
      html: function () {
        res.render('person', {projects: people, handle: req.params.handle});
      }
    });
  });
});

app.route('/projects')
  .get((req, res) => {
    models.Project.all().then((projects) => {
      res.json(projects);
    });
  })
  .post((req, res) => {
    models.Project.find({where: {uri: req.body.uri}, include: [models.Person]}).then((project) => {
      if (!project) {
        models.Project.create({uri: req.body.uri}).then((project) => {
          res.json(project);
        });
      } else {
        res.json(project);
      }
    });
  });
app.get('/projects/:id', (req, res) => {
  models.Project.find({where: {id: req.params.id}, include: [models.Person]}).then((project) => {
    res.format({
      json: function () {
        res.json(project);
      },
      html: function () {
        res.render('project', {project: project});
      }
    });
  });
});
app.get('/projects/:id/people', (req, res) => {
  models.Person.all({where: {projectId: req.params.id}}).then((people) => {
    res.json(people);
  });
});


module.exports = app;

