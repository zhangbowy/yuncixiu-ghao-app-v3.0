import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const constantRoutes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/index'),
    meta: { title: '首页', showTabbar: true }
  }, {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/index'),
    meta: { title: '个人中心', showTabbar: true }
  }, {
    path: '/classify',
    name: 'Classify',
    component: () => import('@/views/classification/index'),
    meta: { title: '分类', showTabbar: true }
  }, {
    path: '/cart',
    name: 'ShopCart',
    component: () => import('@/views/shopCart/index'),
    meta: { title: '购物车' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/authorize/login/login'),
    meta: { title: '用户登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/authorize/register/index'),
    meta: { title: '用户注册', icon: 'register' }
  },
  {
    path: '/goodsList',
    name: 'GoodsList',
    component: () => import('@/views/goods/goodsList/index'),
    meta: { title: '商品列表', showTabbar: true }
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: () => import('@/views/goods/goodsDetail/index'),
    meta: { title: '商品详情' }
  },
  {
    path: '/orderConfirm',
    name: 'OrderConfirm',
    component: () => import('@/views/orderManage/orderConfirm'),
    meta: { title: '确认订单' }
  },
  {
    path: '/orderList',
    name: 'OrderList',
    component: () => import('@/views/orderManage/orderList'),
    meta: { title: '订单列表' }
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: () => import('@/views/orderManage/orderDetail'),
    meta: { title: '订单详情' }
  },
  {
    path: '/orderTrace',
    name: 'OrderTrace',
    component: () => import('@/views/orderManage/orderTrace'),
    meta: { title: '物流详情' }
  },
  {
    path: '/addressList',
    name: 'AddressList',
    component: () => import('@/views/address/addressList/index'),
    meta: { title: '地址列表' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/article/detail/about'),
    meta: { title: '' }
  }, {
    path: '/authorize',
    name: 'Authorize',
    component: () => import('@/views/authorize/login/authorize'),
    meta: { title: '用户授权' }
  }, {
    path: '/customized',
    name: 'Customized',
    component: () => import('@/views/customized'),
    meta: { title: '开始设计' },
    children: [{
      path: 'commonly',
      name: 'Commonly',
      component: () => import('@/views/customized/commonly'),
      meta: { title: '一般定制' }
    },
    {
      path: 'special',
      name: 'Special',
      component: () => import('@/views/customized/special'),
      meta: { title: '特殊定制' }
    },
    {
      path: 'handDrawn',
      name: 'HandDrawn',
      component: () => import('@/views/customized/handDrawn'),
      meta: { title: '手绘' }
    }]
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
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
