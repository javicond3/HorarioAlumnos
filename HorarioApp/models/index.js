const path = require('path');

// ORM
const Sequelize = require('sequelize');

// DATABASE_URL = postgres://user:passwd@host:port/database
const databaseURL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB}`;
// const databaseSessionUrl = `postgres://${process.env.DBSESSION_USERNAME}:${process.env.DBSESSION_PASSWORD}@dbsession:5432/${process.env.POSTGRESSESION_DB}`;
const logs = (process.env.DEV === 'true'); // Si estamos en desarrollo se generarán logs

/* if (process.env.DOCKER === 'true') {
 databaseURL = ``;
 databaseSessionUrl = ``;
}  */

const sequelize = new Sequelize(databaseURL, { logging: logs });
// const sequelizeSession = new Sequelize(databaseSessionUrl, { logging: logs });


// Importar la definicion de las tablas
const Alumno = sequelize.import(path.join(__dirname, 'Alumno'));
const Horario = sequelize.import(path.join(__dirname, 'Horario'));
const Plan = sequelize.import(path.join(__dirname, 'Plan'));


// Relacion 1 a N entre Alumno y Horario:
Alumno.hasMany(Horario, { foreignKey: 'alumnoId' });
Horario.belongsTo(Alumno, { foreignKey: 'alumnoId' });

// Relacion 1 a N entre Plan y Horario:
Plan.hasMany(Horario, { foreignKey: 'planId' });
Horario.belongsTo(Plan, { foreignKey: 'planId' });


sequelize.sync()
  .then(() => {
    console.log('Base de datos creada con éxito');
  })
  .catch((error) => {
    console.log('Error creando las tablas de la BBDD:', error);
    process.exit(1);
  });

// sequelizeSession.sync();

exports.sequelize = sequelize;
// exports.sequelizeSession = sequelizeSession;

// Exportamos modelos
exports.Alumno = Alumno;
exports.Horario = Horario;
exports.Plan = Plan;
