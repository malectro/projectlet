module.exports = function (sequelize, DataTypes) {

  var Project = sequelize.define('Project', {
    uri: {type: DataTypes.STRING, unique: true},
  }, {
    classMethods: {
      associate: function (models) {
        Project.hasMany(models.Person);
      }
    }
  });

  return Project;
};

