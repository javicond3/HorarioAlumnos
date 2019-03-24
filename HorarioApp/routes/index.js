const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});

/* GET prueba 1. */
router.get('/prueba1', (req, res) => {
  res.render('prueba1');
});

/* GET prueba 2. */
router.get('/prueba2', (req, res) => {
  res.render('prueba2');
});

module.exports = router;
