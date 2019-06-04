const fetch = require('node-fetch');

// GET /filtrar
exports.filtrarAsignaturas = (req, res, next) => {
  // Datos introducidos en el formulario por el usuario
  const response = {
    plan: req.query.plan,
    curso: req.query.curso, // Es un array (checkbox)
    semestre: req.query.semestre,
    itinerario: req.query.itinerario,
    ano: req.query.ano,
  };

  // Guardamos los parámetros en variable locals para que sean accesibles
  // en el siguiente middleware y las vistas
  res.locals.plan = response.plan;
  res.locals.ano = response.ano;
  res.locals.semestre = response.semestre;

  // URL para pedir el JSON con las asignaturas deseadas
  //  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.grado}/${response.ano}/${response.semestre}/${response.curso[0]}`;

  let asignaturasJSON = []; // Array que guarda las asignaturas solicitadas en formato JSON

  /**
   * Función auxiliar que toma una URL, hace una petición, parsea la respuesta
   * como un JSON y añade las asignaturas recibidas al array AsignaturasJSON.
   *
   * @param {String} url URL de la petición.
   *
   * @returns {Promise} Promesa.
   */
  const fetchJSONfromURL = url => fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      asignaturasJSON = asignaturasJSON.concat(json);
    });

  const urls = []; // Array con todas las URLs para pedir su correspondiente JSON

  // Genera una URL por cada curso seleccionado y la guarda en el array urls
  response.curso.forEach((curso) => {
    urls.push(`https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.plan}/201718/${response.semestre}/${curso}`);
  });

  /**
   * Función que resuelve secuencialmente las promesas.
   *
   * Usa el acumulador de reduce para ir pasando una promesa "envoltorio"
   * (que toma como valor inicial una promesa que se resuelve con valor vacío),
   * que se resuelve y da paso a la promesa que queremos ejecutar, de forma
   * que en la siguiente iteración espera a que la anterior haya terminado
   * aunque el comportamiento de reduce siga siendo totalmente síncrono.
   * (Sin la promesa "envoltorio" no lo haría secuencialmente, ya que el reduce
   * se ejecuta de forma síncrona y dispararía todas las promesas prácticamente
   * a la vez).
   *
   * A su vez devuelve una promesa, por lo que podemos usar .then() después.
   */
  const fetchJSONs = urls.reduce(
    (accumulatorPromise, nextUrl) => accumulatorPromise.then(() => fetchJSONfromURL(nextUrl)),
    Promise.resolve(),
  );

  fetchJSONs.then(() => {
    res.locals.asignaturas = asignaturasJSON;

    next();
  });
};
