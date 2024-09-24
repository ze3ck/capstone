<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer class="glass-container" v-model="expanded" app permanent disable-resize-watcher
        :mini-variant="!expanded" mini-variant-width="56">
        <v-list v-if="expanded">
          <v-list-item subtitle="sandra_a88@gmail.com" title="Sandra Adams"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-package-variant" title="Productos"></v-list-item>
            </template>
            <template>

            </template>
            <v-list-item title="Listar Productos" @click="navigateTo('/product')"></v-list-item>
            <v-list-item title="Sub-item 2 de Productos"></v-list-item>
          </v-list-group>

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-account-cash" title="Cuentas"></v-list-item>
            </template>
            <v-list-item title="Sub-item 1 de Cuentas"></v-list-item>
            <v-list-item title="Sub-item 2 de Cuentas"></v-list-item>
          </v-list-group>

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-truck" title="Proveedores"></v-list-item>
            </template>
            <v-list-item title="Sub-item 1 de Proveedores"></v-list-item>
            <v-list-item title="Sub-item 2 de Proveedores"></v-list-item>
          </v-list-group>

          <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
          <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-btn icon @click="toggleSidebar" class="expand-btn" color="primary"
        :style="{ left: expanded ? '220px' : '40px' }">
        <font-awesome-icon :icon="expanded ? 'arrow-left' : 'arrow-right'" />
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    expanded: true,
  }),
  methods: {
    toggleSidebar() {
      this.expanded = !this.expanded;
    },
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
.background {
  background: linear-gradient(135deg, #141e30, #243b55);
}

.expand-btn {
  position: fixed;
  bottom: 20px;
  z-index: 10000;
  transition: left 0.3s ease;
}

.glass-container {
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white;
}

h1 {
  color: red;
}
</style>