// GET /planificador
exports.planificador = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = ['seleccionAsignaturas'];

  // Es redundante pasar como parámetro locals de res.render()
  // un res.locals.x, porque en la vista ya se podría acceder
  // directamente a x. Pero de esta forma no hay errores cuando
  // no se ha pasado por el middleware que los define (como cuando
  // entras al planifcador; no pasa por filtroController). También
  // se podría evitar eso poniendo locals.x en las vistas.
  res.render('planificador/planificador', {
    asignaturas: res.locals.asignaturas,
    plan: res.locals.plan,
    ano: res.locals.ano,
    semestre: res.locals.semestre,
    scripts,
  });
};

// POST /planificador_2
exports.planificador_2 = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = ['seleccionHorarioPosible'];

  // Los horarios ya se han guardado en res.locals.horarios en el mw anterior

  res.render('planificador/planificador_2', { scripts });
};
