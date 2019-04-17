// GET /planificador
exports.planificador = (req, res) => {
  // Mensaje que se mostrará en la tabla por defecto (antes de usar el filtro)
  const filasAsig = `<tr>
    <td colspan="6">Usa el filtro para buscar asignaturas</td>
  </tr>`;


  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = '<script src="javascripts/tablaAsignaturas.js"></script>';

  res.render('planificador/planificador', { asignaturas: res.locals.asignaturas, scripts });
};

// GET /planificador_2
exports.planificador_2 = (req, res) => {
  res.render('planificador/planificador_2', { scripts: '' });
};

// GET /planificador_3
exports.planificador_3 = (req, res) => {
  res.render('planificador/planificador_3', { scripts: '' });
};
