import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './app/App.vue'
import router from './app/router'
import { store } from './app/store'
import { initializeAppState } from './app/bootstrap/initialize-app-state'
import { hasStorageConsent } from './shared/privacy/consent'
import './assets/css/tailwind.css'; // Import Tailwind CSS
import Toast, { POSITION } from 'vue-toastification';
import "vue-toastification/dist/index.css";

initializeAppState(store);
if (hasStorageConsent()) import('./app/register-service-worker');

createApp(App).use(store).use(router).use(Toast, {
    position: POSITION.TOP_CENTER,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
}).mount('#app')
