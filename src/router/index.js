import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const constantRoutes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/index'),
    meta: { title: '首页', icon: 'home', showTabbar: true }
  }, {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/index.vue'),
    meta: { title: '个人中心', icon: 'user', showTabbar: true }
  }, {
    path: '/cart',
    name: 'ShopCart',
    component: () => import('@/views/shopCart/index.vue'),
    meta: { title: '购物车', icon: 'cart', showTabbar: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/authorize/login/login.vue'),
    meta: { title: '用户登录', icon: 'login' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/authorize/register/index.vue'),
    meta: { title: '用户注册', icon: 'register' }
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: () => import('@/views/goodsDetail/index.vue'),
    meta: { title: '商品详情' }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404页面
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
