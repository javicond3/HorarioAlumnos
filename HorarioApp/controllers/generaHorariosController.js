/* eslint-disable no-prototype-builtins */
/* eslint-disable quote-props */

/**
 * Función que devuelve un objeto con los días de la semana, cada uno con un
 * objeto anidado donde cada propiedad es una hora del día. El valor de la
 * esta propiedad es por defecto un string vacío que posteriormente se podrá
 * rellenar con el acrónimo de la asignatura impartida a dicha hora.
 */
const generaDiasConHoras = () => {
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
    dias[dia] = JSON.parse(JSON.stringify(horas)); // Hacemos una copia de 'horas' para cada día
  });

  return dias;
};

/**
 * Función que toma un JSON con las asignaturas tal cual se obtiene de la API
 * y devuelve un objeto con la información reorganizada en una estructura de
 * {cursos : {grupos: {días: {horas:acronimo}}} para que sea más fácil de manejar
 * a la hora de hacer combinaciones posteriormente.
 */
const formatearHorarios = (asignaturas) => {
  // Objeto para guardar los horarios reestructurados
  const horariosPorCurso = {};

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
        // Añadimos un objeto días con horas a cada curso
        horariosPorCurso[asignatura.curso][numeroGrupo] = generaDiasConHoras();
      }

      grupo.horario.forEach((clase) => {
        const hora = clase.hora.substring(0, 2);

        horariosPorCurso[asignatura.curso][numeroGrupo][clase.dia][hora] = asignatura.acronimo;
      });
    });
  });

  return horariosPorCurso;
};

/**
 * Función que un array de arrays y calcula todas las combinaciones (no importa el orden)
 * posibles entre los elementos de todos los arrays.
 *
 * Por ejemplo, cartesian([[0,1],[2,3]]) devolverá [[0,2],[0,3],[1,2],[1,3]]
 */
const cartesian = (arrDeArrays) => {
  const r = [];
  const args = arrDeArrays;
  const max = args.length - 1;

  function helper(arr, i) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      const a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i === max) { r.push(a); } else { helper(a, i + 1); }
    }
  }
  helper([], 0);
  return r;
};

/**
 * Función que recibe un horario ya formateado y devuelve un array con todas
 * las combinaciones usando la función cartesian().
 *
 */
const calcCombinaciones = (horario) => {
  const arrDeArrays = []; // Array con los arrays de grupos de cada curso

  Object.keys(horario).forEach((numCurso) => {
    const curso = horario[numCurso];
    const gruposDeCurso = []; // Cada curso tiene unos grupos

    Object.keys(curso).forEach((numGrupo) => {
      gruposDeCurso.push(numGrupo);
    });

    arrDeArrays.push(gruposDeCurso);
  });

  return cartesian(arrDeArrays);
};

/**
 * Función que un array con combinaciones de grupos y un objeto con los horarios fromateados
 * y devuleve un array de objetos con los horarios resultantes de combinar el de los grupos
 * pasados como parámetro.
 *
 */
const generarHorariosCombinados = (combGrupos, horariosPorCurso) => {
  const horariosCombinados = [];

  // Para cada combinación de grupos generamos un horario
  combGrupos.forEach((comb) => {
    const horarioCombinado = {
      grupos: comb, // Grupos que forman el horario
      haySolapamiento: false, // Indica si hay solapamiento de asignaturas
      tabla: generaDiasConHoras(), // Tabla para representarlo en la vista
    };

    comb.forEach((grupo) => {
      const curso = grupo.charAt(0); // El primer caracter del grupo es el curso
      const horarioGrupo = horariosPorCurso[curso][grupo];
      Object.keys(horarioGrupo).forEach((dia) => {
        const horarioDia = horarioGrupo[dia];
        Object.keys(horarioDia).forEach((hora) => {
          const asignatura = horarioDia[hora];

          if (asignatura !== '') { // Si a esa hora hay una asignatura
            if (horarioCombinado.tabla[dia][hora] !== '') { // Si ya había una asignatura de otro curso a esa hora
              horarioCombinado.haySolapamiento = true; // Señalamos el solapamiento
              horarioCombinado.tabla[dia][hora] += `/${asignatura}`; // La hora queda con el valor "ASIG1/ASIG2"
            } else {
              horarioCombinado.tabla[dia][hora] = asignatura;
            }
          }
        });
      });
    });

    horariosCombinados.push(horarioCombinado);
  });

  return horariosCombinados;
};

// POST /planificador_2
exports.generarHorarios = (req, res, next) => {
  // JSON con las asignaturas (y sus detalles, incluyendo horarios)
  // recibido de la API en el middleware anterior.
  const asignaturas = res.locals.asigConHorario;

  // Objeto en el que guardamos la información de la API
  // con una estructura más manejable para pasos posteriores
  const horariosPorCurso = formatearHorarios(asignaturas);

  // Array con todas las combinaciones posibles de grupos
  const combGrupos = calcCombinaciones(horariosPorCurso);

  // Array con todos los horarios resultantes de las combinaciones
  const horariosCombinados = generarHorariosCombinados(combGrupos, horariosPorCurso);

  next();
};
