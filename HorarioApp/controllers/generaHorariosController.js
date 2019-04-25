/* eslint-disable no-prototype-builtins */
/* eslint-disable quote-props */

/**
 * Función que toma un JSON con las asignaturas tal cual se obtiene de la API
 * y devuelve un objeto con la información reorganizada en una estructura de
 * {cursos : {grupos: {días: {horas:acronimo}}} para que sea más fácil de manejar
 * a la hora de hacer combinaciones posteriormente.
 */
const formatearHorarios = (asignaturas) => {
  // Objeto para guardar los horarios reestructurados
  const horariosPorCurso = {};

  // Días de la semana
  const dias = {
    L: {},
    M: {},
    X: {},
    J: {},
    V: {},
  };

  // Horas del día
  const horas = {
    '08': '',
    '09': '',
    '10': '',
    '11': '',
    '12': '',
    '13': '',
    '14': '',
    '15': '',
    '16': '',
    '17': '',
    '18': '',
    '19': '',
    '20': '',
    '21': '',
  };

  // Rellenamos los dias con las horas
  Object.keys(dias).forEach((dia) => {
    dias[dia] = JSON.parse(JSON.stringify(horas)); // Hacemos una copia de 'horas' por cada día
  });

  Object.keys(asignaturas).forEach((codigoAsig) => {
    const asignatura = asignaturas[codigoAsig];

    // Si el curso al que pertenece esta asignatura no está en el objeto, se añade
    if (!horariosPorCurso.hasOwnProperty(asignatura.curso)) {
      horariosPorCurso[asignatura.curso] = {};
    }

    Object.keys(asignatura.grupos).forEach((numeroGrupo) => {
      const grupo = asignatura.grupos[numeroGrupo];

      // Si el grupo en el que se imparte esta asignatura no está en el objeto, se añade
      // Además se le añaden los días (que ya llevan las horas)
      if (!horariosPorCurso[asignatura.curso].hasOwnProperty(numeroGrupo)) {
        // Una copia de 'días' por cada curso
        horariosPorCurso[asignatura.curso][numeroGrupo] = JSON.parse(JSON.stringify(dias));
      }

      grupo.horario.forEach((clase) => {
        const hora = clase.hora.substring(0, 2);

        horariosPorCurso[asignatura.curso][numeroGrupo][clase.dia][hora] = asignatura.acronimo;
      });
    });
  });

  return horariosPorCurso;
};

// POST /planificador_2
exports.generarHorarios = (req, res, next) => {
  // JSON con las asignaturas (y sus detalles, incluyendo horarios)
  // recibido de la API en el middleware anterior.
  const asignaturas = res.locals.asigConHorario;

  // Objeto en el que guardamos la información de la API
  // con una estructura más manejable para pasos posteriores
  const horariosPorCurso = formatearHorarios(asignaturas);

  next();
};
