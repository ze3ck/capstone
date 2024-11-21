import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
    const idUsuario = document.getElementById("idUsuario");
    if (!idUsuario) {
        console.error("El elemento ID_USUARIO no está disponible en el DOM.");
        return;
    }

    const idUsuarioValue = idUsuario.textContent.trim();
    if (!idUsuarioValue) {
        console.error("El valor del ID de usuario no está definido.");
        return;
    }

    fetch(`${API_BASE_URL}reportes/reporteMovimientos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            P_IDUSUARIO: idUsuarioValue,
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error en el servidor: " + response.statusText);
            return response.json();
        })
        .then((data) => {
            if (!data.success || !data.response) {
                console.warn("Datos vacíos o inválidos recibidos del servidor.");
                return;
            }

            // Agrupar productos por estado para el gráfico de dona
            const estadoCounts = data.response.reduce((acc, item) => {
                acc[item.ESTADO] = (acc[item.ESTADO] || 0) + 1;
                return acc;
            }, {});

            const labelsEstado = Object.keys(estadoCounts);
            const seriesEstado = Object.values(estadoCounts);

            // Renderizar gráfico de dona (Movimientos Totales)
            const optionsTotal = {
                chart: {
                    type: "donut",
                    height: 400,
                },
                series: seriesEstado,
                labels: labelsEstado,
                responsive: [
                    {
                        breakpoint: 768,
                        options: {
                            chart: {
                                width: "100%",
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            };

            const totalChartElement = document.querySelector("#totalMovimientoChart");
            if (totalChartElement) {
                const totalChart = new ApexCharts(totalChartElement, optionsTotal);
                totalChart.render();
            }

            // Inicialización del gráfico
            const topProductosChartElement = document.querySelector("#topProductosMovimientoChart");
            let topProductosChart = null;

            // Ordenar productos por NUM_MOVIMIENTOS y seleccionar los 10 primeros
            const topProductos = data.response
                .sort((a, b) => b.NUM_MOVIMIENTOS - a.NUM_MOVIMIENTOS)
                .slice(0, 10);
                function renderTopProductosChart(dataToDisplay) {
                    const labelsProductos = dataToDisplay.map((item) => item.NOMBRE_PRODUCTO);
                    const seriesProductos = dataToDisplay.map((item) => parseFloat(item.NUM_MOVIMIENTOS) || 0);
    
                    const optionsTopProductos = {
                        chart: {
                            type: "bar",
                            height: 400,
                            toolbar: {
                                show: true
                            },
                        },
                        series: [
                            {
                                name: "Movimientos",
                                data: seriesProductos,
                            },
                        ],
                        xaxis: {
                            categories: labelsProductos,
                            labels: {
                                style: {
                                    colors: "#FFFFFF",
                                    fontSize: "12px",
                                    fontFamily: "Arial, sans-serif",
                                },
                            },
                        },
                        colors: [
                            "#1E90FF",
                            "#FFD700",
                            "#FF6347",
                            "#32CD32",
                            "#FF69B4",
                            "#FFA07A",
                            "#20B2AA",
                            "#9370DB",
                            "#FF4500",
                            "#2E8B57",
                        ],
                        plotOptions: {
                            bar: {
                                distributed: true,
                                horizontal: false,
                            },
                        },
                        states: {
                            hover: {
                                filter: {
                                    type: "darken",
                                    value: 0.7,
                                },
                            },
                        },
                        tooltip: {
                            theme: "dark",
                            y: {
                                formatter: function (val) {
                                    return `${val} movimientos`;
                                },
                            },
                        },
                        responsive: [
                            {
                                breakpoint: 768,
                                options: {
                                    chart: {
                                        width: "100%",
                                    },
                                    legend: {
                                        position: "bottom",
                                    },
                                },
                            },
                        ],
                    };
    
                    if (topProductosChartElement) {
                        if (topProductosChart) {
                            // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
                            topProductosChart.destroy();
                        }
                        topProductosChart = new ApexCharts(topProductosChartElement, optionsTopProductos);
                        topProductosChart.render();
                    }
                }

            function updateChartBasedOnSwitch() {
                const toggleSwitch = document.getElementById("toggleSwitch");
                if (toggleSwitch.checked) {
                    // Mostrar los 10 productos con menos movimientos
                    const bottomProductos = data.response
                        .sort((a, b) => a.NUM_MOVIMIENTOS - b.NUM_MOVIMIENTOS)
                        .slice(0, 10);
                    renderTopProductosChart(bottomProductos);
                } else {
                    // Mostrar los 10 productos con más movimientos
                    const topProductos = data.response
                        .sort((a, b) => b.NUM_MOVIMIENTOS - a.NUM_MOVIMIENTOS)
                        .slice(0, 10);
                    renderTopProductosChart(topProductos);
                }
            }

            // Inicializar gráfico con los 10 productos con más movimientos
            updateChartBasedOnSwitch();

            // Agregar evento al switch
            const toggleSwitch = document.getElementById("toggleSwitch");
            toggleSwitch.addEventListener("change", updateChartBasedOnSwitch);
        })
        .catch((error) => {
            console.error("Error al cargar datos:", error);
        });
});
