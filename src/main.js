import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/tailwind.css'; // Import Tailwind CSS
import Toast, { POSITION } from 'vue-toastification';
import "vue-toastification/dist/index.css";

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
