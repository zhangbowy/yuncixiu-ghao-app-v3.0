import VueI18n from 'vue-i18n'
import Vue from 'vue'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enUS from 'vant/lib/locale/lang/en-US'
import { Locale } from 'vant'
// 国际化
Vue.use(VueI18n)
let enLang = localStorage.getItem('en')
let zhLang = localStorage.getItem('cn')
zhLang = zhLang && JSON.parse(zhLang)
enLang = enLang && JSON.parse(enLang)
const lang = localStorage.getItem('lang') || 'zh'
// store.dispatch('settings/changeSetting', { key: 'lang', value: lang })
Locale.use(lang, lang === 'zh' ? zhCN : enUS)
const i18n = new VueI18n({
  locale: lang,
  messages: {
    'zh': Object.assign(require('../lang/zh.json'), zhLang, zhCN),
    'en': Object.assign(require('../lang/en.json'), enLang, enUS)
  },
  silentFallbackWarn: true
})

export default i18n
