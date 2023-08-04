import { createRouter, createWebHistory } from 'vue-router'

const constantRoutes = [
  {
    path: '/',
    name: 'index',
    component:()=>import('../layout/index.vue'),
    meta:{
      keepAlive:false
    }
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})
export default router
