  
import LoginForm from "@/pages/LoginPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import UserPage from "@/pages/UserPage.vue";
import ProductPage from "./pages/ProductPage.vue";


const routes = [
    { path: "/", component: LoginForm },
    { path: "/dashboard", component: DashboardPage },
    { path: "/user", component: UserPage },
    { path: "/product", component: ProductPage },
  ];
export default routes;