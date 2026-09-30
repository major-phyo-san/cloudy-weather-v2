import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import HomePage from '@/features/weather/pages/HomePage.vue';
import SettingsPage from '@/features/settings/pages/SettingsPage.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'HomePage', component: HomePage },
      { path: 'settings', name: 'SettingsPage', component: SettingsPage },
      { path: 'cities', name: 'CitiesPage', component: () => import('@/features/cities/pages/CitiesPage.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
