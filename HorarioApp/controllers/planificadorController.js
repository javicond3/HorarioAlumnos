// GET /planificador
exports.planificador = (req, res) => {
  let filas = '';

  /**
  * Si se han filtrado asginaturas, se carga la variable en la que están
  * almacenadas.
  * Si no (entrando al planificador directamente), la tabla estará vacía.
  */
  if (res.locals.asignaturas) {
    filas = res.locals.asignaturas;
  }
  res.render('planificador/planificador', { asignaturasDisp: filas });
};

// GET /planificador_2
exports.planificador_2 = (req, res) => {
  res.render('planificador/planificador_2');
};

// GET /planificador_3
exports.planificador_3 = (req, res) => {
  res.render('planificador/planificador_3');
};

/* res.render('ruta', {
    var1: x,
    var2: y
}); */
