const fetch = require('node-fetch');

// GET /planificador
exports.planificador = (req, res) => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(json => console.log(json))
    .then(() => res.render('planificador/planificador'))
    .catch(err => console.error(err));
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
