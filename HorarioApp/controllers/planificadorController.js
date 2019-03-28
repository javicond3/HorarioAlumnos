// GET /planificador
exports.planificador = (req, res) => {
  res.render('planificador/planificador');
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
