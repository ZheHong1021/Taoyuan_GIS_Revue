import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bus',
    name: 'BusView',
    component: () => import(/* webpackChunkName: "about" */ '../views/BusView.vue')
  },
  {
    path: '/thsr',
    name: 'ThsrView',
    component: () => import(/* webpackChunkName: "about" */ '../views/ThsrView.vue')
  },
  {
    path: '/train',
    name: 'TrainView',
    component: () => import(/* webpackChunkName: "about" */ '../views/TrainView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
