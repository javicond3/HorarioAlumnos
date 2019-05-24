// Definicion del modelo Alumno:

module.exports = (sequelize, DataTypes) => sequelize.define('Asignatura', {
  // Atributos
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  // Opciones
  timestamps: false, // Sin atributos createdAt y updatedAt
});
