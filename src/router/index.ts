import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
      path: '/',
      component: HomeView,
    },
    {
      path: '/pokedex',
      component: () => import('@/views/PokedexView.vue'),
    },
    {
      path: '/favorite',
      component: () => import('@/views/FavoriteView.vue'),
    },
    {
      path: '/pokematch',
      component: () => import('@/views/PokeMatchView.vue'),
    },
  ],
})

export default router
