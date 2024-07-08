import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { GridLayout, GridItem } from "grid-layout-plus";
import PrimeVue from "primevue/config";
import { definePreset } from "@primevue/themes";
import Aura from '@primevue/themes/aura';
import { Quasar } from "quasar";
import QCalendar from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                primary: {
                    color: '{zinc.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{zinc.900}',
                    activeColor: '{zinc.800}'
                },
                highlight: {
                    background: '{zinc.950}',
                    focusBackground: '{zinc.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                primary: {
                    color: '{zinc.50}',
                    inverseColor: '{zinc.950}',
                    hoverColor: '{zinc.100}',
                    activeColor: '{zinc.200}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

import Button from "primevue/button"
import Dialog from "primevue/dialog"
import Chart from "primevue/chart"
import Datatable from "primevue/datatable"
import Column from "primevue/column"
import Tooltip from 'primevue/tooltip';

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue as any, {
    theme: {
        preset: MyPreset,
        options: { darkModeSelector: '' }
    }
})
app.use(QCalendar as any)
app.use(Quasar, {
    config: {
        brand: {
            primary: '#1976d2',
            secondary: '#26A69A',
            accent: '#9C27B0',

            dark: '#1d1d1d',
            'dark-page': '#121212',

            positive: '#21BA45',
            negative: '#C10015',
            info: '#31CCEC',
            warning: '#F2C037'
        }
    }
})

app.component("PrimeButton", Button)
app.component("PrimeDialog", Dialog)
app.component("PrimeChart", Chart)
app.component("PrimeDatatable", Datatable)
app.component("PrimeColumn", Column)

app.directive('tooltip', Tooltip);

app.component("GridLayout", GridLayout);
app.component("GridItem", GridItem);

app.mount("#app");
