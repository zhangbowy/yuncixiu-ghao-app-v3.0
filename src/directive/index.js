// src/directive/index.js
import Loading from './loading'
export default {
  install(Vue) {
    Vue.directive('loading', Loading)
  }
}
