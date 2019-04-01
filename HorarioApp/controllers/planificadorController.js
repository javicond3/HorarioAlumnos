// GET /planificador
exports.planificador = (req, res) => {
  // Mensaje que se mostrará en la tabla por defecto (antes de usar el filtro)
  let filasAsig = `<tr>
    <td colspan="6">Usa el filtro para buscar asignaturas</td>
  </tr>`;

  let filasSelec = '';

  // Si se han filtrado asginaturas, se carga la variable en la que están almacenadas.
  if (res.locals.asignaturas) {
    filasAsig = res.locals.asignaturas.tablaDisp;
    filasSelec = res.locals.asignaturas.tablaSelec;
  }

  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = '<script src="javascripts/tablaAsignaturas.js"></script>';

  res.render('planificador/planificador', { asignaturasDisp: filasAsig, asignaturasSelec: filasSelec, scripts });
};

// GET /planificador_2
exports.planificador_2 = (req, res) => {
  res.render('planificador/planificador_2', { scripts: '' });
};

// GET /planificador_3
exports.planificador_3 = (req, res) => {
  res.render('planificador/planificador_3', { scripts: '' });
};
