//se monta la app
import App from './App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

//SweetAlert para estilos de alertas

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


//componentes
import LoginForm from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'

const routes = [
  {
    path: '/', component: LoginForm
  },
  {
    path: '/dashboard', component: DashboardPage,
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)

app.use(router);
app.use(VueSweetalert2);
app.mount('#app')