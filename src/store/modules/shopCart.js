
const getDefaultState = () => {
  return {
    cartList: localStorage.getItem('cart_list') ? JSON.parse(localStorage.getItem('cart_list')) : [] // 从缓存中回去cart_list
  }
}
const state = getDefaultState()

const mutations = {
  RESET_CART: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_CART_LIST: (state, data) => {
    state.cartList = data
  }
}

const actions = {
  setCartList({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      const cartList = state.cartList
      cartList.push(data)
      commit('SET_CART_LIST', cartList)
      localStorage.setItem('cart_list', JSON.stringify(cartList)) // 向缓存中设置
      resolve()
    })
  },
  updatedCartList({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      commit('SET_CART_LIST', data)
      localStorage.setItem('cart_list', JSON.stringify(data)) // 向缓存中设置
      resolve()
    })
  },
  removeCartList({ commit }, item) {
    return new Promise((resolve, reject) => {
      commit('SET_CART_LIST', '')
      localStorage.removeItem('cart_list') // 移除缓存中的cartlist
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

