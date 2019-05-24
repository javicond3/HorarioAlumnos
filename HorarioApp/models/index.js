const path = require('path');

// ORM
const Sequelize = require('sequelize');

// DATABASE_URL = postgres://user:passwd@host:port/database
const databaseURL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB}`;
const databaseSessionUrl = `postgres://${process.env.DBSESSION_USERNAME}:${process.env.DBSESSION_PASSWORD}@dbsession:5432/${process.env.POSTGRESSESION_DB}`;
const logging = (process.env.DEV === 'true'); // Si estamos en desarrollo se generarán logs

/* if (process.env.DOCKER === 'true') {
 databaseURL = ``;
 databaseSessionUrl = ``;
}  */

const sequelize = new Sequelize(databaseURL, { logging });
const sequelizeSession = new Sequelize(databaseSessionUrl, { logging });


// Importar la definicion de las tablas
// let Departamento = sequelize.import(path.join(__dirname, 'Departamento'));

// Relacion 1 a 1 entre Profesor y Persona:
// Persona.hasOne(Profesor, {foreignKey: 'ProfesorId'});

// Relacion 1 a N entre Departamento y Profesor:
// Departamento.hasMany(Profesor, {foreignKey:'DepartamentoCodigo'})


sequelize.sync();
sequelizeSession.sync();

exports.sequelize = sequelize;
exports.sequelizeSession = sequelizeSession;

// Exportamos modelos
// exports.Profesor = Profesor;
