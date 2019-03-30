const fetch = require('node-fetch');

/**
 * Función auxiliar que toma un array de asignaturas y devuelve el código
 * html de la tabla, con tantas filas como asignaturas haya en el array.
 *
 * @param {Array} asignaturas Array con las asignaturas.
 *
 * @returns {string} Código HTML de las filas de la tabla.
 */
const generarFilasTablaAsig = (asignaturas) => {
  let html = '';

  // Comprobamos que el parámetro es un array y no está vacío
  if (Array.isArray(asignaturas) && asignaturas.length) {
    asignaturas.forEach((asig) => {
      const row = `<tr>
        <td>${asig.curso}º</td>
        <td>${asig.semestre}</td>
        <td>${asig.nombre}</td>
        <td>${asig.acronimo}</td>
        <td>${asig.creditos}</td>
        <td>+</td>
      </tr>`;
      html += row;
    });
  }

  return html;
};


// GET /filtrar
exports.filtrarAsignaturas = (req, res) => {
  // Datos introducidos en el formulario
  const response = {
    grado: req.query.grado,
    curso: req.query.curso, // Es un array (checkbox)
    semestre: req.query.semestre,
    itinerario: req.query.itinerario,
    ano: req.query.ano,
  };

  console.log(response);

  // URL para pedir el JSON con las asignaturas deseadas
  //  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.grado}/${response.ano}/${response.semestre}/${response.curso[0]}`;

  // URL de prueba (borrar esta y descomentar la anterior)
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.grado}/201718/${response.semestre}/${response.curso[0]}`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      console.log(json);
      const fil = generarFilasTablaAsig(json);
      res.render('planificador/planificador', { filas: fil });
    })
    .catch(err => console.error(err));
};
