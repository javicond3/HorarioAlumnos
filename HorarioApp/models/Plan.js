// Definicion del modelo Plan:

module.exports = (sequelize, DataTypes) => sequelize.define('Plan', {
  // Atributos
  codigo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  acronimo: {
    type: DataTypes.STRING,
  },
  nombre: {
    type: DataTypes.STRING,
  },
  cursos: {
    type: DataTypes.INTEGER,
  },
});
