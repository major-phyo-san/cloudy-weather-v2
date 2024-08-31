import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../views/layouts/DefaultLayout.vue'
// import HomeView from '../views/HomeView.vue'
import HomePage from '@/views/HomePage.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'HomePage',
        component: HomePage
      },
      // {
      //   path: 'about',
      //   name: 'About',
      //   component: About
      // },
      // {
      //   path: 'weather',
      //   name: 'Weather',
      //   component: Weather
      // },
      // {
      //   path: 'profile',
      //   name: 'Profile',
      //   component: Profile
      // }
    ]
  },

  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
