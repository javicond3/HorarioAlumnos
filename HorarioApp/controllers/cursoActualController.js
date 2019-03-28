// GET /curso_actual/horario
exports.horario = (req, res) => {
  res.render('curso_actual/horario');
};

// GET /curso_actual/examenes
exports.examenes = (req, res) => {
  res.render('curso_actual/examenes');
};

/* res.render('ruta', {
    var1: x,
    var2: y
}); */
