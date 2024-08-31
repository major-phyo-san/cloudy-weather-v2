import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/tailwind.css'; // Import Tailwind CSS

createApp(App).use(store).use(router).mount('#app')
