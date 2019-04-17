/* eslint-disable func-names */

/**
 * Script que hace que las tablas de asignaturas sea dinámicas, quitando la
 * asignatura sobre la que se hace click de una tabla y añadiédola a la otra.
 *
 * Además, recoge la selección del usuario (un JSON con las asignaturas elegidas)
 * para posteriormente enviársela al servidor mediante una petición POST con AJAX.
 */
$(document).ready(() => {
  // const asignaturasSelec = [];

  // Si hacemos click en una fila de la tabla de disponibles
  $('tr.dispTableRow').click(function () {
    const id = $(this).attr('id').slice(4);
    $(this).fadeOut('slow', () => {
      $(`#selec${id}`).fadeIn('slow');
    });
  });

  // Si hacemos click en una fila de la tabla de disponibles
  $('tr.selecTableRow').click(function () {
    const id = $(this).attr('id').slice(5);
    $(this).fadeOut('slow', () => {
      $(`#disp${id}`).fadeIn('slow');
    });
  });
});
