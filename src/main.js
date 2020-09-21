import Vue from 'vue'
import 'normalize.css/normalize.css' // 初始化css样式
import '@/styles/index.scss' // 引入公共样式

import 'amfe-flexible'
import './plugins/vant' // 引入vant
import '@/icons'
import App from './App.vue'
import router from './router'
import store from './store'
import vueEsign from 'vue-esign'
import '@/permission' // 鉴权
import VueSignaturePad from '@/components/VueSign/vue-signature-pad.esm'

Vue.use(VueSignaturePad)
// main.js
import Directive from './directive'
// 使用插件
Vue.use(Directive)
Vue.use(vueEsign)
// 国际化
import VueI18n from 'vue-i18n'
import { Locale } from 'vant'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enUS from 'vant/lib/locale/lang/en-US'

Vue.use(VueI18n)
const lang = localStorage.getItem('lang') || 'zh'
let enLang = localStorage.getItem('en')
let zhLang = localStorage.getItem('cn')
zhLang = zhLang && JSON.parse(zhLang)
enLang = enLang && JSON.parse(enLang)
store.dispatch('settings/changeSetting', { key: 'lang', value: lang })

Locale.use(lang, lang === 'zh' ? zhCN : enUS)
const i18n = new VueI18n({
  locale: lang,
  messages: {
    'zh': Object.assign(require('./lang/zh.json'), enLang, zhCN),
    'en': Object.assign(require('./lang/en.json'), zhLang, enUS)
  },
  silentFallbackWarn: true
})

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
