<template>
    <SidebarComp />
    <div class="background">

        <v-container class="py-5">
            <v-row justify="center">
                <v-col cols="12" md="10" lg="8">
                    <!-- Encabezado de Perfil de Usuario -->
                    <v-card class='glass-containers'>
                        <v-card-title class="headline font-weight-bold">User Profile</v-card-title>
                        <v-divider></v-divider>

                        <!-- Sección de Información Básica -->
                        <v-card-text>
                            <h3 class="font-weight-bold mb-4">Basic Info</h3>
                            <v-row>
                                <!-- Imagen de perfil y nombre -->
                                <v-col cols="12" md="4" class="text-center">
                                    <h3 class="mt-3">{{ user.NOMBRE }} {{ user.APATERNO }} {{ user.AMATERNO }}</h3>
                                    <p class="grey--text">ID: {{ user.ID_USUARIO }}</p>
                                    <v-btn class="mt-2" color="primary" outlined>
                                        <v-icon left>mdi-lock</v-icon> Change Password
                                    </v-btn>
                                    <div class="text-center">
                                        <v-dialog v-model="dialog" max-width="1200" persistent >
                                            <template v-slot:activator="{ props: activatorProps }">
                                                <v-btn class="mt-2" color="primary" outlined v-bind="activatorProps">
                                                    <v-icon left>mdi-account</v-icon> Gestionar Usuario
                                                </v-btn>
                                            </template>

                                            <v-card prepend-icon="mdi-map-marker" title="Gestionar Usuarios" class="glass-containers">
                                                <v-table height="300px" class="glass-containers">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">
                                                                ID
                                                            </th>
                                                            <th class="text-left">
                                                                Nombre
                                                            </th>
                                                            <th class="text-left">
                                                                Apellido
                                                            </th>
                                                            <th class="text-left">
                                                                Rol
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{{ user.ID_USUARIO }}</td>
                                                            <td>{{ user.NOMBRE }}</td>
                                                            <td>{{ user.APATERNO }}</td>
                                                            <td> <v-select label="Status" :items="estados"
                                                                    v-model="user.ESTADO"></v-select></td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>
                                                <template v-slot:actions>
                                                    <v-spacer></v-spacer>

                                                    <v-btn @click="dialog = false" max-width="100">
                                                        Guardar
                                                    </v-btn>

                                                    <v-btn @click="dialog = false" max-width="100">
                                                        Cancelar
                                                    </v-btn>
                                                </template>
                                            </v-card>
                                        </v-dialog>
                                    </div>
                                </v-col>

                                <!-- Campos de Información Básica -->
                                <v-col cols="12" md="8">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="First Name" v-model="user.NOMBRE"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field class="label" label="Last Name"
                                                v-model="user.APATERNO"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="Mother's Last Name"
                                                v-model="user.AMATERNO"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-select label="Status" disabled
                                                :items="['ACTIVO', 'INACTIVO', 'BLOQUEADO']"
                                                v-model="user.ESTADO"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="Phone" v-model="user.TELEFONO"
                                                prepend-icon="mdi-phone"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="Email" v-model="user.EMAIL"
                                                prepend-icon="mdi-email"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <!-- Sección de Contactos -->
                        <v-card-text>
                            <h3 class="font-weight-bold mb-4">Contacts</h3>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-card class="pa-3 glass-containers">
                                        <v-icon left color="primary">mdi-email</v-icon>
                                        <span class="font-weight-bold">{{ user.EMAIL }}</span>
                                        <v-text-field label="Phone" v-model="user.TELEFONO" class="mt-4"></v-text-field>
                                        <v-text-field label="Email" v-model="user.EMAIL"></v-text-field>
                                    </v-card>
                                </v-col>

                                <!-- Sección de Dirección -->
                                <v-col cols="12" md="6">
                                    <v-card class="pa-3 glass-containers">
                                        <v-icon left color="primary">mdi-map-marker</v-icon>
                                        <span class="font-weight-bold">{{ user.DIRECCION }}</span>
                                        <v-text-field label="Country" v-model="user.COUNTRY"
                                            class="mt-4"></v-text-field>
                                        <v-text-field label="City" v-model="user.CITY"></v-text-field>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import SidebarComp from '@/components/SidebarComp.vue';

export default {
    name: 'UserProfile',
    components: {
        SidebarComp
    },
    data() {
        return {
            dialog: false,
            user: {
                ID_USUARIO: 22,
                NOMBRE: 'Amelia',
                APATERNO: 'Harper',
                AMATERNO: 'Smith',
                NOMBRE_USUARIO: 'ameliah',
                EMAIL: 'ameliah@dx-email.com',
                CONTRASENIA: '********',
                TELEFONO: '+1(213)555-4276',
                CREADO_EN: '2024-01-01 12:00:00',
                ACTUALIZADO_EN: '2024-09-01 12:00:00',
                ESTADO: 'ACTIVO',  // Cambiar a un solo estado seleccionado
            },
            estados: ['ACTIVO', 'INACTIVO', 'BLOQUEADO'],  // Lista de estados
        };
    },
};
</script>

<style scoped>
.headline {
    font-size: 1.5rem;
    font-weight: bold;
}

.v-card-title {
    text-align: center;
}

.v-btn {
    width: 100%;
}

.font-weight-bold {
    font-weight: bold;
}

.background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #141e30, #243b55);
    z-index: -1;
}

.glass-containers {
    border-radius: 15px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
}
</style>