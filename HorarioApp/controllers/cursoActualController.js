// GET /curso_actual/horario
exports.horario = (req, res) => {
  res.render('curso_actual/horario', { scripts: '' });
};

// GET /curso_actual/examenes
exports.examenes = (req, res) => {
  res.render('curso_actual/examenes', { scripts: '' });
};
