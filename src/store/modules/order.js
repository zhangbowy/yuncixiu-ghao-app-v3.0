const state = {
  cartList: localStorage.getItem('order_cart_list')
}

const mutations = {
  RESET_STATE: (state) => {
    state.cartList = []
  },
  SET_DATA: (state, data) => {
    state.cartList = data
  }
}
const actions = {
  setCartList({ commit }, data) {
    return new Promise((resolve, reject) => {
      // const dataList = JSON.parse(data)
      localStorage.setItem('order_cart_list', data)
      commit('SET_DATA', data)
      resolve()
    })
  },

  // 重置state
  resetState({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem('order_cart_list')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

