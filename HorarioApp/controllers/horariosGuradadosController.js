// GET /horarios_guardados
exports.horarios = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  const scripts = ['seleccionHorarioGuardado'];

  res.render('horarios_guardados/horarios_guardados', { scripts });
};

// POST /horarios_guardados/examenes
exports.examenes = (req, res) => {
  // Scripts que se incluyen en la vista para el lado cliente
  // const scripts = ['miScript1', 'miScript2'];

  res.render('horarios_guardados/examenes', { scripts: '' });
};
