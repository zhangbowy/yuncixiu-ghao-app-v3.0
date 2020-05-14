const state = {
  goodsInfo: localStorage.getItem('design_goods_info')
}

const mutations = {
  RESET_STATE: (state) => {
    state.goodsInfo = []
  },
  SET_DATA: (state, data) => {
    state.goodsInfo = data
  }
}
const actions = {
  setGoodsInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('design_goods_info', data)
      commit('SET_DATA', data)
      resolve()
    })
  },

  // 重置state
  resetState({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem('design_goods_info')
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

