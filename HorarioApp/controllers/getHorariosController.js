const fetch = require('node-fetch');

// POST /planificador_2
exports.getHorarios = (req, res, next) => {
  // Array con los códigos de las asignaturas seleccionadas
  const asignaturas = JSON.parse(req.body.asigSelec);
  const { grado } = req.body;
  const { ano } = req.body;
  let { semestre } = req.body;

  // El formato del semestre en esta api es "I" en lugar de "1S"
  switch (semestre) {
    case '1S':
      semestre = 'I';
      break;
    case '2S':
      semestre = 'II';
      break;
    default:
      break;
  }

  let listaAsignaturas = '';

  asignaturas.forEach((asig) => {
    listaAsignaturas += `${asig},`;
  });

  // URL para pedir el JSON con las asignaturas deseadas
  // https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/09TT/201718/I/95000001/horarios

  // const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/${ano}/${semestre}/${listaAsignaturas}/horarios`;
  const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${grado}/201718/${semestre}/${listaAsignaturas}/horarios`;

  console.log(url);

  fetch(url)
    .then(respuesta => respuesta.json())
    .then((json) => {
      res.locals.asigConHorario = json;
      next();
    })
    .catch(err => console.error(err));
};
