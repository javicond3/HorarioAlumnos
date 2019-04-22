// GET /planificador
exports.planificador = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = ['tablaAsignaturas'];

  // Es redundante pasar como parámetro locals de res.render()
  // un res.locals.x, porque en la vista ya se podría acceder
  // directamente a x. Pero de esta forma no hay errores cuando
  // no se ha pasado por el middleware que los define (como cuando
  // entras al planifcador; no pasa por filtroController). También
  // se podría evitar eso poniendo locals.x en las vistas.
  res.render('planificador/planificador', {
    asignaturas: res.locals.asignaturas,
    grado: res.locals.grado,
    ano: res.locals.ano,
    semestre: res.locals.semestre,
    scripts,
  });
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
