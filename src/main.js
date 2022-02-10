import Vue from 'vue'
import 'normalize.css/normalize.css' // 初始化css样式
import '@/styles/index.scss' // 引入公共样式

import 'amfe-flexible'
import './plugins/vant' // 引入vant
import '@/icons'
import App from './App.vue'
import i18n from './plugins/i18n'
import router from './router'
import store from './store'
import vueEsign from 'vue-esign'
import '@/permission' // 鉴权
import VueSignaturePad from '@/components/VueSign/vue-signature-pad.esm'
import { Skeleton } from 'vant'
import { Popover } from 'vant'
Vue.use(Popover)
Vue.use(Skeleton)
Vue.use(VueSignaturePad)
// main.js
import Directive from './directive'
// 使用插件
Vue.use(Directive)
Vue.use(vueEsign)

// 设置语言
const lang = localStorage.getItem('lang') || 'zh'
store.dispatch('settings/changeSetting', { key: 'lang', value: lang })

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
