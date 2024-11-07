$(document).ready(function () {
  // $("#mostrar-modal").on("click", function () {
  //   $(".ui.modal").modal("show");
  // });
  $("#show-legend-modal").on("click", function () {
    $(".ui.small.modal").modal("show");
  });
  $(".ui.dropdown").dropdown();
});

// $(document).ready(function() {
//   // Inicializar el gráfico solo después de que todo esté listo
//   var options = {
//     series: [25, 25, 25, 25],
//     chart: {
//       width: '100%',
//       type: 'pie',
//       background: '#2e2e2e'
//     },
//     labels: ['Sobre Stock', 'Bien', 'Mínimo', 'Crítico'],
//     colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
//     legend: {
//       position: 'bottom',
//     }
//   }});

//   var chart = new ApexCharts(document.querySelector("#chart"), options);
//   chart.render();
