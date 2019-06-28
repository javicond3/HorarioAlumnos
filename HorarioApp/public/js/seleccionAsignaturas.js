/* eslint-disable func-names */


/**
 * Script que hace que las tablas de asignaturas sea dinámicas, quitando la
 * asignatura sobre la que se hace click de una tabla y añadiédola a la otra.
 *
 * Además, recoge la selección del usuario (un JSON con las asignaturas elegidas)
 * para posteriormente enviársela al servidor mediante una petición POST.
 */
$(document).ready(() => {
  let asignaturasSelec = [];

  // Función que comprueba que al menos hay una asignatura seleccionada.
  // Desactiva el botón para continuar en caso de que no haya ninguna.
  const checkAsigSeleccionada = () => {
    const emptyAsignaturas = asignaturasSelec.length === 0; // check if at least one checked
    $('#confirmar').prop('disabled', emptyAsignaturas);
  };

  checkAsigSeleccionada(); // Comprobación inicial

  // Si hace click en una fila de la tabla de disponibles
  $('tr.dispTableRow').click(function () {
    const id = $(this).attr('id').slice(4);
    const codigo = $(`#selec${id} .codigo`).text();
    asignaturasSelec.push(codigo); // Añade el código al array
    $(this).fadeOut('slow', () => {
      $(`#selec${id}`).fadeIn('slow');
    });
    checkAsigSeleccionada();
  });

  // Función auxiliar para buscar y quitar el codigo de la asignatura
  // del array que guarda la selección.
  const removeCode = (codigo) => {
    for (let i = asignaturasSelec.length - 1; i >= 0; i--) {
      if (asignaturasSelec[i] === codigo) {
        asignaturasSelec.splice(i, 1);
        break; // No hay duplicados, para cuando quite el primero
      }
    }
  };

  // Si hace click en una fila de la tabla de seleccionadas
  $('tr.selecTableRow').click(function () {
    const id = $(this).attr('id').slice(5);
    const codigo = $(`#selec${id} .codigo`).text();
    removeCode(codigo);
    $(this).fadeOut('slow', () => {
      $(`#disp${id}`).fadeIn('slow');
    });
    checkAsigSeleccionada();
  });

  // Si hace click en el boton de borrar todo
  $('#deleteAll').click(() => {
    asignaturasSelec = []; // Se vacía la selección
    $('tr.selecTableRow').fadeOut('fast', () => { // Se ocultan todas
      $('tr.dispTableRow').fadeIn('slow'); // Se muestran todas
    });
    checkAsigSeleccionada();
  });

  // Cambiamos el valor del input antes de enviar el formulario
  $('#asigForm').submit(() => {
    $('input[name=asigSelec]').val(JSON.stringify(asignaturasSelec));
  });
});
