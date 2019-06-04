// Definicion del modelo Plan:

module.exports = (sequelize, DataTypes) => {
  const plan = sequelize.define('Plan', {
    // Atributos
    codigo: {
      type: DataTypes.STRING,
      primaryKey: true,
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
  plan.removeAttribute('id');
  return plan;
};
