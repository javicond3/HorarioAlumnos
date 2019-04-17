const fetch = require('node-fetch');

// GET /filtrar
exports.filtrarAsignaturas = (req, res, next) => {
  // Datos introducidos en el formulario
  const response = {
    grado: req.query.grado,
    curso: req.query.curso, // Es un array (checkbox)
    semestre: req.query.semestre,
    itinerario: req.query.itinerario,
    ano: req.query.ano,
  };
  // console.log(response);

  // URL para pedir el JSON con las asignaturas deseadas
  //  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.grado}/${response.ano}/${response.semestre}/${response.curso[0]}`;

  // URL de prueba (borrar esta y descomentar la anterior)
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.grado}/201718/${response.semestre}/${response.curso[0]}`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      // console.log(json);
      res.locals.asignaturas = json;
      next();
    })
    .catch(err => console.error(err));
};
