/* eslint-disable func-names */

/**
 * Script que muestra el horario elegido en el select, manteniendo las
 * demás tablas ocultas.
 */
$(document).ready(() => {
  $('#optionSelector').change(function () { // Cuando cambie el valor
    $('.horarioPosible').hide(); // Escondemos todas
    $(`#tabla${this.value}`).show(); // Mostramos la elegida
  });
});
