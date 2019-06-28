const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const models = require('../models');

/**
 * Función que crea una nueva entrada en la base de datos o actualiza
 * una existente en función de si existe previamente.
 *
 * Admite como parámetros el modelo, la condición para comprobar si ya
 * existe y un objeto con los nuevos parámetros.
 */
const updateOrCreate = (model, where, newItem) => model
  .findOne({ where })
  .then((foundItem) => {
    if (!foundItem) {
      // Item not found, create a new one
      return model
        .create(newItem)
        .then(item => (console.log('Creado nuevo plan')));
    }
    // Found an item, update it
    return model
      .update(newItem, { where })
      .then(item => (console.log('Plan actualizado')));
  });


// Obtiene los planes de la API y los guarda en la BBDD
exports.updatePlanes = () => {
  // URL para pedir el JSON con todos los planes de la ETSIT
  const url = 'https://pruebas.etsit.upm.es/pdi/progdoc/api/planes';

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      const promises = [];
      Object.keys(json).forEach((codPlan) => {
        const plan = json[codPlan];
        const newPlan = {
          codigo: plan.codigo,
          acronimo: plan.nombre,
          nombre: plan.nombreCompleto,
          cursos: 4,
        };
        promises.push(updateOrCreate(models.Plan, { codigo: plan.codigo }, newPlan));
      });
      return Promise.all(promises);
    })
    .catch(err => console.error(err));
};


exports.cargar = (req, res, next) => {
  // URL para pedir el JSON con todos los planes de la ETSIT
  const url = 'https://pruebas.etsit.upm.es/pdi/progdoc/api/planes';

  models.Plan.findAll()
    .then((planes) => {
      res.locals.listaPlanes = planes;
      next();
    })
    .catch(err => console.error(err));
};
