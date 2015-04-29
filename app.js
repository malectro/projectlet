var express = require('express');

var models = require('./models');
var api = require('./api/routes');


var app = express();

app.set('port', process.env.PORT || 3001);
app.use('media', express.static('build'));

app.use(api);

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

models.sequelize.sync().then(() => {
  app.listen(app.get('port'), () => {
    console.log('App listening on port ' + app.get('port'));
  });
});

