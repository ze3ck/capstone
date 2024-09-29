document.addEventListener("DOMContentLoaded", function () {
  // Gráfico de Columnas
  const optionsColumn = {
    container: document.getElementById("myChart"),
    data: [
      {
        label: "January",
        value: 50,
      },
      {
        label: "February",
        value: 70,
      },
      {
        label: "March",
        value: 30,
      },
      {
        label: "April",
        value: 90,
      },
      {
        label: "May",
        value: 60,
      },
    ],
    series: [
      {
        type: "column",
        xKey: "label",
        yKey: "value",
      },
    ],
  };

  agCharts.AgChart.create(optionsColumn);

  // Gráfico de Torta
  const optionsPie = {
    container: document.getElementById("myPieChart"),
    data: [
      {
        label: "Apple",
        value: 30,
      },
      {
        label: "Banana",
        value: 20,
      },
      {
        label: "Cherry",
        value: 50,
      },
    ],
    series: [
      {
        type: "pie",
        angleKey: "value",
        labelKey: "label",
        calloutLabel: {
          enabled: true,
        },
      },
    ],
  };

  agCharts.AgChart.create(optionsPie);
});
