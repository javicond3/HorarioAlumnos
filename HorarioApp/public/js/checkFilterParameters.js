/* eslint-disable func-names */

/**
 * Función que comprueba que al menos se ha marcado un curso y
 * desactiva el botón de "Filtrar" en caso de que no se cumpla
 * dicha condición.
 */
const checkCbCurso = () => {
  const cbChecked = $('.cb-curso:checked').length > 0; // check if at least one checked
  $('#filterBtn').prop('disabled', !cbChecked);
};

/**
 * Script que
 *
 */
$(document).ready(() => {
  checkCbCurso(); // run it for the first time
  $('.cb-curso').on('change', checkCbCurso); // Comprobar cada vez que se marque/desmarque
});
