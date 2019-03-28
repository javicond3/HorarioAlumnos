const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});

/* GET planificador. */
router.get('/planificador', (req, res) => {
  res.render('planificador');
});

/* GET horarios guardados. */
router.get('/horarios', (req, res) => {
  res.render('horarios');
});

module.exports = router;
