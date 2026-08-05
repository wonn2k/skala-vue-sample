import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/Weather/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: WeatherHomeView,
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Weather/WeatherAboutView.vue'),
    },
    {
      path: '/weather/:cityID',
      name: 'WeatherDetail',
      component: () => import('../views/Weather/WeatherDetailView.vue'),
    },
    {
      path: '/globe',
      name: 'GlobeWeather',
      component: () => import('../components/exercise/globe/GlobeWeatherPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
