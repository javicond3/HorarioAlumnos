const fetch = require('node-fetch');

// POST /planificador_2
exports.getHorarios = (req, res, next) => {
  // Array con los códigos de las asignaturas seleccionadas
  const asignaturas = JSON.parse(req.body.asigSelec);
  const { grado } = req.body;
  const { ano } = req.body;
  const { semestre } = req.body;

  let listaAsignaturas = '';

  asignaturas.forEach((asig) => {
    listaAsignaturas += `${asig},`;
  });

  // URL para pedir el JSON con las asignaturas deseadas
  // https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/09TT/201718/I/95000001/horarios

  // const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/${ano}/${semestre}/${listaAsignaturas}/horarios`;
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/201718/${semestre}/${listaAsignaturas}/horarios`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      res.locals.asigConHorario = json;
      // console.log(json);
      // Object.keys(json).forEach((curso) => {
      // console.log(json[curso].grupos);
      // });

      next();
    })
    .catch(err => console.error(err));
};
