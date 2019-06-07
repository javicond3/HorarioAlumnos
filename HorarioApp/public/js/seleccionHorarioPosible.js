/* eslint-disable func-names */

/**
 * Script que muestra el horario elegido en el select, manteniendo las
 * demás tablas ocultas.
 */
$(document).ready(() => {
  $('#optionSelector').change(function () { // Cuando cambie el valor
    $('.horarioPosible').hide(); // Escondemos todas
    $(`#horario${this.value}`).show(); // Mostramos la elegida
  });

  // Añade la clase "solapado" a las casillas en las que coinciden varias asignaturas
  $('.horarioPosible table tbody tr td').each(function () {
    if ($(this).text().includes('/')) {
      $(this).addClass('solapado');
    }
  });
});
