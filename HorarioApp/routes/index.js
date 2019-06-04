const express = require('express');

const router = express.Router();

const cursoActualController = require('../controllers/cursoActualController');
const planificadorController = require('../controllers/planificadorController');
const horariosGuardadosController = require('../controllers/horariosGuradadosController');
const filtroController = require('../controllers/filtroController');
const horarioController = require('../controllers/horarioController');
const examenController = require('../controllers/examenController');
const planController = require('../controllers/planController');


/* GET home page.
(redirige a curso_actual/horario) */
router.get('/', (req, res) => {
  res.redirect('/curso_actual/horario');
});

/* Rutas de curso actual. */
router.get('/curso_actual/horario',
  horarioController.getActual,
  cursoActualController.horario);
router.get('/curso_actual/examenes',
  examenController.fetch,
  examenController.formatear,
  cursoActualController.examenes);

/* Rutas de planificador. */
router.get('/planificador',
  planController.fetch,
  planificadorController.planificador);
router.get('/filtrar', // Ruta para el filtro del planificador
  planController.fetch,
  filtroController.filtrarAsignaturas,
  planificadorController.planificador);
router.post('/planificador_2',
  horarioController.fetch,
  horarioController.combinar,
  planificadorController.planificador_2);
router.post('/guardarHorario', // Ruta para guardar el horario en la BBDD
  horarioController.guardar);

/* Rutas de horarios guardados. */
router.get('/horarios_guardados',
  horarioController.cargar,
  horariosGuardadosController.horarios);

module.exports = router;
