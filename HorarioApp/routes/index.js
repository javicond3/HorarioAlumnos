const express = require('express');

const router = express.Router();

const cursoActualController = require('../controllers/cursoActualController');
const planificadorController = require('../controllers/planificadorController');
const horariosGuardadosController = require('../controllers/horariosGuradadosController');
const filtroController = require('../controllers/filtroController');
const getHorariosController = require('../controllers/getHorariosController');
const generaHorariosController = require('../controllers/generaHorariosController');

/* GET home page.
(redirige a curso_actual/horario) */
router.get('/', (req, res) => {
  res.redirect('/curso_actual/horario');
});

/* Rutas de curso actual. */
router.get('/curso_actual/horario', cursoActualController.horario);
router.get('/curso_actual/examenes', cursoActualController.examenes);

/* Rutas de planificador. */
router.get('/planificador', planificadorController.planificador);
router.get('/filtrar', // Ruta para el filtro del planificador
  filtroController.filtrarAsignaturas,
  planificadorController.planificador);
router.post('/planificador_2',
  getHorariosController.getHorarios,
  generaHorariosController.generarHorarios,
  planificadorController.planificador_2);
router.get('/planificador_3', planificadorController.planificador_3);

/* Rutas de horarios guardados. */
router.get('/horarios_guardados', horariosGuardadosController.horarios);

module.exports = router;
