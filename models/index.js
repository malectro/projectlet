'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var db        = {};
var sequelize, config;

if (env === 'production') {
  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  config = {
    database: match[5],
    username: match[1],
    password: match[2],
    port: match[4],
    host: match[3],
    dialect: 'postgres',
    protocol: 'postgres',
    loggin: false,
    dialectOptions: {
      ssl: true,
    },
  };
} else {
  config = require(__dirname + '/../config/config.json')[env];
}

sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name.slice(0, 1).toUpperCase() + model.name.slice(1)] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
