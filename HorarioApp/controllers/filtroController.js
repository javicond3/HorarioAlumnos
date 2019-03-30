// GET /filtrar
exports.filtrarAsignaturas = (req, res) => {
  const response = {
    grado: req.query.grado,
    curso: req.query.curso,
  };
  console.log(response);
  res.render('/planificador', {});
};
