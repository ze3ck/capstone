// Importa la app principal
import { createApp } from "vue"; // Importa createApp para Vue 3
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";

// Importa el archivo de rutas
import routes from "./routes";

// Importa SweetAlert2 para estilos de alertas
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Importa Vuetify y Material Design Icons
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Importar Echarts para gráficos
import * as echarts from 'echarts';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Configura Vuetify
const vuetify = createVuetify({
  components,
  directives,
  ssr: false, // Usa 'false' si no estás usando SSR (Server-Side Rendering)
});

// Configura el enrutador
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

library.add(faArrowLeft, faArrowRight);

// Crea la app Vue
const app = createApp(App);

// Usa los plugins con Vue 3
app.use(router);
app.use(VueSweetalert2);
app.use(vuetify);
app.component('font-awesome-icon', FontAwesomeIcon);
// Si CanvasJSChart es un componente, regístralo globalmente

// Monta la app
app.mount("#app");

export {echarts}
