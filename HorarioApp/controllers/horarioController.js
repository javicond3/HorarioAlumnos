/* eslint-disable no-prototype-builtins */
/* eslint-disable quote-props */

const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const models = require('../models');

// POST /planificador_2
exports.fetch = (req, res, next) => {
  // Parámetros del formulario oculto
  const asignaturas = JSON.parse(req.body.asigSelec); // Array con códigos de asignaturas selec.
  const { plan } = req.body;
  const { ano } = req.body;
  const { semestre } = req.body;
  const detalles = JSON.parse(req.body.detalles);

  // Guardamos en locals los datos que necesitamos tener accesibles en las vistas
  res.locals.ano = ano;
  res.locals.semestre = semestre;
  res.locals.plan = plan;
  res.locals.asignaturas = req.body.asigSelec;
  res.locals.detalles = detalles;

  const listaAsignaturas = asignaturas.reduce((acc, asig) => `${acc},${asig}`);

  // URL para pedir el JSON con las asignaturas deseadas
  // https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/09TT/201718/I/95000001/horarios

  // const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${plan}/${ano}/${semestre}/${listaAsignaturas}/horarios`;
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${plan}/201718/${semestre}/${listaAsignaturas}/horarios`;
  console.log(url);

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
const generarHorariosCombinados = (combinaciones, horariosPorCurso, arrayAsignaturas) => {
  const horariosCombinados = [];
  const { combGrupos } = combinaciones;

  // Para cada combinación de grupos generamos un horario
  combGrupos.forEach((comb, ind) => {
    const horarioCombinado = {
      id: ind, // Id única para cada horario
      cursos: combinaciones.cursos, // Cursos a los que pertencen las asignaturas
      grupos: comb, // Grupos que forman el horario
      asignaturas: arrayAsignaturas, // Códigos de las asignaturas que componen el horario
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
exports.combinar = (req, res, next) => {
  // JSON con las asignaturas (y sus detalles, incluyendo horarios)
  // recibido de la API en el middleware anterior.
  const asignaturas = res.locals.asigConHorario;

  const arrayAsignaturas = [];
  Object.keys(asignaturas).forEach((codigoAsig) => {
    arrayAsignaturas.push(codigoAsig);
  });

  // Objeto en el que guardamos la información de la API
  // con una estructura más manejable para pasos posteriores
  const horariosPorCurso = formatearHorarios(asignaturas);
  // console.log(horariosPorCurso);


  // Objeto con los cursos y todas las combinaciones posibles de grupos
  const combinaciones = calcCombinaciones(horariosPorCurso);

  // Array con todos los horarios resultantes de las combinaciones
  const horariosComb = generarHorariosCombinados(combinaciones, horariosPorCurso, arrayAsignaturas);

  res.locals.horarios = horariosComb;

  next();
};


/**
 * Función auxiliar que devuelve una promesa que se resolverá con valor true
 * si ya existe un alumno en la BBDD con ese correo, o falso en caso contrario.
 *
 */
const existeAlumno = correo => models.Alumno.count({ where: { correo } })
  .then((count) => {
    if (count !== 0) {
      return true;
    }
    return false;
  });


// POST /planificador_2
exports.guardar = (req, res, next) => {
  // Parámetros del formulario oculto
  const { ano } = req.body;
  const { semestre } = req.body;
  const { plan } = req.body;
  const asignaturas = JSON.parse(req.body.asignaturas); // Array con códigos de asignaturas selec.
  const cursos = JSON.parse(req.body.cursos);
  const grupos = JSON.parse(req.body.grupos);

  /* // Recuperamos el plan al que corresponde el horario de la BBDD
    let planBuscado;
    models.Plan.findAll({ where: { codigo: plan } })
    .then((planes) => {
      planBuscado = planes[0];
    }); */


  // Identificamos al alumno con su correo electŕonico
  const correo = req.session.cas_user;

  // Función que devuelve una promesa que añade un horario a la BBDD
  const promesaCreaHorario = () => new Promise((resolve, reject) => resolve(
    models.Horario.build({
      ano,
      semestre,
      asignaturas,
      cursos,
      grupos,
      alumnoId: correo,
      planId: plan,
    })
      .save()
      .then(() => {
        res.locals.msg = 'Horario guardado con éxito.';
        res.locals.saved = true;
        next();
      })
      .catch(Sequelize.ValidationError, (error) => {
        console.log('Error de validación, los datos del horario no son correctos.');
        error.errors.forEach((elem) => {
          console.log(error.errors[elem].value);
        });
      })
      .catch((error) => {
        console.log(error);
        res.locals.msg = 'Error. No se ha podido guardar el horario';
        res.locals.saved = false;
        next();
      }),
  ));

  // Función que devuelve una promesa que añade un alumno a la BBDD
  const promesaCreaAlumno = () => new Promise((resolve, reject) => resolve(
    models.Alumno.build({ correo })
      .save()
      .catch(err => console.log(err)),
  ));

  existeAlumno(correo)
    .then((existe) => {
      if (!existe) { // Si no existe lo creamos
        return promesaCreaAlumno().then(promesaCreaHorario);
      }
      return promesaCreaHorario();
    })
    .then(() => { });
};


/**
 * Función que genera un horario tomando como parámetros un objeto con las
 * asignaturas con horarios y los grupos en los que está matriculado el
 * alumno. El objeto gruposMatriculado tiene la estructura
 * { curso: grupo }. Ej: { 1: 11.1, 2: 21.1 }
 *
 * El parámetro id solo se usa para identificar los horarios en la vista
 * horarios_guardados, en la vista curso_actual/horario no se usa.
 */
const generaHorarioConGrupos = (asignaturas, gruposMatriculado, id = 0, ano, semestre, plan) => {
  // Array con los grupos (solo para mostrarlos en las vistas)
  const arrayGrupos = [];
  Object.keys(gruposMatriculado).forEach((curso) => {
    const grupo = gruposMatriculado[curso];
    arrayGrupos.push(grupo);
  });

  const horarioCombinado = {
    id,
    grupos: arrayGrupos,
    ano,
    semestre,
    plan,
    asignaturas: [], // Array con los códigos de las asignaturas
    tabla: generaDiasConHoras(), // Tabla para representarlo en la vista
    notas: {}, // Observaciones
  };

  Object.keys(asignaturas).forEach((codigoAsig) => {
    horarioCombinado.asignaturas.push(codigoAsig);
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
exports.getActual = (req, res, next) => {
  // Cuando la API esté disponible, obtener los datos de matírcula del alumno que ha iniciado sesión

  // const gruposMatriculado = grupos;

  // Datos de prueba
  const gruposMatriculado = {
    1: '12.1',
    2: '23.1',
  };
  const asigPrueba = ['95000001', '95000002', '95000013', '95000011'];
  const listaAsignaturas = asigPrueba.reduce((acc, asig) => `${acc},${asig}`);
  const grado = '09TT';
  const ano = '201718';
  const semestre = '1S';

  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/${ano}/${semestre}/${listaAsignaturas}/horarios`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      const asigConHorario = json;
      res.locals.horario = generaHorarioConGrupos(asigConHorario, gruposMatriculado);
      next();
    })
    .catch(err => console.error(err));
};


// GET /horarios_guardados
exports.cargar = (req, res, next) => {
  const correo = req.session.cas_user; // Correo con el que ha iniciado sesión en el CAS
  const horariosFormateados = [];
  const promesaFetchHorarios = (url, gruposMatriculado, horarioId, ano, semestre, plan) => new Promise((resolve, reject) => {
    resolve(
      fetch(url)
        .then(respuesta => respuesta.json())
        .then((json) => {
          const asigConHorario = json;
          const horarioFormateado = generaHorarioConGrupos(asigConHorario, gruposMatriculado, horarioId, ano, semestre, plan);
          horariosFormateados.push(horarioFormateado);
        })
        .catch(err => console.error(err)),
    );
  });
  models.Horario.findAll({ where: { alumnoId: correo } })
    .then((horarios) => {
      const promises = [];
      horarios.forEach((horario) => {
        const horarioId = horario.id;
        const { ano } = horario;
        const { semestre } = horario;
        const { asignaturas } = horario;
        const { cursos } = horario;
        const { grupos } = horario;
        const plan = horario.planId;

        const listaAsignaturas = asignaturas.reduce((acc, asig) => `${acc},${asig}`);

        // Creamos un objeto compatible con la función generaHorariosConGrupos a partir
        // de los cursos y grupos guardados en la BBDD. La estructura debe ser
        // {curso1: grupo1, curso2: grupo2, ...}
        const gruposMatriculado = {};
        cursos.forEach((curso, ind) => {
          // El array de cursos tiene el mismo orden que el de grupos, por lo que el índice
          // del curso y del grupo correspondiente a ese curso es el mismo:
          // [1,2,3] [11.1, 23.1, 32.1]
          gruposMatriculado[curso] = grupos[ind];
        });

        const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${plan}/${ano}/${semestre}/${listaAsignaturas}/horarios`;

        promises.push(promesaFetchHorarios(url, gruposMatriculado, horarioId, ano, semestre, plan));
      });

      return Promise.all(promises);
    })
    .then(() => {
      res.locals.horarios = horariosFormateados;
      next();
    })
    .catch(err => console.error(err));
};

// POST /borrarHorario
exports.borrar = (req, res, next) => {
  const horarioId = req.body.id;

  models.Horario.destroy({ where: { id: horarioId } })
    .then(() => {
      res.locals.saved = true;
      res.locals.msg = 'Horario borrado con éxito';

      next();
    })
    .catch((err) => {
      res.locals.saved = true;
      res.locals.msg = 'Horario borrado con éxito';
      console.log(err);

      next();
    });
};
