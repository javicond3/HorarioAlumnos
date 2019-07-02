// Definicion del modelo Horario:

module.exports = (sequelize, DataTypes) => sequelize.define('Horario', {
  // Atributos
  ano: {
    type: DataTypes.STRING,
    validate: { notEmpty: { msg: 'Falta año académico' } },
  },
  semestre: {
    type: DataTypes.STRING,
    validate: { notEmpty: { msg: 'Falta semestre' } },
  },
  asignaturas: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  cursos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  grupos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  listaAcronimos: {
    type: DataTypes.STRING,
  },
  creditos: {
    type: DataTypes.STRING,
  },
});
