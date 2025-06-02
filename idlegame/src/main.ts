import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { i18nApplication } from './i18n/i18n';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
  .use(PrimeVue)
  .use(pinia)
  .use(i18nApplication)
  .use(router)
  .directive('tooltip', Tooltip)

app.mount('#app')
