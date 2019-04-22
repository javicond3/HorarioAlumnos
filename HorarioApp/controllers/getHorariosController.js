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

  console.log(asignaturas);
  console.log(grado);
  console.log(ano);
  console.log(semestre);


  // URL para pedir el JSON con las asignaturas deseadas
  // const url = `https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/${response.grado}/${response.ano}/${response.semestre}/${}/horarios`;
  // https://pruebas.etsit.upm.es/pdi/progdoc/api/asignaturas/09TT/201718/I/95000001/horarios

  next();
};
