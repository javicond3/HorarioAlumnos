/* eslint-disable func-names */

/**
 * Script que muestra el horario elegido en el select, manteniendo las
 * demás tablas ocultas.
 */
$(document).ready(() => {
  $('#horarioSelector').change(function () { // Cuando cambie el valor
    $('#msg').hide(); // Escondemos el mensaje de guardado (si lo hubiera)
    $('.horarioGuardado').hide(); // Escondemos todas
    $('.details').hide();
    $(`#horario${this.value}`).show(); // Mostramos la elegida
    $(`#details${this.value}`).show();
  });

  // Añade la clase "solapado" a las casillas en las que coinciden varias asignaturas
  $('.horarioGuardado table tbody tr td').each(function () {
    if ($(this).text().includes('/')) {
      $(this).addClass('solapado');
    }
  });
});
