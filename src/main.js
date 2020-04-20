import Vue from 'vue'
import 'normalize.css/normalize.css' // 初始化css样式
import '@/styles/index.scss' // 引入公共样式

import 'amfe-flexible'

import './plugins/vant' // 引入vant
import '@/icons'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/permission' // 鉴权

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
