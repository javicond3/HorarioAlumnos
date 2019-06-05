// Definicion del modelo Alumno:

module.exports = (sequelize, DataTypes) => {
  const plan = sequelize.define('Alumno', {
    // Atributos
    correo: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, {
    // Opciones
    timestamps: false, // Sin atributos createdAt y updatedAt
  });
  plan.removeAttribute('id');
  return plan;
};
