var express = require('express');
var bodyParser = require('body-parser');

var models = require('models');


var app = express();

app.use(bodyParser.json());
app.use('media', express.static('build'));


app.get('/people', (req, res) => {
  models.Person.kk
});


app.use((req, res, next) => {
  var error = new Error('Not found');
  error.status = 404;
  next(error);
});

if (app.get('env') === 'development') {
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
      message: error.message,
      error: error,
    });
  });
}

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    message: error.message,
    error: {},
  });
})

