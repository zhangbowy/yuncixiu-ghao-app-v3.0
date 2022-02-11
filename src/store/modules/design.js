import { js_getDPI } from "@/utils"

const state = {
  // goodsInfo: localStorage.getItem('design_goods_info')
  goodsInfo: JSON.stringify([
    {
      buy_num: 1,
      item_id: 100,
      shopping_type: 2,
      sku_id: 'qnlgkkmf9o00_id-peth0svajnc0_id_jcr3at6cmf40_id-lc3iko62alg0_id'
    }
  ])
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

