$(document).ready(function () {
  // Inicializar el sidebar con la transición 'push'
  $('.ui.sidebar').sidebar({
    transition: 'push',
    onVisible: function () {
      console.log("Sidebar visible");
    },
    onHide: function () {
      console.log("Sidebar hidden");
    }
  });

  // Inicializar el toggle del sidebar
  $('#menu-toggle').on('click', function () {
    $('.ui.sidebar').sidebar('toggle');
  });

  // Inicializar el acordeón dentro del sidebar
  $('.ui.accordion').accordion({
    exclusive: false
  });

});

