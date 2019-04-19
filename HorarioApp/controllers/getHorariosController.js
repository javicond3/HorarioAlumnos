// POST /planificador_2
exports.getHorarios = (req, res, next) => {
  // Array con los códigos de las asignaturas seleccionadas
  const asignaturas = JSON.parse(req.body.asigSelec);
  console.log(asignaturas);
  next();
};
