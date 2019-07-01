/* eslint-disable func-names */


/**
 * Hace que las tablas de asignaturas sea dinámicas, quitando la
 * asignatura sobre la que se hace click de una tabla y añadiédola a la otra.
 *
 * Recoge la selección del usuario (un JSON con las asignaturas elegidas)
 * para posteriormente enviársela al servidor mediante una petición POST.
 *
 * Comprueba que al menos hay una asignatura seleccionada antes de confirmar.
 *
 * Actualiza la lista de detalles de la barra lateral.
 *
 */
$(document).ready(() => {
  // Array con los codigos de las asignaturas seleccionadas que se envían en el formulario
  let asignaturasSelec = [];

  // Variables para los detalles de la barra lateral
  let cursos = {
    1: 0, 2: 0, 3: 0, 4: 0, // Número de asignaturas de cada curso
  };
  let acronimos = [];
  let totalCreditos = 0;

  // Función que comprueba que al menos hay una asignatura seleccionada.
  // Desactiva el botón para continuar en caso de que no haya ninguna.
  const checkAsigSeleccionada = () => {
    const emptyAsignaturas = asignaturasSelec.length === 0; // check if at least one checked
    $('#confirmar').prop('disabled', emptyAsignaturas);
  };

  // Función auxiliar para buscar y quitar un elemento de un array
  const removeFromArray = (array, elem) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] === elem) {
        array.splice(i, 1);
        break; // No hay duplicados, para cuando quite el primero
      }
    }
  };

  // Función que actualiza la lista de detalles de la barra lateral
  const updateDetails = () => {
    const cursosSelec = [];
    Object.keys(cursos).forEach((curso) => {
      const nAsigCurso = cursos[curso];
      if (nAsigCurso > 0) {
        cursosSelec.push(curso);
      }
    });
    let listaCursos = '';
    if (acronimos.length > 0) {
      listaCursos = cursosSelec.reduce((acc, cur) => `${acc}º, ${cur}º`);
    }


    let listaAsig = '';
    if (acronimos.length > 0) {
      listaAsig = acronimos.reduce((acc, asig) => `${acc}, ${asig}`);
    }

    $('#dtl-cursos').text(listaCursos);
    $('#dtl-listaAsig').text(listaAsig);
    $('#dtl-creditos').text(totalCreditos);
  };

  checkAsigSeleccionada(); // Comprobación inicial

  // Si hace click en una fila de la tabla de disponibles
  $('tr.dispTableRow').click(function () {
    const id = $(this).attr('id').slice(4);
    const codigo = $(`#selec${id} .codigo`).text();
    const curso = $(`#selec${id} .curso`).text();
    const acronimo = $(`#selec${id} .acronimo`).text();
    const creditos = $(`#selec${id} .creditos`).text();

    asignaturasSelec.push(codigo); // Añade el código al array

    $(this).fadeOut('slow', () => { // Desaparece de disponibles
      $(`#selec${id}`).fadeIn('slow'); // Aparece en seleccionadas
    });

    cursos[curso] += 1; // Sumamos una asignatura de ese curso
    acronimos.push(acronimo);
    totalCreditos += parseFloat(creditos);

    checkAsigSeleccionada();
    updateDetails();
  });

  // Si hace click en una fila de la tabla de seleccionadas
  $('tr.selecTableRow').click(function () {
    const id = $(this).attr('id').slice(5);
    const codigo = $(`#selec${id} .codigo`).text();
    const curso = $(`#selec${id} .curso`).text();
    const acronimo = $(`#selec${id} .acronimo`).text();
    const creditos = $(`#selec${id} .creditos`).text();

    removeFromArray(asignaturasSelec, codigo); // Quita el código del array

    $(this).fadeOut('slow', () => { // Desaparece de seleccionadas
      $(`#disp${id}`).fadeIn('slow'); // Aparece en disponibles
    });

    cursos[curso] -= 1; // Restamos una asignatura de ese curso
    removeFromArray(acronimos, acronimo);
    totalCreditos -= parseFloat(creditos);

    checkAsigSeleccionada();
    updateDetails();
  });

  // Si hace click en el boton de borrar todo
  $('#deleteAll').click(() => {
    asignaturasSelec = []; // Se vacía la selección

    $('tr.selecTableRow').fadeOut('fast', () => { // Se ocultan todas
      $('tr.dispTableRow').fadeIn('slow'); // Se muestran todas
    });

    // Valores inciales
    cursos = {
      1: 0, 2: 0, 3: 0, 4: 0,
    };
    acronimos = [];
    totalCreditos = 0;

    checkAsigSeleccionada();
    updateDetails();
  });

  // Cambiamos el valor del input antes de enviar el formulario
  $('#asigForm').submit(() => {
    $('input[name=asigSelec]').val(JSON.stringify(asignaturasSelec));

    const asignaturas = $('#dtl-listaAsig').text();
    const creditos = $('#dtl-creditos').text();
    const detalles = { asignaturas, creditos };
    $('input[name=detalles]').val(JSON.stringify(detalles));
  });
});
