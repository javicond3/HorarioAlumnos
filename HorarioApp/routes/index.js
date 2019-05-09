const express = require('express');

const router = express.Router();

const cursoActualController = require('../controllers/curso_actual/cursoActualController');
const planificadorController = require('../controllers/planificador/planificadorController');
const horariosGuardadosController = require('../controllers/horarios_guardados/horariosGuradadosController');
const filtroController = require('../controllers/planificador/filtroController');
const getHorariosController = require('../controllers/planificador/getHorariosController');
const getExamenesController = require('../controllers/curso_actual/getExamenesController');
const getPlanesController = require('../controllers/planificador/getPlanesController');
const getHorarioActualController = require('../controllers/curso_actual/getHorarioActualController');

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
