// GET /planificador
exports.planificador = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = ['tablaAsignaturas'];

  res.render('planificador/planificador', { asignaturas: res.locals.asignaturas, scripts });
};

// POST /planificador_2
exports.planificador_2 = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  // const scripts = [''];
  res.render('planificador/planificador_2', { scripts: '' });
};

// GET /planificador_3
exports.planificador_3 = (req, res) => {
  res.render('planificador/planificador_3', { scripts: '' });
};
