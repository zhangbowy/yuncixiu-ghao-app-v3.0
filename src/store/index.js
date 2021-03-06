import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import settings from './modules/settings'
import user from './modules/user'
import shopCart from './modules/shopCart'
import order from './modules/order'
import design from './modules/design'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    settings,
    user,
    shopCart,
    order,
    design
  },
  getters
})

export default store
