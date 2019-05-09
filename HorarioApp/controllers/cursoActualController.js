/**
 * Función que toma un objeto con los exámenes en las asignauras tal cual
 * se obtienen del JSON de la API y devuelve un objeto con los exámenes
 * reorganizados, todos juntos en su respectiva convocatoria y ordenados
 * de más próximo a más lejano.
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

// GET /curso_actual/horario
exports.horario = (req, res) => {
  res.render('curso_actual/horario', { scripts: '' });
};

// GET /curso_actual/examenes
exports.examenes = (req, res) => {
  const { asigConExamenes } = res.locals;
  const examenes = formatearExamenes(asigConExamenes);
  ordenarExamPorFecha(examenes);

  res.render('curso_actual/examenes', { examenes, scripts: '' });
};
