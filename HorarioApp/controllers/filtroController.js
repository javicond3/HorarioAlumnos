const fetch = require('node-fetch');

/**
 * Función auxiliar que toma un array de asignaturas y devuelve el código
 * html de la tablas, con tantas filas como asignaturas haya en el array.
 *
 * @param {Array} asignaturas Array con las asignaturas.
 *
 * @returns {tablaDisp: string, tablaSelec: string}
 *           Código HTML de las filas de ambas tablas.
 */
const generarFilasTablaAsig = (asignaturas) => {
  const html = { tablaDisp: '', tablaSelec: '' };

  // Comprobamos que el parámetro es un array y no está vacío
  if (Array.isArray(asignaturas) && asignaturas.length) {
    asignaturas.forEach((asig, index) => {
      const tableData = `<td>${asig.curso}º</td>
      <td>${asig.semestre}</td>
      <td>${asig.nombre}</td>
      <td>${asig.acronimo}</td>
      <td>${asig.creditos}</td>`;

      const dispRow = `<tr class="dispTableRow" id="disp${index}">
        ${tableData}
        <td>+</td>
      </tr>`;

      const selecRow = `<tr class="selecTableRow" id="selec${index}">
      ${tableData}
      <td>-</td>
    </tr>`;

      html.tablaDisp += dispRow;
      html.tablaSelec += selecRow;
    });
  }

  return html;
};


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
      res.locals.asignaturas = generarFilasTablaAsig(json);
      next();
    })
    .catch(err => console.error(err));
};
