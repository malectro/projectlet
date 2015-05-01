module.exports = function (sequelize, DataTypes) {

  var Person = sequelize.define('person', {
    handle: {type: DataTypes.STRING, unique: true},
  }, {
    classMethods: {
      associate: function (models) {
        Person.belongsTo(models.Project);
      }
    }
  });

  return Person;
};

