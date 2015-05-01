module.exports = function (sequelize, DataTypes) {

  var Person = sequelize.define('person', {
    handle: {type: DataTypes.STRING},
  }, {
    indexes: [
      {fields: ['handle']},
    ],
    classMethods: {
      associate: function (models) {
        Person.belongsTo(models.Project);
      }
    }
  });

  return Person;
};

