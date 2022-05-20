import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/tabbar/Home'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: '/pledge',
        name: 'Pledge',
        component: () => import('@/views/tabbar/Pledge'),
        meta: { title: '质押', keepAlive: false }
      },
      {
        path: '/nft',
        name: 'NFT',
        component: () => import('@/views/tabbar/NFT'),
        meta: { title: '市场', keepAlive: false }
      },
      {
        path: '/dao',
        name: 'Dao',
        component: () => import('@/views/tabbar/Dao'),
        meta: { title: '关于我', keepAlive: false }
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
