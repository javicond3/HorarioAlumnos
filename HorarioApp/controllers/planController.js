const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const models = require('../models');

/* // Borra todos los planes de la BBDD
const promesaBorraPlanes = () => new Promise((resolve, reject) => resolve(
  models.Plan.destroy({
    where: {},
    // truncate: true,
  })
    .then(() => {
      console.log('Planes borrados con éxito');
    })
    .catch((error) => {
      console.log(error);
    }),
)); */

// Añade un plan a la BBDD
/* const promesaCreaPlan = plan => new Promise((resolve, reject) => resolve(
  models.Plan.build({
    codigo: plan.codigo,
    acronimo: plan.nombre,
    nombre: plan.nombreCompleto,
    cursos: 4,
  })
    .save()
    .then(() => {
      console.log('Plan creado correctamente');
    })
    .catch(Sequelize.ValidationError, (error) => {
      console.log('Error de validación, los datos del horario no son correctos.');
      error.errors.forEach((elem) => {
        console.log(error.errors[elem].value);
      });
    })
    .catch((error) => {
      console.log(error);
    }),
)); */

const updateOrCreate = (model, where, newItem) => model
  .findOne({ where })
  .then((foundItem) => {
    if (!foundItem) {
      // Item not found, create a new one
      return model
        .create(newItem)
        .then(item => ({ item, created: true }));
    }
    // Found an item, update it
    return model
      .update(newItem, { where })
      .then(item => ({ item, created: false }));
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

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      res.locals.listaPlanes = json;
      next();
    })
    .catch(err => console.error(err));
};
