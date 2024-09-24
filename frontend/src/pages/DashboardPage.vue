<template>
  <SidebarComp />
  <div class="background">
    <section id="charts">
      <!-- Contenedor del primer gráfico (Línea) -->
      <div ref="lineChart" class="chart-container"></div>
      <!-- Contenedor del segundo gráfico (Pastel) -->
      <div ref="pieChart" class="chart-container"></div>
    </section>
  </div>
</template>

<script>
import SidebarComp from '@/components/SidebarComp.vue';
import * as echarts from 'echarts';

export default {
  name: "DashboardPage",

  components: {
    SidebarComp,
  },

  mounted() {
    // Inicializar el gráfico de líneas
    const lineChartDom = this.$refs.lineChart;
    const lineChart = echarts.init(lineChartDom);

    const lineChartOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };

    lineChart.setOption(lineChartOption);

    // Inicializar el gráfico de pastel
    const pieChartDom = this.$refs.pieChart;
    const pieChart = echarts.init(pieChartDom);

    const weatherIcons = {
      Sunny: 'path_to_sunny_icon.png', // Asegúrate de usar rutas válidas
      Cloudy: 'path_to_cloudy_icon.png',
      Showers: 'path_to_showers_icon.png'
    };

    const pieChartOption = {
      title: {
        text: 'Weather Statistics',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['CityA', 'CityB', 'CityC', 'CityD', 'CityE']
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [
            {
              value: 1548,
              name: 'CityE',
              label: {
                formatter: [
                  '{title|{b}}{abg|}',
                  '  {weatherHead|Weather}{valueHead|Days}{rateHead|Percent}',
                  '{hr|}',
                  '  {Sunny|}{value|202}{rate|55.3%}',
                  '  {Cloudy|}{value|142}{rate|38.9%}',
                  '  {Showers|}{value|21}{rate|5.8%}'
                ].join('\n'),
                backgroundColor: '#eee',
                borderColor: '#777',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  title: {
                    color: '#eee',
                    align: 'center'
                  },
                  abg: {
                    backgroundColor: '#333',
                    width: '100%',
                    align: 'right',
                    height: 25,
                    borderRadius: [4, 4, 0, 0]
                  },
                  Sunny: {
                    height: 30,
                    align: 'left',
                    backgroundColor: {
                      image: weatherIcons.Sunny
                    }
                  },
                  Cloudy: {
                    height: 30,
                    align: 'left',
                    backgroundColor: {
                      image: weatherIcons.Cloudy
                    }
                  },
                  Showers: {
                    height: 30,
                    align: 'left',
                    backgroundColor: {
                      image: weatherIcons.Showers
                    }
                  },
                  weatherHead: {
                    color: '#333',
                    height: 24,
                    align: 'left'
                  },
                  hr: {
                    borderColor: '#777',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  value: {
                    width: 20,
                    padding: [0, 20, 0, 30],
                    align: 'left'
                  },
                  valueHead: {
                    color: '#333',
                    width: 20,
                    padding: [0, 20, 0, 30],
                    align: 'center'
                  },
                  rate: {
                    width: 40,
                    align: 'right',
                    padding: [0, 10, 0, 0]
                  },
                  rateHead: {
                    color: '#333',
                    width: 40,
                    align: 'center',
                    padding: [0, 10, 0, 0]
                  }
                }
              }
            },
            { value: 735, name: 'CityC' },
            { value: 510, name: 'CityD' },
            { value: 434, name: 'CityB' },
            { value: 335, name: 'CityA' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    pieChart.setOption(pieChartOption);
  }
};
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #141e30, #243b55);
  z-index: -1;
}

#charts {
  display: flex;
  /* Utiliza Flexbox para colocar los gráficos en una fila */
  justify-content: center;
  /* Centra los gráficos horizontalmente */
  align-items: center;
  /* Alinea los gráficos verticalmente */
  gap: 20px;
  /* Espacio entre los gráficos */
}

.chart-container {
  width: 40%;
  height: 500px;
  /* Ajusta la altura del gráfico */
  padding: 20px;
  /* Espacio interno */
}
</style>