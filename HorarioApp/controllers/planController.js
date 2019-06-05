const fetch = require('node-fetch');

// GET /planificador
exports.fetch = (req, res, next) => {
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