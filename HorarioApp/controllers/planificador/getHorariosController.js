/* eslint-disable no-prototype-builtins */
/* eslint-disable quote-props */

const fetch = require('node-fetch');

// POST /planificador_2
exports.getHorarios = (req, res, next) => {
  // Array con los códigos de las asignaturas seleccionadas
  const asignaturas = JSON.parse(req.body.asigSelec);
  const { grado } = req.body;
  const { ano } = req.body;
  const { semestre } = req.body;

  const listaAsignaturas = asignaturas.reduce((acc, asig) => `${acc},${asig}`);

  // URL para pedir el JSON con las asignaturas deseadas
  // https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/09TT/201718/I/95000001/horarios

  // const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/${ano}/${semestre}/${listaAsignaturas}/horarios`;
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/201718/${semestre}/${listaAsignaturas}/horarios`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      res.locals.asigConHorario = json;
      // console.log(json);
      // Object.keys(json).forEach((curso) => {
      // console.log(json[curso].grupos);
      // });

      next();
    })
    .catch(err => console.error(err));
};


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
  };

  // Rellenamos los dias con las horas
  Object.keys(dias).forEach((dia) => {
    dias[dia] = JSON.parse(JSON.stringify(horas)); // Hacemos una copia de 'horas' para cada día
  });

  return dias;
};

/**
 * Función que toma un objeto con las asignaturas tal cual se obtiene el JSON de
 * la API y devuelve un objeto con la información reorganizada en una estructura de
 * {cursos : {grupos: {días: {horas:acronimo}}} para que sea más fácil de manejar
 * a la hora de hacer combinaciones posteriormente.
 */
const formatearHorarios = (asignaturas) => {
  // Objeto para guardar los horarios reestructurados
  const horariosPorCurso = {};

  Object.keys(asignaturas).forEach((codigoAsig) => {
    const asignatura = asignaturas[codigoAsig];

    // Si la asignatura es optativa (tiene grupos con nombre "Optativasx.x")
    let esOptativa = false;
    const primerGrupo = Object.keys(asignatura.grupos)[0];
    if (primerGrupo && primerGrupo.includes('Optativa')) { // La optativa tiene que tener grupos (no vacío) e incluir "Optativa"
      esOptativa = true;
      asignatura.curso = `Opt${asignatura.acronimo}`; // Le asignamos un curso separado llamado "OptACRONIMO"
    }

    // Si el curso al que pertenece esta asignatura no está en el objeto, se añade
    if (!horariosPorCurso.hasOwnProperty(asignatura.curso)) {
      horariosPorCurso[asignatura.curso] = {};
    }

    Object.keys(asignatura.grupos).forEach((nombGrupo, ind) => {
      const grupo = asignatura.grupos[nombGrupo];

      // Variable con el nombre del grupo que modificaremos si es optativa. Ej: "HCOV-1".
      const nombreGrupo = esOptativa ? `${asignatura.acronimo}-${ind + 1}` : nombGrupo;

      // Si el grupo en el que se imparte esta asignatura no está en el objeto, se añade
      // Además se le añade el horario (con días y horas) y las notas
      if (!horariosPorCurso[asignatura.curso].hasOwnProperty(nombreGrupo)) {
        horariosPorCurso[asignatura.curso][nombreGrupo] = {};
        horariosPorCurso[asignatura.curso][nombreGrupo].horario = generaDiasConHoras();
        horariosPorCurso[asignatura.curso][nombreGrupo].notas = {};
      }

      // Añadimos al objeto las clases
      grupo.horario.forEach((clase) => {
        const hora = clase.hora.substring(0, 2);

        horariosPorCurso[asignatura.curso][nombreGrupo].horario[clase.dia][hora] = asignatura.acronimo;
      });

      // Añadimos al objeto las notas
      grupo.nota.forEach((nota) => {
        // Si la asignatura a la que pertenece esta nota no está en el objeto, se añade
        if (!horariosPorCurso[asignatura.curso][nombreGrupo].notas.hasOwnProperty(asignatura.acronimo)) {
          horariosPorCurso[asignatura.curso][nombreGrupo].notas[asignatura.acronimo] = [];
        }
        horariosPorCurso[asignatura.curso][nombreGrupo].notas[asignatura.acronimo].push(nota);
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
 * Función que recibe un horario ya formateado y devuelve un objeto con dos propiedades:
 * una con un array con los cursos de las asignaturas seleccionadas y otra con un array que
 * contiene todas las combinaciones posibles con los grupos de esos cursos.
 *
 */
const calcCombinaciones = (horario) => {
  const combinaciones = {
    cursos: [], // Cursos a los que pertencen los grupos a combinar
    combGrupos: [], // Combinaciones de grupos
  };

  // Array con arrays, en el que cada uno contiene los grupos de un curso
  // Por ejemplo: [[11.1,12.1],[21.1,22.1],[31.1,32.1]]
  const arrGrupos = [];

  Object.keys(horario).forEach((nombreCurso) => {
    combinaciones.cursos.push(nombreCurso);
    const curso = horario[nombreCurso];
    const gruposDeCurso = []; // Cada curso tiene unos grupos

    Object.keys(curso).forEach((numGrupo) => {
      gruposDeCurso.push(numGrupo);
    });

    arrGrupos.push(gruposDeCurso);
  });

  combinaciones.combGrupos = cartesian(arrGrupos);

  return combinaciones;
};

/**
 * Función que un array con combinaciones de grupos y un objeto con los horarios fromateados
 * y devuleve un array de objetos con los horarios resultantes de combinar el de los grupos
 * pasados como parámetro.
 *
 */
const generarHorariosCombinados = (combinaciones, horariosPorCurso) => {
  const horariosCombinados = [];
  const { combGrupos } = combinaciones;

  // Para cada combinación de grupos generamos un horario
  combGrupos.forEach((comb, ind) => {
    const horarioCombinado = {
      id: ind, // Id única para cada horario
      grupos: comb, // Grupos que forman el horario
      haySolapamiento: false, // Indica si hay solapamiento de asignaturas
      tabla: generaDiasConHoras(), // Tabla para representarlo en la vista
      notas: {}, // Observaciones
    };

    comb.forEach((grupo, index) => {
      // El array de cursos tiene el mismo orden que las combinaciones, por lo que el índice
      // del curso y del grupo correspondiente a ese curso es el mismo [1,2,3] [11.1, 23.1, 32.1]
      const curso = combinaciones.cursos[index];
      const notasGrupo = horariosPorCurso[curso][grupo].notas;
      const horarioGrupo = horariosPorCurso[curso][grupo].horario;

      // Añadimos las notas al horario combinado
      Object.keys(notasGrupo).forEach((nomAsig) => {
        const notasAsignatura = notasGrupo[nomAsig];

        // Creamos la propiedad <nomAsig> dentro de notas, donde
        // guardaremos un array con las notas de dicha asignatura
        horarioCombinado.notas[nomAsig] = [];
        notasAsignatura.forEach((nota) => {
          horarioCombinado.notas[nomAsig].push(nota);
        });
      });

      // Añadimos las clases al horario combinado
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
  console.log(horariosPorCurso);


  // Objeto con los cursos y todas las combinaciones posibles de grupos
  const combinaciones = calcCombinaciones(horariosPorCurso);

  // Array con todos los horarios resultantes de las combinaciones
  const horariosCombinados = generarHorariosCombinados(combinaciones, horariosPorCurso);

  res.locals.horarios = horariosCombinados;

  next();
};
