const fetch = require('node-fetch');

// POST /planificador_2
exports.getExamenes = (req, res, next) => {
  // Cuando la API esté disponible, obtener los datos de matírcula del alumno que ha iniciado sesión

  // Datos de prueba
  const asigPrueba = ['95000001', '95000002', '95000003', '95000004'];
  const listaAsignaturas = asigPrueba.reduce((acc, asig) => `${acc},${asig}`);
  const grado = '09TT';
  const ano = '201718';
  const semestre = '1S';

  // URL para pedir el JSON con los exámenes de las asignaturas cursadas por el alumno
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/${ano}/${semestre}/${listaAsignaturas}/examenes`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      res.locals.asigConExamenes = json;
      next();
    })
    .catch(err => console.error(err));
};
