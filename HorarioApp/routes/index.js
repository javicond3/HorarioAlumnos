const express = require('express');

const router = express.Router();

const cursoActualController = require('../controllers/cursoActualController');
const planificadorController = require('../controllers/planificadorController');
const horariosGuardadosController = require('../controllers/horariosGuradadosController');
const filtroController = require('../controllers/filtroController');
const getHorariosController = require('../controllers/getHorariosController');
const getExamenesController = require('../controllers/getExamenesController');
const getPlanesController = require('../controllers/getPlanesController');
const getHorarioActualController = require('../controllers/getHorarioActualController');

/* GET home page.
(redirige a curso_actual/horario) */
router.get('/', (req, res) => {
  res.redirect('/curso_actual/horario');
});

/* Rutas de curso actual. */
router.get('/curso_actual/horario',
  getHorarioActualController.getHorarios,
  getHorarioActualController.generaHorario,
  cursoActualController.horario);
router.get('/curso_actual/examenes',
  getExamenesController.getExamenes,
  cursoActualController.examenes);

/* Rutas de planificador. */
router.get('/planificador',
  getPlanesController.getPlanes,
  planificadorController.planificador);
router.get('/filtrar', // Ruta para el filtro del planificador
  getPlanesController.getPlanes,
  filtroController.filtrarAsignaturas,
  planificadorController.planificador);
router.post('/planificador_2',
  getHorariosController.getHorarios,
  getHorariosController.generarHorarios,
  planificadorController.planificador_2);

/* Rutas de horarios guardados. */
router.get('/horarios_guardados', horariosGuardadosController.horarios);

module.exports = router;
