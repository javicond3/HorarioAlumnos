const fetch = require('node-fetch');

// POST /planificador_2
exports.fetch = (req, res, next) => {
  // Cuando la API esté disponible, obtener los datos de matírcula del alumno que ha iniciado sesión

  // Datos de prueba
  const asigPrueba = ['95000001', '95000002', '95000003', '95000004'];
  const listaAsignaturas = asigPrueba.reduce((acc, asig) => `${acc},${asig}`);
  const grado = '09TT';
  const ano = '201819';
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

/**
 * Función que toma un objeto con los exámenes en las asignauras tal cual
 * se obtienen del JSON de la API y devuelve un objeto con los exámenes
 * reorganizados, todos juntos en su respectiva convocatoria.
 */
const formatearExamenes = (asigConExamenes) => {
  const examenes = {
    ordinaria: [],
    extraordinaria: [],
  };

  Object.keys(asigConExamenes).forEach((codAsig) => {
    const asig = asigConExamenes[codAsig];
    Object.keys(asig.examenesPeriodos).forEach((nomPeriodo) => {
      const periodo = asig.examenesPeriodos[nomPeriodo];
      periodo.examenes.forEach((exam) => {
        const examen = {
          asignatura: asig.acronimo ? asig.acronimo : asig.nombre,
          fecha: exam.fecha,
          hora: exam.hora,
          duracion: exam.duracion,
        };
        switch (nomPeriodo.charAt(3)) {
          case 'O':
            examenes.ordinaria.push(examen);
            break;
          case 'E':
            examenes.extraordinaria.push(examen);
            break;

          default:
            break;
        }
      });
    });
  });

  return examenes;
};

/**
 * Función que toma un objeto con los exámenes formateados y los ordena
 * por fecha (más recientes primero).
 *
 * No devuelve un nuevo objeto, solo ordena el pasado como parámetro.
 */
const ordenarExamPorFecha = (examenes) => {
  examenes.ordinaria.sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return dateA - dateB;
  });
  examenes.extraordinaria.sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return dateA - dateB;
  });
};

// GET /curso_actual/examenes
exports.formatear = (req, res, next) => {
  const { asigConExamenes } = res.locals;
  const examenes = formatearExamenes(asigConExamenes);
  ordenarExamPorFecha(examenes);

  res.locals.examenes = examenes;

  next();
};
