const fetch = require('node-fetch');

// GET /curso_actual/horario
exports.getHorarios = (req, res, next) => {
  // Cuando la API esté disponible, obtener los datos de matírcula del alumno que ha iniciado sesión

  // Datos de prueba
  const asigPrueba = ['95000001', '95000002', '95000013', '95000011'];
  const listaAsignaturas = asigPrueba.reduce((acc, asig) => `${acc},${asig}`);
  const grado = '09TT';
  const ano = '201718';
  const semestre = '1S';

  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/${ano}/${semestre}/${listaAsignaturas}/horarios`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      res.locals.asigConHorario = json;

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
    10: '',
    11: '',
    12: '',
    13: '',
    14: '',
    15: '',
    16: '',
    17: '',
    18: '',
    19: '',
    20: '',
  };

  // Rellenamos los dias con las horas
  Object.keys(dias).forEach((dia) => {
    dias[dia] = JSON.parse(JSON.stringify(horas)); // Hacemos una copia de 'horas' para cada día
  });

  return dias;
};


/**
 *
 */
const formatearHorarios = (asignaturas, gruposMatriculado) => {
  const horarioCombinado = {
    tabla: generaDiasConHoras(), // Tabla para representarlo en la vista
    notas: {}, // Observaciones
  };

  Object.keys(asignaturas).forEach((codigoAsig) => {
    const asig = asignaturas[codigoAsig];
    const nombreAsig = asig.acronimo ? asig.acronimo : asig.nombre;
    const grupMatriculado = gruposMatriculado[asig.curso];

    asig.grupos[grupMatriculado].horario.forEach((clase) => {
      const { dia } = clase;
      const hora = clase.hora.substring(0, 2);
      if (horarioCombinado.tabla[dia][hora] !== '') { // Si ya había una asignatura de otro curso a esa hora
        horarioCombinado.tabla[dia][hora] += `/${nombreAsig}`; // La hora queda con el valor "ASIG1/ASIG2"
      } else {
        horarioCombinado.tabla[dia][hora] = nombreAsig;
      }
    });

    // Añadimos al objeto las notas
    asig.grupos[grupMatriculado].nota.forEach((nota) => {
      // Si la asignatura a la que pertenece esta nota no está en el objeto, se añade
      if (!horarioCombinado.notas.hasOwnProperty(nombreAsig)) {
        horarioCombinado.notas[nombreAsig] = [];
      }
      horarioCombinado.notas[nombreAsig].push(nota);
    });
  });

  return horarioCombinado;
};

// GET /curso_actual/horario
exports.generaHorario = (req, res, next) => {
  const { asigConHorario } = res.locals;

  const gruposMatriculado = {
    1: '12.1',
    2: '23.1',
  };

  const horario = formatearHorarios(asigConHorario, gruposMatriculado);

  res.locals.horario = horario;

  next();
};
