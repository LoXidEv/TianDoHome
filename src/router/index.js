import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Contact from '@/views/Contact.vue'
import About from '@/views/About.vue'
import Friend from '@/views/Friend.vue'
import Donate from '@/views/Donate.vue'
import { i18n } from '@/i18n/i18n'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/donate',
      name: 'donate',
      component: Donate
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/friend',
      name: 'friend',
      component: Friend
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to) => {
  document.title = i18n.global.t('website.title')
})

export default router
